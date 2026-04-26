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
5. the minimum baseline artifacts required by the active task
6. only the explicitly activated optional profile artifacts required by the active task
7. the active project packet and authoritative source artifacts when the task depends on them
8. only the additional reference material required by the active task

## Truth Ownership

- governance Markdown truth: `.agents/artifacts/*`
- hot operational DB state: `.harness/operating_state.sqlite`
- generated operational summaries: `.agents/runtime/generated-state-docs/*`
- PMW read surface: read-only projection
- optional extension material: `reference/*`

## Conflict Rule

- governance Markdown truth wins over generated docs
- DB hot-state must be reconciled to governance truth before gate close
- generated docs are never edited manually
- PMW is never write authority

## Minimal Operating Rules

- respect explicit user orders exactly
- refresh `CURRENT_STATE.md`, `TASK_LIST.md`, and target files before writing
- use the matching workflow before doing state-changing work
- treat `Core` as always active, `Optional Profile` as explicit-only, and `Project Packet` as required before project-specific code or cutover work
- keep handoff and lock changes explicit
- do not treat generated docs as editable operational truth
- do not load `reference/*` unless the current task actually needs it
