import { DEFAULT_DB_PATH } from "./operating-state-store.js";
import {
  applyMigration,
  buildMigrationPreview,
  runCutoverPreflight,
  runValidator,
  writeCutoverReport
} from "./dev05-tooling.js";

const command = process.argv[2];
const repoRoot = process.env.REPO_ROOT ?? process.cwd();
const outputDir = process.env.PMW_OUTPUT_DIR ?? repoRoot;
const dbPath = process.env.PMW_DB_PATH ?? DEFAULT_DB_PATH;

const commands = {
  validate: () => runValidator({ repoRoot, outputDir, dbPath }),
  "migration-preview": () => buildMigrationPreview({ repoRoot, dbPath }),
  "migration-apply": () => applyMigration({ repoRoot, dbPath }),
  "cutover-preflight": () => runCutoverPreflight({ repoRoot, outputDir, dbPath }),
  "cutover-report": () => writeCutoverReport({ repoRoot, outputDir, dbPath })
};

if (!command || !commands[command]) {
  process.stderr.write("Usage: node src/state/dev05-cli.js <validate|migration-preview|migration-apply|cutover-preflight|cutover-report>\n");
  process.exit(1);
}

const result = commands[command]();
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
process.exit(result.ok === false || result.cutoverReady === false ? 1 : 0);
