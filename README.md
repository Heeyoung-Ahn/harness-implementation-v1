# harness-implementation-v1

This repository now operates its harness from the same standardized structure that ships in `standard-template/`.

## Standardized Root

- `AGENTS.md`
- `INIT_STANDARD_HARNESS.cmd`
- `PROJECT_WORKFLOW_MANUAL.md`
- `.agents/`
- `reference/`
- `src/`
- `test/`
- `templates/`
- `standard-template/`
- `package.json`

## Live Harness Truth

- live operational artifacts: `.agents/artifacts/*`
- generated operational summaries: `.agents/runtime/generated-state-docs/*`
- non-core reference material: `reference/*`

## Reference Subdirectories

- `reference/artifacts/`: non-core artifact documents
- `reference/packets/`: task-level approval packets and templates
- `reference/planning/`: planning baselines and carry-forward inputs
- `reference/reports/`: design reviews and supporting reports
- `reference/mockups/`: mockups and visual review assets
- `reference/legacy/`: migrated or superseded legacy harness material

## Rule

Root-level harness documents are intentionally minimized. New harness material should be placed under `.agents/` or `reference/` according to its role.

## Starter Bootstrap

- Copy the contents of `standard-template/` into the new project root.
- Run `INIT_STANDARD_HARNESS.cmd` or `npm run harness:init` in that new repo.
- The bootstrap flow replaces starter placeholders, seeds `.harness/operating_state.sqlite`, and writes fresh generated state docs for PMW.
