# PKT-01 OPS-15 Reusable Operator Discipline, Guidance, And Guidebook Expansion

## Purpose
- Convert the approved `PLN-14` planning result into one reusable operator-guidance packet.
- Add reusable Git/worktree discipline, project-start templates, role/thread bootstrap playbooks, verification scenario templates, automation catalog guidance, cloud/local merge guidance, and shipped guidebook expansion.
- Keep the lane inside rules/templates/manuals/playbooks instead of reopening runtime orchestration or parallel SSOT redesign.

## Approval Rule
- This packet is written before implementation.
- This packet stays narrow: it defines reusable operator rule, template, playbook, and manual-expansion surfaces only.
- This packet must preserve the current truth contract:
  - governance Markdown truth remains `.agents/artifacts/*`
  - DB hot-state remains `.harness/operating_state.sqlite`
  - generated docs remain derived output
  - `ACTIVE_CONTEXT.*` remains first-read re-entry and never write authority
- This packet must not introduce `/docs` as a parallel canonical SSOT tree.
- This packet must keep implementation blocked until detailed agreement and `Ready For Code` are both explicitly approved.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-15 reusable operator discipline, guidance, and guidebook expansion | `PLN-14` closed the planning boundary, but the reusable operator surfaces still need one concrete packet before implementation opens | approved |
| Ready For Code | approved | implementation must stay inside rules/templates/manuals/playbooks and must not widen into runtime tooling or second-SSOT redesign | approved |
| Human sync needed | yes | this lane changes shipped operator guidance and maintainer operating rules that non-specialist users will actually follow | approved |
| Gate profile | contract | this lane changes reusable rules, starter templates, and shipped manual surfaces | approved |
| User-facing impact | high | this packet changes how non-technical planners/operators are expected to start, split, verify, and close large-project work | approved |
| Layer classification | core | the change affects reusable operating rules and shipped guide surfaces | approved |
| Active profile dependencies | none | this is core reusable guidance work | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| UX archetype status | approved | the existing operator evidence/context archetype is sufficient for these guide/manual surfaces | approved |
| UX deviation status | none | no product UI deviation is proposed | not-needed |
| Environment topology status | not-needed | no deploy/cutover topology redesign is included | not-needed |
| Domain foundation status | not-needed | no domain-model or schema-impact work is included | not-needed |
| Authoritative source intake status | approved | the approved `PLN-14` planning result and the attached manual are sufficient authority for this concrete follow-up packet | approved |
| Shared-source wave status | not-needed | no multi-packet source-wave rebaseline is required | not-needed |
| Packet exit gate status | approved | reusable guidance/manual/template completion plus root/starter verification evidence are present | approved |
| Improvement promotion status | proposed | this lane promotes manual-derived operator guidance into reusable shipped harness behavior | proposed |
| Existing system dependency | none | this is harness-only work | not-needed |
| New authoritative source impact | analyzed | no new external source is entering beyond the already reviewed and approved manual input | analyzed |
| Risk if started now | medium | if the boundary widens into tooling, validator, or second-SSOT design, the lane will become too broad for one concrete packet | approved |

## 1. Why This Packet Exists
- `PLN-14` already fixed the reusable planning direction for six operator-facing deliverables:
  - Git/worktree operating rules
  - project-start document pack
  - role/thread bootstrap playbook
  - verification scenario template
  - automation catalog and cloud/local merge playbook
  - shipped guidebook expansion for non-technical planners/operators
- If those decisions remain planning-only, the harness will still depend on ad hoc operator judgment in areas where the attached manual showed real friction.
- This packet converts the approved planning result into one concrete reusable implementation boundary.

## 2. Goal
- Make the harness easier for non-specialist planners/operators to use on large projects without weakening the current governance model.
- Ship reusable operator guidance and templates that reduce avoidable mistakes before implementation and during parallel work.
- Expand the shipped harness manual into a practical guidebook for using this harness and Codex-like AI tools from project kickoff through deployment and operations.

## 3. In Scope
- reusable Git/worktree operating rule surface
- project-start document pack templates
- role/thread bootstrap playbook
- reusable verification scenario template
- automation catalog guidance
- cloud/local merge playbook guidance
- expansion of `standard-template/reference/manuals/HARNESS_MANUAL.md` into an end-to-end non-technical operator guidebook
- root / `standard-template` synchronization where reusable guidance/manual surfaces are shared

## 4. Out Of Scope
- Git command automation or branch orchestration tooling
- automatic cloud sync/merge runtime behavior
- new validator hard-enforcement except where already required by existing reusable contracts
- `/docs`-centric canonical SSOT redesign
- product-specific folder layout defaults
- new workflow role system that competes with the approved role contract

