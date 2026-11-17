# Structural Specifications

Implementation-level specifications for SKILL.md formal blocks. These are descriptive references for protocol editing, not prescriptive principles.

## Formal Blocks Are Runtime-Normative, Not Contributor Spec

The `Definition` code blocks — FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, LOOP, TOOL GROUNDING, MODE STATE, CONVERGENCE, and their peers — are **LLM-facing and runtime-normative**, and they are **constitutive of protocol identity**: they *type* the prose, fixing what each phase, gate, transition, and resolution means. A runtime model reads them to execute the protocol; they are part of the normative `SKILL.md` contract (per `CLAUDE.md` Runtime Contract: "`SKILL.md` carries the normative user contract"). That the `Definition` blocks are LLM-facing is asserted here and in `CLAUDE.md`, on this project's own authority — it is a fact about this repository's artifacts, so no general principle grounds it.

The contributor-facing *prescriptive* surface is `.claude/rules/` plus `CLAUDE.md` (and exposition under `docs/`) — **never the formal blocks**. The one contributor-facing artifact *about* the formal blocks — their anatomy and editing conventions — is `.claude/skills/verify/references/formal-blocks.md`. Keep the two layers distinct — the anatomy guide is contributor-facing; the blocks it describes are runtime-normative. Do not classify a formal block as "contributor-facing spec" and drop or thin it when producing a reduced or single-shot realization of a protocol: removing a formal block removes the type that constitutes the protocol. The block governs *what* the protocol is; how its symbols are *rendered* to a user is a separate emit-layer concern (see §User-Facing Emit Load Disciplines below, and the Output Style's Vocabulary rendering).

## User-Facing Emit Load Disciplines

Separate rules manage the load a user-facing round places on its reader. Their text lives in each protocol's `## Rules`, and a static check holds that each label is there. What this section adds is why they do not collapse into one another — restating the rules here would answer to no guard and would drift away from the copies that do.

Round composition folds what were three separate rules — placement (context laid out before a gate, not folded inside it), vocabulary (the reader's own words, held across the session), and per-round adjacency (the judgment bundled beside its nearest evidence and the implication bearing on the next move, so the reader is not left to reassemble it) — into one inline rule, because each governs the same act from a different angle: composing a round the reader can act on without reassembling it. Folding them removes the seam where a protocol could satisfy the placement and vocabulary constraints while still scattering adjacent evidence across distant paragraphs or mixing unrelated findings into one decision round; there is no longer a second rule left to close that gap after the fact. The occasion-bound detail behind each angle — when a rendering must hold or wording must be carried through unchanged, what in view belongs to a later round or a trace, where a protocol's own phases put a sentence relative to a gate — moved to each skill's own `references/round-composition.md`, read only when that occasion arises. Form feedback stays a separate rule rather than folding in: it does not shape a round's default composition, it corrects composition in response to an explicit signal about form, and that is a different trigger from anything Round composition governs on its own.

## Gate Runtime Semantics

**Qc/Qs runtime distinction**: The Qc/Qs classification is a definition-time property of the gate — Qs expects constitutive response, Qc expects classificatory response. At runtime with Text+Stop realization, this distinction blurs: Qc gate responses can carry constitutive surplus (new meaning beyond the classification). The formal answer type (closed coproduct) captures the classification; the protocol's response interpretation accounts for any additional meaning. Pure interpretation is a `(sense)` operation, while an integration that writes mode state is `(track)`. The protocol's own TOOL GROUNDING fixes that boundary. A non-obvious interpretive contribution may be surfaced through the Output Style `Basis:` marker under `premise/recognition-and-authority.md` §Detection with Authority.

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

## Type Naming and Artifact Observability

**Artifact-observability boundary** (type naming principle): Protocol input type names encode their temporal relationship to observable artifacts — the dividing line being Read/Grep observability:
- **Aitesis** (Prospect): Pre-artifact. Context sufficiency is assessed before artifacts are produced. X cannot yet be Read/Grep'd.
- **Epharmoge** (Result): Post-artifact. Applicability is evaluated after the result exists. An artifact result is Read/Grep-observable; a result that lives in the conversation is read from the context.
- **Analogia** (Text): Time-independent. Analogical-inference auditing operates on a mapping being relied on, reading any account it can reach as evidence; evidence about an artifact's behavior requires observing that behavior.

This boundary informs type naming: `Prospect` (forward-looking, unrealized), `Result` (completed work product), `Text` (abstract structure carrier). The temporal encoding in type names provides protocol discrimination signal at SKILL.md load time, per Semantic Autonomy (`premise/interaction-factorization.md`).

## Intra-Protocol Context Separation

**Context bifurcation** (intra-protocol context separation): Within a single protocol, context collected for different purposes must not be conflated. Context gathered at the meta level — to decide how the work is split or which perspectives it needs — is not passed as-is to the executors that carry out the object-level work; each executor collects its own object-scope evidence. Passing meta-context to object-level executors biases their investigation toward the lead agent's framing, undermining the epistemic value of independent analysis.

## Cross-Session Tertiary Pattern

**Tertiary pattern** (cross-session, both halves operative): Anamnesis hypomnesis store persists session recall indices → next session's protocol Phase 0/1 detection is enriched by accumulated domain knowledge → better protocol execution produces richer insights → hypomnesis store deepens → spiral deepening. The storage half (Anamnesis hypomnesis write) and the consumption half (each consuming protocol's Phase 0/1 reading stored knowledge) together complete the cross-session pattern. Unlike Primary/Secondary which operate within a single session, Tertiary operates across session boundaries with persistent knowledge as the medium. Two consumption patterns coexist, and the asymmetry between them is intentional. A protocol whose consumption runs through an evidence-source channel can tag what it reads (`source: "memory:{path}"`) and guard it for staleness, under the reachable-and-sufficient-ground test in `premise/recognition-and-authority.md` §Detection with Authority. A protocol whose Phase 0/1 merely biases toward accumulated domain patterns has no such channel and relies on protocol-specific pollution resistance (halt characteristics, gate judgment) per `.claude/principles/architectural-principles.md` Cross-Session Knowledge Composition Pollution caveat. Applying evidence-source machinery uniformly would present operations whose basis is AI inference as relays of determined ground — which is the reason for the split, not an accident of who implemented what. Which protocol sits on which side is read from its own SKILL.md; a roster here would have nothing re-running it. Operational-fidelity monitoring (whether enrichment improves Phase 0/1 detection vs. surfaces pollution) is the ongoing observation focus.

## Extension Classification Audit Trail

When a TOOL GROUNDING entry is classified as `(extension)` because its result is determined, and auto-resolved, the justification should be traceable to the relay indicators the premise layer already defines: the fixed-result, reachable-and-sufficient-ground, within-scope tests and basis presentation in `premise/recognition-and-authority.md` §Detection with Authority, plus the option-set relay test in `premise/interaction-factorization.md` §Interaction Kind Factorization. This is not a new principle but an audit format surfacing those existing indicators. An `(extension)` that instead carries reversible work on the AI's stated judgment is traced by that judgment's basis and its attribution to the AI, not by this format.

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

Relationship to historical 3-axis elidability model (pre-unification): prior analysis used three axes; the post-unification single TOOL GROUNDING axis subsumes the prior model — `(extension)` classifies what proceeds without the user's turn, `(constitution)` classifies Constitution requirement, with conditional specialization absorbed as separate `(extension)` entries.

## Split-Entry Naming Convention

When a phase contains a conditional gate (some runtime conditions resolve to Extension while others require Constitution), the gate is split into separate TOOL GROUNDING entries within the same phase. Naming pattern:

- **Extension half**: `Phase N {gate_label}_{condition} (extension)` — descriptive condition suffix indicating when this entry fires (e.g., `_from_arg`, `_auto`, `_resume`, `_unique_match`, `_no_match`).
- **Constitution half**: `Phase N {gate_label} (constitution)` or `Phase N {gate_label}_{purpose} (constitution)` — the canonical gate label, with an optional purpose suffix when ambiguity persists. This entry fires on the default branch (when the Extension condition is not met).

The Extension entry's condition suffix records the predicate inline. Both halves point to the same underlying phase operation; the split is realization, not phase duplication.

To see the convention in force, grep the TOOL GROUNDING blocks for a condition suffix (`_from_arg`, `_auto`, `_resume`) — a roster of which protocols currently split would go stale the next time one is added or collapsed, and nothing re-runs a roster.

Non-split (canonical) form remains the default: when no conditional specialization exists, the entry stays as the canonical label (`Phase N Qc (constitution)` or `Phase N {label} (extension)`). Split applies only when one runtime branch is genuinely Extension-eligible.
