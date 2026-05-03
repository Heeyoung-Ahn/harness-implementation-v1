# Requirements

## Summary
이 프로젝트의 목표는 하네스가 스스로 유지·개선 가능한 운영 구조를 가지면서, 최종사용자가 PMW 첫 화면과 핵심 아티팩트만으로 현재 판단 지점을 빠르게 이해할 수 있게 하는 것이다. `.agents/artifacts/REQUIREMENTS.md`는 전체 문서 중 가장 사용자 친화적인 기준 문서로 유지한다.

2026-04-22 기준 first-ship standardized harness baseline은 release-ready로 닫혀 있다. 현재 follow-up 방향은 특정 프로젝트 사례를 core에 박아 넣지 않고, 복잡한 프로젝트에서 반복되는 실패 패턴을 `core / optional profile / project packet` 3층 구조로 일반화하는 것이다.

2026-04-26 현재 `PLN-06`은 닫혔고, 2026-04-27 기준 V1.2 baseline is implemented: `standard-template/`은 installable project generator payload이고 PMW는 별도 installable multi-project app으로 분리되어 있다. 추가 hardening으로 lightweight web/app, Android native app, Node/frontend web app이 표준 profile로 포함된다.

2026-04-27 기준 `PLN-07` V1.3 planning direction is approved: PMW는 독립 설치형 복수 프로젝트 operator console로 유지되며, 상태/아티팩트 조회 surface는 기본적으로 read-only지만 선택된 프로젝트에 대해 승인된 하네스 명령 catalog를 launch하고 결과를 보여줄 수 있다. 동시에 workflow Markdown은 explicit agent-role contract로 강화된다.

## Project Goal

### 추진목적
1. hot-state 변경은 하나의 write surface만 수정하게 만든다.
2. PMW에서 파일 탐색 없이 필요한 artifact를 읽게 만든다.
3. user-facing 정보와 technical context를 같은 canonical 문서 안에서 계층적으로 분리한다.
4. 하네스가 운영 중 비효율을 기록하고, 누적되면 스스로 개선 과제로 승격할 수 있게 만든다.
5. PMW의 상태/아티팩트 조회 surface는 read-only 기본값을 유지하면서도, 승인된 로컬 하네스 명령 launch boundary와 canonical write authority boundary를 명확히 분리한다.
6. 복잡한 프로젝트에서 반복되는 실패 패턴을 표준 계약과 게이트로 흡수한다.
7. 특정 도메인, 특정 기술스택, 특정 운영환경 편향 없이 재사용 가능한 표준 하네스를 유지한다.
8. Excel/VBA-MariaDB 기반 legacy 업무시스템 대체 프로젝트에서 source intake, schema compatibility, migration/reconciliation, approval/audit gate를 누락하지 않게 만든다.
9. 하네스 runtime이 제품 코드 경로와 충돌하지 않게 하여 실제 프로젝트가 `src/`, `app/`, `backend/`, `frontend/`, `server/` 등 원하는 구조를 선택할 수 있게 한다.
10. OMX 같은 외부 실행 오케스트레이터 없이도 환경 점검, 현재 상태 설명, 다음 행동 추천, validation report 저장을 자체 제공한다.
11. 표준 하네스 설치기는 프로젝트명/폴더/profile을 받아 새 repo를 만들고 PMW registry까지 연결한다.
12. PMW는 표준 하네스와 분리된 installable multi-project operator console로 운영하되, canonical write authority는 갖지 않는다.

### 기대효과
1. 상태 변경 시 수정 비용과 정합도 유지 비용을 줄인다.
2. 최종사용자가 첫 화면에서 지금 판단해야 할 내용과 다음 행동을 빠르게 이해한다.
3. AI는 데이터베이스 기반의 구조화된 상태를 더 쉽게 이해하고, 사람은 Markdown 기반의 설명과 맥락을 더 쉽게 검토한다.
4. 개발 완료 단위마다 리팩터링과 보안 점검을 포함해 누적 품질 저하를 줄인다.
5. 중도 스키마 혼란, source 누락, 환경 혼선, 제품 성격과 맞지 않는 UI drift를 표준 운영 규칙으로 줄인다.
6. 기존 Excel/VBA/MariaDB 운영 로직이 새 웹앱 설계에 빠지거나 잘못 해석되는 위험을 source inventory와 reconciliation gate로 줄인다.
7. starter를 복사한 프로젝트가 하네스 소스와 제품 소스를 혼동하지 않고 바로 실무 kickoff를 시작할 수 있다.

### 최종사용자
- PMW 첫 화면에서 현재 판단 지점과 운영 상태를 빠르게 읽어야 하는 사용자
- 하네스를 유지·개선하는 AI 에이전트
- 승인, 리뷰, 운영 맥락을 관리하는 사람 운영자
- Excel/VBA-MariaDB 기반 기존 업무시스템을 웹앱으로 대체하려는 프로젝트 PM, 기획자, 개발자, 현업 승인자

