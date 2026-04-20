# day-end

Use this skill when the user wants to close the workday cleanly and prepare the next session.

## Goal

Close the day by updating the daily delta and the active state only after a reconciliation pass has checked for conflicting context.

## Read Order

1. `..\..\project-context\durable-context.md`
2. `..\..\project-context\active-state.md`
3. `..\..\project-context\preventive-memory.md`
4. today's file in `..\..\project-context\daily\` if it already exists
5. work evidence available to the harness

## Required Flow

1. Gather today's explicit evidence.
2. Draft or update today's daily delta note from `..\..\project-context\daily\TEMPLATE.md`.
3. Compare today's evidence against durable context and active state.
4. Detect conflicts in priority, status, decision, scope, verification, and blockers.
5. Ask the user short confirmation questions for any conflict that is not already resolved by explicit evidence.
6. Record confirmed answers in today's daily note.
7. Review whether the day exposed a repeated issue that should become an active preventive rule or a promotion candidate in `..\..\project-context\preventive-memory.md`.
8. Update `..\..\project-context\active-state.md`.
9. Promote only stable, user-confirmed information into durable context.
10. Keep any incomplete harness artifact in `..\..\outputs\harness-candidates\` until correction and verification are complete.

## Reconciliation Gate

Do not mark the day as cleanly closed if any of these remain ambiguous:

- the next action
- the completion state of major work
- a changed architecture decision
- an unverified behavior change
- an unresolved blocker owner or status

If ambiguity remains, write it into:

- `Pending Confirmations` in `active-state.md`
- `Deferred Decisions` in today's daily note

## Preventive Memory Review

Review these issue classes before closing the day:

- context drift
- duplicate or premature regeneration
- verification or guardrail gap

If a repeated issue is confirmed and the rule is clear, promote it into `preventive-memory.md > Active Preventive Rules`.

If the issue is real but the rule still needs refinement, record it in `preventive-memory.md > Promotion Candidates`.

## Output Contract

Return a concise closeout with:

1. Completed Today
2. Still Open
3. Verification
4. Confirmations And Deferred Decisions
5. Next Session First Action

If reconciliation is incomplete, state that clearly.

## Rules

- Use the user's language, especially for confirmation prompts.
- Prefer one short question per unresolved conflict.
- Do not silently rewrite durable context from a guess.
- Do not claim a clean next-day start if unresolved confirmations remain.
- Keep the daily note delta-focused rather than rewriting the whole project state.
- Do not promote a selected artifact into `standard-harness` if it still needs correction, supplementation, or conflict resolution.
- Record prevention rules only when the trigger, rule, and check method are explicit enough to be reusable.

## Success Criteria

The next session can start from a clean, explicit state instead of reconstructing context from memory or chat history.
