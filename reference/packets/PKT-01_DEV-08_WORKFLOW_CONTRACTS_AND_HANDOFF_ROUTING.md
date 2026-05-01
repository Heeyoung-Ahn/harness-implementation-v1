# PKT-01 DEV-08 Workflow Contracts And Handoff Routing

## Purpose
This packet defines the next `PLN-07` planning step after `DEV-07`: strengthen workflow Markdown into explicit agent-role contracts and make handoff routing consistently readable by PMW and CLI surfaces before implementation starts.

## Approval Rule
- This packet is written before implementation.
- This packet is a reusable core harness lane and does not activate optional profiles.
- This packet must not rename workflow files, replace the approved workflow set, or introduce arbitrary shell execution.
- This packet must preserve the V1.2 installable baseline, separate PMW app boundary, and V1.3 phase-1 command split.
- `Ready For Code` was approved by the user on 2026-05-01; implementation, the 2026-05-02 Developer remediation for the PMW next-task owner/workflow mismatch, Tester re-verification, and Reviewer closeout are complete.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | DEV-08 Workflow contracts and handoff routing | DEV-07 closed the first PMW view; the next approved V1.3 axis is explicit workflow contracts and routeable handoff behavior | done |
| Ready For Code | approved on 2026-05-01 | user approved the detailed agreement without changes and requested Developer workflow execution | approved |
| Human sync needed | yes | workflow authority, stop conditions, and handoff launch behavior affect all future agents | approved |
| User-facing impact | low | PMW/CLI route wording may become clearer, but no primary PMW layout is redesigned | draft |
| Layer classification | core | applies to the reusable harness workflow contract and routing model | approved |
| Active profile dependencies | none | no optional profile is required | approved |
| Profile evidence status | not-needed | active profile set is empty | approved |
| UX archetype status | approved | low user-facing command/handoff wording stays within the existing reading-desk evidence pattern | approved |
| UX deviation status | none | no UX archetype deviation is introduced | approved |
| Environment topology status | not-needed | not a deploy/test/cutover topology lane | approved |
| Domain foundation status | not-needed | no data/schema impact | approved |
| Authoritative source intake status | not-needed | uses already-approved V1.3 planning sources; no new external source | approved |
| Shared-source wave status | not-needed | no multi-packet source wave | approved |
| Packet exit gate status | approved | Reviewer finding was remediated, Tester re-verification passed, and Reviewer closeout approved packet exit | approved |
| Improvement promotion status | none | no recurring friction candidate is being promoted | draft |
| Existing system dependency | none | no external legacy system integration | approved |
| New authoritative source impact | none | no new source was introduced | approved |
| Risk if started now | closed | DEV-08 is closed; next work returns to planner-owned `PLN-07` | done |

## 1. Goal
- Define the implementation packet for V1.3 workflow Markdown contracts.
- Make each workflow contract explicit enough for an agent to know role, authority, non-authority, required SSOT, outputs, handoff rules, stop conditions, and escalation rules.
- Make handoff routing surfaces consistently identify next owner, next workflow, next task, required SSOT, and blocker/risk.

## 2. Non-Goal
- Rename workflow files.
- Replace the current workflow set.
- Start implementation before approval.
- Expand PMW phase-1 command launcher scope beyond `status`, `next`, `explain`, `validate`, `handoff`, and `pmw-export`.
- Promote `doctor`, `test`, or `validation-report` into the PMW launcher in this packet.

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  `DEV-07` closed the first PMW operator view, but the next execution contract still needs a concrete packet that turns the approved V1.3 workflow-contract direction into implementable scope.
- 작업 후 사용자가 체감해야 하는 변화:
  PMW and CLI handoff surfaces route the next agent with clearer role contract context, and future agents spend less time rediscovering authority, stop conditions, and required SSOT.

## 4. In Scope
- `.agents/workflows/*.md` contract completeness review and update scope.
- `.agents/workflows/pm.md` as the user-approved PM workflow lane for project execution coordination.
- Handoff routing contract for `project manager`/`pm`, `planner`, `developer`, `tester`, `reviewer`, `deploy`, `documenter`, and `handoff`.
- PMW/CLI wording requirements for next owner, workflow target, required SSOT, blockers/risks, and next first action.
- Validator or test expectations for workflow-contract completeness if implementation finds an existing suitable enforcement point.

