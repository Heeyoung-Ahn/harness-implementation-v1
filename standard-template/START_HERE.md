# Start Here

이 문서는 `표준 하네스`를 처음 만지는 사람을 위한 가장 짧은 시작 안내다.
개발자가 아니어도 이 순서대로 하면 새 프로젝트 kickoff baseline을 만들 수 있다.

이 문서의 목표는 `5분 안에 시작`이다.
즉, 여기서는 하네스 전체 기능을 다 설명하지 않고 `어디까지 하면 첫 kickoff가 열리는지`만 안내한다.
상세 개념, 전체 명령 설명, 마이그레이션, 트러블슈팅은 `reference/manuals/HARNESS_MANUAL.md`를 본다.

## 1. 시작 전에 준비할 것

- Node.js 24 이상. 이는 하네스 runtime 실행용 요구사항이며, 제품 앱의 Python/Django/Node 등 런타임 요구사항은 별도로 정한다.
- 프로젝트 이름
- 이 프로젝트를 왜 만드는지 한 줄 설명
- 최종사용자가 얻어야 하는 핵심 효과
- 운영자가 반드시 통제해야 하는 핵심 포인트
- 첫 승인 목표
- optional profile이 필요한지 여부

잘 모르겠는 항목은 완벽하게 쓰지 않아도 된다. 다만 빈칸으로 넘기지 말고 현재 가정을 적는다.

## 2. 가장 먼저 할 일

1. 가능하면 상위 저장소의 installer로 새 프로젝트를 생성한다.
2. 수동 설치라면 새 프로젝트 레포 루트에 starter payload 내용물을 복사한다.
3. Node.js 24 이상이 설치되어 있는지 확인한다.
4. 프로젝트 루트에서 [INIT_STANDARD_HARNESS.cmd](INIT_STANDARD_HARNESS.cmd)를 실행한다.
5. 화면에 나오는 질문에 맞게 `프로젝트 이름`, `사용자 목표`, `운영 목표`, `첫 승인 목표`, `active profile`을 입력한다.

초기화가 끝나면 starter placeholder, repo-local DB, generated docs가 프로젝트 기준으로 바뀐다. init 전에는 `CURRENT_STATE.md`와 `TASK_LIST.md`가 starter placeholder일 수 있고, `ACTIVE_CONTEXT.*`나 `VALIDATION_REPORT.*`가 아직 없어도 정상이다.
`DECISION_LOG.md`, `HANDOFF_ARCHIVE.md`, `REVIEW_REPORT.md`, `WALKTHROUGH.md`, `reference/artifacts/daily/*`가 없는 것도 fresh starter에서는 정상이다.

`INIT_STANDARD_HARNESS.cmd`를 쓰기 어렵다면 `npm run harness:init`를 실행해도 된다. 전체 운영 기준과 재진입 기준은 `reference/manuals/HARNESS_MANUAL.md`를 본다.

## 2B. `INIT_STANDARD_HARNESS.cmd`에서 무엇을 물어보나

초기화 질문은 보통 6개다. `[]` 안은 기본값이고, 그대로 쓰려면 `Enter`만 누르면 된다.

1. `Project name [현재 폴더명]`
2. `Project slug [project-name을 kebab-case로 바꾼 값]`
3. `User goal [프로젝트 사용자가 지금 판단해야 하는 핵심 문제를 빠르게 해결한다.]`
4. `Operator goal [프로젝트 운영 상태와 다음 행동을 CLI와 Active Context에서 빠르게 복원한다.]`
5. `Approval goal [PLN-00과 PLN-01을 닫아 첫 구현 lane을 연다.]`
6. `Active profiles [none]`

권장 답변 방식은 아래처럼 생각하면 된다.

- `Project name`: 사람이 읽는 실제 프로젝트 이름. 예: `재고 승인 시스템`
- `Project slug`: 특별한 이유가 없으면 기본값 유지
- `User goal`: 최종사용자가 얻어야 하는 핵심 효과를 한 줄로 입력
- `Operator goal`: 운영자가 상태와 다음 행동을 어떻게 복원해야 하는지 한 줄로 입력
- `Approval goal`: 특별한 사유가 없으면 기본값 유지
- `Active profiles`: 모르면 `none`, 가벼운 웹앱은 보통 `PRF-07` 또는 `PRF-09`

`Active profiles`에는 `PRF-01`부터 `PRF-09`까지의 id를 쉼표로 넣을 수 있다. 예: `PRF-07,PRF-09`

초기화 시점에 고를 수 있는 profile은 아래와 같다.

