# PKT-01 PLN-06 Standalone Business Harness V1.1 Implementation

## Purpose
This concrete task packet authorizes implementation of `PLN-06` after requirements approval. The goal is to make the reusable `standard-template/` a standalone governance harness for real Excel/VBA-MariaDB business-system replacement projects without OMX or external orchestration dependencies.

## Approval Rule
- This packet is written before implementation work.
- Scope is `Core` plus reusable `Optional Profile` artifacts.
- No budget, asset, or corporate accounting project-specific schema or policy detail is allowed in core.
- `standard-template/` synchronization is mandatory before closeout.
- This packet must remain registered as category `task_packet` in `artifact_index`.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | PLN-06 Standalone Business Harness V1.1 implementation | User approved requirements and requested implementation | approved |
| Ready For Code | approve | Requirements source is approved and this packet fixes implementation boundaries | approved |
| Human sync needed | no | User already approved proceeding; no product UI or domain DB design is being decided | approved |
| User-facing impact | none | Operator CLI/docs change, no downstream product UI | approved |
| Layer classification | core + optional profile | Runtime/contracts are core; new reusable patterns are optional profiles | approved |
| Active profile dependencies | none | This packet creates reusable profiles; it does not activate them for a project | approved |
| Profile evidence status | not-needed | No downstream project profile is active for this implementation packet | approved |
| UX archetype status | not-needed | No product UI surface is implemented | approved |
| UX deviation status | none | No product UX deviation | approved |
| Environment topology status | not-needed | No deploy/cutover target change | approved |
| Domain foundation status | not-needed | No product data model or DB design | approved |
| Authoritative source intake status | approved | `reference/planning/PLN-06_STANDALONE_BUSINESS_HARNESS_V1_1.md` is the authoritative source | approved |
| Shared-source wave status | not-needed | Single implementation packet | approved |
| Packet exit gate status | approved | Root/starter tests, validator, command checks, validation report, starter sync, and review evidence are complete | approved |
| Improvement promotion status | none | This is an approved lane, not an unreviewed memory promotion | approved |
| Existing system dependency | none | Template must support legacy systems, but no concrete legacy system is being integrated now | approved |
| New authoritative source impact | analyzed | User review feedback has been incorporated into PLN-06 | approved |
| Risk if started now | low | Scope, validator levels, and command acceptance are defined | approved |

## 1. Goal
- Deliver all essential `PLN-06` V1.1 readiness in one implementation lane.
- Keep the harness standalone and repo-native.
- Remove starter ambiguity around root `src/`, root `test/`, and product-code ownership.
- Add operator commands, profiles, packet readiness rules, validation reports, task truth structure, and root/starter sync verification.

## 2. Non-Goal
- Do not integrate OMX, `.omx`, tmux/team runtime, MCP bridge, or external orchestration.
- Do not hardcode budget, asset, or accounting-specific schema/policy details.
- Do not implement advanced migration automation beyond preserving/wrapping the existing migration commands and gate evidence.
- Do not make PMW writable.
- Do not require a `backend/frontend` product layout.

## 3. User Problem And Expected Outcome
- Current problem: the starter is structurally strong but still risks product-code path collision and lacks standalone operator UX/evidence gates needed for large legacy replacement projects.
- Expected outcome: a copied starter can immediately begin real replacement-project kickoff, force required source/profile evidence before `Ready For Code`, and explain its own status, blockers, next action, and validation result.

## 4. In Scope
- Harness/product layout separation and compatibility wrappers.
- Repository layout ownership contract.
- Truth hierarchy and conflict-rule synchronization.
- Structured task truth tables.
- Workflow state vocabulary.
- Operator commands: `doctor`, `status`, `next`, `explain`, `validation-report`.
- Validation report persistence.
- Optional profiles for legacy Excel/VBA-MariaDB replacement, Python/Django backoffice, and workflow/approval application.
- Packet template evidence updates.
- Validator must-fail/warn/document-only enforcement from `PLN-06`.
- Root and starter synchronization.
- Tests and review closeout.

## 5. Out Of Scope
- Business-specific account mappings, asset categories, approval chains, table names, workbook names, or screen definitions.
- Rich PMW UI redesign.
- CI dashboard integration.
- Multi-project registry.

## 6. Detailed Behavior
- Trigger: user approves `PLN-06` and requests implementation.
- Main flow: implement root changes, sync reusable assets to `standard-template/`, run root/starter verification, persist validation reports, close with review evidence.
- Alternate flow: if an essential requirement conflicts with existing architecture, stop and update this packet before continuing.
- Error state: failing root/starter tests or sync drift blocks closeout.

## 7. Program Function Detail
- Input: current governance docs, `PLN-06` planning source, existing runtime/validator/tests.
- Processing: relocate/wrap harness runtime, add commands, extend validator/reporting, add profiles/docs/tests.
- Output: synchronized root and starter V1.1 harness.
- Edge case: copied starter before bootstrap must still return clear `starter_bootstrap_pending` guidance.

