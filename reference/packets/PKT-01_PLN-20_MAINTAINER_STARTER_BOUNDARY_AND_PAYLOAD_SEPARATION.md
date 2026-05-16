# PKT-01 PLN-20 Maintainer / starter boundary and payload separation

## Purpose
- Define the reusable planning boundary that separates installable starter payload concerns from maintainer-repo-only release, sync, and audit logic.
- Convert the 2026-05-15 evaluation follow-up and the closed `OPS-25` defer note into a concrete planning packet before any runtime, validator, payload, or release-path implementation opens.
- Keep explicit `PREVENTIVE_MEMORY` trigger formalization and Lite / Standard onboarding UX cleanup deferred until this boundary-setting lane is settled.

## Approval Rule
- This packet starts in Planner workflow.
- The user approved the next-lane priority on 2026-05-15: maintainer / starter separation first.
- The user also approved the first implementation-slice priority on 2026-05-15: handle starter-shipped `ACTIVE_CONTEXT.*` payload behavior before broader release-baseline, validator, or documentation cleanup slices.
- This packet closes the planning boundary first, and after separate `Ready For Code` approval it authorizes slice 1 implementation only.

## Detailed Agreement Proposal
- Primary planning direction:
  - separate shipped-starter runtime surfaces from maintainer-only release/sync logic without weakening the reusable truth contract, generated-state immutability, validator authority, or root / `standard-template` sync discipline
- Approved planning scope:
  - decide which mixed files stay in shipped starter payload
  - decide which maintainer-aware runtime checks remain shared behind repo-shape detection
  - decide which files should become maintainer-only references or documentation-only follow-ups
  - sequence the work so starter-shipped `ACTIVE_CONTEXT.*` payload handling is the first implementation slice
- Approved first-slice order:
  1. starter-shipped `ACTIVE_CONTEXT.*` payload handling
  2. `release-baseline.js`, `dev05-tooling.js`, and `drift-validator.js` maintainer/starter boundary conditionalization
  3. maintainer-facing documentation and reusable test-boundary cleanup
- Non-scope:
  - no slice 2 or slice 3 implementation yet
  - no DB schema change
  - no full onboarding rewrite yet
  - no explicit `PREVENTIVE_MEMORY` promotion/trigger contract rewrite yet
  - no broad workflow-governance redesign
  - no product-specific starter customization
- Approval boundary:
  - this packet approves the planning boundary and slice order, and after separate `Ready For Code` approval it authorizes slice 1 payload implementation only

## Detailed Agreement Approval Text
Detailed agreement is approved for `PLN-20` with the following closed decisions:
- the lane is planning-only and exists to define maintainer / starter runtime and payload boundaries before code changes open
- the first implementation slice will address starter-shipped `ACTIVE_CONTEXT.*` payload handling first
- slice 1 payload policy excludes generated starter-shipped `ACTIVE_CONTEXT.json` and `ACTIVE_CONTEXT.md` from the installable payload; copied starters must regenerate them through the approved bootstrap/context path
- release/runtime conditionalization for `release-baseline.js`, `dev05-tooling.js`, and `drift-validator.js` is a later slice, not part of the first payload slice
- maintainer-facing document/test cleanup is a later slice after runtime boundary decisions are settled
- explicit `PREVENTIVE_MEMORY` trigger formalization and Lite / Standard onboarding UX cleanup remain deferred follow-up lanes
- implementation remains blocked until separate `Ready For Code` approval, and once approved only slice 1 may execute

