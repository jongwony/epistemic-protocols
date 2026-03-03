---
name: insights
description: "Comprehensive usage analytics and epistemic coverage dashboard across all sessions."
---

# Insights Skill

Analyze all Claude Code session data to produce a comprehensive usage analytics dashboard with epistemic protocol coverage metrics, friction analysis, growth timeline, and actionable improvement recommendations.

## When to Use

Invoke this skill when:
- A user wants to see overall epistemic protocol usage metrics across all sessions
- Evaluating protocol coverage: which situations occurred vs. which protocols were used
- Tracking usage growth, friction patterns, and satisfaction trends over time
- After running `/onboard` for deeper, full-dataset analysis

Skip when:
- User wants protocol recommendations (use `/onboard` instead)
- Quick single-protocol question (answer directly)
- No session history exists

## Workflow Overview

```
COLLECT → AGGREGATE → ANALYZE → PRESENT
```

| Phase | Owner | Tool | Decision Point |
|-------|-------|------|----------------|
| 1. Collect | Main | Glob | Inventory + path decision |
| 2. Aggregate | Subagent (coverage-scanner) | Bash, Read, Grep, Glob | Batch data collection |
| 3. Analyze | Main | — | 7 computations |
| 4. Present | Main | Write | HTML dashboard + console summary |

## Data Sources

### Primary: Usage Data Cache

| Source | Method | Extracts |
|--------|--------|----------|
| `~/.claude/usage-data/facets/{session_id}.json` | Glob + Read | friction_counts, friction_detail, goal_categories, session_type, outcome, user_satisfaction_counts |
| `~/.claude/usage-data/session-meta/{session_id}.json` | Glob + Read | tool_counts, git_commits, git_pushes, languages, duration_minutes, start_time, first_prompt |

### Secondary: Session Logs

| Source | Method | Extracts |
|--------|--------|----------|
| `~/.claude/projects/*/sessions-index.json` | Glob + Read | Project-session mapping, session IDs |
| Session JSONL files | Grep `command-name` | Slash command usage history |

## Phase Execution

### Phase 1: Collect (Main)

1. Glob `~/.claude/usage-data/facets/*.json` → inventory facets files
2. Glob `~/.claude/usage-data/session-meta/*.json` → inventory session-meta files
3. Glob `~/.claude/projects/*/sessions-index.json` → project-session mapping
4. Intersect facets ∩ session-meta by filename stem (session_id)
5. Construct session JSONL paths from sessions-index data for slash command scanning
6. **Path decision**: facets ∩ session-meta ≥ 10 → Path A, else Path B

If no facets or session-meta data found: report "No usage data available. Run some Claude Code sessions first, then try `/insights` again." and stop.

### Phase 2: Aggregate (Subagent: coverage-scanner)

**Call coverage-scanner subagent** with:
- `facets_dir`: `~/.claude/usage-data/facets/`
- `session_meta_dir`: `~/.claude/usage-data/session-meta/`
- `session_jsonl_paths`: all session JSONL paths from Phase 1
- `mode`: "path_a" or "path_b" based on Phase 1 decision

The subagent returns aggregated data: friction totals, outcome/satisfaction distributions, tool totals, timeline, slash command usage, code change statistics.

### Phase 3: Analyze (Main) — 7 Computations

#### 3.1 Coverage Computation

For each protocol, determine:
- **situation_occurred**: whether the deficit situation was detected in session data
- **situation_used**: whether the protocol's slash command was actually used

| Protocol | situation_occurred (Path A) | situation_occurred (Path B) |
|----------|---------------------------|---------------------------|
| Telos | friction `wrong_approach` OR vague firstPrompt | vague firstPrompt |
| Hermeneia | friction `misunderstood_request` | rework (3+ edits same file) |
| Syneidesis | friction `excessive_changes` OR (wrong_approach + rework) | rework + high exploration |
| Epitrope | friction `user_rejected_action` | Agent calls present |
| Aitesis | friction `context_loss` | N/A |
| Prosoche | friction `wrong_file_edited` | deploy/push keywords |
| Prothesis | — | exploration ratio ≥ 3:1 |
| Katalepsis | — | verification firstPrompt |
| Epharmoge | — | N/A (conditional protocol) |

