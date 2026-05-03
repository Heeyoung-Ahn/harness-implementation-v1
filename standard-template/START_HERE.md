# Start Here

이 문서는 `표준 하네스`를 처음 만지는 사람을 위한 가장 짧은 시작 안내다.
개발자가 아니어도 이 순서대로 하면 새 프로젝트 kickoff baseline을 만들 수 있다.

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
2. 수동 설치라면 새 프로젝트 레포 루트에 `standard-template/` 내용물을 복사한다.
3. Node.js 24 이상이 설치되어 있는지 확인한다.
4. 프로젝트 루트에서 [INIT_STANDARD_HARNESS.cmd](INIT_STANDARD_HARNESS.cmd)를 실행한다.
5. 화면에 나오는 질문에 맞게 `프로젝트 이름`, `사용자 목표`, `운영 목표`, `첫 승인 목표`, `active profile`을 입력한다.

초기화가 끝나면 starter placeholder, repo-local DB, generated docs가 프로젝트 기준으로 바뀐다.

`INIT_STANDARD_HARNESS.cmd`를 쓰기 어렵다면 `npm run harness:init`를 실행해도 된다. 전체 운영 기준과 재진입 기준은 `HARNESS_MANUAL.md`를 본다.

## 3. 처음에는 이 문서만 연다

- `.agents/artifacts/CURRENT_STATE.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `reference/planning/PLN-00_DEEP_INTERVIEW.md`
- `reference/planning/PLN-01_REQUIREMENTS_FREEZE.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`

## 4. 처음에는 열지 않아도 되는 것

- `.harness/runtime/*`
- `.harness/test/*`
- `.agents/runtime/*`
- `reference/skills/*`
- `reference/mockups/*`
- `reference/reports/*`
- `reference/legacy/*`

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

## 7. 개발자에게 넘겨야 하는 시점

아래 중 하나가 나오면 개발자 또는 AI에게 packet 정리와 구현 준비를 요청하면 된다.

- 첫 구현 작업을 시작해야 할 때
- 기존 DB schema 확인이나 호환성 분석이 필요할 때
- 사용자 화면 상세 설계를 닫아야 할 때
- 배포/테스트/컷오버 절차를 정해야 할 때

## 8. 가장 흔한 실수

- requirements가 닫히기 전에 바로 구현을 시작하는 것
- `reference/*`를 처음부터 전부 읽는 것
- packet 없이 화면/기능을 바로 확정하는 것
- 기존 프로그램 연동인데 DB schema 확인 없이 설계를 시작하는 것
- 새 기획 문서가 들어왔는데 impact 분석 없이 기존 계획을 계속 쓰는 것

## 9. 한 줄 기준

`초기화 -> PLN-00 인터뷰 -> requirements 정리 -> requirements freeze -> 첫 packet 오픈`
이 순서만 지키면 starter를 잘못 쓰는 경우를 크게 줄일 수 있다.
