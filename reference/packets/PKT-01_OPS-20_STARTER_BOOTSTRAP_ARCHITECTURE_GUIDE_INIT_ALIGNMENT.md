# PKT-01 OPS-20 Starter bootstrap / ARCHITECTURE_GUIDE initialization alignment

## Purpose
- Align copied-starter bootstrap initialization with the restructured `ARCHITECTURE_GUIDE.md`.
- Remove the stale dependency on the old `## Active Profiles And Exceptions` section so starter initialization and starter bootstrap tests match the current project-architecture-only contract.
- Keep this follow-up narrow: starter bootstrap alignment only, not a broader architecture or workflow rewrite.

## Approval Rule
- This packet starts in Planner workflow.
- This packet does not approve implementation until detailed agreement and `Ready For Code` are explicitly approved.
- This packet may change reusable starter bootstrap/runtime/test behavior only inside the approved initialization-alignment boundary.
- It must not reopen `OPS-18` workflow-entry enforcement, `OPS-17` manual wording, `QLT-04` governance-test rebalance, or `PLN-17` ownership scope.

## Detailed Agreement Proposal
- Primary implementation direction:
  - update starter bootstrap logic and starter bootstrap tests so they consume the current `ARCHITECTURE_GUIDE.md` structure instead of the removed legacy section title
- Narrow runtime/bootstrap scope:
  - identify every starter initialization path that still assumes `## Active Profiles And Exceptions`
  - replace that assumption with parsing or insertion logic that matches the current `ARCHITECTURE_GUIDE.md` authoring flow and project-architecture-only contract
  - keep root and `standard-template` runtime/test mirrors synchronized
  - update only the minimum supporting wording if bootstrap-generated starter outputs still need to reference the current authoring flow
- Non-scope:
  - no new `ARCHITECTURE_GUIDE.md` role change
  - no new workflow governance rule
  - no long-term context authority redesign
  - no DB schema change
  - no product-specific starter customization
  - no broader starter-init UX rewrite
- Approval boundary:
  - this proposal closes only the starter bootstrap / architecture-guide initialization alignment direction; implementation remains blocked until separate `Ready For Code` approval

## Detailed Agreement Approval Text
Detailed agreement is approved for OPS-20 with the following closed decisions:
- scope stays limited to starter bootstrap/runtime/test alignment only
- copied-starter initialization must no longer depend on the deleted `## Active Profiles And Exceptions` section
- the approved target contract is the current `ARCHITECTURE_GUIDE.md` authoring flow and project-architecture-only role
- implementation may replace fragile heading-based insertion with a less fragile deterministic update strategy only when that is the narrowest fix needed to preserve the approved architecture-guide contract
- OPS-20 must not rewrite `ARCHITECTURE_GUIDE.md` authority, reintroduce harness-operating content into project architecture, reopen workflow governance, redesign broader starter initialization, change DB schema, or expand into `QLT-04` / `PLN-17`
- implementation remains blocked until separate `Ready For Code` approval

## Detailed Agreement Approval Decision
- User approved the OPS-20 detailed agreement on 2026-05-14.
- This approval covers the narrow starter bootstrap/runtime/test alignment boundary, the requirement to remove the stale deleted-section dependency, and the limited allowance for a less fragile deterministic update strategy when it is the narrowest sufficient fix.
- This approval does not authorize implementation.
- `Ready For Code` remains blocked until separately approved.

## Ready For Code Approval Decision
- User approved Ready For Code for OPS-20 on 2026-05-14.
- Implementation is limited to the minimum reusable starter bootstrap/runtime/test alignment needed so copied-starter initialization and starter bootstrap tests follow the current `ARCHITECTURE_GUIDE.md` contract.
- Approved implementation scope is limited to:
  - removing the stale dependency on the deleted `## Active Profiles And Exceptions` section
  - aligning copied-starter initialization with the current `ARCHITECTURE_GUIDE.md` authoring flow
  - using the narrowest deterministic update strategy if heading-based insertion is too fragile
  - keeping root and `standard-template` runtime/test surfaces synchronized
