# Epistemic Protocols

> [한국어](./README_ko.md)

Claude Code plugins for epistemic dialogue — each protocol resolves a specific cognitive deficit through structured human-AI interaction.

## Protocols

| Protocol | Purpose | Timing |
|----------|---------|--------|
| **[Mission](./prothesis)** (πρόθεσις) — Prothesis | Team-based multi-perspective investigation and execution | Before analysis |
| **[Gap](./syneidesis)** (συνείδησις) — Syneidesis | Surface potential gaps at decision points | At decision time |
| **[Clarify](./hermeneia)** (ἑρμηνεία) — Hermeneia | Clarify intent-expression gaps via dialogue | Before action |
| **[Grasp](./katalepsis)** (κατάληψις) — Katalepsis | Achieve certain comprehension of AI work | After AI action |
| **[Goal](./telos)** (τέλος) — Telos | Co-construct defined goals from vague intent | Pre-action |

## Core Idea

Each protocol resolves a distinct cognitive deficit:

```
Protocol = (Deficit, Initiator, Operation, Operand) → Resolution
```

| Protocol | Deficit | Initiator | Operation | Type Signature |
|----------|---------|-----------|-----------|----------------|
| **Mission** | FrameworkAbsent | AI-detected | SELECT | `FrameworkAbsent → FramedInquiry` |
| **Gap** | GapUnnoticed | AI-detected | SURFACE | `GapUnnoticed → AuditedDecision` |
| **Clarify** | IntentMisarticulated | User-initiated | EXTRACT | `IntentMisarticulated → ClarifiedIntent` |
| **Grasp** | ResultUngrasped | User-initiated | VERIFY | `ResultUngrasped → VerifiedUnderstanding` |
| **Goal** | GoalIndeterminate | AI-detected | CO-CONSTRUCT | `GoalIndeterminate → DefinedEndState` |

<img src="./assets/epistemic-matrix.svg" alt="Epistemic Type Transformations" width="560">

- **Mission**: "How should we approach this?" → AI assembles a team, investigates from multiple perspectives, acts on findings (`FrameworkAbsent → FramedInquiry`)
- **Gap**: "What's missing?" → AI surfaces gaps as questions, you judge (`GapUnnoticed → AuditedDecision`)
- **Clarify**: "What do I mean?" → AI presents interpretations, you recognize your intent (`IntentMisarticulated → ClarifiedIntent`)
- **Grasp**: "What did you do?" → AI verifies your understanding through questions (`ResultUngrasped → VerifiedUnderstanding`)
- **Goal**: "What do I actually want?" → AI proposes goals, you shape and approve (`GoalIndeterminate → DefinedEndState`)

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
/plugin install telos
```

## Usage

```
/mission [your question]     # Multi-perspective team investigation and execution
/gap [your task]             # Enable gap surfacing during execution
/clarify [your expression]   # Clarify ambiguous intent
/grasp                       # Verify understanding of AI work
/goal [your vague idea]      # Co-construct defined goals from intent
```

## License

MIT
