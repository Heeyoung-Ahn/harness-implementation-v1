# Project Workflow Manual

이 문서는 사람 운영자를 위한 작업 안내서다. 기본 agent load order에는 포함되지 않는다.

처음 쓰는 사람은 `START_HERE.md`부터 보고, 자세한 운영 규칙은 `reference/artifacts/STANDARD_HARNESS_USER_MANUAL.md`를 본다.

## Core와 Reference 구분

### Core

- `AGENTS.md`
- `.agents/rules/workspace.md`
- `.agents/artifacts/*`
- `.agents/workflows/*`
- `src/`, `test/`, `package.json`

### Reference

- `reference/artifacts/*`
- `reference/planning/*`
- `reference/packets/*`
- `reference/profiles/*`
- `reference/mockups/*`
- `reference/reports/*`

핵심 원칙은 단순하다.

- `.agents/artifacts/*`는 현재 프로젝트의 live truth다.
- `reference/*`는 필요할 때 읽는 표준 양식 또는 보조 자료다.
- kickoff 시점에는 `reference/*`를 전부 읽지 않는다.

## 새 프로젝트 시작 순서

1. `standard-template/` 폴더 안의 내용물을 새 프로젝트 레포 루트에 복사한다.
2. `AGENTS.md`와 `.agents/rules/workspace.md`는 그대로 둔다.
3. Node.js 24 이상이 설치되어 있는지 확인한다.
4. `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init`를 실행한다.
5. `START_HERE.md` 순서대로 kickoff baseline을 만든다.
6. `PLN-00`, `REQUIREMENTS`, `PLN-01`을 먼저 닫는다.
7. requirements 승인 뒤에만 architecture / implementation / UI baseline을 맞춘다.
8. 실제 기능 작업은 `PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`로 packet을 연 뒤 시작한다.

## 기획팀 빠른 시작 경로

기획팀이나 PM은 kickoff 때 보통 아래 문서만 보면 된다.

- `START_HERE.md`
- `.agents/artifacts/CURRENT_STATE.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `reference/planning/PLN-00_DEEP_INTERVIEW.md`
- `reference/planning/PLN-01_REQUIREMENTS_FREEZE.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`

처음에는 아래 경로를 열지 않아도 된다.

- `src/`
- `test/`
- `.agents/runtime/*`
- `reference/mockups/*`
- `reference/reports/*`
- `reference/skills/*`
