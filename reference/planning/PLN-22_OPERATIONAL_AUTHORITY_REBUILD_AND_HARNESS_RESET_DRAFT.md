# PLN-22 / REBUILD-01 Operational Authority Rebuild And Harness Reset Draft

## 0. Status
- Document status: approved planning program.
- Workflow: Planner.
- Implementation status: not approved.
- Purpose: define the rebuild design before opening implementation work.
- Current baseline assumption: V1.3 is stable and validator-clean, but the operating model is too expensive to change.
- Approval decision: user approved `PLN-22 / REBUILD-01` as the single next planning program on 2026-05-16.
- Approved planning decisions on 2026-05-16:
  - canonical operational substrate: `.harness/operating_state.sqlite` plus structured runtime API
  - 12-artifact classification: approve the draft table as the planning baseline
  - live-state Markdown transition: remove or convert to generated-on-demand views
  - generated-view fallback acceptance suite: require canonical-state fallback, stale labeling, regeneration recovery, and validator failure classification
  - Phase 3 authority-freeze checkpoint rule: old operational surfaces become read-only frozen compatibility views; all new operational writes go only through the new canonical authority
- Approved planning decisions on 2026-05-17:
  - Decisions 4 through 9: approve the Planner recommendations as the `PLN-22` planning baseline
  - Decision 5 adjustment: effective risk class is the higher of declared risk and detected risk floor
  - Decision 9 adjustment: artifact retirement or merge execution requires inbound-reference scan and reference migration, tombstone, or exemption handling first
- Implementation approval on 2026-05-17:
  - implementation slice scope and `Ready For Code` are approved for the sequential slices recorded in `reference/packets/PKT-01_PLN-22_OPERATIONAL_AUTHORITY_REBUILD_AND_HARNESS_RESET.md`
  - artifact-by-artifact retire / merge / retain execution approval is recorded, but destructive retirement remains gated by inbound-reference scan plus migration / tombstone / exemption handling
- Slice progress on 2026-05-17:
- Slice 1 closeout is reflected after Developer, Tester, and Reviewer evidence completed cleanly
- Slice 2 closeout is reflected after Developer, Tester, and Reviewer evidence completed cleanly
- Slice 3 closeout is reflected after Developer, Tester, and Reviewer evidence completed cleanly
- Approval boundary: Slice 4, cutover, and final destructive artifact retirement remain gated by their prerequisite proof, separate approval, and validation evidence even though their scope and `Ready For Code` are approved.

## 1. Source Interpretation
- The current problem is not baseline breakage. The current problem is operational cost.
- Narrow slices have improved local behavior, but the same friction keeps reappearing through different surfaces.
- The rebuild should absorb useful harness strengths and remove the structures that make every small change expensive.
- Multi-agent ownership / parallel-agent governance is out of scope for this draft. Local SSOT currently associates `PLN-17` with multi-model ownership and associates `PLN-20` with maintainer / starter boundary work, but this draft follows the user's priority: do not make multi-agent mechanics part of the rebuild core.
- Maintainer / starter separation is included only where it directly reduces shipped payload and parity cost. It is not treated as a multi-agent topic.

## 2. Core Diagnosis
The harness works, but too many surfaces behave like operational truth at the same time.

Current high-cost pattern:
- live state is repeated across runtime state, packets, `CURRENT_STATE.md`, `TASK_LIST.md`, `IMPLEMENTATION_PLAN.md`, `ACTIVE_CONTEXT.*`, validator reports, handoff text, and root / `standard-template` mirrors
- packets mix design approval, scope explanation, historical evidence, live routing hints, closeout evidence, and validator-visible metadata
- human Markdown is sometimes design truth, sometimes live state, sometimes generated summary, and sometimes approval evidence
- AI compact state is useful, but it still participates in duplicate-state alignment pressure
- validator can spend too much effort policing duplicate surface wording instead of checking the actual authority and required evidence
- closeout cost often does not scale with risk
- root / `standard-template` parity often depends on humans remembering which files must be mirrored

Conclusion:
- The next work should be a rebuild program, not another micro-slice.
- The rebuild must make operational state authority singular and make every other surface derived, approval-only, or removable.

## 3. Design Goal
Create a harness operating model where:
- live operational state has exactly one canonical write authority
- human planners rely on a small canonical planning-document set for requirements, architecture, implementation sequencing, and active packet approval
- human-facing documents remain readable and useful without competing with runtime authority
- AI-facing re-entry state is compact, deterministic, and source-traced, but derived
- AI-only operational surfaces are minimized; prefer canonical state, event log, and generated-on-demand views over persistent duplicate Markdown files
- packets carry design, approval, scope, and audit meaning without becoming live routing authority
- validator blocks real authority and evidence failures, not harmless duplicate wording drift
- closeout cost scales by risk
- starter payload does not ship maintainer-only state or implementation residue
- root / `standard-template` parity is generated, shared, or explicitly classified rather than manually remembered

