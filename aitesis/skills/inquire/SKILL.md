---
name: inquire
description: "Infer context insufficiency before execution. Surfaces uncertainties through information-gain prioritized inquiry when AI infers areas of context insufficiency, producing informed execution. Type: (ContextInsufficient, AI, INQUIRE, ExecutionPlan) → InformedExecution. Alias: Aitesis(αἴτησις)."
---

# Aitesis Protocol

Infer context insufficiency before execution through AI-guided inquiry. Type: `(ContextInsufficient, AI, INQUIRE, ExecutionPlan) → InformedExecution`.

## Definition

**Aitesis** (αἴτησις): A dialogical act of proactively inferring context sufficiency before execution, where AI identifies uncertainties across multiple dimensions (factual, coherence, relevance), collects contextual evidence via codebase exploration, classifies each uncertainty by dimension and verifiability, and inquires about remaining uncertainties through information-gain prioritized mini-choices for user resolution.

```
── FLOW ──
Aitesis(X) → Scan(X, dimensions) → Uᵢ → Ctx(Uᵢ) → (Uᵢ', Uᵣ) →
  classify(Uᵢ', dimension) → (Uᵣ', Uₑ, Uᵢ'', Uₙ) →
  Q(classify_result + Uₑ + Uᵢ'', priority) → A → X' → (loop until informed)
-- Uₙ (non-factual): shown in classify summary, routed via Post-Convergence suggestion
-- Uᵢ'' (factual/user-dependent): Phase 2 question candidates

── MORPHISM ──
ExecutionPlan
  → scan(plan, context, dimensions)      -- infer context insufficiency (multi-dimension)
  → collect(uncertainties, codebase)     -- enrich via evidence collection
  → classify(enrichable, dimension)      -- epistemic classification (core act)
  → enrich(factual_enrichable, environment) -- empirical probe (factual only)
  → surface(classify_result + enriched + remaining, as_inquiry)
  → integrate(answer, plan)
  → InformedExecution
requires: uncertain(sufficiency(X))      -- runtime gate (Phase 0)
deficit:  ContextInsufficient            -- activation precondition (Layer 1/2)
preserves: task_identity(X)              -- task intent invariant; plan context mutated (X → X')
invariant: Inference over Detection

── TYPES ──
X        = Execution plan (current task/action about to execute)
Scan     = Context sufficiency scan: X → Set(Uncertainty)
Uncertainty = { domain: String, description: String, context: Set(Evidence) }
Evidence = { source: String, content: String }                -- collected during Ctx
Priority ∈ {Critical, Significant, Marginal}
Uᵢ       = Identified uncertainties from Scan(X)
Ctx      = Context collection: Uᵢ → (Uᵢ', Uᵣ)
Uᵢ'      = Enriched uncertainties (evidence added, not resolved)
Uᵣ       = Context-resolved uncertainties (resolved during collection)
Q        = Inquiry (gate interaction), ordered by information gain
A        = User answer ∈ {Provide(context), Point(location), Dismiss}
X'       = Updated execution plan
InformedExecution = X' where remaining = ∅ ∨ user_esc
-- Layer 1 (epistemic)
Dimension    ∈ {Factual, Coherence, Relevance} ∪ Emergent(Dimension)
               -- open set; external human communication excluded
Observability ∈ {StaticObservation, DynamicObservation, BeliefVerification}
               -- exists(fact, env) sub-modes
-- Layer 2 (tool implementation, Factual fiber only — fibration structure)
Verifiability ∈ {ReadOnlyVerifiable, ProbeEnrichable, UserDependent}
classify   = Uᵢ' → Σ(d: Dimension). Fiber(d)
             where Fiber(Factual)       = Verifiability
                   Fiber(Coherence)     = Unit    -- detect only
                   Fiber(Relevance)     = Unit    -- detect only
                   Fiber(Emergent(_))   = Unit    -- detect only (default; refinable per discovered dimension)
             -- 2-layer model = Grothendieck fibration: Layer 2 exists only over Factual fiber
             -- Coherence/Relevance → detect + route (Post-Convergence)
ProbeSpec  = { setup: Action, execute: Action, observe: Predicate, cleanup: Action }
EmpiricalProbe = (Uᵢ', ProbeSpec) → Uₑ           -- empirical enrichment
Uᵣ'        = Read-only verified uncertainties    -- resolved (no Phase 2)
Uₑ         = Probe-enriched uncertainties        -- evidence attached, proceeds to Phase 2
Uᵢ''       = Remaining user-dependent uncertainties  -- Fiber(Factual) = UserDependent; Phase 2 question
Uₙ         = Non-factual detected uncertainties     -- Fiber(d) = Unit; shown in classify summary, Post-Convergence routing
Action     = Tool call sequence (Write, Bash)

── PHASE TRANSITIONS ──
Phase 0: X → Scan(X, dimensions) → Uᵢ?                        -- context sufficiency gate (silent)
Phase 1: Uᵢ → Ctx(Uᵢ) → (Uᵢ', Uᵣ) →                         -- context collection [Tool]
         classify(Uᵢ', dimension) → (Uᵣ', Uₑ, Uᵢ'', Uₙ) →     -- epistemic classification (core act); Uₙ = non-factual (Post-Convergence)
         [if Uₑ_candidates ≠ ∅] EmpiricalProbe(Uₑ_candidates) → Uₑ  -- empirical enrichment [Tool]
Phase 2: Qs(classify_result + Uₑ + Uᵢ''[max_gain], progress) → Stop → A           -- uncertainty surfacing [Tool]
Phase 3: A → integrate(A, X) → X'                               -- plan update (internal)

── LOOP ──
After Phase 3: re-scan X' for remaining or newly emerged uncertainties.
New uncertainties accumulate into uncertainties (cumulative, never replace).
If Uᵢ' remains: return to Phase 1 (collect context for new uncertainties).
If remaining = ∅: proceed with execution.
User can exit at Phase 2 (early_exit).
Continue until: informed(X') OR user ESC.
Convergence evidence: At remaining = ∅, present transformation trace — for each u ∈ (Λ.context_resolved ∪ Λ.read_only_resolved ∪ Λ.probe_enriched ∪ Λ.user_responded), show (ContextInsufficient(u) → resolution(u)). Convergence is demonstrated, not asserted.

── CONVERGENCE ──
actionable(Λ) = uncertainties \ non_factual_detected       -- Fiber(Factual) uncertainties only
informed(X') = remaining = ∅                                -- non_factual_detected does not block convergence
progress(Λ) = 1 - |remaining| / |actionable(Λ)|            -- denominator excludes routed non-factual
narrowing(Q, A) = |remaining(after)| < |remaining(before)| ∨ context(remaining(after)) ⊃ context(remaining(before))
early_exit = user_declares_sufficient

── TOOL GROUNDING ──
-- Realization: present → TextPresent+Stop (default) | AskUserQuestion (Epistemic Protocol Preferences)
Phase 0 Scan    (infer)       → Internal analysis (no external tool)
Phase 1 Ctx     (collect)     → Read, Grep (context collection); WebSearch (conditional: environmental dependency)
Phase 1 Classify (assess)     → Internal analysis (multi-dimension assessment); Read, Grep (coherence: multi-file relation analysis)
Phase 1 Probe   (enrich)      → Write, Bash, Read (empirical enrichment, Factual only); cleanup via Bash
Phase 2 Qs      (extern)      → present (mandatory: classify result + uncertainty surfacing; Esc key → loop termination at LOOP level, not an Answer)
Phase 3         (state)       → Internal state update

── ELIDABLE CHECKPOINTS ──
-- Axis: Qc/Qs = answer space; always_gated/elidable = regret profile
Phase 2 Qs (transparent)   → always_gated (Qs: user provides context judgment on insufficiency)

── MODE STATE ──
Λ = { phase: Phase, X: ExecutionPlan, uncertainties: Set(Uncertainty),
      dimensions_detected: Set(Dimension),                           -- π₁ image of classify_results
      classify_results: Map(Uncertainty, Σ(d: Dimension). Fiber(d)), -- fibration-typed classification
      context_resolved: Set(Uncertainty),  -- Uᵣ from TYPES
      read_only_resolved: Set(Uncertainty), -- Uᵣ' from TYPES
      probe_enriched: Set(Uncertainty),    -- Uₑ from TYPES
      non_factual_detected: Set(Uncertainty), -- Uₙ from TYPES; Fiber(d) = Unit, Post-Convergence routing
      user_responded: Set(Uncertainty),
      remaining: Set(Uncertainty), dismissed: Set(Uncertainty),
      history: List<(Uncertainty, A)>, probe_history: List<(ProbeSpec, Result, Evidence)>,
      active: Bool,
      cause_tag: String }
-- Invariant: uncertainties = context_resolved ∪ read_only_resolved ∪ probe_enriched ∪ non_factual_detected ∪ user_responded ∪ remaining ∪ dismissed (pairwise disjoint)
```

