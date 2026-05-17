# PKT-01 PLN-22 Operational authority rebuild and harness reset

## Purpose
- Open `PLN-22 / REBUILD-01` as the active Planner lane after the user approved it as the single next planning program.
- Rebuild the harness operating model around one canonical live operational authority, a small human-facing planning document set, and generated or on-demand operational views.
- Close the remaining implementation-proof, reference-disposition, sequencing, and `Ready For Code` boundaries required before implementation opens.

## Approval Rule
- This packet starts in Planner workflow.
- The user approved `PLN-22 / REBUILD-01` as the single next planning program on 2026-05-16.
- The user approved the packet-level decision-status alignment on 2026-05-16 so this packet can serve as the active planning-lane authority for what is already closed versus still open in Decisions 1 through 9.
- The user also approved the following planning baselines on 2026-05-16:
  - canonical operational substrate is `.harness/operating_state.sqlite` plus structured runtime API
  - the draft 12-artifact classification table is the planning baseline
  - live-state Markdown surfaces should be removed or converted to generated-on-demand views
  - generated-view fallback acceptance requires canonical-state fallback, stale labeling, regeneration recovery, and validator failure classification
  - after the Phase 3 authority-freeze checkpoint, old operational surfaces remain read-only frozen compatibility views and all new operational writes use only the new canonical authority
- The user approved the Planner recommendations for Decisions 4 through 9 as the `PLN-22` planning baseline on 2026-05-17, with two required adjustments:
  - Decision 5 effective risk class must be computed as the higher of declared risk and detected risk floor
  - Decision 9 artifact retirement or merge execution must be preceded by inbound-reference scan plus reference migration, tombstone, or exemption handling
- The user approved implementation slice scope, `Ready For Code`, and artifact-by-artifact retire / merge / retain execution on 2026-05-17.
- The user approved Slice 1 closeout reflection and Slice 2 entry on 2026-05-17.
- The user approved the Slice 4 Planning / Approval Checklist on 2026-05-17. This approves Developer start for Slice 4 implementation only; cutover execution and destructive artifact retirement / merge execution still require separate later approval.
- `Ready For Code` is approved only for the scoped sequential slices below. Slice 1 may start immediately; later slices must not bypass their own prerequisite proof, reference-disposition, and validation gates.

## Source Of Detailed Design
- Detailed design source: `reference/planning/PLN-22_OPERATIONAL_AUTHORITY_REBUILD_AND_HARNESS_RESET_DRAFT.md`
- This packet is the active planning-lane authority and concise approval boundary.
- The planning draft remains the detailed architecture and decision record for this lane.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | PLN-22 Operational authority rebuild and harness reset | repeated operational-cost friction now requires one coherent rebuild planning lane instead of more micro-slices | approved |
| Ready For Code | approved | implementation may proceed only through the scoped sequential slices and prerequisite gates recorded in this packet | approved |
| Human sync needed | yes | this lane changes operational authority, artifact roles, closeout risk, payload boundary, parity strategy, and cutover sequencing | approved |
| Gate profile | contract | affects reusable operating authority, workflow/runtime state, validator behavior, Active Context, and root/starter contract surfaces | approved |
| User-facing impact | high | CLI/Active Context comprehension, human planning surfaces, and starter cleanliness all depend on the rebuild | approved |
| Layer classification | core | this is a reusable harness operating-model change, not one project customization | approved |
| Active profile dependencies | none | no optional profile is active | not-needed |
| Profile evidence status | not-needed | no profile-specific evidence is required | not-needed |
| UX archetype status | approved | human-facing CLI/context readability is part of the reusable harness operating contract | approved |
| UX deviation status | not-needed | no product UI deviation is proposed | not-needed |
| Environment topology status | not-needed | no deploy/cutover execution is approved yet | not-needed |
| Domain foundation status | not-needed | this planning lane does not change product data schema or domain model | not-needed |
| Authoritative source intake status | approved | user approvals on 2026-05-16 and 2026-05-17 are the controlling planning sources | approved |
| Shared-source wave status | not-needed | this is a single active planning lane | not-needed |
| Packet exit gate status | pending | Ready For Code is approved, but packet exit remains open until implementation, validation, tester evidence, and review closeout are complete | pending |
| Existing system dependency | none | no external product or legacy DB dependency is touched | not-needed |
| New authoritative source impact | analyzed | the latest user approval closes Decisions 4 through 9 as planning baseline with explicit execution boundaries | approved |
| Risk if started now | high | implementation without proof boundaries could mutate authority, payload, parity, or retirement surfaces prematurely | approved |

