# 표준 하네스 통합 매뉴얼 V1.2

이 문서는 표준 하네스와 PMW를 하나의 흐름으로 설명하는 공식 통합 매뉴얼이다.

이 매뉴얼 하나로 다음을 끝내는 것을 목표로 한다.

- 하네스와 PMW가 왜 필요한지 이해
- 새 프로젝트 설치 및 첫 실행
- 표준 업무절차(SOP)로 개발 시작
- 검증, 배포, 운영, 변경 대응
- PMW를 이용한 멀티 프로젝트 모니터링

## 1. 먼저 이해해야 할 핵심

### 1.1 왜 바이브 코딩이 무너지나

아이디어 자체보다 실행 과정에서 품질이 무너지는 이유는 반복적으로 비슷하다.

1. 무엇을 만들지보다 무엇을 안 만들지가 불명확함
2. 승인 기준 없이 구현이 먼저 시작됨
3. 요구사항 변경이 문서/코드에 동시에 반영되지 않음
4. 누가 봐도 같은 답이 나와야 하는 검증 기준이 없음
5. 여러 프로젝트를 동시에 볼 때 현재 상태가 섞임

표준 하네스는 이 문제를 "운영 구조"로 해결한다.

### 1.2 하네스 엔지니어링이란

하네스 엔지니어링은 코드 생성 기법이 아니라, 프로젝트 운영의 기준선을 만드는 방법이다.

핵심은 5가지다.

1. Truth 분리: 무엇이 정본인지 고정
2. 단계 통제: 준비 안 된 작업이 코드로 들어가지 않게 차단
3. 검증 자동화: 누락/충돌/드리프트를 조기 발견
4. 승인 경계: 사람이 결정해야 할 지점을 명확화
5. 복원 가능성: 중단 후에도 현재 상태를 빠르게 재구성

### 1.3 하네스와 PMW의 역할 차이

- 표준 하네스: 각 프로젝트 안에서 계획, 구현, 검증, 배포를 관리하는 운영 틀
- PMW: 여러 프로젝트의 상태를 읽어서 보여주는 별도 모니터 앱

가장 중요한 원칙:

`PMW는 read-only다. 프로젝트를 직접 수정하지 않는다.`

## 2. Truth Contract (절대 기준)

프로젝트에서 무엇이 기준인지 먼저 고정한다.

- governance Markdown truth: `.agents/artifacts/*`
- hot operational DB state: `.harness/operating_state.sqlite`
- generated docs: `.agents/runtime/generated-state-docs/*`
- PMW: read-only projection

운영 원칙:

1. generated docs를 직접 수정하지 않는다.
2. PMW를 write authority로 쓰지 않는다.
3. generated와 governance가 충돌하면 생성 경로를 고친다.

## 2.1 에이전트 행동 기준

모든 에이전트는 `.agents/rules/agent_behavior.md`를 공통 행동 기준으로 적용한다.

이 기준은 `andrej-karpathy-skills-main.zip`의 핵심을 하네스 방식으로 흡수한 것이다. 외부 plugin 구조나 ZIP을 runtime dependency로 가져오지는 않는다.

핵심 원칙:

1. `Think Before Coding`: 가정, 모호함, SSOT 충돌, 위험한 추측을 먼저 드러낸다.
2. `Simplicity First`: 승인된 범위를 만족하는 가장 작은 변경을 우선한다.
3. `Surgical Changes`: 현재 요청/packet/검증과 직접 연결되는 줄만 바꾼다.
4. `Goal-Driven Execution`: 성공 기준을 검증 가능한 체크로 바꾸고 evidence를 남긴다.

역할 기준:

- Planner: scope, acceptance, approval boundary, project design SSOT를 확정한다.
- Developer: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, active packet, 승인된 design/source artifact에 맞게 구현한다.
- Tester: 같은 SSOT 기준으로 검증하고 mismatch는 Developer에게 돌려보낸다.
- Reviewer: source parity, evidence, residual debt, Tester/Developer 역할 준수 여부를 확인한다.

