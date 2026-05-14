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
- The project replaced a manual spreadsheet workflow with an approved web workflow:
  record this as a durable milestone because later packets need to understand the source-of-truth change.
- Requirements freeze approved a reduced first release and deferred reporting:
  record this because later planning packets depend on the sequencing decision.
- A production incident showed that import rollback was missing:
  record the incident and the resulting rule change if it affects future packet planning.
- A project architecture rebaseline moved background jobs out of the web process:
  record this as durable system history because later implementation packets depend on the boundary.
- A validation rule was tightened after repeated stale generated-doc drift:
  record the incident and rule change if it changed reusable policy, not just one bugfix.

## What Not To Record Here
- current open blocker list
- current owner or workflow route
- in-progress patch notes
- temporary retry history during one debugging session
- every small implementation step
- duplicate summaries of information already carried by `CURRENT_STATE` or `TASK_LIST`
