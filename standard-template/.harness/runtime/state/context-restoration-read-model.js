import fs from "node:fs";
import path from "node:path";

import { validateGeneratedStateDocs } from "./drift-validator.js";
import { CURRENT_STATE_DOC, TASK_LIST_DOC } from "./generate-state-docs.js";
import { resolveGateProfile, summarizeGateProfile } from "./gate-profiles.js";
import { resolveArtifactPath, resolveGeneratedDocReadPath } from "./harness-paths.js";
import { resolveHandoffExecution, workflowForOwner } from "./workflow-routing.js";

export const IMPLEMENTATION_PLAN_DOC = ".agents/artifacts/IMPLEMENTATION_PLAN.md";
export const OPERATOR_NEXT_ACTION_SECTION = "## Operator Next Action";
export const PROJECT_PROGRESS_DOC = ".agents/artifacts/PROJECT_PROGRESS.md";
export const PROJECT_PROGRESS_SECTION = "## Progress Board";

const SURFACE_SECTIONS = {
  decisionRequired: {
    doc: CURRENT_STATE_DOC,
    summaryHeading: "## Decision Required Summary",
    detailHeading: "## Decision Required Detail"
  },
  blockedAtRisk: {
    doc: TASK_LIST_DOC,
    summaryHeading: "## Blocked / At Risk Summary",
    detailHeading: "## Blocked / At Risk Detail"
  },
  currentFocus: {
    doc: CURRENT_STATE_DOC,
    summaryHeading: "## Current Focus Summary",
    detailHeading: "## Current Focus Detail"
  },
  nextAction: {
    doc: IMPLEMENTATION_PLAN_DOC,
    summaryHeading: OPERATOR_NEXT_ACTION_SECTION,
    detailHeading: null
  }
};

const PHASE_ONE_OPERATOR_COMMANDS = [
  {
    id: "status",
    label: "status",
    command: "npm run harness:status",
    launchMode: "pmw_phase1",
    mandatory: true,
    sideEffect: "read_only",
    expectedEffect: "Read the selected project's current stage, gate, focus, assignment, and validation summary.",
    confirmationRequired: false,
    description: "Summarize the selected project's current stage, gate, and focus."
  },
  {
    id: "next",
    label: "next",
    command: "npm run harness:next",
    launchMode: "pmw_phase1",
    mandatory: true,
    sideEffect: "read_only",
    expectedEffect: "Read the selected project's next recommended owner, task, and first action.",
    confirmationRequired: false,
    description: "Show the next recommended action for the selected project."
  },
  {
    id: "explain",
    label: "explain",
    command: "npm run harness:explain",
    launchMode: "pmw_phase1",
    mandatory: true,
    sideEffect: "read_only",
    expectedEffect: "Read the selected project's current blocker and rationale summary.",
    confirmationRequired: false,
    description: "Explain the current state and operator-facing rationale."
  },
  {
    id: "validate",
    label: "validate",
    command: "npm run harness:validate",
    launchMode: "pmw_phase1",
    mandatory: true,
    sideEffect: "validation",
    expectedEffect: "Run diagnostic validation checks and report pass/fail without requiring operator confirmation.",
    confirmationRequired: false,
    description: "Run validator checks against the selected project's current truth surfaces."
  },
  {
    id: "handoff",
    label: "handoff",
    command: "npm run harness:handoff",
    launchMode: "pmw_phase1",
    mandatory: true,
    sideEffect: "workflow_launch",
    expectedEffect: "Resolve the next owner and workflow through the approved handoff routing contract.",
    confirmationRequired: true,
    description: "Launch the next approved workflow for the selected project based on handoff routing."
  },
  {
    id: "pmw-export",
    label: "pmw-export",
    command: "npm run harness:pmw-export",
    launchMode: "pmw_phase1",
    mandatory: true,
    sideEffect: "derived_output",
    expectedEffect: "Regenerate the selected project's PMW manifest and read-model artifacts.",
    confirmationRequired: true,
    description: "Regenerate the selected project's PMW read-model and manifest artifacts."
  }
];

