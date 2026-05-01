# PLN-07 PMW V1.3 Operator Console Draft

## Status
- Approved planning source on 2026-04-27.
- This document records the approved V1.3 planning direction that has been promoted into the canonical requirements baseline.

## Goal
- Keep PMW as an independently installable multi-project console while restoring the richer first-view surface expected by operators.
- Strengthen workflow Markdown files into explicit agent-role contracts that define authority, limits, required SSOT, outputs, and handoff behavior.
- Make handoff the canonical baton for cross-agent execution so a new AI can continue work from the same SSOT and the same next action.
- Allow PMW to guide or launch approved harness commands without turning PMW into the canonical write authority.

## Compatibility Invariants
- Preserve the existing truth contract:
  - `.agents/artifacts/*` = governance Markdown truth
  - `.harness/operating_state.sqlite` = hot operational DB state
  - `.agents/runtime/generated-state-docs/*` = derived output
  - PMW = never the canonical write authority
- Preserve the existing reusable structure:
  - `standard-template/` = starter payload
  - `pmw-app/` = separate installable PMW
  - root/starter reusable runtime contracts must stay synchronized
- Preserve the existing workflow set:
  - `plan.md`
  - `design.md`
  - `dev.md`
  - `test.md`
  - `review.md`
  - `deploy.md`
  - `docu.md`
  - `handoff.md`
- Extend the current model; do not replace it with a separate orchestration system.

## PMW Product Statement
- PMW is an independently installable multi-project operator console.
- PMW project-status and artifact surfaces are read-only by default.
- PMW may launch an approved local harness command catalog for the selected project and show the resulting status, logs, and derived artifacts.
- PMW must not directly edit canonical Markdown truth, DB hot-state, or generated docs.

## PMW First-View Requirements
- The first view must let an operator answer within 30 seconds:
  - where the project currently is
  - what is blocked or at risk
  - what should happen next
- The first view must expose:
  - project header
  - current stage
  - current lane
  - release gate
  - project overview
  - overall progress
  - domain progress
  - decision-required summary
  - blocked / at-risk summary
  - current work
  - next work
  - latest handoff
  - next owner
  - next task
  - artifact library
  - artifact preview
  - diagnostics as a supporting layer

## Workflow Contract Requirements
- Each workflow Markdown file must become an explicit agent-role contract.
- Each workflow must define at minimum:
  - `Role`
  - `Mission`
  - `Authority`
  - `Non-Authority`
  - `Must Read SSOT`
  - `Allowed Actions`
  - `Forbidden Actions`
  - `Required Outputs`
  - `Handoff Rules`
  - `Stop Conditions`
  - `Escalation Rules`

## Explicit Role Model
- `Planner`
  - defines scope, constraints, acceptance, and approval boundaries
  - must not start implementation without explicit approval
- `Designer`
  - defines operator-facing information structure and interaction expectations
  - must not silently redefine requirements or architecture
- `Developer`
  - implements only approved scope
  - must keep validation and state updates aligned with implementation
- `Tester`
  - verifies scope and records evidence
  - must not directly fix discovered defects
  - must hand findings back to `Developer`
- `Reviewer`
  - identifies defects, regressions, policy drift, security risk, and residual debt
  - must not directly implement remediation
- `Deployer`
  - executes only approved release or cutover paths
- `Documenter`
  - performs closeout, history compaction, and restart-point hygiene
- `Handoff`
  - transfers execution between lanes, sessions, and agents using explicit baton records

## Handoff Requirements
- Handoff must be a structured execution baton, not a loose note.
- Each handoff record must identify:
  - `from_role`
  - `to_role`
  - `completed_scope`
  - `remaining_scope`
  - `next_first_action`
  - `referenced_ssot`
  - `evidence`
  - `blocker_or_risk`
  - `target_workflow`
- PMW must surface:
  - latest handoff
  - next owner
  - next task
  - handoff route
  - required SSOT

## Operator Command Catalog Requirements
- Command execution is always scoped to the selected project.
- V1.3 phase-1 command execution policy is:
  - one command at a time per project
  - result logs are session-scoped
- PMW command input must be a curated catalog only.
- PMW must not allow arbitrary shell execution.
- Every command entry must expose:
  - name
  - description
  - target project
  - expected effect
  - side-effect class
  - launch mode

## Phase-1 PMW Command Set
- Mandatory phase-1 PMW command scope:
  - `status`
  - `next`
  - `explain`
  - `validate`
  - `handoff`
  - `pmw-export`
- `handoff` is not guidance-only in V1.3.
- `handoff` must launch the next approved workflow based on routing rules, not merely describe the route.

## Terminal-Only Commands For Phase-1
- These commands are not part of the mandatory PMW command launcher in phase-1:
  - `doctor`
  - `test`
  - `validation-report`
- PMW must still guide the operator to run them in the selected project's terminal with the correct command surface.

## Command Result Surface Requirements
- PMW must show, at minimum:
  - execution time
  - selected project
  - success / failure
  - readable summary
  - stdout / stderr
  - related artifact links
- Long-running commands must expose in-progress status.
- Failures must prefer operator-friendly summaries over raw dump-first output.
- Commands with state-changing side effects must require confirmation before launch.

## Accepted Decisions
- PMW remains independently installable and supports multiple projects.
- Workflow contracts will use explicit role naming:
  - `Planner`
  - `Developer`
  - `Tester`
  - `Reviewer`
  - `Deployer`
  - `Documenter`
- Command execution is always against the selected project.
- Result logs are session-scoped.
- `handoff` includes actual workflow launch, not route guidance only.
- Terminal-only guidance must be shown for `doctor`, `test`, and `validation-report` until they are promoted into the PMW command launcher scope.

## Open Questions
- Whether `test` should move from terminal-only guidance into the PMW launcher in a later V1.3 packet.
- Whether PMW should expose a recent in-session command history panel beyond the current result surface.
- Whether workflow role naming should remain file-internal only or also rename workflow filenames in a later maintenance lane.
