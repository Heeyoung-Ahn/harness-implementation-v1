# PKT-01 OPS-10 Lane-Typed Packet Minimum Rules And Conditional Approval Surface

## Purpose
- Convert the approved `PLN-12` planning result into a reusable packet/template/validator contract for lane-typed packet minimum rules.
- Preserve approval quality while reducing operator burden for narrow lanes.

## Approval Rule
- This packet is written before implementation.
- This packet stays narrow: it defines reusable lane-typed packet minimum rules and conditional approval-surface treatment instead of redesigning the whole packet template or workflow system.
- This packet must preserve the approved first lane-type set from `PLN-12`.
- This packet must preserve the universal minimum contract across all lane types, including source impact visibility and residual debt disposition.
- This packet must express burden reduction through lane-typed `not-needed` or `conditional` handling, not by deleting reusable contract sections.
- This packet must preserve root / `standard-template` sync and stay inside reusable contract/template/validator scope.
- This template-based packet is a concrete current-contract task packet and must stay registered as category `task_packet`.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-10 lane-typed packet minimum rules and conditional approval surface | `PLN-12` fixed the planning contract, but a concrete follow-up is still needed so the packet burden reduction becomes reusable contract behavior instead of guidance only | draft |
| Ready For Code | approved | implementation must stay inside the approved lane-typed minimum contract, stable declaration field, undeclared full-baseline fallback, and advisory-first validator boundary | approved |
| Human sync needed | yes | the user should confirm the first concrete lane-typed contract boundary before implementation opens | pending |
| Gate profile | contract | this lane changes reusable packet/template/validator behavior and requires root/starter sync plus full verification | draft |
| User-facing impact | none | this lane changes reusable packet/template/validator contract behavior rather than a product-facing UI surface | not-needed |
| Layer classification | core | this changes reusable planning/packet approval expectations | draft |
| Active profile dependencies | none | this is core baseline contract work | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| UX archetype status | not-needed | no product UX archetype decision is required | not-needed |
| UX deviation status | none | no product UI deviation is being approved here | not-needed |
| Environment topology status | not-needed | no deployment/cutover topology change is included | not-needed |
| Domain foundation status | not-needed | no domain-model or schema-impact work is included | not-needed |
| Authoritative source intake status | approved | the approved source is the closed `PLN-12` planning result plus the current reusable packet and validator contracts | approved |
| Shared-source wave status | not-needed | no multi-packet source-wave rebaseline is required | not-needed |
| Packet exit gate status | pending | closeout is not available until the concrete reusable contract boundary and verification direction are approved | pending |
| Improvement promotion status | proposed | this lane promotes the approved `PLN-12` planning guidance into reusable contract behavior | proposed |
| Existing system dependency | none | this is harness-only work | not-needed |
| New authoritative source impact | analyzed | no new external source is entering; the driver is approved internal planning evidence from `PLN-12` | analyzed |
| Risk if started now | medium | broadening this lane into template redesign or workflow redesign would increase regression risk and violate the approved `PLN-12` boundary | draft |

## 1. Why This Packet Exists
- `PLN-12` already fixed the first reusable lane-type set, the universal minimum packet contract, and the rule that packet burden reduction must happen through lane-typed `not-needed` / `conditional` treatment rather than section deletion.
- If those decisions remain planning-only guidance, operators may keep copying the full packet template and the friction reduction will stay advisory instead of reusable contract behavior.
- This packet converts the approved `PLN-12` planning result into a concrete reusable packet/template/validator contract.

## 2. Goal
- Define a reusable lane-typed packet minimum contract.
- Preserve approval quality while reducing operator burden for narrow lanes.
- Keep the result narrow enough that it does not reopen broad packet-template redesign.

## 3. In Scope
- Define lane-type metadata or packet classification surface.
- Define the universal minimum packet section contract for all supported lane types.
- Define lane-type section treatment as `required`, `conditional`, or `not-needed`.
- Update packet-template guidance so authors can follow the lane-typed minimum contract.
- Define how validator behavior should read or diagnose the minimum contract.
- Keep root and `standard-template` synchronized.

## 4. Out Of Scope
- Broad packet-template redesign.
- Hosted CI, workflow automation, or org-specific approval workflow design.
- Release/security policy redesign.
- Removal of human approval boundaries.
- Redesign of `OPS-09` structured closeout metadata.

## 4A. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  narrow follow-up lanes still tend to inherit the full packet burden, so non-specialist operators must read and judge more surface than the lane actually needs.
- 작업 후 사용자가 체감해야 하는 변화:
  packet authors and reviewers should see which sections are `required`, `conditional`, or `not-needed` for a declared lane type while still preserving approval-quality evidence such as source impact and residual debt disposition.

