import fs from "node:fs";
import path from "node:path";

import { writeActiveContext } from "./active-context.js";
import { inspectTaskPacketContract, validateGeneratedStateDocs } from "./drift-validator.js";
import { CURRENT_STATE_DOC, TASK_LIST_DOC, writeGeneratedStateDocs } from "./generate-state-docs.js";
import {
  DEFAULT_GATE_PROFILE_ID,
  GATE_PROFILES,
  resolveGateProfile,
  summarizeGateProfile
} from "./gate-profiles.js";
import {
  AGENT_TRACES_DIR,
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
import {
  isCanonicallyClosedWorkItem,
  isClosedStatus,
  readCanonicalTaskLifecycleHints,
  resolveHandoffExecution,
  selectActiveWorkItem,
  workflowForOwner
} from "./workflow-routing.js";

const AGENT_TRACE_SCHEMA_VERSION = "standard-harness-agent-trace/v1";
const PHASE1_HARD_FAIL_CODES = [
  "missing_required_evidence",
  "broken_source_reference",
  "contradictory_evidence",
  "stale_evidence",
  "required_semantic_trace_missing",
  "validation_report_context_parity_break",
  "active_context_validation_executed_at_mismatch"
];
const PHASE1_WARNING_CODES = ["evidence_linkage_thin", "reviewer_rationale_thin"];
const RISK_CLASS_ORDER = {
  low: 1,
  normal: 2,
  high: 3
};
const PHASE1_REVIEWER_ONLY_CODES = [
  "design_intent_fulfillment",
  "work_fit_assessment",
  "domain_specific_business_rule_judgment"
];
const PHASE1_CANDIDATE_GATES = [
  {
    id: "required-evidence-present",
    phase: "candidate-only",
    description: "Required evidence artifacts exist for the active work item."
  },
  {
    id: "source-references-resolve",
    phase: "candidate-only",
    description: "Referenced packet, SSOT, validation, and trace sources resolve locally."
  },
  {
    id: "semantic-trace-present",
    phase: "candidate-only",
    description: "A lightweight semantic trace artifact exists for the active work item."
  },
  {
    id: "evidence-non-contradictory",
    phase: "candidate-only",
    description: "Trace, packet, and active work metadata do not contradict each other."
  },
  {
    id: "evidence-freshness",
    phase: "candidate-only",
    description: "Validation and trace timestamps match the current report turn."
  },
  {
    id: "validation-context-parity",
    phase: "candidate-only",
    description: "Validation report and ACTIVE_CONTEXT expose the same validation summary."
  }
];
const SECURITY_REVIEW_PACKAGE_MANIFEST_PATHS = [
  "package.json",
  "standard-template/package.json"
];
const SECURITY_REVIEW_RELEASE_ARTIFACT_PATHS = [
  "installer/install-harness.js",
  "installer/INSTALL_HARNESS.cmd",
  "packaging/build-release-package.js",
  "packaging/build-windows-exe-installers.js",
  "reference/manuals/HARNESS_MANUAL.md",
  "standard-template/AGENTS.md",
  "standard-template/README.md",
  "standard-template/START_HERE.md",
  "standard-template/reference/manuals/HARNESS_MANUAL.md",
  "standard-template/INIT_STANDARD_HARNESS.cmd"
];
const SECURITY_REVIEW_RELEASE_SCRIPTS = ["package:release", "package:windows-exe"];
const SECURITY_REVIEW_SECRET_RULES = [
  {
    code: "secret_scan_private_key_detected",
    severity: "error",
    pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
    message: "Private key material was detected in a release-facing file.",
    recovery: "Remove the private key material from the release-facing file before internal review."
  },
  {
    code: "secret_scan_aws_access_key_detected",
    severity: "error",
    pattern: /\bAKIA[0-9A-Z]{16}\b/,
    message: "An AWS access-key-like token was detected in a release-facing file.",
    recovery: "Remove the AWS access-key-like token from the release-facing file before internal review."
  },
  {
    code: "secret_scan_github_token_detected",
    severity: "error",
    pattern: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
    message: "A GitHub token-like string was detected in a release-facing file.",
    recovery: "Remove the GitHub token-like string from the release-facing file before internal review."
  },
  {
    code: "secret_scan_slack_token_detected",
    severity: "error",
    pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
    message: "A Slack token-like string was detected in a release-facing file.",
    recovery: "Remove the Slack token-like string from the release-facing file before internal review."
  }
];
const LOW_RISK_CLOSEOUT_TIERS = new Set(["low-risk", "low-risk-planner-closeout"]);
const SECURITY_REVIEW_ARTIFACT_AUDIT_RULES = [
  {
    code: "release_artifact_deprecated_operator_console_reference",
    severity: "warning",
    pattern: /\bdeprecated operator console\b|\blegacy operator console\b/i,
    message: "A release-facing artifact still contains deprecated operator-console wording.",
    recovery: "Remove deprecated operator-console wording from shipped release-facing artifacts before internal review."
  },
  {
    code: "release_artifact_security_approval_claim",
    severity: "warning",
    pattern: /\bsecurity approval(?: granted| complete| completed| passed)?\b/i,
    message: "A release-facing artifact appears to overstate local automation as security approval.",
    recovery: "Reword the release-facing artifact so it does not imply that local automation equals final security approval."
  }
];
const SECURITY_REVIEW_REQUIRED_CATEGORIES = [
  {
    id: "secret/credential",
    label: "Secret / credential exposure risk",
    reviewNote: "Local scanning helps, but final sensitivity and rotation judgment remains human-reviewed."
  },
  {
    id: "third-party dependency",
    label: "Third-party dependency risk visibility",
    reviewNote: "Dependency visibility is prepared locally, but final risk acceptance remains human-reviewed."
  },
  {
    id: "shipped artifact/manual/starter payload",
    label: "Shipped artifact / manual / starter payload review",
    reviewNote: "Release-facing artifact review still needs a human check before deployment."
  },
  {
    id: "deployment/cutover evidence",
    label: "Deployment / cutover evidence completeness",
    reviewNote: "Local evidence can be checked for presence, but final operational acceptance remains human-reviewed."
  },
  {
    id: "organization-specific policy/network/environment review",
    label: "Organization-specific policy or network / environment review",
    reviewNote: "Reusable local automation does not close organization-specific policy or environment review."
  }
];
const PLANNER_HOLD_NEXT_ACTION = "Keep the reusable baseline on planning hold until a new approved lane is selected.";

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
  "PKT-01_LEGACY_READ_SURFACE.md": "reference/packets/PKT-01_LEGACY_READ_SURFACE.md",
  "PKT-01_WORK_ITEM_PACKET_TEMPLATE.md": "reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md",
  "PLN-00_DEEP_INTERVIEW.md": "reference/planning/PLN-00_DEEP_INTERVIEW.md",
  "PLN-01_REQUIREMENTS_FREEZE.md": "reference/planning/PLN-01_REQUIREMENTS_FREEZE.md",
  "PROTOTYPE_REFERENCE.md": "reference/planning/PROTOTYPE_REFERENCE.md",
  "docs/legacy-read-surface-mockup.html": "reference/mockups/legacy-read-surface-mockup.html",
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
  const root = path.resolve(repoRoot);
  const markdownPath = path.resolve(root, VALIDATION_REPORT_MARKDOWN);
  const jsonPath = path.resolve(root, VALIDATION_REPORT_JSON);
  const executedAt = new Date().toISOString();
  const draftReport = {
    ok: true,
    command: "validation-report",
    validatorVersion: RELEASE_BASELINE.validatorVersion,
    executedAt,
    cutoverReady: true,
    profileSummary: status.activeProfiles,
    findings: [],
    nextAction: status.nextAction,
    gateDecision: "pass"
  };
  const draftTraceArtifact = withStore({ dbPath, repoRoot }, (store) =>
    writeAgentTraceArtifact({
      store,
      repoRoot: root,
      outputDir,
      executedAt: draftReport.executedAt,
      report: draftReport
    })
  );
  draftReport.traceSummary = draftTraceArtifact?.summary ?? null;
  draftReport.candidateGates = PHASE1_CANDIDATE_GATES;
  fs.mkdirSync(path.dirname(markdownPath), { recursive: true });
  fs.writeFileSync(markdownPath, buildValidationReportMarkdown(draftReport), "utf8");
  fs.writeFileSync(jsonPath, `${JSON.stringify(draftReport, null, 2)}\n`, "utf8");
  const validation = runValidator({ repoRoot, outputDir, dbPath });
  const report = {
    ok: validation.ok,
    command: "validation-report",
    validatorVersion: RELEASE_BASELINE.validatorVersion,
    executedAt,
    cutoverReady: validation.cutoverReady,
    profileSummary: status.activeProfiles,
    findings: validation.findings,
    nextAction: status.nextAction,
    gateDecision: validation.ok ? "pass" : "hold"
  };
  const traceArtifact = withStore({ dbPath, repoRoot }, (store) =>
    writeAgentTraceArtifact({
      store,
      repoRoot: root,
      outputDir,
      executedAt: report.executedAt,
      report
    })
  );
  report.traceSummary = traceArtifact?.summary ?? null;
  report.candidateGates = PHASE1_CANDIDATE_GATES;

  fs.writeFileSync(markdownPath, buildValidationReportMarkdown(report), "utf8");
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  withStore({ dbPath, repoRoot }, (store) =>
    writeActiveContext({
      store,
      repoRoot,
      outputDir,
      validation: report
    })
  );
  const finalizedValidation = runValidator({ repoRoot, outputDir, dbPath });
  const finalizedReport = {
    ...report,
    ok: finalizedValidation.ok,
    cutoverReady: finalizedValidation.cutoverReady,
    findings: finalizedValidation.findings,
    gateDecision: finalizedValidation.ok ? "pass" : "hold"
  };
  const securityReview = withStore({ dbPath, repoRoot }, (store) =>
    buildSecurityReviewSummary({
      store,
      repoRoot,
      findings: finalizedReport.findings
    })
  );
  if (securityReview) {
    finalizedReport.securityReview = securityReview.summary;
    if (securityReview.summary.contractStatus === "requested") {
      finalizedReport.findings = [...finalizedReport.findings, ...securityReview.additionalFindings];
      const hasBlockingSecurityFinding = finalizedReport.findings.some((finding) => finding?.severity === "error");
      finalizedReport.ok = !hasBlockingSecurityFinding;
      finalizedReport.cutoverReady = !hasBlockingSecurityFinding;
      finalizedReport.gateDecision = hasBlockingSecurityFinding ? "hold" : "pass";
    }
  }
  finalizedReport.nextAction = withStore({ dbPath, repoRoot }, (store) => {
    const fallback = recommendNextActionFromState(store, finalizedValidation, repoRoot);
    if (securityReview?.summary?.contractStatus === "requested") {
      return recommendSecurityReviewNextAction({
        findings: finalizedReport.findings,
        fallback
      });
    }
    return fallback;
  });
  const finalizedTraceArtifact = withStore({ dbPath, repoRoot }, (store) =>
    writeAgentTraceArtifact({
      store,
      repoRoot: root,
      outputDir,
      executedAt: finalizedReport.executedAt,
      report: finalizedReport
    })
  );
  finalizedReport.traceSummary = finalizedTraceArtifact?.summary ?? null;
  fs.writeFileSync(markdownPath, buildValidationReportMarkdown(finalizedReport), "utf8");
  fs.writeFileSync(jsonPath, `${JSON.stringify(finalizedReport, null, 2)}\n`, "utf8");
  withStore({ dbPath, repoRoot }, (store) => writeGeneratedStateDocs({ store, outputDir, repoRoot }));
  withStore({ dbPath, repoRoot }, (store) =>
    writeActiveContext({
      store,
      repoRoot,
      outputDir,
      validation: finalizedReport
    })
  );
  const settledValidation = runValidator({ repoRoot, outputDir, dbPath });
  const settledReport = {
    ...finalizedReport,
    ok: settledValidation.ok,
    cutoverReady: settledValidation.cutoverReady,
    findings: settledValidation.findings,
    gateDecision: settledValidation.ok ? "pass" : "hold"
  };
  if (securityReview) {
    settledReport.securityReview = securityReview.summary;
    if (securityReview.summary.contractStatus === "requested") {
      settledReport.findings = [...settledReport.findings, ...securityReview.additionalFindings];
      const hasBlockingSecurityFinding = settledReport.findings.some((finding) => finding?.severity === "error");
      settledReport.ok = !hasBlockingSecurityFinding;
      settledReport.cutoverReady = !hasBlockingSecurityFinding;
      settledReport.gateDecision = hasBlockingSecurityFinding ? "hold" : "pass";
    }
  }
  settledReport.nextAction = withStore({ dbPath, repoRoot }, (store) => {
    const fallback = recommendNextActionFromState(store, settledValidation, repoRoot);
    if (securityReview?.summary?.contractStatus === "requested") {
      return recommendSecurityReviewNextAction({
        findings: settledReport.findings,
        fallback
      });
    }
    return fallback;
  });
  fs.writeFileSync(markdownPath, buildValidationReportMarkdown(settledReport), "utf8");
  fs.writeFileSync(jsonPath, `${JSON.stringify(settledReport, null, 2)}\n`, "utf8");
  withStore({ dbPath, repoRoot }, (store) =>
    writeActiveContext({
      store,
      repoRoot,
      outputDir,
      validation: settledReport
    })
  );

  // One extra validator pass closes the last report/context lag window after transition-time writes.
  const convergedValidation = runValidator({ repoRoot, outputDir, dbPath });
  const convergedReport = {
    ...settledReport,
    ok: convergedValidation.ok,
    cutoverReady: convergedValidation.cutoverReady,
    findings: convergedValidation.findings,
    gateDecision: convergedValidation.ok ? "pass" : "hold"
  };
  if (securityReview) {
    convergedReport.securityReview = securityReview.summary;
    if (securityReview.summary.contractStatus === "requested") {
      convergedReport.findings = [...convergedReport.findings, ...securityReview.additionalFindings];
      const hasBlockingSecurityFinding = convergedReport.findings.some((finding) => finding?.severity === "error");
      convergedReport.ok = !hasBlockingSecurityFinding;
      convergedReport.cutoverReady = !hasBlockingSecurityFinding;
      convergedReport.gateDecision = hasBlockingSecurityFinding ? "hold" : "pass";
    }
  }
  convergedReport.nextAction = withStore({ dbPath, repoRoot }, (store) => {
    const fallback = recommendNextActionFromState(store, convergedValidation, repoRoot);
    if (securityReview?.summary?.contractStatus === "requested") {
      return recommendSecurityReviewNextAction({
        findings: convergedReport.findings,
        fallback
      });
    }
    return fallback;
  });
  const convergedTraceArtifact = withStore({ dbPath, repoRoot }, (store) =>
    writeAgentTraceArtifact({
      store,
      repoRoot: root,
      outputDir,
      executedAt: convergedReport.executedAt,
      report: convergedReport
    })
  );
  convergedReport.traceSummary = convergedTraceArtifact?.summary ?? null;
  fs.writeFileSync(markdownPath, buildValidationReportMarkdown(convergedReport), "utf8");
  fs.writeFileSync(jsonPath, `${JSON.stringify(convergedReport, null, 2)}\n`, "utf8");
  withStore({ dbPath, repoRoot }, (store) =>
    writeActiveContext({
      store,
      repoRoot,
      outputDir,
      validation: convergedReport
    })
  );

  return {
    ok: convergedValidation.ok,
    command: "validation-report",
    markdownPath,
    jsonPath,
    report: convergedReport
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

  withStore({ dbPath, repoRoot }, (store) =>
    writeActiveContext({
      store,
      repoRoot,
      outputDir
    })
  );
  const validationReport = writeValidationReport({ repoRoot, outputDir, dbPath });
  const activeContext = withStore({ dbPath, repoRoot }, (store) =>
    writeActiveContext({
      store,
      repoRoot,
      outputDir,
      validation: {
        ok: validationReport.ok,
        cutoverReady: validationReport.report.cutoverReady,
        findings: validationReport.report.findings,
        gateDecision: validationReport.report.gateDecision,
        executedAt: validationReport.report.executedAt
      }
    })
  );
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
    validationReport: validationReportSummary,
    activeContext: {
      jsonPath: activeContext.jsonPath,
      markdownPath: activeContext.markdownPath
    }
  };
}

