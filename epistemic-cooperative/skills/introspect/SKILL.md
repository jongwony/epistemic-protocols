---
name: introspect
description: "Deep self-analysis pipeline: collects session/rule/usage data, analyzes across 5 dimensions (strength-shadow + Analogia grounding), produces HTML report. User-invoked via /introspect."
---

# Introspect

A self-analysis pipeline that collects behavioral context, identifies patterns, and produces
actionable insights as an HTML report. The pipeline has 4 phases, each building on the previous.

## Pipeline Overview

| Phase | What | Mode | Output |
|-------|------|------|--------|
| 1. Collect | Gather data from 4 sources | 3 parallel inline Task invocations | Raw findings |
| 2. Analyze | Synthesize into profile | AI + user dialogue | Strengths, costs, conflicts |
| 3. Ground | Map to philosophical frameworks | Optional Analogia | Validated mapping |
| 4. Report | Generate HTML report | Automated | `.html` file |

If the user provides a specific question (e.g., "What are my curses?"), orient the analysis
toward answering that question rather than producing a generic profile.

---

## Phase 1: Data Collection

Launch 3 parallel ad-hoc inline Task(general-purpose) invocations. These are not pre-registered
agent files — each is an inline prompt task launched for this pipeline only. Each collects from
different sources and returns structured findings.
All prompts are English per delegation rules; search keywords in quotes are exempt.

### Agent 1: Rules & Configuration

```
PURPOSE: Extract the user's explicitly stated preferences and constraints from their
Claude Code configuration.

COLLECT:
1. Read ~/.claude/CLAUDE.md — extract all stated preferences, principles, and constraints
2. Read all files in ~/.claude/rules/ — extract each rule with its rationale
3. Read ~/.claude/projects/*/memory/MEMORY.md — extract persistent session memory

RETURN FORMAT:
## Stated Preferences
- [preference]: [source file]

## Constraints & Boundaries
- [constraint]: [source file]

## Rule Inventory
- Total rules: N
- Categories: [list]
- Potential redundancies: [if any rules overlap or subsume others]

## Memory Highlights
- [key patterns from session memory]
```

### Agent 2: Usage Patterns (Quantitative)

```
PURPOSE: Extract quantitative behavioral patterns from usage data.

COLLECT:
1. Read ~/.claude/usage-data/report.html — extract key statistics (messages, tools,
   friction types, outcomes, satisfaction, session types)
2. Sample 5-10 facet files from ~/.claude/usage-data/facets/ — extract
   recurring themes, tool usage patterns, satisfaction signals
3. Sample 5-10 session-meta files from ~/.claude/usage-data/session-meta/ —
   extract session types, durations, goal patterns

RETURN FORMAT:
## Quantitative Profile
- Messages: N across M sessions
- Top tools: [ranked list]
- Top goals: [ranked list]
- Outcome distribution: [fully/mostly/partially/not achieved]

## Behavioral Signals
- Session type distribution: [multi-task, iterative, single, exploration]
- Friction patterns: [top 3 with counts]
- Satisfaction distribution

## Notable Patterns
- [3-5 patterns that stand out from the quantitative data]
```

### Agent 3: Session Behavior (Qualitative)

```
PURPOSE: Extract qualitative behavioral patterns from recent session transcripts.

COLLECT:
1. List session files in ~/.claude/projects/ (find recent, large sessions)
2. Sample 3-5 substantive sessions (>50KB) — use Grep to extract:
   - User correction patterns (interruptions, redirections)
   - Decision-making patterns (how user makes choices)
   - Protocol usage patterns (which epistemic protocols, how often)
   - Communication style (directive, collaborative, exploratory)
3. Cross-reference with .insights/ files for existing analysis

RETURN FORMAT:
## Interaction Style
- [3-5 observed patterns with session evidence]

## Decision Patterns
- [how the user approaches decisions, with examples]

## Correction Patterns
- [what the user corrects most often, what triggers corrections]

## Protocol/Tool Preferences
- [which tools/protocols are preferred and when]
```

---

## Phase 2: Pattern Analysis

After all 3 agents return, synthesize findings across 5 dimensions.

### 5-Dimension Framework

Analyze each dimension by cross-referencing data from all 3 agents:

