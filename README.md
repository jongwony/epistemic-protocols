# Epistemic Protocols

> [한국어](./README_ko.md)

Claude Code plugins for epistemic dialogue — transforming **unknown unknowns** into **known unknowns**.

## Protocols

| Protocol | Purpose | Timing |
|----------|---------|--------|
| **[Prothesis](./prothesis)** (πρόθεσις) | Place perspective options before inquiry | Before analysis |
| **[Syneidesis](./syneidesis)** (συνείδησις) | Surface potential gaps at decision points | At decision time |
| **[Hermeneia](./hermeneia)** (ἑρμηνεία) | Clarify intent-expression gaps via dialogue | User-initiated |
| **[Katalepsis](./katalepsis)** (κατάληψις) | Achieve certain comprehension of AI work | After AI action |

## Core Idea

All protocols share a core transformation pattern:

- **Prothesis**: "Which lens?" → AI presents options, you choose (**Unknown Unknown → Known Unknown**)
- **Syneidesis**: "What's missing?" → AI surfaces gaps as questions, you judge (**Unknown Unknown → Known Unknown**)
- **Hermeneia**: "What do I mean?" → AI presents interpretations, you recognize your intent (**Known Unknown → Known Known**)
- **Katalepsis**: "What did you do?" → AI verifies your understanding through questions (**Unknown Known → Known Known**)

The key insight: **Recognition over Recall**. It's easier to select from presented options than to generate questions from scratch.

## Installation

```bash
# Add marketplace
/plugin marketplace add https://github.com/jongwony/epistemic-protocols

# Install what you need
/plugin install prothesis
/plugin install syneidesis
/plugin install hermeneia
/plugin install katalepsis
```

## Usage

```
/prothesis [your question]    # Get perspective options before analysis
/syneidesis [your task]       # Enable gap surfacing during execution
/hermeneia [your expression]  # Clarify ambiguous intent
/katalepsis                   # Verify understanding of AI work
```

## License

MIT
