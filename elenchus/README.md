# Elenchus (ἔλεγχος) — /sublate

> [한국어](./README_ko.md)

Vet working context by dialectical antithesis before pre-execution sync. Tests collected context for provenance, freshness, and counterfactual robustness before action.

## Type Signature

```
(ContextSuspect, User, VET, WorkingContext) → VettedContext
```

## What It Does

Elenchus runs before you commit your working context to an external sync — a meeting, a PR for review, a deploy decision, a Slack thread. The protocol scans accumulated session context for sources whose apparent sufficiency has become suspect through age, weak provenance, downstream concentration, or cross-source contradiction, then posits a dialectical antithesis per suspect source and lets you judge each disposition. The motion is Hegelian *Aufhebung* (preserve + negate + lift up): thesis → antithesis → synthesis applied source by source.

**Four dialectical patterns**:

- **Pattern A — Source provenance audit**: thesis "X is verified for claim C" ↔ antithesis "X's verification path authorizes a different claim / is provisional / inferred / stale"
- **Pattern B — Counterfactual gap forecasting**: thesis "Y holds in current conditions" ↔ antithesis "if condition Z replaces a current one, gap B opens at point P"
- **Pattern C — Cross-source consistency check**: thesis "X₁ and X₂ name the same referent and compatible claim-kind consistently" ↔ antithesis "X₁ and X₂ diverge at point Q"
- **Pattern D — Inference fallacy audit**: thesis "Conclusion Y follows soundly from the basis observed" ↔ antithesis "Y's validity rests on a reasoning archetype that does not hold" — applies when the source is itself an inferred conclusion (origin `AIInference`, or a conclusion functioning as a standing premise)

**Core principle**: Dialectical Vetting over Silent Trust — accumulated context carries silent decay; the loop dissolves compounding context cost before it forces whole-system refactoring downstream.

## When It Activates

- User calls `/sublate` (user-initiated only)

The deficit-awareness sits with the user — Elenchus does not auto-activate. AI auto-detection of "this context smells stale" carries a false-positive cost that outweighs its savings; the user is best positioned to know when their context is about to externalize.

## Disposition Coproduct

Each suspect source is judged per claim: the user says in their own words what they make of the claim once the antithesis has been put to it, and may add one instruction the run can act on. What is presented per claim is the material the judgment is made against — the bound claim, what makes it suspect, the evidence, the stake, and the antithesis with its cited basis — so the judgment is recognizable rather than recalled from memory, and no answer is written for the user before they are asked.

The verdict itself is free text and deliberately untyped — nothing downstream is entitled to rely on how a judgment came out, and a type there would be the protocol writing the answer before anyone was asked. What *is* typed is the optional instruction, and only because the protocol can itself carry each one out with what it already produces — a mark on the ledger it emits, or control of its own loop:

| Instruction | What the run does with it |
|-------------|---------------------------|
| *(none)* | The run carries on with the source as it stands. Saying nothing here is an answer, not a blank. |
| **Withdraw** | The source is dropped from downstream use and kept in the run's history, with your verdict as you gave it. |
| **Revisit(condition)** | You name the condition; the loop returns to this claim when it is met. |
| **HandOff(deficit)** | The question is handed to another deficit, reported at convergence with its command hint. |

## Source Identification Criteria

Phase 0 silently selects audit-candidate sources from the working context per:

| Criterion | Condition |
|-----------|-----------|
| High-leverage accumulation | Single source carries downstream weight (working hypothesis: ≥ 3 dependents) |
| Source age beyond horizon | `observed_at + horizon(origin)` < now |
| Provenance-chain length | Belief depends on an N-step inference chain rather than direct observation or citation |
| Cross-source contradiction | Two sources nominally pointing at the same referent diverge |
| Inference-character conclusion | Source is itself a conclusion reached by inference (origin `AIInference`, or a conclusion functioning as a standing premise) |

Sources matching none of the criteria are not surfaced — the protocol focuses attention on warranted audit candidates.

## Known Limitations

- **Working hypothesis thresholds**: `N` (high-leverage threshold) and horizon defaults per origin are residual variables, refined through accumulated use evidence rather than fixed at inscription.
- **Pattern set closure**: Four patterns (A, B, C, D) are inscribed; Emergent admits a further pattern when use evidence surfaces a dialectical operation orthogonal to the four.
- **Single-pass per audit**: Each audit — a source under one claim — receives one antithesis per loop iteration, and a source read as authority for several claims is several audits, each with its own. False-negative antithesis construction (failure to surface a real challenge) propagates without intra-iteration recovery; the LOOP's Revisit re-trigger affords cross-iteration correction.

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
