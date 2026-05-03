import fs from "node:fs";
import path from "node:path";

import { resolveGeneratedDocReadPath } from "./harness-paths.js";
import { CURRENT_STATE_DOC, TASK_LIST_DOC, calculateChecksum } from "./generate-state-docs.js";
import { GATE_PROFILE_IDS, resolveGateProfile } from "./gate-profiles.js";
import {
  RELEASE_BASELINE,
  ROOT_RELEASE_BASELINE_MARKERS,
  isInstallableReleaseMaintainerRepo
} from "./release-baseline.js";
import {
  WORKFLOW_CONTRACT_SECTIONS,
  findMissingWorkflowContractSections
} from "./workflow-routing.js";

const REQUIRED_SECTIONS = {
  [CURRENT_STATE_DOC]: ["## Current Focus Summary", "## Decision Required Summary", "## Decision Required Detail"],
  [TASK_LIST_DOC]: ["## Blocked / At Risk Summary", "## Blocked / At Risk Detail"]
};

const PACKET_TEMPLATE_PATH = "reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md";
const SOURCE_WAVE_LEDGER_PATH = "reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md";
const ACTIVE_PROFILES_PATH = ".agents/artifacts/ACTIVE_PROFILES.md";
const TASK_LIST_PATH = ".agents/artifacts/TASK_LIST.md";
const REPOSITORY_LAYOUT_PATH = "reference/artifacts/REPOSITORY_LAYOUT_OWNERSHIP.md";
const GATE_PROFILE_CONTRACT_PATH = ".harness/runtime/state/gate-profiles.js";
const WORKFLOW_CONTRACT_PATHS = [
  ".agents/workflows/deploy.md",
  ".agents/workflows/design.md",
  ".agents/workflows/dev.md",
  ".agents/workflows/docu.md",
  ".agents/workflows/handoff.md",
  ".agents/workflows/pm.md",
  ".agents/workflows/plan.md",
  ".agents/workflows/review.md",
  ".agents/workflows/test.md"
];
const AGENT_BEHAVIOR_GUIDE_PATH = ".agents/rules/agent_behavior.md";
const AGENT_BEHAVIOR_SKILL_PATHS = [
  ".agents/skills/day_start/SKILL.md",
  ".agents/skills/day_wrap_up/SKILL.md"
];
const AGENT_BEHAVIOR_GUIDE_REQUIRED_MARKERS = [
  "# Agent Behavior Contract",
  "Think Before Coding",
  "Simplicity First",
  "Surgical Changes",
  "Goal-Driven Execution",
  "Project Design SSOT Precedence",
  "Developer implements",
  "Tester verifies",
  "Reviewer checks",
  "PMW read-only"
];
const WORKFLOW_BEHAVIOR_REQUIRED_MARKERS = [
  "## Behavior Contract",
  ".agents/rules/agent_behavior.md",
  "Think Before Coding",
  "Simplicity First",
  "Surgical Changes",
  "Goal-Driven Execution",
  "project design SSOT"
];
const SKILL_BEHAVIOR_REQUIRED_MARKERS = [
  "## Behavior Checks",
  ".agents/rules/agent_behavior.md",
  "Think Before Coding",
  "Simplicity First",
  "Surgical Changes",
  "Goal-Driven Execution",
  "project design SSOT"
];
const TASK_PACKET_DIRECTORY = "reference/packets";
const TASK_PACKET_ARTIFACT_CATEGORY = "task_packet";
const TASK_PACKET_DISCOVERY_EXCLUDED_FILES = new Set([
  path.basename(PACKET_TEMPLATE_PATH),
  "README.md"
]);
const TASK_PACKET_DISCOVERY_REQUIRED_MARKERS = [
  "## Quick Decision Header",
  "| Layer classification |",
  "| Domain foundation status |",
  "| Authoritative source intake status |",
  "- Required reading before code:"
];
const SOURCE_WAVE_LEDGER_REQUIRED_MARKERS = [
  "## Approval Rule",
  "## 4. Impacted Packet Set",
  "## 8. Packet Citation Rule",
  "| Packet path | Prior source snapshot | Required action | Rebaseline status | Notes |"
];
const STRUCTURED_TASK_TABLE_HEADERS = {
  "## Active Locks": ["Task ID", "Scope", "Owner", "Status", "Started At", "Notes"],
  "## Active Tasks": ["Task ID", "Title", "Scope", "Owner", "Status", "Priority", "Depends On", "Verification"],
  "## Blocked Tasks": ["Task ID", "Blocker", "Owner", "Status", "Unblock Condition", "Verification"],
  "## Completed Tasks": ["Task ID", "Title", "Completed At", "Verification", "Notes"]
};
const TASK_STATUSES_REQUIRING_LOCK = new Set([
  "in progress",
  "in execution",
  "executing",
  "review"
]);
const PACKET_TEMPLATE_REQUIRED_MARKERS = [
  "| Layer classification |",
  "| Active profile dependencies |",
  "| Profile evidence status |",
  "| Shared-source wave status |",
  "| Layer classification agreement |",
  "| Optional profile evidence approval |",
  "- Active profile references:",
  "- Profile composition rationale:",
  "- Active profile dependencies:",
  "- Profile-specific evidence status:",
  "- UX archetype reference:",
  "- Environment topology reference:",
  "- Domain foundation reference:",
  "- Authoritative source intake reference:",
  "- Impacted packet set scope:",
  "- Authoritative source wave ledger reference:",
  "- Source wave packet disposition:",
  "- Packet exit quality gate reference:",
  "- Improvement candidate reference:",
  "- Gate profile:",
  "- Verification manifest:",
  "- Primary admin entity / surface:",
  "- Grid interaction model:",
  "- Search / filter / sort / pagination behavior:",
  "- Row action / bulk action rule:",
  "- Edit / save / confirm / audit pattern:",
  "- Source spreadsheet artifact:",
  "- Workbook / sheet / tab / range trace:",
  "- Header / column mapping:",
  "- Row key / record identity rule:",
  "- Source snapshot / version:",
  "- Transformation / normalization assumptions:",
  "- Reconciliation / overwrite rule:",
  "- Transfer package / bundle artifact:",
  "- Transfer medium / handoff channel:",
  "- Checksum / integrity evidence:",
  "- Offline dependency bundle status:",
  "- Ingress verification / import step:",
  "- Rollback package / recovery bundle:",
  "- Manual custody / operator handoff:",
  "- Product source root:",
  "- Legacy system source inventory:",
  "- VBA module / macro / function inventory:",
  "- MariaDB schema snapshot:",
  "- Current import / export / report paths:",
  "- Source-of-truth ownership:",
  "- Migration / reconciliation plan:",
  "- Parallel-run / reconciliation evidence:",
  "- Python / Django version policy:",
  "- Supported-version / security-support rationale:",
  "- Dependency manager:",
  "- Django app / module boundary:",
  "- Settings / environment policy:",
  "- Migration policy:",
  "- DB compatibility policy:",
  "- Transaction / service boundary:",
  "- Auth / permission / admin boundary:",
  "- Background job boundary:",
  "- Test convention:",
  "- Static / media / admin customization boundary:",
  "- State machine artifact:",
  "- Approval rule matrix:",
  "- Role / permission matrix:",
  "- Audit event spec:",
  "- Exception / rollback / reopen rule:",
  "- Runtime / framework:",
  "- Rendering / app mode:",
  "- Data persistence boundary:",
  "- Auth / user identity requirement:",
  "- Deployment target:",
  "- External API / integration boundary:",
  "- Lightweight acceptance:",
  "- Android package namespace:",
  "- Kotlin / Java policy:",
  "- Gradle / AGP version:",
  "- minSdk / targetSdk:",
  "- Signing policy:",
  "- Build variants / flavors:",
  "- Permissions policy:",
  "- Local storage policy:",
  "- Network security / API boundary:",
  "- Navigation structure:",
  "- Offline / sync policy:",
  "- Notification policy:",
  "- Privacy / data policy:",
  "- Device / emulator test plan:",
  "- Release channel:"
];

