# Restart Handoff 2026-04-19

This handoff is for restarting work after a Codex reinstall or a fresh local setup.

## What Is Already Established

- `codex\` is the canonical repository-local harness root.
- The accepted harness corpus is strict: only selected, corrected, and verified material is promoted into `codex\outputs\standard-harness\`.
- `day-start` and `day-end` are already defined and wired to:
  - `durable-context.md`
  - `active-state.md`
  - `preventive-memory.md`
  - latest daily delta
- Reference-template curation was already performed against `reference\repo_harness_template`.

## Accepted Standard Outputs

- Harness philosophy:
  - `codex\outputs\standard-harness\design\harness-philosophy.md`
- Reference-template curation result:
  - `codex\outputs\standard-harness\design\reference-template-curation.md`
- Candidate promotion playbook:
  - `codex\outputs\standard-harness\playbooks\candidate-promotion-playbook.md`
- Conflict reconciliation playbook:
  - `codex\outputs\standard-harness\playbooks\conflict-reconciliation-playbook.md`
- Promotion checklist:
  - `codex\outputs\standard-harness\checks\promotion-gate-checklist.md`

## Current Project-Context Files To Read First

1. `codex\project-context\durable-context.md`
2. `codex\project-context\active-state.md`
3. `codex\project-context\preventive-memory.md`
4. latest file in `codex\project-context\daily\`
5. `codex\outputs\standard-harness\design\reference-template-curation.md`

## Current Resume Point

- The local harness structure is in place.
- The strict candidate-vs-standard promotion gate is in place.
- The selected behaviors from `reference\repo_harness_template` were already adapted.
- The next real work is to populate project-specific durable and active context from the actual repository work and then keep using the harness during normal execution.

## Still Pending

- Fill real project mission, milestone, and current work into `durable-context.md` and `active-state.md`.
- Decide later whether `feature-artifact-sync` or `operating-common-rollout` becomes necessary enough to adapt.
- Run runtime verification once the new Codex environment is stable.

## Prompt For The Next Fresh Session

Use the exact prompt below after reinstall:

```text
이 저장소의 로컬 하네스를 기준으로 작업을 재개해.

먼저 아래 파일만 이 순서대로 읽고 현재 상태를 복구해:
1. codex/project-context/durable-context.md
2. codex/project-context/active-state.md
3. codex/project-context/preventive-memory.md
4. codex/project-context/daily/2026-04-19.md
5. codex/project-context/restart-handoff-2026-04-19.md
6. codex/outputs/standard-harness/design/reference-template-curation.md

중요 규칙:
- codex/ 는 이 프로젝트의 canonical local harness root다.
- harness-candidates 와 standard-harness 를 섞지 마라.
- 수정/보완/충돌 해소가 끝나지 않은 항목은 standard-harness 로 승격하지 마라.
- day-start/day-end 와 preventive-memory 운영 모델을 그대로 따른다.

그 다음 다음 3가지를 짧게 정리해:
1. 지금까지 확정된 하네스 철학과 구조
2. 현재 진행 상태와 남은 작업
3. 지금 당장 시작할 첫 작업
```
