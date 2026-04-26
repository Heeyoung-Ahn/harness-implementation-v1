import fs from "node:fs";
import path from "node:path";

import { validateGeneratedStateDocs } from "./drift-validator.js";
import { CURRENT_STATE_DOC, TASK_LIST_DOC } from "./generate-state-docs.js";
import {
  ACTIVE_PROFILES_MARKDOWN,
  ARTIFACT_PATHS,
  CUTOVER_REPORT_JSON,
  CUTOVER_REPORT_MARKDOWN,
  GENERATED_DOCS_DIR,
  REPOSITORY_LAYOUT_MARKDOWN,
  VALIDATION_REPORT_JSON,
  VALIDATION_REPORT_MARKDOWN
} from "./harness-paths.js";
import { looksLikeStarterPlaceholder } from "./init-project.js";
import { createOperatingStateStore, DEFAULT_DB_PATH } from "./operating-state-store.js";

export const STANDARD_PATH_MIGRATIONS = {
  "REQUIREMENTS.md": ARTIFACT_PATHS.requirements,
  "ARCHITECTURE_GUIDE.md": ARTIFACT_PATHS.architecture,
  "IMPLEMENTATION_PLAN.md": ARTIFACT_PATHS.plan,
  "UI_DESIGN.md": ARTIFACT_PATHS.ui,
  "CURRENT_STATE.md": `${GENERATED_DOCS_DIR}/${CURRENT_STATE_DOC}`,
  "TASK_LIST.md": `${GENERATED_DOCS_DIR}/${TASK_LIST_DOC}`,
  "codex/project-context/active-state.md": ARTIFACT_PATHS.active,
  "codex/project-context/preventive-memory.md": ARTIFACT_PATHS.preventive,
  "PKT-01_DEV-01_DB_FOUNDATION.md": "reference/packets/PKT-01_DEV-01_DB_FOUNDATION.md",
  "PKT-01_DEV-02_GENERATED_STATE_DOCS.md": "reference/packets/PKT-01_DEV-02_GENERATED_STATE_DOCS.md",
  "PKT-01_DEV-03_CONTEXT_RESTORATION_READ_MODEL.md": "reference/packets/PKT-01_DEV-03_CONTEXT_RESTORATION_READ_MODEL.md",
  "PKT-01_DEV-04_PMW_READ_SURFACE.md": ARTIFACT_PATHS.packet,
  "PKT-01_WORK_ITEM_PACKET_TEMPLATE.md": "reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md",
  "PLN-00_DEEP_INTERVIEW.md": "reference/planning/PLN-00_DEEP_INTERVIEW.md",
  "PLN-01_REQUIREMENTS_FREEZE.md": "reference/planning/PLN-01_REQUIREMENTS_FREEZE.md",
  "PROTOTYPE_REFERENCE.md": "reference/planning/PROTOTYPE_REFERENCE.md",
  "docs/dev-04-pmw-read-surface-mockup.html": "reference/mockups/dev-04-pmw-read-surface-mockup.html",
  "codex/project-context/durable-context.md": "reference/artifacts/SYSTEM_CONTEXT.md",
  "codex/project-context/restart-handoff-2026-04-19.md": "reference/artifacts/HANDOFF_ARCHIVE.md",
  "codex/project-context/daily/2026-04-19.md": "reference/artifacts/daily/2026-04-19.md",
  "codex/project-context/daily/2026-04-20.md": "reference/artifacts/daily/2026-04-20.md"
};

export function runValidator({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const bootstrapPending = detectStarterBootstrapPending({ repoRoot, store });
    if (bootstrapPending) {
      return {
        ok: false,
        cutoverReady: false,
        findings: [bootstrapPending]
      };
    }
    return validateGeneratedStateDocs({ store, repoRoot, outputDir });
  });
}