PMW Artifact Library에서는 `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md` 같은 전체 프로젝트 설계/개요 문서를 항상 찾을 수 있어야 한다. PMW는 읽기 표면일 뿐이며 write authority가 아니다.

## 3. 설치 방식

### 3.1 권장 방식 (Windows 설치형)

배포판을 받았다면 보통 다음 두 파일로 시작한다.

- `StandardHarnessSetup.exe` (프로젝트 생성기)
- `StandardHarnessPMWSetup.exe` (PMW 설치기)

설치형은 bundled Node runtime을 포함하므로, 일반 사용자 PC에 Node.js/npm이 없어도 기본 실행이 가능하다.

### 3.2 폴더형 패키지 방식

폴더형 패키지를 사용하는 경우 전면 파일은 보통 다음과 같다.

- `INSTALL_HARNESS.cmd`
- `INSTALL_PMW.cmd`
- `.package/` (실제 payload)

`.package/`는 설치 payload이므로 직접 편집하지 않는다.

### 3.3 수동 설치 fallback

설치형 실행이 어려우면 다음 순서로 수동 설치한다.

1. `standard-template/`를 새 프로젝트 폴더로 복사
2. 프로젝트 루트에서 `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init`
3. `npm run harness:pmw-export`
4. PMW에서 프로젝트 폴더 Add

## 4. 20분 퀵스타트

### 4.1 PMW 먼저 설치

```powershell
StandardHarnessPMWSetup.exe
```

또는 폴더형 패키지:

```powershell
INSTALL_PMW.cmd
```

PMW 기본 주소:

```text
http://127.0.0.1:4174
```

### 4.2 새 프로젝트 생성

설치형:

```powershell
StandardHarnessSetup.exe --project-name "My Project" --target-dir "C:\work\my-project" --profiles PRF-07,PRF-09
```

폴더형:

```powershell
INSTALL_HARNESS.cmd --project-name "My Project" --target-dir "C:\work\my-project" --profiles PRF-07,PRF-09
```

### 4.3 생성 직후 점검

프로젝트 루트에서 실행:

```powershell
HARNESS.cmd test
HARNESS.cmd status
HARNESS.cmd validate
HARNESS.cmd pmw-export
```

Node/npm이 이미 설치된 개발 PC에서는 동등하게 다음도 가능:

```powershell
npm test
npm run harness:status
npm run harness:validate
npm run harness:pmw-export
```

### 4.4 PMW에 등록/확인

1. PMW 실행
2. 프로젝트 루트 경로 입력 후 `Add`
3. `Select`로 프로젝트 선택
4. `Stage`, `Gate`, `Next`, `Next Owner`, `Execution Baton`, `Diagnostics` 확인
5. 다음 에이전트와 다음 작업을 확인한 뒤 `npm run harness:handoff` 또는 `HARNESS.cmd handoff`

## 5. 핵심 폴더 구조

| 경로 | 용도 | 편집 원칙 |
| --- | --- | --- |
| `AGENTS.md` | AI 작업 진입 규칙 | 유지 권장 |
| `.agents/rules/workspace.md` | 워크스페이스 운영 규칙 | 신중히 변경 |
| `.agents/artifacts/CURRENT_STATE.md` | 현재 상태 정본 | 운영 시 갱신 |
| `.agents/artifacts/TASK_LIST.md` | 작업/락 정본 | 운영 시 갱신 |
| `.agents/artifacts/REQUIREMENTS.md` | 요구사항 정본 | 승인 후 갱신 |
| `.agents/artifacts/ACTIVE_PROFILES.md` | 활성 프로파일 선언 | 프로파일 변경 시 갱신 |
| `.harness/operating_state.sqlite` | 하네스 hot-state DB | 직접 편집 금지 |
| `.agents/runtime/generated-state-docs/*` | 파생 문서 | 직접 편집 금지 |
| `.agents/runtime/project-manifest.json` | PMW용 프로젝트 식별 | export로 생성 |
| `.agents/runtime/pmw-read-model.json` | PMW용 읽기 모델 | export로 생성 |
| `reference/packets/*` | 작업 패킷 | 구현 전 작성/갱신 |
| `reference/profiles/*` | 프로파일 정의 | 선택 프로파일 참조 |

