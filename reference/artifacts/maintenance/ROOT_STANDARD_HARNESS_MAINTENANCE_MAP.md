# Root Standard Harness Maintenance Map

이 문서는 이 저장소를 유지보수할 때 `무엇이 루트 정본인지`, `무엇이 starter로 나가야 하는지`, `무엇이 최종 생성물인지`를 빠르게 판정하기 위한 기준 문서다.

## 1. 저장소를 네 층으로 본다

### A. 유지보수 정본

이 레포 자체를 운영하기 위한 정본이다.

- `AGENTS.md`
- `.agents/*`
- `.harness/runtime/*`
- `.harness/test/*`
- `reference/artifacts/maintenance/*`
- `PROJECT_WORKFLOW_MANUAL.md`

여기서 특히 루트 `.agents/*`는 `설치용 표준 하네스`가 아니라 `이 제작 레포의 정본 운영 레이어`다.

### B. 배포용 원본

이 영역은 실제 표준 하네스 결과물의 source다.

- `standard-template/*`
- `installer/*`
- `pmw-app/*`
- `packaging/*`
- `reference/manuals/*`

### C. 최종 생성 결과물

- `dist/windows-exe-v1.2/*`

현재 최종 exe 배포본은 여기만 유지하고 Git 추적 대상으로 본다.

### D. generated / disposable output

- `.agents/runtime/generated-state-docs/*`
- `.agents/artifacts/VALIDATION_REPORT.*`
- `.harness/operating_state.sqlite`
- `.tmp/*`
- `dist/` 아래 `windows-exe-v1.2/`를 제외한 generated output

이 영역은 직접 편집하지 않는다. 생성 경로를 고치고 다시 만든다.

## 2. 무엇을 어디까지 수정해야 하는가

### 2.1 root만 수정하는 경우

아래는 보통 root-only다.

- `.agents/artifacts/*` live truth
- maintainer 문서
- installer packaging behavior
- PMW app install/runtime behavior
- release build script

대표 경로:

- `.agents/*`
- `installer/*`
- `pmw-app/*`
- `packaging/*`

### 2.2 root와 standard-template를 같이 수정하는 경우

새 프로젝트에 복사되는 성격의 변경은 root와 `standard-template/`를 같이 본다.

- workspace rule
- starter bootstrap behavior
- `.harness/runtime/*`
- `.harness/test/*`
- reusable profile contract
- reusable packet template
- reusable artifact baseline
- starter가 실제로 읽는 top-level docs

대표 경로:

- `.agents/rules/workspace.md`
- `.agents/scripts/init-project.js`
- `.harness/runtime/state/*`
- `.harness/test/*`
- `reference/profiles/*`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- `reference/artifacts/*` 중 reusable contract
- `standard-template/*` 대응 파일

실제 sync path의 강제 기준은 `drift-validator.js`의 `validateStarterSync()`가 가진 `syncPaths`다.

## 3. standard-template에 남겨야 하는 것

`standard-template/`는 exe payload의 입력물이다. 그냥 참고용 폴더가 아니다.

남겨야 하는 것:

- 새 프로젝트 루트로 복사되는 파일
- starter kickoff 문서
- 설치된 프로젝트가 읽는 manual
- reusable runtime/test/reference

남기지 말아야 하는 것:

- maintainer-only workflow 문서
- root 유지보수 전용 문서
- legacy manual
- 중간 빌드 산출물
- generated clutter

starter top-level 문서는 현재 아래만 유지한다.

- `README.md`
- `START_HERE.md`
- `HARNESS_MANUAL.md`
- `PMW_MANUAL.md`
- `AGENTS.md`
- `INIT_STANDARD_HARNESS.cmd`
- `package.json`

## 4. 대표 변경별 수정 포인트

### 하네스 runtime/state를 바꿀 때

수정:

- root `.harness/runtime/state/*`
- `standard-template/.harness/runtime/state/*`
- 필요하면 root/starter `.harness/test/*`

검증:

- root harness tests
- `standard-template` harness tests
- root validate

### starter bootstrap/init를 바꿀 때

수정:

- `.agents/scripts/init-project.js`
- `.harness/runtime/state/init-project.js`
- `standard-template/.agents/scripts/init-project.js`
- `standard-template/.harness/runtime/state/init-project.js`
- starter-facing docs

검증:

- root/starter init tests
- copied-starter smoke

### profile / packet / artifact contract를 바꿀 때

수정:

- root `reference/profiles/*`, `reference/packets/*`, `reference/artifacts/*`
- `standard-template/reference/...` 대응 파일
- 필요하면 validator fixture

검증:

- root/starter validator tests
- root validate

### PMW export contract를 바꿀 때

수정:

- root/starter `project-manifest.js`
- `pmw-app/runtime/project-registry.js`
- 필요하면 `pmw-app/runtime/server.js`
- manuals

검증:

- root/starter PMW tests
- `pmw-app` tests

### 설치 방식 / 배포 방식 / exe 구성을 바꿀 때

수정:

- `installer/*`
- `pmw-app/*`
- `packaging/*`
- root manuals
- starter manual이 실제 사용법을 바꾸는 경우 starter docs

검증:

- `package:release`
- `package:windows-exe`
- installer/PMW smoke

## 5. 추가 lane을 열 때 체크리스트

1. 이번 변경이 `maintainer-only / reusable harness / release-only` 중 무엇인지 먼저 분류한다.
2. reusable harness 변경이면 root와 `standard-template/` 반영 범위를 먼저 고정한다.
3. 사용자 설치 흐름이 바뀌면 `reference/manuals/*`를 같이 갱신한다.
4. source 안정화 전에는 `dist/windows-exe-v1.2/`를 다시 만들지 않는다.
5. `dist/`를 직접 수정하지 않는다.

## 6. GitHub 공개 기준

- repo: source, template, installer, PMW app, manuals, maintainer docs
- repo: source, template, installer, PMW app, manuals, maintainer docs, canonical final exe under `dist/windows-exe-v1.2/`
- Releases: 필요하면 같은 exe를 추가 배포

즉, GitHub에서는 source와 최종 설치 파일을 함께 볼 수 있어야 한다.

## 7. 빠른 판단 규칙

- 새 프로젝트에 복사되는가: `standard-template/`까지 본다.
- installer/PMW 자체가 바뀌는가: `installer/`, `pmw-app/`, `packaging/`를 본다.
- 문서가 설치된 프로젝트에서 읽히는가: `reference/manuals/`와 starter docs를 본다.
- generated 결과만 바뀌는가: source를 고치지 않고 generated output만 손대지 않는다.
