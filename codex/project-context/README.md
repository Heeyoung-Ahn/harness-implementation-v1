# Legacy Project Context Layer

This directory stores the earlier project-context structure that was used before the standard template was applied to the repository root.

## Current Rule

- `.agents/artifacts/*` is the live operational truth layer.
- `.agents/runtime/generated-state-docs/*` is the generated operational summary layer.
- `codex/project-context/*` is now a legacy compatibility and archive layer unless a file is still explicitly referenced.

## Legacy Files

- `durable-context.md`: durable project facts not yet remapped into `reference/artifacts/*`
- `active-state.md`: previous live-state file before `.agents/artifacts/CURRENT_STATE.md`
- `preventive-memory.md`: previous preventive-memory location before `.agents/artifacts/PREVENTIVE_MEMORY.md`
- `daily/YYYY-MM-DD.md`: historical daily notes that may still inform migrations or audits

## Migration Direction

- preserve useful history here
- avoid introducing new canonical truth here when the same information belongs in `.agents` or `reference`
- retire duplicate live-state usage over time as the standard template becomes the default operating model
