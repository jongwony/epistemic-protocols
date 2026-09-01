# Katalepsis — /grasp (κατάληψις)

Achieve certain comprehension of a result or artifact (κατάληψις: grasping firmly)

> [한국어](./README_ko.md)

## What is Katalepsis?

A modern reinterpretation of Stoic κατάληψις (firm grasp, certain comprehension) — a protocol that **enables users to follow along and achieve verified understanding of a result or artifact, whoever produced it**.

### The Core Problem

When a result is complex — a large change, code someone else wrote, a dense paper — users often can't grasp it in full (`ResultUngrasped`). They may think they understand, or feel overwhelmed without a clear entry point.

### The Solution

**Comprehension over Explanation**: Rather than lecturing, AI first offers intent-scented entry points in the user's language. Users select the path closest to what they need to understand, decide, explain, or modify; then AI grounds that path in the artifact and verifies understanding through progressive questioning.

### Difference from Simple Explanation

| Dimension | Simple Explanation | Katalepsis |
|-----------|-------------------|------------|
| Direction | AI talks, user listens | AI verifies, user confirms |
| Entry point | AI decides what to explain | User selects an intent-scented path |
| Confirmation | Assumed after explanation | Verified through questions |
| Progress | Undefined | Tracked via tasks |

## Protocol Flow

```
Phase 0: Orient       → Infer likely comprehension intents from the result and user signal
Phase 1: Entry Point  → Present intent-scented paths, user selects (gate interaction)
Phase 2: Ground       → Materialize artifact basis and create tasks (record)
Phase 3: Verify Loop  → Confirm understanding progressively (gate interaction + record update)
```

## When to Use

**Use**:
- After significant code changes land, whoever made them
- When user asks "what did you do?", "explain this", "help me understand", "I don't understand this", "I can't follow this"
- Complex refactoring, new features, architectural changes

**Skip**:
- Trivial changes (typos, formatting)
- User demonstrates understanding already
- User explicitly declines explanation

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install katalepsis@epistemic-protocols
```

## Usage

```
/grasp
```

## Gap Types

| Type | Description |
|------|-------------|
| **Expectation** | User's assumed behavior differs from actual |
| **Causality** | User doesn't understand why something happens |
| **Scope** | User doesn't see full impact of changes |
| **Sequence** | User doesn't understand execution order |
| **Horizon** | A co-intended but unspoken edge of the current entry point the user could not name from within their own framing — surfaced only when evidence-bound, material, and unspoken (false-positive guarded) |
| **Emergent** | Gap outside the canonical types, adapted to the specific comprehension deficit |

## Author

Jongwon Choi (https://github.com/jongwony)
