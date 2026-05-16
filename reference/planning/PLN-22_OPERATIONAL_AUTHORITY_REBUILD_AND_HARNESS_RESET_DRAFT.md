# PLN-22 / REBUILD-01 Operational Authority Rebuild And Harness Reset Draft

## 0. Status
- Document status: draft for user review.
- Workflow: Planner.
- Implementation status: not approved.
- Purpose: define the rebuild design before opening implementation work.
- Current baseline assumption: V1.3 is stable and validator-clean, but the operating model is too expensive to change.

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
- human-facing documents remain readable and useful without competing with runtime authority
- AI-facing re-entry state is compact, deterministic, and source-traced, but derived
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
| `ACTIVE_CONTEXT.md` | derived Korean human re-entry view | Human readable, not write authority. |
| Validation reports | derived evidence | Blocks only when canonical state or required evidence fails. |
| Handoff log | canonical audit event stream or source-traced evidence | May feed live state, but prose itself must not be parsed as the only state. |
| root / `standard-template` mirrors | shared/generated/classified | Manual parity should be minimized. |

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
- High-risk review discipline must not be weakened.
- Low-risk path must not be used for authority-model, shipped-payload, security, or release changes.
- Validator enforces the risk class and required evidence set.

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
- Finalize the authority table, derived-surface table, risk-tier table, and payload contract.
- Decide the canonical operational substrate.

### Phase 3: Parallel Build
- Build the new operational authority layer behind the current baseline.
- Keep old surfaces readable during the transition.
- Do not cut over until generated views and validator can read the new authority.

### Phase 4: Derived Surface Conversion
- Convert `CURRENT_STATE.md`, `TASK_LIST.md`, `ACTIVE_CONTEXT.*`, and validation summaries to derived-only outputs.
- Remove manual write paths into derived outputs.

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
- human Markdown is either design/approval authority or generated derived view, not both
- `ACTIVE_CONTEXT.*` remains first-read re-entry output but is generated and non-authoritative
- validator does not block on duplicate wording drift when canonical state and required evidence are correct
- low-risk maintenance has a lower-cost closeout path
- high-risk shipped-surface and authority-model changes still require strong evidence and review
- root / `standard-template` parity no longer depends on manual memory
- starter payload excludes maintainer-only generated state and traces
- tests are split enough to identify which policy failed
- old operational write paths are removed or marked legacy-only after cutover

## 17. Recommended Next Decision
Recommended decision:
- Approve `PLN-22 / REBUILD-01` as the single next planning program.

Reason:
- The baseline is currently stable.
- The repeated failure mode is operating cost from multi-surface authority.
- More slices under the old model will keep paying the same coordination cost.

If approved:
- Open one planning lane for `REBUILD-01`.
- Do not reopen multi-agent work as part of this program.
- Do not start implementation until the canonical authority substrate and cutover acceptance suite are approved.

If not approved:
- Keep V1.3 on planner hold.
- Avoid opening broad implementation work because the current friction source will remain unresolved.
