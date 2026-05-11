# PKT-01 OPS-12 Template Payload Contract

## Purpose
- Define packet B from the approved `PLN-13` sequence after `OPS-11` closeout.
- Decide which files truly belong in the shipped `standard-template/` payload for copied-project bootstrap.
- Fix the deletion boundary so starter clutter can be removed without broadening into manual-consolidation or release-automation redesign.

## Approval Rule
- This packet is written before implementation.
- This packet stays narrow: it defines the reusable `standard-template/` payload contract only.
- This packet must preserve the `PLN-13` distribution hierarchy:
  - GitHub remains the authority
  - npm remains the main entrypoint
  - `.exe` remains the auxiliary offline Windows channel
- This packet must not broaden into manual consolidation; packet C owns that work.
- This packet must keep implementation blocked until detailed agreement and `Ready For Code` are both explicitly approved.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-12 template payload contract | `PLN-13` fixed B as the next concrete follow-up after `OPS-11` bootstrapper closeout | approved |
| Ready For Code | approved | implementation may begin inside the approved payload manifest, deletion-boundary, copied-project bootstrap, and narrow existing-repo safety boundary | approved |
| Human sync needed | yes | the user confirmed which files remain required bootstrap payload versus removable clutter before implementation opened | approved |
| Gate profile | contract | this lane changes reusable starter payload and copied-project bootstrap behavior | approved |
| User-facing impact | medium | this changes what files operators receive in shipped starter payloads | approved |
| Layer classification | core | this changes reusable distribution and starter payload behavior | approved |
| Active profile dependencies | none | this is core baseline packaging/payload work | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| UX archetype status | approved | the existing operator evidence/context archetype is sufficient for this starter payload and copied-project bootstrap surface | approved |
| UX deviation status | none | no product UI deviation is being approved here | not-needed |
| Environment topology status | not-needed | no deploy/cutover topology is being redesigned here | not-needed |
| Domain foundation status | not-needed | no schema/domain-model change is included | not-needed |
| Authoritative source intake status | approved | `PLN-13` fixed B as the payload-contract lane after the bootstrapper | approved |
| Shared-source wave status | not-needed | no multi-packet source-wave rebaseline is required | not-needed |
| Packet exit gate status | approved | closeout evidence confirms payload manifest, deletion boundary, sync, and verification results | approved |
| Improvement promotion status | approved | the approved payload-boundary planning contract is now promoted into reusable starter rules | approved |
| Existing system dependency | none | this is harness-only work | not-needed |
| New authoritative source impact | analyzed | no new external authority enters; this is driven by approved `PLN-13` planning evidence and `OPS-11` closeout | analyzed |
| Risk if started now | medium | deleting too much or keeping too much can either break bootstrap safety or preserve shipped clutter | approved |

## 1. Why This Packet Exists
- `OPS-11` made npm entry through a GitHub-backed bootstrapper real, but it intentionally did not redefine which exact files belong in `standard-template/`.
- `PLN-13` fixed packet B as the next concrete lane because payload pruning and copied-project contract decisions are separate from bootstrap authority/download behavior.
- The starter still contains payload surfaces that are likely not part of the final copied-project contract:
  - `.harness/operating_state.sqlite`
  - `.agents/runtime/generated-state-docs/*`
  - placeholder or empty review/test artifacts
  - overlapping manual/onboarding surfaces that packet C will later consolidate

## 2. Goal
- Define the first explicit reusable payload manifest for `standard-template/`.
- Separate required bootstrap payload from removable generated/runtime/history clutter.
- Keep the copied-project contract narrow enough that existing bootstrap behavior stays safe and packet C can still own manual consolidation.

## 3. In Scope
- Define which files/directories are required starter payload.
- Define which generated/runtime/history files must be deleted from shipped starter payload.
- Define any `conditional` payload surfaces that remain only when they directly support copied-project bootstrap.
- Define the verification story for root / `standard-template` sync where payload rules affect reusable bootstrap behavior.

## 4. Out Of Scope
- GitHub-backed authority/download behavior redesign from `OPS-11`.
- Broad manual consolidation and wording cleanup across all docs.
- `.exe` channel redesign.
- Hosted CI / release automation redesign.
- Generic project merge/import semantics for arbitrary existing repos.

## 4A. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  `standard-template/` still mixes true bootstrap payload with generated/runtime/history surfaces, so copied-project payload is heavier and less explainable than it should be.
- 작업 후 사용자가 체감해야 하는 변화:
  the shipped starter should contain only the files that a copied project actually needs to bootstrap and operate, with removable clutter explicitly excluded.