| Dimension | What to look for | Sources |
|-----------|-----------------|---------|
| **Communication Style** | Directive vs collaborative, interruption patterns, feedback style | Agent 1 (rules), Agent 3 (sessions) |
| **Technical Preferences** | Tool choices, language preferences, architecture patterns | Agent 1 (rules), Agent 2 (usage) |
| **Cognitive/Decision Patterns** | Verification depth, risk tolerance, abstraction appetite | Agent 2 (friction), Agent 3 (decisions) |
| **Domain/Context** | Primary work areas, domain switching patterns | Agent 2 (goals), Agent 3 (sessions) |
| **Premise** | Core values, what drives engagement, what causes frustration | All agents |

### Strength-Shadow Analysis

For each strength identified, find its structural cost (the "shadow"):

```
Pattern: [observed strength]
Evidence: [specific data from agents]
Shadow: [structural cost that comes with this strength]
Mechanism: [why the strength produces this specific cost]
```

The key insight: every strength has a shadow, and the shadows often share a common
structure (precision creates new complexity, optimization creates blind spots).

### Conflict Surface

Compare descriptive patterns (what the user actually does, from Agent 2/3) against
prescriptive rules (what the user says to do, from Agent 1). Surface mismatches:

- Rules that the user's own behavior contradicts
- Patterns not captured by any rule
- Rules that may be redundant or subsumable

Present the analysis as text output (strengths, shadows, conflict surface) and
proceed to Phase 3 directly — Phase 1 evidence already establishes pattern existence,
so pre-validation is Extension-eligible for relay-eligible findings. End the Phase 2
output with a visible red-line discovery line so the correction pathway is explicit:
"If any pattern seems misclassified or rules need adjusting, say so — I'll re-derive
from there." Conflict-surface synthesis (rules the user contradicts, redundant rules)
involves intent inference (deliberate exception vs drift), so the discovery line is
required to surface this constitutive layer without a full pre-validation gate. The
user may red-line via free response at any subsequent turn (refine, correct, dismiss
a pattern, or add context); when that happens, regenerate affected downstream
sections on the next turn.

---

## Phase 3: Philosophical Grounding

Map identified patterns to philosophical frameworks, giving the user a conceptual
vocabulary for understanding their cognitive style.

### When to activate

Always offer this phase. If the user accepts, invoke `/analogia:ground` with the key
findings as the grounding target. The Analogia protocol handles mapping validation
through user dialogue.

### Mapping candidates

Common correspondences to consider (not exhaustive):

| Pattern | Candidate frameworks |
|---------|---------------------|
| UU exploration preference | Popper (Critical Rationalism), Peirce (Abduction) |
| AI delegation strategy | Clark & Chalmers (Extended Mind), Ricardo (Comparative Advantage) |
| Openness to new problems | Zen Beginner's Mind, Socratic questioning |
| Verification depth | Aristotelian phronesis, Cartesian doubt |
| System building tendency | Kantian architectonic, Systems thinking |

The Analogia process may refine or reject these candidates. User counter-arguments
are often the most valuable part — as when "curse" was reframed as "strategy"
through an AI-delegation counter-hypothesis.

---

## Phase 4: Report Generation

Generate an HTML report and save to `~/.claude/epistemic-cooperative/introspect/`.

### Design System

Read the existing `~/.claude/usage-data/report.html` to extract the CSS design system.
Match its visual style: Inter font, #f8fafc background, white cards with #e2e8f0 border.
See `references/report-guide.md` for section templates and component patterns.

### Required Sections

1. **At a Glance** — 4-bullet summary (identity, strengths, costs, recommendations)
2. **Philosophical Identity** — 2x2 grid of philosophy cards (if Phase 3 completed)
3. **Division of Labor** — Human-AI role visualization (if applicable)
4. **Strengths** — Green cards with evidence and source dimension tag
5. **Structural Costs** — White cards with severity badge and mitigation strategy
6. **Attitude Recommendations** — Gradient cards, ranked by ROI
7. **Practice Matrix** — Table mapping situations to principles and actions
8. **Extended Mind Health** — Green/yellow/red indicators for monitoring metrics
9. **Next Steps** — Horizon cards with concrete next actions

### Output

Save as `~/.claude/epistemic-cooperative/introspect/cognitive-partnership-profile.html`
(date-stamped variant if previous report exists).
After saving, print the file path so the user can open it manually.

---

## Edge Cases

- **First-time run**: If report.html missing, use CSS from `references/report-guide.md`.
- **Missing data**: Note limitations in the report, focus on available sources.
- **Specific question**: Orient entire analysis toward the question, not a generic profile.
- **Skip grounding**: If user declines Phase 3, proceed directly to Phase 4.
  Philosophical identity section becomes optional in the report.
