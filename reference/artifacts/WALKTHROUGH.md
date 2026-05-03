# Walkthrough

Use this artifact to record verification evidence and manual test results.

## 2026-05-03 OPS-03 CURRENT_STATE Transition Remediation Tester Re-Verification

- Scope: tester re-verification for the revised `OPS-03` closeout-remediation after Reviewer found stale `CURRENT_STATE.md` transition wording and reviewer-source Ready For Code display drift.
- Environment: local maintainer workspace on Windows PowerShell.
- Tested scope:
  - Root and `standard-template` `dev05-tooling` regression coverage for keyed current-state truth-note refresh on `tester-to-reviewer`.
  - Root and `standard-template` `dev05-tooling` regression coverage for reviewer-to-developer transitions that use `reference/artifacts/REVIEW_REPORT.md` as `sourceRef` while preserving `Ready For Code: approved`.
  - Root and `standard-template` full regression suites after the remediation.
  - Root validator, PMW export, validation report, and canonical `CURRENT_STATE.md` state after the remediation handoff returned to `developer -> tester`.
- Evidence:
  - root `node --test .harness\test\dev05-tooling.test.js`: 20/20 pass.
  - `standard-template` `node --test standard-template\.harness\test\dev05-tooling.test.js`: 20/20 pass.
  - root `npm.cmd test`: 46/46 pass.
  - `standard-template` `npm.cmd test`: 46/46 pass.
  - root `npm.cmd run harness:validate`: `ok: true`, `cutoverReady: true`, findings `[]`.
  - root `npm.cmd run harness:pmw-export`: pass; PMW read-model now keeps the active packet source on `reference/packets/PKT-01_OPS-03_HARNESS_OPERATION_FRICTION_REDUCTION.md` and shows the active handoff as `developer -> tester`.
  - root `npm.cmd run harness:validation-report`: pass, gate decision `pass`, findings `[]`.
  - canonical `.agents/artifacts/CURRENT_STATE.md` no longer contains stale `Tester verification ... pending` wording and now reports `- \`OPS-03\` remains the active work item. Current handoff is \`developer -> tester\`; stage is \`verification\`; gate profile is \`contract\`.`
- Untested scope:
  - No additional PMW browser visual walkthrough was performed because the remediation changed transition/current-state behavior and regression coverage already verified the affected runtime paths.
  - Reviewer closeout was not performed in this tester pass.
- Result: tester re-verification passed; no Tester-discovered remediation item remains for the CURRENT_STATE transition fix.
- Handoff:
  - Reviewer should re-check OPS-03 closeout readiness against the approved SSOT, revised walkthrough evidence, review findings history, residual debt disposition, and validation outputs.

## 2026-05-03 OPS-03 Revised-Scope Tester Verification

- Scope: tester verification for the revised `OPS-03` scope after Developer implemented sufficient behavior guidance adoption, project-design SSOT precedence, workflow closeout reporting, and PMW Artifact Library design access.
- Environment: local maintainer workspace on Windows PowerShell.
- Tested scope:
  - Root and `standard-template` reusable behavior-guidance, transition, read-model, and PMW-read-surface targeted regression coverage.
  - `pmw-app` server/test coverage for widened artifact preview layout and project-design Artifact Library access.
  - Root and `standard-template` full regression suites after the revised OPS-03 implementation.
  - Root validator, PMW export, and validation report regeneration after the revised implementation.
  - SSOT alignment against `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, and `reference/packets/PKT-01_OPS-03_HARNESS_OPERATION_FRICTION_REDUCTION.md`.
- Evidence:
  - root `node --test .harness\test\dev05-tooling.test.js .harness\test\context-restoration-read-model.test.js .harness\test\pmw-read-surface.test.js`: 24/24 pass.
  - `standard-template` `node --test standard-template\.harness\test\dev05-tooling.test.js standard-template\.harness\test\context-restoration-read-model.test.js standard-template\.harness\test\pmw-read-surface.test.js`: 24/24 pass.
  - `pmw-app` `npm.cmd test`: 2/2 pass.
  - root `npm.cmd test`: 44/44 pass.
  - `standard-template` `npm.cmd test`: 44/44 pass.
  - root `npm.cmd run harness:validate`: `ok: true`, `cutoverReady: true`, findings `[]`.
  - root `npm.cmd run harness:pmw-export`: pass; PMW read-model exposes `Project Design And Overview` with `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, and related overview/design artifacts.
  - root `npm.cmd run harness:validation-report`: pass, gate decision `pass`, findings `[]`.
