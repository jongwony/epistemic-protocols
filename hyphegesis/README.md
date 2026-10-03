# Hyphegesis — /conduct (ὑφήγησις)

Conduct the method of a session's epistemic work before object-level cognition begins (ὑφήγησις: a leading-the-way)

> [한국어](./README_ko.md)

## What is Hyphegesis?

A modern reinterpretation of Greek ὑφήγησις (leading from just ahead) — a protocol that **conducts how a session's epistemic work will be carried out** when the method is underdetermined, producing a ConductedMethod (the method handed off with what it carries: the user's own decisions, the deferred ones, its lifetime, and what it needs from whoever runs it).

### The Core Problem

The goal is clear, but *how to conduct the work* is not (`MethodUnderdetermined`): which lines of thinking to run, in what order or side by side, whether they see each other before their results combine, how those results combine, when to stop, and where each result goes. Started without a conducted method, multi-move work drifts — wrong order, perspectives contaminated before synthesis, no stopping criterion.

### The Solution

**Conduction over Substrate**: Hyphegesis drafts the whole method as one map — the lines of work and how they relate, who runs each and where, inferred from the tools the running environment describes — and draws it only as precisely as reaching the goal is worth: where trying is cheap and can be undone, a coarse map run once and checked may be the method. The user keeps only what is theirs: when to stop, how lines combine, where results go, the constraints in force, and the authority they entrust, given as a broad direction. After every answer the map is drawn again with a ledger of what changed. The method is taken on the user's word once what it takes was shown with its evidence and the AI's contrary grounds — or relayed where the user's own words already settle it — and handed off with what it carries; then the run ends. A decision whose evidence arrives later, or a need only the user can supply (a secret to set, a deployment handed to runtime), is deferred; otherwise the run returns once, with one consolidated summary when the method has run. Hyphegesis does not execute the work, and whether a capability is there is read from what the environment returns, never from a description.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Horismos | AI-guided | `BoundaryUndefined → DefinedBoundary` |
| **Hyphegesis** | **Hybrid** | **`MethodUnderdetermined → ConductedMethod`** |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install hyphegesis@epistemic-protocols
```

## Usage

Invoke `/conduct` at the start of (or partway into) a multi-move work prospect:

```
/conduct migrate this service from framework v2 to v3
```

Hyphegesis lays out one map of the whole method before asking anything: what the work is for, the lines of work drawn as a graph (an indented outline where no graph renders), who runs each line and where — the AI's inference, marked as such — the decisions that are the user's with each value marked as the user's or the draft's, what the method needs from whoever runs it and whether each was observed, the decisions deferred until their evidence exists, and the AI's contrary grounds, including where it reads that the work needs no conducting. The user corrects any part of it or takes it; after every answer the map is drawn again with a ledger of what changed — the user's edits first, then each value re-drafted because of them — so a correction upstream re-fills what depends on it while every value the user set stays theirs. Where the user will not be present while the method runs, the map asks at the start for the authority its checkpoints will need and separates what must be decided before they leave from what can wait. After handoff the run has ended; a later message that changes the method's direction opens it again over everything said so far.

## What a method settles

These are the questions the map answers from the work in front of it — guidance for drawing it, not slots to fill:

| Question | What it decides |
|----------|-----------------|
| Lines of work | Which lines of thinking the work needs, and what each does |
| Order | Whether they run in sequence, side by side, or as dependencies allow |
| Independence | Whether lines see each other's results before those results combine |
| Combination | How separately produced results are combined (the user's to decide where they diverge) |
| Stopping | When each line, and the whole method, stops (the user's to decide) |
| Destination | Where each result goes — the end summary by default, or a next unit of work the user declared |

A result that must cross into a later session (after `/compact`, `/clear`, or in a new session) is written to a record by whoever runs the method, and the later session is pointed at that record. `/conduct` stays single-session in its own reasoning; only the result crosses.
