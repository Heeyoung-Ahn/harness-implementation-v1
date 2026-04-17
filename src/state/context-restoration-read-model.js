import fs from "node:fs";
import path from "node:path";

import { validateGeneratedStateDocs } from "./drift-validator.js";
import { CURRENT_STATE_DOC, TASK_LIST_DOC } from "./generate-state-docs.js";

export const IMPLEMENTATION_PLAN_DOC = "IMPLEMENTATION_PLAN.md";
export const OPERATOR_NEXT_ACTION_SECTION = "## Operator Next Action";

const SURFACE_SECTIONS = {
  decisionRequired: {
    doc: CURRENT_STATE_DOC,
    summaryHeading: "## Decision Required Summary",
    detailHeading: "## Decision Required Detail"
  },
  blockedAtRisk: {
    doc: TASK_LIST_DOC,
    summaryHeading: "## Blocked / At Risk Summary",
    detailHeading: "## Blocked / At Risk Detail"
  },
  currentFocus: {
    doc: CURRENT_STATE_DOC,
    summaryHeading: "## Current Focus Summary",
    detailHeading: "## Current Focus Detail"
  },
  nextAction: {
    doc: IMPLEMENTATION_PLAN_DOC,
    summaryHeading: OPERATOR_NEXT_ACTION_SECTION,
    detailHeading: null
  }
};

export function buildContextRestorationReadModel({
  store,
  repoRoot = process.cwd(),
  outputDir = repoRoot,
  validationResult
}) {
  const diagnostics = [];
  const validation = validationResult ?? validateGeneratedStateDocs({ store, outputDir, repoRoot });
  const releaseState = store.getReleaseState("current");
  const decisions = store.listDecisions({ status: "open", decisionNeeded: true });
  const risks = store.listGateRisks({ status: "open" });
  const workItems = store.listWorkItems();
  const latestHandoff = store.listRecentHandoffs(1)[0] ?? null;
  const generationStates = store.listGenerationStates();

  const currentStateContent = readIfExists(path.resolve(outputDir, CURRENT_STATE_DOC));
  const taskListContent = readIfExists(path.resolve(outputDir, TASK_LIST_DOC));
  const implementationPlanContent = readIfExists(path.resolve(repoRoot, IMPLEMENTATION_PLAN_DOC));

  const decisionSurface = buildDecisionSurface({
    sectionContent: sliceSection(currentStateContent, SURFACE_SECTIONS.decisionRequired.summaryHeading),
    decisions
  });
  const blockedSurface = buildRiskSurface({
    sectionContent: sliceSection(taskListContent, SURFACE_SECTIONS.blockedAtRisk.summaryHeading),
    risks
  });
  const currentFocusSurface = buildCurrentFocusSurface({
    sectionContent: sliceSection(currentStateContent, SURFACE_SECTIONS.currentFocus.summaryHeading),
    releaseState
  });
  const nextActionSurface = buildNextActionSurface({
    sectionContent: sliceSection(implementationPlanContent, SURFACE_SECTIONS.nextAction.summaryHeading),
    workItems,
    diagnostics
  });

  return {
    generatedAt: new Date().toISOString(),
    loadOrder: [
      "release_state_and_generation_metadata",
      "open_decisions_gate_risks_and_next_action",
      "recent_handoff_and_designated_summary",
      "source_trace",
      "stale_diagnostics"
    ],
    releaseState: releaseState
      ? {
          currentStage: releaseState.currentStage,
          releaseGateState: releaseState.releaseGateState,
          currentFocus: releaseState.currentFocus,
          releaseGoal: releaseState.releaseGoal,
          sourceRef: releaseState.sourceRef,
          updatedAt: releaseState.updatedAt
        }
      : {
          currentStage: "unknown",
          releaseGateState: "unknown",
          currentFocus: "unknown",
          releaseGoal: "unknown",
          sourceRef: null,
          updatedAt: null
        },
    freshness: buildFreshnessSummary({
      validation,
      generationStates
    }),
    surfaces: {
      decisionRequired: decisionSurface,
      blockedAtRisk: blockedSurface,
      currentFocus: currentFocusSurface,
      nextAction: nextActionSurface
    },
    recentHandoff: buildHandoffSummary(latestHandoff),
    diagnostics: [...validation.findings, ...diagnostics]
  };
}