const OPTIONAL_PROFILE_REQUIREMENTS = [
  {
    profileId: "PRF-01",
    relativePath: "reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md",
    requiredMarkers: [
      "## Approval Rule",
      "## 8. Required Packet Evidence",
      "## 10. Packet Citation Rule",
      "- Active profile references:",
      "- Primary admin entity / surface:",
      "- Grid interaction model:",
      "- Search / filter / sort / pagination behavior:",
      "- Row action / bulk action rule:",
      "- Edit / save pattern:",
      "- Profile deviation / exception:"
    ]
  },
  {
    profileId: "PRF-02",
    relativePath: "reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md",
    requiredMarkers: [
      "## Approval Rule",
      "## 8. Required Packet Evidence",
      "## 10. Packet Citation Rule",
      "- Active profile references:",
      "- Source spreadsheet artifact:",
      "- Workbook / sheet / tab / range trace:",
      "- Header / column mapping:",
      "- Row key / record identity rule:",
      "- Source snapshot / version:",
      "- Transformation / normalization assumptions:",
      "- Reconciliation / overwrite rule:",
      "- Profile deviation / exception:"
    ]
  },
  {
    profileId: "PRF-03",
    relativePath: "reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md",
    requiredMarkers: [
      "## Approval Rule",
      "## 8. Required Packet Evidence",
      "## 10. Packet Citation Rule",
      "- Active profile references:",
      "- Transfer package / bundle artifact:",
      "- Transfer medium / handoff channel:",
      "- Checksum / integrity evidence:",
      "- Offline dependency bundle status:",
      "- Ingress verification / import step:",
      "- Rollback package / recovery bundle:",
      "- Manual custody / operator handoff:",
      "- Profile deviation / exception:"
    ]
  },
  {
    profileId: "PRF-04",
    relativePath: "reference/profiles/PRF-04_LEGACY_EXCEL_VBA_MARIADB_REPLACEMENT_PROFILE.md",
    requiredMarkers: [
      "## Approval Rule",
      "## 8. Required Packet Evidence",
      "## 10. Packet Citation Rule",
      "- Active profile references:",
      "- Product source root:",
      "- Legacy system source inventory:",
      "- Workbook / sheet / tab / range trace:",
      "- Header / column mapping:",
      "- VBA module / macro / function inventory:",
      "- MariaDB schema snapshot:",
      "- Current import / export / report paths:",
      "- Source-of-truth ownership:",
      "- Migration / reconciliation plan:",
      "- Parallel-run / reconciliation evidence:",
      "- Profile deviation / exception:"
    ]
  },
  {
    profileId: "PRF-05",
    relativePath: "reference/profiles/PRF-05_PYTHON_DJANGO_BACKOFFICE_PROFILE.md",
    requiredMarkers: [
      "## Approval Rule",
      "## 8. Required Packet Evidence",
      "## 10. Packet Citation Rule",
      "- Active profile references:",
      "- Product source root:",
      "- Python / Django version policy:",
      "- Supported-version / security-support rationale:",
      "- Dependency manager:",
      "- Django app / module boundary:",
      "- Settings / environment policy:",
      "- Migration policy:",
      "- DB compatibility policy:",
      "- Transaction / service boundary:",
      "- Auth / permission / admin boundary:",
      "- Background job boundary:",
      "- Test convention:",
      "- Static / media / admin customization boundary:",
      "- Profile deviation / exception:"
    ]
  },
  {
    profileId: "PRF-06",
    relativePath: "reference/profiles/PRF-06_WORKFLOW_APPROVAL_APPLICATION_PROFILE.md",
    requiredMarkers: [
      "## Approval Rule",
      "## 8. Required Packet Evidence",
      "## 10. Packet Citation Rule",
      "- Active profile references:",
      "- Product source root:",
      "- State machine artifact:",
      "- Approval rule matrix:",
      "- Role / permission matrix:",
      "- Audit event spec:",
      "- Exception / rollback / reopen rule:",
      "- Profile deviation / exception:"
    ]
  },
  {
    profileId: "PRF-07",
    relativePath: "reference/profiles/PRF-07_LIGHTWEIGHT_WEB_APP_PROFILE.md",
    requiredMarkers: [
      "## Approval Rule",
      "## 8. Required Packet Evidence",
      "## 10. Packet Citation Rule",
      "- Active profile references:",
      "- Product source root:",
      "- Runtime / framework:",
      "- Rendering / app mode:",
      "- Data persistence boundary:",
      "- Auth / user identity requirement:",
      "- Deployment target:",
      "- External API / integration boundary:",
      "- Lightweight acceptance:",
      "- Profile deviation / exception:"
    ]
  },
  {
    profileId: "PRF-08",
    relativePath: "reference/profiles/PRF-08_ANDROID_NATIVE_APP_PROFILE.md",
    requiredMarkers: [
      "## Approval Rule",
      "## 8. Required Packet Evidence",
      "## 10. Packet Citation Rule",
      "- Active profile references:",
      "- Product source root:",
      "- Android package namespace:",
      "- Kotlin / Java policy:",
      "- Gradle / AGP version:",
      "- minSdk / targetSdk:",
      "- Signing policy:",
      "- Build variants / flavors:",
      "- Permissions policy:",
      "- Local storage policy:",
      "- Network security / API boundary:",
      "- Navigation structure:",
      "- Offline / sync policy:",
      "- Notification policy:",
      "- Privacy / data policy:",
      "- Device / emulator test plan:",
      "- Release channel:",
      "- Profile deviation / exception:"
    ]
  },
  {
    profileId: "PRF-09",
    relativePath: "reference/profiles/PRF-09_NODE_FRONTEND_WEB_APP_PROFILE.md",
    requiredMarkers: [
      "## Approval Rule",
      "## 8. Required Packet Evidence",
      "## 10. Packet Citation Rule",
      "- Active profile references:",
      "- Product source root:",
      "- Package ownership policy:",
      "- Node.js product runtime policy:",
      "- Package manager:",
      "- Framework / bundler:",
      "- Build command:",
      "- Test command:",
      "- Environment variable policy:",
      "- API / backend boundary:",
      "- Static asset / routing policy:",
      "- Deployment target:",
      "- Profile deviation / exception:"
    ]
  }
];

const TASK_PACKET_REQUIRED_HEADER_ITEMS = [
  { label: "Ready For Code" },
  { label: "User-facing impact" },
  { label: "Layer classification" },
  { label: "Active profile dependencies", aliases: ["Active profile dependency"] },
  { label: "Profile evidence status" },
  { label: "UX archetype status" },
  { label: "Environment topology status" },
  { label: "Domain foundation status" },
  { label: "Authoritative source intake status" },
  { label: "Shared-source wave status" },
  { label: "Packet exit gate status" },
  { label: "Existing system dependency" },
  { label: "New authoritative source impact" }
];

const TASK_PACKET_PROFILE_FIELD_REQUIREMENTS = {
  "PRF-01": [
    "Primary admin entity / surface",
    "Grid interaction model",
    "Search / filter / sort / pagination behavior",
    "Row action / bulk action rule",
    "Edit / save / confirm / audit pattern"
  ],
  "PRF-02": [
    "Source spreadsheet artifact",
    "Workbook / sheet / tab / range trace",
    "Header / column mapping",
    "Row key / record identity rule",
    "Source snapshot / version",
    "Transformation / normalization assumptions",
    "Reconciliation / overwrite rule"
  ],
  "PRF-03": [
    "Transfer package / bundle artifact",
    "Transfer medium / handoff channel",
    "Checksum / integrity evidence",
    "Offline dependency bundle status",
    "Ingress verification / import step",
    "Rollback package / recovery bundle",
    "Manual custody / operator handoff"
  ],
  "PRF-04": [
    "Product source root",
    "Legacy system source inventory",
    "Workbook / sheet / tab / range trace",
    "Header / column mapping",
    "VBA module / macro / function inventory",
    "MariaDB schema snapshot",
    "Current import / export / report paths",
    "Source-of-truth ownership",
    "Migration / reconciliation plan",
    "Parallel-run / reconciliation evidence"
  ],
  "PRF-05": [
    "Product source root",
    "Python / Django version policy",
    "Supported-version / security-support rationale",
    "Dependency manager",
    "Django app / module boundary",
    "Settings / environment policy",
    "Migration policy",
    "DB compatibility policy",
    "Transaction / service boundary",
    "Auth / permission / admin boundary",
    "Background job boundary",
    "Test convention",
    "Static / media / admin customization boundary"
  ],
  "PRF-06": [
    "Product source root",
    "State machine artifact",
    "Approval rule matrix",
    "Role / permission matrix",
    "Audit event spec",
    "Exception / rollback / reopen rule"
  ],
  "PRF-07": [
    "Product source root",
    "Runtime / framework",
    "Rendering / app mode",
    "Data persistence boundary",
    "Auth / user identity requirement",
    "Deployment target",
    "External API / integration boundary",
    "Lightweight acceptance"
  ],
  "PRF-08": [
    "Product source root",
    "Android package namespace",
    "Kotlin / Java policy",
    "Gradle / AGP version",
    "minSdk / targetSdk",
    "Signing policy",
    "Build variants / flavors",
    "Permissions policy",
    "Local storage policy",
    "Network security / API boundary",
    "Navigation structure",
    "Offline / sync policy",
    "Notification policy",
    "Privacy / data policy",
    "Device / emulator test plan",
    "Release channel"
  ],
  "PRF-09": [
    "Product source root",
    "Package ownership policy",
    "Node.js product runtime policy",
    "Package manager",
    "Framework / bundler",
    "Build command",
    "Test command",
    "Environment variable policy",
    "API / backend boundary",
    "Static asset / routing policy",
    "Deployment target"
  ]
};

export function validateGeneratedStateDocs({
  store,
  outputDir = process.cwd(),
  repoRoot = outputDir
}) {
  const findings = [];
  const currentStatePath = resolveGeneratedDocReadPath({ outputDir, docName: CURRENT_STATE_DOC });
  const taskListPath = resolveGeneratedDocReadPath({ outputDir, docName: TASK_LIST_DOC });

  const currentStateContent = readUtf8File(currentStatePath, findings);
  const taskListContent = readUtf8File(taskListPath, findings);

  if (currentStateContent != null) {
    validateRequiredSections(CURRENT_STATE_DOC, currentStateContent, findings);
    validateProjectionState(store, CURRENT_STATE_DOC, currentStateContent, findings);
    validateDecisionParity(store, currentStateContent, findings);
  }

  if (taskListContent != null) {
    validateRequiredSections(TASK_LIST_DOC, taskListContent, findings);
    validateProjectionState(store, TASK_LIST_DOC, taskListContent, findings);
    validateRiskParity(store, taskListContent, findings);
  }

  validateSourceRefs(store, repoRoot, findings);
  validateFreshness(store, findings);
  validateHarnessOwnedPaths(repoRoot, findings);
  validateStructuredTaskTruth(repoRoot, findings);
  validateActiveProfiles(repoRoot, findings);
  validateProfileAwareContracts(repoRoot, findings);
  validateRegisteredTaskPackets(store, repoRoot, findings);
  validateGateProfileContracts(store, repoRoot, findings);
  validateWorkflowContracts(repoRoot, findings);
  validateStarterSync(repoRoot, findings);
  validateReleaseBaselineConsistency(store, repoRoot, findings);

  const blockingFindings = findings.filter((finding) => finding.severity === "error");
  const cutoverReady = blockingFindings.length === 0;

  if (!cutoverReady) {
    findings.push({
      code: "cutover_preflight_failed",
      severity: "error",
      message: "Cutover preflight failed because unresolved generated-doc findings remain."
    });
  }

  return {
    ok: blockingFindings.length === 0,
    cutoverReady,
    findings
  };
}

