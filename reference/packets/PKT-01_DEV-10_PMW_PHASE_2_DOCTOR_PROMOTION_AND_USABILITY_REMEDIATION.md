# PKT-01 DEV-10 PMW Phase-2 Doctor Promotion And Usability Remediation

## Purpose
This packet turns the approved `PLN-08` phase-2 outcome into one concrete implementation lane: promote `doctor` into PMW Actions and close the already-approved PMW usability remediation without expanding PMW beyond its read-only governance boundary.

## Approval Rule
- This packet is written before implementation.
- This packet is a reusable core harness lane and does not activate optional profiles.
- This packet must preserve the V1.2 installable baseline, separate PMW deployment model, PMW read-only authority boundary, root/starter synchronization, and Tester/Reviewer separation.
- This packet must not introduce arbitrary shell execution.
- This packet must not promote `test` or `validation-report` into PMW Actions.
- This packet must not change the approved phase-1 launcher semantics for `status`, `next`, `explain`, `validate`, `handoff`, and `pmw-export`.
- User scope approval already exists from 2026-05-03: promote only `doctor`; keep `test` and `validation-report` terminal-only; accept the PMW menu/modal/Artifact Library UX remediation direction.
- Final `Ready For Code` was explicitly approved by the user on 2026-05-03 after packet review.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | DEV-10 PMW phase-2 doctor promotion and usability remediation | PLN-08 scope is approved and now has one approved implementable packet | approved |
| Ready For Code | approved | packet-level review is complete and Developer handoff may open | approved |
| Human sync needed | yes | user-facing PMW behavior required packet review, and that review is now complete | approved |
| Gate profile | contract | reusable PMW command contract, PMW UI, runtime metadata, and root/starter sync are affected | approved |
| User-facing impact | high | PMW command surface and first-view usability both change in operator-visible ways | approved |
| Layer classification | core | the command promotion and PMW usability behavior are reusable harness behavior | approved |
| Active profile dependencies | none | no optional profile is required | not-needed |
| Profile evidence status | not-needed | active profile set is empty | not-needed |
| UX archetype status | approved | the existing reading-desk pattern remains the governing PMW UX shape | approved |
| UX deviation status | approved | collapsible overlay-style sidebar and preview-first artifact picking are intentional deviations within the approved PMW operator surface | approved |
| Environment topology status | not-needed | this is not a deploy/cutover topology lane | not-needed |
| Domain foundation status | not-needed | no product data or schema design is involved | not-needed |
| Authoritative source intake status | approved | uses the approved PLN-08 scope and accepted browser UX confirmation | approved |
| Shared-source wave status | not-needed | no multi-packet authoritative source wave is involved | not-needed |
| Packet exit gate status | pending | implementation, verification, validation, export, and review closeout are not yet done | pending |
| Improvement promotion status | none | this is direct approved scope, not a separate improvement-memory promotion lane | not-needed |
| Existing system dependency | none | no legacy product integration or DB dependency is involved | not-needed |
| New authoritative source impact | none | no new planning source was introduced after PLN-08 approval | not-needed |
| Risk if started now | low | scope and packet-level approval are both closed; remaining work is bounded implementation and verification | approved |

## 1. Goal
- Promote `doctor` from terminal-only guidance into PMW Actions.
- Keep `test` and `validation-report` terminal-only.
- Deliver the approved PMW usability remediation as part of the same lane so the promoted command surface is practical to use.
- Keep PMW as a launcher/result-viewer surface, never canonical write authority.

## 2. Non-Goal
- Promote `test` into PMW.
- Promote `validation-report` into PMW.
- Add arbitrary command input or arbitrary shell execution.
- Add cross-session command history.
- Change workflow routing semantics from `DEV-08` / `DEV-09`.
- Redesign PMW beyond the sidebar/menu, long-modal close access, and Artifact Library reading efficiency approved in `PLN-08`.
- Change release packaging or installer behavior.

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  `doctor` is still outside the PMW launchable action set, and the PMW first-view friction made the right-side menu, long modal close access, and Artifact Library reading area less usable than the approved operator workflow requires.
- 작업 후 사용자가 체감해야 하는 변화:
  The operator can run `doctor` directly from PMW, the sidebar menu is collapsible and usable without permanently wasting width, long scrolling modal content remains closable, and Artifact Library keeps the reading surface primary while still allowing on-demand artifact selection.