- Implementation must stop and return to Planner if it would rewrite `ARCHITECTURE_GUIDE.md` authority, reintroduce harness-operating content into project architecture, reopen workflow governance, redesign broader starter bootstrap behavior, expand into `QLT-04` / `PLN-17`, require DB schema changes, or add product-specific starter customization.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-20 Starter bootstrap / ARCHITECTURE_GUIDE initialization alignment | copied-starter initialization still assumes an old architecture-guide section and leaves two starter bootstrap tests red after the document split | approved |
| Ready For Code | approved | bounded starter bootstrap/runtime/test alignment scope is explicitly approved; broader architecture/workflow/bootstrap changes remain blocked | approved |
| Human sync needed | yes | this touches reusable starter bootstrap behavior and the contract between bootstrap logic and project-design SSOT | approved |
| Gate profile | contract | affects reusable starter/runtime/test behavior and copied-starter initialization reliability | approved |
| User-facing impact | medium | starter users are affected when initialization leaves bootstrap guidance or tests out of sync with the current architecture contract | approved |
| Layer classification | core | applies to the reusable standard harness starter | approved |
| Active profile dependencies | none | no optional profile is active | not-needed |
| Profile evidence status | not-needed | no profile-specific evidence required | not-needed |
| UX archetype status | approved | existing starter bootstrap / operator guidance archetype is sufficient for this reusable starter/runtime/test alignment surface | approved |
| UX deviation status | none | no UX deviation is proposed | not-needed |
| Environment topology status | not-needed | no deploy/cutover topology is changed | not-needed |
| Domain foundation status | not-needed | no data-domain work is included | not-needed |
| Authoritative source intake status | approved | `PLN-18` and the current `ARCHITECTURE_GUIDE.md` define the new document contract; OPS-18 testing exposed the stale bootstrap dependency | approved |
| Shared-source wave status | not-needed | single-packet bootstrap-alignment follow-up | not-needed |
| Packet exit gate status | pending | implementation, verification, and review are not complete | pending |
| Improvement promotion status | approved | this is the approved residual-debt promotion from OPS-18 closeout | approved |
| Existing system dependency | none | no legacy external system or DB integration is touched | not-needed |
| New authoritative source impact | analyzed | `PLN-18` rewrote the architecture guide contract and created the bootstrap-alignment follow-up need | analyzed |
| Risk if started now | medium | over-broad fixes could reopen architecture-contract scope instead of just fixing starter bootstrap alignment | approved |

## Lane-Typed Minimum Contract
- Lane-type declaration:
  planning
- Lane-type universal minimum sections:
  Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger
- Lane-type required sections:
  Detailed Agreement Proposal; Human Sync / Approval Boundary; Verification Manifest; source trace to `PLN-18`, `ARCHITECTURE_GUIDE.md`, and starter bootstrap/runtime sources
- Lane-type conditional sections:
  Runtime tests are required when implementation changes starter initialization logic, bootstrap text generation, or copied-starter verification behavior.
- Lane-type not-needed sections:
  UX archetype, domain foundation, environment topology, existing DB compatibility, release packaging, and optional profile evidence are not needed unless scope changes.

## 1. Goal
- Make copied-starter initialization consistent with the current `ARCHITECTURE_GUIDE.md` structure.
- Remove stale bootstrap assumptions that still look for the deleted `## Active Profiles And Exceptions` section.
- Restore starter bootstrap testability without reopening the architecture-role decision already closed in `PLN-18`.

## 2. Non-Goal
- Do not rewrite the approved role of `ARCHITECTURE_GUIDE.md`.
- Do not reopen `HARNESS_OPERATING_CONTRACT.md`, long-term context SSOT location, or workflow-entry rules.
- Do not rebalance broader harness test burden; that remains `QLT-04`.
- Do not introduce DB schema changes, product code changes, or optional-profile redesign.

## 3. User Problem And Expected Outcome
- Current problem:
  copied-starter bootstrap initialization still depends on a removed `ARCHITECTURE_GUIDE.md` section title, so starter initialization and starter bootstrap tests are no longer aligned with the current architecture contract.
- Expected outcome:
  starter bootstrap logic, copied-starter initialization, and starter bootstrap tests all use the current architecture-guide structure and authoring flow without reintroducing harness-operating content into the project architecture SSOT.

## 4. In Scope
- Inspect starter bootstrap/runtime code and tests that still assume the old architecture-guide section title.
- Define the narrow replacement contract against the current `ARCHITECTURE_GUIDE.md` structure and authoring flow.
- Update root and `standard-template` starter bootstrap/runtime/test surfaces together after approval.
- Add only the minimum supporting wording or generated-output adjustments needed to keep bootstrap outputs coherent.

## 5. Out Of Scope
- Rewriting the approved `ARCHITECTURE_GUIDE.md` contract.
- Workflow-entry or Planner fallback enforcement.
- Governance-test rebalance.
- Multi-model ownership or conflict-contract work.
- Human-facing manual rewrites unrelated to starter bootstrap initialization.

