# UI Design

## Summary

이 문서는 프로젝트의 rough UI / UX 기준선이다.  
목표는 `어떤 제품 모양으로 갈지`, `무엇을 먼저 보여야 하는지`, `어떤 화면은 상세 합의가 더 필요한지`를 early stage에 정리하는 것이다.

이 문서는 최종 화면 명세가 아니다.  
실제 구현 직전에는 각 work item packet에서 상세 설계를 다시 닫아야 한다.

## Rough Vs Detailed Design

- `UI_DESIGN.md`는 rough baseline이다.
- rough baseline은 정보 구조, 사용자 흐름, 우선순위, 승인 경계를 정한다.
- 상세 화면 구조, 문구, 상태 전이, interaction detail은 task packet에서 다시 정한다.
- 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`는 human sync 없이 코드에서 먼저 확정하지 않는다.

## Product UX Archetype Contract

- user-facing 작업은 `reference/artifacts/PRODUCT_UX_ARCHETYPE.md` 또는 동등한 승인 artifact를 기준으로 한다.
- selected archetype과 deviation 여부를 먼저 정한다.
- archetype이 `unknown`이거나 deviation status가 `pending`이면 설계를 닫지 않는다.

## Rough Design Questions

- 사용자가 첫 화면에서 제일 먼저 알아야 하는 것은 무엇인가:
- 무엇이 상단 summary에 있어야 하는가:
- 무엇은 detail로 내려가도 되는가:
- 어떤 화면이나 동작이 human sign-off 없이 구현되면 위험한가:
- 기존 시스템과 맞춰야 하는 UI/용어/업무 흐름이 있는가:

## Must Preserve

- 첫 화면에서 사용자가 길을 잃지 않게 하는 정보 우선순위
- summary와 detail의 역할 구분
- empty / error / loading / stale 상태 노출
- source-backed summary 원칙
- 승인 경계가 필요한 user-facing 동작 식별

## Visual Direction

- product tone:
- information density:
- default layout bias:
- primary navigation style:
- list / detail / form / grid / workflow bias:

## Mockup Contract

- mockup은 분위기 그림이 아니라 실제 제품 구조 판단을 돕는 설계 자료여야 한다.
- rough mockup 승인만으로 구현 승인이 된 것으로 보지 않는다.
- mockup review에는 empty/error/loading/source-trace fallback까지 포함한다.
- repeated pattern이면 optional profile로 올리고, one-off detail이면 project packet에 남긴다.

## Hard Rules

- raw 요구사항 문장을 그대로 화면 문구로 확정하지 않는다.
- 요약 화면이 실제 source나 approved packet과 어긋나면 안 된다.
- user-facing 고위험 흐름은 task packet과 human approval 없이 구현하지 않는다.
- archetype에서 벗어나는 navigation, density, write boundary는 deviation으로 기록한다.

## Open Questions

- [question]
