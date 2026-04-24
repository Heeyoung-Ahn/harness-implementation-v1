# Standard Harness Starter

이 폴더는 새 프로젝트를 시작할 때 프로젝트 레포 루트에 그대로 복사해 넣는 `표준 하네스 스타터`다.

처음 쓰는 사람은 `START_HERE.md`부터 본다.

## 이 스타터에 들어 있는 것

- 핵심 운영 규칙과 workflow
- live truth용 `.agents/artifacts/*`
- reusable harness runtime code와 validation test
- planning / packet / artifact 표준 양식
- PMW와 generated docs용 초기 placeholder

## 첫 사용 순서

1. `standard-template/` 폴더 자체가 아니라, **폴더 안의 내용물 전체**를 새 프로젝트 레포 루트에 복사한다.
2. Node.js 24 이상이 설치되어 있는지 확인한다.
3. 프로젝트 루트에서 `INIT_STANDARD_HARNESS.cmd`를 실행하거나 `npm run harness:init`를 실행한다.
4. `START_HERE.md`를 따라 kickoff baseline을 만든다.

초기화가 끝나면 starter placeholder가 프로젝트 전용 내용으로 바뀌고, `.harness/operating_state.sqlite`와 generated docs가 새 프로젝트 기준으로 생성된다.
