# Current State

## Snapshot
- Current Stage: planning
- Current Focus: preserve the approved generalized standard harness baseline and the now real-world-ready `standard-template/` until a new approved lane opens
- Current Release Goal: keep the reusable standard harness baseline stable while maintaining a copied-starter surface that is ready for real project kickoff

## Next Recommended Agent
- Planner or maintainer preserving the approved baseline until a new lane opens

## Must Read Next
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- `.agents/artifacts/TASK_LIST.md`
- `.agents/artifacts/PROJECT_PROGRESS.md`
- `reference/artifacts/REVIEW_REPORT.md`
- `.agents/runtime/generated-state-docs/CURRENT_STATE.md`
- `.agents/runtime/generated-state-docs/TASK_LIST.md`

## Open Decisions / Blockers
- No active blocker is open. `DEV-06` and `REV-04` closed on 2026-04-24 after launcher/runtime preflight enforcement, green root/starter tests, starter review/test template hardening, and placeholder-script cleanup were verified.
- The 2026-04-23 WBMS simulation found three reusable follow-up gaps: `SIM-01` multi-profile packet composition, `SIM-02` task-packet registration enforcement, and `SIM-03` shared-source rebaseline control.
- `SIM-01` closed on 2026-04-23 after redefining packet/profile citations around `Active profile dependencies`, `Active profile references`, and `Profile composition rationale`, and after extending validator enforcement from a single active profile to the declared profile-set union.
- `SIM-02` closed on 2026-04-23 after making validator discover current-contract concrete packet candidates under `reference/packets/`, fail on missing or wrong-category `task_packet` registration, and continue packet evidence validation even when registration is wrong or absent.
- `SIM-03` closed on 2026-04-23 after adding the reusable `AUTHORITATIVE_SOURCE_WAVE_LEDGER` artifact, packet-level shared-source wave evidence fields, validator enforcement for ledger membership/disposition parity, and starter synchronization.
- `REV-03` closed on 2026-04-23 with no open reusable review finding; the simulation remediation lane is approved as closed.
- Starter bootstrap automation closed on 2026-04-23 after adding `INIT_STANDARD_HARNESS.cmd`, `npm run harness:init`, placeholder-to-project initialization, repo-local DB seeding, generated-doc generation, and PMW-ready starter state creation for copied starter repos.
- Untouched `standard-template/` validation now fails with explicit `starter_bootstrap_pending` guidance instead of raw `generation_state_missing`, telling the operator to run the starter bootstrap first.
- The user approved the standard harness generalization direction on 2026-04-22.
- The user refined `PLN-04` and `PLN-05` on 2026-04-23; those details must be carried into the core contracts when the downstream planning lanes open.
- `PLN-03` closed on 2026-04-23 after documenting the activation rule, required reading order, packet layer fields, and downstream output map.
- `PLN-04` closed on 2026-04-23 after defining the domain foundation reference template, schema impact hold rule, and packet evidence requirements.
- `PLN-05` closed on 2026-04-23 after defining the authoritative source intake template, disposition rule, conflict/implementation-impact reporting requirement, and planning hold rule.
- `DSG-02` closed on 2026-04-23 after defining the product UX archetype reference template, selected archetype/deviation evidence rule, and design hold condition.
- `OPS-02` closed on 2026-04-23 after defining the environment topology reference template, packet-level source/target environment and execution target evidence rule, and the transfer/rollback hold condition.
- `QLT-01` closed on 2026-04-23 after defining the packet exit quality gate reference template, packet closeout evidence rule, and source parity / cleanup hold condition.
- `OPS-01` closed on 2026-04-23 after defining the preventive-memory-based improvement promotion loop, target-layer classification rule, and human-reviewed promotion boundary.
- `PRF-01` closed on 2026-04-23 after defining the `reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md` optional profile surface, explicit activation signal, admin-grid packet evidence set, and project-boundary rule.
- `PRF-02` closed on 2026-04-23 after defining the `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md` optional profile surface, spreadsheet traceability evidence set, and project-boundary rule for workbook/tab/mapping detail.
- `PRF-03` closed on 2026-04-23 after defining the `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md` optional profile surface, transfer-bundle/integrity evidence set, and project-boundary rule for site-specific operator/import/rollback detail.
- `TST-03` closed on 2026-04-23 after extending the validator to check the reusable packet template for layer/profile/core evidence hooks and to verify each optional profile artifact exposes its required packet evidence surface.
- `REV-02` closed on 2026-04-23 after confirming the generalized baseline stays standard and extending validator coverage to `artifact_index` category `task_packet` so concrete active packet evidence is enforced alongside reusable contract markers.
- The approved release-ready baseline remains the last known good snapshot while the generalized follow-up baseline is preserved as the current reusable standard.
- The generalized standard harness follow-up baseline is closed; keep the reusable contracts stable until a new approved lane opens.

