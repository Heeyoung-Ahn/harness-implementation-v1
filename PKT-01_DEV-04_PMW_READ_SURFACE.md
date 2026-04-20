# PKT-01 DEV-04 PMW Read Surface

## Purpose
이 packet은 `DEV-04 PMW read surface`를 코드 착수 전에 다시 닫기 위한 task-level planning/design packet이다. 이 작업은 하네스에서 처음으로 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`를 구현하는 단계이며, `DEV-03` read model을 실제 PMW first view, current-situation card grid, artifact preview, settings surface로 연결하는 역할을 맡는다.

## Approval Rule
- 이 packet은 PMW UI 코드 구현 전에 작성한다.
- 이 작업은 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`를 포함하므로 detailed UI/UX agreement와 human sign-off 없이 `Ready For Code`로 올리지 않는다.
- source-to-surface mapping, information hierarchy, project overview tab behavior, re-entry contract, stale/diagnostics hierarchy, artifact viewer interaction, mockup direction이 바뀌면 이 packet을 다시 연다.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | DEV-04 PMW read surface | 사용자가 큰그림과 작은그림을 같은 화면에서 빠르게 읽고 artifact로 내려갈 수 있는 실제 운영 창구를 만든다 | active |
| Ready For Code | approve | mockup approval과 detailed UI sign-off가 닫혔고 read-only first implementation을 시작할 수 있다 | approved |
| Human sync needed | yes | first-view 정보 구조와 interaction은 직접적인 사용자 체감 영역이므로 approval boundary를 명시적으로 닫고 구현에 들어간다 | closed |
| User-facing impact | high | 사용자가 매일 보는 첫 화면과 artifact reading flow를 결정한다 | draft |
| Risk if started now | low | approval boundary는 닫혔고 남은 리스크는 implementation correctness와 browser verification이다 | active |

## 1. Goal
- read-only PMW first view를 구현한다.
- PMW 첫 화면을 `큰그림 -> 작은그림 -> artifact drill-down` 순서의 reading desk로 만든다.
- 큰그림에서는 프로젝트 개요, 전체 진행 현황, 도메인별 진행 현황을 읽히게 한다.
- 작은그림에서는 현재 이슈/결정 필요 항목, 지금 진행 중인 작업, 다음 진행할 작업을 빠르게 읽히게 한다.
- 사용자가 중간에 다른 주제로 빠졌다가 돌아와도 `지금 어디에 있는지`, `왜 지금 이 작업을 하는지`, `어디로 돌아가면 되는지`를 first view에서 다시 잡을 수 있게 한다.
- 사용자가 raw technical prose를 다시 조립하지 않고도 현재 판단 지점과 배경 문서를 함께 따라갈 수 있게 한다.

## 2. Non-Goal
- PMW write action
- multi-user sync
- remote DB or SaaS integration
- theme customization system
- advanced chart/analytics wall
- inline editing of artifacts or state

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  state/read model은 생겼지만, 이를 사람이 `큰그림`과 `작은그림`으로 나눠 빠르게 읽고, 필요할 때 artifact 문서까지 내려갈 수 있는 실제 PMW 화면이 아직 없다. 또한 작업 중간에 다른 이슈로 빠지면 전체 그림과 복귀 지점을 잃고 `미로에 있는 느낌`이 든다.
- 작업 후 사용자가 체감해야 하는 변화:
  PMW 첫 화면에서 먼저 프로젝트 개요와 진행 현황을 읽고, 이어서 현재 결정/이슈/진행 작업/다음 작업을 확인한 뒤, 필요하면 하단 artifact preview에서 근거 문서를 바로 열 수 있다. 중간에 다른 주제로 이동했다 돌아와도 현재 lane과 복귀 지점을 빠르게 다시 잡을 수 있다.

## 4. In Scope
- local-only PMW shell
- big-picture overview band
- re-entry cue strip
- overall progress summary
- project overview tabbed views
- compact small-picture card grid
- fixed current-situation cards without selection highlight or a lower detail panel
- lower document library + in-place artifact preview
- thin settings surface
- stale indicator and diagnostics secondary layer
- source trace open flow
- empty/error/needs-source state

## 5. Out Of Scope
- write/edit button
- auth/permissions management
- downstream rollout or starter promotion
- dense reporting/analytics wall
- mobile-native app shell
- visual redesign beyond approved editorial operations desk direction

## 6. Detailed Behavior
- Trigger:
  사용자가 PMW를 열거나 refresh를 요청할 때
