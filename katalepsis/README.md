# Katalepsis — /grasp (κατάληψις)

Achieve certain comprehension of a target in play — code, a document, a result — (κατάληψις: grasping firmly)

> [한국어](./README_ko.md)

## What is Katalepsis?

A modern reinterpretation of Stoic κατάληψις (firm grasp, certain comprehension) — a protocol that **enables users to follow along and achieve verified understanding of a target present in context, whoever produced it**.

### The Core Problem

When a target is complex — a large change, code someone else wrote, a dense paper — users often can't grasp it in full (`TargetUngrasped`). They may think they understand, or feel overwhelmed without a clear entry point.

### The Solution

**Grounded, not asserted**: each aspect shows what it rests on — the user's reading borne out by the material, a result they asked to see, or the AI's explanation alone — and an explanation is never taken as understanding. Rather than lecturing at the user or quizzing them, AI first reads the target and the sources around it, then shows a map of understanding over the user's purpose — the purpose as they said it, or AI's reading of it marked as AI's, and the aspects it turns on, each with its essence in a line, the material it rests on, and how it stands. AI explains each aspect in the one picture, example, or metaphor that carries it best, and goes deeper when the user asks. The user moves the map with their own words: "got it" leaves an aspect resting on AI's explanation, accepted; "I'd need to see it" runs a check whose result they look at together; "that seems off" is met with the material that settles it, or with no verdict and what would settle it.

### Difference from Simple Explanation

| Dimension | Simple Explanation | Katalepsis |
|-----------|-------------------|------------|
| Direction | AI talks, user listens | AI shows the map; the user moves it — accepting, asking to see, or pushing back |
| Entry point | AI decides what to explain | The user's stated purpose, or AI's reading of it, marked as AI's and corrected in one line |
| Confirmation | Assumed after explanation | Each aspect says what it rests on: the user's own reading borne out by the target, a result seen together, or only AI's explanation |
| Ending | Undefined | The user says it is understood enough for their purpose; the map, with what is still to be checked and how, and any AI doubt, is the record |

## Protocol Flow

```
Gather   → Read the target's material, and the sources that bear on it
Map      → The purpose (the user's words, or AI's reading marked as AI's) and the
           aspects it turns on, each with what it rests on and how it stands
Explain  → Each aspect in one fitting representation; the user's move
           answered with its material — a check they ask for runs and its result
           is shown; no verdict without material: what would settle it is named
           (gate interaction)
Close    → The user says it is understood enough; the map at that moment is the
           record, with any dissent
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

## What the Map Carries

| Aspect | Description |
|--------|-------------|
| **What the purpose turns on** | What the target does that the user's purpose needs — explained in one representation, deeper on request; the user's own reading of it is checked against the material that settles it |
| **Unvoiced edge** | An edge of what the target does that the user has not voiced and their purpose needs, grounded in the target's material — raised openly on the map like any other aspect |
| **Contradiction** | Two sourced statements that cannot both hold on the same scope — taken up by whose it is: one the user holds a side of is shown with its working in one round (their words, the target's material, why they part, what they got right); one inside the target is shown as a finding about it; one against an earlier AI explanation is the AI's to correct |
| **Check** | Something the user wants to see or try before trusting an aspect — run on their word, its result shown beside the aspect; AI offers the cheapest such check only where a judgment the user is about to make rests on AI's explanation alone |

## Author

Jongwon Choi (https://github.com/jongwony)
