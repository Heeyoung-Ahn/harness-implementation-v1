# PKT-01 PLN-23 Cutover Execution Approval

## Purpose
- Prepare the separate Planner approval surface for `PLN-23` cutover execution after `PLN-22` Slice 4 non-destructive closeout.
- Ask whether the user approves the authority cutover execution lane only.
- Keep destructive artifact retirement, artifact deletion, artifact merge, and final tombstone application gated behind a later approval packet.

## Approval Rule
- This packet is a planning / approval packet only.
- User approved cutover execution for `PLN-23` on 2026-05-17.
- `Ready For Code` is approved for cutover execution only.
- Developer may execute only the root cutover lane described here after the freshness gate passes.
- Artifact deletion, artifact merge, destructive retirement, release packaging, and downstream project mutation remain not approved.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | PLN-23 Cutover execution approval | `PLN-22` non-destructive Slice 4 closed, and the separately approved cutover execution is now closed | approved |
| Ready For Code | approved | user approved cutover execution on 2026-05-17 | approved |
| Human sync needed | yes | cutover changes operational authority behavior and old write-path status | approved |
| Gate profile | contract | reusable harness authority, validator, Active Context, and root/starter routing behavior are affected | approved |
| User-facing impact | high | operators and AIs will rely on the post-cutover operational authority path | approved |
| Layer classification | core | reusable harness operating model, not project-specific behavior | draft |
| Active profile dependencies | none | no optional profile is active | not-needed |
| Profile evidence status | not-needed | no profile-specific evidence is required | not-needed |
| UX archetype status | approved | existing harness operator-console context from `PLN-22` remains the UX basis | approved |
| UX deviation status | none | no product UI deviation is proposed | not-needed |
| Environment topology status | approved | execution target, rollback boundary, and freshness gates are defined in this packet | approved |
| Domain foundation status | not-needed | no product domain data schema is changed | not-needed |
| Authoritative source intake status | approved | user requested this cutover approval packet after `PLN-22` closeout | approved |
| Shared-source wave status | not-needed | single follow-up approval lane | not-needed |
| Packet exit gate status | approved | Developer execution, Tester evidence, Reviewer closeout, and Planner reflection are complete | approved |
| Existing system dependency | none | no external product system dependency is touched | not-needed |
| New authoritative source impact | analyzed | user approved cutover execution after target / rollback / freshness gates were defined | approved |
| Risk if started now | closed | approved root cutover execution completed as no-op migration apply with validation evidence | approved |

## Lane-Typed Minimum Contract
- Lane-type declaration:
  planning
- Lane-type universal minimum sections:
  Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger
- Lane-type required sections:
  Purpose; Approval Rule; Quick Decision Header; Human Sync / Approval Boundary; Verification Manifest
- Lane-type conditional sections:
  User cutover execution approval must close before `Ready For Code`
- Lane-type not-needed sections:
  optional profile evidence, product domain foundation, and product UI design

## Goal
- Execute the approved Developer lane for cutover execution only after the freshness gate passes.
- Preserve the `PLN-22` closeout boundary: destructive artifact retirement / merge still requires separate future approval.

## Non-Goal
- Do not execute destructive artifact retirement / merge in this lane.
- Do not delete, merge, rename, or tombstone artifacts.
- Do not approve final artifact retirement / merge.
- Do not change product-facing behavior outside reusable harness operational authority.

## In Scope
- Define the cutover execution approval boundary.
- Define preconditions that must pass immediately before Developer handoff.
- Define evidence required after cutover execution.
- Keep root and `standard-template` parity expectations explicit.
- Keep rollback and hold conditions explicit.

## Out Of Scope
- Destructive artifact retirement or merge execution.
- Inbound-reference migration / tombstone / exemption application for final artifact retirement.
- Release packaging.
- Optional profile expansion.
- Product-specific app behavior.

