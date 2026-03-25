# Design Philosophy

Detailed rationale for each design principle governing epistemic protocols.

## Unix Philosophy Homomorphism

Each protocol is a single-purpose epistemic tool. Composition is bottom-up — users invoke protocols for recognized cost situations, not follow a prescribed pipeline. The precedence order (see CLAUDE.md Protocol Precedence) is a logical default for multi-activation, not a mandatory sequence.

## Session Text Composition

Inter-protocol data flows as natural language in the session context — no structured data channels between protocols. Each protocol's output becomes part of the conversation that subsequent protocols naturally read. Cell-based structured transport was considered and rejected: structuring context loses information. If structured transport becomes necessary, functor composition is the escalation path.

## Dual Advisory Layer

Inter-protocol guidance operates through two distinct mechanisms at different abstraction levels: graph.json `advisory` edges (structural, validated by static checks, topology-aware) and Post-Convergence Suggestions (heuristic, session-context-dependent, deficit-condition-driven). These are complementary, not redundant — graph.json edges encode stable architectural relationships, while Post-Convergence suggestions respond to runtime session state. Suggestion targets may overlap with or diverge from graph.json edges; neither system constrains the other.

## Coexistence over Mirroring

Protocols coexist with Claude Code built-in commands (`/simplify`, `/batch`) as orthogonal tools occupying different layers:

| Layer | Concern | Tools |
|-------|---------|-------|
| Epistemic | "Are we doing the right thing?" | Protocols (`/clarify`, `/goal`, `/inquire`, `/gap`, ...) |
| Execution | "Are we doing it correctly?" | Built-ins (`/batch`, `/simplify`) |
| Verification | "Did we understand?" | Protocol (`/grasp`) |

Do not mirror built-in execution capabilities (e.g., worktree isolation, PR creation) into protocol definitions. Do not absorb protocol epistemic concerns into built-in command wrappers. Each system maintains its own responsibility boundary, exchanging results at handoff points only.

## Three-Tier Termination

Protocol exit follows a graduated taxonomy based on side-effect presence:

| Tier | Mechanism | Cleanup | Scope |
|------|-----------|---------|-------|
| `user_esc` | Esc key at gate (tool-level or free-response turn) | None (ungraceful) | All protocols — universal |
| `user_withdraw` | Explicit gate option | Yes (team shutdown, partial state) | Protocols with side-effect state only |
| Normal convergence | Completion predicate | Full | Per-protocol |

Principle: side effects require explicit answer types, not tool-level escape. When termination has consequences (team cleanup, partial contract), the exit path must be a selectable option the agent can act on. Protocols without termination side effects need only `user_esc`. Circular protocol interactions (e.g., boundary redefinition loops) are healthy dialogue — `user_esc` guarantees termination at every moment.

## Audience Reach

CLAUDE.md principles guide contributors (protocol designers). End users receive only SKILL.md content via the plugin system. For a principle to affect runtime protocol behavior, it must be structurally embedded in SKILL.md — documenting it in CLAUDE.md alone is insufficient.

## Adversarial Protocol Design

Each protocol must anticipate how an AI agent might shortcut or rationalize away from faithful execution, and include structural guards in Rules and Phase prose. Formal specification guarantees definitional consistency; adversarial design guarantees execution fidelity. Common rationalization paths: premature convergence assertion, silent detection dismissal, skipping gate interaction entirely (presenting content without yielding turn for response), collapsing Qs gates to plain acknowledgment, gate mutation (option injection — adding options not in definition, option deletion — removing defined options, option substitution — replacing defined options with different ones). These are orthogonal concerns — a protocol can be formally correct yet routinely circumvented.

## Deficit Empiricism

Protocol creation must be grounded in observed deficit instances (N≥3) from actual sessions. Theoretical deficit classification alone is insufficient justification — the deficit must have demonstrably caused cost (wasted effort, wrong direction, missed consideration) in practice. This grounds the type system in empirical evidence rather than a priori categorization.

## Convergence Evidence

