# Design Philosophy

Detailed rationale for the axiom hierarchy and design principles governing epistemic protocols. See CLAUDE.md for the principle summary; this document provides full definitions.

## Axiom Hierarchy

| Tier | Count | Criterion |
|------|-------|-----------|
| Axiom | 7 | Principles that become MORE important as models improve; foundations from which other principles derive |
| Derived | 6 | Logically derived from axiom combinations; derivation source annotated |
| Architectural | 6 | Project structure decisions; independent of the axiom system |
| Safeguard | 1 | Principles that become LESS important as models improve; temporary guards against current model limitations |
| Meta-Principle | 1 | Governs evolution of the principle system itself |

---

## Axioms

### A1. Recognition over Recall

Present structured options for user selection rather than requiring recall from memory. Each option must make the post-selection state anticipatable — differential implications visible before choice, not discovered after.

The invariant: user receives structured options with differential futures, and their response is parsed into a typed answer. This applies to gate interactions (Qc/Qs), protocol nudges, and any protocol output that shapes user decisions.

Future-state recognizability: Recognition extends beyond "options not blanks" to "each option makes the post-selection state anticipatable." Gate options that present labels without differential futures reduce to recall-in-disguise — the user must mentally simulate consequences rather than recognize them from the presented structure.

### A2. Detection with Authority

AI detects conditions (gaps, uncertainties, mismatches, risks) and presents them with evidence; the user retains decision authority. Detection is the AI's responsibility; judgment is the user's right. The agent surfaces findings — it does not resolve them unilaterally.

This separation preserves human agency in epistemic dialogue: the AI's role is to illuminate the decision space, not to occupy it. When detection and judgment collapse into a single agent act, the user loses the opportunity to exercise informed choice.

### A3. Convergence Persistence

Protocol modes remain active until convergence conditions are met or the user explicitly exits. A protocol that deactivates before convergence abandons its epistemic commitment — the deficit it was created to address remains unresolved.

Corollary (Priority Override): When a protocol is active, its behavioral requirements take precedence over default execution patterns. This follows directly — if the mode is active, its rules apply. See Derived Principles below for the full definition.

### A4. Semantic Autonomy

Once a protocol definition is inscribed in SKILL.md, its epistemic meaning achieves autonomy from any specific platform or tool ecosystem — it depends only on what any language model can do (generate text, yield turn), not on platform-specific features. Protocol specifications define gate semantics (what to present, what response constitutes), not tool mechanics. A gate is: present structured content → yield turn → parse response. The realization layer maps this to concrete tools based on client capabilities and user preferences.

Corollary (Outcome Equivalence): Given the same protocol definition and the same user responses, the epistemic outcome must be equivalent across realizations — convergence conditions and output structures are preserved regardless of platform.

Category-theoretic interpretation (informal): TOOL GROUNDING can be understood as a structure-preserving mapping from abstract epistemic operations to platform-specific tool calls, analogous to a natural transformation between functors. Semantic Autonomy requires this mapping to preserve the MORPHISM chain's structure regardless of target platform. A rigorous formalization would require defining the source category (epistemic operations, with phases as objects and gate transitions as morphisms) and target category (platform tool calls) — this remains a guiding analogy rather than a proven correspondence.

### A5. Interaction Kind Factorization

Every user-facing gate operation factors as G = R(p) ∘ A, where A abstracts the gate (Ep → Abs) and R(p) realizes it for preferences p (Abs → Cl). Gate operations are classified: Qc (classificatory — projection from finite coproduct; user selects from N options) and Qs (constitutive — pushout; user response incorporates new content). Qc has bounded regret by default when elided (correctable at next gate); Qs has unbounded regret (missed user content). Specific Qc gates may carry unbounded regret from downstream irreversibility — expressed via always_gated annotation in ELIDABLE CHECKPOINTS.

