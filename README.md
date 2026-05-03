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

## 설치
소스에서 바로 설치:

```powershell
node installer/install-harness.js --project-name "My Project" --target-dir "C:\work\my-project" --profiles PRF-07,PRF-09
```

수동 설치:
1. `standard-template/` 안의 내용물을 새 프로젝트 루트에 복사한다.
2. `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init`를 실행한다.
3. `npm run harness:context`와 `npm run harness:validate`로 상태를 확인한다.

## 수정 규칙
- 새 프로젝트에 복사되어야 하는 변경은 root와 `standard-template/`를 같은 작업 안에서 맞춘다.
- installer/release 변경은 `installer/`와 `packaging/`를 함께 확인한다.
- generated docs와 active context는 직접 고치지 말고 하네스 명령으로 갱신한다.
- historical `reference/packets/*PMW*`는 과거 evidence로 보존할 수 있지만 active baseline으로 취급하지 않는다.

Node.js 24+는 하네스 runtime/build 요구사항이다. 제품 앱의 런타임 요구사항은 각 프로젝트 packet/profile에서 별도로 정한다.