## Detailed Agreement Approval Decision
- User-approved on 2026-05-15 through the next-work decision set recorded after `OPS-25` closeout.
- User additionally approved slice 1 option A on 2026-05-16: exclude generated `ACTIVE_CONTEXT.*` from starter payload rather than shipping a neutral placeholder.
- This approval covers the lane priority, planning boundary, and first-slice ordering.
- This approval also closes the slice 1 shipped-state question.
- This approval does not by itself authorize implementation.
- `Ready For Code` remains a separate approval step.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | PLN-20 Maintainer / starter boundary and payload separation | the next approved lane is to separate shipped starter payload concerns from maintainer-only release/sync logic | approved |
| Ready For Code | approved | slice 1 payload implementation is approved; later boundary slices remain blocked | approved |
| Human sync needed | yes | this lane changes the reusable starter/maintainer boundary contract | approved |
| Gate profile | contract | affects reusable payload, runtime, validator, and release-boundary behavior | approved |
| User-facing impact | high | downstream operators must not inherit maintainer-only assumptions in starter payload | approved |
| Layer classification | core | this changes the reusable harness starter contract, not one downstream product | approved |
| Active profile dependencies | none | no optional profile is active for this planning lane | not-needed |
| Profile evidence status | not-needed | no profile-specific evidence is required | not-needed |
| UX archetype status | approved | existing human-facing operator/planning writing rules are sufficient for this packet | approved |
| UX deviation status | not-needed | no product UI or UX deviation is involved | not-needed |
| Environment topology status | not-needed | no deploy/cutover topology change is included | not-needed |
| Domain foundation status | not-needed | no data-impact or schema work is included | not-needed |
| Authoritative source intake status | approved | the 2026-05-15 evaluation follow-up, `OPS-25` defer note, and user priority decision define the source set | approved |
| Shared-source wave status | not-needed | this is a single planning packet | not-needed |
| Packet exit gate status | pending | the lane is opening and closeout is not complete | pending |
| Existing system dependency | none | no external product or legacy DB dependency is touched | not-needed |
| New authoritative source impact | analyzed | the evaluation identified payload/runtime/document mixing that requires a dedicated planning lane | approved |
| Risk if started now | medium | over-broad cleanup could blur starter payload work with maintainer-only release maintenance unless slice boundaries stay strict | approved |

## Lane-Typed Minimum Contract
- Lane-type declaration:
  planning
- Lane-type universal minimum sections:
  Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger
- Lane-type required sections:
  Detailed Agreement Proposal; Detailed Agreement Approval Decision; Human Sync / Approval Boundary; Work Decomposition; Verification Manifest; source trace to the 2026-05-15 evaluation follow-up, `OPS-25`, and the mixed maintainer/starter runtime surfaces
- Lane-type conditional sections:
  runtime/test/validator implementation details are conditional only after separate `Ready For Code` approval
- Lane-type not-needed sections:
  domain foundation, environment topology, existing DB compatibility, release packaging execution detail, and optional profile evidence are not needed unless scope changes

## 1. Goal
- Define the durable boundary between the reusable maintainer repository and the installable starter payload.
- Eliminate ambiguous starter-shipped surfaces that look like maintainer history or maintainer-only runtime assumptions.
- Sequence the follow-up so the first implementation slice handles starter-shipped `ACTIVE_CONTEXT.*` payload behavior before broader runtime conditionalization.

## 2. Non-Goal
- Do not implement runtime or payload changes yet.
- Do not rewrite the explicit `PREVENTIVE_MEMORY` contract in this lane.
- Do not redesign Lite / Standard onboarding UX in this lane.
- Do not redesign workflow-entry or approval governance.
- Do not add project-specific starter content.
- Do not change DB schema.

## 3. User Problem And Expected Outcome
- Current problem:
  the current reusable baseline still contains mixed starter/maintainer surfaces, including starter-shipped `ACTIVE_CONTEXT.*`, release/runtime files that assume maintainer-repo layout, and maintainer-facing documentation/test references that are too visible to downstream starter operators.
- Expected outcome:
  a bounded planning contract that decides what stays shared, what becomes conditional, what becomes maintainer-only, and what implementation slice starts first.

## 4. In Scope
- starter-shipped `ACTIVE_CONTEXT.*` payload handling policy
- maintainer-vs-starter boundary for `release-baseline.js`
- maintainer-vs-starter boundary for `dev05-tooling.js`
- maintainer-vs-starter boundary for `drift-validator.js`
- maintainer-facing document/test/reference boundary classification
- work decomposition and slice order for later implementation packets

## 5. Out Of Scope
- implementation of the first slice
- explicit `PREVENTIVE_MEMORY` trigger/promotion criteria rewrite
- Lite / Standard / Full-governance onboarding UX rewrite
- broad release packaging redesign
- workflow-governance redesign
- product-specific starter customization
- DB schema changes