## 4B. UX / Interaction Surface
- Screen / surface type:
  shipped starter payload and install-time/copied-project file surface
- Primary operator:
  non-specialist operator or maintainer receiving a starter payload
- UX archetype reference: not-needed
- Selected UX archetype: not-needed
- Archetype fit rationale:
  this lane changes payload composition rather than product UI behavior
- Archetype deviation / approval:
  none
- 영향받는 화면:
  copied-project file tree and starter onboarding surface only
- interaction:
  operator receives a cleaner starter payload after bootstrap/apply
- copy/text:
  packet C will own final wording cleanup; this lane should only preserve the files required to support that later surface
- feedback/timing:
  bootstrap/apply and copied-project inspection time only
- source trace fallback:
  packet, validation report, and copied-project payload rules remain the trace sources

## 4C. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  reusable starter payload composition belongs in core
- Active profile dependencies:
  none
- Profile-specific evidence status:
  not-needed
- Required reading before code: `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/planning/PLN-13_DISTRIBUTION_CHANNELS_MANUAL_CONSOLIDATION_AND_STARTER_PAYLOAD_RATIONALIZATION_DRAFT.md`, `reference/packets/PKT-01_OPS-11_GITHUB_BACKED_NPM_BOOTSTRAPPER.md`, `README.md`, `standard-template/README.md`, `standard-template/START_HERE.md`, `reference/manuals/HARNESS_MANUAL.md`, `standard-template/HARNESS_MANUAL.md`
- Security review evidence status:
  not-needed
- Environment topology reference:
  not-needed
- Source environment:
  maintainer repo and shipped `standard-template/` payload
- Target environment:
  copied-project starter payload after bootstrap/apply
- Execution target:
  starter payload manifest, deletion boundary, and copied-project contract
- Transfer boundary:
  `standard-template/` source tree to copied-project payload
- Rollback boundary:
  revert payload-manifest/deletion-boundary changes if copied-project bootstrap parity breaks
- Domain foundation reference:
  not-needed
- Schema impact classification:
  none
- DB / state 영향:
  copied payload should no longer ship runtime SQLite state or generated-state-doc placeholders unless explicitly required
- Markdown / docs 영향:
  packet C will own final manual consolidation, but this packet may classify some docs as required, conditional, or removable payload
- generated docs 영향:
  shipped starter should not include generated-state-doc payload unless explicitly justified for bootstrap safety
- validator / cutover 영향:
  validator may later enforce payload-manifest parity if this contract becomes reusable baseline behavior
- Authoritative source refs:
  `reference/planning/PLN-13_DISTRIBUTION_CHANNELS_MANUAL_CONSOLIDATION_AND_STARTER_PAYLOAD_RATIONALIZATION_DRAFT.md`; `reference/packets/PKT-01_OPS-11_GITHUB_BACKED_NPM_BOOTSTRAPPER.md`; `README.md`; `standard-template/README.md`; `standard-template/START_HERE.md`; `reference/manuals/HARNESS_MANUAL.md`; `standard-template/HARNESS_MANUAL.md`
- Authoritative source intake reference: `reference/planning/PLN-13_DISTRIBUTION_CHANNELS_MANUAL_CONSOLIDATION_AND_STARTER_PAYLOAD_RATIONALIZATION_DRAFT.md`, `reference/packets/PKT-01_OPS-11_GITHUB_BACKED_NPM_BOOTSTRAPPER.md`, `README.md`, `standard-template/README.md`
- Authoritative source disposition: approved sequence fixes packet B as the payload-contract lane after bootstrapper closeout
- New planning source priority / disposition:
  none
- Existing plan conflict: the current starter payload still carries generated/runtime/history surfaces that may no longer match the intended shipped contract
- Current implementation impact: `standard-template/` payload composition, bootstrap apply expectations, and starter verification/tests
- Required rework / defer rationale:
  defer final doc wording consolidation to packet C
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
- `README.md`
- `standard-template/README.md`
- `standard-template/START_HERE.md`
- `reference/manuals/HARNESS_MANUAL.md`
- `standard-template/HARNESS_MANUAL.md`
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
- Packet B should define the copied-project payload manifest and deletion list before packet C rewrites the manual surface.

