# Architecture Guide

## Status
- Draft

## Summary
아키텍처는 `Governance Markdown truth + hot operational DB state + generated operational docs + read-only PMW`의 4층 runtime 구조를 기본값으로 유지한다. 이 runtime 구조는 `core / optional profile / project packet` 3층 activation 모델 위에서 동작한다.

## Truth Hierarchy And Conflict Rule
1. Governance Markdown truth: `.agents/artifacts/*.md`
2. Hot operational DB state: `.harness/operating_state.sqlite`
3. Generated operational docs: `.agents/runtime/generated-state-docs/*`
4. PMW read-only surface

Conflict rules:
- Governance Markdown wins over generated docs.
- DB hot-state must be reconciled to governance truth before gate close.
- Generated docs are never edited manually.
- PMW is never write authority.

## Repository Layout Ownership
- Harness runtime code lives under `.harness/runtime/*`.
- Harness tests live under `.harness/test/*`.
- Root `src/`, `app/`, `backend/`, `frontend/`, `server/`, and product test paths are free for downstream application code.
- Root `package.json` is a harness command wrapper unless a project intentionally extends it; Node.js 24+ is a harness runtime requirement only.
- The canonical layout contract is `reference/artifacts/REPOSITORY_LAYOUT_OWNERSHIP.md`.

## Activation Layers
- `Core`: 모든 복잡한 프로젝트에 공통인 operating contract, gate, validator, review boundary
- `Optional Profile`: 반복되는 프로젝트 유형에 대한 reusable rule set
- `Project Packet`: 실제 프로젝트의 데이터 모델, 화면, 환경 절차, acceptance를 닫는 layer

## Layer Activation Contract
- `Core`는 항상 활성이다. 별도 opt-in 없이 모든 프로젝트의 공통 contract로 적용한다.
- `Optional Profile`은 requirements의 `Active Profile Selection`, architecture의 active profiles 기록, 그리고 관련 task packet dependency가 모두 맞을 때만 활성이다.
- `Project Packet`은 project-specific 구현 합의가 담긴 실행 계층이며, 코드, migration, deploy/test/cutover, user-facing 확정은 active packet 없이 시작하지 않는다.
- activation precedence는 `Core -> Optional Profile -> Project Packet`이다. 상위 계층은 불변 조건을 주고, 하위 계층이 더 구체적인 결정을 닫는다.
- 같은 규칙을 `Core`와 하위 계층이 동시에 들고 있지 않는다. reusable contract는 위로, project detail은 아래로 내린다.

## Core Boundaries
- Hard Core State: repo-local DB for hot-state and AI-oriented operational metadata
- Context Canonical Docs: Markdown for goals, rationale, approvals, and human-readable operating context
- Projection and Generation: generated state docs / PMW read model
- PMW Read Surface: summary cards, detail panel, artifact viewer, settings
- Improvement Memory: recurring inefficiency records and promoted improvement tasks

