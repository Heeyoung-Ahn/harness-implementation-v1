# System Context

This artifact is conditional canonical for long-term system boundary only when it is explicitly maintained and cited.

Use it to preserve:
- major system boundaries
- integration seams
- external dependencies
- ownership or hotspot mapping

Do not use it as current execution truth.

If it conflicts with `CURRENT_STATE`, `TASK_LIST`, packet status, DB hot-state, explicit user approval, or workflow handoff truth, those execution-state sources win.

## What To Record Here
- major subsystems and their responsibility boundaries
- external system integration points
- shared modules or services that multiple packets can affect
- ownership boundaries between runtime, product code, scripts, packaging, and operations
- hotspots where one change is likely to ripple into multiple files or workflows
- technical constraints that narrow implementation choices

## Good Development-Stage Examples
- A CLI command change now touches `dev05-tooling.js`, `drift-validator.js`, `ACTIVE_CONTEXT` generation, and validation-report output:
  record that command/runtime/state generation are linked surfaces so later packets do not treat them as isolated edits.
- A packet changes approval routing and also affects workflow Markdown, handoff resolution, and PM/runtime command hints:
  record that workflow contracts, handoff logic, and route resolution are one system boundary.
- A release/manual update also requires `standard-template/`, packaging, installer, and validator text to stay aligned:
  record that shipped docs, starter payload, packaging, and release validation form one downstream delivery boundary.
- A domain packet depends on a legacy DB, an import script, and a reconciliation report:
  record the integration seam between product runtime, migration tooling, and external source-of-truth artifacts.
- A small change in Active Context formatting breaks validation parity or handoff comprehension:
  record that generated docs, Active Context, validation summary, and handoff surfaces are coupled read-model outputs.

## What Not To Record Here
- today's active work item
- packet approval status
- temporary implementation checklist
- one-turn debugging notes
- exact current handoff owner
- narrow code diff detail that belongs in a packet, review note, or project history
