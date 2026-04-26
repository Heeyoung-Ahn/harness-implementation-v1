import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

export function registryPath() {
  const base = process.env.APPDATA ?? path.join(os.homedir(), ".standard-harness-pmw");
  return path.join(base, "StandardHarnessPMW", "projects.json");
}

export function loadRegistry(filePath = registryPath()) {
  if (!fs.existsSync(filePath)) {
    return { schemaVersion: "standard-harness-pmw-registry/v1", selectedProjectId: null, projects: [] };
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function saveRegistry(registry, filePath = registryPath()) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
  return registry;
}

export function readProjectManifest(repoRoot) {
  const manifestPath = path.join(path.resolve(repoRoot), ".agents", "runtime", "project-manifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Project manifest not found: ${manifestPath}. Run npm run harness:pmw-export in the project first.`);
  }
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

export function addProject({ repoRoot, name, registryFile } = {}) {
  const manifest = readProjectManifest(repoRoot);
  const registry = loadRegistry(registryFile);
  const project = {
    id: manifest.projectId,
    name: name ?? manifest.projectName,
    repoRoot: manifest.repoRoot,
    manifestPath: path.join(manifest.repoRoot, ".agents", "runtime", "project-manifest.json"),
    readModelPath: path.join(manifest.repoRoot, ".agents", "runtime", "pmw-read-model.json"),
    status: "active",
    addedAt: new Date().toISOString(),
    lastSelectedAt: null
  };
  registry.projects = registry.projects.filter((item) => item.id !== project.id);
  registry.projects.push(project);
  registry.selectedProjectId ??= project.id;
  return saveRegistry(registry, registryFile);
}

export function selectProject(projectId, registryFile) {
  const registry = loadRegistry(registryFile);
  const project = registry.projects.find((item) => item.id === projectId);
  if (!project) {
    throw new Error(`Unknown project id: ${projectId}`);
  }
  project.lastSelectedAt = new Date().toISOString();
  registry.selectedProjectId = projectId;
  return saveRegistry(registry, registryFile);
}

export function archiveProject(projectId, registryFile) {
  const registry = loadRegistry(registryFile);
  const project = registry.projects.find((item) => item.id === projectId);
  if (!project) {
    throw new Error(`Unknown project id: ${projectId}`);
  }
  project.status = "archived";
  if (registry.selectedProjectId === projectId) {
    registry.selectedProjectId = registry.projects.find((item) => item.status === "active" && item.id !== projectId)?.id ?? null;
  }
  return saveRegistry(registry, registryFile);
}

export function removeProject(projectId, registryFile) {
  const registry = loadRegistry(registryFile);
  registry.projects = registry.projects.filter((item) => item.id !== projectId);
  if (registry.selectedProjectId === projectId) {
    registry.selectedProjectId = registry.projects.find((item) => item.status === "active")?.id ?? null;
  }
  return saveRegistry(registry, registryFile);
}

export function readProjectReadModel(project) {
  if (!project || !fs.existsSync(project.readModelPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(project.readModelPath, "utf8"));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [command, value] = process.argv.slice(2);
  if (command === "add") {
    console.log(JSON.stringify(addProject({ repoRoot: value }), null, 2));
  } else if (command === "select") {
    console.log(JSON.stringify(selectProject(value), null, 2));
  } else if (command === "archive") {
    console.log(JSON.stringify(archiveProject(value), null, 2));
  } else if (command === "remove") {
    console.log(JSON.stringify(removeProject(value), null, 2));
  } else {
    console.log(JSON.stringify(loadRegistry(), null, 2));
  }
}
