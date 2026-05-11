import fs from "node:fs";
import path from "node:path";

export const RELEASE_BASELINE = Object.freeze({
  label: "V1.3",
  validatorVersion: "v1.3",
  windowsExeDirectory: "windows-exe-v1.3",
  releasePackageDirectory: "standard-harness-v1.3",
  currentFocus: "V1.3 CLI-first PMW-free harness baseline is implemented and verified",
  releaseGoal:
    "Preserve the V1.3 installable standard harness baseline: standard-template is the installable project generator payload, CLI active context is the re-entry surface, and PRF-04 through PRF-09 are verified reusable profiles.",
  closedNextAction:
    "V1.3 is closed. Start the next real project by running StandardHarnessSetup.exe or by copying standard-template and running harness:init."
});

export const ROOT_RELEASE_BASELINE_MARKERS = Object.freeze([
  {
    relativePath: ".agents/artifacts/CURRENT_STATE.md",
    marker: RELEASE_BASELINE.currentFocus
  },
  {
    relativePath: ".agents/artifacts/TASK_LIST.md",
    marker: "CLI-first PMW decommission"
  },
  {
    relativePath: ".agents/artifacts/PROJECT_PROGRESS.md",
    marker: "V1.2 installable harness / PMW baseline reconciliation"
  },
  {
    relativePath: ".agents/artifacts/IMPLEMENTATION_PLAN.md",
    marker: "DEV-11 CLI-first PMW decommission"
  },
  {
    relativePath: ".agents/artifacts/REQUIREMENTS.md",
    marker: RELEASE_BASELINE.currentFocus
  },
  {
    relativePath: "reference/artifacts/REVIEW_REPORT.md",
    marker: "# Review Report"
  }
]);

const MAINTAINER_RELEASE_PATHS = Object.freeze([
  "installer/install-harness.js",
  "packaging/build-windows-exe-installers.js",
  "packaging/build-release-package.js",
  "reference/manuals/HARNESS_MANUAL.md"
]);

export function isInstallableReleaseMaintainerRepo(repoRoot = process.cwd()) {
  const root = path.resolve(repoRoot);
  return MAINTAINER_RELEASE_PATHS.every((relativePath) => fs.existsSync(path.join(root, relativePath)));
}
