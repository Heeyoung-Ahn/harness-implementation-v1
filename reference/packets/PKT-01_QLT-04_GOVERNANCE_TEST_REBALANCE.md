# PKT-01 QLT-04 Governance test rebalance

## Purpose
- Rebalance governance-focused tests after `OPS-18` and `OPS-20` made workflow-entry and starter-bootstrap contracts concrete.
- Keep governance regressions easier to isolate by moving the reusable checks into more focused test surfaces.
- Keep this follow-up narrow: governance-test and validator/read-model coverage alignment only, not broader workflow or ownership redesign.

## Approval Rule
- This packet starts in Planner workflow.
- This packet does not approve implementation until detailed agreement and `Ready For Code` are explicitly approved.
- This packet may change reusable harness tests and minimal validator/read-model checks only inside the approved governance-test rebalance boundary.
- It must not reopen `OPS-17` manual wording, `OPS-18` runtime route rules, `OPS-20` starter bootstrap alignment, or `PLN-17` multi-model ownership scope.

## Detailed Agreement Proposal
- Primary implementation direction:
  - split the reusable governance checks into focused test surfaces that directly cover the current route-enforcement, ambiguity-stop, Planner-fallback, compact baton, and starter-bootstrap alignment contracts
- Narrow verification scope:
  - add or refine focused tests for `OPS-18` workflow-entry enforcement
  - add or refine focused tests for `OPS-20` starter bootstrap / `ARCHITECTURE_GUIDE` alignment
  - keep root and `standard-template` reusable test surfaces synchronized
  - allow the smallest validator/read-model assertion updates only when needed to keep the new focused tests authoritative and non-duplicative
- Non-scope:
  - no new workflow-entry runtime behavior
  - no new starter bootstrap behavior
  - no `ARCHITECTURE_GUIDE.md` authority rewrite
  - no multi-model ownership contract
  - no DB schema change
  - no product-specific starter customization
- Approval boundary:
  - this proposal closes only the governance-test rebalance direction; implementation remains blocked until separate `Ready For Code` approval

## Detailed Agreement Approval Text
Detailed agreement is approved for QLT-04 with the following closed decisions:
- `OPS-18` governance checks may move into one focused reusable test file when that reduces duplication and keeps regression intent clearer
- `OPS-20` bootstrap alignment checks stay with `init-project.test.js` unless duplication becomes unavoidable
- validator/read-model changes are allowed only as minimal test-support updates
- runtime authority, workflow behavior, approval meaning, broader validator redesign, and multi-model ownership scope remain out of scope
- implementation remains blocked until separate `Ready For Code` approval

## Detailed Agreement Approval Decision
- User approved the QLT-04 detailed agreement on 2026-05-14.
- This approval covers the narrow governance-test rebalance boundary, the single focused reusable test-file allowance for `OPS-18` checks, the instruction to keep `OPS-20` checks with `init-project.test.js`, and the rule that validator/read-model changes must stay minimal and test-support only.
- This approval does not authorize implementation.
- `Ready For Code` remains blocked until separately approved.

## Ready For Code Approval Decision
- User approved Ready For Code for QLT-04 on 2026-05-14.
- Implementation is limited to the minimum reusable governance-test rebalance needed to protect the approved `OPS-18` workflow-entry contract and `OPS-20` starter-bootstrap alignment contract.
- Approved implementation scope is limited to:
  - moving `OPS-18` governance checks into one focused reusable test file if that improves isolation
  - keeping `OPS-20` bootstrap-alignment checks with `init-project.test.js`
  - making only the smallest validator/read-model assertion updates needed to support the focused tests
  - keeping root and `standard-template` reusable test surfaces synchronized
