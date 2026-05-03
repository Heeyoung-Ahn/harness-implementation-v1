import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  applyMigration,
  buildMigrationPreview,
  buildHarnessStatus,
  recommendNextAction,
  resolveHandoff,
  runTransition,
  runCutoverPreflight,
  runValidator,
  writeCutoverReport
} from "../runtime/state/dev05-tooling.js";
import { initializeProjectStarter } from "../runtime/state/init-project.js";
import { createOperatingStateStore } from "../runtime/state/operating-state-store.js";
import { writeGeneratedStateDocs } from "../runtime/state/generate-state-docs.js";
import { workflowForOwner } from "../runtime/state/workflow-routing.js";
import { seedProfileAwareValidatorFixtures } from "./profile-aware-validator-fixtures.js";

test("migration preview detects legacy source refs and apply normalizes them", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-migration-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-04-20T03:00:00.000Z") });
  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "DEV-05 tooling",
    releaseGoal: "Standardize paths",
    sourceRef: "codex/project-context/active-state.md"
  });
  store.upsertWorkItem({
    workItemId: "DEV-05",
    title: "validator / migration / cutover tooling",
    status: "in_progress",
    nextAction: "Normalize legacy source refs",
    sourceRef: "PKT-01_DEV-04_PMW_READ_SURFACE.md"
  });
  store.recordDecision({
    decisionId: "DEC-05",
    title: "Keep preview-first migration semantics",
    decisionNeeded: true,
    impactSummary: "Protects cutover review clarity",
    sourceRef: "IMPLEMENTATION_PLAN.md"
  });
  store.close();

  const preview = buildMigrationPreview({ repoRoot, dbPath });
  assert.equal(preview.changeCount >= 3, true);
  assert.equal(preview.changes.some((item) => item.to === ".agents/artifacts/CURRENT_STATE.md"), true);
  assert.equal(preview.changes.some((item) => item.to === "reference/packets/PKT-01_DEV-04_PMW_READ_SURFACE.md"), true);

  const applied = applyMigration({ repoRoot, dbPath });
  assert.equal(applied.applied, preview.changeCount);

  const after = buildMigrationPreview({ repoRoot, dbPath });
  assert.equal(after.changeCount, 0);
});

