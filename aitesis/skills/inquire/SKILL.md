---
name: inquire
description: "Infer context insufficiency before execution. Surfaces uncertainties through information-gain prioritized inquiry when AI infers areas of context insufficiency, producing informed execution. Type: (ContextInsufficient, AI, INQUIRE, Prospect) → InformedExecution. Alias: Aitesis(αἴτησις)."
---

# Aitesis Protocol

Infer context insufficiency before execution through AI-guided inquiry. Type: `(ContextInsufficient, AI, INQUIRE, Prospect) → InformedExecution`.

## Definition

**Aitesis** (αἴτησις): A dialogical act of proactively inferring context sufficiency before execution, where AI identifies uncertainties across multiple dimensions (factual, coherence, relevance), collects contextual evidence via codebase exploration, classifies each uncertainty by dimension and verifiability, resolves memory-internal contradictions through evidence, routes cross-domain concerns to other epistemic protocols, and inquires about remaining uncertainties through information-gain prioritized mini-choices for user resolution.

```
── FLOW ──
Aitesis(X) → Scan(X, dimensions) → Uᵢ → Ctx(Uᵢ) → (Uᵢ', Uᵣ) →
  classify(Uᵢ', dimension) → [if off-diagonal] Qc → (Uᵣ', Uₑ, Uᵢ'', Uₙ) →
  Q(classify_result + Uₑ + Uᵢ'', priority) → A → X' → (loop until informed)
-- Uₙ (non-actionable: CrossDomain coherence + detect-only dimensions): shown in classify summary with routing target
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
             -- Unknown(Partial) = user declines certainty; Phase 3 auto-promotes via Rule 20 tiebreaker (UserTacit → next-preferred
             -- EvidenceSource in ValidSources(v)) and re-enters Phase 1 for reclassification; routing arc formalized in PHASE TRANSITIONS
Ac         = User coherence classification ∈ CoherenceType     -- Phase 1 Qc gate answer type
X'       = Updated prospect (context-enriched)
InformedExecution = X' where remaining = ∅ ∨ user_esc
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
ValidSources : Verifiability → ℘(EvidenceSource)
  ValidSources(ReadOnlyVerifiable)    = {CodeDerivable, UserTacit, CanonicalExternal} ∪ Emergent(EvidenceSource)
  ValidSources(EmpiricallyObservable) = {Instrumentation, UserTacit}                  ∪ Emergent(EvidenceSource)
  ValidSources(UserDependent)         = {UserTacit}                                    ∪ Emergent(EvidenceSource)
  -- Emergent(EvidenceSource) fallback-admissible when no base element fits the observed channel
  -- cost-ordering tiebreaker (ascending): CodeDerivable < CanonicalExternal < Instrumentation < UserTacit
  -- default selects lowest-cost valid source; override requires cite per Rule 20 (cite-or-observe)
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
             -- CrossDomain/Relevance/Emergent → detect + show routing target in classify summary (no EvidenceSource tag)
ObservationSpec = { setup: Action, execute: Action, observe: Predicate, cleanup: Action }
EmpiricalObservation = (Uᵢ', ObservationSpec) → Uₑ  -- dynamic evidence gathering
Uᵣ'        = Read-only verified uncertainties    -- resolved (no Phase 2); excludes items routed via UserTacit override per Rule 20
Uₑ_candidates = { u ∈ Uᵢ' : classify(u) = (Factual, (EmpiricallyObservable, s)) ∧ s ≠ UserTacit }
              -- Phase 1 observation checkpoint; excludes Rule 20 cite-based UserTacit overrides (those route directly to Uᵢ'')
Uₑ         = Empirically observed uncertainties    -- evidence attached, proceeds to Phase 2
Uᵢ''       = Remaining user-dependent uncertainties
             -- Includes: (a) Factual/UserDependent items
             --           (b) Factual/EmpiricallyObservable with EvidenceSource = UserTacit (Rule 20 cited override)
             --           (c) Factual/ReadOnlyVerifiable with EvidenceSource = UserTacit (Rule 20 cited override)
             --           (d) reclassified Coherence/MemoryInternal landing in any of (a)-(c) above
             -- Phase 2 question candidates
Uₙ         = Non-actionable detected uncertainties  -- Fiber(Coherence) = CrossDomain or Fiber(d) = Unit; shown in classify summary with routing target
Action     = Tool call sequence (Write, Bash)
EscapeCondition ∈ {EnvironmentMutation, BoundExceeded, RiskElevated}
                    -- maps to Rule 20 (a)-(c) escape hatches; logged in observation_skips
branching_factor : Uncertainty → ℕ
  branching_factor(u) = |distinct_resolution_paths(u) ∪ distinct_side_effect_branches(u)|
    -- counts mutually-exclusive resolution postures (e.g., in-place fix / redesign / offload / defer)
    -- UNION side-effect branch count (e.g., N downstream mutations per posture); both flavors summed
    -- per-uncertainty count must be citable in Phase 2 classify summary when Rule 22 exception is invoked

── PHASE TRANSITIONS ──
Phase 0: X → Scan(X, dimensions) → Uᵢ?                        -- context sufficiency checkpoint (silent)
Phase 1: Uᵢ → Step₁ Ctx(Uᵢ) → (Uᵢ', Uᵣ) →                    -- Step 1: context collection [Tool]
         Step₂ classify(Uᵢ', dimension) → (Uᵣ', Uₑ, Uᵢ'', Uₙ) → -- Step 2: epistemic classification (core act); Uₙ = non-actionable
         [if off-diagonal(scope, resolution)] Qc(scope_assessment, resolution_assessment) → Stop → Ac  -- Coherence 2D Constitution interaction [Tool]
         -- evaluation order: Qc resolves before Uₑ_candidates computation; reclassified MemoryInternal/EmpiricallyObservable enters Uₑ_candidates
         Step₃ ReadOnlyVerify(Uᵣ') →                           -- Step 3: read-only verification (CodeDerivable + CanonicalExternal) [Tool]
           [if staleness_unverified(u) ∨ scope_gap(u)] reclassify(u, EmpiricallyObservable) → goto Step₂  -- backward arc (T4): staleness/scope failure re-enters classification
         [if Uₑ_candidates ≠ ∅] Step₄ EmpiricalObservation(Uₑ_candidates) → Uₑ  -- Step 4: dynamic evidence gathering [Tool]
Phase 2: Qs(classify_result + Uₑ + Uᵢ''[cluster], progress) → Stop → A          -- uncertainty surfacing [Tool]; cluster = one coherent cluster (Rule 7, size ≤ 4)
Phase 3: A → integrate(A, X) → X'                               -- prospect update (sense)
         [if A = Unknown(Partial)] auto_promote(uncertainty, next_source(ValidSources(v))) → goto Phase 1  -- backward arc (T2): user declines certainty → re-enter classification with next-preferred EvidenceSource

── LOOP ──
After Phase 3: re-scan X' for remaining or newly emerged uncertainties.
New uncertainties accumulate into uncertainties (cumulative, never replace).
If Uᵢ' remains: return to Phase 1 (collect context for new uncertainties).
If remaining = ∅: proceed with execution.
User can exit at Phase 2 (early_exit).
Continue until: informed(X') OR user ESC.
Convergence evidence: At remaining = ∅, present transformation trace — for each u ∈ (Λ.context_resolved ∪ Λ.read_only_resolved ∪ Λ.empirically_observed ∪ Λ.user_responded), show (ContextInsufficient(u) → resolution(u)). Convergence is demonstrated, not asserted.

── CONVERGENCE ──
actionable(Λ) = uncertainties \ non_factual_detected       -- Fiber(Factual) + Fiber(Coherence)=MemoryInternal uncertainties
informed(X') = remaining = ∅                                -- non_factual_detected does not block convergence
progress(Λ) = 1 - |remaining| / |actionable(Λ)|            -- denominator excludes non-actionable (CrossDomain + detect-only dimensions)
narrowing(Q, A) = |remaining(after)| < |remaining(before)| ∨ context(remaining(after)) ⊃ context(remaining(before))
early_exit = user_declares_sufficient

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Scan    (sense)       → Internal analysis (no external tool)
Phase 1 Ctx     (observe)     → Read, Grep (stored knowledge extraction: codebase, memory, references); WebSearch, WebFetch (conditional: CanonicalExternal channel — RFCs, vendor API docs, standards; `source: "web:{url}"` tag + staleness guard via codebase version cross-check); Bash (conditional: VersionControlHistory channel — read-only commit-log queries via subprocess (content pickaxe, message search, temporal range); `source: "history:{ref}"` tag; collection-only — ref-type staleness classification handled per Phase 1 Step 1 staleness rule)
Phase 1 Classify (observe)    → Internal analysis (multi-dimension assessment); Read, Grep (stored knowledge cross-reference analysis)
Phase 1 Qc      (constitution)        → present (conditional: Coherence 2D off-diagonal Constitution interaction; fires only when scope ≠ resolution assessment; user classifies coherence type as MemoryInternal or CrossDomain)
Phase 1 Emergent_channel (constitution) → present (channel unvalidated by definition; regardless of parent Verifiability, route to Phase 2 to present observed channel description and await user confirmation before proceeding)
Phase 1 CanonicalExternal_staleness (constitution) → present (when staleness cannot be verified; require BOTH `staleness:unverified` tag AND Phase 2 classify summary surfacing — no silent escalation path; publishing authority claim warrants user awareness)
Phase 1 Observe (transform)   → Write, Bash, Read (dynamic evidence gathering, Factual only); cleanup via Bash
Phase 2 Qs      (constitution)        → present (mandatory: classify result + uncertainty surfacing; user provides context judgment on insufficiency; Esc key → loop termination at LOOP level, not an Answer)
Phase 3         (track)       → Internal state update
converge     (extension)       → TextPresent+Proceed (convergence evidence trace; proceed with informed execution)

── MODE STATE ──
Λ = { phase: Phase, X: Prospect, uncertainties: Set(Uncertainty),
      dimensions_detected: Set(Dimension),                           -- π₁ image of classify_results
      classify_results: Map(Uncertainty, Σ(d: Dimension). Fiber(d)), -- fibration-typed classification
      context_resolved: Set(Uncertainty),  -- Uᵣ from TYPES
      read_only_resolved: Set(Uncertainty), -- Uᵣ' from TYPES
      empirically_observed: Set(Uncertainty), -- Uₑ from TYPES
      non_factual_detected: Set(Uncertainty), -- Uₙ from TYPES; Fiber(Coherence) = CrossDomain or Fiber(d) = Unit, classify summary routing
      user_responded: Set(Uncertainty),
      remaining: Set(Uncertainty), dismissed: Set(Uncertainty),
      history: List<(Uncertainty, A)>, observation_history: List<(ObservationSpec, Result, Evidence)>,
      observation_skips: List<(Uncertainty, EscapeCondition, String)>,  -- audit trail for Rule 20 (a)-(c) escape hatches
      source_choice_overrides: List<(Uncertainty, EvidenceSource, String)>,  -- audit trail for Rule 20 cite-based UserTacit overrides
      active: Bool,
      cause_tag: String }
-- Invariant: uncertainties = context_resolved ∪ read_only_resolved ∪ empirically_observed ∪ non_factual_detected ∪ user_responded ∪ remaining ∪ dismissed (pairwise disjoint)
-- Note: observation_skips and source_choice_overrides are audit logs orthogonal to the partition —
--       observation_skips: logged when EmpiricallyObservable is reclassified to UserDependent via Rule 20 (a)-(c) escape conditions
--       source_choice_overrides: logged when UserTacit is selected over cheaper EvidenceSource with cited dominance basis (Rule 20A/B); audit trail supports variation-stable observed use for cost-ordering

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Evidence over Inference over Detection**: Aitesis operates on an epistemic hierarchy with two boundaries. The lower boundary (Inference > Detection): infer context insufficiency from requirements rather than detecting via fixed taxonomy — the protocol dynamically identifies what context is missing, not mechanically checking against a preset list. The upper boundary (Evidence > Inference): gather evidence through direct environmental observation rather than substituting inference from reasoning alone — when a fact is observable, observe it. Corollary: partial evidence covering a subset of the claim scope is inference for the uncovered portion — evidence-claim alignment must be verified before treating evidence as resolution.

Within this hierarchy, the AI first collects contextual evidence via codebase exploration to enrich question quality, then classifies each uncertainty by dimension and verifiability — classification is the protocol's core epistemic act, not a routing sub-step. For factual uncertainties, the AI resolves read-only verifiable facts directly and empirically observes dynamically accessible ones with direct evidence before asking. For coherence, the AI classifies by scope and resolution method — memory-internal contradictions are resolved through factual reclassification, while cross-domain contradictions are routed to downstream protocols via deficit-matched routing. For relevance, the AI detects and shows routing targets in the classify summary. The purpose is multi-dimensional context sufficiency sensing — asking better questions for what requires human judgment, self-resolving what can be observed, resolving memory-internal contradictions through evidence, and routing cross-domain concerns to other epistemic protocols.

Write is authorized for observation instrument setup (temporary test artifacts with mandatory cleanup). Rule 20 is the structural expression of the upper boundary — the adversarial guard against stopping at Inference when Evidence is achievable.

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-guided | FrameworkAbsent → FramedInquiry | Perspective selection |
| **Syneidesis** | AI-guided | GapUnnoticed → AuditedDecision | Decision-point gaps |
| **Hermeneia** | Hybrid | IntentMisarticulated → ClarifiedIntent | Expression clarification |
| **Telos** | AI-guided | GoalIndeterminate → DefinedEndState | Goal co-construction |
| **Horismos** | AI-guided | BoundaryUndefined → DefinedBoundary | Epistemic boundary definition |
| **Aitesis** | AI-guided | ContextInsufficient → InformedExecution | Context sufficiency sensing |
| **Analogia** | AI-guided | MappingUncertain → ValidatedMapping | Abstract-concrete mapping validation |
| **Periagoge** | AI-guided | AbstractionInProcess → CrystallizedAbstraction | In-process abstraction crystallization |
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Risk-assessed execution |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Anamnesis** | AI-guided | RecallAmbiguous → RecalledContext | Vague recall recognition |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:
- **Syneidesis** surfaces gaps at decision points for the user to judge (information flows AI→user) — Aitesis infers context the AI lacks before execution (information flows user→AI)
- **Telos** co-constructs goals when intent is indeterminate — Aitesis operates when goals exist but execution context is insufficient
- **Hermeneia** extracts intent the user already has (user signal) or detects expression ambiguity (AI-detected, requires confirmation) — Aitesis infers what context the system lacks

**Heterocognitive distinction**: Aitesis monitors the AI's own context sufficiency (heterocognitive — "do I have enough context to execute?"), while Syneidesis monitors the user's decision quality (metacognitive — "has the user considered all angles?"). The operational test: if the information gap would be filled by the user providing context, it's Aitesis; if it would be filled by the user reconsidering their decision, it's Syneidesis.

**Factual vs evaluative**: Aitesis uncertainties span multiple dimensions — factual (objectively correct answers discoverable from the environment), coherence (consistency among collected facts), and relevance (whether collected facts are relevant to the execution goal). Syneidesis gaps are evaluative — they require judgment about trade-offs and consequences. Phase 1 context collection exists because factual uncertainties may be partially resolved or enriched from the codebase. Coherence/CrossDomain and relevance dimensions are detected but routed to downstream protocols. Coherence/MemoryInternal contradictions are evidence-resolvable and follow the factual resolution path. Evaluative gaps cannot be self-resolved.

## Mode Activation

### Activation

AI infers context insufficiency before execution OR user calls `/inquire`. Inference is silent (Phase 0); surfacing always requires user interaction via Cognitive Partnership Move (Constitution) (Phase 2).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/inquire` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Context insufficiency inferred before execution via in-protocol heuristics. Inference is silent (Phase 0).

