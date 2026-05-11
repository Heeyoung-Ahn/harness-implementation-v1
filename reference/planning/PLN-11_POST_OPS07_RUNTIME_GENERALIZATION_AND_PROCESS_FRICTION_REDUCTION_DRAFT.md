# PLN-11 Post-OPS07 Runtime Generalization And Process Friction Reduction Draft

## Status
- Draft opened on 2026-05-10 after `OPS-07` closeout approval and no-active-lane planner hold stabilization.
- Planning owner: `Planner`
- This draft was the selected next planning lane after `OPS-07`.
- Approved on 2026-05-11 as the sequencing decision for the next `2 + 2` follow-up split.
- `OPS-08` is now opened next as the immediate concrete phase-1 packet draft.

## Purpose
This draft sequences the next reusable follow-up work as `2 + 2` instead of one broad lane, so runtime-contract generalization closes before planning/process-friction reduction opens.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | PLN-11 post-OPS07 runtime generalization and process friction reduction | Recent planner review found four real reusable gaps, but opening them together would mix runtime, validator, packet-template, and planning-UX changes into one overly broad lane | approved-closeout |
| Ready For Code | not-needed | this lane only chooses and sequences follow-up packets; implementation remains blocked until a concrete packet is approved | not-needed |
| Human sync needed | yes | the user should approve whether the proposed `2 + 2` split is the right next baseline sequence | closed |
| Gate profile | contract | this lane defines packet boundaries, order, and approval gates before implementation starts | approved-closeout |
| User-facing impact | medium | the immediate effect is on harness maintainability and real-project usability rather than downstream app features | approved-closeout |
| Layer classification | core | the candidate follow-ups change reusable runtime, validator, planning, and packet contracts | approved-closeout |
| Active profile dependencies | none | this is core baseline planning | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| Packet exit gate status | approved | planning closeout depends on user agreement about the sequence and immediate next packet | approved |

## 1. Goal
- Preserve the stable PMW-free V1.3 reusable baseline while opening the next follow-up work in a narrow order.
- Separate runtime-contract generalization from planning/process-friction reduction.
- Keep each next packet small enough that root/starter sync, validator drift, and reviewer evidence stay tractable.

## 2. Proposed Scope
- Decide the exact phase-1 runtime generalization split.
- Decide the parked phase-2 process-friction split without opening implementation for it yet.
- Record the recommended next packet order and approval boundaries.

## 3. Proposed 2 + 2 Split
- Phase 1 packet A: `OPS-08` reusable security-review evidence generalization.
  Promote the useful `OPS-05` baseline from a lane-specific implementation into a reusable contract that can be activated outside the literal `OPS-05` work item and can point at real product/release evidence surfaces rather than only maintainer-repo files.
- Phase 1 packet B: `QLT-03` semantic trace and evidence gate generalization.
  Promote the useful `QLT-02` evidence discipline from a lane-specific trace contract into a reusable gate that can be attached by packet/gate profile rather than by hard-coded work-item naming.
- Phase 2 packet C: `OPS-09` structured packet-exit metadata and closeout parser hardening.
  Reduce closeout holds caused by packet prose/format drift by moving validator-critical closeout semantics toward structured, parse-stable surfaces.
- Phase 2 lane D: `PLN-12` lane-typed packet minimums and approval-surface reduction.
  Reduce packet burden for real operators by defining minimum required sections by lane type instead of forcing the full packet burden onto every narrow follow-up.

## 4. Why This Order
- `OPS-08` and `QLT-03` improve reusable runtime and validator behavior first, so later packet/process changes build on a more general baseline instead of another lane-specific patch.
- `OPS-09` and `PLN-12` are mainly about human-process friction, approval surface, and validator/parser ergonomics; they are easier to evaluate once the runtime contracts are generalized.
- Opening all four together would mix runtime semantics, validator semantics, packet schema, and planning UX in one lane and make regression attribution harder.

## 5. Non-Goal
- Do not reopen PMW.
- Do not merge all four gaps into one implementation packet.
- Do not start any implementation before the user approves the immediate next packet.
- Do not broaden phase 1 into hosted CI, org-specific release process, or generic workflow-authoring redesign.

## 6. Planning Inputs
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- `.agents/artifacts/PREVENTIVE_MEMORY.md`
- `reference/packets/PKT-01_OPS-05_RELEASE_ASSURANCE_AND_SECURITY_AUTOMATION_HARDENING.md`
- `reference/packets/PKT-01_QLT-02_EVIDENCE_VALIDATION_SEMANTIC_TRACE_AND_AGENT_EVAL_CI_GATING.md`
- `reference/packets/PKT-01_OPS-07_PLANNER_HOLD_CLOSEOUT_AUTOMATION.md`
- `.harness/runtime/state/dev05-tooling.js`
- `.harness/runtime/state/drift-validator.js`
- `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`

## 7. Validated Assessment Summary
- Confirmed: `OPS-05` produced a useful local-first pre-review evidence baseline, but the runtime implementation is still lane-specific rather than reusable.
- Confirmed: `QLT-02` produced a useful semantic-trace/evidence gate, but validator enforcement is still triggered by lane-specific naming rather than a reusable contract signal.
- Confirmed: packet closeout still has parser-sensitive prose/format friction, even after `OPS-07` fixed no-active-lane closeout.
- Confirmed: the default packet burden remains heavy for a non-specialist operator even though the harness is explicitly intended to help that operator finish large internal business-app projects with AI assistance.

## 8. Open Decisions
- None inside the closed `PLN-11` sequencing scope.
- `OPS-08` is the approved immediate next packet.
- `QLT-03` remains the approved next-following phase-1 candidate after `OPS-08`.
- Phase 2 remains intentionally parked until phase 1 closes or a stronger urgency appears.

## 9. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| `2 + 2` split agreement | yes | user/planner | closed | approved on 2026-05-11 |
| Immediate phase-1 next packet | yes | user/planner | closed | `OPS-08` opens first |
| Phase-1 packet ordering | yes | user/planner | closed | approved as `OPS-08 -> QLT-03` |
| Phase-2 parking decision | yes | user/planner | approved | `OPS-09` and `PLN-12` remain parked |

## 10. Recommended Next Action
- Treat `PLN-11` as closed sequencing evidence.
- Review `PKT-01_OPS-08_REUSABLE_SECURITY_REVIEW_EVIDENCE_GENERALIZATION.md` and decide whether to approve, adjust, or hold the detailed agreement before implementation opens.
- Keep `QLT-03` as the approved next-following candidate, but do not open implementation for it yet.
- Leave `OPS-09` and `PLN-12` as parked phase-2 follow-ups until phase 1 closes.
