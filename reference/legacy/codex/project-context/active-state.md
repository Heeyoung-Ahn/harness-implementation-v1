# Active State

## Last Updated

- Date: 2026-04-20
- Updated By: Codex

## Current Focus

- Milestone: DEV-04 browser verification is closed cleanly; the next active lane is DEV-05 validator / migration / cutover tooling.
- Active Workstreams: begin DEV-05 tooling implementation next session, preserve the browser-verified PMW read surface, and keep generated docs and operating-state projections aligned with the repo-local DB truth.

## In Progress

- DEV-04 PMW read surface passed browser verification at `http://127.0.0.1:4173`.
- The first-view 30-second check is now answerable from PMW: `결정해야 할 것`, `막힌 것`, `다음 작업` are all visible on the first screen.
- The overview one-line tabs, fixed 4-card current-situation grid, lower artifact preview, and diagnostics secondary layer render according to `PKT-01_DEV-04_PMW_READ_SURFACE.md`.
- PMW now reads repo-local operating state and generated docs instead of the earlier empty-store snapshot.
- DEV-05 validator / migration / cutover tooling is the next implementation target and the current ready-to-start lane.

## Blockers

- No active blocker is recorded at closeout.
- DEV-05 has no blocker yet; the immediate need is to define tooling scope and implementation entrypoints.

## Verification State

- Tests Run: `npm test` on 2026-04-20
- Browser Evidence: `.harness\pmw-home.png`, `.harness\pmw-full.png`, and `.harness\pmw-dev05.png` were captured from `http://127.0.0.1:4173` after repo-local state backfill and PMW server restart.
- Confidence Notes: DEV-04 read surface is browser-verified. Remaining uncertainty moved to DEV-05 validator / migration / cutover tooling.

## Pending Confirmations

- none

## Deferred Decisions

- Whether `feature-artifact-sync` or `operating-common-rollout` should be adapted later if the project's artifact map or cross-repo rollout needs become real.
- Whether DEV-05 should introduce a standalone CLI, a script collection, or both for validator / migration / cutover workflows.
- Whether the separate `test:reference` lane should ever become a required maintenance gate instead of an optional comparison lane.

## Open Risks

- Reference-template fixture expectations can still diverge from this thin workspace and should not be mistaken for local baseline truth.
- DEV-05 tooling still needs rollback, migration preview, and cutover preflight behavior to be defined in code and docs.

## Next Session Gate

- Start Status: ready
- First Action: start DEV-05 validator / migration / cutover tooling and define validator / migration / preflight entrypoints.
- First Clarification Needed: none

## Source References

- `README.md`
- `REQUIREMENTS.md`
- `ARCHITECTURE_GUIDE.md`
- `IMPLEMENTATION_PLAN.md`
- `PKT-01_DEV-01_DB_FOUNDATION.md`
- `PKT-01_DEV-02_GENERATED_STATE_DOCS.md`
- `PKT-01_DEV-03_CONTEXT_RESTORATION_READ_MODEL.md`
- `PKT-01_DEV-04_PMW_READ_SURFACE.md`
- `docs/dev-04-pmw-read-surface-mockup.html`
- `src\state\operating-state-store.js`
- `src\state\generate-state-docs.js`
- `src\state\drift-validator.js`
- `src\state\context-restoration-read-model.js`
- `test\operating-state-store.test.js`
- `test\generated-state-docs.test.js`
- `test\context-restoration-read-model.test.js`
- `test\pmw-read-surface.test.js`
- `src\pmw\read-surface.js`
- `src\pmw\server.js`
- `package.json`
- `codex\README.md`
- `docs\harness-layout.md`
- `docs\day-cycle-design.md`
- `codex\outputs\standard-harness\design\harness-philosophy.md`
- `codex\outputs\standard-harness\design\reference-template-curation.md`
- `codex\outputs\standard-harness\playbooks\candidate-promotion-playbook.md`
- `codex\outputs\standard-harness\playbooks\conflict-reconciliation-playbook.md`
- `codex\outputs\standard-harness\checks\promotion-gate-checklist.md`
- `codex\skills\day-start\SKILL.md`
- `codex\skills\day-end\SKILL.md`
- `codex\project-context\preventive-memory.md`
- `codex\project-context\restart-handoff-2026-04-19.md`
- `codex\project-context\daily\2026-04-19.md`
- `.harness\pmw-home.png`
- `.harness\pmw-full.png`
- `.harness\pmw-dev05.png`
