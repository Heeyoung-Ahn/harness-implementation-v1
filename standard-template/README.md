# Standard Harness Starter

이 폴더는 `참고용 샘플`이 아니라 실제 배포 payload다.

- source 설치기(`installer/install-harness.js`)와 GitHub-backed bootstrap flow는 이 폴더를 authority payload로 사용한다.
- Windows exe 빌더도 이 폴더를 payload에 넣는다.
- 수동 설치를 해도 이 폴더 안의 내용물이 새 프로젝트 레포 루트로 들어간다.

즉, `standard-template/` 안의 파일은 필요 없으면 지워도 되는 보조 자료가 아니다. 설치된 프로젝트가 실제로 받는 내용이다.

## 처음 보는 사람은 이것만 본다

- `START_HERE.md`
- `reference/manuals/HARNESS_MANUAL.md`

읽는 순서는 아래로 고정한다.

1. `START_HERE.md`
2. `reference/manuals/HARNESS_MANUAL.md`

`START_HERE.md`는 5분 안에 kickoff를 열기 위한 문서다.
`reference/manuals/HARNESS_MANUAL.md`는 실제 운영 기준과 전체 기능 설명을 담은 primary manual이다.

이 starter에는 maintainer-only 문서를 두지 않는다.

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

- maintainer workflow 문서
- root 유지보수 문서
- legacy manual
- release 중간산출물
- generated clutter

## 첫 사용 순서

1. 가능하면 상위 저장소 또는 npm bootstrapper entrypoint가 호출하는 `installer/install-harness.js` contract로 새 프로젝트를 생성한다.
2. 수동 설치라면 `standard-template/` 폴더 자체가 아니라 **폴더 안의 내용물 전체**를 새 프로젝트 레포 루트에 복사한다.
3. Node.js 24 이상이 설치되어 있는지 확인한다.
4. 프로젝트 루트에서 `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init`를 실행한다.
5. `START_HERE.md`를 따라 kickoff baseline을 만든다.

처음 사용하는 사람의 목표는 위 순서만 읽고 `30분 이내`에 `harness:init`와 첫 상태 점검까지 도달하는 것이다.

초기화가 끝나면 starter placeholder가 프로젝트 전용 내용으로 바뀌고 `.harness/operating_state.sqlite`, generated docs, `ACTIVE_CONTEXT.*`가 새 프로젝트 기준으로 생성된다.

제품 코드는 `src/`, `app/`, `backend/`, `frontend/`, `server/` 등 프로젝트가 원하는 경로를 자유롭게 선택할 수 있다. 하네스 구현은 `.harness/runtime/`과 `.harness/test/`에 격리되어 있다.

## 유지보수자에게

reusable behavior를 바꿀 때는 이 starter 안의 runtime, test, rules, manuals가 서로 같은 계약을 말하는지 함께 확인한다. 설치된 프로젝트 안에 없는 root 전용 유지보수 문서를 기준으로 삼지 않는다.
