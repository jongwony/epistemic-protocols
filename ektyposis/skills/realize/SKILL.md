---
name: realize
description: "Realize a portable epistemic essence into a specific target substrate's native artifact form, preserving the essence's functional role across the substrate boundary and declaring where the realization degrades. Projects structure rather than substituting a template; records each unavailable substrate primitive as a declared degradation rather than a silent approximation. Type: (ProjectionUnformed, AI, REALIZE, PortableEssence × TargetReference) → RealizedArtifact. Alias: Ektyposis(ἐκτύπωσις)."
---

# Ektyposis Protocol

Realize a portable epistemic essence into a target substrate's native artifact through structure-preserving projection, preserving the essence's functional role across the substrate boundary and declaring where the realization locally degrades. Type: `(ProjectionUnformed, AI, REALIZE, PortableEssence × TargetReference) → RealizedArtifact`.

## Definition

**Ektyposis** (ἐκτύπωσις: a modelling in relief, an impression — from ἐκτυπόω "to form in relief, to mould", and τύπος "impression, stamp, mould, type"): A dialogical act of realizing a portable epistemic essence — the substrate-agnostic functional role of a capability, the kind of object `/distill` produces — into one specific target substrate's native artifact form. The protocol's lexical verb is `/realize`. The act binds the portable essence and the target substrate reference, grounds the substrate's native artifact form and its primitive inventory, derives the artifact structure the substrate requires, projects each structural element of the essence into that structure (preserving the structural relation rather than substituting a generic template), validates the projection against the substrate's available primitives, declares every unavailable primitive as a recorded degradation rather than silently approximating it, and emits a terminal substrate-native artifact carrying a structure-preservation trace and a degradation ledger.

The essence preserved is **functional and structural, not Platonic**: what carries across realizations is the essence's *role* — what it does, the structure of how it does it — not a metaphysically real inner nature. This is **role functionalism** in the sense of multiple realizability (Putnam 1967; Fodor 1974, "Special Sciences"): one higher-level functional kind is realized by many heterogeneous lower-level substrates, and the higher-level type is preserved across realizers. Ektyposis adopts role functionalism (the higher-level type is the functional role, preserved cross-substrate), not realizer functionalism. This is the same stance the project already takes under **Semantic Autonomy** — a protocol's epistemic meaning depends only on what any language model can do (generate text, yield a turn), not on platform features — and under **Outcome Equivalence**: the same essence, realized on any substrate that preserves the gate semantics, yields the same epistemic outcome. Multiple realizability *is* Outcome Equivalence read from the philosophy-of-mind side.

Secondary grounding, partial: Aristotle's hylomorphism (form actualized in matter; the move from dunamis to energeia/entelecheia) frames realization as a potential made actual in a substrate, and Husserl's constitution of an object through intentional fulfilment frames the projection as constituting the artifact — but neither supplies the cross-substrate *identity* that role functionalism gives, so they ground the "forming in a substrate" without grounding the "same essence across substrates". Heidegger's Verwirklichung, Peircean semiotics, Goodman's exemplification, and truthmaking are weaker fits and are not load-bearing here; enactivism actively resists pre-given invariant essences and so stands as a critique of the cross-substrate-identity claim rather than an anchor for it. The etymological line from τύπος ("impression, stamp, type") to the project's formal TYPES blocks is a rhetorical resonance, not a claim of an ancient type-theory lineage.

