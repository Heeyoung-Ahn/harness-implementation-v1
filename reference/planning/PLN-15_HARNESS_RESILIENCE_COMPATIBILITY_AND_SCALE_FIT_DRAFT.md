# PLN-15 Harness Resilience And Scale-Fit Draft

## Status
- Draft revised on 2026-05-13 after user review.
- This draft is Planner analysis only.
- This draft is not implementation approval by itself.
- The reusable baseline is currently on planner hold with no active lane.
- Ready For Code remains blocked until a concrete follow-up packet is separately approved.
- Node.js 22 support is explicitly excluded from this improvement wave by user direction.

## Purpose
This planning draft evaluates the remaining eight external-review improvement items against the current standard harness architecture and turns the accepted items into a concrete follow-up packet plan.

The goal is to improve real operator usability, workflow reliability, multi-agent safety, and scale-fit without weakening SSOT, Active Context derived-state boundaries, packet-before-code, generated-doc immutability, Tester / Reviewer separation, or root / `standard-template` synchronization.

## Excluded Item
| Excluded item | Reason | Current policy |
|---|---|---|
| Node.js 22 support | user explicitly removed it from this planning wave | keep the current Node.js 24+ harness runtime requirement unchanged |

This draft must not open a Node.js compatibility audit, engine downgrade, launcher rewrite, or documentation change for Node.js 22 support.

## Current Baseline Observations
- The harness already has strong contracts for SSOT, Active Context, packet-before-code, handoff, workflow role separation, generated-doc immutability, validation reports, and root / `standard-template` sync.
- The harness currently favors complex-project governance, which is useful for high-risk work but can feel heavy for small projects or MVPs.
- Drift handling currently detects stale or mismatched state and requires regeneration / validation / human confirmation rather than broad automatic mutation.
- Workflow obedience is mostly enforced through workflow Markdown, packet state, transition tooling, validator checks, and review discipline; it is not yet a complete code-enforced role firewall.
- The operator-facing surface still needs more "what do I do now?" checklists, not only concept explanations.

## Pessimistic Critique Disposition
The additional critique is intentionally severe, but it identifies a real failure mode: this harness can become a modern Markdown/AI version of heavyweight RUP if every project is forced through full governance regardless of risk.

Planner judgment:
- The critique is correct that document-maintenance cost, gate fatigue, profile evidence growth, and AI rule overload are real long-term risks.
- The critique is overstated when it treats Markdown SSOT as inherently wrong. In this harness, Markdown governance truth is intentional because humans must read and approve project decisions. The real problem is not Markdown itself; the problem is uncontrolled duplication, excessive mandatory sections, and weak enforcement of what is truly required versus not needed.
- The right correction is not to remove governance. The right correction is to add a governance load budget, tiered starter modes, risk-triggered evidence, and smaller packet minimums.
- Full governance should be opt-in or risk-triggered, not the emotional default for every small project.
- Minimal mode must still protect risky work. It should reduce paperwork for low-risk work, not create a bypass for data, security, deployment, or approval-sensitive work.
- The latest adoption-focused critique is also correct that the most likely failure is not technical failure. The more likely failure is that operators do not start, bypass the harness, or operate it as a checklist ritual without real review.

## Adoption-Failure Risk Model
The next improvement wave must prioritize preventing user dropout and procedural bypass.

Likely failure patterns:
- `adoption failure`: Node/runtime or document complexity blocks the operator before first useful work. Node.js 22 is excluded from this wave, so this plan must compensate through clearer onboarding and bundled-runtime guidance rather than compatibility work.
- `direct-AI bypass`: operator asks AI to implement immediately because packet / SSOT / workflow concepts are unclear.
- `formal operation`: one person performs Planner, Developer, Tester, and Reviewer roles as a ritual without independent evidence quality.
- `drift spiral`: manual edits create drift, validator fails, operator cannot understand why, then directly edits more files.
- `minimal-mode absence`: small work feels over-governed, so the operator completes it outside the harness and later avoids the harness for larger work.

Planning implication:
- The first follow-up should not be multi-model coordination.
- The first follow-up should close operator entry, tiered governance, governance load, and "what validation does not prove" assumptions.
- Multi-model coordination remains important, but it is lower priority than preventing ordinary operators from abandoning the harness.

## Misconceptions To Actively Prevent
Future manuals, checklists, and gates must explicitly prevent these misunderstandings:

