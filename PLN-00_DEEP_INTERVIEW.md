# PLN-00 Deep Interview Packet

## Purpose
이 문서는 구현 착수 전에 닫아야 하는 implementation-critical issue를 한 번에 확인하기 위한 인터뷰 패킷이다. 목표는 `REQUIREMENTS.md`의 open question을 모호한 상태로 downstream 문서나 코드에 흘리지 않고, first ship 기준선으로 닫거나 명시적으로 defer 하는 것이다.

## Decision Packet Rule
- 이 문서는 사용자가 빠르게 결정할 수 있도록 각 항목을 `권장 결론 -> 핵심 근거 -> 조정이 필요한 경우 -> defer fallback` 순서로 정리한다.
- 사용자가 긴 trade-off를 다시 해석해서 직접 결론을 조합하지 않게 한다.
- 기본값과 예외 조건을 분리해, 특별한 이견이 없으면 바로 `approve` 할 수 있게 만든다.

## Closure Rule
- 각 항목은 `approve`, `adjust`, `defer` 중 하나로 닫는다.
- `defer`를 선택하면 owner, follow-up 시점, 임시 운영 규칙을 함께 남긴다.
- 이 문서에서 닫히지 않은 가정은 `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `UI_DESIGN.md`의 baseline으로 승격하지 않는다.

## How To Use This Packet
1. 먼저 `Quick Decision Sheet`에서 각 항목의 권장 결론만 본다.
2. 이견이 없으면 해당 항목은 `approve`로 닫는다.
3. 예외가 있으면 그 항목의 `조정이 필요한 경우`만 읽고 `adjust` 여부를 결정한다.
4. `defer`는 owner, follow-up 시점, 임시 규칙을 바로 적을 수 있을 때만 고른다.

## Quick Decision Sheet

| Decision Area | Recommended Outcome | Approve If | Adjust If | Main Evidence |
|---|---|---|---|---|
| Minimal DB start scope | `approve` | first ship 목표가 context restoration, generated docs, PMW first view를 닫는 것이라면 | first ship부터 multi-project 선택이나 quality/improvement 구조화 조회가 꼭 필요하다면 | 필수 first-ship 기능은 7개 테이블로 닫히고, 나머지는 manual fallback이 가능하다 |
| First-ship validator scope | `approve` | prototype failure 재발 방지를 먼저 막는 것이 우선이라면 | 규제/운영 요구로 특정 자동검사를 첫 릴리스에 더 넣어야 한다면 | 현재 범위가 실제 실패 재발 방지와 cutover preflight를 가장 직접적으로 덮는다 |
| PMW artifact viewer mandatory scope | `approve` | reading desk가 우선이고 viewer 범위를 억제해야 한다면 | first ship에서 archive/starter/reset까지 꼭 읽어야 한다면 | canonical docs + generated docs + latest handoff면 현재 판단 복원에 충분하다 |
| Inefficiency capture projection | `approve` | dual write drift를 막고 promotion gate를 지키는 것이 우선이라면 | first ship부터 일부 요약을 강하게 노출해야 한다면 | DB single write 후 human-reviewed Markdown promotion이 ownership을 가장 깔끔하게 유지한다 |
| Security review automation level | `approve` | first ship 자동화는 ROI 높은 preflight에 집중하고 최종 판단은 사람이 맡아도 된다면 | threat modeling 수준 자동화가 당장 필요하거나 예산이 확보돼 있다면 | path/file/dependency/secret/cutover preflight가 first ship 자동화 효율이 가장 높다 |

## Interview Questions

### 1. Minimal DB Start Scope
결정 질문: first ship에서 DB를 7개 테이블 최소 집합으로 시작하고, `project_registry`, `improvement_log`, `quality_review_log`는 후속 packet으로 미뤄도 되는가?

권장 결론: `approve`

핵심 근거:
- `release_state`, `work_item_registry`, `decision_registry`, `gate_risk_registry`, `handoff_log`, `artifact_index`, `generation_state`만으로 context restoration, generated docs, PMW first view, drift detection의 first-ship 핵심 기능을 덮을 수 있다.
- 현재 workspace는 single-project thin workspace라서 `project_registry`는 first-ship blocker가 아니다.
- `improvement_log`, `quality_review_log`는 first ship 동안 Markdown/manual fallback으로 운영 가능하다.

조정이 필요한 경우:
- first ship부터 여러 프로젝트를 한 저장소 또는 한 DB에서 전환해야 한다.
- improvement/security/refactor 결과를 AI retrieval 가능한 구조로 즉시 조회해야 한다.

`defer`를 고르면 남겨야 할 것:
- owner
- 추가 결정 시점
- first ship 동안 사용할 Markdown/manual 대체 규칙

응답 옵션:
- `approve`: 7개 테이블로 시작한다.
- `adjust`: `improvement_log` 또는 `quality_review_log`를 first ship에 추가한다.
- `defer`: owner와 추가 시점을 기록하고, first ship 동안은 Markdown/manual 기록으로 대체한다.

### 2. Validator Scope
결정 질문: validator는 prototype failure 재발 방지 항목을 first ship 범위로 고정하고, 보안 자동화는 얕은 preflight까지만 포함해도 되는가?

권장 결론: `approve`

핵심 근거:
- required section presence, source_ref resolve, generated docs parity, checksum/freshness drift, count/detail parity, UTF-8/mojibake, cutover preflight는 실제 실패 재발 방지와 직결된다.
- 이 범위는 downstream 문서, generated docs, PMW read surface가 같은 truth를 읽는지 빠르게 검증한다.
- deeper threat review는 first ship에서 자동화 비용이 크고, human gate로 남겨도 통제 경계가 유지된다.

조정이 필요한 경우:
- 현재 운영 환경에 별도 compliance/security 자동검사가 first ship 필수다.
- 특정 검사 하나가 false positive나 구현 비용 때문에 first ship blocker가 된다.

`defer`를 고르면 남겨야 할 것:
- 빠지는 검사 목록
- release gate에서 대신 수행할 manual checklist
- 누가 언제 다시 자동화 범위를 재논의할지

응답 옵션:
- `approve`: parity/drift/source/mojibake/cutover preflight까지 first ship에 포함한다.
- `adjust`: 특정 검사를 제외하거나 추가한다.
- `defer`: 빠진 검사는 release gate manual checklist로 대체한다.

### 3. Artifact Viewer Scope
결정 질문: artifact viewer는 first ship에서 canonical docs, generated docs, latest handoff만 mandatory로 두고 나머지 viewer는 rollout lane으로 미뤄도 되는가?

권장 결론: `approve`

핵심 근거:
- first ship의 PMW 목표는 reading desk이며, 현재 판단 지점 복원에 필요한 최소 artifact는 canonical docs + generated docs + latest handoff다.
- archive/starter/reset viewer까지 같이 열면 viewer 범위가 넓어져 UI lane과 rollout lane이 불필요하게 결합된다.
- latest handoff를 포함하면 세션 전환 시 바로 최근 맥락까지 복원할 수 있다.

조정이 필요한 경우:
- first ship 운영자가 archive나 starter 문서를 viewer에서 즉시 읽어야만 판단할 수 있다.
- 특정 운영 artifact가 없으면 handoff나 release review가 실제로 막힌다.

`defer`를 고르면 남겨야 할 것:
- viewer 범위를 확정할 owner
- 범위 재검토 시점
- 그 전까지 strong surface만으로 운영하는 임시 규칙

응답 옵션:
- `approve`: 필수 문서 집합만 우선 지원한다.
- `adjust`: 반드시 처음부터 보여야 하는 artifact를 추가 지정한다.
- `defer`: viewer 범위 확정 전까지 PMW strong surface만 우선 구현한다.

### 4. Inefficiency Capture Ownership
결정 질문: 반복 비효율 기록은 DB에서 구조화해 수집하고, 사람 승인 후 승격된 항목만 Markdown 요약으로 올리는 방식이 괜찮은가?

권장 결론: `approve`

핵심 근거:
- raw capture를 DB truth로 고정하면 AI retrieval과 누적 패턴 분석이 쉬워진다.
- Markdown은 사람이 읽고 승인해야 하는 요약/승격 결과만 담는 쪽이 ownership이 명확하다.
- raw friction을 DB와 Markdown에 동시에 직접 쓰기 시작하면 같은 사건을 두 곳에서 맞춰야 하는 drift가 바로 생긴다.

조정이 필요한 경우:
- first ship부터 운영자가 Markdown summary만 읽고도 friction을 계속 판단해야 한다.
- 일부 friction category는 DB 없이도 사용자-facing summary에 즉시 보여야 한다.

`defer`를 고르면 남겨야 할 것:
- manual note를 남길 위치
- promotion review owner
- DB capture 전환 시점

응답 옵션:
- `approve`: DB capture -> human review -> Markdown promotion 순서로 고정한다.
- `adjust`: first ship부터 dual projection을 일부 허용한다.
- `defer`: first ship에는 friction capture를 manual note로만 운영한다.

### 5. Security Review Automation Level
결정 질문: first ship에서는 자동화 범위를 얕은 preflight 수준으로 제한하고, 핵심 보안 판단은 human review gate에 남겨도 되는가?

권장 결론: `approve`

핵심 근거:
- path/file operation, dependency inventory, secret scan, cutover rollback presence는 자동화 비용 대비 효과가 큰 first-line 검사다.
- 이 범위만 자동화해도 명백한 실수와 누락을 release 전 빠르게 잡을 수 있다.
- threat modeling이나 exception acceptance는 문맥 판단이 크기 때문에 human review gate로 남겨야 통제 경계가 선다.

조정이 필요한 경우:
- 특정 보안 요구사항 때문에 first ship부터 추가 정적 분석이나 정책 검사가 필수다.
- 운영 환경상 manual gate만으로는 놓칠 가능성이 큰 고정 패턴이 이미 확인됐다.

`defer`를 고르면 남겨야 할 것:
- 강화된 manual checklist
- security sign-off owner
- 자동화 재도입 목표 시점

응답 옵션:
- `approve`: 자동 검사는 preflight 위주, 최종 판단은 manual gate로 유지한다.
- `adjust`: secret/dependency/path 외 추가 자동검사를 first ship에 포함한다.
- `defer`: 자동화 없이 전부 manual checklist로 운영하되 release gate를 강화한다.

## Freeze Exit Criteria
- 위 5개 항목이 모두 `approve`, `adjust`, `defer` 중 하나로 닫힌다.
- `defer` 항목은 owner, follow-up 시점, 임시 규칙이 기록된다.
- 결정 결과가 `REQUIREMENTS.md`에 반영된다.
- 같은 turn에서 `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `UI_DESIGN.md`를 새 기준선으로 sync할 준비가 된다.