- Untested scope:
  - No additional manual PMW browser visual walkthrough was performed in this pass. Revised PMW width/category behavior was covered through `pmw-app` regression tests and exported read-model evidence rather than a new browser session.
  - Reviewer closeout was not performed in this tester pass.
- Result: tester verification passed; no Tester-discovered remediation item remains for the revised OPS-03 scope.
- Handoff:
  - Reviewer should inspect closeout readiness against the approved SSOT, tester evidence, residual debt disposition, PMW Artifact Library design access evidence, and validation outputs.

## 2026-05-03 OPS-03 Reviewer-Finding Remediation Tester Re-Verification

- Scope: tester re-verification for `OPS-03` after Reviewer found transition approval and validation-result reporting gaps.
- Environment: local maintainer workspace on Windows PowerShell.
- Tested scope:
  - `planner-to-developer` transition blocks when packet `Ready For Code` is not approved.
  - `planner-to-developer` transition blocks when an open Ready For Code decision for the packet is not closed through `--close-decision`.
  - `harness:transition --apply` reports post-apply validation-report failure at top level with `ok: false`.
  - `.agents/artifacts/IMPLEMENTATION_PLAN.md` `## Operator Next Action` is refreshed as the PMW Next Action source.
  - Root and `standard-template` regression coverage stays synchronized.
  - PMW export, validation report, handoff routing, and next-action evidence stay fresh after Tester handoff.
- Evidence:
  - root `node --test .harness\test\dev05-tooling.test.js`: 17/17 pass.
  - `standard-template` `node --test standard-template\.harness\test\dev05-tooling.test.js`: 17/17 pass.
  - root `npm.cmd test`: 43/43 pass.
  - `standard-template` `npm.cmd test`: 43/43 pass.
  - `pmw-app` `npm.cmd test`: 2/2 pass.
  - root `npm.cmd run harness:validate`: `ok: true`, `cutoverReady: true`, findings `[]`.
  - root `npm.cmd run harness:pmw-export`: pass; PMW `Next Action` and Re-entry Baton reflected the active OPS-03 handoff.
  - root `npm.cmd run harness:validation-report`: pass, gate decision `pass`, findings `[]`.
  - `npm.cmd run harness:transition -- --transition tester-to-reviewer --work-item OPS-03 ...`: preview passed, then apply passed with validation report `ok: true` and finding count `0`.
  - Post-handoff root `npm.cmd run harness:handoff`: `routeStatus: ready`, next owner `reviewer`, route `.agents/workflows/review.md`.
  - Post-handoff root `npm.cmd run harness:next`: validation pass, next owner `reviewer`, next task `OPS-03`.
- Untested scope:
  - No PMW browser visual verification was performed because the remediation changed transition guards, canonical state refresh, and read-model evidence rather than browser layout.
  - No arbitrary shell execution was tested because it remains outside the approved PMW launcher boundary.
- Result: tester re-verification passed; no Tester-discovered remediation item remains.
- Handoff:
  - Reviewer should review OPS-03 closeout readiness, residual debt disposition, transition guard evidence, validation evidence, and decide packet exit.

## 2026-05-02 DEV-09 PMW Phase-1 Command Launcher Tester Verification