const TERMINAL_ONLY_OPERATOR_COMMANDS = [
  {
    id: "doctor",
    label: "doctor",
    command: "npm run harness:doctor",
    launchMode: "terminal_only",
    mandatory: false,
    sideEffect: "read_only",
    expectedEffect: "Read local environment and operator readiness diagnostics from the selected project terminal.",
    confirmationRequired: false,
    description: "Run environment and operator readiness checks from the selected project's terminal."
  },
  {
    id: "test",
    label: "test",
    command: "npm test",
    launchMode: "terminal_only",
    mandatory: false,
    sideEffect: "verification",
    expectedEffect: "Run the selected project's test suite from a terminal.",
    confirmationRequired: false,
    description: "Run the selected project's test suite from the terminal until PMW command-panel support is added."
  },
  {
    id: "validation-report",
    label: "validation-report",
    command: "npm run harness:validation-report",
    launchMode: "terminal_only",
    mandatory: false,
    sideEffect: "derived_output",
    expectedEffect: "Persist validation evidence from the selected project's terminal.",
    confirmationRequired: true,
    description: "Persist validation evidence from the terminal until PMW command-panel support is added."
  },
  {
    id: "transition",
    label: "transition",
    command: "npm run harness:transition -- --transition <name> --work-item <id>",
    launchMode: "terminal_only",
    mandatory: false,
    sideEffect: "state_transition",
    expectedEffect: "Preview or apply a structured owner/status handoff across SSOT, DB, generated docs, PMW export, validation report, and handoff evidence.",
    confirmationRequired: true,
    description: "Preview state transitions by default; use --apply only after operator review."
  }
];

export function buildContextRestorationReadModel({
  store,
  repoRoot = process.cwd(),
  outputDir = repoRoot,
  validationResult
}) {
  const diagnostics = [];
  const validation = validationResult ?? validateGeneratedStateDocs({ store, outputDir, repoRoot });
  const releaseState = store.getReleaseState("current");
  const decisions = store.listDecisions({ status: "open", decisionNeeded: true });
  const risks = store.listGateRisks({ status: "open" });
  const workItems = store.listWorkItems();
  const latestHandoff = store.listRecentHandoffs(1)[0] ?? null;
  const generationStates = store.listGenerationStates();

  const currentStateContent = readIfExists(resolveGeneratedDocReadPath({ outputDir, docName: CURRENT_STATE_DOC }));
  const taskListContent = readIfExists(resolveGeneratedDocReadPath({ outputDir, docName: TASK_LIST_DOC }));
  const implementationPlanContent = readIfExists(resolveArtifactPath(repoRoot, "plan"));
  const projectProgressContent = readIfExists(resolveArtifactPath(repoRoot, "progress"));

  const decisionSurface = buildDecisionSurface({
    sectionContent: sliceSection(currentStateContent, SURFACE_SECTIONS.decisionRequired.summaryHeading),
    decisions
  });
  const blockedSurface = buildRiskSurface({
    sectionContent: sliceSection(taskListContent, SURFACE_SECTIONS.blockedAtRisk.summaryHeading),
    risks
  });
  const currentFocusSurface = buildCurrentFocusSurface({
    sectionContent: sliceSection(currentStateContent, SURFACE_SECTIONS.currentFocus.summaryHeading),
    releaseState
  });
  const nextActionSurface = buildNextActionSurface({
    sectionContent: sliceSection(implementationPlanContent, SURFACE_SECTIONS.nextAction.summaryHeading),
    workItems,
    diagnostics
  });
  const handoffExecution = resolveHandoffExecution({
    repoRoot,
    workItems,
    latestHandoff,
    includeWorkflowDetails: true
  });
  diagnostics.push(buildHandoffRouteDiagnostic({ handoff: handoffExecution, latestHandoff }));

  return {
    generatedAt: new Date().toISOString(),
    loadOrder: [
      "release_state_and_generation_metadata",
      "open_decisions_gate_risks_and_next_action",
      "recent_handoff_and_designated_summary",
      "source_trace",
      "stale_diagnostics"
    ],
    releaseState: releaseState
      ? {
          currentStage: releaseState.currentStage,
          releaseGateState: releaseState.releaseGateState,
          currentFocus: releaseState.currentFocus,
          releaseGoal: releaseState.releaseGoal,
          sourceRef: releaseState.sourceRef,
          updatedAt: releaseState.updatedAt
        }
      : {
          currentStage: "unknown",
          releaseGateState: "unknown",
          currentFocus: "unknown",
          releaseGoal: "unknown",
          sourceRef: null,
          updatedAt: null
        },
    freshness: buildFreshnessSummary({
      validation,
      generationStates
    }),
    surfaces: {
      decisionRequired: decisionSurface,
      blockedAtRisk: blockedSurface,
      currentFocus: currentFocusSurface,
      nextAction: nextActionSurface
    },
    projectOverviewBand: buildProjectOverviewBand({
      releaseState,
      freshness: validation,
      workItems,
      progressContent: projectProgressContent
    }),
    actionBoard: buildActionBoard({
      repoRoot,
      decisionSurface,
      blockedSurface,
      nextActionSurface,
      workItems,
      handoffExecution
    }),
    reEntryBaton: buildReEntryBaton({
      latestHandoff,
      handoffExecution,
      nextActionSurface,
      workItems
    }),
    gateProfile: buildGateProfileSurface({ repoRoot, workItems }),
    artifactLibrary: buildArtifactLibrary({
      repoRoot,
      releaseState,
      latestHandoff,
      nextActionSurface,
      workItems,
      artifactIndex: store.listArtifacts()
    }),
    operatorCommands: buildOperatorCommands(),
    recentHandoff: buildHandoffSummary(latestHandoff),
    diagnostics: [...validation.findings, ...diagnostics]
  };
}

