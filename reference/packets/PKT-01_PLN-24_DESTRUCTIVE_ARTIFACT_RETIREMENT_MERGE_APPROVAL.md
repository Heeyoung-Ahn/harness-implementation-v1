# PKT-01 PLN-24 Destructive Artifact Retirement / Merge Approval

## Purpose
- Open the separate Planner approval surface for final destructive artifact retirement / merge after `PLN-23` cutover execution closeout.
- Define the inbound-reference scan, migration / tombstone / exemption disposition criteria, execution target, rollback boundary, and verification evidence required before any destructive action.
- Keep destructive artifact deletion, artifact merge, tombstone application, and starter/release payload mutation blocked until the user explicitly approves execution.

## Approval Rule
- This packet is planning / approval only.
- User requested opening this approval packet on 2026-05-17.
- User approved the inbound-reference scan criteria and `migration` / `tombstone` / `exemption` / `hold` disposition criteria on 2026-05-17.
- User approved the execution target, rollback boundary, `Ready For Code`, and destructive artifact retirement / merge execution for this packet on 2026-05-17.
- `Ready For Code` is approved.
- Developer may execute only the approved root-first retirement / merge lane after the same-turn scan, disposition table, rollback evidence, and freshness gate pass with no `hold` items.
- Release packaging and downstream project mutation remain not approved.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | PLN-24 Destructive artifact retirement / merge approval | `PLN-23` cutover is closed; final retirement is now approved for execution under this packet's gates | approved |
| Ready For Code | approved | user approved execution after scan/disposition criteria were approved | approved |
| Human sync needed | yes | deletion / merge / tombstone work changes retained governance artifact availability | approved |
| Gate profile | contract | reusable harness authority, generated compatibility views, starter payload, and operator re-entry surfaces are affected | approved |
| User-facing impact | high | operators and AIs may lose or be redirected away from compatibility artifacts after retirement | approved |
| Layer classification | core | reusable harness operating model, not product-specific behavior | approved |
| Active profile dependencies | none | no optional profile is active | not-needed |
| Profile evidence status | not-needed | no profile-specific evidence is required | not-needed |
| UX archetype status | approved | existing harness operator-console context remains the UX basis | approved |
| UX deviation status | none | no product UI deviation is proposed | not-needed |
| Environment topology status | approved | scan/disposition criteria, execution target, rollback boundary, and freshness gates are approved | approved |
| Domain foundation status | not-needed | no product domain data schema is changed | not-needed |
| Authoritative source intake status | approved | user explicitly requested a separate approval packet for this final lane | approved |
| Shared-source wave status | not-needed | single follow-up approval lane | not-needed |
| Packet exit gate status | approved | Developer execution, Tester verification, and Reviewer closeout evidence exist; Planner closeout remains | approved |
| Existing system dependency | none | no external product system dependency is touched | not-needed |
| New authoritative source impact | analyzed | user request opens a new approval surface without execution approval | approved |
| Risk if started now | high | execution is approved but still blocked by same-turn scan, disposition, rollback, and freshness gates | approved |

## Lane-Typed Minimum Contract
- Lane-type declaration:
  planning
- Lane-type universal minimum sections:
  Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger
- Lane-type required sections:
  Purpose; Approval Rule; Quick Decision Header; Human Sync / Approval Boundary; Verification Manifest
- Lane-type conditional sections:
  User execution approval must close before `Ready For Code`
- Lane-type not-needed sections:
  optional profile evidence, product domain foundation, and product UI design

## Goal
- Prepare the approval basis for final destructive artifact retirement / merge after `PLN-23` cutover closeout.
- Define the minimum evidence needed to safely decide whether each retirement candidate is migrated, tombstoned, exempted, or held.
- Preserve the current operating baseline until the user explicitly approves execution.

## Non-Goal
- Do not execute artifact deletion, merge, rename, tombstone, or release packaging in this planning packet.
- Do not mutate `standard-template` or downstream project repositories as part of this packet draft.
- Do not treat the existence of this packet as execution approval.
- Do not remove compatibility views until inbound references and rollback are proven.

