# Standard Harness Starter

This file is the Codex entry point for the standard multi-IDE, multi-agent harness starter.

## Load Order

1. Read `.agents/rules/workspace.md`.
2. Read `.agents/artifacts/CURRENT_STATE.md`.
3. Read `.agents/artifacts/TASK_LIST.md`.
4. Read only the workflow and artifacts required for the active task.

## Truth Contract

- `.agents/artifacts/*` is the live operational truth layer.
- `.agents/runtime/generated-state-docs/*` is derived output.
- `reference/*` is optional reference material and must not be treated as mandatory runtime input.

## Entry Rule

Do not start by bulk-reading the repository. Use the load order above and expand only when the active task requires it.
