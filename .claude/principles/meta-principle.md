# Meta-Principle (Demoted)

Governs evolution of the principle system itself.

> **Demotion zone**: This file lives in `.claude/principles/` (lazy-load, not auto-loaded by Claude Code harness). Originally part of `.claude/rules/meta-principle.md`. Demoted per Tier Factorization o-tier classification (T2-T3 sections — invoked at axiom-evolution / authoring / verify time, not per-turn). Fetch via Read/Grep when relevant. The Deficit Empiricism intro paragraph and Philosophical grounding remain in `.claude/rules/meta-principle.md` (T1). Promotion back to rules/ governed by Stage 2 use corroboration; see `.claude/principles/README.md`.

## Deficit Empiricism — Detail

### Stage 1 — Compile (Pre-submit Structural Fit)

A candidate protocol, axiom, or morphism-internal feature passes Stage 1 when it satisfies four conditions:

1. **Structural coherence**: fits the axiom hierarchy (A1–A6), preserves type soundness in TYPES coproducts, completes MORPHISM chains without orphan phases.
2. **Operation-kind clarity**: the cognitive operation is distinguishable from adjacent protocols (e.g., colimit / frame / map / gap / induce). Shared input shapes alone do not collapse protocols whose operations differ.
3. **Falsifiability**: explicit failure conditions stated — what observation would refute retention.
4. **Orthogonal option surface preserved**: every genuine alternative the AI can enumerate is presented at Gates with differential futures, under variation-stable essence.

Stage 1 produces a conjecture. The conjecture enters circulation; it is not yet corroborated data.

Mechanical enforcement of Stage 1 conditions (especially Falsifiability) via static check extensions is future work; presently these operate as authoring guidelines audited at review time.

### Stage 2 — Runtime (Post-deploy Use-corroboration)

Once deployed, the protocol accumulates post-use evidence in Popper's sense — observations of whether it resolves the claimed deficit when actually invoked. Revision is cheap in EP (SKILL.md edit + `/verify` + commit), so the correct pipeline is **deploy → observe → revise**. Observed friction triggers sharpening, narrowing, or retraction. Variation-stable corroboration across sessions constitutes Stage 2 retention evidence in Popper's sense. A protocol failing Stage 2 is retractable; removal is a legitimate outcome.

**Retraction operationalization** — the multi-file cascade (plugin.json, SKILL.md, graph.json, CLAUDE.md, marketplace.json) required for clean protocol removal — is future work. The coproduct {Retained | Retracted} currently operates with one fully realized branch (Retained); Retracted state transitions (Removed / Archived / Deprecated) remain unspecified, so Stage 2 retraction signals surface protocols for review-level removal discussion rather than automatic deletion.

### Relation to Axiomatization Judgment Framework

The two-stage split maps cleanly onto existing Promotion Criteria (below in this file): criteria 1–4 (Model Invariance Reversal, Non-Derivability, Structural Independence, Adversarial Grounding) are Stage 1 compile checks — resolvable before the principle enters circulation. Criterion 5 (Empirical Vindication Across Sessions) is Stage 2 runtime corroboration. Conjectural Grounding makes this split explicit: promotion decisions use Stage 1 + Stage 2 jointly, and the Principle Evolution Process's Prejudgment → Inscription → Validation → Horizons Fusion → Circular Return loop is the operational realization of the two stages running as one cycle; Circular Return is the long-arc Stage 2 revisitation as model capability shifts.

### Anti-inflation Clause

Stage 2's revision cheapness does not license session-frustration → protocol proliferation. The Epistemic Cost Topology ground holds: unused protocols pollute cognitive space, so the cost of an unused protocol still exceeds the cost of a missing one. Two structural guards preserve anti-inflation under the new model:

- **Stage 1 blocks frustration-driven creation**: a candidate that cannot state its axiom fit, operation-kind distinction, and falsifiability condition does not compile and does not enter circulation at all. Frustration alone is not a conjecture.
- **Stage 2 permits retraction**: post-use corroboration can invalidate a protocol. A protocol that fails to resolve its claimed deficit in use is a candidate for removal, not accumulation. Cost Topology is enforced at both endpoints — not only at creation.

