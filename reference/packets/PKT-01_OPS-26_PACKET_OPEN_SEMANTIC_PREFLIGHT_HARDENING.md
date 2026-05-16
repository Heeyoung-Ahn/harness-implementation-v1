# PKT-01 OPS-26 Packet-open semantic preflight hardening

## Purpose
- Harden the planner packet-opening path so helper preflight catches the same packet-evidence failures that the validator would otherwise discover only after transition apply.
- Prevent repeat cases where a concrete packet opens, mutates state, and then immediately falls into validation hold because packet evidence fields were incomplete even though helper preflight passed.
- Keep this lane narrower than `PLN-20` by focusing only on semantic preflight alignment, not maintainer/starter payload separation.

## Approval Rule
- This packet starts in Planner workflow.
- The user approved opening this narrow lane on 2026-05-15 before returning to `PLN-20`.
- This packet is planning-only until detailed agreement and `Ready For Code` are explicitly approved.
- This packet must not absorb `PLN-20` payload-boundary implementation, broader workflow-governance redesign, or transition-refresh determinism work.

## Detailed Agreement Proposal
- Primary planning direction:
  - extend planner packet-open preflight so it verifies actual validator-required packet evidence before any state mutation occurs
- Narrow planning scope:
  - keep using the existing planner-only packet-opening helper path from `OPS-19`
  - close the gap between helper preflight and validator-required evidence for user-facing, authoritative-source, and lane-type packet fields
  - make preflight failure stop before `artifact_index` registration, work-item upsert, or planner transition apply
  - leave transition-time freshness/parity reconciliation as separate residual work unless a truly blocking overlap is proven
- Non-scope:
  - no packet content generation
  - no DB schema change
  - no maintainer/starter payload separation implementation
  - no full validator redesign
  - no transition-refresh determinism redesign
  - no product-specific starter customization
- Approval boundary:
  - this proposal opens only the semantic-preflight hardening lane; implementation remains blocked until separate `Ready For Code` approval

## Detailed Agreement Approval Text
Detailed agreement is approved for OPS-26 with the following closed decisions:
- scope stays limited to planner packet-open semantic preflight hardening only
- the implementation path must keep using the existing planner-only helper lane from `OPS-19`
- helper preflight must catch validator-required packet-evidence failures for user-facing, authoritative-source, and lane-type packet fields before any mutation occurs
- a failing semantic preflight must stop before `artifact_index` registration, work-item upsert, or planner transition apply
- exact missing evidence should be reported clearly enough for one-pass packet repair, but packet text generation is not part of this lane
- OPS-26 must not absorb `PLN-20` payload work, broader validator redesign, transition-refresh determinism redesign, DB schema change, workflow-governance redesign, or product-specific starter customization
- implementation remains blocked until separate `Ready For Code` approval

## Detailed Agreement Approval Decision
- User approved the OPS-26 detailed agreement on 2026-05-15.
- This approval covers the narrow semantic-preflight hardening boundary, the requirement to fail before any planner-lane mutation when validator-required packet evidence is missing, and the decision to keep broader validator redesign out of scope.
- This approval does not authorize implementation.
- `Ready For Code` remains blocked until separately approved.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-26 Packet-open semantic preflight hardening | `PLN-20` packet opening still required post-apply repair even after `OPS-19` helper preflight passed | approved |
| Ready For Code | approved | user approved the narrow implementation boundary on 2026-05-15 | approved |
| Human sync needed | yes | this changes reusable planner packet-opening discipline and validation expectations | approved |
| Gate profile | contract | affects reusable planner helper, packet contract enforcement, and validation-facing metadata | approved |
| User-facing impact | medium | operators should be able to open a packet cleanly in one pass without hidden post-apply repair | approved |
| Layer classification | core | this changes reusable harness planning/runtime contract behavior | approved |
| Active profile dependencies | none | no optional profile is active | not-needed |
| Profile evidence status | not-needed | no profile-specific evidence is required | not-needed |
| UX archetype status | approved | existing operator evidence/context CLI archetype is sufficient for this planner-facing helper lane | approved |
| UX deviation status | not-needed | no product UI or UX deviation is proposed | not-needed |
| Environment topology status | not-needed | no deploy/cutover topology is involved | not-needed |
| Domain foundation status | not-needed | no data-impact or schema work is included | not-needed |
| Authoritative source intake status | approved | the user's 2026-05-15 direction plus the observed `PLN-20` open failure define the source set | approved |
| Shared-source wave status | not-needed | this is a single-packet process-hardening lane | not-needed |
| Packet exit gate status | approved | implementation, verification, review, and closeout evidence are complete | approved |
| Existing system dependency | none | no external product or legacy DB dependency is touched | not-needed |
| New authoritative source impact | analyzed | the new source is the user-approved reprioritization after observing the `PLN-20` open-path friction | approved |
| Risk if started now | medium | the lane must stay on semantic preflight alignment and avoid broad validator or workflow redesign | approved |