situation_used detection: Grep `command-name` results mapped to protocol slash commands:
- `/frame` → Prothesis
- `/gap` → Syneidesis
- `/clarify` → Hermeneia
- `/grasp` → Katalepsis
- `/goal` → Telos
- `/inquire` → Aitesis
- `/calibrate` → Epitrope
- `/attend` → Prosoche
- `/contextualize` → Epharmoge

Coverage ratio per protocol: situation_used / situation_occurred. Protocols with no detected situations = N/A.

#### 3.2 Protocol Usage

Count slash command invocations per protocol from Phase 2 aggregated data. Include first usage date if timeline data available.

#### 3.3 Friction Mapping

Aggregate friction_counts from Phase 2. Map to protocol groups using the Tertiary Mapping Table:

| Friction Key | Protocol Group |
|---|---|
| `wrong_approach` | Telos, Syneidesis |
| `misunderstood_request` | Hermeneia |
| `user_rejected_action` | Epitrope |
| `excessive_changes` | Syneidesis |
| `context_loss` | Aitesis |
| `wrong_file_edited` | Prosoche |
| Others (`buggy_code`, `api_errors`, etc.) | Environmental (no protocol mapping) |

#### 3.4 Growth Timeline

From Phase 2 timeline data:
- Weekly session counts
- Protocol adoption dates (first slash command usage per protocol)
- Cumulative session trend

#### 3.5 Achievements

Compute milestones:
- **Session milestones**: 10, 50, 100, 250, 500 sessions
- **Protocol milestones**: first protocol used, 3+ protocols used, all 8 used
- **Code milestones**: 100 commits, 500 commits
- **Streak**: consecutive days with sessions (from timeline data)

#### 3.6 Satisfaction Score

From user_satisfaction_counts (Path A only):
- Weighted average on 0-100 scale
- Split into first-half / second-half trend comparison

#### 3.7 Quality Score

Composite score (0-100):
- **Outcome** (35%): success ratio from outcome distribution
- **Friction rate** (20%): inverse of friction per session
- **Satisfaction** (25%): weighted satisfaction score
- **Coverage** (20%): average coverage ratio across applicable protocols

### Phase 4: Present (Main)

1. **HTML Dashboard**: Write to `~/.claude/.insights/dashboard.html` via Write tool
   - Refer to `references/html-template.md` for the full HTML skeleton
   - 9 sections: Coverage, Protocol Usage, Friction→Protocol, Improvement Opportunities, Growth Timeline, Achievements, Satisfaction Trends, Quality Score, Quick Actions
   - Path B degradation: Sections 3 (Friction), 7 (Satisfaction), 8 (Quality Score) show "Facets data enables richer analysis" guidance

2. **Console Summary**: Output key metrics:
   - Total sessions analyzed
   - Coverage summary (X/Y protocols with situations detected)
   - Top friction areas
   - Quality score (if available)
   - File path: `~/.claude/.insights/dashboard.html`

## HTML Artifact Guidelines

Refer to `references/html-template.md` for the full HTML skeleton, CSS classes, and detailed artifact guidelines.

## Rules

1. **Privacy**: Never transmit session data externally. All analysis runs locally.
2. **Raw data in subagent**: coverage-scanner subagent returns raw aggregated data only — all computation, mapping, and scoring happen in the main agent.
3. **Evidence-based metrics**: Every metric must be derived from actual data. No estimated or interpolated values.
4. **Graceful degradation**: Path B produces useful output without facets data. Sections requiring facets show clear guidance to obtain richer data.
5. **Idempotent**: Running `/insights` multiple times produces updated results. Previous dashboard is overwritten.
6. **Subagent delegation**: Phase 2 batch aggregation MUST be delegated to coverage-scanner subagent (single). Main agent handles Phases 1, 3, 4.
7. **No protocol recommendations**: `/insights` provides analytics only. For protocol recommendations, direct users to `/onboard`.
