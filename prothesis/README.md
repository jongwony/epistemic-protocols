# Prothesis — /frame (πρόθεσις)

Multi-perspective framing — detailed lens(es), or lens↔substrate pairs handed off for isolated execution (πρόθεσις: placing before)

> [한국어](./README_ko.md)

## What is Prothesis?

A modern reinterpretation of Greek πρόθεσις (placing before) — a **pure lens-formation tool** that **places analytical lenses before the user, then for each selected lens declares the substrate it needs** and hands the lens↔substrate pairs off. frame forms the analysis object (the lens) plus its substrate need + channel need, then nudges `/conduct` for the isolation + arrangement + reconciliation + synthesis apparatus — which `/conduct` designs and the isolated substrate runs. frame never realizes isolation and never synthesizes a multi-perspective result in its own context: convergence is claimable only by a substrate that ran the lenses in genuine isolation.

### The Core Problem

Users often lack the analytical framework for their question (`FrameworkAbsent`). Open questions like "What perspective do you want?" require knowing the answer to answer. Beyond perspective selection, complex questions need isolated investigation from distinct viewpoints — and if one context reasons every perspective and then claims they "converge," the agreement is structurally guaranteed (bias dressed up as consensus). Genuine multi-perspective work therefore requires each lens to run in its own substrate.

### The Solution

**Recognition over Recall + Substrate-Correspondence** (frame forms lenses and hands off; it never isolates, executes, arranges, or synthesizes):
- For each selected lens, frame declares a **`substrate_need`** (the authoritative abstract persona/capability the lens requires — never a concrete agent) plus **`binding_hints`** (an advisory, enumerated shortlist of candidate substrates; prefer skill-bundled agents). The hints exist because hosts otherwise default to `general-purpose` and miss specialized agents.
- **LensReturn**: a single lens (or lenses needing no specialized substrate) returns directly as the detailed lens(es) — no synthesis, no convergence claim.
- **SubstrateCorrespondence**: ≥2 lenses with at least one specialized substrate need become lens↔substrate pairs, handed off **with a `/conduct` nudge** that carries the isolation + arrangement + reconciliation + synthesis apparatus. `/conduct` designs that arrangement and the substrate (an agent team, a dynamic-workflow, isolated subagents, or plan mode) runs each lens in isolation and may then claim convergence (the main session is a substrate only as an orchestrator that elects isolated executors, never isolating lenses inline in its own context); frame nudges `/conduct` and stops at handoff.

### Difference from Socratic Method

| Dimension | Socratic Maieutics | Prothesis |
|-----------|-------------------|-----------|
| Knowledge source | Latent within interlocutor | Provided externally |
| Premise | "You already know" | "You don't know the options" |
| Role | Midwife (draws out) | Cartographer (reveals paths) |
| Question form | Open questions (recall burden) | Options (only recognition needed) |

## Protocol Flow

```
Phase 0: Mission Brief → Confirm inquiry intent and scope (gate interaction; no mode question)
Phase 1: Gather        → Targeted context acquisition for perspective formulation
Phase 2: Prothesis     → Present 2-4 perspectives (gate interaction); single lens is valid
Phase 3: Bind Substrate & Handoff →
  bind_substrate: per lens, declare substrate_need (authoritative) + binding_hints (advisory) + channel_need
  single lens ∨ no specialized substrate → LensReturn (detailed lens(es)) → STOP
  ≥2 lenses with at least one specialized substrate need        → SubstrateCorrespondence (lens↔substrate pairs)
                                          ⊕ /conduct nudge → hand off → STOP
--- frame does not isolate, arrange, execute, or synthesize: the isolation + arrangement +
    synthesis apparatus is /conduct's to design (via the nudge) and the isolated substrate's to run ---
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
/frame [your question]               # multi-perspective framing
```

## Author

Jongwon Choi (https://github.com/jongwony)
