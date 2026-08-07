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
Analogia(R) → attempts := 0 ; pair_attempts := ∅ ; basis_dirty := false ; refuted_focuses := ∅ ; zero_gap_confirmed := false ; fit_map := None ; focus := None ; outgoing_domains := None ; mappings := ∅ ; confirmed := ∅ ; dismissed := ∅ ; remaining := ∅ ; validations := [] ; partition_reading := None ; reopen_seed := None → Detect(R) → [¬uncertain: Qc(zero_gap_finding) → Stop → (Confirm: zero_gap_confirmed := true ; deactivate | Reopen(q): reopen_seed := q, proceed)] → (Sₐ, Sₜ) → derive_focus_candidates(Sₐ, Sₜ) → candidates → settle_focus(candidates, R, context) → φₚ → [focus_settled(φₚ) ∧ ((Sₐ, Sₜ), φₚ) ∉ Λ.refuted_focuses: FocusReadback(φₚ) → φ' := φₚ | ¬focus_settled(φₚ) ∨ ((Sₐ, Sₜ), φₚ) ∈ Λ.refuted_focuses: Qc(candidate_focuses) → Stop → FocusAnswer → (Select(φₛ): φ' := φₛ | Reframe(d): reframe_basis(d) → re-enter derive_focus_candidates)] → [Λ.focus = Some(φ) ∧ φ' ≠ φ: invalidate_derived(Λ)] → [focus_change_requires_disposition(Λ, φ'): Qc(focus_change) → Stop → FocusChangeAnswer → (ParkPriorJudgments: retain(affected(Λ)) | RevalidatePriorJudgments: return_pending(affected(Λ)))] → Λ.focus := φ' ; Λ.basis_dirty := false ; Λ.outgoing_domains := None → [attempts_exhausted(Λ): D_f := declare_exhaustion_disposition(Λ) ; R' := annotate(R, unresolved_mapping_status, exhaustion_residual(Λ)) → AttemptExhausted] → attempts := attempts + 1 → Map(Sₐ, Sₜ, φ') → M → [M ≠ ∅: carry_over(M) | M = ∅: Λ.mappings := ∅] → AssessFit(M, Sₐ, Sₜ) → F → Λ.fit_map := Some(F) → [self_grounding(Sₐ, Sₜ): PartitionRead(F, Sₜ)] → [M = ∅: surface(no correspondence constructed along φ', F.missing) → Λ.refuted_focuses := Λ.refuted_focuses ∪ {((Sₐ, Sₜ), φ')} ; Λ.partition_reading := None → [attempts_exhausted(Λ): D_f := declare_exhaustion_disposition(Λ) ; R' := annotate(R, unresolved_mapping_status, exhaustion_residual(Λ)) → AttemptExhausted | ¬attempts_exhausted(Λ): derive_focus_candidates(Sₐ, Sₜ, F.missing) → re-enter focus settlement] | M ≠ ∅ ∧ Λ.remaining = ∅: integrate(∅, R, F) → (D_f, R') ; [self_grounding: R' carries PartitionReading + routing] → terminalize | M ≠ ∅ ∧ Λ.remaining ≠ ∅: c ∈ Λ.remaining → I(M, F, Sₜ) → V → D_f → R'] → (loop until terminalized ∨ attempts_exhausted(Λ))

── MORPHISM ──
R
  → detect(R, context)                 -- infer mapping uncertainty
  → decompose(abstract, concrete)      -- identify source and target domains
  → derive_focus_candidates(Sₐ, Sₜ, R, context) -- surface plausible MappingFocus candidates (source_scope, target_scope, relation, purpose), before any correspondence is constructed
  → settle_focus(candidates, R, context) → φₚ -- bind the provisional comparison focus the settlement guard then reads; focus_settled(φₚ) is checked PER FIELD, not object-wide (see focus_settled), and decides relay (FocusReadback) vs gate (FocusSelector) — this step yields the value, it does not itself make that choice; once per domain pair for the initial selection, before construction, plus once more per empty-construction retry within the same pair
  → constitute_focus_change_disposition(Λ, φ') -- conditional: when terminal judgments stand under an outgoing focus, the user constitutes their fate (park or revalidate) before construction runs on the successor focus
  → construct(mapping, Sₐ→Sₜ, φ)        -- build structural correspondences along the settled focus φ
  → assess_fit(mapping, Sₐ, Sₜ, context) -- sort correspondence adequacy before user validation
  → read_partition(fit_map, Sₜ) -- DERIVED split-vs-trim reading over the misfit MEMBERS (self-grounding case only — guarded; relay, no gate): misfits clustering into a coherent rival essence → Split → decompose recovery (route to the /conduct recipe) vs scattered misfits → Trim → narrow in place (/induce Narrow) vs no misfit → Hold
  → instantiate(mapping, fit_map, target) -- generate concrete examples scoped by fit map
  → validate(instantiation, user)      -- user verifies mapping adequacy
  → declare_fit_disposition(F, validation) -- record bounded residual status without a new gate; consumes a fit map, never the Option — an exit reached with Λ.fit_map = None goes through declare_exhaustion_disposition instead
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
MappingFocus = { source_scope: Set(Component), target_scope: Set(Component), relation: String, purpose: String }  -- protocol-local: the comparison focus that conditions Map before any correspondence is constructed; not a Correspondence itself — MappingFocus scopes and orients WHICH comparison Map will build, a Correspondence is one constructed pairing
φ        = MappingFocus  -- the settled comparison focus Map consumes; bound to Λ.focus once determined (φ = Λ.focus when Some), the same symbol threaded through FLOW/MORPHISM/PHASE TRANSITIONS below
forced(f) ≡ the decomposition admits exactly one value for f, with that uniqueness citable  -- an axis with a single possible value is a readback, not a selection
focus_settled(φ) ≡ ∀ f ∈ {source_scope, target_scope, relation, purpose} : determined(f) ∨ forced(f)  -- PER-FIELD settlement predicate, never a whole-object test: EVERY axis must be independently determined (explicit user language or a citable standing rule) or forced. An axis where the protocol would pick among viable alternatives is a selection, not a readback, and one such axis is enough to fire the gate.
FocusAnswer = Select(MappingFocus) ∪ Reframe(description)  -- user's answer to the mapping-focus checkpoint; Reframe may revise source_scope/target_scope as well as relation/purpose, feeding back into (Sₐ, Sₜ) decomposition
FocusChangeAnswer = ParkPriorJudgments ∪ RevalidatePriorJudgments  -- user's answer to the focus-change checkpoint; occasion-local, neither constructor establishes a standing policy. ParkPriorJudgments carries the affected judgments' standing forward, so the correspondences they addressed stay addressed under the successor focus; RevalidatePriorJudgments withdraws that standing, returning those correspondences to remaining
affected(Λ) = { r ∈ Λ.validations | r.correspondence ∈ (Λ.confirmed ∪ Λ.dismissed) }  -- the terminal judgments STANDING at the checkpoint, whichever focus each was originally made under: confirmed/dismissed carry current standing, so a judgment an earlier Park carried forward is included and stays revalidatable
focus_change_requires_disposition(Λ, φ') ≡ ∃ φ : Λ.focus = Some(φ) ∧ (φ' ≠ φ ∨ Λ.basis_dirty) ∧ affected(Λ) ≠ ∅  -- the checkpoint's guard: a stored focus exists, the comparison basis is about to change, and terminal judgments stand under the outgoing one. The basis is the domain pair AND the focus together, so comparing focus values alone is a reduced proxy — a Reframe can re-decompose (Sₐ, Sₜ) and still settle on an equal MappingFocus, which would slip past a focus-only test and let carry_over validate retained correspondences under a pair the user never authorized. Λ.basis_dirty carries that provenance. False on the initial settle path (Λ.focus = None), so the checkpoint does not fire there
return_pending(A) = confirmed := confirmed \ C ; dismissed := dismissed \ C ; remaining := remaining ∪ C ; validations := validations \ A  where C = { r.correspondence | r ∈ A }  -- RevalidatePriorJudgments state update: the affected correspondences return to remaining and their prior terminal judgments are removed
retain(A) = identity over confirmed, dismissed, remaining, validations  -- ParkPriorJudgments state update: the affected judgments keep standing, so a correspondence they addressed stays addressed under the successor focus and is not re-gated
invalidate_derived(Λ) = mappings := ∅ ; fit_map := None ; partition_reading := None  -- the ASSESSED evidence Map/AssessFit derived from (Sₐ, Sₜ, φ), discarded whenever either component of that basis changes, so no exit can present a departed basis's fit reading as the incoming one's. Λ.remaining is deliberately NOT cleared — an Esc at the focus-change checkpoint and a cap that fires before Map are both required to declare the unresolved correspondences, and a RevalidatePriorJudgments disposition writes into exactly this set. Map consumes the domain pair AND the focus, so this is evidence about that whole basis and goes whenever EITHER component changes: the pair (reframe_basis) or the comparison focus (the Λ.focus commit). The standing judgments are deliberately absent here — confirmed, dismissed and validations survive both changes, because their fate is the focus-change checkpoint's to decide. attempts is absent too: the cap is per domain pair, so a focus change inside one pair must not refund it
reframe_basis(d) = (Sₐ₀, Sₜ₀) := (Sₐ, Sₜ) ; [outgoing_domains = None: outgoing_domains := Some((Sₐ₀, Sₜ₀))] ; (Sₐ, Sₜ) := decompose(R, d, context) ; [(Sₐ, Sₜ) ≠ (Sₐ₀, Sₜ₀): pair_attempts[(Sₐ₀, Sₜ₀)] := attempts ; attempts := pair_attempts[(Sₐ, Sₜ)] if present else 0 ; invalidate_derived(Λ) ; self_grounding := self_grounding(Sₐ, Sₜ)] ; basis_dirty := ((Sₐ, Sₜ) ≠ the pair held in outgoing_domains)
carry_over(M') = mappings := M' ; confirmed := confirmed ∩ M' ; dismissed := dismissed ∩ M' ; remaining := M' \ (confirmed ∪ dismissed) ; validations := { r ∈ validations | r.correspondence ∈ M' }  -- reconstruction carry-over, applied when Map rebuilds the correspondence set into a NON-EMPTY M'
Map      = Structure-preserving mapping construction: (Sₐ, Sₜ, φ) → Set(Correspondence)   -- consumes the settled MappingFocus φ; construction is scoped and oriented by φ, not by (Sₐ, Sₜ) alone
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
ValidationRecord = { correspondence: Correspondence, example: Example, answer: V, fit_label: FitLabel, residual_disposition: FitDisposition, basis_snapshot: ((Domain, Domain), MappingFocus) }  -- basis_snapshot records the comparison BASIS in force when the user judged — the domain pair together with the focus. Mirrors the existing fit-label snapshot; correspondence types WHICH correspondence this cycle judged (Example.mapping_trace is a list and does not identify it), so a focus-change revalidation can return exactly that correspondence to remaining
R'       = Updated output with explicit mapping status (in the self-grounding case, R' additionally carries the relay PartitionReading and its routing recommendation: verdict = Split → /conduct decompose-recovery recipe; verdict = Trim → /induce Narrow; the partition reading is an annotation on the validated mapping, not a change to the terminal type)
ValidatedMapping = R' where terminalized(R', F, D_f)
terminalized(R', F, D_f) = all_addressed(R') ∧ fit_disposition_declared(F, D_f)
all_addressed(R') = Λ.mappings ≠ ∅ ∧ ∀ c ∈ Λ.mappings : confirmed(c) ∨ dismissed(c)
EarlyExit = R where user_esc  -- non-convergent early exit: current output R unmodified, partial trace over already-addressed correspondences, carried_remainder(Λ) declared as unresolved residual — the same tagged form the exhaustion exit uses, so an Esc taken mid-reconstruction (the focus-change checkpoint is Esc-able) reports the un-judged correspondences without claiming them for a basis that has not built (mapping not terminalized)
no_basis_declaration(Λ) = the statement that the basis now in force holds no constructed mapping, its fit evidence having been discarded when the basis changed, and that this domain pair has spent its reconstruction budget (Λ.attempts of max)  -- a String, which is why exhaustion_residual wraps it as a singleton while declare_exhaustion_disposition takes it bare
carried_remainder(Λ) = { (c, current) | c ∈ Λ.remaining } when Λ.mappings ≠ ∅, else { (c, superseded) | c ∈ Λ.remaining }  -- the un-judged correspondences an exhaustion or Esc exit reports, each tagged with whether the mapping it came from still stands
exhaustion_residual(Λ) = carried_remainder(Λ) ∪ (residual_issues(F) when Λ.fit_map = Some(F), else { no_basis_declaration(Λ) })
declare_exhaustion_disposition(Λ) = declare_fit_disposition(F, ∅) when Λ.fit_map = Some(F), else { issues: ∅, status: Bounded, declaration: no_basis_declaration(Λ) }
attempts_exhausted(Λ) ≡ Λ.attempts ≥ max ∧ continuing would require a further Map/AssessFit reconstruction  -- the single cap predicate every exit site reads: the cap counts reconstruction cycles, so correspondences still judgeable from the mapping already built do not trip it
AttemptExhausted = R' where attempts_exhausted(Λ) ∧ ¬terminalized(R', F, D_f) for the current pair's F when Λ.fit_map = Some(F) ; when Λ.fit_map = None invalidate_derived cleared Λ.mappings alongside it, so all_addressed(R') is false on its non-empty conjunct and non-terminalization holds with no F needed to witness it  -- non-convergent exit on the per-domain-pair attempt cap: distinct from EarlyExit (user_esc, output unmodified) and from ValidatedMapping; partial trace over already-addressed correspondences, remaining correspondences declared as unresolved residual (mapping not terminalized)

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
       [¬uncertain] Qc(zero_gap_finding) → Stop → ZeroGapConfirmation   -- zero-signal (Rule 11): Confirm → Λ.zero_gap_confirmed := true, deactivate (mapping trivially established; the flag is what later identifies this as convergence rather than an unstarted run) | Reopen(q) → uncertain := true, reopen_seed := q, proceed to Phase 1 [Tool]
