# Structural Specifications

## Resolution Meta-Contract

**Resolution type and solution sentence.** The resolution type is the codomain: the Lean type occupying the right-hand position of a protocol's Type line. It records the result a run yields without fixing what that result means — two resolutions can share a carrier and an admission while the person recognizes different things at each. That meaning is stated by the solution sentence, the first statement of the protocol's epistemic solution as `/rederive` derives it (`.claude/skills/rederive/SKILL.md`, the `derive` operation): one sentence of what the person can then say or recognize, whether or not completion takes a closing turn of theirs. In the contract the sentence opens the doc comment of the resolution type (where a judgment supports the resolution, that judgment's doc comment states how it is established), with no Lean structure added for it; a discovery surface — plugin description, README, route — carries the sentence itself rather than the term.

Canonical protocol resolution names remain protocol-native: `MappingAssessment`, `DefinedBoundary`, `CrystallizedAbstraction`, `ResolvedEndpoint`, and peer names are not renamed to a generic terminal type. `DeficitResolved<D, R>` is a meta-contract that those canonical resolution types should satisfy when their formal surface is edited:

```
DeficitResolved<D, R> =
  R where
    morphism_completed(D → R)
    ∧ completion_trace_declared(D → phase_operations → R)
    ∧ residual_unknown_disposition_declared
```

Reference shapes:

```
ResidualDisposition ∈ {None, Declared, Deferred, Dismissed, Routed, Bounded}
  -- closed disposition signal; each constructor has distinct downstream handling semantics

ResidualUnknown = {
  item: String,
  status: ResidualDisposition,
  reason: String,
  downstream?: Reference
}

MorphismCompletionTrace<D, R> =
  List(D instance → PhaseOperation → ResolutionEvidence)

-- Carrier shape for materializing the predicate contract above.
DeficitResolved<D, R> = {
  result: R,
  trace: MorphismCompletionTrace<D, R>,
  residual: Map(ResidualUnknown.item, ResidualDisposition)
}
```

`residual = ∅` is valid only when emptiness is declared. Silent absence of residuals is not equivalent to `None`. Resolution means morphism completion is traceable and residual unknown disposition is visible; it does not mean all unknowns are eliminated. Residual disposition is not a new user gate by default.
