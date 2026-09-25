# Hyphegesis — /conduct (ὑφήγησις)

Conduct the method of a session's epistemic work before object-level cognition begins (ὑφήγησις: a leading-the-way)

> [한국어](./README_ko.md)

## What is Hyphegesis?

A modern reinterpretation of Greek ὑφήγησις (leading from just ahead) — a protocol that **conducts how a session's epistemic work will be carried out** when the method is underdetermined, producing a ConductedMethod (a conduct-topology plan plus in-session checkpoints).

### The Core Problem

The goal is clear, but *how to conduct the work* is not (`MethodUnderdetermined`): which cognitive moves to run, in what order, with what independence, how to reconcile their results, when to stop, and where each output goes. Started without a conducted method, multi-move work drifts — wrong order, perspectives contaminated before synthesis, no stopping criterion.

### The Solution

**Conduction over Substrate**: When two or more moves carry a non-trivial conduct, Hyphegesis drafts the conduct topology over the moves it identifies — the whole method filled in at once, each value shown beside the alternatives it displaces, laid out impact/leverage-first, as one map on one sheet — redraws it after every answer with a ledger of what changed, and hands off a method plan. Only a decision whose deciding evidence does not exist yet, or a need the plan foresees that only the user can supply (a secret to set, a deployment handed to runtime), is deferred, to an in-session checkpoint; otherwise the run returns once, with one consolidated summary when the method has run. It does not execute the moves, and it never binds a substrate it cannot realize. Single-move work relays to that one protocol instead of being conducted.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Horismos | AI-guided | `BoundaryUndefined → DefinedBoundary` |
| **Hyphegesis** | **Hybrid** | **`MethodUnderdetermined → ConductedMethod`** |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |

The `/frame` utility (epistemic-cooperative) frames *which perspectives* for one inquiry; Hyphegesis conducts *how the whole session's moves* relate. The same arrangement functor Hyphegesis runs over the moves it identifies also arranges the perspectives `/frame` supplies.

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

Hyphegesis lays out one map of the whole method before asking anything — the work brief, the candidate moves (a large or cross-graph set **salience-ranked against the session aim**, so binding the move set is a recognition of the accumulated shape rather than a recall from a graph the user no longer holds in view), a proposed region cut, and over it every axis (order, independence, reconciliation, termination, routing) carrying a reasoned value, the other values named, and the differential where the plan turns — laid out on one sheet: the moves as a named outline under their regions (links drawn only where a move joins more than one predecessor) and the axis values as a table marking each value as the user's or the draft's. The user corrects any part of it, in any layer, or takes it; after every answer the map is drawn again with a ledger of what changed — the user's edits first, then each value re-drafted because of them, with its reason — so a correction upstream re-fills what depends on it while every value the user set stays theirs. Confirming the brief, then the moves, then the topology meant answering each while the rest of the method did not yet exist; one map removes that, and showing each value beside its alternatives is what keeps the user constituting the method rather than approving one. Conduction stays warranted only while two or more moves carry a real fork (single-move work relays out). Substrate feasibility is observed and shown on the map before the method is taken, and the method is handed off with in-session checkpoints once everything it takes was shown with its evidence. A region whose results reconcile by synthesis — and go to a consumer that cannot re-derive the fusion shape (the user, or a future span via `handoff_to_span`) — gets a **synthesis checkpoint** carrying a compiled Recognition brief — per-move outputs, convergences, divergences, private-gap slots, and fusion/output-shape candidates the substrate presents at fusion time, so the user recognizes the fusion choice instead of recalling it.

## Five Conduct Axes

| Axis | Question | Values |
|------|----------|--------|
| order | In what sequence do the moves run? | sequential_chain, parallel_fan, dependency_dag |
| independence | Do moves see each other before reconciliation? | isolated, shared |
| reconciliation | How are separately-produced results combined? | aggregate, dialectic, adversarial_refute, synthesis |
| termination | When does a move stop? | single_pass, bounded_rounds, until_dry_ceiling, until_goal_met |
| routing | Where does each output go? | return_to_user, chain_to_next, handoff_to_protocol, deepen_on_finding, handoff_to_span |

When `order` is `dependency_dag`, independence/reconciliation/routing/termination resolve per move-region (an authoring region can be `shared` while a verification region is `isolated`).

`handoff_to_span` routes a move's output **across the span wall** to a context-less future span (post `/compact`, `/clear`, or a new session) and declares an externalization obligation at the handoff seam: the executing substrate writes that output to a substrate-owned record, and the future span is pointed at it. `/conduct` stays single-span in its cognition and only its output bridges, while the far-side compile-back stays outside `/conduct`'s scope.
