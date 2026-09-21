---
name: ground
description: "Audit what an analogical mapping licenses about an account already in play: warrants each fit claim from cited evidence, not assent. Type: (MappingUncertain, AI, GROUND, R) → MappingAssessment"
---

# Analogia Protocol

Audit what a mapping licenses: construct the correspondences between an abstract structure and the target account in play, warrant each fit claim from evidence the protocol can cite, and report which of the intended inferences the mapping supports, which it blocks, and which stay undetermined. Type: `(MappingUncertain, AI, GROUND, R) → MappingAssessment`.

## Definition

**Analogia** (ἀναλογία): A dialogical act of auditing analogical inference, where AI detects that what a mapping licenses is uncertain, settles the comparison focus and the inferences at stake, constructs the correspondences, warrants each fit claim against evidence it can reach and states what would defeat it, and reports the resulting verdicts with their limits. The user's utterance supplies grounds and records what they adopt; it never promotes a claim to warranted, because assent is not evidence about the world.

```
── FLOW ──
Analogia(R) → attempts := 0 ; superseded_by := None ; refuted_focuses := ∅ ; zero_gap_confirmed := false ; fit_map := None ; assessment := None ; focus := None ; inferences := ∅ ; mappings := ∅ ; warrant := {} ; preference := {} ; checks := ∅ ; verdicts := {} ; reopen_seed := None → Detect(R) → [¬uncertain: ZeroGapRelay(finding) → proceed] → (Sₐ, Sₜ) → derive_focus_candidates(Sₐ, Sₜ) → candidates → settle_focus(candidates, R, context) → φₚ → [focus_settled(φₚ) ∧ φₚ ∉ Λ.refuted_focuses: FocusReadback(φₚ) → φ' := φₚ | ¬focus_settled(φₚ) ∨ φₚ ∈ Λ.refuted_focuses: Qc(candidates) → Stop → FocusAnswer → (Select(φₛ): φ' := φₛ | Reframe(d): [¬pair_committed(Λ): (Sₐ, Sₜ) := decompose(R, d, context) ; self_grounding := self_grounding(Sₐ, Sₜ) → re-enter derive_focus_candidates(Sₐ, Sₜ, d) | pair_committed(Λ) ∧ d replaces Sₐ or Sₜ: Λ.superseded_by := Some(d) → DomainSuperseded | pair_committed(Λ) ∧ ¬replaces: re-enter derive_focus_candidates(Sₐ, Sₜ, d)])] → [Λ.focus = Some(φ) ∧ φ' ≠ φ: invalidate_derived(Λ)] → Λ.focus := φ' → K := settle_inferences(R, φ', context) → [attempts_exhausted(Λ): Inconclusive(cap)] → attempts := attempts + 1 → Map(Sₐ, Sₜ, φ') → M → [M ≠ ∅: carry_over(M) | M = ∅: Λ.mappings := ∅] → AssessFit(M, Sₐ, Sₜ) → F → Λ.fit_map := Some(F) → CheckRead(F, K) → Λ.checks := checks(F, K) → RunChecks(Λ) → Λ.warrant := warrant_of(Λ) → Judge(K, Λ) → Λ.verdicts := A → [self_grounding: PartitionRead(F, Sₜ) → Λ.partition_reading := Some(partition_reading(F, Sₜ))] →
  [M = ∅: relay(no correspondence constructed along φ', F.missing) → Λ.refuted_focuses ∪= {φ'} ; Λ.checks := ∅ ; Λ.partition_reading := None → [attempts_exhausted(Λ): Inconclusive(cap) | ¬attempts_exhausted(Λ): derive_focus_candidates(Sₐ, Sₜ, F.missing) → re-enter focus settlement]
  | M ≠ ∅: Assemble(M, F, K, Λ) → S → Λ.assessment := Some(S) → Surface(S) → proceed → [converged(K, Λ.verdicts): MappingAssessment | ¬converged: Inconclusive(open_evidence)]]
  [a later utterance addresses the assessment] interpret_turn(u, S, context) → T → integrate_turn(T, Λ) → [T = Cite(_) ∨ T ends the basis: re-enter Phase 1] → …
-- no Constitution gate stands at the assessment surface: convergence is a reading of the evidence, so an utterance is one more channel rather than a required answer
-- the one gate is focus settlement, which Map has a hard dependency on: no default resolves which comparison to construct

── MORPHISM ──
R
  → detect(R, context)                 -- infer that what the mapping licenses is uncertain, and that a target account is in play
  → decompose(abstract, concrete)      -- identify source and target domains
  → derive_focus_candidates(Sₐ, Sₜ, R, context) -- surface plausible MappingFocus candidates (source_scope, target_scope, relation, purpose), before any correspondence is constructed
  → settle_focus(candidates, R, context) → φₚ -- bind the provisional comparison focus the settlement guard then reads; focus_settled(φₚ) is checked PER FIELD, not object-wide, and decides relay (FocusReadback) vs gate (FocusSelector)
  → settle_inferences(R, φ, context) → K -- fix what the mapping is being asked to license, before it is constructed; K is what convergence is read over, so settling it after construction would let the mapping choose its own exam
  → construct(mapping, Sₐ→Sₜ, φ)        -- build structural correspondences along the settled focus φ
  → assess_fit(mapping, Sₐ, Sₜ, context) -- sort correspondence adequacy into the fit cells; each cell placement is a CLAIM, not yet a warranted one
  → check(fit_map, K)                  -- state, for every fit claim bearing on K, what evidence within its own scope would require changing it
  → run_checks(checks, context)        -- carry out the checks this activation can reach, and record what each one met
  → warrant(fit_claims, grounds)       -- read each fit claim's warrant off the grounds actually cited, never off assent
  → judge(K, mapping, warrant)         -- per intended inference: Licensed with its limits, Blocked, or Undetermined with what is missing
  → read_partition(fit_map, Sₜ)        -- DERIVED split-vs-trim reading over the misfit MEMBERS (self-grounding case only; relay, no gate)
  → assemble(mapping, fit_map, K, warrant, checks, verdicts) -- the whole assessment: every correspondence with its fit claim, what warrants it, what would defeat it, and what the verdicts turn on
  → surface(assessment)                -- present and proceed; the reader is not asked to adjudicate what the evidence has not settled
  → interpret_turn(user_utterance, assessment, context) → T -- read a cited ground, an adoption, a withdrawal, or an open turn from the user's natural next move
  → integrate_turn(T, Λ)               -- a ground re-enters assessment; adoption and withdrawal record preference and move no warrant
  → MappingAssessment
requires: uncertain(licenses(mapping(Sₐ, Sₜ)))  -- runtime checkpoint (Phase 0)
deficit:  MappingUncertain               -- activation precondition (Layer 1/2)
preserves: content_identity(R)           -- output content invariant; assessment recorded in R'
invariant: Warrant tracks cited evidence, never assent
invariant: Judgment is the model's, the product is a field

── TYPES ──
R        = Text carrying an abstract structure and a target account already in play (source-agnostic: AI output, user analysis, or external reference)
             -- Input type: the morphism processes R uniformly; enumeration scopes the definition, not behavioral dispatch
Detect   = Licensing-uncertainty detection: R → Bool
Sₐ       = Source domain (abstract structure in R)
Sₜ       = Target domain (the account in play that the mapping is being applied to)
self_grounding(Sₐ, Sₜ) ≡ instances(Sₐ) = Sₜ   -- self-grounding case: Sₜ is the source abstraction's OWN member instances, with located(Sₐ) holding; distinct from the colimit route-away case (locator absent → /induce)
MappingFocus = { source_scope: Set(Component), target_scope: Set(Component), relation: String, purpose: String }  -- the comparison focus that conditions Map before any correspondence is constructed. Once pair_committed(Λ), the scopes range over components WITHIN (Sₐ, Sₜ) and never replace a domain
φ        = MappingFocus  -- bound to Λ.focus once determined
pair_committed(Λ) ≡ Λ.attempts > 0  -- the pair is committed once a Map has run against it. Before that a Reframe may replace (Sₐ, Sₜ) outright, because nothing yet stands on it
forced(f) ≡ the decomposition admits exactly one value for f, with that uniqueness citable
determined(f) ≡ f is fixed by explicit user language or a citable standing rule
focus_settled(φ) ≡ ∀ f ∈ {source_scope, target_scope, relation, purpose} : determined(f) ∨ forced(f)  -- PER-FIELD, never a whole-object test: one axis where the protocol would pick among viable alternatives fires the gate
FocusAnswer = Select(MappingFocus) ∪ Reframe(description)  -- Reframe's reach turns on pair_committed(Λ): before commitment it re-decomposes, after it revises the four axes within the fixed pair, and after it a description replacing a domain leaves as DomainSuperseded
Inference = { claim: String, about: Sₜ }  -- one thing the mapping is being asked to license about the target: a prediction, a permission, a limit, an expected behavior
K        = NonEmptySet(Inference)  -- what this activation is auditing, settled from R, the focus and the purpose BEFORE construction. Non-empty by construction: a mapping asked to license nothing has no audit to run, and the detect step that found no inference at stake did not reach this protocol
settle_inferences : R × MappingFocus × Context → K
Map      = Structure-preserving mapping construction: (Sₐ, Sₜ, φ) → Set(Correspondence)
M        = Set(Correspondence)
Correspondence = { abstract: Component, concrete: Component, relation: String }
Component = { name: String, structure: String }
Context  = Observable mapping context from R, session context, and cited domain evidence
AssessFit = Correspondence adequacy assessment: M × Sₐ × Sₜ × Context → F
F        = CorrespondenceFitMap { preserved, partial, missing, overextended }
preserved = Set(Correspondence) where target structure preserves source relation
partial  = Set(Correspondence) where correspondence exists but some structural dimensions lack evidence
missing  = Set(Component) from Sₐ with no evidenced Sₜ correspondent
overextended = Set(Correspondence) where source relation adds unsupported target constraints
             -- `open` is NOT a fit cell. A question whose answer could change the reading is an unmet Check below, and its unmet state is what Warrant reads; keeping it here as well would let one shortfall be carried by two structures that drift apart
FitLabel ∈ {Preserved, Partial, Overextended}
fit_classification(F, c) = Preserved if c ∈ F.preserved ; Partial if c ∈ F.partial ; Overextended if c ∈ F.overextended
fit_partition(F, M) = F.preserved ∪ F.partial ∪ F.overextended = M (pairwise disjoint)
FitClaim = (Correspondence × FitLabel) ∪ Missing(Component)  -- what AssessFit ASSERTS, and therefore what can be warranted or defeated. A cell placement is a claim the protocol made, including `preserved`: labelling a correspondence preserved asserts that the target preserves the source relation, and that assertion is as defeasible as any other
bears_on(x, K) ≡ some k ∈ K whose verdict would change if x changed  -- the relevance filter. It is what keeps the check set finite without letting the protocol choose its own exam: a claim no intended inference turns on is not checked, and a claim every inference turns on cannot be skipped
Ground   = { claim: String, basis: String }  -- one piece of cited evidence and where it comes from. basis names the source a reader can reach, so a ground the protocol cannot point at is not one
Grounds  = NonEmptySet(Ground)
Reach    = AIReachable(action: String) ∪ UserHeld(question: String)  -- who can carry a check out. AIReachable names an evidence move THIS activation can make on its own, under §Evidence loading. UserHeld names an unknown only the user holds, which is `/inquire`'s deficit rather than this protocol's, and is stated as the question to them rather than as a claim for them to adjudicate
CheckState = Unmet ∪ Survived(Grounds) ∪ Failed(Grounds)  -- Unmet is the honest default and never decays into a pass: a check nobody ran leaves its claim's warrant Open
Check    = { claim: FitClaim, scope: String, would_change_it: String, reach: Reach, state: CheckState }
             -- `would_change_it` names evidence that, WITHIN `scope`, would require the claim to change. A defeater outside the claimed scope tests nothing, which is what makes the scope field load-bearing rather than decorative
checks(F, K) = { one Check per x ∈ fit_claims(F) where bears_on(x, K) }  -- computed in EVERY case, under no guard. The builder and the checker are the same process, which is not itself disqualifying; what would be is a claim carrying no statement of what could defeat it
fit_claims(F) = { (c, fit_classification(F, c)) | c ∈ M } ∪ { Missing(x) | x ∈ F.missing }
Warrant  = Open(missing: String) ∪ Supported(Grounds) ∪ Defeated(Grounds)
             -- read off the grounds actually cited for the claim, and off nothing else. Open is not weak support; it is the absence of any. A `Supported` warrant reaches exactly as far as the scope its grounds were checked within
warrant_of(Λ) : Map(FitClaim → Warrant) = for each x ∈ domain(Λ.checks):
  Defeated(g)  when x's check is Failed(g), or a Cite whose bearing is Defeats supplied g
  Supported(g) when x's check is Survived(g), or a Cite whose bearing is Supports supplied g
  Open(what the unmet check would take)  otherwise
Verdict  = Licensed(Grounds, limits: String) ∪ Blocked(Grounds) ∪ Undetermined(missing: String)
             -- Licensed requires warranted support for every correspondence the inference rides on, and their joint consistency; `limits` states how far it reaches, because an unbounded analogy is what produces confident wrong inference. Blocked requires a decisive defeating ground. Undetermined is the absence of either and names what is missing
A        = Map(Inference → Verdict)
Judge    = K × Λ → A
converged(K, A) ≡ domain(A) = K ∧ ∀ k ∈ K : A[k] ∈ Licensed(_, _) ∪ Blocked(_)
             -- convergence is read over the INTENDED INFERENCES, not over the correspondences. A peripheral correspondence may stay Open forever without holding the audit open, and no disposition of correspondences can satisfy this predicate on its own
Preference = Map(Correspondence → Unstated ∪ Adopted ∪ Withdrawn)  -- what the user takes up, recorded because it is worth recording and consumed by nothing in `converged`. Withdrawal does not establish falsity and adoption does not establish warrant
MemberInstance = a member of Sₜ in the self-grounding case  -- self-grounding-only; the partition reading ranges over members, not over correspondences
PartitionReading = { verdict ∈ {Split, Trim, Hold}, rival_essences: Set(InstanceCluster), trim_outliers: Set(MemberInstance), core_remainder: Set(MemberInstance), basis: F }  -- DERIVED split-vs-trim reading, self-grounding case ONLY; when ¬self_grounding the protocol holds None, which is DISTINCT from verdict = Hold. SECOND-ORDER over the misfit MEMBER set, so it leaves fit_partition(F, M) intact. Relay, never a gate
InstanceCluster = { members: Set(MemberInstance), candidate_essence: String }
member_facet(F) = { facet ∈ F.missing | asserted_of_all(facet) }  -- the subset of F.missing the abstraction asserts of ALL members, so each is per-member testable
misfit_instances : F × Sₜ → Set(MemberInstance)  -- m is misfit iff (∃ c ∈ F.overextended : m violates c's added target constraint) ∨ (∃ facet ∈ member_facet(F) : ¬exhibits(m, facet))
rival_clusters(mis) : Set(MemberInstance) → Set(InstanceCluster)  -- the PAIRWISE-DISJOINT coherent rival-essence sub-groups within mis; ∅ when its members are all scattered
partition_reading(F, Sₜ) =   -- invoked ONLY under self_grounding
  let mis = misfit_instances(F, Sₜ), clusters = rival_clusters(mis),
      core = Sₜ \ mis, outliers = mis \ ⋃ { c.members | c ∈ clusters },
      cells = (if core ≠ ∅ then {core} else ∅) ∪ clusters
  in { verdict = Hold if mis = ∅ ; Split if |cells| ≥ 2 ; Trim otherwise,
       rival_essences = clusters, trim_outliers = outliers, core_remainder = core, basis = F }
  -- Split → /conduct decompose-recovery recipe; Trim → /induce Narrow; Hold → no partition action
Example  = { scenario: String, mapping_trace: List<Correspondence> }  -- one illustration per correspondence. An illustration is neither warrant nor evidence of schema induction; where the task is to induce a schema rather than audit one, that is `/explain`'s
S        = Assessment { mappings: M, fit_map: F, inferences: K, warrant: Map(FitClaim → Warrant), checks: Set(Check), verdicts: A, examples: Map(Correspondence → Example), preference: Preference, focus: MappingFocus }
Assemble = M × F × K × Λ → S
UserUtterance = the user's natural next turn after a surface
TurnReading = Cite(Ground, bearing: Supports ∪ Defeats, about: FitClaim) ∪ Adopt(Set(Correspondence)) ∪ Withdraw(Set(Correspondence), reason: String) ∪ Explore(UserUtterance)
             -- CLOSED processing forms, not a displayed answer menu, and each leads to a distinct path. Cite is the form that moves warrant, and it moves it by the evidence it carries rather than by who said it; `bearing` is a FIELD rather than two constructors because both take the same path into re-assessment. Adopt and Withdraw write preference only. Explore carries any other turn, including a question, and writes nothing.
             -- READING PREMISE (declared, not assumed): one turn is read as one act per claim it names. An utterance determinately doing different things to the same claim has departed the premise; it inhabits Explore, the premise is stated beside it, and the assessment is re-presented. The premise is the durable answer because the utterance space is not finite, and handing the classification back would restore exactly the recall the forms are kept internal to remove
T        = TurnReading
interpret_turn : UserUtterance × S × Context → T  -- indeterminate semantic reading narrowed to the four forms. Where the utterance does not settle one, name the viable readings with their cited language and continue; the specification never guesses an occupant
integrate_turn : T × Λ → Λ  -- Cite attaches its Ground to the named claim and re-enters assessment, which re-reads warrant and re-judges K; Adopt and Withdraw write Λ.preference; Explore writes nothing, and where its answer needs evidence outside the current basis it re-enters assessment too. An utterance replacing Sₐ or Sₜ sets Λ.superseded_by and ends the activation
invalidate_derived(Λ) = mappings := ∅ ; fit_map := None ; checks := ∅ ; verdicts := {} ; warrant := {} ; assessment := None ; partition_reading := None  -- everything derived from (Sₐ, Sₜ, φ), discarded when the focus changes. There is no disposition gate over it: warrant is read from evidence rather than established by the user, so a comparison the run has left simply recomputes. Λ.preference survives, being a record of what the user said rather than a reading of the evidence
carry_over(M') = mappings := M' ; preference := preference restricted to M'  -- reconstruction carry-over into a NON-EMPTY M'
max      = the attempt cap LOOP fixes per activation  -- a bound on reconstruction spend, not a sufficiency criterion
attempts_exhausted(Λ) ≡ Λ.attempts ≥ max ∧ continuing would require a further Map/AssessFit reconstruction
domain_superseded(Λ) ≡ Λ.superseded_by = Some(q)
R'       = Updated output carrying the assessment: the verdicts over K with their grounds and limits, every fit claim's warrant, and every unmet check with who can reach it (in the self-grounding case, additionally the relay PartitionReading and its routing)
MappingAssessment = R' where converged(K, Λ.verdicts)  -- the convergent close. It does NOT mean the mapping was endorsed: an audit whose every inference is Blocked with grounds is a converged assessment, and so is one whose inferences are Licensed
Inconclusive = R' where ¬converged(K, Λ.verdicts), with the reason recorded ∈ cap ∪ open_evidence ∪ Emergent(Reason)
             -- the non-convergent close, reached when some inference stays Undetermined: the reconstruction budget ran out, the evidence that would settle it is out of this activation's reach, or another reason the run names. It reports the verdicts reached, every Undetermined one with what is missing, and every unmet check. Closure is not convergence, and neither is it failure: what it owes is the named gap
DomainSuperseded = R' where domain_superseded(Λ)  -- reachable only after pair_committed(Λ). The activation's question was what THIS pair licenses, so replacing an endpoint asks a different question rather than advancing this one. Evidence crosses the seam as context; attempts, refuted_focuses, fit evidence, warrant and verdicts do NOT

── R-BINDING ──
bind(R) = explicit_arg ∪ current_output ∪ most_recent_output
Priority: explicit_arg > current_output > most_recent_output

/ground "text"                → R = "text"
/ground (alone)               → R = most recent relevant output in current session (AI or user)
"ground this..."              → R = text currently under discussion
"does this abstraction hold across its cases?" → R = a candidate fused abstraction + the instances it claims to subsume → self-grounding

If no relevant text exists: pause activation and request a grounding target before Phase 0.

── PHASE TRANSITIONS ──
Phase 0: R → Detect(R) → uncertain? ∧ classify self_grounding   -- licensing-uncertainty checkpoint (silent)
       [¬uncertain] ZeroGapRelay: present the zero-gap finding with its reasoning and proceed with R unchanged — trivial MappingAssessment, Analogia not activated [Tool]
Phase 1: uncertain → (Sₐ, Sₜ) → derive_focus_candidates → candidates → settle_focus → φₚ → [focus_settled(φₚ) ∧ φₚ ∉ Λ.refuted_focuses: FocusReadback(φₚ) → φ' := φₚ | otherwise: Qc(candidates) → Stop → FocusAnswer → (Select(φₛ): φ' := φₛ | Reframe(d): [¬pair_committed: re-decompose and re-enter | pair_committed ∧ replaces a domain: Λ.superseded_by := Some(d) → DomainSuperseded | pair_committed ∧ ¬replaces: re-enter candidate derivation], recheck focus_settled)] → [Λ.focus = Some(φ) ∧ φ' ≠ φ: invalidate_derived(Λ)] → Λ.focus := φ' → K := settle_inferences(R, φ', context) → [attempts_exhausted(Λ): → Inconclusive(cap)] → attempts := attempts + 1 → Map(Sₐ, Sₜ, φ') → M → [M ≠ ∅: carry_over(M) | M = ∅: Λ.mappings := ∅] → AssessFit(M, Sₐ, Sₜ) → F → Λ.fit_map := Some(F) → CheckRead(F, K) → Λ.checks := checks(F, K) → [reopen_seed = Some(q): fold q in as an Unmet Check] → RunChecks(Λ) → Λ.warrant := warrant_of(Λ) → Judge(K, Λ) → Λ.verdicts := A → [self_grounding: PartitionRead(F, Sₜ)] → [M = ∅: relay(no correspondence constructed along φ', F.missing) → Λ.refuted_focuses ∪= {φ'} ; Λ.checks := ∅ ; Λ.partition_reading := None → [attempts_exhausted(Λ): → Inconclusive(cap) | otherwise: derive_focus_candidates(Sₐ, Sₜ, F.missing) → re-enter focus settlement] | M ≠ ∅: → Phase 2] [Tool]
Phase 2: (M, F, K) → Λ.reopen_seed := None → Assemble(M, F, K, Λ) → S → Λ.assessment := Some(S) → Surface(S) → proceed   -- RELAY, not a gate. It presents every correspondence with its fit claim, the warrant that claim actually has, what would defeat it and whether this activation or the user can reach that, and the verdict on every intended inference with its limits. It states the reading premise and what a later utterance would change, and it does not ask the reader to adjudicate what the evidence has not settled. Whether the turn halts here is the harness's baseline, not this contract's [Tool]
Phase 3: a later utterance addressing the assessment → interpret_turn(u, S, context) → T → integrate_turn(T, Λ) → [T = Cite(g, bearing, about): attach g to `about` → re-enter Phase 1 assessment from CheckRead, re-reading warrant and re-judging K | T = Adopt(A): Λ.preference[c] := Adopted for c ∈ A | T = Withdraw(A, reason): Λ.preference[c] := Withdrawn for c ∈ A, the reason recorded ; no warrant moves and no verdict changes | T = Explore(q): [q answerable from the current basis: answer, Λ unchanged | q needs evidence outside it: re-enter Phase 1 assessment] ; [q replaces Sₐ or Sₜ: Λ.superseded_by := Some(q) → DomainSuperseded]]

── LOOP ──
The assessment pass is the unit. Each pass settles the focus and the inferences at stake, constructs the correspondences, states what would defeat each fit claim that bears on those inferences, carries out the checks this activation can reach, reads each claim's warrant off the grounds actually cited, and judges every intended inference.
A pass is followed by another when a Cite supplies a ground, when an Explore needs evidence outside the current basis, or when a focus change invalidates the derived assessment — and while the reconstruction budget holds.
Max 3 assessment passes per ACTIVATION — `attempts := 0` on activation and never refunded, incremented immediately before each Map/AssessFit reconstruction, which is the one site where the cap is tested. Neither focus checkpoint consumes an attempt, and a focus change does not refund the count.
If T = Cite(g, bearing, about): the ground attaches to the named claim and the next pass re-reads warrant and re-judges K on it. A ground that defeats one claim may change a verdict that rode on another, which is why judgment runs over the whole assessment rather than the named claim alone.
If T = Adopt or Withdraw: preference is recorded and nothing else moves. Neither is evidence about the target, and no arrangement of them satisfies `converged`.
If T = Explore(u): where u concerns the assessment, answer from the current basis and re-present it unchanged; where answering needs evidence outside that basis, carry u into the next pass. Where u REPLACES Sₐ or Sₜ, this activation's question is superseded rather than advanced: close as DomainSuperseded, report what was assessed, and seed a fresh activation from u. Evidence crosses as context; warrant and verdicts do not.
Continue until, in this precedence: domain_superseded(Λ) → DomainSuperseded ; converged(K, Λ.verdicts) → MappingAssessment ; otherwise → Inconclusive with its reason. The superseded exit leads because it says the question changed, which the budget for the old question has no bearing on.

── CONVERGENCE ──
converged(K, A): every intended inference carries a Licensed or a Blocked verdict, each with its grounds — see TYPES.
Convergence evidence: present the transformation trace — for each k ∈ K, one pair (MappingUncertain(k) → verdict(k)) showing the correspondences it rode on, the warrant each of those carried, and, for Licensed, the limits. For each fit claim that bore on K, show its label, its warrant, and its check: what would have changed it, who could reach that, and whether it was met, survived or failed. An unmet check is reported as unmet, never as a pass. A claim whose warrant is Open is named Open rather than described as weakly supported. Preference is reported separately from warrant and never as a reason for a verdict. State the committed domain pair once and the comparison focus once. When self_grounding holds, append the PartitionReading as relay with its routing. On the Inconclusive close, present the same trace with every Undetermined verdict naming what is missing and the reason the run closed. Convergence is demonstrated, not asserted.

── TOOL GROUNDING ──
-- Realization: Extension → TextPresent+Proceed; Constitution → present + Stop. One Constitution entry only: Map cannot run without a focus, and no default resolves which comparison to construct. Every other surface presents and proceeds, because warrant is read from evidence rather than supplied by an answer
Phase 0 Detect  (sense)     → Internal analysis (no external tool; also classify self_grounding)
Phase 0 ZeroGapRelay (extension) → TextPresent+Proceed (conditional: ¬uncertain; the finding with its reasoning; proceed with R unchanged)
Phase 1 FocusDerive (sense) → Internal analysis (no external tool)
Phase 1 FocusReadback (extension) → TextPresent+Proceed (conditional: focus_settled(φₚ) holds PER FIELD and φₚ ∉ Λ.refuted_focuses; relay φₚ, no gate)
Phase 1 FocusSelector (constitution) → present (conditional: ¬focus_settled(φₚ) ∨ φₚ ∈ Λ.refuted_focuses; candidate MappingFocus options — Select or Reframe. The one gate in this contract)
Phase 1 InferenceSettle (sense) → Internal analysis (no external tool; K is read from R, the focus and the stated purpose BEFORE construction, so the mapping does not choose the exam it is graded on)
Phase 1 Map/AssessFit (observe) → artifact read, artifact search (domain structure and fit analysis, scoped by φ); external fetch (conditional: external domain knowledge)
Phase 1 CheckRead (sense) → Internal analysis (no external tool; one Check per fit claim that bears on K, each naming what within its own scope would change it and who can reach that)
Phase 1 RunChecks (observe) → artifact read, artifact search, external fetch, environment run (the AIReachable checks this activation can carry out, including exercising an artifact whose behavior the claim turns on; a UserHeld check stays Unmet and is surfaced as the question it names)
Phase 1 WarrantRead (track) → Internal state update (each claim's warrant read off the grounds actually cited; an unmet check leaves Open)
Phase 1 Judge (track) → Internal state update (per inference: Licensed with limits, Blocked, or Undetermined with what is missing)
Phase 1 PartitionRead (sense) → Internal analysis (conditional: self_grounding; relay within the Phase 2 surface, no separate gate)
Phase 2 Surface (extension) → TextPresent+Proceed (mandatory; the whole assessment — correspondences, fit claims, warrant, checks with their reach and state, verdicts with their limits, and the reading premise. Presented and proceeded past; no adjudication is requested and no Constitution fires here)
Phase 3 TurnApply (track) → Internal state update (Cite attaches a ground and re-enters assessment; Adopt and Withdraw write preference only; Explore writes nothing unless its answer leaves the basis)
converge     (extension) → TextPresent+Proceed (conditional: converged(K, A); convergence evidence trace; proceed with the assessment)
inconclusive (extension) → TextPresent+Proceed (conditional: ¬converged(K, A); the same trace with every Undetermined verdict naming what is missing, every unmet check with its reach, and the reason the run closed; close as Inconclusive, not MappingAssessment)
superseded   (extension) → TextPresent+Proceed (conditional: domain_superseded(Λ); report what was assessed, declare the question superseded, seed a fresh activation; evidence crosses as context, warrant does not)
seam         (extension) → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares — the self-grounding PartitionReading routing (Split → /conduct decompose-recovery; Trim → /induce Narrow); a check set that is non-empty with every member UserHeld, whose remaining uncertainty is context only the user holds and therefore `/inquire`'s deficit; or a detection at Phase 0 that no target account is in play, which is `/explain`'s first-encounter case and not this protocol's. Proceed directly, citing the settling source)

── MODE STATE ──
Λ = { phase: Phase, R: Text, Sₐ: Domain, Sₜ: Domain,
      focus: Option(MappingFocus),   -- None before the Phase 1 focus checkpoint resolves it
      inferences: K,   -- settled once per focus, before construction; re-settled when the focus changes, because what a comparison is asked to license is scoped by the comparison
      zero_gap_confirmed: Bool,
      refuted_focuses: Set(MappingFocus),   -- focus values that already constructed an empty mapping against this activation's committed pair; cleared on activation ONLY
      self_grounding: Bool, partition_reading: Option(PartitionReading),
      reopen_seed: Option(String),   -- a question the Phase 0 scan missed, folded in as an Unmet Check at every fit-map assembly and cleared at Phase 2 entry
      mappings: Set(Correspondence),
      warrant: Map(FitClaim → Warrant), checks: Set(Check), verdicts: A,
      preference: Preference,   -- what the user adopted or withdrew. Written only by Adopt and Withdraw, read by the trace, and consumed by no terminal predicate
      fit_map: Option(F), assessment: Option(S),
      superseded_by: Option(UserUtterance ∪ description),   -- set once, never cleared
      attempts: Nat, active: Bool }
-- Invariant: warrant[x] = Supported(g) ∨ Defeated(g) ⟹ g was cited, and an assenting utterance alone never supplies one. This is the invariant the whole re-founding turns on: agreement cannot promote a claim, and disagreement cannot defeat one without a ground
-- Invariant: Λ.focus is set before Map(Sₐ, Sₜ, φ) runs — Map never runs against None. A focus change runs invalidate_derived first, and needs no disposition over what it clears, because nothing there was the user's to establish
-- Invariant: domain(Λ.checks) = { x ∈ fit_claims(F) | bears_on(x, K) } for the current F and K — recomputed whenever either changes, so a check never outlives the claim or the inference it was taken for
-- Invariant: fit_partition(F, M)  -- PartitionReading is second-order over misfit instances and Checks are second-order over fit claims; neither partitions M
-- Invariant: assessment = Some(S) ⟹ fit_map = Some(S.fit_map) ∧ S.mappings = mappings ∧ S.inferences = inferences ∧ focus = Some(S.focus)
-- Invariant: (Sₐ, Sₜ) is settled by the first Map and does not change thereafter; a replacement closes as DomainSuperseded and its successor starts a fresh budget
-- Invariant (always holds): partition_reading = Some(_) ⟹ self_grounding

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
```

