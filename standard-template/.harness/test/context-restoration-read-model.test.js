import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createOperatingStateStore } from "../runtime/state/operating-state-store.js";
import { writeGeneratedStateDocs } from "../runtime/state/generate-state-docs.js";
import {
  buildContextRestorationReadModel,
  IMPLEMENTATION_PLAN_DOC,
  OPERATOR_NEXT_ACTION_SECTION,
  PROJECT_PROGRESS_DOC
} from "../runtime/state/context-restoration-read-model.js";
import { seedProfileAwareValidatorFixtures } from "./profile-aware-validator-fixtures.js";

test("builds a fresh context restoration read model from designated summary sources", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-read-model-"));
  seedRepoFiles(repoRoot, {
    operatorSection: [
      "- Implement `DEV-03` context restoration read model.",
      "- Keep stale diagnostics and source trace in the read model.",
      "- Source packet: `reference/packets/PKT-01_DEV-03_CONTEXT_RESTORATION_READ_MODEL.md`."
    ]
  });

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T17:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Build context restoration read model",
    releaseGoal: "First ship baseline",
    sourceRef: ".agents/artifacts/ARCHITECTURE_GUIDE.md"
  });
  store.recordDecision({
    decisionId: "DEC-03",
    title: "Finalize context restoration load order",
    decisionNeeded: true,
    impactSummary: "PMW reads this contract on first view",
    sourceRef: ".agents/artifacts/ARCHITECTURE_GUIDE.md"
  });
  store.recordGateRisk({
    riskId: "RISK-03",
    title: "Read model not yet implemented",
    severity: "high",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  store.upsertWorkItem({
    workItemId: "DEV-03",
    title: "Context restoration read model",
    status: "in_progress",
    nextAction: "Implement designated summary parser",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md",
    owner: "developer"
  });
  store.appendHandoff({
    handoffId: "handoff-03",
    handoffSummary: "DEV-03 is ready for implementation.",
    fromRole: "planner",
    toRole: "developer",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const model = buildContextRestorationReadModel({
    store,
    repoRoot,
    outputDir: repoRoot
  });

  assert.equal(model.freshness.status, "fresh");
  assert.equal(model.surfaces.decisionRequired.headline, "Finalize context restoration load order");
  assert.equal(model.surfaces.decisionRequired.supportingText, "1 open decision require attention.");
  assert.equal(model.surfaces.blockedAtRisk.headline, "Read model not yet implemented");
  assert.equal(model.surfaces.currentFocus.headline, "Build context restoration read model");
  assert.equal(model.surfaces.nextAction.headline, "Implement `DEV-03` context restoration read model.");
  assert.equal(model.surfaces.nextAction.source.path, IMPLEMENTATION_PLAN_DOC);
  assert.equal(model.projectOverviewBand.heading, "Project Overview Band");
  assert.equal(model.projectOverviewBand.metrics.totalTracked, 2);
  assert.equal(model.projectOverviewBand.phaseDetails[0].phase, "Planning");
  assert.equal(model.projectOverviewBand.phaseDetails[0].completedItems[0].taskId, "PLN-03");
  assert.equal(model.projectOverviewBand.phaseDetails[1].remainingItems[0].taskId, "DEV-03");
  assert.equal(model.actionBoard.cards.currentTask.owner, "developer");
  assert.equal(model.reEntryBaton.targetWorkflow, ".agents/workflows/dev.md");
  assert.equal(model.artifactLibrary.groups.length, 4);
  assert.equal(model.artifactLibrary.groups[0].items[0].path, ".agents/artifacts/CURRENT_STATE.md");
  assert.equal(model.artifactLibrary.groups[1].id, "project_design_overview");
  assert.deepEqual(
    model.artifactLibrary.groups[1].items.slice(0, 3).map((item) => item.path),
    [
      ".agents/artifacts/REQUIREMENTS.md",
      ".agents/artifacts/ARCHITECTURE_GUIDE.md",
      ".agents/artifacts/IMPLEMENTATION_PLAN.md"
    ]
  );
  assert.equal(model.operatorCommands.selectionMode, "selected_project");
  assert.equal(model.operatorCommands.logRetention, "session");
  assert.deepEqual(
    model.operatorCommands.phaseOne.map((command) => command.id),
    ["status", "next", "explain", "validate", "handoff", "pmw-export"]
  );
  assert.deepEqual(
    model.operatorCommands.terminalOnly.map((command) => command.id),
    ["doctor", "test", "validation-report", "transition"]
  );
  assert.equal(model.operatorCommands.terminalOnly[1].command, "npm test");
  assert.equal(model.recentHandoff.headline, "DEV-03 is ready for implementation.");
  const routeDiagnostic = model.diagnostics.find((finding) => finding.code === "handoff_route");
  assert.equal(routeDiagnostic?.severity, "info");
  assert.equal(routeDiagnostic?.owner, "developer");
  assert.equal(routeDiagnostic?.workflow, ".agents/workflows/dev.md");
  assert.deepEqual(model.loadOrder, [
    "release_state_and_generation_metadata",
    "open_decisions_gate_risks_and_next_action",
    "recent_handoff_and_designated_summary",
    "source_trace",
    "stale_diagnostics"
  ]);

  store.close();
});

test("falls back to needs source when operator next action section is missing", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-read-model-missing-"));
  seedRepoFiles(repoRoot);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T18:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Build context restoration read model",
    releaseGoal: "First ship baseline",
    sourceRef: ".agents/artifacts/ARCHITECTURE_GUIDE.md"
  });
  store.upsertWorkItem({
    workItemId: "DEV-03",
    title: "Context restoration read model",
    status: "in_progress",
    nextAction: "Implement designated summary parser",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const model = buildContextRestorationReadModel({
    store,
    repoRoot,
    outputDir: repoRoot
  });

  assert.equal(model.surfaces.nextAction.status, "needs_source");
  assert.equal(model.surfaces.nextAction.headline, "needs source");
  assert.equal(model.diagnostics.some((finding) => finding.code === "designated_summary_missing"), true);

  store.close();
});

test("action board derives next task workflow from the next task owner", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-read-model-next-task-route-"));
  seedRepoFiles(repoRoot, {
    operatorSection: [
      "- Review `DEV-08` packet exit evidence.",
      "- Then continue planner-owned `PLN-07`."
    ]
  });

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-05-02T09:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "review",
    releaseGateState: "open",
    currentFocus: "Review DEV-08 packet exit",
    releaseGoal: "V1.3 workflow contracts",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });
  store.upsertWorkItem({
    workItemId: "PLN-07",
    title: "V1.3 PMW operator console and workflow-contract planning",
    status: "in_progress",
    nextAction: "Select the next V1.3 planning step.",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md",
    owner: "planner"
  });
  store.upsertWorkItem({
    workItemId: "DEV-08",
    title: "Workflow contracts and handoff routing packet",
    status: "ready_for_review",
    nextAction: "Review packet exit evidence.",
    sourceRef: "reference/packets/PKT-01_DEV-08_WORKFLOW_CONTRACTS_AND_HANDOFF_ROUTING.md",
    owner: "reviewer"
  });
  store.appendHandoff({
    handoffId: "handoff-dev-08-reviewer",
    handoffSummary: "DEV-08 is ready for reviewer closeout.",
    fromRole: "tester",
    toRole: "reviewer",
    sourceRef: ".agents/artifacts/TASK_LIST.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const model = buildContextRestorationReadModel({
    store,
    repoRoot,
    outputDir: repoRoot
  });

  assert.equal(model.actionBoard.cards.currentTask.taskId, "DEV-08");
  assert.equal(model.actionBoard.cards.currentTask.owner, "reviewer");
  assert.equal(model.actionBoard.cards.currentTask.workflow, ".agents/workflows/review.md");
  assert.equal(model.actionBoard.cards.nextTask.taskId, "PLN-07");
  assert.equal(model.actionBoard.cards.nextTask.owner, "planner");
  assert.equal(model.actionBoard.cards.nextTask.workflow, ".agents/workflows/plan.md");

  store.close();
});

