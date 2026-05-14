import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { writeActiveContext } from "../runtime/state/active-context.js";
import { writeGeneratedStateDocs } from "../runtime/state/generate-state-docs.js";
import { seedProfileAwareValidatorFixtures } from "./profile-aware-validator-fixtures.js";

export function writeOpsPacket(
  repoRoot,
  packetPath,
  {
    gateProfile,
    includeManifest,
    readyForCode = "approved",
    packetTitle = "PKT-01 OPS-03 Transition Test",
    workItemTitle = "OPS-03 Harness operation friction reduction",
    manifestMarkers = null
  }
) {
  const readyForCodeApproved = readyForCode === "approved";
  const headerRows = [
    ["Work item", workItemTitle, "Reduce state-sync friction", "draft"],
    [
      "Ready For Code",
      readyForCode,
      readyForCodeApproved ? "User approved implementation" : "Implementation approval pending",
      readyForCodeApproved ? "approved" : "draft"
    ],
    ["Human sync needed", "yes", "Gate behavior changes operator process", "approved"],
    ...(gateProfile ? [["Gate profile", gateProfile, "Contract-level harness operation change", "approved"]] : []),
    ["User-facing impact", "medium", "Operator state and Active Context metadata change", "approved"],
    ["Layer classification", "core", "Reusable harness contract", "approved"],
    ["Active profile dependencies", "none", "No optional profile", "not-needed"],
    ["Profile evidence status", "not-needed", "No optional profile", "not-needed"],
    ["UX archetype status", "approved", "Operator-facing metadata surface is covered by existing context archetype", "approved"],
    ["UX deviation status", "none", "No deviation", "approved"],
    ["Environment topology status", "not-needed", "No deploy/cutover", "not-needed"],
    ["Domain foundation status", "not-needed", "No product data schema", "not-needed"],
    ["Authoritative source intake status", "not-needed", "Uses local packet evidence", "not-needed"],
    ["Shared-source wave status", "not-needed", "No source wave", "not-needed"],
    ["Packet exit gate status", "pending", "Implementation pending", "draft"],
    ["Improvement promotion status", "approved", "OPS-03 promoted from preventive memory", "approved"],
    ["Existing system dependency", "none", "No legacy system", "not-needed"],
    ["New authoritative source impact", "none", "No new external source", "not-needed"],
    ["Risk if started now", "low", "Approval boundary closed", "approved"]
  ];
  const defaultManifestMarkers = [
    `- Ready For Code: ${readyForCode}`,
    "- root: run root targeted and full tests",
    "- standard-template: run starter targeted and full tests",
    "- targeted: gate profile and transition tests",
    "- validator: run harness validator",
    "- active context: regenerate ACTIVE_CONTEXT artifacts",
    "- review closeout: required before packet close"
  ];
  const manifest = includeManifest
    ? [
        "## Verification Manifest",
        ...(manifestMarkers ?? defaultManifestMarkers)
      ].join("\n")
    : "";
  const content = [
    `# ${packetTitle}`,
    "",
    "## Quick Decision Header",
    "| Item | Proposed | Why | Status |",
    "|---|---|---|---|",
    ...headerRows.map((row) => `| ${row.join(" | ")} |`),
    "",
    "## 1. Goal",
    "- Test OPS-03 gate profile behavior.",
    "",
    "## 3. Proposed Scope",
    "- Layer classification: core",
    "- Required reading before code: `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`, this packet",
    "- UX archetype reference: reference/artifacts/PRODUCT_UX_ARCHETYPE.md",
    "- Selected UX archetype: operator-console-context",
    `- Gate profile: ${gateProfile ?? "pending"}`,
    `- Verification manifest: ${includeManifest ? "contract evidence declared" : "pending"}`,
    "",
    manifest
  ].join("\n");
  fs.writeFileSync(path.join(repoRoot, packetPath), content, "utf8");
}