function buildDecisionSurface({ sectionContent, decisions }) {
  const summaryLines = extractBulletLines(sectionContent);
  return {
    id: "decision_required",
    label: "Decision Required",
    count: decisions.length,
    headline: summaryLines[1] ?? "needs source",
    supportingText:
      summaryLines[0] ?? "Decision Required summary section is missing.",
    status: sectionContent ? "ready" : "needs_source",
    summaryLines,
    items: decisions.map((decision) => ({
      id: decision.decisionId,
      title: decision.title,
      impactSummary: decision.impactSummary,
      dueAt: decision.dueAt,
      noResponseBehavior: decision.noResponseBehavior,
      status: decision.status,
      sourceRef: decision.sourceRef
    })),
    source: {
      path: SURFACE_SECTIONS.decisionRequired.doc,
      summarySection: SURFACE_SECTIONS.decisionRequired.summaryHeading,
      detailSection: SURFACE_SECTIONS.decisionRequired.detailHeading,
      available: Boolean(sectionContent)
    },
    sourceTrace: buildSourceTrace(
      SURFACE_SECTIONS.decisionRequired.doc,
      SURFACE_SECTIONS.decisionRequired.summaryHeading,
      decisions.map((decision) => decision.sourceRef)
    )
  };
}

function buildRiskSurface({ sectionContent, risks }) {
  const summaryLines = extractBulletLines(sectionContent);
  return {
    id: "blocked_at_risk",
    label: "Blocked / At Risk",
    count: risks.length,
    headline: summaryLines[1] ?? "needs source",
    supportingText:
      summaryLines[0] ?? "Blocked / At Risk summary section is missing.",
    status: sectionContent ? "ready" : "needs_source",
    summaryLines,
    items: risks.map((risk) => ({
      id: risk.riskId,
      title: risk.title,
      severity: risk.severity,
      unblockCondition: risk.unblockCondition,
      nextEscalation: risk.nextEscalation,
      status: risk.status,
      sourceRef: risk.sourceRef
    })),
    source: {
      path: SURFACE_SECTIONS.blockedAtRisk.doc,
      summarySection: SURFACE_SECTIONS.blockedAtRisk.summaryHeading,
      detailSection: SURFACE_SECTIONS.blockedAtRisk.detailHeading,
      available: Boolean(sectionContent)
    },
    sourceTrace: buildSourceTrace(
      SURFACE_SECTIONS.blockedAtRisk.doc,
      SURFACE_SECTIONS.blockedAtRisk.summaryHeading,
      risks.map((risk) => risk.sourceRef)
    )
  };
}

function buildCurrentFocusSurface({ sectionContent, releaseState }) {
  const summaryLines = extractBulletLines(sectionContent);
  return {
    id: "current_focus",
    label: "Current Focus",
    count: summaryLines.length > 0 ? 1 : 0,
    headline: summaryLines[0] ?? "needs source",
    supportingText:
      summaryLines[1] ?? (sectionContent ? null : "Current Focus summary section is missing."),
    status: sectionContent ? "ready" : "needs_source",
    summaryLines,
    detail: releaseState
      ? {
          currentStage: releaseState.currentStage,
          releaseGateState: releaseState.releaseGateState,
          releaseGoal: releaseState.releaseGoal,
          currentFocus: releaseState.currentFocus,
          sourceRef: releaseState.sourceRef
        }
      : null,
    source: {
      path: SURFACE_SECTIONS.currentFocus.doc,
      summarySection: SURFACE_SECTIONS.currentFocus.summaryHeading,
      detailSection: SURFACE_SECTIONS.currentFocus.detailHeading,
      available: Boolean(sectionContent)
    },
    sourceTrace: buildSourceTrace(
      SURFACE_SECTIONS.currentFocus.doc,
      SURFACE_SECTIONS.currentFocus.summaryHeading,
      [releaseState?.sourceRef]
    )
  };
}

