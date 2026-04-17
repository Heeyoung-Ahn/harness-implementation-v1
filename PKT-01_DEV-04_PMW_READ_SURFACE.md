# PKT-01 DEV-04 PMW Read Surface

## Purpose
이 packet은 `DEV-04 PMW read surface`를 코드 착수 전에 다시 닫기 위한 task-level planning/design packet이다. 이 작업은 하네스에서 처음으로 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`를 구현하는 단계이며, `DEV-03` read model을 실제 PMW first view, detail panel, artifact viewer, settings surface로 연결하는 역할을 맡는다.

## Approval Rule
- 이 packet은 PMW UI 코드 구현 전에 작성한다.
- 이 작업은 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`를 포함하므로 detailed UI/UX agreement와 human sign-off 없이 `Ready For Code`로 올리지 않는다.
- source-to-surface mapping, default selection behavior, stale/diagnostics hierarchy, artifact viewer interaction이 바뀌면 이 packet을 다시 연다.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | DEV-04 PMW read surface | 사용자가 30초 안에 decision/blocker/focus/next를 읽는 실제 운영 창구를 만든다 | draft |
| Ready For Code | adjust | UI runtime, hero scope, detail default, diagnostics hierarchy를 작업 단위에서 더 명확히 닫아야 한다 | draft |
| Human sync needed | yes | first-view 정보 구조와 interaction은 직접적인 사용자 체감 영역이다 | draft |
| User-facing impact | high | 사용자가 매일 보는 첫 화면과 artifact reading flow를 결정한다 | draft |
| Risk if started now | high | packet 승인 전 구현하면 layout/copy/interaction rollback 가능성이 크다 | draft |

## 1. Goal
- read-only PMW first view를 구현한다.
- `Hero / Decision Required / Blocked / At Risk / Current Focus / Next Action / Active Detail / Artifact Viewer / Settings`를 approved source-to-surface mapping으로 렌더링한다.
- 사용자가 raw technical prose를 다시 조립하지 않고도 현재 판단 지점을 빠르게 읽도록 만든다.

## 2. Non-Goal
- PMW write action
- multi-user sync
- remote DB or SaaS integration
- theme customization system
- advanced chart/analytics wall
- inline editing of artifacts or state

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  state/read model은 생겼지만, 이를 사람이 빠르게 읽고 source trace로 내려갈 수 있는 실제 PMW 화면이 아직 없다.
- 작업 후 사용자가 체감해야 하는 변화:
  PMW 첫 화면에서 `무엇을 결정해야 하는지`, `무엇이 막고 있는지`, `현재 무엇을 하고 있는지`, `다음에 무엇을 해야 하는지`를 30초 안에 파악할 수 있다.

## 4. In Scope
- local-only PMW shell
- low-noise hero
- compact 4-card rail
- active detail panel
- drawer-based artifact viewer
- thin settings surface
- stale indicator and diagnostics secondary layer
- source trace open flow
- empty/error/needs-source state

## 5. Out Of Scope
- write/edit button
- auth/permissions management
- downstream rollout or starter promotion
- dense reporting/analytics
- mobile-native app shell
- visual redesign beyond approved editorial operations desk direction

## 6. Detailed Behavior
- Trigger:
  사용자가 PMW를 열거나 refresh를 요청할 때
- Main flow:
  snapshot load -> hero render -> 4-card rail render -> default active detail selection -> source trace/artifact/settings drawer open
- Alternate flow:
  designated summary가 없으면 strong surface는 `needs source`로 렌더링하고 diagnostics에 missing summary를 남긴다
- Empty state:
  decision/risk/handoff/artifact가 없으면 empty copy를 보이되 카드 구조는 유지한다
- Error state:
  snapshot load 실패나 missing generated doc가 있으면 blocking error panel을 보이되 raw stack trace를 strong surface에 올리지 않는다
- Loading/transition:
  first paint는 loading skeleton 또는 calm placeholder로 시작하고, refresh 중에는 기존 snapshot을 유지한 채 secondary loading state만 노출한다

## 7. Program Function Detail
- 입력:
  `DEV-03` context restoration read model, `REQUIREMENTS.md > ## Project Goal`, artifact index, generated docs, latest handoff
- 처리:
  strong surface summary, active detail payload, stale diagnostics, artifact source trace를 UI state로 조립
- 출력:
  local browser에서 읽는 read-only PMW surface
- 권한/조건:
  PMW는 first ship에서 read-only이며 local loopback만 허용한다
- edge case:
  stale snapshot, `needs source`, empty artifact library, latest handoff 없음, missing hero source, count/detail parity mismatch diagnostics

## 8. UI/UX Detailed Design
- 영향받는 화면:
  PMW home first view 전체
- 레이아웃 변경:
  상단 utility strip, low-noise hero, compact 4-card rail, primary detail panel, drawer-based artifact/settings, secondary diagnostics dock
