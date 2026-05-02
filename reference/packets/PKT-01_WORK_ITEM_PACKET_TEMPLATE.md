# PKT-01 Work Item Packet Template

## Purpose
이 문서는 한 개의 구현 작업을 코드 착수 전에 다시 닫기 위한 task-level planning/design packet template이다. rough baseline 승인만으로 바로 구현하지 않게 하고, 특히 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`는 인간과 충분히 협의한 뒤 구현하게 만드는 것이 목적이다.

## Approval Rule
- 이 packet은 구현 전에 작성한다.
- 이 packet은 먼저 `Core / Optional Profile / Project Packet` 중 어디에 속하는지 판정한다.
- 이 packet은 `light / standard / contract / release` 중 하나의 Gate profile을 선언하고 profile별 required evidence를 닫는다.
- one-or-more active optional profiles가 있으면 approved profile references와 required profile-specific evidence 없이는 `Ready For Code`로 올리지 않는다.
- declared optional profiles가 둘 이상이면 `Profile composition rationale`과 각 profile의 required evidence 합집합이 닫히기 전에는 `Ready For Code`로 올리지 않는다.
- `프로그램 기능과 UI/UX`를 건드리는 작업은 human sync 또는 approval 없이는 `Ready For Code`로 올리지 않는다.
- user-facing 작업은 approved UX archetype reference와 selected archetype 선언 없이 `Ready For Code`로 올리지 않는다.
- user-facing 작업에서 UX deviation이 있으면 approved deviation rationale 없이는 `Ready For Code`로 올리지 않는다.
- deploy/test/cutover 작업은 approved environment topology reference 없이 `Ready For Code`로 올리지 않는다.
- deploy/test/cutover 작업에서 execution target 또는 rollback boundary가 `unknown`이면 `Ready For Code`로 올리지 않는다.
- data-impact 작업은 approved domain foundation reference 없이 `Ready For Code`로 올리지 않는다.
- DB 설계가 있는 작업은 사용자 DB 설계 확인 없이 `Ready For Code`로 올리지 않는다.
- 기존 프로그램과 연동되면 기존 DB schema 또는 동등한 authoritative schema artifact를 먼저 확보하거나, 미확보 이유를 blocker로 올린다.
- 새 기획 문서, 정책, 연동 명세가 active work에 영향을 주면 approved authoritative source intake reference와 conflict / impact analysis 없이 `Ready For Code`로 올리지 않는다.
- 새 기획 문서를 접수하면 authoritative source impact와 충돌 분석을 먼저 다시 연다.
- 한 authoritative source change가 여러 open packet에 동시에 영향을 주면 approved `Authoritative source wave ledger reference`와 impacted packet set scope / packet disposition 없이는 `Ready For Code`로 올리지 않는다.
- 구현 중 새 detail이 생기면 이 packet을 다시 열고 sync한 뒤 진행한다.
- 이 template로 만든 concrete packet을 `reference/packets/` 아래에 두면 같은 lane에서 `artifact_index`에 category `task_packet`으로 등록한다. 미등록이면 validator가 fail-fast 한다.
- 구현이 끝난 packet은 approved packet exit quality gate reference와 exit recommendation 없이 close하지 않는다.
- source parity status 또는 validation / cleanup status가 `unknown`이거나 unresolved UX / topology / schema confusion이 남아 있으면 packet closeout hold를 유지한다.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | [작업 이름] | [왜 지금 하는지] | draft |
| Ready For Code | approve / adjust / hold | [코드 착수 가능 여부 근거] | draft |
| Human sync needed | yes / no | [왜 필요한지] | draft |
| Gate profile | light / standard / contract / release | [필요한 검증 강도] | draft |
| User-facing impact | none / low / medium / high | [영향 영역] | draft |
| Layer classification | core / optional profile / project packet | [어디에 속하는지] | draft |
| Active profile dependencies | none / [profile ids] | [왜 필요한지] | draft |
| Profile evidence status | not-needed / pending / approved | [active profile-specific evidence 충족 여부] | draft |
| UX archetype status | not-needed / pending / approved | [user-facing 기준 충족 여부] | draft |
| UX deviation status | none / pending / approved | [기본 archetype에서 벗어나는지] | draft |
| Environment topology status | not-needed / pending / approved | [deploy/test/cutover 기준 충족 여부] | draft |
| Domain foundation status | not-needed / pending / approved | [data-impact 기준 충족 여부] | draft |
| Authoritative source intake status | not-needed / pending / approved | [source intake 기준 충족 여부] | draft |
| Shared-source wave status | not-needed / pending / approved | [multi-packet source wave rebaseline 여부] | draft |
| Packet exit gate status | pending / approved / hold | [closeout gate 준비 여부] | draft |
| Improvement promotion status | none / proposed / pending-review / approved / promoted | [반복 friction 승격 여부] | draft |
| Existing system dependency | none / possible / confirmed | [기존 프로그램 연동 여부] | draft |
| New authoritative source impact | none / pending / analyzed | [새 기획 문서 영향 여부] | draft |
| Risk if started now | low / medium / high | [남아 있는 모호성] | draft |

## 1. Goal
- [이 작업이 해결해야 하는 핵심 목표]

## 2. Non-Goal
- [이번 작업에서 하지 않을 것]

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
- 작업 후 사용자가 체감해야 하는 변화:

## 4. In Scope
- [이번 작업에 포함되는 기능]

## 5. Out Of Scope
- [이번 작업에 포함되지 않는 기능]

## 6. Detailed Behavior
- Trigger:
- Main flow:
- Alternate flow:
- Empty state:
- Error state:
- Loading/transition:

## 7. Program Function Detail
- 입력:
- 처리:
- 출력:
- 권한/조건:
- edge case:

## 8. UI/UX Detailed Design
- Active profile references:
- Profile composition rationale:
- Profile-specific UX / operation contract:
- Primary admin entity / surface:
- Grid interaction model:
- Search / filter / sort / pagination behavior:
- Row action / bulk action rule:
- Edit / save / confirm / audit pattern:
- Profile deviation / exception:
- UX archetype reference:
- Selected UX archetype:
- Archetype fit rationale:
- Archetype deviation / approval:
- 영향받는 화면:
- 레이아웃 변경:
- interaction:
- copy/text:
- feedback/timing:
- source trace fallback:

## 9. Data / Source Impact
- Layer classification:
- Core / profile / project boundary rationale:
- Active profile dependencies:
- Profile-specific evidence status:
- Source spreadsheet artifact:
- Workbook / sheet / tab / range trace:
- Header / column mapping:
- Row key / record identity rule:
- Source snapshot / version:
- Transformation / normalization assumptions:
- Reconciliation / overwrite rule:
- Transfer package / bundle artifact:
- Transfer medium / handoff channel:
- Checksum / integrity evidence:
- Offline dependency bundle status:
- Ingress verification / import step:
- Rollback package / recovery bundle:
- Manual custody / operator handoff:
- Required reading before code:
- Environment topology reference:
- Source environment:
- Target environment:
- Execution target:
- Transfer boundary:
- Rollback boundary:
- Domain foundation reference:
- Schema impact classification:
- DB / state 영향:
- Markdown / docs 영향:
- generated docs 영향:
- validator / cutover 영향:
- Authoritative source refs:
- Authoritative source intake reference:
- Authoritative source disposition:
- New planning source priority / disposition:
- Existing plan conflict:
- Current implementation impact:
- Required rework / defer rationale:
- Impacted packet set scope:
- Authoritative source wave ledger reference:
- Source wave packet disposition:
- Existing program / DB dependency:
- Existing schema source artifact:
- Table / column naming compatibility:
- Data operation / ownership compatibility:
- Migration / rollback / cutover compatibility:
- Product source root:
- Product test root:
- Product runtime requirements:
- Harness/product boundary exceptions:
- Legacy system source inventory:
- VBA module / macro / function inventory:
- MariaDB schema snapshot:
- Query / view / procedure / trigger inventory:
- Scheduled / manual operator steps:
- Current import / export / report paths:
- Source-of-truth ownership:
- Migration / reconciliation plan:
- Parallel-run / reconciliation evidence:
- Python / Django version policy:
- Supported-version / security-support rationale:
- Dependency manager:
- Django project / module boundary:
- Django app / module boundary:
- Settings / environment policy:
- Migration policy:
- DB compatibility policy:
- Transaction / service boundary:
- Auth / permission / admin boundary:
- Background job boundary:
- Test convention:
- Static / media / admin customization boundary:
- State machine artifact:
- Approval rule matrix:
- Role / permission matrix:
- Audit event spec:
- Exception / rollback / reopen rule:
- Runtime / framework:
- Rendering / app mode:
- Data persistence boundary:
- Auth / user identity requirement:
- Deployment target:
- External API / integration boundary:
- Lightweight acceptance:
- Android package namespace:
- Kotlin / Java policy:
- Gradle / AGP version:
- minSdk / targetSdk:
- Signing policy:
- Build variants / flavors:
- Permissions policy:
- Local storage policy:
- Network security / API boundary:
- Navigation structure:
- Offline / sync policy:
- Notification policy:
- Privacy / data policy:
- Device / emulator test plan:
- Release channel:
- Package ownership policy:
- Node.js product runtime policy:
- Package manager:
- Framework / bundler:
- Build command:
- Test command:
- Environment variable policy:
- API / backend boundary:
- Static asset / routing policy:

## 10. Acceptance
- [사용자가 확인 가능한 acceptance 1]
- [사용자가 확인 가능한 acceptance 2]
- [검증 가능한 acceptance 3]

## 11. Open Questions
- [아직 닫히지 않은 질문]

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | yes / no | [owner] | pending | [core/profile/project 판정] |
| Optional profile evidence approval | yes / no | [owner] | pending | [profile paths / required evidence / composition] |
| Spreadsheet source mapping approval | yes / no | [owner] | pending | [workbook/sheet/range/header trace] |
| Airgapped transfer package approval | yes / no | [owner] | pending | [bundle / checksum / handoff] |
| Lightweight app baseline approval | yes / no | [owner] | pending | [runtime / deploy target / acceptance] |
| Android build and release boundary approval | yes / no | [owner] | pending | [namespace / SDK / signing / device test / release channel] |
| Node/frontend package boundary approval | yes / no | [owner] | pending | [package ownership / runtime / build / deploy] |
| Detailed function agreement | yes / no | [owner] | pending | [비고] |
| Detailed UI/UX agreement | yes / no | [owner] | pending | [비고] |
| UX archetype / deviation approval | yes / no | [owner] | pending | [reference path / selected archetype] |
| Environment topology approval | yes / no | [owner] | pending | [reference path / execution target] |
| Domain foundation approval | yes / no | [owner] | pending | [reference path / schema impact] |
| DB design confirmation | yes / no | [owner] | pending | [테이블/컬럼/데이터 운영 승인] |
| Authoritative source disposition approval | yes / no | [owner] | pending | [implemented / deferred / rejected-with-reason] |
| New source incorporation decision | yes / no | [owner] | pending | [신규 기획 문서 반영 범위] |
| Source wave rebaseline approval | yes / no | [owner] | pending | [multi-packet source wave일 때만 작성] |
| Packet exit quality gate approval | yes / no | [owner] | pending | [closeout reference / exit recommendation] |
| Improvement promotion decision | yes / no | [owner] | pending | [target layer / follow-up item] |
| Ready For Code sign-off | yes / no | [owner] | pending | [비고] |

## 13. Implementation Notes
- [구현 시 참고할 제약]

## 14. Verification Plan
- Gate profile:
- Verification manifest:
  - light: canonical artifact update, validator if generated/runtime state is touched, turn-close handoff note
  - standard: approved packet, targeted tests, validator, handoff evidence
  - contract: Ready For Code, root sync, standard-template sync, targeted tests, root test suite, starter test suite, validator, PMW export when applicable, review closeout
  - release: release-baseline parity, packaging/manual evidence, validator, security/cutover evidence where applicable, review closeout
- [어떻게 검증할지]

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference:
- Exit recommendation:
- Implementation delta summary:
- Source parity result:
- Refactor / residual debt disposition:
- UX conformance result:
- Topology / schema conformance result:
- Validation / security / cleanup evidence:
- Deferred follow-up item:
- Improvement candidate reference:
- Proposed target layer:
- Promotion status / linked follow-up item:
- Closeout notes:

## 16. Reopen Trigger
- 아래 상황이 생기면 packet을 다시 연다.
- 사용자-facing detail이 새로 생김
- 상태 전이 또는 화면 구성이 바뀜
- acceptance가 달라짐
- 새 authoritative source 기획 문서가 들어옴
- shared-source wave ledger의 impacted packet set 또는 rebaseline status가 바뀜
- 기존 프로그램 연동 범위 또는 DB compatibility 판단이 바뀜
- active profile dependencies 또는 profile-specific contract가 바뀜
- workbook / sheet / tab / range trace 또는 header mapping이 바뀜
- transfer package, checksum evidence, offline bundle, or custody handoff가 바뀜
- source parity 또는 cleanup evidence 판단이 바뀜
- 반복 friction의 promotion target이나 disposition이 바뀜
- human approval boundary가 바뀜
