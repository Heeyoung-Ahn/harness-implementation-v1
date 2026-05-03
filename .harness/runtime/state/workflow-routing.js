import fs from "node:fs";
import path from "node:path";

import { resolveArtifactPath } from "./harness-paths.js";

export const CURRENT_STATE_NEXT_AGENT_SECTION = "## Next Recommended Agent";
export const WORKFLOW_CONTRACT_SECTIONS = [
  "## Role",
  "## Mission",
  "## Authority",
  "## Non-Authority",
  "## Must Read SSOT",
  "## Allowed Actions",
  "## Forbidden Actions",
  "## Required Outputs",
  "## Turn Close Reporting",
  "## Handoff Rules",
  "## Stop Conditions",
  "## Escalation Rules"
];

const HANDOFF_WORKFLOW_ROUTES = [
  { workflow: ".agents/workflows/pm.md", aliases: ["pm", "project manager", "project management", "program manager", "프로젝트 매니저", "프로젝트 관리", "프로젝트관리"] },
  { workflow: ".agents/workflows/test.md", aliases: ["tester", "qa", "test", "테스터", "테스트"] },
  { workflow: ".agents/workflows/dev.md", aliases: ["developer", "implementer", "dev", "coder", "개발자", "구현"] },
  { workflow: ".agents/workflows/design.md", aliases: ["designer", "design", "ux", "ui", "디자이너", "디자인"] },
  { workflow: ".agents/workflows/review.md", aliases: ["reviewer", "review", "리뷰어", "리뷰"] },
  { workflow: ".agents/workflows/deploy.md", aliases: ["deploy", "release", "operator", "배포", "릴리즈"] },
  { workflow: ".agents/workflows/docu.md", aliases: ["documenter", "doc", "closeout", "문서", "정리"] },
  { workflow: ".agents/workflows/handoff.md", aliases: ["handoff", "router", "handover", "인계"] },
  { workflow: ".agents/workflows/plan.md", aliases: ["planner", "maintainer", "planning", "기획", "유지보수"] }
];

export function prioritizeOpenWorkItems(workItems = []) {
  return workItems.filter((workItem) => !isClosedStatus(workItem.status)).sort(compareActiveWorkItems);
}

export function selectActiveWorkItem(workItems = []) {
  return prioritizeOpenWorkItems(workItems)[0] ?? null;
}

export function workflowForOwner(owner) {
  const matchingRoutes = matchingWorkflowRoutesForOwner(owner);
  if (matchingRoutes.length !== 1) {
    return "manual_selection_required";
  }

  return matchingRoutes[0].workflow;
}

export function resolveHandoffExecution({
  repoRoot = process.cwd(),
  workItems = [],
  latestHandoff = null,
  includeWorkflowDetails = false
} = {}) {
  const currentStateNextAgent = resolveCurrentStateNextAgent({ repoRoot });
  const activeWorkItem = selectActiveWorkItem(workItems);
  const owner = activeWorkItem?.owner ?? currentStateNextAgent ?? latestHandoff?.toRole ?? "unassigned";
  const workflow = workflowForOwner(owner);
  const workflowDetailsForStatus = readWorkflowDetails({ repoRoot, workflow });
  const workflowDetails = includeWorkflowDetails ? workflowDetailsForStatus : null;
  const routeStatus = workflow === "manual_selection_required"
    ? "manual_selection_required"
    : workflowDetailsForStatus && !workflowDetailsForStatus.exists
      ? "workflow_missing"
      : workflowDetailsForStatus?.missingSections?.length
        ? "workflow_contract_incomplete"
      : "ready";

  return {
    routeStatus,
    resolvedBy: activeWorkItem?.owner
      ? "active_task_owner"
      : currentStateNextAgent
        ? "current_state_next_agent"
        : latestHandoff?.toRole
          ? "latest_handoff"
          : "unassigned",
    owner,
    workflow,
    currentStateNextAgent,
    task: activeWorkItem
      ? {
          workItemId: activeWorkItem.workItemId,
          title: activeWorkItem.title,
          owner: activeWorkItem.owner ?? "unassigned",
          status: activeWorkItem.status,
          nextAction: activeWorkItem.nextAction ?? "not recorded"
        }
      : null,
    handoff: latestHandoff
      ? {
          createdAt: latestHandoff.createdAt,
          fromRole: latestHandoff.fromRole ?? "unknown",
          toRole: latestHandoff.toRole ?? "unknown",
          summary: latestHandoff.handoffSummary
        }
      : null,
    workflowDetails,
    commandHints: {
      npm: "npm run harness:handoff",
      portable: "HARNESS.cmd handoff"
    }
  };
}

function matchingWorkflowRoutesForOwner(owner) {
  const normalized = normalizeOwnerText(owner);
  if (!normalized) {
    return [];
  }

  return HANDOFF_WORKFLOW_ROUTES.filter((candidate) =>
    candidate.aliases.some((alias) => aliasMatchesOwner(normalized, alias))
  );
}

export function resolveCurrentStateNextAgent({ repoRoot = process.cwd() } = {}) {
  const currentStatePath = resolveArtifactPath(repoRoot, "active");
  if (!fs.existsSync(currentStatePath)) {
    return null;
  }

  const sectionContent = sliceSection(
    fs.readFileSync(currentStatePath, "utf8"),
    CURRENT_STATE_NEXT_AGENT_SECTION
  );
  return extractFirstValue(sectionContent);
}

