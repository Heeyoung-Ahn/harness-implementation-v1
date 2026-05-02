import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createOperatingStateStore } from "../runtime/state/operating-state-store.js";
import { writePmwProjectExport } from "../runtime/state/project-manifest.js";
import { RELEASE_BASELINE } from "../runtime/state/release-baseline.js";

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
    releaseGoal: `Installable ${RELEASE_BASELINE.label} standard harness`,
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
    sourceRef: "reference/packets/PKT-01_PLN-01_GATE_PROFILE.md",
    metadata: { gateProfile: "standard" }
  });
  store.upsertArtifact({
    artifactId: "PKT-01_PLN-01_GATE_PROFILE",
    path: "reference/packets/PKT-01_PLN-01_GATE_PROFILE.md",
    category: "task_packet",
    title: "PLN-01 gate profile packet",
    sourceRef: "reference/packets/PKT-01_PLN-01_GATE_PROFILE.md"
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
  assert.equal(result.readModel.context.operatorCommands.phaseOneLabel, "PMW Actions");
  assert.equal(result.readModel.context.operatorCommands.terminalOnlyLabel, "Terminal Actions");
  assert.deepEqual(
    result.readModel.context.operatorCommands.phaseOne.map((command) => command.id),
    ["status", "next", "explain", "validate", "handoff", "pmw-export"]
  );
  assert.equal(
    result.readModel.context.operatorCommands.phaseOne.find((command) => command.id === "validate")
      .confirmationRequired,
    false
  );
  assert.equal(
    result.readModel.context.operatorCommands.phaseOne.find((command) => command.id === "handoff")
      .confirmationRequired,
    true
  );
  assert.match(
    result.readModel.context.operatorCommands.phaseOne.find((command) => command.id === "status")
      .expectedEffect,
    /current stage/
  );
  assert.equal(result.readModel.context.actionBoard.cards.currentTask.gateProfile.id, "standard");
  assert.equal(result.readModel.context.gateProfile.activeProfile.id, "standard");
});

function seedRepo(repoRoot) {
  fs.mkdirSync(path.join(repoRoot, ".agents", "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "runtime"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "reference", "packets"), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "ACTIVE_PROFILES.md"), "# Active Profiles\n\n| Profile ID | Activation Reason | Required Evidence | Evidence Status | Owner | Activated At | Applies To Packets |\n| --- | --- | --- | --- | --- | --- | --- |\n| PRF-07 | smoke | baseline | ready | harness | 2026-04-26 | PLN-01 |\n| PRF-09 | smoke | baseline | ready | harness | 2026-04-26 | PLN-01 |\n", "utf8");
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"),
    `# Current State\n\n## Snapshot\n- ${RELEASE_BASELINE.label} installable harness smoke state.\n`,
    "utf8"
  );
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"), "# Task List\n\n## Active Tasks\n- PLN-01 active.\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "REQUIREMENTS.md"), "# Requirements\n\n## Summary\nInstallable standard harness and separate PMW.\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "IMPLEMENTATION_PLAN.md"), "# Implementation Plan\n\n## Operator Next Action\n- Confirm the initial project baseline.\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "ARCHITECTURE_GUIDE.md"), "# Architecture\n\n## Summary\nHarness exports read-only PMW model.\n", "utf8");
  fs.writeFileSync(
    path.join(repoRoot, "reference", "packets", "PKT-01_PLN-01_GATE_PROFILE.md"),
    [
      "# PKT-01 PLN-01 Gate Profile",
      "",
      "## Quick Decision Header",
      "| Item | Proposed | Why | Status |",
      "|---|---|---|---|",
      "| Work item | PLN-01 | Smoke packet | draft |",
      "| Ready For Code | approved | Smoke test | approved |",
      "| Gate profile | standard | Normal planning implementation evidence | approved |",
      "| User-facing impact | low | PMW metadata only | approved |",
      "| Layer classification | project packet | Smoke test | approved |",
      "| Active profile dependencies | none | No optional profile | not-needed |",
      "| Profile evidence status | not-needed | No optional profile | not-needed |",
      "| UX archetype status | not-needed | No UI redesign | not-needed |",
      "| Environment topology status | not-needed | No deploy | not-needed |",
      "| Domain foundation status | not-needed | No data schema | not-needed |",
      "| Authoritative source intake status | not-needed | No new source | not-needed |",
      "| Shared-source wave status | not-needed | No wave | not-needed |",
      "| Packet exit gate status | pending | Not closed | draft |",
      "| Existing system dependency | none | No legacy system | not-needed |",
      "| New authoritative source impact | none | No new source | not-needed |",
      "",
      "## 3. Proposed Scope",
      "- Layer classification: project packet",
      "- Required reading before code: `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`, this packet",
      "- Gate profile: standard",
      "- Verification manifest: approved packet, targeted tests, validator, handoff evidence",
      "",
      "## Verification Manifest",
      "- approved packet",
      "- targeted tests",
      "- validator",
      "- handoff evidence"
    ].join("\n"),
    "utf8"
  );
}

function createClock(startIso) {
  let offset = 0;
  const base = Date.parse(startIso);
  return () => new Date(base + offset++ * 1000).toISOString();
}