- Scope: tester verification for the approved `DEV-09` PMW phase-1 command launcher and handoff execution packet.
- Environment: local maintainer workspace on Windows PowerShell.
- Tested scope:
  - PMW launcher command catalog is limited to `status`, `next`, `explain`, `validate`, `handoff`, and `pmw-export`.
  - `doctor`, `test`, and `validation-report` remain Terminal Actions, not PMW launcher actions.
  - `validate` remains diagnostic and no-confirmation.
  - `handoff` and `pmw-export` require confirmation before PMW launch.
  - Unknown launcher command rejection, selected-project scoping, one in-flight command per project, session result metadata, stdout/stderr capture, related artifact links, and handoff baton previous/next work context are covered.
  - Root and `standard-template` reusable command metadata remain synchronized.
- Evidence:
  - `pmw-app` `npm.cmd test`: 2/2 pass.
  - root `npm.cmd test`: 36/36 pass.
  - `standard-template` `npm.cmd test`: 36/36 pass.
  - root `npm.cmd run harness:status`: pass, current assignment `DEV-09` / `tester` / `ready_for_test`.
  - root `npm.cmd run harness:next`: pass, next owner `tester`, next task `DEV-09`.
  - root `npm.cmd run harness:explain`: pass, no blockers.
  - root `npm.cmd run harness:validate`: `ok: true`, findings `[]`.
  - root `npm.cmd run harness:handoff`: `routeStatus: ready`, next owner `tester`, route `.agents/workflows/test.md`.
  - root `npm.cmd run harness:pmw-export`: pass, exported `PMW Actions` / `Terminal Actions`, `validate.confirmationRequired: false`, `handoff.confirmationRequired: true`, `pmw-export.confirmationRequired: true`, and re-entry baton previous/next work summaries.
  - root `npm.cmd run harness:validation-report`: gate decision `pass`, findings `[]`.
- Untested scope:
  - No arbitrary shell execution was tested because it is explicitly out of scope.
  - No persistent cross-session command history was tested because session-scoped results are the approved boundary.
  - No browser visual screenshot was captured in this pass; PMW app tests directly assert the rendered command labels, command split, confirmation policy, terminal-only guidance, result metadata, and handoff baton content.
- Result: tester verification passed; no Tester-discovered remediation item remains.
- Handoff:
  - Reviewer should inspect DEV-09 packet exit closeout readiness, source parity, residual debt disposition, PMW command boundary, root/starter sync, and validation evidence.

## 2026-05-02 DEV-08 PMW Action Board NextTask Tester Re-Verification

- Scope: tester re-verification for the `DEV-08` PMW Action Board `nextTask` owner/workflow remediation after Reviewer found that `PLN-07` was displayed using the current handoff route.
- Environment: local maintainer workspace on Windows PowerShell.
- Tested scope:
  - PMW Action Board route parity for an active `DEV-08` tester-owned task followed by planner-owned `PLN-07`.
  - Root and `standard-template` synchronization for the changed read-model runtime and regression test files.
  - Root and `standard-template` targeted read-model regression tests.
  - Root and `standard-template` full test suites.
  - Root validator, handoff, PMW export, validation report, and status evidence.
- Evidence:
  - PMW Action Board `currentTask`: `DEV-08`, `owner: tester`, `workflow: .agents/workflows/test.md`.
  - PMW Action Board `nextTask`: `PLN-07`, `owner: planner`, `workflow: .agents/workflows/plan.md`.
  - Root/starter file sync check: `.harness/runtime/state/context-restoration-read-model.js sync=True`; `.harness/test/context-restoration-read-model.test.js sync=True`.
  - root `node --test .harness/test/context-restoration-read-model.test.js`: 5/5 pass.
  - `standard-template` `node --test .harness/test/context-restoration-read-model.test.js`: 5/5 pass.
  - root `npm.cmd test`: 36/36 pass.
  - `standard-template` `npm.cmd test`: 36/36 pass.
  - root `npm.cmd run harness:validate`: `ok: true`, findings `[]`.
  - root `npm.cmd run harness:handoff`: `routeStatus: ready`, next owner `tester`, route `.agents/workflows/test.md`.
  - root `npm.cmd run harness:pmw-export`: pass and regenerated `.agents/runtime/pmw-read-model.json`.
  - root `npm.cmd run harness:validation-report`: pass, gate decision `pass`, findings `[]`.
  - root `npm.cmd run harness:status`: validation pass, open blockers `0`, open decisions `0`.