## 4A. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  the harness is strong on governance, packet, and validation discipline, but a non-technical planner/operator still lacks one practical reusable guide for how to start a project, split work safely, coordinate AI threads, manage parallel work, verify changes, and carry the project through deployment and operations.
- 작업 후 사용자가 체감해야 하는 변화:
  a humanities-background planner/operator should be able to use the shipped harness manual, starter templates, and playbooks to run a large project with Codex-like AI assistance without guessing the process or bypassing packet/approval/validation rules.

## 4B. UX / Interaction Surface
- Screen / surface type:
  Markdown manuals, templates, playbooks, and starter guidance
- Primary operator:
  non-technical planner/operator using the harness with Codex-like AI tools
- UX archetype reference: existing operator evidence/context archetype
- Selected UX archetype: not-needed
- Archetype fit rationale:
  this lane changes reusable reading and operating guidance rather than application UI behavior
- Archetype deviation / approval:
  none
- 영향받는 화면:
  root/starter guidance docs and reusable templates only
- interaction:
  operator reads the guidebook, opens role-scoped threads, chooses worktree discipline, prepares packets, verifies work, and merges parallel outputs using the approved guidance
- copy/text:
  Korean-first, operator-oriented, explicit about what is guidance and what remains canonical SSOT
- feedback/timing:
  visible at project start, packet start, validation, merge, deployment, and operations time
- source trace fallback:
  packet, requirements, architecture, implementation plan, and validation report remain the canonical trace surfaces

## 4C. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  reusable operator rules, templates, and shipped manual hierarchy belong in core
- Active profile dependencies:
  none
- Profile-specific evidence status:
  not-needed
- Required reading before code:
  `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `.agents/rules/workspace.md`, `.agents/rules/agent_behavior.md`, `.agents/workflows/plan.md`, `reference/planning/PLN-14_OPERATOR_DISCIPLINE_GUIDANCE_AND_STARTER_TEMPLATES_DRAFT.md`, `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`, `reference/manuals/HARNESS_MANUAL.md`, `standard-template/reference/manuals/HARNESS_MANUAL.md`
- Security review evidence status:
  not-needed
- Environment topology reference:
  not-needed
- Source environment:
  maintainer repo guidance/manual/template surfaces
- Target environment:
  root plus `standard-template` shipped operator surfaces
- Execution target:
  reusable docs, templates, and rules only
- Transfer boundary:
  root/manual/template sources to copied-project operator guidance surfaces
- Rollback boundary:
  revert this packet's guidance/manual/template changes if operator clarity regresses or if the lane widens beyond the approved scope
- Domain foundation reference:
  not-needed
- Schema impact classification:
  none
- DB / state 영향:
  no schema redesign is included; planner-facing docs/state references may change
- Markdown / docs 영향:
  workspace rules, starter templates, reusable manuals, and playbooks may change
- generated docs 영향:
  no generated-state contract redesign is included; only later packet/state references may mention the new guidance surfaces
- validator / cutover 영향:
  validator hardening is out of scope in the first pass; only existing reusable checks remain
- Authoritative source refs:
  `C:/Users/ahyne/Documents/Codex/2026-05-13/codex-gpt-codex-md-codex-git/codex-large-project-manual-ko.md`, `reference/planning/PLN-14_OPERATOR_DISCIPLINE_GUIDANCE_AND_STARTER_TEMPLATES_DRAFT.md`, `standard-template/reference/manuals/HARNESS_MANUAL.md`
- Authoritative source intake reference:
  `reference/planning/PLN-14_OPERATOR_DISCIPLINE_GUIDANCE_AND_STARTER_TEMPLATES_DRAFT.md`
- Authoritative source disposition:
  approved planning result plus reviewed manual input
- New planning source priority / disposition:
  none
- Existing plan conflict:
  current harness guidance is strong on governance but still under-packaged for non-specialist operators
- Current implementation impact:
  root/starter docs, reusable templates, and operating rule text
- Required rework / defer rationale:
  defer runtime tooling and validator-expansion follow-ups unless later evidence shows they are necessary
- Impacted packet set scope:
  single-packet

## 5. Approved Planning Inputs
- `reference/planning/PLN-14_OPERATOR_DISCIPLINE_GUIDANCE_AND_STARTER_TEMPLATES_DRAFT.md`
- `C:/Users/ahyne/Documents/Codex/2026-05-13/codex-gpt-codex-md-codex-git/codex-large-project-manual-ko.md`
- `.agents/rules/workspace.md`
- `.agents/rules/agent_behavior.md`
- `.agents/workflows/plan.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- `reference/manuals/HARNESS_MANUAL.md`
- `standard-template/reference/manuals/HARNESS_MANUAL.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`

