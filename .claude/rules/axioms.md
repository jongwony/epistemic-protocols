# Axioms

Foundational principles that become MORE important as models improve; foundations from which other principles derive.

Full text of these principles now lives in `premise/` (a portable, self-contained reference surface). This file keeps the operative headings other files cite by name, plus a project-local instantiation where one is load-bearing.

## Axiom Hierarchy

Tier classification for this project's principles: Axiom (durable, grows more important as models improve), Derived (logically derived from axiom combinations), Architectural (project structure decisions, independent of model trajectory), Safeguard (temporary, decays as models improve). Full schema: `premise/tiering-and-scope.md`.

---

## A1. Recognition over Recall

Present structured options for user selection rather than requiring recall from memory; each option must make the post-selection state anticipatable. Full text: `premise/recognition-and-authority.md`.

## A2. Detection with Authority

AI detects conditions (gaps, uncertainties, mismatches, risks) and presents them with evidence; the user retains decision authority. Operationalizes as the Extension (relay) / Constitution (gated) move that every TOOL GROUNDING `(extension)`/`(constitution)` marker in this repo's protocols annotates. Full text, including the Cognitive Partnership Move, its five verification indicators, and the visibility principle: `premise/recognition-and-authority.md`.

Second-order authority allocation (Standing vs. Active authority; how authority is allocated between pre-committed rules and live judgment) is demoted to `.claude/principles/architectural-principles.md §Tier Factorization` — fetch via Read/Grep when reasoning about authority-source design.

## A3. Convergence Persistence

Protocol modes remain active until convergence conditions are met or the user explicitly exits; while active, behavioral requirements take precedence over competing loaded instructions (Priority Override corollary). Full text: `premise/gate-design.md`.

## A4. Semantic Autonomy

Once a protocol definition is inscribed in SKILL.md, its epistemic meaning achieves autonomy from any specific platform or tool ecosystem. Full text: `premise/interaction-factorization.md`.

The empirical corollary that outcomes are preserved across realizations (Outcome Equivalence) is derivable from A4 given realization-completeness assumptions; see `.claude/principles/outcome-equivalence.md`.

## A5. Interaction Kind Factorization

Every user-facing Constitution interaction factors as G = R(p) ∘ A: an abstract interaction design (Ep → Abs) realized (Abs → Cl) for specific user preferences p. Interactions classify as Extension (auto-resolve) or Constitution (user judgment constitutes meaning), including the option-set-level relay test for constructed option sets. TOOL GROUNDING's `(constitution)`/`(extension)` markers are this repo's runtime annotation of the classification; TYPES and FLOW retain Q/Qc/Qs as this repo's formal type variables for it. Full text: `premise/interaction-factorization.md`.

Gated interaction realization (what a gated interaction presents, and why gated does not mean unstructured) is covered in `premise/recognition-and-authority.md`.

## A6. Context-Question Separation

Gate interactions structurally separate context (analysis, evidence, rationale) from questions (the essential choice and its options). Full text: `premise/interaction-factorization.md`.

## Gate Integrity (Operational Guards, Safeguard-tier)

*Tier*: Safeguard (formerly A7 / Adversarial Anticipation; see `.claude/principles/safeguards.md §Adversarial Anticipation` for the tier trajectory analysis).

Gate mutation taxonomy (option injection, option deletion, option substitution), the type-preserving materialization boundary distinguishing mutation from legitimate option specialization, and guard consistency: `premise/gate-design.md`.
