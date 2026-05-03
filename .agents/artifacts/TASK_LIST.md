# Task List

## Current Release Target
- Preserve the V1.2 installable harness baseline while `PLN-08` defines the V1.3 phase-2 PMW command-surface lane after the closed `OPS-03` reliability rebaseline, without weakening governance gates.

## Active Locks
| Task ID | Scope | Owner | Status | Started At | Notes |
|---|---|---|---|---|---|
| PLN-08 | V1.3 PMW phase-2 command surface planning | planner | active | 2026-05-03 | planner-owned planning draft; gate contract; close the phase-2 PMW command promotion scope before any implementation packet opens. |

## Active Tasks
| Task ID | Title | Scope | Owner | Status | Priority | Depends On | Verification |
|---|---|---|---|---|---|---|---|
| PLN-08 | V1.3 PMW phase-2 command surface planning | Decide whether `doctor`, `test`, and `validation-report` remain terminal-only or are promoted into a later PMW command-surface packet, while preserving PMW read-only authority, confirmation boundaries, and root/starter sync. | planner | planning | P0 | OPS-03 | gate contract; user approval required before any implementation packet opens. |
- Preserve the V1.2 installable project-generator payload in `standard-template/`, `installer/`, `pmw-app/`, `packaging/`, and `reference/manuals/` while V1.3 planning stays in the canonical-doc / runtime-contract layer.
- Keep root `.agents/artifacts/*`, `.harness/operating_state.sqlite`, `.agents/runtime/generated-state-docs/*`, and `.agents/artifacts/VALIDATION_REPORT.*` aligned with the same active planning baseline.
- Keep `PRF-04` through `PRF-09` as the current approved reusable profile catalog.
- Treat `reference/packets/PKT-01_DEV-07_PMW_V1_3_OPERATOR_CONSOLE_FIRST_VIEW.md` as the closed evidence packet for the PMW V1.3 first-view implementation while `PLN-08` defines the next V1.3 planning step.
- Treat `reference/packets/PKT-01_DEV-09_PMW_PHASE_1_COMMAND_LAUNCHER_AND_HANDOFF_EXECUTION.md` as the closed evidence packet for the PMW phase-1 command launcher and handoff execution scope.
- Treat `reference/packets/PKT-01_OPS-03_HARNESS_OPERATION_FRICTION_REDUCTION.md` as the closed evidence packet for the expanded harness operation reliability lane.
- Treat `reference/planning/PLN-08_PMW_V1_3_PHASE_2_COMMAND_SURFACE_DRAFT.md` as the active planning source for the next V1.3 PMW command-surface lane.
- Next first action: Planner should finish the PLN-08 draft and get user approval on the phase-2 PMW command promotion scope before any implementation packet opens.
- V1.3 phase-1 PMW launcher scope is `status`, `next`, `explain`, `validate`, `handoff`, and `pmw-export`.
- `doctor`, `test`, and `validation-report` remain terminal-only guidance in phase-1 until a later V1.3 packet explicitly promotes them.
- Treat any future release-baseline mismatch between code, manuals, packaging, DB hot-state, or canonical artifacts as a blocking validator failure.

## Blocked Tasks
| Task ID | Blocker | Owner | Status | Unblock Condition | Verification |
|---|---|---|---|---|---|
| - | None | - | clear | - | - |

