# Standard Harness User Manual

이 문서는 V1.2 표준 하네스의 공식 사용자 매뉴얼이다. 설치 패키지를 받은 사용자는 이 문서와 `PMW_MANUAL.md`만 먼저 읽으면 된다.

## 1. 하네스의 철학

표준 하네스는 코드 생성 템플릿이 아니라 `프로젝트 운영 구조`다. 목표는 AI와 사람이 같은 기준으로 현재 상태, 다음 행동, 승인 경계, 검증 결과를 복원하게 만드는 것이다.

핵심 철학은 네 가지다.

1. Truth를 분리한다.
   - 사람이 승인하고 읽는 기준은 `.agents/artifacts/*` Markdown이다.
   - 빠르게 갱신되는 운영 상태는 `.harness/operating_state.sqlite`에 둔다.
   - generated docs와 PMW 화면은 파생 산출물이다.
   - 파생 산출물이 truth와 다르면 파생물을 직접 고치지 않고 생성 경로를 고친다.

2. 시작 전에 판단 경계를 닫는다.
   - requirements, architecture, packet 없이 바로 구현하지 않는다.
   - DB 설계, 화면 UX, cutover, 보안 risk acceptance처럼 되돌리기 어려운 결정은 사람 확인 지점으로 남긴다.

3. 프로젝트 유형별 반복 실패를 profile로 흡수한다.
   - 모든 프로젝트에 무거운 업무 시스템 규칙을 강제하지 않는다.
   - lightweight app, Android native, Node/frontend app처럼 성격이 다른 프로젝트는 optional profile을 켠다.
   - 실제 화면명, 테이블명, 배포 경로 같은 고유 내용은 project packet에서만 닫는다.

4. PMW는 읽기 전용이다.
   - PMW는 여러 프로젝트의 상태를 보여주는 monitor다.
   - PMW가 `.agents/*`, `.harness/*`, task packet, profile, validation truth를 직접 수정하지 않는다.
   - 프로젝트는 PMW가 읽을 `project-manifest`와 `pmw-read-model`만 export한다.

## 2. 패키지 구성

Windows exe 배포판의 핵심 파일은 두 개다.

- `StandardHarnessSetup.exe`: 새 프로젝트 하네스 설치 파일
- `StandardHarnessPMWSetup.exe`: PMW 설치 파일

운영자 참고용으로 `HARNESS_MANUAL.md`, `PMW_MANUAL.md`도 함께 배포할 수 있다.

이전 폴더형 패키지를 쓰는 경우 전면 파일은 네 개다.

- `INSTALL_HARNESS.cmd`: 새 프로젝트 하네스 설치 파일
- `HARNESS_MANUAL.md`: 이 문서
- `INSTALL_PMW.cmd`: PMW 설치 파일
- `PMW_MANUAL.md`: PMW 사용자 매뉴얼

나머지 템플릿과 실행 코드는 패키지 내부 `.package/` 폴더에 포함된다. `.package/`는 사용자가 직접 편집하지 않는다.

두 exe 모두 portable Node.js runtime을 포함한다. 따라서 대상 PC에 Node.js/npm이 없어도 설치와 기본 실행이 가능하다.

최초 사용자는 보통 아래 순서로 진행한다.

1. `StandardHarnessPMWSetup.exe`로 PMW를 설치한다.
2. `StandardHarnessSetup.exe`로 새 프로젝트를 만든다.
3. 새 프로젝트 폴더에서 `HARNESS.cmd test`, `HARNESS.cmd status`를 실행한다.
4. PMW를 열어 프로젝트가 등록되었는지 확인한다.

## 3. 설치 전 준비

- Windows 기준 사용을 우선 지원한다.
- exe 설치판은 Node.js runtime을 포함한다.
- source checkout에서 직접 개발하거나 `npm` 명령을 쓰려면 Node.js 24 이상이 필요하다.
- 설치할 새 프로젝트 이름과 폴더를 정한다.
- optional profile이 필요한지 대략 판단한다. 모르겠으면 `none`으로 시작한다.

Node.js 24+는 하네스 runtime 요구사항이다. 제품 앱의 Node, Python, Android Gradle, Django 버전 요구사항은 별도로 profile 또는 packet에서 정한다.

## 4. 새 프로젝트 설치

exe 배포판에서는 `StandardHarnessSetup.exe`를 실행한다. CLI 옵션이 필요하면 명령 프롬프트에서 실행한다.

```powershell
StandardHarnessSetup.exe --project-name "My Project" --target-dir "C:\work\my-project" --profiles PRF-07,PRF-09
```

폴더형 패키지에서는 패키지 폴더에서 실행한다.

