# PKT-01 PLN-19 Standard-template downstream app readiness rebaseline

## Purpose
- Rebaseline `standard-template` so it works as a clean starter for downstream application projects, not as a copy of this maintainer repository's history.
- Convert the completed audit findings into a bounded planning contract before implementation opens.
- Keep `PLN-17` deferred until this downstream-app readiness lane and its immediate remediation wave are closed.

## Approval Rule
- This packet starts in Planner workflow.
- The user approved the planning direction on 2026-05-14:
  1. process `PLN-19` before returning to `PLN-17`
  2. remove all PMW traces from starter payload, including manual-style documents
  3. prioritize runtime-facing fixture cleanup first, then defer full genericization to `QLT-06`
  4. explicitly make product function and security quality the first test/review criteria, while requiring Tester and Reviewer to check packet and requirements satisfaction
- This packet does not approve implementation until `Ready For Code` is separately approved.

## Detailed Agreement Proposal
- Primary planning direction:
  make `standard-template` downstream-app ready by removing maintainer-repo history, PMW-era traces, stale V1.x release assumptions, hardcoded internal packet references, and test/review criteria that put harness mechanics ahead of product quality.
- Required decision already approved:
  - `PLN-19` runs before `PLN-17`.
  - PMW traces are removed from all shipped starter material, including manuals.
  - Runtime-facing fixtures are cleaned in the first implementation wave; broader full genericization is deferred to `QLT-06`.
  - Test/review workflow must state that product function and security come first.
  - Tester owns evidence that implemented behavior satisfies packet acceptance and requirements acceptance.
  - Reviewer owns final judgment that Tester evidence is sufficient and that changed scope can close without unresolved security, regression, scope, or requirements risk.
- Non-scope:
  - no multi-model ownership contract work
  - no workflow governance redesign beyond wording needed for test/review responsibility
  - no DB schema change
  - no product-specific starter customization

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | PLN-19 Standard-template downstream app readiness rebaseline | audit found shipped starter material still carries maintainer-repo history and PMW-era assumptions | approved |
| Ready For Code | approved | user explicitly approved Ready For Code for the bounded downstream-app readiness remediation wave | approved |
| Human sync needed | yes | this packet changes the starter's downstream-app readiness contract | approved |
| Gate profile | contract | affects reusable starter payload, runtime references, workflow criteria, and test expectations | approved |
| User-facing impact | high | downstream users read these documents and inherit this starter behavior | approved |
| Layer classification | core | the cleanup affects the reusable standard harness starter | approved |
| Active profile dependencies | none | no optional profile is required | not-needed |
| Profile evidence status | not-needed | no profile-specific evidence is required | not-needed |
| UX archetype status | approved | human-facing starter documents must follow the approved artifact-writing rule and stay easy to act on | approved |
| UX deviation status | not-needed | no deviation from the approved human-facing writing rule is proposed | not-needed |
| Environment topology status | not-needed | no deploy/cutover topology is changed | not-needed |
| Domain foundation status | not-needed | no domain/data-impact work is included | not-needed |
| Authoritative source intake status | approved | the standard-template audit and user's four decisions are the authoritative planning source | approved |
| Shared-source wave status | not-needed | this packet records follow-up mapping but does not activate the source-wave ledger contract | not-needed |
| Packet exit gate status | pending | planning and implementation are not complete | pending |
| Existing system dependency | none | no external system or legacy DB dependency is touched | not-needed |
| New authoritative source impact | analyzed | audit findings require a new planning lane before returning to `PLN-17` | analyzed |
| Risk if started now | medium | over-broad cleanup could turn into unrelated starter redesign unless packet boundaries stay strict | approved |

## Lane-Typed Minimum Contract
- Lane-type declaration:
  planning
- Lane-type universal minimum sections:
  Goal; Non-Goal; In Scope; Out Of Scope; Data / Source Impact; Verification Plan; Refactor / residual debt disposition; Packet Exit Quality Gate; Reopen Trigger
- Lane-type required sections:
  Detailed Agreement Proposal; Human Sync / Approval Boundary; Work Decomposition; Verification Manifest; source trace to the standard-template audit findings and the user's four approved decisions
- Lane-type conditional sections:
  runtime/test implementation details are conditional only after separate `Ready For Code` approval
- Lane-type not-needed sections:
  UX archetype, domain foundation, environment topology, existing DB compatibility, release packaging, and optional profile evidence are not needed unless scope changes

## 1. Goal
- Make the installable `standard-template` safe and clear for ordinary application projects.
- Remove root-maintainer history, PMW-era residue, and release-baseline assumptions from project-facing starter material.
- Reframe test and review workflow criteria so product behavior, requirements, packet acceptance, and security come before harness mechanics.