function readWorkflowDetails({ repoRoot, workflow }) {
  if (!workflow || workflow === "manual_selection_required") {
    return null;
  }

  const workflowPath = path.resolve(path.resolve(repoRoot), workflow);
  if (!fs.existsSync(workflowPath)) {
    return {
      path: workflow,
      exists: false,
      role: null,
      mission: [],
      authority: [],
      nonAuthority: [],
      mustReadSsot: [],
      allowedActions: [],
      forbiddenActions: [],
      requiredOutputs: [],
      turnCloseReporting: [],
      handoffRules: [],
      stopConditions: [],
      escalationRules: [],
      missingSections: [...WORKFLOW_CONTRACT_SECTIONS],
      purpose: [],
      readFirst: [],
      doSteps: [],
      stopWhen: []
    };
  }

  const content = fs.readFileSync(workflowPath, "utf8");
  const mission = extractList(sliceSection(content, "## Mission"));
  const mustReadSsot = extractList(sliceSection(content, "## Must Read SSOT"));
  const allowedActions = extractList(sliceSection(content, "## Allowed Actions"));
  const stopConditions = extractList(sliceSection(content, "## Stop Conditions"));
  const purpose = extractList(sliceSection(content, "## Purpose"));
  const readFirst = extractList(sliceSection(content, "## Read First"));
  const doSteps = extractList(sliceSection(content, "## Do"));
  const stopWhen = extractList(sliceSection(content, "## Stop When"));

  return {
    path: workflow,
    exists: true,
    role: normalizeRoleValue(extractFirstValue(sliceSection(content, "## Role"))),
    mission,
    authority: extractList(sliceSection(content, "## Authority")),
    nonAuthority: extractList(sliceSection(content, "## Non-Authority")),
    mustReadSsot,
    allowedActions,
    forbiddenActions: extractList(sliceSection(content, "## Forbidden Actions")),
    requiredOutputs: extractList(sliceSection(content, "## Required Outputs")),
    turnCloseReporting: extractList(sliceSection(content, "## Turn Close Reporting")),
    handoffRules: extractList(sliceSection(content, "## Handoff Rules")),
    stopConditions,
    escalationRules: extractList(sliceSection(content, "## Escalation Rules")),
    missingSections: findMissingWorkflowContractSections(content),
    purpose: purpose.length ? purpose : mission,
    readFirst: readFirst.length ? readFirst : mustReadSsot,
    doSteps: doSteps.length ? doSteps : allowedActions,
    stopWhen: stopWhen.length ? stopWhen : stopConditions
  };
}

export function findMissingWorkflowContractSections(content) {
  return WORKFLOW_CONTRACT_SECTIONS.filter((sectionHeading) => {
    const sectionContent = sliceSection(content, sectionHeading);
    return !hasContractSectionContent(sectionContent);
  });
}

function sliceSection(content, heading) {
  if (!content) {
    return null;
  }

  const start = content.indexOf(heading);
  if (start === -1) {
    return null;
  }

  const afterStart = content.slice(start + heading.length).trimStart();
  const nextHeadingMatch = afterStart.match(/\n##\s+/);
  if (!nextHeadingMatch) {
    return afterStart.trimEnd();
  }

  return afterStart.slice(0, nextHeadingMatch.index).trimEnd();
}

function extractList(sectionContent) {
  if (!sectionContent) {
    return [];
  }

  return sectionContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

function extractFirstValue(sectionContent) {
  if (!sectionContent) {
    return null;
  }

  for (const rawLine of sectionContent.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("## ")) {
      continue;
    }
    if (line.startsWith("- ")) {
      return line.slice(2).trim();
    }
    return line;
  }

  return null;
}

function hasContractSectionContent(sectionContent) {
  if (!sectionContent) {
    return false;
  }

  return sectionContent
    .split("\n")
    .some((rawLine) => {
      const line = rawLine.trim();
      return line && !line.startsWith("## ");
    });
}

function normalizeRoleValue(value) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  const inlineCodeMatch = trimmed.match(/^`([^`]+)`$/);
  return inlineCodeMatch ? inlineCodeMatch[1] : trimmed;
}

export function isClosedStatus(status) {
  return ["closed", "done", "complete", "completed"].includes(String(status ?? "").toLowerCase());
}

function compareActiveWorkItems(left, right) {
  const leftPriority = statusPriority(left.status);
  const rightPriority = statusPriority(right.status);
  if (leftPriority !== rightPriority) {
    return leftPriority - rightPriority;
  }
  return String(left.workItemId).localeCompare(String(right.workItemId));
}

function statusPriority(status) {
  const normalized = String(status ?? "").toLowerCase();
  if (["in_progress", "active", "implementing"].includes(normalized)) {
    return 0;
  }
  if (["todo", "pending", "planned", "draft"].includes(normalized)) {
    return 1;
  }
  return 2;
}

function normalizeOwnerText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .trim();
}

function aliasMatchesOwner(normalizedOwner, alias) {
  const normalizedAlias = normalizeOwnerText(alias);
  if (!normalizedAlias) {
    return false;
  }

  if (/^[a-z0-9]+$/.test(normalizedAlias)) {
    const escapedAlias = normalizedAlias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^a-z0-9])${escapedAlias}(?=$|[^a-z0-9])`, "u").test(normalizedOwner);
  }

  return normalizedOwner.includes(normalizedAlias);
}
