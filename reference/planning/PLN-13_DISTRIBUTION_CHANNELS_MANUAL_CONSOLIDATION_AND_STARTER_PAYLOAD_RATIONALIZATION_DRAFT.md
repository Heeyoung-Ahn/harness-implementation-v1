# PLN-13 Distribution Channels, Manual Consolidation, And Starter Payload Rationalization Draft

## Status
- Draft prepared on 2026-05-11 after `OPS-10` closeout.
- This draft is not implementation approval by itself.
- The reusable baseline is currently on planner hold with no active lane.
- Detailed agreement approved on 2026-05-11.

## Purpose
This draft defines the next shipped-surface cleanup lane after the reusable packet/validator friction work. The goal is to make distribution, onboarding, and starter payload surfaces easier to ship and easier for non-developer operators to consume.

## Approved Direction Snapshot
- GitHub is the authority for source, `standard-template/` template origin, and release tags.
- npm is the main user entrypoint.
- The npm main channel should be a GitHub-backed bootstrapper, not a package that directly embeds the whole `standard-template/` payload.
- `.exe` remains a Windows offline / non-developer auxiliary channel.
- Concrete implementation priority is fixed as:
  1. GitHub-backed npm bootstrapper
  2. template payload contract
  3. manual consolidation

## Why This Lane Exists
- The current release/install story already has three distribution surfaces:
  - source repository plus GitHub release tags
  - Windows `.exe` / release packaging support
  - source-based installer using `standard-template/`
- The user direction is now clearer:
  - keep `.exe` as a Windows offline / non-developer auxiliary channel
  - keep GitHub as the source, template origin, and release-tag authority
  - make an npm-distributed CLI bootstrapper the main install entrypoint
- Manual and onboarding surfaces are split between `README.md`, `reference/manuals/HARNESS_MANUAL.md`, `standard-template/HARNESS_MANUAL.md`, `standard-template/README.md`, and `standard-template/START_HERE.md`.
- `standard-template/` still contains payload surfaces that may no longer belong in the shipped starter if the npm installer becomes the main delivery path.

## Current Observations
- Root `package.json` is still `private: true`, so the current repo root is not publish-ready as an npm package.
- The current installer already uses `standard-template/` as the payload source:
  - `installer/install-harness.js`
  - `installer/INSTALL_HARNESS.cmd`
- Root manuals are less fragmented than before:
  - `reference/manuals/HARNESS_MANUAL.md`
  - root `README.md`
- The shipped starter still has multiple human-facing onboarding/manual surfaces:
  - `standard-template/HARNESS_MANUAL.md`
  - `standard-template/README.md`
  - `standard-template/START_HERE.md`
- `standard-template/` also still includes starter-internal artifacts that may or may not belong in the final shipped payload:
  - `.harness/operating_state.sqlite`
  - `.agents/runtime/generated-state-docs/*`
  - empty/project-placeholder review and walkthrough artifacts

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Work item | PLN-13 distribution channels, manual consolidation, and starter payload rationalization | the baseline now needs one shipped-surface cleanup lane that covers install channel hierarchy, manual consolidation, and starter payload hygiene together | approved-draft |
| Ready For Code | not-needed | this draft should choose the next concrete cleanup packet shape before implementation opens | not-needed |
| Human sync needed | yes | the user should confirm the install-channel hierarchy and the acceptable deletion boundary for shipped docs/files | pending-detailed-agreement |
| Gate profile | contract | the likely follow-up changes reusable packaging, installer, manuals, and starter payload behavior | approved-draft |
| User-facing impact | medium | this changes how real operators install and read the harness | approved-draft |
| Layer classification | core | the follow-up affects reusable distribution and shipped starter surfaces | approved-draft |
| Active profile dependencies | none | this is core reusable baseline planning | not-needed |
| Profile evidence status | not-needed | no optional profile is active | not-needed |
| Packet exit gate status | pending | planning closeout depends on agreeing the concrete follow-up boundary | pending |

## 1. Goal
- Make a GitHub-backed npm bootstrapper the main reusable installation channel.
- Keep `.exe` as a narrow offline Windows auxiliary channel rather than the primary distribution story.
- Consolidate manuals so operators have one clear primary manual surface and redundant docs can be removed.
- Reduce `standard-template/` payload clutter by deleting files that are no longer required in the shipped starter.

## 2. Proposed Scope
- Define the approved install-channel hierarchy.
- Decide the concrete npm bootstrapper shape and its GitHub download/apply/init flow.
- Define the manual consolidation target and the deletion boundary for redundant docs.
- Define the starter payload deletion boundary for `standard-template/`.
- Recommend one or more concrete follow-up packets after this draft closes.

## 3. Proposed Planning Questions
- What exact npm install surface should be primary:
  - `npx` bootstrap command
  - globally installable CLI wrapper
  - both, with one designated as primary
- What exact GitHub-backed bootstrap flow is approved:
  - download template/release authority content from GitHub
  - apply required harness files into the current local repo root
  - initialize that repo into harness-usable state
- Which existing docs remain authoritative after consolidation:
  - root `README.md`
  - root `reference/manuals/HARNESS_MANUAL.md`
  - starter `START_HERE.md`
  - starter `HARNESS_MANUAL.md`
