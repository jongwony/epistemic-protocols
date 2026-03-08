# Epistemic Cooperative (epistemic-cooperative)

Protocol learning, usage analysis, and coverage dashboard for Claude Code.

> [한국어](./README_ko.md)

## What is Epistemic Cooperative?

A utility plugin for epistemic protocol onboarding and analytics. Unlike protocols that target specific decision points, Epistemic Cooperative serves as the **entry point** — guiding users through hands-on protocol learning, generating evidence-backed analysis reports, and tracking usage across sessions.

### Three Skills

| Skill | Purpose | Output |
|-------|---------|--------|
| `/onboard` | Quest-based protocol learning | Terminal-based guided experience |
| `/report` | Usage analysis with evidence | HTML profile (`~/.claude/.report/epistemic-profile.html`) |
| `/dashboard` | Full coverage analytics dashboard | HTML dashboard (`~/.claude/.insights/dashboard.html`) |

## Skills

### /onboard — Quest-Based Protocol Learning

Learn epistemic protocols through hands-on experience: session-derived scenarios, real protocol trials, and Socratic quizzes.

```
ENTRY → SCAN → EXTRACT → MAP → SCENARIO → TRIAL → QUIZ → GUIDE
```

| Phase | Description |
|-------|-------------|
| 0. Entry | Choose path: general / targeted / browse |
| 1. Scan | Discover projects and session files (delegated to project-scanner) |
| 2. Extract | Extract behavioral patterns from session JSONL (delegated to session-analyzer) |
| 3. Map | Match patterns to protocols via compact mapping |
| 4. Scenario | Present intervention point with session snippet or preset |
| 5. Trial | Execute actual protocol with mini practice prompt |
| 6. Quiz | Socratic protocol recognition questions |
| 7. Guide | Learning summary + /report CTA + install guidance |

Key features:
- **Experience over analysis**: learn by doing, not reading reports
- Three-tier scenario fallback: session snippets → codebase-grounded → preset scenarios
- Real protocol trial execution (2-3 exchanges per protocol)
- Immediate quiz feedback with distinction explanations
- Starter Trio for new users: Hermeneia `/clarify`, Telos `/goal`, Syneidesis `/gap`

### /report — Usage Analysis Report

Analyzes session files to extract tool usage patterns, maps patterns to protocols, and generates evidence-backed recommendations with HTML artifact.

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

## Architecture

```
epistemic-cooperative/
├── .claude-plugin/plugin.json
├── skills/
│   ├── onboard/SKILL.md          # /onboard quest-based protocol learning
│   ├── report/SKILL.md           # /report usage analysis report
│   └── dashboard/SKILL.md        # /dashboard coverage dashboard
└── agents/
    ├── project-scanner.md         # Phase 1: project discovery
    ├── session-analyzer.md        # Phase 2: pattern extraction (parallel per project)
    └── coverage-scanner.md        # Insights Phase 2: batch aggregation
```

| Agent | Used By | Role |
|-------|---------|------|
| project-scanner | `/onboard` Phase 1, `/report` Phase 1 | Scan `~/.claude/projects/`, select recent projects, read session indices |
| session-analyzer | `/onboard` Phase 2, `/report` Phase 2 | Extract tool frequencies, rework indicators, slash command history from JSONL |
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
```

## Author

Jongwon Choi (https://github.com/jongwony)
