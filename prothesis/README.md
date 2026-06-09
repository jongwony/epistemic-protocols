# Prothesis — /frame (πρόθεσις)

Multi-perspective framing — lens recommendation or a compiled inquiry spec handed off to the substrate (πρόθεσις: placing before)

> [한국어](./README_ko.md)

## What is Prothesis?

A modern reinterpretation of Greek πρόθεσις (placing before) — a protocol that **recommends analytical lenses or compiles a multi-perspective inquiry spec**, then hands it off to the substrate to execute. frame supplies the analysis object (the lens); arranging multiple perspectives is `/conduct`'s, executing the inquiry is the substrate's.

### The Core Problem

Users often lack the analytical framework for their question (`FrameworkAbsent`). Open questions like "What perspective do you want?" require knowing the answer to answer. Beyond perspective selection, complex questions need a spec for parallel investigation from distinct viewpoints — a spec some substrate then executes.

### The Solution

**Recognition over Recall + Two Modes** (both compile an output and hand off; neither executes):
- **Recommend** (Mode 1): AI presents perspective options; user selects; a lens recommendation + downstream protocol suggestions are output. Lightweight — no inquiry spec. Selected via Mode choice in Phase 0.
- **Inquire** (Mode 2): AI presents perspectives; user selects; frame compiles a full inquiry spec — the lens, a default isolation/dialogue/synthesis directive, and a `/conduct` reference for non-trivial arrangement — and hands it off. The substrate (an agent team, a dynamic-workflow, isolated subagents, plan mode, or the main session) executes it; frame stops at handoff.

### Difference from Socratic Method

| Dimension | Socratic Maieutics | Prothesis |
|-----------|-------------------|-----------|
| Knowledge source | Latent within interlocutor | Provided externally |
| Premise | "You already know" | "You don't know the options" |
| Role | Midwife (draws out) | Cartographer (reveals paths) |
| Question form | Open questions (recall burden) | Options (only recognition needed) |

## Protocol Flow

```
Phase 0: Mission Brief → Confirm inquiry intent, scope, and mode (gate interaction)
Phase 1: Gather        → Targeted context acquisition for perspective formulation
Phase 2: Prothesis     → Present 2-4 perspectives (gate interaction)
Phase 3: Compile & Handoff →
  Mode 1 (recommend): characterize the lens → emit the recommendation → STOP
  Mode 2 (inquire):   compile the inquiry spec (lens ⊕ /conduct arrangement reference ⊕
                      default isolation/dialogue/synthesis directive) → hand off → STOP
--- frame does not execute: the substrate runs the spec; non-trivial arrangement routes to /conduct ---
```

## When to Use

**Use**:
- Evaluation, comparison, recommendation requests
- When multiple frameworks are applicable ("from an expert perspective", "deep analysis")

**Skip**:
- Simple factual questions
- User already specified a perspective

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install prothesis@epistemic-protocols
```

## Usage

```
/frame [your question]               # multi-perspective investigation
```

## Author

Jongwon Choi (https://github.com/jongwony)