## Lane-Typed Minimum Contract
- Lane-type declaration:
  planning
- Lane-type universal minimum sections:
  Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger
- Lane-type required sections:
  Purpose; Approval Rule; Approved Planning Baseline; Decision Status Snapshot; Implementation-Proof Boundaries; Verification Manifest; source trace to the 2026-05-16 and 2026-05-17 user approvals
- Lane-type conditional sections:
  cutover execution detail and destructive artifact retirement execution remain conditional on slice prerequisite proof and validation, even after `Ready For Code`
- Lane-type not-needed sections:
  optional profile evidence, product domain foundation, and environment topology execution detail are not needed until scope changes

## UX / Layer / Required Reading
- UX archetype reference: `.agents/rules/HARNESS_OPERATING_CONTRACT.md` plus existing CLI / Active Context operator surfaces
- Selected UX archetype: human-readable planning surfaces plus AI-efficient compact re-entry surfaces generated from one canonical authority
- UX deviation status: not-needed
- Archetype deviation / approval: no product UI deviation is proposed in this planning lane
- Layer classification: core
- Active profile dependencies: none
- Required reading before code: `.agents/artifacts/CURRENT_STATE.md`; `.agents/artifacts/TASK_LIST.md`; `.agents/artifacts/REQUIREMENTS.md`; `.agents/artifacts/ARCHITECTURE_GUIDE.md`; `.agents/artifacts/IMPLEMENTATION_PLAN.md`; `.agents/artifacts/PREVENTIVE_MEMORY.md`; `reference/planning/PLN-22_OPERATIONAL_AUTHORITY_REBUILD_AND_HARNESS_RESET_DRAFT.md`; `reference/packets/PKT-01_PLN-22_OPERATIONAL_AUTHORITY_REBUILD_AND_HARNESS_RESET.md`; `reference/artifacts/PLN-22_ARTIFACT_REFERENCE_DISPOSITION.md`; `.harness/runtime/state/dev05-tooling.js`; `.harness/runtime/state/drift-validator.js`; `.harness/runtime/state/active-context.js`

## Data / Source Impact
- Authoritative source intake reference: user approval on 2026-05-16 for `PLN-22 / REBUILD-01` as the single next planning program plus user approvals on 2026-05-17 for Decisions 4 through 9 planning baseline, implementation slice scope / Ready For Code, and artifact-by-artifact retirement execution
- Authoritative source disposition: incorporate fully into the `PLN-22` baseline; implementation may proceed only inside the scoped sequential slices and artifact execution still requires inbound-reference scan plus migration / tombstone / exemption handling
- Existing plan conflict: no unrelated lane is reopened; prior PLN-20 / PLN-21 / OPS-26 / OPS-27 evidence remains source history while `PLN-22` owns the rebuild planning boundary
- Current implementation impact: `Ready For Code` is approved for the scoped sequential slices; no cutover or destructive artifact retirement may occur before its slice prerequisite proof and reference-disposition gate pass
- Current implementation impact: Slice 1 closeout is reflected; Slice 2 entry is approved; no cutover or destructive artifact retirement may occur before its slice prerequisite proof and reference-disposition gate pass
- Impacted packet set scope: single active planning packet with later implementation slices to be defined under `PLN-22`

## In Scope
- canonical operational substrate definition
- artifact Markdown role rationalization
- generated-view fallback acceptance requirements
- Phase 3 authority-freeze checkpoint definition
- planning boundary for packet authority, artifact retirement execution, and later implementation sequencing

