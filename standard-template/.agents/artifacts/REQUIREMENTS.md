# Requirements

## Status
- Draft

## Summary
이 문서는 새 프로젝트가 현재 표준 하네스 baseline 위에서 시작할 때 사용하는 사용자 친화적 기준 문서다. 이 문서는 프로젝트별 요구, 승인 경계, active profile, 핵심 acceptance를 닫는 기준 문서로 유지한다.

## Project Goal

### 사용자 목표
- [최종사용자가 빠르게 읽고 판단해야 하는 문제를 적는다]

### 운영 목표
- [운영자와 AI가 어떤 상태를 빠르게 복원하고 통제해야 하는지 적는다]

### 승인 목표
- [어떤 기준까지 닫혀야 첫 구현 lane을 열 수 있는지 적는다]

## Layer Model
- `Core`: 모든 복잡한 프로젝트에 공통인 표준 계약, 게이트, validator enforcement
- `Optional Profile`: 특정 유형의 프로젝트에서 반복되는 규칙 집합
- `Project Packet`: 실제 프로젝트의 엔티티, 화면, 연동, 환경 절차, acceptance를 닫는 계층

## Active Profile Selection
- [활성화할 optional profile이 있으면 적는다. 없으면 none]

## V1.1 Standalone Harness Baseline
- 하네스 runtime은 `.harness/runtime/*`에 있고, 하네스 테스트는 `.harness/test/*`에 있다.
- 제품 코드는 `src/`, `app/`, `backend/`, `frontend/`, `server/` 등 프로젝트가 선택한 경로를 사용할 수 있다.
- Node.js 24+는 하네스 runtime 요구사항이며, 제품 앱 runtime 요구사항이 아니다.
- `reference/artifacts/REPOSITORY_LAYOUT_OWNERSHIP.md`를 layout ownership 기준으로 사용한다.
- `.agents/artifacts/ACTIVE_PROFILES.md`가 active optional profile 선언의 stable artifact다.

## V1.2 Installable Harness / PMW Baseline
- installer는 프로젝트명, 대상 폴더, active profile을 받아 새 repo 폴더를 만들고 standard-template 복사, harness init, PMW export, PMW registry registration을 수행한다.
- PMW는 별도 앱이며 project registry에서 복수 프로젝트를 add/remove/archive/select 한다.
- 표준 하네스는 `.agents/runtime/project-manifest.json`과 `.agents/runtime/pmw-read-model.json`만 PMW용으로 관리한다.
- PMW는 `.agents/.harness/task/profile/validation truth`를 직접 수정하지 않는다.
- canonical manual은 `HARNESS_MANUAL.md`와 `PMW_MANUAL.md`다.

## Optional Profile Catalog
- `PRF-01`: admin grid application
- `PRF-02`: authoritative spreadsheet source
- `PRF-03`: airgapped delivery
- `PRF-04`: legacy Excel/VBA-MariaDB replacement
- `PRF-05`: Python/Django backoffice
- `PRF-06`: workflow/approval application
- `PRF-07`: lightweight web/app
- `PRF-08`: Android native app
- `PRF-09`: Node/frontend web app

## Layer Activation Contract
- `Core`는 모든 프로젝트에서 기본 활성 계층이다.
- `Optional Profile`은 실제 반복 유형이 확인되고, `Active Profile Selection`에 명시되며, 관련 packet 또는 downstream artifact가 그 dependency를 다시 적을 때만 활성화한다.
- `Project Packet`은 project-specific 구현, data-impact, user-facing, deploy/test/cutover 작업을 시작하기 전에 반드시 활성화되어야 하는 실행 계층이다.
- 계층 간 충돌이 있으면 `Core`는 공통 불변 조건, `Optional Profile`은 선택형 반복 규칙, `Project Packet`은 프로젝트 상세 합의를 담당한다.
- 계층 배치가 애매하면 더 아래 계층으로 내린다. 즉, `Core`로 승격하지 말고 먼저 `Optional Profile` 또는 `Project Packet`으로 둔다.