## 4. In Scope
- Add `doctor` to PMW Actions with the approved no-confirmation policy.
- Remove `doctor` from Terminal Actions.
- Preserve `test` and `validation-report` as terminal-only commands.
- Update PMW command metadata, selected-project execution behavior, and result-surface behavior for `doctor`.
- Sidebar menu usability remediation:
  - collapsible vertical sidebar
  - left-expanding open state when needed
  - narrow collapsed width
  - top alignment with the project-management control row
  - remove duplicate menu labeling
- Project Tasks Status modal usability remediation:
  - sticky close/header behavior
  - persistent close access while scrolling long content
- Artifact Library usability remediation:
  - preview-first layout
  - on-demand artifact picker instead of always-expanded left list
  - project-design/overview grouping retained and easier to read
- Root/starter synchronization for reusable runtime/read-model/test changes.

## 5. Out Of Scope
- `test` PMW execution, cancellation UX, repeated-run ergonomics, or noisy output management.
- `validation-report` overwrite, artifact-link, or confirmation redesign beyond preserving terminal-only guidance.
- New PMW auth/identity behavior.
- New DB schema unless implementation proves the current model is insufficient.
- Broader PMW visual redesign beyond the approved remediation set.

## 6. Detailed Behavior
- Trigger:
  Operator opens PMW, selects a registered project, and either launches `doctor` from PMW Actions or navigates via the sidebar / Artifact Library / Project Tasks Status modal.
- Main flow:
  PMW presents `doctor` as a launchable action beside the existing approved PMW command set, runs it against the selected project, and shows the same session-scoped result surface used by the existing launcher catalog.
- Sidebar flow:
  The sidebar remains available in collapsed form, expands vertically, and when opened may temporarily cover part of the reading surface rather than clipping off-screen.
- Modal flow:
  Long task-detail content can be scrolled without losing access to a close action.
- Artifact flow:
  Operators read the selected artifact in a wider body area and open the artifact picker only when they need to switch documents.
- Alternate flow:
  If no project is selected or the project path is unavailable, `doctor` fails with the same selected-project error handling used by existing PMW commands.
- Empty state:
  If no artifact is selected, PMW preserves a clear preview target and does not collapse into an empty unusable area.
- Error state:
  `doctor` command failure shows an operator-readable summary with stdout/stderr capture, consistent with existing PMW command results.
- Loading/transition:
  `doctor` follows the same one-command-at-a-time per-project rule already enforced by PMW.

## 7. Program Function Detail
- 입력:
  selected PMW project, `doctor` command contract, PMW command metadata, PMW UI state for sidebar/artifact picker/modal visibility.
- 처리:
  validate selected project, enforce curated PMW command catalog, run `doctor` through the approved harness command mapping, capture session-scoped result output, and update the PMW read-model/UI rendering for the approved usability changes.
- 출력:
  `doctor` PMW command result entry, updated PMW Action/Terminal Action display, updated sidebar/artifact/modal behavior, and synchronized root/starter reusable state where applicable.
- 권한/조건:
  PMW can launch only approved commands for the selected project; `doctor` remains bounded, read-only/operator-readiness oriented, and does not require confirmation.
- edge case:
  missing project, unavailable repo path, command already in flight, narrow viewport, long modal content, very long artifact group/item list, opened sidebar clipping risk.

