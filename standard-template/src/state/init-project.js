import fs from "node:fs";
import path from "node:path";

import { writeGeneratedStateDocs } from "./generate-state-docs.js";
import { createOperatingStateStore } from "./operating-state-store.js";

export const STARTER_PACKAGE_NAME = "harness-implementation-v1";
export const KNOWN_PROFILES = {
  "PRF-01": {
    label: "PRF-01 admin grid application profile",
    architectureNote:
      "`PRF-01` active: dense administrative grid, search/filter/sort, row action, bulk operation."
  },
  "PRF-02": {
    label: "PRF-02 authoritative spreadsheet source profile",
    architectureNote:
      "`PRF-02` active: spreadsheet-backed authoritative planning, field mapping, or operational source."
  },
  "PRF-03": {
    label: "PRF-03 airgapped delivery profile",
    architectureNote:
      "`PRF-03` active: transfer-bound or airgapped delivery with explicit bundle and integrity evidence."
  }
};

const REQUIRED_STARTER_FILES = [
  "AGENTS.md",
  "README.md",
  "START_HERE.md",
  "package.json",
  ".agents/artifacts/CURRENT_STATE.md",
  ".agents/artifacts/TASK_LIST.md",
  ".agents/artifacts/REQUIREMENTS.md",
  ".agents/artifacts/ARCHITECTURE_GUIDE.md",
  ".agents/artifacts/IMPLEMENTATION_PLAN.md",
  ".agents/artifacts/PROJECT_PROGRESS.md",
  ".agents/artifacts/PREVENTIVE_MEMORY.md",
  "reference/planning/PLN-00_DEEP_INTERVIEW.md",
  "reference/planning/PLN-01_REQUIREMENTS_FREEZE.md",
  "reference/artifacts/UI_DESIGN.md",
  "reference/artifacts/DEPLOYMENT_PLAN.md",
  "reference/artifacts/PACKET_EXIT_QUALITY_GATE.md",
  "reference/artifacts/STANDARD_HARNESS_USER_MANUAL.md",
  "reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md"
];

const PROGRESS_ROWS = [
  {
    phase: "Planning",
    id: "PLN-00",
    task: "Kickoff interview",
    status: "in_progress",
    notes: "Close implementation-critical discovery and approval boundaries first.",
    source: "reference/planning/PLN-00_DEEP_INTERVIEW.md",
    domain: "기준선 정렬"
  },
  {
    phase: "Planning",
    id: "PLN-01",
    task: "Requirements freeze",
    status: "todo",
    notes: "Freeze the project-specific requirements baseline after user confirmation.",
    source: ".agents/artifacts/REQUIREMENTS.md",
    domain: "기준선 정렬"
  },
  {
    phase: "Planning",
    id: "PLN-02",
    task: "Baseline sync",
    status: "todo",
    notes: "Align architecture / implementation / UI after requirements approval.",
    source: ".agents/artifacts/ARCHITECTURE_GUIDE.md",
    domain: "기준선 정렬"
  },
  {
    phase: "Design",
    id: "DSG-01",
    task: "Rough UX direction",
    status: "todo",
    notes: "Lock the rough direction and global behavior contract.",
    source: "reference/artifacts/UI_DESIGN.md",
    domain: "기준선 정렬"
  },
  {
    phase: "Packet",
    id: "PKT-01",
    task: "First work packet approval",
    status: "todo",
    notes: "Use the standard packet template before any code starts.",
    source: "reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md",
    domain: "운영 품질"
  },
  {
    phase: "Build",
    id: "DEV-01",
    task: "First approved implementation packet",
    status: "todo",
    notes: "Replace this starter row with the first real implementation packet.",
    source: "reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md",
    domain: "상태 저장소"
  },
  {
    phase: "Build",
    id: "DEV-02",
    task: "Implementation and canonical-doc sync",
    status: "todo",
    notes: "Keep code and live artifacts aligned while building.",
    source: ".agents/artifacts/IMPLEMENTATION_PLAN.md",
    domain: "상태 문서·복원"
  },
  {
    phase: "Test",
    id: "DEV-03",
    task: "Generated docs / validator verification",
    status: "todo",
    notes: "Check generated docs and validator parity.",
    source: ".agents/artifacts/IMPLEMENTATION_PLAN.md",
    domain: "검증·컷오버"
  },
  {
    phase: "Test",
    id: "DEV-04",
    task: "PMW and operator read-surface check",
    status: "todo",
    notes: "Verify the operator-facing read surface against the approved baseline.",
    source: "reference/artifacts/UI_DESIGN.md",
    domain: "PMW 읽기 화면"
  },
  {
    phase: "Release",
    id: "DEV-05",
    task: "Deploy / test / cutover readiness",
    status: "todo",
    notes: "Close environment topology, rollback, and release-readiness checks.",
    source: "reference/artifacts/DEPLOYMENT_PLAN.md",
    domain: "검증·컷오버"
  },
  {
    phase: "Quality",
    id: "QLT-01",
    task: "Packet exit quality gate",
    status: "todo",
    notes: "Record closeout evidence before moving to the next packet.",
    source: "reference/artifacts/PACKET_EXIT_QUALITY_GATE.md",
    domain: "운영 품질"
  },
  {
    phase: "Security",
    id: "SEC-01",
    task: "Security and operational risk review",
    status: "todo",
    notes: "Review code path, scripts, dependencies, and release risks.",
    source: ".agents/artifacts/IMPLEMENTATION_PLAN.md",
    domain: "운영 품질"
  },
  {
    phase: "Test",
    id: "TST-01",
    task: "Acceptance and parity verification",
    status: "todo",
    notes: "Check acceptance, generated docs, and live truth parity.",
    source: ".agents/artifacts/IMPLEMENTATION_PLAN.md",
    domain: "검증·컷오버"
  },
  {
    phase: "Test",
    id: "TST-02",
    task: "Operator comprehension check",
    status: "todo",
    notes: "Confirm first-view comprehension before release.",
    source: "reference/artifacts/UI_DESIGN.md",
    domain: "PMW 읽기 화면"
  },
  {
    phase: "Review",
    id: "REV-01",
    task: "Release review gate",
    status: "todo",
    notes: "Close the release gate with evidence and review alignment.",
    source: ".agents/artifacts/IMPLEMENTATION_PLAN.md",
    domain: "운영 품질"
  }
];

