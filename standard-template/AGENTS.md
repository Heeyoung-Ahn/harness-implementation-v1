# Standard Harness Starter

This file is the Codex entry point for the standard multi-IDE, multi-agent harness starter.

## Load Order

1. Read `.agents/rules/workspace.md`.
2. Read `.agents/rules/agent_behavior.md`.
3. Read `.agents/runtime/ACTIVE_CONTEXT.json` as the first AI re-entry surface. If it is missing or stale, regenerate it before broad rereads.
4. Read the workflow that matches the active lane or `ACTIVE_CONTEXT.nextWork.workflow` when that route is explicit.
5. Read `.agents/artifacts/CURRENT_STATE.md`.
6. Read `.agents/artifacts/TASK_LIST.md`.
7. Read only the baseline artifacts required for the active task or `ACTIVE_CONTEXT.reentryContract.mustReadNext`.
8. If an optional profile is explicitly active, read only the profile artifacts required by the active task.
9. If the active task depends on a project packet or authoritative source, read that packet/source before state-changing work.
10. Read only the additional reference material required by the active task.

## Truth Contract

- `.agents/artifacts/*` is the governance Markdown truth layer.
- `.harness/operating_state.sqlite` is hot operational DB state.
- `.agents/runtime/generated-state-docs/*` is derived output and must not be edited manually.
- `.agents/runtime/ACTIVE_CONTEXT.json` is the first AI-facing re-entry contract, must stay freshness-aligned, and is never write authority.
- `.agents/runtime/ACTIVE_CONTEXT.md` is the human-facing Korean re-entry contract and is never write authority.
- `reference/*` is optional reference material and must not be treated as mandatory runtime input.
- If derived output conflicts with governance Markdown, reconcile the DB/generation path before gate close.

## Entry Rule

Do not start by bulk-reading the repository. Use `ACTIVE_CONTEXT.json` first, then expand only through the load order and `mustReadNext` contract required by the active task.
