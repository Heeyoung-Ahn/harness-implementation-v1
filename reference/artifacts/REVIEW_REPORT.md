# Review Report

Use this artifact when the project enters a formal review gate.

## 2026-05-03 DEV-11 Closeout Readiness Review

- Scope: closeout readiness review for `DEV-11` after final Tester re-verification passed and the active handoff moved to `tester -> reviewer`.
- Entry condition:
  - Final Tester re-verification evidence was recorded in `reference/artifacts/WALKTHROUGH.md`.
  - Root/starter full tests, validator, validation report, rebuilt V1.3 payload inspection, and clean copied-starter smoke all passed in the final Tester pass.
- Evidence reviewed:
  - `reference/packets/PKT-01_DEV-11_CLI_FIRST_PMW_DECOMMISSION_AND_ACTIVE_CONTEXT.md`
  - `reference/artifacts/WALKTHROUGH.md`
  - `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
  - `reference/artifacts/REVIEW_REPORT.md`
  - `.agents/artifacts/CURRENT_STATE.md`
  - `.agents/artifacts/TASK_LIST.md`
  - `.agents/artifacts/REQUIREMENTS.md`
  - `.agents/artifacts/ARCHITECTURE_GUIDE.md`
  - `.agents/artifacts/IMPLEMENTATION_PLAN.md`
  - `.agents/artifacts/VALIDATION_REPORT.md`
  - local maintainer workspace directory inspection for `pmw-app/`
- Findings:
  - `.agents/artifacts/CURRENT_STATE.md` still carries stale DEV-11 phase wording after the active handoff moved to `tester -> reviewer`. The same canonical doc says the stage is `review` and the active handoff is `tester -> reviewer`, but it also says `DEV-11 implementation is ready for re-verification`, `Developer is implementing PMW-only procedure removal`, and `PKT-01_DEV-11... is Ready For Code approved and in Developer implementation.` This leaves the human-facing current-state SSOT partially behind the live review state and means the DEV-11 active-task/current-work parity contract is not fully met at closeout.
- Risk:
  - Reviewer cannot approve packet exit while the canonical human-facing current-state surface still reports prior-gate wording for the active work item.
  - This reintroduces the stale-current-state closeout risk that previously required remediation in `OPS-03`.
- Non-blocking note:
  - The root `pmw-app/` directory still exists as an empty maintainer-workspace folder because another process is holding a directory handle. No files remain there, it is absent from the rebuilt V1.3 payload/runtime evidence, and it is treated here as local cleanup residue rather than the blocking closeout finding.
- Required remediation:
  - Update the current-state refresh path so reviewer-stage DEV-11 wording replaces stale implementation/re-verification bullets consistently across `Current Focus`, open-decision bullets, and current-truth notes.
  - Add regression coverage or validator enforcement that catches stale reviewer-stage wording in canonical `CURRENT_STATE.md`.
  - Rerun the relevant root/starter transition tests, full tests, validator, validation report, and return the packet to Tester for re-verification.
- Packet exit decision:
  - hold
- Next handoff:
  - Developer should remediate the stale reviewer-stage `CURRENT_STATE.md` wording and strengthen coverage so the canonical current-state surface cannot lag behind the active handoff again.
- Status: hold; Developer remediation required

## 2026-05-03 OPS-03 Revised-Scope Closeout Re-Check

- Scope: Reviewer re-check for `OPS-03` after Developer remediated the stale `CURRENT_STATE` transition wording and Tester re-verified the remediation.
- Entry condition:
  - Developer remediation evidence was added to `reference/packets/PKT-01_OPS-03_HARNESS_OPERATION_FRICTION_REDUCTION.md`.
  - Tester re-verification evidence was added to `reference/artifacts/WALKTHROUGH.md`.
  - Root/starter targeted regression tests, root/starter full tests, validator, PMW export, and validation report were rerun and passed after the remediation.
- Evidence reviewed:
  - `reference/packets/PKT-01_OPS-03_HARNESS_OPERATION_FRICTION_REDUCTION.md`
  - `reference/artifacts/WALKTHROUGH.md`
  - `.agents/artifacts/CURRENT_STATE.md`
  - `.agents/artifacts/TASK_LIST.md`
  - `.agents/artifacts/VALIDATION_REPORT.md`
  - `.agents/runtime/pmw-read-model.json`
  - `.harness/runtime/state/dev05-tooling.js`
  - `standard-template/.harness/runtime/state/dev05-tooling.js`
  - `.harness/test/dev05-tooling.test.js`
  - `standard-template/.harness/test/dev05-tooling.test.js`
- Findings:
  - no open review finding remains.
- Review result:
  - Canonical `CURRENT_STATE.md` now updates the active work-item truth note with the same transition state that drives the main active-handoff bullet.
  - Reviewer-source remediation loops preserve `Ready For Code: approved` instead of degrading the display to an empty status.
  - Root and `standard-template` remain synchronized for the reusable transition/runtime/test changes.
  - PMW export again uses the active OPS-03 packet as the active packet source and no stale current-state wording remains in the canonical state surface reviewed for closeout.
  - Residual debt disposition: none for the reviewed remediation scope.
- Validation:
  - root `node --test .harness\test\dev05-tooling.test.js`: 20/20 pass.
  - `standard-template` `node --test standard-template\.harness\test\dev05-tooling.test.js`: 20/20 pass.
  - root `npm.cmd test`: 46/46 pass.
  - `standard-template` `npm.cmd test`: 46/46 pass.
  - root `npm.cmd run harness:validate`: findings `[]`.
  - root `npm.cmd run harness:pmw-export`: pass.
  - root `npm.cmd run harness:validation-report`: gate decision `pass`, findings `[]`.
- Packet exit decision:
  - approved
- Next handoff:
  - Planner should record OPS-03 closeout and choose the next approved lane.
- Status: done

## 2026-05-03 OPS-03 Revised-Scope Closeout Review

- Scope: closeout readiness review for the revised `OPS-03` scope after revised-scope Tester verification passed and the active handoff moved to `tester -> reviewer`.
- Entry condition:
  - Revised-scope Tester verification evidence was recorded in `reference/artifacts/WALKTHROUGH.md`.
  - Root/starter targeted tests, root/starter full tests, `pmw-app` tests, validator, PMW export, and validation report were rerun and passed on 2026-05-03.
- Evidence reviewed:
  - `reference/packets/PKT-01_OPS-03_HARNESS_OPERATION_FRICTION_REDUCTION.md`
  - `reference/artifacts/WALKTHROUGH.md`
  - `reference/artifacts/REVIEW_REPORT.md`
  - `.agents/artifacts/CURRENT_STATE.md`
  - `.agents/artifacts/TASK_LIST.md`
  - `.agents/artifacts/VALIDATION_REPORT.md`
  - `.agents/artifacts/REQUIREMENTS.md`
  - `.agents/artifacts/ARCHITECTURE_GUIDE.md`
  - `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- Findings:
  - After `harness:transition -- --transition tester-to-reviewer --apply` succeeded on 2026-05-03, `.agents/artifacts/CURRENT_STATE.md` still contains stale revised-scope wording: `Revised Developer implementation evidence is recorded; Tester verification and Reviewer closeout remain pending.` and `revised Developer evidence is now recorded and must be verified by Tester before Reviewer closeout.` This conflicts with the live owner/state that already moved to `reviewer` and shows the OPS-03 stale current-state problem is not fully closed.