```powershell
INSTALL_HARNESS.cmd --project-name "My Project" --target-dir "C:\work\my-project" --profiles PRF-07,PRF-09
```

옵션:

- `--project-name`: 프로젝트 표시 이름
- `--target-dir`: 새 repo 폴더
- `--profiles`: comma-separated optional profile 목록. 예: `PRF-07,PRF-09`
- `--user-goal`: 최종사용자 목표
- `--ops-goal`: 운영/복원 목표
- `--approval-goal`: 첫 승인 목표
- `--non-interactive`: 질문 없이 기본값으로 설치

설치 파일이 수행하는 일:

1. 대상 폴더를 만든다.
2. 패키지 내부의 `standard-template`을 복사한다.
3. `harness:init`과 같은 초기화 경로를 실행한다.
4. `.harness/operating_state.sqlite`를 새 프로젝트 기준으로 생성한다.
5. generated state docs를 만든다.
6. `.agents/runtime/project-manifest.json`과 `.agents/runtime/pmw-read-model.json`을 생성한다.
7. PMW global registry에 프로젝트를 등록한다.
8. bundled Node.js runtime을 `%LOCALAPPDATA%\StandardHarness\Runtime\node.exe`에 설치한다.
9. 새 프로젝트 루트에 `HARNESS.cmd` wrapper를 생성한다.

대상 폴더가 이미 존재하고 비어 있지 않으면 설치는 중단된다. 기존 프로젝트에 덮어쓰지 않는다.

## 5. 수동 설치 fallback

설치 파일을 쓰기 어렵다면 다음 순서로 진행한다.

1. 패키지 내부 `standard-template`의 내용을 새 프로젝트 루트로 복사한다.
2. 새 프로젝트 루트에서 `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init`를 실행한다.
3. `npm run harness:pmw-export`를 실행한다.
4. PMW 화면에서 프로젝트 폴더를 add 한다.

일반 사용자는 수동 설치보다 `INSTALL_HARNESS.cmd`를 사용하는 편이 안전하다.

## 6. 설치 후 바로 할 일

새 프로젝트 폴더에서 실행한다.

```powershell
HARNESS.cmd test
HARNESS.cmd status
HARNESS.cmd validate
HARNESS.cmd pmw-export
```

Node.js/npm이 별도로 설치된 개발 PC에서는 기존 npm wrapper도 사용할 수 있다.

```powershell
npm test
npm run harness:status
```

정상 기준:

- `npm test`: 하네스 테스트가 모두 통과한다.
- `harness:status`: 현재 stage, gate, focus, next action이 표시된다.
- `harness:validate`: findings가 없거나 starter bootstrap 상태처럼 의도된 finding만 나온다.
- `harness:pmw-export`: PMW가 읽을 manifest/read-model을 갱신한다.

## 7. 핵심 폴더와 파일

| 경로 | 의미 | 직접 편집 여부 |
| --- | --- | --- |
| `AGENTS.md` | AI agent 진입 규칙 | 보통 유지 |
| `.agents/rules/workspace.md` | workspace 운영 원칙 | 신중히 편집 |
| `.agents/artifacts/CURRENT_STATE.md` | 현재 상태 truth | 필요 시 편집 |
| `.agents/artifacts/TASK_LIST.md` | 현재 task truth | 필요 시 편집 |
| `.agents/artifacts/REQUIREMENTS.md` | requirements truth | 중요 변경 시 편집 |
| `.agents/artifacts/ACTIVE_PROFILES.md` | 활성 profile 선언 | profile 변경 시 편집 |
| `.harness/operating_state.sqlite` | hot operational DB | 직접 편집하지 않음 |
| `.agents/runtime/generated-state-docs/*` | generated docs | 직접 편집하지 않음 |
| `.agents/runtime/project-manifest.json` | PMW project identity | command로 생성 |
| `.agents/runtime/pmw-read-model.json` | PMW read model | command로 생성 |
| `.harness/runtime/*` | 하네스 runtime 코드 | 하네스 개발자가 관리 |
| `.harness/test/*` | 하네스 테스트 | 하네스 개발자가 관리 |
| `reference/packets/*` | task packet | 작업 시작 전 작성 |
| `reference/profiles/*` | optional profile 정의 | profile 활성 시 참조 |

제품 코드는 `src/`, `app/`, `backend/`, `frontend/`, `server/`, Android module 등 프로젝트가 선택한 경로를 쓴다.

## 8. 주요 명령

```powershell
npm test
```

하네스 자체 테스트를 실행한다. 새 프로젝트 생성 직후, profile 변경 후, 하네스 runtime 변경 후 실행한다.

Node.js/npm이 없는 PC에서는 다음을 사용한다.

```powershell
HARNESS.cmd test
```

