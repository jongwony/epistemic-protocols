# Structural Specifications

Implementation-level specifications for SKILL.md formal blocks. These are descriptive references for protocol editing, not prescriptive principles.

## Formal Blocks Are Runtime-Normative, Not Contributor Spec

The `Definition` code blocks — FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, LOOP, TOOL GROUNDING, MODE STATE, CONVERGENCE, and their peers — are **LLM-facing and runtime-normative**, and they are **constitutive of protocol identity**: they *type* the prose, fixing what each phase, gate, transition, and resolution means. A runtime model reads them to execute the protocol; they are part of the normative `SKILL.md` contract (per `CLAUDE.md` Runtime Contract: "`SKILL.md` carries the normative user contract"; and `.claude/rules/derived-principles.md` Zero-Shot Instruction Preference: "SKILL.md formal blocks (Definition code blocks) are LLM-facing by definition").

The contributor-facing *prescriptive* surface is `.claude/rules/` plus `CLAUDE.md` (and exposition under `docs/`) — **never the formal blocks**. This document is the one contributor-facing artifact *about* the formal blocks: it documents their anatomy and editing conventions. Keep the two layers distinct — the anatomy guide is contributor-facing; the blocks it describes are runtime-normative. Do not classify a formal block as "contributor-facing spec" and drop or thin it when producing a reduced or single-shot realization of a protocol: removing a formal block removes the type that constitutes the protocol. The block governs *what* the protocol is; how its symbols are *rendered* to a user is a separate emit-layer concern (see §User-Facing Emit Load Disciplines below, and the Output Style's Vocabulary rendering).

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
── TOOL GROUNDING ──    Symbol → concrete Claude Code tool mapping; `(constitution)`/`(extension)` interaction kind annotation; conditional Constitution-to-Extension specialization recorded as separate `(extension)` entries within the same phase
── CATEGORICAL NOTE ──  (if applicable) Mathematical notation definitions
── MODE STATE ──        Runtime state type (Λ) with nested state types
── COMPOSITION ──       Protocol composition operator definitions (product: D₁ × D₂ → R₁ × R₂)
```

**COMPOSITION block details**:
- Coverage: present in all protocol SKILL.md files except anagoge (`anagoge/skills/ascend/SKILL.md` carries no COMPOSITION block). Files that carry it share the opening operator line (`*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. … resolution emergent via session context.`), with the resolution-domain noun worded per protocol; several protocols append protocol-specific composition rationale below the operator line
- `*` denotes the composition operator (categorical product on deficit/resolution). Distinct from graph.json `"source": "*"` wildcard (precondition scope)
- `registered dependency edges preserved`: precondition, advisory, and suppression edges (registered in `graph.json`) remain enforced within composite execution. DAG ordering governs dimension detection sequence; suppression prevents co-activation of overlapping pairs
- `Dimension resolution emergent via session context`: dimension interaction (shared codomain discovery, cross-resolution) occurs through Session Text Composition, not prescribed by the operator
- `*` is a runtime deficit product (Active authority, session-level), distinct from pre-committed gate-chain pipelines (Standing authority)

Static checks (`structure`, `tool-grounding`) validate this anatomy. New phases must appear in PHASE TRANSITIONS with `[Tool]` suffix AND in TOOL GROUNDING with concrete tool mapping.

### TOOL GROUNDING Annotation Vocabulary

Every TOOL GROUNDING line carries a parenthetical annotation classifying the operation type. Annotations are exhaustive — every entry must have one.

**Interaction annotations** (user-facing):

| Annotation | Meaning | Tool Pattern |
|------------|---------|--------------|
| `(constitution)` | User-facing interaction where a constitutive user judgment is required | TextPresent+Stop → present |
| `(extension)` | Relay-eligible presentation or auto-resolution where no constitutive surplus is required | TextPresent+Proceed |

`(constitution)` / `(extension)` are the sole TOOL GROUNDING interaction annotations. `Qc` and `Qs` name gate shapes; they do not replace the annotation class.

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

## User-Facing Emit Load Disciplines

Three separate rules manage cognitive load at runtime:

- **Context-Question Separation** controls placement: analysis, evidence, and rationale appear before the gate; the gate contains only the essential question and option-specific differential implications.
- **Plain emit discipline** controls vocabulary: user-facing text uses everyday language and keeps formal variables, Greek-rooted protocol terms, and code-style tokens inside formal specification surfaces.
- **Round-local salience bundling** controls round composition: each user-facing round keeps the current judgment, nearest evidence, and next-move implication adjacent, while deferring background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.

These disciplines are complementary. A protocol can satisfy Context-Question Separation and Plain emit discipline while still increasing context-switch cost by scattering adjacent evidence across distant paragraphs or mixing unrelated findings into one decision round. Round-local salience bundling closes that gap without introducing measurement: the binding unit is the round-local judgment surface, not a quantified load score.

## Gate Runtime Semantics

**Qc/Qs runtime distinction**: The Qc/Qs classification is a definition-time property of the gate — Qs expects constitutive response, Qc expects classificatory response. At runtime with Text+Stop realization, this distinction blurs: Qc gate responses can carry constitutive surplus (new meaning beyond the classification). The formal answer type (closed coproduct) captures the classification; the constitutive surplus is captured by Phase 3 `integrate` — a sense operation whose non-obvious interpretive contribution may be surfaced through Output Style `Basis:` marker when non-trivial (A2 Visibility).

**ConstitutionSurface<T>** names the typed pre-gate surface on which a Constitution interaction becomes meaningful:

```
ConstitutionSurface<T> = {
  current_object: T,
  pressure_map: Option(ProtocolNativeMap),
  evidence: Set(Evidence),
  residual_unknowns: Set(ResidualUnknown),
  move_space: UserMoveCoproduct,
  repair_paths: Set(RepairPath)
}
```

Relationship to existing terms:

- `Constitution` and `Extension` are TOOL GROUNDING interaction kinds.
- `Qc` and `Qs` are gate shapes: classificatory vs constitutive response expectations.
- `ConstitutionSurface<T>` is the structured user-facing surface placed before a `Qc` or `Qs` gate; it does not replace the gate, the interaction kind, or the user's move.
- A pressure map belongs in this surface only when it is protocol-native and changes the next user judgment. Discovery pressure is bounded to residual unknowns that can materially alter that judgment, not general horizon exploration.

**Interpretive transparency architecture**: `Basis:` is a discretionary session-level annotation — it fires when AI interpretation transcends mechanical derivation, unlike the former `integrate-echo` which was a mandatory structural relay. The semantic boundary shifts from a deducibility test (augmentation not derivable from {input, context_structure}) to an observability criterion (cite specific evidence grounding the interpretation). This relocation from protocol-owned TOOL GROUNDING to the session-level observation layer follows the Session-level observer exception (Audience Reach) — the same architectural pattern governing nudge.

The `Qs` gate's formal correspondence to Horizontverschmelzung (horizon fusion) and the cycle's structural pattern are catalogued in `.claude/principles/hermeneutic-cycle.md`. This correspondence is descriptive, not a guarantee that a gate or `ConstitutionSurface<T>` completes horizon fusion.

## Resolution Meta-Contract

Canonical protocol resolution names remain protocol-native: `ValidatedMapping`, `AuditedDecision`, `CrystallizedAbstraction`, `ResolvedEndpoint`, and peer names are not renamed to a generic terminal type. `DeficitResolved<D, R>` is a meta-contract that those canonical resolution types should satisfy when their formal surface is edited:

```
DeficitResolved<D, R> =
  R where
    morphism_completed(D → R)
    ∧ completion_trace_declared(D → phase_operations → R)
    ∧ residual_unknown_disposition_declared
```

Reference shapes:

```
ResidualDisposition ∈ {None, Declared, Deferred, Dismissed, Routed, Bounded}
  -- closed disposition signal; each constructor has distinct downstream handling semantics

ResidualUnknown = {
  item: String,
  status: ResidualDisposition,
  reason: String,
  downstream?: Reference
}

MorphismCompletionTrace<D, R> =
  List(D instance → PhaseOperation → ResolutionEvidence)

-- Carrier shape for materializing the predicate contract above.
DeficitResolved<D, R> = {
  result: R,
  trace: MorphismCompletionTrace<D, R>,
  residual: Map(ResidualUnknown.item, ResidualDisposition)
}
```

`residual = ∅` is valid only when emptiness is declared. Silent absence of residuals is not equivalent to `None`. Resolution means morphism completion is traceable and residual unknown disposition is visible; it does not mean all unknowns are eliminated. Residual disposition is not a new user gate by default.

## Type Naming and Artifact Observability

**Artifact-observability boundary** (type naming principle): Protocol input type names encode their temporal relationship to observable artifacts — the dividing line being Read/Grep observability:
- **Aitesis** (Prospect): Pre-artifact. Context sufficiency is assessed before artifacts are produced. X cannot yet be Read/Grep'd.
- **Epharmoge** (Result): Post-artifact. Applicability is evaluated after artifacts exist. R is Read/Grep-observable.
- **Analogia** (Text): Time-independent. Structural mapping validation operates on abstract structures regardless of artifact existence.

This boundary informs type naming: `Prospect` (forward-looking, unrealized), `Result` (completed work product), `Text` (abstract structure carrier). The temporal encoding in type names provides protocol discrimination signal at SKILL.md load time, per A4 Semantic Autonomy.

## Intra-Protocol Context Separation

**Context bifurcation** (intra-protocol context separation): Within a single protocol, context collected for different purposes must not be conflated. In Prothesis: `gather(context)` (Phase 1, meta) collects broad context to identify relevant perspectives; object-scope evidence is collected per-perspective at substrate execution time, after the Phase 3 handoff — the handoff (the framed object) deliberately excludes the meta-context — it is not passed to the substrate — so each perspective collects through its own lens independently (the TOOL GROUNDING G entry's meta-scope note). Passing meta-context to object-level executors biases their investigation toward the lead agent's framing, undermining the epistemic value of independent perspective analysis.

## Cross-Session Tertiary Pattern

**Tertiary pattern** (cross-session, both halves operative): Anamnesis hypomnesis store persists session recall indices → next session's protocol Phase 0/1 detection is enriched by accumulated domain knowledge → better protocol execution produces richer insights → hypomnesis store deepens → spiral deepening. The storage half (Anamnesis hypomnesis write) and the consumption half (each consuming protocol's Phase 0/1 reading stored knowledge) together complete the cross-session pattern. Unlike Primary/Secondary which operate within a single session, Tertiary operates across session boundaries with persistent knowledge as the medium. Consumption-half is operative across all 13 consuming protocols as Cross-session enrichment paragraphs in SKILL.md prose. **Aitesis carries protocol-internal sophistication** — EvidenceSource fiber + `source: "memory:{path}"` tagging + staleness guard scoped to its empirical-evidence operation, grounded in `.claude/rules/axioms.md` A2 Cognitive Partnership Move's Citable axis (Extension/Relay basis = external source). **The other 12 consuming protocols use the simpler heuristic-input pattern** — Phase 0/1 may bias toward accumulated domain patterns, with protocol-specific pollution resistance (halt characteristics, gate judgment) per `.claude/principles/architectural-principles.md` Cross-Session Knowledge Composition Pollution caveat. The asymmetry is intentional: applying Aitesis-style evidence-source machinery uniformly would misclassify Constitution operations (where AI inference is the basis) as Extension. Operational-fidelity monitoring (whether enrichment improves Phase 0/1 detection vs. surfaces pollution) is the ongoing observation focus.

## Extension Classification Audit Trail

When a TOOL GROUNDING entry is classified as `(extension)` (relay-eligible) and auto-resolved, the justification should be traceable to the five relay indicators defined in A2 Relay/Constitution Boundary (`axioms.md` table: deterministic, citable, within-boundary, entropy→0, basis-cited). This is not a new principle but an audit format surfacing existing A2 indicators.

### Extension Justification Format

```
[Extension] {Protocol} Phase {N} {Entry Label}
  ├─ deterministic:    {yes/no} — {evidence}
  ├─ citable:          {yes/no} — {source}
  ├─ within-boundary:  {yes/no} — {scope}
  ├─ entropy→0:        {yes/no} — {evidence}
  └─ basis-cited:      {yes/no} — {mechanism}
  verdict: Extension ({N}/5)
```

Relationship to historical 3-axis elidability model (pre-unification): prior analysis used three axes; the post-unification single TOOL GROUNDING axis subsumes the prior model — `(extension)` classifies relay-eligibility, `(constitution)` classifies Constitution requirement, with conditional specialization absorbed as separate `(extension)` entries.

## Split-Entry Naming Convention

When a phase contains a conditional gate (some runtime conditions resolve to Extension while others require Constitution), the gate is split into separate TOOL GROUNDING entries within the same phase. Naming pattern:

- **Extension half**: `Phase N {gate_label}_{condition} (extension)` — descriptive condition suffix indicating when this entry fires (e.g., `_from_arg`, `_auto`, `_resume`, `_unique_match`, `_no_match`).
- **Constitution half**: `Phase N {gate_label} (constitution)` or `Phase N {gate_label}_{purpose} (constitution)` — the canonical gate label, with an optional purpose suffix when ambiguity persists. This entry fires on the default branch (when the Extension condition is not met).

The Extension entry's condition suffix records the predicate inline. Both halves point to the same underlying phase operation; the split is realization, not phase duplication.

Examples observed in current SKILL.md:

- prothesis: `Phase 0 MB_from_arg (extension)` + `Phase 0 Qc (constitution)`
- misuse: `Phase 0 scope_from_arg (extension)` + `Phase 0 scope_default_relay (extension)` + `Phase 0 scope_expand_confirm (constitution)` (Constitution fires on the expansion branch — cross-session / cross-project — not on the safe current-session default, which relays)
- steer: `Phase 0 scope_from_arg (extension)` + `Phase 0 Qc (constitution)`
- realign: `Phase 0 scope_from_arg (extension)` + `Phase 0 Qc (constitution)`

Non-split (canonical) form remains the default: when no conditional specialization exists, the entry stays as the canonical label (`Phase N Qc (constitution)` or `Phase N {label} (extension)`). Split applies only when one runtime branch is genuinely Extension-eligible.