## Out Of Scope
- implementation work outside the approved sequential slice scope
- destructive artifact retirement before inbound-reference migration / tombstone / exemption handling
- authority substrate cutover before the Phase 3 authority-freeze proof gate passes
- root / `standard-template` parity changes that lack affected-file classification
- unrelated feature work, onboarding rewrite, optional-profile expansion, or multi-agent governance work

## Approved Planning Baseline
- Human planners should rely on a small canonical planning-document set:
  - `REQUIREMENTS.md`
  - `ARCHITECTURE_GUIDE.md`
  - `IMPLEMENTATION_PLAN.md`
  - active packet approval surfaces
  - project-specific design documents such as screen list, DB design, API spec, permission matrix, and business process when relevant
- All other state, task, context, validation, handoff, and parity surfaces should be generated AI-readable views, generated human views, or on-demand CLI / AI explanations with source references.
- AI-only operational surfaces should be removed, collapsed into canonical state or event log, or generated on demand instead of preserved as persistent duplicate Markdown.

## Active Planning Decisions Already Approved
- Decision 1: canonical operational substrate approved
- Decision 2: 12-artifact classification draft approved as the planning baseline
- Decision 3: `CURRENT_STATE.md` and `TASK_LIST.md` should be removed or generated on demand during transition
- Decision 4: packet authority is limited to design, scope, approval, acceptance, verification expectations, source references, and audit / closeout evidence
- Decision 5: closeout risk tiers use low / normal / high, with effective risk class computed as max(declared risk, detected risk floor)
- Decision 6: maintainer / starter payload boundary excludes maintainer live state, generated maintainer views, traces, and maintainer-only active-lane state from starter payload
- Decision 7: root / `standard-template` parity strategy is ordered as shared source or generation first, deterministic sync second, and classified manual parity last
- Decision 8: cutover style is parallel build, Phase 3 authority-freeze checkpoint, no post-freeze dual-write, then single cutover after acceptance suite pass
- Decision 9: artifact retirement / merge / retention appetite is approved, but execution requires inbound-reference scan and reference migration / tombstone / exemption handling first
- Generated-view fallback acceptance requirements approved
- Phase 3 authority-freeze rule approved

## Planning Decisions Still Open
- packet exit remains open until Developer, Tester, Reviewer, and Planner closeout evidence exists
- later slice activation remains gated by the prerequisite proof and validation listed below

## Approved Implementation Slices And Ready For Code
`Ready For Code` is approved for these slices as a sequential program. A later slice may start only after earlier prerequisite gates pass and state is regenerated cleanly.

| Slice | Scope | Effective risk | Ready For Code | May execute now? | Required proof before next slice |
|---|---|---|---|---|---|
| Slice 1 | Implementation-proof foundation: generated-view fallback diagnostics, authority-freeze guard proof, packet-authority proof, effective-risk floor enforcement, and artifact reference-disposition registry. No artifact deletion. | high | approved | completed | targeted runtime/validator tests, root validator, Active Context evidence, validation report |
| Slice 2 | Reference migration/tombstone prep: update load-order/manual/runtime references to canonical state or generated/on-demand views; add tombstone/exemption handling for retirement candidates. No destructive deletion until validation passes. | high | approved | completed | inbound-reference scan delta, migration/tombstone evidence, root/starter parity classification |
| Slice 3 | Derived-surface conversion: convert `CURRENT_STATE.md`, `TASK_LIST.md`, `ACTIVE_CONTEXT.md`, validation summaries, and generated-state-doc surfaces to generated-only or on-demand behavior where proof is complete. | high | approved | completed | fallback recovery from deleted generated outputs, stale labeling, no blank re-entry surface |
| Slice 4 | Cutover and starter/parity finalization: apply maintainer/starter payload split, parity strategy, old write-path freeze, single cutover acceptance suite, and final artifact retirement / merge execution. | high | approved | non-destructive scope reviewer-approved; cutover and destructive retirement / merge remain separately gated | root and starter acceptance suites, validator pass, reviewer closeout |

