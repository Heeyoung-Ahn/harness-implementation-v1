# PKT-01 DEV-02 Generated State Docs And Drift Validator

## Purpose
이 packet은 `DEV-02 generated state docs and drift validator`를 코드 착수 전에 다시 닫기 위한 task-level planning/design packet이다. 이 작업은 직접적인 UI 구현은 아니지만, `CURRENT_STATE.md`, `TASK_LIST.md`, stale/freshness 판단, source trace fallback, cutover preflight의 기반이 되므로 문서 구조와 validator 범위를 먼저 닫아야 한다.

## Approval Rule
- 이 packet은 generated docs/validator 구현 전에 작성한다.
- 이 작업은 직접적인 `프로그램 기능과 UI/UX` 화면 변경은 아니지만, PMW가 소비하는 designated summary contract를 만들기 때문에 문서 구조는 human-readable하고 deterministic해야 한다.
- summary/detail/source trace/drift 판단 규칙이 바뀌면 이 packet을 다시 연다.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | DEV-02 generated state docs and drift validator | PMW strong surface와 cutover gate의 기반을 만든다 | draft |
| Ready For Code | approve | source-to-surface mapping과 validator scope가 문서에서 이미 승인되었다 | draft |
| Human sync needed | yes | generated doc section structure는 downstream PMW와 validator가 같이 소비한다 | draft |
| User-facing impact | medium | 직접 UI는 아니지만 PMW가 읽는 designated summary 품질을 결정한다 | draft |
| Risk if started now | medium | section 구조를 잘못 잡으면 raw prose leakage와 parity drift가 반복된다 | draft |

## 1. Goal
- `CURRENT_STATE.md`, `TASK_LIST.md`를 deterministic generated doc으로 만든다.
- approved designated summary section을 문서 구조로 고정한다.
- first-ship validator scope 중 generated docs parity, required section presence, source_ref resolve, checksum/freshness drift, count/detail parity, UTF-8/mojibake, cutover preflight를 구현한다.

## 2. Non-Goal
- PMW rendering 구현
- browser UI validation
- deployment cutover 실행기
- user-only duplicate docs
- advanced threat/security automation beyond approved preflight scope

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  DB truth와 generated docs 사이 contract가 아직 코드로 존재하지 않아 downstream surface가 기대는 문서 구조가 없다.
- 작업 후 사용자가 체감해야 하는 변화:
  generated docs가 항상 같은 구조로 생성되고, drift나 missing source가 생기면 validator가 명시적으로 잡아준다.

## 4. In Scope
- `CURRENT_STATE.md` generator
- `TASK_LIST.md` generator
- generation_state checksum/freshness update
- designated summary parser/validator
- parity/source/UTF-8/cutover preflight validation

## 5. Out Of Scope
- PMW UI cards 구현
- mockup 변경
- migration engine 전체
- deep security review automation

## 6. Detailed Behavior
- Trigger:
  DB truth snapshot을 generated docs로 projection할 때
- Main flow:
  snapshot build -> deterministic markdown render -> file write -> generation_state refresh -> validator check
- Alternate flow:
  required source가 없거나 generated docs가 stale면 validator가 explicit finding을 반환
- Empty state:
  open decision/risk/work item/handoff가 없으면 empty summary와 empty detail을 deterministic하게 렌더링
- Error state:
  missing required section, checksum mismatch, invalid source_ref, BOM/mojibake, parity mismatch는 finding으로 보고
- Loading/transition:
  read model은 generation metadata로 freshness를 판단할 수 있어야 한다

## 7. Program Function Detail
- 입력:
  release_state, decision_registry, gate_risk_registry, work_item_registry, handoff_log, generation_state
- 처리:
  designated summary를 포함한 markdown projection 생성과 validator rule evaluation
- 출력:
  `CURRENT_STATE.md`, `TASK_LIST.md`, validator result
- 권한/조건:
  generated docs는 사람이 직접 편집하는 primary truth가 아니다
- edge case:
  empty doc, stale generation metadata, source 없는 row, summary/detail count mismatch, tampered file

## 8. UI/UX Detailed Design
- 영향받는 화면:
  직접 없음. 다만 PMW가 읽는 designated summary section contract를 제공한다.
- 레이아웃 변경:
  없음
- interaction:
  없음
- copy/text:
  summary line은 사람이 빠르게 읽을 수 있어야 하며, raw technical prose를 직접 투영하지 않는다
- feedback/timing:
  freshness drift가 있으면 downstream이 stale state를 표시할 수 있어야 한다
- source trace fallback:
  source 없는 항목은 `needs source` fallback 또는 explicit finding으로 처리한다

## 9. Data / Source Impact
- DB / state 영향:
  `generation_state` checksum, generated_at, freshness_state 갱신
- Markdown / docs 영향:
  root에 `CURRENT_STATE.md`, `TASK_LIST.md` 생성 가능
- generated docs 영향:
  section structure와 detail ordering이 deterministic해야 한다
- validator / cutover 영향:
  unresolved drift가 있으면 cutover preflight는 pass하지 않는다

## 10. Acceptance
- `CURRENT_STATE.md`에는 `## Current Focus Summary`, `## Decision Required Summary`가 존재한다.
- `TASK_LIST.md`에는 `## Blocked / At Risk Summary`가 존재한다.
- generated docs와 generation_state checksum/freshness가 일치할 때 validator가 pass한다.
- summary count와 detail count가 같은 source에서 파생된다.
- source_ref가 존재하면 repo-relative path로 resolve된다.
- UTF-8/BOM/mojibake 문제가 있으면 validator가 finding으로 보고한다.

## 11. Open Questions
- validator result를 어떤 JSON shape로 노출할지
- cutover preflight를 DEV-02에서 얼마나 단순하게 둘지

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Detailed function agreement | yes | human operator | pending | section structure와 validator scope 재확인 |
| Detailed UI/UX agreement | no | n/a | n/a | direct UI work item 아님 |
| Ready For Code sign-off | yes | human operator | pending | generated doc contract와 findings shape 확인 |

## 13. Implementation Notes
- parser보다 먼저 generated doc section contract를 deterministic하게 고정한다.
- summary와 detail은 같은 source list에서 파생한다.
- validator는 auto-heal보다 explicit finding을 우선한다.

## 14. Verification Plan
- in-memory store와 temp workspace에서 generated docs write/read 검증
- checksum mismatch tamper case 검증
- required section / source_ref / UTF-8 / parity finding 검증

## 15. Reopen Trigger
- designated summary section 이름이 바뀜
- PMW source-to-surface mapping이 바뀜
- validator mandatory scope가 늘어나거나 줄어듦
- generated docs가 user-editable truth로 바뀜