- Risk:
  - Reviewer cannot approve packet exit while the canonical current-state surface still reports a completed gate as pending.
  - The stale wording weakens OPS-03's approval/SSOT consistency and current-state/history-separation acceptance because the operator-facing canonical doc remains partially behind the true lane state after transition.
- Required remediation:
  - Update the canonical current-state transition refresh path so reviewer-facing transitions also rewrite or remove stale phase-specific residual bullets, not only the main active-work bullet.
  - Add regression coverage and/or validator enforcement that catches stale current-state gate wording after state transitions.
  - Rerun the relevant root/starter transition tests, full tests, validator, PMW export, and validation report after remediation, then return to Tester for re-verification.
- Packet exit decision:
  - hold
- Next handoff:
  - Developer should remediate the current-state stale-transition wording and add coverage so the same stale state cannot pass into Reviewer closeout again.
- Status: hold; Developer remediation required

## 2026-05-03 OPS-03 User-Directed Planning Reopen

- Scope: Planner rebaseline after the user clarified the intended treatment of Reviewer feedback and the attached Karpathy-style behavior guide.
- Trigger:
  - Reviewer closeout readiness re-check held `OPS-03` for current-state/history separation and insufficient behavior guidance adoption.
  - User clarified that the guide must not be thinned down; it should be sufficiently reflected while staying compatible with this harness's SSOT, approval, workflow, Tester, Reviewer, PMW read-only, and root/starter sync contracts.
  - User added that human-and-Planner-approved project design SSOT must guide every other agent, and PMW Artifact Library must keep whole-project design artifacts always available with a wider reading body.
- Review disposition:
  - The previous `reviewer -> developer` remediation path is superseded as the immediate next action.
  - Prior Developer remediation evidence remains historical evidence, but closeout must wait for the revised Planner agreement and later implementation/verification under the clarified scope.
- Next handoff:
  - Planner should revise the OPS-03 agreement and acceptance criteria before Developer resumes.
- Status: planning reopened

## 2026-05-03 OPS-03 Closeout Readiness Re-Check

- Scope: closeout readiness review for `OPS-03` after Tester re-verification of the Reviewer-finding remediation.
- Entry condition:
  - Tester re-verification passed after transition guard remediation.
  - Root/starter targeted transition tests, root/starter full tests, PMW app tests, validator, PMW export, and validation report were recorded as passing.
- Evidence reviewed:
  - `reference/packets/PKT-01_OPS-03_HARNESS_OPERATION_FRICTION_REDUCTION.md`
  - `reference/artifacts/WALKTHROUGH.md`
  - `.agents/artifacts/CURRENT_STATE.md`
  - `.agents/artifacts/TASK_LIST.md`
  - `.agents/artifacts/VALIDATION_REPORT.md`
  - `.agents/runtime/pmw-read-model.json`
  - `.agents/workflows/dev.md`
  - `.agents/workflows/test.md`
  - `.agents/workflows/review.md`
  - `.agents/workflows/plan.md`
  - `.agents/skills/day_start/SKILL.md`
  - `.agents/skills/day_wrap_up/SKILL.md`
  - `standard-template/.agents/workflows/dev.md`
  - `standard-template/.agents/workflows/test.md`
  - `standard-template/.agents/workflows/review.md`
  - `standard-template/.agents/workflows/plan.md`
  - `standard-template/.agents/skills/day_start/SKILL.md`
  - `standard-template/.agents/skills/day_wrap_up/SKILL.md`
