# PKT-01 OPS-27 Post-transition validation / Active Context freshness convergence

## Purpose
- Reopen the residual post-transition stale-window issue as a new narrow packet because the same-turn `validation-report` / `ACTIVE_CONTEXT` freshness mismatch was reproduced again during `OPS-26` closeout on 2026-05-15.
- Make the first immediate post-transition `validate`, `validation-report`, and `status` path converge without requiring the operator to remember a manual rerun sequence.
- Keep this lane narrower than `PLN-20` and narrower than broad workflow-governance or validator redesign.

## Approval Rule
- This packet starts in Planner workflow.
- The user approved opening this narrow residual-fix lane on 2026-05-15 after the stale-window reproduced again during `OPS-26` closeout.
- This packet is planning-only until detailed agreement and `Ready For Code` are explicitly approved.
- This packet must not absorb `PLN-20` payload-boundary implementation, packet-open semantic-preflight work, or broad workflow/validator redesign.

## Detailed Agreement Proposal
- Primary planning direction:
  - remove the residual first-read freshness mismatch where post-transition `ACTIVE_CONTEXT.validation.executedAt` and `VALIDATION_REPORT.json` can still disagree for one immediate turn
- Narrow planning scope:
  - keep the fix limited to transition-time derived refresh ordering, write ordering, or equivalent narrow source-selection behavior
  - cover the concrete repeated symptom seen after `planner -> planner` closeout and the earlier supported transition set from `OPS-14`
  - require deterministic first-read parity across `validate`, `validation-report`, `status`, and `ACTIVE_CONTEXT`
  - preserve the current workflow-routing and packet-open semantic-preflight contracts
- Non-scope:
  - no `PLN-20` starter payload work
  - no packet-open semantic-preflight redesign
  - no broad validator architecture rewrite
  - no packet template rewrite
  - no DB schema change
  - no product-specific starter customization
- Approval boundary:
  - this proposal opens only the residual freshness-convergence lane; implementation remains blocked until separate `Ready For Code` approval

## Detailed Agreement Approval Text
Detailed agreement is approved for OPS-27 with the following closed decisions:
- scope stays limited to residual post-transition validation / Active Context freshness convergence only
- the implementation path must stay narrower than `PLN-20` payload work and narrower than `OPS-26` semantic packet-open preflight work
- the first pass must target deterministic first-read parity across `validate`, `validation-report`, `status`, and `ACTIVE_CONTEXT`
- the fix may adjust transition-time derived refresh ordering, write ordering, or equivalently narrow source-selection behavior, but it must preserve the current workflow-routing and approval-state contracts
- regression should cover the repeated supported transitions that still exhibit the residual freshness mismatch, including `planner -> planner` closeout / defer paths
- OPS-27 must not absorb broad validator redesign, packet template rewrite, workflow-governance redesign, DB schema change, or product-specific starter customization
- implementation remains blocked until separate `Ready For Code` approval

