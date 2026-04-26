import path from "node:path";

import { createOperatingStateStore, DEFAULT_DB_PATH } from "./operating-state-store.js";
import { writePmwProjectExport } from "./project-manifest.js";
import {
  applyMigration,
  buildMigrationPreview,
  buildHarnessStatus,
  explainCurrentBlockers,
  recommendNextAction,
  runDoctor,
  runCutoverPreflight,
  runValidator,
  writeCutoverReport,
  writeValidationReport
} from "./dev05-tooling.js";

const command = process.argv[2];
const repoRoot = process.env.REPO_ROOT ?? process.cwd();
const outputDir = process.env.PMW_OUTPUT_DIR ?? repoRoot;
const dbPath = process.env.PMW_DB_PATH ?? DEFAULT_DB_PATH;

const commands = {
  validate: () => runValidator({ repoRoot, outputDir, dbPath }),
  doctor: () => runDoctor({ repoRoot, outputDir, dbPath }),
  status: () => buildHarnessStatus({ repoRoot, outputDir, dbPath }),
  next: () => recommendNextAction({ repoRoot, outputDir, dbPath }),
  explain: () => explainCurrentBlockers({ repoRoot, outputDir, dbPath }),
  "validation-report": () => writeValidationReport({ repoRoot, outputDir, dbPath }),
  "pmw-export": () => writeProjectExport({ repoRoot, outputDir, dbPath }),
  "project-manifest": () => writeProjectExport({ repoRoot, outputDir, dbPath }),
  "migration-preview": () => buildMigrationPreview({ repoRoot, dbPath }),
  "migration-apply": () => applyMigration({ repoRoot, dbPath }),
  "cutover-preflight": () => runCutoverPreflight({ repoRoot, outputDir, dbPath }),
  "cutover-report": () => writeCutoverReport({ repoRoot, outputDir, dbPath })
};

if (!command || !commands[command]) {
  process.stderr.write(
    "Usage: node .harness/runtime/state/dev05-cli.js <validate|doctor|status|next|explain|validation-report|pmw-export|project-manifest|migration-preview|migration-apply|cutover-preflight|cutover-report>\n"
  );
  process.exit(1);
}

const result = commands[command]();
process.stdout.write(`${formatResult(result)}\n`);
process.exit(result.ok === false || result.cutoverReady === false ? 1 : 0);

function formatResult(result) {
  if (["doctor", "status", "next", "explain", "validation-report"].includes(result.command)) {
    return `${formatHumanSummary(result)}\n\n${JSON.stringify(result, null, 2)}`;
  }

  return JSON.stringify(result, null, 2);
}

function formatHumanSummary(result) {
  if (result.command === "doctor") {
    return [
      "Harness Doctor",
      `- Result: ${result.ok ? "pass" : "fail"}`,
      `- Summary: ${result.summary}`,
      `- Next action: ${result.nextAction}`
    ].join("\n");
  }

  if (result.command === "status") {
    return [
      "Harness Status",
      `- Stage: ${result.stage}`,
      `- Gate: ${result.gateState}`,
      `- Focus: ${result.focus}`,
      `- Open blockers: ${result.openBlockers}`,
      `- Open decisions: ${result.openDecisions}`,
      `- Validation: ${result.validation.ok ? "pass" : "fail"} (${result.validation.blockingFindingCount} blocker(s))`,
      `- Next action: ${result.nextAction}`
    ].join("\n");
  }

  if (result.command === "next") {
    return [
      "Harness Next",
      `- Validation: ${result.validation.ok ? "pass" : "fail"}`,
      `- Next action: ${result.nextAction}`
    ].join("\n");
  }

  if (result.command === "explain") {
    return [
      "Harness Explain",
      `- Result: ${result.ok ? "no blockers" : "blocked"}`,
      `- Summary: ${result.summary}`,
      `- Next action: ${result.nextAction}`
    ].join("\n");
  }

  return [
    "Harness Validation Report",
    `- Result: ${result.ok ? "pass" : "fail"}`,
    `- Markdown: ${result.markdownPath}`,
    `- JSON: ${result.jsonPath}`,
    `- Gate decision: ${result.report.gateDecision}`,
    `- Next action: ${result.report.nextAction}`
  ].join("\n");
}

function writeProjectExport({ repoRoot, outputDir, dbPath }) {
  const resolvedDbPath = path.isAbsolute(dbPath) ? dbPath : path.resolve(repoRoot, dbPath);
  const store = createOperatingStateStore({ dbPath: resolvedDbPath });
  try {
    return writePmwProjectExport({ store, repoRoot, outputDir });
  } finally {
    store.close();
  }
}
