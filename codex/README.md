# Repository Harness Legacy Layer

This directory is a compatibility and archive layer for the pre-template project harness.

## Current Rule

- `AGENTS.md` and `.agents/` are now the canonical harness entry structure for this repository.
- `codex/` remains available for historical context, accepted outputs, and legacy project-context records that have not yet been fully retired.

## What Stays Here

- legacy project-context notes and daily deltas
- historical or accepted harness outputs under `outputs/`
- older repository-local skills retained for comparison or migration

## Migration Intent

- live operational truth should now be read from `.agents/artifacts/*`
- generated operational summaries should now be read from `.agents/runtime/generated-state-docs/*`
- optional or non-core reference material should live under `reference/*`