- More documents do not automatically mean more safety. Safety comes from the right evidence at the right risk boundary.
- `harness:validate` passing does not prove business correctness. It proves harness consistency and selected governance checks.
- AI reading a workflow file does not guarantee obedience. High-risk boundaries need runtime gates and negative tests.
- Full governance is not always safest. Actual safety equals control strength multiplied by the probability operators actually follow it.
- Active Context is not the source of truth. It is a first-read re-entry summary.
- Solo operation is allowed only when disclosed; it is not the same as independent Tester / Reviewer separation.

## Anti-Overgovernance Design Constraints
Future packets opened from this draft must obey these constraints:

- Evidence is required because it changes a decision, blocks a risk, or proves behavior; evidence is not required merely because a template has a blank section.
- Packet templates must support concise answers, `not-needed`, and `conditional` disposition without forcing boilerplate prose.
- Each starter mode must have a document/evidence budget that the operator can understand before starting.
- Human approval must be reserved for meaningful decision boundaries:
  - requirements / scope freeze
  - Ready For Code for risky or standard/full packets
  - data/schema/security/cutover/rollback decisions
  - profile or starter-mode rebaseline after approval
  - final packet exit when independent review is required
- Low-risk minimal-mode work may use simplified approval and review, but the risk-trigger rule immediately raises the packet to stronger governance.
- Optional profiles must not create uncontrolled evidence union growth. Profile composition needs an evidence cap and a clear "only if relevant to this packet" rule.
- AI workflow prompts must be short role bootstraps with links to authority, not full re-reading of every governance document.
- Runtime hard gates should enforce dangerous boundary violations, not every stylistic preference.
- Tests and executable validation should carry more weight than prose-only compliance.
- `PLN-16` must not become a new overgovernance packet. It must be internally staged so the lightweight governance contract can be approved before final operator wording is polished.
- Minimal-mode design must include an actual short packet example so "packet slimming" is proven, not merely promised.

## Revised Quick Decision Header
| Original item | Planner judgment | Apply? | First action | Risk if ignored |
|---|---|---:|---|---|
| 1. Non-technical concept primer | Strong fit | Yes | manual + one-page checklist packet | operator confusion stays high |
| 3. Profile mis-selection reset | Strong fit | Yes | reset playbook + mode/profile relation | wrong profile becomes sticky |
| 4. Code-enforced workflow gates | Strong fit | Yes | runtime gate packet | AI lane drift remains too easy |
| 5. Multi-model coordination | Strong fit, design-first | Yes | ownership/conflict contract | file/packet collision ambiguity |
| 6. Active Context stale/missing recovery | Strong fit | Yes | safe recovery command/flow | session recovery remains manual |
| 7. Drift auto-correction | Partial fit only | Limited | safe-fixer allow/deny contract | unsafe auto edits or unclear value |
| 8. Governance test rebalance | Strong fit | Yes | focused negative tests | governance regressions can slip |
| 9. Tiered starter modes | Strong fit, high adoption value | Yes | starter mode contract first | small projects avoid the harness |
| 10. Governance load budget / packet slimming | Strong fit | Yes | include in tiered starter contract | document fatigue causes bypass culture |

## Revised Priority
| Priority | Items | Reason |
|---|---|---|
| P0 | 1, 6, 9, 10 | operator entry, re-entry recovery, scale-fit, and governance load decide whether the harness is used at all |
| P1 | 3, 4, 7, 8 | profile recovery, workflow gates, safe-fix boundaries, and governance tests reduce misuse after adoption |
| P2 | 5 | multi-model conflict matters for parallel AI work but should follow the adoption and governance-load baseline |

## Detailed Item Analysis

### 1. Add Concepts And One-Page Checklist For Non-Technical Operators
Decision: apply, P0.

Pros:
- Helps operators understand SSOT, Active Context, Packet, Gate profile, Handoff, generated docs, workflow lane, Tester / Reviewer separation, cutover, and rollback before using the harness.
- Reduces repeated explanation burden during kickoff.
- Fits the Korean-first human-facing SSOT direction.
- A checklist gives operators an executable surface, not only a glossary.

Cons:
- Adds manual length.
- If not clearly marked as explanatory, concept pages can be mistaken for workflow authority.

