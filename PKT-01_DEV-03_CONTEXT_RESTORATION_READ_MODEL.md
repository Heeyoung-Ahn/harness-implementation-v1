# PKT-01 DEV-03 Context Restoration Read Model

## Purpose
이 packet은 `DEV-03 context restoration read model`을 코드 착수 전에 다시 닫기 위한 task-level planning/design packet이다. 이 작업은 PMW UI 구현 전 단계로, generated docs와 designated operator section을 읽어 `Decision / Blocked / Focus / Next`를 같은 계약으로 복원하는 읽기 전용 계층을 만든다.

## Approval Rule
- 이 packet은 read model 구현 전에 작성한다.
- 직접적인 `프로그램 기능과 UI/UX` 화면 구현은 아니지만, PMW first view가 읽는 strong surface contract를 결정하므로 summary source와 stale handling rule은 human-readable해야 한다.
- load order, designated summary source, stale diagnostics priority가 바뀌면 이 packet을 다시 연다.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | DEV-03 context restoration read model | PMW가 raw prose 대신 approved source-to-surface contract를 읽게 만든다 | draft |
| Ready For Code | approve | generated docs와 operator section source mapping이 문서에서 이미 승인되었다 | draft |
| Human sync needed | yes | `Next Action` designated section과 stale fallback wording은 사람이 읽는 기준선과 맞아야 한다 | draft |
| User-facing impact | medium | 직접 UI는 아니지만 PMW first view의 판단 속도와 source trace 구조를 결정한다 | draft |
| Risk if started now | medium | summary source를 잘못 읽으면 raw prose leakage와 stale signal 누락이 반복된다 | draft |

## 1. Goal
- context restoration load order를 코드로 고정한다.
- generated docs designated summary와 `IMPLEMENTATION_PLAN.md > ## Operator Next Action`을 읽어 strong surface summary를 만든다.
- stale/freshness 판단, latest handoff, source trace를 read model에 포함한다.

## 2. Non-Goal
- PMW UI 렌더링
- browser layout 또는 styling
- write boundary 추가
- artifact viewer 전체 구현
- validator mandatory scope 확대

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  state docs는 생성되지만, 세션 전환 시 무엇을 어떤 순서로 읽어 `Decision / Blocked / Focus / Next`를 복원할지 조립하는 계층이 없다.
- 작업 후 사용자가 체감해야 하는 변화:
  PMW 또는 후속 소비 계층이 approved designated summary만 읽어 빠르게 현재 판단 지점을 복원하고, stale 상태도 함께 인지할 수 있다.

## 4. In Scope
- context restoration snapshot/read model builder
- generated docs designated summary parser
- `IMPLEMENTATION_PLAN.md > ## Operator Next Action` parser
- latest handoff/load order/source trace assembly
- stale diagnostics exposure

## 5. Out Of Scope
- PMW component render
- artifact drawer full UX
- hero/product goal parser
- direct write/edit action
- security/cutover automation 추가 구현

## 6. Detailed Behavior
- Trigger:
  generated docs가 존재하는 workspace에서 현재 상태를 PMW-friendly snapshot으로 복원할 때
- Main flow:
  release/generation metadata read -> open decisions/risks/next action read -> latest handoff read -> source trace attach -> stale diagnostics attach
- Alternate flow:
  designated summary section이 없으면 strong surface는 `needs source` fallback을 노출하고 diagnostics에 missing section을 남긴다
- Empty state:
  open decision/risk/handoff가 없으면 deterministic empty summary와 empty detail을 유지한다
- Error state:
  generated docs drift, checksum mismatch, missing file/section은 stale diagnostics로 surface에 전달한다
- Loading/transition:
  read model은 generated docs를 mutate하지 않고 read-only snapshot만 반환한다

## 7. Program Function Detail
- 입력:
  `release_state`, `decision_registry`, `gate_risk_registry`, `work_item_registry`, `handoff_log`, `generation_state`, generated docs, `IMPLEMENTATION_PLAN.md`
- 처리:
  approved load order에 따라 summary/detail/source trace/diagnostics를 조립
- 출력:
  context restoration read model JSON object
- 권한/조건:
  strong surface summary는 designated summary section 또는 explicit fallback만 사용한다
- edge case:
  missing generated docs, missing operator section, stale generation metadata, no open items, handoff 없음

## 8. UI/UX Detailed Design
- 영향받는 화면:
  upcoming PMW first view와 detail panel
- 레이아웃 변경:
  이번 packet 범위 아님
- interaction:
  없음. read-only snapshot만 제공
- copy/text:
  strong surface headline/supporting text는 designated summary에서만 가져온다
- feedback/timing:
  stale diagnostics는 blocking이 아니면 secondary지만, `stale` 여부 자체는 first view가 읽을 수 있어야 한다
- source trace fallback:
  summary source가 없으면 `needs source`, detail/source trace는 가능한 범위만 유지한다

## 9. Data / Source Impact
- DB / state 영향:
  read-only. 기존 store query API만 사용
- Markdown / docs 영향:
  `IMPLEMENTATION_PLAN.md`에 designated `## Operator Next Action` section 필요
- generated docs 영향:
  `CURRENT_STATE.md`, `TASK_LIST.md` designated summary를 read model input으로 사용
- validator / cutover 영향:
  validator finding이 있으면 read model은 stale 상태를 노출하고 cutover-ready false를 전달한다

## 10. Acceptance
- read model이 `release state -> decision/risk/next action -> recent handoff -> source trace -> stale diagnostics` 순서의 정보를 반환한다.
- `Decision Required`, `Blocked / At Risk`, `Current Focus` strong surface는 generated docs designated summary만 사용한다.
- `Next Action` strong surface는 `IMPLEMENTATION_PLAN.md > ## Operator Next Action`만 사용한다.
- designated summary가 없으면 raw prose를 대신 올리지 않고 `needs source` fallback을 반환한다.
- validator finding이 있으면 read model이 `stale` 상태와 diagnostics를 함께 반환한다.

## 11. Open Questions
- `Next Action` card에 supporting text를 몇 줄까지 노출할지
- stale diagnostics를 PMW에서 badge로만 올릴지 summary strip에도 올릴지

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Detailed function agreement | yes | human operator | pending | designated summary source와 fallback wording 재확인 |
| Detailed UI/UX agreement | no | n/a | n/a | direct UI packet은 DEV-04에서 다룸 |
| Ready For Code sign-off | yes | human operator | pending | read model JSON shape와 source trace contract 확인 |

## 13. Implementation Notes
- generated docs parser와 DB detail query를 분리하되 같은 read model 안에서 조립한다.
- strong surface와 detail item count는 같은 DB list에서 파생한다.
- stale detection은 validator 재사용을 우선한다.

## 14. Verification Plan
- fresh generated docs + operator section이 있을 때 summary/detail/source trace 복원 검증
- operator section이 없을 때 `needs source` fallback과 diagnostics 검증
- generated docs가 stale할 때 read model `stale` 상태와 cutover-ready false 검증

## 15. Reopen Trigger
- `Context Restoration Flow` load order가 바뀜
- `Next Action` canonical source가 `IMPLEMENTATION_PLAN.md`가 아니게 바뀜
- strong surface가 designated summary 외 source를 직접 읽도록 바뀜
- stale diagnostics priority rule이 바뀜