- Main flow:
  snapshot load -> project header/meta render -> big-picture overview render -> overall progress and domain summary render -> fixed small-picture card grid render -> source trace/artifact/settings area render
- Alternate flow:
  designated summary 또는 domain source가 부족하면 strong surface는 `needs source` 또는 explicit empty state로 렌더링하고 diagnostics에 missing source를 남긴다
- Empty state:
  decision/risk/work item/artifact가 없으면 empty copy를 보이되 큰그림/작은그림 구조는 유지한다
- Error state:
  snapshot load 실패나 missing generated doc가 있으면 blocking error panel을 보이되 raw stack trace를 strong surface에 올리지 않는다
- Loading/transition:
  first paint는 loading skeleton 또는 calm placeholder로 시작하고, refresh 중에는 기존 snapshot을 유지한 채 secondary loading state만 노출한다

## 7. Program Function Detail
- 입력:
  `DEV-03` context restoration read model, `REQUIREMENTS.md > ## Summary`, `REQUIREMENTS.md > ## Project Goal`, `release_state`, `work_item_registry`, artifact index, generated docs, latest handoff, `IMPLEMENTATION_PLAN.md > ## Operator Next Action`, current active packet reference
- 처리:
  project header/meta, big-picture overview, overall progress summary, domain progress summary, small-picture card content, stale diagnostics, artifact source trace를 UI state로 조립
- 출력:
  local browser에서 읽는 read-only PMW surface
- 권한/조건:
  PMW는 first ship에서 read-only이며 local loopback만 허용한다
- edge case:
  stale snapshot, `needs source`, domain hint 없음, empty artifact library, latest handoff 없음, missing overview source, missing return-point source, count/detail parity mismatch diagnostics

## 8. UI/UX Detailed Design
- 영향받는 화면:
  PMW home first view 전체
- 레이아웃 변경:
  상단 project header/meta 영역, 접기 가능한 project overview 영역, 중단 current-situation card 영역, 하단 artifact document 영역, 별도 settings 영역
- interaction:
  project overview는 `프로젝트 목적 / 프로젝트 진행 방안 / 프로젝트 진행 현황`을 한 줄 메뉴에서 전환 조회하고 필요 시 접을 수 있어야 한다. current-situation은 `결정해야 할 것 / 이슈 / 지금 진행 중인 작업 / 다음 작업` 4개 카드를 고정 그리드로 보여 주고, 선택 상태 없이 카드 자체에서 핵심 요약과 판단 포인트를 읽을 수 있어야 한다. artifact 영역은 `지속 업데이트 문서`와 `주요 계약 문서` 두 그룹으로 나누고, 각 문서를 클릭하면 같은 화면 안에서 조회한다.
- copy/text:
  상단에는 프로젝트 제목과 기타 상태 정보(current lane, next gate, return point)를 짧고 압축된 형태로 노출한다. project overview는 화면 상단에서 접기/펼치기 가능해야 하고, 기본 surface는 실제 현재 프로젝트 정보만 사용한다. 현재 진행 상황은 화면 중간 카드 자체에서 바로 읽히게 하고, 문서와 설정은 하단 secondary area로 분리한다.
- feedback/timing:
  stale는 first view에서 읽히되 diagnostics가 strong surface hierarchy를 덮지 않게 chip/strip 수준으로 노출한다
- source trace fallback:
  summary source가 없으면 `needs source`, source trace가 있으면 artifact viewer로 연결, source가 없으면 empty trace state를 명시한다

## 9. Domain Vocabulary
- PMW의 도메인 진행현황 표시는 first ship에서 아래 6개 라벨만 사용한다.
- `기준선 정렬`
- `상태 저장소`
- `상태 문서·복원`
- `PMW 읽기 화면`
- `검증·컷오버`
- `운영 품질`
- 화면에는 위 한국어 라벨만 노출하고, 내부 packet/work item 코드는 detail 또는 source trace에서만 노출한다.

