# PKT-01 OPS-09 Structured Packet Exit Metadata And Closeout Parser Hardening

## Purpose
This packet reduces closeout holds caused by packet prose and format drift by moving validator-critical packet-exit semantics toward structured, parse-stable surfaces.

## Approval Rule
- This packet is written before implementation.
- This packet stays narrow: it hardens packet-exit metadata and closeout parsing instead of redesigning the whole packet template or planning workflow.
- This packet must preserve local-first governance and must not require hosted CI, remote orchestration, or external workflow services.
- This packet must preserve root / `standard-template` sync and keep the resulting closeout behavior reusable outside one maintainer-only packet.
- This packet must not broaden into lane-typed packet minimum redesign; that remains parked for `PLN-12`.
- This template-based packet is a concrete current-contract task packet and must stay registered as category `task_packet`.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-09 structured packet-exit metadata and closeout parser hardening | recent closeouts still show temporary holds when validator-critical packet-exit meaning depends on prose formatting instead of a stable parse surface | draft |
| Ready For Code | approved | implementation must stay inside structured packet-exit metadata and parser hardening only | approved |
| Human sync needed | yes | the user should confirm that this lane reduces closeout friction without reopening broad packet/process redesign | pending |
| Gate profile | contract | the lane changes reusable packet/validator closeout semantics and requires root/starter sync plus full verification | draft |
| User-facing impact | none | this lane changes reusable closeout parsing and approval semantics only | not-needed |
| Layer classification | core | this changes reusable governance/validator packet-closeout contracts | draft |
| Active profile dependencies | none | this is core reusable infrastructure | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| UX archetype status | not-needed | no product UX archetype decision is required | not-needed |
| UX deviation status | none | no product UI deviation is being approved here | not-needed |
| Environment topology status | not-needed | no deployment/cutover topology change is included | not-needed |
| Domain foundation status | not-needed | no domain-model or schema-impact work is included | not-needed |
| Authoritative source intake status | approved | approved inputs are the closed `OPS-07`, `OPS-08`, and `QLT-03` closeout observations plus current validator/parser behavior | approved |
| Shared-source wave status | not-needed | no multi-packet source-wave rebaseline is required | not-needed |
| Packet exit gate status | pending | closeout is not available until the structured metadata direction and acceptance boundary are verified | pending |
| Improvement promotion status | proposed | this lane promotes packet-exit semantics from prose-sensitive conventions into reusable structured closeout metadata | proposed |
| Existing system dependency | none | this is harness-only work | not-needed |
| New authoritative source impact | analyzed | no new external planning source is entering; the driver is reusable closeout-friction analysis after phase-1 closeouts | analyzed |
| Risk if started now | medium | broadening this lane into full packet-template redesign would mix parser hardening with operator-UX redesign and increase regression risk | draft |

## 1. Goal
- Keep the current packet-exit quality gate semantics.
- Reduce temporary validation holds caused by packet prose/format sensitivity in closeout-critical fields.
- Move validator-critical packet-exit meaning toward structured, parse-stable metadata that root and `standard-template` can share.

## 2. Non-Goal
- Do not redesign the whole packet template in this lane.
- Do not reduce packet burden by lane type here; that remains the parked `PLN-12` follow-up.
- Do not broaden into hosted CI, PR checks, or review-process automation.
- Do not replace human reviewer approval with automatic packet-exit approval.

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  packet closeout는 이미 좁은 lane으로 운영되고 있지만, validator가 읽는 packet-exit 의미가 prose/format에 민감해서 실제 구현 문제가 없는데도 temporary hold가 날 수 있다.
- 작업 후 사용자가 체감해야 하는 변화:
  closeout-critical packet-exit fields는 더 구조적이고 parse-stable한 surface로 읽히고, reviewer closeout에서 wording drift 때문에 막히는 일이 줄어든다.

## 4. In Scope
- packet-exit quality gate에서 validator가 읽는 closeout-critical fields를 structured metadata 쪽으로 이동 또는 병행
- closeout parser를 prose drift에 덜 민감하게 harden
- root / `standard-template` packet/template/validator synchronization
- closeout-related regression coverage 추가