- Which files inside `standard-template/` are true shipped starter requirements versus historical or redundant payload?
- Should the concrete follow-up sequence be fixed as:
  - packet A: GitHub-backed npm bootstrapper
  - packet B: template payload contract
  - packet C: manual consolidation

## 4. Working Boundary
- Keep this lane in planning.
- Do not implement npm publishing, installer packaging, manual rewrites, or file deletion in this draft.
- Do not reopen `OPS-10` lane-typed packet minimum work.
- Do not broaden into generic documentation rewrite, product marketing site work, or CI/release automation redesign.
- Do not redefine GitHub as a secondary mirror; it remains the release/source authority.

## 5. Initial Recommendation
- Keep these three user directions in one planning lane because they all affect the same shipped surface:
  - install channel
  - human manual surface
  - starter payload contents
- Treat npm as the primary user entrypoint.
- Treat GitHub as the bootstrap authority behind that entrypoint.
- Treat `.exe` as an explicit secondary/offline Windows channel.
- Prefer one primary human manual plus one concise starter onboarding surface rather than multiple overlapping manuals.
- Prefer deleting unnecessary shipped starter files rather than marking them historical inside the payload.
- Prefer sequenced concrete follow-up packets instead of a single broad implementation packet.

## 6. Non-Goal
- Do not choose final npm package naming in this draft unless required to unblock the next packet.
- Do not implement GitHub Actions or release automation redesign here.
- Do not preserve redundant docs just because they already exist.
- Do not keep placeholder/generated/runtime payload files in `standard-template/` unless they are truly required for copied-project bootstrap.
- Do not make npm the source-of-truth holder for template contents.

## 7. Likely Concrete Follow-Up Shape
- Preferred sequenced follow-up:
  - **A. GitHub-backed npm bootstrapper**
    - scope: npm CLI, GitHub download/apply/init, current local repo bootstrap
    - key deliverable: `npx ... init`
  - **B. Template payload contract**
    - scope: define what remains in `standard-template/`
    - key deliverable: payload manifest plus deletion list
  - **C. Manual consolidation**
    - scope: post-install operator-facing docs
    - key deliverable: root authority manual plus starter `START_HERE.md`

## 8. Early Direction From User
- `.exe` remains a Windows offline / non-developer auxiliary channel.
- GitHub remains the source, `standard-template` origin, and release-tag authority.
- npm becomes the primary install entrypoint using a GitHub-backed bootstrapper rather than an embedded full-template package.
- scattered manuals should be consolidated and unnecessary docs deleted
- unnecessary files in `standard-template/` should be deleted rather than kept as low-value payload
- bootstrap flow definition:
  - user runs CLI from an empty new project folder or an existing local repo root
  - CLI downloads approved template/release authority content from GitHub
  - CLI applies required harness files into that target folder/repository
  - CLI initializes the target into harness-usable state

## 9. Open Decisions
- Is the A → B → C sequence fully fixed, or can B/C merge later if the cleanup boundary stays narrow?
- Which single manual becomes the primary human-facing authority after consolidation?
- Which specific starter files are required bootstrap payload versus removable clutter?
- Does the npm main channel require a dedicated package layout separate from the current root package?
- Should packet A support both `npx` and installed CLI entrypoints, or only `npx` first?

## 10. Human Sync / Approval Boundary
| Decision Item | Needed | Owner | Status | Notes |
|---|---|---|---|---|
| Open `PLN-13` as the next planning lane | yes | user/planner | pending | should become active only if the user agrees this is the next cleanup lane |
| Detailed planning agreement | yes | user/planner | approved | GitHub authority, npm bootstrapper main channel, `.exe` auxiliary channel, and A → B → C sequence are fixed |
| Concrete follow-up shape | yes | user/planner | approved | A → B → C sequence is approved; implementation remains blocked until packet A closes its own agreement and Ready For Code |
| Ready For Code | no | - | not-needed | this draft itself stays planning-only |

## 11. Planner Recommendation
- Open `PLN-13` as the next planning lane.
- Keep the three requests in one planning lane, but sequence concrete follow-up as A → B → C.
- Use packet A as the first implementation packet.
- Keep implementation blocked until the concrete follow-up packet closes detailed agreement and Ready For Code.

## 12. Detailed Agreement Close Condition
- This planning lane is ready for `detailed agreement` approval when the user can answer yes to all of these:
- npm CLI bootstrap should become the main reusable install entrypoint
- GitHub should remain the source/release authority behind that bootstrapper
- `.exe` should stay as an explicit secondary/offline Windows channel
- manual consolidation should delete redundant docs rather than preserving overlapping manuals by default
- starter payload cleanup should delete unnecessary shipped files rather than merely documenting them as historical
- implementation should stay blocked until a concrete follow-up packet is approved
- concrete implementation priority should remain:
  1. GitHub-backed npm bootstrapper
  2. template payload contract
  3. manual consolidation

## 13. Current Planning Decision
- Detailed agreement: approved
- Ready For Code: not-needed
- Approved concrete sequence:
  1. `A. GitHub-backed npm bootstrapper`
  2. `B. Template payload contract`
  3. `C. Manual consolidation`
- Remaining planner action:
  packets A and B are closed; open packet C and keep implementation blocked until the manual-consolidation packet closes detailed agreement and Ready For Code.