## Mode Activation

`/ground` remains directly invocable. During AI-guided activation, loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind.

### Activation heuristics and exceptions

Activate where a target account is already in play and what the mapping licenses about it is open: an abstract framework being applied to a concrete case, a possible structural mismatch, or a located abstraction tested against its own members. Prior-session recall indices may seed domain decomposition; they do not settle a constitutive judgment.

The reader's first encounter with either domain is a different deficit. Where the target account is not yet in play — where what is wanted is to come to hold an account rather than to audit one — that is explanation, and it routes to `/explain` or its equivalent; this protocol stops there rather than teaching the domain it was invoked to audit. Absence of evidence that an account is in play establishes neither eligibility nor its lack; where the accumulated context does not settle it, say which reading is being used and continue.

Skip AI-guided activation when what the mapping licenses is already settled in context, the output is purely concrete, or no abstract framework is being applied. Route an unlocated, merely sensed essence over accumulated instances to `/induce`; retain a located abstraction tested against its own members as self-grounding. Framework selection and factual context insufficiency remain their own primary deficits.

### Evidence loading

Read code, configuration, documentation, and other available artifacts when the target domain is recorded there. When the relevant source or target structure exists primarily in external APIs, standards, scholarship, or industry material, fetch that evidence and keep its source address visible in the trace.

