# PKT-01 OPS-25 HARNESS Manual Recent Work Reconciliation

## Purpose
- Reconcile the shipped reusable `HARNESS_MANUAL.md` surfaces with the approved reusable workflow/contract changes completed on 2026-05-14 and 2026-05-15.
- Review yesterday/today work detail before editing so the manual reflects real recent changes instead of stale maintainer-era assumptions.
- Reflect the 2026-05-15 evaluation feedback about starter-mode naming drift, pre-init `ACTIVE_CONTEXT` interpretation, and maintainer-vs-installed starter wording without broadening into runtime cleanup.
- Keep the scope manual-only while preserving root / `standard-template` parity and the current truth hierarchy.

## Approval Rule
- This packet starts in Planner workflow.
- This packet is limited to reusable manual reconciliation and consistency repair.
- This packet may update root and `standard-template` manual wording only inside the approved manual-only scope.
- This packet must not change runtime logic, workflow authority, validator behavior, DB hot-state, packaging behavior, or starter payload logic.
- Manual wording must remain explanatory and must not replace `.agents/rules/HARNESS_OPERATING_CONTRACT.md`, `.agents/workflows/*`, `.agents/artifacts/*`, packet status, or DB hot-state.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-25 HARNESS manual recent-work reconciliation | the manual should reflect the actual reusable baseline after the 2026-05-14 and 2026-05-15 changes | approved |
| Ready For Code | approved | the user explicitly requested packet opening and manual correction now; scope stays manual-only | approved |
| Human sync needed | yes | shipped human-facing guidance is being edited and must stay aligned with workflow authority | approved |
| Gate profile | contract | this changes reusable manual guidance and requires root / `standard-template` parity | approved |
| User-facing impact | medium | operators use this manual to decide what to read, what to trust, and when to stop | approved |
| Layer classification | core | this updates reusable harness guidance, not one downstream project | approved |
| Active profile dependencies | none | no optional profile is active for this manual-only lane | not-needed |
| Profile evidence status | not-needed | no profile-specific evidence is required for this scope | not-needed |
| UX archetype status | approved | the existing human-facing operating-manual archetype is sufficient | approved |
| UX deviation status | none | no product UI or archetype deviation is involved | not-needed |
| Environment topology status | not-needed | no deploy/test/cutover topology changes are included | not-needed |
| Domain foundation status | not-needed | no data-impact or schema work is included | not-needed |
| Authoritative source intake status | approved | the user request and the approved 2026-05-14/2026-05-15 reusable changes define the source set | approved |
| Shared-source wave status | not-needed | this is a single-packet manual reconciliation lane | not-needed |
| Packet exit gate status | approved | manual parity, validator evidence, and reviewer-assessed consistency repair are complete | approved |
| Improvement promotion status | none | this is direct reconciliation work, not preventive-memory promotion | not-needed |
| Existing system dependency | none | no external product/system dependency is touched | not-needed |
| New authoritative source impact | analyzed | recent approved workflow/contract/manual changes and the 2026-05-15 user request must be reflected together | approved |
| Risk if started now | medium | stale authority wording or stale profile guidance could misdirect operators even without runtime regressions | approved |

## Lane-Typed Minimum Contract
- Lane-type declaration: planning
- Lane-type universal minimum sections: Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger
- Lane-type required sections: Detailed agreement; manual consistency checklist; root / `standard-template` parity; source trace to approved 2026-05-14 and 2026-05-15 reusable changes
- Lane-type conditional sections: Active Context evidence and validation-report refresh are required only if state or generated artifacts are touched
- Lane-type not-needed sections: product UI, domain foundation, environment topology, release packaging, and profile-specific evidence

## 1. Goal
- Update the reusable root and `standard-template` `HARNESS_MANUAL.md` surfaces so they accurately describe the current reusable operating contract, context artifacts, profile guidance, and test/review expectations after the latest closed follow-up work.

## 2. Non-Goal
- Do not change runtime commands, workflow files, validator behavior, DB schema/state operations, starter payload composition, or release packaging.
- Do not reopen `PLN-17`, workflow redesign, or broader manual-structure redesign.
- Do not turn the manual into a second authority layer.

## 3. User Problem And Expected Outcome
- Current problem:
  The manual was expanded on 2026-05-15, but it still omits or compresses some of the reusable truth changes that landed around the operating-contract split, long-term context artifact relocation, review/test contract tightening, and current approved profile catalog.
- Expected outcome:
  An operator can read the manual and correctly understand which artifacts are authority, where long-term context now lives, what Tester/Reviewer actually prove, how packet opening should be prepared, and which profile guidance is current.

