# PKT-01 OPS-03 Harness Operation Reliability And Friction Reduction

## Purpose
This packet rebaselines `OPS-03` as one core improvement lane covering three related problems:

- reduce recurring harness-operation friction and token/time cost
- prevent approval-state and source-of-truth inconsistency after interruptions or manual state edits
- fully incorporate the attached `andrej-karpathy-skills-main.zip` agent behavior guide as reusable agent behavior guidance, adapted so it strengthens rather than bypasses the harness SSOT, approval, workflow, Tester, and Reviewer contracts

The lane preserves the governance guarantees that caught prior SSOT, routing, PMW projection, and release-baseline drift.

## Approval Rule
- This packet is written before restarting implementation.
- This packet is a reusable core harness lane and does not activate optional profiles.
- This packet may plan changes to workflow guidance, state-transition tooling, approval-state validation, generated-doc/read-model metadata, packet templates, skills, manuals, PMW artifact-library behavior, and starter synchronization rules.
- This packet must not weaken packet-before-code, human approval boundaries, PMW read-only authority, generated-doc immutability, Tester/Reviewer separation, or root/starter reusable sync rules.
- A partial `OPS-03` implementation was left in the worktree after an interrupted session on 2026-05-02. That partial implementation is evidence for Developer/Reviewer reconciliation, not approved closeout.
- Detailed agreement and `Ready For Code` were approved by the user on 2026-05-02 for the earlier OPS-03 scope.
- The 2026-05-03 user clarification superseded the earlier thin-guidance assumption and reopened Planner scope before further Developer work.
- The revised Planner agreement for sufficient behavior-guide adoption, project-design SSOT precedence, workflow closeout reporting, and PMW design-artifact access was finalized on 2026-05-03.
- The user explicitly approved `Ready For Code for revised scope` on 2026-05-03 and directed Developer to start implementation.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-03 Harness operation reliability and friction reduction | The reported issues share one root theme: preserve governance while reducing manual state work, improving agent behavior discipline, and making the agreed design baseline easier to inspect | approved |
| Ready For Code | approved | User explicitly approved the finalized 2026-05-03 revised scope and directed Developer to start implementation | approved |
| Human sync needed | no | Revised agreement and revised Ready For Code are approved; Developer resumes under this packet | approved |
| Gate profile | contract | OPS-03 changes reusable workflow, validator, generated docs, PMW read-model metadata, packet/skill guidance, PMW artifact-library behavior, and root/starter sync behavior | approved |
| User-facing impact | medium | Operators should see clearer gates, approval status, and transition state; no product UI redesign is planned | approved |
| Layer classification | core | This changes reusable harness operation behavior across future projects | approved |
| Active profile dependencies | none | No optional profile is required | not-needed |
| Profile evidence status | not-needed | Active profile set is empty | not-needed |
| UX archetype status | approved | Existing reading-desk operator pattern should be preserved; only metadata/surface clarity may change | approved |
| UX deviation status | none | No deviation from the existing PMW reading-desk pattern is planned | approved |
| Domain / schema status | not-needed | No product data schema change is planned | not-needed |
| Environment topology status | not-needed | This is not a deploy/cutover topology lane | not-needed |
| Domain foundation status | not-needed | No product data or schema design is involved | not-needed |
| Authoritative source intake status | approved | User feedback and attached ZIP are authoritative inputs for this packet; disposition is recorded in this packet | approved |
| Shared-source wave status | not-needed | No multi-packet authoritative source wave is involved | not-needed |
| Packet exit gate status | pending | Implementation must pass Tester verification and Reviewer closeout after rebaseline | draft |
| Improvement promotion status | approved | Existing preventive-memory candidate is expanded by user direction into this OPS-03 planning lane | approved |
| Existing system dependency | none | No legacy application or DB integration is involved | not-needed |
| New authoritative source impact | yes | `andrej-karpathy-skills-main.zip` affects agent behavior guidance and must be dispositioned | approved |

## 1. Goal
- Introduce risk-based gate profiles so low-risk work does not always require full release-grade ceremony.
- Add approval and transition controls that prevent packet headers, DB decisions, canonical docs, generated docs, PMW export, validation report, and handoff log from drifting apart.
- Separate current operational state from long closed-lane history so context restoration stays fast and accurate.
- Add a sufficiently integrated agent behavior contract based on the attached Karpathy-style guidance: state assumptions, expose ambiguity, present tradeoffs, push back when warranted, keep solutions simple, make surgical edits, and define verifiable success criteria against the approved project-design SSOT.
- Preserve strict gates for reusable runtime, release, security, schema, topology, and PMW command-boundary changes.

## 2. Non-Goal
- Remove packet-before-code for implementation work.
- Let PMW become canonical write authority.
- Make generated docs manually editable.
- Bypass human approval boundaries.
- Replace Planner, Tester, or Reviewer responsibilities with Developer self-approval.
- Import the attached ZIP as an unreviewed runtime dependency or treat it as a replacement for this harness governance model.
- Implement arbitrary shell execution or weaken the DEV-09 PMW command launcher boundary.
- Change release packaging.