- Findings:
  - `CURRENT_STATE.md` still carries stale OPS-03 gate wording after the active handoff moved to `tester -> reviewer`: the document says the current remaining gate is Tester re-verification before Reviewer closeout resumes. It also remains long and dominated by closed `PLN-07` / `DEV-07` / `DEV-08` / `DEV-09` history, so the OPS-03 current-state/history separation acceptance is not met.
  - The attached Karpathy-style behavior guidance is not yet integrated as the compact workflow/skill guidance required by OPS-03. Searches across root and `standard-template` role workflows plus `day_start` / `day_wrap_up` skills found no explicit `Think Before Coding`, `Simplicity First`, `Surgical Changes`, or `Goal-Driven Execution` guidance. The current implementation should be treated as partial day-start/day-wrap-up reflection, not completed adoption.
- Required remediation:
  - Refresh the `CURRENT_STATE.md` update path so transition/current-focus text cannot remain on a completed previous gate after handoff, and move closed-lane history out of the current-state surface while preserving authoritative history elsewhere.
  - Add regression coverage or validator checks that catch stale current gate text and excessive closed-lane history in `CURRENT_STATE.md`.
  - Add a thin reusable behavior guidance surface for the four Karpathy-style principles and wire it into the relevant root and `standard-template` role workflows/skills without making the ZIP a runtime dependency.
  - Include Tester workflow expectations for comparing implementation against requirements/acceptance and handing improvement requests back to Developer when requirements are not met.
  - Rerun root/starter tests, validator, PMW export, validation report, and Tester workflow verification after remediation.
- Packet exit decision:
  - hold
- Next handoff:
  - Developer should remediate the current-state/history split and agent behavior guidance adoption gaps, then return to Tester.
- Status: hold; Developer remediation required

## 2026-05-03 OPS-03 Review Finding

- Scope: packet exit closeout review for `OPS-03` harness operation reliability and friction reduction after Tester re-verification passed.
- Entry condition:
  - Tester re-verification passed after Developer remediation of mixed-timestamp handoff ordering and transition canonical-doc updates.
  - Root/starter tests, PMW app tests, validator, PMW export, and validation report were recorded as passing in the OPS-03 packet.
- Evidence reviewed:
  - `reference/packets/PKT-01_OPS-03_HARNESS_OPERATION_FRICTION_REDUCTION.md`
  - `.harness/runtime/state/dev05-tooling.js`
  - `.harness/runtime/state/operating-state-store.js`
  - `.harness/runtime/state/drift-validator.js`
  - `.harness/runtime/state/context-restoration-read-model.js`
  - `.harness/test/dev05-tooling.test.js`
  - `.harness/test/operating-state-store.test.js`
  - `standard-template/.harness/runtime/state/dev05-tooling.js`
  - `.agents/runtime/pmw-read-model.json`
  - `.agents/artifacts/VALIDATION_REPORT.md`
- Findings:
  - `harness:transition` reads packet `Ready For Code` state but does not block `planner-to-developer` when the packet is not approved. This weakens the OPS-03 requirement that implementation handoff requires a source-traced approval event.
  - `harness:transition --apply` can return top-level `ok: true` after writing DB, canonical docs, generated docs, PMW export, and handoff evidence even when the generated validation report fails. The CLI exit rule also ignores `validationReport.ok`, so a failed post-apply validation can look successful to the operator.
- Required remediation:
  - Add root and `standard-template` transition guards so `planner-to-developer` requires packet `Ready For Code: approved`.
  - Require any open Ready For Code decision for the same packet to be closed through the transition request before implementation handoff is considered valid.
  - Make post-apply validation failure set top-level transition result `ok: false` and return a non-zero CLI exit.
  - Add root/starter regression tests for unapproved Ready For Code, open Ready For Code decision, and post-apply validation failure reporting.
  - Rerun root/starter targeted transition tests, root/starter full tests, PMW app tests, validator, PMW export, and validation report after remediation.
- Developer remediation:
  - Root and `standard-template` `harness:transition` now block `planner-to-developer` unless packet `Ready For Code` is approved.
  - Root and `standard-template` `harness:transition` now block `planner-to-developer` when an open Ready For Code decision for the same packet is not included in `--close-decision`.
  - Post-apply validation failure now sets top-level transition `ok: false`, preserving the validation report summary so the CLI can return failure instead of silent success.
  - Transition apply now refreshes `.agents/artifacts/IMPLEMENTATION_PLAN.md` `## Operator Next Action`, closing the PMW Next Action stale-source gap observed during remediation.
  - Root and starter transition regression tests now cover unapproved Ready For Code, unclosed Ready For Code decision, post-apply validation failure reporting, and implementation-plan next-action refresh.
- Developer validation:
  - root targeted `node --test .harness\test\dev05-tooling.test.js`: 17/17 pass.
  - starter targeted `node --test standard-template\.harness\test\dev05-tooling.test.js`: 17/17 pass.
  - root `npm.cmd test`: 43/43 pass.
  - `standard-template` `npm.cmd test`: 43/43 pass.
  - `pmw-app` `npm.cmd test`: 2/2 pass.
- Packet exit decision:
  - hold
- Next handoff:
  - Tester should re-verify the remediation and PMW/export evidence before returning to Reviewer.
- Status: remediated; awaiting Tester re-verification

## 2026-05-02 DEV-09 Packet Exit Closeout Review

- Scope: packet exit closeout review for `DEV-09` PMW phase-1 command launcher, confirmation boundaries, terminal-only guidance, session result surface, and handoff baton behavior.
- Entry condition:
  - Tester verification passed on 2026-05-02 and was recorded in `reference/artifacts/WALKTHROUGH.md`.
  - PMW app tests, root tests, starter tests, validator, PMW export, validation report, and handoff evidence are clean.
