# Project Workflow Manual

This manual is for humans. It is not part of the default agent load order.

For a fuller operator guide based on the standard harness template, see `reference/artifacts/STANDARD_HARNESS_USER_MANUAL.md`.

## What ships as core

- constitutional entry files
- core operational artifacts
- core workflows
- core skills
- runtime placeholders and generated-doc placeholders

## What ships as reference

- non-core artifacts
- optional skills
- deferred extensions

## First use

1. Copy the contents of `standard-template/` into a new project root.
2. Keep `AGENTS.md` and `.agents/rules/workspace.md` intact.
3. Run `INIT_STANDARD_HARNESS.cmd` or `npm run harness:init`.
4. Fill any remaining project-specific baseline detail before real execution begins.
5. Pull in `reference/` materials only when the project actually needs them.
