import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { shouldIncludeStarterPayloadPath } from "./starter-payload-contract.js";

export const DEFAULT_GITHUB_REPO = "Heeyoung-Ahn/harness-implementation-v1";
export const DEFAULT_GITHUB_RELEASE = "latest";

const INSTALLER_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(INSTALLER_DIR, "..");
const LOCAL_STANDARD_TEMPLATE_ROOT = path.resolve(
  process.env.STANDARD_TEMPLATE_ROOT ?? path.join(PACKAGE_ROOT, "standard-template")
);
const STARTER_PREFIX = "standard-template/";
const KNOWN_PROFILE_IDS = new Set([
  "PRF-01",
  "PRF-02",
  "PRF-03",
  "PRF-04",
  "PRF-05",
  "PRF-06",
  "PRF-07",
  "PRF-08",
  "PRF-09"
]);
const EXISTING_REPO_ALLOWED_ENTRIES = new Set([".git", ".gitignore", ".gitattributes", ".editorconfig"]);

export function slugifyProjectName(projectName) {
  const normalized = String(projectName)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!normalized) {
    throw new Error("Could not derive a valid project slug.");
  }
  return normalized;
}

export function normalizeActiveProfiles(activeProfiles) {
  if (Array.isArray(activeProfiles)) {
    return normalizeActiveProfiles(activeProfiles.join(","));
  }
  const rawValue = String(activeProfiles ?? "none").trim();
  if (rawValue === "" || rawValue.toLowerCase() === "none") {
    return [];
  }
  const normalized = rawValue
    .split(",")
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);
  const deduped = [...new Set(normalized)];
  for (const profile of deduped) {
    if (!KNOWN_PROFILE_IDS.has(profile)) {
      throw new Error(`Unknown profile: ${profile}`);
    }
  }
  return deduped;
}

export function resolveBootstrapTarget(targetDir) {
  const resolvedTargetDir = path.resolve(targetDir);
  if (!fs.existsSync(resolvedTargetDir)) {
    return {
      targetDir: resolvedTargetDir,
      targetMode: "empty_new_project_folder",
      existingEntries: []
    };
  }

  const existingEntries = fs.readdirSync(resolvedTargetDir);
  if (existingEntries.length === 0) {
    return {
      targetDir: resolvedTargetDir,
      targetMode: "empty_new_project_folder",
      existingEntries
    };
  }

  const hasGitBoundary = existingEntries.includes(".git");
  const disallowedEntries = existingEntries.filter((entry) => !EXISTING_REPO_ALLOWED_ENTRIES.has(entry));
  if (!hasGitBoundary) {
    throw new Error(
      `Target folder is not empty and is not a valid existing local repository root: ${resolvedTargetDir}`
    );
  }
  if (disallowedEntries.length > 0) {
    throw new Error(
      `Existing repository target must contain only repo markers before bootstrap. Found: ${disallowedEntries.join(", ")}`
    );
  }

  return {
    targetDir: resolvedTargetDir,
    targetMode: "existing_local_repository_root",
    existingEntries
  };
}

export async function resolveGithubAuthority({
  githubRepo = DEFAULT_GITHUB_REPO,
  githubRef,
  githubRelease = DEFAULT_GITHUB_RELEASE,
  fetchImpl = globalThis.fetch
}) {
  if (!githubRepo || !/^[^/]+\/[^/]+$/.test(githubRepo)) {
    throw new Error("githubRepo must be in owner/repo form.");
  }
  if (typeof fetchImpl !== "function") {
    throw new Error("A fetch implementation is required for GitHub-backed bootstrap.");
  }

  if (githubRef) {
    return {
      authoritySource: "github",
      repo: githubRepo,
      ref: githubRef,
      selection: `ref:${githubRef}`
    };
  }

  if (githubRelease !== DEFAULT_GITHUB_RELEASE) {
    return {
      authoritySource: "github",
      repo: githubRepo,
      ref: githubRelease,
      selection: `release:${githubRelease}`
    };
  }

  const response = await fetchImpl(`https://api.github.com/repos/${githubRepo}/releases/latest`, {
    headers: buildGithubHeaders({ accept: "application/vnd.github+json" })
  });
  if (!response.ok) {
    throw new Error(`Failed to resolve latest GitHub release for ${githubRepo}: ${response.status} ${response.statusText}`);
  }
  const payload = await response.json();
  const tagName = String(payload?.tag_name ?? "").trim();
  if (!tagName) {
    throw new Error(`GitHub latest release for ${githubRepo} did not provide a tag_name.`);
  }

  return {
    authoritySource: "github",
    repo: githubRepo,
    ref: tagName,
    selection: `release:${tagName}`
  };
}