export function seedStandardRepo(repoRoot) {
  fs.mkdirSync(path.join(repoRoot, ".agents", "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "rules"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "runtime", "generated-state-docs"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "skills", "day_start"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "skills", "day_wrap_up"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "workflows"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "reference", "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "reference", "packets"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "reference", "artifacts", "daily"), { recursive: true });

  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "REQUIREMENTS.md"), "# Requirements\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "ARCHITECTURE_GUIDE.md"), "# Architecture\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "IMPLEMENTATION_PLAN.md"), "# Implementation Plan\n\n## Operator Next Action\n- Run DEV-05 tooling.\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "PROJECT_PROGRESS.md"), "# Project Progress\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"), "# Current State\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "PREVENTIVE_MEMORY.md"), "# Preventive Memory\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "rules", "agent_behavior.md"), agentBehaviorGuideFixture(), "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "skills", "day_start", "SKILL.md"), skillBehaviorFixture("Day Start"), "utf8");
  fs.writeFileSync(path.join(repoRoot, ".agents", "skills", "day_wrap_up", "SKILL.md"), skillBehaviorFixture("Day Wrap Up"), "utf8");
  writeWorkflowContractFixtures(repoRoot);
  fs.writeFileSync(path.join(repoRoot, "reference", "artifacts", "UI_DESIGN.md"), "# UI Design\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "artifacts", "SYSTEM_CONTEXT.md"), "# System Context\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "artifacts", "HANDOFF_ARCHIVE.md"), "# Handoff Archive\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "artifacts", "daily", "2026-04-19.md"), "# Daily\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "artifacts", "daily", "2026-04-20.md"), "# Daily\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "reference", "packets", "PKT-01_LEGACY_READ_SURFACE.md"), "# Packet\n", "utf8");
  seedProfileAwareValidatorFixtures(repoRoot);
}

export function writeStateSurfaces({
  store,
  repoRoot,
  validation = { ok: true, cutoverReady: true, findings: [], gateDecision: "pass" }
}) {
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  writeActiveContext({ store, repoRoot, outputDir: repoRoot, validation });
}

export function seedStarterRepo(repoRoot) {
  const starterRoot = detectStarterRoot();
  fs.cpSync(starterRoot, repoRoot, { recursive: true });
  resetCopiedStarterToFreshState(repoRoot);
}

export function createClock(startIso) {
  let offset = 0;
  const base = Date.parse(startIso);
  return () => new Date(base + offset++ * 1000).toISOString();
}

function writeWorkflowContractFixtures(repoRoot) {
  const fixtures = [
    {
      fileName: "deploy.md",
      title: "Deploy Workflow",
      role: "Deployer",
      mustRead: ["`.agents/artifacts/CURRENT_STATE.md`", "`.agents/artifacts/TASK_LIST.md`"]
    },
    {
      fileName: "design.md",
      title: "Design Workflow",
      role: "Designer",
      mustRead: ["`.agents/artifacts/CURRENT_STATE.md`", "`reference/artifacts/UI_DESIGN.md`"]
    },
    {
      fileName: "dev.md",
      title: "Developer Workflow",
      role: "Developer",
      mustRead: ["`.agents/artifacts/CURRENT_STATE.md`", "`.agents/artifacts/TASK_LIST.md`"]
    },
    {
      fileName: "docu.md",
      title: "Documentation Workflow",
      role: "Documenter",
      mustRead: ["`.agents/artifacts/CURRENT_STATE.md`", "`.agents/artifacts/PROJECT_PROGRESS.md`"]
    },
    {
      fileName: "handoff.md",
      title: "Handoff Workflow",
      role: "Handoff Router",
      mustRead: ["`.agents/artifacts/CURRENT_STATE.md`", "`.agents/artifacts/TASK_LIST.md`"]
    },
    {
      fileName: "pm.md",
      title: "Project Manager Workflow",
      role: "Project Manager",
      mustRead: [
        "`.agents/artifacts/CURRENT_STATE.md`",
        "`.agents/artifacts/TASK_LIST.md`",
        "`.agents/artifacts/PROJECT_PROGRESS.md`"
      ]
    },
    {
      fileName: "plan.md",
      title: "Plan Workflow",
      role: "Planner",
      mustRead: [
        "`.agents/artifacts/CURRENT_STATE.md`",
        "`.agents/artifacts/TASK_LIST.md`",
        "`.agents/artifacts/REQUIREMENTS.md`"
      ]
    },
    {
      fileName: "review.md",
      title: "Review Workflow",
      role: "Reviewer",
      mustRead: ["`.agents/artifacts/CURRENT_STATE.md`", "`.agents/artifacts/TASK_LIST.md`"]
    },
    {
      fileName: "test.md",
      title: "Test Workflow",
      role: "Tester",
      mustRead: ["`.agents/artifacts/CURRENT_STATE.md`", "`.agents/artifacts/TASK_LIST.md`"]
    }
  ];

  for (const fixture of fixtures) {
    fs.writeFileSync(
      path.join(repoRoot, ".agents", "workflows", fixture.fileName),
      buildWorkflowContract(fixture),
      "utf8"
    );
  }
}

