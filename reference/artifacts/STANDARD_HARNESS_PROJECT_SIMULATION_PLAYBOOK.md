# Standard Harness Project Simulation Playbook

## Purpose

이 문서는 새 프로젝트를 실제로 시작하기 전에 표준 하네스를 `설계 -> 구현 -> 검증 -> 배포`까지 가상으로 태워보는 절차를 정리한 playbook이다.  
목표는 `하네스가 실제 복잡한 상황에서 어디서 멈추고, 어디서 새 규칙이 더 필요한지`를 kickoff 전에 확인하는 것이다.

## When To Run

- 새 프로젝트 kickoff 직전
- legacy DB 또는 기존 프로그램 연동이 있는 경우
- workbook / spreadsheet가 authoritative source인 경우
- user-facing 화면이 dense admin-grid 또는 approval flow를 가지는 경우
- external handoff, manual-transfer, airgapped delivery 가능성이 있는 경우
- 표준 하네스 core/profile 계약을 갱신한 직후

## Inputs

| Input | Minimum requirement |
| --- | --- |
| rough requirements | 제품 목표, 사용자, 주요 화면/업무 흐름 |
| external sources | workbook, 정책 문서, 연동 명세, 기존 기획 문서 |
| legacy system context | 기존 DB schema 또는 equivalent artifact 유무 |
| delivery expectation | local/dev/stage/prod 또는 manual-transfer/airgapped 여부 |
| candidate work items | 최소 3개 이상 packet으로 나눌 수 있는 실제 작업 단위 |

## Simulation Procedure

### 1. Declare Product Shape

- 이 프로젝트가 `record-admin`, `workflow-workbench`, `queue-workbench` 중 어디에 가까운지 먼저 적는다.
- dense admin-grid 성격이면 `PRF-01` 후보로 둔다.
- workbook이 planning/source-of-truth면 `PRF-02` 후보로 둔다.
- manual-transfer나 airgapped delivery 가능성이 있으면 `PRF-03` 후보로 둔다.

출력:

- 제품 archetype 후보
- candidate optional profiles
- legacy integration 여부

### 2. Build An Ugly Event Deck

아래 유형에서 최소 1개씩 뽑아 시뮬레이션 이벤트를 만든다.

| Event type | Example |
| --- | --- |
| source change | workbook v2/v3 도착, sheet rename, column rename, row key 변경 |
| UX change | read-only 화면이 editable로 바뀜, approval flow 추가, bulk action 요구 |
| DB change | 기존 table/column naming 강제, ownership 변경, migration 위험 확인 |
| topology change | 배포 대상 환경이 바뀜, manual-transfer 요구, rollback 범위 축소 |
| closeout pressure | 구현자가 화면 완성만 보고 done 처리하려고 함 |

## 3. Simulate Planning Baseline

- `REQUIREMENTS.md` 기준으로 rough baseline을 세운다.
- 새로운 authoritative source가 있으면 intake가 필요한지 먼저 본다.
- DB 영향이 있으면 schema artifact 확보 전 planning hold가 걸리는지 확인한다.
- user-facing이면 archetype 선언 없이 downstream으로 넘어가지 못하는지 확인한다.

점검 질문:

- 새 기획 문서가 들어왔을 때 intake 없이 진행할 수 있는가
- 기존 시스템 schema가 없는데도 설계를 닫을 수 있는가
- archetype이 `unknown`인데 구현으로 갈 수 있는가

## 4. Simulate Packet Kickoff

- 실제로 열릴 3개 이상 work item을 packet 단위로 적는다.
- 각 packet에 `Ready For Code`, `Layer classification`, `Active profile dependency`, `Domain foundation status`, `Authoritative source intake status`, `UX archetype status`, `Environment topology status`를 채운다고 가정해 본다.
- 여기서 어떤 packet이 바로 막혀야 하는지 본다.

점검 질문:

- packet이 요구하는 profile evidence를 빠짐없이 표현할 수 있는가
- packet이 workbook trace, DB compatibility, UI approval, topology evidence를 함께 담을 수 있는가
- packet 수가 늘어나도 운영자가 누락 없이 등록/추적할 수 있는가

