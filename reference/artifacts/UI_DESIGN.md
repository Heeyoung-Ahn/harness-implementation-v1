# UI Design

## Summary
PMW는 dashboard보다 reading desk에 가깝게 설계한다. 사용자는 첫 화면에서 `무엇을 결정해야 하는지`, `무엇이 막고 있는지`, `현재 무엇을 하고 있는지`, `다음에 무엇을 해야 하는지`를 먼저 읽어야 한다. 이때 결정은 최대한 쉽게 내려야 하지만, 근거 없는 압축이 되면 안 된다. 디자인 목업은 분위기용 이미지가 아니라 실제 구현 로직과 데이터 계약이 반영된 설계 산출물이어야 한다.

## Rough vs Detailed Design
- 최초 `reference/artifacts/UI_DESIGN.md`와 상위 mockup은 rough baseline일 수 있다.
- rough baseline은 전체 정보구조, tone, source-to-surface contract, 우선순위만 승인한다.
- 실제 구현 직전에는 작업 단위별 상세 화면 설계가 다시 필요하다.
- 특히 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`는 task-level detailed design과 human sync 없이 코드로 먼저 확정하지 않는다.

## Product UX Archetype Contract
- user-facing 작업의 기본 reference surface는 `reference/artifacts/PRODUCT_UX_ARCHETYPE.md` 또는 승인된 동등 artifact다.
- 각 user-facing packet은 selected archetype과 그 archetype을 고른 이유를 먼저 선언한다.
- selected archetype이 `unknown`이거나 deviation status가 `pending`이면 design hold를 유지한다.
- archetype contract는 core에서 제품 유형과 deviation rule만 제공하고, 실제 화면별 copy, one-off interaction, project-specific layout detail은 packet과 detailed design에서 닫는다.
- 반복되는 archetype package가 커지면 optional profile로 분리하고, core에는 catalog와 approval boundary만 남긴다.

## Must Preserve
- `Decision Required`, `Blocked / At Risk`, `Current Focus`, `Next Action` 4-surface
- strong surface는 short summary만 노출
- decision 관련 surface는 권장 판단과 충분한 근거를 함께 전달해야 한다.
- detail은 full list / impact / source trace 제공
- artifact viewer는 읽기 품질 우선
- settings는 얇은 local registry 관리 면으로 유지
- visible summary는 실제 source section 또는 DB-backed read model에 매핑되어야 한다.
- mockup은 구현 시 필요한 empty, error, diagnostics, source trace 상태를 숨기지 않는다.

## Visual Direction
- low-noise hero
- compact 4-card rail
- active detail panel
- drawer-based artifact viewer / settings

## Mockup Contract
- mockup component 이름과 설명은 implementation plan vocabulary와 맞춘다.
- mockup은 선택한 UX archetype의 정보 우선순위와 interaction bias를 실제 surface에 반영해야 한다.
- 카드, detail, viewer, settings는 실제 데이터 흐름과 read-only 경계를 반영한다.
- 결정 카드와 패널은 사용자가 raw trade-off를 다시 해석하지 않게, 권장 결론과 근거가 함께 보이도록 설계한다.
- rough mockup 승인만으로 최종 화면 구현 승인이 된 것으로 간주하지 않는다.
- 실제 구현 전에는 task-level detailed design에서 레이아웃, 상태, 문구, interaction, empty/error case, source trace fallback을 다시 닫아야 한다.
- task-level detailed design 정리는 `PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`를 기본 형식으로 사용한다.
- archetype에서 벗어나는 navigation, density, write affordance, decision ordering은 approved deviation으로 기록한다.
- 사용자가 직접 체감하는 `프로그램 기능과 UI/UX` 변경은 상세 디자인 확인 없이 훅 구현하고 나중에 롤백하는 흐름을 허용하지 않는다.
- placeholder interaction만 있는 화면은 승인 가능한 목업으로 보지 않는다.
- design review는 시각 품질뿐 아니라 source-to-surface mapping과 상태 전이를 함께 확인한다.
- mockup review에는 first-view comprehension check와 source trace fallback 경로가 포함되어야 한다.

## Hard Rules
- raw technical prose direct projection 금지
- count/detail parity 필수
- diagnostics top-banner 기본값 금지
- PMW write action 금지
- decision surface는 쉬운 판단을 위해 압축하되, 왜 그 판단이 나왔는지 source trace 없이 숨기지 않는다.
- mockup과 implemented UI는 같은 source-to-surface mapping과 concrete behavior contract를 공유해야 한다.
- stale 상태가 감지되면 사용자는 현재 view가 freshness issue를 가진다는 사실을 읽을 수 있어야 한다.
- rough design에서 비어 있던 `프로그램 기능과 UI/UX` detail을 코드에서 임의 확정하지 않는다.