## Lane-Typed Minimum Contract
- Lane-type declaration:
  planning
- Lane-type universal minimum sections:
  Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger
- Lane-type required sections:
  Cause Analysis; Proposed Alternative; Human Sync / Approval Boundary; Verification Manifest; source trace to `OPS-19`, the `PLN-20` opening failure, and the current packet template / validator contract
- Lane-type conditional sections:
  runtime/test implementation details are conditional only after separate `Ready For Code` approval
- Lane-type not-needed sections:
  environment topology, domain foundation, existing DB compatibility, release packaging, and optional profile evidence are not needed unless scope changes

## 1. Goal
- Make concrete planner packet opening fail fast before mutation when packet evidence is still semantically incomplete.
- Eliminate the specific gap where helper preflight passes but validator immediately fails on missing required packet evidence.
- Preserve the existing packet-before-code and explicit approval model.

## 2. Non-Goal
- Do not reopen `PLN-20` payload-boundary implementation in this lane.
- Do not redesign transition refresh ordering or Active Context freshness here.
- Do not redesign packet templates broadly beyond what semantic-preflight alignment requires.
- Do not generate packet text automatically.
- Do not change DB schema.

## 3. User Problem And Expected Outcome
- Current problem:
  even after `OPS-19`, the planner packet-opening helper can still pass preflight and then fail only after transition apply because validator-required packet evidence was not fully mirrored in helper checks.
- Expected outcome:
  the next concrete packet can be opened with one clean pass, and helper preflight blocks the operation before mutation if validator-required evidence is missing.

## 4. In Scope
- planner packet-open semantic preflight gap analysis
- helper-vs-validator evidence contract alignment
- pre-mutation failure contract for missing packet evidence
- lane opening and verification expectations for later implementation

## 5. Out Of Scope
- `PLN-20` starter payload work
- transition freshness / parity redesign
- broad validator architecture redesign
- packet auto-generation
- DB schema changes
- product-specific starter customization

## 6. Cause Analysis
- The current helper preflight proves packet presence, core header rows, and verification-manifest markers, but it does not fully prove validator-required semantic evidence.
- The validator still performs additional packet-contract checks for fields like UX archetype and authoritative-source evidence after the helper has already mutated state.
- That mismatch means the helper is syntactically strict but semantically incomplete.
- The result is exactly the failure pattern `OPS-19` was meant to avoid: packet open appears successful until post-apply validation says otherwise.

## 7. Proposed Alternative
- Keep the existing planner-only helper path from `OPS-19`.
- Add semantic preflight checks that reuse or mirror the validator's required-evidence rules for the active packet before any mutation happens.
- If the packet would fail validator-required evidence, return a hold result without registering the artifact, without opening the work item, and without applying planner transition.
- Keep transition-refresh determinism out of scope for this lane unless later evidence shows the semantic-preflight fix alone is insufficient.

## 8. Program Function Detail
- Input:
  packet path, work item id, title, gate profile, and optional planning summary / next action
- Processing:
  planner-only semantic packet preflight before registration or transition apply
- Output:
  clean planner packet open or pre-mutation hold with exact missing evidence fields
- Edge case:
  if a packet is structurally valid but semantically incomplete for validator-required evidence, the helper must stop before any state mutation

## 9. UI/UX Detailed Design
- UX archetype reference: `.agents/rules/HARNESS_OPERATING_CONTRACT.md`
- Selected UX archetype: operator evidence/context CLI helper surface
- Impacted screen: no product UI
- Copy/text: planner/operator-facing packet-open hold or pass summary only
- Archetype deviation / approval: no deviation; this is helper/contract wording only

