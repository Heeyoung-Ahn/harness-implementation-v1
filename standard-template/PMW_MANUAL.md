# PMW User Manual

PMW는 별도 설치형 read-only monitor다. 이 프로젝트 안에 PMW 앱을 설치하지 않는다.

## 이 프로젝트가 PMW에 제공하는 파일

```powershell
npm run harness:pmw-export
```

exe installer로 만든 프로젝트에서 Node.js/npm이 없다면 다음을 사용한다.

```powershell
HARNESS.cmd pmw-export
```

이 명령은 아래 파일을 갱신한다.

- `.agents/runtime/project-manifest.json`
- `.agents/runtime/pmw-read-model.json`

PMW는 이 두 파일을 읽는다. `.agents/artifacts/*`, `.harness/operating_state.sqlite`, task packet, profile, validation report를 직접 수정하지 않는다.

## PMW에 등록

1. 프로젝트 루트에서 `npm run harness:pmw-export`를 실행한다.
2. 별도 설치된 PMW를 연다.
3. project repo folder 입력란에 이 프로젝트 루트 경로를 넣고 Add 한다.
4. 프로젝트 목록에서 Select 한다.

installer로 생성된 프로젝트는 보통 PMW registry에 자동 등록된다.

## PMW에서 가능한 일

- Add: project manifest가 있는 repo를 registry에 추가.
- Select: 현재 표시할 프로젝트 선택.
- Archive: registry에 남기되 active default selection에서 제외.
- Remove: PMW registry에서만 제거.

Archive/Remove는 프로젝트 파일을 삭제하지 않는다.

## 상태가 오래되어 보일 때

프로젝트 루트에서:

```powershell
npm run harness:pmw-export
```

그 뒤 PMW 화면을 새로고침한다.
