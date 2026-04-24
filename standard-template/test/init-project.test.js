import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildPmwReadSurface } from "../src/pmw/read-surface.js";
import { createOperatingStateStore } from "../src/state/operating-state-store.js";
import { initializeProjectStarter } from "../src/state/init-project.js";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));

test("initializes a copied starter repo and seeds PMW-ready state", () => {
  const repoRoot = copyStarterRepo();

  const result = initializeProjectStarter({
    repoRoot,
    projectName: "Budget Control Suite",
    userGoal: "예산 운영 담당자가 월별 집행과 계획 차이를 빠르게 판단한다.",
    opsGoal: "운영자와 AI가 현재 기준선, active packet, 다음 행동을 빠르게 복원한다.",
    approvalGoal: "PLN-00과 PLN-01을 닫아 첫 설계/구현 lane을 승인한다.",
    activeProfiles: ["PRF-01", "PRF-02"],
    now: createClock("2026-04-23T10:00:00.000Z")
  });

  assert.equal(result.ok, true);
  assert.equal(result.projectSlug, "budget-control-suite");
  assert.equal(fs.existsSync(path.join(repoRoot, ".harness", "operating_state.sqlite")), true);

  const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
  assert.equal(packageJson.name, "budget-control-suite");

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

  assert.match(currentState, /Current Stage: planning/);
  assert.match(currentState, /Budget Control Suite/);
  assert.match(currentState, /START_HERE\.md/);
  assert.match(readme, /START_HERE\.md/);
  assert.match(requirements, /PRF-01 admin grid application profile/);
  assert.match(requirements, /PRF-02 authoritative spreadsheet source profile/);
  assert.match(implementationPlan, /Selected profiles at bootstrap:/);
  assert.match(generatedState, /Release stage: planning/);

  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, ".harness", "operating_state.sqlite")
  });
  assert.match(store.getReleaseState("current").currentFocus, /Budget Control Suite/);
  assert.equal(store.getWorkItem("PLN-00").status, "in_progress");
  assert.equal(store.getWorkItem("PLN-01").status, "todo");

  const surface = buildPmwReadSurface({ store, repoRoot, outputDir: repoRoot });
  store.close();

  assert.equal(surface.title, "Budget Control Suite");
  assert.equal(surface.overview.views.progress.rows[0].id, "PLN-00");
  assert.equal(surface.overview.views.progress.rows[0].tone, "review");
  assert.equal(surface.header[0].title, "Kickoff interview");
  assert.equal(surface.artifacts.byKey["project-progress"].path, ".agents/artifacts/PROJECT_PROGRESS.md");
  assert.equal(surface.artifacts.byKey["packet-template"].path, "reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md");
});

test("refuses to reinitialize an already-edited repo without force", () => {
  const repoRoot = copyStarterRepo();
  const currentStatePath = path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md");
  fs.writeFileSync(
    currentStatePath,
    fs.readFileSync(currentStatePath, "utf8").replace("Current Stage: not started", "Current Stage: planning"),
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
  return repoRoot;
}

function detectStarterSource() {
  const repoRoot = path.resolve(TEST_DIR, "..");
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
