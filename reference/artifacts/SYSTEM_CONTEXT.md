# Durable Context

## Project Mission

- Build a fresh repository-local harness implementation in a thin workspace, carrying forward only validated contracts from `reference\repo_harness_template`.
- Use repo-local DB truth, Markdown canonical docs, deterministic generated docs, and a read-only PMW so a reviewer can recover the current decision point quickly.
- Keep the accepted harness corpus strict, clean, and reusable by promoting only curated and fully corrected outputs.
- Preserve a single write surface, explicit source trace, and a reusable self-improvement loop so the harness can sustain and improve itself over time.

## Current Milestone

- Stabilize the first-ship baseline through the implemented DEV-01/02/03 foundations, close the DEV-04 PMW read-surface agreement, and then finish validator and cutover work on the same repository-local contract.

## Durable Constraints

- Keep durable context, active state, and daily delta as separate layers.
- Keep candidate materials and accepted standard outputs in separate folders.
- Keep reusable harness outputs separate from project-state files.
- Require end-of-day reconciliation before claiming a clean closeout.
- Preserve ambiguity explicitly instead of silently guessing.
- Do not promote any artifact that still needs correction or project-specific cleanup.
- Keep this repository a thin workspace and do not pull legacy PMW/runtime/workflow systems back in as implicit baseline.
- Preserve the approved read-only first-ship boundary until a later packet explicitly opens write behavior.
- Treat `reference\repo_harness_template` as a source reference, not as accepted local baseline code or test truth without explicit adaptation.

## Confirmed Architecture Decisions

- `codex\` is the canonical repository-local harness root for this project.
- `day-start` reads stable context, active state, and the latest daily delta to prepare a compact execution brief.
- `day-end` runs a reconciliation gate before the day is considered cleanly closed.
- `codex\project-context\preventive-memory.md` stores reusable prevention rules and promotion candidates for repeated issues.
- `codex\outputs\harness-candidates\` is the staging area for unaccepted harness materials.
- Reusable harness deliverables belong in `codex\outputs\standard-harness\`.
- Promotion into `standard-harness` requires selection, correction completion, and verification.
- Only the selected and fully adapted parts of `reference\repo_harness_template` may enter the accepted harness corpus.
- The product architecture is `repo-local DB truth + Markdown canonical docs + generated docs + read-only PMW`.
- First-ship DB scope starts with `release_state`, `work_item_registry`, `decision_registry`, `gate_risk_registry`, `handoff_log`, `artifact_index`, and `generation_state`.
- First-ship generated docs are `CURRENT_STATE.md` and `TASK_LIST.md`.
- `.agents/artifacts/IMPLEMENTATION_PLAN.md > ## Operator Next Action` is the canonical next-action source for the read model.
- First-ship PMW mandatory scope is low-noise hero, compact 4-card rail, active detail, drawer-based artifact viewer, thin settings, and a secondary diagnostics layer.

## Non-Goals

- Rewriting the full project summary every day
- Treating daily notes as another durable source of truth
- Mixing reusable harness outputs with temporary work logs
- Mixing under-review candidate materials with accepted standard outputs
- Silently promoting temporary conclusions into stable project context
- Reusing previous PMW, runtime, validator, or workflow code as an implicit drop-in baseline
- Expanding first ship into write-enabled PMW behavior
- Treating reference-template implementation details as accepted local standard outputs without full correction and verification

## Confirmed Working Agreements

- Use the user's language for day-start briefings and day-end confirmation questions.
- Ask the user to confirm conflicts that affect next action, completion state, architecture direction, verification state, or blockers.
- Prefer short structured notes over long narrative summaries.
- Use `reference\repo_harness_template` as a source reference for future harness expansion where useful.
- Strictly screen candidate materials against the harness philosophy before accepting them.
- If a selected item needs correction or supplementation, complete that work before bringing it into `standard-harness`.
- Convert repeated issue patterns into thin preventive rules only when the trigger, rule, and check method are explicit enough to reuse.
- Do not start user-facing code until the corresponding task-level packet and human approval boundary are closed.
- Strong surface summary may consume only designated summary sources or explicit fallback such as `needs source`.
