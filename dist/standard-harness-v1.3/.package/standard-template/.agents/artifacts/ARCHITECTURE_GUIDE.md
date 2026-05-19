# Architecture Guide

## Purpose
이 문서는 `REQUIREMENTS.md` 확정 후에 작성하는 downstream project technical architecture SSOT다.

이 문서에는 아래만 남긴다:
- project components
- module boundaries
- data flow
- integration architecture
- technical constraints
- project-specific architecture decisions and tradeoffs

이 문서는 아래를 다루지 않는다:
- harness self-architecture
- workflow governance
- approval boundary
- packet-before-code discipline
- generated-doc immutability
- agent operating behavior

위 운영 규칙은 `.agents/rules/HARNESS_OPERATING_CONTRACT.md`와 workflow contract에서 다룬다.

## Authoring Flow
1. 먼저 `.agents/artifacts/REQUIREMENTS.md`를 채운다.
2. 그 다음 이 문서에서 technical architecture를 닫는다.
3. data-impact 작업이면 `.agents/artifacts/DOMAIN_CONTEXT.md`를 같이 인용한다.
4. system boundary가 중요한 작업이면 `.agents/artifacts/SYSTEM_CONTEXT.md`를 같이 인용한다.
5. 과거 rebaseline, decommission, durable decision history가 현재 architecture 판단에 영향을 주면 `.agents/artifacts/PROJECT_HISTORY.md`를 같이 인용한다.
6. 구현이 아니라 architecture decision만 남긴다.
7. architecture가 닫히면 필요한 구현 범위는 implementation packet으로 넘긴다.

## 1. Architecture Goal
- [이 프로젝트 architecture가 해결해야 하는 기술 목표]

## 2. System Scope
- In scope:
- Out of scope:
- Main runtime boundary:
- Main data boundary:

## 3. Project Component Map
| Component | Responsibility | Inputs / Outputs | Notes |
|---|---|---|---|
| [component] | [what it owns] | [what it reads/writes] | [notes] |

## 4. Module Boundaries
| Module / Area | Owns | Must Not Own | Depends On |
|---|---|---|---|
| [module] | [responsibility] | [boundary] | [dependency] |

## 5. Data Flow
1. [source or trigger]
2. [processing step]
3. [write or output boundary]
4. [user-facing or downstream result]

## 6. Integration Architecture
| Integration | Direction | Contract | Failure / Fallback |
|---|---|---|---|
| [system or interface] | inbound / outbound / both | [API, DB, file, manual handoff] | [fallback] |

## 7. Technical Constraints
- Runtime / platform constraints:
- Data / schema constraints:
- Deployment / environment constraints:
- Security / compliance constraints:
- Performance / scale constraints:

## 8. Architecture Decisions And Tradeoffs
| Decision | Chosen approach | Why | Rejected alternative |
|---|---|---|---|
| [topic] | [choice] | [reason] | [rejected path] |

## 9. Change Impact Pointers
- If requirements in [area] change, check:
  - [component or module]
  - [data flow]
  - [integration]
- If domain rule changes, also check:
  - `.agents/artifacts/DOMAIN_CONTEXT.md`
- If boundary or dependency mapping changes, also check:
  - `.agents/artifacts/SYSTEM_CONTEXT.md`

## 10. Open Technical Questions
- [question]
