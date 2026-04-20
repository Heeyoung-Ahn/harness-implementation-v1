import fs from "node:fs";
import path from "node:path";

export const GENERATED_DOCS_DIR = ".agents/runtime/generated-state-docs";

export const ARTIFACT_CANDIDATES = {
  requirements: [".agents/artifacts/REQUIREMENTS.md", "REQUIREMENTS.md"],
  architecture: [".agents/artifacts/ARCHITECTURE_GUIDE.md", "ARCHITECTURE_GUIDE.md"],
  plan: [".agents/artifacts/IMPLEMENTATION_PLAN.md", "IMPLEMENTATION_PLAN.md"],
  ui: ["reference/artifacts/UI_DESIGN.md", "UI_DESIGN.md"],
  packet: ["PKT-01_DEV-04_PMW_READ_SURFACE.md"],
  active: [".agents/artifacts/CURRENT_STATE.md", "codex/project-context/active-state.md"],
  preventive: [".agents/artifacts/PREVENTIVE_MEMORY.md", "codex/project-context/preventive-memory.md"]
};

export function resolveArtifactPath(repoRoot, key) {
  const root = path.resolve(repoRoot);
  const candidates = getArtifactCandidates(key).map((item) => path.resolve(root, item));
  return firstExisting(candidates) ?? candidates[0];
}

export function resolveArtifactRelativePath(repoRoot, key) {
  return toRelative(repoRoot, resolveArtifactPath(repoRoot, key));
}

export function resolveGeneratedDocReadPath({ outputDir, docName }) {
  const candidates = resolveGeneratedDocCandidates(outputDir, docName);
  return firstExisting(candidates) ?? candidates[0];
}

export function resolveGeneratedDocRelativePath({ repoRoot, outputDir, docName }) {
  return toRelative(repoRoot ?? outputDir, resolveGeneratedDocReadPath({ outputDir, docName }));
}

export function resolveGeneratedDocWritePaths({ outputDir, docName }) {
  const out = path.resolve(outputDir);
  return unique([
    path.resolve(out, docName),
    path.resolve(out, GENERATED_DOCS_DIR, docName)
  ]);
}

export function writeSecondaryFile(targetPath, content) {
  try {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content, "utf8");
    return { ok: true, path: targetPath };
  } catch (error) {
    return {
      ok: false,
      path: targetPath,
      code: error?.code ?? "write_failed",
      message: error?.message ?? "Secondary write failed."
    };
  }
}

function getArtifactCandidates(key) {
  return ARTIFACT_CANDIDATES[key] ?? [String(key)];
}

function resolveGeneratedDocCandidates(outputDir, docName) {
  const out = path.resolve(outputDir);
  return [
    path.resolve(out, GENERATED_DOCS_DIR, docName),
    path.resolve(out, docName)
  ];
}

function firstExisting(paths) {
  return paths.find((item) => fs.existsSync(item)) ?? null;
}

function toRelative(root, absolutePath) {
  const normalized = path.relative(path.resolve(root), absolutePath).replaceAll("\\", "/");
  return normalized || path.basename(absolutePath);
}

function unique(values) {
  return [...new Set(values)];
}