## 4B. UX / Interaction Surface
- Screen / surface type:
  human-facing packet review and AI-facing packet parsing guidance
- Primary operator:
  non-specialist planner/operator working through packet approval
- UX archetype reference: existing operator evidence/context archetype
- Selected UX archetype: not-needed
- Archetype fit rationale:
  this lane changes packet readability and approval burden, but does not introduce a new product UI archetype
- Archetype deviation / approval:
  none
- 영향받는 화면:
  packet markdown, review/approval reading surface, and packet-writing guidance
- 레이아웃 변경:
  lane-type guidance and section-state treatment may change how packet sections are read, but no application UI is redesigned
- interaction:
  operator reads lane-type minimum rules and decides approval boundaries
- copy/text:
  packet sections must stay explicit about `required`, `conditional`, and `not-needed`
- feedback/timing:
  visible at packet-authoring and packet-review time
- source trace fallback:
  packet, validation report, and active context remain the trace sources

## 4C. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  reusable packet minimum rules, template guidance, and validator-readable contract behavior belong in core
- Active profile dependencies:
  none
- Profile-specific evidence status:
  not-needed
- Source spreadsheet artifact:
  not-needed
- Workbook / sheet / tab / range trace:
  not-needed
- Header / column mapping:
  not-needed
- Row key / record identity rule:
  not-needed
- Source snapshot / version:
  current reusable baseline after `OPS-09` and approved `PLN-12`
- Transformation / normalization assumptions:
  full packet burden becomes lane-typed reusable contract treatment rather than implicit operator judgment
- Reconciliation / overwrite rule:
  root and `standard-template` packet/template/validator behavior must stay equivalent
- Transfer package / bundle artifact:
  not-needed
- Transfer medium / handoff channel:
  not-needed
- Checksum / integrity evidence:
  not-needed
- Offline dependency bundle status:
  not-needed
- Ingress verification / import step:
  not-needed
- Rollback package / recovery bundle:
  not-needed
- Manual custody / operator handoff:
  not-needed
- Required reading before code: `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/planning/PLN-12_LANE_TYPED_PACKET_MINIMUMS_AND_APPROVAL_SURFACE_REDUCTION_DRAFT.md`, `reference/packets/PKT-01_OPS-09_STRUCTURED_PACKET_EXIT_METADATA_AND_CLOSEOUT_PARSER_HARDENING.md`, `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`, `.harness/runtime/state/drift-validator.js`
- Security review evidence status:
  not-needed
- Environment topology reference:
  not-needed
- Source environment:
  maintainer repo and copied starter governance surfaces
- Target environment:
  local packet/template/validator contract surfaces
- Execution target:
  node runtime inside the harness repo and copied starter
- Transfer boundary:
  none
- Rollback boundary:
  revert the narrow lane-typed contract changes if packet validation evidence regresses
- Domain foundation reference:
  not-needed
- Schema impact classification:
  none
- DB / state 영향:
  work item state, validation report, active context, and generated docs may change
- Markdown / docs 영향:
  packet template guidance and contract packet wording may change
- generated docs 영향:
  `ACTIVE_CONTEXT` and validation-report next-action/evidence summaries may change
- validator / cutover 영향:
  validator may gain diagnostic or advisory reading of lane-typed packet minimum contracts; cutover semantics stay out of scope
- Authoritative source refs:
  `reference/planning/PLN-12_LANE_TYPED_PACKET_MINIMUMS_AND_APPROVAL_SURFACE_REDUCTION_DRAFT.md`; `reference/packets/PKT-01_OPS-09_STRUCTURED_PACKET_EXIT_METADATA_AND_CLOSEOUT_PARSER_HARDENING.md`; `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- Authoritative source intake reference: `reference/planning/PLN-12_LANE_TYPED_PACKET_MINIMUMS_AND_APPROVAL_SURFACE_REDUCTION_DRAFT.md`, `reference/packets/PKT-01_OPS-09_STRUCTURED_PACKET_EXIT_METADATA_AND_CLOSEOUT_PARSER_HARDENING.md`, `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- Authoritative source disposition: approved planning contract from `PLN-12`, approved closeout-friction baseline from `OPS-09`, and current reusable packet contract from `PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- New planning source priority / disposition:
  none
- Existing plan conflict: the reusable baseline still pushes full packet burden onto narrow lanes; this packet resolves that conflict without reopening broad packet-template redesign
- Current implementation impact: reusable packet guidance, validator-readable contract behavior, targeted tests, and starter synchronization
- Required rework / defer rationale: defer broad template redesign, workflow automation, and policy-program changes to later lanes
- Impacted packet set scope: future packets that declare one of the approved lane types and need explicit minimum section treatment
- Authoritative source wave ledger reference:
  not-needed
- Source wave packet disposition:
  not-needed
- Existing program / DB dependency:
  none
- Existing schema source artifact:
  not-needed
- Table / column naming compatibility:
  not-needed
- Data operation / ownership compatibility:
  not-needed
- Migration / rollback / cutover compatibility:
  no schema/data migration included

## 5. Approved Planning Inputs
- `reference/planning/PLN-12_LANE_TYPED_PACKET_MINIMUMS_AND_APPROVAL_SURFACE_REDUCTION_DRAFT.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- `reference/packets/PKT-01_OPS-09_STRUCTURED_PACKET_EXIT_METADATA_AND_CLOSEOUT_PARSER_HARDENING.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`

