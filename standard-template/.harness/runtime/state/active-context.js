import fs from "node:fs";
import path from "node:path";

import { ACTIVE_PROFILES_MARKDOWN, GENERATED_DOCS_DIR, VALIDATION_REPORT_JSON } from "./harness-paths.js";
import { CURRENT_STATE_DOC, TASK_LIST_DOC } from "./generate-state-docs.js";
import { prioritizeOpenWorkItems } from "./workflow-routing.js";

export const ACTIVE_CONTEXT_JSON = ".agents/runtime/ACTIVE_CONTEXT.json";
export const ACTIVE_CONTEXT_MARKDOWN = ".agents/runtime/ACTIVE_CONTEXT.md";

export function writeActiveContext({ store, repoRoot = process.cwd(), outputDir = repoRoot, validation = null } = {}) {
  const root = path.resolve(repoRoot);
  const context = buildActiveContext({ store, repoRoot: root, validation });
  const jsonPath = path.resolve(outputDir, ACTIVE_CONTEXT_JSON);
  const markdownPath = path.resolve(outputDir, ACTIVE_CONTEXT_MARKDOWN);

  writeText(jsonPath, `${JSON.stringify(context, null, 2)}\n`);
  writeText(markdownPath, renderActiveContextMarkdown(context));

  return {
    ok: true,
    command: "context",
    jsonPath,
    markdownPath,
    context
  };
}

export function buildActiveContext({ store, repoRoot = process.cwd(), validation = null } = {}) {
  const root = path.resolve(repoRoot);
  const releaseState = store.getReleaseState("current");
  const workItems = store.listWorkItems();
  const openWorkItems = prioritizeOpenWorkItems(workItems);
  const activeTask = openWorkItems[0] ?? null;
  const latestHandoff = store.listRecentHandoffs(1)[0] ?? null;
  const openDecisions = store.listDecisions({ status: "open", decisionNeeded: true });
  const openRisks = store.listGateRisks({ status: "open" });
  const generatedDocs = store.listGenerationStates();

  return {
    schemaVersion: "standard-harness-active-context/v1",
    generatedAt: new Date().toISOString(),
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
    activeTask: activeTask
      ? {
          workItemId: activeTask.workItemId,
          title: activeTask.title,
          status: activeTask.status,
          owner: activeTask.owner ?? null,
          nextAction: activeTask.nextAction ?? null,
          sourceRef: activeTask.sourceRef ?? null,
          gateProfile: activeTask.metadata?.gateProfile ?? null,
          readyForCode: activeTask.metadata?.readyForCode ?? null
        }
      : null,
    nextWork: {
      owner: activeTask?.owner ?? latestHandoff?.toRole ?? "planner",
      action:
        activeTask?.nextAction ??
        latestHandoff?.payload?.nextFirstAction ??
        "No active task is recorded. Review CURRENT_STATE and TASK_LIST."
    },
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
          nextFirstAction: latestHandoff.payload?.nextFirstAction ?? null
        }
      : null,
    validation: validation
      ? {
          ok: Boolean(validation.ok),
          cutoverReady: Boolean(validation.cutoverReady),
          findingCount: validation.findings?.length ?? 0,
          blockingFindingCount: validation.findings?.filter((item) => item.severity === "error").length ?? 0
        }
      : null,
    generatedDocs: generatedDocs.map((doc) => ({
      projectionName: doc.projectionName,
      generatedAt: doc.generatedAt,
      freshnessState: doc.freshnessState,
      sourceRevision: doc.sourceRevision ?? null
    })),
    sources: {
      currentState: ".agents/artifacts/CURRENT_STATE.md",
      taskList: ".agents/artifacts/TASK_LIST.md",
      implementationPlan: ".agents/artifacts/IMPLEMENTATION_PLAN.md",
      projectProgress: ".agents/artifacts/PROJECT_PROGRESS.md",
      activeProfiles: ACTIVE_PROFILES_MARKDOWN,
      generatedCurrentState: `${GENERATED_DOCS_DIR}/${CURRENT_STATE_DOC}`,
      generatedTaskList: `${GENERATED_DOCS_DIR}/${TASK_LIST_DOC}`,
      validationReport: VALIDATION_REPORT_JSON,
      activePacket: activeTask?.sourceRef ?? releaseState?.sourceRef ?? null
    }
  };
}

function renderActiveContextMarkdown(context) {
  const task = context.activeTask;
  const handoff = context.latestHandoff;
  const validation = context.validation;
  const lines = [
    "# 활성 컨텍스트",
    "",
    "## 현재 작업",
    `- 단계: ${context.release.stage}`,
    `- 게이트: ${context.release.gate}`,
    `- 초점: ${context.release.focus}`,
    task
      ? `- 작업: ${task.workItemId} / ${task.title} / ${task.status} / 담당 ${task.owner ?? "미지정"}`
      : "- 작업: 현재 열린 작업 없음",
    "",
    "## 다음 작업",
    `- 다음 담당: ${context.nextWork.owner}`,
    `- 다음 행동: ${context.nextWork.action}`,
    "",
    "## 결정과 막힘",
    `- 열린 결정: ${context.decisions.length}`,
    `- 열린 막힘/위험: ${context.blockers.length}`,
    "",
    "## 최근 인계",
    handoff
      ? `- ${handoff.createdAt}: ${handoff.fromRole} -> ${handoff.toRole} / ${handoff.summary}`
      : "- 기록 없음",
    "",
    "## 검증 상태",
    validation
      ? `- ${validation.ok ? "통과" : "실패"} (${validation.blockingFindingCount}개 blocking finding)`
      : "- 아직 이 컨텍스트에 검증 결과가 연결되지 않음",
    "",
    "## 출처",
    ...Object.entries(context.sources).map(([key, value]) => `- ${key}: ${value ?? "없음"}`)
  ];

  return `${lines.join("\n")}\n`;
}

function writeText(targetPath, content) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content, "utf8");
}
