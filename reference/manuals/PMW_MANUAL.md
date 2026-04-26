# PMW User Manual

PMW(Project Monitor Workspace)는 V1.2 표준 하네스 프로젝트들을 한 화면에서 선택하고 읽는 별도 앱이다. PMW는 read-only monitor이며 프로젝트 truth를 직접 수정하지 않는다.

## 1. PMW의 역할

PMW가 하는 일:

- 여러 표준 하네스 프로젝트를 registry에 등록한다.
- 프로젝트를 선택해 현재 stage, gate, next action, focus, diagnostics를 보여준다.
- archived project를 registry에 남겨 둘 수 있다.
- registry에서 프로젝트를 제거할 수 있다.

PMW가 하지 않는 일:

- `.agents/artifacts/*`를 수정하지 않는다.
- `.harness/operating_state.sqlite`를 수정하지 않는다.
- task packet, profile, validation report를 수정하지 않는다.
- 제품 코드나 하네스 코드를 생성하지 않는다.

PMW가 읽는 파일은 프로젝트가 export한 두 파일이다.

- `.agents/runtime/project-manifest.json`
- `.agents/runtime/pmw-read-model.json`

## 2. 설치

exe 배포판에서는 다음 파일을 실행한다.

```powershell
StandardHarnessPMWSetup.exe
```

폴더형 패키지에서는 배포 패키지 폴더에서 실행한다.

```powershell
INSTALL_PMW.cmd
```

설치 결과:

- PMW 앱이 `%LOCALAPPDATA%\StandardHarnessPMW\app` 아래에 설치된다.
- bundled Node.js runtime이 PMW 앱 폴더의 `runtime-node\node.exe`로 설치된다.
- 바탕화면에 `Standard Harness PMW.cmd` 바로가기가 만들어진다.
- project registry는 `%APPDATA%\StandardHarnessPMW\projects.json`에 저장된다.

exe 설치판은 Node.js runtime을 포함하므로 대상 PC에 Node.js가 없어도 실행된다.

## 3. 실행

바탕화면의 `Standard Harness PMW.cmd`를 실행한다.

기본 주소:

```text
http://127.0.0.1:4174
```

이미 브라우저가 열리지 않았다면 위 주소를 직접 열어도 된다.

## 4. 프로젝트 등록

### installer로 만든 프로젝트

`INSTALL_HARNESS.cmd`로 만든 프로젝트는 설치 과정에서 PMW registry에 자동 등록된다.

### 수동으로 등록

프로젝트 루트에서 먼저 실행한다.

```powershell
npm run harness:pmw-export
```

Node.js/npm이 없는 PC에서 exe installer로 만든 프로젝트라면 다음을 사용한다.

```powershell
HARNESS.cmd pmw-export
```

PMW 화면에서 project repo folder에 프로젝트 루트 경로를 입력하고 `Add`를 누른다.

PMW는 해당 폴더 아래의 `.agents/runtime/project-manifest.json`을 읽어 registry에 등록한다.

## 5. 프로젝트 선택 화면

왼쪽 영역:

- project folder 입력
- Add 버튼
- 등록된 프로젝트 목록
- Select / Archive / Remove 버튼

오른쪽 영역:

- 선택된 프로젝트 이름
- Stage
- Gate
- Next
- Current Focus
- Diagnostics

## 6. Registry 동작

Registry 파일:

```text
%APPDATA%\StandardHarnessPMW\projects.json
```

Registry action:

- `Add`: 프로젝트 manifest를 읽고 registry에 추가한다.
- `Select`: 현재 표시할 프로젝트로 선택한다.
- `Archive`: registry에는 남기지만 active default selection에서 제외한다.
- `Remove`: PMW registry에서만 제거한다.

Archive와 Remove는 프로젝트 폴더를 삭제하지 않는다. 프로젝트 truth도 수정하지 않는다.

## 7. PMW 상태 갱신

PMW 화면은 프로젝트가 마지막으로 export한 read model을 읽는다. 프로젝트 작업을 진행한 뒤 PMW를 최신화하려면 프로젝트 루트에서 실행한다.

```powershell
npm run harness:pmw-export
```

그 뒤 PMW 화면을 새로고침한다.

## 8. 최초 사용 추천 순서

1. `INSTALL_PMW.cmd` 실행
2. 바탕화면 `Standard Harness PMW.cmd` 실행 확인
3. `StandardHarnessSetup.exe`로 새 프로젝트 생성
4. 새 프로젝트에서 `HARNESS.cmd test`
5. 새 프로젝트에서 `HARNESS.cmd status`
6. PMW에서 프로젝트 선택
7. stale 상태처럼 보이면 `npm run harness:pmw-export`

## 9. 여러 프로젝트 운영

여러 repo를 동시에 운영할 때:

1. 각 프로젝트에서 `npm run harness:pmw-export`를 실행한다.
2. PMW에서 각 프로젝트 폴더를 Add 한다.
3. 현재 보고 싶은 프로젝트를 Select 한다.
4. 완료되었거나 당분간 보지 않을 프로젝트는 Archive 한다.
5. 더 이상 registry에 필요 없으면 Remove 한다.

PMW는 프로젝트 간 truth를 합치지 않는다. 각 프로젝트의 manifest/read-model을 개별적으로 읽는다.

## 10. 문제 해결

### Add 시 manifest not found 오류

입력한 폴더가 프로젝트 루트인지 확인한다. 프로젝트 루트에서 다음 명령을 실행한 뒤 다시 Add 한다.

```powershell
npm run harness:pmw-export
```

### PMW 화면이 오래된 상태를 보여준다

프로젝트 루트에서 `npm run harness:pmw-export`를 다시 실행하고 PMW를 새로고침한다.

### 바탕화면 바로가기가 실행되지 않는다

`%LOCALAPPDATA%\StandardHarnessPMW\app` 폴더가 있는지 확인한다. 없으면 `INSTALL_PMW.cmd`를 다시 실행한다.

### Port 4174가 이미 사용 중이다

PMW를 이미 실행 중인지 확인한다. 다른 프로세스가 사용 중이면 해당 프로세스를 종료하거나 PMW를 다른 포트로 실행한다.

```powershell
set PMW_PORT=4180
%LOCALAPPDATA%\StandardHarnessPMW\app\START_PMW.cmd
```

### Registry를 새로 시작하고 싶다

PMW registry 파일은 `%APPDATA%\StandardHarnessPMW\projects.json`이다. registry reset은 등록 목록만 초기화한다. 프로젝트 폴더와 프로젝트 truth는 별개다.

## 11. 안전 원칙

- PMW는 항상 read-only surface다.
- 프로젝트 상태 변경은 프로젝트 repo 안에서 하네스 명령과 governance 문서로 수행한다.
- PMW에서 archive/remove를 해도 프로젝트 파일은 삭제되지 않는다.
- PMW가 보여주는 값이 이상하면 PMW를 고치기 전에 프로젝트 export 상태를 먼저 확인한다.

## 12. 운영 기준

PMW는 프로젝트를 관리하는 주체가 아니라 프로젝트 상태를 읽는 창이다. 실제 판단, 승인, 구현, 검증은 각 프로젝트의 표준 하네스 안에서 닫는다.