## Closed PLN-06 Requirements
- `PLN-06` authoritative planning source: `reference/planning/PLN-06_STANDALONE_BUSINESS_HARNESS_V1_1.md`
- `PLN-06` goal: finish all essential V1.1 standalone business-system harness readiness in one lane.
- `PLN-06` target project class: budget management, asset management, corporate accounting management, and similar internal business systems currently operated with Excel/VBA and MariaDB.
- `PLN-06` implementation status: closed on 2026-04-26 after requirements approval, implementation packet execution, root/starter verification, validation report persistence, and review closeout.
- `PLN-06` core boundary: do not add project-specific budget/accounting/asset schema, screen names, account mappings, approval chains, or operating policies to core.
- `PLN-06` required deliverables: repository layout ownership, harness/product code separation, standalone command UX, structured task truth, truth hierarchy, legacy source intake profile, Python/Django backoffice profile, workflow/approval profile, validator/reporting hardening, starter synchronization, and review evidence.
- `PLN-06` essential boundary: P0/P1 readiness must close in this lane; P2 examples, CI templates, advanced PMW polish, semantic business-rule validation, and advanced migration automation may remain optional if they are not required to safely start the target projects.
- `PLN-06` command boundary: init/test/validate/PMW/migration/cutover preserve or wrap existing behavior; doctor/status/next/explain must provide useful working summaries; validation-report must persist Markdown and JSON artifacts.
- `PLN-06` validator boundary: must-fail checks, warn-acceptable checks, and document-only checks are defined in `reference/planning/PLN-06_STANDALONE_BUSINESS_HARNESS_V1_1.md` and must guide implementation priority.
- `PLN-06` sync boundary: reusable root changes must be classified as sync, root-only, generated, or starter-owned before closeout.
- `PLN-06` added contracts: workflow state vocabulary, command output contract, profile activation contract, and packet readiness contract.

## V1.2 Release Baseline
- V1.2 baseline is implemented and is no longer only an upgrade direction.
- `standard-template/` is the installable project-generator payload for new downstream repos.
- `installer/` builds the Windows setup flow that copies `standard-template/`, runs initialization, and registers the project with PMW.
- `pmw-app/` is a separate installable multi-project PMW app and is not embedded into downstream project runtime code.
- `packaging/` produces the installable release payloads and their directory labels must come from the shared release baseline constant.
- `reference/manuals/HARNESS_MANUAL.md` is the maintainer-approved integrated operator manual for the installable baseline.
- `PRF-07`, `PRF-08`, and `PRF-09` are part of the approved reusable profile catalog alongside `PRF-04`, `PRF-05`, and `PRF-06`.
- If a maintainer lane changes the installable payload, separate PMW behavior, packaging layout, or release manuals, the same lane must update root `.agents/artifacts/*`, `.harness/operating_state.sqlite`, generated state docs, validation report, and starter runtime guardrails before it can close.
- Release baseline labels must not be hardcoded independently across SSOT, DB state, manuals, packaging, and validator messages.

## V1.3 Approved Direction
- `PLN-07` is the active planning lane for the approved V1.3 direction.
- V1.3 must remain compatible with the existing truth contract, reusable root/starter sync model, separate PMW deployment architecture, and current approved profile catalog.
- PMW is an independently installable multi-project operator console.
- PMW project-status and artifact surfaces are read-only by default, and PMW is never the canonical write authority.
- PMW may launch an approved local harness command catalog for the selected project and display the resulting status, logs, and derived artifacts.
- Workflow Markdown files must be strengthened into explicit agent-role execution contracts without replacing the current lane/workflow structure.
- Explicit role naming is approved for workflow contracts: `Project Manager`, `Planner`, `Designer`, `Developer`, `Tester`, `Reviewer`, `Deployer`, `Documenter`.
- `Tester` workflow contract must verify scope and collect evidence without directly fixing discovered defects; remediation must hand off to `Developer`.
- `Planner` workflow contract must define scope, constraints, acceptance, and approval boundaries without starting implementation before approval.
- Handoff records must remain the canonical baton between lanes, sessions, and agents, and PMW must surface latest handoff, next owner, next task, handoff route, and required SSOT.
- V1.3 phase-1 PMW launcher scope is approved as:
  - `status`
  - `next`
  - `explain`
  - `validate`
  - `handoff`
  - `pmw-export`
- V1.3 phase-1 terminal-only guided commands are:
  - `doctor`
  - `test`
  - `validation-report`
- Phase-1 PMW command execution policy is:
  - execution is always scoped to the selected project
  - one command at a time per project
  - PMW command result logs are session-scoped