const DOMAIN_BY_PHASE = {
  Planning: "기준선 정렬",
  Design: "기준선 정렬",
  Packet: "운영 품질",
  Build: "상태 저장소",
  Quality: "운영 품질",
  Security: "운영 품질",
  Test: "검증·컷오버",
  Review: "운영 품질"
};

export function initializeProjectStarter({
  repoRoot = process.cwd(),
  projectName,
  projectSlug,
  userGoal,
  opsGoal,
  approvalGoal,
  activeProfiles = [],
  force = false,
  now = defaultNow
} = {}) {
  const resolvedRoot = path.resolve(repoRoot);
  ensureStarterLayout(resolvedRoot);
  ensureStarterSafe(resolvedRoot, { force });

  const normalizedProjectName = requireNonEmpty(projectName, "projectName");
  const normalizedProjectSlug = sanitizePackageName(
    projectSlug ? requireNonEmpty(projectSlug, "projectSlug") : slugifyProjectName(normalizedProjectName)
  );
  const normalizedUserGoal = requireNonEmpty(userGoal, "userGoal");
  const normalizedOpsGoal = requireNonEmpty(opsGoal, "opsGoal");
  const normalizedApprovalGoal = requireNonEmpty(approvalGoal, "approvalGoal");
  const normalizedProfiles = normalizeActiveProfiles(activeProfiles);
  const initializedAt = now();
  const initializedDate = initializedAt.slice(0, 10);

  const currentFocus = `Close PLN-00 kickoff interview and PLN-01 requirements freeze for ${normalizedProjectName}.`;
  const releaseGoal = `Define the first approved project baseline for ${normalizedProjectName} on top of the standard harness starter.`;
  const bootstrapSummary = `Bootstrapped ${normalizedProjectName} from the standard harness starter and opened PLN-00 kickoff discovery.`;

  writeFile(
    resolvedRoot,
    "README.md",
    buildProjectReadme({
      projectName: normalizedProjectName,
      projectSlug: normalizedProjectSlug,
      initializedDate,
      activeProfiles: normalizedProfiles
    })
  );
  writeFile(
    resolvedRoot,
    ".agents/artifacts/CURRENT_STATE.md",
    buildCurrentStateDoc({
      projectName: normalizedProjectName,
      currentFocus,
      releaseGoal,
      initializedDate,
      bootstrapSummary
    })
  );
  writeFile(
    resolvedRoot,
    ".agents/artifacts/TASK_LIST.md",
    buildTaskListDoc({
      projectName: normalizedProjectName,
      currentFocus,
      bootstrapSummary,
      initializedDate
    })
  );
  writeFile(
    resolvedRoot,
    ".agents/artifacts/PROJECT_PROGRESS.md",
    buildProjectProgressDoc({
      projectName: normalizedProjectName
    })
  );

  updateFile(
    resolvedRoot,
    ".agents/artifacts/REQUIREMENTS.md",
    (text) =>
      updateRequirementsText(text, {
        projectName: normalizedProjectName,
        userGoal: normalizedUserGoal,
        opsGoal: normalizedOpsGoal,
        approvalGoal: normalizedApprovalGoal,
        activeProfiles: normalizedProfiles
      })
  );
  updateFile(
    resolvedRoot,
    ".agents/artifacts/ARCHITECTURE_GUIDE.md",
    (text) => updateArchitectureText(text, { activeProfiles: normalizedProfiles })
  );
  updateFile(
    resolvedRoot,
    ".agents/artifacts/IMPLEMENTATION_PLAN.md",
    (text) =>
      updateImplementationPlanText(text, {
        projectName: normalizedProjectName,
        currentFocus,
        activeProfiles: normalizedProfiles
      })
  );
  updatePackageJson(resolvedRoot, normalizedProjectSlug);

  const dbPath = path.join(resolvedRoot, ".harness", "operating_state.sqlite");
  resetOperatingStateArtifacts(dbPath);
  const store = createOperatingStateStore({
    dbPath,
    now: typeof now === "function" ? now : defaultNow
  });

  try {
    store.setReleaseState({
      currentStage: "planning",
      releaseGateState: "open",
      currentFocus,
      releaseGoal,
      sourceRef: ".agents/artifacts/CURRENT_STATE.md",
      updatedBy: "harness:init",
      metadata: {
        projectName: normalizedProjectName,
        projectSlug: normalizedProjectSlug,
        initializedDate,
        activeProfiles: normalizedProfiles
      }
    });

    store.recordDecision({
      decisionId: "DEC-INIT-01",
      title: `Approve initial project goals and active profile scope for ${normalizedProjectName}`,
      decisionNeeded: true,
      impactSummary: "Defines the first executable planning lane and baseline artifact scope.",
      sourceRef: ".agents/artifacts/REQUIREMENTS.md",
      status: "open",
      metadata: {
        initializedDate
      }
    });

    store.recordGateRisk({
      riskId: "RISK-INIT-01",
      title: `${normalizedProjectName} requirements baseline is not approved yet`,
      severity: "medium",
      status: "open",
      unblockCondition: "Close PLN-00 and PLN-01 with explicit user confirmation.",
      sourceRef: ".agents/artifacts/REQUIREMENTS.md",
      metadata: {
        initializedDate
      }
    });

    for (const row of PROGRESS_ROWS) {
      store.upsertWorkItem({
        workItemId: row.id,
        title: row.task,
        status: row.status,
        nextAction: row.id === "PLN-00" ? currentFocus : defaultNextAction(row.id, normalizedProjectName),
        sourceRef: row.source,
        domainHint: row.domain ?? DOMAIN_BY_PHASE[row.phase] ?? "운영 품질",
        metadata: {
          phase: row.phase,
          notes: row.notes
        }
      });
    }

    store.appendHandoff({
      handoffId: `handoff-init-${initializedDate}`,
      createdAt: initializedAt,
      handoffSummary: bootstrapSummary,
      fromRole: "bootstrap",
      toRole: "planner",
      sourceRef: ".agents/artifacts/CURRENT_STATE.md",
      payload: {
        projectName: normalizedProjectName,
        projectSlug: normalizedProjectSlug,
        activeProfiles: normalizedProfiles
      }
    });

    for (const artifact of starterArtifactSeed()) {
      store.upsertArtifact(artifact);
    }

    writeGeneratedStateDocs({ store, outputDir: resolvedRoot });
  } finally {
    store.close();
  }

  return {
    ok: true,
    projectName: normalizedProjectName,
    projectSlug: normalizedProjectSlug,
    repoRoot: resolvedRoot,
    dbPath,
    activeProfiles: normalizedProfiles,
    initializedDate,
    nextAction: currentFocus
  };
}