## 5. Out Of Scope
- lane-typed packet minimum redesign
- broad packet-template UX rewrite
- hosted CI, PR checks, remote eval orchestration
- generic workflow-authoring framework
- unrelated validator cleanup

## 5A. Proposed Detailed Agreement
- This lane should keep the existing packet-exit quality gate semantics, but stop depending on fragile prose formatting for validator-critical closeout meaning.
- This lane should introduce a structured, parse-stable packet-exit metadata surface that root and `standard-template` can share.
- This lane should preserve the current human-readable packet closeout section rather than replacing it with machine-only metadata.
- This lane should stay narrow:
  - no lane-typed packet redesign
  - no broad planning UX rewrite
  - no hosted CI or review automation
  - no unrelated validator refactor

## 5B. Proposed Implementation Boundary
- Metadata rule:
  define one structured packet-exit metadata surface for validator-critical closeout semantics.
- Parser rule:
  validator should prefer the structured surface and reduce false holds caused by closeout prose drift.
- Human-readable rule:
  packet `## 15. Packet Exit Quality Gate` remains readable and review-friendly, even if validator-critical meaning no longer depends on exact prose.
- Verification boundary:
  root and `standard-template` must stay synchronized, and previously approved closeout packets should remain regression-compatible.

## 5C. Proposed Operator Outcome
- Reviewer can still read packet exit notes in natural language.
- Validator can rely on a more structured closeout signal instead of fragile line wording.
- Planner and non-specialist operators should see fewer false holds caused by packet closeout prose formatting.

## 6. Detailed Behavior
- Trigger:
  packet closeout validation runs for a packet under reviewer/planner closeout flow.
- Main flow:
  validator reads the structured packet-exit metadata surface for critical closeout semantics, while the human packet section remains as reviewer-facing explanation.
- Alternate flow:
  legacy closeout packets without the new metadata should remain readable and either stay compatible or fail in a clearly diagnosed way rather than through ambiguous prose parsing.
- Empty state:
  packets that have not reached closeout should still show pending packet-exit state without implying approval.

## 7. Program Function Detail
- Candidate location:
  `.harness/runtime/state/drift-validator.js`
- Supporting location:
  `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- Possible re-entry surface impact:
  `.agents/artifacts/VALIDATION_REPORT.json`
- Expected reusable change:
  closeout-critical parsing shifts from prose-sensitive lines toward structured packet-exit metadata.

## 8. UI/UX Detailed Design
- Product UI change는 없다.
- Human-visible packet exit section remains in the packet itself.
- 목표는 reviewer/operator readability를 유지하면서 validator-critical meaning만 more structured하게 만드는 것이다.

## 9. Data / Source Impact
- Layer classification: core
- Required reading before code: `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/planning/PLN-11_POST_OPS07_RUNTIME_GENERALIZATION_AND_PROCESS_FRICTION_REDUCTION_DRAFT.md`, `reference/packets/PKT-01_OPS-07_PLANNER_HOLD_CLOSEOUT_AUTOMATION.md`, `reference/packets/PKT-01_OPS-08_REUSABLE_SECURITY_REVIEW_EVIDENCE_GENERALIZATION.md`, `reference/packets/PKT-01_QLT-03_SEMANTIC_TRACE_AND_EVIDENCE_GATE_GENERALIZATION.md`, `.harness/runtime/state/drift-validator.js`, `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- Canonical sources:
  - `reference/planning/PLN-11_POST_OPS07_RUNTIME_GENERALIZATION_AND_PROCESS_FRICTION_REDUCTION_DRAFT.md`
  - `reference/packets/PKT-01_OPS-07_PLANNER_HOLD_CLOSEOUT_AUTOMATION.md`
  - `reference/packets/PKT-01_OPS-08_REUSABLE_SECURITY_REVIEW_EVIDENCE_GENERALIZATION.md`
  - `reference/packets/PKT-01_QLT-03_SEMANTIC_TRACE_AND_EVIDENCE_GATE_GENERALIZATION.md`
  - `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- Runtime / validator sources:
  - `.harness/runtime/state/drift-validator.js`
  - `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- Evidence surfaces:
  - `reference/packets/*.md`
  - `.agents/artifacts/VALIDATION_REPORT.json`
  - `.agents/runtime/ACTIVE_CONTEXT.json`