## Core Principle

**Inference over Detection**: When AI infers context insufficiency before execution, it first collects contextual evidence via codebase exploration to enrich question quality, then classifies each uncertainty by dimension and verifiability — classification is the protocol's core epistemic act, not a routing sub-step. For factual uncertainties, the AI resolves read-only verifiable facts directly and enriches probe-enrichable ones with empirical evidence before asking. For non-factual dimensions (coherence, relevance), the AI detects and routes via Post-Convergence suggestion. The purpose is multi-dimensional context sufficiency sensing — asking better questions for what requires human judgment, self-resolving what can be observed, and routing what belongs to other epistemic concerns.

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
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Execution-time risk evaluation |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:
- **Syneidesis** surfaces gaps at decision points for the user to judge (information flows AI→user) — Aitesis infers context the AI lacks before execution (information flows user→AI)
- **Telos** co-constructs goals when intent is indeterminate — Aitesis operates when goals exist but execution context is insufficient
- **Hermeneia** extracts intent the user already has (user signal) or detects expression ambiguity (AI-detected, requires confirmation) — Aitesis infers what context the system lacks

**Heterocognitive distinction**: Aitesis monitors the AI's own context sufficiency (heterocognitive — "do I have enough context to execute?"), while Syneidesis monitors the user's decision quality (metacognitive — "has the user considered all angles?"). The operational test: if the information gap would be filled by the user providing context, it's Aitesis; if it would be filled by the user reconsidering their decision, it's Syneidesis.

