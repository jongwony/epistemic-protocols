---
name: curses
description: "Discover the structural costs hidden in your strengths through behavioral dimension analysis, strength-shadow extraction, and attitude recommendations."
---

# Curses

Discover the structural costs hidden in your strengths.

> Every strength casts a shadow. The shadow is not a flaw —
> it is the structural cost of a capability. Understanding the
> cost transforms a curse into a conscious trade-off.

## When to Use

Invoke this skill when:
- Discovering structural costs hidden in your strengths
- Analyzing behavioral patterns for self-improvement recommendations
- Generating attitude principles and practice matrix
- Reflective questions about working patterns and their trade-offs

Skip when:
- Exploring philosophical tradition match (use /sophia instead)
- Quick single-protocol question (answer directly)
- No session history exists and user prefers manual exploration

## Pipeline

| Phase | What | Mode |
|-------|------|------|
| 1. Collect | Gather behavioral data | dimension-profiler agent |
| 2. Analyze | Strength-Shadow extraction | AI + user dialogue |
| 3. Recommend | Attitude principles + practice matrix | AI proposes |
| 4. Report | Generate HTML report | Automated |

If the user provides a specific question (e.g., "What are my curses?"),
orient the analysis toward that question.

---

## Phase 1: Data Collection

Two-step delegation (same pipeline as `/sophia`):

**Step 1**: Run `coverage-scanner` agent (see `agents/coverage-scanner.md`) to get
pre-aggregated session data (protocol counts, friction, session types, tools).

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

If a dimension's confidence is "low", include it in the analysis but mark it
as provisional and note this in the report.

---

## Phase 2: Strength-Shadow Analysis

From the dimension profile, identify strengths and their structural costs.

### Extraction method

For each dimension scoring above 65 (or below 35 — extremes in either direction):

1. **Name the strength**: What capability does this extreme enable?
2. **Find the shadow**: What structural cost does this extreme create?
3. **Identify the mechanism**: Why does this strength produce this specific cost?
4. **Rate severity**: structural (inherent), recurring (frequent), or conditional (context-dependent)
5. **Cite evidence**: Link to specific data from the dimension profiler

### Common strength-shadow patterns

These are heuristic starting points, not fixed outputs. Adapt based on actual data.

| Dimension extreme | Strength | Shadow |
|-------------------|----------|--------|
| D2 high (Doubt) | Catches errors early | Verification depth becomes opportunity cost |
| D4 high (Systematic) | Consistent governance | Rule accumulation creates complexity |
| D5 high (UU) | Discovers new patterns | May defer KK maintenance |
| D6 high (Extended Mind) | Effective delegation | Curse activates on delegation failure |
| D1 high (Abductive) | Creative hypothesis | May skip systematic validation |
| D3 high (Dialogical) | Deep understanding | Extended exchanges consume time |

### Cross-dimensional patterns

Look for patterns that emerge from dimension COMBINATIONS:

- **D2 high + D4 high**: "The cure-as-disease pattern" — each verification failure
  produces a new rule, which accumulates
- **D5 high + D6 high**: "Extended Mind strategy" — UU preference + AI delegation
  may be a strategy, not a curse (validate with user)
- **D1 high + D2 high**: "Bold conjecture + rigorous refutation" — Popperian pattern,
  strong if balanced

### Dual-interpretation guidance (cold-start awareness)

When presenting strength-shadow pairs, some combinations may be either a curse OR
a deliberate strategy. In context-rich sessions, the user may have already articulated
this distinction. In cold-start sessions, the AI must proactively surface both
interpretations before the user validates.

Patterns that require dual-interpretation:
- **D5 high + D6 high**: Could be "KK neglect via over-delegation" OR "deliberate
  Extended Mind strategy with quality bridges"
- **D2 high + D4 high**: Could be "cure-as-disease accumulation" OR "systematic
  verification infrastructure that scales"

When presenting these, frame as: "This pattern admits two readings — [curse
interpretation] or [strategy interpretation]. Which better describes your
experience?" The user's response determines downstream recommendations.

### User dialogue

When presenting dimensions to the user, always include the human-readable explanation
from the dimension-profiler output (e.g., "D4 Rule Orientation — how you govern work")
so users unfamiliar with the framework understand what each dimension measures.

Present the top 3-4 strength-shadow pairs and ask the user to validate.
The user may:
- Confirm a finding
- Reframe it (as we saw: "curse" to "strategy")
- Dismiss it as not applicable
- Add context that changes the analysis

User counter-evidence that changes the structural category (e.g., flaw to strategy)
requires re-derivation of downstream recommendations.

---

## Phase 3: Recommendations

From validated strength-shadow pairs, derive:

### Attitude principles (max 4)

Each principle addresses a specific shadow:

```
Principle N — [Title]

[2-3 sentence explanation of the principle and why it addresses this shadow]

Application:
[Concrete, actionable guidance for daily practice]
```

Rank by ROI — which principle would have the highest impact if adopted?
Mark the highest-ROI principle explicitly.

### Practice matrix

Map principles to concrete situations:

| Situation | Principle | Action | Trigger |
|-----------|-----------|--------|---------|
| When X happens | Principle N | Do Y | Z condition |

Include 4-6 rows covering the most common situations.

---

## Phase 4: Report Generation

Generate an HTML report following the cooperative's design system.

### Design system source

Read one of:
- `~/.claude/usage-data/report.html` — extract CSS
- Cooperative's `skills/report/references/html-template.md` — use as template basis
- `skills/curses/references/report-template.md` — curses-specific components

### Context awareness

Check the dimension-profiler's `Data Context` field:
- **session-enriched**: Report may reference protocol chaining results, prior
  /sophia output, or session-specific observations. Include these in relevant sections.
- **data-only**: Report is generated purely from behavioral data. Do not reference
  protocol interactions or session-specific context that doesn't exist. Keep
  analysis grounded in the dimension scores and raw signals.

Mark the report subtitle with the context tier (e.g., "708 sessions | data-only"
or "708 sessions | session-enriched").

### Required sections

1. **At a Glance** — 3-4 bullet summary with section links
2. **Dimension Profile** — 6 horizontal bars with scores and human-readable explanation per dimension
3. **Strengths** — Green cards with evidence and dimension tag
4. **Structural Costs** — White cards with severity badge and mitigation
5. **Attitude Recommendations** — Gradient cards ranked by ROI
6. **Practice Matrix** — Situation to principle to action table
7. **Health Indicators** — Green/yellow/red dots for monitored vs unmonitored areas
8. **Next Steps** — 2-3 concrete horizon cards

### Optional sections (if /sophia was run in same session)

If the dimension profile and philosopher match are available from a prior
`/sophia` run in this session, include:

- **Philosophical Identity** — 2x2 grid of philosophy cards
- **Division of Labor** — Human-AI role visualization

### Output

Save to `~/.claude/usage-data/curses-profile.html`
Open in browser: `open <filepath>`

---

## Edge Cases

- **New user (<5 sessions)**: Analyze rules only. Present as "Configuration-based
  profile — behavioral data will improve accuracy over time."
- **No extreme dimensions (all 35-65)**: "Your profile is notably balanced.
  This is itself a strength (Aristotelian phronesis) with its own shadow:
  you may lack the specialization that comes from extreme focus."
- **User reframes curse as strategy**: Accept the reframe. Update the
  strength-shadow pair to reflect the new category. Re-derive recommendations
  from the updated structure.
- **Specific question provided**: Orient the entire analysis toward answering
  that question. The report sections should reflect the specific inquiry.
