# PLN-10 Post-DEV11 Hardening And Release Assurance Draft

## Status
- Draft opened on 2026-05-04 after `DEV-11` closeout approval.
- Planning owner: `Planner`
- This draft is the selected next planning lane after the CLI-first PMW-free V1.3 baseline closed.
- `OPS-04` is now closed.
- `QLT-02` is now closed after reviewer approval, tester evidence, and planner closeout recording.
- This draft does not approve implementation. It defines the remaining follow-up split after `OPS-04` and the real-project-readiness decision path.

## Purpose
Choose how to sequence the deferred follow-up work after `DEV-11`, using the closed `OPS-04` hardening lane plus the new real-project-readiness assessment to decide whether quality/eval work or release/security work should open next.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | PLN-10 post-DEV-11 hardening and release assurance | DEV-11 closed the PMW decommission lane, and post-closeout review confirmed additional context-restoration and closeout-gate hardening work before later security/eval follow-ups | draft |
| Ready For Code | hold | implementation packets should open only after the follow-up split and approval boundary are defined | draft |
| Human sync needed | yes | the next lane is selected, but `QLT-02` still needs explicit Ready For Code closure for the narrowed phase-1 implementation packet | approved |
| Gate profile | contract | this lane defines packet boundaries and approval sequencing before implementation starts | draft |
| User-facing impact | high | follow-up work changes session-start reliability for the primary CLI/context re-entry surface as well as later release assurance | draft |
| Layer classification | core | these follow-ups affect reusable harness governance, validation, and release assurance | draft |
| Active profile dependencies | none | this is core baseline planning | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| Packet exit gate status | pending | no implementation packet is active yet | draft |

## 1. Goal
- Decide the next approved planning sequence after `DEV-11`.
- Separate the deferred hardening items into a small number of coherent follow-up packets.
- Preserve the PMW-free CLI-first baseline while tightening session-start reliability, closeout validation discipline, and later release assurance without reopening PMW.

## 2. Proposed Scope
- Confirm that PMW remains historical-only and is not reopened.
- Decide whether session-start context assurance and closeout validation hardening open first as an ops lane.
- Decide whether security automation hardening should remain a separate follow-up after the context-assurance work.
- Decide the exact phase-1 boundary for agent trace, semantic evidence validation, validator-backed evidence checks, parity hardening, and deferred CI/PR follow-up work.
- Decide whether the now-confirmed reviewer-to-planner derived-state lag should stay a preventive-memory candidate or be promoted into its own narrow hardening packet before `OPS-05`.
- Decide whether release artifact audit hardening should stay coupled to security automation or become a release-specific follow-up.

## 3. Candidate Follow-Up Split
- Candidate A: `OPS-04` session-start context assurance and closeout-gate planning.
  Covers `AGENTS.md` / `day_start` / workflow re-entry contract tightening, `ACTIVE_CONTEXT` schema expansion, freshness/parity enforcement for active context, transition-time validation/context alignment, and mandatory Developer closeout validation evidence.
- Candidate B: `OPS-05` release-assurance and security-automation planning.
  Covers dependency inventory, secret scan, release artifact audit hardening, and cutover/release evidence tightening.
- Candidate C: `QLT-02` evidence-validation and agent-eval planning.
  Covers phase-1 local semantic evidence contract work, validator-backed evidence checks, lightweight agent trace, validation/report/context parity hardening, and CI/PR candidate-gate definition with actual wiring deferred.
- Candidate D: `OPS-06` narrow derived-state refresh parity hardening after `QLT-02`.
  Covers the reproduced closeout issue where canonical planner-facing state closes `QLT-02`, but `ACTIVE_CONTEXT` still reports the closed work item as active even after regeneration. Scope should stay limited to transition-time derived-surface refresh ordering and validator-visible parity for closed-work-item re-entry state.
- Recommended sequence:
  `OPS-04` was the correct first packet and is now closed. `QLT-02` is now closed as well, but it surfaced a narrower follow-up than originally expected: the transition/closeout derived-state lag is now reproduced at planner re-entry. Recommended sequence is to treat that lag as the next narrow packet candidate before `OPS-05`, and keep `OPS-05` immediately after it unless external release/security hardening becomes the more urgent risk.

