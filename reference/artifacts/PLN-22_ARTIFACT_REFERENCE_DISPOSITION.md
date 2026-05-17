# PLN-22 Artifact Reference Disposition

## Purpose
Record the inbound-reference scan and execution disposition required before any `PLN-22` artifact retirement or merge.

## Approval Boundary
- User approved artifact-by-artifact retire / merge / retain execution on 2026-05-17.
- Execution remains gated by inbound-reference scan plus reference migration, tombstone, or exemption handling.
- This registry does not delete artifacts by itself.

## Initial Inbound-Reference Scan
Scan command shape:
- `rg -n --fixed-strings <artifact> --glob '!node_modules/**' --glob '!dist/**' --glob '!*.sqlite' .`

| Artifact | Initial direct-reference count | Approved disposition | Execution handling |
|---|---:|---|---|
| `.agents/artifacts/CURRENT_STATE.md` | 179 | generated/on-demand then retire persistent manual-reading role | migrate active load-order/runtime/manual references or keep tombstone before retirement |
| `.agents/artifacts/TASK_LIST.md` | 145 | generated/on-demand then retire persistent manual-reading role | migrate active load-order/runtime/manual references or keep tombstone before retirement |
| `.agents/artifacts/IMPLEMENTATION_PLAN.md` | 128 | retain | remove live routing duplication only |
| `.agents/artifacts/REQUIREMENTS.md` | 116 | retain | no retirement |
| `.agents/artifacts/ARCHITECTURE_GUIDE.md` | 134 | retain | no retirement; keep harness operating rules out |
| `.agents/artifacts/DOMAIN_CONTEXT.md` | scan pending | retain | no Slice 1 retirement |
| `.agents/artifacts/SYSTEM_CONTEXT.md` | scan pending | retain | no Slice 1 retirement |
| `.agents/artifacts/PROJECT_HISTORY.md` | scan pending | retain as audit/history | never route current work from it |
| `.agents/artifacts/PREVENTIVE_MEMORY.md` | 36 | retain | improvement memory only; no live routing authority |
| `.agents/artifacts/ACTIVE_PROFILES.md` | 10 | retain | profile/config declaration only |
| `.agents/artifacts/VALIDATION_REPORT.md` | 33 | retain as gate evidence / generated summary | move live status to CLI/query output over later slices |
| `.agents/runtime/ACTIVE_CONTEXT.json` | 74 | retain as first-read derived AI output | never write authority |
| `.agents/runtime/ACTIVE_CONTEXT.md` | 41 | generated-on-demand / removable candidate | retain until human fallback replacement and tombstones validate |
| `.agents/runtime/generated-state-docs/CURRENT_STATE.md` | 2 | retirement candidate | retire only after Active Context/source refs no longer require persistent copy |
| `.agents/runtime/generated-state-docs/TASK_LIST.md` | 2 | retirement candidate | retire only after Active Context/source refs no longer require persistent copy |

## Slice 1 Execution Rule
- Do not delete or merge any listed artifact in Slice 1.
- Implement risk-floor enforcement and fallback/retirement proof rails first.
- Preserve all high-reference artifacts until active references are migrated or tombstoned.

## Later Slice Gate
Before destructive retirement or merge:
1. Re-run inbound-reference scan.
2. Classify every remaining inbound reference as `migrate`, `tombstone`, or `exempt`.
3. Update active load order, manuals, runtime source refs, tests, and starter surfaces.
4. Regenerate `ACTIVE_CONTEXT.*`, validation report, and generated state docs.
5. Run root and starter validation evidence required by the active slice.

## Slice 4 Pre-Retirement Checklist
This checklist prepares retirement / merge approval; it does not approve deletion or merge execution by itself.

Approval status:
- User approved the Slice 4 Planning / Approval Checklist on 2026-05-17.
- This approval allows Slice 4 implementation preparation and validation work to begin.
- Non-destructive Slice 4 implementation evidence was captured on 2026-05-17: starter payload filtering excludes generated or maintainer-only runtime traces/reports/state, and root/starter acceptance evidence passes.
- Non-destructive Slice 4 reviewer closeout was recorded on 2026-05-17 with no blocking findings inside the approved boundary.
- Destructive deletion or merge execution remains blocked until separate user approval is recorded after the checklist evidence is complete.

