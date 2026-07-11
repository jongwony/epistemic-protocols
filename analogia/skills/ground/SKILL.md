---
name: ground
description: "Validate structural mapping between abstract and concrete domains. Constructs domain correspondences and presents concrete instantiations when mapping uncertainty is detected, producing validated mapping. Also recognizes self-grounding (an abstraction validated against its own instances) and derives a split-vs-trim partition reading that routes wrong-fusion recovery. Type: (MappingUncertain, AI, GROUND, R) → ValidatedMapping. Alias: Analogia(ἀναλογία)."
---

# Analogia Protocol

Validate structural mapping between abstract and concrete domains through AI-guided detection and user-validated instantiation. Type: `(MappingUncertain, AI, GROUND, R) → ValidatedMapping`.

## Definition

**Analogia** (ἀναλογία): A dialogical act of validating structural correspondences between domains, where AI detects mapping uncertainty between abstract frameworks and concrete application contexts, constructs explicit structural mappings, and presents concrete instantiations for user verification of mapping adequacy.

```
── FLOW ──
Analogia(R) → Detect(R) → [¬uncertain: Qc(zero_gap_finding) → Stop → (Confirm: deactivate | Reopen(q): reopen_seed := q, proceed)] → (Sₐ, Sₜ) → Map(Sₐ, Sₜ) → AssessFit(M, Sₐ, Sₜ) → [self_grounding(Sₐ, Sₜ): PartitionRead(F, Sₜ)] → I(M, F, Sₜ) → V → D_f → R' → (loop until terminalized)

── MORPHISM ──
R
  → detect(R, context)                 -- infer mapping uncertainty
  → decompose(abstract, concrete)      -- identify source and target domains
  → construct(mapping, Sₐ→Sₜ)          -- build structural correspondences
  → assess_fit(mapping, Sₐ, Sₜ, context) -- sort correspondence adequacy before user validation
  → read_partition(fit_map, Sₜ) -- DERIVED split-vs-trim reading over the misfit MEMBERS (self-grounding case only — guarded; relay, no gate): misfits clustering into a coherent rival essence → Split → decompose recovery (route to the /conduct recipe) vs scattered misfits → Trim → narrow in place (/induce Narrow) vs no misfit → Hold
  → instantiate(mapping, fit_map, target) -- generate concrete examples scoped by fit map
  → validate(instantiation, user)      -- user verifies mapping adequacy
  → declare_fit_disposition(fit_map, validation) -- record bounded residual status without a new gate
  → terminalize(mapping, user, fit_disposition) -- make mapping status explicit in output
  → ValidatedMapping
requires: uncertain(mapping(Sₐ, Sₜ))    -- runtime checkpoint (Phase 0)
deficit:  MappingUncertain               -- activation precondition (Layer 1/2)
preserves: content_identity(R)           -- output content invariant; mapping status recorded in R'
invariant: Structural Correspondence over Abstract Assertion

── TYPES ──
R        = Text containing abstract structures (source-agnostic: AI output, user analysis, or external reference)
             -- Input type: morphism processes R uniformly; enumeration scopes the definition, not behavioral dispatch
Detect   = Mapping uncertainty detection: R → Bool
Sₐ       = Source domain (abstract structure in R)
Sₜ       = Target domain (user's concrete application context)
self_grounding(Sₐ, Sₜ) ≡ instances(Sₐ) = Sₜ   -- self-grounding case: Sₜ is the source abstraction's OWN member instances (Sₐ a LOCATED candidate fused abstraction validated against the instances it claims to subsume), not a separate application domain. located(Sₐ) holds — this is what distinguishes self-grounding from the colimit route-away case (locator absent → /induce); here the abstraction already has a name and is checked for wrong-fusion against its own members
Map      = Structure-preserving mapping construction: (Sₐ, Sₜ) → Set(Correspondence)
M        = Set(Correspondence)                                   -- mapping result
Correspondence = { abstract: Component, concrete: Component, relation: String }
Component = { name: String, structure: String }
Context  = Observable mapping context from R, session context, and cited domain evidence
AssessFit = Correspondence adequacy assessment: M × Sₐ × Sₜ × Context → F
F        = CorrespondenceFitMap { preserved, partial, missing, overextended, open }
preserved = Set(Correspondence) where target structure preserves source relation
partial  = Set(Correspondence) where correspondence exists but some structural dimensions lack evidence
missing  = Set(Component) from Sₐ with no evidenced Sₜ correspondent
overextended = Set(Correspondence) where source relation adds unsupported target constraints
open     = Set(StructuralQuestion) where answer could change validation of M
StructuralQuestion = { structure: Component, reason: String, evidence_needed: String }
FitLabel ∈ {Preserved, Partial, Overextended}
fit_classification(F, c) =
  Preserved if c ∈ F.preserved
  Partial if c ∈ F.partial
  Overextended if c ∈ F.overextended
fit_partition(F, M) = F.preserved ∪ F.partial ∪ F.overextended = M (pairwise disjoint)
ResidualFitIssue ∈ Missing(Component) ∪ OpenQuestion(StructuralQuestion)
residual_issues(F) = { Missing(x) | x ∈ F.missing } ∪ { OpenQuestion(q) | q ∈ F.open }
FitDisposition = { issues: Set(ResidualFitIssue), status: None ∪ Bounded, declaration: String }
D_f      = FitDisposition
fit_disposition_declared(F, D_f) =
  (residual_issues(F) = ∅ ∧ D_f.status = None)
  ∨ (D_f.status = Bounded ∧ D_f.issues = residual_issues(F))
MemberInstance = a member of Sₜ in the self-grounding case (an instance the abstraction Sₐ claims to subsume)  -- Sₜ's elements; self-grounding-only. Distinct from Component (a structural element of a domain): the partition reading ranges over members, not over correspondences or facets
PartitionReading = { verdict ∈ {Split, Trim, Hold}, rival_essences: Set(InstanceCluster), trim_outliers: Set(MemberInstance), core_remainder: Set(MemberInstance), basis: F }  -- DERIVED split-vs-trim reading; verdict = Hold means no significant misfit (the fusion holds, no partition action). Computed ONLY in the self-grounding case; when ¬self_grounding the protocol holds Λ.partition_reading = None (Option — not computed at all), DISTINCT from verdict = Hold. NOT a sixth fit cell — it is SECOND-ORDER over the misfit MEMBER set (via the misfit_instances projection), not a partition of correspondences M, so it leaves fit_partition(F, M) intact. Relay (derived from F), never a gate.
   -- THREE pairwise-disjoint member groups that PARTITION Sₜ exhaustively: core_remainder = members that genuinely FIT the original abstraction (= Sₜ minus ALL misfits, so it never contains a misfit); rival_essences = the disjoint coherent rival cells within the misfits (each a candidate new abstraction → decompose); trim_outliers = the remaining scattered/ambiguous misfits in no rival cell (narrow-out candidates). Sₜ = core_remainder ⊎ (⋃ rival_essences.members) ⊎ trim_outliers. The cell-candidate partition /conduct constitutes is { core_remainder } ∪ { rival cells }; trim_outliers is surfaced for the checkpoint to narrow-out or place (never silently folded into the core)
InstanceCluster = { members: Set(MemberInstance), candidate_essence: String }  -- a coherent sub-group of Sₜ members + the rival essence they support; these are the rival cell candidates the /conduct decompose-recovery boundary-checkpoint consumes (cell assignment is the user's constitutive judgment there, not here)
member_facet(F) = { facet ∈ F.missing | asserted_of_all(facet) }  -- the subset of F.missing the abstraction asserts of ALL members (universally-quantified facets), so each is per-member testable via exhibits(·); other missing components are not member-testable and stay in basis, never projecting onto members
misfit_instances : F × Sₜ → Set(MemberInstance)  -- DERIVED projection from the fit map onto the member set: m ∈ Sₜ is misfit iff (∃ c ∈ F.overextended : m violates c's added target constraint) ∨ (∃ facet ∈ member_facet(F) : ¬exhibits(m, facet)). Only member_facet(F) ⊆ F.missing — the universally-asserted, per-member-testable facets — projects onto members; the rest of F.missing and all source-side cells of F.overextended stay in basis, never in the member set — so the reading is genuinely over instances and leaves fit_partition(F, M) intact
rival_clusters(mis) : Set(MemberInstance) → Set(InstanceCluster)  -- the PAIRWISE-DISJOINT coherent rival-essence sub-groups within the misfit member set mis (each clustered misfit assigned to exactly one rival; a maximal InstanceCluster supporting one rival essence); ∅ when mis's members are all scattered/ambiguous with no coherent rival. Misfits in no cluster fall to trim_outliers, never to core_remainder
partition_reading(F, Sₜ) =   -- invoked ONLY under self_grounding (guarded in FLOW / PHASE TRANSITIONS); returns a full PartitionReading RECORD, never a bare verdict token and never the Option None
  let mis = misfit_instances(F, Sₜ), clusters = rival_clusters(mis),
      core = Sₜ \ mis, outliers = mis \ ⋃ { c.members | c ∈ clusters },
      cells = (if core ≠ ∅ then {core} else ∅) ∪ clusters       -- the NON-EMPTY recovery cells: the core cell (when non-empty) + the rival cells
  in { verdict        = Hold if mis = ∅ ; Split if |cells| ≥ 2 ; Trim otherwise,
       rival_essences = clusters,                                 -- pairwise disjoint; may be a single cluster even when verdict = Trim (one rival, empty core)
       trim_outliers  = outliers,                                 -- misfits in no rival cell: = ∅ when Hold, = mis when there is no cluster, the scattered remainder when split
       core_remainder = core,                                     -- the members that genuinely FIT (= Sₜ when Hold); NEVER contains a misfit
       basis          = F }
  -- verdict = Split (|cells| ≥ 2) → wrong fusion: route to /conduct decompose (n ≥ 2 cells satisfies the conduct warrant; trim_outliers narrowed-out or placed at the checkpoint); Trim (|cells| ≤ 1: scattered misfits around a core, OR a single coherent cell with empty core) → SINGLE-MOVE /induce recovery (Narrow or Reorient), NOT a decompose; Hold → fusion holds, no partition action
I        = Concrete instantiation: M × F × Sₜ → Example
Example  = { scenario: String, mapping_trace: List<Correspondence>, fit_basis: F }
V        = User validation ∈ {Confirm, Adjust(feedback), Dismiss}
ZeroGapConfirmation = user's answer to a zero-gap finding ∈ {Confirm, Reopen(StructuralQuestion)}  -- Confirm accepts the trivial mapping (Rule 11); Reopen names a structural question the Phase 0 scan missed, setting uncertain := true and proceeding to Phase 1
ValidationRecord = { example: Example, answer: V, fit_label: FitLabel, residual_disposition: FitDisposition }
R'       = Updated output with explicit mapping status (in the self-grounding case, R' additionally carries the relay PartitionReading and its routing recommendation: verdict = Split → /conduct decompose-recovery recipe; verdict = Trim → /induce Narrow; the partition reading is an annotation on the validated mapping, not a change to the terminal type)
ValidatedMapping = R' where terminalized(R', F, D_f)
terminalized(R', F, D_f) = all_addressed(R') ∧ fit_disposition_declared(F, D_f)
all_addressed(R') = ∀ c ∈ M : confirmed(c) ∨ dismissed(c)
EarlyExit = R where user_esc  -- non-convergent early exit: current output R unmodified, partial trace over already-addressed correspondences, remaining correspondences declared as unresolved residual (mapping not terminalized)

── R-BINDING ──
bind(R) = explicit_arg ∪ current_output ∪ most_recent_output
Priority: explicit_arg > current_output > most_recent_output

/ground "text"                → R = "text"
/ground (alone)               → R = most recent relevant output in current session (AI or user)
"ground this..."              → R = text currently under discussion
"does this abstraction hold across its cases?" → R = a candidate fused abstraction + the instances it claims to subsume → self-grounding (Sₐ = the abstraction, Sₜ = its own members)

If no relevant text exists: pause activation and request a grounding target before Phase 0.

── PHASE TRANSITIONS ──
Phase 0: R → Detect(R) → uncertain? ∧ classify self_grounding(Sₐ, Sₜ)   -- mapping uncertainty checkpoint (silent); also recognize the self-grounding case (a located abstraction vs its OWN instances) — distinct from colimit route-away (locator absent → /induce)
       [¬uncertain] Qc(zero_gap_finding) → Stop → ZeroGapConfirmation   -- zero-signal (Rule 11): Confirm → deactivate (mapping trivially established) | Reopen(q) → uncertain := true, reopen_seed := q, proceed to Phase 1 [Tool]
Phase 1: uncertain → (Sₐ, Sₜ) → Map(Sₐ, Sₜ) → M → AssessFit(M, Sₐ, Sₜ) → F → [reopen_seed = Some(q): F.open := F.open ∪ {q}; reopen_seed := None] → [self_grounding: PartitionRead(F, Sₜ) → PartitionReading]  -- domain decomposition + fit map (Reopen seed folded into F.open, then cleared — track); derived split-vs-trim reading in the self-grounding case (relay), via partition_reading() [Tool]
Phase 2: (M, F) → I(M, F, Sₜ) → [self_grounding: surface PartitionReading + routing recommendation as pre-gate relay] → Qs(I, F, framing) → Stop → V  -- instantiation + validation; the partition reading is surfaced as relay before the gate [Tool]
Phase 3: V → integrate(V, R, F) → (D_f, R') ; [self_grounding: R' carries PartitionReading + routing — Split → /conduct decompose-recovery recipe; Trim → /induce Narrow]  -- fit disposition + output update; partition relay folded into R' (track)

── LOOP ──
After Phase 3: evaluate validation result.
If V = Confirm: mark correspondence confirmed; record fit label snapshot and D_f; terminalize if all correspondences addressed and fit disposition is declared.
If V = Adjust(feedback): refine mapping with feedback → return to Phase 1.
If V = Dismiss: accept this correspondence as unresolved for this session; record fit label snapshot and D_f; terminalize if all correspondences addressed and fit disposition is declared.
Max 3 mapping attempts per domain pair.
Continue until: terminalized(R', F, D_f) OR attempts exhausted OR user ESC (EarlyExit, not ValidatedMapping).
On user ESC: present partial transformation trace over already-addressed correspondences, then declare remaining correspondences as unresolved residual.
Convergence evidence: At terminalized(R', F, D_f), present transformation trace — for each record in Λ.validations, show (MappingUncertain(record.example.mapping_trace) → record.fit_label → record.answer). When D_f.status = Bounded, append the bounded residual mapping uncertainty from D_f.declaration and briefly invite the user to supply a missing Sₜ correspondent if one can be identified — a free response within the existing turn, not a new gate or post-convergence morphism. When self_grounding holds, append the PartitionReading as relay: the verdict (Split / Trim / Hold), the full Sₜ partition when verdict = Split (rival cells, core cell, trim outliers), and the routing recommendation (Split → the /conduct decompose-recovery recipe; Trim → /induce Narrow; Hold → no partition action) — a relay annotation, not a new gate. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
terminalized(R', F, D_f) = all_addressed(R') ∧ fit_disposition_declared(F, D_f)
progress(Λ) = 1 if |mappings| = 0 else 1 - |remaining| / |mappings|   -- mappings = ∅ (Phase 0 zero-gap trivial convergence: Confirm deactivates before Phase 1 constructs M) is fully converged, not undefined
narrowing(V, M) = |remaining(after)| < |remaining(before)|
early_exit = user_declares_mapping_sufficient

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Detect  (sense)     → Internal analysis (no external tool; also classify self_grounding — a located abstraction vs its own instances, distinct from colimit route-away)
Phase 0 ZeroGapConfirm (constitution) → present (conditional: ¬uncertain(mapping); zero-gap finding + reasoning; Confirm/Reopen — Rule 11)
Phase 1 Map/AssessFit (observe) → Read, Grep (stored knowledge extraction: domain structure and fit analysis); WebSearch (conditional: external domain knowledge)
Phase 1        (track)      → Internal state update (conditional: Λ.reopen_seed = Some(q) — fold q into F.open at fit-map assembly, then Λ.reopen_seed := None, consumed once)
Phase 1 PartitionRead (sense) → Internal analysis (no external tool; DERIVED split-vs-trim reading over F's misfit instances; self-grounding case ONLY; verdict = Split → route to the /conduct decompose-recovery recipe; verdict = Trim → /induce Narrow; basis cited from F; surfaced as pre-gate relay text within Phase 2 Qs, no separate gate)
Phase 2 Qs      (constitution)      → present (mandatory; Esc key → loop termination at LOOP level, not a Validation)
Phase 3         (track)     → Internal state update
converge     (extension)       → TextPresent+Proceed (convergence evidence trace incl. PartitionReading relay when self_grounding; proceed with validated mapping)
esc          (extension)       → TextPresent+Proceed (partial transformation trace + unresolved-correspondence declaration; terminate as EarlyExit, not ValidatedMapping)

── MODE STATE ──
Λ = { phase: Phase, R: Text, Sₐ: Domain, Sₜ: Domain,
      self_grounding: Bool, partition_reading: Option(PartitionReading),
      reopen_seed: Option(StructuralQuestion),   -- the zero-gap Reopen(q) question the Phase 0 scan missed — the one entry Phase 1 cannot be assumed to re-derive; consumed into F.open at Phase 1, then cleared
      mappings: Set(Correspondence), confirmed: Set(Correspondence),
      dismissed: Set(Correspondence), remaining: Set(Correspondence),
      fit_map: F, fit_disposition: D_f, instantiations: List<Example>,
      validations: List<ValidationRecord>, attempts: Nat, active: Bool,
      cause_tag: String }
-- Invariant: mappings = confirmed ∪ dismissed ∪ remaining (pairwise disjoint)
-- Invariant: fit_partition(F, M)  -- PartitionReading is SECOND-ORDER over misfit instances, not a partition of M, so it does not enter this invariant
-- Invariant (always holds): partition_reading = Some(PartitionReading) ⟹ self_grounding. Steady-state converse (after Phase 1 computes the reading for the current F): self_grounding ⟹ partition_reading = Some(...) with verdict ∈ {Split, Trim, Hold}. Before Phase 1 computes it — Phase 0, or a Phase 1 re-entry via Adjust until recompute — partition_reading = None even under self_grounding (Pending). So None means ¬self_grounding OR not-yet-computed-for-current-F; the verdict Hold (no-misfit) stays a distinct value, never conflated with the Option None

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Structural Correspondence over Abstract Assertion**: When text contains abstract frameworks applied to a user's domain, validate that structure-preserving mappings exist between the abstract and concrete domains through explicit correspondences and concrete instantiations, rather than asserting that the abstraction applies. The purpose is to verify mapping adequacy, not to simplify the abstraction.

## Mode Activation

### Activation

AI detects mapping uncertainty in output OR user calls `/ground`. Detection is silent (Phase 0) except the conditional zero-gap confirmation gate; validation always requires user interaction via Cognitive Partnership Move (Constitution) (Phase 2). On direct `/ground`, bind `R` from the current or most recent output under discussion; if no recoverable `R` exists, request the grounding target before Phase 0.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/ground` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Mapping uncertainty detected via in-protocol heuristics. Detection is silent (Phase 0) except the conditional zero-gap confirmation gate.

