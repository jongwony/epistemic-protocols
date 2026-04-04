# Meta-Principle

Governs evolution of the principle system itself.

## Deficit Empiricism

Protocol creation must be grounded in observed deficit instances (N≥3) from actual sessions. Theoretical deficit classification alone is insufficient justification — the deficit must have demonstrably caused cost (wasted effort, wrong direction, missed consideration) in practice. This grounds the type system in empirical evidence rather than a priori categorization.

---

## Axiomatization Judgment Framework

### Core Principle

**Axioms are principles that become MORE important as models improve.** This is the defining property of axiomaticity. Unlike derived principles (which logically depend on axiom combinations and remain constant) or architectural principles (which encode project structure and are independent of model capability), axioms gain critical force as AI capabilities increase. A principle that remains equally important or becomes *less* important as models improve is not an axiom.

**Key insight**: When models become more capable at circumventing safeguards, the structural guards embedding axioms must become more rigorous, not less. Adversarial Anticipation (A7) exemplifies this: early models might fail to shortcut faithfully; advanced models routinely rationalize away from strict definitions unless the protocol structure itself enforces fidelity.

### Promotion Criteria (From Derived or Architectural to Axiom)

When evaluating a principle for promotion:

1. **Model Invariance Reversal**: The principle is *not* invariant as models improve. Instead, its importance grows. A principle that is equally important at all model capability levels is not axiom-material; it may be derived or architectural.

2. **Non-Derivability**: The principle cannot be fully expressed as a logical consequence of existing axioms. If it emerges as "A1 applied to domain X" or "A3 + A4 combined," it is derived, not axiomatic. Promotion requires the principle to introduce genuinely new structure.

3. **Structural Independence**: The principle applies across protocols and architectural boundaries, not confined to one protocol, one tool layer, or one implementation choice. It must constrain structure at the design level, not guide implementation at the execution level.

4. **Adversarial Grounding**: The principle encodes a safeguard against AI shortcutting or rationalization. Formal correctness of a protocol definition is not sufficient; execution fidelity requires structural guards. If a principle's primary role is to prevent an anticipated failure mode, it merits axiom status.

5. **Empirical Vindication Across Sessions**: Multiple observed sessions (N≥3 minimum) demonstrate that the *absence* of the principle as a structural constraint leads to repeated violations. Promoting the principle to axiom status and embedding it in protocol structure resolves the observed instances. This follows Deficit Empiricism: axiomatization must be grounded in observed cost.

### Demotion Criteria (From Axiom or Derived to Lower Tier)

When evaluating whether a principle should be downgraded:

1. **Derivability from Axiom Combinations**: The principle can be fully reconstructed as a logical consequence of existing axioms. If "this principle = A2 + A3 applied in scenario S," then it belongs in Derived, and its derivation source must be explicitly annotated. *Example*: Surfacing over Deciding is derived from A2 (Detection with Authority) — it is A2's behavioral instantiation, not a separate foundation.

2. **Protocol or Context Specificity**: The principle applies only to a subset of protocols, a specific phase of execution, or a particular interaction kind (e.g., only to Qc gates, only during convergence phase). Axioms are cross-cutting; they constrain all protocols equally. Context-specific constraints belong in Derived or Architectural tiers.

3. **Implementation Detail or Platform Dependency**: The principle guides how to realize axioms in a specific tool ecosystem, encoding platform capabilities or architectural trade-offs rather than epistemic foundations. These belong in Architectural. *Example*: "use YAML frontmatter for SKILL.md metadata" is architectural, not axiomatic — it emerges from our chosen realization layer, not epistemic necessity.

### Hermeneutic Circle Evolution Model

The promotion/demotion decision follows a hermeneutic circle pattern:

1. **Prejudgment (Vorverständnis)**: Observe a recurring violation or safeguard gap across sessions. Propose a candidate principle based on observed deficit.

2. **Inscription (Aufschreibung)**: Attempt to embed the candidate principle structurally in one or more SKILL.md definitions. Test whether the embedding prevents the observed violations.

3. **Validation via Interpretation (Auslegung)**: Re-examine historical sessions with the candidate principle in place. Would applying this principle have prevented observed failures? Does the principle create new, unforeseen constraints elsewhere?

4. **Horizons Fusion (Horizontverschmelzung)**: If validation succeeds, promote the principle to axiom. If the principle is better expressed as a logical consequence of existing axioms, classify it as derived and annotate the derivation. If it is platform-specific, classify as architectural.

5. **Circular Return (Rückkehr)**: As models improve, revisit axioms. A principle might become *more* important (reinforcing axiom status) or might become *less* critical if model behavior changes. The circle is ongoing.

**Note on the circle's stability**: Unlike philosophical hermeneutics (where understanding is open-ended), axiomatization seeks closure — a stable set of non-derivable foundational principles. The circle terminates when new observations no longer prompt principle revisions; this is evidence that the axiom set has reached productive stability (though it remains revisable).

### Context-Accumulation Decay

Rückkehr's trigger is not calendar-based but tension-accumulative. The decision criterion: act when the accumulated cost of maintaining current state (axiom tension, guard contradiction, classification ambiguity) exceeds the immediate cost of revision (diff scope, review burden, downstream adjustment). The independent variable is context accumulation — not elapsed time. The Axiom Hierarchy's tier dynamics apply: Safeguard-tier tensions self-resolve; Axiom-tier tensions compound.

**Protocol-level manifestation**: The trigger extends beyond axiom evolution. Each protocol's decision dimensions inherit the same criterion as domain-specific instances. Definition lives here (meta-principle); manifestation is inscribed in individual SKILL.md operational prose.