## Detailed Agreement Approval Decision
- User approved the OPS-27 detailed agreement on 2026-05-15.
- This approval covers the narrow residual freshness-convergence boundary, the requirement to make first-read validation/context/status parity deterministic, and the decision to keep broader redesign out of scope.
- This approval does not authorize implementation.
- `Ready For Code` remains blocked until separately approved.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-27 Post-transition validation / Active Context freshness convergence | the stale-window reproduced again on 2026-05-15 after `OPS-26` closeout even though the lane itself was complete | approved |
| Ready For Code | approved | user approved the bounded residual freshness-convergence implementation scope on 2026-05-15 | approved |
| Human sync needed | yes | this changes reusable transition-time state convergence and operator trust in immediate read surfaces | approved |
| Gate profile | contract | reusable transition/runtime/derived-state behavior may change | approved |
| User-facing impact | medium | no product feature changes, but operators should stop seeing false failure right after valid transitions | approved |
| Layer classification | core | this is reusable harness transition and derived-state behavior | approved |
| Active profile dependencies | none | no optional profile is active | not-needed |
| Profile evidence status | not-needed | no profile-specific evidence is required | not-needed |
| UX archetype status | approved | existing operator evidence/context CLI archetype is sufficient for this residual runtime lane | approved |
| UX deviation status | none | no product UI or UX deviation is proposed | not-needed |
| Environment topology status | not-needed | no deploy/cutover topology is involved | not-needed |
| Domain foundation status | approved | Ready For Code implementation still needs an explicit no-domain-impact contract even though no product schema change is expected | approved |
| Authoritative source intake status | approved | repeated local repro during `OPS-26` closeout plus prior `OPS-14` evidence is sufficient authority to reopen this as a new narrow lane | approved |
| Shared-source wave status | not-needed | this is a single-packet process-hardening lane | not-needed |
| Packet exit gate status | pending | closeout depends on deterministic first-read parity evidence without manual reruns | pending |
| Existing system dependency | none | no external product or legacy system dependency is touched | not-needed |
| New authoritative source impact | analyzed | the new source is the 2026-05-15 residual repro after `OPS-26` closeout, which shows `OPS-14` did not fully remove the stale window | approved |
| Risk if started now | medium | if scope widens, this could drift back into broad workflow or validator redesign instead of a narrow refresh-convergence fix | approved |

## Lane-Typed Minimum Contract
- Lane-type declaration:
  planning
- Lane-type universal minimum sections:
  Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger
- Lane-type required sections:
  Cause Analysis; Proposed Alternative; Human Sync / Approval Boundary; Verification Manifest; source trace to `OPS-14`, the 2026-05-15 `OPS-26` closeout repro, and the current transition / active-context / validation-report runtime path
- Lane-type conditional sections:
  runtime/test implementation details are conditional only after separate `Ready For Code` approval
- Lane-type not-needed sections:
  environment topology, domain foundation, existing DB compatibility, release packaging, and optional profile evidence are not needed unless scope changes

## 1. Goal
- Remove the residual first-read stale window after supported transition apply.
- Make the first immediate `validate`, `validation-report`, `status`, and `ACTIVE_CONTEXT` read agree on freshness-sensitive validation state.
- Preserve current workflow-routing, packet-before-code, and approval semantics.

## 2. Non-Goal
- Do not reopen `PLN-20` payload-boundary implementation in this lane.
- Do not reopen `OPS-26` semantic packet-open preflight work.
- Do not redesign packet templates or workflow-governance broadly.
- Do not change DB schema.
- Do not auto-heal unrelated validator failures.

## 3. User Problem And Expected Outcome
- Current problem:
  transition apply succeeds, but the first immediate `validate` or `status` can still fail on `ACTIVE_CONTEXT.validation.executedAt` mismatch until `validation-report` and `validate` are rerun in sequence.
- Expected outcome:
  after a supported transition apply, the first immediate read path should already be converged, and operators should not need to remember a recovery sequence just to settle freshness metadata.

## 4. In Scope
- residual stale-window analysis after supported transitions
- transition-time derived refresh ordering or equivalent narrow freshness-convergence behavior
- first-read parity across `validate`, `validation-report`, `status`, and `ACTIVE_CONTEXT`
- regression coverage for the repeated transition routes that still exhibit the residual mismatch
- root / `standard-template` synchronization for any reusable runtime/test changes

## 5. Out Of Scope
- `PLN-20` starter payload work
- `OPS-26` semantic preflight contract work
- broad validator architecture redesign
- packet template rewrite
- workflow-governance redesign
- DB schema changes

## 6. Cause Analysis
- `OPS-14` closed the earlier broad stale-parity lane, but the 2026-05-15 `OPS-26` closeout still reproduced a narrower freshness mismatch: `ACTIVE_CONTEXT.validation.executedAt` can lag one turn behind `VALIDATION_REPORT.json`.
- The same-turn sequence can therefore show:
  - transition apply succeeds
  - immediate `validation-report` later passes
  - immediate `validate` or `status` still reads the prior freshness metadata until one more rerun settles the state
- That means the remaining issue is no longer “route ownership still points to the old owner,” but “derived validation freshness is not yet deterministic on the first read.”

