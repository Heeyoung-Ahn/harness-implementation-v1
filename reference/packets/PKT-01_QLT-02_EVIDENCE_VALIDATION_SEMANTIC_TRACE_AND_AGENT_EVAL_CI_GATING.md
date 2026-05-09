# PKT-01 QLT-02 Evidence Validation, Semantic Trace, And Agent Eval / CI Gating

## Status
- Packet opened on 2026-05-04 from `PLN-10`.
- Planning owner: `Planner`
- Implementation owner after approval: `Developer`
- This packet is the next follow-up lane after `OPS-04`.
- This packet does not approve implementation yet. It defines the detailed agreement needed before any quality/eval implementation opens.
- On 2026-05-04, the user approved a narrowed phase-1 scope: local semantic evidence contract, validator-backed evidence checks, lightweight agent trace artifact, validation/report/context parity hardening, root/`standard-template` sync, and CI/PR gate definition only.
- Actual CI/PR execution wiring is explicitly deferred to a later narrow follow-up packet.

## Purpose
Strengthen the part of the harness that determines whether a “pass” really means “the approved design was followed with enough evidence.”

`OPS-04` hardened session-start re-entry and closeout validation gating. `QLT-02` now focuses on the next real-project risk: evidence can still be structurally present while remaining semantically weak, hard to compare, or too manual to trust across long projects and review. The first implementation pass stays local-first and defines CI/PR candidate gates without wiring them yet.

This lane defines:

- what evidence must connect approved design SSOT to implementation and verification
- how semantic trace expectations should work across packet, code, tests, walkthrough, review, and validation surfaces
- what agent-eval / trace evidence is worth standardizing in core
- what should be enforced locally, what should be enforced by validator, and what should be promoted into CI/PR gating

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | QLT-02 evidence validation, semantic trace, and agent eval / CI gating | The first real complex-project rollout needs stronger proof that green validation also means approved-design conformance and decision-ready evidence quality | approved |
| Ready For Code | approve | the user approved the exact phase-1 boundary, hard-fail semantics, warning/reviewer-only split, lightweight trace artifact shape, and CI/PR candidate-only split | approved |
| Human sync needed | yes | the narrowed phase-1 scope and the separate Ready For Code boundary are both now explicitly approved by the user | approved |
| Gate profile | contract | QLT-02 affects reusable validator rules, packet exit criteria, review evidence expectations, and root/starter sync | approved |
| User-facing impact | medium | user-facing CLI/docs do not change first, but downstream decision confidence and project closeout behavior do | draft |
| Layer classification | core | this is reusable harness quality-governance behavior for all future projects | draft |
| Active profile dependencies | none | no optional profile is required | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| UX archetype status | approved | operator-facing CLI, validation report, and Active Context surfaces reuse the existing operator evidence / context archetype | approved |
| UX deviation status | none | not applicable | not-needed |
| Environment topology status | approved | phase-1 implementation is local-first; CI/PR gate definitions stay in-scope, but actual CI/PR execution wiring is deferred | approved |
| Domain foundation status | not-needed | no product-domain or DB design is involved | not-needed |
| Authoritative source intake status | approved | the real-project readiness assessment and the 2026-05-04 user decision explicitly prioritize this lane | approved |
| Shared-source wave status | not-needed | this is a single active packet | not-needed |
| Packet exit gate status | pending | no implementation lane is active yet | draft |
| Improvement promotion status | proposed | QLT-02 may promote evidence-quality gaps into reusable baseline rules | draft |
| Existing system dependency | none | no external product or legacy runtime integration is required for planning | not-needed |
| New authoritative source impact | analyzed | the readiness assessment changes next-lane priority after `OPS-04` | approved |
| Risk if started now | accepted | the phase-1 boundary is explicit and still intentionally narrow: local-first contract work only, with CI/PR execution wiring deferred | approved |

## 1. Goal
- Define semantic evidence expectations between approved design SSOT, active packet, implementation, tests, walkthrough, review, and validation artifacts.
- Define what “decision-ready evidence quality” means for this harness before larger real projects begin.
- Lock the phase-1 split between local/manual checks, validator-backed checks, and future CI/PR candidate gates.
- Define a lightweight reusable agent trace surface that helps detect drift between what the agent claims, what the packet approved, and what the verification evidence actually shows.
- Close the remaining parity gap where derived context can still under-report validation details such as `ACTIVE_CONTEXT.validation.executedAt`.

