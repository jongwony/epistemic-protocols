# Epistemic Cooperative (epistemic-cooperative)

Protocol learning, usage analysis, coverage dashboard, and work-unit triage for Claude Code and Codex.

> [한국어](./README_ko.md)

## What is Epistemic Cooperative?

A utility plugin for epistemic protocol onboarding, analytics, and work orchestration. Unlike protocols that target specific decision points, Epistemic Cooperative serves as the **entry point** — guiding users through hands-on protocol learning, generating evidence-backed analysis reports, tracking usage across sessions, and forming focused work units from issues.

### Skills

| Skill | Purpose | Output |
|-------|---------|--------|
| `/onboard` | Quick recommendation + protocol learning | Terminal-based guided experience |
| `/report` | Growth Map with epistemic analysis | HTML artifact (`~/.claude/.report/growth-map.html`) |
| `/dashboard` | Full coverage analytics dashboard | HTML dashboard (`~/.claude/.dashboard/dashboard.html`) |
| `/catalog` | Protocol handbook — instant reference | Terminal-based protocol browser |
| `/triage` | Work-unit triage from GitHub issues | Routed work units, externalized to records `/distill` certifies |
| `/forge` | Reference-grounded prompt-artifact formation | Prompt artifact (initial prompt for a follow-up session/tool, or a standing custom-skill recipe) |
| `/reduced-space-test` | Scoped empirical validation in a bounded stand-in space | Scoped resolution + carried residual |
| `/review-loop` | Source-agnostic code/PR review-resolve loop to convergence | Applied fixes + convergence trace |
| `/white-bear` | Prose audit — unnecessary competing-target mentions (prohibition framing, superseded-path mention, negated anchoring) | JSON findings (read-only) |
| `/zero-shot` | Prose audit — principle statement over anchoring examples | JSON findings (read-only) |

## Skills

### /onboard — Quick Recommendation + Protocol Learning

Start with a quick recommendation based on your recent sessions, then optionally continue to guided learning.

```
Quick Proof:    ENTRY → QUICKSCAN → PICK-1 → EVIDENCE → TRIAL → INSIGHT → NEXT
Targeted:       ENTRY → QUICKSCAN → MAP → SCENARIO → TRIAL → QUIZ → GUIDE
Targeted + std: ENTRY → SCENARIO → TRIAL → QUIZ → GUIDE
```

| Phase | Description |
|-------|-------------|
| 0. Entry | Choose path: quick recommendation / targeted learning / browse all |
| 1. Quick Scan | Collect recent session metadata inline (Glob + Read) |
| 2a. Pick-1 | Quick path: select 1 recommendation from `/gap`, `/frame` |
| 2b. Evidence | Quick path: show 1 evidence card (max 2 lines) |
| 2. Map | Targeted path: match patterns to protocols via compact mapping |
| 3. Scenario | Targeted path: present intervention point with preset scenarios |
| 4. Trial | Execute actual protocol with mini practice prompt |
| 5. Quiz | Targeted path: Socratic protocol recognition questions |
| 6. Guide | Targeted path: learning summary + /report CTA |

Key features:
- **Value before learning**: quick path proves value in under 3 minutes
- **One at a time**: 1 recommendation, 1 evidence card, 1 trial — no catalog required
- **Onboarding Pool**: `/gap`, `/frame` — unified for Quick and Targeted fallback
- Real protocol trial execution (2-3 exchanges per protocol)
- Targeted path preserves full learning experience (scenarios, quizzes, guide)
- `/report` for evidence-backed analysis; `/onboard` for quick value proof

### /report — Growth Map

Analyzes session patterns and integrates `/insights` data as targeting input to generate a Growth Map — an orthogonal epistemic analysis covering protocol adoption patterns, coverage gaps, and anti-patterns.

```
SCAN → EXTRACT → MAP → PRESENT → GUIDE
```

| Phase | Description |
|-------|-------------|
| 1. Scan | Discover projects and session files (delegated to project-scanner) |
| 2. Extract | Extract behavioral patterns from session JSONL (delegated to session-analyzer) |
| 3. Map | Match patterns to protocols via mapping tables |
| 4. Present | Show results and generate HTML profile (user confirmation) |
| 5. Guide | Protocol trial CTA with install guidance |

Key features:
- Pattern-based protocol matching (behavioral, environmental, friction patterns)
- Three-tier fallback: precise mapping (3+ patterns) → supplementary (1-2) → Starter Trio
- Session diagnostics with anti-pattern detection
- Facets data acceleration (when available from prior `/dashboard` runs)

### /dashboard — Coverage Dashboard

Analyzes all Claude Code session data to produce a comprehensive usage analytics dashboard with coverage metrics, friction analysis, growth timeline, and quality scoring.

```
COLLECT → AGGREGATE → ANALYZE → PRESENT
```

| Phase | Description |
|-------|-------------|
| 1. Collect | Inventory facets, session-meta, and project data |
| 2. Aggregate | Batch data collection (delegated to coverage-scanner) |
| 3. Analyze | 7 computations: coverage, usage, friction, growth, achievements, satisfaction, quality |
| 4. Present | HTML dashboard + console summary |

Dashboard sections:
- **Coverage**: situation occurred vs. protocol used per protocol
- **Protocol Usage**: slash command invocation counts and first-use dates
- **Friction Mapping**: friction keys mapped to protocol groups
- **Growth Timeline**: weekly session counts and adoption dates
- **Achievements**: session, protocol, code, and streak milestones
- **Quality Score**: composite 0-100 (outcome 35%, friction 20%, satisfaction 25%, coverage 20%)