- `PRF-01`: 운영자용 표/그리드 화면이 많은 프로젝트
- `PRF-02`: 엑셀/스프레드시트가 사실상 기준 문서인 프로젝트
- `PRF-03`: 폐쇄망, 수동 반입, 파일 전달 절차가 있는 프로젝트
- `PRF-04`: Excel/VBA/MariaDB 기반 기존 업무시스템을 웹앱으로 대체하는 프로젝트
- `PRF-05`: Python/Django backoffice 구조로 구현하는 프로젝트
- `PRF-06`: 상태전이, 승인, 권한, 감사가 핵심인 workflow/approval 프로젝트
- `PRF-07`: 가벼운 웹앱, 단순 내부 도구, 작은 앱처럼 전체 업무시스템 게이트가 과한 프로젝트
- `PRF-08`: Android native 앱, Gradle/AGP, signing, permissions, device test, release channel이 필요한 프로젝트
- `PRF-09`: Node.js, frontend, SPA/SSR/static web app처럼 package/build/test/deploy 경계가 필요한 프로젝트

빠르게 고르려면 아래 기준으로 보면 된다.

- 해당 없음 또는 아직 판단 전: `none`
- 가벼운 내부 웹앱: `PRF-07`
- React/Vue/Next 같은 웹 프론트엔드: `PRF-09`
- 결재/승인 흐름이 강함: `PRF-06` 추가
- 기존 Excel/VBA 업무를 대체: `PRF-04` 추가
- Android 앱: `PRF-08`

## 2A. 이 문서로 어디까지 하면 되나

아래 네 가지가 되면 이 문서의 역할은 끝난다.

- starter 설치 또는 복사가 끝났다
- `npm run harness:init`가 끝났다
- kickoff에 필요한 첫 읽기 문서를 알게 되었다
- 첫 packet을 언제 열어야 하는지 이해했다

그 다음부터는 `reference/manuals/HARNESS_MANUAL.md`를 기준으로 운영하면 된다.

## 3. 초기화가 끝난 뒤 처음에는 이 문서만 연다