**Mapping uncertain** = text applies abstract structures to a domain where structural correspondence has not been established.

Gate predicate:
```
uncertain(mapping(Sₐ, Sₜ)) ≡ ∃ structure(s, Sₐ) : ¬established(correspondence(s, Sₜ))
```

### Priority

<system-reminder>
When Analogia is active:

**Supersedes**: Direct output patterns that assume mapping validity
(Structural correspondence must be validated before proceeding)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, present concrete instantiation for user validation of mapping adequacy via Cognitive Partnership Move (Constitution).
</system-reminder>

- Analogia completes before output dependent on mapping validity proceeds
- Loaded instructions resume after mapping status is made explicit

### Trigger Signals

Heuristic signals for mapping uncertainty detection (not hard gates):

| Signal | Detection |
|--------|-----------|
| Abstract framework applied | AI output uses a pattern, model, or analogy without domain-specific validation |
| Cross-domain transfer | Concept from one domain applied to a structurally different domain |
| Grounding probe | User requests "concrete example", "how does this apply to my case", "show me in my context" |
| Structural mismatch indicators | Abstract assumptions that may not hold in the concrete domain |
| Self-grounding (abstraction vs its own instances) | A located/named abstraction is checked against the instances it claims to subsume (wrong-fusion suspicion) — Sₐ = the abstraction, Sₜ = its own members. Distinct from the colimit route-away case (locator absent → /induce); here the abstraction already has a name and is tested for whether it fuses dissimilar instances |