- Implementation must stop and return to Planner if it would change runtime workflow-entry behavior, starter bootstrap behavior, `ARCHITECTURE_GUIDE.md` authority, broader validator policy, `PLN-17` ownership scope, DB schema, or product-specific test behavior.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | QLT-04 Governance test rebalance | `OPS-18` and `OPS-20` are closed, and their reusable governance contracts now need focused regression protection | approved |
| Ready For Code | approved | bounded governance-test rebalance scope is explicitly approved; runtime redesign and ownership work remain blocked | approved |
| Human sync needed | yes | this lane changes reusable harness test/validator evidence expectations | approved |
| Gate profile | contract | affects reusable validator/read-model/test behavior and closeout confidence | approved |
| User-facing impact | low | no product UI changes; impact is on reusable governance confidence and maintenance clarity | approved |
| Layer classification | core | applies to reusable harness test and validator surfaces | approved |
| Active profile dependencies | none | no optional profile is active | not-needed |
| Profile evidence status | not-needed | no profile-specific evidence required | not-needed |
| UX archetype status | approved | existing reusable operator/evidence testing archetype is sufficient for this reusable governance-test surface | approved |
| UX deviation status | not-needed | no UX deviation is proposed | not-needed |
| Environment topology status | not-needed | no deploy/cutover topology is changed | not-needed |
| Domain foundation status | not-needed | no data-domain work is included | not-needed |
| Authoritative source intake status | approved | `PLN-15`, `PLN-18`, `OPS-18`, and `OPS-20` define the concrete reusable contracts this lane must protect | approved |
| Shared-source wave status | not-needed | single-packet governance-test rebalance lane | not-needed |
| Packet exit gate status | pending | implementation, verification, and review are not complete | pending |
| Existing system dependency | none | no legacy external system or DB integration is touched | not-needed |
| New authoritative source impact | analyzed | the route-enforcement and starter-bootstrap contracts are now settled and need targeted regression protection | analyzed |
| Risk if started now | medium | over-broad changes could drift into workflow redesign or ownership-contract scope instead of staying in focused governance-test rebalance | approved |

## Lane-Typed Minimum Contract
- Lane-type declaration:
  planning
- Lane-type universal minimum sections:
  Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger
- Lane-type required sections:
  Detailed Agreement Proposal; Human Sync / Approval Boundary; Verification Manifest; source trace to `PLN-15`, `PLN-18`, `OPS-18`, and `OPS-20`
- Lane-type conditional sections:
  Runtime/read-model assertions are required only when the test rebalance needs minor validator/read-model expectation updates to preserve the approved governance contracts.
- Lane-type not-needed sections:
  UX archetype, domain foundation, environment topology, existing DB compatibility, release packaging, and optional profile evidence are not needed unless scope changes.

## 1. Goal
- Protect the approved workflow-entry and starter-bootstrap governance contracts with focused reusable tests.
- Reduce future governance regressions that would otherwise hide inside large mixed test files.
- Preserve root / `standard-template` parity for reusable governance-test behavior.

## 2. Non-Goal
- Do not change runtime route enforcement or approval rules already closed in `OPS-18`.
- Do not change starter bootstrap behavior already closed in `OPS-20`.
- Do not define multi-model ownership or conflict rules; that remains `PLN-17`.
- Do not widen into general test-suite redesign or unrelated validator cleanup.

## 3. User Problem And Expected Outcome
- Current problem:
  reusable governance behavior is stronger after `OPS-18` and `OPS-20`, but the regression surface is still harder to isolate than it should be.
- Expected outcome:
  focused governance tests make route-enforcement, ambiguity-stop, Planner-fallback, compact baton, and starter-bootstrap alignment regressions easier to detect and maintain without reopening broader design scope.

## 4. In Scope
- Focused test coverage for `OPS-18` workflow-entry enforcement.
- Focused test coverage for `OPS-20` starter bootstrap / architecture-guide alignment.
- Minimal validator/read-model assertion updates only when required to keep those focused tests coherent and authoritative.
- Root and `standard-template` synchronization for reusable tests and any minimal supporting runtime/read-model expectations.

## 5. Out Of Scope
- Workflow-entry runtime redesign.
- Starter bootstrap redesign.
- `ARCHITECTURE_GUIDE.md` contract changes.
- Multi-model ownership and conflict rules.
- Manual wording changes.
- Product-specific tests or application behavior.

## 6. Detailed Behavior
- Trigger:
  reusable workflow-entry or starter-bootstrap contract changes need focused governance regression protection.
