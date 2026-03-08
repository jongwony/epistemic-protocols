# Reflexion — /reflect

Cross-session learning for Claude Code

> [한국어](./README_ko.md)

## What is Reflexion?

From Latin *reflexio* ("bending back") — a skill that **extracts actionable insights from Claude Code sessions into persistent memory**, enabling cross-session learning.

### The Core Problem

Session knowledge is ephemeral — insights, patterns, and preferences discovered during work are lost when the session ends. Without structured extraction, each session starts from zero.

### The Solution

**Crystallization over Accumulation**: Distill structured insights through guided dialogue; do not merely archive raw experience. Parallel agents extract, user selects, system integrates.

## Flow

```
Session → Context → ∥Extract → Select → Integrate → Verify
```

```
Phase 1: Context Detection  → Identify session path and memory mode
Phase 2: Parallel Extraction → 3 agents extract concurrently (session-summarizer, insight-extractor, knowledge-finder)
Phase 3: Guided Selection    → User chooses which insights to keep (call AskUserQuestion)
Phase 4: Integration         → Write selected insights to memory (Tier A: MEMORY.md, Tier B: .insights/)
Phase 5: Verification        → Confirm integration and cleanup
```

## Architecture

```
reflexion/
├── skills/reflexion/SKILL.md    # Full workflow definition
├── agents/
│   ├── session-summarizer.md    # Generates session summary
│   ├── insight-extractor.md     # Extracts actionable insights with evidence
│   └── knowledge-finder.md      # Searches existing memory for related knowledge
├── commands/
│   ├── reflect.md               # Full extraction with user selection
│   └── quick-reflect.md         # Quick summary without saving
└── references/                  # Formal semantics, memory hierarchy, error handling
```

Phase 2 launches all three agents in parallel (`run_in_background: true`). Each agent writes its output to a handoff directory; Phase 3 reads these files to present a unified selection interface.

## Commands

| Command | Purpose |
|---------|---------|
| `/reflect` | Full extraction pipeline with guided insight selection |
| `/quick-reflect` | Quick session summary without saving to memory |

## Memory Tiers

| Tier | Target | Loaded | Use |
|------|--------|--------|-----|
| A | `MEMORY.md` | Every session | Recurring patterns, architecture decisions, conventions |
| B | `.insights/` | On demand | Archival knowledge, domain references, detailed notes |

## When to Use

**Use**:
- After completing a significant coding session
- When you want to capture decisions, patterns, or debugging insights
- Before switching to a different project
- When recurring patterns should persist across sessions

**Skip**:
- Trivial sessions with no meaningful insights
- When insights are already documented elsewhere

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install reflexion@epistemic-protocols
```

## Usage

```
/reflect
/quick-reflect
```

## Author

Jongwon Choi (https://github.com/jongwony)