export async function bootstrapHarnessProject({
  projectName,
  targetDir,
  profiles = [],
  userGoal,
  opsGoal,
  approvalGoal,
  authoritySource = "github",
  githubRepo = DEFAULT_GITHUB_REPO,
  githubRef,
  githubRelease = DEFAULT_GITHUB_RELEASE,
  fetchImpl = globalThis.fetch,
  localStarterRoot = LOCAL_STANDARD_TEMPLATE_ROOT,
  runtimeNodePath = null,
  runInitializer = runStarterInitializer,
  writeWrappers = writeProjectWrappers
}) {
  const normalizedProjectName = requireNonEmpty(projectName, "projectName");
  const normalizedProfiles = normalizeActiveProfiles(profiles);
  const projectSlug = slugifyProjectName(normalizedProjectName);
  const target = resolveBootstrapTarget(targetDir);

  const authority =
    authoritySource === "local"
      ? {
          authoritySource: "local",
          repo: null,
          ref: null,
          selection: `local:${localStarterRoot}`
        }
      : await resolveGithubAuthority({
          githubRepo,
          githubRef,
          githubRelease,
          fetchImpl
        });

  const starterEntries =
    authority.authoritySource === "local"
      ? collectLocalStarterEntries(localStarterRoot)
      : await collectGithubStarterEntries({
          repo: authority.repo,
          ref: authority.ref,
          fetchImpl
        });

  applyStarterEntries({ targetDir: target.targetDir, starterEntries });

  const initResult = runInitializer({
    targetDir: target.targetDir,
    projectName: normalizedProjectName,
    projectSlug,
    userGoal: requireNonEmpty(userGoal, "userGoal"),
    opsGoal: requireNonEmpty(opsGoal, "opsGoal"),
    approvalGoal: requireNonEmpty(approvalGoal, "approvalGoal"),
    profiles: normalizedProfiles
  });
  writeWrappers({ repoRoot: target.targetDir, runtimeNodePath });

  return {
    ok: true,
    projectName: normalizedProjectName,
    projectSlug,
    targetDir: target.targetDir,
    targetMode: target.targetMode,
    authoritySource: authority.authoritySource,
    authoritySelection: authority.selection,
    authorityRepo: authority.repo,
    authorityRef: authority.ref,
    activeProfiles: normalizedProfiles,
    appliedFileCount: starterEntries.length,
    appliedTopLevelPaths: summarizeTopLevelPaths(starterEntries),
    runtimeNodePath,
    initResult,
    nextAction: "open START_HERE.md, fill PROJECT_STARTER_DOC_PACK, then run HARNESS.cmd status in the project folder."
  };
}

export function installBundledRuntime() {
  const bundledNode = process.env.STANDARD_HARNESS_BUNDLED_NODE;
  if (!bundledNode || !fs.existsSync(bundledNode)) {
    return null;
  }

  const localAppData = process.env.LOCALAPPDATA ?? path.join(process.env.USERPROFILE ?? process.cwd(), "AppData", "Local");
  const runtimeDir = path.join(localAppData, "StandardHarness", "Runtime");
  const targetNode = path.join(runtimeDir, "node.exe");
  fs.mkdirSync(runtimeDir, { recursive: true });
  fs.copyFileSync(bundledNode, targetNode);
  return targetNode;
}

