import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { parseArgs } from "node:util";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

import { initializeProjectStarter, normalizeActiveProfiles, slugifyProjectName } from "../standard-template/.harness/runtime/state/init-project.js";

const INSTALLER_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(INSTALLER_DIR, "..");
const STANDARD_TEMPLATE_ROOT = path.resolve(process.env.STANDARD_TEMPLATE_ROOT ?? path.join(PACKAGE_ROOT, "standard-template"));

const options = parseArgs({
  options: {
    "project-name": { type: "string" },
    "target-dir": { type: "string" },
    profiles: { type: "string" },
    "user-goal": { type: "string" },
    "ops-goal": { type: "string" },
    "approval-goal": { type: "string" },
    "non-interactive": { type: "boolean" },
    help: { type: "boolean" }
  },
  allowPositionals: false
}).values;

if (options.help) {
  process.stdout.write(`Usage: node installer/install-harness.js --project-name <name> --target-dir <folder> [--profiles PRF-07,PRF-09]\n`);
  process.exit(0);
}

const projectName = options["project-name"] ?? (options["non-interactive"] ? "New Harness Project" : await prompt("Project name", "New Harness Project"));
const projectSlug = slugifyProjectName(projectName);
const targetDir = path.resolve(options["target-dir"] ?? (options["non-interactive"] ? projectSlug : await prompt("Project folder", projectSlug)));
const profiles = normalizeActiveProfiles(options.profiles ?? (options["non-interactive"] ? "none" : await prompt("Active profiles", "none")));
const userGoal = options["user-goal"] ?? `${projectName} 사용자가 현재 판단 지점을 빠르게 이해한다.`;
const opsGoal = options["ops-goal"] ?? `${projectName} 운영 상태와 다음 행동을 CLI active context에서 복원한다.`;
const approvalGoal = options["approval-goal"] ?? `${projectName}의 PLN-00과 PLN-01을 닫아 첫 구현 lane을 연다.`;
const runtimeNodePath = installBundledRuntime();

if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
  throw new Error(`Target folder already exists and is not empty: ${targetDir}`);
}

copyStarterTemplate(targetDir);
const initResult = initializeProjectStarter({
  repoRoot: targetDir,
  projectName,
  projectSlug,
  userGoal,
  opsGoal,
  approvalGoal,
  activeProfiles: profiles
});
writeProjectWrappers({ repoRoot: targetDir, runtimeNodePath });

process.stdout.write(
  [
    "Standard harness project installed.",
    `- Project: ${initResult.projectName}`,
    `- Folder: ${targetDir}`,
    `- Active profiles: ${profiles.length ? profiles.join(", ") : "none"}`,
    runtimeNodePath ? `- Bundled runtime: ${runtimeNodePath}` : "- Bundled runtime: not installed; system Node.js is required",
    "- Active context: initialized",
    "- Next action: run HARNESS.cmd test and HARNESS.cmd status in the project folder."
  ].join("\n") + "\n"
);

function copyStarterTemplate(targetDir) {
  const source = STANDARD_TEMPLATE_ROOT;
  if (!fs.existsSync(source)) {
    throw new Error(`Standard template payload not found: ${source}`);
  }
  fs.mkdirSync(targetDir, { recursive: true });
  fs.cpSync(source, targetDir, {
    recursive: true,
    filter(sourcePath) {
      const normalized = sourcePath.replaceAll("\\", "/");
      return !normalized.endsWith("/.harness/operating_state.sqlite") &&
        !normalized.endsWith("/.harness/operating_state.sqlite-shm") &&
        !normalized.endsWith("/.harness/operating_state.sqlite-wal");
    }
  });
}

function installBundledRuntime() {
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

function writeProjectWrappers({ repoRoot, runtimeNodePath }) {
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

async function prompt(label, fallback) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(`${label} [${fallback}] `);
    return answer.trim() || fallback;
  } finally {
    rl.close();
  }
}