**Cross-session enrichment**: Prior session indices from the hypomnesis store (prior-session recall indices), when present, may seed Phase 1 domain decomposition; the constitutive judgment remains with the user.

**Skip**:
- Output is already domain-specific with concrete instantiations
- User explicitly says "I understand the mapping" or "this applies"
- Same domain pair was validated in current session (session immunity)
- Phase 1 domain analysis confirms structural correspondence is trivial
- No abstract framework is applied (output is purely concrete)
- Colimit-shaped input detected (`essence_sensed` over concrete instances + `locator_absent(A)`) — route to `/induce` (Periagoge) for abstraction formation; Analogia's substitution interface fits mapping validation. `locator_absent(A)` is the shared cross-protocol predicate (Periagoge formal `¬located(A)`) — from Analogia's substitution-interface vantage it surfaces as a missing source abstraction Sₐ to substitute from. **Self-grounding is the complement, NOT skipped**: when `located(A)` holds (the abstraction already has a name) and the grounding target is the abstraction against its OWN instances, the input is not colimit-shaped — keep it and run the self-grounding path (wrong-fusion detection), do not route away. The "purely concrete" skip below also does not apply, because a located abstraction IS an abstract structure under validation
- Framework selection is the primary deficit (no analytical framework chosen for the inquiry) — route to `/frame` (Prothesis); Analogia validates the mapping of an *existing* framework, Prothesis selects frameworks when none is yet chosen
- Context insufficiency is the primary deficit (factual gaps in execution context — missing facts, missing user environment) — route to `/inquire` (Aitesis); Analogia checks *relational* correspondence between domains, Aitesis checks *factual* sufficiency for execution

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| All correspondences addressed (confirmed or dismissed) | Proceed with validated mapping |
| User Esc key | EarlyExit (not ValidatedMapping): present partial transformation trace + declare remaining correspondences as unresolved residual, then accept current output without further grounding |
| Attempt cap reached | Surface remaining uncertainty, accept current output with explicit unresolved mapping note |