- Main flow:
  1. identify the reusable governance behaviors already approved in `OPS-18` and `OPS-20`
  2. isolate those behaviors into focused tests with clear positive/negative expectations
  3. keep root and `standard-template` reusable test surfaces synchronized
  4. confirm validator and validation-report evidence remain clean after the rebalance
- Error state:
  if coverage changes require new governance behavior, stop and return to Planner instead of silently expanding scope

## 7. Program Function Detail
- Input:
  current reusable runtime/test/validator behavior for `OPS-18` and `OPS-20`
- Processing:
  focused governance-test rebalance with the minimum supporting assertion updates
- Output:
  clearer reusable regression coverage for settled governance contracts, without changing their approved authority
- Edge case:
  if one focused test would force broader runtime changes, the lane must stop and reopen planning

## 8. UI/UX Detailed Design
- UX archetype reference: not-needed
- Selected UX archetype: not-needed
- Impacted screen: none
- Copy/text: none beyond test names and evidence wording if needed

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  this lane changes reusable governance-test and minimal validator/read-model evidence behavior, not project-specific product logic.
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Archetype deviation / approval: not-needed
- Required reading before code: `reference/planning/PLN-15_HARNESS_RESILIENCE_COMPATIBILITY_AND_SCALE_FIT_DRAFT.md`; `reference/planning/PLN-18_PROJECT_SSOT_AND_WORKFLOW_ENTRY_REBASELINE_DRAFT.md`; `reference/packets/PKT-01_OPS-18_WORKFLOW_GATES_BY_STARTER_MODE.md`; `reference/packets/PKT-01_OPS-20_STARTER_BOOTSTRAP_ARCHITECTURE_GUIDE_INIT_ALIGNMENT.md`; `.harness/test/dev05-tooling.test.js`; `.harness/test/init-project.test.js`; `.agents/artifacts/VALIDATION_REPORT.json`
- Environment topology reference: not-needed
- Domain foundation reference: not-needed
- Schema impact classification: none
- DB / state impact:
  no schema change is approved; only test and minimal validator/read-model assertion surfaces may change.
- Markdown / docs impact:
  packet/review/validation evidence only if needed.
- Generated docs impact:
  none expected beyond normal validation-report refresh.
- Validator / cutover impact:
  validator behavior should remain stable; test coverage and validation evidence are the main surfaces.
- Authoritative source refs:
  - `reference/planning/PLN-15_HARNESS_RESILIENCE_COMPATIBILITY_AND_SCALE_FIT_DRAFT.md`
  - `reference/planning/PLN-18_PROJECT_SSOT_AND_WORKFLOW_ENTRY_REBASELINE_DRAFT.md`
  - `reference/packets/PKT-01_OPS-18_WORKFLOW_GATES_BY_STARTER_MODE.md`
  - `reference/packets/PKT-01_OPS-20_STARTER_BOOTSTRAP_ARCHITECTURE_GUIDE_INIT_ALIGNMENT.md`
- Authoritative source intake reference: closed `PLN-15` packet sequence plus the closed `OPS-18` and `OPS-20` contracts that now need focused regression coverage.
- Authoritative source wave ledger reference: not-needed
- Source wave packet disposition: not-needed
- Authoritative source disposition: protect the settled governance contracts with narrower reusable tests; do not redesign the contracts here.
- Existing plan conflict: none identified; `PLN-17` remains the later ownership lane.
- Current implementation impact: reusable test and minimal validator/read-model assertion surfaces only after approval.
- Impacted packet set scope: single-packet
- Existing program / DB dependency: none

## 10. Acceptance
- Focused reusable tests cover the settled `OPS-18` workflow-entry rules and `OPS-20` starter-bootstrap alignment contract.
- Root and `standard-template` reusable test surfaces remain synchronized.
- The rebalance does not introduce broader runtime or architecture-contract changes.
- Targeted governance-test commands pass after the rebalance.
- Harness validator still passes after the test-focused change.

