import fs from "node:fs";
import path from "node:path";

import {
  ACTIVE_PROFILES_MARKDOWN,
  GENERATED_DOCS_DIR,
  VALIDATION_REPORT_JSON,
  VALIDATION_REPORT_MARKDOWN
} from "./harness-paths.js";
import { CURRENT_STATE_DOC, TASK_LIST_DOC, calculateChecksum } from "./generate-state-docs.js";
import { prioritizeOpenWorkItems, resolveHandoffExecution } from "./workflow-routing.js";

export const ACTIVE_CONTEXT_JSON = ".agents/runtime/ACTIVE_CONTEXT.json";
export const ACTIVE_CONTEXT_MARKDOWN = ".agents/runtime/ACTIVE_CONTEXT.md";

const CURRENT_STATE_PATH = ".agents/artifacts/CURRENT_STATE.md";
const TASK_LIST_PATH = ".agents/artifacts/TASK_LIST.md";
const IMPLEMENTATION_PLAN_PATH = ".agents/artifacts/IMPLEMENTATION_PLAN.md";
const PROJECT_PROGRESS_PATH = ".agents/artifacts/PROJECT_PROGRESS.md";
const PREVENTIVE_MEMORY_PATH = ".agents/artifacts/PREVENTIVE_MEMORY.md";
const ACTIVE_CONTEXT_SCHEMA_VERSION = "standard-harness-active-context/v2";
const COMPATIBILITY_FIRST_READ_PATHS = new Set([CURRENT_STATE_PATH, TASK_LIST_PATH]);

export function writeActiveContext({ store, repoRoot = process.cwd(), outputDir = repoRoot, validation = null } = {}) {
  const root = path.resolve(repoRoot);
  const generationTimestamp =
    store.getLatestOperationalTimestamp() ?? store.getLatestMutationTimestamp() ?? new Date().toISOString();
  const resolvedValidation = resolveValidationSummary({ repoRoot: root, validation });
  const context = buildActiveContext({
    store,
    repoRoot: root,
    validation: resolvedValidation,
    generatedAt: generationTimestamp
  });
  const jsonPath = path.resolve(outputDir, ACTIVE_CONTEXT_JSON);
  const markdownPath = path.resolve(outputDir, ACTIVE_CONTEXT_MARKDOWN);
  const jsonContent = `${JSON.stringify(context, null, 2)}\n`;
  const markdownContent = renderActiveContextMarkdown(context);
  const sourceRevision = store.getLatestOperationalTimestamp() ?? "empty-store";

  writeText(jsonPath, jsonContent);
  writeText(markdownPath, markdownContent);

  store.refreshProjection({
    projectionName: ACTIVE_CONTEXT_JSON,
    checksum: calculateChecksum(jsonContent),
    generatedAt: generationTimestamp,
    sourceRevision,
    freshnessState: "fresh",
    metadata: {
      bytes: Buffer.byteLength(jsonContent, "utf8"),
      lineCount: jsonContent.split("\n").length,
      format: "json",
      contractDigest: context.reentryContract.digest
    }
  });
  store.refreshProjection({
    projectionName: ACTIVE_CONTEXT_MARKDOWN,
    checksum: calculateChecksum(markdownContent),
    generatedAt: generationTimestamp,
    sourceRevision,
    freshnessState: "fresh",
    metadata: {
      bytes: Buffer.byteLength(markdownContent, "utf8"),
      lineCount: markdownContent.split("\n").length,
      format: "markdown",
      contractDigest: context.reentryContract.digest
    }
  });

  return {
    ok: true,
    command: "context",
    jsonPath,
    markdownPath,
    context
  };
}

