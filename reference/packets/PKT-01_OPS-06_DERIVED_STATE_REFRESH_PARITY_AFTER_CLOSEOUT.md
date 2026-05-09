# PKT-01 OPS-06 Derived-State Refresh Parity After Closeout

## Status
- Packet opened on 2026-05-04 from `PLN-10`.
- Planning owner: `Planner`
- Implementation owner after Ready For Code approval: `Developer`
- On 2026-05-04, the user approved this packet as the next narrow follow-up after `QLT-02` closeout.
- Detailed packet scope is approved for planning purposes; implementation remains blocked until explicit `Ready For Code`.

## Purpose
Close the now-confirmed gap where canonical human-facing closeout state can move forward while AI-facing derived re-entry state still presents the just-closed work item as active.

`OPS-04` hardened session-start context assurance. `QLT-02` hardened evidence quality, semantic trace, and validation/context parity for active work. During `QLT-02` closeout on 2026-05-04, a narrower remaining risk was reproduced: after `reviewer -> planner` closeout recording and even after explicit regeneration commands, canonical Markdown closeout state and `ACTIVE_CONTEXT` / validation-derived surfaces can still disagree about whether the closed work item remains active.

This packet defines:

- how closeout-time derived-surface refresh ordering should work
- what parity is required between canonical closeout state and AI-facing derived re-entry state
- what must fail hard versus remain follow-up-only in this narrow lane
- what should be fixed now before `OPS-05`, and what remains out of scope

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-06 derived-state refresh parity after closeout | `QLT-02` closeout reproduced a first-reentry-state mismatch after planner closeout; this is smaller and more urgent than opening `OPS-05` first | approved |
| Ready For Code | hold | the user approved this as the next narrow packet, but did not yet approve implementation | pending |
| Human sync needed | yes | this packet changes the next-lane sequence under `PLN-10` and now has explicit user packet-selection approval | approved |
| Gate profile | contract | reusable runtime, validator, Active Context, and closeout bookkeeping behavior are affected | draft |
| User-facing impact | medium | no new product feature is added, but operator and AI re-entry trust after closeout changes materially | draft |
| Layer classification | core | this is reusable harness state/parity behavior | approved |
| Active profile dependencies | none | no optional profile is required | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| UX archetype status | approved | the lane only hardens existing operator-facing state and evidence surfaces | approved |
| UX deviation status | none | not applicable | not-needed |
| Environment topology status | approved | local maintainer repository only; no deploy/cutover topology change is proposed | approved |
| Domain foundation status | not-needed | no product-domain or DB design work is involved | not-needed |
| Authoritative source intake status | approved | the 2026-05-04 reproduced closeout mismatch is now an explicit planning input under `PLN-10` | approved |
| Shared-source wave status | not-needed | single proposed packet | not-needed |
| Packet exit gate status | pending | no implementation lane is active yet | draft |
| Improvement promotion status | approved | this packet supersedes `QLT-TRANSITION-REFRESH-001` as the approved narrow planning lane for the reproduced closeout-parity risk | approved |
| Existing system dependency | none | no external product/runtime integration is required | not-needed |
| New authoritative source impact | analyzed | `QLT-02` closeout evidence changes the recommended next-lane order inside `PLN-10` | approved |
| Risk if started now | low | the scope is intentionally narrow and bounded to reproduced closeout parity behavior | approved |

## 1. Goal
- Ensure a closed packet does not remain presented as the active work item in AI-facing derived re-entry state after canonical closeout has already advanced.
- Make closeout-time `ACTIVE_CONTEXT` and validation-derived summaries agree with canonical Markdown closeout bookkeeping.
- Decide the minimum hard-fail parity enforcement needed for this exact reproduced gap without reopening broader evidence-governance scope.