## 2. Non-Goal
- Do not reopen PMW.
- Do not merge dependency inventory, secret scan, or release artifact audit work from `OPS-05` into this lane.
- Do not create project-specific business-rule evals in core.
- Do not require remote SaaS infrastructure just to keep the local harness usable.
- Do not turn every human judgment into a brittle fully-automated rule.

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  현재 하네스는 structural validation과 packet hold에는 강하지만, `이 통과가 정말 approved design SSOT를 충분히 따랐는가`, `증거가 사람이 보기에도 decision-ready한가`, `에이전트가 실제로 무엇을 읽고 어떤 근거로 결론을 냈는가`는 아직 일부가 수동 검토에 의존한다.
- 작업 후 사용자가 체감해야 하는 변화:
  실제 복잡한 프로젝트에서 `green` 결과와 closeout evidence를 더 신뢰할 수 있고, packet/테스트/review/validation이 서로 어떤 근거로 연결되는지 더 쉽게 판단할 수 있어야 한다. 또한 이후 CI/PR에 무엇을 붙일지 명확한 경계가 생겨야 한다.

## 4. In Scope
- local semantic evidence contract planning
- approved design SSOT -> packet -> implementation -> tests -> walkthrough -> review -> validation trace contract
- validator-backed evidence check planning for phase-1 local enforcement
- lightweight agent trace artifact planning
- validation/report/context parity hardening planning, including `ACTIVE_CONTEXT.validation.executedAt`
- CI/PR candidate gate definition only
- root and `standard-template` sync expectation for any later implementation packet opened from this lane

## 5. Out Of Scope
- dependency inventory, secret scan, release payload audit, and other `OPS-05` items
- external hosted eval platform selection
- domain-specific assertions for a particular downstream project
- packaging, installer, or manual release redesign unrelated to evidence quality
- broad workflow or role redesign outside quality/evidence behavior
- actual CI/PR execution wiring

## 6. Detailed Behavior
- Trigger:
  user chose `QLT-02` as the next planner lane after the real-project readiness assessment.
- Main flow:
  Planner defines the phase-1 evidence model, semantic trace boundaries, local validator candidates, lightweight agent trace artifact, parity gap remediation scope, and CI/PR candidate-gate contract; then a later implementation packet can open only after explicit Ready For Code approval.
- Alternate flow:
  if validator-backed evidence checks prove too large for one pass, keep the CI/PR wiring split deferred and further narrow phase-1 implementation without changing the approved local-first boundary.
- Empty state:
  for a fresh starter or a project with no active product work yet, quality evidence remains bootstrap-light; `QLT-02` should not force heavy evidence where no packet/design surface exists.
- Error state:
  validator or reviewer must be able to say whether the failure is missing evidence, contradictory evidence, stale evidence, or insufficient semantic trace.
  Hard fail in phase-1 is limited to missing required evidence, broken source reference, contradictory evidence, stale evidence, required semantic trace missing, validation/report/context parity break, and `ACTIVE_CONTEXT.validation.executedAt` mismatch.
  Evidence that exists but has thin linkage or weak reviewer rationale remains warning-level in phase-1.
  design-intent fulfillment, work fitness, and domain-specific business-rule judgment remain reviewer-only rather than validator-hard-fail in this packet.
- Loading/transition:
  any future implementation from this packet must keep `CURRENT_STATE`, `TASK_LIST`, `ACTIVE_CONTEXT`, validation report, walkthrough, and review report mutually comprehensible rather than adding one more disconnected evidence surface.

