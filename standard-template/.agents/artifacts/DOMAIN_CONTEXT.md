# Domain Context

이 문서는 domain/data-impact foundation에 한해 canonical이다.

이 문서는 data-impact 작업의 표준 `domain foundation reference`다. DB 설계, 기존 시스템 연동, schema impact가 있는 작업은 이 문서 또는 동등하게 승인된 artifact 없이 `Ready For Code`로 진행하지 않는다.

중장기 프로젝트에서는 이 문서를 domain meaning, business rule, domain term, data-impact scope를 유지하는 canonical context로 사용한다. 요구사항이 바뀌거나 프로그램 수정이 필요할 때, 전체 코드베이스를 넓게 흔들지 않고 영향을 받는 도메인 개념, 규칙, 데이터 필드, 연동 지점으로 변경 범위를 좁히는 기준으로 사용한다.

이 문서는 다음을 대체하지 않는다:
- current execution state
- packet status
- implementation detail
- explicit workflow handoff truth

이 문서가 `CURRENT_STATE`, `TASK_LIST`, packet status, DB hot-state, explicit user approval, workflow handoff truth와 충돌하면 후자가 우선한다.

## Approval Rule
- 이 문서는 data-impact 작업 착수 전에 작성하거나, 기존 승인 artifact가 있으면 그 경로를 packet에 명시한다.
- DB 설계가 있는 작업은 이 문서의 schema impact와 naming / operation compatibility 분석이 비어 있으면 planning hold를 유지한다.
- 기존 프로그램과 연동되면 기존 프로그램 DB schema 또는 동등한 authoritative schema artifact를 source로 연결한다.
- schema impact classification이 `unknown`이면 설계나 구현으로 넘기지 않는다.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Domain area | [도메인 이름] | [왜 이 문서가 필요한지] | draft |
| Data-impact scope | none / low / medium / high | [데이터 영향 범위] | draft |
| Existing system dependency | none / possible / confirmed | [기존 프로그램 연동 여부] | draft |
| Schema impact classification | none / additive / compatible-change / breaking / unknown | [예상 영향] | draft |
| User confirmation needed | yes / no | [왜 필요한지] | draft |
| Ready for packet citation | approve / adjust / hold | [packet에 인용 가능한지] | draft |

## 1. Domain Goal
- [이 도메인 또는 데이터 작업이 해결하려는 목표]

## 2. In Scope
- [이번 domain foundation에서 다루는 엔티티, 상태, 연동]

## 3. Out Of Scope
- [이번 문서에서 다루지 않는 것]

## 4. Core Domain Vocabulary
| Term | Meaning | Source |
|---|---|---|
| [용어] | [정의] | [근거 문서] |

## 5. Key Entities And Relationships
| Entity | Description | Relationship | Notes |
|---|---|---|---|
| [엔티티] | [설명] | [관계] | [비고] |

## 6. Lifecycle States And Invariants
- 상태 전이:
- 깨지면 안 되는 invariant:
- 운영상 반드시 유지해야 하는 데이터 규칙:

## 7. Existing System Context
- Existing program / service:
- Existing DB schema artifact:
- Current source-of-truth:
- Ownership boundary:
- Data flow summary:

## 8. Schema Impact Classification
- Proposed classification: `none / additive / compatible-change / breaking / unknown`
- Why:
- Affected table / column / data operation:
- Migration impact:
- Rollback impact:

## 9. DB Naming / Operation Compatibility
- Table naming compatibility:
- Column naming compatibility:
- Data operation compatibility:
- Ownership compatibility:
- Existing process compatibility:

## 10. Human Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Existing schema intake confirmed | yes / no | [owner] | pending | [schema artifact path] |
| Domain foundation approved | yes / no | [owner] | pending | [비고] |
| DB design confirmation | yes / no | [owner] | pending | [테이블/컬럼/운영 방식] |

## 11. Open Questions
- [남은 질문]

## 12. Packet Citation Rule
- data-impact packet은 이 문서 경로 또는 승인된 동등 artifact 경로를 `Domain foundation reference`로 인용한다.
- packet에는 `Schema impact classification`, `Existing schema source artifact`, `Migration / rollback / cutover compatibility`를 함께 남긴다.
- 신규 정보로 schema impact가 바뀌면 packet과 이 문서를 같이 다시 연다.
