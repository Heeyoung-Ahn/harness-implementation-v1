# PLN-18 Project SSOT And Workflow Entry Rebaseline Draft

## Status
- Draft opened on 2026-05-14 as a planning-only follow-up.
- This draft does not approve implementation or runtime mutation.
- This draft does not reopen `PLN-16`; it uses `PLN-16` as an approved upstream planning source.
- This draft does not replace `PLN-17`; `PLN-17` remains reserved for multi-model ownership and conflict rules.
- User approved this draft on 2026-05-14 as the next planning rebaseline lane.
- User approved the PLN-18 decision set on 2026-05-14 for architecture-guide restoration, harness-contract separation, long-term context authority, workflow route fallback, and human-facing artifact writing.
- User approved `HARNESS_OPERATING_CONTRACT.md` on 2026-05-14.
- User approved `DOMAIN_CONTEXT.md` authority wording on 2026-05-14.
- User conditionally approved `SYSTEM_CONTEXT.md` and `PROJECT_HISTORY.md` on 2026-05-14 pending more concrete development-stage examples, which are now added in the draft direction.
- `OPS-17` stays deferred until this lane closes the document-role and workflow-entry decisions it depends on.
- The next concrete implementation-facing follow-up remains `OPS-18` after this planning lane closes.

## Purpose
This draft rebaselines four structural areas before the remaining operator-adoption wave continues:

1. restore `.agents/artifacts/ARCHITECTURE_GUIDE.md` to its intended role as the project technical architecture SSOT
2. split harness self-architecture / operating-contract material into its own dedicated harness contract document
3. define how long-term context SSOT and workflow-entry guardrails should work without creating stale-authority confusion
4. move long-term context SSOT files into `.agents/artifacts/` so their canonical location matches the governance Markdown truth layer

The goal is to improve large-project context retention and workflow safety without weakening packet-before-code, human approval, generated-doc immutability, Active Context derived-state limits, or Reviewer / Tester separation.

