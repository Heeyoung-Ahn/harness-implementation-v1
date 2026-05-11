# PLN-01 Requirements Freeze

## Purpose

이 문서는 kickoff 인터뷰와 사용자 확인을 거친 뒤,  
`무엇이 이번 기준선에서 확정되었는지`와 `무엇이 아직 열려 있는지`를 명확히 남기는 freeze 기록이다.

## Freeze Status

- Freeze status: `draft / approved / partially-approved`
- Freeze source: `PLN-00_DEEP_INTERVIEW.md`
- Downstream sync status: `not-started / in-progress / completed`

## 1. Freeze Summary

- Project name:
- Freeze date:
- Approved by:
- Freeze scope summary:

## 2. What Is Approved

- Primary user and goal:
- First version in-scope screens / workflows:
- First version out-of-scope items:
- Existing system / DB / workbook dependency summary:
- Active optional profiles:
- Required approval boundaries:

## 3. Baseline Scope Table

| Area | Approved baseline | Notes |
|---|---|---|
| Product goal | [approved summary] | [notes] |
| Primary users | [approved summary] | [notes] |
| In scope | [approved summary] | [notes] |
| Out of scope | [approved summary] | [notes] |
| Existing system dependency | [approved summary] | [notes] |
| Authoritative sources | [approved summary] | [notes] |
| Active profiles | [approved summary] | [notes] |
| Environment expectation | [approved summary] | [notes] |

## 4. Still Open Or Deferred

| Item | Status | Owner | Temporary rule |
|---|---|---|---|
| [question or risk] | open / deferred | [owner] | [temporary rule] |

## 5. Downstream Sync Rule

requirements freeze가 `approved` 또는 승인 범위가 충분히 명확한 `partially-approved` 상태가 되기 전까지는 아래를 새 기준선으로 올리지 않는다.

- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- `reference/artifacts/UI_DESIGN.md`
- 첫 구현 task packet

## 6. Human Approval Boundary

| Decision item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Requirements freeze approval | yes / no | [owner] | pending | [notes] |
| Deferred item acceptance | yes / no | [owner] | pending | [notes] |
| Active profile confirmation | yes / no | [owner] | pending | [notes] |

## 7. Next Step

- requirements freeze가 승인되면 architecture / implementation / UI baseline을 같은 기준선으로 sync한다.
- 그 다음 첫 task packet을 열어 구체 구현 범위를 다시 닫는다.
