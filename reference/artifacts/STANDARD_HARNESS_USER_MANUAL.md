# Standard Harness User Manual

이 문서는 사람 운영자를 위한 표준 하네스 사용 매뉴얼이다. 기본 agent load order에는 포함되지 않으며, 표준 하네스를 새 프로젝트에 적용하거나 운영 규칙을 빠르게 확인할 때 사용한다.

## 1. 이 저장소와 템플릿의 관계

- 현재 저장소는 `표준 하네스 자체를 설계하고 개선하는 작업 공간`이다.
- `standard-template/`는 새 프로젝트에 복사해서 쓰는 `배포용 starter template`이다.
- 새 프로젝트에서는 보통 `standard-template/` 내용을 프로젝트 루트에 복사한 뒤 작업을 시작한다.

## 2. 무엇이 core이고 무엇이 reference인가

| 경로 | 역할 | 운영 규칙 |
| --- | --- | --- |
| `AGENTS.md` | 진입 규칙 | 유지한다. 임의 삭제/대체하지 않는다. |
| `.agents/rules/workspace.md` | workspace constitution | 유지한다. |
| `.agents/artifacts/*` | live operational truth | 실제 운영 상태와 계획은 여기서 관리한다. |
| `.agents/runtime/generated-state-docs/*` | generated summary | 수동 truth가 아니라 파생 산출물로 다룬다. |
| `.agents/workflows/*` | lane별 workflow | lane에 맞는 workflow만 읽고 따른다. |
| `reference/artifacts/*` | 사람용 보조 문서 | 필요할 때만 읽고, 기본 load order로 취급하지 않는다. |
| `reference/profiles/*` | optional profile packages | 하나 이상이 명시적으로 활성화된 경우에만 읽고 packet에 dependencies/evidence를 남긴다. |
| `reference/packets/*` | task packet 템플릿/기록 | 코드 착수 전 상세 합의를 닫는 데 사용한다. |
| `src/`, `test/`, `package.json` | reusable harness implementation baseline | 템플릿 적용 후에는 표준 하네스 자체를 확장하는 경우가 아니면 함부로 깨지 않게 유지한다. |

## 3. 새 프로젝트 시작 순서

1. `standard-template/` 내용을 새 프로젝트 루트에 복사한다.
2. `AGENTS.md`와 `.agents/rules/workspace.md`는 그대로 둔다.
3. `INIT_STANDARD_HARNESS.cmd` 또는 `npm run harness:init`를 실행해서 starter placeholder, repo-local DB, generated docs를 초기화한다.
4. 초기화 스크립트가 채우지 않은 프로젝트별 상세 baseline을 보완한다.
5. `reference/*`는 프로젝트에 필요한 범위만 읽는다. 처음부터 전부 읽지 않는다.
6. optional profile이 필요한 프로젝트인지 먼저 판단하고, 필요할 때만 명시적으로 활성화한다.

## 4. 세션 시작 시 읽는 순서

1. `AGENTS.md`
2. `.agents/rules/workspace.md`
3. `.agents/artifacts/CURRENT_STATE.md`
4. `.agents/artifacts/TASK_LIST.md`
5. 현재 lane에 맞는 workflow
6. 현재 작업에 필요한 artifact와 packet

## 5. 표준 레이어 모델

| 레이어 | 넣어야 하는 것 | 넣으면 안 되는 것 |
| --- | --- | --- |
| `Core` | 모든 복잡한 프로젝트에 공통인 계약, gate, validator, approval boundary | 특정 프로젝트 DB schema, 특정 제품 UI, 특정 운영환경 절차 |
| `Optional Profile` | 반복되는 프로젝트 유형의 reusable rule set. 한 work item에 둘 이상이 동시에 활성화될 수 있다 | 한 프로젝트에만 맞는 세부 엔티티/화면/배포 절차 |
| `Project Packet` | 실제 프로젝트의 화면, 상태 전이, 연동, acceptance, cutover detail | 다른 프로젝트에도 공통 적용하려는 표준 규칙 |

## 6. 기본 작업 흐름