## 4. In Scope
- Review 2026-05-14 and 2026-05-15 recent work detail relevant to the manual.
- Update the root and `standard-template` `reference/manuals/HARNESS_MANUAL.md` files.
- Correct stale authority-path wording around `.agents/rules/HARNESS_OPERATING_CONTRACT.md`, `.agents/artifacts/*`, `.agents/runtime/*`, and `reference/*`.
- Add or refine artifact-map guidance for `DOMAIN_CONTEXT.md`, `SYSTEM_CONTEXT.md`, `PROJECT_HISTORY.md`, `PREVENTIVE_MEMORY.md`, `WALKTHROUGH.md`, and `PACKET_EXIT_QUALITY_GATE.md` where useful.
- Align testing/review wording to the current `test.md` and `review.md` contracts.
- Reconcile profile guidance with the current approved reusable baseline.
- Clarify that manual-facing `starter mode` labels are shorthand while packet/runtime/validator use gate profile ids such as `light`, `standard`, `contract`, and `release`.
- Clarify that starter-shipped `ACTIVE_CONTEXT.*` can be a pre-init placeholder surface and must be regenerated after `harness:init` or `harness:context`.
- Clarify the operator-facing distinction between maintainer-repo shared runtime/test surfaces and the installed starter's actual first-read/runtime contract.

## 5. Out Of Scope
- Runtime implementation.
- Workflow-file mutation.
- Validator enforcement changes.
- Packet template redesign.
- New profile creation or profile approval-state changes.
- Product-specific starter customization.
- Formal `PREVENTIVE_MEMORY` trigger/promotion contract changes.
- Runtime or payload removal of maintainer-aware release/sync logic from shipped starter files.

## 6. Detailed Behavior
- Trigger:
  The user asked on 2026-05-15 to open a new planner packet, inspect yesterday/today work detail, and update `HARNESS_MANUAL.md`.
- Main flow:
  1. Read the required Planner SSOT and recent 2026-05-14/2026-05-15 change evidence.
  2. Identify stale or missing manual guidance introduced by recent reusable changes.
  3. Patch root and `standard-template` manuals in parity.
  4. Run parity and validator checks.
  5. Summarize the recent-work-driven manual changes and residual gaps.
- Alternate flow:
  If the needed correction would change runtime, workflow authority, or profile-approval truth, stop and reopen planning instead of patching the manual.
- Error state:
  If manual wording contradicts `.agents/rules/HARNESS_OPERATING_CONTRACT.md`, current workflow contracts, or current canonical state artifacts, hold closeout until the wording is corrected.
- Loading/transition:
  Planner packet opening should happen through the approved helper and must keep the current stage in planning.

## 7. Program Function Detail
- 입력:
  recent reusable change history, current manual surfaces, current workflow contracts, and current operating contract
- 처리:
  manual-only wording reconciliation and consistency repair
- 출력:
  updated root/starter manuals plus verification evidence
- 권한/조건:
  manual mutation only; no runtime/state authority mutation
- edge case:
  if a section implies a broader policy change than the closed recent packets support, defer that change instead of broadening scope silently