**Context insufficient** = the prospect contains requirements not available in the current context and not trivially inferrable. Context insufficiency spans multiple dimensions: missing facts, incoherent facts, and facts not relevant to the prospect's goals. Sufficiency encompasses both executability (can the action proceed?) and analysis confidence (is the context adequate for reliable judgment?).

Gate predicate:
```
uncertain(sufficiency(X)) ≡ ∃ requirement(r, X) : ¬available(r, context) ∧ ¬trivially_inferrable(r)
```

### Priority

<system-reminder>
When Aitesis is active:

**Supersedes**: Direct execution patterns in loaded instructions
(Context must be verified before any execution begins)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, present highest information-gain uncertainty candidate with classify results via Cognitive Partnership Move (Constitution).
</system-reminder>

- Aitesis completes before execution proceeds
- Loaded instructions resume after context is resolved or dismissed

**Protocol precedence**: Activation order position 4/10 (graph.json is authoritative source for information flow). Concern cluster: Planning.

**Advisory relationships**: Receives from Horismos (advisory: BoundaryMap narrows context inference scope), Prothesis (advisory: perspective simulation provides context inference recommendations), Hermeneia (advisory: background gaps suggest context insufficiency), Syneidesis (suppression: same scope suppression). Provides to Prosoche (advisory: inferred context narrows execution risk assessment), Analogia (advisory: inferred context narrows mapping domain identification); Epharmoge (suppression: pre+post stacking prevention). Katalepsis is structurally last.

