# Structural Specifications

Implementation-level specifications for SKILL.md formal blocks. These are descriptive references for protocol editing, not prescriptive principles.

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
── TOOL GROUNDING ──    Symbol → concrete Claude Code tool mapping; gate/relay interaction kind annotation
── ELIDABLE CHECKPOINTS ──  (if applicable) Per-gate dual-axis analysis (relay/gated interaction kind + regret profile)
── CATEGORICAL NOTE ──  (if applicable) Mathematical notation definitions
── MODE STATE ──        Runtime state type (Λ) with nested state types
```

Static checks (`structure`, `tool-grounding`) validate this anatomy. New phases must appear in PHASE TRANSITIONS with `[Tool]` suffix AND in TOOL GROUNDING with concrete tool mapping. Gate operations use `(gate)` annotation for user-facing gate interactions (e.g., `Qc (gate)`); relay operations use `(relay)` annotation for non-stopping text presentations that proceed automatically (e.g., `converge (relay)`); non-gate external operations retain `(extern)`.

### FLOW-MORPHISM Relationship

MORPHISM is the image of FLOW under a forgetful functor that discards computational detail and tool annotations, retaining only the essential type transition skeleton (source object → transformation steps → target object) with structural annotations (requires/deficit/preserves/invariant).

### Type Category Convention

TYPES blocks use three distinct type categories, each with its own definitional style:

- **Input types** (morphism domain): Natural language definition with source-agnostic enumeration. The morphism treats inputs uniformly — protocol behavior does not branch on subtypes. Subtypes enumerate conceptual scope for readers, not dispatching targets. Coproduct structure is inappropriate because it implies behavioral branching that does not exist in PHASE TRANSITIONS.
- **Classification types** (processing taxonomy): Open set ∪ Emergent(T). Used for categorization during detection/assessment. Open because new categories can emerge from context.
- **Answer types** (gate response): Closed coproduct. Each constructor leads to a distinct processing path in the subsequent phase. Closed because the protocol must handle all cases.

The test: if PHASE TRANSITIONS handle each case differently, use coproduct. If the protocol processes uniformly regardless of input category, use natural language definition.

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

**Secondary pattern** (inter-protocol): Four complementary pairs form Pre/Post cycles on the context fitness axis — Hermeneia↔Katalepsis (intent), Telos↔Syneidesis (goal), Aitesis↔Epharmoge (context), Prothesis↔Analogia (structure). These cycles operate heuristically via Output Style nudge, driven by observed session conditions rather than graph.json structural edges.

**Artifact-observability boundary** (type naming principle): Protocol input type names encode their temporal relationship to observable artifacts — the dividing line being Read/Grep observability:
- **Aitesis** (Prospect): Pre-artifact. Context sufficiency is assessed before artifacts are produced. X cannot yet be Read/Grep'd.
- **Epharmoge** (Result): Post-artifact. Applicability is evaluated after artifacts exist. R is Read/Grep-observable.
- **Analogia** (Text): Time-independent. Structural mapping validation operates on abstract structures regardless of artifact existence.

This boundary informs type naming: `Prospect` (forward-looking, unrealized), `Result` (completed work product), `Text` (abstract structure carrier). The temporal encoding in type names provides protocol discrimination signal at SKILL.md load time, per A4 Semantic Autonomy.

**Tertiary pattern** (cross-session, aspirational — storage half operative, consumption half pending protocol grounding): Reflexion stores session knowledge → next session's protocol Phase 0/1 detection is enriched by accumulated domain knowledge → better protocol execution produces richer insights → Reflexion stores deeper knowledge → spiral deepening. The storage half (Reflexion) and the consumption half (each protocol's Phase 0/1 reading stored knowledge) together complete the cross-session hermeneutic circle. Unlike Primary/Secondary which operate within a single session, Tertiary operates across session boundaries with persistent knowledge as the medium. Consumption grounding requires protocol SKILL.md updates specifying how Phase 0/1 reads stored knowledge — contingent on prior Reflexion output.