Recommended application:
- Add a "first concepts for non-technical operators" section to `reference/manuals/HARNESS_MANUAL.md` and `standard-template/reference/manuals/HARNESS_MANUAL.md`.
- Add `Operator One-Page Checklist` draft v0.1 in the first follow-up planning packet, then finalize it in the later manual packet.
- The checklist must act like the first operational screen for non-technical operators, not as an appendix buried behind long manual prose.
- Add `Operator One-Page Checklist` with:
  - before starting today
  - before instructing AI
  - before Ready For Code
  - before reviewing output
  - before handoff
  - risk-trigger check
  - files that must not be changed without approval
- Add "what validation does not prove":
  - business requirements correctness
  - budget/accounting logic correctness
  - user acceptance
  - approval-chain completeness
  - field operation usability
  - legacy Excel/VBA process equivalence
- Add "when this harness is too heavy" guidance:
  - one-off document generation
  - tiny local scripts with no persistent data
  - disposable UI mockups
  - experiments where no handoff, deploy, data, security, or user-facing commitment exists
- Keep the section explanatory and cross-reference canonical authority paths instead of redefining rules.

### 3. Add Profile Mis-Selection Reset Procedure
Decision: apply.

Pros:
- A non-technical operator can choose the wrong profile early.
- A documented reset path lowers adoption anxiety.
- Fits the explicit-only profile activation contract.

Cons:
- Profile changes after packet approval can invalidate evidence and acceptance criteria.
- If made too casual, operators may treat profile selection as reversible even after implementation has started.

Recommended application:
- Add a `Profile Reselection / Reset Playbook`.
- Define three states:
  - before packet approval: profile may be reselected with a short rationale
  - after packet approval but before code: reopen Planner and revise packet evidence
  - after implementation starts: treat as rebaseline and require source-impact review
- Define the relationship between profile reset and tiered starter mode changes:
  - profile = project type / work pattern
  - starter mode = governance strictness
  - changing either after approval can invalidate packet evidence

### 4. Add Code-Enforced Workflow Gates
Decision: apply, but after adoption/tiered-governance baseline.

Pros:
- Reduces Developer doing Planner work, Tester fixing defects, or Reviewer approving without evidence.
- Converts the strongest workflow contracts from "read and obey" into runtime-enforced transition and validation checks.
- Aligns with packet-before-code and human approval.

Cons:
- Over-enforcement can block legitimate emergency correction or narrow documentation-only maintenance.
- Hard gates need explicit exception records, otherwise operators will bypass the harness.

Recommended application:
- Add a runtime/workflow gate packet that checks:
  - current role and allowed transition
  - active task owner
  - Ready For Code before implementation
  - Tester non-fix boundary
  - Reviewer evidence requirement
  - closeout prerequisites
  - exception reason when a documented bypass is used
- Add negative tests:
  - implementation attempted without Ready For Code must fail
  - Tester direct fix attempt must fail or require Developer handoff
  - Reviewer closeout without required evidence must fail
  - packet-less risky code change must fail or stay blocked

Allowed exception categories:
- planning-only analysis
- narrow documentation typo correction
- generated-state recovery
- emergency correction with explicit human approval
- maintainer-only low-risk template sync with recorded reason
- disclosed solo-operation mode where one human performs multiple roles, with reduced independence claims and clear residual risk

### 5. Define Multi-Model Coordination
Decision: apply, design-first, but lower priority than adoption-fit work.

Pros:
- Directly addresses Codex + Antigravity or local + cloud parallel work collisions.
- Makes file ownership, packet authority, and merge precedence explicit.
- Prevents the wrong question: precedence is not "which model wins" but "which approved packet, owner, source, and evidence wins".

Cons:
- If overbuilt, this becomes a multi-agent scheduler instead of a harness contract.
- Model-specific preference rules can age quickly and create vendor bias.

Recommended application:
- Define a `Multi-Model Ownership And Conflict Contract`.
- Use these rules:
  - approved packet is authority over model output
  - file/path ownership beats model identity
  - Reviewer adjudicates evidence and source parity
  - Planner resolves scope conflict
  - human approval resolves competing implementation candidates when both are plausible
- Add a conflict ledger template with:
  - assigned packet
  - model / agent
  - assigned files
  - blocked files
  - dependency files
  - expected output
  - file ownership start time
  - ownership expiry
  - merge candidate
  - rejected-with-reason
  - reviewer decision
  - accepted owner
  - final merged commit / change id

### 6. Automate Active Context Missing/Stale Recovery
Decision: apply, P0.

Pros:
- Active Context is the first AI re-entry surface, so stale or missing recovery is a high-leverage reliability improvement.
- Reduces broad rereads and session startup confusion.
- Aligns with the "regenerate before broad rereads" rule.

