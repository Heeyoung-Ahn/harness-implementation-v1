# Deploy Workflow

## Purpose
- Execute deployment or cutover only after the required review and validation gates are closed.

## Read First
- `.agents/artifacts/CURRENT_STATE.md`
- `.agents/artifacts/TASK_LIST.md`
- `reference/artifacts/DEPLOYMENT_PLAN.md`

## Do
- confirm deploy gate readiness
- execute only the explicitly approved release path

## Stop When
- review, test, dependency, or human gates remain open
