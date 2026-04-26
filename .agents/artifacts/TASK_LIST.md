# Task List

## Current Release Target
- Complete V1.1 as a standalone production-ready standard harness template for large Excel/VBA-MariaDB business-system replacement projects, with no assumed follow-up lane for essential readiness.

## Active Locks
| Task ID | Scope | Owner | Status | Started At | Notes |
|---|---|---|---|---|---|
| - | None | - | clear | - | PLN-06 is closed. |

## Active Tasks
| Task ID | Title | Scope | Owner | Status | Priority | Depends On | Verification |
|---|---|---|---|---|---|---|---|
| - | None | - | closed | - | - | - | - |
- Preserve the approved release-ready baseline as the last known good snapshot while the generalized follow-up baseline remains the current reusable standard.
- Preserve the approved generalized standard harness baseline, including concrete `task_packet` validator enforcement, as the current reusable baseline.
- Keep the now real-world-ready `standard-template/` synchronized with future reusable core changes.
- Reopen a narrow starter-hardening lane only if launcher/runtime preflight, shipped tests, review/test starter templates, or copied-starter usability drift again.
- Keep the closed `PLN-04` domain foundation gate, `PLN-05` authoritative source gate, `DSG-02` UX archetype gate, `OPS-02` environment topology gate, `QLT-01` packet exit quality gate, `OPS-01` improvement promotion loop, `PRF-01` admin-grid profile, `PRF-02` spreadsheet-source profile, `PRF-03` airgapped-delivery profile, `TST-03` profile-aware validator enforcement, and `REV-02` closeout intact as the current standard baseline.
- Keep the closed `SIM-01` multi-profile packet composition contract, profile-composition rationale rule, and profile-set-union validator enforcement as part of the current reusable baseline.
- Keep the closed `SIM-02` task-packet registration fail-fast and canonical packet discovery rule as part of the current reusable baseline.
- Keep the closed `SIM-03` shared-source rebaseline control, source-wave ledger contract, and ledger-membership validator enforcement as part of the current reusable baseline.
- Keep the closed `REV-03` simulation remediation review result as the current approval state for the WBMS-derived reusable gap fixes.
- Keep the starter initialization automation (`INIT_STANDARD_HARNESS.cmd` / `npm run harness:init`), repo-local bootstrap seeding, and explicit `starter_bootstrap_pending` validator UX as part of the current reusable baseline for new project kickoff.
- Keep `standard-template/` synchronized with every reusable standard harness change so the deployable starter stays current.
- Keep `.agents/artifacts/PROJECT_PROGRESS.md`, generated docs, PMW read surface, and active live artifacts aligned with the current reusable baseline.

## Blocked Tasks
| Task ID | Blocker | Owner | Status | Unblock Condition | Verification |
|---|---|---|---|---|---|
| - | None | - | clear | - | - |

## Completed Tasks
| Task ID | Title | Completed At | Verification | Notes |
|---|---|---|---|---|
| PLN-06-REQ | PLN-06 requirements sharpening | 2026-04-26 | user approval | P0/P1/P2, validator levels, command contract, sync contract, state vocabulary, profile/packet readiness added. |
| PLN-06 | Standalone Business Harness V1.1 implementation | 2026-04-26 | root/starter tests, validator, operator commands, validation report, review closeout | No essential readiness item deferred. |