## In Scope
- Define retirement candidate classes.
- Define inbound-reference scan scope and pass criteria.
- Define `migration`, `tombstone`, `exemption`, and `hold` disposition criteria.
- Define execution target and non-targets.
- Define rollback boundary and freshness gate.
- Define required Developer / Tester / Reviewer / Planner evidence if execution is later approved.

## Out Of Scope
- Actual destructive retirement / merge execution.
- Actual tombstone file creation or deletion.
- Release package rebuild or publication.
- Downstream project mutation.
- Product-specific app behavior.

## Data / Source Impact
- Layer classification: core.
- UX archetype reference: `.agents/rules/HARNESS_OPERATING_CONTRACT.md`.
- Selected UX archetype: operator-console-context.
- Archetype fit rationale: artifact retirement affects operator and AI re-entry behavior, not product UI.
- Required reading before code: `.agents/runtime/ACTIVE_CONTEXT.json`; `.agents/artifacts/REQUIREMENTS.md`; `.agents/artifacts/IMPLEMENTATION_PLAN.md`; `reference/packets/PKT-01_PLN-22_OPERATIONAL_AUTHORITY_REBUILD_AND_HARNESS_RESET.md`; `reference/artifacts/PLN-22_ARTIFACT_REFERENCE_DISPOSITION.md`; `reference/packets/PKT-01_PLN-23_CUTOVER_EXECUTION_APPROVAL.md`; `reference/artifacts/PLN-24_ARTIFACT_RETIREMENT_DISPOSITION.md`; `reference/artifacts/REVIEW_REPORT.md`; this packet.
- Environment topology reference: this packet.
- Source environment: maintainer root plus `standard-template`.
- Target environment: repo-local harness governance artifacts, generated/on-demand re-entry surfaces, starter payload surfaces, and retained compatibility views.
- Execution target: root repo `C:\Newface\30 Github\harness-implementation-v1` first; `standard-template` only if the approved disposition explicitly requires starter parity mutation.
- Transfer boundary: none.
- Rollback boundary: before any approved execution, capture restorable evidence for root `.harness/operating_state.sqlite`, `.agents/runtime/ACTIVE_CONTEXT.*`, `.agents/runtime/generated-state-docs/*`, `.agents/artifacts/VALIDATION_REPORT.*`, retained live planning artifacts, and every candidate file that will be deleted, merged, or tombstoned.
- DB / state impact: possible artifact index, work-item evidence, generated-doc, validation-report, and Active Context updates; no product DB is touched.
- Markdown / docs impact: retired compatibility artifacts may be replaced by tombstones or generated/on-demand references only after approval.
- generated docs impact: generated compatibility docs and Active Context must regenerate cleanly after any approved execution.
- validator / cutover impact: validator, validation-report, context, status, and cutover-preflight must pass before and after execution.
- Authoritative source intake reference: user request on 2026-05-17, "`inbound-reference scan, migration / tombstone / exemption 처리 기준을 포함한 별도 Planner approval packet을 열어`"
- Authoritative source disposition: incorporated as a pending approval packet only.
- Existing plan conflict: none; this follows the `PLN-22` / `PLN-23` separate approval rule.
- Current implementation impact: planning packet opened; scan and disposition criteria are approved; execution is approved only after same-turn scan, disposition, rollback, and freshness gates pass.
- Impacted packet set scope: single follow-up packet after `PLN-23`.
- Closeout risk tier: high-risk.

## Retirement Candidate Classes
- Generated compatibility views:
  - `.agents/artifacts/CURRENT_STATE.md`
  - `.agents/artifacts/TASK_LIST.md`
  - root `CURRENT_STATE.md`
  - root `TASK_LIST.md`
- Generated runtime outputs:
  - `.agents/runtime/generated-state-docs/*`
  - `.agents/runtime/ACTIVE_CONTEXT.*`
  - `.agents/runtime/reports/*`
  - `.agents/runtime/recovery-reports/*`
  - `.agents/runtime/agent-traces/*`
- Starter payload excluded runtime outputs:
  - `standard-template/.agents/runtime/generated-state-docs/*`
  - `standard-template/.agents/runtime/ACTIVE_CONTEXT.*`
  - `standard-template/.agents/runtime/reports/*`
  - `standard-template/.agents/runtime/recovery-reports/*`
  - `standard-template/.agents/runtime/agent-traces/*`
  - `standard-template/.harness/operating_state.sqlite`
