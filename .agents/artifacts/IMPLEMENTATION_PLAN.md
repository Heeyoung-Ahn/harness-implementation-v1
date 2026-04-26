# Implementation Plan

## Summary
표준 하네스의 first-ship baseline은 `deep interview -> requirements final approval -> architecture / implementation / UI sync -> logic-backed rough mockup -> per-work-item detailed planning/design approval -> implementation -> generated docs/read model/PMW/cutover -> refactor/security/review gate` 순서로 release-ready까지 닫혔다.

2026-04-22 승인된 follow-up 구현은 이 baseline을 깨지 않고, `core / optional profile / project packet` 3층 구조와 표준 계약을 추가해 복잡한 프로젝트 대응력을 강화하는 planning lane이다.

2026-04-26 `PLN-06` is closed as the standalone business-system harness V1.1 lane. It made `standard-template/` a standalone production-ready governance harness for large Excel/VBA-MariaDB business-system replacement projects, with no essential readiness item deferred.

## Follow-Up Phase Plan
1. approved release-ready baseline을 보존하면서 follow-up planning lane을 연다.
2. `PLN-03`으로 core / optional profile / project packet activation contract를 정의한다.
3. `PLN-04`로 domain foundation gate를 정의한다.
4. `PLN-05`로 authoritative source contract를 정의한다.
5. `DSG-02`로 product UX archetype contract를 정의한다.
6. `OPS-02`로 environment topology contract를 정의한다.
7. packet / workflow / architecture expectation을 위 계약에 맞게 sync한다.
8. `QLT-01`을 packet exit quality gate로 재정의한다.
9. `OPS-01`을 improvement promotion loop로 재정의한다.
10. `PRF-01`, `PRF-02`, `PRF-03`로 optional profile을 설계한다.
11. `TST-03`으로 profile-aware validator를 구현 또는 정의한다.
12. `REV-02`로 standard harness generalization review를 통과한다.

## Simulation Remediation Lane
1. approved generalized baseline을 last known good reusable snapshot으로 보존한 채 simulation-derived remediation lane을 연다.
2. `SIM-01`은 2026-04-23에 closed 되었고, single-profile 전제를 깨고 multi-profile packet composition contract와 validator의 declared profile-set enforcement를 정의했다.
3. `SIM-02`는 2026-04-23에 closed 되었고, concrete active packet enforcement가 누락된 `task_packet` registration에 의존하지 않도록 canonical discovery와 fail-fast rule을 정의했다.
4. `SIM-03`로 하나의 authoritative source wave가 여러 open packet에 미치는 영향을 project-level로 닫는 rebaseline control을 정의한다.
5. `REV-03`로 simulation-derived remediation이 실제 WBMS kickoff 전 필요한 reusable gap을 닫았는지 최종 검토한다.

## Standard-Template Hardening Lane
1. preserve the approved generalized baseline while opening `DEV-06` as a narrow real-world-readiness remediation lane for `standard-template/`.
2. enforce the shipped Node 24 requirement at the actual launcher entrypoint so copied starters fail early and clearly on unsupported runtimes.
3. restore a green shipped starter test suite by aligning the read-model test fixture with the current profile-aware validator contract.
4. turn `standard-template/reference/artifacts/REVIEW_REPORT.md` and `standard-template/reference/artifacts/WALKTHROUGH.md` into formal starter templates that the review/test workflows can really consume.
5. review placeholder-only shipped helper scripts under `standard-template/.agents/scripts/` and close an explicit delete-or-keep disposition before the lane closes.
6. rerun `npm test` in `standard-template/` and verify untouched starter validator behavior still returns only `starter_bootstrap_pending`.

## Task Skeleton

