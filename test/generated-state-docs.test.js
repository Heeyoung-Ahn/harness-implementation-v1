import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createOperatingStateStore } from "../src/state/operating-state-store.js";
import {
  CURRENT_STATE_DOC,
  TASK_LIST_DOC,
  writeGeneratedStateDocs
} from "../src/state/generate-state-docs.js";
import { validateGeneratedStateDocs } from "../src/state/drift-validator.js";

test("writes deterministic generated docs and validates them successfully", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-generated-docs-"));
  seedRepoFiles(repoRoot);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T14:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Build generated docs and validator",
    releaseGoal: "First ship baseline",
    sourceRef: "REQUIREMENTS.md"
  });
  store.recordDecision({
    decisionId: "DEC-01",
    title: "Choose generated doc structure",
    decisionNeeded: true,
    impactSummary: "Impacts PMW source mapping",
    sourceRef: "ARCHITECTURE_GUIDE.md"
  });
  store.recordGateRisk({
    riskId: "RISK-01",
    title: "Validator shape still missing",
    severity: "medium",
    sourceRef: "IMPLEMENTATION_PLAN.md"
  });
  store.upsertWorkItem({
    workItemId: "DEV-02",
    title: "Generated docs",
    status: "in_progress",
    nextAction: "Implement writer",
    sourceRef: "IMPLEMENTATION_PLAN.md"
  });
  store.appendHandoff({
    handoffId: "handoff-01",
    handoffSummary: "Generated docs work has started",
    sourceRef: "IMPLEMENTATION_PLAN.md"
  });
  store.upsertArtifact({
    artifactId: "requirements",
    path: "REQUIREMENTS.md",
    category: "canonical_doc",
    title: "Requirements",
    sourceRef: "REQUIREMENTS.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const currentState = fs.readFileSync(path.join(repoRoot, CURRENT_STATE_DOC), "utf8");
  const taskList = fs.readFileSync(path.join(repoRoot, TASK_LIST_DOC), "utf8");
  const generatedCurrentState = fs.readFileSync(generatedDocPath(repoRoot, CURRENT_STATE_DOC), "utf8");
  const generatedTaskList = fs.readFileSync(generatedDocPath(repoRoot, TASK_LIST_DOC), "utf8");
  assert.match(currentState, /## Current Focus Summary/);
  assert.match(currentState, /## Decision Required Summary/);
  assert.match(taskList, /## Blocked \/ At Risk Summary/);
  assert.equal(generatedCurrentState, currentState);
  assert.equal(generatedTaskList, taskList);

  const result = validateGeneratedStateDocs({
    store,
    outputDir: repoRoot,
    repoRoot
  });

  assert.equal(result.ok, true);
  assert.equal(result.cutoverReady, true);
  assert.deepEqual(result.findings, []);

  store.close();
});

test("treats empty-state placeholder rows as zero-count detail", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-generated-docs-empty-"));
  seedRepoFiles(repoRoot);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T14:30:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Build generated docs and validator",
    releaseGoal: "First ship baseline",
    sourceRef: "REQUIREMENTS.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const result = validateGeneratedStateDocs({
    store,
    outputDir: repoRoot,
    repoRoot
  });

  assert.equal(result.ok, true);
  assert.equal(result.cutoverReady, true);
  assert.deepEqual(result.findings, []);

  store.close();
});

test("detects tampered generated docs, missing sections, and stale freshness", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-generated-docs-bad-"));
  seedRepoFiles(repoRoot);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T15:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Build generated docs and validator",
    releaseGoal: "First ship baseline",
    sourceRef: "REQUIREMENTS.md"
  });
  store.recordDecision({
    decisionId: "DEC-01",
    title: "Choose generated doc structure",
    decisionNeeded: true,
    impactSummary: "Impacts PMW source mapping",
    sourceRef: "ARCHITECTURE_GUIDE.md"
  });
  store.recordGateRisk({
    riskId: "RISK-01",
    title: "Validator shape still missing",
    severity: "medium",
    sourceRef: "IMPLEMENTATION_PLAN.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  fs.writeFileSync(
    generatedDocPath(repoRoot, CURRENT_STATE_DOC),
    "# CURRENT_STATE\n\n## Current Focus Summary\n- Tampered summary only\n",
    "utf8"
  );

  store.upsertWorkItem({
    workItemId: "DEV-02",
    title: "Generated docs",
    status: "in_progress",
    nextAction: "Implement writer",
    sourceRef: "IMPLEMENTATION_PLAN.md"
  });

  const result = validateGeneratedStateDocs({
    store,
    outputDir: repoRoot,
    repoRoot
  });

  const codes = new Set(result.findings.map((finding) => finding.code));
  assert.equal(result.ok, false);
  assert.equal(result.cutoverReady, false);
  assert.equal(codes.has("required_section_missing"), true);
  assert.equal(codes.has("checksum_mismatch"), true);
  assert.equal(codes.has("freshness_drift_detected"), true);
  assert.equal(codes.has("cutover_preflight_failed"), true);

  store.close();
});

test("detects unresolved source refs and utf8 bom issues", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-generated-docs-source-"));
  seedRepoFiles(repoRoot);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T16:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Build generated docs and validator",
    releaseGoal: "First ship baseline",
    sourceRef: "MISSING_SOURCE.md"
  });
  store.recordGateRisk({
    riskId: "RISK-01",
    title: "Validator shape still missing",
    severity: "medium",
    sourceRef: "IMPLEMENTATION_PLAN.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const taskListPath = generatedDocPath(repoRoot, TASK_LIST_DOC);
  const taskListBuffer = fs.readFileSync(taskListPath);
  fs.writeFileSync(taskListPath, Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), taskListBuffer]));

  const result = validateGeneratedStateDocs({
    store,
    outputDir: repoRoot,
    repoRoot
  });

  const codes = new Set(result.findings.map((finding) => finding.code));
  assert.equal(codes.has("source_ref_unresolved"), true);
  assert.equal(codes.has("utf8_bom_detected"), true);

  store.close();
});

function seedRepoFiles(repoRoot) {
  for (const fileName of [
    "REQUIREMENTS.md",
    "ARCHITECTURE_GUIDE.md",
    "IMPLEMENTATION_PLAN.md"
  ]) {
    fs.writeFileSync(path.join(repoRoot, fileName), `# ${fileName}\n`, "utf8");
  }
}

function generatedDocPath(repoRoot, docName) {
  return path.join(repoRoot, ".agents", "runtime", "generated-state-docs", docName);
}

function createClock(startIso) {
  let offset = 0;
  const base = Date.parse(startIso);
  return () => new Date(base + offset++ * 1000).toISOString();
}
