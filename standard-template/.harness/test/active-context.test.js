import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { buildActiveContext, writeActiveContext } from "../runtime/state/active-context.js";
import { createOperatingStateStore } from "../runtime/state/operating-state-store.js";
import { writeGeneratedStateDocs } from "../runtime/state/generate-state-docs.js";

test("active context writes compact JSON and Korean Markdown re-entry state with contract metadata", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "active-context-"));
  fs.mkdirSync(path.join(repoRoot, ".agents", "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "runtime", "generated-state-docs"), { recursive: true });
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");
  const store = createOperatingStateStore({ dbPath, now: clock("2026-05-03T09:00:00.000Z") });

  store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "Active context re-entry baseline",
    releaseGoal: "Keep re-entry cheap and deterministic.",
    sourceRef: "reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md"
  });
  store.upsertWorkItem({
    workItemId: "CTX-01",
    title: "Active context baseline",
    status: "in_progress",
    owner: "developer",
    nextAction: "Implement active context.",
    sourceRef: "reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md",
    metadata: { gateProfile: "release", readyForCode: "approved" }
  });
  store.appendHandoff({
    handoffId: "handoff-ctx-01",
    handoffSummary: "CTX-01 handed to Developer.",
    fromRole: "planner",
    toRole: "developer",
    sourceRef: "reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md",
    payload: { nextFirstAction: "Implement active context." }
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const result = writeActiveContext({ store, repoRoot, outputDir: repoRoot });
  store.close();
  const reopened = createOperatingStateStore({ dbPath });

  assert.equal(result.ok, true);
  assert.equal(result.context.activeTask.workItemId, "CTX-01");
  assert.equal(result.context.selectedLane.workflow, ".agents/workflows/dev.md");
  assert.equal(result.context.nextWork.workflow, ".agents/workflows/dev.md");
  assert.equal(result.context.reentryContract.firstRead, ".agents/runtime/ACTIVE_CONTEXT.json");
  assert.equal(result.context.reentryContract.mustReadNext.includes(".agents/artifacts/CURRENT_STATE.md"), false);
  assert.equal(result.context.reentryContract.mustReadNext.includes(".agents/artifacts/TASK_LIST.md"), false);
  assert.equal(result.context.nextWork.requiredSsot.includes(".agents/artifacts/IMPLEMENTATION_PLAN.md"), false);
  assert.equal(result.context.reentryContract.mustReadNext.includes(".agents/artifacts/IMPLEMENTATION_PLAN.md"), false);
  assert.equal(typeof result.context.reentryContract.digest, "string");
  assert.equal(result.context.sources.generatedCurrentState, ".agents/runtime/generated-state-docs/CURRENT_STATE.md");
  assert.equal(fs.existsSync(path.join(repoRoot, ".agents", "runtime", "ACTIVE_CONTEXT.json")), true);
  assert.equal(fs.existsSync(path.join(repoRoot, ".agents", "runtime", "ACTIVE_CONTEXT.md")), true);
  assert.equal(reopened.getGenerationState(".agents/runtime/ACTIVE_CONTEXT.json")?.freshnessState, "fresh");
  assert.equal(reopened.getGenerationState(".agents/runtime/ACTIVE_CONTEXT.md")?.freshnessState, "fresh");
  reopened.close();
  assert.match(fs.readFileSync(path.join(repoRoot, ".agents", "runtime", "ACTIVE_CONTEXT.md"), "utf8"), /## 시작 계약/);
  assert.match(fs.readFileSync(path.join(repoRoot, ".agents", "runtime", "ACTIVE_CONTEXT.md"), "utf8"), /## 먼저 다시 읽을 항목/);
});

test("active context exposes no deprecated external read-model dependency", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "active-context-no-deprecated-read-model-"));
  const store = createOperatingStateStore({ dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite") });
  store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "No external read model",
    releaseGoal: "Use CLI context.",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });

  const context = buildActiveContext({ store, repoRoot });
  store.close();

  assert.equal(JSON.stringify(context).includes("external-read-model"), false);
  assert.equal(JSON.stringify(context).includes("project-manifest"), false);
});

