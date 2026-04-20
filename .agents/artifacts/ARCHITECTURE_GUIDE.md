# Architecture Guide

## Summary
아키텍처는 `DB truth + Markdown truth + generated docs + read-only PMW`의 4층 구조를 기본값으로 하되, 운영 중 발견한 비효율을 축적하고 개선 과제로 승격하는 feedback loop를 교차 규칙으로 둔다.

## Core Boundaries
- Hard Core State: repo-local DB for hot-state and AI-oriented operational metadata
- Context Canonical Docs: Markdown for goals, rationale, approvals, and human-readable operating context
- Projection and Generation: generated state docs / PMW read model
- PMW Read Surface: summary cards, detail panel, artifact viewer, settings
- Improvement Memory: recurring inefficiency records and promoted improvement tasks

## Operating Principles
- Context continuity: state, rationale, handoff, and source trace must support fast context restoration across sessions and agents.
- SOP compliance: approved workflows, gates, validators, and cutover order are part of the architecture contract, not optional process notes.
- Human in the loop: architecture keeps explicit approval boundaries where human judgment must confirm or override automation.
- Decision-ready communication: user-facing decision packets and PMW decision surfaces must minimize interpretation load while preserving enough evidence for approval, adjustment, or defer.
- Progressive elaboration: rough baseline documents set direction, but concrete work items must pass a more detailed planning/design agreement before implementation.

## Non-Negotiable Rules
- hot-state와 AI가 반복적으로 조회해야 하는 운영 신호는 DB single write surface로 유지한다.
- context docs는 사람이 충분히 이해하고 승인할 수 있는 Markdown canonical truth로 유지한다.
- `.agents/artifacts/REQUIREMENTS.md`는 가장 사용자 친화적인 기준 문서이며, 사용자 최종 확정 전에는 downstream baseline 문서를 새 기준선으로 sync하지 않는다.
- 사용자가 결정을 내려야 하는 문서와 surface는 `권장 결론`, `핵심 근거`, `예외 조건`, `fallback`을 함께 제공해 raw trade-off 재해석 부담을 줄인다.
- rough baseline 승인만으로 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`를 코드에서 확정하지 않는다.
- 실제 구현은 task-level packet이 상세 동작, 상태, 화면, edge case, acceptance, approval boundary를 닫은 뒤에만 시작한다.
- generated docs는 fallback / projection 결과다.
- PMW는 read-only다.
- strong surface는 designated user-facing summary만 consume한다.
- 디자인 목업은 실제 data contract, source-to-surface mapping, 상태 전이와 맞아야 한다.
- non-blocking diagnostics는 secondary layer로 내린다.
- handoff, generated docs, PMW detail은 context continuity를 깨지 않도록 source trace와 복원 경로를 남긴다.
- SOP 예외는 묵시적으로 처리하지 않고 기록 가능한 change path를 통해서만 허용한다.
- high-risk change, cutover, security exception은 human approval boundary 없이 닫지 않는다.

## Initial Design Direction
- DB schema는 `release_state`, `work_item_registry`, `decision_registry`, `gate_risk_registry`, `handoff_log`, `artifact_index`, `generation_state` 7개 최소 집합으로 시작한다.
- `project_registry`, dedicated `improvement_log`, dedicated `quality_review_log`는 first ship core schema에서 제외하고 follow-up packet으로 미룬다.
- generated docs는 `CURRENT_STATE.md`, `TASK_LIST.md` 두 개만 first ship 대상으로 본다.
- validator first-ship scope는 required section presence, source_ref resolve, generated docs parity, checksum/freshness drift, count/detail parity, UTF-8/mojibake, cutover preflight로 고정한다.
- PMW는 top 4-card rail + active detail + artifact viewer + settings까지만 first ship mandatory이며, artifact viewer mandatory scope는 canonical docs, generated docs, latest handoff로 제한한다.
- security automation은 path/file operation, dependency inventory, secret scan, cutover rollback presence preflight까지만 자동화하고 최종 보안 판단은 human gate에 남긴다.
- requirements, approval, rationale은 Markdown에 남기고, AI가 빠르게 소비해야 하는 변경성 높은 상태와 유지보수 신호만 구조화해 DB에 둔다.
- recurring inefficiency capture와 quality/security review 결과는 first ship에서는 대응 문서 또는 existing DB-backed operational record에 남기고, dedicated log 분리는 follow-up packet에서 재평가한다.
- first ship에는 context restoration load order와 drift validator/recovery path가 반드시 포함된다.

## Work Packet Contract
- baseline requirements, architecture, implementation, UI 문서는 방향과 guardrail을 정하는 상위 계약이다.
- 각 실제 구현 작업은 별도의 task-level packet으로 다시 닫는다.
- task-level packet은 최소 `goal`, `in-scope/out-of-scope`, `detailed behavior`, `screen/state changes`, `data/source impact`, `edge cases`, `acceptance`, `human approval boundary`를 포함한다.
- 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`를 다루는 packet은 상세 기능 기획 또는 상세 화면 설계 없이 구현하지 않는다.
- task-level packet 기본 형식은 `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`를 따른다.
- 구현 중 packet과 실제 코드가 어긋나면 코드로 밀어붙이지 않고 packet을 다시 열어 human sync를 먼저 수행한다.

## Context Restoration Flow
1. `release_state`와 현재 generation metadata를 먼저 읽어 현재 stage와 freshness를 판단한다.
2. open decision, gate risk, next action을 읽어 현재 판단 지점을 조립한다.
3. 가장 최근 handoff와 designated summary를 읽어 역할 전환과 최근 맥락을 복원한다.
4. strong surface 항목마다 source trace를 연결해 canonical context로 다시 내려갈 수 있게 한다.
5. freshness 또는 checksum mismatch가 있으면 stale 상태를 표기하고, cutover는 human confirmation 전까지 열지 않는다.

## Drift Handling Contract
- validator는 DB truth, generated docs, designated summary 간 checksum/freshness mismatch를 감지한다.
- drift가 감지되면 read surface는 stale 상태를 표시하고, silent overwrite를 하지 않는다.
- recovery path는 `re-generate -> re-validate -> human confirm` 또는 `rollback to last known good snapshot` 중 하나로 닫는다.
- cutover와 release gate는 unresolved drift 상태에서 진행하지 않는다.

## Self-Improvement Promotion Contract
- AI는 friction을 기록하고 improvement candidate를 제안할 수 있지만, baseline 문서나 SOP를 직접 바꾸지 않는다.
- promotion은 human review를 거쳐 change request 또는 backlog item으로만 승격한다.
- 승인되지 않은 improvement candidate는 참고 메모로만 남고 architecture baseline을 바꾸지 않는다.

## Quality And Security Boundaries
- 각 개발 작업 단위는 다음 작업으로 넘어가기 전에 refactor checkpoint를 통과한다.
- security review는 코드 경로, 스크립트, dependency 변경, secret handling, file/path operation, cutover 절차를 포함한다.
- critical security finding이 남아 있으면 cutover를 열지 않는다.
- 반복되는 비효율은 기록만 하고 끝내지 않고, 패턴이 누적되면 architecture 또는 process 개선 항목으로 승격한다.

## Deferred by Default
- write boundary
- dense analytics wall
- archive/starter/reset viewer
- downstream rollout
- remote sync or multi-user coordination