## Data / Source Impact
- Layer classification: core.
- UX archetype reference: `.agents/rules/HARNESS_OPERATING_CONTRACT.md`.
- Selected UX archetype: operator-console-context.
- Archetype fit rationale: cutover affects operator and AI re-entry behavior, not product UI.
- Required reading before code: `.agents/runtime/ACTIVE_CONTEXT.json`; `.agents/artifacts/REQUIREMENTS.md`; `.agents/artifacts/IMPLEMENTATION_PLAN.md`; `reference/packets/PKT-01_PLN-22_OPERATIONAL_AUTHORITY_REBUILD_AND_HARNESS_RESET.md`; `reference/artifacts/PLN-22_ARTIFACT_REFERENCE_DISPOSITION.md`; `reference/artifacts/REVIEW_REPORT.md`; this packet.
- Environment topology reference: this packet.
- Source environment: maintainer root plus `standard-template`.
- Target environment: repo-local harness operating state and generated/on-demand re-entry surfaces.
- Execution target: maintainer root first, specifically the repo-local harness authority and generated/on-demand re-entry surfaces under `C:\Newface\30 Github\harness-implementation-v1`.
- `standard-template` execution role: parity and starter-safety validation target only; do not mutate starter operating state as part of root cutover unless a later explicit starter-specific cutover approval is recorded.
- Transfer boundary: none.
- Rollback boundary: minimum rollback evidence before execution is a concrete rollback bundle covering root `.harness/operating_state.sqlite`, `.agents/runtime/generated-state-docs/*`, `.agents/runtime/ACTIVE_CONTEXT.*`, `.agents/artifacts/VALIDATION_REPORT.*`, and retained live planning artifacts listed by `cutover-preflight.rollbackBundle.liveArtifacts`.
- Rollback restore expectation: if cutover validation fails after an approved execution, restore the root sqlite DB and listed generated/live artifacts from the pre-execution bundle, then rerun `harness:context`, `harness:validate`, and `harness:validation-report`.
- DB / state impact: authority cutover may alter accepted write paths and compatibility write rejection behavior; no product DB is touched.
- Markdown / docs impact: generated compatibility views may be refreshed; canonical planning docs remain retained.
- generated docs impact: `ACTIVE_CONTEXT.*`, validation report, and generated state docs must regenerate cleanly.
- validator / cutover impact: validator must pass before and after execution; cutover preflight must pass before execution.
- Authoritative source intake reference: user request on 2026-05-17, "`Planner / cutover execution approval packet을 준비해줘. 아직 실행은 하지 마.`"
- Authoritative source disposition: incorporated as a pending approval packet only.
- Existing plan conflict: none; this follows the `PLN-22` separate approval rule.
- Current implementation impact: approved root cutover execution is complete; `migration-apply` applied 0 changes and post-cutover validation remained clean.
- Impacted packet set scope: single follow-up packet to `PLN-22`.
- Closeout risk tier: high-risk.

## Detailed Behavior
- Trigger:
  - user explicitly approved cutover execution for this packet on 2026-05-17.
- Main flow:
  - Developer confirms no destructive retirement / merge approval is included.
  - Developer captures fresh root rollback evidence from `cutover-preflight.rollbackBundle` and any required operator backup.
  - Developer reruns the freshness gate below immediately before any mutation.
  - Developer executes only approved root cutover steps.
  - Developer proves no destructive retirement / merge occurred.
  - Tester verifies root acceptance and `standard-template` parity / starter-safety acceptance.
  - Reviewer approves high-risk closeout.
  - Planner records closeout and keeps artifact retirement / merge separately gated.
- Error / hold flow:
  - any failed validator, failing test suite, missing rollback boundary, stale Active Context, or unclear target holds the packet in planning or routes back to Developer after approval.

## Execution Target
- Primary execution target:
  - root repo `C:\Newface\30 Github\harness-implementation-v1`
  - root `.harness/operating_state.sqlite`
  - root `.agents/runtime/ACTIVE_CONTEXT.json`
  - root `.agents/runtime/ACTIVE_CONTEXT.md`
  - root generated compatibility views and validation report surfaces
- Secondary validation target:
  - `C:\Newface\30 Github\harness-implementation-v1\standard-template`
  - validation only unless separately approved
- Explicit non-targets:
  - destructive artifact retirement
  - artifact deletion
  - artifact merge
  - package/release publishing
  - downstream project repositories

