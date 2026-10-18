# Katalepsis — /grasp (κατάληψις)

Close on an understanding that serves your purpose, on a map built with you and checked against its material (κατάληψις: grasping firmly)

> [한국어](./README_ko.md)

## What is Katalepsis?

A modern reinterpretation of Stoic κατάληψις (firm grasp, certain comprehension) — a protocol that **enables users to follow along and achieve verified understanding of a target present in context, whoever produced it**.

### The Core Problem

When a target is complex — a large change, code someone else wrote, a dense paper — users often can't grasp it in full (`TargetUngrasped`). They may think they understand, or feel overwhelmed without a clear entry point.

### The Solution

**Grounded, not asserted**: each aspect shows what the target does there, with the material and results it rests on, kept apart from what the user has said of it — their own reading, acceptance of the AI's explanation, or nothing yet — and an explanation is never taken as understanding. Rather than lecturing at the user or quizzing them, AI first reads the target and the sources around it, then shows a map of understanding over the user's purpose — the purpose as they said it, or AI's reading of it marked as AI's, and the aspects it turns on, each with its essence in a line, its facts with the material they rest on, and the user's own reading where they have given one. AI explains each aspect in the one picture, example, or metaphor that carries it best, and goes deeper when the user asks. The user moves the map with their own words: "got it" leaves an aspect resting on AI's explanation, accepted; "I'd need to see it" runs a check whose result they look at together; "that seems off" is met with the facts that bear on it, or, where none do, with what would settle it.

### Difference from Simple Explanation

| Dimension | Simple Explanation | Katalepsis |
|-----------|-------------------|------------|
| Direction | AI talks, user listens | AI shows the map; the user moves it — accepting, asking to see, or pushing back |
| Entry point | AI decides what to explain | The user's stated purpose, or AI's reading of it, marked as AI's and corrected in one line |
| Confirmation | Assumed after explanation | Each aspect keeps two things apart: what the target does there, with its material, and what the user understands of it, in their own words or as AI's explanation accepted |
| Ending | Undefined | The user says what they understand now serves their purpose; the map, with what is still to be checked and how, and any AI doubt, is the record |

## Protocol Flow

```
Gather   → Read the target's material, and the sources that bear on it
Map      → The purpose (the user's words, or AI's reading marked as AI's) and the
           aspects it turns on, each with its facts and the user's own reading
Explain  → Each aspect in one fitting representation; a check, run on the
           user's ask or on AI's stated judgment, adds a fact; the user's
           reading has the facts that bear on it set beside it — where none
           do, what would settle it is named
Close    → The user says what they understand now serves their purpose; the
           map at that moment is the record, with any dissent
```

## When to Use

**Use**:
- Something in play — code, a document, a result, whoever produced it — the user can't follow yet, or nods along to unsure, and wants to understand
- When user asks "what did you do?", "explain this", "help me understand", "I don't understand this", "I can't follow this"

**Skip**:
- A trivial formatting-only result — nothing there to grasp
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

## What the Map Carries

| Aspect | Description |
|--------|-------------|
| **What the purpose turns on** | What the target does that the user's purpose needs — explained in one representation, deeper on request; the user's own reading of it has the facts that bear on it set beside it |
| **Unvoiced edge** | An edge of what the target does that the user has not voiced and their purpose needs, grounded in the target's material — raised openly on the map like any other aspect |
| **Contradiction** | Two sourced statements that cannot both hold on the same scope — taken up by whose it is: one the user holds a side of is shown with its working in one round (their words, the target's material, why they part, where their words and the material agree); one inside the target is shown as a finding about it; one against an earlier AI explanation is the AI's to correct |
| **Check** | Something to see or try before trusting an aspect — run on the user's word, its result shown beside the aspect; where a check AI can reach would show what the target does on an aspect the purpose turns on — where the user's own reading says what it does included — AI runs the cheapest on its stated judgment before reporting, or else offers it with what running it needs; a result is a fact about the target, set beside the aspect; it says nothing about what the user understands, which only their own words give |

## Author

Jongwon Choi (https://github.com/jongwony)
