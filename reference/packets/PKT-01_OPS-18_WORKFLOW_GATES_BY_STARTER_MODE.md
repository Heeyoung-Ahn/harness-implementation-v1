# PKT-01 OPS-18 Workflow Gates By Starter Mode

## Purpose
- Implement the approved workflow-entry guardrails after `PLN-16` and `PLN-18`.
- Make route resolution, stop-on-ambiguity behavior, limited Planner fallback, and compact baton shape enforceable in the reusable runtime/workflow surface.
- Preserve explicit approval boundaries while reducing the chance that work starts in the wrong workflow.

## Approval Rule
- This packet starts in Planner workflow.
- This packet does not approve implementation until detailed agreement and `Ready For Code` are explicitly approved.
- This packet may change reusable workflow/runtime/state-tooling behavior only inside the approved workflow-entry and baton-enforcement boundary.
- It must not reopen `OPS-17` manual wording, `QLT-04` governance-test rebalance, or `PLN-17` multi-model ownership scope.

## Detailed Agreement Proposal
- Primary implementation direction:
  - enforce workflow entry through existing state/runtime contracts instead of relying on manual interpretation
- Runtime/workflow scope:
  - resolve route from active owner, explicit handoff, current state, or approved routing evidence
  - continue only when one workflow is clearly supported
  - stop when the route is unclear
  - allow Planner fallback only for non-mutating work such as planning, review of scope/architecture meaning, requirements organization, and follow-up decomposition
  - deny Planner fallback for implementation, testing, review closeout, approval-state change, or any document/code mutation that requires approval
  - keep `Next Work` as a compact baton with `next workflow`, `next first action`, `required SSOT`, and `approval boundary / do-not-cross`
- Starter-mode relation:
  - keep the route/gate logic compatible with `minimal`, `standard`, and `full-governance`
  - do not let `minimal` bypass risk-triggered escalation or explicit approval boundaries
- Non-scope:
  - no new human-facing manual rewrite
  - no governance-test rebalance
  - no multi-model ownership contract
  - no DB schema change
  - no generated-doc authority change
- Approval boundary:
  - this proposal closes the workflow-entry enforcement direction only; implementation remains blocked until separate `Ready For Code` approval

## Detailed Agreement Approval Text
Detailed agreement is approved for OPS-18 with the following closed decisions:
- Planner fallback is allowed only for non-mutating work such as planning, scope/architecture review, requirements organization, and follow-up decomposition
- Planner fallback is not allowed for implementation, testing, review closeout, approval-state changes, or document/code mutation that needs approval
- OPS-18 implementation scope includes runtime route enforcement plus compact baton/output-shape enforcement
- OPS-18 may include bounded validator/runtime enforcement only where needed to keep the compact baton and stop-on-ambiguity rules real
- OPS-17 manual wording, QLT-04 governance-test rebalance, PLN-17 ownership contract, DB schema change, and product-specific routing logic remain out of scope
- implementation remains blocked until separate `Ready For Code` approval

## Detailed Agreement Approval Decision
- User approved the OPS-18 detailed agreement on 2026-05-14.
- This approval covers the non-mutating-only Planner fallback boundary and the inclusion of runtime route enforcement plus compact baton/output-shape enforcement in the OPS-18 implementation boundary.
- This approval does not authorize implementation.
- `Ready For Code` remains blocked until separately approved.

## Ready For Code Approval Decision
- User approved Ready For Code for OPS-18 on 2026-05-14.
- Implementation is limited to the bounded reusable runtime/workflow enforcement scope that:
  - resolves one clear workflow route from approved route evidence
  - stops on ambiguity instead of guessing
  - enforces non-mutating-only Planner fallback
  - enforces compact baton/output-shape rules for `Next Work`
  - includes only the minimum validator/runtime/read-model updates needed to keep those rules real