## 10. Source-To-Surface Mapping
| User Need | PMW Surface | Primary Source | Secondary / Fallback |
|---|---|---|---|
| 프로젝트 개요 | big-picture overview band | `REQUIREMENTS.md > ## Summary`, `REQUIREMENTS.md > ## Project Goal` | source 없으면 `needs source` |
| 전체 프로젝트 진행 현황 | overall progress summary | `release_state`, `work_item_registry` aggregated snapshot | data 부족 시 explicit partial state |
| 도메인별 진행 현황 | project overview > progress detail | `work_item_registry.domainHint` grouped status summary using the approved 6-label set | `domainHint`가 없으면 `미분류`로 표기 |
| 현재 이슈 및 결정해야 할 문제 | small-picture decision/risk cards | generated docs designated summary, `decision_registry`, `gate_risk_registry` | `needs source` + diagnostics |
| 지금 진행 중인 작업 | small-picture current work cards | `work_item_registry` in-progress slice + designated summary | empty state |
| 다음 진행할 작업 | next action cards | `IMPLEMENTATION_PLAN.md > ## Operator Next Action` | `needs source` |
| 중단 후 어디로 돌아가야 하는지 | project header/meta area | `IMPLEMENTATION_PLAN.md > ## Operator Next Action`, latest handoff, current active packet | latest handoff 없으면 next action only |
| 세부 근거 문서 확인 | artifact document library + preview | canonical docs, generated docs, latest handoff | empty artifact state |

## 11. Data / Source Impact
- DB / state 영향:
  read-only. 기존 store/write surface는 변경하지 않는다. 다만 DEV-04는 `work_item_registry.domainHint`를 domain progress source로 소비한다
- Markdown / docs 영향:
  `REQUIREMENTS.md > ## Summary`, `REQUIREMENTS.md > ## Project Goal`, `IMPLEMENTATION_PLAN.md > ## Operator Next Action`, generated docs designated section, active packet reference를 지속적으로 source로 사용한다
- generated docs 영향:
  `CURRENT_STATE.md`, `TASK_LIST.md` designated summary가 small-picture strong surface의 직접 source다
- validator / cutover 영향:
  stale/diff finding은 PMW diagnostics로 읽히지만 unresolved 상태면 cutover blocker 유지

## 12. Acceptance
- PMW first view 상단에서 사용자가 프로젝트 제목과 기타 상태 정보(current lane, next gate, return point)를 읽을 수 있다.
- 프로젝트 개요 영역은 화면 상단에 위치하고 접기/펼치기가 가능하다.
- 프로젝트 개요 안에서 `프로젝트 목적 / 프로젝트 진행 방안 / 프로젝트 진행 현황`을 한 줄 메뉴로 단계적으로 조회할 수 있다.
- 프로젝트 진행 현황은 진척률, 주요 결과, 도메인별 진행 현황을 함께 보여 준다.
- 현재 진행 상황 영역은 화면 중간에 고정 카드 그리드 형태로 있고 `결정해야 할 것 / 이슈 / 지금 진행 중인 작업 / 다음 작업`을 한 번에 보여 준다.
- 현재 진행 상황 카드는 카드 자체에서 핵심 요약과 판단 포인트를 읽을 수 있고, 별도 하단 detail 영역을 요구하지 않는다.
- 주요 산출물 영역은 `지속 업데이트 문서`와 `주요 계약 문서`를 나눠 보여 준다.
- 각 문서 항목을 클릭하면 같은 화면 안에서 문서 설명, 용도, 경로를 조회할 수 있다.
- 설정은 별도 영역으로 분리되고 아래 최소 read-only 범위만 제공한다.
  - workspace/repo path
  - DB path
  - generated docs path
  - current verification lane
  - manual refresh
  - source contract summary
- strong surface는 designated summary 또는 explicit fallback만 사용한다.
- raw technical prose direct projection이 없다.

