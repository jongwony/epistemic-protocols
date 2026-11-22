# /conduct — Hyphegesis (ὑφήγησις)
<a name="hyphegesis--conduct-ὑφήγησις"></a>

> [한국어](./README_ko.md)

## What is /conduct?

### Definition
<a name="what-is-hyphegesis"></a>

Hyphegesis (ὑφήγησις) means leading the way or guiding from just ahead. It is a protocol that drafts one map of how multi-part work will run — its lines of work, their order, how they combine, when they stop, and where their results go — so you can adjust or accept the method before the work is carried out.

### The problem
<a name="the-core-problem"></a>

Your goal is clear, but the work has several parts and it is not obvious how to run them: which lines of work to run in sequence or side by side, whether they should see each other's results before combining, how those results combine, when to stop, or where the results go next. Started without settling the method, multi-step work drifts — steps run in the wrong order, independent perspectives mix too early, or work continues with no clear stopping point.

### The result

When you accept the method, the AI shows the map once more with what that turn changed — or, if your opening request already settled the method, shows the map once — and hands it off immediately in that same turn to carry out the work. `/conduct` itself designs and hands off the method rather than running the work. You can say how the lines order, combine, and stop, where their results go, and which decisions you entrusted versus kept.

## Install
<a name="install"></a>

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install hyphegesis@epistemic-protocols
```

## Usage
<a name="usage"></a>
<a name="the-solution"></a>

```
/conduct migrate this service from framework v2 to v3
```

Type `/conduct` at the start of — or partway into — multi-part work. Unless your words already settle the method, the AI lays out one map of the whole method before asking anything: the lines of work, who runs each and where, how they combine and stop, where results go, what the method needs from the runtime environment and whether each capability was actually observed, deferred decisions, and any reason the work needs no conducting. It draws the map only as detailed as the goal is worth: where trying is cheap and reversible, a rough map run once and checked may be the method.

You keep the decisions that are yours — when to stop, how results combine, where they go, constraints on the work, and the authority you entrust and its limits — and correct any part of the map or accept it as shown. Each time you change part of the map before accepting, the AI redraws it so downstream steps update while every choice you set stays yours. If you will be away while the work runs, the map separates what you must decide before leaving from what can wait. You can stop at any time before accepting the method, leaving the conversation as it stood.

<details>
<summary>What a method settles</summary>

<a name="what-a-method-settles"></a>
### What a method settles

Before asking anything, the initial map lays out: what the work is for, the lines of work drawn as a graph (an indented outline where no graph renders), who runs each line and where (marked as the AI's inference from the tools the environment describes), how the lines combine, when they stop, where their results go, what capabilities the method needs from whoever runs it and whether each was actually observed from what the environment returns (never assumed from a description), the decisions deferred until their evidence exists, and the AI's contrary grounds (including where it reads that the work needs no conducting).

These are the questions the map answers from the work in front of it. The rows marked the user's stand only by your words:

| Question | What it decides |
|----------|-----------------|
| Lines of work | Which lines of thinking the work needs, and what each does — a protocol the user declared next among them, placed after the lines whose results it takes and recorded as the user's constraint |
| Order | Whether they run in sequence, side by side, or as dependencies allow |
| Independence | Whether lines see each other's results before those results combine |
| Combination | How separately produced results are combined (the user's to decide) |
| Stopping | When each line, and the whole method, stops (the user's to decide) |
| Destination | Where each result goes beyond the method — a next unit of work, for one (the user's to decide) |
| Constraints | What is in force on the work — a direction for who runs it, whether the user will be present, a horizon among them (the user's to decide) |
| Authority | What the user entrusts and its limits, given as a broad direction (the user's to decide) |

A decision whose evidence arrives later is deferred: covered where a recorded grant of yours reaches it, and otherwise returned to you. Needs only you can supply (such as a secret to set or a deployment handed to runtime) always come back to you. A result that must cross into a later session (after `/compact`, `/clear`, or in a new session) is written to a record by whoever runs the method, and the later session is pointed at that record. `/conduct` stays single-session in its own reasoning; only the recorded result crosses sessions.

</details>

<details>
<summary>Comparison with other protocols</summary>

**Hyphegesis** (ὑφήγησις, leading the way / guiding from just ahead) conducts how a session's epistemic work will be carried out when the method is underdetermined (`MethodUnderdetermined`), producing a `ConductedMethod` handed off with the user's decisions, deferred decisions, lifetime, and required capabilities.

<a name="difference-from-other-protocols"></a>
### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Horismos | AI-guided | `BoundaryUndefined → DefinedBoundary` |
| **Hyphegesis** | **Hybrid** | **`MethodUnderdetermined → ConductedMethod`** |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |

</details>