export function buildActiveContext({
  store,
  repoRoot = process.cwd(),
  validation = null,
  generatedAt = new Date().toISOString()
} = {}) {
  const root = path.resolve(repoRoot);
  const releaseState = store.getReleaseState("current");
  const workItems = store.listWorkItems();
  const openWorkItems = prioritizeOpenWorkItems(workItems, { repoRoot: root });
  const activeTask = openWorkItems[0] ?? null;
  const latestHandoff = store.listRecentHandoffs(1)[0] ?? null;
  const openDecisions = store.listDecisions({ status: "open", decisionNeeded: true });
  const openRisks = store.listGateRisks({ status: "open" });
  const handoffExecution = resolveHandoffExecution({
    repoRoot: root,
    workItems,
    latestHandoff,
    includeWorkflowDetails: true
  });
  const nextWorkflow =
    handoffExecution.routeStatus === "manual_selection_required" ||
    handoffExecution.routeStatus === "planner_fallback_blocked"
      ? null
      : handoffExecution.workflow;
  const latestHandoffPayload = latestHandoff?.payload ?? {};
  const workflowReadFirst = normalizePathList(handoffExecution.workflowDetails?.readFirst ?? []);
  const nextRequiredSsot = uniquePathList(
    stripCompatibilityFirstReadPaths(normalizePathList(latestHandoffPayload.requiredSsot ?? []))
  );
  const nextDoNotCross = normalizeTextList(latestHandoffPayload.doNotCross ?? []);
  const activePacket = activeTask?.sourceRef ?? releaseState?.sourceRef ?? null;
  const mustReadNext = uniquePathList([
    nextWorkflow,
    ...workflowReadFirst,
    ...nextRequiredSsot,
    activePacket,
    VALIDATION_REPORT_JSON
  ]);
  const sourceTrace = uniquePathList([...nextRequiredSsot, activePacket, VALIDATION_REPORT_JSON]);
  const activeTaskSummary = activeTask
    ? {
        workItemId: activeTask.workItemId,
        title: activeTask.title,
        status: activeTask.status,
        owner: activeTask.owner ?? null,
        nextAction: activeTask.nextAction ?? null,
        sourceRef: activeTask.sourceRef ?? null,
        gateProfile: activeTask.metadata?.gateProfile ?? null,
        readyForCode: activeTask.metadata?.readyForCode ?? null,
        workflow: nextWorkflow,
        workflowRouteStatus: handoffExecution.routeStatus
      }
    : null;
  const reentryContract = {
    firstRead: ACTIVE_CONTEXT_JSON,
    fallbackHumanView: ACTIVE_CONTEXT_MARKDOWN,
    nextWorkflow,
    workflowRouteStatus: handoffExecution.routeStatus,
    mustReadNext,
    sourceTrace
  };
  reentryContract.digest = calculateChecksum(JSON.stringify(reentryContract));

  return {
    schemaVersion: ACTIVE_CONTEXT_SCHEMA_VERSION,
    generatedAt,
    project: {
      repoRoot: root,
      name: releaseState?.metadata?.projectName ?? path.basename(root)
    },
    release: {
      stage: releaseState?.currentStage ?? "unknown",
      gate: releaseState?.releaseGateState ?? "unknown",
      focus: releaseState?.currentFocus ?? "unknown",
      goal: releaseState?.releaseGoal ?? "unknown",
      sourceRef: releaseState?.sourceRef ?? null
    },
    selectedLane: activeTaskSummary,
    activeTask: activeTaskSummary,
    nextWork: {
      owner: handoffExecution.owner ?? activeTask?.owner ?? latestHandoff?.toRole ?? "planner",
      workflow: nextWorkflow,
      workflowRouteStatus: handoffExecution.routeStatus,
      resolvedBy: handoffExecution.resolvedBy,
      requiredSsot: nextRequiredSsot,
      approvalBoundary: normalizeTextValue(latestHandoffPayload.approvalBoundary),
      doNotCross: nextDoNotCross,
      action:
        activeTask?.nextAction ??
        latestHandoffPayload.nextFirstAction ??
        "No active task is recorded. Review IMPLEMENTATION_PLAN and the latest handoff."
    },
    reentryContract,
    blockers: openRisks.map((risk) => ({
      riskId: risk.riskId,
      title: risk.title,
      severity: risk.severity,
      unblockCondition: risk.unblockCondition ?? null,
      sourceRef: risk.sourceRef ?? null
    })),
    decisions: openDecisions.map((decision) => ({
      decisionId: decision.decisionId,
      title: decision.title,
      impactSummary: decision.impactSummary,
      sourceRef: decision.sourceRef ?? null
    })),
    latestHandoff: latestHandoff
      ? {
          createdAt: latestHandoff.createdAt,
          fromRole: latestHandoff.fromRole,
          toRole: latestHandoff.toRole,
          summary: latestHandoff.handoffSummary,
          sourceRef: latestHandoff.sourceRef ?? null,
          nextFirstAction: normalizeTextValue(latestHandoffPayload.nextFirstAction),
          requiredSsot: nextRequiredSsot,
          approvalBoundary: normalizeTextValue(latestHandoffPayload.approvalBoundary),
          doNotCross: nextDoNotCross
        }
      : null,
    validation: validation ?? null,
    generatedDocs: store
      .listGenerationStates()
      .filter(
        (doc) =>
          doc.projectionName !== ACTIVE_CONTEXT_JSON &&
          doc.projectionName !== ACTIVE_CONTEXT_MARKDOWN
      )
      .map((doc) => ({
        projectionName: doc.projectionName,
        generatedAt: doc.generatedAt,
        freshnessState: doc.freshnessState,
        sourceRevision: doc.sourceRevision ?? null
      })),
    sources: {
      currentState: CURRENT_STATE_PATH,
      taskList: TASK_LIST_PATH,
      implementationPlan: IMPLEMENTATION_PLAN_PATH,
      projectProgress: PROJECT_PROGRESS_PATH,
      preventiveMemory: PREVENTIVE_MEMORY_PATH,
      activeProfiles: ACTIVE_PROFILES_MARKDOWN,
      generatedCurrentState: `${GENERATED_DOCS_DIR}/${CURRENT_STATE_DOC}`,
      generatedTaskList: `${GENERATED_DOCS_DIR}/${TASK_LIST_DOC}`,
      validationReport: VALIDATION_REPORT_JSON,
      validationReportMarkdown: VALIDATION_REPORT_MARKDOWN,
      workflowContract: nextWorkflow,
      activePacket
    }
  };
}

