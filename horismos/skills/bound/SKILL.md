---
name: bound
description: "Define epistemic boundaries per decision. Produces BoundaryMap classifying domains as user-spec, AI-spec, or needs-calibration when boundary ownership is undefined. Type: (BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary. Alias: Horismos(ὁρισμός)."
---

# Horismos Protocol

Define epistemic boundaries per decision through AI-guided classification. Type: `(BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary`.

## Definition

**Horismos** (ὁρισμός): A dialogical act of proactively defining epistemic boundary ownership per decision, where AI probes for boundary-undefined domains, collects contextual evidence to enrich classification quality, and presents each domain for user classification into a BoundaryMap consumed by all downstream protocols.

```
── FLOW ──
Horismos(T) → Probe(T) → Bᵢ →
  |Bᵢ| = 0: skip → deactivate
  |Bᵢ| > 0: Ctx(Bᵢ) → Bᵢ' → ∀bᵢ ∈ Bᵢ': Q[AskUserQuestion](bᵢ) → A →
    Map(A, B) → B' →
    |remaining| = 0: converge(B')
    |remaining| > 0: re-probe → Phase 1

── MORPHISM ──
TaskScope
  → probe(task, context)               -- detect boundary-undefined domains
  → classify(domain, as_inquiry)       -- present domain for user boundary classification
  → integrate(response, map)           -- update BoundaryMap from user classification
  → DefinedBoundary
requires: boundary_undefined(T)         -- runtime gate (Phase 0)
deficit:  BoundaryUndefined             -- activation precondition (Layer 1/2)
preserves: task_identity(T)             -- task scope invariant; BoundaryMap mutated
invariant: Definition over Assumption

── TYPES ──
T              = TaskScope (task/project requiring boundary definition)
Probe          = T → Set(Domain) [Tool: Read, Grep, Glob]
Domain         = { name: String, description: String, evidence: Set(Evidence) }
Evidence       = { source: String, content: String }
Bᵢ             = Set(Domain) from Probe(T)                    -- boundary-undefined domains
Bᵢ'            = Set(Domain) enriched with context evidence    -- after Phase 1
Bᵣ             = Set(Domain) resolved from context             -- auto-resolved in Phase 1
Q              = Boundary inquiry ordered by impact [Tool: AskUserQuestion]
A              = User answer ∈ {UserSpec(scope), AISpec(scope), NeedsCalibration, Dismiss}
B              = BoundaryMap: Map(Domain, BoundaryClassification)
BoundaryClassification ∈ {UserSpec, AISpec, NeedsCalibration, Dismissed}
DefinedBoundary = B where |remaining| = 0 ∨ user_esc
Phase          ∈ {0, 1, 2, 3}
remaining      = Bᵢ \ (Bᵣ ∪ user_resolved ∪ dismissed)

── PHASE TRANSITIONS ──
Phase 0: T → Probe(T) → Bᵢ?                                           -- boundary detection gate (silent)
Phase 1: Bᵢ → Ctx(Bᵢ) → (Bᵢ', Bᵣ)                                     -- context collection [Tool]
Phase 2: Bᵢ' → Q[AskUserQuestion](Bᵢ'[max_impact], progress) → A       -- boundary classification [Tool]
Phase 3: A → integrate(A, B) → B'                                      -- map update (internal)

Phase 0 → Phase 1:  boundary_undefined(T) = true                       -- domains detected
Phase 0 → deactivate: boundary_undefined(T) = false                    -- no undefined boundaries
Phase 1 → Phase 2:  |Bᵢ' \ Bᵣ| > 0                                    -- unresolved domains remain after context
Phase 1 → Phase 3:  |Bᵢ' \ Bᵣ| = 0                                    -- all resolved from context
Phase 2 → Phase 3:  A received                                         -- user classified domain
Phase 3 → Phase 1:  |remaining| > 0                                    -- re-probe for newly surfaced domains
Phase 3 → converge: |remaining| = 0                                    -- all domains bounded

── LOOP ──
J = {continue, dismiss, re_probe, converge}
  continue:   Phase 2 → Phase 3 → Phase 2 (next domain)
  dismiss:    Phase 2 → Phase 3 (domain dismissed, not classified)
  re_probe:   Phase 3 → Phase 1 (integration revealed new boundary-undefined domains)
  converge:   Phase 3 → deactivate (all domains bounded)

── CONVERGENCE ──
converge iff |remaining| = 0 ∨ user_esc
  |remaining| = 0:  all domains have BoundaryClassification
  user_esc:         user exits via Esc key (ungraceful, no cleanup needed)

── TOOL GROUNDING ──
Phase 0 Probe (detect)  → Internal analysis (no external tool)
Phase 1 Ctx   (collect) → Read, Grep, Glob (codebase scan for boundary signals: CLAUDE.md, boundaries.md, rules/, prior session context)
Phase 2 Q     (extern)  → AskUserQuestion (mandatory; Esc key → loop termination at LOOP level, not an Answer)
Phase 3       (state)   → Internal state update

── MODE STATE ──
Λ = { phase: Phase, T: TaskScope,
      domains: Set(Domain),
      context_resolved: Set(Domain),
      user_resolved: Set(Domain),
      remaining: Set(Domain),
      dismissed: Set(Domain),
      boundary_map: BoundaryMap,
      history: List(Domain, A),
      active: Bool, cause_tag: String }
-- Invariant: domains = context_resolved ∪ user_resolved ∪ remaining ∪ dismissed (pairwise disjoint)
```

