import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  applyMigration,
  buildMigrationPreview,
  runCutoverPreflight,
  runValidator,
  writeCutoverReport
} from "../src/state/dev05-tooling.js";
import { initializeProjectStarter } from "../src/state/init-project.js";
import { createOperatingStateStore } from "../src/state/operating-state-store.js";
import { writeGeneratedStateDocs } from "../src/state/generate-state-docs.js";
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

function seedStandardRepo(repoRoot) {
  fs.mkdirSync(path.join(repoRoot, ".agents", "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "runtime", "generated-state-docs"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "reference", "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "reference", "packets"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "reference", "artifacts", "daily"), { recursive: true });

  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "REQUIREMENTS.md"), "# Requirements\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "ARCHITECTURE_GUIDE.md"), "# Architecture\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "IMPLEMENTATION_PLAN.md"), "# Implementation Plan\n\n## Operator Next Action\n- Run DEV-05 tooling.\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "PROJECT_PROGRESS.md"), "# Project Progress\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"), "# Current State\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "PREVENTIVE_MEMORY.md"), "# Preventive Memory\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "artifacts", "UI_DESIGN.md"), "# UI Design\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "artifacts", "SYSTEM_CONTEXT.md"), "# System Context\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "artifacts", "HANDOFF_ARCHIVE.md"), "# Handoff Archive\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "artifacts", "daily", "2026-04-19.md"), "# Daily\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "artifacts", "daily", "2026-04-20.md"), "# Daily\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "packets", "PKT-01_DEV-04_PMW_READ_SURFACE.md"), "# Packet\n", "utf8");
  seedProfileAwareValidatorFixtures(repoRoot);
}

function seedStarterRepo(repoRoot) {
  const starterRoot = detectStarterRoot();
  fs.cpSync(starterRoot, repoRoot, { recursive: true });
}

function detectStarterRoot() {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const nestedStarter = path.join(repoRoot, "standard-template");
  return fs.existsSync(path.join(nestedStarter, "AGENTS.md")) ? nestedStarter : repoRoot;
}

function createClock(startIso) {
  let offset = 0;
  const base = Date.parse(startIso);
  return () => new Date(base + offset++ * 1000).toISOString();
}
