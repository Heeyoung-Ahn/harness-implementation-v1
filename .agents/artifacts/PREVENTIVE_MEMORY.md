# Preventive Memory

This file keeps thin, durable prevention rules for repeated process or quality issues.

## Promotion Decision Rules

- Record only repeated friction with explicit trigger, impact, and source / evidence.
- Promotion candidates must declare a proposed target layer: `core`, `optional profile`, `project packet`, or `note-only`.
- Promotion status uses `proposed`, `pending-review`, `approved`, `rejected`, or `promoted`.
- `pending-review` or `unknown` classification keeps the candidate as memory only and does not authorize baseline or starter changes.
- Approved promotion must link to a concrete follow-up item, target artifact, or explicit `note-only` / `rejected` disposition.

## Active Preventive Rules

- Rule ID: PMW-ORIENTATION-001
- Repeated Mistake / Trigger: During long-running work, interruptions, stale generated state, or side topics make the operator lose the whole picture, current lane, why-now context, or return point.
- Preventive Rule: Before closing any PMW-facing work item, ensure the repo-local operating state is backfilled, regenerate the designated docs, and verify that the PMW first view exposes `current lane`, `next gate / why now`, and `return point` while also answering `결정해야 할 것`, `막힌 것`, and `다음 작업` within 30 seconds.
- Check Method: Run `npm.cmd test`, start `npm.cmd run pmw:start`, and compare the browser-rendered PMW at `http://127.0.0.1:4173` against the approved packet contract, including the header/meta strip, fixed 4-card grid, artifact preview, and diagnostics hierarchy.
- Promotion Origin: Standardized into the baseline during DEV-04 / TST-02 / REV-01 closeout.
- Linked Follow-Up Item: none
- Source / Evidence: User feedback on 2026-04-19 in this repo and `C:\Newface\10 Antigravity\14 wmbs`, plus DEV-04 browser verification evidence in `.harness\pmw-home.png`, `.harness\pmw-full.png`, and `.harness\pmw-dev05.png`.

- Rule ID: REL-BASELINE-001
- Repeated Mistake / Trigger: Installable release surfaces (`standard-template/`, `installer/`, `pmw-app/`, `packaging/`, manuals, `dist/`) move to a new baseline label while root SSOT, DB hot-state, generated docs, or validator messages still describe the previous release.
- Preventive Rule: Any lane that changes the installable payload, separate PMW behavior, packaging label, or release manual must update the shared release-baseline constant, root `.agents/artifacts/*`, `.harness/operating_state.sqlite`, generated docs, validation report, and the matching starter runtime/test guardrail in the same lane. Closeout is blocked if maintainer release surfaces and SSOT disagree.
- Check Method: Run root `npm.cmd test`, `npm.cmd run harness:validation-report`, `node --test pmw-app/test/*.test.js`, and `npm.cmd test` in `standard-template/`; review validator findings for `release_baseline_*` codes.
- Promotion Origin: Standardized into the baseline during `REL-02` closeout on 2026-04-27.
- Linked Follow-Up Item: none
- Source / Evidence: commit `b225956` shipped installable V1.2 surfaces while root SSOT and DB remained on V1.1 until `REL-02` reconciliation on 2026-04-27.

- Rule ID: OPS-STATE-SYNC-001
- Repeated Mistake / Trigger: Reusable runtime or PMW lanes close with task truth split across `CURRENT_STATE`, `TASK_LIST`, DB hot-state, generated docs, PMW export, validation report, and handoff evidence.
- Preventive Rule: Open, transfer, and close reusable lanes only through the structured transition path. Terminal transitions must move active/completed task bookkeeping, project progress, generated docs, PMW export, validation evidence, and next-action surfaces together in the same turn; do not close the lane by manual doc edits alone.
- Check Method: Use transition preview/apply, then run root/starter tests, `validate`, `pmw-export`, and `validation-report`, and confirm `status`/`next` report the same next owner and next action.
- Promotion Origin: Promoted from `OPS-HARNESS-FRICTION-004` after `OPS-03` Tester re-verification, Reviewer closeout, and Planner closeout on 2026-05-03.
- Linked Follow-Up Item: `OPS-03` (closed 2026-05-03)
- Source / Evidence: `reference/packets/PKT-01_OPS-03_HARNESS_OPERATION_FRICTION_REDUCTION.md`, `reference/artifacts/REVIEW_REPORT.md`, `reference/artifacts/WALKTHROUGH.md`, and `dev05-tooling` transition regression coverage in root/starter.

## Promotion Candidates

