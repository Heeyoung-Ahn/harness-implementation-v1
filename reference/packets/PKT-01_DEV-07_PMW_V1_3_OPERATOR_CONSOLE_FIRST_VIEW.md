# PKT-01 DEV-07 PMW V1.3 Operator Console First View

## Purpose
이 packet은 `DEV-07 PMW V1.3 operator console first view`를 코드 착수 전에 다시 닫기 위한 task-level planning/design packet이다. 이 작업은 V1.2의 압축형 PMW monitor를 V1.3의 `Project Overview Band + Action Board + Re-entry Baton + artifact drill-down + command panel` 구조로 재정의하는 첫 구현 패킷이다.

## Approval Rule
- 이 packet은 PMW first-view와 operator-facing 정보구조를 직접 바꾸므로 human sync 없이 `Ready For Code`로 올리지 않는다.
- PMW는 독립 설치형 multi-project operator console이어야 하며 canonical write authority가 아니어야 한다.
- phase-1 PMW launcher scope와 terminal-only guided command split이 바뀌면 이 packet을 다시 연다.
- first-view 정보계층, current-situation card structure, artifact grouping, command panel placement, diagnostics hierarchy, 또는 handoff re-entry contract가 바뀌면 이 packet을 다시 연다.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | DEV-07 PMW V1.3 operator console first view | V1.3 방향을 실제 first-view/operator console 구현 단위로 닫아야 한다 | done |
| Ready For Code | approved | user-facing first view sign-off가 닫혔고 구현 범위가 packet으로 고정되었다 | approved |
| Human sync needed | yes | PMW 첫 화면과 command panel은 사용자가 직접 체감하는 운영 surface다 | approved |
| User-facing impact | high | 사용자가 보는 PMW의 핵심 first view와 command panel hierarchy를 재정의한다 | approved |
| Layer classification | core | separate PMW app와 exported read-model contract를 함께 바꾸는 reusable core lane이다 | approved |
| Active profile dependencies | none | optional profile activation 없이 진행하는 reusable PMW lane이다 | approved |
| Profile evidence status | not-needed | active optional profile이 없다 | approved |
| UX archetype status | approved | 표준 UX archetype reference를 인용하고 selected archetype을 concrete하게 닫는다 | approved |
| UX deviation status | none | archetype deviation 없이 reading-desk bias 안에서 해결한다 | approved |
| Environment topology status | not-needed | deploy/test/cutover topology lane가 아니다 | approved |
| Domain foundation status | not-needed | data-impact / schema lane가 아니다 | approved |
| Authoritative source intake status | approved | 승인된 V1.3 planning source를 구현 packet으로 구체화한다 | approved |
| Shared-source wave status | not-needed | multi-packet source wave lane가 아니다 | approved |
| Packet exit gate status | approved | Tester verification, user testing, Developer remediation, and Reviewer re-check are complete | approved |
| Existing system dependency | none | 외부 기존 시스템이나 DB 연동이 없다 | approved |
| New authoritative source impact | analyzed | V1.3 approved direction이 기존 PMW 구현과 충돌하는 범위를 분석했다 | approved |
| Risk if started now | low | first-view UI sign-off가 닫혔고 구현 경계가 packet으로 고정되었다 | approved |

## 1. Goal
- PMW first view를 `프로젝트 헤더 / Project Overview Band / Action Board / Re-entry Baton / artifact drill-down / operator command panel` 구조로 재정의한다.
- 사용자가 PMW 첫 화면만 보고 30초 안에 `지금 어디에 있는지`, `무엇이 막고 있는지`, `다음에 무엇을 해야 하는지`를 답할 수 있게 한다.
- phase-1 PMW launcher scope와 terminal-only guided command split을 first-view 안에 명확히 노출한다.
- latest handoff, next owner, next task, required SSOT를 first-view에 자연스럽게 통합한다.

## 2. Non-Goal
- arbitrary shell execution
- PMW가 canonical write authority가 되는 구조
- multi-user live collaboration
- remote SaaS sync
- 패키징/설치기 구조 재정의
- full analytics wall 또는 chart dashboard

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  현재 PMW는 운영 요약 모니터 수준의 surface는 제공하지만, V1.3에서 기대하는 richer first view인 `Project Overview Band + Action Board + Re-entry Baton + artifact drill-down + command panel` 구조를 아직 제공하지 못한다.
- 작업 후 사용자가 체감해야 하는 변화:
  PMW 첫 화면에서 프로젝트 제목/상태/복귀 지점을 읽고, Project Overview Band에서 개요와 진행현황을 이해하고, Action Board에서 결정/이슈/현재 작업/다음 작업을 확인한 뒤, 같은 화면에서 문서와 명령 surface로 이어질 수 있다.