export function runDoctor({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const root = path.resolve(repoRoot);
    const validation = runValidator({ repoRoot, outputDir, dbPath });
    const checks = [
      buildCheck("node_runtime", nodeMajor() >= 24, `Node.js ${process.versions.node}`, "Node.js 24+ is required for the harness runtime only."),
      buildCheck("harness_runtime_path", fs.existsSync(path.join(root, ".harness", "runtime")), ".harness/runtime exists", "Harness runtime must live outside product src/test paths."),
      buildCheck("harness_test_path", fs.existsSync(path.join(root, ".harness", "test")), ".harness/test exists", "Harness tests must live outside product test paths."),
      buildCheck("repository_layout_contract", fs.existsSync(path.join(root, REPOSITORY_LAYOUT_MARKDOWN)), REPOSITORY_LAYOUT_MARKDOWN, "Repository layout ownership contract is required."),
      buildCheck("operating_state_db", fs.existsSync(resolveDbPath(repoRoot, dbPath)), resolveDbPath(repoRoot, dbPath), "Repo-local harness DB should exist after initialization."),
      buildCheck("generated_current_state", fs.existsSync(path.join(root, GENERATED_DOCS_DIR, CURRENT_STATE_DOC)), `${GENERATED_DOCS_DIR}/${CURRENT_STATE_DOC}`, "Generated CURRENT_STATE projection should exist."),
      buildCheck("generated_task_list", fs.existsSync(path.join(root, GENERATED_DOCS_DIR, TASK_LIST_DOC)), `${GENERATED_DOCS_DIR}/${TASK_LIST_DOC}`, "Generated TASK_LIST projection should exist."),
      buildCheck("validator", validation.ok, `${validation.findings.length} finding(s)`, "Validator must be clean before gate close.")
    ];
    const failed = checks.filter((check) => check.status === "fail");
    const warned = checks.filter((check) => check.status === "warn");

    return {
      ok: failed.length === 0,
      command: "doctor",
      summary: failed.length === 0 ? "Harness doctor passed." : "Harness doctor found blocking issues.",
      checks,
      validation,
      nextAction: failed[0]?.recovery ?? warned[0]?.recovery ?? recommendNextActionFromState(store, validation)
    };
  });
}

export function buildHarnessStatus({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const validation = runValidator({ repoRoot, outputDir, dbPath });
    const releaseState = store.getReleaseState("current");
    const workItems = store.listWorkItems();
    const openWorkItems = workItems.filter((item) => !isClosedStatus(item.status));
    const blockers = store.listGateRisks({ status: "open" });
    const decisions = store.listDecisions({ status: "open", decisionNeeded: true });
    const activeProfiles = readActiveProfileSummary(repoRoot);
    return {
      ok: validation.ok,
      command: "status",
      stage: releaseState?.currentStage ?? "unknown",
      gateState: releaseState?.releaseGateState ?? "unknown",
      focus: releaseState?.currentFocus ?? "unknown",
      releaseGoal: releaseState?.releaseGoal ?? "unknown",
      openWorkItems: openWorkItems.length,
      openBlockers: blockers.length,
      openDecisions: decisions.length,
      activeProfiles,
      validation: summarizeValidation(validation),
      nextAction: recommendNextActionFromState(store, validation)
    };
  });
}

export function recommendNextAction({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const validation = runValidator({ repoRoot, outputDir, dbPath });
    return {
      ok: validation.ok,
      command: "next",
      nextAction: recommendNextActionFromState(store, validation),
      validation: summarizeValidation(validation)
    };
  });
}

export function explainCurrentBlockers({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const validation = runValidator({ repoRoot, outputDir, dbPath });
    const blockers = [
      ...validation.findings
        .filter((finding) => finding.severity === "error")
        .map((finding) => ({
          source: "validator",
          code: finding.code,
          message: finding.message,
          recovery: recoveryForFinding(finding)
        })),
      ...store.listGateRisks({ status: "open" }).map((risk) => ({
        source: "gate_risk_registry",
        code: risk.riskId,
        message: risk.title,
        recovery: risk.unblockCondition ?? risk.nextEscalation ?? "Resolve the recorded gate risk."
      }))
    ];

    return {
      ok: blockers.length === 0,
      command: "explain",
      summary: blockers.length === 0 ? "No current blocker is recorded." : `${blockers.length} blocker(s) require attention.`,
      blockers,
      nextAction: blockers[0]?.recovery ?? recommendNextActionFromState(store, validation)
    };
  });
}