## 8. UI/UX Detailed Design
- Active profile references: not-needed
- Profile composition rationale: not-needed
- Profile-specific UX / operation contract: not-needed
- Primary admin entity / surface: PMW operator console
- Grid interaction model: not-needed
- Search / filter / sort / pagination behavior: not-needed
- Row action / bulk action rule: not-needed
- Edit / save / confirm / audit pattern: no new edit pattern; `doctor` remains no-confirmation, read-only execution
- Profile deviation / exception: approved PMW sidebar/artifact interaction deviation within the operator-console surface
- UX archetype reference: `reference/artifacts/PRODUCT_UX_ARCHETYPE.md`
- Selected UX archetype: `reading-desk`
- Archetype fit rationale: PMW still prioritizes scanning current state and reading canonical artifacts; the remediation removes friction without changing the operator-console character.
- Archetype deviation / approval: approved on 2026-05-03 through user browser feedback and final UX confirmation.
- 영향받는 화면:
  PMW section navigation, Project Tasks Status modal, Artifact Library, Operator Commands / Terminal Actions surface
- 레이아웃 변경:
  narrow collapsed sidebar, left-expanding open sidebar, preview-first Artifact Library, wider artifact reading body
- interaction:
  always-available sidebar toggle, no duplicate menu label, sticky modal close access, artifact picker toggle rather than permanent left rail
- copy/text:
  keep concise `PMW Actions` / `Terminal Actions` naming and remove redundant internal `PMW MENU` label
- feedback/timing:
  sidebar open/close must feel immediate; modal close controls remain visible while scrolling; artifact switching should not waste width when idle
- source trace fallback:
  if a preview or grouping source is unavailable, PMW still shows the artifact path/title it attempted to resolve

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale: command promotion and PMW usability behavior are reusable harness behavior, not project-specific logic.
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`, `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/planning/PLN-08_PMW_V1_3_PHASE_2_COMMAND_SURFACE_DRAFT.md`, `reference/packets/PKT-01_DEV-07_PMW_V1_3_OPERATOR_CONSOLE_FIRST_VIEW.md`, `reference/packets/PKT-01_DEV-09_PMW_PHASE_1_COMMAND_LAUNCHER_AND_HANDOFF_EXECUTION.md`, this packet
- Environment topology reference: not-needed
- Source environment: local selected project and local PMW app
- Target environment: local PMW app plus selected project harness runtime
- Execution target: operator machine running PMW and the selected local project
- Transfer boundary: none
- Rollback boundary: git revert of reusable PMW/runtime changes and regeneration of derived outputs
- Domain foundation reference: not-needed
- Schema impact classification: none
- DB / state 영향:
  no schema change planned; session-scoped command results and planning-state sync continue to use the current hot-state model
- Markdown / docs 영향:
  packet, planning docs, current state/task list/project progress/implementation plan summaries if the active planning state advances
- generated docs 영향:
  PMW export and generated docs must be regenerated if planning state or read-model output changes
- validator / cutover 영향:
  validator must remain clean; reusable command/read-model/UI state changes may need updated tests and PMW export coverage
- Authoritative source refs:
  `reference/planning/PLN-08_PMW_V1_3_PHASE_2_COMMAND_SURFACE_DRAFT.md`, `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- Authoritative source intake reference: not-needed
- Authoritative source disposition: use the approved PLN-08 scope as the authoritative planning source for this packet
- New planning source priority / disposition: none
- Existing plan conflict: none
- Current implementation impact: `doctor` command metadata and PMW UI already partially reflect the approved direction; DEV-10 closes the implementation/evidence lane explicitly instead of leaving the work only in planning-state form
- Required rework / defer rationale:
  defer `test` and `validation-report` promotion to later packets because their result/confirmation/runtime ergonomics are still intentionally out of scope
- Impacted packet set scope: single packet
- Authoritative source wave ledger reference: not-needed
- Source wave packet disposition: not-needed
- Existing program / DB dependency: none
- Existing schema source artifact: not-needed
- Table / column naming compatibility: not-needed
- Data operation / ownership compatibility: not-needed
- Migration / rollback / cutover compatibility: not-needed
- Product source root: `.harness/runtime/`, `pmw-app/runtime/`, synchronized starter runtime if reusable state contracts change
- Product test root: `.harness/test/`, `pmw-app/test/`, `standard-template/.harness/test/`
- Product runtime requirements: Node 24 baseline unchanged
- Harness/product boundary exceptions: none
- Runtime / framework: Node.js harness runtime and PMW app server/runtime
- Rendering / app mode: PMW browser app
- Data persistence boundary: command results remain session-scoped; canonical state writes stay outside PMW authority
- Auth / user identity requirement: unchanged
- Deployment target: not-needed
- External API / integration boundary: none
- Lightweight acceptance:
  `doctor` is launchable in PMW, terminal-only commands remain bounded, and PMW first-view friction is materially reduced without changing authority boundaries
