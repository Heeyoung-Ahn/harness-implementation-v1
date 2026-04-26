import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createOperatingStateStore } from "../runtime/state/operating-state-store.js";
import {
  CURRENT_STATE_DOC,
  TASK_LIST_DOC,
  writeGeneratedStateDocs
} from "../runtime/state/generate-state-docs.js";
import { validateGeneratedStateDocs } from "../runtime/state/drift-validator.js";
import {
  seedProfileAwareValidatorFixtures,
  writeConcreteTaskPacketFixture
} from "./profile-aware-validator-fixtures.js";

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
    sourceRef: ".agents/artifacts/REQUIREMENTS.md"
  });
  store.recordDecision({
    decisionId: "DEC-01",
    title: "Choose generated doc structure",
    decisionNeeded: true,
    impactSummary: "Impacts PMW source mapping",
    sourceRef: ".agents/artifacts/ARCHITECTURE_GUIDE.md"
  });
  store.recordGateRisk({
    riskId: "RISK-01",
    title: "Validator shape still missing",
    severity: "medium",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  store.upsertWorkItem({
    workItemId: "DEV-02",
    title: "Generated docs",
    status: "in_progress",
    nextAction: "Implement writer",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  store.appendHandoff({
    handoffId: "handoff-01",
    handoffSummary: "Generated docs work has started",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });
  store.upsertArtifact({
    artifactId: "requirements",
    path: ".agents/artifacts/REQUIREMENTS.md",
    category: "canonical_doc",
    title: "Requirements",
    sourceRef: ".agents/artifacts/REQUIREMENTS.md"
  });
  const packetPath = writeConcreteTaskPacketFixture(repoRoot);
  store.upsertArtifact({
    artifactId: "active-packet",
    path: packetPath,
    category: "task_packet",
    title: "Active packet",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const currentState = fs.readFileSync(generatedDocPath(repoRoot, CURRENT_STATE_DOC), "utf8");
  const taskList = fs.readFileSync(generatedDocPath(repoRoot, TASK_LIST_DOC), "utf8");
  assert.match(currentState, /## Current Focus Summary/);
  assert.match(currentState, /## Decision Required Summary/);
  assert.match(taskList, /## Blocked \/ At Risk Summary/);

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
    sourceRef: ".agents/artifacts/REQUIREMENTS.md"
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
    sourceRef: ".agents/artifacts/REQUIREMENTS.md"
  });
  store.recordDecision({
    decisionId: "DEC-01",
    title: "Choose generated doc structure",
    decisionNeeded: true,
    impactSummary: "Impacts PMW source mapping",
    sourceRef: ".agents/artifacts/ARCHITECTURE_GUIDE.md"
  });
  store.recordGateRisk({
    riskId: "RISK-01",
    title: "Validator shape still missing",
    severity: "medium",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
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
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
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
    sourceRef: ".agents/artifacts/MISSING_SOURCE.md"
  });
  store.recordGateRisk({
    riskId: "RISK-01",
    title: "Validator shape still missing",
    severity: "medium",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
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

test("detects missing profile-aware packet and profile evidence contracts", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-generated-docs-profile-aware-"));
  seedRepoFiles(repoRoot);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T16:30:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Profile-aware validator",
    releaseGoal: "Catch missing packet/profile evidence contracts",
    sourceRef: ".agents/artifacts/REQUIREMENTS.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  fs.writeFileSync(
    path.join(repoRoot, "reference", "packets", "PKT-01_WORK_ITEM_PACKET_TEMPLATE.md"),
    "# Broken Packet Template\n",
    "utf8"
  );
  fs.unlinkSync(path.join(repoRoot, "reference", "profiles", "PRF-03_AIRGAPPED_DELIVERY_PROFILE.md"));
  fs.unlinkSync(path.join(repoRoot, "reference", "artifacts", "AUTHORITATIVE_SOURCE_WAVE_LEDGER.md"));

  const result = validateGeneratedStateDocs({
    store,
    outputDir: repoRoot,
    repoRoot
  });

  const codes = new Set(result.findings.map((finding) => finding.code));
  assert.equal(result.ok, false);
  assert.equal(codes.has("packet_template_field_missing"), true);
  assert.equal(codes.has("optional_profile_artifact_missing"), true);
  assert.equal(codes.has("source_wave_ledger_missing"), true);

  store.close();
});

test("detects missing active profile declaration artifact", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-active-profiles-missing-"));
  seedRepoFiles(repoRoot);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T16:45:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Active profile artifact validation",
    releaseGoal: "Catch missing active profile declarations",
    sourceRef: ".agents/artifacts/REQUIREMENTS.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  fs.unlinkSync(path.join(repoRoot, ".agents", "artifacts", "ACTIVE_PROFILES.md"));

  const result = validateGeneratedStateDocs({
    store,
    outputDir: repoRoot,
    repoRoot
  });

  const codes = new Set(result.findings.map((finding) => finding.code));
  assert.equal(result.ok, false);
  assert.equal(codes.has("active_profile_artifact_missing"), true);

  store.close();
});

test("detects structured task table headers, locks, and completed verification drift", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-task-truth-drift-"));
  seedRepoFiles(repoRoot);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T16:50:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Structured task truth validation",
    releaseGoal: "Catch task table drift",
    sourceRef: ".agents/artifacts/REQUIREMENTS.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"),
    `# Task List

## Active Locks
| Task ID | Scope | Owner | Status | Started At | Notes |
|---|---|---|---|---|---|
| TASK-01 | backend | codex | active | 2026-04-17T16:50:00.000Z | first lock |
| TASK-01 | backend | codex | active | 2026-04-17T16:51:00.000Z | duplicate lock |

## Active Tasks
| Task ID | Title | Scope | Owner | Status | Priority | Verification |
|---|---|---|---|---|---|---|
| TASK-02 | Missing lock task | backend | codex | in_progress | high | - |

## Blocked Tasks
| Task ID | Blocker | Owner | Status | Unblock Condition | Verification |
|---|---|---|---|---|---|
| - | None | - | clear | - | - |

## Completed Tasks
| Task ID | Title | Completed At | Verification | Notes |
|---|---|---|---|---|
| TASK-03 | Closed without evidence | 2026-04-17T16:52:00.000Z | - | missing verification |

## Handoff Log
- none
`,
    "utf8"
  );

  const result = validateGeneratedStateDocs({
    store,
    outputDir: repoRoot,
    repoRoot
  });

  const codes = new Set(result.findings.map((finding) => finding.code));
  assert.equal(result.ok, false);
  assert.equal(codes.has("structured_task_table_header_missing"), true);
  assert.equal(codes.has("structured_task_duplicate_lock"), true);
  assert.equal(codes.has("structured_task_lock_missing"), true);
  assert.equal(codes.has("structured_task_completed_verification_missing"), true);

  store.close();
});

test("detects missing required evidence in registered concrete task packets", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-generated-docs-concrete-packet-"));
  seedRepoFiles(repoRoot);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T17:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Concrete task packet validation",
    releaseGoal: "Catch missing packet evidence in active packet instances",
    sourceRef: ".agents/artifacts/REQUIREMENTS.md"
  });

  const packetPath = writeConcreteTaskPacketFixture(repoRoot, {
    fileName: "PKT-01_BROKEN_ACTIVE_PACKET.md",
    fields: {
      "Profile composition rationale": "",
      "Primary admin entity / surface": "",
      "Domain foundation reference": "",
      "Authoritative source intake reference": ""
    }
  });

  store.upsertArtifact({
    artifactId: "broken-active-packet",
    path: packetPath,
    category: "task_packet",
    title: "Broken active packet",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const result = validateGeneratedStateDocs({
    store,
    outputDir: repoRoot,
    repoRoot
  });

  const codes = new Set(result.findings.map((finding) => finding.code));
  assert.equal(result.ok, false);
  assert.equal(codes.has("task_packet_required_evidence_missing"), true);

  store.close();
});

test("detects missing shared-source wave evidence in registered concrete task packets", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-generated-docs-source-wave-missing-"));
  seedRepoFiles(repoRoot);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T17:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Concrete task packet validation",
    releaseGoal: "Catch missing shared-source wave evidence in active packet instances",
    sourceRef: ".agents/artifacts/REQUIREMENTS.md"
  });

  const packetPath = writeConcreteTaskPacketFixture(repoRoot, {
    fileName: "PKT-01_SOURCE_WAVE_BROKEN_PACKET.md",
    header: {
      "Shared-source wave status": "pending"
    },
    fields: {
      "Impacted packet set scope": "multi-packet",
      "Authoritative source wave ledger reference": "",
      "Source wave packet disposition": ""
    }
  });

  store.upsertArtifact({
    artifactId: "source-wave-broken-packet",
    path: packetPath,
    category: "task_packet",
    title: "Source wave broken packet",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const result = validateGeneratedStateDocs({
    store,
    outputDir: repoRoot,
    repoRoot
  });

  const codes = new Set(result.findings.map((finding) => finding.code));
  assert.equal(result.ok, false);
  assert.equal(codes.has("task_packet_required_evidence_missing"), true);

  store.close();
});

test("detects unregistered concrete task packets in the canonical packet directory", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-generated-docs-unregistered-packet-"));
  seedRepoFiles(repoRoot);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T17:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Concrete task packet validation",
    releaseGoal: "Fail when a canonical current-contract packet is not registered",
    sourceRef: ".agents/artifacts/REQUIREMENTS.md"
  });

  writeConcreteTaskPacketFixture(repoRoot, {
    fileName: "PKT-01_UNREGISTERED_ACTIVE_PACKET.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const result = validateGeneratedStateDocs({
    store,
    outputDir: repoRoot,
    repoRoot
  });

  const codes = new Set(result.findings.map((finding) => finding.code));
  assert.equal(result.ok, false);
  assert.equal(codes.has("task_packet_registration_missing"), true);

  store.close();
});

