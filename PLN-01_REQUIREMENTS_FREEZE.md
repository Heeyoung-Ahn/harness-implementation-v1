# PLN-01 Requirements Freeze

## Status
- Freeze status: `approved`
- Freeze source: `PLN-00_DEEP_INTERVIEW.md`
- Freeze scope: first-ship baseline requirements
- Downstream sync status: `completed`

## Freeze Summary
이번 freeze의 목적은 rough requirements를 implementation-ready baseline으로 고정하고, downstream 문서와 이후 work item packet이 같은 기준선을 공유하게 만드는 것이다.

이번 freeze에서 다음 기준선이 확정되었다.
- DB start scope는 `release_state`, `work_item_registry`, `decision_registry`, `gate_risk_registry`, `handoff_log`, `artifact_index`, `generation_state` 7개 최소 집합으로 시작한다.
- validator first-ship scope는 required section presence, source_ref resolve, generated docs parity, checksum/freshness drift, count/detail parity, UTF-8/mojibake, cutover preflight로 고정한다.
- PMW artifact viewer mandatory scope는 canonical docs, generated docs, latest handoff로 제한한다.
- recurring inefficiency capture는 DB capture -> human review -> Markdown promotion 순서로 운영한다.
- security automation은 path/file operation, dependency inventory, secret scan, cutover rollback presence preflight까지만 자동화하고 최종 판단은 human gate에 남긴다.
- 최초 baseline 문서는 rough 방향 문서일 수 있지만, 구현은 각 work item의 task-level packet과 human sync를 거쳐야 한다.
- 특히 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`는 task-level 상세 기획과 상세 디자인 협의 없이 코드에서 먼저 확정하지 않는다.

## Frozen Baseline
### Requirements
- `REQUIREMENTS.md`는 first-ship 기준 문서로 frozen 상태다.
- 현재 문서에 남아 있는 내용은 open question이 아니라 approved baseline으로 본다.

### Architecture
- `ARCHITECTURE_GUIDE.md`는 approved DB minimum, validator scope, artifact viewer scope, security preflight boundary로 sync되어야 한다.

### Implementation
- `IMPLEMENTATION_PLAN.md`는 `PKT-01` work-item loop를 포함한 실행 순서를 기준으로 삼는다.

### UI Design
- `UI_DESIGN.md`는 rough baseline과 task-level detailed design을 분리하는 규칙을 기준으로 삼는다.

## Human Approval Boundary
- 이 freeze는 first-ship 방향과 baseline requirements를 승인한 것이다.
- 이 freeze가 각 work item의 최종 behavior, 세부 기능, 세부 UI/UX를 자동 승인하는 것은 아니다.
- 이후 구현은 각 work item packet에서 다시 닫아야 한다.

## Next Step
- next packet: `PKT-01_DEV-01_DB_FOUNDATION.md`
- goal: first-ship DB foundation 구현을 코드 착수 가능 상태로 닫는다.