function validateHarnessOwnedPaths(repoRoot, findings) {
  const packageJsonPath = path.resolve(repoRoot, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return;
  }

  const requiredPaths = [
    ".harness/runtime/state/dev05-cli.js",
    ".harness/runtime/state/drift-validator.js",
    GATE_PROFILE_CONTRACT_PATH,
    ".harness/runtime/state/project-manifest.js",
    ".harness/test",
    REPOSITORY_LAYOUT_PATH
  ];

  for (const relativePath of requiredPaths) {
    if (fs.existsSync(path.resolve(repoRoot, relativePath))) {
      continue;
    }

    findings.push({
      code: "harness_owned_path_missing",
      severity: "error",
      path: relativePath,
      message: `Missing required harness-owned path ${relativePath}.`
    });
  }

  validatePackageCommandSurface(repoRoot, findings);
}

function validatePackageCommandSurface(repoRoot, findings) {
  const packageJsonPath = path.resolve(repoRoot, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const requiredScripts = [
    "test",
    "harness:init",
    "harness:validate",
    "harness:doctor",
    "harness:status",
    "harness:next",
    "harness:explain",
    "harness:validation-report",
    "harness:pmw-export",
    "harness:project-manifest",
    "harness:transition",
    "harness:migration-preview",
    "harness:migration-apply",
    "harness:cutover-preflight",
    "harness:cutover-report"
  ];

  for (const script of requiredScripts) {
    if (packageJson.scripts?.[script]) {
      continue;
    }
    findings.push({
      code: "harness_command_missing",
      severity: "error",
      path: "package.json",
      script,
      message: `package.json is missing required harness command ${script}.`
    });
  }
}

function validateStructuredTaskTruth(repoRoot, findings) {
  const taskListPath = path.resolve(repoRoot, TASK_LIST_PATH);
  if (!fs.existsSync(taskListPath)) {
    findings.push({
      code: "structured_task_truth_missing",
      severity: "error",
      path: TASK_LIST_PATH,
      message: `${TASK_LIST_PATH} is required as the structured task truth artifact.`
    });
    return;
  }

  const content = fs.readFileSync(taskListPath, "utf8");
  const requiredSections = [
    "## Active Locks",
    "## Active Tasks",
    "## Blocked Tasks",
    "## Completed Tasks",
    "## Handoff Log"
  ];
  const parsedTables = {};

  for (const section of requiredSections) {
    if (!content.includes(section)) {
      findings.push({
        code: "structured_task_table_missing",
        severity: "error",
        path: TASK_LIST_PATH,
        section,
        message: `${TASK_LIST_PATH} is missing required section ${section}.`
      });
      continue;
    }

    if (section === "## Handoff Log") {
      continue;
    }

    const sectionContent = sliceSection(content, section);
    const table = parseMarkdownTable(sectionContent);
    if (!table) {
      findings.push({
        code: "structured_task_table_malformed",
        severity: "error",
        path: TASK_LIST_PATH,
        section,
        message: `${TASK_LIST_PATH} section ${section} must expose a Markdown table.`
      });
      continue;
    }

    parsedTables[section] = table;
    for (const header of STRUCTURED_TASK_TABLE_HEADERS[section] ?? []) {
      if (table.headers.includes(header)) {
        continue;
      }
      findings.push({
        code: "structured_task_table_header_missing",
        severity: "error",
        path: TASK_LIST_PATH,
        section,
        header,
        message: `${TASK_LIST_PATH} section ${section} is missing required table header ${header}.`
      });
    }
  }

  validateStructuredTaskConsistency(parsedTables, findings);
}

function validateStructuredTaskConsistency(parsedTables, findings) {
  const activeLockRows = taskRows(parsedTables["## Active Locks"]?.rows ?? []);
  const activeTaskRows = taskRows(parsedTables["## Active Tasks"]?.rows ?? []);
  const completedTaskRows = taskRows(parsedTables["## Completed Tasks"]?.rows ?? []);
  const lockedTaskIds = new Set();
  const lockedScopes = new Map();

  for (const row of activeLockRows) {
    const taskId = row["Task ID"];
    const scope = row.Scope;
    if (lockedTaskIds.has(taskId)) {
      findings.push({
        code: "structured_task_duplicate_lock",
        severity: "error",
        path: TASK_LIST_PATH,
        taskId,
        message: `${TASK_LIST_PATH} declares duplicate active lock for task ${taskId}.`
      });
    }
    lockedTaskIds.add(taskId);

    if (hasConcreteValue(scope, { allowUnknown: false })) {
      const normalizedScope = normalizeValue(scope);
      if (lockedScopes.has(normalizedScope)) {
        findings.push({
          code: "structured_task_duplicate_lock",
          severity: "error",
          path: TASK_LIST_PATH,
          taskId,
          scope,
          message: `${TASK_LIST_PATH} declares duplicate active lock scope ${scope}.`
        });
      }
      lockedScopes.set(normalizedScope, taskId);
    }
  }

  for (const row of activeTaskRows) {
    const taskId = row["Task ID"];
    const status = normalizeTaskStatus(row.Status);
    if (TASK_STATUSES_REQUIRING_LOCK.has(status) && !lockedTaskIds.has(taskId)) {
      findings.push({
        code: "structured_task_lock_missing",
        severity: "error",
        path: TASK_LIST_PATH,
        taskId,
        status: row.Status,
        message: `${TASK_LIST_PATH} marks task ${taskId} as ${row.Status} without a matching active lock.`
      });
    }
  }

  for (const row of completedTaskRows) {
    if (!hasConcreteValue(row.Verification, { allowUnknown: false })) {
      findings.push({
        code: "structured_task_completed_verification_missing",
        severity: "error",
        path: TASK_LIST_PATH,
        taskId: row["Task ID"],
        message: `${TASK_LIST_PATH} completed task ${row["Task ID"]} is missing verification evidence.`
      });
    }
  }
}

function taskRows(rows) {
  return rows.filter((row) => hasConcreteValue(row["Task ID"], { allowUnknown: false }));
}

function parseMarkdownTable(sectionContent) {
  if (!sectionContent) {
    return null;
  }

  const tableLines = sectionContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|"));
  if (tableLines.length < 2) {
    return null;
  }

  const headers = parseMarkdownTableRow(tableLines[0]);
  const separator = parseMarkdownTableRow(tableLines[1]);
  if (headers.length === 0 || !isMarkdownTableSeparator(separator)) {
    return null;
  }

  const rows = tableLines.slice(2).map((line) => {
    const cells = parseMarkdownTableRow(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  });

  return { headers, rows };
}

function parseMarkdownTableRow(line) {
  return line.split("|").slice(1, -1).map((cell) => cell.trim());
}

function isMarkdownTableSeparator(cells) {
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function normalizeTaskStatus(value) {
  return normalizeValue(value ?? "").replace(/[_-]/g, " ");
}

function isClosedWorkItemStatus(status) {
  return ["closed", "done", "complete", "completed"].includes(normalizeTaskStatus(status));
}

function validateActiveProfiles(repoRoot, findings) {
  const activeProfilesPath = path.resolve(repoRoot, ACTIVE_PROFILES_PATH);
  if (!fs.existsSync(activeProfilesPath)) {
    findings.push({
      code: "active_profile_artifact_missing",
      severity: "error",
      path: ACTIVE_PROFILES_PATH,
      message: `${ACTIVE_PROFILES_PATH} is required even when no optional profiles are active.`
    });
    return;
  }

  const content = fs.readFileSync(activeProfilesPath, "utf8");
  const requiredColumns = [
    "Profile ID",
    "Activation reason",
    "Required evidence artifacts",
    "Evidence status",
    "Activated by",
    "Activated at",
    "Applies to packets"
  ];

  for (const column of requiredColumns) {
    if (content.includes(column)) {
      continue;
    }
    findings.push({
      code: "active_profile_table_malformed",
      severity: "error",
      path: ACTIVE_PROFILES_PATH,
      column,
      message: `${ACTIVE_PROFILES_PATH} is missing required column ${column}.`
    });
  }

  for (const line of content.split("\n").map((item) => item.trim()).filter((item) => item.startsWith("| PRF-"))) {
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    const [profileId, , evidenceArtifacts, evidenceStatus] = cells;
    const profile = OPTIONAL_PROFILE_REQUIREMENTS.find((item) => item.profileId === profileId);
    if (!profile) {
      findings.push({
        code: "active_profile_unknown",
        severity: "error",
        path: ACTIVE_PROFILES_PATH,
        profileId,
        message: `${ACTIVE_PROFILES_PATH} declares unknown profile ${profileId}.`
      });
      continue;
    }

    if (!fs.existsSync(path.resolve(repoRoot, profile.relativePath))) {
      findings.push({
        code: "active_profile_reference_missing",
        severity: "error",
        path: ACTIVE_PROFILES_PATH,
        profileId,
        message: `${ACTIVE_PROFILES_PATH} declares ${profileId}, but ${profile.relativePath} is missing.`
      });
    }

    if (normalizeValue(evidenceStatus) === "approved" && !hasConcreteValue(evidenceArtifacts)) {
      findings.push({
        code: "active_profile_required_evidence_missing",
        severity: "error",
        path: ACTIVE_PROFILES_PATH,
        profileId,
        message: `${ACTIVE_PROFILES_PATH} marks ${profileId} approved without required evidence artifacts.`
      });
    }
  }
}

function validateWorkflowContracts(repoRoot, findings) {
  const roots = [
    {
      label: "root",
      rootPath: repoRoot,
      displayPrefix: ""
    }
  ];
  const starterRoot = path.resolve(repoRoot, "standard-template");

  if (fs.existsSync(path.resolve(starterRoot, ".agents", "workflows"))) {
    roots.push({
      label: "standard-template",
      rootPath: starterRoot,
      displayPrefix: "standard-template"
    });
  }

  for (const root of roots) {
    validateWorkflowContractRoot(root, findings);
  }
}

function validateWorkflowContractRoot({ label, rootPath, displayPrefix }, findings) {
  const workflowDir = path.resolve(rootPath, ".agents", "workflows");
  if (!fs.existsSync(workflowDir)) {
    return;
  }

  for (const relativePath of WORKFLOW_CONTRACT_PATHS) {
    const absolutePath = path.resolve(rootPath, relativePath);
    const displayPath = displayPrefix
      ? path.posix.join(displayPrefix, relativePath)
      : relativePath;

    if (!fs.existsSync(absolutePath)) {
      findings.push({
        code: "workflow_contract_file_missing",
        severity: "error",
        path: displayPath,
        root: label,
        message: `${displayPath} is required for supported handoff routing.`
      });
      continue;
    }

    const content = fs.readFileSync(absolutePath, "utf8");
    const missingSections = findMissingWorkflowContractSections(content);
    for (const section of missingSections) {
      findings.push({
        code: "workflow_contract_section_missing",
        severity: "error",
        path: displayPath,
        root: label,
        section,
        expectedSections: WORKFLOW_CONTRACT_SECTIONS,
        message: `${displayPath} is missing required workflow contract section ${section}.`
      });
    }
    validateRequiredContentMarkers({
      content,
      markers: WORKFLOW_BEHAVIOR_REQUIRED_MARKERS,
      code: "workflow_behavior_guidance_missing",
      severity: "error",
      path: displayPath,
      root: label,
      findings
    });
  }

  validateAgentBehaviorGuidanceRoot({ label, rootPath, displayPrefix }, findings);
}

function validateAgentBehaviorGuidanceRoot({ label, rootPath, displayPrefix }, findings) {
  const guidePath = path.resolve(rootPath, AGENT_BEHAVIOR_GUIDE_PATH);
  const guideDisplayPath = displayPrefix
    ? path.posix.join(displayPrefix, AGENT_BEHAVIOR_GUIDE_PATH)
    : AGENT_BEHAVIOR_GUIDE_PATH;

  if (!fs.existsSync(guidePath)) {
    findings.push({
      code: "agent_behavior_guidance_missing",
      severity: "error",
      path: guideDisplayPath,
      root: label,
      message: `${guideDisplayPath} is required so reusable agent behavior guidance cannot silently regress.`
    });
  } else {
    validateRequiredContentMarkers({
      content: fs.readFileSync(guidePath, "utf8"),
      markers: AGENT_BEHAVIOR_GUIDE_REQUIRED_MARKERS,
      code: "agent_behavior_guidance_incomplete",
      severity: "error",
      path: guideDisplayPath,
      root: label,
      findings
    });
  }

  for (const relativePath of AGENT_BEHAVIOR_SKILL_PATHS) {
    const skillPath = path.resolve(rootPath, relativePath);
    const displayPath = displayPrefix
      ? path.posix.join(displayPrefix, relativePath)
      : relativePath;

    if (!fs.existsSync(skillPath)) {
      findings.push({
        code: "skill_behavior_guidance_missing",
        severity: "error",
        path: displayPath,
        root: label,
        message: `${displayPath} must include reusable day-start/day-wrap-up behavior guidance.`
      });
      continue;
    }

    validateRequiredContentMarkers({
      content: fs.readFileSync(skillPath, "utf8"),
      markers: SKILL_BEHAVIOR_REQUIRED_MARKERS,
      code: "skill_behavior_guidance_incomplete",
      severity: "error",
      path: displayPath,
      root: label,
      findings
    });
  }
}

function validateRequiredContentMarkers({ content, markers, code, severity, path: artifactPath, root, findings }) {
  for (const marker of markers) {
    if (content.includes(marker)) {
      continue;
    }
    findings.push({
      code,
      severity,
      path: artifactPath,
      root,
      marker,
      message: `${artifactPath} is missing required reusable behavior guidance marker: ${marker}.`
    });
  }
}

function validateStarterSync(repoRoot, findings) {
  const starterRoot = path.resolve(repoRoot, "standard-template");
  if (!fs.existsSync(starterRoot)) {
    return;
  }

  const syncPaths = [
    "AGENTS.md",
    ".agents/rules/workspace.md",
    AGENT_BEHAVIOR_GUIDE_PATH,
    ...AGENT_BEHAVIOR_SKILL_PATHS,
    ".agents/scripts/init-project.js",
    ".harness/runtime/state/context-restoration-read-model.js",
    ".harness/runtime/state/dev05-cli.js",
    ".harness/runtime/state/dev05-tooling.js",
    ".harness/runtime/state/drift-validator.js",
    GATE_PROFILE_CONTRACT_PATH,
    ".harness/runtime/state/generate-state-docs.js",
    ".harness/runtime/state/harness-paths.js",
    ".harness/runtime/state/init-project.js",
    ".harness/runtime/state/operating_state.schema.json",
    ".harness/runtime/state/operating-state-store.js",
    ".harness/runtime/state/project-manifest.js",
    ".harness/runtime/state/release-baseline.js",
    ".harness/runtime/state/workflow-routing.js",
    ".harness/test/context-restoration-read-model.test.js",
    ".harness/test/dev05-tooling.test.js",
    ".harness/test/generated-state-docs.test.js",
    ".harness/test/init-project.test.js",
    ".harness/test/operating-state-store.test.js",
    ".harness/test/pmw-read-surface.test.js",
    ".harness/test/profile-aware-validator-fixtures.js",
    "reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md",
    "reference/profiles/README.md",
    "reference/artifacts/LEGACY_SYSTEM_INTAKE.md",
    "reference/artifacts/MIGRATION_RECONCILIATION_PLAN.md",
    "reference/artifacts/DJANGO_BACKOFFICE_CONVENTIONS.md",
    "reference/artifacts/WORKFLOW_STATE_MACHINE.md",
    "reference/artifacts/APPROVAL_RULE_MATRIX.md",
    "reference/artifacts/ROLE_PERMISSION_MATRIX.md",
    "reference/artifacts/AUDIT_EVENT_SPEC.md",
    "reference/artifacts/EXCEPTION_REOPEN_ROLLBACK_RULES.md",
    "reference/artifacts/LIGHTWEIGHT_APP_BASELINE.md",
    "reference/artifacts/ANDROID_APP_BASELINE.md",
    "reference/artifacts/NODE_FRONTEND_APP_BASELINE.md",
    "reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md",
    "reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md",
    "reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md",
    "reference/profiles/PRF-04_LEGACY_EXCEL_VBA_MARIADB_REPLACEMENT_PROFILE.md",
    "reference/profiles/PRF-05_PYTHON_DJANGO_BACKOFFICE_PROFILE.md",
    "reference/profiles/PRF-06_WORKFLOW_APPROVAL_APPLICATION_PROFILE.md",
    "reference/profiles/PRF-07_LIGHTWEIGHT_WEB_APP_PROFILE.md",
    "reference/profiles/PRF-08_ANDROID_NATIVE_APP_PROFILE.md",
    "reference/profiles/PRF-09_NODE_FRONTEND_WEB_APP_PROFILE.md",
    ...WORKFLOW_CONTRACT_PATHS,
    REPOSITORY_LAYOUT_PATH
  ];

  for (const relativePath of syncPaths) {
    const rootPath = path.resolve(repoRoot, relativePath);
    const starterPath = path.resolve(starterRoot, relativePath);
    if (!fs.existsSync(rootPath) || !fs.existsSync(starterPath)) {
      findings.push({
        code: "starter_sync_drift",
        severity: "error",
        path: relativePath,
        message: `Root/starter sync path ${relativePath} is missing on one side.`
      });
      continue;
    }

    if (fs.readFileSync(rootPath, "utf8") !== fs.readFileSync(starterPath, "utf8")) {
      findings.push({
        code: "starter_sync_drift",
        severity: "error",
        path: relativePath,
        message: `Root and standard-template differ for reusable sync path ${relativePath}.`
      });
    }
  }
}

function validateReleaseBaselineConsistency(store, repoRoot, findings) {
  if (!isInstallableReleaseMaintainerRepo(repoRoot)) {
    return;
  }

  const releaseState = store.getReleaseState("current");
  if (!releaseState) {
    findings.push({
      code: "release_baseline_state_missing",
      severity: "error",
      message: "Maintainer release repo is missing the current release_state row."
    });
    return;
  }

  const releaseBaseline = releaseState.metadata?.releaseBaseline;
  if (
    releaseBaseline !== RELEASE_BASELINE.label ||
    !String(releaseState.currentFocus ?? "").includes(RELEASE_BASELINE.label) ||
    !String(releaseState.releaseGoal ?? "").includes(RELEASE_BASELINE.label)
  ) {
    findings.push({
      code: "release_baseline_state_drift",
      severity: "error",
      path: ".harness/operating_state.sqlite",
      expectedReleaseBaseline: RELEASE_BASELINE.label,
      actualReleaseBaseline: releaseBaseline ?? "missing",
      message:
        "Maintainer release baseline is implemented, but release_state still points at a different or missing baseline label."
    });
  }

  for (const requirement of ROOT_RELEASE_BASELINE_MARKERS) {
    const absolutePath = path.resolve(repoRoot, requirement.relativePath);
    const content = readRequiredUtf8File({
      filePath: absolutePath,
      findings,
      missingCode: "release_baseline_artifact_missing",
      missingMessage: `Missing required release-baseline artifact ${requirement.relativePath}.`
    });
    if (content == null || content.includes(requirement.marker)) {
      continue;
    }

    findings.push({
      code: "release_baseline_marker_missing",
      severity: "error",
      path: requirement.relativePath,
      expectedMarker: requirement.marker,
      message: `${requirement.relativePath} does not declare the current ${RELEASE_BASELINE.label} release baseline marker.`
    });
  }
}

function readUtf8File(filePath, findings) {
  return readRequiredUtf8File({
    filePath,
    findings,
    missingCode: "generated_doc_missing",
    missingMessage: `Missing generated doc: ${path.basename(filePath)}`,
    pathKey: "path"
  });
}

function readRequiredUtf8File({
  filePath,
  findings,
  missingCode,
  missingMessage,
  pathKey = "path"
}) {
  if (!fs.existsSync(filePath)) {
    findings.push({
      code: missingCode,
      severity: "error",
      [pathKey]: filePath,
      message: missingMessage
    });
    return null;
  }

  const buffer = fs.readFileSync(filePath);
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    findings.push({
      code: "utf8_bom_detected",
      severity: "error",
      path: filePath,
      message: `${path.basename(filePath)} must be UTF-8 without BOM.`
    });
  }

  const content = buffer.toString("utf8");
  if (content.includes("\uFFFD")) {
    findings.push({
      code: "mojibake_detected",
      severity: "error",
      path: filePath,
      message: `${path.basename(filePath)} contains replacement characters that indicate mojibake.`
    });
  }

  return content;
}

function validateProfileAwareContracts(repoRoot, findings) {
  validateContractMarkers({
    repoRoot,
    relativePath: PACKET_TEMPLATE_PATH,
    requiredMarkers: PACKET_TEMPLATE_REQUIRED_MARKERS,
    missingFileCode: "packet_template_missing",
    missingMarkerCode: "packet_template_field_missing",
    findings
  });

  validateContractMarkers({
    repoRoot,
    relativePath: SOURCE_WAVE_LEDGER_PATH,
    requiredMarkers: SOURCE_WAVE_LEDGER_REQUIRED_MARKERS,
    missingFileCode: "source_wave_ledger_missing",
    missingMarkerCode: "source_wave_ledger_field_missing",
    findings
  });

  for (const profile of OPTIONAL_PROFILE_REQUIREMENTS) {
    validateContractMarkers({
      repoRoot,
      relativePath: profile.relativePath,
      requiredMarkers: profile.requiredMarkers,
      missingFileCode: "optional_profile_artifact_missing",
      missingMarkerCode: "optional_profile_evidence_missing",
      findings,
      profileId: profile.profileId
    });
  }
}

function validateRegisteredTaskPackets(store, repoRoot, findings) {
  const registeredArtifacts = store.listArtifacts({ category: TASK_PACKET_ARTIFACT_CATEGORY });

  for (const artifact of registeredArtifacts) {
    validateRegisteredTaskPacket({ artifact, repoRoot, findings });
  }

  for (const packetPath of discoverConcreteTaskPacketCandidates(repoRoot)) {
    const existingArtifact = store.getArtifactByPath(packetPath);
    if (existingArtifact?.category === TASK_PACKET_ARTIFACT_CATEGORY) {
      continue;
    }

    if (!existingArtifact) {
      findings.push({
        code: "task_packet_registration_missing",
        severity: "error",
        packetPath,
        message:
          `${packetPath} matches the current concrete task-packet contract under ${TASK_PACKET_DIRECTORY} ` +
          `but is not registered in artifact_index as category ${TASK_PACKET_ARTIFACT_CATEGORY}.`
      });
      validateRegisteredTaskPacket({
        artifact: createDiscoveredTaskPacketArtifact(packetPath),
        repoRoot,
        findings
      });
      continue;
    }

    findings.push({
      code: "task_packet_registration_category_mismatch",
      severity: "error",
      artifactId: existingArtifact.artifactId,
      packetPath,
      category: existingArtifact.category,
      message:
        `${packetPath} matches the current concrete task-packet contract under ${TASK_PACKET_DIRECTORY} ` +
        `but artifact_index registers it as category ${existingArtifact.category} instead of ${TASK_PACKET_ARTIFACT_CATEGORY}.`
    });
    validateRegisteredTaskPacket({ artifact: existingArtifact, repoRoot, findings });
  }
}

function validateGateProfileContracts(store, repoRoot, findings) {
  const activePacketWorkItems = store
    .listWorkItems()
    .filter((item) => !isClosedWorkItemStatus(item.status))
    .filter((item) => item.sourceRef?.startsWith(`${TASK_PACKET_DIRECTORY}/`) && item.sourceRef.endsWith(".md"))
    .filter((item) => item.sourceRef !== PACKET_TEMPLATE_PATH);

  for (const workItem of activePacketWorkItems) {
    const packetPath = path.resolve(repoRoot, workItem.sourceRef);
    const content = readRequiredUtf8File({
      filePath: packetPath,
      findings,
      missingCode: "gate_profile_packet_missing",
      missingMessage: `Active work item ${workItem.workItemId} points to missing gate-profile packet ${workItem.sourceRef}.`,
      pathKey: "packetPath"
    });
    if (content == null) {
      continue;
    }

    const header = parseQuickDecisionHeader(content);
    validateReadyForCodeConsistency({ store, workItem, header, findings });
    const gateProfileValue = header ? getHeaderProposed(header, "Gate profile") : null;
    if (!hasConcreteValue(gateProfileValue, { allowUnknown: false })) {
      findings.push({
        code: "gate_profile_missing",
        severity: "error",
        workItemId: workItem.workItemId,
        packetPath: workItem.sourceRef,
        message: `${workItem.sourceRef} must declare one approved Gate profile for active work item ${workItem.workItemId}.`
      });
      continue;
    }

    const gateProfile = resolveGateProfile(gateProfileValue);
    if (!gateProfile) {
      findings.push({
        code: "gate_profile_invalid",
        severity: "error",
        workItemId: workItem.workItemId,
        packetPath: workItem.sourceRef,
        gateProfile: gateProfileValue,
        message: `${workItem.sourceRef} declares invalid Gate profile ${gateProfileValue}. Expected one of ${GATE_PROFILE_IDS.join(", ")}.`
      });
      continue;
    }

    const metadataGateProfile = resolveGateProfile(workItem.metadata?.gateProfile);
    if (metadataGateProfile && metadataGateProfile.id !== gateProfile.id) {
      findings.push({
        code: "gate_profile_metadata_mismatch",
        severity: "error",
        workItemId: workItem.workItemId,
        packetPath: workItem.sourceRef,
        gateProfile: gateProfile.id,
        metadataGateProfile: metadataGateProfile.id,
        message: `${workItem.workItemId} metadata gate profile ${metadataGateProfile.id} does not match packet gate profile ${gateProfile.id}.`
      });
    }

    validateGateProfileEvidence({ workItem, packetPath: workItem.sourceRef, content, header, gateProfile, findings });
  }
}

function validateReadyForCodeConsistency({ store, workItem, header, findings }) {
  if (!header) {
    return;
  }

  const packetReadyForCodeApproved = isReadyForCodeApproved(getHeaderProposed(header, "Ready For Code"));
  const metadataReadyForCodeApproved = isReadyForCodeApproved(workItem.metadata?.readyForCode);
  const openDecision = findOpenReadyForCodeDecision(store, workItem);

  if (packetReadyForCodeApproved && !metadataReadyForCodeApproved) {
    findings.push({
      code: "ready_for_code_metadata_mismatch",
      severity: "error",
      workItemId: workItem.workItemId,
      packetPath: workItem.sourceRef,
      message: `${workItem.workItemId} packet marks Ready For Code approved, but work_item metadata readyForCode is not approved.`
    });
  }

  if (!packetReadyForCodeApproved && metadataReadyForCodeApproved) {
    findings.push({
      code: "ready_for_code_metadata_mismatch",
      severity: "error",
      workItemId: workItem.workItemId,
      packetPath: workItem.sourceRef,
      message: `${workItem.workItemId} work_item metadata marks Ready For Code approved, but packet header does not.`
    });
  }

  if (packetReadyForCodeApproved && openDecision) {
    findings.push({
      code: "ready_for_code_decision_open",
      severity: "error",
      workItemId: workItem.workItemId,
      decisionId: openDecision.decisionId,
      packetPath: workItem.sourceRef,
      message: `${workItem.workItemId} packet marks Ready For Code approved, but decision ${openDecision.decisionId} is still open in decision_registry.`
    });
  }
}

function findOpenReadyForCodeDecision(store, workItem) {
  return store.listDecisions({ status: "open", decisionNeeded: true }).find((decision) => {
    const sameSource = decision.sourceRef === workItem.sourceRef;
    const decisionText = `${decision.decisionId ?? ""} ${decision.title ?? ""}`.toLowerCase();
    return sameSource && decisionText.includes("ready for code");
  });
}

function isReadyForCodeApproved(value) {
  const normalized = normalizeValue(String(value ?? ""));
  return normalized === "approved" || normalized === "approve";
}

function validateGateProfileEvidence({ workItem, packetPath, content, header, gateProfile, findings }) {
  const layerClassification = normalizeValue(getHeaderProposed(header, "Layer classification"));
  if (gateProfile.id === "light" && ["core", "contract", "release"].includes(layerClassification)) {
    findings.push({
      code: "gate_profile_incompatible",
      severity: "error",
      workItemId: workItem.workItemId,
      packetPath,
      gateProfile: gateProfile.id,
      message: `${packetPath} cannot use light gate profile for ${layerClassification} layer work.`
    });
  }

  const manifest = sliceSection(content, "## Verification Manifest");
  if (!manifest) {
    findings.push({
      code: "gate_profile_evidence_missing",
      severity: "error",
      workItemId: workItem.workItemId,
      packetPath,
      gateProfile: gateProfile.id,
      message: `${packetPath} must include ## Verification Manifest for gate profile ${gateProfile.id}.`
    });
    return;
  }

  const requiredMarkers = gateProfileEvidenceMarkers(gateProfile.id);
  for (const marker of requiredMarkers) {
    if (manifest.toLowerCase().includes(marker.toLowerCase())) {
      continue;
    }
    findings.push({
      code: "gate_profile_evidence_missing",
      severity: "error",
      workItemId: workItem.workItemId,
      packetPath,
      gateProfile: gateProfile.id,
      marker,
      message: `${packetPath} Verification Manifest for ${gateProfile.id} is missing evidence marker: ${marker}.`
    });
  }
}

function gateProfileEvidenceMarkers(profileId) {
  const markers = {
    light: ["canonical artifact", "handoff"],
    standard: ["approved packet", "targeted test", "validator", "handoff"],
    contract: ["Ready For Code", "root", "standard-template", "targeted", "validator", "PMW export", "review closeout"],
    release: ["release-baseline", "packaging", "validator", "review closeout"]
  };
  return markers[profileId] ?? [];
}

function validateRegisteredTaskPacket({ artifact, repoRoot, findings }) {
  const packetPath = path.resolve(repoRoot, artifact.path);
  const content = readRequiredUtf8File({
    filePath: packetPath,
    findings,
    missingCode: "task_packet_missing",
    missingMessage: `Missing registered task packet artifact: ${artifact.path}.`,
    pathKey: "packetPath"
  });

  if (content == null) {
    const finding = findings.at(-1);
    if (finding?.code === "task_packet_missing") {
      finding.artifactId = artifact.artifactId;
      finding.packetPath = artifact.path;
    }
    return;
  }

  const header = parseQuickDecisionHeader(content);
  if (!header) {
    findings.push({
      code: "task_packet_header_missing",
      severity: "error",
      artifactId: artifact.artifactId,
      packetPath: artifact.path,
      message: `${artifact.path} is missing the Quick Decision Header table required for task-packet validation.`
    });
    return;
  }

  const fields = parseBulletFields(content);
  validateTaskPacketHeader({ artifact, header, findings });
  validateTaskPacketEvidence({ artifact, header, fields, repoRoot, findings });
}

function validateTaskPacketHeader({ artifact, header, findings }) {
  for (const item of TASK_PACKET_REQUIRED_HEADER_ITEMS) {
    const row = getHeaderRow(header, item.label, item.aliases);
    if (!row) {
      findings.push({
        code: "task_packet_header_field_missing",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: item.label,
        message: `${artifact.path} is missing Quick Decision Header row ${item.label}.`
      });
      continue;
    }

    if (!hasStatedHeaderValue(row.proposed)) {
      findings.push({
        code: "task_packet_header_value_missing",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: item.label,
        message: `${artifact.path} does not provide a concrete proposed value for ${item.label}.`
      });
    }
  }
}

function validateTaskPacketEvidence({ artifact, header, fields, repoRoot, findings }) {
  const readyForCode = normalizeValue(getHeaderProposed(header, "Ready For Code"));
  const readyForCodeApproved = readyForCode === "approve" || readyForCode === "approved";
  const userFacingImpact = normalizeValue(getHeaderProposed(header, "User-facing impact"));
  const profileDependencies = extractProfileIds(
    getHeaderProposedWithAliases(header, "Active profile dependencies", ["Active profile dependency"])
  );
  const profileEvidenceStatus = normalizeValue(getHeaderProposed(header, "Profile evidence status"));
  const uxArchetypeStatus = normalizeValue(getHeaderProposed(header, "UX archetype status"));
  const uxDeviationStatus = normalizeValue(getHeaderProposed(header, "UX deviation status"));
  const environmentTopologyStatus = normalizeValue(getHeaderProposed(header, "Environment topology status"));
  const domainFoundationStatus = normalizeValue(getHeaderProposed(header, "Domain foundation status"));
  const authoritativeSourceStatus = normalizeValue(getHeaderProposed(header, "Authoritative source intake status"));
  const sharedSourceWaveStatus = normalizeValue(getHeaderProposed(header, "Shared-source wave status"));
  const packetExitGateStatus = normalizeValue(getHeaderProposed(header, "Packet exit gate status"));
  const existingSystemDependency = normalizeValue(getHeaderProposed(header, "Existing system dependency"));
  const newAuthoritativeSourceImpact = normalizeValue(getHeaderProposed(header, "New authoritative source impact"));
  const schemaImpactClassification = getFieldValue(fields, "Schema impact classification");
  const impactedPacketSetScope = normalizeValue(getFieldValue(fields, "Impacted packet set scope"));
  const sourceWaveLedgerReference = getFieldValue(fields, "Authoritative source wave ledger reference");
  const sourceWavePacketDisposition = normalizeValue(getFieldValue(fields, "Source wave packet disposition"));

  requireTaskPacketField({
    artifact,
    fields,
    label: "Layer classification",
    findings,
    message: "Registered task packets must record Layer classification."
  });

  requireTaskPacketField({
    artifact,
    fields,
    label: "Required reading before code",
    findings,
    message: "Registered task packets must record Required reading before code."
  });

  if (profileDependencies.length > 0) {
    requireTaskPacketField({
      artifact,
      fields,
      label: "Active profile references",
      aliases: ["Active profile reference"],
      findings,
      message: `Task packet ${artifact.path} declares active optional profiles but does not cite Active profile references.`
    });
    requireTaskPacketField({
      artifact,
      fields,
      label: "Profile-specific evidence status",
      findings,
      message: `Task packet ${artifact.path} declares active optional profiles but does not record Profile-specific evidence status.`
    });

    if (profileDependencies.length > 1) {
      requireTaskPacketField({
        artifact,
        fields,
        label: "Profile composition rationale",
        findings,
        message: `${artifact.path} declares multiple active optional profiles but does not record Profile composition rationale.`
      });
    }

    const activeProfileReferences = getFieldValueWithAliases(fields, [
      "Active profile references",
      "Active profile reference"
    ]);
    if (hasConcreteValue(activeProfileReferences)) {
      for (const profileDependency of profileDependencies) {
        if (activeProfileReferences.includes(`reference/profiles/${profileDependency}_`)) {
          continue;
        }

        findings.push({
          code: "task_packet_status_contract_mismatch",
          severity: "error",
          artifactId: artifact.artifactId,
          packetPath: artifact.path,
          headerItem: "Active profile dependencies",
          message: `${artifact.path} declares ${profileDependency} but Active profile references does not cite that profile.`
        });
      }
    }

    if (readyForCodeApproved && profileEvidenceStatus !== "approved") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "Profile evidence status",
        message: `${artifact.path} is marked Ready For Code approve while Profile evidence status is ${profileEvidenceStatus || "missing"}.`
      });
    }

    if (readyForCodeApproved || profileEvidenceStatus === "approved") {
      const requiredProfileFields = new Set();
      for (const profileDependency of profileDependencies) {
        for (const label of TASK_PACKET_PROFILE_FIELD_REQUIREMENTS[profileDependency] ?? []) {
          requiredProfileFields.add(label);
        }
      }

      for (const label of requiredProfileFields) {
        requireTaskPacketField({
          artifact,
          fields,
          label,
          findings,
          message: `${artifact.path} is missing ${label} required by one of its active optional profiles.`
        });
      }
    }
  }

  if (userFacingImpact && userFacingImpact !== "none") {
    requireTaskPacketField({
      artifact,
      fields,
      label: "UX archetype reference",
      findings,
      message: `${artifact.path} has user-facing impact but does not cite a UX archetype reference.`
    });
    requireTaskPacketField({
      artifact,
      fields,
      label: "Selected UX archetype",
      findings,
      message: `${artifact.path} has user-facing impact but does not record Selected UX archetype.`
    });

    if (readyForCodeApproved && uxArchetypeStatus !== "approved") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "UX archetype status",
        message: `${artifact.path} is marked Ready For Code approve while UX archetype status is ${uxArchetypeStatus || "missing"}.`
      });
    }

    if (uxDeviationStatus && uxDeviationStatus !== "none") {
      requireTaskPacketField({
        artifact,
        fields,
        label: "Archetype deviation / approval",
        findings,
        message: `${artifact.path} declares UX deviation but does not record Archetype deviation / approval.`
      });
    }
  }

  if (environmentTopologyStatus && environmentTopologyStatus !== "not-needed") {
    for (const label of [
      "Environment topology reference",
      "Source environment",
      "Target environment",
      "Execution target",
      "Transfer boundary",
      "Rollback boundary"
    ]) {
      requireTaskPacketField({
        artifact,
        fields,
        label,
        findings,
        message: `${artifact.path} is missing ${label} required by the environment topology contract.`
      });
    }

    if (readyForCodeApproved && environmentTopologyStatus !== "approved") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "Environment topology status",
        message: `${artifact.path} is marked Ready For Code approve while Environment topology status is ${environmentTopologyStatus || "missing"}.`
      });
    }
  }

  if (
    (domainFoundationStatus && domainFoundationStatus !== "not-needed") ||
    (existingSystemDependency && existingSystemDependency !== "none") ||
    hasConcreteValue(schemaImpactClassification, { allowNone: false, allowUnknown: false })
  ) {
    requireTaskPacketField({
      artifact,
      fields,
      label: "Domain foundation reference",
      findings,
      message: `${artifact.path} requires data-impact evidence but does not cite Domain foundation reference.`
    });
    requireTaskPacketField({
      artifact,
      fields,
      label: "Schema impact classification",
      findings,
      message: `${artifact.path} requires data-impact evidence but does not record Schema impact classification.`,
      allowUnknown: false
    });

    if (readyForCodeApproved && domainFoundationStatus !== "approved") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "Domain foundation status",
        message: `${artifact.path} is marked Ready For Code approve while Domain foundation status is ${domainFoundationStatus || "missing"}.`
      });
    }

    if (existingSystemDependency === "confirmed") {
      for (const label of [
        "Existing schema source artifact",
        "Table / column naming compatibility",
        "Data operation / ownership compatibility",
        "Migration / rollback / cutover compatibility"
      ]) {
        requireTaskPacketField({
          artifact,
          fields,
          label,
          findings,
          message: `${artifact.path} confirms an existing-system dependency but does not record ${label}.`
        });
      }
    }
  }

  if (
    (authoritativeSourceStatus && authoritativeSourceStatus !== "not-needed") ||
    (newAuthoritativeSourceImpact && newAuthoritativeSourceImpact !== "none")
  ) {
    for (const label of [
      "Authoritative source intake reference",
      "Authoritative source disposition",
      "Current implementation impact"
    ]) {
      requireTaskPacketField({
        artifact,
        fields,
        label,
        findings,
        message: `${artifact.path} requires authoritative-source evidence but does not record ${label}.`
      });
    }

    requireTaskPacketField({
      artifact,
      fields,
      label: "Existing plan conflict",
      findings,
      message: `${artifact.path} requires authoritative-source evidence but does not record Existing plan conflict.`,
      allowNone: true
    });
    requireTaskPacketField({
      artifact,
      fields,
      label: "Impacted packet set scope",
      findings,
      message: `${artifact.path} requires authoritative-source evidence but does not record Impacted packet set scope.`,
      allowNone: false,
      allowUnknown: false
    });

    if (readyForCodeApproved && authoritativeSourceStatus !== "approved") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "Authoritative source intake status",
        message: `${artifact.path} is marked Ready For Code approve while Authoritative source intake status is ${authoritativeSourceStatus || "missing"}.`
      });
    }
  }

  if (impactedPacketSetScope === "multi-packet" || (sharedSourceWaveStatus && sharedSourceWaveStatus !== "not-needed")) {
    requireTaskPacketField({
      artifact,
      fields,
      label: "Authoritative source wave ledger reference",
      findings,
      message: `${artifact.path} participates in a shared-source wave but does not cite Authoritative source wave ledger reference.`
    });
    requireTaskPacketField({
      artifact,
      fields,
      label: "Source wave packet disposition",
      findings,
      message: `${artifact.path} participates in a shared-source wave but does not record Source wave packet disposition.`,
      allowNone: false,
      allowUnknown: false
    });

    if (impactedPacketSetScope === "multi-packet" && sharedSourceWaveStatus === "not-needed") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "Shared-source wave status",
        message: `${artifact.path} declares multi-packet source-wave impact while Shared-source wave status is not-needed.`
      });
    }

    if (impactedPacketSetScope !== "multi-packet" && sharedSourceWaveStatus && sharedSourceWaveStatus !== "not-needed") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "Shared-source wave status",
        message: `${artifact.path} records Shared-source wave status ${sharedSourceWaveStatus} without declaring multi-packet source-wave scope.`
      });
    }

    if (readyForCodeApproved && sharedSourceWaveStatus !== "approved") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "Shared-source wave status",
        message: `${artifact.path} is marked Ready For Code approve while Shared-source wave status is ${sharedSourceWaveStatus || "missing"}.`
      });
    }

    if (
      hasConcreteValue(sourceWaveLedgerReference) &&
      hasConcreteValue(sourceWavePacketDisposition, { allowNone: false, allowUnknown: false })
    ) {
      validateSourceWaveLedgerMembership({
        artifact,
        ledgerReference: sourceWaveLedgerReference,
        packetDisposition: sourceWavePacketDisposition,
        repoRoot,
        findings
      });
    }
  }

  if (packetExitGateStatus === "approved") {
    for (const label of [
      "Packet exit quality gate reference",
      "Exit recommendation",
      "Source parity result",
      "Validation / security / cleanup evidence"
    ]) {
      requireTaskPacketField({
        artifact,
        fields,
        label,
        findings,
        message: `${artifact.path} marks Packet exit gate as approved but does not record ${label}.`
      });
    }
  }
}

