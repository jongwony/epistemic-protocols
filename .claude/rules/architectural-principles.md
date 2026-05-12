# Architectural Principles

Project structure decisions; independent of the axiom system.

## Epistemic Cost Topology

The epistemic meta-layer has a fundamentally different cost topology from the execution layer. In the execution layer (code, tests, docs), AI drives the marginal cost of completeness toward zero — pursuing completeness is correct. In the epistemic meta-layer (protocols, axioms, formal systems), unused protocols pollute cognitive space — the cost of an unused protocol exceeds the cost of a missing one. This asymmetry justifies empirical restraint as the correct posture for protocol creation, even when execution-layer intuitions suggest "why not create more?" Attempts to apply execution-domain completeness principles directly to the epistemic domain should be identified and the cost function difference surfaced.

## Tier Factorization

Tier-classified artifacts in this project factor into a product of two orthogonal axes: an **epistemological** axis (axis_α — derivation status, model-improvement trajectory) and an **operational** axis (axis_β — invocation frequency, load-bearing strength). Neither dimension subsumes the other; the same artifact carries both annotations independently, and movement along one axis is independent of movement along the other.

The factorization is realized by complementary mechanisms. File content typically carries axis_α — `axioms.md` carries the Axiom-tier classification by what it contains. Directory location or annotation typically carries axis_β — `.claude/rules/` realizes the auto-loaded T1 zone (per-turn invocation), `.claude/principles/` realizes the lazy-loaded T2–T3 zone (per-authoring or per-verify invocation). The same axis_α value can occupy either zone depending on observed invocation frequency. Lazy-load mechanisms operate on axis_β alone; demoted content retains its axis_α classification.

**Observed instances**:
- Gate annotations: A2 §A5 coordination distinguishes Standing/Active authority (axis_α) from regret (axis_β) at the meta/design layer; the runtime annotation layer collapses to a single TOOL GROUNDING `(extension)`/`(constitution)` axis per A5 coextension — see `axioms.md`.
- Principle classification: `.claude/rules/` (T1) versus `.claude/principles/` (T2–T3) directly realizes the factorization for prescriptive content.
- Tier-changing moves: e-tier reclassification (Axiom → Safeguard) and o-tier compression (content reduction) operate as independent moves — see `safeguards.md` Adversarial Anticipation tier note.

Sibling concept to A5 (Interaction Kind Factorization): A5 factors gate operations into Extension/Constitution × bounded/unbounded; Tier Factorization factors tier classifications into axis_α × axis_β.

## Epistemic Completeness Boundary

EP principles govern the epistemic substrate — the domain of human-AI dialogue where authority, judgment, framing, and recognition are constituted. Their completeness claim terminates at substrate boundaries: physical safety, harness permission, credential policy, and high-stake action execution belong to native harnesses or specialized plugins, not to EP protocols.

The boundary lives at the architectural layer rather than within axioms. EP's mission is to surface invisible territory in human-AI dialogue; a principle that absorbs its own application boundary into its body makes its own scope invisible. Substrate-scope declarations therefore sit one layer above the dialogue mechanics they delimit — domain-internal mechanics in the axiom layer, domain-scope declarations in the architectural layer (analogous to mathematical practice where domain commitments sit in metatheory rather than within the axiom system itself).

Operationally: EP defines and protects authority-boundary visibility; the operational layer (system prompts, CI/CD rules, compose automation, harness permissions) realizes the delegation. Protocols may classify and surface non-epistemic risk at boundary crossings, but they neither discharge nor enforce external substrate semantics.

**Test**: if the remaining obligation after epistemic detection requires substrate enforcement rather than further epistemic judgment, EP records the handoff and stops; the obligation is delegated, not absorbed.

**Observed instances**:
- A2 authority allocation: Standing authority implementation (system prompts, CI/CD, compose automation) is non-epistemic substrate; A2 governs the *visibility* of authority allocation within the epistemic substrate, not its operational realization.
- Prosoche `/attend` Phase 2: gate interaction (risk classification, intent transmission, judgment surfacing) is epistemic substrate; gate-passage actions requiring harness permission or high-stake execution are non-epistemic substrate, delegated by handoff.

