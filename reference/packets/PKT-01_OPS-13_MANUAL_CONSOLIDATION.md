# PKT-01 OPS-13 Manual Consolidation

## Purpose
- Define packet C from the approved `PLN-13` sequence after `OPS-11` and `OPS-12` closeout.
- Consolidate the operator-facing manual surface so the shipped harness has one clear root authority manual and one concise starter onboarding surface.
- Remove redundant human-facing docs only when copied-project bootstrap, validation, context, review-readiness, and the narrow `OPS-11` existing-repo boundary remain intact.

## Approval Rule
- This packet is written before implementation.
- This packet stays narrow: it defines the reusable manual-consolidation contract only.
- This packet must preserve the `PLN-13` distribution hierarchy:
  - GitHub remains the authority
  - npm remains the main entrypoint
  - `.exe` remains the auxiliary offline Windows channel
- This packet must not reopen bootstrapper redesign from `OPS-11` or payload-contract redesign from `OPS-12`.
- This packet must keep implementation blocked until detailed agreement and `Ready For Code` are both explicitly approved.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-13 manual consolidation | `PLN-13` fixed C as the next concrete follow-up after bootstrapper and payload-contract closeout | approved |
| Ready For Code | approved | implementation must stay inside the approved manual-authority, duplicate-deletion, starter-onboarding, and verification boundary | approved |
| Human sync needed | yes | the user confirmed the root authority, starter entry, duplicate-deletion, and non-scope boundary for detailed agreement, while Ready For Code remains separate | approved |
| Gate profile | contract | this lane changes reusable docs, onboarding, and review-facing shipped manual behavior | approved |
| User-facing impact | medium | this changes what real operators read first after install/bootstrap | approved |
| Layer classification | core | this changes reusable manual/onboarding behavior for the shipped harness | approved |
| Active profile dependencies | none | this is core baseline manual/onboarding work | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| UX archetype status | approved | the existing operator evidence/context archetype is sufficient for manual/onboarding consolidation without a new UI redesign | approved |
| UX deviation status | none | no product UI deviation is being approved here | not-needed |
| Environment topology status | not-needed | no deploy/cutover topology is being redesigned here | not-needed |
| Domain foundation status | not-needed | no schema/domain-model change is included | not-needed |
| Authoritative source intake status | approved | `PLN-13` fixed C as the manual-consolidation lane after bootstrapper and payload-contract closeout | approved |
| Shared-source wave status | not-needed | no multi-packet source-wave rebaseline is required | not-needed |
| Packet exit gate status | pending | closeout depends on authority-manual selection, duplicate deletion boundary, and root/starter verification evidence | pending |
| Improvement promotion status | proposed | this promotes the approved manual-surface planning contract into reusable shipped guidance | proposed |
| Existing system dependency | none | this is harness-only work | not-needed |
| New authoritative source impact | analyzed | no new external authority enters; this is driven by approved `PLN-13`, `OPS-11`, and `OPS-12` evidence | analyzed |
| Risk if started now | medium | deleting or collapsing the wrong docs can make copied-project onboarding less clear even if bootstrap still works | approved |

## 1. Why This Packet Exists
- `OPS-11` made npm entry through a GitHub-backed bootstrapper real, but intentionally did not consolidate the human-facing docs.
- `OPS-12` defined which files stay in shipped starter payload, but intentionally deferred broad manual cleanup and wording hierarchy to packet C.
- The harness still exposes overlapping manual/onboarding surfaces across root and starter:
  - root `README.md`
  - `reference/manuals/HARNESS_MANUAL.md`
  - `standard-template/README.md`
  - `standard-template/HARNESS_MANUAL.md`
  - `standard-template/START_HERE.md`
- `PLN-13` fixed packet C as the place to decide which manual is authoritative, which docs remain starter-facing, and which duplicates should be deleted.

## 2. Goal
- Define the first explicit reusable manual hierarchy for the shipped harness.
- Reduce redundant or overlapping human-facing docs without harming copied-project bootstrap and review-readiness.
- Keep the manual surface narrow enough that bootstrap/runtime behavior remains owned by `OPS-11` and payload classification remains owned by `OPS-12`.