## 8. UI/UX Detailed Design
- Active profile references: not-needed
- Profile composition rationale: not-needed
- Profile-specific UX / operation contract: not-needed
- Primary admin entity / surface: not-needed
- Grid interaction model: not-needed
- Search / filter / sort / pagination behavior: not-needed
- Row action / bulk action rule: not-needed
- Edit / save / confirm / audit pattern: not-needed
- Profile deviation / exception: none
- UX archetype reference: not-needed
- Selected UX archetype: not-needed
- Archetype fit rationale: this is human-facing manual copy only
- Archetype deviation / approval: none
- 영향받는 화면: root and starter manual surfaces only
- 레이아웃 변경: documentation structure only
- interaction: operator reading, packet opening, testing, and review guidance
- copy/text: Korean-first, direct, action-oriented, and explicit about authority boundaries
- feedback/timing: not-needed
- source trace fallback: use approved workflow/contract packets and current SSOT instead of inventing new rules

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale: this updates the reusable manual baseline shared by root and starter
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `.agents/artifacts/CURRENT_STATE.md`; `.agents/artifacts/TASK_LIST.md`; `.agents/artifacts/REQUIREMENTS.md`; `.agents/artifacts/ARCHITECTURE_GUIDE.md`; `.agents/artifacts/IMPLEMENTATION_PLAN.md`; `.agents/rules/HARNESS_OPERATING_CONTRACT.md`; `.agents/workflows/plan.md`; `.agents/workflows/test.md`; `.agents/workflows/review.md`; `reference/manuals/HARNESS_MANUAL.md`; `standard-template/reference/manuals/HARNESS_MANUAL.md`; `standard-template/README.md`; `reference/packets/PKT-01_OPS-17_OPERATOR_GLOSSARY_PROFILE_RESET_AND_SAFE_FIX_GUIDANCE.md`; `reference/packets/PKT-01_PLN-19_STANDARD_TEMPLATE_DOWNSTREAM_APP_READINESS_REBASELINE.md`
- Environment topology reference: not-needed
- Source environment: local reusable repo
- Target environment: local reusable repo and shipped starter manual surface
- Execution target: root and `standard-template` manual files
- Transfer boundary: not-needed
- Rollback boundary: revert only the manual wording if validator or parity review fails
- Domain foundation reference: not-needed
- Schema impact classification: none
- DB / state 영향: planner packet opening updates active work state; manual edits should not change DB schema or state logic
- Markdown / docs 영향: root and starter `HARNESS_MANUAL.md` files are expected to change
- generated docs 영향: Active Context and validation report may refresh through approved commands if needed
- validator / cutover 영향: validator should remain verification-only for this lane
- Authoritative source refs: `.agents/rules/HARNESS_OPERATING_CONTRACT.md`; `.agents/workflows/test.md`; `.agents/workflows/review.md`; `.agents/artifacts/CURRENT_STATE.md`; `.agents/artifacts/TASK_LIST.md`; `reference/packets/PKT-01_OPS-17_OPERATOR_GLOSSARY_PROFILE_RESET_AND_SAFE_FIX_GUIDANCE.md`; `reference/packets/PKT-01_PLN-19_STANDARD_TEMPLATE_DOWNSTREAM_APP_READINESS_REBASELINE.md`
- Authoritative source intake reference: the 2026-05-15 user request plus the approved reusable changes recorded in current canonical state and packet history
- Authoritative source disposition: implement the approved manual-only reconciliation and defer broader workflow/runtime redesign
- New planning source priority / disposition: manual consistency repair is explicitly prioritized by the user over the previously deferred next lane
- Existing plan conflict: the manual currently understates the operating-contract split and some current operator-facing workflow guidance
- Current implementation impact: manual files only
- Required rework / defer rationale: any runtime or workflow-authority implication stays deferred
- Impacted packet set scope: single-packet
- Authoritative source wave ledger reference: not-needed
- Source wave packet disposition: not-needed
- Existing program / DB dependency: none
- Product source root: not-needed
- Product test root: not-needed
- Product runtime requirements: unchanged
- Harness/product boundary exceptions: none

## 10. Acceptance
- The manual no longer implies that `.agents/artifacts/*` alone owns reusable operating rules; `.agents/rules/HARNESS_OPERATING_CONTRACT.md` is clearly placed in the authority map.
- The manual explains `DOMAIN_CONTEXT.md`, `SYSTEM_CONTEXT.md`, and `PROJECT_HISTORY.md` as project context artifacts rather than current execution truth.
- The manual identifies `PREVENTIVE_MEMORY.md`, `WALKTHROUGH.md`, and `PACKET_EXIT_QUALITY_GATE.md` in the operator-facing artifact map where useful.
- Packet-opening guidance reflects the current reusable preflight expectation without redefining helper internals as workflow authority.
- Testing and review guidance matches the current `test.md` and `review.md` contracts: Tester proves tested vs untested behavior and does not fix defects; Reviewer judges packet-close readiness, requirements/acceptance fit, regression risk, and applicable security-sensitive behavior.
- Profile guidance no longer suggests a stale default catalog.
- The manual explains that `minimal` / `standard` / `full-governance` are human-facing shorthand and maps them to the actual gate profile ids used by packet headers and validator output.
- The manual explains that starter-shipped `ACTIVE_CONTEXT.*` may be placeholder output before init and must be regenerated for project-local truth.
- The manual explains the maintainer-repo vs installed-starter reading boundary so operators do not over-read absent `installer/`, `packaging/`, or nested `standard-template/` paths inside a copied project.
- Root and `standard-template` manual surfaces remain synchronized.

## 11. Open Questions
- None for `OPS-25` closeout. User approved the next-lane order on 2026-05-15: maintainer / starter separation first, explicit `PREVENTIVE_MEMORY` promotion/trigger criteria second, onboarding UX cleanup third.
- The immediate next draft lane is `reference/planning/PLN-20_MAINTAINER_STARTER_BOUNDARY_AND_PAYLOAD_SEPARATION_DRAFT.md`.

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | yes | user/planner | approved | reusable core manual reconciliation only |
| Optional profile evidence approval | no | planner | not-needed | no active optional profile |
| Detailed function agreement | yes | user/planner | approved | user requested packet opening plus manual review/update now |
| Detailed UI/UX agreement | no | planner | not-needed | manual copy only |
| UX archetype / deviation approval | no | planner | not-needed | no product UI |
| Environment topology approval | no | planner | not-needed | no deploy/cutover work |
| Domain foundation approval | no | planner | not-needed | no data-impact work |
| DB design confirmation | no | planner | not-needed | no schema or data operation change |
| Authoritative source disposition approval | yes | user/planner | approved | reflect approved recent reusable changes and current canonical docs |
| New source incorporation decision | yes | user/planner | approved | the 2026-05-15 user request explicitly opens this lane |
| Source wave rebaseline approval | no | planner | not-needed | single-packet reconciliation lane |
| Packet exit quality gate approval | yes | reviewer | approved | parity, validator evidence, and manual consistency repair were reviewed and approved for closeout on 2026-05-15 |
| Improvement promotion decision | no | planner | not-needed | no preventive-memory promotion requested |
| Ready For Code sign-off | yes | user | approved | explicit user request to proceed with manual changes inside this packet boundary |

