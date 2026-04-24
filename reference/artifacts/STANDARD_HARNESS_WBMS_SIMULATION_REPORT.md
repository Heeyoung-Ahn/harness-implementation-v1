# Standard Harness WBMS Simulation Report

## Purpose

- 목적: 2026-04-23 기준 표준 하네스가 새 WBMS 프로젝트를 `설계 -> 구현 -> 검증 -> 배포`까지 실제로 통제할 수 있는지 검토한다.
- 범위: read-only simulation. 특정 프로젝트 레포에 하네스를 이식하지 않고, 표준 하네스 계약을 실제 복잡한 상황에 태워 본다.

## Executive Verdict

| Item | Result |
| --- | --- |
| Overall verdict | usable with caution |
| Strength | planning hold, DB safety, source intake, UX archetype, cutover discipline는 강하다 |
| Main risk | 실제 WBMS급 프로젝트에서는 `multi-profile packet`, `task packet registration`, `shared-source rebaseline`이 아직 약하다 |
| Start recommendation | 시작 가능. 다만 Section 7의 temporary controls를 운영 규칙으로 먼저 붙이는 것이 안전하다 |

핵심 판단은 단순하다. 현재 하네스는 `꼬인 뒤 정리`보다 `꼬이기 전에 멈춤`에는 충분히 강하다. 하지만 WBMS처럼 `admin-grid + spreadsheet source + legacy DB + later airgapped delivery`가 동시에 걸리는 프로젝트에서는 아직 세 가지 구조적 빈틈이 남아 있다.

## Simulation Setup

| Item | Assumption |
| --- | --- |
| Product | 예산관리형 WBMS 웹 프로그램 |
| Primary users | 내부 운영자, 검토자, 승인자 |
| Legacy dependency | 기존 ERP/Oracle 계열 DB naming, column semantics, operational flow를 존중해야 함 |
| Source of truth | 사용자 workbook이 지속적으로 수정되며 planning/source authority를 가짐 |
| UX shape | dense admin-grid + 일부 read-first review flow |
| Delivery shape | 내부 개발 후 고객 환경 반입, 일부 현장은 manual-transfer 또는 airgapped delivery 가능성 있음 |
| Expected reusable profiles | `PRF-01`, `PRF-02`, later `PRF-03` |
| Stress condition | 중간 설계 변경, 메뉴 구조 변경, 필드 rename, row key 변경, cutover 방식 변경, optimistic closeout pressure 포함 |

## Dirty Scenario Deck

| Scenario | Dirty event | Expected harness response |
| --- | --- | --- |
| `S1 Kickoff ambiguity` | workbook의 메뉴코드와 인터뷰 메모가 다르고, 기존 ERP schema가 아직 안 옴 | `PLN-04`, `PLN-05`가 동시에 hold를 걸어야 함 |
| `S2 Early packet split` | 코드마스터, 예산신청, 정산 화면 packet을 병렬로 열었는데 한 packet이 먼저 구현으로 가려 함 | packet별 `Ready For Code` hold와 human approval boundary가 막아야 함 |
| `S3 Mid-flight source wave` | workbook v3가 와서 컬럼명, row key, editable rule, 메뉴 구조가 바뀜 | `AUTHORITATIVE_SOURCE_INTAKE` 재오픈과 impacted packet 재정렬이 필요함 |
| `S4 Parallel drift` | packet A만 새 workbook 기준으로 다시 열고, packet B/C는 예전 mapping으로 계속 진행하려 함 | project-level rebaseline discipline이 필요함 |
| `S5 Deployment boundary shift` | 고객이 온라인 배포 대신 offline bundle + manual import를 요구함 | `OPS-02`와 `PRF-03`이 cutover packet을 다시 열어야 함 |
| `S6 Optimistic closeout` | 화면이 얼추 보여서 packet을 done 처리하려고 하지만 source trace와 cleanup evidence가 부분적임 | `QLT-01`이 closeout hold를 유지해야 함 |

## End-To-End Simulation

