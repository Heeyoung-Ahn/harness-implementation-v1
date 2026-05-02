# PKT-01 DEV-09 PMW Phase-1 Command Launcher And Handoff Execution

## Purpose
This packet defines the next `PLN-07` planning step after `DEV-08`: implement the approved V1.3 phase-1 PMW command launcher and make `handoff` execute through the approved routing contract, while preserving PMW's non-authoritative canonical write boundary.

## Approval Rule
- This packet is written before implementation.
- This packet is a reusable core harness lane and does not activate optional profiles.
- This packet must preserve the V1.2 installable baseline, separate PMW app boundary, selected-project execution scope, one-command-at-a-time policy, and session-scoped command result logs.
- This packet must not introduce arbitrary shell execution.
- This packet must not expand the phase-1 PMW launcher scope beyond `status`, `next`, `explain`, `validate`, `handoff`, and `pmw-export`.
- `doctor`, `test`, and `validation-report` remain terminal-only guided commands in this packet.
- Detailed function agreement and detailed UI/UX agreement were approved by the user on 2026-05-02.
- `Ready For Code` was approved by the user on 2026-05-02; Developer workflow may implement this packet under the approved scope.
- Developer implementation, Tester verification, and Reviewer packet exit closeout completed on 2026-05-02.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | DEV-09 PMW phase-1 command launcher and handoff execution | DEV-07 delivered the first view and DEV-08 delivered routeable workflow contracts; DEV-09 makes the curated command catalog executable in PMW | done |
| Ready For Code | approved on 2026-05-02 | detailed agreement is approved and the user explicitly approved Developer implementation handoff | approved |
| Human sync needed | yes | the command launcher is user-facing and includes state-changing command confirmation plus workflow launch semantics | approved |
| User-facing impact | high | PMW operators can run approved harness commands and inspect results through the app | approved |
| Layer classification | core | the command launcher and handoff execution contract are reusable harness behavior | approved |
| Active profile dependencies | none | no optional profile is required | not-needed |
| Profile evidence status | not-needed | active profile set is empty | not-needed |
| UX archetype status | approved | the existing reading-desk pattern remains compatible with the approved command interaction details | approved |
| UX deviation status | none | no deviation from the PMW operator-console pattern is proposed | approved |
| Environment topology status | not-needed | this is not a deploy/cutover topology lane | not-needed |
| Domain foundation status | not-needed | no product data or schema design is involved | not-needed |
| Authoritative source intake status | not-needed | uses the already-approved V1.3 planning source | not-needed |
| Shared-source wave status | not-needed | no multi-packet authoritative source wave is involved | not-needed |
| Packet exit gate status | approved | implementation, testing, review, validation, PMW export, and closeout evidence completed on 2026-05-02 | approved |
| Improvement promotion status | proposed | operation-friction candidate is recorded separately for `OPS-03`; no DEV-09 behavior is deferred | pending-review |
| Existing system dependency | none | no legacy application or DB integration is involved | not-needed |
| New authoritative source impact | none | no new external planning source has been introduced | not-needed |
| Risk if started now | low | implementation approval is granted; remaining risk is normal implementation correctness within the approved command and handoff boundaries | approved |

## 1. Goal
- Define the implementation packet for the V1.3 PMW phase-1 command launcher.
- Make PMW execute only the approved curated command catalog for the selected project.
- Make `handoff` use the DEV-08 workflow routing contract and present the next owner, target workflow, next task, required SSOT, and next first action.
- Keep command results operator-readable with execution time, selected project, success/failure, summary, stdout/stderr, and related artifact links.

## 2. Non-Goal
- Add arbitrary shell execution.
- Promote `doctor`, `test`, or `validation-report` into the phase-1 PMW launcher.
- Add persistent cross-session command history.
- Redesign the PMW first view beyond the command launcher/result surface needed for this packet.
- Make PMW the canonical write authority for Markdown truth, DB hot-state, or generated docs.
- Change workflow filenames or route precedence from DEV-08.
- Change release packaging or installer behavior.

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  PMW can show the approved command split and route context, but the phase-1 command launcher still needs a concrete packet that freezes execution rules, result display, and handoff launch behavior before implementation.
- 작업 후 사용자가 체감해야 하는 변화:
  The operator can select one registered project, launch an approved command from PMW, see a readable result, and use `handoff` to continue through the next routed workflow without needing to reinterpret terminal-only guidance.

