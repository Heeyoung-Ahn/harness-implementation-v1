# Standard Harness User Manual

이 문서는 설치된 프로젝트 안에서 사용하는 V1.2 표준 하네스 공식 사용자 매뉴얼이다. PMW는 별도 앱이며, 이 프로젝트는 PMW가 읽을 manifest/read-model만 export한다.

## 핵심 철학

표준 하네스는 프로젝트의 현재 상태, 승인 경계, 다음 행동, 검증 결과를 잃지 않기 위한 운영 구조다.

- `.agents/artifacts/*`는 사람이 승인하는 governance Markdown truth다.
- `.harness/operating_state.sqlite`는 빠르게 갱신되는 hot operational DB다.
- `.agents/runtime/generated-state-docs/*`는 파생 산출물이며 직접 편집하지 않는다.
- `.agents/runtime/project-manifest.json`과 `.agents/runtime/pmw-read-model.json`은 PMW가 읽는 read-only export다.
- PMW는 이 프로젝트의 truth를 수정하지 않는다.

## 첫 실행

installer로 만든 프로젝트라면 초기화와 PMW 등록은 이미 끝난다. 수동 복사한 경우 프로젝트 루트에서 실행한다.

```powershell
INIT_STANDARD_HARNESS.cmd
```

또는:

```powershell
npm run harness:init
```

exe installer로 만든 프로젝트는 bundled runtime wrapper인 `HARNESS.cmd`도 함께 가진다. 대상 PC에 Node.js/npm이 없어도 `HARNESS.cmd status`, `HARNESS.cmd validate`, `HARNESS.cmd test`를 사용할 수 있다.

## 설치 후 확인

```powershell
HARNESS.cmd test
HARNESS.cmd status
HARNESS.cmd validate
HARNESS.cmd pmw-export
```

## 주요 명령

- `npm test`: shipped harness tests.
- `npm run harness:status`: 현재 stage, gate, focus, next action 확인.
- `npm run harness:doctor`: 운영 상태 진단.
- `npm run harness:next`: 다음 행동 확인.
- `npm run harness:explain`: blocker 설명.
- `npm run harness:validate`: governance/runtime 계약 검증.
- `npm run harness:validation-report`: validation evidence 저장.
- `npm run harness:pmw-export`: PMW manifest/read-model 갱신.
- `npm run harness:project-manifest`: PMW export alias.
- `npm run harness:migration-preview`: migration/legacy path 변경 미리보기.
- `npm run harness:cutover-preflight`: cutover readiness 확인.

## Optional Profile

- `PRF-01`: admin grid application.
- `PRF-02`: authoritative spreadsheet source.
- `PRF-03`: airgapped delivery.
- `PRF-04`: legacy Excel/VBA-MariaDB replacement.
- `PRF-05`: Python/Django backoffice.
- `PRF-06`: workflow/approval application.
- `PRF-07`: lightweight web/app.
- `PRF-08`: Android native app.
- `PRF-09`: Node/frontend web app.

모르면 `none`으로 시작한다. profile을 켜면 active packet에서 해당 profile evidence를 채워야 한다.

## 표준 작업 흐름

1. `START_HERE.md`를 읽는다.
2. `PLN-00` deep interview를 닫는다.
3. `.agents/artifacts/REQUIREMENTS.md`를 확정한다.
4. requirements 승인 후 architecture / implementation / UI baseline을 맞춘다.
5. 실제 작업마다 `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`로 task packet을 만든다.
6. packet 승인 후 구현한다.
7. `npm test`, `harness:validate`, `harness:pmw-export`를 실행한다.
8. review/cutover gate를 닫는다.

## 상황별 기준

- 작은 웹앱/내부 도구: `PRF-07`, 필요 시 `PRF-09`.
- Node/frontend app: `PRF-09`, package ownership과 build/test/deploy 경계를 packet에 기록.
- Android native app: `PRF-08`, Gradle/AGP, signing, permissions, device test를 packet에 기록.
- Excel/VBA/MariaDB legacy 대체: `PRF-04`, `PRF-05`, `PRF-06` 조합을 검토하고 schema/migration/reconciliation을 먼저 닫는다.
- 새 기획 문서가 들어온 경우: requirements/architecture/implementation/active packet 영향 분석을 먼저 한다.

## 금지 사항

- generated docs를 직접 수정하지 않는다.
- PMW를 write authority로 취급하지 않는다.
- active packet 없이 구현하지 않는다.
- DB 설계, cutover, 보안 risk acceptance를 사람 확인 없이 닫지 않는다.
- 제품 고유 내용을 core 규칙으로 승격하지 않는다.

## PMW 갱신

PMW 화면이 오래되어 보이면 프로젝트 루트에서 실행한다.

```powershell
npm run harness:pmw-export
```

그 뒤 PMW를 새로고침한다.
