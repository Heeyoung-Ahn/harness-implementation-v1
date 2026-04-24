# Packet Exit Quality Gate

이 문서는 구현이 끝난 packet을 close할 때 사용하는 표준 `packet closeout reference`다. packet은 이 문서 또는 동등하게 승인된 artifact 없이 완료 또는 close 상태로 올라가지 않는다.

## Approval Rule
- 구현이 끝난 packet은 이 문서 또는 승인된 동등 artifact를 먼저 작성하고 packet에 경로를 인용한다.
- implementation delta summary, source parity status, residual debt / refactor disposition, validation / security / cleanup evidence, exit recommendation이 비어 있으면 `approved`로 올리지 않는다.
- source parity status 또는 validation / cleanup status가 `unknown`이거나 unresolved UX / topology / schema confusion이 남아 있으면 packet closeout hold를 유지한다.
- core는 closeout criteria와 decision shape만 제공한다. project-specific bug list, code diff, one-off cleanup step은 packet이나 상세 운영 문서에서 닫는다.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Packet scope | [작업 이름] | [어떤 packet을 닫는지] | draft |
| Source parity | aligned / drift / unknown | [packet과 결과물 일치 여부] | draft |
| Residual debt | none / deferred / follow-up-open / unknown | [남는 부채 상태] | draft |
| UX conformance | not-needed / aligned / approved-deviation / unknown | [user-facing 기준 결과] | draft |
| Topology / schema conformance | not-needed / aligned / confusion-open / unknown | [환경/데이터 기준 결과] | draft |
| Validation / cleanup status | complete / partial / unknown | [검증/정리 상태] | draft |
| Exit recommendation | approve / adjust / hold | [packet close 가능 여부] | draft |

## 1. Goal And Reviewed Scope
- Goal:
- Reviewed implementation scope:
- Out-of-scope remainder:

## 2. Implementation Delta Summary
- What changed:
- What stayed unchanged:
- Canonical docs updated:

## 3. Source Parity Check
- Packet vs code parity:
- Packet vs canonical docs parity:
- Packet vs generated docs / PMW parity:
- Source trace gaps:

## 4. Residual Debt And Refactor Disposition
- Refactor completed:
- Residual debt:
- Deferred cleanup:
- Follow-up item:

## 5. UX / Behavior Conformance
- User-facing impact:
- Archetype / behavior conformance result:
- Approved deviation reference:

## 6. Topology / Schema / Operations Conformance
- Data or schema confusion:
- Topology or cutover confusion:
- Migration / rollback note:

## 7. Validation / Security / Cleanup Evidence
- Tests and validator:
- Security review result:
- Docs / artifact cleanup:
- Dependency / script cleanup:

## 8. Deferred Items And Reopen Triggers
- Deferred item:
- Why deferred:
- Reopen trigger:

## 9. Human Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Packet closeout approved | yes / no | [owner] | pending | [exit recommendation] |
| Residual debt accepted | yes / no | [owner] | pending | [defer / follow-up item] |
| Security review acknowledged | yes / no | [owner] | pending | [finding status] |

## 10. Final Decision
- Exit recommendation:
- Next action:
