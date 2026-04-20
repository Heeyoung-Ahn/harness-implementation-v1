---
trigger: always_on
---

# Workspace Constitution

This file is the constitutional entry point for Antigravity and any other agent that supports workspace rules.

## Entry Load Policy

1. `AGENTS.md`
2. `.agents/artifacts/CURRENT_STATE.md`
3. `.agents/artifacts/TASK_LIST.md`
4. the workflow file that matches the requested lane
5. only the additional artifacts required by the active task

## Truth Ownership

- live operational truth: `.agents/artifacts/*`
- generated operational summaries: `.agents/runtime/generated-state-docs/*`
- optional extension material: `reference/*`

## Minimal Operating Rules

- respect explicit user orders exactly
- refresh `CURRENT_STATE.md`, `TASK_LIST.md`, and target files before writing
- use the matching workflow before doing state-changing work
- keep handoff and lock changes explicit
- do not treat generated docs as editable operational truth
- do not load `reference/*` unless the current task actually needs it
