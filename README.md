# harness-implementation-v1

이 저장소는 표준 하네스를 개발하고 배포하기 위한 maintainer repo다.

## 현재 기준
- PMW는 active baseline에서 제거됐다.
- 새 재진입 표면은 CLI와 active context다.
- 사람용 SSOT는 한국어 Markdown 문서다.
- AI용 SSOT는 SQLite, JSON, validation output처럼 구조화된 상태다.

## 루트 구조
- `.agents/`: maintainer repo의 governance Markdown truth
- `.harness/`: 하네스 runtime, validator, tests
- `standard-template/`: 새 프로젝트로 복사되는 starter payload
- `installer/`: starter 설치기
- `packaging/`: release package와 Windows exe 빌드 스크립트
- `reference/manuals/`: 배포용 manual source

## 주요 명령
```powershell
npm run harness:status
npm run harness:next
npm run harness:context
npm run harness:doctor
npm run harness:validate
npm run harness:validation-report
npm test
```

## Active Context
- `.agents/runtime/ACTIVE_CONTEXT.json`: AI용 compact state
- `.agents/runtime/ACTIVE_CONTEXT.md`: 사람용 한국어 re-entry 요약
- installable starter payload에는 generated `ACTIVE_CONTEXT.*`를 싣지 않는다.
- installable starter payload에는 prebuilt `VALIDATION_REPORT.*`, repo-local DB, generated runtime reports도 싣지 않는다.
- installable starter payload에는 `DECISION_LOG.md`, `HANDOFF_ARCHIVE.md`, `REVIEW_REPORT.md`, `WALKTHROUGH.md`, `reference/artifacts/daily/*` 같은 review/history 템플릿도 기본 포함하지 않는다.
- 새 프로젝트에서는 `npm run harness:init` 또는 `npm run harness:context` 이후 현재 프로젝트 기준으로 다시 생성된다.

## Authority Manual
- 운영 authority manual: `reference/manuals/HARNESS_MANUAL.md`
- 루트 `README.md`는 maintainer repo entry surface이고, starter first-read surface는 `standard-template/START_HERE.md`다.
- 설치된 프로젝트 사용자는 `README.md` -> `START_HERE.md` -> `reference/manuals/HARNESS_MANUAL.md` 순서로 읽는 것을 기준으로 한다.

## 설치
기본 bootstrap flow:

```powershell
node installer/install-harness.js --project-name "My Project" --target-dir "C:\work\my-project" --profiles PRF-07,PRF-09
```

기본 동작은 다음과 같다.
1. target이 `비어 있는 신규 프로젝트 폴더`인지 `기존 로컬 레포 root`인지 판정한다.
2. 기본 authority source로 GitHub release/source authority에서 `standard-template/` 내용을 가져온다.
3. target에 필요한 harness 파일을 적용한다.
4. starter init을 실행해 Harness usable state까지 초기화한다.

maintainer/local fallback:
- source checkout에서 payload를 직접 쓰려면 `--authority-source local`을 명시한다.

수동 설치:
1. `standard-template/` 안의 내용물을 새 프로젝트 루트에 복사한다.
2. `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init`를 실행한다.
3. copied starter 직후 `ACTIVE_CONTEXT.*`가 없는 상태는 정상이다.
4. copied starter 직후 `CURRENT_STATE.md`와 `TASK_LIST.md`는 starter placeholder일 수 있으며, `VALIDATION_REPORT.*`가 없는 상태도 정상이다.
5. `npm run harness:context`와 `npm run harness:validate`로 상태를 확인한다.
6. reviewer closeout, handoff archive, daily note가 실제로 필요해질 때만 관련 문서를 프로젝트 안에 만든다.

## 수정 규칙
- 새 프로젝트에 복사되어야 하는 변경은 root와 `standard-template/`를 같은 작업 안에서 맞춘다.
- installer/release 변경은 `installer/`와 `packaging/`를 함께 확인한다.
- generated docs와 active context는 직접 고치지 말고 하네스 명령으로 갱신한다.
- `standard-template/` source는 fresh pre-init starter 상태를 유지한다. generated runtime output, persisted validation evidence, empty archival placeholder, 미사용 review/history/daily 템플릿은 source에 남기지 않는다.
- historical `reference/packets/*PMW*`는 과거 evidence로 보존할 수 있지만 active baseline으로 취급하지 않는다.

Node.js 24+는 하네스 runtime/build 요구사항이다. 제품 앱의 런타임 요구사항은 각 프로젝트 packet/profile에서 별도로 정한다.