## 4. Strengths To Keep
The rebuild should preserve these proven strengths.

| Strength | Why keep it | Rebuild treatment |
|---|---|---|
| Packet-before-code discipline | It prevents vague implementation and preserves human approval boundaries. | Keep for meaningful implementation and shipped-surface changes; reduce packet fields that duplicate live state. |
| Human approval gates | They protect requirements, scope, release, and high-risk decisions. | Keep as explicit approval evidence, not live operational state. |
| CLI-first operation | It works better than a UI-heavy control plane for this baseline. | Keep `status`, `next`, `explain`, `context`, `validate`, and `validation-report`, but make them read from one authority. |
| Active Context re-entry | It gives AI and humans fast session recovery. | Keep as generated derived output only. |
| Source trace and handoff log | They explain why the current state exists. | Keep as audit/evidence trails; do not let prose become live state authority. |
| Tester / Reviewer separation | It catches scope drift and evidence gaps for risky changes. | Keep for normal and high-risk paths; allow a narrower path for low-risk maintenance. |
| Validator and validation report | They provide concrete confidence and regression evidence. | Keep, but focus blocking checks on canonical state, approvals, evidence, and shipped-surface safety. |
| Core / Optional Profile / Project Packet model | It prevents project-specific bias from entering core. | Keep as the reusable planning model. |
| Root / starter reusable baseline | It makes the harness installable and downstream-ready. | Keep, but replace manual mirroring with shared source, generation, or explicit sync classes. |

## 5. Weaknesses To Remove
The rebuild should eliminate or sharply reduce these costs.

| Weakness | Impact | Rebuild correction |
|---|---|---|
| Multiple operational truths | Small changes require broad synchronization and create drift. | Define one live operational authority. Everything else is derived, approval-only, audit-only, or removed. |
| Packet/header live-state leakage | Packet wording can accidentally affect routing, Ready For Code, or closeout state. | Packet authority is limited to approval, design intent, scope, non-scope, and audit evidence. |
| Human Markdown as live state | Human-readable docs become expensive machine-facing contracts. | Markdown is human-authored design/approval truth or generated human view, not operational write authority. |
| Duplicate wording validation | Validator can block harmless prose drift. | Blocking validation checks canonical state and required evidence; duplicate wording parity becomes generated/advisory where needed. |
| Uniform closeout burden | Low-risk maintenance pays the same overhead as shipped runtime changes. | Introduce explicit low / normal / high risk closeout paths. |
| Manual root / starter parity | Humans must remember mirroring rules across many files. | Move reusable shared content to source generation, sync pipeline, or explicit starter-owned classification. |
| Maintainer-only payload leakage | Downstream starter receives state or docs that should only exist in maintainer repo. | Define a shipped payload contract and exclude generated or maintainer-only runtime state. |
| Large coupled tests | Failures are hard to localize. | Split tests by authority, transition, validator, closeout, payload, and parity policy. |
| Slice-by-slice governance overhead | Every slice pays packet/header/validator/closeout alignment cost. | Plan as one rebuild program with internal workstreams and a single cutover. |

## 6. Canonical Authority Model
The rebuild uses one canonical write authority for live operational state.

### 6.1 Live Operational State
Canonical live operational state includes:
- selected work item / active lane
- current owner and workflow route
- current stage / gate / focus
- Ready For Code state
- next action
- handoff baton state
- closeout status
- validation gate decision summary
- lock state

Target rule:
- These fields must be written through one structured runtime authority.
- Candidate substrate: `.harness/operating_state.sqlite` plus a narrow structured runtime API.
- If a state file is chosen instead, it must still be the only operational write authority and must have deterministic schema validation.

### 6.2 Design And Approval Truth
Design and approval truth remains human-readable where that is valuable.

