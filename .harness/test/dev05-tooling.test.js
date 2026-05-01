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
  resolveHandoff,
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

function seedStandardRepo(repoRoot) {
  fs.mkdirSync(path.join(repoRoot, ".agents", "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "runtime", "generated-state-docs"), { recursive: true });
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