Protocol convergence must be demonstrated, not asserted. At convergence, the agent must present a transformation trace mapping each identified deficit instance to its resolution — the MORPHISM instantiated at the concrete level. "All gaps resolved" or "goal defined" as bare assertion without per-item evidence = protocol violation.

## Semantic Autonomy

Once a protocol definition is inscribed in SKILL.md, its epistemic meaning achieves autonomy from any specific platform or tool ecosystem — it depends only on what any language model can do (generate text, yield turn), not on platform-specific features. Protocol specifications define gate semantics (what to present, what response constitutes), not tool mechanics. A gate is: present structured content → yield turn → parse response. The realization layer maps this to concrete tools based on client capabilities and user preferences.

Category-theoretic interpretation: TOOL GROUNDING acts as a natural transformation from abstract epistemic operations (the "protocol functor") to platform-specific tool calls (the "realization functor"). Semantic Autonomy requires this transformation to preserve the MORPHISM chain's structure regardless of target platform.

## Pattern over Tool

The Recognition over Recall principle is a content invariant — the protocol function lies in the structured options pattern, not in the specific tool that renders them. Structured numbered text followed by turn yield satisfies the same epistemic function as an AskUserQuestion tool call. The invariant: user receives structured options with differential implications, and their response is parsed into a typed answer.

## Interaction Kind Factorization

Every user-facing gate operation factors as G = R(p) ∘ A, where A abstracts the gate (Ep → Abs) and R(p) realizes it for preferences p (Abs → Cl). Gate operations are classified: Qc (classificatory — projection from finite coproduct; user selects from N options) and Qs (constitutive — pushout; user response incorporates new content). Qc has bounded regret by default when elided (correctable at next gate); Qs has unbounded regret (missed user content). Specific Qc gates may carry unbounded regret from downstream irreversibility — expressed via always_gated annotation in ELIDABLE CHECKPOINTS.

## Full Taxonomy Confirmation

When a Qc gate operates on a finite, protocol-owned taxonomy with always_gated annotation, present ALL types with detection status, evidence, and falsification conditions — not only the detected subset behind a generic action verb. The complete assessment enables Recognition (evaluate presented options) over Recall (generate missing options from memory). Design smell: "generic verb hiding finite taxonomy state" — when a gate option label (e.g., "Add type") conceals concrete candidates the AI has already analyzed, creating a Qc/Qs kind impurity (the gate appears classificatory but the sub-step requires constitutive user input). Fix: materialize the full taxonomy, converting mixed Qc/Qs to pure Qc. Applies to: finite type sets with always_gated Qc. Does not apply to: open-ended generation, per-item iteration, or runtime-variable sets. Same principle applies to Post-Convergence Suggestions: traverse ALL listed conditions against session context with explicit status, not only those the AI deems applicable.

## Zero-Shot Instruction Preference

LLM-facing instructions (Output Style, SKILL.md prose, agent prompts) state principles, not examples. When a rendering rule, behavioral guideline, or structural constraint can be expressed as a principle, do not append few-shot examples or category-level mapping lists. Few-shot examples create a soft-table effect — anchoring the model to specific instances rather than letting it apply the principle to novel contexts. A principle that requires examples to be understood is underspecified; fix the principle, do not patch it with examples.

## SKILL.md Formal Block Anatomy

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

### FLOW-MORPHISM Relationship

MORPHISM is the image of FLOW under a forgetful functor that discards computational detail and tool annotations, retaining only the essential type transition skeleton (source object → transformation steps → target object) with structural annotations (requires/deficit/preserves/invariant).

## Pattern over Vocabulary

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

**Secondary pattern** (inter-protocol): Four complementary pairs form Pre/Post cycles on the context fitness axis — Hermeneia↔Katalepsis (intent), Telos↔Syneidesis (goal), Aitesis↔Epharmoge (context), Prothesis↔Analogia (structure). These cycles operate heuristically via Post-Convergence suggestions, driven by session context rather than graph.json structural edges.
