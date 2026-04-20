# Workspace Structure Report

## Purpose

This report explains how the workspace is organized after cleanup, which parts are canonical for ongoing work, and what was moved to backup so the root stays easier to read.

## Root-Level Reading Guide

### Keep At Root: canonical project docs and execution entry points

- `README.md`
  - thin-workspace entry explanation
- `REQUIREMENTS.md`
  - user-facing baseline requirements
- `ARCHITECTURE_GUIDE.md`
  - architecture contract
- `IMPLEMENTATION_PLAN.md`
  - milestone flow, operator next action, execution ordering
- `UI_DESIGN.md`
  - PMW design rules and mockup contract
- `PROTOTYPE_REFERENCE.md`
  - carry-forward contract from the prototype
- `PLN-00_DEEP_INTERVIEW.md`
  - planning packet
- `PLN-01_REQUIREMENTS_FREEZE.md`
  - requirements freeze result
- `PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
  - packet template
- `PKT-01_DEV-01_DB_FOUNDATION.md`
  - DEV-01 packet
- `PKT-01_DEV-02_GENERATED_STATE_DOCS.md`
  - DEV-02 packet
- `PKT-01_DEV-03_CONTEXT_RESTORATION_READ_MODEL.md`
  - DEV-03 packet
- `PKT-01_DEV-04_PMW_READ_SURFACE.md`
  - current active packet
- `HARNESS_FULL_DESIGN_REVIEW.md`
  - first-ship review packet kept as reference input
- `harness_engineering_knowledge_transfer.md`
  - lessons and anti-pattern evidence kept as reference input
- `package.json`
  - local test entry point

### Main working directories

- `src/`
  - actual implementation code
- `test/`
  - local verification lane for implementation code
- `docs/`
  - local design support docs and review artifacts
  - includes `dev-04-pmw-read-surface-mockup.html`
- `codex/`
  - canonical local harness root for project state and reusable harness outputs
- `reference/`
  - source reference material retained for future comparison or selective adaptation
- `backup/`
  - moved clutter, temporary artifacts, and items intentionally taken out of the main working surface

## Canonical Working Surface

When resuming work, prefer reading in this order:

1. `codex/project-context/active-state.md`
2. `PKT-01_DEV-04_PMW_READ_SURFACE.md`
3. `docs/dev-04-pmw-read-surface-mockup.html`
4. `IMPLEMENTATION_PLAN.md`
5. `src/` and `test/` for implementation and verification

## What Was Moved To Backup

Moved into `backup/2026-04-19-workspace-cleanup/`:

- `root-probes/codex_probe.ps1`
  - one-off probe file, not part of the product or harness contract
- `reference-temp/repo_harness_template-.codex-tmp`
  - temporary runtime/dependency material from the reference repo
- `reference-temp/repo_harness_template-backup`
  - backup material nested inside the source reference repo
- `reference-temp/repo_harness_template-tmp`
  - temporary browser/pdf/test artifacts from the source reference repo

## Why These Stayed Out Of Backup

These items were intentionally left in place because they are still part of the current working contract:

- root planning and packet `.md` files
  - current docs and harness state still point to them directly
- `codex/`
  - canonical local harness root
- `docs/dev-04-pmw-read-surface-mockup.html`
  - current mockup approval target
- `reference/repo_harness_template/`
  - still used as source reference in durable context and curation records

## Current Resume Point

- The implementation foundations in `src/state/` are in place and locally tested.
- The current blocker is not code; it is mockup approval for DEV-04.
- After mockup approval, the next step is PMW UI shell implementation.