## Rollback Boundary
- Required before approved execution starts:
  - root `cutover-preflight` must report `rollbackBundle.needsOperatorBackup: false`
  - root `cutover-preflight.rollbackBundle.missingPaths` must be empty
  - root `.harness/operating_state.sqlite` must be restorable from pre-execution evidence
  - root generated docs, Active Context, validation report, and retained live artifacts must be restorable from pre-execution evidence
- Rollback trigger:
  - post-execution validator fails
  - post-execution Active Context is stale or blank
  - old write-path freeze behavior contradicts the packet
  - any destructive artifact retirement / merge is detected inside this lane
- Rollback proof after restore:
  - root `harness:context`
  - root `harness:validate`
  - root `harness:validation-report`
  - root status shows no unresolved blocker introduced by the cutover attempt

## Preflight Freshness Gate
- Freshness window:
  - all commands below must run in the same Developer execution turn immediately before any approved cutover mutation
  - if any source, packet, runtime, workflow, generated-doc, or validation artifact changes after the gate, rerun the whole gate
- Required root evidence before mutation:
  - `node --test .harness/test/starter-payload-contract.test.js .harness/test/bootstrap-runtime.test.js .harness/test/dev05-tooling.test.js .harness/test/workflow-governance.test.js`
  - `npm.cmd test`
  - `node .harness/runtime/state/dev05-cli.js validate`
  - `node .harness/runtime/state/dev05-cli.js validation-report`
  - `node .harness/runtime/state/dev05-cli.js context`
  - `node .harness/runtime/state/dev05-cli.js cutover-preflight`
- Required `standard-template` evidence before mutation:
  - `node --test .harness/test/dev05-tooling.test.js .harness/test/workflow-governance.test.js`
  - `npm.cmd test`
  - `node .harness/runtime/state/dev05-cli.js validate`
  - `node .harness/runtime/state/dev05-cli.js validation-report`
  - `node .harness/runtime/state/dev05-cli.js context`
  - `node .harness/runtime/state/dev05-cli.js cutover-preflight`
- Hold condition:
  - any failed command above blocks execution and keeps `Ready For Code` on hold.

## Acceptance
- This packet exists under `reference/packets/` and is registered as the active Planner packet.
- `Ready For Code` is approved for cutover execution only.
- Cutover execution approval is separated from destructive artifact retirement / merge approval.
- Required preconditions, verification manifest, rollback boundary, and human approval boundary are explicit.
- Execution target is root-only for mutation, with `standard-template` as validation/parity target.
- Preflight freshness gate is explicit and blocks execution on any failure.
- `harness:validate`, `harness:validation-report`, and `ACTIVE_CONTEXT` remain clean after opening the packet.

## Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Cutover execution approval | yes | user | approved | Approved on 2026-05-17 |
| Ready For Code sign-off | yes | user | approved | Cutover execution only |
| Execution target approval | yes | Planner | approved | Root mutation target; `standard-template` validation/parity target only |
| Rollback boundary approval | yes | Planner / Reviewer | approved | Concrete rollback bundle and restore proof required before execution |
| Preflight freshness gate approval | yes | Planner / Reviewer | approved | Same-turn pre-mutation root/starter tests, validators, reports, contexts, and preflights |
| Destructive artifact retirement / merge approval | yes | user | not-approved | Out of scope for this packet |
| Packet exit quality gate approval | yes | Reviewer / Planner | pending | Required after execution and verification |

## Verification Plan
- Gate profile:
  - contract
- Verification scenario reminder:
  - normal: approved cutover executes and post-cutover root/starter validation remains clean
  - error: preflight failure holds execution before mutation
  - permission: old write paths reject new writes only after approved cutover
  - regression: root and `standard-template` tests still pass
  - manual check: confirm no artifact deletion / merge happened
  - evidence location: validation reports, Active Context, review report, and this packet

