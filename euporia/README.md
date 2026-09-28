# Euporia (εὐπορία)

Resolve via Extended-Mind reverse induction — `/elicit`.

## Overview

Euporia opens a way through abstract aporia — you hold a direction but cannot yet name the decisions it turns on. It traces those decision coordinates from your own material (codebase, rules, past sessions), from your words, and from the decision structure of the domain the intent sits in, and surfaces each with where it comes from and what leaving it open changes. Every answer joins the conversation whole — including a coordinate you name beyond the listed ones, or an axis you reject — and the next round traces from all of it; a value you gave changes only when your own words change it. The read-back of the intent marks each value with who proposed it: your words, or the AI's proposal with its basis. The answer that settles the intent resolves it when nothing it would take is unseen — no separate confirmation turn; where closing would take something the AI added, that gap alone is asked first. You can also withdraw; what is still open is carried as residual, never closed by default. Turning to other work mid-run leaves the question open rather than closing it.

The protocol stands in directional dual relation to Periagoge (`/induce`) — Periagoge ascends from concrete instances to abstraction (bottom-up direction), Euporia descends from intent through substrate to coordinates (top-down direction). The two compose as orthogonal directions of the same dialectic substrate. The pairing is informal direction-orthogonality, not a formal categorical limit/colimit duality.

## Type

```
(AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed)
  → ResolvedEndpoint
```

## Name

Greek εὐπορία — literally "good passage" (εὖ "well" + πόρος "way") — names the resourcefulness toward resolution that emerges from aporia (ἀπορία, "no way through"). Plato's later dialectic threads aporia and euporia as paired moments of inquiry; the protocol borrows the resolving-passage structure.

## When to invoke

Activate when the user's intent is articulated but turns on decisions they have not named — read from the utterance, their material, or the decision structure of the domain the intent sits in. When every coordinate is already settled by their words or by reachable evidence, the protocol reports what settles each and ends without surfacing.

When the intent is axis-determined (a single axis-specific protocol covers the resolution), defer to that protocol. When the user holds an instance set converging toward an unnamed essence with no locator, defer to Periagoge.

## Components

- `skills/elicit/SKILL.md` — protocol definition (a Lean 4 formal block that elaborates, prose, rules)
- `.claude-plugin/plugin.json` — plugin manifest
