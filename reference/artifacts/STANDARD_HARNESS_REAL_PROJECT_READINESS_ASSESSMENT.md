# Standard Harness Real Project Readiness Assessment

## Purpose

- 목적: 2026-05-04 기준 이 하네스 템플릿이 실제 복잡한 개발 프로젝트를 안정적으로 완수할 수 있는지, 현재 baseline과 최근 hardening 결과를 기준으로 평가한다.
- 범위: planner 관점의 readiness assessment. 구현 변경이 아니라 `실제 프로젝트 시작 가능성`, `남아 있는 리스크`, `바로 붙여야 할 운영 규칙`, `다음 follow-up 우선순위`를 정리한다.

## Evidence Base

### Live verification

- root `npm.cmd test`: 48/48 pass
- root `npm.cmd run harness:validate`: `ok: true`, `cutoverReady: true`, findings `[]`
- root `npm.cmd run harness:context`: pass

### Recently closed hardening

- `OPS-04` closed after Developer, Tester, Reviewer, Planner closeout
- copied-starter smoke for `init/context/next/handoff/validate` already passed during `OPS-04`
- `ACTIVE_CONTEXT` first-read contract, freshness/parity validation, and mandatory closeout validation gating are in place

### Historical simulation and remediation evidence

- [STANDARD_HARNESS_PROJECT_SIMULATION_PLAYBOOK.md](/C:/Newface/30%20Github/harness-implementation-v1/reference/artifacts/STANDARD_HARNESS_PROJECT_SIMULATION_PLAYBOOK.md)
- [STANDARD_HARNESS_WBMS_SIMULATION_REPORT.md](/C:/Newface/30%20Github/harness-implementation-v1/reference/artifacts/STANDARD_HARNESS_WBMS_SIMULATION_REPORT.md)
- `SIM-01`, `SIM-02`, `SIM-03`, `REV-03` are recorded as closed in the live baseline and their controls are now reflected in requirements, architecture, validator, and starter sync

## Executive Verdict

| Item | Verdict |
|---|---|
| Overall verdict | `go with controls` |
| Best-fit project class | single-repo, planner-led, approval-heavy, legacy/source-sensitive internal product |
| Safe to start first real complex project now | yes, if operator controls below are adopted |
| Safe to scale immediately to broad/org-wide default | not yet |
| Biggest strength | planning hold, source-governance, packet gating, user-facing state explanation |
| Biggest remaining weakness | governance overhead is still meaningful, and evidence quality/CI automation is not strong enough yet for unattended scale |

한 줄 결론은 이렇다. 이 하네스는 `복잡한 프로젝트를 시작하고 통제하는 데는 충분히 쓸 수 있다`. 다만 `여러 팀/긴 기간/자주 바뀌는 요구사항/엄격한 릴리즈 절차`까지 자동으로 매끈하게 흡수하는 수준으로 완성됐다고 보기는 이르다. 첫 실전 투입은 가능하지만, `pilot with controls`가 맞다.

## Scenario Assessment

### 1. WBMS급 레거시 대체 프로젝트

| Check | Assessment |
|---|---|
| Start verdict | `go with controls` |
| Why it fits | domain/source/topology hold가 강하고, schema confirmation, source intake, source-wave ledger, packet exit gate가 이미 core contract로 들어가 있다 |
| What improved since old WBMS simulation | old finding이던 multi-profile, task-packet discovery, shared-source rebaseline은 `SIM-01~03`로 baseline에 반영됐다 |
| Remaining risk | 문서/packet 수가 많아질수록 operator discipline이 중요하고, 운영 부담이 낮지는 않다 |

판단: 이 하네스가 가장 잘 맞는 대표 시나리오다. 특히 `기존 DB schema`, `workbook source`, `승인 절차`, `cutover/rollback`을 늦게 확인해서 망가지는 유형을 잘 막는다.

### 2. 중간에 요구사항이 자주 바뀌는 제품 개발

| Check | Assessment |
|---|---|
| Start verdict | `go with controls` |
| Why it fits | authoritative source intake, source-wave ledger, packet reopen/adjust discipline이 이미 계약화돼 있다 |
| Good behavior expected | 새 기획 문서가 들어오면 기존 구현 안정성을 핑계로 미루지 않고 즉시 영향 평가를 건다 |
| Remaining risk | 영향 받는 packet 수가 많아질수록 사람 승인과 재정렬 시간이 길어질 수 있다 |