- Node.js product runtime policy: unchanged
- Package manager: npm
- Framework / bundler: existing PMW app stack
- Build command: not-needed unless implementation requires PMW packaging/build verification
- Test command:
  `npm.cmd test`, `npm.cmd test` in `pmw-app`, `npm.cmd test` in `standard-template`, `npm.cmd run harness:validate`, `npm.cmd run harness:pmw-export`
- Environment variable policy: unchanged
- API / backend boundary:
  PMW server may expose `doctor` through the same curated launch endpoint pattern as existing approved PMW commands
- Static asset / routing policy: unchanged

## 10. Acceptance
- PMW Actions includes `doctor`.
- Terminal Actions no longer includes `doctor`.
- `doctor` runs only against the selected registered project.
- `doctor` does not require confirmation before launch.
- `test` and `validation-report` remain terminal-only.
- `doctor` result output uses the existing PMW session-scoped result surface with readable summary, duration, stdout/stderr, and selected-project context.
- Sidebar toggle is always available in collapsed form.
- Sidebar expands vertically and leftward without clipping off-screen.
- Sidebar open state does not contain a redundant inner `PMW MENU` label.
- Sidebar collapsed state uses minimal width compared with the expanded state.
- Long Project Tasks Status modal content remains closable while scrolled.
- Artifact Library prioritizes the preview/document reading area over a permanently expanded left navigation list.
- Artifact switching is available on demand without sacrificing the primary reading width when idle.
- Reusable runtime/read-model/test changes remain synchronized into `standard-template` if touched.
- Root, starter, and PMW app verification remain clean after implementation.

## 11. Detailed Agreement Recommendation
- Recommended scope:
  Approve DEV-10 as the first concrete phase-2 implementation packet under `PLN-08`.
- Recommended command boundary:
  Promote only `doctor`; keep `test` and `validation-report` terminal-only.
- Recommended confirmation policy:
  `doctor` should not require confirmation because it remains an operator-readiness / diagnostic command.
- Recommended UX boundary:
  Limit UI changes to the already-approved sidebar/menu, long-modal close access, Artifact Library reading efficiency, and the command placement needed for `doctor`.
- Recommended Ready For Code disposition:
  If the user agrees that this packet accurately captures the approved scope, it can move to `Ready For Code` without reopening `PLN-08` scope.

## 11A. Planner Decision Brief
| Decision | Recommendation | Rationale | Approval Status |
|---|---|---|---|
| `doctor` promotion | promote now | low-risk, bounded, operator-facing, and already approved in PLN-08 | approved in PLN-08 on 2026-05-03 |
| `doctor` confirmation | no confirmation | command remains bounded and read-only/operator-readiness oriented | approved in PLN-08 on 2026-05-03 |
| `test` promotion | defer | long-running execution/cancellation/repeat-run UX remains out of scope | approved defer in PLN-08 on 2026-05-03 |
| `validation-report` promotion | defer | overwrite/artifact-link/confirmation policy remains intentionally unsettled | approved defer in PLN-08 on 2026-05-03 |
| usability remediation bundling | include in same packet | promoted command surface should ship with the already-approved practical usability fixes | approved in PLN-08 on 2026-05-03 |
| `Ready For Code` | approved | packet is concrete and the user approved Developer handoff on 2026-05-03 | approved |

