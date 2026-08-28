---
name: inquire
description: "Infer context insufficiency before execution. Surfaces uncertainties through information-gain prioritized inquiry. Type: (ContextInsufficient, AI, INQUIRE, Prospect) → InformedExecution"
---

# Aitesis Protocol

Infer context insufficiency before execution through AI-guided inquiry. Type: `(ContextInsufficient, AI, INQUIRE, Prospect) → InformedExecution`.

## Definition

**Aitesis** (αἴτησις): A dialogical act of proactively inferring context sufficiency before execution, where AI identifies uncertainties across multiple dimensions (factual, coherence, relevance), collects contextual evidence via codebase exploration, classifies each uncertainty by dimension and verifiability, resolves memory-internal contradictions through evidence, records cross-domain concerns as outside its own resolution scope, and inquires about remaining uncertainties through information-gain prioritized mini-choices for user resolution.

```
── FLOW ──
Aitesis(X) → Scan(X, dimensions) → Uᵢ →
  [if Uᵢ = ∅] sufficiency_relay(reasoning) → proceed (trivial InformedExecution)
  Ctx(Uᵢ) → (Uᵢ', Uᵣ) →
  classify(Uᵢ', dimension) → [if off-diagonal] Qc → (Uᵣ'_candidates, Uₑ_candidates, Uᵢ'', Uₙ) →
  ReadOnlyVerify(Uᵣ'_candidates) → (Uᵣ' resolved | admissibility-fail → reclassify EmpiricallyObservable) →
  [if Uₑ_candidates ≠ ∅] EmpiricalObservation(Uₑ_candidates) → Uₑ →
  Q(classify_result + Uₑ + Uᵢ'', priority) → A → X' → (loop until informed)
-- Uᵣ' (Step 3 survivors = read_only_resolved): skip Phase 2; ReadOnlyVerify failures rejoin Uₑ_candidates via backward arc (detail in PHASE TRANSITIONS)
-- Uₙ (non-actionable: CrossDomain coherence + detect-only dimensions): shown in classify summary as out-of-scope
-- Uᵢ'' (factual/user-dependent or coherence/MemoryInternal/user-dependent): Phase 2 question candidates

── MORPHISM ──
Prospect
  → scan(prospect, context, dimensions)  -- infer context insufficiency (multi-dimension)
  → collect(uncertainties, codebase)     -- enrich via evidence collection
  → classify(enrichable, dimension)      -- epistemic classification (core act)
  → reclassify(MemoryInternal → Factual)  -- Coherence/MemoryInternal enters Factual resolution path
  → observe(empirically_observable, environment) -- dynamic evidence gathering (factual only)
  → surface(classify_result + observed + remaining, as_inquiry)
  → integrate(answer, prospect)
  → InformedExecution
requires: uncertain(sufficiency(X))      -- runtime checkpoint (Phase 0)
deficit:  ContextInsufficient            -- activation precondition (Layer 1/2)
preserves: task_identity(X)              -- task intent invariant; prospect context mutated (X → X')
invariant: Evidence over Inference over Detection

── TYPES ──
X        = Prospect for action (source-agnostic: task execution, analysis, investigation, or any purposeful action requiring context)
             -- Input type: morphism processes X uniformly; enumeration scopes the definition, not behavioral dispatch
Scan     = Context sufficiency scan: X → Set(Uncertainty)
Uncertainty = { domain: String, description: String, context: Set(Evidence) }
Evidence = { source: String, content: String }                -- collected during Ctx
Priority ∈ {Critical, Significant, Marginal}
Uᵢ       = Identified uncertainties from Scan(X)
Ctx      = Context collection: Uᵢ → (Uᵢ', Uᵣ)
Uᵢ'      = Enriched uncertainties (evidence added, not resolved)
Uᵣ       = Context-resolved uncertainties (resolved during collection)
Q        = Inquiry (Constitution interaction), ordered by information gain
A        = User answer ∈ {Provide(context), Point(location), Dismiss, Unknown(Partial)}
             -- Unknown(Partial) = user declines certainty; Phase 3 auto-promotes via Cite-or-observe tiebreaker (UserTacit → next-preferred
             -- untried EvidenceSource in ValidSources(v)) and re-enters Phase 1 for reclassification; both arcs formalized in PHASE TRANSITIONS
Ac         = User coherence classification ∈ CoherenceType     -- Phase 1 Qc gate answer type
X'       = Updated prospect (context-enriched)
InformedExecution = X' where remaining = ∅
-- Layer 1 (epistemic)
Dimension    ∈ {Factual, Coherence, Relevance} ∪ Emergent(Dimension)
               -- open set; external human communication excluded
Observability ∈ {StaticObservation, DynamicObservation, BeliefVerification}
               -- exists(fact, env) sub-modes
-- Layer 2 (tool implementation, Factual and Coherence/MemoryInternal fibers — fibration structure)
Verifiability  ∈ {ReadOnlyVerifiable, EmpiricallyObservable, UserDependent}
EvidenceSource ∈ {UserTacit, Instrumentation, CodeDerivable, CanonicalExternal}
                 ∪ Emergent(EvidenceSource)
               -- open set symmetric with Dimension; Emergent accumulator for novel channels
               -- (TestSuite, AsyncComms, HypomnesisIndex, RuntimeObservability, etc.)
               -- Emergent base promotion under variation-stable observed use
Claim(u)       = { referent: String, scope: String, expected_source_kind: EvidenceSource }
               -- expected_source_kind names the evidence CHANNEL a claim requires (which source-kind), a distinct axis from a claim's semantic category
EvidenceRef(e) = { source: String, source_kind: EvidenceSource, referent: String, scope: String, observed_at: String, content: String }
               -- interpretive extraction over Evidence (base type {source, content}): source_kind/referent/scope are inferred from content, NOT deterministic normalization
               -- this extraction exercises epistemic authority — a mis-extraction surfaces at the Phase 2 classify summary (support_integrity:unverified), not treated as deterministic relay
provenance_coupled(u, e) =
  referent(EvidenceRef(e)) = referent(Claim(u))
  ∧ authorizes(source_kind(EvidenceRef(e)), expected_source_kind(Claim(u)))   -- grantor = evidence's source_kind; claim side = expected_source_kind
  ∧ scope_subsumes(scope(EvidenceRef(e)), scope(Claim(u)))
authorizes : EvidenceSource × EvidenceSource → Bool   -- self-contained (no shared cross-protocol relation)
  authorizes(s, expected) ≡ s = expected
               -- reflexive base: a source-kind authorizes a claim expecting that same kind.
               -- cross-kind authorization (one kind standing in for another) is NOT granted here → defaults to non-authorizing; a richer policy
               --   matrix is a documented future extension, deliberately deferred to stay minimal-structural (deferral, not a silent gap).
scope_subsumes : String × String → Bool   -- path/tag-prefix subsumption: broader scope contains narrower (reused by coverage below)
ValidSources : Verifiability → ℘(EvidenceSource)
  ValidSources(ReadOnlyVerifiable)    = {CodeDerivable, UserTacit, CanonicalExternal} ∪ Emergent(EvidenceSource)
  ValidSources(EmpiricallyObservable) = {Instrumentation, UserTacit}                  ∪ Emergent(EvidenceSource)
  ValidSources(UserDependent)         = {UserTacit}                                    ∪ Emergent(EvidenceSource)
  -- Emergent(EvidenceSource) fallback-admissible when no base element fits the observed channel
  -- cost-ordering tiebreaker (ascending): CodeDerivable < CanonicalExternal < Instrumentation < UserTacit
  -- default selects lowest-cost valid source; override requires cite per Cite-or-observe rule
CoherenceType ∈ {MemoryInternal, CrossDomain}
               -- 2D: Scope(Same/Cross) × Resolution(Evidence/Structure); off-diagonal → Gate
Scope      ∈ {Same, Cross}
Resolution ∈ {Evidence, Structure}
off_diagonal(s, r) = ¬((s = Same ∧ r = Evidence) ∨ (s = Cross ∧ r = Structure))
classify   = Uᵢ' → Σ(d: Dimension). Fiber(d)
             where Fiber(Factual)       = Σ(v: Verifiability). {s: EvidenceSource | s ∈ ValidSources(v)}
                   Fiber(Coherence)     = CoherenceType
                   Fiber(Relevance)     = Unit    -- detect only
                   Fiber(Emergent(_))   = Unit    -- detect only (default; refinable per discovered dimension)
             -- 2-layer model = Grothendieck fibration: Layer 2 exists over Factual fiber;
             --   Factual fiber is itself a dependent sum — pair (v, s) where s is a SINGLE chosen element of ValidSources(v)
             --   (subset type {s | s ∈ ValidSources(v)}, not the power-set element itself)
             --   EvidenceSource choice within ValidSources(v) routes resolution channel
             -- Coherence fiber classifies into CoherenceType, where MemoryInternal instances enter the Factual resolution path
             --   (and inherit EvidenceSource via Factual reclassification)
             -- CrossDomain/Relevance/Emergent → detect + show as out-of-scope in classify summary (no EvidenceSource tag)
             -- ReadOnlyVerifiable direct-resolve admissibility = coverage ∧ support_integrity (both required):
             --   coverage         : scope_subsumes(scope(evidence), scope(claim))   -- rebutting axis: is the whole claim covered?
             --   support_integrity: ∃ e ∈ context(u): provenance_coupled(u,e)
             --                      ∧ link(evidence → asserted behavior/current reality) is verified, not silently desynced
             --                      -- undercutting axis: does this source-kind/referent/scope authorize this claim?
             --   currency ⊂ support_integrity (temporal sub-case): freshness is necessary, not sufficient — a current-but-unenforced
             --     artifact (comment/doc asserting behavior with no enforcement channel) is current yet support-unlinked → fails support_integrity
             --   failure of either axis (¬coverage = coverage_gap; ¬support_integrity = support_integrity_unverified) → reclassify EmpiricallyObservable
             --   (rebutting/undercutting framing per Pollock: two kinds of defeater — not asserted exhaustive)
support_integrity(u) ≡ (∃ e ∈ context(u): provenance_coupled(u, e)) ∧ evidence_behavior_linked(u)    -- undercutting axis; formal predicate (was comment-only)
               -- context(u) = evidence accessor over base Uncertainty.context: Set(Evidence) (existing field, not new)
               -- evidence_behavior_linked(u): evidence→behavior link verified (breaks-on-change), not silently desynced; currency ⊂ this (temporal sub-case)
ReadOnlyAdmissible = { u : ReadOnlyVerifiable | coverage(u) ∧ support_integrity(u) }
                   -- refinement over ReadOnlyVerifiable (NOT a new Verifiability constructor): the subset of ReadOnlyVerifiable
                   --   items admissible for Step 3 direct resolution. coverage(u) ≡ ¬coverage_gap(u); support_integrity(u) ≡ ¬support_integrity_unverified(u)
                   --   where support_integrity(u) now requires ∃ e: provenance_coupled(u,e) ∧ link-verified — a refinement INTO support_integrity (not a third conjunct): a value's authority is bound to the source × claim pair it actually supports.
                   --   Failure of either predicate → reclassify EmpiricallyObservable (backward arc T4). Step₃ ReadOnlyVerify takes the ReadOnlyVerifiable-classified candidate set (Uᵣ'_candidates, incl. support_integrity-undetermined items) and enforces this predicate at resolution time; ReadOnlyAdmissible characterizes the resolution survivors (= Uᵣ'), NOT a Step-3 input pre-filter.
ObservationSpec = { setup: Action, execute: Action, observe: Predicate, cleanup: Action }
EmpiricalObservation = (Uᵢ', ObservationSpec) → Uₑ  -- dynamic evidence gathering
Uᵣ'_candidates = { u ∈ Uᵢ' : classify(u) = (Factual, (ReadOnlyVerifiable, s)) ∧ s ≠ UserTacit ∧ s ∉ Emergent(EvidenceSource) }  -- Step 2 output → Step 3 input
               -- includes support_integrity-undetermined items pending resolution-time enforcement; symmetric with Uₑ_candidates (transient set, NOT a MODE STATE partition bucket)
               -- Step 3 partitions this set: survivors → Uᵣ' (read_only_resolved); admissibility failures → backward arc → EmpiricallyObservable
Uᵣ'        = Read-only verified uncertainties    -- Step 3 survivors only (= ReadOnlyAdmissible) → read_only_resolved; resolved (no Phase 2); excludes items routed via UserTacit override per Cite-or-observe rule
Uₑ_candidates = { u ∈ Uᵢ' : classify(u) = (Factual, (EmpiricallyObservable, s)) ∧ s ≠ UserTacit ∧ s ∉ Emergent(EvidenceSource) }
              -- Phase 1 observation checkpoint; excludes Cite-or-observe cite-based UserTacit overrides (those route directly to Uᵢ'')
Uₑ         = Empirically observed uncertainties    -- evidence attached, proceeds to Phase 2
             -- evidence is positive (a differentiating result) or negative (a null signal, or an observation that ran
             --   without resolving within its execution budget). A budget overrun encountered DURING execution is an
             --   observation outcome landing here — not an escape; escapes are pre-observation only (see EscapeCondition)
Uᵢ''       = Remaining user-dependent uncertainties
             -- Includes: (a) Factual/UserDependent items
             --           (b) Factual/EmpiricallyObservable with EvidenceSource = UserTacit (Cite-or-observe cited override)
             --           (c) Factual/ReadOnlyVerifiable with EvidenceSource = UserTacit (Cite-or-observe cited override)
             --           (d) reclassified Coherence/MemoryInternal landing in any of (a)-(c) above
             --           (e) any Factual(v) with s ∈ Emergent(EvidenceSource) (channel unvalidated by definition; awaits Phase 2 Qs_emergent_channel confirmation)
             -- Phase 2 question candidates
Uₙ         = Non-actionable detected uncertainties  -- Fiber(Coherence) = CrossDomain or Fiber(d) = Unit; shown in classify summary as out-of-scope
Action     = capability call sequence (artifact write, environment run)
EscapeCondition ∈ {EnvironmentMutation, RiskElevated}
                    -- maps to Cite-or-observe escape hatches; logged in observation_skips
                    -- pre-observation judgments only: each names a reason the observation MUST NOT run at all.
                    --   Duration is not such a reason and is not a member: running and hitting the budget yields
                    --   evidence (the budget-exhausted outcome in Step 4), while declining to run yields none
branching_factor : Uncertainty → ℕ
  branching_factor(u) = |distinct_resolution_paths(u) ∪ distinct_side_effect_branches(u)|
    -- counts mutually-exclusive resolution postures (e.g., in-place fix / redesign / offload / defer)
    -- UNION side-effect branch count (e.g., N downstream mutations per posture); both flavors summed
    -- per-uncertainty count must be citable in Phase 2 classify summary when Divergence-bounding exception is invoked

── PHASE TRANSITIONS ──
Phase 0: X → Scan(X, dimensions) → Uᵢ?                        -- context sufficiency checkpoint (silent)
       [Uᵢ = ∅] sufficiency_relay(reasoning) → proceed          -- zero-signal: present the sufficiency finding as relay text; trivial InformedExecution (remaining = ∅), Aitesis not activated
Phase 1: Uᵢ → Step₁ Ctx(Uᵢ) → (Uᵢ', Uᵣ) →                    -- Step 1: context collection [Tool]
         Step₂ classify(Uᵢ', dimension) → (Uᵣ'_candidates, Uₑ_candidates, Uᵢ'', Uₙ) → -- Step 2: epistemic classification (core act); Uₙ = non-actionable
         [if off-diagonal(scope, resolution)] Qc(scope_assessment, resolution_assessment) → Stop → Ac  -- Coherence 2D Constitution interaction [Tool]
         -- evaluation order: Qc resolves before Uₑ_candidates computation; reclassified MemoryInternal/EmpiricallyObservable enters Uₑ_candidates
         Step₃ ReadOnlyVerify(Uᵣ'_candidates) →     -- Step 3: read-only verification (CodeDerivable + CanonicalExternal); enforces admissibility (coverage ∧ support_integrity) at resolution time over the candidate set (incl. support_integrity-undetermined items) — survivors = ReadOnlyAdmissible = Uᵣ' (resolve directly, read_only_resolved); failures take the backward arc below [Tool]
           [if support_integrity_unverified(u) ∨ coverage_gap(u)] reclassify(u, EmpiricallyObservable) → goto Step₂  -- backward arc (T4): support-integrity/coverage failure re-enters classification (staleness = temporal sub-case of support_integrity_unverified)
         [if Uₑ_candidates ≠ ∅] Step₄ EmpiricalObservation(Uₑ_candidates) → Uₑ  -- Step 4: dynamic evidence gathering [Tool]
Phase 2: Qs(classify_result + Uₑ + Uᵢ''[cluster], framing) → Stop → A          -- uncertainty surfacing [Tool]; cluster = one coherent cluster (size ≤ 4)
Phase 3: A → integrate(A, X) → X'                               -- prospect update (track: mutates Λ.X)
         [if A = Unknown(Partial) ∧ some valid source for u is untried] auto_promote(u, next-preferred untried source in ValidSources(v)) → goto Phase 1  -- backward arc (T2): a tried source is not re-selected
         [if A = Unknown(Partial) ∧ no valid source for u is untried] u stays in Λ.remaining → Phase 2  -- promotion has no target; disposition is the user's, not an AI dismissal

── LOOP ──
After Phase 3: re-scan X' for remaining or newly emerged uncertainties.
New uncertainties accumulate into uncertainties (cumulative, never replace).
If Uᵢ' remains: return to Phase 1 (collect context for new uncertainties).
If remaining = ∅: proceed with execution.
User can declare the context sufficient at Phase 2 (sufficiency_declared): the remaining uncertainties are dismissed with the declaration recorded and the loop converges.
Continue until: informed(X').
Convergence evidence: At remaining = ∅, present transformation trace — for each u ∈ (Λ.context_resolved ∪ Λ.read_only_resolved ∪ Λ.empirically_observed ∪ Λ.user_responded), show (ContextInsufficient(u) → resolution(u)). Convergence is demonstrated, not asserted. The trace additionally declares every u ∈ Λ.non_factual_detected as detected-but-outside-scope: these resolve nowhere, so no transformation pair exists for them. The declaration is unconditional and does not gate — the all-non-actionable path (actionable(Λ) = ∅) converges without reaching a Phase 2 question, so this trace is the only surface carrying the detections there.

── CONVERGENCE ──
actionable(Λ) = uncertainties \ non_factual_detected       -- Fiber(Factual) + Fiber(Coherence)=MemoryInternal uncertainties
informed(X') = remaining = ∅                                -- non_factual_detected does not block convergence
progress(Λ) = 1 if |actionable(Λ)| = 0 else 1 - |remaining| / |actionable(Λ)|   -- |actionable| = 0 (zero-signal or all-nonactionable trivial convergence) is fully converged, not undefined; denominator excludes non-actionable (CrossDomain + detect-only dimensions)
narrowing(Q, A) = |remaining(after)| < |remaining(before)| ∨ context(remaining(after)) ⊃ context(remaining(before))
sufficiency_declared = user_declares_sufficient   -- consumed by the sufficiency transition in TOOL GROUNDING: every u ∈ Λ.remaining moves to Λ.dismissed with the declaration recorded, so remaining = ∅ and informed(X') holds. A success-flavoured event lands on the SUCCESS terminal, which is where the per-item Dismiss it generalizes already lands

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Scan    (sense)       → Internal analysis (no external tool)
Phase 0 sufficiency_relay (extension) → TextPresent+Proceed (Uᵢ = ∅: present the sufficiency finding with reasoning; proceed with X unchanged, trivial InformedExecution)
Phase 1 Ctx     (observe)     → artifact read, artifact search (stored knowledge extraction: codebase, memory, references); external fetch, external fetch (conditional: CanonicalExternal channel — RFCs, vendor API docs, standards; `source: "web:{url}"` tag + staleness guard via codebase version cross-check); environment run (conditional: VersionControlHistory channel — read-only commit-log queries via subprocess (content pickaxe, message search, temporal range); `source: "history:{ref}"` tag; collection-only — ref-type staleness classification handled per Phase 1 Step 1 staleness rule)
Phase 1 Classify (observe)    → Internal analysis (multi-dimension assessment); artifact read, artifact search (stored knowledge cross-reference analysis)
Phase 1 Qc      (constitution)        → present (conditional: Coherence 2D off-diagonal Constitution interaction; fires only when scope ≠ resolution assessment; user classifies coherence type as MemoryInternal or CrossDomain)
Phase 2 Qs_emergent_channel (constitution) → present (specialization of Phase 2 Qs: channel unvalidated by definition; regardless of parent Verifiability, the classify summary records the observed channel description and awaits user confirmation before proceeding; confirmation rides the parent A coproduct — Point(location) designates/validates the authoritative channel, Provide(context) supersedes it, Dismiss declines it (proceed-with-assumption), Unknown(Partial) leaves the item unresolved — no answer auto-resolves the item through the unconfirmed channel; the answer is recorded in Λ.channel_validations — a channel already Point-validated this session skips this gate only (prior in-session user decision); each later item on that channel still takes the claim-specific Phase 1 evidence pass against the validated channel, per the Point(location) semantics (record location, resolve via next Phase 1 iteration) — never blanket-resolved as user-responded)
Phase 2 Qs_staleness (constitution) → present (specialization of Phase 2 Qs: when staleness cannot be verified; require BOTH `staleness:unverified` tag — the temporal sub-case of the general `support_integrity:unverified` tag — AND classify summary surfacing — no silent escalation path; publishing authority claim warrants user awareness)
Phase 1 Observe (transform)   → artifact write, environment run, artifact read (dynamic evidence gathering, Factual only); cleanup via environment run
Phase 2 Qs      (constitution)        → present (mandatory: classify result + uncertainty surfacing; user provides context judgment on insufficiency; an item whose promotion is spent is marked as such in the classify summary, so its reach is recognized rather than recalled)
Phase 3         (track)       → Internal state update
converge     (extension)       → TextPresent+Proceed (convergence evidence trace, including the out-of-scope declaration for every Λ.non_factual_detected item; proceed with informed execution)
sufficiency  (extension)       → TextPresent+Proceed (fires on sufficiency_declared: the user declares the context sufficient as a free response at any Phase 2. Every uncertainty still in Λ.remaining moves to Λ.dismissed carrying the declaration as its recorded reason, so remaining = ∅ and informed(X') holds — the run converges as InformedExecution, not as an exit. It is a free-response pathway rather than a peer option in the Phase 2 set because declaring the WHOLE inquiry sufficient produces no trajectory on the per-item axis those options occupy: it disposes of the axis instead of taking a position on it. Present the dismissed set with the declaration recorded against each, so the convergence trace shows what was accepted unresolved rather than asserting resolution)
seam         (extension)       → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol settles the next move; proceed directly to it, citing that settling source; every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, X: Prospect, uncertainties: Set(Uncertainty),
      dimensions_detected: Set(Dimension),                           -- π₁ image of classify_results
      classify_results: Map(Uncertainty, Σ(d: Dimension). Fiber(d)), -- fibration-typed classification
      context_resolved: Set(Uncertainty),  -- Uᵣ from TYPES
      read_only_resolved: Set(Uncertainty), -- Uᵣ' from TYPES
      empirically_observed: Set(Uncertainty), -- Uₑ from TYPES
      non_factual_detected: Set(Uncertainty), -- Uₙ from TYPES; Fiber(Coherence) = CrossDomain or Fiber(d) = Unit, classify summary display
      user_responded: Set(Uncertainty),
      remaining: Set(Uncertainty), dismissed: Set(Uncertainty),
      history: List<(Uncertainty, A)>, observation_history: List<(ObservationSpec, Result, Evidence)>,
      observation_skips: List<(Uncertainty, EscapeCondition, String)>,  -- audit trail for Cite-or-observe escape hatches (pre-observation only — an observation that ran and overran its budget is recorded in observation_history, never here)
      source_choice_overrides: List<(Uncertainty, EvidenceSource, String)>,  -- audit trail for Cite-or-observe cite-based UserTacit overrides
      channel_validations: List<(Uncertainty, EvidenceSource, A)>,  -- Qs_emergent_channel answers recorded at Phase 3; audit trail feeds variation-stable observed use for (cross-session) base promotion; a channel Point-validated this session does not re-enter the gate this session
      active: Bool,
      cause_tag: String }
-- Invariant: uncertainties = context_resolved ∪ read_only_resolved ∪ empirically_observed ∪ non_factual_detected ∪ user_responded ∪ remaining ∪ dismissed (pairwise disjoint)
-- Note: observation_skips and source_choice_overrides are audit logs orthogonal to the partition —
--       observation_skips: logged when EmpiricallyObservable is reclassified to UserDependent via Cite-or-observe escape conditions
--                          (pre-observation only — the observation never ran; an observation that ran without resolving
--                           within its budget lands in Uₑ as negative evidence and is recorded in observation_history)
--       source_choice_overrides: logged when UserTacit is selected over cheaper EvidenceSource with cited dominance basis (Cite-or-observe dominance); audit trail supports variation-stable observed use for cost-ordering

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
```

