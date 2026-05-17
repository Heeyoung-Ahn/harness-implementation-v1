# PKT-01 OPS-28 Start Here First-Apply Guide Rework

## Purpose
- Rework `standard-template/START_HERE.md` so it matches the real first-use flow for someone applying this harness to a project for the first time.
- Keep the guide narrow: first-use onboarding only, not full operating theory.
- Improve init completion messaging so the operator can immediately see what happened and what to do next.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-28 `START_HERE.md` first-apply guide rework | the current guide still mixes onboarding-critical content with material that belongs later in the manual | approved |
| Ready For Code | approved | the user explicitly requested a narrow doc and launcher-message rework | approved |
| Human sync needed | yes | this changes the shipped first-read operator guide and init completion experience | approved |
| Gate profile | light | the change is limited to starter docs and init completion text | approved |
| User-facing impact | high | this is the first document and first terminal experience new operators see | approved |
| Layer classification | core | `START_HERE.md` and the init launcher are reusable starter surfaces | approved |
| Active profile dependencies | none | no optional profile contract changes are included | not-needed |
| Risk if started now | low | the requested direction is explicit and the scope is narrow | approved |

## 1. Goal
- Make `START_HERE.md` usable as a practical first-read guide for real project bootstrap.
- Show the exact init questions and answer intent in the same wording the terminal uses.
- Separate `new project bootstrap` from `existing project adoption`.
- End the init flow with a clearer next-step summary.

## 2. In Scope
- `standard-template/START_HERE.md`
- root and starter `INIT_STANDARD_HARNESS.cmd`
- root and starter `.agents/scripts/init-project.js`
- packet record for this narrow first-apply rework

## 3. Out Of Scope
- full `HARNESS_MANUAL.md` restructuring
- workflow, validator, or migration contract redesign
- starter payload or installer target-mode redesign
- existing-project migration command semantics

## 4. Required Reading Before Edit
- `.agents/runtime/ACTIVE_CONTEXT.json`
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`
- `standard-template/START_HERE.md`
- `standard-template/reference/manuals/HARNESS_MANUAL.md#19-기존-프로젝트에-적용하기`
- `.agents/scripts/init-project.js`
- `standard-template/.agents/scripts/init-project.js`
- `INIT_STANDARD_HARNESS.cmd`
- `standard-template/INIT_STANDARD_HARNESS.cmd`

## 5. Proposed Change
- Rebuild `START_HERE.md` around only five onboarding concerns:
  - what this harness is
  - what to prepare before starting
  - the exact init prompts and how to answer them
  - how to use the harness in a new project vs an existing project
  - what to do immediately after initialization before handing off to the manual
- Remove or compress material that is not needed during first apply.
- Keep the `Active profiles` section decision-ready by listing all profile ids and short descriptions next to the exact init prompt.
- Make init completion output explicitly say that initialization is done and list immediate next commands/files.

## 6. Verification
- Review `standard-template/START_HERE.md` for the requested five-part structure.
- Review root/starter init script parity.
- Run targeted `init-project` tests.

## 7. Reopen Trigger
- `START_HERE.md` again drifts away from the real bootstrap flow.
- init prompts change without the guide being updated to match the exact labels.
- existing-project bootstrap semantics change in the manual/runtime.