## Non-Negotiable Rules
- hot-state와 반복 조회 운영 신호는 DB single write surface로 유지한다.
- context docs는 사람이 충분히 이해하고 승인할 수 있는 Markdown canonical truth로 유지한다.
- core에는 특정 도메인 스키마, 특정 기술스택, 특정 운영환경 절차를 기본값으로 넣지 않는다.
- active profile activation은 explicit해야 하며, 묵시적 dependency를 허용하지 않는다.
- 하나 이상의 active optional profile이 있으면 packet은 active profile references와 profile-specific evidence를 남겨야 한다.
- active optional profile이 둘 이상이면 packet은 profile composition rationale을 남기고, required evidence는 선언된 모든 profile의 합집합을 따른다.
- validator enforcement를 받는 concrete active packet instance는 `artifact_index`에 category `task_packet`으로 등록하고, validator는 declared status와 required evidence를 함께 검사한다.
- validator는 `reference/packets/` 아래의 current-contract concrete packet candidate를 canonical discovery 대상으로 보고, 미등록이거나 잘못된 category registration이면 fail-fast finding을 올려 silent bypass를 막는다.
- 계층 배치가 애매하면 `Core`로 올리지 말고 먼저 `Optional Profile` 또는 `Project Packet`으로 둔다.
- rough baseline 승인만으로 user-facing 기능과 UI를 코드에서 확정하지 않는다.
- data-impact 작업은 domain foundation reference와 schema impact 판단 없이 진행하지 않는다.
- data-impact packet은 domain foundation reference path와 schema impact classification을 반드시 남긴다.
- DB 설계가 포함된 data-impact 작업은 user-confirmed table / column / data operation plan 없이 진행하지 않는다.
- 기존 프로그램과 연동되는 data-impact 작업은 기존 DB schema 또는 동등한 authoritative schema artifact 요청과 compatibility analysis 없이는 packet을 닫지 않는다.
- authoritative source가 있는 작업은 source trace와 disposition 없이 닫지 않는다.
- authoritative source 영향이 있는 planning baseline과 packet은 authoritative source intake reference path와 disposition을 반드시 남긴다.
- source disposition이 `pending`이거나 conflict / implementation impact가 `unknown`이면 planning hold를 유지한다.
- 하나의 authoritative source wave가 여러 open packet에 영향을 주면 project-level impacted packet set을 `reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md`로 닫는다.
- multi-packet source wave packet은 `Impacted packet set scope`, `Authoritative source wave ledger reference`, `Source wave packet disposition`, `Shared-source wave status`를 함께 남기고, wave status가 `approved`가 아니면 `Ready For Code`로 올리지 않는다.
- user-facing packet은 UX archetype reference path, selected archetype, deviation status를 반드시 남긴다.
- selected archetype이 `unknown`이거나 deviation status가 `pending`이면 planning hold를 유지한다.
- deploy/test/cutover packet은 environment topology reference path, source environment, target environment, execution target, transfer boundary, rollback boundary를 반드시 남긴다.
- execution target이 `unknown`이거나 rollback boundary가 `unknown`이면 planning hold를 유지한다.
- packet closeout은 packet exit quality gate reference path, exit recommendation, residual debt disposition을 반드시 남긴다.
- source parity status 또는 validation / cleanup status가 `unknown`이거나 unresolved UX / topology / schema confusion이 남아 있으면 packet closeout hold를 유지한다.
- 반복 friction은 `.agents/artifacts/PREVENTIVE_MEMORY.md`에 target layer, promotion status, source evidence를 남긴다.
- `pending-review` improvement candidate는 baseline 문서나 starter template을 직접 바꾸지 않는다.
- 새 사용자 기획 문서는 즉시 최우선 authoritative source로 승격하고, 기존 안정성 유지는 반영 보류 근거가 되지 않는다.
- deploy/test/cutover 작업은 explicit execution target과 environment topology 없이 진행하지 않는다.
- PMW는 read-only다.
- high-risk change, cutover, security exception은 human approval boundary 없이 닫지 않는다.

## Required Reading Order
1. `AGENTS.md`
2. `.agents/rules/workspace.md`
3. `.agents/artifacts/CURRENT_STATE.md`
4. `.agents/artifacts/TASK_LIST.md`
5. current lane workflow
6. baseline artifacts required by the lane
7. active optional profile artifacts only when explicitly selected
8. active project packet and authoritative source artifacts
9. additional reference material only when cited by the active task

## Core Exclusion Examples
- 특정 프로젝트의 DB schema, 테이블명, 컬럼명
- 특정 제품의 screen copy, IA, one-off UX microcopy
- 특정 운영환경 host/path, 네트워크 절차, 반입 절차
- 특정 외부 시스템의 endpoint, field mapping, 수기 운영 step
- 특정 프로젝트의 acceptance 문장과 cutover checklist

## Standard Contracts

### Domain Foundation Gate
- 기본 reference surface는 `reference/artifacts/DOMAIN_CONTEXT.md` 또는 승인된 동등 artifact다.
- data-impact 작업 전에 핵심 엔티티/관계, lifecycle state/invariant, 기존 시스템 source-of-truth, schema impact, migration/rollback boundary, open question을 먼저 닫는다.
- DB 설계는 항상 사용자 confirmation 항목이며, table / column / data operation plan은 explicit sign-off 없이 `Ready For Code`로 올리지 않는다.
- 작업이 기존 프로그램 또는 기존 운영 프로세스와 연동되면 기존 DB schema 또는 동등한 authoritative schema artifact를 사용자에게 요청하고, table name / column name / data operation / ownership / migration compatibility 분석을 packet에 남기기 전에는 planning hold를 유지한다.
- data-impact packet은 domain foundation reference path, existing schema artifact status, schema impact classification을 함께 인용해야 한다.
- schema impact classification이 `unknown`이면 planning hold를 유지한다.

