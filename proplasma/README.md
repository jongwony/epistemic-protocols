# Proplasma — /preview (πρόπλασμα)

Expose direction unknowns through divergent-discard instantiation before commitment (πρόπλασμα: the preliminary clay model shaped before committing to marble)

> [한국어](./README_ko.md)

## What is Proplasma?

A modern reinterpretation of Greek πρόπλασμα (preliminary model) — a protocol for the moment **right before a direction commitment, when the candidate directions cannot be judged from their descriptions and you feel you would have to see them to decide**. It materializes cheap placeholder probes that diverge on axes the AI drafts and relays with their basis, presents the per-axis contrast, and lets you constitute the direction decision on futures you have actually seen — then discards every probe.

### The Core Problem

Some direction choices are unrecognizable from words (`DirectionUnrecognizable`): the gate options are well-formed, but their differential futures cannot be carried by descriptions, so you end up mentally simulating consequences instead of recognizing them. The observable symptoms: delegating the choice to a principle ("go with whatever fits the northstar"), reworking the option set instead of choosing, or stalling with "I'd have to see it."

### The Solution

**Contrast over Simulation**: draft the divergence axes and the placeholder policy and relay them with their basis before anything is generated, then generate probes that commit different values on those axes (text vignettes, or real temp-isolated mockups) and present them probe-first with a per-axis contrast map. You settle a direction on recognition — or ask to see something no probe has materialized yet (a revised spec, a combination, a candidate left out), and the AI fans over that, relaying the whole spec again with what changed. When the AI finds the contrast insufficient, or reads that the axes alone already make the futures recognizable, it says so with its basis and proposes; only you close the run. Probes are discard-committed instruments: overtly synthetic, never evidence for any claim, and discarded after harvest with each probe's disposition declared (a failed destruction is declared with a cleanup handoff, never silent) — only the direction decision, the deciding contrast rows, and the newly exposed unknowns survive.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Horismos | AI-guided | `BoundaryUndefined → DefinedBoundary` |
| **Proplasma** | **Hybrid** | **`DirectionUnrecognizable → DirectionalContrast`** |
| Analogia | AI-guided | `MappingUncertain → MappingAssessment` |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |

**The trichotomy**: understanding lacking → `/grasp` (verify that I understood); boundary lacking → `/bound` (settle how far); **future unrecognizable → `/preview` (see the directions, then judge)**.

**Routing precedence** (first match wins): a mapping against a target account already in play leaves its intended inferences uncertain → `/ground`; real evidence is required → `/inquire`; the candidate field is thin (one or none) → `/ideate`, the coordinates live implicit in externalized substrate → `/elicit`; candidates ≥ 2, evidence-free, placeholder-carriable → **`/preview`**.

## Three Breach Conditions

The protocol's legitimacy lives in a survival chain — spec relay → transform generation → relay contrast → constitution decision → cleanup verification. Violating any of these dissolves it:

| Breach | Guard |
|--------|-------|
| A divergence axis that commits a probe value before it was relayed with its basis | The spec relay goes out before any generation, and any drafted element can be sent back at the direction gate |
| A write to a permanent project file | Temp isolation + cleanup registered at creation |
| A probe treated as evidence for any claim | Non-evidence stamp pierces harvest and session remnants |

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install proplasma@epistemic-protocols
```

## Usage

```
/preview [the direction decision you are about to commit to]
```

Proplasma derives the axes on which your candidates genuinely diverge, relays the axes and the placeholder policy with their basis, builds probes that commit different values on the drafted axes, and presents them one at a time before the contrast map. You then select a probe-exposed direction, settle a combination of the probes or ask to see it first, send any part of the drafted spec back, name a candidate to be probed, or ask about a probe before deciding; you can also settle a direction no probe showed, once the AI has said its future was never materialized. Harvest precedes discard: the direction, the deciding contrast rows, and the inherited unknowns (routed to `/inquire`) survive; the probes do not.

## Author

Jongwon Choi (https://github.com/jongwony)