- Retained canonical artifacts are not retirement candidates unless a later packet explicitly promotes them:
  - `.agents/artifacts/REQUIREMENTS.md`
  - `.agents/artifacts/ARCHITECTURE_GUIDE.md`
  - `.agents/artifacts/IMPLEMENTATION_PLAN.md`
  - `.agents/artifacts/PROJECT_PROGRESS.md`
  - `.agents/artifacts/PREVENTIVE_MEMORY.md`
  - active packets, review reports, walkthroughs, and manuals

## Inbound-Reference Scan Criteria
- Required scan scope:
  - repository root tracked and untracked text files, excluding `.git`, dependency folders, binary files, generated package output, and explicitly approved archive folders
  - `standard-template`
  - installer, packaging, manuals, workflow contracts, runtime scripts, tests, packet templates, active packets, review/walkthrough evidence, and generated-doc recovery code
- Required search terms:
  - exact candidate paths
  - basename references such as `CURRENT_STATE.md`, `TASK_LIST.md`, `ACTIVE_CONTEXT.md`, `ACTIVE_CONTEXT.json`, `generated-state-docs`, `CUTOVER_PRECHECK`, `agent-traces`, `recovery-reports`, and `.harness/operating_state.sqlite`
  - old write-path language that treats retired Markdown as canonical write authority
- Pass criteria:
  - every inbound reference is classified as `migrate`, `tombstone`, `exempt`, or `hold`
  - no unclassified live reference remains
  - no required workflow/manual/bootstrap/runtime/test reference points to a deleted artifact without a migration or tombstone target
  - starter payload references distinguish copied-project runtime generation from maintainer-local runtime artifacts
- Hold criteria:
  - reference owner is unclear
  - reference is in executable runtime/test path and no replacement is defined
  - reference is in starter onboarding and could affect copied-project first run
  - reference is in review evidence but not clearly historical

## Disposition Criteria
- `migration`:
  - use when a live reference still needs the information or behavior
  - must identify old reference, new target, affected files, and validation proof
  - acceptable targets include `ACTIVE_CONTEXT.*`, `.harness/operating_state.sqlite` APIs, generated-on-demand commands, `reference/artifacts/PLN-22_ARTIFACT_REFERENCE_DISPOSITION.md`, or retained canonical artifacts
- `tombstone`:
  - use when the old path must remain discoverable but should no longer hold live content
  - tombstone must state the new source of truth, regeneration command when applicable, and no-manual-edit rule
  - tombstone must be short, deterministic, and safe for both root and starter if shipped
- `exemption`:
  - use when a reference is historical, test fixture text, review evidence, archive evidence, or intentional documentation of past behavior
  - exemption must include reason, owner, and why it does not create live runtime dependency
- `hold`:
  - use when a reference cannot be safely classified
  - any `hold` blocks destructive execution

## Proposed Execution Target
- Primary mutation target after later approval:
  - root candidate files and root reference migrations
  - root `.harness/operating_state.sqlite` metadata only if needed to record final closeout
  - root Active Context / validation-report / generated-state docs
- Conditional mutation target after later approval:
  - `standard-template` only for starter parity changes that are explicitly listed in the approved disposition table
- Explicit non-targets:
  - product source code
  - downstream project repositories
  - release publication
  - package registry publishing
  - unrelated governance docs

## Proposed Rollback Boundary
- Required before execution approval can be used:
  - fresh `git diff --name-status` and candidate file inventory
  - rollback copy or restorable patch evidence for every delete / merge / tombstone target
  - root and starter validation pass before execution
  - `cutover-preflight.rollbackBundle.missingPaths: []`
  - `cutover-preflight.rollbackBundle.needsOperatorBackup: false`, or an explicit operator backup path if it is true
- Rollback trigger:
  - validator fails after execution
  - Active Context is stale, blank, or route-incoherent after execution
  - starter bootstrap or payload tests fail
  - any unapproved file deletion, merge, or tombstone is detected
  - any inbound reference remains unclassified
