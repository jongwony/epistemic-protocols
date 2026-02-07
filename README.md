# Epistemic Protocols

> [한국어](./README_ko.md)

Claude Code plugins for epistemic dialogue — each protocol resolves a specific cognitive deficit through structured human-AI interaction.

## Protocols

| Protocol | Purpose | Timing |
|----------|---------|--------|
| **[Prothesis](./prothesis)** (πρόθεσις) | Place perspective options before inquiry | Before analysis |
| **[Syneidesis](./syneidesis)** (συνείδησις) | Surface potential gaps at decision points | At decision time |
| **[Hermeneia](./hermeneia)** (ἑρμηνεία) | Clarify intent-expression gaps via dialogue | Before action |
| **[Katalepsis](./katalepsis)** (κατάληψις) | Achieve certain comprehension of AI work | After AI action |

## Core Idea

Each protocol resolves a distinct cognitive deficit:

```
Protocol = (Deficit, Initiator, Operation, Operand) → Resolution
```

| Protocol | Deficit | Initiator | Operation | Type Signature |
|----------|---------|-----------|-----------|----------------|
| **Prothesis** | FrameworkAbsent | AI-detected | SELECT | `FrameworkAbsent → FramedInquiry` |
| **Syneidesis** | GapUnnoticed | AI-detected | SURFACE | `GapUnnoticed → AuditedDecision` |
| **Hermeneia** | IntentMisarticulated | User-initiated | EXTRACT | `IntentMisarticulated → ClarifiedIntent` |
| **Katalepsis** | ResultUngrasped | User-initiated | VERIFY | `ResultUngrasped → VerifiedUnderstanding` |

<img src="./assets/epistemic-matrix.svg" alt="Epistemic Type Transformations" width="560">

- **Prothesis**: "Which lens?" → AI presents options, you choose (`FrameworkAbsent → FramedInquiry`)
- **Syneidesis**: "What's missing?" → AI surfaces gaps as questions, you judge (`GapUnnoticed → AuditedDecision`)
- **Hermeneia**: "What do I mean?" → AI presents interpretations, you recognize your intent (`IntentMisarticulated → ClarifiedIntent`)
- **Katalepsis**: "What did you do?" → AI verifies your understanding through questions (`ResultUngrasped → VerifiedUnderstanding`)

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