## 5. Inject A New Authoritative Source

- workbook 신규 버전이나 새 기획 문서를 투입한다.
- `AUTHORITATIVE_SOURCE_INTAKE.md`를 다시 열어야 하는지 본다.
- 기존 requirements, architecture, implementation, open packet 중 무엇이 다시 열리는지 적는다.

출력:

- source intake 재오픈 여부
- affected baseline artifacts
- impacted packet set
- required rework / defer summary

## 6. Inject A DB / Legacy Constraint

- 기존 프로그램과 naming, column semantics, ownership, migration rule이 충돌하는 상황을 넣는다.
- `DOMAIN_CONTEXT.md` 없이는 설계를 못 닫는지 확인한다.
- 사용자 DB confirmation 없이는 `Ready For Code`가 올라가지 않는지 확인한다.

출력:

- existing schema artifact 상태
- schema impact classification
- naming / operation compatibility summary
- user confirmation boundary

## 7. Inject A UX Deviation

- dense grid를 기본으로 잡았는데 특정 화면은 read-first review desk나 multi-step workbench가 필요하다고 가정한다.
- `PRODUCT_UX_ARCHETYPE.md`와 deviation approval 없이는 구현이 멈추는지 본다.

출력:

- selected archetype
- deviation requested / approved / pending
- detailed UI/UX agreement boundary

## 8. Inject Deployment And Cutover Stress

- 고객이 online deploy 대신 offline bundle, manual import, checksum evidence, rollback package를 요구한다고 가정한다.
- `DEPLOYMENT_PLAN.md`와 필요 시 `PRF-03` evidence 없이 진행할 수 없는지 본다.

출력:

- source / target environment
- execution target
- transfer boundary
- rollback boundary
- custody / checksum / ingress verification summary

## 9. Simulate Packet Closeout Pressure

- 화면이 얼추 보이거나 일부 테스트가 통과한 상태에서 packet을 닫으려고 해 본다.
- `PACKET_EXIT_QUALITY_GATE.md` 기준으로 source parity, residual debt, cleanup evidence가 비어 있으면 정말 closeout hold가 걸리는지 확인한다.

출력:

- exit recommendation
- residual debt disposition
- deferred follow-up item
- reopen trigger

## 10. Score The Harness

아래 표를 각 시나리오마다 채운다.

| Check | Pass criteria |
| --- | --- |
| Hold clarity | 왜 멈췄는지 한 문장으로 설명 가능해야 함 |
| Artifact clarity | 어떤 문서를 열어야 하는지 즉시 알 수 있어야 함 |
| Validator enforceability | 사람 규칙이 아니라 validator까지 연결되는지 확인해야 함 |
| Multi-packet safety | 한 변경이 여러 packet에 미칠 때 stale packet이 남지 않아야 함 |
| Operator load | 운영자가 누락 없이 유지할 수 있는 수준이어야 함 |

## Output Template

- Project shape:
- Candidate profiles:
- Dirty event deck:
- Holds that worked:
- Holds that were unclear:
- Validator-backed controls:
- Manual-only controls:
- Improvement candidates:
- Start recommendation:

## Temporary Operator Rule For The Current Baseline

현행 baseline으로 실제 복잡한 프로젝트를 시작할 때는 아래를 추가 운영 규칙으로 둔다.

1. packet 생성일에 `artifact_index` 등록까지 같이 한다.
2. workbook 또는 external planning source 변경 시 intake와 함께 impacted packet set 표를 만든다.
3. 한 work item이 여러 optional profile을 동시에 요구하면 primary profile만 header에 두지 말고 secondary profile도 packet body와 required reading에 명시한다.
4. 배포 전에는 기능 packet과 별도로 release/cutover packet을 만들어 topology와 transfer evidence를 묶는다.

## Result Interpretation

- `Go`: hold와 artifact path가 명확하고, validator-backed control이 충분하며, manual workaround가 경미하다.
- `Go with controls`: 시작은 가능하지만 운영자 보완 규칙이 1개 이상 필요하다.
- `Hold`: source-wave, DB integration, multi-profile, deployment boundary 중 하나가 흐릿해서 kickoff 전에 follow-up이 필요하다.