Phase 1: uncertain → (Sₐ, Sₜ) → derive_focus_candidates(Sₐ, Sₜ) → candidates → settle_focus(candidates, R, context) → φₚ → [focus_settled(φₚ) ∧ ((Sₐ, Sₜ), φₚ) ∉ Λ.refuted_focuses: FocusReadback(φₚ) → φ' := φₚ | ¬focus_settled(φₚ) ∨ ((Sₐ, Sₜ), φₚ) ∈ Λ.refuted_focuses: Qc(candidate_focuses) → Stop → FocusAnswer → (Select(φₛ): φ' := φₛ | Reframe(d): reframe_basis(d) → re-enter derive_focus_candidates, recheck focus_settled)] → [Λ.focus = Some(φ) ∧ φ' ≠ φ: invalidate_derived(Λ)] → [focus_change_requires_disposition(Λ, φ'): surface(Λ.focus, φ', Λ.outgoing_domains, (Sₐ, Sₜ), affected(Λ)) → Qc(focus_change) → Stop → FocusChangeAnswer → (ParkPriorJudgments: retain(affected(Λ)) | RevalidatePriorJudgments: return_pending(affected(Λ)))] → Λ.focus := φ' ; Λ.basis_dirty := false ; Λ.outgoing_domains := None → [attempts_exhausted(Λ): D_f := declare_exhaustion_disposition(Λ) ; R' := annotate(R, unresolved_mapping_status, exhaustion_residual(Λ)) → AttemptExhausted] → attempts := attempts + 1 → Map(Sₐ, Sₜ, φ') → M → [M ≠ ∅: carry_over(M) | M = ∅: Λ.mappings := ∅] → AssessFit(M, Sₐ, Sₜ) → F → [reopen_seed = Some(q): F.open := F.open ∪ {q}] → Λ.fit_map := Some(F) → [self_grounding: PartitionRead(F, Sₜ) → PartitionReading] → [M = ∅: surface(no correspondence constructed along φ', F.missing) → Λ.refuted_focuses := Λ.refuted_focuses ∪ {((Sₐ, Sₜ), φ')} ; Λ.partition_reading := None → [attempts_exhausted(Λ): D_f := declare_exhaustion_disposition(Λ) ; R' := annotate(R, unresolved_mapping_status, exhaustion_residual(Λ)) → AttemptExhausted | ¬attempts_exhausted(Λ): derive_focus_candidates(Sₐ, Sₜ, F.missing) → re-enter focus settlement] | M ≠ ∅ ∧ Λ.remaining = ∅: integrate(∅, R, F) → (D_f, R') ; [self_grounding: R' carries PartitionReading + routing] → terminalize, skipping Phase 2 | M ≠ ∅ ∧ Λ.remaining ≠ ∅: proceed to Phase 2] [Tool]
Phase 2: (M, F) → Λ.reopen_seed := None → c ∈ Λ.remaining → I(M, F, Sₜ) → [surface Λ.focus as pre-gate relay: the settled comparison focus this instantiation is scoped by] → [self_grounding: surface PartitionReading + routing recommendation as pre-gate relay] → Qs(I, F, φ) → Stop → V  -- instantiation + validation; mapping focus and (when self-grounding) the partition reading are surfaced as relay before the gate; the prior untyped `framing` argument is now the typed MappingFocus φ [Tool]
Phase 3: V → integrate(V, R, F) → (D_f, R') → [V = Confirm: Λ.confirmed := Λ.confirmed ∪ {c} ; Λ.remaining := Λ.remaining \ {c} | V = Dismiss: Λ.dismissed := Λ.dismissed ∪ {c} ; Λ.remaining := Λ.remaining \ {c} | V = Adjust(feedback): the sets are unchanged — c stays in Λ.remaining] → [V ≠ Adjust(feedback): Λ.validations := Λ.validations ⊕ { correspondence: c, example: I, answer: V, fit_label: fit_classification(F, c), residual_disposition: D_f, basis_snapshot: ((Sₐ, Sₜ), φ) where Λ.focus = Some(φ) }] ; [self_grounding: R' carries PartitionReading + routing — Split → /conduct decompose-recovery recipe; Trim → /induce Narrow]

── LOOP ──
After Phase 3: evaluate validation result.
If V = Confirm: mark correspondence confirmed; record fit label snapshot and D_f; terminalize if all correspondences addressed and fit disposition is declared.
If V = Adjust(feedback): refine mapping with feedback → return to Phase 1. If feedback revises the comparison focus itself (relation, purpose, or scope) rather than only a correspondence detail, treat it as a focus Reframe and run reframe_basis(feedback): preserve the stored Λ.focus and carry the revision into the Phase 1 focus derivation, so the focus-change checkpoint can resolve the fate of judgments already made under the outgoing focus before Λ.focus := φ' and reconstruction.
If V = Dismiss: accept this correspondence as unresolved for this session; record fit label snapshot and D_f; terminalize if all correspondences addressed and fit disposition is declared.
The user may also declare the whole mapping sufficient at any Phase 2 as a free response rather than judging the correspondence in play: every correspondence still in Λ.remaining is dismissed with the declaration recorded against it, all_addressed then holds, and the run terminalizes as ValidatedMapping through the first clause of the precedence below — it is a convergence, not an exit, and the declaration reaches the trace so the accepted remainder is not reported as validated.
Max 3 mapping attempts per domain pair — counts Map/AssessFit reconstruction cycles: attempts := 0 on activation, and on a domain-pair change the leaving pair's count is parked and the arriving pair's is resumed (0 when that pair is new). attempts := attempts + 1 immediately before each Map/AssessFit reconstruction, after the focus checkpoints have resolved — and that one increment site is where the cap is tested, so every path reaching a reconstruction passes the same admission check. Neither focus checkpoint (FocusReadback, FocusSelector, or the focus-change disposition) consumes an attempt, and a Reframe that re-decomposes the domain pair switches the counter to the arriving pair's own count rather than charging one. A focus change inside one pair likewise leaves the count alone. A changed domain pair triggers a new focus checkpoint before the next Map.
Continue until one of the following, in this precedence: terminalized(R', F, D_f) → ValidatedMapping ; ¬terminalized(R', F, D_f) ∧ attempts_exhausted(Λ) → AttemptExhausted ; user ESC → EarlyExit.
On user ESC: present partial transformation trace over already-addressed correspondences, then declare remaining correspondences as unresolved residual.
On attempts exhausted: present the same partial transformation trace and unresolved-residual declaration the ESC path makes, terminating as AttemptExhausted rather than ValidatedMapping.
Convergence evidence: At terminalized(R', F, D_f), present transformation trace — for each record in Λ.validations, show (record.basis_snapshot → MappingUncertain(record.example.mapping_trace) → record.fit_label → record.answer), each judgment attributed to the comparison basis — domain pair and focus — that was in force when the user made it. Collapse only on the WHOLE basis: when every record shares one basis_snapshot, state it once as the common basis; when a basis change was dispositioned mid-run, the differing snapshots stay visible per record. Where terminalization was reached through a sufficiency declaration, show each correspondence dismissed by it with the declaration recorded against it, so the trace reports what was accepted un-judged instead of presenting it as validated. When D_f.status = Bounded, append the bounded residual mapping uncertainty from D_f.declaration and briefly invite the user to supply a missing Sₜ correspondent if one can be identified — a free response within the existing turn, not a new gate or post-convergence morphism. When self_grounding holds, append the PartitionReading as relay: the verdict (Split / Trim / Hold), the full Sₜ partition when verdict = Split (rival cells, core cell, trim outliers), and the routing recommendation (Split → the /conduct decompose-recovery recipe; Trim → /induce Narrow; Hold → no partition action) — a relay annotation, not a new gate. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
terminalized(R', F, D_f) = all_addressed(R') ∧ fit_disposition_declared(F, D_f)
zero_gap_converged(Λ) ≡ Λ.zero_gap_confirmed
progress(Λ) = 1 if zero_gap_converged(Λ) else 0 if |mappings| = 0 else 1 - |remaining| / |mappings|   -- An empty M that Phase 1 constructed is EmptyConstruction — zero progress, routed back to the focus checkpoint, never converged; and an active run still in Phase 0 is likewise zero, not one
narrowing(V, M) = |remaining(after)| < |remaining(before)|
sufficiency_declared = user_declares_mapping_sufficient
early_exit = user_esc

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Detect  (sense)     → Internal analysis (no external tool; also classify self_grounding — a located abstraction vs its own instances, distinct from colimit route-away)
Phase 0 ZeroGapConfirm (constitution) → present (conditional: ¬uncertain(mapping); zero-gap finding + reasoning; Confirm/Reopen — Rule 11)
Phase 1 FocusDerive (sense) → Internal analysis (no external tool; derive_focus_candidates over Sₐ, Sₜ, R, context — surfaces plausible MappingFocus candidates before any correspondence is constructed)
Phase 1 FocusReadback (extension) → TextPresent+Proceed (conditional: focus_settled(φₚ) already holds — checked PER FIELD across all four axes, each either independently determined from explicit user language or a citable standing rule, or forced to a single citable value — AND ((Sₐ, Sₜ), φₚ) ∉ Λ.refuted_focuses; relay φₚ, binding φ' := φₚ, no gate)
Phase 1 FocusSelector (constitution) → present (conditional: ¬focus_settled(φₚ) ∨ ((Sₐ, Sₜ), φₚ) ∈ Λ.refuted_focuses; candidate MappingFocus options — Select(MappingFocus) or Reframe(description); fires once per domain pair for the INITIAL focus selection before Map; the EmptyConstruction retry re-enters settlement within the same domain pair and fires it again for a refuted focus — a distinct trigger, not a second initial selection, so the once-per-pair cardinality scopes the initial selection alone; the separate focus-CHANGE disposition (Phase 1 FocusChange below) fires conditionally, whenever a revision would strand judgments already terminal under the outgoing focus; Esc key → loop termination at LOOP level, not a FocusAnswer)
Phase 1 FocusStore (track) → Internal state update (Λ.focus := φ' once settled via FocusReadback or FocusSelector, and only after any focus-change disposition has resolved. This commit is UNCONDITIONAL — it runs on every settlement including the first, where Λ.focus is still None. A changed (Sₐ, Sₜ) domain pair parks the leaving pair's attempt count and resumes the arriving pair's, and re-triggers the focus checkpoint; Λ.basis_dirty is set by comparing the current pair against the pair in Λ.outgoing_domains, so the disposition guard fires even when the successor focus compares equal, and does NOT fire when a cyclic Reframe returns to the pair the standing judgments were made under. Committing Λ.focus := φ' clears Λ.basis_dirty and Λ.outgoing_domains)
Phase 1 FocusChange (constitution) → present (conditional: focus_change_requires_disposition(Λ, φ') — the outgoing focus, the successor focus, the outgoing domain pair from Λ.outgoing_domains beside the incoming one, and the affected already-terminal judgments as pre-gate relay. ParkPriorJudgments / RevalidatePriorJudgments; Esc key → loop termination at LOOP level, not a FocusChangeAnswer)
Phase 1 FocusChangeApply (track) → Internal state update (ParkPriorJudgments → identity over confirmed/dismissed/remaining/validations; RevalidatePriorJudgments → return_pending(affected(Λ)))
Phase 1 Map/AssessFit (observe) → Read, Grep (stored knowledge extraction: domain structure and fit analysis, scoped by the settled focus φ); WebSearch (conditional: external domain knowledge)
Phase 1        (track)      → Internal state update (conditional: Λ.reopen_seed = Some(q) — fold q into F.open at fit-map assembly. The seed is cleared at Phase 2 entry, not here)
Phase 1 EmptyConstruction (extension) → TextPresent+Proceed (conditional: M = ∅ — relay that no correspondence was constructed along φ', citing F.missing as the basis; add ((Sₐ, Sₜ), φ') to Λ.refuted_focuses — keyed by the pair as well, since Map consumes both — clear Λ.partition_reading, seed candidate derivation with F.missing, then test attempts_exhausted(Λ) and either exit as AttemptExhausted or re-enter focus settlement)
Phase 1 PartitionRead (sense) → Internal analysis (no external tool; DERIVED split-vs-trim reading over F's misfit instances; self-grounding case ONLY; verdict = Split → route to the /conduct decompose-recovery recipe; verdict = Trim → /induce Narrow; basis cited from F; surfaced as pre-gate relay text within Phase 2 Qs, no separate gate)
Phase 2 Qs      (constitution)      → present (mandatory; Esc key → loop termination at LOOP level, not a Validation)
Phase 3         (track)     → Internal state update
sufficiency  (extension)       → TextPresent+Proceed (fires on sufficiency_declared: the user declares the mapping sufficient as a free response at any Phase 2. Every correspondence still in Λ.remaining moves to Λ.dismissed carrying the declaration as its recorded reason, and the run terminalizes as ValidatedMapping with D_f declared over the fit map in force. It is a free-response pathway rather than a peer option in the Phase 2 set. The convergence trace shows each dismissed correspondence with the declaration recorded against it, so what was accepted un-judged is visible rather than reported as validated)
converge     (extension)       → TextPresent+Proceed (convergence evidence trace incl. PartitionReading relay when self_grounding; proceed with validated mapping)
esc          (extension)       → TextPresent+Proceed (partial transformation trace + unresolved-correspondence declaration; terminate as EarlyExit, not ValidatedMapping)
exhausted    (extension)       → TextPresent+Proceed (conditional: attempts_exhausted(Λ); partial transformation trace + unresolved-correspondence declaration; terminate as AttemptExhausted, not ValidatedMapping)
seam         (extension)       → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares — the self-grounding PartitionReading routing (Split → the /conduct decompose-recovery recipe; Trim → /induce Narrow) — settles the next move; proceed directly to it, citing that settling source; every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, R: Text, Sₐ: Domain, Sₜ: Domain,
      focus: Option(MappingFocus),   -- the settled comparison focus Map consumes; None before the Phase 1 focus checkpoint resolves it
      outgoing_domains: Option((Domain, Domain)),   -- the domain pair the standing judgments were made under, kept by reframe_basis when it re-decomposes so the focus-change checkpoint can SHOW what changed. Cleared when Λ.focus := φ' commits
      zero_gap_confirmed: Bool,   -- set when the Phase 0 zero-gap gate returns Confirm; the provenance that identifies trivial convergence, since the state it leaves behind is indistinguishable from a run not yet started
      refuted_focuses: Set(((Domain, Domain), MappingFocus)),   -- (domain pair, focus) pairs already constructed an empty mapping; a refuted entry never relays via FocusReadback, so the retry reaches a different comparison rather than replaying the failure. Keyed by the pair as well as the focus because Map consumes (Sₐ, Sₜ, φ). Cleared on activation ONLY, so an A→B→A Reframe cannot replay a comparison already shown to produce nothing
      pair_attempts: Map((Domain, Domain) → Nat),   -- per-pair reconstruction counts parked when reframe_basis leaves a pair and restored when it returns. The cap is stated per domain pair, so a cyclic Reframe must resume that pair's count rather than receive a fresh budget
      basis_dirty: Bool,   -- transition provenance: reframe_basis sets it by comparing the pair it arrives at against outgoing_domains — the pair the standing judgments were made under — so the focus-change guard fires on a basis change even when the successor focus compares equal, and a Reframe that wanders away and returns reports none. Cleared when Λ.focus := φ' commits the new basis
      self_grounding: Bool, partition_reading: Option(PartitionReading),
      reopen_seed: Option(StructuralQuestion),   -- the zero-gap Reopen(q) question the Phase 0 scan missed — the one entry Phase 1 cannot be assumed to re-derive; folded into F.open at every Phase 1 fit-map assembly and cleared only at Phase 2 entry, so a construction that comes back empty and retries does not lose it
      mappings: Set(Correspondence), confirmed: Set(Correspondence),
      dismissed: Set(Correspondence), remaining: Set(Correspondence),
      fit_map: Option(F),   -- None until this domain pair's Map/AssessFit has run; cleared by reframe_basis on a pair change so no exit can report a fit map belonging to a pair already left
      fit_disposition: D_f, instantiations: List<Example>,
      validations: List<ValidationRecord>, attempts: Nat, active: Bool,
      cause_tag: String }
-- Invariant: mappings = confirmed ∪ dismissed ∪ remaining (pairwise disjoint) — holds in steady state, suspended across the reconstruction window that opens whenever mappings is emptied without the standing sets being rebuilt — invalidate_derived at a pair change inside reframe_basis and at a focus change just ahead of the focus-change checkpoint, and the empty-construction branch that sets Λ.mappings := ∅ after a Map that built nothing. It clears mappings with the basis that produced it while remaining, confirmed and dismissed all keep standing — whether the judgments survive a basis change is the focus-change checkpoint's to decide, not either transition's, and the un-judged remainder is what the exits inside this window report. carry_over(M) closes the window at the next non-empty Map.
-- Invariant: Λ.focus is set (via FocusReadback relay or the FocusSelector gate's FocusAnswer) before Map(Sₐ, Sₜ, φ) runs in Phase 1 — Map never runs against Λ.focus = None. Adjust(feedback) may revise the comparison focus (a focus-level Reframe) without consuming a mapping attempt, but never overwrites Λ.focus immediately: the stored focus is preserved until the Phase 1 focus-change checkpoint has resolved the fate of any terminal judgments standing under it, and only then does Λ.focus := φ' run. A changed (Sₐ, Sₜ) domain pair parks the leaving pair's attempt count, resumes the arriving pair's, and re-triggers the Phase 1 focus checkpoint before the next Map, and is no exception to the sentence above: it does not clear Λ.focus ahead of the disposition
-- Invariant: fit_partition(F, M)  -- PartitionReading is SECOND-ORDER over misfit instances, not a partition of M, so it does not enter this invariant
-- Invariant (always holds): partition_reading = Some(PartitionReading) ⟹ self_grounding. Steady-state converse (after Phase 1 computes the reading for the current F): self_grounding ⟹ partition_reading = Some(...) with verdict ∈ {Split, Trim, Hold}. Before Phase 1 computes it — Phase 0, or a Phase 1 re-entry via Adjust until recompute — partition_reading = None even under self_grounding (Pending). So None means ¬self_grounding OR not-yet-computed-for-current-F; the verdict Hold (no-misfit) stays a distinct value, never conflated with the Option None

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Structural Correspondence over Abstract Assertion**: When text contains abstract frameworks applied to a user's domain, validate that structure-preserving mappings exist between the abstract and concrete domains through explicit correspondences and concrete instantiations, rather than asserting that the abstraction applies. The purpose is to verify mapping adequacy, not to simplify the abstraction.

## Mode Activation

### Activation

See the `── R-BINDING ──` section for grounding target binding and **Rule 1** for the core principle: AI detects mapping uncertainty; validation always requires user choice via Cognitive Partnership Move (Constitution) (Phase 2). Detection is silent (Phase 0) except the conditional zero-gap confirmation gate.

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
- The concretization demand targets direction futures before a commitment, and no familiar-domain mapping carries those futures faithfully — `/preview` (DirectionUnrecognizable) territory: grounding validates a mapping that exists; preview materializes futures when none does
- Colimit-shaped input detected (`essence_sensed` over concrete instances + `locator_absent(A)`) — route to `/induce` (Periagoge) for abstraction formation; Analogia's substitution interface fits mapping validation. `locator_absent(A)` is the shared cross-protocol predicate (Periagoge formal `¬located(A)`) — from Analogia's substitution-interface vantage it surfaces as a missing source abstraction Sₐ to substitute from. **Self-grounding is the complement, NOT skipped**: when `located(A)` holds (the abstraction already has a name) and the grounding target is the abstraction against its OWN instances, the input is not colimit-shaped — keep it and run the self-grounding path (wrong-fusion detection), do not route away. The "purely concrete" skip below also does not apply, because a located abstraction IS an abstract structure under validation
- Framework selection is the primary deficit (no analytical framework chosen for the inquiry) — route to `/frame` (Prothesis); Analogia validates the mapping of an *existing* framework, Prothesis selects frameworks when none is yet chosen
- Context insufficiency is the primary deficit (factual gaps in execution context — missing facts, missing user environment) — route to `/inquire` (Aitesis); Analogia checks *relational* correspondence between domains, Aitesis checks *factual* sufficiency for execution

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| All correspondences addressed (confirmed or dismissed) | Proceed with validated mapping |
| User declares the mapping sufficient at any Phase 2 | Proceed with validated mapping: every remaining correspondence is dismissed with the declaration recorded against it, so all correspondences are addressed and the run terminalizes as ValidatedMapping |
| User Esc key | EarlyExit (not ValidatedMapping): present partial transformation trace + declare remaining correspondences as unresolved residual, then accept current output without further grounding |
| Attempt cap reached | AttemptExhausted (not ValidatedMapping): present partial transformation trace over already-addressed correspondences, then declare remaining correspondences as unresolved residual, accept current output without further grounding |

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
2b. **Derive and settle the mapping focus** `φ`: Before constructing any correspondence, surface plausible `MappingFocus` candidates (`source_scope`, `target_scope`, `relation`, `purpose`) from `R` and session context.
   - Check `focus_settled(φ)` **per field, across all four axes** — `source_scope`, `target_scope`, `relation`, and `purpose` must each be independently determined, or forced to a single citable value. Any axis you would otherwise pick among viable alternatives is a selection, and one such axis fires the gate
   - If settled by explicit user language or a citable standing rule: relay the focus via `FocusReadback` (Extension) — no gate
   - Otherwise: present the candidate focuses via `FocusSelector` (Constitution). `Select` carries the chosen `MappingFocus`; `Reframe(description)` carries no focus at all — it runs `reframe_basis`, which re-decomposes `(Sₐ, Sₜ)` and, when the domain pair actually changed, parks the leaving pair's attempt count, resumes the arriving pair's, re-classifies `self_grounding`, and invalidates the assessed evidence — the mapping, the fit map and the partition reading, all of which `Map`/`AssessFit` produced from the pair being left. The un-judged remainder stays: `carry_over` rebuilds it at the next non-empty `Map`, and until then it is what the exits report as unresolved. The same invalidation runs when the focus itself changed. It is placed immediately before the focus-change checkpoint and touches none of the sets that checkpoint writes. It then sets `Λ.basis_dirty` by comparing the current pair against the pair the standing judgments were made under — not against the pair this one step left. Refuted focuses are never cleared here: a refutation is recorded against the domain pair as well as the focus. A focus-level `Adjust` from the validation loop runs the same transition, so the two cannot drift apart
   - Do not write `Λ.focus` here. The successor focus stays uncommitted until the focus-change checkpoint below has resolved the fate of any judgments already standing
   - **Focus-change checkpoint** (conditional): when judgments already stand and the comparison basis is about to change — a different focus, or the same focus after a re-decomposed domain pair — present `ParkPriorJudgments` / `RevalidatePriorJudgments` (Constitution) before anything is committed. Show both sides of what actually moved: the outgoing and incoming focus, and the outgoing and incoming domain pair. Only after the checkpoint resolves does `Λ.focus := φ'` run
3. **Construct mapping** `M`: For each abstract component, identify the candidate concrete correspondent along the settled focus `φ`
   - If correspondence is clear: add to confirmed candidates
   - If structural mismatch detected: flag as uncertain — include evidence
   - If no correspondent exists: flag as gap — the abstract structure may not apply
   - On a rebuild, carry the standing judgments over: correspondences the new mapping still contains keep whatever status they already had, correspondences it drops leave both the terminal sets and the record list, and genuinely new correspondences arrive unjudged. Dropping the records alongside the correspondences is what keeps the convergence trace to the mapping that actually converged
4. **Assess fit** `F`: Sort the correspondence adequacy into preserved, partial, missing, overextended, and open
   - `preserved`, `partial`, and `overextended` partition the constructed correspondences `M`
   - `missing` tracks source components that do not yet have evidenced target correspondents
   - `open` is limited to structural questions whose answer could change validation of the mapping
   - Do not include general analogy ideas, background caveats, or future exploration horizons
   - When `Λ.reopen_seed` is set (the zero-gap gate returned `Reopen(q)`): `F.open := F.open ∪ {reopen_seed}`. Keep the seed set until Phase 2 is actually entered
4b. **Derive the partition reading** (self-grounding case only): when `self_grounding` holds, compute `partition_reading(F, Sₜ)` over the misfit members — the `misfit_instances(F, Sₜ)` projection: members `m ∈ Sₜ` implicated by `F.overextended` (members that violate an overextended facet's added constraint) or by `F.missing` (members lacking a facet the abstraction asserts of all members). The reading is **derived** from `F` (relay, no gate) and classifies the misfit set:
   - **Split** — the partition yields **≥2 non-empty cells** (the core cell plus rival cell(s), or ≥2 rival cells): the misfit members cluster into coherent rival essence(s), not just isolated outliers. The reading partitions `Sₜ` into three pairwise-disjoint groups: `rival_essences` (the InstanceClusters, each = member instances + the essence they support — pairwise disjoint), `core_remainder` (the members the original abstraction *genuinely fits* — `Sₜ` minus *all* misfits, so never a misfit), and `trim_outliers` (scattered/ambiguous misfits in no rival cell). The cell-candidate partition handed to `/conduct` is the rival cells **plus** the core cell (covering every fitting member); `trim_outliers` is surfaced for the checkpoint to narrow-out or place, never folded into the core. This is wrong fusion — the member set carries ≥2 essences forced under one form, so the recovery is **decompose** (the ≥2-cell count satisfies `/conduct`'s ≥2-move warrant). Route recommendation: the `/conduct` decompose-recovery recipe. Analogia *evidences* the split boundary and the full candidate partition; it does **not** constitute the cell assignment — that is the user's constitutive judgment at the recipe's boundary-checkpoint.
   - **Trim** — the partition yields **at most one non-empty cell**: either scattered misfits around an otherwise-sound core (narrow the outliers out), or a single coherent cell with an empty core (the abstraction is wholly the wrong essence and re-forms into one). The recovery is a **single-move** `/induce` (Narrow or Reorient), not a decompose — a single move does not warrant `/conduct`.
   - **Hold** — no significant misfit (`misfit_instances(F, Sₜ) = ∅`); the fusion holds, no partition action. (Distinct from `Λ.partition_reading = None`, which means the reading was never computed because the case is not self-grounding.)
   The split-vs-trim distinction is the signal the `/conduct` recipe consumes to route decompose vs leave it to `/induce` Narrow; surface it in Phase 2 and the convergence trace, never constitute it here.
5. Branch on what the reconstruction left, rather than entering Phase 2 unconditionally:
   - **`M` is empty** — construction produced no correspondence along this focus. Relay that finding with `F.missing` as its basis, mark the focus refuted so it cannot be relayed straight back, seed the next candidate derivation with `F.missing`, and — after testing the attempt cap — re-enter focus settlement, exiting as `AttemptExhausted` when the cap is already reached. Do not reset the attempt count here. Set `Λ.mappings` to the empty mapping this construction actually produced, so the fit map and the mapping describe the same build. Do not run the carry-over, though — the empty case takes a peer branch instead.
   - **`M` is non-empty and nothing remains** — the rebuilt mapping is entirely made of judgments that still stand (a Park carried them). Run the output update against the *current* fit map to produce this run's `D_f` and `R'` — including the current partition reading in the self-grounding case — then terminalize. Do not carry a prior-focus result forward, and do not re-present an already-addressed correspondence just to reach Phase 3
   - **Otherwise** — proceed to Phase 2 with the mapping candidates and fit map

**Web context** (conditional): When source or target domain knowledge exists primarily outside the codebase (external APIs, academic domains, industry standards), extend context collection to web search.
Web evidence is tagged with `source: "web:{url}"` for traceability.

**Scope restriction**: Read-only investigation only (Read, Grep, WebSearch). No test execution or file modifications.

### Phase 2: Instantiation + Validation

**Present** concrete instantiations for user validation via Cognitive Partnership Move (Constitution).

**Selection criterion**: Choose the correspondence whose validation would maximally narrow the remaining mapping uncertainty using `F`. Prioritize partial, overextended, missing-adjacent, or open-adjacent correspondences before already-preserved ones. When priority is equal, prefer the correspondence with richer structural evidence.

**Surfacing format**:

Present the mapping details as text output:
- **Mapping focus** (relay, settled at Phase 1): [source scope] compared against [target scope] along [relation], for [purpose] — the comparison basis this instantiation is constructed along
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
- On `Confirm` or `Dismiss` — never on `Adjust`, which ends no judgment — move the correspondence into the matching terminal set and log a `ValidationRecord` to validations, recording `basis_snapshot := ((Sₐ, Sₜ), φ)` for the focus `φ` in `Λ.focus` — the whole comparison basis, not the focus alone — and the judged `correspondence` at judgment time alongside the existing fit-label snapshot, so convergence traces use the fit label and comparison focus that were active when the user judged the correspondence. Adjustment feedback is not stored as a record; storing it would let superseded feedback appear in the trace as terminal validation evidence

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
| One correspondence per cycle | Present highest-priority correspondence per Phase 2 | Prevents example overload |
| Current-correspondence framing | Phase 2 surfaces the correspondence currently being validated (which mapping is in play this cycle) — a framing readout, not an `[N validated / M]` completion count | User recognizes which mapping is in play without parsing a coverage tally; granular progress stays in session |
| Attempt cap | Max 3 mapping attempts per domain pair | Prevents infinite refinement |
| Early exit | User can declare the mapping sufficient at any Phase 2 as a free response; every remaining correspondence is dismissed with the declaration recorded against it, and the run terminalizes as ValidatedMapping rather than exiting | Full control over validation depth, with what was accepted un-judged visible in the convergence trace |

## Rules

1. **AI-guided, user-validated**: AI detects mapping uncertainty; validation requires user choice via Cognitive Partnership Move (Constitution) (Phase 2)
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity — Constitution interaction requires turn yield before proceeding
3. **Domain decomposition first**: Before presenting instantiations, decompose abstract and concrete domain structures through codebase analysis (Phase 1) — ensures the mapping is structurally grounded rather than assumed
3b. **Mapping focus precedes construction, settled per field**: Before `Map` constructs any correspondence, Phase 1 derives candidate `MappingFocus` options (`source_scope`, `target_scope`, `relation`, `purpose`) and checks `focus_settled(φ)` **per field**, never as a whole-object test. `focus_settled(φ)` requires every axis — `source_scope`, `target_scope`, `relation`, `purpose` — to be determined or forced to a single citable value; any one of them being determined is not sufficient. When `focus_settled(φ)` holds — from explicit user language or a citable standing rule — relay via `FocusReadback` (Extension); otherwise gate via `FocusSelector` (Constitution) — this initial focus SELECTION fires once per domain pair, before construction — and once more within the same pair whenever a construction came back empty and its focus was refuted, which is a retry rather than a second initial selection; a separate focus-CHANGE disposition checkpoint fires later, conditionally, whenever a focus revision would strand judgments already terminal under the outgoing focus.
4. **Structural Correspondence over Abstract Assertion**: When mapping is uncertain, construct explicit correspondences rather than assert mapping validity — silence is worse than a rejected mapping
5. **Concrete instantiation required**: Every mapping presented must include at least one concrete example in the user's domain
6. **Evidence-grounded**: Every correspondence must cite specific structural elements from both abstract and concrete domains
7. **Validation respected**: User validation or dismissal is final for that correspondence while it stands, unless the user withdraws that standing at the focus-change checkpoint. A judgment's recorded basis_snapshot says which comparison basis — domain pair and focus — it was made under and is what the convergence trace reports; it does not by itself expire the judgment when the focus changes — only the user's choice at that checkpoint does
8. **Convergence persistence**: Mode active until all identified correspondences are addressed, the user declares the mapping sufficient (dismissing every remaining correspondence with the declaration recorded and terminalizing as `ValidatedMapping`), the per-domain-pair attempt cap is reached (terminating as `AttemptExhausted` with the remaining correspondences declared unresolved, not as a validated mapping), or user Esc key
9. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
10. **Convergence evidence**: Present transformation trace before declaring terminalized(R', F, D_f); per-correspondence evidence is required
11. **Zero-gap surfacing**: If the Phase 0 scan finds perfect correspondence with no mapping gaps, present this finding with reasoning for user confirmation
12. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options
13. **Gate integrity** (Safeguard tier): The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
14. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language. A reader who cannot take in what was written stops reading and answers past it; the gap widens and the gate's matching passes in practice to the AI, so plain rendering is what keeps the recognition the user's own. What gets unpacked is what is new in this session: a term appearing here for the first time, or a term the person speaking has not used — the measure is the speaker's own vocabulary rather than a fixed word list. Unpacked is the default, because only one of the two failures is visible to the reader: over-length can be recognized and named, while not-understanding cannot. SKILL.md formal-block vocabulary stays in the formal block. What the user reads is the action, observation, or question in their idiom.
15. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
16. **Protocol-native pressure map**: Phase 1 produces a CorrespondenceFitMap before validation. The map is a pre-gate support object for correspondence adequacy, not a terminal status and not generic calibration. `open` may surface bounded discovery pressure only when the missing evidence could change the user's validation of the current mapping. Missing/open residuals are declared through Phase 3 fit disposition metadata without adding a user gate.
16a. **Self-grounding and the split-vs-trim partition reading**: When the grounding target is a located abstraction against its own member instances (`self_grounding`), Analogia recognizes the case and derives a `PartitionReading` over the misfit instances. The reading is **derived from the fit map** (relay, never a gate) and is **second-order** — over the misfit instance set, not a partition of correspondences `M`. It classifies by the **non-empty cell count** of the induced partition: **Split** (≥2 non-empty cells — core + rival(s), or ≥2 rivals → wrong fusion → route to the `/conduct` decompose-recovery recipe) vs **Trim** (≤1 non-empty cell — scattered misfits around a core, or one coherent cell with empty core → single-move `/induce` Narrow/Reorient) vs **Hold** (no misfit; distinct from `Λ.partition_reading = None`, which means not-self-grounding so the reading was never computed). Analogia *evidences* the split boundary and surfaces the rival-essence cluster candidates; it does **not** constitute the cell assignment — that is the user's constitutive judgment at the `/conduct` recipe's boundary-checkpoint.
17. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
18. **Seam relay on declared continuation**: when a user-declared chain or a composition edge this SKILL.md declares (the self-grounding PartitionReading routing — Split → /conduct decompose-recovery recipe; Trim → /induce Narrow) names the next protocol, the between-protocol seam after Mode Deactivation is relay (Extension) — proceed directly, citing the settling source (the chain declaration or the named routing edge). This governs only the seam BETWEEN protocols; every Constitution gate inside this protocol and the next fires unchanged, and the user can redirect at any turn.