```
── FLOW ──
Ektyposis(essence, target) → Detect(P) → projection_unformed? →
  ¬unformed: → deactivate (already a terminal artifact, or no substrate projection is needed)
  can_consume_portable_handoff_directly(target): → relay to /distill (a dereferencing, capability-compatible consumer reads the portable essence directly — no per-substrate projection)
  unformed ∧ ¬can_consume_directly:  pass_n=1, loop:
    F0 bind_essence(P) → (essence, target)                                     -- fix the functional role + the substrate
    F1 ground_target_reference(target) → (capabilities, primitive_inventory)   -- acquire the substrate's native artifact form + per-primitive availability [Tool: Read, WebFetch, WebSearch]
       derive_target_schema(TargetReference) → TargetSchema                    -- the structure the substrate's native artifact requires
    F2 project_structure_preserving(essence, TargetSchema) → Projection        -- each EssenceElement → TargetElement (structure preserved, not templated)
    F3 validate_realization(Projection, primitive_inventory) → RealizationVerdict
       declare_unavailable_primitives(validation) → DegradationLedger          -- FAIL (identity / convergence touched) | DEGRADE (evidence-richness / state-tracking only)
       Gate Q(Projection, DegradationLedger) → Stop → A                        -- Constitution when degradation is declared or a projection choice is open; relay (Extension) when Faithful
         Adjust(e): re-project element e → loop (F2)
         Redirect:  Failed realization or wrong target → re-bind (F0) | deactivate
         Accept:    → F4
    F4 emit_realized_artifact(Projection, DegradationLedger) → RealizedArtifact → converge  -- TERMINAL artifact; never re-distilled

── MORPHISM ──
PortableEssence × TargetReference
  → bind_essence(P)                                       -- F0 fix the portable essence (its functional role) and the target reference as the realization inputs
  → ground_target_reference(target)                       -- F1 acquire the substrate's native artifact form, capabilities, and primitive inventory (canonical-external, staleness-guarded)
  → derive_target_schema(TargetReference)                 -- F1 derive the structure the substrate's native artifact requires
  → project_structure_preserving(essence, TargetSchema)   -- F2 map each EssenceElement to a TargetElement, preserving structure rather than substituting a template
  → validate_realization(Projection, primitive_inventory) -- F3 per-element check against available primitives; classify each unavailable-primitive touch FAIL | DEGRADE
  → declare_unavailable_primitives(validation)            -- F3 emit the DegradationLedger: the explicit record of where Outcome Equivalence fails locally for this substrate
  → emit_realized_artifact(Projection, DegradationLedger) -- F4 emit the TERMINAL RealizedArtifact with its structure trace and degradation ledger
  → RealizedArtifact
requires: projection_unformed(P)         -- runtime checkpoint (Phase 0)
deficit:  ProjectionUnformed             -- activation precondition (Layer 1/2)
preserves: EssenceIdentity               -- the essence's functional role (role-functionalist), preserved across the realization; the source essence is read-only
invariant: Structure-Preserving Projection over Template Substitution ∧ Declared Degradation over Silent Approximation

── TYPES ──
P              = RealizationProspect { essence: PortableEssence, target: TargetReference }
PortableEssence = the reference-tolerant portable form a dereferencing consumer could execute from directly (the kind of object /distill emits). Substrate-agnostic: it carries the essence's functional role, not a substrate rendering. ProtocolEssenceIR is its subtype when the source is a protocol SKILL.md
ProtocolEssenceIR = PortableEssence specialized to a protocol SKILL.md — the output of running /distill on a canonical SKILL.md (the /distill → /realize composition):
                 { source: {path, commit_or_hash}, name, slash_command, deficit, resolution, requires, preserves,
                   invariants: List(String), morphism_steps: List(Step) (ordered), gate_points: List(GatePoint),
                   answer_constructors: List(String), convergence: {condition, evidence_requirement},
                   tool_grounding_ops: List(Op) }
                 where each Op is tagged one of {sense, observe, constitution, extension, track, transform}
TargetReference = { substrate_id, native_artifact_form, capabilities: CapabilitySet, primitive_inventory: Map(Primitive, PrimitiveAvailability) }  -- the substrate to realize into; primitive_inventory is built at F1 grounding
CapabilitySet  = the substrate's model/target capability set — what kinds of artifact it runs and what it can read or condition over (distinct from primitive_inventory, which is per-Primitive availability)
Primitive      ∈ {codebase-read (Read/Grep/Glob), shell (Bash), file-write (Write/Edit), subagent (Task), transcript-store, structured-mode-state, web-fetch} ∪ Emergent(Primitive)  -- a capability the essence's morphism steps depend on
PrimitiveAvailability = Available | Unavailable(why: String)
TargetSchema   = the structure the substrate's native artifact requires (its slot / section shape)  -- F1 derived from TargetReference
EssenceElement ∈ {MorphismStep, GatePoint, AnswerConstructor, ConvergenceCondition, ToolGroundingOp, Invariant}  -- the structural units of the essence drawn from the ProtocolEssenceIR fields; the projection domain
TargetElement  = the substrate-native rendering of one EssenceElement (a section of the artifact body)
Projection     = Map(EssenceElement, TargetElement)  -- F2 structure-preserving map: each essence element rendered into the target's native form, preserving the structural relation rather than substituting a generic template
Severity       ∈ {FAIL, DEGRADE}  -- FAIL: the unavailable primitive touches protocol identity or a convergence condition; DEGRADE: it only reduces evidence-richness or state-tracking
DegradationEntry = { primitive: Primitive, why_unavailable: String, declared_degradation: String, severity: Severity }  -- one record of where Outcome Equivalence fails locally for this substrate
DegradationLedger = List(DegradationEntry)  -- declare_unavailable_primitives output; the explicit record that replaces silent approximation. UnavailableInDia is its Dia specialization
RealizationVerdict ∈ {Faithful, Degraded(DegradationLedger), Failed(DegradationLedger)}  -- F3 validate_realization output: Faithful = no unavailable primitive touched; Degraded = only DEGRADE entries; Failed = ≥1 FAIL entry
unrealizable(e) ≡ ∃ d ∈ Λ.degradation_ledger : d declares e ∧ d.severity = FAIL  -- an EssenceElement whose required primitive is Unavailable and FAIL-classified: it cannot be carried into a TargetElement, so the realization is Failed and surfaces for Redirect
A              = User answer ∈ {Accept, Adjust(EssenceElement), Redirect(reason)}  -- Phase 3 Gate coproduct
RealizedArtifact = { substrate_id, artifact_body, structure_trace: Projection, degradation_ledger: DegradationLedger }  -- the RESOLUTION type; a TERMINAL substrate artifact, NOT a re-distillable PortableEssence (anti-circularity)
PromptArtifact  = RealizedArtifact subtype for the prompt family (the forge realization); InitialPrompt and DiaRecipeInstruction sit under it  -- a substrate-specific subtype, NOT the core type
InitialPrompt   = PromptArtifact for a follow-up session or tool (forge's endpoint form)
DiaRecipeInstruction = PromptArtifact for the Dia substrate (a Chromium AI browser whose custom skill is a conditioning instruction over the current page/selection/tab context, not a chat message): { name, description, body }
                 -- name → the Dia slash command without a leading "/"; description → the routing line; body → the conditioning instruction that: applies the protocol to the current Dia context (page/selection/tabs/web/chat); uses only Dia-visible evidence; declares the UnavailableInDia ledger; maintains a visible "protocol ledger" inline in the response (Dia has no structured MODE STATE); handles each Constitution gate as context-first → concise question + numbered options → stop and wait; continues from the visible ledger on follow-ups; emits the deficit → resolution trace at convergence
UnavailableInDia = DegradationLedger specialized to the Dia substrate: entries { primitive, why_unavailable_in_dia, declared_degradation }  -- expected entries: codebase-read, shell, file-write, subagent, transcript/session stores (each Unavailable in Dia)
can_consume_portable_handoff_directly(target) ≡ source_dereferencing(target) ∧ capability_compatible(target, essence)  -- the relay-to-distill predicate (Mode Activation Skip)
source_dereferencing(target) ≡ the target can read the canonical source/repo the PortableEssence references (it dereferences pointers rather than needing them inlined)
capability_compatible(target, essence) ≡ the target's primitive_inventory covers the essence's required primitives without degradation
Phase          ∈ {0, 1, 2, 3, 4}

── PHASE TRANSITIONS ──
Phase 0: essence, target → Detect(P) → projection_unformed?                               -- projection checkpoint (silent)
       then can_consume_portable_handoff_directly(target)? → relay /distill (skip) | bind_essence(P) → (essence, target)
Phase 1: (essence, target) → F1 ground_target_reference(target) → (capabilities, primitive_inventory)   [Tool: Read, WebFetch, WebSearch]
       then derive_target_schema(TargetReference) → TargetSchema
Phase 2: (essence, TargetSchema) → F2 project_structure_preserving(essence, TargetSchema) → Projection   -- each EssenceElement → TargetElement
Phase 3: (Projection, primitive_inventory) → F3 validate_realization → RealizationVerdict
       → declare_unavailable_primitives → DegradationLedger
       → Q(Projection, DegradationLedger) → Stop → A                                       [Tool: Constitution interaction]
Phase 4: A = Accept → F4 emit_realized_artifact(Projection, DegradationLedger) → RealizedArtifact

Phase 0 → Phase 1:   projection_unformed(P) = true ∧ ¬can_consume_portable_handoff_directly(target) ∧ essence + target bound
Phase 0 → relay:     can_consume_portable_handoff_directly(target) = true                 -- dereferencing, capability-compatible consumer → /distill, not /realize
Phase 0 → deactivate: projection_unformed(P) = false                                      -- already a terminal artifact, or no substrate projection is needed
Phase 1 → Phase 2:   TargetSchema derived ∧ primitive_inventory built
Phase 2 → Phase 3:   every EssenceElement projected to a TargetElement or unrealizable(e) (a declared FAIL the projection could not carry)
Phase 3 → Phase 2:   A = Adjust(e) → re-project element e                                 -- structure choice revised
Phase 3 → Phase 4:   A = Accept                                                           -- realization (with any declared degradation) accepted
Phase 3 → Phase 0:   A = Redirect → re-bind essence/target                                -- Failed realization or wrong target
Phase 3 → deactivate (ungraceful): Esc                                                    -- realization abandoned, no artifact emitted
Phase 4 → converge:  RealizedArtifact emitted with structure trace + DegradationLedger    -- terminal substrate artifact; realize codomain ∩ distill domain = ∅

── LOOP ──
J = {next_pass, converge, esc}
  next_pass:  A = Adjust(e) → re-project element e (Phase 3 → Phase 2, pass_n += 1); A = Redirect → re-bind (Phase 3 → Phase 0)
  converge:   A = Accept ∧ artifact emitted with structure trace + DegradationLedger → RealizedArtifact
  esc:        Esc → ungraceful deactivate (no artifact emitted)

One forward pass + bounded re-projection: the morphism runs once forward (F0 → F4); an Adjust re-projects a named element, a Redirect re-binds the essence or the target. Convergence is the accepted, emitted artifact — not a felt sense that the projection "looks faithful".
Anti-circularity: a RealizedArtifact is a TERMINAL substrate artifact, not a re-distillable PortableEssence. Only /distill → /realize composes (one direction); a realize output is never re-realized nor re-distilled — re-derive from the canonical source instead. realize codomain ∩ distill domain = ∅.
Degradation hard line: validate_realization classifies every unavailable-primitive touch. A FAIL (the unavailable primitive touches protocol identity or a convergence condition) makes the realization Failed — it cannot emit a faithful artifact and surfaces for user Redirect. A DEGRADE (the primitive only reduces evidence-richness or state-tracking) is recorded in the DegradationLedger and the artifact emits with the declared gap. Silent approximation of an unavailable primitive is forbidden: every gap is declared.
Convergence evidence: At convergence, present the structure-preservation trace (each EssenceElement → TargetElement) and the DegradationLedger (each declared FAIL/DEGRADE with its basis). Convergence is demonstrated, not asserted.

── CONVERGENCE ──
converge iff realization_accepted(Λ) ∧ artifact_emitted(Λ) ∧ declared_degradation(Λ) ∧ structure_preserved(Λ) ∧ ¬user_esc
  realization_accepted(Λ): A = Accept at the Phase 3 Gate — a Faithful realization, or a Degraded realization the user accepted; a Failed realization (a declared FAIL) is accepted only when the user constitutes the FAIL gap as a known limitation rather than Redirecting
  artifact_emitted(Λ):     RealizedArtifact emitted with its structure-preservation trace and DegradationLedger
  declared_degradation(Λ): ∀ unavailable primitive touched : a DegradationEntry exists (FAIL | DEGRADE) — no silent approximation
  structure_preserved(Λ):  ∀ EssenceElement : a TargetElement carries it, or a DegradationEntry declares why it could not be carried
  user_esc:                user exits via Esc at the Phase 3 Gate (ungraceful, no RealizedArtifact emitted)
progress(Λ) = |dom(Λ.projection)| / |EssenceElements|   -- structural coverage of the projection

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Detect            (sense)        → Internal analysis (silent — projection-unformed heuristic scan; no user output)
Phase 0 relay_check       (observe)      → Read, Grep (determine whether the target can dereference the canonical source and is capability-compatible — the relay-to-distill predicate)
Phase 0 bind_essence      (observe)      → Read (read the PortableEssence / the /distill output / the canonical source; the source is read-only)
Phase 1 ground_target_reference (observe) → Read, WebFetch, WebSearch (acquire the substrate's native artifact form, capabilities, and primitive inventory via canonical-external retrieval, staleness-guarded)
Phase 1 derive_target_schema (sense)     → Internal analysis (derive the artifact's required structure from the target reference)
Phase 2 project_structure_preserving (transform) → Internal analysis, Write (render each EssenceElement into a TargetElement; draft the artifact body — drafting only, not substrate ingestion)
Phase 3 validate_realization (sense)     → Internal analysis (per-element check against the primitive inventory; classify each unavailable-primitive touch FAIL | DEGRADE)
Phase 3 declare_unavailable_primitives (track) → Internal state update (Λ.degradation_ledger, Λ.verdict; append each projected (EssenceElement, TargetElement, Severity?) to Λ.history — Severity for declared-degradation elements, None otherwise)
Phase 3 Q                 (constitution) → present (mandatory when degradation is declared or a projection choice is open: structure trace + DegradationLedger + draft artifact, then Accept | Adjust | Redirect; a Faithful zero-degradation realization proceeds as relay; Esc → loop termination at LOOP level, not an Answer)
Phase 4 emit_realized_artifact (track)   → Internal state update (Λ.artifact)
converge                  (extension)    → TextPresent+Proceed (structure-preservation trace + DegradationLedger + the RealizedArtifact body; proceed — the Phase 3 Gate constituted acceptance, so the emit is a deterministic relay of that judgment). Where the substrate admits file emission the artifact may also realize as Write (a deterministic write of the accepted artifact); a substrate with no file/CLI import (Dia) emits the artifact as paste-ready text only

── MODE STATE ──
Λ = { phase: Phase, P: RealizationProspect,
      essence: PortableEssence,                                  -- F0 bound; read-only (EssenceIdentity preserved)
      target: TargetReference,                                   -- F0 bound substrate
      capabilities: CapabilitySet,                               -- F1 acquired
      primitive_inventory: Map(Primitive, PrimitiveAvailability), -- F1 per-primitive availability
      target_schema: Option(TargetSchema),                       -- F1 derived artifact structure
      projection: Map(EssenceElement, TargetElement),            -- F2 structure-preserving map
      verdict: Option(RealizationVerdict),                       -- F3 Faithful | Degraded | Failed
      degradation_ledger: DegradationLedger,                     -- F3 declared FAIL/DEGRADE entries; silent approximation forbidden
      gated: Set(EssenceElement),                                -- elements surfaced at the Gate for user judgment (open projection choices ∪ FAIL touches); empty at convergence
      artifact: Option(RealizedArtifact),                        -- F4 emitted terminal artifact
      pass_n: Nat,                                               -- bounded re-projection pass counter
      history: List<(EssenceElement, TargetElement, Option(Severity))>,
      active: Bool, cause_tag: String }
-- Constraint: dom(projection) ∪ {e : ∃ d ∈ degradation_ledger declaring e} = EssenceElements  -- every essence element is carried by a target element or has a declared degradation (no silent drop)
-- Constraint: artifact ≠ Null ⇒ artifact is TERMINAL — a RealizedArtifact is never an element of distill's domain (realize codomain ∩ distill domain = ∅)
-- Constraint: essence read-only across the protocol — projection and degradation annotate; they never mutate the source essence
-- Constraint: gated empties at convergence — every gated element resolves to Accept (carried), Adjust (re-projected), or Redirect (re-bound)

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
/distill → /realize composes (one direction): /distill yields the reference-tolerant PortableEssence (the hub) for a dereferencing consumer; /realize is the per-substrate spoke projecting that one essence into a non-reading or capability-degraded substrate's native artifact. /realize → /distill does not compose — a RealizedArtifact is terminal: re-derive from the canonical source, never re-distill a realized artifact (realize codomain ∩ distill domain = ∅).
forge (the prompt-family realization) identifies its projection step with /realize's project_structure_preserving: each forge adapter's project (ResolvedIntentIR × GuideSnapshot → VendorPromptDraft → InitialPrompt) is a structure-preserving realization of this morphism for that vendor/substrate, and forge's InitialPrompt endpoint is the PromptArtifact subtype of RealizedArtifact.
```