function buildDecisionSurface({ sectionContent, decisions }) {
  const summaryLines = extractBulletLines(sectionContent);
  return {
    id: "decision_required",
    label: "Decision Required",
    count: decisions.length,
    headline: summaryLines[1] ?? "needs source",
    supportingText:
      summaryLines[0] ?? "Decision Required summary section is missing.",
    status: sectionContent ? "ready" : "needs_source",
    summaryLines,
    items: decisions.map((decision) => ({
      id: decision.decisionId,
      title: decision.title,
      impactSummary: decision.impactSummary,
      dueAt: decision.dueAt,
      noResponseBehavior: decision.noResponseBehavior,
      status: decision.status,
      sourceRef: decision.sourceRef
    })),
    source: {
      path: SURFACE_SECTIONS.decisionRequired.doc,
      summarySection: SURFACE_SECTIONS.decisionRequired.summaryHeading,
      detailSection: SURFACE_SECTIONS.decisionRequired.detailHeading,
      available: Boolean(sectionContent)
    },
    sourceTrace: buildSourceTrace(
      SURFACE_SECTIONS.decisionRequired.doc,
      SURFACE_SECTIONS.decisionRequired.summaryHeading,
      decisions.map((decision) => decision.sourceRef)
    )
  };
}

function buildRiskSurface({ sectionContent, risks }) {
  const summaryLines = extractBulletLines(sectionContent);
  return {
    id: "blocked_at_risk",
    label: "Blocked / At Risk",
    count: risks.length,
    headline: summaryLines[1] ?? "needs source",
    supportingText:
      summaryLines[0] ?? "Blocked / At Risk summary section is missing.",
    status: sectionContent ? "ready" : "needs_source",
    summaryLines,
    items: risks.map((risk) => ({
      id: risk.riskId,
      title: risk.title,
      severity: risk.severity,
      unblockCondition: risk.unblockCondition,
      nextEscalation: risk.nextEscalation,
      status: risk.status,
      sourceRef: risk.sourceRef
    })),
    source: {
      path: SURFACE_SECTIONS.blockedAtRisk.doc,
      summarySection: SURFACE_SECTIONS.blockedAtRisk.summaryHeading,
      detailSection: SURFACE_SECTIONS.blockedAtRisk.detailHeading,
      available: Boolean(sectionContent)
    },
    sourceTrace: buildSourceTrace(
      SURFACE_SECTIONS.blockedAtRisk.doc,
      SURFACE_SECTIONS.blockedAtRisk.summaryHeading,
      risks.map((risk) => risk.sourceRef)
    )
  };
}

