---
name: inquire
description: "Infer context insufficiency before execution. Surfaces uncertainties through information-gain prioritized inquiry when AI infers areas of context insufficiency, producing informed execution. Type: (ContextInsufficient, AI, INQUIRE, ExecutionPlan) → InformedExecution. Alias: Aitesis(αἴτησις)."
---

# Aitesis Protocol

Infer context insufficiency before execution through AI-guided inquiry. Type: `(ContextInsufficient, AI, INQUIRE, ExecutionPlan) → InformedExecution`.

## Definition

**Aitesis** (αἴτησις): A dialogical act of proactively inferring context sufficiency before execution, where AI identifies uncertainties, collects contextual evidence via codebase exploration to enrich question quality, and inquires about remaining uncertainties through information-gain prioritized mini-choices for user resolution.

```
── FLOW ──
Aitesis(X) → Scan(X) → Uᵢ → Ctx(Uᵢ) → (Uᵢ', Uᵣ) → Q(Uᵢ', priority) → A → X' → (loop until informed)

── MORPHISM ──
ExecutionPlan
  → scan(plan, context)                -- infer context insufficiency
  → collect(uncertainties, codebase)   -- enrich via evidence collection
  → surface(uncertainty, as_inquiry)   -- present highest-gain uncertainty
  → integrate(answer, plan)            -- update execution plan
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
Q        = Inquiry (AskUserQuestion), ordered by information gain
A        = User answer ∈ {Provide(context), Point(location), Dismiss}
X'       = Updated execution plan
InformedExecution = X' where remaining = ∅ ∨ user_esc

── PHASE TRANSITIONS ──
Phase 0: X → Scan(X) → Uᵢ?                                     -- context sufficiency gate (silent)
Phase 1: Uᵢ → Ctx(Uᵢ) → (Uᵢ', Uᵣ)                             -- context collection [Tool]
Phase 2: Uᵢ' → Q[AskUserQuestion](Uᵢ'[max_gain], progress) → A  -- uncertainty surfacing [Tool]
Phase 3: A → integrate(A, X) → X'                               -- plan update (internal)

── LOOP ──
After Phase 3: re-scan X' for remaining or newly emerged uncertainties.
New uncertainties accumulate into uncertainties (cumulative, never replace).
If Uᵢ' remains: return to Phase 1 (collect context for new uncertainties).
If remaining = ∅: proceed with execution.
User can exit at Phase 2 (early_exit).
Continue until: informed(X') OR user ESC.

── CONVERGENCE ──
informed(X') = remaining = ∅
progress(Λ) = 1 - |remaining| / |uncertainties|
narrowing(Q, A) = |remaining(after)| < |remaining(before)| ∨ context(remaining(after)) ⊃ context(remaining(before))
early_exit = user_declares_sufficient

── TOOL GROUNDING ──
Phase 1 Ctx  (collect)  → Read, Grep (context collection); WebSearch (conditional: environmental dependency)
Phase 2 Q    (extern)   → AskUserQuestion (mandatory; Esc key → loop termination at LOOP level, not an Answer)
Phase 3      (state)    → Internal state update
Phase 0 Scan (infer)    → Internal analysis (no external tool)

── MODE STATE ──
Λ = { phase: Phase, X: ExecutionPlan, uncertainties: Set(Uncertainty),
      context_resolved: Set(Uncertainty),  -- Uᵣ from TYPES
      user_responded: Set(Uncertainty),
      remaining: Set(Uncertainty), dismissed: Set(Uncertainty),
      history: List<(Uncertainty, A)>, active: Bool,
      cause_tag: String }
-- Invariant: uncertainties = context_resolved ∪ user_responded ∪ remaining ∪ dismissed (pairwise disjoint)
```

## Core Principle

**Inference over Detection**: When AI infers context insufficiency before execution, it first collects contextual evidence via codebase exploration to enrich question quality, then inquires about remaining uncertainties through information-gain prioritized mini-choices rather than assuming defaults or proceeding silently. The purpose of context collection is to ask better questions, not to eliminate them.

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-guided | FrameworkAbsent → FramedInquiry | Perspective selection |
| **Syneidesis** | AI-guided | GapUnnoticed → AuditedDecision | Decision-point gaps |
| **Hermeneia** | Hybrid | IntentMisarticulated → ClarifiedIntent | Expression clarification |
| **Telos** | AI-guided | GoalIndeterminate → DefinedEndState | Goal co-construction |
| **Horismos** | AI-guided | BoundaryUndefined → DefinedBoundary | Epistemic boundary definition |
| **Aitesis** | AI-guided | ContextInsufficient → InformedExecution | Pre-execution context inference |
| **Analogia** | AI-guided | MappingUncertain → ValidatedMapping | Abstract-concrete mapping validation |
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Execution-time risk evaluation |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:
- **Syneidesis** surfaces gaps at decision points for the user to judge (information flows AI→user) — Aitesis infers context the AI lacks before execution (information flows user→AI)
- **Telos** co-constructs goals when intent is indeterminate — Aitesis operates when goals exist but execution context is insufficient
- **Hermeneia** extracts intent the user already has (user signal) or detects expression ambiguity (AI-detected, requires confirmation) — Aitesis infers what context the system lacks