function requireTaskPacketField({
  artifact,
  fields,
  label,
  aliases = [],
  findings,
  message,
  allowNone = false,
  allowUnknown = false
}) {
  const value = getFieldValueWithAliases(fields, [label, ...aliases]);
  if (hasConcreteValue(value, { allowNone, allowUnknown })) {
    return;
  }

  findings.push({
    code: "task_packet_required_evidence_missing",
    severity: "error",
    artifactId: artifact.artifactId,
    packetPath: artifact.path,
    field: label,
    message
  });
}

function validateContractMarkers({
  repoRoot,
  relativePath,
  requiredMarkers,
  missingFileCode,
  missingMarkerCode,
  findings,
  profileId = null
}) {
  const resolvedPath = path.resolve(repoRoot, relativePath);
  const content = readRequiredUtf8File({
    filePath: resolvedPath,
    findings,
    missingCode: missingFileCode,
    missingMessage: `Missing required contract artifact: ${relativePath}.`,
    pathKey: "contractPath"
  });
  if (content == null) {
    if (findings.at(-1)?.code === missingFileCode) {
      findings.at(-1).contractPath = relativePath;
      if (profileId) {
        findings.at(-1).profileId = profileId;
      }
    }
    return;
  }

  for (const marker of requiredMarkers) {
    if (content.includes(marker)) {
      continue;
    }

    findings.push({
      code: missingMarkerCode,
      severity: "error",
      contractPath: relativePath,
      profileId,
      marker,
      message: `${relativePath} is missing required marker ${marker}.`
    });
  }
}