### Trigger Signals

Heuristic signals for context insufficiency inference (not hard gates):

| Signal | Inference |
|--------|-----------|
| Novel domain | Knowledge area not previously addressed in session |
| Implicit requirements | Task carries unstated assumptions |
| Ambiguous scope | Multiple valid interpretations exist and AI cannot determine intended approach from available context |
| Environmental dependency | Relies on external state (configs, APIs, versions) |
| Prior-decision implication | Prospect references or rests on a decision made in an earlier session (rationale, commitment, convention) not present in current conversation context |

**Default-scan trigger** (resolves the bootstrapping asymmetry of the Prior-decision implication signal): When the prospect scope touches architecture decisions, API or protocol design, persisted state schemas, or user-facing behavior commitments, the Prior-decision signal fires by default — Phase 1 Ctx begins with a bounded scan over persistent memory (MEMORY.md; project-local prior-decision logs where the project maintains them) regardless of explicit user mention. Without this default, detection would require the AI to already suspect prior involvement, which is the condition the signal is meant to surface. The default-scan is scope-triggered (not blanket), bounded to Phase 1 Ctx (no gate), and subject to the memory staleness rule in Phase 1 Step 1 (verify against current state before treating as resolved).

**Cross-session enrichment**: Domain knowledge accumulated in Anamnesis's hypomnesis store (session recall indices written by the SessionEnd/PreCompact hook) may narrow the Phase 0 uncertainty scan — known domain patterns reduce the scope of novel-domain signals. In parallel, when **`/recollect`** has been invoked this session, the recalled context narrows the Phase 1 context scan scope — recognized prior context reduces the factual uncertainty surface before collection begins. This is a heuristic input that may bias detection toward previously observed patterns; constitutive judgment remains with the user.

