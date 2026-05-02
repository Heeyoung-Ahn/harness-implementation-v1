import fs from "node:fs";
import path from "node:path";

import { validateGeneratedStateDocs } from "./drift-validator.js";
import { CURRENT_STATE_DOC, TASK_LIST_DOC, writeGeneratedStateDocs } from "./generate-state-docs.js";
import {
  DEFAULT_GATE_PROFILE_ID,
  GATE_PROFILES,
  resolveGateProfile,
  summarizeGateProfile
} from "./gate-profiles.js";
import {
  ACTIVE_PROFILES_MARKDOWN,
  ARTIFACT_PATHS,
  CUTOVER_REPORT_JSON,
  CUTOVER_REPORT_MARKDOWN,
  GENERATED_DOCS_DIR,
  REPOSITORY_LAYOUT_MARKDOWN,
  VALIDATION_REPORT_JSON,
  VALIDATION_REPORT_MARKDOWN
} from "./harness-paths.js";
import { looksLikeStarterPlaceholder } from "./init-project.js";
import { createOperatingStateStore, DEFAULT_DB_PATH } from "./operating-state-store.js";
import { RELEASE_BASELINE, isInstallableReleaseMaintainerRepo } from "./release-baseline.js";
import { writePmwProjectExport } from "./project-manifest.js";
import { resolveHandoffExecution } from "./workflow-routing.js";

export const STANDARD_PATH_MIGRATIONS = {
  "REQUIREMENTS.md": ARTIFACT_PATHS.requirements,
  "ARCHITECTURE_GUIDE.md": ARTIFACT_PATHS.architecture,
  "IMPLEMENTATION_PLAN.md": ARTIFACT_PATHS.plan,
  "UI_DESIGN.md": ARTIFACT_PATHS.ui,
  "CURRENT_STATE.md": `${GENERATED_DOCS_DIR}/${CURRENT_STATE_DOC}`,
  "TASK_LIST.md": `${GENERATED_DOCS_DIR}/${TASK_LIST_DOC}`,
  "codex/project-context/active-state.md": ARTIFACT_PATHS.active,
  "codex/project-context/preventive-memory.md": ARTIFACT_PATHS.preventive,
  "PKT-01_DEV-01_DB_FOUNDATION.md": "reference/packets/PKT-01_DEV-01_DB_FOUNDATION.md",
  "PKT-01_DEV-02_GENERATED_STATE_DOCS.md": "reference/packets/PKT-01_DEV-02_GENERATED_STATE_DOCS.md",
  "PKT-01_DEV-03_CONTEXT_RESTORATION_READ_MODEL.md": "reference/packets/PKT-01_DEV-03_CONTEXT_RESTORATION_READ_MODEL.md",
  "PKT-01_DEV-04_PMW_READ_SURFACE.md": ARTIFACT_PATHS.packet,
  "PKT-01_WORK_ITEM_PACKET_TEMPLATE.md": "reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md",
  "PLN-00_DEEP_INTERVIEW.md": "reference/planning/PLN-00_DEEP_INTERVIEW.md",
  "PLN-01_REQUIREMENTS_FREEZE.md": "reference/planning/PLN-01_REQUIREMENTS_FREEZE.md",
  "PROTOTYPE_REFERENCE.md": "reference/planning/PROTOTYPE_REFERENCE.md",
  "docs/dev-04-pmw-read-surface-mockup.html": "reference/mockups/dev-04-pmw-read-surface-mockup.html",
  "codex/project-context/durable-context.md": "reference/artifacts/SYSTEM_CONTEXT.md",
  "codex/project-context/restart-handoff-2026-04-19.md": "reference/artifacts/HANDOFF_ARCHIVE.md",
  "codex/project-context/daily/2026-04-19.md": "reference/artifacts/daily/2026-04-19.md",
  "codex/project-context/daily/2026-04-20.md": "reference/artifacts/daily/2026-04-20.md"
};

export function runValidator({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const bootstrapPending = detectStarterBootstrapPending({ repoRoot, store });
    if (bootstrapPending) {
      return {
        ok: false,
        cutoverReady: false,
        findings: [bootstrapPending]
      };
    }
    return validateGeneratedStateDocs({ store, repoRoot, outputDir });
  });
}

export function runDoctor({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const root = path.resolve(repoRoot);
    const validation = runValidator({ repoRoot, outputDir, dbPath });
    const checks = [
      buildCheck("node_runtime", nodeMajor() >= 24, `Node.js ${process.versions.node}`, "Node.js 24+ is required for the harness runtime only."),
      buildCheck("harness_runtime_path", fs.existsSync(path.join(root, ".harness", "runtime")), ".harness/runtime exists", "Harness runtime must live outside product src/test paths."),
      buildCheck("harness_test_path", fs.existsSync(path.join(root, ".harness", "test")), ".harness/test exists", "Harness tests must live outside product test paths."),
      buildCheck("repository_layout_contract", fs.existsSync(path.join(root, REPOSITORY_LAYOUT_MARKDOWN)), REPOSITORY_LAYOUT_MARKDOWN, "Repository layout ownership contract is required."),
      buildCheck("operating_state_db", fs.existsSync(resolveDbPath(repoRoot, dbPath)), resolveDbPath(repoRoot, dbPath), "Repo-local harness DB should exist after initialization."),
      buildCheck("generated_current_state", fs.existsSync(path.join(root, GENERATED_DOCS_DIR, CURRENT_STATE_DOC)), `${GENERATED_DOCS_DIR}/${CURRENT_STATE_DOC}`, "Generated CURRENT_STATE projection should exist."),
      buildCheck("generated_task_list", fs.existsSync(path.join(root, GENERATED_DOCS_DIR, TASK_LIST_DOC)), `${GENERATED_DOCS_DIR}/${TASK_LIST_DOC}`, "Generated TASK_LIST projection should exist."),
      buildCheck("validator", validation.ok, `${validation.findings.length} finding(s)`, "Validator must be clean before gate close.")
    ];
    const failed = checks.filter((check) => check.status === "fail");
    const warned = checks.filter((check) => check.status === "warn");

    return {
      ok: failed.length === 0,
      command: "doctor",
      summary: failed.length === 0 ? "Harness doctor passed." : "Harness doctor found blocking issues.",
      checks,
      validation,
      nextAction: failed[0]?.recovery ?? warned[0]?.recovery ?? recommendNextActionFromState(store, validation, repoRoot)
    };
  });
}