Cons:
- Active Context is not authority; auto-recovery must not silently rewrite canonical Markdown truth.
- If recovery hides upstream DB / generated-doc drift, it can make a broken state look healthy.

Recommended application:
- Add a safe recovery flow:
  - detect missing/stale `ACTIVE_CONTEXT.json`
  - regenerate generated state docs if needed
  - regenerate `ACTIVE_CONTEXT.json` and `.md`
  - run validation
  - report exact sources used
  - report recovery confidence
- Add an operator-friendly state explanation surface:
  - what was stale or missing
  - what was regenerated
  - what was not modified
  - whether the operator can continue
  - which source file to inspect if confidence is Low or Blocked
- Later CLI shape can be `context --repair` or `recover-context`; final naming should be decided in the concrete packet.

Recovery confidence:
| Condition | Confidence | Required action |
|---|---|---|
| DB, governance SSOT, generated docs, and Active Context align after regeneration | High | continue with normal workflow |
| DB and governance SSOT align but generated docs or Active Context were missing/stale | Medium | continue, but keep repair report in evidence |
| DB and governance SSOT conflict | Low | hold for Planner or maintainer reconciliation |
| packet status, owner, or approval state is unclear | Blocked | do not continue; request human/Planner decision |

Hard boundary:
- Recovery may refresh derived outputs.
- Recovery must not edit `.agents/artifacts/*`, packet approval state, workflow lane state, reviewer evidence, migration/cutover decision, or rollback decision unless invoking an existing approved state operation.

### 7. Add Drift Auto-Correction Only For Safe Derived Outputs
Decision: apply only narrowly.

Pros:
- Safe auto-fixes can reduce repeated low-value manual remediation.
- Generated docs and Active Context are derived outputs, so regeneration is a natural safe fix.
- Some simple index/cache refreshes can be deterministic.

Cons:
- Broad auto-correction is dangerous because governance Markdown and DB hot-state are authority layers.
- A validator that both detects and mutates authority state becomes hard to reason about.
- Auto-fix scope must be obvious to operators.

Allowed automatic fixes:
- generated docs regeneration
- Active Context regeneration
- index/cache refresh
- derived validation summary refresh
- harmless formatting only when the target is explicitly derived output

Forbidden automatic fixes:
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- `.agents/artifacts/CURRENT_STATE.md`
- `.agents/artifacts/TASK_LIST.md`
- packet approval state
- workflow lane state
- reviewer approval evidence
- migration / cutover decision
- rollback decision
- DB hot-state mutation outside approved transition/state operations

Recommended application:
- Split drift handling into:
  - detection: validator
  - safe derived regeneration: context/generated-doc tooling
  - authority mutation: explicit transition or approved packet only
- Add `--fix-safe` only after the allow/deny list is approved.

### 8. Rebalance Tests Toward Governance Logic
Decision: apply.

Pros:
- Current large tests cover broad runtime behavior, but targeted governance regressions should be easier to locate and review.
- Workflow transition, approval gates, Active Context recovery, profile reset, multi-model conflict, and tiered starter modes are areas where regressions can invalidate the harness.
- Negative tests are especially important because the harness must prevent unsafe actions.

Cons:
- More test files increase suite surface and fixtures.
- If split poorly, tests can duplicate setup and become slower.

Recommended application:
- Add focused test files rather than expanding the largest existing tests:
  - workflow-transition-gates
  - approval-gate-enforcement
  - active-context-recovery
  - profile-reselection
  - multi-model-conflict-contract
  - tiered-starter-mode-contract
- Preserve root and `standard-template` parity for reusable behavior.

### 9. Add Tiered Starter Modes
Decision: apply, design-first, P0.

Pros:
- Solves the valid critique that the full harness can be too heavy for MVPs, one-off automations, or small prototypes.
- Lets the operator choose proportional governance without abandoning the core truth contract.
- Makes project scale distinct from optional profile type.

Cons:
- Multiple starter modes can fragment the baseline if not governed by one invariant contract.
- Minimal mode can become a loophole for skipping necessary approval, validation, or rollback evidence on risky work.

Recommended application:
- Define three modes:
  - `minimal`: small prototype, low-risk docs/code, single operator, reduced packet evidence
  - `standard`: current default for normal internal projects
  - `full-governance`: high-risk data, migration, approval, deployment, audit, or multi-agent work
