# PKT-01 OPS-04 Session-Start Context Assurance And Closeout Gate Hardening

## Status
- Packet opened on 2026-05-04 from `PLN-10`.
- Planning owner: `Planner`
- Implementation owner after approval: `Developer`
- This packet is the first follow-up lane after `DEV-11`.
- User approved implementation on 2026-05-04. This packet now defines the approved scope for the first post-DEV-11 hardening lane.

## Purpose
Harden the first two governance points that still weaken the CLI-first harness after `DEV-11`:

- session start must restore the right execution context through `ACTIVE_CONTEXT` before broad Markdown rereads
- Developer closeout must not hand off reusable work without explicit validation-report evidence

This lane preserves the PMW-free V1.3 baseline while reducing context-window waste and making handoff/closeout evidence harder to fake or forget.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-04 session-start context assurance and closeout gate hardening | External review plus repo inspection confirmed that session-start restoration and Developer closeout validation are still weaker than the rest of the governance model | approved |
| Ready For Code | approved | user approved implementing the agreed root/starter runtime, workflow, validator, transition, and Active Context contract hardening | approved |
| Human sync needed | yes | this lane changes the first-read contract, Active Context schema, and Developer handoff requirements | approved |
| Gate profile | contract | OPS-04 changes reusable workflow rules, validator behavior, transition behavior, Active Context shape, and root/starter sync | approved |
| User-facing impact | high | operators and agents rely on session-start context and closeout evidence for every later lane | approved |
| Layer classification | core | this changes the reusable default governance contract for all future projects | approved |
| Active profile dependencies | none | no optional profile is required | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| UX archetype status | approved | operator-facing CLI and Active Context re-entry surface reuses the existing operator-console-context archetype | approved |
| UX deviation status | none | not applicable | not-needed |
| Environment topology status | approved | local maintainer repo plus copied `standard-template` verification is the accepted execution boundary | approved |
| Domain foundation status | not-needed | no product data/domain design is involved | not-needed |
| Authoritative source intake status | approved | the 2026-05-04 user evaluation and direct user instruction are accepted as authoritative planning inputs | approved |
| Shared-source wave status | not-needed | this is a single active packet | not-needed |
| Packet exit gate status | approved | implementation, tester verification, and reviewer closeout are complete and reviewer approved packet exit on 2026-05-04 | approved |
| Improvement promotion status | promoted | OPS-04 promoted Active Context first-read/freshness enforcement into preventive baseline guidance on 2026-05-04 | approved |
| Existing system dependency | none | no external product or legacy system integration exists | not-needed |
| New authoritative source impact | analyzed | new user evaluation changes the next-lane priority and adds explicit context-restoration requirements | approved |
| Risk if started now | medium | the problem is clear, but the attestation shape and exact validator scope still need agreement | accepted |

## 1. Goal
- Make `ACTIVE_CONTEXT` the compact, deterministic first-read re-entry surface for session start.
- Ensure session-start guidance proves what must be read next instead of assuming the agent followed the right order.
- Make Active Context freshness/parity enforceable like other generated state surfaces.
- Make Developer closeout require explicit validation evidence before reusable work hands off forward.
- Keep packet-before-code, generated-doc immutability, human approval, Tester/Reviewer separation, and root/starter synchronization intact.

## 2. Non-Goal
- Do not reopen PMW.
- Do not add a browser replacement.
- Do not merge security/release hardening into this packet; that belongs in `OPS-05`.
- Do not merge semantic eval/CI hardening into this packet; that belongs in `QLT-02`.
- Do not let `ACTIVE_CONTEXT` become write authority.
- Do not bypass canonical governance Markdown or DB hot-state.

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  session start에서 agent가 큰 canonical 문서를 먼저 읽게 되어 context window를 빨리 소모하고, 실제로 `ACTIVE_CONTEXT`를 먼저 사용했는지 증명하지 못한다. 또 reusable work closeout에서 validation/report evidence가 workflow상 충분히 강제되지 않아, 검증 누락이 뒤늦게 발견될 수 있다.
- 작업 후 사용자가 체감해야 하는 변화:
  새 세션에서 `ACTIVE_CONTEXT`만 먼저 읽어도 현재 lane, 다음 workflow, 반드시 다시 읽어야 할 SSOT, active packet, 결정/막힘을 빠르게 복원할 수 있고, Developer는 validation evidence 없이 다음 lane으로 넘길 수 없게 된다.

## 4. In Scope
- `AGENTS.md` and day-start re-entry contract tightening
- `ACTIVE_CONTEXT.json` / `ACTIVE_CONTEXT.md` schema expansion
- Active Context freshness/parity validator enforcement
- transition/apply ordering and closeout alignment for Active Context plus validation report
- Developer workflow contract hardening for mandatory `validate` + `validation-report` evidence before forward handoff
- root and `standard-template` synchronization for all reusable runtime/workflow/test/doc changes

