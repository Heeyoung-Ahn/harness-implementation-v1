# PKT-01 DEV-06 Standard Template Hardening

## Purpose
이 packet은 `standard-template/`를 실제 업무에 바로 투입하기 전에, 부트스트랩 진입점 안정성, shipped test green 상태, review/test artifact 템플릿 완성도, 그리고 stub-only shipped file 정리를 한 lane 안에서 닫기 위한 concrete hardening packet이다.

## Approval Rule
- 이 packet은 reusable starter behavior와 shipped review/test contract를 변경하므로, `standard-template/`과 root reusable contract를 같은 lane에서 함께 맞춘다.
- Node runtime preflight, shipped test fixture, review/test artifact template, shipped stub file disposition이 닫히기 전에는 `standard-template/`를 real-world-ready로 선언하지 않는다.
- reusable starter entrypoint, review/test workflow input, 또는 validator/test clean contract가 바뀌면 이 packet을 다시 연다.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | DEV-06 standard-template hardening | real-world use 전에 starter 진입 안정성과 shipped review/test contract를 닫아야 한다 | done |
| Ready For Code | approve | 문제와 수정 범위가 이미 review finding으로 구체화되었다 | approved |
| Human sync needed | no | user가 remediation lane 착수와 진행을 이미 승인했다 | approved |
| User-facing impact | none | launcher/test/template hardening이 중심이며 제품 UX 재정의가 아니다 | approved |
| Layer classification | core | reusable starter와 standard review/test contract를 보강하는 core-level maintenance다 | approved |
| Active profile dependencies | none | optional profile activation 없이 수행 가능한 lane이다 | approved |
| Profile evidence status | not-needed | active optional profile이 없다 | approved |
| UX archetype status | not-needed | user-facing archetype gate 대상이 아니다 | approved |
| UX deviation status | none | archetype deviation이 없다 | approved |
| Environment topology status | not-needed | deploy/test/cutover topology contract를 여는 lane이 아니다 | approved |
| Domain foundation status | not-needed | data-impact lane가 아니다 | approved |
| Authoritative source intake status | not-needed | 신규 external planning source intake lane가 아니다 | approved |
| Shared-source wave status | not-needed | multi-packet source-wave rebaseline lane가 아니다 | approved |
| Packet exit gate status | approve | closeout evidence와 검증이 완료되었다 | approved |
| Improvement promotion status | none | 예방 메모 승격 lane는 아니다 | approved |
| Existing system dependency | none | 외부 기존 시스템 연동이 없다 | approved |
| New authoritative source impact | none | 새 authoritative source 영향이 없다 | approved |
| Risk if started now | low | 범위가 작고 검증 경로가 명확하다 | approved |

## 1. Goal
- `INIT_STANDARD_HARNESS.cmd`가 실제로 Node 24+ preflight를 수행하게 만든다.
- `standard-template/`의 shipped test suite를 green 상태로 복구한다.
- review/test lane이 읽는 `REVIEW_REPORT.md`, `WALKTHROUGH.md`를 실사용 가능한 템플릿으로 승격한다.
- shipped stub-only helper file을 삭제 또는 명시적 keep path로 정리한다.

## 2. Non-Goal
- 새로운 optional profile 추가
- PMW UX 재설계
- multi-user sync나 remote orchestration 도입
- 표준 하네스의 layer contract 재정의

## 3. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  copied starter가 낮은 Node 버전에서 친절하게 막히지 않고, shipped test suite도 red 상태이며, review/test lane artifact는 stub 수준이라 실제 운영 전에 신뢰성이 부족하다.
- 작업 후 사용자가 체감해야 하는 변화:
  starter를 복사한 뒤 초기화 진입점이 명확하게 실패/통과하고, shipped tests가 green이며, review/test lane 문서를 바로 템플릿으로 사용할 수 있다.

## 4. In Scope
- `standard-template/INIT_STANDARD_HARNESS.cmd` runtime preflight hardening
- `standard-template/test/context-restoration-read-model.test.js` fixture correction
- `standard-template/reference/artifacts/REVIEW_REPORT.md` template expansion
- `standard-template/reference/artifacts/WALKTHROUGH.md` template expansion
- placeholder-only shipped helper file disposition review

## 5. Out Of Scope
- starter bootstrap UX 전면 개편
- PMW feature 확장
- root architecture contract 변경
- optional profile surface 변경