- Authoritative source intake reference: `reference/planning/PLN-11_POST_OPS07_RUNTIME_GENERALIZATION_AND_PROCESS_FRICTION_REDUCTION_DRAFT.md`, `reference/packets/PKT-01_OPS-07_PLANNER_HOLD_CLOSEOUT_AUTOMATION.md`, `reference/packets/PKT-01_OPS-08_REUSABLE_SECURITY_REVIEW_EVIDENCE_GENERALIZATION.md`, `reference/packets/PKT-01_QLT-03_SEMANTIC_TRACE_AND_EVIDENCE_GATE_GENERALIZATION.md`
- Authoritative source disposition: approved closeout-friction evidence from prior lanes and approved phase split from `PLN-11`
- Existing plan conflict: validator-critical packet-exit meaning still depends on prose-sensitive fields in some closeout paths; this lane removes that friction without reopening broad packet redesign
- Current implementation impact: reusable packet-exit metadata, validator closeout parsing, packet template guidance, targeted regressions, and starter synchronization
- Impacted packet set scope: later packets that need reviewer/planner closeout without prose-sensitive false holds
- Schema impact:
  none expected

## 10. Acceptance
- Validator-critical packet-exit semantics no longer depend on fragile prose formatting alone.
- Closeout-critical parsing becomes more structured and stable across root and `standard-template`.
- Human-readable packet exit section remains usable for reviewer/operator closeout.
- Previously approved closeout packets remain regression-compatible or fail with explicit diagnostics rather than ambiguous wording drift.

## 11. Open Questions
- What exact structured packet-exit field shape is the narrowest durable contract?
- Should the validator require the new structured surface for all new packets immediately or support a compatibility window?
- What is the minimum legacy compatibility rule that avoids parser ambiguity without forcing a broad packet-template rewrite?

## 11A. Planner Recommendation
- Recommended answer to “what should be structured”:
  structure only validator-critical closeout semantics first.
- Recommended answer to “what should remain prose”:
  keep the reviewer/operator-facing packet exit explanation readable in the packet body.
- Recommended answer to “how broad should phase 2 be”:
  stop before lane-typed packet minimum redesign and keep this lane on parser/metadata hardening only.

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | yes / no | user/planner | pending | core reusable packet/validator closeout contract |
| Optional profile evidence approval | yes / no | planner | not-needed | no optional profile |
| Spreadsheet source mapping approval | yes / no | planner | not-needed | no spreadsheet source scope |
| Airgapped transfer package approval | yes / no | planner | not-needed | no transfer package scope |
| Lightweight app baseline approval | yes / no | planner | not-needed | not a PRF-07 lane |
| Android build and release boundary approval | yes / no | planner | not-needed | not an Android lane |
| Node/frontend package boundary approval | yes / no | planner | not-needed | no package-boundary redesign |
| Detailed function agreement | yes / no | user/planner | approved | structured packet-exit metadata and closeout parser hardening are approved only inside the narrow boundary; lane-typed packet minimum redesign remains out of scope |
| Detailed UI/UX agreement | yes / no | planner | not-needed | packet readability only; no dedicated UI lane |
| UX archetype / deviation approval | yes / no | planner | not-needed | no product UX archetype decision |
| Environment topology approval | yes / no | planner | not-needed | no deploy topology change |
| Domain foundation approval | yes / no | planner | not-needed | no data-impact design |
| DB design confirmation | yes / no | planner | not-needed | no DB schema work |
| Authoritative source disposition approval | yes / no | planner | approved | prior closeout evidence and phase split drive this lane |
| New source incorporation decision | yes / no | planner | not-needed | no new external source |
| Source wave rebaseline approval | yes / no | planner | not-needed | no multi-packet source wave |
| Packet exit quality gate approval | yes / no | reviewer | pending | closeout after implementation and evidence |
| Improvement promotion decision | yes / no | user/planner | pending | promote packet-exit semantics into structured reusable metadata |
| Ready For Code sign-off | yes / no | user | approved | implementation must remain inside structured closeout metadata and parser hardening only |

