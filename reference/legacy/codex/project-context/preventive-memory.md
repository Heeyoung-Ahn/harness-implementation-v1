# Preventive Memory

This file keeps thin, durable prevention rules for repeated process or quality issues.

## Active Preventive Rules

- Rule ID: PMW-ORIENTATION-001
- Repeated Mistake / Trigger: During long-running work, interruptions, stale generated state, or side topics make the operator lose the whole picture, current lane, why-now context, or return point.
- Preventive Rule: Before closing any PMW-facing work item, ensure the repo-local operating state is backfilled, regenerate the designated docs, and verify that the PMW first view exposes `current lane`, `next gate / why now`, and `return point` while also answering `결정해야 할 것`, `막힌 것`, and `다음 작업` within 30 seconds.
- Check Method: Run `npm.cmd test`, start `npm.cmd run pmw:start`, and compare the browser-rendered PMW at `http://127.0.0.1:4173` against the approved packet contract, including the header/meta strip, fixed 4-card grid, artifact preview, and diagnostics hierarchy.
- Source / Evidence: User feedback on 2026-04-19 in this repo and `C:\Newface\10 Antigravity\14 wmbs`, plus DEV-04 browser verification evidence in `.harness\pmw-home.png`, `.harness\pmw-full.png`, and `.harness\pmw-dev05.png`.

## Promotion Candidates

None yet.

## Entry Format

### Active Preventive Rules

- Rule ID:
- Repeated Mistake / Trigger:
- Preventive Rule:
- Check Method:
- Source / Evidence:

### Promotion Candidates

- Candidate ID:
- Issue Pattern:
- Why It Matters:
- Needed Refinement:
- Source / Evidence:
