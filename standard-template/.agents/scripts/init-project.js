import process from "node:process";
import { parseArgs } from "node:util";
import readline from "node:readline/promises";

import {
  KNOWN_PROFILES,
  initializeProjectStarter,
  normalizeActiveProfiles,
  slugifyProjectName
} from "../../.harness/runtime/state/init-project.js";

const MIN_NODE_MAJOR = 24;

const HELP = `Usage: node .agents/scripts/init-project.js [options]

Options:
  --project-name <name>      Human-readable project name
  --project-slug <slug>      package.json name override
  --user-goal <text>         Primary user goal
  --ops-goal <text>          Primary operator goal
  --approval-goal <text>     First approval target
  --profiles <list>          Comma-separated optional profiles (PRF-01..PRF-09 or none)
  --force                    Reinitialize an already-edited starter repo
  --non-interactive          Do not prompt; fill missing values with defaults
  --help                     Show this message
`;

enforceSupportedNodeRuntime();

const options = parseArgs({
  options: {
    "project-name": { type: "string" },
    "project-slug": { type: "string" },
    "user-goal": { type: "string" },
    "ops-goal": { type: "string" },
    "approval-goal": { type: "string" },
    profiles: { type: "string" },
    force: { type: "boolean" },
    "non-interactive": { type: "boolean" },
    help: { type: "boolean" }
  },
  allowPositionals: false
}).values;

if (options.help) {
  process.stdout.write(HELP);
  process.exit(0);
}

const projectName =
  options["project-name"] ??
  (options["non-interactive"] ? defaultProjectName(process.cwd()) : await prompt("Project name", defaultProjectName(process.cwd())));
const projectSlug =
  options["project-slug"] ??
  (options["non-interactive"] ? slugifyProjectName(projectName) : await prompt("Project slug", slugifyProjectName(projectName)));
const userGoal =
  options["user-goal"] ??
  (options["non-interactive"]
    ? `${projectName} 사용자가 지금 판단해야 하는 핵심 문제를 빠르게 해결한다.`
    : await prompt("User goal", `${projectName} 사용자가 지금 판단해야 하는 핵심 문제를 빠르게 해결한다.`));
const opsGoal =
  options["ops-goal"] ??
  (options["non-interactive"]
    ? `${projectName} 운영 상태와 다음 행동을 CLI와 Active Context에서 빠르게 복원한다.`
    : await prompt("Operator goal", `${projectName} 운영 상태와 다음 행동을 CLI와 Active Context에서 빠르게 복원한다.`));
const approvalGoal =
  options["approval-goal"] ??
  (options["non-interactive"]
    ? `${projectName}의 PLN-00과 PLN-01을 닫아 첫 구현 lane을 연다.`
    : await prompt("Approval goal", `${projectName}의 PLN-00과 PLN-01을 닫아 첫 구현 lane을 연다.`));
const profiles =
  options.profiles ??
  (options["non-interactive"]
    ? "none"
    : await prompt(
        "Active profiles",
        "none",
        "Use comma-separated IDs like PRF-01,PRF-02 or type none."
      ));

try {
  const result = initializeProjectStarter({
    repoRoot: process.cwd(),
    projectName,
    projectSlug,
    userGoal,
    opsGoal,
    approvalGoal,
    activeProfiles: normalizeActiveProfiles(profiles),
    force: Boolean(options.force)
  });

  process.stdout.write(
    [
      "Standard harness starter initialized.",
      `- Project name: ${result.projectName}`,
      `- Project slug: ${result.projectSlug}`,
      `- Active profiles: ${result.activeProfiles.length ? result.activeProfiles.join(", ") : "none"}`,
      `- DB path: ${result.dbPath}`,
      `- Next action: ${result.nextAction}`
    ].join("\n") + "\n"
  );
  process.exit(0);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : "Unknown initialization error"}\n`);
  process.exit(1);
}

async function prompt(label, fallback, hint) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  try {
    const suffix = hint ? `\n${hint}\n` : " ";
    const answer = await rl.question(`${label} [${fallback}]${suffix}`);
    return answer.trim() || fallback;
  } finally {
    rl.close();
  }
}

function defaultProjectName(cwd) {
  return cwd.split(/[\\/]/).filter(Boolean).at(-1) ?? "new-project";
}

function enforceSupportedNodeRuntime() {
  const version = process.versions.node ?? "";
  const major = Number.parseInt(version.split(".")[0] ?? "", 10);

  if (Number.isInteger(major) && major >= MIN_NODE_MAJOR) {
    return;
  }

  process.stderr.write(
    `Node.js ${MIN_NODE_MAJOR} or newer is required before initializing the standard harness starter.\nDetected version: v${version || "unknown"}\n`
  );
  process.exit(1);
}

void KNOWN_PROFILES;
