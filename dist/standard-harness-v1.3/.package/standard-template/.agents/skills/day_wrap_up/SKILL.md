# Day Wrap Up

Use this skill to close the day with a reliable restart point.

Run this skill through the `Project Manager` lens: reconcile what happened, preserve the next baton, and make the next responsible workflow explicit without claiming another workflow's approval authority.

## PM Boundary

- PM may reconcile status, blocker ownership, next workflow, and handoff readiness from canonical evidence.
- PM may recommend the next owner and first action.
- PM must not mark implementation, testing, review, release, or human approval gates complete unless the owning workflow or user has provided that evidence.

## Required Flow

1. gather explicit evidence
2. update the live state
3. record unresolved items honestly
4. review whether any repeated issue should become preventive memory
5. define the next responsible workflow
6. define the next first action

## Reconciliation Gate

Do not claim a clean closeout if any of these remain ambiguous:

- next action
- completion state of major work
- changed architecture direction
- unverified behavior change
- unresolved blocker owner or status
- unclear next responsible workflow or handoff route

## Behavior Checks

- Apply `.agents/rules/agent_behavior.md` before changing live state or recommending closeout.
- Use `Think Before Coding`: name unresolved assumptions, ambiguity, SSOT conflicts, and approval gaps.
- Use `Simplicity First`: record only the current day's real delta and avoid speculative next-lane scope.
- Use `Surgical Changes`: reconcile state for the work that actually happened; do not rewrite unrelated history.
- Use `Goal-Driven Execution`: tie verification and next first action to concrete checks, the approved project design SSOT, active packet, and gate evidence.
- If Developer, Tester, or Reviewer work remains, preserve their authority and hand off instead of self-approving.

## Output Contract

Return a concise closeout with:

1. Completed Today
2. Still Open
3. Verification
4. Confirmations And Deferred Decisions
5. Next Recommended Workflow
6. Next Session First Action

## Rules

- Use the user's language for closeout and confirmation prompts.
- Prefer short confirmation questions when evidence does not fully close a conflict.
- Do not silently rewrite stable context from a guess.
- Promote repeated issues into preventive memory only when the trigger, rule, and check method are explicit enough to reuse.
- If the next workflow owns planning, implementation, testing, review, deployment, or documentation work, report the handoff recommendation instead of performing that workflow's work inside this skill.
