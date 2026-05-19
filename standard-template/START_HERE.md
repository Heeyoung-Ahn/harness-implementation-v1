# Start Here

이 문서는 `표준 하네스`를 프로젝트에 처음 적용해서 kick-off baseline을 닫기 위한 진입문서다.
목표는 처음 적용하는 사람이 `초기화 -> 상태 확인 -> kickoff 문서 정리 -> requirements freeze`까지 필요한 순서를 한곳에서 따라갈 수 있게 하는 것이다.

kickoff 이후의 상세 운영, migration, review, handoff, validation 해석은 `reference/manuals/HARNESS_MANUAL.md`를 기준으로 진행한다.

## 1. 핵심 원칙

- 이 하네스는 `바로 구현부터 시작하지 않게` 만든다.
- 먼저 목적, 사용자, 업무흐름, 승인 경계, 데이터/운영 전제를 문서로 닫는다.
- `PLN-01_REQUIREMENTS_FREEZE.md`가 충분히 승인되기 전에는 architecture / implementation / UI sync나 첫 task packet으로 넘어가지 않는다.
- 사람은 한국어 Markdown 문서로 현재 상태를 읽고, AI는 `ACTIVE_CONTEXT`와 CLI 출력으로 재진입한다.
- 새 프로젝트 시작과 기존 프로젝트 흡수는 다른 흐름이다.
- optional profile은 자동 활성화가 아니라 `explicit-only`다.

## 2. 시작 전에 준비할 것

기술 준비:

- `Node.js 24` 이상
- 빈 폴더 또는 비어 있는 git repo 루트
- 새 프로젝트에 적용하는지, 기존 프로젝트를 흡수하는지에 대한 결정

프로젝트 정보:

| 항목 | 준비 내용 |
|---|---|
| 프로젝트 이름 | 사람이 읽는 프로젝트 이름 |
| 프로젝트 slug | 패키지/식별자에 쓸 slug |
| user goal | 최종사용자가 이 프로젝트로 빨리 해결해야 하는 핵심 문제 1줄 |
| operator goal | 운영자/관리자가 상태와 다음 행동을 어떻게 빨리 복원해야 하는지 1줄 |
| approval goal | 첫 승인 목표 1줄 |
| active profiles 후보 | 필요한 optional profile 후보 |

잘 모르는 항목은 완벽하지 않아도 된다.
다만 빈칸으로 넘기지 말고 현재 가정을 적는다.

## 3. 초기화 질문

새 프로젝트를 시작할 때는 `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init`가 아래 질문을 순서대로 묻는다.
터미널에서는 아래 영어 라벨 그대로 보인다. `[]` 안은 기본값이고, 그대로 쓰려면 `Enter`만 누르면 된다.

1. `Project name [<current folder name>]`
- 프로젝트의 사람이 읽는 이름이다.
- 예: `재고 승인 시스템`

2. `Project slug [<slug from project name>]`
- 패키지 이름과 식별자에 쓰는 slug다.
- 특별한 이유가 없으면 기본값 유지가 가장 안전하다.

3. `User goal [<project name> 사용자가 지금 판단해야 하는 핵심 문제를 빠르게 해결한다.]`
- 최종사용자가 이 프로젝트로 무엇을 빨리 해결해야 하는지 적는다.
- 예: `재고 담당자가 승인 대기 건의 우선순위를 빠르게 판단한다.`

4. `Operator goal [<project name> 운영 상태와 다음 행동을 CLI와 Active Context에서 빠르게 복원한다.]`
- 운영자, 관리자, PM, 개발 리드가 상태와 다음 행동을 어떻게 빨리 파악해야 하는지 적는다.
- 예: `운영자가 승인 대기, 실패 건, 다음 조치 사항을 CLI와 Active Context에서 빠르게 복원한다.`

5. `Approval goal [<project name>의 PLN-00과 PLN-01을 닫아 첫 구현 lane을 연다.]`
- 첫 승인 목표다.
- 특별한 이유가 없으면 기본값 유지가 맞다.