test("cutover preflight passes when validator is clean and no migration changes remain", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-cutover-pass-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-04-20T03:30:00.000Z") });
  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "DEV-05 tooling",
    releaseGoal: "Cutover preflight",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  store.upsertWorkItem({
    workItemId: "DEV-05",
    title: "validator / migration / cutover tooling",
    status: "in_progress",
    nextAction: "Run preflight",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const validator = runValidator({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(validator.ok, true);

  const preflight = runCutoverPreflight({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(preflight.cutoverReady, true);
  assert.deepEqual(preflight.blockers, []);
  assert.equal(preflight.migrationPreview.changeCount, 0);
  assert.equal(preflight.rollbackBundle.generatedDocs.length, 2);
  assert.equal(preflight.rollbackBundle.needsOperatorBackup, false);
  assert.deepEqual(preflight.rollbackBundle.missingPaths, []);
});

test("cutover preflight fails when validator errors or migration changes remain", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-cutover-fail-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-04-20T04:00:00.000Z") });
  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "DEV-05 tooling",
    releaseGoal: "Cutover preflight",
    sourceRef: "codex/project-context/active-state.md"
  });
  store.upsertWorkItem({
    workItemId: "DEV-05",
    title: "validator / migration / cutover tooling",
    status: "in_progress",
    nextAction: "Run preflight",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  fs.writeFileSync(
    path.join(repoRoot, ".agents", "runtime", "generated-state-docs", "CURRENT_STATE.md"),
    "# CURRENT_STATE\n\n## Current Focus Summary\n- Broken state\n",
    "utf8"
  );

  const preflight = runCutoverPreflight({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(preflight.cutoverReady, false);
  assert.equal(preflight.blockers.some((item) => item.code === "migration_change_pending"), true);
  assert.equal(preflight.blockers.some((item) => item.code === "required_section_missing"), true);
});

test("cutover preflight fails when the rollback bundle is incomplete", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-cutover-rollback-missing-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-04-20T04:15:00.000Z") });
  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "DEV-05 tooling",
    releaseGoal: "Cutover preflight",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  store.upsertWorkItem({
    workItemId: "DEV-05",
    title: "validator / migration / cutover tooling",
    status: "in_progress",
    nextAction: "Run preflight",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  fs.unlinkSync(path.join(repoRoot, ".agents", "artifacts", "PREVENTIVE_MEMORY.md"));

  const preflight = runCutoverPreflight({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(preflight.cutoverReady, false);
  assert.equal(preflight.rollbackBundle.needsOperatorBackup, true);
  assert.equal(
    preflight.rollbackBundle.missingPaths.some((item) => item.path.endsWith("PREVENTIVE_MEMORY.md")),
    true
  );
  assert.equal(preflight.blockers.some((item) => item.code === "rollback_bundle_missing"), true);
});

test("cutover report writes markdown and json evidence files", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-cutover-report-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-04-20T04:30:00.000Z") });
  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "DEV-05 tooling",
    releaseGoal: "Cutover report",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  store.upsertWorkItem({
    workItemId: "DEV-05",
    title: "validator / migration / cutover tooling",
    status: "in_progress",
    nextAction: "Write cutover report",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const report = writeCutoverReport({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(report.cutoverReady, true);
  assert.equal(fs.existsSync(report.markdownPath), true);
  assert.equal(fs.existsSync(report.jsonPath), true);
  assert.match(fs.readFileSync(report.markdownPath, "utf8"), /# Cutover Precheck/);
  assert.match(fs.readFileSync(report.markdownPath, "utf8"), /Ready: yes/);
  assert.match(fs.readFileSync(report.markdownPath, "utf8"), /needs operator backup: no/);
});

test("validator reports starter bootstrap pending before the copied starter is initialized", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-starter-bootstrap-pending-"));
  seedStarterRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");

  const result = runValidator({ repoRoot, dbPath, outputDir: repoRoot });

  assert.equal(result.ok, false);
  assert.equal(result.findings.some((item) => item.code === "starter_bootstrap_pending"), true);
});

test("validator becomes clean after the copied starter is initialized", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-starter-bootstrap-ready-"));
  seedStarterRepo(repoRoot);

  initializeProjectStarter({
    repoRoot,
    projectName: "Starter Ready Repo",
    userGoal: "goal",
    opsGoal: "ops",
    approvalGoal: "approval",
    now: createClock("2026-04-23T04:45:00.000Z")
  });

  const result = runValidator({
    repoRoot,
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    outputDir: repoRoot
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.findings, []);
});

test("copied starter next and handoff prioritize bootstrap work over stale open history", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-starter-next-routing-"));
  seedStarterRepo(repoRoot);

  initializeProjectStarter({
    repoRoot,
    projectName: "Starter Routing Repo",
    userGoal: "goal",
    opsGoal: "ops",
    approvalGoal: "approval",
    now: createClock("2026-04-23T04:50:00.000Z")
  });

  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");
  const next = recommendNextAction({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(next.ok, true);
  assert.equal(next.nextOwner?.toLowerCase(), "planner");
  assert.equal(next.nextTask?.workItemId, "PLN-00");

  const handoff = resolveHandoff({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(handoff.ok, true);
  assert.equal(handoff.nextOwner?.toLowerCase(), "planner");
  assert.equal(handoff.workflow, ".agents/workflows/plan.md");
  assert.equal(handoff.nextTask?.workItemId, "PLN-00");
});

test("validator enforces gate profile evidence for active packet work", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-gate-profile-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");
  const packetPath = "reference/packets/PKT-01_OPS-03_GATE_PROFILE_TEST.md";
  writeOpsPacket(repoRoot, packetPath, { gateProfile: null, includeManifest: false });

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-05-02T10:00:00.000Z") });
  store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "OPS-03 gate profile validation",
    releaseGoal: "Validate gate profile contracts",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });
  store.upsertWorkItem({
    workItemId: "OPS-03",
    title: "Harness operation friction reduction",
    status: "planning",
    nextAction: "Approve gate profile evidence.",
    owner: "planner",
    sourceRef: packetPath
  });
  store.upsertArtifact({
    artifactId: "PKT-01_OPS-03_GATE_PROFILE_TEST",
    path: packetPath,
    category: "task_packet",
    title: "OPS-03 gate profile test packet",
    sourceRef: packetPath
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const result = runValidator({ repoRoot, dbPath, outputDir: repoRoot });

  assert.equal(result.ok, false);
  assert.equal(result.findings.some((item) => item.code === "gate_profile_missing"), true);
});

test("validator blocks packet-header-only Ready For Code approval", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-ready-for-code-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");
  const packetPath = "reference/packets/PKT-01_OPS-03_READY_FOR_CODE_TEST.md";
  writeOpsPacket(repoRoot, packetPath, { gateProfile: "contract", includeManifest: true });

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-05-02T10:05:00.000Z") });
  store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "OPS-03 Ready For Code consistency",
    releaseGoal: "Validate approval state consistency",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });
  store.upsertWorkItem({
    workItemId: "OPS-03",
    title: "Harness operation friction reduction",
    status: "in_progress",
    nextAction: "Reconcile approval state.",
    owner: "developer",
    sourceRef: packetPath,
    metadata: { gateProfile: "contract" }
  });
  store.recordDecision({
    decisionId: "OPS-03-ready-for-code",
    title: "OPS-03 Ready For Code",
    decisionNeeded: true,
    impactSummary: "Packet header alone must not close implementation approval.",
    sourceRef: packetPath
  });
  store.upsertArtifact({
    artifactId: "PKT-01_OPS-03_READY_FOR_CODE_TEST",
    path: packetPath,
    category: "task_packet",
    title: "OPS-03 Ready For Code consistency packet",
    sourceRef: packetPath
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const result = runValidator({ repoRoot, dbPath, outputDir: repoRoot });

  assert.equal(result.ok, false);
  assert.equal(result.findings.some((item) => item.code === "ready_for_code_metadata_mismatch"), true);
  assert.equal(result.findings.some((item) => item.code === "ready_for_code_decision_open"), true);
});

test("transition blocks planner-to-developer before Ready For Code approval", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-transition-ready-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");
  const packetPath = "reference/packets/PKT-01_OPS-03_TRANSITION_READY_TEST.md";
  writeOpsPacket(repoRoot, packetPath, {
    gateProfile: "contract",
    includeManifest: true,
    readyForCode: "pending"
  });

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-05-02T10:10:00.000Z") });
  store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "OPS-03 transition approval guard",
    releaseGoal: "Validate transition approval guard",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });
  store.upsertWorkItem({
    workItemId: "OPS-03",
    title: "Harness operation friction reduction",
    status: "planning",
    nextAction: "Approve OPS-03 Ready For Code.",
    owner: "planner",
    sourceRef: packetPath,
    metadata: { gateProfile: "contract" }
  });
  store.upsertArtifact({
    artifactId: "PKT-01_OPS-03_TRANSITION_READY_TEST",
    path: packetPath,
    category: "task_packet",
    title: "OPS-03 transition Ready For Code guard packet",
    sourceRef: packetPath
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const preview = runTransition({
    repoRoot,
    dbPath,
    outputDir: repoRoot,
    args: ["--transition", "planner-to-developer", "--work-item", "OPS-03"]
  });

  assert.equal(preview.ok, false);
  assert.match(preview.errors.join("\n"), /Ready For Code approved/);
});

test("transition blocks planner-to-developer until Ready For Code decision is closed", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-transition-decision-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");
  const packetPath = "reference/packets/PKT-01_OPS-03_TRANSITION_DECISION_TEST.md";
  writeOpsPacket(repoRoot, packetPath, { gateProfile: "contract", includeManifest: true });

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-05-02T10:12:00.000Z") });
  store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "OPS-03 transition decision guard",
    releaseGoal: "Validate transition decision guard",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });
  store.upsertWorkItem({
    workItemId: "OPS-03",
    title: "Harness operation friction reduction",
    status: "planning",
    nextAction: "Close OPS-03 Ready For Code decision.",
    owner: "planner",
    sourceRef: packetPath,
    metadata: { gateProfile: "contract" }
  });
  store.recordDecision({
    decisionId: "OPS-03-ready-for-code",
    title: "OPS-03 Ready For Code",
    decisionNeeded: true,
    impactSummary: "Developer handoff requires closing this approval decision.",
    sourceRef: packetPath
  });
  store.upsertArtifact({
    artifactId: "PKT-01_OPS-03_TRANSITION_DECISION_TEST",
    path: packetPath,
    category: "task_packet",
    title: "OPS-03 transition decision guard packet",
    sourceRef: packetPath
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const blockedPreview = runTransition({
    repoRoot,
    dbPath,
    outputDir: repoRoot,
    args: ["--transition", "planner-to-developer", "--work-item", "OPS-03"]
  });
  assert.equal(blockedPreview.ok, false);
  assert.match(blockedPreview.errors.join("\n"), /--close-decision/);

  const allowedPreview = runTransition({
    repoRoot,
    dbPath,
    outputDir: repoRoot,
    args: [
      "--transition",
      "planner-to-developer",
      "--work-item",
      "OPS-03",
      "--close-decision",
      "OPS-03-ready-for-code"
    ]
  });
  assert.equal(allowedPreview.ok, true);
  assert.deepEqual(allowedPreview.closeDecisions, ["OPS-03-ready-for-code"]);
});

test("transition apply reports post-apply validation failure at top level", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-transition-validation-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");
  const packetPath = "reference/packets/PKT-01_OPS-03_TRANSITION_VALIDATION_TEST.md";
  writeOpsPacket(repoRoot, packetPath, { gateProfile: "contract", includeManifest: false });

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-05-02T10:14:00.000Z") });
  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "OPS-03 transition validation reporting",
    releaseGoal: "Validate transition validation reporting",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });
  store.upsertWorkItem({
    workItemId: "OPS-03",
    title: "Harness operation friction reduction",
    status: "in_progress",
    nextAction: "Hand off to Tester.",
    owner: "developer",
    sourceRef: packetPath,
    metadata: { gateProfile: "contract", readyForCode: "approved" }
  });
  store.upsertArtifact({
    artifactId: "PKT-01_OPS-03_TRANSITION_VALIDATION_TEST",
    path: packetPath,
    category: "task_packet",
    title: "OPS-03 transition validation reporting packet",
    sourceRef: packetPath
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const applied = runTransition({
    repoRoot,
    dbPath,
    outputDir: repoRoot,
    args: ["--transition", "developer-to-tester", "--work-item", "OPS-03", "--apply"]
  });

  assert.equal(applied.apply, true);
  assert.equal(applied.ok, false);
  assert.equal(applied.validationReport.ok, false);
  assert.equal(applied.validationReport.findingCount > 0, true);
  assert.match(applied.errors.join("\n"), /validation report failed/);
});

test("transition preview is review-first and apply updates state surfaces", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-transition-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");
  const packetPath = "reference/packets/PKT-01_OPS-03_TRANSITION_TEST.md";
  writeOpsPacket(repoRoot, packetPath, { gateProfile: "contract", includeManifest: true });
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"),
    [
      "# Current State",
      "",
      "## Snapshot",
      "- Current Stage: planning",
      "- Current Focus: OPS-03 planning",
      "",
      "## Next Recommended Agent",
      "- Planner",
      "",
      "## Open Decisions / Blockers",
      "- `OPS-03 Ready For Code` remains pending.",
      "",
      "## Latest Handoff Summary",
      "- none"
    ].join("\n"),
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"),
    [
      "# Task List",
      "",
      "## Active Locks",
      "| Task ID | Scope | Owner | Status | Started At | Notes |",
      "|---|---|---|---|---|---|",
      "| OPS-03 | Harness operation friction reduction | planner | active | 2026-05-02 | planning |",
      "",
      "## Active Tasks",
      "| Task ID | Title | Scope | Owner | Status | Priority | Depends On | Verification |",
      "|---|---|---|---|---|---|---|---|",
      "| OPS-03 | Harness operation friction reduction | gate profiles and transition automation | planner | planning | P0 | DEV-09 | pending |",
      "- Next first action: Approve OPS-03 Ready For Code.",
      "",
      "## Blocked Tasks",
      "| Task ID | Blocker | Owner | Status | Unblock Condition | Verification |",
      "|---|---|---|---|---|---|",
      "| - | None | - | clear | - | - |",
      "",
      "## Completed Tasks",
      "| Task ID | Title | Completed At | Verification | Notes |",
      "|---|---|---|---|---|",
      "| - | None | - | - | - |",
      "",
      "## Handoff Log",
      "- none"
    ].join("\n"),
    "utf8"
  );

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-05-02T10:15:00.000Z") });
  store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "OPS-03 planning",
    releaseGoal: "Validate transition automation",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });
  store.upsertWorkItem({
    workItemId: "OPS-03",
    title: "Harness operation friction reduction",
    status: "planning",
    nextAction: "Approve OPS-03 Ready For Code.",
    owner: "planner",
    sourceRef: packetPath,
    metadata: { gateProfile: "contract" }
  });
  store.recordDecision({
    decisionId: "OPS-03-approval",
    title: "OPS-03 Ready For Code",
    decisionNeeded: true,
    impactSummary: "Developer implementation requires user approval.",
    sourceRef: packetPath
  });
  store.upsertArtifact({
    artifactId: "PKT-01_OPS-03_TRANSITION_TEST",
    path: packetPath,
    category: "task_packet",
    title: "OPS-03 transition test packet",
    sourceRef: packetPath
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const preview = runTransition({
    repoRoot,
    dbPath,
    outputDir: repoRoot,
    args: [
      "--transition",
      "planner-to-developer",
      "--work-item",
      "OPS-03",
      "--close-decision",
      "OPS-03-approval"
    ]
  });
  assert.equal(preview.ok, true);
  assert.equal(preview.apply, false);
  assert.equal(preview.toOwner, "developer");
  assert.equal(preview.plannedUpdates.includes(".agents/artifacts/IMPLEMENTATION_PLAN.md"), true);

  const applied = runTransition({
    repoRoot,
    dbPath,
    outputDir: repoRoot,
    args: [
      "--transition",
      "planner-to-developer",
      "--work-item",
      "OPS-03",
      "--gate-profile",
      "contract",
      "--current-focus",
      "OPS-03 implementation",
      "--close-decision",
      "OPS-03-approval",
      "--apply"
    ]
  });

  assert.equal(applied.ok, true);
  assert.equal(applied.apply, true);
  assert.equal(applied.validationReport.ok, true);
  assert.match(
    fs.readFileSync(path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"), "utf8"),
    /\| OPS-03 \| Harness operation friction reduction \| gate profiles and transition automation \| developer \| in_progress \|/
  );
  const taskList = fs.readFileSync(path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"), "utf8");
  assert.match(taskList, /- Next first action: Implement the approved packet scope and hand off to Tester\./);
  assert.match(taskList, /\[planner -> developer\] Planning approved; implementation can proceed\./);
  const currentState = fs.readFileSync(path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"), "utf8");
  assert.match(currentState, /Current Stage: implementation/);
  assert.match(currentState, /`OPS-03` Ready For Code is approved; active handoff is `planner -> developer`\./);
  assert.match(currentState, /\[planner -> developer\] Planning approved; implementation can proceed\./);
  const implementationPlan = fs.readFileSync(path.join(repoRoot, ".agents", "artifacts", "IMPLEMENTATION_PLAN.md"), "utf8");
  assert.match(implementationPlan, /`OPS-03` active handoff is `planner -> developer`\./);
  assert.match(implementationPlan, /Implement the approved packet scope and hand off to Tester\./);
  assert.equal(fs.existsSync(path.join(repoRoot, ".agents", "runtime", "ACTIVE_CONTEXT.json")), true);

  const afterStore = createOperatingStateStore({ dbPath });
  assert.equal(afterStore.getWorkItem("OPS-03").metadata.readyForCode, "approved");
  assert.equal(afterStore.listDecisions({ status: "open", decisionNeeded: true }).length, 0);
  afterStore.close();
});

test("transition refreshes keyed current-state truth notes on tester-to-reviewer handoff", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-transition-truth-note-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");
  const packetPath = "reference/packets/PKT-01_OPS-03_TRANSITION_TRUTH_NOTE_TEST.md";
  writeOpsPacket(repoRoot, packetPath, { gateProfile: "contract", includeManifest: true });
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"),
    [
      "# Current State",
      "",
      "## Snapshot",
      "- Current Stage: verification",
      "- Current Focus: OPS-03 revised implementation complete; Tester verifying design access.",
      "",
      "## Next Recommended Agent",
      "- Tester",
      "",
      "## Open Decisions / Blockers",
      "- `OPS-03` Ready For Code is approved; Tester verification is pending.",
      "",
      "## Current Truth Notes",
      "- `OPS-03` revised developer evidence remains queued for Tester verification.",
      "",
      "## Latest Handoff Summary",
      "- none"
    ].join("\n"),
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"),
    [
      "# Task List",
      "",
      "## Active Locks",
      "| Task ID | Scope | Owner | Status | Started At | Notes |",
      "|---|---|---|---|---|---|",
      "| OPS-03 | Harness operation friction reduction | tester | active | 2026-05-03 | verification |",
      "",
      "## Active Tasks",
      "| Task ID | Title | Scope | Owner | Status | Priority | Depends On | Verification |",
      "|---|---|---|---|---|---|---|---|",
      "| OPS-03 | Harness operation reliability and friction reduction packet | revised OPS-03 closeout | tester | review | P0 | DEV-09 | tester verification pending |",
      "- Next first action: Reviewer should assess revised OPS-03 closeout readiness.",
      "",
      "## Blocked Tasks",
      "| Task ID | Blocker | Owner | Status | Unblock Condition | Verification |",
      "|---|---|---|---|---|---|",
      "| - | None | - | clear | - | - |",
      "",
      "## Completed Tasks",
      "| Task ID | Title | Completed At | Verification | Notes |",
      "|---|---|---|---|---|",
      "| - | None | - | - | - |",
      "",
      "## Handoff Log",
      "- none"
    ].join("\n"),
    "utf8"
  );

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-05-03T01:20:00.000Z") });
  store.setReleaseState({
    currentStage: "verification",
    releaseGateState: "open",
    currentFocus: "OPS-03 revised implementation complete; Tester verifying design access.",
    releaseGoal: "Validate keyed CURRENT_STATE transition refresh",
    sourceRef: packetPath
  });
  store.upsertWorkItem({
    workItemId: "OPS-03",
    title: "Harness operation reliability and friction reduction packet",
    status: "review",
    nextAction: "Reviewer should assess revised OPS-03 closeout readiness.",
    owner: "tester",
    sourceRef: packetPath,
    metadata: { gateProfile: "contract", readyForCode: "approved" }
  });
  store.upsertArtifact({
    artifactId: "PKT-01_OPS-03_TRANSITION_TRUTH_NOTE_TEST",
    path: packetPath,
    category: "task_packet",
    title: "OPS-03 transition truth-note packet",
    sourceRef: packetPath
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const applied = runTransition({
    repoRoot,
    dbPath,
    outputDir: repoRoot,
    args: [
      "--transition",
      "tester-to-reviewer",
      "--work-item",
      "OPS-03",
      "--summary",
      "Tester verification completed.",
      "--next-action",
      "Reviewer should assess revised OPS-03 closeout readiness.",
      "--current-focus",
      "OPS-03 under reviewer closeout assessment.",
      "--apply"
    ]
  });

  assert.equal(applied.ok, true);
  assert.equal(applied.apply, true);
  const currentState = fs.readFileSync(path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"), "utf8");
  assert.doesNotMatch(currentState, /Tester verification is pending/);
  assert.doesNotMatch(currentState, /queued for Tester verification/);
  assert.match(
    currentState,
    /`OPS-03` Ready For Code is approved; active handoff is `tester -> reviewer`\./
  );
  assert.match(
    currentState,
    /`OPS-03` remains the active work item\. Current handoff is `tester -> reviewer`; stage is `review`; gate profile is `contract`\./
  );
});

test("transition applies reviewer-to-developer defaults and preserves Ready For Code state when source is review report", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-transition-review-source-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");
  const packetPath = "reference/packets/PKT-01_OPS-03_TRANSITION_REVIEW_SOURCE_TEST.md";
  writeOpsPacket(repoRoot, packetPath, { gateProfile: "contract", includeManifest: true });
  fs.writeFileSync(
    path.join(repoRoot, "reference", "artifacts", "REVIEW_REPORT.md"),
    "# Review Report\n\n## OPS-03 Finding\n- Reviewer requested remediation.\n",
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"),
    [
      "# Current State",
      "",
      "## Snapshot",
      "- Current Stage: review",
      "- Current Focus: OPS-03 under reviewer closeout assessment.",
      "",
      "## Next Recommended Agent",
      "- Reviewer",
      "",
      "## Open Decisions / Blockers",
      "- `OPS-03` Ready For Code is approved; active handoff is `tester -> reviewer`. Reviewer should assess revised OPS-03 closeout readiness.",
      "",
      "## Current Truth Notes",
      "- `OPS-03` remains the active work item. Current handoff is `tester -> reviewer`; stage is `review`; gate profile is `contract`.",
      "",
      "## Latest Handoff Summary",
      "- none"
    ].join("\n"),
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"),
    [
      "# Task List",
      "",
      "## Active Locks",
      "| Task ID | Scope | Owner | Status | Started At | Notes |",
      "|---|---|---|---|---|---|",
      "| OPS-03 | Harness operation friction reduction | reviewer | active | 2026-05-03 | review |",
      "",
      "## Active Tasks",
      "| Task ID | Title | Scope | Owner | Status | Priority | Depends On | Verification |",
      "|---|---|---|---|---|---|---|---|",
      "| OPS-03 | Harness operation reliability and friction reduction packet | revised OPS-03 closeout | reviewer | review | P0 | DEV-09 | review closeout pending |",
      "- Next first action: Developer should remediate the current-state transition issue.",
      "",
      "## Blocked Tasks",
      "| Task ID | Blocker | Owner | Status | Unblock Condition | Verification |",
      "|---|---|---|---|---|---|",
      "| - | None | - | clear | - | - |",
      "",
      "## Completed Tasks",
      "| Task ID | Title | Completed At | Verification | Notes |",
      "|---|---|---|---|---|",
      "| - | None | - | - | - |",
      "",
      "## Handoff Log",
      "- none"
    ].join("\n"),
    "utf8"
  );

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-05-03T01:25:00.000Z") });
  store.setReleaseState({
    currentStage: "review",
    releaseGateState: "open",
    currentFocus: "OPS-03 under reviewer closeout assessment.",
    releaseGoal: "Validate review-report transition fallback",
    sourceRef: packetPath
  });
  store.upsertWorkItem({
    workItemId: "OPS-03",
    title: "Harness operation reliability and friction reduction packet",
    status: "review",
    nextAction: "Reviewer should assess revised OPS-03 closeout readiness.",
    owner: "reviewer",
    sourceRef: packetPath,
    metadata: { gateProfile: "contract", readyForCode: "approved" }
  });
  store.upsertArtifact({
    artifactId: "PKT-01_OPS-03_TRANSITION_REVIEW_SOURCE_TEST",
    path: packetPath,
    category: "task_packet",
    title: "OPS-03 transition review-source packet",
    sourceRef: packetPath
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const applied = runTransition({
    repoRoot,
    dbPath,
    outputDir: repoRoot,
    args: [
      "--transition",
      "reviewer-to-developer",
      "--work-item",
      "OPS-03",
      "--source-ref",
      "reference/artifacts/REVIEW_REPORT.md",
      "--apply"
    ]
  });

  assert.equal(applied.ok, true);
  assert.equal(applied.apply, true);
  const currentState = fs.readFileSync(path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"), "utf8");
  assert.match(currentState, /Current Stage: implementation/);
  assert.match(currentState, /Current Focus: OPS-03 reviewer finding remediation is in progress\./);
  assert.match(
    currentState,
    /`OPS-03` Ready For Code is approved; active handoff is `reviewer -> developer`\./
  );
  assert.match(
    currentState,
    /`OPS-03` remains the active work item\. Current handoff is `reviewer -> developer`; stage is `implementation`; gate profile is `contract`\./
  );
  assert.doesNotMatch(currentState, /Ready For Code status is ;/);
});

test("transition infers reviewer-to-developer remediation wording for explicit custom owner handoff", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-transition-review-custom-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");
  const packetPath = "reference/packets/PKT-01_OPS-03_TRANSITION_REVIEW_CUSTOM_TEST.md";
  writeOpsPacket(repoRoot, packetPath, { gateProfile: "contract", includeManifest: true });
  fs.writeFileSync(
    path.join(repoRoot, "reference", "artifacts", "REVIEW_REPORT.md"),
    "# Review Report\n\n## OPS-03 Finding\n- Reviewer requested remediation.\n",
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"),
    [
      "# Current State",
      "",
      "## Snapshot",
      "- Current Stage: review",
      "- Current Focus: OPS-03 under reviewer closeout assessment.",
      "",
      "## Next Recommended Agent",
      "- Reviewer",
      "",
      "## Open Decisions / Blockers",
      "- `OPS-03` Ready For Code is approved; active handoff is `tester -> reviewer`. Review implementation, evidence, residual debt, and closeout readiness.",
      "- User approved the remaining remediation scope; Reviewer is assessing closeout under OPS-03.",
      "",
      "## Current Truth Notes",
      "- `OPS-03` remains the active work item. Current handoff is `tester -> reviewer`; stage is `review`; gate profile is `contract`.",
      "- `PKT-01_OPS-03_TRANSITION_REVIEW_CUSTOM_TEST.md` is Ready For Code approved and in Reviewer closeout review.",
      "",
      "## Latest Handoff Summary",
      "- none"
    ].join("\n"),
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"),
    [
      "# Task List",
      "",
      "## Active Locks",
      "| Task ID | Scope | Owner | Status | Started At | Notes |",
      "|---|---|---|---|---|---|",
      "| OPS-03 | Harness operation friction reduction | reviewer | active | 2026-05-03 | review |",
      "",
      "## Active Tasks",
      "| Task ID | Title | Scope | Owner | Status | Priority | Depends On | Verification |",
      "|---|---|---|---|---|---|---|---|",
      "| OPS-03 | Harness operation reliability and friction reduction packet | revised OPS-03 closeout | reviewer | review | P0 | DEV-09 | review closeout pending |",
      "- Next first action: Review implementation, evidence, residual debt, and closeout readiness.",
      "",
      "## Blocked Tasks",
      "| Task ID | Blocker | Owner | Status | Unblock Condition | Verification |",
      "|---|---|---|---|---|---|",
      "| - | None | - | clear | - | - |",
      "",
      "## Completed Tasks",
      "| Task ID | Title | Completed At | Verification | Notes |",
      "|---|---|---|---|---|",
      "| - | None | - | - | - |",
      "",
      "## Handoff Log",
      "- none"
    ].join("\n"),
    "utf8"
  );

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-05-03T01:30:00.000Z") });
  store.setReleaseState({
    currentStage: "review",
    releaseGateState: "open",
    currentFocus: "OPS-03 under reviewer closeout assessment.",
    releaseGoal: "Validate custom remediation transition defaults",
    sourceRef: packetPath
  });
  store.upsertWorkItem({
    workItemId: "OPS-03",
    title: "Harness operation reliability and friction reduction packet",
    status: "review",
    nextAction: "Review implementation, evidence, residual debt, and closeout readiness.",
    owner: "reviewer",
    sourceRef: packetPath,
    metadata: { gateProfile: "contract", readyForCode: "approved" }
  });
  store.upsertArtifact({
    artifactId: "PKT-01_OPS-03_TRANSITION_REVIEW_CUSTOM_TEST",
    path: packetPath,
    category: "task_packet",
    title: "OPS-03 transition review-custom packet",
    sourceRef: packetPath
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const applied = runTransition({
    repoRoot,
    dbPath,
    outputDir: repoRoot,
    args: [
      "--to",
      "developer",
      "--work-item",
      "OPS-03",
      "--source-ref",
      "reference/artifacts/REVIEW_REPORT.md",
      "--apply"
    ]
  });

  assert.equal(applied.ok, true);
  assert.equal(applied.apply, true);
  const currentState = fs.readFileSync(path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"), "utf8");
  assert.match(currentState, /Current Stage: implementation/);
  assert.match(currentState, /Current Focus: OPS-03 reviewer finding remediation is in progress\./);
  assert.match(
    currentState,
    /`OPS-03` Ready For Code is approved; active handoff is `reviewer -> developer`\. Remediate the reviewer finding, rerun tests and validation, and hand off to Tester\./
  );
  assert.match(
    currentState,
    /`OPS-03` remains the active work item\. Current handoff is `reviewer -> developer`; stage is `implementation`; gate profile is `contract`\./
  );
  assert.match(
    currentState,
    /User-approved `OPS-03` scope remains active\. Ready For Code is approved; current handoff is `reviewer -> developer`\. Remediate the reviewer finding, rerun tests and validation, and hand off to Tester\./
  );
  assert.match(
    currentState,
    /`PKT-01_OPS-03_TRANSITION_REVIEW_CUSTOM_TEST\.md` is Ready For Code approved and in Developer implementation\./
  );
  assert.doesNotMatch(currentState, /under reviewer closeout assessment/);
  assert.doesNotMatch(currentState, /Reviewer is assessing closeout under OPS-03/);
});

test("release transition preserves the release-baseline focus prefix", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-transition-release-focus-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");
  const packetPath = "reference/packets/PKT-01_DEV-11_RELEASE_FOCUS_TEST.md";
  writeOpsPacket(repoRoot, packetPath, { gateProfile: "release", includeManifest: true });
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"),
    [
      "# Current State",
      "",
      "## Snapshot",
      "- Current Stage: implementation",
      "- Current Focus: V1.3 CLI-first PMW-free harness baseline is implemented and verified; DEV-11 reviewer finding remediation is in progress.",
      "- Current Release Goal: Preserve the V1.3 installable standard harness baseline while implementing DEV-11 PMW removal and Active Context replacement under the release gate.",
      "",
      "## Next Recommended Agent",
      "- Developer",
      "",
      "## Open Decisions / Blockers",
      "- `DEV-11` Ready For Code is approved; active handoff is `reviewer -> developer`. Remediate the reviewer finding, rerun tests and validation, and hand off to Tester.",
      "- User approved complete PMW removal; Developer is implementing PMW-only procedure removal and the AI-facing / human-facing SSOT split under DEV-11.",
      "",
      "## Current Truth Notes",
      "- `DEV-11` remains the active work item. Current handoff is `reviewer -> developer`; stage is `implementation`; gate profile is `release`.",
      "- `V1.3 CLI-first PMW-free harness baseline is implemented and verified` remains the required release-baseline marker even while DEV-11 remediation is still open.",
      "- `PKT-01_DEV-11_RELEASE_FOCUS_TEST.md` is Ready For Code approved and in Developer implementation.",
      "",
      "## Latest Handoff Summary",
      "- none"
    ].join("\n"),
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"),
    [
      "# Task List",
      "",
      "## Active Locks",
      "| Task ID | Scope | Owner | Status | Started At | Notes |",
      "|---|---|---|---|---|---|",
      "| DEV-11 | CLI-first PMW decommission and active context implementation | developer | active | 2026-05-03 | custom; gate release; Remediate the reviewer finding, rerun tests and validation, and hand off to Tester. |",
      "",
      "## Active Tasks",
      "| Task ID | Title | Scope | Owner | Status | Priority | Depends On | Verification |",
      "|---|---|---|---|---|---|---|---|",
      "| DEV-11 | CLI-first PMW decommission and active context implementation packet | release baseline focus preservation | developer | in_progress | P0 | PLN-09 | gate release; Remediate the reviewer finding, rerun tests and validation, and hand off to Tester. |",
      "- Next first action: Remediate the reviewer finding, rerun tests and validation, and hand off to Tester.",
      "",
      "## Blocked Tasks",
      "| Task ID | Blocker | Owner | Status | Unblock Condition | Verification |",
      "|---|---|---|---|---|---|",
      "| - | None | - | clear | - | - |",
      "",
      "## Completed Tasks",
      "| Task ID | Title | Completed At | Verification | Notes |",
      "|---|---|---|---|---|",
      "| - | None | - | - | - |",
      "",
      "## Handoff Log",
      "- none"
    ].join("\n"),
    "utf8"
  );

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-05-03T02:00:00.000Z") });
  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "V1.3 CLI-first PMW-free harness baseline is implemented and verified; DEV-11 reviewer finding remediation is in progress.",
    releaseGoal: "Preserve the V1.3 installable standard harness baseline while implementing DEV-11 PMW removal and Active Context replacement under the release gate.",
    sourceRef: packetPath,
    metadata: { releaseBaseline: "V1.3" }
  });
  store.upsertWorkItem({
    workItemId: "DEV-11",
    title: "CLI-first PMW decommission and active context implementation packet",
    status: "in_progress",
    nextAction: "Remediate the reviewer finding, rerun tests and validation, and hand off to Tester.",
    owner: "developer",
    sourceRef: packetPath,
    metadata: { gateProfile: "release", readyForCode: "approved" }
  });
  store.upsertArtifact({
    artifactId: "PKT-01_DEV-11_RELEASE_FOCUS_TEST",
    path: packetPath,
    category: "task_packet",
    title: "DEV-11 release focus transition test packet",
    sourceRef: packetPath
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const applied = runTransition({
    repoRoot,
    dbPath,
    outputDir: repoRoot,
    args: ["--transition", "developer-to-tester", "--work-item", "DEV-11", "--apply"]
  });

  const currentState = fs.readFileSync(path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"), "utf8");
  assert.match(
    currentState,
    /Current Focus: V1\.3 CLI-first PMW-free harness baseline is implemented and verified; DEV-11 implementation is ready for Tester verification\./
  );
  assert.match(
    currentState,
    /User-approved `DEV-11` scope remains active\. Ready For Code is approved; current handoff is `developer -> tester`\. Verify the implementation against the packet acceptance criteria\./
  );
  assert.match(
    currentState,
    /`PKT-01_DEV-11_RELEASE_FOCUS_TEST\.md` is Ready For Code approved and in Tester verification\./
  );
});

test("terminal transition closes active task bookkeeping and preserves planner next action", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-transition-closeout-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");
  const packetPath = "reference/packets/PKT-01_OPS-03_TRANSITION_CLOSEOUT_TEST.md";
  writeOpsPacket(repoRoot, packetPath, { gateProfile: "contract", includeManifest: true });
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"),
    [
      "# Current State",
      "",
      "## Snapshot",
      "- Current Stage: planning",
      "- Current Focus: OPS-03 closeout approved; Planner selecting the next lane.",
      "",
      "## Next Recommended Agent",
      "- Planner",
      "",
      "## Open Decisions / Blockers",
      "- `OPS-03` Ready For Code is approved; active handoff is `reviewer -> planner`. Planner should record OPS-03 closeout and choose the next approved lane.",
      "",
      "## Current Truth Notes",
      "- `OPS-03` remains the active work item. Current handoff is `reviewer -> planner`; stage is `planning`; gate profile is `contract`.",
      "",
      "## Latest Handoff Summary",
      "- none"
    ].join("\n"),
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"),
    [
      "# Task List",
      "",
      "## Active Locks",
      "| Task ID | Scope | Owner | Status | Started At | Notes |",
      "|---|---|---|---|---|---|",
      "| OPS-03 | Harness operation reliability and friction reduction | planner | active | 2026-05-03 | reviewer-to-planner closeout pending |",
      "",
      "## Active Tasks",
      "| Task ID | Title | Scope | Owner | Status | Priority | Depends On | Verification |",
      "|---|---|---|---|---|---|---|---|",
      "| OPS-03 | Harness operation reliability and friction reduction packet | revised OPS-03 closeout | planner | planning | P0 | DEV-09 | planner closeout pending |",
      "- Next first action: Planner should record OPS-03 closeout and choose the next approved lane.",
      "",
      "## Blocked Tasks",
      "| Task ID | Blocker | Owner | Status | Unblock Condition | Verification |",
      "|---|---|---|---|---|---|",
      "| - | None | - | clear | - | - |",
      "",
      "## Completed Tasks",
      "| Task ID | Title | Completed At | Verification | Notes |",
      "|---|---|---|---|---|",
      "| - | None | - | - | - |",
      "",
      "## Handoff Log",
      "- none"
    ].join("\n"),
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "PROJECT_PROGRESS.md"),
    [
      "# Project Progress",
      "",
      "## Summary",
      "Transition closeout test board.",
      "",
      "## Progress Board",
      "| Phase | Task ID | Task | Status | Notes | Source |",
      "| --- | --- | --- | --- | --- | --- |",
      `| Ops | OPS-03 | Harness operation reliability and friction reduction | planning | Reviewer approved closeout; planner bookkeeping pending. | ${packetPath} |`
    ].join("\n"),
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "IMPLEMENTATION_PLAN.md"),
    [
      "# Implementation Plan",
      "",
      "## Operator Next Action",
      "- `OPS-03` active handoff is `reviewer -> planner`.",
      "- Planner should record OPS-03 closeout and choose the next approved lane.",
      `- Source packet: \`${packetPath}\`.`,
      "- Preserve packet-before-code, Active Context derived-state boundaries, generated-doc immutability, root/starter sync, Tester/Reviewer separation, and human approval gates."
    ].join("\n"),
    "utf8"
  );

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-05-03T01:40:00.000Z") });
  store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "OPS-03 closeout approved; Planner selecting the next lane.",
    releaseGoal: "Validate planner closeout bookkeeping",
    sourceRef: packetPath
  });
  store.upsertWorkItem({
    workItemId: "OPS-03",
    title: "Harness operation reliability and friction reduction packet",
    status: "planning",
    nextAction: "Planner should record OPS-03 closeout and choose the next approved lane.",
    owner: "planner",
    sourceRef: packetPath,
    metadata: { gateProfile: "contract", readyForCode: "approved" }
  });
  store.upsertArtifact({
    artifactId: "PKT-01_OPS-03_TRANSITION_CLOSEOUT_TEST",
    path: packetPath,
    category: "task_packet",
    title: "OPS-03 transition closeout packet",
    sourceRef: packetPath
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const applied = runTransition({
    repoRoot,
    dbPath,
    outputDir: repoRoot,
    args: [
      "--transition",
      "planner-closeout",
      "--work-item",
      "OPS-03",
      "--from",
      "planner",
      "--to",
      "planner",
      "--status",
      "done",
      "--source-ref",
      packetPath,
      "--summary",
      "Planner recorded OPS-03 closeout after reviewer approval.",
      "--next-action",
      "Planner should choose the next approved lane and open the next packet only after human agreement.",
      "--current-stage",
      "planning",
      "--current-focus",
      "OPS-03 closed; Planner selecting the next approved lane.",
      "--apply"
    ]
  });

  assert.equal(applied.ok, true);
  assert.equal(applied.apply, true);

  const taskList = fs.readFileSync(path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"), "utf8");
  assert.doesNotMatch(taskList, /\| OPS-03 \| Harness operation reliability and friction reduction \| planner \| active \|/);
  assert.doesNotMatch(taskList, /\| OPS-03 \| Harness operation reliability and friction reduction packet \| revised OPS-03 closeout \| planner \| planning \|/);
  assert.match(taskList, /\| - \| None \| - \| clear \| - \| - \|/);
  assert.match(taskList, /\| - \| None \| - \| - \| clear \| - \| - \| - \|/);
  assert.match(
    taskList,
    /\| OPS-03 \| Harness operation reliability and friction reduction packet \| 2026-05-03 \| transition planner -> planner; gate contract \| Planner recorded OPS-03 closeout after reviewer approval\. Planner should choose the next approved lane and open the next packet only after human agreement\. \|/
  );

  const currentState = fs.readFileSync(path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"), "utf8");
  assert.match(
    currentState,
    /`OPS-03` is closed; latest handoff is `planner -> planner`\. Planner should choose the next approved lane and open the next packet only after human agreement\./
  );
  assert.match(
    currentState,
    /`OPS-03` is closed\. Latest handoff is `planner -> planner`; stage is `planning`; gate profile is `contract`\./
  );

  const implementationPlan = fs.readFileSync(path.join(repoRoot, ".agents", "artifacts", "IMPLEMENTATION_PLAN.md"), "utf8");
  assert.match(implementationPlan, /`OPS-03` is closed; latest closeout handoff is `planner -> planner`\./);
  assert.match(implementationPlan, /Planner should choose the next approved lane and open the next packet only after human agreement\./);

  const projectProgress = fs.readFileSync(path.join(repoRoot, ".agents", "artifacts", "PROJECT_PROGRESS.md"), "utf8");
  assert.match(
    projectProgress,
    /\| Ops \| OPS-03 \| Harness operation reliability and friction reduction \| done \| Planner recorded OPS-03 closeout after reviewer approval\. Planner should choose the next approved lane and open the next packet only after human agreement\. \|/
  );

  const afterStore = createOperatingStateStore({ dbPath });
  assert.equal(afterStore.getWorkItem("OPS-03").status, "done");
  assert.equal(afterStore.getWorkItem("OPS-03").metadata.closedBy, "planner");
  afterStore.close();

  const status = buildHarnessStatus({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(status.openWorkItems, 0);
  assert.equal(status.assignment, null);
  assert.equal(status.nextOwner, "Planner");
  assert.equal(
    status.nextAction,
    "Planner should choose the next approved lane and open the next packet only after human agreement."
  );
});

test("validator blocks incomplete workflow contracts", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-workflow-contract-invalid-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");

  fs.writeFileSync(
    path.join(repoRoot, ".agents", "workflows", "plan.md"),
    [
      "# Plan Workflow",
      "",
      "## Role",
      "- Planner",
      "",
      "## Mission",
      "- Own requirements, architecture, implementation plan, and task packet definition."
    ].join("\n"),
    "utf8"
  );

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-04-27T01:45:00.000Z") });
  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "DEV-08 workflow contracts",
    releaseGoal: "Block incomplete workflow contracts",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const result = runValidator({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(result.ok, false);
  assert.equal(
    result.findings.some(
      (item) =>
        item.code === "workflow_contract_section_missing" &&
        item.path === ".agents/workflows/plan.md" &&
        item.section === "## Turn Close Reporting"
    ),
    true
  );
});

test("validator blocks missing reusable agent behavior guidance", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-agent-behavior-invalid-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");

  fs.writeFileSync(
    path.join(repoRoot, ".agents", "skills", "day_start", "SKILL.md"),
    "# Day Start\n\n## Behavior Checks\n- Missing the concrete four-principle behavior markers.\n",
    "utf8"
  );

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-05-03T00:00:00.000Z") });
  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "OPS-03 behavior guidance validation",
    releaseGoal: "Block thin behavior guidance regression",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const result = runValidator({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(result.ok, false);
  assert.equal(
    result.findings.some(
      (item) =>
        item.code === "skill_behavior_guidance_incomplete" &&
        item.path === ".agents/skills/day_start/SKILL.md" &&
        item.marker === "Think Before Coding"
    ),
    true
  );
});

test("handoff resolves from CURRENT_STATE when no open task exists", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-handoff-current-state-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");

  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"),
    [
      "# Current State",
      "",
      "## Next Recommended Agent",
      "- Maintainer validating the next kickoff lane"
    ].join("\n"),
    "utf8"
  );

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-04-27T02:00:00.000Z") });
  store.setReleaseState({
    currentStage: "closed",
    releaseGateState: "approved",
    currentFocus: "Release baseline is closed",
    releaseGoal: "Keep handoff routing explicit",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });
  store.appendHandoff({
    handoffId: "handoff-closed-01",
    handoffSummary: "Closed release handed back to maintainer review.",
    fromRole: "reviewer",
    toRole: "developer",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const status = buildHarnessStatus({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(status.nextOwner, "Maintainer validating the next kickoff lane");

  const handoff = resolveHandoff({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(handoff.ok, true);
  assert.equal(handoff.resolvedBy, "current_state_next_agent");
  assert.equal(handoff.nextOwner, "Maintainer validating the next kickoff lane");
  assert.equal(handoff.workflow, ".agents/workflows/plan.md");
  assert.equal(handoff.workflowDetails?.exists, true);
  assert.equal(handoff.workflowDetails?.role, "Planner");
  assert.deepEqual(handoff.workflowDetails?.missingSections, []);
  assert.deepEqual(handoff.workflowDetails?.readFirst, [
    "`.agents/artifacts/CURRENT_STATE.md`",
    "`.agents/artifacts/TASK_LIST.md`",
    "`.agents/artifacts/REQUIREMENTS.md`"
  ]);
  assert.equal(
    handoff.workflowDetails?.turnCloseReporting.some((item) =>
      item.includes("next concrete work")
    ),
    true
  );
});

test("handoff routes designer owners to the design workflow contract", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dev05-handoff-designer-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");

  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"),
    [
      "# Current State",
      "",
      "## Next Recommended Agent",
      "- Designer resolving the UI evidence contract"
    ].join("\n"),
    "utf8"
  );

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-04-27T02:15:00.000Z") });
  store.setReleaseState({
    currentStage: "closed",
    releaseGateState: "approved",
    currentFocus: "Design handoff routing",
    releaseGoal: "Route designer work to design.md",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const handoff = resolveHandoff({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(handoff.ok, true);
  assert.equal(handoff.workflow, ".agents/workflows/design.md");
  assert.equal(handoff.workflowDetails?.role, "Designer");
  assert.deepEqual(handoff.workflowDetails?.missingSections, []);
});

test("handoff routing rejects ambiguous and substring alias owner values", () => {
  assert.equal(workflowForOwner("developer/tester"), "manual_selection_required");
  assert.equal(workflowForOwner("contest owner"), "manual_selection_required");
  assert.equal(workflowForOwner("npm launcher"), "manual_selection_required");
  assert.equal(workflowForOwner("Developer"), ".agents/workflows/dev.md");
  assert.equal(workflowForOwner("Designer resolving the UI evidence contract"), ".agents/workflows/design.md");
  assert.equal(workflowForOwner("Project Manager coordinating delivery"), ".agents/workflows/pm.md");
  assert.equal(workflowForOwner("PM"), ".agents/workflows/pm.md");
  assert.equal(workflowForOwner("QA verification lane"), ".agents/workflows/test.md");
});

function writeOpsPacket(repoRoot, packetPath, { gateProfile, includeManifest, readyForCode = "approved" }) {
  const readyForCodeApproved = readyForCode === "approved";
  const headerRows = [
    ["Work item", "OPS-03 Harness operation friction reduction", "Reduce state-sync friction", "draft"],
    [
      "Ready For Code",
      readyForCode,
      readyForCodeApproved ? "User approved implementation" : "Implementation approval pending",
      readyForCodeApproved ? "approved" : "draft"
    ],
    ["Human sync needed", "yes", "Gate behavior changes operator process", "approved"],
    ...(gateProfile ? [["Gate profile", gateProfile, "Contract-level harness operation change", "approved"]] : []),
    ["User-facing impact", "medium", "Operator state and Active Context metadata change", "approved"],
    ["Layer classification", "core", "Reusable harness contract", "approved"],
    ["Active profile dependencies", "none", "No optional profile", "not-needed"],
    ["Profile evidence status", "not-needed", "No optional profile", "not-needed"],
    ["UX archetype status", "approved", "Operator-facing metadata surface is covered by existing context archetype", "approved"],
    ["UX deviation status", "none", "No deviation", "approved"],
    ["Environment topology status", "not-needed", "No deploy/cutover", "not-needed"],
    ["Domain foundation status", "not-needed", "No product data schema", "not-needed"],
    ["Authoritative source intake status", "not-needed", "Uses local packet evidence", "not-needed"],
    ["Shared-source wave status", "not-needed", "No source wave", "not-needed"],
    ["Packet exit gate status", "pending", "Implementation pending", "draft"],
    ["Improvement promotion status", "approved", "OPS-03 promoted from preventive memory", "approved"],
    ["Existing system dependency", "none", "No legacy system", "not-needed"],
    ["New authoritative source impact", "none", "No new external source", "not-needed"],
    ["Risk if started now", "low", "Approval boundary closed", "approved"]
  ];
  const manifest = includeManifest
    ? [
        "## Verification Manifest",
        `- Ready For Code: ${readyForCode}`,
        "- root: run root targeted and full tests",
        "- standard-template: run starter targeted and full tests",
        "- targeted: gate profile and transition tests",
        "- validator: run harness validator",
        "- active context: regenerate ACTIVE_CONTEXT artifacts",
        "- review closeout: required before packet close"
      ].join("\n")
    : "";
  const content = [
    "# PKT-01 OPS-03 Transition Test",
    "",
    "## Quick Decision Header",
    "| Item | Proposed | Why | Status |",
    "|---|---|---|---|",
    ...headerRows.map((row) => `| ${row.join(" | ")} |`),
    "",
    "## 1. Goal",
    "- Test OPS-03 gate profile behavior.",
    "",
    "## 3. Proposed Scope",
    "- Layer classification: core",
    "- Required reading before code: `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`, this packet",
    "- UX archetype reference: reference/artifacts/PRODUCT_UX_ARCHETYPE.md",
    "- Selected UX archetype: operator-console-context",
    `- Gate profile: ${gateProfile ?? "pending"}`,
    `- Verification manifest: ${includeManifest ? "contract evidence declared" : "pending"}`,
    "",
    manifest
  ].join("\n");
  fs.writeFileSync(path.join(repoRoot, packetPath), content, "utf8");
}

function seedStandardRepo(repoRoot) {
  fs.mkdirSync(path.join(repoRoot, ".agents", "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "rules"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "runtime", "generated-state-docs"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "skills", "day_start"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "skills", "day_wrap_up"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "workflows"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "reference", "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "reference", "packets"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "reference", "artifacts", "daily"), { recursive: true });

  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "REQUIREMENTS.md"), "# Requirements\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "ARCHITECTURE_GUIDE.md"), "# Architecture\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "IMPLEMENTATION_PLAN.md"), "# Implementation Plan\n\n## Operator Next Action\n- Run DEV-05 tooling.\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "PROJECT_PROGRESS.md"), "# Project Progress\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"), "# Current State\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "PREVENTIVE_MEMORY.md"), "# Preventive Memory\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "rules", "agent_behavior.md"), agentBehaviorGuideFixture(), "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "skills", "day_start", "SKILL.md"), skillBehaviorFixture("Day Start"), "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "skills", "day_wrap_up", "SKILL.md"), skillBehaviorFixture("Day Wrap Up"), "utf8");
  writeWorkflowContractFixtures(repoRoot);
  fs.writeFileSync(path.join(repoRoot, "reference", "artifacts", "UI_DESIGN.md"), "# UI Design\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "artifacts", "SYSTEM_CONTEXT.md"), "# System Context\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "artifacts", "HANDOFF_ARCHIVE.md"), "# Handoff Archive\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "artifacts", "daily", "2026-04-19.md"), "# Daily\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "artifacts", "daily", "2026-04-20.md"), "# Daily\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "packets", "PKT-01_DEV-04_PMW_READ_SURFACE.md"), "# Packet\n", "utf8");
  seedProfileAwareValidatorFixtures(repoRoot);
}

function writeWorkflowContractFixtures(repoRoot) {
  const fixtures = [
    {
      fileName: "deploy.md",
      title: "Deploy Workflow",
      role: "Deployer",
      mustRead: ["`.agents/artifacts/CURRENT_STATE.md`", "`.agents/artifacts/TASK_LIST.md`"]
    },
    {
      fileName: "design.md",
      title: "Design Workflow",
      role: "Designer",
      mustRead: ["`.agents/artifacts/CURRENT_STATE.md`", "`reference/artifacts/UI_DESIGN.md`"]
    },
    {
      fileName: "dev.md",
      title: "Developer Workflow",
      role: "Developer",
      mustRead: ["`.agents/artifacts/CURRENT_STATE.md`", "`.agents/artifacts/TASK_LIST.md`"]
    },
    {
      fileName: "docu.md",
      title: "Documentation Workflow",
      role: "Documenter",
      mustRead: ["`.agents/artifacts/CURRENT_STATE.md`", "`.agents/artifacts/PROJECT_PROGRESS.md`"]
    },
    {
      fileName: "handoff.md",
      title: "Handoff Workflow",
      role: "Handoff Router",
      mustRead: ["`.agents/artifacts/CURRENT_STATE.md`", "`.agents/artifacts/TASK_LIST.md`"]
    },
    {
      fileName: "pm.md",
      title: "Project Manager Workflow",
      role: "Project Manager",
      mustRead: [
        "`.agents/artifacts/CURRENT_STATE.md`",
        "`.agents/artifacts/TASK_LIST.md`",
        "`.agents/artifacts/PROJECT_PROGRESS.md`"
      ]
    },
    {
      fileName: "plan.md",
      title: "Plan Workflow",
      role: "Planner",
      mustRead: [
        "`.agents/artifacts/CURRENT_STATE.md`",
        "`.agents/artifacts/TASK_LIST.md`",
        "`.agents/artifacts/REQUIREMENTS.md`"
      ]
    },
    {
      fileName: "review.md",
      title: "Review Workflow",
      role: "Reviewer",
      mustRead: ["`.agents/artifacts/CURRENT_STATE.md`", "`.agents/artifacts/TASK_LIST.md`"]
    },
    {
      fileName: "test.md",
      title: "Test Workflow",
      role: "Tester",
      mustRead: ["`.agents/artifacts/CURRENT_STATE.md`", "`.agents/artifacts/TASK_LIST.md`"]
    }
  ];

  for (const fixture of fixtures) {
    fs.writeFileSync(
      path.join(repoRoot, ".agents", "workflows", fixture.fileName),
      buildWorkflowContract(fixture),
      "utf8"
    );
  }
}

function buildWorkflowContract({ title, role, mustRead }) {
  return [
    `# ${title}`,
    "",
    "## Role",
    `- ${role}`,
    "",
    "## Mission",
    "- Own the lane-specific work and keep governance state explicit.",
    "",
    "## Behavior Contract",
    "- Apply `.agents/rules/agent_behavior.md` before state-changing work.",
    "- Use `Think Before Coding`, `Simplicity First`, `Surgical Changes`, and `Goal-Driven Execution` as the default execution checks.",
    "- Treat the human-and-Planner-approved project design SSOT as binding; surface conflicts instead of silently resolving them.",
    "",
    "## Authority",
    "- Update artifacts inside the workflow lane after required approvals are present.",
    "",
    "## Non-Authority",
    "- Do not bypass another workflow's required approval gate.",
    "",
    "## Must Read SSOT",
    ...mustRead.map((item) => `- ${item}`),
    "",
    "## Allowed Actions",
    "- Execute the approved lane scope and record evidence.",
    "",
    "## Forbidden Actions",
    "- Do not edit derived generated-state docs manually.",
    "",
    "## Required Outputs",
    "- Updated canonical artifacts and validation evidence.",
    "",
    "## Turn Close Reporting",
    "- Report what was done in this turn.",
    "- Report the next recommended agent workflow.",
    "- Report the next concrete work for that workflow, or `None` if no work remains.",
    "",
    "## Handoff Rules",
    "- Route to the workflow that owns the next unresolved task.",
    "",
    "## Stop Conditions",
    "- Stop when required approval or missing source evidence blocks execution.",
    "",
    "## Escalation Rules",
    "- Ask the user when governance state and requested execution conflict."
  ].join("\n");
}

function agentBehaviorGuideFixture() {
  return [
    "# Agent Behavior Contract",
    "",
    "## Think Before Coding",
    "- Surface assumptions and ambiguity.",
    "",
    "## Simplicity First",
    "- Keep the approved solution small.",
    "",
    "## Surgical Changes",
    "- Change only lines tied to the approved request.",
    "",
    "## Goal-Driven Execution",
    "- Verify against concrete success criteria.",
    "",
    "## Project Design SSOT Precedence",
    "- Developer implements to the approved design.",
    "- Tester verifies against the approved design.",
    "- Reviewer checks evidence and source parity.",
    "- Active Context derived summaries must not become write authority."
  ].join("\n");
}

function skillBehaviorFixture(title) {
  return [
    `# ${title}`,
    "",
    "## Behavior Checks",
    "- Apply `.agents/rules/agent_behavior.md` before recommending non-trivial work.",
    "- Use `Think Before Coding` to surface assumptions.",
    "- Use `Simplicity First` to keep recommendations small.",
    "- Use `Surgical Changes` to avoid unrelated cleanup.",
    "- Use `Goal-Driven Execution` to define concrete checks.",
    "- Treat the approved project design SSOT as binding."
  ].join("\n");
}

function seedStarterRepo(repoRoot) {
  const starterRoot = detectStarterRoot();
  fs.cpSync(starterRoot, repoRoot, { recursive: true });
  resetCopiedStarterToFreshState(repoRoot);
}

function detectStarterRoot() {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
  const nestedStarter = path.join(repoRoot, "standard-template");
  return fs.existsSync(path.join(nestedStarter, "AGENTS.md")) ? nestedStarter : repoRoot;
}

function createClock(startIso) {
  let offset = 0;
  const base = Date.parse(startIso);
  return () => new Date(base + offset++ * 1000).toISOString();
}

function resetCopiedStarterToFreshState(repoRoot) {
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"),
    "# Current State\n\n## Snapshot\n- Current Stage: not started\n\n## Open Decisions / Blockers\n- Run `INIT_STANDARD_HARNESS.cmd` or `npm run harness:init` before real work begins.\n",
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"),
    "# Task List\n\n## Active Tasks\n| Task ID | Title | Scope | Owner | Status | Priority | Depends On | Verification |\n|---|---|---|---|---|---|---|---|\n| BOOT-00 | Initialize copied starter | starter bootstrap | project operator | starter_pending | P0 | `INIT_STANDARD_HARNESS.cmd` or `npm run harness:init` | generated docs and validation guidance |\n- Run `INIT_STANDARD_HARNESS.cmd` or `npm run harness:init` before real work begins.\n",
    "utf8"
  );
  for (const suffix of ["", "-shm", "-wal"]) {
    fs.rmSync(path.join(repoRoot, ".harness", `operating_state.sqlite${suffix}`), { force: true });
  }
}