## 11. Open Questions
- Should the rebalance stay inside the existing `dev05-tooling` and `init-project` test files, or is one new focused reusable test file justified if it reduces duplication?
- Does any validator/read-model assertion need a narrow helper to keep the focused tests non-brittle, or can the rebalance stay test-only?

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Detailed agreement | yes | user/planner | approved | user approved the narrow governance-test rebalance boundary on 2026-05-14 |
| Ready For Code sign-off | yes | user | approved | user approved the bounded governance-test rebalance scope on 2026-05-14 |
| Governance-test boundary | yes | user/planner | approved | keep runtime redesign, ownership scope, and broader suite redesign out of this lane |
| Packet exit quality gate approval | yes | reviewer | approved | reviewer approved closeout on 2026-05-14 |

## 13. Implementation Notes
- Prefer the smallest focused test split that improves regression isolation.
- Only touch validator/read-model assertions when the new focused tests cannot stay authoritative otherwise.
- Do not reopen `OPS-18` or `OPS-20` design questions.
- Keep root and `standard-template` in lockstep if reusable test or supporting assertion files change.

## 14. Verification Plan
- Gate profile: contract
- Verification scenario reminder:
  - normal: focused governance tests pass for current workflow-entry and starter-bootstrap contracts
  - error: prohibited regressions are caught by negative tests
  - regression: validator and validation-report still pass without broader behavior drift
  - manual check: no new workflow/architecture/ownership rules were introduced

## Verification Manifest
- Gate profile:
  - contract: detailed agreement, Ready For Code, root sync, standard-template sync, targeted focused-governance regression coverage, harness validator, active context evidence if state/read-model refresh changes, validation report if validator/read-model assertions change, Tester verification, review closeout
- Required evidence:
  - detailed agreement approval
  - Ready For Code approval
  - focused governance test evidence
  - root validator
  - standard-template sync check if reusable test assets change
  - validation report if validator/read-model behavior changes
  - Tester verification
  - Reviewer closeout

## 15. Packet Exit Quality Gate
- Packet exit metadata version: v1
- Packet exit metadata gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata exit recommendation: approved
- Packet exit metadata source parity result: approved
- Packet exit metadata validation / security / cleanup evidence: approved
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: approved
- Implementation delta summary: extracted `OPS-18` workflow-entry / fallback / compact-baton governance checks into one focused reusable test file, kept `OPS-20` bootstrap-alignment assertions with `init-project.test.js`, and moved shared test seeding helpers into a reusable helper module without changing runtime behavior
- Source parity result: approved for root and `standard-template` reusable test surfaces
- Refactor / residual debt disposition: keep any broader test-suite redesign or ownership-contract work out of this lane
- UX conformance result: not-needed
- Topology / schema conformance result: not-needed
- Validation / security / cleanup evidence: root targeted tests pass; `standard-template` targeted tests pass; root validator passes; root validation-report passes; reusable security review is not applicable
- Deferred follow-up item: `PLN-17_MULTI_MODEL_OWNERSHIP_AND_CONFLICT_CONTRACT`
- Improvement candidate reference: approved governance-test follow-up sequence from `PLN-15` after the concrete `OPS-18` and `OPS-20` contracts closed
- Proposed target layer: core
- Promotion status / linked follow-up item: approved / `QLT-04_GOVERNANCE_TEST_REBALANCE`
- Closeout notes: reviewer approved closeout on 2026-05-14; the lane stayed inside test-support scope and introduced no runtime or authority redesign

## 16. Ready For Code Approval Text
Ready For Code must be separately approved with wording equivalent to:

```text
Ready For Code is approved for QLT-04 only for implementing the minimum reusable governance-test rebalance needed to protect the approved OPS-18 workflow-entry contract and OPS-20 starter-bootstrap alignment contract. Workflow redesign, ARCHITECTURE_GUIDE authority changes, broader starter/bootstrap redesign, PLN-17 ownership scope, DB schema changes, and product-specific tests are out of scope.
```

Ready For Code status:
- approved on 2026-05-14 for the bounded governance-test rebalance scope described above

## 17. Reopen Trigger
- The fix requires changing the approved runtime workflow-entry rules instead of only protecting them with tests.
- The fix requires changing the approved starter bootstrap contract instead of only protecting it with tests.
- The fix expands into multi-model ownership, broader validator redesign, or DB schema changes.
- The fix cannot be kept synchronized between root and `standard-template`.
