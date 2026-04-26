import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createOperatingStateStore } from "../runtime/state/operating-state-store.js";
import { writePmwProjectExport } from "../runtime/state/project-manifest.js";

test("writePmwProjectExport writes a PMW-readable manifest and read model without embedding PMW app code", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "pmw-export-"));
  seedRepo(repoRoot);
  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite"),
    now: createClock("2026-04-26T10:00:00.000Z")
  });

  store.setReleaseState({
    currentStage: "planning",
    releaseGateState: "open",
    currentFocus: "Close PLN-00 and PLN-01 before implementation",
    releaseGoal: "Installable V1.2 standard harness",
    sourceRef: ".agents/artifacts/CURRENT_STATE.md",
    metadata: {
      projectName: "PMW Export Smoke",
      projectSlug: "pmw-export-smoke"
    }
  });
  store.upsertWorkItem({
    workItemId: "PLN-01",
    title: "Requirements freeze",
    status: "in_progress",
    nextAction: "Confirm the initial project baseline.",
    domainHint: "planning",
    sourceRef: ".agents/artifacts/TASK_LIST.md"
  });

  const result = writePmwProjectExport({ store, repoRoot, outputDir: repoRoot });
  store.close();

  assert.equal(result.ok, true);
  assert.equal(fs.existsSync(path.join(repoRoot, ".agents", "runtime", "project-manifest.json")), true);
  assert.equal(fs.existsSync(path.join(repoRoot, ".agents", "runtime", "pmw-read-model.json")), true);
  assert.equal(result.manifest.projectId, "pmw-export-smoke");
  assert.equal(result.manifest.projectName, "PMW Export Smoke");
  assert.deepEqual(result.manifest.activeProfiles.map((profile) => profile.profileId), ["PRF-07", "PRF-09"]);
  assert.equal(result.readModel.project.name, "PMW Export Smoke");
  assert.equal(result.readModel.context.releaseState.currentStage, "planning");
  assert.match(result.readModel.context.surfaces.nextAction.headline, /Confirm the initial project baseline/);
});

function seedRepo(repoRoot) {
  fs.mkdirSync(path.join(repoRoot, ".agents", "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "runtime"), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "ACTIVE_PROFILES.md"), "# Active Profiles\n\n| Profile ID | Activation Reason | Required Evidence | Evidence Status | Owner | Activated At | Applies To Packets |\n| --- | --- | --- | --- | --- | --- | --- |\n| PRF-07 | smoke | baseline | ready | harness | 2026-04-26 | PLN-01 |\n| PRF-09 | smoke | baseline | ready | harness | 2026-04-26 | PLN-01 |\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"), "# Current State\n\n## Snapshot\n- V1.2 installable harness smoke state.\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"), "# Task List\n\n## Active Tasks\n- PLN-01 active.\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "REQUIREMENTS.md"), "# Requirements\n\n## Summary\nInstallable standard harness and separate PMW.\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "IMPLEMENTATION_PLAN.md"), "# Implementation Plan\n\n## Operator Next Action\n- Confirm the initial project baseline.\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "ARCHITECTURE_GUIDE.md"), "# Architecture\n\n## Summary\nHarness exports read-only PMW model.\n", "utf8");
}

function createClock(startIso) {
  let offset = 0;
  const base = Date.parse(startIso);
  return () => new Date(base + offset++ * 1000).toISOString();
}