- Untested scope:
  - No PMW browser visual verification was performed because this remediation changed read-model route data, not layout or browser interaction.
  - No destructive project-management action was tested.
- Result: tester re-verification passed; no Tester-discovered remediation item remains.
- Handoff:
  - Reviewer should re-check `DEV-08` packet exit closeout readiness, source parity, residual debt disposition, and validation evidence.

## 2026-05-01 DEV-08 Workflow Contracts And Handoff Routing Tester Re-Verification

- Scope: tester re-verification for `DEV-08` PM workflow contract/routing, PM substring safety, remediated ambiguous owner routing, missing-workflow diagnostics, root/starter synchronization, and PMW/handoff generated evidence.
- Environment: local maintainer workspace on Windows PowerShell.
- Tested scope:
  - `Project Manager` and `PM` route to `.agents/workflows/pm.md`.
  - `npm launcher`, `developer/tester`, and `contest owner` route to `manual_selection_required`.
  - Missing PM workflow file diagnostics report `workflow_missing` even when workflow details are not requested.
  - Root and `standard-template` targeted route/read-model tests pass.
  - Root and `standard-template` full test suites pass.
  - Validator, handoff, and PMW export pass.
- Evidence:
  - Manual route assertion: pass for PM positive routes and negative ambiguous/substring routes.
  - Manual missing-workflow assertion: `workflow_missing`.
  - root `node --test .harness/test/dev05-tooling.test.js .harness/test/context-restoration-read-model.test.js`: 15/15 pass
  - `standard-template` targeted route/read-model tests: 15/15 pass
  - root `npm.cmd test`: 35/35 pass
  - `standard-template` `npm.cmd test`: 35/35 pass
  - root `npm.cmd run harness:validate`: `ok: true`, findings `[]`
  - root `npm.cmd run harness:handoff`: `routeStatus: ready`, next owner `tester`, route `.agents/workflows/test.md`
  - root `npm.cmd run harness:pmw-export`: pass
- Untested scope:
  - No PMW browser visual verification was performed because this packet did not change PMW layout or browser interaction.
  - No destructive project-management action was tested.
- Result: tester re-verification passed.
- Handoff:
  - Reviewer should inspect DEV-08 packet exit quality gate readiness, source parity, residual debt disposition, and validation evidence.

## 2026-05-01 DEV-08 Workflow Contracts And Handoff Routing Tester Verification

- Scope: tester verification for `DEV-08` workflow contract parsing, handoff route behavior, validator coverage, root/starter synchronization, and PMW/handoff generated evidence.
- Environment: local maintainer workspace on Windows PowerShell.
- Evidence:
  - root `npm.cmd test`: 33/33 pass
  - `standard-template` `npm.cmd test`: 33/33 pass
  - root `npm.cmd run harness:validate`: `ok: true`, findings `[]`
  - root `npm.cmd run harness:handoff`: `routeStatus: ready`, next owner `tester`, route `.agents/workflows/test.md`, `workflowDetails.missingSections: []`
  - root `npm.cmd run harness:pmw-export`: pass and exported PMW read-model with `DEV-08` as `ready_for_test`
  - root `npm.cmd run harness:validation-report`: pass, findings `[]`
- Passed checks:
  - Positive route resolution for the current `DEV-08` assignment routes to `.agents/workflows/test.md`.
  - Workflow contract details expose role, mission, authority, non-authority, required SSOT, allowed/forbidden actions, required outputs, turn-close reporting, handoff rules, stop conditions, and escalation rules.
  - Workflow contract section validation is covered by tests and validator output remains clean for the current repo.
  - Root and `standard-template` test suites both pass after reusable runtime/test synchronization.