- Rollback proof:
  - restore candidate files / DB / generated surfaces
  - rerun `node .harness/runtime/state/dev05-cli.js context`
  - rerun `node .harness/runtime/state/dev05-cli.js validate`
  - rerun `node .harness/runtime/state/dev05-cli.js validation-report`
  - rerun targeted root and starter regression suites

## Proposed Freshness Gate
- Freshness window:
  - all scan, disposition, rollback, and validation evidence must be produced in the same Developer execution turn immediately before any later-approved destructive mutation
  - if any packet, runtime, workflow, manual, generated doc, validation report, starter payload, or candidate file changes after the scan, rerun the whole scan and gate
- Required root evidence before later-approved execution:
  - inbound-reference scan report with every reference classified
  - candidate disposition table with `migration`, `tombstone`, `exemption`, or `hold`
  - `node --test .harness/test/starter-payload-contract.test.js .harness/test/bootstrap-runtime.test.js .harness/test/dev05-tooling.test.js .harness/test/workflow-governance.test.js`
  - `npm.cmd test`
  - `node .harness/runtime/state/dev05-cli.js validate`
  - `node .harness/runtime/state/dev05-cli.js validation-report`
  - `node .harness/runtime/state/dev05-cli.js context`
  - `node .harness/runtime/state/dev05-cli.js cutover-preflight`
- Required `standard-template` evidence before later-approved execution:
  - `node --test .harness/test/dev05-tooling.test.js .harness/test/workflow-governance.test.js`
  - `npm.cmd test`
  - `node .harness/runtime/state/dev05-cli.js validate`
  - `node .harness/runtime/state/dev05-cli.js validation-report`
  - `node .harness/runtime/state/dev05-cli.js context`
  - `node .harness/runtime/state/dev05-cli.js cutover-preflight`

## Detailed Behavior
- Trigger:
  - user asked to open this Planner approval packet.
- Main flow:
  - Planner opens this packet with execution blocked.
  - Planner presents inbound-reference scan and disposition criteria.
  - User decides whether to approve destructive execution later.
  - If approved later, Developer performs scan and classifies every inbound reference.
  - Developer executes only approved migrations / tombstones / exemptions, with no `hold` items.
  - Tester verifies root and starter behavior.
  - Reviewer approves high-risk closeout.
  - Planner records closeout and returns to hold.
- Error / hold flow:
  - any unclassified reference, failed validation, unclear rollback, or ambiguous candidate keeps `Ready For Code` on hold.

## Acceptance
- This packet exists under `reference/packets/`.
- The packet is registered as the active Planner packet.
- `Ready For Code` remains on hold.
- Inbound-reference scan criteria are explicit.
- `migration`, `tombstone`, `exemption`, and `hold` criteria are explicit.
- Execution target, rollback boundary, freshness gate, and human approval boundary are explicit.
- Destructive artifact retirement / merge execution remains blocked until separate explicit user approval.
- `harness:validate`, `harness:validation-report`, and `ACTIVE_CONTEXT` remain clean after opening the packet.

## Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Open approval packet | yes | user | approved | User requested packet opening on 2026-05-17 |
| Ready For Code sign-off | yes | user | approved | Approved on 2026-05-17 |
| Destructive artifact retirement / merge execution approval | yes | user | approved | Approved on 2026-05-17, subject to no `hold` items after scan |
| Inbound-reference scan criteria approval | yes | user / Planner | approved | User approved criteria on 2026-05-17 |
| Migration / tombstone / exemption criteria approval | yes | user / Planner | approved | User approved disposition criteria on 2026-05-17 |
| Execution target approval | yes | user / Planner | approved | Root first; starter conditional only |
| Rollback boundary approval | yes | Planner / Reviewer | approved | Must be proven concrete before execution |
| Packet exit quality gate approval | yes | Reviewer / Planner | pending | Required after execution and verification |

## Verification Plan
- Gate profile:
  - contract
- Verification scenario reminder:
  - normal: every inbound reference is classified, approved migrations/tombstones/exemptions execute, and root/starter validation remains clean
  - error: any unclassified reference or failed validator blocks execution
  - permission: destructive execution cannot start without explicit user approval
  - regression: root and `standard-template` targeted/full suites still pass
  - manual check: confirm only approved files were deleted, merged, or tombstoned
  - evidence location: scan report, disposition table, validation reports, Active Context, walkthrough, review report, and this packet

