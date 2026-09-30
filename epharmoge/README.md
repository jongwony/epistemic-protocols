# Epharmoge — /contextualize (ἐφαρμογή)

Check a result against everywhere it lands, show every misfit on one sheet, and carry out the fixes you settle (ἐφαρμογή: application, fitting)

> [한국어](./README_ko.md)

## What is Epharmoge?

A modern reinterpretation of Greek ἐφαρμογή (application/fitting) — a protocol that **checks whether a result fits the situation it is applied in**, following it to every place it lands and every intent it was meant to carry, rather than assuming correctness implies fitness. The result can be this session's output or an artifact from elsewhere — another session's work, a document, a plan.

### The Core Problem

A result can be correct and still not apply, because correctness alone doesn't guarantee applicability (`ApplicationDecontextualized`). Environment assumptions, convention mismatches, scope overflow, or an intent the result was meant to carry and does not can make technically correct output inappropriate for the target context. The AI that produced it tends to treat "done" as "fits", and you cannot recall every place it lands — so the gaps stay hidden until they bite.

### The Solution

**Applicability over Correctness**: The AI follows the result to every place it lands — what reads it, its copies and neighbours, its readers, the environment it runs in — and to every intent in the conversation it was meant to carry, observing without changing anything and naming what it could not reach. Every place it does not fit goes on one sheet with its concrete consequence for you; you answer the sheet in one turn — fix it this way, leave it for this reason, stop using it, not this result's to fix. The fixes are carried out, the result is read again, and the run completes when nothing is left open — no closing "done" asked of you. Transforms decontextualized execution into contextualized execution.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Aitesis | AI-guided | `ContextInsufficient → SufficientContext` |
| Merismos | User-initiated | `GoalPlanUncompiled → ConditionBearingUnitPlan` |
| **Epharmoge** | **AI-guided** | **`ApplicationDecontextualized → ContextualizedExecution`** |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |

### Difference from Aitesis

| Aspect | Aitesis | Epharmoge |
|--------|---------|-----------|
| Timing | Before a result exists | Once a result exists |
| Direction | AI collects on its own, hands back the user's unknown | AI checks a result against everywhere it lands and the user's context |
| Axis | Context fitness | Context fitness |
| Deficit | `ContextInsufficient` | `ApplicationDecontextualized` |
| Resolution | `SufficientContext` | `ContextualizedExecution` |

Same axis (context fitness), opposite timing, different object — before a result exists, on what the AI lacks; after, on whether the result fits. Aitesis asks "what can I reach on my own, and what is yours to settle?" — Epharmoge asks "does my execution actually fit the context?" They are complementary, not redundant.

## Protocol Flow

```
Pass     → Observe everywhere the result lands, carry out settled fixes, observe again (silent)
Sheet    → Every misfit at once, with concrete actions, what fits, what was not reached, what changed (one question)
Answer   → Your one turn settles any number of them; the next pass carries them out
Complete → A pass leaves nothing open — the closing sheet, no extra "done"
```

## Mismatch Signals

| Signal | Detection |
|--------|-----------|
| Environment assumption | Result assumes environment state not verified in current context |
| Convention mismatch | Result follows general best practices but project has local conventions |
| Scope overflow | Result addresses more or less than the observed use case requires |
| Temporal context | Result applies to a version, state, or phase that may have shifted |
| Omission | An intent stated in the conversation that the result was meant to carry and does not |

## When to Use

**Use**:
- After a result is produced — by AI, by analysis, by a decision already taken, in this session or another — when applicability to your context is uncertain
- When you want to know whether anything you asked for was left out
- When environment assumptions may not match your target
- When convention mismatches are suspected
- When output scope may overflow the original request

**Skip**:
- When you provided explicit specification and the result follows it exactly
- When execution is trivial or mechanical (formatting, typo fixes)
- When the result is clearly well-fitted to context

## Status

**Conditional** — AI-guided activation (Layer 2) opens only when the AI has detected a mismatch between a result and the context it lands in, and it says that it opened the run. User invocation via `/contextualize` is always available.

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
