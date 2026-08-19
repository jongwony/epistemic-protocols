# Structural Specifications

Implementation-level specifications for SKILL.md formal blocks. These are descriptive references for protocol editing, not prescriptive principles.

## Formal Blocks Are Runtime-Normative, Not Contributor Spec

The `Definition` code blocks — FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, LOOP, TOOL GROUNDING, MODE STATE, CONVERGENCE, and their peers — are **LLM-facing and runtime-normative**, and they are **constitutive of protocol identity**: they *type* the prose, fixing what each phase, gate, transition, and resolution means. A runtime model reads them to execute the protocol; they are part of the normative `SKILL.md` contract (per `CLAUDE.md` Runtime Contract: "`SKILL.md` carries the normative user contract"). That the `Definition` blocks are LLM-facing is asserted here and in `CLAUDE.md`, on this project's own authority — it is a fact about this repository's artifacts, so no general principle grounds it.

The contributor-facing *prescriptive* surface is `.claude/rules/` plus `CLAUDE.md` (and exposition under `docs/`) — **never the formal blocks**. This document is the one contributor-facing artifact *about* the formal blocks: it documents their anatomy and editing conventions. Keep the two layers distinct — the anatomy guide is contributor-facing; the blocks it describes are runtime-normative. Do not classify a formal block as "contributor-facing spec" and drop or thin it when producing a reduced or single-shot realization of a protocol: removing a formal block removes the type that constitutes the protocol. The block governs *what* the protocol is; how its symbols are *rendered* to a user is a separate emit-layer concern (see §User-Facing Emit Load Disciplines below, and the Output Style's Vocabulary rendering).

## SKILL.md Formal Block Anatomy

Protocols draw their `Definition` code block from this structure:

```
── FLOW ──              Protocol path formula (multi-line for multi-mode protocols)
── MORPHISM ──          (if applicable) Essential type transition skeleton: requires/deficit/preserves/invariant
── TYPES ──             Symbol definitions with type signatures and comments
── *-BINDING ──         (if applicable) Input binding resolution rules (R-BINDING, A-BINDING, U-BINDING, SCOPE-BINDING, V-BINDING, WP-BINDING)
── PHASE TRANSITIONS ── Phase-by-phase state transitions; [Tool] suffix marks external operations
── LOOP ──              Post-phase control flow (J values → next phase or terminal)
── CONVERGENCE ──       (if applicable) Terminal predicates making LOOP's termination claims true
── BOUNDARY ──          (if applicable) Purpose annotations for key operations
── TOOL GROUNDING ──    Symbol → the capability or internal operation that realizes it; `(constitution)`/`(extension)` interaction kind annotation; conditional Constitution-to-Extension specialization recorded as separate `(extension)` entries within the same phase
── CATEGORICAL NOTE ──  (if applicable) Mathematical notation definitions
── MODE STATE ──        Runtime state type (Λ) with nested state types
── COMPOSITION ──       (if applicable) Protocol composition operator definitions (product: D₁ × D₂ → R₁ × R₂)
```

**COMPOSITION block details**:
- Shape: a file carrying this block opens it with the operator line `*: product — (D₁ × D₂) → (R₁ × R₂).` followed by the protocol's own resolution-emergence sentence; protocol-specific composition rationale may follow
- `*` denotes the composition operator (categorical product on deficit/resolution): `D₁ × D₂` is the composite domain and `R₁ × R₂` the composite codomain
- The operator fixes the composite domain and codomain and nothing between them. Each participating protocol's own formal blocks supply its runtime-normative deficit-to-resolution contract during composition
- `<X> resolution emergent via session context`: dimension interaction (shared codomain discovery, cross-resolution) occurs through Session Text Composition, not prescribed by the operator
- `*` is a runtime deficit product (Active authority, session-level), distinct from pre-committed gate-chain pipelines (Standing authority)

New phases must appear in PHASE TRANSITIONS with `[Tool]` suffix AND in TOOL GROUNDING with the capability or internal operation that realizes it. Which parts of this anatomy a static check actually enforces is read from the check itself rather than asserted here — an enforcement-coverage claim on this surface has nothing that re-runs it, so it keeps asserting an earlier reading with present authority.

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
| `(observe)` | Read-only tool operation for evidence or context | tool dispatch = true ∧ isReadOnly | `artifact read`, `artifact search`, `record read`; `external fetch` (conditional) |
| `(track)` | Protocol state tracking or persistence | Λ(mode state) mutation | `record`, `record update`; or internal state update where the entry need not outlive the session |
| `(dispatch)` | External system interaction crossing agent boundary | agent/protocol boundary crossing | `message`, `delegate`, `invoke` |
| `(transform)` | Changes existing artifacts | isReadOnly = false, artifact mutation | `artifact write` |

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
- `(parallel)` and `(conditional)` describe execution topology, not operation type — use the underlying operation annotation (e.g., `(dispatch)` for a peer-set creation) with topology noted in the description

**Topology modifiers**:

| Modifier | Meaning | Execution effect |
|----------|---------|-----------------|
| `parallel` | Concurrent execution of multiple instances | isolated executors started with independent contexts |
| `conditional` | Execution gated on runtime predicate | Operation skipped when predicate is false |

**Topology notation convention**: Topology is encoded in the TOOL GROUNDING description text, not in the annotation parenthetical. Pattern: `(operation_type) → Tool (topology_modifier topology: description...)`. This keeps the annotation slot reserved for the operation-type annotations while preserving topology information for runtime orchestration and static analysis (Grep-searchable via `topology:`).

### FLOW-MORPHISM Relationship

MORPHISM is the image of FLOW under a forgetful functor that discards computational detail and tool annotations, retaining only the essential type transition skeleton (source object → transformation steps → target object) with structural annotations (requires/deficit/preserves/invariant).

### Type Category Convention

The convention governing what a TYPES entry may carry is in `.claude/rules/type-category-convention.md`. Read it before creating a TYPES block or changing what one carries.

## User-Facing Emit Load Disciplines

Separate rules manage the load a user-facing round places on its reader. Their canonical text lives in the Output Style source and is compiled into each protocol's `## Rules`, and a static check holds those two copies in sync. What this section adds is why they do not collapse into one another — restating the rules a third time here would answer to no guard and would drift away from the two copies that do.

Round composition folds what were three separate rules — placement (context laid out before a gate, not folded inside it), vocabulary (plain rendering held across the session), and per-round adjacency (the judgment bundled beside its nearest evidence and the implication bearing on the next move, so the reader is not left to reassemble it) — into one inline rule, because each governs the same act from a different angle: composing a round the reader can act on without reassembling it. Folding them removes the seam where a protocol could satisfy the placement and vocabulary constraints while still scattering adjacent evidence across distant paragraphs or mixing unrelated findings into one decision round; there is no longer a second rule left to close that gap after the fact. The occasion-bound detail behind each angle — when a rendering must hold or wording must be carried through unchanged, what in view belongs to a later round or a trace, where a protocol's own phases put a sentence relative to a gate — moved to each skill's own `references/round-composition.md`, read only when that occasion arises. Form feedback stays a separate rule rather than folding in: it does not shape a round's default composition, it corrects composition in response to an explicit signal about form, and that is a different trigger from anything Round composition governs on its own.

## Gate Runtime Semantics

**Qc/Qs runtime distinction**: The Qc/Qs classification is a definition-time property of the gate — Qs expects constitutive response, Qc expects classificatory response. At runtime with Text+Stop realization, this distinction blurs: Qc gate responses can carry constitutive surplus (new meaning beyond the classification). The formal answer type (closed coproduct) captures the classification; the constitutive surplus is captured by Phase 3 `integrate` — a sense operation whose non-obvious interpretive contribution may be surfaced through Output Style `Basis:` marker when non-trivial (Detection with Authority's Visibility principle, `premise/recognition-and-authority.md`).

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

This boundary informs type naming: `Prospect` (forward-looking, unrealized), `Result` (completed work product), `Text` (abstract structure carrier). The temporal encoding in type names provides protocol discrimination signal at SKILL.md load time, per Semantic Autonomy (`premise/interaction-factorization.md`).

## Intra-Protocol Context Separation

**Context bifurcation** (intra-protocol context separation): Within a single protocol, context collected for different purposes must not be conflated. In Prothesis: `gather(context)` (Phase 1, meta) collects broad context to identify relevant perspectives; object-scope evidence is collected per-perspective at substrate execution time, after the Phase 3 handoff — the handoff (the framed object) deliberately excludes the meta-context — it is not passed to the substrate — so each perspective collects through its own lens independently (the TOOL GROUNDING G entry's meta-scope note). Passing meta-context to object-level executors biases their investigation toward the lead agent's framing, undermining the epistemic value of independent perspective analysis.

## Cross-Session Tertiary Pattern

**Tertiary pattern** (cross-session, both halves operative): Anamnesis hypomnesis store persists session recall indices → next session's protocol Phase 0/1 detection is enriched by accumulated domain knowledge → better protocol execution produces richer insights → hypomnesis store deepens → spiral deepening. The storage half (Anamnesis hypomnesis write) and the consumption half (each consuming protocol's Phase 0/1 reading stored knowledge) together complete the cross-session pattern. Unlike Primary/Secondary which operate within a single session, Tertiary operates across session boundaries with persistent knowledge as the medium. Two consumption patterns coexist, and the asymmetry between them is intentional. A protocol whose consumption runs through an evidence-source channel can tag what it reads (`source: "memory:{path}"`) and guard it for staleness, grounded in the Citable axis of Detection with Authority's Cognitive Partnership Move (Extension/Relay basis = external source). A protocol whose Phase 0/1 merely biases toward accumulated domain patterns has no such channel and relies on protocol-specific pollution resistance (halt characteristics, gate judgment) per `.claude/principles/architectural-principles.md` Cross-Session Knowledge Composition Pollution caveat. Applying evidence-source machinery uniformly would misclassify Constitution operations (where AI inference is the basis) as Extension — which is the reason for the split, not an accident of who implemented what. Which protocol sits on which side is read from its own SKILL.md; a roster here would have nothing re-running it. Operational-fidelity monitoring (whether enrichment improves Phase 0/1 detection vs. surfaces pollution) is the ongoing observation focus.

## Extension Classification Audit Trail

When a TOOL GROUNDING entry is classified as `(extension)` (relay-eligible) and auto-resolved, the justification should be traceable to the five relay indicators defined in Detection with Authority's Relay/Constitution Boundary table (deterministic, citable, within-boundary, entropy→0, basis-cited). This is not a new principle but an audit format surfacing existing indicators there.

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

To see the convention in force, grep the TOOL GROUNDING blocks for a condition suffix (`_from_arg`, `_auto`, `_resume`) — a roster of which protocols currently split would go stale the next time one is added or collapsed, and nothing re-runs a roster.

Non-split (canonical) form remains the default: when no conditional specialization exists, the entry stays as the canonical label (`Phase N Qc (constitution)` or `Phase N {label} (extension)`). Split applies only when one runtime branch is genuinely Extension-eligible.
