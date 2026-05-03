# PLN-09 CLI-First Harness Rebaseline And PMW Decommission Draft

## Status
- Draft opened on 2026-05-03 after the user directed Planner to remove PMW if it is a major source of harness alignment overhead.
- Planning owner: `Planner`
- This draft supersedes the active `PLN-08` / `DEV-10` PMW phase-2 direction before implementation starts.
- `PKT-01_DEV-10_PMW_PHASE_2_DOCTOR_PROMOTION_AND_USABILITY_REMEDIATION.md` remains historical planning evidence only unless the user explicitly opens a new PMW revival lane.
- User decision on 2026-05-03: PMW is fully removed, not retained as an optional sidecar.
- PMW-supporting documents, generated surfaces, scripts, and procedures must be removed when they exist only to maintain PMW.
- Remaining SSOT is split by audience: AI-facing SSOT prioritizes compact deterministic machine use; human-facing SSOT prioritizes Korean, easy terms, and operational readability.
- Concrete implementation packet: `reference/packets/PKT-01_DEV-11_CLI_FIRST_PMW_DECOMMISSION_AND_ACTIVE_CONTEXT.md`.
- Ready For Code is not approved for implementation. `DEV-11` must be reviewed and approved before Developer starts removal work.

## Purpose
Rebaseline the standard harness from a PMW-centered operator-console model to a CLI-first operating model that keeps governance strength while reducing repeated alignment time, token cost, generated-surface drift, and session-loss confusion.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | PLN-09 CLI-first rebaseline and PMW decommission | PMW has become a major coordination surface without solving session recovery or reducing alignment overhead | packet-drafted |
| Ready For Code | hold | removal affects requirements, architecture, starter payload, packaging, validator, manuals, and release baseline | draft |
| Human sync needed | yes | this reverses the approved V1.3 PMW direction and changes the reusable baseline | approved-direction |
| Gate profile | release | installable payload, manuals, packaging, root/starter runtime, tests, and release-baseline contracts change | draft |
| User-facing impact | high | operators stop using PMW and use CLI/status artifacts instead | draft |
| Layer classification | core | this changes the default reusable harness for all future projects | draft |
| Active profile dependencies | none | PMW removal is core harness work, not profile-specific work | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| UX archetype status | not-needed | no app UI remains in scope after PMW removal | not-needed |
| UX deviation status | none | PMW UI work is removed instead of redesigned | not-needed |
| Environment topology status | pending | install/release verification must be redefined without PMW registry or PMW app setup | draft |
| Domain foundation status | not-needed | no product domain data change | not-needed |
| Authoritative source intake status | analyzed | user direction and `C:\Users\ahyne\OneDrive\바탕 화면\평가.MD` are incorporated as source inputs | approved-direction |
| Shared-source wave status | pending | this supersedes `PLN-08` and `DEV-10` and affects closed PMW evidence as historical-only | draft |
| Packet exit gate status | pending | DEV-11 packet drafted; implementation not started | draft |
| Improvement promotion status | proposed | extend `OPS-STATE-SYNC-001` with CLI-first context and PMW decommission lessons | draft |
| Existing system dependency | none | no external product integration | not-needed |
| New authoritative source impact | analyzed | evaluation feedback is partly accepted, partly superseded by PMW removal, and extended by the AI/human SSOT split | approved-direction |
| Risk if started now | high | current SSOT still defines PMW as baseline, and removal needs staged acceptance | draft |

## 1. Goal
- Remove PMW completely from the active baseline.
- Remove PMW-only documentation, generated surfaces, scripts, validation obligations, and workflow procedures.
- Replace PMW's current/next-work visibility with a CLI-first context surface.
- Reduce required alignment work by removing PMW export, PMW read-model freshness, PMW app tests, PMW registry, and PMW-specific packaging/manual obligations from normal closeout.
- Split the remaining truth surfaces into AI-facing SSOT and human-facing SSOT.
- Preserve the governance guarantees that still matter: packet-before-code, human approval, SSOT/DB/generated-doc consistency, workflow role separation, handoff evidence, validator enforcement, and root/starter sync.

