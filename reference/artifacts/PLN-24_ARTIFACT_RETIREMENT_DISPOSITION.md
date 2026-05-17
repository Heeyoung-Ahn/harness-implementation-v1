# PLN-24 Artifact Retirement Disposition

## Purpose
Record the same-turn inbound-reference scan, migration / tombstone / exemption handling, rollback boundary, and execution decision for the approved `PLN-24` destructive artifact retirement / merge lane.

## Approval Boundary
- User approved `PLN-24` execution on 2026-05-17.
- Execution remains limited to root-first artifact retirement / merge handling after scan, disposition, rollback, and freshness proof.
- Release packaging and downstream project mutation remain out of scope.

## Same-Turn Scan
Scan command shape:
- `rg -n --hidden --glob '!**/.git/**' --glob '!**/node_modules/**' --glob '!**/.harness/tmp/**' --glob '!**/dist/**' --glob '!**/release/**' "CURRENT_STATE\.md|TASK_LIST\.md|ACTIVE_CONTEXT\.md|ACTIVE_CONTEXT\.json|generated-state-docs|CUTOVER_PRECHECK|agent-traces|recovery-reports|\.harness/operating_state\.sqlite|\.harness\\operating_state\.sqlite"`
- Old write-path language scan: `rg -n --hidden "live execution truth|canonical write authority|write authority|write surface|source of truth|SSOT|Authoritative live routing|Generated compatibility view"`

Scan result:
- inbound-reference file set: 197 files.
- old live-truth wording requiring migration: 2 files.
- unclassified references: 0.
- `hold` items: 0.

## Candidate Inventory
| Candidate surface | Inventory observed | Tracking / payload status | Disposition |
|---|---:|---|---|
| `.agents/artifacts/CURRENT_STATE.md` | 1 file | tracked generated compatibility view | exempt / retain |
| `.agents/artifacts/TASK_LIST.md` | 1 file | tracked generated compatibility view | exempt / retain |
| root `CURRENT_STATE.md` | 0 files | absent | not-needed |
| root `TASK_LIST.md` | 0 files | absent | not-needed |
| `.agents/runtime/ACTIVE_CONTEXT.*` | 2 files | tracked generated re-entry output | exempt / retain |
| `.agents/runtime/generated-state-docs/*` | 2 files | tracked generated recovery output | exempt / retain |
| `.agents/runtime/reports/*` | 2 files | generated cutover evidence | exempt / retain |
| `.agents/runtime/recovery-reports/*` | 9 files | 6 tracked, 3 current untracked recovery evidence files | exempt / retain |
| `.agents/runtime/agent-traces/*` | 32 files | 29 tracked, 3 current untracked trace evidence files | exempt / retain |
| `standard-template/.agents/runtime/ACTIVE_CONTEXT.*` | 2 files | tracked starter-local generated output; excluded from starter copied payload by contract | already-excluded / retain in maintainer template |
| `standard-template/.agents/runtime/generated-state-docs/*` | 2 files | tracked starter-local generated output; excluded from starter copied payload by contract | already-excluded / retain in maintainer template |
| `standard-template/.agents/runtime/reports/*` | 0 files | absent | not-needed |
| `standard-template/.agents/runtime/recovery-reports/*` | 0 files | absent | not-needed |
| `standard-template/.agents/runtime/agent-traces/*` | 0 files | absent | not-needed |
| `standard-template/.harness/operating_state.sqlite` | 1 file | starter-local runtime DB; excluded from starter copied payload by contract | already-excluded / retain in maintainer template |

