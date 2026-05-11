# PKT-01 OPS-11 GitHub-Backed npm Bootstrapper

## Purpose
- Define the first concrete implementation lane for the approved `PLN-13` distribution contract.
- Make npm the main user entrypoint while preserving GitHub as the authority for source, `standard-template/` origin, and release tags.
- Keep `.exe` as a Windows offline / non-developer auxiliary channel rather than the main install story.

## Approval Rule
- This packet is written before implementation.
- This packet stays narrow: it defines the GitHub-backed npm bootstrapper only.
- This packet must not embed the full `standard-template/` payload directly inside the npm package as the primary installation strategy.
- This packet must preserve GitHub as the authority for template origin and release-tag selection.
- This packet must keep implementation blocked until detailed agreement and `Ready For Code` are both explicitly approved.

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | OPS-11 GitHub-backed npm bootstrapper | `PLN-13` fixed the shipped-surface sequence and packet A is the first concrete install-channel lane | approved |
| Ready For Code | approved | implementation must stay inside the approved bootstrap scope, GitHub authority boundary, target-folder contract, and verification direction | approved |
| Human sync needed | yes | the user confirmed the bootstrap trust boundary, GitHub authority flow, and target-folder apply/init behavior before implementation opens | approved |
| Gate profile | contract | this lane changes reusable installer/distribution behavior and likely touches packaging, bootstrap scripts, and starter application flow | approved |
| User-facing impact | medium | this changes how operators enter the harness and initialize a repository or new project folder | approved |
| Layer classification | core | this changes reusable installation/distribution behavior | approved |
| Active profile dependencies | none | this is core baseline install/distribution work | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| UX archetype status | approved | the existing operator evidence/context archetype is sufficient for this CLI bootstrap surface and is explicitly accepted for Ready For Code | approved |
| UX deviation status | none | no product UI deviation is being approved | not-needed |
| Environment topology status | not-needed | no deploy/cutover topology is being redesigned here | not-needed |
| Domain foundation status | not-needed | no schema/domain-model change is included | not-needed |
| Authoritative source intake status | approved | `PLN-13` fixed GitHub authority, npm entrypoint, `.exe` auxiliary role, and A → B → C sequence | approved |
| Shared-source wave status | not-needed | no multi-packet source wave rebaseline is required | not-needed |
| Packet exit gate status | pending | closeout depends on bootstrap behavior, verification evidence, and root/starter parity | pending |
| Improvement promotion status | proposed | this promotes the approved distribution-channel contract into reusable install behavior | proposed |
| Existing system dependency | none | this is harness-only work | not-needed |
| New authoritative source impact | analyzed | no new external policy source is entering; the driver is approved internal planning evidence from `PLN-13` | analyzed |
| Risk if started now | medium | bootstrap trust and payload-apply boundaries can broaden quickly if packet scope is not kept narrow | approved |

## 1. Why This Packet Exists
- `PLN-13` fixed the distribution contract:
  - GitHub is the authority
  - npm is the main entrypoint
  - `.exe` is secondary/offline
  - implementation sequence is A → B → C
- The current installer is source-repo-oriented and assumes direct local access to `standard-template/`.
- To make npm the real main channel, the harness needs a GitHub-backed bootstrapper that can:
  - start from an empty new project folder or an existing local repository root
  - fetch the approved authority content from GitHub
  - apply required harness files into that target folder/repository
  - initialize the target into harness-usable state

## 2. Goal
- Define and implement the narrow bootstrapper flow that makes npm the primary entrypoint.
- Preserve GitHub as the authority for template/release selection.
- Keep the lane small enough that payload-contract work and manual consolidation remain in later packets.

## 3. In Scope
- Define the npm bootstrap entrypoint shape.
- Define how the bootstrapper identifies the approved GitHub authority source.
- Define how authority content is downloaded and applied into the approved target folder.
- Define the bootstrap initialization step that leaves the target in harness-usable state.
- Define the verification story for root / `standard-template` parity where relevant.