export function writeProjectWrappers({ repoRoot, runtimeNodePath }) {
  const nodeCommand = runtimeNodePath ?? "node";
  const testFiles = [
    ".harness\\test\\active-context.test.js",
    ".harness\\test\\dev05-tooling.test.js",
    ".harness\\test\\generated-state-docs.test.js",
    ".harness\\test\\init-project.test.js",
    ".harness\\test\\operating-state-store.test.js"
  ];
  fs.writeFileSync(
    path.join(repoRoot, "HARNESS.cmd"),
    [
      "@echo off",
      "setlocal EnableExtensions",
      "pushd \"%~dp0\" >nul",
      `set "HARNESS_NODE=${nodeCommand}"`,
      "if \"%~1\"==\"\" goto usage",
      "if /i \"%~1\"==\"test\" goto test",
      "if /i \"%~1\"==\"init\" goto init",
      "if /i \"%~1\"==\"validate\" goto validate",
      "if /i \"%~1\"==\"doctor\" goto doctor",
      "if /i \"%~1\"==\"status\" goto status",
      "if /i \"%~1\"==\"next\" goto next",
      "if /i \"%~1\"==\"explain\" goto explain",
      "if /i \"%~1\"==\"validation-report\" goto validation_report",
      "if /i \"%~1\"==\"context\" goto context",
      "if /i \"%~1\"==\"migration-preview\" goto migration_preview",
      "if /i \"%~1\"==\"migration-apply\" goto migration_apply",
      "if /i \"%~1\"==\"cutover-preflight\" goto cutover_preflight",
      "if /i \"%~1\"==\"cutover-report\" goto cutover_report",
      "goto usage",
      ":test",
      `"%HARNESS_NODE%" --test ${testFiles.map((file) => `"${file}"`).join(" ")}`,
      "goto finish",
      ":init",
      "\"%HARNESS_NODE%\" \".agents\\scripts\\init-project.js\"",
      "goto finish",
      ":validate",
      "\"%HARNESS_NODE%\" \".harness\\runtime\\state\\dev05-cli.js\" validate",
      "goto finish",
      ":doctor",
      "\"%HARNESS_NODE%\" \".harness\\runtime\\state\\dev05-cli.js\" doctor",
      "goto finish",
      ":status",
      "\"%HARNESS_NODE%\" \".harness\\runtime\\state\\dev05-cli.js\" status",
      "goto finish",
      ":next",
      "\"%HARNESS_NODE%\" \".harness\\runtime\\state\\dev05-cli.js\" next",
      "goto finish",
      ":explain",
      "\"%HARNESS_NODE%\" \".harness\\runtime\\state\\dev05-cli.js\" explain",
      "goto finish",
      ":validation_report",
      "\"%HARNESS_NODE%\" \".harness\\runtime\\state\\dev05-cli.js\" validation-report",
      "goto finish",
      ":context",
      "\"%HARNESS_NODE%\" \".harness\\runtime\\state\\dev05-cli.js\" context",
      "goto finish",
      ":migration_preview",
      "\"%HARNESS_NODE%\" \".harness\\runtime\\state\\dev05-cli.js\" migration-preview",
      "goto finish",
      ":migration_apply",
      "\"%HARNESS_NODE%\" \".harness\\runtime\\state\\dev05-cli.js\" migration-apply",
      "goto finish",
      ":cutover_preflight",
      "\"%HARNESS_NODE%\" \".harness\\runtime\\state\\dev05-cli.js\" cutover-preflight",
      "goto finish",
      ":cutover_report",
      "\"%HARNESS_NODE%\" \".harness\\runtime\\state\\dev05-cli.js\" cutover-report",
      "goto finish",
      ":usage",
      "echo Usage: HARNESS.cmd ^<test^|status^|validate^|doctor^|next^|explain^|validation-report^|context^|migration-preview^|migration-apply^|cutover-preflight^|cutover-report^>",
      "set \"EXIT_CODE=1\"",
      "goto done",
      ":finish",
      "set \"EXIT_CODE=%ERRORLEVEL%\"",
      ":done",
      "popd >nul",
      "exit /b %EXIT_CODE%",
      ""
    ].join("\r\n"),
    "utf8"
  );
}

