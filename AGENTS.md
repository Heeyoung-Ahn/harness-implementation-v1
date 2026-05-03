# Standard Harness Starter

This file is the Codex entry point for the standard multi-IDE, multi-agent harness starter.

## Load Order

1. Read `.agents/rules/workspace.md`.
2. Read `.agents/rules/agent_behavior.md`.
3. Read `.agents/artifacts/CURRENT_STATE.md`.
4. Read `.agents/artifacts/TASK_LIST.md`.
5. Read the workflow that matches the active lane.
6. Read only the baseline artifacts required for the active task.
7. If an optional profile is explicitly active, read only the profile artifacts required by the active task.
8. If the active task depends on a project packet or authoritative source, read that packet/source before state-changing work.
9. Read only the additional reference material required by the active task.

## Truth Contract

- `.agents/artifacts/*` is the governance Markdown truth layer.
- `.harness/operating_state.sqlite` is hot operational DB state.
- `.agents/runtime/generated-state-docs/*` is derived output and must not be edited manually.
- PMW is a read-only surface and is never write authority.
- `reference/*` is optional reference material and must not be treated as mandatory runtime input.
- If derived output conflicts with governance Markdown, reconcile the DB/generation path before gate close.

## Entry Rule

Do not start by bulk-reading the repository. Use the load order above and expand only when the active task requires it.