## 7. Program Function Detail
- 입력:
  `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `ACTIVE_CONTEXT.*`, `VALIDATION_REPORT.*`, `WALKTHROUGH.md`, `REVIEW_REPORT.md`, the readiness assessment, existing validator/runtime tests, and the approved packet/workflow contracts.
- 처리:
  define phase-1 evidence classes, semantic trace checkpoints, ownership boundaries, validator-backed local checks, lightweight agent trace shape, parity fixes, and CI/PR candidate gates for reusable core quality behavior.
- 출력:
  an approved planning contract for what must be evidenced, where it must be stored, how it should be checked locally, what validator backs it, what stays candidate-only for CI/PR, and which part of the system owns each check.
- Phase-1 approval freeze:
  - lightweight agent trace artifact path: `.agents/runtime/agent-traces/<work_item_id>.json`
  - minimum trace fields: `schemaVersion`, `workItemId`, `packetId`, `role`, `workflow`, `turnClosedAt`, `requiredSsot`, `declaredReadEvidence`, `approvedDesignRefs`, `implementationRefs`, `verificationRefs`, `semanticTrace`, `selfCheck`, `handoff`
  - validation report and `ACTIVE_CONTEXT` only carry a summary of the trace rather than the full artifact body
  - CI/PR scope in this packet is candidate-gate definition only; GitHub Actions, PR comments, branch protection, and hosted eval wiring stay deferred to a later narrow packet
- 권한/조건:
  this lane may redefine reusable quality/evidence rules, but it must preserve packet-before-code, human approval gates, generated-doc immutability, Active Context derived authority, and Tester/Reviewer separation.
- edge case:
  a project may have structurally complete docs and tests, but weak semantic linkage. `QLT-02` must define how that condition is detected without pretending that everything can be proven mechanically.

## 8. UI/UX Detailed Design
- Active profile references: not-needed
- Profile composition rationale: not-needed
- Profile-specific UX / operation contract: not-needed
- Primary admin entity / surface: quality evidence surfaces in CLI and Markdown artifacts
- Grid interaction model: not-needed
- Search / filter / sort / pagination behavior: not-needed
- Row action / bulk action rule: not-needed
- Edit / save / confirm / audit pattern: evidence should become easier to compare across packet, validator, walkthrough, and review outputs
- Profile deviation / exception: not-needed
- UX archetype reference: not-needed for the planning packet itself
- Selected UX archetype: not-needed
- Archetype fit rationale: this lane focuses on evidence and quality contracts, not a new user-facing feature surface
- Archetype deviation / approval: not-needed
- 영향받는 화면:
  terminal `validate`, `validation-report`, `context`, and the human-facing walkthrough/review/packet evidence set
- 레이아웃 변경:
  possible later implementation may add tighter evidence summaries or trace sections, but this packet is planning-only
- interaction:
  users and reviewers should be able to move from high-level result to supporting evidence without rereading the entire repo
- copy/text:
  evidence wording should stay concise, explicit, and approval-oriented
- feedback/timing:
  the operator should be told whether evidence is missing, contradictory, stale, or only manually reviewed
- source trace fallback:
  every quality summary should point back to packet, validation report, walkthrough, review report, and relevant SSOT

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  evidence-quality, semantic trace, and eval/gating behavior are reusable harness contracts, not project-specific business logic
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `AGENTS.md`, `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`, `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `.agents/artifacts/PREVENTIVE_MEMORY.md`, `reference/planning/PLN-10_POST_DEV11_HARDENING_AND_RELEASE_ASSURANCE_DRAFT.md`, `reference/artifacts/STANDARD_HARNESS_REAL_PROJECT_READINESS_ASSESSMENT.md`, `reference/artifacts/WALKTHROUGH.md`, `reference/artifacts/REVIEW_REPORT.md`, `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`, this packet
- Environment topology reference: approved local-first phase-1; define CI/PR candidate gates here, but defer actual CI/PR execution topology and wiring
- Source environment: maintainer repository
- Target environment: root plus `standard-template`; later CI/PR execution target is intentionally deferred
- Execution target: local Windows maintainer/operator machine for planning and first implementation packet; CI/PR execution target deferred
- Transfer boundary: reusable validator/runtime/docs/test changes must remain synchronized across root and starter
- Rollback boundary: revert this lane's implementation changes if evidence rules prove too noisy, too weak, or too expensive
- Domain foundation reference:
  not-needed
- Schema impact classification:
  no product-domain schema impact expected; may touch work-item, artifact, generation, or validation metadata only if later implementation requires new evidence-tracking fields
- DB / state 영향:
  possible later implementation may extend validation metadata, evidence summaries, or trace fields
- Markdown / docs 영향:
  packet template, walkthrough/review expectations, validation-report guidance, lightweight trace artifact expectations, and possibly workflow closeout wording may change
- generated docs 영향:
  `ACTIVE_CONTEXT` and generated state may later include richer evidence summaries and parity-correct validation metadata if approved
- validator / cutover 영향:
  validator scope may expand in phase-1 to detect missing or contradictory evidence and parity gaps; CI/PR gating stays definition-only in this packet
- Authoritative source refs:
  `reference/artifacts/STANDARD_HARNESS_REAL_PROJECT_READINESS_ASSESSMENT.md`, `reference/artifacts/STANDARD_HARNESS_PROJECT_SIMULATION_PLAYBOOK.md`, `reference/artifacts/STANDARD_HARNESS_WBMS_SIMULATION_REPORT.md`, `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`, `VALIDATION_REPORT.json`, `ACTIVE_CONTEXT.json`, `WALKTHROUGH.md`, `REVIEW_REPORT.md`