**Qs realization principle**: Constitutive does not mean unstructured. Qs gates present AI-inferred rationale options (2-3 reasoning hypotheses grounded in context) that the user can evaluate, extend, or replace. The constitutive property lies in the user's implicit freedom to respond beyond presented options — this freedom is inherent in conversation turn structure, not an explicit escape hatch. A blank canvas forces Recall; structured rationale enables Recognition of reasoning paths. This extends A1 (Recognition over Recall) to constitutive gates.

**Epistemic scope trajectory**: Qs gates are EP's core epistemic contribution — they encode the irreducibly human act of constituting new meaning through dialogue. Qc gates (finite option selection) converge toward platform-native capabilities as models improve. EP's mission alignment concentrates on the Qs axis where human participation cannot be automated.

Composition scope: The factorization G = R(p) ∘ A applies to individual gate operations within a single protocol activation. Inter-protocol composition (sequential activation of multiple protocols) operates through Session Text Composition — natural language in session context, not formal gate composition. Associativity of gate operations across protocol boundaries is not claimed; each protocol's gates are independently factored.

### A6. Context-Question Separation

Gate interactions structurally separate context (analysis, evidence, rationale) from questions (the essential choice and its options). All analytical content is presented as text output before the gate; the gate contains only the question and option-specific differential implications.

When context is embedded within question fields, the user must parse analytical content and decision options simultaneously — this degrades Recognition (A1) by burying differential implications within explanatory text. Separation ensures the question arrives with maximum clarity: the user has already absorbed the context and can focus entirely on the differential futures of each option.

Formal boundary: if removing a sentence from the gate would cause loss of an option's differential implication, it belongs in the gate; if removing it would cause loss of analytical context, it belongs in the pre-gate text output.

Non-derivability from A1: Recognition over Recall (A1) constrains what is presented (options with differential futures); Context-Question Separation constrains where content is positioned (context as pre-gate text, question in gate). A1-compliant gates can still embed analytical context within question fields — the user receives options with differential futures, but must parse them amid explanatory text. A6 addresses this orthogonal failure mode: position-dependent Recognition degradation that A1's content requirement does not capture.

### A7. Adversarial Anticipation

Each protocol must anticipate how an AI agent might shortcut or rationalize away from faithful execution, and include structural guards in Rules and Phase prose. Formal specification guarantees definitional consistency; adversarial design guarantees execution fidelity. Common rationalization paths: premature convergence assertion, silent detection dismissal, skipping gate interaction entirely (presenting content without yielding turn for response), collapsing Qs gates to plain acknowledgment, gate mutation (option injection — adding options not in definition, option deletion — removing defined options, option substitution — replacing defined options with different ones). Distinct from gate mutation: **type-preserving materialization** — specializing a generic option into a concrete term while preserving the answer type constructor. The boundary: if the TYPES coproduct classifies the user's response identically before and after specialization, the transformation is materialization; if it requires a new constructor or alters the coproduct structure, it is mutation. These are orthogonal concerns — a protocol can be formally correct yet routinely circumvented.

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

### Historical Decision Record: Session 7f9e8e4c (2026-03-25)

**Promotions (Derived → Axiom)**:
- **A4. Semantic Autonomy** (formerly Structural Idempotency): Type-preserving materialization boundary and platform autonomy became critical as models advanced; realized in Outcome Equivalence corollary.
- **A5. Interaction Kind Factorization**: Qc/Qs distinction prevents unbounded regret in constitutive gates; becomes more important as models gain capability to silently collapse gate kinds.
- **A7. Adversarial Anticipation**: As model reasoning improved, subtle shortcutting (gate mutation, premature convergence assertion, silent detection dismissal) emerged. Requires explicit structural guards beyond formal protocol definition.

**New Axiom (Elevated from Rules)**:
- **A6. Context-Question Separation**: Observed repeatedly that embedded context in gate questions causes Recognition degradation (A1 violation). Promotion to axiom status justified empirical pattern across 4+ sessions.