제품 코드는 프로젝트 성격에 맞는 경로(`src/`, `app/`, `backend/`, `frontend/`, Android 모듈 등)를 사용한다.

## 6. 매일 쓰는 명령어

| 목적 | npm 명령 | Node/npm 없는 환경 |
| --- | --- | --- |
| 테스트 | `npm test` | `HARNESS.cmd test` |
| 상태 요약 | `npm run harness:status` | `HARNESS.cmd status` |
| 진단 | `npm run harness:doctor` | `HARNESS.cmd doctor` |
| 다음 행동 | `npm run harness:next` | `HARNESS.cmd next` |
| handoff 실행 경로 확인 | `npm run harness:handoff` | `HARNESS.cmd handoff` |
| 막힘 설명 | `npm run harness:explain` | `HARNESS.cmd explain` |
| 규칙 검증 | `npm run harness:validate` | `HARNESS.cmd validate` |
| 검증 리포트 저장 | `npm run harness:validation-report` | `HARNESS.cmd validation-report` |
| PMW 내보내기 | `npm run harness:pmw-export` | `HARNESS.cmd pmw-export` |
| 마이그레이션 미리보기 | `npm run harness:migration-preview` | `HARNESS.cmd migration-preview` |
| 마이그레이션 적용 | `npm run harness:migration-apply` | `HARNESS.cmd migration-apply` |
| 컷오버 사전점검 | `npm run harness:cutover-preflight` | `HARNESS.cmd cutover-preflight` |
| 컷오버 보고서 | `npm run harness:cutover-report` | `HARNESS.cmd cutover-report` |

## 7. 개발 표준 업무절차 (SOP)

### 7.1 단계 개요

표준 흐름:

1. Kickoff
2. Requirements freeze
3. Packet 준비 (`Ready For Code`)
4. 구현
5. 검증/리포트
6. 리팩터링/보안 리뷰 게이트
7. 배포/컷오버
8. 운영/변경 관리

### 7.2 Kickoff

최소 수행:

1. 목표/사용자/운영맥락 정리
2. `.agents/artifacts/REQUIREMENTS.md` 초안 작성
3. optional profile 후보 선정
4. PMW에서 baseline 상태 확인

### 7.3 Requirements freeze

다음이 닫혀야 freeze 가능:

- 범위(무엇을 한다/안 한다)
- 승인 기준
- 주요 리스크
- 사람 승인 경계

freeze 전에 architecture/implementation/UI를 강제로 확정하지 않는다.

### 7.4 Packet 준비 (`Ready For Code`)

각 구현 단위는 `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md` 기준으로 packet을 만든다.

핵심 항목:

- 목표, 범위, 제외 범위
- active profiles 및 근거
- 데이터 영향(schema impact)
- UX 영향
- 배포/롤백 경계
- acceptance / validation 방법
- human approval boundary

`schema impact = unknown`이면 코드로 넘어가지 않는다.

### 7.5 구현

구현 중 원칙:

1. packet 범위를 넘는 변경은 packet부터 갱신
2. 프로젝트 코드와 하네스 코드 책임을 분리
3. 요구사항 변경이 들어오면 문서/packet 영향 평가 먼저 수행

### 7.6 검증/리포트

최소 검증 세트:

```powershell
npm test
npm run harness:validate
npm run harness:validation-report
npm run harness:pmw-export
```

검증이 실패하면 generated docs를 직접 고치지 말고, source-of-truth 또는 생성 경로를 수정한다.
검증 후 다음 담당 에이전트와 다음 작업을 넘길 때는 PMW의 `Execution Baton` 또는 `npm run harness:handoff` 결과를 기준으로 handoff한다.

### 7.7 리팩터링/보안 리뷰 게이트

구현이 끝난 packet은 `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md` 기준으로 closeout을 수행한다.

필수 확인:

- refactor 완료 내용과 residual debt disposition 기록
- validation / security / cleanup evidence 기록
- unresolved critical finding이 없는지 확인
- defer 항목이 있으면 follow-up item으로 명시

최소 실행:

```powershell
npm run harness:validate
npm run harness:validation-report
```

### 7.8 배포/컷오버

배포 전 최소 세트:

```powershell
npm run harness:cutover-preflight
npm run harness:cutover-report
npm run harness:status
```

배포 기준:

- rollback 경계가 정의됨
- unresolved critical finding 없음
- 최신 validation report 존재
- PMW export 최신 반영 완료

## 8. Optional Profile 선택 가이드

기본값은 `none`이다. 필요한 것만 명시적으로 켠다.

| Profile | 사용하는 상황 |
| --- | --- |
| `PRF-01` | 운영자 중심의 dense grid, 검색/정렬/일괄작업이 핵심 |
| `PRF-02` | spreadsheet가 authoritative source인 경우 |
| `PRF-03` | 폐쇄망/수동반입/오프라인 번들 전달 |
| `PRF-04` | Excel/VBA/MariaDB 기반 legacy 시스템 대체 |
| `PRF-05` | Python/Django backoffice 중심 |
| `PRF-06` | 결재/승인/감사로그/상태전이가 핵심 |
| `PRF-07` | lightweight web/app, 작은 내부 도구 |
| `PRF-08` | Android native app |
| `PRF-09` | Node/frontend web app |

프로파일은 복수 선택 가능하지만, 선택한 프로파일의 packet evidence를 반드시 채워야 한다.

## 9. 대표 시나리오별 시작법

### 9.1 작은 내부 웹도구

권장: `PRF-07` (+ Node 기반이면 `PRF-09`)

```powershell
StandardHarnessSetup.exe --project-name "Ops Tool" --target-dir "C:\work\ops-tool" --profiles PRF-07,PRF-09
```

초기 packet에서 닫을 것:

- 사용자 역할
- 핵심 화면 2~3개
- 입력/저장 규칙
- 완료 기준

### 9.2 Node/Frontend 프로젝트

권장: `PRF-09`

packet 필수 항목:

- 제품 코드 루트
- package ownership
- build/test/deploy 명령
- env 정책
- API 경계

### 9.3 Android 네이티브 앱

권장: `PRF-08`

packet 필수 항목:

- package namespace
- minSdk/targetSdk
- 권한/저장소/네트워크 정책
- signing/배포 채널
- emulator/device 테스트 기준

### 9.4 Excel/VBA/MariaDB 대체 프로젝트

권장 조합: `PRF-04 + PRF-05 + PRF-06` (필요 시 `PRF-02` 추가)

구현 전 필수 조사:

- 기존 workbook/sheet/range
- VBA 매크로/모듈
- MariaDB schema snapshot
- 운영 수작업 절차
- migration/reconciliation/rollback 기준

### 9.5 결재/승인 중심 시스템

권장: `PRF-06` (+ 운영자 대시보드가 grid-heavy면 `PRF-01`)

packet 필수 항목:

- 상태전이
- 승인 규칙표
- 권한 매트릭스
- 감사로그 이벤트
- 예외/재상신/회수 규칙

## 10. 변경 요청이 들어왔을 때 (핵심)

새 기획 문서나 정책 변경이 들어오면 아래 순서로 처리한다.

1. authoritative source로 등록
2. requirements/implementation/active packet 영향 분석
3. 충돌/재작업/보류 여부 기록
4. 사용자 승인 경계 확인
5. packet 갱신 후 구현 재개
6. 검증/리포트/PMW export 재실행

작은 변경처럼 보여도 아래에 해당하면 packet 재검토가 필요하다.

- DB 필드/스키마 변경
- 승인 흐름 변경
- 상태값 변경
- 화면 입력 항목 변경
- migration/cutover 영향 발생

## 11. PMW 운영 가이드

### 11.1 PMW가 읽는 파일

프로젝트 루트의 다음 2개 파일을 읽는다.

- `.agents/runtime/project-manifest.json`
- `.agents/runtime/pmw-read-model.json`