- Authoritative source intake reference: `reference/planning/PLN-10_POST_DEV11_HARDENING_AND_RELEASE_ASSURANCE_DRAFT.md`, `reference/artifacts/STANDARD_HARNESS_REAL_PROJECT_READINESS_ASSESSMENT.md`
- Authoritative source disposition: implemented; accept the readiness assessment conclusion that `QLT-02` should open before the first real complex-project kickoff
- New planning source priority / disposition:
  the readiness assessment changes next-lane priority after `OPS-04`
- Existing plan conflict: current baseline has strong structural gates, but not enough semantic evidence / eval / CI hardening for scaled confidence
- Current implementation impact: later implementation will likely touch validator, validation report, packet template/contract, walkthrough/review expectations, and possibly Active Context evidence summaries
- Required rework / defer rationale:
  release/security hardening remains intentionally deferred to `OPS-05`
- Impacted packet set scope: single-packet
- Authoritative source wave ledger reference:
  not-needed
- Source wave packet disposition:
  continue
- Existing program / DB dependency:
  none
- Existing schema source artifact:
  not-needed
- Product source root:
  `.harness/runtime/`, `.harness/test/`, `.agents/workflows/`, `.agents/artifacts/`, `reference/artifacts/`, `reference/packets/`, `standard-template/`
- Product test root:
  `.harness/test/`, `standard-template/.harness/test/`
- Product runtime requirements:
  Node 24+ unchanged
- Harness/product boundary exceptions:
  none
- Runtime / framework:
  Node.js CLI harness runtime
- Data persistence boundary:
  SQLite DB plus generated docs and Markdown evidence artifacts
- Deployment target:
  reusable standard harness baseline and copied starter; CI/PR target pending
- Test command:
  later implementation should expect targeted evidence/validator tests, root/starter full suites, `harness:validate`, `harness:validation-report`, `harness:context`, and only local simulation or contract checks for CI/PR candidates

## 10. Acceptance
- The packet clearly defines what phase-1 evidence classes the harness should standardize before real complex-project scale-up.
- The packet defines a semantic trace contract between approved design SSOT, active packet, implementation, tests, walkthrough, review, and validation outputs.
- The packet separates local/manual checks, validator-backed checks, and future CI/PR candidate gates instead of mixing them.
- The packet defines the minimum useful shape of the lightweight agent trace artifact for phase-1.
- The packet explicitly includes the observed `ACTIVE_CONTEXT.validation.executedAt` parity gap in this lane's first implementation packet.

## 11. Open Questions
- What minimum semantic trace beyond the approved phase-1 fields can be enforced mechanically without turning the harness into high-noise bureaucracy?
- Which exact CI/PR candidate gates should be listed in the later implementation packet so the deferred wiring stays narrow?

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | yes | user/planner | approved | confirmed as a reusable core quality-governance lane |
| Detailed function agreement | yes | user/planner | approved | narrowed phase-1 scope, hard-fail semantics, trace shape, and CI/PR candidate-only split were approved on 2026-05-04 |
| Detailed UI/UX agreement | no | planner | not-needed | no new product-facing UI is proposed in the planning packet |
| Environment topology approval | yes | user/planner | approved | phase-1 is local-first and CI/PR execution wiring is split into a later narrow packet |
| Domain foundation approval | no | planner | not-needed | no product-domain or DB design work is involved |
| Authoritative source disposition approval | yes | user/planner | approved | the readiness assessment is accepted as the source that prioritizes this lane |
| Source wave rebaseline approval | no | planner | not-needed | single active packet only |
| Packet exit quality gate approval | yes | user/planner | approved | the implementation lane may open under this packet's narrowed phase-1 contract |
| Improvement promotion decision | yes | planner/reviewer | pending | decide whether new evidence-quality rules should be promoted into preventive baseline guidance |
| Ready For Code sign-off | yes | user | approved | Developer may open the phase-1 implementation lane within this packet boundary |

## 13. Implementation Notes
- keep the first implementation packet narrow; do not try to land validator expansion, CI wiring, and agent-eval redesign all at once
- optimize for decision trust, not metric vanity
- avoid rules that require large manual evidence authoring on every tiny work item
- preserve root/`standard-template` synchronization in the same change set
- keep human review meaningful; do not flatten all quality judgment into boolean automation
- treat CI/PR work in this packet as contract and candidate-gate definition only; actual execution wiring belongs to a later narrow packet
- keep the phase-1 hard-fail list frozen to the user-approved set; evidence-quality weakness outside that set must not be silently promoted to a blocking validator rule in this packet
- keep lightweight trace storage separate from validation report and `ACTIVE_CONTEXT`; those surfaces should summarize, not duplicate, the full trace artifact

