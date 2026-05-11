#!/usr/bin/env node

import process from "node:process";
import readline from "node:readline/promises";
import { parseArgs } from "node:util";

import {
  bootstrapHarnessProject,
  DEFAULT_GITHUB_RELEASE,
  DEFAULT_GITHUB_REPO,
  installBundledRuntime,
  normalizeActiveProfiles,
  slugifyProjectName
} from "./bootstrap-runtime.js";

const options = parseArgs({
  options: {
    "project-name": { type: "string" },
    "target-dir": { type: "string" },
    profiles: { type: "string" },
    "user-goal": { type: "string" },
    "ops-goal": { type: "string" },
    "approval-goal": { type: "string" },
    "authority-source": { type: "string" },
    "github-repo": { type: "string" },
    "github-ref": { type: "string" },
    "github-release": { type: "string" },
    "non-interactive": { type: "boolean" },
    help: { type: "boolean" }
  },
  allowPositionals: false
}).values;

if (options.help) {
  process.stdout.write(
    [
      "Usage: node installer/install-harness.js --project-name <name> --target-dir <folder> [options]",
      "",
      "Options:",
      "  --authority-source <github|local>   Bootstrap authority source (default: github)",
      `  --github-repo <owner/repo>          GitHub authority repo (default: ${DEFAULT_GITHUB_REPO})`,
      "  --github-ref <tag-or-ref>           Explicit GitHub ref override",
      `  --github-release <tag|latest>       GitHub release selection (default: ${DEFAULT_GITHUB_RELEASE})`,
      "  --profiles <ids>                    Comma-separated profiles like PRF-07,PRF-09 or none",
      "  --non-interactive                   Use defaults for missing prompts"
    ].join("\n") + "\n"
  );
  process.exit(0);
}

const projectName =
  options["project-name"] ??
  (options["non-interactive"] ? "New Harness Project" : await prompt("Project name", "New Harness Project"));
const projectSlug = slugifyProjectName(projectName);
const targetDir =
  options["target-dir"] ??
  (options["non-interactive"] ? projectSlug : await prompt("Project folder", projectSlug));
const profiles = normalizeActiveProfiles(
  options.profiles ?? (options["non-interactive"] ? "none" : await prompt("Active profiles", "none"))
);
const userGoal = options["user-goal"] ?? `${projectName} 사용자가 현재 판단 지점을 빠르게 이해한다.`;
const opsGoal = options["ops-goal"] ?? `${projectName} 운영 상태와 다음 행동을 CLI active context에서 복원한다.`;
const approvalGoal = options["approval-goal"] ?? `${projectName}의 PLN-00과 PLN-01을 닫아 첫 구현 lane을 연다.`;
const runtimeNodePath = installBundledRuntime();

const result = await bootstrapHarnessProject({
  projectName,
  targetDir,
  profiles,
  userGoal,
  opsGoal,
  approvalGoal,
  authoritySource: options["authority-source"] ?? "github",
  githubRepo: options["github-repo"] ?? DEFAULT_GITHUB_REPO,
  githubRef: options["github-ref"],
  githubRelease: options["github-release"] ?? DEFAULT_GITHUB_RELEASE,
  runtimeNodePath
});

process.stdout.write(
  [
    "Standard harness project installed.",
    `- Project: ${result.projectName}`,
    `- Folder: ${result.targetDir}`,
    `- Target mode: ${result.targetMode}`,
    `- Authority source: ${result.authoritySource}`,
    `- Authority selection: ${result.authoritySelection}`,
    result.authorityRepo ? `- Authority repo: ${result.authorityRepo}` : null,
    result.authorityRef ? `- Authority ref: ${result.authorityRef}` : null,
    `- Applied top-level paths: ${result.appliedTopLevelPaths.join(", ")}`,
    `- Applied file count: ${result.appliedFileCount}`,
    `- Active profiles: ${profiles.length ? profiles.join(", ") : "none"}`,
    runtimeNodePath ? `- Bundled runtime: ${runtimeNodePath}` : "- Bundled runtime: not installed; system Node.js is required",
    "- Active context: initialized",
    `- Next action: ${result.nextAction}`
  ]
    .filter(Boolean)
    .join("\n") + "\n"
);

async function prompt(label, fallback) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(`${label} [${fallback}] `);
    return answer.trim() || fallback;
  } finally {
    rl.close();
  }
}