## Core Principle

**Definition over Assumption**: When epistemic ownership is unclear, explicitly define boundaries rather than assuming defaults. Each decision point deserves its own boundary definition. The purpose of boundary probing is to produce a shared BoundaryMap — a Transactive Memory directory that makes explicit who knows what, who decides what, and where calibration is needed.

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

**Horismos vs Aitesis**: Both are pre-execution heterocognitive protocols. Aitesis probes factual gaps (context insufficiency — "do I have enough information to execute?"), Horismos probes constitutive boundaries (ownership classification — "who decides what?"). Both share an Akinator-style functor (probe → enrich → ask → integrate), but the ontology differs: Aitesis uncertainties have factual answers discoverable from the environment, while Horismos domains require constitutive decisions about responsibility allocation. The operational test: if the answer exists somewhere in the environment, it is Aitesis; if the answer must be constituted by the user, it is Horismos.

**Horismos vs Epitrope (deprecated)**: Epitrope produced a DelegationContract via scenario-based interview, accumulating an expertise profile across interactions. Horismos produces a BoundaryMap via direct per-decision classification. No scenario calibration, no accumulated profile, no team coordination (team coordination moved to Prosoche). Each invocation starts fresh for the current task scope.

**Horismos vs Telos**: Telos constructs the goal ("what are we doing?"), Horismos defines boundaries around it ("who decides what?"). Telos operates when intent is indeterminate; Horismos operates when intent is clear but ownership is not. In precedence, Telos precedes Horismos — goals must exist before boundaries can be drawn around them.

## Mode Activation

### Activation