## Core Principle

**Structure-Preserving Projection over Template Substitution** (with **Declared Degradation over Silent Approximation**): A portable epistemic essence is the functional role of a capability made substrate-agnostic — the kind of object `/distill` produces for a recipient that can dereference its pointers. But some substrates cannot dereference (they read no canonical source) or lack the primitives the essence's steps depend on (no codebase read, no shell, no file write, no subagent, no structured state). For such a substrate the essence cannot be handed over directly; it must be *realized* — projected into the substrate's own native artifact form. Ektyposis performs that projection by preserving structure: each structural element of the essence (each morphism step, gate, answer constructor, convergence condition, tool-grounding operation, invariant) is rendered into a corresponding element of the target artifact, so the realized artifact reproduces the essence's *role*, not a generic template that merely name-drops it. Where the substrate is missing a primitive the essence needs, the gap is **declared** — recorded as a degradation entry naming the primitive, why it is unavailable, and what is lost — rather than silently approximated. The declaration is the explicit record of exactly where **Outcome Equivalence** fails locally for this substrate: the cells where this realization cannot reproduce the outcome a fully-capable substrate would. A realization is faithful when its structure is preserved and its every gap is on the record; it fails when an unavailable primitive touches the essence's identity or a convergence condition and that failure is surfaced for the user's judgment rather than papered over.

