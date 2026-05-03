# PLN-08 PMW V1.3 Phase-2 Command Surface Draft

## Status
- Draft opened on 2026-05-03 after `OPS-03` closeout.
- Planning owner: `Planner`
- User approved the phase-2 first-packet scope on 2026-05-03: promote only `doctor`, keep `test` and `validation-report` terminal-only, and include the approved PMW usability remediation set.
- PMW usability verification is complete on 2026-05-03: sidebar/menu behavior, long-modal close access, and Artifact Library reading-area changes were accepted in the browser.
- Concrete follow-up packet drafted: `reference/packets/PKT-01_DEV-10_PMW_PHASE_2_DOCTOR_PROMOTION_AND_USABILITY_REMEDIATION.md`.
- `DEV-10` was explicitly approved and marked `Ready For Code` on 2026-05-03; implementation may now proceed within the bounded packet scope.

## Goal
- Define the next V1.3 lane that decides whether `doctor`, `test`, and `validation-report` should remain terminal-only guidance or be promoted into the PMW command surface.
- Keep the decision understandable in operator terms before any implementation packet opens.

## Why This Lane Exists Now
- V1.3 phase-1 intentionally stopped at `status`, `next`, `explain`, `validate`, `handoff`, and `pmw-export`.
- `doctor`, `test`, and `validation-report` were explicitly deferred to a later packet.
- `OPS-03` closed the SSOT, handoff, transition, and PMW design-access friction that would have made a larger PMW command lane unstable.

## Scope
- Decide the phase-2 command promotion set.
- Define safety, confirmation, and result-surface rules for any newly promoted command.
- Define root/starter/runtime/manual/PMW/export/test impacts for the later implementation packet.
- Define what still stays terminal-only even after phase-2.

## Non-Goal
- Do not implement new PMW commands in this lane.
- Do not allow arbitrary shell execution from PMW.
- Do not change PMW's read-only authority boundary.
- Do not reopen `OPS-03` unless a real conflict with its approved closeout is found.

## Recommended Direction
- Promote only `doctor` in the first phase-2 implementation packet because it is operator-facing, bounded, and low-risk.
- Keep `validation-report` terminal-only for now; do not promote it until artifact-link, overwrite, and confirmation behavior is frozen in a later packet.
- Keep `test` out of the first phase-2 implementation packet unless the user explicitly wants PMW to own long-running test execution, cancellation, noisy stdout/stderr handling, and repeated-run ergonomics.
- Use the same packet to fix the current PMW first-view usability friction that is now blocking practical use of the command surface:
  - the right-side PMW menu must stop covering the main reading surface
  - the Project Tasks Status modal must keep an always-available close action while the operator scrolls long content
  - the Artifact Library must prioritize the selected document reading area over the left-side list and avoid expanding every artifact group at once

## Compatibility Invariants
- Preserve the truth contract:
  - `.agents/artifacts/*` is canonical governance Markdown.
  - `.harness/operating_state.sqlite` is hot operational DB state.
  - `.agents/runtime/generated-state-docs/*` is derived output.
  - PMW is never write authority.
- Preserve the V1.2 installable starter / separate PMW packaging model.
- Preserve root/starter reusable runtime synchronization.
- Preserve the explicit workflow-contract model and handoff baton routing introduced through `PLN-07`, `DEV-08`, and `DEV-09`.

## Planning Questions To Close
- `doctor` is the only command promoted in the first phase-2 packet.
- `doctor` does not require confirmation before launch because it remains a bounded read-only/operator-readiness command.
- `validation-report` and `test` remain terminal-only after the first phase-2 packet.
- The first phase-2 packet must also close the approved PMW usability fixes for menu overlap, long-modal close access, and artifact-reading efficiency.

## Expected Output
- One approved detailed implementation scope that promotes only `doctor` into PMW Actions.
- Explicit non-scope for `test` and `validation-report`, which remain terminal-only after that packet.
- A verification manifest that preserves contract-level evidence for PMW/runtime/root/starter changes.
- A PMW usability remediation set covering menu placement, modal close persistence, and artifact-reading efficiency.

## Approved Outcome
- The first phase-2 packet scope is now approved as `doctor`-only promotion.
- `test` remains terminal-only because PMW still does not own long-running execution, cancellation UX, repeated-run ergonomics, or noisy result handling in this lane.
- `validation-report` remains terminal-only until a later packet closes overwrite, artifact-link, and confirmation rules.
- The approved PMW usability remediation set is complete:
  - the sidebar menu no longer permanently covers the reading surface and now supports a collapsible vertical toggle pattern
  - the Project Tasks Status modal keeps a close action available while scrolling long content
  - the Artifact Library prioritizes document reading width and on-demand artifact picking over always-expanded left-side lists
- The next implementation action is for `Developer` to execute `PKT-01_DEV-10` within the approved packet boundary and preserve the `doctor`-only command-promotion rule.

## Human Approval Boundary
- User approval is required before:
  - phase-2 command set is finalized
  - any later implementation packet is marked `Ready For Code`
  - `test` is promoted into PMW Actions

## Exit Criteria
- The first phase-2 PMW command-surface scope promotes only `doctor`.
- The scope says exactly that `test` and `validation-report` remain terminal-only and why.
- `doctor` launch rules, result-surface rules, and related artifact expectations are explicit enough that `Developer`, `Tester`, and `Reviewer` can work from one SSOT.
- The same scope explicitly covers the approved PMW usability fixes for menu overlap, long-modal close persistence, and artifact-reading efficiency.