## Layer Decision Rules
- `Core`에 두는 항목: 특정 프로젝트 명사 없이 여러 복잡한 프로젝트에 공통 적용되고, generic validator / review rule로 강제 가능한 계약
- `Optional Profile`에 두는 항목: 특정 프로젝트 유형에서 반복되지만 모든 프로젝트의 기본값으로 두면 과도한 편향이 생기는 규칙 집합
- `Project Packet`에 두는 항목: 실제 엔티티명, 화면명, 문구, 기존 시스템 연동 세부, 환경 토폴로지, acceptance, cutover detail
- 특정 프로젝트의 테이블명, 컬럼명, 외부 시스템 endpoint, 제품 copy, 운영 host/path, 수작업 절차는 `Core`에 두지 않는다.

## Required Reading Rule
1. `AGENTS.md`
2. `.agents/rules/workspace.md`
3. `.agents/artifacts/CURRENT_STATE.md`
4. `.agents/artifacts/TASK_LIST.md`
5. 현재 lane에 맞는 workflow
6. 현재 lane에 필요한 baseline artifact
7. 명시적으로 활성화된 optional profile artifact
8. 현재 작업의 active project packet과 authoritative source artifact
9. 필요한 추가 reference material

## Operating Principles
1. context continuity: 상태, 판단 근거, 다음 행동은 source trace와 함께 복원 가능해야 한다.
2. SOP compliance: 승인된 workflow, validation rule, cutover sequence를 임의로 우회하지 않는다.
3. human in the loop: requirements freeze, architecture sync, cutover, security risk acceptance 같은 핵심 판단은 사람 승인 지점을 둔다.
4. decision-ready authoring: 사용자가 결정을 내려야 하는 문서는 `권장 결론`, `핵심 근거`, `예외 조건`, `fallback`을 함께 제공한다.
5. progressive elaboration: rough baseline 승인만으로 바로 코드에 들어가지 않고, task-level packet으로 다시 닫는다.
6. layered standardization: 특정 도메인, 특정 기술스택, 특정 운영환경 절차는 core 기본값으로 넣지 않는다.
7. authoritative source: 외부 기획, 정책, 업무 절차, 연동 명세는 권위 있는 source로 등록하고 추적한다.
8. legacy integration safety: 기존 프로그램과 연동되는 data-impact 작업은 기존 스키마와 운영 프로세스를 확인하고, 테이블명/컬럼명/데이터 운영 방식 차이로 운영 이슈가 생기지 않도록 사용자 승인 기반으로 설계한다.
9. planning precedence: 새 사용자 기획 문서를 받으면 requirements, architecture, implementation, active packet에 즉시 영향 평가를 걸고, 기존 구현의 안정적 유지보다 신규 기획의 완전 반영을 우선한다.
10. environment clarity: deploy, test, cutover 성격의 작업은 source 환경, target 환경, execution target, rollback 경계를 명시한다.