## 2. Non-Goal
- Do not implement the multi-model ownership contract from `PLN-17`.
- Do not redesign workflow routing or approval governance.
- Do not redesign starter bootstrap behavior beyond downstream-app readiness cleanup.
- Do not change DB schema.
- Do not create product-specific starter content.

## 3. User Problem And Expected Outcome
- Current problem:
  `standard-template` still contains material that reads like this maintainer repository's own development history rather than a clean application-project starter.
- Expected outcome:
  a decomposed remediation plan and follow-up packet sequence that makes the starter self-contained, app-project oriented, and free from PMW-era default assumptions.

## 4. In Scope
- project-facing SSOT scrub
- PMW trace removal from all shipped starter materials, including manuals
- runtime/code hardcode audit and remediation plan
- long-term context starter neutralization
- test/review workflow responsibility split
- runtime-facing fixture cleanup first, full fixture genericization later
- root and `standard-template` parity expectations for reusable assets

## 5. Out Of Scope
- `PLN-17` multi-model ownership rules
- full test fixture genericization in the first wave
- workflow governance redesign
- release packaging redesign
- product-specific app customization
- DB schema changes

## 6. Work Decomposition
| Work item | Scope | Impact | Proposed follow-up |
|---|---|---|---|
| Project-facing SSOT scrub | remove root-maintainer history, V1.x baseline wording, and PMW-era starter claims from shipped project artifacts | downstream projects start from neutral project SSOT | `OPS-21_STANDARD_TEMPLATE_PROJECT_SSOT_SCRUB` |
| Runtime history decoupling | remove hardcoded maintainer packet paths and release-history assumptions from reusable runtime-facing code | runtime becomes reusable outside this repo history | `OPS-22_STARTER_RUNTIME_HISTORY_DECOUPLING` |
| Context artifact neutralization | make `DOMAIN_CONTEXT`, `SYSTEM_CONTEXT`, and `PROJECT_HISTORY` starter-neutral with generic examples only | long-term context starts clean for each app project | `OPS-23_CONTEXT_ARTIFACT_STARTER_NEUTRALIZATION` |
| PMW-era artifact purge | remove PMW references from manuals, packet template, reference artifacts, and starter guidance | removed PMW does not leak into new project acceptance | `OPS-24_PMW_ERA_STARTER_ARTIFACT_PURGE` |
| Product-quality workflow rebalance | update test/review criteria so function, requirements, packet acceptance, security, and regression lead the process | Tester and Reviewer responsibilities match real app development | `QLT-05_PROJECT_QUALITY_WORKFLOW_REBALANCE` |
| Runtime-facing fixture cleanup | genericize runtime-facing fixtures that directly encode maintainer work item names | first pass reduces misleading fixture authority | included in `OPS-22` or `QLT-05` as needed |
| Full reusable test genericization | remove broad maintainer-history fixture names across the test suite | lower-noise reusable test corpus | `QLT-06_REUSABLE_HARNESS_TEST_GENERALIZATION` |

## 7. Test / Review Responsibility Decision
- Tester responsibility:
  - verify implemented behavior against product function expectations when product code is affected
  - verify implemented behavior against active packet acceptance
  - verify implemented behavior against `.agents/artifacts/REQUIREMENTS.md`
  - report tested scope, untested scope, regressions, environment gaps, and evidence
  - run harness validation as an additional gate, not as a substitute for product behavior testing
- Reviewer responsibility:
  - judge whether Tester evidence is sufficient
  - review changed scope for defects, regression risk, security/authorization/input/data-exposure risk, and requirements mismatch
  - decide whether the packet can close or must return to Developer
  - confirm residual debt is explicit and not hidden behind passing harness validation

## 8. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  this packet changes the reusable starter contract, not a project-specific application.
- Active profile dependencies: none
- Profile-specific evidence status: not-needed
- Required reading before code: `standard-template` audit findings from 2026-05-14; user's approved four decisions; `.agents/rules/HARNESS_OPERATING_CONTRACT.md`; `standard-template/.agents/workflows/test.md`; `standard-template/.agents/workflows/review.md`; `standard-template/.agents/artifacts/*`; `standard-template/reference/manuals/HARNESS_MANUAL.md`; `standard-template/.harness/runtime/state/*`; `standard-template/.harness/test/*`
- Environment topology reference: not-needed
- Domain foundation reference: not-needed
- UX archetype reference: `.agents/rules/HARNESS_OPERATING_CONTRACT.md`
- Selected UX archetype: human-facing artifact writing rule for starter documents
- Archetype deviation / approval: no deviation; use short, direct operator/project-worker wording
- Schema impact classification: none
- DB / state impact:
  no schema change is approved; planning state and later starter payload edits only.