```powershell
npm run harness:status
```

현재 stage, gate, focus, blocker, decision, next action을 사람 읽기 좋게 확인한다.

Node.js/npm이 없는 PC에서는 `HARNESS.cmd status`를 사용한다.

```powershell
npm run harness:doctor
```

운영자가 현재 상태를 빠르게 진단할 때 사용한다.

```powershell
npm run harness:next
```

다음 행동만 빠르게 확인한다.

```powershell
npm run harness:explain
```

왜 지금 막혀 있는지, 어떤 blocker가 있는지 설명한다.

```powershell
npm run harness:validate
```

하네스 계약 위반을 검사한다. gate close 전에 반드시 실행한다.

```powershell
npm run harness:validation-report
```

validation 결과를 Markdown/JSON evidence로 저장한다.

```powershell
npm run harness:pmw-export
```

PMW가 읽을 project manifest와 read model을 갱신한다. PMW 화면이 오래된 것처럼 보이면 먼저 이 명령을 실행한다.

```powershell
npm run harness:migration-preview
npm run harness:migration-apply
```

legacy path나 이전 구조에서 현재 구조로 옮길 변경을 미리 보고 적용한다. 적용 전 preview를 먼저 본다.

```powershell
npm run harness:cutover-preflight
npm run harness:cutover-report
```

cutover readiness를 확인하고 evidence report를 만든다.

## 9. Optional Profile 선택법

기본값은 `none`이다. 프로젝트 성격이 분명할 때만 켠다.

| Profile | 사용 상황 |
| --- | --- |
| `PRF-01` | 운영자용 dense grid, search/filter/sort, row action이 핵심 |
| `PRF-02` | spreadsheet가 authoritative source인 프로젝트 |
| `PRF-03` | 폐쇄망, 수동 반입, offline bundle, removable media 전달 |
| `PRF-04` | Excel/VBA/MariaDB legacy 업무 시스템 대체 |
| `PRF-05` | Python/Django backoffice |
| `PRF-06` | workflow, approval, audit, state transition이 핵심 |
| `PRF-07` | lightweight web/app, 작은 내부 도구, 단순 앱 |
| `PRF-08` | Android native app, Gradle/AGP, signing, permissions, device test |
| `PRF-09` | Node/frontend app, SPA/SSR/static site, package/build/test/deploy 경계 |

예시:

```powershell
INSTALL_HARNESS.cmd --project-name "Internal Tool" --target-dir "C:\work\internal-tool" --profiles PRF-07
```

```powershell
INSTALL_HARNESS.cmd --project-name "Frontend Portal" --target-dir "C:\work\portal" --profiles PRF-09
```

```powershell
INSTALL_HARNESS.cmd --project-name "Android Field App" --target-dir "C:\work\field-app" --profiles PRF-08
```

```powershell
INSTALL_HARNESS.cmd --project-name "Budget Replacement" --target-dir "C:\work\budget" --profiles PRF-04,PRF-05,PRF-06
```

profile은 여러 개를 동시에 켤 수 있다. 단, 활성화된 profile은 active packet에서 필요한 evidence를 채워야 한다.

## 10. 표준 작업 흐름

### 10.1 Kickoff

1. `START_HERE.md`를 읽는다.
2. `.agents/artifacts/REQUIREMENTS.md`에 사용자 목표, 운영 목표, 승인 목표를 정리한다.
3. `reference/planning/PLN-00_DEEP_INTERVIEW.md`로 초기 질문을 닫는다.
4. `reference/planning/PLN-01_REQUIREMENTS_FREEZE.md`로 requirements freeze를 기록한다.

### 10.2 구현 전

1. requirements가 닫혔는지 확인한다.
2. architecture / implementation / UI baseline을 requirements와 맞춘다.
3. `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`를 복사해 실제 task packet을 만든다.
4. packet에 active profile, source, acceptance, human approval boundary를 적는다.
5. user-facing, data-impact, deploy/cutover 작업은 사람 승인 지점을 닫는다.

### 10.3 구현 중

1. packet 범위 밖의 변경을 섞지 않는다.
2. 제품 코드와 하네스 코드를 분리한다.
3. 변경한 truth와 DB/generated state가 충돌하지 않게 한다.
4. 중간에 요구사항이 바뀌면 구현보다 rebaseline을 먼저 한다.

### 10.4 구현 후

1. `npm test`
2. `npm run harness:validate`
3. `npm run harness:validation-report`
4. `npm run harness:pmw-export`
5. 필요한 경우 `harness:cutover-preflight`, `harness:cutover-report`
6. review gate close

## 11. 상황별 사용법

### 새 프로젝트를 빠르게 시작해야 할 때