## Slice Progress Snapshot
- Slice 1 closeout reflected on 2026-05-17 after clean Developer, Tester, and Reviewer evidence:
  - effective-risk floor enforcement is implemented
  - root / `standard-template` parity is clean for the touched reusable runtime and tests
  - validation report and Active Context evidence are clean
  - artifact reference-disposition registry is present
  - no destructive retirement or merge execution occurred
- Slice 2 closeout reflected on 2026-05-17 after clean Developer, Tester, and Reviewer evidence:
  - load-order/manual/runtime references were migrated away from default `CURRENT_STATE.md` / `TASK_LIST.md` first-read routing
  - root / `standard-template` parity is clean for the touched workflow, manual, runtime, and test surfaces
  - manual prompt-template remediation is closed; `ACTIVE_CONTEXT` first-read plus compatibility-fallback wording is synchronized
  - the disposition registry records `migrate`, `tombstone`, and `exempt` handling for the approved Slice 2 surfaces
  - no destructive retirement or merge execution occurred
- Slice 3 entry approved on 2026-05-17:
  - Developer may begin derived-surface conversion proof for `CURRENT_STATE.md`, `TASK_LIST.md`, `ACTIVE_CONTEXT.md`, validation summaries, and generated-state-doc surfaces where proof is complete
  - Developer may not execute cutover or final destructive artifact retirement / merge beyond the packet's Slice 3 proof and Slice 4 gates
- Slice 3 closeout reflected on 2026-05-17:
  - generated compatibility / fallback proof for `CURRENT_STATE.md`, `TASK_LIST.md`, `ACTIVE_CONTEXT.md`, validation summaries, and generated-state-doc recovery is complete
  - root and `standard-template` reusable runtime/test surfaces are synchronized
  - cutover and destructive artifact retirement / merge execution remain blocked for Slice 4
- Slice 4 non-destructive implementation evidence captured on 2026-05-17:
  - `installer/starter-payload-contract.js` now excludes maintainer runtime traces, recovery reports, generated state docs, cutover/preflight reports, `ACTIVE_CONTEXT.*`, and sqlite operational state from starter payload application
  - bootstrap tests prove GitHub and local starter application exclude those generated or maintainer-only runtime artifacts
  - root and `standard-template` dev05 tests prove `cutover-preflight` is read-only and leaves legacy write-path migration changes pending until a separately approved cutover
  - root targeted tests, root full suite, starter targeted tests, starter full suite, root validator/report, starter validator/report, and root/starter non-destructive cutover preflight all pass
  - cutover execution and destructive artifact retirement / merge execution did not occur
- Slice 4 non-destructive closeout reflected on 2026-05-17:
  - Tester verification and Reviewer closeout found no blocking issue inside the approved non-destructive boundary
  - Planner closeout is limited to the non-destructive Slice 4 evidence
  - cutover execution and destructive artifact retirement / merge execution remain blocked until separate future user approval

## Slice 4 Planning / Approval Checklist
Recommended next decision:
- Open Slice 4 as a dedicated high-risk approval surface for cutover and starter/parity finalization.

Approval status:
- Approved by user on 2026-05-17 for Developer start on Slice 4 implementation only.
- Cutover execution remains not approved.
- Destructive artifact retirement / merge execution remains not approved.

Approval split:
- Slice 4 implementation start approval: required before Developer begins old write-path freeze, maintainer/starter payload split finalization, parity finalization, or acceptance-suite implementation.
- Cutover execution approval: required separately before switching authority behavior or treating old operational surfaces as frozen compatibility views.
- Destructive artifact retirement / merge approval: required separately before deleting, merging, or replacing persistent artifacts with tombstones.

Required preconditions before Slice 4 implementation starts:
- Slice 3 closeout stays reflected in canonical planning state.
- Active Context, validation report, and generated compatibility views are regenerated cleanly after the latest planning edit.
- The Developer handoff names the affected root and `standard-template` surfaces and classifies each as `root-only`, `starter-owned`, `shared-generated`, `shared-synced`, or `generated-runtime`.
- The implementation plan preserves no post-freeze dual-write and keeps old surfaces readable only as frozen compatibility views.