## 3. Source And Root Cause Analysis
- User feedback on 2026-05-02 identified that repeated harness alignment consumes too much time and token budget.
- The interrupted `OPS-03` session left a split state: packet header rows claimed `Ready For Code approved`, while canonical `CURRENT_STATE`, `TASK_LIST`, DB `decision_registry`, and PMW export still held `OPS-03` as pending.
- File timestamps show implementation-like changes after 18:42, while generated docs and PMW export were not fully regenerated afterward.
- Root `npm test` was left failing 3 tests, root `harness:validate` reported starter sync drift and packet status mismatch, while `standard-template` and `pmw-app` tests passed. This indicates partial implementation, not closeout.
- Root cause: approval capture, workflow transition, DB update, canonical Markdown update, generated docs, validation report, PMW export, and handoff evidence are still too manual and not atomic.
- Attached source: `C:/Users/ahyne/Downloads/andrej-karpathy-skills-main.zip`.
- Attached-source disposition: fully adopt the behavior guide's substance into reusable harness guidance and validation expectations, while adapting packaging and wording to this repository's governance model; do not add the ZIP itself as a runtime dependency.

## 4. Proposed Scope
- Layer classification: core
- Required reading before code: `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `.agents/artifacts/PREVENTIVE_MEMORY.md`, `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`, this packet
- UX archetype reference: `reference/artifacts/PRODUCT_UX_ARCHETYPE.md`
- Selected UX archetype: reading-desk
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Environment topology reference: not-needed
- Domain foundation reference: not-needed
- Authoritative source intake reference: this packet, section `Source And Root Cause Analysis`
- Authoritative source disposition: user feedback is incorporated into expanded OPS-03 planning; attached ZIP guidance is sufficiently adopted as reusable workflow/skill/manual/validation guidance; plugin packaging and direct ZIP dependency are deferred because the harness must keep its own SSOT and role-governance model.
- Current implementation impact: interrupted partial OPS-03 implementation exists and must be reconciled against this expanded scope before Developer continuation.
- Existing plan conflict: previous OPS-03 packet treated operation friction as the main scope and contained contradictory approval status; this rebaseline supersedes that narrower pending/approved mix.
- Impacted packet set scope: single active packet, `OPS-03`; closed DEV-07/DEV-08/DEV-09 evidence remains reference-only and is not reopened.
- Shared-source wave ledger reference: not-needed

## 5. Detailed Scope
- Gate profiles:
  - `light`: docs-only or note-only updates with no executable, runtime, generated-surface, or reusable contract impact.
  - `standard`: normal implementation packets with approved packet scope, targeted tests, validator, and handoff evidence.
  - `contract`: reusable runtime, workflow, PMW command/read-model, validator, packet-template, skill, or root/starter sync changes.
  - `release`: packaging, installer, manual, cutover, security, or release-baseline changes.
- Approval-state consistency:
  - Add validator checks that fail when packet `Ready For Code` status disagrees with DB decision state or work-item metadata.
  - Require a source-traced approval event before `planner -> developer` transition.
  - Keep packet header, DB `decision_registry`, DB work-item metadata, canonical docs, generated docs, PMW export, validation report, and handoff log aligned through one transition path.
  - Treat packet-header-only approval as invalid for implementation handoff.
- Transition automation:
  - Add or finish `harness:transition` behavior with preview-first semantics.
  - Apply mode must update DB, canonical docs, generated docs, PMW export, validation report, and handoff evidence together.
  - Fail when requested transition conflicts with current task owner, workflow route, packet approval state, validation findings, or root/starter sync status.
- Current-state/history separation:
  - Keep `CURRENT_STATE.md` focused on current stage, active focus, open decisions/blockers, must-read next, and latest few handoffs.
  - Move long closed-lane narrative to `PROJECT_PROGRESS.md`, review reports, packet closeouts, or derived generated history.
  - Keep PMW and context restoration source-traceable after the split.
- Agent behavior guide adoption:
  - Add reusable guidance for `Think Before Coding`, `Simplicity First`, `Surgical Changes`, and `Goal-Driven Execution` across root and `standard-template` role workflows, day-start/day-wrap-up skills, and operator-facing manual guidance.
  - Preserve the guide's practical behavior checks: explicit assumptions, visible uncertainty, clarification before risky guesses, tradeoff surfacing, warranted pushback, no speculative features, no single-use abstraction, no drive-by refactors, cleanup only for changes made in the current work, and success criteria tied to concrete verification.
  - Adapt the guidance to this harness: Planner owns scope/acceptance and approval boundaries, Developer implements against the approved SSOT, Tester verifies implementation against requirements/acceptance without fixing defects directly, Reviewer decides closeout against evidence, and every non-trivial change must trace changed lines to the active user request or approved packet.
  - Add validator or regression coverage that confirms the reusable behavior guidance is present in root and `standard-template` workflows/skills, so adoption cannot silently regress.
  - Do not add the ZIP as a runtime dependency or let external plugin structure override this repository's workflow contracts.
- Workflow closeout reporting:
  - Every role workflow must end with two user-facing blocks: `Current Work` and `Next Work`.
  - `Current Work` must report work completed in this turn, issues encountered in this turn, and decisions made in this turn.
  - `Next Work` must report the next recommended workflow, concrete next work, expected issues or risks, and expected decisions or approval points.
  - Root and `standard-template` workflow copies must stay synchronized.
- Project design SSOT precedence:
  - Treat human-and-Planner-approved project design SSOT as the instruction layer that guides all other agents.
  - Developer must implement to `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, active packet acceptance, and any approved design/source artifacts.
  - Tester must verify the implementation against those same SSOT artifacts and hand mismatches back to Developer rather than fixing them directly.
  - Reviewer must check source parity, evidence, residual debt, and whether Developer/Tester behavior followed the approved SSOT.
