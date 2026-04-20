# Standard Harness Template Report

## Purpose

This report defines the standardized harness starter produced from this repository.

It preserves the current project harness as the working implementation baseline and creates a separate starter under `standard-template/` for:

- greenfield copy-paste adoption
- brownfield migration into similar ongoing projects

## Confirmed Decisions

- The current project harness stays in place.
- The standardized starter lives in `standard-template/`.
- `AGENTS.md` and `.agents/rules/workspace.md` are constitutional entry documents only.
- Live operational artifacts and generated state docs must stay separate.
- Non-core artifact documents belong under `standard-template/reference/`.
- The reference repository remains untouched.

## Implemented Starter Layout

```text
standard-template/
├── AGENTS.md
├── PROJECT_WORKFLOW_MANUAL.md
├── .agents/
│   ├── rules/
│   │   └── workspace.md
│   ├── artifacts/
│   │   ├── REQUIREMENTS.md
│   │   ├── ARCHITECTURE_GUIDE.md
│   │   ├── IMPLEMENTATION_PLAN.md
│   │   ├── CURRENT_STATE.md
│   │   ├── TASK_LIST.md
│   │   └── PREVENTIVE_MEMORY.md
│   ├── workflows/
│   │   ├── plan.md
│   │   ├── design.md
│   │   ├── dev.md
│   │   ├── test.md
│   │   ├── review.md
│   │   ├── deploy.md
│   │   ├── docu.md
│   │   └── handoff.md
│   ├── skills/
│   │   ├── code_review_checklist/
│   │   ├── conflict_resolver/
│   │   ├── day_start/
│   │   ├── day_wrap_up/
│   │   ├── korean-artifact-utf8-guard/
│   │   ├── requirements_deep_interview/
│   │   └── version_closeout/
│   ├── runtime/
│   │   ├── team.json
│   │   ├── governance_controls.json
│   │   ├── health_snapshot.json
│   │   ├── operating_state.schema.json
│   │   └── generated-state-docs/
│   │       ├── CURRENT_STATE.md
│   │       └── TASK_LIST.md
│   └── scripts/
│       ├── bootstrap_operating_state.ps1
│       ├── generate_state_docs.ps1
│       ├── check_harness_docs.ps1
│       └── reset_version_artifacts.ps1
├── templates/
│   └── version_reset/
│       └── artifacts/
│           ├── CURRENT_STATE.md
│           ├── TASK_LIST.md
│           └── PREVENTIVE_MEMORY.md
└── reference/
    ├── README.md
    ├── artifacts/
    │   ├── UI_DESIGN.md
    │   ├── SYSTEM_CONTEXT.md
    │   ├── DOMAIN_CONTEXT.md
    │   ├── DECISION_LOG.md
    │   ├── REVIEW_REPORT.md
    │   ├── DEPLOYMENT_PLAN.md
    │   ├── WALKTHROUGH.md
    │   ├── PROJECT_HISTORY.md
    │   ├── HANDOFF_ARCHIVE.md
    │   └── daily/
    │       ├── README.md
    │       └── TEMPLATE.md
    └── skills/
        ├── dependency_audit/
        ├── feature-artifact-sync/
        ├── frontend_design/
        ├── general_publish/
        ├── github_deploy/
        └── operating-common-rollout/
```

## Constitutional Entry Documents

### `AGENTS.md`

Role:

- Codex entry point
- short boot sequence only
- no heavy tutorial or project-specific narrative

Load order:

1. `.agents/rules/workspace.md`
2. `.agents/artifacts/CURRENT_STATE.md`
3. `.agents/artifacts/TASK_LIST.md`
4. the matching workflow for the requested lane
5. only the additional artifacts required by the active task

### `.agents/rules/workspace.md`

Role:

- Antigravity entry point
- stable constitutional rule set
- truth ownership and workflow entry contract

## Artifact Tiers

### Core artifacts

These are the default live starter truth and are required from day zero.

- `REQUIREMENTS.md`
- `ARCHITECTURE_GUIDE.md`
- `IMPLEMENTATION_PLAN.md`
- `CURRENT_STATE.md`
- `TASK_LIST.md`
- `PREVENTIVE_MEMORY.md`

### Reference artifacts

These are useful, but not all projects need them immediately.
They are intentionally kept out of `.agents/artifacts/` and placed in `reference/artifacts/`.

- `UI_DESIGN.md`
- `SYSTEM_CONTEXT.md`
- `DOMAIN_CONTEXT.md`
- `DECISION_LOG.md`
- `REVIEW_REPORT.md`
- `DEPLOYMENT_PLAN.md`
- `WALKTHROUGH.md`
- `PROJECT_HISTORY.md`
- `HANDOFF_ARCHIVE.md`
- `daily/*`