## 8. UI/UX Detailed Design
- Active profile references: none.
- Profile composition rationale: not applicable.
- UX archetype reference: not needed.
- 영향받는 화면: no product UI.
- interaction: CLI output must be readable, stable, and include next action where applicable.

## 9. Data / Source Impact
- Layer classification: core + optional profile.
- Core / profile / project boundary rationale: core owns generic gates/commands/layout; profiles own reusable project-type evidence; project-specific detail stays in future packets.
- Required reading before code: `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/planning/PLN-06_STANDALONE_BUSINESS_HARNESS_V1_1.md`
- Markdown / docs impact: governance docs, packet template, user manual, profiles, starter docs.
- generated docs impact: regenerate after live truth changes.
- validator / cutover impact: validator gains V1.1 checks and report persistence.
- Authoritative source refs: `reference/planning/PLN-06_STANDALONE_BUSINESS_HARNESS_V1_1.md`
- Authoritative source intake reference: this packet.
- Authoritative source disposition: implemented.
- Existing plan conflict: none.
- Current implementation impact: V1.1 implementation is aligned to the approved PLN-06 requirements.
- Impacted packet set scope: single-packet.
- Existing program / DB dependency: template-level support only.
- Existing schema source artifact: not applicable for this reusable implementation.
- Migration / rollback / cutover compatibility: existing command behavior must be preserved or wrapped.

## 10. Acceptance
- Root and `standard-template/` tests pass.
- Root and starter validation pass or return intended untouched-starter guidance where applicable.
- `doctor`, `status`, `next`, `explain`, and `validation-report` produce useful operator-facing output.
- Validation reports are persisted as Markdown and JSON artifacts.
- Copied starter no longer reserves root `src/`, root `test`, or root `package.json` as harness-owned product-conflicting implementation paths.
- Validator enforces `PLN-06` must-fail items and documents warn/document-only boundaries.
- New optional profiles are present and wired into packet readiness/evidence rules.
- Review report states that no essential readiness item from `PLN-06` was deferred.

## 11. Open Questions
- None for implementation start.

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | yes | user | approved | PLN-06 approved as core/profile reusable work |
| Optional profile evidence approval | no | Codex | not-needed | Profiles are authored, not activated for a project |
| Detailed function agreement | yes | user | approved | User requested full implementation after review |
| Detailed UI/UX agreement | no | Codex | not-needed | No product UI |
| Environment topology approval | no | Codex | not-needed | No cutover target |
| Domain foundation approval | no | Codex | not-needed | No product DB design |
| Authoritative source disposition approval | yes | user | approved | PLN-06 review feedback incorporated |
| Ready For Code sign-off | yes | user | approved | "작업 진행해" |

## 13. Implementation Notes
- Prefer moving harness runtime under a harness-owned path and leaving root package/test entrypoints only as compatibility wrappers.
- Keep product source roots project-selectable.
- Keep command behavior conservative and explainable.
- Preserve existing PMW/migration/cutover behavior unless wrapping paths is required.
- Do not hand-edit generated docs except through the established generation path.

## 14. Verification Plan
- Run root tests.
- Run starter tests.
- Run root validator.
- Run starter validator behavior check.
- Run `doctor`, `status`, `next`, `explain`, and `validation-report`.
- Verify root/starter sync classification and no unsynchronized reusable changes.

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: approve
- Implementation delta summary: moved harness runtime/tests under `.harness/`, added standalone operator commands, validation reports, structured task truth, layout ownership, active profile contract, PRF-04/05/06 profiles, packet readiness fields, validator enforcement, and starter sync validation.
- Source parity result: aligned with `reference/planning/PLN-06_STANDALONE_BUSINESS_HARNESS_V1_1.md`.
- Refactor / residual debt disposition: no essential V1.1 readiness debt deferred; optional enhancements remain explicitly non-essential.
- UX conformance result: not applicable
- Topology / schema conformance result: not applicable
- Validation / security / cleanup evidence: root `npm test` pass, starter `npm test` pass, root `harness:validate` pass, starter untouched validator returns `starter_bootstrap_pending`, operator commands verified, validation report persisted.
- Deferred follow-up item: none allowed for essential readiness
- Improvement candidate reference: none
- Proposed target layer: core + optional profile
- Promotion status / linked follow-up item: not applicable
- Closeout notes: V1.1 standalone business harness readiness is implemented and review evidence is recorded in `reference/artifacts/REVIEW_REPORT.md`.

## 16. Reopen Trigger
- Any essential `PLN-06` requirement proves infeasible in this lane.
- Root/starter sync cannot be verified.
- Command acceptance levels require scope change.
- Validator must-fail implementation reveals a conflict with existing core contracts.