**Heterocognitive distinction**: Aitesis monitors the AI's own context sufficiency (heterocognitive — "do I have enough context to execute?"), while Syneidesis monitors the user's decision quality (metacognitive — "has the user considered all angles?"). The operational test: if the information gap would be filled by the user providing context, it's Aitesis; if it would be filled by the user reconsidering their decision, it's Syneidesis.

**Factual vs evaluative**: Aitesis uncertainties are factual — they have objectively correct answers discoverable from the environment (configs, versions, schemas). Syneidesis gaps are evaluative — they require judgment about trade-offs and consequences. This is why Phase 1 context collection exists: factual uncertainties may be partially resolved or enriched from the codebase. Evaluative gaps cannot be self-resolved.

**Litmus-test examples** (same scenario, different classification):
- Aitesis: "The codebase has both v1 and v2 API schemas — which version is the current production target?" (AI lacks a fact)
- Syneidesis: "Have you considered that migrating from v1 to v2 will require a data backfill?" (user has not considered a consequence)

## Mode Activation

### Activation

AI infers context insufficiency before execution OR user calls `/inquire`. Inference is silent (Phase 0); surfacing always requires user interaction via AskUserQuestion (Phase 2).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/inquire` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Context insufficiency inferred before execution via in-protocol heuristics. Inference is silent (Phase 0).

**Context insufficient** = the execution plan contains requirements not available in the current context and not trivially inferrable.

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

**Action**: At Phase 2, call AskUserQuestion tool to present highest information-gain uncertainty candidate for user resolution.
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
| All uncertainties resolved (context or user) | Proceed with updated execution plan |
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

Analyze execution plan requirements against available context. This phase is **silent** — no user interaction.

1. **Scan execution plan** `X` for required context: domain knowledge, environmental state, configuration details, user preferences, constraints
2. **Check availability**: For each requirement, assess whether it is available in conversation, files, or environment
3. If all requirements satisfied: proceed with execution (Aitesis not activated)
4. If uncertainties identified: record `Uᵢ` with domain, description — proceed to Phase 1

**Scan scope**: Current execution plan, conversation history, observable environment. Does NOT modify files or call external services.

### Phase 1: Context Collection

Collect contextual evidence to enrich uncertainty descriptions and improve question quality before asking the user.

1. For each uncertainty in `Uᵢ`:
   - **Call Read/Grep** to search for relevant information in codebase, configs, documentation
   - If definitive answer found: mark as context-resolved (`Uᵣ`), integrate into execution context
   - If partial evidence found: enrich uncertainty with collected evidence (`Uᵢ'`), retain for Phase 2
   - If conflicting evidence found: enrich uncertainty with conflicting findings (`Uᵢ'`), retain for Phase 2
   - If no evidence found: retain in `Uᵢ'` with empty context
2. If all uncertainties context-resolved (`Uᵢ' = ∅`): proceed with execution (no user interruption)
3. If enriched uncertainties remain (`Uᵢ' ≠ ∅`): proceed to Phase 2

**Purpose shift**: Context collection aims to ask better questions, not to eliminate them. Evidence enriches the uncertainty description presented in Phase 2, enabling the user to provide more targeted answers.

**Web context** (conditional): When uncertainty carries an environmental dependency signal
(external API versions, library maintenance status, breaking changes),
extend context collection to web search.
Web evidence is tagged with `source: "web:{url}"` for traceability.
Activation condition: `environmental(Uᵢ) ∧ ¬resolved(Uᵢ, codebase)`.

**Scope restriction**: Read-only investigation only. No test execution or file modifications.
Web search is permitted when activation condition is met.

### Phase 2: Uncertainty Surfacing

**Call the AskUserQuestion tool** to present the highest-priority remaining uncertainty.