- `handoff` in V1.3 is not guidance-only; it is approved to launch the next workflow selected by the approved routing rules.
- `OPS-03` is the active follow-up direction for harness operation reliability: reduce repeated state-sync friction, prevent approval-state/SSOT drift after interruptions, sufficiently integrate the attached Karpathy-style agent behavior guidance, make human-and-Planner-approved project design SSOT the guiding instruction layer for all agents, and improve PMW access to whole-project design artifacts without weakening packet-before-code, human approval, PMW read-only authority, generated-doc immutability, Tester/Reviewer separation, or root/starter synchronization.
- Human-and-Planner-approved project design SSOT guides every downstream agent: Developer implements according to it, Tester verifies implementation against it, and Reviewer checks source parity/evidence/residual debt against it.
- PMW Artifact Library must keep whole-project design and overview artifacts always discoverable in one stable category, including `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, and approved equivalents. The artifact body reading area must be wide enough for long design documents to be read comfortably.

## Layer Model
- `Core`: 모든 복잡한 프로젝트에 공통으로 필요한 표준 계약, 게이트, validator enforcement
- `Optional Profile`: 특정 프로젝트 유형에서 반복되는 패턴을 재사용 가능한 확장으로 제공
- `Project Packet`: 실제 프로젝트의 엔티티, 화면, 연동, 배포 절차, acceptance를 구체적으로 닫는 계층

## Layer Activation Contract
- `Core`는 모든 프로젝트에서 기본 활성 계층이다.
- `Optional Profile`은 실제 반복 유형이 확인되고, `Active Profile Selection`에 하나 이상 명시되며, 관련 packet 또는 downstream artifact가 그 dependencies를 다시 적을 때만 활성화한다.
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
1. 맥락 유지: 하네스는 세션, 역할, 턴이 바뀌어도 현재 상태와 판단 근거를 복원할 수 있어야 한다. 상태 변경은 source trace와 함께 남고, handoff와 generated docs는 맥락 복원을 돕는 방향으로 유지한다.
2. SOP 준수: 승인된 workflow, gate, validation rule, cutover sequence는 임의로 우회하지 않는다. SOP 변경이 필요하면 requirements 또는 architecture 수준 변경으로 올린다.
3. human in the loop: requirements freeze, architecture sync, mockup approval, cutover, security risk acceptance 같은 핵심 판단은 사람 승인 지점을 명시적으로 둔다.
4. decision-ready authoring: 결정 요청 문서는 사용자가 raw trade-off를 다시 해석하지 않게, `최대한 쉽게` 읽히면서도 `충분한 근거`를 함께 제공하는 형식으로 작성한다.
5. progressive elaboration: 최초 requirements, architecture, implementation plan, UI design은 러프한 기준선일 수 있지만, 실제 작업 단위에 들어갈 때는 더 구체적인 task-level planning과 design agreement를 거쳐야 한다.
6. layered standardization: core는 모든 프로젝트에 공통인 계약만 포함하고, 반복 유형은 profile로 분리하며, 프로젝트 고유 내용은 project packet으로만 닫는다.
7. authoritative source: 외부에서 주어진 기획, 정책, 연동, 규정 문서는 권위 있는 입력으로 등록하고 추적 가능해야 한다.
8. legacy integration safety: 기존 프로그램과 연동되는 data-impact 작업은 기존 스키마와 운영 프로세스를 확인하고, 테이블명/컬럼명/데이터 운영 방식 차이로 운영 이슈가 생기지 않도록 사용자 승인 기반으로 설계한다.
9. planning precedence: 새 사용자 기획 문서를 받으면 requirements, architecture, implementation, active packet에 즉시 영향 평가를 걸고, 기존 구현의 안정적 유지보다 신규 기획의 완전 반영을 우선한다.
10. environment clarity: deploy, test, cutover 성격의 작업은 source 환경, target 환경, 실행 주체, rollback 경계를 명시해야 한다.
11. deployable template sync: 표준 하네스의 재사용 가능한 baseline이 바뀌면 `standard-template/`의 대응 자산도 같은 lane 안에서 함께 갱신되어야 하며, 템플릿 sync가 빠진 상태를 완료로 보지 않는다.

## Authoring And Approval Workflow
1. `.agents/artifacts/REQUIREMENTS.md` 작성은 구현에 필요한 이슈, 제약, 승인 기준, 보안 기대치가 닫히거나 명시적으로 deferred 될 때까지 deep interview를 진행한다.
2. 사용자의 최종 확정 전에는 `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/artifacts/UI_DESIGN.md`를 새 기준선으로 작성하거나 sync하지 않는다.
3. requirements 확정 후에만 architecture, implementation, UI 문서를 같은 turn에서 같은 기준선으로 정렬한다.
4. requirements 변경이 core/profile/project 구분에 영향을 주면 downstream 문서와 active lane도 같은 변경 범위 안에서 다시 맞춘다.
5. 디자인 목업은 시각 참고 자료가 아니라 실제 구현 로직, source-to-surface mapping, 상태 전이, read-only 경계를 반영하는 설계 입력물이어야 한다.
6. 사용자가 결정을 내려야 하는 packet은 최소한 `권장 결론`, `핵심 근거`, `조정이 필요한 조건`, `defer 시 임시 규칙`을 함께 보여 준다.
7. 각 구현 작업은 코드 착수 전에 task-level packet으로 다시 구체화한다. 이 packet에는 작업 목표, 범위, 상세 동작, 화면/상태 변화, edge case, acceptance, human check point가 포함되어야 한다.
8. 특히 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`는 task-level 상세 기획과 상세 디자인에 대해 인간과 협의 또는 승인 없이 코드로 먼저 확정하지 않는다.
9. data-impact 작업은 `reference/artifacts/DOMAIN_CONTEXT.md` 또는 동등한 approved domain foundation reference, schema impact 판단, migration/rollback 영향 정리 없이 `Ready For Code`로 올리지 않는다.
10. DB 설계가 포함된 data-impact 작업은 테이블명, 컬럼명, 데이터 운영 방식에 대한 사용자 확인 없이 `Ready For Code`로 올리지 않는다.
11. 작업이 기존 프로그램과 연동되면 사용자에게 기존 프로그램 DB schema 또는 동등한 authoritative schema artifact를 요청하고, naming / data operation / ownership / migration compatibility 분석을 packet에 남기기 전에는 설계를 닫지 않는다.
12. deploy/test/cutover 작업은 explicit execution target과 environment topology 없이 `Ready For Code`로 올리지 않는다.
13. 새 사용자 기획 문서를 접수하면 이를 최우선 authoritative source로 등록하고 requirements, architecture, implementation, active packet에 즉시 영향 범위를 재평가한다.
14. 신규 기획 문서는 기존 기획, 승인된 packet, 현재 구현과의 충돌과 재작업 범위를 분석해 보고하며, 기존 구현의 안정적 유지보다 신규 기획의 완전 반영을 우선한다.
15. authoritative source를 가진 작업은 source trace와 `implemented / deferred / rejected-with-reason` disposition 없이 close하지 않는다.
16. domain foundation reference에는 최소한 핵심 엔티티/관계, lifecycle state/invariant, 기존 시스템 source-of-truth, schema impact class, migration/rollback boundary, open question이 포함되어야 한다.
17. data-impact 작업의 schema impact가 `unknown`이면 planning hold를 유지하고 설계 또는 구현으로 넘기지 않는다.
18. authoritative source 영향이 있는 작업은 `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md` 또는 동등한 approved source intake reference 없이 planning baseline이나 packet을 새 기준선으로 sync하지 않는다.
19. source intake reference에는 최소한 source summary, authoritative reason, affected baseline artifacts, conflict summary, current implementation impact, required rework / defer, recommended disposition이 포함되어야 한다.
- 한 authoritative source change가 여러 open packet에 동시에 영향을 주면 `reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md` 또는 동등한 approved source-wave ledger를 함께 열어 impacted packet set과 rebaseline 상태를 project-level로 닫는다.
- multi-packet source wave에 들어간 packet은 `Impacted packet set scope`, `Authoritative source wave ledger reference`, `Source wave packet disposition`을 함께 남기기 전에는 `Ready For Code`로 올리지 않는다.
20. 새 사용자 기획 문서의 partial incorporation, defer, rejection은 명시적인 사용자 승인과 이유 기록 없이는 허용하지 않는다.
21. user-facing 작업은 `reference/artifacts/PRODUCT_UX_ARCHETYPE.md` 또는 동등한 approved UX archetype reference 없이 `Ready For Code`로 올리지 않는다.
22. UX archetype reference에는 최소한 primary user, product mode, information hierarchy, interaction/default layout bias, allowed deviation, approval boundary가 포함되어야 한다.
23. user-facing packet의 selected UX archetype이 `unknown`이거나 deviation status가 `pending`이면 planning hold를 유지한다.
24. deploy/test/cutover 작업은 `reference/artifacts/DEPLOYMENT_PLAN.md` 또는 동등한 approved environment topology reference 없이 `Ready For Code`로 올리지 않는다.
25. environment topology reference에는 최소한 source environment, target environment, execution target, execution owner, transfer boundary, rollback boundary, verification gate가 포함되어야 한다.
26. deploy/test/cutover packet의 execution target 또는 rollback boundary가 `unknown`이면 planning hold를 유지한다.
27. 구현이 끝난 packet은 `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md` 또는 동등한 approved packet closeout reference 없이 완료 또는 close 상태로 올리지 않는다.
28. packet exit quality gate reference에는 최소한 implementation delta summary, source parity check, residual debt / refactor disposition, UX / topology / schema conformance result, validation / security / cleanup evidence, deferred follow-up item이 포함되어야 한다.
29. source parity status 또는 validation / cleanup status가 `unknown`이거나 unresolved UX / topology / schema confusion이 남아 있으면 packet closeout hold를 유지한다.
30. 반복되는 process / quality friction은 `.agents/artifacts/PREVENTIVE_MEMORY.md`에 trigger, impact, evidence, proposed target layer(`core / optional profile / project packet / note-only`)와 함께 기록한다.
31. improvement candidate는 explicit human review로 promotion status와 target layer가 닫히기 전에는 baseline 문서, starter template, SOP를 직접 바꾸지 않는다.
32. target layer가 `unknown`이거나 promotion status가 `pending-review`인 candidate는 개선 메모로만 남기고, 승인된 core/profile/project follow-up item으로 간주하지 않는다.
33. `PRF-01`이 활성화된 grid-heavy administrative application 작업은 `reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md` 또는 동등한 approved admin-grid profile reference 없이 `Ready For Code`로 올리지 않는다.
34. `PRF-01` active packet은 최소 `Active profile reference`, `Primary admin entity / surface`, `Grid interaction model`, `Search / filter / sort / pagination behavior`, `Row action / bulk action rule`, `Edit / save pattern`, `Profile deviation / exception`을 남긴다.
35. project-specific grid column set, permission matrix, export/report format, one-off admin workflow는 `PRF-01` profile 기본값으로 승격하지 않고 project packet에 둔다.
36. `PRF-02`가 활성화된 spreadsheet-backed authoritative source 작업은 `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md` 또는 동등한 approved spreadsheet-source profile reference 없이 `Ready For Code`로 올리지 않는다.
37. `PRF-02` active packet은 최소 `Active profile reference`, `Source spreadsheet artifact`, `Workbook / sheet / tab / range trace`, `Header / column mapping`, `Row key / record identity rule`, `Source snapshot / version`, `Transformation / normalization assumptions`, `Reconciliation / overwrite rule`, `Profile deviation / exception`을 남긴다.
38. project-specific workbook name, tab structure, formula detail, column set, import script, business-specific translation rule은 `PRF-02` profile 기본값으로 승격하지 않고 project packet에 둔다.
39. `PRF-03`이 활성화된 transfer-bound 또는 airgapped delivery 작업은 `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md` 또는 동등한 approved airgapped-delivery profile reference 없이 `Ready For Code`로 올리지 않는다.
40. `PRF-03` active packet은 최소 `Active profile reference`, `Transfer package / bundle artifact`, `Transfer medium / handoff channel`, `Checksum / integrity evidence`, `Offline dependency bundle status`, `Ingress verification / import step`, `Rollback package / recovery bundle`, `Manual custody / operator handoff`, `Profile deviation / exception`을 남긴다.
41. project-specific host/path, removable-media 절차, site operator step, custom import script, one-off rollback runbook detail은 `PRF-03` profile 기본값으로 승격하지 않고 project packet에 둔다.
42. `PRF-04`가 활성화된 legacy Excel/VBA-MariaDB replacement 작업은 workbook inventory, workbook/sheet/range/header mapping, VBA module/macro/function inventory, MariaDB schema snapshot, operator step, import/export/report path, source-of-truth ownership, migration/reconciliation, parallel-run evidence 없이 `Ready For Code`로 올리지 않는다.
43. `PRF-05`가 활성화된 Python/Django backoffice 작업은 product source root, Python/Django version policy, supported-version/security-support rationale, dependency manager, app/module boundary, settings/environment policy, migration policy, DB compatibility, service/transaction boundary, auth/permission/admin boundary, background job boundary, test convention 없이 `Ready For Code`로 올리지 않는다.
44. `PRF-06`이 활성화된 workflow/approval application 작업은 state machine, approval rule matrix, role/permission matrix, audit event spec, exception/rollback/reopen rule 없이 `Ready For Code`로 올리지 않는다.
45. `PRF-07`이 활성화된 lightweight web/app 작업은 product source root, runtime/framework, rendering/app mode, data persistence boundary, auth/user identity, deployment target, external API/integration boundary, lightweight acceptance 없이 `Ready For Code`로 올리지 않는다.
46. `PRF-08`이 활성화된 Android native app 작업은 product source root, package namespace, Kotlin/Java policy, Gradle/AGP version, minSdk/targetSdk, signing policy, build variants/flavors, permissions, local storage, network/API boundary, navigation, offline/sync, notification, privacy/data policy, device/emulator test plan, release channel 없이 `Ready For Code`로 올리지 않는다.
47. `PRF-09`가 활성화된 Node/frontend web app 작업은 product source root, package ownership policy, Node.js product runtime policy, package manager, framework/bundler, build command, test command, environment variable policy, API/backend boundary, static asset/routing policy, deployment target 없이 `Ready For Code`로 올리지 않는다.
47. lightweight profile은 실제 legacy replacement, workflow/approval, data migration, regulated/audit-heavy, or mobile release requirements를 숨기는 용도로 쓰지 않는다. 그런 요구가 생기면 stronger profile을 추가하고 packet을 rebaseline한다.
48. Android signing secrets, keystore paths, store account details, package-specific namespace, and release-track details는 reusable profile 기본값이 아니라 secured project artifact 또는 project packet에 둔다.

