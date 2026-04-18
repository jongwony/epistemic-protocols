# Philosophical Anchors

Cross-traditional grounding for A2's relay/constitution boundary, A5's extended-cognition framing, the Epistemic Cost Topology architectural principle, and Anamnesis's Husserlian synthesis of identification. This document provides philosophical lineage, citations, and non-derivability analyses that support the axiom, principle, and protocol system without bloating LLM-facing rules or SKILL.md files.

**Audience**: Contributor-facing per Audience Reach principle (`architectural-principles.md`). This document is not auto-loaded by protocols — it serves contributors who want to understand the deeper philosophical grounding of the system, while LLM-facing rules files retain only operationally relevant content.

## §A2. Relay/Constitution Boundary — Philosophical Lineage

A2's relay/constitution boundary (defined in `.claude/rules/axioms.md` §A2) is not a novel design choice but a formalization of pre-existing structure in extended human cognition. Two independent philosophical lineages converge on this distinction:

### Husserl's passive/active synthesis

*Cartesian Meditations* (Husserl 1931), especially §§38-39. Passive synthesis constitutes pre-egoic, pre-reflective givenness — the mechanical transmission of sense-data without egoic judgment. Active synthesis constitutes meaning through egoic acts of attention, selection, and interpretation.

Relay corresponds to passive synthesis; constitution corresponds to active synthesis. "Constitution" in A2 is not a generic term but a direct structural reference to Husserl's technical vocabulary — the homomorphism is not merely lexical. A2's rules/ inscription retains "Constitution" and "Relay" as operational terms (self-contained via A2 body definitions); this document carries the etymological grounding separately, per the rules/ pure-formality boundary established by audit-2026-04-11 #237 resolution.

### Clark & Chalmers' active externalism

"The Extended Mind" (Clark & Chalmers 1998, *Analysis* 58:7-19). Cognitive processes can extend beyond the biological brain when tools and environment are coupled reliably enough to function as cognitive workspace.

Under this view, A2's relay/constitution boundary marks where AI-as-cognitive-tool operates within the user's extended cognition (relay: AI competent within pre-established trust, delegable) and where the user's constitutive authority resumes (constitution: novel judgment that cannot be delegated to the tool).

### Cross-traditional convergence

The convergence of these lineages — phenomenological (Husserl) and analytic philosophy of mind (Clark & Chalmers) — provides A2 with cross-traditional grounding. A2 is the axiom most robustly supported by external philosophical anchors; the audit of 2026-04-11 (see `docs/audit-2026-04-11.md` §Positive Findings P2) empirically confirmed this via independent dual-stream analysis.

### Operational correspondence to extended-cognition labor division

The relay/constitution boundary maps directly onto the Known-Knowns → AI / Unknown-Unknowns → Human division of cognitive labor. Relay operations (entropy→0, deterministic, citable) are the domain where AI extends user cognition as competent tool. Constitution operations (entropy>0, novel selection) are the domain where user epistemic authority remains non-delegable. A2 does not *prescribe* this mapping — it *recognizes* a pattern already present in effective extended cognition.

## §A5. Interaction Kind Factorization — Extended Mind Ground

A5 (defined in `.claude/rules/axioms.md` §A5) shares the extended-cognition ground that A2's Philosophical Lineage establishes. Relay operations (bounded regret, delegable) live in the user's extended cognitive workspace under AI competence; gated operations (unbounded regret, constitutive) mark points where novel judgment cannot be delegated.

### Non-derivability from A2 (despite shared ground)

Despite sharing the extended-cognition ground, **A5 is not derivable from A2**. The Axiomatization Judgment Framework's Non-Derivability criterion (see `.claude/rules/meta-principle.md`) requires that axioms introduce genuinely new structure, not merely restate consequences of existing axioms. Sharing a philosophical ground does not imply derivability.

A5 introduces the following that A2 alone does not provide:

1. **Factorization structure**: `G = R(p) ∘ A` — the gate operation factors into an abstract component A (Ep → Abs) and a preference-parameterized realization R(p) (Abs → Cl). A2's detection/authority distinction does not entail this categorical factorization; A2 states *who* judges, not *how* gate operations compose.

2. **Regret analysis**: The bounded/unbounded regret classification (correctable at next gate vs irreversible divergence) is an orthogonal dimension not present in A2. A2 classifies by authority source (AI detection vs user judgment); A5 classifies by elision consequence.

3. **ELIDABLE CHECKPOINTS mechanism**: The operational mechanism for annotating gates as `elidable` or `always_gated` lives in A5, not A2. A2's Standing/Active authority distinction is orthogonal to A5's regret dimension — the same gate carries both annotations independently (A2 coordination note in `axioms.md`).

4. **Option-set-level relay test**: The test for whether constructed option sets constitute genuine gated interactions or collapse to relay (option-level entropy→0) is A5-specific. A2 does not analyze option-set structure.

A5 *inherits* A2's constitution properties on its gated side, but the factorization, regret analysis, and elision mechanism are A5's independent contributions. Both flow from the same extended-cognition ground, but shared ground does not imply derivability — only that the two axioms are mutually compatible and jointly necessary for the full gate theory.

## §Epistemic Cost Topology — Phenomenological Vindication

The Epistemic Cost Topology architectural principle (see `.claude/rules/architectural-principles.md`) states that the epistemic meta-layer has a fundamentally different cost topology from the execution layer: unused protocols pollute cognitive space (cost > 0), while execution completeness is correct (cost → 0).

### Husserlian thematic/marginal distinction

This asymmetry survives Husserlian eidetic reduction and corresponds to Husserl's distinction between **thematic consciousness** (what attention is directed at) and **marginal consciousness** (what remains in the co-given field of awareness). The asymmetry is not a pragmatic design choice but a reflection of the finitude of attentional capacity.