## 3. In Scope
- Define the root human-facing authority manual surface.
- Define the starter human-facing onboarding surface.
- Define which duplicate or overlapping manuals become removable after consolidation.
- Define any `conditional` manual surfaces that remain only when they directly support copied-project bootstrap, review-readiness, or approved operator onboarding.
- Define the verification story for root / `standard-template` sync where reusable docs and onboarding behavior are touched.

## 4. Out Of Scope
- GitHub-backed authority/download/apply/init redesign from `OPS-11`.
- `standard-template/` payload manifest redesign from `OPS-12`.
- Arbitrary existing-project merge/import semantics.
- npm release automation redesign.
- `.exe` channel redesign.

## 4A. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  the shipped harness still exposes multiple overlapping manual/onboarding surfaces, so operators can read the wrong document first or treat duplicate docs as separate authorities.
- 작업 후 사용자가 체감해야 하는 변화:
  after install/bootstrap, operators should see one clear authority manual at root and one concise starter entry surface, while redundant manual surfaces are gone.

## 4B. UX / Interaction Surface
- Screen / surface type:
  Markdown manual and starter onboarding docs
- Primary operator:
  non-specialist operator or maintainer reading the harness after install/bootstrap
- UX archetype reference: existing operator evidence/context archetype
- Selected UX archetype: not-needed
- Archetype fit rationale:
  this lane changes operator reading and onboarding flow rather than product UI behavior
- Archetype deviation / approval:
  none
- 영향받는 화면:
  root docs and shipped starter docs only
- interaction:
  operator reads the root authority manual and starter onboarding docs after bootstrap/apply
- copy/text:
  authority, first-read order, and duplicate-removal boundary must be explicit
- feedback/timing:
  install/bootstrap and first-read onboarding time only
- source trace fallback:
  packet, validation report, and shipped docs remain the trace sources

## 4C. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  reusable manual and onboarding hierarchy belongs in core
- Active profile dependencies:
  none
- Profile-specific evidence status:
  not-needed
- Required reading before code: `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/planning/PLN-13_DISTRIBUTION_CHANNELS_MANUAL_CONSOLIDATION_AND_STARTER_PAYLOAD_RATIONALIZATION_DRAFT.md`, `reference/packets/PKT-01_OPS-11_GITHUB_BACKED_NPM_BOOTSTRAPPER.md`, `reference/packets/PKT-01_OPS-12_TEMPLATE_PAYLOAD_CONTRACT.md`, `README.md`, `reference/manuals/HARNESS_MANUAL.md`, `standard-template/README.md`, `standard-template/START_HERE.md`, `standard-template/reference/manuals/HARNESS_MANUAL.md`
- Security review evidence status:
  not-needed
- Environment topology reference:
  not-needed
- Source environment:
  maintainer repo and shipped starter docs
- Target environment:
  copied-project root docs and starter onboarding docs after bootstrap/apply
- Execution target:
  root docs, starter docs, and reusable onboarding hierarchy
- Transfer boundary:
  root/manual source tree to copied-project docs surface
- Rollback boundary:
  revert only the manual hierarchy and duplicate-deletion changes if copied-project onboarding clarity regresses
- Domain foundation reference:
  not-needed
- Schema impact classification:
  none
- DB / state 영향:
  no schema/state redesign is included; only docs/onboarding surfaces are touched
- Markdown / docs 영향:
  root authority manual, root README positioning, starter `START_HERE.md`, and duplicate manual deletion boundary may change
- generated docs 영향:
  validation/context may reflect a new active packet and later closeout evidence, but no generated-state-doc contract is redesigned here
- validator / cutover 영향:
  validator may later enforce manual-surface parity if this contract becomes reusable baseline behavior
