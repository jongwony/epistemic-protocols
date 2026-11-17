# Formal Block Anatomy

The anatomy of a protocol's `Definition` block and the conventions for editing one. The blocks themselves are runtime-normative contract (`AGENTS.md` §Runtime Contract); this reference describes them for whoever edits a block. [verification.md](verification.md) carries why the `lean-definition` check exists.

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
- `<X> resolution emergent via session context`: dimension interaction (shared codomain discovery, cross-resolution) occurs through Session Text Composition (archived as #1140), not prescribed by the operator
- `*` names the deficits composed in the current session; a pre-declared protocol chain instead specifies a sequence of invocations

New phases must appear in PHASE TRANSITIONS with `[Tool]` suffix AND in TOOL GROUNDING with the capability or internal operation that realizes it (Lean notation: §Lean Notation below). Which parts of this anatomy a static check actually enforces is read from the check itself rather than asserted here — an enforcement-coverage claim on this surface has nothing that re-runs it, so it keeps asserting an earlier reading with present authority.

### Lean Notation

A protocol's Definition block is authored either in the DSL above (a bare fence) or in core Lean 4 (a `lean` fence). The Lean form elaborates: a reference that does not resolve, a proposition stated without proof, or a type that does not check is an error rather than a reading a reviewer has to catch. Its anatomy keeps the DSL's section names and changes what each section is made of.

- **Section markers.** Each section opens a module doc comment carrying the same marker, `/-! ── NAME ──`, closed on that line (` -/`) when the section is code only. Lean requires a declaration before its use, so the order is FLOW, MORPHISM, GROUND, TYPES, any `*-BINDING`, MODE STATE, PHASE TRANSITIONS, LOOP, CONVERGENCE, TOOL GROUNDING, COMPOSITION. A short module doc before FLOW tells the runtime reader how to read the block.
- **Doc-text sections.** FLOW, MORPHISM, `*-BINDING`, LOOP, and COMPOSITION are doc text, and CONVERGENCE opens with its trace obligation as doc text. MORPHISM keeps its source object, its `→` chain ending in the resolution, and its `requires:` / `deficit:` / `preserves:` / `invariant:` lines at line start — the protocol router and the static checks read that line shape. Doc text avoids fence lines and the comment tokens `/-` and `-/`, which would close or nest the comment.
- **GROUND.** The session primitive every Lean block reads, identical across blocks and to the canonical module `lean/EpistemicProtocols/Ground.lean`: a `Turn` carries its origin and content; a `Context` is the list of turns; `fuse` appends one utterance, a turn a person sent; a `Grounding` is an origin that may ground — never the assistant, injected text, or an unknown origin; a `Cite` points at one turn with that origin; a `Coord` names which origins it admits and leaves support to the model; `Occ` is an open coordinate, optionally with a candidate citation, or a filled one with its citation, admission, and support. Admission reads only who sent a turn, because that is the one fact the harness supplies. What the turn does — a statement, a request, an instruction, a report of what was observed — is text the model reads, so it lives in `supports`: a coordinate that admits only the person is filled by any turn of theirs whose content settles it, and a coordinate that must not rest on bare assent says so in its `supports`.
- **Code sections.** TYPES, MODE STATE, PHASE TRANSITIONS, and CONVERGENCE are declarations. MODE STATE is the fused context; a field that is a projection of the context is read from it and not declared beside it. A transition is a constructor of a relation or an arm of a structural recursion over the user's utterances, and a CONVERGENCE claim the contract makes is a guarantee in its Theorems module where it can be proved.
- **Guarantees live beside the block, stated and proved together.** A proof is verification rather than contract, and a statement the model already reads off the definitions tells it nothing new, so the block states no theorem. Each contract's guarantees are named theorems in `lean/EpistemicProtocols/<Namespace>/Theorems.lean`, the repository's Lake package (`lakefile.toml` at the root; contributor-side, never packaged), each declared once with its statement and its proof as Lean practice has it — Lean elaborates a theorem's header before its body, so the statement stands on its own. The module (`module` header) imports only its contract and the shared sections, so under Lean's module system its proofs stay private to it while its theorems are public. Every public theorem there is a guarantee and its statement is about the contract; an argument too long to read inline goes to a `private` helper, which is not a guarantee. The contract module it imports, `Contract.<Namespace>`, is generated from the SKILL.md block by `.claude/skills/verify/scripts/lean-contract.js` into the gitignored `lean/.contract/`, with the block's GROUND section replaced by the canonical `EpistemicProtocols.Ground` and the vocabulary opening its TOOL GROUNDING section by the canonical `EpistemicProtocols.ToolGrounding`; the SKILL.md block stays the one source and nothing generated is edited by hand. Each shared section's own guarantees are stated and proved the same way, in `lean/EpistemicProtocols/Ground/Theorems.lean` and `lean/EpistemicProtocols/ToolGrounding/Theorems.lean`; the text every block copies carries none.
- **Judgments.** The model reading the block is the one party the contract leaves open: it settles, by inference over the context, each element the block does not fix. Such a judgment is declared as an `axiom` with a doc comment saying what is judged — a black box to the contract, so that `#print axioms` names the judgments each theorem rests on — or, in a block that has not taken that form, as an `opaque`. The block does not narrow a judgment with finer types than the contract needs, and it adds no `sorry` and no other `axiom`. An axiom judgment's type is shown inhabited by a `Nonempty` instance in the Theorems module, so no judgment can assume what nothing inhabits, and the witness itself assumes nothing: it may name a judgment that forms a type or a predicate, never use a judgment's value. Only core Lean is used (no Std, no Mathlib). An addition made only because elaboration requires it — an `Inhabited` witness for an `opaque`, a `deriving` clause — must add no meaning and is marked with an `-- elab:` comment.
- **TOOL GROUNDING.** The section opens with the vocabulary every Lean block carries verbatim, identical to the canonical module `lean/EpistemicProtocols/ToolGrounding.lean`: `Interaction` is the two interaction kinds, `Interaction.realization` maps each to its `Continuation` — every interaction presents its text, and a Constitution then stops for the person's turn while an Extension proceeds — and `Annot` is the annotation vocabulary below, an interaction carrying its kind. The protocol's own part follows: `Op` has one constructor per operation, and `grounding : Op → Annot × String` one arm per entry, `| .op => (.annotation, "Tool: description")`, an interaction written `.interaction .constitution` or `.interaction .extension` with a description that leaves the realization to its kind. A `dispatch` operation is also named by the declaration that decides when it hands off — an outcome, a spec, a tier — so the hand-off is part of the contract rather than only listed beside it. An operation new to PHASE TRANSITIONS is a constructor of `Op` with its arm.

Elaboration runs in two places, with the toolchain pinned by the repository's `lean-toolchain`. The block is elaborated standalone, as a runtime reader loads it. The package runs through one driver, `node .claude/skills/verify/scripts/lean-contract.js check .`: it generates the contract modules, builds with `lake build --wfail`, and runs the checked-in audit (`lean/Audit/`) as `lake lint`, which reads the elaborated environment rather than the text; `lake test` runs the audit against the fixtures under `lean/Tests/`. What stays text — extracting the block, the shared sections against their canonical files, and a token preflight before any build — is the static check's. Which rules the audit and the static check apply is read from `lean/Audit/Check.lean` and `.claude/skills/verify/scripts/lean-bridge.js`, not restated here. The static check runs the whole sequence locally when `lean` and `lake` are reachable and in CI (`.github/workflows/lean.yml`).

### TOOL GROUNDING Annotation Vocabulary

Every TOOL GROUNDING line carries a parenthetical annotation classifying the operation type. Annotations are exhaustive — every entry must have one.

**Cognitive Partnership Move** names an interaction classified as Constitution or Extension. `premise/recognition-and-authority.md` §Operational refinement: the Extension/Constitution move supplies the conceptual distinction; the annotations below describe its realization in formal blocks. Each packaged contract defines its own required presentation and response.

**Interaction annotations** (user-facing):

| Annotation | Meaning | Realization |
|------------|---------|-------------|
| `(constitution)` | User-facing interaction where a constitutive user judgment is required | Present the text, then stop for the user's turn |
| `(extension)` | Presentation that settles no judgment for the user, as the TOOL GROUNDING vocabulary in `lean/EpistemicProtocols/ToolGrounding.lean` defines it | Present the text, then proceed |

`(constitution)` / `(extension)` are the sole TOOL GROUNDING interaction annotations. `Qc` and `Qs` name gate shapes; they do not replace the annotation class. In a Lean block they are `.interaction .constitution` and `.interaction .extension`, and the realization column is `Interaction.realization` in the shared vocabulary; a DSL block states it in a `-- Realization:` header line.

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

## Resolution Meta-Contract

**Resolution type and solution sentence.** The resolution type is the codomain: the Lean type occupying the right-hand position of a protocol's Type line. It records the result a run yields without fixing what that result means — two resolutions can share a carrier and an admission while the person recognizes different things at each. That meaning is stated by the solution sentence, the first statement of the protocol's epistemic solution as `/rederive` derives it (`.claude/skills/rederive/SKILL.md`, the `derive` operation): one sentence of what the person can then say or recognize, whether or not completion takes a closing turn of theirs. In the contract the sentence opens the doc comment of the resolution type (where a judgment supports the resolution, that judgment's doc comment states how it is established), with no Lean structure added for it; a discovery surface — plugin description, README, route — carries the sentence itself rather than the term.

Canonical protocol resolution names remain protocol-native: `MappingAssessment`, `DefinedBoundary`, `CrystallizedAbstraction`, `ResolvedEndpoint`, and peer names are not renamed to a generic terminal type. `DeficitResolved<D, R>` is a meta-contract that those canonical resolution types should satisfy when their formal surface is edited:

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