## 13. Implementation Notes
- Prefer the narrowest structured metadata shape that can coexist with current human-readable packet closeout text.
- Preserve reviewer/operator readability while reducing validator-critical prose drift.
- Avoid broad packet-template or workflow redesign in this lane.

## 13A. Detailed Agreement Close Condition
- This packet is ready for user `detailed agreement` approval when the user can answer yes to all of these:
- the lane should reduce packet closeout friction without redesigning the whole packet template
- validator-critical closeout meaning should move toward structured metadata
- human-readable packet exit notes should remain in place
- the lane should stay out of hosted CI, workflow automation, and lane-typed packet redesign

## 13B. Current Planning Decision
- Detailed agreement: approved
- Ready For Code: approved
- Remaining planner action before implementation:
  transition `OPS-09` to `Developer` and keep implementation inside structured packet-exit metadata plus closeout parser hardening only.

## Verification Manifest
- Gate profile:
  contract
- Verification manifest:
  - contract: detailed agreement, Ready For Code, root sync, standard-template sync, targeted tests, root test suite, starter test suite, validator, active-context evidence when re-entry state is affected, review closeout
  - targeted regression for structured packet-exit metadata parsing
  - targeted regression for legacy closeout compatibility or explicit diagnostics
  - targeted regression for root / `standard-template` packet-exit closeout parity
  - root `node --test .harness/test/*.test.js`
  - `standard-template` `node --test .harness/test/*.test.js`
  - root `node .harness/runtime/state/dev05-cli.js validate`
  - root `node .harness/runtime/state/dev05-cli.js validation-report`
  - root active context: `node .harness/runtime/state/dev05-cli.js context`

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
  root `node --test .harness/test/*.test.js`: 64/64 pass; `standard-template` `node --test .harness/test/*.test.js`: 64/64 pass; root `validate`, `validation-report`, and `context`: pass
- Exit recommendation:
  approved
- Implementation delta summary:
  Added structured packet-exit metadata, preserved legacy closeout fallback, added explicit mismatch diagnostics, and hardened packet-exit evidence parsing for indented legacy continuation lines.
- Source parity result:
  aligned across root and `standard-template` for validator, packet template, and regression fixtures.
- Refactor / residual debt disposition:
  No blocking residual defect remains inside the approved narrow scope; lane-typed packet minimum redesign stays deferred to parked follow-up `PLN-12`.
- UX conformance result:
  not-needed unless closeout wording/reporting changes require explicit note
- Topology / schema conformance result:
  not-needed
- Validation / security / cleanup evidence:
  root full harness suite: 64/64 pass; `standard-template` full harness suite: 64/64 pass; root `validate`: pass; root `validation-report`: pass; root `context`: pass
- Deferred follow-up item:
  parked `PLN-12` lane-typed packet minimums and approval-surface reduction remains the next process-friction candidate after `OPS-09`
- Improvement candidate reference:
  reusable promotion of packet-exit semantics into structured closeout metadata
- Proposed target layer:
  core
- Promotion status / linked follow-up item:
  proposed / `OPS-09`
- Closeout notes:
  Reviewer found no blocking defect. Structured metadata priority, legacy fallback, explicit mismatch diagnostics, and root/starter sync all stayed inside the approved `OPS-09` scope without broad packet-template redesign.

## 16. Reopen Trigger
- 아래 상황이 생기면 packet을 다시 연다.
- validator-critical packet-exit meaning이 여전히 fragile prose formatting에 묶여 있음
- structured closeout metadata가 root와 `standard-template`에서 다르게 동작함
- narrow parser hardening scope가 lane-typed packet redesign이나 broader workflow redesign까지 번짐