Required preconditions before cutover execution:
- Root targeted tests and full root suite pass.
- `standard-template` targeted tests and full starter suite pass.
- Root validator and starter validator pass or report only expected starter bootstrap guidance.
- `ACTIVE_CONTEXT.*`, validation report, and generated/on-demand compatibility views recover after regeneration.
- Reviewer approves high-risk cutover evidence before Planner closeout.

Required preconditions before destructive retirement / merge:
- Inbound-reference scan is rerun for every retirement or merge candidate.
- Every remaining reference is classified as `migrate`, `tombstone`, or `exempt` in `reference/artifacts/PLN-22_ARTIFACT_REFERENCE_DISPOSITION.md`.
- Tombstones include replacement pointer and historical rationale.
- No retained canonical planning authority is deleted or merged.
- The retirement / merge diff is reviewed separately from non-destructive Slice 4 implementation.

Not approved by this checklist:
- actual cutover execution
- artifact deletion
- artifact merge
- weakening Reviewer closeout for the high-risk Slice 4 path

## Artifact Reference-Disposition Execution Approval
Execution approval is recorded for the following artifact-level dispositions. Actual destructive retirement is still gated by the inbound-reference and proof requirements in the `Execution rule` column.

| Artifact | Approved disposition | Inbound reference scan result | Execution rule |
|---|---|---|---|
| `.agents/artifacts/CURRENT_STATE.md` | convert to generated/on-demand, then retire persistent manual-reading role | 179 direct text references found in initial scan | migrate active load-order/runtime/manual refs or leave tombstone before retirement |
| `.agents/artifacts/TASK_LIST.md` | convert to generated/on-demand, then retire persistent manual-reading role | 145 direct text references found in initial scan | migrate active load-order/runtime/manual refs or leave tombstone before retirement |
| `.agents/artifacts/IMPLEMENTATION_PLAN.md` | retain as canonical planning/sequencing document | 128 direct text references found in initial scan | remove live routing duplication only |
| `.agents/artifacts/REQUIREMENTS.md` | retain as canonical requirements authority | 116 direct text references found in initial scan | no retirement |
| `.agents/artifacts/ARCHITECTURE_GUIDE.md` | retain as project architecture authority | 134 direct text references found in initial scan | no retirement; keep harness operating rules out |
| `.agents/artifacts/DOMAIN_CONTEXT.md` | retain as conditional design support | scan required before any future merge | no retirement in Slice 1 |
| `.agents/artifacts/SYSTEM_CONTEXT.md` | retain as conditional system-boundary support | scan required before any future merge | no retirement in Slice 1 |
| `.agents/artifacts/PROJECT_HISTORY.md` | retain as audit/history | scan required before any future merge | no live routing authority |
| `.agents/artifacts/PREVENTIVE_MEMORY.md` | retain as improvement memory / audit | 36 direct text references found in initial scan | no live routing authority |
| `.agents/artifacts/ACTIVE_PROFILES.md` | retain as profile/config declaration | 10 direct text references found in initial scan | no task/routing duplication |
| `.agents/artifacts/VALIDATION_REPORT.md` | retain only as persisted gate evidence / generated summary | 33 direct text references found in initial scan | live status moves to CLI/query output over later slices |
| `.agents/runtime/ACTIVE_CONTEXT.json` | retain as first-read derived AI re-entry output | 74 direct text references found in initial scan | never write authority |
| `.agents/runtime/ACTIVE_CONTEXT.md` | generated-on-demand/removable candidate | 41 direct text references found in initial scan | retain until human fallback replacement and tombstones are validated |
| `.agents/runtime/generated-state-docs/CURRENT_STATE.md` | retirement candidate | 2 direct full-path references found in initial scan | retire only after Active Context/source refs no longer require persistent copy |
| `.agents/runtime/generated-state-docs/TASK_LIST.md` | retirement candidate | 2 direct full-path references found in initial scan | retire only after Active Context/source refs no longer require persistent copy |