## Latest Handoff Summary
- 2026-04-24: Closed `DEV-06` and `REV-04` after enforcing Node 24+ preflight in the launcher and JS init path, restoring green root/starter tests by seeding profile-aware validator fixtures in the read-model tests, replacing the shipped starter review/test stubs with usable templates, removing placeholder-only helper scripts from root and starter, and verifying that untouched copied starters still fail only with `starter_bootstrap_pending`.
- 2026-04-24: Opened `DEV-06` standard-template hardening as the active implementation lane to make the shipped starter real-world-ready by fixing launcher runtime preflight enforcement, restoring green starter tests, hardening review/test artifact templates, and deciding placeholder-script disposition before closeout.
- 2026-04-23: Cleaned the shipped `standard-template/` for real project kickoff use by deleting self-referential harness-build docs, rewriting first-run onboarding and starter state docs for non-developer planners, aligning `INIT_STANDARD_HARNESS` outputs with the new kickoff wording, and making PMW fall back to generic starter artifacts when legacy DEV-04/05 packet docs are absent.
- 2026-04-23: Added starter initialization automation for copied template repos, including `INIT_STANDARD_HARNESS.cmd`, `npm run harness:init`, placeholder replacement, repo-local DB seeding, generated-doc generation, and explicit pre-bootstrap validator guidance for untouched starter repos; preserve this bootstrap path as part of the current reusable baseline.
- 2026-04-23: Closed `REV-03` after confirming `SIM-01`, `SIM-02`, and `SIM-03` introduced no open reusable drift, starter placeholders remained starter-safe, and root/starter validation stayed clean; preserve the generalized baseline until a new approved lane opens.
- 2026-04-23: Closed `SIM-03` after adding the reusable `reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md` artifact, requiring packet-level `Impacted packet set scope` / `Authoritative source wave ledger reference` / `Source wave packet disposition` / `Shared-source wave status`, extending validator coverage to ledger membership and disposition parity, and synchronizing the starter baseline; `REV-03` is now active.
- 2026-04-23: Closed `SIM-02` after teaching validator to discover current-contract concrete packet candidates in `reference/packets/`, fail on missing or wrong-category `task_packet` registration, ignore legacy packet files outside the current contract, and synchronize the starter baseline; `SIM-03` is now active.
- 2026-04-23: Closed `SIM-01` after making the packet/template/profile contract multi-profile aware, extending validator enforcement to read the full declared profile set, adding concrete packet tests for union evidence and reference drift, and synchronizing the starter baseline; `SIM-02` is now active.
- 2026-04-23: Opened the WBMS simulation remediation lane after the end-to-end simulation found reusable gaps in multi-profile packet composition, task-packet registration enforcement, and shared-source rebaseline control; `SIM-01` is active and `SIM-02`, `SIM-03`, `REV-03` follow.
- 2026-04-23: Closed `REV-02` after extending validator coverage from reusable contract markers to `task_packet`-registered concrete active packet evidence, synchronizing the starter contracts, and confirming no open generalization review finding remains.
- 2026-04-23: `REV-02` found that `TST-03` currently validates reusable packet/profile contract markers only and does not yet fail on missing evidence inside concrete active packet instances; keep the review lane open until that enforcement gap is remediated or explicitly accepted.
- 2026-04-23: Closed `TST-03` after making the validator enforce the reusable packet template's layer/profile/core evidence hooks and each optional profile artifact's required packet evidence surface; `REV-02` is next.
- 2026-04-23: Closed `PRF-03` after defining the reusable airgapped-delivery optional profile surface in `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md`, requiring packet-level transfer-bundle / integrity / rollback / custody evidence, and keeping site-specific operator/import/runbook detail in the project packet; `TST-03` is next.
- 2026-04-23: Closed `PRF-02` after defining the reusable spreadsheet-source optional profile surface in `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md`, requiring packet-level workbook/sheet/range/header trace evidence, and keeping project-specific workbook/formula/import detail in the project packet; `PRF-03` is next.
- 2026-04-23: Closed `PRF-01` after defining the reusable admin-grid optional profile surface in `reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md`, requiring packet-level profile reference plus grid-specific evidence, and keeping project-specific column/permission/report detail in the project packet; `PRF-02` is next.
- 2026-04-23: Closed `OPS-01` after turning `.agents/artifacts/PREVENTIVE_MEMORY.md` into the canonical improvement memory surface, requiring candidate-level target layer / promotion status / linked follow-up item, and keeping `pending-review` candidates as memo-only until human review closes the promotion boundary; `PRF-01` is next.
- 2026-04-23: Closed `QLT-01` after turning `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md` into the standard packet closeout reference, requiring packet-level citation of closeout path / exit recommendation / residual debt / deferred follow-up item, and holding packet closeout when source parity or cleanup status is still `unknown`; `OPS-01` is next.
- 2026-04-23: Closed `OPS-02` after turning `reference/artifacts/DEPLOYMENT_PLAN.md` into the standard environment topology reference, requiring packet-level citation of topology path / source environment / target environment / execution target / transfer boundary / rollback boundary, and holding deploy/test/cutover planning when execution target is still `unknown` or rollback boundary is still `unknown`; `QLT-01` is next.
- 2026-04-23: Closed `DSG-02` after turning `reference/artifacts/PRODUCT_UX_ARCHETYPE.md` into the standard UX archetype reference, requiring packet-level citation of archetype path / selected archetype / deviation status, and holding user-facing planning when archetype selection is still `unknown` or deviation approval is still `pending`; `OPS-02` is next.
- 2026-04-23: Closed `PLN-05` after turning `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md` into the standard authoritative source intake reference, requiring packet/baseline citation of intake path and disposition, and holding planning when source disposition is still `pending` or implementation impact remains `unknown`; `DSG-02` is next.
- 2026-04-23: Closed `PLN-04` after turning `reference/artifacts/DOMAIN_CONTEXT.md` into the standard domain foundation reference, requiring packet-level citation of domain foundation path and schema impact, and holding data-impact work when schema impact is still `unknown`; `PLN-05` is next.
- 2026-04-23: Closed `PLN-03` after defining the `core / optional profile / project packet` activation contract, explicit profile activation rule, required reading order, packet layer fields, and downstream output map; `PLN-04` is next.
- 2026-04-23: Captured the approved `PLN-04` and `PLN-05` refinements so the standard harness will require DB design confirmation plus existing-schema compatibility analysis for integrated data work, and will treat new user planning documents as top-priority authoritative sources.
- 2026-04-22: Synchronized `standard-template/` with the current reusable standard harness assets so new projects can start from the deployed starter instead of outdated placeholders.
- 2026-04-22: Opened a follow-up planning lane to generalize repeated project failures into standard core contracts and optional profiles while preserving the release-ready baseline.
- 2026-04-22: REV-01 closed after resolving the PMW artifact/evidence drift; release-ready approval remains granted for the previous baseline snapshot.