- `.agents/runtime/ACTIVE_CONTEXT.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `reference/planning/PLN-00_DEEP_INTERVIEW.md`
- `reference/planning/PLN-01_REQUIREMENTS_FREEZE.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`

`ACTIVE_CONTEXT.md`가 아직 없다면 `npm run harness:init` 또는 `npm run harness:context`를 먼저 실행한다.

## 3A. 다운스트림 실제 프로젝트 생성 체크리스트

1. 빈 폴더 또는 비어 있는 git repo 루트를 준비한다.
2. installer 또는 starter payload로 하네스를 복사한다.
3. Node.js 24 이상을 확인한다.
4. `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init`를 실행한다.
5. `npm run harness:status`로 `PLN-00` kickoff 상태가 열렸는지 확인한다.
6. `PLN-00_DEEP_INTERVIEW.md` 기준으로 사용자 목표, 운영 목표, 승인 경계, 기존 시스템 여부를 채운다.
7. `.agents/artifacts/REQUIREMENTS.md`를 프로젝트 내용으로 바꾼다.
8. `PLN-01_REQUIREMENTS_FREEZE.md`로 requirements freeze 범위를 닫는다.
9. 필요한 profile만 `ACTIVE_PROFILES.md`와 packet에서 명시적으로 활성화한다.
10. requirements freeze 전에는 구현 packet을 열지 않는다.
11. 첫 구현 직전 `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`로 실제 packet을 만든다.
12. reviewer closeout, handoff archive, daily note가 실제로 필요해질 때만 `REVIEW_REPORT.md`, `WALKTHROUGH.md`, `HANDOFF_ARCHIVE.md`, `DECISION_LOG.md`, `reference/artifacts/daily/*`를 만든다.

## 4. 처음에는 열지 않아도 되는 것

- `.harness/runtime/*`
- `.harness/test/*`
- `.agents/runtime/*`
- `reference/skills/*`
- task가 실제로 요구할 때만 만드는 `reference/artifacts/DECISION_LOG.md`
- task가 실제로 요구할 때만 만드는 `reference/artifacts/HANDOFF_ARCHIVE.md`
- task가 실제로 요구할 때만 만드는 `reference/artifacts/REVIEW_REPORT.md`
- task가 실제로 요구할 때만 만드는 `reference/artifacts/WALKTHROUGH.md`
- task가 실제로 요구할 때만 만드는 `reference/artifacts/daily/*`
- task가 요구할 때만 직접 만드는 `reference/mockups/*`
- task가 요구할 때만 직접 만드는 `reference/reports/*`
- 과거 자료를 따로 보관할 때만 만드는 `reference/legacy/*`

이 폴더들은 필요할 때만 본다. kickoff 직후에는 대부분 안 봐도 된다.

## 5. 시작 순서

1. `PLN-00_DEEP_INTERVIEW.md`로 사용자, 업무 흐름, 기존 시스템, 입력 문서, 승인 경계를 정리한다.
2. 그 결과를 바탕으로 `.agents/artifacts/REQUIREMENTS.md`를 채운다.
3. `PLN-01_REQUIREMENTS_FREEZE.md`에서 무엇이 확정되었고 무엇이 미뤄졌는지 닫는다.
4. requirements가 닫힌 뒤에만 architecture / implementation / UI baseline을 맞춘다.
5. 실제 기능 작업을 시작할 때는 `PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`로 작업 packet을 만든다.

## 6. optional profile을 언제 고르나

- `PRF-01`: 운영자용 표/그리드 화면이 많은 프로젝트
- `PRF-02`: 엑셀/스프레드시트가 사실상 기준 문서인 프로젝트
- `PRF-03`: 폐쇄망, 수동 반입, 파일 전달 절차가 있는 프로젝트
- `PRF-04`: Excel/VBA/MariaDB 기반 기존 업무시스템을 웹앱으로 대체하는 프로젝트
- `PRF-05`: Python/Django backoffice 구조로 구현하는 프로젝트
- `PRF-06`: 상태전이, 승인, 권한, 감사가 핵심인 workflow/approval 프로젝트
- `PRF-07`: 가벼운 웹앱, 단순 내부 도구, 작은 앱처럼 전체 업무시스템 게이트가 과한 프로젝트
- `PRF-08`: Android native 앱, Gradle/AGP, signing, permissions, device test, release channel이 필요한 프로젝트
- `PRF-09`: Node.js, frontend, SPA/SSR/static web app처럼 package/build/test/deploy 경계가 필요한 프로젝트

잘 모르겠으면 일단 `none`으로 시작해도 된다.
필요가 확인되면 requirements와 packet에서 나중에 명시적으로 활성화한다.

### 대표 프로젝트별 추천 조합

- 예산관리: `PRF-01 + PRF-04 + PRF-06`, 필요 시 `PRF-09`
  - 표/그리드 중심 운영, 기존 Excel/DB 대체, 승인/권한 흐름이 강한 구조에 맞는다.
- 자산관리: `PRF-01 + PRF-04 + PRF-06`, 필요 시 `PRF-09`
  - 목록/상태관리, 기존 시스템 대체, 감사/권한 요구가 강한 구조에 맞는다.
- 가벼운 웹앱: `PRF-07` 또는 `PRF-09`
  - 규제보다 빠른 구현과 앱 경계 정리가 더 중요한 구조에 맞는다.
- 대시보드형 웹앱: 기본 `PRF-09`, 승인/권한이 강하면 `PRF-06` 추가
  - frontend/build/deploy 경계가 핵심이고, 운영 승인 흐름이 있으면 workflow profile이 더 필요하다.

## 7. 개발자에게 넘겨야 하는 시점

아래 중 하나가 나오면 개발자 또는 AI에게 packet 정리와 구현 준비를 요청하면 된다.

- 첫 구현 작업을 시작해야 할 때
- 기존 DB schema 확인이나 호환성 분석이 필요할 때
- 사용자 화면 상세 설계를 닫아야 할 때
- 배포/테스트/컷오버 절차를 정해야 할 때

첫 packet을 열기 전 최소 기준은 아래 네 가지다.

- 왜 이 작업을 하는지 한 줄로 설명할 수 있다
- 이번 작업의 in-scope / out-of-scope를 나눌 수 있다
- 필요한 profile이 있으면 무엇인지 말할 수 있다
- 사람 승인이 먼저 필요한지 아닌지 구분할 수 있다

## 8. 가장 흔한 실수

- requirements가 닫히기 전에 바로 구현을 시작하는 것
- `reference/*`를 처음부터 전부 읽는 것
- packet 없이 화면/기능을 바로 확정하는 것
- 기존 프로그램 연동인데 DB schema 확인 없이 설계를 시작하는 것
- 새 기획 문서가 들어왔는데 impact 분석 없이 기존 계획을 계속 쓰는 것

## 9. 한 줄 기준

`초기화 -> PLN-00 인터뷰 -> requirements 정리 -> requirements freeze -> 첫 packet 오픈`
이 순서만 지키면 starter를 잘못 쓰는 경우를 크게 줄일 수 있다.