**Revision threshold**: When accumulated observation_skips entries across 3+ sessions cluster around a specific EscapeCondition with consistent rationale, the Verifiability classification boundary warrants revision — the escape is systematic, not exceptional. When accumulated Emergent dimension detections across 3+ sessions reveal a recurring non-factual uncertainty pattern, the Layer 1 dimension set warrants a new fiber in the fibration structure — promoted fibers default to Unit (detect-only) unless the pattern exhibits internal classification structure requiring a structured fiber type.

**Skip**:
- Execution context is fully specified in current message
- User explicitly says "just do it" or "proceed"
- Same (domain, description) pair was dismissed in current session (session immunity)
- Phase 1 context collection resolves all identified uncertainties
- Read-only / exploratory task — no prospect to verify

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| All uncertainties resolved (context, read-only, observed, or user) | Proceed with updated prospect |
| All remaining uncertainties dismissed | Proceed with original prospect + defaults |
| User Esc key | Return to normal operation |

## Uncertainty Identification

Uncertainties are identified dynamically per task — no fixed taxonomy. Each uncertainty is characterized by:

- **domain**: The knowledge area where context is missing (e.g., "deployment config", "API versioning", "user auth model")
- **description**: What specifically is missing or uncertain
- **context**: Evidence collected during Phase 1 that enriches question quality

### Priority

Priority reflects information gain — how much resolving this uncertainty would narrow the remaining uncertainty space.

| Level | Criterion | Action |
|-------|-----------|--------|
| **Critical** | Resolution maximally narrows remaining uncertainty space | Must resolve before execution |
| **Significant** | Resolution narrows uncertainty but alternatives partially compensate | Surface to user for context |
| **Marginal** | Reasonable default exists; resolution provides incremental improvement | Surface with pre-selected Dismiss option |

Priority is relational, not intrinsic: the same uncertainty may be Critical in one context and Marginal in another, depending on what other uncertainties exist and what context is already available.

When multiple uncertainties are identified, surface in priority order (Critical → Significant → Marginal). Only one uncertainty surfaced per Phase 2 cycle.

## Protocol

### Phase 0: Context Sufficiency Gate (Silent)

Analyze prospect requirements against available context across multiple dimensions. This phase is **silent** — no user interaction.

1. **Scan prospect** `X` for required context: domain knowledge, environmental state, configuration details, user preferences, constraints
2. **Check availability**: For each requirement, assess whether it is available in conversation, files, or environment
3. **Dimension assessment**: Identify which dimensions are potentially insufficient — factual (missing information), coherence (conflicting information), relevance (information not relevant to goal)
4. If all requirements satisfied: present sufficiency finding per Rule 17 before proceeding (Aitesis not activated)
5. If uncertainties identified: record `Uᵢ` with domain, description — proceed to Phase 1

**Scan scope**: Current prospect context, conversation history, observable environment. Does NOT modify files or call external services.

### Phase 1: Context Collection + Classification + Empirical Observation

Collect contextual evidence, classify each uncertainty by dimension and verifiability, and empirically observe accessible uncertainties with direct evidence.

**Step 1 — Context collection**: For each uncertainty in `Uᵢ`:
- **Call Read/Grep** to search for relevant information in codebase, configs, documentation
- If definitive answer found: mark as context-resolved (`Uᵣ`), integrate into execution context
- If partial evidence found: enrich uncertainty with collected evidence (`Uᵢ'`), retain for classification
- If conflicting evidence found: enrich uncertainty with conflicting findings (`Uᵢ'`), retain for classification
- If no evidence found: retain in `Uᵢ'` with empty context
- **Cross-session state consultation is in-scope**: When a prospect implicates prior decisions, rationale, or committed state from earlier sessions, Read/Grep over persistent memory files (MEMORY.md; project-local prior-decision logs where present) and version-control history scans (commit-content pickaxe, message search, temporal range queries — when the substrate provides version control) are part of Phase 1 Ctx — not a separate protocol. Consulting past state at the current decision moment is context collection. Evidence from memory is tagged `source: "memory:{path}"`; evidence from version-control history is tagged `source: "history:{ref}"` (commit hash / tag / branch ref) for traceability. **Memory and history staleness guard**: both classes of evidence are temporally decoupled from the current environment — the referenced decision may have been superseded, the referenced file may have been renamed, the convention may have been revised. **History ref currency by ref-type**: full commit hashes (40-char SHA) are immutable content addresses — the commit's content snapshot is stable; mutable refs (branches, tags, partial-hash refs) may be amended/rebased/force-pushed and require currency verification. Even immutable commit-hash evidence may be *interpretively superseded* by later commits (the cited change may no longer reflect current convention). Such evidence is therefore NOT eligible for the Factual/ReadOnly direct-resolve path. Classify memory- or history-sourced evidence as Factual/EmpiricallyObservable (verify against current codebase/environment state before treating as resolved) or escalate to user confirmation via the classify summary with explicit `staleness:unverified` tag. Codebase evidence remains eligible for ReadOnly direct resolution because it is inherently current. This is discovery of what the AI already committed to, not pattern discovery across sessions. **Routing distinction**: this channel covers AI-driven scope expansion at runtime (objective historical investigation triggered by Prior-decision implication signals); subjective recall of prior session content (user-utterance-bound, empty_intention trigger) routes through `/recollect` (Anamnesis) per the protocol's input-side authority shape, not through this channel.