둘 다 `harness:pmw-export` 결과물이다.

### 11.2 registry

PMW registry 경로:

```text
%APPDATA%\StandardHarnessPMW\projects.json
```

동작:

- `Add`: 프로젝트 등록
- `Select`: 현재 보는 프로젝트 전환
- `Archive`: 목록에는 유지, 기본 선택에서 제외
- `Remove`: PMW 목록에서 제거 (프로젝트 파일은 삭제되지 않음)

### 11.3 PMW stale 대응

1. 프로젝트 루트에서 `harness:pmw-export`
2. PMW 새로고침
3. 그래도 stale이면 `harness:status`와 `harness:validate` 재확인

## 12. 배포까지 가는 체크리스트

배포 직전 체크:

- [ ] 요구사항/packet 최신 상태 반영
- [ ] `npm test` 통과
- [ ] `npm run harness:validate` 통과(또는 승인된 예외만 존재)
- [ ] `npm run harness:validation-report` 생성 완료
- [ ] `npm run harness:cutover-preflight` 통과
- [ ] rollback 경계와 실행 주체 명확화
- [ ] `npm run harness:pmw-export` 최신 반영

배포 후 체크:

- [ ] PMW에서 stage/gate/next 정상 표시
- [ ] 운영 이슈를 packet 또는 preventive memory로 기록
- [ ] 후속 버전 scope를 task 단위로 분리

## 13. 장애/이슈 대응 플레이북

### 13.1 Node 버전 오류

증상: init/test 실행 실패, 버전 가드 메시지 출력

대응:

1. source checkout 환경이면 Node.js 24+ 설치
2. 설치형 환경이면 `HARNESS.cmd` 경로로 실행
3. 다시 `HARNESS.cmd doctor`

### 13.2 `manifest not found` (PMW Add 실패)

대응:

1. 프로젝트 루트인지 확인
2. `harness:pmw-export` 재실행
3. PMW Add 재시도

### 13.3 `starter_bootstrap_pending` finding

의미: starter 초기화 전 안내 상태일 수 있음

대응:

1. `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init`
2. `harness:validate` 재실행

### 13.4 validate 실패

대응 원칙:

1. finding code와 경로 확인
2. generated docs 직접 수정 금지
3. governance 문서/packet/입력 데이터 수정
4. validate 재실행

### 13.5 PMW 포트 충돌(4174)

```powershell
set PMW_PORT=4180
%LOCALAPPDATA%\StandardHarnessPMW\app\START_PMW.cmd
```

## 14. 운영 중 품질 유지 원칙

1. 패킷 없이 구현 시작하지 않는다.
2. PMW를 수정 도구처럼 사용하지 않는다.
3. generated docs 수동 수정으로 문제를 덮지 않는다.
4. 반복 문제는 `.agents/artifacts/PREVENTIVE_MEMORY.md`에 남긴다.
5. 중요한 결정은 `why + evidence + approval` 형태로 남긴다.

## 15. 절대 금지

- `.agents/runtime/generated-state-docs/*` 직접 수정
- PMW를 write authority로 사용
- active packet 없이 구현 시작
- 사람 승인 경계(스키마/컷오버/보안 수용) 무시
- 프로젝트 고유 규칙을 core 표준으로 무단 승격

## 16. 첫 프로젝트 시작 체크리스트

1. PMW 설치 완료
2. 새 프로젝트 생성(설치형 권장)
3. 프로젝트 루트에서 테스트/상태/검증/export 실행
4. PMW Add + Select 완료
5. requirements 초안 작성
6. 필요한 프로파일 선택
7. 첫 work-item packet 작성
8. `Ready For Code` 확인 후 구현 시작

## 17. 마무리

표준 하네스의 목적은 개발 속도를 늦추는 것이 아니라, 실패 비용을 낮추고 재작업을 줄이며 의사결정을 빠르게 만드는 것이다.

프로젝트가 작아도 이 매뉴얼의 최소 흐름(요구사항 -> packet -> 구현 -> 검증 -> export)만 지키면 품질 편차를 크게 줄일 수 있다.