## 5. Out Of Scope
- dependency inventory, secret scan, release artifact audit hardening
- CI/PR automation and semantic evidence evaluation
- product-specific packet/profile rules
- packaging/installer/manual release redesign unrelated to session start or closeout gate behavior

## 6. Detailed Behavior
- Trigger:
  user approved opening `OPS-04` as the next planning packet.
- Main flow:
  Planner closes the detailed agreement for first-read contract, Active Context schema, freshness enforcement, transition alignment, and Developer closeout gate; Developer then implements the approved reusable changes; Tester verifies root/starter parity and closeout behavior; Reviewer approves packet exit.
- Alternate flow:
  if a full read-attestation artifact is too heavy, keep a lighter workflow-visible start brief but still require validator-visible freshness/parity for `ACTIVE_CONTEXT`.
- Empty state:
  a fresh starter still shows bootstrap work, but `ACTIVE_CONTEXT` must include the bootstrap lane, next workflow, and minimal must-read guidance in structured form.
- Error state:
  validator fails when Active Context is stale, missing required schema fields, or disagrees with current lane/next action surfaces after reusable state changes.
- Loading/transition:
  transition/apply must leave canonical docs, generated docs, Active Context, validation report, and next-action surfaces mutually aligned in the same turn.

## 7. Program Function Detail
- 입력:
  `AGENTS.md`, `.agents/skills/day_start/SKILL.md`, `.agents/workflows/dev.md`, `.harness/runtime/state/active-context.js`, `.harness/runtime/state/dev05-tooling.js`, `.harness/runtime/state/drift-validator.js`, governance Markdown truth, DB hot-state, latest handoff, and the 2026-05-04 user evaluation.
- 처리:
  define a first-read contract for session start, expand Active Context structure, add freshness/parity checks, tighten transition ordering/evidence rules, and harden Developer closeout workflow requirements.
- 출력:
  revised root/starter workflow/rule/runtime/test surfaces, updated Active Context schema, validator coverage, and packet/closeout evidence rules.
- 권한/조건:
  all changes stay inside reusable harness runtime/governance surfaces and must remain source-traceable to this approved packet.
- edge case:
  planning truth can move ahead of DB hot-state; OPS-04 must close the gap so `ACTIVE_CONTEXT` cannot silently stay behind while validator remains green.

## 8. UI/UX Detailed Design
- Active profile references: not-needed
- Profile composition rationale: not-needed
- Profile-specific UX / operation contract: not-needed
- Primary admin entity / surface: terminal CLI plus Active Context artifacts
- Grid interaction model: not-needed
- Search / filter / sort / pagination behavior: not-needed
- Row action / bulk action rule: not-needed
- Edit / save / confirm / audit pattern: preview/apply transition path plus explicit validation evidence before forward handoff
- Profile deviation / exception: not-needed
- UX archetype reference: `reference/artifacts/PRODUCT_UX_ARCHETYPE.md`
- Selected UX archetype: `operator-console-context`
- Archetype fit rationale: this lane strengthens the existing CLI/context surface instead of introducing a new UI
- Archetype deviation / approval: not-needed
- 영향받는 화면:
  terminal `harness:context`, `status`, `next`, `handoff`, and the rendered `ACTIVE_CONTEXT.md`
- 레이아웃 변경:
  `ACTIVE_CONTEXT.md` may gain clearer structured sections for lane, next workflow, must-read next, and required source traces
- interaction:
  session start reads `ACTIVE_CONTEXT` first, then only the explicitly required follow-up sources
- copy/text:
  human-facing re-entry text remains Korean-first and operator-oriented; AI-facing JSON remains compact and deterministic
- feedback/timing:
  stale or incomplete Active Context must be visible quickly instead of forcing the operator to discover drift later in closeout
