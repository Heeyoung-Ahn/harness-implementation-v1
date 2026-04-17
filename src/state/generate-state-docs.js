import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { GENERATED_DOCS } from "./operating-state-store.js";

export const CURRENT_STATE_DOC = "CURRENT_STATE.md";
export const TASK_LIST_DOC = "TASK_LIST.md";

export function writeGeneratedStateDocs({
  store,
  outputDir = process.cwd(),
  sourceRevision
}) {
  const generationTimestamp = maxIsoTimestamp([
    new Date().toISOString(),
    store.getLatestOperationalTimestamp()
  ]);
  const currentStateDoc = buildCurrentStateDoc(store);
  const taskListDoc = buildTaskListDoc(store);
  const docs = [
    { name: CURRENT_STATE_DOC, content: currentStateDoc },
    { name: TASK_LIST_DOC, content: taskListDoc }
  ];

  for (const doc of docs) {
    const targetPath = path.resolve(outputDir, doc.name);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, doc.content, "utf8");
    store.refreshProjection({
      projectionName: doc.name,
      checksum: calculateChecksum(doc.content),
      generatedAt: generationTimestamp,
      sourceRevision: sourceRevision ?? buildSourceRevision(store),
      freshnessState: "fresh",
      metadata: {
        bytes: Buffer.byteLength(doc.content, "utf8"),
        lineCount: doc.content.split("\n").length
      }
    });
  }

  return {
    docs: docs.map((doc) => ({
      name: doc.name,
      checksum: calculateChecksum(doc.content),
      path: path.resolve(outputDir, doc.name)
    }))
  };
}

export function buildCurrentStateDoc(store) {
  const releaseState = store.getReleaseState("current");
  const openDecisions = store.listDecisions({ status: "open", decisionNeeded: true });
  const generatedAt = new Date().toISOString();

  return [
    "# CURRENT_STATE",
    "",
    "## Technical Facts",
    `- Release stage: ${releaseState?.currentStage ?? "unknown"}`,
    `- Release gate state: ${releaseState?.releaseGateState ?? "unknown"}`,
    `- Release goal: ${releaseState?.releaseGoal ?? "unknown"}`,
    `- Generated at: ${generatedAt}`,
    "",
    "## Current Focus Summary",
    `- ${releaseState?.currentFocus ?? "No current focus has been recorded."}`,
    "",
    "## Current Focus Detail",
    `- Stage: ${releaseState?.currentStage ?? "unknown"}`,
    `- Gate state: ${releaseState?.releaseGateState ?? "unknown"}`,
    `- Goal: ${releaseState?.releaseGoal ?? "unknown"}`,
    `- Focus: ${releaseState?.currentFocus ?? "No current focus has been recorded."}`,
    `- Source: ${releaseState?.sourceRef ?? "needs source"}`,
    "",
    "## Decision Required Summary",
    `- ${formatCount(openDecisions.length, "open decision")} require attention.`,
    `- ${openDecisions[0]?.title ?? "No open decision requires attention."}`,
    "",
    "## Decision Required Detail",
    renderDecisionTable(openDecisions),
    "",
    "## Generation Metadata",
    `- Generated docs: ${GENERATED_DOCS.join(", ")}`,
    `- Source revision: ${buildSourceRevision(store)}`,
    `- Sync status: fresh at generation time`
  ].join("\n");
}

export function buildTaskListDoc(store) {
  const openRisks = store.listGateRisks({ status: "open" });
  const workItems = store.listWorkItems();
  const handoffs = store.listRecentHandoffs(10);
  const generatedAt = new Date().toISOString();

  return [
    "# TASK_LIST",
    "",
    "## Technical Facts",
    `- Open work items: ${workItems.length}`,
    `- Open blocked or at-risk items: ${openRisks.length}`,
    `- Recent handoffs captured: ${handoffs.length}`,
    `- Generated at: ${generatedAt}`,
    "",
    "## Blocked / At Risk Summary",
    `- ${formatCount(openRisks.length, "open blocker or risk")} require attention.`,
    `- ${openRisks[0]?.title ?? "No blocking or at-risk item is open."}`,
    "",
    "## Blocked / At Risk Detail",
    renderRiskTable(openRisks),
    "",
    "## Work Item Detail",
    renderWorkItemTable(workItems),
    "",
    "## Handoff Log",
    renderHandoffList(handoffs),
    "",
    "## Generation Metadata",
    `- Generated docs: ${GENERATED_DOCS.join(", ")}`,
    `- Source revision: ${buildSourceRevision(store)}`,
    `- Sync status: fresh at generation time`
  ].join("\n");
}

export function calculateChecksum(content) {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

function buildSourceRevision(store) {
  return store.getLatestMutationTimestamp() ?? "empty-store";
}

function maxIsoTimestamp(values) {
  return values.filter(Boolean).sort().at(-1);
}

function formatCount(count, noun) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function renderDecisionTable(openDecisions) {
  if (openDecisions.length === 0) {
    return "| ID | Title | Impact | Source |\n|---|---|---|---|\n| - | None | No open decision | needs source |";
  }

  return [
    "| ID | Title | Impact | Source |",
    "|---|---|---|---|",
    ...openDecisions.map(
      (item) =>
        `| ${item.decisionId} | ${escapeCell(item.title)} | ${escapeCell(item.impactSummary)} | ${item.sourceRef ?? "needs source"} |`
    )
  ].join("\n");
}

function renderRiskTable(openRisks) {
  if (openRisks.length === 0) {
    return "| ID | Title | Severity | Source |\n|---|---|---|---|\n| - | None | none | needs source |";
  }

  return [
    "| ID | Title | Severity | Source |",
    "|---|---|---|---|",
    ...openRisks.map(
      (item) =>
        `| ${item.riskId} | ${escapeCell(item.title)} | ${item.severity} | ${item.sourceRef ?? "needs source"} |`
    )
  ].join("\n");
}

function renderWorkItemTable(workItems) {
  if (workItems.length === 0) {
    return "| ID | Title | Status | Next Action |\n|---|---|---|---|\n| - | None | idle | Nothing scheduled |";
  }

  return [
    "| ID | Title | Status | Next Action |",
    "|---|---|---|---|",
    ...workItems.map(
      (item) =>
        `| ${item.workItemId} | ${escapeCell(item.title)} | ${item.status} | ${escapeCell(item.nextAction ?? "None")} |`
    )
  ].join("\n");
}

function renderHandoffList(handoffs) {
  if (handoffs.length === 0) {
    return "- No handoff has been recorded.";
  }

  return handoffs.map((item) => `- ${item.createdAt}: ${item.handoffSummary}`).join("\n");
}

function escapeCell(value) {
  return String(value).replaceAll("|", "\\|");
}
