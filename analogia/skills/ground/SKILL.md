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
Analogia(R) → initialize Λ → Detect(R)
  → [¬uncertain: ZeroGapRelay(finding) → proceed with R]
  → [uncertain: Phase 1 settlement → reconstruction → evidence assessment → Phase 2 Surface(S)
     → [earlier dependency changed by observed evidence: re-enter there | otherwise: converged(K, Λ.verdicts) → MappingAssessment ; ¬converged → Inconclusive(open_evidence)]]
A later utterance addressing S → Phase 3 integrate all determinate acts → re-enter at the earliest affected Phase 1 dependency, or report preference/exploration without reassessment.
A replacement of the committed domain pair → DomainSuperseded.
An exhausted reconstruction request → Inconclusive(cap), with the last assessment identified by its own focus and inferences and the requested revision named unassessed.
Initialization and re-entry operations are specified in MODE STATE and PHASE TRANSITIONS.

── MORPHISM ──
R
  → detect(R, context)                 -- infer that what the mapping licenses is uncertain, and that a target account is in play
  → decompose(abstract, concrete)      -- identify source and target domains
  → derive_focus_candidates(Sₐ, Sₜ, R, context) -- surface plausible MappingFocus candidates (source_scope, target_scope, relation, purpose), before any correspondence is constructed
  → settle_focus(candidates, R, context) → φₚ -- bind the provisional comparison focus the settlement guard then reads; focus_settled(φₚ) is checked PER FIELD, not object-wide, and decides relay (FocusReadback) vs gate (FocusSelector)
  → settle_inferences(R, φ, context) → K -- fix what the mapping is being asked to license, before it is constructed; K is what convergence is read over, so settling it after construction would let the mapping choose its own exam
  → construct(mapping, Sₐ→Sₜ, φ)        -- build structural correspondences along the settled focus φ
  → assess_fit(mapping, Sₐ, Sₜ, context) -- sort correspondence adequacy into the fit cells; each cell placement is a CLAIM, not yet a warranted one
  → check(fit_map, K, context)         -- state, for every fit claim bearing on K, what evidence within its own scope would require changing it
  → run_checks(checks, cited, context) -- examine cited grounds at the current scope, execute reachable evidence moves, and retain the observations used
  → warrant(fit_claims, grounds)       -- read each fit claim's warrant off the grounds actually cited, never off assent
  → judge(K, mapping, warrant)         -- per intended inference: Licensed with its limits, Blocked, or Undetermined with what is missing
  → read_partition(fit_map, Sₜ, warrant, context) -- derive a member partition only where its full allocation and grouping are supported; otherwise report the missing basis (self-grounding only)
  → assemble(mapping, fit_map, K, warrant, checks, verdicts) -- the whole assessment: every correspondence with its fit claim, what warrants it, what would defeat it, and what the verdicts turn on
  → surface(assessment)                -- present and proceed; the reader is not asked to adjudicate what the evidence has not settled
  → interpret_turn(user_utterance, assessment, context) → T -- read a cited ground, an adoption, a withdrawal, or an open turn from the user's natural next move
  → integrate_turn(T, Λ)               -- preserve each discernible act; evidence and questions re-enter the earliest changed dependency, while preferences remain separate
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
FitLabel ∈ {Preserved, Partial, Overextended}
fit_classification(F, c) = Preserved if c ∈ F.preserved ; Partial if c ∈ F.partial ; Overextended if c ∈ F.overextended
fit_partition(F, M) = F.preserved ∪ F.partial ∪ F.overextended = M (pairwise disjoint)
FitClaim = (Correspondence × FitLabel) ∪ Missing(Component)  -- what AssessFit ASSERTS, and therefore what can be warranted or defeated. A cell placement is a claim the protocol made, including `preserved`: labelling a correspondence preserved asserts that the target preserves the source relation, and that assertion is as defeasible as any other
bears_on(x, K) ≡ some k ∈ K whose verdict would change if x changed  -- the relevance filter. It is what keeps the check set finite without letting the protocol choose its own exam: a claim no intended inference turns on is not checked, and a claim every inference turns on cannot be skipped
Ground   = { claim: String, basis: String, scope: String }  -- a cited observation or source, its reachable origin, and the domains, conditions and artifact state it covers
Grounds  = NonEmptySet(Ground)
Reach    = AIReachable(action: String) ∪ UserHeld(question: String)  -- who can carry a check out. AIReachable names an evidence move THIS activation can make on its own, under §Evidence loading. UserHeld names an unknown only the user holds, which is `/inquire`'s deficit rather than this protocol's, and is stated as the question to them rather than as a claim for them to adjudicate
CheckState = Unmet ∪ Survived(Grounds) ∪ Failed(Grounds)  -- Unmet is the honest default and never decays into a pass: a check nobody ran leaves its claim's warrant Open
Check    = { claim: FitClaim, scope: String, would_change_it: String, reach: Reach, state: CheckState }
             -- `would_change_it` names evidence that, WITHIN `scope`, would require the claim to change. A defeater outside the claimed scope tests nothing, which is what makes the scope field load-bearing rather than decorative
