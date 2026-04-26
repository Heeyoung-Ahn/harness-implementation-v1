# PLN-06 Standalone Business Harness V1.1

## Purpose
Define the V1.1 requirements before implementation. This lane exists because the next use of `standard-template/` is expected to start real web-app replacement projects for business systems currently operated through Excel/VBA and MariaDB.

## Operating Decision
- V1.1 is not an OMX integration lane.
- V1.1 is not a partial hardening lane.
- V1.1 must leave the standard template ready for real project kickoff after this lane closes.
- Essential readiness work must be implemented, tested, documented, synchronized into `standard-template/`, and reviewed in this same lane.

### Essential Readiness Boundary
Essential for V1.1:
- harness/product path separation
- repository layout ownership contract
- truth hierarchy sync across `AGENTS.md`, workspace rules, architecture, and user manual
- structured `TASK_LIST.md` tables
- standalone command surface with useful operator-facing output for doctor/status/next/explain/validation-report
- required optional profile documents added and wired into packet evidence rules
- validator detects missing required evidence for active profiles and task packets
- validation report persistence
- root and `standard-template/` sync validation
- review closeout proving no essential readiness item was deferred

Optional enhancements after V1.1:
- rich PMW UI polish beyond preserving the current read-only surface
- advanced changed-file or semantic validator beyond the required evidence checks
- CI dashboard integration
- multi-project registry
- advanced migration automation beyond preview/report/gate evidence
- automated semantic validation of business-specific approval matrices or financial mappings

## Target Downstream Project Class
- Budget management program replacement
- Asset management program replacement
- Corporate accounting management program replacement
- Similar internal business systems where Excel workbooks, VBA macros, MariaDB tables, manual operator steps, and approval/audit rules currently act as production logic

## Priority Breakdown

### P0. Safety And Starter Usability
- prevent harness/product source path collision
- provide repository layout ownership contract
- preserve or wrap existing init/test/validate/PMW/migration/cutover behavior
- fix cross-platform repo-relative path safety
- sync truth hierarchy and conflict rules
- keep root and `standard-template/` synchronized
- keep copied-starter bootstrap behavior clear

### P1. Standalone Operations And Evidence Gates
- add doctor/status/next/explain/validation-report command UX
- persist validation reports as operational artifacts
- add structured task tables and basic table validation
- add legacy Excel/VBA-MariaDB replacement profile
- add Python/Django backoffice profile
- add workflow/approval application profile
- update packet readiness evidence and profile activation evidence
- enforce active profile evidence in validator

### P2. Usability Examples And Optional Extensions
- add sample packets only if P0/P1 are complete and the samples do not delay essential closeout
- add optional CI template only if it is opt-in and does not assume every project uses GitHub Actions
- add PMW display polish only if it does not change PMW's read-only authority boundary

## Core Requirements

### R1. Standalone Harness Position
The standard template must work as a repo-native standalone governance harness. It must not depend on OMX, `.omx`, tmux, Codex CLI prompt catalogs, MCP bridges, external orchestration runtimes, or mixed-agent team execution.

### R2. No Partial Delivery Assumption
The lane must not close with "do this later" for essential production readiness. Follow-up notes are allowed only for optional enhancements that are not required to safely start the target downstream projects.

### R3. Harness/Product Code Separation
The harness runtime must not occupy ambiguous product-code paths such as root `src/`, root `test/`, or root `package.json` in the deployable starter unless the requirements explicitly preserve a compatibility wrapper. Product code must be free to use `src/`, `app/`, `backend/`, `frontend/`, `server/`, or another project-selected layout.

### R4. Repository Layout Ownership
The template must include a standard repository layout ownership contract. It must identify harness-owned paths, governance-owned paths, generated paths, report paths, and project-owned product-code paths. The selected product source root must be recordable during kickoff and citeable in packets.

### R5. Harness Runtime Requirement Clarity
Node.js 24+ must be documented as a harness runtime requirement only, not as a product application runtime requirement. Python/Django, Node, or other product runtimes must be project decisions handled by profile and packet evidence.

### R6. Standalone Command UX
The template must provide first-class standalone commands for operators and agents:
- initialize
- test
- validate
- doctor
- status
- next
- explain
- PMW start
- migration preview/apply
- cutover preflight/report
- validation report generation

V1.1 command acceptance levels:

