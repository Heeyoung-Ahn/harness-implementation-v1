# PKT-01 DEV-01 DB Foundation

## Purpose
이 packet은 `DEV-01 DB schema and store foundation`을 코드 착수 전에 다시 닫기 위한 task-level planning/design packet이다. 이 작업은 직접적인 사용자-facing UI 작업은 아니지만, 이후 generated docs, context restoration, PMW read model이 모두 이 foundation에 의존하므로 baseline과 상세 동작을 먼저 닫아야 한다.

## Approval Rule
- 이 packet은 DB foundation 구현 전에 작성한다.
- 이 작업은 직접적인 `프로그램 기능과 UI/UX` 변경은 아니므로 detailed UI/UX sign-off는 필수는 아니다.
- 다만 schema scope, source trace 규칙, generated docs/validator와의 연결 방식은 이 packet에서 닫아야 한다.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | DEV-01 DB schema and store foundation | first-ship 모든 downstream 기능의 상태 기반을 만든다 | draft |
| Ready For Code | approve | first-ship schema 범위와 제외 범위가 PLN-00/PLN-01에서 이미 닫혔다 | draft |
| Human sync needed | yes | store shape와 write boundary는 이후 packet들에 영향을 준다 | draft |
| User-facing impact | low | 직접 UI는 없지만 이후 read surface 품질에 간접 영향이 크다 | draft |
| Risk if started now | medium | store contract를 과도하게 넓히면 first-ship 범위가 다시 커질 수 있다 | draft |

## 1. Goal
- first-ship minimum schema 7개와 기본 store contract를 구현 가능 상태로 닫는다.
- 이후 DEV-02, DEV-03, DEV-04가 같은 DB truth contract를 읽을 수 있게 만든다.
- source trace, freshness, handoff, decision/risk/next action 복원에 필요한 필드를 빠뜨리지 않는다.

## 2. Non-Goal
- multi-project support
- dedicated `improvement_log` / dedicated `quality_review_log`
- PMW UI 구현
- generated docs renderer 완성
- migration/cutover automation 완성

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  repo-local hot-state를 어디에 어떻게 저장할지 아직 코드 계약이 없다.
- 작업 후 사용자가 체감해야 하는 변화:
  이후 packet들이 같은 DB truth를 기준으로 구현되고, 상태 복원/요약/validator가 한 write surface를 전제로 움직일 수 있다.

## 4. In Scope
- 7개 core entity schema 설계
- store initialization rule
- basic read/write boundary 정의
- source_ref rule
- optimistic concurrency 고려
- handoff append-only rule
- generation metadata shape

## 5. Out Of Scope
- user account / auth / multi-user
- external sync
- archive/starter/reset artifact handling
- improvement/quality dedicated log separation
- UI-facing projection formatting

## 6. Detailed Behavior
- Trigger:
  repo-local harness runtime이 first-ship operational state를 기록하거나 읽을 때
- Main flow:
  store initializes -> core tables/entities available -> operational writes persist to DB truth -> downstream readers consume same shape
- Alternate flow:
  existing store가 있으면 schema compatibility를 확인하고 continue
- Empty state:
  store file가 없으면 baseline schema로 초기화
- Error state:
  schema mismatch 또는 required field 누락 시 silent fallback 없이 explicit failure or stale/blocking signal
- Loading/transition:
  runtime start 시 release state와 generation metadata를 우선 읽을 수 있어야 한다

## 7. Program Function Detail
- 입력:
  release/work item/decision/risk/handoff/artifact/generation state payload
- 처리:
  repo-local DB truth에 schema-constrained write
- 출력:
  downstream packet이 재사용 가능한 read model source
- 권한/조건:
  single workspace, single-project first ship 기준
- edge case:
  partial write, stale generation metadata, missing source_ref, invalid handoff append, concurrency conflict

## 8. UI/UX Detailed Design
- 영향받는 화면:
  직접 없음
- 레이아웃 변경:
  없음
- interaction:
  없음
- copy/text:
  없음
- feedback/timing:
  후속 PMW stale/blocking signal의 기반이 되는 freshness metadata는 이 작업에서 준비한다
- source trace fallback:
  artifact_index와 source_ref rule이 후속 UI trace fallback의 기반이 된다

## 9. Data / Source Impact
- DB / state 영향:
  `release_state`, `work_item_registry`, `decision_registry`, `gate_risk_registry`, `handoff_log`, `artifact_index`, `generation_state`
- Markdown / docs 영향:
  schema 범위와 제외 범위는 문서 기준과 일치해야 한다
- generated docs 영향:
  `generation_state`와 source_ref rule이 DEV-02 기반이 된다
- validator / cutover 영향:
  drift validator와 cutover preflight가 읽을 최소 metadata를 제공해야 한다

## 10. Acceptance
- 7개 core entity와 store boundary가 문서 기준선과 일치한다.
- excluded scope인 `project_registry`, dedicated `improvement_log`, dedicated `quality_review_log`는 first-ship 구현에 끼워 넣지 않는다.
- downstream packet이 재해석 없이 reuse할 수 있는 field responsibility가 정리된다.
- source_ref, handoff append-only, generation metadata rule이 문서와 코드에서 같은 방향을 가리킨다.
- store foundation이 validator/generation/PMW packet을 막지 않는 최소 shape를 제공한다.

## 11. Open Questions
- DB engine 선택을 어떤 수준으로 고정할지
- migration strategy를 DEV-01에서 어디까지 포함할지
- optimistic concurrency를 first ship에서 field version으로 둘지 timestamp/update token으로 둘지

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Detailed function agreement | yes | human operator | pending | 7개 entity field responsibility와 excluded scope 재확인 |
| Detailed UI/UX agreement | no | n/a | n/a | direct UI work item 아님 |
| Ready For Code sign-off | yes | human operator | pending | DB engine / store contract를 보고 code start 여부 결정 |

## 13. Implementation Notes
- 기본 DB engine 권장값은 repo-local embedded SQLite다.
- runtime이 Node.js 기준을 만족하면 `node:sqlite`를 우선 검토한다. 이유는 native addon 없이 동작하고 prototype에서 Windows friction을 줄인 근거가 있기 때문이다.
- field naming은 downstream 문서 vocabulary와 맞춘다.
- store contract는 first-ship packet만 닫고 second-packet scope를 미리 흡수하지 않는다.
- silent auto-expansion보다 explicit schema change를 우선한다.

## 14. Verification Plan
- schema/entity list가 `REQUIREMENTS.md`와 `ARCHITECTURE_GUIDE.md` baseline과 일치하는지 확인
- excluded scope가 sneaky하게 포함되지 않았는지 확인
- DEV-02/03에서 필요한 generation/source/handoff/read order field가 빠지지 않았는지 확인

## 15. Reopen Trigger
- DB engine 선택이 바뀜
- core entity 수가 바뀜
- downstream packet이 새로운 mandatory field를 요구함
- direct UI requirement가 unexpectedly DB schema detail을 추가로 강제함