This preserves the prior Direction over Accumulated Workload budget: authoring labor converges toward zero, but verification labor — running Stage 1 compile checks and observing Stage 2 corroboration — remains bounded and must be budgeted.

### Operational Tests

- **Stage 1 passes** when: axiom fit is citable, operation-kind is distinguished from every adjacent protocol by cognitive operation (not input shape), falsifiability condition is stated, and the option surface at Gates remains orthogonal under variation.
- **Stage 2 corroboration suffices for retention** when: sessions invoking the protocol show the claimed deficit resolved, variation-stable corroboration is observed across the four variation axes (instance, user profile, platform context, session type), and no sustained friction pattern points to structural mis-fit.
- **Retraction is indicated** when Stage 2 shows (a) the claimed deficit is not observed in use — the deficit does not exist, or (b) the protocol's conjectured operation-kind collapses into an adjacent protocol under observation. Iteration (sharpening / narrowing), not retraction, applies when (c) the deficit is observed but the current framing does not resolve it — framing failure is a revise-in-place signal.

---

## Axiomatization Judgment Framework

### Core Principle

**Axioms are principles that become MORE important as models improve.** This is the defining property of axiomaticity. Unlike derived principles (which logically depend on axiom combinations and remain constant) or architectural principles (which encode project structure and are independent of model capability), axioms gain critical force as AI capabilities increase. A principle that remains equally important or becomes *less* important as models improve is not an axiom.

