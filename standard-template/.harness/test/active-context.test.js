import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { buildActiveContext, writeActiveContext } from "../runtime/state/active-context.js";
import { createOperatingStateStore } from "../runtime/state/operating-state-store.js";
import { writeGeneratedStateDocs } from "../runtime/state/generate-state-docs.js";

test("active context writes compact JSON and Korean Markdown re-entry state", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "active-context-"));
  fs.mkdirSync(path.join(repoRoot, ".agents", "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "runtime", "generated-state-docs"), { recursive: true });
  const dbPath = path.join(repoRoot, ".harness", "operating_state.sqlite");
  const store = createOperatingStateStore({ dbPath, now: clock("2026-05-03T09:00:00.000Z") });

  store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "DEV-11 PMW-free active context",
    releaseGoal: "Remove PMW and keep re-entry cheap.",
    sourceRef: "reference/packets/PKT-01_DEV-11_CLI_FIRST_PMW_DECOMMISSION_AND_ACTIVE_CONTEXT.md"
  });
  store.upsertWorkItem({
    workItemId: "DEV-11",
    title: "CLI-first PMW decommission",
    status: "in_progress",
    owner: "developer",
    nextAction: "Implement active context.",
    sourceRef: "reference/packets/PKT-01_DEV-11_CLI_FIRST_PMW_DECOMMISSION_AND_ACTIVE_CONTEXT.md",
    metadata: { gateProfile: "release", readyForCode: "approved" }
  });
  store.appendHandoff({
    handoffId: "handoff-dev-11",
    handoffSummary: "DEV-11 handed to Developer.",
    fromRole: "planner",
    toRole: "developer",
    sourceRef: "reference/packets/PKT-01_DEV-11_CLI_FIRST_PMW_DECOMMISSION_AND_ACTIVE_CONTEXT.md",
    payload: { nextFirstAction: "Implement active context." }
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const result = writeActiveContext({ store, repoRoot, outputDir: repoRoot });
  store.close();

  assert.equal(result.ok, true);
  assert.equal(result.context.activeTask.workItemId, "DEV-11");
  assert.equal(result.context.sources.generatedCurrentState, ".agents/runtime/generated-state-docs/CURRENT_STATE.md");
  assert.equal(fs.existsSync(path.join(repoRoot, ".agents", "runtime", "ACTIVE_CONTEXT.json")), true);
  assert.equal(fs.existsSync(path.join(repoRoot, ".agents", "runtime", "ACTIVE_CONTEXT.md")), true);
  assert.match(fs.readFileSync(path.join(repoRoot, ".agents", "runtime", "ACTIVE_CONTEXT.md"), "utf8"), /## 현재 작업/);
});

test("active context exposes no PMW read-model dependency", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "active-context-no-pmw-"));
  const store = createOperatingStateStore({ dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite") });
  store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "No PMW",
    releaseGoal: "Use CLI context.",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md"
  });

  const context = buildActiveContext({ store, repoRoot });
  store.close();

  assert.equal(JSON.stringify(context).includes("pmw-read-model"), false);
  assert.equal(JSON.stringify(context).includes("project-manifest"), false);
});

function clock(startIso) {
  let offset = 0;
  const base = Date.parse(startIso);
  return () => new Date(base + offset++ * 1000).toISOString();
}
