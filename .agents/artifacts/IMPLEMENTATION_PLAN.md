# Implementation Plan

## Summary
새 구현은 `deep interview -> requirements final approval -> architecture / implementation / UI sync -> logic-backed rough mockup -> per-work-item detailed planning/design approval -> implementation -> generated docs/read model/PMW/cutover -> refactor/security/review gate` 순서로 진행한다.

## Phase Plan
1. deep interview로 requirements 핵심 이슈 폐쇄
2. 사용자 final confirmation으로 baseline requirements freeze
3. architecture / implementation / UI 문서 sync
4. rough 수준의 design direction과 global behavior contract 확정
5. 각 work item별 상세 기획 / 상세 디자인 / approval packet 작성
6. DB foundation 구현
7. generated state docs와 drift validator 구현
8. context restoration read model 구현
9. PMW summary/detail/artifact viewer 구현
10. validator / migration / cutover 구현
11. per-packet refactor / security review / release gate
12. review와 self-hosting adoption 판단

## Initial Task Skeleton
- PLN-00 deep interview using `PLN-00_DEEP_INTERVIEW.md` until implementation-critical issues close
- PLN-01 user-friendly requirements freeze
- PLN-02 post-approval architecture / implementation / UI sync
- DSG-01 rough mockup and global behavior contract
- PKT-01 per-work-item planning and design approval contract using `PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- Current active packet candidate: `PKT-01_DEV-04_PMW_READ_SURFACE.md`
- DEV-01 DB schema and store foundation
- DEV-02 generated state docs and drift validator
- DEV-03 context restoration read model
- DEV-04 PMW read surface
- DEV-05 validator and cutover tooling
- OPS-01 self-improvement promotion workflow
- QLT-01 per-packet refactor checkpoint
- SEC-01 security review and remediation
- TST-01 generated docs parity
- TST-02 PMW browser UX and 30-second comprehension check
- REV-01 architecture / review gate

## PLN-00 Execution
### Goal
`REQUIREMENTS.md`의 open question을 baseline decision으로 닫아 downstream 문서와 구현이 같은 가정을 공유하게 만든다.

### Input
- `REQUIREMENTS.md` open questions
- `PROTOTYPE_REFERENCE.md` carry-forward contract
- `HARNESS_FULL_DESIGN_REVIEW.md` first-ship direction
- `PLN-00_DEEP_INTERVIEW.md` recommended baseline and closure format

### Output
- 각 implementation-critical issue에 대한 `approve`, `adjust`, `defer` 결정
- 각 결정에 대한 한 줄 권장 결론과 핵심 근거
- `defer` 항목의 owner, follow-up timing, temporary rule
- `PLN-01` requirements freeze에 바로 반영 가능한 decision packet

### Exit Criteria
- DB minimal scope가 닫힌다.
- validator first-ship scope가 닫힌다.
- artifact viewer mandatory scope가 닫힌다.
- inefficiency capture ownership이 닫힌다.
- security review automation level이 닫힌다.

## PKT-01 Execution
### Goal
각 구현 작업이 rough baseline만으로 바로 코드로 넘어가지 않게 하고, 작업 단위별 상세 기획과 상세 디자인, human approval boundary를 먼저 닫는다.

### Input
- `REQUIREMENTS.md` frozen baseline
- `ARCHITECTURE_GUIDE.md` synced architecture contract
- `UI_DESIGN.md` rough/detailed design rule
- `PKT-01_WORK_ITEM_PACKET_TEMPLATE.md` task-level packet template
- 해당 work item의 mockup, source mapping, related docs

### Output
- 코드 착수 전 승인 가능한 task-level packet
- 작업 범위, 상세 동작, 상태/화면 변화, acceptance, human sync point
- user-facing 작업의 detailed design agreement

### Exit Criteria
- work item goal과 non-goal이 닫힌다.
- detailed behavior와 state/screen changes가 닫힌다.
- user-facing 작업이면 detailed UI/UX agreement가 닫힌다.
- acceptance와 human approval boundary가 기록된다.
- approval 없이 남은 user-facing detail이 없어진다.

## Validation Rules
- requirements open issue는 deep interview lane에서 닫고, downstream 문서에는 가정으로 흘리지 않는다.
- 사용자가 결정을 내려야 하는 planning packet은 `권장 결론 -> 핵심 근거 -> 조정 조건 -> defer fallback` 순서로 작성해 빠르게 판단할 수 있게 만든다.
- `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `UI_DESIGN.md`는 requirements 승인 후에만 baseline으로 작성하거나 재정렬한다.
- rough mockup은 실제 source, state, empty/error case, read-only boundary를 표현해야 하지만, 이것만으로 각 작업의 최종 UI/behavior 구현 승인이 되지는 않는다.
- 각 구현 작업은 코드 착수 전에 task-level packet으로 다시 구체화한다.
- task-level packet은 작업 목적, 상세 동작, 상태 변화, 화면 변화, 데이터 영향, edge case, acceptance, human approval boundary를 포함해야 한다.
- task-level packet은 기본적으로 `PKT-01_WORK_ITEM_PACKET_TEMPLATE.md` 형식을 따른다.
- 사용자가 직접 체감하는 `프로그램 기능과 UI/UX` 변경은 task-level 상세 기획과 상세 디자인에 대한 인간 협의 또는 승인 없이 구현하지 않는다.
- 구현 도중 새로운 사용자-facing detail이 나오면 바로 코드로 닫지 않고 packet을 다시 열어 sync한다.
- context restoration은 정의된 load order를 따라야 하며, source trace 없는 복원은 complete로 보지 않는다.
- drift validator는 DB truth, generated docs, designated summary mismatch를 탐지하고 stale 상태를 올려야 한다.
- source 없는 summary는 strong surface에 올리지 않는다.
- count badge는 visible detail list와 같아야 한다.
- generated docs는 deterministic ordering을 유지한다.
- self-improvement candidate는 human review 전까지 baseline change로 승격하지 않는다.
- 각 DEV packet 종료 시 refactor note와 security review result를 남긴다.
- cutover는 rollback path와 unresolved critical security finding 없이 진행하지 않는다.
- UX acceptance는 지정 reviewer가 first view만으로 30초 안에 `decision`, `blocker`, `next action` 세 질문에 답하는지로 확인한다.

## Per-Work-Item Execution Loop
1. rough baseline에서 이번 작업이 해결해야 할 범위를 자른다.
2. `PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`를 사용해 task-level packet으로 목표, 비범위, 상세 동작, 상태/화면 변화, edge case, acceptance를 구체화한다.
3. 작업이 사용자가 직접 체감하는 `프로그램 기능과 UI/UX`를 건드리면 상세 기능 기획, 상세 화면 설계, state transition을 인간과 sync한다.
4. approval boundary가 닫힌 뒤에만 코드를 구현한다.
5. 구현 중 새 요구나 새 화면 detail이 생기면 packet을 다시 열고 sync한 뒤 계속한다.
6. 구현 후 refactor, security review, UX check를 통과시킨다.

## Operator Next Action
- Start DEV-05 validator / migration / cutover tooling from the browser-verified DEV-04 PMW baseline.
- Define validator coverage, migration preview, rollback path, and cutover preflight entrypoints in code and docs.
- Keep the PMW read surface read-only and preserve the verified overview tabs, fixed 4-card grid, artifact preview, and diagnostics hierarchy while DEV-05 is implemented.
- Run tooling tests and preflight verification before any cutover decision.