## 6. Fixed Planning Contract From PLN-14
- Preserve the current truth contract and do not introduce a `/docs`-centric parallel SSOT.
- Keep the first concrete follow-up inside rules/templates/manuals/playbooks.
- Deliver all six approved operator-facing surfaces inside one concrete packet if the boundary remains narrow enough.
- Treat the shipped guidebook as a user-facing explanation layer, not as a replacement for canonical governance artifacts.

## 7. Proposed Detailed Agreement
- `OPS-15` should implement the smallest reusable change set that makes the `PLN-14` operator-guidance decisions real.
- The first implementation should prefer:
  - clear reusable rule text where operator safety depends on it
  - copy-ready templates where operator burden is the main problem
  - practical guidebook/playbook examples where workflow usage is otherwise too implicit
- The first implementation must preserve:
  - packet-before-code
  - Active Context first-read authority
  - human approval boundaries
  - tester/reviewer separation
  - root / `standard-template` sync
- The first implementation must not turn the guidebook into a second SSOT or a path around packet/approval/validation discipline.

## 7B. Approved Detailed Agreement
- `OPS-15` remains one concrete packet.
- Git/worktree discipline is approved as a strong default with explicit exception gates, not as an unconditional hard rule in the first pass.
- `standard-template/reference/manuals/HARNESS_MANUAL.md` is approved to expand into a full lifecycle operator guidebook covering:
  - project start
  - requirements and design
  - implementation supervision
  - verification
  - deployment
  - operations
  - prompt examples
- The guidebook remains explanatory only and must not become SSOT, workflow authority, or an approval bypass.
- Cloud/local merge remains docs/playbook guidance only.
- Runtime tooling, Git automation, cloud sync tooling, and validator expansion are explicitly out of scope.
- `Ready For Code` is approved for the bounded docs/templates/manuals/playbook implementation defined by this packet.

## 7A. Proposed Reusable Deliverable Boundary
- `A. Git / worktree operating rule surface`
  - default-branch direct feature development disallowed or explicit exception-gated
  - branch/worktree purpose, diff review, and merge-condition rules
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
  - `standard-template/reference/manuals/HARNESS_MANUAL.md`
  - project start through deployment and operations
  - harness usage plus Codex-like AI usage guidance
  - practical flow examples and prompt/playbook examples

## 8. Proposed Implementation Boundary
- Include:
  - workspace-rule updates
  - reusable starter/project templates
  - role/thread playbooks
  - verification scenario template
  - automation catalog guidance
  - cloud/local merge manual guidance
  - shipped guidebook expansion
  - root / `standard-template` sync
- Exclude:
  - runtime command additions
  - Git/cloud automation tooling
  - validator hardening beyond current reusable minimums
  - product-structure defaults
  - second-SSOT redesign
  - workflow-authority reassignment into guidebook/manual surfaces

## 9. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale: reusable operator rules, templates, and shipped manual hierarchy belong in core
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `.agents/rules/workspace.md`, `.agents/rules/agent_behavior.md`, `.agents/workflows/plan.md`, `reference/planning/PLN-14_OPERATOR_DISCIPLINE_GUIDANCE_AND_STARTER_TEMPLATES_DRAFT.md`, `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`, `reference/manuals/HARNESS_MANUAL.md`, `standard-template/reference/manuals/HARNESS_MANUAL.md`
- Environment topology reference: not-needed
- Source environment: maintainer repo guidance/manual/template surfaces
- Target environment: root plus `standard-template` shipped operator surfaces
- Execution target: reusable docs, templates, and rules only
- Transfer boundary: root/manual/template sources to copied-project operator guidance surfaces
- Rollback boundary: revert this packet's guidance/manual/template changes if operator clarity regresses or if the lane widens beyond the approved scope
- Domain foundation reference: not-needed
- Schema impact classification: none
- DB / state 영향: no schema redesign is included; planner-facing docs/state references may change
- Markdown / docs 영향: workspace rules, starter templates, reusable manuals, and playbooks may change
- generated docs 영향: no generated-state contract redesign is included; only later packet/state references may mention the new guidance surfaces
- validator / cutover 영향: validator hardening is out of scope in the first pass; only existing reusable checks remain
- Authoritative source refs: `C:/Users/ahyne/Documents/Codex/2026-05-13/codex-gpt-codex-md-codex-git/codex-large-project-manual-ko.md`, `reference/planning/PLN-14_OPERATOR_DISCIPLINE_GUIDANCE_AND_STARTER_TEMPLATES_DRAFT.md`, `standard-template/reference/manuals/HARNESS_MANUAL.md`
- Authoritative source intake reference: `reference/planning/PLN-14_OPERATOR_DISCIPLINE_GUIDANCE_AND_STARTER_TEMPLATES_DRAFT.md`
- Authoritative source disposition: approved planning result plus reviewed manual input
- New planning source priority / disposition: none
- Existing plan conflict: current harness guidance is strong on governance but still under-packaged for non-specialist operators
- Current implementation impact: root/starter docs, reusable templates, and operating rule text
- Required rework / defer rationale: defer runtime tooling and validator-expansion follow-ups unless later evidence shows they are necessary
- Impacted packet set scope: single-packet

