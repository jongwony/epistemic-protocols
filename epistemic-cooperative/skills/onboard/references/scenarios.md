# Preset Scenarios

Fallback scenarios for `/onboard` SCENARIO and QUIZ phases when session data is insufficient (Tier 2-3).
Each protocol has a realistic situation, intervention description, and two quiz questions.

## Hermeneia `/clarify`

**Situation**: You tell Claude "Fix the auth flow" but get back a complete rewrite of the login page, including UI changes, session management refactoring, and new error handling — when all you meant was fixing the token refresh bug.

**Intervention**: `/clarify` decomposes the expression "fix the auth flow" into concrete dimensions (scope, target component, success criteria) and surfaces the gap between what you said and what you meant before any code is written.

**Quiz Q (situation)**: You asked Claude to "make the dashboard better" and it redesigned the entire layout, added new charts, and refactored the data layer — but you just wanted faster load times.
- A) Telos `/goal` — B) Hermeneia `/clarify` — C) Syneidesis `/gap` — D) Prothesis `/frame`
- Answer: B

**Quiz Q (design)**: You want to request "Refactor the API client" but worry Claude might change the interface contracts. How would you use a protocol to prevent scope overflow?
- Hint: The issue is your expression doesn't capture your actual boundaries.

## Telos `/goal`

**Situation**: You start a session with "I want to improve the search feature" — no success criteria, no metrics, no scope boundary. Claude asks what you mean, you say "just make it better," and three iterations later you've built something nobody needed.

**Intervention**: `/goal` co-constructs a GoalContract by proposing concrete success criteria, scope boundaries, and constraints — transforming "make it better" into "reduce search latency below 200ms for queries under 50 chars, without changing the existing API contract."

**Quiz Q (situation)**: A team member says "Build something for monitoring." No specs, no metrics, no target users defined. You're about to start coding.
- A) Aitesis `/inquire` — B) Hermeneia `/clarify` — C) Telos `/goal` — D) Epitrope `/calibrate`
- Answer: C

**Quiz Q (design)**: You need to "create a notification system" but haven't defined what success looks like. How would you use a protocol to establish clear objectives before implementation?
- Hint: The problem isn't expression mismatch — it's that the goal itself doesn't exist yet.

## Syneidesis `/gap`

**Situation**: You're about to merge a PR that adds a new API endpoint. The code looks clean, tests pass, but you haven't considered: rate limiting, authentication for the new route, or how it interacts with the existing caching layer.

**Intervention**: `/gap` audits the decision by surfacing procedural gaps (missing review steps), consideration gaps (unexamined dimensions like security), assumption gaps (implicit beliefs about the environment), and alternative gaps (unexplored approaches).

**Quiz Q (situation)**: You've finished implementing a database migration script. Tests pass locally. You're about to approve the PR. Something feels off but you can't name it.
- A) Prosoche `/attend` — B) Syneidesis `/gap` — C) Epharmoge `/contextualize` — D) Aitesis `/inquire`
- Answer: B

**Quiz Q (design)**: You're deciding between three architecture options for a new service. You've picked option B. Before committing, how would you check if you're overlooking something?
- Hint: The issue isn't risk assessment — it's unnoticed blind spots in your decision process.

## Prothesis `/frame`

**Situation**: You need to evaluate whether to adopt microservices for your monolith. You've been reading blog posts but every perspective seems equally valid — some say split, some say don't, some say it depends.

**Intervention**: `/frame` recommends analytical lenses (e.g., team autonomy, deployment frequency, fault isolation, operational complexity) and can assemble a multi-perspective team to analyze the question from each angle systematically.

**Quiz Q (situation)**: Your team is debating how to handle technical debt. Some want dedicated sprints, others want continuous improvement, others want to rewrite. Everyone has valid points. No one knows which lens to evaluate through.
- A) Telos `/goal` — B) Prothesis `/frame` — C) Syneidesis `/gap` — D) Epitrope `/calibrate`
- Answer: B

**Quiz Q (design)**: You're evaluating three CI/CD tools for your project. Each excels in different dimensions. How would you structure the evaluation to avoid defaulting to the loudest opinion?
- Hint: The problem isn't missing information or unclear goals — it's not knowing which analytical lens to apply.

## Aitesis `/inquire`

**Situation**: You ask Claude to "deploy the staging environment." Claude starts writing Terraform configs, but hasn't asked about: which cloud provider, what region, what instance sizes, whether there's an existing VPC, or what the staging URL convention is.

**Intervention**: `/inquire` detects context insufficiency before execution, prioritizes questions by information gain, and ensures Claude gathers what it needs to know before acting — rather than making assumptions silently.

**Quiz Q (situation)**: You ask Claude to "set up the CI pipeline for the new repo." Claude immediately starts writing a GitHub Actions workflow without asking about test frameworks, deployment targets, or required checks.
- A) Hermeneia `/clarify` — B) Aitesis `/inquire` — C) Telos `/goal` — D) Prosoche `/attend`
- Answer: B