### /catalog — Protocol Handbook

Browse all protocols, compare by concern cluster, and view detailed scenarios. Text-only output with optional detail mode for per-protocol scenarios.

### /triage — Work-Unit Formation

Groups a GitHub `RawIssueSet`, normalizes each issue group into a shared problem frame, fuses the frame with the active `AGENTS.md` northstar in the current session, and forms focused work units. Once the user picks a route, `/triage` externalizes each routed unit to a substrate-owned record and composes `/distill` to certify it for the receiving session. With no issue scope supplied, `/triage` starts from the current repository's open backlog and judges triage load before reading full issue substrate.

```
RAW ISSUES → GROUP → NORMALIZE → NORTHSTAR FUSION → WORK UNIT → ROUTE → EXTERNALIZE (WorkUnitRecord) → [/distill] → CERTIFICATE
```

Key features:
- bare `/triage` performs lightweight open-backlog metadata intake, then classifies small / medium / large posture from issue load, repo load, mapping load, and intent ambiguity
- similarity grouping by problem pressure rather than labels alone
- `IssueGroup -> FocusedWorkUnit` one-to-one by default, with split only when the northstar fusion exposes distinct execution axes
- route choice belongs to the current session: independent session or re-triage
- a unit routed to an independent session externalizes its record and composes `/distill` to certify it; re-triage composes no certification

### /forge — Reference-Grounded Prompt-Artifact Formation

Reads a target reference document (a vendor model prompt guide, the Codex Goals spec), reverse-induces the user's under-determined intent into a modality-aware IR, grounds it against the reference via canonical-external dynamic fetch with a staleness guard, and projects a ready-to-use prompt artifact — an initial prompt for a follow-up session or tool, or a standing custom-skill recipe.

```
ReferenceIntake → ResolvedIntentIR → GroundedReference → VendorPromptDraft → PromptArtifact
```

Key features:
- vendor-agnostic core (intent IR + staleness policy) + parameterized adapter seam; ships Higgsfield, gpt-image, codex-goals, and claude-session adapters
- core stops at IR; artifact form is adapter-determined (no core promotion)
- filled draft with relay slots cited and constitution slots flagged — not a blank question list, not a blind full draft
- cross-adapter abstraction is a deliberately deferred colimit (sibling of triage-gated-vendor-harness), not extracted ahead of accumulated use

### /reduced-space-test — Scoped Empirical Validation

Validates an inference-uncertain proposition (does it behave / perform / transfer / hold value) inside a constraint-bounded stand-in space synchronized with the user, then carries the uncovered complement forward. The core act is decomposing the target↔surrogate equivalence claim into verifiable facets — not building the stand-in space.

```
ClaimIntake → ScopedClaimFrame → BoundedTestSpace → EmpiricalEvidence → ScopedResolution → CarriedResidual
```

Key features:
- orchestration utility (composes `/bound` + `/inquire`, with a conditional `/elicit` or `/induce` front); no new protocol, no graph node
- constraint sync is a Constitution interaction — the user's boundary constitutes the verifiable claim
- scoped claim only — reduced failure probability within the tested conditions, never absolute equivalence
- residual complement is a first-class output routed to a follow-up protocol

## Architecture

```
epistemic-cooperative/
├── .claude-plugin/plugin.json
├── skills/
│   ├── onboard/SKILL.md          # /onboard quest-based protocol learning
│   ├── report/SKILL.md           # /report Growth Map
│   ├── dashboard/SKILL.md        # /dashboard coverage dashboard
│   ├── catalog/SKILL.md          # /catalog protocol handbook
│   ├── triage/SKILL.md           # /triage work-unit formation
│   ├── forge/SKILL.md            # /forge reference-grounded prompt-artifact formation
│   └── reduced-space-test/SKILL.md  # /reduced-space-test scoped empirical validation
└── agents/
    ├── project-scanner.md         # Phase 1: project discovery
    ├── session-analyzer.md        # Phase 2: pattern extraction (parallel per project)
    └── coverage-scanner.md        # Insights Phase 2: batch aggregation
```

| Agent | Used By | Role |
|-------|---------|------|
| project-scanner | `/report` Phase 1 | Scan `~/.claude/projects/`, select recent projects, read session indices |
| session-analyzer | `/report` Phase 2 | Extract tool frequencies, rework indicators, slash command history from JSONL |
| coverage-scanner | `/dashboard` Phase 2 | Aggregate facets, session-meta, and slash command data across all sessions |

## When to Use

| Situation | Skill |
|-----------|-------|
| New to epistemic protocols | `/onboard` |
| Want hands-on protocol learning | `/onboard` |
| Need evidence-backed analysis report | `/report` |
| Want to see usage analytics | `/dashboard` |
| Re-evaluating protocol fit after workflow changes | `/report` |
| After running `/onboard` for deeper analysis | `/report` or `/dashboard` |
| Tracking protocol adoption over time | `/dashboard` |
| Quick protocol reference | `/catalog` |
| Turning related GitHub issues into focused work units | `/triage` |
| Validating an uncertain proposition in a bounded stand-in space | `/reduced-space-test` |

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install epistemic-cooperative@epistemic-protocols
```

## Usage

```
/onboard
/report
/dashboard
/catalog
/triage
/triage #41 #52 #60
```

## Author

Jongwon Choi (https://github.com/jongwony)