## 13. Implementation Notes
- Prefer narrow wording fixes over large structural rewrite.
- Keep the manual Korean-first and operator-oriented.
- Preserve root / `standard-template` parity.
- Do not broaden the manual into workflow-local implementation detail.
- Use recent actual change evidence from 2026-05-14 and 2026-05-15 rather than generic cleanup guesses.

## 14. Verification Plan
- Gate profile:
  contract
- Verification scenario reminder:
  - normal: operator can find updated authority map and current test/review guidance
  - error: manual does not promote derived artifacts or manual text to authority
  - permission: manual does not imply approval or role-separation bypass
  - regression: root and `standard-template` manuals stay synchronized
  - manual check: recent-work-driven corrections are visible and consistent
  - evidence location: validator output and parity check
- Required commands after implementation:
  - root/manual parity check between `reference/manuals/HARNESS_MANUAL.md` and `standard-template/reference/manuals/HARNESS_MANUAL.md`
  - root `node .harness/runtime/state/dev05-cli.js validate`
  - root `node .harness/runtime/state/dev05-cli.js validation-report` only if state or generated surfaces refresh

## Verification Manifest
- Gate profile:
  - contract: detailed agreement, Ready For Code, root sync, standard-template sync, targeted manual reconciliation check, validator, active context evidence when state or re-entry surfaces change, review closeout
- Required evidence:
  - detailed agreement approval
  - Ready For Code approval
  - root manual update evidence
  - standard-template manual update evidence
  - targeted manual reconciliation check
  - root validator
  - active context evidence when state or generated surfaces change
  - review closeout

## 15. Packet Exit Quality Gate
- Packet exit metadata version: v1
- Packet exit metadata gate reference:
  `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata exit recommendation:
  approved
- Packet exit metadata source parity result:
  approved
- Packet exit metadata validation / security / cleanup evidence:
  approved
- Packet exit quality gate reference:
  `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation:
  approved
- Implementation delta summary:
  the root and `standard-template` `HARNESS_MANUAL.md` surfaces now align the human-facing `starter mode` shorthand with the actual gate profile ids, warn that starter-shipped `ACTIVE_CONTEXT.*` can be pre-init placeholder output, and clarify the operator-facing boundary between maintainer-repo shared runtime/test surfaces and installed starter usage
- Source parity result:
  approved
- Refactor / residual debt disposition:
  keep runtime/payload separation, explicit `PREVENTIVE_MEMORY` trigger formalization, and later onboarding UX cleanup in follow-up planning lanes rather than broadening this manual-only packet
- UX conformance result:
  not-needed; no product UI
- Topology / schema conformance result:
  not-needed
- Validation / security / cleanup evidence:
  approved
- Deferred follow-up item:
  `PLN-20_MAINTAINER_STARTER_BOUNDARY_AND_PAYLOAD_SEPARATION`, later explicit `PREVENTIVE_MEMORY` trigger formalization lane, and later Lite / Standard onboarding UX cleanup lane
- Improvement candidate reference:
  2026-05-15 evaluation follow-up on maintainer/starter mixing and operator-facing startup ambiguity
- Proposed target layer:
  core
- Promotion status / linked follow-up item:
  approved / `reference/planning/PLN-20_MAINTAINER_STARTER_BOUNDARY_AND_PAYLOAD_SEPARATION_DRAFT.md`
- Closeout notes:
  reviewer-approved closeout on 2026-05-15 after confirming manual-only scope adherence, root / `standard-template` parity, clean validator state, accurate authority wording, and explicit defer of runtime/payload work to the next planning lane

## 16. Ready For Code Approval Text
Ready For Code is approved for `OPS-25` only for updating the root and `standard-template` `HARNESS_MANUAL.md` surfaces so they accurately reflect the approved 2026-05-14 and 2026-05-15 reusable operating/manual changes. Runtime logic, workflow-file authority, validator behavior, DB state logic, packaging, and profile-approval truth are out of scope.

## 17. Reopen Trigger
- The needed fix changes runtime behavior or workflow authority instead of manual wording.
- The correction would require profile-approval-state changes rather than documentation repair.
- Root and `standard-template` manual parity breaks.
- A new authoritative source changes the current manual-reconciliation target while this packet is still open.