### Authoritative Source Contract
- 외부 기획, 정책, 절차, 연동 명세는 authoritative source로 등록하고 trace와 disposition을 유지한다.
- 기본 reference surface는 `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md` 또는 승인된 동등 artifact다.
- 새 사용자 기획 문서는 requirements / architecture / implementation / active packet sync에 즉시 영향을 주는 최우선 authoritative source다.
- source intake는 source summary, authoritative reason, affected baseline artifacts, 기존 기획/승인된 packet/현재 구현과의 충돌, 필요한 재작업, 영향 범위를 분석해 보고해야 한다.
- 기존 구현의 안정적 유지 자체는 신규 기획 반영을 미루거나 낮추는 근거가 될 수 없고, 기본 원칙은 완전 반영이며 예외는 사용자 명시 승인으로만 둔다.
- planning baseline과 active packet은 authoritative source intake reference path와 `implemented / deferred / rejected-with-reason / pending` disposition을 함께 인용해야 한다.
- source disposition이 `pending`이거나 current implementation impact가 `unknown`이면 planning hold를 유지한다.

### Shared-Source Rebaseline Control
- 기본 reference surface는 `reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md` 또는 승인된 동등 artifact다.
- 하나의 authoritative source wave가 여러 open packet에 동시에 영향을 주면 intake artifact만으로 닫지 않고, project-level impacted packet set과 packet별 rebaseline 상태를 source wave ledger에 기록한다.
- source wave ledger는 source summary의 재진술이 아니라, 어떤 packet이 reopen / adjust / continue / close candidate인지와 stale subset이 없는지 project-level로 통제하는 canonical control이다.
- multi-packet source wave packet은 `Impacted packet set scope`, `Authoritative source wave ledger reference`, `Source wave packet disposition`, `Shared-source wave status`를 함께 남겨야 한다.
- `Impacted packet set scope`가 `multi-packet`이면 `Shared-source wave status`는 `approved`가 되기 전까지 planning hold를 유지한다.
- packet이 인용한 source wave ledger row와 packet path / disposition이 일치하지 않으면 validator finding으로 올린다.

### Admin Grid Application Profile
- 기본 reference surface는 `reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md` 또는 승인된 동등 artifact다.
- 이 profile은 primary user가 내부 운영자/관리자이고, dense record list를 search/filter/sort하면서 row action, detail view, bulk operation을 반복 수행하는 제품 유형에만 opt-in으로 활성화한다.
- active packet은 `Active profile references`, `Primary admin entity / surface`, `Grid interaction model`, `Search / filter / sort / pagination behavior`, `Row action / bulk action rule`, `Edit / save pattern`, `Profile deviation / exception`을 함께 남겨야 한다.
- profile은 grid-first information hierarchy, explicit filter/sort control, row detail pairing, bulk mutation safety, audit/feedback expectation 같은 reusable bias만 제공한다.
- 실제 column set, permission matrix, export/report format, one-off workflow branch, entity-specific terminology는 project packet에 남긴다.
- profile reference나 required grid evidence가 비어 있으면 admin-grid user-facing planning은 hold를 유지한다.