- Evidence reviewed:
  - `reference/packets/PKT-01_DEV-09_PMW_PHASE_1_COMMAND_LAUNCHER_AND_HANDOFF_EXECUTION.md`
  - `pmw-app/runtime/server.js`
  - `pmw-app/test/server.test.js`
  - `.harness/runtime/state/context-restoration-read-model.js`
  - `.harness/test/pmw-read-surface.test.js`
  - `standard-template/.harness/runtime/state/context-restoration-read-model.js`
  - `standard-template/.harness/test/pmw-read-surface.test.js`
  - `.agents/runtime/pmw-read-model.json`
  - `.agents/artifacts/VALIDATION_REPORT.md`
  - `reference/artifacts/WALKTHROUGH.md`
- Findings:
  - no open review finding remains.
- Review result:
  - PMW launcher scope remains fixed to `status`, `next`, `explain`, `validate`, `handoff`, and `pmw-export`.
  - `doctor`, `test`, and `validation-report` remain terminal-only guidance.
  - Confirmation boundaries match the approved decision: `validate` is no-confirmation; `handoff` and `pmw-export` are confirmation-required.
  - Server-side command execution is selected-project scoped, rejects unknown launcher commands, blocks a second in-flight command for the same project, and stores result entries in the current PMW session only.
  - Handoff behavior uses the existing route contract and exposes previous work agent, previous work summary, next work agent, and next work summary without creating an agent runtime.
  - Root and `standard-template` reusable command metadata and regression tests are synchronized.
  - Residual debt disposition: none for the reviewed DEV-09 scope.
- Validation:
  - `pmw-app` `npm.cmd test`: 2/2 pass.
  - root `npm.cmd test`: 36/36 pass.
  - `standard-template` `npm.cmd test`: 36/36 pass.
  - root `npm.cmd run harness:validate`: findings `[]`.
  - root `npm.cmd run harness:pmw-export`: pass.
  - root `npm.cmd run harness:validation-report`: gate decision `pass`, findings `[]`.
  - root `npm.cmd run harness:handoff`: route `.agents/workflows/test.md` before closeout.
- Result: approved.
- Next handoff:
  - Planner should open the harness-operation friction reduction plan requested by the user, covering gate profiles, transition automation, and state/history separation.
- Status: done

## 2026-05-02 DEV-08 Packet Exit Closeout Review

- Scope: packet exit closeout review for `DEV-08` workflow contracts, handoff routing remediation, PM workflow addition, root/starter parity, and PMW route-context evidence.
- Entry condition:
  - Tester re-verification passed on 2026-05-01.
  - DB hot-state and PMW export route the current active task to Reviewer for packet closeout.
- Evidence reviewed:
  - `reference/packets/PKT-01_DEV-08_WORKFLOW_CONTRACTS_AND_HANDOFF_ROUTING.md`
  - `.harness/runtime/state/context-restoration-read-model.js`
  - `.harness/runtime/state/workflow-routing.js`
  - `.agents/runtime/pmw-read-model.json`
  - `.agents/artifacts/CURRENT_STATE.md`
  - `.agents/artifacts/TASK_LIST.md`
  - `.agents/artifacts/VALIDATION_REPORT.md`
  - `reference/artifacts/WALKTHROUGH.md`
- Finding:
  - PMW Action Board `nextTask` derives `owner` and `workflow` from the current `handoffExecution` instead of the `nextTaskSource` owner.
  - Current PMW evidence shows `nextTask.taskId: PLN-07` with `owner: reviewer` and `.agents/workflows/review.md`, while canonical `PLN-07` remains planner-owned.
  - This can mislead the operator about the next lane after DEV-08 and conflicts with the DEV-08 route-context acceptance target.
- Required remediation:
  - Make `nextTask` owner/workflow derive from `nextTaskSource.owner` using the same route contract as handoff routing.
  - Keep root and `standard-template` synchronized.
  - Add root/starter regression coverage for an active task routed to Reviewer while the next task is Planner-owned.
  - Rerun root/starter tests, validator, handoff, PMW export, and validation report.
- Developer remediation:
  - `.harness/runtime/state/context-restoration-read-model.js` now renders real `nextTask` owner/workflow from `nextTaskSource.owner` and `workflowForOwner()`.
  - `standard-template/.harness/runtime/state/context-restoration-read-model.js` is synchronized with the same fix.
  - Root and `standard-template` regression tests cover a reviewer-routed active task followed by planner-owned `PLN-07`.
  - Verification passed with root/starter targeted read-model tests 5/5 and root/starter full `npm.cmd test` 36/36.
- Tester re-verification:
  - PMW Action Board now shows `currentTask: DEV-08`, `owner: tester`, `workflow: .agents/workflows/test.md`.
  - PMW Action Board now shows `nextTask: PLN-07`, `owner: planner`, `workflow: .agents/workflows/plan.md`.
  - Root and `standard-template` targeted read-model tests passed 5/5 each; root and `standard-template` full `npm.cmd test` passed 36/36 each.
  - Root validator, handoff, PMW export, validation report, and status checks passed with no validator findings.
- Packet exit decision:
  - approved