export function normalizeActiveProfiles(activeProfiles) {
  const values = Array.isArray(activeProfiles)
    ? activeProfiles
    : String(activeProfiles ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
  const normalized = [...new Set(values.map((item) => item.toUpperCase()).filter((item) => item !== "NONE"))];
  for (const profile of normalized) {
    if (!KNOWN_PROFILES[profile]) {
      throw new Error(`Unknown optional profile: ${profile}`);
    }
  }
  return normalized.sort();
}

export function slugifyProjectName(projectName) {
  return sanitizePackageName(projectName);
}

export function looksLikeStarterPlaceholder(repoRoot) {
  const currentStatePath = path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md");
  const taskListPath = path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md");
  if (!fs.existsSync(currentStatePath) || !fs.existsSync(taskListPath)) {
    return false;
  }
  const currentState = readFile(currentStatePath);
  const taskList = readFile(taskListPath);
  return (
    currentState.includes("Current Stage: not started") &&
    taskList.includes("Run `INIT_STANDARD_HARNESS.cmd` or `npm run harness:init` before real work begins.")
  );
}

function ensureStarterLayout(repoRoot) {
  for (const relativePath of REQUIRED_STARTER_FILES) {
    if (!fs.existsSync(path.join(repoRoot, relativePath))) {
      throw new Error(`Missing required starter path: ${relativePath}`);
    }
  }
}

function ensureStarterSafe(repoRoot, { force }) {
  if (force) {
    return;
  }

  if (!looksLikeStarterPlaceholder(repoRoot)) {
    throw new Error(
      "The target repo does not look like a fresh standard harness starter. Re-run with --force only if you intentionally want to reinitialize it."
    );
  }
}

function buildProjectReadme({ projectName, projectSlug, initializedDate, activeProfiles }) {
  const activeProfileLine = activeProfiles.length
    ? activeProfiles.map((profile) => `${profile} (${KNOWN_PROFILES[profile].label})`).join(", ")
    : "none";
  return [
    `# ${projectName}`,
    "",
    `이 저장소는 ${initializedDate}에 표준 하네스 스타터로 초기화되었다.`,
    "",
    "## 가장 먼저",
    "- `START_HERE.md`",
    "- `INIT_STANDARD_HARNESS.cmd`",
    "- `npm run harness:init`",
    "",
    "## Harness Bootstrap",
    `- Project slug: \`${projectSlug}\``,
    `- Active optional profiles: ${activeProfileLine}`,
    "- Next step: close PLN-00 and PLN-01 before opening implementation.",
    "",
    "## First Commands",
    "- `npm test`",
    "- `npm run pmw:start`",
    "- `npm run harness:validate`",
    "",
    "## Truth Contract",
    "- `.agents/artifacts/*` is live operational truth.",
    "- `.agents/runtime/generated-state-docs/*` is derived output.",
    "- `reference/*` is optional reference material."
  ].join("\n");
}

function buildCurrentStateDoc({ projectName, currentFocus, releaseGoal, initializedDate, bootstrapSummary }) {
  return [
    "# Current State",
    "",
    "## Snapshot",
    "- Current Stage: planning",
    `- Current Focus: ${currentFocus}`,
    `- Current Release Goal: ${releaseGoal}`,
    "",
    "## Next Recommended Agent",
    "- Planner",
    "",
    "## Must Read Next",
    "- `START_HERE.md`",
    "- `.agents/artifacts/REQUIREMENTS.md`",
    "- `reference/planning/PLN-00_DEEP_INTERVIEW.md`",
    "- `reference/planning/PLN-01_REQUIREMENTS_FREEZE.md`",
    "",
    "## Open Decisions / Blockers",
    "- No active blocker is currently recorded.",
    `- ${projectName} was bootstrapped from the current standard harness starter on ${initializedDate}.`,
    "- Close PLN-00 and PLN-01 before claiming a project-specific implementation lane is active.",
    "",
    "## Latest Handoff Summary",
    `- ${initializedDate}: ${bootstrapSummary}`
  ].join("\n");
}

function buildTaskListDoc({ projectName, currentFocus, bootstrapSummary, initializedDate }) {
  return [
    "# Task List",
    "",
    "## Current Release Target",
    `- Close the kickoff baseline so ${projectName} can open its first approved project packet safely.`,
    "",
    "## Active Locks",
    "- none",
    "",
    "## Active Tasks",
    "- Use `START_HERE.md` as the kickoff checklist if a planner or PM is opening this repo first.",
    `- ${currentFocus}`,
    "- Sync architecture / implementation / UI baseline only after requirements approval.",
    "- Activate optional profiles only when the project actually needs them.",
    "- Do not open project packets before the baseline artifacts are aligned.",
    "- Keep `.agents/artifacts/PROJECT_PROGRESS.md` aligned with actual execution state.",
    "",
    "## Handoff Log",
    `- ${initializedDate}: ${bootstrapSummary}`
  ].join("\n");
}

function buildProjectProgressDoc({ projectName }) {
  return [
    "# Project Progress",
    "",
    "## Summary",
    `Track the whole project kickoff-to-release board for ${projectName} here. PMW reads this file directly for the overall progress table.`,
    "",
    "## Progress Board",
    "| Phase | Task ID | Task | Status | Notes | Source |",
    "| --- | --- | --- | --- | --- | --- |",
    ...PROGRESS_ROWS.map(
      (row) => `| ${row.phase} | ${row.id} | ${row.task} | ${row.status} | ${row.notes} | ${row.source} |`
    )
  ].join("\n");
}

function updateRequirementsText(text, { projectName, userGoal, opsGoal, approvalGoal, activeProfiles }) {
  let next = replaceSection(
    text,
    "## Summary",
    `이 문서는 ${projectName}가 현재 표준 하네스 baseline 위에서 시작할 때 사용하는 사용자 친화적 기준 문서다. 이 문서는 프로젝트별 요구, 승인 경계, active profile, 핵심 acceptance를 닫는 기준 문서로 유지한다.`
  );
  next = replaceSection(next, "### 사용자 목표", `- ${userGoal}`);
  next = replaceSection(next, "### 운영 목표", `- ${opsGoal}`);
  next = replaceSection(next, "### 승인 목표", `- ${approvalGoal}`);
  next = replaceSection(next, "## Active Profile Selection", renderActiveProfiles(activeProfiles));
  next = replaceSection(next, "## Open Questions", `- Close implementation-critical discovery questions for ${projectName} in PLN-00.`);
  next = replaceSection(next, "## Deferred Items", "- none yet");
  return next;
}

function updateArchitectureText(text, { activeProfiles }) {
  return replaceSection(
    text,
    "## Active Profiles And Exceptions",
    [
      `- Active profiles: ${renderActiveProfilesInline(activeProfiles)}`,
      "- Approved exceptions: none"
    ].join("\n")
  );
}

function updateImplementationPlanText(text, { projectName, currentFocus, activeProfiles }) {
  let next = replaceSection(
    text,
    "## Optional Profile Activation",
    [
      `- Selected profiles at bootstrap: ${renderActiveProfilesInline(activeProfiles)}.`,
      "- `PRF-01`: 내부 운영자/관리자가 dense record grid를 search/filter/sort하며 row action, detail view, bulk operation을 반복 수행하는 제품일 때만 활성화한다.",
      "- `PRF-02`: spreadsheet가 planning, field mapping, backlog, operational source-of-truth의 authoritative input surface일 때만 활성화한다.",
      "- `PRF-03`: transfer boundary가 airgapped이거나 manual-transfer / removable-media / offline bundle handoff가 반복되는 delivery work일 때만 활성화한다."
    ].join("\n")
  );
  next = replaceSection(next, "## Current Iteration", `- ${currentFocus}`);
  next = replaceSection(
    next,
    "## Operator Next Action",
    [
      `- Start PLN-00 deep interview for ${projectName}.`,
      "- Sync `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, and `reference/artifacts/UI_DESIGN.md` only after requirements approval.",
      "- Open the first project packet only after requirements, architecture, and profile selection are aligned."
    ].join("\n")
  );
  return next;
}

function starterArtifactSeed() {
  return [
    {
      artifactId: "requirements",
      path: ".agents/artifacts/REQUIREMENTS.md",
      category: "canonical_doc",
      title: "Requirements",
      sourceRef: ".agents/artifacts/REQUIREMENTS.md"
    },
    {
      artifactId: "architecture",
      path: ".agents/artifacts/ARCHITECTURE_GUIDE.md",
      category: "canonical_doc",
      title: "Architecture Guide",
      sourceRef: ".agents/artifacts/ARCHITECTURE_GUIDE.md"
    },
    {
      artifactId: "implementation-plan",
      path: ".agents/artifacts/IMPLEMENTATION_PLAN.md",
      category: "canonical_doc",
      title: "Implementation Plan",
      sourceRef: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
    },
    {
      artifactId: "project-progress",
      path: ".agents/artifacts/PROJECT_PROGRESS.md",
      category: "canonical_doc",
      title: "Project Progress",
      sourceRef: ".agents/artifacts/PROJECT_PROGRESS.md"
    },
    {
      artifactId: "current-state",
      path: ".agents/artifacts/CURRENT_STATE.md",
      category: "canonical_doc",
      title: "Current State",
      sourceRef: ".agents/artifacts/CURRENT_STATE.md"
    },
    {
      artifactId: "task-list",
      path: ".agents/artifacts/TASK_LIST.md",
      category: "canonical_doc",
      title: "Task List",
      sourceRef: ".agents/artifacts/TASK_LIST.md"
    },
    {
      artifactId: "preventive-memory",
      path: ".agents/artifacts/PREVENTIVE_MEMORY.md",
      category: "canonical_doc",
      title: "Preventive Memory",
      sourceRef: ".agents/artifacts/PREVENTIVE_MEMORY.md"
    },
    {
      artifactId: "ui-design",
      path: "reference/artifacts/UI_DESIGN.md",
      category: "reference_doc",
      title: "UI Design",
      sourceRef: "reference/artifacts/UI_DESIGN.md"
    },
    {
      artifactId: "packet-template",
      path: "reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md",
      category: "reference_doc",
      title: "Work Item Packet Template",
      sourceRef: "reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md"
    }
  ];
}

function defaultNextAction(workItemId, projectName) {
  switch (workItemId) {
    case "PLN-01":
      return `Freeze the ${projectName} requirements baseline after PLN-00.`;
    case "PLN-02":
      return "Sync architecture, implementation, and UI after requirements approval.";
    case "DSG-01":
      return "Lock the rough direction and global behavior contract.";
    case "PKT-01":
      return "Open the first project packet before code.";
    case "DEV-03":
      return "Run validator and generated-doc checks after the first implementation packet changes live truth.";
    case "DEV-04":
      return "Verify PMW and operator-facing read surfaces against the approved baseline.";
    case "DEV-05":
      return "Close environment topology, rollback, and release-readiness checks.";
    default:
      return "Wait for the upstream planning gate to close.";
  }
}

function renderActiveProfiles(activeProfiles) {
  if (activeProfiles.length === 0) {
    return "- none";
  }
  return activeProfiles.map((profile) => `- ${KNOWN_PROFILES[profile].label}`).join("\n");
}

function renderActiveProfilesInline(activeProfiles) {
  if (activeProfiles.length === 0) {
    return "none";
  }
  return activeProfiles.map((profile) => KNOWN_PROFILES[profile].label).join(", ");
}

function updatePackageJson(repoRoot, packageName) {
  const packageJsonPath = path.join(repoRoot, "package.json");
  const packageJson = JSON.parse(readFile(packageJsonPath));
  packageJson.name = packageName;
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, "utf8");
}