function buildWorkflowContract({ title, role, mustRead }) {
  return [
    `# ${title}`,
    "",
    "## Role",
    `- ${role}`,
    "",
    "## Mission",
    "- Own the lane-specific work and keep governance state explicit.",
    "",
    "## Behavior Contract",
    "- Apply `.agents/rules/agent_behavior.md` before state-changing work.",
    "- Use `Think Before Coding`, `Simplicity First`, `Surgical Changes`, and `Goal-Driven Execution` as the default execution checks.",
    "- Treat the human-and-Planner-approved project design SSOT as binding; surface conflicts instead of silently resolving them.",
    "",
    "## Authority",
    "- Update artifacts inside the workflow lane after required approvals are present.",
    "",
    "## Non-Authority",
    "- Do not bypass another workflow's required approval gate.",
    "",
    "## Must Read SSOT",
    ...mustRead.map((item) => `- ${item}`),
    "",
    "## Allowed Actions",
    "- Execute the approved lane scope and record evidence.",
    "",
    "## Forbidden Actions",
    "- Do not edit derived generated-state docs manually.",
    "",
    "## Required Outputs",
    "- Updated canonical artifacts and validation evidence.",
    "",
    "## Turn Close Reporting",
    "- Report what was done in this turn.",
    "- Report the next recommended agent workflow.",
    "- Report the next concrete work for that workflow, or `None` if no work remains.",
    "",
    "## Handoff Rules",
    "- Route to the workflow that owns the next unresolved task.",
    "",
    "## Stop Conditions",
    "- Stop when required approval or missing source evidence blocks execution.",
    "",
    "## Escalation Rules",
    "- Ask the user when governance state and requested execution conflict."
  ].join("\n");
}

function agentBehaviorGuideFixture() {
  return [
    "# Agent Behavior Contract",
    "",
    "## Think Before Coding",
    "- Surface assumptions and ambiguity.",
    "",
    "## Simplicity First",
    "- Keep the approved solution small.",
    "",
    "## Surgical Changes",
    "- Change only lines tied to the approved request.",
    "",
    "## Goal-Driven Execution",
    "- Verify against concrete success criteria.",
    "",
    "## Project Design SSOT Precedence",
    "- Developer implements to the approved design.",
    "- Tester verifies against the approved design.",
    "- Reviewer checks evidence and source parity.",
    "- Active Context derived summaries must not become write authority."
  ].join("\n");
}

function skillBehaviorFixture(title) {
  return [
    `# ${title}`,
    "",
    "## Behavior Checks",
    "- Apply `.agents/rules/agent_behavior.md` before recommending non-trivial work.",
    "- Use `Think Before Coding` to surface assumptions.",
    "- Use `Simplicity First` to keep recommendations small.",
    "- Use `Surgical Changes` to avoid unrelated cleanup.",
    "- Use `Goal-Driven Execution` to define concrete checks.",
    "- Treat the approved project design SSOT as binding."
  ].join("\n");
}

function detectStarterRoot() {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
  const nestedStarter = path.join(repoRoot, "standard-template");
  return fs.existsSync(path.join(nestedStarter, "AGENTS.md")) ? nestedStarter : repoRoot;
}

function resetCopiedStarterToFreshState(repoRoot) {
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"),
    "# Current State\n\n## Snapshot\n- Current Stage: not started\n\n## Open Decisions / Blockers\n- Run `INIT_STANDARD_HARNESS.cmd` or `npm run harness:init` before real work begins.\n",
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "artifacts", "TASK_LIST.md"),
    "# Task List\n\n## Active Tasks\n| Task ID | Title | Scope | Owner | Status | Priority | Depends On | Verification |\n|---|---|---|---|---|---|---|---|\n| BOOT-00 | Initialize copied starter | starter bootstrap | project operator | starter_pending | P0 | `INIT_STANDARD_HARNESS.cmd` or `npm run harness:init` | generated docs and validation guidance |\n- Run `INIT_STANDARD_HARNESS.cmd` or `npm run harness:init` before real work begins.\n",
    "utf8"
  );
  for (const suffix of ["", "-shm", "-wal"]) {
    fs.rmSync(path.join(repoRoot, ".harness", `operating_state.sqlite${suffix}`), { force: true });
  }
}