## 11B. Open Questions
- None.

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | yes | user/planner | approved | reusable core packet |
| Optional profile evidence approval | no | planner | not-needed | no active profile |
| Spreadsheet source mapping approval | no | planner | not-needed | no spreadsheet source |
| Airgapped transfer package approval | no | planner | not-needed | no transfer package |
| Lightweight app baseline approval | no | planner | not-needed | existing PMW app baseline is retained |
| Android build and release boundary approval | no | planner | not-needed | no Android scope |
| Node/frontend package boundary approval | no | planner | not-needed | existing PMW package boundary is retained |
| Detailed function agreement | yes | user/planner | approved | packet is drafted from approved PLN-08 scope and explicitly signed off as the implementation contract on 2026-05-03 |
| Detailed UI/UX agreement | yes | user/planner | approved | browser UX direction and packet-level implementation approval are both closed on 2026-05-03 |
| UX archetype / deviation approval | yes | user/planner | approved | reading-desk retained; sidebar/artifact interaction deviations accepted on 2026-05-03 |
| Environment topology approval | no | planner | not-needed | no deploy/cutover topology lane |
| Domain foundation approval | no | planner | not-needed | no data-impact lane |
| DB design confirmation | no | planner | not-needed | no schema change planned |
| Authoritative source disposition approval | no | planner | approved | uses approved PLN-08 planning outcome |
| New source incorporation decision | no | planner | not-needed | no new source |
| Source wave rebaseline approval | no | planner | not-needed | single-packet scope |
| Packet exit quality gate approval | yes | reviewer | pending | implementation not started |
| Improvement promotion decision | no | planner | not-needed | no separate promotion lane |
| Ready For Code sign-off | yes | user | approved | explicit approval granted on 2026-05-03 before Developer handoff |

## 13. Implementation Notes
- Reuse the existing curated PMW command-launch path for `doctor`.
- Keep `doctor` metadata synchronized in root and `standard-template` if the reusable read-model/command catalog changes.
- Preserve the one-command-at-a-time per-project execution rule.
- Do not expand `terminalOnly` beyond the approved `test`, `validation-report`, and existing `transition` guidance.
- Preserve PMW as read-only authority even when it launches approved commands.
- Keep sidebar behavior width-efficient when collapsed and intentionally overlay-based when expanded.
- Do not reintroduce the duplicate inner `PMW MENU` label.
- Preserve project-design artifact discoverability while keeping the artifact reading pane primary.

## Verification Manifest
- Gate profile: `contract`
- Ready For Code: approved by user on 2026-05-03
- Verification manifest:
  - targeted root read-model/command tests for `doctor` promotion and terminal-only catalog expectations
  - targeted PMW app tests for command catalog rendering and sidebar/modal/artifact behaviors affected by this packet
  - root `npm.cmd test`
  - `standard-template` `npm.cmd test` if reusable runtime/read-model/tests are touched
  - `pmw-app` `npm.cmd test`
  - validator: `npm.cmd run harness:validate`
  - PMW export: `npm.cmd run harness:pmw-export`
  - review closeout before packet close
- Browser verification should confirm the accepted sidebar/modal/Artifact Library UX behavior after implementation.

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: pending
- Implementation delta summary: pending implementation
- Source parity result: pending
- Refactor / residual debt disposition: pending
- UX conformance result: pending implementation and browser re-check
- Topology / schema conformance result: not-needed
- Validation / security / cleanup evidence: pending
- Deferred follow-up item:
  future packet for `validation-report` promotion if overwrite/artifact-link/confirmation rules are later approved; separate future packet for `test` if PMW long-run execution UX is explicitly approved
- Improvement candidate reference: none
- Proposed target layer: none
- Promotion status / linked follow-up item: not-needed
- Closeout notes:
  this packet is drafted from the approved `PLN-08` outcome and is now `Ready For Code`; implementation, verification, and review closeout are the remaining steps

## 16. Reopen Trigger
- `test` is proposed for PMW promotion.
- `validation-report` is proposed for PMW promotion.
- `doctor` changes from bounded diagnostic behavior to a stronger side-effect class.
- PMW sidebar/menu pattern changes again beyond the approved remediation set.
- Artifact Library navigation is redesigned beyond the preview-first/on-demand picker pattern.
- Implementation discovers a schema requirement or broader authority-boundary conflict.
- Human approval boundary changes after the 2026-05-03 `Ready For Code` approval.
