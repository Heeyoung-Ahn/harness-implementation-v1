# PKT-01 Work Item Packet Template

## Purpose
이 문서는 한 개의 구현 작업을 코드 착수 전에 다시 닫기 위한 task-level planning/design packet template이다. rough baseline 승인만으로 바로 구현하지 않게 하고, 특히 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`는 인간과 충분히 협의한 뒤 구현하게 만드는 것이 목적이다.

## Approval Rule
- 이 packet은 구현 전에 작성한다.
- `프로그램 기능과 UI/UX`를 건드리는 작업은 human sync 또는 approval 없이는 `Ready For Code`로 올리지 않는다.
- 구현 중 새 detail이 생기면 이 packet을 다시 열고 sync한 뒤 진행한다.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | [작업 이름] | [왜 지금 하는지] | draft |
| Ready For Code | approve / adjust / hold | [코드 착수 가능 여부 근거] | draft |
| Human sync needed | yes / no | [왜 필요한지] | draft |
| User-facing impact | none / low / medium / high | [영향 영역] | draft |
| Risk if started now | low / medium / high | [남아 있는 모호성] | draft |

## 1. Goal
- [이 작업이 해결해야 하는 핵심 목표]

## 2. Non-Goal
- [이번 작업에서 하지 않을 것]

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
- 작업 후 사용자가 체감해야 하는 변화:

## 4. In Scope
- [이번 작업에 포함되는 기능]

## 5. Out Of Scope
- [이번 작업에 포함되지 않는 기능]

## 6. Detailed Behavior
- Trigger:
- Main flow:
- Alternate flow:
- Empty state:
- Error state:
- Loading/transition:

## 7. Program Function Detail
- 입력:
- 처리:
- 출력:
- 권한/조건:
- edge case:

## 8. UI/UX Detailed Design
- 영향받는 화면:
- 레이아웃 변경:
- interaction:
- copy/text:
- feedback/timing:
- source trace fallback:

## 9. Data / Source Impact
- DB / state 영향:
- Markdown / docs 영향:
- generated docs 영향:
- validator / cutover 영향:

## 10. Acceptance
- [사용자가 확인 가능한 acceptance 1]
- [사용자가 확인 가능한 acceptance 2]
- [검증 가능한 acceptance 3]

## 11. Open Questions
- [아직 닫히지 않은 질문]

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Detailed function agreement | yes / no | [owner] | pending | [비고] |
| Detailed UI/UX agreement | yes / no | [owner] | pending | [비고] |
| Ready For Code sign-off | yes / no | [owner] | pending | [비고] |

## 13. Implementation Notes
- [구현 시 참고할 제약]

## 14. Verification Plan
- [어떻게 검증할지]

## 15. Reopen Trigger
- 아래 상황이 생기면 packet을 다시 연다.
- 사용자-facing detail이 새로 생김
- 상태 전이 또는 화면 구성이 바뀜
- acceptance가 달라짐
- human approval boundary가 바뀜
