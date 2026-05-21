# PKT-01 OPS-29 Downstream Operator Friction P0/P1 Sequence

> PLANNING PACKET. This file is the approved scope, approval boundary, and closeout evidence surface for one work item.

## Purpose
- Capture real downstream operating friction observed while using this standard harness in `C:\Newface\10 Antigravity\15 ZionPath` and `C:\Newface\10 Antigravity\20 Financial Intelligence`.
- Convert only the recurring, core-relevant issues into a bounded P0/P1 implementation sequence.
- Avoid turning every downstream inconvenience into a core feature; optional/project-specific needs stay outside the P0 path.

## Approval Rule
- This packet records the user-approved improvement direction from 2026-05-22.
- This packet now authorizes `P0` code changes after the 2026-05-22 user approval.
- P0 must be implemented and verified before P1 starts.
- The user approved `P1` implementation on 2026-05-22 after P0 reviewer closeout.
- P1 must stay inside the approved lightweight scope and must not expand into a new governance model, mandatory ledger, or profile-specific test bundle without a separate packet.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-29 downstream operator friction P0/P1 sequence | real downstream harness use exposed repeated state, parser, and operator-UX friction | approved-for-planning |
| Ready For Code | approved | the user approved implementation start for the bounded P0 sequence and later approved bounded P1 implementation after P0 reviewer closeout on 2026-05-22 | approved |
| Human sync needed | yes | this changes reusable core runtime/operator surfaces and starter guidance | approved |
| Gate profile | contract | P0 touches reusable CLI/state/parser behavior and root/starter parity | approved |
| User-facing impact | none | this packet changes operator/runtime surfaces only and does not change any product UI/UX surface | not-needed |
| Layer classification | core | P0/P1 changes are reusable harness operation improvements, not project-only fixes | approved |
| Active profile dependencies | none | mobile SQLite/NetInfo support is deferred to an optional profile follow-up, not core | not-needed |
| Profile evidence status | not-needed | no active optional profile is required for the P0/P1 core sequence | not-needed |
| UX archetype status | not-needed | no product UI/UX surface is changed | not-needed |
| UX deviation status | none | no UX archetype deviation applies | not-needed |
| Environment topology status | not-needed | no deploy/cutover topology is changed | not-needed |
| Domain foundation status | not-needed | no product data/domain schema is changed | not-needed |
| Authoritative source intake status | approved | downstream repo observations are the source evidence for this improvement packet | approved |
| Shared-source wave status | not-needed | this packet does not rebaseline multiple open packets from a new source wave | not-needed |
| Packet exit gate status | pending | exit evidence must be produced after P0/P1 implementation and review | pending |
| Improvement promotion status | approved | repeated downstream friction is approved for a bounded core follow-up | approved |
| Existing system dependency | none | no external product system dependency is required | not-needed |
| New authoritative source impact | analyzed | source impact is limited to this packet and implementation plan | approved |
| Risk if started now | medium | P0 is bounded, but implementation must avoid over-automating P1/deferred ideas | accepted |

## Lane-Typed Minimum Contract
- Lane-type declaration:
  narrow-runtime
- Lane-type universal minimum sections:
  Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger.
- Lane-type required sections:
  P0/P1 sequence, downstream evidence, root/standard-template sync boundary, and explicit deferred items.
- Lane-type conditional sections:
  Optional profile evidence only if mobile/React Native support is reopened in a later profile packet.
- Lane-type not-needed sections:
  Product UI/UX, deployment topology, domain schema, shared-source wave, and project-specific test harness details.

## 1. Goal
- Reduce recurring operator friction without increasing the baseline governance burden.
- Make the first implementation pass focus on the narrow P0 fixes that remove real state/parser/status confusion.
- Keep P1 as lightweight documentation and recovery UX improvements after P0 is stable.

## 2. Non-Goal
- Do not redesign the DB state model.
- Do not introduce mandatory new ledgers in core.
- Do not turn preventive memory into a broad static-analysis framework in this packet.
- Do not bundle React Native/Expo SQLite or NetInfo mocks into core.
- Do not delete or hard-ban project-root planning files such as `task.md`; only warn about authority conflicts.

## 3. User Problem And Expected Outcome
- Current user problem: downstream agents can complete real work, but they lose time on state regeneration order, ambiguous status output, active-profile parsing drift, long commands, and root-vs-artifact status-file confusion.
- Expected outcome: operators get a shorter and safer P0 command path, clearer gate/status language, stricter active-profile parsing, and non-blocking warnings for root status-file drift.

## 4. In Scope
- P0-1: Add a single `harness:sync-state` style wrapper for the existing validate/report/context/status sequence.
- P0-2: Split status output into technical validation and workflow gate state.
- P0-3: Change active-profile parsing to read only the first table under `## Active Profile Table`.
- P0-4: Add a warning for ambiguous root progress/status files such as `task.md` or `walkthrough.md` when they conflict with canonical harness authority.
- P0-5: Add positional shorthand for existing transition usage, while keeping explicit target requirements for mutating `--apply`.
- P1-1: Add an official day-wrap template to the starter/reference surface.
- P1-2: Improve `context --repair` / recovery output with concrete next-command suggestions.
- P1-3: Add short top labels that distinguish authoritative, generated, human-summary, and packet files.
- P1-4: Define `plan-check` as a lightweight checklist/warning candidate, not a full new gate in this packet.

