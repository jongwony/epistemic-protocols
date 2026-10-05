# Hyphegesis — /conduct (ὑφήγησις)

Conduct the method of a session's epistemic work before object-level cognition begins (ὑφήγησις: a leading-the-way)

> [한국어](./README_ko.md)

## What is Hyphegesis?

A modern reinterpretation of Greek ὑφήγησις (leading from just ahead) — a protocol that **conducts how a session's epistemic work will be carried out** when the method is underdetermined, producing a ConductedMethod (the method handed off with what it carries: the user's own decisions, the deferred ones, its lifetime, and what it needs from whoever runs it).

### The Core Problem

The goal is clear, but *how to conduct the work* is not (`MethodUnderdetermined`): which lines of thinking to run, in what order or side by side, whether they see each other before their results combine, how those results combine, when to stop, and where each result goes. Started without a conducted method, multi-move work drifts — wrong order, perspectives contaminated before synthesis, no stopping criterion.

### The Solution

**Conduction over Substrate**: Hyphegesis drafts the whole method as one map — the lines of work and how they relate, who runs each and where, inferred from the tools the running environment describes — and draws it only as precisely as reaching the goal is worth: where trying is cheap and can be undone, a coarse map run once and checked may be the method. The user keeps only what is theirs: when to stop, how lines combine, where results go, the constraints in force, and the authority they entrust and its limits, given as a broad direction. After every answer that neither takes the method nor withdraws, the map is drawn again with a ledger of what changed. The method is taken on the user's word — or relayed at the start where the user's own words already settle it — and in that same turn the AI shows the map once more as a relay, with what that turn changed on its ledger, then hands the method off with what that map showed, without waiting; then the run ends. A decision whose evidence arrives later is deferred: whoever runs the method decides it where a recorded grant of the user's covers it, as the map shows, and otherwise it comes back to the user. A need only the user can supply (a secret to set, a deployment handed to runtime) always comes back to the user. Whoever runs the method runs what does not rest on the user without waiting for them and, when the method has run, returns to them once with every line's results; what rests on the user — a step that cannot be undone, where a contrary ground on the map, or one execution brings evidence for, bears on it, among them — comes back in that return with what did not proceed because of it, and nothing is decided for them. Hyphegesis does not execute the work, and whether a capability is there is read from what the environment returns, never from a description.

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

Unless the invocation's own words already settle the method, Hyphegesis lays out one map of the whole method before asking anything: what the work is for, the lines of work drawn as a graph (an indented outline where no graph renders), who runs each line and where — the AI's inference, marked as such — how the lines combine, when they stop, and where their results go, what the method needs from whoever runs it and whether each was observed, the decisions deferred until their evidence exists, and the AI's contrary grounds, including where it reads that the work needs no conducting. The user corrects any part of it or takes it; after every answer that neither takes the method nor withdraws, the map is drawn again with a ledger of what changed — the user's edits first, then each value re-drafted because of them — so a correction upstream re-fills what depends on it while every value the user set stays theirs. Where the user will not be present while the method runs, the map shows, before they leave, the authority the method will need and separates what must be decided before they leave from what can come back at the end. After a handoff, a later message that changes the method's direction opens it again over everything said so far; a withdrawn method is started again by invoking `/conduct`.

## What a method settles

These are the questions the map answers from the work in front of it — guidance for drawing it. The rows marked the user's stand only by the user's words:

| Question | What it decides |
|----------|-----------------|
| Lines of work | Which lines of thinking the work needs, and what each does — a protocol the user declared next among them, placed after the lines whose results it takes and recorded as the user's constraint |
| Order | Whether they run in sequence, side by side, or as dependencies allow |
| Independence | Whether lines see each other's results before those results combine |
| Combination | How separately produced results are combined (the user's to decide) |
| Stopping | When each line, and the whole method, stops (the user's to decide) |
| Destination | Where each result goes beyond the return at the end that carries every line's results — a next unit of work, for one (the user's to decide) |
| Constraints | What is in force on the work — a direction for who runs it, whether the user will be present, a horizon among them (the user's to decide) |
| Authority | What the user entrusts and its limits, given as a broad direction (the user's to decide) |

A result that must cross into a later session (after `/compact`, `/clear`, or in a new session) is written to a record by whoever runs the method, and the later session is pointed at that record. `/conduct` stays single-session in its own reasoning; only the result crosses.
