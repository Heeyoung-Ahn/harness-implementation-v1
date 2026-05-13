# PKT-01 OPS-16 Active Context Recovery And Safe Drift Fix

## Purpose
- Convert the approved `PLN-16` recovery direction into one concrete runtime/recovery packet.
- Add a safe operator-facing recovery path for missing or stale Active Context and derived-state drift.
- Define recovery confidence, safe-fix boundaries, and tests before implementation starts.

## Approval Rule
- This packet is written before implementation.
- This packet does not approve code changes until detailed agreement and `Ready For Code` are explicitly approved.
- Recovery may refresh derived outputs only.
- Recovery must not silently edit governance Markdown truth, approval state, workflow lane state, reviewer evidence, migration/cutover decisions, rollback decisions, or DB hot-state outside approved transition/state operations.
- Node.js 22 support remains out of scope.

## Detailed Agreement Proposal
- Command shape: use `context --repair` as the primary operator-facing command.
- Recovery report: print an operator-readable console summary and write a persistent JSON report under `.agents/runtime/recovery-reports/`.
- DB mutation boundary: OPS-16 recovery is report-only with respect to DB hot-state. It must not write DB state, approval state, lane owner, `Ready For Code` state, reviewer evidence, or packet state.
- Future alias: a `recover-context` alias may be considered only after operator testing shows discoverability problems; OPS-16 must not add a broader recovery control plane.
- Approval boundary: this detailed agreement proposal still does not approve implementation. `Ready For Code` remains a separate user approval.

## Detailed Agreement Approval Text
Detailed agreement is approved for OPS-16 with the following closed decisions:
- primary command: `context --repair`
- output: console summary plus persistent JSON recovery report
- report path: `.agents/runtime/recovery-reports/`
- report evidence: timestamped report file is the durable evidence artifact
- DB boundary: no DB hot-state mutation in OPS-16
- recovery scope: derived-output-only regeneration
- confidence reporting: `High`, `Medium`, `Low`, or `Blocked`
- safe-fix deny enforcement: no authority-state mutation
- implementation remains blocked until separate `Ready For Code` approval

## Detailed Agreement Approval Decision
- User approved OPS-16 detailed agreement on 2026-05-13.
- This approval covers `context --repair`, console summary, timestamped persistent JSON recovery report, DB report-only boundary, derived-output-only regeneration, `High` / `Medium` / `Low` / `Blocked` confidence reporting, and safe-fix deny enforcement.
- This approval does not authorize implementation.
- `Ready For Code` remains blocked until separately approved.

## Ready For Code Approval Decision
- User approved Ready For Code for OPS-16 on 2026-05-13.
- Implementation is limited to `context --repair` with console summary, persistent JSON recovery report, derived-output-only regeneration, no DB hot-state mutation, confidence calculation, safe-fix deny enforcement, and focused root / `standard-template` tests.
- Implementation must stop and return to Planner if it needs governance Markdown mutation, DB hot-state mutation, workflow gate implementation, broad validator redesign, or scope outside OPS-16.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-16 Active Context recovery and safe drift fix | stale/missing re-entry state is a high-risk bypass trigger for ordinary operators | review-complete |
| Ready For Code | approved | user approved implementation inside the bounded OPS-16 repair/report/test scope | approved |
| Human sync needed | yes | detailed agreement and Ready For Code are approved for the bounded OPS-16 scope | approved |
| Gate profile | contract | this affects reusable runtime state, generated docs, Active Context, validation, and root/starter parity | approved |
| User-facing impact | medium | operators will use this when re-entry state is stale or confusing | draft |
| Layer classification | core | Active Context recovery is reusable harness behavior | draft |
| Active profile dependencies | none | no optional profile is active | not-needed |
| Profile evidence status | not-needed | no profile-specific evidence required | not-needed |
| Shared-source wave status | not-needed | this packet does not introduce a multi-packet authoritative source wave | not-needed |
| Existing system dependency | none | no existing product or legacy system dependency is changed | not-needed |
| New authoritative source impact | analyzed | user-approved `PLN-16` converts the prior review into this packet; no new external source is introduced | analyzed |
| UX archetype status | approved | existing operator evidence/context CLI archetype is sufficient for this repair surface | approved |
| Environment topology status | not-needed | no deploy/cutover topology is changed | not-needed |
| Domain foundation status | not-needed | no data-domain work is included | not-needed |
| Authoritative source intake status | approved | `PLN-15` and approved `PLN-16` define the scope | approved |
| Packet exit gate status | approved | implementation, Tester verification, validation, and Reviewer closeout evidence are complete | approved |
| Risk if started now | medium | unsafe auto-fix could mutate authority state if boundaries are not enforced | draft |