**Demotions (Core → Derived)**:
- **Surfacing over Deciding**: Derived cleanly from A2 (Detection with Authority) — AI detects, presents with evidence, user judges. This is A2's behavioral instantiation, not a separate foundation.
- **Priority Override**: Derived from A3 (Convergence Persistence) — if a mode persists until convergence, its rules must override defaults. This follows necessarily from A3.

---

## Derived Principles

### Surfacing over Deciding

Derived from A2 (Detection with Authority).

AI makes visible; user judges. This is the behavioral instantiation of Detection with Authority — where A2 defines the structural separation of roles, Surfacing over Deciding captures the operational stance: when in doubt, surface the finding rather than making the decision silently. Silence is the primary failure mode this principle addresses.

### Priority Override

Derived from A3 (Convergence Persistence).

Active protocols supersede default behaviors. If a protocol mode is active and has not converged, its behavioral requirements take precedence over loaded instructions and default patterns. Without this override, protocols could be undermined by competing instruction sets during their active lifecycle.

### Full Taxonomy Confirmation

Derived from A1 (Recognition over Recall) + A5 (Interaction Kind Factorization).

When a Qc gate operates on a finite, protocol-owned taxonomy with always_gated annotation, present ALL types with detection status, evidence, and falsification conditions — not only the detected subset behind a generic action verb. The complete assessment enables Recognition (evaluate presented options) over Recall (generate missing options from memory). Design smell: "generic verb hiding finite taxonomy state" — when a gate option label (e.g., "Add type") conceals concrete candidates the AI has already analyzed, creating a Qc/Qs kind impurity (the gate appears classificatory but the sub-step requires constitutive user input). Fix: materialize the full taxonomy, converting mixed Qc/Qs to pure Qc. Applies to: finite type sets with always_gated Qc. Does not apply to: open-ended generation, per-item iteration, or runtime-variable sets. Same principle applies to protocol nudges: when deficit conditions are observed, surface them with explicit evidence rather than silently omitting.

### Convergence Evidence

Derived from A3 (Convergence Persistence).

Protocol convergence must be demonstrated, not asserted. At convergence, the agent must present a transformation trace mapping each identified deficit instance to its resolution — the MORPHISM instantiated at the concrete level. "All gaps resolved" or "goal defined" as bare assertion without per-item evidence = protocol violation.

### Pattern over Tool

Derived from A1 (Recognition over Recall) + A4 (Semantic Autonomy).

The Recognition over Recall principle is a content invariant — the protocol function lies in the structured options pattern, not in the specific tool that renders them. Structured numbered text followed by turn yield satisfies the same epistemic function as an AskUserQuestion tool call. The invariant: user receives structured options with differential implications, and their response is parsed into a typed answer.

### Zero-Shot Instruction Preference

Derived from A4 (Semantic Autonomy).

LLM-facing instructions (Output Style, SKILL.md prose, agent prompts) state principles, not examples. When a rendering rule, behavioral guideline, or structural constraint can be expressed as a principle, do not append few-shot examples or category-level mapping lists. Few-shot examples create a soft-table effect — anchoring the model to specific instances rather than letting it apply the principle to novel contexts. A principle that requires examples to be understood is underspecified; fix the principle, do not patch it with examples.

Scope boundary: this principle applies to instructions the LLM interprets and applies at runtime — not to contributor-facing documentation (design-philosophy.md, analysis/, docs/) where examples serve comprehension. The boundary test: "would removing this example increase the LLM's latitude in applying the principle to novel contexts?" If yes, the example is anchoring and should be removed (DP-14 applies). If the example aids human understanding without constraining LLM application, it is outside scope. SKILL.md formal blocks (Definition code blocks) are LLM-facing by definition; prose outside formal blocks in SKILL.md is hybrid (read by both LLMs and contributors) — err toward principle-only in hybrid contexts.

