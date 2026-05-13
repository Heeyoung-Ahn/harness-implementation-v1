# PLN-16 Operator Adoption And Tiered Governance Contract Draft

## Status
- Draft prepared on 2026-05-13 from `PLN-15`.
- This draft is planning-only.
- This draft does not approve implementation or runtime changes.
- Ready For Code is not opened by this draft.
- Node.js 22 support remains out of scope for this wave.
- `PLN-16A` and `PLN-16B` approved by user on 2026-05-13.
- Next concrete packet: `OPS-16_ACTIVE_CONTEXT_RECOVERY_AND_SAFE_DRIFT_FIX`.

## Purpose
This draft turns `PLN-15` into the first concrete planning packet for reducing adoption failure, gate fatigue, and packet overhead.

The goal is to make the harness usable by non-technical and small-project operators without weakening the controls required for risky work.

## Source Basis
- `reference/planning/PLN-15_HARNESS_RESILIENCE_COMPATIBILITY_AND_SCALE_FIT_DRAFT.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- `.agents/workflows/plan.md`

## Non-Goals
- Do not implement CLI commands, validators, workflow gates, or template rewrites in this planning draft.
- Do not change the Node.js 24+ runtime requirement.
- Do not remove SSOT, Active Context, packet-before-code, validation, handoff, generated-doc immutability, or Tester / Reviewer separation from standard and full-governance work.
- Do not make minimal mode a bypass for data, security, deployment, migration, cutover, rollback, financial logic, approval, or user-facing risk.
- Do not finalize the full manual text here; final manual insertion belongs to `OPS-17`.
- Do not define the full multi-model conflict system here; temporary single-owner rules only.

## Quick Decision Header
| Decision | Recommendation | Approval status |
|---|---|---|
| Split `PLN-16` internally | use `PLN-16A` for governance contract and `PLN-16B` for operator entry wording | approved |
| Starter modes | define `minimal`, `standard`, `full-governance` | approved |
| Default mode | consider `minimal` first for clearly low-risk work; use `standard` for normal projects; use `full-governance` only when opt-in or mandatory trigger applies | approved |
| Risk trigger | any listed risk raises minimal work to at least standard | approved |
| Low-risk classification | self-classification only for no-data, reversible, low-impact work; uncertain work starts at standard | approved |
| Packet slimming | approve a minimal packet v0.1 and profile evidence cap | approved |
| Solo operation | allowed only with disclosure and no independent-review claim | approved |
| Temporary multi-model rule | no multi-model work in minimal mode; use single owner-of-record until `PLN-17` | approved |
| Operator checklist | include v0.1 here, finalize later in `OPS-17` | approved |
| Validation caveat | explicitly state validation does not prove business correctness | approved |

## Internal Staging

### PLN-16A: Governance Contract
Purpose:
- Close the tiered governance model before any runtime gate or manual rewrite depends on it.

Must decide:
- starter mode definitions
- universal invariants
- mode-specific required outputs
- risk-trigger rule
- low-risk classification
- governance load budget
- profile evidence cap
- minimal packet v0.1
- solo-operation minimum evidence
- temporary multi-model single-owner rule

Exit condition:
- The operator can classify a work item into minimal / standard / full-governance without reading the whole manual.
- The operator can see exactly what evidence is required in each mode.
- The minimal packet example is visibly shorter than the current full packet shape.

### PLN-16B: Operator Entry Contract
Purpose:
- Close the first-screen operator guidance that prevents direct-AI bypass and false confidence.

Must decide:
- Operator One-Page Checklist draft v0.1
- "what validation does not prove" wording
- "when this harness is too heavy" wording
- profile reset and mode-change relation
- solo-operation disclosure wording

Exit condition:
- A non-technical operator can start a low-risk task without being overwhelmed.
- A non-technical operator can identify when the task must escalate to standard or full-governance.
- The checklist can later be inserted into the manual without redefining workflow authority.

## Starter Modes

### Minimal
Use for:
- single-operator prototype
- reversible local script
- disposable UI mockup
- low-risk document or template work
- no persistent user data
- no production deployment
- no migration, cutover, rollback, security, or business-critical logic

Minimum intent:
- reduce paperwork for genuinely low-risk work
- preserve enough trace to understand what changed, why, and how it was checked
- be the first mode to consider when work is clearly reversible, local, and low-risk

Forbidden use:
- budget, asset, contract, approval, audit, settlement, or financial logic
- real user data
- authentication, authorization, secrets, or security
- external system integration
- deploy, migration, cutover, rollback, production operation
- irreversible data/file operations
- multi-model or parallel implementation
- anything with uncertain impact that cannot be clearly classified as low risk

### Standard
Use for:
- normal internal application work
- most reusable harness changes
- user-facing behavior
- ordinary data-impact work after risk is understood
- packet-based AI development where independent review is useful

Minimum intent:
- maintain current harness discipline while reducing irrelevant optional evidence

### Full-Governance
Use for:
- high-risk data work
- budget, asset, contract, approval, audit, settlement, or financial logic
- migration / cutover / rollback
- production operation
- security-critical change
- multi-party approval
- regulated or audit-heavy environment
- high-impact legacy replacement

Minimum intent:
- preserve maximum traceability, approval, independent review, and rollback evidence.

## Full-Governance Mandatory Triggers
Use full-governance, not merely standard, when any item applies:
- production migration, cutover, rollback, or irreversible data operation
- authentication, authorization, permission, secret, or security-critical change
- budget, settlement, approval, audit, or financial logic with broad organizational impact
- external integration that writes or synchronizes business data
- official replacement of Excel/VBA or another legacy operational source
- multi-party approval, audit evidence, or regulated retention is required
- impact is high and cannot be safely narrowed by Planner

If full-governance is triggered but the operator believes standard is enough, Planner must document the narrowing reason and the human operator must approve the downgrade.

## Universal Invariants
These apply in every starter mode:
- Governance Markdown remains canonical human-readable truth.
- Active Context remains derived re-entry context, not authority.
- Generated docs are not manually edited.
- Risky work uses packet-before-code.
- Validation evidence is required before closeout.
- Handoff is required when role, thread, or owner changes.
- Source trace is required for decisions that affect scope, data, security, deployment, or approval.
- Human approval is required for data/schema/security/cutover/rollback decisions.

## Mode Required Outputs
| Output | Minimal | Standard | Full-Governance |
|---|---|---|---|
| Requirements | brief goal and acceptance | required | detailed required |
| Packet | only for risky work, otherwise minimal packet | required | required |
| Architecture Guide | not required unless risk-triggered | required when architecture changes | required |
| Implementation Plan | packet-local or short next action | required | detailed required |
| Test Evidence | basic check and validation result | required | detailed required |
| Reviewer Approval | optional/simplified for low-risk solo work | required | required |
| Tester / Reviewer Separation | optional only for disclosed low-risk solo work | required | required |
| Rollback Plan | required if deploy/cutover/irreversible work exists | required when relevant | required |
| Handoff | required when owner/thread/role changes | required | required |
| Validation Report | required before closeout | required | required |
| Security / Risk Review | checklist unless triggered | required when relevant | required |
| Cutover Approval | required when cutover exists | required when cutover exists | required |

## Risk-Trigger Checklist
If any answer is `yes`, minimal mode is not enough for that packet.

### Minimal Quick Check
Minimal can continue only if the operator can truthfully say:

```text
No user/data/security/deploy/business-critical/multi-model risk trigger applies, and the change is reversible.
```

If this sentence cannot be stated confidently, start at standard.

### Detailed Trigger List
Use the detailed list when the quick check is uncertain or when the packet touches product, data, deployment, or workflow behavior.

| Question | If yes |
|---|---|
| Does this change real user data? | use standard or full-governance |
| Does it affect budget, asset, contract, approval, audit, settlement, or financial logic? | use at least standard; prefer full-governance if impact is broad |
| Does it touch auth, permission, secrets, or security? | use standard or full-governance |
| Does it include deploy, migration, cutover, rollback, or production operation? | use standard or full-governance |
| Does it replace or reinterpret Excel/VBA or other legacy business process? | use standard or full-governance |
| Does it integrate an external system? | use standard or full-governance |
| Does it change report numbers, reconciliation, or business-rule calculation? | use standard or full-governance |
| Is any operation irreversible? | use standard or full-governance |
| Are multiple models, agents, branches, or worktrees implementing in parallel? | use standard or full-governance with single owner-of-record |
| Does it change real user-facing product behavior? | use standard unless clearly disposable |
| Is impact uncertain? | start at standard; Planner may escalate or narrow |

## Planner / Human Confirmation Rule
`Planner confirmation` means the Planner workflow confirms classification against the approved risk rules. It does not replace human approval when data, money, security, deployment, or irreversible operation is involved.

| Situation | Required confirmation |
|---|---|
| no data, local prototype | operator self-classification allowed |
| user data exists | human operator confirmation required before minimal continues |
| budget / asset / approval / settlement data | human approval required; minimal not allowed |
| security / auth / permission | human approval and security/risk review required |
| deployment / cutover / migration | human approval required |
| production or irreversible operation | human approval and rollback evidence required |
| impact uncertain | Planner classification required; start at standard until narrowed |

## Low-Risk Classification Rule
| Situation | Rule |
|---|---|
| single-operator prototype with no persistent/user data | self-classification allowed with recorded checklist |
| one-off local script with reversible output | self-classification allowed if all triggers are `no` |
| document-only typo or formatting | minimal allowed if no governance meaning changes |
| user data exists | Planner confirmation required before minimal continues |
| budget / asset / approval / settlement data exists | minimal not allowed for that packet |
| deploy / migration / cutover / rollback exists | standard or full-governance required |
| external integration exists | standard or full-governance required |
| impact uncertain | start at standard; use temporary full-governance only if high-risk triggers may apply |

If the operator cannot confidently prove no trigger applies, the work starts at standard.

## Governance Load Budget
| Mode | Evidence budget |
|---|---|
| Minimal | 1 short goal, risk checklist, owner/solo status, changed outputs, acceptance check, validation result, next action |
| Standard | packet sections required only when relevant; `not-needed` and `conditional` are valid outcomes |
| Full-governance | detailed evidence for source, data, UX, security, deploy, rollback, independent review, and residual risk |

Rules:
- Do not fill irrelevant sections with prose.
- `not-needed` is valid when the reason is clear.
- `conditional` is valid when the trigger is known but not active yet.
- Optional profile evidence is required only when the current packet touches that profile's risk area.
- Profile composition rationale should be short and decision-oriented.
- Full governance is opt-in or risk-triggered, not a universal default.

## Minimal Packet v0.1
Use this only when no risk trigger applies.

```markdown
# MIN-XX Short Work Packet

