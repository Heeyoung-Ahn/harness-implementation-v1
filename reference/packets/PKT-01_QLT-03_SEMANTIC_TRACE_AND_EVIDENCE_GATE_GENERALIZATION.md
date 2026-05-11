# PKT-01 QLT-03 Semantic Trace And Evidence Gate Generalization

## Purpose
This packet turns the useful `QLT-02` semantic trace and evidence gate into a reusable contract that later packets can opt into without depending on literal `QLT-02` lane naming.

## Approval Rule
- This packet is written before implementation.
- This packet stays narrow: it generalizes the existing `QLT-02` trace/evidence gate instead of redesigning the whole validator or CI program.
- This packet must preserve local-first evidence discipline and must not require hosted CI, GitHub Actions wiring, or remote eval orchestration.
- This packet must preserve root / `standard-template` sync and keep the resulting runtime/validator behavior reusable outside the maintainer-repo-only `QLT-02` lane context.
- This packet must not broaden into packet-template redesign, generic workflow-authoring, or review-process replacement.
- This template-based packet is a concrete current-contract task packet and must stay registered as category `task_packet`.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | QLT-03 semantic trace and evidence gate generalization | `QLT-02` proved the value of semantic trace and candidate-gate evidence, but the current validator activation is still lane-specific and therefore not reusable enough for later packets | draft |
| Ready For Code | approved | implementation is approved within the explicit activation metadata, opted-in trace/evidence enforcement, non-requested false-failure prevention, and `QLT-02` regression-compatibility boundary | approved |
| Human sync needed | yes | the user should confirm that this packet generalizes reusable evidence discipline without reopening broad CI/program scope | pending |
| Gate profile | contract | the lane changes reusable validator/runtime/active-context contracts and requires root/starter sync plus full verification | draft |
| User-facing impact | none | this lane changes reusable validator/runtime evidence behavior only and does not approve a product-facing UX surface | not-needed |
| Layer classification | core | this changes reusable harness validator/runtime/evidence contracts | draft |
| Active profile dependencies | none | this is core reusable infrastructure | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| UX archetype status | not-needed | no product UX archetype decision is required | not-needed |
| UX deviation status | none | no product UI deviation is being approved here | not-needed |
| Environment topology status | not-needed | no deployment/cutover topology change is included | not-needed |
| Domain foundation status | not-needed | no domain-model or schema-impact work is included | not-needed |
| Authoritative source intake status | approved | approved inputs are the closed `QLT-02` packet, current validator/runtime implementation, and the planner review findings | approved |
| Shared-source wave status | not-needed | no multi-packet source-wave rebaseline is required | not-needed |
| Packet exit gate status | pending | closeout is not available until reusable activation, evidence parity, and regression constraints are verified | pending |
| Improvement promotion status | proposed | this lane promotes a lane-specific trace/evidence implementation into a reusable core contract | proposed |
| Existing system dependency | none | this is harness-only work | not-needed |
| New authoritative source impact | analyzed | no new external planning source is entering; the driver is reusable-gap analysis after `OPS-08` closeout | analyzed |
| Risk if started now | medium | broadening the scope into full CI/eval orchestration or under-specifying the activation contract would create drift and operator confusion | draft |

## 1. Goal
- Keep the useful `QLT-02` semantic trace and candidate-gate evidence discipline.
- Remove the current lane-specific activation rule so the behavior can work for later reusable packets.
- Make semantic trace enforcement and validation/context parity follow a reusable contract instead of literal work-item naming.

## 2. Non-Goal
- Do not implement hosted CI, GitHub Actions, PR annotations, or remote eval execution in this lane.
- Do not redesign the whole packet template or planning workflow here.
- Do not replace packet-level human review with automatic semantic-trace approval.
- Do not broaden into unrelated validator refactors.

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  `QLT-02`에서 만든 semantic trace / evidence gate는 실제로 유용했지만, 지금 validator enforcement는 lane-specific naming에 묶여 있어서 이후 packet이나 downstream repo에서 같은 품질 계약을 재사용하기 어렵다.
- 작업 후 사용자가 체감해야 하는 변화:
  특정 lane 이름과 무관하게, packet이 semantic trace/evidence gate를 명시적으로 요청하면 validator, `validation-report`, `ACTIVE_CONTEXT`가 같은 reusable evidence discipline을 보여준다.

## 4. In Scope
- semantic trace activation을 lane-id hardcode에서 reusable contract signal로 일반화
- validator의 trace-required / evidence-parity enforcement를 reusable contract로 일반화
- `validation-report` trace summary와 `ACTIVE_CONTEXT.validation` parity 유지
- candidate-gate summary를 later packets에서도 재사용 가능한 형태로 유지
- root / `standard-template` runtime/test synchronization

