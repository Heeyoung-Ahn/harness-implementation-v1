# PKT-01 OPS-17 Operator Glossary Profile Reset And Safe Fix Guidance

## Purpose
- Finalize the non-technical operator manual surface after `PLN-16`, `OPS-16`, and the `PLN-18` document split.
- Add the operator concept primer, one-page checklist, profile/mode reset playbook, validation caveat, and safe-fix allow/deny guidance to the shipped manual surfaces.
- Keep the work documentation/manual-focused while preserving the approved harness truth hierarchy, packet-before-code boundary, the `ARCHITECTURE_GUIDE` / `HARNESS_OPERATING_CONTRACT` split, and root / `standard-template` parity.

## Approval Rule
- This packet is written before implementation.
- This packet starts in Planner workflow.
- This packet does not approve implementation until detailed agreement and `Ready For Code` are explicitly approved.
- Manual wording must remain explanatory. It must not become a second workflow authority or override `.agents/workflows/*`, `.agents/rules/HARNESS_OPERATING_CONTRACT.md`, `.agents/artifacts/*`, packet approval state, or DB hot-state.
- Node.js 22 support, workflow hard gates, governance test rebalance, and multi-model ownership remain out of scope.

## Detailed Agreement Proposal
- Manual targets:
  - `reference/manuals/HARNESS_MANUAL.md`
  - `standard-template/reference/manuals/HARNESS_MANUAL.md`
- Add or refine these operator-facing sections:
  - first concepts for non-technical operators
  - Operator One-Page Checklist
  - profile reselection / reset playbook
  - starter mode change relation
  - validation caveat
  - safe-fix allow list and deny list
  - solo-operation disclosure reminder
  - when to use minimal mode instead of standard/full-governance
- Keep wording Korean-first and operator-oriented where the existing manual surface is human-facing.
- Treat `.agents/rules/HARNESS_OPERATING_CONTRACT.md` as the operating-rule authority for workflow-entry, approval-boundary, packet-before-code, baton, and role-separation wording.
- Treat `.agents/artifacts/ARCHITECTURE_GUIDE.md` as a downstream project architecture template only, not an operator workflow authority.
- If the manual mentions `DOMAIN_CONTEXT`, `SYSTEM_CONTEXT`, or `PROJECT_HISTORY`, describe them as project context artifacts and not as current execution truth.
- Follow the approved human-facing writing rule: short, direct, action-oriented wording with plain-language explanations when strict governance terms are unavoidable.
- Preserve the rule that Active Context and generated docs are derived outputs, not authority.
- Preserve OPS-16 safe-fix boundaries: derived-output-only regeneration is safe; authority-state mutation is forbidden unless done by an approved state operation.
- Add manual parity verification between root and `standard-template`.
- Approval boundary: this proposal does not approve implementation. `Ready For Code` remains a separate user approval.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-17 Operator glossary, profile reset, and safe-fix guidance | finalize the operator manual surface deferred from `PLN-16` and `OPS-16` | approved |
| Ready For Code | approved | manual-only implementation scope is explicitly approved; out-of-scope runtime and governance changes remain blocked | approved |
| Human sync needed | yes | operator wording changes the shipped human-facing guidance and must not overrule workflow authority | approved |
| Gate profile | contract | reusable manual guidance and root/starter parity are part of the harness contract | approved |
| User-facing impact | medium | non-technical operators will use these sections to decide what to do next | approved |
| Layer classification | core | applies to the reusable standard harness baseline | approved |
| Active profile dependencies | none | no optional profile is active | not-needed |
| Profile evidence status | not-needed | this defines generic profile reset guidance, not profile-specific evidence | not-needed |
| UX archetype status | approved | the existing operator evidence/context manual archetype is sufficient for this human-facing guidance surface | approved |
| UX deviation status | none | no UX archetype deviation exists | not-needed |
| Environment topology status | not-needed | no deploy/cutover topology is changed | not-needed |
| Domain foundation status | not-needed | no data-domain work is included | not-needed |
| Authoritative source intake status | approved | `PLN-15`, approved `PLN-16`, completed `OPS-16`, and closed `PLN-18` define the scope and document boundaries | approved |
| Shared-source wave status | not-needed | this is a single-packet manual finalization lane | not-needed |
| Packet exit gate status | approved | implementation, verification, Tester, and Reviewer evidence are complete for the approved manual-only scope | approved |
| Improvement promotion status | approved | this is an approved follow-up from the resilience/adoption planning wave | approved |
| Existing system dependency | none | no legacy program or DB integration is touched | not-needed |
| New authoritative source impact | analyzed | user selected OPS-17 on 2026-05-14 from the approved follow-up list | analyzed |
| Risk if started now | medium | poor wording could imply unsafe auto-fix or workflow-authority changes | draft |

