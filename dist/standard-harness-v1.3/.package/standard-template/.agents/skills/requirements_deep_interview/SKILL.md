# Requirements Deep Interview

Use this skill before drafting or rewriting the requirements baseline.

## Goal
- close implementation-critical ambiguity before downstream planning or coding

## Required Reading
- `reference/artifacts/PROJECT_STARTER_DOC_PACK.md`
- `reference/planning/PLN-00_DEEP_INTERVIEW.md`
- `.agents/artifacts/REQUIREMENTS.md`
- `reference/planning/PLN-01_REQUIREMENTS_FREEZE.md`
- `.agents/artifacts/ACTIVE_PROFILES.md` when one or more profiles are active

## Interview Workflow
1. Use `PROJECT_STARTER_DOC_PACK.md` as the gap checklist first.
2. Show the decision queue first: what must be decided, a one-line description for each item, and which item should be closed first.
3. Ask only one decision at a time instead of dumping every question at once.
4. For each decision, explain why it matters now and how it will affect downstream workflow, UX, data/schema, integration, test scope, deployment, and later packet shape when relevant.
5. Convert answers into explicit `approved / open / deferred` states in `PLN-00_DEEP_INTERVIEW.md`.
6. When one decision changes the assumptions of later items, restate the updated baseline and rewrite the remaining follow-up questions to match it.
7. Tighten `.agents/artifacts/REQUIREMENTS.md` with concrete goal, users, scope, workflow, dependency, and approval-boundary language.
8. Before ending, provide a first-version product preview and request final human confirmation for the freeze boundary.
9. Stop at the requirements-freeze boundary and report what still blocks `PLN-01`.

## Minimum Questions
- goal
- primary user
- first-version workflow
- in-scope / out-of-scope
- existing system or data dependency
- external source or policy evidence
- approval boundary
- optional profile need
- deployment or rollback expectation when it materially affects scope

## Required Outputs
- Start with a decision list before drilling into the first decision.
- Each decision includes plain-language impact explanation suitable for a non-technical planner/operator.
- `PROJECT_STARTER_DOC_PACK.md` gaps are either answered or explicitly called out as blockers.
- `PLN-00_DEEP_INTERVIEW.md` records concrete decisions instead of leaving the interview only in chat.
- `.agents/artifacts/REQUIREMENTS.md` becomes specific enough to support `PLN-01` discussion.
- The closeout includes a final first-version product picture and an explicit final-confirmation request.
- The response ends with freeze blockers, not packet drafting.

## Forbidden Moves
- Do not sync `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, or `UI_DESIGN.md` while `PLN-01` is still unapproved.
- Do not open or draft a first implementation packet as if kickoff closure were already complete.
- Do not treat vague answers as approval just to move faster.
- Do not ask the user to resolve multiple unrelated decision items in one turn when they can be closed sequentially.