## 6. Work Decomposition
| Slice | Scope | Planning decision | Follow-up direction |
|---|---|---|---|
| Slice 1 | starter-shipped `ACTIVE_CONTEXT.*` payload handling | exclude generated `ACTIVE_CONTEXT.*` from the shipped starter payload and require regeneration after starter bootstrap/context entry | first implementation slice after `Ready For Code` |
| Slice 2 | `release-baseline.js`, `dev05-tooling.js`, `drift-validator.js` boundary conditionalization | decide which checks stay shared behind repo-shape detection and which are maintainer-only | second implementation slice |
| Slice 3 | maintainer-facing docs and reusable test boundary cleanup | decide which references remain root-only, which stay shared, and which move behind maintainer-only guidance | later doc/test slice |
| Deferred lane A | explicit `PREVENTIVE_MEMORY` trigger formalization | convert repeated-friction capture into explicit trigger/promotion rules | later planning lane |
| Deferred lane B | Lite / Standard onboarding UX cleanup | simplify entry-point choice and profile path for smaller projects | later planning lane |

## 7. First-Slice Decision
- Approved first implementation slice:
  starter-shipped `ACTIVE_CONTEXT.*` payload handling.
- Reason:
  - it is the most visible downstream payload ambiguity
  - it directly affects first-read re-entry trust
  - it is narrower than broader runtime conditionalization
- Approved shipped-state policy:
  generated `.agents/runtime/ACTIVE_CONTEXT.json` and `.agents/runtime/ACTIVE_CONTEXT.md` do not ship in the installable starter payload.
- Required regeneration contract:
  copied starters must regenerate `ACTIVE_CONTEXT.*` through the approved starter bootstrap and context-generation path before treating those files as valid re-entry surfaces.
- First-slice boundary:
  - remove generated `.agents/runtime/ACTIVE_CONTEXT.json` from the shipped starter payload
  - remove generated `.agents/runtime/ACTIVE_CONTEXT.md` from the shipped starter payload
  - define the post-init / post-context regeneration contract for copied starters
  - do not fold `release-baseline.js`, `dev05-tooling.js`, or `drift-validator.js` changes into the same first slice unless later planning explicitly reopens that boundary

## 8. UI/UX Detailed Design
- UX archetype reference: `.agents/rules/HARNESS_OPERATING_CONTRACT.md`
- Selected UX archetype: human-facing operator/planning writing rule for reusable starter-governance artifacts
- Impacted screen: none
- Copy/text: direct starter/operator-facing planning and boundary wording only
- Archetype deviation / approval: no deviation; no product UI is involved

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  this lane defines a reusable maintainer/starter contract shared by the standard harness baseline.
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `.agents/artifacts/CURRENT_STATE.md`; `.agents/artifacts/TASK_LIST.md`; `.agents/artifacts/REQUIREMENTS.md`; `.agents/artifacts/ARCHITECTURE_GUIDE.md`; `.agents/artifacts/IMPLEMENTATION_PLAN.md`; `.agents/artifacts/PREVENTIVE_MEMORY.md`; `reference/planning/PLN-20_MAINTAINER_STARTER_BOUNDARY_AND_PAYLOAD_SEPARATION_DRAFT.md`; `reference/packets/PKT-01_OPS-25_HARNESS_MANUAL_RECENT_WORK_RECONCILIATION.md`; `.harness/runtime/state/release-baseline.js`; `.harness/runtime/state/dev05-tooling.js`; `.harness/runtime/state/drift-validator.js`; `.agents/runtime/ACTIVE_CONTEXT.json`; `standard-template/.agents/runtime/ACTIVE_CONTEXT.json`; `reference/artifacts/REPOSITORY_LAYOUT_OWNERSHIP.md`; `README.md`; `standard-template/README.md`
- Environment topology reference: not-needed
- Domain foundation reference: not-needed
- Schema impact classification: none
- DB / state impact:
  planning-only state updates and later packet decomposition only; no schema change is approved.
- Markdown / docs impact:
  this packet and planning baseline updates only in this lane.
- Generated docs impact:
  normal planning state refresh only.
- Validator / cutover impact:
  validator must remain clean while the lane opens; later implementation may change boundary detection but not in this packet.
- Authoritative source refs:
  - `reference/planning/PLN-20_MAINTAINER_STARTER_BOUNDARY_AND_PAYLOAD_SEPARATION_DRAFT.md`
  - `reference/packets/PKT-01_OPS-25_HARNESS_MANUAL_RECENT_WORK_RECONCILIATION.md`
  - `.harness/runtime/state/release-baseline.js`
  - `.harness/runtime/state/dev05-tooling.js`
  - `.harness/runtime/state/drift-validator.js`
  - `.agents/runtime/ACTIVE_CONTEXT.json`
  - `standard-template/.agents/runtime/ACTIVE_CONTEXT.json`
  - `reference/artifacts/REPOSITORY_LAYOUT_OWNERSHIP.md`
