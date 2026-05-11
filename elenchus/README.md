# Elenchus (ἔλεγχος) — /sublate

> [한국어](./README_ko.md)

Vet working context by dialectical antithesis before pre-execution sync. Tests collected context for provenance, freshness, and counterfactual robustness before action.

## Type Signature

```
(ContextSuspect, User, VET, WorkingContext) → VettedContext
```

## What It Does

Elenchus runs before you commit your working context to an external sync — a meeting, a PR for review, a deploy decision, a Slack thread. The protocol scans accumulated session context for sources whose apparent sufficiency has become suspect through age, weak provenance, downstream concentration, or cross-source contradiction, then posits a dialectical antithesis per suspect source and lets you judge each disposition. The motion is Hegelian *Aufhebung* (preserve + negate + lift up): thesis → antithesis → synthesis applied source by source.

**Three dialectical patterns**:

- **Pattern A — Source provenance audit**: thesis "X is verified" ↔ antithesis "X's verification path is provisional / inferred / stale"
- **Pattern B — Counterfactual gap forecasting**: thesis "Y holds in current conditions" ↔ antithesis "if condition Z replaces a current one, gap B opens at point P"
- **Pattern C — Cross-source consistency check**: thesis "X₁ and X₂ name the same referent consistently" ↔ antithesis "X₁ and X₂ diverge at point Q"

**Core principle**: Dialectical Vetting over Silent Trust — accumulated context carries silent decay; the loop dissolves compounding context cost before it forces whole-system refactoring downstream.

## When It Activates

- User calls `/sublate` (user-initiated only)

The deficit-awareness sits with the user — Elenchus does not auto-activate. AI auto-detection of "this context smells stale" carries a false-positive cost that outweighs its savings; the user is best positioned to know when their context is about to externalize.

## Disposition Coproduct

Each suspect source resolves into one of seven named dispositions plus Emergent. The full coproduct is presented per source so each judgment is recognizable, not recalled from memory.

| Disposition | Meaning |
|-------------|---------|
| **Confirmed** | Antithesis examined; original claim survives. Downstream usage proceeds as-is. |
| **Revised(refinement)** | Antithesis surfaces a concrete update; claim is rewritten. Downstream proceeds against the refined form. |
| **Discarded(reason)** | Antithesis defeats the claim; source is withdrawn from the working context. |
| **Deferred(re_trigger_condition)** | Disposition pending; loop returns when the condition is met. Downstream proceeds without commitment. |
| **Conditional(measurement)** | Disposition pending external measurement; downstream tags the source as provisional. |
| **Bounded(external_reference)** | Authoritative answer lives outside this session; downstream cites the external reference. |
| **Routed(downstream_protocol)** | Challenge belongs to a different protocol family — handed to `/gap`, `/attend`, `/epharmoge`, or `/bound`. |

## Source Identification Criteria

Phase 0 silently selects audit-candidate sources from the working context per:

| Criterion | Condition |
|-----------|-----------|
| High-leverage accumulation | Single source carries downstream weight (working hypothesis: ≥ 3 dependents) |
| Source age beyond horizon | `observed_at + horizon(origin)` < now |
| Provenance-chain length | Belief depends on an N-step inference chain rather than direct observation or citation |
| Cross-source contradiction | Two sources nominally pointing at the same referent diverge |

Sources matching none of the criteria are not surfaced — the protocol focuses attention on warranted audit candidates.

## Known Limitations

- **Working hypothesis thresholds**: `N` (high-leverage threshold) and horizon defaults per origin are residual variables, refined through accumulated use evidence rather than fixed at inscription.
- **Pattern set closure**: Three patterns (A, B, C) are inscribed; Emergent admits a fourth pattern when use evidence surfaces a dialectical operation orthogonal to the three.
- **Single-pass per source**: A source receives one antithesis per loop iteration. False-negative antithesis construction (failure to surface a real challenge) propagates without intra-iteration recovery; the LOOP's Deferred re-trigger affords cross-iteration correction.

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
