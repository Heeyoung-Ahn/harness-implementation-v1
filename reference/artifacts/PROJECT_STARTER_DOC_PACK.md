# Project Starter Doc Pack

이 문서는 새 대규모 프로젝트를 시작할 때 먼저 닫아야 할 문서 팩 템플릿이다.
이 문서 자체가 SSOT는 아니다. 실제 정본은 `.agents/artifacts/*`, active packet, approved project artifacts에 들어간다.

## 사용 원칙

- 구현 전에 먼저 이 문서 팩을 채운다.
- 각 문서는 rough baseline이어도 되지만, 빈칸 상태로 구현을 시작하지는 않는다.
- 프로젝트별 상세 값은 packet과 approved project artifact로 내려간다.
- 아래 템플릿은 non-technical planner/operator가 큰 항목을 빠뜨리지 않게 하는 starter pack이다.
- 프로젝트 목적, 핵심 workflow, source-of-truth, 승인 경계, 운영 환경 중 implementation-critical 항목이 비어 있으면 planning hold를 유지한다.
- 이 문서 팩, `PLN-00_DEEP_INTERVIEW.md`, `PLN-01_REQUIREMENTS_FREEZE.md`가 충분히 닫히기 전에는 architecture / implementation / UI sync나 첫 task packet으로 넘어가지 않는다.

## Planner Stop Rule

- 이 문서 팩은 packet 대체물이 아니다. kickoff baseline을 채우는 입력물이다.
- 큰 항목이 비어 있으면 Planner는 질문을 더 진행해야 하며, chat 요약만 남기고 넘어가면 안 된다.
- rough baseline이라도 first version scope를 설명할 수 있어야 한다.
- blank cell이 scope, data, approval, deployment 판단에 영향을 주면 requirements freeze를 막는다.

## 1. Project Charter

- 프로젝트 목적:
- 해결하려는 문제:
- 주요 사용자:
- 성공 기준:
- 이번 버전 범위:
- 제외 범위:
- 일정 또는 단계 개요:

## 2. User Roles

| 역할 | 설명 | 주요 권한 | 승인 책임 |
|---|---|---|---|
| [예: 요청자] | | | |
| [예: 관리자] | | | |
| [예: 승인자] | | | |

## 3. Business Workflows

- Workflow name:
- 시작 조건:
- 주요 단계:
- 예외/반려 흐름:
- 완료 조건:
- 관련 역할:

## 4. Screen List

| 화면명 | 목적 | 주요 사용자 | 주요 기능 | 관련 API / 데이터 |
|---|---|---|---|---|
| | | | | |

## 5. Data Model Draft

| 엔티티 | 주요 필드 | 관계 | source-of-truth | 비고 |
|---|---|---|---|---|
| | | | | |

## 6. API Spec Draft

| API 이름 | 목적 | 요청 | 응답 | 권한 규칙 | 오류 조건 |
|---|---|---|---|---|---|
| | | | | | |

## 7. Test Plan

- 정상 시나리오:
- 오류 시나리오:
- 권한 시나리오:
- 회귀 시나리오:
- 수동 검증 절차:
- 자동 검증 범위:

## 8. Deployment And Operations Plan

- 배포 대상 환경:
- 실행 주체:
- 사전 조건:
- 점검 항목:
- rollback boundary:
- 운영 담당:
- 장애 대응 경로:

## 9. Planner Check

아래 질문에 모두 답할 수 있을 때 구현 준비가 된 것으로 본다.

- 프로젝트 목적이 한 문장으로 정리되었는가
- 사용자 역할과 승인 책임이 보이는가
- 가장 중요한 workflow가 닫혔는가
- 범위와 제외 범위가 구분되는가
- 화면, 데이터, API의 연결이 보이는가
- 테스트와 운영 기준이 정의되었는가
- 위 항목 중 비어 있는 것이 `PLN-01` 승인 blocker인지 아닌지가 분명한가
