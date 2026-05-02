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
── TOOL GROUNDING ──    Symbol → concrete Claude Code tool mapping; `(constitution)`/`(extension)` interaction kind annotation; conditional Constitution-to-Extension specialization recorded as separate `(extension)` entries within the same phase
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

**Qc/Qs runtime distinction**: The Qc/Qs classification is a definition-time property of the gate — Qs expects constitutive response, Qc expects classificatory response. At runtime with Text+Stop realization, this distinction blurs: Qc gate responses can carry constitutive surplus (new meaning beyond the classification). The formal answer type (closed coproduct) captures the classification; the constitutive surplus is captured by Phase 3 `integrate` — a sense operation whose non-obvious interpretive contribution may be surfaced through Output Style `Basis:` marker when non-trivial (A2 Visibility).

**Interpretive transparency architecture**: `Basis:` is a discretionary session-level annotation — it fires when AI interpretation transcends mechanical derivation, unlike the former `integrate-echo` which was a mandatory structural relay. The semantic boundary shifts from a deducibility test (augmentation not derivable from {input, context_structure}) to an observability criterion (cite specific evidence grounding the interpretation). This relocation from protocol-owned TOOL GROUNDING to the session-level observation layer follows the Session-level observer exception (Audience Reach) — the same architectural pattern governing nudge.

**Primary circle** (intra-protocol): Each protocol's LOOP section encodes backward flow where partial resolution triggers whole re-interpretation, conditioned by `preserves:` (the text being interpreted remains fixed; only the interpretation evolves).

**Secondary pattern** (inter-protocol hermeneutic spiral revolutions): Five spiral revolutions on distinct epistemic axes — each comprising a forward arc (toward realization) and a backward Wirkungsgeschichte arc (toward updated pre-understanding). The backward arc is uniformly realized via Output Style nudge — the prior protocol's convergence trace becomes Vorverständnis for the paired protocol's next activation. The forward arc topology varies by axis:

| Axis | Pair | Forward arc topology | Forward arc realization |
|---|---|---|---|
| intent | Hermeneia ↔ Katalepsis | implicit (temporal precedence) | session-text composition |
| goal | Telos ↔ Syneidesis | implicit (temporal precedence) | session-text composition |
| context | Aitesis ↔ Epharmoge | implicit (temporal precedence; mutual suppression prevents stacking) | session-text composition |
| structure | Prothesis ↔ Analogia | dyadic graph.json advisory | edge `prothesis → analogia` |
| action — theoria/praxis | Prothesis ↔ Prosoche | triadic graph.json cascade | chain `prothesis → aitesis → prosoche` (frame → inquire → attend, via two advisory edges: "관점 시뮬레이션이 컨텍스트 추론 추천을 제공" and "추론된 컨텍스트가 실행 시 위험 평가 초점을 좁힘") |