- source trace fallback:
  Active Context must point back to current state, task list, implementation plan, active packet, latest handoff, and validation report

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  session-start re-entry and closeout gate rules are reusable harness governance, not project-specific packet detail
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `AGENTS.md`, `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`, `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `.agents/artifacts/PREVENTIVE_MEMORY.md`, `reference/planning/PLN-10_POST_DEV11_HARDENING_AND_RELEASE_ASSURANCE_DRAFT.md`, this packet, `reference/artifacts/REVIEW_REPORT.md`, `reference/artifacts/WALKTHROUGH.md`
- Environment topology reference: this packet defines local maintainer repo plus copied `standard-template` verification only
- Source environment: maintainer repository
- Target environment: root plus copied `standard-template`
- Execution target: local Windows maintainer/operator machine
- Transfer boundary: root/starter reusable runtime, workflow, docs, and tests must remain synchronized
- Rollback boundary: revert this packet's implementation changes if the new first-read or closeout contract is rejected during review
- Domain foundation reference:
  not-needed
- Schema impact classification:
  no product-domain schema change expected; reuse current DB tables unless Active Context freshness tracking needs explicit generation-state expansion
- DB / state 영향:
  work-item truth, release state, handoff evidence, generation state, and validation reporting may need additional Active Context fields or freshness recording
- Markdown / docs 영향:
  `AGENTS.md`, workflows, skills, and operator-facing re-entry guidance may change
- generated docs 영향:
  `ACTIVE_CONTEXT.*` parity/freshness becomes an explicit governed surface
- validator / cutover 영향:
  validator must fail on stale/missing Active Context contract and on missing closeout validation evidence for reusable forward handoff rules
- Authoritative source refs:
  2026-05-04 user evaluation message, user instruction to proceed with `OPS-04`, `PLN-10`, `REVIEW_REPORT.md`, `WALKTHROUGH.md`, `AGENTS.md`, `day_start`, `active-context.js`, `dev05-tooling.js`, `drift-validator.js`
- Authoritative source intake reference: `reference/planning/PLN-10_POST_DEV11_HARDENING_AND_RELEASE_ASSURANCE_DRAFT.md` and this packet
- Authoritative source disposition: accept the external evaluation's context-restoration and closeout-gate critique as active follow-up scope; defer release/security work to `OPS-05` and eval/CI work to `QLT-02`
- New planning source priority / disposition:
  the 2026-05-04 user evaluation changes the first follow-up priority after `DEV-11`
- Existing plan conflict: current `AGENTS.md` and `day_start` read order still begins from large canonical Markdown instead of `ACTIVE_CONTEXT`
- Current implementation impact: root/starter runtime, workflows, skills, validator, and transition logic will all need synchronized updates
- Required rework / defer rationale:
  security/release hardening and semantic eval/CI work are intentionally deferred so OPS-04 stays focused on the first-read and closeout gates
- Impacted packet set scope: single active packet
- Authoritative source wave ledger reference:
  not-needed
- Source wave packet disposition:
  continue
- Existing program / DB dependency:
  none
- Existing schema source artifact:
  not-needed
- Product source root:
  `.harness/runtime/`, `.harness/test/`, `.agents/rules/`, `.agents/workflows/`, `.agents/skills/`, `standard-template/`
- Product test root:
  `.harness/test/`, `standard-template/.harness/test/`
- Product runtime requirements:
  Node 24+ unchanged
- Harness/product boundary exceptions:
  none
- Runtime / framework:
  Node.js CLI harness runtime
- Data persistence boundary:
  SQLite DB plus generated docs, validation report, and Active Context artifacts
- Deployment target:
  reusable standard harness baseline and copied starter
- Node.js product runtime policy:
  unchanged
- Package manager:
  npm
- Build command:
  not a packaging/build lane
- Test command:
  targeted root/starter runtime tests, root/starter full tests, `harness:validate`, `harness:validation-report`, `harness:context`, and transition preview/apply verification

## 10. Acceptance
- Session-start contract uses `ACTIVE_CONTEXT` as the compact first-read surface before broad Markdown expansion.
- `ACTIVE_CONTEXT` exposes explicit `selected lane`, `next workflow`, `must read next`, and source-traced re-entry guidance in machine-usable form.
- validator can detect stale or incomplete Active Context contract, not only stale generated state docs.
- reusable Developer forward handoff cannot close cleanly without explicit validation/report evidence.
- root and `standard-template` stay synchronized for runtime, workflow, skill, doc, and test changes.

## 11. Open Questions
- Should session-start assurance require a validator-visible read-attestation/digest artifact, or is a workflow-visible start brief sufficient?
- Should Active Context freshness live in existing generation-state tables only, or also gain explicit contract rows/metadata?
- Should missing closeout validation evidence be enforced by workflow contract text only, or by validator checks against the latest handoff/review surfaces as well?

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | yes | user/planner | approved | user approved opening `OPS-04` as the next planning lane |
| Optional profile evidence approval | no | planner | not-needed | no optional profile is active |
| Detailed function agreement | yes | user/planner | approved | user approved the exact first-read, freshness, and closeout-gate implementation direction on 2026-05-04 |
| Detailed UI/UX agreement | no | planner | not-needed | no new product-facing UI is introduced |
| Environment topology approval | yes | user/planner | approved | local root plus copied starter verification |
| Domain foundation approval | no | planner | not-needed | no product-domain design is involved |
| Authoritative source disposition approval | yes | user/planner | approved | external evaluation is accepted as active planning input |
| Source wave rebaseline approval | no | planner | not-needed | single active packet only |
| Packet exit quality gate approval | yes | reviewer | approved | reviewer approved OPS-04 packet exit on 2026-05-04 after tester verification, validation evidence, and copied-starter smoke review |
| Improvement promotion decision | yes | planner/reviewer | approved | promoted into preventive memory rule `ACTIVE-CONTEXT-REENTRY-001` on 2026-05-04 |
| Ready For Code sign-off | yes | user | approved | implementation opened after the 2026-05-04 user approval |

## 13. Implementation Notes
- prefer extending existing `ACTIVE_CONTEXT` and transition infrastructure instead of adding a second re-entry surface
- do not let session-start assurance become a heavyweight ceremony that recreates the old PMW cost problem
- if validator enforcement is added for closeout evidence, keep the rule tied to reusable forward handoff behavior rather than arbitrary project work
- root and `standard-template` must remain synchronized in the same lane

## 14. Verification Plan
- Gate profile:
  contract
- Verification manifest:
  - targeted Active Context schema/freshness tests
  - targeted transition ordering/closeout-evidence tests
  - targeted workflow/skill contract tests for session start and Developer closeout
  - root `npm.cmd test`
  - `standard-template` `npm.cmd test`
  - root `npm.cmd run harness:validate`
  - root `npm.cmd run harness:validation-report`
  - root `npm.cmd run harness:context`
  - copied-starter `harness:context`, `next`, `handoff`, and `validate` smoke after sync

## Verification Manifest
- Gate profile: contract
- Required evidence: Ready For Code agreement, root and `standard-template` synchronization, targeted regression tests, root/starter full suites, validator, Active Context evidence, and review closeout
- Primary commands: `npm.cmd test`, `npm.cmd test` in `standard-template`, `npm.cmd run harness:validate`, `npm.cmd run harness:validation-report`, `npm.cmd run harness:context`

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: approve; reviewer confirmed the approved OPS-04 scope, tester evidence, and root/starter parity with no open closeout finding.
- Implementation delta summary: Implemented the reusable first-read `ACTIVE_CONTEXT` contract across `AGENTS.md`, workspace/day-start guidance, developer closeout workflow rules, Active Context runtime generation, transition ordering, validator freshness/parity enforcement, and synchronized root/`standard-template` regression coverage.
- Source parity result: aligned with the approved OPS-04 scope. The reviewed runtime/workflow/doc/test surfaces all reflect `ACTIVE_CONTEXT` first-read re-entry, explicit `mustReadNext` / `sourceTrace` contract fields, validator-visible freshness enforcement, and mandatory Developer validation/report evidence before forward handoff.
- Refactor / residual debt disposition: no blocking implementation defect remains in the reviewed OPS-04 scope. Out-of-scope installer/package rebuild execution was not repeated in this lane because OPS-04 did not change release packaging surfaces.
- UX conformance result: aligned with the approved `operator-console-context` archetype. The active user-facing surface remains terminal CLI plus Korean-first `ACTIVE_CONTEXT.md`, while AI-facing re-entry remains compact structured JSON.
- Topology / schema conformance result: aligned. No DB schema migration was required; existing generation-state tracking now covers `ACTIVE_CONTEXT.*`, and root plus copied-starter flows both passed reviewer-checked smoke validation.
- Validation / security / cleanup evidence: root `npm.cmd test` and `standard-template` `npm.cmd test` passed at 48/48; root `npm.cmd run harness:validate`, `npm.cmd run harness:validation-report`, and `npm.cmd run harness:context` all passed; copied-starter `harness:init/context/next/handoff/validate` smoke passed; no new external integration, credential, or network surface was introduced in the reviewed scope.
- Deferred follow-up item: `OPS-05` release/security hardening, `QLT-02` semantic eval/CI hardening
- Improvement candidate reference: `ACTIVE-CONTEXT-REENTRY-001`
- Proposed target layer: core
- Promotion status / linked follow-up item: promoted / `OPS-04` (closed 2026-05-04)
- Closeout notes: Reviewer approved OPS-04 closeout on 2026-05-04 after confirming approved packet parity, tester walkthrough evidence, root/`standard-template` synchronization, clean validator/report/context outputs, and copied-starter bootstrap routing through `ACTIVE_CONTEXT`.

## 16. Reopen Trigger
- session-start contract still begins from broad canonical rereads instead of compact Active Context
- Active Context freshness/parity remains unenforced
- Developer can still hand off reusable work without explicit validation-report evidence
- root/starter synchronization breaks
- a later design decision tries to merge release/security or semantic eval scope into this packet without explicit approval