6. `Active profiles [none]`
- optional profile을 켤지 결정한다.
- 하나 이상이면 쉼표로 입력한다.
- 예: `PRF-01,PRF-06,PRF-09`

## 4. Optional Profile 선택

`Active profiles`에서 고를 수 있는 목록은 아래와 같다.

| Profile | 적용 시점 예시 |
|---|---|
| `PRF-01` | 운영자용 표/그리드 화면이 많은 프로젝트 |
| `PRF-02` | 엑셀/스프레드시트가 사실상 기준 문서인 프로젝트 |
| `PRF-03` | 폐쇄망, 수동 반입, 파일 전달 절차가 있는 프로젝트 |
| `PRF-04` | Excel/VBA/MariaDB 기반 기존 업무시스템을 웹앱으로 대체하는 프로젝트 |
| `PRF-05` | Python/Django backoffice 구조로 구현하는 프로젝트 |
| `PRF-06` | 상태전이, 승인, 권한, 감사가 핵심인 workflow/approval 프로젝트 |
| `PRF-07` | 가벼운 웹앱, 단순 내부 도구, 작은 앱처럼 전체 업무시스템 게이트가 과한 프로젝트 |
| `PRF-08` | Android native 앱, Gradle/AGP, signing, permissions, device test, release channel이 필요한 프로젝트 |
| `PRF-09` | Node.js, frontend, SPA/SSR/static web app처럼 package/build/test/deploy 경계가 필요한 프로젝트 |

빠르게 고르려면 아래처럼 보면 된다.

- 아직 판단 전이거나 해당 없음: `none`
- 가벼운 내부 웹앱: `PRF-07`
- React/Vue/Next 같은 웹 프론트엔드: `PRF-09`
- 결재/승인 흐름이 강함: `PRF-06` 추가
- 기존 Excel/VBA 업무를 대체: `PRF-04` 추가
- Android 앱: `PRF-08`

profile 적용 규칙:

- profile 파일이 존재한다고 active가 되는 것이 아니다.
- 실제로 쓸 profile은 `.agents/artifacts/ACTIVE_PROFILES.md`에 선언해야 한다.
- packet이 active profile에 의존하면 해당 profile reference와 evidence가 같이 있어야 한다.
- 관련 evidence가 `pending`이면 `Ready For Code`를 막는다.

## 5. 새 프로젝트 적용 흐름

새 프로젝트를 처음 시작하는 경우:

1. `빈 폴더` 또는 `비어 있는 git repo 루트`를 준비한다.
2. 가능하면 installer로 시작하고, 수동 설치라면 starter payload 내용을 프로젝트 루트에 복사한다.
3. `Node.js 24+`를 확인한다.
4. 프로젝트 루트에서 `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init`를 실행한다.
5. 터미널 질문에 답한다.
6. 초기화가 끝나면 `Standard harness starter initialized.`와 함께 프로젝트 이름, active profiles, 다음 행동이 출력된다.
7. 이어서 이 문서의 `Kick-off 표준 흐름`을 따라 kickoff baseline을 만든다.

초기화가 끝나면 starter placeholder가 프로젝트 전용 내용으로 바뀌고 `.harness/operating_state.sqlite`, generated docs, `ACTIVE_CONTEXT.*`가 새 프로젝트 기준으로 생성된다.
init 전에는 `CURRENT_STATE.md`와 `TASK_LIST.md`가 starter placeholder일 수 있고, `ACTIVE_CONTEXT.*`나 `VALIDATION_REPORT.*`가 아직 없어도 정상이다.

## 6. 기존 프로젝트 적용 흐름

기존 프로젝트는 새 프로젝트 init과 흐름이 다르다.
이미 진행 중인 프로젝트라면 바로 `harness:init`부터 시작하지 말고 먼저 현재 상태를 안전하게 읽어 와야 한다.

기본 흐름:

