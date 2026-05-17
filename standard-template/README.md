# Standard Harness Starter

이 문서는 `standard-template/` source에서 읽을 때도, 설치된 새 프로젝트 루트에서 읽을 때도 같은 내용으로 이해되게 작성한다.

- maintainer repo에서는 이 폴더가 실제 배포 payload source다.
- 설치된 프로젝트에서는 이 파일이 repo root의 `README.md`가 된다.
- 수동 설치를 해도 이 문서와 같은 파일들이 새 프로젝트 레포 루트로 들어간다.

## 처음 보는 사람은 이것만 본다

- `START_HERE.md`
- `reference/manuals/HARNESS_MANUAL.md`

읽는 순서는 아래로 고정한다.

1. `START_HERE.md`
2. `reference/manuals/HARNESS_MANUAL.md`

`START_HERE.md`는 5분 안에 kickoff를 열기 위한 문서다.
`reference/manuals/HARNESS_MANUAL.md`는 실제 운영 기준과 전체 기능 설명을 담은 primary manual이다.

이 starter는 새 프로젝트가 바로 kickoff할 수 있는 파일만 남긴다. maintainer 전용 generated output이나 empty placeholder directory는 starter 기본 payload로 두지 않는다.

## 이 starter에 남기는 것

- `AGENTS.md`
- `.agents/*`
- `.harness/runtime/*`
- `.harness/test/*`
- `reference/*` 중 starter가 실제로 쓰는 reusable 자료
- `README.md`
- `START_HERE.md`
- `reference/manuals/HARNESS_MANUAL.md`
- `INIT_STANDARD_HARNESS.cmd`
- `package.json`

## 이 starter에 두지 않는 것

- maintainer repo 전용 generated runtime output
- generated runtime reports such as `.agents/runtime/reports/*`, `.agents/runtime/recovery-reports/*`, `.agents/runtime/agent-traces/*`
- prebuilt `VALIDATION_REPORT.*`
- prebuilt `ACTIVE_CONTEXT.*`
- repo-local `.harness/operating_state.sqlite`
- pre-seeded `reference/artifacts/DECISION_LOG.md`, `HANDOFF_ARCHIVE.md`, `REVIEW_REPORT.md`, `WALKTHROUGH.md`
- pre-seeded `reference/artifacts/daily/*`
- empty `reference/legacy`, `reference/mockups`, `reference/reports` placeholder
- release 중간산출물

## 첫 사용 순서

1. 가능하면 maintainer repo installer나 release bootstrapper가 호출하는 `installer/install-harness.js` contract로 새 프로젝트를 생성한다.
2. 수동 설치라면 starter payload의 **내용물 전체**를 새 프로젝트 레포 루트에 복사한다.
3. Node.js 24 이상이 설치되어 있는지 확인한다.
4. 프로젝트 루트에서 `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init`를 실행한다.
5. `START_HERE.md`를 따라 kickoff baseline을 만든다.

처음 사용하는 사람의 목표는 위 순서만 읽고 `30분 이내`에 `harness:init`와 첫 상태 점검까지 도달하는 것이다.

copied starter 직후 generated `ACTIVE_CONTEXT.*`와 `VALIDATION_REPORT.*`가 없는 상태는 정상이다.
`CURRENT_STATE.md`와 `TASK_LIST.md`는 init 전까지 starter placeholder일 수 있다.
`DECISION_LOG.md`, `HANDOFF_ARCHIVE.md`, `REVIEW_REPORT.md`, `WALKTHROUGH.md`, `reference/artifacts/daily/*`도 실제 task가 필요해질 때 프로젝트 안에 생성하는 것이 정상이다.

초기화가 끝나면 starter placeholder가 프로젝트 전용 내용으로 바뀌고 `.harness/operating_state.sqlite`, generated docs, `ACTIVE_CONTEXT.*`가 새 프로젝트 기준으로 생성된다.

제품 코드는 `src/`, `app/`, `backend/`, `frontend/`, `server/` 등 프로젝트가 원하는 경로를 자유롭게 선택할 수 있다. 하네스 구현은 `.harness/runtime/`과 `.harness/test/`에 격리되어 있다.

## 유지보수자에게

reusable behavior를 바꿀 때는 이 starter 안의 runtime, test, rules, manuals가 서로 같은 계약을 말하는지 함께 확인한다. 설치된 프로젝트 안에 없는 root 전용 유지보수 문서를 기준으로 삼지 않는다.