**Factual vs evaluative**: Aitesis uncertainties span multiple dimensions — factual (objectively correct answers discoverable from the environment), coherence (consistency among collected facts), and relevance (whether collected facts are relevant to the execution goal). Syneidesis gaps are evaluative — they require judgment about trade-offs and consequences. Phase 1 context collection exists because factual uncertainties may be partially resolved or enriched from the codebase. Coherence and relevance dimensions are detected but routed to downstream protocols. Evaluative gaps cannot be self-resolved.

**Litmus-test examples** (same scenario, different classification):
- Aitesis: "The codebase has both v1 and v2 API schemas — which version is the current production target?" (AI lacks a fact)
- Syneidesis: "Have you considered that migrating from v1 to v2 will require a data backfill?" (user has not considered a consequence)

## Mode Activation

### Activation

AI infers context insufficiency before execution OR user calls `/inquire`. Inference is silent (Phase 0); surfacing always requires user interaction via gate interaction (Phase 2).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/inquire` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Context insufficiency inferred before execution via in-protocol heuristics. Inference is silent (Phase 0).

**Context insufficient** = the execution plan contains requirements not available in the current context and not trivially inferrable. Context insufficiency spans multiple dimensions: missing facts, incoherent facts, and facts not relevant to execution goals.

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

**Action**: At Phase 2, present highest information-gain uncertainty candidate with classify results via gate interaction (Qs) and yield turn.
</system-reminder>

- Aitesis completes before execution proceeds
- Loaded instructions resume after context is resolved or dismissed

**Protocol precedence**: Activation order position 4/9 (graph.json is authoritative source for information flow). Concern cluster: Planning.

**Advisory relationships**: Receives from Horismos (advisory: BoundaryMap narrows context inference scope), Prothesis (advisory: perspective simulation provides context inference recommendations), Hermeneia (advisory: background gaps suggest context insufficiency), Syneidesis (suppression: same scope suppression). Provides to Prosoche (advisory: inferred context narrows execution risk assessment), Analogia (advisory: inferred context narrows mapping domain identification); Epharmoge (suppression: pre+post stacking prevention). Katalepsis is structurally last.

### Trigger Signals

Heuristic signals for context insufficiency inference (not hard gates):

| Signal | Inference |
|--------|-----------|
| Novel domain | Knowledge area not previously addressed in session |
| Implicit requirements | Task carries unstated assumptions |
| Ambiguous scope | Multiple valid interpretations exist and AI cannot determine intended approach from available context |
| Environmental dependency | Relies on external state (configs, APIs, versions) |

**Skip**:
- Execution context is fully specified in current message
- User explicitly says "just do it" or "proceed"
- Same (domain, description) pair was dismissed in current session (session immunity)
- Phase 1 context collection resolves all identified uncertainties
- Read-only / exploratory task — no execution plan to verify

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| All uncertainties resolved (context, read-only, probe, or user) | Proceed with updated execution plan |
| All remaining uncertainties dismissed | Proceed with original execution plan + defaults |
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

Analyze execution plan requirements against available context across multiple dimensions. This phase is **silent** — no user interaction.

1. **Scan execution plan** `X` for required context: domain knowledge, environmental state, configuration details, user preferences, constraints
2. **Check availability**: For each requirement, assess whether it is available in conversation, files, or environment
3. **Dimension assessment**: Identify which dimensions are potentially insufficient — factual (missing information), coherence (conflicting information), relevance (information not relevant to goal)
4. If all requirements satisfied: present sufficiency finding per Rule 17 before proceeding (Aitesis not activated)
5. If uncertainties identified: record `Uᵢ` with domain, description — proceed to Phase 1

**Scan scope**: Current execution plan, conversation history, observable environment. Does NOT modify files or call external services.

### Phase 1: Context Collection + Classification + Empirical Enrichment

Collect contextual evidence, classify each uncertainty by dimension and verifiability, and enrich probe-eligible uncertainties with empirical evidence.

**Step 1 — Context collection**: For each uncertainty in `Uᵢ`:
- **Call Read/Grep** to search for relevant information in codebase, configs, documentation
- If definitive answer found: mark as context-resolved (`Uᵣ`), integrate into execution context
- If partial evidence found: enrich uncertainty with collected evidence (`Uᵢ'`), retain for classification
- If conflicting evidence found: enrich uncertainty with conflicting findings (`Uᵢ'`), retain for classification
- If no evidence found: retain in `Uᵢ'` with empty context

