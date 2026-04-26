# harness-implementation-v1

이 저장소는 두 가지를 함께 담고 있다.

1. 이 프로젝트 자체를 유지하기 위한 하네스
2. 다른 프로젝트에 설치해서 쓰는 표준 하네스 산출물의 원본 소스

이 구분이 흐려지면 `루트 정본`, `starter`, `installer`, `exe 결과물`이 한꺼번에 섞여 보인다. 이 README는 그 경계를 먼저 고정한다.

## 루트 구조

### 1. 이 프로젝트를 유지하기 위한 하네스

- [`AGENTS.md`](/C:/Newface/30%20Github/harness-implementation-v1/AGENTS.md)
- [`.agents/`](/C:/Newface/30%20Github/harness-implementation-v1/.agents)
- [`.harness/runtime/`](/C:/Newface/30%20Github/harness-implementation-v1/.harness/runtime)
- [`.harness/test/`](/C:/Newface/30%20Github/harness-implementation-v1/.harness/test)
- [`PROJECT_WORKFLOW_MANUAL.md`](/C:/Newface/30%20Github/harness-implementation-v1/PROJECT_WORKFLOW_MANUAL.md)
- [`reference/artifacts/maintenance/`](/C:/Newface/30%20Github/harness-implementation-v1/reference/artifacts/maintenance)

이 영역은 `표준 하네스를 만드는 레포`의 운영 정본이다.

- `.agents/artifacts/*`: 이 레포의 governance truth
- `.harness/operating_state.sqlite`: 이 레포의 hot-state
- `.agents/runtime/generated-state-docs/*`: 파생 산출물

즉, 루트 `.agents` 전체는 설치 대상이 아니라 `이 제작 레포의 정본 운영 레이어`다.

### 2. 이 프로젝트의 결과물 원본

- [`standard-template/`](/C:/Newface/30%20Github/harness-implementation-v1/standard-template)
- [`installer/`](/C:/Newface/30%20Github/harness-implementation-v1/installer)
- [`pmw-app/`](/C:/Newface/30%20Github/harness-implementation-v1/pmw-app)
- [`packaging/`](/C:/Newface/30%20Github/harness-implementation-v1/packaging)
- [`reference/manuals/`](/C:/Newface/30%20Github/harness-implementation-v1/reference/manuals)

각 역할은 다음과 같다.

- `standard-template/`: 새 프로젝트 레포에 실제로 복사되는 starter payload
- `installer/`: source checkout에서 starter를 설치하는 설치기 소스
- `pmw-app/`: PMW 설치형 앱 소스
- `packaging/`: release package, Windows exe를 만드는 빌드 스크립트
- `reference/manuals/`: 배포용 manual source

### 3. 최종 생성 산출물

- [`dist/windows-exe-v1.2/`](/C:/Newface/30%20Github/harness-implementation-v1/dist/windows-exe-v1.2)

이 폴더가 현재 canonical 최종 exe 결과물이다.

- `StandardHarnessSetup.exe`
- `StandardHarnessPMWSetup.exe`
- `HARNESS_MANUAL.md`
- `PMW_MANUAL.md`

`dist/` 아래의 다른 폴더는 중간산출물 또는 중복 산출물로 취급하고 유지하지 않는다.

## 무엇이 최종인가

- 유지보수 정본: 루트의 `.agents/`, `.harness/runtime/`, `.harness/test/`
- 설치 전 표준 하네스 원본: `standard-template/`, `installer/`, `pmw-app/`, `packaging/`
- 최종 사용자 배포본: `dist/windows-exe-v1.2/`

핵심은 이렇다.

- `standard-template/`은 버려도 되는 복사본이 아니다.
- `standard-template/`은 exe payload의 핵심 입력물이다.
- 새 프로젝트 설치 시 `standard-template/` 안의 내용물이 프로젝트 레포 루트로 들어간다.
- `dist/`는 source of truth가 아니라 generated output이다.

## 처음 보는 사람은 이렇게 보면 된다

### 저장소를 이해하려는 경우

1. 이 README
2. [`reference/manuals/HARNESS_MANUAL.md`](/C:/Newface/30%20Github/harness-implementation-v1/reference/manuals/HARNESS_MANUAL.md)
3. [`reference/manuals/PMW_MANUAL.md`](/C:/Newface/30%20Github/harness-implementation-v1/reference/manuals/PMW_MANUAL.md)
4. [`PROJECT_WORKFLOW_MANUAL.md`](/C:/Newface/30%20Github/harness-implementation-v1/PROJECT_WORKFLOW_MANUAL.md)
5. [`reference/artifacts/maintenance/ROOT_STANDARD_HARNESS_MAINTENANCE_MAP.md`](/C:/Newface/30%20Github/harness-implementation-v1/reference/artifacts/maintenance/ROOT_STANDARD_HARNESS_MAINTENANCE_MAP.md)

### 표준 하네스를 바로 써보려는 경우

소스에서 바로 설치:

```powershell
node installer/install-harness.js --project-name "My Project" --target-dir "C:\work\my-project" --profiles PRF-07,PRF-09
```

수동 설치:

1. `standard-template/` 폴더 자체가 아니라 그 안의 내용물을 새 프로젝트 루트에 복사
2. `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init` 실행

Windows exe 배포본이 준비된 경우:

1. `StandardHarnessSetup.exe`
2. `StandardHarnessPMWSetup.exe`

를 사용한다.

## GitHub 배포 기준

이 저장소는 아래 둘을 함께 유지한다.

- source, template, installer, PMW app, manuals, maintainer docs
- canonical 최종 exe 산출물 `dist/windows-exe-v1.2/`

즉, GitHub repo만 봐도 구조 이해와 설치 파일 확보가 가능해야 한다. 필요하면 같은 exe를 GitHub Releases에도 추가로 올릴 수 있다.

## 수정 규칙

- 새 프로젝트에 복사되어야 하는 변경이면 root source와 `standard-template/`를 같은 작업 안에서 함께 맞춘다.
- installer/PMW/release 빌드 변경이면 `installer/`, `pmw-app/`, `packaging/`를 수정한다.
- `dist/windows-exe-v1.2/`를 제외한 `dist/` 내용은 직접 고치지 않고 다시 생성한다.
- `standard-template/`에는 설치된 프로젝트가 실제로 읽는 파일만 둔다. maintainer-only 문서는 넣지 않는다.

Node.js 24+는 하네스 runtime/build 요구사항이다. 제품 앱의 런타임 요구사항은 각 프로젝트 packet/profile에서 별도로 정한다.
