# Project Progress

## Summary
This board is the canonical whole-project tracker for the standardized harness build. PMW reads this file directly to show the overall execution table.

## Progress Board
| Phase | Task ID | Task | Status | Notes | Source |
| --- | --- | --- | --- | --- | --- |
| Planning | PLN-00 | Deep interview | done | Requirements-critical decisions are closed. | reference/planning/PLN-00_DEEP_INTERVIEW.md |
| Planning | PLN-01 | Requirements freeze | done | Requirements baseline is frozen and synced downstream. | .agents/artifacts/REQUIREMENTS.md |
| Planning | PLN-02 | Architecture / implementation / UI sync | done | Standardized artifact structure is now the active operating shape. | .agents/artifacts/ARCHITECTURE_GUIDE.md |
| Design | DSG-01 | Rough mockup / global behavior contract | done | PMW mockup and read-only behavior contract are locked. | reference/mockups/dev-04-pmw-read-surface-mockup.html |
| Packet | PKT-01 | Work item packet framework | done | Standard packet template and packet lane are in use. | reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md |
| Build | DEV-01 | DB foundation | done | Repo-local SQLite store and schema are running. | reference/packets/PKT-01_DEV-01_DB_FOUNDATION.md |
| Build | DEV-02 | Generated state docs and drift validator | done | Deterministic generation and drift validation are running. | reference/packets/PKT-01_DEV-02_GENERATED_STATE_DOCS.md |
| Build | DEV-03 | Context restoration read model | done | Context restoration is built from designated summary sources. | reference/packets/PKT-01_DEV-03_CONTEXT_RESTORATION_READ_MODEL.md |
| Build | DEV-04 | PMW read surface | done | Standardized PMW read-only surface is browser-verified. | reference/packets/PKT-01_DEV-04_PMW_READ_SURFACE.md |
| Build | DEV-05 | Validator / migration / cutover tooling | in_progress | Validate, migration preview/apply, cutover preflight, and cutover report are implemented; keep them aligned with future structure changes. | reference/packets/PKT-01_DEV-05_VALIDATOR_MIGRATION_CUTOVER.md |
| Ops | OPS-01 | Self-improvement promotion workflow | todo | Promotion workflow is deferred until current release tooling closes. | .agents/artifacts/IMPLEMENTATION_PLAN.md |
| Quality | QLT-01 | Per-packet refactor checkpoint | todo | Formalize the recurring refactor lane after DEV-05 closes. | .agents/artifacts/IMPLEMENTATION_PLAN.md |
| Security | SEC-01 | Security review and remediation | todo | Run the release-bound security lane before cutover. | .agents/artifacts/IMPLEMENTATION_PLAN.md |
| Test | TST-01 | Generated docs parity | in_progress | Automated parity coverage exists and must stay green. | .agents/artifacts/IMPLEMENTATION_PLAN.md |
| Test | TST-02 | PMW browser UX / 30-second comprehension check | partial | DEV-04 browser verification passed; final release-gate UX check remains. | reference/packets/PKT-01_DEV-04_PMW_READ_SURFACE.md |
| Review | REV-01 | Architecture / review gate | todo | Final review gate opens after DEV-05 stabilizes. | .agents/artifacts/IMPLEMENTATION_PLAN.md |