- Implementation must stop and return to Planner if it needs DB schema changes, OPS-17 manual rewrites, QLT-04 governance-test rebalance, PLN-17 ownership-contract work, or product-specific routing logic.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-18 Workflow gates by starter mode | the next reusable gap is runtime enforcement of the approved workflow-entry guardrails | approved |
| Ready For Code | approved | bounded runtime/workflow enforcement is explicitly approved; out-of-scope routing, test, ownership, and schema work remain blocked | approved |
| Human sync needed | yes | this changes reusable workflow-entry behavior and Planner fallback boundaries | approved |
| Gate profile | contract | affects reusable workflow/runtime/state behavior and baton shape | approved |
| User-facing impact | medium | operators and agents will see stricter workflow-entry routing and stop conditions | approved |
| Layer classification | core | applies to the reusable standard harness baseline | approved |
| Active profile dependencies | none | no optional profile is active | not-needed |
| Profile evidence status | not-needed | no profile-specific evidence required | not-needed |
| UX archetype status | approved | existing operator evidence/context CLI archetype is sufficient for this workflow/runtime surface | approved |
| UX deviation status | none | no product UI deviation is proposed | not-needed |
| Environment topology status | not-needed | no deploy/cutover topology is changed | not-needed |
| Domain foundation status | not-needed | no data-domain work is included | not-needed |
| Authoritative source intake status | approved | `PLN-15`, approved `PLN-16`, and closed `PLN-18` define the follow-up direction | approved |
| Shared-source wave status | not-needed | single-packet reusable workflow enforcement lane | not-needed |
| Packet exit gate status | pending | implementation, verification, and review are not complete | pending |
| Improvement promotion status | approved | this is the approved follow-up for workflow-entry guardrail enforcement | approved |
| Existing system dependency | none | no legacy program or DB integration is touched | not-needed |
| New authoritative source impact | analyzed | `PLN-18` fixed the workflow-entry, fallback, and baton rules that OPS-18 must enforce | analyzed |
| Risk if started now | medium | wrong routing or over-broad fallback could block valid work or bypass approval boundaries | approved |

## Lane-Typed Minimum Contract
- Lane-type declaration:
  planning
- Lane-type universal minimum sections:
  Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger
- Lane-type required sections:
  Detailed Agreement Proposal; Human Sync / Approval Boundary; Verification Manifest; source trace to `PLN-15`, `PLN-16`, and `PLN-18`
- Lane-type conditional sections:
  Runtime tests are required when implementation changes state tooling, workflow routing, Active Context generation, or validator/report behavior.
- Lane-type not-needed sections:
  UX archetype, domain foundation, environment topology, existing DB compatibility, release packaging, and optional profile evidence are not needed unless scope changes.

## 1. Goal
- Enforce the approved workflow-entry rule in the reusable harness runtime/workflow surface.
- Make ambiguous route resolution stop instead of guessing.
- Keep `Planner` fallback narrow and non-mutating.
- Standardize the compact baton shape that `Next Work` is allowed to use.

## 2. Non-Goal
- Do not reopen `OPS-17` operator-manual wording.
- Do not rebalance validator/test burden. That belongs to `QLT-04_GOVERNANCE_TEST_REBALANCE`.
- Do not define multi-model ownership or conflict resolution. That belongs to `PLN-17_MULTI_MODEL_OWNERSHIP_AND_CONFLICT_CONTRACT`.
- Do not change DB schema, release packaging, Node.js runtime support, or product UI.
- Do not let `minimal` starter mode become a bypass around explicit approval boundaries.

## 3. User Problem And Expected Outcome
- Current problem:
  The harness now documents workflow-entry, fallback, and baton rules, but those rules still need reusable runtime/workflow enforcement so work does not start in the wrong lane by guesswork.
- Expected outcome:
  When a request does not name a workflow, the harness resolves one clear route or stops. Planner fallback is only used for non-mutating work, and `Next Work` stays compact instead of becoming a second authority layer.

## 4. In Scope
- Enforce route resolution from active owner, explicit handoff, current state, or approved routing evidence.
- Stop on ambiguity instead of guessing an implementation/testing/review route.
- Enforce limited Planner fallback for non-mutating work only.
- Enforce compact `Next Work` baton expectations in the reusable state/runtime surface where appropriate.
- Keep root and `standard-template` synchronized if reusable runtime/workflow assets change.

## 5. Out Of Scope
- Human-facing manual wording changes beyond minimal evidence notes if needed.
- Governance-test rebalance.
- Multi-model ownership, conflict adjudication, or merge authority.
- DB schema change.
- Product-specific business-domain routing logic.

## 6. Detailed Behavior
- Trigger:
  A request arrives without an explicit workflow, or the harness needs to decide whether a route is clear enough to continue.
- Main flow:
  1. Read current route evidence from active owner, latest handoff, current state, and approved routing data.
  2. Resolve one workflow only when the evidence is unambiguous.
  3. If the route is ambiguous, stop and report the hold instead of guessing.
  4. If the only safe route is Planner fallback and the requested work is non-mutating, continue in Planner.
  5. Keep `Next Work` compact and prevent it from redefining workflow/approval authority.
- Error state:
  If runtime enforcement would start implementation, testing, review closeout, or approval-state change without a clear route, stop and report the ambiguity.

## 7. Program Function Detail
- Input:
  active owner, latest handoff, current state, workflow contracts, and approved route evidence.
- Processing:
  bounded runtime/workflow enforcement of the approved workflow-entry and fallback rules.