## Lane-Typed Minimum Contract
- Lane-type declaration:
  planning
- Lane-type universal minimum sections:
  Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger
- Lane-type required sections:
  Detailed Agreement Proposal; Human Sync / Approval Boundary; Manual parity verification; Source trace to `PLN-16`, `OPS-16`, and `PLN-18`
- Lane-type conditional sections:
  Runtime tests are required only if implementation changes scripts, validators, generated-state behavior, or command output.
- Lane-type not-needed sections:
  UX archetype, domain foundation, environment topology, existing DB compatibility, release packaging, and optional profile evidence are not needed unless scope changes.

## 1. Goal
- Give non-technical operators a clear first manual surface for the concepts and decisions most likely to cause bypass or unsafe drift fixes.
- Finalize the profile reset and starter-mode change guidance approved in `PLN-16`.
- Finalize safe-fix guidance after `OPS-16` so operators know which recovery actions are safe and which require explicit state operations or Planner/maintainer review.
- Keep root and `standard-template` manuals synchronized.

## 2. Non-Goal
- Do not implement workflow hard gates. That belongs to `OPS-18_WORKFLOW_GATES_BY_STARTER_MODE`.
- Do not rebalance governance tests. That belongs to `QLT-04_GOVERNANCE_TEST_REBALANCE`.
- Do not define the full multi-model ownership contract. That belongs to `PLN-17_MULTI_MODEL_OWNERSHIP_AND_CONFLICT_CONTRACT`.
- Do not change Node.js runtime support.
- Do not change DB schema, transition logic, Active Context generation, validator behavior, packaging, installer behavior, or product UI.
- Do not make manual wording a source of authority over governance Markdown, workflow files, packet approval state, DB hot-state, generated docs, or Active Context.

## 3. User Problem And Expected Outcome
- Current problem:
  Operators have the structural decisions from `PLN-16`, the recovery behavior from `OPS-16`, and the document-boundary decisions from `PLN-18`, but the final human-facing manual surface is still deferred. This can leave non-technical users unsure about concepts, profile reset, validation meaning, and safe drift repair boundaries.
- Expected outcome:
  The operator can open the manual and quickly understand the basic terms, today's checklist, whether minimal/standard/full-governance applies, how to handle profile or mode mistakes, what validation does not prove, and which fixes are safe.

## 4. In Scope
- Add or update the non-technical concept primer.
- Add or update the Operator One-Page Checklist.
- Add or update validation caveat guidance.
- Add or update "when this harness is too heavy / use minimal mode" guidance.
- Add or update profile reset and starter-mode change playbook.
- Add or update safe-fix allow/deny list based on `OPS-16`.
- Add or update solo-operation disclosure guidance.
- Keep manual wording source-traced to `PLN-15`, approved `PLN-16`, completed `OPS-16`, and closed `PLN-18`.
- Synchronize root and `standard-template` manual surfaces.

## 5. Out Of Scope
- Runtime commands or CLI aliases.
- Validator mutation or gate behavior changes.
- New generated-state behavior.
- New workflow transition enforcement.
- New packet template mechanics.
- Multi-model lock/ownership mechanics.
- Release packaging or installer updates.
- Project-specific business-domain guidance.

## 6. Detailed Behavior
- Trigger:
  Planner opens OPS-17 after user selection from the approved follow-up list.
- Main flow:
  1. Confirm manual target files and source-trace decisions.
  2. Draft operator-facing wording without changing workflow authority.
  3. Preserve root / `standard-template` parity.
  4. Verify manual parity and run harness validation.
  5. Hand off to Tester after implementation completes.
- Alternate flow:
  If wording requires changing runtime behavior, workflow gates, validator behavior, or packet template enforcement, stop and reopen planning or route to the proper follow-up packet.
- Error state:
  If manual guidance contradicts `PLN-16`, `OPS-16`, `PLN-18`, `.agents/rules/HARNESS_OPERATING_CONTRACT.md`, workflow contracts, or truth hierarchy, hold implementation and revise the detailed agreement.
- Loading/transition:
  No loading state applies; this is manual/documentation work.

## 7. Program Function Detail
- Input:
  Approved planning decisions from `PLN-15`, `PLN-16`, completed `OPS-16`, closed `PLN-18`, and the user's 2026-05-14 selection of OPS-17.
- Processing:
  Manual text changes only unless detailed agreement is expanded and approved.
- Output:
  Updated root and `standard-template` manuals plus verification evidence.
