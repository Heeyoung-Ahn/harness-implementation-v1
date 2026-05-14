# PKT-01 OPS-19 Planner Packet Opening Fast Path

## Purpose
- Fix the packet-opening latency exposed while opening `OPS-17`.
- Define a fast, deterministic Planner path for creating a concrete packet, registering it, opening the work item, refreshing derived state, and validating without iterative hold/retry cycles.
- Prevent the same packet-registration and manifest-marker mistakes from recurring.

## Approval Rule
- This packet starts in Planner workflow.
- This packet does not approve implementation until detailed agreement and `Ready For Code` are explicitly approved.
- This packet may change planner guidance, packet skeletons, or a narrow helper only after approval.
- It must not reopen the OPS-17 operator-manual scope.

## Detailed Agreement Proposal
- Choose a small planner-only helper script, not checklist-only guidance, as the first implementation direction.
- Reason:
  - the observed failures were deterministic registration/manifest/freshness mistakes that the harness already knows how to validate
  - a checklist lowers ambiguity but still leaves the same machine-checkable steps manual
  - the smallest durable fix is to preflight and apply those steps once through an existing state-operation path
- Helper scope:
  - input: existing packet path, work item id, title, gate profile, owner, next action, and optional focus/summary text
  - preflight: verify packet file exists, confirm task-packet registration target, check required Quick Decision Header rows, check the verification-manifest section, and verify gate-profile markers before any transition apply
  - state actions: register/update `artifact_index`, upsert `work_item_registry`, then call existing transition/state refresh once
  - verification: run validator/validation-report as part of the same flow and fail the command if the handoff is not clean
  - output: pass/hold summary with exact next action and source paths
- Helper non-scope:
  - no packet content generation beyond optional future stub work
  - no DB schema change
  - no governance Markdown mutation outside the target packet and existing canonical state updates already performed by approved transition logic
  - no Ready For Code bypass
- Placement recommendation:
  - use a planner-only script layered on the existing state tooling rather than adding a new general operator command surface
  - reuse existing transition/store/validation functions instead of introducing a second state mutation path
- Approval boundary:
  - this proposal recommends helper script over checklist-only, but implementation remains blocked until separate `Ready For Code` approval

## Detailed Agreement Approval Text
Detailed agreement is approved for OPS-19 with the following closed decisions:
- first implementation direction: planner-only helper script, not checklist-only
- helper responsibility: preflight packet metadata, register artifact/work item, apply transition once, refresh derived state, and fail if validation is not clean
- state boundary: existing store APIs and transition flow only; no DB schema change
- workflow boundary: no Ready For Code bypass and no new general operator workflow gate surface
- scope boundary: OPS-17 content, broader workflow hard gates, governance test rebalance, and multi-model ownership remain out of scope
- implementation remains blocked until separate `Ready For Code` approval

## Detailed Agreement Approval Decision
- User approved the OPS-19 detailed agreement on 2026-05-14.
- This approval covers the planner-only helper direction, bounded helper scope, reuse of existing state operations, and the explicit non-scope boundaries in this packet.
- This approval does not authorize implementation.
- `Ready For Code` remains blocked until separately approved.

## Ready For Code Approval Decision
- User approved Ready For Code for OPS-19 on 2026-05-14.
- Implementation is limited to a small planner-only helper script that:
  - preflights packet metadata and gate-profile markers
  - registers the task packet in `artifact_index`
  - registers or updates `work_item_registry`
  - applies the existing Planner transition flow once
  - refreshes derived state through the current transition/validation path
  - fails when validation is not clean
- Implementation must stop and return to Planner if it needs DB schema changes, governance Markdown auto-mutation outside approved state updates, Ready For Code bypass, broad workflow gate changes, packet text generation, or scope outside OPS-19.