- Output:
  resolved workflow route or explicit hold, plus compact baton/state output that does not overclaim authority.
- Edge case:
  If more than one route appears plausible, the system must stop instead of preferring one implicitly.

## 8. UI/UX Detailed Design
- UX archetype reference: existing operator evidence/context CLI archetype used by reusable harness state and workflow surfaces
- Selected UX archetype: operator evidence/context routing surface
- Impacted screen: no product UI
- Copy/text: operator-facing route/hold wording only if the implementation surfaces user-visible diagnostics

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  route resolution and baton enforcement are reusable harness workflow behavior, not project-specific logic.
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `reference/planning/PLN-15_HARNESS_RESILIENCE_COMPATIBILITY_AND_SCALE_FIT_DRAFT.md`; `reference/planning/PLN-16_OPERATOR_ADOPTION_AND_TIERED_GOVERNANCE_CONTRACT_DRAFT.md`; `reference/planning/PLN-18_PROJECT_SSOT_AND_WORKFLOW_ENTRY_REBASELINE_DRAFT.md`; `.agents/workflows/plan.md`; `.agents/workflows/dev.md`; `.agents/workflows/test.md`; `.agents/workflows/review.md`; `.agents/rules/HARNESS_OPERATING_CONTRACT.md`; `.agents/artifacts/CURRENT_STATE.md`; `.agents/artifacts/TASK_LIST.md`; `.harness/runtime/state/dev05-tooling.js`; `.harness/runtime/state/drift-validator.js`
  - `reference/planning/PLN-15_HARNESS_RESILIENCE_COMPATIBILITY_AND_SCALE_FIT_DRAFT.md`
  - `reference/planning/PLN-16_OPERATOR_ADOPTION_AND_TIERED_GOVERNANCE_CONTRACT_DRAFT.md`
  - `reference/planning/PLN-18_PROJECT_SSOT_AND_WORKFLOW_ENTRY_REBASELINE_DRAFT.md`
  - `.agents/workflows/plan.md`
  - `.agents/workflows/dev.md`
  - `.agents/workflows/test.md`
  - `.agents/workflows/review.md`
  - `.agents/rules/HARNESS_OPERATING_CONTRACT.md`
  - `.agents/artifacts/CURRENT_STATE.md`
  - `.agents/artifacts/TASK_LIST.md`
  - `.harness/runtime/state/dev05-tooling.js`
  - `.harness/runtime/state/drift-validator.js`
- Environment topology reference: not-needed
- Domain foundation reference: not-needed
- Schema impact classification: none
- DB / state impact:
  may change reusable state/runtime logic and generated route/read-model behavior; no schema change is approved.
- Markdown / docs impact:
  possible narrow workflow/rule wording updates only if implementation evidence needs them.
- Generated docs impact:
  Active Context and generated state docs may change if route-resolution output changes.
- Validator / cutover impact:
  validator and/or validation report behavior may need bounded updates if route ambiguity or baton-shape evidence becomes enforceable.
- Authoritative source refs:
  - `reference/planning/PLN-15_HARNESS_RESILIENCE_COMPATIBILITY_AND_SCALE_FIT_DRAFT.md`
  - `reference/planning/PLN-16_OPERATOR_ADOPTION_AND_TIERED_GOVERNANCE_CONTRACT_DRAFT.md`
  - `reference/planning/PLN-18_PROJECT_SSOT_AND_WORKFLOW_ENTRY_REBASELINE_DRAFT.md`
  - `.agents/rules/HARNESS_OPERATING_CONTRACT.md`
- Authoritative source intake reference: approved `PLN-15`, approved `PLN-16`, and closed `PLN-18`; no separate new intake artifact is required.
- Authoritative source disposition: implement the approved workflow-entry, fallback, and baton rules as reusable enforcement.
- Existing plan conflict: none identified; `QLT-04` and `PLN-17` remain sequenced after this lane.
- Current implementation impact: reusable workflow/runtime/state enforcement only after approval.
- Impacted packet set scope: single-packet
- Existing program / DB dependency: none

## 10. Acceptance
- A request without an explicit workflow resolves one route only when the evidence is clear.
- Ambiguous route resolution stops instead of guessing.
- Planner fallback remains available only for non-mutating work.
- Planner fallback is not used for implementation, testing, review closeout, approval-state changes, or approval-requiring mutation.
- `Next Work` remains a compact baton and does not become a second workflow/approval authority surface.
- `minimal` starter mode does not bypass risk-triggered escalation or explicit approval boundaries.
- Root and `standard-template` remain synchronized if reusable runtime/workflow assets change.
- Validation passes after this packet is opened.

