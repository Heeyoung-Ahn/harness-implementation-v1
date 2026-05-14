# PKT-01 PLN-17 Multi-model ownership and conflict contract

## Purpose
- Define the reusable ownership and conflict contract for multi-model, multi-agent, or parallel candidate work after the ordinary workflow-entry and governance-test contracts are already settled.
- Keep authority tied to approved packet scope, file/path ownership, evidence quality, and human/Planner decisions instead of model identity.
- Keep this lane planning-only until the ownership contract boundary is explicitly approved.

## Approval Rule
- This packet starts in Planner workflow.
- This packet does not approve implementation until detailed agreement and `Ready For Code` are explicitly approved.
- This packet may define reusable planning/runtime contract direction for ownership and conflict rules only inside the approved multi-model boundary.
- It must not reopen `OPS-17` manual wording, `OPS-18` runtime route rules, `OPS-20` starter bootstrap alignment, or `QLT-04` governance-test rebalance.

## Detailed Agreement Proposal
- Primary planning direction:
  - define ownership-of-record, blocked-file, dependency-file, stale-ownership expiry, and conflict-adjudication rules for multi-model or parallel candidate work
- Narrow planning scope:
  - keep authority precedence on approved packet, path ownership, and reviewer/planner/human adjudication
  - define candidate-output handling without making model identity the authority
  - define stale ownership expiry and merge/unblock behavior
  - define the minimum reusable conflict ledger needed to make the contract reviewable
- Non-scope:
  - no runtime scheduler
  - no workflow-entry redesign
  - no validator/test rebalance beyond what a later implementation packet may explicitly approve
  - no DB schema change
  - no product-specific branch/worktree policy
- Approval boundary:
  - this proposal closes only the planning boundary for multi-model ownership and conflict rules; implementation remains blocked until separate `Ready For Code` approval

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | PLN-17 Multi-model ownership and conflict contract | the next remaining approved lane is the dedicated ownership/conflict planning contract for parallel model or candidate work | pending |
| Ready For Code | pending | implementation is not approved yet | pending |
| Human sync needed | yes | this lane defines reusable authority and conflict rules for parallel work | pending |
| Gate profile | contract | affects reusable governance/runtime ownership rules if later implemented | approved |
| User-facing impact | medium | operators need predictable conflict/ownership rules when parallel work is used | approved |
| Layer classification | core | applies to reusable harness ownership and conflict policy | approved |
| Active profile dependencies | none | no optional profile is active | not-needed |
| Profile evidence status | not-needed | no profile-specific evidence required | not-needed |
| UX archetype status | approved | existing reusable operator/evidence planning archetype is sufficient for this planning surface | approved |
| UX deviation status | not-needed | no UX deviation is proposed | not-needed |
| Environment topology status | not-needed | no deploy/cutover topology is changed | not-needed |
| Domain foundation status | not-needed | no data-domain work is included | not-needed |
| Authoritative source intake status | approved | `PLN-15` reserved this lane and later packets kept it explicitly out of scope until the ordinary governance wave closed | approved |
| Shared-source wave status | not-needed | single-packet planning lane | not-needed |
| Packet exit gate status | pending | planning, approval, and any later implementation/review are not complete | pending |
| Existing system dependency | none | no legacy external system or DB integration is touched | not-needed |
| New authoritative source impact | analyzed | the remaining deferred ownership contract can now be opened after `OPS-18`, `OPS-20`, and `QLT-04` closed | analyzed |
| Risk if started now | medium | over-broad design could drift into scheduler/runtime redesign instead of staying on ownership and adjudication rules | approved |

## Lane-Typed Minimum Contract
- Lane-type declaration:
  planning
- Lane-type universal minimum sections:
  Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger
- Lane-type required sections:
  Detailed Agreement Proposal; Human Sync / Approval Boundary; Verification Manifest; source trace to `PLN-15`, `PLN-18`, and the deferred-scope references from `OPS-17`, `OPS-18`, `OPS-20`, and `QLT-04`
- Lane-type conditional sections:
  runtime/test/validator implementation details are conditional only if a later implementation packet is opened after planning approval
- Lane-type not-needed sections:
  UX archetype, domain foundation, environment topology, existing DB compatibility, release packaging, and optional profile evidence are not needed unless scope changes

