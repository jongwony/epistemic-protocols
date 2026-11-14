# Epharmoge — /contextualize (ἐφαρμογή)

See again what was said or settled along the way and did not reach a result — what was wrongly applied fixed and reread, what is yours to judge handed back with a proposal (ἐφαρμογή: application, fitting)

> [한국어](./README_ko.md)

## What is Epharmoge?

A modern reinterpretation of Greek ἐφαρμογή (application/fitting) — a protocol that **fits a result back to the context that was meant to reach it**. It recovers what was said and settled along the way, follows the result to every place it lands, corrects what the context had already settled, and hands back what only you can judge. The result can be this session's output or an artifact from elsewhere — another session's work, a document, a plan.

### The Core Problem

Context never reaches its target whole (`ApplicationDecontextualized`). While your focus moves between things, the conversation grows long, or work changes hands, part of what you said and settled falls away from the result: a decision that was never carried in, a rule that was not read, a purpose that got lost, an environment the result does not match. The AI that produced the result tends to treat "done" as "fits", and you cannot recall everything you said or every place the result lands — so the drift stays hidden until it bites.

### The Solution

**Recover, correct, hand back**: The AI recovers what was meant to reach the result — your words, decisions and purposes, the rules the result answers to — and follows the result to every place it lands, observing without changing anything and naming what it could not reach. Then it tells two things apart. Where the context already settles what is right and the result departs from it, the AI fixes the result and reads it again without asking, and tells you what settled it. Where something fell out of view and what it means now is yours to judge, the AI lays it out again — where you said it, what its absence means for you — with concrete actions and the one it would take. Each pass returns one sheet: no answer is owed, and no closing "done" is asked. If you answer, in your own words or with "as proposed", the next pass carries it out. Transforms decontextualized execution into contextualized execution.

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
| Direction | AI collects on its own, hands back the user's unknown | AI recovers what was meant to reach a result, corrects what is settled, hands back what is the user's to judge |
| Axis | Context fitness | Context fitness |
| Deficit | `ContextInsufficient` | `ApplicationDecontextualized` |
| Resolution | `SufficientContext` | `ContextualizedExecution` |

Same axis (context fitness), opposite timing, different object — before a result exists, on what the AI lacks; after, on what did not reach the result. Aitesis asks "what can I reach on my own, and what is yours to settle?" — Epharmoge asks "what did this result — mine or anyone's — lose on the way, and does it fit where it lands?" Both settle what the AI can settle and hand the rest back to you. They are complementary, not redundant.

## Protocol Flow

```
Pass    → Recover what was meant to reach the result, observe everywhere it lands, carry out what is settled and read each change back (silent)
Sheet   → What was corrected and what settled it; what is yours, with concrete actions and the one the AI would take; what fits; what was not reached
Return  → One sheet per pass — no answer owed, no "done" asked
Answer  → If you give one, the next pass carries it out and returns a new sheet
```

## Mismatch Signals

| Signal | Detection |
|--------|-----------|
| Environment assumption | Result assumes environment state not verified in current context |
| Convention mismatch | Result follows general best practices but project has local conventions |
| Scope overflow | Result addresses more or less than the observed use case requires |
| Temporal context | Result applies to a version, state, or phase that may have shifted |
| Omission | An intent stated in the conversation that the result was meant to carry and does not |
| Decision drift | A decision made earlier — before a long stretch of other work, in another session, in a review — that the result does not carry |

## When to Use

**Use**:
- After a long session, or one where your focus moved between several things, when you want to know what the result lost along the way
- When work comes back from another session, an agent, a review or a merge, and you want to know whether what you settled reached it
- When you want to know whether anything you asked for was left out
- When environment assumptions or local conventions may not match where the result lands

**Skip**:
- When the result follows one explicit specification and nothing else was said around it
- When execution is trivial or mechanical (formatting, typo fixes)

## Status

**Conditional** — AI-guided activation (Layer 2) opens only when the AI has detected that something meant to reach a result did not, or that the result does not fit where it lands, and it says that it opened the run. User invocation via `/contextualize` is always available.

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