function buildNextActionSurface({ sectionContent, workItems, diagnostics }) {
  const summaryLines = extractBulletLines(sectionContent);

  if (!sectionContent) {
    diagnostics.push({
      code: "designated_summary_missing",
      severity: "warning",
      surfaceId: "next_action",
      path: IMPLEMENTATION_PLAN_DOC,
      section: OPERATOR_NEXT_ACTION_SECTION,
      message: `${IMPLEMENTATION_PLAN_DOC} is missing required designated section ${OPERATOR_NEXT_ACTION_SECTION}.`
    });
  }

  return {
    id: "next_action",
    label: "Next Action",
    count: summaryLines.length > 0 ? 1 : 0,
    headline: summaryLines[0] ?? "needs source",
    supportingText:
      summaryLines[1] ?? "Operator next action section is missing.",
    status: sectionContent ? "ready" : "needs_source",
    summaryLines,
    items: workItems.map((workItem) => ({
      id: workItem.workItemId,
      title: workItem.title,
      status: workItem.status,
      nextAction: workItem.nextAction,
      owner: workItem.owner,
      sourceRef: workItem.sourceRef
    })),
    source: {
      path: SURFACE_SECTIONS.nextAction.doc,
      summarySection: SURFACE_SECTIONS.nextAction.summaryHeading,
      detailSection: SURFACE_SECTIONS.nextAction.detailHeading,
      available: Boolean(sectionContent)
    },
    sourceTrace: buildSourceTrace(
      SURFACE_SECTIONS.nextAction.doc,
      SURFACE_SECTIONS.nextAction.summaryHeading,
      workItems.map((workItem) => workItem.sourceRef)
    )
  };
}

function buildHandoffSummary(latestHandoff) {
  if (!latestHandoff) {
    return {
      status: "empty",
      headline: "No recent handoff recorded.",
      createdAt: null,
      sourceTrace: []
    };
  }

  return {
    status: "ready",
    headline: latestHandoff.handoffSummary,
    createdAt: latestHandoff.createdAt,
    fromRole: latestHandoff.fromRole,
    toRole: latestHandoff.toRole,
    payload: latestHandoff.payload,
    sourceTrace: buildSourceTrace(null, null, [latestHandoff.sourceRef])
  };
}

function buildFreshnessSummary({ validation, generationStates }) {
  const stale =
    generationStates.some((state) => state.freshnessState !== "fresh") ||
    validation.findings.some((finding) => finding.severity === "error");

  return {
    status: stale ? "stale" : "fresh",
    stale,
    cutoverReady: validation.cutoverReady,
    blockingFindingCount: validation.findings.filter((finding) => finding.severity === "error").length,
    findings: validation.findings,
    generatedDocs: generationStates.map((state) => ({
      projectionName: state.projectionName,
      freshnessState: state.freshnessState,
      generatedAt: state.generatedAt,
      checksum: state.checksum
    }))
  };
}

function buildSourceTrace(designatedDoc, summaryHeading, sourceRefs) {
  const trace = [];
  const seen = new Set();

  if (designatedDoc && summaryHeading) {
    const key = `${designatedDoc}#${summaryHeading}`;
    trace.push({
      kind: "designated_summary",
      path: designatedDoc,
      section: summaryHeading
    });
    seen.add(key);
  }

  for (const sourceRef of sourceRefs.filter(Boolean)) {
    const key = `source:${sourceRef}`;
    if (seen.has(key)) {
      continue;
    }
    trace.push({
      kind: "canonical_source",
      path: sourceRef
    });
    seen.add(key);
  }

  return trace;
}

function readIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, "utf8");
}

function sliceSection(content, sectionHeading) {
  if (!content) {
    return null;
  }

  const start = content.indexOf(sectionHeading);
  if (start === -1) {
    return null;
  }

  const afterStart = content.slice(start + sectionHeading.length).trimStart();
  const nextHeadingMatch = afterStart.match(/\n##\s+/);
  if (!nextHeadingMatch) {
    return afterStart.trimEnd();
  }

  return afterStart.slice(0, nextHeadingMatch.index).trimEnd();
}

function extractBulletLines(sectionContent) {
  if (!sectionContent) {
    return [];
  }

  return sectionContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}