**Selection criterion**: Choose the uncertainty whose resolution would maximally narrow the remaining uncertainty space (information gain). When priority is equal, prefer the uncertainty with richer collected context (more evidence to present).

**Surfacing format**:

```
Before proceeding, I need to verify some context:

[Specific uncertainty description]
[Evidence collected during context collection, if any]

Progress: [N resolved / M total uncertainties]

Options:
1. **[Provide X]** — [what this context enables]
2. **[Point me to...]** — tell me where to find this information
3. **Dismiss** — proceed with [stated default/assumption]
```

**Design principles**:
- **Context collection transparent**: Show what evidence was collected and what remains uncertain
- **Progress visible**: Display resolution progress across all identified uncertainties
- **Actionable options**: Each option leads to a concrete next step
- **Dismiss with default**: Always state what assumption will be used if dismissed

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

After convergence, scan session context for continuing epistemic needs and present suggestions as natural-language text (no AskUserQuestion). Display only when at least one suggestion is actionable.

**Transformation check**: Before suggesting next protocols, briefly assess whether the resolved context changed the execution plan. State in one sentence what shifted (e.g., "Resolved API version targets v2, which changes the migration approach") or note that the original plan proceeds unchanged. This is informational text — not an AskUserQuestion call.

**Protocol suggestions**: Based on session context, suggest protocols whose deficit conditions are observable:

- Decision gaps in resolved context → suggest `/gap` (gap audit before execution)
- Framework absent for informed execution → suggest `/frame` (framework recommendation)
- Mapping uncertain between context and execution → suggest `/ground` (structural mapping validation)

**Next steps**: Based on the converged output, suggest concrete follow-up actions:

- Restate execution plan with resolved context as reference
- Note any accepted uncertainties carried into execution

**Display rule**: Omit this section entirely when (a) user explicitly moved to next task, (b) no observable deficit conditions exist in session context, or (c) the user has already invoked another protocol in the current or immediately preceding message. Suggestions are informational text, not AskUserQuestion calls.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Marginal priority uncertainties only | AskUserQuestion with Dismiss as default option |
| Medium | Significant priority uncertainties, context collection partially resolved | Structured AskUserQuestion with progress |
| Heavy | Critical priority, multiple unresolved uncertainties | Detailed evidence + collection results + resolution paths |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Aitesis) only if ∃ requirement(r) : ¬available(r) ∧ ¬trivially_inferrable(r)` | Prevents false activation on clear tasks |
| Context collection first | Phase 1 before Phase 2 | Enriches question quality before asking |
| Uncertainty cap | One uncertainty per Phase 2 cycle, priority order | Prevents question overload |
| Session immunity | Dismissed (domain, description) → skip for session | Respects user's dismissal |
| Progress visibility | `[N resolved / M total]` in Phase 2 | User sees progress toward completion |
| Narrowing signal | Signal when `narrowing(Q, A)` shows diminishing returns | User can exit when remaining uncertainties are marginal |
| Early exit | User can declare sufficient at any Phase 2 | Full control over inquiry depth |
| Cross-protocol fatigue | Syneidesis triggered → suppress Aitesis for same task scope | Prevents protocol stacking (asymmetric: Aitesis context uncertainties ≠ Syneidesis decision gaps, so reverse suppression not needed) |

## Rules

1. **AI-guided, user-resolved**: AI infers context insufficiency; resolution requires user choice via AskUserQuestion (Phase 2)
2. **Recognition over Recall**: Always **call** AskUserQuestion tool to present structured options (text presentation = protocol violation)
3. **Context collection first**: Before asking the user, collect contextual evidence through Read/Grep codebase exploration to enrich question quality (Phase 1)
4. **Inference over Detection**: When context is insufficient and context collection does not fully resolve, infer the highest-gain question rather than assume — silence is worse than a dismissed question
5. **Open scan**: No fixed uncertainty taxonomy — identify uncertainties dynamically based on execution plan requirements
6. **Evidence-grounded**: Every surfaced uncertainty must cite specific observable evidence or collection results, not speculation
7. **One at a time**: Surface one uncertainty per Phase 2 cycle; do not bundle multiple uncertainties
8. **Dismiss respected**: User dismissal is final for that uncertainty domain in the current session
9. **Convergence persistence**: Mode active until all identified uncertainties are resolved or dismissed
10. **Progress visibility**: Every Phase 2 surfacing includes progress indicator `[N resolved / M total]`
11. **Early exit honored**: When user declares context sufficient, accept immediately regardless of remaining uncertainties
12. **Cross-protocol awareness**: Defer to Syneidesis when gap surfacing is already active for the same task scope