## 6. Detailed Behavior
- trigger:
  standard-template 실사용 준비 lane가 열리면 이 packet 기준으로 remediation을 수행한다.
- main flow:
  lane open -> concrete fixes -> shipped tests/validator 재검증 -> stub file disposition 결정 -> closeout evidence 기록
- alternate flow:
  stub file이 실제 호출 surface를 가진다면 삭제 대신 구현 또는 keep justification을 남긴다.
- empty state:
  no-op가 아니라 현재 shipped finding 3건을 모두 닫아야 close 가능하다.
- error state:
  `npm test` red, preflight mismatch, template drift가 남아 있으면 lane를 reopen 상태로 유지한다.
- loading/transition:
  없음. local file/code/test lane이다.

## 7. Program Function Detail
- 입력:
  `standard-template/INIT_STANDARD_HARNESS.cmd`, `standard-template/package.json`, `standard-template/test/*`, `standard-template/reference/artifacts/*`, `standard-template/.agents/scripts/*`
- 처리:
  launcher preflight 정정, validator-compatible fixture 보강, formal template 문서 작성, stub file usage/disposition 확인
- 출력:
  passing starter tests, hardened launcher behavior, reusable review/test artifact templates, explicit stub disposition
- 권한/조건:
  standard-template과 필요한 root live artifact를 같은 lane에서 sync한다.
- edge case:
  untouched starter validator는 계속 `starter_bootstrap_pending`이어야 하며, initialized starter는 clean이어야 한다.

## 8. UI/UX Detailed Design
- Active profile references: none
- Profile composition rationale: none
- Profile-specific UX / operation contract: not-needed
- Primary admin entity / surface: none
- Grid interaction model: not-needed
- Search / filter / sort / pagination behavior: not-needed
- Row action / bulk action rule: not-needed
- Edit / save / confirm / audit pattern: not-needed
- Profile deviation / exception: none
- UX archetype reference: not-needed
- Selected UX archetype: not-needed
- Archetype fit rationale: not-needed
- Archetype deviation / approval: none
- 영향받는 화면: none
- 레이아웃 변경: none
- interaction: none
- copy/text: review/test template guidance copy only
- feedback/timing: CLI preflight failure messaging only
- source trace fallback: review findings and test output

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  reusable starter behavior, shipped test trust, and standard review/test artifacts are reusable core maintenance scope다.
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Source spreadsheet artifact: not-needed
- Workbook / sheet / tab / range trace: not-needed
- Header / column mapping: not-needed
- Row key / record identity rule: not-needed
- Source snapshot / version: not-needed
- Transformation / normalization assumptions: not-needed
- Reconciliation / overwrite rule: not-needed
- Transfer package / bundle artifact: not-needed
- Transfer medium / handoff channel: not-needed
- Checksum / integrity evidence: not-needed
- Offline dependency bundle status: not-needed
- Ingress verification / import step: not-needed
- Rollback package / recovery bundle: not-needed
- Manual custody / operator handoff: not-needed
- Required reading before code: `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`, review finding set
- Environment topology reference: not-needed
- Source environment: not-needed
- Target environment: not-needed
- Execution target: not-needed
- Transfer boundary: not-needed
- Rollback boundary: not-needed
- Domain foundation reference: not-needed
- Schema impact classification: none
- DB / state 영향:
  root live state packet/artifact alignment과 optional packet registration may be updated
- Markdown / docs 영향:
  root live artifacts, standard-template review/test templates, starter guidance
- generated docs 영향:
  lane state change 후 root generated docs may need refresh
- validator / cutover 영향:
  starter tests must go green; untouched starter validator behavior remains intentional
- Authoritative source refs: review findings from the standard-template review turn
- Authoritative source intake reference: not-needed
- Authoritative source disposition: not-needed
- New planning source priority / disposition: not-needed
- Existing plan conflict: none
- Current implementation impact:
  shipped launcher behavior, test suite status, review/test template readiness, helper file set
- Required rework / defer rationale:
  P1 issues block real-world readiness and P2 weakens review/test lane completeness
- Impacted packet set scope: single-packet
- Authoritative source wave ledger reference: none
- Source wave packet disposition: none
- Existing program / DB dependency: none
- Existing schema source artifact: not-needed
- Table / column naming compatibility: not-needed
- Data operation / ownership compatibility: not-needed
- Migration / rollback / cutover compatibility: not-needed

