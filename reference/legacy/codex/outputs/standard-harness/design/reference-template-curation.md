# Reference Template Curation

This document records the strict curation of `reference\repo_harness_template` against this project's harness philosophy.

Only items that were both necessary and fully adapted were accepted into the standard harness.

## Accepted And Integrated

### Entry Load Policy

- Source:
  - `.agents\rules\workspace.md`
  - `.agents\skills\day_start\SKILL.md`
- Why accepted:
  - directly improves start-of-day context recovery
  - reduces unnecessary document loading
  - fits the project's low-context-rebuild philosophy
- Completed adaptation:
  - converted `.agents`-centric routing into `codex\project-context\*`
  - added stale-state handling based on `active-state.md`, latest daily delta, and direct evidence
  - limited preventive-rule loading to only the rules that touch today's scope
- Integrated into:
  - `docs\day-cycle-design.md`
  - `codex\skills\day-start\SKILL.md`

### Day-End Reconciliation And Exact Restart Point

- Source:
  - `.agents\skills\day_wrap_up\SKILL.md`
- Why accepted:
  - directly improves end-of-day quality
  - aligns with the project's requirement for a clean next-day start
- Completed adaptation:
  - replaced `.agents` task/handoff artifacts with `active-state.md`, daily delta, and preventive memory
  - kept conflict confirmation and exact first-action fixation
  - removed repo-specific lock and release-gate detail that this project does not yet use
- Integrated into:
  - `docs\day-cycle-design.md`
  - `codex\skills\day-end\SKILL.md`

### Preventive Memory For Repeated Issues

- Source:
  - `.agents\artifacts\PREVENTIVE_MEMORY.md` behavior as referenced by `workspace.md`, `day_start`, and `day_wrap_up`
- Why accepted:
  - supports long-running project success
  - converts repeated mistakes into reusable prevention rules
- Completed adaptation:
  - added `codex\project-context\preventive-memory.md`
  - limited it to thin reusable rules and promotion candidates
  - wired start and end flows to read or update it only when directly relevant
- Integrated into:
  - `codex\project-context\preventive-memory.md`
  - `docs\day-cycle-design.md`
  - `codex\skills\day-start\SKILL.md`
  - `codex\skills\day-end\SKILL.md`

### Conflict Reconciliation Procedure

- Source:
  - `.agents\skills\conflict_resolver\SKILL.md`
- Why accepted:
  - supports the project's requirement to close the day only after contradictory context is resolved or explicitly deferred
- Completed adaptation:
  - replaced multi-agent lock language with project-context reconciliation rules
  - removed interactive git merge guidance that is outside this harness layer
- Integrated into:
  - `codex\outputs\standard-harness\playbooks\conflict-reconciliation-playbook.md`

### Source Split Principle

- Source:
  - `.agents\rules\template_repo.md`
- Why accepted:
  - matches this project's separation between project state, candidate materials, and accepted standard outputs
- Completed adaptation:
  - mapped live-vs-template separation to `project-context`, `harness-candidates`, and `standard-harness`
  - removed template rollout and reset-tree specifics that do not yet belong in this project
- Integrated into:
  - `docs\harness-layout.md`
  - `docs\day-cycle-design.md`
  - `codex\README.md`

## Kept As Candidates

### Feature Artifact Sync

- Source:
  - `.agents\skills\feature-artifact-sync\SKILL.md`
- Reason kept as candidate:
  - the current project does not yet have a finalized artifact map large enough to justify a full sync skill
  - the useful idea is real, but the current source is still coupled to `.agents` artifacts and broader release-document workflows

### Operating Common Rollout

- Source:
  - `.agents\skills\operating-common-rollout\SKILL.md`
- Reason kept as candidate:
  - this project is not yet rolling accepted standard harness outputs to sibling operating repositories
  - the concept may matter later, but it is not necessary for the current accepted harness corpus

## Rejected For The Accepted Harness

### README And AGENTS As Standard Outputs

- Source:
  - `README.md`
  - `AGENTS.md`
- Reason rejected:
  - they are entry or explanation documents for the reference repository itself, not core reusable harness outputs for this project's accepted corpus

### Markdown Inventory Catalog

- Source:
  - `MARKDOWN_DOCUMENT_CATALOG.md`
- Reason rejected:
  - too heavy for the current harness philosophy
  - high maintenance cost relative to value for this repository-local harness

### Enterprise, Remote Approval, And Product-Specific Packs

- Source examples:
  - `enterprise_governed\*`
  - `backup\remote_approval\*`
  - `expo_*` skills
  - runtime files and self-hosting web monitor assets
- Reason rejected:
  - outside the current project's required operating model
  - too specific, optional, or infrastructure-heavy for the accepted harness baseline

## Gate Result

The accepted harness now includes only the reference-template behaviors that were both necessary and fully adapted.

Anything else remains a candidate or is rejected.