## Mode Activation

### Activation

AI detects an unformed projection — a portable essence that needs to become a specific substrate's artifact and has no such artifact yet — OR the user calls `/realize`. As a **Hybrid** initiator, an AI-detected activation requires user confirmation before the protocol proceeds; a user invocation activates directly. Detection is silent (Phase 0); the realization-acceptance judgment, when degradation is declared or a projection choice is open, requires user interaction via Cognitive Partnership Move (Constitution) (Phase 3).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/realize` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided, confirm-gated)**: An unformed projection detected — a portable essence (typically a `/distill` output, or a canonical source already distilled) is about to be carried into a substrate that cannot consume it directly (a non-reading or capability-degraded substrate such as the Dia browser). Detection is silent (Phase 0); because Ektyposis is Hybrid, the AI-detected trigger surfaces a one-line confirmation before activating.

**Projection unformed** = a portable essence has no realized artifact in the intended target substrate, and that substrate cannot consume the portable form directly.

Gate predicate:
```
projection_unformed(P) ≡ ¬can_consume_portable_handoff_directly(P.target) ∧ ¬exists_realized_artifact(P.essence, P.target)
```

**Boundary (distill ↔ realize)**: `/distill` yields the reference-tolerant **PortableEssence** — the hub — for a recipient that can dereference its pointers (read the canonical source/repo) and is capability-compatible with the portable form. `/realize` is the per-substrate **spoke**: it projects that one essence into a substrate that *cannot* read the source or lacks the portable form's primitives. The discriminating axis is `can_consume_portable_handoff_directly(target) ≡ source_dereferencing(target) ∧ capability_compatible(target, essence)`: when it holds, the consumer reads the distilled handoff directly, so `/realize` **skips and relays to `/distill`** (a Claude session that can read the repo uses `/distill`, not `/realize`); when it fails — a non-dereferencing or capability-degraded substrate — `/realize` activates and projects. This is the complement of distill's contextualize-skip. The composition is one-directional: `/distill → /realize` (distill the source to a portable essence, then realize that essence into a substrate); `/realize → /distill` does not occur, because a realized artifact is a **terminal** substrate artifact — re-derive from the canonical source, never re-distill a realized output.