## 5. Out Of Scope
- hosted CI, PR checks, remote eval orchestration
- organization-specific review workflow
- packet-template minimum-field redesign
- broad validator cleanup unrelated to semantic trace/evidence gate
- downstream project-specific trace taxonomy design

## 5A. Proposed Detailed Agreement
- This lane should keep the useful `QLT-02` semantic trace and candidate-gate evidence discipline, but remove the implementation dependency on the literal `QLT-02` work-item id.
- This lane should make reusable activation explicit, so later packets can request semantic trace/evidence gating without copying lane-specific logic.
- This lane should preserve the existing operator-facing contract:
  - semantic trace artifact exists for opted-in packets
  - candidate-gate summary remains visible in `validation-report`
  - `ACTIVE_CONTEXT.validation` stays parity-aligned with the latest validation report
- This lane should stay narrow:
  - no hosted CI
  - no PR annotation system
  - no broad packet-template redesign
  - no generic workflow-authoring framework
- Detailed agreement should resolve the reusable contract as follows:
  - activation should be explicit packet/runtime metadata, not inferred from lane id alone;
  - trace-required enforcement should apply only when the packet requests the contract;
  - non-requested packets should not fail semantic-trace gates just because they are not `QLT-02`;
  - existing `QLT-02` behavior must remain regression-compatible while removing the literal `QLT-02` dependency.

## 5B. Proposed Implementation Boundary
- Activation rule:
  replace the current `QLT-02` literal activation check with one reusable explicit packet/runtime metadata signal.
- Validator rule:
  apply semantic trace presence, non-contradiction, freshness, and validation/context parity checks when the reusable contract is requested.
- Report/context rule:
  keep `validation-report` trace summary and `ACTIVE_CONTEXT.validation` parity visible and aligned for opted-in packets.
- Verification boundary:
  root and `standard-template` must stay synchronized, the reusable trace summary must remain validator/report/context visible, and the existing `QLT-02` result quality must stay regression-compatible.

## 5C. Proposed Operator Outcome
- A Planner or Reviewer can attach one reusable semantic trace/evidence gate to a packet without relying on the packet being named `QLT-02`.
- Tester and Reviewer can still see:
  - whether a semantic trace artifact exists
  - whether freshness/parity checks passed
  - what candidate gates were summarized
- The operator should not be told that this lane has delivered full CI/eval automation; it only promotes the local reusable trace/evidence contract.

## 6. Detailed Behavior
- Trigger:
  packet/gate/runtime contract가 reusable semantic trace/evidence gate를 요구할 때
- Main flow:
  runtime과 validator가 opted-in packet에 대해 semantic trace artifact, candidate-gate summary, freshness, evidence non-contradiction, validation/context parity를 확인하고 결과를 `validation-report`와 `ACTIVE_CONTEXT`에 반영한다.
- Alternate flow:
  packet이 reusable semantic trace/evidence gate를 요청하지 않으면, semantic-trace-required blocking contract는 적용하지 않는다.
- Empty state:
  semantic trace contract가 미요청이면 later packets는 generic validation only로 통과할 수 있어야 하며, `QLT-02` 전용 규칙 때문에 false failure가 나면 안 된다.

## 7. Program Function Detail
- Candidate location:
  `.harness/runtime/state/drift-validator.js`
- Supporting location:
  `.harness/runtime/state/dev05-tooling.js`
- Possible re-entry surface impact:
  `.agents/runtime/ACTIVE_CONTEXT.json`
- Expected reusable change:
  trace-required enforcement가 work-item-name match가 아니라 explicit contract signal로 이동한다.

## 8. UI/UX Detailed Design
- Product UI change는 없다.
- Human-visible evidence surface는 두 곳만 유지한다:
  - `validation-report`의 trace summary and candidate-gate summary
  - `ACTIVE_CONTEXT.validation`
- 목표는 “보여주는 곳 추가”가 아니라 “later packet에서도 같은 evidence surface를 일관되게 재사용”하는 것이다.