- Failed checks / remediation required:
  - Ambiguous owner values are not rejected. `workflowForOwner("developer/tester")` resolves to `.agents/workflows/test.md` instead of `manual_selection_required`, which conflicts with the packet rule that ambiguous owner values must not invent a workflow.
  - Substring alias matching causes false positive routes. `workflowForOwner("contest owner")` resolves to `.agents/workflows/test.md` because `test` is matched inside `contest`.
  - PMW/read-model diagnostics call `resolveHandoffExecution` without workflow details. In a missing-workflow negative case, `includeWorkflowDetails: false` reports `routeStatus: ready`, while `includeWorkflowDetails: true` correctly reports `workflow_missing`.
- Design / efficiency opinion:
  - The validator addition fits the existing harness design because workflow contracts are governance Markdown and missing sections are drift.
  - Root/starter synchronization is appropriate for reusable workflow behavior, but the supported workflow file list now exists separately from the route alias list; future workflow-set changes could drift unless those lists share one exported source.
  - Backward-compatible `purpose/readFirst/doSteps/stopWhen` aliases are acceptable short-term compatibility, but should be treated as a compatibility layer rather than a second long-term workflow schema.
- Result: tester verification is not passed. Remediation should go to Developer.
- Handoff:
  - Developer should replace substring alias routing with token/boundary-aware matching, detect multi-route ambiguity explicitly, make PMW/read-model handoff diagnostics inspect workflow details or surface validator findings consistently, and add regression tests for these negative cases in root and `standard-template`.

## 2026-05-01 DEV-07 PMW V1.3 First-View Tester Verification

- Scope: tester verification for `DEV-07` PMW V1.3 operator-console first view after developer implementation and user browser feedback.
- Environment: local PMW app at `http://127.0.0.1:4175/` in the Codex in-app browser.
- Evidence:
  - `npm.cmd test` in `pmw-app`: 2/2 pass
  - `node --test .harness/test/pmw-read-surface.test.js .harness/test/context-restoration-read-model.test.js`: 4/4 pass
  - root `npm.cmd test`: 31/31 pass
  - root `npm.cmd run harness:validate`: `ok: true`
  - Browser check confirmed `Project Overview`, `Project Tasks Status`, `Action Board`, `Re-entry Baton`, `Artifact Library`, `Operator Commands`, and `Diagnostics` navigation links.
  - Browser anchor check confirmed `Diagnostics` -> `#diagnostics-section` and `Project Tasks Status` -> `#project-tasks-status`.
  - User testing completed after review feedback; in-app browser narrow width may keep the menu as the top horizontal sticky nav, while desktop width keeps the right-side floating nav.
- Result: tester verification passed.
- Untested / deferred:
  - No destructive project-management actions were tested.
  - PMW command launcher actions with side effects were not executed from the browser beyond previously approved local validation scope.
- Handoff:
  - Tester scope is complete and ready for Reviewer inspection.

## 2026-04-22 TST-02 PMW First-View UX Gate

- Scope: final PMW first-view UX / 30-second comprehension gate for the local read-only surface.
- Environment: local `node src/pmw/server.js` with headless Chrome at `1440x2200`.
- Evidence:
  - `.harness/tst02-pmw-home.png`
  - `.harness/tst02-pmw-read-surface.json`
- Result: passed, gate closed.
- Passed checks:
  - the first view shows the project title and the header meta for current lane, next gate, and return point
  - the overview is available at the top of the screen but defaults to a collapsed first-view state
  - the `결정해야 할 것 / 이슈 / 지금 진행 중인 작업 / 다음 작업` 4-card current-situation grid is visible and readable in the initial browser view
  - the project overview band and progress summary still render without browser errors when expanded
- Conclusion:
  - the final 30-second comprehension gate is closed because the first view now exposes the decision, blocker, current-work, and next-action cards without requiring scroll first