## 10. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  this lane changes reusable harness packet-opening behavior, not one downstream project.
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `.agents/artifacts/CURRENT_STATE.md`; `.agents/artifacts/TASK_LIST.md`; `.agents/artifacts/REQUIREMENTS.md`; `.agents/artifacts/IMPLEMENTATION_PLAN.md`; `.agents/artifacts/PREVENTIVE_MEMORY.md`; `reference/packets/PKT-01_OPS-19_PLANNER_PACKET_OPENING_FAST_PATH.md`; `reference/packets/PKT-01_PLN-20_MAINTAINER_STARTER_BOUNDARY_AND_PAYLOAD_SEPARATION.md`; `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`; `.harness/runtime/state/dev05-tooling.js`; `.harness/runtime/state/drift-validator.js`
- Environment topology reference: not-needed
- Domain foundation reference: not-needed
- Schema impact classification: none
- DB / state impact:
  planning-only now; later implementation may change helper preflight logic but no schema change is approved
- Markdown / docs impact:
  this packet and planning baseline updates only in this lane
- generated docs impact:
  normal planning state refresh only
- validator / cutover impact:
  later implementation may change preflight alignment only; broader validator redesign is out of scope
- Authoritative source refs:
  - `reference/packets/PKT-01_OPS-19_PLANNER_PACKET_OPENING_FAST_PATH.md`
  - `reference/packets/PKT-01_PLN-20_MAINTAINER_STARTER_BOUNDARY_AND_PAYLOAD_SEPARATION.md`
  - `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
  - `.harness/runtime/state/dev05-tooling.js`
  - `.harness/runtime/state/drift-validator.js`
- Authoritative source intake reference: the user-approved 2026-05-15 reprioritization plus the observed `PLN-20` post-apply packet-evidence failure
- Authoritative source disposition: defer `PLN-20` temporarily, open this narrow semantic-preflight hardening lane first, then return to `PLN-20`
- New planning source priority / disposition: this narrow hardening lane is temporarily higher priority than the pending `PLN-20` Ready For Code decision
- Existing plan conflict: `PLN-20` was active and is being explicitly deferred, not completed
- Current implementation impact: planning only until separate `Ready For Code`
- Required rework / defer rationale: `PLN-20` implementation should not open while packet-open reliability still requires post-apply packet-evidence repair
- Impacted packet set scope: single-packet
- Authoritative source wave ledger reference: not-needed
- Source wave packet disposition: not-needed
- Existing program / DB dependency: none

## 11. Acceptance
- `OPS-26` opens as the active Planner lane after `PLN-20` is explicitly deferred, not completed.
- The packet clearly isolates semantic-preflight hardening from `PLN-20` payload work and from transition-refresh determinism.
- The packet records the approved detailed-agreement boundary with explicit scope, non-scope, and implementation hold.
- Validator and validation-report remain clean after the lane opens.

## 12. Open Questions
- Should helper semantic preflight reuse validator logic directly, or mirror a smaller shared required-evidence contract?
- Should the helper report exact missing field labels only, or also the section/path where the fix belongs?

## 13. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Temporary priority over PLN-20 | yes | user | approved | user explicitly asked to hold `PLN-20` and open this narrow lane first |
| Detailed agreement | yes | user/planner | approved | user approved the narrow semantic-preflight hardening boundary on 2026-05-15 |
| Ready For Code sign-off | yes | user | approved | user approved the narrow semantic-preflight hardening implementation scope on 2026-05-15 |
| Broader validator redesign boundary | yes | user/planner | approved | detailed agreement closes this lane as narrower than full validator redesign |
| Packet exit quality gate approval | yes | reviewer | approved | reviewer closeout approved on 2026-05-15 after root/starter regression, full tests, and validator evidence stayed clean |

## 14. Implementation Notes
- Implemented the smallest reusable fix: planner packet-open preflight now reuses validator-backed task-packet semantic inspection before any mutation.
- The implementation stayed inside planner-helper, validator, and mirrored root/starter regression surfaces only.
- `PLN-20` payload work and `OPS-14`-class freshness work remained out of scope.

## Verification Plan
- Gate profile: contract
- Verification scenario reminder:
  - normal: the lane opens cleanly and clearly precedes `PLN-20`
  - error: `PLN-20` is accidentally treated as completed rather than deferred
  - regression: validator stays clean and no implementation lane opens implicitly

## Verification Manifest
- Gate profile:
  - contract: detailed agreement, Ready For Code, root sync if reusable tooling changes, standard-template sync if reusable tooling changes, targeted packet-open semantic-preflight check, validator, active context evidence, review closeout
- Required evidence:
  - cause analysis
  - detailed agreement approval
  - Ready For Code approval
  - targeted packet-open semantic-preflight check
  - root validator
  - active context evidence
  - validation report
  - review closeout

## 15. Packet Exit Quality Gate
- Packet exit metadata version: v1
- Packet exit metadata gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata exit recommendation: approve
- Packet exit metadata source parity result: aligned; root and `standard-template` helper, validator, and regression surfaces stayed synchronized
- Packet exit metadata validation / security / cleanup evidence: root targeted `node --test .harness/test/dev05-tooling.test.js` passed; `standard-template` targeted `node --test .harness/test/dev05-tooling.test.js` passed; root `npm.cmd test` passed with 86/86 tests; `standard-template` `npm.cmd test` passed with 77/77 tests; root `validation-report` passed; root final `validate` passed after the expected one-time stale parity rerun; `standard-template` `validate` passed
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: approve
- Implementation delta summary: exported validator-backed task-packet semantic inspection and reused it inside planner packet-open preflight so semantic evidence gaps fail before artifact registration, work-item upsert, or transition apply; added mirrored root/starter regression coverage for user-facing, authoritative-source, and lane-type evidence gaps
- Source parity result: aligned; root and `standard-template` helper, validator, and regression surfaces stayed synchronized
- Refactor / residual debt disposition: `PLN-20` remains deferred follow-up; transition-refresh determinism remains separate residual work unless future evidence reopens it
- UX conformance result: not-needed
- Topology / schema conformance result: not-needed
- Validation / security / cleanup evidence: root targeted `node --test .harness/test/dev05-tooling.test.js` passed; `standard-template` targeted `node --test .harness/test/dev05-tooling.test.js` passed; root `npm.cmd test` passed with 86/86 tests; `standard-template` `npm.cmd test` passed with 77/77 tests; root `validation-report` passed; root final `validate` passed after the expected one-time stale parity rerun; `standard-template` `validate` passed
- Deferred follow-up item: return to `PLN-20`; keep broader transition-refresh determinism and later `PREVENTIVE_MEMORY` contract work separate unless explicitly reopened
- Improvement candidate reference: repeated packet-open helper pass followed by validator-required packet-evidence hold
- Proposed target layer: core
- Promotion status / linked follow-up item: promoted / `OPS-26_PACKET_OPEN_SEMANTIC_PREFLIGHT_HARDENING`
- Closeout notes: reviewer found no blocking issue inside the approved scope; helper semantic preflight now blocks the previously observed post-apply evidence-gap failure mode before mutation, and reusable root/starter parity remained clean

## 16. Ready For Code Approval Text
Ready For Code must be separately approved with wording equivalent to:

```text
Ready For Code is approved for OPS-26 only for implementing the narrow semantic-preflight hardening that makes planner packet opening fail before mutation when validator-required packet evidence is missing. PLN-20 payload work, broader validator redesign, transition-refresh determinism redesign, packet text generation, DB schema changes, and workflow-governance redesign are out of scope.
```

## Ready For Code Approval Decision
- User approved Ready For Code for OPS-26 on 2026-05-15.
- Implementation is limited to the minimum reusable semantic-preflight hardening needed so planner packet opening fails before mutation when validator-required packet evidence is missing.
- The approved implementation may update planner helper preflight checks and the narrow supporting validator-contract alignment required to enforce the same packet-evidence boundary before mutation.
- `PLN-20` payload work, broader validator redesign, transition-refresh determinism redesign, packet text generation, DB schema changes, workflow-governance redesign, and product-specific starter customization remain out of scope.

Ready For Code status:
- approved on 2026-05-15 for the bounded semantic-preflight hardening scope described above

## 17. Reopen Trigger
- The lane expands into `PLN-20` payload implementation or broader validator redesign.
- The lane requires transition-refresh determinism redesign to make progress.
- The lane cannot stay pre-mutation only.
- Validator stops being clean after the lane opens.