## 9. Data / Source Impact
- Layer classification: core
- Required reading before code: `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/packets/PKT-01_QLT-02_EVIDENCE_VALIDATION_SEMANTIC_TRACE_AND_AGENT_EVAL_CI_GATING.md`, `reference/packets/PKT-01_OPS-08_REUSABLE_SECURITY_REVIEW_EVIDENCE_GENERALIZATION.md`, `.harness/runtime/state/drift-validator.js`, `.harness/runtime/state/dev05-tooling.js`
- Canonical sources:
  - `reference/packets/PKT-01_QLT-02_EVIDENCE_VALIDATION_SEMANTIC_TRACE_AND_AGENT_EVAL_CI_GATING.md`
  - `reference/planning/PLN-11_POST_OPS07_RUNTIME_GENERALIZATION_AND_PROCESS_FRICTION_REDUCTION_DRAFT.md`
  - `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- Runtime / validator sources:
  - `.harness/runtime/state/drift-validator.js`
  - `.harness/runtime/state/dev05-tooling.js`
- Evidence surfaces:
  - `.agents/runtime/agent-traces/*.json`
  - `.agents/artifacts/VALIDATION_REPORT.json`
  - `.agents/runtime/ACTIVE_CONTEXT.json`
- Authoritative source intake reference: `reference/packets/PKT-01_QLT-02_EVIDENCE_VALIDATION_SEMANTIC_TRACE_AND_AGENT_EVAL_CI_GATING.md`, `reference/planning/PLN-11_POST_OPS07_RUNTIME_GENERALIZATION_AND_PROCESS_FRICTION_REDUCTION_DRAFT.md`
- Authoritative source disposition: approved reusable baseline evidence from `QLT-02`, plus approved phase-1 sequencing from `PLN-11`
- Existing plan conflict: current validator enforcement still depends on literal `QLT-02` lane-specific activation; this lane removes that conflict without reopening broad CI scope
- Current implementation impact: reusable validator/runtime evidence gating, validation-report trace summary handling, active-context validation parity, targeted regressions, and starter synchronization
- Impacted packet set scope: future packets that explicitly request reusable semantic trace and evidence gating
- Semantic trace evidence status: requested
- Schema impact:
  none expected

## 10. Acceptance
- A later packet can request semantic trace/evidence gating without being literally named `QLT-02`.
- When the reusable contract is requested, validator enforcement includes semantic trace presence, evidence non-contradiction, freshness, and validation/context parity.
- When the reusable contract is not requested, packets do not fail because of the old `QLT-02` name-based rule.
- Existing `QLT-02` behavior remains regression-compatible after generalization.

## 11. Open Questions
- What exact packet/runtime field name is the narrowest durable contract for explicit activation?
- Should activation live only on packet/runtime metadata, or also map from an existing gate-profile helper when explicitly declared?
- What is the minimum reusable candidate-gate set that should stay visible without reopening broad CI work?

## 11A. Planner Recommendation
- Recommended answer to “what should be generalized”:
  generalize only activation and trace/evidence gate enforcement; keep the existing trace summary shape intact.
- Recommended answer to “how should it activate”:
  prefer one explicit packet/runtime metadata signal over implicit lane-name matching.
- Recommended answer to “what should stay visible”:
  keep the current `validation-report` trace summary, candidate-gate summary, and `ACTIVE_CONTEXT.validation` parity surface.
- Recommended answer to “how broad should phase 1 be”:
  stop before hosted CI/PR/eval execution wiring; keep this lane local and reusable.

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | yes / no | user/planner | pending | core reusable validator/runtime contract |
| Optional profile evidence approval | yes / no | planner | not-needed | no optional profile |
| Spreadsheet source mapping approval | yes / no | planner | not-needed | no spreadsheet source scope |
| Airgapped transfer package approval | yes / no | planner | not-needed | no transfer package scope |
| Lightweight app baseline approval | yes / no | planner | not-needed | not a PRF-07 lane |
| Android build and release boundary approval | yes / no | planner | not-needed | not an Android lane |
| Node/frontend package boundary approval | yes / no | planner | not-needed | no package-boundary redesign |
| Detailed function agreement | yes / no | user/planner | approved | explicit reusable activation, opted-in trace/evidence enforcement, and `QLT-02` regression-compatibility direction are accepted for this packet |
| Detailed UI/UX agreement | yes / no | planner | not-needed | report/context wording only; no dedicated UI lane |
| UX archetype / deviation approval | yes / no | planner | not-needed | no product UX archetype decision |
| Environment topology approval | yes / no | planner | not-needed | no deploy topology change |
| Domain foundation approval | yes / no | planner | not-needed | no data-impact design |
| DB design confirmation | yes / no | planner | not-needed | no DB schema work |
| Authoritative source disposition approval | yes / no | planner | approved | closed `QLT-02` packet and planner review findings drive this lane |
| New source incorporation decision | yes / no | planner | not-needed | no new external source |
| Source wave rebaseline approval | yes / no | planner | not-needed | no multi-packet source wave |
| Packet exit quality gate approval | yes / no | reviewer | pending | closeout after implementation and evidence |
| Improvement promotion decision | yes / no | user/planner | pending | promote lane-specific `QLT-02` behavior into reusable core contract through this narrow follow-up |
| Ready For Code sign-off | yes / no | user | approved | implementation is approved within the explicit activation metadata, opted-in trace/evidence enforcement, non-requested false-failure prevention, and `QLT-02` regression-compatibility boundary |

## 13. Implementation Notes
- Prefer the narrowest reusable activation mechanism that can work in both maintainer repo and copied-starter/downstream repo contexts.
- Preserve the current trace-summary and candidate-gate evidence surfaces where possible.
- Avoid broad validator rewrites unrelated to semantic trace/evidence gating.
- Keep the non-requested path free from false semantic-trace failures.

## 13A. Detailed Agreement Close Condition
- This packet is ready for user `detailed agreement` approval when the user can answer yes to all of these:
- the lane should generalize `QLT-02` behavior instead of reinventing it
- the lane should remove literal lane-name dependency
- the lane should keep semantic trace / candidate-gate evidence as a reusable local contract
- the lane should preserve validation/context parity
- the lane should not expand into hosted CI, PR wiring, or broad validator redesign

## 13B. Current Planning Decision
- Detailed agreement: approved
- Ready For Code: approved
- Remaining planner action before implementation:
  open the Developer lane with the approved reusable generalization scope, then require Developer to prove explicit activation metadata, opted-in enforcement, non-requested false-failure prevention, and `QLT-02` regression compatibility before Tester handoff.

## Verification Manifest
- Gate profile:
  contract
- Verification manifest:
  - contract: detailed agreement, Ready For Code, root sync, standard-template sync, targeted tests, root test suite, starter test suite, validator, active-context evidence when re-entry state is affected, review closeout
  - targeted regression for reusable semantic-trace activation outside literal `QLT-02`
  - targeted regression for opted-in trace/evidence enforcement
  - targeted regression for non-requested packets not failing the old lane-specific contract
  - targeted regression proving existing `QLT-02` behavior remains compatible after generalization
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
- Exit recommendation:
  approve
- Implementation delta summary:
  reusable semantic-trace activation now comes from explicit packet/runtime metadata instead of a literal `QLT-02` lane-id dependency, opted-in validator enforcement remains narrow to requested packets, and the existing trace summary / candidate-gate / validation-context parity surfaces stay reusable
- Source parity result:
  pass; root and `standard-template` runtime/test surfaces stayed synchronized for the reviewed `drift-validator`, `dev05-tooling`, `dev05-tooling.test`, and `generated-state-docs.test` changes
- Refactor / residual debt disposition:
  no blocking implementation defect remains in the approved narrow QLT-03 scope; hosted CI, PR checks, remote eval orchestration, packet-template redesign, and broad validator cleanup remain intentionally out of scope rather than open review debt
- UX conformance result:
  pass; trace summary and candidate-gate wording remain local, operator-readable, and do not overstate the result as hosted CI or remote eval automation
- Topology / schema conformance result:
  not-needed; the reviewed change stays inside reusable runtime/validator/report contracts and does not alter topology or project schema boundaries
- Validation / security / cleanup evidence:
  root and `standard-template` `node --test .harness/test/*.test.js` passed `61/61`; root `validate`, `validation-report`, and `context` passed; `validation-report` shows `workItemId: QLT-03`, `semanticTraceStatus: pass`, `candidateGateCount: 6`, explicit candidate-gate coverage, and no semantic-trace false failure for non-requested packets
- Deferred follow-up item:
  parked `OPS-09` structured packet-exit metadata and closeout parser hardening remains the next process-friction candidate after phase 1 closes
- Improvement candidate reference:
  reusable promotion of `QLT-02` semantic trace and evidence gate
- Proposed target layer:
  core
- Promotion status / linked follow-up item:
  proposed / `QLT-03`
- Closeout notes:
  reviewer closeout approved after tester evidence confirmed explicit activation metadata opt-in, non-requested false-failure prevention, `QLT-02` regression compatibility, and root/starter synchronization

## 16. Reopen Trigger
- 아래 상황이 생기면 packet을 다시 연다.
- semantic trace enforcement가 여전히 literal `QLT-02` 이름에 묶여 있음
- opted-in later packet이 trace/evidence gate를 요청해도 validator/report/context에 reusable evidence가 나타나지 않음
- non-requested packet이 old lane-specific rule 때문에 false failure를 냄
- acceptance 또는 phase-1 boundary가 hosted CI/PR/eval orchestration까지 넓어짐