- PMW Artifact Library design access:
  - Widen the artifact body reading area so long design documents are readable without excessive wrapping.
  - Add a stable project-design/overview category that keeps `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, and other whole-project design/overview artifacts always discoverable.
  - Preserve PMW as a read surface: design artifacts are always visible for context, but PMW does not become write authority.
- Interrupted implementation disposition:
  - Developer must inspect existing partial `OPS-03` diffs before continuing.
  - Keep, revise, or drop each partial change based on the expanded packet scope.
  - Tester must verify the previously failing root tests and validator after Developer reconciliation.

## Developer Entry Scope
- Developer workflow was approved to start under the 2026-05-02 scope, but this is now paused by the 2026-05-03 Planner rebaseline.
- First Developer action after revised handoff: audit the existing partial `OPS-03` implementation and the later remediation evidence against the revised scope before adding new code.
- Audit output must classify each partial change as `keep`, `revise`, or `drop`, with rationale tied to the approved expanded packet.
- Audit must include root/starter sync impact, test impact, validator impact, and whether the change belongs in this packet or should be deferred.
- Developer must not treat the partial implementation as closeout evidence until reconciliation, tests, validator, PMW export, validation report, Tester verification, and Reviewer closeout are complete.

## Developer Partial Implementation Audit
- Audit timestamp: 2026-05-02 after explicit `Ready For Code` approval.
- Audit result: continue implementation by revising and synchronizing the partial changes; do not treat the interrupted implementation as closeout evidence.
- Current root verification: `npm.cmd test` fails 3 of 38 tests.
- Current starter verification: `npm.cmd test` in `standard-template/` passes 36 of 36 tests.
- Current PMW app verification: `npm.cmd test` in `pmw-app/` passes 2 of 2 tests.
- Current validator: `npm.cmd run harness:validate` fails on root/starter reusable sync drift and cutover preflight hold.

| Area | Files | Audit Classification | Rationale | Required Developer Follow-up |
|---|---|---|---|---|
| Gate profile contract | `.harness/runtime/state/gate-profiles.js`, `.harness/runtime/state/drift-validator.js`, `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md` | keep + revise | The `light / standard / contract / release` taxonomy matches the approved scope and validator enforcement is in the right layer, but starter sync is incomplete | Copy/synchronize reusable runtime, tests, and packet template into `standard-template/`; keep validator behavior tied to active packet scope |
| Transition helper | `.harness/runtime/state/dev05-cli.js`, `.harness/runtime/state/dev05-tooling.js`, `package.json` | keep + revise | Preview-first `harness:transition` matches the approved scope, and apply mode writes DB, canonical docs, generated docs, PMW export, validation report, and handoff evidence, but root test evidence shows apply does not yet close cleanly | Fix root transition test failure, ensure generated/canonical updates remain deterministic, and synchronize command/runtime/test support into `standard-template/` |
| PMW/context read-model metadata | `.harness/runtime/state/context-restoration-read-model.js`, `.harness/test/pmw-read-surface.test.js` | keep + revise | Gate profile display, command expected effects, confirmation metadata, and handoff baton metadata support OPS-03 and DEV-09 operator clarity, but root and starter surfaces are not fully synchronized | Update root test expectation for terminal-only `transition`, synchronize starter read-model behavior, and verify PMW export evidence |
| PMW app command surface | `pmw-app/runtime/server.js`, `pmw-app/test/server.test.js` | keep, no immediate OPS-03 blocker | PMW app tests pass and the changes preserve the approved phase-1 command boundary with confirmation for handoff/pmw-export | Preserve while reconciling OPS-03; do not expand into arbitrary shell or new launcher commands |
| Agent behavior guidance | `.agents/skills/day_start/SKILL.md`, `.agents/skills/day_wrap_up/SKILL.md`, starter skill copies | revise | The original thin-guidance disposition is superseded by the 2026-05-03 user clarification. Guidance must now be sufficiently integrated while still avoiding a runtime ZIP dependency and preserving harness role boundaries. | Expand root/starter workflow, skill, manual, and validation expectations to cover the full four-principle behavior contract |
| Validation evidence | `.harness/test/dev05-tooling.test.js`, `.harness/test/context-restoration-read-model.test.js`, `standard-template/.harness/test/*` | revise | Root tests fail because new `transition` terminal action and transition apply behavior are not fully reflected in fixtures and starter sync | Update root and starter tests together; rerun root/starter/PMW tests, validator, PMW export, and validation report |
| Out-of-scope dirty work | `reference/packets/PKT-01_DEV-09_PMW_PHASE_1_COMMAND_LAUNCHER_AND_HANDOFF_EXECUTION.md` and closed DEV-07/DEV-08/DEV-09 evidence | defer/no-op for OPS-03 | Closed packet evidence may be dirty in the worktree, but OPS-03 does not reopen those packets | Preserve existing worktree changes; only touch if OPS-03 validation or sync requires it |

### Audit Findings To Resolve Before Tester Handoff
- Root test `builds a fresh context restoration read model from designated summary sources` expects terminal-only commands without `transition`; revise expected list or gate exposure.
- Root test `validator becomes clean after the copied starter is initialized` fails because reusable root changes are not fully synchronized into `standard-template/`.
- Root test `transition preview is review-first and apply updates state surfaces` fails because applied transition validation is not yet clean.
- Validator currently reports starter sync drift for reusable runtime/test/template paths and therefore cutover preflight remains held.
- Starter currently passes its own tests, which confirms the starter did not receive the full reusable contract yet rather than proving OPS-03 is complete.

## Verification Manifest
- Gate profile: `contract`
- Ready For Code: approved for the revised 2026-05-03 scope by explicit user direction; 2026-05-02 approval remains historical evidence for the earlier scope only.
- root: run targeted gate-profile, approval-consistency, transition, read-model, and skill-guidance tests, then root full tests.
- standard-template: synchronize reusable runtime/test/template/skill changes and run starter tests.
- pmw-app: run PMW app tests if PMW command/read-model rendering changes.
- targeted: cover gate-profile validator behavior, approval-state mismatch fixtures, transition preview/apply behavior, PMW gate metadata, and behavior-guidance sync.
- validator: run `npm.cmd run harness:validate`.
- PMW export: run `npm.cmd run harness:pmw-export` when read-model metadata changes.
- validation report: run `npm.cmd run harness:validation-report`.
- review closeout: required before packet close.

## Developer Reconciliation Evidence
- Reconciliation timestamp: 2026-05-03 after the interrupted partial implementation audit.
- Result: Developer reconciliation completed; OPS-03 is ready for Tester verification, not Reviewer closeout yet.
- Root/starter sync: reusable runtime, validator, transition helper, read-model tests, PMW read-surface tests, profile-aware fixtures, packet template, and `gate-profiles.js` were synchronized into `standard-template/`.
- Gate profile implementation: kept and revised the `light`, `standard`, `contract`, `release` taxonomy, added root/starter `gate-profiles.js`, and kept `OPS-03` under `contract`.
- Approval-state consistency implementation: validator now blocks packet-header-only `Ready For Code` approval when work-item metadata is not approved or a matching DB decision remains open; transition apply records `readyForCode: approved` in work-item metadata when the packet header is approved.
- Transition implementation: `harness:transition` remains preview-first; apply mode updates DB work item/release state, canonical `TASK_LIST.md` and `CURRENT_STATE.md`, generated docs, PMW export, validation report, and handoff evidence together.
- Template handling fix: gate-profile validation excludes `PKT-01_WORK_ITEM_PACKET_TEMPLATE.md` so placeholder profile choices are not treated as concrete active packet evidence.
- Test fixture fix: transition fixture now supplies the required UX archetype evidence for user-facing packet metadata and validates the structured task row instead of a loose prose string.
- Root targeted evidence: `node --test .harness\test\dev05-tooling.test.js` passed 14/14 after adding approval-state consistency coverage.
- Starter targeted evidence: `node --test standard-template\.harness\test\dev05-tooling.test.js` passed 14/14.
- Root full evidence: `npm.cmd test` passed 39/39.
- Starter full evidence: `npm.cmd test` in `standard-template/` passed 39/39.
- PMW app evidence: `npm.cmd test` in `pmw-app/` passed 2/2.
- Validator evidence: root `npm.cmd run harness:validate` passed with `ok: true`, `cutoverReady: true`, and no findings.
- Starter validator note: direct `npm.cmd run harness:validate` inside `standard-template/` reports `starter_bootstrap_pending`, which is expected for an uninitialized starter template and is not a root closeout blocker.
- PMW export evidence: `npm.cmd run harness:pmw-export` completed successfully after read-model metadata changes.
- Validation report evidence: `npm.cmd run harness:validation-report` passed and refreshed `.agents/artifacts/VALIDATION_REPORT.md` and `.agents/artifacts/VALIDATION_REPORT.json`.
- Remaining gate: Tester must verify OPS-03 behavior and evidence; Reviewer closeout remains required before packet close.

## Developer Remediation Evidence After Tester Finding
- Tester finding timestamp: 2026-05-03. Tester found that PMW `recentHandoff` and `Re-entry Baton` could show an older `developer -> developer` handoff even after a newer transition was applied.
- Root cause: `handoff_log.created_at` stored a mix of UTC `Z` timestamps and local offset timestamps. `listRecentHandoffs()` used SQLite text ordering, so a local `2026-05-03...+09:00` string could sort ahead of a later actual UTC instant.
- Remediation: root and `standard-template` `operating-state-store.js` now sort handoffs and latest mutation/operational timestamps by parsed epoch time with a string fallback.
- Transition surface hardening: root and `standard-template` `harness:transition --apply` now also refresh `TASK_LIST.md` next-first-action, `CURRENT_STATE.md` active work-item status bullet, and `CURRENT_STATE.md` latest handoff summary so canonical Markdown reflects the active handoff.
- Regression coverage: root and starter `operating-state-store.test.js` now cover mixed timezone handoff ordering; root and starter `dev05-tooling.test.js` now cover canonical document updates from transition apply.
- Targeted evidence: root/starter `node --test ...operating-state-store.test.js`, root/starter `node --test ...context-restoration-read-model.test.js`, and root/starter `node --test ...dev05-tooling.test.js` passed after remediation.
- Full evidence: root `npm.cmd test` passed 40/40, `standard-template` `npm.cmd test` passed 40/40, and `pmw-app` `npm.cmd test` passed 2/2.
- Validator and derived evidence: root `npm.cmd run harness:validate` passed with no findings; `npm.cmd run harness:pmw-export` showed latest PMW `recentHandoff` / `Re-entry Baton` using the active Tester-to-Developer handoff after the ordering fix; `npm.cmd run harness:validation-report` passed.
- Remaining gate: Developer must hand back to Tester for re-verification of the remediation and final OPS-03 evidence before Reviewer closeout.

## Tester Re-Verification Evidence After Remediation
- Re-verification timestamp: 2026-05-03 after Developer remediation and Developer-to-Tester handoff.
- Tested scope: mixed timezone handoff ordering, transition canonical-doc updates, PMW `recentHandoff` / `Re-entry Baton` freshness, root/starter sync, PMW app stability, validator, PMW export, and validation report.
- Targeted evidence: root and starter `node --test ...operating-state-store.test.js` passed 4/4; root and starter `node --test ...dev05-tooling.test.js` passed 14/14.
- Full evidence: root `npm.cmd test` passed 40/40, `standard-template` `npm.cmd test` passed 40/40, and `pmw-app` `npm.cmd test` passed 2/2.
- Validator evidence: root `npm.cmd run harness:validate` passed with `ok: true`, `cutoverReady: true`, and no findings.
- PMW export evidence: `npm.cmd run harness:pmw-export` regenerated `.agents/runtime/pmw-read-model.json`; exported `recentHandoff` and `Re-entry Baton.latestHandoff` both show the latest `[developer -> tester]` OPS-03 remediation handoff.
- Validation report evidence: `npm.cmd run harness:validation-report` passed with gate decision `pass`.
- Tester result: passed. OPS-03 is ready for Reviewer closeout; Reviewer must still assess packet exit readiness and residual debt before close.

## Reviewer Finding Before Closeout
- Review timestamp: 2026-05-03 after Tester re-verification.
- Reviewer result: hold; OPS-03 is not approved for packet exit yet.
- Finding 1: `harness:transition` reads packet `Ready For Code` state but does not block `planner-to-developer` when the packet is not approved.
- Finding 2: `harness:transition --apply` can return top-level `ok: true` and CLI success after post-apply validation report failure.
- Risk: the transition helper can still create or report an inconsistent handoff state, which conflicts with this packet's approval-state and SSOT consistency goal.
- Required remediation: root and `standard-template` must add transition approval guards, open Ready For Code decision guards, top-level validation failure reporting, and regression tests before Tester re-verification.
- Review report reference: `reference/artifacts/REVIEW_REPORT.md`, section `2026-05-03 OPS-03 Review Finding`.

## Developer Remediation Evidence After Reviewer Finding
- Remediation timestamp: 2026-05-03 after Reviewer-to-Developer handoff.
- Result: Developer remediation completed; OPS-03 is ready for Tester re-verification, not Reviewer closeout yet.
- Transition approval guard: root and `standard-template` `harness:transition` now block `planner-to-developer` unless packet `Ready For Code` is approved.
- Ready For Code decision guard: root and `standard-template` `harness:transition` now block `planner-to-developer` when an open Ready For Code decision for the same packet is not included in `--close-decision`.
- Validation result reporting: post-apply validation report failure now sets top-level transition `ok: false`, so CLI failure reporting cannot silently treat an invalid handoff as clean.
- PMW next-action freshness: transition apply now refreshes `.agents/artifacts/IMPLEMENTATION_PLAN.md` `## Operator Next Action`, which is the PMW Next Action source, alongside `CURRENT_STATE.md`, `TASK_LIST.md`, DB, generated docs, PMW export, validation report, and handoff evidence.
- Regression coverage: root and starter `dev05-tooling.test.js` now cover unapproved Ready For Code, unclosed Ready For Code decision, post-apply validation failure reporting, and implementation-plan next-action refresh.
- Targeted evidence: root `node --test .harness\test\dev05-tooling.test.js` passed 17/17; starter `node --test standard-template\.harness\test\dev05-tooling.test.js` passed 17/17.
- Full evidence: root `npm.cmd test` passed 43/43; `standard-template` `npm.cmd test` passed 43/43; `pmw-app` `npm.cmd test` passed 2/2.
- Validator/export evidence before Tester handoff: root `npm.cmd run harness:validate` passed with no findings; `npm.cmd run harness:pmw-export` passed; `npm.cmd run harness:validation-report` passed.
- Developer-to-Tester handoff evidence: `harness:transition --apply` for `developer-to-tester` passed with validation report `ok: true`, gate decision `pass`, and no findings.
- PMW freshness evidence after handoff: regenerated PMW read-model shows `Next Action` headline ``OPS-03` active handoff is `developer -> tester``, current task owner `tester`, workflow `.agents/workflows/test.md`, and latest handoff `[developer -> tester]`.
- Remaining gate: Tester must re-verify this remediation, including transition guard failure modes and PMW Next Action freshness, before Reviewer closeout resumes.

## Planner Rebaseline After User Clarification
- Rebaseline timestamp: 2026-05-03 after the user clarified the intended Karpathy-package adoption level.
- Planner result: reopen planning before further Developer remediation. The earlier `thin guidance` wording is superseded.
- User clarification: the requirement is not to thin down the behavior guide. The requirement is to incorporate it sufficiently while making sure it does not conflict with this harness's SSOT, approval, workflow, Tester, Reviewer, PMW read-only, and root/starter sync contracts.
- Additional user requirement: the project design SSOT explicitly agreed by the human and Planner must guide every other agent. Developer implements according to that SSOT, Tester verifies against it, and Reviewer checks closeout/evidence against it.
- Additional PMW requirement: Artifact Library must make whole-project design and overview material continuously available in one clear category, including `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, and equivalent project-design artifacts. The artifact body reading width must be expanded for long design documents.
- Planning consequence: prior Developer remediation evidence remains historical evidence, but it is not sufficient closeout for this clarified scope.
- Next first action: Developer must implement the revised acceptance gaps under the approved 2026-05-03 scope, starting from the prior partial/remediation audit evidence.

## Planner-Final Revised Agreement
- Finalization timestamp: 2026-05-03 after the user directed Planner to finalize the revised OPS-03 agreement.
- Planner result: revised agreement was finalized for user approval and then explicitly approved for Developer start on 2026-05-03.
- Implementation approval boundary: `Ready For Code for revised scope` is approved; Developer resumes under the finalized revised agreement.
- Final agreed scope:
  - Keep the existing OPS-03 contract-gated reliability scope: gate profiles, approval/SSOT consistency, transition automation, current-state/history split, validation/report/export freshness, and root/starter synchronization.
  - Sufficiently incorporate the attached Karpathy-style behavior guide across reusable workflows, day-start/day-wrap-up skills, manual/operator guidance, and regression or validator coverage.
  - Adapt the behavior guide to the harness instead of importing it as a conflicting runtime or governance system.
  - Make human-and-Planner-approved project design SSOT the guiding instruction layer for Developer, Tester, Reviewer, and other agents.
  - Require Developer to implement to the approved SSOT, Tester to verify against it without direct fixes, and Reviewer to judge source parity/evidence/residual debt against it.
  - Require all workflows to close with `Current Work` and `Next Work` blocks that include current work/issues/decisions and next work/expected issues/expected decisions.
  - Expand PMW Artifact Library so whole-project design/overview artifacts are always discoverable in one category and long design documents have a wider readable body.
- Final non-scope:
  - No release packaging change.
  - No PMW write authority.
  - No arbitrary shell expansion beyond the approved PMW command catalog.
  - No direct ZIP/plugin runtime dependency.
  - No weakening of packet-before-code, human approval, generated-doc immutability, Tester/Reviewer separation, or root/starter sync.
- Developer first action after approval:
  - Audit the existing partial implementation and later remediation evidence against this revised agreement.
  - Classify any remaining work as keep/revise/drop.
  - Implement only the revised acceptance gaps, then rerun root/starter tests, validator, PMW export, validation report, and hand off to Tester.
- Tester first action after Developer handoff:
  - Verify the implementation against `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, this packet, approved design/source artifacts, root/starter sync, PMW evidence, and validation outputs.
  - Hand any mismatch back to Developer rather than fixing it directly.
- Expected next decision:
  - Developer decides keep/revise/drop for any remaining partial work against the finalized revised scope, implements only approved-scope gaps, then hands off to Tester for SSOT-based verification.

## Developer Implementation Evidence After Revised Approval
- Implementation timestamp: 2026-05-03 after explicit user approval of `Ready For Code for revised scope`.
- Keep/revise/drop disposition:
  - keep: prior gate-profile, approval-state, transition, current-state/history, and PMW freshness remediation remains useful evidence.
  - revise: behavior-guide adoption was expanded from the superseded thin-guidance approach into reusable workflow, skill, manual, validator, and root/starter sync coverage.
  - revise: PMW Artifact Library moved whole-project design and overview artifacts into a stable category and widened the artifact reading body.
  - defer/drop: direct ZIP/plugin runtime dependency remains out of scope because the harness owns its workflow, SSOT, approval, Tester, Reviewer, PMW read-only, and root/starter contracts.
- Implemented behavior guidance:
  - Added `.agents/rules/agent_behavior.md` in root and `standard-template` with `Think Before Coding`, `Simplicity First`, `Surgical Changes`, and `Goal-Driven Execution` adapted to harness governance.
  - Wired the behavior contract into `AGENTS.md`, `.agents/rules/workspace.md`, every root and `standard-template` workflow, day-start/day-wrap-up skills, manuals, validator, and starter required-file/sync rules.
  - Added validator coverage that blocks missing/incomplete workflow or skill behavior guidance and keeps the reusable guidance synchronized between root and `standard-template`.
- Implemented project-design SSOT precedence:
  - Developer, Tester, and Reviewer workflows now explicitly bind implementation, verification, and review to `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, active packet acceptance, and approved design/source artifacts.
  - Tester is instructed to report SSOT mismatches back to Developer rather than fixing them directly; Reviewer checks source parity and evidence against the approved SSOT.
- Implemented PMW Artifact Library design access:
  - PMW read-model now exposes `Project Design And Overview` with `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `PROJECT_PROGRESS.md`, `ACTIVE_PROFILES.md`, `UI_DESIGN.md`, `PRODUCT_UX_ARCHETYPE.md`, and `SYSTEM_CONTEXT.md`.
  - PMW artifact preview width was widened (`main` max width and artifact grid/body preview constraints), preview body gets a taller scrollable reading area, and artifact preview payload length was increased for long design documents.
- Targeted evidence:
  - root targeted `node --test .harness\test\dev05-tooling.test.js .harness\test\context-restoration-read-model.test.js .harness\test\pmw-read-surface.test.js`: passed 24/24.
  - `standard-template` targeted `node --test standard-template\.harness\test\dev05-tooling.test.js standard-template\.harness\test\context-restoration-read-model.test.js standard-template\.harness\test\pmw-read-surface.test.js`: passed 24/24.
  - `pmw-app` `npm.cmd test`: passed 2/2.
- Full evidence:
  - root `npm.cmd test`: passed 44/44.
  - `standard-template` `npm.cmd test`: passed 44/44.
  - root `npm.cmd run harness:validate`: passed with `ok: true`, `cutoverReady: true`, and no findings.
  - root `npm.cmd run harness:pmw-export`: passed and exported the `Project Design And Overview` Artifact Library category with the required project-design SSOT files.
- Handoff evidence:
  - `harness:transition --apply developer-to-tester`: passed; generated docs, PMW export, and validation report were refreshed with gate decision `pass` and no findings.
  - Latest handoff: `[developer -> tester] Developer implemented the revised OPS-03 scope: sufficient behavior guidance, project-design SSOT precedence, workflow closeout reporting, PMW design Artifact Library access, and validation coverage.`
- Developer result: revised OPS-03 implementation is ready for Tester verification.

## Developer Remediation After Revised-Scope Closeout Finding
- Remediation trigger: 2026-05-03 Reviewer closeout hold found that `tester -> reviewer` transition left stale `CURRENT_STATE.md` wording that still claimed Tester verification was pending, and custom reviewer-source transitions could degrade the Ready For Code display to an empty status.
- Remediation implemented:
  - Root and `standard-template` `updateCanonicalCurrentState()` now refresh a work-item-keyed `## Current Truth Notes` bullet alongside the existing active-handoff bullet so transient lane status does not remain stale in canonical current state.
  - Transition planning now falls back to `workItem.metadata.readyForCode` when the transition `sourceRef` is a review artifact instead of the packet header, preserving the correct Ready For Code display across reviewer remediation loops.
  - Canonical `.agents/artifacts/CURRENT_STATE.md` was cleaned so the active OPS-03 truth note uses the new keyed format instead of stale freeform reviewer/tester-pending wording.
- Regression coverage:
  - Added root and `standard-template` `dev05-tooling` tests for `tester-to-reviewer` keyed current-state truth-note refresh.
  - Added root and `standard-template` `dev05-tooling` tests for reviewer-to-developer transitions that use `reference/artifacts/REVIEW_REPORT.md` as `sourceRef` while preserving `Ready For Code: approved`.
- Verification evidence:
  - root `node --test .harness\test\dev05-tooling.test.js`: passed 20/20.
  - `standard-template` `node --test standard-template\.harness\test\dev05-tooling.test.js`: passed 20/20.
  - root `npm.cmd test`: passed 46/46.
  - `standard-template` `npm.cmd test`: passed 46/46.
  - root `npm.cmd run harness:validate`: passed with no findings.
  - root `npm.cmd run harness:pmw-export`: passed.
  - root `npm.cmd run harness:validation-report`: passed with gate decision `pass`.
- Developer result: the revised closeout-state drift found during Reviewer review is remediated and ready for Tester re-verification.

## 6. Out Of Scope
- New PMW visual redesign.
- Persistent PMW command history.
- Workflow role renaming or route precedence changes unrelated to OPS-03.
- Release packaging changes.
- Add the Karpathy ZIP or plugin package as a runtime dependency.
- Let external behavior-guide files override this repository's canonical workflow contracts or SSOT hierarchy.
- Product starter profile rules unrelated to operation reliability.
- Migrating historical records into a new database schema unless implementation proves it is necessary and the user approves that expansion.

## 7. Acceptance
- A work item can declare one approved gate profile and validator can detect missing or incompatible profile evidence.
- `Ready For Code` cannot be treated as approved unless packet, DB decision, work-item metadata, canonical docs, generated docs, PMW export, and handoff evidence agree or the mismatch is explicitly blocked.
- `harness:transition` or an equivalent mechanism prevents the same state handoff from being edited inconsistently across Markdown, DB, generated docs, PMW export, validation report, and handoff log.
- `CURRENT_STATE.md` becomes shorter and remains sufficient for context restoration without burying closed-lane history.
- PMW read-model exposes current task, next task, handoff baton, gate profile, approval/transition status, required evidence, and route diagnostics.
- Agent behavior guidance is sufficiently integrated from the attached ZIP into root and `standard-template` workflows/skills/manual guidance, covering assumption disclosure, confusion management, clarification before risky guesses, tradeoff surfacing, warranted pushback, simplicity-first implementation, surgical-change discipline, cleanup of only current-change orphans, and goal-driven verification.
- Validator or regression coverage catches missing reusable behavior guidance in root and `standard-template`.
- Human-and-Planner-approved project design SSOT is documented as the guiding instruction layer for Developer, Tester, Reviewer, and other agents.
- Tester workflow expectations explicitly require comparing implementation against requirements, architecture, implementation plan, active packet acceptance, and approved design/source artifacts; mismatches return to Developer.
- All root and `standard-template` workflows require the two-block closeout report format covering current completed work/issues/decisions and next work/expected issues/expected decisions.
- PMW Artifact Library exposes a stable project-design/overview category that always includes `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, and equivalent project-wide design/overview artifacts.
- PMW artifact preview/body layout is widened enough for long project-design documents to be practically readable while preserving PMW read-only authority.
- Root and `standard-template` remain synchronized for reusable runtime/test/workflow/skill changes.
- The interrupted partial implementation is reconciled, root tests pass, validator is clean, PMW export is fresh, and Reviewer closeout records residual debt disposition.

## 8. Detailed Agreement
Planner finalized `OPS-03` as one contract-gated harness improvement lane under the revised 2026-05-03 scope. The earlier 2026-05-02 detailed agreement and `Ready For Code` approval remain historical evidence for the narrower prior scope; the user explicitly approved `Ready For Code for revised scope` on 2026-05-03 and directed Developer to start implementation.

| Decision Item | Recommended Agreement | Rationale |
|---|---|---|
| Expanded OPS-03 scope | Combine operation friction reduction, approval/SSOT consistency, sufficiently integrated Karpathy-style behavior guidance, project-design SSOT precedence, and PMW design-artifact access in this single lane | The issues share one root cause: high manual coordination cost across state, gates, agent execution behavior, and access to the agreed design baseline |
| Gate profile taxonomy | Use `light`, `standard`, `contract`, and `release` as the first approved profile set | This keeps small documentation work cheaper while preserving stronger gates for reusable/runtime/release changes |
| OPS-03 gate profile | Treat this packet as `contract` | The lane changes reusable workflow, validator, transition, read-model, packet-template, and root/starter sync behavior |
| Approval-state consistency | Block implementation handoff when packet, DB decision, work-item metadata, canonical docs, generated docs, PMW export, validation report, or handoff evidence disagree | The current incident proves packet-header-only approval is not reliable enough |
| Transition automation | Finish or add preview-first transition tooling with explicit apply mode | State changes should be reviewed before mutation, then applied through one path that refreshes dependent surfaces |
| Current-state/history split | Keep `CURRENT_STATE.md` short and move closed-lane history to progress/review/packet/generated-history surfaces | Context restoration should load current operating truth quickly without losing source-traced history |
| Karpathy-style guidance adoption | Adopt the four principles as sufficiently integrated workflow/skill/manual/validation guidance: think before coding, simplicity first, surgical changes, goal-driven execution | The attached ZIP is useful behavior guidance and should be materially reflected, but it must be adapted to this harness rather than imported as a conflicting runtime or governance system |
| Project design SSOT precedence | Treat human-and-Planner-approved design artifacts as the guiding instruction layer for Developer, Tester, Reviewer, and other agents | The user explicitly requires agreed project design to guide implementation and verification behavior |
| Workflow closeout reporting | Every workflow reports `Current Work` and `Next Work`, including current issues/decisions and next expected issues/decisions | The user explicitly requested this reporting shape for all agent workflow completions |
| PMW design artifact access | Expand PMW Artifact Library reading width and group whole-project design/overview artifacts into a stable always-available category | Operators and agents need ready access to the approved project design baseline without file hunting |
| Interrupted implementation disposition | Reviewer/Developer must audit the existing partial OPS-03 diffs first, then keep, revise, or drop each change against this expanded packet | The worktree already contains useful but unclosed implementation evidence, so continuing blindly would repeat the drift pattern |
| Ready For Code for revised scope | Approved on 2026-05-03 after finalized revised Planner agreement | The user explicitly approved Developer start for the revised scope after clarifying that the Karpathy-style guide must be sufficiently reflected without conflicting with harness direction |

## 9. Human Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Expanded OPS-03 scope | yes | user/planner | approved | Approved as one lane covering operation friction, approval consistency, and agent behavior guidance |
| Gate profile taxonomy | yes | user/planner | approved | Approved first profile set: `light`, `standard`, `contract`, `release` |
| Approval-state consistency scope | yes | user/planner | approved | Approved DB/packet/canonical/generated/PMW cross-checks and blocking behavior |
| Transition automation scope | yes | user/planner | approved | Approved preview-first plus explicit apply behavior |
| State/history split | yes | user/planner | approved | Approved current-state focus plus separate history/progress/review surfaces |
| Agent behavior guidance adoption | yes | user/planner | approved | Approved sufficient guidance adoption from the attached ZIP while preserving harness governance boundaries |
| Project design SSOT precedence | yes | user/planner | approved | Approved direction: agreed project design SSOT guides Developer, Tester, Reviewer, and other agents |
| Workflow closeout reporting | yes | user/planner | approved | Approved direction: all workflows report current work/issues/decisions and next work/expected issues/expected decisions |
| PMW Artifact Library design access | yes | user/planner | approved | Approved direction: widen artifact body and keep project-design/overview artifacts always discoverable as one category |
| Interrupted implementation disposition | yes | planner/reviewer | approved | Approved requirement to audit partial work before Developer continuation |
| Ready For Code for revised scope | yes | user | approved | Approved on 2026-05-03; Developer begins with the prior partial/remediation audit evidence and implements the remaining revised-scope gaps |

## 10. Recommended Implementation Slices
- Slice 0: rebaseline and review interrupted partial implementation before adding new code.
- Slice 1: define gate profile contract and validator fixtures.
- Slice 2: add approval-state cross-checks between packet, DB, canonical docs, generated docs, PMW export, and handoff.
- Slice 3: finish transition helper with preview-first/apply behavior and failure guards.
- Slice 4: split current state versus history while preserving PMW/context read-model source trace.
- Slice 5: sufficiently integrate Karpathy-style behavior guidance into role workflows, day-start/day-wrap-up skills, manual/operator guidance, and root/starter regression or validator coverage.
- Slice 6: add project-design SSOT precedence expectations to Planner/Developer/Tester/Reviewer behavior contracts and verification expectations.
- Slice 7: standardize workflow turn-close reporting across root and `standard-template`.
- Slice 8: expand PMW Artifact Library project-design/overview category and artifact reading width while preserving read-only authority.
- Slice 9: update manuals/tests/root-starter parity and run closeout verification.

## 11. Reopen Trigger
- The user wants to remove approval gates rather than profile them.
- The transition helper would mutate state without preview, reviewability, or rollback evidence.
- Approval-state validation creates false confidence by checking only one surface.
- State/history split breaks PMW, context restoration, validator, or generated docs.
- Agent behavior guidance becomes either too shallow to materially affect agent behavior or a conflicting governance/runtime system that bypasses this harness's SSOT and approval contracts.
- PMW design-artifact access changes create write authority, hide current operational state, or make project-design artifacts harder to find.
- A release or packaging change becomes part of the same lane.