## 4. Non-Goal
- Do not reopen PMW.
- Do not start implementation before the user approves the new packet boundary.
- Do not merge unrelated product-specific delivery procedures into core.

## 5. Planning Inputs
- `AGENTS.md`
- `reference/packets/PKT-01_DEV-11_CLI_FIRST_PMW_DECOMMISSION_AND_ACTIVE_CONTEXT.md`
- `reference/artifacts/REVIEW_REPORT.md`
- `reference/artifacts/STANDARD_HARNESS_REAL_PROJECT_READINESS_ASSESSMENT.md`
- `reference/artifacts/WALKTHROUGH.md`
- `.agents/artifacts/PREVENTIVE_MEMORY.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/skills/day_start/SKILL.md`
- `.agents/workflows/dev.md`
- `.harness/runtime/state/active-context.js`
- `.harness/runtime/state/dev05-tooling.js`
- `.harness/runtime/state/drift-validator.js`

## 6. Validated Assessment Summary
- Confirmed: session-start context restoration is improved by `harness:context`, but repo-level read order still starts from `CURRENT_STATE.md` / `TASK_LIST.md` rather than `ACTIVE_CONTEXT`, and there is no read-attestation contract proving the agent actually used the compact context first.
- Confirmed: `ACTIVE_CONTEXT` is generated and source-traced, but the current schema still omits explicit `selected lane`, `must read next`, and workflow-path guidance for the next owner, so it is not yet a fully sufficient first-injected re-entry surface.
- Confirmed: transition apply now fails the handoff result when the validation report fails, but the transition path writes `ACTIVE_CONTEXT` before post-apply validation is recorded, and the current workflow contract stops short of making validation/report evidence an explicit Developer handoff gate.
- Additional repo finding: `ACTIVE_CONTEXT` freshness is not yet treated like the generated-state-doc projections with its own checksum/freshness contract, so stale active-context drift can hide unless `harness:context` is rerun.
- New closeout finding from 2026-05-04: even after `QLT-02` reviewer approval, planner closeout recording, `validation-report`, and `context` reruns, canonical Markdown surfaces show `QLT-02` as closed while `ACTIVE_CONTEXT` still keeps `QLT-02` as the active task. This is stronger than a note-only candidate because it affects the first AI re-entry surface after a real closeout.

## 7. Open Decisions
- After the closed `OPS-04`, should `QLT-02` evidence-validation / eval / CI planning open next, or should `OPS-05` security / release hardening open first?
- After the closed `QLT-02`, should the reproduced derived-state lag open as its own narrow hardening packet before `OPS-05`, or should it remain a preventive-memory candidate only?
- Which evidence weaknesses should fail hard in the first `QLT-02` implementation packet, and which should remain warning-level or reviewer-only?
- What minimum lightweight agent trace shape is enough to support semantic evidence review without high governance cost?
- Which exact CI/PR candidate gates should be recorded now so later execution wiring can stay narrow?

## 8. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Next planning lane selection | yes | user/planner | pending | recommend `PLN-10` as the next planning lane after DEV-11 closeout |
| First follow-up packet after PLN-10 | yes | user/planner | closed | `OPS-04` was approved, implemented, verified, reviewed, and closed |
| Next packet after OPS-04 | yes | user/planner | approved | user directed Planner to proceed with `QLT-02`; narrowed phase-1 scope is approved and `Ready For Code` remains pending inside the packet |
| Next packet after QLT-02 | yes | user/planner | approved | user approved `PKT-01_OPS-06_DERIVED_STATE_REFRESH_PARITY_AFTER_CLOSEOUT.md` as the next narrow packet before `OPS-05`; `Ready For Code` remains separate |
| Release/security follow-up sequence | yes | user/planner | pending | decide whether `OPS-05` opens immediately after the derived-state parity packet or only before the first external/security-sensitive release |
| Eval/CI split strategy | yes | user/planner | approved | define CI/PR candidate gates in `QLT-02`, but defer actual CI/PR execution wiring to a later narrow packet |

## 9. Recommended Next Action
- Planner should keep `QLT-02` recorded as closed, treat `OPS-06` as the approved next narrow packet, and close only the remaining `Ready For Code` boundary before implementation opens.
- Recommended sequence remains `OPS-06` before `OPS-05`. Do not open implementation until the user explicitly approves `Ready For Code` for `OPS-06`.