## 2. Non-Goal
- Do not remove governance Markdown truth.
- Do not remove `.harness/operating_state.sqlite`.
- Do not remove generated state docs if they still serve deterministic context and validation.
- Do not weaken packet-before-code, Tester/Reviewer separation, human approval gates, or root/starter sync.
- Do not redesign PMW or add persistent PMW session history.
- Do not keep PMW as an optional sidecar in the core repository or default starter.
- Do not preserve PMW manuals, PMW registry records, PMW export steps, or PMW read-model maintenance as active procedures.
- Do not fold security automation, agent evals, CI hardening, or semantic evidence validation into the PMW removal implementation packet unless required to keep removal safe.

## 3. User Problem And Expected Outcome
- Current problem:
  PMW is coupled into planning, export, validation, packaging, starter sync, and closeout evidence, but it does not preserve inaccessible session content and has repeatedly created stale or incorrect operator context. The user sees more time and tokens spent aligning harness surfaces than doing project work.
- Expected outcome:
  Operators and agents use `harness:status`, `harness:next`, `harness:explain`, `harness:doctor`, `harness:handoff`, `harness:transition`, `harness:validation-report`, and one compact active-context artifact to resume work quickly without PMW setup, PMW export, PMW registry, PMW app testing, or PMW read-model drift.

## 3A. SSOT Audience Split
- AI-facing SSOT:
  Compact, deterministic, source-traced state for agents and harness commands. Preferred shape is JSON, SQLite state, command contracts, validation JSON, active packet metadata, and generated artifacts that can be parsed without broad Markdown rereads.
- AI-facing principle:
  Minimize token cost and ambiguity. Every field should have a stable source, predictable schema, and validation path.
- Human-facing SSOT:
  Korean-first Markdown for operators and maintainers. Preferred shape is governance docs, current-state summaries, task lists, implementation plans, packet summaries, manuals, and validation Markdown.
- Human-facing principle:
  Use easy Korean terms, short explanations, explicit current work, explicit next work, and avoid PMW/internal read-model jargon unless describing historical removal.
- Boundary:
  Human-facing SSOT explains decisions and operating intent. AI-facing SSOT carries compact executable state. Neither side depends on PMW to be authoritative.

## 4. In Scope
- Supersede `PLN-08` and `DEV-10` as PMW-extension work.
- Fully remove PMW from the active root/starter baseline.
- Remove PMW-only work procedures from workflows, manuals, packet templates, validation guidance, release packaging, starter sync, and closeout checklists.
- Define AI-facing SSOT and human-facing SSOT responsibilities explicitly in requirements and architecture.
- Rebaseline SSOT wording in:
  - `.agents/artifacts/REQUIREMENTS.md`
  - `.agents/artifacts/ARCHITECTURE_GUIDE.md`
  - `.agents/artifacts/IMPLEMENTATION_PLAN.md`
  - `.agents/artifacts/CURRENT_STATE.md`
  - `.agents/artifacts/TASK_LIST.md`
  - `.agents/artifacts/PREVENTIVE_MEMORY.md`
- Replace PMW first-view requirements with CLI-first current-context requirements.
- Define `harness:context` and `.agents/runtime/ACTIVE_CONTEXT.json` / `.agents/runtime/ACTIVE_CONTEXT.md` as the operator/agent re-entry surface.
- Remove PMW export and PMW read-model obligations from transition closeout and validation evidence.
- Remove or quarantine:
  - `pmw-app/`
  - `harness:pmw-export`
  - `harness:project-manifest` if it only exists for PMW
  - `.agents/runtime/project-manifest.json`
  - `.agents/runtime/pmw-read-model.json`
  - `.harness/runtime/state/project-manifest.js`
  - `.harness/runtime/state/context-restoration-read-model.js`
  - `.harness/test/pmw-read-surface.test.js`
  - PMW-specific sections in `context-restoration-read-model.test.js`
  - PMW app tests and PMW install/start scripts
  - `PMW_MANUAL.md` files
  - PMW registry integration in installer/package docs
