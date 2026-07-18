# Proplasma — /preview (πρόπλασμα)

Expose direction unknowns through divergent-discard instantiation before commitment (πρόπλασμα: the preliminary clay model shaped before committing to marble)

> [한국어](./README_ko.md)

## What is Proplasma?

A modern reinterpretation of Greek πρόπλασμα (preliminary model) — a protocol for the moment **right before a direction commitment, when the candidate directions cannot be judged from their descriptions and you feel you would have to see them to decide**. It materializes two to four cheap placeholder probes that diverge on user-settled axes, presents the per-axis contrast, and lets you constitute the direction decision on futures you have actually seen — then discards every probe.

### The Core Problem

Some direction choices are unrecognizable from words (`DirectionUnrecognizable`): the gate options are well-formed, but their differential futures cannot be carried by descriptions, so you end up mentally simulating consequences instead of recognizing them. The observable symptoms: delegating the choice to a principle ("go with whatever fits the northstar"), reworking the option set instead of choosing, or stalling with "I'd have to see it."

### The Solution

**Contrast over Simulation**: settle the divergence axes and the placeholder policy at a spec gate — sometimes the axes alone make the futures recognizable, and the protocol then stands down without generating anything — otherwise generate probes that commit different values on those axes (text vignettes, or real temp-isolated mockups), present them probe-first with a per-axis contrast map, and decide on recognition. Probes are discard-committed instruments: overtly synthetic, never evidence for any claim, and discarded after harvest with each probe's disposition declared (a failed destruction is declared with a cleanup handoff, never silent) — only the direction decision, the deciding contrast rows, and the newly exposed unknowns survive.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Prothesis | AI-guided | `FrameworkAbsent → FramedInquiry` |
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Horismos | AI-guided | `BoundaryUndefined → DefinedBoundary` |
| **Proplasma** | **Hybrid** | **`DirectionUnrecognizable → DirectionalContrast`** |
| Analogia | AI-guided | `MappingUncertain → ValidatedMapping` |
| Syneidesis | AI-guided | `GapUnnoticed → AuditedDecision` |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |

**The trichotomy**: understanding lacking → `/grasp` (verify that I understood); boundary lacking → `/bound` (settle how far); **future unrecognizable → `/preview` (see the directions, then judge)**.

**Routing precedence** (first match wins): a structural mapping to a familiar domain would carry the futures → `/ground`; real evidence is required → `/inquire`; the candidate field is thin (one or none) → `/ideate`, the frame itself is absent → `/frame`, the coordinates live implicit in externalized substrate → `/elicit`; candidates ≥ 2, evidence-free, placeholder-carriable → **`/preview`**.

## Three Breach Conditions

The protocol's legitimacy lives in a survival chain — spec gate → transform generation → relay contrast → constitution decision → cleanup verification. Violating any of these dissolves it:

| Breach | Guard |
|--------|-------|
| An AI-selected divergence axis without or after the spec gate | Spec gate fires before any generation |
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

Proplasma derives the axes on which your candidates genuinely diverge, has you settle the axes and the placeholder policy, builds 2–4 probes (each committing different values on the settled axes), and presents them one at a time before the contrast map. You then select a probe-exposed direction, synthesize your own from the probes (optionally re-materialized once), or interrogate a probe before deciding. Harvest precedes discard: the direction, the deciding contrast rows, and the inherited unknowns (routed to `/gap` and `/inquire`) survive; the probes do not.

## Author

Jongwon Choi (https://github.com/jongwony)