판단: 요구사항 변경 수용성은 높은 편이다. 다만 이건 `자동 흡수`가 아니라 `강한 재계획 강제`에 가깝다. 즉 유연성은 높지만, 속도 비용도 있다.

### 3. 프로젝트가 커졌을 때의 context 유지

| Check | Assessment |
|---|---|
| Start verdict | `partial go` |
| Strength | `ACTIVE_CONTEXT` first-read, `mustReadNext`, `sourceTrace`, latest handoff, next workflow route가 있어 재진입 품질은 분명히 좋아졌다 |
| Hard fact | `ACTIVE_CONTEXT.json`은 약 4.7 KB / 105 lines인데, `REQUIREMENTS.md` 51.9 KB / 374 lines, `ARCHITECTURE_GUIDE.md` 30.7 KB / 244 lines, `IMPLEMENTATION_PLAN.md` 76.9 KB / 814 lines다 |
| Meaning | compact re-entry surface는 생겼지만, planner lane이 큰 기준 문서 셋을 계속 참조해야 하는 구조 자체는 여전히 무겁다 |
| Residual issue | 이번 확인에서 `VALIDATION_REPORT.json`에는 `executedAt`이 있는데 `harness:context` 출력의 `context.validation.executedAt`은 `null`이었다 |

판단: `세션 시작 문맥 복원`은 실전 가능 수준까지 왔다. 하지만 `프로젝트가 매우 커진 뒤 장시간 유지`까지 완전히 안심할 수준은 아니다. 긴 프로젝트일수록 `ACTIVE_CONTEXT`를 먼저 읽고, 큰 기준 문서는 active task 범위만 선별해서 다시 읽는 discipline이 계속 필요하다.

### 4. 사용자 진행 안내와 의사결정 지원

| Check | Assessment |
|---|---|
| Start verdict | `go` |
| Strength | Korean human-facing SSOT, `Current Work / Next Work`, packet decision headers, validation report, walkthrough, review report가 분리돼 있다 |
| Strength | `ACTIVE_CONTEXT.md`와 CLI `status/next/explain/context`만으로도 현재 판단 지점 설명력이 높다 |
| Remaining risk | 정보는 충분한데 문서가 많아서, 작은 프로젝트에는 과잉일 수 있다 |

판단: 이 항목은 현재 하네스의 강점이다. 특히 `사용자가 무엇을 승인해야 하는지`, `왜 멈췄는지`, `다음에 누가 무엇을 해야 하는지`를 설명하는 능력은 높다.

### 5. 경량 앱 또는 빠른 실험 프로젝트

| Check | Assessment |
|---|---|
| Start verdict | `over-governed unless needed` |
| Why it may feel heavy | packet, source, gate, validation, walkthrough, review artifact까지 다 쓰면 작은 프로젝트에는 과도하다 |
| Good use case | lightweight app라도 외부 source, 승인, data-impact, cutover가 있으면 하네스 이점이 생긴다 |
| Risk | 그냥 빠른 프로토타입인데 복잡한 baseline 전체를 다 적용하면 속도와 토큰 비용이 체감될 수 있다 |

판단: 이 하네스는 `작은 앱도 가능`하지만, 본질적으로 `복잡성을 통제하기 위한 도구`다. 작은 프로젝트에서 기본값으로 쓰면 효율이 떨어질 수 있다.

### 6. 릴리즈, 보안, 반입/폐쇄망 전달

| Check | Assessment |
|---|---|
| Start verdict | `planning-go / release-hold` |
| Strength | topology contract, cutover discipline, rollback boundary, airgapped profile contract는 이미 강하다 |
| Missing depth | dependency inventory, secret scan, release artifact audit hardening은 `OPS-05`가 아직 남아 있다 |
| Decision | 내부 pilot 개발은 가능하지만, 외부 배포나 보안 민감 릴리즈 전에는 `OPS-05`가 선행되는 편이 안전하다 |

## Focused Evaluation