- Keep universal invariants in every mode:
  - SSOT hierarchy
  - Active Context derived-only boundary
  - packet-before-code for risky/user-facing/data-impact work
  - validation before closeout
  - generated-doc immutability
  - explicit handoff when roles change
- Make mode selection reversible only through Planner rebaseline, not casual runtime toggle.
- Add disclosed solo-operation guidance:
  - solo operator can perform multiple roles in minimal mode
  - the closeout must not claim independent Tester / Reviewer separation
  - high-risk work should require independent review or explicit human risk acceptance
- Add explicit low-risk classification rules:
  - single-operator prototype: self-classification is allowed only after recording the risk-trigger checklist result
  - user data exists: Planner confirmation is required
  - budget / asset / approval / settlement data exists: minimal mode is not enough and the packet must start at least standard
  - deploy, migration, cutover, or rollback exists: standard or full-governance is required
  - if the operator cannot confidently prove no risk trigger applies, the packet must start at standard

## Tiered Starter Required Outputs
| Output | minimal | standard | full-governance |
|---|---:|---:|---:|
| Requirements | brief required | required | detailed required |
| Packet | required for risky work only | required | required |
| Architecture Guide | optional unless risky/user-facing/data-impact | required | required |
| Implementation Plan | brief or packet-local | required | detailed required |
| Test Evidence | basic closeout evidence | required | detailed required |
| Reviewer Approval | optional or simplified for low-risk solo work | required | required |
| Tester / Reviewer separation | optional only for low-risk solo work | required | required |
| Rollback Plan | required for deploy/cutover only | required when relevant | required |
| Handoff | required when role/thread changes | required | required |
| Validation Report | required before closeout | required | required |
| Security / risk review | checklist only unless triggered | required when relevant | required |
| Cutover approval | required when deploy/cutover exists | required when deploy/cutover exists | required |

## Risk-Trigger Rule
Minimal mode does not bypass governance. If any item below is true, the work must use packet-before-code and the required evidence rises to at least `standard` for that packet:

- real user data changes
- budget, asset, contract, approval, audit, or settlement data
- authentication, authorization, permission, secret, or security changes
- deployment, migration, cutover, rollback, or production operation
- replacement of existing Excel/VBA or legacy business operation
- external system integration
- report number, financial calculation, reconciliation, or business-rule logic
- irreversible file/data operation
- multi-model or parallel branch/worktree implementation
- user-facing feature that changes actual product behavior

If several triggers apply or the impact is uncertain, default to `full-governance` until Planner narrows the scope.

For uncertain-but-not-obviously-high-risk work, Planner may downgrade from temporary full-governance to standard after documenting why the risk triggers do not require full governance.

## Minimal Mode Low-Risk Classification
| Situation | Low-risk decision rule |
|---|---|
| single-operator prototype with no persistent/user data | self-classification allowed with recorded risk-trigger checklist |
| one-off local script with reversible file output | self-classification allowed if no user/data/security/deploy trigger applies |
| user data exists | Planner confirmation required before minimal mode continues |
| budget / asset / contract / approval / settlement data exists | minimal mode not allowed for the packet; start at least standard |
| deployment, migration, cutover, rollback, or production operation exists | standard or full-governance required |
| external system integration exists | standard or full-governance required |
| impact is uncertain | start at standard; use temporary full-governance only when high-risk triggers may apply |

## Solo-Operation Minimum Evidence
Solo operation is allowed only as a disclosed operating mode. It must not be presented as independent Tester / Reviewer separation.

| Evidence | solo minimal | solo standard |
|---|---:|---:|
| role-combination disclosure | required | required |
| statement that independent review was not performed | required | required |
| acceptance evidence | required | required |
| before/after comparison | recommended | required |
| rollback possibility check | required when relevant | required |
| external reviewer needed? check | required | required |
| residual-risk statement | required | required |
| human risk acceptance | required for risky work | required for high-risk or no-independent-review closeout |

If the packet touches budget, asset, approval, settlement, security, migration, production deployment, or irreversible operations, solo closeout may proceed only with explicit residual-risk wording or independent review.

## Temporary Multi-Model Rule Before PLN-17
Until `PLN-17_MULTI_MODEL_OWNERSHIP_AND_CONFLICT_CONTRACT` is approved:

- multi-model or parallel branch/worktree implementation is not allowed in minimal mode
- multi-model work must run as at least standard governance
- one owner-of-record must be declared for the packet
- one file/path ownership table must be recorded before parallel work starts
- competing model outputs are treated as candidates, not authority
- Reviewer may compare candidates, but Planner or the human operator resolves scope conflict
- stale or ambiguous ownership blocks merge until explicitly cleared

