# Outcome Equivalence

> Demoted from `.claude/rules/derived-principles.md` on 2026-07-03, Derived tier retained.

Derived from A4 (Semantic Autonomy) + realization-completeness assumption.

**Layered argument structure**:

1. **A4 asserts functor existence (definitional)**: Semantic Autonomy establishes that a protocol definition's epistemic meaning exists independent of any specific platform. Abstract gate operations are defined over the epistemic category (phases, transitions, morphisms) without reference to target tools.

2. **Realization-completeness is an independent empirical assumption**: For a given platform P, realization-completeness holds when P's primitives preserve gate semantics (present structured content → yield turn → parse response). This is not entailed by A4 — it is a separate assumption about each target platform, empirically testable per realization.

3. **Outcome Equivalence is the conjunction**: Given the same protocol definition, the same user responses, and a platform satisfying realization-completeness, the epistemic outcome (convergence conditions, output structures) is equivalent across realizations.

The argument chain matters: A4 alone does not guarantee outcome preservation at the realization boundary; it guarantees the definition's autonomy from any specific realization. Outcome Equivalence bridges the definitional layer (A4) and the empirical layer (realization) via the completeness assumption.

**Falsifiability and counter-evidence**: Outcome Equivalence is falsifiable when a realization fails the completeness assumption — a protocol operation depending on a substrate guarantee that a target platform lacks refutes it at that realization boundary. When such a failure occurs, A4 survives intact (the definition remains autonomous); Outcome Equivalence fails locally (that specific realization does not preserve outcomes). Historical instances: `docs/analysis/outcome-equivalence-realization-history.md`.

**Distinction from A4 — tier rationale**: A4 is non-derivable from any combination of other axioms. Outcome Equivalence is derivable from A4 *plus* the realization-completeness assumption. Because the latter is itself empirically testable (not axiomatic), the conjunction cannot be axiomatic — Outcome Equivalence lives in Derived tier rather than as a definitional corollary of A4.
