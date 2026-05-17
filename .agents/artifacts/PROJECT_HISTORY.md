# Project History

This artifact is conditional canonical for durable milestones and historical decisions only when it is explicitly maintained and cited.

Use it for:
- milestone history
- rebaseline history
- durable decision history
- major incident or recovery history

Do not use it as daily execution truth, packet status, or workflow handoff truth.

If it conflicts with `CURRENT_STATE`, `TASK_LIST`, packet status, DB hot-state, explicit user approval, or workflow handoff truth, those execution-state sources win.

## Durable Timeline
- 2026-04-22: The reusable standard harness first-ship baseline closed through `deep interview -> requirements final approval -> architecture / implementation / UI sync -> rough mockup -> per-work-item packet approval -> implementation -> generated docs / read model / PMW / cutover -> refactor / security / review gate`.
- 2026-04-22: Follow-up planning began to preserve the baseline while adding the `core / optional profile / project packet` structure for more complex downstream projects.
- 2026-04-23: The reusable follow-up contract wave closed across `PLN-03`, `PLN-04`, `PLN-05`, `DSG-02`, `OPS-02`, `QLT-01`, `OPS-01`, `PRF-01`, `PRF-02`, `PRF-03`, `TST-03`, `REV-02`, `SIM-01`, `SIM-02`, `SIM-03`, and `REV-03`.
- 2026-04-24: `DEV-06` closed after hardening `standard-template/` for real copied-project use, including launcher preflight, green starter tests, formal starter review/test templates, and placeholder script disposition.
- 2026-04-26: `PLN-06` closed as the standalone business-system harness V1.1 lane with no essential readiness item deferred.
- 2026-04-27: `REL-02` closed as the V1.2 installable harness and PMW baseline reconciliation lane, aligning the installer, separate PMW app, packaging, manuals, SSOT, DB truth, generated docs, and release validator.
- 2026-05-02: `PLN-07` closed after sequencing and delivering the V1.3 PMW operator-console and workflow-contract wave through `DEV-07`, `DEV-08`, and `DEV-09`.
- 2026-05-03: User direction superseded the PMW extension path; `PLN-08` and `DEV-10` became superseded history while `PLN-09` opened as the CLI-first PMW decommission and Active Context rebaseline lane.
- 2026-05-10: `PLN-10` closed after sequencing and closing `OPS-04`, `QLT-02`, `OPS-06`, and `OPS-05`. `OPS-07` opened next to make planner-hold closeout deterministic.
- 2026-05-11: `PLN-11` closed after the user approved the `2 + 2` split. `OPS-08`, `QLT-03`, `OPS-09`, and `PLN-12` then closed in sequence, followed by `OPS-10` planner-hold closeout.
- 2026-05-11: `PLN-13` closed as planning evidence for the shipped-surface sequence, and `OPS-11`, `OPS-12`, and `OPS-13` closed the bootstrapper, template payload, and manual consolidation wave.
- 2026-05-14: `OPS-19` closed after planner-only helper implementation, tester verification, reviewer approval, and planner closeout reflection. `PLN-18` opened next for project-architecture SSOT restoration and long-term context authority.
- 2026-05-15 to 2026-05-17: `OPS-26`, `OPS-27`, `PLN-22`, `PLN-23`, and the sequential rebuild slices closed through planning, implementation, verification, review, and cutover evidence. The canonical operational substrate became `.harness/operating_state.sqlite` plus structured runtime APIs, with generated views and cutover sequencing approved under the rebuild program.
- 2026-05-18: `PLN-25` opened as the long-context re-entry and implementation-plan rebaseline lane. Its purpose is to make `IMPLEMENTATION_PLAN.md` a real implementation plan again, narrow default AI read paths, and add a maintainer architecture map for the harness runtime.

## What To Record Here
- milestones that changed the project baseline
- planning decisions that redirected later packet sequencing
- major reversals, rebaselines, or decommissions
- incidents where the team learned a reusable boundary or failure pattern
- historical rationale that later packets need to understand why a rule exists

## What Not To Record Here
- current open blocker list
- current owner or workflow route
- in-progress patch notes
- temporary retry history during one debugging session
- every small implementation step
- duplicate summaries of information already carried by `CURRENT_STATE` or `TASK_LIST`