function buildCurrentFocusSurface({ sectionContent, releaseState }) {
  const summaryLines = extractBulletLines(sectionContent);
  return {
    id: "current_focus",
    label: "Current Focus",
    count: summaryLines.length > 0 ? 1 : 0,
    headline: summaryLines[0] ?? "needs source",
    supportingText:
      summaryLines[1] ?? (sectionContent ? null : "Current Focus summary section is missing."),
    status: sectionContent ? "ready" : "needs_source",
    summaryLines,
    detail: releaseState
      ? {
          currentStage: releaseState.currentStage,
          releaseGateState: releaseState.releaseGateState,
          releaseGoal: releaseState.releaseGoal,
          currentFocus: releaseState.currentFocus,
          sourceRef: releaseState.sourceRef
        }
      : null,
    source: {
      path: SURFACE_SECTIONS.currentFocus.doc,
      summarySection: SURFACE_SECTIONS.currentFocus.summaryHeading,
      detailSection: SURFACE_SECTIONS.currentFocus.detailHeading,
      available: Boolean(sectionContent)
    },
    sourceTrace: buildSourceTrace(
      SURFACE_SECTIONS.currentFocus.doc,
      SURFACE_SECTIONS.currentFocus.summaryHeading,
      [releaseState?.sourceRef]
    )
  };
}

function buildNextActionSurface({ sectionContent, workItems, diagnostics }) {
  const summaryLines = extractBulletLines(sectionContent);

  if (!sectionContent) {
    diagnostics.push({
      code: "designated_summary_missing",
      severity: "warning",
      surfaceId: "next_action",
      path: IMPLEMENTATION_PLAN_DOC,
      section: OPERATOR_NEXT_ACTION_SECTION,
      message: `${IMPLEMENTATION_PLAN_DOC} is missing required designated section ${OPERATOR_NEXT_ACTION_SECTION}.`
    });
  }

  return {
    id: "next_action",
    label: "Next Action",
    count: summaryLines.length > 0 ? 1 : 0,
    headline: summaryLines[0] ?? "needs source",
    supportingText:
      summaryLines[1] ?? "Operator next action section is missing.",
    status: sectionContent ? "ready" : "needs_source",
    summaryLines,
    items: workItems.map((workItem) => ({
      id: workItem.workItemId,
      title: workItem.title,
      status: workItem.status,
      nextAction: workItem.nextAction,
      owner: workItem.owner,
      sourceRef: workItem.sourceRef
    })),
    source: {
      path: SURFACE_SECTIONS.nextAction.doc,
      summarySection: SURFACE_SECTIONS.nextAction.summaryHeading,
      detailSection: SURFACE_SECTIONS.nextAction.detailHeading,
      available: Boolean(sectionContent)
    },
    sourceTrace: buildSourceTrace(
      SURFACE_SECTIONS.nextAction.doc,
      SURFACE_SECTIONS.nextAction.summaryHeading,
      workItems.map((workItem) => workItem.sourceRef)
    )
  };
}

function buildHandoffSummary(latestHandoff) {
  if (!latestHandoff) {
    return {
      status: "empty",
      headline: "No recent handoff recorded.",
      createdAt: null,
      sourceTrace: []
    };
  }

  return {
    status: "ready",
    headline: latestHandoff.handoffSummary,
    createdAt: latestHandoff.createdAt,
    fromRole: latestHandoff.fromRole,
    toRole: latestHandoff.toRole,
    payload: latestHandoff.payload,
    sourceTrace: buildSourceTrace(null, null, [latestHandoff.sourceRef])
  };
}