**Step 2 — Epistemic classification** (core act): For each remaining uncertainty in `Uᵢ'`:
- **Dimension assessment** (Layer 1): Is this factual, coherence, or relevance?
  - Factual: a fact is missing from context and required for execution
  - Coherence: collected facts are mutually inconsistent
  - Relevance: collected facts are not relevant to the execution goal
- **Verifiability assessment** (Layer 2, Factual dimension only — Observability sub-modes guide classification):
  - ReadOnlyVerifiable: fact exists in environment (StaticObservation or BeliefVerification) and is observable with current tools → resolve directly via extended context lookup
  - ProbeEnrichable: fact requires DynamicObservation — does not exist statically but is creatable, reversible, and bounded (< 30s) → empirical probe
  - UserDependent: neither read-only verifiable nor probe-enrichable → Phase 2 directly
- **Non-factual dimensions**: Coherence and Relevance → detect and record as `Uₙ` (non_factual_detected); routed via Post-Convergence suggestion, not Phase 2 question
- Store all results in `Λ.classify_results`

**Step 3 — Read-only verification**: For ReadOnlyVerifiable uncertainties:
- Targeted context lookup via Read/Grep — classification narrows search scope to specific files/locations that Step 1's broad sweep did not cover (e.g., spec files, config schemas identified by classify)
- Resolved: mark as `Uᵣ'` (read_only_resolved), skip Phase 2

**Step 4 — Empirical enrichment**: For ProbeEnrichable uncertainties:
- Construct ProbeSpec: { setup, execute, observe, cleanup }
- Execute probe lifecycle (setup → execute → observe → cleanup → record)
- Probe evidence attached to `Uₑ` → proceeds to Phase 2 with evidence

If all uncertainties context-resolved or read-only-resolved (no enriched or user-dependent remaining): proceed with execution (no user interruption).
If enriched or user-dependent uncertainties remain: proceed to Phase 2.

**Web context** (conditional): When uncertainty carries an environmental dependency signal
(external API versions, library maintenance status, breaking changes),
extend context collection to web search.
Web evidence is tagged with `source: "web:{url}"` for traceability.
Activation condition: `environmental(Uᵢ) ∧ ¬resolved(Uᵢ, codebase)`.

**Scope restriction**:
- Context collection: Read-only investigation (Read, Grep, WebSearch). — core preserved
- Read-only verification: Extended context lookup for verifiable facts (Read, Grep). — resolves directly
- Empirical enrichment: Minimal, reversible test execution (Write to temp, Bash, Read, cleanup).
  Probe artifacts must be created in temp locations and cleaned up after observation.
  Probes must not modify existing project files.
  Probe results are evidence for Phase 2, not resolution — enrichment, not replacement.

