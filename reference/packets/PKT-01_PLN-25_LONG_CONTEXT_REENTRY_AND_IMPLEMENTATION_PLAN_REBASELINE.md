# PKT-01 PLN-25 Long Context Re-entry And Implementation Plan Rebaseline

## Purpose
- Open one broad planning packet to make long-running harness work easier for both the human operator and AI agents.
- Keep `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, and `IMPLEMENTATION_PLAN.md` as human-readable governance SSOT, while reducing default AI reread cost.
- Rebaseline `IMPLEMENTATION_PLAN.md` so it contains the actual implementation plan in language the user can understand, instead of acting as a project history log, packet catalog, task registry, and operating rulebook at the same time.
- Add or update the maintainer-facing architecture map needed for `.harness/runtime/state/*` work.

## Approval Rule
- This packet is the planning surface for the next broad cleanup/rebaseline lane.
- User requested adding the `IMPLEMENTATION_PLAN.md` role cleanup to the new packet on 2026-05-18.
- User approved the problem definition and direction on 2026-05-18, with the condition that section disposition, destination authority, final TOC, AI read path before/after, and root / `standard-template` sync criteria are added before implementation starts.
- The requested detailed agreement additions are recorded in this packet.
- User explicitly approved `Ready For Code` on 2026-05-18.
- The packet may be large; do not split only because the scope is broad.
- DB-vs-Markdown write-authority redesign remains out of scope unless the user explicitly expands this packet.
- Developer may implement only the approved cleanup/rebaseline scope in this packet.
- This template-based packet is a concrete current-contract task packet and must stay registered as category `task_packet`.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | PLN-25 Long context re-entry and implementation plan rebaseline | current re-entry is improved, but dev lanes and `IMPLEMENTATION_PLAN.md` still carry unnecessary long-context cost | approved |
| Ready For Code | approved | user explicitly approved implementation start after the detailed agreement was completed | approved |
| Human sync needed | yes | the user directly reads the core governance documents and wants `IMPLEMENTATION_PLAN.md` to stay understandable | approved |
| Gate profile | contract | changes affect workflow contracts, AI re-entry, governance SSOT, runtime docs, and root/starter parity | approved |
| User-facing impact | high | the main user-facing surface is the human-readable planning/governance document set | approved |
| Layer classification | core | reusable harness operating model, not a downstream project-specific packet | approved |
| Active profile dependencies | none | no optional profile is required | not-needed |
| Profile evidence status | not-needed | no profile-specific evidence is required | not-needed |
| UX archetype status | approved | the affected operator-facing surface is the governance document reading flow, using the operator-governance-document archetype | approved |
| UX deviation status | none | no UX archetype deviation is involved | not-needed |
| Environment topology status | not-needed | no deploy/cutover environment is changed | not-needed |
| Domain foundation status | not-needed | no product domain data or DB schema is changed | not-needed |
| Authoritative source intake status | approved | user explicitly requested including `IMPLEMENTATION_PLAN.md` role cleanup and detailed agreement additions in this packet | approved |
| Shared-source wave status | not-needed | single broad governance/runtime cleanup packet | not-needed |
| Packet exit gate status | pending | implementation, validation, and review evidence do not exist yet | draft |
| Improvement promotion status | approved | this packet promotes the repeated long-context friction into a governed cleanup lane | approved |
| Existing system dependency | none | no external business system dependency is touched | not-needed |
| New authoritative source impact | analyzed | user source changes the planned packet scope by adding `IMPLEMENTATION_PLAN.md` content rebaseline and required detailed agreement surfaces | approved |
| Risk if started now | medium | scope is broad but bounded by the approved disposition, authority, read-path, sync, and documentation requirements | approved |

## Lane-Typed Minimum Contract
- Lane-type declaration:
  planning
- Lane-type universal minimum sections:
  Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger
- Lane-type required sections:
  Purpose; Approval Rule; Quick Decision Header; Human Governance Document Contract; Implementation Plan Rebaseline Contract; AI Re-entry Contract; Maintainer Architecture Map Contract; Verification Manifest
- Lane-type conditional sections:
  root / `standard-template` parity is required when reusable workflow, manual, runtime, or starter payload behavior changes
- Lane-type not-needed sections:
  optional profile evidence, product UI design, product domain foundation, deployment topology, external system migration

## Goal
- Make long-running harness work easier to resume without forcing AI agents to reread large documents by default.
- Preserve the three human-facing governance documents as real SSOT:
  - `REQUIREMENTS.md`: what must be true and what approval boundaries exist
  - `ARCHITECTURE_GUIDE.md`: technical boundaries and design decisions
  - `IMPLEMENTATION_PLAN.md`: the implementation plan the user can understand and review
- Convert `IMPLEMENTATION_PLAN.md` back into an actual implementation plan rather than a combined history log, lane registry, packet catalog, and operating rulebook.
- Add a maintainer architecture map for the harness runtime so future `.harness/runtime/state/*` changes do not require rediscovering module boundaries from code every time.

## Non-Goal
- Do not remove `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, or `IMPLEMENTATION_PLAN.md` as governance SSOT.
- Do not make `ACTIVE_CONTEXT.*` a write authority.
- Do not redesign the full DB-vs-Markdown truth hierarchy in this packet.
- Do not delete historical evidence without a clear migration or archive target.
- Do not weaken packet-before-code, human approval, Tester/Reviewer separation, generated-doc immutability, or root/starter parity.

## User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  - `IMPLEMENTATION_PLAN.md`가 구현계획만 담지 않고 장기 이력, lane/packet registry, packet catalog, 운영 규칙까지 흡수해 사용자가 읽기 어렵다.
  - AI도 큰 문서를 정본으로 반복해서 읽으면서 장기 프로젝트 컨텍스트 비용이 다시 커진다.
  - 하네스 runtime 자체 구조를 설명하는 maintainer map이 없어 runtime 변경 시 AI가 매번 코드를 다시 탐색한다.
- 작업 후 사용자가 체감해야 하는 변화:
  - `IMPLEMENTATION_PLAN.md`는 "무엇을 어떤 순서로 구현할지"만 사람이 이해하기 쉬운 표현으로 보여준다.
  - 과거 이력, 닫힌 packet catalog, 운영 규칙은 각자 맞는 문서나 generated/read-model surface로 분리된다.
  - AI는 `ACTIVE_CONTEXT`, active packet, latest handoff, 필요한 governance section만 좁혀 읽는다.
  - runtime maintainer 작업은 architecture map을 먼저 보고 시작할 수 있다.

## In Scope
- Rebaseline `IMPLEMENTATION_PLAN.md` content model:
  - keep current/future implementation sequence, active lane, next approved work, dependency order, and user-readable implementation rationale
  - remove or move long chronological history from the main body
  - remove or move closed lane/packet catalog entries from the main body
  - remove or move operating rules that belong in workflows, manuals, validator/runtime docs, or packet templates
  - keep short pointers to moved material where needed
- Add or update destination surfaces for moved content:
  - project chronology/history
  - packet/lane registry or generated task view
  - reusable workflow/validation operating rules
  - maintainer architecture/runtime map
- Update AI re-entry/read contracts:
  - reduce default `IMPLEMENTATION_PLAN.md` full reread in Developer and related workflows
  - keep `IMPLEMENTATION_PLAN.md` as governance SSOT but read it by need, section, or compact brief where possible
  - ensure `ACTIVE_CONTEXT` does not pull large SSOT files only because of stale or overly broad handoff `requiredSsot`
- Add maintainer architecture map for `.harness/runtime/state/*`:
  - state store and DB ownership
  - transition/handoff write path
  - generated docs/projection path
  - Active Context path
  - validator and validation-report path
  - starter/root sync boundary
- Sync reusable contract changes to `standard-template` where applicable.
- After implementation work is complete, update `reference/manuals/HARNESS_MANUAL.md` and `reference/artifacts/HARNESS_FILE_ROUTE_AUDIT_MATRIX.md` to reflect the final approved runtime, workflow, and re-entry contract changes, and mirror the reusable counterparts in `standard-template` when applicable.

## Out Of Scope
- Rewriting product requirements or approved architecture decisions.
- Changing downstream project payload behavior unless required by reusable starter parity.
- Removing compatibility views beyond already-approved generated/fallback behavior.
- Reworking DB schema ownership or replacing Markdown governance truth with DB-only truth.
- Release packaging, npm publishing, installer mutation, or downstream project mutation.

## Human Governance Document Contract
- `REQUIREMENTS.md` remains the user-readable source for requirement truth and approval boundaries.
- `ARCHITECTURE_GUIDE.md` remains the user-readable source for architecture boundaries.
- `IMPLEMENTATION_PLAN.md` remains the user-readable source for implementation sequencing.
- The cleanup must not make the user chase generated JSON, DB rows, or scattered packet evidence to understand the current plan.
- The cleanup should make each document answer one primary question:
  - requirements: what must be true?
  - architecture: how is it structured?
  - implementation plan: what will be implemented, in what order, and why?

## Implementation Plan Rebaseline Contract
- The current `IMPLEMENTATION_PLAN.md` contains at least four roles that should be separated:
  - Long history log: dated lane openings, closings, replacements, and approval boundaries currently accumulated in the summary.
  - Lane/packet registry: closed baseline tasks and follow-up task lists currently used as a registry.
  - Packet catalog: individual lane sections such as `OPS-08`, `QLT-03`, `DEV-06`, `PLN-06` with goal/status/input/output/exit criteria/operator next action.
  - Operating rulebook: validation rules and per-work-item execution loop content that belongs to reusable workflow/manual/runtime contract surfaces.
- Target `IMPLEMENTATION_PLAN.md` shape:
  - short current implementation summary
  - active or next approved sequence
  - current dependency order
  - open implementation decisions
  - next operator action
  - concise links to history, packet registry, operating rules, and maintainer architecture map
- Required disposition:
  - move long dated history to `PROJECT_HISTORY.md` or another approved history surface
  - move closed packet/lane catalog details to packet files, generated task views, or an approved archive/index
  - move reusable execution rules to workflow/manual/validator contract surfaces
  - keep only the plan-level references needed for a human to understand current direction

## AI Re-entry Contract
- `ACTIVE_CONTEXT.json` remains first-read for AI re-entry.
- `CURRENT_STATE.md` and `TASK_LIST.md` remain compatibility views and are read only when `mustReadNext`, packet evidence, or troubleshooting requires them.
- `IMPLEMENTATION_PLAN.md` remains an SSOT, but workflows should not require full-file reread when the active packet, latest handoff, or compact sequencing brief is sufficient.
- Developer route should prefer:
  - `ACTIVE_CONTEXT.json`
  - active packet
  - `REQUIREMENTS.md` and `ARCHITECTURE_GUIDE.md` sections needed by the packet
  - compact implementation sequencing reference or targeted `IMPLEMENTATION_PLAN.md` section
  - validation/reporting evidence required by the gate
- Handoff `requiredSsot` must stay specific enough that closed or broad historical planning files do not keep re-entering the default read set forever.

## Maintainer Architecture Map Contract
- Add a maintained architecture map for the harness runtime, separate from downstream project architecture.
- The map must explain module ownership at a level useful to a new AI maintainer:
  - `.harness/runtime/state/operating-state-store.js`
  - `.harness/runtime/state/dev05-tooling.js`
  - `.harness/runtime/state/workflow-routing.js`
  - `.harness/runtime/state/generate-state-docs.js`
  - `.harness/runtime/state/active-context.js`
  - `.harness/runtime/state/drift-validator.js`
  - `.harness/runtime/state/harness-paths.js`
  - related CLI entrypoints and tests
- The map must state which modules can write DB state, generated projections, governance Markdown, validation evidence, and starter payload files.
- The map must distinguish root-only maintainer behavior from `standard-template` reusable payload behavior.

## Data / Source Impact
- Layer classification: core.
- UX archetype reference: `.agents/rules/HARNESS_OPERATING_CONTRACT.md`.
- Selected UX archetype: operator-governance-document.
- Archetype fit rationale: the affected user-facing surface is the operator's governance document reading flow, not a product UI.
- Required reading before code: `.agents/runtime/ACTIVE_CONTEXT.json`; `.agents/artifacts/REQUIREMENTS.md`; `.agents/artifacts/ARCHITECTURE_GUIDE.md`; `.agents/artifacts/IMPLEMENTATION_PLAN.md`; `.agents/workflows/plan.md`; `.agents/workflows/dev.md`; `.agents/workflows/handoff.md`; `reference/manuals/HARNESS_MANUAL.md`; `reference/artifacts/HARNESS_FILE_ROUTE_AUDIT_MATRIX.md`; this packet.
- Markdown / docs impact:
  - likely updates to root governance docs, manuals, workflow docs, and new or existing maintainer architecture/history/index surfaces
  - likely mirrored updates in `standard-template` for reusable contracts
- DB / state impact:
  - packet registration, work-item state, handoff, generated docs, Active Context, and validation report updates
  - no product DB impact
- generated docs impact:
  - generated compatibility docs and `ACTIVE_CONTEXT.*` must be regenerated after state changes
- validator / cutover impact:
  - validator and validation-report must pass after implementation
  - tests must cover any runtime/read-contract behavior change
- Authoritative source refs: user requests on 2026-05-18 about the original long-context findings and adding `IMPLEMENTATION_PLAN.md` role cleanup to the new packet.
- Authoritative source intake reference: user request on 2026-05-18 to include `IMPLEMENTATION_PLAN.md` role cleanup in the new packet.
- Authoritative source disposition: incorporated as approved planning input and explicit implementation approval.
- Existing plan conflict: none if this packet preserves the governance SSOT status of `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, and `IMPLEMENTATION_PLAN.md`.
- Current implementation impact: implementation is approved for the broad cleanup scope defined in this packet.
- Impacted packet set scope: single broad follow-up packet `PLN-25`; previous closed packets remain historical evidence.
- Harness/product boundary exceptions:
  - this is harness-maintainer work only

## Detailed Agreement Proposal
- Treat the next implementation as one broad cleanup lane instead of several small packets.
- Keep the human-facing governance documents authoritative, but make their purposes narrower and clearer.
- Allow `IMPLEMENTATION_PLAN.md` to get smaller by moving non-plan material to better homes.
- Do not optimize only for AI token count if that makes the human-facing plan harder to understand.
- Do optimize AI default reading by using `ACTIVE_CONTEXT`, active packet, latest handoff, and targeted sections.

## Implementation Plan Section Disposition Matrix
| Current content class | Current location / example | Disposition | Target surface | Rule |
|---|---|---|---|---|
| Current implementation plan | current active lane, next approved sequence, dependency order, operator next action | keep and rewrite | `.agents/artifacts/IMPLEMENTATION_PLAN.md` | must remain user-readable and short enough for routine review |
| Long dated project history | summary entries for lane openings, closings, superseded routes, approval boundaries | move | `.agents/artifacts/PROJECT_HISTORY.md` or equivalent approved history surface | keep only a short "history reference" pointer in `IMPLEMENTATION_PLAN.md` |
| Closed baseline task registry | closed baseline tasks and closed follow-up task lists | move or summarize | generated task views, `PROJECT_PROGRESS.md`, packet index, or history surface | closed work must remain discoverable but should not dominate the implementation plan |
| Closed packet catalog | per-lane sections such as `OPS-08`, `QLT-03`, `DEV-06`, `PLN-06` with goal/status/input/output/exit criteria | move | original packet files, generated task views, or packet archive/index | retain only active/current packet references in `IMPLEMENTATION_PLAN.md` |
| Reusable operating rules | validation rules, per-work-item execution loop, gate rules, workflow rules | move | `.agents/workflows/*`, `reference/manuals/HARNESS_MANUAL.md`, packet template, validator/runtime docs | implementation plan may link to rules but must not be the rulebook |
| Runtime maintainer structure | implicit knowledge about `.harness/runtime/state/*` write/read paths | create/move | new or existing maintainer architecture map | must explain module boundaries and write authority |
| AI re-entry hints | broad required SSOT lists that pull large docs by default | narrow | `ACTIVE_CONTEXT`, workflow contracts, active packet, handoff payload | broad files are read by need, not by stale default |
| Root/starter reusable contract notes | parity expectations for runtime/workflow/manual/template changes | keep as pointer, move details | route matrix, manual, maintainer architecture map | implementation plan states the requirement; detailed criteria live in reusable contract docs |

## Destination Authority Matrix
| Destination | Authority role | What belongs there | Write path | AI read behavior |
|---|---|---|---|---|
| `.agents/artifacts/REQUIREMENTS.md` | governance Markdown SSOT | requirements, approval boundaries, invariant rules | direct governance edit under approved packet | read when route/task needs requirement truth |
| `.agents/artifacts/ARCHITECTURE_GUIDE.md` | downstream project architecture SSOT | product/project technical boundaries, not harness self-architecture | direct governance edit under approved packet | read when implementation depends on architecture |
| `.agents/artifacts/IMPLEMENTATION_PLAN.md` | human-readable implementation sequencing SSOT | current/future implementation plan, dependency order, next approved work, concise links | direct governance edit under approved packet | targeted read; avoid closed-history rereads by default |
| `.agents/artifacts/PROJECT_HISTORY.md` or equivalent | durable project chronology | dated lane history, superseded routes, major approval milestones | direct governance/history edit under approved packet | read only for archaeology, audits, or planning disputes |
| `reference/packets/*.md` | task packet authority | concrete packet scope, acceptance, evidence, exit criteria | direct packet edit under approved packet | read active packet before state-changing work |
| `.agents/workflows/*.md` | role execution contract | role read order, allowed actions, evidence gates, handoff rules | root and starter sync when reusable | read matching workflow after `ACTIVE_CONTEXT` |
| `reference/manuals/HARNESS_MANUAL.md` | operator manual | human operating guidance and troubleshooting | root and starter sync when reusable | optional unless active route or user asks |
| `reference/artifacts/HARNESS_FILE_ROUTE_AUDIT_MATRIX.md` | route/read authority audit | route-level read sets, authority classes, sync review criteria | root and starter sync when reusable | optional audit/reference surface |
| maintainer architecture map | harness runtime maintainer SSOT | `.harness/runtime/state/*` module boundaries and write paths | root and starter sync if reusable payload behavior changes | read before runtime/state implementation work |
| `.agents/runtime/ACTIVE_CONTEXT.*` | generated re-entry contract | compact current state, next workflow, must-read expansion | runtime regeneration only | first AI read, never write authority |
| `.agents/artifacts/CURRENT_STATE.md` / `TASK_LIST.md` | compatibility views | generated current/task views for fallback and evidence checks | runtime regeneration only | conditional fallback only |

## Final `IMPLEMENTATION_PLAN.md` TOC Draft
1. `# Implementation Plan`
2. `## Current Plan Summary`
3. `## Active / Next Approved Work`
4. `## Implementation Sequence`
5. `## Dependency Order And Blocking Conditions`
6. `## Open Implementation Decisions`
7. `## Current Packet And Evidence Requirements`
8. `## Root / Standard-Template Sync Requirements`
9. `## Operator Next Action`
10. `## Pointers`

`Pointers` should link to project history, packet index/archive, workflow/manual rules, maintainer architecture map, generated task views, and validation evidence. It should not reproduce those documents.

## AI Read Path Before / After
| Route | Before cleanup | After cleanup |
|---|---|---|
| New AI re-entry | `ACTIVE_CONTEXT` plus broad `mustReadNext` could still include large historical SSOT files from handoff payloads | `ACTIVE_CONTEXT` first, then matching workflow, active packet, validation, and only targeted governance sections |
| Planner | `REQUIREMENTS.md` plus possible broad `IMPLEMENTATION_PLAN.md` and compatibility views during planning | `REQUIREMENTS.md`, active packet/source, targeted plan section, compatibility views only for troubleshooting/evidence |
| Developer | `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, full `IMPLEMENTATION_PLAN.md`, active packet | `ACTIVE_CONTEXT`, active packet, requirement/architecture sections needed by packet, compact sequence/current plan section, validation requirements |
| Handoff | latest handoff could carry broad historical required SSOT and keep it alive | required SSOT must be specific to next action; broad historical docs become pointers unless truly needed |
| Runtime maintainer | code exploration first for `.harness/runtime/state/*` boundaries | maintainer architecture map first, then specific module/test reads |
| User review | `IMPLEMENTATION_PLAN.md` mixes plan, history, catalog, and rules | `IMPLEMENTATION_PLAN.md` answers current plan and links out to history/catalog/rules |

## Root / `standard-template` Sync Criteria
- Sync root and `standard-template` when a change affects reusable workflow contracts, starter payload behavior, runtime state behavior shipped in the starter, packet templates, manuals, route matrix guidance, or validator/read-contract behavior.
- Root-only changes do not need starter sync when they affect maintainer-local evidence, generated runtime outputs, local DB state, release reports, recovery reports, or active root-only packet evidence.
- Generated files are regenerated, not manually synced as authority.
- If a workflow/manual/runtime contract changes in root and has a starter counterpart, the packet must either update both copies or record a clear root-only rationale.
- If `HARNESS_MANUAL.md` or `HARNESS_FILE_ROUTE_AUDIT_MATRIX.md` becomes stale because of approved implementation changes, updating those reference files is part of packet completion, not optional follow-up cleanup.
- If `IMPLEMENTATION_PLAN.md` content model changes, root receives the live maintainer plan and `standard-template` receives the reusable starter baseline version only when that starter document is part of the installable payload.
- Sync verification must include a root/starter diff or equivalent spot-check for every reusable contract file touched.
- Starter validator behavior must remain correct for a fresh copied starter state.
- Active root packet evidence such as `PLN-25` must not be copied into `standard-template` as an active downstream packet unless the starter contract explicitly requires it.

## Verification Plan
- Root checks:
  - targeted tests for Active Context/read-contract behavior if runtime changes are made
  - `npm.cmd test`
  - `node .harness/runtime/state/dev05-cli.js validate`
  - `node .harness/runtime/state/dev05-cli.js validation-report`
  - `node .harness/runtime/state/dev05-cli.js context`
- `standard-template` checks when starter-owned or reusable contract files change:
  - `npm.cmd test` from `standard-template`
  - starter validator behavior remains expected for fresh starter state
- Manual review checks:
  - `IMPLEMENTATION_PLAN.md` answers "what will be implemented, in what order, and why" without requiring the user to read old lane logs
  - moved history and closed packet details remain discoverable
  - workflow/manual/matrix wording agrees with actual runtime behavior
  - `HARNESS_MANUAL.md` and `HARNESS_FILE_ROUTE_AUDIT_MATRIX.md` are updated to the final approved behavior after the implementation settles
  - maintainer architecture map is specific enough for `.harness/runtime/state/*` changes

## Verification Manifest
- Ready For Code: approved after the user explicitly approved implementation start following review of the added section disposition, destination authority, final TOC, AI read path before/after, and root / `standard-template` sync criteria.
- root: root governance, runtime, workflow, manual, and generated-state behavior must stay aligned.
- standard-template: reusable contract changes must be mirrored when they affect the starter payload.
- targeted: targeted runtime/read-contract tests are required for any behavior change.
- validator: `harness:validate` and validation-report must pass after implementation.
- active context: `ACTIVE_CONTEXT.*` must be regenerated and must not reintroduce broad stale read requirements.
- review closeout: Reviewer must approve that the cleanup preserves human governance truth and improves AI re-entry efficiency.

## Packet Exit Quality Gate
- The user can read `IMPLEMENTATION_PLAN.md` as an implementation plan, not as a combined history, registry, packet catalog, and rulebook.
- AI re-entry still starts from `ACTIVE_CONTEXT.json` and expands only through the active route and `mustReadNext`.
- Developer and planning workflows no longer force unnecessary full-file rereads of large documents when a packet or compact sequencing reference is enough.
- Historical and closed-packet information is not lost; it is moved or linked from an appropriate surface.
- Maintainer architecture map exists and is referenced from the right manual/workflow surfaces.
- Root and `standard-template` reusable contracts are synchronized where applicable.
- `HARNESS_MANUAL.md` and `HARNESS_FILE_ROUTE_AUDIT_MATRIX.md` are updated to the final approved contract surfaces before packet closeout.
- Tests, validator, validation-report, and Active Context generation pass.

## Refactor / Residual Debt Disposition
- DB-vs-Markdown write-authority simplification remains a separate future packet unless the user explicitly approves adding it.
- Further packet size reduction or archive automation can follow later if this packet exposes additional friction.

## Reopen Trigger
- Reopen this packet if the user finds the revised `IMPLEMENTATION_PLAN.md` still hard to understand.
- Reopen this packet if AI re-entry again defaults to broad historical docs for normal dev/planning work.
- Reopen this packet if runtime maintainers still need to rediscover `.harness/runtime/state/*` boundaries from code before making routine changes.

## Next Operator Action
- Developer may implement the full approved cleanup in one broad lane.
- Tester, Reviewer, and Planner closeout must confirm the final runtime, workflow, and manual/matrix contracts before packet closeout.