test("surfaces missing workflow files in handoff diagnostics", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-read-model-missing-workflow-"));
  seedRepoFiles(repoRoot, {
    operatorSection: [
      "- Continue developer remediation.",
      "- Missing workflow files must not appear as ready."
    ]
  });

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T18:30:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Build context restoration read model",
    releaseGoal: "First ship baseline",
    sourceRef: ".agents/artifacts/ARCHITECTURE_GUIDE.md"
  });
  store.upsertWorkItem({
    workItemId: "DEV-03",
    title: "Context restoration read model",
    status: "in_progress",
    nextAction: "Implement designated summary parser",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md",
    owner: "developer"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const model = buildContextRestorationReadModel({
    store,
    repoRoot,
    outputDir: repoRoot
  });

  const routeDiagnostic = model.diagnostics.find((finding) => finding.code === "handoff_route");
  assert.equal(routeDiagnostic?.workflow, ".agents/workflows/dev.md");
  assert.equal(routeDiagnostic?.routeStatus, "workflow_missing");
  assert.equal(routeDiagnostic?.workflowDetailsExists, false);
  assert.equal(model.reEntryBaton.routeStatus, "workflow_missing");

  store.close();
});

test("surfaces stale diagnostics when generated docs drift from DB truth", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-read-model-stale-"));
  seedRepoFiles(repoRoot, {
    operatorSection: [
      "- Implement `DEV-03` context restoration read model.",
      "- Keep stale diagnostics and source trace in the read model."
    ]
  });

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T19:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Build context restoration read model",
    releaseGoal: "First ship baseline",
    sourceRef: ".agents/artifacts/ARCHITECTURE_GUIDE.md"
  });
  store.recordDecision({
    decisionId: "DEC-03",
    title: "Finalize context restoration load order",
    decisionNeeded: true,
    impactSummary: "PMW reads this contract on first view",
    sourceRef: ".agents/artifacts/ARCHITECTURE_GUIDE.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  store.recordGateRisk({
    riskId: "RISK-03",
    title: "Generated docs are stale",
    severity: "high",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });

  const model = buildContextRestorationReadModel({
    store,
    repoRoot,
    outputDir: repoRoot
  });

  const findingCodes = new Set(model.freshness.findings.map((finding) => finding.code));
  assert.equal(model.freshness.status, "stale");
  assert.equal(model.freshness.cutoverReady, false);
  assert.equal(findingCodes.has("freshness_drift_detected"), true);
  assert.equal(findingCodes.has("cutover_preflight_failed"), true);

  store.close();
});

