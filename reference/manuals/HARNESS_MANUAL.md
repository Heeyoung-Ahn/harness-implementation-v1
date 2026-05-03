# Standard Harness Manual

이 문서는 PMW가 제거된 표준 하네스 운영 매뉴얼이다. 현재 baseline의 재진입 표면은 CLI와 active context artifact다.

## 핵심 원칙
- 사람용 SSOT는 `.agents/artifacts/*.md`의 한국어 운영 문서다.
- AI용 SSOT는 `.harness/operating_state.sqlite`, `.agents/runtime/ACTIVE_CONTEXT.json`, validation JSON처럼 구조화된 상태다.
- `.agents/runtime/generated-state-docs/*`와 `.agents/runtime/ACTIVE_CONTEXT.*`는 파생 출력이다. 직접 고치지 말고 하네스 명령으로 갱신한다.
- packet-before-code, 사용자 승인, Tester/Reviewer 분리, root/starter sync는 유지한다.

## 첫 명령
- `npm run harness:status`: 현재 단계, 담당, 다음 행동 확인
- `npm run harness:next`: 다음 작업 확인
- `npm run harness:context`: AI용 JSON과 사람용 한국어 active context 생성
- `npm run harness:doctor`: 하네스 상태 점검
- `npm run harness:validate`: validator 실행
- `npm run harness:validation-report`: 검증 리포트 생성

## Active Context
- `.agents/runtime/ACTIVE_CONTEXT.json`: AI가 빠르게 읽는 compact 상태
- `.agents/runtime/ACTIVE_CONTEXT.md`: 사람이 읽는 한국어 상태 요약
- 포함 내용: 현재 작업, 다음 작업, 열린 결정, 막힘, 최근 handoff, 검증 상태, source trace

## Starter 설치 후 확인
1. `npm run harness:init`
2. `npm run harness:context`
3. `npm run harness:status`
4. `npm run harness:validate`

## 구현 작업 전 확인
- 활성 packet이 `Ready For Code` 승인 상태인지 확인한다.
- `CURRENT_STATE.md`, `TASK_LIST.md`, `IMPLEMENTATION_PLAN.md`, 활성 packet을 읽는다.
- active context가 현재 작업과 같은 task를 가리키는지 확인한다.

## 구현 작업 후 확인
- root test와 `standard-template` test를 실행한다.
- `npm run harness:validate`를 실행한다.
- `npm run harness:validation-report`를 실행한다.
- `npm run harness:context`를 실행해 재진입 상태를 갱신한다.
- closeout에는 Current Work와 Next Work를 남긴다.

## 문제 해결
- active context가 오래된 작업을 가리키면 DB hot-state, `CURRENT_STATE.md`, `TASK_LIST.md`, 최신 handoff를 먼저 맞춘 뒤 `harness:context`를 다시 실행한다.
- generated docs freshness 오류가 나면 generated docs를 하네스 경로로 재생성하고 validator를 다시 실행한다.
- packet 등록 오류가 나면 `artifact_index`의 `task_packet` 등록과 packet header/evidence를 맞춘다.
