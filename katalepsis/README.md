# Katalepsis — /grasp (κατάληψις)

Achieve certain comprehension of a target in play — code, a document, a result — (κατάληψις: grasping firmly)

> [한국어](./README_ko.md)

## What is Katalepsis?

A modern reinterpretation of Stoic κατάληψις (firm grasp, certain comprehension) — a protocol that **enables users to follow along and achieve verified understanding of a target present in context, whoever produced it**.

### The Core Problem

When a target is complex — a large change, code someone else wrote, a dense paper — users often can't grasp it in full (`TargetUngrasped`). They may think they understand, or feel overwhelmed without a clear entry point.

### The Solution

**Comprehension over Explanation**: Rather than lecturing, AI checks understanding through the user's own answers. When the user has already said what they want to understand, verification starts there; otherwise AI first offers intent-scented entry points in the user's language, and the user takes one or names their own path. AI grounds each question in the target's material and records only what the user's own answers show — and how: unaided, after help (steps they asked for, or a hint), or after a disclosure.

### Difference from Simple Explanation

| Dimension | Simple Explanation | Katalepsis |
|-----------|-------------------|------------|
| Direction | AI talks, user listens | AI asks, the user shows |
| Entry point | AI decides what to explain | The user's stated purpose, or an intent-scented path they take |
| Confirmation | Assumed after explanation | Shown in the user's own answers, measured against the target |
| Ending | Undefined | The user says it is understood enough for their purpose; what is still unshown and any AI doubt are shown with the record |

## Protocol Flow

```
Gather   → Read the target's material, and any source a turn cites
Scope    → The user says what they mean to understand, and for what purpose where they say it
           (in their own words, or by taking an entry AI shows while the scope is open)
Verify   → Each round probes one aspect; an answer shows it, or a miss is met with
           a disclosure or an adjudication carrying its material — no verdict
           without material: the need is named (gate interaction)
Close    → The user says it is understood enough; the record shows what was shown
           and how, what stays unshown, and any dissent
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

## What a Round Looks For

| Aspect | Description |
|--------|-------------|
| **Ordinary gap** | Where the user's expectation, sense of cause, view of scope, or grasp of order differs from what the target does — first the user's reasoning is heard, then an adjudication quotes the material that settles it |
| **Horizon** | An edge of what the target does that the user has not voiced and their purpose needs, grounded in the target's material — probed first through an everyday scenario only, then disclosed with its material if missed |
| **Contradiction** | Two sourced statements that cannot both hold on the same scope — taken up by whose it is: one the user holds a side of asks first for their explanation, one inside the target is shown as a finding about it, one against an earlier AI explanation is the AI's to correct |

## Author

Jongwon Choi (https://github.com/jongwony)