Authoritative human surfaces:
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md` for project architecture only
- `.agents/artifacts/IMPLEMENTATION_PLAN.md` for approved plan and sequencing
- active planning drafts and packets for design, scope, approval, and audit evidence
- explicit user decisions and approved authoritative sources

Boundary:
- These surfaces can approve or describe work.
- They must not be used as the live source for active owner, next action, Ready For Code, handoff state, or closeout status.
- All other state, task, context, validation, handoff, and parity surfaces should be optimized as generated AI-readable views with source references.
- When humans need details from generated operational surfaces, the harness should answer through CLI or AI-assisted explanation instead of requiring manual inspection of every file.
- If an operational surface is primarily for AI/runtime consumption and duplicates another view, it should be removed, collapsed into canonical state, or generated on demand rather than preserved as a separate file.

### 6.3 Derived Human Views
Derived human views include:
- `CURRENT_STATE.md`
- `TASK_LIST.md`
- `.agents/runtime/ACTIVE_CONTEXT.md`
- generated state docs
- validation report Markdown summary

Target rule:
- Derived human views are generated from canonical live state plus approved design/approval sources.
- Manual edits to derived human views are forbidden.
- Wording drift in derived prose is not a blocker unless it changes a required approval, safety, or shipped payload meaning.

### 6.4 Derived AI Views
Derived AI views include:
- `.agents/runtime/ACTIVE_CONTEXT.json`
- compact generated state summaries
- structured validation summaries

Target rule:
- AI views optimize re-entry speed and determinism.
- They are never operational write authority.
- If they conflict with canonical live state, regeneration is required rather than manual correction.

### 6.5 Packet Authority
Packets keep authority for:
- purpose
- scope
- non-scope
- human approval text
- design decisions
- acceptance criteria
- verification expectations
- audit trail

Packets do not keep authority for:
- live owner
- active route
- current stage
- live Ready For Code state
- live next action
- live closeout state
- current lock state

## 7. Surface Reduction Plan
Every current surface should be classified before implementation.

| Surface | Target classification | Notes |
|---|---|---|
| `.harness/operating_state.sqlite` | canonical live operational authority | Preferred runtime authority if schema/API is simplified. |
| Structured runtime API | canonical write path | All operational mutation should go through this path. |
| `REQUIREMENTS.md` | human design/requirements authority | Not live execution state. |
| `ARCHITECTURE_GUIDE.md` | project architecture authority | Harness operating rules stay outside it. |
| `IMPLEMENTATION_PLAN.md` | human planning/sequencing authority | Should not duplicate live active-lane state. |
| Packets | approval/scope/audit authority | Remove live routing fallback. |
| `CURRENT_STATE.md` | derived human view | Generated from canonical state and approved source refs. |
| `TASK_LIST.md` | derived human view | Generated from canonical tasks/locks and source refs. |
| `ACTIVE_CONTEXT.json` | derived AI view | First read, not write authority. |
| `ACTIVE_CONTEXT.md` | generated-on-demand or removable human re-entry view | Keep only if it remains useful as a human summary; otherwise generate through CLI/AI explanation. |
| Validation reports | audit evidence or generated-on-demand view | Persist only required gate evidence; current-status summaries should be CLI/query output. |
| Handoff log | canonical event log / audit evidence | Keep as event data, not as a manual-reading surface or duplicated state document. |
| root / `standard-template` parity surfaces | manifest/test output/generated view | Replace persistent prose parity summaries with sync manifests, tests, and on-demand reports. |

### 7.1 Operational Surface Collapse Targets
The following surfaces should be reduced unless a concrete human-facing need justifies keeping them.

| Surface family | Preferred target | Rationale |
|---|---|---|
| Handoff summaries | canonical event log plus CLI/AI summary | Preserves auditability without requiring humans or AI to reconcile handoff prose across files. |
| `ACTIVE_CONTEXT.json` | one compact generated AI re-entry view or runtime query output | Keep only the minimal first-read contract; do not duplicate task/current/status documents inside it beyond source references. |
| `ACTIVE_CONTEXT.md` | remove or generate on demand | If humans are not routinely reading it, persistent Markdown adds maintenance cost. |
| `TASK_LIST.md` | remove or generate on demand from canonical tasks/locks | Live task state belongs in canonical operational state. |
| `CURRENT_STATE.md` | remove or generate on demand from canonical state | Current state duplicates status/context/task surfaces unless it is strictly generated. |
| Validation current-status summaries | CLI/query output; persist only gate evidence | The permanent artifact should be evidence, not another live status surface. |
| Parity summaries | sync manifest, parity tests, and generated report on demand | Parity should be enforced by tooling, not maintained as prose. |

## 7A. Artifact Markdown Rationalization
The rebuild must also review `.agents/artifacts/*.md` for duplicated function and role overlap.

Reason:
- The current operational cost is not only runtime-state duplication. Some artifact Markdown files also overlap in purpose, audience, or update timing.
- If two Markdown artifacts both describe current work, next action, release state, approval status, or handoff meaning, they can recreate the same multi-authority problem even after runtime authority is simplified.
- The rebuild should not preserve a large artifact set by default. Each Markdown artifact must justify its role.
- Human planners should not need to inspect every state, task, context, validation, handoff, and parity surface. Those surfaces should mostly become generated AI-readable views with source references.

Review targets:
- `CURRENT_STATE.md`
- `TASK_LIST.md`
- `IMPLEMENTATION_PLAN.md`
- `REQUIREMENTS.md`
- `ARCHITECTURE_GUIDE.md`
- `DOMAIN_CONTEXT.md`
- `SYSTEM_CONTEXT.md`
- `PROJECT_HISTORY.md`
- `PREVENTIVE_MEMORY.md`
- `ACTIVE_PROFILES.md`
- `VALIDATION_REPORT.md`
- generated Markdown under `.agents/runtime/generated-state-docs/*`

Classification rule:
- human design authority: durable requirements, architecture, domain, system, or planning decisions that humans must author or approve
- canonical planning document: small human-facing planning set for requirements, architecture, implementation sequencing, and active packet approval
- generated human view: readable current state, task list, validation summary, or re-entry summary generated from canonical state
- generated AI-readable view: structured or compact machine-oriented state, task, context, validation, handoff, or parity view with source references
- audit/history: historical evidence that should not drive current routing
- profile/config declaration: explicit activation state or reusable profile configuration
- removable/merge candidate: content whose role is fully covered by another artifact or a generated view

### 7A.1 Initial Artifact Classification Draft
This table is the starting point for `Decision 2`. It is not final implementation approval, but it makes the consolidation discussion concrete.

| Artifact | Draft classification | Human reads directly? | Expected rebuild disposition |
|---|---|---|---|
| `CURRENT_STATE.md` | generated human view / removable candidate | normally no | Remove as a persistent manual-reading surface or generate on demand from canonical state; transition-only generated file is acceptable. |
| `TASK_LIST.md` | generated human view / removable candidate | normally no | Remove as a persistent manual-reading surface or generate on demand from canonical tasks and locks; task truth lives in canonical state. |
| `IMPLEMENTATION_PLAN.md` | canonical planning document | yes | Keep, but limit to durable sequencing, implementation strategy, and approved plan decisions; remove live routing duplication. |
| `REQUIREMENTS.md` | canonical planning document | yes | Keep as human-facing requirements authority. |
| `ARCHITECTURE_GUIDE.md` | canonical planning document | yes | Keep for project technical architecture only; do not use as harness operating-rule authority. |
| `DOMAIN_CONTEXT.md` | canonical planning/design support document | yes when data-impact work exists | Keep when domain/data context is relevant; not part of live operational state. |
| `SYSTEM_CONTEXT.md` | canonical planning/design support document | yes when system boundary matters | Keep when system boundary or integration context is relevant; not part of live operational state. |
| `PROJECT_HISTORY.md` | audit/history | rarely | Keep as durable historical context; never drive current routing, task state, or closeout state. |
| `PREVENTIVE_MEMORY.md` | audit/history plus human-reviewed improvement memory | rarely | Keep as an improvement-candidate registry only; it must not become live operational state or mandatory daily reading. |
| `ACTIVE_PROFILES.md` | profile/config declaration | only when profiles are active | Keep as explicit profile activation/config state, but do not duplicate current task status or routing. |
| `VALIDATION_REPORT.md` | persisted gate evidence / generated view | only when reviewing evidence | Persist only required validation evidence; live validation status should be CLI/query output. |
| `.agents/runtime/generated-state-docs/*` | generated AI-readable or generated human view / removable candidate | normally no | Remove persistent copies where possible; otherwise generate from canonical state and mark stale/failure explicitly. |

Initial expected outcomes:
- Human-facing canonical planning documents should be limited to requirements, architecture, implementation sequencing, active packet approval, and project-specific design documents such as screen list, DB design, API spec, permission matrix, and business process when those are relevant.
- `CURRENT_STATE.md` and `TASK_LIST.md` should be removed or generated on demand from canonical state; if temporarily retained, they must be generated-only and non-authoritative.
- `IMPLEMENTATION_PLAN.md` should stop duplicating live active-lane routing and focus on approved sequencing and durable plan decisions.
- `ARCHITECTURE_GUIDE.md` should remain project architecture only and must not become harness operating-rule authority.
- `PROJECT_HISTORY.md` should retain durable historical context without competing with current state.
- `VALIDATION_REPORT.md` should remain only where persisted gate evidence is required; live validation status should be CLI/query output.
- Handoff, Active Context, task status, validation, and parity details should be queryable through CLI or AI-assisted explanation when humans need them, rather than treated as mandatory manual-reading surfaces.
- AI-only operational surfaces should not be kept as persistent duplicate Markdown. Prefer canonical operational store, source references, event log, and generated-on-demand explanation.
- If any artifact cannot be assigned one primary role, the rebuild must split, merge, or retire it.

## 8. Validator Redesign
Validator should answer fewer, stronger questions.

Blocking checks:
- canonical live operational state is well-formed
- canonical state references resolve
- required human approvals exist for the current risk class
- derived outputs are fresh enough or explicitly stale
- generated outputs are not manually edited
- starter payload contract excludes maintainer-only state
- high-risk shipped-surface changes include required verification and review evidence
- root / starter shared-source generation or sync classification is satisfied

Advisory or generated-parity checks:
- human prose wording differences that do not change authority
- duplicate derived summaries that can be regenerated
- non-canonical packet wording that does not affect approval, scope, or acceptance
- count/detail formatting drift outside required evidence boundaries

Removed checks:
- checks that only prove two non-canonical summaries use the same wording
- checks that force packets to restate live routing state already held in canonical runtime
- checks that make generated views behave like writable truth

## 9. Closeout Redesign
Closeout should scale with risk.

| Risk class | Applies to | Required path |
|---|---|---|
| Low | planning-only docs, derived-view regeneration, narrow maintenance with no shipped behavior change | Planner or Tester evidence can close if validator passes and no approval boundary changes. |
| Normal | reusable runtime changes, validator behavior changes, workflow/tooling changes without shipped payload risk | Developer -> Tester -> Planner or Reviewer based on configured gate. |
| High | shipped starter payload, release packaging, security-sensitive behavior, data/cutover behavior, authority model mutation | Developer -> Tester -> Reviewer -> Planner closeout with explicit evidence. |

Rules:
- Risk class must be declared before implementation.
- Effective risk class is computed as the higher of declared risk class and detected risk floor.
- Detected risk floor is derived from implementation impact signals such as authority-model mutation, shipped starter payload changes, release packaging, security-sensitive behavior, data/cutover behavior, validator behavior changes, and reusable runtime/tooling changes.
- High-risk review discipline must not be weakened.
- Low-risk path must not be used for authority-model, shipped-payload, security, or release changes.
- Validator enforces the effective risk class and required evidence set.

## 10. Maintainer / Starter Split
This rebuild should separate maintainer repo concerns from shipped starter payload.

Maintainer-only:
- release packaging logic
- repo synchronization tooling
- historical packets and maintainer audit trails
- current maintainer live state
- generated Active Context for the maintainer repo
- maintainer validation traces

Starter-shipped:
- reusable harness runtime needed by downstream projects
- starter initialization flow
- starter-safe workflows, manuals, templates, and validation behavior
- bootstrap instructions
- empty or generated-after-init operational state

Rules:
- Generated maintainer `ACTIVE_CONTEXT.*` must not ship as starter truth.
- Downstream starter must regenerate its own context after bootstrap.
- Starter payload tests must prove maintainer-only traces and live state are excluded.

## 11. Root / Standard-Template Parity Redesign
Manual parity should stop being a memory task.

Preferred approaches:
- Shared source: one source file generates both root and starter copies.
- Generation: derived starter assets are built from a manifest.
- Sync pipeline: parity is applied by a command with deterministic diff output.
- Explicit classification: files are marked as root-only, starter-owned, shared-generated, shared-manual, or generated-runtime.

Blocking requirement:
- A reusable change cannot close until its affected files have a parity classification.

Non-goal:
- Do not mirror every maintainer artifact into `standard-template`.
- Do not preserve parity for files that should not ship.

## 12. Test Architecture Rebuild
Current broad regression coverage should be split into focused suites.

Target test groups:
- authority-store tests
- operational transition tests
- Active Context generation tests
- human generated-view tests
- packet authority and approval-boundary tests
- validator blocking/advisory policy tests
- closeout risk-tier tests
- starter payload exclusion tests
- root / starter parity classification tests
- migration and cutover tests

Success condition:
- When a regression fails, the responsible policy area is obvious.
- Root and starter suites remain comparable where behavior is shared, but starter does not test maintainer-only behavior as if it were shipped behavior.

## 13. Migration And Cutover Plan
### Phase 1: V1.3 Freeze
- Freeze the current V1.3 baseline for safety fixes only.
- Stop opening new micro-lanes for the same operating-cost problem.
- Keep validator pass as the baseline health check.

### Phase 2: Rebuild Design Approval
- Review and approve this `REBUILD-01` design.
- Finalize the authority table, artifact Markdown role table, derived-surface table, risk-tier table, and payload contract.
- Decide the canonical operational substrate.

### Phase 3: Parallel Build
- Build the new operational authority layer behind the current baseline.
- Keep old surfaces readable during the transition.
- Do not cut over until generated views and validator can read the new authority.
- Transition authority rule: from the Phase 3 authority-freeze checkpoint onward, old operational surfaces remain readable only as frozen compatibility views, and all new operational writes must go only through the new canonical authority.
- Planning approval status: the authority-freeze rule above was approved by user on 2026-05-16; implementation proof remains pending.
- Add a generation-failure fallback before removing any existing operational surface.
- Required fallback behavior:
  - CLI commands must report `generation_failed` or `stale_generated_view` explicitly instead of silently serving old content.
  - CLI/AI explanation must fall back to canonical operational state and event log when generated Markdown is missing or stale.
  - last-known-good generated output may be shown only when it is clearly labeled stale and linked to the canonical source refs used to detect the failure.
  - validator must distinguish canonical-state failure from generated-view failure so the operator knows whether the live state is unsafe or only the projection failed.
- Planning approval status: the fallback acceptance requirements above were approved by user on 2026-05-16; implementation proof remains pending.
- Reason:
  the 2026-05-13 history includes repeated context-repair events, including five context-repair occurrences, so generated-view failure is a known operational risk rather than a theoretical edge case.

### Phase 4: Derived Surface Conversion
- Convert `CURRENT_STATE.md`, `TASK_LIST.md`, `ACTIVE_CONTEXT.*`, and validation summaries to derived-only outputs.
- Remove manual write paths into derived outputs.
- Phase 4 must not begin until the Phase 3 authority-freeze checkpoint is complete, so no old derived surface can still accept live operational writes while conversion is underway.
- Do not retire persistent `CURRENT_STATE.md`, `TASK_LIST.md`, `ACTIVE_CONTEXT.md`, validation summary, or generated-state-doc surfaces until the fallback path is tested.
- Required conversion gates:
  - canonical-state query can answer current owner, workflow, active work, next action, lock state, validation gate, and latest handoff without relying on generated Markdown
  - CLI/AI explanation can produce the human-readable summary from canonical state and source refs
  - generated-view failure produces a clear diagnostic and recovery instruction
  - regeneration can recover after deleting generated outputs
  - transition fallback prevents a blank or misleading re-entry surface after generation failure

### Phase 5: Validator And Closeout Cutover
- Repoint blocking validator checks to canonical state and required evidence.
- Convert duplicate surface drift to advisory or generated parity.
- Enable risk-tiered closeout paths.

### Phase 6: Starter Payload And Parity Cutover
- Apply maintainer / starter payload split.
- Add generation or sync pipeline for shared assets.
- Remove starter-shipped maintainer-only traces.

### Phase 7: Single Cutover
- Regenerate no-active-lane baseline from the new model.
- Run root and starter acceptance suites.
- Archive or delete old operational write paths.
- Keep historical packets as audit evidence only.

## 14. In Scope
- single canonical live operational authority
- derived human and AI surfaces
- packet authority reduction
- artifact Markdown role-overlap review, consolidation, split, or retirement
- validator blocking/advisory redesign
- risk-tiered closeout model
- maintainer / starter payload split where it reduces operating cost
- root / `standard-template` parity redesign
- test architecture rebuild
- migration and single cutover plan

## 15. Out Of Scope
- multi-agent ownership or parallel-agent conflict model
- product-specific UX/onboarding rewrite
- `PREVENTIVE_MEMORY` detailed trigger policy
- optional profile catalog expansion
- downstream application readiness work
- new PMW surface
- feature work unrelated to harness operating-cost reduction

## 16. Acceptance Criteria
The rebuild design is acceptable when:
- active lane, owner, stage, next action, Ready For Code, handoff state, lock state, and closeout state have one canonical write authority
- packet/header is not live operational authority
- human planners rely on a small canonical planning-document set rather than manually inspecting state, task, context, validation, handoff, and parity surfaces
- human Markdown is either design/approval authority or generated derived view, not both
- artifact Markdown files with duplicate roles are consolidated, split, reclassified, or retired so each remaining file has one primary purpose
- `ACTIVE_CONTEXT.*` remains first-read re-entry output but is generated and non-authoritative
- generated operational surfaces are AI-readable, source-referenced, and explainable through CLI or AI-assisted answers when humans need details
- AI-only operational surfaces are removed, collapsed into canonical state/event log, or generated on demand instead of preserved as persistent duplicate documents
- validator does not block on duplicate wording drift when canonical state and required evidence are correct
- low-risk maintenance has a lower-cost closeout path
- high-risk shipped-surface and authority-model changes still require strong evidence and review
- root / `standard-template` parity no longer depends on manual memory
- starter payload excludes maintainer-only generated state and traces
- tests are split enough to identify which policy failed
- old operational write paths are removed or marked legacy-only after cutover

## 17. User Decision Matrix
The rebuild should not move into implementation until these decisions are explicit.

### Decision 1: Canonical Operational Substrate
Recommended decision:
- Use `.harness/operating_state.sqlite` plus a narrow structured runtime API as the canonical live operational authority.

Approval status:
- Approved by user on 2026-05-16 as the planning baseline for `PLN-22`.

Options:
| Option | Effect | Tradeoff |
|---|---|---|
| SQLite + structured runtime API | Best fit with current hot-state model and existing tooling; supports durable event/state queries. | Requires schema/API cleanup and migration discipline. |
| Single structured state file | Easier to inspect and diff manually. | More fragile for concurrent transitions, event history, and schema evolution. |
| Markdown authority | Human-readable by default. | Recreates the current problem; not recommended for live operational state. |

Decision impact:
- This decides where active lane, owner, stage, Ready For Code, next action, handoff state, lock state, and closeout state are written.
- It also decides how `CURRENT_STATE.md`, `TASK_LIST.md`, `ACTIVE_CONTEXT.*`, and validation reports are regenerated.

### Decision 2: Artifact Markdown Consolidation Strictness
Recommended decision:
- Apply strict one-primary-role classification to every `.agents/artifacts/*.md` file and keep the human-facing canonical planning set small.

Approval status:
- Approved by user on 2026-05-16 using the draft 12-artifact classification table as the planning baseline.

Options:
| Option | Effect | Tradeoff |
|---|---|---|
| Strict classification | Each artifact is canonical planning document, generated human view, generated AI-readable view, audit/history, profile/config, or removable. | Requires more up-front cleanup and some file moves or content splits. |
| Soft classification | Current files mostly remain, but headers declare authority boundaries. | Lower immediate disruption, but duplicate-role friction may remain. |
| Minimal change | Only obviously generated files are reclassified. | Fastest, but does not solve artifact-level role overlap. |

Decision impact:
- This decides whether the rebuild actually reduces artifact count and overlap, or only clarifies existing files.
- Strict classification gives the best long-term operating-cost reduction.
- It also decides whether humans keep reading a small planning set or continue carrying the burden of inspecting many operational surfaces.

### Decision 3: Fate Of `CURRENT_STATE.md` And `TASK_LIST.md`
Recommended decision:
- Remove both as persistent manual-reading surfaces, or generate them on demand from canonical state during a transition period.

Approval status:
- Approved by user on 2026-05-16 as part of the live-state Markdown transition rule.

Options:
| Option | Effect | Tradeoff |
|---|---|---|
| Remove / on-demand generation | Lowest long-term operating cost; canonical state and CLI/AI explanation become the access path. | Requires good CLI/status/explain behavior before removal. |
| Generated-only persistent files | Removes their live write authority and prevents manual drift while preserving familiar files. | Still leaves extra surfaces to refresh and inspect. |
| Hybrid editable | Keeps manual correction possible. | High drift risk; weakens single-authority model. |

Decision impact:
- This directly affects the first-read load order and operator experience.
- Remove / on-demand generation gives the best rebuild outcome if CLI/AI explanation is good enough.
- Generated-only persistent files are an acceptable transition step, but should not be the final target unless a real human need remains.

### Decision 4: Scope Of Packet Authority
Recommended decision:
- Packets stay authoritative only for design, scope, approval, acceptance, verification expectations, and audit evidence.

Approval status:
- Approved by user on 2026-05-17 as the planning baseline for `PLN-22`.

Planner recommendation detail:
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
- Convenience packet status text may remain only when explicitly labeled derived/non-authoritative.

Options:
| Option | Effect | Tradeoff |
|---|---|---|
| Narrow packet authority | Prevents packet/header from driving live routing or closeout. | Requires tools to stop reading packet prose as state fallback. |
| Medium packet authority | Packet retains some live-state hints for readability. | Easier migration, but risk of authority leakage remains. |
| Current broad packet authority | Minimal implementation disruption. | Rebuild goal is not met. |

Decision impact:
- This determines whether packet wording drift can still break otherwise valid operational state.
- Narrow packet authority is required for a real single-authority model.

### Decision 5: Closeout Risk Thresholds
Recommended decision:
- Use three risk classes: low, normal, high.

Approval status:
- Approved by user on 2026-05-17 as the planning baseline for `PLN-22`, with the adjustment that effective risk class is computed as the higher of declared risk and detected risk floor.

Planner recommendation detail:
- `Low`: planning-only docs, generated-view regeneration, narrow maintenance with no shipped behavior change
- `Normal`: reusable runtime changes, validator behavior changes, workflow/tooling changes without shipped payload risk
- `High`: authority-model mutation, shipped starter payload changes, release packaging, security-sensitive behavior, data/cutover behavior
- Required closeout paths:
  - low: Planner or Tester evidence plus validator pass
  - normal: Developer -> Tester -> Planner or Reviewer based on configured gate
  - high: Developer -> Tester -> Reviewer -> Planner
- Effective risk class:
  - `effective risk = max(declared risk class, detected risk floor)`
  - declared risk may raise the class above the detector floor
  - detected risk floor prevents under-declaring authority-model, shipped-payload, release, security, data/cutover, validator, reusable runtime, or workflow/tooling changes

Options:
| Option | Effect | Tradeoff |
|---|---|---|
| Three-tier model | Aligns closeout effort with actual risk. | Requires risk declaration and validator enforcement. |
| Two-tier model | Simpler low/high split. | Less precise; normal reusable runtime work may be over- or under-governed. |
| Current uniform model | Preserves strictness. | Keeps operating cost high for low-risk changes. |

Decision impact:
- This decides when Reviewer is mandatory.
- High-risk authority, shipped-surface, security, release, and data/cutover changes should still require Reviewer closeout.

### Decision 6: Maintainer / Starter Payload Boundary
Recommended decision:
- Exclude maintainer live state, generated maintainer Active Context, traces, and maintainer-only packaging/release artifacts from starter payload.

Approval status:
- Approved by user on 2026-05-17 as the planning baseline for `PLN-22`.

Planner recommendation detail:
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

Options:
| Option | Effect | Tradeoff |
|---|---|---|
| Strict payload exclusion | Starter begins clean and regenerates its own state. | Requires stronger bootstrap and payload tests. |
| Partial exclusion | Removes only the most obvious maintainer artifacts. | Easier short term, but downstream leakage can remain. |
| Current payload behavior | Minimal change. | Recreates starter confusion and parity burden. |

Decision impact:
- This determines how clean downstream projects are after bootstrap.
- It also determines which root files must have starter equivalents and which must never ship.

### Decision 7: Root / `standard-template` Parity Strategy
Recommended decision:
- Prefer shared source or generation for reusable shared assets, with explicit classification for root-only and starter-owned files.

Approval status:
- Approved by user on 2026-05-17 as the planning baseline for `PLN-22`.

Planner recommendation detail:
- Ordered strategy:
  - first choice: shared source or generation
  - second choice: deterministic sync command
  - last resort: explicit classified manual parity
- Every reusable file touched by implementation must be classified as:
  - root-only
  - starter-owned
  - shared-generated
  - shared-synced
  - generated-runtime
- No closeout should rely on undocumented manual parity memory.

Options:
| Option | Effect | Tradeoff |
|---|---|---|
| Shared source / generation | Best long-term parity reliability. | Requires build/sync tooling and migration. |
| Deterministic sync command | Easier to retrofit to existing duplicated files. | Still keeps two copies, but reduces manual memory. |
| Manual parity with checklist | Lowest implementation cost. | Does not solve the current parity burden. |

Decision impact:
- This decides whether parity remains a human responsibility or becomes tooling-driven.
- It also affects test design and release packaging.

### Decision 8: Cutover Style
Recommended decision:
- Build in parallel, then cut over once after the acceptance suite passes.

Approval status:
- Approved by user on 2026-05-17 as the planning baseline for `PLN-22`.

Planner recommendation detail:
- parallel build first
- Phase 3 authority-freeze checkpoint before any derived-surface conversion
- no dual-write period after the authority-freeze checkpoint
- old surfaces may stay readable temporarily only as frozen compatibility views
- single cutover only after the acceptance suite passes

Options:
| Option | Effect | Tradeoff |
|---|---|---|
| Single cutover after parallel build | Avoids long-lived half-old/half-new authority. | Requires larger acceptance gate before switch. |
| Incremental cutover by surface | Smaller implementation steps. | Higher risk of temporary mixed authority and repeated drift. |
| Big bang rewrite without parallel validation | Fastest on paper. | Too risky for this harness; not recommended. |

Decision impact:
- This determines how much temporary compatibility code is needed.
- Single cutover best matches the goal of avoiding repeated micro-slice governance overhead.

### Decision 9: Artifact Retirement Appetite
Recommended decision:
- Allow retirement or merge of artifacts that cannot justify a unique role after classification.

Approval status:
- Approved by user on 2026-05-17 as the planning baseline for `PLN-22`, with the adjustment that retirement or merge execution requires inbound-reference scan and reference migration, tombstone, or exemption handling first.

Planner recommendation detail:
- retire the artifact if it has no unique role after classification
- merge it if its remaining role is fully covered by another canonical planning or audit artifact
- retain it only if it serves a unique design-authority, audit/history, profile/config, or required evidence purpose
- `CURRENT_STATE.md`, `TASK_LIST.md`, and duplicated generated-state-doc style surfaces are strongest retirement or on-demand-generation candidates
- `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, and required support design documents are retain candidates
- before retirement or merge execution, scan inbound references and classify each reference as:
  - migrate to the new canonical/generated surface
  - tombstone with a replacement pointer and historical rationale
  - exempt with an explicit reason and owner

Options:
| Option | Effect | Tradeoff |
|---|---|---|
| Allow retirement/merge | Reduces long-term surface count and maintenance cost. | Requires careful migration notes and reference updates. |
| Keep all artifacts but reclassify | Lower disruption to references and habits. | Some reading burden remains. |
| Decide later | Defers hard choices. | Rebuild may preserve too much old structure. |

Decision impact:
- This controls how aggressively the rebuild simplifies the artifact layer.
- If retirement is disallowed, the rebuild should still enforce generated-only and authority-boundary headers.

## 18. Approved Next Decision
Approved decision:
- `PLN-22 / REBUILD-01` is approved as the single next planning program.

Reason:
- The baseline is currently stable.
- The repeated failure mode is operating cost from multi-surface authority.
- More slices under the old model will keep paying the same coordination cost.

Next planning action:
- Reflect Slice 3 closeout in canonical planning state.
- Keep Slice 4, cutover, and destructive artifact retirement / merge execution blocked until separate approval and later validation evidence are complete.
- Decide whether to open a dedicated Slice 4 planning / approval lane once cutover and retirement prerequisites are ready.

Still pending:
- packet-authority implementation proof beyond Slice 2
- artifact retirement execution decisions per file, including derived-surface proof and later inbound-reference retirement handling
- generated-view fallback acceptance suite implementation proof
- Phase 3 authority-freeze checkpoint implementation proof
- Slice 4 planning / approval, cutover acceptance evidence, and later destructive retirement / merge execution approval