- Markdown / docs impact:
  likely broad changes to standard-template docs and mirrored root source surfaces in follow-up packets.
- Generated docs impact:
  normal planning state refresh only.
- Validator / cutover impact:
  validator must remain clean; deeper validator redesign is out of scope unless a follow-up packet explicitly approves it.
- Authoritative source refs:
  - standard-template audit findings from 2026-05-14
  - user decision message approving `PLN-19` priority, PMW removal, fixture cleanup staging, and test/review criteria
- Authoritative source intake reference: user-approved standard-template audit disposition in this packet
- Authoritative source wave ledger reference: not-needed
- Source wave packet disposition: not-needed; `PLN-19` records follow-up mapping without activating shared-source ledger governance
- Authoritative source disposition: open `PLN-19` before returning to `PLN-17`
- Existing plan conflict: `PLN-17` was active, but user explicitly reprioritized `PLN-19` first
- Current implementation impact: planning only until `Ready For Code`
- Impacted packet set scope: single planning packet with follow-up mapping to later remediation packets
- Existing program / DB dependency: none

## 9. Acceptance
- `PLN-19` opens as the active planner lane after `PLN-17` is explicitly deferred, not completed.
- The packet records the four approved user decisions.
- The work decomposition separates immediate remediation from deferred full genericization.
- The packet defines Tester and Reviewer responsibility for requirements, packet acceptance, function behavior, and security review.
- Validator and validation-report remain clean after the lane opens.

## 10. Open Questions
- Should `OPS-21` and `OPS-24` be combined because PMW removal is mostly documentation-facing?
- Should `OPS-22` include runtime-facing fixture cleanup, or should all fixture work wait for `QLT-05` / `QLT-06`?

## 11. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| PLN-19 priority over PLN-17 | yes | user | approved | user explicitly approved processing `PLN-19` first |
| Remove PMW traces everywhere | yes | user | approved | includes manuals and manual-like documents |
| Fixture cleanup staging | yes | user | approved | runtime-facing first, full genericization deferred to `QLT-06` |
| Product-quality test/review criteria | yes | user | approved | function/security first; packet and requirements satisfaction are mandatory |
| Detailed agreement | yes | user/planner | approved | this packet records the approved planning direction |
| Ready For Code sign-off | yes | user | approved | implement the bounded downstream-app readiness remediation wave only |
| Packet exit quality gate approval | yes | reviewer | pending | reviewer approval is required before closeout |

## 12. Implementation Notes
- Planning only for now.
- Do not edit starter payload until `Ready For Code` is approved.
- Keep each follow-up narrow enough to avoid broad starter redesign.

## 13. Verification Plan
- Gate profile: contract
- Verification scenario reminder:
  - normal: `PLN-19` opens cleanly as the active planner lane with `PLN-17` deferred
  - error: `PLN-17` is accidentally treated as completed rather than deferred
  - regression: the new lane does not reopen PMW, QLT-04, OPS-18, OPS-20, or PLN-17 implementation scope

## Verification Manifest
- Gate profile:
  - contract: detailed agreement, Ready For Code, root sync if reusable planning assets change, standard-template sync if reusable planning assets change, targeted downstream-app readiness planning checks if reusable planning helpers change, validator, active context evidence, review closeout
- Required evidence:
  - detailed agreement approval
  - Ready For Code approval
  - root validator
  - active context evidence
  - review closeout

