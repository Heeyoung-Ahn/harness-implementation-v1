# Day Start

Use this skill to recover the smallest correct execution context at the start of a session.

## Goal

Produce a compact start-of-session brief from the standardized harness without rebuilding the project state from memory.

## Read Order

1. `.agents/artifacts/CURRENT_STATE.md`
2. `.agents/artifacts/TASK_LIST.md`
3. `.agents/artifacts/PREVENTIVE_MEMORY.md` only if directly relevant
4. the most recent note under `reference/artifacts/daily/` when today's scope needs recent delta context
5. any immediately relevant repository evidence

## What To Extract

- current state and release target
- what changed recently
- blockers, risks, or pending confirmations
- today's likely top priorities
- the first concrete action

## Output Contract

Return a concise start brief with these sections:

1. Current State
2. What Changed Recently
3. What Needs Attention First
4. Today's Top Priorities
5. First Action

## Rules

- Use the user's language.
- Treat `.agents/artifacts/CURRENT_STATE.md` as the live execution truth unless direct evidence contradicts it.
- If direct evidence contradicts the saved state, flag the mismatch instead of silently resolving it.
- Read preventive rules only when they directly affect today's scope.
- Do not bulk-restate project history.
- End with one concrete first action.