| Phase | Simulated event | What the current harness does well | What still leaks |
| --- | --- | --- | --- |
| 1. Project kickoff | WBMS 성격을 판정한다 | `PRF-01`과 `PRF-02` 필요성을 빠르게 드러낸다 | packet이 active profile을 하나만 다루는 전제로 설계돼 있다 |
| 2. Planning baseline | workbook, 기존 DB, rough UX를 baseline에 반영한다 | `PLN-04`, `PLN-05`, `DSG-02`가 모호성을 `Ready For Code` 전에 막는다 | shared workbook이 여러 packet에 미치는 파급을 한 군데서 닫는 구조는 약하다 |
| 3. Packet kickoff | 코드마스터 packet과 신청화면 packet을 연다 | packet template이 DB, source, UX, approval, topology를 같이 묶게 만든다 | active packet validator는 등록된 packet만 본다 |
| 4. DB design review | 기존 ERP table/column naming을 맞춰야 한다 | `DOMAIN_CONTEXT.md`와 DB confirmation rule이 설계 선행 확인을 강제한다 | 없다. 이 부분은 현재 하네스가 강하다 |
| 5. UI design refinement | 운영자는 dense grid, 승인자는 read-first review를 원한다 | archetype + admin-grid profile 조합으로 함부로 화면을 확정하지 못하게 한다 | packet 단위에서 multi-profile 조합을 표현하기 어렵다 |
| 6. Workbook v3 arrival | 필드 rename, sheet reorder, row key 변경이 들어온다 | `AUTHORITATIVE_SOURCE_INTAKE.md`가 충돌/재작업 보고를 강제한다 | 영향을 받는 여러 packet을 한 번에 freeze/reopen하는 canonical ledger가 없다 |
| 7. Parallel development pressure | 한 packet만 수정하고 나머지는 계속 개발하려고 한다 | process상으로는 막아야 한다는 원칙이 있다 | validator가 `영향 받은 packet 전부가 재오픈됐는지`는 모른다 |
| 8. Packet closeout | 구현자는 화면이 보이니 done 처리하고 싶어 한다 | `PACKET_EXIT_QUALITY_GATE.md`가 source parity, debt, cleanup을 요구한다 | 없다. 이 부분도 현재 하네스가 강하다 |
| 9. Deployment prep | 고객이 offline delivery를 요구한다 | `OPS-02`와 `PRF-03`이 bundle/checksum/rollback/custody를 강제한다 | 실제 다단계 release 전체를 묶는 source-wave 또는 release-level ledger는 운영자가 직접 만들어야 한다 |
| 10. Final cutover decision | rollback 범위와 operator handoff를 닫아야 한다 | cutover ambiguity를 뒤로 미루지 않게 만든다 | 없다. 현행 contract는 충분히 쓸 만하다 |

## What Worked

- `PLN-04`는 WBMS류 프로젝트의 가장 흔한 실패 원인인 `기존 시스템 schema를 늦게 확인하는 문제`를 초기에 멈춘다.
- `PLN-05`는 새 workbook이나 새 기획 문서가 들어왔을 때 기존 구현 안정성을 핑계로 미루지 못하게 만든다.
- `DSG-02`와 `PRF-01`은 `그리드형 운영 화면`과 `read-first/approval 흐름`을 packet 수준에서 다시 닫게 만들어, 러프한 디자인 승인만으로 구현이 흘러가지 않게 한다.
- `QLT-01`은 `얼추 보인다`를 `done`으로 오인하는 상황을 잘 막는다.
- `OPS-02`와 `PRF-03`은 배포를 구현 후 잡일로 미루지 않고, 반입/무결성/복구를 사전 계획으로 끌어올린다.

## Findings

### `HSR-01` Multi-profile packet composition is not modeled cleanly