## Authoring And Approval Workflow
1. implementation-critical issue가 닫히거나 명시적으로 deferred 될 때까지 requirements를 먼저 정리한다.
2. requirements가 확정되기 전에는 architecture / implementation / UI baseline을 새 기준선으로 sync하지 않는다.
3. requirements 승인 후 architecture / implementation / UI 문서를 같은 기준선으로 맞춘다.
4. user-facing 작업은 task-level detailed design과 human sync 없이 코드로 먼저 확정하지 않는다.
5. data-impact 작업은 `reference/artifacts/DOMAIN_CONTEXT.md` 또는 동등한 approved domain foundation reference와 schema impact 판단 없이 `Ready For Code`로 올리지 않는다.
6. DB 설계가 포함된 data-impact 작업은 테이블명, 컬럼명, 데이터 운영 방식에 대한 사용자 확인 없이 `Ready For Code`로 올리지 않는다.
7. 작업이 기존 프로그램과 연동되면 사용자에게 기존 프로그램 DB schema 또는 동등한 authoritative schema artifact를 요청하고, naming / data operation / ownership / migration compatibility 분석을 packet에 남기기 전에는 설계를 닫지 않는다.
8. deploy/test/cutover 작업은 environment topology와 execution target 없이 `Ready For Code`로 올리지 않는다.
9. 새 사용자 기획 문서를 접수하면 이를 최우선 authoritative source로 등록하고 requirements, architecture, implementation, active packet에 즉시 영향 범위를 재평가한다.
10. 신규 기획 문서는 기존 기획, 승인된 packet, 현재 구현과의 충돌과 재작업 범위를 분석해 보고하며, 기존 구현의 안정적 유지보다 신규 기획의 완전 반영을 우선한다.
11. authoritative source가 있는 작업은 source trace와 disposition 없이 close하지 않는다.
12. domain foundation reference에는 최소한 핵심 엔티티/관계, lifecycle state/invariant, 기존 시스템 source-of-truth, schema impact class, migration/rollback boundary, open question이 포함되어야 한다.
13. data-impact 작업의 schema impact가 `unknown`이면 planning hold를 유지하고 설계 또는 구현으로 넘기지 않는다.
14. authoritative source 영향이 있는 작업은 `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md` 또는 동등한 approved source intake reference 없이 planning baseline이나 packet을 새 기준선으로 sync하지 않는다.
15. source intake reference에는 최소한 source summary, authoritative reason, affected baseline artifacts, conflict summary, current implementation impact, required rework / defer, recommended disposition이 포함되어야 한다.
16. 한 authoritative source change가 여러 open packet에 동시에 영향을 주면 `reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md` 또는 동등한 approved source-wave ledger를 함께 열어 impacted packet set과 rebaseline 상태를 project-level로 닫는다.
17. multi-packet source wave에 들어간 packet은 `Impacted packet set scope`, `Authoritative source wave ledger reference`, `Source wave packet disposition`을 함께 남기기 전에는 `Ready For Code`로 올리지 않는다.
18. 새 사용자 기획 문서의 partial incorporation, defer, rejection은 명시적인 사용자 승인과 이유 기록 없이는 허용하지 않는다.
19. user-facing 작업은 `reference/artifacts/PRODUCT_UX_ARCHETYPE.md` 또는 동등한 approved UX archetype reference 없이 `Ready For Code`로 올리지 않는다.
20. UX archetype reference에는 최소한 primary user, product mode, information hierarchy, interaction/default layout bias, allowed deviation, approval boundary가 포함되어야 한다.
21. user-facing packet의 selected UX archetype이 `unknown`이거나 deviation status가 `pending`이면 planning hold를 유지한다.
22. deploy/test/cutover 작업은 `reference/artifacts/DEPLOYMENT_PLAN.md` 또는 동등한 approved environment topology reference 없이 `Ready For Code`로 올리지 않는다.
23. environment topology reference에는 최소한 source environment, target environment, execution target, execution owner, transfer boundary, rollback boundary, verification gate가 포함되어야 한다.
24. deploy/test/cutover packet의 execution target 또는 rollback boundary가 `unknown`이면 planning hold를 유지한다.
25. 구현이 끝난 packet은 `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md` 또는 동등한 approved packet closeout reference 없이 완료 또는 close 상태로 올리지 않는다.
26. packet exit quality gate reference에는 최소한 implementation delta summary, source parity check, residual debt / refactor disposition, UX / topology / schema conformance result, validation / security / cleanup evidence, deferred follow-up item이 포함되어야 한다.
27. source parity status 또는 validation / cleanup status가 `unknown`이거나 unresolved UX / topology / schema confusion이 남아 있으면 packet closeout hold를 유지한다.
28. 반복되는 process / quality friction은 `.agents/artifacts/PREVENTIVE_MEMORY.md`에 trigger, impact, evidence, proposed target layer(`core / optional profile / project packet / note-only`)와 함께 기록한다.
29. improvement candidate는 explicit human review로 promotion status와 target layer가 닫히기 전에는 baseline 문서, starter template, SOP를 직접 바꾸지 않는다.
30. target layer가 `unknown`이거나 promotion status가 `pending-review`인 candidate는 개선 메모로만 남기고, 승인된 core/profile/project follow-up item으로 간주하지 않는다.
31. 한 concrete work item은 필요하면 둘 이상의 optional profile을 동시에 활성화할 수 있고, packet은 `Active profile dependencies`, `Active profile references`, `Profile composition rationale`를 남긴다.
32. `PRF-01`이 활성화된 grid-heavy administrative application 작업은 `reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md` 또는 동등한 approved admin-grid profile reference 없이 `Ready For Code`로 올리지 않는다.
33. `PRF-01` active packet은 최소 `Active profile references`, `Primary admin entity / surface`, `Grid interaction model`, `Search / filter / sort / pagination behavior`, `Row action / bulk action rule`, `Edit / save pattern`, `Profile deviation / exception`을 남긴다.
34. project-specific grid column set, permission matrix, export/report format, one-off admin workflow는 `PRF-01` profile 기본값으로 승격하지 않고 project packet에 둔다.
35. `PRF-02`가 활성화된 spreadsheet-backed authoritative source 작업은 `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md` 또는 동등한 approved spreadsheet-source profile reference 없이 `Ready For Code`로 올리지 않는다.
36. `PRF-02` active packet은 최소 `Active profile references`, `Source spreadsheet artifact`, `Workbook / sheet / tab / range trace`, `Header / column mapping`, `Row key / record identity rule`, `Source snapshot / version`, `Transformation / normalization assumptions`, `Reconciliation / overwrite rule`, `Profile deviation / exception`을 남긴다.
37. project-specific workbook name, tab structure, formula detail, column set, import script, business-specific translation rule은 `PRF-02` profile 기본값으로 승격하지 않고 project packet에 둔다.
38. `PRF-03`이 활성화된 transfer-bound 또는 airgapped delivery 작업은 `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md` 또는 동등한 approved airgapped-delivery profile reference 없이 `Ready For Code`로 올리지 않는다.
39. `PRF-03` active packet은 최소 `Active profile references`, `Transfer package / bundle artifact`, `Transfer medium / handoff channel`, `Checksum / integrity evidence`, `Offline dependency bundle status`, `Ingress verification / import step`, `Rollback package / recovery bundle`, `Manual custody / operator handoff`, `Profile deviation / exception`을 남긴다.
40. project-specific host/path, removable-media 절차, site operator step, custom import script, one-off rollback runbook detail은 `PRF-03` profile 기본값으로 승격하지 않고 project packet에 둔다.
41. `PRF-04`가 활성화된 legacy Excel/VBA-MariaDB replacement 작업은 workbook inventory, workbook/sheet/range/header mapping, VBA module/macro/function inventory, MariaDB schema snapshot, operator step, import/export/report path, source-of-truth ownership, migration/reconciliation, and parallel-run evidence 없이 `Ready For Code`로 올리지 않는다.
42. `PRF-05`가 활성화된 Python/Django backoffice 작업은 product source root, Python/Django version policy, supported-version/security-support rationale, dependency manager, app/module boundary, settings/environment policy, migration policy, DB compatibility, service/transaction boundary, auth/permission/admin boundary, background job boundary, test convention 없이 `Ready For Code`로 올리지 않는다.
43. `PRF-06`이 활성화된 workflow/approval application 작업은 state machine, approval rule matrix, role/permission matrix, audit event spec, exception/rollback/reopen rule 없이 `Ready For Code`로 올리지 않는다.
44. `PRF-07`이 활성화된 lightweight web/app 작업은 product source root, runtime/framework, rendering/app mode, data persistence boundary, auth/user identity, deployment target, external API/integration boundary, lightweight acceptance 없이 `Ready For Code`로 올리지 않는다.
45. `PRF-08`이 활성화된 Android native app 작업은 product source root, package namespace, Kotlin/Java policy, Gradle/AGP version, minSdk/targetSdk, signing policy, build variants/flavors, permissions, local storage, network/API boundary, navigation, offline/sync, notification, privacy/data policy, device/emulator test plan, release channel 없이 `Ready For Code`로 올리지 않는다.
46. `PRF-09`가 활성화된 Node/frontend web app 작업은 product source root, package ownership policy, Node.js product runtime policy, package manager, framework/bundler, build command, test command, environment variable policy, API/backend boundary, static asset/routing policy, deployment target 없이 `Ready For Code`로 올리지 않는다.

