# Architectural Principles

Project structure decisions; independent of the axiom system.

## Epistemic Cost Topology

The epistemic meta-layer has a fundamentally different cost topology from the execution layer. In the execution layer (code, tests, docs), AI drives the marginal cost of completeness toward zero — pursuing completeness is correct. In the epistemic meta-layer (protocols, axioms, formal systems), unused protocols pollute cognitive space — the cost of an unused protocol exceeds the cost of a missing one. This asymmetry grounds Deficit Empiricism: empirical restraint is the correct posture for protocol creation, even when execution-layer intuitions suggest "why not create more?" Attempts to apply execution-domain completeness principles directly to the epistemic domain should be identified and the cost function difference surfaced.

## Tier Factorization

Tier-classified artifacts in this project factor into a product of two orthogonal axes: an **epistemological** axis (axis_α — derivation status, model-improvement trajectory) and an **operational** axis (axis_β — invocation frequency, load-bearing strength). Neither dimension subsumes the other; the same artifact carries both annotations independently, and movement along one axis is independent of movement along the other.

The factorization is realized by complementary mechanisms. File content typically carries axis_α — `axioms.md` carries the Axiom-tier classification by what it contains. Directory location or annotation typically carries axis_β — `.claude/rules/` realizes the auto-loaded T1 zone (per-turn invocation), `.claude/principles/` realizes the lazy-loaded T2–T3 zone (per-authoring or per-verify invocation). The same axis_α value can occupy either zone depending on observed invocation frequency. Lazy-load mechanisms operate on axis_β alone; demoted content retains its axis_α classification.

**Observed instances**:
- Gate annotations: A2 §A5 coordination establishes that gates carry Standing/Active authority (A2 axis_α) and bounded/unbounded regret (A5 axis_β) independently — see `axioms.md`.
- Principle classification: `.claude/rules/` (T1) versus `.claude/principles/` (T2–T3) directly realizes the factorization for prescriptive content.
- Tier-changing moves: e-tier reclassification (Axiom → Safeguard) and o-tier compression (content reduction) operate as independent moves — see `safeguards.md` Adversarial Anticipation tier note.

Sibling concept to A5 (Interaction Kind Factorization): A5 factors gate operations into Extension/Constitution × bounded/unbounded; Tier Factorization factors tier classifications into axis_α × axis_β. Promotion/demotion along axis_β follows Stage 2 use corroboration (per `meta-principle.md` §Deficit Empiricism — full detail in `.claude/principles/meta-principle.md`).

> **Demoted detail**: Other architectural principles (Unix Philosophy Homomorphism, Session Text Composition, Cross-Session Knowledge Composition, Dual Advisory Layer, Coexistence over Mirroring, Three-Tier Termination, Audience Reach, Utility Skills delegation, Direction over Accumulated Workload) live in `.claude/principles/architectural-principles.md` (axis_β = T2–T3, conditional invocation). Fetch via Read/Grep when authoring/verify-time inquiry warrants. Promotion back to this file is governed by Stage 2 use corroboration; see `.claude/principles/README.md` for the demotion ledger.