1. requirements에서 구현 전 모호성을 먼저 닫는다.
2. requirements 확정 뒤 architecture / implementation / UI 기준선을 맞춘다.
3. 실제 구현 작업마다 `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`로 task packet을 다시 닫는다.
4. human approval boundary가 닫힌 뒤에만 코드를 구현한다.
5. 구현 후 validator, packet exit quality gate, security/review gate를 통과시킨다.

## 7. 반드시 사람 확인이 필요한 지점

- requirements final confirmation
- user-facing 기능의 상세 기능 기획과 UI/UX 합의
- DB 설계 confirmation
- cutover / rollback / security risk acceptance
- 신규 기획 문서의 부분 반영 또는 defer 결정

## 8. DB 연동 작업 규칙

기존 프로그램과 연동되는 프로그램을 개발할 때는 `PLN-04` 기준을 따른다.

1. 기존 프로그램 DB schema 또는 동등한 authoritative schema artifact를 사용자에게 요청한다.
2. `reference/artifacts/DOMAIN_CONTEXT.md`를 작성하거나 동등한 approved domain foundation reference를 지정한다.
3. 테이블명, 컬럼명, 데이터 운영 방식, ownership, migration/rollback compatibility를 분석한다.
4. 분석 결과를 task packet에 남긴다.
5. DB 설계는 항상 사용자 confirmation을 받아야 한다.
6. 위 항목이 비어 있거나 schema impact가 `unknown`이면 data-impact 작업을 `Ready For Code`로 올리지 않는다.

핵심 원칙은 `새 프로그램의 DB 설계가 기존 운영 프로세스를 깨지 않도록 사전에 호환성 분석과 사용자 확인을 거친다`는 것이다.

## 9. 신규 기획 문서 처리 규칙

새 사용자 기획 문서를 받으면 `PLN-05` 기준을 따른다.

1. 새 문서를 최우선 authoritative source로 등록한다.
2. `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md`를 작성하거나 동등한 approved source intake reference를 지정한다.
3. 기존 requirements, architecture, implementation plan, active packet과 충돌하는 지점을 찾는다.
4. 현재 구현에 어떤 영향이 생기는지 분석한다.
5. 필요한 재작업, 폐기, defer 항목을 사용자에게 보고한다.
6. 기본 우선순위는 `기존 안정성 유지`가 아니라 `신규 기획의 완전 반영`이다.
7. 부분 반영이나 defer, rejection은 사용자가 명시적으로 승인한 경우에만 허용한다.
8. 하나의 source change가 여러 open packet에 동시에 영향을 주면 `reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md`를 함께 열어 impacted packet set과 packet별 rebaseline status를 project-level로 닫는다.

핵심 원칙은 `새 기획이 들어오면 intake와 충돌 분석을 먼저 만들고, 그 결과를 기준으로 전체 계획과 구현을 다시 정렬한다`는 것이다.

## 10. user-facing archetype 규칙

user-facing 기능이나 화면을 다룰 때는 `DSG-02` 기준을 따른다.

1. `reference/artifacts/PRODUCT_UX_ARCHETYPE.md`를 작성하거나 동등한 approved UX archetype reference를 지정한다.
2. selected archetype을 먼저 선언한다.
3. 그 archetype이 왜 맞는지와 기본 archetype에서 벗어나는지 여부를 정리한다.
4. deviation이 있으면 human approval과 이유를 남긴다.
5. selected archetype이 `unknown`이거나 deviation status가 `pending`이면 `Ready For Code`로 올리지 않는다.

핵심 원칙은 `화면을 예쁘게 만드는 것보다, 어떤 제품 유형으로 설계하는지 먼저 고정하고 그 기준에서 벗어나는 경우를 명시적으로 승인받는다`는 것이다.

## 11. admin grid application profile 규칙

grid-heavy administrative application을 다룰 때는 `PRF-01` 기준을 따른다.