- Authoritative source refs:
  `reference/planning/PLN-13_DISTRIBUTION_CHANNELS_MANUAL_CONSOLIDATION_AND_STARTER_PAYLOAD_RATIONALIZATION_DRAFT.md`; `reference/packets/PKT-01_OPS-11_GITHUB_BACKED_NPM_BOOTSTRAPPER.md`; `reference/packets/PKT-01_OPS-12_TEMPLATE_PAYLOAD_CONTRACT.md`; `README.md`; `reference/manuals/HARNESS_MANUAL.md`; `standard-template/README.md`; `standard-template/START_HERE.md`; `standard-template/reference/manuals/HARNESS_MANUAL.md`
- Authoritative source intake reference: `reference/planning/PLN-13_DISTRIBUTION_CHANNELS_MANUAL_CONSOLIDATION_AND_STARTER_PAYLOAD_RATIONALIZATION_DRAFT.md`, `reference/packets/PKT-01_OPS-11_GITHUB_BACKED_NPM_BOOTSTRAPPER.md`, `reference/packets/PKT-01_OPS-12_TEMPLATE_PAYLOAD_CONTRACT.md`, `README.md`, `reference/manuals/HARNESS_MANUAL.md`
- Authoritative source disposition: approved sequence fixes packet C as the manual-consolidation lane after bootstrapper and payload-contract closeout
- New planning source priority / disposition:
  none
- Existing plan conflict: the current shipped manual surface still overlaps across root and starter and does not yet expose a single clear authority hierarchy
- Current implementation impact: root docs, starter docs, onboarding references, and reusable manual verification/tests
- Required rework / defer rationale:
  defer payload reshaping and installer behavior redesign; packet C only decides the manual surface that remains after those lanes closed
- Impacted packet set scope: single-packet
- Authoritative source wave ledger reference:
  not-needed
- Source wave packet disposition:
  not-needed
- Existing program / DB dependency:
  none
- Existing schema source artifact:
  not-needed
- Table / column naming compatibility:
  not-needed
- Data operation / ownership compatibility:
  not-needed
- Migration / rollback / cutover compatibility:
  no schema/data migration included

## 5. Approved Planning Inputs
- `reference/planning/PLN-13_DISTRIBUTION_CHANNELS_MANUAL_CONSOLIDATION_AND_STARTER_PAYLOAD_RATIONALIZATION_DRAFT.md`
- `reference/packets/PKT-01_OPS-11_GITHUB_BACKED_NPM_BOOTSTRAPPER.md`
- `reference/packets/PKT-01_OPS-12_TEMPLATE_PAYLOAD_CONTRACT.md`
- `README.md`
- `reference/manuals/HARNESS_MANUAL.md`
- `standard-template/README.md`
- `standard-template/START_HERE.md`
- `standard-template/reference/manuals/HARNESS_MANUAL.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`

## 6. Fixed Planning Contract From PLN-13
- GitHub remains the authority for source, `standard-template/` origin, and release tags.
- npm remains the main user entrypoint.
- `.exe` remains the Windows offline / non-developer auxiliary channel.
- Concrete implementation sequence remains:
  1. `A. GitHub-backed npm bootstrapper`
  2. `B. Template payload contract`
  3. `C. Manual consolidation`
- Packet C should define the post-install operator-facing docs after packet B fixed what payload is actually shipped.

## 7. Proposed Detailed Agreement
- `OPS-13` should define the smallest reusable manual contract that makes copied-project onboarding clearer without reopening bootstrap or payload boundaries.
- The first implementation should prefer explicit authority/manual role labeling over broad documentation rewrite.
- The first implementation should classify manual surfaces into:
  - required authority surface
  - conditional onboarding/reference surface
  - removable duplicate surface
- The first implementation should remove overlapping docs only when copied-project bootstrap, validation, context, review-readiness, and first-read clarity stay intact.
- The first implementation should preserve the narrow `OPS-11` existing-repo bootstrap-safe boundary and must not broaden merge/import semantics through documentation promises.
- The first implementation should keep human-facing SSOT Korean-first and operator-oriented while AI-facing runtime/state surfaces remain compact and deterministic elsewhere.

## 7A. Proposed Manual Authority Surface
- Proposed root authority manual:
  - `reference/manuals/HARNESS_MANUAL.md`
- Proposed root entry surface:
  - `README.md`
  - should remain concise and point operators toward the authority manual and install/bootstrap entry