**Probe design constraints**:
1. **Minimal**: Create the smallest possible test artifact
2. **Reversible**: All probe artifacts must be cleaned up after observation
3. **Sandboxed**: Probes must not modify existing project files
4. **Transparent**: Log probe lifecycle in `Λ.probe_history`
5. **Bounded**: 30-second timeout → fall back to user inquiry
6. **Risk-aware**: Elevated-risk probes → reclassify as UserDependent

### Phase 2: Uncertainty Surfacing

**Present** the highest-priority remaining uncertainty with classify results via gate interaction.

**Classification transparency** (Always show): Phase 2 always includes classify results for remaining uncertainties. This is informational — no approval required. Users can override classification by stating objection. When only one uncertainty remains, inline the classification with the uncertainty description rather than showing a separate summary block.

**Surfacing format**:

Present the classification results, uncertainty description, and evidence as text output:
- **Classification summary**:
  - U1: Factual/ReadOnly (basis: evidence summary)
  - U2: Factual/Probe (basis: evidence summary)
  - U3: Coherence (basis: evidence summary) → /ground
  - U4: Relevance (basis: evidence summary) → /goal
  - Any classification to revise?
- **[Specific uncertainty description — highest priority]**
- **Evidence**: [Evidence collected during context collection and probes, if any]
- **Progress**: [N resolved / M actionable uncertainties] (excludes non-factual routed)

Then **present**:

```
How would you like to resolve this uncertainty?

Options:
1. **[Provide X]** — [what this context enables]
2. **[Point me to...]** — tell me where to find this information
3. **Dismiss** — proceed with [stated default/assumption]
```

**Design principles**:
- **Classification transparent**: Show classify results (dimension + verifiability) for all uncertainties — "visible by default, ask only on exception"
- **Context collection transparent**: Show what evidence was collected and what remains uncertain
- **Progress visible**: Display resolution progress across all identified uncertainties
- **Actionable options**: Each option leads to a concrete next step
- **Dismiss with default**: Always state what assumption will be used if dismissed

**Selection criterion**: Choose the uncertainty whose resolution would maximally narrow the remaining uncertainty space (information gain). When priority is equal, prefer the uncertainty with richer collected context (more evidence to present).

### Phase 3: Plan Update

After user response:

1. **Provide(context)**: Integrate user-provided context into execution plan `X'`
2. **Point(location)**: Record location, resolve via next Phase 1 iteration
3. **Dismiss**: Mark uncertainty as dismissed, note default assumption used

After integration:
- Re-scan `X'` for remaining or newly emerged uncertainties
- If uncertainties remain: return to Phase 1 (collect context for new uncertainties first)
- If all resolved/dismissed: proceed with execution
- Log `(Uncertainty, A)` to history

### Post-Convergence Suggestions

After convergence, scan session context for continuing epistemic needs and present suggestions as natural-language text (no gate interaction). Display only when at least one suggestion is actionable.

**Transformation check**: Before suggesting next protocols, briefly assess whether the resolved context changed the execution plan. State in one sentence what shifted (e.g., "Resolved API version targets v2, which changes the migration approach") or note that the original plan proceeds unchanged. This is informational text — not a gate interaction.

**Protocol suggestions**: Traverse each condition below against current session context. Present status (applicable/not applicable) with brief evidence for each. Omitting a condition without evaluation = protocol violation.

- `/gap` (GapUnnoticed): Decision gaps in resolved context → suggest gap audit before execution
- `/frame` (FrameworkAbsent): Framework absent for informed execution → suggest framework recommendation
- `/ground` (MappingUncertain): Mapping uncertain between context and execution → suggest structural mapping validation
**Dimension-specific routing** (non-factual Uₙ detected in classify):

| Dimension | Candidate Protocols | Selection Criterion |
|-----------|-------------------|---------------------|
| Coherence | `/ground` | structural mapping may reveal inconsistency source |
| Relevance | `/goal`, `/gap`, `/bound`, `/clarify` | deficit-matched: GoalIndeterminate→/goal, GapUnnoticed→/gap, BoundaryUndefined→/bound, IntentMisarticulated→/clarify |
| Emergent(_) | deficit-based matching | per discovered dimension's deficit condition |

Selection: match Uₙ item's observed deficit condition against candidate protocol deficit conditions.
Phase 2 classify summary shows the best-matched protocol as routing target.

**Next steps**: Based on the converged output, suggest concrete follow-up actions:

- Restate execution plan with resolved context as reference
- Note any accepted uncertainties carried into execution