- Reviewer re-check:
  - No blocking or non-blocking finding was found in the DEV-08 packet exit re-check.
  - PMW Action Board source parity is now aligned: `currentTask` routes to `DEV-08` / `reviewer` / `.agents/workflows/review.md`, and `nextTask` routes to `PLN-07` / `planner` / `.agents/workflows/plan.md`.
  - Root and `standard-template` targeted read-model tests passed 5/5 each; root and `standard-template` full `npm.cmd test` passed 36/36 each.
  - Root validator, handoff, and PMW export passed with no validator findings.
  - Residual debt disposition: none for the reviewed DEV-08 scope.
- Next handoff:
  - Planner should select the next `PLN-07` V1.3 PMW operator-console / workflow-contract planning step.
- Status: done

## 2026-05-01 DEV-07 PMW V1.3 First-View Review

- Scope: formal review of `DEV-07` after tester verification and user browser testing completed for the PMW V1.3 first-view operator console.
- Entry condition:
  - Tester verification passed and was recorded in `reference/artifacts/WALKTHROUGH.md`.
  - PMW server tests, read-model tests, root tests, and validator were green before review.
- Evidence reviewed:
  - `reference/packets/PKT-01_DEV-07_PMW_V1_3_OPERATOR_CONSOLE_FIRST_VIEW.md`
  - `pmw-app/runtime/server.js`
  - `pmw-app/test/server.test.js`
  - `.harness/runtime/state/context-restoration-read-model.js`
  - `.agents/artifacts/CURRENT_STATE.md`
  - `.agents/artifacts/TASK_LIST.md`
  - `reference/artifacts/WALKTHROUGH.md`
- Finding:
  - `pmw-app/runtime/server.js` checks artifact preview containment with `absolutePath.startsWith(repoRoot)`.
  - A selected project rooted at a path such as `C:\repo\app` can be bypassed by a resolved sibling path such as `C:\repo\app-private\...`, because that sibling string still starts with `C:\repo\app`.
  - The subsequent `fs.existsSync()` and `fs.readFileSync()` calls can then preview files outside the selected project when the crafted sibling-prefix path exists.
- Risk:
  - PMW artifact preview is intended to expose selected-project artifacts only. This bug weakens the separate project boundary and can disclose adjacent local files from the same operator machine.
- Required remediation:
  - Replace the prefix check with a segment-aware containment check, for example `path.relative(repoRoot, absolutePath)` rejecting `..`, absolute relatives, and same-prefix siblings.
  - Add PMW server regression coverage for an artifact path that tries to escape into a sibling directory with the same prefix.
  - Rerun `npm.cmd test` in `pmw-app`, the PMW read-surface tests, root `npm.cmd test`, and `npm.cmd run harness:validate`.
- Developer remediation:
  - `pmw-app/runtime/server.js` now uses a segment-aware `path.relative()` containment helper before reading artifact preview files.
  - `pmw-app/test/server.test.js` now seeds an `alpha-project-private` sibling and verifies `../alpha-project-private/SECRET.md` is rejected.
  - Verification passed with `npm.cmd test` in `pmw-app`, targeted PMW/read-model tests, root `npm.cmd test`, and `npm.cmd run harness:validate`.
- Reviewer re-check:
  - Segment-aware containment rejects sibling-prefix escape attempts before `fs.readFileSync()`.
  - Regression coverage directly exercises the prior sibling-prefix escape shape.
  - Re-check evidence passed with `npm.cmd test` in `pmw-app`, targeted PMW/read-model tests, root `npm.cmd test`, and `npm.cmd run harness:validate`.
- Result: approved.
- Status: done

## 2026-04-27 V1.2 Installable Harness / PMW Baseline Reconciliation

- Scope: reconcile the already-implemented V1.2 installable harness baseline across maintainer SSOT, DB hot-state, generated docs, separate PMW packaging, starter guardrails, and release scripts.
- Root cause:
  - commit `b225956` implemented installable release surfaces across `standard-template/`, `installer/`, `pmw-app/`, `packaging/`, and `reference/manuals/`, but no release-maintenance lane updated root `.agents/artifacts/*` or `.harness/operating_state.sqlite`
  - release label strings were duplicated across runtime and packaging surfaces without a shared release-baseline source
  - validator coverage did not yet fail when maintainer release surfaces and root SSOT diverged
- Implemented:
  - shared release-baseline constants for root and starter runtime/test surfaces
  - release-baseline validator enforcement for maintainer repos
  - canonical V1.2 updates in `CURRENT_STATE`, `TASK_LIST`, `PROJECT_PROGRESS`, `IMPLEMENTATION_PLAN`, `REQUIREMENTS`, and this review report
  - starter kickoff status-doc updates confirming copied projects originate from the V1.2 installable baseline
  - packaging scripts switched to the shared release-baseline directories instead of duplicated literals
  - maintenance-map guidance tightened so reusable changes, root-only release changes, starter sync, and `dist/` regeneration have an explicit decision rule
- Verification:
  - root `npm test`
  - `standard-template/` `npm test`
  - `node --test pmw-app/test/*.test.js`
  - root `npm run harness:validation-report`
  - release-baseline validator tests in root and starter
- Result: approved.
- Status: done

## 2026-04-26 PLN-06 V1.1 Closeout Review