function seedRepoFiles(repoRoot, { operatorSection = null } = {}) {
  fs.mkdirSync(path.join(repoRoot, ".agents", "artifacts"), { recursive: true });
  seedProfileAwareValidatorFixtures(repoRoot);
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "REQUIREMENTS.md"), "# REQUIREMENTS\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "ARCHITECTURE_GUIDE.md"), "# ARCHITECTURE\n", "utf8");

  const implementationPlanContent = [
    "# Implementation Plan",
    "",
    "## Technical Facts",
    "- DEV-03 context restoration read model is active."
  ];

  if (operatorSection) {
    implementationPlanContent.push("", OPERATOR_NEXT_ACTION_SECTION, ...operatorSection);
  }

  fs.writeFileSync(
    path.join(repoRoot, IMPLEMENTATION_PLAN_DOC),
    implementationPlanContent.join("\n"),
    "utf8"
  );

  fs.writeFileSync(
    path.join(repoRoot, PROJECT_PROGRESS_DOC),
    [
      "# Project Progress",
      "",
      "## Progress Board",
      "| Phase | Task ID | Task | Status | Notes | Source |",
      "| --- | --- | --- | --- | --- | --- |",
      "| Planning | PLN-03 | Context restoration planning | done | closed | .agents/artifacts/IMPLEMENTATION_PLAN.md |",
      "| Build | DEV-03 | Context restoration read model | in_progress | active | reference/packets/PKT-01_DEV-03_CONTEXT_RESTORATION_READ_MODEL.md |"
    ].join("\n"),
    "utf8"
  );
}

function createClock(startIso) {
  let offset = 0;
  const base = Date.parse(startIso);
  return () => new Date(base + offset++ * 1000).toISOString();
}
