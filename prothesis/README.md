# Prothesis

Place perspective options before inquiry (πρόθεσις: placing before)

> [한국어](./README_ko.md)

## What is Prothesis?

A modern reinterpretation of Greek πρόθεσις (placing before) — a protocol that **presents possible epistemological perspectives before inquiry begins**.

### The Core Problem

Users often lack the analytical framework for their question (`FrameworkAbsent`). Open questions like "What perspective do you want?" require knowing the answer to answer.

### The Solution

**Recognition over Recall**: Choosing from options (recognition) is easier than filling in blanks (recall). AI presents perspective options first; user selects; then analysis proceeds.

### Difference from Socratic Method

| Dimension | Socratic Maieutics | Prothesis |
|-----------|-------------------|-----------|
| Knowledge source | Latent within interlocutor | Provided externally |
| Premise | "You already know" | "You don't know the options" |
| Role | Midwife (draws out) | Cartographer (reveals paths) |
| Question form | Open questions (recall burden) | Options (only recognition needed) |

## Protocol Flow

```
Phase 0: Gather       → Context acquisition for perspective formulation
Phase 1: Prothesis    → Present 2-4 perspectives (call AskUserQuestion)
Phase 2: Inquiry      → Agent team analysis per selected perspective (TeamCreate + teammates)
Phase 3: Synthesis    → Organize convergences/divergences → Integrated answer
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
/prothesis [your question]
```

## Author

Jongwon Choi (https://github.com/jongwony)