## 4. In Scope
- PMW project header/meta strip
- Project Overview Band
- overall progress summary
- domain progress summary
- Action Board 4-card grid
- Re-entry Baton
- artifact library grouping
- in-place artifact preview
- operator command panel information architecture
- phase-1 launcher command entries
- terminal-only guided command entries
- diagnostics secondary layer

## 5. Out Of Scope
- arbitrary process runner
- package installer redesign
- PMW account/auth system
- command history persistence beyond session
- project-manifest schema version change beyond what this packet requires
- second-screen/mobile-specific layout

## 6. Detailed Behavior
- Trigger:
  사용자가 PMW를 열거나 selected project를 전환하거나 refresh할 때
- Main flow:
  selected project load -> header/meta render -> Project Overview Band render -> overall/domain progress render -> Action Board cards render -> Re-entry Baton render -> artifact library/preview render -> operator command panel render -> diagnostics secondary render
- Alternate flow:
  overview/progress source 일부가 부족하면 strong surface는 `needs source` 또는 explicit partial state를 보여 주고 diagnostics에서 근거를 남긴다
- Empty state:
  open decision/risk/work item/artifact가 없더라도 구조는 유지하고 explicit empty copy를 보여 준다
- Error state:
  selected project read-model load 실패, missing designated summary, malformed command contract는 blocking panel 또는 structured fallback으로 처리하고 raw crash dump를 strong surface에 올리지 않는다
- Loading/transition:
  기존 snapshot을 유지한 채 project switch / refresh 상태를 secondary loading surface로 보여 준다

## 7. Program Function Detail
- 입력:
  selected project manifest, PMW read-model, generated docs summary, latest handoff, task list/work item ownership, operator command contract
- 처리:
  first-view hierarchy에 맞게 summary cards, progress summaries, baton, artifact groups, command groups, diagnostics를 조립한다
- 출력:
  local PMW app의 operator-first first view
- 권한/조건:
  selected project 기준으로만 동작하고, PMW는 launcher/result-viewer surface이되 canonical write authority는 아니다
- edge case:
  selected project 없음, open task 없음, handoff 없음, stale diagnostics 존재, command contract 없음, artifact preview 대상 없음, terminal-only command만 있는 경우

## 8. UI/UX Detailed Design
- Active profile references: not-needed
- Profile composition rationale: not-needed
- Profile-specific UX / operation contract: not-needed
- Primary admin entity / surface: not-needed
- Grid interaction model: not-needed
- Search / filter / sort / pagination behavior: not-needed
- Row action / bulk action rule: not-needed
- Edit / save / confirm / audit pattern: PMW 자체는 canonical write authority가 아니므로 direct edit pattern을 두지 않는다
- Profile deviation / exception: none
- UX archetype reference: `reference/artifacts/PRODUCT_UX_ARCHETYPE.md`
- Selected UX archetype: `reading-desk`
- Archetype fit rationale:
  PMW의 핵심 가치는 write-heavy console이 아니라 summary-first, evidence-backed decision desk이므로 `reading-desk`가 기본 archetype으로 가장 적합하다
- Archetype deviation / approval: none
- 영향받는 화면:
  PMW home first view 전체
- 레이아웃 변경:
  상단 header/meta strip -> Project Overview Band -> Action Board 4-card grid -> Re-entry Baton / required SSOT strip -> artifact library + preview -> operator command panel -> diagnostics
- interaction:
  project overview는 접기/펼치기가 가능해야 하고, Action Board는 selected state 없이 4카드를 고정 노출한다. artifact library는 grouped list + in-place preview 구조를 갖고, operator command panel은 `launch here`와 `run in terminal for now`를 명확히 분리한다.
- Action Board current task card:
  task title, owner workflow/agent, current status snapshot을 함께 보여 준다.
- Action Board next task card:
  next task title, owner workflow/agent, next trigger 또는 gate snapshot을 함께 보여 준다.
- Re-entry Baton rule:
  latest handoff, next owner, target workflow route, required SSOT, pending approvals를 보여 주며, current task / next task의 본문 설명을 반복하지 않는다.
- copy/text:
  강한 surface는 operator-friendly summary 문장 우선, raw JSON은 diagnostics로만 보낸다
- feedback/timing:
  launcher command는 아직 session log surface를 같이 고려하되, terminal-only command는 정확한 repo-root 명령을 helper text로 노출한다
- source trace fallback:
  각 strong surface는 designated summary 또는 explicit fallback을 사용하고, source trace는 artifact preview나 diagnostics에서 따라갈 수 있어야 한다

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  separate PMW app, read-model contract, exported operator command contract, first-view hierarchy는 reusable core contract에 속한다
- Active profile dependencies:
  none
- Profile-specific evidence status:
  not-needed
- Source spreadsheet artifact:
  not-needed