test("detects multi-profile reference drift in registered concrete task packets", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-generated-docs-multi-profile-"));
  seedRepoFiles(repoRoot);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T17:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Concrete task packet validation",
    releaseGoal: "Catch multi-profile citation drift in active packet instances",
    sourceRef: ".agents/artifacts/REQUIREMENTS.md"
  });

  const packetPath = writeConcreteTaskPacketFixture(repoRoot, {
    fileName: "PKT-01_MULTI_PROFILE_DRIFT_PACKET.md",
    fields: {
      "Active profile references": "reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md"
    }
  });

  store.upsertArtifact({
    artifactId: "multi-profile-drift-packet",
    path: packetPath,
    category: "task_packet",
    title: "Multi-profile drift packet",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const result = validateGeneratedStateDocs({
    store,
    outputDir: repoRoot,
    repoRoot
  });

  const codes = new Set(result.findings.map((finding) => finding.code));
  assert.equal(result.ok, false);
  assert.equal(codes.has("task_packet_status_contract_mismatch"), true);

  store.close();
});

test("detects shared-source wave ledger drift for registered concrete task packets", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-generated-docs-source-wave-ledger-"));
  seedRepoFiles(repoRoot);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T17:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Concrete task packet validation",
    releaseGoal: "Catch shared-source wave ledger drift in active packet instances",
    sourceRef: ".agents/artifacts/REQUIREMENTS.md"
  });

  fs.writeFileSync(
    path.join(repoRoot, "reference", "artifacts", "AUTHORITATIVE_SOURCE_WAVE_LEDGER.md"),
    `# Authoritative Source Wave Ledger

## Approval Rule
- Shared-source wave requires a ledger.

## 4. Impacted Packet Set
| Packet path | Prior source snapshot | Required action | Rebaseline status | Notes |
|---|---|---|---|---|
| reference/packets/PKT-01_OTHER_PACKET.md | 2026-04-23-v1 | reopen | pending | wrong packet |

## 8. Packet Citation Rule
- Impacted packets cite this ledger as Authoritative source wave ledger reference.
`,
    "utf8"
  );

  const packetPath = writeConcreteTaskPacketFixture(repoRoot, {
    fileName: "PKT-01_SOURCE_WAVE_LEDGER_DRIFT_PACKET.md",
    header: {
      "Shared-source wave status": "approved"
    },
    fields: {
      "Impacted packet set scope": "multi-packet",
      "Authoritative source wave ledger reference": "reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md",
      "Source wave packet disposition": "adjust"
    }
  });

  store.upsertArtifact({
    artifactId: "source-wave-ledger-drift-packet",
    path: packetPath,
    category: "task_packet",
    title: "Source wave ledger drift packet",
    sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const result = validateGeneratedStateDocs({
    store,
    outputDir: repoRoot,
    repoRoot
  });

  const codes = new Set(result.findings.map((finding) => finding.code));
  assert.equal(result.ok, false);
  assert.equal(codes.has("source_wave_packet_missing_from_ledger"), true);

  store.close();
});