export function writeValidationReport({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  const status = buildHarnessStatus({ repoRoot, outputDir, dbPath });
  const validation = runValidator({ repoRoot, outputDir, dbPath });
  const root = path.resolve(repoRoot);
  const markdownPath = path.resolve(root, VALIDATION_REPORT_MARKDOWN);
  const jsonPath = path.resolve(root, VALIDATION_REPORT_JSON);
  const report = {
    ok: validation.ok,
    command: "validation-report",
    validatorVersion: "v1.1",
    executedAt: new Date().toISOString(),
    profileSummary: status.activeProfiles,
    findings: validation.findings,
    nextAction: status.nextAction,
    gateDecision: validation.ok ? "pass" : "hold"
  };

  fs.mkdirSync(path.dirname(markdownPath), { recursive: true });
  fs.writeFileSync(markdownPath, buildValidationReportMarkdown(report), "utf8");
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  return {
    ok: validation.ok,
    command: "validation-report",
    markdownPath,
    jsonPath,
    report
  };
}

export function buildMigrationPreview({ repoRoot = process.cwd(), dbPath = DEFAULT_DB_PATH } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const changes = collectPathChanges(store);
    return {
      ok: true,
      repoRoot: path.resolve(repoRoot),
      dbPath: resolveDbPath(repoRoot, dbPath),
      changeCount: changes.length,
      changes
    };
  });
}

export function applyMigration({ repoRoot = process.cwd(), dbPath = DEFAULT_DB_PATH, appliedBy = "dev05-tooling" } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const changes = collectPathChanges(store);
    if (changes.length === 0) {
      return {
        ok: true,
        applied: 0,
        changes: []
      };
    }

    const timestamp = new Date().toISOString();
    const db = store.db;

    for (const change of changes) {
      if (change.table === "handoff_log") {
        db.prepare(`UPDATE handoff_log SET ${change.field} = ? WHERE handoff_id = ?`)
          .run(change.to, change.rowId);
        continue;
      }

      db.prepare(
        `UPDATE ${change.table}
            SET ${change.field} = ?, version = ?, updated_at = ?
          WHERE ${change.idColumn} = ?`
      ).run(change.to, change.nextVersion, timestamp, change.rowId);
    }

    return {
      ok: true,
      applied: changes.length,
      appliedBy,
      changes
    };
  });
}

export function runCutoverPreflight({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const bootstrapPending = detectStarterBootstrapPending({ repoRoot, store });
    if (bootstrapPending) {
      return {
        ok: false,
        cutoverReady: false,
        validator: {
          ok: false,
          cutoverReady: false,
          findings: [bootstrapPending]
        },
        migrationPreview: {
          ok: true,
          repoRoot: path.resolve(repoRoot),
          dbPath: resolveDbPath(repoRoot, dbPath),
          changeCount: 0,
          changes: []
        },
        rollbackBundle: buildRollbackBundle({ repoRoot, dbPath }),
        blockers: [
          {
            code: bootstrapPending.code,
            message: bootstrapPending.message
          }
        ]
      };
    }

    const validator = validateGeneratedStateDocs({ store, repoRoot, outputDir });
    const migrationPreview = {
      ok: true,
      repoRoot: path.resolve(repoRoot),
      dbPath: resolveDbPath(repoRoot, dbPath),
      changes: collectPathChanges(store)
    };
    migrationPreview.changeCount = migrationPreview.changes.length;
    const rollbackBundle = buildRollbackBundle({ repoRoot, dbPath });

    const blockers = [
      ...validator.findings
        .filter((finding) => finding.severity === "error")
        .map((finding) => ({
          code: finding.code,
          message: finding.message
        })),
      ...migrationPreview.changes.map((change) => ({
        code: "migration_change_pending",
        message: `${change.table}:${change.rowId} ${change.field} still points to ${change.from}.`
      })),
      ...rollbackBundle.missingPaths.map((item) => ({
        code: "rollback_bundle_missing",
        message: `Rollback bundle is missing ${item.kind}: ${item.path}.`
      }))
    ];

    return {
      ok: blockers.length === 0,
      cutoverReady: blockers.length === 0,
      validator,
      migrationPreview,
      rollbackBundle,
      blockers
    };
  });
}

