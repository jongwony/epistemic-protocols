# Epharmoge — /contextualize (ἐφαρμογή)

Detect application-context mismatch after execution (ἐφαρμογή: application, fitting)

> [한국어](./README_ko.md)

## What is Epharmoge?

A modern reinterpretation of Greek ἐφαρμογή (application/fitting) — a protocol that **detects when technically correct AI output may not fit the actual application context**, surfacing mismatches with evidence for user judgment rather than assuming correctness implies fitness.

### The Core Problem

AI produces correct results, but correctness alone doesn't guarantee applicability (`ApplicationDecontextualized`). Environment assumptions, convention mismatches, or scope overflow can make technically correct output inappropriate for the target context. Without post-execution applicability verification, users inherit hidden context gaps.

### The Solution

**Applicability over Correctness**: After execution, AI evaluates whether the result fits the application context. When mismatches are detected, they are surfaced with evidence — the user judges whether adaptation is needed. Transforms decontextualized execution into contextualized execution.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Prothesis | AI-guided | `FrameworkAbsent → FramedInquiry` |
| Syneidesis | AI-guided | `GapUnnoticed → AuditedDecision` |
| Hermeneia | Hybrid | `IntentMisarticulated → ClarifiedIntent` |
| Telos | AI-guided | `GoalIndeterminate → DefinedEndState` |
| Aitesis | AI-guided | `ContextInsufficient → InformedExecution` |
| Prosoche | User-initiated | `ExecutionBlind → SituatedExecution` |
| **Epharmoge** | **AI-guided** | **`ApplicationDecontextualized → ContextualizedExecution`** |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |

### Difference from Aitesis

| Aspect | Aitesis | Epharmoge |
|--------|---------|-----------|
| Timing | Pre-execution | Post-execution |
| Direction | User → AI (context provision) | AI → User (applicability check) |
| Axis | Context fitness | Context fitness |
| Deficit | `ContextInsufficient` | `ApplicationDecontextualized` |
| Resolution | `InformedExecution` | `ContextualizedExecution` |

Same axis (context fitness), opposite timing, opposite direction. Aitesis asks "do I have enough context to execute well?" — Epharmoge asks "does my execution actually fit the context?" They are complementary, not redundant.

## Protocol Flow

```
Phase 0: Applicability Gate → Evaluate result against context (silent)
Phase 1: Mismatch Surfacing → Present evidence (call AskUserQuestion)
Phase 2: Result Adaptation  → Apply user-directed adaptation
```

## Mismatch Signals

| Signal | Detection |
|--------|-----------|
| Environment assumption | Result assumes environment state not verified in current context |
| Convention mismatch | Result follows general best practices but project has local conventions |
| Scope overflow | Result addresses more or less than the observed use case requires |
| Temporal context | Result applies to a version, state, or phase that may have shifted |

## When to Use

**Use**:
- After AI execution when applicability to your context is uncertain
- When environment assumptions may not match your target
- When convention mismatches are suspected
- When output scope may overflow the original request

**Skip**:
- When you provided explicit specification and the result follows it exactly
- When execution is trivial or mechanical (formatting, typo fixes)
- When the result is clearly well-fitted to context

## Status

**Conditional** — AI-guided activation (Layer 2) requires Aitesis operational experience to validate the pre/post context fitness axis. User invocation via `/contextualize` is always available regardless of this gate.

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install epharmoge@epistemic-protocols
```

## Usage

```
/contextualize
```

## Author

Jongwon Choi (https://github.com/jongwony)