## 7. Proposed Alternative
- Keep the fix narrower than the original `OPS-14` wording by targeting freshness convergence specifically.
- Adjust transition-time regeneration ordering, validation-summary write ordering, or equivalent narrow source-selection behavior so the first immediate read surfaces already agree.
- Preserve existing planner fallback, packet-open semantic-preflight, and approval-state behavior.
- Treat any need for broader validator or workflow redesign as a reopen trigger, not as in-scope creep.

## 8. Program Function Detail
- Input:
  supported transition apply followed by immediate `validate`, `validation-report`, `status`, or `context`
- Processing:
  deterministic derived refresh ordering for validation summary and `ACTIVE_CONTEXT`
- Output:
  first-read parity without manual sequential reruns
- Edge case:
  if transition apply legitimately fails for another reason, the residual freshness fix must not mask the real blocking finding

## 9. UI/UX Detailed Design
- UX archetype reference: existing operator evidence/context CLI surface
- Selected UX archetype: operator evidence/context CLI helper surface
- Impacted screen: no product UI
- Copy/text: operator-facing validation/context/status summaries only
- Archetype fit rationale:
  this lane changes trust and determinism of immediate CLI read surfaces, not product UI design
- Archetype deviation / approval: none

## 10. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  reusable transition-time derived-state convergence belongs in core
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `.agents/artifacts/CURRENT_STATE.md`; `.agents/artifacts/TASK_LIST.md`; `.agents/artifacts/REQUIREMENTS.md`; `.agents/artifacts/IMPLEMENTATION_PLAN.md`; `.agents/artifacts/PREVENTIVE_MEMORY.md`; `reference/packets/PKT-01_OPS-14_POST_TRANSITION_VALIDATION_CONTEXT_REFRESH_DETERMINISM.md`; `reference/packets/PKT-01_OPS-26_PACKET_OPEN_SEMANTIC_PREFLIGHT_HARDENING.md`; `.harness/runtime/state/dev05-tooling.js`; `.harness/runtime/state/active-context.js`; `.harness/runtime/state/drift-validator.js`; `.harness/runtime/state/context-repair.js`
- Environment topology reference: not-needed
- Domain foundation reference: reusable harness transition/runtime derived-state only; no product-domain model or schema redesign is in scope
- Schema impact classification: none expected
- DB / state impact:
  hot-state transition ordering, derived validation freshness, or Active Context write timing may change
- Markdown / docs impact:
  this packet and planning baseline updates only in this lane
- generated docs impact:
  yes; this lane exists specifically to harden same-turn convergence in derived validation/context surfaces
- validator / cutover impact:
  likely yes, but only for deterministic first-read parity
- Authoritative source refs:
  - `.agents/artifacts/PREVENTIVE_MEMORY.md`
  - `reference/packets/PKT-01_OPS-14_POST_TRANSITION_VALIDATION_CONTEXT_REFRESH_DETERMINISM.md`
  - `reference/packets/PKT-01_OPS-26_PACKET_OPEN_SEMANTIC_PREFLIGHT_HARDENING.md`
  - `.harness/runtime/state/dev05-tooling.js`
  - `.harness/runtime/state/active-context.js`
  - `.harness/runtime/state/drift-validator.js`
- Authoritative source intake reference: repeated post-transition stale parity history plus the new 2026-05-15 residual freshness repro after `OPS-26` closeout
- Authoritative source disposition: defer `PLN-20` temporarily again, open this narrower residual freshness-convergence lane first, then return to `PLN-20`
- New planning source priority / disposition: this residual fix is temporarily higher priority than the pending `PLN-20` Ready For Code decision because immediate transition trust remains unstable
- Existing plan conflict: `PLN-20` was the pending next planning lane and is being explicitly deferred again, not completed
- Current implementation impact: planning only until separate `Ready For Code`
- Required rework / defer rationale: `PLN-20` implementation should not reopen while supported transition closeout still leaves a known false-fail stale window on immediate re-entry
- Impacted packet set scope: single-packet
- Authoritative source wave ledger reference: not-needed
- Source wave packet disposition: not-needed
- Existing program / DB dependency: none
- Authoritative source disposition detail:
  the repo should no longer describe `OPS-14` as fully resolved without noting the residual freshness-convergence defect now reproduced on 2026-05-15

