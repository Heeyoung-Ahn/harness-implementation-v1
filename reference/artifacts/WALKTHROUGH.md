# Walkthrough

Use this artifact to record verification evidence and manual test results.

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
