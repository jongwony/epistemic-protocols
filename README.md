# Epistemic Protocols

Claude Code plugins for epistemic dialogue — transforming **unknown unknowns** into **known unknowns**.

## Protocols

| Protocol | Purpose | Timing |
|----------|---------|--------|
| **[Prothesis](./prothesis)** (πρόθεσις) | Place perspective options before inquiry | Before analysis |
| **[Syneidesis](./syneidesis)** (συνείδησις) | Surface potential gaps at decision points | At decision time |

## Installation

```bash
# Add marketplace
/plugin marketplace add https://github.com/jongwony/epistemic-protocols

# Install what you need
/plugin install prothesis
/plugin install syneidesis
```

## Usage

```
/prothesis [your question]    # Get perspective options before analysis
/syneidesis [your task]       # Enable gap surfacing during execution
```

## Core Idea

Both protocols address the same fundamental problem: **you don't know what you don't know**.

- **Prothesis**: "Which lens should I use to look at this?" → AI presents options, you choose
- **Syneidesis**: "What am I missing?" → AI surfaces gaps as questions, you decide

The key insight: **Recognition over Recall**. It's easier to select from presented options than to generate questions from scratch.