- Workbook / sheet / tab / range trace:
  not-needed
- Header / column mapping:
  not-needed
- Row key / record identity rule:
  not-needed
- Source snapshot / version:
  not-needed
- Transformation / normalization assumptions:
  not-needed
- Reconciliation / overwrite rule:
  not-needed
- Transfer package / bundle artifact:
  not-needed
- Transfer medium / handoff channel:
  not-needed
- Checksum / integrity evidence:
  not-needed
- Offline dependency bundle status:
  not-needed
- Ingress verification / import step:
  not-needed
- Rollback package / recovery bundle:
  not-needed
- Manual custody / operator handoff:
  not-needed
- Required reading before code: `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`, `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/planning/PLN-07_PMW_V1_3_OPERATOR_CONSOLE_DRAFT.md`, `reference/artifacts/PRODUCT_UX_ARCHETYPE.md`, `reference/packets/PKT-01_DEV-04_PMW_READ_SURFACE.md`
- Environment topology reference:
  not-needed
- Source environment:
  not-needed
- Target environment:
  not-needed
- Execution target:
  not-needed
- Transfer boundary:
  not-needed
- Rollback boundary:
  not-needed
- Domain foundation reference:
  not-needed
- Schema impact classification:
  none
- DB / state 영향:
  canonical DB schema는 그대로 두되 release state, work item ownership, handoff summary, exported read-model fields를 first-view source로 더 강하게 소비한다
- Markdown / docs 영향:
  requirements, implementation plan, project progress, workflow contracts, manuals, and PMW-facing summaries must stay aligned with the first-view hierarchy
- generated docs 영향:
  `.agents/runtime/generated-state-docs/*`와 `.agents/runtime/pmw-read-model.json`의 designated summary / command contract projection이 first-view source가 된다
- validator / cutover 영향:
  PMW first-view changes must preserve validator cleanliness and command-surface clarity without introducing arbitrary shell scope
- Authoritative source refs:
  `reference/planning/PLN-07_PMW_V1_3_OPERATOR_CONSOLE_DRAFT.md`, `.agents/artifacts/REQUIREMENTS.md`, `reference/packets/PKT-01_DEV-04_PMW_READ_SURFACE.md`
- Authoritative source intake reference: `reference/planning/PLN-07_PMW_V1_3_OPERATOR_CONSOLE_DRAFT.md`
- Authoritative source disposition: approved and promoted into canonical planning baseline
- New planning source priority / disposition:
  highest priority / implemented into planning baseline
- Existing plan conflict: V1.2 PMW implementation is a compressed operator summary monitor and does not yet satisfy the approved V1.3 first-view hierarchy
- Current implementation impact: project overview band, overall/domain progress surface, integrated artifact preview hierarchy, and true phase-1 command-panel hierarchy still need implementation rework
- Required rework / defer rationale:
  the richer first-view contract must close before a dev lane starts so implementation does not regress back to a summary-only monitor
- Impacted packet set scope: single-packet
- Authoritative source wave ledger reference:
  not-needed
- Source wave packet disposition:
  not-needed
- Existing system dependency:
  none
- Existing schema source artifact:
  not-needed
- Table / column naming compatibility:
  not-needed
- Data operation / ownership compatibility:
  not-needed
- Migration / rollback / cutover compatibility:
  not-needed
- Product source root:
  `pmw-app/`
- Product test root:
  `pmw-app/test/`
- Product runtime requirements:
  local Node-based PMW app, exported selected-project read-model contract, no remote orchestration dependency
- Harness/product boundary exceptions:
  PMW reads exported state from selected projects but does not embed into downstream runtime code

## 10. Acceptance
- PMW first view shows project header, stage, gate, next owner, and next task without opening another document.
- PMW first view includes a Project Overview Band that covers project overview, overall progress, and domain progress.
- PMW first view includes an Action Board 4-card grid for `결정해야 할 것 / 이슈 / 지금 진행 중인 작업 / 다음 작업`.
- current task and next task cards include the responsible owner workflow or agent.
- PMW first view exposes latest handoff and re-entry cues as a distinct Re-entry Baton surface.
- Re-entry Baton focuses on handoff/re-entry metadata and does not duplicate the main task narrative already shown in the current task / next task cards.
- PMW first view shows grouped artifact access with in-place preview.
- PMW first view shows `Phase-1 PMW command scope` and `Run in terminal for now` as separate command groups.
- terminal-only commands show the exact selected-project repo-root command to run.
- diagnostics remain secondary and do not dominate the first-view hierarchy.