## In Scope
- repo-local DB truth for hot-state and AI가 빠르게 이해해야 하는 운영 메타데이터
- 사람이 읽고 승인할 수 있는 Markdown canonical docs
- generated state docs
- PMW operator-console summary/detail/artifact viewer/settings
- PMW approved local harness command launcher and result-viewer surface
- workflow Markdown as explicit agent-role contract surface
- designated user-facing summary contract
- context restoration flow with explicit load order and source trace
- DB truth, generated docs, canonical summaries 간 drift detection and recovery rule
- standard harness의 `core / optional profile / project packet` 3층 구조
- data-impact 작업을 위한 domain foundation gate
- `reference/artifacts/DOMAIN_CONTEXT.md` 기반의 domain foundation artifact template
- 기존 프로그램 연동 작업의 DB schema intake, naming/data operation compatibility analysis, user DB design confirmation
- 외부 기획/정책/연동 입력을 위한 authoritative source contract
- `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md` 기반의 authoritative source intake artifact template
- `reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md` 기반의 shared-source rebaseline control artifact template
- 새 사용자 기획 문서의 conflict / implementation impact analysis와 re-planning rule
- user-facing 작업을 위한 product UX archetype contract
- `reference/artifacts/PRODUCT_UX_ARCHETYPE.md` 기반의 product UX archetype artifact template
- deploy/test/cutover 작업을 위한 environment topology contract
- `reference/artifacts/DEPLOYMENT_PLAN.md` 기반의 environment topology artifact template
- recurring inefficiency capture와 improvement backlog 운영
- 개발 완료 단위마다 수행하는 packet exit quality gate
- `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md` 기반의 packet closeout artifact template
- `.agents/artifacts/PREVENTIVE_MEMORY.md` 기반의 improvement memory and promotion candidate operation
- `reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md` 기반의 admin grid application optional profile package
- `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md` 기반의 authoritative spreadsheet source optional profile package
- `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md` 기반의 airgapped delivery optional profile package
- 코드와 스크립트, dependency, cutover 절차를 포함한 security review process
- validator / migration / cutover contract
- active profile과 required evidence를 함께 확인하는 profile-aware validator
- `PLN-06` standalone command UX: doctor, status, next, explain, validation-report
- `PLN-06` repository layout ownership contract separating harness-owned paths from project-owned product code paths
- `PLN-06` legacy Excel/VBA-MariaDB replacement profile and evidence requirements
- `PLN-06` Python/Django backoffice profile and evidence requirements
- `PLN-06` workflow/approval application profile and evidence requirements
- `PLN-06` task-list structured table contract and validator/reporting support
- `PLN-06` validation report persistence as operational evidence
- `PLN-06` workflow state vocabulary shared by live artifacts, DB, generated docs, PMW, and validator output
- `PLN-06` command output contract with exit code, human summary, findings, and next action
- `PLN-06` active profile declaration contract
- `PLN-06` packet readiness contract before `Ready For Code`