export function buildHarnessStatus({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const validation = runValidator({ repoRoot, outputDir, dbPath });
    const releaseState = store.getReleaseState("current");
    const workItems = store.listWorkItems();
    const latestHandoff = store.listRecentHandoffs(1)[0] ?? null;
    const handoff = resolveHandoffExecution({ repoRoot, workItems, latestHandoff });
    const primaryWorkItem = handoff.task;
    const blockers = store.listGateRisks({ status: "open" });
    const decisions = store.listDecisions({ status: "open", decisionNeeded: true });
    const activeProfiles = readActiveProfileSummary(repoRoot);
    return {
      ok: validation.ok,
      command: "status",
      stage: releaseState?.currentStage ?? "unknown",
      gateState: releaseState?.releaseGateState ?? "unknown",
      focus: releaseState?.currentFocus ?? "unknown",
      releaseGoal: releaseState?.releaseGoal ?? "unknown",
      openWorkItems: workItems.filter((item) => !isClosedStatus(item.status)).length,
      openBlockers: blockers.length,
      openDecisions: decisions.length,
      activeProfiles,
      assignment: primaryWorkItem
        ? {
            workItemId: primaryWorkItem.workItemId,
            title: primaryWorkItem.title,
            status: primaryWorkItem.status,
            owner: primaryWorkItem.owner ?? "unassigned",
            nextAction: primaryWorkItem.nextAction ?? "not recorded"
          }
        : null,
      handoff: handoff.handoff,
      nextOwner: handoff.owner,
      validation: summarizeValidation(validation),
      nextAction: recommendNextActionFromState(store, validation, repoRoot)
    };
  });
}

export function recommendNextAction({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const validation = runValidator({ repoRoot, outputDir, dbPath });
    const workItems = store.listWorkItems();
    const latestHandoff = store.listRecentHandoffs(1)[0] ?? null;
    const handoff = resolveHandoffExecution({ repoRoot, workItems, latestHandoff });
    const primaryWorkItem = handoff.task;
    return {
      ok: validation.ok,
      command: "next",
      nextAction: recommendNextActionFromState(store, validation, repoRoot),
      nextOwner: handoff.owner,
      nextTask: primaryWorkItem
        ? {
            workItemId: primaryWorkItem.workItemId,
            title: primaryWorkItem.title,
            status: primaryWorkItem.status
          }
        : null,
      validation: summarizeValidation(validation)
    };
  });
}

export function resolveHandoff({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const validation = runValidator({ repoRoot, outputDir, dbPath });
    const workItems = store.listWorkItems();
    const latestHandoff = store.listRecentHandoffs(1)[0] ?? null;
    const handoff = resolveHandoffExecution({
      repoRoot,
      workItems,
      latestHandoff,
      includeWorkflowDetails: true
    });

    return {
      ok: handoff.routeStatus === "ready",
      command: "handoff",
      routeStatus: handoff.routeStatus,
      resolvedBy: handoff.resolvedBy,
      nextOwner: handoff.owner,
      workflow: handoff.workflow,
      workflowDetails: handoff.workflowDetails,
      currentStateNextAgent: handoff.currentStateNextAgent,
      nextTask: handoff.task,
      recentHandoff: handoff.handoff,
      commandHints: handoff.commandHints,
      validation: summarizeValidation(validation),
      nextAction: recommendNextActionFromState(store, validation, repoRoot)
    };
  });
}

export function explainCurrentBlockers({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const validation = runValidator({ repoRoot, outputDir, dbPath });
    const blockers = [
      ...validation.findings
        .filter((finding) => finding.severity === "error")
        .map((finding) => ({
          source: "validator",
          code: finding.code,
          message: finding.message,
          recovery: recoveryForFinding(finding)
        })),
      ...store.listGateRisks({ status: "open" }).map((risk) => ({
        source: "gate_risk_registry",
        code: risk.riskId,
        message: risk.title,
        recovery: risk.unblockCondition ?? risk.nextEscalation ?? "Resolve the recorded gate risk."
      }))
    ];

    return {
      ok: blockers.length === 0,
      command: "explain",
      summary: blockers.length === 0 ? "No current blocker is recorded." : `${blockers.length} blocker(s) require attention.`,
      blockers,
      nextAction: blockers[0]?.recovery ?? recommendNextActionFromState(store, validation, repoRoot)
    };
  });
}