export function runPlannerPacketOpen({
  repoRoot = process.cwd(),
  outputDir = repoRoot,
  dbPath = DEFAULT_DB_PATH,
  args = []
} = {}) {
  const options = parseTransitionArgs(args);
  const preflight = withStore({ dbPath, repoRoot }, (store) =>
    buildPlannerPacketOpenPlan({ store, repoRoot, options })
  );

  if (!preflight.ok) {
    return preflight;
  }

  withStore({ dbPath, repoRoot }, (store) => {
    store.upsertArtifact({
      artifactId: preflight.artifactId,
      path: preflight.packetPath,
      category: "task_packet",
      title: preflight.title,
      sourceRef: preflight.packetPath,
      metadata: {
        ...(store.getArtifactByPath(preflight.packetPath)?.metadata ?? {}),
        workItemId: preflight.workItemId,
        gateProfile: preflight.gateProfile,
        laneType: preflight.laneType ?? null
      }
    });
    store.upsertWorkItem({
      workItemId: preflight.workItemId,
      title: preflight.title,
      status: preflight.status,
      nextAction: preflight.nextAction,
      sourceRef: preflight.packetPath,
      domainHint: preflight.domainHint,
      riskHint: preflight.riskHint,
      owner: "planner",
      metadata: {
        ...(store.getWorkItem(preflight.workItemId)?.metadata ?? {}),
        gateProfile: preflight.gateProfile,
        readyForCode: preflight.readyForCode ?? "pending",
        laneType: preflight.laneType ?? null
      }
    });
  });

  const transitionArgs = [
    "--apply",
    "--work-item",
    preflight.workItemId,
    "--from",
    "planner",
    "--to",
    "planner",
    "--status",
    preflight.status,
    "--gate-profile",
    preflight.gateProfile,
    "--source-ref",
    preflight.packetPath,
    "--summary",
    preflight.summary,
    "--next-action",
    preflight.nextAction
  ];

  if (preflight.currentStage) {
    transitionArgs.push("--current-stage", preflight.currentStage);
  }
  if (preflight.currentFocus) {
    transitionArgs.push("--current-focus", preflight.currentFocus);
  }

  const transitionResult = runTransition({ repoRoot, outputDir, dbPath, args: transitionArgs });

  return {
    ok: transitionResult.ok,
    command: "planner-open-packet",
    apply: true,
    packetPath: preflight.packetPath,
    artifactId: preflight.artifactId,
    workItemId: preflight.workItemId,
    title: preflight.title,
    gateProfile: preflight.gateProfile,
    readyForCode: preflight.readyForCode,
    status: preflight.status,
    nextAction: preflight.nextAction,
    summary: preflight.summary,
    checks: preflight.checks,
    plannedUpdates: transitionResult.plannedUpdates,
    errors: transitionResult.errors ?? [],
    transitionResult
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

function buildPlannerPacketOpenPlan({ store, repoRoot, options }) {
  const packetPath = options.packetPath ?? options.packet ?? options.sourceRef;
  const workItemId = options.workItem ?? options.workItemId;
  const title = options.title;
  const owner = normalizeOwner(options.owner ?? "planner");
  const status = options.status ?? "planning";
  const packetAbsolutePath = packetPath ? path.resolve(repoRoot, packetPath) : null;
  const checks = [];
  const errors = [];

  if (!packetPath) {
    errors.push("Missing --packet-path.");
  }
  if (!workItemId) {
    errors.push("Missing --work-item.");
  }
  if (!title) {
    errors.push("Missing --title.");
  }
  if (owner !== "planner") {
    errors.push(`Planner packet opening helper only supports owner planner; received ${options.owner ?? "missing"}.`);
  }
  if (packetPath && (!packetPath.endsWith(".md") || !packetPath.startsWith("reference/packets/"))) {
    errors.push(`Packet path must point to a markdown packet under reference/packets. (${packetPath})`);
  }
  if (packetAbsolutePath && !fs.existsSync(packetAbsolutePath)) {
    errors.push(`Packet path does not exist: ${packetPath}.`);
  }

  const releaseState = store.getReleaseState("current");
  const openWorkItems = store
    .listWorkItems()
    .filter((item) => !isClosedStatus(item.status) && item.workItemId !== workItemId);
  if (openWorkItems.length > 0) {
    errors.push(
      `Planner packet opening requires no other open work items; ${openWorkItems[0].workItemId} (${openWorkItems[0].owner ?? "unassigned"} / ${openWorkItems[0].status}) must be closed or explicitly routed first.`
    );
  }

  const packetContent = packetAbsolutePath && fs.existsSync(packetAbsolutePath)
    ? fs.readFileSync(packetAbsolutePath, "utf8")
    : null;
  const gateProfile =
    resolveGateProfile(options.gateProfile)?.id ??
    resolveGateProfile(readPacketHeaderValue(repoRoot, packetPath, "Gate profile"))?.id ??
    null;
  const readyForCode = readPacketReadyForCode(repoRoot, packetPath) || "pending";
  const laneType = readPacketBulletFieldValue(repoRoot, packetPath, "Lane-type declaration");
  const artifactId = options.artifactId ?? inferPacketArtifactId(packetPath);
  const requiredHeaderRows = [
    "Work item",
    "Ready For Code",
    "Human sync needed",
    "Gate profile",
    "User-facing impact",
    "Layer classification",
    "Active profile dependencies",
    "Profile evidence status",
    "UX archetype status",
    "UX deviation status",
    "Environment topology status",
    "Domain foundation status",
    "Authoritative source intake status",
    "Shared-source wave status",
    "Packet exit gate status",
    "Existing system dependency",
    "New authoritative source impact",
    "Risk if started now"
  ];

  for (const label of requiredHeaderRows) {
    const value = readPacketHeaderValue(repoRoot, packetPath, label);
    checks.push({
      check: `header:${label}`,
      ok: Boolean(value),
      detail: value ?? "missing"
    });
    if (!value) {
      errors.push(`Quick Decision Header is missing required row: ${label}.`);
    }
  }

  if (!gateProfile) {
    errors.push(`Packet gate profile is missing or invalid. (${options.gateProfile ?? "not declared"})`);
  }

  const manifest = packetContent ? readPacketSection(packetContent, "## Verification Manifest") : null;
  checks.push({
    check: "verification-manifest",
    ok: Boolean(manifest),
    detail: manifest ? "present" : "missing"
  });
  if (!manifest) {
    errors.push("Packet is missing ## Verification Manifest.");
  }

  for (const marker of plannerOpenRequiredManifestMarkers(gateProfile, { repoRoot, packetPath })) {
    const ok = Boolean(manifest && manifest.toLowerCase().includes(marker.toLowerCase()));
    checks.push({
      check: `manifest:${marker}`,
      ok,
      detail: ok ? "present" : "missing"
    });
    if (!ok) {
      errors.push(`Verification Manifest is missing gate-profile marker: ${marker}.`);
    }
  }

  const semanticContract = packetContent
    ? inspectTaskPacketContract({
        repoRoot,
        packetPath,
        artifactId,
        content: packetContent
      })
    : null;
  const semanticErrors = semanticContract?.findings?.filter((finding) => finding.severity === "error") ?? [];
  checks.push({
    check: "task-packet-semantic-contract",
    ok: semanticErrors.length === 0,
    detail: semanticErrors.length === 0 ? "pass" : `${semanticErrors.length} error(s)`
  });
  for (const finding of semanticErrors) {
    const message = `Task packet semantic preflight failed: ${finding.message}`;
    if (!errors.includes(message)) {
      errors.push(message);
    }
  }

  const workItemLabel = workItemId ?? "selected work item";
  const defaultNextAction =
    options.nextAction ??
    `Review the ${workItemLabel} detailed agreement proposal and decide whether to approve, adjust, or hold Ready For Code before implementation opens.`;
  const defaultSummary =
    options.summary ?? `Opened ${workItemLabel} as the selected Planner packet for review before implementation opens.`;

  return {
    ok: errors.length === 0,
    command: "planner-open-packet",
    apply: false,
    packetPath,
    artifactId,
    workItemId,
    title,
    gateProfile,
    readyForCode,
    laneType,
    status,
    owner,
    nextAction: defaultNextAction,
    summary: defaultSummary,
    currentStage: options.currentStage ?? releaseState?.currentStage ?? "planning",
    currentFocus: options.currentFocus ?? releaseState?.currentFocus ?? null,
    domainHint: options.domainHint ?? null,
    riskHint: options.riskHint ?? null,
    checks,
    errors
  };
}

function buildTransitionPlan({ store, repoRoot, options }) {
  const baseTransitionDefaults = transitionDefaultsFor(options.transition);
  const transition = options.transition ?? baseTransitionDefaults.transition;
  const workItemId = options.workItem ?? options.workItemId;
  const errors = [];
  const workItem = workItemId ? store.getWorkItem(workItemId) : null;
  const releaseState = store.getReleaseState("current");
  const initialFromOwner = normalizeOwner(options.from ?? baseTransitionDefaults.from ?? workItem?.owner);
  const initialToOwner = normalizeOwner(options.to ?? baseTransitionDefaults.to);
  const transitionDefaults = resolveTransitionDefaults({
    transition,
    fromOwner: initialFromOwner,
    toOwner: initialToOwner
  });
  const fromOwner = normalizeOwner(options.from ?? transitionDefaults.from ?? workItem?.owner);
  const toOwner = normalizeOwner(options.to ?? transitionDefaults.to);
  const status = options.status ?? transitionDefaults.status ?? workItem?.status ?? "in_progress";
  const sourceRef = options.sourceRef ?? workItem?.sourceRef ?? releaseState?.sourceRef ?? ".agents/artifacts/TASK_LIST.md";
  const packetSourceRef = workItem?.sourceRef ?? sourceRef;
  const gateProfile = resolveTransitionGateProfile({ options, workItem, repoRoot });
  const packetReadyForCode = readPacketReadyForCode(repoRoot, packetSourceRef) || null;
  const metadataReadyForCode = normalizeReadyForCodeState(workItem?.metadata?.readyForCode);
  const liveReadyForCode =
    transition === "planner-to-developer"
      ? packetReadyForCode === "approved"
        ? "approved"
        : metadataReadyForCode
      : metadataReadyForCode ?? packetReadyForCode;
  const lowRiskPlannerCloseoutApproved = isLowRiskPlannerCloseoutApproved({
    repoRoot,
    sourceRef: packetSourceRef,
    workItem
  });
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
  const currentStage =
    options.currentStage ??
    transitionDefaults.currentStage ??
    releaseState?.currentStage ??
    null;
  const currentFocus =
    preserveReleaseBaselineFocus({
      focus:
        options.currentFocus ??
        renderTransitionTextTemplate(transitionDefaults.currentFocusTemplate, workItemId) ??
        releaseState?.currentFocus ??
        null,
      releaseState
    });

  if (!workItemId) {
    errors.push("Missing --work-item.");
  }
  if (!workItem) {
    errors.push(`Cannot transition missing work item: ${workItemId ?? "unknown"}.`);
  }
  if (!toOwner) {
    errors.push("Missing --to or named transition target owner.");
  }
  if (transition === "tester-to-planner-low-risk-closeout" && !lowRiskPlannerCloseoutApproved) {
    errors.push(
      `${packetSourceRef ?? sourceRef ?? "The active packet"} must declare - Closeout risk tier: low-risk and have no higher detected risk floor before tester-to-planner-low-risk-closeout can be used.`
    );
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
  let plannerHoldReconciliation = null;
  if (transition === "planner-closeout-hold") {
    plannerHoldReconciliation = evaluatePlannerHoldCloseout({
      store,
      repoRoot,
      workItemId
    });
    for (const blockingItem of plannerHoldReconciliation.blockingWorkItems) {
      errors.push(
        `planner-closeout-hold requires no other open work items; ${blockingItem.workItemId} (${blockingItem.owner ?? "unassigned"} / ${blockingItem.status}) must be closed or explicitly routed first.`
      );
    }
  }

  const ok = errors.length === 0;
  return {
    ok,
    command: "transition",
    apply: false,
    transition,
    workItemId: workItemId ?? null,
    workItemTitle: workItem?.title ?? null,
    fromOwner,
    toOwner,
    status,
    gateProfile: gateProfile?.id ?? null,
    readyForCode: liveReadyForCode,
    gateProfileSummary: summarizeGateProfile(gateProfile),
    summary,
    nextAction,
    sourceRef,
    packetSourceRef,
    closeDecisions,
    currentStage,
    currentFocus,
    releaseGateState: options.releaseGate ?? options.releaseGateState ?? releaseState?.releaseGateState ?? null,
    plannerHoldReconcileIds: plannerHoldReconciliation?.reconcileableWorkItems.map((item) => item.workItemId) ?? [],
    plannedUpdates: [
      ".agents/artifacts/TASK_LIST.md",
      ".agents/artifacts/CURRENT_STATE.md",
      ".agents/artifacts/IMPLEMENTATION_PLAN.md",
      ".agents/artifacts/PROJECT_PROGRESS.md",
      ".harness/operating_state.sqlite",
      ".agents/runtime/generated-state-docs/CURRENT_STATE.md",
      ".agents/runtime/generated-state-docs/TASK_LIST.md",
      ".agents/runtime/ACTIVE_CONTEXT.json",
      ".agents/runtime/ACTIVE_CONTEXT.md",
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
      currentFocusTemplate: "{workItemId} implementation is in progress.",
      summary: "Planning approved; implementation can proceed.",
      nextAction: "Implement the approved packet scope and hand off to Tester."
    },
    "developer-to-tester": {
      transition: "developer-to-tester",
      from: "developer",
      to: "tester",
      status: "review",
      currentStage: "verification",
      currentFocusTemplate: "{workItemId} implementation is ready for Tester verification.",
      summary: "Developer implementation completed; Tester should verify the approved scope.",
      nextAction: "Verify the implementation against the packet acceptance criteria."
    },
    "tester-to-reviewer": {
      transition: "tester-to-reviewer",
      from: "tester",
      to: "reviewer",
      status: "review",
      currentStage: "review",
      currentFocusTemplate: "{workItemId} is under reviewer closeout assessment.",
      summary: "Tester verification completed; Reviewer should assess packet exit readiness.",
      nextAction: "Review implementation, evidence, residual debt, and closeout readiness."
    },
    "tester-to-planner-low-risk-closeout": {
      transition: "tester-to-planner-low-risk-closeout",
      from: "tester",
      to: "planner",
      status: "planning",
      currentStage: "planning",
      currentFocusTemplate: "{workItemId} low-risk closeout is verification-complete; Planner is recording closeout under the approved low-risk path.",
      summary: "Tester verified the approved low-risk scope; Planner should record packet closeout under the low-risk closeout path.",
      nextAction: "Planner should record low-risk closeout and choose the next approved lane."
    },
    "reviewer-to-developer": {
      transition: "reviewer-to-developer",
      from: "reviewer",
      to: "developer",
      status: "in_progress",
      currentStage: "implementation",
      currentFocusTemplate: "{workItemId} reviewer finding remediation is in progress.",
      summary: "Reviewer found remediation work; Developer should address the finding.",
      nextAction: "Remediate the reviewer finding, rerun tests and validation, and hand off to Tester."
    },
    "reviewer-to-planner": {
      transition: "reviewer-to-planner",
      from: "reviewer",
      to: "planner",
      status: "planning",
      currentStage: "planning",
      currentFocusTemplate: "{workItemId} closeout is approved; Planner is choosing the next approved lane.",
      summary: "Packet exit approved; Planner should choose or refine the next lane.",
      nextAction: "Plan the next approved lane or close remaining planning decisions."
    },
    "planner-closeout-hold": {
      transition: "planner-closeout-hold",
      from: "planner",
      to: "planner",
      status: "closed",
      currentStage: "planning",
      currentFocusTemplate: "{workItemId} is closed; the reusable baseline is on planner hold with no active lane.",
      summary: "Planner recorded packet closeout and placed the reusable baseline on no-active-lane hold.",
      nextAction: PLANNER_HOLD_NEXT_ACTION
    }
  };
  return transitions[transition] ?? { transition: transition ?? "custom" };
}

function resolveTransitionDefaults({ transition, fromOwner, toOwner }) {
  const namedDefaults = transitionDefaultsFor(transition);
  if (transition && transition !== "custom") {
    return namedDefaults;
  }
  const inferredTransition = `${fromOwner ?? "unknown"}-to-${toOwner ?? "unknown"}`;
  const inferredDefaults = transitionDefaultsFor(inferredTransition);
  return {
    ...inferredDefaults,
    ...namedDefaults,
    transition: transition ?? namedDefaults.transition ?? "custom"
  };
}

function renderTransitionTextTemplate(template, workItemId) {
  if (typeof template !== "string" || template.length === 0) {
    return null;
  }
  return template.replaceAll("{workItemId}", workItemId ?? "The active work item");
}

function preserveReleaseBaselineFocus({ focus, releaseState }) {
  if (typeof focus !== "string" || focus.length === 0) {
    return focus ?? null;
  }
  const releaseBaseline = releaseState?.metadata?.releaseBaseline;
  if (!releaseBaseline || focus.includes(releaseBaseline)) {
    return focus;
  }
  const previousFocus = String(releaseState?.currentFocus ?? "");
  const baselinePrefix = previousFocus
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.includes(releaseBaseline));
  if (!baselinePrefix) {
    return focus;
  }
  return `${baselinePrefix}; ${focus}`;
}

function applyTransitionPlan({ store, repoRoot, outputDir, plan, options }) {
  const timestamp = new Date().toISOString();
  if (plan.transition === "planner-closeout-hold") {
    reconcilePlannerHoldCloseout({
      store,
      repoRoot,
      workItemId: plan.workItemId,
      reconcileIds: plan.plannerHoldReconcileIds,
      timestamp
    });
  }
  const metadata = {
    ...(store.getWorkItem(plan.workItemId)?.metadata ?? {}),
    gateProfile: plan.gateProfile,
    packetSourceRef: plan.packetSourceRef ?? plan.sourceRef,
    ...(plan.readyForCode === "approved" ? { readyForCode: "approved" } : {}),
    ...(isClosedStatus(plan.status) ? { closedAt: timestamp, closedBy: plan.toOwner ?? "unknown" } : {}),
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
    payload: buildCompactHandoffPayload(plan)
  });

  updateCanonicalImplementationPlan({ repoRoot, plan });
  updateCanonicalProjectProgress({ repoRoot, plan });
  const generatedDocs = writeGeneratedStateDocs({ store, outputDir, repoRoot });

  return {
    ...plan,
    ok: true,
    apply: true,
    appliedAt: timestamp,
    handoff,
    generatedDocs
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

function evaluatePlannerHoldCloseout({ store, repoRoot, workItemId }) {
  const lifecycleHints = readCanonicalTaskLifecycleHints({ repoRoot });
  const reconcileableWorkItems = [];
  const blockingWorkItems = [];

  for (const candidate of store.listWorkItems()) {
    if (!candidate || candidate.workItemId === workItemId || isClosedStatus(candidate.status)) {
      continue;
    }
    if (candidate.owner === "planner" && isCanonicallyClosedWorkItem(candidate, lifecycleHints)) {
      reconcileableWorkItems.push(candidate);
      continue;
    }
    blockingWorkItems.push(candidate);
  }

  return {
    reconcileableWorkItems,
    blockingWorkItems
  };
}

function reconcilePlannerHoldCloseout({ store, repoRoot, reconcileIds = [], timestamp }) {
  if (!Array.isArray(reconcileIds) || reconcileIds.length === 0) {
    return;
  }
  const lifecycleHints = readCanonicalTaskLifecycleHints({ repoRoot });
  for (const reconcileId of reconcileIds) {
    const candidate = store.getWorkItem(reconcileId);
    if (!candidate || isClosedStatus(candidate.status)) {
      continue;
    }
    if (candidate.owner !== "planner" || !isCanonicallyClosedWorkItem(candidate, lifecycleHints)) {
      continue;
    }
    store.transitionWorkItem({
      workItemId: candidate.workItemId,
      owner: candidate.owner,
      status: "closed",
      nextAction: candidate.nextAction,
      sourceRef: candidate.sourceRef,
      metadata: {
        ...(candidate.metadata ?? {}),
        reconciledByPlannerCloseoutHold: true,
        closedAt: timestamp,
        closedBy: "planner",
        lastTransition: {
          transition: "planner-closeout-hold-reconcile",
          fromOwner: candidate.owner,
          toOwner: candidate.owner,
          appliedAt: timestamp
        }
      }
    });
  }
}

function readPacketGateProfile(repoRoot, sourceRef) {
  return readPacketHeaderValue(repoRoot, sourceRef, "Gate profile");
}

function readPacketReadyForCode(repoRoot, sourceRef) {
  const value = normalizePacketHeaderValue(readPacketHeaderValue(repoRoot, sourceRef, "Ready For Code"));
  return value === "approved" || value === "approve" ? "approved" : value;
}

function normalizeReadyForCodeState(value) {
  const normalized = normalizePacketHeaderValue(value);
  return normalized === "approved" || normalized === "approve" ? "approved" : normalized || null;
}

function readPacketBulletFieldValue(repoRoot, sourceRef, label) {
  if (!sourceRef || !sourceRef.endsWith(".md")) {
    return null;
  }
  const packetPath = path.resolve(repoRoot, sourceRef);
  if (!fs.existsSync(packetPath)) {
    return null;
  }
  const content = fs.readFileSync(packetPath, "utf8");
  const matcher = new RegExp(`^-\\s*${escapeRegExp(label.trim())}\\s*:\\s*(.*)$`, "i");
  for (const rawLine of content.split(/\r?\n/)) {
    const match = rawLine.trim().match(matcher);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

function inferPacketArtifactId(packetPath) {
  if (!packetPath) {
    return null;
  }
  return path.basename(packetPath, path.extname(packetPath));
}

function readPacketSection(content, sectionHeading) {
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

function plannerOpenRequiredManifestMarkers(gateProfile, options = {}) {
  const markers = {
    light: ["canonical artifact", "handoff"],
    standard: ["approved packet", "targeted test", "validator", "handoff"],
    contract: ["Ready For Code", "root", "standard-template", "targeted", "validator", "active context", "review closeout"],
    release: ["release-baseline", "packaging", "validator", "review closeout"]
  };
  const resolvedMarkers = [...(markers[gateProfile] ?? [])];
  if (
    gateProfile === "contract" &&
    isLowRiskPlannerCloseoutApproved({
      repoRoot: options.repoRoot ?? null,
      packetPath: options.packetPath ?? null,
      sourceRef: options.sourceRef ?? null
    })
  ) {
    return resolvedMarkers.filter((marker) => marker !== "review closeout");
  }
  return resolvedMarkers;
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

function resolvePacketMarkdownPath(repoRoot, packetPath, sourceRef) {
  const candidate = packetPath ?? sourceRef;
  if (!repoRoot || !candidate || !String(candidate).endsWith(".md")) {
    return null;
  }
  const resolved = path.isAbsolute(candidate) ? candidate : path.resolve(repoRoot, candidate);
  return fs.existsSync(resolved) ? resolved : null;
}

function normalizeCloseoutRiskTier(value) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, "-");
  return normalized || null;
}

function readPacketCloseoutRiskTier(repoRoot, packetPath, sourceRef) {
  const resolvedPacketPath = resolvePacketMarkdownPath(repoRoot, packetPath, sourceRef);
  if (!resolvedPacketPath) {
    return null;
  }
  const content = fs.readFileSync(resolvedPacketPath, "utf8");
  const matcher = /^-\s*Closeout risk tier\s*:\s*(.*)$/im;
  const match = content.match(matcher);
  return match ? normalizeCloseoutRiskTier(match[1]) : null;
}

function isLowRiskPlannerCloseoutApproved({ repoRoot, packetPath = null, sourceRef = null, workItem = null }) {
  const runtimeTier = normalizeCloseoutRiskTier(workItem?.metadata?.closeoutRiskTier);
  const detectedRiskFloor = detectPacketRiskFloor({ repoRoot, packetPath, sourceRef });
  if (runtimeTier && LOW_RISK_CLOSEOUT_TIERS.has(runtimeTier) && riskClassRank(detectedRiskFloor) <= RISK_CLASS_ORDER.low) {
    return true;
  }
  const packetTier = readPacketCloseoutRiskTier(repoRoot, packetPath, sourceRef);
  return Boolean(packetTier && LOW_RISK_CLOSEOUT_TIERS.has(packetTier) && riskClassRank(detectedRiskFloor) <= RISK_CLASS_ORDER.low);
}

function riskClassRank(value) {
  return RISK_CLASS_ORDER[normalizeRiskClass(value)] ?? RISK_CLASS_ORDER.low;
}

function normalizeRiskClass(value) {
  const normalized = normalizeCloseoutRiskTier(value);
  if (!normalized) {
    return null;
  }
  if (normalized.startsWith("low")) {
    return "low";
  }
  if (normalized.startsWith("normal") || normalized.startsWith("standard")) {
    return "normal";
  }
  if (normalized.startsWith("high") || normalized.startsWith("release")) {
    return "high";
  }
  return null;
}

function detectPacketRiskFloor({ repoRoot, packetPath = null, sourceRef = null }) {
  const resolvedPacketPath = resolvePacketMarkdownPath(repoRoot, packetPath, sourceRef);
  if (!resolvedPacketPath) {
    return "low";
  }
  const relativePacketPath = path.relative(repoRoot, resolvedPacketPath).replace(/\\/g, "/");
  const riskHeader = normalizeRiskClass(readPacketHeaderValue(repoRoot, relativePacketPath, "Risk if started now"));
  if (riskHeader) {
    return riskHeader;
  }
  const gateProfile = normalizePacketHeaderValue(readPacketHeaderValue(repoRoot, relativePacketPath, "Gate profile"));
  if (gateProfile === "release") {
    return "high";
  }
  const content = fs.readFileSync(resolvedPacketPath, "utf8").toLowerCase();
  if (
    content.includes("authority-model mutation") ||
    content.includes("authority model mutation") ||
    content.includes("shipped starter payload") ||
    content.includes("release packaging") ||
    content.includes("security-sensitive") ||
    content.includes("data / cutover") ||
    content.includes("data/cutover") ||
    content.includes("artifact retirement execution") ||
    content.includes("authority cutover")
  ) {
    return "high";
  }
  if (
    gateProfile === "contract" ||
    content.includes("validator behavior") ||
    content.includes("workflow/tooling") ||
    content.includes("reusable runtime")
  ) {
    return "normal";
  }
  return "low";
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

function parseDelimitedList(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }
  return String(value ?? "")
    .split(/[;,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeSecurityReviewScopeEntry(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  if (normalized === "package manifest" || normalized === "package manifests") {
    return "package manifests";
  }
  if (normalized === "release artifact" || normalized === "release artifacts" || normalized === "release-facing artifacts") {
    return "release-facing artifacts";
  }
  if (
    normalized === "declared path" ||
    normalized === "declared paths" ||
    normalized === "declared security/release path" ||
    normalized === "declared security/release paths"
  ) {
    return "declared security/release paths";
  }
  return null;
}

function normalizeSecurityReviewStatus(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) {
    return "not-requested";
  }
  if (normalized === "requested" || normalized === "request" || normalized === "enabled" || normalized === "on") {
    return "requested";
  }
  return "not-requested";
}

function normalizeSemanticTraceEvidenceStatus(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) {
    return "not-requested";
  }
  if (normalized === "requested" || normalized === "request" || normalized === "enabled" || normalized === "on") {
    return "requested";
  }
  return "not-requested";
}

function readPacketSecurityReviewContract(repoRoot, sourceRef) {
  return {
    status: readPacketBulletFieldValue(repoRoot, sourceRef, "Security review evidence status"),
    scope: parseDelimitedList(readPacketBulletFieldValue(repoRoot, sourceRef, "Security review evidence scope")),
    declaredPaths: parseDelimitedList(readPacketBulletFieldValue(repoRoot, sourceRef, "Declared security/release paths"))
  };
}

function normalizeSecurityReviewRuntimeContract(metadata) {
  if (!metadata || typeof metadata !== "object") {
    return {
      status: null,
      scope: [],
      declaredPaths: []
    };
  }
  return {
    status: metadata.status ?? null,
    scope: parseDelimitedList(metadata.scope),
    declaredPaths: parseDelimitedList(metadata.declaredPaths)
  };
}

function resolveSecurityReviewContract({ activeWorkItem, repoRoot }) {
  if (!activeWorkItem) {
    return null;
  }

  const runtimeContract = normalizeSecurityReviewRuntimeContract(activeWorkItem.metadata?.securityReviewEvidence);
  const packetContract = readPacketSecurityReviewContract(repoRoot, activeWorkItem.sourceRef);
  const requested = normalizeSecurityReviewStatus(runtimeContract.status ?? packetContract.status) === "requested";
  const activationSource = runtimeContract.status ? "runtime metadata" : packetContract.status ? "packet metadata" : "not declared";
  const checkedScope = uniqueStringList(
    [...runtimeContract.scope, ...packetContract.scope]
      .map((entry) => normalizeSecurityReviewScopeEntry(entry))
      .filter(Boolean)
  );
  const declaredPaths = uniqueStringList([...runtimeContract.declaredPaths, ...packetContract.declaredPaths]);
  const includeDeclaredPaths = checkedScope.includes("declared security/release paths");
  const resolvedDeclaredPaths = includeDeclaredPaths
    ? declaredPaths.filter((relativePath) => fs.existsSync(path.resolve(repoRoot, relativePath)))
    : [];
  const unresolvedDeclaredPaths = includeDeclaredPaths
    ? declaredPaths.filter((relativePath) => !fs.existsSync(path.resolve(repoRoot, relativePath)))
    : [];

  return {
    requested,
    contractStatus: requested ? "requested" : "not-applicable",
    activationSource,
    checkedScope,
    declaredPaths,
    resolvedDeclaredPaths,
    unresolvedDeclaredPaths,
    includeDeclaredPaths,
    packageManifestPaths: checkedScope.includes("package manifests") ? SECURITY_REVIEW_PACKAGE_MANIFEST_PATHS : [],
    releaseArtifactPaths: checkedScope.includes("release-facing artifacts") ? SECURITY_REVIEW_RELEASE_ARTIFACT_PATHS : []
  };
}

function readPacketSemanticTraceContract(repoRoot, sourceRef) {
  return {
    status: readPacketBulletFieldValue(repoRoot, sourceRef, "Semantic trace evidence status")
  };
}

function normalizeSemanticTraceRuntimeContract(metadata) {
  if (!metadata || typeof metadata !== "object") {
    return {
      status: null
    };
  }
  return {
    status: metadata.status ?? null
  };
}

function resolveSemanticTraceContract({ activeWorkItem, repoRoot }) {
  if (!activeWorkItem) {
    return null;
  }

  const runtimeContract = normalizeSemanticTraceRuntimeContract(activeWorkItem.metadata?.semanticTraceEvidence);
  const packetContract = readPacketSemanticTraceContract(repoRoot, activeWorkItem.sourceRef);
  const requested = normalizeSemanticTraceEvidenceStatus(runtimeContract.status ?? packetContract.status) === "requested";

  return {
    requested,
    contractStatus: requested ? "requested" : "not-requested",
    activationSource: runtimeContract.status ? "runtime metadata" : packetContract.status ? "packet metadata" : "not declared"
  };
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
  if (isClosedStatus(plan.status)) {
    content = removeMarkdownTableRow(content, "## Active Locks", "Task ID", plan.workItemId);
    content = ensureMarkdownTablePlaceholderRow(content, "## Active Locks", [
      "-",
      "None",
      "-",
      "clear",
      "-",
      "-"
    ]);
    content = removeMarkdownTableRow(content, "## Active Tasks", "Task ID", plan.workItemId);
    content = ensureMarkdownTablePlaceholderRow(content, "## Active Tasks", [
      "-",
      "None",
      "-",
      "-",
      "clear",
      "-",
      "-",
      "-"
    ]);
    content = removeMarkdownTableRow(content, "## Completed Tasks", "Task ID", "-");
    content = upsertMarkdownTableRow(content, "## Completed Tasks", "Task ID", plan.workItemId, {
      "Task ID": plan.workItemId,
      Title: plan.workItemTitle ?? plan.workItemId,
      "Completed At": timestamp.slice(0, 10),
      Verification: `transition ${plan.fromOwner ?? "unknown"} -> ${plan.toOwner ?? "unknown"}; gate ${plan.gateProfile}`,
      Notes: `${plan.summary} ${plan.nextAction}`.trim()
    });
  } else {
    content = upsertMarkdownTableRow(content, "## Active Locks", "Task ID", plan.workItemId, {
      "Task ID": plan.workItemId,
      Scope: plan.workItemTitle ?? plan.workItemId,
      Owner: plan.toOwner,
      Status: "active",
      "Started At": timestamp.slice(0, 10),
      Notes: `${plan.transition}; gate ${plan.gateProfile}; ${plan.nextAction}`
    });
    content = upsertMarkdownTableRow(content, "## Active Tasks", "Task ID", plan.workItemId, {
      "Task ID": plan.workItemId,
      Title: plan.workItemTitle ?? plan.workItemId,
      Scope: plan.workItemTitle ?? plan.workItemId,
      Owner: plan.toOwner,
      Status: plan.status,
      Verification: `gate ${plan.gateProfile}; ${plan.nextAction}`
    });
  }
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
  content = replaceSectionBulletContaining(
    content,
    "## Open Decisions / Blockers",
    `under ${plan.workItemId}.`,
    buildApprovedScopeStateBullet(plan)
  );
  content = replaceSectionBulletContaining(
    content,
    "## Open Decisions / Blockers",
    `User-approved \`${plan.workItemId}\` scope remains active.`,
    buildApprovedScopeStateBullet(plan)
  );
  content = replaceOrPrependSectionBulletContaining(
    content,
    "## Current Truth Notes",
    `\`${plan.workItemId}`,
    buildCurrentTruthNote(plan)
  );
  content = replaceSectionBulletContaining(
    content,
    "## Current Truth Notes",
    `\`${path.basename(plan.packetSourceRef ?? "")}\``,
    buildActivePacketStateBullet(plan)
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
  content = replaceSectionBullets(
    content,
    "## Operator Next Action",
    isClosedStatus(plan.status)
      ? [
          `- \`${plan.workItemId}\` is closed; latest closeout handoff is \`${plan.fromOwner ?? "unknown"} -> ${plan.toOwner}\`.`,
          `- ${plan.nextAction}`,
          `- Source packet: \`${plan.sourceRef}\`.`,
          "- Preserve packet-before-code, active-context derived authority, generated-doc immutability, root/starter sync, Tester/Reviewer separation, and human approval gates."
        ]
      : [
          `- \`${plan.workItemId}\` active handoff is \`${plan.fromOwner ?? "unknown"} -> ${plan.toOwner}\`.`,
          `- ${plan.nextAction}`,
          `- Source packet: \`${plan.sourceRef}\`.`,
          "- Preserve packet-before-code, active-context derived authority, generated-doc immutability, root/starter sync, Tester/Reviewer separation, and human approval gates."
        ]
  );
  fs.writeFileSync(implementationPlanPath, content, "utf8");
}

function buildCurrentWorkItemStateBullet(plan) {
  if (isClosedStatus(plan.status)) {
    return `- \`${plan.workItemId}\` is closed; latest handoff is \`${plan.fromOwner ?? "unknown"} -> ${plan.toOwner}\`. ${plan.nextAction}`;
  }
  const approvalText = plan.readyForCode === "approved"
    ? "Ready For Code is approved"
    : `Ready For Code status is ${plan.readyForCode ?? "unknown"}`;
  return `- \`${plan.workItemId}\` ${approvalText}; active handoff is \`${plan.fromOwner ?? "unknown"} -> ${plan.toOwner}\`. ${plan.nextAction}`;
}

function buildApprovedScopeStateBullet(plan) {
  if (isClosedStatus(plan.status)) {
    return `- User-approved \`${plan.workItemId}\` scope is closed; latest handoff is \`${plan.fromOwner ?? "unknown"} -> ${plan.toOwner}\`.`;
  }
  return `- User-approved \`${plan.workItemId}\` scope remains active. Ready For Code is approved; current handoff is \`${plan.fromOwner ?? "unknown"} -> ${plan.toOwner}\`. ${plan.nextAction}`;
}

function buildCurrentTruthNote(plan) {
  if (isClosedStatus(plan.status)) {
    return `- \`${plan.workItemId}\` is closed. Latest handoff is \`${plan.fromOwner ?? "unknown"} -> ${plan.toOwner}\`; stage is \`${plan.currentStage ?? "unknown"}\`; gate profile is \`${plan.gateProfile ?? "unknown"}\`.`;
  }
  return `- \`${plan.workItemId}\` remains the active work item. Current handoff is \`${plan.fromOwner ?? "unknown"} -> ${plan.toOwner}\`; stage is \`${plan.currentStage ?? "unknown"}\`; gate profile is \`${plan.gateProfile ?? "unknown"}\`.`;
}

function buildActivePacketStateBullet(plan) {
  const packetName = path.basename(plan.packetSourceRef ?? plan.sourceRef ?? "active packet");
  if (isClosedStatus(plan.status)) {
    return `- \`${packetName}\` is closed with the latest handoff \`${plan.fromOwner ?? "unknown"} -> ${plan.toOwner}\`.`;
  }
  return `- \`${packetName}\` remains the active packet for scope boundary, human approval text, and audit evidence; live handoff is \`${plan.fromOwner ?? "unknown"} -> ${plan.toOwner}\`; live stage is ${describeStageForPacket(plan.currentStage)}.`;
}

function describeStageForPacket(currentStage) {
  if (currentStage === "implementation") {
    return "Developer implementation";
  }
  if (currentStage === "verification") {
    return "Tester verification";
  }
  if (currentStage === "review") {
    return "Reviewer closeout review";
  }
  if (currentStage === "planning") {
    return "planning";
  }
  return currentStage ?? "the active workflow stage";
}

function updateCanonicalProjectProgress({ repoRoot, plan }) {
  const progressPath = path.resolve(repoRoot, ".agents/artifacts/PROJECT_PROGRESS.md");
  if (!fs.existsSync(progressPath)) {
    return;
  }
  const progressStatus = isClosedStatus(plan.status)
    ? "done"
    : (plan.currentStage ?? plan.status ?? "in_progress");
  let content = fs.readFileSync(progressPath, "utf8");
  content = updateMarkdownTableRow(content, "## Progress Board", "Task ID", plan.workItemId, {
    Status: progressStatus,
    Notes: `${plan.summary} ${plan.nextAction}`.trim()
  });
  fs.writeFileSync(progressPath, content, "utf8");
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

function upsertMarkdownTableRow(content, sectionHeading, keyColumn, keyValue, updates) {
  const updated = updateMarkdownTableRow(content, sectionHeading, keyColumn, keyValue, updates);
  if (updated !== content) {
    return updated;
  }

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
  const row = headers.map((header) => updates[header] ?? "");
  let insertIndex = tableStart + 2;
  while (insertIndex < lines.length && lines[insertIndex].trim().startsWith("|")) {
    insertIndex += 1;
  }
  lines.splice(insertIndex, 0, `| ${row.map(escapeMarkdownCell).join(" | ")} |`);
  return `${content.slice(0, range.start)}${lines.join("\n")}${content.slice(range.end)}`;
}

function removeMarkdownTableRow(content, sectionHeading, keyColumn, keyValue) {
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
    lines.splice(index, 1);
    return `${content.slice(0, range.start)}${lines.join("\n")}${content.slice(range.end)}`;
  }
  return content;
}

function ensureMarkdownTablePlaceholderRow(content, sectionHeading, rowValues) {
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
  const dataRows = [];
  for (let index = tableStart + 2; index < lines.length; index += 1) {
    if (!lines[index].trim().startsWith("|")) {
      break;
    }
    dataRows.push(lines[index]);
  }
  if (dataRows.length > 0) {
    return content;
  }
  lines.splice(tableStart + 2, 0, `| ${rowValues.map(escapeMarkdownCell).join(" | ")} |`);
  return `${content.slice(0, range.start)}${lines.join("\n")}${content.slice(range.end)}`;
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

function replaceSectionBulletContaining(content, sectionHeading, needle, bullet) {
  const range = findSectionRange(content, sectionHeading);
  if (!range || !needle || !bullet) {
    return content;
  }
  const section = content.slice(range.start, range.end);
  const lines = section.split(/\r?\n/);
  const replaced = lines.map((line) => (line.startsWith("- ") && line.includes(needle) ? bullet : line));
  if (replaced.join("\n") === section) {
    return content;
  }
  return `${content.slice(0, range.start)}${replaced.join("\n")}${content.slice(range.end)}`;
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

  const activeWork = selectActiveWorkItem(store.listWorkItems(), { repoRoot });
  if (activeWork?.nextAction) {
    return activeWork.nextAction;
  }

  const latestHandoffNextAction = store.listRecentHandoffs(1)[0]?.payload?.nextFirstAction;
  if (latestHandoffNextAction) {
    return latestHandoffNextAction;
  }

  return "No blocker is recorded. Continue with the current approved packet or open the next planning lane.";
}

function buildCompactHandoffPayload(plan) {
  return {
    transition: plan.transition,
    workItemId: plan.workItemId,
    gateProfile: plan.gateProfile,
    completedScope: plan.summary,
    nextWorkflow: resolveNextWorkflowForRole(plan.toOwner),
    nextFirstAction: plan.nextAction,
    requiredSsot: buildRequiredSsotForRole(plan),
    approvalBoundary: approvalBoundaryForRole(plan.toOwner),
    doNotCross: doNotCrossForRole(plan.toOwner)
  };
}

function buildRequiredSsotForRole(plan) {
  switch (normalizeRoleValue(plan.toOwner)) {
    case "planner":
      return uniquePathList([ARTIFACT_PATHS.requirements, ARTIFACT_PATHS.plan, plan.sourceRef]);
    case "developer":
      return uniquePathList([plan.sourceRef]);
    case "tester":
      return uniquePathList([plan.sourceRef, VALIDATION_REPORT_JSON, VALIDATION_REPORT_MARKDOWN]);
    case "reviewer":
      return uniquePathList([
        plan.sourceRef,
        "reference/artifacts/PACKET_EXIT_QUALITY_GATE.md",
        VALIDATION_REPORT_JSON,
        VALIDATION_REPORT_MARKDOWN
      ]);
    default:
      return uniquePathList([plan.sourceRef]);
  }
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

function buildSecurityReviewSummary({ store, repoRoot, findings = [] }) {
  const activeWorkItem = selectActiveWorkItem(store.listWorkItems(), { repoRoot });
  const contract = resolveSecurityReviewContract({ activeWorkItem, repoRoot });
  if (!contract) {
    return null;
  }

  if (!contract.requested) {
    return {
      additionalFindings: [],
      summary: {
        contractStatus: "not-applicable",
        activationSource: contract.activationSource,
        notApplicableReason: "Reusable security-review evidence is not requested by current packet/runtime metadata."
      }
    };
  }

  const contractFindings = [];
  if (contract.checkedScope.length === 0) {
    contractFindings.push({
      code: "security_review_scope_missing",
      severity: "error",
      message: "Reusable security-review evidence was requested, but no declared security-review scope was provided.",
      recovery: "Declare package manifests, release-facing artifacts, and any explicit security/release paths before rerunning validation."
    });
  }
  if (contract.includeDeclaredPaths && contract.declaredPaths.length === 0) {
    contractFindings.push({
      code: "security_review_declared_paths_missing",
      severity: "error",
      message:
        "Reusable security-review evidence requested declared security/release paths, but no explicit declared paths were provided.",
      recovery: "Add explicit declared security/release paths to the packet/runtime metadata before rerunning validation."
    });
  }
  for (const relativePath of contract.unresolvedDeclaredPaths) {
    contractFindings.push({
      code: "security_review_declared_path_missing",
      severity: "error",
      path: relativePath,
      message: `Declared security/release evidence path does not resolve locally. (${relativePath})`,
      recovery: "Fix or remove the unresolved declared security/release path before rerunning validation."
    });
  }

  const dependencyInventory = buildDependencyInventory(repoRoot, {
    packageManifestPaths: contract.packageManifestPaths
  });
  const releaseArtifactAudit = buildReleaseArtifactAudit(repoRoot, {
    checkedPaths: [...contract.releaseArtifactPaths, ...contract.resolvedDeclaredPaths]
  });
  const secretScan = buildLocalSecretScan({
    repoRoot,
    scanPaths: [
      ...dependencyInventory.scanPaths,
      ...releaseArtifactAudit.checkedArtifacts.map((artifact) => artifact.path)
    ]
  });
  const additionalFindings = [...contractFindings, ...secretScan.findings, ...releaseArtifactAudit.findings];
  const combinedFindings = [...findings, ...additionalFindings];
  const blockingErrors = combinedFindings.filter((finding) => finding?.severity === "error");
  const warnings = combinedFindings.filter((finding) => finding?.severity === "warning");

  return {
    additionalFindings,
    summary: {
      contractStatus: "requested",
      activationSource: contract.activationSource,
      summaryStatus: blockingErrors.length > 0 ? "blocking findings present" : warnings.length > 0 ? "attention needed" : "pre-review baseline checked",
      checkedScope: contract.checkedScope,
      declaredPaths: contract.declaredPaths,
      blockingErrorFindings: blockingErrors.map((finding) => summarizeSecurityFinding(finding)),
      warningFindings: warnings.map((finding) => summarizeSecurityFinding(finding)),
      reviewRequiredCategories: SECURITY_REVIEW_REQUIRED_CATEGORIES,
      operatorNextActions: buildSecurityReviewNextActions({ blockingErrors, warnings }),
      humanReviewStillRequired: [
        "Internal IT/security review is still required for the listed review-required capability categories.",
        "Local automation prepares reusable evidence only. It does not grant formal security approval."
      ],
      outOfScopeNote:
        "This summary is for internal IT/security review preparation only. It does not replace hosted CI, organization-specific approval forms, project-specific runbooks, or formal security approval.",
      dependencyInventory: dependencyInventory.summary,
      localSecretScan: secretScan.summary,
      releaseArtifactAudit: releaseArtifactAudit.summary
    }
  };
}

function buildDependencyInventory(repoRoot, { packageManifestPaths = SECURITY_REVIEW_PACKAGE_MANIFEST_PATHS } = {}) {
  const packages = packageManifestPaths
    .map((relativePath) => readPackageInventory(repoRoot, relativePath, inferPackageLabel(relativePath)))
    .filter(Boolean);

  return {
    scanPaths: packages.map((pkg) => pkg.path),
    summary: {
      packages,
      releaseScripts: packages.flatMap((pkg) =>
        pkg.releaseScripts.map((script) => ({
          packageLabel: pkg.packageLabel,
          script
        }))
      )
    }
  };
}

function inferPackageLabel(relativePath) {
  if (relativePath === "package.json") {
    return "root";
  }
  if (relativePath === "standard-template/package.json") {
    return "standard-template";
  }
  return relativePath;
}

function readPackageInventory(repoRoot, relativePath, packageLabel) {
  const absolutePath = path.resolve(repoRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return null;
  }

  const packageJson = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  return {
    path: relativePath,
    packageLabel,
    packageName: packageJson.name ?? "(unnamed package)",
    nodeEngine: packageJson.engines?.node ?? "not declared",
    directDependencies: Object.keys(packageJson.dependencies ?? {}),
    directDevDependencies: Object.keys(packageJson.devDependencies ?? {}),
    releaseScripts: SECURITY_REVIEW_RELEASE_SCRIPTS.filter((script) => packageJson.scripts?.[script])
  };
}

function buildReleaseArtifactAudit(repoRoot, { checkedPaths = SECURITY_REVIEW_RELEASE_ARTIFACT_PATHS } = {}) {
  const checkedArtifacts = uniqueStringList(checkedPaths).filter((relativePath) =>
    fs.existsSync(path.resolve(repoRoot, relativePath))
  ).map((relativePath) => {
    const absolutePath = path.resolve(repoRoot, relativePath);
    return {
      path: relativePath,
      exists: true,
      byteLength: fs.readFileSync(absolutePath).byteLength
    };
  });
  const findings = [];

  for (const artifact of checkedArtifacts) {
    const absolutePath = path.resolve(repoRoot, artifact.path);
    const content = readTextArtifact(absolutePath);
    if (content == null) {
      continue;
    }

    for (const rule of SECURITY_REVIEW_ARTIFACT_AUDIT_RULES) {
      if (!rule.pattern.test(content)) {
        continue;
      }
      findings.push({
        code: rule.code,
        severity: rule.severity,
        path: artifact.path,
        message: `${rule.message} (${artifact.path})`,
        recovery: rule.recovery
      });
    }
  }

  return {
    checkedArtifacts,
    findings,
    summary: {
      checkedArtifacts,
      findingCount: findings.length
    }
  };
}

function buildLocalSecretScan({ repoRoot, scanPaths }) {
  const findings = [];
  const uniquePaths = uniqueStringList(scanPaths);

  for (const relativePath of uniquePaths) {
    const absolutePath = path.resolve(repoRoot, relativePath);
    const content = readTextArtifact(absolutePath);
    if (content == null) {
      continue;
    }

    for (const rule of SECURITY_REVIEW_SECRET_RULES) {
      if (!rule.pattern.test(content)) {
        continue;
      }
      findings.push({
        code: rule.code,
        severity: rule.severity,
        path: relativePath,
        message: `${rule.message} (${relativePath})`,
        recovery: rule.recovery
      });
    }
  }

  return {
    findings,
    summary: {
      scannedPaths: uniquePaths,
      findingCount: findings.length,
      scanRuleCount: SECURITY_REVIEW_SECRET_RULES.length
    }
  };
}

function readTextArtifact(absolutePath) {
  if (!fs.existsSync(absolutePath)) {
    return null;
  }

  try {
    return fs.readFileSync(absolutePath, "utf8");
  } catch {
    return null;
  }
}

function summarizeSecurityFinding(finding) {
  return {
    code: finding.code,
    message: finding.message,
    path: finding.path ?? null
  };
}

function buildSecurityReviewNextActions({ blockingErrors, warnings }) {
  const actions = [];

  if (blockingErrors.length > 0) {
    actions.push("Resolve every blocking error finding before internal review submission.");
  } else {
    actions.push("Attach the dependency inventory, secret-scan result, and release-artifact audit to the internal review package.");
  }

  if (warnings.length > 0) {
    actions.push("Review the warning findings and clean up risky wording or stale release-facing content before submission.");
  }

  actions.push("Ask the internal IT/security reviewer to assess the review-required capability categories.");
  return actions;
}

function recommendSecurityReviewNextAction({ findings, fallback }) {
  const firstError = findings.find((finding) => finding?.severity === "error");
  if (firstError) {
    return firstError.recovery ?? firstError.message ?? fallback;
  }
  const firstWarning = findings.find((finding) => finding?.severity === "warning");
  if (firstWarning) {
    return firstWarning.recovery ?? firstWarning.message ?? fallback;
  }
  return fallback;
}

function buildValidationReportMarkdown(report) {
  const lines = [
    "# Validation Report",
    "",
    "## Summary",
    `- Executed at: ${report.executedAt}`,
    `- Validator version: ${report.validatorVersion}`,
    `- Cutover ready: ${report.cutoverReady ? "yes" : "no"}`,
    `- Gate decision: ${report.gateDecision}`,
    `- Next action: ${report.nextAction}`,
    "- Surface role: persisted gate evidence only; live re-entry should use `.agents/runtime/ACTIVE_CONTEXT.json` and CLI context/status.",
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

  if (report.securityReview) {
    lines.push("", "## Security Review Summary");
    if (report.securityReview.contractStatus === "not-applicable") {
      lines.push("- Status: not-applicable");
      lines.push(`- Activation source: ${report.securityReview.activationSource}`);
      lines.push(`- Reason: ${report.securityReview.notApplicableReason}`);
    } else {
      lines.push(`- Activation source: ${report.securityReview.activationSource}`);
      lines.push(`- Summary status: ${report.securityReview.summaryStatus}`);
      lines.push(`- Checked scope: ${report.securityReview.checkedScope.join(", ")}`);
      lines.push(
        `- Declared security/release paths: ${
          report.securityReview.declaredPaths.length === 0 ? "none" : report.securityReview.declaredPaths.join(", ")
        }`
      );
      lines.push(
        `- Blocking error findings: ${report.securityReview.blockingErrorFindings.length === 0 ? "none" : report.securityReview.blockingErrorFindings.length}`
      );
      if (report.securityReview.blockingErrorFindings.length > 0) {
        for (const finding of report.securityReview.blockingErrorFindings) {
          lines.push(`  - ${finding.code}: ${finding.message}`);
        }
      }
      lines.push(
        `- Warning findings: ${report.securityReview.warningFindings.length === 0 ? "none" : report.securityReview.warningFindings.length}`
      );
      if (report.securityReview.warningFindings.length > 0) {
        for (const finding of report.securityReview.warningFindings) {
          lines.push(`  - ${finding.code}: ${finding.message}`);
        }
      }
      lines.push("- Review-required categories:");
      for (const category of report.securityReview.reviewRequiredCategories) {
        lines.push(`  - ${category.label}: ${category.reviewNote}`);
      }
      lines.push("- Operator next actions:");
      for (const action of report.securityReview.operatorNextActions) {
        lines.push(`  - ${action}`);
      }
      lines.push("- Human review still required:");
      for (const note of report.securityReview.humanReviewStillRequired) {
        lines.push(`  - ${note}`);
      }
      lines.push(`- Out of scope note: ${report.securityReview.outOfScopeNote}`);

      lines.push("", "## Dependency Inventory");
      for (const pkg of report.securityReview.dependencyInventory.packages) {
        lines.push(`- ${pkg.packageLabel}: ${pkg.packageName} / node ${pkg.nodeEngine}`);
        lines.push(
          `  - direct dependencies: ${pkg.directDependencies.length === 0 ? "none" : pkg.directDependencies.join(", ")}`
        );
        lines.push(
          `  - direct devDependencies: ${pkg.directDevDependencies.length === 0 ? "none" : pkg.directDevDependencies.join(", ")}`
        );
        lines.push(`  - release scripts: ${pkg.releaseScripts.length === 0 ? "none" : pkg.releaseScripts.join(", ")}`);
      }

      lines.push("", "## Local Secret Scan");
      lines.push(`- Scanned paths: ${report.securityReview.localSecretScan.scannedPaths.length}`);
      lines.push(`- Scan rules: ${report.securityReview.localSecretScan.scanRuleCount}`);
      lines.push(
        `- Findings: ${report.securityReview.localSecretScan.findingCount === 0 ? "none" : report.securityReview.localSecretScan.findingCount}`
      );

      lines.push("", "## Release Artifact Audit");
      lines.push(
        `- Checked artifacts: ${report.securityReview.releaseArtifactAudit.checkedArtifacts.length === 0 ? "none" : report.securityReview.releaseArtifactAudit.checkedArtifacts.length}`
      );
      for (const artifact of report.securityReview.releaseArtifactAudit.checkedArtifacts) {
        lines.push(`  - ${artifact.path}`);
      }
      lines.push(
        `- Audit findings: ${report.securityReview.releaseArtifactAudit.findingCount === 0 ? "none" : report.securityReview.releaseArtifactAudit.findingCount}`
      );
    }
  }

  lines.push("", "## Semantic Trace");
  if (!report.traceSummary) {
    lines.push("- none");
  } else {
    lines.push(`- Path: ${report.traceSummary.path}`);
    lines.push(`- Work item: ${report.traceSummary.workItemId}`);
    lines.push(`- Packet: ${report.traceSummary.packetId}`);
    lines.push(`- Turn closed at: ${report.traceSummary.turnClosedAt}`);
    lines.push(`- Status: ${report.traceSummary.semanticTraceStatus}`);
    lines.push(`- Warning count: ${report.traceSummary.warningCount}`);
  }

  lines.push("", "## Candidate Gates");
  for (const gate of report.candidateGates ?? []) {
    lines.push(`- ${gate.id}: ${gate.phase} / ${gate.description}`);
  }

  return `${lines.join("\n")}\n`;
}

function writeAgentTraceArtifact({ store, repoRoot, outputDir, executedAt, report }) {
  const workItems = store.listWorkItems();
  const activeTask = selectActiveWorkItem(workItems, { repoRoot });
  if (!activeTask?.workItemId) {
    return null;
  }

  const latestHandoff = store.listRecentHandoffs(1)[0] ?? null;
  const handoffExecution = resolveHandoffExecution({
    repoRoot,
    workItems,
    latestHandoff,
    includeWorkflowDetails: true
  });
  const packetId = activeTask.sourceRef ? path.basename(activeTask.sourceRef, path.extname(activeTask.sourceRef)) : null;
  const requiredSsot = uniquePathList(
    latestHandoff?.payload?.requiredSsot ?? [
      ARTIFACT_PATHS.active,
      ".agents/artifacts/TASK_LIST.md",
      ARTIFACT_PATHS.plan,
      activeTask.sourceRef
    ]
  );
  const declaredReadEvidence = uniquePathList([
    ARTIFACT_PATHS.requirements,
    ARTIFACT_PATHS.architecture,
    ARTIFACT_PATHS.plan,
    ARTIFACT_PATHS.preventive,
    activeTask.sourceRef,
    VALIDATION_REPORT_JSON
  ]);
  const approvedDesignRefs = uniquePathList([
    ARTIFACT_PATHS.requirements,
    ARTIFACT_PATHS.architecture,
    ARTIFACT_PATHS.plan,
    activeTask.sourceRef
  ]);
  const implementationRefs = [];
  const verificationRefs = uniquePathList([VALIDATION_REPORT_JSON, VALIDATION_REPORT_MARKDOWN]);
  const warningCount = buildAgentTraceWarnings({
    requiredSsot,
    declaredReadEvidence,
    approvedDesignRefs
  }).length;
  const semanticTraceContract = resolveSemanticTraceContract({ activeWorkItem: activeTask, repoRoot });
  const trace = {
    schemaVersion: AGENT_TRACE_SCHEMA_VERSION,
    workItemId: activeTask.workItemId,
    packetId,
    role: activeTask.owner ?? latestHandoff?.toRole ?? null,
    workflow:
      handoffExecution.workflow === "manual_selection_required" ? null : handoffExecution.workflow,
    turnClosedAt: executedAt,
    requiredSsot,
    declaredReadEvidence,
    approvedDesignRefs,
    implementationRefs,
    verificationRefs,
    semanticTrace: {
      hardFailCodes: PHASE1_HARD_FAIL_CODES,
      warningCodes: PHASE1_WARNING_CODES,
      reviewerOnlyCodes: PHASE1_REVIEWER_ONLY_CODES,
      candidateGateIds: PHASE1_CANDIDATE_GATES.map((gate) => gate.id),
      sourceRefsResolved: allRefsResolve(repoRoot, [
        ...requiredSsot,
        ...declaredReadEvidence,
        ...approvedDesignRefs,
        ...implementationRefs,
        ...verificationRefs
      ]),
      validatorGateDecision: report.gateDecision,
      readyForCode: activeTask.metadata?.readyForCode ?? null,
      contractStatus: semanticTraceContract?.contractStatus ?? "not-requested",
      activationSource: semanticTraceContract?.activationSource ?? "not declared"
    },
    selfCheck: {
      findingCount: report.findings.length,
      blockingFindingCount: report.findings.filter((finding) => finding?.severity === "error").length,
      warningCount
    },
    handoff: latestHandoff
      ? {
          createdAt: latestHandoff.createdAt,
          fromRole: latestHandoff.fromRole,
          toRole: latestHandoff.toRole,
          sourceRef: latestHandoff.sourceRef ?? null,
          summary: latestHandoff.handoffSummary
        }
      : null
  };

  const relativePath = `${AGENT_TRACES_DIR}/${activeTask.workItemId}.json`;
  const absolutePath = path.resolve(outputDir, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, `${JSON.stringify(trace, null, 2)}\n`, "utf8");

  return {
    summary: {
      path: relativePath,
      workItemId: trace.workItemId,
      packetId: trace.packetId,
      turnClosedAt: trace.turnClosedAt,
      semanticTraceStatus: warningCount > 0 ? "warning" : "pass",
      warningCount,
      candidateGateCount: PHASE1_CANDIDATE_GATES.length
    }
  };
}

function buildAgentTraceWarnings({ requiredSsot, declaredReadEvidence, approvedDesignRefs }) {
  const warnings = [];
  if (declaredReadEvidence.length < Math.max(3, Math.min(requiredSsot.length, approvedDesignRefs.length))) {
    warnings.push("evidence_linkage_thin");
  }
  return warnings;
}

function allRefsResolve(repoRoot, refs) {
  return refs.every((ref) => !ref || fs.existsSync(path.resolve(repoRoot, ref)));
}

function uniquePathList(paths) {
  return [...new Set((paths ?? []).filter((item) => typeof item === "string" && item.length > 0))];
}

function uniqueStringList(values) {
  return [...new Set((values ?? []).filter((value) => typeof value === "string" && value.length > 0))];
}

function normalizeRoleValue(role) {
  return String(role ?? "").trim().toLowerCase();
}

function resolveNextWorkflowForRole(role) {
  const workflow = workflowForOwner(role);
  return workflow === "manual_selection_required" ? null : workflow;
}

function approvalBoundaryForRole(role) {
  switch (normalizeRoleValue(role)) {
    case "planner":
      return "Do not start implementation, testing, or closeout work until the required route and approval are explicit.";
    case "developer":
      return "Implement only the approved packet scope. Do not change approval state, workflow authority, or unrelated governance surfaces.";
    case "tester":
      return "Verify the approved scope only. Do not rewrite implementation or change approval state.";
    case "reviewer":
      return "Assess closeout readiness only. Do not implement fixes or change approval state from the review lane.";
    default:
      return "Stay inside the approved packet and workflow authority. Escalate instead of guessing.";
  }
}

function doNotCrossForRole(role) {
  switch (normalizeRoleValue(role)) {
    case "planner":
      return [
        "No implementation or approval-state mutation.",
        "No testing or reviewer closeout work.",
        "No guessing a workflow when the route is unclear."
      ];
    case "developer":
      return [
        "No approval-state changes.",
        "No unrelated routing or governance edits.",
        "No manual edits to generated state docs."
      ];
    case "tester":
      return [
        "No implementation changes.",
        "No approval-state changes.",
        "No manual edits to generated state docs."
      ];
    case "reviewer":
      return [
        "No implementation changes.",
        "No tester verification rewrite.",
        "No packet closeout without reviewer rationale."
      ];
    default:
      return ["Do not exceed the current packet scope or workflow authority."];
  }
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