## 10. Acceptance
- `standard-template/INIT_STANDARD_HARNESS.cmd`가 Node 24 미만에서 명확한 preflight failure를 낸다.
- `standard-template`에서 `npm test`가 green이다.
- `REVIEW_REPORT.md`와 `WALKTHROUGH.md`가 formal review/test lane template로 바로 사용 가능하다.
- placeholder-only shipped helper file은 삭제 또는 keep rationale가 명시된다.

## 11. Open Questions
- none

## 12. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Layer classification agreement | no | user | closed | core maintenance lane로 진행한다 |
| Optional profile evidence approval | no | user | not-needed | active optional profile이 없다 |
| Spreadsheet source mapping approval | no | user | not-needed | spreadsheet source lane가 아니다 |
| Airgapped transfer package approval | no | user | not-needed | airgapped lane가 아니다 |
| Detailed function agreement | yes | user | closed | review finding set을 remediation scope로 승인했다 |
| Detailed UI/UX agreement | no | user | not-needed | user-facing feature design lane가 아니다 |
| UX archetype / deviation approval | no | user | not-needed | archetype gate 대상이 아니다 |
| Environment topology approval | no | user | not-needed | topology gate 대상이 아니다 |
| Domain foundation approval | no | user | not-needed | data-impact lane가 아니다 |
| DB design confirmation | no | user | not-needed | DB 설계 변경이 없다 |
| Authoritative source disposition approval | no | user | not-needed | external authoritative source lane가 아니다 |
| New source incorporation decision | no | user | not-needed | 신규 기획 intake가 없다 |
| Source wave rebaseline approval | no | user | not-needed | multi-packet source wave가 없다 |
| Packet exit quality gate approval | yes | user | pending | 구현/검증 후 closeout에서 닫는다 |
| Improvement promotion decision | no | user | not-needed | improvement promotion lane가 아니다 |
| Ready For Code sign-off | yes | user | closed | user가 계획 수립 후 진행을 승인했다 |

## 13. Implementation Notes
- launcher preflight는 메시지와 실제 동작이 일치해야 한다.
- test fixture는 profile-aware validator의 current scope를 따라야 한다.
- review/test template는 다른 standard artifact와 비슷한 decision/evidence shape를 가져야 한다.
- placeholder-only shipped helper file은 repo-wide usage search 후 disposition을 정한다.

## 14. Verification Plan
- `npm test` in `standard-template/`
- `npm run harness:validate` in untouched `standard-template/` returns only `starter_bootstrap_pending`
- targeted manual check for Node version preflight branch
- file usage search for placeholder-only shipped helper scripts

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: approve
- Implementation delta summary:
  - launcher now enforces Node 24+ before JS initialization in both root and starter
  - `npm run harness:init` path now enforces the same Node 24 runtime floor through `.agents/scripts/init-project.js`
  - root/starter read-model tests now seed the shared profile-aware validator fixtures, restoring a green shipped test suite
  - starter review/test artifacts now ship as usable templates
  - placeholder-only helper scripts were removed from both root and starter
- Source parity result: aligned for launcher/runtime preflight, shipped test fixture surface, and placeholder-script set; starter-only review/test artifacts are now intentionally hardened as copied-project templates
- Refactor / residual debt disposition: none
- UX conformance result: not-needed
- Topology / schema conformance result: not-needed
- Validation / security / cleanup evidence:
  - `npm test`
  - `npm test` in `standard-template/`
  - `npm run harness:validate` in `standard-template/` returns only `starter_bootstrap_pending`
  - `INIT_STANDARD_HARNESS.cmd --help` in root and `standard-template/`
  - runtime confirmed on Node `v24.13.1`
- Deferred follow-up item: none
- Improvement candidate reference: none
- Proposed target layer: none
- Promotion status / linked follow-up item: none
- Closeout notes: `DEV-06` is closed on 2026-04-24 and `REV-04` can close with no open real-world-readiness finding.

## 16. Reopen Trigger
- launcher preflight contract가 다시 바뀜
- shipped test suite가 다시 red로 돌아감
- review/test workflow가 다른 artifact를 read-first로 요구하게 됨
- placeholder-only shipped helper file의 caller가 새로 발견됨
- real-world readiness closeout 뒤에 새 starter usability blocker가 확인됨