## 11. Open Questions
- Should ambiguity diagnostics surface the competing route signals explicitly, or is a generic hold message sufficient for the first implementation?
- Does the compact baton rule need only validator/runtime enforcement, or should some existing handoff formatting helpers also be tightened in the same lane?

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Detailed agreement | yes | user/planner | approved | runtime/workflow enforcement boundary approved on 2026-05-14 |
| Ready For Code sign-off | yes | user | approved | bounded runtime/workflow enforcement approved on 2026-05-14 |
| Planner fallback boundary | yes | user/planner | approved | non-mutating fallback only; no implementation/testing/review closeout fallback |
| Validator/runtime enforcement scope | yes | user/planner | approved | OPS-18 includes runtime route enforcement plus compact baton/output-shape enforcement; bounded validator/runtime enforcement is allowed only where needed |
| Packet exit quality gate approval | yes | reviewer | approved | reviewer approved closeout on 2026-05-14 |

## 13. Implementation Notes
- Prefer the smallest reusable enforcement that makes the approved route rule real.
- Do not duplicate workflow authority in multiple surfaces when one runtime/read-model decision path can enforce it.
- Keep diagnostic wording short and route-oriented.
- If implementation touches reusable runtime/state behavior, keep root and `standard-template` synchronized in the same lane.

## 14. Verification Plan
- Gate profile: contract
- Verification scenario reminder:
  - normal: one clear route proceeds cleanly
  - error: ambiguous route stops instead of guessing
  - permission: Planner fallback does not open implementation/testing/review work
  - regression: existing clear-route workflow transitions still work
  - manual check: `Next Work` stays compact and does not overclaim authority

## Verification Manifest
- Gate profile:
  - contract: detailed agreement, Ready For Code, root sync, standard-template sync if reusable runtime/workflow assets change, targeted routing regression coverage, root test suite when runtime behavior changes, starter test suite when runtime behavior changes, harness validator, active context evidence when state or re-entry context is touched, review closeout
- Required evidence:
  - detailed agreement approval
  - Ready For Code approval
  - targeted routing checks
  - root validator
  - standard-template sync check if reusable runtime/workflow assets change
  - active context evidence if transition/state generated surfaces refresh
  - validation report if runtime/read-model behavior changes
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
- Implementation delta summary: route resolution now stops on ambiguity, Planner fallback is limited to non-mutating planning work, and compact baton fields are emitted in handoff payloads plus `ACTIVE_CONTEXT`
- Source parity result: approved for root and `standard-template` reusable runtime/test surfaces
- Refactor / residual debt disposition: starter bootstrap / `ARCHITECTURE_GUIDE` initialization drift remains as a separate follow-up lane and is outside `OPS-18`
- UX conformance result: not-needed
- Topology / schema conformance result: not-needed
- Validation / security / cleanup evidence: root targeted route/baton tests pass, `standard-template` targeted route/baton tests pass, root validator passes, reusable security review is not applicable
- Deferred follow-up item: `OPS-20_STARTER_BOOTSTRAP_ARCHITECTURE_GUIDE_INIT_ALIGNMENT`, `QLT-04_GOVERNANCE_TEST_REBALANCE`, `PLN-17_MULTI_MODEL_OWNERSHIP_AND_CONFLICT_CONTRACT`
- Improvement candidate reference: approved workflow-entry guardrail follow-up after `PLN-18`
- Proposed target layer: core
- Promotion status / linked follow-up item: approved / `OPS-18_WORKFLOW_GATES_BY_STARTER_MODE`
- Closeout notes: reviewer approved closeout on 2026-05-14; separate starter bootstrap / `ARCHITECTURE_GUIDE` initialization alignment should open as its own planner lane

## 16. Ready For Code Approval Text
Ready For Code must be separately approved with wording equivalent to:

```text
Ready For Code is approved for OPS-18 only for implementing the approved workflow-entry enforcement, stop-on-ambiguity behavior, limited Planner fallback, and compact baton/output-shape rules in the reusable harness runtime/workflow surface. OPS-17 manual wording, QLT-04 governance-test rebalance, PLN-17 multi-model ownership, DB schema changes, and product-specific routing logic are out of scope.
```

Ready For Code status:
- approved on 2026-05-14 for the bounded runtime/workflow enforcement scope described above.

## 17. Reopen Trigger
- The implementation would need DB schema changes.
- The implementation would reopen `OPS-17` manual wording scope.
- The implementation would expand into `QLT-04` governance-test rebalance or `PLN-17` ownership contract work.
- The implementation would let Planner fallback open implementation/testing/review work.
- The implementation would make `Next Work` a second workflow or approval authority surface.