- Proposed starter onboarding surface:
  - `standard-template/START_HERE.md`
- Proposed starter retained reference surface:
  - only the minimum additional doc(s) required to support copied-project onboarding, validation, and review-readiness after packet C decides final wording hierarchy

## 7B. Proposed Duplicate / Deletion Candidate List
- First-pass removable duplicate candidates:
  - `standard-template/HARNESS_MANUAL.md`
  - `standard-template/README.md`
  - any root/starter doc that repeats the same authority/manual instructions without owning a distinct first-read role
- Deletion remains blocked for any document until packet C can explain:
  - which surface now owns the instruction
  - why copied-project onboarding still remains clear
  - why review-readiness and validation guidance remain available

## 7C. Proposed Conditional Manual Criteria
- A manual surface is `conditional` only when all of these are true:
  - the root authority manual and starter `START_HERE.md` remain sufficient without treating it as universal required reading
  - the surface supports a known approved onboarding or review-readiness path rather than duplicating root authority text
  - omission does not break copied-project init, validate, context, test, or review-entry baseline behavior
  - the condition can be stated explicitly enough that packet C can test it
- Expected conditional examples in the first implementation:
  - a starter-side reference surface kept temporarily because it supports copied-project review/test readiness without replacing root authority
  - a maintainer-facing install/reference note that stays until release/manual wording is fully normalized

## 7D. Empty-Folder Vs Existing-Repo Apply Boundary
- Empty new project folder boundary:
  - packet C may assume the full approved starter doc surface can be applied as part of the copied-project bootstrap result
  - manual consolidation should optimize for the clean first-read experience in a fresh copied project
- Existing local repository root boundary:
  - packet C must preserve the narrow `OPS-11` safety rule
  - manual wording must not imply arbitrary merge/import semantics
  - packet C may classify which docs are safe to apply into the narrow existing-repo mode, but must not widen accepted repo shapes or overwrite expectations beyond the approved `OPS-11` bootstrap-safe boundary

## 8. Proposed Implementation Boundary
- Include:
  - root authority manual decision
  - starter onboarding/manual hierarchy decision
  - duplicate/deletion list rules for human-facing docs
  - conditional doc rules tied to copied-project onboarding or review-readiness
  - root / `standard-template` sync where reusable docs/onboarding rules are touched
  - targeted regressions
- Exclude:
  - bootstrapper redesign
  - payload manifest redesign
  - arbitrary existing-project merge/import rules
  - npm publication/release automation redesign
  - `.exe` channel redesign

## 9. Proposed Operator Outcome
- A copied project should expose one clear manual authority and one concise starter entry surface after bootstrap/apply.
- The operator should not need to guess whether root `README.md`, root manual, starter README, starter manual, or starter `START_HERE.md` is the true first-read authority.
- Remaining docs should stay only because:
  - bootstrap/onboarding needs them
  - review-readiness needs them
  - or they are explicitly conditional and traceable

## 10. Verification Direction
- targeted regression for manual authority selection
- targeted regression for duplicate manual removal without onboarding loss
- targeted regression for copied-project onboarding/review-readiness retention
- targeted regression for root / `standard-template` parity where reusable docs or onboarding guidance are shared
- root `node --test .harness/test/*.test.js`
- `standard-template` `node --test .harness/test/*.test.js`
- root `node .harness/runtime/state/dev05-cli.js validate`
- root `node .harness/runtime/state/dev05-cli.js validation-report`
- root `node .harness/runtime/state/dev05-cli.js context`

## Verification Manifest
- Gate profile:
  contract
- Verification manifest:
  - contract: detailed agreement, Ready For Code, root sync, standard-template sync, targeted tests, root test suite, starter test suite, validator, active-context evidence when re-entry state is affected, review closeout
  - targeted regression for manual authority selection
  - targeted regression for duplicate manual removal without onboarding loss
  - targeted regression for copied-project onboarding/review-readiness retention
  - targeted regression for root / `standard-template` parity where reusable docs or onboarding guidance are shared
  - root `node --test .harness/test/*.test.js`
  - `standard-template` `node --test .harness/test/*.test.js`
  - root `node .harness/runtime/state/dev05-cli.js validate`
  - root `node .harness/runtime/state/dev05-cli.js validation-report`
  - root active context: `node .harness/runtime/state/dev05-cli.js context`