## 4. Out Of Scope
- Defining the final `standard-template/` payload contract.
- Manual consolidation and deletion of redundant docs.
- Broad GitHub Actions or release automation redesign.
- Replacing or removing the `.exe` auxiliary channel.
- Reopening lane-typed packet minimum work from `OPS-10`.

## 4A. User Problem And Expected Outcome
- 현재 사용자가 겪는 문제:
  the main install path still depends on source-repo-local execution and does not yet present npm as the real primary operator entrypoint.
- 작업 후 사용자가 체감해야 하는 변화:
  an operator should be able to run the approved npm bootstrap command from either an empty new project folder or an existing local repository root and reach harness-usable state without manually copying `standard-template/` from a source checkout.

## 4B. UX / Interaction Surface
- Screen / surface type:
  CLI bootstrap entrypoint and install-time operator prompts/messages
- Primary operator:
  non-specialist operator or project maintainer initializing a repository
- UX archetype reference: existing operator evidence/context archetype
- Selected UX archetype: not-needed
- Archetype fit rationale:
  this lane changes CLI/onboarding behavior, not a product UI archetype
- Archetype deviation / approval:
  none
- 영향받는 화면:
  terminal / CLI bootstrap output
- interaction:
  operator runs bootstrap command from an empty new project folder or an existing local repository root
- copy/text:
  trust boundary, selected authority source, apply scope, and next-step outcome must be explicit
- feedback/timing:
  install/bootstrap time only
- source trace fallback:
  packet, validation report, and bootstrap command output remain the trace sources

## 4C. Data / Source Impact
- Layer classification: core
- Core / profile / project boundary rationale:
  reusable installation/distribution behavior belongs in core
- Active profile dependencies:
  none
- Profile-specific evidence status:
  not-needed
- Required reading before code: `.agents/artifacts/REQUIREMENTS.md`, `.agents/artifacts/ARCHITECTURE_GUIDE.md`, `.agents/artifacts/IMPLEMENTATION_PLAN.md`, `reference/planning/PLN-13_DISTRIBUTION_CHANNELS_MANUAL_CONSOLIDATION_AND_STARTER_PAYLOAD_RATIONALIZATION_DRAFT.md`, `README.md`, `installer/install-harness.js`, `standard-template/README.md`
- Security review evidence status:
  not-needed
- Environment topology reference:
  not-needed
- Source environment:
  user-selected empty new project folder or existing local repository root plus GitHub authority source
- Target environment:
  target folder/repository after harness apply/init
- Execution target:
  npm CLI bootstrapper and local file application flow
- Transfer boundary:
  GitHub authority download to local repository apply step
- Rollback boundary:
  revert only the harness files applied by the bootstrapper when bootstrap verification fails
- Domain foundation reference:
  not-needed
- Schema impact classification:
  none
- DB / state 영향:
  initialized repository state, harness runtime artifacts, and starter apply/init behavior may change
- Markdown / docs 영향:
  install instructions and authority docs may change later, but this packet should avoid broad manual cleanup
- generated docs 영향:
  validation/context evidence may reflect new bootstrap authority rules
- validator / cutover 영향:
  validator may need install-surface evidence checks if reusable bootstrap semantics become contract-critical
- Authoritative source refs:
  `reference/planning/PLN-13_DISTRIBUTION_CHANNELS_MANUAL_CONSOLIDATION_AND_STARTER_PAYLOAD_RATIONALIZATION_DRAFT.md`; `README.md`; `installer/install-harness.js`; `standard-template/README.md`
- Authoritative source intake reference: `reference/planning/PLN-13_DISTRIBUTION_CHANNELS_MANUAL_CONSOLIDATION_AND_STARTER_PAYLOAD_RATIONALIZATION_DRAFT.md`, `README.md`, `installer/install-harness.js`, `standard-template/README.md`
- Authoritative source disposition: approved planning contract fixes GitHub authority, npm entrypoint, `.exe` auxiliary role, and A → B → C priority
- New planning source priority / disposition:
  none