## In Scope
- repo-local DB truth for hot-state and operational metadata
- 사람이 읽고 승인할 수 있는 Markdown canonical docs
- generated state docs
- PMW read-only summary/detail/artifact viewer/settings
- context restoration flow with explicit load order and source trace
- drift detection and recovery rule
- domain foundation gate
- `reference/artifacts/DOMAIN_CONTEXT.md` 기반의 domain foundation artifact template
- 기존 프로그램 연동 작업의 DB schema intake, naming/data operation compatibility analysis, user DB design confirmation
- authoritative source contract
- `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md` 기반의 authoritative source intake artifact template
- `reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md` 기반의 shared-source rebaseline control artifact template
- 새 사용자 기획 문서의 conflict / implementation impact analysis와 re-planning rule
- product UX archetype contract
- `reference/artifacts/PRODUCT_UX_ARCHETYPE.md` 기반의 product UX archetype artifact template
- environment topology contract
- `reference/artifacts/DEPLOYMENT_PLAN.md` 기반의 environment topology artifact template
- recurring inefficiency capture와 improvement backlog 운영
- packet exit quality gate
- `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md` 기반의 packet closeout artifact template
- `.agents/artifacts/PREVENTIVE_MEMORY.md` 기반의 improvement memory and promotion candidate operation
- `reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md` 기반의 admin grid application optional profile package
- `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md` 기반의 authoritative spreadsheet source optional profile package
- `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md` 기반의 airgapped delivery optional profile package
- `reference/profiles/PRF-04_LEGACY_EXCEL_VBA_MARIADB_REPLACEMENT_PROFILE.md` 기반의 legacy replacement optional profile package
- `reference/profiles/PRF-05_PYTHON_DJANGO_BACKOFFICE_PROFILE.md` 기반의 Python/Django backoffice optional profile package
- `reference/profiles/PRF-06_WORKFLOW_APPROVAL_APPLICATION_PROFILE.md` 기반의 workflow/approval optional profile package
- `reference/profiles/PRF-07_LIGHTWEIGHT_WEB_APP_PROFILE.md` 기반의 lightweight web/app optional profile package
- `reference/profiles/PRF-08_ANDROID_NATIVE_APP_PROFILE.md` 기반의 Android native app optional profile package
- `reference/profiles/PRF-09_NODE_FRONTEND_WEB_APP_PROFILE.md` 기반의 Node/frontend web app optional profile package
- security review process
- validator / migration / cutover contract
- active profile과 required evidence를 `artifact_index`의 `task_packet` registration까지 확인하는 profile-aware validator