## Out of Scope
- 기존 코드 재사용
- PMW becoming canonical write authority
- arbitrary shell execution from PMW
- starter/downstream rollout
- separate user-only duplicate docs
- 외부 SaaS / remote sync
- 특정 도메인 스키마나 특정 제품 UI를 core 기본값으로 고정하는 것
- 특정 기술스택, 특정 DB, 특정 배포 구조를 core 기본값으로 고정하는 것
- project-specific delivery procedure를 표준 core contract로 승격하는 것
- OMX integration, `.omx` state, tmux/team runtime, MCP bridge, or external orchestration dependency
- budget-management-specific, asset-management-specific, or corporate-accounting-specific schema and policy details in core
- a mandatory `backend/frontend` product layout
- closing V1.1 with essential production-readiness work deferred to a later lane

## Acceptance
- deep interview가 구현 핵심 이슈를 닫거나, deferred 항목은 owner와 follow-up rule이 기록된다.
- 사용자가 결정을 내려야 하는 문서는 권장 결론과 충분한 근거를 함께 제공하고, 예외 조건과 defer fallback을 분리해 보여 준다.
- `.agents/artifacts/REQUIREMENTS.md`가 사용자 최종 확정된 뒤에만 architecture / implementation / UI baseline 문서가 작성되거나 재정렬된다.
- 최초 requirements, architecture, implementation plan, UI design은 러프 기준선으로 승인될 수 있지만, 이것만으로 세부 구현이 자동 승인된 것으로 간주하지 않는다.
- 하네스는 `core / optional profile / project packet` 구분을 유지하고, active profile selection을 명시적으로 기록한다.
- 한 concrete work item은 필요하면 둘 이상의 optional profile을 동시에 활성화할 수 있고, packet은 `Active profile dependencies`, `Active profile references`, `Profile composition rationale`를 남긴다.
- `Core`는 기본 활성, `Optional Profile`은 explicit-only, `Project Packet`은 project-specific 실행 전 필수라는 activation rule이 문서화된다.
- required reading rule이 baseline artifact, active profile, active packet, authoritative source 순서를 포함해 정의된다.
- `Core`에 넣으면 안 되는 project-specific 항목 예시와 분류 규칙이 정리된다.
- data-impact 작업은 `reference/artifacts/DOMAIN_CONTEXT.md` 또는 승인된 동등 artifact를 포함한 domain foundation reference, schema impact 판단, migration/rollback 영향 정리 없이 시작되지 않는다.
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
- `PRF-01` active packet에는 active profile references, primary admin entity / surface, grid interaction model, search / filter / sort / pagination behavior, row action / bulk action rule, edit / save pattern, profile deviation / exception이 정리된다.
- project-specific grid column set, permission matrix, export/report shape, one-off admin workflow는 `PRF-01` profile 기본값이 아니라 project packet detail로 남는다.
- `PRF-02`를 활성화한 spreadsheet-backed authoritative source 작업은 `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md` 또는 승인된 동등 artifact 경로를 packet에 남긴다.
- `PRF-02` active packet에는 active profile references, source spreadsheet artifact, workbook / sheet / tab / range trace, header / column mapping, row key / record identity rule, source snapshot / version, transformation / normalization assumptions, reconciliation / overwrite rule, profile deviation / exception이 정리된다.
- project-specific workbook/tab/formula/column/import/business translation detail은 `PRF-02` profile 기본값이 아니라 project packet detail로 남는다.
- `PRF-03`을 활성화한 transfer-bound 또는 airgapped delivery 작업은 `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md` 또는 승인된 동등 artifact 경로를 packet에 남긴다.
- `PRF-03` active packet에는 active profile references, transfer package / bundle artifact, transfer medium / handoff channel, checksum / integrity evidence, offline dependency bundle status, ingress verification / import step, rollback package / recovery bundle, manual custody / operator handoff, profile deviation / exception이 정리된다.
- project-specific host/path/removable-media 절차/site operator/custom import script/one-off rollback detail은 `PRF-03` profile 기본값이 아니라 project packet detail로 남는다.
- authoritative source가 있는 작업은 source trace와 disposition 상태 없이 완료되지 않는다.
- authoritative source 영향이 있는 planning baseline과 active packet은 source intake reference path와 disposition을 남긴다.
- source intake reference에는 conflict summary, current implementation impact, required rework / defer가 정리된다.
- source disposition이 `pending`이거나 current implementation impact가 `unknown`이면 planning hold가 유지된다.
- 한 authoritative source change가 여러 open packet에 영향을 주면 project-level source wave ledger가 열리고, impacted packet set과 rebaseline status가 packet별로 추적된다.
- multi-packet source wave에 속한 packet은 impacted packet set scope, authoritative source wave ledger reference, source wave packet disposition을 함께 남긴다.
- source wave ledger가 없는 multi-packet source wave나 stale packet subset을 남기는 parallel drift는 허용되지 않는다.
- 새 사용자 기획 문서를 받으면 requirements / architecture / implementation / active packet이 즉시 영향 평가를 받고, 기존 기획 및 현재 구현과의 충돌과 재작업 범위가 보고된다.
- 신규 기획 문서 반영 판단은 기존 안정성 유지보다 완전 반영을 우선하고, 예외는 사용자가 명시적으로 부분 반영을 승인한 경우에만 둔다.
- 신규 기획 문서의 partial incorporation / defer / rejection은 명시적인 사용자 승인과 이유 기록 없이는 허용되지 않는다.
- 각 구현 작업은 task-level 상세 기획과 필요한 경우 상세 화면 설계를 거쳐야 하며, 특히 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`는 인간 협의 또는 승인 후 구현된다.
- 하네스가 세션 전환 후에도 핵심 상태, 판단 근거, 다음 행동을 source trace와 함께 복원할 수 있다.
- context restoration은 최소 `release state -> open decisions/risks -> next action -> recent handoff -> source trace` 순서로 복원 가능해야 한다.
- 승인된 SOP와 실제 운영 절차가 일치하고, 예외는 기록된다.
- 사람 승인 지점이 필요한 단계에서 human in the loop가 빠지지 않는다.
- DB, generated docs, canonical summary 사이 drift는 validator가 감지하고 stale 상태를 표시하며, cutover 전에는 재생성 또는 rollback 경로가 명시된다.
- generated docs deterministic / parity pass
- 지정된 reviewer가 PMW first view만 보고 30초 안에 `무엇을 결정해야 하는지`, `무엇이 막고 있는지`, `다음에 무엇을 해야 하는지` 세 질문에 답할 수 있다.
- summary/detail/source trace/count parity pass
- raw technical prose direct projection 금지
- design mockup과 implemented UI가 같은 source-to-surface mapping과 concrete behavior contract를 공유한다.
- validator가 drift / missing source / mojibake / cutover mismatch를 검출한다.
- validator가 active profile 또는 core contract의 required evidence 누락을 검출할 수 있다.
  reusable contract marker뿐 아니라 `artifact_index`에 category `task_packet`으로 등록된 concrete active packet instance의 required evidence도 포함한다.
- 현재 standard packet contract marker를 가진 concrete packet이 `reference/packets/` 아래에 존재하면 validator는 그 packet을 canonical candidate로 발견해야 하고, `task_packet` registration이 없거나 category가 다르면 fail-fast 해야 한다.
- migration preview와 rollback path가 문서 / 스크립트 / 검증에서 일치한다.
- 각 개발 작업 단위 종료 시 packet exit quality gate 결과, refactor review, cleanup decision이 기록된다.
- release / cutover 전에 security review가 수행되고 critical finding이 남지 않는다.
- workflow Markdown contracts define explicit role naming, authority, non-authority, required SSOT, required outputs, handoff rules, and stop conditions.
- Every workflow turn-close report uses two user-facing blocks: `Current Work` for completed work, encountered issues, and decisions made; `Next Work` for the next workflow, concrete next work, expected issues/risks, and expected decisions/approval points.
- `Tester` workflow does not directly fix defects and instead hands remediation back to `Developer`.
- `Planner` workflow does not start implementation before approval.
- Human-and-Planner-approved project design SSOT is explicitly treated as the guiding instruction layer for all agent behavior.
- Developer, Tester, and Reviewer workflow contracts state their relationship to the approved project design SSOT: implement to it, verify against it, and review source parity/evidence against it.
- Karpathy-style guidance from the attached package is sufficiently reflected in reusable workflow/skill/manual guidance and coverage, including assumption disclosure, confusion management, tradeoff surfacing, warranted pushback, simplicity-first implementation, surgical edits, and goal-driven verification.
- PMW remains independently installable and supports multiple registered projects while exposing a selected-project command catalog boundary.
- PMW Artifact Library exposes a stable project-design/overview category with `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, and approved equivalent project-wide design artifacts, and the document body has enough width for practical long-form reading.
- V1.3 phase-1 PMW launcher scope and terminal-only guided command split are documented and enforced by the exported operator-command contract.
- improvement candidate는 human review를 거쳐야만 core/profile/project follow-up item 또는 baseline update로 승격된다.
- 재사용 가능한 표준 하네스 변경은 `standard-template/`의 대응 starter, code, test, reference 자산이 함께 갱신될 때만 완료로 본다.
- `PLN-06` requirements are explicitly approved before implementation starts.
- V1.1 keeps the harness standalone and does not require OMX or any external execution runtime.
- V1.1 does not reserve root `src/`, root `test/`, or root product package ownership in a way that blocks normal product source layouts.
- V1.1 can start a real Excel/VBA-MariaDB replacement project and force legacy workbook, VBA, MariaDB schema, operator workflow, migration, reconciliation, and rollback evidence before `Ready For Code`.
- V1.1 includes reusable Python/Django backoffice and workflow/approval profiles without embedding project-specific budget/accounting/asset details in core.
- V1.1 provides operator-facing doctor/status/next/explain/validation-report commands and persists validation evidence.
- V1.1 implements the `PLN-06` must-fail validator items and documents any warn-only or document-only items according to the enforcement table.
- V1.1 provides a sync classification for changed root/starter files and passes root/starter sync validation for reusable assets.
- V1.1 defines stable workflow states and uses them consistently in new or updated status/next/explain surfaces.
- V1.1 blocks `Ready For Code` for packets missing product source root, active profile evidence, required legacy/Django/workflow evidence, testable acceptance, or unresolved `unknown` data-impact classification.
- V1.1 root and `standard-template/` are synchronized and verified before the lane closes.
- V1.1 closeout review confirms no essential readiness requirement from `reference/planning/PLN-06_STANDALONE_BUSINESS_HARNESS_V1_1.md` was deferred.