function parseQuickDecisionHeader(content) {
  const section = sliceSection(content, "## Quick Decision Header");
  if (!section) {
    return null;
  }

  const tableLines = section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"));

  if (tableLines.length < 3) {
    return null;
  }

  const rows = new Map();
  for (const line of tableLines.slice(2)) {
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (cells.length < 4 || !cells[0] || cells[0].startsWith("---")) {
      continue;
    }

    rows.set(cells[0], {
      proposed: cells[1],
      why: cells[2],
      status: cells[3]
    });
  }

  return rows;
}

function parseBulletFields(content) {
  const fields = new Map();

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    const match = line.match(/^- ([^:]+):(.*)$/);
    if (!match) {
      continue;
    }

    fields.set(match[1].trim(), match[2].trim());
  }

  return fields;
}

function getHeaderProposed(header, item) {
  return header.get(item)?.proposed ?? "";
}

function getHeaderProposedWithAliases(header, item, aliases = []) {
  return getHeaderRow(header, item, aliases)?.proposed ?? "";
}

function getHeaderRow(header, item, aliases = []) {
  for (const candidate of [item, ...aliases]) {
    const row = header.get(candidate);
    if (row) {
      return row;
    }
  }

  return null;
}

function getFieldValue(fields, label) {
  return fields.get(label) ?? "";
}