## Handoff Log
- 2026-04-26: Premature partial runtime relocation was rolled back. Opened `PLN-06` requirements-first lane for V1.1 standalone business-system harness readiness. The user requires this lane to deliver all essential readiness work in one pass, not as a partial step with future follow-up assumptions.
- 2026-04-26: Refined `PLN-06` requirements with P0/P1/P2 boundaries, command behavior levels, validator enforcement levels, root/starter sync classification, state vocabulary, command output, profile activation, and packet readiness contracts before implementation.
- 2026-04-24: Closed `DEV-06` and `REV-04`; preserve the real-world-ready starter surface and reopen only if a new copied-starter usability blocker appears.
- 2026-04-24: Opened `DEV-06` standard-template hardening to close the launcher preflight gap, recover green shipped tests, harden formal review/test templates, and decide placeholder-script disposition before declaring the starter real-world-ready.
- 2026-04-23: Cleaned the shipped `standard-template/` for real project kickoff use by removing self-referential harness-build docs, rewriting planner-facing kickoff docs, aligning `INIT_STANDARD_HARNESS` output with the new onboarding path, and making PMW fall back to generic starter artifacts when legacy DEV-04/05 packet docs are absent.
- 2026-04-23: Added copied-starter initialization automation plus explicit pre-bootstrap validator guidance so a new project can run one bootstrap entrypoint, seed repo-local DB/generated docs, and get a clear `starter_bootstrap_pending` message before initialization instead of raw generation-state errors.
- 2026-04-23: Closed `REV-03` after confirming the SIM-01 / SIM-02 / SIM-03 remediation set has no open reusable finding, starter placeholders remain starter-safe, and root/starter validation stays clean; preserve the approved generalized baseline until a new lane opens.
- 2026-04-23: Closed `SIM-03` after adding the reusable `AUTHORITATIVE_SOURCE_WAVE_LEDGER` artifact, packet-level shared-source wave evidence fields, validator checks for ledger membership/disposition parity, and starter synchronization; move to `REV-03`.
- 2026-04-23: Closed `SIM-02` after making validator discover current-contract concrete packet candidates in `reference/packets/`, fail on missing or wrong-category `task_packet` registration, keep validating those packets, and ignore legacy packet files outside the current contract; move to `SIM-03`.
- 2026-04-23: Closed `SIM-01` after redefining the packet/profile contract for multiple active optional profiles, extending validator enforcement to the declared profile-set union, adding concrete packet drift coverage, and syncing the starter; move to `SIM-02`.
- 2026-04-23: Opened the WBMS simulation remediation lane after the end-to-end simulation found three reusable gaps: `SIM-01` multi-profile packet composition, `SIM-02` task-packet registration enforcement, and `SIM-03` shared-source rebaseline control; start `SIM-01`.
- 2026-04-23: Closed `REV-02` after extending validator coverage to `artifact_index` category `task_packet`, syncing the starter contracts/manual, and confirming no open generalization review finding remains.
- 2026-04-23: `REV-02` found that `TST-03` only enforces reusable packet/profile contract markers and does not yet fail on missing evidence inside concrete active packet instances; keep the review lane open and open an approved remediation lane or explicit acceptance path next.
- 2026-04-23: Closed `TST-03` after extending validator coverage to the reusable packet template and optional profile evidence surfaces; move to `REV-02`.
- 2026-04-23: Closed `PRF-03` after defining the reusable airgapped-delivery optional profile surface, transfer-bundle/integrity/rollback/custody evidence set, and project-boundary rule; move to `TST-03`.
- 2026-04-23: Closed `PRF-02` after defining the reusable spreadsheet-source optional profile surface, workbook/sheet/range/header trace evidence set, and project-boundary rule; move to `PRF-03`.
- 2026-04-23: Closed `PRF-01` after defining the reusable admin-grid optional profile surface, explicit activation signal, packet-level profile evidence set, and project-boundary rule; move to `PRF-02`.
- 2026-04-23: Closed `OPS-01` after defining the preventive-memory-based improvement promotion loop, target-layer classification rule, and human-reviewed promotion boundary; move to `PRF-01`.
- 2026-04-23: Closed `QLT-01` after defining the standard packet closeout reference, packet-level closeout path / exit recommendation / residual debt / deferred follow-up evidence rule, and the source-parity / cleanup hold condition; move to `OPS-01`.
- 2026-04-23: Closed `OPS-02` after defining the standard environment topology reference, packet-level source/target environment plus execution/transfer/rollback evidence rule, and the planning hold condition; move to `QLT-01`.
- 2026-04-23: Closed `DSG-02` after defining the standard UX archetype reference, selected archetype/deviation evidence rule, and design hold condition; move to `OPS-02`.
- 2026-04-23: Closed `PLN-05` after defining the standard authoritative source intake reference, disposition rule, conflict/implementation-impact reporting requirement, and planning hold condition; move to `DSG-02`.
- 2026-04-23: Closed `PLN-04` after defining the standard domain foundation reference, schema impact hold rule, existing-schema intake expectation, and packet evidence fields; move to `PLN-05`.
- 2026-04-23: Closed `PLN-03` after defining the layer activation contract, explicit profile activation rule, required reading order, packet layer fields, and downstream output map; move to `PLN-04`.
- 2026-04-23: User refined `PLN-04` to require explicit DB design confirmation and existing-program schema compatibility analysis, and refined `PLN-05` to treat newly received planning documents as top-priority authoritative sources whose full incorporation outranks preserving the current stable implementation.
- 2026-04-22: Synchronized `standard-template/` with the current reusable standard harness assets and recorded template-sync as an explicit completion rule for future standard changes.
- 2026-04-22: User approved the standard harness follow-up direction; open a planning lane to generalize repeated failure patterns through `core / optional profile / project packet` without destabilizing the release-ready baseline.
- 2026-04-22: Closed REV-01 after aligning the PMW artifact/evidence surface with the active review evidence set and granting release-ready approval for the current baseline.
- 2026-04-22: REV-01 found an open release-risk item: PMW still points to DEV-04 packet material instead of the active review artifact and cutover evidence set, so release-ready approval stays withheld.
- 2026-04-22: Closed SEC-01 after remediating rollback bundle presence enforcement in cutover preflight and opened REV-01 final review gate.
- 2026-04-22: Closed DEV-05 with clean validator, empty migration preview, passing cutover preflight, generated cutover report evidence, and passing TST-02 PMW first-view UX gate; start SEC-01 security review and remediation.
- 2026-04-22: Re-ran TST-02 PMW first-view UX gate after switching the overview to a collapsed-by-default first view; the 4-card current-situation grid is now visible in the initial browser view and the UX gate is closed.
- 2026-04-22: Ran TST-02 PMW first-view UX gate in headless Chrome; header and overview rendered, but the current-situation 4-card grid remained below the initial view, so the release-gate UX check stays open.
- 2026-04-20: Added PMW whole-project progress board and DEV-05 cutover report output on top of the standardized harness structure.
- 2026-04-20: Standardized the repository harness structure and added DEV-05 validator / migration / cutover tooling entrypoints.
- 2026-04-19T13:50:46.328Z: DEV-04 browser verification passed; start DEV-05 validator / migration / cutover tooling.
