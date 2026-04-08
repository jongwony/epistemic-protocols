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
── COMPOSITION ──       Protocol composition operator definitions (product: D₁ × D₂ → R₁ × R₂)
```

**COMPOSITION block details**:
- Universal: present in all protocol SKILL.md files with identical text
- `*` denotes the composition operator (categorical product on deficit/resolution). Distinct from graph.json `"source": "*"` wildcard (precondition scope)
- `graph.json edges preserved`: precondition, advisory, and suppression edges remain enforced within composite execution. DAG ordering governs dimension detection sequence; suppression prevents co-activation of overlapping pairs
- `Dimension resolution emergent via session context`: dimension interaction (shared codomain discovery, cross-resolution) occurs through Session Text Composition, not prescribed by the operator
- Relationship to /compose skill: /compose is a gate-chain authoring tool (Standing authority, pre-committed pipeline); `*` is a runtime deficit product (Active authority, session-level)

Static checks (`structure`, `tool-grounding`) validate this anatomy. New phases must appear in PHASE TRANSITIONS with `[Tool]` suffix AND in TOOL GROUNDING with concrete tool mapping.

### TOOL GROUNDING Annotation Vocabulary

Every TOOL GROUNDING line carries a parenthetical annotation classifying the operation type. Annotations are exhaustive — every entry must have one.

**Interaction annotations** (user-facing):

| Annotation | Meaning | Tool Pattern |
|------------|---------|--------------|
| `(gate)` | User-facing interaction; stops execution, awaits response | TextPresent+Stop → present |
| `(relay)` | Non-stopping text presentation; proceeds automatically | TextPresent+Proceed |

**Operation annotations** (tool-facing):

| Annotation | Meaning | Boundary criterion | Tool Pattern |
|------------|---------|-------------------|--------------|
| `(sense)` | Internal epistemic operation without tool dispatch | tool dispatch = false ∧ no Λ mutation | Internal analysis/operation (no external tool) |
| `(observe)` | Read-only tool operation for evidence or context | tool dispatch = true ∧ isReadOnly | Read, Grep, Glob; WebSearch (conditional) |
| `(track)` | Protocol state tracking or persistence | Λ(mode state) mutation | TaskCreate, TaskUpdate, TaskGet; or internal state update |
| `(dispatch)` | External system interaction crossing agent boundary | agent/protocol boundary crossing | SendMessage, Agent, Skill |
| `(transform)` | Changes existing artifacts | isReadOnly = false, file tools | Edit, Write |

**Boundary criteria**: Each annotation has a verifiable boundary test that determines classification:
- `(sense)` vs `(observe)`: "Does tool dispatch occur?" Strict rule: if tool dispatch is possible (even conditional), classify as `(observe)`
- `(sense)` vs `(track)`: "Does the operation mutate Λ (mode state)?" State updates → `(track)`, pure analysis → `(sense)`
- `(observe)` vs `(transform)`: "Is the operation read-only?" Read-only → `(observe)`, file mutation → `(transform)`

**Consistency rules**:
- `(sense)` subsumes former `(detect)`, `(infer)`, `(assess)`, `(internal)`, `(synthesis)` — use `(sense)` for all internal operations without tool dispatch
- `(observe)` subsumes former `(collect)`, `(gather)`, `(construct)` and `(detect)` entries with tool dispatch — use `(observe)` for all read-only tool operations
- `(track)` subsumes former `(state)`, `(adjust)` — use `(track)` for all state management
- `(dispatch)` subsumes former `(extern)` — use `(dispatch)` for all boundary-crossing operations
- `(transform)` subsumes former `(modify)` — use `(transform)` for all artifact mutations
- `(enrich)` removed — compound pattern decomposed as `(transform)` with cleanup noted in description
- `(parallel)` and `(conditional)` describe execution topology, not operation type — use the underlying operation annotation (e.g., `(dispatch)` for TeamCreate) with topology noted in the description

**Topology modifiers**:

| Modifier | Meaning | Execution effect |
|----------|---------|-----------------|
| `parallel` | Concurrent execution of multiple instances | Agent/Task spawn with independent contexts |
| `conditional` | Execution gated on runtime predicate | Operation skipped when predicate is false |

**Topology notation convention**: Topology is encoded in the TOOL GROUNDING description text, not in the annotation parenthetical. Pattern: `(operation_type) → Tool (topology_modifier topology: description...)`. This keeps the annotation slot reserved for the 7 standard operation types while preserving topology information for runtime orchestration and static analysis (Grep-searchable via `topology:`).

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

**Context bifurcation** (intra-protocol context separation): Within a single protocol, context collected for different purposes must not be conflated. In Prothesis: `gather(context)` (Phase 1, meta) collects broad context to identify relevant perspectives; `inquire(parallel)` (Phase 3, object) collects perspective-specific evidence through each lens independently. The semantic separation exists in MORPHISM; TOOL GROUNDING realizes it operationally by specifying different collection targets per phase. Passing meta-context to object-level agents biases their investigation toward the lead agent's framing, undermining the epistemic value of independent perspective analysis.

**Tertiary pattern** (cross-session, aspirational — storage half operative, consumption half pending protocol grounding): Reflexion stores session knowledge → next session's protocol Phase 0/1 detection is enriched by accumulated domain knowledge → better protocol execution produces richer insights → Reflexion stores deeper knowledge → spiral deepening. The storage half (Reflexion) and the consumption half (each protocol's Phase 0/1 reading stored knowledge) together complete the cross-session hermeneutic circle. Unlike Primary/Secondary which operate within a single session, Tertiary operates across session boundaries with persistent knowledge as the medium. Consumption grounding requires protocol SKILL.md updates specifying how Phase 0/1 reads stored knowledge — contingent on prior Reflexion output.

## Relay Classification Audit Trail

When an ELIDABLE CHECKPOINT is classified as relay and auto-resolved, the justification should be traceable to the five relay indicators defined in A2 Relay/Constitution Boundary (`axioms.md` table: deterministic, citable, within-boundary, entropy→0, basis-cited). This is not a new principle but an audit format surfacing existing A2 indicators.

### Relay Justification Format

```
[relay] {Protocol} Phase {N} {Gate Label}
  ├─ deterministic:    {yes/no} — {evidence}
  ├─ citable:          {yes/no} — {source}
  ├─ within-boundary:  {yes/no} — {scope}
  ├─ entropy→0:        {yes/no} — {evidence}
  └─ basis-cited:      {yes/no} — {mechanism}
  verdict: relay ({N}/5)
```

Relationship to the 3-axis elidability model (`docs/analysis/protocol-composition-gate-elision.md`): the 3-axis model determines whether a gate CAN be elided; relay justification documents HOW the elision is justified at the A2 level.
