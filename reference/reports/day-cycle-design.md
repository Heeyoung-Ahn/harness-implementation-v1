# Day-Cycle Design

This document defines the day-cycle operating layer of the repository-local harness.

The day-cycle is not another summary feature. It is the operating protocol that keeps long-running work coherent across sessions by separating stable context, active execution state, and daily changes.

## Design Goals

- reduce context rebuild cost at the start of a work session
- avoid duplicating the same facts across multiple files
- make end-of-day closeout explicit and conflict-aware
- keep the next session clean by reconciling contradictory context before the day is closed
- support both the user and the AI with the same operating model

## State Layers

### Durable Context

Stable information that should survive many sessions.

Examples:

- project goals
- architecture principles
- non-goals
- durable constraints
- confirmed decisions

### Active State

The current execution truth for the next session.

Examples:

- current milestone
- in-progress work
- blockers
- next actions
- verification status
- pending confirmations
- unresolved risks

### Daily Delta

A dated record of what changed during one workday.

Examples:

- work completed today
- decisions made today
- scope or priority changes
- tests run today
- new risks or blockers
- tomorrow's first action
- reconciliation result

Daily delta records change. It does not restate the entire project.

## Source-Of-Truth Rules

- `durable-context.md` is the source of truth for stable project context.
- `active-state.md` is the source of truth for current execution state.
- `preventive-memory.md` is the source of truth for recurring issue prevention rules and promotion candidates.
- `daily\YYYY-MM-DD.md` is the source of truth for the day's delta.
- candidate harness materials under review belong in `codex\outputs\harness-candidates\`
- reusable accepted harness deliverables belong in `codex\outputs\standard-harness\`, not in project state files
- anything that still needs correction must stay out of `standard-harness` until the correction is complete
- the same fact should not be stored in more than one place unless one copy is explicitly derived

## Session Flow

### Day Start

The `day-start` skill should:

1. Read `durable-context.md`.
2. Read `active-state.md`.
3. Read the latest daily closeout note.
4. Read only the active preventive rules that directly touch today's scope.
5. Check whether `active-state.md` contains pending confirmations or unresolved reconciliation items.
6. Treat the saved start point as stale if direct evidence contradicts the latest daily delta or active state.
7. Produce a start brief with:
   - what is stable
   - what was completed recently
   - what remains
   - what is blocked
   - what must be clarified first
   - which preventive rule must be respected first
   - today's top priorities
   - the first concrete action

### Day End

The `day-end` skill should:

1. Gather today's work evidence.
2. Draft or update today's daily closeout note.
3. Compare current evidence against durable context and active state.
4. Detect conflicts.
5. Ask the user short confirmation questions for conflicts that cannot be resolved from explicit evidence.
6. Review repeated issue patterns and update `preventive-memory.md` when a preventive rule or promotion candidate is justified.
7. Update `active-state.md` only after reconciliation is complete.
8. Promote newly confirmed durable decisions only when they are stable enough to survive future sessions.
9. Keep candidate harness artifacts out of `standard-harness` until selection, correction, and verification are complete.

## Reconciliation Gate

The day is not considered cleanly closed until reconciliation is complete.

The harness must detect and handle at least these conflict categories:

- priority conflict
- status conflict
- decision conflict
- scope conflict
- verification conflict
- blocker conflict

For each detected conflict, the harness must do one of the following:

- resolve it from explicit evidence
- ask the user to confirm the correct state
- mark it as a deferred decision and carry it into the next session gate

If any conflict remains unresolved, the daily closeout must not claim a clean state.

## Preventive Memory Gate

The harness must review whether the day exposed a repeated or structural issue that should become a preventive rule.

Use these categories:

- context drift
- duplicate or premature regeneration
- verification or guardrail gap

If the issue is confirmed and the prevention rule is clear, add it to `preventive-memory.md > Active Preventive Rules`.

If the issue is real but the rule or check still needs refinement, add it to `preventive-memory.md > Promotion Candidates`.

## Selection And Promotion Gate

The harness must apply a strict promotion gate to any reusable harness artifact.

Promotion into `codex\outputs\standard-harness\` is allowed only when:

- the artifact is necessary to the harness philosophy
- it fits the project's operating model
- project-specific corrections are complete
- wording, structure, and scope have been normalized
- conflicts against existing accepted outputs have been resolved
- the artifact passes the promotion checklist

If an item is useful but still incomplete, it stays in `codex\outputs\harness-candidates\`.

## File Layout

The day-cycle layer uses these repository-local paths:

- `codex\README.md`
- `codex\project-context\durable-context.md`
- `codex\project-context\active-state.md`
- `codex\project-context\preventive-memory.md`
- `codex\project-context\daily\YYYY-MM-DD.md`
- `codex\project-context\daily\TEMPLATE.md`
- `codex\skills\day-start\SKILL.md`
- `codex\skills\day-end\SKILL.md`
- `codex\outputs\harness-candidates\`
- `codex\outputs\standard-harness\`

This keeps operating state and reusable harness outputs separate.
