# Current State

## Snapshot
- Current Stage: planning
- Current Focus: PLN-08 planning is active; Planner is defining the V1.3 phase-2 PMW command-surface lane after OPS-03 closeout.
- Current Release Goal: preserve the V1.2 installable standard harness baseline while keeping the V1.3 PMW operator-console/workflow-contract direction intact and strengthening OPS-03 without weakening SSOT, approval, PMW read-only, Tester/Reviewer separation, or root/starter sync contracts.

## Next Recommended Agent
- Planner

## Must Read Next
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- `.agents/artifacts/TASK_LIST.md`
- `reference/planning/PLN-08_PMW_V1_3_PHASE_2_COMMAND_SURFACE_DRAFT.md`
- `reference/packets/PKT-01_OPS-03_HARNESS_OPERATION_FRICTION_REDUCTION.md`

## Open Decisions / Blockers
- No external blocker is open.
- `PLN-08` is active. Planner should close the phase-2 PMW command promotion scope and get user approval before any implementation packet opens.
- User clarification on 2026-05-03: the Karpathy-style guide should not be reduced to thin guidance. It should be sufficiently reflected while staying compatible with this harness's SSOT, approval, workflow, Tester, Reviewer, PMW read-only, and root/starter sync contracts.
- User requirement on 2026-05-03: human-and-Planner-approved project design SSOT guides all other agents. Developer implements to it, Tester verifies against it, and Reviewer checks closeout/evidence against it.
- User requirement on 2026-05-03: every agent workflow closeout report must include `Current Work` with completed work/issues/decisions and `Next Work` with next work/expected issues/expected decisions.
- User requirement on 2026-05-03: PMW Artifact Library must widen the artifact body reading area and keep whole-project design/overview artifacts, including `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, and `IMPLEMENTATION_PLAN.md`, always available in one clear category.

## Current Truth Notes
- The current reusable baseline remains `V1.2`: `standard-template/` installs a new project, PMW is shipped as a separate installable app, and release packaging is tracked under `dist/windows-exe-v1.2/`.
- `PLN-07`, `DEV-07`, `DEV-08`, and `DEV-09` remain closed. Their detailed history lives in `.agents/artifacts/PROJECT_PROGRESS.md`, `reference/artifacts/REVIEW_REPORT.md`, and their packet files.
- `OPS-03` is closed and its preventive-memory candidate can be treated as promoted baseline guidance.
- `PLN-08` remains the active work item. Current handoff is `planner -> planner`; stage is `planning`; gate profile is `contract`.
- `OPS-03` is closed. Latest handoff is `planner -> planner`; stage is `planning`; gate profile is `contract`.
- Generated state docs under `.agents/runtime/generated-state-docs/*` remain derived output and must not be edited manually.
- PMW is a read surface and never canonical write authority.

## Latest Handoff Summary
- 2026-05-03: `[planner -> planner] Opened PLN-08 planning lane to define the V1.3 phase-2 PMW command-surface scope after OPS-03 closeout.`
- 2026-05-03: `[planner -> planner] Planner recorded OPS-03 closeout after reviewer-approved exit and remediation re-verification.`
- 2026-05-03: `[reviewer -> planner] OPS-03 packet exit approved after revised-scope remediation and re-verification; Planner should record closeout and choose the next lane.`
- 2026-05-03: `[tester -> reviewer] Tester re-verified the CURRENT_STATE transition remediation; stale wording is gone, reviewer-source Ready For Code handling is preserved, and validation evidence passed.`
- 2026-05-03: `[developer -> tester] Developer remediated CURRENT_STATE transition stale wording and Ready For Code fallback handling; regression coverage and validation evidence passed.`
- 2026-05-03: `[reviewer -> developer] Reviewer found stale CURRENT_STATE transition wording after tester handoff; Developer should remediate the update path and add coverage.`
- 2026-05-03: `[tester -> reviewer] Tester verified the revised OPS-03 scope against the approved SSOT; behavior guidance, project-design precedence, PMW Artifact Library access, and validation evidence passed.`
- 2026-05-03: `[developer -> tester] Developer implemented the revised OPS-03 scope: sufficient behavior guidance, project-design SSOT precedence, workflow closeout reporting, PMW design Artifact Library access, and validation coverage.`
- 2026-05-03: `[planner -> developer] OPS-03 revised scope Ready For Code approved by user; Developer starts revised implementation.`
- 2026-05-03: `[user -> planner] Reopen OPS-03 planning so Reviewer findings include sufficient Karpathy-style behavior-guide adoption, project-design SSOT precedence for all agents, and PMW Artifact Library design access improvements.`
- 2026-05-03: `[planner -> user] OPS-03 revised agreement finalized; Ready For Code for revised scope is pending user approval.`
- 2026-05-03: `[reviewer -> developer] OPS-03 closeout readiness review found current-state/history split and agent behavior guidance adoption gaps. This handoff is superseded by the later user-directed Planner rebaseline before further Developer work.`
