import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createOperatingStateStore } from "../runtime/state/operating-state-store.js";
import { initializeProjectStarter } from "../runtime/state/init-project.js";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));

test("initializes a copied starter repo and seeds PMW-ready state", () => {
  const repoRoot = copyStarterRepo();

  const result = initializeProjectStarter({
    repoRoot,
    projectName: "WBMS Budget Suite",
    userGoal: "예산 운영 담당자가 월별 집행과 계획 차이를 빠르게 판단한다.",
    opsGoal: "운영자와 AI가 현재 기준선, active packet, 다음 행동을 빠르게 복원한다.",
    approvalGoal: "PLN-00과 PLN-01을 닫아 첫 설계/구현 lane을 승인한다.",
    activeProfiles: ["PRF-01", "PRF-02"],
    now: createClock("2026-04-23T10:00:00.000Z")
  });

  assert.equal(result.ok, true);
  assert.equal(result.projectSlug, "wbms-budget-suite");
  assert.equal(fs.existsSync(path.join(repoRoot, ".harness", "operating_state.sqlite")), true);

  const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
  assert.equal(packageJson.name, "wbms-budget-suite");

  const currentState = fs.readFileSync(path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"), "utf8");
  const requirements = fs.readFileSync(path.join(repoRoot, ".agents", "artifacts", "REQUIREMENTS.md"), "utf8");
  const readme = fs.readFileSync(path.join(repoRoot, "README.md"), "utf8");
  const implementationPlan = fs.readFileSync(
    path.join(repoRoot, ".agents", "artifacts", "IMPLEMENTATION_PLAN.md"),
    "utf8"
  );
  const generatedState = fs.readFileSync(
    path.join(repoRoot, ".agents", "runtime", "generated-state-docs", "CURRENT_STATE.md"),
    "utf8"
  );

  assert.match(currentState, /Current Stage: kickoff_interview/);
  assert.match(currentState, /WBMS Budget Suite/);
  assert.match(currentState, /START_HERE\.md/);
  assert.match(readme, /START_HERE\.md/);
  assert.match(requirements, /PRF-01 admin grid application profile/);
  assert.match(requirements, /PRF-02 authoritative spreadsheet source profile/);
  assert.match(implementationPlan, /Selected profiles at bootstrap:/);
  assert.match(generatedState, /Release stage: kickoff_interview/);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite")
  });
  assert.match(store.getReleaseState("current").currentFocus, /WBMS Budget Suite/);
  assert.equal(store.getWorkItem("PLN-00").status, "in_progress");
  assert.equal(store.getWorkItem("PLN-01").status, "todo");

  const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, ".agents", "runtime", "project-manifest.json"), "utf8"));
  const readModel = JSON.parse(fs.readFileSync(path.join(repoRoot, ".agents", "runtime", "pmw-read-model.json"), "utf8"));
  store.close();

  assert.equal(manifest.projectName, "WBMS Budget Suite");
  assert.equal(manifest.source.pmwReadModel, ".agents/runtime/pmw-read-model.json");
  assert.deepEqual(manifest.activeProfiles.map((profile) => profile.profileId), ["PRF-01", "PRF-02"]);
  assert.equal(readModel.project.name, "WBMS Budget Suite");
  assert.equal(readModel.context.releaseState.currentStage, "kickoff_interview");
  assert.equal(readModel.context.surfaces.nextAction.headline.includes("PLN-00"), true);
});

test("refuses to reinitialize an already-edited repo without force", () => {
  const repoRoot = copyStarterRepo();
  const currentStatePath = path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md");
  fs.writeFileSync(
    currentStatePath,
    fs.readFileSync(currentStatePath, "utf8").replace("Current Stage: not started", "Current Stage: kickoff_interview"),
    "utf8"
  );

  assert.throws(
    () =>
      initializeProjectStarter({
        repoRoot,
        projectName: "Already Edited Repo",
        userGoal: "goal",
        opsGoal: "ops",
        approvalGoal: "approval"
      }),
    /does not look like a fresh standard harness starter/
  );
});

function copyStarterRepo() {
  const sourceRoot = detectStarterSource();
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "standard-harness-init-"));
  fs.cpSync(sourceRoot, repoRoot, { recursive: true });
  resetCopiedStarterToFreshState(repoRoot);
  return repoRoot;
}

function detectStarterSource() {
  const repoRoot = path.resolve(TEST_DIR, "..", "..");
  const nestedStarter = path.join(repoRoot, "standard-template");
  if (fs.existsSync(path.join(nestedStarter, "AGENTS.md"))) {
    return nestedStarter;
  }
  return repoRoot;
}

function createClock(startIso) {
  let offset = 0;
  const base = Date.parse(startIso);
  return () => new Date(base + offset++ * 1000).toISOString();
}

function resetCopiedStarterToFreshState(repoRoot) {
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"),
    `# Current State

## Snapshot
- Current Stage: not started
- Current Focus: run starter initialization and close the kickoff baseline before any implementation packet opens
- Current Release Goal: define the first approved project baseline on top of the copied standard harness starter

## Next Recommended Agent
- Planner

## Must Read Next
- \`START_HERE.md\`
- \`.agents/artifacts/REQUIREMENTS.md\`
- \`reference/planning/PLN-00_DEEP_INTERVIEW.md\`
- \`reference/planning/PLN-01_REQUIREMENTS_FREEZE.md\`

## Open Decisions / Blockers
- Run \`INIT_STANDARD_HARNESS.cmd\` or \`npm run harness:init\` before real work begins.
- This project was bootstrapped from the current standard harness starter.
- Replace starter placeholders with project-specific kickoff content before claiming a live lane is active.

## Latest Handoff Summary
- No handoff has been recorded yet.
`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"),
    `# Task List

## Current Release Target
- Close the kickoff baseline so the first approved project packet can open safely

## Active Locks
| Task ID | Scope | Owner | Status | Started At | Notes |
|---|---|---|---|---|---|
| - | None | - | clear | - | Starter is waiting for initialization. |

## Active Tasks
| Task ID | Title | Scope | Owner | Status | Priority | Depends On | Verification |
|---|---|---|---|---|---|---|---|
| BOOT-00 | Initialize copied starter | starter bootstrap | project operator | starter_pending | P0 | \`INIT_STANDARD_HARNESS.cmd\` or \`npm run harness:init\` | generated docs and validation guidance |
- Run \`INIT_STANDARD_HARNESS.cmd\` or \`npm run harness:init\` before real work begins.

## Blocked Tasks
| Task ID | Blocker | Owner | Status | Unblock Condition | Verification |
|---|---|---|---|---|---|
| - | None | - | clear | - | - |

## Completed Tasks
| Task ID | Title | Completed At | Verification | Notes |
|---|---|---|---|---|
| - | None | - | - | - |

## Handoff Log
- No handoff has been recorded yet.
`,
    "utf8"
  );
  for (const suffix of ["", "-shm", "-wal"]) {
    fs.rmSync(path.join(repoRoot, ".harness", `operating_state.sqlite${suffix}`), { force: true });
  }
}