## Out Of Scope
- PMW write enable
- remote sync or multi-user coordination by default
- 특정 도메인 스키마를 core 기본값으로 고정하는 것
- 특정 UI 스타일을 core 기본값으로 고정하는 것
- 특정 기술스택, 특정 DB, 특정 배포 구조를 core 기본값으로 고정하는 것

## Acceptance Criteria
- `.agents/artifacts/REQUIREMENTS.md`가 사용자 최종 확정된 뒤에만 downstream baseline 문서가 재정렬된다.
- active profile selection이 명시된다.
- `Core`는 기본 활성, `Optional Profile`은 explicit-only, `Project Packet`은 project-specific 실행 전 필수라는 activation rule이 문서화된다.
- required reading rule이 baseline artifact, active profile, active packet, authoritative source 순서를 포함해 정의된다.
- `Core`에 넣으면 안 되는 project-specific 항목 예시와 분류 규칙이 정리된다.
- data-impact 작업은 `reference/artifacts/DOMAIN_CONTEXT.md` 또는 승인된 동등 artifact를 포함한 domain foundation reference와 schema impact 판단 없이 시작되지 않는다.
- data-impact packet에는 domain foundation reference path와 schema impact classification이 남는다.
- schema impact classification이 `unknown`이면 planning hold가 유지된다.
- DB 설계가 포함된 data-impact 작업은 테이블명, 컬럼명, 데이터 운영 방식에 대한 user confirmation 없이는 시작되지 않는다.
- 기존 프로그램과 연동되는 경우 existing DB schema 또는 equivalent authoritative schema artifact가 확보되고, naming / data operation / ownership / migration compatibility 분석이 남는다.
- user-facing 작업은 `reference/artifacts/PRODUCT_UX_ARCHETYPE.md` 또는 승인된 동등 artifact를 포함한 UX archetype reference 없이 시작되지 않는다.
- user-facing packet에는 UX archetype reference path, selected archetype, deviation status가 남는다.
- selected archetype이 `unknown`이거나 deviation status가 `pending`이면 planning hold가 유지된다.
- deploy/test/cutover 작업은 `reference/artifacts/DEPLOYMENT_PLAN.md` 또는 승인된 동등 artifact를 포함한 environment topology reference 없이 시작되지 않는다.
- deploy/test/cutover packet에는 environment topology reference path, source environment, target environment, execution target, transfer boundary, rollback boundary가 남는다.
- execution target이 `unknown`이거나 rollback boundary가 `unknown`이면 planning hold가 유지된다.
- 구현이 끝난 packet은 `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md` 또는 승인된 동등 artifact를 포함한 packet exit quality gate reference 없이 close되지 않는다.
- packet exit quality gate reference에는 implementation delta summary, source parity, residual debt / refactor disposition, UX / topology / schema conformance, validation / security / cleanup evidence, deferred follow-up item이 정리된다.
- source parity status 또는 validation / cleanup status가 `unknown`이거나 unresolved UX / topology / schema confusion이 남아 있으면 packet closeout hold가 유지된다.
- 반복 friction은 `.agents/artifacts/PREVENTIVE_MEMORY.md`에 target layer, promotion status, linked follow-up item, source evidence와 함께 기록된다.
- `pending-review` 또는 `unknown` classification의 improvement candidate는 메모로만 남고 baseline 문서나 starter template을 직접 바꾸지 않는다.
- 승인된 improvement candidate만 core/profile/project follow-up item 또는 baseline update와 연결된다.
- `PRF-01`을 활성화한 admin grid application 작업은 `reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md` 또는 승인된 동등 artifact 경로를 packet에 남긴다.
- `PRF-01` active packet에는 primary admin entity / surface, grid interaction model, search / filter / sort / pagination behavior, row action / bulk action rule, edit / save pattern, profile deviation / exception이 정리된다.
- project-specific grid column set, permission matrix, export/report shape, one-off admin workflow는 `PRF-01` profile 기본값이 아니라 project packet detail로 남는다.
- `PRF-02`를 활성화한 spreadsheet-backed authoritative source 작업은 `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md` 또는 승인된 동등 artifact 경로를 packet에 남긴다.
- `PRF-02` active packet에는 source spreadsheet artifact, workbook / sheet / tab / range trace, header / column mapping, row key / record identity rule, source snapshot / version, transformation / normalization assumptions, reconciliation / overwrite rule, profile deviation / exception이 정리된다.
- project-specific workbook/tab/formula/column/import/business translation detail은 `PRF-02` profile 기본값이 아니라 project packet detail로 남는다.
- `PRF-03`을 활성화한 transfer-bound 또는 airgapped delivery 작업은 `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md` 또는 승인된 동등 artifact 경로를 packet에 남긴다.
- `PRF-03` active packet에는 transfer package / bundle artifact, transfer medium / handoff channel, checksum / integrity evidence, offline dependency bundle status, ingress verification / import step, rollback package / recovery bundle, manual custody / operator handoff, profile deviation / exception이 정리된다.
- project-specific host/path/removable-media 절차/site operator/custom import script/one-off rollback detail은 `PRF-03` profile 기본값이 아니라 project packet detail로 남는다.
- `PRF-04` active packet에는 legacy source inventory, workbook/sheet/range/header trace, VBA inventory, MariaDB schema snapshot, import/export/report paths, source-of-truth ownership, migration/reconciliation plan, parallel-run evidence가 정리된다.
- `PRF-05` active packet에는 Python/Django version policy, dependency manager, app/module boundary, settings/environment, migration, DB compatibility, service/transaction, auth/permission/admin, background job, test convention evidence가 정리된다.
- `PRF-06` active packet에는 state machine, approval rule matrix, role/permission matrix, audit event spec, exception/rollback/reopen rule이 정리된다.
- `PRF-07` active packet에는 product source root, runtime/framework, rendering/app mode, data persistence boundary, auth/user identity, deployment target, external API/integration boundary, lightweight acceptance가 정리된다.
- `PRF-08` active packet에는 Android namespace, Kotlin/Java policy, Gradle/AGP version, minSdk/targetSdk, signing, variants/flavors, permissions, storage, network/API, navigation, offline/sync, notification, privacy/data, device/emulator test, release channel이 정리된다.
- `PRF-09` active packet에는 package ownership, Node product runtime, package manager, framework/bundler, build/test command, environment variable policy, API/backend boundary, static asset/routing, deployment target이 정리된다.
- authoritative source가 있는 작업은 source trace와 disposition 없이 완료되지 않는다.
- authoritative source 영향이 있는 planning baseline과 active packet은 source intake reference path와 disposition을 남긴다.
- source intake reference에는 conflict summary, current implementation impact, required rework / defer가 정리된다.
- source disposition이 `pending`이거나 current implementation impact가 `unknown`이면 planning hold가 유지된다.
- 한 authoritative source change가 여러 open packet에 영향을 주면 project-level source wave ledger가 열리고, impacted packet set과 rebaseline status가 packet별로 추적된다.
- multi-packet source wave에 속한 packet은 impacted packet set scope, authoritative source wave ledger reference, source wave packet disposition을 함께 남긴다.
- source wave ledger가 없는 multi-packet source wave나 stale packet subset을 남기는 parallel drift는 허용되지 않는다.
- 새 사용자 기획 문서를 받으면 requirements / architecture / implementation / active packet이 즉시 영향 평가를 받고, 기존 기획 및 현재 구현과의 충돌과 재작업 범위가 보고된다.
- 신규 기획 문서 반영 판단은 기존 안정성 유지보다 완전 반영을 우선하고, 예외는 사용자가 명시적으로 부분 반영을 승인한 경우에만 둔다.
- 신규 기획 문서의 partial incorporation / defer / rejection은 명시적인 사용자 승인과 이유 기록 없이는 허용되지 않는다.
- 하네스가 세션 전환 후에도 핵심 상태, 판단 근거, 다음 행동을 source trace와 함께 복원할 수 있다.
- validator가 drift, missing source, cutover mismatch를 검출할 수 있다.
- validator가 active profile 또는 core contract의 required evidence 누락을 검출할 수 있다.
  reusable contract marker뿐 아니라 `artifact_index`에 category `task_packet`으로 등록된 concrete active packet instance의 required evidence도 포함한다.
- 현재 standard packet contract marker를 가진 concrete packet이 `reference/packets/` 아래에 존재하면 validator는 그 packet을 canonical candidate로 발견해야 하고, `task_packet` registration이 없거나 category가 다르면 fail-fast 해야 한다.
- packet closeout에는 품질 게이트와 보안 검토 결과가 남는다.

## Open Questions
- [구현 전 반드시 닫아야 하는 질문]

## Deferred Items
- [지금 닫지 못하는 항목과 owner / follow-up timing / temporary rule]
