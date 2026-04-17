import fs from "node:fs";
import path from "node:path";

import { CURRENT_STATE_DOC, TASK_LIST_DOC, calculateChecksum } from "./generate-state-docs.js";

const REQUIRED_SECTIONS = {
  [CURRENT_STATE_DOC]: ["## Current Focus Summary", "## Decision Required Summary", "## Decision Required Detail"],
  [TASK_LIST_DOC]: ["## Blocked / At Risk Summary", "## Blocked / At Risk Detail"]
};

export function validateGeneratedStateDocs({
  store,
  outputDir = process.cwd(),
  repoRoot = outputDir
}) {
  const findings = [];
  const currentStatePath = path.resolve(outputDir, CURRENT_STATE_DOC);
  const taskListPath = path.resolve(outputDir, TASK_LIST_DOC);

  const currentStateContent = readUtf8File(currentStatePath, findings);
  const taskListContent = readUtf8File(taskListPath, findings);

  if (currentStateContent != null) {
    validateRequiredSections(CURRENT_STATE_DOC, currentStateContent, findings);
    validateProjectionState(store, CURRENT_STATE_DOC, currentStateContent, findings);
    validateDecisionParity(store, currentStateContent, findings);
  }

  if (taskListContent != null) {
    validateRequiredSections(TASK_LIST_DOC, taskListContent, findings);
    validateProjectionState(store, TASK_LIST_DOC, taskListContent, findings);
    validateRiskParity(store, taskListContent, findings);
  }

  validateSourceRefs(store, repoRoot, findings);
  validateFreshness(store, findings);

  const blockingFindings = findings.filter((finding) => finding.severity === "error");
  const cutoverReady = blockingFindings.length === 0;

  if (!cutoverReady) {
    findings.push({
      code: "cutover_preflight_failed",
      severity: "error",
      message: "Cutover preflight failed because unresolved generated-doc findings remain."
    });
  }

  return {
    ok: blockingFindings.length === 0,
    cutoverReady,
    findings
  };
}

function readUtf8File(filePath, findings) {
  if (!fs.existsSync(filePath)) {
    findings.push({
      code: "generated_doc_missing",
      severity: "error",
      path: filePath,
      message: `Missing generated doc: ${path.basename(filePath)}`
    });
    return null;
  }

  const buffer = fs.readFileSync(filePath);
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    findings.push({
      code: "utf8_bom_detected",
      severity: "error",
      path: filePath,
      message: `${path.basename(filePath)} must be UTF-8 without BOM.`
    });
  }

  const content = buffer.toString("utf8");
  if (content.includes("\uFFFD")) {
    findings.push({
      code: "mojibake_detected",
      severity: "error",
      path: filePath,
      message: `${path.basename(filePath)} contains replacement characters that indicate mojibake.`
    });
  }

  return content;
}

function validateRequiredSections(projectionName, content, findings) {
  for (const section of REQUIRED_SECTIONS[projectionName] ?? []) {
    if (!content.includes(section)) {
      findings.push({
        code: "required_section_missing",
        severity: "error",
        projectionName,
        section,
        message: `${projectionName} is missing required section ${section}.`
      });
    }
  }
}

function validateProjectionState(store, projectionName, content, findings) {
  const projection = store.getGenerationState(projectionName);
  if (!projection) {
    findings.push({
      code: "generation_state_missing",
      severity: "error",
      projectionName,
      message: `${projectionName} has no generation_state row.`
    });
    return;
  }

  const checksum = calculateChecksum(content);
  if (projection.checksum !== checksum) {
    findings.push({
      code: "checksum_mismatch",
      severity: "error",
      projectionName,
      message: `${projectionName} checksum does not match generation_state.`
    });
  }
}

function validateDecisionParity(store, content, findings) {
  const openDecisions = store.listDecisions({ status: "open", decisionNeeded: true });
  const summaryCount = extractSummaryCount(content, "## Decision Required Summary");
  const detailCount = countTableRows(content, "## Decision Required Detail");

  if (summaryCount !== openDecisions.length) {
    findings.push({
      code: "generated_docs_parity_mismatch",
      severity: "error",
      projectionName: CURRENT_STATE_DOC,
      message: `Decision summary count ${summaryCount} does not match DB count ${openDecisions.length}.`
    });
  }

  if (summaryCount !== detailCount) {
    findings.push({
      code: "count_detail_parity_mismatch",
      severity: "error",
      projectionName: CURRENT_STATE_DOC,
      message: `Decision summary count ${summaryCount} does not match detail row count ${detailCount}.`
    });
  }
}

