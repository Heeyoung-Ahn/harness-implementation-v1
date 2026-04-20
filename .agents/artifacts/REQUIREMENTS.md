# Requirements

## Summary
이 프로젝트의 목표는 하네스가 스스로 유지·개선 가능한 운영 구조를 가지면서, 최종사용자가 PMW 첫 화면과 핵심 아티팩트만으로 현재 판단 지점을 빠르게 이해할 수 있게 하는 것이다. `REQUIREMENTS.md`는 전체 문서 중 가장 사용자 친화적인 기준 문서로 유지하며, `PLN-00_DEEP_INTERVIEW.md`와 `PLN-01_REQUIREMENTS_FREEZE.md`를 통해 first-ship baseline이 닫힌 상태로 관리한다.

## Project Goal

### 추진목적
1. hot-state 변경은 하나의 write surface만 수정하게 만든다.
2. PMW에서 파일 탐색 없이 필요한 artifact를 읽게 만든다.
3. user-facing 정보와 technical context를 같은 canonical 문서 안에서 계층적으로 분리한다.
4. 하네스가 운영 중 비효율을 기록하고, 누적되면 스스로 개선 과제로 승격할 수 있게 만든다.
5. read-only 기본값을 유지하면서도 future write boundary를 명확히 예약한다.

### 기대효과
1. 상태 변경 시 수정 비용과 정합도 유지 비용을 줄인다.
2. 최종사용자가 첫 화면에서 지금 판단해야 할 내용과 다음 행동을 빠르게 이해한다.
3. AI는 데이터베이스 기반의 구조화된 상태를 더 쉽게 이해하고, 사람은 Markdown 기반의 설명과 맥락을 더 쉽게 검토한다.
4. 개발 완료 단위마다 리팩터링과 보안 점검을 포함해 누적 품질 저하를 줄인다.

### 최종사용자
- PMW 첫 화면에서 현재 판단 지점과 운영 상태를 빠르게 읽어야 하는 사용자
- 하네스를 유지·개선하는 AI 에이전트
- 승인, 리뷰, 운영 맥락을 관리하는 사람 운영자

## Operating Principles
1. 맥락 유지: 하네스는 세션, 역할, 턴이 바뀌어도 현재 상태와 판단 근거를 복원할 수 있어야 한다. 상태 변경은 source trace와 함께 남고, handoff와 generated docs는 맥락 복원을 돕는 방향으로 유지한다.
2. SOP 준수: 승인된 workflow, gate, validation rule, cutover sequence는 임의로 우회하지 않는다. SOP 변경이 필요하면 requirements 또는 architecture 수준 변경으로 올린다.
3. human in the loop: requirements freeze, architecture sync, mockup approval, cutover, security risk acceptance 같은 핵심 판단은 사람 승인 지점을 명시적으로 둔다.
4. decision-ready authoring: 결정 요청 문서는 사용자가 raw trade-off를 다시 해석하지 않게, `최대한 쉽게` 읽히면서도 `충분한 근거`를 함께 제공하는 형식으로 작성한다.
5. progressive elaboration: 최초 requirements, architecture, implementation plan, UI design은 러프한 기준선일 수 있지만, 실제 작업 단위에 들어갈 때는 더 구체적인 task-level planning과 design agreement를 거쳐야 한다.

## Authoring And Approval Workflow
1. `REQUIREMENTS.md` 작성은 구현에 필요한 이슈, 제약, 승인 기준, 보안 기대치가 닫히거나 명시적으로 deferred 될 때까지 deep interview를 진행한다.
2. 사용자의 최종 확정 전에는 `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `UI_DESIGN.md`를 새 기준선으로 작성하거나 sync하지 않는다.
3. requirements 확정 후에만 architecture, implementation, UI 문서를 같은 turn에서 같은 기준선으로 정렬한다.
4. 디자인 목업은 시각 참고 자료가 아니라 실제 구현 로직, source-to-surface mapping, 상태 전이, read-only 경계를 반영하는 설계 입력물이어야 한다.
5. requirements 변경이 승인되면 downstream 문서와 mockup도 같은 변경 요청 범위 안에서 다시 맞춘다.
6. 사용자가 결정을 내려야 하는 packet은 최소한 `권장 결론`, `핵심 근거`, `조정이 필요한 조건`, `defer 시 임시 규칙`을 함께 보여 준다.
7. 각 구현 작업은 코드 착수 전에 task-level packet으로 다시 구체화한다. 이 packet에는 작업 목표, 범위, 상세 동작, 화면/상태 변화, edge case, acceptance, human check point가 포함되어야 한다.
8. 특히 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`는 task-level 상세 기획과 상세 디자인에 대해 인간과 협의 또는 승인 없이 코드로 먼저 확정하지 않는다.