- Permissions/conditions:
  Developer may edit manual surfaces only after Ready For Code approval.
- Edge cases:
  If a safe-fix instruction would imply authority-state mutation, the wording must explicitly route to approved transition/state operations or Planner/maintainer reconciliation.

## 8. UI/UX Detailed Design
- Active profile references: none
- Profile composition rationale: not-needed
- Profile-specific UX / operation contract: not-needed
- Primary admin entity / surface: not-needed
- Grid interaction model: not-needed
- Search / filter / sort / pagination behavior: not-needed
- Row action / bulk action rule: not-needed
- Edit / save / confirm / audit pattern: not-needed
- Profile deviation / exception: none
- UX archetype reference: not-needed
- Selected UX archetype: not-needed
- Archetype fit rationale: not-needed
- Archetype deviation / approval: none
- Impacted screen: no product UI screen
- Layout change: manual/document structure only
- Interaction: operator reading/checklist use
- Copy/text: Korean-first, easy terms for human-facing manual sections where consistent with the manual
- Feedback/timing: not-needed
- Source trace fallback: cite `PLN-16` and `OPS-16` decisions instead of inventing new rules

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  The guidance applies to the reusable harness itself, not one optional profile or downstream project.
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `reference/planning/PLN-15_HARNESS_RESILIENCE_COMPATIBILITY_AND_SCALE_FIT_DRAFT.md`; `reference/planning/PLN-16_OPERATOR_ADOPTION_AND_TIERED_GOVERNANCE_CONTRACT_DRAFT.md`; `reference/packets/PKT-01_OPS-16_ACTIVE_CONTEXT_RECOVERY_AND_SAFE_DRIFT_FIX.md`; `reference/planning/PLN-18_PROJECT_SSOT_AND_WORKFLOW_ENTRY_REBASELINE_DRAFT.md`; `reference/manuals/HARNESS_MANUAL.md`; `standard-template/reference/manuals/HARNESS_MANUAL.md`; `.agents/rules/HARNESS_OPERATING_CONTRACT.md`; `.agents/artifacts/REQUIREMENTS.md`; `.agents/artifacts/ARCHITECTURE_GUIDE.md`; `.agents/artifacts/IMPLEMENTATION_PLAN.md`
  - `reference/planning/PLN-15_HARNESS_RESILIENCE_COMPATIBILITY_AND_SCALE_FIT_DRAFT.md`
  - `reference/planning/PLN-16_OPERATOR_ADOPTION_AND_TIERED_GOVERNANCE_CONTRACT_DRAFT.md`
  - `reference/packets/PKT-01_OPS-16_ACTIVE_CONTEXT_RECOVERY_AND_SAFE_DRIFT_FIX.md`
  - `reference/planning/PLN-18_PROJECT_SSOT_AND_WORKFLOW_ENTRY_REBASELINE_DRAFT.md`
  - `reference/manuals/HARNESS_MANUAL.md`
  - `standard-template/reference/manuals/HARNESS_MANUAL.md`
  - `.agents/rules/HARNESS_OPERATING_CONTRACT.md`
  - `.agents/artifacts/REQUIREMENTS.md`
  - `.agents/artifacts/ARCHITECTURE_GUIDE.md` (boundary reference only; not an operating-rule source)
  - `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- Environment topology reference: not-needed
- Source environment: not-needed
- Target environment: not-needed
- Execution target: local repo manual files
- Transfer boundary: not-needed
- Rollback boundary: revert manual/documentation changes before closeout if verification fails
- Domain foundation reference: not-needed
- Schema impact classification: none
- DB / state impact:
  Planner opening updates work-item state through existing state operations; implementation should not change DB schema or runtime state logic.
- Markdown / docs impact:
  Root and `standard-template` manual surfaces are expected to change after Ready For Code.
- Generated docs impact:
  Transition/state generated docs and Active Context may refresh through approved state operations.
- Validator / cutover impact:
  Validator should remain a verification command only for this packet.
- Authoritative source refs:
  - `reference/planning/PLN-15_HARNESS_RESILIENCE_COMPATIBILITY_AND_SCALE_FIT_DRAFT.md`
  - `reference/planning/PLN-16_OPERATOR_ADOPTION_AND_TIERED_GOVERNANCE_CONTRACT_DRAFT.md`
  - `reference/packets/PKT-01_OPS-16_ACTIVE_CONTEXT_RECOVERY_AND_SAFE_DRIFT_FIX.md`
  - `reference/planning/PLN-18_PROJECT_SSOT_AND_WORKFLOW_ENTRY_REBASELINE_DRAFT.md`
  - `.agents/rules/HARNESS_OPERATING_CONTRACT.md`
- Authoritative source intake reference: approved `PLN-15`, approved `PLN-16`, completed `OPS-16`, and closed `PLN-18`; no separate new source intake artifact is required.
- Authoritative source disposition: incorporate the finalized manual guidance from the approved planning and recovery packets while keeping operating-rule authority in `HARNESS_OPERATING_CONTRACT.md`.
- New planning source priority / disposition:
  User selected OPS-17 on 2026-05-14; treat this as lane selection, not Ready For Code approval.
- Existing plan conflict: none identified; `PLN-15` expected OPS-17 to finish the wave after structural/recovery rules.
- Current implementation impact: manual files only unless detailed agreement changes.
- Required rework / defer rationale:
  Workflow gates, governance tests, and multi-model conflict remain deferred to their named packets.
- Impacted packet set scope: single-packet
- Authoritative source wave ledger reference: not-needed
- Source wave packet disposition: not-needed
- Existing program / DB dependency: none
- Product source root: not-needed
- Product test root: not-needed
- Product runtime requirements: not changed
- Harness/product boundary exceptions: none

## 10. Acceptance
- The concept primer clearly states it is explanatory and not workflow authority.
- The Operator One-Page Checklist is present and usable as the first operational screen.
- The checklist includes a reminder not to use full-governance unless risk-triggered or explicitly chosen.
- The checklist includes validation-caveat guidance.
- The checklist includes solo-operation disclosure guidance.
- The profile reset playbook covers before approval, after approval before code, and after implementation starts.
- The profile reset guidance explains that profile describes work pattern and starter mode describes governance strictness.
- The safe-fix guidance lists allowed derived-output fixes and forbidden authority mutations.
- The manual keeps workflow-entry, approval-boundary, packet-before-code, and baton wording aligned with `.agents/rules/HARNESS_OPERATING_CONTRACT.md`.
- The manual does not treat `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `DOMAIN_CONTEXT.md`, `SYSTEM_CONTEXT.md`, or `PROJECT_HISTORY.md` as current execution authority.
- Forbidden automatic mutation of governance Markdown, approval state, lane state, reviewer evidence, migration/cutover decision, rollback decision, and DB hot-state outside approved operations is explicit.
- Root and `standard-template` manual surfaces stay synchronized.

