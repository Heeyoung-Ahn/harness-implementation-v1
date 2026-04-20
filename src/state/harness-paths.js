import fs from "node:fs";
import path from "node:path";

export const GENERATED_DOCS_DIR = ".agents/runtime/generated-state-docs";

export const ARTIFACT_PATHS = {
  requirements: ".agents/artifacts/REQUIREMENTS.md",
  architecture: ".agents/artifacts/ARCHITECTURE_GUIDE.md",
  plan: ".agents/artifacts/IMPLEMENTATION_PLAN.md",
  ui: "reference/artifacts/UI_DESIGN.md",
  packet: "reference/packets/PKT-01_DEV-04_PMW_READ_SURFACE.md",
  active: ".agents/artifacts/CURRENT_STATE.md",
  preventive: ".agents/artifacts/PREVENTIVE_MEMORY.md"
};

export function resolveArtifactPath(repoRoot, key) {
  return path.resolve(path.resolve(repoRoot), getArtifactPath(key));
}

export function resolveArtifactRelativePath(_repoRoot, key) {
  return getArtifactPath(key);
}

export function resolveGeneratedDocReadPath({ outputDir, docName }) {
  return path.resolve(path.resolve(outputDir), GENERATED_DOCS_DIR, docName);
}

export function resolveGeneratedDocRelativePath({ docName }) {
  return `${GENERATED_DOCS_DIR}/${docName}`;
}

export function resolveGeneratedDocWritePaths({ outputDir, docName }) {
  return [path.resolve(path.resolve(outputDir), GENERATED_DOCS_DIR, docName)];
}

export function writeSecondaryFile(targetPath, content) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content, "utf8");
  return { ok: true, path: targetPath };
}

export function artifactExists(repoRoot, key) {
  return fs.existsSync(resolveArtifactPath(repoRoot, key));
}

function getArtifactPath(key) {
  const resolved = ARTIFACT_PATHS[key];
  if (!resolved) {
    throw new Error(`Unknown artifact path key: ${key}`);
  }
  return resolved;
}