## 11. Open Questions
- if actual process execution for all phase-1 launcher commands proves materially broader than the first-view surface work, the implementation may split into a follow-up packet without changing this first-view information hierarchy

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | no | user | approved | reusable PMW/core lane로 충분히 명확하다 |
| Optional profile evidence approval | no | user | not-needed | active optional profile이 없다 |
| Spreadsheet source mapping approval | no | user | not-needed | spreadsheet source lane가 아니다 |
| Airgapped transfer package approval | no | user | not-needed | airgapped lane가 아니다 |
| Detailed function agreement | yes | user | approved | current task / next task cards must include owner workflow or agent, and Re-entry Baton must focus on routing / required SSOT / pending approvals rather than duplicate task narrative |
| Detailed UI/UX agreement | yes | user | approved | `Project Overview Band`, `Action Board`, `Re-entry Baton` terminology and top-level band ordering are approved |
| UX archetype / deviation approval | yes | user | approved | `reading-desk` archetype with no deviation으로 진행 |
| Environment topology approval | no | user | not-needed | topology lane가 아니다 |
| Domain foundation approval | no | user | not-needed | data-impact lane가 아니다 |
| DB design confirmation | no | user | not-needed | DB schema 변경이 없다 |
| Authoritative source disposition approval | no | user | approved | V1.3 approved planning source가 canonical baseline으로 승격되었다 |
| New source incorporation decision | no | user | approved | V1.3 direction 반영이 승인되었다 |
| Source wave rebaseline approval | no | user | not-needed | multi-packet source wave가 아니다 |
| Packet exit quality gate approval | yes | user | approved | Reviewer re-check approved the path-boundary remediation and closed the packet |
| Improvement promotion decision | no | user | not-needed | this lane itself is the approved planning follow-up |
| Ready For Code sign-off | yes | user | approved | implementation lane으로 진행 승인됨 |

## 13. Implementation Notes
- first implementation은 existing `pmw-app/runtime/server.js` static shell을 계속 사용할 수 있다
- command panel은 phase-1 launcher entries와 terminal-only guided entries를 같은 data contract에서 읽어야 한다
- terminal-only guidance는 selected project repo root를 항상 명시해야 한다
- first-view는 raw JSON surface를 strong layer로 끌어오지 않고 diagnostics로만 사용한다
- if command result viewer is included in the same lane, result logs remain session-scoped only

## 14. Verification Plan
- PMW server rendering tests for first-view section presence
- selected-project read-model contract tests for overview/progress/command grouping
- browser verification for first-view scan order and readability
- validator clean after packet, SSOT, export, and PMW updates

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference: `reference/packets/PKT-01_DEV-07_PMW_V1_3_OPERATOR_CONSOLE_FIRST_VIEW.md#15-packet-exit-quality-gate`
- Exit recommendation: approve
- Implementation delta summary:
  Implemented the V1.3 PMW first-view hierarchy in the read-model and `pmw-app/` UI: Project Overview Band, Action Board, Re-entry Baton, grouped artifact library with in-place preview, approved phase-1 launcher command panel, terminal-only guided command panel, and session-scoped command result surface.
- Source parity result: pass; first-view hierarchy, tester/user UX checks, Developer remediation, and Reviewer re-check all passed.
- Refactor / residual debt disposition:
  no known residual debt after path-boundary remediation and Reviewer re-check.
- UX conformance result:
  pass for user-facing hierarchy; developer, tester, and user browser checks confirmed approved section presence, owner workflow display, Re-entry Baton routing metadata, artifact preview behavior, command split, diagnostics hierarchy, and section navigation.
- Topology / schema conformance result:
  not-needed
- Validation / security / cleanup evidence: `node --test pmw-app/test/*.test.js`, `node --test .harness/test/pmw-read-surface.test.js .harness/test/context-restoration-read-model.test.js`, root `npm test`, `npm run harness:validate`, `npm run harness:pmw-export`, and `npm run harness:validation-report` passed on 2026-04-30. On 2026-05-01, `npm.cmd test` in `pmw-app`, targeted PMW/read-model tests, root `npm.cmd test`, and `npm.cmd run harness:validate` passed before review. Developer remediation and Reviewer re-check then passed `npm.cmd test` in `pmw-app`, targeted PMW/read-model tests, root `npm.cmd test`, and `npm.cmd run harness:validate`.
- Deferred follow-up item:
  later V1.3 packet may promote `test` from terminal-only guidance into the PMW launcher or add richer command history; neither is part of this packet.
- Improvement candidate reference:
  none
- Proposed target layer:
  none
- Promotion status / linked follow-up item:
  none
- Closeout notes:
  tester verification, user testing, Developer remediation, and Reviewer re-check are complete; no open DEV-07 review finding remains.

## 16. Reopen Trigger
- first-view information hierarchy changes
- phase-1 launcher scope changes
- terminal-only guided command list changes
- handoff route / required SSOT surface changes
- artifact grouping or preview expectations change
- PMW operator-console wording or write-boundary contract changes