1. 현재 프로젝트의 주요 문서, source root, 기존 진행 상황을 정리한다.
2. 하네스 파일을 프로젝트 루트에 적용한다.
3. `npm run harness:migration-preview`로 어떤 legacy source가 감지됐고 어떤 정리가 필요한지 본다.
4. preview 결과를 확인한 뒤 `npm run harness:migration-apply`로 초기 상태를 반영한다.
5. `npm run harness:status`, `npm run harness:context`, `npm run harness:validate`로 하네스 기준 상태를 점검한다.

주의할 점:

- migration은 새 기능 설계가 아니라 기존 상태를 하네스 기준으로 읽어 오는 단계다.
- preview를 건너뛰고 바로 apply하지 않는다.
- 기존 프로젝트의 요구사항과 승인 상태는 결국 packet과 canonical docs로 다시 닫아야 한다.
- installer 자동 bootstrap은 `빈 폴더` 또는 `repo marker만 있는 기존 repo root`에 맞춰져 있다. 이미 파일이 많은 기존 프로젝트는 적용 전에 충돌 범위를 먼저 검토해야 한다.

## 7. Kick-off 표준 흐름

새 프로젝트 init이 끝났다면 아래 순서로 움직인다.

| 순서 | 단계 | 해야 할 일 | 핵심 산출물 |
|---:|---|---|---|
| 1 | 상태 확인 | `npm run harness:status`로 kickoff 상태 확인 | kickoff open 여부 확인 |
| 2 | starter baseline 작성 | 목적, 역할, workflow, 화면, 데이터, API, 테스트, 운영 초안 작성 | `reference/artifacts/PROJECT_STARTER_DOC_PACK.md` |
| 3 | deep interview 진행 | implementation-critical open question을 질문/답변으로 닫음 | `reference/planning/PLN-00_DEEP_INTERVIEW.md` |
| 4 | 요구사항 반영 | 확정/보류/미결 요구사항 정리 | `.agents/artifacts/REQUIREMENTS.md` |
| 5 | requirements freeze | approved / deferred / open 상태와 human approval boundary 확정 | `reference/planning/PLN-01_REQUIREMENTS_FREEZE.md` |
| 6 | 다음 단계 판단 | freeze가 충분히 닫혔는지 확인 후 downstream sync 검토 | architecture / implementation / UI / first packet 준비 |

중요:

- `PROJECT_STARTER_DOC_PACK.md`, `PLN-00_DEEP_INTERVIEW.md`, `PLN-01_REQUIREMENTS_FREEZE.md`가 충분히 닫히기 전에는 첫 task packet으로 넘어가지 않는다.
- `PLN-01`이 충분히 승인되기 전까지는 `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/artifacts/UI_DESIGN.md`, 첫 task packet을 새 기준선으로 올리지 않는다.

## 8. Kick-off 핵심 문서

아래 4개가 새 프로젝트 kickoff의 핵심 축이다.

| 우선순위 | 문서명 | 경로 | 역할 |
|---:|---|---|---|
| 1 | Project Starter Doc Pack | `reference/artifacts/PROJECT_STARTER_DOC_PACK.md` | kickoff baseline 입력물 |
| 2 | Deep Interview | `reference/planning/PLN-00_DEEP_INTERVIEW.md` | implementation-critical 질문/결정 정리 |
| 3 | Requirements | `.agents/artifacts/REQUIREMENTS.md` | 확정 요구사항, 범위, 제외 범위, open/deferred 정리 |
| 4 | Requirements Freeze | `reference/planning/PLN-01_REQUIREMENTS_FREEZE.md` | 승인된 baseline과 approval boundary 고정 |

설명:

- `PROJECT_STARTER_DOC_PACK.md`는 SSOT 자체가 아니라 kickoff baseline 입력물이다.
- 실제 정본은 `.agents/artifacts/*`, active packet, approved project artifacts에 들어간다.
- `REQUIREMENTS.md`와 `PLN-01`이 닫혀야 downstream 문서 sync와 packet open을 검토할 수 있다.

## 9. Project Starter Doc Pack 최소 내용

kickoff 초안으로 아래 항목은 비우지 않는 것이 표준 하네스 취지에 맞다.

Project Charter:

