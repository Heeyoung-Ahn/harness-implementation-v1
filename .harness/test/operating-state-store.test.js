import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  CORE_TABLES,
  OptimisticConcurrencyError,
  SCHEMA_VERSION,
  ValidationError,
  createOperatingStateStore
} from "../runtime/state/operating-state-store.js";

test("bootstraps the core schema and exposes the expected tables", () => {
  const store = createOperatingStateStore({ dbPath: ":memory:" });

  assert.equal(store.getSchemaVersion(), SCHEMA_VERSION);
  assert.deepEqual(store.listCoreTables(), CORE_TABLES);

  store.close();
});

test("supports the mutable command surface with optimistic concurrency", () => {
  const store = createOperatingStateStore({
    dbPath: ":memory:",
    now: createClock("2026-04-17T12:00:00.000Z")
  });

  const releaseState = store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "Freeze requirements",
    releaseGoal: "First ship baseline"
  });
  assert.equal(releaseState.version, 1);

  const updatedRelease = store.setReleaseState(
    {
      releaseId: "current",
      currentStage: "implementation",
      releaseGateState: "open",
      currentFocus: "Build DB foundation",
      releaseGoal: "First ship baseline"
    },
    { expectedVersion: 1 }
  );
  assert.equal(updatedRelease.version, 2);

  assert.throws(
    () =>
      store.setReleaseState(
        {
          releaseId: "current",
          currentStage: "stale",
          releaseGateState: "blocked",
          currentFocus: "Bad update",
          releaseGoal: "Bad update"
        },
        { expectedVersion: 1 }
      ),
    OptimisticConcurrencyError
  );

  const workItem = store.upsertWorkItem({
    workItemId: "DEV-01",
    title: "DB foundation",
    status: "ready",
    nextAction: "Implement schema"
  });
  assert.equal(workItem.version, 1);

  const transitioned = store.transitionWorkItem({
    workItemId: "DEV-01",
    status: "in_progress",
    nextAction: "Wire command surface"
  });
  assert.equal(transitioned.status, "in_progress");
  assert.equal(transitioned.version, 2);

  const decision = store.recordDecision({
    decisionId: "DEC-DB-ENGINE",
    title: "Choose DB engine",
    decisionNeeded: true,
    impactSummary: "Impacts runtime and local setup",
    noResponseBehavior: "Hold implementation"
  });
  assert.equal(decision.decisionNeeded, true);

  const risk = store.recordGateRisk({
    riskId: "RISK-MIGRATION",
    title: "Migration shape not fixed",
    severity: "medium",
    unblockCondition: "Agree on initial store contract"
  });
  assert.equal(risk.severity, "medium");

  const handoff = store.appendHandoff({
    handoffId: "handoff-001",
    handoffSummary: "DB foundation packet prepared",
    fromRole: "planner",
    toRole: "implementer"
  });
  assert.equal(handoff.handoffId, "handoff-001");

  const artifact = store.upsertArtifact({
    artifactId: "requirements",
    path: "REQUIREMENTS.md",
    category: "canonical_doc",
    title: "Requirements"
  });
  assert.equal(artifact.path, "REQUIREMENTS.md");

  const projection = store.refreshProjection({
    projectionName: "CURRENT_STATE.md",
    checksum: "abc123",
    sourceRevision: "release_state@2"
  });
  assert.equal(projection.checksum, "abc123");
  assert.equal(projection.freshnessState, "fresh");

  store.close();
});

test("creates a repo-local sqlite file and rejects invalid repo-relative paths", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "harness-store-"));
  const dbPath = path.join(tempDir, ".harness", "operating_state.sqlite");
  const store = createOperatingStateStore({
    dbPath,
    now: createClock("2026-04-17T13:00:00.000Z")
  });

  assert.equal(fs.existsSync(dbPath), true);

  assert.throws(
    () =>
      store.upsertArtifact({
        artifactId: "bad-artifact",
        path: "C:/absolute/file.txt",
        category: "canonical_doc",
        title: "Bad artifact"
      }),
    ValidationError
  );

  store.close();
});

function createClock(startIso) {
  let offset = 0;
  const base = Date.parse(startIso);
  return () => new Date(base + offset++ * 1000).toISOString();
}
