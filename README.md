# Epistemic Protocols

> [한국어](./README_ko.md)

Claude Code plugins for epistemic dialogue — each protocol resolves a specific cognitive deficit through structured human-AI interaction.

## Protocols

| Protocol | Purpose | Timing |
|----------|---------|--------|
| **[Prothesis](./prothesis)** (πρόθεσις) — /mission | Team-based multi-perspective investigation and execution | Before analysis |
| **[Syneidesis](./syneidesis)** (συνείδησις) — /gap | Surface potential gaps at decision points | At decision time |
| **[Hermeneia](./hermeneia)** (ἑρμηνεία) — /clarify | Clarify intent-expression gaps via dialogue | Before action |
| **[Katalepsis](./katalepsis)** (κατάληψις) — /grasp | Achieve certain comprehension of AI work | After AI action |
| **[Telos](./telos)** (τέλος) — /goal | Co-construct defined goals from vague intent | Pre-action |
| **[Aitesis](./aitesis)** (αἴτησις) — /inquire | Detect context insufficiency before execution | Pre-execution |

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
| **Telos** | GoalIndeterminate | AI-detected | CO-CONSTRUCT | `GoalIndeterminate → DefinedEndState` |
| **Aitesis** | ContextInsufficient | AI-detected | INQUIRE | `ContextInsufficient → InformedExecution` |

<img src="./assets/epistemic-matrix.svg" alt="Epistemic Type Transformations" width="560">

- **Prothesis**: "How should we approach this?" → AI assembles a team, investigates from multiple perspectives, acts on findings (`FrameworkAbsent → FramedInquiry`)
- **Syneidesis**: "What's missing?" → AI surfaces gaps as questions, you judge (`GapUnnoticed → AuditedDecision`)
- **Hermeneia**: "What do I mean?" → AI presents interpretations, you recognize your intent (`IntentMisarticulated → ClarifiedIntent`)
- **Katalepsis**: "What did you do?" → AI verifies your understanding through questions (`ResultUngrasped → VerifiedUnderstanding`)
- **Telos**: "What do I actually want?" → AI proposes goals, you shape and approve (`GoalIndeterminate → DefinedEndState`)
- **Aitesis**: "Am I missing something?" → AI detects its own context insufficiency and inquires for missing information before proceeding (`ContextInsufficient → InformedExecution`)

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
/plugin install aitesis
```

## Usage

```
/mission [your question]     # Multi-perspective team investigation and execution
/gap [your task]             # Enable gap surfacing during execution
/clarify [your expression]   # Clarify ambiguous intent
/grasp                       # Verify understanding of AI work
/goal [your vague idea]      # Co-construct defined goals from intent
/inquire [your task]          # Detect and resolve context insufficiency before execution
```

## License

MIT