## Goal
- One sentence describing the low-risk change.

## Mode
- Starter mode: minimal
- Owner: <name / AI role>
- Solo operation: yes/no
- Independent review: not claimed / requested

## Risk-Trigger Checklist
- Quick check: no user/data/security/deploy/business-critical/multi-model risk trigger applies, and the change is reversible.

## Changed Outputs
- <file or artifact path>

## Acceptance
- <observable result>

## Verification
- Validation: <command or "not applicable with reason">
- Acceptance check: <manual/visual/functional check>
- Changed output reviewed: yes/no

## Next Action
- close / handoff / escalate to standard
```

Escalation rule:
- If any checklist item changes to `yes`, stop and re-open as standard or full-governance.
- If no executable validation exists, the packet must state the manual check used.

## Solo-Operation Minimum Evidence
Solo operation is allowed only as a disclosed operating mode. It must not claim independent review.

| Evidence | Solo Minimal | Solo Standard |
|---|---|---|
| Role-combination disclosure | required | required |
| "Independent review not performed" statement | required | required |
| Acceptance evidence | required | required |
| Before/after comparison | recommended | required |
| Rollback possibility check | required when relevant | required |
| External reviewer needed? check | required | required |
| Residual-risk statement | required | required |
| Human risk acceptance | required for risky work | required for high-risk or no-independent-review closeout |

Rule:
- If the work touches budget, asset, approval, settlement, security, migration, production deployment, or irreversible operations, solo closeout needs explicit residual-risk wording or independent review.

## Temporary Multi-Model Rule
Until `PLN-17_MULTI_MODEL_OWNERSHIP_AND_CONFLICT_CONTRACT` is approved:
- multi-model or parallel branch/worktree implementation is not allowed in minimal mode
- multi-model work must run as at least standard governance
- one owner-of-record must be declared
- one file/path ownership table must be recorded before parallel implementation starts
- competing outputs are candidates, not authority
- stale or ambiguous ownership blocks merge until cleared

## Operator One-Page Checklist v0.1

This checklist must fit as the first operational screen. Details should link out to the manual.

1. Read Active Context: current owner, workflow, active task, next action.
2. Confirm starter mode: minimal / standard / full-governance.
3. Re-check risk triggers since the last session.
4. If any risk is uncertain, start or return to standard.
5. Do not ask AI to implement risky work without an approved packet.
6. Before closeout, verify changed outputs, validation/manual check, residual risk, and next action.
7. Never auto-fix authority state without approval: requirements, architecture, implementation plan, packet approval, workflow owner/lane, reviewer evidence, migration/cutover/rollback decision, or DB hot-state outside approved transition/state operation.

## Validation Caveat Wording
Recommended wording for manuals and packet closeout:

```text
Harness validation means the harness state, required evidence, generated docs, and selected governance checks are consistent. It does not prove that the business requirement is correct, that financial or approval logic is right, that users accept the workflow, or that a legacy Excel/VBA process has been fully replaced. Those require domain review and user approval.
```

## When This Harness Is Too Heavy
The operator may use minimal mode instead of standard/full-governance when all are true:
- work is local, reversible, and low-risk
- no user data
- no deploy/cutover/rollback
- no security/auth/permission
- no business-critical calculation
- no external integration
- no real product commitment
- no multi-model implementation

The operator should not use minimal mode when:
- data, money, approval, production, migration, security, or user-facing behavior is involved
- impact is unclear
- evidence must be audited later

## Profile Reset And Mode Change Relation
- Profile describes project/work pattern.
- Starter mode describes governance strictness.
- Changing either after approval can invalidate packet evidence.

Rules:
- Before packet approval: profile or mode may change with a short reason.
- After packet approval but before code: Planner must revise the packet evidence.
- After implementation starts: treat as rebaseline and perform impact review.
- If changing from minimal to standard/full, add missing evidence before closeout.
- If changing from full/standard to minimal, explain why no risk trigger applies.

## Approval Boundary
This draft needs human review before it becomes approved planning basis for follow-up implementation packets.

Approval options:
- approve `PLN-16A` only and hold `PLN-16B`
- approve `PLN-16A` and `PLN-16B`
- adjust starter mode definitions
- adjust risk-trigger rules
- reject minimal mode or keep full governance default

Approval decision:
- User approved `PLN-16A` and `PLN-16B` on 2026-05-13.
- This approval is planning approval only.
- It authorizes drafting `OPS-16_ACTIVE_CONTEXT_RECOVERY_AND_SAFE_DRIFT_FIX`.
- It does not authorize runtime implementation before a concrete `OPS-16` packet closes detailed agreement and Ready For Code.

Approval conditions incorporated from GPT/Grok review:
- Full-governance mandatory triggers are defined.
- Planner / human confirmation boundaries are defined.
- Minimal packet verification has minimum fields.
- Operator checklist checks current starter mode and risk-trigger changes.
- "skip full harness governance" wording is replaced with "use minimal mode instead of standard/full-governance."
- Later manual or template insertion must preserve root and `standard-template` parity.

## Recommended Decision
Planner recommendation:
- Approve `PLN-16A` and `PLN-16B` as a planning contract.
- Keep final manual insertion for `OPS-17`.
- Open `OPS-16_ACTIVE_CONTEXT_RECOVERY_AND_SAFE_DRIFT_FIX` next after approval.
- Require any later manual/template insertion to preserve root and `standard-template` parity.

## Next Packet If Approved
- `OPS-16_ACTIVE_CONTEXT_RECOVERY_AND_SAFE_DRIFT_FIX`

Expected purpose:
- implement Active Context repair or equivalent recovery flow
- add recovery confidence calculation
- enforce safe-fix allow/deny boundary
- add focused tests for recovery behavior