## Verification Manifest
- Ready For Code: approved, subject to same-turn scan / disposition / rollback / freshness proof.
- root: run root targeted and full tests before and after any later-approved execution.
- standard-template: run starter targeted and full tests before and after any later-approved execution.
- inbound-reference scan: required before any execution.
- disposition table: every reference and candidate must be `migration`, `tombstone`, `exemption`, or `hold`; any `hold` blocks execution.
- validator: run root and `standard-template` validators before handoff and after execution.
- active context: regenerate and verify `ACTIVE_CONTEXT.json` / `ACTIVE_CONTEXT.md` after every state-changing step.
- review closeout: high-risk Reviewer closeout is required before Planner closeout.
- rollback bundle: root rollback bundle and candidate-file rollback evidence must be concrete before execution.
- destructive retirement: approved for this packet only after no `hold` items remain.

## Developer Execution Evidence
- Evidence artifact: `reference/artifacts/PLN-24_ARTIFACT_RETIREMENT_DISPOSITION.md`.
- Same-turn inbound-reference scan completed on 2026-05-17.
- Scan classified every remaining inbound reference as `migration`, `exempt`, `already-excluded`, or `not-needed`; `hold` count is 0.
- Migration executed: root and `standard-template` `day_start` skill wording now routes live execution recovery through `.agents/runtime/ACTIVE_CONTEXT.json` plus operational DB state, while `.agents/artifacts/CURRENT_STATE.md` remains a generated compatibility fallback only.
- Physical deletion / merge execution result: no files were deleted or merged. The approved destructive lane executed as a no-op physical retirement because every candidate was either a live generated compatibility/recovery/evidence surface, an Active Context re-entry surface, or a starter-local runtime output already excluded from copied starter payloads.
- Tombstone execution result: none required. Existing compatibility views already contain generated fallback/no-manual-edit wording and remain validated runtime outputs.
- Rollback evidence: pre-execution `git diff --name-status` was captured; root `cutover-preflight` reported `rollbackBundle.missingPaths: []` and `rollbackBundle.needsOperatorBackup: false`; no deleted candidate requires restore.
- Pre-execution freshness evidence passed: root targeted tests, `standard-template` targeted tests, root `npm.cmd test`, and `standard-template` `npm.cmd test`.
- Post-execution evidence passed: root and `standard-template` targeted tests, full suites, validators, validation reports, Active Context regeneration, and cutover-preflight all passed.

## Refactor / Residual Debt Disposition
- Refactor completed: none in this planning packet.
- Residual debt: physical deletion / merge is not safe or required after same-turn scan; retained candidates are documented exemptions or already-excluded starter payload outputs.
- Deferred cleanup: none inside the approved `PLN-24` boundary.
- Follow-up item: Tester verification, Reviewer closeout, and Planner closeout.

## 15. Packet Exit Quality Gate
- Packet exit metadata version: v1
- Packet exit metadata gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata exit recommendation: approve
- Packet exit metadata source parity result: aligned
- Packet exit metadata validation / security / cleanup evidence: complete
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: approve
- Implementation delta summary: scan/disposition evidence recorded; two `day_start` skill references migrated away from old live-truth wording; no physical deletion or merge was safe after classification.
- Source parity result: aligned
- Refactor / residual debt disposition: no remaining `hold`; retained candidates are exempt compatibility, recovery, evidence, or starter-excluded runtime surfaces.
- UX conformance result: not-needed
- Topology / schema conformance result: proposed scan, disposition, target, and rollback boundaries require approval
- Validation / security / cleanup evidence: complete
- Deferred follow-up item: none
- Closeout notes: Reviewer approved packet exit; Planner closeout reflection is recorded in this packet and the terminal planner hold transition.

## Open Questions
- None. Execution is approved subject to same-turn scan, disposition, rollback, and freshness proof.

## Reopen Trigger
- User changes the approval boundary.
- Candidate file list changes.
- Inbound-reference scan finds unclassified or conflicting references.
- Validator, preflight, test, or Active Context evidence becomes stale or fails.
- Starter payload requirements change.