test("ignores legacy packet files that do not match the current concrete packet contract", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "harness-generated-docs-legacy-packet-"));
  seedRepoFiles(repoRoot);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-17T17:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "implementation",
    releaseGateState: "open",
    currentFocus: "Concrete task packet validation",
    releaseGoal: "Ignore legacy packet files outside the current packet contract",
    sourceRef: ".agents/artifacts/REQUIREMENTS.md"
  });

  fs.writeFileSync(
    path.join(repoRoot, "reference", "packets", "PKT-LEGACY-HISTORICAL.md"),
    `# Legacy Packet

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | LEGACY-01 | historical packet | approved |
| Ready For Code | approve | legacy lane | approved |
`,
    "utf8"
  );

  writeGeneratedStateDocs({ store, outputDir: repoRoot });

  const result = validateGeneratedStateDocs({
    store,
    outputDir: repoRoot,
    repoRoot
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.findings, []);

  store.close();
});

function seedRepoFiles(repoRoot) {
  fs.mkdirSync(path.join(repoRoot, ".agents", "artifacts"), { recursive: true });
  for (const fileName of [
    "REQUIREMENTS.md",
    "ARCHITECTURE_GUIDE.md",
    "IMPLEMENTATION_PLAN.md"
  ]) {
    fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", fileName), `# ${fileName}\n`, "utf8");
  }
  seedProfileAwareValidatorFixtures(repoRoot);
}

function generatedDocPath(repoRoot, docName) {
  return path.join(repoRoot, ".agents", "runtime", "generated-state-docs", docName);
}

function createClock(startIso) {
  let offset = 0;
  const base = Date.parse(startIso);
  return () => new Date(base + offset++ * 1000).toISOString();
}