function getFieldValueWithAliases(fields, labels) {
  for (const label of labels) {
    const value = getFieldValue(fields, label);
    if (value) {
      return value;
    }
  }

  return "";
}

function hasStatedHeaderValue(value) {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed === "-" || trimmed.includes("[") || trimmed.includes("]")) {
    return false;
  }

  return !trimmed.includes(" / ");
}

function hasConcreteValue(value, { allowNone = false, allowUnknown = true } = {}) {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();
  const normalized = normalizeValue(trimmed);
  if (!trimmed || trimmed === "-" || trimmed.includes("[") || trimmed.includes("]")) {
    return false;
  }
  if (!allowNone && normalized === "none") {
    return false;
  }
  if (!allowUnknown && normalized === "unknown") {
    return false;
  }
  return true;
}

function normalizeValue(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function extractProfileIds(value) {
  const matches = value.match(/PRF-\d+/gi) ?? [];
  return [...new Set(matches.map((match) => match.toUpperCase()))];
}

function validateSourceWaveLedgerMembership({
  artifact,
  ledgerReference,
  packetDisposition,
  repoRoot,
  findings
}) {
  const ledgerPath = path.resolve(repoRoot, ledgerReference);
  const content = readRequiredUtf8File({
    filePath: ledgerPath,
    findings,
    missingCode: "source_wave_ledger_instance_missing",
    missingMessage: `${artifact.path} cites missing authoritative source wave ledger ${ledgerReference}.`,
    pathKey: "contractPath"
  });

  if (content == null) {
    const finding = findings.at(-1);
    if (finding?.code === "source_wave_ledger_instance_missing") {
      finding.artifactId = artifact.artifactId;
      finding.packetPath = artifact.path;
      finding.contractPath = ledgerReference;
    }
    return;
  }

  const packetRow = content
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.includes(`| ${artifact.path} |`));

  if (!packetRow) {
    findings.push({
      code: "source_wave_packet_missing_from_ledger",
      severity: "error",
      artifactId: artifact.artifactId,
      packetPath: artifact.path,
      contractPath: ledgerReference,
      message: `${artifact.path} cites ${ledgerReference} but the impacted packet set does not include that packet path.`
    });
    return;
  }

  if (!packetRow.toLowerCase().includes(packetDisposition)) {
    findings.push({
      code: "source_wave_packet_disposition_mismatch",
      severity: "error",
      artifactId: artifact.artifactId,
      packetPath: artifact.path,
      contractPath: ledgerReference,
      message: `${artifact.path} records Source wave packet disposition ${packetDisposition} but ${ledgerReference} does not match that disposition in the impacted packet row.`
    });
  }
}

