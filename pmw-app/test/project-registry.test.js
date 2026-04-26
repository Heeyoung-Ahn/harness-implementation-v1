import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  addProject,
  archiveProject,
  loadRegistry,
  readProjectReadModel,
  removeProject,
  selectProject
} from "../runtime/project-registry.js";

test("project registry can add, select, archive, remove, and read exported project models", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pmw-registry-"));
  const registryFile = path.join(root, "projects.json");
  const repoA = seedProject(root, "alpha-project", "Alpha Project", "planning");
  const repoB = seedProject(root, "beta-project", "Beta Project", "implementation");

  addProject({ repoRoot: repoA, registryFile });
  addProject({ repoRoot: repoB, registryFile });
  let registry = loadRegistry(registryFile);
  assert.equal(registry.projects.length, 2);
  assert.equal(registry.selectedProjectId, "alpha-project");

  selectProject("beta-project", registryFile);
  registry = loadRegistry(registryFile);
  assert.equal(registry.selectedProjectId, "beta-project");
  const beta = registry.projects.find((item) => item.id === "beta-project");
  assert.equal(readProjectReadModel(beta).project.name, "Beta Project");

  archiveProject("beta-project", registryFile);
  registry = loadRegistry(registryFile);
  assert.equal(registry.projects.find((item) => item.id === "beta-project").status, "archived");
  assert.equal(registry.selectedProjectId, "alpha-project");

  removeProject("alpha-project", registryFile);
  registry = loadRegistry(registryFile);
  assert.deepEqual(registry.projects.map((item) => item.id), ["beta-project"]);
  assert.equal(registry.selectedProjectId, null);
});

function seedProject(root, id, name, stage) {
  const repoRoot = path.join(root, id);
  fs.mkdirSync(path.join(repoRoot, ".agents", "runtime"), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, ".agents", "runtime", "project-manifest.json"), `${JSON.stringify({
    schemaVersion: "standard-harness-project-manifest/v1",
    projectId: id,
    projectName: name,
    projectSlug: id,
    repoRoot,
    generatedAt: "2026-04-26T00:00:00.000Z",
    source: {
      pmwReadModel: ".agents/runtime/pmw-read-model.json"
    },
    status: {
      stage,
      gate: "open",
      focus: `${name} focus`,
      releaseGoal: `${name} goal`
    },
    activeProfiles: []
  }, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "runtime", "pmw-read-model.json"), `${JSON.stringify({
    schemaVersion: "standard-harness-pmw-read-model/v1",
    generatedAt: "2026-04-26T00:00:00.000Z",
    project: { id, name, repoRoot },
    context: {
      releaseState: {
        currentStage: stage,
        releaseGateState: "open",
        currentFocus: `${name} focus`
      },
      surfaces: {
        nextAction: { headline: `${name} next action` }
      },
      diagnostics: []
    }
  }, null, 2)}\n`, "utf8");
  return repoRoot;
}