- Scope: standalone business-system harness V1.1 for real Excel/VBA-MariaDB replacement projects.
- Result: approved.
- No essential readiness item from `reference/planning/PLN-06_STANDALONE_BUSINESS_HARNESS_V1_1.md` was deferred.
- Implemented:
  - harness runtime moved out of root `src/` into `.harness/runtime/`
  - harness tests moved out of root `test/` into `.harness/test/`
  - root `package.json` and starter `package.json` kept as harness command wrappers
  - repository layout ownership contract added
  - truth hierarchy synchronized across agent/workspace/manual/architecture surfaces
  - structured task truth added
  - `doctor`, `status`, `next`, `explain`, and `validation-report` commands added
  - validation report Markdown/JSON persistence added
  - PRF-04 legacy Excel/VBA-MariaDB replacement profile added
  - PRF-05 Python/Django backoffice profile added
  - PRF-06 workflow/approval application profile added
  - packet template evidence expanded for product source root, legacy replacement, Django, workflow/approval readiness
  - validator extended for path safety, harness-owned paths, structured task truth, active profiles, new profile markers, concrete packet evidence, and root/starter sync drift
  - root and `standard-template/` synchronized for reusable runtime, test, rule, packet, profile, and layout assets
- Verification:
  - root `npm test`: 30/30 pass
  - `standard-template/` `npm test`: 30/30 pass
  - root `npm run harness:validate`: pass
  - `standard-template/` `npm run harness:validate`: intentionally returns only `starter_bootstrap_pending`
  - `npm run harness:doctor`: pass
  - `npm run harness:status`: pass
  - `npm run harness:next`: pass
  - `npm run harness:explain`: pass
  - `npm run harness:validation-report`: persisted `.agents/artifacts/VALIDATION_REPORT.md` and `.agents/artifacts/VALIDATION_REPORT.json`
  - `npm run harness:migration-preview`: pass, 0 changes
  - `npm run harness:cutover-preflight`: pass
  - `npm run harness:cutover-report`: pass
- Residual risk:
  - Advanced semantic validation of project-specific approval matrices, financial mappings, and migration automation remains document-only/optional by approved PLN-06 boundary.
- Status: done

## 2026-04-26 V1.1 Cross-Project Profile Hardening Addendum

- Scope: post-review hardening for using the standard harness across lightweight web/app projects, Android native apps, Node-root package projects, and existing complex business-system replacements.
- Implemented:
  - `PRF-07_LIGHTWEIGHT_WEB_APP_PROFILE.md` for lightweight web apps, simple internal tools, and small apps where legacy/workflow/migration gates would be too heavy.
  - `PRF-08_ANDROID_NATIVE_APP_PROFILE.md` for Android native work with Gradle/AGP, namespace, SDK, signing, permissions, device/emulator test, and release-channel evidence.
  - profile evidence templates for legacy intake, migration/reconciliation, Django conventions, workflow state, approval/role/audit, lightweight app baseline, and Android app baseline.
  - packet template fields and human approval rows for lightweight and Android evidence.
  - validator profile registry, packet required-field enforcement, fixture coverage, and root/starter sync paths for PRF-07/08 and new evidence templates.
  - package ownership policy for projects that also need root `package.json`.
  - starter DB packaging policy and removal of `standard-template/.harness/operating_state.sqlite` from the reusable starter.
  - bootstrap state vocabulary alignment from `planning` to `kickoff_interview`.
- Verification:
  - root `npm test`: 32/32 pass
  - `standard-template/` `npm test`: 32/32 pass
  - root `npm run harness:validate`: pass
  - root `npm run harness:doctor`: pass
  - root `npm run harness:status`: pass
  - root `npm run harness:validation-report`: persisted `.agents/artifacts/VALIDATION_REPORT.md` and `.agents/artifacts/VALIDATION_REPORT.json`
  - root `npm run harness:cutover-preflight`: pass
  - `standard-template/` `npm run harness:validate`: intentionally returns only `starter_bootstrap_pending` before initialization
- Result: approved.
- Status: done

## 2026-04-22 SEC-01 Kickoff

- Scope: release-bound security review and remediation for the cutover-ready standardized harness baseline.
- Entry condition:
  - DEV-05 closeout passed with clean validator, empty migration preview, clean cutover preflight, generated cutover report evidence, and passing TST-02 PMW first-view UX gate.
- Evidence to review:
  - `.agents/runtime/reports/CUTOVER_PRECHECK.md`
  - `.agents/runtime/reports/CUTOVER_PRECHECK.json`
  - `.harness/tst02-pmw-home.png`
  - `.harness/tst02-pmw-read-surface.json`
- Review focus:
  - code paths and local scripts
  - file/path operations and rollback coverage
  - dependency boundaries and release-bound operational risk
  - cutover procedure and remaining human approval boundaries
- Status: in progress

## 2026-04-22 SEC-01 Closeout

- Finding:
  - cutover preflight previously listed rollback bundle paths without verifying that the paths existed, so a missing rollback artifact could still return `cutoverReady: true`.
- Remediation:
  - `src/state/dev05-tooling.js` now verifies rollback bundle path existence, emits `rollback_bundle_missing` blockers, and records `needs operator backup` in the cutover report when any required rollback path is missing.
  - `test/dev05-tooling.test.js` now covers the missing-rollback-artifact case.
- Validation:
  - `node --test test/dev05-tooling.test.js`
  - `npm test`
  - `node src/state/dev05-cli.js validate`
  - `node src/state/dev05-cli.js migration-preview`
  - `node src/state/dev05-cli.js cutover-preflight`
  - `node src/state/dev05-cli.js cutover-report`
- Result:
  - validator clean, migration preview empty, cutover preflight ready, rollback bundle complete, operator backup not required.
- Status: done

## 2026-04-22 REV-01 Kickoff

- Scope: final release review gate for the security-cleared cutover-ready standardized harness baseline.
- Entry condition:
  - SEC-01 is closed with the rollback bundle enforcement gap remediated and the full validator / migration / cutover evidence set re-generated cleanly.