### Priority

<system-reminder>
When Ektyposis is active:

**Supersedes**: Direct substrate-authoring patterns that hand-write a target artifact without a grounded essence, or that template the essence into the substrate without preserving its structure

(An essence is projected structure-preservingly into the substrate's native form, with every unavailable-primitive gap declared, before the artifact is emitted)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 3, when degradation is declared or a projection choice is open, present the structure trace, the DegradationLedger, and the draft artifact for user judgment via Cognitive Partnership Move (Constitution).
</system-reminder>

- Ektyposis completes before the realized artifact is treated as final
- Loaded instructions resume after the RealizedArtifact is emitted or Esc

### Trigger Signals

Heuristic signals for an unformed projection (not hard gates):

| Signal | Inference |
|--------|-----------|
| Substrate cannot read the source | The intended consumer has no access to the canonical repo/source the portable essence points at — the handoff would dangle |
| Missing-primitive substrate | The target lacks a primitive the essence's steps depend on (no codebase read, no shell, no file write, no subagent, no structured state) |
| "Make a `<substrate>` skill/recipe of this" | An explicit request to render an essence into a named substrate's artifact form (a Dia skill, a vendor prompt, a tool recipe) |
| Portable essence in hand, wrong audience | A `/distill` output exists but its recipient is a non-reading substrate, so the portable form will not transfer as-is |

**Skip**:
- The target can dereference the canonical source and is capability-compatible with the portable form → the consumer reads the distilled handoff directly → route to `/distill`, not `/realize` (the distill ↔ realize boundary)
- A realized artifact already exists for this essence and substrate
- The input is itself a realized (terminal) artifact — do not re-realize it; re-derive from the canonical source if a refresh is needed
- Phase 0 detection finds no unformed projection

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Realization accepted and emitted | Emit the RealizedArtifact with its structure-preservation trace and DegradationLedger |
| User Redirect at the Phase 3 Gate | Re-bind a different essence/target, or deactivate — no artifact emitted on this binding |
| User Esc at the Phase 3 Gate | Return to normal operation; realization abandoned, no artifact emitted |
| Phase 0 detection finds no unformed projection | Deactivate — silently when AI-detected (Layer 2); with a one-line "already realized / use /distill" acknowledgment when explicitly invoked via `/realize` (Layer 1) |

## Protocol

### Phase 0: Projection Detection + Essence Binding

Verify there is an unformed projection, run the relay-to-distill check, then bind the essence and the target. Detection is **silent**; binding is the first user-visible step (Hybrid: an AI-detected trigger surfaces a one-line confirmation first).

1. **Detect the unformed projection** — establish that a portable essence needs a substrate artifact that does not yet exist. The scan is silent. If none is present, deactivate — silently when AI-initiated (Layer 2), or with a one-line acknowledgment when the user invoked `/realize` (Layer 1).
2. **Run the relay-to-distill check** — evaluate `can_consume_portable_handoff_directly(target)`: does the target dereference the canonical source AND cover the portable form's required primitives? If yes, **relay to `/distill`** and do not activate `/realize` — the consumer reads the distilled handoff directly. Only a non-dereferencing or capability-degraded substrate proceeds.
3. **Bind the essence** — fix the PortableEssence (its functional role). When the source is a protocol SKILL.md, the essence is a `ProtocolEssenceIR` — the `/distill` output over that SKILL.md, carrying name, slash command, deficit, resolution, requires/preserves, invariants, ordered morphism steps, gate points, answer constructors, convergence condition with its evidence requirement, and tool-grounding operations (each tagged sense/observe/constitution/extension/track/transform). The essence is read-only for the rest of the protocol.
4. **Bind the target** — fix the `TargetReference`: the substrate, its native artifact form, and the inputs the next phase will turn into a primitive inventory.

**Scope restriction**: Read-only investigation. Does NOT modify files or ingest into the substrate.

### Phase 1: Target Grounding + Schema Derivation

**F1 — Ground the target reference**: Acquire the substrate's native artifact form, its capabilities, and its **primitive inventory** — for each primitive the essence's steps depend on (codebase read, shell, file write, subagent, transcript/session store, structured mode state, web fetch), record `Available` or `Unavailable(why)`. Grounding is canonical-external and staleness-guarded: prefer the substrate's own current specification of its artifact form over recalled assumptions, and mark the grounding stale if its currency cannot be verified.

**Derive the target schema**: From the grounded reference, derive the `TargetSchema` — the structure the substrate's native artifact requires (its slots/sections). This is the shape the projection must fill.

**Scope restriction**: Read-only investigation (Read, WebFetch, WebSearch). Grounding and schema derivation do not mutate the substrate.

### Phase 2: Structure-Preserving Projection

**F2 — Project structure-preservingly**: Map each `EssenceElement` — each morphism step, gate point, answer constructor, convergence condition, tool-grounding operation, and invariant of the essence — into a corresponding `TargetElement` of the substrate's artifact, in the target schema's structure. The projection preserves the structural *relation*: a gate becomes the substrate's way of presenting options and yielding a turn; a morphism step becomes the substrate's way of performing that step; a convergence condition becomes the substrate's way of demonstrating completion. The standard is structure preservation, **not template substitution** — the realized artifact reproduces how the essence works, not a generic shell that merely names it. Draft the artifact body as the elements are projected.

### Phase 3: Realization Validation + Degradation Declaration

**F3 — Validate the realization**: For each projected element, check the primitives it depends on against the grounded `primitive_inventory`. For every primitive that is `Unavailable`, classify the touch:
- **FAIL** — the unavailable primitive touches **protocol identity or a convergence condition** (without it the realized artifact would not be the same protocol, or could not demonstrate convergence). A FAIL makes the realization `Failed`.
- **DEGRADE** — the unavailable primitive only **reduces evidence-richness or state-tracking** (the protocol still runs and converges, with thinner evidence or a less structured state record). A DEGRADE is recorded and the realization stays emittable.

**Declare the unavailable primitives**: Build the `DegradationLedger` — one entry per unavailable primitive touched, naming the primitive, why it is unavailable on this substrate, the declared degradation (what is lost), and the severity. This ledger is the explicit record of where Outcome Equivalence fails locally for this substrate; silent approximation of an unavailable primitive is forbidden.

**Gate (Constitution)** — When the realization carries any declared degradation (DEGRADE or FAIL) or an open projection choice, present it for the user's judgment via Cognitive Partnership Move (Constitution). A `Faithful` realization with no declared degradation and no open choice proceeds as **relay** (Extension) — the option set collapses to "emit", so gating it would be over-gating.

**Pre-gate text output** (Context-Question Separation): Present as text output before the gate:
- The **structure-preservation trace** — each `EssenceElement → TargetElement`, so the user sees how the essence's structure was carried into the substrate.
- The **DegradationLedger** — each declared entry with its primitive, why-unavailable, declared degradation, and severity (FAIL/DEGRADE).
- The **draft artifact** — the realized artifact body as projected.

Then present:

```
This realization carries declared degradation. How should it be handled?

Options:
1. **Accept** — emit this realized artifact as-is, with its declared degradation on the record.
2. **Adjust** — re-project a named element: [which structural element to render differently]
3. **Redirect** — this realization Failed (an unavailable primitive touches identity/convergence) or the target is wrong: re-bind a different essence or substrate, or stop.
```

A `Failed` realization (a declared FAIL) biases strongly toward **Redirect**; Accept is reachable only when the user constitutes the FAIL gap as a known limitation rather than redirecting. The gate option set is presented intact; specializing the Adjust option to a concrete element is type-preserving materialization, not mutation.

### Phase 4: Artifact Emit

**F4 — Emit the realized artifact**: On Accept, emit the `RealizedArtifact` — the substrate-native `artifact_body` plus its `structure_trace` (the projection) and its `degradation_ledger`. The artifact is **terminal**: it is the substrate's own form, not a re-distillable portable essence; do not re-realize or re-distill it (re-derive from the canonical source if a refresh is needed). Where the substrate admits file or programmatic emission, the artifact may also be written deterministically; where the substrate has no file/CLI import (the Dia browser, whose store is encrypted and cloud-synced with no file/CLI/deeplink import), the artifact is emitted as **paste-ready text** for manual application — the protocol produces the artifact, it does not automate ingestion.

After emit, trigger `converge` and present the convergence evidence trace (structure-preservation trace + DegradationLedger).

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Few essence elements, capability-compatible-but-non-reading substrate, no degradation | Brief structure trace; relay emit (no gate) |
| Medium | Several elements, a handful of declared degradations (DEGRADE only) | Structure trace + DegradationLedger + draft artifact; one Constitution gate |
| Heavy | Dense essence, multiple unavailable primitives including a FAIL touch, target schema uncertain | Full structure trace + DegradationLedger with FAIL/DEGRADE severities + multi-pass re-projection + Redirect option |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Ektyposis) only if ¬can_consume_portable_handoff_directly(target) ∧ ¬exists_realized_artifact(essence, target)` | Prevents false activation when `/distill` (a dereferencing consumer) suffices |
| Relay-to-distill skip | Phase 0 relays to `/distill` when `can_consume_portable_handoff_directly(target)` holds | A dereferencing, capability-compatible consumer reads the portable handoff directly — no per-substrate projection |
| Ground before project | F1 grounds the substrate's native form + primitive inventory before F2 projects | The projection fills the substrate's real structure, not an assumed one; missing primitives are known before they are needed |
| Structure-preserving, not templated | F2 renders each essence element into a target element, preserving the structural relation | The realized artifact reproduces the essence's role, not a generic shell that name-drops it |
| Declared-degradation ban on silence | F3 records every unavailable-primitive touch as a DegradationEntry (FAIL/DEGRADE); silent approximation is forbidden | The user sees exactly where Outcome Equivalence fails locally for this substrate |
| FAIL surfaces, never papers over | A FAIL (unavailable primitive touching identity/convergence) makes the realization Failed and biases toward Redirect | An identity-breaking gap is a user decision, not a silent approximation |
| Anti-circularity | A RealizedArtifact is terminal; only `/distill → /realize` composes; `realize codomain ∩ distill domain = ∅` | A realized artifact is never re-distilled or re-realized — re-derive from the source |
| Context-Question Separation | Structure trace + DegradationLedger + draft artifact as text before the gate; the gate carries only Accept/Adjust/Redirect | The question arrives with maximum clarity; analysis is absorbed first |
| Convergence evidence | Structure-preservation trace + DegradationLedger presented at convergence | Convergence is demonstrated, not asserted |

## Rules

1. **AI-detects, user-judges realization** (Hybrid): AI detects the unformed projection, grounds the target, projects the essence, and classifies degradation; the realization-acceptance judgment, when degradation is declared or a projection choice is open, requires user judgment via Cognitive Partnership Move (Constitution) at Phase 3. As a Hybrid initiator, an AI-detected activation surfaces a one-line confirmation before proceeding; a user `/realize` invocation activates directly. AI detection is implicitly confirmed when the user engages with the surfaced realization.
2. **Recognition over Recall**: Present the realization (structure trace, DegradationLedger, draft artifact) as structured options with differential implications — Accept emits the declared-degradation artifact, Adjust re-projects a named element, Redirect re-binds or stops. Constitution interaction yields the turn before proceeding. The Gate binds to `A ∈ {Accept, Adjust, Redirect}` (per TYPES).
3. **Structure-Preserving Projection over Template Substitution**: Project each essence element into a corresponding target element, preserving the structural relation. A generic template that names the essence without reproducing its structure is not a realization. The essence preserved is the functional role (role-functionalist), not a Platonic inner nature — the same stance as Semantic Autonomy and Outcome Equivalence.
4. **Declared Degradation over Silent Approximation**: Every primitive the essence needs but the substrate lacks is recorded in the DegradationLedger with its severity; the ledger is the explicit record of where Outcome Equivalence fails locally for this substrate. Approximating an unavailable primitive without declaring it is a protocol violation.
5. **Validate before emit (FAIL/DEGRADE)**: F3 classifies every unavailable-primitive touch. A FAIL (touching protocol identity or a convergence condition) makes the realization Failed and surfaces for Redirect; a DEGRADE (reducing only evidence-richness or state-tracking) is recorded and the artifact stays emittable. Emitting a Failed realization as if faithful is forbidden.
6. **Relay-to-distill activation skip**: `/realize` activates only for a substrate that cannot consume the portable handoff directly (`¬can_consume_portable_handoff_directly(target)`). When the target dereferences the canonical source and is capability-compatible, relay to `/distill` rather than projecting — the consumer reads the distilled handoff directly.
7. **Anti-circularity (terminal artifact)**: A realize output is a **terminal substrate artifact**, not a re-distillable portable essence. Only `/distill → /realize` composes (one direction); `/realize → /distill` does not occur — re-derive from the canonical source, never re-realize a terminal artifact. `realize` codomain ∩ `distill` domain = ∅. The relation to `/distill` is **advisory** (complementary deficits), not suppression: distill produces the portable hub, realize projects it to a spoke substrate.
8. **Ground the target reference**: Every realization grounds the substrate's native artifact form and primitive inventory (canonical-external, staleness-guarded) before projecting. A projection onto an assumed, ungrounded substrate structure is not a realization.
9. **Convergence evidence**: At convergence, present the structure-preservation trace (each EssenceElement → TargetElement) and the DegradationLedger. "Realized" as bare assertion without the per-element trace and the declared gaps is a protocol violation.
10. **Context-Question Separation**: The structure trace, DegradationLedger, and draft artifact appear as text output before the Gate; the Gate carries only Accept/Adjust/Redirect with their differential implications. Embedding the analysis in the question fields is a protocol violation.
11. **Gate integrity** (Safeguard tier): The Gate option set (`A ∈ {Accept, Adjust, Redirect}`) is presented intact — injection, deletion, and substitution each violate this invariant. Specializing the Adjust option to a concrete element while preserving the coproduct is type-preserving materialization, distinct from mutation.
12. **Option-set relay test**: A `Faithful` realization — structure fully preserved, no declared degradation, no open projection choice — proceeds as relay (Extension): the option set collapses to a single dominant "emit", so presenting Accept/Adjust/Redirect would be over-gating. The Constitution gate fires only when degradation is declared or a projection choice is genuinely open, where the options carry differential futures.
13. **Plain emit discipline**: User-facing emit (Phase 3 surfacing prose, the gate options, convergence traces) uses everyday language — every emit token carries decision-relevant meaning. Formal-block vocabulary (subscripted variables, Greek-rooted terms in narrative, formal type labels, code-style tokens) stays in the formal block; what the user reads is the realization, the declared gap, or the question in their idiom.
14. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move — the projected element, the gap it declared, and what Accept/Adjust/Redirect each lead to. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant structure-trace rows, and unrelated degradations to the pre-gate text, the convergence trace, or later passes.
