# PLN-12 Lane-Typed Packet Minimums And Approval-Surface Reduction Draft

## Status
- Draft opened on 2026-05-11 after `OPS-09` reviewer-approved closeout and planner reflection.
- Planning owner: `Planner`
- This draft is the selected next planning lane after `OPS-09`.
- Draft selection approved on 2026-05-11; `detailed agreement` remains the next approval boundary.
- Detailed agreement approved on 2026-05-11 with universal-minimum and `not-needed` / `conditional` constraints fixed.
- This lane is planning-only. It does not open implementation by itself.

## Purpose
This draft defines how to reduce packet burden for real operators without reopening broad packet-template redesign. The goal is to keep the current approval discipline while introducing lane-typed minimum packet requirements and a narrower human approval surface.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | PLN-12 lane-typed packet minimums and approval-surface reduction | `OPS-09` reduced parser/closeout friction, but the default packet burden is still too heavy for non-specialist operators and narrow follow-up lanes | approved-draft |
| Ready For Code | not-needed | this lane only chooses and shapes the next process-friction contract; implementation remains blocked until a concrete follow-up packet is approved | not-needed |
| Human sync needed | yes | the user should approve how much packet burden can be reduced without weakening approval quality and what minimum packet contract remains universal | pending-detailed-agreement |
| Gate profile | contract | this lane changes reusable planning/packet approval expectations before implementation starts | approved-draft |
| User-facing impact | medium | the immediate effect is easier packet review and lower operator burden rather than downstream app runtime behavior | approved-draft |
| Layer classification | core | the candidate follow-up changes reusable packet expectations and planning approval surfaces | approved-draft |
| Active profile dependencies | none | this is core baseline planning | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| Packet exit gate status | pending | planning closeout depends on user agreement about the reduction boundary and next concrete packet shape | pending |

## 1. Goal
- Preserve the stable PMW-free V1.3 reusable baseline while reducing unnecessary packet burden for narrow lanes.
- Define minimum required packet sections by lane type instead of forcing the full packet burden onto every narrow follow-up.
- Keep approval quality, validator-critical meaning, and reviewer/operator readability intact.

## 2. Proposed Scope
- Define candidate lane types that can use reduced packet minimums.
- Decide which packet sections are always required and which can be lane-typed or conditional.
- Define how approval surfaces can shrink without hiding source impact, residual debt, or verification obligations.
- Record the recommended next concrete packet or follow-up sequence after this planning draft closes.

## 3. Proposed Planning Questions
- Which packet sections are universally required for every lane?
- Which sections can become lane-typed minimums for narrow runtime, validation, review, or planning lanes?
- What is the smallest approval surface that still lets a non-specialist operator make safe go/no-go decisions?
- How should validator-critical packet meaning stay structured if the human-facing packet surface becomes smaller?

## 4. Working Boundary
- Keep this lane in planning. Do not redesign the entire packet template in code here.
- Keep `OPS-09` structured packet-exit metadata intact; this draft may build on it but must not reopen it.
- Do not broaden into hosted CI, workflow-authoring, org-specific approval programs, or generic product-delivery governance.
- Do not weaken Ready For Code, Tester, or Reviewer evidence expectations just to make packets shorter.

## 5. Why This Lane Exists
- `OPS-09` removed one class of parser-sensitive closeout friction, but non-specialist operators still face a high reading/approval burden for narrow lanes.
- The harness target user is often an operator using AI assistance to deliver large internal business systems, not a full-time software engineer.
- If every narrow lane still requires the full packet burden, planning becomes slow and error-prone even when runtime and validator behavior are stable.

## 6. Non-Goal
- Do not implement packet-template code changes in this lane.
- Do not remove human approval boundaries.
- Do not reduce closeout evidence expectations below the current reusable contract baseline.
- Do not reopen `OPS-08`, `QLT-03`, or `OPS-09`.

## 7. Planning Inputs
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- `.agents/artifacts/PREVENTIVE_MEMORY.md`
- `reference/planning/PLN-11_POST_OPS07_RUNTIME_GENERALIZATION_AND_PROCESS_FRICTION_REDUCTION_DRAFT.md`
- `reference/packets/PKT-01_OPS-09_STRUCTURED_PACKET_EXIT_METADATA_AND_CLOSEOUT_PARSER_HARDENING.md`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
- `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`

## 8. Initial Recommendation
- Treat `PLN-12` as the planning lane for packet burden reduction, not as the implementation lane.
- Prefer a small set of lane classes such as `planning`, `narrow-runtime`, `validation/review`, and `release/security`, each with explicit minimum sections.
- Preserve a universal minimum that always includes scope, boundary, verification, and closeout quality gate references.
- Use this lane to decide whether the next concrete packet should implement a lane-typed packet minimum contract or whether the current packet template remains acceptable.

