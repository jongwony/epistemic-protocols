# Elenchus (ἔλεγχος) — /sublate

> [한국어](./README_ko.md)

Vet working context by dialectical antithesis before pre-execution sync. Tests collected context for provenance, freshness, and counterfactual robustness before action.

## Type Signature

```
(ContextSuspect, User, VET, WorkingContext) → VettedContext
```

## What It Does

Elenchus runs before you commit your working context to an external sync — a meeting, a PR for review, a deploy decision, a Slack thread. The protocol scans accumulated session context for sources whose apparent sufficiency has become suspect through age, weak provenance, downstream concentration, or cross-source contradiction, then posits a dialectical antithesis per claim under test — one per source in the ordinary case, and one each where a source is read as authority for several — and lets you say, in your own words, what you make of each claim. The motion is Hegelian *Aufhebung* (preserve + negate + lift up): thesis → antithesis → synthesis applied claim by claim.

**Four dialectical patterns**:

- **Pattern A — Source provenance audit**: thesis "X is verified for claim C" ↔ antithesis "X's verification path authorizes a different claim / is provisional / inferred / stale"
- **Pattern B — Counterfactual gap forecasting**: thesis "Y holds in current conditions" ↔ antithesis "if condition Z replaces a current one, gap B opens at point P"
- **Pattern C — Cross-source consistency check**: thesis "X₁ and X₂ name the same referent and compatible claim-kind consistently" ↔ antithesis "X₁ and X₂ diverge at point Q"
- **Pattern D — Inference fallacy audit**: thesis "Conclusion Y follows soundly from the basis observed" ↔ antithesis "Y's validity rests on a reasoning archetype that does not hold" — applies when the source is itself an inferred conclusion (origin `AIInference`, or a conclusion functioning as a standing premise)

**Core principle**: Dialectical Vetting over Silent Trust — accumulated context carries silent decay; the loop dissolves compounding context cost before it forces whole-system refactoring downstream.

## When It Activates

- User calls `/sublate` (user-initiated only)

The deficit-awareness sits with the user — Elenchus does not auto-activate. AI auto-detection of "this context smells stale" carries a false-positive cost that outweighs its savings; the user is best positioned to know when their context is about to externalize.

## The Answer

Each suspect claim is answered in the user's own words once its antithesis has been put to it. What is presented per claim is the material the answer is made against — the claim as it stands, what makes it suspect, the evidence, the stake, and the antithesis with its cited basis — so the answer is recognized rather than recalled, and no answer is written for the user before they are asked.

The answer is free text and deliberately untyped: nothing downstream is entitled to rely on how it came out, and a type there would be the protocol writing the answer before anyone was asked. Whatever the user wants done with the claim rides in the same words — stop relying on the source for that one claim, look at it again once a condition holds (for as long as the run is going; a condition still unmet at the close is reported open), or hand it to another kind of problem (with that protocol's command as a hint where Elenchus names one, bare otherwise). The round offers such actions concretely for each claim, never as category titles, and one answer may cover several claims or only some.

## Source Identification Criteria

Each pass silently selects the sources worth a look from the working context per:

| Criterion | Condition |
|-----------|-----------|
| High-leverage accumulation | Single source carries downstream weight (working hypothesis: ≥ 3 dependents) |
| Source age beyond horizon | `observed_at + horizon(origin)` < now |
| Provenance-chain length | Belief depends on an N-step inference chain rather than direct observation, citation, or measurement |
| Cross-source contradiction | Two sources nominally pointing at the same referent diverge |
| Inference-character conclusion | Source is itself a conclusion reached by inference (origin `AIInference`, or a conclusion functioning as a standing premise) |

Sources matching none of the criteria are not surfaced — the protocol focuses attention on the claims that warrant a challenge.

## Known Limitations

- **Working hypothesis thresholds**: `N` (high-leverage threshold) and horizon defaults per origin are residual variables, refined through accumulated use evidence rather than fixed at inscription.
- **Pattern set closure**: Four patterns (A, B, C, D) are inscribed; Emergent admits a further pattern, not pre-named, whose challenge directly confronts the source's claim rather than standing as a side verification check.
- **One challenge until the claim moves**: Each claim — a source under one claim it is read as authority for — keeps the antithesis it was given until the claim, or a condition the user set, moves; a source read as authority for several claims yields several claims, each with its own. A challenge that missed the real weakness is not recovered on its own; the user's answer, or a condition they set, is what brings the claim back.

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install elenchus@epistemic-protocols
```

## Usage

```
/sublate [optional focus]    # Vet working context before pre-execution sync
```

## License

MIT
