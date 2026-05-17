import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { resolveHandoff, runTransition, runValidator } from "../runtime/state/dev05-tooling.js";
import { createOperatingStateStore } from "../runtime/state/operating-state-store.js";
import { workflowForOwner } from "../runtime/state/workflow-routing.js";
import { createClock, seedStandardRepo, writeOpsPacket, writeStateSurfaces } from "./dev05-test-helpers.js";

test("handoff regenerates CURRENT_STATE route hints from canonical state when live authority is absent", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "workflow-governance-handoff-current-state-ignored-"));
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
  writeStateSurfaces({ store, repoRoot });
  store.close();

  const handoff = resolveHandoff({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(handoff.ok, true);
  assert.equal(handoff.resolvedBy, "default_planner");
  assert.equal(handoff.currentStateNextAgent, "Planner");
  assert.equal(handoff.workflow, ".agents/workflows/plan.md");
  assert.equal(handoff.workflowDetails?.role, "Planner");
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

test("planner fallback blocks mutating work when the route only resolves through latest handoff", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "workflow-governance-fallback-blocked-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-05-14T10:00:00.000Z") });
  store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "Planner fallback guard",
    releaseGoal: "Stop guessed mutating planner routes",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });
  store.upsertWorkItem({
    workItemId: "OPS-18",
    title: "Workflow gates by starter mode",
    status: "planning",
    nextAction: "Implement the approved packet scope.",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  store.appendHandoff({
    handoffId: "ops-18-latest-to-planner",
    handoffSummary: "Planner should inspect the next step.",
    fromRole: "reviewer",
    toRole: "planner",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md",
    payload: {
      nextFirstAction: "Implement the approved packet scope."
    }
  });
  writeStateSurfaces({ store, repoRoot });
  store.close();

  const handoff = resolveHandoff({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(handoff.ok, false);
  assert.equal(handoff.routeStatus, "planner_fallback_blocked");
  assert.equal(handoff.workflow, ".agents/workflows/plan.md");
  assert.equal(handoff.workflowDetails?.role, "Planner");

  const activeContext = JSON.parse(
    fs.readFileSync(path.join(repoRoot, ".agents", "runtime", "ACTIVE_CONTEXT.json"), "utf8")
  );
  assert.equal(activeContext.nextWork.workflow, null);
  assert.equal(activeContext.nextWork.workflowRouteStatus, "planner_fallback_blocked");

  const validation = runValidator({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(
    validation.findings.some((finding) => finding.code === "active_context_route_mismatch"),
    false
  );
  assert.equal(
    validation.findings.some(
      (finding) =>
        finding.code === "active_context_must_read_missing" &&
        finding.requiredPath === ".agents/workflows/plan.md"
    ),
    false
  );
});

test("planner fallback allows non-mutating planning work when the route resolves through latest handoff", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "workflow-governance-fallback-allowed-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-05-14T10:05:00.000Z") });
  store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "Planner fallback allowance",
    releaseGoal: "Allow planning-only fallback",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });
  store.upsertWorkItem({
    workItemId: "OPS-18",
    title: "Workflow gates by starter mode",
    status: "planning",
    nextAction: "Review scope and decompose follow-up work.",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  store.appendHandoff({
    handoffId: "ops-18-latest-to-planner-allowed",
    handoffSummary: "Planner should review scope.",
    fromRole: "reviewer",
    toRole: "planner",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md",
    payload: {
      nextFirstAction: "Review scope and decompose follow-up work."
    }
  });
  writeStateSurfaces({ store, repoRoot });
  store.close();

  const handoff = resolveHandoff({ repoRoot, dbPath, outputDir: repoRoot });
  assert.equal(handoff.ok, true);
  assert.equal(handoff.routeStatus, "ready");
  assert.equal(handoff.workflow, ".agents/workflows/plan.md");
});

test("transition apply writes compact baton fields into handoff payload and active context", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "workflow-governance-compact-baton-"));
  seedStandardRepo(repoRoot);
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");
  const packetPath = "reference/packets/PKT-01_OPS-18_TRANSITION_BATON_TEST.md";
  writeOpsPacket(repoRoot, packetPath, {
    gateProfile: "contract",
    includeManifest: true,
    packetTitle: "PKT-01 OPS-18 Transition baton test",
    workItemTitle: "OPS-18 Workflow gates by starter mode"
  });

  const store = createOperatingStateStore({ dbPath, now: createClock("2026-05-14T10:10:00.000Z") });
  store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "OPS-18 compact baton enforcement",
    releaseGoal: "Persist compact baton fields",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });
  store.upsertWorkItem({
    workItemId: "OPS-18",
    title: "Workflow gates by starter mode",
    status: "planning",
    nextAction: "Decide whether Ready For Code can close.",
    owner: "planner",
    sourceRef: packetPath,
    metadata: { gateProfile: "contract", readyForCode: "approved" }
  });
  store.recordDecision({
    decisionId: "OPS-18-ready-for-code",
    title: "OPS-18 Ready For Code",
    decisionNeeded: true,
    impactSummary: "Developer handoff requires explicit approval closure.",
    sourceRef: packetPath
  });
  writeStateSurfaces({ store, repoRoot });
  store.close();

  const applied = runTransition({
    repoRoot,
    dbPath,
    outputDir: repoRoot,
    args: [
      "--transition",
      "planner-to-developer",
      "--work-item",
      "OPS-18",
      "--close-decision",
      "OPS-18-ready-for-code",
      "--apply"
    ]
  });

  assert.equal(applied.apply, true);
  const afterStore = createOperatingStateStore({ dbPath });
  const handoff = afterStore.listRecentHandoffs(1)[0];
  afterStore.close();
  assert.equal(handoff?.payload?.nextWorkflow, ".agents/workflows/dev.md");
  assert.equal(typeof handoff?.payload?.approvalBoundary, "string");
  assert.deepEqual(handoff?.payload?.requiredSsot, [
    ".agents/artifacts/CURRENT_STATE.md",
    ".agents/artifacts/TASK_LIST.md",
    ".agents/artifacts/IMPLEMENTATION_PLAN.md",
    packetPath
  ]);
  assert.equal(Array.isArray(handoff?.payload?.doNotCross), true);
  assert.equal(handoff?.payload?.doNotCross.includes("No approval-state changes."), true);

  const activeContext = JSON.parse(
    fs.readFileSync(path.join(repoRoot, ".agents", "runtime", "ACTIVE_CONTEXT.json"), "utf8")
  );
  assert.equal(activeContext.nextWork.workflow, ".agents/workflows/dev.md");
  assert.equal(activeContext.nextWork.approvalBoundary, handoff?.payload?.approvalBoundary);
  assert.deepEqual(activeContext.nextWork.requiredSsot, [
    ".agents/artifacts/IMPLEMENTATION_PLAN.md",
    packetPath
  ]);
  assert.deepEqual(activeContext.nextWork.doNotCross, handoff?.payload?.doNotCross);
});