## PLN-00 Decision Baseline
- Minimal DB start scope: `approve`
  `release_state`, `work_item_registry`, `decision_registry`, `gate_risk_registry`, `handoff_log`, `artifact_index`, `generation_state` 7개 테이블 최소 집합으로 시작한다.
- First-ship validator scope: `approve`
  required section presence, source_ref resolve, generated docs parity, checksum/freshness drift, count/detail parity, UTF-8/mojibake, cutover preflight를 first ship 범위로 고정한다.
- PMW artifact viewer mandatory scope: `approve`
  canonical docs, generated docs, latest handoff를 mandatory scope로 두고 archive/starter/reset viewer는 rollout lane으로 둔다.
- Inefficiency capture projection: `approve`
  raw capture는 DB truth에 기록하고, human review를 통과한 promoted item만 Markdown summary로 올린다.
- Security review automation level: `approve`
  path/file operation, dependency inventory, secret scan, cutover rollback presence까지만 자동화하고 핵심 보안 판단은 human review gate에 남긴다.

## 2026-04-22 Standardization Decision Baseline
- Layer model: `approve`
  표준 하네스는 `core / optional profile / project packet` 3층 구조로 확장하고, 특정 프로젝트 요구는 core에 직접 넣지 않는다.
- Domain foundation gate: `approve`
  data-impact 작업은 domain foundation reference와 schema impact 판단 없이 코드로 진입하지 않는다.
