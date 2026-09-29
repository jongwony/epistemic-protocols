# Euporia (εὐπορία)

Surface the decisions a rough intent turns on until you say it is aligned — `/elicit`.

## Overview

Euporia opens a way through abstract aporia — you hold a direction but cannot yet name the decisions it turns on. It traces those decision coordinates from your own material (codebase, rules, past sessions), from your words, and from the decision structure of the domain the intent sits in, and surfaces each with where it comes from and what leaving it open changes. Every answer joins the conversation whole — including a coordinate you name beyond the listed ones, or an axis you reject — and the next round traces from all of it; a value you gave changes only when your own words change it. The read-back of the intent marks each value with who proposed it: your words, or the AI's proposal with its basis. The run closes when you say the intent is aligned enough — every coordinate need not be filled — or when you withdraw; what is still open is carried as residual, never closed by default. A proposal of the AI's enters the record as adopted only where it was shown as the AI's before your answer took it. Turning to other work mid-run leaves the question open rather than closing it.

The protocol stands in directional dual relation to Periagoge (`/induce`) — Periagoge ascends from concrete instances to abstraction (bottom-up direction), Euporia descends from intent to the coordinates it turns on (top-down direction). The two compose as orthogonal directions of the same dialectic. The pairing is informal direction-orthogonality, not a formal categorical limit/colimit duality.

## Type

```
(AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed)
  → ResolvedEndpoint
```

## Name

Greek εὐπορία — literally "good passage" (εὖ "well" + πόρος "way") — names the resourcefulness toward resolution that emerges from aporia (ἀπορία, "no way through"). Plato's later dialectic threads aporia and euporia as paired moments of inquiry; the protocol borrows the resolving-passage structure.

## When to invoke

Invoke it when your intent is articulated but turns on decisions you have not named — they may show in your words, your material, or the decision structure of the domain the intent sits in. Invoking `/elicit` is your declaration of that: the first surface shows the intent as the AI understands it, with its sources, and you may say at once that it is aligned enough. When the AI raises it on its own, the first surface is a proposal you confirm or decline.

An intent whose axis is already fixed may be better served by an axis-specific protocol, and an instance set converging toward an unnamed essence with no locator by Periagoge. Which to run is yours to choose; once a run is active, it closes only by your own words.

## Components

- `skills/elicit/SKILL.md` — protocol definition (a Lean 4 formal block that elaborates, prose, rules)
- `.claude-plugin/plugin.json` — plugin manifest