- Update `standard-template/` in the same lane for every reusable runtime, test, manual, workflow, and package-script change.
- Update release-baseline constants and release-baseline validator requirements that currently require PMW files.
- Update package, installer, packaging, README, manual, and workflow references that currently treat PMW as mandatory.
- Define clean install acceptance without PMW registry or PMW executable.

## 5. Out Of Scope
- Deleting historical PMW packets or historical review evidence.
- Removing closed PMW history from `PROJECT_PROGRESS.md`; history should remain accurate but no longer drive the active baseline.
- Implementing security scan automation in the same packet.
- Implementing agent eval/trace infrastructure in the same packet.
- Implementing CI/PR automation in the same packet.
- Replacing PMW with a new browser app.
- Keeping PMW as an optional sidecar in the core repository, default starter, or release package.

## 6. Detailed Behavior
- Trigger:
  User or Planner opens the CLI-first rebaseline after deciding PMW is fully removable.
- Main flow:
  Planner finalizes this draft, user approves the new direction, Developer implements a CLI-first baseline, Tester verifies root/starter/release behavior, Reviewer checks source parity and residual PMW references before closeout.
- Alternate flow:
  If a future PMW-like tool is requested, it must be opened as a separate project or optional package lane after this decommission. PMW residue must not remain in the core closeout path.
- Empty state:
  A fresh starter without active work must show `harness:context` output with no active task, no blockers, latest generated-doc status, and next setup action.
- Error state:
  If SSOT, DB, generated docs, validation report, or handoff disagree on current task, validator must fail with active-context parity findings.
- Loading/transition:
  `harness:transition --apply` continues to be preview-first and updates DB, canonical docs, generated docs, active context, validation report, and handoff evidence together.

## 7. Program Function Detail
- Input:
  Governance Markdown, `.harness/operating_state.sqlite`, generated state docs, validation report, latest handoff, active packet metadata, package scripts, release-baseline metadata, starter payload.
- Processing:
  Build a compact active-context artifact from canonical state and DB, validate parity, update transition and validation paths to exclude PMW export, and remove PMW-specific file/package/manual obligations.
- Output:
  CLI-first commands, `.agents/runtime/ACTIVE_CONTEXT.json`, Korean `.agents/runtime/ACTIVE_CONTEXT.md`, updated validation report, updated generated docs, updated starter payload, and PMW-free release packaging/manuals.
- Authority / conditions:
  CLI commands may report or update only through existing approved harness command paths. PMW is not a required authority, read surface, package, or validation dependency.
- Edge cases:
  dirty worktree with historical PMW changes, existing generated PMW files, stale PMW references in release-baseline validator, starter sync drift, installer scripts that register PMW, manuals that still instruct PMW export, downstream projects already using PMW.

## 8. UI/UX Detailed Design
- Active profile references: not-needed
- Profile composition rationale: not-needed
- Profile-specific UX / operation contract: not-needed
- Primary admin entity / surface: terminal CLI and active-context artifact
- Grid interaction model: not-needed
- Search / filter / sort / pagination behavior: not-needed
- Row action / bulk action rule: not-needed
- Edit / save / confirm / audit pattern: existing CLI confirmation and transition preview/apply model
- Profile deviation / exception: not-needed
- UX archetype reference: not-needed for this decommission packet
- Selected UX archetype: not-needed
- Archetype fit rationale: PMW UI is removed from the core baseline
- Archetype deviation / approval: not-needed
- Affected surfaces:
  `npm run harness:status`, `harness:next`, `harness:explain`, `harness:doctor`, `harness:handoff`, `harness:transition`, `harness:validation-report`, new `harness:context`, manuals, README, installer output.
