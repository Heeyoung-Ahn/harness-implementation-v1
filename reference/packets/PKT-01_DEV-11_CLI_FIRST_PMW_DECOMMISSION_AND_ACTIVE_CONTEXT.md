# PKT-01 DEV-11 CLI-First PMW Decommission And Active Context

## Status
- Packet opened on 2026-05-03 from `PLN-09`.
- Planning owner: `Planner`
- Implementation owner after approval: `Developer`
- This packet supersedes `PLN-08` and `DEV-10` as active implementation direction.
- PMW is removed completely from the active baseline. It is not retained as an optional sidecar in the core repository, default starter, or release package.
- Ready For Code approved by user on 2026-05-03. Developer implementation is active.

## Purpose
Implement the CLI-first harness rebaseline that removes PMW and all PMW-only maintenance burden from the active root/starter baseline, while preserving governance strength and reducing repeated harness alignment time and token cost.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | DEV-11 CLI-first PMW decommission and active context | `PLN-09` approved the direction to remove PMW completely and split AI/human SSOT | draft |
| Ready For Code | approve | implementation changes runtime, tests, manuals, packaging, validator, and starter payload | approved |
| Human sync needed | yes | user approved the concrete removal packet before code changes | approved |
| Gate profile | release | installable payload, release baseline, root/starter sync, and manuals change | approved |
| User-facing impact | high | operators stop using PMW and resume with CLI/context artifacts | approved-direction |
| Layer classification | core | changes the reusable default harness for all future projects | approved |
| Active profile dependencies | none | PMW removal is core harness work | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| UX archetype status | approved | no browser UI remains in the core baseline; terminal/Markdown surface is accepted | approved |
| UX deviation status | none | PMW UI is removed, not redesigned | not-needed |
| Environment topology status | approved | local root and copied starter must validate without PMW | approved |
| Domain foundation status | approved | no product domain data change; no domain artifact required for this core harness packet | approved |
| Authoritative source intake status | approved | user direction, `PLN-09`, and `평가.MD` are incorporated | approved |
| Shared-source wave status | approved | `PLN-08` / `DEV-10` are superseded; closed PMW packets remain history | approved |
| Packet exit gate status | pending | implementation and verification in progress | pending |
| Improvement promotion status | proposed | promote CLI-first active context and PMW-decommission lessons to preventive memory after closeout | proposed |
| Existing system dependency | none | no external product integration | not-needed |
| New authoritative source impact | analyzed | PMW-specific evaluation fixes are superseded by removal; active-task parity and command contract remain accepted | approved |
| Risk if started now | medium | implementation is broad but packet boundaries are explicit | accepted |

## 1. Goal
- Remove PMW completely from active root and `standard-template` baseline.
- Remove PMW-only documents, generated surfaces, scripts, package hooks, registry entries, validation obligations, workflow steps, and closeout requirements.
- Replace PMW read-model / project-manifest re-entry with CLI-first active context.
- Add `harness:context` and `.agents/runtime/ACTIVE_CONTEXT.json` / `.agents/runtime/ACTIVE_CONTEXT.md`.
- Split remaining truth surfaces into AI-facing SSOT and human-facing SSOT.
- Preserve packet-before-code, human approval, workflow role separation, Tester/Reviewer separation, DB/generated-doc consistency, validation, handoff evidence, and root/starter sync.

## 2. Non-Goal
- Do not remove governance Markdown truth.
- Do not remove `.harness/operating_state.sqlite`.
- Do not manually edit generated docs; regenerate them through the harness path.
- Do not keep PMW as a sidecar inside the core repo, starter, release package, or active workflow.
- Do not implement a replacement browser app.
- Do not implement security scan automation, agent eval/trace, CI/PR automation, or semantic evidence validation in this packet unless needed to keep PMW removal safe.
- Do not delete historical PMW packets or closed review evidence.

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  PMW를 맞추기 위한 export, read model, manifest, app test, registry, packaging, manual, closeout 절차가 실제 개발보다 많은 시간과 토큰을 쓰게 만든다. PMW는 접근 불가 세션 내용을 복원하지 못했고, 오히려 stale/current-task mismatch 위험을 키웠다.
- 작업 후 사용자가 체감해야 하는 변화:
  새 세션은 PMW를 열거나 맞추지 않고 `harness:context`, `harness:status`, `harness:next`, `harness:explain`, `harness:doctor`, `harness:handoff`, `harness:transition`, `harness:validation-report`와 `ACTIVE_CONTEXT.*`만으로 현재 작업과 다음 작업을 빠르게 복원한다.