## Developer Execution Evidence
- Execution timestamp: 2026-05-17.
- Execution scope: root cutover lane only.
- Destructive artifact retirement / merge: not executed.
- Root pre-mutation targeted tests: `node --test .harness/test/starter-payload-contract.test.js .harness/test/bootstrap-runtime.test.js .harness/test/dev05-tooling.test.js .harness/test/workflow-governance.test.js` passed, 59 tests.
- `standard-template` pre-mutation targeted tests: `node --test .harness/test/dev05-tooling.test.js .harness/test/workflow-governance.test.js` passed, 50 tests.
- Root pre-mutation full suite: `npm.cmd test` passed, 98 tests.
- `standard-template` pre-mutation full suite: `npm.cmd test` passed, 89 tests.
- Root pre-mutation validator / report / context / preflight: pass; findings empty; `cutoverReady: true`.
- `standard-template` pre-mutation validator / report / context / preflight: pass; findings empty; `cutoverReady: true`.
- Root rollback boundary evidence: `rollbackBundle.missingPaths: []`; `rollbackBundle.needsOperatorBackup: false`.
- Root cutover execution command: `node .harness/runtime/state/dev05-cli.js migration-apply`.
- Root cutover execution result: `ok: true`; `applied: 0`; `changes: []`.
- Root cutover evidence report: `.agents/runtime/reports/CUTOVER_PRECHECK.md` and `.agents/runtime/reports/CUTOVER_PRECHECK.json`.
- Root post-cutover migration preview: `changeCount: 0`; `changes: []`.
- Root post-cutover validator / report / context / preflight: pass; findings empty; `cutoverReady: true`.
- `standard-template` post-cutover validator / report / context / preflight: pass; findings empty; `cutoverReady: true`.
- Destructive change check: `git diff --name-status` showed tracked modifications only, with no `D` or `R` status entries.

## Verification Manifest
- Ready For Code: approved for cutover execution only.
- root: run root targeted and full tests before and after approved execution.
- standard-template: run starter targeted and full tests before and after approved execution.
- targeted: cutover preflight, old write-path freeze, Active Context regeneration, and planner fallback routing coverage.
- validator: run root and `standard-template` validators before handoff and after execution.
- active context: regenerate and verify `ACTIVE_CONTEXT.json` / `ACTIVE_CONTEXT.md` after every state-changing step.
- review closeout: high-risk Reviewer closeout is required before Planner closeout.
- cutover preflight: must pass immediately before execution.
- rollback bundle: root rollback bundle must be concrete before execution and restorable on failure.
- preflight freshness: same-turn pre-mutation freshness gate must pass before execution.
- destructive retirement: not approved by this packet.

## Refactor / Residual Debt Disposition
- Refactor completed: none in this planning packet.
- Residual debt: final artifact retirement / merge remains separate future approval work.
- Deferred cleanup: inbound-reference scan and migration / tombstone / exemption handling for retirement candidates.
- Follow-up item: open a destructive retirement / merge approval packet only after cutover closeout and explicit user approval.

## 15. Packet Exit Quality Gate
- Packet exit metadata version: v1
- Packet exit metadata gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata exit recommendation: approve
- Packet exit metadata source parity result: approved
- Packet exit metadata validation / security / cleanup evidence: root and `standard-template` tests, validators, reports, contexts, and preflights passed; destructive artifact retirement / merge not executed
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: approve
- Implementation delta summary: approved root cutover command path executed; migration apply was a no-op with `applied: 0`
- Source parity result: approved
- Refactor / residual debt disposition: artifact retirement / merge deferred
- UX conformance result: not-needed
- Topology / schema conformance result: execution target, rollback boundary, and preflight freshness gate approved; destructive artifact retirement / merge still not approved
- Validation / security / cleanup evidence: root and `standard-template` tests, validators, reports, contexts, and preflights passed; destructive artifact retirement / merge not executed
- Deferred follow-up item: destructive artifact retirement / merge approval packet
- Closeout notes: execution approved and closed through Developer, Tester, Reviewer, and Planner evidence; destructive artifact retirement / merge remains separately gated

## Open Questions
- None. User approval, execution, verification, review, and planner closeout are recorded.

## Reopen Trigger
- User changes the approval boundary.
- Cutover target or rollback boundary changes.
- Validator, preflight, test, or Active Context evidence becomes stale or fails.
- Artifact retirement / merge is requested in the same lane.
