# PLN-08 PMW V1.3 Phase-2 Command Surface Draft

## Status
- Draft opened on 2026-05-03 after `OPS-03` closeout.
- Planning owner: `Planner`
- Implementation remains blocked until the user approves a concrete follow-up packet and `Ready For Code`.

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
- Promote `doctor` first because it is operator-facing, bounded, and low-risk.
- Promote `validation-report` next only if the phase-2 packet also freezes artifact-link, overwrite, and confirmation behavior.
- Keep `test` out of the first phase-2 implementation packet unless the user explicitly wants PMW to own long-running test execution, cancellation, noisy stdout/stderr handling, and repeated-run ergonomics.

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
- Which of `doctor`, `test`, and `validation-report` belong in the first phase-2 packet?
- Which promoted commands require confirmation before launch?
- What session-result retention, artifact linking, and failure summary rules are required beyond phase-1?
- Whether `test` needs a separate packet because of runtime, cancellation, and repeated-run UX complexity.

## Expected Output
- One approved detailed planning packet for the first phase-2 PMW command-surface implementation lane.
- Explicit non-scope for commands that remain terminal-only after that packet.
- A verification manifest that preserves contract-level evidence for PMW/runtime/root/starter changes.

## Human Approval Boundary
- User approval is required before:
  - phase-2 command set is finalized
  - any later implementation packet is marked `Ready For Code`
  - `test` is promoted into PMW Actions

## Exit Criteria
- The first phase-2 PMW command-surface packet has a concrete recommended scope.
- The packet says exactly which commands are promoted now, which remain terminal-only, and why.
- Required verification and confirmation rules are explicit enough that `Developer`, `Tester`, and `Reviewer` can work from one SSOT.