> **Demoted detail**: Other architectural principles (Unix Philosophy Homomorphism, Session Text Composition, Cross-Session Knowledge Composition, Dual Advisory Layer, Coexistence over Mirroring, Three-Tier Termination, Audience Reach, Utility Skills delegation, Direction over Accumulated Workload) live in `.claude/principles/architectural-principles.md` (axis_β = T2–T3, conditional invocation). Fetch via Read/Grep when authoring/verify-time inquiry warrants. See `.claude/principles/README.md` for the demotion ledger.

## Tool-Aligned Cognitive Compromise (TACC)

TACC names a realization-layer family: a set of crystallized compromise-points along the dimension `(Harness × Tools' affordance power) × (User's cognitive alignment cost)`. Members of the family describe how deeper cognitive and authority invariants inscribe under the current Harness × Tools schema; the family is **not** the origin of those invariants. A1 (Recognition over Recall) and A6 (Context-Question Separation) retain their invariant status — TACC describes their inscription form under structured-tool affordances, not their derivation. The family identity exists at the realization layer; the underlying invariants exist at the cognitive/authority layer.

The family operates as a coexistence registry — members may live in `axioms.md`, `derived-principles.md`, or this file. TACC's contribution is naming the structural relation (sibling crystallizations across scales), not relocating member content.

**Scale-stratified membership**:

- **A1 Recognition over Recall** (semantic-gate scale) — invariant residence: `axioms.md`. Inscription form under AskUserQuestion: option array with differential-future-per-option requirement.

- **A6 Context-Question Separation** (gate-layout scale) — invariant residence: `axioms.md`. Inscription form under separated text/modal affordance: analytical context as pre-gate text, question and options in the gate region.

- **Differential Future Requirement** (option-set scale) — derived residence: `derived-principles.md`. Inscription form: each option occupies a decision-relevant differential-future position; cost-symmetric collapse and meta-action demotion apply.

- **Full Taxonomy Confirmation** (gate-type scale) — derived residence: `derived-principles.md`. Inscription form: finite type sets surface with detection status, evidence, and falsification conditions across all members, not only the detected subset.

- **PCME (Per-Round Cognitive Mobilization Equilibration)** (round scale) — new member, this file. Round determination operates on cognitive-cost homogeneity and dependency boundary, not cardinality. Bundle confidence-homogeneous decisions per round; route Standing-authority-resolved items via autonomous propagation; fork single high-cost decisions via protocol synthesis (turn-by-turn pattern). Verification-category gates (Katalepsis comprehension, Anamnesis Phase 2 recognition) are excluded per Differential Future Requirement's verification-gate exclusion.

- **Recommendation Without Usurpation** (authority scale) — new member. AI surfaces a default option but does not auto-select; option-ordering reduces friction while user authority is preserved. Constitution gate integrity holds; the default is signal, not resolution.

- **Free-Form Escape Hatch** (schema-completeness scale) — new member. Typed option schemas include a free-response path so finite enumerations do not foreclose user intent. Misclassification risk decreases without weakening the typed coproduct: free response is the canonical pathway for axes outside the surfaced taxonomy.

- **Default by Ordering, Not Elision** (authority-preservation scale) — new member. Low-cost decisions remain active gates with friction reduced through option ordering rather than gate elision. The constitutive interaction is preserved; informed acceptance after recognizing differential futures is itself constitutive (per A5).

- **Single Active Focus** (state-tracking scale) — new member. Visible focus is serialized even when the affordance permits parallel progress, reducing state-tracking cost. Parallel work may proceed underneath; the surfaced focus remains singular.

**Operational consequence**: TACC family members compose at distinct scales, so a single protocol activation may exercise A1 at the option level, A6 at the layout level, PCME at the round level, and Recommendation Without Usurpation at the schema level concurrently. Compose by scale-pairing rather than by member-merging.