- 프로젝트 목적
- 해결하려는 문제
- 주요 사용자
- 성공 기준
- 이번 버전 범위
- 제외 범위
- 일정 또는 단계 개요

User Roles:

- 주요 역할
- 역할 설명
- 주요 권한
- 승인 책임

Business Workflows:

- workflow 이름
- 시작 조건
- 주요 단계
- 예외/반려 흐름
- 완료 조건
- 관련 역할

Screen / Data / API / Test / Operations:

- 화면 목록
- 데이터 모델 초안
- API 초안
- 테스트 계획
- 배포 및 운영 계획

Planner stop rule:

- 큰 항목이 비어 있으면 Planner는 질문을 더 진행해야 한다.
- rough baseline이어도 first version scope를 설명할 수 있어야 한다.
- blank cell이 scope, data, approval, deployment 판단에 영향 주면 requirements freeze를 막는다.

## 10. 상황별 보강 문서

아래 문서들은 표준 하네스의 보편 필수는 아니지만, 프로젝트 성격에 따라 kickoff를 더 정확하게 닫는 데 도움이 된다.

승인/업무흐름이 강한 프로젝트:

| 문서명 | 경로 | 필요한 이유 |
|---|---|---|
| Role Permission Matrix | `reference/artifacts/ROLE_PERMISSION_MATRIX.md` | 사용자별 권한과 승인 책임 분리 |
| Workflow State Machine | `reference/artifacts/WORKFLOW_STATE_MACHINE.md` | 상태 전이와 예외 흐름 명확화 |
| Approval Rule Matrix | `reference/artifacts/APPROVAL_RULE_MATRIX.md` | 승인 규칙을 금액/역할/조건별로 정리 |

운영/배포 영향이 큰 프로젝트:

| 문서명 | 경로 | 필요한 이유 |
|---|---|---|
| Deployment Plan | `reference/artifacts/DEPLOYMENT_PLAN.md` | 배포 대상, 운영자, rollback boundary 명확화 |
| Domain Context | `.agents/artifacts/DOMAIN_CONTEXT.md` | 핵심 도메인 용어와 데이터 의미 정리 |

기존 Excel/VBA/MariaDB 대체 성격이 강한 프로젝트:

- legacy system intake
- migration reconciliation plan
- authoritative source intake
- authoritative source wave ledger

이 문서들은 실제 프로젝트 packet이나 approved artifact에서 필요성이 닫힐 때 추가한다.

## 11. Kick-off 전에 정리하면 좋은 실무 자료

업무 흐름 자료:

- 주요 업무 프로세스
- 상태값
- 승인 규칙
- 예외 처리
- 마감 후 변경 규칙

데이터 자료:

- 기존 DB 테이블/컬럼/관계
- 기존 엑셀 파일/시트/수식/매크로
- 기준정보 목록
- 이관 대상
- 데이터 소유자

화면/기능 자료:

- 화면 목록
- 검색 조건
- 입력 항목
- 출력물
- 권한별 화면 차이

이 자료는 `PROJECT_STARTER_DOC_PACK`과 `PLN-00` 질문을 더 빨리 닫는 데 도움이 된다.

## 12. AI에게 요청할 Kick-off Deep Interview

아래 프롬프트를 그대로 써도 된다.