export function writeCutoverReport({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  const preflight = runCutoverPreflight({ repoRoot, outputDir, dbPath });
  const root = path.resolve(repoRoot);
  const markdownPath = path.resolve(root, CUTOVER_REPORT_MARKDOWN);
  const jsonPath = path.resolve(root, CUTOVER_REPORT_JSON);

  fs.mkdirSync(path.dirname(markdownPath), { recursive: true });
  fs.writeFileSync(markdownPath, buildCutoverReportMarkdown(preflight), "utf8");
  fs.writeFileSync(jsonPath, `${JSON.stringify(preflight, null, 2)}
`, "utf8");

  return {
    ok: preflight.ok,
    cutoverReady: preflight.cutoverReady,
    markdownPath,
    jsonPath,
    preflight
  };
}

function withStore({ dbPath, repoRoot }, callback) {
  const store = createOperatingStateStore({ dbPath: resolveDbPath(repoRoot, dbPath) });
  try {
    return callback(store);
  } finally {
    store.close();
  }
}

function collectPathChanges(store) {
  const changes = [];
  const releaseState = store.getReleaseState("current");
  if (releaseState) {
    collectSingleFieldChange(changes, {
      table: "release_state",
      rowId: releaseState.releaseId,
      idColumn: "release_id",
      field: "source_ref",
      value: releaseState.sourceRef,
      version: releaseState.version
    });
  }

  for (const row of store.listWorkItems()) {
    collectSingleFieldChange(changes, {
      table: "work_item_registry",
      rowId: row.workItemId,
      idColumn: "work_item_id",
      field: "source_ref",
      value: row.sourceRef,
      version: row.version
    });
  }

  for (const row of store.listDecisions()) {
    collectSingleFieldChange(changes, {
      table: "decision_registry",
      rowId: row.decisionId,
      idColumn: "decision_id",
      field: "source_ref",
      value: row.sourceRef,
      version: row.version
    });
  }

  for (const row of store.listGateRisks()) {
    collectSingleFieldChange(changes, {
      table: "gate_risk_registry",
      rowId: row.riskId,
      idColumn: "risk_id",
      field: "source_ref",
      value: row.sourceRef,
      version: row.version
    });
  }

  for (const row of store.listRecentHandoffs(200)) {
    collectSingleFieldChange(changes, {
      table: "handoff_log",
      rowId: row.handoffId,
      idColumn: "handoff_id",
      field: "source_ref",
      value: row.sourceRef,
      version: null
    });
  }

  for (const row of store.listArtifacts()) {
    collectSingleFieldChange(changes, {
      table: "artifact_index",
      rowId: row.artifactId,
      idColumn: "artifact_id",
      field: "path",
      value: row.path,
      version: row.version
    });
    collectSingleFieldChange(changes, {
      table: "artifact_index",
      rowId: row.artifactId,
      idColumn: "artifact_id",
      field: "source_ref",
      value: row.sourceRef,
      version: row.version
    });
  }

  return changes;
}

function collectSingleFieldChange(changes, { table, rowId, idColumn, field, value, version }) {
  if (!value) {
    return;
  }
  const to = STANDARD_PATH_MIGRATIONS[value];
  if (!to || to === value) {
    return;
  }
  changes.push({
    table,
    rowId,
    idColumn,
    field,
    from: value,
    to,
    nextVersion: version == null ? null : version + 1
  });
}

function buildRollbackBundle({ repoRoot, dbPath }) {
  const root = path.resolve(repoRoot);
  const dbPathResolved = resolveDbPath(repoRoot, dbPath);
  const generatedDocs = [
    path.resolve(root, GENERATED_DOCS_DIR, CURRENT_STATE_DOC),
    path.resolve(root, GENERATED_DOCS_DIR, TASK_LIST_DOC)
  ];
  const liveArtifacts = [
    path.resolve(root, ARTIFACT_PATHS.requirements),
    path.resolve(root, ARTIFACT_PATHS.architecture),
    path.resolve(root, ARTIFACT_PATHS.plan),
    path.resolve(root, ARTIFACT_PATHS.progress),
    path.resolve(root, ARTIFACT_PATHS.active),
    path.resolve(root, ARTIFACT_PATHS.preventive)
  ];
  const missingPaths = [
    { kind: "db", path: dbPathResolved },
    ...generatedDocs.map((item) => ({ kind: "generated doc", path: item })),
    ...liveArtifacts.map((item) => ({ kind: "live artifact", path: item }))
  ].filter((item) => !fs.existsSync(item.path));

  return {
    dbPath: dbPathResolved,
    generatedDocs,
    liveArtifacts,
    missingPaths,
    needsOperatorBackup: missingPaths.length > 0
  };
}

function buildCutoverReportMarkdown(preflight) {
  const lines = [
    "# Cutover Precheck",
    "",
    "## Summary",
    preflight.cutoverReady
      ? "The standardized harness is cutover-ready for the current repo snapshot."
      : "The standardized harness is not cutover-ready for the current repo snapshot.",
    "",
    "## Result",
    `- Ready: ${preflight.cutoverReady ? "yes" : "no"}`,
    `- Validator ok: ${preflight.validator.ok ? "yes" : "no"}`,
    `- Migration preview changes: ${preflight.migrationPreview.changeCount}`,
    `- Blocker count: ${preflight.blockers.length}`,
    "",
    "## Validator Findings"
  ];

  const findings = preflight.validator.findings?.length
    ? preflight.validator.findings.map((finding) => `- [${finding.severity}] ${finding.code}: ${finding.message}`)
    : ["- none"];
  lines.push(...findings, "", "## Migration Preview");

  const changes = preflight.migrationPreview.changes?.length
    ? preflight.migrationPreview.changes.map((change) => `- ${change.table}:${change.rowId} ${change.field} -> ${change.to}`)
    : ["- no pending path normalization changes"];
  lines.push(...changes, "", "## Blockers");

  const blockers = preflight.blockers.length
    ? preflight.blockers.map((blocker) => `- ${blocker.code}: ${blocker.message}`)
    : ["- none"];
  lines.push(...blockers, "", "## Rollback Bundle");

  lines.push(
    `- DB: ${preflight.rollbackBundle.dbPath}`,
    ...preflight.rollbackBundle.generatedDocs.map((item) => `- Generated doc: ${item}`),
    ...preflight.rollbackBundle.liveArtifacts.map((item) => `- Live artifact: ${item}`)
  );

  if (preflight.rollbackBundle.needsOperatorBackup) {
    lines.push(
      "- needs operator backup: yes",
      ...preflight.rollbackBundle.missingPaths.map((item) => `- Missing ${item.kind}: ${item.path}`)
    );
  } else {
    lines.push("- needs operator backup: no");
  }

  return `${lines.join("\n")}\n`;
}

function nodeMajor() {
  return Number.parseInt((process.versions.node ?? "0").split(".")[0], 10);
}

function buildCheck(code, passed, detail, recovery) {
  return {
    code,
    status: passed ? "pass" : "fail",
    detail,
    recovery
  };
}

function summarizeValidation(validation) {
  return {
    ok: validation.ok,
    cutoverReady: validation.cutoverReady,
    findingCount: validation.findings.length,
    blockingFindingCount: validation.findings.filter((finding) => finding.severity === "error").length
  };
}

function recommendNextActionFromState(store, validation) {
  const firstError = validation.findings.find((finding) => finding.severity === "error");
  if (firstError) {
    return recoveryForFinding(firstError);
  }

  const firstRisk = store.listGateRisks({ status: "open" })[0];
  if (firstRisk) {
    return firstRisk.unblockCondition ?? firstRisk.nextEscalation ?? `Resolve ${firstRisk.riskId}.`;
  }

  const firstDecision = store.listDecisions({ status: "open", decisionNeeded: true })[0];
  if (firstDecision) {
    return `Close decision ${firstDecision.decisionId}: ${firstDecision.title}.`;
  }

  const releaseState = store.getReleaseState("current");
  if (isClosedStatus(releaseState?.currentStage)) {
    return "V1.1 is closed. Start the next real project by copying standard-template and running harness:init.";
  }

  const activeWork = store.listWorkItems().find((item) => !isClosedStatus(item.status));
  if (activeWork?.nextAction) {
    return activeWork.nextAction;
  }

  return "No blocker is recorded. Continue with the current approved packet or open the next planning lane.";
}

function isClosedStatus(status) {
  return ["closed", "done", "complete"].includes(String(status ?? "").toLowerCase());
}

function recoveryForFinding(finding) {
  const code = finding.code ?? "unknown";
  if (code === "starter_bootstrap_pending") {
    return "Run INIT_STANDARD_HARNESS.cmd or npm run harness:init.";
  }
  if (code.includes("generation") || code.includes("checksum") || code.includes("freshness")) {
    return "Regenerate state docs, then run harness:validate again.";
  }
  if (code.includes("task_packet")) {
    return "Update or register the concrete task packet, then rerun validation.";
  }
  if (code.includes("optional_profile") || code.includes("active_profile")) {
    return "Complete active profile references/evidence before Ready For Code.";
  }
  if (code.includes("sync")) {
    return "Synchronize the reusable root change into standard-template.";
  }
  return finding.message ?? "Inspect validator output and resolve the blocking finding.";
}

function readActiveProfileSummary(repoRoot) {
  const activeProfilePath = path.resolve(repoRoot, ACTIVE_PROFILES_MARKDOWN);
  if (!fs.existsSync(activeProfilePath)) {
    return {
      path: ACTIVE_PROFILES_MARKDOWN,
      status: "not_declared",
      profiles: []
    };
  }

  const content = fs.readFileSync(activeProfilePath, "utf8");
  const profiles = content
    .split("\n")
    .filter((line) => line.trim().startsWith("| PRF-"))
    .map((line) => {
      const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
      return {
        profileId: cells[0],
        reason: cells[1],
        evidenceStatus: cells[3],
        appliesToPackets: cells[6]
      };
    });

  return {
    path: ACTIVE_PROFILES_MARKDOWN,
    status: profiles.length > 0 ? "declared" : "empty",
    profiles
  };
}

function buildValidationReportMarkdown(report) {
  const lines = [
    "# Validation Report",
    "",
    "## Summary",
    `- Executed at: ${report.executedAt}`,
    `- Validator version: ${report.validatorVersion}`,
    `- Gate decision: ${report.gateDecision}`,
    `- Next action: ${report.nextAction}`,
    "",
    "## Active Profiles",
    `- Source: ${report.profileSummary.path}`,
    `- Status: ${report.profileSummary.status}`
  ];

  if (report.profileSummary.profiles.length === 0) {
    lines.push("- Profiles: none");
  } else {
    for (const profile of report.profileSummary.profiles) {
      lines.push(`- ${profile.profileId}: ${profile.evidenceStatus} (${profile.reason})`);
    }
  }

  lines.push("", "## Findings");
  if (report.findings.length === 0) {
    lines.push("- none");
  } else {
    for (const finding of report.findings) {
      lines.push(`- [${finding.severity}] ${finding.code}: ${finding.message}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

function resolveDbPath(repoRoot, dbPath) {
  return path.isAbsolute(dbPath) ? dbPath : path.resolve(repoRoot, dbPath);
}

function detectStarterBootstrapPending({ repoRoot, store }) {
  const root = path.resolve(repoRoot);
  if (!looksLikeStarterPlaceholder(root)) {
    return null;
  }

  const hasOperationalState =
    store.getReleaseState("current") != null ||
    store.listWorkItems().length > 0 ||
    store.listDecisions().length > 0 ||
    store.listGateRisks().length > 0 ||
    store.listGenerationStates().length > 0;

  if (hasOperationalState) {
    return null;
  }

  return {
    code: "starter_bootstrap_pending",
    severity: "error",
    message: "Standard harness starter has not been initialized yet. Run INIT_STANDARD_HARNESS.cmd or npm run harness:init first."
  };
}
