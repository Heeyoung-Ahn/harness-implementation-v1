# Project History

This artifact is conditional canonical for durable milestones and historical decisions only when it is explicitly maintained and cited.

Use it for:
- milestone history
- rebaseline history
- durable decision history
- major incident or recovery history

Do not use it as daily execution truth, packet status, or workflow handoff truth.

If it conflicts with `CURRENT_STATE`, `TASK_LIST`, packet status, DB hot-state, explicit user approval, or workflow handoff truth, those execution-state sources win.

## What To Record Here
- milestones that changed the project baseline
- planning decisions that redirected later packet sequencing
- major reversals, rebaselines, or decommissions
- incidents where the team learned a reusable boundary or failure pattern
- historical rationale that later packets need to understand why a rule exists

## Good Development-Stage Examples
- `DEV-11` removed PMW from the active baseline and replaced it with CLI-first Active Context:
  record this as a durable baseline change because later packets need to know PMW is historical only.
- `PLN-16` approved tiered governance and deferred final operator wording to `OPS-17`:
  record this because later operator and workflow packets depend on that sequencing decision.
- `OPS-19` was opened because opening `OPS-17` took 9 minutes 34 seconds and exposed packet-registration friction:
  record the incident and the resulting structural fix so later maintainers know why the planner helper exists.
- `PLN-18` split project architecture from harness operating contract:
  record this as a durable SSOT boundary change because later document rewrites depend on it.
- A validator rule was tightened after repeated stale generated-doc drift:
  record the incident and rule change if it changed reusable policy, not just one bugfix.

## What Not To Record Here
- current open blocker list
- current owner or workflow route
- in-progress patch notes
- temporary retry history during one debugging session
- every small implementation step
- duplicate summaries of information already carried by `CURRENT_STATE` or `TASK_LIST`