### Closed Baseline Tasks
- PLN-00 deep interview using `reference/planning/PLN-00_DEEP_INTERVIEW.md`
- PLN-01 user-friendly requirements freeze
- PLN-02 post-approval architecture / implementation / UI sync
- DSG-01 rough mockup and global behavior contract
- PKT-01 per-work-item planning and design approval contract using `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- DEV-01 DB schema and store foundation
- DEV-02 generated state docs and drift validator
- DEV-03 context restoration read model
- DEV-04 PMW read surface
- DEV-05 validator and cutover tooling
- SEC-01 security review and remediation
- TST-01 generated docs parity
- TST-02 PMW browser UX and 30-second comprehension check
- REV-01 architecture / review gate

### Active Follow-Up Tasks
- PLN-03 core / optional profile / project packet activation contract
- PLN-04 domain foundation gate
- PLN-05 authoritative source contract
- DSG-02 product UX archetype contract
- OPS-02 environment topology contract
- QLT-01 packet exit quality gate
- OPS-01 improvement promotion loop
- PRF-01 admin grid application profile
- PRF-02 authoritative spreadsheet source profile
- PRF-03 airgapped delivery profile
- TST-03 profile-aware validator
- REV-02 standard harness generalization review
- SIM-01 multi-profile packet composition contract
- SIM-02 task-packet registration enforcement
- SIM-03 shared-source rebaseline control
- REV-03 simulation remediation review

## DEV-06 Execution
### Goal
`standard-template/`를 실제 업무에서 바로 복사해 쓸 수 있도록 launcher preflight, shipped test health, formal review/test starter templates, placeholder-script disposition을 한 lane 안에서 닫는다.

### Input
- `reference/packets/PKT-01_DEV-06_STANDARD_TEMPLATE_HARDENING.md`
- `standard-template/INIT_STANDARD_HARNESS.cmd`
- `standard-template/package.json`
- `standard-template/test/context-restoration-read-model.test.js`
- `standard-template/reference/artifacts/REVIEW_REPORT.md`
- `standard-template/reference/artifacts/WALKTHROUGH.md`
- `standard-template/.agents/scripts/*`

### Output
- actual Node 24 preflight enforcement at the starter launcher
- green shipped starter tests
- formal starter templates for review/test lanes
- explicit keep-or-delete disposition for placeholder-only shipped helper scripts

### Exit Criteria
- copied starter fails early and clearly on unsupported Node versions.
- `npm test` in `standard-template/` is green.
- untouched starter validator still returns `starter_bootstrap_pending` instead of raw drift noise.
- review/test workflows point at usable starter templates rather than stubs.
- placeholder-only shipped helper scripts are either removed or carried with explicit rationale.

### Closeout
- Closed on 2026-04-24.
- `INIT_STANDARD_HARNESS.cmd` now parses the installed Node version before invoking JS initialization, and `.agents/scripts/init-project.js` now enforces the same Node 24 runtime floor for the `npm run harness:init` path.
- `test/context-restoration-read-model.test.js` in both root and starter now seeds the shared profile-aware validator fixtures so the shipped test suite matches the current validator contract.
- `standard-template/reference/artifacts/REVIEW_REPORT.md` and `standard-template/reference/artifacts/WALKTHROUGH.md` now ship as usable formal templates instead of one-line stubs.
- Placeholder-only helper scripts (`check_harness_docs.ps1`, `generate_state_docs.ps1`, `reset_version_artifacts.ps1`) were removed from both root and starter after confirming they had no active code/workflow callers.
- Verification closed with green root/starter `npm test`, untouched-starter validator output of only `starter_bootstrap_pending`, and clean launcher help execution in both root and starter on Node `v24.13.1`.

## PLN-06 Standalone Business Harness V1.1 Lane

### Goal
Complete all essential V1.1 readiness work in one lane so the deployable `standard-template/` can be used immediately for real web-app replacement projects targeting Excel/VBA-MariaDB business systems such as budget management, asset management, and corporate accounting management.

### Status
- Closed: implemented, verified, synchronized, and reviewed on 2026-04-26.
- Implementation hold: resolved by user approval and `reference/packets/PKT-01_PLN-06_STANDALONE_BUSINESS_HARNESS_V1_1_IMPLEMENTATION.md`.

### Input
- User directive on 2026-04-26 requiring no partial "finish later" delivery assumption.
- `reference/planning/PLN-06_STANDALONE_BUSINESS_HARNESS_V1_1.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/TASK_LIST.md`
- current `standard-template/`

### Required Output
- requirements-approved V1.1 implementation packet before code changes
- P0/P1/P2 implementation split matching `reference/planning/PLN-06_STANDALONE_BUSINESS_HARNESS_V1_1.md`
- harness/product repository layout separation
- repository layout ownership artifact
- standalone command UX: init/test/validate/doctor/status/next/explain/pmw/migration/cutover/validation-report
- truth hierarchy and conflict rule synchronization
- structured task truth table support
- legacy Excel/VBA-MariaDB replacement optional profile
- Python/Django backoffice optional profile
- workflow/approval application optional profile
- workflow state vocabulary
- command output contract
- profile activation contract
- packet readiness contract
- root/starter sync classification
- packet template updates for new profile/evidence requirements
- validator and tests for must-fail enforcement items, plus documented warn-only/document-only boundaries
- validation report artifacts
- root and `standard-template/` synchronization
- review closeout proving no essential readiness requirement is deferred

### Exit Criteria
- `PLN-06` requirements are approved before implementation begins.
- No essential V1.1 readiness item is left to an assumed future lane.
- Optional enhancements are explicitly separated from essential readiness and do not block target project kickoff.
- Command acceptance levels are met without expanding migration/PMW/team scope beyond the V1.1 requirement.
- Validator implementation follows the must-fail / warn-acceptable / document-only enforcement table.
- Root/starter sync status is classified and verified before review closeout.
- Root and `standard-template/` pass the full verification set.
- A copied starter can start the target downstream project class without harness/product source-layout conflict.
- The standard core remains free of project-specific budget, asset, or corporate accounting schema/policy.

### Closeout
- Closed on 2026-04-26.
- Harness runtime and tests moved to `.harness/runtime/` and `.harness/test/`, leaving root `src/` and `test/` available for product code in downstream projects.
- Added layout ownership, truth hierarchy synchronization, structured task truth, active profile declaration, workflow state vocabulary, and validation report persistence.
- Added `harness:doctor`, `harness:status`, `harness:next`, `harness:explain`, and `harness:validation-report`.
- Added PRF-04 legacy Excel/VBA-MariaDB replacement, PRF-05 Python/Django backoffice, and PRF-06 workflow/approval application profiles.
- Extended packet evidence and validator enforcement for V1.1 must-fail items and root/starter sync drift.
- Verification passed with root/starter tests, root validator, starter bootstrap-pending validator guidance, operator commands, validation report, migration preview, cutover preflight, and cutover report.

## SIM-01 Execution
### Goal
한 concrete work item이 둘 이상의 optional profile을 동시에 필요로 할 때 packet contract, required evidence surface, validator enforcement가 single-profile 전제 없이 동작하도록 재정의한다.

### Input
- `reference/artifacts/STANDARD_HARNESS_WBMS_SIMULATION_REPORT.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- `src/state/drift-validator.js`

### Output
- multi-profile activation rule
- `Active profile dependencies`, `Active profile references`, `Profile composition rationale`를 포함한 packet header/body field revision
- per-profile evidence rule and validator enforcement direction
- profile composition이 project packet과 충돌하지 않도록 하는 boundary rule

### Exit Criteria
- WBMS류 work item이 `PRF-01 + PRF-02` 조합을 억지 packet split 없이 표현할 수 있다.
- validator가 active profile 하나만 읽는 구조를 벗어나 declared profile set 전체를 읽는다.
- profile evidence 누락이 조합 packet에서도 hold rule로 남는다.

### Closeout
- Closed on 2026-04-23.
- packet/header/body contract를 `Active profile dependencies`, `Active profile references`, `Profile composition rationale` 중심으로 재정의했다.
- validator가 declared profile set 전체를 읽고 required evidence를 profile union으로 검사하도록 확장했다.
- concrete packet test coverage에 multi-profile evidence 누락과 reference drift case를 추가했고, same change set을 `standard-template/`에도 동기화했다.

## SIM-02 Execution
### Goal
concrete active packet enforcement가 manual `task_packet` registration 누락으로 우회되지 않도록 fail-fast 또는 canonical discovery rule을 정의한다.

### Exit Criteria
- packet을 만들고도 등록을 빼먹은 상태가 validator clean으로 지나가지 않는다.
- operator가 언제 packet registration이 완료됐다고 볼지 명확한 canonical rule이 있다.

### Canonical Rule
- `reference/packets/` 아래에서 current standard packet marker를 가진 concrete packet은 validator의 canonical discovery 대상이다.
- 그런 packet은 `artifact_index`에 category `task_packet`으로 등록돼야 하며, 미등록이거나 잘못된 category면 validator가 fail-fast finding을 올린다.
- validator는 registration finding을 올리는 동시에 그 packet의 declared status와 required evidence도 계속 검사해 hold rule bypass를 막는다.

### Closeout
- Closed on 2026-04-23.
- validator가 `reference/packets/` 아래 current-contract concrete packet candidate를 자동 발견하고, missing/wrong-category registration을 fail-fast로 올리도록 확장했다.
- registration finding이 있어도 packet evidence validation은 계속 수행하도록 유지해서 bypass를 막았다.
- legacy packet file은 current-contract marker가 없으면 discovery 대상에서 제외되도록 테스트와 함께 고정했고, same change set을 `standard-template/`에도 동기화했다.

## SIM-03 Execution
### Goal
하나의 workbook 또는 새 기획 source wave가 여러 open packet에 동시에 영향을 줄 때 impacted packet set과 reopen state를 project-level로 닫는 reusable control을 정의한다.

### Input
- `reference/artifacts/STANDARD_HARNESS_WBMS_SIMULATION_REPORT.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- `src/state/drift-validator.js`

### Output
- `reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md` reusable artifact
- packet-level `Impacted packet set scope`, `Authoritative source wave ledger reference`, `Source wave packet disposition`, `Shared-source wave status` contract
- authoritative source intake와 project-level source-wave control의 boundary rule
- validator enforcement for ledger membership and packet disposition parity

### Exit Criteria
- authoritative source wave가 packet A만 reopen되고 packet B/C가 stale 상태로 남는 parallel drift를 표준적으로 차단한다.
- intake artifact alone과 별도 project-level wave control의 경계가 명확하다.

### Canonical Rule
- authoritative source intake는 왜 이 source가 authoritative인지, 무엇과 충돌하는지, 구현에 어떤 영향을 주는지 설명하는 source-level artifact다.
- 한 source wave가 여러 open packet을 동시에 흔들면 별도의 `AUTHORITATIVE_SOURCE_WAVE_LEDGER`가 canonical project-level control이 된다.
- multi-packet source wave에 속한 각 packet은 impacted packet set scope, wave ledger reference, packet disposition을 남기고 cited ledger row와 일치해야 한다.
- `Impacted packet set scope = multi-packet`인데 wave ledger가 없거나 `Shared-source wave status != approved`이면 planning hold를 유지한다.

### Closeout
- Closed on 2026-04-23.
- reusable `reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md` artifact를 추가하고, authoritative source intake와 project-level source-wave control의 경계를 문서화했다.
- packet template에 `Shared-source wave status`, `Impacted packet set scope`, `Authoritative source wave ledger reference`, `Source wave packet disposition` evidence를 추가했다.
- validator를 확장해 cited source-wave ledger file existence, impacted-packet membership, packet disposition parity를 검사하고, same change set을 `standard-template/`에도 동기화했다.

## PLN-03 Execution
### Goal
표준 하네스의 공통 계약과 반복 유형 확장을 `core / optional profile / project packet` 3층 구조로 나누고, activation rule과 required reading rule을 명시한다.

### Input
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/TASK_LIST.md`
- `.agents/artifacts/PROJECT_PROGRESS.md`

### Output
- 3층 구조와 activation 기준
- core에 둘 것과 profile/project packet으로 내릴 것의 판정 규칙
- workflow read order와 packet 필수 필드 개정 방향
- follow-up tasks의 execution order

### Exit Criteria
- core/profile/project 경계가 문서로 닫힌다.
- active profile을 명시적으로 선택하는 규칙이 정의된다.
- core에 넣으면 안 되는 항목의 예시와 판정 규칙이 정리된다.
- downstream tasks가 어떤 산출물을 만들어야 하는지 연결된다.

### Activation Rules
- `Core`는 기본 활성이다.
- `Optional Profile`은 requirements와 architecture에 explicit하게 선택되고, active task packet이 dependency를 다시 적을 때만 활성화된다.
- `Project Packet`은 project-specific 실행 계층이며, 코드, migration, deploy/test/cutover, user-facing 확정은 active packet 없이 시작하지 않는다.
- activation precedence는 `Core -> Optional Profile -> Project Packet`이며, 계층이 애매하면 더 아래 계층으로 내린다.

### Required Reading Rule
1. `AGENTS.md`
2. `.agents/rules/workspace.md`
3. `.agents/artifacts/CURRENT_STATE.md`
4. `.agents/artifacts/TASK_LIST.md`
5. active lane workflow
6. lane에 필요한 baseline artifacts
7. explicitly activated optional profile artifacts
8. active project packet and authoritative source artifacts
9. additional reference material only when the active task cites it

### Layer Decision Rules
- `Core`: 특정 프로젝트 명사 없이 공통 적용되고 generic validator/review rule로 강제 가능한 contract
- `Optional Profile`: 반복 유형에 재사용되지만 모든 프로젝트 기본값으로 두면 편향이 생기는 rule set
- `Project Packet`: 실제 엔티티, 화면, 연동, 환경, acceptance, cutover detail

### Core Exclusion Examples
- project-specific table / column names
- project-specific screen copy and IA
- project-specific endpoint mapping and field naming
- project-specific environment host, transfer path, operator step
- project-specific acceptance and cutover checklist

### Downstream Output Map
- `PLN-04`: DB confirmation, existing schema intake, compatibility analysis, packet evidence field를 닫는다.
- `PLN-05`: new planning source intake, precedence, conflict / rework reporting contract를 닫는다.
- `DSG-02`: archetype declaration, deviation rule, profile/project boundary를 닫는다.
- `OPS-02`: execution target, transfer boundary, rollback boundary contract를 닫는다.
- `QLT-01`: packet exit evidence and defer logging rule을 닫는다.
- `OPS-01`: friction classification, target layer, human-reviewed promotion path를 core/profile/project follow-up로 분기한다.
- `PRF-01`, `PRF-02`, `PRF-03`: optional profile package와 activation signal을 정의한다.
- `TST-03`: active profile, layer classification, required packet evidence validator를 확장한다.
  validator scope는 reusable packet/profile contract marker와 `task_packet`으로 등록된 concrete active packet instance의 required evidence까지 포함한다.
- `REV-02`: project-specific assumption이 core에 스며들지 않았는지 최종 검토한다.

## PLN-04 Execution
### Goal
기존 프로그램 연동 여부를 포함한 data-impact 작업에서 DB 설계를 사용자 승인, 기존 schema intake, compatibility analysis 없이 진행하지 못하게 하는 domain foundation gate를 정의한다.

### Input
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `reference/artifacts/DOMAIN_CONTEXT.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- 사용자가 제공하는 기존 프로그램 DB schema 또는 동등한 authoritative schema artifact

### Output
- DB 설계가 항상 user confirmation 대상이라는 rule
- domain foundation artifact template과 required section set
- 기존 프로그램 연동 시 existing schema request와 planning hold rule
- table / column naming, data operation / ownership, migration / rollback compatibility 분석 기준
- packet에 남겨야 할 domain foundation reference, existing schema refs, schema impact, DB compatibility fields

### Exit Criteria
- DB 설계가 있는 data-impact packet은 user-confirmed naming / operation plan 없이는 `Ready For Code`가 되지 않는다.
- data-impact packet은 domain foundation reference path와 schema impact classification을 인용해야 한다.
- schema impact classification이 `unknown`이면 planning hold가 유지된다.
- 기존 프로그램 연동 packet은 existing schema artifact 요청과 compatibility analysis 없이는 close되지 않는다.
- core contract은 schema intake / analysis / approval rule만 제공하고, 특정 프로젝트 schema 자체를 core 기본값으로 승격하지 않는다.

## PLN-05 Execution
### Goal
새 사용자 기획 문서를 최우선 authoritative source로 취급하고, 기존 기획/현재 구현과의 충돌 및 영향 분석을 거쳐 신규 기획의 완전 반영을 우선하는 contract를 정의한다.

### Input
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md`
- active task-level packets
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- 새로 접수된 사용자 기획 문서

### Output
- 새 사용자 기획 문서의 immediate intake / trace / disposition rule
- authoritative source intake artifact template과 required section set
- 기존 기획, 승인된 packet, 현재 구현과의 conflict / impact analysis rule
- 신규 기획의 완전 반영을 기본 우선순위로 두는 precedence rule
- packet과 planning baseline에 남겨야 할 source intake reference, disposition, rework / defer / implementation impact reporting format

### Exit Criteria
- 새 사용자 기획 문서는 requirements / architecture / implementation / active packet에 즉시 영향 평가를 건다.
- 기존 기획과 현재 구현의 충돌, 필요한 재작업, 유지 불가 가정이 보고된다.
- active planning baseline과 packet은 authoritative source intake reference path와 disposition을 인용한다.
- source disposition이 `pending`이거나 current implementation impact가 `unknown`이면 planning hold가 유지된다.
- 기존 안정성 유지가 신규 기획 반영 보류의 기본 사유로 사용되지 않고, 부분 반영은 사용자 명시 승인일 때만 허용된다.

## DSG-02 Execution
### Goal
user-facing 작업이 제품 archetype 선언, approved deviation rule, packet evidence 없이 진행되지 못하게 하는 product UX archetype contract를 정의한다.

### Input
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `reference/artifacts/UI_DESIGN.md`
- `reference/artifacts/PRODUCT_UX_ARCHETYPE.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`

### Output
- UX archetype reference template과 required section set
- selected archetype declaration과 approved deviation rule
- archetype catalog, profile vs project boundary, planning hold 기준
- packet에 남겨야 할 UX archetype reference, selected archetype, deviation status fields

### Exit Criteria
- user-facing packet은 UX archetype reference path, selected archetype, deviation status를 인용한다.
- selected archetype이 `unknown`이거나 deviation status가 `pending`이면 planning hold가 유지된다.
- archetype contract는 core에서 catalog와 deviation rule만 제공하고, 특정 프로젝트 UI 스타일이나 copy를 core 기본값으로 승격하지 않는다.

## OPS-02 Execution
### Goal
deploy/test/cutover 작업이 environment topology reference, execution target, transfer boundary, rollback boundary 없이 진행되지 못하게 하는 environment topology contract를 정의한다.

### Input
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `reference/artifacts/DEPLOYMENT_PLAN.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`

### Output
- environment topology reference template과 required section set
- source/target environment, execution target, execution owner, transfer boundary, rollback boundary declaration rule
- topology contract와 optional profile / project packet boundary
- packet에 남겨야 할 environment topology reference, source/target environment, execution target, transfer boundary, rollback boundary fields

### Exit Criteria
- deploy/test/cutover packet은 environment topology reference path, source environment, target environment, execution target, transfer boundary, rollback boundary를 인용한다.
- execution target이 `unknown`이거나 rollback boundary가 `unknown`이면 planning hold가 유지된다.
- topology contract는 core에서 boundary와 approval rule만 제공하고, 특정 host/path/operator step을 core 기본값으로 승격하지 않는다.

## QLT-01 Execution
### Goal
구현이 끝난 packet이 source parity, residual debt disposition, UX/topology/schema conformance, validation/security/cleanup evidence 없이 close되지 못하게 하는 packet exit quality gate를 정의한다.

### Input
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- `reference/artifacts/REVIEW_REPORT.md`

### Output
- packet exit quality gate reference template과 required section set
- packet closeout declaration rule과 hold condition
- residual debt / defer logging 기준
- packet에 남겨야 할 packet exit quality gate reference, exit recommendation, residual debt disposition, deferred follow-up item fields

### Exit Criteria
- 구현이 끝난 packet은 packet exit quality gate reference path, exit recommendation, residual debt disposition, deferred follow-up item을 인용한다.
- packet exit quality gate reference는 implementation delta summary, source parity, UX/topology/schema conformance, validation/security/cleanup evidence를 담는다.
- source parity status 또는 validation / cleanup status가 `unknown`이거나 unresolved UX / topology / schema confusion이 남아 있으면 packet closeout hold가 유지된다.
- closeout contract는 core에서 criteria와 decision shape만 제공하고, project-specific bug list나 cleanup step 자체를 core 기본값으로 승격하지 않는다.

## OPS-01 Execution
### Goal
반복되는 process / quality friction이 `.agents/artifacts/PREVENTIVE_MEMORY.md`에 기록되고, human-reviewed target layer classification을 거쳐 core/profile/project follow-up item으로만 승격되게 하는 improvement promotion loop를 정의한다.

### Input
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/PREVENTIVE_MEMORY.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`

### Output
- preventive memory의 active rule / promotion candidate entry format
- friction candidate의 target layer, promotion status, linked follow-up item rule
- baseline / starter direct mutation 금지 rule
- packet closeout에서 preventive memory로 연결하는 field와 handoff expectation

### Exit Criteria
- 반복 friction은 preventive memory에 issue pattern, target layer, promotion status, source / evidence를 남긴다.
- `pending-review` 또는 `unknown` classification candidate는 메모로만 남고 baseline 문서나 starter template을 직접 바꾸지 않는다.
- 승인된 improvement candidate만 core/profile/project follow-up item 또는 explicit baseline update와 연결된다.
- improvement loop는 core에서 classification / promotion rule만 제공하고, project-specific incident narrative 자체를 core 기본값으로 승격하지 않는다.

## PRF-01 Execution
### Goal
grid-heavy administrative application에서 반복되는 dense grid UX와 operation pattern을 core 기본값으로 만들지 않고, explicit opt-in optional profile로 제공한다.

### Input
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- `reference/artifacts/maintenance/STANDARD_HARNESS_USER_MANUAL.md`

### Output
- admin grid application optional profile reference artifact
- profile activation signal과 profile vs project boundary
- packet에 남겨야 할 admin-grid profile evidence set
- starter template에 동일하게 배포 가능한 profile package

### Exit Criteria
- admin-grid project는 `PRF-01`을 explicit active profile로 선택할 수 있고, packet은 profile reference path를 인용한다.
- `PRF-01` active packet은 primary admin entity / surface, grid interaction model, search / filter / sort / pagination behavior, row action / bulk action rule, edit / save pattern, profile deviation / exception을 남긴다.
- profile은 grid-first reusable bias만 제공하고, project-specific column set / permission / report / export / one-off workflow는 project packet에 남긴다.
- reusable profile artifact, packet template, user manual, starter template이 같은 기준선으로 동기화된다.

## PRF-02 Execution
### Goal
spreadsheet가 planning 또는 operational source-of-truth 역할을 하는 반복 유형에서, workbook/sheet trace와 field mapping discipline을 core 기본값으로 만들지 않고 explicit opt-in optional profile로 제공한다.

### Input
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md`
- `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- `reference/artifacts/maintenance/STANDARD_HARNESS_USER_MANUAL.md`

### Output
- authoritative spreadsheet source optional profile reference artifact
- profile activation signal과 profile vs project boundary
- packet에 남겨야 할 workbook / sheet / range trace와 source mapping evidence set
- starter template에 동일하게 배포 가능한 profile package

### Exit Criteria
- spreadsheet-backed planning/source project는 `PRF-02`를 explicit active profile로 선택할 수 있고, packet은 profile reference path를 인용한다.
- `PRF-02` active packet은 source spreadsheet artifact, workbook / sheet / tab / range trace, header / column mapping, row key / record identity rule, source snapshot / version, transformation / normalization assumptions, reconciliation / overwrite rule, profile deviation / exception을 남긴다.
- profile은 spreadsheet traceability와 mapping discipline만 제공하고, project-specific workbook/tab/formula/column/import/business translation detail은 project packet에 남긴다.
- reusable profile artifact, packet template, user manual, starter template이 같은 기준선으로 동기화된다.

## PRF-03 Execution
### Goal
transfer-bound or airgapped delivery 환경에서 반복되는 bundle handoff와 integrity/rollback discipline을 core 기본값으로 만들지 않고 explicit opt-in optional profile로 제공한다.

### Input
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `reference/artifacts/DEPLOYMENT_PLAN.md`
- `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- `reference/artifacts/maintenance/STANDARD_HARNESS_USER_MANUAL.md`

### Output
- airgapped delivery optional profile reference artifact
- profile activation signal과 profile vs project boundary
- packet에 남겨야 할 transfer package / integrity / offline bundle / rollback evidence set
- starter template에 동일하게 배포 가능한 profile package

### Exit Criteria
- transfer-bound or airgapped delivery project는 `PRF-03`을 explicit active profile로 선택할 수 있고, packet은 profile reference path를 인용한다.
- `PRF-03` active packet은 transfer package / bundle artifact, transfer medium / handoff channel, checksum / integrity evidence, offline dependency bundle status, ingress verification / import step, rollback package / recovery bundle, manual custody / operator handoff, profile deviation / exception을 남긴다.
- profile은 airgapped bundle discipline과 transfer-governance만 제공하고, project-specific host/path/operator/import/runbook detail은 project packet에 남긴다.
- reusable profile artifact, packet template, user manual, starter template이 같은 기준선으로 동기화된다.

## PKT-01 Follow-Up Expectations
### Goal
각 follow-up task가 문서 개정만 남기지 않고, 실제로 validator와 review에서 강제 가능한 packet field와 evidence rule로 연결되게 한다.

### Output
- packet에 필요한 core fields 개정안
- domain foundation reference, authoritative source refs, authoritative source intake reference, source disposition, UX archetype reference, selected archetype, UX deviation status, active profile reference, profile-specific evidence status, profile deviation / exception, primary admin entity / surface, grid interaction model, search / filter / sort / pagination behavior, row action / bulk action rule, edit / save pattern, source spreadsheet artifact, workbook / sheet / tab / range trace, header / column mapping, row key / record identity rule, source snapshot / version, transformation / normalization assumptions, reconciliation / overwrite rule, transfer package / bundle artifact, transfer medium / handoff channel, checksum / integrity evidence, offline dependency bundle status, ingress verification / import step, rollback package / recovery bundle, manual custody / operator handoff, environment topology reference, source environment, target environment, execution target, transfer boundary, rollback boundary, packet exit quality gate reference, packet exit decision, residual debt disposition, deferred follow-up item, improvement candidate reference, promotion target layer, promotion status, linked follow-up item, planning conflict / implementation impact, profile dependency, schema impact, existing schema refs, DB compatibility analysis, migration/rollback impact 기준
- follow-up task별 approval boundary

## Validation Rules
- requirements open issue는 planning lane에서 닫고, downstream 문서에는 가정으로 흘리지 않는다.
- 사용자가 결정을 내려야 하는 planning packet은 `권장 결론 -> 핵심 근거 -> 조정 조건 -> defer fallback` 순서로 작성해 빠르게 판단할 수 있게 만든다.
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/artifacts/UI_DESIGN.md`는 requirements 승인 후에만 baseline으로 작성하거나 재정렬한다.
- core에는 특정 도메인 스키마, 특정 기술스택, 특정 운영환경 절차를 기본값으로 넣지 않는다.
- 반복 유형은 optional profile로 내리고, project-specific detail은 project packet으로만 닫는다.
- `Core`는 기본 활성, `Optional Profile`은 explicit-only, `Project Packet`은 project-specific 실행 전 필수라는 activation rule을 유지한다.
- 하나 이상의 active optional profile이 있으면 packet은 active profile references와 required profile-specific evidence를 남겨야 한다.
- declared optional profile이 둘 이상이면 packet은 profile composition rationale을 남기고 validator-required evidence는 declared profile set의 합집합을 따른다.
- validator enforcement가 필요한 concrete active packet은 `artifact_index`에 category `task_packet`으로 등록하고, declared status와 required evidence mismatch를 validator가 감지할 수 있어야 한다.
- `reference/packets/` 아래의 current-contract concrete packet은 registration 누락 자체가 validator error가 되며, wrong-category registration도 우회로로 허용하지 않는다.
- 각 구현 작업은 코드 착수 전에 task-level packet으로 다시 구체화한다.
- task-level packet은 작업 목적, 상세 동작, 상태 변화, 화면 변화, 데이터 영향, edge case, acceptance, human approval boundary를 포함해야 한다.
- data-impact 작업은 domain foundation reference와 schema impact 판단 없이 착수하지 않는다.
- domain foundation reference는 `reference/artifacts/DOMAIN_CONTEXT.md` 또는 승인된 동등 artifact를 사용하고, 핵심 엔티티/관계, lifecycle state/invariant, source-of-truth, schema impact, migration/rollback boundary, open question을 포함해야 한다.
- data-impact packet은 domain foundation reference path와 schema impact classification을 남겨야 하며, schema impact가 `unknown`이면 planning hold를 유지한다.
- DB 설계가 포함된 data-impact 작업은 user-confirmed table / column / data operation plan 없이 착수하지 않는다.
- 기존 프로그램과 연동되는 data-impact 작업은 existing DB schema artifact 요청과 compatibility analysis 없이 착수하지 않는다.
- user-facing 작업은 `reference/artifacts/PRODUCT_UX_ARCHETYPE.md` 또는 승인된 동등 artifact를 포함한 UX archetype reference 없이 착수하지 않는다.
- UX archetype reference는 primary user, product mode, information hierarchy, interaction/default layout bias, allowed deviation, approval boundary를 포함해야 한다.
- user-facing packet은 UX archetype reference path, selected archetype, deviation status를 남겨야 하며, selected archetype이 `unknown`이거나 deviation status가 `pending`이면 planning hold를 유지한다.
- `PRF-01`이 active profile이면 packet은 `reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md` 또는 승인된 동등 artifact 경로와 profile-specific evidence를 함께 남겨야 한다.
- `PRF-01` active packet은 primary admin entity / surface, grid interaction model, search / filter / sort / pagination behavior, row action / bulk action rule, edit / save pattern, approved profile deviation / exception을 남겨야 한다.
- project-specific grid column set, permission matrix, report/export shape, one-off admin workflow는 `PRF-01` profile 기본값으로 올리지 않는다.
- `PRF-02`가 active profile이면 packet은 `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md` 또는 승인된 동등 artifact 경로와 profile-specific evidence를 함께 남겨야 한다.
- `PRF-02` active packet은 source spreadsheet artifact, workbook / sheet / tab / range trace, header / column mapping, row key / record identity rule, source snapshot / version, transformation / normalization assumptions, reconciliation / overwrite rule, approved profile deviation / exception을 남겨야 한다.
- project-specific workbook name, tab structure, formula detail, column set, import script, business-specific translation rule은 `PRF-02` profile 기본값으로 올리지 않는다.
- `PRF-03`이 active profile이면 packet은 `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md` 또는 승인된 동등 artifact 경로와 profile-specific evidence를 함께 남겨야 한다.
- `PRF-03` active packet은 transfer package / bundle artifact, transfer medium / handoff channel, checksum / integrity evidence, offline dependency bundle status, ingress verification / import step, rollback package / recovery bundle, manual custody / operator handoff, approved profile deviation / exception을 남겨야 한다.
- project-specific host/path/removable-media 절차/site operator/custom import script/one-off rollback detail은 `PRF-03` profile 기본값으로 올리지 않는다.
- deploy/test/cutover 작업은 `reference/artifacts/DEPLOYMENT_PLAN.md` 또는 승인된 동등 artifact를 포함한 environment topology reference 없이 착수하지 않는다.
- environment topology reference는 source environment, target environment, execution target, execution owner, transfer boundary, rollback boundary, verification gate를 포함해야 한다.
- deploy/test/cutover packet은 environment topology reference path, source environment, target environment, execution target, transfer boundary, rollback boundary를 남겨야 하며, execution target이 `unknown`이거나 rollback boundary가 `unknown`이면 planning hold를 유지한다.
- 구현이 끝난 packet은 `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md` 또는 승인된 동등 artifact를 포함한 packet exit quality gate reference 없이 close하지 않는다.
- packet exit quality gate reference는 implementation delta summary, source parity check, residual debt / refactor disposition, UX / topology / schema conformance result, validation / security / cleanup evidence, deferred follow-up item을 포함해야 한다.
- active packet은 packet exit quality gate reference path, exit recommendation, residual debt disposition, deferred follow-up item을 남겨야 하며, source parity status 또는 validation / cleanup status가 `unknown`이거나 unresolved UX / topology / schema confusion이 남아 있으면 packet closeout hold를 유지한다.
- 반복 friction은 `.agents/artifacts/PREVENTIVE_MEMORY.md`에 issue pattern, proposed target layer, promotion status, source / evidence를 기록해야 한다.
- `pending-review` 또는 `unknown` classification candidate는 preventive memory에만 남고 baseline 문서나 starter template을 직접 바꾸지 않는다.
- 승인된 improvement candidate만 core/profile/project follow-up item 또는 explicit baseline update와 연결된다.
- authoritative source가 있는 작업은 source trace와 disposition 없이 close하지 않는다.
- 새 사용자 기획 문서는 최우선 authoritative source로 등록하고 planning baseline에 즉시 영향 평가를 건다.
- authoritative source intake reference는 `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md` 또는 승인된 동등 artifact를 사용하고, source summary, authoritative reason, affected baseline artifacts, conflict summary, current implementation impact, required rework / defer, recommended disposition을 포함해야 한다.
- authoritative source 영향이 있는 planning baseline과 packet은 source intake reference path와 disposition을 남겨야 한다.
- source disposition이 `pending`이거나 current implementation impact가 `unknown`이면 planning hold를 유지한다.
- 기존 안정성 유지는 신규 기획 반영 보류 근거가 아니며, conflict / rework / implementation impact를 명시적으로 보고한다.
- partial incorporation / defer / rejection은 명시적인 사용자 승인과 이유 기록 없이는 허용하지 않는다.
- 구현 도중 새로운 user-facing detail이 나오면 바로 코드로 닫지 않고 packet을 다시 열어 sync한다.
- context restoration은 정의된 load order를 따라야 하며, source trace 없는 복원은 complete로 보지 않는다.
- drift validator는 DB truth, generated docs, designated summary mismatch를 탐지하고 stale 상태를 올려야 한다.
- drift validator와 follow-up validator는 `task_packet`으로 등록된 concrete active packet instance의 required evidence 누락과 declared status mismatch도 탐지해야 한다.
- 같은 validator는 `reference/packets/` 아래 current-contract concrete packet이 registration 없이 존재할 때도 fail-fast finding을 올려 silent bypass를 막아야 한다.
- 표준 하네스 reusable asset을 바꾸는 lane은 `standard-template/`의 대응 starter, workflow, script, code, test, reference 자산을 같은 lane에서 함께 갱신해야 한다.
- source 없는 summary는 strong surface에 올리지 않는다.
- count badge는 visible detail list와 같아야 한다.
- generated docs는 deterministic ordering을 유지한다.
- improvement candidate는 human review 전까지 baseline change로 승격하지 않는다.
- 각 packet 종료 시 packet exit quality gate 결과와 security review result를 남긴다.
- cutover는 rollback path와 unresolved critical security finding 없이 진행하지 않는다.

## Per-Work-Item Execution Loop
1. rough baseline에서 이번 작업이 해결해야 할 범위를 자른다.
2. 현재 작업이 core contract, optional profile, project packet 중 어디에 속하는지 먼저 판정한다.
3. one-or-more active optional profiles가 있는지 확인하고, dependencies가 있으면 packet에 명시한다.
4. `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`를 사용해 task-level packet으로 layer classification, active profile dependencies, active profile references, profile composition rationale, domain foundation reference, authoritative source intake reference, UX archetype reference, environment topology reference, 목표, 비범위, 상세 동작, 상태/화면 변화, source refs, source disposition, selected archetype, UX deviation status, source/target environment, execution target, transfer boundary, rollback boundary, planning conflict / implementation impact, environment context, schema impact, existing schema refs, DB compatibility analysis, acceptance를 구체화한다.
5. 작업이 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`를 건드리면 상세 기능 기획, 상세 화면 설계, UX archetype deviation 여부를 인간과 sync한다.
6. approval boundary가 닫힌 뒤에만 코드를 구현한다.
7. 구현 중 새 요구나 새 화면 detail이 생기면 packet을 다시 열고 sync한 뒤 계속한다.
8. 구현 후 `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`를 사용해 packet exit quality gate reference, source parity, residual debt disposition, UX/topology/schema conformance, validation/security/cleanup evidence, deferred follow-up item을 정리하고, 반복 friction이 보이면 `.agents/artifacts/PREVENTIVE_MEMORY.md`에 improvement candidate reference, proposed target layer, promotion status, linked follow-up item을 남긴 뒤 closeout hold 조건이 없을 때만 security review와 validator check를 함께 닫는다.

## Operator Next Action
- `PLN-06` is closed.
- Start the first real project by copying `standard-template/` into a new project repo and running `INIT_STANDARD_HARNESS.cmd` or `npm run harness:init`.
- Choose optional profiles explicitly during kickoff, especially PRF-04 for Excel/VBA-MariaDB replacement, PRF-05 for Python/Django backoffice, and PRF-06 for workflow/approval applications when applicable.