## 1. Goal
- Provide a safe recovery flow when `.agents/runtime/ACTIVE_CONTEXT.json` or `.agents/runtime/ACTIVE_CONTEXT.md` is missing, stale, or inconsistent with generated state.
- Provide a recovery confidence result: `High`, `Medium`, `Low`, or `Blocked`.
- Provide a safe derived-output fix boundary for generated docs and Active Context.
- Prevent validator/recovery from mutating authority state.

## 2. Non-Goal
- Do not rewrite `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `.agents/artifacts/CURRENT_STATE.md`, or `.agents/artifacts/TASK_LIST.md`.
- Do not change packet approval state.
- Do not change workflow lane owner or active task owner except through existing approved transition/state operations.
- Do not generate reviewer approval evidence.
- Do not change migration, cutover, or rollback decisions.
- Do not lower or audit the Node.js runtime requirement.
- Do not implement tiered starter modes, workflow hard gates, or multi-model conflict resolution in this packet.

## 3. User Problem And Expected Outcome
- Current problem:
  Operators and AI sessions rely on Active Context as the first re-entry surface. If it is missing, stale, or inconsistent, the operator can misread current work, bypass the harness, or start broad manual file edits.
- Expected outcome:
  The operator can run one approved recovery path, see what was regenerated, see what was not modified, see confidence, and know whether they may continue or must stop for Planner/maintainer reconciliation.

## 4. In Scope
- Recovery command shape decision:
  - primary command: `context --repair`
  - no broad recovery control plane
  - `recover-context` may only be considered later as an alias if operator testing proves discoverability problems
- Regenerate derived Active Context outputs when safe.
- Regenerate generated state docs if required by the selected recovery flow and safe.
- Produce recovery report output with:
  - persistent JSON report under `.agents/runtime/recovery-reports/`
  - console summary
  - source paths inspected
  - stale/missing artifacts
  - regenerated artifacts
  - artifacts explicitly not modified
  - confidence result
  - required next action
- Add confidence calculation inputs.
- Add safe-fix allow/deny enforcement.
- Add focused tests in root and `standard-template`.

## 5. Out Of Scope
- Broad validator redesign.
- General auto-correction for governance Markdown.
- DB schema redesign.
- Workflow transition hard gates.
- Full tiered-starter implementation.
- Manual finalization; operator manual insertion belongs to later `OPS-17`.

## 6. Detailed Behavior
- Trigger:
  operator or AI detects missing/stale Active Context, validation reports stale derived output, or session-start context read is unreliable.
- Main flow:
  1. inspect governance SSOT presence / source metadata
  2. inspect DB hot-state readability
  3. inspect generated docs freshness
  4. inspect Active Context freshness
  5. inspect active packet owner / approval clarity
  6. inspect latest validation result when available
  7. regenerate only safe derived outputs
  8. write a persistent JSON recovery report
  9. emit recovery confidence and next action in the console summary
- Error state:
  Low or Blocked confidence must stop implementation and closeout transitions until reconciliation.
- Alternate flow:
  Medium confidence may continue only if the recovery report is referenced in packet evidence before closeout.

## 7. Recovery Confidence Contract
| Confidence | Condition | Required action |
|---|---|---|
| High | governance SSOT present, DB readable, generated docs fresh or regenerated, Active Context regenerated, active owner/approval clear, and latest validation is clean after regeneration | continue normal workflow |
| Medium | governance SSOT and DB align, but generated docs or Active Context were missing/stale and were repaired | continue only with recovery report evidence |
| Low | governance SSOT and DB conflict, or source metadata cannot establish alignment | hold for Planner/maintainer reconciliation |
| Blocked | active packet owner, approval state, lane state, or required authority source is unclear | stop; request human/Planner decision |

Confidence calculation inputs:
- governance SSOT presence / checksum or source metadata
- DB hot-state readable status
- generated docs freshness
- Active Context freshness
- active packet owner / approval clarity
- latest validation result

Confidence clarification:
- `High` requires clean validation after regeneration.
- If validation is unavailable but no source/authority conflict is detected, confidence must not exceed `Medium`.
- Validation failure caused only by stale derived outputs that were repaired should result in `Medium`, not `High`, unless validation is clean after repair.
- Validation failure caused by authority/source conflict should result in `Low`.
- Validation failure caused by owner, approval, lane, or packet ambiguity should result in `Blocked`.

## 8. Safe-Fix Boundary
Allowed automatic fixes:
- generated state docs regeneration
- Active Context JSON regeneration
- Active Context Markdown regeneration
- derived validation summary/report refresh only when already supported by existing command behavior
- derived index/cache refresh if deterministic and source-traced

Forbidden automatic fixes:
- governance Markdown truth mutation
- packet approval state mutation
- workflow lane / owner mutation
- Ready For Code state mutation
- reviewer evidence creation or mutation
- migration / cutover / rollback decision mutation
- DB hot-state mutation outside allowed state operations

OPS-16 DB mutation rule:
- `context --repair` must not write DB hot-state.
- Recovery metadata must be report-only in this packet.
- Any future DB field for derived regeneration metadata requires a separate approved schema/state-operation packet.

Forbidden DB mutation examples:
- validator `--fix-safe` changing approval state
- validator changing lane owner
- validator changing Ready For Code state
- recovery generating reviewer evidence
- recovery writing packet state or derived-regeneration metadata to DB in OPS-16

## 9. Recovery Report Contract
`context --repair` must print a short console summary and write a persistent JSON recovery report.

Report path:
- `.agents/runtime/recovery-reports/context-repair-<timestamp>.json`
- `latest-context-repair.json` may be written as a convenience pointer only if it is deterministic and derived from the same report content.

Report evidence rule:
- The timestamped report is the durable evidence artifact.
- `latest-context-repair.json` is only a derived convenience pointer and must not be cited as durable packet evidence when a timestamped report exists.

Required JSON fields:
```json
{
  "command": "context --repair",
  "timestamp": "...",
  "confidence": "High | Medium | Low | Blocked",
  "sourcePathsInspected": [],
  "staleOrMissingArtifacts": [],
  "regeneratedArtifacts": [],
  "notModifiedArtifacts": [],
  "validationStatus": "clean | failed | unavailable",
  "requiredNextAction": "...",
  "authorityMutation": false,
  "dbMutation": "none"
}
```

Evidence rule:
- `Medium` confidence requires the recovery report path in packet evidence before closeout.
- `Low` or `Blocked` confidence blocks implementation and closeout continuation until reconciliation.
- Recovery should attempt validation after regeneration unless a `Blocked` condition is detected before validation can safely run.

OPS-16 / OPS-18 boundary:
- In OPS-16, `Low` or `Blocked` confidence must emit a hold status, required next action, and packet evidence requirement.
- OPS-16 must not implement broad workflow transition gates.
- Direct enforcement beyond existing validation behavior belongs to `OPS-18_WORKFLOW_GATES_BY_STARTER_MODE`.

## 10. Data / Source Impact
- Layer classification: core
- Active profile dependencies: none
- Required reading before code: see the source list below.
  - `reference/planning/PLN-15_HARNESS_RESILIENCE_COMPATIBILITY_AND_SCALE_FIT_DRAFT.md`
  - `reference/planning/PLN-16_OPERATOR_ADOPTION_AND_TIERED_GOVERNANCE_CONTRACT_DRAFT.md`
  - `.agents/artifacts/REQUIREMENTS.md`
  - `.agents/artifacts/ARCHITECTURE_GUIDE.md`
  - `.agents/artifacts/IMPLEMENTATION_PLAN.md`
  - `.harness/runtime/state/dev05-cli.js`
  - `.harness/runtime/state/dev05-tooling.js`
  - `.harness/runtime/state/generate-state-docs.js`
  - `.harness/runtime/state/drift-validator.js`
  - `.harness/test/*.test.js`
- UX archetype reference: existing operator evidence/context CLI surface; no new product UI archetype is introduced.
- Selected UX archetype: operator evidence/context CLI repair surface.
- Authoritative source intake reference: `reference/planning/PLN-16_OPERATOR_ADOPTION_AND_TIERED_GOVERNANCE_CONTRACT_DRAFT.md`
- Authoritative source disposition: approved planning basis converted into this draft task packet.
- Current implementation impact: `.harness/runtime/state/dev05-cli.js`, `.harness/runtime/state/active-context.js`, `.harness/runtime/state/dev05-tooling.js`, `.harness/runtime/state/generate-state-docs.js`, `.harness/runtime/state/drift-validator.js`, root tests, and `standard-template` synced counterparts may be affected after Ready For Code.
- Existing plan conflict: no conflict with `PLN-15` or `PLN-16`; existing context generation lacks the explicit repair, confidence, and safe-fix operator contract defined here.
- Impacted packet set scope: single-packet.
- DB / state impact:
  no schema change is approved; OPS-16 recovery is DB report-only and must not write hot-state.
- Markdown / docs impact:
  packet and possible lightweight guidance notes only; manual finalization deferred.
- generated docs impact:
  recovery may regenerate derived docs as part of approved behavior.
- validator / cutover impact:
  validator may detect drift; safe-fix behavior must remain constrained to derived outputs.

## 11. Acceptance
- A missing Active Context can be regenerated from approved sources without editing governance Markdown.
- A stale Active Context recovery report identifies what was stale, what was regenerated, and what was not modified.
- `context --repair` is the primary command surface for OPS-16.
- Recovery prints a console summary and writes a persistent JSON report under `.agents/runtime/recovery-reports/`.
- Recovery emits `High`, `Medium`, `Low`, or `Blocked` confidence.
- `Medium` confidence requires packet evidence before closeout.
- `Low` and `Blocked` confidence prevent implementation/closeout continuation.
- Safe-fix cannot mutate approval state, workflow owner/lane, reviewer evidence, or cutover/rollback decisions.
- Recovery does not mutate DB hot-state in OPS-16.
- Root and `standard-template` behavior remain synchronized.

## 12. Open Questions
- Which existing tests are best split into focused recovery tests without expanding already large test files?

## 13. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Command shape | yes | user/planner | approved | primary command is `context --repair`; alias deferred |
| Recovery report format | yes | user/planner | approved | console summary plus timestamped persistent JSON report |
| Recovery confidence contract | yes | user/planner | approved | High/Medium/Low/Blocked behavior |
| Safe-fix allow/deny list | yes | user/planner | approved | authority mutation must stay blocked |
| DB mutation boundary | yes | user/planner | approved | report-only; no DB hot-state mutation in OPS-16 |
| Detailed agreement | yes | user/planner | approved | approved by user on 2026-05-13; implementation still requires Ready For Code |
| Ready For Code | yes | user | approved | approved by user on 2026-05-13 for the bounded OPS-16 scope |

## 14. Implementation Notes
- Prefer extending existing context/generation paths over adding a broad new control plane.
- Keep output understandable for non-technical operators.
- Keep recovery deterministic and source-traced.
- If implementation requires broad validator or DB redesign, stop and reopen planning.

## Verification Plan
- Gate profile: contract
- Add or update focused tests for:
  - missing Active Context regeneration
  - stale Active Context regeneration
  - persistent JSON recovery report shape
  - console summary presence
  - Medium confidence recovery report requirement
  - Low/Blocked continuation hold
  - safe-fix deny list for authority state
  - no DB hot-state mutation during `context --repair`
  - root / `standard-template` parity
- Required commands after implementation:
  - root `node --test .harness/test/*.test.js`
  - `standard-template` `node --test .harness/test/*.test.js`
  - root `node .harness/runtime/state/dev05-cli.js validate`
  - root `node .harness/runtime/state/dev05-cli.js validation-report`
  - root `node .harness/runtime/state/dev05-cli.js context`

## Verification Manifest
- Gate profile:
  - contract: detailed agreement, Ready For Code, root sync, standard-template sync, targeted tests, root test suite, starter test suite, validator, validation-report, active-context evidence, recovery report evidence, review closeout
- Required evidence:
  - targeted root recovery regression: `node --test .harness/test/context-repair.test.js`
  - targeted `standard-template` recovery regression: `node --test .harness/test/context-repair.test.js`
  - root full harness suite: `node --test .harness/test/*.test.js`
  - `standard-template` full harness suite: `node --test .harness/test/*.test.js`
  - root validator: `node .harness/runtime/state/dev05-cli.js validate`
  - root validation report: `node .harness/runtime/state/dev05-cli.js validation-report`
  - root active context: `node .harness/runtime/state/dev05-cli.js context`
  - recovery command evidence: `node .harness/runtime/state/dev05-cli.js context --repair`
- Source parity:
  - root and `standard-template` runtime/test changes must remain synchronized for the OPS-16 recovery surface.

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference:
  `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation:
  approve; implementation, Tester verification, validation, and Reviewer closeout evidence are complete.
- Source parity result:
  pass; root and `standard-template` runtime and focused-test surfaces are synchronized for OPS-16 after Reviewer parity cleanup.
- Validation / security / cleanup evidence:
  Developer evidence:
  - root `node --test .harness/test/context-repair.test.js`: pass
  - `standard-template` `node --test .harness/test/context-repair.test.js`: pass
  - root `node --test .harness/test/*.test.js`: pass, 80 tests
  - `standard-template` `node --test .harness/test/*.test.js`: pass, 71 tests
  - root `node .harness/runtime/state/dev05-cli.js context --repair`: pass, `High`, report `.agents/runtime/recovery-reports/context-repair-2026-05-13T142603662Z.json`
  - root `node .harness/runtime/state/dev05-cli.js validation-report`: pass
  - root `node .harness/runtime/state/dev05-cli.js context`: pass
  - root `node .harness/runtime/state/dev05-cli.js validate`: pass, findings `[]`
  Tester evidence:
  - root `node --test .harness/test/context-repair.test.js`: pass, 2 tests
  - `standard-template` `node --test .harness/test/context-repair.test.js`: pass, 2 tests
  - root `node --test .harness/test/*.test.js`: pass, 80 tests
  - `standard-template` `node --test .harness/test/*.test.js`: pass, 71 tests
  - root `node .harness/runtime/state/dev05-cli.js context --repair`: pass, `High`, report `.agents/runtime/recovery-reports/context-repair-2026-05-13T144346435Z.json`
  - root `node .harness/runtime/state/dev05-cli.js validation-report`: pass, gate decision `pass`, findings `[]`
  - root `node .harness/runtime/state/dev05-cli.js validate`: pass, findings `[]`
  - root `node .harness/runtime/state/dev05-cli.js context`: pass, route `.agents/workflows/review.md` after Tester handoff
  Reviewer evidence:
  - Reviewer found one root/starter source-parity cleanup item in `context-repair.js`; Developer cleanup removed the unused root-only projection field.
  - root `node --test .harness/test/context-repair.test.js`: pass after cleanup
  - root and `standard-template` `context-repair.js` hashes match after cleanup
  - root `node .harness/runtime/state/dev05-cli.js validation-report`: pass, gate decision `pass`, findings `[]`
  - root `node .harness/runtime/state/dev05-cli.js validate`: pass, findings `[]`
  - root `node .harness/runtime/state/dev05-cli.js context`: pass, route `.agents/workflows/review.md`
  - `git diff --check`: pass
- Deferred follow-up item:
  `OPS-18_WORKFLOW_GATES_BY_STARTER_MODE`, `QLT-04_GOVERNANCE_TEST_REBALANCE`, `PLN-17_MULTI_MODEL_OWNERSHIP_AND_CONFLICT_CONTRACT`, `OPS-17_OPERATOR_GLOSSARY_PROFILE_RESET_AND_SAFE_FIX_GUIDANCE`.

## 16. Ready For Code Approval Text
Ready For Code must be separately approved with wording equivalent to:

```text
Ready For Code is approved for OPS-16 only for implementing `context --repair` with console summary, persistent JSON recovery report, derived-output-only regeneration, no DB hot-state mutation, confidence calculation, safe-fix deny enforcement, and focused root / standard-template tests.
```

Ready For Code status:
- approved by user on 2026-05-13.

## 17. Reopen Trigger
- Recovery needs to edit governance Markdown truth.
- Recovery needs to change approval state, lane owner, reviewer evidence, migration/cutover, or rollback decisions.
- Recovery needs to write DB hot-state in OPS-16.
- Confidence calculation cannot be made deterministic.
- Root and `standard-template` recovery behavior diverge.
- The command shape expands into unrelated workflow gate or tiered starter implementation.