## Mode Activation

`/inquire` remains directly invocable. During AI-guided activation, loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind.

### Prior-decision scan

When a prospect touches architecture decisions, API or protocol design, persisted state schemas, or user-facing behavior commitments, begin Phase 1 Ctx with a bounded scan over persistent memory and project-local prior-decision history even without an explicit reference. Prior-session recall indices may seed Phase 0; they do not settle a constitutive judgment, and current evidence verification governs resolution.

### Activation exceptions

Skip AI-guided activation when the user explicitly requests proceeding without context verification or when no prospect exists to verify. A dismissed `(domain, description)` pair stays skipped for the current session.

### Accumulation signal

When `observation_skips` across at least three sessions cluster around one `EscapeCondition` with a consistent rationale, revisit the Verifiability boundary. Apply the same threshold to a recurring non-factual `Emergent(Dimension)`; a promoted fiber defaults to `Unit` unless the observations establish internal classification structure.

## Protocol

### User-facing realization

At Phase 2, render the current uncertainty cluster in everyday language. Place each judgment beside its cited basis, the evidence collected, what remains uncertain, and the implication that matters for the next move. Keep the classification open to free-response correction. Present the materialized `A` options with anticipatable differential futures, state the assumption carried by `Dismiss`, then yield the turn.