## 6. Fixed Planning Contract From PLN-12
- First lane-type set:
  - `planning`
  - `narrow-runtime`
  - `validation-review`
  - `release-security`
- Universal minimum contract across all lane types:
  - purpose / goal
  - scope and non-goal
  - explicit boundary / out-of-scope wording
  - source impact visibility
  - verification requirements
  - residual debt disposition
  - packet exit quality gate reference
  - validator-critical source/evidence trace where applicable
  - reopen trigger
- Reduction method:
  - reusable sections must not be deleted
  - burden reduction must be expressed as lane-typed `not-needed` or `conditional` treatment

## 7. Proposed Detailed Agreement
- `OPS-10` should implement the smallest reusable contract that makes `PLN-12` decisions operational.
- The first implementation should prefer guidance plus validator-readable structure over aggressive enforcement.
- The lane should keep packet readability for non-specialist operators while making the lane-type rules explicit enough that root and `standard-template` stay aligned.
- The first implementation should allow at least diagnostic or advisory validator behavior even if strict enforcement is deferred.
- Lane-type declaration rule:
  each packet may declare exactly one supported lane type using a stable packet metadata field.
- Allowed lane types:
  - `planning`
  - `narrow-runtime`
  - `validation-review`
  - `release-security`
- If no lane type is declared, the packet must fall back to the current full packet baseline rather than silently applying a reduced minimum.
- Validator behavior rule:
  the first implementation should provide advisory or diagnostic validation for lane-typed minimum rules.
- It must not hard-fail packets solely because a conditional section is absent unless the packet declares an unsupported lane type, malformed lane metadata, or violates the universal minimum contract.

## 8. Proposed Implementation Boundary
- Include:
  - one stable lane-type declaration field
  - universal minimum section map
  - lane-type section matrix using `required`, `conditional`, `not-needed`
  - template guidance changes
  - validator advisory-first reading of the new contract
  - root / `standard-template` sync
  - targeted regressions
- Exclude:
  - large template UX rewrite
  - removal of existing approval stages
  - broad validator cleanup unrelated to lane-typed packet minimums
  - new runtime workflow classes beyond the approved first lane-type set

## 9. Proposed Operator Outcome
- A non-specialist operator should be able to open a packet and immediately see which sections are required for that lane type.
- Operators should see `not-needed` and `conditional` states explicitly instead of guessing whether a missing section is acceptable.
- Reviewers and testers should still see source impact, verification, and residual debt without having to reconstruct them from free-form notes.

## 10. Verification Direction
- targeted regression for lane-type metadata parsing
- targeted regression for undeclared packets falling back to the full baseline
- targeted regression for universal minimum contract presence
- targeted regression for `required` / `conditional` / `not-needed` treatment rendering
- targeted regression for advisory-first validator behavior
- targeted regression for root / `standard-template` parity
- root `node --test .harness/test/*.test.js`
- `standard-template` `node --test .harness/test/*.test.js`
- root `node .harness/runtime/state/dev05-cli.js validate`
- root `node .harness/runtime/state/dev05-cli.js validation-report`
- root `node .harness/runtime/state/dev05-cli.js context`

## Verification Manifest
- Gate profile:
  contract
- Verification manifest:
  - contract: detailed agreement, Ready For Code, root sync, standard-template sync, targeted tests, root test suite, starter test suite, validator, active-context evidence when re-entry state is affected, review closeout
  - targeted regression for lane-type metadata parsing
  - targeted regression for undeclared packets falling back to the full baseline
  - targeted regression for universal minimum contract presence
  - targeted regression for `required` / `conditional` / `not-needed` treatment rendering
  - targeted regression for advisory-first validator behavior
  - targeted regression for root / `standard-template` parity
  - root `node --test .harness/test/*.test.js`
  - `standard-template` `node --test .harness/test/*.test.js`
  - root `node .harness/runtime/state/dev05-cli.js validate`
  - root `node .harness/runtime/state/dev05-cli.js validation-report`
  - root active context: `node .harness/runtime/state/dev05-cli.js context`