function discoverConcreteTaskPacketCandidates(repoRoot) {
  const packetDir = path.resolve(repoRoot, TASK_PACKET_DIRECTORY);
  if (!fs.existsSync(packetDir)) {
    return [];
  }

  return fs
    .readdirSync(packetDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .filter((entry) => path.extname(entry.name).toLowerCase() === ".md")
    .filter((entry) => !TASK_PACKET_DISCOVERY_EXCLUDED_FILES.has(entry.name))
    .map((entry) => ({
      relativePath: `${TASK_PACKET_DIRECTORY}/${entry.name}`,
      absolutePath: path.join(packetDir, entry.name)
    }))
    .filter(({ absolutePath }) => looksLikeConcreteTaskPacket(fs.readFileSync(absolutePath, "utf8")))
    .map(({ relativePath }) => relativePath);
}

function looksLikeConcreteTaskPacket(content) {
  if (!content) {
    return false;
  }

  const hasRequiredMarkers = TASK_PACKET_DISCOVERY_REQUIRED_MARKERS.every((marker) => content.includes(marker));
  if (!hasRequiredMarkers) {
    return false;
  }

  return (
    content.includes("| Active profile dependencies |") ||
    content.includes("| Active profile dependency |")
  );
}

function createDiscoveredTaskPacketArtifact(packetPath) {
  return {
    artifactId: `discovered:${packetPath}`,
    path: packetPath
  };
}

function validateRequiredSections(projectionName, content, findings) {
  for (const section of REQUIRED_SECTIONS[projectionName] ?? []) {
    if (!content.includes(section)) {
      findings.push({
        code: "required_section_missing",
        severity: "error",
        projectionName,
        section,
        message: `${projectionName} is missing required section ${section}.`
      });
    }
  }
}

function validateProjectionState(store, projectionName, content, findings) {
  const projection = store.getGenerationState(projectionName);
  if (!projection) {
    findings.push({
      code: "generation_state_missing",
      severity: "error",
      projectionName,
      message: `${projectionName} has no generation_state row.`
    });
    return;
  }

  const checksum = calculateChecksum(content);
  if (projection.checksum !== checksum) {
    findings.push({
      code: "checksum_mismatch",
      severity: "error",
      projectionName,
      message: `${projectionName} checksum does not match generation_state.`
    });
  }
}

function validateDecisionParity(store, content, findings) {
  const openDecisions = store.listDecisions({ status: "open", decisionNeeded: true });
  const summaryCount = extractSummaryCount(content, "## Decision Required Summary");
  const detailCount = countTableRows(content, "## Decision Required Detail");

  if (summaryCount !== openDecisions.length) {
    findings.push({
      code: "generated_docs_parity_mismatch",
      severity: "error",
      projectionName: CURRENT_STATE_DOC,
      message: `Decision summary count ${summaryCount} does not match DB count ${openDecisions.length}.`
    });
  }

  if (summaryCount !== detailCount) {
    findings.push({
      code: "count_detail_parity_mismatch",
      severity: "error",
      projectionName: CURRENT_STATE_DOC,
      message: `Decision summary count ${summaryCount} does not match detail row count ${detailCount}.`
    });
  }
}

function validateRiskParity(store, content, findings) {
  const openRisks = store.listGateRisks({ status: "open" });
  const summaryCount = extractSummaryCount(content, "## Blocked / At Risk Summary");
  const detailCount = countTableRows(content, "## Blocked / At Risk Detail");

  if (summaryCount !== openRisks.length) {
    findings.push({
      code: "generated_docs_parity_mismatch",
      severity: "error",
      projectionName: TASK_LIST_DOC,
      message: `Blocked/risk summary count ${summaryCount} does not match DB count ${openRisks.length}.`
    });
  }

  if (summaryCount !== detailCount) {
    findings.push({
      code: "count_detail_parity_mismatch",
      severity: "error",
      projectionName: TASK_LIST_DOC,
      message: `Blocked/risk summary count ${summaryCount} does not match detail row count ${detailCount}.`
    });
  }
}

function validateSourceRefs(store, repoRoot, findings) {
  const releaseState = store.getReleaseState("current");
  const entries = [
    ...wrapSourceRefs("release_state", releaseState ? [releaseState] : []),
    ...wrapSourceRefs("work_item_registry", store.listWorkItems()),
    ...wrapSourceRefs("decision_registry", store.listDecisions()),
    ...wrapSourceRefs("gate_risk_registry", store.listGateRisks()),
    ...wrapSourceRefs("handoff_log", store.listRecentHandoffs(50)),
    ...wrapSourceRefs("artifact_index", store.listArtifacts())
  ];

  for (const entry of entries) {
    if (!entry.sourceRef) {
      continue;
    }

    const resolved = path.resolve(repoRoot, entry.sourceRef);
    if (!fs.existsSync(resolved)) {
      findings.push({
        code: "source_ref_unresolved",
        severity: "error",
        rowType: entry.rowType,
        rowId: entry.rowId,
        sourceRef: entry.sourceRef,
        message: `${entry.rowType}:${entry.rowId} points to missing source_ref ${entry.sourceRef}.`
      });
    }
  }
}

function validateFreshness(store, findings) {
  const latestSourceChange = store.getLatestOperationalTimestamp();
  if (!latestSourceChange) {
    return;
  }

  for (const projectionName of [CURRENT_STATE_DOC, TASK_LIST_DOC]) {
    const projection = store.getGenerationState(projectionName);
    if (!projection) {
      continue;
    }

    if (projection.generatedAt < latestSourceChange) {
      findings.push({
        code: "freshness_drift_detected",
        severity: "error",
        projectionName,
        message: `${projectionName} is stale relative to the latest DB mutation timestamp.`
      });
    }
  }
}

function extractSummaryCount(content, sectionHeading) {
  const section = sliceSection(content, sectionHeading);
  if (!section) {
    return -1;
  }

  const firstBullet = section
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("- "));
  if (!firstBullet) {
    return -1;
  }

  const match = firstBullet.match(/(\d+)/);
  return match ? Number(match[1]) : -1;
}

