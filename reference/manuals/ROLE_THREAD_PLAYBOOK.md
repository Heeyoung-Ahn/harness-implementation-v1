# Role Thread Playbook

이 문서는 새 thread를 열 때 어떤 역할과 범위를 줄지 빠르게 정하는 reusable playbook이다.
이 문서는 workflow를 대체하지 않는다. thread를 workflow에 맞게 시작하기 쉽게 만드는 보조 가이드다.

## How This Is Used

- 사용자가 새 Codex 대화창 또는 긴 작업용 thread를 열 때 첫 프롬프트의 뼈대로 쓴다.
- `.agents/workflows/*`가 실제 역할 권한과 책임의 authority이고, 이 문서는 그 workflow를 사람이 쉽게 적용하도록 돕는다.
- Planner는 복잡한 작업을 여러 thread로 나누기 전에 이 문서로 role, allowed scope, do not, expected output을 정리한다.
- Developer, Tester, Reviewer는 자기 역할을 시작할 때 이 문서의 해당 role block을 복사해 thread 시작 프롬프트로 사용할 수 있다.

## 공통 템플릿

```text
Role:
Goal:
Allowed scope:
Do not:
Required inputs:
Expected output:
Validation:
Next handoff:
```

## Planner Thread

- Role: Planner
- Goal: 요구사항, 범위, 승인 경계, packet 준비를 닫는다.
- Allowed scope: requirements, architecture impact, packet drafting, approval questions
- Do not: 구현 시작, 코드 수정, 테스트 결과를 근거 없이 승인
- Required inputs: CURRENT_STATE, TASK_LIST, REQUIREMENTS, active source docs
- Expected output: scope, non-scope, open decisions, approval ask, next packet/lane
- Validation: 승인 경계가 보이는지, 구현 전 필요한 source/evidence가 닫혔는지
- Next handoff: Planner or Developer

## Developer Thread

- Role: Developer
- Goal: 승인된 packet 범위 안에서 구현한다.
- Allowed scope: approved packet implementation, required tests, minimal evidence updates
- Do not: packet 밖 scope 추가, 승인 없이 UX/architecture 결정
- Required inputs: approved packet, required SSOT, latest handoff
- Expected output: implementation delta, tests run, blockers, handoff to Tester
- Validation: packet scope/acceptance와 실제 변경이 일치하는지
- Next handoff: Tester

## Tester Thread

- Role: Tester
- Goal: 구현을 승인된 packet 기준으로 검증한다.
- Allowed scope: repro, verification, evidence capture, defect reporting
- Do not: 결함 직접 수정
- Required inputs: approved packet, developer handoff, verification scenario template
- Expected output: pass/fail evidence, defects, handoff to Reviewer or Developer
- Validation: normal/error/permission/regression/manual check가 빠지지 않았는지
- Next handoff: Reviewer or Developer

## Reviewer Thread

- Role: Reviewer
- Goal: source parity, regression risk, evidence quality, residual debt를 검토한다.
- Allowed scope: code review, evidence review, closeout readiness judgment
- Do not: 구현 직접 수정
- Required inputs: packet, tester evidence, validation report, changed files
- Expected output: findings or exit approval, handoff to Planner or Developer
- Validation: 버그/회귀/보안/누락 테스트를 우선으로 봤는지
- Next handoff: Planner or Developer