## 4. In Scope
- PMW command catalog entries for `status`, `next`, `explain`, `validate`, `handoff`, and `pmw-export`.
- Command metadata for name, description, selected project, expected effect, side-effect class, and launch mode.
- Selected-project command execution boundary.
- One-command-at-a-time enforcement per selected project.
- Session-scoped command result storage and display.
- Operator confirmation before commands with state-changing or derived-output side effects.
- Result surface for execution time, selected project, success/failure, readable summary, stdout/stderr, and related artifact links.
- `handoff` execution through the DEV-08 routing contract, including unsupported or ambiguous route handling.
- Terminal-only guidance for `doctor`, `test`, and `validation-report`.
- Root/starter synchronization for reusable runtime command-contract exports if implementation touches reusable harness runtime.
- PMW app tests and harness runtime tests needed to verify command catalog and route behavior.

## 5. Out Of Scope
- Arbitrary command entry fields supplied by the operator.
- Multi-project parallel command execution.
- Background job queues beyond one in-flight command per project.
- Cross-session command result persistence.
- New auth/user identity model for PMW.
- DB schema changes unless implementation proves the current session-scoped result model cannot work without them.
- Starter installation changes.
- New workflow roles or workflow filename changes.

## 6. Detailed Behavior
- Trigger:
  Operator selects a registered project in PMW and chooses one approved command from the phase-1 catalog.
- Main flow:
  PMW resolves the selected project, checks no command is already running for that project, applies confirmation if required, launches the mapped harness command, captures stdout/stderr, summarizes the result, and renders related artifact links.
- Handoff flow:
  `handoff` resolves the next owner and target workflow through the DEV-08 routing contract, then presents the route, required SSOT, next task, next first action, and command/workflow launch outcome. The handoff baton must include the previous work agent, previous work summary, next work agent, and next work summary so the operator can confirm the same transition that is reported at the end of a conversation turn.
- Alternate flow:
  If the selected project is missing, stale, or unavailable, PMW reports a project-selection error and does not run a command.
- Empty state:
  If no project is selected or no open task exists, PMW shows an explicit no-target/no-next-work state and does not invent a workflow.
- Error state:
  Unsupported commands, ambiguous owners, missing workflow contracts, process failures, and non-zero exit codes produce operator-readable failure summaries plus captured stderr.
- Loading/transition:
  While a command is running, the project command surface shows an in-progress state and blocks a second command for the same project.

## 7. Program Function Detail
- 입력: selected PMW project, command catalog entry, `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`, `.harness/operating_state.sqlite`, workflow Markdown contracts, latest handoff log.
- 처리: validate selected project, enforce command catalog, classify side effects, require confirmation when needed, launch mapped harness command, capture output, summarize result, resolve related artifacts.
- 출력: PMW command result panel, session-scoped command log entry, refreshed related artifacts when `pmw-export` or another derived-output command produces them.
- 권한/조건: PMW may invoke approved local harness commands for the selected project, but PMW itself remains non-authoritative for canonical writes.
- edge case: unregistered project, project path missing, command already running, command timeout, missing Node/npm, validator failure, ambiguous handoff owner, missing workflow file, missing required workflow section, stale generated docs.