## Reference Disposition
| Reference class | Handling | Evidence / rationale |
|---|---|---|
| Load-order and workflow references to `.agents/artifacts/CURRENT_STATE.md` / `TASK_LIST.md` | exempt | These are generated compatibility fallback reads required by workflow contracts and tests. They are not canonical live write authority. |
| Runtime generator / validator / test references to compatibility views | exempt | `generate-state-docs.js`, validators, and regression tests intentionally generate and validate these views as compatibility output. Deleting them would break the approved recovery contract. |
| Active Context references | exempt | `ACTIVE_CONTEXT.json` is the first AI re-entry surface and `ACTIVE_CONTEXT.md` is the Korean human fallback. Both are generated and never write authority. |
| Runtime reports, recovery reports, and agent traces | exempt | These are validation, repair, and packet evidence surfaces. Current `PLN-22` / `PLN-23` / `PLN-24` evidence must remain restorable for closeout. |
| Starter runtime outputs | already-excluded | `installer/starter-payload-contract.js` classifies `ACTIVE_CONTEXT.*`, generated-state docs, traces, reports, recovery reports, and `.harness/operating_state.sqlite` as removable from copied starter payloads. No additional starter mutation is required. |
| Old live-truth wording in `day_start` skill | migration | Root and `standard-template` `day_start` skill now treat `ACTIVE_CONTEXT.json` plus operational DB state as live execution route, and `CURRENT_STATE.md` only as generated compatibility fallback. |

## Execution Result
- Physical deletion performed: none.
- Tombstone files created: none.
- Migrations applied: 2 text migrations in `day_start` skill files.
- Exemptions applied: all remaining candidate files or directories are retained because they are live generated compatibility views, first-read re-entry outputs, runtime recovery/evidence surfaces, or starter-local runtime outputs already excluded from copied starter payloads.
- Destructive lane outcome: executed as a no-op physical retirement after scan proved no candidate can be safely deleted or merged without breaking approved workflow/runtime/test/recovery contracts.

## Rollback Boundary
- Fresh `git diff --name-status` was captured before execution.
- Root `cutover-preflight` passed with `rollbackBundle.missingPaths: []` and `rollbackBundle.needsOperatorBackup: false`.
- No deleted file, merge rewrite, or tombstone replacement exists to restore.
- Rollback for the migration is the two-line `day_start` wording patch in root and `standard-template`.

## Freshness Evidence
- Root targeted suite passed before execution: `node --test .harness/test/starter-payload-contract.test.js .harness/test/bootstrap-runtime.test.js .harness/test/dev05-tooling.test.js .harness/test/workflow-governance.test.js`.
- `standard-template` targeted suite passed before execution: `node --test .harness/test/dev05-tooling.test.js .harness/test/workflow-governance.test.js`.
- Root full suite passed before execution: `npm.cmd test`.
- `standard-template` full suite passed before execution: `npm.cmd test`.

## Post-Execution Verification
- Root targeted suite passed after execution: `node --test .harness/test/starter-payload-contract.test.js .harness/test/bootstrap-runtime.test.js .harness/test/dev05-tooling.test.js .harness/test/workflow-governance.test.js`.
- `standard-template` targeted suite passed after execution: `node --test .harness/test/dev05-tooling.test.js .harness/test/workflow-governance.test.js`.
- Root full suite passed after execution: `npm.cmd test`.
- `standard-template` full suite passed after execution: `npm.cmd test`.
- Root validator passed: `node .harness/runtime/state/dev05-cli.js validate`.
- `standard-template` validator passed: `node .harness/runtime/state/dev05-cli.js validate`.
- Root validation report passed with gate decision `pass`: `node .harness/runtime/state/dev05-cli.js validation-report`.
- `standard-template` validation report passed with gate decision `pass`: `node .harness/runtime/state/dev05-cli.js validation-report`.
- Root Active Context regenerated and remains on the active `PLN-24` route: `node .harness/runtime/state/dev05-cli.js context`.
- `standard-template` Active Context regenerated and remains starter-local planner/default route: `node .harness/runtime/state/dev05-cli.js context`.
- Root cutover-preflight passed with `migrationPreview.changeCount: 0`, `rollbackBundle.missingPaths: []`, and `rollbackBundle.needsOperatorBackup: false`.
- `standard-template` cutover-preflight passed with `migrationPreview.changeCount: 0`, `rollbackBundle.missingPaths: []`, and `rollbackBundle.needsOperatorBackup: false`.