function buildHandoffRouteDiagnostic({ handoff, latestHandoff }) {
  const taskLabel = handoff.task
    ? `[${handoff.task.workItemId}] ${handoff.task.title}`
    : "no open task";

  return {
    code: "handoff_route",
    severity: "info",
    owner: handoff.owner,
    workflow: handoff.workflow,
    routeStatus: handoff.routeStatus,
    resolvedBy: handoff.resolvedBy,
    currentStateNextAgent: handoff.currentStateNextAgent,
    taskId: handoff.task?.workItemId ?? null,
    taskTitle: handoff.task?.title ?? null,
    taskStatus: handoff.task?.status ?? null,
    workflowDetailsExists: handoff.workflowDetails?.exists ?? null,
    workflowMissingSections: handoff.workflowDetails?.missingSections ?? [],
    fromRole: latestHandoff?.fromRole ?? null,
    toRole: latestHandoff?.toRole ?? null,
    message: `handoff.md routes to ${handoff.workflow} for ${handoff.owner}: ${taskLabel}.`
  };
}

function buildProjectOverviewBand({ releaseState, freshness, workItems, progressContent }) {
  const progressRows = parseProgressBoardRows(progressContent);
  const openWorkItems = workItems.filter((item) => !isClosedStatus(item.status));
  const doneCount = progressRows.filter((row) => isClosedStatus(row.Status)).length;
  const activeCount = progressRows.filter((row) => !isClosedStatus(row.Status)).length;
  const phaseDetails = Array.from(
    progressRows.reduce((acc, row) => {
      const phase = row.Phase || "Other";
      const current = acc.get(phase) ?? {
        phase,
        total: 0,
        done: 0,
        active: 0,
        completedItems: [],
        remainingItems: []
      };
      const item = {
        taskId: row["Task ID"] || null,
        title: row.Task || "Untitled task",
        status: row.Status || "unknown",
        notes: row.Notes || "",
        source: row.Source || ""
      };
      current.total += 1;
      if (isClosedStatus(row.Status)) {
        current.done += 1;
        current.completedItems.push(item);
      } else {
        current.active += 1;
        current.remainingItems.push(item);
      }
      acc.set(phase, current);
      return acc;
    }, new Map()).values()
  );
  const phaseSummary = phaseDetails.map(({ phase, total, done, active }) => ({
    phase,
    total,
    done,
    active
  }));

  return {
    heading: "Project Overview Band",
    projectGoal: releaseState?.releaseGoal ?? "unknown",
    currentFocus: releaseState?.currentFocus ?? "unknown",
    stage: releaseState?.currentStage ?? "unknown",
    gate: releaseState?.releaseGateState ?? "unknown",
    metrics: {
      totalTracked: progressRows.length,
      done: doneCount,
      active: activeCount,
      openWorkItems: openWorkItems.length,
      freshness: freshness.ok ? "fresh" : "attention"
    },
    phaseSummary,
    phaseDetails,
    sourceTrace: buildSourceTrace(PROJECT_PROGRESS_DOC, PROJECT_PROGRESS_SECTION, [
      releaseState?.sourceRef,
      resolveArtifactPathFallback("progress")
    ])
  };
}

