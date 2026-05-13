# PLN-14 Operator Discipline, Guidance, And Starter Templates Draft

## Status
- Draft prepared on 2026-05-13 from the user-requested review of the attached Codex large-project manual.
- This draft is not implementation approval by itself.
- The reusable baseline is currently on planner hold with no active lane.
- This draft is now the approved next planning lane.
- Detailed agreement approved on 2026-05-13.
- This lane remains planning-only and does not open implementation by itself.

## Purpose
This draft defines the next reusable operator-surface planning lane after the recent runtime, packet, distribution, and manual follow-ups closed.

The goal is to absorb the manual-derived large-project operating ideas that are useful for this harness without weakening the current SSOT, Active Context, packet-before-code, tester/reviewer separation, or root/starter synchronization model.

## Approved Direction Snapshot
- Preserve the current truth contract:
  - governance Markdown truth remains `.agents/artifacts/*`
  - DB hot-state remains `.harness/operating_state.sqlite`
  - generated docs remain derived output
  - `ACTIVE_CONTEXT.*` remains first-read re-entry and never write authority
- Do not introduce `/docs` as a parallel SSOT tree.
- Prefer reusable operator guidance, templates, and playbooks over new runtime/control-plane complexity.
- Treat the attached manual as an operator-guidance source, not as a replacement for current harness contracts.
- Keep implementation blocked until a concrete follow-up packet closes detailed agreement and `Ready For Code`.

## Why This Lane Exists
- The harness already implements strong reusable contracts for:
  - packet-before-code
  - role separation
  - human approval boundaries
  - validation/rollback gates
  - Active Context re-entry
  - preventive-memory promotion
- The attached manual still surfaces real operator gaps that are not yet strongly packaged in the harness:
  - Git/worktree operating discipline
  - project-start document pack templates
  - role/thread bootstrap playbooks
  - verification scenario templates
  - automation catalog and cloud/local merge playbook
- The current shipped harness manual already explains the harness well at the command/artifact level, but it does not yet fully act as an end-to-end guidebook for a non-technical planner/operator who must use this harness plus Codex-like AI tools from kickoff through deployment and ongoing operations.
- These are mostly guidance/template surfaces rather than broad runtime redesign, but they still affect reusable operator behavior and root/`standard-template` shipped guidance.

## Current Observations
- Current core rules are strong on lane/workflow/handoff discipline, but weak on explicit Git/worktree operating rules.
- Current requirements and architecture contracts are strong on scope, approval, and evidence boundaries, but weak on one-shot starter templates for non-specialist operators.
- Current workflows already define role authority/non-authority, but do not ship a reusable thread-bootstrap playbook that a human operator can apply immediately when opening a new thread.
- Current validation/report contracts are strong, but verification scenario authoring remains more implicit than template-driven.
- Current preventive memory and automation mindset are present, but there is no approved reusable catalog that tells operators which recurring automation to use and when.
- Current shipped manual surface:
  - `standard-template/reference/manuals/HARNESS_MANUAL.md`
  is a strong primary manual for harness concepts, artifacts, and CLI flow, but it is not yet broad enough to function as a practical large-project guidebook for a humanities-background planner from project start through design, implementation supervision, validation, deployment, and operations.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | PLN-14 operator discipline, guidance, starter templates, and guidebook expansion | the harness is strong on core governance but still weak on operator-friendly Git/thread/template/automation surfaces and an end-to-end non-technical operator guide derived from the reviewed manual | approved-draft |
| Ready For Code | not-needed | this draft should choose the next concrete follow-up packet shape before implementation opens | not-needed |
| Human sync needed | yes | the user should confirm whether these six surfaces stay one reusable packet or split, and how strict the Git/worktree boundary should be | approved |
| Gate profile | contract | the likely follow-up changes reusable rules, templates, manuals, and starter/operator guidance | approved-draft |
| User-facing impact | medium | this changes what non-specialist operators read and do before implementation and during parallel work | approved-draft |
| Layer classification | core | the candidate follow-up affects reusable operating rules and shipped guidance surfaces | approved-draft |
| Active profile dependencies | none | this is core reusable planning | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| Packet exit gate status | pending | planning closeout depends on opening the concrete follow-up packet under the approved boundary | pending |

## 1. Goal
- Add reusable operator guidance for Git/worktree, thread bootstrap, verification scenarios, automation choice, and cloud/local merge discipline.
- Add reusable starter templates that make large-project kickoff more structured for non-specialist operators.
- Expand the shipped harness manual so it can guide a non-technical planner/operator through project start, planning, packet usage, implementation supervision, validation, deployment, and ongoing operations with Codex-like AI assistance.
- Keep the result inside guidance/template/manual/rule surfaces unless a later approved packet explicitly widens the scope.