**Key insight**: When models become more capable, the structural guards embedding axioms must become more rigorous, not less. Detection with Authority (A2) exemplifies this: as AI capability grows, the structural separation between AI detection and User judgment becomes more critical because more-capable AI is more able to silently resolve decisions that should remain User-constituted. Axiom-tier classification is therefore conditional on observed trajectory, not declared by intent — a principle whose importance demonstrably decreases under capability improvement is not axiom-material even when adversarially grounded. The A7 (formerly Adversarial Anticipation) reclassification to Safeguard tier (audit-2026-04-11 #241, PR #273; empirical basis: PR #270 11-protocol Rules-section compression under Opus 4.7 instruction-following premise — net −14 lines, zero verify warnings) is the canonical case study and motivates Criterion 4 below.

### Promotion Criteria (From Derived or Architectural to Axiom)

When evaluating a principle for promotion:

1. **Model Invariance Reversal**: The principle is *not* invariant as models improve. Instead, its importance grows. A principle that is equally important at all model capability levels is not axiom-material; it may be derived or architectural.

2. **Non-Derivability**: The principle cannot be fully expressed as a logical consequence of existing axioms. If it emerges as "A1 applied to domain X" or "A3 + A4 combined," it is derived, not axiomatic. Promotion requires the principle to introduce genuinely new structure.

3. **Structural Independence**: The principle applies across protocols and architectural boundaries, not confined to one protocol, one tool layer, or one implementation choice. It must constrain structure at the design level, not guide implementation at the execution level.

4. **Adversarial Grounding (subordinate to trajectory test)**: The principle encodes a safeguard against AI shortcutting or rationalization. Formal correctness of a protocol definition is not sufficient; execution fidelity requires structural guards. **Adversarial grounding alone is insufficient for promotion** — Criterion 1 (Model Invariance Reversal) must be satisfied *independently*, not derived from Criterion 4. Even when Criteria 2, 3, and 5 (Non-Derivability, Structural Independence, Empirical Vindication) co-apply with Criterion 4, the candidate's trajectory claim must survive the trajectory test on its own evidence — adversarial grounding does not transmit trajectory force. The A7 (formerly Adversarial Anticipation) demotion to Safeguard tier (audit-2026-04-11 #241, PR #273) stands as the precedent: when empirical compression evidence (PR #270 — 11-protocol Rules section compression under Opus 4.7 instruction-following premise, net −14 lines, zero verify warnings) shows reduced reliance with model improvement, adversarial grounding does not warrant axiom status. Promotion via this criterion requires non-adversarial supplementary grounding that survives the trajectory test independently. *Precedent direction note*: the A7 demotion functions as **inversive precedent** — it establishes that adversarial grounding could not maintain Axiom-tier status when trajectory reversed, which by inversion implies adversarial grounding alone cannot ground promotion. A direct promotion-direction precedent (a candidate denied Axiom status despite adversarial grounding) is not yet observed; should one arise, it would strengthen this criterion's evidentiary chain.

5. **Empirical Vindication Across Sessions**: Observed sessions demonstrate that the *absence* of the principle as a structural constraint leads to repeated violations whose distinctive character persists under variation across contexts and session types. Promoting the principle to axiom status and embedding it in protocol structure resolves the observed instances. This follows Deficit Empiricism: axiomatization must be grounded in variation-stable essence.

### Demotion Criteria (From Axiom or Derived to Lower Tier)

When evaluating whether a principle should be downgraded:

1. **Derivability from Axiom Combinations**: The principle can be fully reconstructed as a logical consequence of existing axioms. If "this principle = A2 + A3 applied in scenario S," then it belongs in Derived, and its derivation source must be explicitly annotated. *Example*: Surfacing over Deciding is derived from A2 (Detection with Authority) — it is A2's behavioral instantiation, not a separate foundation.

2. **Protocol or Context Specificity**: The principle applies only to a subset of protocols, a specific phase of execution, or a particular interaction kind (e.g., only to Qc gates, only during convergence phase). Axioms are cross-cutting; they constrain all protocols equally. Context-specific constraints belong in Derived or Architectural tiers.

3. **Implementation Detail or Platform Dependency**: The principle guides how to realize axioms in a specific tool ecosystem, encoding platform capabilities or architectural trade-offs rather than epistemic foundations. These belong in Architectural. *Example*: "use YAML frontmatter for SKILL.md metadata" is architectural, not axiomatic — it emerges from our chosen realization layer, not epistemic necessity.

### Principle Evolution Process

The promotion/demotion decision follows an iterative pattern (phase names — *Prejudgment, Inscription, Validation, Horizons Fusion, Circular Return* — retained as inherited terminology from the prior "Hermeneutic Circle Evolution Model" framing per #240 partial closure. **Operative-weight caveat**: these names are not purely conventional. "Horizons Fusion" carries the Gadamerian *Horizontverschmelzung* commitment that understanding is achieved through fusion rather than subsumption; "Inscription" tracks the *Aufschreibung* concern flagged in DQ8 (audit-2026-04-11). The container rename ("Process" instead of "Hermeneutic Circle") reduces surface dependency without resolving phase-level commitments. Phase-level reduction is a deferred follow-up beyond this PR's scope):

1. **Prejudgment**: Observe a recurring violation or safeguard gap across sessions. Propose a candidate principle based on observed deficit.

2. **Inscription**: Attempt to embed the candidate principle structurally in one or more SKILL.md definitions. Test whether the embedding prevents the observed violations.

3. **Validation via Interpretation**: Re-examine historical sessions with the candidate principle in place. Would applying this principle have prevented observed failures? Does the principle create new, unforeseen constraints elsewhere?

4. **Horizons Fusion**: If validation succeeds, promote the principle to axiom. If the principle is better expressed as a logical consequence of existing axioms, classify it as derived and annotate the derivation. If it is platform-specific, classify as architectural.

5. **Circular Return**: As models improve, revisit axioms. A principle might become *more* important (reinforcing axiom status) or might become *less* critical if model behavior changes. The circle is ongoing.

**Note on stability**: Unlike philosophical hermeneutics (where understanding is open-ended by disciplinary commitment — the interpretive process is constitutively non-terminal), axiomatization seeks closure — a stable set of non-derivable foundational principles. The process terminates when new observations no longer prompt principle revisions; this is evidence that the axiom set has reached productive stability (though it remains revisable).

### Tension-Accumulation Threshold

Circular Return's trigger is not calendar-based but tension-accumulative. The decision criterion: act when the accumulated cost of maintaining current state (axiom tension, guard contradiction, classification ambiguity) exceeds the immediate cost of revision (diff scope, review burden, downstream adjustment). The independent variable is context accumulation — not elapsed time. The Axiom Hierarchy's tier dynamics apply: Safeguard-tier tensions self-resolve; Axiom-tier tensions compound.

**Protocol-level manifestation**: The trigger extends beyond axiom evolution. Each protocol's decision dimensions inherit the same criterion as domain-specific instances. Definition lives here (meta-principle); manifestation is inscribed in individual SKILL.md operational prose.