## Decision Result
인터뷰 결과, 5개 implementation-critical issue는 모두 `approve`로 닫혔다.

| Decision Area | Outcome | Why | Notes |
|---|---|---|---|
| Minimal DB start scope | approve | first ship 핵심 기능은 7개 테이블 최소 집합으로 닫히고, 나머지는 후속 packet으로 미뤄도 운영 가능하다 | `release_state`, `work_item_registry`, `decision_registry`, `gate_risk_registry`, `handoff_log`, `artifact_index`, `generation_state`로 시작 |
| First-ship validator scope | approve | prototype failure 재발 방지와 cutover preflight를 가장 직접적으로 덮는 범위다 | parity/drift/source/mojibake/cutover preflight를 first ship에 포함 |
| PMW artifact viewer mandatory scope | approve | reading desk 목적상 canonical docs, generated docs, latest handoff면 현재 판단 복원에 충분하다 | archive/starter/reset viewer는 rollout lane으로 유지 |
| Inefficiency capture projection | approve | DB single write 후 human-reviewed Markdown promotion이 ownership과 drift control에 가장 적합하다 | DB capture -> human review -> Markdown promotion 순서 고정 |
| Security review automation level | approve | first ship 자동화는 ROI 높은 preflight에 집중하고 최종 판단은 manual gate로 유지하는 것이 적절하다 | path/file/dependency/secret/cutover preflight 자동화, 최종 보안 판단은 human gate 유지 |