function buildActionBoard({ repoRoot, decisionSurface, blockedSurface, nextActionSurface, workItems, handoffExecution }) {
  const openWorkItems = workItems.filter((item) => !isClosedStatus(item.status));
  const currentTask = openWorkItems[0] ?? null;
  const nextTaskSource = openWorkItems[1] ?? null;

  return {
    heading: "Action Board",
    cards: {
      decisionRequired: {
        label: "Decision Required",
        headline: decisionSurface.headline,
        supportingText: decisionSurface.supportingText,
        count: decisionSurface.count,
        sourceTrace: decisionSurface.sourceTrace
      },
      blockedAtRisk: {
        label: "Blocked / At Risk",
        headline: blockedSurface.headline,
        supportingText: blockedSurface.supportingText,
        count: blockedSurface.count,
        sourceTrace: blockedSurface.sourceTrace
      },
      currentTask: currentTask
        ? {
            label: "Current Task",
            taskId: currentTask.workItemId,
            title: currentTask.title,
            status: currentTask.status,
            owner: currentTask.owner ?? "unassigned",
            workflow: handoffExecution.owner === currentTask.owner ? handoffExecution.workflow : inferWorkflowFromOwner(currentTask.owner),
            summary: currentTask.nextAction ?? "No current-task summary recorded.",
            gateProfile: buildTaskGateProfile({ repoRoot, workItem: currentTask }),
            sourceRef: currentTask.sourceRef
          }
        : {
            label: "Current Task",
            taskId: null,
            title: "No open task",
            status: "empty",
            owner: "unassigned",
            workflow: null,
            summary: "No open work item is currently active.",
            gateProfile: null,
            sourceRef: null
          },
      nextTask: nextTaskSource
        ? {
            label: "Next Task",
            taskId: nextTaskSource.workItemId,
            title: nextTaskSource.title,
            status: nextTaskSource.status,
            owner: nextTaskSource.owner ?? "unassigned",
            workflow: workflowForActionBoardOwner(nextTaskSource.owner),
            gateProfile: buildTaskGateProfile({ repoRoot, workItem: nextTaskSource }),
            summary:
              nextTaskSource.nextAction ??
              nextActionSurface.supportingText ??
              "No next-task summary recorded.",
            sourceRef: nextTaskSource.sourceRef
          }
        : currentTask
          ? {
              label: "Next Task",
              taskId: null,
              title: "Next Lane Step",
              status: "queued",
              owner: handoffExecution.owner ?? currentTask.owner ?? "unassigned",
              workflow: handoffExecution.workflow ?? inferWorkflowFromOwner(currentTask.owner),
              gateProfile: buildTaskGateProfile({ repoRoot, workItem: currentTask }),
              summary:
                currentTask.nextAction ??
                nextActionSurface.supportingText ??
                "No next-task summary recorded.",
              sourceRef: currentTask.sourceRef
            }
        : {
            label: "Next Task",
            taskId: null,
            title: "No routed next task",
            status: "empty",
            owner: handoffExecution.owner ?? "unassigned",
            workflow: handoffExecution.workflow,
            summary: nextActionSurface.headline,
            gateProfile: null,
            sourceRef: null
          }
    }
  };
}

function buildReEntryBaton({ latestHandoff, handoffExecution, nextActionSurface, workItems }) {
  const openWorkItems = workItems.filter((item) => !isClosedStatus(item.status));
  const activeTask = handoffExecution.task ?? openWorkItems[0] ?? null;
  const previousWorkAgent = latestHandoff?.fromRole ?? null;
  const previousWorkSummary =
    latestHandoff?.payload?.completedScope ?? latestHandoff?.handoffSummary ?? null;
  const nextWorkAgent = handoffExecution.owner ?? latestHandoff?.toRole ?? "unassigned";
  const nextWorkSummary =
    latestHandoff?.payload?.nextFirstAction ??
    activeTask?.nextAction ??
    nextActionSurface.supportingText ??
    nextActionSurface.headline;
  return {
    heading: "Re-entry Baton",
    latestHandoff: latestHandoff
      ? {
          headline: latestHandoff.handoffSummary,
          fromRole: latestHandoff.fromRole,
          toRole: latestHandoff.toRole,
          createdAt: latestHandoff.createdAt
        }
      : null,
    previousWorkAgent,
    previousWorkSummary,
    nextWorkAgent,
    nextWorkSummary,
    nextOwner: handoffExecution.owner ?? "unassigned",
    targetWorkflow: handoffExecution.workflow ?? null,
    routeStatus: handoffExecution.routeStatus,
    activeTask: activeTask
      ? {
          taskId: activeTask.workItemId,
          title: activeTask.title
        }
      : null,
    requiredSsot: latestHandoff?.payload?.requiredSsot ?? [],
    pendingApprovals: latestHandoff?.payload?.pendingApprovals ?? [],
    fallbackSummary: nextActionSurface.supportingText ?? nextActionSurface.headline
  };
}