Reference-disposition registry:
- `reference/artifacts/PLN-22_ARTIFACT_REFERENCE_DISPOSITION.md`

## Decision Status Snapshot
| Decision | Topic | Planning status | What is already settled | What remains open before implementation |
|---|---|---|---|---|
| 1 | canonical operational substrate | approved | `.harness/operating_state.sqlite` plus structured runtime API is the canonical live operational substrate | implementation proof and migration details |
| 2 | artifact Markdown classification baseline | approved | draft 12-artifact classification table is the planning baseline | per-file execution, merge, retirement, and generated-view rollout details |
| 3 | `CURRENT_STATE.md` / `TASK_LIST.md` transition | approved | live-state Markdown should be removed or converted to generated-on-demand views | exact transition sequencing and proof that CLI/AI explanation fully replaces manual reading need |
| 4 | packet authority scope | approved | packet authority is limited to design, scope, approval, acceptance, verification expectations, source references, and audit / closeout evidence | implementation proof that packet prose no longer drives live routing, Ready For Code, next action, handoff, or closeout state |
| 5 | closeout risk tiers | approved with adjustment | low / normal / high tiers are approved; effective risk class is the higher of declared risk and detected risk floor | implementation proof for risk-floor detection, evidence mapping, and validator enforcement |
| 6 | maintainer / starter payload boundary | approved | starter excludes maintainer live state, generated maintainer views, traces, maintainer-only packets, and active-lane state; starter regenerates its own views | exact payload manifest, bootstrap proof, and starter-safe validator behavior |
| 7 | root / `standard-template` parity strategy | approved | shared source or generation first, deterministic sync second, classified manual parity last | affected-file classification and rollout proof for touched reusable files |
| 8 | cutover style | approved | parallel build, Phase 3 authority-freeze, no post-freeze dual-write, frozen read-only compatibility views, single cutover after acceptance suite pass | cutover gate, compatibility proof, rollback boundary, and acceptance suite implementation |
| 9 | artifact retirement appetite | approved with execution preconditions | retire / merge / retain rules are approved; execution requires inbound-reference scan and reference migration / tombstone / exemption handling | per-file retirement, merge, retention, compatibility, and reference-disposition plan |

## Approved Planning Baseline For Decisions 4 Through 9
These are planning baselines only. They are not implementation, cutover, artifact retirement execution, or `Ready For Code` approvals.

### Decision 4 Recommendation: Packet Authority Scope
- Keep packet authority only for:
  - purpose
  - in scope / out of scope
  - human approval text
  - acceptance criteria
  - verification expectations
  - source references
  - audit / closeout evidence
- Remove packet authority for:
  - active lane
  - live owner
  - workflow route
  - live stage / focus
  - live `Ready For Code` state
  - live next action
  - handoff state
  - live closeout state
- If a packet includes convenience status text for readability, it must be explicitly marked derived/non-authoritative.

### Decision 5 Recommendation: Closeout Risk Tiers
- `Low`:
  - planning-only docs
  - generated-view regeneration work
  - narrow maintenance with no shipped behavior change
  - closeout path: Planner or Tester evidence plus validator pass
- `Normal`:
  - reusable runtime changes
  - validator behavior changes
  - workflow/tooling changes without shipped payload risk
  - closeout path: Developer -> Tester -> Planner or Reviewer based on configured gate
- `High`:
  - authority-model mutation
  - shipped starter payload changes
  - release packaging
  - security-sensitive behavior
  - data / cutover behavior
  - closeout path: Developer -> Tester -> Reviewer -> Planner
- Effective risk class is `max(declared risk class, detected risk floor)`.
- Validator must enforce the effective risk class and required evidence set.

### Decision 6 Recommendation: Maintainer / Starter Payload Boundary
- Starter payload must exclude:
  - maintainer live operational state
  - maintainer-generated `ACTIVE_CONTEXT.*`
  - maintainer validation traces and generated state docs
  - maintainer-only packets and active-lane state
  - release-packaging-only artifacts not required by downstream starters