## 8A. Proposed Detailed Agreement
- `PLN-12` should stay a planning-only lane that decides the reusable packet-burden contract, not the implementation lane that rewrites packet/template code.
- The immediate task is to decide a first reusable lane-type map and minimum required sections, then open a later concrete packet only if the user approves that narrowed result.
- The lane should reduce operator reading/approval burden for narrow lanes while preserving human approval quality, validator-critical meaning, and reviewer closeout discipline.
- The first reusable lane classes should stay narrow and practical, such as:
  - `planning`
  - `narrow-runtime`
  - `validation-review`
  - `release-security`
- Every lane class should still inherit a universal minimum contract that keeps:
  - scope and non-goal clarity
  - explicit boundary / out-of-scope wording
  - source impact visibility
  - verification requirements
  - residual debt disposition
  - closeout quality gate reference
  - required source/evidence trace where validator-critical meaning depends on it
- Packet burden reduction must be implemented as lane-typed `not-needed` or `conditional` handling, not by silently deleting reusable sections from the contract.
- This lane should decide whether the next concrete follow-up packet changes packet-template rules, validator expectations, or both, but it must not implement those changes itself.

## 8B. Proposed Planning Boundary
- Include:
  - lane-type candidates
  - universal-minimum packet section set
  - lane-typed conditional section candidates
  - explicit `not-needed` / `conditional` treatment rules by lane type
  - approval-surface reduction rules for non-specialist operator readability
  - recommendation for the next concrete packet after `PLN-12`
- Exclude:
  - packet-template code edits
  - validator code edits
  - broad workflow redesign
  - hosted CI / org-specific approval program design
  - release/security policy redesign

## 8C. Proposed Operator Outcome
- A non-specialist operator should be able to look at a narrow packet and understand:
  - what is being changed
  - what is explicitly out of scope
  - what source surfaces are impacted
  - what evidence will be produced
  - what residual debt remains after closeout
  - what decision is being requested now
- The operator should not have to parse every optional packet section when the lane itself does not need them.

## 8D. Proposed Follow-Up Shape
- Preferred next concrete follow-up, if `PLN-12` closes successfully:
  - a narrow packet that defines lane-typed packet minimum rules in reusable form
- Alternative outcome:
  - if the current packet template is still judged acceptable, `PLN-12` may close with no implementation packet and preserve the current template as baseline

## 9. Open Decisions
- What exact lane classes should be first-class in the reusable packet contract?
- Which current packet sections are universal minimums versus lane-typed conditionals?
- Should approval reduction be expressed as packet-template rules, validator rules, or both?
- What is the safest next concrete follow-up if this planning lane is approved?

## 10. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Open `PLN-12` as the next planning lane | yes | user/planner | closed | opened on 2026-05-11 after `OPS-09` closeout |
| Detailed planning agreement | yes | user/planner | pending | approve / adjust / hold the lane-typed packet-minimum boundary and universal-minimum contract |
| Concrete follow-up packet recommendation | yes | user/planner | pending | implementation remains blocked until a later concrete packet is approved |
| Ready For Code | no | - | not-needed | `PLN-12` itself is planning-only |

## 11. Planner Recommendation
- Approve `PLN-12` as a planning-only lane and keep implementation blocked.
- Use the detailed agreement to narrow the first lane-type set and universal-minimum packet contract before deciding whether a concrete follow-up packet is necessary.
- Preserve the current reusable baseline and do not reopen `OPS-09` unless a real regression is found.

## 12. Detailed Agreement Close Condition
- This planning lane is ready for `detailed agreement` approval when the user can answer yes to all of these:
- the lane should reduce packet burden for narrow follow-up work without weakening approval quality
- the first reusable lane-type set should stay small and practical
- a universal minimum packet contract should remain mandatory across all lane types, including source impact and residual debt disposition
- packet burden reduction should be expressed as lane-typed `not-needed` or `conditional` handling rather than section deletion
- implementation should stay blocked until a later concrete follow-up packet is approved

## 13. Current Planning Decision
- Draft selection: approved
- Detailed agreement: approved
- Ready For Code: not-needed
- Remaining planner action before any implementation opens:
  open a later concrete follow-up packet for lane-typed packet minimum rules and keep implementation blocked until that packet is approved.

## 14. Planning Closeout Recommendation
- Open a concrete follow-up packet to implement lane-typed packet minimum rules.
- The follow-up should preserve the approved first lane-type set:
  - `planning`
  - `narrow-runtime`
  - `validation-review`
  - `release-security`
- The follow-up must preserve the universal minimum contract across all lane types:
  - purpose / goal
  - scope and non-goal
  - explicit boundary / out-of-scope wording
  - source impact visibility
  - verification requirements
  - residual debt disposition
  - packet exit quality gate reference
  - validator-critical source/evidence trace where applicable
  - reopen trigger
- The follow-up must express reduction through lane-typed `not-needed` or `conditional` handling, not by deleting reusable contract sections.
- Implementation remains blocked until the concrete packet receives detailed agreement and Ready For Code approval.
