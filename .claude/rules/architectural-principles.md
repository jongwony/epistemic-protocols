# Architectural Principles

Project structure decisions; independent of the axiom system.

## Epistemic Cost Topology

The epistemic meta-layer has a fundamentally different cost topology from the execution layer. In the execution layer (code, tests, docs), AI drives the marginal cost of completeness toward zero — pursuing completeness is correct. In the epistemic meta-layer (protocols, axioms, formal systems), unused protocols pollute cognitive space — the cost of an unused protocol exceeds the cost of a missing one. This asymmetry grounds Deficit Empiricism: empirical restraint is the correct posture for protocol creation, even when execution-layer intuitions suggest "why not create more?" Attempts to apply execution-domain completeness principles directly to the epistemic domain should be identified and the cost function difference surfaced.

> **Demoted detail**: Other architectural principles (Unix Philosophy Homomorphism, Session Text Composition, Cross-Session Knowledge Composition, Dual Advisory Layer, Coexistence over Mirroring, Three-Tier Termination, Audience Reach, Utility Skills delegation, Direction over Accumulated Workload) live in `.claude/principles/architectural-principles.md` per Tier Factorization o-tier classification (T2-T3, conditional invocation). Fetch via Read/Grep when authoring/verify-time inquiry warrants. Promotion back to this file is governed by Stage 2 use corroboration; see `.claude/principles/README.md` for the demotion ledger.
