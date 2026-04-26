# Project Workflow Manual

이 문서는 `설치된 표준 하네스 사용자용`이 아니라 `이 저장소를 유지보수하는 사람`을 위한 가이드다.

운영자/사용자용 설치 안내는 아래 문서를 기준으로 본다.

- `reference/manuals/HARNESS_MANUAL.md`
- `reference/manuals/PMW_MANUAL.md`

정밀한 변경 전파 기준은 아래 문서를 기준으로 본다.

- `reference/artifacts/maintenance/ROOT_STANDARD_HARNESS_MAINTENANCE_MAP.md`

## 먼저 구분할 것

이 저장소에는 두 층이 있다.

### 1. 유지보수 정본

- `AGENTS.md`
- `.agents/*`
- `.harness/runtime/*`
- `.harness/test/*`
- `reference/artifacts/maintenance/*`

이건 `표준 하네스를 만드는 레포`의 정본이다.

### 2. 배포용 산출물 원본

- `standard-template/*`
- `installer/*`
- `pmw-app/*`
- `packaging/*`
- `reference/manuals/*`

이건 `다른 프로젝트에 전달되는 것`의 원본이다.

## 추가 lane을 열 때 기준

표준 하네스를 수정할 때는 먼저 이번 변경이 어느 종류인지 분류한다.

### A. maintainer-only 변경

예:

- 이 레포의 `.agents/artifacts/*`
- 이 레포의 상태 관리 방식
- maintainer 문서

이 경우:

- 루트 정본만 수정한다.
- `standard-template/`까지 자동으로 건드리지 않는다.

### B. reusable harness 변경

예:

- `.agents/scripts/init-project.js`
- `.harness/runtime/*`
- `.harness/test/*`
- reusable profile / packet / artifact contract
- starter kickoff 문서

이 경우:

1. 루트 source of truth를 먼저 수정한다.
2. 같은 변경을 `standard-template/`에 반영한다.
3. root/starter를 같은 lane 안에서 검증한다.

이게 가장 중요하다. 새 프로젝트에 복사되어야 하는 변경이면 `standard-template/`이 빠지면 안 된다.

### C. release-only 변경

예:

- `installer/*`
- `pmw-app/*`
- `packaging/*`
- release 문구나 install UX

이 경우:

- root source를 수정한다.
- 필요하면 manual만 같이 갱신한다.
- `standard-template/`는 실제 starter 내용이 바뀌는 경우에만 건드린다.

## standard-template 편집 규칙

`standard-template/`는 정리 대상이 아니라 실제 starter payload다. 다만 아무 문서나 넣으면 안 된다.

남겨야 하는 것:

- starter가 실제로 복사하는 파일
- kickoff 문서
- 설치된 프로젝트가 읽는 manual
- reusable runtime/test/reference

넣지 말아야 하는 것:

- maintainer-only workflow 문서
- root 유지보수 전용 문서
- legacy 참고문서
- generated 파일
- release 중간산출물

현재 starter top-level 문서는 아래만 유지한다.

- `README.md`
- `START_HERE.md`
- `HARNESS_MANUAL.md`
- `PMW_MANUAL.md`
- `AGENTS.md`

## 작업 순서

1. 변경을 `maintainer-only / reusable harness / release-only` 중 하나로 분류한다.
2. reusable harness 변경이면 root source와 `standard-template/` 동기화 범위를 먼저 적는다.
3. 코드/문서 변경을 적용한다.
4. 사용자 설치 흐름이 바뀌면 `reference/manuals/*`를 같이 갱신한다.
5. 최종 배포본이 필요할 때만 `dist/windows-exe-v1.2/`를 다시 생성한다.

## 검증 기준

reusable harness 변경 후:

- root harness tests
- `standard-template` harness tests
- root validate

PMW contract 변경 후:

- root/starter PMW export 확인
- `pmw-app` tests

release 변경 후:

- `package:release`
- `package:windows-exe`
- installer/PMW smoke

## GitHub 공개 기준

- repo에는 source, manuals, canonical 최종 exe 산출물 `dist/windows-exe-v1.2/`를 함께 둔다.
- 필요하면 같은 exe를 GitHub Releases 자산으로도 배포할 수 있다.
- `dist/windows-exe-v1.2/`를 제외한 다른 `dist/` 내용은 generated output으로 보고 직접 수정하지 않는다.