## 1. Goal
- Define how multi-model or parallel candidate work assigns authority, blocks files, expires stale ownership, and resolves conflicts.
- Keep the contract narrow enough that later implementation can enforce it without becoming a general scheduler.
- Preserve existing packet-before-code, approval, reviewer, and source-parity authority.

## 2. Non-Goal
- Do not redesign workflow-entry routing.
- Do not redesign starter bootstrap behavior.
- Do not rebalance governance tests.
- Do not add a general multi-agent orchestration plane.
- Do not make model identity the authority for merge or ownership decisions.

## 3. User Problem And Expected Outcome
- Current problem:
  the harness has deferred multi-model ownership and conflict rules while closing the ordinary workflow-entry, bootstrap, and governance-test lanes first.
- Expected outcome:
  a clear planning contract explains who owns files, how candidate outputs are treated, when ownership expires, and who adjudicates conflicts before any implementation packet tries to enforce that policy.

## 4. In Scope
- ownership-of-record rules
- file/path ownership and blocked/dependency file rules
- candidate-output vs authority-output distinction
- stale ownership expiry behavior
- reviewer/planner/human adjudication boundaries
- minimum conflict ledger shape

## 5. Out Of Scope
- scheduler or queue design
- product-specific branch/worktree policy
- workflow-entry runtime redesign
- starter bootstrap redesign
- governance-test rebalance
- DB schema change

## 6. Detailed Behavior
- Trigger:
  more than one model/agent/worktree/branch candidate may touch overlapping files or packet scope
- Main flow:
  1. packet scope names the owner-of-record and file/path ownership table
  2. candidate outputs remain non-authoritative until reviewed or adopted
  3. blocked or overlapping ownership is either adjudicated or expires by rule
  4. reviewer/planner/human authority resolves conflicts according to the contract
- Error state:
  if the contract needs runtime scheduling, broad branch policy, or model-specific precedence, stop and return to Planner with narrowed scope

## 7. Program Function Detail
- Input:
  approved packet scope, parallel candidate work, file/path overlap, and reviewer/planner decisions
- Processing:
  planning-only ownership and conflict contract definition
- Output:
  reusable contract and minimum ledger expectations for later implementation work
- Edge case:
  if two candidates are both plausible and no authority can decide by evidence alone, the human operator remains final adjudicator

## 8. UI/UX Detailed Design
- UX archetype reference: not-needed
- Selected UX archetype: not-needed
- Impacted screen: none
- Copy/text: none beyond operator/planner-facing contract wording if needed

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  this lane defines reusable ownership/conflict planning rules, not project-specific logic.
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Archetype deviation / approval: not-needed
- Required reading before code: `reference/planning/PLN-15_HARNESS_RESILIENCE_COMPATIBILITY_AND_SCALE_FIT_DRAFT.md`; `reference/planning/PLN-18_PROJECT_SSOT_AND_WORKFLOW_ENTRY_REBASELINE_DRAFT.md`; `reference/packets/PKT-01_OPS-17_OPERATOR_GLOSSARY_PROFILE_RESET_AND_SAFE_FIX_GUIDANCE.md`; `reference/packets/PKT-01_OPS-18_WORKFLOW_GATES_BY_STARTER_MODE.md`; `reference/packets/PKT-01_OPS-20_STARTER_BOOTSTRAP_ARCHITECTURE_GUIDE_INIT_ALIGNMENT.md`; `reference/packets/PKT-01_QLT-04_GOVERNANCE_TEST_REBALANCE.md`; `.agents/rules/HARNESS_OPERATING_CONTRACT.md`
- Environment topology reference: not-needed
- Domain foundation reference: not-needed
- Schema impact classification: none
- DB / state impact:
  no schema change is approved; planning-only state and packet evidence changes only.
- Markdown / docs impact:
  planning packet and later contract artifacts only.
- Generated docs impact:
  normal planning state refresh only.
- Validator / cutover impact:
  none yet; any later enforcement belongs to a later implementation packet.
- Authoritative source refs:
  - `reference/planning/PLN-15_HARNESS_RESILIENCE_COMPATIBILITY_AND_SCALE_FIT_DRAFT.md`
  - `reference/planning/PLN-18_PROJECT_SSOT_AND_WORKFLOW_ENTRY_REBASELINE_DRAFT.md`
  - `reference/packets/PKT-01_OPS-18_WORKFLOW_GATES_BY_STARTER_MODE.md`
  - `reference/packets/PKT-01_QLT-04_GOVERNANCE_TEST_REBALANCE.md`