- Evidence to review:
  - `reference/artifacts/REVIEW_REPORT.md`
  - `.agents/runtime/reports/CUTOVER_PRECHECK.md`
  - `.agents/runtime/reports/CUTOVER_PRECHECK.json`
  - `.agents/artifacts/CURRENT_STATE.md`
  - `.agents/artifacts/TASK_LIST.md`
  - `.agents/artifacts/PROJECT_PROGRESS.md`
- Status: in progress

## 2026-04-22 REV-01 Finding

- Finding:
  - PMW still hardcodes the DEV-04 packet as the packet/evidence artifact in the overview and contract-artifact list, so the current REV-01 review lane cannot navigate to the active review artifact or the cutover evidence set from the PMW artifact surface.
  - Evidence:
    - `src/pmw/read-surface.js` reads `reference/packets/PKT-01_DEV-04_PMW_READ_SURFACE.md` through the fixed `FILES.packet` entry and reuses it in the project overview and contract artifact list.
    - `src/state/harness-paths.js` still defines `ARTIFACT_PATHS.packet` as the DEV-04 packet path.
  - Risk:
    - PMW correctly shows the active lane as REV-01, but the artifact viewer still directs the operator to stale DEV-04 contract material instead of the active review packet/evidence set.
    - This weakens context continuity at the release approval boundary and can cause the operator to review the wrong evidence from the UI.
- Decision boundary:
  - release-ready approval is withheld until the operator either explicitly accepts this PMW artifact drift for first ship or opens an approved follow-up dev lane to align the PMW artifact/evidence surface with the active review lane.
- Status: resolved

## 2026-04-22 REV-01 Interim Result

- Reviewed scope:
  - validator, migration preview, cutover preflight, cutover report, generated docs parity, PMW first-view UX, and live release truth docs
- Release evidence state:
  - validator clean
  - migration preview empty
  - cutover preflight ready
  - rollback bundle complete
  - PMW first-view UX gate passed
- Release-ready approval:
  - withheld pending explicit acceptance or remediation of the PMW artifact/evidence drift finding above
- Status: superseded

## 2026-04-22 REV-01 Closeout

- Remediation:
  - `src/pmw/read-surface.js` now switches the PMW overview docs and contract artifact list by active lane instead of reusing the hardcoded DEV-04 packet.
  - `REV-01` and `SEC-01` lanes now surface `reference/artifacts/REVIEW_REPORT.md`, `.agents/runtime/reports/CUTOVER_PRECHECK.md`, and `reference/packets/PKT-01_DEV-05_VALIDATOR_MIGRATION_CUTOVER.md` as the active review evidence set.
  - `src/state/harness-paths.js` now exposes explicit PMW / DEV-05 / review artifact keys instead of relying on a single ambiguous packet path in the PMW read surface.
  - `test/pmw-read-surface.test.js` now covers the REV-01 evidence mapping path.
- Validation:
  - `node --test test/pmw-read-surface.test.js`
  - `npm test`
  - `node src/state/dev05-cli.js validate`
  - live PMW read-surface inspection confirmed that the approach docs, progress docs, and contract artifact list now point to the active review evidence set
- Result:
  - no open review finding remains
  - validator is clean
  - PMW artifact/evidence drift is resolved
  - release-ready approval is granted for the current standardized harness baseline
- Status: done

## 2026-04-23 REV-02 Kickoff

- Scope: final standard-harness generalization review for the 2026-04-23 follow-up baseline.
- Entry condition:
  - `PLN-03`, `PLN-04`, `PLN-05`, `DSG-02`, `OPS-02`, `QLT-01`, `OPS-01`, `PRF-01`, `PRF-02`, `PRF-03`, and `TST-03` are closed.
  - `node src/state/dev05-cli.js validate` is clean after the profile-aware validator changes.