## In Scope
- repo-local DB truth for hot-state and AI가 빠르게 이해해야 하는 운영 메타데이터
- 사람이 읽고 승인할 수 있는 Markdown canonical docs
- generated state docs
- PMW read-only summary/detail/artifact viewer/settings
- designated user-facing summary contract
- context restoration flow with explicit load order and source trace
- DB truth, generated docs, canonical summaries 간 drift detection and recovery rule
- recurring inefficiency capture와 improvement backlog 운영
- 개발 완료 단위마다 수행하는 refactor checkpoint
- 코드와 스크립트, dependency, cutover 절차를 포함한 security review process
- validator / migration / cutover contract

## Out of Scope
- 기존 코드 재사용
- PMW write enable
- starter/downstream rollout
- separate user-only duplicate docs
- 외부 SaaS / remote sync

## Acceptance
- deep interview가 구현 핵심 이슈를 닫거나, deferred 항목은 owner와 follow-up rule이 기록된다.
- 사용자가 결정을 내려야 하는 문서는 권장 결론과 충분한 근거를 함께 제공하고, 예외 조건과 defer fallback을 분리해 보여 준다.
- `REQUIREMENTS.md`가 사용자 최종 확정된 뒤에만 architecture / implementation / UI baseline 문서가 작성되거나 재정렬된다.
- 최초 requirements, architecture, implementation plan, UI design은 러프 기준선으로 승인될 수 있지만, 이것만으로 세부 구현이 자동 승인된 것으로 간주하지 않는다.
- 각 구현 작업은 task-level 상세 기획과 필요한 경우 상세 화면 설계를 거쳐야 하며, 특히 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`는 인간 협의 또는 승인 후 구현된다.
- 하네스가 세션 전환 후에도 핵심 상태, 판단 근거, 다음 행동을 source trace와 함께 복원할 수 있다.
- context restoration은 최소 `release state -> open decisions/risks -> next action -> recent handoff -> source trace` 순서로 복원 가능해야 한다.
- 승인된 SOP와 실제 운영 절차가 일치하고, 예외는 기록된다.
- 사람 승인 지점이 필요한 단계에서 human in the loop가 빠지지 않는다.
- DB, generated docs, canonical summary 사이 drift는 validator가 감지하고 stale 상태를 표시하며, cutover 전에는 재생성 또는 rollback 경로가 명시된다.
- generated docs deterministic / parity pass
- 지정된 reviewer가 PMW first view만 보고 30초 안에 `무엇을 결정해야 하는지`, `무엇이 막고 있는지`, `다음에 무엇을 해야 하는지` 세 질문에 답할 수 있다.
- summary/detail/source trace/count parity pass
- raw technical prose direct projection 금지
- design mockup과 implemented UI가 같은 source-to-surface mapping과 concrete behavior contract를 공유한다.
- validator가 drift / missing source / mojibake / cutover mismatch를 검출
- migration preview와 rollback path가 문서 / 스크립트 / 검증에서 일치
- 각 개발 작업 단위 종료 시 refactor review와 cleanup decision이 기록된다.
- release / cutover 전에 security review가 수행되고 critical finding이 남지 않는다.
- self-improvement candidate는 human review를 거쳐야만 change request 또는 baseline update로 승격된다.

## PLN-00 Decision Baseline
- Minimal DB start scope: `approve`
  `release_state`, `work_item_registry`, `decision_registry`, `gate_risk_registry`, `handoff_log`, `artifact_index`, `generation_state` 7개 테이블 최소 집합으로 시작한다.
- First-ship validator scope: `approve`
  required section presence, source_ref resolve, generated docs parity, checksum/freshness drift, count/detail parity, UTF-8/mojibake, cutover preflight를 first ship 범위로 고정한다.
- PMW artifact viewer mandatory scope: `approve`
  canonical docs, generated docs, latest handoff를 mandatory scope로 두고 archive/starter/reset viewer는 rollout lane으로 둔다.
- Inefficiency capture projection: `approve`
  raw capture는 DB truth에 기록하고, human review를 통과한 promoted item만 Markdown summary로 올린다.
- Security review automation level: `approve`
  path/file operation, dependency inventory, secret scan, cutover rollback presence까지만 자동화하고 핵심 보안 판단은 human review gate에 남긴다.
