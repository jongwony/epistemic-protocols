# Epistemic Cooperative (epistemic-cooperative)

Protocol learning, usage analysis, coverage dashboard, and configuration for Claude Code.

> [한국어](./README_ko.md)

## What is Epistemic Cooperative?

A utility plugin for epistemic protocol onboarding and analytics. Unlike protocols that target specific decision points, Epistemic Cooperative serves as the **entry point** — guiding users through hands-on protocol learning, generating evidence-backed analysis reports, tracking usage across sessions, and configuring protocol preferences.

### Four Skills

| Skill | Purpose | Output |
|-------|---------|--------|
| `/onboard` | Quick recommendation + protocol learning | Terminal-based guided experience |
| `/report` | Growth Map with epistemic analysis | HTML artifact (`~/.claude/.report/growth-map.html`) |
| `/dashboard` | Full coverage analytics dashboard | HTML dashboard (`~/.claude/.insights/dashboard.html`) |
| `/preferences` | Interactive protocol preference configuration | `~/.claude/CLAUDE.local.md` preferences section |

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
| 2a. Pick-1 | Quick path: select 1 recommendation from `/goal`, `/gap`, `/frame` |
| 2b. Evidence | Quick path: show 1 evidence card (max 2 lines) |
| 2. Map | Targeted path: match patterns to protocols via compact mapping |
| 3. Scenario | Targeted path: present intervention point with preset scenarios |
| 4. Trial | Execute actual protocol with mini practice prompt |
| 5. Quiz | Targeted path: Socratic protocol recognition questions |
| 6. Guide | Targeted path: learning summary + /report CTA |

Key features:
- **Value before learning**: quick path proves value in under 3 minutes
- **One at a time**: 1 recommendation, 1 evidence card, 1 trial — no catalog required
- **Onboarding Pool**: `/goal`, `/gap`, `/frame` — unified for Quick and Targeted fallback
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

### /preferences — Protocol Preference Configuration

Configure epistemic protocol behavior through interactive dialogue. Generates a preferences section in `~/.claude/CLAUDE.local.md`.

```
DETECT → SELECT → CONFIGURE → GENERATE → VERIFY
```

| Phase | Description |
|-------|-------------|
| 0. Detect | Check existing preferences in CLAUDE.local.md |
| 1. Select | Choose Quick (5 global params) or Full (global + per-protocol) path |
| 2. Configure | Interactive parameter traversal via gate interaction |
| 3. Generate | Create/update preferences section |
| 4. Verify | Review and confirm result |

Key features:
- **Recognition over Recall**: all parameters as selectable options, never free-text
- Quick path (5 global parameters) or Full path (global + ~32 per-protocol)
- Non-default values only for per-protocol section (minimal noise)
- Existing section handling: Update / Replace / Keep

## Architecture

```
epistemic-cooperative/
├── .claude-plugin/plugin.json
├── skills/
│   ├── onboard/SKILL.md          # /onboard quest-based protocol learning
│   ├── report/SKILL.md           # /report Growth Map
│   ├── dashboard/SKILL.md        # /dashboard coverage dashboard
│   └── preferences/SKILL.md      # /preferences protocol configuration
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
| Want to customize protocol behavior | `/preferences` |
| Adjusting preferences after `/onboard` | `/preferences` |

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
/preferences
```

## Author

Jongwon Choi (https://github.com/jongwony)