## Cause Analysis
- The packet-opening path was too manual: packet file creation, `artifact_index` registration, `work_item_registry` registration, transition apply, generated-state refresh, and validation were handled as separate steps.
- Required packet metadata was discovered by validation after the fact instead of being guaranteed by the packet-opening skeleton.
- The first OPS-17 transition was applied before artifact registration and complete contract manifest markers, which caused a validation hold and a second transition.
- Too much context was reread for packet opening. The needed source set was smaller: Active Context, planner workflow, current state/task list, PLN-16/OPS-16 source facts, and the target manual files.
- Windows sandbox permission failures added overhead, but the main failure was procedural: there is no one-pass "open packet cleanly" path.

## Proposed Alternative
- Add a Planner packet-opening fast path with a small planner-only helper:
  1. choose packet id/title/source basis
  2. confirm the packet already contains the gate-profile-aware required labels and manifest markers
  3. register `artifact_index` as `task_packet`
  4. upsert `work_item_registry`
  5. apply Planner transition once
  6. run validation once
  7. report pass/hold with exact next action
- Target outcome: a normal follow-up packet opens in one clean pass, with no validation hold caused by missing registration or manifest markers.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-19 Planner packet opening fast path | opening OPS-17 took 9m34s and required avoidable validation repair | draft |
| Ready For Code | approved | bounded planner-only helper implementation is approved as the next implementation step | approved |
| Human sync needed | yes | this changes Planner operating discipline and adds a bounded helper script path | approved |
| Gate profile | contract | affects reusable planning/packet workflow and validation-facing packet metadata | draft |
| User-facing impact | medium | operators experience packet opening as the first workflow step | draft |
| Layer classification | core | applies to the reusable harness workflow | draft |
| Active profile dependencies | none | no optional profile is active | not-needed |
| Profile evidence status | not-needed | no profile-specific evidence required | not-needed |
| UX archetype status | approved | existing operator evidence/context CLI archetype is sufficient for this planner helper surface | approved |
| UX deviation status | none | no product UX deviation | not-needed |
| Environment topology status | not-needed | no deploy/cutover topology | not-needed |
| Domain foundation status | not-needed | no data-domain work | not-needed |
| Authoritative source intake status | approved | source is the observed OPS-17 opening failure and existing planner/packet contracts | approved |
| Shared-source wave status | not-needed | single-packet process improvement | not-needed |
| Packet exit gate status | approved | implementation, tester verification, and reviewer closeout are complete | approved |
| Improvement promotion status | proposed | promote the observed opening-latency friction to a concrete follow-up | proposed |
| Existing system dependency | none | no legacy system dependency | not-needed |
| New authoritative source impact | analyzed | user directed immediate cause analysis and next-work registration on 2026-05-14 | analyzed |
| Risk if started now | medium | helper scope must stay inside existing state operations and must fail before any unsafe handoff claim | draft |

## Lane-Typed Minimum Contract
- Lane-type declaration:
  planning
- Lane-type universal minimum sections:
  Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger
- Lane-type required sections:
  Cause Analysis; Proposed Alternative; Human Sync / Approval Boundary; Verification Manifest
- Lane-type conditional sections:
  Runtime tests are required only if helper/tooling code changes.
- Lane-type not-needed sections:
  UX archetype, domain foundation, environment topology, existing DB compatibility, release packaging, and optional profile evidence are not needed unless scope changes.

## 1. Goal
- Reduce Planner packet-opening time and remove avoidable validation repair loops.
- Make missing `artifact_index` registration and missing gate-profile manifest markers impossible or immediately caught before transition apply.
- Preserve packet-before-code and explicit Ready For Code approval.

## 2. Non-Goal
- Do not implement OPS-17 manual guidance here.
- Do not weaken packet evidence requirements.
- Do not bypass validation.
- Do not add broad auto-mutation of governance Markdown or DB state.
- Do not change workflow gates, Tester/Reviewer boundaries, release packaging, or Node.js support.

## 3. User Problem And Expected Outcome
- Current problem:
  A routine Planner packet opening took 9m34s and required avoidable validation repair.