**Topological asymmetry of the action axis**: forward arc is triadic (theoria → preparation → praxis, where Aitesis context inference is the preparation step that bridges framework selection and risk-attentive execution); backward arc is dyadic (Prosoche convergence trace's Wirkungsgeschichte emission is read directly by Prothesis Phase 4 LOOP `J=extend` "review execution results", without re-passing through Aitesis). This asymmetry is intentional: praxis-emergent framework patterns are about lens adequacy (Prothesis's domain), not context coverage (Aitesis's domain), so they flow back to theoria directly rather than via the preparation step.

**Multi-axis pairing**: Prothesis appears in two pairs (structure with Analogia, action with Prosoche) because each pair operates on an independent epistemic axis. Aitesis appears both as forward-arc preparation node in the action axis AND as Pre member of the context axis pair — also permitted under axis-independence: in the action axis Aitesis serves as bridge for theoria-to-praxis transition; in the context axis Aitesis itself is the Pre-member whose post-completion is verified by Epharmoge. Multi-axis membership is permitted when the axes are independent.

**Stage 1 conjecture**: hermeneutic spiral revolution framing extends the prior dyadic Pre/Post pair characterization to admit triadic forward arcs (action axis). Stage 2 corroboration accumulates when Prothesis re-activations cite Prosoche convergence trace as perspective-formation evidence and when downstream sessions surface other axes whose forward arc warrants explicit graph.json inscription. Horismos and Periagoge remain Secondary-unpaired by present inscription — separate analysis required; Anamnesis is Tertiary substrate and is exempt from Secondary pairing.

**Artifact-observability boundary** (type naming principle): Protocol input type names encode their temporal relationship to observable artifacts — the dividing line being Read/Grep observability:
- **Aitesis** (Prospect): Pre-artifact. Context sufficiency is assessed before artifacts are produced. X cannot yet be Read/Grep'd.
- **Epharmoge** (Result): Post-artifact. Applicability is evaluated after artifacts exist. R is Read/Grep-observable.
- **Analogia** (Text): Time-independent. Structural mapping validation operates on abstract structures regardless of artifact existence.

This boundary informs type naming: `Prospect` (forward-looking, unrealized), `Result` (completed work product), `Text` (abstract structure carrier). The temporal encoding in type names provides protocol discrimination signal at SKILL.md load time, per A4 Semantic Autonomy.

**Context bifurcation** (intra-protocol context separation): Within a single protocol, context collected for different purposes must not be conflated. In Prothesis: `gather(context)` (Phase 1, meta) collects broad context to identify relevant perspectives; `inquire(parallel)` (Phase 3, object) collects perspective-specific evidence through each lens independently. The semantic separation exists in MORPHISM; TOOL GROUNDING realizes it operationally by specifying different collection targets per phase. Passing meta-context to object-level agents biases their investigation toward the lead agent's framing, undermining the epistemic value of independent perspective analysis.

**Tertiary pattern** (cross-session, Stage 2 operational-fidelity modality — both halves operative): Anamnesis hypomnesis store persists session recall indices → next session's protocol Phase 0/1 detection is enriched by accumulated domain knowledge → better protocol execution produces richer insights → hypomnesis store deepens → spiral deepening. The storage half (Anamnesis hypomnesis write) and the consumption half (each consuming protocol's Phase 0/1 reading stored knowledge) together complete the cross-session pattern. Unlike Primary/Secondary which operate within a single session, Tertiary operates across session boundaries with persistent knowledge as the medium. Consumption-half is operative across all 11 consuming protocols as Cross-session enrichment paragraphs in SKILL.md prose. **Aitesis carries protocol-internal sophistication** — EvidenceSource fiber + `source: "memory:{path}"` tagging + staleness guard scoped to its empirical-evidence operation, grounded in `.claude/rules/axioms.md` A2 Cognitive Partnership Move's Citable axis (Extension/Relay basis = external source). **The other 10 consuming protocols use the simpler heuristic-input pattern** — Phase 0/1 may bias toward accumulated domain patterns, with protocol-specific pollution resistance (halt characteristics, gate judgment) per `.claude/principles/architectural-principles.md` Cross-Session Knowledge Composition Pollution caveat. The asymmetry is intentional: applying Aitesis-style evidence-source machinery uniformly would misclassify Constitution operations (where AI inference is the basis) as Extension. Stage 2 monitors **operational fidelity** (whether enrichment improves Phase 0/1 detection vs. surfaces pollution), not first-time inscription (per `.claude/principles/README.md` Stage 2 Corroboration Watch convention).

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

Relationship to historical 3-axis elidability model (`docs/analysis/protocol-composition-gate-elision.md`, pre-unification): prior analysis used three axes; the post-unification single TOOL GROUNDING axis subsumes the prior model — `(extension)` classifies relay-eligibility, `(constitution)` classifies Constitution requirement, with conditional specialization absorbed as separate `(extension)` entries.

## Split-Entry Naming Convention

When a phase contains a conditional gate (some runtime conditions resolve to Extension while others require Constitution), the gate is split into separate TOOL GROUNDING entries within the same phase. Naming pattern:

- **Extension half**: `Phase N {gate_label}_{condition} (extension)` — descriptive condition suffix indicating when this entry fires (e.g., `_from_arg`, `_auto`, `_resume`, `_unique_match`, `_no_match`).
- **Constitution half**: `Phase N {gate_label} (constitution)` or `Phase N {gate_label}_{purpose} (constitution)` — the canonical gate label, with an optional purpose suffix when ambiguity persists. This entry fires on the default branch (when the Extension condition is not met).

The Extension entry's condition suffix records the predicate inline. Both halves point to the same underlying phase operation; the split is realization, not phase duplication.

Examples observed in current SKILL.md:

- prothesis: `Phase 0 MB_from_arg (extension)` + `Phase 0 Qc (constitution)`
- prothesis: `Phase 3 AgentMap_auto (extension)` + `Phase 3 AgentMap_select (constitution)`
- crystallize: `Phase 0 stage_from_arg (extension)` + `Phase 0 confirm Qc (constitution)`
- crystallize: `Phase 4 Qs_auto (extension)` + `Phase 4 Qs (constitution)`
- misuse: `Phase 0 scope_from_arg (extension)` + `Phase 0 scope_confirm (constitution)`
- telos: `Phase 0 G_from_arg (extension)` + `Phase 0 Qc (constitution)`
- rehydrate: `Phase 0 unique_match (extension)` + `Phase 0 no_match (extension)` + `Phase 0 select_candidate Qc (constitution)`

Non-split (canonical) form remains the default: when no conditional specialization exists, the entry stays as the canonical label (`Phase N Qc (constitution)` or `Phase N {label} (extension)`). Split applies only when one runtime branch is genuinely Extension-eligible.