```text
이 프로젝트를 표준 하네스 기준으로 시작하려고 합니다.
구현은 시작하지 말고, 먼저 kickoff deep interview만 진행해 주세요.

다음 기준으로 질문을 이어가 주세요.
- reference/artifacts/PROJECT_STARTER_DOC_PACK.md
- reference/planning/PLN-00_DEEP_INTERVIEW.md
- .agents/artifacts/REQUIREMENTS.md

제가 답해야 하는 내용을 한 번에 다 쓰라고 하지 말고, 중요한 것부터 순서대로 질문해 주세요.
특히 아래 항목이 비어 있거나 모호하면 먼저 물어봐 주세요.
- 프로젝트 목적
- 최종사용자
- 실제 업무 흐름
- 기존 시스템 여부
- 외부 연동 또는 데이터 소스
- 승인 경계
- in-scope / out-of-scope
- optional profile 필요 여부

질문을 진행한 뒤에는 채팅 요약만 하지 말고 아래 문서 반영 기준으로 정리해 주세요.
1. PROJECT_STARTER_DOC_PACK에서 아직 비어 있거나 모호한 항목
2. PLN-00_DEEP_INTERVIEW.md에 기록할 approved / open / deferred 결정
3. REQUIREMENTS.md에 반영할 현재 요구사항 요약
4. PLN-01 requirements freeze 전에 꼭 결정해야 하는 blocker
5. 각 결정이 architecture, UI/UX, data/schema, test, deployment에 어떤 영향을 주는지 비전공자도 이해할 수 있게 설명
6. 마지막 freeze 전에 보여 줄 first-version product picture와 final confirmation 질문

그리고 아래 진행 방식도 지켜 주세요.
- 먼저 결정해야 할 목록을 짧게 보여 주세요.
- 한 번에 하나의 결정사항만 질문해 주세요.
- 앞선 결정 때문에 후속 질문 전제가 바뀌면 남은 질문 목록을 갱신해 주세요.
- 마지막에는 첫 버전 제품이 어떤 모습이 되는지 요약해서 보여 주고 최종 확인을 받아 주세요.

ARCHITECTURE_GUIDE, IMPLEMENTATION_PLAN, UI_DESIGN sync나 packet 오픈은 아직 하지 마세요.
```

그 다음 단계의 문서 정리와 requirements 반영은 위 인터뷰 결과를 바탕으로 진행하면 된다.

## 13. 개발 착수 전 최소 체크리스트

| 체크 | 항목 |
|---|---|
| [ ] | 프로젝트 목적 1줄이 정리되었다 |
| [ ] | user goal / operator goal / approval goal이 있다 |
| [ ] | 주요 사용자와 승인 책임이 보인다 |
| [ ] | 1차 범위와 제외 범위가 구분된다 |
| [ ] | 핵심 workflow 3~5개 수준이 설명된다 |
| [ ] | 화면, 데이터, API 연결이 대략 보인다 |
| [ ] | 테스트와 운영 기준 초안이 있다 |
| [ ] | blank cell 중 freeze blocker가 무엇인지 분명하다 |
| [ ] | 필요한 optional profile 후보가 정리되었다 |
| [ ] | profile을 켠다면 evidence 요구사항도 같이 인지하고 있다 |
| [ ] | `PLN-01` 승인 전 architecture / implementation / UI / first packet으로 넘어가지 않기로 합의했다 |

## 14. Kick-off 종료 기준

kickoff는 아래 상태일 때 다음 단계로 넘어갈 수 있다.

1. `PROJECT_STARTER_DOC_PACK.md`가 rough baseline으로 채워졌다.
2. `PLN-00_DEEP_INTERVIEW.md`의 implementation-critical 질문이 approved / adjusted / deferred 중 하나로 닫혔다.
3. `.agents/artifacts/REQUIREMENTS.md`에 현재 기준선이 반영됐다.
4. `PLN-01_REQUIREMENTS_FREEZE.md`에 approved / deferred / open 상태와 human approval boundary가 기록됐다.
5. optional profile을 켰다면 `.agents/artifacts/ACTIVE_PROFILES.md`와 required evidence 상태가 맞다.
6. downstream sync와 첫 task packet을 열어도 되는지 명시적으로 판단됐다.

핵심 원칙은 아래 한 줄로 정리된다.

`업무흐름·데이터·권한·승인 경계가 문서로 충분히 닫히기 전에는 구현 packet을 열지 않는다.`

## 15. 그다음은 매뉴얼로 넘어간다

이 문서의 역할은 최초 적용부터 kickoff 종료 기준까지다.
이후 실제 운영, migration, review, validation 해석, handoff, 기존 프로젝트 상세 적용 규칙은 `reference/manuals/HARNESS_MANUAL.md`를 기준으로 진행한다.