- Authoritative source intake reference: the 2026-05-15 evaluation follow-up and the user-approved next-lane priority recorded after `OPS-25` closeout
- Authoritative source wave ledger reference: not-needed
- Source wave packet disposition: not-needed
- Authoritative source disposition: open the dedicated maintainer/starter separation planning lane now and keep later `PREVENTIVE_MEMORY` and onboarding UX follow-up lanes deferred
- Existing plan conflict: `PLN-17` remains deferred and must not be treated as completed
- Current implementation impact: slice 1 payload exclusion and regeneration-contract work is implemented; later slices remain deferred follow-up work
- Impacted packet set scope: single planning packet with later implementation follow-ups
- Existing program / DB dependency:
  none

## 10. Acceptance
- `PLN-20` opens as the active Planner lane after `OPS-25` closeout.
- Slice 1 implementation is explicitly restricted to starter-shipped `ACTIVE_CONTEXT.*` payload handling.
- The first implementation slice is explicitly fixed to starter-shipped `ACTIVE_CONTEXT.*` payload handling.
- The shipped starter payload omits generated `ACTIVE_CONTEXT.*`, and copied starters regenerate those files through `harness:init` or `harness:context`.
- Broader runtime conditionalization and maintainer doc/test cleanup remain separate later slices.
- `PREVENTIVE_MEMORY` trigger formalization and Lite / Standard onboarding UX cleanup remain deferred and are not silently folded into this lane.
- Validator and validation-report remain clean through implementation, review, and closeout.

## 11. Open Questions
- Closed on 2026-05-16:
  - slice 1 uses option A: no generated `ACTIVE_CONTEXT.*` in the shipped starter payload
  - copied starters must regenerate `ACTIVE_CONTEXT.*` before those files are trusted as re-entry input
- For slice 2, should maintainer-only checks be split by explicit repo-shape detection or by separate maintainer-only helper surfaces?

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Lane priority over deferred follow-ups | yes | user | approved | maintainer / starter separation runs before `PREVENTIVE_MEMORY` trigger formalization and onboarding UX cleanup |
| Detailed agreement | yes | user/planner | approved | this packet closes the planning boundary and slice order |
| First implementation slice priority | yes | user/planner | approved | starter-shipped `ACTIVE_CONTEXT.*` payload handling goes first |
| Slice 1 payload policy | yes | user | approved | user approved option A on 2026-05-16: exclude generated `ACTIVE_CONTEXT.*` from shipped starter payload and require regeneration |
| Ready For Code sign-off | yes | user | approved | user approved implementation for slice 1 only on 2026-05-16 after closing the option A payload policy |
| Runtime conditionalization scope | yes | user/planner | pending | later implementation packet must confirm how broad slice 2 should be |
| Packet exit quality gate approval | yes | reviewer | approved | reviewer approved slice 1 closeout on 2026-05-16 after scope, parity, and validation evidence review |

## 13. Implementation Notes
- Slice 1 implementation is complete and stays inside the approved payload-only boundary.
- Keep slice 1 narrow and starter-facing.
- Slice 1 boundary is now closed: shipped starter payload excludes generated `ACTIVE_CONTEXT.*` and relies on explicit regeneration.
- Preserve later-slice follow-up as new lanes instead of silently extending this closeout.
- Do not reopen `PLN-17` inside this lane.
- Do not let later slice names imply implementation approval before a new packet is opened.

## 14. Verification Plan
- Gate profile: contract
- Verification scenario reminder:
  - normal: slice 1 removes starter-shipped generated `ACTIVE_CONTEXT.*`, copied starters regenerate them after `harness:init` or `harness:context`, and root/starter validation stays clean
  - error: slice 1 accidentally folds in `release-baseline.js`, `dev05-tooling.js`, `drift-validator.js`, `PLN-17`, `PREVENTIVE_MEMORY`, or onboarding UX scope
  - regression: validator stays clean, bootstrap flows omit generated `ACTIVE_CONTEXT.*`, and copied-starter init continues to seed current-project Active Context successfully

## Verification Manifest
- Gate profile:
  - contract: detailed agreement, Ready For Code, root sync if reusable planning assets change, standard-template sync if reusable planning assets change, targeted planner-lane opening check, validator, active context evidence, review closeout
- Required evidence:
  - detailed agreement approval
  - Ready For Code approval
  - targeted planner-lane opening check
  - root validator
  - active context evidence
  - validation report
  - review closeout

