# Epistemic Cooperative (epistemic-cooperative)

Session analytics and protocol recommendations for Claude Code.

> [한국어](./README_ko.md)

## What is Epistemic Cooperative?

A utility plugin that analyzes Claude Code usage patterns to recommend epistemic protocols and provide coverage analytics. Unlike protocols that target specific decision points, Epistemic Cooperative serves as the **entry point** — helping users discover which protocols fit their workflow and tracking usage across sessions.

### Two Skills

| Skill | Purpose | Output |
|-------|---------|--------|
| `/onboard` | Analyze sessions and recommend protocols | HTML profile (`~/.claude/.onboard/epistemic-profile.html`) |
| `/dashboard` | Full coverage analytics dashboard | HTML dashboard (`~/.claude/.insights/dashboard.html`) |

## Skills

### /onboard — Protocol Recommendations

Analyzes session files to extract tool usage patterns, maps patterns to protocols, and recommends protocols tailored to actual work.

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
- Starter Trio: Hermeneia `/clarify`, Telos `/goal`, Syneidesis `/gap`
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
│   ├── onboard/SKILL.md          # /onboard protocol recommendations
│   └── dashboard/SKILL.md        # /dashboard coverage dashboard
└── agents/
    ├── project-scanner.md         # Phase 1: project discovery
    ├── session-analyzer.md        # Phase 2: pattern extraction (parallel per project)
    └── coverage-scanner.md        # Insights Phase 2: batch aggregation
```

| Agent | Used By | Role |
|-------|---------|------|
| project-scanner | `/onboard` Phase 1 | Scan `~/.claude/projects/`, select recent projects, read session indices |
| session-analyzer | `/onboard` Phase 2 | Extract tool frequencies, rework indicators, slash command history from JSONL |
| coverage-scanner | `/dashboard` Phase 2 | Aggregate facets, session-meta, and slash command data across all sessions |

## When to Use

| Situation | Skill |
|-----------|-------|
| New to epistemic protocols | `/onboard` |
| Want to see usage analytics | `/dashboard` |
| Need protocol recommendations | `/onboard` |
| Re-evaluating protocol fit after workflow changes | `/onboard` |
| After running `/onboard` for deeper analysis | `/dashboard` |
| Tracking protocol adoption over time | `/dashboard` |

## Usage

```
/onboard
/dashboard
```

## Author

Jongwon Choi (https://github.com/jongwony)
