# PLN-20 Maintainer / starter boundary and payload separation draft

## Purpose
- Define the next planning lane that separates installable starter payload concerns from maintainer-repo-only release, sync, and audit logic.
- Convert the 2026-05-15 evaluation follow-up into a bounded planning draft before runtime, validator, payload, or release-path implementation opens.
- Keep `PLN-17`, explicit `PREVENTIVE_MEMORY` trigger formalization, and Lite/Standard onboarding UX cleanup deferred until this boundary-setting lane is settled.

## User-Approved Priority
- The user approved the next-lane priority on 2026-05-15:
  1. maintainer / starter separation first
  2. explicit `PREVENTIVE_MEMORY` trigger contract later
  3. Lite / Standard onboarding UX cleanup after that

## Draft Planning Direction
- Primary planning direction:
  define which reusable files must stay in shipped starter payload, which maintainer-aware release/sync logic must move behind maintainer-only boundaries or conditional checks, and which mixed surfaces need wording-only clarification versus runtime/payload separation.
- Non-scope at this draft stage:
  - no runtime implementation yet
  - no release packaging implementation yet
  - no `PREVENTIVE_MEMORY` contract rewrite yet
  - no Lite / Standard onboarding rewrite yet
  - no DB schema change

## Candidate Separation Matrix
| Mixed surface | Current issue | Planning question | Candidate follow-up |
|---|---|---|---|
| starter-shipped `ACTIVE_CONTEXT.*` | pre-init placeholder can expose template repo paths | should shipped starter keep placeholder output, regenerate-on-init only, or exclude generated context from payload? | first implementation slice candidate |
| `release-baseline.js` | names installer / `.exe` / packaging paths and closed maintainer release wording | should release-baseline logic split into maintainer-only and shipped-starter variants, or stay shared behind repo-shape detection? | first implementation slice candidate |
| `dev05-tooling.js` security/release path inventory | checks maintainer release artifacts and nested starter paths | should shipped starter use a smaller path inventory while maintainer repo keeps the broader audit set? | first implementation slice candidate |
| `drift-validator.js` starter sync / release checks | root/starter sync and maintainer release checks assume maintainer repo layout | which checks are maintainer-only, which are starter-safe, and what conditional contract should decide them? | first implementation slice candidate |
| `REPOSITORY_LAYOUT_OWNERSHIP.md` and maintainer wording | useful for maintainers but too dense for downstream operators | should this stay root-only, stay shared, or move behind maintainer-only references? | follow-up doc slice |
| reusable tests with maintainer fixtures | some tests intentionally cover maintainer repo behavior while starter tests should stay project-facing | should test corpus split into maintainer-only and shipped reusable suites, or stay unified with conditional fixtures? | later quality slice |
| onboarding docs (`README.md`, `START_HERE.md`, manual) | wording now improved, but entry flow still does not fully expose boundary distinctions | what minimal onboarding change is needed after runtime separation lands? | later onboarding slice |

## Source Trace
- `standard-template/.agents/runtime/ACTIVE_CONTEXT.json`
- `.harness/runtime/state/release-baseline.js`
- `.harness/runtime/state/dev05-tooling.js`
- `.harness/runtime/state/drift-validator.js`
- `reference/artifacts/REPOSITORY_LAYOUT_OWNERSHIP.md`
- `README.md`
- `standard-template/README.md`
- `reference/packets/PKT-01_OPS-25_HARNESS_MANUAL_RECENT_WORK_RECONCILIATION.md`

## Expected Packetization
- When `OPS-25` closes and this lane becomes active, convert this draft into a concrete packet under `reference/packets/`.
- Keep implementation blocked until detailed agreement and `Ready For Code` are explicitly approved.