- Expected outcome:
  Planner can open the next concrete packet with a short, repeatable fast path and clean validation on the first attempt.

## 4. In Scope
- Define the fast path contract.
- Decide the first implementation direction for the fast path.
- Add helper preflight requirements for gate-profile packet opening.
- Include validation expectations that catch registration/manifest issues before handoff.
- Add or refine the minimal packet-opening checklist only as supporting documentation if the helper needs operator guidance.

## 5. Out Of Scope
- OPS-17 content implementation.
- Full workflow hard gates.
- Full governance test rebalance.
- Multi-model ownership contract.
- Any unsafe automatic state correction.
- Full packet text generation.

## 6. Detailed Behavior
- Trigger:
  Planner opens a new concrete follow-up packet from no-active-lane or from user-selected next work.
- Main flow:
  1. Planner drafts the packet content manually.
  2. The helper preflights the packet for required labels and gate-profile markers.
  3. The helper registers the packet in `artifact_index`.
  4. The helper registers/updates the work item.
  5. The helper applies the Planner transition once through existing tooling.
  6. The helper runs validation once.
  7. The helper reports clean next workflow or exact hold reason.
- Error state:
  Missing registration target, missing required labels, missing manifest markers, or freshness drift must stop before a clean handoff is claimed.

## 7. Program Function Detail
- Input:
  packet id, title, source refs, gate profile, owner, next action.
- Processing:
  one-pass packet opening contract through a planner-only helper after approval.
- Output:
  registered packet, registered work item, fresh Active Context/generated docs, clean validation report.
- Edge case:
  If validation fails after transition apply, report the handoff as not clean and reconcile immediately before proceeding.

## 8. UI/UX Detailed Design
- UX archetype reference: existing operator evidence/context CLI archetype used by reusable harness planning and state commands
- Selected UX archetype: operator evidence/context CLI helper surface
- Impacted screen: no product UI
- Copy/text: operator-facing Planner closeout wording only if documentation is changed

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale: packet opening is reusable harness workflow behavior.
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `.agents/workflows/plan.md`; `.agents/artifacts/CURRENT_STATE.md`; `.agents/artifacts/TASK_LIST.md`; `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`; `.harness/runtime/state/dev05-tooling.js`; `.harness/runtime/state/operating-state-store.js`; `.harness/runtime/state/drift-validator.js`
- Environment topology reference: not-needed
- Domain foundation reference: not-needed
- Schema impact classification: none
- DB / state impact: may use existing approved state operations; no schema change is approved
- Markdown / docs impact: possible planner guidance or packet helper usage note update after approval
- generated docs impact: generated docs and Active Context refresh through existing state operation
- validator / cutover impact: validation should catch packet-opening contract failures before handoff
- Authoritative source refs: user 2026-05-14 direction; observed OPS-17 opening friction; existing packet template and planner workflow
- Authoritative source intake reference: user 2026-05-14 direction and local OPS-17 transition/validation evidence
- Authoritative source disposition: promote the opening-latency friction into this concrete follow-up packet
- Existing plan conflict: none identified; this is a narrow process-friction follow-up
- Current implementation impact: planner guidance and a narrow planner-only helper script only after approval
- Impacted packet set scope: single-packet
- Existing program / DB dependency: none

## 10. Acceptance
- The root cause of the OPS-17 opening delay is recorded.
- A one-pass packet opening fast path is defined.
- Checklist-only is explicitly rejected as the primary fix.
- A planner-only helper script is selected as the primary implementation direction.
- The path prevents missing `artifact_index` registration before clean handoff.
- The path prevents missing contract manifest markers before clean handoff.
- The path preserves explicit Ready For Code approval before implementation.
- Validation passes after opening this packet.