---

## Architectural Principles

### Unix Philosophy Homomorphism

Each protocol is a single-purpose epistemic tool. Composition is bottom-up — users invoke protocols for recognized cost situations, not follow a prescribed pipeline. The precedence order (see CLAUDE.md Protocol Precedence) is a logical default for multi-activation, not a mandatory sequence.

### Session Text Composition

Inter-protocol data flows as natural language in the session context — no structured data channels between protocols. Each protocol's output becomes part of the conversation that subsequent protocols naturally read. Cell-based structured transport was considered and rejected: structuring context loses information. If structured transport becomes necessary, functor composition is the escalation path.

### Dual Advisory Layer

Inter-protocol guidance operates through two distinct mechanisms at different abstraction levels: graph.json `advisory` edges (structural, validated by static checks, topology-aware) and Output Style nudge (runtime, session-context-dependent, deficit-type matching). These are complementary — graph.json edges encode stable architectural relationships, while nudges respond to observed session conditions. Protocol convergence moments are high-signal observation points for cross-protocol needs, but nudges are not position-constrained and fire whenever contextual evidence warrants.

### Coexistence over Mirroring

Protocols coexist with Claude Code built-in commands (`/simplify`, `/batch`) as orthogonal tools occupying different layers:

| Layer | Concern | Tools |
|-------|---------|-------|
| Epistemic | "Are we doing the right thing?" | Protocols (`/clarify`, `/goal`, `/inquire`, `/gap`, ...) |
| Execution | "Are we doing it correctly?" | Built-ins (`/batch`, `/simplify`) |
| Verification | "Did we understand?" | Protocol (`/grasp`) |

Do not mirror built-in execution capabilities (e.g., worktree isolation, PR creation) into protocol definitions. Do not absorb protocol epistemic concerns into built-in command wrappers. Each system maintains its own responsibility boundary, exchanging results at handoff points only.

### Three-Tier Termination

Protocol exit follows a graduated taxonomy based on side-effect presence:

| Tier | Mechanism | Cleanup | Scope |
|------|-----------|---------|-------|
| `user_esc` | Esc key at gate (tool-level or free-response turn) | None (ungraceful) | All protocols — universal |
| `user_withdraw` | Explicit gate option | Yes (team shutdown, partial state) | Protocols with side-effect state only |
| Normal convergence | Completion predicate | Full | Per-protocol |

Principle: side effects require explicit answer types, not tool-level escape. When termination has consequences (team cleanup, partial contract), the exit path must be a selectable option the agent can act on. Protocols without termination side effects need only `user_esc`. Circular protocol interactions (e.g., boundary redefinition loops) are healthy dialogue — `user_esc` guarantees termination at every moment.

### Audience Reach

CLAUDE.md principles guide contributors (protocol designers). End users receive only SKILL.md content via the plugin system. For a principle to affect runtime protocol behavior, it must be structurally embedded in SKILL.md — documenting it in CLAUDE.md alone is insufficient.

---

## Meta-Principle

### Deficit Empiricism

Protocol creation must be grounded in observed deficit instances (N≥3) from actual sessions. Theoretical deficit classification alone is insufficient justification — the deficit must have demonstrably caused cost (wasted effort, wrong direction, missed consideration) in practice. This grounds the type system in empirical evidence rather than a priori categorization.

---

## Safeguard

### Gate Type Soundness

The answer coproduct defined in TYPES must be consistent with the options presented in Phase prose. When a Qc gate operates on a finite coproduct, every constructor in TYPES must appear as a selectable option, and every option must correspond to a constructor. Violations indicate gate mutation — option injection, deletion, or substitution that diverges from the protocol's formal definition.

This is a safeguard, not an axiom: as models improve, Qc gates with bounded regret become increasingly elidable (the model reliably selects the correct branch without user confirmation). Gate Type Soundness guards against current model limitations in faithful gate realization. The enforcement mechanism is a static check (warning level, not blocking) — see Task #12.