## 14. Verification Plan
- Gate profile:
  contract
- Verification manifest:
  - approved narrowed phase-1 packet scope before implementation opens
  - targeted validator/evidence regression tests
  - targeted tests for trace/evidence metadata where later implementation changes runtime summaries
  - root `npm.cmd test`
  - `standard-template` `npm.cmd test`
  - root `npm.cmd run harness:validate`
  - root `npm.cmd run harness:validation-report`
  - root `npm.cmd run harness:context`
  - copied-starter smoke if any reusable evidence surface changes
  - review closeout on evidence quality, not just command pass/fail

## Verification Manifest
- Gate profile: contract
- Required evidence: Ready For Code agreement, root and `standard-template` sync, targeted regression tests, root/starter full suites, validator/report/context parity evidence, lightweight trace evidence, active context evidence, and review closeout
- Hard-fail scope: missing required evidence, broken source reference, contradictory evidence, stale evidence, required semantic trace missing, validation/report/context parity break, and `ACTIVE_CONTEXT.validation.executedAt` mismatch
- Warning-only scope: thin evidence linkage and weak reviewer rationale when required evidence still exists
- Reviewer-only scope: design-intent fulfillment, work fitness, and domain-specific business-rule judgment
- Primary commands: `npm.cmd test`, `npm.cmd test` in `standard-template`, `npm.cmd run harness:validate`, `npm.cmd run harness:validation-report`, `npm.cmd run harness:context`

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: approved
- Implementation delta summary:
  phase-1 implementation landed the local semantic evidence contract, validator-backed evidence checks, lightweight trace artifact generation, validation/report/context parity hardening, root/`standard-template` sync, and CI/PR candidate-gate definition without pulling in deferred CI wiring or `OPS-05` scope
- Source parity result:
  aligned for the approved phase-1 boundary; packet, validation report, `ACTIVE_CONTEXT`, walkthrough evidence, and the lightweight trace summary all agree on the same hard-fail scope, warning split, and candidate-gate contract
- Refactor / residual debt disposition:
  no blocking remediation remains in the reviewed phase-1 scope; transition-time derived artifact refresh timing is accepted as a follow-up candidate rather than a closeout blocker because regenerated state and validator evidence are clean after refresh
- UX conformance result:
  not-needed unless later implementation changes user-facing evidence surfaces
- Topology / schema conformance result:
  aligned for the approved local-first phase-1 scope; CI/PR execution wiring remains intentionally deferred and no product schema impact was introduced
- Validation / security / cleanup evidence:
  root `node --test .harness/test/*.test.js`, `standard-template` `node --test .harness/test/*.test.js`, root `node .harness/runtime/state/dev05-cli.js validate`, root `node .harness/runtime/state/dev05-cli.js validation-report`, root `node .harness/runtime/state/dev05-cli.js context`, and clean copied-starter smoke all passed during tester/reviewer closeout evidence collection
- Deferred follow-up item:
  `OPS-05` remains separate, and actual CI/PR execution wiring still belongs to a later narrow follow-up packet; additionally, transition-time derived artifact refresh timing should be considered as a preventive-memory candidate rather than folded back into this closed scope
- Improvement candidate reference:
  derived artifact refresh timing after role transitions is a candidate for later hardening because the DB handoff can become visible before regenerated `ACTIVE_CONTEXT` / validation artifacts catch up
- Proposed target layer:
  core
- Promotion status / linked follow-up item:
  pending-review / `QLT-02`
- Closeout notes:
  Reviewer closeout accepts the narrowed phase-1 implementation as sufficient for packet exit. Keep CI/PR execution wiring and `OPS-05` security/release audit items deferred to later narrow follow-up packets, and do not promote the transition-refresh timing issue to a blocker without a separate approved follow-up lane.

## 16. Reopen Trigger
- the user changes the first real-project rollout strategy
- `OPS-05` items need to merge into this lane
- CI/PR candidate-gate contract changes materially, or actual CI/PR execution wiring is pulled back into this packet
- the intended semantic trace model proves too heavy or too weak
- a new parity issue shows the evidence surfaces still disagree in ways that affect decision trust
- human approval boundary changes