## 4. In Scope
- Supersede active `PLN-08` / `DEV-10` PMW implementation path.
- Update canonical root docs:
  - `.agents/artifacts/REQUIREMENTS.md`
  - `.agents/artifacts/ARCHITECTURE_GUIDE.md`
  - `.agents/artifacts/IMPLEMENTATION_PLAN.md`
  - `.agents/artifacts/CURRENT_STATE.md`
  - `.agents/artifacts/TASK_LIST.md`
  - `.agents/artifacts/PROJECT_PROGRESS.md`
  - `.agents/artifacts/PREVENTIVE_MEMORY.md`
- Update workflow guidance and packet template references that still require PMW export, PMW read-model freshness, PMW app testing, PMW Artifact Library, PMW registry, or PMW manuals as active obligations.
- Add AI-facing SSOT contract:
  compact JSON/DB/validation state, stable schema, source trace, deterministic command output, low token cost.
- Add human-facing SSOT contract:
  Korean-first Markdown, easy operational terms, explicit current work, explicit decisions, explicit blockers, explicit next work.
- Implement `harness:context`.
- Generate or update `.agents/runtime/ACTIVE_CONTEXT.json`.
- Generate or update Korean `.agents/runtime/ACTIVE_CONTEXT.md`.
- Update transition/apply flow so active context, validation report, generated docs, canonical docs, DB state, and handoff evidence stay aligned without PMW export.
- Update `harness:status`, `harness:next`, `harness:explain`, `harness:doctor`, `harness:handoff`, and `harness:validation-report` if they still depend on PMW artifacts or stale PMW command contracts.
- Remove or reject active support for:
  - `pmw-app/`
  - root and starter PMW app tests
  - `harness:pmw-export`
  - `harness:project-manifest` if it only exists for PMW
  - `.agents/runtime/project-manifest.json`
  - `.agents/runtime/pmw-read-model.json`
  - `.harness/runtime/state/project-manifest.js`
  - `.harness/runtime/state/context-restoration-read-model.js` if it is only PMW read-model support
  - `.harness/test/pmw-read-surface.test.js`
  - PMW-specific sections in context-restoration tests
  - `PMW_MANUAL.md`
  - PMW install/start scripts
  - PMW registry integration
  - PMW release packaging hooks
  - `PMW_OUTPUT_DIR`
- Update `standard-template/` with the same runtime, test, script, docs, workflow, and package changes.
- Update release-baseline constants and validator checks so PMW files are not required.
- Update packaging, installer, README, manuals, and release smoke expectations to ship a PMW-free harness.
- Preserve historical PMW packet evidence as history only.

## 5. Out Of Scope
- Removing closed PMW history from `PROJECT_PROGRESS.md`.
- Rewriting all historical packet prose to pretend PMW never existed.
- Replacing PMW with another GUI.
- Changing Node 24 runtime policy.
- Changing DB schema unless active-context persistence cannot be implemented safely without it.
- Broad refactors unrelated to PMW removal or active-context parity.

## 6. Detailed Behavior
- Trigger:
  User approves this packet as Ready For Code.
- Main flow:
  Developer audits current PMW-related dirty changes, classifies them as historical/drop/adapt, updates core docs, implements active context, removes PMW runtime/package/manual obligations, syncs `standard-template`, regenerates derived outputs through harness commands, and hands off to Tester.
- Alternate flow:
  If a PMW dependency is discovered that is needed for non-PMW governance, Developer must preserve the underlying governance behavior under a neutral CLI/context name and document the mapping.
- Empty state:
  `harness:context` must return no active task, no blockers, latest validation/generated-doc status, and next setup action for a fresh starter.
- Error state:
  Validator must fail when active task/current work differs across DB, `CURRENT_STATE.md`, `TASK_LIST.md`, latest handoff, validation report, generated state docs, or `ACTIVE_CONTEXT.json`.
- Loading/transition:
  `harness:transition --apply` remains preview-first and updates active context without PMW export.

## 7. Program Function Detail
- 입력:
  Governance Markdown, `.harness/operating_state.sqlite`, generated state docs, validation report, latest handoff, active packet metadata, package scripts, release-baseline metadata, starter payload.
- 처리:
  Build active-context state from canonical docs and DB, validate parity, write JSON and Korean Markdown context, remove PMW artifacts from runtime/package/manual paths, and update validator rules.