export function renderActiveContextMarkdown(context) {
  const task = context.selectedLane;
  const handoff = context.latestHandoff;
  const validation = context.validation;
  const lines = [
    "# 활성 컨텍스트",
    "",
    "## 시작 계약",
    `- 첫 AI 재진입 읽기: ${context.reentryContract.firstRead}`,
    `- 사람 확인용 보조 문서: ${context.reentryContract.fallbackHumanView}`,
    "- 문서 성격: generated human fallback view; live write authority는 아님",
    "- 복구 명령: node .harness/runtime/state/dev05-cli.js context --repair",
    `- 다음 workflow: ${context.nextWork.workflow ?? "수동 선택 필요"}`,
    task
      ? `- 선택된 lane: ${task.workItemId} / ${task.status} / 담당 ${task.owner ?? "미지정"}`
      : "- 선택된 lane: 현재 열린 작업 없음",
    `- 계약 digest: ${context.reentryContract.digest}`,
    "",
    "## 현재 작업",
    `- 단계: ${context.release.stage}`,
    `- 게이트: ${context.release.gate}`,
    `- 초점: ${context.release.focus}`,
    `- 목표: ${context.release.goal}`,
    task
      ? `- 작업: ${task.workItemId} / ${task.title} / Ready For Code ${task.readyForCode ?? "미기록"}`
      : "- 작업: 현재 열린 작업 없음",
    "",
    "## 다음 작업",
    `- 다음 담당: ${context.nextWork.owner}`,
    `- 다음 workflow: ${context.nextWork.workflow ?? "수동 선택 필요"}`,
    `- route 상태: ${context.nextWork.workflowRouteStatus}`,
    `- 다음 행동: ${context.nextWork.action}`,
    ...(context.nextWork.requiredSsot?.length
      ? context.nextWork.requiredSsot.map((item) => `- 다음 작업 기준 SSOT: ${item}`)
      : []),
    ...(context.nextWork.approvalBoundary ? [`- 승인 경계: ${context.nextWork.approvalBoundary}`] : []),
    ...(context.nextWork.doNotCross?.length
      ? context.nextWork.doNotCross.map((item) => `- 넘지 말 것: ${item}`)
      : []),
    "",
    "## 먼저 다시 읽을 항목",
    ...(context.reentryContract.mustReadNext.length > 0
      ? context.reentryContract.mustReadNext.map((item) => `- ${item}`)
      : ["- 추가 읽기 항목 없음"]),
    "",
    "## 결정과 막힘",
    ...(context.decisions.length > 0
      ? context.decisions.map((decision) => `- 결정 필요: ${decision.decisionId} / ${decision.title}`)
      : ["- 열린 결정 없음"]),
    ...(context.blockers.length > 0
      ? context.blockers.map((blocker) => `- 막힘: ${blocker.riskId} / ${blocker.severity} / ${blocker.title}`)
      : ["- 열린 막힘 없음"]),
    "",
    "## 최근 인계",
    handoff
      ? `- ${handoff.createdAt}: ${handoff.fromRole} -> ${handoff.toRole} / ${handoff.summary}`
      : "- 기록 없음",
    ...(handoff?.requiredSsot?.length ? handoff.requiredSsot.map((item) => `- 인계 기준 SSOT: ${item}`) : []),
    ...(handoff?.approvalBoundary ? [`- 인계 승인 경계: ${handoff.approvalBoundary}`] : []),
    ...(handoff?.doNotCross?.length ? handoff.doNotCross.map((item) => `- 인계 금지선: ${item}`) : []),
    "",
    "## 검증 상태",
    validation
      ? `- ${validation.ok ? "통과" : "실패"} / gate ${validation.gateDecision ?? (validation.ok ? "pass" : "hold")} / blocking ${validation.blockingFindingCount}개`
      : "- 아직 이 컨텍스트에 검증 결과가 연결되지 않음",
    ...(validation?.executedAt ? [`- 마지막 검증 시각: ${validation.executedAt}`] : []),
    ...(validation?.traceSummary
      ? [
          `- semantic trace: ${validation.traceSummary.workItemId ?? "unknown"} / ${validation.traceSummary.semanticTraceStatus ?? "unknown"} / candidate gates ${validation.traceSummary.candidateGateCount ?? 0}개`
        ]
      : []),
    "",
    "## 출처",
    ...Object.entries(context.sources).map(([key, value]) => `- ${key}: ${value ?? "없음"}`)
  ];

  return `${lines.join("\n")}\n`;
}