**Display rule**: Omit this section entirely when (a) user explicitly moved to next task, (b) no observable deficit conditions exist in session context, or (c) the user has already invoked another protocol in the current or immediately preceding message. Suggestions are informational text, not gate interactions.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Marginal priority uncertainties only | Gate interaction with Dismiss as default option |
| Medium | Significant priority uncertainties, context collection partially resolved | Structured gate interaction with progress |
| Heavy | Critical priority, multiple unresolved uncertainties | Detailed evidence + collection results + classify results + resolution paths |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Aitesis) only if ∃ requirement(r) : ¬available(r) ∧ ¬trivially_inferrable(r)` | Prevents false activation on clear tasks |
| Context collection first | Phase 1 before Phase 2 | Enriches question quality before asking |
| Uncertainty cap | One uncertainty per Phase 2 cycle, priority order | Prevents question overload |
| Session immunity | Dismissed (domain, description) → skip for session | Respects user's dismissal |
| Progress visibility | `[N resolved / M actionable]` in Phase 2 | User sees progress on actionable (Factual) uncertainties |
| Narrowing signal | Signal when `narrowing(Q, A)` shows diminishing returns | User can exit when remaining uncertainties are marginal |
| Early exit | User can declare sufficient at any Phase 2 | Full control over inquiry depth |
| Cross-protocol fatigue | Syneidesis triggered → suppress Aitesis for same task scope | Prevents protocol stacking (asymmetric: Aitesis context uncertainties ≠ Syneidesis decision gaps, so reverse suppression not needed) |
| Classify transparency | Always show classify results (dimension + verifiability) in Phase 2 surfacing format | User sees AI's reasoning and resolution path per uncertainty |
| Routing transparency | Uₙ items show `→ /protocol` in Phase 2 classify summary | User sees routing destination before Post-Convergence |
| Probe transparency | Log probe lifecycle in Λ.probe_history | User can audit what was tested |
| Probe cleanup | All test artifacts removed after observation | No residual files |
| Probe timeout | 30s limit → fall back to user inquiry | Prevents hanging |
| Probe risk gate | Elevated-risk probes → reclassify as UserDependent | Safety preserved |

## Rules

1. **AI-guided, user-resolved**: AI infers context insufficiency; resolution requires user choice via gate interaction (Phase 2)
2. **Recognition over Recall**: Present structured options via gate interaction (Qc/Qs) and yield turn — structured content must reach the user with response opportunity. Bypassing the gate (presenting content without yielding turn) = protocol violation
3. **Context collection first, epistemic classification second**: Before asking the user, (a) collect contextual evidence through Read/Grep, (b) classify uncertainties by dimension (Factual/Coherence/Relevance) and verifiability, (c) show classification transparently in Phase 2, (d) for Factual/ReadOnly: resolve directly, (e) for Factual/Probe: run empirical probes to attach evidence, (f) for Coherence/Relevance: detect and route via Post-Convergence suggestion
4. **Inference over Detection**: When context is insufficient and context collection does not fully resolve, infer the highest-gain question rather than assume — silence is worse than a dismissed question
5. **Open scan**: No fixed uncertainty taxonomy — identify uncertainties dynamically based on execution plan requirements
6. **Evidence-grounded**: Every surfaced uncertainty must cite specific observable evidence or collection results, not speculation
7. **One at a time**: Surface one uncertainty per Phase 2 cycle; do not bundle multiple uncertainties
8. **Dismiss respected**: User dismissal is final for that uncertainty domain in the current session
9. **Convergence persistence**: Mode active until all identified uncertainties are resolved or dismissed
10. **Progress visibility**: Every Phase 2 surfacing includes progress indicator `[N resolved / M actionable]` — actionable excludes non_factual_detected (routed, not resolved)
11. **Early exit honored**: When user declares context sufficient, accept immediately regardless of remaining uncertainties
12. **Cross-protocol awareness**: Defer to Syneidesis when gap surfacing is already active for the same task scope
13. **Evidence before inquiry**: User inquiry is for judgment — not for facts the AI can discover
14. **Always show**: User can override classification without explicit approval step. Visible by default, ask only on exception
15. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via gate interaction. The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
16. **No premature convergence**: Do not declare remaining = ∅ without presenting convergence evidence trace. "All uncertainties resolved" as assertion without per-uncertainty evidence = protocol violation
17. **No silent sufficiency assumption**: If Phase 0 scan detects no uncertainties, present this finding with reasoning to user for confirmation before proceeding — do not silently declare context sufficient