**Step 2 — Epistemic classification** (core act): For each remaining uncertainty in `Uᵢ'`:
- **Dimension assessment** (Layer 1): Is this factual, coherence, or relevance?
  - Factual: a fact is missing from context and required for execution
  - Coherence: collected facts are mutually inconsistent
  - Relevance: collected facts are not relevant to the execution goal
- **Verifiability assessment** (Layer 2, Factual dimension — Observability sub-modes guide classification):
  - ReadOnlyVerifiable: fact exists in environment (StaticObservation or BeliefVerification) and is observable with current tools, AND evidence scope ⊇ claim scope → resolve directly via extended context lookup
    - When evidence scope ⊊ claim scope: split — covered portion proceeds to Step 3 (ReadOnly resolution), uncovered portion is classified separately and enters the appropriate verifiability path
  - EmpiricallyObservable: fact requires DynamicObservation — does not exist statically but is observable through non-destructive execution, reversible, and bounded (< 30s) → empirical observation
  - UserDependent: neither read-only verifiable nor empirically observable → Phase 2 directly
- **EvidenceSource selection** (Layer 2, Factual dimension — `Fiber(Factual) = Σ(v: Verifiability). {s | s ∈ ValidSources(v)}`):
  - For each Factual(v) uncertainty, select a single EvidenceSource from `ValidSources(v)` (function body in TYPES).
  - **Default**: lowest-cost valid source per cost-ordering in TYPES (ascending: `CodeDerivable < CanonicalExternal < Instrumentation < UserTacit`).
  - **External-dependency preference** (cost-ordering adjustment): when the uncertainty carries an environmental-dependency signal (external API version, vendor behavior, RFC/standard semantics), prefer `CanonicalExternal` over `CodeDerivable` unless an authority-override basis is cited (e.g., internal fork supersedes upstream, vendor behavior already reverse-engineered in-repo). Log override to `Λ.source_choice_overrides`.
  - **Override — Rule 20 cite-or-observe** (extended): choosing `UserTacit` over a cheaper source requires cited dominance basis and is logged to `Λ.source_choice_overrides`:
    - `UserTacit` over `Instrumentation` (EmpiricallyObservable): cite (a) operational context absent from instrumentation, (b) temporally-scoped knowledge not reproducible statically, or (c) setup > 30s bound
    - `UserTacit` over `CodeDerivable`/`CanonicalExternal` (ReadOnlyVerifiable): cite (a) tacit domain knowledge not captured in source/external doc, (b) interpretive judgment over canonical text, or (c) authority-override rationale
    - Without citation, default to the cheaper source
  - **Routing consequence** (determines Step 3/4/Phase 2 channel):
    - `CodeDerivable` → Step 3 (Read-only verification; codebase Read/Grep)
    - `CanonicalExternal` → Step 3 with WebFetch/WebSearch (published external docs; `source: "web:{url}"` tag + determinism verification + staleness guard — see Web context below)
    - `Instrumentation` → Step 4 (Empirical observation via Bash lifecycle)
    - `UserTacit` → Phase 2 directly (user-dependent inquiry; includes reclassified Coherence/MemoryInternal items)
    - `Emergent(source)` → **always Phase 2** (Constitution per TOOL GROUNDING `Phase 1 Emergent_channel`): record observed channel description in classify summary, await user confirmation that this channel is appropriate; accumulate toward variation-stable observed use for base promotion. Parent Verifiability tier is NOT used to bypass Phase 2 — the channel is unvalidated by definition.
- **Coherence classification** (Layer 2, 2D model: Scope × Resolution):
  - Pre-filter: cross-scope + rule-resolvable (existing scope hierarchy, established precedence) → coexistence (exit Coherence; not a contradiction)
  - Same scope + evidence-resolvable → MemoryInternal → factual reclassification (ReadOnlyVerifiable / EmpiricallyObservable / UserDependent) → follows Factual resolution path (Step 3, Step 4, or Phase 2)
    - **EvidenceSource inheritance procedure**: reclassified MemoryInternal items enter EvidenceSource selection identically to directly-classified Factual(v) items — the same cost-ordering default, external-dependency preference, and Rule 20 cite-or-observe override requirements apply; `source_choice_overrides` logging applies identically
  - Cross scope + structure-requiring → CrossDomain → deficit-matched routing: MappingUncertain→`/ground`, BoundaryUndefined→`/bound`, GoalIndeterminate→`/goal`, FrameworkAbsent→`/frame`, GapUnnoticed→`/gap`, IntentMisarticulated→`/clarify`
  - Off-diagonal (Scope ≠ Resolution): present both assessments with evidence via conditional gate; user classifies as MemoryInternal or CrossDomain
    - (Same, Structure): same-scope contradiction where factual verification is insufficient — resolution requires understanding structural relationships within the scope
    - (Cross, Evidence): cross-scope contradiction where evidence comparison can determine which scope's claim is current — despite scope difference, factual verification suffices
  - MemoryInternal → actionable (proceeds to resolution); CrossDomain → record as `Uₙ` (non_factual_detected) with deficit-matched routing target
- **Other non-actionable dimensions**: Relevance and Emergent → detect and record as `Uₙ` (non_factual_detected); shown with routing target in classify summary, not Phase 2 question
  - Relevance → deficit-matched: GoalIndeterminate→`/goal`, GapUnnoticed→`/gap`, BoundaryUndefined→`/bound`, IntentMisarticulated→`/clarify`
  - Emergent(_) → match observed deficit condition against candidate protocol deficit conditions
- Store all results in `Λ.classify_results`

**Step 3 — Read-only verification**: For ReadOnlyVerifiable uncertainties:
- Targeted context lookup via Read/Grep — classification narrows search scope to specific files/locations that Step 1's broad sweep did not cover (e.g., spec files, config schemas identified by classify)
- Scope re-verification: if targeted lookup reveals evidence scope ⊊ claim scope not detected at Step 2 (subtle gap), apply the same split — covered portion resolved, uncovered portion reclassified separately
- Resolved: mark as `Uᵣ'` (read_only_resolved), skip Phase 2