- Layout changes:
  none; no browser UI remains in core scope.
- Interaction:
  operator runs CLI commands and reads `ACTIVE_CONTEXT` for re-entry.
- Copy/text:
  replace PMW instructions with CLI-first operating instructions. Human-facing text must be Korean-first and use easy operational terms. AI-facing artifacts must be compact, structured, and source-traced.
- Feedback/timing:
  `harness:context` must return concise output quickly and avoid forcing broad SSOT rereads unless freshness/parity fails.
- Source trace fallback:
  active-context output must include source paths for current state, task list, active packet, latest handoff, and validation report.

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale: PMW is being removed from the reusable core baseline; any future PMW-like tool would be a separate project or separately approved package, not retained residue in this core/starter baseline.
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code:
  `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`, `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, this draft, `C:\Users\ahyne\OneDrive\바탕 화면\평가.MD`, `reference/packets/PKT-01_OPS-03_HARNESS_OPERATION_FRICTION_REDUCTION.md`, `reference/planning/PLN-08_PMW_V1_3_PHASE_2_COMMAND_SURFACE_DRAFT.md`, `reference/packets/PKT-01_DEV-10_PMW_PHASE_2_DOCTOR_PROMOTION_AND_USABILITY_REMEDIATION.md`.
- Environment topology reference: pending; release/installer packet must define clean install target without PMW.
- Source environment: maintainer repo and copied starter.
- Target environment: PMW-free standard harness root and starter.
- Execution target: local Windows developer/operator machine plus clean install verification target.
- Transfer boundary: release package generation without PMW installer.
- Rollback boundary: restore PMW baseline from git if user rejects decommission after implementation.
- Domain foundation reference: not-needed
- Schema impact classification: possible DB metadata only; avoid schema change unless active-context persistence proves necessary.
- DB / state impact:
  Existing tables remain. Work item, release state, generation state, and handoff evidence must stop referring to PMW as active baseline.
- Markdown / docs impact:
  Core SSOT, manuals, README, workflow guidance, packet templates, release-baseline docs, and starter docs need PMW wording removal or historical reclassification.
- generated docs impact:
  Generated state docs remain derived. They should reflect CLI-first baseline after regeneration.
- validator / cutover impact:
  Remove PMW export requirement, add active-context freshness/parity, update release-baseline drift checks, update required package scripts.
- Authoritative source refs:
  user instruction in this turn, `C:\Users\ahyne\OneDrive\바탕 화면\평가.MD`, current SSOT and PMW packets.
- Authoritative source intake reference:
  this draft section acts as intake until a separate source-intake artifact is needed.
- Authoritative source disposition:
  accept PMW overhead and active-task correctness concerns; accept complete PMW removal and AI/human SSOT split; supersede PMW-specific remediation suggestions by removing PMW from core; defer security/eval/CI recommendations to follow-up lanes.
- New planning source priority / disposition:
  user instruction supersedes approved `PLN-08` / `DEV-10` PMW extension direction.
- Existing plan conflict:
  direct conflict with PMW as separate installable app, PMW read-only surface, PMW command catalog, PMW Artifact Library, PMW export evidence, PMW registry, and release-baseline PMW packaging.
- Current implementation impact:
  Dirty worktree already contains PMW-related changes and `DEV-10` packet evidence; Developer must audit and classify them as historical, discard, or adapt to CLI context.
- Required rework / defer rationale:
  PMW UX fixes and command promotion are dropped from active implementation because the PMW surface is no longer core.
- Impacted packet set scope:
  `PLN-08` and `DEV-10` superseded; `DEV-07`, `DEV-08`, `DEV-09`, and `OPS-03` remain closed historical evidence; follow-up packets needed for decommission implementation and release rebaseline.
- Authoritative source wave ledger reference:
  pending; this user direction affects multiple open/current planning artifacts and should be recorded before Ready For Code.
- Source wave packet disposition:
  supersede `PLN-08` / `DEV-10`; preserve closed packets as history.
- Existing program / DB dependency: none
- Product source root:
  `.harness/runtime/`, `.harness/test/`, `.agents/scripts/`, `installer/`, `packaging/`, `standard-template/`, root/starter manuals.
- Product test root:
  `.harness/test/`, `standard-template/.harness/test/`, installer/packaging tests if present.
- Product runtime requirements:
  Node 24 baseline unchanged.
- Harness/product boundary exceptions:
  none; PMW removal should simplify the boundary.
- Runtime / framework:
  Node.js CLI harness runtime.
- Rendering / app mode:
  none in core baseline.
- Data persistence boundary:
  DB state, generated docs, validation report, active-context artifact, and handoff log.
- Auth / user identity requirement:
  unchanged.
- Deployment target:
  installable standard harness without PMW.
- External API / integration boundary:
  none.
- Lightweight acceptance:
  copied starter initializes, validates, reports context, and hands off without PMW files or PMW registry.
- Node.js product runtime policy:
  Node 24+ remains required.
- Package manager:
  npm
- Framework / bundler:
  no PMW app bundling in core.
- Build command:
  packaging command updated by release packet.
- Test command:
  root `npm.cmd test`, starter `npm.cmd test`, validator, validation report, context command, installer/release smoke.
- Environment variable policy:
  remove `PMW_OUTPUT_DIR`; avoid output-root overrides that can point generated/context readers away from repo root.
- API / backend boundary:
  none.
- Static asset / routing policy:
  remove PMW static/browser assumptions from core baseline.

## 10. Acceptance
- `PLN-08` / `DEV-10` are clearly marked superseded, not implementation-ready.
- Core SSOT describes a CLI-first baseline and no longer defines PMW as mandatory.
- `harness:context` exists and produces concise human-readable and machine-readable current context.
- `.agents/runtime/ACTIVE_CONTEXT.json` and `.agents/runtime/ACTIVE_CONTEXT.md` replace PMW read-model / project-manifest as the re-entry artifact.
- `harness:pmw-export` and `harness:project-manifest` are removed or explicitly rejected as unsupported in the new baseline.
- PMW app, PMW registry, PMW install/start scripts, and PMW manuals are removed from the core installable payload.
- PMW-only documentation and workflow procedures are removed from active root/starter operations instead of being preserved as maintenance obligations.
- Human-facing SSOT is Korean-first, uses easy terms, and clearly states current work, decisions, blockers, and next work without requiring PMW.
- AI-facing SSOT is compact, deterministic, structured, source-traced, and validated without requiring broad Markdown rereads.
- Release-baseline validator no longer requires PMW app/manual files.
- Transition apply updates active context and validation report without PMW export.
- Validator fails if active task differs across DB, `CURRENT_STATE`, `TASK_LIST`, latest handoff, and active context.
- Root and `standard-template` remain synchronized after PMW removal.
- Clean starter initialization does not produce PMW manifest/read-model files.
- Clean install smoke uses CLI commands only.
- Historical PMW packets remain available as closed evidence but are not part of active baseline acceptance.

## 11. Evaluation Feedback Disposition
- Accept into this packet:
  active task parity must become validator-enforced because the evaluation identified current-task misrouting as a severe operational risk.
- Accept into this packet:
  command contract validation must be strict for CLI commands, including `harness:handoff` and clear classification of `harness:transition` as internal/admin state-transition tooling.
- Accept into this packet:
  installer/packaging E2E must be redefined and later verified without PMW.
- Accept into this packet:
  human-facing SSOT and AI-facing SSOT must be explicitly separated by audience and efficiency/readability principles.
- Supersede by decommission:
  PMW first-view, PMW current-task, PMW command catalog, PMW registry, PMW session result, PMW Artifact Library, and PMW app test recommendations.
- Defer to follow-up:
  security automation, agent eval/trace, semantic evidence validation, CI/PR integration, and release artifact audit hardening.

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| PMW full decommission | yes | user/planner | approved-direction | user approved complete PMW removal, not optional sidecar retention |
| CLI-first replacement surface | yes | user/planner | pending | approve `harness:context` and `ACTIVE_CONTEXT.*` as replacement |
| `PLN-08` / `DEV-10` supersession | yes | user/planner | pending | confirm PMW doctor-promotion packet is canceled |
| Release-baseline change | yes | user/planner | pending | PMW removal affects installable payload and manuals |
| Optional PMW sidecar future | no | user/planner | rejected | user chose complete PMW removal; future PMW-like tooling requires a separate project/lane |
| AI/human SSOT split | yes | user/planner | approved-direction | AI SSOT optimizes compact deterministic machine use; human SSOT optimizes Korean readability and easy terms |
| Security/eval follow-up split | yes | user/planner | pending | keep separate from decommission implementation unless user expands scope |
| Ready For Code sign-off | yes | user | pending | no Developer implementation until approved |

## 13. Recommended Implementation Slices
- Slice 0: freeze PMW extension work, mark `PLN-08` / `DEV-10` superseded, and record source-wave disposition.
- Slice 1: update SSOT to CLI-first architecture, AI/human SSOT audience split, and active-context contract.
- Slice 2: add `harness:context` and write `ACTIVE_CONTEXT.json` / `ACTIVE_CONTEXT.md`.
- Slice 3: update transition, validation-report, status/next/explain/handoff/doctor to rely on active context without PMW export.
- Slice 4: remove PMW read-model/project-manifest runtime and tests from root and starter.
- Slice 5: remove PMW app, install/start scripts, PMW registry integration, package scripts, manuals, README references, and release packaging hooks.
- Slice 6: update release-baseline validator and starter sync checks.
- Slice 7: update root/starter tests, package scripts, manuals, and clean install acceptance.
- Slice 8: run root/starter tests, validator, validation report, context command, and release/installer smoke evidence.

## 14. Verification Plan
- Gate profile: `release`
- Planning verification:
  - user approval for PMW decommission and CLI-first replacement
  - source-wave disposition for `PLN-08` / `DEV-10`
  - updated SSOT references
- Implementation verification after Ready For Code:
  - targeted active-context tests
  - targeted active-task parity validator tests
  - targeted transition tests without PMW export
  - root full tests
  - `standard-template` full tests
  - root validator
  - root validation report
  - `harness:context`, `harness:status`, `harness:next`, `harness:explain`, `harness:doctor`, `harness:handoff`
  - clean starter init smoke without PMW files
  - release packaging smoke without PMW installer/manual requirements
- Removed verification:
  PMW app tests and PMW export are no longer closeout evidence after decommission implementation.

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: pending
- Implementation delta summary: pending
- Source parity result: pending
- Refactor / residual debt disposition: pending
- UX conformance result: not-needed after PMW removal
- Topology / schema conformance result: pending release/installer rebaseline
- Validation / security / cleanup evidence: pending
- Deferred follow-up item:
  `OPS-04` or equivalent for security automation and agent eval/trace; release E2E packet if not completed inside decommission implementation.
- Improvement candidate reference:
  `OPS-STATE-SYNC-001` extension candidate for CLI-first active context and PMW removal.
- Proposed target layer: core
- Promotion status / linked follow-up item: pending
- Closeout notes: pending

## 16. Reopen Trigger
- User decides to keep PMW as core.
- User wants PMW retained as optional sidecar in the same implementation lane, which would require reopening this approved-direction decision.
- Active-context replacement cannot satisfy context restoration without a browser surface.
- Removing PMW breaks installer or release packaging in a way that requires a separate release design.
- Security/eval/CI scope is promoted into the same packet by user decision.
- A downstream project has a hard dependency on PMW that must be preserved.