| Command | V1.1 level |
| --- | --- |
| initialize | working, preserving starter bootstrap behavior |
| test | working, runs harness tests without occupying product test ownership |
| validate | working, existing validator behavior preserved and extended |
| doctor | working summary with pass/warn/fail checks |
| status | working summary of current stage, active work, blockers, profiles, and validation state |
| next | rule-based recommendation using current stage, blockers, validation, and packet state |
| explain | last validation/gate blocker explanation with next action |
| PMW start | existing read-only PMW start behavior preserved or wrapped |
| migration preview/apply | existing behavior preserved or wrapped; no advanced migration automation required |
| cutover preflight/report | existing behavior preserved or wrapped |
| validation-report | persisted artifact output required |

### R7. Truth Hierarchy
The template must state one consistent truth hierarchy across `AGENTS.md`, workspace rules, architecture, and user manual:
1. Governance Markdown truth: `.agents/artifacts/*.md`
2. Hot operational DB state
3. Generated operational docs
4. PMW read-only surface

Conflict rules must state that generated docs are not manually edited, PMW is never write authority, and DB hot-state must reconcile to governance truth before gate close.

### R8. Structured Task Truth
`TASK_LIST.md` must remain readable for humans and also expose stable tables for active locks, active tasks, blocked tasks, completed tasks, and handoff log. Validator/reporting must be able to reason about task IDs, owner, status, dependencies, verification, and lock state.

### R9. Legacy Excel/VBA-MariaDB Intake
The template must support intake of legacy system sources before design or implementation:
- workbook inventory
- sheet/range/header mapping
- VBA module/macro/function inventory
- MariaDB schema snapshot
- queries/views/procedures/triggers inventory where available
- scheduled/manual operator steps
- current import/export/report paths
- source-of-truth ownership
- reconciliation and parallel-run evidence

### R10. Migration And Reconciliation Gate
The template must require migration planning for legacy replacements:
- source data snapshot
- target schema impact
- transformation assumptions
- row identity / matching rule
- financial or asset balance reconciliation when applicable
- rollback and re-run strategy
- cutover freeze/lock window
- post-cutover verification

### R11. Workflow, Approval, Audit Readiness
The standard template must support workflow-heavy internal systems without hardcoding one domain. It must provide reusable optional profile requirements for state machines, approval rule matrices, role/permission matrices, audit event specs, exception handling, and rollback/reopen rules.

### R12. Python/Django Backoffice Readiness
The standard template must provide a Python/Django backoffice optional profile. It must cover project source root, Python/Django version selection policy, supported-version/security-support rationale, dependency manager, app/module boundaries, settings/environment policy, migration policy, DB compatibility policy, transaction/service boundary, auth/permission/admin boundary, background job boundary, test convention, and static/media/admin customization boundaries. Core must not pin one Django version as a universal default.

### R13. Domain Specificity Boundary
The template must not put budget, asset, or corporate accounting table names, screen names, account mapping rules, or approval chains into core. Those belong in project packets or explicitly activated optional profiles for that project.

### R14. Validator Enforcement
The validator must use explicit enforcement levels, not a vague "where possible" boundary.

Must fail:
- cross-platform repo-relative path safety violation
- missing required harness-owned path
- malformed structured task table required by V1.1
- concrete task packet registration missing or wrong category
- required task packet evidence missing when packet claims `Ready For Code`
- active profile reference missing for a declared profile
- required active profile evidence missing when the related packet claims `Ready For Code`
- validation report generation failure when `validation-report` is invoked
- root/starter sync drift for reusable files in the V1.1 sync class

Warn acceptable:
- generated docs freshness drift before cutover, if recovery action is printed
- source wave ledger parity warning when a source wave exists but no active packet is currently in scope
- incomplete Django/legacy/workflow profile evidence before the packet claims `Ready For Code`
- optional sample packet absence

Document only:
- semantic correctness of project-specific approval matrices
- semantic correctness of business-specific legacy mapping
- business-specific account, asset, or budget policy correctness
- advanced migration automation completeness beyond preview/report/gate evidence

### R15. Starter Synchronization
Every reusable root change must be synchronized into `standard-template/` in the same change set. The lane is not complete if root and starter drift.

The sync contract must classify changed files:

