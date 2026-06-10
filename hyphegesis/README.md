# Hyphegesis — /conduct (ὑφήγησις)

Conduct the method of a session's epistemic work before object-level cognition begins (ὑφήγησις: a leading-the-way)

> [한국어](./README_ko.md)

## What is Hyphegesis?

A modern reinterpretation of Greek ὑφήγησις (leading from just ahead) — a protocol that **conducts how a session's epistemic work will be carried out** when the method is underdetermined, producing a ConductedMethod (a conduct-topology plan plus in-session checkpoints).

### The Core Problem

The goal is clear, but *how to conduct the work* is not (`MethodUnderdetermined`): which cognitive moves to run, in what order, with what independence, how to reconcile their results, when to stop, and where each output goes. Started without a conducted method, multi-move work drifts — wrong order, perspectives contaminated before synthesis, no stopping criterion.

### The Solution

**Conduction over Substrate**: When two or more moves carry a non-trivial conduct, Hyphegesis designs the conduct topology over the protocol graph — impact/leverage-first, locking stable axes and deferring volatile ones to in-session checkpoints — and hands off a method plan. It does not execute the moves, and it never binds a substrate it cannot realize. Single-move work relays to that one protocol instead of being conducted.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Prothesis | AI-guided | `FrameworkAbsent → FramedInquiry` |
| Horismos | AI-guided | `BoundaryUndefined → DefinedBoundary` |
| **Hyphegesis** | **Hybrid** | **`MethodUnderdetermined → ConductedMethod`** |
| Diylisis | AI-guided | `ContextTethered → PortableHandoff` |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |

Prothesis frames *which perspectives* for one inquiry; Hyphegesis conducts *how the whole session's moves* relate. The two share a topology algebra — the same arrangement functor Hyphegesis runs over the protocol graph also arranges the perspectives Prothesis supplies.

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

Hyphegesis confirms the work brief, checks whether conduction is warranted (single-move work relays out), identifies the candidate moves, then designs the conduct topology one axis at a time — order, independence, reconciliation, termination, routing — starting from the most decision-relevant axis. It surfaces substrate feasibility as a handoff annotation and hands off the method plan with in-session checkpoints.

## Five Conduct Axes

| Axis | Question | Values |
|------|----------|--------|
| order | In what sequence do the moves run? | single_move, sequential_chain, parallel_fan, dependency_dag |
| independence | Do moves see each other before reconciliation? | isolated, shared |
| reconciliation | How are separately-produced results combined? | aggregate, dialectic, adversarial_refute, synthesis |
| termination | When does a move stop? | single_pass, bounded_rounds, until_dry_ceiling, until_goal_met |
| routing | Where does each output go? | return_to_user, chain_to_next, handoff_to_protocol, deepen_on_finding |

When `order` is `dependency_dag`, independence/reconciliation/routing/termination resolve per move-region (an authoring region can be `shared` while a verification region is `isolated`).