1. PMW 설치 여부를 확인한다.
2. `INSTALL_HARNESS.cmd --project-name ... --target-dir ... --profiles ...`를 실행한다.
3. 새 프로젝트에서 `npm test`와 `harness:status`를 실행한다.
4. PMW에서 프로젝트가 보이는지 확인한다.
5. `PLN-00`, `PLN-01`부터 닫는다.

### 작은 웹앱이나 내부 도구

- `PRF-07`을 우선 고려한다.
- Node/frontend package boundary가 있으면 `PRF-09`도 켠다.
- 전체 workflow/approval profile을 무리하게 켜지 않는다.

예:

```powershell
INSTALL_HARNESS.cmd --project-name "Ops Checklist" --target-dir "C:\work\ops-checklist" --profiles PRF-07,PRF-09
```

### Android native 앱

- `PRF-08`을 켠다.
- packet에서 package namespace, Gradle/AGP, minSdk/targetSdk, signing, permissions, storage, network boundary, device/emulator test plan을 닫는다.

### Node/frontend 앱

- `PRF-09`를 켠다.
- packet에서 product source root, package ownership, Node product runtime, package manager, framework/bundler, build/test command, env policy, API/backend boundary, static routing, deploy target을 닫는다.
- root `package.json`을 제품도 사용한다면 harness scripts 보존 정책을 먼저 적는다.

### Excel/VBA/MariaDB legacy 대체

- 보통 `PRF-04`, `PRF-05`, `PRF-06` 조합을 고려한다.
- 기존 DB schema 또는 동등한 authoritative schema artifact를 요청한다.
- migration/reconciliation, approval/audit, rollback/cutover 경계를 packet에서 닫기 전 구현하지 않는다.

### 이미 진행 중인 프로젝트에 새 기획 문서가 들어왔을 때

1. 새 문서를 authoritative source로 등록한다.
2. requirements, architecture, implementation plan, active packet 영향 범위를 분석한다.
3. 충돌, 재작업, defer 여부를 사용자에게 확인한다.
4. rebaseline 없이 기존 구현을 계속 밀지 않는다.

### PMW 화면이 최신이 아닐 때

프로젝트 루트에서 실행한다.

```powershell
HARNESS.cmd pmw-export
```

그 뒤 PMW를 새로고침한다.

### validation이 실패할 때

1. finding code와 path를 확인한다.
2. generated docs를 직접 수정하지 않는다.
3. governance Markdown 또는 DB/generation path를 고친다.
4. 다시 `npm run harness:validate`를 실행한다.

### 제품 코드가 root `package.json`을 써야 할 때

1. 모든 `harness:*` script를 보존한다.
2. 제품 Node 버전과 하네스 Node.js 24+ 요구사항을 분리해 적는다.
3. active packet에 package ownership policy를 남긴다.
4. `PRF-09`가 켜져 있으면 Node/frontend profile evidence를 채운다.

## 12. 하지 말아야 할 일

- `.agents/runtime/generated-state-docs/*`를 직접 고치지 않는다.
- PMW를 write authority로 취급하지 않는다.
- active packet 없이 구현을 시작하지 않는다.
- DB schema, cutover, 보안 risk acceptance를 사람 확인 없이 닫지 않는다.
- 특정 프로젝트의 테이블명, 화면명, 운영 host를 core 규칙으로 승격하지 않는다.
- profile이 필요 없는데 모든 profile을 켜지 않는다.

## 13. 문제 해결

### Node.js 버전 오류

Node.js 24 이상을 설치한 뒤 다시 실행한다.

### 설치 대상 폴더가 비어 있지 않다는 오류

새 빈 폴더를 지정한다. 기존 프로젝트에 덮어쓰는 방식은 지원하지 않는다.

### PMW registry 등록은 되었는데 화면에 상태가 없다

프로젝트 루트에서 `npm run harness:pmw-export`를 실행한다.

### `harness:validate`가 starter bootstrap pending을 표시한다

수동 복사 후 아직 `harness:init`을 실행하지 않은 상태일 수 있다. `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init`를 실행한다.

### package payload missing 오류

설치 패키지에서 `.package/` 폴더가 누락된 상태다. `INSTALL_HARNESS.cmd`, `INSTALL_PMW.cmd`, 두 manual만 복사하고 `.package/`를 빼면 설치할 수 없다.

## 14. 최종 기준

하네스는 프로젝트를 대신 설계해 주는 도구가 아니다. 프로젝트가 `무엇을 왜 하는지`, `무엇을 승인해야 하는지`, `어디까지 구현해도 되는지`, `현재 다음 행동이 무엇인지`를 지속적으로 잃지 않게 만드는 운영 장치다.
