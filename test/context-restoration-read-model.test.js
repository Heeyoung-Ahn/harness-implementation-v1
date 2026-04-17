import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createOperatingStateStore } from "../src/state/operating-state-store.js";
import { writeGeneratedStateDocs } from "../src/state/generate-state-docs.js";
import {
  buildContextRestorationReadModel,
  IMPLEMENTATION_PLAN_DOC,
  OPERATOR_NEXT_ACTION_SECTION
} from "../src/state/context-restoration-read-model.js";

test("builds a fresh context restoration read model from designated summary sources", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-read-model-"));
  seedRepoFiles(repoRoot, {
    operatorSection: [
      "- Implement `DEV-03` context restoration read model.",
      "- Keep stale diagnostics and source trace in the read model.",
      "- Source packet: `PKT-01_DEV-03_CONTEXT_RESTORATION_READ_MODEL.md`."
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
    sourceRef: "ARCHITECTURE_GUIDE.md"
  });
  store.recordDecision({
    decisionId: "DEC-03",
    title: "Finalize context restoration load order",
    decisionNeeded: true,
    impactSummary: "PMW reads this contract on first view",
    sourceRef: "ARCHITECTURE_GUIDE.md"
  });
  store.recordGateRisk({
    riskId: "RISK-03",
    title: "Read model not yet implemented",
    severity: "high",
    sourceRef: "IMPLEMENTATION_PLAN.md"
  });
  store.upsertWorkItem({
    workItemId: "DEV-03",
    title: "Context restoration read model",
    status: "in_progress",
    nextAction: "Implement designated summary parser",
    sourceRef: "IMPLEMENTATION_PLAN.md"
  });
  store.appendHandoff({
    handoffId: "handoff-03",
    handoffSummary: "DEV-03 is ready for implementation.",
    fromRole: "planner",
    toRole: "developer",
    sourceRef: "IMPLEMENTATION_PLAN.md"
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
  assert.equal(model.recentHandoff.headline, "DEV-03 is ready for implementation.");
  assert.equal(model.diagnostics.length, 0);
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
    sourceRef: "ARCHITECTURE_GUIDE.md"
  });
  store.upsertWorkItem({
    workItemId: "DEV-03",
    title: "Context restoration read model",
    status: "in_progress",
    nextAction: "Implement designated summary parser",
    sourceRef: "IMPLEMENTATION_PLAN.md"
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
    sourceRef: "ARCHITECTURE_GUIDE.md"
  });
  store.recordDecision({
    decisionId: "DEC-03",
    title: "Finalize context restoration load order",
    decisionNeeded: true,
    impactSummary: "PMW reads this contract on first view",
    sourceRef: "ARCHITECTURE_GUIDE.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  store.recordGateRisk({
    riskId: "RISK-03",
    title: "Generated docs are stale",
    severity: "high",
    sourceRef: "IMPLEMENTATION_PLAN.md"
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
  fs.writeFileSync(path.join(repoRoot, "REQUIREMENTS.md"), "# REQUIREMENTS\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "ARCHITECTURE_GUIDE.md"), "# ARCHITECTURE\n", "utf8");

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
}

function createClock(startIso) {
  let offset = 0;
  const base = Date.parse(startIso);
  return () => new Date(base + offset++ * 1000).toISOString();
}