## 11. Open Questions
- Exact section placement inside the existing manual should be chosen after reading the current manual structure.
- Whether the one-page checklist should be inserted near the front of the manual or linked from an existing quick-start section is now an implementation-detail choice inside the approved OPS-17 scope.

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | yes | user/planner | approved | core reusable manual guidance approved |
| Optional profile evidence approval | no | planner | not-needed | no optional profile is active |
| Detailed function agreement | yes | user/planner | approved | exact manual sections and authority boundaries approved before implementation |
| Detailed UI/UX agreement | no | planner | not-needed | no product UI; manual copy only |
| UX archetype / deviation approval | no | planner | not-needed | no product UI surface |
| Environment topology approval | no | planner | not-needed | no deployment/cutover work |
| Domain foundation approval | no | planner | not-needed | no data-domain work |
| DB design confirmation | no | planner | not-needed | no DB schema or data operation change |
| Authoritative source disposition approval | yes | user/planner | approved | incorporate `PLN-16`, `OPS-16`, `PLN-18`, and `HARNESS_OPERATING_CONTRACT` guidance into manuals |
| New source incorporation decision | yes | user/planner | approved | user selected OPS-17 on 2026-05-14, approved the narrowed detailed agreement, and then separately approved Ready For Code |
| Source wave rebaseline approval | no | planner | not-needed | single-packet manual lane |
| Packet exit quality gate approval | yes | reviewer | approved | reviewer-approved after implementation and verification |
| Improvement promotion decision | no | planner | approved | OPS-17 already exists as the approved follow-up item |
| Ready For Code sign-off | yes | user | approved | manual-only implementation scope is explicitly approved |

## 13. Implementation Notes
- Prefer editing existing manual sections over creating duplicate concept sections.
- Keep the language practical and operator-oriented.
- Use Korean-first phrasing for human-facing manual text when consistent with the surrounding manual.
- Avoid implying that validation proves business correctness.
- Avoid implying that generated docs or Active Context are source-of-truth.
- Avoid implying that minimal mode can bypass risk triggers.
- Keep root and `standard-template` manual text synchronized.