## 2. Proposed Scope
- Define whether Git/worktree discipline becomes a hard reusable rule or a strong default.
- Define a project-start document pack template set.
- Define role/thread bootstrap playbooks that map to the current workflow system.
- Define a reusable verification scenario template.
- Define an automation catalog and a cloud/local merge playbook.
- Define how `standard-template/reference/manuals/HARNESS_MANUAL.md` should expand from a harness-operation manual into a practical large-project guidebook for non-technical planners/operators.
- Recommend the concrete follow-up packet shape after this draft closes.

## 3. Proposed Planning Questions
- Should `main` / default-branch direct feature development become a reusable hard rule, or a strong recommended practice with explicit exception handling?
- Which project-start artifacts belong in reusable starter templates versus project-specific packet/detail artifacts?
- How should thread bootstrap playbooks map to the current workflow role set without creating a second parallel role system?
- Should verification scenario templates stay docs-only, or also influence packet/closeout evidence expectations later?
- Should the cloud/local merge playbook remain manual guidance only, or reserve a later runtime/tooling follow-up?
- How far should the shipped harness manual go in teaching project execution:
  - harness usage only
  - harness usage plus project-start/planning/design/verification/deploy/ops procedure
  - harness usage plus copy-ready prompts/examples for each phase
- Is one concrete follow-up packet narrow enough, or should this lane intentionally sequence two smaller packets?

## 4. Working Boundary
- Keep this lane in planning.
- Do not implement new runtime commands, Git automation, cloud sync, or branch orchestration in this draft.
- Do not replace the current truth contract with a `/docs`-centric model.
- Do not reopen packet-template redesign beyond what is strictly needed for starter templates or verification scenario guidance.
- Do not widen into hosted CI/program governance or product-specific project structure defaults.
- Do not turn the shipped harness manual into a second canonical SSOT that competes with `.agents/artifacts/*`; it must remain a user-facing guidebook layered on top of the existing truth contract.

## 5. Initial Recommendation
- Keep the five requested surfaces inside one planning lane because they all serve the same operator problem:
  - how to start work
  - how to split work
  - how to verify work
  - how to merge parallel work
  - how to use recurring automation intentionally
- Add shipped manual expansion to the same lane because the user-facing guidebook is the place where non-specialist operators will actually consume these five surfaces from kickoff through deployment and operations.
- Prefer one concrete follow-up packet first if the boundary stays limited to rules/templates/manuals/playbooks.
- Split into a later second packet only if the cloud/local merge or verification scenario work starts requiring runtime or validator changes beyond reusable guidance.

## 6. Non-Goal
- Do not invent a new Git control plane.
- Do not make cloud the new authority source.
- Do not force a fixed frontend/backend/database folder layout into core.
- Do not create a parallel role taxonomy that competes with the approved workflow roles.
- Do not convert every guidance surface into hard validator enforcement in the first pass.
- Do not promise that AI alone can replace human approvals, packet discipline, or project-specific design decisions; the guidebook must explain how to use AI inside the harness, not bypass it.

## 7. Planning Inputs
- `C:/Users/ahyne/Documents/Codex/2026-05-13/codex-gpt-codex-md-codex-git/codex-large-project-manual-ko.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- `.agents/artifacts/CURRENT_STATE.md`
- `.agents/artifacts/TASK_LIST.md`
- `.agents/artifacts/PREVENTIVE_MEMORY.md`
- `.agents/rules/workspace.md`
- `.agents/rules/agent_behavior.md`
- `.agents/workflows/plan.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- `reference/manuals/HARNESS_MANUAL.md`
- `standard-template/reference/manuals/HARNESS_MANUAL.md`

## 8. Proposed Detailed Agreement
- `PLN-14` should stay a planning-only lane that chooses the reusable operator-guidance follow-up shape.
- The first implementation should prefer:
  - rules where operator safety truly depends on them
  - templates where operator burden is the main problem
  - manuals/playbooks where workflow mapping needs to be easier to consume
- The lane should preserve the current harness strengths:
  - packet-before-code
  - Active Context first-read authority
  - human approval boundaries
  - tester/reviewer separation
  - root/`standard-template` synchronization
- The lane should not create a second SSOT tree or a second workflow system.
- The lane should treat manual expansion as a user-facing explanation layer:
  - the guidebook should help a non-technical planner use the harness and Codex-like AI tools successfully
  - the guidebook must not redefine the underlying truth contract, workflow authority, or approval boundaries

## 8A. Proposed Reusable Deliverable Set
- `A. Git / worktree operating rule surface`
  - direct feature development on the default branch is disallowed or explicitly exception-gated
  - worktree/branch purpose, diff review, and merge-condition expectations are documented