This temporary rule prevents the decision to defer the full multi-model contract from leaving a gap in the risk-trigger model.

### 10. Add Governance Load Budget And Packet Slimming
Decision: apply as part of tiered starter design.

Pros:
- Directly addresses the strongest valid critique: long-term document fatigue.
- Keeps the harness usable for small projects while preserving strong controls for risky work.
- Reduces the chance that teams approve everything mechanically just to move forward.

Cons:
- If the template becomes too small, future packets may omit needed risk evidence.
- If "not-needed" is too easy, operators may under-classify risky work.

Recommended application:
- Add a packet load budget by starter mode:
  - `minimal`: short goal, risk-trigger result, changed files/outputs, basic acceptance, validation result
  - `standard`: current packet discipline, but only relevant conditional sections are required
  - `full-governance`: detailed evidence for data, UX, source, security, deploy, rollback, and independent review
- Revise packet guidance so optional sections are not filled with prose when not relevant.
- Add a profile evidence cap:
  - profile evidence is required only when the active packet touches that profile's risk area
  - composition rationale should be short and decision-oriented
  - profile evidence union must not force unrelated fields into the packet
- Make "full governance" opt-in or risk-triggered, not the default for low-risk solo/prototype work.
- Require `PLN-16` to include a concrete `minimal packet v0.1` example that is visibly shorter than the current full packet template.
- The example must show:
  - short goal
  - risk-trigger checklist result
  - owner / solo-operation status
  - changed outputs
  - acceptance check
  - validation evidence
  - next action

## Recommended Packet Sequence

### Packet A: `PLN-16_OPERATOR_ADOPTION_AND_TIERED_GOVERNANCE_CONTRACT`
Purpose:
- Design the operator adoption baseline, starter mode governance, governance load budget, packet slimming rules, solo-operation disclosure, and validation-caveat contract before runtime enforcement and docs are finalized.

Includes:
- item 1 operator concept primer and one-page checklist contract
- item 9 tiered starter modes
- item 10 governance load budget / packet slimming
- item 3 profile reset relationship to starter mode changes

Internal staging:
- `PLN-16A`: starter mode, risk-trigger, low-risk classification, governance load budget, profile evidence cap, solo-operation evidence, and minimal packet v0.1.
- `PLN-16B`: operator checklist draft v0.1, validation caveat wording, "when this harness is too heavy" guidance, and profile/mode reset wording.

Approval criteria:
- operator one-page checklist outline is approved
- operator one-page checklist draft v0.1 is included, even if final manual wording is deferred to OPS-17
- "what validation does not prove" warning is approved
- "when this harness is too heavy" guidance is approved
- minimal / standard / full-governance definitions are approved
- mode-specific required output table is approved
- risk-trigger rule is approved
- minimal low-risk classification table is approved
- packet load budget by mode is approved
- concrete minimal packet v0.1 example is approved
- full governance is opt-in or risk-triggered, not universal default
- optional profile evidence cap is approved
- packet template `not-needed` / `conditional` use is approved so boilerplate sections do not become fake evidence
- solo-operation disclosure and residual-risk wording are approved
- solo-operation minimum evidence table is approved
- temporary multi-model single-owner rule is approved until PLN-17 closes
- profile reset and mode change relationship is approved

Why first:
- Tiered mode affects adoption and the strictness of every later gate.
- Governance load budget prevents hard gates and docs from amplifying packet fatigue.
- Operator checklist and validation caveats prevent the two most likely early failures: bypass and false confidence.

### Packet B: `OPS-16_ACTIVE_CONTEXT_RECOVERY_AND_SAFE_DRIFT_FIX`
Purpose:
- Implement re-entry and drift recovery surfaces that prevent operators from bypassing the harness after stale context or confusing validator failures.

Includes:
- item 6 Active Context recovery
- item 7 safe drift-fix boundaries
- recovery-focused tests from item 8

Approval criteria:
- Active Context repair does not edit governance Markdown truth
- recovery report lists source paths and recovery confidence
- recovery confidence calculation inputs are specified:
  - governance SSOT presence / checksum or source metadata
  - DB hot-state readable status
  - generated docs freshness
  - Active Context freshness
  - active packet owner / approval clarity
  - latest validation result