test("active context reuses executedAt from persisted validation reports", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "active-context-validation-report-"));
  fs.mkdirSync(path.join(repoRoot, ".agents", "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "runtime", "generated-state-docs"), { recursive: true });
  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: clock("2026-05-03T10:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Reload validation report metadata",
    releaseGoal: "Preserve executedAt in active context fallback reads.",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "VALIDATION_REPORT.json"),
    `${JSON.stringify(
      {
        ok: true,
        command: "validation-report",
        report: {
          ok: true,
          cutoverReady: true,
          findings: [],
          gateDecision: "pass",
          executedAt: "2026-05-03T10:05:00.000Z"
        }
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const result = writeActiveContext({
    store,
    repoRoot,
    outputDir: repoRoot,
    validation: {
      ok: true,
      cutoverReady: true,
      findings: [],
      gateDecision: "pass"
    }
  });
  store.close();

  assert.equal(result.context.validation?.gateDecision, "pass");
  assert.equal(result.context.validation?.executedAt, "2026-05-03T10:05:00.000Z");
});

test("active context ignores a DB-open work item that canonical TASK_LIST already marks completed", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "active-context-closeout-parity-"));
  fs.mkdirSync(path.join(repoRoot, ".agents", "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "runtime", "generated-state-docs"), { recursive: true });
  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: clock("2026-05-04T11:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "QLT-02 closed; Planner selecting the next lane.",
    releaseGoal: "Keep ACTIVE_CONTEXT aligned with canonical closeout state.",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });
  store.upsertWorkItem({
    workItemId: "QLT-02",
    title: "Evidence validation, semantic trace, and agent eval / CI gating",
    status: "planning",
    owner: "planner",
    nextAction: "Planner should record QLT-02 closeout and choose the next approved lane.",
    sourceRef: "reference/packets/PKT-01_QLT-02_CLOSEOUT_TEST.md",
    metadata: { gateProfile: "contract", readyForCode: "approved" }
  });
  store.appendHandoff({
    handoffId: "qlt-02-planner-closeout",
    handoffSummary: "Planner recorded QLT-02 closeout after reviewer approval.",
    fromRole: "planner",
    toRole: "planner",
    sourceRef: "reference/packets/PKT-01_QLT-02_CLOSEOUT_TEST.md",
    payload: {
      nextFirstAction: "Planner should choose the next approved lane and open the next packet only after human agreement."
    }
  });

  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"),
    [
      "# Current State",
      "",
      "## Must Read Next",
      "- `.agents/artifacts/REQUIREMENTS.md`"
    ].join("\n"),
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"),
    [
      "# Task List",
      "",
      "## Active Tasks",
      "| Task ID | Title | Scope | Owner | Status | Priority | Depends On | Verification |",
      "|---|---|---|---|---|---|---|---|",
      "| - | None | - | - | clear | - | - | - |",
      "",
      "## Completed Tasks",
      "| Task ID | Title | Completed At | Verification | Notes |",
      "|---|---|---|---|---|",
      "| QLT-02 | Evidence validation, semantic trace, and agent eval / CI gating | 2026-05-04 | transition planner -> planner; gate contract | Planner recorded QLT-02 closeout after reviewer approval. |"
    ].join("\n"),
    "utf8"
  );

  const context = buildActiveContext({ store, repoRoot });
  store.close();

  assert.equal(context.activeTask, null);
  assert.equal(context.selectedLane, null);
  assert.equal(context.nextWork.owner, "planner");
  assert.equal(context.nextWork.workflow, ".agents/workflows/plan.md");
  assert.equal(
    context.nextWork.action,
    "Planner should choose the next approved lane and open the next packet only after human agreement."
  );
});

test("active context does not mix stale review handoff constraints into the active planning lane", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "active-context-stale-handoff-"));
  fs.mkdirSync(path.join(repoRoot, ".agents", "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "runtime", "generated-state-docs"), { recursive: true });
  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: clock("2026-05-21T09:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "review",
    releaseGateState: "open",
    currentFocus: "PKT-01 is under reviewer closeout assessment.",
    releaseGoal: "Define the first approved project baseline.",
    sourceRef: "reference/packets/PKT-01_EXPO_INIT_BIBLE_VIEWER.md"
  });
  store.upsertWorkItem({
    workItemId: "PKT-03",
    title: "Supabase Auth and sync",
    status: "planning",
    owner: "planner",
    nextAction: "Finalize implementation plan and hand off to developer.",
    sourceRef: "reference/packets/PKT-03_SUPABASE_AUTH_SYNC.md",
    metadata: { gateProfile: "standard", readyForCode: "draft" }
  });
  store.appendHandoff({
    handoffId: "pkt-01-review",
    handoffSummary: "Tester verification completed; Reviewer should assess packet exit readiness.",
    fromRole: "tester",
    toRole: "reviewer",
    sourceRef: "reference/packets/PKT-01_EXPO_INIT_BIBLE_VIEWER.md",
    payload: {
      nextFirstAction: "Review implementation, evidence, residual debt, and closeout readiness.",
      requiredSsot: [
        "reference/packets/PKT-01_EXPO_INIT_BIBLE_VIEWER.md",
        "reference/artifacts/PACKET_EXIT_QUALITY_GATE.md"
      ],
      approvalBoundary: "Assess closeout readiness only.",
      doNotCross: ["No implementation changes."]
    }
  });

  const context = buildActiveContext({ store, repoRoot });
  store.close();

  assert.equal(context.activeTask.workItemId, "PKT-03");
  assert.equal(context.nextWork.owner, "planner");
  assert.equal(context.nextWork.workflow, ".agents/workflows/plan.md");
  assert.equal(context.nextWork.requiredSsot.includes("reference/packets/PKT-01_EXPO_INIT_BIBLE_VIEWER.md"), false);
  assert.equal(context.nextWork.approvalBoundary, null);
  assert.deepEqual(context.nextWork.doNotCross, []);
  assert.equal(context.latestHandoff, null);
  assert.equal(context.reentryContract.mustReadNext.includes("reference/packets/PKT-03_SUPABASE_AUTH_SYNC.md"), true);
});

test("active context does not import CURRENT_STATE must-read bullets into canonical AI re-entry routing", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "active-context-must-read-authority-"));
  fs.mkdirSync(path.join(repoRoot, ".agents", "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "runtime", "generated-state-docs"), { recursive: true });
  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: clock("2026-05-16T09:30:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "PLN-21 authority slice",
    releaseGoal: "Keep AI re-entry sourced from canonical live state.",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  store.upsertWorkItem({
    workItemId: "PLN-21",
    title: "Authority simplification",
    status: "in_progress",
    owner: "developer",
    nextAction: "Implement slice 1.",
    sourceRef: "reference/packets/PKT-01_PLN-21.md",
    metadata: { gateProfile: "contract", readyForCode: "approved" }
  });
  store.appendHandoff({
    handoffId: "pln-21-dev",
    handoffSummary: "Developer should implement slice 1.",
    fromRole: "planner",
    toRole: "developer",
    sourceRef: "reference/packets/PKT-01_PLN-21.md",
    payload: {
      nextFirstAction: "Implement slice 1.",
      requiredSsot: [
        ".agents/artifacts/CURRENT_STATE.md",
        ".agents/artifacts/TASK_LIST.md",
        ".agents/artifacts/IMPLEMENTATION_PLAN.md",
        "reference/packets/PKT-01_PLN-21.md"
      ]
    }
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"),
    [
      "# Current State",
      "",
      "## Must Read Next",
      "- `.agents/artifacts/REQUIREMENTS.md`",
      "- `reference/manuals/HARNESS_MANUAL.md`"
    ].join("\n"),
    "utf8"
  );

  const context = buildActiveContext({ store, repoRoot });
  store.close();

  assert.equal(context.reentryContract.mustReadNext.includes("reference/manuals/HARNESS_MANUAL.md"), false);
  assert.equal(context.reentryContract.mustReadNext.includes(".agents/artifacts/CURRENT_STATE.md"), false);
  assert.equal(context.reentryContract.mustReadNext.includes(".agents/artifacts/TASK_LIST.md"), false);
  assert.equal(context.nextWork.requiredSsot.includes(".agents/artifacts/CURRENT_STATE.md"), false);
  assert.equal(context.nextWork.requiredSsot.includes(".agents/artifacts/TASK_LIST.md"), false);
  assert.equal(context.reentryContract.mustReadNext.includes(".agents/artifacts/IMPLEMENTATION_PLAN.md"), true);
});

function clock(startIso) {
  let offset = 0;
  const base = Date.parse(startIso);
  return () => new Date(base + offset++ * 1000).toISOString();
}