## 15. Packet Exit Quality Gate
- Packet exit metadata version: v1
- Packet exit metadata gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata exit recommendation: approved
- Packet exit metadata source parity result: pass
- Packet exit metadata validation / security / cleanup evidence: pass
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: approved
- Implementation delta summary: slice 1 now excludes generated `.agents/runtime/ACTIVE_CONTEXT.json` and `.md` from shipped starter payload, keeps copied-starter regeneration on `harness:init` / `harness:context`, updates payload-facing docs, and aligns payload/bootstrap/init regression coverage with the new contract
- Source parity result: pass
- Refactor / residual debt disposition: implementation remains split into later slices; `PREVENTIVE_MEMORY` trigger formalization and onboarding UX cleanup remain separate deferred lanes
- UX conformance result: not-needed
- Topology / schema conformance result: not-needed
- Validation / security / cleanup evidence: targeted root payload/bootstrap/init regression passed; targeted standard-template init regression passed; root full harness suite passed `87/87`; standard-template full harness suite passed `78/78`; root and standard-template validator passed; root validation-report passed; reviewer confirmed closeout scope remained slice-1 only
- Deferred follow-up item: explicit `PREVENTIVE_MEMORY` trigger formalization lane; Lite / Standard onboarding UX cleanup lane; deferred `PLN-17` multi-model ownership lane
- Improvement candidate reference: 2026-05-15 evaluation follow-up on mixed maintainer/starter runtime and payload surfaces
- Proposed target layer: core
- Promotion status / linked follow-up item: approved / `PLN-20_MAINTAINER_STARTER_BOUNDARY_AND_PAYLOAD_SEPARATION`
- Closeout notes: developer, tester, reviewer, and planner closeout completed on 2026-05-16 for slice 1 only. Later maintainer/starter boundary slices remain deferred follow-up work and must reopen as new approved lanes before implementation.

## 15A. Deferred Priority Note
- Deferred on 2026-05-15 by explicit user priority decision.
- Reason:
  `OPS-26_PACKET_OPEN_SEMANTIC_PREFLIGHT_HARDENING` must run first because `PLN-20` packet opening still needed post-apply packet-evidence repair even after helper preflight passed.
- This is not functional completion of the maintainer / starter boundary lane.
- Reopen trigger:
  after `OPS-26` closes, Planner should return to `PLN-20` and resume the pending `Ready For Code` decision for the first starter-shipped `ACTIVE_CONTEXT.*` payload-handling slice.

## 16. Ready For Code Approval Text
Ready For Code must be separately approved with wording equivalent to:

```text
Ready For Code is approved for PLN-20 only for the first implementation slice that settles starter-shipped ACTIVE_CONTEXT payload behavior inside the approved maintainer/starter separation boundary. Broader release-baseline or validator conditionalization, maintainer-facing document/test cleanup, explicit PREVENTIVE_MEMORY trigger formalization, onboarding UX rewrite, workflow-governance redesign, DB schema changes, and product-specific starter customization are out of scope.
```

Ready For Code status:
- approved on 2026-05-16 for slice 1 only: exclude starter-shipped generated `ACTIVE_CONTEXT.*` from payload and require regeneration after starter bootstrap/context entry

## Ready For Code Approval Decision
- User approved Ready For Code for `PLN-20` slice 1 on 2026-05-16.
- Implementation is limited to the first slice only:
  - exclude generated `.agents/runtime/ACTIVE_CONTEXT.json` from shipped starter payload
  - exclude generated `.agents/runtime/ACTIVE_CONTEXT.md` from shipped starter payload
  - preserve the explicit regeneration contract through starter bootstrap / `harness:init` / `harness:context`
- `release-baseline.js`, `dev05-tooling.js`, `drift-validator.js`, maintainer-facing document/test cleanup, explicit `PREVENTIVE_MEMORY` trigger formalization, onboarding UX rewrite, workflow-governance redesign, DB schema changes, and product-specific starter customization remain out of scope.

## 17. Reopen Trigger
- The lane expands into implementation without separate `Ready For Code`.
- Slice 1 is broadened to include `release-baseline.js`, `dev05-tooling.js`, or `drift-validator.js` without a new approval decision.
- `PLN-17`, `PREVENTIVE_MEMORY`, or onboarding UX work is silently merged into this lane.
- Validator stops being clean after the lane opens.