- repair output explains what was regenerated and what was not modified
- Medium confidence requires repair report reference in packet evidence before closeout
- Low and Blocked confidence states hold continuation
- Low or Blocked confidence disables implementation and closeout transitions until reconciliation
- safe-fix allow list and deny list are enforced
- allowed DB state mutation exceptions are explicit:
  - explicit transition command
  - approved packet closeout command
  - approved recovery operation that only marks derived regeneration metadata
- forbidden DB state mutations are explicit:
  - validator `--fix-safe` changing approval state
  - validator changing lane owner
  - validator changing Ready For Code state
  - recovery generating reviewer evidence
- exception categories are explicit and logged
- root and `standard-template` behavior stay synchronized

### Packet C: `OPS-18_WORKFLOW_GATES_BY_STARTER_MODE`
Purpose:
- Add hard workflow gates after the starter-mode and governance-load rules are settled, so enforcement does not over-block minimal-mode low-risk work.

Includes:
- item 4 workflow hard gates
- gate-related tests from item 8

Approval criteria:
- Ready For Code missing implementation attempt is blocked by test for standard/full/risk-triggered work
- Tester direct fix attempt is blocked or forces Developer handoff by test where Tester / Reviewer separation is required
- Reviewer evidence missing closeout is blocked by test where Reviewer approval is required
- packet-less risky code change is blocked or held by test
- minimal-mode low-risk work is not forced through full-governance gates
- risk-triggered minimal-mode work is raised to stronger governance by test
- disclosed solo-operation mode does not falsely claim independent review
- low-risk minimal mode remains unblocked when no risk trigger applies and required minimal evidence exists
- exception categories are explicit and logged
- root and `standard-template` behavior stay synchronized

### Packet D: `QLT-04_GOVERNANCE_TEST_REBALANCE`
Purpose:
- Split governance checks into focused tests so future regressions are easier to detect and maintain.

Includes:
- remaining item 8 governance test rebalance

Approval criteria:
- focused test files are named and scoped
- negative tests cover transition gates, approval gates, profile reselection, Active Context recovery, multi-model conflict contract, and tiered starter mode contract
- governance-load tests verify that irrelevant conditional sections can remain `not-needed` without failing
- profile-composition tests verify that unrelated profile evidence is not required
- minimal packet v0.1 test fixture proves the short packet can pass when no risk trigger applies
- solo-operation evidence tests verify no independent-review claim is emitted
- root and `standard-template` test parity is preserved
- large existing tests are not expanded further unless a case cannot be isolated

### Packet E: `PLN-17_MULTI_MODEL_OWNERSHIP_AND_CONFLICT_CONTRACT`
Purpose:
- Define multi-model and cloud/local conflict rules after the ordinary adoption and governance-load risks are controlled.

Includes:
- item 5 multi-model coordination

Approval criteria:
- multi-model conflict rule is approved
- file ownership precedence is approved
- conflict ledger template is approved, including ownership start, expiry, blocked files, dependency files, reviewer decision, and final merged change id
- stale ownership expiry behavior is approved
- accepted/rejected candidate disposition is approved
- Reviewer and Planner adjudication boundaries are approved

### Packet F: `OPS-17_OPERATOR_GLOSSARY_PROFILE_RESET_AND_SAFE_FIX_GUIDANCE`
Purpose:
- Finalize the non-technical operator manual surface after structural and recovery rules are settled.

Includes:
- finalized item 1 concept primer
- item 3 profile reset playbook
- finalized Operator One-Page Checklist
- safe drift-fix guidance from Packet B

Approval criteria:
- concept primer clearly says it is explanatory and not workflow authority
- Operator One-Page Checklist is added
- checklist includes a "do not open full governance unless risk-triggered or explicitly chosen" reminder
- checklist includes validation-caveat guidance
- checklist includes solo-operation disclosure guidance
- profile reset playbook covers before approval, after approval before code, and after implementation starts
- safe auto-fix allow list and deny list are explicit
- forbidden automatic mutation of governance Markdown, approval state, lane state, reviewer evidence, migration/cutover decision, and rollback decision is stated
- root and `standard-template` manual surfaces stay synchronized

## Non-Goals
- Do not include Node.js 22 support in this wave.
- Do not add a general multi-agent scheduler.
- Do not make model identity the authority for conflict resolution.
- Do not allow automatic correction of governance Markdown truth outside approved state operations.
- Do not make minimal starter mode a bypass for data-impact, user-facing, deploy, security, or cutover gates.
- Do not preserve long packet templates merely because they already exist; reduce required surface when risk does not justify it.
- Do not require human approval for every trivial low-risk action.
- Do not widen this draft into implementation.