## 11. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Open packet C as the next concrete `PLN-13` follow-up | yes | user/planner | approved | packet C opens after `OPS-11` and `OPS-12` closeout under the approved A → B → C sequence |
| Detailed agreement | yes | user/planner | approved | root authority manual, starter first-read surface, required / conditional / removable treatment, duplicate deletion safety, and non-scope boundaries are approved for packet C planning scope |
| Ready For Code | yes | user | approved | implementation may begin inside the approved manual-consolidation boundary while bootstrapper and payload contracts remain closed and out of scope |

## 12. Current Planning Decision
- Detailed agreement: approved
- Ready For Code: approved
- Remaining planner action before implementation opens:
  transition `OPS-13` to `Developer` and keep implementation inside the approved manual-consolidation boundary.

## 13. Implementation Notes
- Keep the authority/duplicate boundary explicit and reusable rather than scattering wording changes across unrelated docs.
- Preserve the `OPS-11` narrow existing-repo boundary exactly; packet C may clarify doc behavior but may not broaden accepted repo shapes.
- Do not let packet C absorb payload-manifest, bootstrapper, release automation, or `.exe` redesign work.

## 14. Verification Plan
- The contract gate is carried by `## Verification Manifest` above.

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference:
  `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata version:
  v1
- Packet exit metadata gate reference:
  `reference/artifacts/PACKET_EXIT_QUALITY_GATE.md`
- Packet exit metadata exit recommendation:
  approve closeout and return to Planner
- Packet exit metadata source parity result:
  pass
- Packet exit metadata validation / security / cleanup evidence:
  root targeted regressions pass; root full suite 78/78 pass; `standard-template` full suite 69/69 pass; `validate`, `validation-report`, and `context` pass; no security-review contract was requested by this packet
- Exit recommendation:
  approve closeout
- Implementation delta summary:
  root authority manual stays at `reference/manuals/HARNESS_MANUAL.md`; starter first-read surface stays at `standard-template/START_HERE.md`; shipped starter retains `standard-template/reference/manuals/HARNESS_MANUAL.md`; duplicate `standard-template/HARNESS_MANUAL.md` is removed; payload/init/runtime/test contracts are synchronized in root and `standard-template`
- Source parity result:
  pass; manual hierarchy, duplicate deletion boundary, and existing-repo safety remain inside the approved `OPS-13` scope
- Refactor / residual debt disposition:
  accept residual debt that live published npm / `npx` install flow remains untested here; keep broader manual wording cleanup and release-surface polish outside `OPS-13`
- UX conformance result:
  pass; operators now have one root authority manual and one concise starter entry surface without duplicate first-read ambiguity
- Topology / schema conformance result:
  not-needed
- Validation / security / cleanup evidence:
  validation pass; context pass; review-readiness preserved; no new security finding or cleanup blocker remains
- Deferred follow-up item:
  none
- Improvement candidate reference:
  reusable root/starter manual hierarchy and duplicate-doc deletion contract
- Proposed target layer:
  core
- Promotion status / linked follow-up item:
  promoted / `OPS-13`
- Closeout notes:
  Reviewer found no blocking issue. The packet stays narrow: no bootstrapper redesign, payload-contract redesign, existing-repo merge/import broadening, npm release automation redesign, or `.exe` redesign entered the implementation.

## 16. Reopen Trigger
- 아래 상황이 생기면 packet을 다시 연다.
- root와 starter에서 authority manual 또는 first-read surface가 다시 중복/충돌하기 시작함
- duplicate 문서 삭제로 copied-project init, validate, context, test, or review-entry baseline guidance가 깨짐
- packet C 승인 없이 existing local repository root에 대한 merge/import promise가 docs를 통해 넓어짐
- root와 `standard-template`의 onboarding/manual guidance가 다시 drift 상태가 됨
