# Harness Operating Contract

## Status
- Draft under `PLN-18`.
- This document is a reusable harness operating contract, not a project architecture document.
- This document does not replace workflow-local role contracts, current execution state, or project-specific packets.

## Purpose
This document defines the reusable harness operating rules that must stay stable across workflows and projects:
- workflow-entry rules
- approval boundaries
- packet-before-code discipline
- baton rules
- role separation

## Canonical Authority
This document is canonical authority for:
- workflow route resolution before work starts
- when work must stop instead of guessing
- when Planner fallback is allowed
- approval-boundary rules shared across workflows
- packet-before-code discipline
- baton minimum fields for `Next Work`
- role separation between Planner, Developer, Tester, Reviewer, and other workflow roles

## Non-Authority
This document is not authority for:
- downstream project technical architecture
- current execution state
- packet status
- DB hot-state
- explicit user approval records
- workflow-local implementation detail that belongs inside `.agents/workflows/*`

If this document conflicts with `CURRENT_STATE`, `TASK_LIST`, packet status, DB hot-state, or explicit workflow handoff truth, those execution-state sources win for the current route.

## Workflow Entry Rule
When the user request does not name a workflow:
1. resolve the route from current state, active owner, explicit handoff, or approved routing evidence
2. continue only when one workflow is clearly supported
3. stop when the route is unclear

Do not guess a workflow for implementation, modification, approval, or closeout work.

## Planner Fallback Rule
Planner fallback is allowed only for non-mutating work such as:
- planning
- review of scope or architecture meaning
- requirements organization
- decomposition of follow-up work

Planner fallback is not allowed for:
- implementation
- document or code mutation that needs approval
- testing
- review closeout
- approval-state changes

## Approval Boundary
- Rough planning direction is not implementation approval.
- Detailed agreement approval is not `Ready For Code` unless explicitly stated.
- Human approval points must remain explicit for work that changes implementation, approval state, release behavior, data behavior, or user-facing behavior.
- No workflow may claim approval implicitly from context, baton wording, or generated state.

## Packet-Before-Code Discipline
- Implementation does not start before the active packet closes the required planning boundary.
- Workflow, validator, runtime, user-facing, deploy, migration, and data-impact work keep their packet and evidence requirements.
- When approved direction changes, planning artifacts and packet boundaries must be updated before implementation continues.

## Baton Rule
`Next Work` must remain a compact baton, not a second authority layer.

Minimum baton fields:
- next workflow
- next first action
- required SSOT
- approval boundary / do-not-cross

Do not use baton text to redefine architecture, reopen approval, or override workflow contracts.

## Role Separation
- Planner closes scope, constraints, acceptance, and approval boundaries.
- Developer implements against approved SSOT and packet scope.
- Tester verifies against approved SSOT and hands defects back to Developer.
- Reviewer checks source parity, evidence quality, residual debt, and closeout readiness.

No role may silently absorb another role's approval authority.

## Human-Facing Writing Rule
Human-facing canonical artifacts should use short, direct, action-oriented wording.

They should make it easy to see:
- what to do
- when to stop
- what not to change

Use strict governance terms only when needed. When humans are expected to read a strict term, add a plain-language explanation next to it.

Machine-facing rules, validator rules, and workflow-internal rules may keep stricter terminology for precision.
