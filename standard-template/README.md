# Standard Harness Starter

이 폴더는 `참고용 샘플`이 아니라 실제 배포 payload다.

- source 설치기(`installer/install-harness.js`)는 이 폴더를 복사한다.
- Windows exe 빌더도 이 폴더를 payload에 넣는다.
- 수동 설치를 해도 이 폴더 안의 내용물이 새 프로젝트 레포 루트로 들어간다.

즉, `standard-template/` 안의 파일은 필요 없으면 지워도 되는 보조 자료가 아니다. 설치된 프로젝트가 실제로 받는 내용이다.

## 처음 보는 사람은 이것만 본다

- `START_HERE.md`
- `HARNESS_MANUAL.md`

이 starter에는 maintainer-only 문서를 두지 않는다.

## 이 starter에 남기는 것

- `AGENTS.md`
- `.agents/*`
- `.harness/runtime/*`
- `.harness/test/*`
- `reference/*` 중 starter가 실제로 쓰는 reusable 자료
- `README.md`
- `START_HERE.md`
- `HARNESS_MANUAL.md`
- `INIT_STANDARD_HARNESS.cmd`
- `package.json`

## 이 starter에 두지 않는 것

- maintainer workflow 문서
- root 유지보수 문서
- legacy manual
- release 중간산출물
- generated clutter

## 첫 사용 순서

1. 가능하면 상위 저장소의 `installer/install-harness.js`로 새 프로젝트를 생성한다.
2. 수동 설치라면 `standard-template/` 폴더 자체가 아니라 **폴더 안의 내용물 전체**를 새 프로젝트 레포 루트에 복사한다.
3. Node.js 24 이상이 설치되어 있는지 확인한다.
4. 프로젝트 루트에서 `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init`를 실행한다.
5. `START_HERE.md`를 따라 kickoff baseline을 만든다.

초기화가 끝나면 starter placeholder가 프로젝트 전용 내용으로 바뀌고 `.harness/operating_state.sqlite`, generated docs, `ACTIVE_CONTEXT.*`가 새 프로젝트 기준으로 생성된다.

제품 코드는 `src/`, `app/`, `backend/`, `frontend/`, `server/` 등 프로젝트가 원하는 경로를 자유롭게 선택할 수 있다. 하네스 구현은 `.harness/runtime/`과 `.harness/test/`에 격리되어 있다.

## 유지보수자에게

reusable behavior를 바꿀 때는 `standard-template/`만 고치지 말고 root source of truth와 같이 맞춘다. 변경 전파 기준은 root의 `PROJECT_WORKFLOW_MANUAL.md`와 `reference/artifacts/maintenance/ROOT_STANDARD_HARNESS_MAINTENANCE_MAP.md`를 따른다.