export function resolveValidationSummary({ repoRoot, validation }) {
  const inline = summarizeValidation(validation);
  const persisted = readPersistedValidationSummary(repoRoot);
  if (inline && persisted) {
    return {
      ...persisted,
      ...inline,
      executedAt: inline.executedAt ?? persisted.executedAt ?? null,
      traceSummary: inline.traceSummary ?? persisted.traceSummary ?? null,
      candidateGates: inline.candidateGates ?? persisted.candidateGates ?? []
    };
  }
  if (inline) {
    return inline;
  }
  return persisted;
}

function readPersistedValidationSummary(repoRoot) {
  const reportPath = path.resolve(repoRoot, VALIDATION_REPORT_JSON);
  if (!fs.existsSync(reportPath)) {
    return null;
  }

  try {
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    return summarizeValidation(report);
  } catch {
    return null;
  }
}

function summarizeValidation(validation) {
  const resolved = validation?.report ?? validation;
  if (!resolved) {
    return null;
  }

  const findings = Array.isArray(resolved.findings) ? resolved.findings : [];
  const blockingFindingCount =
    resolved.blockingFindingCount ??
    findings.filter((item) => item?.severity === "error").length;
  const findingCount = resolved.findingCount ?? findings.length;
  const gateDecision = resolved.gateDecision ?? (resolved.ok ? "pass" : "hold");

  return {
    ok: Boolean(resolved.ok),
    cutoverReady:
      resolved.cutoverReady != null ? Boolean(resolved.cutoverReady) : gateDecision === "pass",
    findingCount,
    blockingFindingCount,
    gateDecision,
    executedAt: resolved.executedAt ?? resolved.generatedAt ?? null,
    traceSummary: summarizeTraceSummary(resolved.traceSummary),
    candidateGates: Array.isArray(resolved.candidateGates) ? resolved.candidateGates : []
  };
}

function summarizeTraceSummary(traceSummary) {
  if (!traceSummary || typeof traceSummary !== "object") {
    return null;
  }

  return {
    path: typeof traceSummary.path === "string" ? traceSummary.path : null,
    workItemId: typeof traceSummary.workItemId === "string" ? traceSummary.workItemId : null,
    packetId: typeof traceSummary.packetId === "string" ? traceSummary.packetId : null,
    turnClosedAt: typeof traceSummary.turnClosedAt === "string" ? traceSummary.turnClosedAt : null,
    semanticTraceStatus:
      typeof traceSummary.semanticTraceStatus === "string" ? traceSummary.semanticTraceStatus : null,
    warningCount:
      typeof traceSummary.warningCount === "number" ? traceSummary.warningCount : 0,
    candidateGateCount:
      typeof traceSummary.candidateGateCount === "number" ? traceSummary.candidateGateCount : 0
  };
}

function normalizePathList(values) {
  return uniquePathList(values.map(normalizePathValue));
}

function normalizeTextList(values) {
  return uniqueTextList((values ?? []).map(normalizeTextValue));
}

function uniquePathList(values) {
  const seen = new Set();
  const result = [];

  for (const value of values) {
    const normalized = normalizePathValue(value);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

function uniqueTextList(values) {
  const seen = new Set();
  const result = [];

  for (const value of values) {
    const normalized = normalizeTextValue(value);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

function normalizePathValue(value) {
  const text = String(value ?? "").trim();
  if (!text) {
    return null;
  }

  const backtickMatch = text.match(/^`([^`]+)`$/);
  return backtickMatch ? backtickMatch[1].trim() : text;
}

function normalizeTextValue(value) {
  const text = String(value ?? "").trim();
  return text || null;
}

function stripCompatibilityFirstReadPaths(values) {
  const result = [];

  for (const value of values) {
    const normalized = normalizePathValue(value);
    if (!normalized || COMPATIBILITY_FIRST_READ_PATHS.has(normalized)) {
      continue;
    }
    result.push(normalized);
  }

  return uniquePathList(result);
}

function writeText(targetPath, content) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content, "utf8");
}