## 9. Proposed Operator Outcome
- A non-technical planner/operator should be able to start a large project with the shipped harness and know:
  - which documents to prepare first
  - how to open role-scoped AI threads
  - when to use worktrees
  - how to verify work
  - how to coordinate cloud/local parallel work
  - how to move from planning to deployment/operations without skipping approvals
- The operator should not need to infer these behaviors from scattered rules or internal repository history.

## 10. Verification Direction
- targeted regression for root / `standard-template` guidance parity where shared surfaces are touched
- targeted review of Git/worktree rule clarity
- targeted review of project-start template completeness
- targeted review of role/thread bootstrap playbook usefulness
- targeted review of verification scenario template completeness
- targeted review of automation catalog and cloud/local merge clarity
- targeted review of shipped guidebook completeness from kickoff through deployment and operations
- root `node --test .harness/test/*.test.js`
- `standard-template` `node --test .harness/test/*.test.js`
- root `node .harness/runtime/state/dev05-cli.js validate`
- root `node .harness/runtime/state/dev05-cli.js validation-report`
- root `node .harness/runtime/state/dev05-cli.js context`

## Verification Manifest
- Gate profile:
  contract
- Verification manifest:
  - contract: detailed agreement, Ready For Code, root sync, standard-template sync, targeted guidance/manual review, root test suite, starter test suite, validator, review closeout
  - targeted regression for root / `standard-template` guidance parity
  - targeted review of Git/worktree rule clarity
  - targeted review of project-start template completeness
  - targeted review of role/thread bootstrap playbook usefulness
  - targeted review of verification scenario completeness
  - targeted review of automation catalog and cloud/local merge clarity
  - targeted review of shipped guidebook completeness from kickoff through deployment and operations
  - root `node --test .harness/test/*.test.js`
  - `standard-template` `node --test .harness/test/*.test.js`
  - root `node .harness/runtime/state/dev05-cli.js validate`
  - root `node .harness/runtime/state/dev05-cli.js validation-report`
  - root active context: `node .harness/runtime/state/dev05-cli.js context`

## 11. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Open `OPS-15` as the next concrete `PLN-14` follow-up | yes | user/planner | approved | `PLN-14` detailed agreement approved this as the first concrete follow-up shape |
| Detailed agreement | yes | user/planner | approved | one packet is approved; Git/worktree is strong-default with explicit exception gates; full lifecycle guidebook depth is approved; guidebook remains explanatory only |
| Ready For Code | yes | user | approved | implementation is approved for the bounded docs/templates/manuals/playbook scope defined by this packet |

## 12. Current Planning Decision
- Detailed agreement: approved
- Ready For Code: approved
- Remaining planner action before implementation opens:
  none

## 13. Implementation Notes
- Keep the packet reusable and operator-oriented.
- Preserve the guidebook/manual layer as explanation, not canonical truth.
- If the guidebook scope starts requiring major validator/runtime/tooling changes, stop and split the packet instead of silently widening it.
- Keep Git/worktree discipline at the approved strong-default plus explicit-exception level unless a later approved packet chooses stricter enforcement.

## 14. Verification Plan
- The contract gate is carried by `## Verification Manifest` above.

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference:
  `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation:
  approved for reviewed-scope closeout.
- Tester evidence:
  root/starter parity checks passed; no WBMS-specific wording remains; referenced guidance files exist; root tests, starter tests, validator, and validation report passed.
- Reviewer finding status:
  no blocking finding remains.
- Source parity result:
  root and `standard-template` reusable rule, workflow, packet-template, manual, playbook, and template surfaces are synchronized for the OPS-15 scope.
- Validation / security / cleanup evidence:
  root tests passed; `standard-template` tests passed; validator passed with zero findings; validation report passed; security review is not applicable for this docs/templates/manuals/playbook packet; WBMS-specific naming cleanup is complete.

## 16. Reopen Trigger
- below situations reopen this packet:
- the guidebook starts acting as parallel SSOT instead of user-facing guidance
- the Git/worktree rule cannot be closed without runtime/tooling redesign
- cloud/local merge guidance proves too broad for docs-only handling
- root and `standard-template` guidance surfaces drift
- practical non-technical operator flow from kickoff through deployment/operations is still incomplete after the first implementation proposal