- Authoritative source contract: `approve`
  외부 기획/정책/연동 입력은 권위 있는 source로 등록하고 disposition을 추적한다.
- Product UX archetype contract: `approve`
  사용자 체감 기능은 제품 archetype 선언 또는 승인된 deviation 없이 구현하지 않는다.
- Environment topology contract: `approve`
  deploy/test/cutover 작업은 execution target과 환경 경계를 명시한다.
- QLT-01 redefinition: `approve`
  QLT-01은 per-packet refactor checkpoint에서 packet exit quality gate로 확장한다.
- OPS-01 redefinition: `approve`
  OPS-01은 단순 개선 제안이 아니라 improvement promotion loop로 운영한다.
- Profile system: `approve`
  행정형 그리드 앱, 스프레드시트 기반 기획, 폐쇄망 반입 운영 같은 반복 패턴은 optional profile로 제공한다.

## 2026-04-23 Planning Refinements
- Domain foundation gate detail: `approve`
  DB 설계는 항상 사용자 confirmation 대상이며, 기존 프로그램과 연동되면 기존 DB schema 또는 동등한 authoritative schema artifact를 받아 naming / data operation / ownership / migration compatibility 분석을 남긴 뒤에만 설계를 닫는다.
- Domain foundation artifact: `approve`
  `reference/artifacts/DOMAIN_CONTEXT.md` 또는 승인된 동등 artifact를 data-impact 작업의 표준 domain foundation reference로 사용하고, packet에는 reference path와 schema impact classification을 남긴다.
- Authoritative source precedence detail: `approve`
  새 사용자 기획 문서는 requirements / architecture / implementation / active packet에 즉시 영향을 주는 최우선 authoritative source로 취급하고, 기존 기획 및 현재 구현과의 충돌/재작업 범위를 보고하되 기존 안정성 유지보다 신규 기획의 완전 반영을 우선한다.
- Authoritative source artifact: `approve`
  `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md` 또는 승인된 동등 artifact를 authoritative source intake의 표준 reference로 사용하고, planning baseline과 packet에는 intake path와 disposition을 남긴다.
- Shared-source rebaseline control detail: `approve`
  하나의 authoritative source wave가 여러 open packet에 동시에 영향을 주면 project-level impacted packet set과 packet별 rebaseline status를 `reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md`로 닫는다.
- Source wave ledger artifact: `approve`
  multi-packet source wave에 속한 packet은 `Impacted packet set scope`, `Authoritative source wave ledger reference`, `Source wave packet disposition`을 packet evidence로 남기고, ledger row와 일치해야 한다.
- Product UX archetype artifact: `approve`
  `reference/artifacts/PRODUCT_UX_ARCHETYPE.md` 또는 승인된 동등 artifact를 user-facing 작업의 표준 UX archetype reference로 사용하고, packet에는 archetype path, selected archetype, deviation status를 남긴다.
- Environment topology artifact: `approve`
  `reference/artifacts/DEPLOYMENT_PLAN.md` 또는 승인된 동등 artifact를 deploy/test/cutover 작업의 표준 environment topology reference로 사용하고, packet에는 topology path, source/target environment, execution target, transfer boundary, rollback boundary를 남긴다.
- Packet exit quality gate artifact: `approve`
  `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md` 또는 승인된 동등 artifact를 packet closeout의 표준 quality gate reference로 사용하고, packet에는 closeout reference path, exit recommendation, residual debt / defer record를 남긴다.
- Improvement promotion loop detail: `approve`
  `.agents/artifacts/PREVENTIVE_MEMORY.md`를 반복 friction의 canonical improvement memory로 사용하고, candidate에는 target layer, promotion status, linked follow-up item을 남긴 뒤 human review로만 core/profile/project follow-up에 승격한다.
- Admin grid application profile: `approve`
  `reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md` 또는 승인된 동등 artifact를 grid-heavy administrative applications의 표준 optional profile reference로 사용하고, active packet에는 profile path, primary admin entity / surface, grid interaction model, search / filter / sort / pagination behavior, row action / bulk action rule, edit / save pattern, profile deviation / exception을 남긴다.
- Authoritative spreadsheet source profile: `approve`
  `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md` 또는 승인된 동등 artifact를 spreadsheet-backed authoritative planning/source work의 표준 optional profile reference로 사용하고, active packet에는 profile path, source spreadsheet artifact, workbook / sheet / tab / range trace, header / column mapping, row key / record identity rule, source snapshot / version, transformation / normalization assumptions, reconciliation / overwrite rule, profile deviation / exception을 남긴다.
- Airgapped delivery profile: `approve`
  `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md` 또는 승인된 동등 artifact를 transfer-bound or airgapped delivery work의 표준 optional profile reference로 사용하고, active packet에는 profile path, transfer package / bundle artifact, transfer medium / handoff channel, checksum / integrity evidence, offline dependency bundle status, ingress verification / import step, rollback package / recovery bundle, manual custody / operator handoff, profile deviation / exception을 남긴다.
- PLN-03 activation contract: `approve`
  `Core`는 기본 활성, `Optional Profile`은 explicit-only, `Project Packet`은 project-specific 실행 전 필수이며, required reading rule은 baseline -> active profile -> active packet -> authoritative source 순서를 따른다.