- Evidence to review:
  - `.agents/artifacts/REQUIREMENTS.md`
  - `.agents/artifacts/ARCHITECTURE_GUIDE.md`
  - `.agents/artifacts/IMPLEMENTATION_PLAN.md`
  - `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
  - `reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md`
  - `reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md`
  - `reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md`
  - `src/state/drift-validator.js`
  - `test/generated-state-docs.test.js`
- Status: in progress

## 2026-04-23 REV-02 Finding

- Finding:
  - `TST-03` currently verifies that the reusable packet template and optional profile artifacts declare the required evidence markers, but it does not inspect concrete active packet instances for missing core/profile evidence.
  - As implemented, a real task packet can omit fields such as `Active profile reference`, `Domain foundation reference`, `Authoritative source intake reference`, or `Packet exit quality gate reference` and `node src/state/dev05-cli.js validate` will still pass.
- Evidence:
  - `src/state/drift-validator.js` only calls `validateContractMarkers()` for `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md` and `reference/profiles/PRF-*`, so validator scope stops at reusable contract artifacts rather than packet instances.
  - `test/generated-state-docs.test.js` only exercises the new failure path by breaking the packet template and removing a profile artifact; it does not cover a concrete packet missing required evidence.
- Risk:
  - The follow-up baseline claims validator enforcement of active profile/core required evidence, but actual project packet omissions still bypass validation.
  - That means the reusable contracts are cleaner than before, but the enforcement claim is still overstated at the project-execution boundary.
- Decision boundary:
  - `REV-02` cannot close until an approved remediation lane extends validator coverage to concrete active packet evidence, or the user explicitly accepts template-only enforcement for this baseline.
- Status: resolved

## 2026-04-23 REV-02 Remediation

- Remediation:
  - `src/state/drift-validator.js` now inspects `artifact_index` entries with category `task_packet`, parses concrete active packet headers/evidence fields, and fails when declared status and required evidence no longer match.
  - `test/profile-aware-validator-fixtures.js` now provides a concrete packet fixture, and `test/generated-state-docs.test.js` now covers a real registered packet that is missing required evidence.
  - The same validator and test updates are synchronized into `standard-template/src/state/drift-validator.js`, `standard-template/test/profile-aware-validator-fixtures.js`, and `standard-template/test/generated-state-docs.test.js`.
  - The reusable contract documentation now states that validator enforcement covers both reusable packet/profile markers and `task_packet`-registered concrete active packet instances.
- Validation:
  - `node --test test/generated-state-docs.test.js test/dev05-tooling.test.js`
  - `node --test test/generated-state-docs.test.js test/dev05-tooling.test.js` in `standard-template/`
  - `node src/state/dev05-cli.js validate`
- Status: done

## 2026-04-23 REV-02 Closeout

- Result:
  - no open generalization review finding remains
  - validator enforcement now covers reusable contract markers and concrete active packet evidence when the packet is registered in `artifact_index` as category `task_packet`
  - starter template contracts and user guidance match the live baseline
  - the generalized standard harness follow-up baseline is approved as closed
- Status: done

## 2026-04-23 REV-03 Kickoff

- Scope: simulation-remediation closeout review for `SIM-01`, `SIM-02`, and `SIM-03` before a new WBMS project kickoff.
- Entry condition:
  - `SIM-01`, `SIM-02`, and `SIM-03` are closed in the live planning baseline.
  - root and starter validator/test updates are synchronized after the shared-source rebaseline control changes.
- Evidence to review:
  - `.agents/artifacts/REQUIREMENTS.md`
  - `.agents/artifacts/ARCHITECTURE_GUIDE.md`
  - `.agents/artifacts/IMPLEMENTATION_PLAN.md`
  - `reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md`
  - `reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md`
  - `reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md`
  - `src/state/drift-validator.js`
  - `test/generated-state-docs.test.js`
  - `test/dev05-tooling.test.js`
  - `test/pmw-read-surface.test.js`
  - `standard-template/.agents/artifacts/CURRENT_STATE.md`
  - `standard-template/.agents/artifacts/TASK_LIST.md`
- Status: in progress

## 2026-04-23 REV-03 Closeout

- Findings:
  - no open reusable review finding remains
- Review result:
  - `SIM-01` cleanly closes the multi-profile packet-composition gap without forcing project-specific profile combinations into core defaults
  - `SIM-02` closes the packet-registration bypass by combining canonical discovery with continued evidence validation
  - `SIM-03` closes the shared-source rebaseline gap with a separate `AUTHORITATIVE_SOURCE_WAVE_LEDGER` control and validator checks for ledger existence, impacted-packet membership, and packet-disposition parity
  - starter live-state placeholders still remain starter-safe (`not started`, `todo`) and do not leak the current repo's REV-03 lane into new project bootstraps
  - no policy drift was found between live contracts, validator behavior, generated docs, and starter guidance
- Validation:
  - `node --test test/generated-state-docs.test.js test/dev05-tooling.test.js test/pmw-read-surface.test.js`
  - `node --test test/generated-state-docs.test.js test/dev05-tooling.test.js test/pmw-read-surface.test.js` in `standard-template/`
  - `node src/state/dev05-cli.js validate`
- Result:
  - the simulation remediation lane is approved as closed
  - no additional reusable remediation lane is required before a new WBMS project kickoff
  - preserve the current generalized standard harness baseline until a new approved lane opens
- Status: done

## 2026-04-24 REV-04 Kickoff

- Scope: final real-world readiness review for the `DEV-06` standard-template hardening lane.
- Entry condition:
  - launcher/runtime preflight hardening, shipped starter test remediation, starter review/test template hardening, and placeholder-script disposition changes are implemented in both root and starter.
  - root and starter `npm test` runs are green.
- Evidence to review:
  - `reference/packets/PKT-01_DEV-06_STANDARD_TEMPLATE_HARDENING.md`
  - `INIT_STANDARD_HARNESS.cmd`
  - `.agents/scripts/init-project.js`
  - `test/context-restoration-read-model.test.js`
  - `standard-template/reference/artifacts/REVIEW_REPORT.md`
  - `standard-template/reference/artifacts/WALKTHROUGH.md`
- Status: in progress

## 2026-04-24 REV-04 Closeout

- Findings:
  - no open real-world-readiness review finding remains
- Review result:
  - launcher/runtime messaging now matches actual enforcement because both the `.cmd` entrypoint and `npm run harness:init` path fail fast below Node 24
  - root and starter test suites are green again after the read-model tests started seeding the shared profile-aware validator fixtures
  - starter review/test workflows now point at usable shipped templates rather than one-line stubs
  - placeholder-only helper scripts were removed from root and starter after confirming no active code/workflow caller remained
- Validation:
  - `npm test`
  - `npm test` in `standard-template/`
  - `npm run harness:validate` in `standard-template/`
  - `INIT_STANDARD_HARNESS.cmd --help` in root and `standard-template/`
  - `node --version` -> `v24.13.1`
- Result:
  - `DEV-06` is approved as closed
  - `standard-template/` is approved as a real-world-ready copied-project starter surface
  - no additional starter-hardening follow-up lane is required right now
- Status: done