function validateRiskParity(store, content, findings) {
  const openRisks = store.listGateRisks({ status: "open" });
  const summaryCount = extractSummaryCount(content, "## Blocked / At Risk Summary");
  const detailCount = countTableRows(content, "## Blocked / At Risk Detail");

  if (summaryCount !== openRisks.length) {
    findings.push({
      code: "generated_docs_parity_mismatch",
      severity: "error",
      projectionName: TASK_LIST_DOC,
      message: `Blocked/risk summary count ${summaryCount} does not match DB count ${openRisks.length}.`
    });
  }

  if (summaryCount !== detailCount) {
    findings.push({
      code: "count_detail_parity_mismatch",
      severity: "error",
      projectionName: TASK_LIST_DOC,
      message: `Blocked/risk summary count ${summaryCount} does not match detail row count ${detailCount}.`
    });
  }
}

function validateSourceRefs(store, repoRoot, findings) {
  const entries = [
    ...wrapSourceRefs("release_state", store.getReleaseState("current") ? [store.getReleaseState("current")] : []),
    ...wrapSourceRefs("work_item_registry", store.listWorkItems()),
    ...wrapSourceRefs("decision_registry", store.listDecisions()),
    ...wrapSourceRefs("gate_risk_registry", store.listGateRisks()),
    ...wrapSourceRefs("handoff_log", store.listRecentHandoffs(50)),
    ...wrapSourceRefs("artifact_index", store.listArtifacts())
  ];

  for (const entry of entries) {
    if (!entry.sourceRef) {
      continue;
    }

    const resolved = path.resolve(repoRoot, entry.sourceRef);
    if (!fs.existsSync(resolved)) {
      findings.push({
        code: "source_ref_unresolved",
        severity: "error",
        rowType: entry.rowType,
        rowId: entry.rowId,
        sourceRef: entry.sourceRef,
        message: `${entry.rowType}:${entry.rowId} points to missing source_ref ${entry.sourceRef}.`
      });
    }
  }
}

function validateFreshness(store, findings) {
  const latestSourceChange = store.getLatestOperationalTimestamp();
  if (!latestSourceChange) {
    return;
  }

  for (const projectionName of [CURRENT_STATE_DOC, TASK_LIST_DOC]) {
    const projection = store.getGenerationState(projectionName);
    if (!projection) {
      continue;
    }

    if (projection.generatedAt < latestSourceChange) {
      findings.push({
        code: "freshness_drift_detected",
        severity: "error",
        projectionName,
        message: `${projectionName} is stale relative to the latest DB mutation timestamp.`
      });
    }
  }
}

function extractSummaryCount(content, sectionHeading) {
  const section = sliceSection(content, sectionHeading);
  if (!section) {
    return -1;
  }

  const firstBullet = section
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("- "));
  if (!firstBullet) {
    return -1;
  }

  const match = firstBullet.match(/(\d+)/);
  return match ? Number(match[1]) : -1;
}

function countTableRows(content, sectionHeading) {
  const section = sliceSection(content, sectionHeading);
  if (!section) {
    return -1;
  }

  const lines = section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"));

  if (lines.length < 3) {
    return 0;
  }

  return lines.length - 2;
}

function sliceSection(content, sectionHeading) {
  const start = content.indexOf(sectionHeading);
  if (start === -1) {
    return null;
  }

  const afterStart = content.slice(start + sectionHeading.length).trimStart();
  const nextHeadingMatch = afterStart.match(/\n##\s+/);
  if (!nextHeadingMatch) {
    return afterStart;
  }

  return afterStart.slice(0, nextHeadingMatch.index).trimEnd();
}

function wrapSourceRefs(rowType, rows) {
  return rows.map((row) => ({
    rowType,
    rowId:
      row.releaseId ??
      row.workItemId ??
      row.decisionId ??
      row.riskId ??
      row.handoffId ??
      row.artifactId ??
      "unknown",
    sourceRef: row.sourceRef ?? null
  }));
}