export function writeValidationReport({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  const status = buildHarnessStatus({ repoRoot, outputDir, dbPath });
  const validation = runValidator({ repoRoot, outputDir, dbPath });
  const root = path.resolve(repoRoot);
  const markdownPath = path.resolve(root, VALIDATION_REPORT_MARKDOWN);
  const jsonPath = path.resolve(root, VALIDATION_REPORT_JSON);
  const report = {
    ok: validation.ok,
    command: "validation-report",
    validatorVersion: RELEASE_BASELINE.validatorVersion,
    executedAt: new Date().toISOString(),
    profileSummary: status.activeProfiles,
    findings: validation.findings,
    nextAction: status.nextAction,
    gateDecision: validation.ok ? "pass" : "hold"
  };

  fs.mkdirSync(path.dirname(markdownPath), { recursive: true });
  fs.writeFileSync(markdownPath, buildValidationReportMarkdown(report), "utf8");
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  return {
    ok: validation.ok,
    command: "validation-report",
    markdownPath,
    jsonPath,
    report
  };
}

export function runTransition({
  repoRoot = process.cwd(),
  outputDir = repoRoot,
  dbPath = DEFAULT_DB_PATH,
  args = []
} = {}) {
  const options = parseTransitionArgs(args);
  if (!options.apply) {
    return withStore({ dbPath, repoRoot }, (store) => buildTransitionPlan({ store, repoRoot, options }));
  }

  const applied = withStore({ dbPath, repoRoot }, (store) => {
    const plan = buildTransitionPlan({ store, repoRoot, options });
    if (!plan.ok) {
      return plan;
    }
    return applyTransitionPlan({ store, repoRoot, outputDir, plan, options });
  });

  if (!applied.ok) {
    return applied;
  }

  const validationReport = writeValidationReport({ repoRoot, outputDir, dbPath });
  const validationReportSummary = {
    ok: validationReport.ok,
    markdownPath: validationReport.markdownPath,
    jsonPath: validationReport.jsonPath,
    gateDecision: validationReport.report.gateDecision,
    findingCount: validationReport.report.findings.length
  };

  return {
    ...applied,
    ok: validationReport.ok,
    errors: validationReport.ok
      ? applied.errors
      : [
          ...(applied.errors ?? []),
          "Transition apply completed, but validation report failed; do not treat this handoff as clean."
        ],
    validationReport: validationReportSummary
  };
}

function parseTransitionArgs(args) {
  const options = { apply: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--apply") {
      options.apply = true;
      continue;
    }
    if (!arg.startsWith("--")) {
      if (!options.transition) {
        options.transition = arg;
      }
      continue;
    }

    const key = arg.slice(2).replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    const next = args[index + 1];
    if (next == null || next.startsWith("--")) {
      options[key] = true;
      continue;
    }
    options[key] = next;
    index += 1;
  }
  return options;
}

function buildTransitionPlan({ store, repoRoot, options }) {
  const transitionDefaults = transitionDefaultsFor(options.transition);
  const transition = options.transition ?? transitionDefaults.transition;
  const workItemId = options.workItem ?? options.workItemId;
  const errors = [];
  const workItem = workItemId ? store.getWorkItem(workItemId) : null;
  const releaseState = store.getReleaseState("current");
  const fromOwner = normalizeOwner(options.from ?? transitionDefaults.from ?? workItem?.owner);
  const toOwner = normalizeOwner(options.to ?? transitionDefaults.to);
  const status = options.status ?? transitionDefaults.status ?? workItem?.status ?? "in_progress";
  const sourceRef = options.sourceRef ?? workItem?.sourceRef ?? releaseState?.sourceRef ?? ".agents/artifacts/TASK_LIST.md";
  const gateProfile = resolveTransitionGateProfile({ options, workItem, repoRoot });
  const packetReadyForCode = readPacketReadyForCode(repoRoot, sourceRef);
  const closeDecisions = parseListOption(options.closeDecision ?? options.closeDecisions);
  const openReadyForCodeDecision = workItem ? findOpenReadyForCodeTransitionDecision(store, workItem) : null;
  const summary =
    options.summary ??
    transitionDefaults.summary ??
    `${workItemId ?? "work item"} transition ${fromOwner ?? "unknown"} -> ${toOwner ?? "unassigned"}`;
  const nextAction =
    options.nextAction ??
    transitionDefaults.nextAction ??
    workItem?.nextAction ??
    `Continue ${workItemId ?? "the current work item"} as ${toOwner ?? "the next owner"}.`;

  if (!workItemId) {
    errors.push("Missing --work-item.");
  }
  if (!workItem) {
    errors.push(`Cannot transition missing work item: ${workItemId ?? "unknown"}.`);
  }
  if (!toOwner) {
    errors.push("Missing --to or named transition target owner.");
  }
  if (fromOwner && workItem?.owner && normalizeOwner(workItem.owner) !== fromOwner) {
    errors.push(`Transition source owner mismatch: expected ${fromOwner}, current owner is ${workItem.owner}.`);
  }
  if (gateProfile == null) {
    errors.push(
      `Invalid gate profile ${options.gateProfile ?? workItem?.metadata?.gateProfile ?? "not declared"}. Expected one of ${Object.keys(GATE_PROFILES).join(", ")}.`
    );
  }
  if (sourceRef && !fs.existsSync(path.resolve(repoRoot, sourceRef))) {
    errors.push(`Transition source_ref does not exist: ${sourceRef}.`);
  }
  if (transition === "planner-to-developer" && packetReadyForCode !== "approved") {
    errors.push(
      `planner-to-developer requires ${workItemId ?? "the work item"} packet Ready For Code approved; current packet status is ${packetReadyForCode || "missing"}.`
    );
  }
  if (
    transition === "planner-to-developer" &&
    openReadyForCodeDecision &&
    !closeDecisions.includes(openReadyForCodeDecision.decisionId)
  ) {
    errors.push(
      `planner-to-developer requires closing Ready For Code decision ${openReadyForCodeDecision.decisionId} with --close-decision before Developer handoff.`
    );
  }

  const ok = errors.length === 0;
  return {
    ok,
    command: "transition",
    apply: false,
    transition,
    workItemId: workItemId ?? null,
    fromOwner,
    toOwner,
    status,
    gateProfile: gateProfile?.id ?? null,
    readyForCode: packetReadyForCode,
    gateProfileSummary: summarizeGateProfile(gateProfile),
    summary,
    nextAction,
    sourceRef,
    closeDecisions,
    currentStage: options.currentStage ?? transitionDefaults.currentStage ?? releaseState?.currentStage ?? null,
    currentFocus: options.currentFocus ?? transitionDefaults.currentFocus ?? releaseState?.currentFocus ?? null,
    releaseGateState: options.releaseGate ?? options.releaseGateState ?? releaseState?.releaseGateState ?? null,
    plannedUpdates: [
      ".agents/artifacts/TASK_LIST.md",
      ".agents/artifacts/CURRENT_STATE.md",
      ".agents/artifacts/IMPLEMENTATION_PLAN.md",
      ".harness/operating_state.sqlite",
      ".agents/runtime/generated-state-docs/CURRENT_STATE.md",
      ".agents/runtime/generated-state-docs/TASK_LIST.md",
      ".agents/runtime/project-manifest.json",
      ".agents/runtime/pmw-read-model.json",
      ".agents/artifacts/VALIDATION_REPORT.md",
      ".agents/artifacts/VALIDATION_REPORT.json"
    ],
    errors
  };
}

