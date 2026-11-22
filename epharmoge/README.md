# /contextualize — Epharmoge (ἐφαρμογή)
<a name="epharmoge--contextualize-ἐφαρμογή"></a>

> [한국어](./README_ko.md)

## What is /contextualize?

### Definition
<a name="what-is-epharmoge"></a>

Epharmoge (ἐφαρμογή) means application or fitting. It is a protocol that checks a result against everything you said and settled along the way and every place the result is used, fixes what an earlier decision or rule already settles, and hands back what only you can judge. The result can be this session's output or an artifact from elsewhere — another session's work, a document, or a plan.

### The problem
<a name="the-core-problem"></a>
<a name="when-to-use"></a>

When your focus moves between several things, a conversation grows long, or work comes back from another session, agent, review, or merge, part of what you said and decided can fall away from the result. A rule went unread, a decision never carried over, or the result assumes an environment or convention that does not match where it lands. The AI that produced the result tends to treat "done" as "fits", and you cannot recall everything you said or every place the result lands. Skip `/contextualize` when the result follows one explicit specification with nothing else said around it, or when the change is mechanical (formatting, typo fixes).

### The result

Each pass returns one sheet showing what was fixed and what settled it, what is yours to judge with a proposed action, what already fits, and what could not be reached. You owe no reply, and no closing "done" is asked. If you answer — in your own words or with "as proposed" — the next pass carries it out and returns a new sheet.

## Install
<a name="install"></a>

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install epharmoge@epistemic-protocols
```

## Usage
<a name="usage"></a>
<a name="the-solution"></a>
<a name="status"></a>

```
/contextualize
```

The AI can also open `/contextualize` on its own when it detects that something meant to reach a result did not, or that the result does not fit where it lands; when it does, it tells you that it opened the run.

After `/contextualize` runs, the AI recovers what was meant to reach the result — your words, decisions, and purposes, and the rules the result answers to. The AI first checks where the result is used without changing those places, naming anything it could not reach. If an earlier decision or rule settles a mismatch, it fixes the result and checks the change, and tells you what settled it. Where something fell out of view and what it means now is yours to judge, the AI lays out where you said it and what its absence means for you, along with concrete actions and the one it would take.

<details>
<summary>Protocol flow and mismatch signals</summary>

<a name="protocol-flow"></a>
### Protocol Flow

```
Pass    → Recover what was meant to reach the result, observe everywhere it lands, carry out what is settled and read each change back (silent)
Sheet   → What was corrected and what settled it; what is yours, with concrete actions and the one the AI would take; what fits; what was not reached
Return  → One sheet per pass — no answer owed, no "done" asked
Answer  → If you give one, the next pass carries it out and returns a new sheet
```

<a name="mismatch-signals"></a>
### Mismatch Signals

| Signal | Detection |
|--------|-----------|
| Environment assumption | Result assumes environment state not verified in current context |
| Convention mismatch | Result follows general best practices but project has local conventions |
| Scope overflow | Result addresses more or less than the observed use case requires |
| Temporal context | Result applies to a version, state, or phase that may have shifted |
| Omission | An intent stated in the conversation that the result was meant to carry and does not |
| Decision drift | A decision made earlier — before a long stretch of other work, in another session, in a review — that the result does not carry |

</details>

<details>
<summary>Comparison with other protocols</summary>

**Epharmoge** (ἐφαρμογή, application / fitting) fits a result back to the context that was meant to reach it, transforming decontextualized execution (`ApplicationDecontextualized`) into contextualized execution (`ContextualizedExecution`). AI-guided activation (Layer 2) is conditional on detecting an actual loss or misfit.

<a name="difference-from-other-protocols"></a>
### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Aitesis | AI-guided | `ContextInsufficient → SufficientContext` |
| Merismos | User-initiated | `GoalPlanUncompiled → ConditionBearingUnitPlan` |
| **Epharmoge** | **AI-guided** | **`ApplicationDecontextualized → ContextualizedExecution`** |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |

<a name="difference-from-aitesis"></a>
### Difference from Aitesis

| Aspect | Aitesis | Epharmoge |
|--------|---------|-----------|
| Timing | Before a result exists | Once a result exists |
| Direction | AI collects on its own, hands back the user's unknown | AI recovers what was meant to reach a result, corrects what is settled, hands back what is the user's to judge |
| Axis | Context fitness | Context fitness |
| Deficit | `ContextInsufficient` | `ApplicationDecontextualized` |
| Resolution | `SufficientContext` | `ContextualizedExecution` |

Same axis (context fitness), opposite timing, different object: Aitesis asks what the AI lacks before a result exists; Epharmoge asks what a result lost on the way and whether it fits where it lands.

</details>

## Author
<a name="author"></a>

Jongwon Choi (https://github.com/jongwony)