1. primary user가 내부 운영자/관리자이고, dense record list를 search/filter/sort하면서 row action, detail view, bulk operation을 반복 수행하는 제품인지 먼저 확인한다.
2. `reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md`를 읽고, requirements의 active profile selection과 task packet dependency에 `PRF-01`을 명시한다.
3. task packet에는 active profile reference, primary admin entity / surface, grid interaction model, search / filter / sort / pagination behavior, row action / bulk action rule, edit / save pattern, profile deviation / exception을 남긴다.
4. project-specific column set, permission matrix, export/report shape, one-off workflow는 profile 기본값으로 올리지 않고 project packet에서 닫는다.
5. profile을 선택했는데 reference나 required evidence가 비어 있으면 planning/design hold를 유지한다.

핵심 원칙은 `행정형 그리드 앱에서 반복되는 운영 패턴만 profile로 재사용하고, 실제 화면 열 구성과 업무 절차는 프로젝트 packet에 남긴다`는 것이다.

## 12. authoritative spreadsheet source profile 규칙

spreadsheet가 planning 또는 operational source-of-truth 역할을 하는 작업을 다룰 때는 `PRF-02` 기준을 따른다.

1. spreadsheet가 단순 참고자료가 아니라, 요구사항·필드정의·작업목록·운영 데이터 맵핑의 authoritative input인지 먼저 확인한다.
2. `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md`를 읽고, requirements의 active profile selection과 task packet dependency에 `PRF-02`를 명시한다.
3. task packet에는 active profile reference, source spreadsheet artifact, workbook / sheet / tab / range trace, header / column mapping, row key / record identity rule, source snapshot / version, transformation / normalization assumptions, reconciliation / overwrite rule, profile deviation / exception을 남긴다.
4. workbook 이름, 실제 tab 구조, formula detail, project-specific column set, import script, business-specific translation rule은 profile 기본값으로 올리지 않고 project packet에서 닫는다.
5. spreadsheet trace나 mapping evidence가 비어 있으면 planning hold를 유지한다.

핵심 원칙은 `스프레드시트를 권위 있는 입력으로 쓸 때는 어느 workbook의 어느 sheet/range가 어떤 필드로 연결되는지 추적 가능해야 하고, 그 추적 규칙만 profile로 재사용한다`는 것이다.

## 13. airgapped delivery profile 규칙

transfer-bound 또는 airgapped delivery 작업을 다룰 때는 `PRF-03` 기준을 따른다.

1. transfer boundary가 `airgapped`이거나 manual-transfer / removable-media / offline bundle handoff가 반복되는 작업인지 먼저 확인한다.
2. `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md`를 읽고, requirements의 active profile selection과 task packet dependency에 `PRF-03`을 명시한다.
3. task packet에는 active profile reference, transfer package / bundle artifact, transfer medium / handoff channel, checksum / integrity evidence, offline dependency bundle status, ingress verification / import step, rollback package / recovery bundle, manual custody / operator handoff, profile deviation / exception을 남긴다.
4. 실제 host/path, 반입 매체 절차, site operator step, custom import script, one-off rollback runbook은 profile 기본값으로 올리지 않고 project packet에서 닫는다.
5. bundle, checksum, offline dependency, handoff evidence가 비어 있으면 planning hold를 유지한다.

핵심 원칙은 `폐쇄망 전달에서 반복되는 묶음 반입과 무결성/복구 discipline만 profile로 재사용하고, 실제 현장 절차는 프로젝트 packet에 남긴다`는 것이다.

## 14. environment topology 규칙

deploy/test/cutover 성격의 작업을 다룰 때는 `OPS-02` 기준을 따른다.

1. `reference/artifacts/DEPLOYMENT_PLAN.md`를 작성하거나 동등한 approved environment topology reference를 지정한다.
2. source environment, target environment, execution target을 먼저 선언한다.
3. transfer boundary와 rollback boundary를 정리한다.
4. execution owner와 verification gate를 남긴다.
5. execution target이 `unknown`이거나 rollback boundary가 `unknown`이면 `Ready For Code`로 올리지 않는다.

핵심 원칙은 `배포 절차를 나중에 맞추는 게 아니라, 어디서 어디로 무엇이 움직이고 누가 되돌릴 수 있는지를 먼저 고정한다`는 것이다.

## 15. packet exit quality gate 규칙

구현이 끝난 packet을 닫을 때는 `QLT-01` 기준을 따른다.

1. `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`를 작성하거나 동등한 approved packet closeout reference를 지정한다.
2. packet과 코드, canonical docs, generated docs 사이 source parity를 확인한다.
3. refactor 완료 여부와 남는 residual debt / defer 항목을 기록한다.
4. user-facing이면 UX conformance를, deploy/test/cutover 또는 data-impact면 topology / schema confusion 여부를 기록한다.
5. validation, security review, cleanup evidence를 남긴다.
6. source parity status 또는 cleanup status가 `unknown`이거나 unresolved confusion이 남아 있으면 packet을 닫지 않는다.

핵심 원칙은 `구현이 끝났다는 주장보다, packet과 실제 결과물이 맞는지, 남은 부채가 무엇인지, 어떤 follow-up이 필요한지 먼저 닫는다`는 것이다.

## 16. improvement promotion loop 규칙

반복되는 process / quality friction을 다룰 때는 `OPS-01` 기준을 따른다.

1. 반복 friction은 `.agents/artifacts/PREVENTIVE_MEMORY.md`에 먼저 기록한다.
2. candidate마다 `core / optional profile / project packet / note-only` 중 어디로 보낼지 proposed target layer를 적는다.
3. promotion status와 linked follow-up item 또는 target artifact를 적는다.
4. `pending-review`나 `unknown` 상태의 candidate는 메모로만 남고 baseline 문서나 starter를 직접 바꾸지 않는다.
5. human review로 승인된 candidate만 core/profile/project follow-up item이나 baseline update로 연결한다.

핵심 원칙은 `불편했던 점을 바로 규칙으로 박아 넣는 게 아니라, 반복 패턴인지 확인하고 어느 계층에 넣을지 분류한 뒤 승인된 승격만 수행한다`는 것이다.

## 17. task packet에 꼭 남겨야 하는 항목

기본 항목:

- goal
- in-scope / out-of-scope
- detailed behavior
- screen / state changes
- data / source impact
- acceptance
- human approval boundary

상황별 추가 항목:

- active profile dependencies
- active profile references
- profile composition rationale
- profile-specific evidence / deviation
- primary admin entity / surface
- grid interaction model
- search / filter / sort / pagination behavior
- row action / bulk action rule
- edit / save / confirm / audit pattern
- source spreadsheet artifact
- workbook / sheet / tab / range trace
- header / column mapping
- row key / record identity rule
- source snapshot / version
- transformation / normalization assumptions
- reconciliation / overwrite rule
- transfer package / bundle artifact
- transfer medium / handoff channel
- checksum / integrity evidence
- offline dependency bundle status
- ingress verification / import step
- rollback package / recovery bundle
- manual custody / operator handoff
- authoritative source refs
- authoritative source intake reference
- impacted packet set scope
- authoritative source wave ledger reference
- source wave packet disposition
- UX archetype reference
- selected archetype / deviation status
- environment topology reference
- source / target environment
- execution target / transfer boundary / rollback boundary
- packet exit quality gate reference
- exit recommendation / residual debt disposition
- deferred follow-up item
- improvement candidate reference
- proposed target layer / promotion status
- linked follow-up item
- planning conflict / current implementation impact
- existing system schema refs
- DB naming / operation compatibility analysis
- execution target / environment context
- schema impact / migration / rollback impact

운영 메모:

- concrete active packet을 validator enforcement 대상으로 둘 때는 `artifact_index`에 category `task_packet`으로 등록한다.
- validator는 등록된 `task_packet`의 declared status와 required evidence를 함께 검사하므로, packet header와 evidence field를 비워 둔 채 우회하지 않는다.
- 현재 표준 marker를 가진 concrete packet이 `reference/packets/` 아래에 존재하면 validator가 그 packet을 자동으로 candidate로 본다. 이때 `task_packet` registration이 없거나 category가 다르면 validator는 즉시 fail한다.

## 18. generated docs와 PMW 해석 규칙

