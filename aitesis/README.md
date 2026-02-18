# Aitesis — /inquire (αἴτησις)

Detect context insufficiency before execution (αἴτησις: a requesting)

> [한국어](./README_ko.md)

## What is Aitesis?

A modern reinterpretation of Greek αἴτησις (a requesting) — a protocol that **detects when AI lacks sufficient context and inquires about what's missing before proceeding, rather than assuming defaults silently**.

### The Core Problem

AI systems often proceed with execution despite insufficient context (`ContextInsufficient`) — environment constraints have changed, user dissatisfaction patterns go unaddressed, the same action fails repeatedly, or earlier assumptions no longer hold. Silent assumptions lead to wasted effort and compounding errors.

### The Solution

**Inquiry over Assumption**: When AI detects indicators of context insufficiency, it surfaces structured mini-choices for the user to resolve, dismiss, or override. Transforms insufficient context into informed execution through targeted inquiry.

### Difference from Other Protocols

| Protocol | Mode | Type Signature |
|----------|------|---------------|
| Syneidesis | SURFACE | `GapUnnoticed → AuditedDecision` |
| **Aitesis** | **INQUIRE** | **`ContextInsufficient → InformedExecution`** |

**Key distinction**: Syneidesis surfaces gaps at decision points for the user to judge (metacognitive — monitoring the user's decision quality). Aitesis detects the AI's own context insufficiency before execution (heterocognitive — "do I have enough context?").

## Protocol Flow

```
Phase 0: Gate           → Detect context insufficiency indicators (silent)
Phase 1: Surfacing      → Present highest-priority gap candidate (call AskUserQuestion)
Phase 2: Integration    → Update execution plan with user's resolution
```

## Gap Types

| Type | Example |
|------|---------|
| ConstraintDrift | "The config has changed since we discussed this — should we..." |
| DissatisfactionSignal | "I notice you've corrected this several times — would you like to..." |
| FailurePattern | "This approach has failed repeatedly — the issue might be..." |
| AssumptionStale | "Earlier we assumed X — given Y, should we reconsider?" |

## Protocol Precedence

```
Hermeneia → Telos → Epitrope → Aitesis → Prothesis → Syneidesis → Katalepsis
```

Aitesis follows Epitrope: once delegation is calibrated, verify execution context is sufficient. Before perspective framing (Prothesis) and gap auditing (Syneidesis), ensure the AI has the context it needs.

## When to Use

**Use**:
- When AI seems to be operating on stale assumptions
- When the same approach keeps failing
- When environment or constraints have changed mid-session
- When you notice AI making silent assumptions

**Skip**:
- When execution context is fully specified (use Prothesis — /mission for perspective)
- When gaps are at decision points, not execution context (use Syneidesis — /gap)

## Usage

```
/inquire [your current task or context]
```

## Author

Jongwon Choi (https://github.com/jongwony)