## 14. Verification Plan
- Gate profile: contract
- Verification scenario reminder:
  - normal: operator can find glossary/checklist/reset/safe-fix guidance
  - error: forbidden authority mutation is clearly not presented as a safe fix
  - permission: Ready For Code remains required before implementation
  - regression: root and `standard-template` manuals remain synchronized
  - manual check: wording does not override workflow authority
  - evidence location: packet exit quality gate and validation output
- Required commands after implementation:
  - root manual parity check between `reference/manuals/HARNESS_MANUAL.md` and `standard-template/reference/manuals/HARNESS_MANUAL.md`
  - root `node .harness/runtime/state/dev05-cli.js validate`
  - root `node .harness/runtime/state/dev05-cli.js validation-report` if state or generated surfaces refresh

## Verification Manifest
- Gate profile:
  - contract: detailed agreement, Ready For Code, root sync, standard-template sync, targeted manual parity check, root test suite only if runtime behavior changes, starter test suite only if runtime behavior changes, harness validator, active context evidence when state or re-entry context is touched, review closeout
- Required evidence:
  - detailed agreement approval
  - Ready For Code approval
  - root manual update evidence
  - standard-template manual update evidence
  - targeted manual parity check
  - root validator
  - active context evidence if transition/state generated surfaces refresh
  - validation-report if state or generated surfaces refresh
  - Tester verification
  - Reviewer closeout

## 15. Packet Exit Quality Gate
- Packet exit metadata version: v1
- Packet exit metadata gate reference:
  `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata exit recommendation:
  approved
- Packet exit metadata source parity result:
  approved; root and `standard-template` manual surfaces match the approved reusable guidance
- Packet exit metadata validation / security / cleanup evidence:
  root/starter manual parity hash check passed; `validate` passed; `validation-report` passed; no runtime/security delta was requested by this manual-only lane
- Packet exit quality gate reference:
  `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation:
  approved
- Implementation delta summary:
  Added operator-facing glossary and first-check guidance, explicit checklist reminders, profile/starter-mode reset playbook, validation caveat, safe-fix allow/deny guidance, and solo-operation disclosure to the root and `standard-template` manuals without changing workflow or runtime authority.
- Source parity result:
  approved; root and `standard-template` manual surfaces match the approved reusable guidance
- Refactor / residual debt disposition:
  no blocking implementation defect remains in the reviewed `OPS-17` scope; deferred workflow-gate, governance-test, and multi-model follow-up items remain intentionally out of scope.
- UX conformance result:
  not-needed; no product UI
- Topology / schema conformance result:
  not-needed; no deploy, topology, schema, or data operation change
- Validation / security / cleanup evidence:
  root/starter manual parity hash check passed; `validate` passed; `validation-report` passed; no runtime/security delta was requested by this manual-only lane
- Deferred follow-up item:
  `OPS-18_WORKFLOW_GATES_BY_STARTER_MODE`, `QLT-04_GOVERNANCE_TEST_REBALANCE`, `PLN-17_MULTI_MODEL_OWNERSHIP_AND_CONFLICT_CONTRACT`
- Improvement candidate reference:
  `reference/planning/PLN-15_HARNESS_RESILIENCE_COMPATIBILITY_AND_SCALE_FIT_DRAFT.md`
- Proposed target layer:
  core
- Promotion status / linked follow-up item:
  approved / `OPS-17_OPERATOR_GLOSSARY_PROFILE_RESET_AND_SAFE_FIX_GUIDANCE`
- Closeout notes:
  Reviewer approved packet exit after tester re-verification confirmed the checklist reminders, authority-boundary wording, validation caveat, safe-fix allow/deny guidance, and root/starter parity.

## 16. Ready For Code Approval Text
Ready For Code must be separately approved with wording equivalent to:

```text
Ready For Code is approved for OPS-17 only for updating the root and standard-template HARNESS_MANUAL operator guidance with the concept primer, Operator One-Page Checklist, profile/mode reset playbook, validation caveat, solo-operation reminder, and OPS-16 safe-fix allow/deny guidance. Runtime code, workflow gates, validator behavior, DB state logic, packaging, Node.js support, governance test rebalance, and multi-model ownership are out of scope.
```

Ready For Code status:
- approved on 2026-05-14 for the manual-only scope described above.

## 17. Reopen Trigger
- Manual wording needs to change runtime behavior, workflow gates, validator behavior, DB state logic, or generated-state behavior.
- Manual wording contradicts `PLN-16`, `OPS-16`, workflow contracts, or the truth hierarchy.
- Safe-fix guidance would imply authority-state mutation without approved state operation.
- Root and `standard-template` manual surfaces diverge.
- The packet scope expands into `OPS-18`, `QLT-04`, or `PLN-17`.
- The user changes the desired operator wording or approval boundary.