## 5. Out Of Scope
- PMW visual redesign.
- New command runner architecture.
- Persistent command history beyond session scope.
- New workflow lanes beyond the user-approved `Project Manager` workflow addition.
- Workflow filename changes outside `.agents/workflows/pm.md`.
- Product/runtime feature work outside harness workflow routing.

## 6. Detailed Behavior
- Trigger:
  Operator or agent invokes handoff/status/next/explain, or PMW renders the re-entry and command surfaces.
- Main flow:
  Read current active task owner -> resolve supported workflow -> expose role contract summary -> show next first action and required SSOT -> keep blocker/risk explicit.
- Alternate flow:
  If owner and `Next Recommended Agent` disagree, active task owner wins per handoff workflow rules.
- Empty state:
  If no open task exists, surface explicit `None` and do not invent a next owner.
- Error state:
  Unsupported owner or missing workflow contract produces a routeable validation/error state rather than silent fallback.
- Loading/transition:
  Not applicable.

## 7. Program Function Detail
- 입력: `CURRENT_STATE.md`, `TASK_LIST.md`, workflow Markdown files, DB work item state, latest handoff log.
- 처리: resolve next owner/workflow, read workflow contract metadata, format baton and route guidance.
- 출력: updated workflow contracts, routing/read-model behavior, tests or validator coverage as needed.
- 권한/조건: PMW remains non-authoritative; canonical writes stay in approved harness command/state surfaces.
- edge case: no active work item, ambiguous owner, unsupported role alias, missing required workflow section, stale generated docs.

