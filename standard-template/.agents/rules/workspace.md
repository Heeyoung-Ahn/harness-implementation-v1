---
trigger: always_on
---

# Workspace Constitution

This file is the constitutional entry point for Antigravity and any other agent that supports workspace rules.

## Entry Load Policy

1. `AGENTS.md`
2. `.agents/rules/agent_behavior.md`
3. `.agents/runtime/ACTIVE_CONTEXT.json`
4. the workflow file that matches the requested lane or `ACTIVE_CONTEXT.nextWork.workflow`
5. `.agents/artifacts/CURRENT_STATE.md` only when `ACTIVE_CONTEXT.reentryContract.mustReadNext`, packet evidence, or troubleshooting needs the compatibility view
6. `.agents/artifacts/TASK_LIST.md` only when `ACTIVE_CONTEXT.reentryContract.mustReadNext`, packet evidence, or troubleshooting needs the compatibility view
7. the minimum baseline artifacts required by the active task or `ACTIVE_CONTEXT.reentryContract.mustReadNext`
8. only the explicitly activated optional profile artifacts required by the active task
9. the active project packet and authoritative source artifacts when the task depends on them
10. only the additional reference material required by the active task

## Truth Ownership

- governance Markdown truth: `.agents/artifacts/*`
- hot operational DB state: `.harness/operating_state.sqlite`
- generated operational summaries: `.agents/runtime/generated-state-docs/*`
- Active Context: `.agents/runtime/ACTIVE_CONTEXT.json` and `.agents/runtime/ACTIVE_CONTEXT.md` are generated re-entry summaries and first-read re-entry contracts
- optional extension material: `reference/*`

## Conflict Rule

- governance Markdown truth wins over generated docs
- DB hot-state must be reconciled to governance truth before gate close
- generated docs are never edited manually
- Active Context is never write authority
- Active Context must be regenerated when freshness drift appears before broad rereads continue

## Minimal Operating Rules

- respect explicit user orders exactly
- apply `.agents/rules/agent_behavior.md` before non-trivial planning, coding, testing, review, handoff, or closeout work
- treat human-and-Planner-approved project design SSOT as the guiding instruction layer for every agent
- refresh target files and any compatibility views explicitly required by `ACTIVE_CONTEXT.reentryContract.mustReadNext` before writing
- use the matching workflow before doing state-changing work
- treat `Core` as always active, `Optional Profile` as explicit-only, and `Project Packet` as required before project-specific code or cutover work
- keep handoff and lock changes explicit
- do not treat generated docs as editable operational truth
- do not load `reference/*` unless the current task actually needs it

## Git And Worktree Discipline

- Default-branch direct feature development is a strong-default no. Use a dedicated branch or worktree for new features, risky refactors, and parallel work unless an explicit exception is recorded.
- Strong-default worktree cases:
  - new feature implementation
  - risky refactor
  - parallel packet work
  - long-running investigation or remediation
- Explicit exception gates for staying on the current workspace/default branch:
  - narrow maintainer-only doc or template sync
  - very small emergency correction with low merge risk
  - local-only inspection or planning work that does not open implementation
- When using an exception, record the reason in the active packet, handoff, or closeout note so later reviewers can see why branch/worktree isolation was skipped.
- Before merge or handoff, review the diff, rerun the required checks, and make sure unrelated file drift is not riding along with the intended change.