**Step 4 — Empirical observation**: For EmpiricallyObservable uncertainties:
- **Pre-observation escape check**: If Rule 20 (a)-(c) applies BEFORE execution (environmental constraint prevents bounded, non-destructive observation), reclassify as UserDependent and log `(uncertainty, condition, rationale)` to `Λ.observation_skips` — the skip rationale must cite the triggering escape condition and the empirical basis that established it. Skip remaining Step 4 execution for this uncertainty.
- **Execution** (if no pre-observation escape): Construct ObservationSpec: { setup, execute, observe, cleanup }; execute lifecycle (setup → execute → observe → cleanup → record)
- **Outcome — differentiating evidence found**: Attach evidence to `Uₑ` → proceeds to Phase 2 with positive evidence
- **Outcome — no differentiating signal**: Observation executed but no state change distinguishes candidate answers. Attach the null-signal finding as negative evidence to `Uₑ` → proceeds to Phase 2 with observation record. This is NOT an escape or reclassification; the observation output itself is the evidence. Phase 2 surfaces the observed null-signal to the user for judgment, not AI-internal categorical dismissal.

If all uncertainties context-resolved or read-only-resolved (no observed or user-dependent remaining): proceed with execution (no user interruption).
If observed or user-dependent uncertainties remain: proceed to Phase 2.

**Web context** (CanonicalExternal channel, conditional): When uncertainty carries an environmental dependency signal
(external API versions, library maintenance status, breaking changes, RFC/standard semantics, vendor documentation)
and the information is not available in the codebase, extend context collection to WebSearch/WebFetch.
Web evidence is tagged with `source: "web:{url}"` for traceability.

**Determinism verification** (Extension precondition): CanonicalExternal is classified as Extension only when the source is deterministic for the claim scope. Verify one of: (a) pinned version or dated snapshot (specific RFC with publication date, vendor doc with version pin, W3C spec with date stamp), (b) tag-pinned URL (`/v1.2/`, `?version=X`), or (c) cached copy with recorded fetch timestamp. When the source is undated or versionless and the claim depends on temporal context (API behavior, deprecated features, vendor defaults), the fetch is NON-deterministic → classify as Constitution and escalate via Phase 2 classify summary before treating as evidence.

**Staleness guard** (analogous to memory evidence): documentation may be temporally decoupled from the library version actually in use — verify against codebase import/pin version before treating as resolved. When staleness cannot be verified, the guard requires BOTH: (1) `staleness:unverified` tag attached to the evidence record, AND (2) surfacing to the user in Phase 2 classify summary regardless of whether EmpiricallyObservable reclassification subsequently resolves the uncertainty — no silent escalation path (no "or" fallback). The CanonicalExternal source carries publishing authority (standards body, vendor) distinct from internal CodeDerivable evidence — cite both when cross-validating, and always cite the authority source when its temporal alignment cannot be independently verified (see TOOL GROUNDING `Phase 1 CanonicalExternal_staleness` Constitution entry).

**Scope restriction**:
- Context collection: Read-only investigation (Read, Grep, WebSearch). — core preserved
- Read-only verification: Extended context lookup for verifiable facts (Read, Grep). — resolves directly
- Empirical observation: Non-destructive observation via Bash execution, with optional Write for observation instrument setup (temp test artifacts).
  Observation artifacts must be created in temp locations and cleaned up after observation.
  Observation must not modify existing project files.
  Observation results are evidence for Phase 2, not resolution — evidence gathering, not replacement.

**Observation design constraints**:
1. **Minimal**: Create the smallest possible observation instrument
2. **Reversible**: All observation artifacts must be cleaned up after observation
3. **Sandboxed**: Observation must not modify existing project files
4. **Transparent**: Log observation lifecycle in `Λ.observation_history`
5. **Bounded**: 30-second timeout → fall back to user inquiry
6. **Risk-aware**: Elevated-risk observation → reclassify as UserDependent

### Phase 2: Uncertainty Surfacing

**Present** the highest-priority remaining uncertainty with classify results via Cognitive Partnership Move (Constitution).

**Classification transparency** (Always show): Phase 2 always includes classify results for remaining uncertainties. This is informational — no approval required. Users can override classification by stating objection. When only one uncertainty remains, inline the classification with the uncertainty description rather than showing a separate summary block.

**Surfacing format**:

Present the classification results, uncertainty description, and evidence as text output:
- **Classification summary** (Factual entries include `EvidenceSource` selection per Rule 20 cite-or-observe):
  - U1: Factual/ReadOnly, EvidenceSource: CodeDerivable (basis: evidence summary)
  - U1a: Factual/ReadOnly, EvidenceSource: CanonicalExternal (basis: [doc url + codebase version cross-check])
  - U2: Factual/EmpiricallyObservable, EvidenceSource: Instrumentation (basis: evidence summary)
  - U2a: Factual/EmpiricallyObservable, EvidenceSource: UserTacit over Instrumentation, basis: {dominance_reason — operational context / temporal scope / setup > 30s} (Rule 20 cite)
  - U2b: Factual/EmpiricallyObservable → UserDependent (escape: [condition] — "[rationale]")
  - U2c: Factual/partial (evidence scope ⊊ claim scope: covers [scope A], claim requires [scope B] — uncovered portion classified separately)
  - U2e: Factual/*, EvidenceSource: Emergent(source) (observed channel: [description] — fallback-admissible; accumulates toward variation-stable observed use)
  - U3a: Coherence/MemoryInternal → factual reclassification; EvidenceSource selected from `ValidSources(reclassified_v)` via the same procedure as directly-classified Factual items (Step 2 — EvidenceSource inheritance procedure; cost-ordering, external-dependency preference, and Rule 20 cite-or-observe apply identically)
  - U3b: Coherence/CrossDomain (basis: evidence summary — structure-requiring) → deficit-matched routing
  - U4: Relevance (basis: evidence summary) → /goal
  - Any classification (dimension / verifiability / EvidenceSource) to revise?
- **[Specific uncertainty description — highest priority]**
- **Evidence**: [Evidence collected during context collection and observation, if any]
- **Progress**: [N resolved / M actionable uncertainties] (excludes non-actionable routed)

Then **present**:

```
How would you like to resolve this uncertainty?

Options:
1. **[Provide X]** — [what this context enables]
2. **[Point me to...]** — tell me where to find this information
3. **Dismiss** — proceed with [stated default/assumption]
4. **Unknown / Partial** — I don't know or have only partial context; auto-promote to next-preferred EvidenceSource and re-classify
```

Option 4 is the typed `Unknown(Partial)` constructor (TYPES `A`): Phase 3 auto-promotes to the next-preferred EvidenceSource in `ValidSources(v)` and re-enters Phase 1 classification via the backward arc (PHASE TRANSITIONS). This is a type-preserving materialization — not gate mutation — since the TYPES coproduct already admits `Unknown(Partial)` as a constructor.

**Design principles**:
- **Classification transparent**: Show classify results (dimension + verifiability) for all uncertainties — "visible by default, ask only on exception"
- **Context collection transparent**: Show what evidence was collected and what remains uncertain
- **Progress visible**: Display resolution progress across all identified uncertainties
- **Actionable options**: Each option leads to a concrete next step
- **Dismiss with default**: Always state what assumption will be used if dismissed

**Selection criterion**: Choose the uncertainty whose resolution would maximally narrow the remaining uncertainty space (information gain). When priority is equal, prefer the uncertainty with richer collected context (more evidence to present).

### Phase 3: Prospect Update

After user response:

1. **Provide(context)**: Integrate user-provided context into prospect `X'`
2. **Point(location)**: Record location, resolve via next Phase 1 iteration
3. **Dismiss**: Mark uncertainty as dismissed, note default assumption used

After integration:
- Re-scan `X'` for remaining or newly emerged uncertainties
- If uncertainties remain: return to Phase 1 (collect context for new uncertainties first)
- If all resolved/dismissed: proceed with execution
- Log `(Uncertainty, A)` to history

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Marginal priority uncertainties only | Constitution interaction with Dismiss as default option |
| Medium | Significant priority uncertainties, context collection partially resolved | Structured Constitution interaction with progress |
| Heavy | Critical priority, multiple unresolved uncertainties | Detailed evidence + collection results + classify results + resolution paths |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Aitesis) only if ∃ requirement(r) : ¬available(r) ∧ ¬trivially_inferrable(r)` | Prevents false activation on clear tasks |
| Context collection first | Phase 1 before Phase 2 | Enriches question quality before asking |
| Uncertainty cap | One coherent cluster per Phase 2 cycle (size ≤ 4, default), priority order, per-item non-overlapping information-gain leverage | Prevents question overload while permitting shared-frame clusters |
| Session immunity | Dismissed (domain, description) → skip for session | Respects user's dismissal |
| Progress visibility | `[N resolved / M actionable]` in Phase 2 | User sees progress on actionable (Factual + Coherence/MemoryInternal) uncertainties |
| Narrowing signal | Signal when `narrowing(Q, A)` shows diminishing returns | User can exit when remaining uncertainties are marginal |
| Early exit | User can declare sufficient at any Phase 2 | Full control over inquiry depth |
| Cross-protocol fatigue | Syneidesis triggered → suppress Aitesis for same task scope | Prevents protocol stacking (asymmetric: Aitesis context uncertainties ≠ Syneidesis decision gaps, so reverse suppression not needed) |
| Classify transparency | Always show classify results (dimension + verifiability) in Phase 2 surfacing format | User sees AI's reasoning and resolution path per uncertainty |
| Routing transparency | Uₙ items show `→ /protocol` in Phase 2 classify summary | User sees routing destination at detection time |
| Observation transparency | Log observation lifecycle in Λ.observation_history | User can audit what was tested |
| Skip transparency | Log escape hatch usage in Λ.observation_skips with condition + rationale | User can audit why observation was skipped |
| Observation cleanup | All test artifacts removed after observation | No residual files |
| Observation timeout | 30s limit → fall back to user inquiry | Prevents hanging |
| Observation risk gate | Elevated-risk observation → reclassify as UserDependent | Safety preserved |
| Free-response escape | Phase 2 Constitution interaction accepts `Unknown(Partial)` as typed answer constructor (TYPES `A`) — Phase 3 auto-promotes uncertainty to next-preferred EvidenceSource in `ValidSources(v)` and re-enters Phase 1 classification via backward arc (PHASE TRANSITIONS) | User need not simulate certainty for unknowns; routing degrades gracefully through typed, formally-tracked arc |
| Cost-ordering tiebreaker | Default ascending cost-ordering defined in TYPES (`CodeDerivable < CanonicalExternal < Instrumentation < UserTacit`). **External-dependency preference**: when uncertainty carries environmental-dependency signal, prefer `CanonicalExternal` over `CodeDerivable` unless authority-override basis cited. Override logged to `Λ.source_choice_overrides` | Minimizes user-interrupt cost; preserves external authority when relevant; Rule 20 cite basis required for UserTacit preference |
| EvidenceSource transparency | Factual uncertainty classify summary shows `EvidenceSource: {selected}` with basis citation when override applied; `Λ.source_choice_overrides` preserves cite audit across sessions for variation-stable observed use | Rule 20 cite-or-observe audit visibility |

## Rules

1. **AI-guided, user-resolved**: AI infers context insufficiency; resolution requires user choice via Cognitive Partnership Move (Constitution) (Phase 2)
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity — Constitution interaction requires turn yield before proceeding
3. **Context collection first, epistemic classification second**: Before asking the user, (a) collect contextual evidence through Read/Grep over codebase and persistent memory — persistent memory here means **prior-committed decisions and rationale** (architecture choices already merged, conventions documented in rules, deliberate trade-offs recorded in memory files), NOT inductive patterns loaded per-session (pattern loading may bias detection toward previously observed patterns and is outside Phase 1 Ctx scope); memory-sourced evidence is tagged `memory:{path}` and subject to the staleness guard in Phase 1 Step 1 (NOT eligible for Factual/ReadOnly direct-resolve; verify against current state or escalate to user confirmation), (b) classify uncertainties by dimension (Factual/Coherence/Relevance) and verifiability, (c) show classification transparently in Phase 2, (d) for Factual/ReadOnly: resolve directly (codebase evidence only), (e) for Factual/EmpiricallyObservable: run empirical observation to attach evidence (memory evidence lands here when staleness is unverified), (f) for Coherence/MemoryInternal: resolve through factual reclassification (ReadOnlyVerifiable / EmpiricallyObservable / UserDependent), (g) for Coherence/CrossDomain and Relevance: detect and show routing target in classify summary
4. **Evidence over Inference over Detection**: When context is insufficient, infer the highest-gain question rather than detect via fixed checklist (lower boundary). When a factual uncertainty is empirically observable, observe directly rather than infer from reasoning alone (upper boundary — Rule 20 is the structural guard). Evidence-claim alignment: partial evidence covering a subset of the claim scope is inference for the uncovered portion, not evidence — verify evidence scope ⊇ claim scope before treating as resolved, and classify the uncovered portion separately
5. **Open scan**: No fixed uncertainty taxonomy — identify uncertainties dynamically based on prospect requirements
6. **Evidence-grounded**: Every surfaced uncertainty must cite specific observable evidence or collection results, not speculation
7. **One coherent cluster**: Surface one coherent cluster per Phase 2 cycle. Cluster admissible when (a) each item has explicit, non-overlapping information-gain rationale, (b) items share a common decision frame, (c) cluster size ≤ 4 (default), (d) each item is independently answerable — items whose answers depend on other cluster items form a compound question, not a cluster (guard: compound questions collapse the decision space into 2ⁿ implicit states, degrading Recognition). When cluster size > 1, Phase 2 surfacing must include a **clustering-basis cite**: `Clustering basis: [decision frame] — per-item gain rationale: [item₁: reason₁; item₂: reason₂; ...]` (auditable parallel to Rule 20 cite-or-observe). Do not bundle disjoint uncertainties across frames — those surface in separate cycles by priority. Precedence: if the cluster's branching would trigger Rule 22 (`|Uᵢ| × branching_factor ≥ 16`), Rule 22 frame-first obligation supersedes Rule 7 cluster enumeration — frame first, then cluster within the selected frame
8. **Dismiss respected**: User dismissal is final for that uncertainty domain in the current session
9. **Convergence persistence**: Mode active until all identified uncertainties are resolved or dismissed
10. **Progress visibility**: Every Phase 2 surfacing includes progress indicator `[N resolved / M actionable]` — actionable excludes non_factual_detected (non-actionable: CrossDomain coherence + detect-only dimensions, routed not resolved)
11. **Early exit honored**: When user declares context sufficient, accept immediately regardless of remaining uncertainties
12. **Cross-protocol awareness**: Defer to Syneidesis when gap surfacing is already active for the same task scope
13. **Evidence before inquiry**: User inquiry is for judgment — not for facts the AI can discover
14. **Always show**: User can override classification without explicit approval step. Visible by default, ask only on exception
15. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
16. **Convergence evidence**: Present transformation trace before declaring remaining = ∅; per-uncertainty evidence is required
17. **Zero-uncertainty surfacing**: If Phase 0 scan detects no uncertainties, present the finding with reasoning for user confirmation
18. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options
19. **Gate integrity**: The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation
20. **Cite-or-observe**: When a Factual uncertainty has a cheaper EvidenceSource available in `ValidSources(v)` than `UserTacit`, resolve via the cheaper source OR cite explicit dominance basis for preferring `UserTacit`. Without citation, default to the cheaper source. Cited basis appears in the Phase 2 classify summary as `EvidenceSource: UserTacit over {cheaper_source}, basis: {specific_reason}` and logs to `Λ.source_choice_overrides`. Dominance basis by Verifiability tier: **EmpiricallyObservable** → (a) operational or domain knowledge not captured by instrumentation, (b) temporally-scoped knowledge not reproducible via static observation, (c) setup cost exceeding the 30s bound. **ReadOnlyVerifiable** → (a) tacit domain knowledge not captured in source code or external documentation, (b) interpretive judgment over canonical text (policy interpretation, contract reading), (c) authority-override rationale (internal fork supersedes upstream, documented exception to standard). Observation has exactly two outcomes, both proceeding to Phase 2 via `Uₑ`: (i) differentiating evidence found → attach evidence to `Uₑ`; (ii) no differentiating signal → the null-signal finding is itself the observation output, attached as negative evidence to `Uₑ`. Reclassification to UserDependent is legitimate only under empirically verifiable escape conditions evaluated BEFORE observation execution: (a) observation requires persistent environment mutation beyond instrument setup, (b) execution exceeds 30s bound, (c) elevated-risk gate triggers; these escape conditions log to `Λ.observation_skips`. Classification arises from observation output; pre-observation categorical classification is not a substitute.
21. **No pre-filter rationalization**: Pre-filter (coexistence exit) applies only when an explicit, named scope hierarchy rule or documented precedence ordering resolves the apparent contradiction without epistemic protocol intervention. Classifying a genuine cross-domain structural contradiction as "rule-resolvable" to avoid routing = pre-filter misuse (analogous to Rule 20's cite-or-observe guard)
22. **Divergence-bounding (frame-first)**: During Phase 1 Ctx, compute per-uncertainty `branching_factor(u)` (TYPES — distinct resolution paths ∪ side-effect branches). When `Σ_u branching_factor(u) ≥ 16` OR `|Uᵢ| × max_u branching_factor(u) ≥ 16`, the AI must present a **decision frame option set** before enumerating per-branch detail. Frame-first means: enumerate the sub-decision frames (e.g., "which posture — in-place optimization / schema redesign / offload / defer?") as a bounded choice, await user selection, then enumerate detail only within the selected frame. Enumerating side-effects or sub-branches across all frames simultaneously before framing = protocol violation — the resulting divergence forces the user to simulate multiple framings in parallel, defeating Recognition and producing the session-divergence failure mode observed in cross-session practice (user restart signal after uncontrolled side-effect enumeration). Exception: full enumeration without frame-first is permitted only when BOTH `|Uᵢ| ≤ 3` AND each `branching_factor(u) ≤ 2` AND the per-uncertainty counts are cited in the Phase 2 classify summary as `branching_factor(uᵢ) = N` (cite requirement prevents silent self-assessment "uniformly low" escape). Without cited per-uncertainty counts, the exception does not apply and frame-first is mandatory. Precedence: Rule 22 supersedes Rule 7 — when both apply, frame first, then cluster within the selected frame (Rule 7's cluster admissibility is evaluated within the framed subspace, not across all pre-framed branches).
