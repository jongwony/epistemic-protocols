# Architectural Principles

Project structure decisions; independent of the axiom system.

## Epistemic Completeness Boundary

EP principles govern the epistemic substrate — the domain of human-AI dialogue where authority, judgment, framing, and recognition are constituted. Their completeness claim terminates at substrate boundaries: physical safety, harness permission, credential policy, and high-stake action execution belong to native harnesses or specialized plugins, not to EP protocols.

The boundary lives at the architectural layer rather than within axioms. EP's mission is to surface invisible territory in human-AI dialogue; a principle that absorbs its own application boundary into its body makes its own scope invisible. Substrate-scope declarations therefore sit one layer above the dialogue mechanics they delimit — domain-internal mechanics in the axiom layer, domain-scope declarations in the architectural layer (analogous to mathematical practice where domain commitments sit in metatheory rather than within the axiom system itself).

Operationally: EP defines and protects authority-boundary visibility; the operational layer (system prompts, CI/CD rules, compose automation, harness permissions) realizes the delegation. Protocols may classify and surface non-epistemic risk at boundary crossings, but they neither discharge nor enforce external substrate semantics.

**Test**: if the remaining obligation after epistemic detection requires substrate enforcement rather than further epistemic judgment, EP records the handoff and stops; the obligation is delegated, not absorbed.

**Observed instances**:
- A2 authority allocation: Standing authority implementation (system prompts, CI/CD, compose automation) is non-epistemic substrate; A2 governs the *visibility* of authority allocation within the epistemic substrate, not its operational realization.
- Prosoche `/attend`: boundary inference, velocity partition, condition compilation, and the compile-time confirmation gate are epistemic substrate; condition enforcement inside the execution interval, fast-risk pre-action interception, and workflow/HITL semantics are non-epistemic substrate, delegated by handoff at emission.

> **Demoted detail**: Tier Factorization and other architectural principles (Epistemic Cost Topology, Unix Philosophy Homomorphism, Session Text Composition, Cross-Session Knowledge Composition, Dual Advisory Layer, Coexistence over Mirroring, Three-Tier Termination, Audience Reach, Utility Skills delegation, Direction over Accumulated Workload) live in `.claude/principles/architectural-principles.md` (axis_β = T2–T3, conditional invocation). Fetch via Read/Grep when authoring/verify-time inquiry warrants. See `.claude/principles/README.md` for the demotion ledger.