- `.agents/artifacts/*`가 live truth다.
- generated docs와 PMW는 truth를 읽기 좋게 투영한 결과다.
- generated docs나 PMW가 live truth와 다르면 drift로 간주하고, 조용히 덮어쓰지 않는다.
- recovery는 보통 `re-generate -> re-validate -> human confirm` 순서로 닫는다.
- reusable contract marker만 맞춘다고 끝나지 않는다. validator enforcement 대상 concrete packet은 `task_packet` 등록이 있어야 실제 packet evidence까지 검사된다.
- concrete packet을 만든 뒤 registration을 빼먹어도 이제 validator clean으로 지나가지 않는다. canonical packet directory에 current-contract packet이 있으면 registration missing 자체가 finding이다.
- multi-packet authoritative source wave가 있으면 cited source wave ledger에 해당 packet row와 disposition이 실제로 존재해야 validator가 clean하다.

## 19. 자주 하는 실수

- `reference/*`를 처음부터 전부 읽는 것
- requirements 확정 전 downstream baseline을 새 기준선처럼 다루는 것
- task packet 없이 바로 구현하는 것
- user-facing 상세 기능이나 UI를 인간 협의 없이 코드로 확정하는 것
- active optional profile을 선택했는데 profile reference와 required evidence를 packet에 남기지 않는 것
- spreadsheet를 authoritative source로 쓰면서 workbook / sheet / range / header mapping을 packet에 남기지 않는 것
- airgapped delivery인데 transfer bundle / checksum / rollback package / handoff evidence를 packet에 남기지 않는 것
- archetype 선언 없이 화면 패턴을 바로 정하는 것
- execution target이나 rollback 경계를 정하지 않고 배포성 작업을 진행하는 것
- source parity나 cleanup evidence를 닫지 않은 채 packet을 완료 처리하는 것
- `pending-review` improvement candidate를 승인된 표준 규칙처럼 바로 baseline에 반영하는 것
- 기존 시스템 연동인데 DB schema 확인 없이 설계를 진행하는 것
- 새 기획 문서를 받았는데 기존 구현 안정성을 이유로 영향 분석을 미루는 것
- 여러 packet을 동시에 흔드는 새 source wave인데 packet 하나만 reopen하고 나머지를 stale 상태로 남기는 것
- generated docs를 live truth처럼 직접 수정하는 것

## 20. 빠른 체크리스트

- 지금 읽고 있는 문서가 live truth인지 reference인지 구분했는가
- 현재 작업의 lane과 workflow를 확인했는가
- task packet이 최신 상태인가
- validator enforcement 대상 concrete packet이면 `artifact_index`에 `task_packet`으로 등록됐는가
- `reference/packets/` 아래 current-contract concrete packet이 있으면 registration missing finding이 없는가
- 사용자 승인이 필요한 지점이 닫혔는가
- multi-packet source wave가 있으면 source wave ledger와 impacted packet set이 닫혔는가
- one-or-more active optional profiles가 있으면 profile references와 required evidence가 packet에 남았는가
- spreadsheet source profile이 active면 workbook / sheet / range / header mapping이 남았는가
- airgapped delivery profile이 active면 transfer bundle / checksum / rollback package / handoff evidence가 남았는가
- DB / source / environment 영향이 있으면 대응 계약을 확인했는가
- user-facing 작업이면 archetype과 deviation 승인이 닫혔는가
- deploy/test/cutover 작업이면 topology와 rollback 경계가 닫혔는가
- packet closeout이면 source parity, residual debt, deferred follow-up이 정리됐는가
- 반복 friction이면 preventive memory에 target layer와 promotion status가 기록됐는가
- 구현 후 validator와 review gate까지 닫을 계획이 있는가

## 21. 함께 보면 좋은 문서

- `PROJECT_WORKFLOW_MANUAL.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- `.agents/artifacts/PREVENTIVE_MEMORY.md`
- `reference/artifacts/DEPLOYMENT_PLAN.md`
- `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- `reference/artifacts/STANDARD_HARNESS_PROJECT_SIMULATION_PLAYBOOK.md`
- `reference/artifacts/STANDARD_HARNESS_WBMS_SIMULATION_REPORT.md`
- `reference/artifacts/PRODUCT_UX_ARCHETYPE.md`
- `reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md`
- `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md`
- `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