## 2. Non-Goal
- Do not reopen `QLT-02` semantic evidence scope.
- Do not merge dependency inventory, secret scan, or release artifact audit work from `OPS-05`.
- Do not redesign workflow routing, PMW history, or unrelated release-baseline logic.
- Do not add new CI/PR execution wiring.

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  canonical human-facing closeout state는 `QLT-02`를 닫았는데, AI-facing `ACTIVE_CONTEXT`는 같은 직후 재생성 후에도 닫힌 work item을 active task처럼 유지할 수 있다. 이 상태에서는 다음 agent가 first-read surface만 믿고 잘못된 lane continuity를 해석할 위험이 있다.
- 작업 후 사용자가 체감해야 하는 변화:
  packet closeout 직후에는 canonical Markdown truth와 AI-facing re-entry state가 같은 현재 lane / next lane 결론을 보여야 하며, 닫힌 work item이 active로 남아 있지 않아야 한다.

## 4. In Scope
- closeout-time derived-surface refresh ordering
- canonical closeout state vs `ACTIVE_CONTEXT` active-task parity
- canonical closeout state vs validation-derived next-action parity when the closed work item should no longer be active
- validator-backed detection for this reproduced closeout mismatch if needed
- root and `standard-template` sync for any reusable runtime/test/doc change in this lane

## 5. Out Of Scope
- `OPS-05` dependency inventory, secret scan, release artifact audit
- `QLT-02` hard-fail boundary redesign
- CI/PR candidate-gate expansion or execution wiring
- PMW revival or packaging redesign
- broad workflow-role redesign

## 6. Detailed Behavior
- Trigger:
  a packet reaches reviewer-approved closeout and Planner records the closeout.
- Main flow:
  canonical closeout bookkeeping moves the work item into completed state, then derived re-entry surfaces must stop presenting that work item as active and must route the next work according to the remaining planning baseline.
- Alternate flow:
  if no active work item remains after closeout, derived state may point to planner-owned next planning work or a neutral planning continuation, but it must not continue to present the closed work item as active.
- Empty state:
  for a fresh starter or a repo with no closed packet transition in play, the existing bootstrap or active-work routing behavior should remain unchanged.
- Error state:
  if canonical Markdown shows a packet closed but `ACTIVE_CONTEXT` or validation-derived next work still reports it as active, that mismatch must be treated as a closeout-parity defect in this lane.
- Loading/transition:
  any implementation from this packet must preserve generated-doc immutability, Active Context derived authority, packet-before-code, and Tester/Reviewer separation.

## 7. Program Function Detail
- 입력:
  `CURRENT_STATE.md`, `TASK_LIST.md`, `IMPLEMENTATION_PLAN.md`, `ACTIVE_CONTEXT.*`, `VALIDATION_REPORT.*`, `REVIEW_REPORT.md`, `WALKTHROUGH.md`, transition runtime, validator/runtime tests, and `QLT-02` closeout evidence.
- 처리:
  detect whether the closed work item remains incorrectly active in derived re-entry state; tighten transition-time refresh ordering and/or derived-state source selection so closed work does not remain the active task after closeout.
- 출력:
  aligned canonical closeout state plus aligned AI-facing re-entry state after planner closeout.
- 권한/조건:
  this lane may change reusable runtime/validator/derived-state behavior, but it must stay narrow and must not pull in unrelated `OPS-05` or `QLT-02` scope.
- edge case:
  if a closed work item is also the last recently touched lane, history may still mention it, but the active-task selection and next-work routing must not treat it as active.

## 8. UI/UX Detailed Design
- Active profile references: not-needed
- Profile composition rationale: not-needed
- Profile-specific UX / operation contract: not-needed
- Primary admin entity / surface: CLI/state evidence surfaces
- Grid interaction model: not-needed
- Search / filter / sort / pagination behavior: not-needed
- Row action / bulk action rule: not-needed
- Edit / save / confirm / audit pattern: not-needed
- Profile deviation / exception: not-needed
- UX archetype reference: existing operator evidence/context archetype
- Selected UX archetype: not-needed
- Archetype fit rationale: no new UI surface is introduced; existing state/evidence surfaces are only being aligned
- Archetype deviation / approval: not-needed
- 영향받는 화면:
  `harness:context`, `validation-report`, `CURRENT_STATE.md`, `TASK_LIST.md`, and the AI-facing `ACTIVE_CONTEXT.json`