## 13. Decision Sheet
| Decision Item | Recommended | Why | Adjust When | Fallback |
|---|---|---|---|---|
| UI runtime | built-in Node local server + static HTML/CSS/JS | 현재 repo에 frontend framework가 없고, first ship 목표는 read surface contract 안정화다 | 이후 PMW interaction complexity가 현재 가정보다 크게 늘어날 때 | framework 선택 전까지 static shell 유지 |
| Information hierarchy | project header/meta first, collapsible project overview second, current-situation cards third, artifact/settings lower area fourth | 사용자가 제목과 현재 위치를 먼저 읽고, 그 다음 개요와 현재 진행 상황, 마지막으로 참고 문서를 보게 하는 구조가 더 명확하다 | reviewer 테스트에서 다른 순서가 이해 속도를 높인다고 확인될 때 | current hierarchy 유지 |
| Big-picture scope | 프로젝트 개요 + 전체 진행 현황 + 도메인별 진행 현황 | 사용자가 명시적으로 원하는 first-view 우선순위다 | 실제 source contract가 부족해 first ship에서 오해를 만들 때 | unavailable 항목은 explicit partial state |
| Maze prevention contract | `현재 lane / 왜 지금 / 어디로 복귀`를 first view에 고정 | 실제 사용자 pain point가 반복되고 cross-project로도 나타난다 | later phase에서 richer interruption history가 생길 때 | next action + latest handoff만으로 최소 재진입 cue 유지 |
| Domain vocabulary | 승인된 6개 라벨 고정 | 첫 ship에서 vocabulary를 흔들면 이해 비용이 커진다 | 이후 실제 운영에서 label merge/split이 필요하다고 확인될 때 | 미분류는 `미분류`로 별도 bucket |
| Current-situation card interaction | 4개 카드를 고정 노출하고 selected/default highlight를 두지 않는다 | 카드 자체에서 바로 읽히는 구조가 reviewer 피드백과 맞고, 선택 상태는 오히려 혼선을 만든다 | reviewer 테스트에서 다시 선택형 흐름이 더 낫다고 확인될 때 | deterministic ordering만 유지하고 별도 선택 상태는 두지 않는다 |
| Refresh mode | manual refresh 기본 | first ship에서 상태 해석과 정보 구조를 먼저 안정화하는 편이 낫다 | auto-refresh가 실제 운영에서 필수라고 확인될 때 | refresh button 유지 |
| Diagnostics placement | top banner 기본 금지, chip/strip + dock | first view comprehension을 지키면서 stale 사실은 숨기지 않는다 | blocking error가 home 자체를 unusable하게 만들 때 | blocking error panel만 예외 허용 |
| Artifact viewer style | lower document library + in-place preview | 현재 구조에서는 문서 목록과 설명을 같은 화면 안에서 단계적으로 읽는 편이 더 명확하다 | artifact density가 더 커져 별도 drawer가 필요해질 때 | split panel 우선 검토 |
| Settings scope | 최소 read-only 정보 패널만 first ship에 포함 | 현재 위치 복구와 환경 인지에는 필요하지만 write surface로 커지면 범위가 흔들린다 | later phase에서 실제 운영 편집 수요가 확인될 때 | 경로 표시 + 검증 레인 표시 + manual refresh + source contract summary만 유지 |

## 14. Open Questions
- 없음. `docs/dev-04-pmw-read-surface-mockup.html` revised mockup은 2026-04-19에 승인되었다.

## 15. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Detailed function agreement | yes | human operator | closed | 큰그림/작은그림/artifact drill-down, 6개 도메인 라벨, 미로 방지 re-entry contract, settings 최소 범위까지 확인됨 |
| Detailed UI/UX agreement | yes | human operator | closed | revised mockup은 `프로젝트 개요 상단 + 현재 진행 상황 중단 + 주요 산출물/설정 하단` 구조로 승인되었고, 이제 같은 계약으로 구현을 진행한다 |
| Ready For Code sign-off | yes | human operator | closed | mockup 승인과 함께 DEV-04 코드 착수 승인이 내려졌다 |

## 16. Implementation Notes
- DOM/presentation layer는 `DEV-03` read model을 소비만 하고 직접 DB를 읽지 않는다.
- strong surface copy는 parser/fallback 결과만 사용한다.
- artifact viewer와 diagnostics는 secondary surface로 두되 source trace 접근성은 유지한다.
- domain progress summary는 first ship에서 `work_item_registry.domainHint` 기반 집계로 시작하고, 미분류 항목은 숨기지 않고 `미분류`로 표기한다.
- 재진입 cue는 새로운 write surface를 추가하지 않고 existing next action, handoff, active packet reference만으로 구성한다.
- first ship은 dependency 최소화와 deterministic behavior를 우선한다.

## 17. Verification Plan
- packet 승인 후 big-picture/small-picture/re-entry state mapping unit test 추가
- browser evidence로 30-second comprehension check 수행
- overview tab, re-entry cue, `needs source`, stale, empty, blocking error, artifact preview, diagnostics dock 시나리오 확인
- raw prose leakage와 count/detail parity를 reviewer checklist로 검증

## 18. Reopen Trigger
- big-picture source contract가 바뀜
- domain progress source가 `domainHint`가 아니게 바뀜
- 승인된 6개 도메인 라벨 세트가 바뀜
- re-entry contract가 바뀜
- read-only boundary가 바뀜
- current-situation card interaction model이 바뀜
- diagnostics hierarchy가 바뀜
- artifact viewer mandatory scope가 바뀜