- interaction:
  기본 선택 카드는 `Decision Required`가 있으면 우선, 없으면 `Blocked / At Risk`, 그다음 `Current Focus`, 그다음 `Next Action`
- copy/text:
  카드 headline은 designated summary 첫 핵심 문장만 사용하고, supporting text는 근거 또는 count만 짧게 노출한다
- feedback/timing:
  stale는 first view에서 읽히되 diagnostics가 strong surface hierarchy를 덮지 않게 chip/strip 수준으로 노출한다
- source trace fallback:
  summary source가 없으면 `needs source`, source trace가 있으면 artifact viewer로 연결, source가 없으면 empty trace state를 명시한다

## 9. Data / Source Impact
- DB / state 영향:
  read-only. 기존 store/write surface는 변경하지 않는다
- Markdown / docs 영향:
  `REQUIREMENTS.md > ## Project Goal`, `IMPLEMENTATION_PLAN.md > ## Operator Next Action`, generated docs designated section을 지속적으로 source로 사용한다
- generated docs 영향:
  `CURRENT_STATE.md`, `TASK_LIST.md` designated summary가 PMW strong surface의 직접 source다
- validator / cutover 영향:
  stale/diff finding은 PMW diagnostics로 읽히지만 unresolved 상태면 cutover blocker 유지

## 10. Acceptance
- PMW first view에서 사용자가 30초 안에 `decision`, `blocker`, `focus`, `next action`을 파악할 수 있다.
- strong surface는 designated summary 또는 explicit fallback만 사용한다.
- raw technical prose direct projection이 없다.
- detail panel의 visible count와 summary badge가 일치한다.
- stale 상태가 있으면 first view에서 읽히고, 세부 finding은 diagnostics layer에 있다.
- source trace를 통해 canonical doc, generated doc, latest handoff로 내려갈 수 있다.
- artifact viewer는 read-only이며 mandatory scope만 제공한다.
- settings는 thin local surface로 유지된다.

## 11. Decision Sheet
| Decision Item | Recommended | Why | Adjust When | Fallback |
|---|---|---|---|---|
| UI runtime | built-in Node local server + static HTML/CSS/JS | 현재 repo에 frontend framework가 없고, first ship 목표는 read surface contract 안정화다 | 이후 PMW interaction complexity가 현재 가정보다 크게 늘어날 때 | framework 선택 전까지 static shell 유지 |
| Hero scope | `REQUIREMENTS.md > ## Project Goal`만 최소 노출 | hero는 목적을 읽히게 해야지 release-goal noise를 늘리면 안 된다 | 사용자 요구가 hero에 다른 운영 정보 노출을 명시적으로 요구할 때 | hero는 제목 + goal bullets만 유지 |
| Default active detail | decision 우선, 없으면 blocker, 없으면 focus, 없으면 next | 사용자의 첫 질문 순서와 맞고 우선순위가 분명하다 | reviewer 테스트에서 다른 default가 이해 속도를 높인다고 확인될 때 | 마지막 선택 상태를 저장하지 않고 deterministic priority 유지 |
| Diagnostics placement | top banner 기본 금지, chip/strip + dock | first view comprehension을 지키면서 stale 사실은 숨기지 않는다 | blocking error가 home 자체를 unusable하게 만들 때 | blocking error panel만 예외 허용 |
| Artifact viewer style | right drawer | reading desk 흐름을 유지하고 home context를 끊지 않는다 | artifact density가 drawer에 과도하게 눌릴 때 | modal이 아니라 split panel 우선 검토 |

## 12. Open Questions
- refresh interaction을 auto-poll 없이 manual only로 둘지
- settings surface에 어떤 local registry 정보까지 first ship에 포함할지

## 13. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Detailed function agreement | yes | human operator | pending | source-to-surface, default selection, stale handling 확정 필요 |
| Detailed UI/UX agreement | yes | human operator | pending | layout hierarchy, drawer behavior, copy density 확정 필요 |
| Ready For Code sign-off | yes | human operator | pending | 이 packet 기준으로 코드 착수 승인 필요 |

## 14. Implementation Notes
- DOM/presentation layer는 `DEV-03` read model을 소비만 하고 직접 DB를 읽지 않는다.
- strong surface copy는 parser/fallback 결과만 사용한다.
- artifact viewer와 diagnostics는 secondary surface로 두되 source trace 접근성은 유지한다.
- first ship은 dependency 최소화와 deterministic behavior를 우선한다.

## 15. Verification Plan
- packet 승인 후 UI state mapping unit test 추가
- browser evidence로 30-second comprehension check 수행
- `needs source`, stale, empty, blocking error, artifact drawer, diagnostics dock 시나리오 확인
- raw prose leakage와 count/detail parity를 reviewer checklist로 검증

## 16. Reopen Trigger
- hero source contract가 바뀜
- read-only boundary가 바뀜
- default detail priority가 바뀜
- diagnostics hierarchy가 바뀜
- artifact viewer mandatory scope가 바뀜