- `B. project-start document pack`
  - charter
  - user roles
  - workflows
  - screen list
  - data model draft
  - API spec draft
  - test plan
  - deployment/operations plan
- `C. role/thread bootstrap playbook`
  - role
  - allowed scope
  - forbidden scope
  - required inputs
  - expected output
  - validation
  - next handoff
- `D. verification scenario template`
  - normal
  - error
  - permission
  - regression
  - manual check
  - evidence location
- `E. automation catalog and cloud/local merge playbook`
  - when to use recurring automations
  - how to split long-running parallel work
  - how cloud results return to local review/merge/validation
- `F. shipped guidebook expansion`
  - expand `standard-template/reference/manuals/HARNESS_MANUAL.md`
  - explain how a non-technical planner/operator should use the harness from kickoff through deployment and operations
  - show how Codex-like AI tools fit into each phase without bypassing packet, approval, validation, or handoff discipline
  - provide practical flow examples and prompt/playbook examples where helpful

## 8B. Proposed Concrete Follow-Up Shape
- Preferred first concrete follow-up:
  - `OPS-15` reusable operator discipline and starter-guidance surfaces
- Proposed scope of `OPS-15`:
  - `.agents/rules/workspace.md` rule updates
  - starter/project planning templates
  - role/thread bootstrap playbook
  - verification scenario template
  - automation catalog
  - cloud/local merge manual guidance
  - shipped harness manual expansion in `standard-template/reference/manuals/HARNESS_MANUAL.md`
- First-pass non-scope of `OPS-15`:
  - Git command automation
  - new runtime orchestration
  - automatic cloud sync/merge tooling
  - branch-state validator enforcement beyond clearly reusable minimums

## 9. Open Decisions
- Should the Git/worktree rule be `hard rule` or `strong default with explicit exception`?
- Should the project-start document pack live under `reference/artifacts/`, `reference/templates/`, or another reusable location?
- Should the thread bootstrap playbook map only to approved workflow roles, or also include optional sub-role examples such as BA/DBA/DevOps?
- Should verification scenario templates remain guidance-only in the first pass, or should packet closeout later reference them explicitly?
- Should cloud/local merge guidance stay docs-only, or reserve a later tooling follow-up packet?
- Should the shipped harness manual include:
  - project-start procedure
  - requirements/design artifact checklist
  - implementation supervision flow
  - validation/deploy/ops guide
  - copy-ready prompts/examples for non-technical operators
- Is one `OPS-15` packet narrow enough, or should this planning lane recommend a split such as:
  - packet A: Git/worktree + cloud/local merge discipline
  - packet B: starter templates + playbooks + verification scenarios + automation catalog + shipped guidebook expansion

## 10. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Open `PLN-14` as the next planning lane | yes | user/planner | approved | user approved this operator-guidance follow-up as the next planning lane on 2026-05-13 |
| Detailed planning agreement | yes | user/planner | approved | the six-surface boundary including shipped guidebook expansion and the no-second-SSOT rule are approved |
| Concrete follow-up shape | yes | user/planner | approved | first concrete follow-up should open as one `OPS-15` packet unless later packet drafting proves the boundary too broad |
| Ready For Code | no | - | not-needed | this draft itself is planning-only |

## 11. Planner Recommendation
- Open `PLN-14` as the next planning lane.
- Prefer one first concrete packet, `OPS-15`, if the implementation stays inside rules/templates/manuals/playbooks.
- Keep implementation blocked until the concrete follow-up packet closes detailed agreement and `Ready For Code`.

## 12. Detailed Agreement Close Condition
- This planning lane is ready for `detailed agreement` approval when the user can answer yes to all of these:
- the harness should adopt reusable Git/worktree discipline rather than leaving branch/worktree behavior implicit
- the harness should ship a project-start document pack for non-specialist operators
- the harness should ship role/thread bootstrap playbooks that map into the existing workflow system rather than replacing it
- the harness should ship a reusable verification scenario template
- the harness should ship an automation catalog and a cloud/local merge playbook as operator guidance
- the harness should preserve the current truth contract and should not introduce a `/docs`-centric parallel SSOT
- the shipped harness manual should expand into a practical guidebook that teaches a non-technical planner/operator how to use this harness and Codex-like AI tools from project start through deployment and operations without weakening the underlying contracts
- implementation should stay blocked until a concrete follow-up packet is approved

## 13. Current Planning Decision
- Draft selection: approved
- Detailed agreement: approved
- Ready For Code: not-needed
- Remaining planner action:
  draft the concrete `OPS-15` follow-up packet and keep implementation blocked until that packet closes its own detailed agreement and `Ready For Code`.