## 8. UI/UX Detailed Design
- Active profile references: not-needed
- Profile composition rationale: not-needed
- Profile-specific UX / operation contract: not-needed
- Primary admin entity / surface: not-needed
- Grid interaction model: not-needed
- Search / filter / sort / pagination behavior: not-needed
- Row action / bulk action rule: not-needed
- Edit / save / confirm / audit pattern: confirmation is required for state-changing or derived-output commands
- Profile deviation / exception: none
- UX archetype reference: `reference/artifacts/PRODUCT_UX_ARCHETYPE.md`
- Selected UX archetype: `reading-desk` proposed
- Archetype fit rationale: PMW command results should remain dense, scan-friendly, evidence-backed, and subordinate to current/next work context.
- Archetype deviation / approval: none proposed; detailed command interaction still needs user approval
- 영향받는 화면: PMW command panel, command result surface, guided terminal action area, handoff/re-entry surface if implementation needs route launch feedback
- 레이아웃 변경: scoped to command controls and result display, not a first-view redesign
- interaction: catalog command buttons, confirmation dialog for side-effect commands, in-progress state, result detail toggle, artifact link navigation
- copy/text: operator-friendly command summaries, failure summaries, confirmation wording, terminal-only guidance text, previous-agent/previous-work and next-agent/next-work labels for handoff confirmation
- feedback/timing: immediate queued/running/succeeded/failed state for the selected project command
- source trace fallback: show selected project path, command name, target workflow for handoff, and related artifact links when available

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale: the command launcher is reusable PMW/harness behavior and does not encode project-specific domain rules.
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`, `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/planning/PLN-07_PMW_V1_3_OPERATOR_CONSOLE_DRAFT.md`, `reference/packets/PKT-01_DEV-07_PMW_V1_3_OPERATOR_CONSOLE_FIRST_VIEW.md`, `reference/packets/PKT-01_DEV-08_WORKFLOW_CONTRACTS_AND_HANDOFF_ROUTING.md`, this packet
- Environment topology reference: not-needed
- Source environment: local selected project
- Target environment: local PMW app plus selected project harness runtime
- Execution target: operator machine running PMW and the selected local project
- Transfer boundary: none
- Rollback boundary: git revert of implementation changes and deletion of session-scoped command results
- Domain foundation reference: not-needed
- Schema impact classification: none
- DB / state 영향: no schema change planned; command execution may invoke existing harness commands that update generated docs, validation reports, PMW export, or handoff outputs according to their existing authority
- Markdown / docs 영향: packet, canonical planning state, command contract documentation if implementation changes reusable command metadata
- generated docs 영향: regenerate after DB hot-state changes; command result execution may refresh derived outputs through approved commands
- validator / cutover 영향: validator must remain clean; implementation may add tests for command catalog drift and terminal-only command guidance
- Authoritative source refs: `reference/planning/PLN-07_PMW_V1_3_OPERATOR_CONSOLE_DRAFT.md`, `.agents/artifacts/REQUIREMENTS.md`
- Authoritative source intake reference: not-needed
- Authoritative source disposition: approved V1.3 direction carried into this packet
- New planning source priority / disposition: none
- Existing plan conflict: none
- Current implementation impact: PMW already displays command split and route context; implementation must add executable catalog behavior without broadening command scope
- Required rework / defer rationale: defer persistent command history and promotion of terminal-only commands to later packets unless user reopens scope
- Impacted packet set scope: single-packet
- Authoritative source wave ledger reference: not-needed
- Source wave packet disposition: not-needed
- Existing program / DB dependency: none
- Existing schema source artifact: not-needed
- Table / column naming compatibility: not-needed
- Data operation / ownership compatibility: not-needed
- Migration / rollback / cutover compatibility: not-needed
- Product source root: not-needed
- Product test root: `.harness/test/` and `pmw-app/test/` if implementation changes command contract/read-model behavior
- Product runtime requirements: Node 24 baseline remains unchanged
- Harness/product boundary exceptions: none
- Runtime / framework: Node.js harness runtime, PMW app server/runtime, existing npm script command surface
- Rendering / app mode: PMW browser app
- Data persistence boundary: command result logs are session-scoped; canonical state writes occur only through approved harness commands
- Auth / user identity requirement: unchanged
- Deployment target: not-needed
- External API / integration boundary: none
- Lightweight acceptance: command catalog is curated, selected-project scoped, confirmation-protected where needed, and test/validator clean
- Node.js product runtime policy: unchanged
- Package manager: npm
- Framework / bundler: existing PMW app stack
- Build command: not-needed unless PMW package requires it
- Test command: `npm.cmd test`, `npm.cmd test` in `pmw-app`, and targeted `node --test` suites as needed
- Environment variable policy: unchanged
- API / backend boundary: PMW server may expose command-launch endpoints only for curated catalog entries
- Static asset / routing policy: unchanged

## 10. Acceptance
- PMW exposes only the approved phase-1 launcher commands: `status`, `next`, `explain`, `validate`, `handoff`, and `pmw-export`.
- PMW shows `doctor`, `test`, and `validation-report` as terminal-only guided actions, not launcher actions.
- Each launcher command exposes name, description, selected project, expected effect, side-effect class, and launch mode.
- PMW blocks arbitrary command input and rejects unknown command names.
- PMW runs commands only against the selected registered project.
- PMW enforces one in-flight command at a time per project.
- Commands with state-changing or derived-output side effects require operator confirmation before launch.
- Command results show execution time, selected project, success/failure, readable summary, stdout/stderr, and related artifact links where available.
- Failed commands produce operator-readable summaries before raw output detail.
- `handoff` uses the DEV-08 route contract and reports manual-selection-required, workflow-missing, or missing-section states without pretending the route is ready.
- `handoff` result or baton display includes previous work agent, previous work summary, next work agent, and next work summary.
- PMW remains non-authoritative for canonical writes; any write effect comes only from approved harness commands.
- Reusable command contract changes are synchronized into `standard-template/` when they touch reusable harness runtime, tests, or docs.
- Root and starter tests affected by reusable changes pass.
- PMW app command-launch tests pass.
- `npm.cmd run harness:validate` passes with no findings.
- `npm.cmd run harness:pmw-export` passes after implementation if exported PMW state changes.

## 11. Detailed Agreement Recommendation
- Recommended scope:
  Approve DEV-09 as the V1.3 packet that implements the PMW phase-1 command launcher and `handoff` workflow execution behavior.
- Recommended command boundary:
  Keep the launcher catalog fixed to `status`, `next`, `explain`, `validate`, `handoff`, and `pmw-export`. Keep `doctor`, `test`, and `validation-report` as guided terminal actions.
- Recommended side-effect policy:
  Treat `status`, `next`, `explain`, and `validate` as diagnostic commands that do not require confirmation. `validate` may take time, so it needs an in-progress state, but the approved source only requires confirmation for state-changing side effects. Treat `pmw-export` and `handoff` as confirmation-required because they can refresh derived artifacts or launch the next workflow path.
- Recommended handoff launch semantics:
  `handoff` should route through the DEV-08 owner/workflow contract, run the approved `handoff` command path for the selected project, and open a workflow-specific baton surface that shows previous work agent, previous work summary, next work agent, next work summary, target workflow, required SSOT, next task, next first action, and route diagnostics. DEV-09 must not invent an agent runtime. If a future host integration can start a workflow agent directly, that belongs in a later packet.
- Recommended UI boundary:
  Add only the command controls, confirmation state, running state, and result surface required for this packet. Do not redesign the first view or add persistent history.
- Recommended PMW labels:
  Use `PMW Actions` for launchable commands and `Terminal Actions` for guided terminal-only commands. This keeps the distinction visible without implying that terminal-only commands are unavailable or deprecated.

## 11A. Planner Decision Brief
| Decision | Recommendation | Rationale | Approval Status |
|---|---|---|---|
| `validate` confirmation | Do not require confirmation | It is diagnostic, not a canonical write or derived-output command; progress and failure states are sufficient | approved by user on 2026-05-02 |
| command group labels | Use `PMW Actions` and `Terminal Actions` | The labels clearly separate launchable commands from guided commands while staying concise for PMW UI | approved by user on 2026-05-02 |
| `handoff` launch meaning | Run the approved handoff command and open a workflow baton surface; do not spawn a new agent runtime | This satisfies routeable handoff behavior in the current local PMW architecture without inventing orchestration outside the approved harness | approved by user on 2026-05-02 |
| `handoff` baton content | Include previous work agent, previous work summary, next work agent, and next work summary | The operator must be able to confirm the same transition normally reported at turn close in the conversation | approved by user on 2026-05-02 |
| `Ready For Code` | Proceed to Developer implementation handoff | Detailed agreement is approved and the user explicitly approved `Ready For Code` on 2026-05-02 | approved by user on 2026-05-02 |

## 11B. Open Questions
- None. Detailed function agreement, detailed UI/UX agreement, and `Ready For Code` are approved.

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | yes | user/planner | approved | Reusable core approved with `Ready For Code` on 2026-05-02 |
| Optional profile evidence approval | no | planner | not-needed | No active profile |
| Spreadsheet source mapping approval | no | planner | not-needed | No spreadsheet source |
| Airgapped transfer package approval | no | planner | not-needed | No transfer package |
| Lightweight app baseline approval | no | planner | not-needed | Existing PMW app baseline is retained |
| Android build and release boundary approval | no | planner | not-needed | No Android scope |
| Node/frontend package boundary approval | no | planner | not-needed | Existing PMW package boundary is retained |
| Detailed function agreement | yes | user/planner | approved | User approved validate no-confirmation, fixed label naming, and handoff without agent runtime on 2026-05-02 |
| Detailed UI/UX agreement | yes | user/planner | approved | User approved `PMW Actions` / `Terminal Actions`; handoff display must include previous work agent/content and next work agent/content |
| UX archetype / deviation approval | yes | user/planner | approved | `reading-desk` retained; no deviation |
| Environment topology approval | no | planner | not-needed | No deploy/cutover topology lane |
| Domain foundation approval | no | planner | not-needed | No data-impact lane |
| DB design confirmation | no | planner | not-needed | No DB schema change planned |
| Authoritative source disposition approval | no | planner | approved | Uses already-approved V1.3 planning source |
| New source incorporation decision | no | planner | not-needed | No new source |
| Source wave rebaseline approval | no | planner | not-needed | Single-packet scope |
| Packet exit quality gate approval | yes | reviewer | approved | Reviewer approved DEV-09 packet exit closeout on 2026-05-02 |
| Improvement promotion decision | yes | planner | proposed | `OPS-HARNESS-FRICTION-004` is recorded separately and linked to `OPS-03`; it does not block DEV-09 closeout |
| Ready For Code sign-off | yes | user | approved | Approved on 2026-05-02 before Developer workflow starts |

## 13. Implementation Notes
- Reuse existing harness CLI command mappings instead of introducing shell text input.
- Keep command execution scoped to the registered project path selected in PMW.
- Prefer a shared command-catalog definition if PMW and harness runtime both need command metadata.
- Preserve DEV-08 route precedence and ambiguity behavior.
- Keep terminal-only command guidance visible enough for operators but unavailable as launch buttons.
- Avoid DB schema changes unless the current session-scoped result model is insufficient.
- Any reusable runtime or contract change must be synchronized into `standard-template/` in the same implementation lane.
- Developer implemented server-side curated command enforcement, selected-project availability checks, one in-flight command per project, session-scoped result entries, and confirmation-required enforcement for `handoff` and `pmw-export`.
- Developer kept `validate` no-confirmation as approved.
- Developer updated PMW UI labels to `PMW Actions` and `Terminal Actions`.
- Developer added result metadata for selected project, launch mode, side-effect class, expected effect, confirmation policy, duration, related artifacts, stdout/stderr, and handoff baton content.
- Developer added handoff baton display fields for previous work agent, previous work summary, next work agent, and next work summary without creating an agent runtime.
- Developer synchronized reusable operator command metadata and read-model tests into `standard-template`.
- Tester verification passed on 2026-05-02 for PMW Actions / Terminal Actions, command confirmation boundaries, session result surface, terminal-only guidance, selected-project execution, one-command-per-project behavior, and handoff baton content.
- Reviewer closeout approved on 2026-05-02 with no open finding.

## 14. Verification Plan
- Run targeted PMW command launcher tests for catalog filtering, unknown command rejection, selected-project scoping, one-command-at-a-time behavior, confirmation-required commands, and result rendering.
- Run targeted handoff route tests for ready, manual-selection-required, workflow-missing, and missing-section states.
- Run root `npm.cmd test`.
- Run `npm.cmd test` in `pmw-app`.
- Run `npm.cmd run harness:validate`.
- Run `npm.cmd run harness:pmw-export` if PMW export or command-contract output changes.
- If reusable runtime changes are synchronized into `standard-template/`, run `npm.cmd test` in `standard-template`.

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: approve
- Implementation delta summary: PMW command launcher now enforces the curated phase-1 catalog, confirmation boundaries, selected-project execution, one-command-at-a-time session state, command result metadata, related artifact links, terminal-only guidance, and handoff baton previous/next work context.
- Source parity result: root and `standard-template` reusable read-model command metadata/tests are synchronized; PMW app remains root-only.
- Refactor / residual debt disposition: none for the approved DEV-09 scope
- UX conformance result: Developer implementation preserves the PMW reading-desk first-view pattern and limits UI changes to command controls, result display, terminal guidance, and baton context.
- Topology / schema conformance result: not-needed
- Validation / security / cleanup evidence: PMW app tests passed; root tests passed; starter tests passed; `npm run harness:pmw-export` passed; `npm run harness:validation-report` passed with no findings; `npm run harness:validate` passed with no findings; pre-closeout `npm run harness:handoff` passed and routed DEV-09 `ready_for_test` to Tester.
- Deferred follow-up item: `OPS-03` will address harness operation friction separately; no DEV-09 behavior is deferred.
- Improvement candidate reference: `OPS-HARNESS-FRICTION-004`
- Proposed target layer: core
- Promotion status / linked follow-up item: proposed / `OPS-03`
- Closeout notes: implementation, Tester verification, Reviewer closeout, validator, PMW export, and validation report are complete. No open DEV-09 finding remains.

## 16. Reopen Trigger
- The phase-1 command list changes.
- `doctor`, `test`, or `validation-report` is proposed for PMW launcher promotion.
- PMW command execution scope changes from selected-project only.
- Command result persistence changes from session-scoped to cross-session.
- Handoff route precedence or launch semantics change.
- A new PMW visual redesign is proposed beyond the command panel/result surface.
- Implementation discovers a DB schema requirement.
- Human approval boundary changes.