Adding an unused protocol to the epistemic workspace does not leave attention undisturbed — it enters the marginal consciousness field as a co-given possibility, consuming attentional capacity even when unused. This is why the cost of an unused protocol exceeds the cost of a missing one: the missing protocol does not consume marginal attention, but the unused one does.

### Extended-cognition framing

Under Extended Mind framing (Clark & Chalmers 1998), the principle reflects the finite capacity of the *extended* cognitive workspace: adding unused cognitive tools pollutes the workspace even when each tool is individually valid, because attentional cost does not distinguish invoked from uninvoked candidates in the extended field.

The finitude of extended cognitive workspace is not a contingent engineering constraint — it is a structural feature of cognition extending into tools. A tool that is reliably available in the workspace is *already* part of the extended cognition regardless of current invocation status.

See `docs/audit-2026-04-11.md` §Positive Findings P5 for empirical vindication from audit dual-stream analysis.

## §Anamnesis — Husserlian Synthesis of Identification

Anamnesis (`anamnesis/skills/recollect/SKILL.md`) uses Husserlian phenomenological vocabulary in its core morphism — "synthesis of identification", "empty intention", "phenomenological trigger". These are not post-hoc vindications but load-bearing protocol semantics: the operation names define what Anamnesis does.

### Husserl's synthesis of identification

In Husserl's *Cartesian Meditations* §§38-39, the synthesis of identification is the constitutive act where an empty intention (a reference to something not fully given) meets fulfilled re-presentation (perceptual or imaginal givenness that confirms the reference). The classic example: I seek my missing keys — the empty intention points to an absent object; I find them — the fulfilled re-presentation confirms "these are the keys I was seeking." Identity is not given directly; it is constituted through the meeting of empty and fulfilled modes.

### Mapping to Anamnesis

Anamnesis's operation is structurally homomorphic to this Husserlian structure:

- **Empty intention** (`V.trace`): the user's vague recall — "something was discussed before, but where?" An intentional reference to content whose location is unknown.
- **Candidate presentation** (Phase 2 Qc): scanned candidates from `Store = SSOT ⊕ INDEX` — potentially fulfilling content.
- **Recognition** (`Recognize(c)`): the synthesis where empty intention meets fulfilled re-presentation. The user constitutes identity — "yes, this is what I was recalling."

The protocol's Core Principle ("Recognition over Retrieval") directly inscribes this: recognition is a constitutive act, not a similarity-match output.

### Load-bearing status in SKILL.md

The Husserlian terms are load-bearing in Anamnesis for two reasons:

1. **Operation definition**: "synthesis of identification" names the morphism Anamnesis instantiates. Renaming to a generic term (e.g., "recognition synthesis") would obscure the phenomenological structure the protocol implements; the category-theoretic composition with Aitesis and Katalepsis assumes this specific constitutive pattern.
2. **Type predicate**: `empty_intention(V)` is the activation precondition — a formal type predicate in the MORPHISM block. It distinguishes Anamnesis (empty intention seeking fulfillment) from Aitesis (no intention at all toward the domain) and from Hermeneia (intent misarticulated in current expression, not absent in prior context). Operational rephrasing would erase the phenomenological distinction that underlies these protocol boundaries.

### Relation to A2's Husserlian lineage

A2's relay/constitution boundary also uses Husserlian vocabulary ("constitution" = active synthesis). Both axiom-level (A2) and protocol-level (Anamnesis) uses share the same philosophical source. The two uses are complementary: A2 addresses authority allocation (who constitutes meaning), Anamnesis addresses reference fulfillment (how recall constitutes identity). This convergence on a single philosophical lineage is not coincidental — both epistemic moments (authority allocation at gates, identity constitution in recall) are instances of the same Husserlian constitutive act.

### Relation to audit-2026-04-11 #237

#237's Option B' resolution removed philosophical vocabulary from `.claude/rules/` but explicitly scoped to rules/. Protocol SKILL.md files were not in B' scope. For Anamnesis, the Husserlian terms are operational (not vindication), so cascade-to-SKILL.md would be unwarranted — this section captures the philosophical grounding for contributor reference without requiring operational rephrasing of the protocol.

## Citations

- Clark, A., & Chalmers, D. (1998). The extended mind. *Analysis*, 58(1), 7-19.
- Husserl, E. (1931). *Cartesian Meditations*, translated by Dorion Cairns. The Hague: Martinus Nijhoff, 1960. (Especially §§38-39 on passive and active synthesis.)

## Cross-references

- `.claude/rules/axioms.md` §A2 (main axiom; Constitution/Relay retained as operational terms, etymology lives here)
- `.claude/rules/axioms.md` §A5 (main axiom; philosophical ground lives here)
- `.claude/rules/architectural-principles.md` §Epistemic Cost Topology (principle statement only; phenomenological vindication lives here)
- `.claude/rules/meta-principle.md` Axiomatization Judgment Framework (Non-Derivability criterion referenced in §A5 above)
- `anamnesis/skills/recollect/SKILL.md` (runtime protocol using Husserlian "synthesis of identification" and "empty_intention" as load-bearing operational terms; phenomenological context lives here)
- `docs/audit-2026-04-11.md` §Positive Findings P2, P5 (audit empirical grounding for A2 and Epistemic Cost Topology)

## Note on rules/ purity

Per audit-2026-04-11 #237 resolution (Option B': Demote), `.claude/rules/` carries operational prose only — no philosophical names, citations, or vindication appeals. This document is the designated container for philosophical grounding. Runtime LLMs read rules/; contributors read docs/. The two-layer split preserves Audience Reach boundaries while maintaining full philosophical lineage.
