# Prothesis — /mission (πρόθεσις)

Team-based multi-perspective investigation (πρόθεσις: placing before)

> [한국어](./README_ko.md)

## What is Prothesis?

A modern reinterpretation of Greek πρόθεσις (placing before) — a protocol that **assembles a team to investigate from multiple perspectives**, producing a framed inquiry.

### The Core Problem

Users often lack the analytical framework for their question (`FrameworkAbsent`). Open questions like "What perspective do you want?" require knowing the answer to answer. Beyond perspective selection, complex questions need parallel investigation from distinct viewpoints.

### The Solution

**Recognition over Recall + Team Investigation**: AI presents perspective options; user selects; an agent team investigates in parallel; findings are synthesized into a Lens. The lifecycle: team assembly → parallel investigation → cross-dialogue → synthesis → routing.

### Difference from Socratic Method

| Dimension | Socratic Maieutics | Prothesis |
|-----------|-------------------|-----------|
| Knowledge source | Latent within interlocutor | Provided externally |
| Premise | "You already know" | "You don't know the options" |
| Role | Midwife (draws out) | Cartographer (reveals paths) |
| Question form | Open questions (recall burden) | Options (only recognition needed) |

## Protocol Flow

```
Phase 0: Mission Brief → Confirm inquiry intent and scope (call AskUserQuestion)
Phase 1: Gather        → Targeted context acquisition for perspective formulation
Phase 2: Prothesis     → Present 2-4 perspectives (call AskUserQuestion)
Phase 3: Inquiry       → Agent team analysis per selected perspective (TeamCreate + teammates)
Phase 4: Synthesis     → Cross-dialogue check → Convergence/divergence → Integrated answer
Phase 5: Routing       → User selects next action: calibrate / extend / wrap up
```

## When to Use

**Use**:
- Evaluation, comparison, recommendation requests
- When multiple frameworks are applicable ("from an expert perspective", "deep analysis")

**Skip**:
- Simple factual questions
- User already specified a perspective

## Usage

```
/mission [your question]
```

## Author

Jongwon Choi (https://github.com/jongwony)
