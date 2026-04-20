# Task List

## Current Release Target
- DEV-05 validator / migration / cutover tooling on top of the browser-verified DEV-04 PMW baseline

## Active Locks
- none

## Active Tasks
- Define validator coverage, migration preview scope, rollback behavior, and cutover preflight entrypoints.
- Keep the PMW read surface read-only and preserve the approved overview tabs, fixed 4-card grid, artifact preview, and diagnostics hierarchy while DEV-05 is implemented.
- Keep generated docs, read model, and PMW source mapping aligned with repo-local operating-state truth.

## Handoff Log
- 2026-04-19T13:50:46.328Z: DEV-04 browser verification passed; start DEV-05 validator / migration / cutover tooling.
- 2026-04-19T13:42:09.476Z: Verify the PMW shell at http://127.0.0.1:4173; if it is clean, close DEV-04 and move to DEV-05.