### Authoritative Spreadsheet Source Profile
- 기본 reference surface는 `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md` 또는 승인된 동등 artifact다.
- 이 profile은 spreadsheet가 단순 참고자료가 아니라 planning, field mapping, backlog, operational source-of-truth의 authoritative input surface일 때만 opt-in으로 활성화한다.
- active packet은 `Active profile references`, `Source spreadsheet artifact`, `Workbook / sheet / tab / range trace`, `Header / column mapping`, `Row key / record identity rule`, `Source snapshot / version`, `Transformation / normalization assumptions`, `Reconciliation / overwrite rule`, `Profile deviation / exception`을 함께 남겨야 한다.
- profile은 workbook/sheet traceability, header-to-field mapping, snapshot/version discipline, transformation assumption disclosure, reconciliation boundary 같은 reusable source-governance bias만 제공한다.
- 실제 workbook name, tab layout, formula logic, import script, business-specific translation table, project column set은 project packet 또는 project artifact에 남긴다.
- profile reference나 required spreadsheet trace evidence가 비어 있으면 spreadsheet-backed authoritative source planning은 hold를 유지한다.

### Airgapped Delivery Profile
- 기본 reference surface는 `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md` 또는 승인된 동등 artifact다.
- 이 profile은 transfer boundary가 `airgapped`이거나 반복적으로 manual-transfer / removable-media / offline bundle handoff가 필요한 delivery work일 때만 opt-in으로 활성화한다.
- active packet은 `Active profile references`, `Transfer package / bundle artifact`, `Transfer medium / handoff channel`, `Checksum / integrity evidence`, `Offline dependency bundle status`, `Ingress verification / import step`, `Rollback package / recovery bundle`, `Manual custody / operator handoff`, `Profile deviation / exception`을 함께 남겨야 한다.
- profile은 bundle discipline, integrity verification, custody handoff, offline dependency completeness, ingress validation, rollback bundle readiness 같은 reusable transfer-governance bias만 제공한다.
- 실제 host/path, removable-media handling step, site-specific operator runbook, custom import script, one-off rollback command는 project packet 또는 project artifact에 남긴다.
- profile reference나 required airgapped transfer evidence가 비어 있으면 transfer-bound delivery planning은 hold를 유지한다.

## Work Packet Extensions
- packet은 필요 시 `layer classification`, `domain foundation reference`, `authoritative source refs`, `authoritative source intake reference`, `source disposition`, `impacted packet set scope`, `authoritative source wave ledger reference`, `source wave packet disposition`, `shared-source wave status`, `active profile dependencies`, `active profile references`, `profile composition rationale`, `profile-specific evidence status`, `profile deviation / exception`, `UX archetype reference`, `selected UX archetype`, `UX deviation status`, `environment topology reference`, `source environment`, `target environment`, `execution target`, `transfer boundary`, `rollback boundary`, `packet exit quality gate reference`, `packet exit decision`, `residual debt disposition`, `deferred follow-up item`, `planning conflict / implementation impact`, `existing system schema refs`, `DB naming/operation compatibility analysis`, `user DB design confirmation status`, `required reading before code`를 함께 남길 수 있어야 한다.
- 한 packet은 필요하면 둘 이상의 optional profile을 동시에 선언할 수 있고, validator-required evidence는 declared profile set의 합집합을 따른다.
- validator enforcement를 받는 concrete active packet instance는 `artifact_index`에 category `task_packet`으로 등록하고, validator는 해당 packet file의 declared status와 required evidence를 함께 검사한다.
- `reference/packets/` 아래의 current-contract concrete packet candidate는 registration missing이나 wrong-category registration 상태로 남아 있으면 validator error가 된다.
- `PRF-01` active packet은 추가로 `primary admin entity / surface`, `grid interaction model`, `search / filter / sort / pagination behavior`, `row action / bulk action rule`, `edit / save pattern`을 남길 수 있어야 한다.
- `PRF-02` active packet은 추가로 `source spreadsheet artifact`, `workbook / sheet / tab / range trace`, `header / column mapping`, `row key / record identity rule`, `source snapshot / version`, `transformation / normalization assumptions`, `reconciliation / overwrite rule`을 남길 수 있어야 한다.
- `PRF-03` active packet은 추가로 `transfer package / bundle artifact`, `transfer medium / handoff channel`, `checksum / integrity evidence`, `offline dependency bundle status`, `ingress verification / import step`, `rollback package / recovery bundle`, `manual custody / operator handoff`을 남길 수 있어야 한다.

