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

**Same-session reuse**: If dimension-profiler output is already available in this
conversation (from a prior `/sophia` or `/curses` run), skip Phase 1 entirely and
reuse that output. Both skills produce identical profiler results.

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

data_context: session-enriched

Return the dimension profile table with scores, confidence, and raw signals.
```

When `coverage_data` is provided, omit `sample_size` — the profiler derives
dimensions from aggregate data and does not sample raw files.

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

Present the match progressively — start with an accessible introduction, then build
to detailed analysis. Users may not know the philosopher; the opening should stand
on its own without assumed knowledge.

### Step 1: Introduction (always show first)

A warm, 2-3 sentence introduction that explains the match in plain language:

```
Your thinking patterns most resemble the tradition of [Philosopher Name]
([dates], [tradition in one phrase]).

[1-2 sentences: what this philosopher is known for, in terms a non-philosopher
would understand. Connect to the user's actual behavior — not abstract philosophy.]

Similarity: 0.XX | Runner-up: [Name] (0.XX)
```

### Step 2: Dimension profile with explanations

Show dimensions with human-readable explanations (from dimension-profiler output)
so users understand what each bar means:

```
  ──────────────────────────────────────
  D1 How you approach problems:    ████████░░ 78  (hypothesis-first)
  D2 How much you check:          █████████░ 85  (thorough)
  D3 How you interact:            ██████░░░░ 62  (moderate)
  D4 How you govern work:         █████████░ 91  (systematic)
  D5 Where you focus:             ████████░░ 78  (exploring unknowns)
  D6 How you use AI:              █████████░ 88  (distributed thinking)
  ──────────────────────────────────────
  
  Protocol affinity: /[command] ([protocol name] — [Greek])
```

### Step 3: User choice

```
What would you like to explore?
1. **Deep dive** — Why this tradition fits your patterns, and what it reveals
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

1. **Introduction**: 2-3 sentence accessible summary (who is this philosopher, why you match) before the hero card
2. **Hero**: Philosopher name + tradition + archetype subtitle
3. **Radar chart**: 6-dimension profile as visual (CSS-only, no JS library)
4. **Match analysis**: Why this philosopher, in 3-4 bullet points
5. **Dimension breakdown**: Each dimension with score bar, human-readable explanation, measurement basis, and meaning. Use the explanation column from dimension-profiler output (e.g., "How you approach problems") as subtitle for each bar.
6. **Protocol affinity**: Recommended protocols with one-line rationale
7. **Runner-up**: Brief comparison showing where profiles diverge
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