## 8. UI/UX Detailed Design
- Active profile references: not-needed
- Profile composition rationale: not-needed
- Profile-specific UX / operation contract: not-needed
- Primary admin entity / surface: not-needed
- Grid interaction model: not-needed
- Search / filter / sort / pagination behavior: not-needed
- Row action / bulk action rule: not-needed
- Edit / save / confirm / audit pattern: not-needed
- Profile deviation / exception: none
- UX archetype reference: `reference/artifacts/PRODUCT_UX_ARCHETYPE.md`
- Selected UX archetype: `reading-desk`
- Archetype fit rationale: routing text and required-SSOT guidance should stay evidence-backed and scan-friendly.
- Archetype deviation / approval: none
- 영향받는 화면: PMW handoff/re-entry/command context text only if implementation needs it
- 레이아웃 변경: none expected
- interaction: no new interaction pattern expected
- copy/text: route, owner, required SSOT, and stop-condition wording may change
- feedback/timing: unsupported route or missing contract should be explicit
- source trace fallback: current SSOT and workflow file path should remain visible

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale: role contracts and handoff routing are reusable harness behavior, not project-specific detail.
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`, `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/planning/PLN-07_PMW_V1_3_OPERATOR_CONSOLE_DRAFT.md`, this packet
- Environment topology reference: not-needed
- Source environment: local repo
- Target environment: local repo
- Execution target: maintainer workspace
- Transfer boundary: none
- Rollback boundary: git revert of packet implementation changes
- Domain foundation reference: not-needed
- Schema impact classification: none
- DB / state 영향: possible read-model or artifact-index updates only; no schema change planned
- Markdown / docs 영향: workflow Markdown, canonical task/current-state planning docs, implementation plan
- generated docs 영향: regenerate after state changes if implementation updates DB hot-state
- validator / cutover 영향: validator/test coverage may be added for required workflow contract sections
- Authoritative source refs: `reference/planning/PLN-07_PMW_V1_3_OPERATOR_CONSOLE_DRAFT.md`, `.agents/artifacts/REQUIREMENTS.md`
- Authoritative source intake reference: not-needed
- Authoritative source disposition: approved direction carried into this packet
- New planning source priority / disposition: none
- Existing plan conflict: none
- Current implementation impact: existing workflow files already contain most required sections; implementation must check completeness and routing extraction behavior
- Required rework / defer rationale: no defer selected yet
- Impacted packet set scope: single-packet
- Authoritative source wave ledger reference: not-needed
- Source wave packet disposition: not-needed
- Existing program / DB dependency: none
- Existing schema source artifact: not-needed
- Table / column naming compatibility: not-needed
- Data operation / ownership compatibility: not-needed
- Migration / rollback / cutover compatibility: not-needed
- Product source root: not-needed
- Product test root: `.harness/test/` if routing/read-model tests change
- Product runtime requirements: Node 24 baseline remains unchanged
- Harness/product boundary exceptions: none
- Runtime / framework: Node.js harness runtime and Markdown workflow files
- Rendering / app mode: PMW read-model/CLI surface only if needed
- Data persistence boundary: existing `.harness/operating_state.sqlite` only
- Auth / user identity requirement: none
- Deployment target: not-needed
- External API / integration boundary: none
- Lightweight acceptance: workflow contracts and handoff route output are deterministic and validator/test clean
- Node.js product runtime policy: unchanged
- Package manager: npm
- Framework / bundler: existing harness runtime only
- Build command: not-needed
- Test command: `npm.cmd test` or targeted `node --test .harness/test/*.test.js`
- Environment variable policy: unchanged
- API / backend boundary: PMW server changes only if route contract exposure requires it
- Static asset / routing policy: unchanged

## 10. Acceptance
- Every supported workflow contract has explicit role, authority, non-authority, required SSOT, required outputs, handoff rules, stop conditions, and escalation rules.
- Handoff route resolution remains based on active task owner first, then `CURRENT_STATE.md > Next Recommended Agent`, then latest handoff.
- PMW/CLI surfaces can show next owner, route, next task, required SSOT, next first action, and blocker/risk without relying on vague role wording.
- Phase-1 command scope remains unchanged.
- Root validation and relevant tests are clean after implementation.

## 11. Detailed Agreement Recommendation
- Role naming:
  Use explicit role names inside every workflow contract and expose those role names in PMW/CLI route context when available. `Project Manager` is approved as the PM workflow role for coordination/status/risk/handoff work. Do not rename existing workflow filenames in this packet.
- Contract completeness:
  Add validator coverage for required workflow sections if the existing validator can enforce it cleanly; otherwise add focused tests around the workflow contract parser and route output. The implementation should prefer validator enforcement because missing workflow contract sections are governance drift.
- Handoff launch behavior:
  Keep the V1.3 phase-1 command set unchanged. Implement `handoff` as the routeable approved command path and make PMW/CLI show target workflow, next owner, next task, required SSOT, next first action, and blocker/risk. Do not add a new PMW visual layout or command category in this packet.
- Unsupported route behavior:
  Unsupported or ambiguous owner values must produce an explicit manual-selection-required state instead of inventing a workflow.
- Root/starter sync:
  Because workflow contracts are reusable harness behavior, implementation must keep root and `standard-template/` workflow/runtime/test surfaces synchronized when the changed surface is reusable.

## 11A. Open Questions
- None. User approved the recommended detailed agreement as written on 2026-05-01.

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | yes | user/planner | approved | Proposed core approved on 2026-05-01 |
| Optional profile evidence approval | no | planner | not-needed | No active profile |
| Detailed function agreement | yes | user/planner | approved | Recommended agreement in section 11 approved on 2026-05-01 |
| Detailed UI/UX agreement | no | planner | not-needed | No first-view layout change planned |
| UX archetype / deviation approval | no | planner | approved | Existing reading-desk pattern is retained without deviation |
| Environment topology approval | no | planner | not-needed | No deploy/cutover lane |
| Domain foundation approval | no | planner | not-needed | No data-impact lane |
| DB design confirmation | no | planner | not-needed | No schema design |
| Authoritative source disposition approval | no | planner | approved | Uses already-approved V1.3 planning source |
| Packet exit quality gate approval | yes | reviewer | approved | Approved on 2026-05-02 after re-checking source parity, residual debt, and validation evidence |
| Ready For Code sign-off | yes | user | approved | Approved on 2026-05-01 before Developer workflow execution |

## 13. Implementation Notes
- Preserve workflow filenames and route aliases.
- Keep `Tester` remediation boundary explicit: tester records evidence and hands defects to Developer.
- Keep `Planner` implementation boundary explicit: planner defines scope and approval, but does not start code.
- Avoid expanding PMW command scope while improving route clarity.
- Developer implementation added workflow contract parsing for required role-contract sections, route support for `design.md` and `handoff.md`, workflow contract validator enforcement, and root/starter sync coverage for workflow routing and all workflow Markdown contracts.
- The same runtime/test changes were synchronized into `standard-template/`.
- Tester verification found that route alias matching still uses substring containment and does not detect ambiguous multi-role owner strings.
- Tester verification found that PMW/read-model diagnostics can report `ready` for missing workflow files when workflow details are not loaded.
- Developer remediation replaced substring alias matching with boundary-aware matching, treats multi-workflow owner matches as `manual_selection_required`, makes route status inspect workflow details regardless of caller detail output, and adds PMW/read-model diagnostic detail fields.
- Developer remediation added root and `standard-template` regression coverage for ambiguous owner values, substring false positives, positive role routes, and missing workflow diagnostics.
- User-requested PM workflow addition added `.agents/workflows/pm.md` and synchronized `standard-template/.agents/workflows/pm.md`, route aliases for `PM` / `Project Manager`, validator coverage, and root/starter regression coverage.
- Tester re-verification passed on 2026-05-01: PM route assertions, missing-workflow diagnostics, root/starter targeted tests, root/starter full tests, validator, handoff, and PMW export were clean.
- Reviewer packet-exit review on 2026-05-02 found that PMW Action Board `nextTask` owner/workflow is derived from the current handoff route instead of the `nextTaskSource` owner. Current PMW evidence shows `PLN-07` as `owner: reviewer` and `.agents/workflows/review.md`, although `PLN-07` is planner-owned.
- Developer remediation on 2026-05-02 made PMW Action Board `nextTask` derive owner/workflow from `nextTaskSource.owner` through `workflowForOwner()`, synchronized root and `standard-template`, and added root/starter regression coverage for the planner-owned next task case.
- Tester re-verification on 2026-05-02 confirmed PMW Action Board `nextTask` now shows `PLN-07` as `owner: planner` and `.agents/workflows/plan.md`, with root/starter targeted tests, full tests, validator, handoff, PMW export, and validation report all passing.
- Reviewer closeout on 2026-05-02 found no open finding and approved DEV-08 packet exit.

## 14. Verification Plan
- Run targeted workflow-routing/read-model tests if changed.
- Run root `npm.cmd test`.
- Run `npm.cmd run harness:validate`.
- If PMW route/read-model output changes, run `npm.cmd run harness:pmw-export`.

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: approve
- Implementation delta summary: workflow routing now parses explicit role-contract sections, reports incomplete workflow contracts, routes Project Manager/Designer/Handoff owners to their workflow files, validates missing workflow contract files/sections, and enforces root/starter sync for routing plus workflow Markdown files.
- Source parity result: Tester re-verification passed for remediated PMW next-task route evidence
- Refactor / residual debt disposition: none for the reviewed DEV-08 scope
- UX conformance result: not-needed unless PMW UI text changes
- Topology / schema conformance result: not-needed
- Validation / security / cleanup evidence: Developer remediation checks passed on 2026-05-02 with root targeted `context-restoration-read-model.test.js` 5/5, `standard-template` targeted `context-restoration-read-model.test.js` 5/5, full root `npm.cmd test` 36/36, and full `standard-template` `npm.cmd test` 36/36. Tester re-verification repeated the targeted and full root/starter tests, root validator, handoff, PMW export, validation report, and status checks; all passed with an empty validator findings list.
- Deferred follow-up item: none
- Improvement candidate reference: none
- Proposed target layer: core
- Promotion status / linked follow-up item: none
- Closeout notes: Developer remediation, Tester re-verification, and Reviewer closeout are complete. Active work returns to `PLN-07` planning.

## 16. Reopen Trigger
- Role authority, non-authority, or stop conditions change.
- Any additional workflow lane beyond the approved PM workflow or any filename rename is proposed.
- PMW command scope changes.
- Handoff route precedence changes.
- Validator or PMW exposes a contract gap not covered by this packet.