- Existing plan conflict: the source-repo-local installer path is still stronger than the npm main-channel story
- Current implementation impact: installer/bootstrap scripts, packaging/install entrypoint logic, and verification/tests
- Required rework / defer rationale:
  defer template payload pruning and manual cleanup to packets B and C
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
- `README.md`
- `installer/install-harness.js`
- `installer/INSTALL_HARNESS.cmd`
- `standard-template/README.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `.agents/artifacts/ARCHITECTURE_GUIDE.md`
- `.agents/artifacts/IMPLEMENTATION_PLAN.md`

## 6. Fixed Planning Contract From PLN-13
- GitHub remains the authority for:
  - source
  - `standard-template/` origin
  - release tags
- npm is the main user entrypoint.
- The npm main channel is a GitHub-backed bootstrapper.
- The bootstrapper should:
  - run from an empty new project folder or an existing local repository root
  - download approved authority content from GitHub
  - apply required harness files into that target
  - initialize the target into harness-usable state
- `.exe` remains the Windows offline / non-developer auxiliary channel.
- Implementation sequence remains:
  1. `A. GitHub-backed npm bootstrapper`
  2. `B. Template payload contract`
  3. `C. Manual consolidation`

## 7. Proposed Detailed Agreement
- `OPS-11` should implement the smallest bootstrapper contract that makes npm the real primary entrypoint without moving source authority away from GitHub.
- The first implementation should prefer explicit authority selection, explicit apply scope, and explicit initialization reporting over clever automation.
- The bootstrapper should support two explicit target modes:
  - empty new project folder
  - existing local repository root
- The first implementation should make the chosen target mode explicit and fail fast when the target folder is neither empty-new nor a valid existing repo target.
- The first implementation may target `npx` first even if a globally installed CLI wrapper is later supported.
- The first implementation should define a stable authority-selection contract:
  - which GitHub repo/source is allowed
  - which release tag or source ref is selected
  - how the bootstrapper resolves the approved authority artifact
- The first implementation should not yet redefine which exact files belong in `standard-template/`; packet B owns that payload contract.

## 8. Proposed Implementation Boundary
- Include:
  - npm CLI bootstrap entrypoint
  - GitHub authority download/apply/init flow
  - target-folder mode detection/validation
  - explicit bootstrap result surface
  - root / `standard-template` sync where reusable scripts or guidance are touched
  - targeted regressions
- Exclude:
  - template payload manifest redesign
  - broad manual consolidation
  - `.exe` channel redesign
  - hosted CI/release automation redesign
  - broad packaging cleanup unrelated to the bootstrapper path

## 9. Proposed Operator Outcome
- An operator should be able to use the approved npm entrypoint without first checking out the full harness source repo only to run the installer locally.
- An operator should be able to bootstrap either:
  - an empty new project folder, or
  - an existing local repository root
- The bootstrapper should make the GitHub authority boundary explicit rather than implicit.
- The operator should be able to tell:
  - which target mode was selected
  - what authority source was selected
  - what files were applied
  - whether initialization completed
  - what to do next

## 10. Verification Direction
- targeted regression for target-folder mode detection
- targeted regression for GitHub authority selection and download/apply flow handling
- targeted regression for bootstrap apply/init success path
- targeted regression for bootstrap rollback/fail-fast boundaries where applicable
- targeted regression for root / `standard-template` parity where reusable bootstrap logic is shared
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
  - targeted regression for target-folder mode detection
  - targeted regression for GitHub authority selection and download/apply handling
  - targeted regression for bootstrap apply/init success path
  - targeted regression for bootstrap failure boundary
  - targeted regression for root / `standard-template` parity where reusable bootstrap logic is shared
  - root `node --test .harness/test/*.test.js`
  - `standard-template` `node --test .harness/test/*.test.js`
  - root `node .harness/runtime/state/dev05-cli.js validate`
  - root `node .harness/runtime/state/dev05-cli.js validation-report`
  - root active context: `node .harness/runtime/state/dev05-cli.js context`

## 11. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Open packet A as the first concrete `PLN-13` follow-up | yes | user/planner | approved | packet A is now the active concrete lane under the approved A → B → C sequence |
| Detailed agreement | yes | user/planner | approved | the GitHub-backed bootstrapper boundary is approved with the empty-new-folder or existing-repo-root target definition |
| Ready For Code | yes | user | approved | implementation may open inside the approved bootstrap trust boundary and verification direction |

## 12. Current Planning Decision
- Detailed agreement: approved
- Ready For Code: approved
- Remaining planner action before implementation opens:
  hand off packet A to Developer and keep implementation inside the approved bootstrapper boundary.

## 13. Implementation Notes
- Keep GitHub authority selection explicit and inspectable instead of hiding source/ref selection behind implicit defaults only.
- Keep existing local repository support intentionally narrow until packet B defines the payload and merge contract.
- Do not let packet A absorb template-payload pruning, merge semantics, or broad manual cleanup work.

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
  aligned
- Packet exit metadata validation / security / cleanup evidence:
  root `node --test .harness/test/bootstrap-runtime.test.js`: pass; root `node --test .harness/test/*.test.js`: 75/75 pass; `standard-template` `node --test .harness/test/*.test.js`: 69/69 pass; root `validate`, `validation-report`, and `context`: pass
- Exit recommendation:
  approved
- Implementation delta summary:
  Added a GitHub-backed bootstrap runtime and CLI installer flow that supports empty new project folders and narrowly accepted existing local repository roots while preserving GitHub as the authority and `.exe` as an auxiliary channel.
- Source parity result:
  aligned across root and `standard-template` for reusable install guidance and synchronized regression expectations; packet A intentionally limits implementation to bootstrap authority/apply/init behavior and does not redefine payload contents.
- Refactor / residual debt disposition:
  No blocking residual defect remains inside the approved `OPS-11` scope. Live GitHub download verification, final npm publication path verification, template payload pruning, and manual consolidation remain intentionally deferred to packet B and packet C.
- UX conformance result:
  CLI/operator messaging stays inside the approved onboarding surface and keeps authority source, target mode, apply scope, and next-step outcome explicit.
- Topology / schema conformance result:
  not-needed
- Validation / security / cleanup evidence:
  root targeted bootstrap runtime regressions: pass; root full harness suite: 75/75 pass; `standard-template` full harness suite: 69/69 pass; root `validate`: pass; root `validation-report`: pass; root `context`: pass
- Deferred follow-up item:
  packet B should define the `standard-template/` payload manifest, deletion boundary, and copied-project contract before existing local repository support broadens beyond the intentionally narrow bootstrap-safe baseline
- Improvement candidate reference:
  GitHub-backed npm bootstrapper as the main harness entrypoint with GitHub remaining the source/release authority
- Proposed target layer:
  core
- Promotion status / linked follow-up item:
  approved / `OPS-11`
- Closeout notes:
  Reviewer found no blocking defect. The bootstrapper keeps GitHub as authority, supports the approved two target modes, stays narrow on existing repo acceptance, and preserves root/starter verification parity without absorbing payload-contract or manual-consolidation work.

## 16. Reopen Trigger
- 아래 상황이 생기면 packet을 다시 연다.
- bootstrapper가 GitHub authority 대신 embedded full-template payload를 main channel처럼 취급하기 시작함
- existing local repository mode가 payload/merge contract 승인 없이 arbitrary existing project files를 덮어쓰거나 병합하기 시작함
- target-folder mode detection이 empty new folder와 valid existing repo root outside의 ambiguous states를 통과시킴
- root와 `standard-template`의 installer/bootstrap guidance 또는 regression behavior가 달라짐