**Quiz Q (design)**: You're about to ask Claude to migrate your database from Postgres to MySQL. What protocol helps ensure Claude asks the right questions before executing?
- Hint: Your intent is clear and your goal is defined — but the execution context has unknown dependencies.

## Epitrope `/calibrate`

**Situation**: You have a team of three Claude agents working on a feature. One is handling frontend, one backend, one tests. But you haven't defined who makes architecture decisions, when to escalate, or what requires your approval versus what they can decide autonomously.

**Intervention**: `/calibrate` produces a Delegation Contract (DC) that specifies WHO decides, WHAT decisions they can make, and HOW MUCH autonomy they have — through scenario-based interview rather than abstract policy setting.

**Quiz Q (situation)**: You delegate a refactoring task to Claude with "refactor the auth module, use your best judgment." Claude makes sweeping changes — renames interfaces, changes the session model, adds a new dependency — and you wish you'd set boundaries.
- A) Hermeneia `/clarify` — B) Syneidesis `/gap` — C) Epitrope `/calibrate` — D) Aitesis `/inquire`
- Answer: C

**Quiz Q (design)**: You're setting up a multi-agent workflow. How would you define what each agent can decide independently versus what needs your sign-off?
- Hint: The problem isn't unclear goals or missing context — it's undefined delegation scope.

## Analogia `/ground`

**Situation**: Claude recommends the "strangler fig pattern" for your monolith migration. The pattern makes sense in theory, but you're unsure how it maps to your specific codebase — which services to extract first, where to draw boundaries, how your shared database fits.

**Intervention**: `/ground` validates the structural mapping between the abstract pattern and your concrete codebase by decomposing the analogy, checking each correspondence, and instantiating with your actual components.

**Quiz Q (situation)**: Claude suggests using the "circuit breaker pattern" for your API. You understand the concept but don't know if your specific service topology and failure modes actually match what the pattern assumes.
- A) Prothesis `/frame` — B) Katalepsis `/grasp` — C) Analogia `/ground` — D) Aitesis `/inquire`
- Answer: C

**Quiz Q (design)**: Someone says "treat your infrastructure like cattle, not pets." How would you check whether this mental model actually applies to your specific deployment setup?
- Hint: The advice might be correct in general but structurally mismatched to your context.

## Prosoche `/attend`

**Situation**: You have a plan to restructure the database schema, migrate data, update the ORM, and deploy — all in one go. Each step looks correct individually, but you haven't assessed which steps have cascading risks if they fail.

**Intervention**: `/attend` classifies each task for risk signals (irreversibility, external mutation, security boundaries) and surfaces elevated-risk items for your judgment before execution proceeds.

**Quiz Q (situation)**: Claude has generated a 15-step deployment plan. Each step passed review. You're about to run it. You want to know which steps could cause cascading failures.
- A) Syneidesis `/gap` — B) Prosoche `/attend` — C) Epharmoge `/contextualize` — D) Prothesis `/frame`
- Answer: B

**Quiz Q (design)**: You're about to execute a multi-step infrastructure change. How would you identify which steps carry the highest risk before starting?
- Hint: The plan itself is sound — the concern is execution-time risk, not decision gaps.

## Epharmoge `/contextualize`

**Situation**: Claude correctly implements a React component with modern hooks and TypeScript. But your project uses React 16 class components, doesn't have TypeScript set up, and the team convention is CSS modules — not the Tailwind Claude used.

**Intervention**: `/contextualize` detects application-context mismatch after execution — where the output is technically correct but doesn't fit the deployment environment, team conventions, or project constraints.

**Quiz Q (situation)**: Claude writes a perfect Python script using match statements and walrus operators. Your production environment runs Python 3.8.
- A) Aitesis `/inquire` — B) Epharmoge `/contextualize` — C) Syneidesis `/gap` — D) Analogia `/ground`
- Answer: B

**Quiz Q (design)**: After Claude generates code that works but uses patterns your team doesn't follow, how would you systematically check for environment fit?
- Hint: The code is correct — the mismatch is between the output and its deployment context.

## Katalepsis `/grasp`

**Situation**: Claude refactored your authentication module across 12 files — added middleware, changed the session model, updated the database schema, and modified 3 API endpoints. You approved each diff, but you don't actually understand the new flow end-to-end.

**Intervention**: `/grasp` structures comprehension verification through Socratic probes — asking targeted questions about the change, testing edge cases in your understanding, and identifying gaps between "I approved it" and "I understand it."

**Quiz Q (situation)**: Claude just completed a complex refactoring. All tests pass. You merged it. A teammate asks "how does the new caching layer work?" and you realize you can't explain it.
- A) Hermeneia `/clarify` — B) Prothesis `/frame` — C) Katalepsis `/grasp` — D) Syneidesis `/gap`
- Answer: C

**Quiz Q (design)**: After a large AI-driven change, how would you verify that you actually understand what was done, not just that it works?
- Hint: The problem isn't that the output is wrong — it's that your comprehension hasn't caught up.
