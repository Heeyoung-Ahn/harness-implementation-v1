# PKT-01 DEV-05 Validator Migration Cutover

## Purpose
This packet closes the first-ship tooling contract for validator, migration preview, cutover preflight, and cutover evidence reporting on top of the standardized repository harness structure.

## Approval Rule
- This packet defines operator-facing tooling and cutover rules before extending the harness release lane.
- If validator scope, migration semantics, rollback expectations, or cutover gate logic change, reopen this packet before changing the tooling contract.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | DEV-05 validator / migration / cutover tooling | first ship needs executable gate tooling, not only document rules | active |
| Validator entrypoint | approve | the existing validator logic already exists and should be exposed as a stable command | approved |
| Migration mode | approve preview-first | source refs and artifact paths must be reviewed before cutover changes are accepted | approved |
| Cutover gate | approve | cutover must fail on validator errors or unresolved path migration preview changes | approved |
| Rollback expectation | approve | operators need a concrete rollback bundle before cutover can be considered safe | approved |
| Cutover evidence report | approve | operators should be able to persist the preflight result without re-running ad-hoc inspection | approved |

## 1. Goal
- expose validator, migration preview, and cutover preflight as explicit tooling entrypoints
- expose cutover report generation as an explicit tooling entrypoint
- keep the standardized `.agents` / `reference` path contract enforceable in code
- ensure the cutover lane is blocked when generated docs drift or source refs still point to pre-standardized paths
- provide a concrete rollback bundle definition that an operator can follow without reconstructing the flow from memory

## 2. Non-Goal
- remote deployment
- production release automation
- destructive migration by default
- PMW write-mode changes
- multi-project orchestration

## 3. User Problem And Expected Outcome
- current problem:
  the harness has validator logic, but it is not yet exposed as a clean operator tooling lane. migration status and cutover readiness still require code knowledge or ad-hoc inspection.
- expected outcome:
  the operator can run a validator command, inspect a migration preview, run one cutover preflight command, and persist the result as a reusable cutover evidence report.

## 4. In Scope
- validator command entrypoint
- standardized path migration preview
- optional migration apply helper for source-ref and artifact-path normalization
- cutover preflight command
- cutover report command that writes markdown and json evidence files
- rollback bundle description
- tests for the new tooling behavior

## 5. Out Of Scope
- remote backup upload
- release tagging
- downstream project rollout automation
- PMW UX redesign

## 6. Detailed Behavior
- trigger:
  the operator runs one of the DEV-05 tooling commands
- validator flow:
  open the repo-local store -> validate generated docs and source refs -> return structured result
- migration preview flow:
  inspect release state, work items, decisions, risks, handoffs, and artifacts -> compare each stored path against the standardized path map -> return proposed changes without mutating by default
- migration apply flow:
  only when explicitly requested, apply the standardized path map to the repo-local store and return the applied changes
- cutover preflight flow:
  run validator -> run migration preview -> assemble rollback bundle -> fail when validator has blocking findings or migration preview still has pending changes

## 7. Program Function Detail
- inputs:
  `.harness/operating_state.sqlite`, `.agents/artifacts/*`, `.agents/runtime/generated-state-docs/*`, `reference/*`
- outputs:
  structured JSON result for validator, migration preview, migration apply, cutover preflight, and cutover report
- rollback bundle:
  DB path, generated docs paths, and core live artifact paths
- edge cases:
  missing generated docs, stale checksums, unresolved source refs, utf8 BOM, pre-standardized source refs, empty stores

## 8. Source-To-Surface Mapping
| User Need | Tool Surface | Primary Source | Fallback |
|---|---|---|---|
| generated docs integrity | validator | `.agents/runtime/generated-state-docs/*` + DB generation state | explicit error finding |
| source ref normalization status | migration preview | repo-local DB rows | empty change set |
| cutover readiness | cutover preflight | validator result + migration preview result | blocking result with rollback guidance |
| rollback path | cutover preflight detail | DB path + generated docs + core artifacts | explicit `needs operator backup` note if any file is missing |

## 9. Acceptance
- operator can run a validator entrypoint without opening source files
- operator can inspect a migration preview showing which repo-relative paths still need normalization
- cutover preflight fails when validator findings block cutover
- cutover preflight fails when migration preview still contains unresolved path changes
- cutover report writes reusable markdown/json evidence files
- rollback bundle includes the repo-local DB and generated docs paths
- tests cover both passing and failing DEV-05 scenarios

## 10. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| validator scope | yes | human operator | closed | first-ship validator scope already approved in the requirements baseline |
| migration preview semantics | yes | human operator | closed | preview-first behavior is approved for first ship |
| cutover blocker rule | yes | human operator | closed | unresolved validator errors or migration changes block cutover |

## 11. Verification Plan
- unit test validator entrypoint success and failure cases
- unit test migration preview detection for legacy paths
- unit test migration apply normalizes the store
- unit test cutover preflight success and failure cases
- unit test cutover report generation

## 12. Reopen Trigger
- cutover starts mutating remote systems
- migration moves beyond repo-relative path normalization
- rollback requires additional artifacts not listed in the current bundle
