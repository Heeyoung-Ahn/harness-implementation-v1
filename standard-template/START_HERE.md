# Start Here

이 문서는 `표준 하네스`를 프로젝트에 처음 적용하는 사람을 위한 시작 가이드다.
목표는 `처음 적용할 때 필요한 것만` 빠르게 이해하게 하는 것이다.
초기 적용이 끝난 뒤의 상세 운영 규칙은 `reference/manuals/HARNESS_MANUAL.md`로 넘긴다.

## 1. 이 하네스의 특징

- 이 하네스는 `바로 구현부터 시작하지 않게` 만든다. 먼저 현재 상태, 요구사항, 승인 경계를 정리한 뒤 작업 packet을 열게 한다.
- 사람은 한국어 Markdown 문서로 현재 상태를 읽고, AI는 `ACTIVE_CONTEXT`와 CLI 출력으로 재진입할 수 있게 설계되어 있다.
- 새 프로젝트 시작과 기존 프로젝트 흡수를 모두 지원하지만, 두 흐름은 다르다.
- optional profile을 켜면 프로젝트 유형별 기준선을 더 빨리 맞출 수 있다.
- 이 문서의 역할은 `첫 적용`까지다. 그 다음 운영 규칙, migration, review, handoff, validation 해석은 매뉴얼에서 다룬다.

## 2. 시작 전에 준비할 내용

- `Node.js 24` 이상
- 이 하네스를 `새 프로젝트`에 적용할지, `기존 프로젝트`에 적용할지 결정
- 프로젝트 이름
- 최종사용자가 얻어야 하는 핵심 효과 한 줄
- 운영자/관리자가 빠르게 파악해야 하는 상태 또는 통제 포인트 한 줄
- 첫 승인 목표 한 줄
- 필요한 optional profile이 있는지 여부

잘 모르겠는 항목은 완벽하게 쓰지 않아도 된다. 다만 빈칸으로 넘기지 말고 현재 가정을 적는다.

## 2-1. `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init` 질문과 답변

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
- 예: `PRF-07,PRF-09`

`Active profiles`에서 고를 수 있는 목록은 아래와 같다.

- `PRF-01`: 운영자용 표/그리드 화면이 많은 프로젝트
- `PRF-02`: 엑셀/스프레드시트가 사실상 기준 문서인 프로젝트
- `PRF-03`: 폐쇄망, 수동 반입, 파일 전달 절차가 있는 프로젝트
- `PRF-04`: Excel/VBA/MariaDB 기반 기존 업무시스템을 웹앱으로 대체하는 프로젝트
- `PRF-05`: Python/Django backoffice 구조로 구현하는 프로젝트
- `PRF-06`: 상태전이, 승인, 권한, 감사가 핵심인 workflow/approval 프로젝트
- `PRF-07`: 가벼운 웹앱, 단순 내부 도구, 작은 앱처럼 전체 업무시스템 게이트가 과한 프로젝트
- `PRF-08`: Android native 앱, Gradle/AGP, signing, permissions, device test, release channel이 필요한 프로젝트
- `PRF-09`: Node.js, frontend, SPA/SSR/static web app처럼 package/build/test/deploy 경계가 필요한 프로젝트

빠르게 고르려면 아래처럼 보면 된다.

- 아직 판단 전이거나 해당 없음: `none`
- 가벼운 내부 웹앱: `PRF-07`
- React/Vue/Next 같은 웹 프론트엔드: `PRF-09`
- 결재/승인 흐름이 강함: `PRF-06` 추가
- 기존 Excel/VBA 업무를 대체: `PRF-04` 추가
- Android 앱: `PRF-08`

## 3. 이 하네스를 프로젝트에서 사용하는 방법

### 3-1. 프로젝트를 처음 시작하는 경우

1. `빈 폴더` 또는 `비어 있는 git repo 루트`를 준비한다.
2. 가능하면 installer로 시작하고, 수동 설치라면 starter payload 내용을 프로젝트 루트에 복사한다.
3. `Node.js 24+`를 확인한다.
4. 프로젝트 루트에서 `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init`를 실행한다.
5. 터미널 질문에 답한다.
6. 초기화가 끝나면 터미널에 `Standard harness starter initialized.`와 함께 프로젝트 이름, active profiles, 다음 행동이 출력된다.
7. 이어서 `START_HERE.md`와 아래 `초기화 이후 해야 할 일`을 따라 kickoff baseline을 만든다.

초기화가 끝나면 starter placeholder가 프로젝트 전용 내용으로 바뀌고 `.harness/operating_state.sqlite`, generated docs, `ACTIVE_CONTEXT.*`가 새 프로젝트 기준으로 생성된다.
init 전에는 `CURRENT_STATE.md`와 `TASK_LIST.md`가 starter placeholder일 수 있고, `ACTIVE_CONTEXT.*`나 `VALIDATION_REPORT.*`가 아직 없어도 정상이다.

### 3-2. 기존 프로젝트에 이 하네스를 적용하는 경우

기존 프로젝트는 `새 프로젝트 init`과 흐름이 다르다.
이미 진행 중인 프로젝트라면, 새 프로젝트처럼 바로 `harness:init`부터 시작하지 말고 먼저 현재 상태를 안전하게 읽어 와야 한다.

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

## 4. 초기화 이후 해야 할 일

새 프로젝트 init이 끝났다면 먼저 `npm run harness:status`로 kickoff 상태가 열렸는지 확인한다.
그 다음에는 바로 AI에게 `프로젝트 시작용 deep interview`를 요청하면 된다.

아래 프롬프트를 그대로 써도 된다.

```text
이 프로젝트를 표준 하네스 기준으로 시작하려고 합니다.
구현은 시작하지 말고, 먼저 kickoff deep interview만 진행해 주세요.

다음 기준으로 질문을 이어가 주세요.
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

질문을 진행한 뒤에는 다음 결과만 정리해 주세요.
1. 현재까지 확인된 요구사항 요약
2. 아직 남아 있는 open question
3. requirements freeze 전에 꼭 결정해야 하는 항목

구현, 설계 확정, packet 오픈은 아직 하지 마세요.
```

그 다음 단계의 문서 정리와 requirements 반영은 위 인터뷰 결과를 바탕으로 진행하면 된다.

## 5. 그다음은 매뉴얼로 넘어간다

이 문서의 역할은 여기까지다.
이후 실제 운영, migration, review, validation 해석, handoff, 기존 프로젝트 상세 적용 규칙은 매뉴얼 파일 `HARNESS_MANUAL.md`를 기준으로 진행한다.
경로는 `reference/manuals/HARNESS_MANUAL.md`다.
