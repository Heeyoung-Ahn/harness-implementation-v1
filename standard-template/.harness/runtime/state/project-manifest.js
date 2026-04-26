import fs from "node:fs";
import path from "node:path";

import { buildContextRestorationReadModel } from "./context-restoration-read-model.js";
import { ACTIVE_PROFILES_MARKDOWN } from "./harness-paths.js";

export const PROJECT_MANIFEST_PATH = ".agents/runtime/project-manifest.json";
export const PMW_READ_MODEL_PATH = ".agents/runtime/pmw-read-model.json";

export function writePmwProjectExport({ store, repoRoot = process.cwd(), outputDir = repoRoot } = {}) {
  const root = path.resolve(repoRoot);
  const out = path.resolve(outputDir);
  const releaseState = store.getReleaseState("current");
  const manifest = buildProjectManifest({ store, repoRoot: root, outputDir: out, releaseState });
  const readModel = {
    schemaVersion: "standard-harness-pmw-read-model/v1",
    generatedAt: new Date().toISOString(),
    project: {
      id: manifest.projectId,
      name: manifest.projectName,
      repoRoot: manifest.repoRoot
    },
    context: buildContextRestorationReadModel({ store, repoRoot: root, outputDir: out })
  };

  writeJson(path.join(root, PROJECT_MANIFEST_PATH), manifest);
  writeJson(path.join(root, PMW_READ_MODEL_PATH), readModel);

  return {
    ok: true,
    command: "pmw-export",
    manifestPath: path.join(root, PROJECT_MANIFEST_PATH),
    readModelPath: path.join(root, PMW_READ_MODEL_PATH),
    manifest,
    readModel
  };
}

export function buildProjectManifest({ store, repoRoot = process.cwd(), outputDir = repoRoot, releaseState } = {}) {
  const root = path.resolve(repoRoot);
  const state = releaseState ?? store.getReleaseState("current");
  const metadata = state?.metadata ?? {};
  const projectName = metadata.projectName ?? inferProjectName(root);
  const projectSlug = metadata.projectSlug ?? slugify(projectName);

  return {
    schemaVersion: "standard-harness-project-manifest/v1",
    projectId: projectSlug,
    projectName,
    projectSlug,
    repoRoot: root,
    generatedAt: new Date().toISOString(),
    source: {
      currentState: ".agents/artifacts/CURRENT_STATE.md",
      taskList: ".agents/artifacts/TASK_LIST.md",
      activeProfiles: ACTIVE_PROFILES_MARKDOWN,
      generatedCurrentState: ".agents/runtime/generated-state-docs/CURRENT_STATE.md",
      generatedTaskList: ".agents/runtime/generated-state-docs/TASK_LIST.md",
      pmwReadModel: PMW_READ_MODEL_PATH
    },
    status: {
      stage: state?.currentStage ?? "unknown",
      gate: state?.releaseGateState ?? "unknown",
      focus: state?.currentFocus ?? "unknown",
      releaseGoal: state?.releaseGoal ?? "unknown"
    },
    activeProfiles: readActiveProfiles(root),
    outputDir: path.resolve(outputDir)
  };
}

function readActiveProfiles(repoRoot) {
  const activeProfilePath = path.join(repoRoot, ACTIVE_PROFILES_MARKDOWN);
  if (!fs.existsSync(activeProfilePath)) {
    return [];
  }

  return fs
    .readFileSync(activeProfilePath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim().startsWith("| PRF-"))
    .map((line) => {
      const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
      return {
        profileId: cells[0],
        activationReason: cells[1],
        evidenceStatus: cells[3],
        appliesToPackets: cells[6]
      };
    });
}

function writeJson(targetPath, value) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function inferProjectName(repoRoot) {
  return path.basename(path.resolve(repoRoot));
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "standard-harness-project";
}