Where a claim turns on what an artifact does rather than on what it says about itself, exercise it over the case that separates the readings and cite the result. A description of behavior is evidence of the contract its author claimed, not of the behavior, so a claim resting on the second stays unwarranted until the artifact has been run.

## Protocol

### User-facing realization

Present the whole assessment in everyday language: the comparison focus; what the mapping is being asked to license; every correspondence with its fit claim, one concrete scenario, and what actually warrants that claim; and for each intended inference, whether it holds, is blocked, or is undetermined, with how far it reaches.

Beside each claim that matters, say what would change it and who can go and get that. Carry out the ones this session can reach before presenting, and put the ones only the user holds as the questions they are. An unmet check is reported as unmet. A claim with nothing behind it is named as having nothing behind it rather than described as tentative.

For self-grounding, render the derived partition reading beside the mapping as relay evidence. A split names every rival cell, the genuinely fitting core, and all unclustered outliers so no member disappears; a trim distinguishes scattered removal from one-cell reorientation; a hold states that the members preserve the abstraction.

Then state what a later turn would change, and proceed without asking for a verdict. Evidence moves the assessment: a fact, a source, a counterexample, a result from running something. Saying the mapping looks right moves nothing, and saying so is not a failing on the reader's part — it is what this surface is built not to need. Adoption and withdrawal are recorded as the reader's, kept apart from what the evidence shows, and never given as a reason a verdict came out the way it did. If the turn says one of the two domains is the wrong one, say plainly that this ends the current question rather than adjusting it, and start the new one from what was just said, carrying the evidence but none of the verdicts.

Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, material belongs to another round or trace, or phase order determines whether text belongs before or inside a relay.