Non-destructive evidence captured:
- root targeted tests: `node --test .harness/test/starter-payload-contract.test.js .harness/test/bootstrap-runtime.test.js .harness/test/dev05-tooling.test.js` passed.
- starter targeted tests: `node --test .harness/test/dev05-tooling.test.js` in `standard-template` passed.
- root full suite: `npm.cmd test` passed.
- starter full suite: `npm.cmd test` in `standard-template` passed.
- root and starter validators: `node .harness/runtime/state/dev05-cli.js validate` passed in both roots.
- root and starter validation reports: `node .harness/runtime/state/dev05-cli.js validation-report` passed in both roots.
- root and starter non-destructive preflight: `node .harness/runtime/state/dev05-cli.js cutover-preflight` passed in both roots without migration changes.

Before any destructive operation:
1. Re-run the inbound-reference scan for each candidate artifact immediately before the deletion or merge diff.
2. Record the new direct-reference count next to the initial count.
3. Classify all remaining references as `migrate`, `tombstone`, or `exempt`.
4. For `migrate`, update the caller to `ACTIVE_CONTEXT.json`, `harness:context`, canonical planning SSOT, or an on-demand generated view.
5. For `tombstone`, keep a minimal replacement file with replacement pointer, historical rationale, and non-authoritative status.
6. For `exempt`, record why the reference is safe to keep and which validation or manual path still depends on it.
7. Run root and `standard-template` validation evidence after the migration/tombstone/exemption diff.
8. Obtain separate user approval before deleting or merging the candidate artifact.

Slice 4 retirement candidates remain blocked until this checklist is complete:
- `.agents/artifacts/CURRENT_STATE.md`
- `.agents/artifacts/TASK_LIST.md`
- `.agents/runtime/ACTIVE_CONTEXT.md`
- `.agents/runtime/generated-state-docs/CURRENT_STATE.md`
- `.agents/runtime/generated-state-docs/TASK_LIST.md`

## Slice 2 Migration / Tombstone / Exemption Status
| Target artifact or surface | Remaining reference class | Handling | Slice 2 status | Evidence |
|---|---|---|---|---|
| `AGENTS.md`, `.agents/rules/workspace.md`, active role workflows (`plan`, `dev`, `test`, `review`) | load-order/runtime first-read references to `CURRENT_STATE.md` and `TASK_LIST.md` | migrate to `ACTIVE_CONTEXT.json` first-read plus canonical packet/requirements/architecture/implementation-plan routing | completed | root and `standard-template` workflow/rule updates plus `active-context` runtime filtering |
| `reference/manuals/HARNESS_MANUAL.md` and `standard-template/START_HERE.md` | manual first-read references to `CURRENT_STATE.md` and `TASK_LIST.md` | migrate to `ACTIVE_CONTEXT.*` first-read and demote `CURRENT_STATE.md` / `TASK_LIST.md` to compatibility/fallback usage | completed | manual and starter quickstart wording updated in root and `standard-template` |
| `.agents/artifacts/CURRENT_STATE.md` | persistent manual-reading role | tombstone after Slice 3 generated/on-demand replacement proof closes | pending | retained in Slice 2 as compatibility/evidence fallback only |
| `.agents/artifacts/TASK_LIST.md` | persistent manual-reading role | tombstone after Slice 3 generated/on-demand replacement proof closes | pending | retained in Slice 2 as compatibility/evidence fallback only |
| `.agents/runtime/ACTIVE_CONTEXT.md` | human fallback projection | exempt from retirement in Slice 2 | active exemption | copied starters may lack generated context until `harness:init` or `harness:context` regenerates it |
| `.agents/runtime/generated-state-docs/CURRENT_STATE.md` | generated projection recovery surface | exempt from retirement in Slice 2 | active exemption | `context --repair` and projection recovery still regenerate and inspect this path |
| `.agents/runtime/generated-state-docs/TASK_LIST.md` | generated projection recovery surface | exempt from retirement in Slice 2 | active exemption | `context --repair` and projection recovery still regenerate and inspect this path |
