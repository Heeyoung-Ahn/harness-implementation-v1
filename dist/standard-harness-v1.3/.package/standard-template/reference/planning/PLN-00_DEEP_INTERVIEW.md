# PLN-00 Deep Interview

## Purpose

이 문서는 새 프로젝트 kickoff 전에 `구현을 막을 수 있는 질문`을 먼저 닫기 위한 인터뷰 패킷이다.  
목표는 요구사항, 기존 시스템, 승인 경계, 운영 제약을 초반에 정리해서 downstream 문서와 첫 task packet이 같은 기준선에서 시작하게 만드는 것이다.

## Who Should Use This

- 기획 담당자
- 프로젝트 리더
- 사용자 요구를 정리하는 실무 담당자
- 개발 착수 전에 질문을 모으고 닫아야 하는 사람

## How To Use This Packet

1. 아래 질문을 회의나 인터뷰에서 하나씩 채운다.
2. 지금 바로 닫을 수 있는 항목은 `approved`로 둔다.
3. 더 확인이 필요한 항목은 `open`으로 둔다.
4. 지금 결정하지 못하지만 일정상 넘어가야 하는 항목은 `deferred`로 두고 owner와 follow-up 시점을 적는다.
5. `open`이 많은 상태로는 requirements freeze를 하지 않는다.

## Quick Status Header

| Area | Current status | Owner | Notes |
|---|---|---|---|
| Primary user and goal | open / approved / deferred | [owner] | [notes] |
| Core workflow and screens | open / approved / deferred | [owner] | [notes] |
| Existing system / DB dependency | open / approved / deferred | [owner] | [notes] |
| External source documents | open / approved / deferred | [owner] | [notes] |
| Approval boundary | open / approved / deferred | [owner] | [notes] |
| Delivery / environment expectation | open / approved / deferred | [owner] | [notes] |
| First implementation scope | open / approved / deferred | [owner] | [notes] |

## 1. Product Goal And Users

- Product or project name:
- Primary user:
- Secondary users:
- What decision or action the user needs to do quickly:
- What problem is painful today:
- What outcome means “this first version is useful”:

## 2. Core Workflow

- What is the main workflow from start to finish:
- What screens or work areas are definitely needed:
- What actions are read-only, editable, approval-based, or batch-based:
- What can wait until later:

## 3. Existing System / Data / Integration

- Is there an existing program or service this project depends on:
- Is there an existing DB schema, API spec, workbook, or policy document:
- Who owns the existing system:
- What compatibility risk is already known:
- Is DB naming / column naming / operation compatibility likely to matter:

## 4. External Source Documents

| Source | Type | Why it matters | Current status |
|---|---|---|---|
| [document path or name] | planning / workbook / policy / API / DB schema / other | [why] | open / approved / missing |

## 5. User-Facing Design Questions

- Is this project more like `reading-desk`, `workflow-workbench`, `queue-workbench`, `monitoring-console`, `record-admin`, or something else:
- Is dense grid / admin table behavior likely:
- Is detailed UI mockup needed before code:
- Are there high-risk screens or approval flows that need explicit sign-off:

## 6. Delivery / Environment Questions

- Where will this run first:
- Is there a separate dev / test / prod environment:
- Is file transfer, manual import, or airgapped delivery possible:
- Does rollback or cutover need special approval:

## 7. Optional Profile Candidates

| Profile | Use it if | Candidate status | Notes |
|---|---|---|---|
| `PRF-01` | 운영자용 grid / table 중심 프로젝트 | candidate / not-needed / approved | [notes] |
| `PRF-02` | spreadsheet가 기준 문서 역할을 하는 프로젝트 | candidate / not-needed / approved | [notes] |
| `PRF-03` | 수동 반입 / 전달 / 폐쇄망 절차가 있는 프로젝트 | candidate / not-needed / approved | [notes] |

## 8. Approval Boundary

| Decision item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Requirements freeze approval | yes / no | [owner] | pending | [notes] |
| UX direction approval | yes / no | [owner] | pending | [notes] |
| Existing DB / schema confirmation | yes / no | [owner] | pending | [notes] |
| Authoritative source confirmation | yes / no | [owner] | pending | [notes] |
| Delivery / deployment expectation approval | yes / no | [owner] | pending | [notes] |

## 9. Open Questions

- [question]

## 10. Deferred Items

- Item:
- Why deferred:
- Owner:
- Follow-up timing:
- Temporary rule:

## 11. Exit Criteria

- primary user와 목표가 한 문장으로 설명된다.
- 첫 버전에 꼭 필요한 workflow와 미뤄도 되는 범위가 구분된다.
- 기존 시스템 / DB / workbook / 정책 문서 의존 여부가 정리된다.
- active profile 후보가 정리된다.
- open question이 requirements freeze를 막는지 아닌지 판정된다.

## 12. Output To Carry Forward

이 문서에서 닫힌 내용은 최소한 아래 문서로 이어져야 한다.

- `.agents/artifacts/REQUIREMENTS.md`
- `reference/planning/PLN-01_REQUIREMENTS_FREEZE.md`
- 필요 시 `reference/artifacts/DOMAIN_CONTEXT.md`
- 필요 시 `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md`
- 첫 구현 작업을 위한 `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