## Drift And Validator Contract
- drift validator는 DB truth, generated docs, designated summary mismatch를 탐지하고 stale 상태를 올린다.
- follow-up validator는 reusable packet/profile contract marker뿐 아니라 `task_packet`으로 등록된 concrete active packet instance의 required evidence 누락과 declared status mismatch도 탐지해야 한다.
- same validator는 `reference/packets/`의 current-contract concrete packet candidate가 registration 없이 존재하는 경우도 별도 finding으로 올려 packet hold rule의 silent bypass를 차단해야 한다.
- same validator는 multi-packet authoritative source wave에서 packet이 cited source wave ledger에 실제로 포함되는지와 packet disposition이 ledger row와 일치하는지도 검사해야 한다.
- reusable validator scope가 바뀌면 starter template의 대응 code, test, packet guidance도 같은 lane에서 함께 갱신한다.

### Product UX Archetype Contract
- 기본 reference surface는 `reference/artifacts/PRODUCT_UX_ARCHETYPE.md` 또는 승인된 동등 artifact다.
- user-facing 기능은 제품 archetype 선언과 deviation rule 위에서 구현한다.
- UX archetype reference는 primary user, product mode, information hierarchy, interaction/default layout bias, allowed deviation, approval boundary를 정리해야 한다.
- active packet은 UX archetype reference path, selected archetype, deviation status를 함께 인용해야 한다.
- selected archetype이 `unknown`이거나 deviation status가 `pending`이면 planning hold를 유지한다.
- archetype contract는 core에서 catalog와 deviation rule만 제공하고, 반복 유형의 deeper package는 optional profile로, 실제 화면 구조와 문구는 project packet으로 내린다.

### Environment Topology Contract
- 기본 reference surface는 `reference/artifacts/DEPLOYMENT_PLAN.md` 또는 승인된 동등 artifact다.
- deploy/test/cutover 작업은 source environment, target environment, execution target, execution owner, transfer boundary, rollback boundary, verification gate를 명시한다.
- active packet은 environment topology reference path, source environment, target environment, execution target, transfer boundary, rollback boundary를 함께 인용해야 한다.
- execution target이 `unknown`이거나 rollback boundary가 `unknown`이면 planning hold를 유지한다.
- core는 topology contract와 approval boundary만 제공하고, 반복되는 폐쇄망/반입 절차는 optional profile로, 특정 host/path/operator step은 project packet으로 내린다.

### Packet Exit Quality Gate
- 기본 reference surface는 `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md` 또는 승인된 동등 artifact다.
- packet exit quality gate는 implementation delta summary, source parity check, residual debt / refactor disposition, UX / topology / schema conformance result, validation / security / cleanup evidence, deferred follow-up item을 정리해야 한다.
- active packet은 packet exit quality gate reference path, exit recommendation, residual debt disposition, deferred follow-up item을 함께 인용해야 한다.
- source parity status 또는 validation / cleanup status가 `unknown`이거나 unresolved UX / topology / schema confusion이 남아 있으면 packet closeout hold를 유지한다.
- core는 closeout criteria와 decision shape만 제공하고, project-specific bug list나 one-off cleanup step은 packet 또는 project artifact에 남긴다.

### Improvement Promotion Loop
- canonical live surface는 `.agents/artifacts/PREVENTIVE_MEMORY.md`다.
- AI는 반복 friction을 active preventive rule 또는 promotion candidate로 기록할 수 있지만, baseline 문서나 SOP를 직접 바꾸지 않는다.
- promotion candidate는 issue pattern, why it matters, proposed target layer, target artifact / follow-up item, promotion status, human review boundary, source / evidence를 남겨야 한다.
- target layer가 `unknown`이거나 promotion status가 `pending-review`이면 candidate는 참고 메모로만 남고 starter나 baseline을 바꾸지 않는다.
- 승인된 promotion만 core/profile/project follow-up item으로 승격하고, note-only 또는 rejected disposition은 이유와 함께 preventive memory에 남긴다.
- core는 loop와 classification rule만 제공하고, 실제 incident narrative는 preventive memory 또는 project packet에 남긴다.

## Deferred By Default
- PMW write boundary
- dense analytics wall
- downstream rollout
- remote sync or multi-user coordination

## Active Profiles And Exceptions
- Active profiles: [fill or none]
- Approved exceptions: [fill or none]