### Generated docs

These are derived output, not live truth.

- `.agents/runtime/generated-state-docs/CURRENT_STATE.md`
- `.agents/runtime/generated-state-docs/TASK_LIST.md`

## Why The Split Matters

The current repository uses root `CURRENT_STATE.md` and `TASK_LIST.md` as generated docs, while the standardized starter uses `.agents/artifacts/CURRENT_STATE.md` and `.agents/artifacts/TASK_LIST.md` as live operational artifacts.

Keeping those meanings separate avoids:

- broken handoff assumptions
- accidental editing of generated output
- confusion between execution truth and derived summary

## Current Repository To Starter Mapping

### Direct carry-over into core starter

| Current source | Starter target |
|---|---|
| `REQUIREMENTS.md` | `.agents/artifacts/REQUIREMENTS.md` |
| `ARCHITECTURE_GUIDE.md` | `.agents/artifacts/ARCHITECTURE_GUIDE.md` |
| `IMPLEMENTATION_PLAN.md` | `.agents/artifacts/IMPLEMENTATION_PLAN.md` |
| `codex/project-context/active-state.md` | `.agents/artifacts/CURRENT_STATE.md` |
| `codex/project-context/preventive-memory.md` | `.agents/artifacts/PREVENTIVE_MEMORY.md` |
| `codex/skills/day-start/SKILL.md` | `.agents/skills/day_start/SKILL.md` |
| `codex/skills/day-end/SKILL.md` | `.agents/skills/day_wrap_up/SKILL.md` |
| `src/state/operating_state.schema.json` | `.agents/runtime/operating_state.schema.json` |
| root `CURRENT_STATE.md` | `.agents/runtime/generated-state-docs/CURRENT_STATE.md` |
| root `TASK_LIST.md` | `.agents/runtime/generated-state-docs/TASK_LIST.md` |

### Move into reference layer

| Current source | Starter reference target |
|---|---|
| `UI_DESIGN.md` | `reference/artifacts/UI_DESIGN.md` |
| `codex/project-context/durable-context.md` | `reference/artifacts/SYSTEM_CONTEXT.md` and `reference/artifacts/DOMAIN_CONTEXT.md` |
| `codex/project-context/restart-handoff-2026-04-19.md` | `reference/artifacts/HANDOFF_ARCHIVE.md` |
| `codex/project-context/daily/*` | `reference/artifacts/daily/*` |
| optional deployment/release/review skills and patterns | `reference/skills/*` |

## Workflow Topology

The starter keeps the reference-compatible workflow file names but uses a leaner operating model.

| Workflow | Responsibility |
|---|---|
| `plan` | requirements, architecture, implementation contract |
| `design` | UI and operator-facing design only when needed |
| `dev` | implementation within approved scope |
| `test` | verification evidence and checks |
| `review` | defects, regressions, release risk |
| `deploy` | deployment or cutover execution |
| `docu` | closeout, reset, archive hygiene |
| `handoff` | transfer of execution context |

## Skill Policy

### Core skills included in the starter

- `day_start`
- `day_wrap_up`
- `requirements_deep_interview`
- `conflict_resolver`
- `code_review_checklist`
- `version_closeout`
- `korean-artifact-utf8-guard`

### Optional skills moved into reference

- `dependency_audit`
- `feature-artifact-sync`
- `operating-common-rollout`
- `frontend_design`
- `general_publish`
- `github_deploy`

## Runtime Extraction Status

The starter now contains runtime placeholders and contract files, but the current implementation code under `src/state/*` and `src/pmw/*` is still not packaged as a copy-paste-safe reusable runtime.

Current blockers:

- current PMW code still hardcodes current-repository paths
- generated-doc lookup still assumes current naming and placement
- product-specific packet/doc paths are still embedded in the code

This means the starter is structurally ready, but runtime extraction remains a later implementation lane.

## Greenfield Use

1. Copy the contents of `standard-template/` into a new project root.
2. Keep the constitutional files intact.
3. Fill the core artifacts first.
4. Pull in `reference/` materials only when the project actually needs them.

## Brownfield Migration Use

1. Inventory the current truth files, workflows, skills, and generated docs.
2. Freeze semantics before moving files.
3. Introduce the constitutional files first.
4. Map live truth into `.agents/artifacts/`.
5. Move non-core documents into `reference/` until they are really active.
6. Move generated docs into `.agents/runtime/generated-state-docs/`.
7. Add optional skills only when the project genuinely needs them.

## Result

The standardized starter now exists as a real skeleton under `standard-template/`, with:

- a constitutional entry layer
- a core live-truth layer
- a reference layer for non-core documents
- a core workflow set
- a core skill set
- optional skills separated into reference
- runtime and reset placeholders for later extraction work
