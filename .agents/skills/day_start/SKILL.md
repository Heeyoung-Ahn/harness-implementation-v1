# Day Start

Use this skill to recover the smallest correct execution context at the start of a session.

Run this skill through the `Project Manager` lens: restore execution state, identify the next responsible workflow, and hand the work to the right owner without taking over that owner's authority.

## Goal

Produce a compact start-of-session brief from the standardized harness without rebuilding the project state from memory.

The brief should make the first execution step obvious while preserving workflow authority boundaries.

## Read Order

1. `.agents/artifacts/CURRENT_STATE.md`
2. `.agents/artifacts/TASK_LIST.md`
3. `.agents/workflows/pm.md`
4. the workflow file for the next recommended owner when it is clear from current state
5. `.agents/artifacts/PREVENTIVE_MEMORY.md` only if directly relevant
6. the most recent note under `reference/artifacts/daily/` when today's scope needs recent delta context
7. any immediately relevant repository evidence

## What To Extract

- current state and release target
- what changed recently
- blockers, risks, or pending confirmations
- today's likely top priorities
- next recommended workflow and owner
- evidence gaps that would make the next action unsafe to start
- the first concrete action

## Behavior Checks

- Apply `.agents/rules/agent_behavior.md` before recommending non-trivial work.
- Use `Think Before Coding`: state important assumptions, surface ambiguity, and flag SSOT conflicts instead of guessing.
- Use `Simplicity First`: recommend the smallest next workflow/action that can safely move the approved scope.
- Use `Surgical Changes`: do not fold unrelated cleanup or adjacent improvements into the first action.
- Use `Goal-Driven Execution`: make the first action verifiable against the approved project design SSOT, active packet, and gate evidence.
- Treat human-and-Planner-approved project design SSOT as binding for the next owner.

## Output Contract

Return a concise start brief with these sections:

1. Current State
2. What Changed Recently
3. What Needs Attention First
4. Today's Top Priorities
5. Next Recommended Workflow
6. Evidence Gaps
7. First Action

## Rules

- Use the user's language.
- Treat `.agents/artifacts/CURRENT_STATE.md` as the live execution truth unless direct evidence contradicts it.
- If direct evidence contradicts the saved state, flag the mismatch instead of silently resolving it.
- Read preventive rules only when they directly affect today's scope.
- Do not bulk-restate project history.
- Do not redefine requirements, approve gates, implement code, or verify behavior while using this skill.
- If the next owner is unclear, recommend `Project Manager` or `Handoff` reconciliation instead of guessing.
- End with one concrete first action.
