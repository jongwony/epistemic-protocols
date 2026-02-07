# Katalepsis

Achieve certain comprehension of AI work (κατάληψις: grasping firmly)

> [한국어](./README_ko.md)

## What is Katalepsis?

A modern reinterpretation of Stoic κατάληψις (firm grasp, certain comprehension) — a protocol that **enables users to follow along and achieve verified understanding of AI-generated work**.

### The Core Problem

When AI completes complex work, users often can't grasp the full result (`ResultUngrasped`). They may think they understand, or feel overwhelmed by changes without a clear entry point.

### The Solution

**Comprehension over Explanation**: Rather than lecturing, AI structures verification through categorized entry points. Users select what to understand first, then AI confirms understanding through progressive questioning.

### Difference from Simple Explanation

| Dimension | Simple Explanation | Katalepsis |
|-----------|-------------------|------------|
| Direction | AI talks, user listens | AI verifies, user confirms |
| Entry point | AI decides what to explain | User selects focus areas |
| Confirmation | Assumed after explanation | Verified through questions |
| Progress | Undefined | Tracked via tasks |

## Protocol Flow

```
Phase 0: Categorize   → Analyze AI work, extract change categories
Phase 1: Entry Point  → Present categories, user selects (AskUserQuestion)
Phase 2: Register     → Create tasks for selected categories (TaskCreate)
Phase 3: Verify Loop  → Confirm understanding progressively (AskUserQuestion + TaskUpdate)
```

## When to Use

**Use**:
- After AI completes significant code changes
- When user asks "what did you do?", "explain this", "help me understand"
- Complex refactoring, new features, architectural changes

**Skip**:
- Trivial changes (typos, formatting)
- User demonstrates understanding already
- User explicitly declines explanation

## Usage

```
/katalepsis
/grasp
```

## Gap Types

| Type | Description |
|------|-------------|
| **Expectation** | User's assumed behavior differs from actual |
| **Causality** | User doesn't understand why something happens |
| **Scope** | User doesn't see full impact of changes |
| **Sequence** | User doesn't understand execution order |

## Author

Jongwon Choi (https://github.com/jongwony)
