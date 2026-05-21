# Implementation Plan

> AUTHORITATIVE. Human-readable implementation sequencing SSOT. Edit only through an approved packet.

## Current Plan Summary
- The reusable `V1.3` standard harness baseline is stable and installable.
- `PLN-25` is closed; the baseline is stable.
- `OPS-29` is the selected packet for downstream operator-friction improvements, with P0 closed and bounded P1 approved for implementation.
- Keep `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, and `IMPLEMENTATION_PLAN.md` as governance SSOT, but keep this plan focused on current and next implementation direction only.

## Active / Next Approved Work
- Active lane: `OPS-29` downstream operator friction P0/P1 sequence.
- Active packet: `reference/packets/PKT-01_OPS-29_DOWNSTREAM_OPERATOR_FRICTION_P0_P1_SEQUENCE.md`.
- Current status: P0 is closed; bounded P1 is approved for implementation, verification, and review.
- The next code implementation should stay inside the P1 day-wrap / repair UX / document-label / plan-check-candidate boundary.

## Implementation Sequence
1. OPS-29 planning: keep the approved improvement direction bounded to P0/P1 and leave deferred items outside core.
2. P0 implementation after Ready For Code: add state-sync wrapper, split status output, fix active-profile parser boundary, add root status-file warning, and add safe transition shorthand.
3. P0 verification: run targeted runtime/parser/script tests, root tests, starter tests where affected, validator, validation-report, and context regeneration.
4. P1 implementation after P0 is closed or explicitly accepted: add day-wrap template, improve recovery next-action output, add short document authority labels, and keep plan-check as a lightweight candidate.
5. P1 verification and closeout: sync root/starter reusable assets, regenerate derived evidence, and close through Tester, Reviewer, and Planner.
6. Deferred follow-ups: preventive-memory linting, mobile SQLite/NetInfo mocking, mandatory open-question ledger, and broad path normalization require separate approval.

## Dependency Order And Blocking Conditions
- `OPS-29` P1 is approved, but it must stay inside the lightweight scope defined in the packet.
- P0 is already complete; P1 must not silently absorb deferred mobile/profile/lint/ledger ideas.
- Reusable workflow/runtime/script/manual changes require root and `standard-template` sync in the same lane.
- Generated compatibility docs and `ACTIVE_CONTEXT.*` must be regenerated; do not hand-edit them as authority.
- Tester and Reviewer separation remains mandatory even when the scope is operator/runtime UX only.

## Open Implementation Decisions
- No blocking open implementation decision remains for P1.
- `plan-check` must remain non-gating in this lane.
- Any expansion beyond the approved P1 scope requires a new user decision.

## Current Packet And Evidence Requirements
- Packet authority: `reference/packets/PKT-01_OPS-29_DOWNSTREAM_OPERATOR_FRICTION_P0_P1_SEQUENCE.md`
- Required runtime evidence before forward handoff:
  - `npm.cmd test`
  - `standard-template` `npm.cmd test`
  - `node .harness/runtime/state/dev05-cli.js validate`
  - `node .harness/runtime/state/dev05-cli.js validation-report`
  - `node .harness/runtime/state/dev05-cli.js context`
- P0 completion also requires targeted evidence for sync wrapper, status split, active-profile parsing, transition shorthand, and root-file warning behavior.
- P1 completion also requires targeted evidence for day-wrap template placement, repair next-command guidance, and authority-label documentation.

## Optional Profile Activation
- Not applicable for OPS-29 P0/P1 core work.
- React Native/Expo SQLite and NetInfo mocking remains a deferred optional-profile follow-up, not core.

## Current Iteration
- `OPS-29` P1 developer implementation after explicit user approval.

## Root / Standard-Template Sync Requirements
- Sync both root and `standard-template` when changing reusable workflow contracts, starter-shipped runtime behavior, harness tests, manuals, or route-matrix guidance.
- Keep root-only maintainer history and maintainer architecture details in root-only surfaces unless the starter payload needs a reusable baseline counterpart.
- Generated files are regenerated, not copied as authority.

## Operator Next Action
- `OPS-29` is closed; latest closeout handoff is `planner -> planner`.
- Keep the reusable baseline on planning hold until a new approved lane is selected.
- Source packet: `reference/packets/PKT-01_OPS-29_DOWNSTREAM_OPERATOR_FRICTION_P0_P1_SEQUENCE.md`.
- Preserve packet-before-code, active-context derived authority, generated-doc immutability, root/starter sync, Tester/Reviewer separation, and human approval gates.

## Pointers
- Durable history: `.agents/artifacts/PROJECT_HISTORY.md`
- Whole-project tracker: `.agents/artifacts/PROJECT_PROGRESS.md`
- Active packet authority: `reference/packets/PKT-01_OPS-29_DOWNSTREAM_OPERATOR_FRICTION_P0_P1_SEQUENCE.md`
- Workflow and role rules: `.agents/workflows/*`
- Operator guidance: `reference/manuals/HARNESS_MANUAL.md`
- Route/read audit: `reference/artifacts/HARNESS_FILE_ROUTE_AUDIT_MATRIX.md`
- Harness maintainer module map: `reference/artifacts/maintenance/ROOT_STANDARD_HARNESS_MAINTENANCE_MAP.md`
- Compatibility fallback views: `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`
- Validation evidence: `.agents/artifacts/VALIDATION_REPORT.md`, `.agents/artifacts/VALIDATION_REPORT.json`