## Completed Tasks
| Task ID | Title | Completed At | Verification | Notes |
|---|---|---|---|---|
| PLN-06-REQ | PLN-06 requirements sharpening | 2026-04-26 | user approval | P0/P1/P2, validator levels, command contract, sync contract, state vocabulary, profile/packet readiness added. |
| PLN-06 | Standalone Business Harness V1.1 implementation | 2026-04-26 | root/starter tests, validator, operator commands, validation report, review closeout | No essential readiness item deferred. |
| REL-02 | V1.2 installable harness / PMW baseline reconciliation | 2026-04-27 | root `npm test`, `node --test pmw-app/test/*.test.js`, `npm run harness:validation-report`, release-baseline validator checks | Reconciled already-implemented installable packaging, separate PMW app, PRF-07/08/09 hardening, and SSOT/DB truth after drift review. |
| PLN-07 | V1.3 PMW operator console and workflow-contract planning | 2026-05-02 | DEV-07, DEV-08, DEV-09 packet closeouts, root/starter validation, PMW export, validation report | Closed after delivering the approved PMW first view, workflow contracts/handoff routing, PM workflow addition, phase-1 command launcher, terminal-only guidance, and handoff baton execution scope. |
| DEV-07 | PMW V1.3 operator console first-view implementation | 2026-05-01 | PMW browser/user testing, `npm.cmd test` in `pmw-app`, targeted PMW/read-model tests, root `npm.cmd test`, `npm.cmd run harness:validate`, Reviewer re-check | Implemented the first-view hierarchy and closed the artifact-preview path-boundary review finding. |
| DEV-08 | Workflow contracts and handoff routing packet | 2026-05-02 | root/starter targeted read-model tests, root/starter full tests, validator, handoff, PMW export, validation report, Reviewer closeout | Closed after workflow contract routing, PM workflow addition, PMW Action Board `nextTask` source-owner routing remediation, Tester re-verification, and Reviewer closeout approval. |
| DEV-09 | PMW phase-1 command launcher and handoff execution packet | 2026-05-02 | PMW app tests, root/starter tests, status/next/explain/validate/handoff/pmw-export/validation-report evidence, Reviewer closeout | Closed after implementing and verifying the approved PMW Actions / Terminal Actions split, confirmation boundaries, selected-project execution, session result surface, and handoff baton context. |
| OPS-03 | Harness operation reliability and friction reduction packet | 2026-05-03 | transition planner -> planner; gate contract | Planner recorded OPS-03 closeout after reviewer-approved exit and remediation re-verification. Planner should choose the next approved lane; do not reopen implementation without a new human-approved packet. |

