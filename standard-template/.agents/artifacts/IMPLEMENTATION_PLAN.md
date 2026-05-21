# Implementation Plan

> AUTHORITATIVE. Human-readable implementation sequencing SSOT. Edit only through an approved packet.

## Current Plan Summary
- Keep this file focused on the current and next implementation direction for the copied project.
- Do not turn this file into a long history log, closed packet catalog, or reusable rulebook.

## Active / Next Approved Work
- Complete `REQUIREMENTS.md` first.
- After requirements approval, align `ARCHITECTURE_GUIDE.md`, this implementation plan, and any required UI/design baseline.
- Open the first concrete packet before code changes.

## Implementation Sequence
1. Run `INIT_STANDARD_HARNESS.cmd` or `npm run harness:init`.
2. Close kickoff and requirements baseline.
3. Align architecture and implementation direction after requirements approval.
4. Open the first approved packet and close `Ready For Code`.
5. Implement only inside the approved packet.
6. Run validation and required verification evidence before handoff.
7. Close the packet through Tester and Reviewer before moving to deploy or the next lane.

## Dependency Order And Blocking Conditions
- Do not rewrite architecture or implementation direction before requirements approval.
- Do not start code without an active approved packet.
- Use `CURRENT_STATE.md` and `TASK_LIST.md` only as compatibility fallback when `ACTIVE_CONTEXT` or troubleshooting requires them.
- Generated `ACTIVE_CONTEXT.*`, compatibility docs, and validation surfaces must be regenerated, not manually edited as authority.

## Open Implementation Decisions
- Record current plan-level open decisions here only when they affect implementation order or blocking conditions.

## Current Packet And Evidence Requirements
- Read `ACTIVE_CONTEXT.json` first, then the matching workflow, active packet, and only the SSOT sections the packet needs.
- Run `npm test`, `npm run harness:validate`, and `npm run harness:validation-report` when the active workflow or packet requires them.
- Create walkthrough or review evidence only when the route actually needs them.

## Optional Profile Activation
- Selected profiles at bootstrap are recorded here after `harness:init`.
- Activate only the profiles that the approved requirements and packet actually need.

## Current Iteration
- [Current implementation focus for this copied project]

## Root / Standard-Template Sync Requirements
- For copied downstream projects, this section is usually informational only.
- If you are maintaining the reusable harness itself, keep root and `standard-template` reusable contracts aligned in the same lane.

## Operator Next Action
- Run `INIT_STANDARD_HARNESS.cmd` if this repo is still in starter state.
- Close `PLN-00` and `PLN-01` for the new project.
- Open the first project packet only after requirements, architecture, and implementation direction are aligned.

## Pointers
- Requirements truth: `.agents/artifacts/REQUIREMENTS.md`
- Project architecture truth: `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- Durable history when needed: `.agents/artifacts/PROJECT_HISTORY.md`
- Compatibility fallback views: `.agents/artifacts/CURRENT_STATE.md`, `.agents/artifacts/TASK_LIST.md`
- Operator manual: `reference/manuals/HARNESS_MANUAL.md`
- Packet authority: `reference/packets/*`
