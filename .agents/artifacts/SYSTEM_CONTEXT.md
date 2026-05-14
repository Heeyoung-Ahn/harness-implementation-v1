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
- A web app change also touches API handlers, background jobs, and notification delivery:
  record that request path, async processing, and outbound notification are one system boundary.
- A packet changes approval routing and also affects admin screens, permission checks, and audit logging:
  record that workflow state, authorization, and audit evidence are linked surfaces.
- A release/manual update also requires deployment config, onboarding docs, and environment checks to stay aligned:
  record that shipped docs, runtime configuration, and deployment validation form one delivery boundary.
- A domain packet depends on a legacy DB, an import script, and a reconciliation report:
  record the integration seam between product runtime, migration tooling, and external source-of-truth artifacts.
- A small change in summary formatting breaks dashboard parity or operator comprehension:
  record that generated summaries, operator-facing read models, validation output, and handoff surfaces are coupled outputs.

## What Not To Record Here
- today's active work item
- packet approval status
- temporary implementation checklist
- one-turn debugging notes
- exact current handoff owner
- narrow code diff detail that belongs in a packet, review note, or project history
