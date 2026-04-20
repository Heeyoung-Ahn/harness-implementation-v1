# Conflict Reconciliation Playbook

## Purpose

Resolve contradictory project context without silently choosing one side and polluting the next session.

## Use This When

- saved state and direct evidence disagree
- two context files describe the same work differently
- a day-end closeout cannot determine the correct next action
- a candidate harness artifact conflicts with an accepted standard output

## Procedure

1. Stop and name the conflict precisely.
2. Re-read the relevant sources in this order:
   - `codex\project-context\durable-context.md`
   - `codex\project-context\active-state.md`
   - latest relevant file in `codex\project-context\daily\`
   - direct repository evidence
3. Decide whether the conflict can be resolved from explicit evidence alone.
4. If not, ask the user one short confirmation question.
5. Update the active state and daily note only after the conflict is resolved or explicitly deferred.
6. If the conflict reveals a repeated pattern, consider adding a preventive rule or promotion candidate.

## Do Not

- silently guess
- preserve contradictory truths in accepted standard outputs
- mark the next session as clean if the real next action is still ambiguous