Bearing  = Supports ∪ Defeats  -- which way a cited ground bears on the claim it names
run_checks(checks, cited, context) = for each check on x, examine the grounds applicable to x at the check's current scope and execute its reachable evidence move:
  Failed(g) when g establishes the stated defeater within that scope
  Survived(g) when g supports x within that scope and no applicable decisive defeater stands
  Unmet otherwise
             -- A citation's stated bearing is assessed against its source and scope; a citation alone does not meet a check. Retain grounds obtained by execution in Λ.cited as well. Earlier grounds remain available as context, but their applicability is re-read for the current claim and scope. A UserHeld check is met by cited evidence of what the user can observe.
checks(F, K, context) = { one Check per x ∈ fit_claims(F) where bears_on(x, K) }
             -- Questions guide the derivation of these checks from the current claims. Each check still names its FitClaim, scope, defeater and reach; an unrelated question remains exploration.

fit_claims(F) = { (c, fit_classification(F, c)) | c ∈ M } ∪ { Missing(x) | x ∈ F.missing }
Warrant  = Open(missing: String) ∪ Supported(Grounds) ∪ Defeated(Grounds)
             -- read off the grounds actually cited for the claim, and off nothing else. Open is not weak support; it is the absence of any. A `Supported` warrant reaches exactly as far as the scope its grounds were checked within