## Handoff Log
- 2026-05-03: [planner -> planner] Opened PLN-08 planning lane to define the V1.3 phase-2 PMW command-surface scope after OPS-03 closeout. | Planner should finish the PLN-08 draft and get user approval on the phase-2 PMW command promotion scope before any implementation packet opens.
- 2026-05-03: [planner -> planner] Planner recorded OPS-03 closeout after reviewer-approved exit and remediation re-verification. | Planner should choose the next approved lane; do not reopen implementation without a new human-approved packet.
- 2026-05-03: [reviewer -> planner] OPS-03 packet exit approved after revised-scope remediation and re-verification; Planner should record closeout and choose the next lane. | Planner should record OPS-03 closeout, reconcile completed-task state, and choose the next approved lane.
- 2026-05-03: [tester -> reviewer] Tester re-verified the CURRENT_STATE transition remediation; stale wording is gone, reviewer-source Ready For Code handling is preserved, and validation evidence passed. | Reviewer should re-check OPS-03 closeout readiness against the approved SSOT, revised walkthrough evidence, residual debt disposition, and validation outputs.
- 2026-05-03: [developer -> tester] Developer remediated CURRENT_STATE transition stale wording and Ready For Code fallback handling; regression coverage and validation evidence passed. | Tester should re-verify CURRENT_STATE transition refresh, reviewer-source Ready For Code preservation, root/starter regression coverage, validator, PMW export, and validation report.
- 2026-05-03: [reviewer -> developer] Reviewer found stale CURRENT_STATE transition wording after tester handoff; Developer should remediate the update path and add coverage. | Update the CURRENT_STATE transition refresh path, add regression coverage, rerun tests, validator, PMW export, and validation report, then hand back to Tester.
- 2026-05-03: [tester -> reviewer] Tester verified the revised OPS-03 scope against the approved SSOT; behavior guidance, project-design precedence, PMW Artifact Library access, and validation evidence passed. | Reviewer should assess revised OPS-03 closeout readiness against the approved SSOT, walkthrough evidence, residual debt disposition, and validation outputs.
- 2026-05-03: [developer -> tester] Developer implemented the revised OPS-03 scope: sufficient behavior guidance, project-design SSOT precedence, workflow closeout reporting, PMW design Artifact Library access, and validation coverage. | Tester should verify the revised OPS-03 implementation against REQUIREMENTS.md, ARCHITECTURE_GUIDE.md, IMPLEMENTATION_PLAN.md, the OPS-03 packet, root/starter sync, PMW Artifact Library project-design access, PMW preview width behavior, validator coverage, PMW export, validation report, and test evidence.
- 2026-05-03: [planner -> developer] OPS-03 revised scope Ready For Code approved by user; Developer starts revised implementation. | Developer should implement the revised OPS-03 gaps: sufficient Karpathy-style behavior guidance, project-design SSOT precedence enforcement, PMW Artifact Library project-design access and wider reading body, then rerun root/starter/PMW tests, validator, PMW export, and validation report.
- 2026-05-03: [user -> planner] OPS-03 planning reopened after user clarification. | Planner should revise OPS-03 so Karpathy-style behavior guidance is sufficiently integrated without conflicting with harness governance, project-design SSOT guides all agents, and PMW Artifact Library makes whole-project design artifacts wider and always discoverable.
- 2026-05-03: [planner -> user] OPS-03 revised agreement finalized. | User should approve, adjust, or hold `Ready For Code for revised scope`; Developer handoff remains blocked until explicit approval.
- 2026-05-02: [reviewer -> developer] OPS-03 closeout readiness review found current-state/history split and agent behavior guidance adoption gaps. | Superseded as next action by the 2026-05-03 user-to-planner rebaseline; preserve as review history.
- 2026-05-02: [tester -> reviewer] OPS-03 Tester re-verification passed after Reviewer-finding remediation. | Reviewer should review OPS-03 closeout readiness, residual debt disposition, transition guard evidence, validation evidence, and decide packet exit.
- 2026-05-02: [developer -> tester] Developer remediated Reviewer transition findings: Ready For Code handoff guards, open-decision guard, post-apply validation failure reporting, and PMW Next Action freshness. | Re-verify OPS-03 reviewer-finding remediation: Ready For Code transition guards, open-decision guard, post-apply validation failure reporting, Implementation Plan PMW Next Action freshness, tests, validator, PMW export, and validation report.
- 2026-05-02: [reviewer -> developer] Reviewer found transition approval and validation-result reporting gaps; Developer remediation required. | Remediate planner-to-developer Ready For Code guards and post-apply validation failure reporting, then hand off to Tester.
- 2026-05-02: [tester -> reviewer] OPS-03 Tester re-verification passed after Developer remediation; mixed timestamp handoff ordering, transition canonical-doc updates, PMW Re-entry Baton/recentHandoff freshness, root/starter/PMW tests, validator, PMW export, and validation report passed. | Reviewer should review OPS-03 closeout readiness, confirm residual debt disposition, and decide packet exit.
- 2026-05-02: [developer -> tester] OPS-03 Developer remediated PMW stale handoff ordering and transition canonical-doc update gaps; root/starter/PMW tests and validator pass. | Tester should re-verify OPS-03 remediation evidence, especially PMW recentHandoff/Re-entry Baton freshness after mixed timezone handoff rows and transition canonical-doc updates.
- 2026-05-02: [tester -> developer] OPS-03 Tester verification found stale PMW handoff evidence despite passing tests and validator. | Developer should make PMW read-model recentHandoff/Re-entry Baton use the latest developer-to-tester handoff evidence, add regression coverage, then rerun PMW export, validation report, and tests.
- 2026-05-02: [developer -> tester] OPS-03 Developer reconciliation completed: root/starter sync restored, approval-state consistency guarded, tests and validator pass, PMW export/report refreshed. | Tester should verify OPS-03 acceptance evidence across root, standard-template, PMW app, validator, PMW export, validation report, and handoff behavior.
- 2026-05-02: `[developer -> developer] OPS-03 partial implementation audit completed | keep/revise/drop classification recorded in packet | next reconcile root/starter sync drift and failing root tests`
- 2026-05-02: `[planner -> developer] OPS-03 Ready For Code explicitly approved | Developer starts by auditing interrupted partial implementation | classify each existing change as keep/revise/drop before continuing implementation`
- 2026-05-02: `[planner -> planner] OPS-03 detailed agreement approved per Planner recommendation | Ready For Code was still pending at that time as a separate approval boundary | ask user for explicit implementation approval before Developer handoff`
- 2026-05-02: `[planner -> planner] OPS-03 detailed agreement proposal drafted | approval boundary ready for user decision | Ready For Code was still pending at that time`
- 2026-05-02: `[planner -> planner] OPS-03 rebaseline in progress | combine operation friction, approval/SSOT consistency, and agent behavior guidance | Ready For Code was still pending at that time`
- 2026-05-02: `[reviewer -> planner] DEV-09 packet exit approved | no open finding remains | finalize OPS-03 harness operation friction reduction plan`
- 2026-05-02: `[tester -> reviewer] DEV-09 Tester verification passed | PMW Actions / Terminal Actions, confirmation boundaries, result surface, terminal-only guidance, and handoff baton verified`
- 2026-05-02: `[developer -> tester] DEV-09 implementation completed | verify PMW Actions / Terminal Actions, command execution boundaries, result surface, and handoff baton behavior`
- 2026-05-02: `[planner -> developer] DEV-09 Ready For Code approved | implement PMW phase-1 command launcher and handoff baton behavior under approved packet scope`
- 2026-05-02: `[planner -> planner] DEV-09 detailed agreement approved | validate runs without confirmation | PMW Actions/Terminal Actions labels approved | handoff baton must show previous and next agent/work summaries | Ready For Code still pending`
- 2026-05-02: `[planner -> planner] DEV-09 packet draft opened | PMW phase-1 command launcher and handoff execution scope proposed | detailed function/UI agreement and Ready For Code remain pending`
- 2026-05-02: `[reviewer -> planner] DEV-08 packet exit approved | no open finding remains | select next PLN-07 V1.3 planning step`
- 2026-05-02: `[tester -> reviewer] DEV-08 PMW next-task owner/workflow re-verification passed | Action Board PLN-07 routes planner/plan.md | review packet exit closeout`
- 2026-05-02: `[developer -> tester] DEV-08 PMW next-task owner/workflow remediation completed | root/starter tests passed | verify Action Board nextTask route parity and PMW evidence`
- 2026-05-02: `[reviewer -> developer] DEV-08 packet exit review found PMW next-task owner/workflow mismatch | fix Action Board routing and add root/starter regression coverage`
- 2026-05-01: `[tester -> reviewer] DEV-08 Tester re-verification passed | PM workflow routing and remediation evidence clean | review packet exit gate and closeout readiness`
- 2026-05-01: `[developer -> tester] DEV-08 PM workflow addition completed | root/starter tests and validator passed | verify PM workflow contract, PM routing, and root/starter sync`
- 2026-05-01: `[developer -> tester] DEV-08 route ambiguity and missing-workflow diagnostic remediation completed | root/starter tests and validator passed | re-verify negative routing cases and PMW diagnostics`
- 2026-05-01: `[tester -> developer] DEV-08 verification found route ambiguity and missing-workflow diagnostic gaps | positive tests passed | remediate alias matching and read-model route diagnostics`
- 2026-05-01: `[developer -> tester] DEV-08 workflow contracts and handoff routing implemented | root/starter tests and validator passed | verify contract parsing, route behavior, and PMW/handoff evidence`
- 2026-05-01: `[planner -> planner] DEV-08 detailed agreement recommended | Ready For Code remains pending | user should approve or adjust before developer handoff`
- 2026-05-01: `[reviewer -> planner] DEV-07 review approved and closed | no open finding remains | decide next PLN-07 V1.3 planning step`
- 2026-05-01: `DEV-07` Developer remediated the PMW artifact-preview path-boundary finding with segment-aware containment and regression coverage; active work is now Reviewer re-check.
- 2026-05-01: `DEV-07` tester verification and user testing completed. Reviewer found one PMW artifact-preview path-boundary defect and handed remediation back to Developer.
- 2026-04-30: `DEV-07` developer implementation and validation completed. Active work is now tester-owned verification of the V1.3 PMW first view, command split, artifact preview, and re-entry behavior.
- 2026-04-27: `DEV-07 Ready For Code` approved. Active work is now developer-owned implementation of the V1.3 PMW first view.
- 2026-04-27: `DEV-07` function and UI/UX agreement closed. Remaining approval boundary is `Ready For Code` for the first V1.3 PMW implementation lane.
- 2026-04-27: `PLN-07` drafted `DEV-07` as the immediate next planning packet; hold implementation until the packet closes detailed function agreement, detailed UI/UX agreement, and `Ready For Code`.
- 2026-04-27: Opened `PLN-07` after approving the V1.3 PMW operator-console and workflow-contract draft; preserve the V1.2 installable baseline while promoting the new direction into canonical requirements and planning state.
- 2026-04-27: Closed `REL-02` after reconciling the already-implemented V1.2 installable baseline into canonical docs, DB hot-state, generated docs, and validation artifacts, and after adding release-baseline drift validation.
- 2026-04-26: Finalized installable harness packaging and repo cleanup in commit `b225956`, adding Windows installers, separate PMW packaging, manuals, and PRF-07/08/09 hardening.
- 2026-04-26: Closed `PLN-06` V1.1 after moving harness runtime/test ownership under `.harness/`, adding standalone command UX, validation reports, structured task truth, layout ownership, active profile contract, PRF-04/05/06, packet readiness evidence, validator enforcement, and synchronized `standard-template/`.
- 2026-04-24: Closed `DEV-06` and `REV-04`; preserve the real-world-ready starter surface and reopen only if a copied-starter usability blocker reappears.
- 2026-04-23: Closed `REV-03` after confirming the SIM-01 / SIM-02 / SIM-03 remediation set introduced no open reusable finding and root/starter validation stayed clean.