## 11. Acceptance
- `OPS-27` opens as the active Planner lane after explicitly deferring `PLN-20` again, not completing it.
- The packet clearly isolates residual freshness convergence from `PLN-20` payload work and from `OPS-26` semantic preflight work.
- The packet records the new residual evidence and keeps implementation blocked pending separate approval.
- Validator and validation-report remain clean after the lane opens.

## 12. Open Questions
- Is the narrowest fix purely transition-time write ordering, or does `ACTIVE_CONTEXT` need stronger sourcing from the just-written validation report snapshot?
- Which supported transitions must be locked by regression in the first pass:
  - `developer -> tester`
  - `tester -> reviewer`
  - `reviewer -> planner`
  - `planner -> planner` closeout / defer paths
- Should the first pass cover only same-process immediate reads, or also the first immediately re-entered subsequent command?

## 13. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Temporary priority over PLN-20 | yes | user | approved | user directed Planner on 2026-05-15 to proceed with the stale-window fix lane rather than continue `PLN-20` immediately |
| Open this narrow residual-fix packet | yes | user/planner | approved | the stale-window reproduced again during `OPS-26` closeout on 2026-05-15 |
| Detailed agreement | yes | user/planner | approved | user approved the narrow residual freshness-convergence boundary on 2026-05-15 |
| Ready For Code sign-off | yes | user | approved | user approved the bounded residual freshness-convergence implementation scope on 2026-05-15 |
| Broader redesign boundary | yes | user/planner | approved | detailed agreement closes this lane as narrower than broad workflow or validator redesign |
| Packet exit quality gate approval | yes | reviewer | approved | reviewer closeout approved on 2026-05-15 after root/starter transition-regression, full tests, and validator evidence stayed clean |

## 14. Implementation Notes
- Implemented the smallest reusable convergence fix inside `writeValidationReport()`: after the settled validation-report write and `ACTIVE_CONTEXT` refresh, one additional validator/report/context pass now rewrites the final validation snapshot so the immediate first-read surfaces already agree.
- Added mirrored root / `standard-template` regression coverage for immediate post-transition parity by asserting that the transition's own validation report succeeds and that the first immediate `status` and `validate` reads also succeed without a manual rerun sequence.
- Preserve the current transition semantics and approval boundaries; `PLN-20` payload work, `OPS-26` semantic-preflight scope, and broader validator/workflow redesign remained out of scope.

## 14A. Current Planning Decision
- Detailed agreement: approved
- Ready For Code: approved
- Next planner action:
  close `OPS-27` after tester verification and reviewer approval, then return to deferred `PLN-20` planning only after recording that the residual freshness-convergence lane is complete

## Verification Plan
- Gate profile: contract
- Verification scenario reminder:
  - normal: the first immediate post-transition `validate`, `validation-report`, `status`, and `context` agree without manual reruns
  - error: a real blocking validator finding still surfaces normally and is not masked
  - regression: `PLN-20` remains deferred rather than silently completed or reopened for implementation

## Verification Manifest
- Gate profile:
  - contract: detailed agreement, Ready For Code, root sync, standard-template sync, targeted tests, root test suite, starter test suite, validator, validation-report, context, status, review closeout
- Required evidence:
  - cause analysis
  - residual repro trace from 2026-05-15
  - detailed agreement approval
  - Ready For Code approval
  - targeted regression for immediate post-transition freshness parity
  - root validator
  - root validation-report
  - root active context
  - root context
  - root status
  - review closeout