warrant_of(Λ) : Map(FitClaim → Warrant) = for each x ∈ fit_claims(F):
  Defeated(g)  when x's check is Failed(g)
  Supported(g) when x's check is Survived(g)
  Open(what the unmet check would take) when x has an Unmet check
  Open(outside this audit's checked inferences) when x has no check
             -- Evidence-bearing warrant is read off check state; unassessed peripheral claims remain Open without adding checks beyond K. A Cite reaches warrant through run_checks.
Verdict  = Licensed(Grounds, limits: String) ∪ Blocked(Grounds) ∪ Undetermined(missing: String)
             -- Judge reads how the grounds of bearing fit claims affect the INFERENCE: Licensed requires support for its transfer and joint consistency, Blocked requires a decisive ground against that transfer, and Undetermined names the remaining gap. A Supported warrant affirms its fit label; supporting Overextended or Missing can therefore block a transfer. A defeated fit label alone licenses no opposite conclusion. Licensed states the supported scope in limits.
A        = Map(Inference → Verdict)
Judge    = K × Λ → A
converged(K, A) ≡ domain(A) = K ∧ ∀ k ∈ K : A[k] ∈ Licensed(_, _) ∪ Blocked(_)
             -- convergence is read over the INTENDED INFERENCES, not over the correspondences. A peripheral correspondence may stay Open forever without holding the audit open, and no disposition of correspondences can satisfy this predicate on its own
Preference = Map(Correspondence → Unstated ∪ Adopted ∪ Withdrawn)  -- what the user takes up, recorded because it is worth recording and consumed by nothing in `converged`. Withdrawal does not establish falsity and adoption does not establish warrant
MemberInstance = a member of Sₜ in the self-grounding case  -- self-grounding-only; the partition reading ranges over members, not over correspondences
PartitionReading = { verdict ∈ {Split, Trim, Hold}, rival_essences: Set(InstanceCluster), trim_outliers: Set(MemberInstance), core_remainder: Set(MemberInstance), basis: F, grounds: Grounds }  -- a supported partition of Sₜ; Hold means supported fit of every member. None denotes an unavailable reading, including an unresolved evidence basis under self-grounding. Relay, never a gate.
InstanceCluster = { members: Set(MemberInstance), candidate_essence: String }
member_facet(F) = { facet ∈ F.missing | asserted_of_all(facet) }  -- the subset of F.missing the abstraction asserts of ALL members, so each is per-member testable
misfit_instances : F × Sₜ → Set(MemberInstance)  -- m is misfit iff (∃ c ∈ F.overextended : m violates c's added target constraint) ∨ (∃ facet ∈ member_facet(F) : ¬exhibits(m, facet))
rival_clusters(mis) : Set(MemberInstance) → Set(InstanceCluster)  -- the PAIRWISE-DISJOINT coherent rival-essence sub-groups within mis; ∅ when its members are all scattered
partition_reading(F, Sₜ, warrant, context) : Option(PartitionReading) =   -- invoked ONLY under self_grounding
  None while a fit claim needed for the partition lacks Supported warrant, or the cited grounds do not establish the full member allocation and each proposed rival grouping; report that missing basis. Partition reporting consumes the audit's grounds and does not expand K or its check domain
  otherwise derive the following record from those grounds:
  let mis = misfit_instances(F, Sₜ), clusters = rival_clusters(mis),
      core = Sₜ \ mis, outliers = mis \ ⋃ { c.members | c ∈ clusters },
      cells = (if core ≠ ∅ then {core} else ∅) ∪ clusters
  in Some({ verdict = Hold if mis = ∅ ; Split if |cells| ≥ 2 ; Trim otherwise,
       rival_essences = clusters, trim_outliers = outliers, core_remainder = core, basis = F, grounds = the cited grounds supporting the allocation and grouping })
  -- Split → /conduct decompose-recovery recipe; Trim → /induce Narrow; Hold → no partition action
Example  = { scenario: String, mapping_trace: List<Correspondence> }  -- one illustration per correspondence. An illustration does not supply warrant; a task seeking an account or schema first hands off to an explanation capability
S        = Assessment { mappings: M, fit_map: F, inferences: K, warrant: Map(FitClaim → Warrant), checks: Set(Check), verdicts: A, examples: Map(Correspondence → Example), preference: Preference, focus: MappingFocus }
Assemble = M × F × K × Λ → S
UserUtterance = the user's natural next turn after a surface
TurnReading = Cite(Ground, bearing: Bearing, about: FitClaim) ∪ Adopt(Set(Correspondence)) ∪ Withdraw(Set(Correspondence), reason: String) ∪ Explore(UserUtterance)
             -- Closed processing forms for one discernible act, kept internal. A natural turn can carry several acts, including evidence and preference about the same claim. Unresolved portions inhabit Explore with their language preserved; they do not erase the turn's other determinate acts. Conflicting preference instructions without a settled ordering remain unresolved exploration rather than an invented selection.
T        = NonEmptyList(TurnReading)
interpret_turn : UserUtterance × S × Context → T
integrate_turn : T × Λ → Λ  -- accumulate all cited grounds and determinate preference updates, retain exploratory language in context, then select the earliest affected dependency as Phase 3 specifies
invalidate_derived(Λ) = mappings := ∅ ; fit_map := None ; checks := ∅ ; verdicts := {} ; warrant := {} ; assessment := None ; partition_reading := None
             -- Runs only after a reconstruction is admitted. Evidence remains in cited for scope-sensitive reassessment; the last surfaced assessment stays in the conversation with its own focus and K.
carry_over(M') = mappings := M' ; preference := preference restricted to M'  -- applies to empty and non-empty reconstructions alike

max      = the attempt cap LOOP fixes per activation  -- a bound on reconstruction spend, not a sufficiency criterion
attempts_exhausted(Λ) ≡ Λ.attempts ≥ max  -- consulted when a requested pass needs Map or AssessFit
domain_superseded(Λ) ≡ Λ.superseded_by = Some(q)
R'       = Updated output carrying the assessment: the verdicts over K with their grounds and limits, every fit claim's warrant, and every unmet check with who can reach it (in the self-grounding case, additionally the relay PartitionReading and its routing)
MappingAssessment = R' where converged(K, Λ.verdicts)  -- the convergent close. It does NOT mean the mapping was endorsed: an audit whose every inference is Blocked with grounds is a converged assessment, and so is one whose inferences are Licensed
Inconclusive = R' with reason ∈ cap ∪ open_evidence ∪ Emergent(Reason)
             -- The requested audit remains incomplete: an inference is Undetermined, or a revision needs a reconstruction beyond the cap. Report the current assessment with its own focus and K; at cap, separately identify the requested revision as unassessed. A prior converged assessment does not answer that revision.
DomainSuperseded = R' where domain_superseded(Λ)  -- reachable only after pair_committed(Λ). The activation's question was what THIS pair licenses, so replacing an endpoint asks a different question rather than advancing this one. Evidence crosses the seam as context; attempts, warrant and verdicts do not

── R-BINDING ──
bind(R) = explicit_arg ∪ current_output ∪ most_recent_output
Priority: explicit_arg > current_output > most_recent_output

/ground "text"                → R = "text"
/ground (alone)               → R = most recent relevant output in current session (AI or user)
"ground this..."              → R = text currently under discussion
"does this abstraction hold across its cases?" → R = a candidate fused abstraction + the instances it claims to subsume → self-grounding

If no relevant text exists: pause activation and request a grounding target before Phase 0.

── PHASE TRANSITIONS ──
Phase 0: R → Detect(R) → uncertain? ∧ classify self_grounding
       [no target account in play] hand off to a capability that explains the unfamiliar domain and stop this audit [Tool]
       [¬uncertain] ZeroGapRelay: present the finding with its reasoning and proceed with R unchanged; no assessment is constructed [Tool]
Phase 1: enter at the earliest affected dependency, carrying the utterance and cited grounds as context:
       Settlement: (Sₐ, Sₜ) → derive_focus_candidates → candidates → settle_focus → φₚ → [focus_settled(φₚ): FocusReadback(φₚ) → φ' := φₚ | otherwise: Qc(candidates) → Stop → FocusAnswer → (Select(φₛ): φ' := φₛ | Reframe(d): [¬pair_committed: re-decompose and re-enter settlement | pair_committed ∧ replaces a domain: Λ.superseded_by := Some(d) → DomainSuperseded | otherwise: re-enter candidate derivation]), recheck focus_settled] → K' := settle_inferences(R, φ', context) [Tool]
       Reconstruction admission: when settlement was skipped, φ' and K' retain the current focus and inferences. Before changing the current focus, K, M or F, [attempts_exhausted(Λ): Inconclusive(cap), report the requested revision separately from the last assessment | otherwise: attempts := attempts + 1]
       Reconstruction: retain M when only fit claims changed; otherwise invalidate_derived(Λ) → focus := Some(φ') ; inferences := Some(K') → Map(Sₐ, Sₜ, φ') → M → carry_over(M). In either case AssessFit(M, Sₐ, Sₜ, context) → F → fit_map := Some(F) → assessment := None ; partition_reading := None → evidence assessment [Tool]
       Evidence assessment: CheckRead(F, K, context) → checks := checks(F, K, context) → RunChecks(checks, cited, context) → checks' → checks := checks' → warrant := warrant_of(Λ) → Judge(K, Λ) → verdicts := A → [self_grounding: partition_reading := partition_reading(F, Sₜ, warrant, context)] → Phase 2 [Tool]
Phase 2: Assemble(M, F, K, Λ) → S → assessment := Some(S) → Surface(S) → proceed → [observed evidence changes an earlier dependency: re-enter there with S retained as the assessment of its stated basis | otherwise: converged(K, verdicts) → MappingAssessment ; ¬converged → Inconclusive(open_evidence)] [Tool]
Phase 3: a later utterance addressing S → interpret_turn(u, S, context) → T → integrate_turn(T, Λ):
       Each Cite(g, bearing, about) records (g, bearing) in cited[about]; each determinate Adopt/Withdraw updates the named preferences and retains the reason. Explore retains the unresolved language or question in context. Then:
       [u replaces a committed domain] superseded_by := Some(u) → DomainSuperseded
       [u revises focus or intended inferences] re-enter Phase 1 settlement before reconstruction
       [evidence or exploration changes correspondences] re-enter Phase 1 reconstruction admission, keeping the settled focus and K
       [only fit claims change] re-enter Phase 1 reconstruction admission and AssessFit, retaining M
       [only the evidence for current claims changes or needs extending] re-enter Phase 1 evidence assessment
       [preference or answerable exploration only] report the updates or answer from the current basis; refresh S from Λ when preference changed, with warrant and verdicts unchanged

── LOOP ──
The assessment pass is the unit. A first pass settles focus and K before construction; later passes resume at the earliest affected dependency in Phase 3. Read which dependency changed from the whole utterance and the evidence, including grounds discovered by an evidence move. A check may defeat a current fit claim; report that warrant in the assessment. If its evidence requires revising a dependency already passed, surface the assessed basis and re-enter that dependency under reconstruction admission before returning a result for the revision. Questions enter this reading as context; CheckRead derives only checks over current FitClaims.
Max 3 reconstructions per activation: attempts starts at zero, increases at reconstruction admission, and is never refunded. A Map or AssessFit pass uses one admission; a checks-only pass uses none. Focus settlement consumes no attempt. At cap, preserve the current assessment and distinguish the requested unassessed revision from its verdicts.
An empty M follows the same evidence assessment and surface as any other M. Missing claims can support Blocked verdicts over K, and an empty mapping neither prevents convergence nor by itself requests reconstruction.
Preferences change no warrant or verdict. A Cite or Explore may change evidence, the mapping, focus or K according to its content; the constructor alone does not choose re-entry. Evaluate all determinate acts before reassessment so one act does not discard another.
Each pass reports MappingAssessment when the requested inferences converge, otherwise Inconclusive with its missing evidence or unassessed revision. A later utterance can open another pass. Replacing a committed domain takes precedence over reassessment and cap: close as DomainSuperseded, report what was assessed, and seed a fresh activation from the utterance. Evidence crosses as context; warrant and verdicts do not.

── CONVERGENCE ──
converged(K, A): every intended inference carries a Licensed or a Blocked verdict, each with its grounds — see TYPES.
Convergence evidence: present the transformation trace — for each k ∈ K, one pair (MappingUncertain(k) → verdict(k)) showing the correspondences it rode on, the warrant each of those carried, and, for Licensed, the limits. For each checked fit claim, show its label, its warrant, and its check: what would have changed it, who could reach that, and whether it was met, survived or failed. An unmet check is reported as unmet, never as a pass. A claim whose warrant is Open is named Open rather than described as weakly supported. Preference is reported separately from warrant and never as a reason for a verdict. State the committed domain pair once and the comparison focus once. When self_grounding holds, append the supported PartitionReading with its grounds and routing, or state why its basis remains unresolved and route no partition action. On an Inconclusive close, retain that trace with every Undetermined verdict naming what is missing. At cap, identify the requested revision as unassessed and label any retained assessment by its earlier focus and K. Convergence is demonstrated, not asserted.

── TOOL GROUNDING ──
-- Realization: Extension → TextPresent+Proceed; Constitution → present + Stop
Phase 0 Detect  (sense)     → Internal analysis (no external tool; also classify self_grounding)
Phase 0 ZeroGapRelay (extension) → TextPresent+Proceed (conditional: ¬uncertain; the finding with its reasoning; proceed with R unchanged)
Phase 1 FocusDerive (sense) → Internal analysis (no external tool)
Phase 1 FocusReadback (extension) → TextPresent+Proceed (conditional: focus_settled(φₚ) holds PER FIELD; relay φₚ, no gate)
Phase 1 FocusSelector (constitution) → present (conditional: ¬focus_settled(φₚ); candidate MappingFocus options — Select or Reframe. The one gate in this contract)
Phase 1 InferenceSettle (sense) → Internal analysis (no external tool; K is read from R, the focus and the stated purpose BEFORE construction, so the mapping does not choose the exam it is graded on)
Phase 1 Map/AssessFit (observe) → artifact read, artifact search (domain structure and fit analysis, scoped by φ); external fetch (conditional: external domain knowledge)
Phase 1 CheckRead (sense) → Internal analysis (no external tool; one Check per fit claim bearing on K, each naming what within its own scope would change it and who can reach that)
Phase 1 RunChecks (observe) → artifact read, artifact search, external fetch, environment run (the AIReachable checks this activation can carry out, including exercising an artifact whose behavior the claim turns on; assess each cited ground against the claim and check scope, retain execution grounds in cited, and surface unmet UserHeld checks as their questions)
Phase 1 WarrantRead (track) → Internal state update (each claim's warrant read off the grounds actually cited; an unmet check leaves Open)
Phase 1 Judge (track) → Internal state update (per inference: Licensed with limits, Blocked, or Undetermined with what is missing)
Phase 1 PartitionRead (sense) → Internal analysis (conditional: self_grounding; supported reading within Phase 2, or its missing basis; no separate gate)
Phase 2 Surface (extension) → TextPresent+Proceed (mandatory; the whole assessment — correspondences, fit claims, warrant, checks with their reach and state, verdicts with their limits, and the effect of later evidence or preference. Presented and proceeded past; no adjudication is requested and no Constitution fires here)
Phase 3 TurnApply (track) → Internal state update (retain all determinate acts, update evidence and preference separately, and re-enter the earliest changed dependency under Phase 3; unresolved exploration retains its language in context)
converge     (extension) → TextPresent+Proceed (conditional: converged(K, A); convergence evidence trace; proceed with the assessment)
inconclusive (extension) → TextPresent+Proceed (conditional: the requested audit remains incomplete or reconstruction is capped; the same trace with every Undetermined verdict naming what is missing, every unmet check with its reach, and the reason the run closed; close as Inconclusive, not MappingAssessment)
superseded   (extension) → TextPresent+Proceed (conditional: domain_superseded(Λ); report what was assessed, declare the question superseded, seed a fresh activation; evidence crosses as context, warrant does not)
seam         (extension) → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares — the self-grounding PartitionReading routing (Split → /conduct decompose-recovery; Trim → /induce Narrow); a non-empty set of remaining unmet checks all of whose members are UserHeld, whose remaining uncertainty is context only the user holds and therefore `/inquire`'s deficit; or a detection at Phase 0 that no target account is in play, which needs a capability that explains the unfamiliar domain. Proceed directly, citing the settling source)

── MODE STATE ──
Λ = { phase: Phase, R: Text, Sₐ: Domain, Sₜ: Domain,
      focus: Option(MappingFocus), inferences: Option(K),
      self_grounding: Bool, partition_reading: Option(PartitionReading),
      mappings: Set(Correspondence), warrant: Map(FitClaim → Warrant),
      checks: Set(Check), verdicts: A, preference: Preference,
      cited: Map(FitClaim → Set(Ground × Bearing)),
      fit_map: Option(F), assessment: Option(S),
      superseded_by: Option(UserUtterance ∪ description), attempts: Nat }
Initialize optional fields to None, collections to empty, attempts to zero; bind R and the domains through detection and decomposition. Derive self_grounding from the current domain pair.
-- Invariant: Supported or Defeated warrant cites grounds that meet a check at its current scope; a user's asserted bearing alone does not establish that check state. Cite and RunChecks retain evidence in cited, which persists across reassessment for scope-sensitive use.
-- Invariant: focus and inferences are set before Map. A proposed change commits only after reconstruction admission; an exhausted proposal leaves the prior assessed basis intact and is reported as unassessed.
-- Invariant: checks contains exactly one check for each current fit claim bearing on K; questions guide derivation without adding claimless checks.
-- Invariant: fit_partition(F, M); a partition reading is second-order over members and never changes the fit cells.
-- Invariant: assessment = Some(S) ⟹ fit_map = Some(S.fit_map) ∧ S.mappings = mappings ∧ inferences = Some(S.inferences) ∧ focus = Some(S.focus)
-- Invariant: the first Map commits (Sₐ, Sₜ); later domain replacement exits as DomainSuperseded.
-- Invariant: partition_reading = Some(_) ⟹ self_grounding and the full partition has cited support. None under self_grounding carries an unresolved partition basis, never a Hold verdict.
-- Invariant: preference is updated by determinate Adopt/Withdraw acts and restricted by carry_over; it is read by the surface and no terminal predicate.

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
```

## Mode Activation

`/ground` remains directly invocable. During AI-guided activation, loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind.

### Activation heuristics and exceptions

Activate where a target account is already in play and what the mapping licenses about it is open: an abstract framework being applied to a concrete case, a possible structural mismatch, or a located abstraction tested against its own members. Prior-session recall indices may seed domain decomposition; they do not settle a constitutive judgment.

The reader's first encounter with either domain is a different deficit. Where the target account is not yet in play — where what is wanted is to come to hold an account rather than to audit one — that is explanation, and it hands off to a capability that explains the unfamiliar domain; this protocol stops there rather than teaching the domain it was invoked to audit. Absence of evidence that an account is in play establishes neither eligibility nor its lack; where the accumulated context does not settle it, say which reading is being used and continue.

Skip AI-guided activation when what the mapping licenses is already settled in context, the output is purely concrete, or no abstract framework is being applied. Route an unlocated, merely sensed essence over accumulated instances to `/induce`; retain a located abstraction tested against its own members as self-grounding. Framework selection and factual context insufficiency remain their own primary deficits.

### Evidence loading

Read code, configuration, documentation, and other available artifacts when the target domain is recorded there. When the relevant source or target structure exists primarily in external APIs, standards, scholarship, or industry material, fetch that evidence and keep its source address visible in the trace.

Where a claim turns on what an artifact does rather than on what it says about itself, exercise it over the case that separates the readings and cite the result. A description of behavior is evidence of the contract its author claimed, not of the behavior, so a claim resting on the second stays unwarranted until the artifact has been run.

## Protocol

### User-facing realization

Present the whole assessment in everyday language: the comparison focus; what the mapping is being asked to license; every correspondence with its fit claim, one concrete scenario, and what actually warrants that claim; and for each intended inference, whether it holds, is blocked, or is undetermined, with how far it reaches.

Beside each claim that matters, say what would change it and who can go and get that. Carry out the ones this session can reach before presenting, and put the ones only the user holds as the questions they are. An unmet check is reported as unmet. A claim with nothing behind it is named as having nothing behind it rather than described as tentative.

For self-grounding, render a partition only with the grounds supporting its full member allocation and grouping. A split names every rival cell, the fitting core, and all unclustered outliers; a trim distinguishes scattered removal from one-cell reorientation; a hold reports supported fit of all members. Where that basis is unresolved, name what is missing and make no partition recommendation.

Then state what a later turn would change, and proceed without asking for a verdict. Read all its determinate acts together; a changed purpose or intended conclusion reopens settlement before construction, while evidence reopens the earliest affected assessment step. Evidence moves the assessment: a fact, a source, a counterexample, a result from running something. Saying the mapping looks right moves nothing, and saying so is not a failing on the reader's part — it is what this surface is built not to need. Adoption and withdrawal are recorded as the reader's, kept apart from what the evidence shows, and never given as a reason a verdict came out the way it did. If the turn says one of the two domains is the wrong one, say plainly that this ends the current question rather than adjusting it, and start the new one from what was just said, carrying the evidence but none of the verdicts.

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
- **Self-grounding visibility**: Surface the full member partition and the grounds supporting it before routing split to the `/conduct` decompose-recovery recipe or trim to `/induce`. An unresolved basis carries no partition recommendation. Analogia supplies the partition evidence while the downstream checkpoint constitutes cell membership.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
- **Zero-gap surfacing**: Present a zero-gap finding with its reasoning before deactivation.