function updateFile(repoRoot, relativePath, updater) {
  const filePath = path.join(repoRoot, relativePath);
  fs.writeFileSync(filePath, updater(readFile(filePath)), "utf8");
}

function writeFile(repoRoot, relativePath, content) {
  const filePath = path.join(repoRoot, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${content}\n`, "utf8");
}

function replaceSection(text, heading, body) {
  const escapedHeading = escapeRegExp(heading);
  const pattern = new RegExp(`(${escapedHeading}\\r?\\n)([\\s\\S]*?)(?=\\r?\\n## |\\r?\\n### |$)`);
  if (!pattern.test(text)) {
    throw new Error(`Could not find section: ${heading}`);
  }
  return text.replace(pattern, `$1${body.trim()}\n`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function resetOperatingStateArtifacts(dbPath) {
  ensureRepoLocalHarnessPath(dbPath);
  for (const suffix of ["", "-shm", "-wal"]) {
    fs.rmSync(`${dbPath}${suffix}`, { force: true });
  }
}

function ensureRepoLocalHarnessPath(targetPath) {
  const normalized = path.resolve(targetPath);
  if (!normalized.includes(`${path.sep}.harness${path.sep}`) && !normalized.endsWith(`${path.sep}.harness`)) {
    throw new Error(`Refusing to touch a non-harness path: ${normalized}`);
  }
}

function sanitizePackageName(value) {
  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!normalized) {
    throw new Error("Could not derive a valid package name.");
  }
  return normalized;
}

function requireNonEmpty(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
  return value.trim();
}

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function defaultNow() {
  return new Date().toISOString();
}
