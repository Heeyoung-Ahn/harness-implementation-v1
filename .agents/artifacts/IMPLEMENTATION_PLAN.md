# Implementation Plan

## Current Plan Summary
- The reusable `V1.3` standard harness baseline is stable and installable.
- `PLN-25` is the approved broad cleanup lane for long-context re-entry hardening and implementation-plan rebaseline.
- Keep `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, and `IMPLEMENTATION_PLAN.md` as governance SSOT, but keep this plan focused on current and next implementation direction only.

## Active / Next Approved Work
- Active lane: `PLN-25` long-context re-entry and implementation plan rebaseline.
- Active packet: `reference/packets/PKT-01_PLN-25_LONG_CONTEXT_REENTRY_AND_IMPLEMENTATION_PLAN_REBASELINE.md`.
- No additional implementation lane should open until `PLN-25` closes through Developer, Tester, Reviewer, and Planner closeout.

## Implementation Sequence
1. Rebaseline `IMPLEMENTATION_PLAN.md` into a short human-readable plan document.
2. Move durable dated history out of the plan into `PROJECT_HISTORY.md`.
3. Tighten workflow, handoff, `ACTIVE_CONTEXT`, and compatibility-view read contracts so broad files do not re-enter the default AI read path.
4. Add a maintainer architecture map for `.harness/runtime/state/*` ownership and write surfaces.
5. Sync root and `standard-template` reusable workflow/runtime/test/manual/matrix contracts.
6. Regenerate context/evidence surfaces, run tests, and close the packet through Tester, Reviewer, and Planner.

## Dependency Order And Blocking Conditions
- `PLN-25` implementation is approved, but scope must remain inside the packet.
- Reusable workflow/runtime contract changes require root and `standard-template` sync in the same lane.
- Generated compatibility docs and `ACTIVE_CONTEXT.*` must be regenerated; do not hand-edit them as authority.
- Tester and Reviewer separation remains mandatory even when the cleanup scope is maintainer-only.

## Open Implementation Decisions
- None. `PLN-25` already has approved disposition, destination authority, final TOC, AI read-path, and sync criteria.

## Current Packet And Evidence Requirements
- Packet authority: `reference/packets/PKT-01_PLN-25_LONG_CONTEXT_REENTRY_AND_IMPLEMENTATION_PLAN_REBASELINE.md`
- Required runtime evidence before forward handoff:
  - `npm.cmd test`
  - `standard-template` `npm.cmd test`
  - `node .harness/runtime/state/dev05-cli.js validate`
  - `node .harness/runtime/state/dev05-cli.js validation-report`
  - `node .harness/runtime/state/dev05-cli.js context`
- Packet completion also requires final `HARNESS_MANUAL.md` and `HARNESS_FILE_ROUTE_AUDIT_MATRIX.md` updates.

## Optional Profile Activation
- Not applicable for the current maintainer cleanup lane.

## Current Iteration
- `PLN-25` broad cleanup implementation, validation, and closeout.

## Root / Standard-Template Sync Requirements
- Sync both root and `standard-template` when changing reusable workflow contracts, starter-shipped runtime behavior, harness tests, manuals, or route-matrix guidance.
- Keep root-only maintainer history and maintainer architecture details in root-only surfaces unless the starter payload needs a reusable baseline counterpart.
- Generated files are regenerated, not copied as authority.

## Operator Next Action
- `PLN-25` is closed; latest closeout handoff is `planner -> planner`.
- Keep the reusable baseline on planning hold until a new approved lane is selected.
- Source packet: `reference/packets/PKT-01_PLN-25_LONG_CONTEXT_REENTRY_AND_IMPLEMENTATION_PLAN_REBASELINE.md`.
- Preserve packet-before-code, active-context derived authority, generated-doc immutability, root/starter sync, Tester/Reviewer separation, and human approval gates.

## Pointers
- Durable history: `.agents/artifacts/PROJECT_HISTORY.md`
- Whole-project tracker: `.agents/artifacts/PROJECT_PROGRESS.md`
- Active packet authority: `reference/packets/PKT-01_PLN-25_LONG_CONTEXT_REENTRY_AND_IMPLEMENTATION_PLAN_REBASELINE.md`
- Workflow and role rules: `.agents/workflows/*`
- Operator guidance: `reference/manuals/HARNESS_MANUAL.md`
- Route/read audit: `reference/artifacts/HARNESS_FILE_ROUTE_AUDIT_MATRIX.md`
- Harness maintainer module map: `reference/artifacts/maintenance/ROOT_STANDARD_HARNESS_MAINTENANCE_MAP.md`
- Compatibility fallback views: `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`
- Validation evidence: `.agents/artifacts/VALIDATION_REPORT.md`, `.agents/artifacts/VALIDATION_REPORT.json`
