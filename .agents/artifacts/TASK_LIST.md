# Task List

## Current Release Target
- Preserve the V1.2 installable harness baseline while `PLN-07` continues the V1.3 PMW operator-console and workflow-contract lane after `DEV-08` packet exit closeout approval.

## Active Locks
| Task ID | Scope | Owner | Status | Started At | Notes |
|---|---|---|---|---|---|
| PLN-07 | V1.3 PMW operator console and workflow-contract planning | planner | active | 2026-04-27 | Preserve the V1.2 installable baseline while promoting the approved V1.3 direction into canonical requirements, DB hot-state, generated docs, and PMW export. |

## Active Tasks
| Task ID | Title | Scope | Owner | Status | Priority | Depends On | Verification |
|---|---|---|---|---|---|---|---|
| PLN-07 | V1.3 PMW operator console and workflow-contract planning | Promote the approved V1.3 draft into canonical requirements, open the planner-owned workflow-contract lane, and preserve the V1.2 installable baseline while PMW/SSOT contracts evolve. | planner | in_progress | P0 | REL-02 | canonical requirements sync, DB/generated-doc reconciliation, validator clean |
- Preserve the V1.2 installable project-generator payload in `standard-template/`, `installer/`, `pmw-app/`, `packaging/`, and `reference/manuals/` while V1.3 planning stays in the canonical-doc / runtime-contract layer.
- Keep root `.agents/artifacts/*`, `.harness/operating_state.sqlite`, `.agents/runtime/generated-state-docs/*`, and `.agents/artifacts/VALIDATION_REPORT.*` aligned with the same active planning baseline.
- Keep `PRF-04` through `PRF-09` as the current approved reusable profile catalog.
- Treat `reference/packets/PKT-01_DEV-07_PMW_V1_3_OPERATOR_CONSOLE_FIRST_VIEW.md` as the closed evidence packet for the PMW V1.3 first-view implementation while `PLN-07` selects the next V1.3 planning step.
- Next first action: Planner should select the next `PLN-07` V1.3 PMW operator-console / workflow-contract planning step now that `DEV-08` packet exit is approved.
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
| DEV-07 | PMW V1.3 operator console first-view implementation | 2026-05-01 | PMW browser/user testing, `npm.cmd test` in `pmw-app`, targeted PMW/read-model tests, root `npm.cmd test`, `npm.cmd run harness:validate`, Reviewer re-check | Implemented the first-view hierarchy and closed the artifact-preview path-boundary review finding. |
| DEV-08 | Workflow contracts and handoff routing packet | 2026-05-02 | root/starter targeted read-model tests, root/starter full tests, validator, handoff, PMW export, validation report, Reviewer closeout | Closed after workflow contract routing, PM workflow addition, PMW Action Board `nextTask` source-owner routing remediation, Tester re-verification, and Reviewer closeout approval. |

## Handoff Log
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
