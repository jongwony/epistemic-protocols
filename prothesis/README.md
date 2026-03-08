# Prothesis — /frame (πρόθεσις)

Multi-perspective investigation — lens recommendation or team analysis (πρόθεσις: placing before)

> [한국어](./README_ko.md)

## What is Prothesis?

A modern reinterpretation of Greek πρόθεσις (placing before) — a protocol that **recommends analytical lenses or assembles a team to investigate from multiple perspectives**, producing a framed inquiry.

### The Core Problem

Users often lack the analytical framework for their question (`FrameworkAbsent`). Open questions like "What perspective do you want?" require knowing the answer to answer. Beyond perspective selection, complex questions need parallel investigation from distinct viewpoints.

### The Solution

**Recognition over Recall + Two Modes**:
- **Recommend** (Mode 1): AI presents perspective options; user selects; perspectives + downstream protocol suggestions are output. Lightweight — no team created. Selected via Mode choice in Phase 0.
- **Inquire** (Mode 2): Full investigation — AI presents perspectives; user selects; an agent team investigates in parallel; findings are synthesized into a Lens. Lifecycle: team assembly → parallel investigation → cross-dialogue → synthesis → routing.

### Difference from Socratic Method

| Dimension | Socratic Maieutics | Prothesis |
|-----------|-------------------|-----------|
| Knowledge source | Latent within interlocutor | Provided externally |
| Premise | "You already know" | "You don't know the options" |
| Role | Midwife (draws out) | Cartographer (reveals paths) |
| Question form | Open questions (recall burden) | Options (only recognition needed) |

## Protocol Flow

```
Phase 0: Mission Brief → Confirm inquiry intent, scope, and mode (call AskUserQuestion)
Phase 1: Gather        → Targeted context acquisition for perspective formulation
Phase 2: Prothesis     → Present 2-4 perspectives (call AskUserQuestion)
--- Mode 1 (recommend) terminates here with Pₛ + composition recommendations ---
Phase 3: Inquiry       → Agent team analysis per selected perspective (TeamCreate + teammates)
Phase 4: Synthesis     → Cross-dialogue check → Convergence/divergence → Integrated answer + Routing
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