### Intensity

| Level | When | Format |
|-------|------|--------|
| Light | One inference, one obvious correspondence | Brief assessment: the verdict, what warrants it, its limit |
| Medium | Several inferences or partial correspondences | Whole assessment with warrant and checks per bearing claim |
| Heavy | Complex transfer or structural mismatch | Domain decomposition, instantiations, checks carried out, and every undetermined verdict with what is missing |

## Rules

- **Warrant tracks evidence, never assent**: Read each fit claim's warrant off the grounds actually cited for it. Agreement does not promote a claim and disagreement does not defeat one without a ground. Record what the reader adopts, report it apart from the evidence, and never offer it as a reason a verdict came out as it did.
- **Convergence is over inferences, not correspondences**: Settle what the mapping is being asked to license before constructing it, and read completion over those inferences. A peripheral correspondence may stay open without holding the audit open, and no disposition of correspondences completes it.
- **Every bearing claim carries its own defeater**: For each fit claim an intended inference turns on, state what evidence, within that claim's own scope, would require it to change, and who can reach that evidence. The builder and the checker being the same process is not the defect; a claim with no stated way to be wrong is. A check nobody ran is reported unmet.
- **Audit, not instruction**: This protocol takes a target account already in play. Where the reader does not yet hold one, the deficit is explanation and routes there; do not teach the domain under audit.
- **Recognition over Recall**: Present structured alternatives with anticipatable futures only for a genuine domain decision. Keep the turn-reading constructors internal, so the reader acts in their own language rather than selecting a meta-label.
- **Round composition**: Keep each correspondence beside its nearest evidence, scenario, warrant, and next-move implication. A question about the assessment is exploration; answer it without asking the reader to classify their own turn.
- **Option-set relay test**: Present a single dominant trajectory as Extension. Constitution options remain viable under different user value weightings; shared trajectories collapse, while off-axis responses remain free-response pathways.
- **Structural evidence**: Cite the specific source and target structures supporting each correspondence, and include a concrete target-domain instantiation. Where a claim turns on an artifact's behavior, exercise the artifact and cite what it did; its own account of that behavior evidences the claim made, not the behavior.
- **Bounded reach**: State the limits of every Licensed verdict in the same breath as the verdict. A mapping presented without its breaking point produces confident wrong inference, which is the failure this protocol exists to catch.
- **Self-grounding visibility**: Surface the full member partition and its fit basis before routing split to the `/conduct` decompose-recovery recipe or trim to `/induce`; Analogia supplies the partition evidence while the downstream checkpoint constitutes cell membership.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
- **Zero-gap surfacing**: Present a zero-gap finding with its reasoning before deactivation.
