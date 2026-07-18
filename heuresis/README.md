# Heuresis — /ideate (εὕρεσις)

Widen an underexpanded candidate field through frame-parallel divergent generation (εὕρεσις: finding, discovery, invention)

> [한국어](./README_ko.md)

## What is Heuresis?

A protocol for the moment **before any selection is made, when the candidate field itself is thin** — empty, or already narrowed onto one option before the underlying goal called for it. It infers whether you're starting blank or already hold a few fragments from the invocation alone (no entry questions), opens abstract frames for you to pick before showing any concrete idea on a blank start, then generates candidates in parallel across the frames you open — never eliminating, ranking, or choosing among them. You stop it whenever you've seen enough.

### The Core Problem

Some candidate fields are underexpanded (`CandidateFieldUnderexpanded`): the goal is clear enough, but the object-level alternatives are empty or have converged early. Divergent and convergent thinking are distinct cognitive operations, and collapsing them — generating and judging in the same breath — is what keeps a field thin. Two related risks compound it: showing a concrete example too early anchors the very generation it was meant to kick off, and AI-assisted generation can make outputs converge toward each other unless something actively holds the field open.

### The Solution

**Divergence over Selection**: infer blank vs. seeded entry from the utterance alone, then fork — blank entries see an abstract frame map before any concrete idea exists (ownership stays with you, and nothing anchors your own thinking early); seeded entries expand straight from what you already gave, since the anchoring risk doesn't apply the same way to material you supplied yourself. Each round generates candidates in parallel across the open frames, every candidate tagged with its origin (you or the AI), nothing discarded or ranked. There is no round quota — your own stop is what bounds the field, and a stop before anything was generated is typed honestly as an empty result, never dressed up as a candidate field that was never built.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Prothesis | AI-guided | `FrameworkAbsent → FramedInquiry` |
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Proplasma | Hybrid | `DirectionUnrecognizable → DirectionalContrast` |
| **Heuresis** | **User-initiated** | **`CandidateFieldUnderexpanded → DiverseCandidateField`** |

**Where it sits**: Prothesis places analytical *lenses* on a fixed inquiry — heuresis's `GenerationFrame` is a different thing entirely, a temporary partition for parallel idea production, never handed off as an analytical perspective. Proplasma previews *directions* once two or more candidates already exist and need to be seen before choosing — heuresis sits upstream of that, at the point where the field itself needs widening. Euporia reverse-traces decision coordinates from externalized substrate (codebase, rules, past sessions) — heuresis never scans that substrate; it reads only the invocation utterance and whatever prior output you explicitly chain in.

**Routing precedence**: two or more candidates already exist and just need to be seen → `/preview`; the seed material lives outside this conversation → run a collection protocol first (e.g. `/inquire`) and chain its output in; the candidate field itself is thin or stalled → **`/ideate`**.

## The Chain Boundary

heuresis reads only what the invocation carries: the utterance itself, plus a prior protocol's output you explicitly name. It never scans the wider session, codebase, or rules on its own. If you chain material in this way, that's a deliberate substrate-first choice — you read the material before writing the invocation, so the ownership/diversity benefit of ideating *before* seeing prior material doesn't hold on that path. heuresis states this plainly; it adds no workaround.

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install heuresis@epistemic-protocols
```

## Usage

```
/ideate [a topic, or a few fragments you already have]
```

heuresis reads your invocation, infers blank or seeded entry, and — on blank — opens an abstract frame map for you to pick from before generating anything. Each round then produces candidates in parallel across the open frames, tagged with origin, presented with what's still unexplored. Continue by opening more frames, deepening one, or naming your own; stop whenever the field is wide enough. The candidate field then flows into `/preview`, your own direct judgment, or whatever evaluation work comes next — and the decision that judgment produces can be audited with `/gap`.

## Author

Jongwon Choi (https://github.com/jongwony)