- 출력:
  `harness:context`, `.agents/runtime/ACTIVE_CONTEXT.json`, `.agents/runtime/ACTIVE_CONTEXT.md`, PMW-free package scripts, PMW-free validation report, PMW-free release/starter payload.
- 권한/조건:
  CLI commands may report or update only through approved harness command paths. PMW is not authority, package, read surface, or validation dependency.
- edge case:
  existing generated PMW files, stale PMW references in manuals, dirty PMW changes from superseded `DEV-10`, starter sync drift, release-baseline checks that still require PMW, downstream projects that previously copied PMW.

## 8. UI/UX Detailed Design
- Active profile references: not-needed
- Profile composition rationale: not-needed
- Profile-specific UX / operation contract: not-needed
- Primary admin entity / surface: terminal CLI and active-context artifacts
- Grid interaction model: not-needed
- Search / filter / sort / pagination behavior: not-needed
- Row action / bulk action rule: not-needed
- Edit / save / confirm / audit pattern: existing CLI preview/apply and confirmation boundaries
- Profile deviation / exception: not-needed
- UX archetype reference: not-needed
- Selected UX archetype: not-needed
- Archetype fit rationale: no product UI; PMW browser UI is removed
- Archetype deviation / approval: not-needed
- 영향받는 화면:
  PMW browser surface is removed from active baseline; terminal output and Markdown context become the user-facing surface.
- 레이아웃 변경:
  none for a browser UI.
- interaction:
  Operator runs CLI commands and reads Korean human-facing Markdown for re-entry.
- copy/text:
  Human-facing docs and `ACTIVE_CONTEXT.md` must use Korean and easy operational terms. AI-facing JSON and validation outputs must be compact and structured.
- feedback/timing:
  `harness:context` should be fast and should not require broad Markdown rereads unless parity/freshness fails.