| Focus area | Score | Assessment |
|---|---|---|
| Context continuity | 4/5 | `OPS-04` 이후 확실히 강해졌지만, 장기 대형 프로젝트에서는 큰 baseline reread 부담과 작은 parity bug가 아직 남아 있다 |
| Harness overhead | 3/5 | 복잡한 프로젝트에는 감수 가능한 수준이지만, 작은 프로젝트에는 무겁다 |
| Requirement-change scalability | 4/5 | source intake, source-wave ledger, packet reopen discipline이 강하다 |
| User progress communication | 4.5/5 | Korean SSOT, `Current Work / Next Work`, CLI/context surface가 잘 설계돼 있다 |
| Decision-support evidence | 4/5 | packet header, validation report, walkthrough, review report가 좋다. 다만 CI/eval 자동화는 더 필요하다 |

## Objective Findings

### Finding 1. 이 하네스는 `복잡한 단일 프로젝트`에 대해서는 이미 실전 투입 가능하다

- 근거: root test green, validator clean, copied-starter smoke history clean, simulation-derived reusable gaps closed
- 의미: `복잡해서 실패하는 이유`를 사전에 멈추는 힘은 충분하다

### Finding 2. 가장 큰 현재 비용은 `문맥 비용`보다 `거버넌스 운영 비용`이다

- `ACTIVE_CONTEXT` 자체는 충분히 작다
- 진짜 비용은 packet, source intake, ledger, quality gate, review artifact를 꾸준히 유지하는 운영 discipline이다
- 따라서 이 하네스의 병목은 단순 토큰 크기보다 `사람/에이전트가 운영 절차를 얼마나 성실히 지키느냐`에 더 가깝다

### Finding 3. 요구사항 변경 대응은 강하지만, 그만큼 `replanning latency`가 있다

- 이 하네스는 변경을 무시한 채 계속 달리는 것을 막는 구조다
- 반대로 말하면 변경이 잦을수록 planning hold와 packet reopen이 자주 발생한다
- 즉 `유연하다`기보다 `안전하게 재정렬한다`가 더 정확한 표현이다

### Finding 4. 사용자 설명력과 의사결정 지원은 강점이다

- Korean human-facing contract
- `Current Work / Next Work`
- packet decision header
- walkthrough/review/validation artifact 분리

이 조합은 사용자가 “지금 무엇을 결정해야 하는지”를 이해하는 데 실제로 도움이 된다.

### Finding 5. 작은 parity bug도 아직 남아 있다

- 관찰: `VALIDATION_REPORT.json`에는 `executedAt`이 있지만, 방금 실행한 `harness:context` 결과의 `context.validation.executedAt`은 `null`이었다
- 의미: 현재 하네스는 usable하지만, `derived context가 항상 evidence와 완전히 같은 말을 하는가`라는 마지막 신뢰도 면에서 아직 잔차가 있다
- 권고: 이 항목은 다음 quality follow-up에서 바로 닫는 편이 좋다

## Recommended Operator Controls If Starting Now

1. 첫 실전 프로젝트는 `pilot 1개`로 시작한다. 여러 실프로젝트를 동시에 표준 기본값으로 확산하지 않는다.
2. major requirement change는 반드시 authoritative source intake와 source-wave ledger를 함께 연다.
3. handoff나 planner closeout 뒤에는 `harness:context`를 재생성하고, next owner가 그 compact surface부터 읽게 한다.
4. work item이 길어지면 active packet 하나를 중심으로 읽고, closed packet history는 필요한 순간에만 다시 펼친다.
5. 외부 배포, 보안 민감 릴리즈, 폐쇄망 전달이 본격화되면 `OPS-05`를 먼저 닫는다.
6. 여러 사람이 동시에 신뢰할 수 있는 evidence quality와 CI/PR gating이 필요해지면 `QLT-02`를 먼저 닫는다.

## Recommendation

### Start recommendation

- 추천 판정: `start the first real complex project`
- 단서: `pilot with controls`

### Next follow-up priority

1. `QLT-02`
2. `OPS-05`

이 순서를 추천하는 이유는 단순하다.

- 지금 사용자가 묻는 핵심은 `정말 복잡한 프로젝트를 끝까지 끌고 갈 수 있는가`다.
- 그 질문에 가장 직접적으로 연결되는 건 `evidence quality`, `semantic validation`, `agent eval/trace`, `CI/PR integration`이다.
- 반면 `OPS-05`는 중요하지만, `외부 릴리즈/보안/배포 hardening` 성격이 더 강하다.

즉 `첫 실전 복잡 프로젝트 kickoff 전`에는 `QLT-02`가 더 직접적인 리스크 절감이다.  
`첫 외부/보안 민감 릴리즈 전`에는 `OPS-05`가 필수다.