## 6. Detailed Behavior
- Trigger:
  a copied starter is initialized, or starter bootstrap/runtime tests validate the bootstrap path against the current architecture contract.
- Main flow:
  1. starter initialization loads the current project-design SSOT files
  2. bootstrap alignment logic updates the starter artifacts without assuming removed architecture-guide sections
  3. copied-starter initialization completes with architecture guidance that matches the current project-architecture-only authoring flow
  4. starter bootstrap tests confirm the copied starter now prioritizes bootstrap work and no longer expects the deleted section title
- Error state:
  if bootstrap alignment would require changing the approved `ARCHITECTURE_GUIDE.md` role or reopening broader planning decisions, stop and return to Planner

## 7. Program Function Detail
- Input:
  current `ARCHITECTURE_GUIDE.md`, starter bootstrap/runtime logic, copied-starter initialization path, and starter bootstrap tests
- Processing:
  narrow starter bootstrap alignment against the current architecture-guide structure
- Output:
  copied-starter initialization that is structurally aligned to the current architecture contract, plus synchronized runtime/test evidence
- Edge case:
  if bootstrap logic needs architecture content that is no longer part of `ARCHITECTURE_GUIDE.md`, the fix must use the approved replacement source instead of reintroducing removed sections

## 8. UI/UX Detailed Design
- UX archetype reference: not-needed
- Selected UX archetype: not-needed
- Impacted screen: no product UI
- Copy/text: starter bootstrap guidance only if generated bootstrap output still needs wording updates to match the current authoring flow

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  starter bootstrap initialization is reusable harness behavior, not project-specific application logic.
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `reference/planning/PLN-18_PROJECT_SSOT_AND_WORKFLOW_ENTRY_REBASELINE_DRAFT.md`; `.agents/artifacts/ARCHITECTURE_GUIDE.md`; `.agents/artifacts/REQUIREMENTS.md`; `.agents/rules/HARNESS_OPERATING_CONTRACT.md`; `.harness/runtime/state/init-project.js`; `standard-template/.harness/runtime/state/init-project.js`; `.harness/test/dev05-tooling.test.js`
- Environment topology reference: not-needed
- Domain foundation reference: not-needed
- Schema impact classification: none
- DB / state impact:
  may change starter bootstrap/runtime behavior and copied-starter generated state; no schema change is approved.
- Markdown / docs impact:
  possible narrow bootstrap-support wording updates only if starter-generated guidance still needs to reflect the current authoring flow.
- Generated docs impact:
  copied-starter generated current-state/task-list/active-context outputs may change if bootstrap initialization ordering or next-action text is refined.
- Validator / cutover impact:
  validator behavior should remain stable; starter bootstrap tests and copied-starter initialization evidence are the primary verification surface.
- Authoritative source refs:
  - `reference/planning/PLN-18_PROJECT_SSOT_AND_WORKFLOW_ENTRY_REBASELINE_DRAFT.md`
  - `.agents/artifacts/ARCHITECTURE_GUIDE.md`
  - `.agents/rules/HARNESS_OPERATING_CONTRACT.md`
- Authoritative source intake reference: closed `PLN-18` decisions plus OPS-18 residual-debt evidence from starter bootstrap test failures.
- Authoritative source disposition: implement the minimum reusable bootstrap/runtime alignment needed to honor the current architecture-guide contract.
- Existing plan conflict: none identified; `QLT-04` and `PLN-17` remain separate follow-up lanes.
- Current implementation impact: reusable starter bootstrap/runtime/test surfaces only after approval.
- Impacted packet set scope: single-packet
- Existing program / DB dependency: none

## 10. Acceptance
- Copied-starter initialization no longer depends on the deleted `## Active Profiles And Exceptions` section title.
- Starter bootstrap logic follows the current `ARCHITECTURE_GUIDE.md` authoring flow and project-architecture-only boundary.
- Root and `standard-template` starter bootstrap/runtime/test surfaces remain synchronized.
- Targeted copied-starter initialization tests pass after the fix.
- Harness validator still passes after the aligned bootstrap change.