## 15. Packet Exit Quality Gate
- Packet exit metadata version: v1
- Packet exit metadata gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata exit recommendation: approve
- Packet exit metadata source parity result: aligned; root and `standard-template` runtime and regression surfaces stayed synchronized for the narrowed convergence fix
- Packet exit metadata validation / security / cleanup evidence: root targeted `node --test .harness/test/dev05-tooling.test.js` passed with 36/36 tests; `standard-template` targeted `node --test .harness/test/dev05-tooling.test.js` passed with 36/36 tests; root `npm.cmd test` passed with 86/86 tests; `standard-template` `npm.cmd test` passed with 77/77 tests; root `validation-report` passed; root `validate` passed; root `status` passed; `standard-template` `validate` passed
- Packet exit quality gate reference:
  `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation:
  approve
- Implementation delta summary:
  internalized the previously manual second-pass convergence step inside `writeValidationReport()` so transition-time validation-report generation now rewrites the final validation snapshot after the first settled write, then added mirrored root / `standard-template` regression coverage that asserts immediate post-transition `validation-report`, `status`, and `validate` parity
- Source parity result:
  aligned; root and `standard-template` reusable runtime and regression surfaces stayed synchronized
- Refactor / residual debt disposition:
  `PLN-20` remains deferred follow-up; any broader workflow or validator redesign stays separate unless a new residual mismatch reproduces after this narrower convergence fix
- UX conformance result:
  not-needed
- Topology / schema conformance result:
  not-needed
- Validation / security / cleanup evidence:
  root targeted `node --test .harness/test/dev05-tooling.test.js` passed with 36/36 tests; `standard-template` targeted `node --test .harness/test/dev05-tooling.test.js` passed with 36/36 tests; root `npm.cmd test` passed with 86/86 tests; `standard-template` `npm.cmd test` passed with 77/77 tests; root `validation-report` passed; root `validate` passed; root `status` passed; `standard-template` `validate` passed
- Deferred follow-up item:
  return to deferred `PLN-20`; keep packet-open semantic-preflight hardening and any broader workflow/validator redesign out of this closed residual lane unless explicitly reopened
- Improvement candidate reference:
  repeated 2026-05-15 post-transition stale-window repro during `OPS-26` closeout
- Proposed target layer:
  core
- Promotion status / linked follow-up item:
  promoted / `OPS-27_POST_TRANSITION_VALIDATION_ACTIVE_CONTEXT_FRESHNESS_CONVERGENCE`
- Closeout notes:
  reviewer found no blocking issue inside the approved scope; the implementation stayed within derived validation/context freshness convergence and the immediate first-read transition evidence remained clean in root and `standard-template`

## 16. Ready For Code Approval Text
Ready For Code must be separately approved with wording equivalent to:

```text
Ready For Code is approved for OPS-27 only for implementing the narrow residual freshness-convergence fix that makes the first immediate post-transition validate, validation-report, status, and Active Context reads agree without manual sequential reruns. PLN-20 payload work, OPS-26 semantic-preflight work, broad validator redesign, packet template rewrite, DB schema changes, and workflow-governance redesign are out of scope.
```

## Ready For Code Status
- approved on 2026-05-15 for the bounded residual freshness-convergence scope described above

## Ready For Code Approval Decision
- User approved Ready For Code for OPS-27 on 2026-05-15.
- Implementation is limited to the minimum reusable residual freshness-convergence fix needed so the first immediate post-transition `validate`, `validation-report`, `status`, and `ACTIVE_CONTEXT` reads agree without manual sequential reruns.
- The approved implementation may update transition-time derived refresh ordering, validation-summary write ordering, `ACTIVE_CONTEXT` sourcing, and the narrow supporting regression coverage required to enforce the same first-read parity boundary.
- `PLN-20` payload work, `OPS-26` semantic-preflight work, broad validator redesign, packet template rewrite, DB schema changes, workflow-governance redesign, and product-specific starter customization remain out of scope.

## 17. Reopen Trigger
- The lane expands into `PLN-20` payload implementation or `OPS-26` semantic-preflight redesign.
- The issue proves to require broader workflow or validator redesign.
- Immediate post-transition parity cannot be fixed without reopening packet-template or unrelated closeout redesign boundaries.
- Validator stops being clean after the lane opens.
