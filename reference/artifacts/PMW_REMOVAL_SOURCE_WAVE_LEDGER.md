# PMW Removal Source Wave Ledger

This ledger records the 2026-05-03 authoritative source wave that replaces the active PMW extension path with complete PMW removal and CLI-first active context.

## Approval Rule
- One authoritative source change affects multiple planning and packet artifacts, so this is tracked as a shared-source wave.
- The wave is approved for packet citation only after every affected active packet is listed and given an explicit disposition.
- Closed historical packets remain evidence, but they must not continue to drive active implementation.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Source wave name | PMW removal and CLI-first rebaseline | User approved full PMW removal and AI/human SSOT split | approved |
| Intake reference | `reference/planning/PLN-09_CLI_FIRST_REBASELINE_AND_PMW_DECOMMISSION_DRAFT.md` | PLN-09 records the source intake and evaluation disposition | approved |
| Impacted packet scope | multi-packet | PLN-08, DEV-10, closed PMW packets, and DEV-11 are affected | approved |
| Rebaseline recommendation | selective-adjust | Supersede active PMW extension work; keep closed PMW work as history | approved |
| Ready for packet citation | approve | DEV-11 can cite this ledger for shared-source wave disposition | approved |

## 1. Source Wave Summary
- Source wave trigger: user direction on 2026-05-03 to remove PMW completely and remove PMW-only maintenance procedures.
- Intake reference: `reference/planning/PLN-09_CLI_FIRST_REBASELINE_AND_PMW_DECOMMISSION_DRAFT.md`
- Prior baseline snapshot: `PLN-08` / `DEV-10` extended PMW phase-2 command and usability work.
- New source snapshot: `DEV-11` removes PMW from the active baseline and replaces PMW read-model/export with CLI-first active context.
- Why this is a shared-source wave: the change supersedes an active planning lane, an implementation packet draft, and several closed PMW evidence packets while preserving history.

## 2. Baseline And Release Impact
- Requirements impact: PMW is no longer an active required harness surface; AI-facing and human-facing SSOT responsibilities must be explicit.
- Architecture impact: PMW read-model, PMW app, PMW registry, PMW export, and PMW package hooks are removed from active architecture.
- Implementation plan impact: Developer target shifts from DEV-10 PMW extension to DEV-11 PMW decommission and active context.
- Release or milestone impact: release/starter payload must validate without PMW.
- Generated docs / PMW impact: generated docs must be regenerated through harness paths after canonical state changes; PMW generated surfaces are removed from active closeout.

## 3. Freeze / Continue Boundary
- Packets that must stop and reopen: `reference/planning/PLN-08_PMW_V1_3_PHASE_2_COMMAND_SURFACE_DRAFT.md`, `reference/packets/PKT-01_DEV-10_PMW_PHASE_2_DOCTOR_PROMOTION_AND_USABILITY_REMEDIATION.md`
- Packets that may continue after adjustment: `reference/packets/PKT-01_DEV-11_CLI_FIRST_PMW_DECOMMISSION_AND_ACTIVE_CONTEXT.md`
- Work that must not proceed until rebaseline closes: DEV-10 PMW implementation, PMW command promotion, PMW usability remediation, PMW app tests as closeout evidence.
- Why this boundary is safe: closed PMW packets remain historical evidence, while active implementation moves to a PMW-free baseline.

## 4. Impacted Packet Set
| Packet path | Prior source snapshot | Required action | Rebaseline status | Notes |
|---|---|---|---|---|
| reference/planning/PLN-08_PMW_V1_3_PHASE_2_COMMAND_SURFACE_DRAFT.md | PMW phase-2 command surface | supersede | approved | Do not implement unless user opens a new PMW revival lane. |
| reference/packets/PKT-01_DEV-10_PMW_PHASE_2_DOCTOR_PROMOTION_AND_USABILITY_REMEDIATION.md | PMW doctor promotion and usability remediation | supersede | approved | Historical draft only. |
| reference/packets/PKT-01_DEV-07_PMW_V1_3_OPERATOR_CONSOLE_FIRST_VIEW.md | closed PMW first-view implementation | preserve-history | approved | Historical evidence only. |
| reference/packets/PKT-01_DEV-08_WORKFLOW_CONTRACTS_AND_HANDOFF_ROUTING.md | closed workflow/PMW routing implementation | preserve-history | approved | Keep non-PMW workflow lessons where still valid. |
| reference/packets/PKT-01_DEV-09_PMW_PHASE_1_COMMAND_LAUNCHER_AND_HANDOFF_EXECUTION.md | closed PMW command launcher implementation | preserve-history | approved | Historical evidence only. |
| reference/packets/PKT-01_DEV-11_CLI_FIRST_PMW_DECOMMISSION_AND_ACTIVE_CONTEXT.md | new PMW-free implementation packet | continue | approved | New active implementation packet draft; Ready For Code pending. |

## 5. Rebaseline Exit Criteria
- Every affected packet is listed in the impacted packet set.
- Each packet has an explicit required action and rebaseline status.
- No packet continues on stale PMW-extension assumptions after the wave is approved.
- Packet-level disposition matches the corresponding impacted packet row.

## 6. Human Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Shared-source wave identified correctly | yes | user/planner | approved-direction | PMW removal affects multiple packets. |
| Impacted packet set complete | yes | planner | approved | Active PMW extension packets and closed PMW evidence are listed. |
| Rebaseline strategy approved | yes | user/planner | approved-direction | Supersede active PMW work; continue with DEV-11 after Ready For Code. |

## 7. Open Questions
- None for source-wave disposition.
- DEV-11 Ready For Code remains a separate approval boundary.

## 8. Packet Citation Rule
- Impacted packets cite this ledger as Authoritative source wave ledger reference.
- multi-packet source wave packet은 `Impacted packet set scope`, `Authoritative source wave ledger reference`, `Source wave packet disposition`을 함께 남긴다.
- packet의 cited disposition은 impacted packet row의 `Required action`과 운영적으로 모순되지 않아야 한다.