function buildArtifactLibrary({ repoRoot, releaseState, latestHandoff, nextActionSurface, workItems, artifactIndex }) {
  const activeTask = workItems.find((item) => !isClosedStatus(item.status));
  const currentPacketPath = activeTask?.sourceRef?.endsWith(".md") ? activeTask.sourceRef : null;
  const executionTruth = uniqueItems(
    [
      { path: ".agents/artifacts/CURRENT_STATE.md", title: "Current State", kind: "governance" },
      { path: ".agents/artifacts/TASK_LIST.md", title: "Task List", kind: "governance" },
      { path: ".agents/artifacts/IMPLEMENTATION_PLAN.md", title: "Implementation Plan", kind: "governance" },
      { path: PROJECT_PROGRESS_DOC, title: "Project Progress", kind: "governance" }
    ],
    "path"
  );
  const packetItems = uniqueItems(
    [
      ...(currentPacketPath ? [{ path: currentPacketPath, title: path.basename(currentPacketPath, ".md"), kind: "active_packet" }] : []),
      ...artifactIndex
        .filter((artifact) => artifact.category === "task_packet")
        .map((artifact) => ({ path: artifact.path, title: artifact.title, kind: artifact.category }))
    ],
    "path"
  );
  const evidenceItems = uniqueItems(
    [
      ...(latestHandoff?.payload?.requiredSsot ?? []).map((item) => ({
        path: item,
        title: path.basename(item, path.extname(item)),
        kind: "required_ssot"
      })),
      { path: ".agents/artifacts/VALIDATION_REPORT.md", title: "Validation Report", kind: "evidence" },
      { path: ".agents/runtime/generated-state-docs/CURRENT_STATE.md", title: "Generated Current State", kind: "generated" },
      { path: ".agents/runtime/generated-state-docs/TASK_LIST.md", title: "Generated Task List", kind: "generated" }
    ],
    "path"
  );

  return {
    heading: "Artifact Library",
    previewTitle: currentPacketPath ?? ".agents/artifacts/CURRENT_STATE.md",
    groups: [
      { id: "execution_truth", label: "Execution Truth", items: mapArtifactItems(repoRoot, executionTruth) },
      { id: "active_packets", label: "Active Packet And Registered Packets", items: mapArtifactItems(repoRoot, packetItems) },
      { id: "evidence", label: "Evidence And Generated Outputs", items: mapArtifactItems(repoRoot, evidenceItems) }
    ],
    sourceTrace: buildSourceTrace(PROJECT_PROGRESS_DOC, PROJECT_PROGRESS_SECTION, [
      releaseState?.sourceRef,
      nextActionSurface.source?.path
    ])
  };
}

function buildGateProfileSurface({ repoRoot, workItems }) {
  const openWorkItems = workItems.filter((item) => !isClosedStatus(item.status));
  const activeTask = openWorkItems[0] ?? null;
  const activeProfile = buildTaskGateProfile({ repoRoot, workItem: activeTask });
  return {
    heading: "Gate Profile",
    activeTask: activeTask
      ? {
          taskId: activeTask.workItemId,
          title: activeTask.title,
          owner: activeTask.owner ?? "unassigned",
          status: activeTask.status
        }
      : null,
    activeProfile,
    availableProfiles: ["light", "standard", "contract", "release"],
    sourceTrace: activeTask?.sourceRef
      ? [{ kind: "active_task_packet", path: activeTask.sourceRef }]
      : []
  };
}

function buildTaskGateProfile({ repoRoot, workItem }) {
  if (!workItem) {
    return null;
  }
  const metadataProfile = resolveGateProfile(workItem.metadata?.gateProfile);
  const packetProfile = resolveGateProfile(readPacketGateProfile(repoRoot, workItem.sourceRef));
  const profile = metadataProfile ?? packetProfile;
  return profile
    ? {
        ...summarizeGateProfile(profile),
        source: metadataProfile ? "work_item_metadata" : "packet_header"
      }
    : null;
}

function readPacketGateProfile(repoRoot, sourceRef) {
  if (!sourceRef || !sourceRef.endsWith(".md")) {
    return null;
  }
  const packetPath = path.resolve(repoRoot, sourceRef);
  if (!fs.existsSync(packetPath)) {
    return null;
  }
  const content = fs.readFileSync(packetPath, "utf8");
  const row = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => /^\|\s*Gate profile\s*\|/i.test(line));
  return row ? row.split("|")[2]?.trim() : null;
}