- source trace fallback:
  active context must include source paths for current state, task list, active packet, latest handoff, validation report, and generated docs status.

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale: PMW removal changes the reusable harness default and starter payload.
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`, `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/planning/PLN-09_CLI_FIRST_REBASELINE_AND_PMW_DECOMMISSION_DRAFT.md`, this packet, `C:\Users\ahyne\OneDrive\바탕 화면\평가.MD`, `reference/packets/PKT-01_OPS-03_HARNESS_OPERATION_FRICTION_REDUCTION.md`, `reference/planning/PLN-08_PMW_V1_3_PHASE_2_COMMAND_SURFACE_DRAFT.md`, `reference/packets/PKT-01_DEV-10_PMW_PHASE_2_DOCTOR_PROMOTION_AND_USABILITY_REMEDIATION.md`.
- Environment topology reference: this packet defines local root plus copied `standard-template` verification without PMW.
- Source environment: maintainer repository.
- Target environment: PMW-free root and PMW-free copied starter.
- Execution target: local Windows developer/operator machine.
- Transfer boundary: release package and copied starter must not include PMW runtime, registry, manuals, or installer hooks.
- Rollback boundary: revert this packet's implementation changes from git if PMW-free baseline is rejected during review.
- Domain foundation reference: not-needed
- Schema impact classification: no DB schema change expected; use existing tables unless active-context persistence proves otherwise.
- DB / state 영향:
  Work item, release state, generation state, artifact index, validation report, and handoff evidence must stop treating PMW as active baseline.
- Markdown / docs 영향:
  Core docs, workflows, packet template, manuals, README, release docs, starter docs, and preventive memory must remove PMW as an active operating procedure. Human-facing docs should be Korean-first where they are current operator guidance.
- generated docs 영향:
  Regenerate through harness after canonical state changes. Do not edit generated docs manually.
- validator / cutover 영향:
  Remove PMW export/file requirements. Add active-context parity/freshness checks and release-baseline checks for PMW-free payload.
- Authoritative source refs:
  User PMW removal direction, `PLN-09`, this packet, `평가.MD`, current canonical SSOT, superseded PMW packets.
- Authoritative source intake reference: `reference/planning/PLN-09_CLI_FIRST_REBASELINE_AND_PMW_DECOMMISSION_DRAFT.md`; `C:\Users\ahyne\OneDrive\바탕 화면\평가.MD`; this packet.
- Authoritative source disposition: Accept complete PMW removal; accept AI/human SSOT split; accept active-task parity validation; accept strict CLI command contract; supersede PMW-specific remediation items; defer security/eval/CI hardening.
- New planning source priority / disposition:
  User's 2026-05-03 direction supersedes approved `PLN-08` / `DEV-10`.
- Existing plan conflict: Direct conflict with PMW app, PMW read-model, PMW command catalog, PMW Artifact Library, PMW export, PMW registry, and release PMW packaging.
- Current implementation impact: Developer must inspect dirty PMW-related work and avoid carrying superseded PMW extension code into the new baseline.
- Required rework / defer rationale:
  PMW UX and command-promotion work is dropped because the surface is removed. Security/eval/CI recommendations are separate follow-up work.
- Impacted packet set scope: multi-packet
- Authoritative source wave ledger reference: reference/artifacts/PMW_REMOVAL_SOURCE_WAVE_LEDGER.md
- Source wave packet disposition: continue
- Existing program / DB dependency: none
- Existing schema source artifact: not-needed
- Product source root:
  `.harness/runtime/`, `.harness/test/`, `.agents/scripts/`, `.agents/artifacts/`, `installer/`, `packaging/`, `standard-template/`, root/starter manuals.
- Product test root:
  `.harness/test/`, `standard-template/.harness/test/`, installer/packaging smoke tests if present.
- Product runtime requirements:
  Node 24+ unchanged.
- Harness/product boundary exceptions:
  none.
- Runtime / framework:
  Node.js CLI harness runtime.
- Rendering / app mode:
  no browser app in core baseline.
- Data persistence boundary:
  SQLite DB, generated docs, validation report, active-context artifacts, handoff log.
- Auth / user identity requirement:
  unchanged.
- Deployment target:
  installable standard harness without PMW.
- External API / integration boundary:
  none.
- Lightweight acceptance:
  copied starter initializes, reports context, validates, and hands off without PMW files or PMW registry.
- Node.js product runtime policy:
  Node 24+ remains required.
- Package manager:
  npm
- Framework / bundler:
  no PMW app bundling in core.
- Build command:
  existing package/build commands updated to exclude PMW where applicable.
- Test command:
  root `npm.cmd test`, starter `npm.cmd test`, validator, validation report, context command, clean starter smoke.
- Environment variable policy:
  remove `PMW_OUTPUT_DIR`; avoid output-root overrides that can redirect context readers away from repo root.
- API / backend boundary:
  none.
- Static asset / routing policy:
  remove PMW static/browser assumptions from core baseline.

## 10. Acceptance
- `PLN-08` and `DEV-10` are marked superseded and are not active implementation paths.
- PMW is absent from active root/starter package scripts, runtime requirements, release packaging, installer guidance, manuals, and validation obligations.
- `pmw-app/` and PMW-specific tests/scripts/manuals are removed from active payload or explicitly quarantined as historical-only.
- `harness:pmw-export` is removed or returns a clear unsupported/removed message and is not required by closeout.
- `harness:project-manifest` is removed if PMW-only, or renamed/refactored if it serves non-PMW active context.
- `.agents/runtime/pmw-read-model.json` and `.agents/runtime/project-manifest.json` are not produced by clean starter initialization.
- `harness:context` exists and prints concise current work, next work, blockers, required reads, latest handoff, validation status, and source traces.
- `.agents/runtime/ACTIVE_CONTEXT.json` exists as AI-facing compact deterministic state.
- `.agents/runtime/ACTIVE_CONTEXT.md` exists as human-facing Korean easy-term state.
- Validator fails if active task/current work mismatches across DB, `CURRENT_STATE.md`, `TASK_LIST.md`, latest handoff, validation report, generated state docs, or active context.
- `harness:transition --apply` updates active context and validation report without PMW export.
- Root and `standard-template` remain synchronized for all PMW removal and active-context changes.
- Clean copied starter can run context/status/next/explain/doctor/handoff/validation-report without PMW setup.
- Release-baseline validator no longer requires PMW app, PMW manual, PMW registry, or PMW package hooks.
- Human-facing current operator docs are Korean-first and use easy operational terms.
- AI-facing state artifacts are structured, compact, source-traced, and deterministic.
- Historical PMW packets remain available as history but are not treated as active baseline.

## 11. Open Questions
- None for approved implementation scope.

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | yes | user/planner | approved | core baseline change |
| Optional profile evidence approval | no | planner | not-needed | no active optional profile |
| Detailed function agreement | yes | user/planner | approved | concrete DEV-11 implementation boundary approved on 2026-05-03 |
| Detailed UI/UX agreement | no | planner | not-needed | PMW UI is removed; terminal/Markdown text rules are defined |
| Environment topology approval | yes | user/planner | approved | local root plus copied starter without PMW |
| Domain foundation approval | no | planner | not-needed | no product domain data change |
| Authoritative source disposition approval | yes | user/planner | approved-direction | PMW removal and AI/human SSOT split accepted |
| Source wave rebaseline approval | yes | user/planner | approved-direction | `PLN-08` / `DEV-10` superseded |
| Packet exit quality gate approval | yes | reviewer | pending | closeout after implementation and verification |
| Improvement promotion decision | yes | planner/reviewer | pending | promote lessons after closeout only |
| Ready For Code sign-off | yes | user | approved | user approved DEV-11 scope and requested implementation, tests, and review |

## 13. Implementation Notes
- Start with a PMW reference audit across root and `standard-template`; classify each hit as remove, historical-only, or rename/refactor.
- Prefer deleting PMW-only surfaces instead of preserving compatibility shims.
- If a command name remains for compatibility, it must clearly report that PMW was removed and must not participate in validation or closeout.
- Keep generated docs immutable; update canonical sources and regenerate.
- Avoid DB schema changes unless implementation proves active-context persistence cannot be done from existing state.
- Preserve user/unrelated dirty changes. Do not revert unrelated worktree changes.
- Root and starter changes must be made in the same implementation lane.
- Human-facing docs introduced or materially updated by this packet should be Korean-first where they describe current operation.

## 14. Verification Plan
- Gate profile: release
- Verification manifest:
  - targeted active-context tests
  - targeted active-task parity validator tests
  - targeted transition tests without PMW export
  - targeted package-script tests for removed PMW commands/hooks
  - root `npm.cmd test`
  - `standard-template` `npm.cmd test`
  - root `npm.cmd run harness:validate`
  - root `npm.cmd run harness:validation-report`
  - `npm.cmd run harness:context`
  - `npm.cmd run harness:status`
  - `npm.cmd run harness:next`
  - `npm.cmd run harness:explain`
  - `npm.cmd run harness:doctor`
  - `npm.cmd run harness:handoff`
  - clean copied-starter smoke without PMW files
  - release/installer smoke without PMW registry or PMW manual requirements
- Removed verification:
  PMW app tests and PMW export are not closeout evidence after this packet.

## Verification Manifest
- release-baseline parity: root and `standard-template` must agree on PMW-free release markers, package scripts, manuals, and validator expectations.
- packaging/manual evidence: installer, packaging, README, and manuals must not require PMW app, PMW registry, PMW export, PMW manual, or PMW start scripts.
- validator: root validator must pass with no findings.
- generated docs: generated state docs must be refreshed through the harness path after DB/canonical state changes.
- validation report: root validation report must pass and point next action at DEV-11, not DEV-10.
- root tests: root `npm.cmd test` must pass after implementation.
- starter tests: `standard-template` `npm.cmd test` must pass after synchronized implementation.
- active context evidence: `harness:context`, `ACTIVE_CONTEXT.json`, and Korean `ACTIVE_CONTEXT.md` must exist and match current task/next action state.
- CLI smoke: `harness:status`, `harness:next`, `harness:explain`, `harness:doctor`, `harness:handoff`, and `harness:validation-report` must work without PMW export.
- clean starter smoke: copied starter must initialize, validate, and report context without PMW files.
- removed evidence: PMW app tests and PMW export are explicitly not required after decommission.
- review closeout: Reviewer must approve packet exit after source parity, residual PMW reference audit, validation evidence, and deferred-follow-up disposition are complete.

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: pending
- Implementation delta summary: pending
- Source parity result: pending
- Refactor / residual debt disposition: pending
- UX conformance result: not-needed after PMW removal
- Topology / schema conformance result: pending release/root/starter verification
- Validation / security / cleanup evidence: pending
- Deferred follow-up item:
  Security automation, agent eval/trace, semantic evidence validation, CI/PR integration, and release artifact audit hardening remain follow-up lanes unless user expands scope.
- Improvement candidate reference:
  `OPS-STATE-SYNC-001` extension candidate for CLI-first active context and PMW removal.
- Proposed target layer: core
- Promotion status / linked follow-up item: pending
- Closeout notes: pending

## 16. Reopen Trigger
- User decides to restore PMW to the core baseline.
- User requests PMW as an optional sidecar in the same repository/starter/release lane.
- Active-context replacement cannot satisfy session re-entry without a browser surface.
- Removing PMW breaks installer or release packaging in a way that requires separate release design.
- Active-task parity requires DB schema changes not covered here.
- Security/eval/CI scope is promoted into this packet by user decision.
- A downstream project has a hard PMW dependency that must be preserved before release.
