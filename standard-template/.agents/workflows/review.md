# Review Workflow

## Purpose
- Look for defects, regressions, policy drift, and release risk.

## Read First
- `.agents/artifacts/CURRENT_STATE.md`
- `.agents/artifacts/TASK_LIST.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- `reference/artifacts/REVIEW_REPORT.md`

## Do
- review the changed scope
- verify packet closeout evidence covers source parity, residual debt, UX/topology conformance, and cleanup/security status
- separate reviewed-scope approval from release-ready approval

## Stop When
- remediation would change product behavior without an approved dev lane