Axiom test (inverse): "Does this principle become less important as models improve?" Yes — perfect gate realization makes this check unnecessary. Compare with A1 (Recognition over Recall), which becomes MORE important as models improve (better models should present richer differential futures, not fewer).

---

## Structural Specifications

### SKILL.md Formal Block Anatomy

All protocols share this structure within `Definition` code block:

```
── FLOW ──              Protocol path formula (multi-line for multi-mode protocols)
── MORPHISM ──          (if applicable) Essential type transition skeleton: requires/deficit/preserves/invariant
── TYPES ──             Symbol definitions with type signatures and comments
── ENTRY TYPES ──       (if applicable) Extended types for entry modes
── DELEGATION TYPES ──  (if applicable) Extended types for delegation structure
── *-BINDING ──         (if applicable) Input binding resolution rules (U-BINDING, E-BINDING, G-BINDING)
── PHASE TRANSITIONS ── Phase-by-phase state transitions; [Tool] suffix marks external operations
── LOOP ──              Post-phase control flow (J values → next phase or terminal)
── BOUNDARY ──          (if applicable) Purpose annotations for key operations
── TOOL GROUNDING ──    Symbol → concrete Claude Code tool mapping
── ELIDABLE CHECKPOINTS ──  (if applicable) Per-gate dual-axis analysis (Qc/Qs answer space + regret profile)
── CATEGORICAL NOTE ──  (if applicable) Mathematical notation definitions
── MODE STATE ──        Runtime state type (Λ) with nested state types
```

Static checks (`structure`, `tool-grounding`) validate this anatomy. New phases must appear in PHASE TRANSITIONS with `[Tool]` suffix AND in TOOL GROUNDING with concrete tool mapping. Gate operations use Qc/Qs kind suffix in operation names (e.g., `Qc (extern)`).

#### FLOW-MORPHISM Relationship

MORPHISM is the image of FLOW under a forgetful functor that discards computational detail and tool annotations, retaining only the essential type transition skeleton (source object → transformation steps → target object) with structural annotations (requires/deficit/preserves/invariant).

### Pattern over Vocabulary

The hermeneutic circle pattern is already structurally encoded in formal blocks — renaming blocks to philosophical terminology adds no structural value. Pattern recognition takes precedence over vocabulary transition.

| Formal Block | Gadamerian Concept | Role |
|---|---|---|
| `preserves:` (MORPHISM) | Vorverständnis (pre-understanding) | Fixed reference point across the circle. Input is read-only; only understanding (output) evolves |
| `invariant:` (MORPHISM) | Produktives Vorurteil (productive prejudice) | Directional constraint on the circle. "X over Y" pattern prevents degenerative interpretation |
| `LOOP` | Hermeneutischer Zirkel (hermeneutic circle) | Part-whole reinterpretation via backward flow. Present in all 10 protocols |
| `CONVERGENCE` | Horizontverschmelzung (horizon fusion condition) | Convergence condition for achieved understanding. Productive termination of the circle |
| `Qs` gate | Horizon Fusion Point | Constitutive gate — user contributes new meaning, fusing horizons |
| `Qc` gate | Horizon Navigation | Classificatory gate — path selection within existing understanding space |

**Primary circle** (intra-protocol): Each protocol's LOOP section encodes backward flow where partial resolution triggers whole re-interpretation, conditioned by `preserves:` (the text being interpreted remains fixed; only the interpretation evolves).

**Secondary pattern** (inter-protocol): Four complementary pairs form Pre/Post cycles on the context fitness axis — Hermeneia↔Katalepsis (intent), Telos↔Syneidesis (goal), Aitesis↔Epharmoge (context), Prothesis↔Analogia (structure). These cycles operate heuristically via Output Style nudge, driven by observed session conditions rather than graph.json structural edges.
