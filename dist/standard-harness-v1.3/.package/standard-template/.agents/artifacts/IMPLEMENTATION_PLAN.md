# Implementation Plan

## Status
- Draft

## Summary
새 프로젝트는 `kickoff interview -> requirements freeze -> baseline sync -> first work packet approval -> implementation -> validation / PMW / cutover readiness -> packet exit quality gate -> review` 순서로 진행한다.

## Phase Plan
1. kickoff 입력과 deep interview를 정리한다.
2. requirements baseline을 사용자 승인 기준으로 닫는다.
3. requirements 승인 뒤 architecture / implementation / UI 기준선을 맞춘다.
4. 첫 work item packet을 열고 구현 전 상세 범위를 닫는다.
5. packet 기준으로 구현과 canonical doc sync를 진행한다.
6. generated docs, validator, PMW export, separate PMW read surface를 확인한다.
7. deploy/test/cutover가 있으면 topology와 rollback 경계를 닫는다.
8. packet exit quality gate, security review, release review를 진행한다.

## Standard Task Skeleton
- PLN-00 deep interview using `reference/planning/PLN-00_DEEP_INTERVIEW.md`
- PLN-01 user-friendly requirements freeze
- PLN-02 post-approval architecture / implementation / UI sync
- DSG-01 rough mockup and global behavior contract
- PKT-01 per-work-item planning and design approval using `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- DEV-01 first approved implementation packet
- DEV-02 implementation and canonical-doc sync
- DEV-03 generated state docs / validator verification
- DEV-04 PMW and operator read-surface verification
- DEV-05 deploy / test / cutover readiness verification
- QLT-01 packet exit quality gate
- SEC-01 security review and remediation
- TST-01 acceptance / parity verification
- TST-02 operator comprehension check
- REV-01 release review gate

## Standard Gate Expectations
### Layer Activation Contract
- `Core`는 기본 활성이다.
- `Optional Profile`은 requirements와 architecture에 explicit하게 선택되고, active task packet이 dependency를 다시 적을 때만 활성화된다.
- `Project Packet`은 project-specific 실행 계층이며, 코드, migration, deploy/test/cutover, user-facing 확정은 active packet 없이 시작하지 않는다.
- activation precedence는 `Core -> Optional Profile -> Project Packet`이며, 계층이 애매하면 더 아래 계층으로 내린다.

### Validator Enforcement
- reusable packet template과 active optional profile artifact는 required evidence marker를 노출해야 한다.
- validator enforcement가 필요한 concrete active packet은 `artifact_index`에 category `task_packet`으로 등록한다.
- validator는 등록된 `task_packet`의 declared status와 required evidence 누락을 함께 검사해야 한다.
- `reference/packets/` 아래 current-contract concrete packet이 존재하면 validator는 canonical candidate로 발견하고, registration missing 또는 wrong-category registration을 fail-fast로 올려야 한다.
- same validator는 multi-packet authoritative source wave에서 packet이 cited source wave ledger에 실제로 포함되는지와 packet disposition이 ledger row와 일치하는지도 검사해야 한다.

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

### Domain Foundation Gate
- data-impact 작업은 `reference/artifacts/DOMAIN_CONTEXT.md` 또는 승인된 동등 artifact를 포함한 domain foundation reference, schema impact, migration/rollback 관점 없이 시작하지 않는다.
- domain foundation reference는 핵심 엔티티/관계, lifecycle state/invariant, source-of-truth, schema impact, migration/rollback boundary, open question을 포함해야 한다.
- data-impact packet은 domain foundation reference path와 schema impact classification을 남겨야 하며, schema impact가 `unknown`이면 planning hold를 유지한다.
- DB 설계는 항상 사용자 confirmation 대상이며, 기존 프로그램과 연동되면 existing DB schema 또는 동등한 authoritative schema artifact를 요청하고 naming / data operation compatibility 분석을 남긴 뒤에만 설계를 닫는다.

### Authoritative Source Contract
- 새 사용자 기획 문서는 requirements / architecture / implementation / active packet에 즉시 영향을 주는 최우선 authoritative source다.
- 새 기획 문서를 받으면 기존 기획, 승인된 packet, 현재 구현과의 충돌과 재작업 범위를 분석해 보고하고, 기존 안정성 유지보다 신규 기획의 완전 반영을 우선한다.
- authoritative source intake reference는 `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md` 또는 승인된 동등 artifact를 사용하고, source summary, authoritative reason, affected baseline artifacts, conflict summary, current implementation impact, required rework / defer, recommended disposition을 포함해야 한다.
- authoritative source 영향이 있는 planning baseline과 packet은 source intake reference path와 disposition을 남겨야 한다.
- source disposition이 `pending`이거나 current implementation impact가 `unknown`이면 planning hold를 유지한다.
- 한 authoritative source change가 여러 open packet에 동시에 영향을 주면 `reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md`를 함께 열어 impacted packet set과 packet별 rebaseline status를 project-level로 닫는다.
- multi-packet source wave packet은 impacted packet set scope, authoritative source wave ledger reference, source wave packet disposition, shared-source wave status를 남겨야 하고, wave status가 `approved`가 아니면 planning hold를 유지한다.
- partial incorporation / defer / rejection은 명시적인 사용자 승인과 이유 기록 없이는 허용하지 않는다.

### Product UX Archetype Contract
- user-facing 작업은 `reference/artifacts/PRODUCT_UX_ARCHETYPE.md` 또는 승인된 동등 artifact를 포함한 UX archetype reference 없이 시작하지 않는다.
- UX archetype reference는 primary user, product mode, information hierarchy, interaction/default layout bias, allowed deviation, approval boundary를 포함해야 한다.
- user-facing packet은 UX archetype reference path, selected archetype, deviation status를 남겨야 하며, selected archetype이 `unknown`이거나 deviation status가 `pending`이면 planning hold를 유지한다.
- core는 archetype catalog와 deviation rule만 제공하고, project-specific screen copy나 one-off layout detail은 packet에서 닫는다.

### Admin Grid Application Profile
- admin-grid application은 `reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md` 또는 승인된 동등 artifact를 포함한 active profile references 없이 시작하지 않는다.
- `PRF-01` active packet은 active profile references, primary admin entity / surface, grid interaction model, search / filter / sort / pagination behavior, row action / bulk action rule, edit / save pattern, profile deviation / exception을 남겨야 한다.
- profile은 grid-first reusable bias만 제공하고, project-specific column set, permission matrix, report/export shape, one-off admin workflow는 packet에서 닫는다.
- active profile references나 required profile evidence가 비어 있으면 planning/design hold를 유지한다.

### Authoritative Spreadsheet Source Profile
- spreadsheet-backed authoritative source 작업은 `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md` 또는 승인된 동등 artifact를 포함한 active profile references 없이 시작하지 않는다.
- `PRF-02` active packet은 active profile references, source spreadsheet artifact, workbook / sheet / tab / range trace, header / column mapping, row key / record identity rule, source snapshot / version, transformation / normalization assumptions, reconciliation / overwrite rule, profile deviation / exception을 남겨야 한다.
- profile은 spreadsheet traceability와 mapping discipline만 제공하고, project-specific workbook/tab/formula/column/import/business translation detail은 packet에서 닫는다.
- active profile references나 required profile evidence가 비어 있으면 planning/design hold를 유지한다.

### Airgapped Delivery Profile
- transfer-bound or airgapped delivery 작업은 `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md` 또는 승인된 동등 artifact를 포함한 active profile references 없이 시작하지 않는다.
- `PRF-03` active packet은 active profile references, transfer package / bundle artifact, transfer medium / handoff channel, checksum / integrity evidence, offline dependency bundle status, ingress verification / import step, rollback package / recovery bundle, manual custody / operator handoff, profile deviation / exception을 남겨야 한다.
- profile은 airgapped bundle discipline과 transfer-governance만 제공하고, project-specific host/path/operator/import/runbook detail은 packet에서 닫는다.
- active profile references나 required profile evidence가 비어 있으면 planning/design hold를 유지한다.

- 하나 이상의 active optional profile이 있으면 packet은 active profile references와 required profile-specific evidence를 남겨야 한다.
- declared optional profile이 둘 이상이면 packet은 profile composition rationale을 남기고 validator-required evidence는 declared profile set의 합집합을 따른다.
- concrete current-contract packet은 생성과 같은 lane에서 `artifact_index`의 `task_packet` registration까지 닫지 않으면 validator clean으로 지나가지 않는다.

### Environment Topology Contract
- deploy/test/cutover 작업은 `reference/artifacts/DEPLOYMENT_PLAN.md` 또는 승인된 동등 artifact를 포함한 environment topology reference 없이 시작하지 않는다.
- environment topology reference는 source environment, target environment, execution target, execution owner, transfer boundary, rollback boundary, verification gate를 포함해야 한다.
- deploy/test/cutover packet은 environment topology reference path, source environment, target environment, execution target, transfer boundary, rollback boundary를 남겨야 하며, execution target이 `unknown`이거나 rollback boundary가 `unknown`이면 planning hold를 유지한다.
- core는 topology boundary와 approval rule만 제공하고, project-specific host/path/operator step은 packet에서 닫는다.

### Packet Exit Quality Gate
- 구현이 끝난 packet은 `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md` 또는 승인된 동등 artifact를 포함한 packet exit quality gate reference 없이 close하지 않는다.
- packet exit quality gate reference는 implementation delta summary, source parity check, residual debt / refactor disposition, UX / topology / schema conformance result, validation / security / cleanup evidence, deferred follow-up item을 포함해야 한다.
- active packet은 packet exit quality gate reference path, exit recommendation, residual debt disposition, deferred follow-up item을 남겨야 하며, source parity status 또는 validation / cleanup status가 `unknown`이거나 unresolved UX / topology / schema confusion이 남아 있으면 packet closeout hold를 유지한다.
- core는 closeout criteria와 decision shape만 제공하고, project-specific bug list나 one-off cleanup step은 packet에서 닫는다.

### Improvement Promotion Loop
- 반복 friction은 `.agents/artifacts/PREVENTIVE_MEMORY.md`에 issue pattern, proposed target layer, promotion status, source / evidence를 기록한다.
- promotion candidate는 target layer, target artifact / follow-up item, human review boundary를 남겨야 한다.
- `pending-review` 또는 `unknown` classification candidate는 preventive memory에만 남고 baseline 문서나 starter를 직접 바꾸지 않는다.
- 승인된 promotion만 core/profile/project follow-up item이나 baseline update와 연결한다.

## Optional Profile Activation
- [활성화할 profile이 있으면 적고, 활성화 조건과 근거를 기록한다]
- `PRF-01`: 내부 운영자/관리자가 dense record grid를 search/filter/sort하며 row action, detail view, bulk operation을 반복 수행하는 제품일 때만 활성화한다.
- `PRF-02`: spreadsheet가 planning, field mapping, backlog, operational source-of-truth의 authoritative input surface일 때만 활성화한다.
- `PRF-03`: transfer boundary가 airgapped이거나 manual-transfer / removable-media / offline bundle handoff가 반복되는 delivery work일 때만 활성화한다.
- `PRF-04`: Excel/VBA/MariaDB와 수작업 운영 절차가 기존 production logic인 legacy replacement일 때만 활성화한다.
- `PRF-05`: Python/Django backoffice 제품을 구현하며 source root, version, migration, DB, service/admin/test convention이 필요한 경우 활성화한다.
- `PRF-06`: 상태전이, 승인, 권한, 감사, 예외/reopen/rollback 규칙이 핵심인 workflow application일 때 활성화한다.
- `PRF-07`: lightweight web/app 또는 작은 내부 도구처럼 전체 업무시스템 게이트가 과한 프로젝트일 때 활성화한다.
- `PRF-08`: Android native app, Gradle/AGP, signing, permissions, device/emulator test, release channel이 필요한 프로젝트일 때 활성화한다.
- `PRF-09`: Node/frontend web app, package/build/test/env/deploy 경계가 필요한 프로젝트일 때 활성화한다.

## Current Iteration
- [현재 단계 목표]

## Validation Commands
- `npm test`
- `npm run harness:validate`
- `npm run harness:pmw-export`
- `npm run harness:migration-preview`
- `npm run harness:cutover-preflight`
- `npm run harness:cutover-report`

## Operator Next Action
- Run `INIT_STANDARD_HARNESS.cmd` if this repo is still in starter state.
- Close `PLN-00` and `PLN-01` for the new project.
- Sync `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, and `reference/artifacts/UI_DESIGN.md` only after requirements approval.
- Open the first project packet only after requirements, architecture, and profile selection are aligned.