## Protocol

### Phase 0: Mapping Uncertainty Checkpoint (Silent)

Analyze text for mapping uncertainty. This phase is **silent** — no user interaction, except the conditional zero-gap confirmation gate (Rule 11) when no mapping uncertainty is detected.

1. **Bind output** `R`: use explicit argument or the current/most recent output under discussion
2. **Scan output** `R` for abstract structures: patterns, models, analogies, frameworks applied to user's domain
3. **Colimit-shape detection**: assess whether `R` is a colimit-shaped input — `essence_sensed` over concrete instances plus `locator_absent(A)` (Periagoge formal `¬located(A)`; from Analogia's substitution-interface vantage this surfaces as no source abstraction Sₐ available). Instance accumulation contributes evidence strength for the essence signal. When both criteria hold, route to `/induce` (Periagoge) for abstraction formation; Analogia remains scoped to mapping validation from a source abstraction to a concrete target.
3b. **Self-grounding recognition**: if `located(Sₐ)` holds AND the grounding target is the abstraction against its OWN member instances (`Sₜ` = the instances `Sₐ` claims to subsume), set `self_grounding = true`. This is the complement of the colimit case (locator present, not absent): the abstraction already has a name and is being checked for wrong fusion against its members, not formed from scratch. Self-grounding does not route away — it proceeds through the normal mapping-validation phases, and the derived partition reading is computed in Phase 1.
4. **Check correspondence**: For each abstract structure, assess whether mapping to user's concrete domain is established
5. If all mappings trivially established: present finding per Rule 11 before proceeding (Analogia not activated)
6. If uncertain mappings identified: record `(Sₐ, Sₜ)` — proceed to Phase 1

**Scan scope**: Bound text R, conversation context, observable domain signals. Does NOT modify files or call external services.

### Phase 1: Domain Decomposition + Mapping Construction

Decompose abstract and concrete domains, then construct structural correspondences.

1. **Identify source domain** `Sₐ`: Extract abstract structures from R — components, relationships, constraints, assumptions
2. **Identify target domain** `Sₜ`: Determine user's concrete application context — environment, constraints, existing structures
   - **Call Read/Grep** to collect evidence about target domain from codebase, configs, documentation
3. **Construct mapping** `M`: For each abstract component, identify the candidate concrete correspondent
   - If correspondence is clear: add to confirmed candidates
   - If structural mismatch detected: flag as uncertain — include evidence
   - If no correspondent exists: flag as gap — the abstract structure may not apply
4. **Assess fit** `F`: Sort the correspondence adequacy into preserved, partial, missing, overextended, and open
   - `preserved`, `partial`, and `overextended` partition the constructed correspondences `M`
   - `missing` tracks source components that do not yet have evidenced target correspondents
   - `open` is limited to structural questions whose answer could change validation of the mapping
   - Do not include general analogy ideas, background caveats, or future exploration horizons
   - When `Λ.reopen_seed` is set (the zero-gap gate returned `Reopen(q)`): `F.open := F.open ∪ {reopen_seed}` — the reopened question is the one entry this scan cannot be assumed to re-derive — then clear `reopen_seed`
4b. **Derive the partition reading** (self-grounding case only): when `self_grounding` holds, compute `partition_reading(F, Sₜ)` over the misfit members — the `misfit_instances(F, Sₜ)` projection: members `m ∈ Sₜ` implicated by `F.overextended` (members that violate an overextended facet's added constraint) or by `F.missing` (members lacking a facet the abstraction asserts of all members). The reading is **derived** from `F` (relay, no gate) and classifies the misfit set:
   - **Split** — the partition yields **≥2 non-empty cells** (the core cell plus rival cell(s), or ≥2 rival cells): the misfit members cluster into coherent rival essence(s), not just isolated outliers. The reading partitions `Sₜ` into three pairwise-disjoint groups: `rival_essences` (the InstanceClusters, each = member instances + the essence they support — pairwise disjoint), `core_remainder` (the members the original abstraction *genuinely fits* — `Sₜ` minus *all* misfits, so never a misfit), and `trim_outliers` (scattered/ambiguous misfits in no rival cell). The cell-candidate partition handed to `/conduct` is the rival cells **plus** the core cell (covering every fitting member); `trim_outliers` is surfaced for the checkpoint to narrow-out or place, never folded into the core. This is wrong fusion — the member set carries ≥2 essences forced under one form, so the recovery is **decompose** (the ≥2-cell count satisfies `/conduct`'s ≥2-move warrant). Route recommendation: the `/conduct` decompose-recovery recipe. Analogia *evidences* the split boundary and the full candidate partition; it does **not** constitute the cell assignment — that is the user's constitutive judgment at the recipe's boundary-checkpoint.
   - **Trim** — the partition yields **at most one non-empty cell**: either scattered misfits around an otherwise-sound core (narrow the outliers out), or a single coherent cell with an empty core (the abstraction is wholly the wrong essence and re-forms into one). The recovery is a **single-move** `/induce` (Narrow or Reorient), not a decompose — a single move does not warrant `/conduct`.
   - **Hold** — no significant misfit (`misfit_instances(F, Sₜ) = ∅`); the fusion holds, no partition action. (Distinct from `Λ.partition_reading = None`, which means the reading was never computed because the case is not self-grounding.)
   The split-vs-trim distinction is the signal the `/conduct` recipe consumes to route decompose vs leave it to `/induce` Narrow; surface it in Phase 2 and the convergence trace, never constitute it here.
5. Proceed to Phase 2 with mapping candidates and fit map

**Web context** (conditional): When source or target domain knowledge exists primarily outside the codebase (external APIs, academic domains, industry standards), extend context collection to web search.
Web evidence is tagged with `source: "web:{url}"` for traceability.

**Scope restriction**: Read-only investigation only (Read, Grep, WebSearch). No test execution or file modifications.

### Phase 2: Instantiation + Validation

**Present** concrete instantiations for user validation via Cognitive Partnership Move (Constitution).

**Selection criterion**: Choose the correspondence whose validation would maximally narrow the remaining mapping uncertainty using `F`. Prioritize partial, overextended, missing-adjacent, or open-adjacent correspondences before already-preserved ones. When priority is equal, prefer the correspondence with richer structural evidence.

**Surfacing format**:

Present the mapping details as text output:
- **Abstract**: [component from Sₐ with structural description]
- **Concrete**: [proposed correspondence in Sₜ with evidence]
- **Fit**: [preserved / partial / missing / overextended / open issue, in plain language]
- **Example**: [concrete scenario demonstrating the mapping]
- [If structural mismatch detected: flag and explain]
- [If open issue could change validation: name the missing evidence or user-known fact]
- [If self-grounding: **Partition reading** (relay) — the split-vs-trim verdict in plain language: whether the misfitting cases cluster into a separate coherent kind (split → the cases carry a rival essence; recovery is to decompose into multiple abstractions via the `/conduct` recovery recipe) or are scattered outliers (trim → recovery is to narrow the one abstraction via `/induce`). When split, name the rival-essence cluster(s) and the cases in each, the core cases the original abstraction genuinely fits, and any scattered outliers in no rival (narrow-out candidates) — so the full three-way split (rival cells + core cell + outliers) is visible and no case is dropped. This is a relay reading surfaced alongside the mapping, not part of the validation question]

Then **present**:

```
Does [abstract concept] map correctly to your context?

Options:
1. **Confirm** — [what this validated mapping enables for downstream work]
2. **Adjust** — [what aspect of the mapping diverges and how refinement would change the correspondence]
3. **Dismiss** — [what assumption about contextual fit is accepted without grounding]
```

Other is always available — user can propose an alternative mapping or describe a structural correspondence not captured by the presented options.

**Design principles**:
- **Structural evidence**: Show what abstract structures are being mapped and why
- **Fit map before choice**: Show only the correspondence-fit distinctions that matter for the current validation
- **Concrete instantiation**: Always include at least one concrete example in user's domain
- **Current correspondence framed**: Surface the correspondence currently being validated as framing — which mapping is in play this cycle — rather than a completion count across all correspondences
- **Actionable options**: Each option leads to a concrete next step

### Phase 3: Integration

After user response:

1. **Confirm**: Mark correspondence as validated, record the current fit classification with the validation, declare `D_f`, and update output `R'` to include explicit mapping status
2. **Adjust(feedback)**: Incorporate feedback, reconstruct mapping — return to Phase 1
3. **Dismiss**: Mark correspondence as not requiring further grounding in this session, record the current fit classification with the dismissal, declare `D_f`, and keep current output

`D_f` is declared during Phase 3 from the Phase 2 surface: `None` when `residual_issues(F)` is empty, otherwise `Bounded` with the missing/open issues that were visible before the gate. This is trace metadata, not a separate user gate.

When `self_grounding` holds, `R'` also carries the relay `partition_reading` and its routing recommendation (Split → the `/conduct` decompose-recovery recipe; Trim → `/induce` Narrow; Hold → no partition action). Like `D_f`, this is relay trace metadata folded into the output, not a separate user gate — when the verdict is Split, the cell assignment is constituted later at the `/conduct` recipe's boundary-checkpoint, not here (Analogia evidences the split boundary; it does not constitute the cells).

After integration:
- Check remaining unvalidated correspondences
- If correspondences remain: return to Phase 2 (present next correspondence)
- If all correspondences are addressed and `D_f` is declared: proceed with updated output
- Log `ValidationRecord` to validations so convergence traces use the fit label that was active when the user judged the correspondence

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Single obvious correspondence | Brief example + Constitution interaction with Confirm default |
| Medium | Multiple correspondences, partial structural match | Mapping table + concrete examples |
| Heavy | Complex cross-domain mapping, structural mismatches detected | Full domain decomposition + multiple instantiations + gap analysis |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Analogia) only if ∃ structure(s, Sₐ) : ¬established(correspondence(s, Sₜ))` | Prevents false activation on domain-specific output |
| Domain decomposition first | Phase 1 before Phase 2 | Ensures mapping is structurally grounded |
| One correspondence per cycle | Present highest-priority correspondence per Phase 2 | Prevents example overload |
| Session immunity | Validated domain pair → skip for session | Respects user's validation |
| Self-grounding partition reading | Phase 1 derives split-vs-trim from `F` in the self-grounding case (relay, second-order over misfit instances) | Routes wrong-fusion recovery — Split → `/conduct` decompose-recovery, Trim → `/induce` Narrow — without constituting the cell assignment (deferred to the `/conduct` boundary-checkpoint) |
| Current-correspondence framing | Phase 2 surfaces the correspondence currently being validated (which mapping is in play this cycle) — a framing readout, not an `[N validated / M]` completion count | User recognizes which mapping is in play without parsing a coverage tally; granular progress stays in session |
| Attempt cap | Max 3 mapping attempts per domain pair | Prevents infinite refinement |
| Early exit | User can declare mapping sufficient at any Phase 2 | Full control over validation depth |

## Rules

1. **AI-guided, user-validated**: AI detects mapping uncertainty; validation requires user choice via Cognitive Partnership Move (Constitution) (Phase 2)
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity — Constitution interaction requires turn yield before proceeding
3. **Domain decomposition first**: Before presenting instantiations, decompose abstract and concrete domain structures through codebase analysis (Phase 1)
4. **Structural Correspondence over Abstract Assertion**: When mapping is uncertain, construct explicit correspondences rather than assert mapping validity — silence is worse than a rejected mapping
5. **Concrete instantiation required**: Every mapping presented must include at least one concrete example in the user's domain
6. **Evidence-grounded**: Every correspondence must cite specific structural elements from both abstract and concrete domains
7. **Validation respected**: User validation or dismissal is final for that correspondence in the current session
8. **Convergence persistence**: Mode active until all identified correspondences are addressed or user Esc key
9. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
10. **Convergence evidence**: Present transformation trace before declaring terminalized(R', F, D_f); per-correspondence evidence is required
11. **Zero-gap surfacing**: If the Phase 0 scan finds perfect correspondence with no mapping gaps, present this finding with reasoning for user confirmation
12. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options
13. **Gate integrity** (Safeguard tier): The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
14. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
15. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
16. **Protocol-native pressure map**: Phase 1 produces a CorrespondenceFitMap before validation. The map is a pre-gate support object for correspondence adequacy, not a terminal status and not generic calibration. `open` may surface bounded discovery pressure only when the missing evidence could change the user's validation of the current mapping. Missing/open residuals are declared through Phase 3 fit disposition metadata without adding a user gate.
16a. **Self-grounding and the split-vs-trim partition reading**: When the grounding target is a located abstraction against its own member instances (`self_grounding`), Analogia recognizes the case — not colimit route-away (which needs `locator_absent`), not the "purely concrete" skip (a located abstraction is an abstract structure under validation) — and derives a `PartitionReading` over the misfit instances. The reading is **derived from the fit map** (relay, never a gate) and is **second-order** — over the misfit instance set, not a partition of correspondences `M` — so it is not a sixth fit cell and does not enter `fit_partition(F, M)`. It classifies by the **non-empty cell count** of the induced partition: **Split** (≥2 non-empty cells — core + rival(s), or ≥2 rivals → wrong fusion → route to the `/conduct` decompose-recovery recipe, whose ≥2-move warrant the cell count satisfies) vs **Trim** (≤1 non-empty cell — scattered misfits around a core, or one coherent cell with empty core → single-move `/induce` Narrow/Reorient) vs **Hold** (no misfit; distinct from `Λ.partition_reading = None`, which means not-self-grounding so the reading was never computed). Analogia *evidences* the split boundary and surfaces the rival-essence cluster candidates; it does **not** constitute the cell assignment — that is the user's constitutive judgment at the `/conduct` recipe's boundary-checkpoint. The split-vs-trim signal is the interface the recovery composition consumes, carried through session text — the three protocols compose as natural language in the session, not through a formal gate-composition operator.
17. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