## 11. Open Questions
- Should the bootstrap alignment keep heading-based insertion tied to a new stable section, or should it switch to a less fragile document-update strategy in the narrowest possible way?
- Do copied-starter outputs need a small wording adjustment so the generated bootstrap guidance explicitly matches the new `REQUIREMENTS -> ARCHITECTURE_GUIDE -> implementation packet` flow?

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Detailed agreement | yes | user/planner | approved | user approved the narrow bootstrap/runtime/test alignment boundary on 2026-05-14 |
| Ready For Code sign-off | yes | user | approved | user approved the bounded starter bootstrap/runtime/test alignment scope on 2026-05-14 |
| Starter bootstrap contract boundary | yes | user/planner | approved | fix stays inside starter bootstrap/runtime/test alignment only; less fragile deterministic update strategy is allowed only as the narrowest sufficient fix |
| Packet exit quality gate approval | yes | reviewer | approved | reviewer approved closeout on 2026-05-14 |

## 13. Implementation Notes
- Prefer the smallest reusable bootstrap fix that removes the stale architecture-guide dependency.
- Do not reintroduce harness-operating content into `ARCHITECTURE_GUIDE.md`.
- If the current text-update strategy is too heading-fragile, replace it with the narrowest deterministic alternative that still respects the approved architecture-guide structure.
- Keep root and `standard-template` in lockstep if reusable runtime/test files change.

## 14. Verification Plan
- Gate profile: contract
- Verification scenario reminder:
  - normal: copied-starter initialization succeeds with the current architecture-guide structure
  - error: stale section-title dependency is gone
  - regression: bootstrap next-action and starter initialization still prioritize kickoff/bootstrap work correctly
  - manual check: architecture-guide output still reads as project architecture only, not harness operating contract

## Verification Manifest
- Gate profile:
  - contract: detailed agreement, Ready For Code, root sync, standard-template sync, targeted copied-starter initialization regression coverage, root test suite if reusable runtime behavior changes broadly, starter test suite if reusable runtime behavior changes broadly, harness validator, active context evidence if generated state changes, review closeout
- Required evidence:
  - detailed agreement approval
  - Ready For Code approval
  - targeted copied-starter initialization checks
  - root validator
  - standard-template sync check if reusable runtime/test assets change
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
- Implementation delta summary: starter bootstrap initialization no longer assumes the deleted `## Active Profiles And Exceptions` section; bootstrap alignment now preserves the current `ARCHITECTURE_GUIDE.md` contract by validating the `Authoring Flow` section instead of rewriting architecture content, and root / `standard-template` init-project and init-project tests remain synchronized
- Source parity result: approved for root and `standard-template` reusable runtime/test surfaces
- Refactor / residual debt disposition: preserve the `PLN-18` architecture-role decision and keep any remaining broader bootstrap/refactor debt out of this lane
- UX conformance result: not-needed
- Topology / schema conformance result: not-needed
- Validation / security / cleanup evidence: root targeted bootstrap/runtime tests pass; `standard-template` targeted bootstrap/runtime tests pass; root validator passes; root validation-report passes; reusable security review is not applicable
- Deferred follow-up item: `QLT-04_GOVERNANCE_TEST_REBALANCE`, `PLN-17_MULTI_MODEL_OWNERSHIP_AND_CONFLICT_CONTRACT`
- Improvement candidate reference: reviewer-approved OPS-18 residual bootstrap-alignment follow-up
- Proposed target layer: core
- Promotion status / linked follow-up item: approved / `OPS-20_STARTER_BOOTSTRAP_ARCHITECTURE_GUIDE_INIT_ALIGNMENT`
- Closeout notes: reviewer approved closeout on 2026-05-14; no broader starter bootstrap redesign, architecture-authority rewrite, or workflow-governance expansion was introduced

## 16. Ready For Code Approval Text
Ready For Code must be separately approved with wording equivalent to:

```text
Ready For Code is approved for OPS-20 only for implementing the minimum reusable starter bootstrap/runtime/test alignment needed so copied-starter initialization and starter bootstrap tests follow the current ARCHITECTURE_GUIDE contract. Rewriting ARCHITECTURE_GUIDE authority, workflow governance, QLT-04 governance-test rebalance, PLN-17 ownership scope, DB schema changes, and product-specific starter customization are out of scope.
```

Ready For Code status:
- approved on 2026-05-14 for the bounded starter bootstrap/runtime/test alignment scope described above

## 17. Reopen Trigger
- The fix requires changing the approved role of `ARCHITECTURE_GUIDE.md`.
- The fix expands into workflow governance, broader bootstrap redesign, or governance-test rebalance.
- The fix requires DB schema changes.
- The fix cannot be kept synchronized between root and `standard-template`.
- The copied-starter initialization issue turns out to depend on a different authoritative source than the current architecture-guide contract.