## Verification Expectations For Follow-Up Packets
- Every concrete follow-up must update root and `standard-template` when reusable behavior or shipped guidance changes.
- Runtime changes must include root and starter tests.
- Manual-only changes must include root and starter manual parity checks.
- Workflow gate changes must include negative tests for prohibited transitions.
- Active Context recovery changes must prove it only regenerates derived surfaces unless explicitly invoking approved state operations.
- Tiered starter work must prove minimal mode still enforces the risk-trigger rule.
- Multi-model work must prove ownership expiry prevents stale locks from blocking future work indefinitely.
- Packet slimming work must prove that reduced evidence is risk-based, not a generic bypass.
- Profile composition work must prove that evidence growth is capped to packet-relevant profile risks.

## Human Approval Boundary
| Decision | Needed before implementation? | Recommended answer |
|---|---:|---|
| Exclude Node.js 22 support from this wave | yes | approved by user direction |
| Adopt the remaining eight as real improvement candidates | yes | approve with split sequencing |
| Raise tiered starter modes to P0 | yes | yes |
| Add hard workflow gates | yes | yes, with exception gates |
| Add Active Context recovery confidence | yes | yes |
| Add multi-model ownership expiry | yes | yes |
| Add drift auto-correction | yes | safe derived-output fixes only |
| Add governance load budget and packet slimming | yes | yes, as part of `PLN-16` |
| Split/stage PLN-16 internally | yes | yes, use `PLN-16A` and `PLN-16B` sections or equivalent staged approval |
| Clarify minimal low-risk classification | yes | yes |
| Add solo-operation minimum evidence | yes | yes |
| Add Active Context confidence calculation inputs | yes | yes, in `OPS-16` |
| Add temporary single-owner rule before PLN-17 | yes | yes |
| Open first concrete packet | yes | start with `PLN-16_OPERATOR_ADOPTION_AND_TIERED_GOVERNANCE_CONTRACT` |

## Planner Recommendation
- Approve this revised `PLN-15` as the planning basis for the eight-item improvement wave.
- Start with `PLN-16_OPERATOR_ADOPTION_AND_TIERED_GOVERNANCE_CONTRACT` because operator entry, tiered starter modes, and governance load budget decide whether the harness is used at all.
- Follow with `OPS-16_ACTIVE_CONTEXT_RECOVERY_AND_SAFE_DRIFT_FIX` because confusing stale state is the highest-risk bypass trigger after onboarding.
- Then run `OPS-18_WORKFLOW_GATES_BY_STARTER_MODE` so hard gates enforce the settled tier model instead of over-blocking low-risk work.
- Then run `QLT-04_GOVERNANCE_TEST_REBALANCE`.
- Defer multi-model ownership to `PLN-17_MULTI_MODEL_OWNERSHIP_AND_CONFLICT_CONTRACT`.
- Finish the wave with `OPS-17_OPERATOR_GLOSSARY_PROFILE_RESET_AND_SAFE_FIX_GUIDANCE` so the operator docs reflect the settled structural decisions.
- Do not start implementation from this draft alone.

## Sources Checked
- Existing harness SSOT:
  - `.agents/artifacts/REQUIREMENTS.md`
  - `.agents/artifacts/ARCHITECTURE_GUIDE.md`
  - `.agents/artifacts/IMPLEMENTATION_PLAN.md`
  - `.agents/artifacts/CURRENT_STATE.md`
  - `.agents/artifacts/TASK_LIST.md`
  - `.agents/workflows/plan.md`
- User review input:
  - Node.js 22 support excluded from this wave
  - operator one-page checklist requested
  - tiered starter modes raised in priority
  - starter mode output table requested
  - risk-trigger rule requested
  - multi-model lock / ownership expiry requested
  - Active Context recovery confidence requested
  - stronger drift auto-fix deny list requested
  - packet-specific approval criteria requested
  - severe overgovernance critique reviewed and partially accepted as a governance-load risk
  - adoption-focused pessimistic critique reviewed and accepted as the basis for reordering ordinary-operator usability before multi-model coordination
  - GPT/Grok review accepted as conditions for first packet readiness: staged PLN-16, low-risk classification, solo evidence, recovery confidence inputs, and temporary multi-model single-owner rule