function transitionDefaultsFor(transition = "custom") {
  const transitions = {
    "planner-to-developer": {
      transition: "planner-to-developer",
      from: "planner",
      to: "developer",
      status: "in_progress",
      currentStage: "implementation",
      summary: "Planning approved; implementation can proceed.",
      nextAction: "Implement the approved packet scope and hand off to Tester."
    },
    "developer-to-tester": {
      transition: "developer-to-tester",
      from: "developer",
      to: "tester",
      status: "review",
      currentStage: "verification",
      summary: "Developer implementation completed; Tester should verify the approved scope.",
      nextAction: "Verify the implementation against the packet acceptance criteria."
    },
    "tester-to-reviewer": {
      transition: "tester-to-reviewer",
      from: "tester",
      to: "reviewer",
      status: "review",
      currentStage: "review",
      summary: "Tester verification completed; Reviewer should assess packet exit readiness.",
      nextAction: "Review implementation, evidence, residual debt, and closeout readiness."
    },
    "reviewer-to-planner": {
      transition: "reviewer-to-planner",
      from: "reviewer",
      to: "planner",
      status: "planning",
      currentStage: "planning",
      summary: "Packet exit approved; Planner should choose or refine the next lane.",
      nextAction: "Plan the next approved lane or close remaining planning decisions."
    }
  };
  return transitions[transition] ?? { transition: transition ?? "custom" };
}

function applyTransitionPlan({ store, repoRoot, outputDir, plan, options }) {
  const timestamp = new Date().toISOString();
  const metadata = {
    ...(store.getWorkItem(plan.workItemId)?.metadata ?? {}),
    gateProfile: plan.gateProfile,
    ...(plan.readyForCode === "approved" ? { readyForCode: "approved" } : {}),
    lastTransition: {
      transition: plan.transition,
      fromOwner: plan.fromOwner,
      toOwner: plan.toOwner,
      appliedAt: timestamp
    }
  };

  store.transitionWorkItem({
    workItemId: plan.workItemId,
    owner: plan.toOwner,
    status: plan.status,
    nextAction: plan.nextAction,
    sourceRef: plan.sourceRef,
    metadata
  });

  const releaseState = store.getReleaseState("current");
  if (releaseState) {
    store.setReleaseState({
      currentStage: plan.currentStage ?? releaseState.currentStage,
      releaseGateState: plan.releaseGateState ?? releaseState.releaseGateState,
      currentFocus: plan.currentFocus ?? releaseState.currentFocus,
      releaseGoal: releaseState.releaseGoal,
      sourceRef: plan.sourceRef ?? releaseState.sourceRef,
      updatedBy: "harness:transition",
      metadata: {
        ...(releaseState.metadata ?? {}),
        lastTransition: metadata.lastTransition
      }
    });
  }

  for (const decisionId of plan.closeDecisions) {
    const decision = store.getDecision(decisionId);
    if (!decision) {
      continue;
    }
    store.recordDecision({
      ...decision,
      decisionNeeded: false,
      status: "closed"
    });
  }

  const handoff = store.appendHandoff({
    handoffId: buildTransitionHandoffId(plan, timestamp),
    handoffSummary: `[${plan.fromOwner ?? "unknown"} -> ${plan.toOwner}] ${plan.summary}`,
    fromRole: plan.fromOwner,
    toRole: plan.toOwner,
    sourceRef: plan.sourceRef,
    payload: {
      transition: plan.transition,
      workItemId: plan.workItemId,
      gateProfile: plan.gateProfile,
      completedScope: plan.summary,
      nextFirstAction: plan.nextAction,
      requiredSsot: [
        ".agents/artifacts/CURRENT_STATE.md",
        ".agents/artifacts/TASK_LIST.md",
        ".agents/artifacts/IMPLEMENTATION_PLAN.md",
        plan.sourceRef
      ].filter(Boolean)
    }
  });

  updateCanonicalTaskList({ repoRoot, plan, timestamp });
  updateCanonicalCurrentState({ repoRoot, plan, timestamp });
  updateCanonicalImplementationPlan({ repoRoot, plan });
  const generatedDocs = writeGeneratedStateDocs({ store, outputDir });
  const pmwExport = writePmwProjectExport({ store, repoRoot, outputDir });

  return {
    ...plan,
    ok: true,
    apply: true,
    appliedAt: timestamp,
    handoff,
    generatedDocs,
    pmwExport: {
      manifestPath: pmwExport.manifestPath,
      readModelPath: pmwExport.readModelPath
    }
  };
}

function resolveTransitionGateProfile({ options, workItem, repoRoot }) {
  const explicit = resolveGateProfile(options.gateProfile);
  if (explicit) {
    return explicit;
  }
  const metadataProfile = resolveGateProfile(workItem?.metadata?.gateProfile);
  if (metadataProfile) {
    return metadataProfile;
  }
  const packetProfile = resolveGateProfile(readPacketGateProfile(repoRoot, workItem?.sourceRef));
  return packetProfile ?? resolveGateProfile(DEFAULT_GATE_PROFILE_ID);
}

function readPacketGateProfile(repoRoot, sourceRef) {
  return readPacketHeaderValue(repoRoot, sourceRef, "Gate profile");
}

function readPacketReadyForCode(repoRoot, sourceRef) {
  const value = normalizePacketHeaderValue(readPacketHeaderValue(repoRoot, sourceRef, "Ready For Code"));
  return value === "approved" || value === "approve" ? "approved" : value;
}

function findOpenReadyForCodeTransitionDecision(store, workItem) {
  return store.listDecisions({ status: "open", decisionNeeded: true }).find((decision) => {
    const sameSource = decision.sourceRef === workItem.sourceRef;
    const decisionText = `${decision.decisionId ?? ""} ${decision.title ?? ""}`.toLowerCase();
    return sameSource && decisionText.includes("ready for code");
  });
}