| Class | Root path | Starter path | Sync rule |
| --- | --- | --- | --- |
| reusable governance doc | `.agents/artifacts/*.md` | `standard-template/.agents/artifacts/*.md` | sync only when the content is reusable starter truth |
| workspace/agent rule | `AGENTS.md`, `.agents/rules/*` | `standard-template/AGENTS.md`, `standard-template/.agents/rules/*` | sync |
| harness runtime | harness-owned runtime path | matching starter harness runtime path | sync |
| harness test | harness-owned test path | matching starter harness test path | sync |
| reference artifact/template/profile | `reference/*` | `standard-template/reference/*` | sync when reusable |
| project local DB/state | `.harness/*` runtime state | none or starter placeholder only | do not sync as live state |
| generated docs/reports | `.agents/runtime/*` | generated or placeholder | do not hand-edit as truth |
| starter-only manual/onboarding | optional | `standard-template/*` | starter-owned |

### R16. Workflow State Vocabulary
The template must define stable workflow states used consistently across `CURRENT_STATE.md`, task tables, DB hot-state, generated docs, PMW, and validator output.

Required baseline states:
- `starter_pending`
- `kickoff_interview`
- `requirements_draft`
- `requirements_frozen`
- `architecture_sync`
- `implementation_plan_sync`
- `packet_draft`
- `ready_for_code`
- `in_execution`
- `review`
- `packet_exit_gate`
- `release_candidate`
- `deployed`
- `closed`
- `blocked`

### R17. Command Output Contract
Each operator command must produce:
- stable exit code
- human-readable summary
- key blocking findings
- next recommended action where applicable

`validation-report` must write:
- `.agents/artifacts/VALIDATION_REPORT.md`
- `.agents/artifacts/VALIDATION_REPORT.json`

The report must include:
- profile / active profile summary
- executed_at
- command and validator version where available
- findings
- next_action
- gate_decision

### R18. Profile Activation Contract
Active profiles must be declared in a stable artifact or stable section and cited by packets.

Minimum fields:
- Profile ID
- Activation reason
- Required evidence artifacts
- Evidence status
- Activated by
- Activated at
- Applies to packets

The implementation may use `.agents/artifacts/ACTIVE_PROFILES.md` or an equivalent stable section if the validator and manual agree on the same location.

### R19. Packet Readiness Contract
No packet may enter `Ready For Code` unless:
- product source root is declared when implementation is required
- active profile evidence is complete
- data-impact classification is not `unknown`
- legacy source intake is complete when the legacy replacement profile is active
- Django evidence is complete when the Django backoffice profile is active
- workflow/approval evidence is complete when the workflow/approval profile is active
- acceptance criteria are testable
- validator result is pass or explicitly accepted warning

## Required Deliverables
- Updated live governance docs
- Updated starter docs
- Runtime/layout changes needed to avoid product-code path conflicts
- Standalone command surface
- Validation report artifacts
- New or updated optional profiles
- Updated packet template fields and evidence rules
- Validator and test coverage
- User manual updates
- Review report closeout
- Passing root and starter verification

## Required Profiles
- Existing `PRF-01` admin grid application profile remains active as a reusable option.
- Existing `PRF-02` authoritative spreadsheet source profile remains active as a reusable option.
- Existing `PRF-03` airgapped delivery profile remains active as a reusable option.
- Add a legacy Excel/VBA-MariaDB replacement profile.
- Add a Python/Django backoffice profile.
- Add a workflow/approval application profile.

## Acceptance Criteria
- A copied starter can be used without reserving root `src/` for harness code.
- A planner can start a replacement project and know exactly which legacy Excel/VBA/MariaDB evidence is required before `Ready For Code`.
- A Django backoffice project can declare its product code root and implementation conventions without fighting the harness runtime layout.
- A workflow-heavy business app can declare state/approval/audit evidence before implementation.
- `doctor`, `status`, `next`, `explain`, and `validation-report` produce useful operator-facing output.
- Validator catches missing required evidence for task packets and active profiles.
- Validation reports are persisted as project artifacts.
- Root and `standard-template/` tests pass.
- Untouched copied starter behavior remains clear and intentional.
- The lane closes with review evidence showing no essential readiness item has been deferred.

## Explicit Non-Goals
- Do not add budget-management-specific tables, account mappings, asset categories, or corporate accounting policies to core.
- Do not add OMX integration or `.omx` state.
- Do not implement tmux/team runtime.
- Do not make PMW a write authority.
- Do not require a `backend/frontend` product layout.
