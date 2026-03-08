# Analogia — /ground (ἀναλογία)

Validate structural mapping between domains (ἀναλογία: a proportion)

> [한국어](./README_ko.md)

## What is Analogia?

A modern reinterpretation of Greek ἀναλογία (proportion, analogy) — a protocol that **validates whether abstract frameworks actually map to your concrete situation**, producing verified structural correspondences.

### The Core Problem

AI applies patterns, models, and analogies from one domain to another without checking whether the structural correspondence holds. The Strangler Fig migration pattern might sound right — but does it map to your monolith where services share a single database? Abstract advice that doesn't structurally fit your context leads to wasted implementation effort.

### The Solution

**Structural Correspondence over Abstract Assertion**: When AI output contains abstract frameworks applied to your domain, Analogia decomposes both the abstract and concrete domains, constructs explicit mappings between them, and presents concrete instantiations for you to verify. Instead of asserting "this pattern applies," it shows you exactly how each abstract component maps (or fails to map) to your situation.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Prothesis | AI-guided | `FrameworkAbsent → FramedInquiry` |
| Syneidesis | AI-guided | `GapUnnoticed → AuditedDecision` |
| Hermeneia | Hybrid | `IntentMisarticulated → ClarifiedIntent` |
| Telos | AI-guided | `GoalIndeterminate → DefinedEndState` |
| Aitesis | AI-guided | `ContextInsufficient → InformedExecution` |
| **Analogia** | **AI-guided** | **`MappingUncertain → ValidatedMapping`** |
| Prosoche | User-initiated | `ExecutionBlind → SituatedExecution` |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |

**Key differences**:
- **vs. Prothesis**: Prothesis selects which framework to apply when none exists. Analogia validates whether a selected framework structurally maps to your domain.
- **vs. Aitesis**: Aitesis checks if the AI has enough context to execute (factual). Analogia checks if abstract structures preserve when mapped to your context (relational).
- **vs. Epharmoge**: Epharmoge checks post-execution applicability. Analogia checks pre-execution mapping validity between abstraction levels.

**Litmus test**: If the uncertainty is about *whether abstract structure A corresponds to concrete structure B*, it's Analogia. If it's about *whether enough context exists to execute*, it's Aitesis. If it's about *which framework to apply*, it's Prothesis.

## Protocol Flow

```
Phase 0: Gate         → Detect mapping uncertainty in AI output (silent)
Phase 1: Decompose    → Identify abstract + concrete domains, construct structural correspondences
Phase 2: Validate     → Present concrete instantiation for user verification (AskUserQuestion)
Phase 3: Integrate    → Update output with explicit mapping status
```

## Mapping Validation

| Validation | Action |
|------------|--------|
| **Confirm** | Correspondence is correct — mapping validated |
| **Adjust** | Mapping needs refinement — provide feedback, return to Phase 1 |
| **Dismiss** | This correspondence does not need further grounding |

## When to Use

**Use**:
- AI recommends a pattern or architecture but you're unsure it fits your specific codebase
- Abstract advice sounds correct in theory but unclear in your context
- Cross-domain analogy applied without concrete validation
- You want to see "show me how this applies to my case"

**Skip**:
- AI output is already domain-specific with concrete examples
- You already understand the mapping ("I know how this applies")
- No abstract framework is being applied (output is purely concrete)

## Usage

```
/ground [AI output to validate]
```

## Author

Jongwon Choi (https://github.com/jongwony)