- WBMS 실제 work item은 `PRF-01 admin-grid`와 `PRF-02 spreadsheet-source`를 동시에 필요로 하고, 배포 단계에서는 `PRF-03`까지 추가될 수 있다.
- 그런데 현재 packet contract는 `Active profile dependency` 단일 필드 중심으로 설계돼 있고, validator도 `extractProfileId()`로 첫 `PRF-\d+` 하나만 뽑는다.
- 그 결과 실제 운영자는 `한 packet에 필요한 여러 profile 중 하나만 대표로 적거나`, `자연스러운 한 work item을 억지로 여러 packet으로 쪼개는` 우회를 하게 된다.
- 이 문제는 WBMS처럼 `UI shape`와 `source governance`가 동시에 중요한 프로젝트에서 바로 드러난다.

### `HSR-02` Concrete packet enforcement still depends on manual `task_packet` registration

- 현재 validator는 `artifact_index`에 category `task_packet`으로 등록된 packet만 검사한다.
- 즉, packet을 만들고도 등록을 빼먹으면 가장 중요한 hold rule이 validator 관점에서는 아예 존재하지 않는 것처럼 통과할 수 있다.
- 문서에도 이미 `task_packet` 등록 뒤 validator hold rule을 신뢰하라고 적혀 있다. 이건 운영 규칙으로는 맞지만, 실전에서는 누락 포인트가 된다.
- WBMS처럼 packet 수가 많아지면 이 누락은 실수로 발생할 확률이 높다.

### `HSR-03` Shared-source rebaseline is governed per packet, but not as a project-level wave

- `AUTHORITATIVE_SOURCE_INTAKE.md`는 새 source의 충돌과 재작업 보고에는 강하다.
- 하지만 workbook v3처럼 `하나의 source 변경이 여러 open packet에 동시에 영향을 주는 상황`을 한 번에 관리하는 표준 artifact는 아직 없다.
- 지금 구조에서는 운영자가 impacted packet 목록을 수동으로 만들고, 각 packet을 직접 reopen해야 한다.
- 그래서 packet A는 새 source로 다시 열렸는데 packet B/C는 예전 mapping으로 계속 가는 `parallel stale packet` 위험이 남는다.

## Temporary Controls For The Current Harness

새 WBMS 프로젝트를 지금 바로 시작한다면, 아래 세 가지를 운영 규칙으로 추가하는 편이 안전하다.

1. `PRF-01 + PRF-02`가 동시에 필요한 packet은 둘 다 mandatory라고 보고, packet header의 primary profile 외 나머지 profile은 `Required reading before code`와 packet body evidence에 명시한다.
2. packet을 만들면 같은 날 `artifact_index`에 `task_packet`으로 등록한다. 등록 전에는 `Ready For Code`를 올리지 않는다.
3. workbook이나 외부 기획 문서가 바뀌면 intake 하나만 만들고 끝내지 말고, `impacted packet set` 표를 별도로 만들어 모든 open packet의 `reopen / adjust / hold / supersede` 상태를 같이 관리한다.
4. 고객 배포 전에는 기능 packet과 별도로 cutover/release packet을 열고 `OPS-02`와 필요 시 `PRF-03` evidence를 묶는다.

## Recommended Follow-Up Candidates

| Candidate | Target layer | Why |
| --- | --- | --- |
| `SIM-MULTI-PROFILE-001` | core | packet/validator가 multiple active profiles를 공식 지원해야 함 |
| `SIM-TASK-PACKET-REGISTRATION-002` | core | active packet 미등록 상태를 validator가 fail해야 함 |
| `SIM-SOURCE-WAVE-LEDGER-003` | core | 하나의 authoritative source 변경이 여러 packet에 미치는 파급을 한 군데서 닫아야 함 |

## Final Assessment

- 현재 하네스는 WBMS 같은 프로젝트에서 `문제를 예방하는 운영 골격`으로는 충분히 쓸 수 있다.
- 다만 `복합 profile`, `packet registration`, `shared-source wave control`은 아직 사람 운영자의 보완이 필요한 상태다.
- 따라서 시작 판정은 `go with controls`가 맞다. 즉, 하네스를 폐기할 정도의 결함은 아니지만, 위 세 항목은 새 프로젝트 kickoff 전에 운영 규칙으로 붙여야 한다.