function readPacketHeaderValue(repoRoot, sourceRef, label) {
  if (!sourceRef || !sourceRef.endsWith(".md")) {
    return null;
  }
  const packetPath = path.resolve(repoRoot, sourceRef);
  if (!fs.existsSync(packetPath)) {
    return null;
  }
  const content = fs.readFileSync(packetPath, "utf8");
  const target = label.trim().toLowerCase();
  const row = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.toLowerCase().startsWith(`| ${target} |`) || new RegExp(`^\\|\\s*${escapeRegExp(target)}\\s*\\|`, "i").test(line));
  return row ? row.split("|")[2]?.trim() : null;
}

function normalizePacketHeaderValue(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, "-");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTransitionHandoffId(plan, timestamp) {
  const compactTime = timestamp.replace(/[-:.TZ]/g, "").slice(0, 14);
  return `${String(plan.workItemId).toLowerCase()}-${plan.transition}-${compactTime}`;
}

function updateCanonicalTaskList({ repoRoot, plan, timestamp }) {
  const taskListPath = path.resolve(repoRoot, ".agents/artifacts/TASK_LIST.md");
  if (!fs.existsSync(taskListPath)) {
    return;
  }
  let content = fs.readFileSync(taskListPath, "utf8");
  content = updateMarkdownTableRow(content, "## Active Locks", "Task ID", plan.workItemId, {
    Owner: plan.toOwner,
    Status: "active",
    Notes: `${plan.transition}; gate ${plan.gateProfile}; ${plan.nextAction}`
  });
  content = updateMarkdownTableRow(content, "## Active Tasks", "Task ID", plan.workItemId, {
    Owner: plan.toOwner,
    Status: plan.status,
    Verification: `gate ${plan.gateProfile}; ${plan.nextAction}`
  });
  content = prependSectionBullet(
    content,
    "## Handoff Log",
    `- ${timestamp.slice(0, 10)}: [${plan.fromOwner ?? "unknown"} -> ${plan.toOwner}] ${plan.summary} | ${plan.nextAction}`
  );
  content = replaceBulletValue(content, "- Next first action:", plan.nextAction);
  fs.writeFileSync(taskListPath, content, "utf8");
}

function updateCanonicalCurrentState({ repoRoot, plan, timestamp }) {
  const currentStatePath = path.resolve(repoRoot, ".agents/artifacts/CURRENT_STATE.md");
  if (!fs.existsSync(currentStatePath)) {
    return;
  }
  let content = fs.readFileSync(currentStatePath, "utf8");
  content = replaceBulletValue(content, "- Current Stage:", plan.currentStage);
  content = replaceBulletValue(content, "- Current Focus:", plan.currentFocus);
  content = replaceSectionFirstBullet(content, "## Next Recommended Agent", titleCaseOwner(plan.toOwner));
  content = replaceOrPrependSectionBulletContaining(
    content,
    "## Open Decisions / Blockers",
    `\`${plan.workItemId}`,
    buildCurrentWorkItemStateBullet(plan)
  );
  content = prependSectionBullet(
    content,
    "## Latest Handoff Summary",
    `- ${timestamp.slice(0, 10)}: \`[${plan.fromOwner ?? "unknown"} -> ${plan.toOwner}] ${plan.summary}\``
  );
  fs.writeFileSync(currentStatePath, content, "utf8");
}

function updateCanonicalImplementationPlan({ repoRoot, plan }) {
  const implementationPlanPath = path.resolve(repoRoot, ".agents/artifacts/IMPLEMENTATION_PLAN.md");
  if (!fs.existsSync(implementationPlanPath)) {
    return;
  }
  let content = fs.readFileSync(implementationPlanPath, "utf8");
  content = replaceSectionBullets(content, "## Operator Next Action", [
    `- \`${plan.workItemId}\` active handoff is \`${plan.fromOwner ?? "unknown"} -> ${plan.toOwner}\`.`,
    `- ${plan.nextAction}`,
    `- Source packet: \`${plan.sourceRef}\`.`,
    "- Preserve packet-before-code, PMW read-only authority, generated-doc immutability, root/starter sync, Tester/Reviewer separation, and human approval gates."
  ]);
  fs.writeFileSync(implementationPlanPath, content, "utf8");
}

function buildCurrentWorkItemStateBullet(plan) {
  const approvalText = plan.readyForCode === "approved"
    ? "Ready For Code is approved"
    : `Ready For Code status is ${plan.readyForCode ?? "unknown"}`;
  return `- \`${plan.workItemId}\` ${approvalText}; active handoff is \`${plan.fromOwner ?? "unknown"} -> ${plan.toOwner}\`. ${plan.nextAction}`;
}

function updateMarkdownTableRow(content, sectionHeading, keyColumn, keyValue, updates) {
  const range = findSectionRange(content, sectionHeading);
  if (!range) {
    return content;
  }
  const section = content.slice(range.start, range.end);
  const lines = section.split(/\r?\n/);
  const tableStart = lines.findIndex((line) => line.trim().startsWith("|"));
  if (tableStart === -1 || !lines[tableStart + 1]?.includes("---")) {
    return content;
  }
  const headers = parseTableCells(lines[tableStart]);
  const keyIndex = headers.indexOf(keyColumn);
  if (keyIndex === -1) {
    return content;
  }
  for (let index = tableStart + 2; index < lines.length; index += 1) {
    if (!lines[index].trim().startsWith("|")) {
      break;
    }
    const cells = parseTableCells(lines[index]);
    if (cells[keyIndex] !== keyValue) {
      continue;
    }
    const nextCells = headers.map((header, cellIndex) => updates[header] ?? cells[cellIndex] ?? "");
    lines[index] = `| ${nextCells.map(escapeMarkdownCell).join(" | ")} |`;
    const updatedSection = lines.join("\n");
    return `${content.slice(0, range.start)}${updatedSection}${content.slice(range.end)}`;
  }
  return content;
}

function prependSectionBullet(content, sectionHeading, bullet) {
  const start = content.indexOf(sectionHeading);
  if (start === -1 || content.includes(bullet)) {
    return content;
  }
  const insertAt = content.indexOf("\n", start);
  if (insertAt === -1) {
    return `${content}\n${bullet}\n`;
  }
  return `${content.slice(0, insertAt + 1)}${bullet}\n${content.slice(insertAt + 1)}`;
}