Frame the uncertainty currently in play rather than emitting a completion tally. Read `references/round-composition.md` before composing when terminology must remain stable across the session, wording must be carried unchanged, material belongs to another round or trace, or phase order determines whether text belongs before or inside a gate.

### Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Marginal priority uncertainties only | Constitution interaction with Dismiss as default option |
| Medium | Significant priority uncertainties, context collection partially resolved | Structured Constitution interaction framing the current uncertainty |
| Heavy | Critical priority, multiple unresolved uncertainties | Detailed evidence + collection results + classify results + resolution paths |

## Rules

- **Recognition over Recall**: Present structured options with anticipatable post-selection states.
- **Round composition**: Compose each round so the reader can act on it without reassembling it — use everyday language, keep the judgment beside its nearest evidence and next-move implication, and place analytical context before the gate.
- **Option-set relay test**: Present a single dominant trajectory as Extension. Constitution options remain genuinely viable under different user value weightings; shared trajectories collapse, while off-axis responses remain free-response pathways.
- **One coherent cluster**: Items in a multi-item cluster share a decision frame, have non-overlapping information-gain leverage, and are independently answerable. When the cluster has more than one item, cite the clustering basis and each item's gain rationale.
- **No pre-filter rationalization**: Coherence coexistence is available only when an explicit scope hierarchy or documented precedence ordering resolves the apparent contradiction.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction forward until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