function buildFreshnessSummary({ validation, generationStates }) {
  const stale =
    generationStates.some((state) => state.freshnessState !== "fresh") ||
    validation.findings.some((finding) => finding.severity === "error");

  return {
    status: stale ? "stale" : "fresh",
    stale,
    cutoverReady: validation.cutoverReady,
    blockingFindingCount: validation.findings.filter((finding) => finding.severity === "error").length,
    findings: validation.findings,
    generatedDocs: generationStates.map((state) => ({
      projectionName: state.projectionName,
      freshnessState: state.freshnessState,
      generatedAt: state.generatedAt,
      checksum: state.checksum
    }))
  };
}

function buildOperatorCommands() {
  return {
    selectionMode: "selected_project",
    concurrencyPolicy: "one_command_per_project",
    logRetention: "session",
    phaseOneLabel: "PMW Actions",
    terminalOnlyLabel: "Terminal Actions",
    phaseOne: cloneCommandSet(PHASE_ONE_OPERATOR_COMMANDS),
    terminalOnly: cloneCommandSet(TERMINAL_ONLY_OPERATOR_COMMANDS),
    notes: [
      "PMW is a launcher and result-viewer surface, not the canonical write authority.",
      "Terminal-only commands must run from the selected project's repo root."
    ]
  };
}

function cloneCommandSet(commands) {
  return commands.map((command) => ({ ...command }));
}

function mapArtifactItems(repoRoot, items) {
  return items.map((item) => ({
    ...item,
    previewable: fs.existsSync(path.resolve(repoRoot, item.path))
  }));
}

function buildSourceTrace(designatedDoc, summaryHeading, sourceRefs) {
  const trace = [];
  const seen = new Set();

  if (designatedDoc && summaryHeading) {
    const key = `${designatedDoc}#${summaryHeading}`;
    trace.push({
      kind: "designated_summary",
      path: designatedDoc,
      section: summaryHeading
    });
    seen.add(key);
  }

  for (const sourceRef of sourceRefs.filter(Boolean)) {
    const key = `source:${sourceRef}`;
    if (seen.has(key)) {
      continue;
    }
    trace.push({
      kind: "canonical_source",
      path: sourceRef
    });
    seen.add(key);
  }

  return trace;
}

function readIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, "utf8");
}

function sliceSection(content, sectionHeading) {
  if (!content) {
    return null;
  }

  const start = content.indexOf(sectionHeading);
  if (start === -1) {
    return null;
  }

  const afterStart = content.slice(start + sectionHeading.length).trimStart();
  const nextHeadingMatch = afterStart.match(/\n##\s+/);
  if (!nextHeadingMatch) {
    return afterStart.trimEnd();
  }

  return afterStart.slice(0, nextHeadingMatch.index).trimEnd();
}

function extractBulletLines(sectionContent) {
  if (!sectionContent) {
    return [];
  }

  return sectionContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

function parseProgressBoardRows(content) {
  const sectionContent = sliceSection(content, PROJECT_PROGRESS_SECTION);
  if (!sectionContent) {
    return [];
  }

  const tableLines = sectionContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"));
  if (tableLines.length < 3) {
    return [];
  }

  const headers = tableLines[0]
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
  return tableLines
    .slice(2)
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim())
    )
    .map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])));
}

function isClosedStatus(status) {
  const normalized = String(status ?? "").trim().toLowerCase();
  return ["done", "closed", "complete", "completed"].includes(normalized);
}

function inferWorkflowFromOwner(owner) {
  return workflowForActionBoardOwner(owner);
}

function workflowForActionBoardOwner(owner) {
  return owner ? workflowForOwner(owner) : null;
}

function uniqueItems(items, key) {
  const seen = new Set();
  return items.filter((item) => {
    const value = item[key];
    if (!value || seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

function resolveArtifactPathFallback(key) {
  if (key === "progress") {
    return PROJECT_PROGRESS_DOC;
  }
  return null;
}