## 14. Packet Exit Quality Gate
- Packet exit metadata version: v1
- Packet exit metadata gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata exit recommendation: pending
- Packet exit metadata source parity result: pending
- Packet exit metadata validation / security / cleanup evidence: pending
- Packet exit quality gate reference: `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Exit recommendation: pending
- Implementation delta summary: planning not started
- Source parity result: pending
- Refactor / residual debt disposition: follow-up remediation packets are intentionally decomposed
- UX conformance result: not-needed
- Topology / schema conformance result: not-needed
- Validation / security / cleanup evidence: pending
- Deferred follow-up item: `PLN-17_MULTI_MODEL_OWNERSHIP_AND_CONFLICT_CONTRACT` should reopen after the downstream-app readiness remediation wave closes
- Improvement candidate reference: standard-template audit findings from 2026-05-14
- Proposed target layer: core
- Promotion status / linked follow-up item: approved / `PLN-19_STANDARD_TEMPLATE_DOWNSTREAM_APP_READINESS_REBASELINE`
- Closeout notes: pending

## 15. Ready For Code Approval Text
Ready For Code must be separately approved with wording equivalent to:

```text
Ready For Code is approved for PLN-19 only to implement the bounded standard-template downstream-app readiness remediation wave planning scope. PMW traces must be removed from shipped starter material, runtime-facing maintainer-history fixture cleanup is allowed first, full test genericization is deferred to QLT-06, and test/review workflow wording must put product function, requirements, packet acceptance, and security before harness mechanics. Multi-model ownership, workflow governance redesign, DB schema changes, and product-specific starter customization are out of scope.
```

Ready For Code status:
- approved on 2026-05-14

## 15A. Ready For Code Approval Decision
- Ready For Code is approved for `PLN-19` only for the bounded standard-template downstream-app readiness remediation wave.
- Approved implementation boundary:
  - remove PMW traces from shipped starter material, including manual-style documents
  - scrub project-facing SSOT so downstream apps do not inherit maintainer-repo history
  - remove or neutralize runtime-facing maintainer-history hardcodes and fixtures in the first wave
  - update test/review workflow wording so product function, requirements, packet acceptance, and security are first-class criteria
  - keep full reusable test genericization deferred to `QLT-06`
- Out of scope:
  - `PLN-17` multi-model ownership
  - workflow governance redesign
  - DB schema changes
  - product-specific starter customization
  - broad starter redesign beyond the approved audit findings

## 15B. OPS-21 Slice Implementation Evidence
- Slice:
  project-facing SSOT scrub.
- Implemented:
  - removed V1.2 / PMW-era starter assumptions from `standard-template/.agents/artifacts/CURRENT_STATE.md`, `TASK_LIST.md`, `PROJECT_PROGRESS.md`, `REQUIREMENTS.md`, and `IMPLEMENTATION_PLAN.md`
  - replaced maintainer-specific `PROJECT_HISTORY.md` examples with generic application-project history examples
  - removed root-maintainer-only README references from `standard-template/README.md`
  - removed PMW-era wording from reusable packet/layout/closeout/source-wave references and mirrored required reusable reference changes in root
- Tested:
  - root targeted `init-project` / `dev05-tooling` tests
  - `standard-template` targeted `init-project` / `dev05-tooling` tests
  - project-facing starter docs PMW / maintainer-history scan, excluding generated validation version metadata
  - reusable reference parity for packet template and repository layout ownership
  - root validator and validation report
- Result:
  first downstream-app readiness slice passed testing and review; remaining PLN-19 work continues.

## 15C. OPS-22 Slice Implementation Evidence
- Slice:
  starter runtime history decoupling.
- Implemented:
  - replaced runtime default packet references with the reusable work-item packet template path instead of maintainer packet IDs
  - changed the copied-starter package default from the maintainer repository name to `standard-harness-starter`
  - neutralized release-baseline wording so reusable runtime no longer names the historical PMW / DEV-11 baseline as the starter contract
  - replaced the PMW-specific release-artifact warning and migration fixture paths with generic deprecated operator-console / legacy read-surface wording
  - removed PMW log ignores from root and `standard-template`
  - mirrored runtime and runtime-facing test updates in root and `standard-template`
- Tested:
  - root targeted `active-context` / `dev05-tooling` / `generated-state-docs` tests: pass
  - `standard-template` targeted `active-context` / `dev05-tooling` / `generated-state-docs` tests: pass
  - root official `npm.cmd test`: pass
  - `standard-template` official `npm.cmd test`: pass
  - root `harness:validate` and `harness:validation-report`: pass
  - `standard-template` `harness:validate` and `harness:validation-report`: pass
  - runtime-facing PMW / maintainer-history scan: no hits in touched runtime/test surfaces; the only remaining starter hit is generated `ACTIVE_CONTEXT.json` recording the current local `repoRoot`, which is regenerated by `harness:init` / `harness:context` and is not manual write authority
- Review result:
  OPS-22 slice is within the approved PLN-19 boundary. No DB schema, workflow governance redesign, PLN-17 work, product-specific starter customization, or QLT-06 full genericization was introduced.
- Residual debt:
  `QLT-06_REUSABLE_HARNESS_TEST_GENERALIZATION` still owns broad non-runtime fixture genericization.
  `OPS-23` / `OPS-24` still own context-artifact neutralization and remaining PMW-era starter artifact purge.

## 16. Reopen Trigger
- PMW traces are intentionally retained in shipped starter material.
- The packet starts implementing `PLN-17` ownership rules.
- The cleanup expands into product-specific starter content.
- Test/review criteria make harness validation a substitute for product function or security review.