## 5. Out Of Scope
- Automatic preventive-memory linting against arbitrary source code.
- Core mobile SQLite / NetInfo mocking bundles.
- Mandatory open-question ledger enforcement.
- URL/path normalization in external IDE plugins or file-view tools.
- Broad generated-doc redesign.
- Any implementation that requires changing downstream product repos.

## 6. Detailed Behavior
- Trigger: operator edits governance artifacts, opens/closes a packet, or prepares a handoff.
- Main flow: P0 wrapper runs existing commands in a deterministic order and reports the exact next command if it fails.
- Alternate flow: status can pass technical validation while still showing a workflow gate block.
- Error state: parser or root-file ambiguity should produce actionable warnings, not silent misclassification or hard failure unless canonical truth is unsafe.
- Loading/transition: no new async state model is introduced.

## 7. Program Function Detail
- Input: existing CLI arguments, packet files, active profile docs, root/starter package scripts, runtime state store, and generated context/report surfaces.
- Processing: wrap existing commands, improve parsing boundaries, improve status labels, and add bounded warnings.
- Output: clearer CLI summaries, preserved generated artifacts, and starter-synced scripts/docs where reusable.
- Permissions/conditions: `--apply` transitions must still require explicit work item and target role; context inference is allowed only for non-mutating preview.
- Edge case: candidate profile tables must not become active profiles.

## 8. UI/UX Detailed Design
- Active profile references: not-needed.
- Profile composition rationale: not-needed.
- Profile-specific UX / operation contract: not-needed.
- UX archetype reference: not-needed.
- Selected UX archetype: not-needed.
- Archetype fit rationale: not-needed.
- Archetype deviation / approval: none.
- Affected surface: terminal CLI summaries and Markdown document headers only.
- Copy/text: use direct labels such as `Technical validation`, `Workflow gate`, `AUTHORITATIVE`, and `GENERATED, DO NOT EDIT`.

## 9. Data / Source Impact
- Layer classification: core for P0/P1 runtime and starter documentation; optional profile for deferred mobile testing support.
- Core / profile / project boundary rationale: repeated state/status/parser friction is reusable core behavior; NetInfo/SQLite mocking is profile-specific; root task files are downstream project hygiene and should be warned, not prohibited.
- Active profile dependencies: none.
- Profile-specific evidence status: not-needed
- Required reading before code: `.agents/runtime/ACTIVE_CONTEXT.json`; `.agents/artifacts/IMPLEMENTATION_PLAN.md`; `.agents/artifacts/PREVENTIVE_MEMORY.md`; `.harness/runtime/state/dev05-cli.js`; `.harness/runtime/state/dev05-tooling.js`; `.harness/test/dev05-tooling.test.js`; `package.json`; matching `standard-template` runtime/test/script surfaces; this packet.
- Authoritative source refs:
  - `C:\Newface\10 Antigravity\15 ZionPath`
  - `C:\Newface\10 Antigravity\20 Financial Intelligence`
- Authoritative source intake reference: downstream operator feedback from `C:\Newface\10 Antigravity\15 ZionPath` and `C:\Newface\10 Antigravity\20 Financial Intelligence`, reduced in this packet to bounded P0/P1 scope.
- Authoritative source disposition: analyzed and reduced to bounded P0/P1 core changes.
- Impacted packet set scope: single-packet `OPS-29`; previous closed packets remain historical evidence only.
- Existing plan conflict: none known; this packet continues the prior operation-friction reduction direction.
- Current implementation impact: P0 is closed and P1 implementation may now start inside the approved lightweight scope.
- Required rework / defer rationale:
  - preventive-memory linting is deferred because it can become an open-ended static-analysis framework.
  - mobile SQLite/NetInfo mocking is deferred because it belongs in an optional React Native/Expo/mobile profile.
  - open-question ledger is deferred because a mandatory ledger would increase baseline burden.
  - path normalization is deferred unless scoped to this repo's CLI boundary.

## 10. Acceptance
- P0 can be completed independently and verified before P1 starts.
- Status output clearly distinguishes technical validation from workflow gate/approval state.
- Candidate profile tables no longer parse as active profiles.
- Operators have one state-sync command for normal wrap/handoff recovery.
- Root task/status file ambiguity is surfaced as a warning with canonical authority guidance.
- P1 remains lightweight and does not add mandatory governance surfaces without separate approval.