AI probes for boundary-undefined domains before execution OR user calls `/bound`. Probing is silent (Phase 0); classification always requires user interaction via AskUserQuestion (Phase 2).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/bound` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Boundary-undefined domains detected before execution via in-protocol heuristics. Detection is silent (Phase 0).

**Boundary undefined** = the task scope contains decision domains without clear ownership assignment between user and AI.

Gate predicate:
```
boundary_undefined(T) ≡ ∃ domain(d, T) : ¬assigned(d, owner) ∧ ¬trivially_defaultable(d)
```

### Priority

<system-reminder>
When Horismos is active:

**Supersedes**: Direct execution patterns in loaded instructions
(Boundary ownership must be defined before execution proceeds)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, call AskUserQuestion tool to present highest-impact boundary-undefined domain for user classification.
</system-reminder>

- Horismos completes before execution proceeds
- Loaded instructions resume after all domains are bounded or dismissed

**Protocol precedence**: Default ordering places Horismos after Telos and before Aitesis (Hermeneia → Telos → Horismos → Aitesis → Prothesis → Analogia → Syneidesis → Prosoche → Epharmoge; boundaries narrow context inference scope and framework selection). The user can override this default by explicitly requesting a different protocol first. Katalepsis is structurally last — it requires completed AI work (`R`), so it is not subject to ordering choices.

### Trigger Signals

Heuristic signals for boundary-undefined domain detection (not hard gates):

| Signal | Inference |
|--------|-----------|
| Multiple decision domains | Task scope involves distinct areas without clear ownership |
| Delegation uncertainty | User expresses uncertainty about who decides ("should I decide this or you?") |
| Prior protocol reference | Preceding protocol output references boundary-undefined domains |
| Stale BoundaryMap | Prior invocation's BoundaryMap may not apply (task scope changed) |

**Skip**:
- Boundary ownership is fully specified in current message or project rules
- User explicitly says "just do it" or "proceed"
- Same (domain, description) pair was dismissed in current session (session immunity)
- Phase 1 context collection resolves all identified domains
- Single-domain task with obvious ownership (no ambiguity)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| All domains classified (context or user) | Proceed with BoundaryMap as session text |
| All remaining domains dismissed | Proceed with defaults noted |
| User Esc key | Return to normal operation |

## Domain Identification

Domains are identified dynamically per task — no fixed taxonomy. Each domain is characterized by:

- **name**: The decision area where boundary ownership is unclear (e.g., "error handling strategy", "API versioning approach", "test coverage scope")
- **description**: What specifically requires boundary definition
- **evidence**: Contextual evidence collected during Phase 1 that enriches classification quality

### Impact Ordering

Impact reflects how much defining this domain's boundary would narrow the remaining boundary-undefined space and affect downstream protocol operation.

| Level | Criterion | Action |
|-------|-----------|--------|
| **High** | Multiple downstream protocols depend on this boundary | Classify first |
| **Medium** | One downstream protocol affected or moderate scope impact | Classify in order |
| **Low** | Localized scope, minimal downstream effect | Classify last, Dismiss pre-suggested |

Impact is relational, not intrinsic: the same domain may be High in one task scope and Low in another, depending on what other domains exist and which protocols are expected to activate downstream.

When multiple domains are identified, present in impact order (High → Medium → Low). Only one domain presented per Phase 2 cycle.

## Protocol

### Phase 0: Boundary Detection Gate (Silent)

Analyze task scope for boundary-undefined domains. This phase is **silent** — no user interaction.

1. **Probe task scope** `T` for decision domains: architecture choices, configuration preferences, quality standards, delegation scope, convention decisions, risk tolerance
2. **Check assignment**: For each domain, assess whether ownership is assigned in conversation, project rules, or conventions
3. If all domains have clear owners: proceed without activation (Horismos not activated)
4. If boundary-undefined domains identified: record `Bᵢ` with name, description — proceed to Phase 1

**Probe scope**: Current task scope, conversation history, CLAUDE.md rules, boundaries.md, project conventions. Does NOT modify files or call external services.

### Phase 1: Context Collection

Collect contextual evidence to enrich domain descriptions and improve classification quality before asking the user.

1. For each domain in `Bᵢ`:
   - **Call Read/Grep/Glob** to search for relevant boundary signals in CLAUDE.md, rules/, boundaries.md, project configuration
   - If definitive boundary assignment found: mark as context-resolved (`Bᵣ`), integrate into BoundaryMap
   - If partial evidence found: enrich domain with collected evidence (`Bᵢ'`), retain for Phase 2
   - If conflicting signals found: enrich domain with conflicting findings (`Bᵢ'`), retain for Phase 2
   - If no evidence found: retain in `Bᵢ'` with empty evidence
2. If all domains context-resolved (`Bᵢ' = ∅`): output BoundaryMap as session text (no user interruption)
3. If enriched domains remain (`Bᵢ' ≠ ∅`): proceed to Phase 2

**Purpose**: Context collection aims to auto-resolve where possible and enrich remaining domains with evidence, reducing user interaction to what truly requires human judgment.

**Scope restriction**: Read-only investigation only. No file modifications.

### Phase 2: Boundary Classification

**Call the AskUserQuestion tool** to present the highest-impact remaining boundary-undefined domain.

**Selection criterion**: Choose the domain whose classification would maximally narrow the remaining boundary-undefined space and most affect downstream protocol operation (impact ordering). When impact is equal, prefer the domain with richer collected evidence.

**Classification format**:

```
I need to define boundary ownership for this task:

[Domain name]: [Specific description]
[Evidence collected during context collection, if any]

Progress: [N bounded / M total domains]

Options:
1. **User-spec** — I decide: [what this means for scope]
2. **AI-spec** — AI decides: [what AI would determine]
3. **Needs calibration** — Discuss further before classifying
4. **Dismiss** — Proceed with [stated default assumption]
```

**Design principles**:
- **Context collection transparent**: Show what evidence was collected and what remains unclear
- **Progress visible**: Display classification progress across all identified domains
- **Actionable options**: Each option leads to a concrete boundary assignment
- **Dismiss with default**: Always state what assumption will be used if dismissed

### Phase 3: Map Integration

After user response:

1. **UserSpec(scope)**: Record domain as user-owned with specified scope in BoundaryMap
2. **AISpec(scope)**: Record domain as AI-owned with specified scope in BoundaryMap
3. **NeedsCalibration**: Retain domain as needs-calibration in BoundaryMap (downstream protocols treat as unresolved)
4. **Dismiss**: Mark domain as dismissed, note default assumption used

After integration:
- Re-probe `T` for remaining or newly surfaced boundary-undefined domains
- If domains remain: return to Phase 1 (collect context for new domains first)
- If all bounded/dismissed: output BoundaryMap as session text
- Log `(Domain, A)` to history

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | 1-2 domains, single-pass (no re-probe) | AskUserQuestion with Dismiss as default option |
| Medium | 3-5 domains, may re-probe once | Structured AskUserQuestion with progress |
| Heavy | 6+ domains, multiple re-probe cycles | Detailed evidence + collection results + classification paths |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Horismos) only if ∃ domain(d) : ¬assigned(d) ∧ ¬trivially_defaultable(d)` | Prevents false activation on clear tasks |
| Context collection first | Phase 1 before Phase 2 | Auto-resolves where possible, reduces user interaction |
| Domain cap | One domain per Phase 2 cycle, impact order | Prevents classification overload |
| Session immunity | Dismissed (domain, description) → skip for session | Respects user's dismissal |
| Progress visibility | `[N bounded / M total]` in Phase 2 | User sees progress toward completion |
| Auto-resolve preferred | Context-resolved domains skip Phase 2 | Minimizes user interaction |
| Recognition over recall | Present options (UserSpec/AISpec/NeedsCalibration/Dismiss) | Never ask open-ended boundary questions |

## Rules

1. **AI-guided, user-classified**: AI detects boundary-undefined domains; classification requires user choice via AskUserQuestion (Phase 2). AI detection requires implicit confirmation via proceeding.
2. **Recognition over Recall**: Always **call** AskUserQuestion tool to present structured options (text presentation = protocol violation). Options are UserSpec/AISpec/NeedsCalibration/Dismiss — never open-ended.
3. **Context collection first**: Before asking the user, collect contextual evidence through Read/Grep/Glob codebase exploration to auto-resolve where possible and enrich remaining domains (Phase 1).
4. **Definition over Assumption**: When boundary ownership is unclear, define explicitly rather than assume — silence is worse than a dismissed classification.
5. **No fixed taxonomy**: Domains emerge dynamically from task probe, not a predefined list. Do not impose categories.
6. **Context resolution preferred**: Auto-resolve from existing config, rules, and conventions where possible. Minimize user interaction to what truly requires human judgment.
7. **One at a time**: Present one domain per Phase 2 cycle; do not batch multiple domains in a single AskUserQuestion.
8. **Impact ordering**: Present domains in impact order (highest-impact first). Impact is relational — depends on downstream protocol dependencies.
9. **Session text output**: BoundaryMap is output as session text. No structured data channel. Downstream protocols naturally read it from conversation context.
10. **Circular re-probing is healthy**: Integration may surface new boundary-undefined domains. Re-probe cycles are normal dialogue. `user_esc` guarantees termination at every AskUserQuestion moment.
11. **Per-decision boundary**: Each invocation produces a fresh BoundaryMap for the current task scope. Do not carry over classifications from prior sessions or invocations.
12. **Epistemic router**: BoundaryMap is a shared resource consumed by all downstream protocols — Aitesis uses it as gate threshold, Prothesis as framework filter, Telos as goal detail level, Syneidesis as gap relevance filter, Prosoche as risk evaluation threshold. This shared consumption is why Horismos requires independent protocol status rather than absorption into any single consumer.