## 11. Open Questions
- Should the helper live as a dedicated planner-only script or as a bounded subcommand that still remains planner-only by convention?
- Should the helper only preflight/register/open, or should it also scaffold the initial packet file in a later follow-up?

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Detailed agreement | yes | user/planner | approved | user approved the planner-only helper direction and bounded scope on 2026-05-14 |
| Ready For Code sign-off | yes | user | approved | user approved Ready For Code on 2026-05-14 for the bounded planner-only helper scope |
| DB/state mutation boundary | yes | user/planner | pending | no schema change or unsafe authority mutation is approved |
| Packet exit quality gate approval | yes | reviewer | approved | reviewer closeout approved on 2026-05-14 |

## 13. Implementation Notes
- Prefer the smallest fix that prevents the observed delay.
- Checklist-only should remain a fallback note, not the primary fix.
- If helper tooling is approved, it must use existing state operations and fail before claiming a clean handoff.
- Reuse `runTransition`, existing store upserts, and existing validation writing rather than duplicating state refresh logic.

## 14. Verification Plan
- Gate profile: contract
- Verification scenario reminder:
  - normal: a packet can be opened in one clean pass
  - error: missing registration/manifest marker is caught before clean handoff
  - regression: existing transition validation still works
  - manual check: no Ready For Code bypass is introduced

## Verification Manifest
- Gate profile:
  - contract: detailed agreement, Ready For Code, root sync, standard-template sync if reusable tooling changes, targeted packet-opening regression or manual dry run, root test suite if runtime behavior changes, starter test suite if runtime behavior changes, harness validator, active context evidence when state or re-entry context is touched, review closeout
- Required evidence:
  - cause analysis
  - detailed agreement approval
  - Ready For Code approval
  - targeted packet-opening check
  - root validator
  - standard-template sync check if reusable tooling changes
  - active context evidence after transition/state refresh
  - validation report
  - Tester verification
  - Reviewer review closeout

## 15. Packet Exit Quality Gate
- Packet exit metadata version: v1
- Packet exit metadata gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata exit recommendation: approve
- Packet exit metadata source parity result: aligned; approved packet scope matches runtime and root/starter test evidence
- Packet exit metadata validation / security / cleanup evidence: root targeted helper tests pass; root full harness suite passes; standard-template full harness suite passes; validator and validation-report pass; standalone entrypoint fails safely before mutation on missing inputs
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: approve
- Implementation delta summary: added planner-only packet-opening helper preflight/apply path, standalone entrypoint, and mirrored root/starter regression coverage
- Source parity result: aligned; approved packet scope matches runtime and root/starter test evidence
- Refactor / residual debt disposition: none in reviewed OPS-19 scope
- UX conformance result: not-needed
- Topology / schema conformance result: not-needed
- Validation / security / cleanup evidence: root targeted helper tests pass; root full harness suite passes; standard-template full harness suite passes; validator and validation-report pass; standalone entrypoint fails safely before mutation on missing inputs
- Deferred follow-up item: OPS-17 remains open for operator manual guidance after this fast-path decision closes
- Improvement candidate reference: observed OPS-17 opening latency
- Proposed target layer: core
- Promotion status / linked follow-up item: proposed / OPS-19
- Closeout notes: reviewer approved OPS-19 closeout on 2026-05-14; return to OPS-17 planning after planner records closeout

## 16. Ready For Code Approval Text
Ready For Code must be separately approved with wording equivalent to:

```text
Ready For Code is approved for OPS-19 only for implementing a small planner-only helper script that preflights packet metadata, registers the task packet and work item, applies the existing Planner transition once, refreshes derived state through the current flow, and fails when validation is not clean. OPS-17 manual content, workflow hard gates, governance test rebalance, multi-model ownership, release packaging, packet text generation, and DB schema changes are out of scope.
```

Ready For Code status:
- approved by user on 2026-05-14 for the bounded planner-only helper scope.

## 17. Reopen Trigger
- The fix requires DB schema changes.
- The fix would bypass Ready For Code.
- The fix would mutate governance Markdown truth automatically.
- The fix expands into workflow hard gates, governance test rebalance, or multi-model ownership.
- Validation cannot catch the packet-opening failure modes deterministically.