- 레이아웃 변경:
  not-needed
- interaction:
  after closeout, the first AI re-entry surface and canonical Markdown closeout state should lead to the same next lane conclusion
- copy/text:
  state wording should clearly distinguish active vs closed work items
- feedback/timing:
  operators should not need an extra manual interpretation step to decide whether the just-closed work item is still active
- source trace fallback:
  any derived closeout summary must point back to canonical closeout artifacts

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale: this is reusable closeout parity and re-entry-state behavior
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `AGENTS.md`, `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`, `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `.agents/artifacts/PREVENTIVE_MEMORY.md`, `reference/planning/PLN-10_POST_DEV11_HARDENING_AND_RELEASE_ASSURANCE_DRAFT.md`, `reference/artifacts/WALKTHROUGH.md`, `reference/artifacts/REVIEW_REPORT.md`, `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`, this packet
- Environment topology reference: local maintainer repository only
- Source environment: maintainer repository
- Target environment: root plus `standard-template`
- Execution target: local Windows maintainer/operator machine
- Transfer boundary: reusable runtime/tests/docs must remain synchronized across root and starter
- Rollback boundary: revert this lane's changes if closeout parity hardening introduces wider routing regressions
- Domain foundation reference: not-needed
- Schema impact classification: no product-domain schema impact expected; work-item/derived-state metadata behavior only
- DB / state 영향: may change work-item selection, closeout routing, or derived-state generation behavior
- Markdown / docs 영향: `CURRENT_STATE.md`, `TASK_LIST.md`, planning/review evidence, and preventive-memory references may change
- generated docs 영향: `ACTIVE_CONTEXT` and generated state docs may change closeout-time routing/parity behavior
- validator / cutover 영향: validator may gain a narrower closeout-parity check if needed; no cutover topology change
- Authoritative source refs: `reference/artifacts/REVIEW_REPORT.md`, `reference/artifacts/WALKTHROUGH.md`, `VALIDATION_REPORT.json`, `ACTIVE_CONTEXT.json`
- Authoritative source intake reference: `reference/planning/PLN-10_POST_DEV11_HARDENING_AND_RELEASE_ASSURANCE_DRAFT.md`
- Authoritative source disposition: implemented; treat the reproduced `QLT-02` closeout mismatch as the reason this packet exists
- New planning source priority / disposition: closeout evidence from 2026-05-04 reorders the recommended next-lane sequence ahead of `OPS-05`
- Existing plan conflict: `PLN-10` previously treated the issue as a candidate-only follow-up; current closeout evidence shows it is stronger and affects first AI re-entry
- Current implementation impact: likely touches transition/derived-state runtime, active-work selection, closeout bookkeeping tests, and root/starter synchronization
- Required rework / defer rationale: keep `OPS-05` deferred until this narrower closeout parity risk is explicitly accepted or remediated
- Impacted packet set scope: single-packet
- Authoritative source wave ledger reference: not-needed
- Source wave packet disposition: continue
- Existing program / DB dependency: none
- Existing schema source artifact: not-needed
- Product source root: `.harness/runtime/`, `.harness/test/`, `.agents/artifacts/`, `reference/artifacts/`, `reference/packets/`, `standard-template/`
- Product test root: `.harness/test/`, `standard-template/.harness/test/`
- Product runtime requirements: Node 24+ unchanged
- Harness/product boundary exceptions: none
- Runtime / framework: Node.js CLI harness runtime
- Data persistence boundary: SQLite DB plus generated docs and Markdown evidence artifacts
- Deployment target: reusable standard harness baseline and copied starter
- Test command: targeted transition/runtime parity tests, root/starter full suites, `harness:validate`, `harness:validation-report`, and `harness:context`

## 10. Acceptance
- After planner closeout of an approved packet, canonical Markdown closeout state and `ACTIVE_CONTEXT` no longer disagree about whether the closed work item remains active.
- The just-closed work item is moved to completed bookkeeping and is not selected as the active task in AI-facing re-entry state.
- Root and `standard-template` remain synchronized, and the required validator/report/context evidence stays green after the narrow fix.

## 11. Open Questions
- Should this lane add a new hard-fail validator code for closed-work-item active-state mismatch, or is runtime selection correction plus existing parity checks enough?
- After a packet is closed and no replacement packet is open yet, should AI-facing next work resolve to the selected planning lane, a neutral planner continuation, or another canonical surface?

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | yes | user/planner | approved | approved as a reusable core closeout-parity lane |
| Detailed function agreement | yes | user/planner | approved | the user approved this packet as the next narrow follow-up lane; scope remains post-closeout derived-state refresh parity only |
| Detailed UI/UX agreement | no | planner | not-needed | no new UI surface is proposed |
| Environment topology approval | no | planner | approved | local repository/runtime only |
| Domain foundation approval | no | planner | not-needed | no data-impact design work is involved |
| Authoritative source disposition approval | yes | user/planner | approved | reviewer closeout evidence is accepted as the reason this packet now exists |
| Source wave rebaseline approval | no | planner | not-needed | single packet |
| Packet exit quality gate approval | yes | user/planner | approved | the user approved this packet as the next narrow lane before `OPS-05`; implementation approval remains separate |
| Improvement promotion decision | yes | user/planner | approved | `QLT-TRANSITION-REFRESH-001` should now be treated as superseded by this packet if implementation later opens |
| Ready For Code sign-off | yes | user | pending | packet selection is approved, but implementation remains blocked until explicit Ready For Code approval |

## 13. Implementation Notes
- keep the lane narrow; do not let it absorb `OPS-05` or broader `QLT-02` work
- preserve packet-before-code, generated-doc immutability, Active Context derived authority, and Tester/Reviewer separation
- prefer fixing active-work selection / derived-surface refresh ordering over inventing additional manual repair steps
- keep root/`standard-template` synchronization in the same change set

## Verification Manifest
- Gate profile:
  contract
- Verification manifest:
  - approved packet scope and Ready For Code before implementation opens
  - targeted closeout-parity regression tests
  - root `node --test .harness/test/*.test.js`
  - `standard-template` `node --test .harness/test/*.test.js`
  - root validator: `node .harness/runtime/state/dev05-cli.js validate`
  - root `node .harness/runtime/state/dev05-cli.js validation-report`
  - root active context: `node .harness/runtime/state/dev05-cli.js context`
  - review closeout remains required before packet exit
  - copied-starter smoke only if the reusable change affects bootstrap routing or starter-derived parity

## 14. Verification Plan
- The contract gate is carried by `## Verification Manifest` above.

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference:
  `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation:
  pending
- Implementation delta summary:
  pending
- Source parity result:
  pending
- Refactor / residual debt disposition:
  pending
- UX conformance result:
  not-needed
- Topology / schema conformance result:
  not-needed
- Validation / security / cleanup evidence:
  pending
- Deferred follow-up item:
  `OPS-05`
- Improvement candidate reference:
  `QLT-TRANSITION-REFRESH-001` (superseded by this approved `OPS-06` planning lane)
- Proposed target layer:
  core
- Promotion status / linked follow-up item:
  pending-review / `OPS-06`
- Closeout notes:
  pending

## 16. Reopen Trigger
- the user decides this issue should stay preventive-memory-only instead of opening implementation
- the reproduced mismatch disappears under a canonical closeout path without code changes
- the issue expands into broader `OPS-05` or `QLT-02` scope
- a different closeout-time parity defect changes the lane boundary
