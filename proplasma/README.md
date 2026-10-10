# Proplasma — /preview (πρόπλασμα)

Expose direction unknowns through divergent-discard instantiation before commitment (πρόπλασμα: the preliminary clay model shaped before committing to marble)

> [한국어](./README_ko.md)

## What is Proplasma?

A modern reinterpretation of Greek πρόπλασμα (preliminary model) — a protocol for the moment **right before a direction commitment, when the candidate directions cannot be judged from their descriptions and you feel you would have to see them to decide**. It materializes cheap placeholder probes that diverge on axes the AI drafts and relays with their basis, shows a map of the directions in which every cell says what it rests on, and lets you constitute the direction decision on futures you have actually seen — then discards every probe.

### The Core Problem

Some direction choices are unrecognizable from words (`DirectionUnrecognizable`): the gate options are well-formed, but their differential futures cannot be carried by descriptions, so you end up mentally simulating consequences instead of recognizing them. The observable symptoms: delegating the choice to a principle ("go with whatever fits the northstar"), reworking the option set instead of choosing, or stalling with "I'd have to see it."

### The Solution

**Contrast over Simulation**: draft the divergence axes — the ones your purpose turns on, with the AI's reading of that purpose marked as its own until you say it — and the placeholder policy, and relay them with their basis before anything is generated; then generate probes that commit different values on those axes (text vignettes, or real temp-isolated mockups) and show them first, followed by the map: per axis, what each direction's future looks like and what that rests on — a probe you saw, a description alone, or a check you asked for (**Grounded, not asserted**). What you say you expect of a future is laid beside what the probes show, where the two agree and where they part. You settle a direction on recognition — or ask to see something no probe has materialized yet (a revised spec, a combination, a candidate left out), and the AI fans over that, relaying the whole spec again with what changed; or ask to check something real, and the result sits in its cell as evidence, never as a probe. When the AI finds the contrast insufficient, or reads that the futures are already recognizable, it says so with its basis and proposes; only you close the run. Probes are discard-committed instruments: overtly synthetic, never evidence for any claim, and discarded after harvest with each probe's disposition declared (a failed destruction is declared with a cleanup handoff, never silent) — only the direction decision, the cells that decided it, and the open unknowns survive.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Horismos | AI-guided | `BoundaryUndefined → DefinedBoundary` |
| **Proplasma** | **Hybrid** | **`DirectionUnrecognizable → DirectionalContrast`** |
| Analogia | AI-guided | `MappingUncertain → MappingAssessment` |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |

**The trichotomy**: understanding lacking → `/grasp` (verify that I understood); boundary lacking → `/bound` (settle how far); **future unrecognizable → `/preview` (see the directions, then judge)**.

**When it does not activate**: before anything is built, the AI reads whether this is the protocol's case — two or more candidates, a commitment at hand, futures a placeholder depiction can carry — and where it is not (the futures already read from their descriptions, a question about what one option means, a decision only real evidence can settle, a field too thin to compare), it says so in plain words with its basis and what would settle the need.

## Three Breach Conditions

The protocol's legitimacy lives in a survival chain — spec relay → probe generation → the map → your closing → cleanup verification. Each breach below would break that chain, and each has its guard:

| Breach | Guard |
|--------|-------|
| A divergence axis that commits a probe value before it was relayed with its basis | The spec relay goes out before any generation, and any drafted element can be sent back at the direction gate |
| A write to a permanent project file | Temp isolation + cleanup registered at creation |
| A probe treated as evidence for any claim | A probe stays evidence for no claim in the harvest and in every remnant; a check you ask for is the evidence channel, and it is never a probe |

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install proplasma@epistemic-protocols
```

## Usage

```
/preview [the direction decision you are about to commit to]
```

Proplasma derives the axes on which your candidates genuinely diverge for your purpose, relays the axes and the placeholder policy with their basis, builds probes that commit different values on the drafted axes, and shows them one at a time before the map. You then settle a probe-exposed direction, settle a combination of the probes or ask to see it first, send any part of the drafted spec back, name a candidate to be probed, ask about a probe, or ask to check something before deciding — in your own words, no numbered menu required; you can also settle a direction no probe showed, once the AI has said its future was never materialized, say the preview is no longer needed, or end it. Harvest precedes discard: the direction, the cells that decided it, and the open unknowns — each with what would settle it — survive; the probes do not.

## Author

Jongwon Choi (https://github.com/jongwony)