function replaceBulletValue(content, prefix, value) {
  if (!value) {
    return content;
  }
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^${escaped}.*$`, "m");
  return pattern.test(content) ? content.replace(pattern, `${prefix} ${value}`) : content;
}

function replaceSectionFirstBullet(content, sectionHeading, value) {
  if (!value) {
    return content;
  }
  const range = findSectionRange(content, sectionHeading);
  if (!range) {
    return content;
  }
  const section = content.slice(range.start, range.end);
  const updatedSection = section.replace(/^-\s+.*$/m, `- ${value}`);
  return `${content.slice(0, range.start)}${updatedSection}${content.slice(range.end)}`;
}

function replaceOrPrependSectionBulletContaining(content, sectionHeading, needle, bullet) {
  const range = findSectionRange(content, sectionHeading);
  if (!range || !needle || !bullet) {
    return content;
  }
  const section = content.slice(range.start, range.end);
  const lines = section.split(/\r?\n/);
  const existingIndex = lines.findIndex((line) => line.trim().startsWith("- ") && line.includes(needle));

  if (existingIndex !== -1) {
    lines[existingIndex] = bullet;
  } else {
    const headingIndex = lines.findIndex((line) => line.trim() === sectionHeading);
    lines.splice(headingIndex === -1 ? 1 : headingIndex + 1, 0, bullet);
  }

  return `${content.slice(0, range.start)}${lines.join("\n")}${content.slice(range.end)}`;
}

function replaceSectionBullets(content, sectionHeading, bullets) {
  const range = findSectionRange(content, sectionHeading);
  if (!range) {
    return `${content.trimEnd()}\n\n${sectionHeading}\n${bullets.join("\n")}\n`;
  }
  return `${content.slice(0, range.start)}${sectionHeading}\n${bullets.join("\n")}\n${content.slice(range.end)}`;
}

function findSectionRange(content, sectionHeading) {
  const start = content.indexOf(sectionHeading);
  if (start === -1) {
    return null;
  }
  const after = content.slice(start + sectionHeading.length);
  const next = after.match(/\n##\s+/);
  return {
    start,
    end: next ? start + sectionHeading.length + next.index : content.length
  };
}

function parseTableCells(line) {
  return line.split("|").slice(1, -1).map((cell) => cell.trim());
}

function escapeMarkdownCell(value) {
  return String(value ?? "").replaceAll("|", "\\|");
}

function parseListOption(value) {
  if (!value || value === true) {
    return [];
  }
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeOwner(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized || null;
}

function titleCaseOwner(value) {
  const normalized = String(value ?? "").trim();
  return normalized ? normalized[0].toUpperCase() + normalized.slice(1) : null;
}

export function buildMigrationPreview({ repoRoot = process.cwd(), dbPath = DEFAULT_DB_PATH } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const changes = collectPathChanges(store);
    return {
      ok: true,
      repoRoot: path.resolve(repoRoot),
      dbPath: resolveDbPath(repoRoot, dbPath),
      changeCount: changes.length,
      changes
    };
  });
}

export function applyMigration({ repoRoot = process.cwd(), dbPath = DEFAULT_DB_PATH, appliedBy = "dev05-tooling" } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const changes = collectPathChanges(store);
    if (changes.length === 0) {
      return {
        ok: true,
        applied: 0,
        changes: []
      };
    }

    const timestamp = new Date().toISOString();
    const db = store.db;

    for (const change of changes) {
      if (change.table === "handoff_log") {
        db.prepare(`UPDATE handoff_log SET ${change.field} = ? WHERE handoff_id = ?`)
          .run(change.to, change.rowId);
        continue;
      }

      db.prepare(
        `UPDATE ${change.table}
            SET ${change.field} = ?, version = ?, updated_at = ?
          WHERE ${change.idColumn} = ?`
      ).run(change.to, change.nextVersion, timestamp, change.rowId);
    }

    return {
      ok: true,
      applied: changes.length,
      appliedBy,
      changes
    };
  });
}

export function runCutoverPreflight({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  return withStore({ dbPath, repoRoot }, (store) => {
    const bootstrapPending = detectStarterBootstrapPending({ repoRoot, store });
    if (bootstrapPending) {
      return {
        ok: false,
        cutoverReady: false,
        validator: {
          ok: false,
          cutoverReady: false,
          findings: [bootstrapPending]
        },
        migrationPreview: {
          ok: true,
          repoRoot: path.resolve(repoRoot),
          dbPath: resolveDbPath(repoRoot, dbPath),
          changeCount: 0,
          changes: []
        },
        rollbackBundle: buildRollbackBundle({ repoRoot, dbPath }),
        blockers: [
          {
            code: bootstrapPending.code,
            message: bootstrapPending.message
          }
        ]
      };
    }

    const validator = validateGeneratedStateDocs({ store, repoRoot, outputDir });
    const migrationPreview = {
      ok: true,
      repoRoot: path.resolve(repoRoot),
      dbPath: resolveDbPath(repoRoot, dbPath),
      changes: collectPathChanges(store)
    };
    migrationPreview.changeCount = migrationPreview.changes.length;
    const rollbackBundle = buildRollbackBundle({ repoRoot, dbPath });

    const blockers = [
      ...validator.findings
        .filter((finding) => finding.severity === "error")
        .map((finding) => ({
          code: finding.code,
          message: finding.message
        })),
      ...migrationPreview.changes.map((change) => ({
        code: "migration_change_pending",
        message: `${change.table}:${change.rowId} ${change.field} still points to ${change.from}.`
      })),
      ...rollbackBundle.missingPaths.map((item) => ({
        code: "rollback_bundle_missing",
        message: `Rollback bundle is missing ${item.kind}: ${item.path}.`
      }))
    ];

    return {
      ok: blockers.length === 0,
      cutoverReady: blockers.length === 0,
      validator,
      migrationPreview,
      rollbackBundle,
      blockers
    };
  });
}

export function writeCutoverReport({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH } = {}) {
  const preflight = runCutoverPreflight({ repoRoot, outputDir, dbPath });
  const root = path.resolve(repoRoot);
  const markdownPath = path.resolve(root, CUTOVER_REPORT_MARKDOWN);
  const jsonPath = path.resolve(root, CUTOVER_REPORT_JSON);

  fs.mkdirSync(path.dirname(markdownPath), { recursive: true });
  fs.writeFileSync(markdownPath, buildCutoverReportMarkdown(preflight), "utf8");
  fs.writeFileSync(jsonPath, `${JSON.stringify(preflight, null, 2)}
`, "utf8");

  return {
    ok: preflight.ok,
    cutoverReady: preflight.cutoverReady,
    markdownPath,
    jsonPath,
    preflight
  };
}

function withStore({ dbPath, repoRoot }, callback) {
  const store = createOperatingStateStore({ dbPath: resolveDbPath(repoRoot, dbPath) });
  try {
    return callback(store);
  } finally {
    store.close();
  }
}

function collectPathChanges(store) {
  const changes = [];
  const releaseState = store.getReleaseState("current");
  if (releaseState) {
    collectSingleFieldChange(changes, {
      table: "release_state",
      rowId: releaseState.releaseId,
      idColumn: "release_id",
      field: "source_ref",
      value: releaseState.sourceRef,
      version: releaseState.version
    });
  }

  for (const row of store.listWorkItems()) {
    collectSingleFieldChange(changes, {
      table: "work_item_registry",
      rowId: row.workItemId,
      idColumn: "work_item_id",
      field: "source_ref",
      value: row.sourceRef,
      version: row.version
    });
  }

  for (const row of store.listDecisions()) {
    collectSingleFieldChange(changes, {
      table: "decision_registry",
      rowId: row.decisionId,
      idColumn: "decision_id",
      field: "source_ref",
      value: row.sourceRef,
      version: row.version
    });
  }

  for (const row of store.listGateRisks()) {
    collectSingleFieldChange(changes, {
      table: "gate_risk_registry",
      rowId: row.riskId,
      idColumn: "risk_id",
      field: "source_ref",
      value: row.sourceRef,
      version: row.version
    });
  }

  for (const row of store.listRecentHandoffs(200)) {
    collectSingleFieldChange(changes, {
      table: "handoff_log",
      rowId: row.handoffId,
      idColumn: "handoff_id",
      field: "source_ref",
      value: row.sourceRef,
      version: null
    });
  }

  for (const row of store.listArtifacts()) {
    collectSingleFieldChange(changes, {
      table: "artifact_index",
      rowId: row.artifactId,
      idColumn: "artifact_id",
      field: "path",
      value: row.path,
      version: row.version
    });
    collectSingleFieldChange(changes, {
      table: "artifact_index",
      rowId: row.artifactId,
      idColumn: "artifact_id",
      field: "source_ref",
      value: row.sourceRef,
      version: row.version
    });
  }

  return changes;
}

function collectSingleFieldChange(changes, { table, rowId, idColumn, field, value, version }) {
  if (!value) {
    return;
  }
  const to = STANDARD_PATH_MIGRATIONS[value];
  if (!to || to === value) {
    return;
  }
  changes.push({
    table,
    rowId,
    idColumn,
    field,
    from: value,
    to,
    nextVersion: version == null ? null : version + 1
  });
}

function buildRollbackBundle({ repoRoot, dbPath }) {
  const root = path.resolve(repoRoot);
  const dbPathResolved = resolveDbPath(repoRoot, dbPath);
  const generatedDocs = [
    path.resolve(root, GENERATED_DOCS_DIR, CURRENT_STATE_DOC),
    path.resolve(root, GENERATED_DOCS_DIR, TASK_LIST_DOC)
  ];
  const liveArtifacts = [
    path.resolve(root, ARTIFACT_PATHS.requirements),
    path.resolve(root, ARTIFACT_PATHS.architecture),
    path.resolve(root, ARTIFACT_PATHS.plan),
    path.resolve(root, ARTIFACT_PATHS.progress),
    path.resolve(root, ARTIFACT_PATHS.active),
    path.resolve(root, ARTIFACT_PATHS.preventive)
  ];
  const missingPaths = [
    { kind: "db", path: dbPathResolved },
    ...generatedDocs.map((item) => ({ kind: "generated doc", path: item })),
    ...liveArtifacts.map((item) => ({ kind: "live artifact", path: item }))
  ].filter((item) => !fs.existsSync(item.path));

  return {
    dbPath: dbPathResolved,
    generatedDocs,
    liveArtifacts,
    missingPaths,
    needsOperatorBackup: missingPaths.length > 0
  };
}

function buildCutoverReportMarkdown(preflight) {
  const lines = [
    "# Cutover Precheck",
    "",
    "## Summary",
    preflight.cutoverReady
      ? "The standardized harness is cutover-ready for the current repo snapshot."
      : "The standardized harness is not cutover-ready for the current repo snapshot.",
    "",
    "## Result",
    `- Ready: ${preflight.cutoverReady ? "yes" : "no"}`,
    `- Validator ok: ${preflight.validator.ok ? "yes" : "no"}`,
    `- Migration preview changes: ${preflight.migrationPreview.changeCount}`,
    `- Blocker count: ${preflight.blockers.length}`,
    "",
    "## Validator Findings"
  ];

  const findings = preflight.validator.findings?.length
    ? preflight.validator.findings.map((finding) => `- [${finding.severity}] ${finding.code}: ${finding.message}`)
    : ["- none"];
  lines.push(...findings, "", "## Migration Preview");

  const changes = preflight.migrationPreview.changes?.length
    ? preflight.migrationPreview.changes.map((change) => `- ${change.table}:${change.rowId} ${change.field} -> ${change.to}`)
    : ["- no pending path normalization changes"];
  lines.push(...changes, "", "## Blockers");

  const blockers = preflight.blockers.length
    ? preflight.blockers.map((blocker) => `- ${blocker.code}: ${blocker.message}`)
    : ["- none"];
  lines.push(...blockers, "", "## Rollback Bundle");

  lines.push(
    `- DB: ${preflight.rollbackBundle.dbPath}`,
    ...preflight.rollbackBundle.generatedDocs.map((item) => `- Generated doc: ${item}`),
    ...preflight.rollbackBundle.liveArtifacts.map((item) => `- Live artifact: ${item}`)
  );

  if (preflight.rollbackBundle.needsOperatorBackup) {
    lines.push(
      "- needs operator backup: yes",
      ...preflight.rollbackBundle.missingPaths.map((item) => `- Missing ${item.kind}: ${item.path}`)
    );
  } else {
    lines.push("- needs operator backup: no");
  }

  return `${lines.join("\n")}\n`;
}

function nodeMajor() {
  return Number.parseInt((process.versions.node ?? "0").split(".")[0], 10);
}

function buildCheck(code, passed, detail, recovery) {
  return {
    code,
    status: passed ? "pass" : "fail",
    detail,
    recovery
  };
}

function summarizeValidation(validation) {
  return {
    ok: validation.ok,
    cutoverReady: validation.cutoverReady,
    findingCount: validation.findings.length,
    blockingFindingCount: validation.findings.filter((finding) => finding.severity === "error").length
  };
}

function recommendNextActionFromState(store, validation, repoRoot = process.cwd()) {
  const firstError = validation.findings.find((finding) => finding.severity === "error");
  if (firstError) {
    return recoveryForFinding(firstError);
  }

  const firstRisk = store.listGateRisks({ status: "open" })[0];
  if (firstRisk) {
    return firstRisk.unblockCondition ?? firstRisk.nextEscalation ?? `Resolve ${firstRisk.riskId}.`;
  }

  const firstDecision = store.listDecisions({ status: "open", decisionNeeded: true })[0];
  if (firstDecision) {
    return `Close decision ${firstDecision.decisionId}: ${firstDecision.title}.`;
  }

  const releaseState = store.getReleaseState("current");
  if (isClosedStatus(releaseState?.currentStage)) {
    if (isInstallableReleaseMaintainerRepo(repoRoot)) {
      return RELEASE_BASELINE.closedNextAction;
    }
    return "The current release is closed. Review the latest handoff and open the next approved lane.";
  }

  const activeWork = store.listWorkItems().find((item) => !isClosedStatus(item.status));
  if (activeWork?.nextAction) {
    return activeWork.nextAction;
  }

  return "No blocker is recorded. Continue with the current approved packet or open the next planning lane.";
}

function isClosedStatus(status) {
  return ["closed", "done", "complete"].includes(String(status ?? "").toLowerCase());
}

function recoveryForFinding(finding) {
  const code = finding.code ?? "unknown";
  if (code === "starter_bootstrap_pending") {
    return "Run INIT_STANDARD_HARNESS.cmd or npm run harness:init.";
  }
  if (code.includes("generation") || code.includes("checksum") || code.includes("freshness")) {
    return "Regenerate state docs, then run harness:validate again.";
  }
  if (code.includes("task_packet")) {
    return "Update or register the concrete task packet, then rerun validation.";
  }
  if (code.includes("optional_profile") || code.includes("active_profile")) {
    return "Complete active profile references/evidence before Ready For Code.";
  }
  if (code.includes("sync")) {
    return "Synchronize the reusable root change into standard-template.";
  }
  return finding.message ?? "Inspect validator output and resolve the blocking finding.";
}

function readActiveProfileSummary(repoRoot) {
  const activeProfilePath = path.resolve(repoRoot, ACTIVE_PROFILES_MARKDOWN);
  if (!fs.existsSync(activeProfilePath)) {
    return {
      path: ACTIVE_PROFILES_MARKDOWN,
      status: "not_declared",
      profiles: []
    };
  }

  const content = fs.readFileSync(activeProfilePath, "utf8");
  const profiles = content
    .split("\n")
    .filter((line) => line.trim().startsWith("| PRF-"))
    .map((line) => {
      const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
      return {
        profileId: cells[0],
        reason: cells[1],
        evidenceStatus: cells[3],
        appliesToPackets: cells[6]
      };
    });

  return {
    path: ACTIVE_PROFILES_MARKDOWN,
    status: profiles.length > 0 ? "declared" : "empty",
    profiles
  };
}

function buildValidationReportMarkdown(report) {
  const lines = [
    "# Validation Report",
    "",
    "## Summary",
    `- Executed at: ${report.executedAt}`,
    `- Validator version: ${report.validatorVersion}`,
    `- Gate decision: ${report.gateDecision}`,
    `- Next action: ${report.nextAction}`,
    "",
    "## Active Profiles",
    `- Source: ${report.profileSummary.path}`,
    `- Status: ${report.profileSummary.status}`
  ];

  if (report.profileSummary.profiles.length === 0) {
    lines.push("- Profiles: none");
  } else {
    for (const profile of report.profileSummary.profiles) {
      lines.push(`- ${profile.profileId}: ${profile.evidenceStatus} (${profile.reason})`);
    }
  }

  lines.push("", "## Findings");
  if (report.findings.length === 0) {
    lines.push("- none");
  } else {
    for (const finding of report.findings) {
      lines.push(`- [${finding.severity}] ${finding.code}: ${finding.message}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

function resolveDbPath(repoRoot, dbPath) {
  return path.isAbsolute(dbPath) ? dbPath : path.resolve(repoRoot, dbPath);
}

function detectStarterBootstrapPending({ repoRoot, store }) {
  const root = path.resolve(repoRoot);
  if (!looksLikeStarterPlaceholder(root)) {
    return null;
  }

  const hasOperationalState =
    store.getReleaseState("current") != null ||
    store.listWorkItems().length > 0 ||
    store.listDecisions().length > 0 ||
    store.listGateRisks().length > 0 ||
    store.listGenerationStates().length > 0;

  if (hasOperationalState) {
    return null;
  }

  return {
    code: "starter_bootstrap_pending",
    severity: "error",
    message: "Standard harness starter has not been initialized yet. Run INIT_STANDARD_HARNESS.cmd or npm run harness:init first."
  };
}