- Starter payload must include:
  - reusable runtime required by downstream projects
  - starter-safe workflows, templates, manuals, and initialization logic
  - starter-safe validation behavior
- Starter bootstrap must regenerate its own operational views after initialization.

### Decision 7 Recommendation: Root / `standard-template` Parity Strategy
- Use a mixed but ordered strategy:
  - first choice: shared source or generation
  - second choice: deterministic sync command
  - last resort: explicit classified manual parity
- Every reusable file touched by `PLN-22` implementation must be classified as one of:
  - root-only
  - starter-owned
  - shared-generated
  - shared-synced
  - generated-runtime
- No planning or implementation closeout should rely on undocumented manual parity expectations.

### Decision 8 Recommendation: Cutover Style
- Keep the approved high-level direction:
  - parallel build first
  - Phase 3 authority-freeze checkpoint
  - derived-surface conversion after old write paths are frozen
  - single cutover only after acceptance suite passes
- No dual-write period is allowed after the authority-freeze checkpoint.
- Old surfaces may remain readable temporarily, but only as frozen compatibility views.

### Decision 9 Recommendation: Artifact Retirement Appetite
- Default rule:
  - retire the artifact if it has no unique role after classification
  - merge it if its remaining role is fully covered by another canonical planning or audit artifact
  - retain it only if it serves a unique design-authority, audit/history, profile/config, or required evidence purpose
- `CURRENT_STATE.md`, `TASK_LIST.md`, and duplicated generated-state-doc style surfaces should be treated as strongest retirement or on-demand-generation candidates.
- `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, and required support design documents remain retain candidates.
- Before any artifact retirement or merge execution, implementation must scan inbound references and then handle each reference by migration, tombstone, or explicit exemption.

## Implementation-Proof Boundaries Still Required
- generated-view fallback proof:
  - canonical-state query works without generated Markdown
  - stale labeling is explicit
  - regeneration recovery works from deleted generated outputs
  - validator distinguishes canonical-state failure from generated-view failure
- authority-freeze proof:
  - old operational surfaces reject new writes after the checkpoint
  - new writes are accepted only through the new canonical authority
  - CLI/AI explanation still answers from canonical state during projection failure

## Verification Manifest
- Gate profile:
  - contract: approved packet scope and `Ready For Code`, root sync if reusable planning assets change, standard-template sync if reusable planning assets change, targeted runtime/validator tests, validator, active context evidence, review closeout
- Required evidence:
  - user planning approval for Decisions 1 through 9
  - user implementation slice scope / `Ready For Code` approval
  - artifact reference-disposition execution approval
  - `reference/artifacts/PLN-22_ARTIFACT_REFERENCE_DISPOSITION.md`
  - targeted runtime/validator tests for each implemented slice
  - root validator
  - active context evidence
  - validation report
  - review closeout before implementation packet exit
  - Slice 4 approval evidence before Developer start
  - separate cutover execution approval before authority switch
  - separate destructive retirement / merge approval before artifact deletion or merge

## Next Planning Action
- close `PLN-22` Slice 4 non-destructive scope after Developer, Tester, Reviewer, and Planner evidence
- keep cutover execution and destructive artifact retirement / merge on separate future approval hold
- do not start a new cutover or artifact-retirement lane until the user explicitly approves that lane

## Acceptance
- `PLN-22` is the active next planning lane instead of no-active-lane hold
- the packet points to the approved `PLN-22` planning draft as the detailed design source
- the approved planning decisions above are explicitly recorded
- implementation slice scope and `Ready For Code` approval are explicit
- artifact reference-disposition execution approval is explicit and still preserves pre-delete safeguards

## Reopen Trigger
- implementation starts without a separate `Ready For Code` approval
- packet authority, artifact retirement execution, or authority cutover is treated as already approved when it is not
- `PLN-22` is mixed with unrelated feature work, multi-agent governance work, or deferred onboarding/profile lanes