function collectLocalStarterEntries(localStarterRoot) {
  if (!fs.existsSync(localStarterRoot)) {
    throw new Error(`Standard template payload not found: ${localStarterRoot}`);
  }

  const entries = [];
  walkLocalStarter(localStarterRoot, localStarterRoot, entries);
  return entries.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

function walkLocalStarter(rootDir, currentDir, entries) {
  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    const absolutePath = path.join(currentDir, entry.name);
    const relativePath = path.relative(rootDir, absolutePath).replaceAll("\\", "/");
    if (entry.isDirectory()) {
      walkLocalStarter(rootDir, absolutePath, entries);
      continue;
    }
    if (!shouldIncludeStarterPayloadPath(relativePath)) {
      continue;
    }
    entries.push({
      relativePath,
      content: fs.readFileSync(absolutePath)
    });
  }
}

async function collectGithubStarterEntries({ repo, ref, fetchImpl }) {
  const treeResponse = await fetchImpl(
    `https://api.github.com/repos/${repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`,
    {
      headers: buildGithubHeaders({ accept: "application/vnd.github+json" })
    }
  );
  if (!treeResponse.ok) {
    throw new Error(`Failed to read GitHub tree for ${repo}@${ref}: ${treeResponse.status} ${treeResponse.statusText}`);
  }
  const treePayload = await treeResponse.json();
  const treeEntries = Array.isArray(treePayload?.tree) ? treePayload.tree : [];
  const starterBlobs = treeEntries
    .filter((entry) => entry?.type === "blob" && typeof entry.path === "string" && entry.path.startsWith(STARTER_PREFIX))
    .map((entry) => ({
      sourcePath: entry.path,
      relativePath: entry.path.slice(STARTER_PREFIX.length)
    }))
    .filter((entry) => shouldIncludeStarterPayloadPath(entry.relativePath))
    .sort((left, right) => left.relativePath.localeCompare(right.relativePath));

  const downloadedEntries = [];
  for (const entry of starterBlobs) {
    const rawResponse = await fetchImpl(
      `https://raw.githubusercontent.com/${repo}/${encodeURIComponent(ref)}/${entry.sourcePath}`,
      {
        headers: buildGithubHeaders({ accept: "application/octet-stream" })
      }
    );
    if (!rawResponse.ok) {
      throw new Error(
        `Failed to download ${entry.sourcePath} from ${repo}@${ref}: ${rawResponse.status} ${rawResponse.statusText}`
      );
    }
    downloadedEntries.push({
      relativePath: entry.relativePath,
      content: Buffer.from(await rawResponse.arrayBuffer())
    });
  }
  return downloadedEntries;
}

function applyStarterEntries({ targetDir, starterEntries }) {
  fs.mkdirSync(targetDir, { recursive: true });
  for (const entry of starterEntries) {
    const destinationPath = path.join(targetDir, entry.relativePath);
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    fs.writeFileSync(destinationPath, entry.content);
  }
}

function runStarterInitializer({
  targetDir,
  projectName,
  projectSlug,
  userGoal,
  opsGoal,
  approvalGoal,
  profiles
}) {
  const initScript = path.join(targetDir, ".agents", "scripts", "init-project.js");
  if (!fs.existsSync(initScript)) {
    throw new Error(`Starter init script not found after bootstrap apply: ${initScript}`);
  }

  const args = [
    initScript,
    "--project-name",
    projectName,
    "--project-slug",
    projectSlug,
    "--user-goal",
    userGoal,
    "--ops-goal",
    opsGoal,
    "--approval-goal",
    approvalGoal,
    "--profiles",
    profiles.length ? profiles.join(",") : "none",
    "--non-interactive"
  ];

  const result = spawnSync(process.execPath, args, {
    cwd: targetDir,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    throw new Error(
      `Starter initialization failed: ${(result.stderr || result.stdout || `exit code ${result.status ?? "unknown"}`).trim()}`
    );
  }
  return {
    ok: true,
    stdout: result.stdout.trim()
  };
}

function summarizeTopLevelPaths(starterEntries) {
  return [...new Set(starterEntries.map((entry) => entry.relativePath.split("/")[0]).filter(Boolean))].sort();
}

function buildGithubHeaders({ accept }) {
  return {
    Accept: accept,
    "User-Agent": "standard-harness-bootstrapper"
  };
}

function requireNonEmpty(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
  return value.trim();
}
