---
name: sophia
description: "Discover your philosophical tradition through behavioral dimension analysis and philosopher matching."
---

# Sophia (σοφία)

Discover your philosophical tradition through behavioral pattern analysis.

> φιλο-σοφία = "love of wisdom"
> Your conversation patterns carry the fingerprint of a philosophical tradition.

## When to Use

Invoke this skill when:
- Exploring which philosophical tradition your AI conversation patterns resemble
- Analyzing behavioral dimensions across sessions for epistemic style profiling
- Generating a visual philosopher match profile card

Skip when:
- Analyzing strengths and structural costs (use /curses instead)
- Quick single-protocol question (answer directly)
- No session history exists and user prefers manual exploration

## Pipeline

| Phase | What | Mode |
|-------|------|------|
| 1. Collect | Gather behavioral data from sessions | dimension-profiler agent |
| 2. Match | Map dimension profile to philosophers | AI analysis |
| 3. Present | Dual-layer result + protocol affinity | Gate interaction |
| 4. Report | Generate HTML profile card | Automated |

---

## Phase 1: Data Collection

Two-step delegation: first run `coverage-scanner` for pre-aggregated data, then pass
the result to `dimension-profiler` for dimension scoring. This avoids duplicate file
reading and gives the profiler access to protocol usage counts.

**Step 1**: Run `coverage-scanner` agent (see `agents/coverage-scanner.md`):
```
Aggregate facets, session-meta, and slash command data across all sessions.
Return structured coverage data including protocol_counts, friction_summary,
session_type_distribution, tool_counts, and satisfaction_distribution.
```

**Step 2**: Pass coverage output to `dimension-profiler` agent (see `agents/dimension-profiler.md`):
```
Analyze this user's behavioral dimensions from their session data.

coverage_data: [paste coverage-scanner output here]

data_sources:
  rules_dir: ~/.claude/rules/
  claude_md: ~/.claude/CLAUDE.md
  settings_json: ~/.claude/settings.json

sample_size: 20

Return the dimension profile table with scores, confidence, and raw signals.
```

If coverage-scanner returns no data (new user with no sessions), skip Step 1 and
run dimension-profiler with `data_sources` only (rules + CLAUDE.md). Note reduced
confidence in results.

---

## Phase 2: Philosopher Matching

Read `references/philosophers.md` for the full philosopher database.

### Matching process

1. Compute similarity score for each philosopher against the user's profile
2. Identify the top match (highest similarity) and runner-up
3. For the top match, identify:
   - **Primary alignment**: Which dimension drives the match
   - **Divergence points**: Where the user differs from the philosopher
   - **Protocol affinity**: Which epistemic protocol aligns with this tradition

### Confidence levels

| Data quality | Match confidence |
|-------------|-----------------|
| 20+ facets sampled, all dimensions measured | High |
| 10-19 facets, most dimensions measured | Medium |
| <10 facets or rules-only analysis | Low — note limitations |

---

## Phase 3: Presentation

Present the match as dual-layer (philosopher name as hero, archetype as subtitle).

### Format

```
◆ [Philosopher Name] ([Tradition])

  [2-sentence description of the match — what behavioral patterns align
  and why this tradition fits]

  ──────────────────────────────────────
  Dimensions:
  D1 Inquiry:       ████████░░ 78  (abductive)
  D2 Verification:  █████████░ 85  (doubt-oriented)
  D3 Communication: ██████░░░░ 62  (moderate)
  D4 Rule:          █████████░ 91  (systematic)
  D5 Attention:     ████████░░ 78  (UU-leaning)
  D6 Delegation:    █████████░ 88  (extended mind)
  ──────────────────────────────────────
  
  Protocol affinity: /[command] ([protocol name] — [Greek])
  
  Runner-up: [Name] ([tradition]) — similarity: 0.XX
```

Then offer the user a choice:

```
What would you like to explore?
1. **Deep dive** — Detailed analysis of why this tradition fits your patterns
2. **Compare** — Side-by-side with the runner-up
3. **Protocol** — Try the suggested protocol now
4. **Report** — Generate HTML profile card
```

---

## Phase 4: Report Generation

If the user selects "Report", generate an HTML profile card.

### Report structure

Read the existing CSS design system from `~/.claude/usage-data/report.html` or
use the design tokens from the cooperative's dashboard/report templates.

**Sections**:

1. **Hero**: Philosopher name + tradition + archetype subtitle
2. **Radar chart**: 6-dimension profile as visual (CSS-only, no JS library)
3. **Match analysis**: Why this philosopher, in 3-4 bullet points
4. **Dimension breakdown**: Each dimension with score bar, measurement basis, and meaning
5. **Protocol affinity**: Recommended protocols with one-line rationale
6. **Runner-up**: Brief comparison showing where profiles diverge

**File**: Save to `~/.claude/usage-data/sophia-profile.html`
Open in browser: `open <filepath>`

### CSS radar chart (no JS dependency)

Use CSS `clip-path: polygon(...)` with computed vertices for a hexagonal radar chart.
Each vertex position is calculated from the dimension score (0-100 mapped to center-to-edge).

---

## Edge Cases

- **New user (<5 sessions)**: Analyze rules/CLAUDE.md only. Present as "Early profile —
  based on configuration, not yet behavioral data." Confidence: Low.
- **Balanced profile (all 40-60)**: Use composite archetypes from philosophers.md.
  Present as "The Balanced Practitioner (Aristotelian phronesis)" with explanation
  that balance itself is a philosophical position.
- **No clear match (all similarities <0.55)**: Present top 2 as "Your profile
  doesn't strongly align with a single tradition — you may be synthesizing
  multiple approaches." Offer composite archetype.
- **Missing dimensions**: If a dimension can't be computed (no data), mark as
  "unmeasured" and exclude from matching. Note which dimensions are missing.
