# Harness Layout

This document defines the repository-local harness layout for this project.

## Root

The canonical local harness root is:

- `codex\`

This repository did not previously have a harness, so `codex\` is the current standard root until a stronger convention replaces it.

## Main Areas

### `codex\project-context\`

Stores the state needed to keep long-running project work coherent.

- `durable-context.md`: stable facts and confirmed decisions
- `active-state.md`: the current execution truth for the next session
- `preventive-memory.md`: repeated issue patterns, preventive rules, and promotion candidates
- `daily\`: dated day-end delta notes

### `codex\skills\`

Stores reusable repository-local workflow skills.

Current skills:

- `day-start`
- `day-end`

### `codex\outputs\standard-harness\`

Stores durable outputs that this project produces as standard harness deliverables.

These are not session notes. They are reusable artifacts meant to survive across sessions and projects.

Use this area for:

- standard design documents
- templates
- playbooks
- checks

### `codex\outputs\harness-candidates\`

Stores candidate harness materials that are still under review.

This area is intentionally separate from `standard-harness`.

Use this area for:

- imported reference material that has not yet been curated
- drafts that still need project-specific correction
- items that passed initial screening but still need remediation
- items that are not yet ready to become standard outputs

## Output Categories

### `design\`

Durable harness design decisions and architecture outputs.

### `templates\`

Reusable file templates, note templates, or scaffolds.

### `playbooks\`

Repeatable operational procedures used by the harness.

### `checks\`

Review and verification checklists used by the harness.

## Operating Rules

- project state belongs in `project-context`, not in `outputs`
- reusable standard deliverables belong in `outputs\standard-harness`, not in daily notes
- unreviewed or partially corrected materials belong in `outputs\harness-candidates`, not in `standard-harness`
- skills should read from `project-context` and write durable reusable outputs only when the work product is meant to be kept
- any candidate that needs correction must be corrected before it is promoted into `standard-harness`
- `standard-harness` must contain only accepted, reusable, and internally consistent outputs
- only the selected and fully adapted parts of `reference\repo_harness_template` may enter `standard-harness`
- use `reference\repo_harness_template` as a source reference for future expansion where helpful