## 11. Open Questions
- Should the state-sync wrapper be named `harness:sync-state`, `harness:wrap`, or both as an alias?
- Which exact root filenames should trigger the ambiguity warning in the first P0 implementation?
- Should P1 `plan-check` remain documentation-only in OPS-29, or open a separate follow-up after P0/P1?

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | yes | user | approved | P0/P1 are core, mobile mocks are optional profile follow-up |
| Optional profile evidence approval | no | user | not-needed | no optional profile is active in OPS-29 |
| Detailed function agreement | yes | user | approved | user approved the bounded P0 implementation start |
| Detailed UI/UX agreement | no | user | not-needed | terminal copy only |
| Authoritative source disposition approval | yes | user | approved | downstream repo findings were approved as improvement inputs |
| Improvement promotion decision | yes | user | approved | bounded P0/P1 sequence only |
| Ready For Code sign-off | yes | user | approved | approved for P0 and later extended to bounded P1 implementation on 2026-05-22 |

## 13. Implementation Notes
- Implement P0 as the smallest runtime/script changes that solve the observed friction.
- Use existing command implementations rather than introducing a new state machine.
- Keep root and `standard-template` synchronized for reusable runtime/scripts/tests/docs.
- Preserve current generated-state immutability; regenerate, do not hand-edit.
- Add tests for behavior changes before relying on manual validation.

## 14. Verification Plan
- Gate profile: contract.
- P0 targeted verification:
  - sync wrapper success and failure ordering.
  - status labels for `Technical validation` and `Workflow gate`.
  - active profile parser ignores `## Candidate Profiles`.
  - transition shorthand preview/apply guardrails.
  - root status-file warning behavior.
- P1 targeted verification:
  - day-wrap template exists in the correct starter/reference location.
  - repair output suggests concrete next commands.
  - document labels do not overwrite generated-authority rules.
- Full reusable verification:
  - root `npm.cmd test`
  - `standard-template` `npm.cmd test`
  - root `npm.cmd run harness:validate`
  - root `npm.cmd run harness:validation-report`
  - root `npm.cmd run harness:context`

## Verification Manifest
- Ready For Code is approved for P0 and the bounded P1 follow-up.
- root tests are required for P0/P1 closeout.
- standard-template tests are required when starter-shipped runtime, scripts, docs, or tests change.
- targeted tests must cover the sync wrapper, status split, profile parser boundary, transition shorthand, warning behavior, and recovery-output text.
- validator evidence must be regenerated after implementation.
- active context evidence must be regenerated after implementation and before handoff.
- review closeout is required before Planner closeout.
- handoff evidence must identify whether P0 only, P1 only, or both phases are complete.

## 15. Packet Exit Quality Gate
- Packet exit metadata version: v1
- Packet exit metadata gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata exit recommendation: approve `OPS-29` P0/P1 closeout
- Packet exit metadata source parity result: aligned for reviewed P0/P1 root / `standard-template` runtime, script, doc, and test surfaces
- Packet exit metadata validation / security / cleanup evidence: P0 root targeted `80/80`, `standard-template` targeted `80/80`, root full suite `111/111`, `standard-template` full suite `101/101`; P1 root targeted `41/41`, `standard-template` targeted `41/41`, root full suite `113/113`, `standard-template` full suite `103/103`; validation/report evidence pass; security review not-applicable
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: approve `OPS-29` P0/P1 closeout
- Implementation delta summary: P0 added `harness:sync-state`, split status output into technical validation and workflow gate state, limited active profile parsing to the first active-profile table, added warning-only root status-surface detection, and added transition positional shorthand with root / `standard-template` parity; P1 added official day-wrap and plan-check candidate reference surfaces, concrete `context --repair` next-command guidance, and short authority labels for authoritative/generated/packet documents
- Source parity result: aligned for reviewed P0/P1 scope
- Refactor / residual debt disposition: deferred items must remain explicitly listed, not silently absorbed.
- UX conformance result: terminal/document-copy review only.
- Topology / schema conformance result: not-needed.
- Validation / security / cleanup evidence: reviewer checked walkthrough evidence, root / `standard-template` targeted and full regression results, clean transition-generated validation-report / ACTIVE_CONTEXT evidence, and confirmed security review remains not-applicable for this packet metadata.
- Deferred follow-up item: optional mobile test profile, preventive-memory lint candidate, optional open-question ledger, and path normalization are deferred unless separately approved.
- Improvement candidate reference: OPS-DOWNSTREAM-FRICTION-001.
- Proposed target layer: core P0/P1, optional profile for mobile mocks.
- Promotion status / linked follow-up item: approved / OPS-29.
- Closeout notes: reviewer approved P0 first, the user approved bounded P1 implementation on 2026-05-22, and reviewer later approved the completed P1 scope. Deferred mobile/profile/lint/ledger/path-normalization items remain outside this closed packet.

## 16. Reopen Trigger
- P0 starts to require broad DB/schema redesign.
- P1 introduces mandatory new governance artifacts without approval.
- Downstream evidence shows the root-file warning must become a stricter validator rule.
- A separate optional mobile profile is approved and needs to absorb the SQLite/NetInfo mock requirement.
- The sync wrapper masks failures instead of printing exact next action.
- Status output again conflates technical pass with workflow approval.
