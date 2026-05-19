# PLN-00 Deep Interview

## Purpose

이 문서는 새 프로젝트 kickoff 전에 `구현을 막을 수 있는 질문`을 먼저 닫기 위한 인터뷰 패킷이다.  
목표는 요구사항, 기존 시스템, 승인 경계, 운영 제약을 초반에 정리해서 downstream 문서와 첫 task packet이 같은 기준선에서 시작하게 만드는 것이다.

## Required Inputs

- `reference/artifacts/PROJECT_STARTER_DOC_PACK.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ACTIVE_PROFILES.md`
- 현재 확보한 기존 시스템 문서, API 명세, 정책 문서, 스프레드시트, DB schema 자료

## Who Should Use This

- 기획 담당자
- 프로젝트 리더
- 사용자 요구를 정리하는 실무 담당자
- 개발 착수 전에 질문을 모으고 닫아야 하는 사람

## How To Use This Packet

1. 먼저 `Decision Queue`를 보여 준다.
2. `PROJECT_STARTER_DOC_PACK.md`에서 비어 있는 implementation-critical 항목을 먼저 메운다.
3. 질문은 한 번에 한 개의 결정사항만 닫는다.
4. 각 결정사항마다 `왜 중요한지`, `지금 잘못 닫히면 무엇이 크게 다시 바뀌는지`, `후속 문서/개발/검증에 어떤 영향이 생기는지`를 plain language로 설명한다.
5. 지금 바로 닫을 수 있는 항목은 `approved`로 둔다.
6. 더 확인이 필요한 항목은 `open`으로 둔다.
7. 지금 결정하지 못하지만 일정상 넘어가야 하는 항목은 `deferred`로 두고 owner와 follow-up 시점을 적는다.
8. 하나의 결정이 다른 항목의 전제를 바꾸면 남은 질문 순서와 내용도 즉시 갱신한다.
9. `open`이 많은 상태로는 requirements freeze를 하지 않는다.
10. `PLN-01`이 승인되기 전에는 architecture / implementation / UI sync와 첫 task packet draft를 열지 않는다.

## Decision Queue

인터뷰 시작 시 아래 형식으로 `지금 닫아야 할 결정 목록`을 먼저 보여 준다.

| Order | Decision item | Why now | If wrong later | Current status |
|---|---|---|---|---|
| 1 | [가장 먼저 닫을 결정] | [지금 필요한 이유] | [나중에 틀리면 어떤 재작업이 커지는지] | open |
| 2 | [다음 결정] | [지금 필요한 이유] | [나중에 틀리면 어떤 재작업이 커지는지] | open |

## Decision Card Rule

각 결정사항을 물을 때는 최소 아래 구조를 따른다.

- Decision item:
- Plain-language explanation:
- Why it matters now:
- Downstream impact:
- If approved:
- If adjusted:
- If deferred:
- Recommended next answer:

## Quick Status Header

| Area | Current status | Owner | Notes |
|---|---|---|---|
| Project starter baseline coverage | open / approved / deferred | [owner] | [blank sections or notes] |
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
| `PRF-04` | Excel/VBA/MariaDB 기반 기존 시스템을 대체하는 프로젝트 | candidate / not-needed / approved | [notes] |
| `PRF-05` | Python/Django backoffice 구조가 필요한 프로젝트 | candidate / not-needed / approved | [notes] |
| `PRF-06` | 상태전이, 승인, 권한, 감사가 핵심인 프로젝트 | candidate / not-needed / approved | [notes] |
| `PRF-07` | 가벼운 웹앱/내부도구/경량 앱 프로젝트 | candidate / not-needed / approved | [notes] |
| `PRF-08` | Android 앱, signing, permissions, device test가 필요한 프로젝트 | candidate / not-needed / approved | [notes] |
| `PRF-09` | Node/frontend web app build/test/deploy 경계가 중요한 프로젝트 | candidate / not-needed / approved | [notes] |

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

## 11. Dependency Update Rule

- 하나의 결정이 다른 질문의 전제를 바꾸면 남은 결정 queue를 다시 보여 준다.
- profile, source-of-truth, deployment expectation, approval boundary가 바뀌면 후속 질문 wording도 그 기준에 맞게 다시 적는다.
- 이미 닫은 결정과 충돌이 생기면 requirements freeze 전에 그 충돌을 다시 연다.

## 12. Exit Criteria

- primary user와 목표가 한 문장으로 설명된다.
- 첫 버전에 꼭 필요한 workflow와 미뤄도 되는 범위가 구분된다.
- 기존 시스템 / DB / workbook / 정책 문서 의존 여부가 정리된다.
- active profile 후보가 정리된다.
- open question이 requirements freeze를 막는지 아닌지 판정된다.
- `PROJECT_STARTER_DOC_PACK.md`의 구현에 직접 영향을 주는 빈칸이 owner 또는 temporary rule 없이 남아 있지 않다.
- architecture / implementation / UI sync를 시작해도 되는지, 아니면 아직 `PLN-01` blocker가 남아 있는지 분명하다.
- 각 핵심 결정에 대해 downstream impact가 기록되어 비전공자도 리스크 크기를 읽을 수 있다.
- 최종 first-version product preview를 보여 주고 human final confirmation 질문까지 준비된다.

## 13. Final Product Preview Before Freeze

requirements freeze 직전에는 최소 아래를 한 번에 보여 주고 최종 확인을 받는다.

- 이 제품의 첫 버전에서 누가 무엇을 하게 되는지
- 꼭 들어가는 화면 / workflow
- 제외되는 범위
- 선택된 profile과 그 이유
- 기존 시스템 / 데이터 / 외부 문서 의존성
- 지금 결정이 이후 architecture / packet / test에 주는 가장 큰 영향
- 지금 승인하면 바로 다음에 무엇을 sync하게 되는지

## 14. Final Confirmation Question

아래와 같은 의미의 질문으로 freeze 직전 최종 확인을 받는다.

- “지금까지 닫은 결정 기준으로 보면 첫 버전 제품은 위와 같은 모습이 됩니다. 이 기준으로 requirements freeze를 진행해도 되는지, 또는 수정이 필요한지 확인해 주세요.”

## 15. Output To Carry Forward

이 문서에서 닫힌 내용은 최소한 아래 문서로 이어져야 한다.

- `reference/artifacts/PROJECT_STARTER_DOC_PACK.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `reference/planning/PLN-01_REQUIREMENTS_FREEZE.md`
- 필요 시 `.agents/artifacts/DOMAIN_CONTEXT.md`
- 필요 시 `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md`
- 첫 구현 작업을 위한 `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`

`PLN-00` 인터뷰 결과가 chat에만 있고 문서에 반영되지 않았다면 이 packet은 아직 닫힌 것이 아니다.