function countTableRows(content, sectionHeading) {
  const section = sliceSection(content, sectionHeading);
  if (!section) {
    return -1;
  }

  const lines = section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"));

  if (lines.length < 3) {
    return 0;
  }

  const dataRows = lines.slice(2);
  if (dataRows.length === 1 && isEmptyPlaceholderRow(dataRows[0])) {
    return 0;
  }

  return dataRows.length;
}

function sliceSection(content, sectionHeading) {
  const start = content.indexOf(sectionHeading);
  if (start === -1) {
    return null;
  }

  const afterStart = content.slice(start + sectionHeading.length).trimStart();
  const nextHeadingMatch = afterStart.match(/\n##\s+/);
  if (!nextHeadingMatch) {
    return afterStart;
  }

  return afterStart.slice(0, nextHeadingMatch.index).trimEnd();
}

function wrapSourceRefs(rowType, rows) {
  return rows.map((row) => ({
    rowType,
    rowId:
      row.releaseId ??
      row.workItemId ??
      row.decisionId ??
      row.riskId ??
      row.handoffId ??
      row.artifactId ??
      "unknown",
    sourceRef: row.sourceRef ?? null
  }));
}

function isEmptyPlaceholderRow(row) {
  const cells = row
    .split("|")
    .map((cell) => cell.trim())
    .filter(Boolean);

  return cells[0] === "-";
}