## 11. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Open `OPS-10` as the follow-up contract packet | yes | user/planner | closed | opened after approved `PLN-12` planning closeout recommendation |
| Detailed agreement | yes | user/planner | approved | approve with minor adjustment; stable lane-type declaration field and advisory-first validator behavior were fixed before implementation |
| Ready For Code | yes | user | approved | implementation remains blocked outside the approved concrete contract boundary |

## 12. Current Planning Decision
- Detailed agreement: approved
- Ready For Code: approved
- Remaining planner action before implementation opens:
  transition `OPS-10` to `Developer` and keep implementation inside the approved lane-typed contract boundary.

## 13. Implementation Notes
- Keep the lane-type declaration surface explicit and stable instead of inferring reduced minimums from lane names or gate profiles.
- Preserve the current full packet baseline for undeclared packets so legacy packets do not silently shrink.
- Keep validator behavior advisory-first for lane-typed minimums while retaining hard-fail for unsupported lane types, malformed declarations, and universal minimum violations.

## 13A. Detailed Agreement Close Condition
- This packet is ready for user `detailed agreement` approval when the user can answer yes to all of these:
- the lane should convert `PLN-12` guidance into reusable packet/template/validator contract behavior
- the first lane-type set should stay limited to `planning`, `narrow-runtime`, `validation-review`, and `release-security`
- universal minimums must keep source impact visibility and residual debt disposition
- burden reduction should happen through `required`, `conditional`, and `not-needed` treatment instead of deleting reusable sections

## 13B. Current Planning Decision
- Detailed agreement: approved
- Ready For Code: approved
- Planning boundary preserved:
  implementation stayed inside stable lane-type declaration, undeclared full-baseline fallback, advisory-first validator behavior, template guidance updates, and root / `standard-template` synchronization.

## 14. Verification Plan
- The contract gate is carried by `## Verification Manifest` above.

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference:
  `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata version:
  v1
- Packet exit metadata gate reference:
  `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata exit recommendation:
  approved
- Packet exit metadata source parity result:
  aligned
- Packet exit metadata validation / security / cleanup evidence:
  root `node --test .harness/test/*.test.js`: 69/69 pass; `standard-template` `node --test .harness/test/*.test.js`: 69/69 pass; root `validate`, `validation-report`, and `context`: pass
- Exit recommendation:
  approved
- Implementation delta summary:
  Added a stable lane-type declaration field, explicit universal minimum and section-matrix metadata, undeclared full-baseline fallback, and advisory-first validator handling for lane-typed packet minimum rules.
- Source parity result:
  aligned across root and `standard-template` for validator logic, packet template guidance, and lane-type regression fixtures.
- Refactor / residual debt disposition:
  No blocking residual defect remains inside the approved narrow scope; broad packet-template redesign and lane-set expansion remain intentionally deferred beyond `OPS-10`.
- UX conformance result:
  not-needed unless future packet authoring guidance introduces a product-facing surface
- Topology / schema conformance result:
  not-needed
- Validation / security / cleanup evidence:
  root full harness suite: 69/69 pass; `standard-template` full harness suite: 69/69 pass; root `validate`: pass; root `validation-report`: pass; root `context`: pass
- Deferred follow-up item:
  none inside the approved `OPS-10` boundary; broader process-friction planning remains separate from this closed concrete contract lane
- Improvement candidate reference:
  reusable promotion of lane-typed packet minimum rules into the core packet/template/validator contract
- Proposed target layer:
  core
- Promotion status / linked follow-up item:
  approved / `OPS-10`
- Closeout notes:
  Reviewer found no blocking defect. The lane-type declaration surface, undeclared fallback, advisory-first validator behavior, and root/starter synchronization all stayed inside the approved `PLN-12`-derived scope.

## 16. Reopen Trigger
- 아래 상황이 생기면 packet을 다시 연다.
- undeclared packets가 full baseline이 아니라 implicit reduced minimum을 받기 시작함
- supported lane-type set이 approval 없이 확장되거나 lane-type declaration parsing이 ambiguous해짐
- advisory-first validator behavior가 conditional section absence만으로 hard-fail 하게 바뀜
- root와 `standard-template` lane-typed packet minimum behavior가 달라짐