## Source Basis
- user direction on 2026-05-14
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- `.agents/rules/agent_behavior.md`
- `reference/planning/PLN-16_OPERATOR_ADOPTION_AND_TIERED_GOVERNANCE_CONTRACT_DRAFT.md`
- `reference/packets/PKT-01_OPS-17_OPERATOR_GLOSSARY_PROFILE_RESET_AND_SAFE_FIX_GUIDANCE.md`
- `.agents/artifacts/DOMAIN_CONTEXT.md`
- `.agents/artifacts/SYSTEM_CONTEXT.md`
- `.agents/artifacts/PROJECT_HISTORY.md`
- `standard-template/.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `standard-template/.agents/artifacts/DOMAIN_CONTEXT.md`
- `standard-template/.agents/artifacts/SYSTEM_CONTEXT.md`
- `standard-template/.agents/artifacts/PROJECT_HISTORY.md`

## Problem Statement
- The current `ARCHITECTURE_GUIDE.md` carries too much harness self-description and no longer cleanly serves as the downstream project's technical architecture contract.
- Large-project context retention needs stronger long-term context surfaces, but naive SSOT expansion would create stale-authority sprawl.
- Workflow selection must be forced through an explicit workflow route when the user does not name one, otherwise prompt-level ambiguity can open unsafe work.
- `OPS-17` manual wording should not finalize against a document structure that is likely to change immediately afterward.

## Planning Questions
1. How should the approved `ARCHITECTURE_GUIDE` / harness-contract split be applied to root and `standard-template` without breaking downstream readability?
2. Which workflow-entry and baton rules belong in `HARNESS_OPERATING_CONTRACT.md` versus workflow-local contracts?
3. How should `SYSTEM_CONTEXT.md` and `PROJECT_HISTORY.md` signal their conditional-canonical status in human-facing wording?
4. What exact follow-up boundary now belongs to `OPS-17`, `OPS-18`, `QLT-04`, and `PLN-17` after these decisions are fixed?

## Proposed Scope

### A. Project Architecture SSOT Restoration
- restore `.agents/artifacts/ARCHITECTURE_GUIDE.md` as the project technical architecture SSOT
- define a separate harness self-architecture / operating-contract document under `.agents/rules/`
- classify which current sections stay in project architecture and which move to the harness contract
- define root / `standard-template` migration expectations for the split

### B. Long-Term Context SSOT Role Split
- keep `DOMAIN_CONTEXT.md` as the domain/data-impact foundation reference
- decide whether and how `SYSTEM_CONTEXT.md` becomes a canonical long-term system-boundary reference
- decide whether and how `PROJECT_HISTORY.md` becomes a canonical durable-history reference
- define explicit authority, freshness, citation, and conflict rules for these artifacts
- keep execution truth separate from long-term context truth

### C. Workflow Entry Guardrail
- require workflow resolution before work proceeds when the user has not specified a workflow
- allow auto-resolution only from explicit state/route evidence, not free-form guesswork
- define the fallback behavior when route resolution is ambiguous
- define a compact `Next Work` baton format:
  - next workflow
  - next first action
  - required SSOT
  - approval boundary / do-not-cross

### D. Human-Facing Artifact Writing Rule
- keep human-facing canonical artifacts short, direct, and action-oriented
- make it obvious what the operator should do, when to stop, and what must not be changed
- avoid governance-heavy wording when a simpler action rule can express the same meaning
- when a human/AI-shared artifact must keep strict terms, add a plain-language explanation next to the strict term
- allow stricter wording only in machine-facing rules, validator rules, and workflow-internal contracts

## Non-Goals
- Do not implement the final operator glossary/manual wording here; that remains `OPS-17`.
- Do not implement workflow hard-gate runtime behavior here; that remains `OPS-18`.
- Do not rebalance governance tests here; that remains `QLT-04`.
- Do not define the full multi-model ownership and conflict contract here; that remains `PLN-17`.
- Do not add DB schema changes.
- Do not broaden Active Context into a write-authority surface.
- Do not turn long-term context artifacts into execution-state replacements for `CURRENT_STATE`, `TASK_LIST`, DB hot-state, or handoff truth.

## Follow-Up Mapping
| Lane | Role after PLN-18 |
|---|---|
| `OPS-17` | finalize operator manual wording after the new document / workflow-entry structure is settled |
| `OPS-18` | implement workflow-entry enforcement and baton/output-shape rules after planning closes |
| `QLT-04` | rebalance governance tests after `OPS-18` makes the runtime/workflow rules concrete |
| `PLN-17` | remain dedicated to multi-model ownership and conflict rules |

## Proposed Decisions
| Decision | Recommendation |
|---|---|
| `ARCHITECTURE_GUIDE.md` role | restore as downstream project technical architecture SSOT; keep only project components, module boundaries, data flow, integration architecture, and technical constraints |
| Removed from `ARCHITECTURE_GUIDE.md` | move harness self-architecture, workflow governance, approval boundary, packet-before-code discipline, generated-doc immutability, and agent operating behavior out of project architecture |
| Harness self-architecture location | separate canonical contract document at `.agents/rules/HARNESS_OPERATING_CONTRACT.md` |
| `HARNESS_OPERATING_CONTRACT.md` authority | canonical for workflow-entry rules, approval boundaries, packet-before-code discipline, baton rules, and role separation; not authority for project technical architecture or current execution state |
| `DOMAIN_CONTEXT.md` authority | canonical only for domain/data-impact foundation, domain meaning, business rules, domain terms, and data-impact narrowing; never execution truth |
| `SYSTEM_CONTEXT.md` authority | conditional canonical only for long-term system boundary, and only when explicitly maintained and cited |
| `PROJECT_HISTORY.md` authority | conditional canonical only for durable milestones and historical decisions; never current execution truth |
| Long-term context canonical location | move `DOMAIN_CONTEXT.md`, `SYSTEM_CONTEXT.md`, and `PROJECT_HISTORY.md` into `.agents/artifacts/` and `standard-template/.agents/artifacts/` |
| Conflict precedence for long-term context | `CURRENT_STATE`, `TASK_LIST`, packet status, DB hot-state, explicit user approval, and workflow handoff truth always win on conflict |
| Workflow unspecified behavior | first resolve the route; proceed only when the route is explicit; stop when route is unclear or the request would create/modify/approve work |
| Planner fallback | allowed only for non-mutating review/planning/requirements work |
| Human-facing artifact writing | human-facing SSOT uses short direct sentences and action-first wording; strict terms get plain-language help when humans are expected to read them |

## Approved Decision Set

### 1. `ARCHITECTURE_GUIDE.md` Boundary
- Restore `.agents/artifacts/ARCHITECTURE_GUIDE.md` as downstream project technical architecture SSOT.
- Limit it to:
  - project components
  - module boundaries
  - data flow
  - integration architecture
  - technical constraints
- Remove harness self-architecture, workflow governance, approval boundary, packet-before-code discipline, generated-doc immutability, and agent operating behavior from that document.

Approved section set to keep in `ARCHITECTURE_GUIDE.md`:
- summary
- project component map
- module boundary map
- data flow
- integration architecture
- technical constraints
- project-specific architecture decisions and tradeoffs

Approved section set to remove from `ARCHITECTURE_GUIDE.md`:
- truth hierarchy and generated-doc authority rules
- workflow governance
- approval boundary rules
- packet-before-code discipline
- role separation rules
- required reading order
- baton rules
- reusable workflow-entry routing rules
- reusable validator and operating rules that are not project architecture

### 2. Harness Contract Location And Authority
- Create `.agents/rules/HARNESS_OPERATING_CONTRACT.md`.
- This document is canonical authority for:
  - workflow-entry rules
  - approval boundaries
  - packet-before-code discipline
  - baton rules
  - role separation
- This document is not authority for:
  - project technical architecture
  - current execution state

Approved draft structure for `HARNESS_OPERATING_CONTRACT.md`:
- status
- purpose
- canonical authority
- non-authority
- workflow entry rule
- Planner fallback rule
- approval boundary
- packet-before-code discipline
- baton rule
- role separation
- human-facing writing rule

### 3. Long-Term Context Authority / Freshness / Citation
- `DOMAIN_CONTEXT.md` is canonical only for domain/data-impact foundation.
- Its purpose is to preserve domain meaning, business rules, domain terms, and data-impact scope so later changes can narrow impact without broad blind edits across the codebase.
- It does not replace current execution state, packet state, implementation detail, or workflow handoff truth.
- `SYSTEM_CONTEXT.md` is conditional canonical for long-term system boundary only when it is explicitly maintained and cited.
- `PROJECT_HISTORY.md` is conditional canonical for durable milestones and historical decisions only, and never replaces current execution truth.
- If any of these three artifacts conflicts with `CURRENT_STATE`, `TASK_LIST`, packet status, DB hot-state, explicit user approval, or workflow handoff truth, the latter sources win.

### 4. Workflow Route / Fallback / Hold
- When a request does not specify a workflow, first resolve the route.
- If the route is explicit from current state or routing evidence, continue in that workflow.
- If the route is unclear, or if the request needs implementation, modification, or approval, stop instead of guessing.
- Planner fallback is allowed only for non-mutating review, planning, or requirements-organizing work.

### 5. Human-Facing Artifact Writing Rule
- Human-facing canonical artifacts should not read like dense operating regulations.
- Sentences should be short and direct.
- The operator should be able to see:
  - what to do
  - when to stop
  - what not to touch
- Use governance-heavy terms only when they are really needed.
- Prefer simple action rules over abstract governance wording.
- When a human/AI-shared artifact must keep a strict term, add a plain-language explanation next to it.
- Machine-facing rules, validator rules, and workflow-internal contracts may keep stricter terminology for precision.

## Concrete Follow-Up Mapping

### `OPS-17`
- Keep `OPS-17` limited to human-facing operator wording after the document split is implemented.
- `OPS-17` owns glossary, profile reset guidance, safe-fix wording, and operator-readable explanation only.
- `OPS-17` must not redefine workflow route rules, approval boundaries, or architecture authority.

### `OPS-18`
- `OPS-18` owns runtime and workflow enforcement of the approved workflow-entry rule.
- `OPS-18` should implement route resolution, stop-on-ambiguity behavior, limited Planner fallback handling, and the compact baton shape.
- `OPS-18` must not reopen the human-facing manual wording scope that belongs to `OPS-17`.

### `QLT-04`
- `QLT-04` owns test and validator rebalance after `OPS-18` makes workflow-entry behavior concrete.
- It should cover enforcement, ambiguity-stop behavior, fallback boundaries, and conditional-canonical context wording checks only where validator scope is appropriate.

### `PLN-17`
- `PLN-17` remains dedicated to multi-model ownership and conflict rules.
- It must not absorb the `ARCHITECTURE_GUIDE` split, long-term context authority split, or workflow-entry baseline decisions already settled here.

## Risks
- Over-splitting SSOT can increase stale documents and operator confusion.
- Under-splitting `ARCHITECTURE_GUIDE.md` leaves downstream project architecture unclear.
- Broad auto-routing could accidentally bypass approval boundaries.
- Forcing baton text to restate too much authority could create a shadow instruction layer.

## Approval Boundary
The core PLN-18 decision set is approved for:
- `ARCHITECTURE_GUIDE.md` restoration boundary
- `.agents/rules/HARNESS_OPERATING_CONTRACT.md` creation direction
- long-term context authority hierarchy
- workflow resolution / Planner fallback rule
- human-facing artifact writing rule

Implementation is still not approved in this planning draft. Concrete file rewrites and runtime/workflow enforcement remain follow-up work.

## Exit Criteria
- A clear split exists between project architecture SSOT and harness self-architecture contract.
- Long-term context artifacts have explicit authority and non-authority rules.
- Execution truth and long-term context truth are separated in writing.
- A concrete follow-up map exists for `OPS-17`, `OPS-18`, `QLT-04`, and `PLN-17`.
- The operator/manual wave no longer has to guess against moving document boundaries.
- Human-facing canonical artifacts have an explicit readability rule instead of inheriting machine-facing wording by default.
