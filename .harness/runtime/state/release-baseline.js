import fs from "node:fs";
import path from "node:path";

export const RELEASE_BASELINE = Object.freeze({
  label: "V1.2",
  validatorVersion: "v1.2",
  windowsExeDirectory: "windows-exe-v1.2",
  releasePackageDirectory: "standard-harness-v1.2",
  currentFocus: "V1.2 installable harness / PMW baseline is implemented and verified",
  releaseGoal:
    "Preserve the V1.2 installable standard harness baseline: standard-template is the installable project generator payload, PMW is a separate installable multi-project read-only monitor, and PRF-04 through PRF-09 are verified reusable profiles.",
  closedNextAction:
    "V1.2 is closed. Start the next real project by running StandardHarnessSetup.exe or by copying standard-template and running harness:init."
});

export const ROOT_RELEASE_BASELINE_MARKERS = Object.freeze([
  {
    relativePath: ".agents/artifacts/CURRENT_STATE.md",
    marker: RELEASE_BASELINE.currentFocus
  },
  {
    relativePath: ".agents/artifacts/TASK_LIST.md",
    marker: "V1.2 installable harness / PMW baseline"
  },
  {
    relativePath: ".agents/artifacts/PROJECT_PROGRESS.md",
    marker: "V1.2 installable harness / PMW baseline reconciliation"
  },
  {
    relativePath: ".agents/artifacts/IMPLEMENTATION_PLAN.md",
    marker: "## V1.2 Installable Harness / PMW Baseline"
  },
  {
    relativePath: ".agents/artifacts/REQUIREMENTS.md",
    marker: "V1.2 baseline is implemented"
  },
  {
    relativePath: "reference/artifacts/REVIEW_REPORT.md",
    marker: "## 2026-04-27 V1.2 Installable Harness / PMW Baseline Reconciliation"
  }
]);

const MAINTAINER_RELEASE_PATHS = Object.freeze([
  "installer/install-harness.js",
  "pmw-app/install-pmw.js",
  "packaging/build-windows-exe-installers.js",
  "packaging/build-release-package.js",
  "reference/manuals/HARNESS_MANUAL.md",
  "reference/manuals/PMW_MANUAL.md"
]);

export function isInstallableReleaseMaintainerRepo(repoRoot = process.cwd()) {
  const root = path.resolve(repoRoot);
  return MAINTAINER_RELEASE_PATHS.every((relativePath) => fs.existsSync(path.join(root, relativePath)));
}
