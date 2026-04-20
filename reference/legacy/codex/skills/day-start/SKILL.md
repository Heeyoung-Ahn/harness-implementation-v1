# day-start

Use this skill when the user wants to begin the workday with a fast but reliable understanding of the project's current state.

## Goal

Produce a start-of-day brief from the repository-local context model without duplicating durable project context.

## Read Order

1. `..\..\project-context\durable-context.md`
2. `..\..\project-context\active-state.md`
3. the most recent note in `..\..\project-context\daily\`
4. the active rules in `..\..\project-context\preventive-memory.md` only if they directly touch today's scope
5. any immediately relevant repository signals available to the harness

The skill should prefer those files over rebuilding the project state from memory.

## What To Extract

- stable mission and milestone
- recently completed work
- work still in progress
- blockers and risks
- pending confirmations
- next-session gate status
- active preventive rule for today's scope
- today's likely top priorities
- the first concrete action

## Output Contract

Return a concise day-start brief with these sections:

1. Current State
2. What Changed Recently
3. What Needs Attention First
4. Today's Top Priorities
5. First Action

The brief should stay compact and execution-oriented.

## Rules

- Use the user's language.
- Treat `active-state.md` as the current execution truth unless it contains pending confirmations.
- If pending confirmations exist, surface them before the normal priority list.
- If direct evidence contradicts the saved start point, treat the saved state as stale and rebuild the entry point from the latest trustworthy evidence.
- Read only the preventive rules that directly apply to today's scope. Do not bulk-load historical candidates.
- Do not rewrite durable context during the start flow.
- Do not restate the full project history.
- If repository evidence contradicts the saved state, flag the mismatch instead of silently resolving it.
- Do not present candidate materials from `codex\outputs\harness-candidates\` as accepted standard harness outputs.
- End the brief by fixing one concrete first action, not a vague menu of possibilities.

## Success Criteria

The user can begin work without asking:

- what was done
- what remains
- what is blocked
- what needs confirmation
- what to do first