## 7. Proposed Detailed Agreement
- `OPS-12` should define the smallest reusable payload contract that makes copied-project bootstrap explainable and leaner without breaking `OPS-11` bootstrap safety.
- The first implementation should prefer explicit manifest/deletion classification over broad “cleanup” wording.
- The first implementation should classify starter surfaces into:
  - required payload
  - conditional payload
  - removable payload
- The first implementation should remove generated/runtime/history clutter only when the copied-project bootstrap contract stays intact.
- The first implementation should not yet decide the final manual wording hierarchy; packet C owns that consolidation.
- The first implementation should preserve a narrow existing-repo bootstrap-safe baseline and avoid expanding merge semantics.

## 7A. Proposed Initial Payload Manifest
- Required payload candidates in the first implementation:
  - `.agents/`
    - canonical artifact templates and workflow/rules/scripts required for copied-project bootstrap
    - exclude generated runtime projections and copied operational hot-state payload unless explicitly justified
  - `.harness/`
    - reusable runtime code
    - reusable test code
    - required bootstrap/init helpers
    - exclude shipped SQLite runtime state payload
  - `reference/`
    - active packet template(s)
    - active planning/reference artifacts required by copied-project governance bootstrap
    - operator-facing starter onboarding surface that packet C may later consolidate, but packet B must classify first
  - root launcher/install entrypoints that a copied project needs after bootstrap/apply
    - `HARNESS.cmd`
    - `INIT_STANDARD_HARNESS.cmd`
    - `package.json`
    - any npm script/support file required to run init/test/validate/context flows in the copied project

## 7B. Proposed Deletion Candidate List
- First-pass removable payload candidates:
  - `.harness/operating_state.sqlite`
  - `.harness/operating_state.sqlite-shm`
  - `.harness/operating_state.sqlite-wal`
  - `.agents/runtime/generated-state-docs/*`
  - copied-project placeholder review/test history artifacts that do not contribute to bootstrap safety
  - empty or low-value runtime/history payload that only reflects maintainer execution history rather than copied-project bootstrap needs
- Deletion remains blocked for any file until packet B can explain why copied-project bootstrap, validation, or review readiness does not require it.

## 7C. Proposed Conditional Payload Criteria
- A payload surface is `conditional` only when all of these are true:
  - copied-project bootstrap can succeed without treating it as universal required payload
  - the surface supports a known approved operator/bootstrap path rather than maintainer-only history
  - omission does not break init, validate, context, test, or review-entry baseline behavior
  - the condition can be stated explicitly enough that packet B can test it
- Expected conditional examples in the first implementation:
  - onboarding docs that remain temporarily until packet C consolidates the final human-facing surface
  - helper/reference artifacts that support copied-project review/test readiness but are not required for first bootstrap in every repo shape

## 7D. Empty-Folder Vs Existing-Repo Apply Boundary
- Empty new project folder boundary:
  - packet B may assume the payload can be applied as the full approved starter manifest
  - deletion decisions should optimize for the clean copied-project baseline
- Existing local repository root boundary:
  - packet B must preserve the narrow `OPS-11` safety rule
  - payload decisions must not imply arbitrary merge/import semantics
  - packet B may classify which payload surfaces are safe to apply into the narrow existing-repo mode, but must not broaden acceptance beyond the approved `OPS-11` bootstrap-safe boundary
  - any broader merge or repo-shape compatibility rule remains out of scope until separately approved

## 8. Proposed Implementation Boundary
- Include:
  - starter payload manifest rules
  - starter deletion list rules
  - copied-project bootstrap-required file classification
  - root / `standard-template` sync where reusable bootstrap/payload rules are touched
  - targeted regressions
- Exclude:
  - broad manual rewrite
  - npm publication/release automation redesign
  - arbitrary existing-project merge/import rules
  - `.exe` channel redesign

## 9. Proposed Operator Outcome
- A copied project should receive only the files required to bootstrap and operate the harness baseline.
- The operator should not inherit runtime SQLite state, generated-state-doc placeholders, or low-value historical clutter unless explicitly required.
- The payload contract should make it clear which surfaces remain:
  - because bootstrap needs them
  - because operator onboarding needs them
  - or because they are intentionally deferred to later cleanup