- Candidate ID: OPS-HARNESS-FRICTION-004
- Issue Pattern: 하네스 core/PMW 작업을 닫을 때마다 `CURRENT_STATE`, `TASK_LIST`, packet, DB hot-state, generated docs, PMW export, validation report, handoff log를 사람이 반복적으로 맞춰야 하며, 중단 후 승인 상태와 정본 상태가 갈라질 수 있다.
- Why It Matters: 현재 엄격도는 core contract 작업에는 유효하지만, 모든 작업에 같은 강도로 적용하면 작업 시간이 state sync에 과도하게 쓰이고 수동 중복 기록에서 drift가 생긴다. 2026-05-02 OPS-03 중단 사례처럼 packet header, DB decision, canonical docs, generated docs, PMW export가 서로 다른 승인 상태를 표시하면 다음 에이전트가 구현 가능 여부를 오판할 수 있다.
- Proposed Target Layer: core
- Proposed Target Artifact / Follow-Up Item: `OPS-03` Harness operation reliability packet for gate profiles, approval/SSOT consistency, transition automation, current-state/history separation, sufficiently integrated agent behavior guidance, project-design SSOT precedence, workflow closeout reporting, and PMW design-artifact access.
- Promotion Status: promoted
- Human Review Boundary: expanded OPS-03 scope, gate profile taxonomy, approval consistency contract, transition automation scope, state/history split, sufficient attached agent behavior guide disposition, project-design SSOT precedence, PMW design-artifact access, interrupted implementation disposition, revised `Ready For Code`, Tester re-verification, Reviewer closeout, and Planner closeout were all closed by 2026-05-03.
- Linked Follow-Up Item: `OPS-03`
- Needed Refinement: Promoted into active preventive rule `OPS-STATE-SYNC-001`; future refinement, if any, must open a new follow-up item.
- Source / Evidence: DEV-07 through DEV-09 repeated closeout work, user feedback on 2026-05-02 asking whether the current harness effort level is appropriate, the interrupted OPS-03 implementation/approval mismatch on 2026-05-02, and `C:/Users/ahyne/Downloads/andrej-karpathy-skills-main.zip`.

- Candidate ID: SIM-MULTI-PROFILE-001
- Issue Pattern: 하나의 실제 work item이 admin-grid UX, spreadsheet-backed authoritative source, later delivery profile까지 동시에 필요로 하지만, current packet contract와 validator가 사실상 single active profile 중심으로 작동한다.
- Why It Matters: WBMS류 프로젝트에서 operator가 profile 하나를 누락하거나 work item을 부자연스럽게 쪼개게 되면 required evidence와 hold rule이 부분적으로만 적용된다.
- Proposed Target Layer: core
- Proposed Target Artifact / Follow-Up Item: `PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`, profile activation contract, `src/state/drift-validator.js`의 multi-profile support follow-up lane
- Promotion Status: promoted
- Human Review Boundary: closed by the approved `SIM-01` remediation lane on 2026-04-23.
- Linked Follow-Up Item: `SIM-01` (closed 2026-04-23)
- Needed Refinement: packet header/data model을 `Active profile dependencies`와 per-profile evidence matrix로 바꿀지, 또는 profile composition artifact를 둘지 판정 필요
- Source / Evidence: `reference/artifacts/STANDARD_HARNESS_WBMS_SIMULATION_REPORT.md`

- Candidate ID: SIM-TASK-PACKET-REGISTRATION-002
- Issue Pattern: concrete packet evidence validator enforcement가 `artifact_index` category `task_packet` 수동 등록에 의존한다.
- Why It Matters: packet은 만들었지만 등록을 빼먹은 상태에서 operator가 validator를 신뢰하면 핵심 hold rule이 검사되지 않은 채 지나갈 수 있다.
- Proposed Target Layer: core
- Proposed Target Artifact / Follow-Up Item: validator에 active packet 미등록 fail rule 또는 designated packet directory auto-discovery follow-up lane
- Promotion Status: promoted
- Human Review Boundary: closed by the approved `SIM-02` remediation lane on 2026-04-23.
- Linked Follow-Up Item: `SIM-02` (closed 2026-04-23)
- Needed Refinement: active packet의 canonical discovery source를 어디로 둘지 결정 필요
- Source / Evidence: `reference/artifacts/STANDARD_HARNESS_WBMS_SIMULATION_REPORT.md`

- Candidate ID: SIM-SOURCE-WAVE-LEDGER-003
- Issue Pattern: 하나의 workbook 또는 새 기획 문서 변경이 여러 open packet에 동시에 영향을 주는 상황에서 impacted packet set을 project-level로 닫는 표준 artifact가 없다.
- Why It Matters: packet A만 reopen되고 packet B/C가 stale source로 계속 진행되는 parallel drift가 생길 수 있다.
- Proposed Target Layer: core
- Proposed Target Artifact / Follow-Up Item: authoritative source wave impact ledger 또는 multi-packet rebaseline gate follow-up lane
- Promotion Status: promoted
- Human Review Boundary: closed by the approved `SIM-03` remediation lane on 2026-04-23.
- Linked Follow-Up Item: `SIM-03` (closed 2026-04-23)
- Needed Refinement: authoritative source intake와 별도 project-level source-wave ledger의 경계는 reusable contract로 닫혔다.
- Source / Evidence: `reference/artifacts/STANDARD_HARNESS_WBMS_SIMULATION_REPORT.md`

## Entry Format

### Active Preventive Rules

- Rule ID:
- Repeated Mistake / Trigger:
- Preventive Rule:
- Check Method:
- Promotion Origin:
- Linked Follow-Up Item:
- Source / Evidence:

### Promotion Candidates

- Candidate ID:
- Issue Pattern:
- Why It Matters:
- Proposed Target Layer:
- Proposed Target Artifact / Follow-Up Item:
- Promotion Status:
- Human Review Boundary:
- Needed Refinement:
- Source / Evidence:
