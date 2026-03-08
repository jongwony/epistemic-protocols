# Horismos — /bound (ὁρισμός)

Define epistemic boundaries per decision (ὁρισμός: a bounding)

> [한국어](./README_ko.md)

## What is Horismos?

A modern reinterpretation of Greek ὁρισμός (a bounding) — a protocol that **defines epistemic boundaries between user and AI for each decision**, producing a BoundaryMap.

### The Core Problem

Users and AI often operate without clear boundaries about who knows what (`BoundaryUndefined`). This leads to AI assuming expertise the user lacks, or AI asking questions the user expects AI to handle.

### The Solution

**Definition over Assumption**: AI detects boundary-undefined domains and guides the user to define what they know vs. what AI should figure out.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Prothesis | AI-guided | `FrameworkAbsent → FramedInquiry` |
| Syneidesis | AI-guided | `GapUnnoticed → AuditedDecision` |
| Hermeneia | Hybrid | `IntentMisarticulated → ClarifiedIntent` |
| Telos | AI-guided | `GoalIndeterminate → DefinedEndState` |
| **Horismos** | **AI-guided** | **`BoundaryUndefined → DefinedBoundary`** |
| Aitesis | AI-guided | `ContextInsufficient → InformedExecution` |
| Analogia | AI-guided | `MappingUncertain → ValidatedMapping` |
| Prosoche | User-initiated | `ExecutionBlind → SituatedExecution` |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install horismos@epistemic-protocols
```

## Usage

```
/bound [task scope to define boundaries for]
```

## Author

Jongwon Choi (https://github.com/jongwony)