## 10. Verification Direction
- targeted regression for starter payload manifest classification
- targeted regression for removable generated/runtime/history surface exclusion
- targeted regression for bootstrap-safe copied-project contract retention
- targeted regression for root / `standard-template` parity where reusable bootstrap logic depends on payload composition
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
  - targeted regression for payload manifest classification
  - targeted regression for removable generated/runtime/history surface exclusion
  - targeted regression for copied-project bootstrap contract retention
  - targeted regression for root / `standard-template` parity where reusable bootstrap logic is shared
  - root `node --test .harness/test/*.test.js`
  - `standard-template` `node --test .harness/test/*.test.js`
  - root `node .harness/runtime/state/dev05-cli.js validate`
  - root `node .harness/runtime/state/dev05-cli.js validation-report`
  - root active context: `node .harness/runtime/state/dev05-cli.js context`

## 11. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Open packet B as the next concrete `PLN-13` follow-up | yes | user/planner | approved | packet B opens after `OPS-11` closeout under the approved A → B → C sequence |
| Detailed agreement | yes | user/planner | approved | payload manifest, deletion boundary, conditional payload criteria, and empty-folder vs existing-repo boundary are approved for packet B planning scope |
| Ready For Code | yes | user | approved | implementation may begin inside the approved packet B boundary while manual consolidation remains deferred to packet C |

## 12. Current Planning Decision
- Detailed agreement: approved
- Ready For Code: approved
- Remaining planner action before implementation opens:
  transition `OPS-12` to `Developer` and keep implementation inside the approved payload-contract boundary.

## 13. Implementation Notes
- Keep payload classification explicit and reusable rather than scattering removal rules across bootstrap and packaging paths.
- Preserve the `OPS-11` narrow existing-repo boundary exactly; packet B classifies payload only and does not widen merge/import semantics.
- Defer broad manual cleanup and wording consolidation to packet C even when a document remains only `conditional`.

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
  approved
- Packet exit metadata source parity result:
  aligned across root and `standard-template` for reusable bootstrap, payload, and starter verification behavior; the removable payload contract is shared instead of duplicated in individual packaging flows.
- Packet exit metadata validation / security / cleanup evidence:
  required / conditional / removable classification regressions: pass; copied-project bootstrap/init retention regressions: pass; root full harness suite: 78/78 pass; `standard-template` full harness suite: 69/69 pass; root `validate`: pass; root `validation-report`: pass; root `context`: pass
- Exit recommendation:
  approved
- Implementation delta summary:
  Added a reusable starter payload contract that classifies `required`, `conditional`, and `removable` starter surfaces, applies the same removable-payload rule to bootstrap and shipped packaging paths, and removes generated/runtime starter clutter from `standard-template`.
- Source parity result:
  aligned across root and `standard-template` for reusable bootstrap, payload, and starter verification behavior; the removable payload contract is shared instead of duplicated in individual packaging flows.
- Refactor / residual debt disposition:
  No blocking residual defect remains inside the approved `OPS-12` scope. Manual consolidation remains deferred to packet C, and arbitrary existing-repository merge/import semantics remain intentionally out of scope.
- UX conformance result:
  copied-project bootstrap remains explainable because required onboarding surfaces stay present while generated/runtime/history clutter is excluded from the shipped payload.
- Topology / schema conformance result:
  not-needed
- Validation / security / cleanup evidence:
  required / conditional / removable classification regressions: pass; copied-project bootstrap/init retention regressions: pass; root full harness suite: 78/78 pass; `standard-template` full harness suite: 69/69 pass; root `validate`: pass; root `validation-report`: pass; root `context`: pass
- Deferred follow-up item:
  packet C should consolidate manuals and remove remaining duplicate human-facing surfaces without changing the approved payload-safety boundary from packet B
- Improvement candidate reference:
  reusable starter payload contract for GitHub-backed bootstrap, release packaging, and Windows `.exe` packaging
- Proposed target layer:
  core
- Promotion status / linked follow-up item:
  approved / `OPS-12`
- Closeout notes:
  Reviewer found no blocking defect. The payload contract removes shipped runtime/generated clutter, preserves copied-project bootstrap safety, keeps conditional onboarding/review surfaces available, and does not widen the existing-repo acceptance boundary from `OPS-11`.

## 16. Reopen Trigger
- 아래 상황이 생기면 packet을 다시 연다.
- `standard-template` payload가 다시 live SQLite state나 generated-state-doc placeholders를 shipped default로 포함하기 시작함
- payload 분류 규칙이 bootstrap/apply와 release/exe packaging 사이에서 달라짐
- conditional 문서 분류를 이유로 copied-project init, validate, context, test, or review-entry baseline이 깨짐
- packet B 승인 없이 existing local repository root apply boundary가 arbitrary merge/import semantics로 넓어짐