- Authoritative source intake reference: the deferred-scope references from the closed governance wave plus the original sequencing from `PLN-15`.
- Authoritative source wave ledger reference: not-needed
- Source wave packet disposition: not-needed
- Authoritative source disposition: open the deferred dedicated ownership-planning lane now that the ordinary governance wave is closed.
- Existing plan conflict: none identified
- Current implementation impact: planning only
- Impacted packet set scope: single-packet
- Existing program / DB dependency: none

## 10. Acceptance
- The lane opens as the active planner-owned ownership/conflict planning contract.
- The packet clearly separates ownership rules from workflow-entry, bootstrap, and governance-test work that is already closed.
- The packet is ready for detailed-agreement review with explicit scope, non-scope, and approval boundaries.
- Validator and validation-report remain clean after the lane opens.

## 11. Open Questions
- What minimum ownership-ledger fields are mandatory before later implementation opens?
- Should stale ownership expiry be purely time-based, or should it also require explicit unblock conditions?

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Detailed agreement | yes | user/planner | pending | close the multi-model ownership planning boundary before any implementation opens |
| Ready For Code sign-off | yes | user | pending | implementation remains blocked until explicitly approved |
| Ownership/adjudication boundary | yes | user/planner | pending | keep scheduler/runtime redesign and broader branch policy out of this lane |
| Packet exit quality gate approval | yes | reviewer | pending | reviewer approval is required before closeout |

## 13. Implementation Notes
- Planning only for now.
- Keep the contract evidence-oriented and reviewer/planner/human-governed.
- Do not introduce model-preference rules where file/path authority and approved packet scope are enough.

## 14. Verification Plan
- Gate profile: contract
- Verification scenario reminder:
  - normal: packet opens cleanly as the next planner lane
  - error: ambiguous or over-broad scope is surfaced as a planning hold
  - regression: opening the new lane does not disturb the closed prior lanes or validation state

## Verification Manifest
- Gate profile:
  - contract: detailed agreement, Ready For Code, root sync if reusable planning assets change, standard-template sync if reusable planning assets change, targeted ownership-contract planning checks if reusable planning helpers change, validator, active context evidence, review closeout
- Required evidence:
  - detailed agreement approval
  - Ready For Code approval
  - root validator
  - active context evidence
  - review closeout

## 15. Packet Exit Quality Gate
- Packet exit metadata version: v1
- Packet exit metadata gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata exit recommendation: pending
- Packet exit metadata source parity result: pending
- Packet exit metadata validation / security / cleanup evidence: pending
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: pending
- Implementation delta summary: planning not started
- Source parity result: pending
- Refactor / residual debt disposition: later implementation and validator/runtime enforcement remain separate follow-up work
- UX conformance result: not-needed
- Topology / schema conformance result: not-needed
- Validation / security / cleanup evidence: pending
- Deferred follow-up item: none
- Improvement candidate reference: deferred ownership lane sequenced after the closed ordinary governance wave
- Proposed target layer: core
- Promotion status / linked follow-up item: approved / `PLN-17_MULTI_MODEL_OWNERSHIP_AND_CONFLICT_CONTRACT`
- Closeout notes: pending

## 15A. Deferred Priority Note
- Deferred on 2026-05-14 by explicit user priority decision.
- Reason:
  `PLN-19_STANDARD_TEMPLATE_DOWNSTREAM_APP_READINESS_REBASELINE` must run first because the standard-template audit found downstream-app readiness issues in shipped starter documents, runtime references, and reusable tests.
- This is not a functional completion of the multi-model ownership contract.
- Reopen trigger:
  after `PLN-19` and its immediate remediation wave close, Planner should reopen or recreate the multi-model ownership planning lane before starting unrelated governance expansion.

## 16. Ready For Code Approval Text
Ready For Code must be separately approved with wording equivalent to:

```text
Ready For Code is approved for PLN-17 only for implementing the approved multi-model ownership and conflict contract scope. Workflow-entry redesign, starter bootstrap redesign, governance-test rebalance, DB schema changes, and product-specific branch/worktree policy are out of scope.
```

Ready For Code status:
- pending separate approval

## 17. Reopen Trigger
- The contract would require scheduler/runtime redesign instead of ownership/adjudication rules.
- The lane expands into workflow-entry, bootstrap, governance-test, or DB-schema work.
- The packet cannot stay single-lane and evidence-oriented.
