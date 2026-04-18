---
name: goal
description: "Co-construct defined goals from vague intent. Builds a GoalContract when neither party has a clear end state. Type: (GoalIndeterminate, AI, CO-CONSTRUCT, VagueGoal) → DefinedEndState. Alias: Telos(τέλος)."
---

# Telos Protocol

Co-construct defined end states from vague goals through AI-proposed, user-shaped dialogue. Type: `(GoalIndeterminate, AI, CO-CONSTRUCT, VagueGoal) → DefinedEndState`.

## Definition

**Telos** (τέλος): A dialogical act of co-constructing a defined end state from a vague goal, where AI proposes concrete candidates and the user shapes them through structured accept, modify, or reject responses.

```
── FLOW ──
G → Gᵥ → detect(Gᵥ) → Dd → Dₐ → Dₛ → P → A → C' → (loop until sufficient)

── MORPHISM ──
VagueGoal
  → recognize(goal, indeterminacy)     -- confirm goal needs definition
  → detect(dimensions, evidence)       -- surface indeterminate dimensions
  → propose(dimension, candidate)      -- generate concrete falsifiable proposal
  → integrate(response, contract)      -- shape contract from user response
  → approve(contract)                  -- verify sufficiency of GoalContract
  → DefinedEndState
requires: goal_indeterminate(G)                               -- Phase 0 gate (2+ dimensions unspecified)
deficit:  GoalIndeterminate                                   -- activation precondition (Layer 1/2)
preserves: G                                                  -- read-only throughout; morphism acts on C only
invariant: Construction over Extraction

── TYPES ──
G   = User's vague goal (the goal to define)
Gᵥ  = Verified vague goal (user-confirmed)
Dd  = AI-detected dimensions ⊆ {Outcome, Metric, Boundary, Priority} ∪ Emergent(G)
      -- raw detection output, presented as full taxonomy at Phase 1
Dₛ  = Selected dimension ∈ {Outcome, Metric, Boundary, Priority} ∪ Emergent
Dₐ  = Applicable dimensions = (Dd ∪ {Outcome} ∪ Λ.emergent) \ Λ.excluded
      -- initial working set from Phase 1 relay; mutable via Phase 2 free-response override
      -- protocol constraint: Outcome ∉ Λ.excluded → Dₐ ⊇ {Outcome}
P   = Proposal (AI-generated concrete candidate)
A   = User's response ∈ {Accept, Modify(aspect, direction), Reject, Extend(aspect)}
C   = GoalContract { outcome: ?, metric: ?, boundary: ?, priority: ? }
C'  = Updated GoalContract after integration

── G-BINDING ──
bind(G) = explicit_arg ∪ colocated_expr ∪ prev_user_turn
Priority: explicit_arg > colocated_expr > prev_user_turn

/goal "text"                → G = "text"
"define goal... goal"       → G = text before trigger
/goal (alone)               → G = previous user message

Edge cases:
- Interrupt: G = original request of interrupted task
- Queued:    G = previous message at queue time (fixed)
- Re-invoke: Show prior GoalContract, confirm or restart

── PHASE TRANSITIONS ──
Phase 0:  G → recognize(G) → Qc(confirm) → Stop → Gᵥ           -- trigger + confirm [Tool]
Phase 1:  Gᵥ → detect(Gᵥ) → Dd → TextPresent(relay) → compute(Dₐ) → Dₛ  -- dimension detection + full taxonomy presentation [Tool]
Phase 2:  Dₛ → propose(Dₛ, context) → P                        -- AI proposal (sense)
        → Qs(P) → Stop → A                                      -- co-construction [Tool]
Phase 3:  A → integrate(A, C) → C'                             -- contract update (sense)
Phase 4:  C' → Qc(C', progress) → Stop → approve               -- sufficiency check [Tool]

── LOOP ──
After Phase 3: compute progress(C', Dₐ) where Dₐ reflects current Λ.excluded and Λ.emergent (recomputed each re-entry).
If undefined dimensions remain in Dₐ: return to Phase 1 (next dimension).
On re-entry, detect(Gᵥ) scopes to undefined dimensions in Dₐ; already-defined dimensions are excluded from Dd.
Re-entry is pure relay; taxonomy revision remains reachable via Phase 2 free response (adds to Λ.excluded or Λ.emergent, triggering Dₐ recomputation).
If all Dₐ defined: proceed to Phase 4.
User can trigger Phase 4 early at any Phase 1 (early_exit).
Continue until: user approves GoalContract OR user ESC.
Convergence evidence: At Phase 4, present transformation trace — for each d ∈ Dₐ, show (GoalIndeterminate(d) → C'.defined(d)). User approval is the convergence gate; the evidence trace enables informed approval.

── CONVERGENCE ──
sufficient(C, Dₐ) = user_approves(C)
progress(C, Dₐ) = |{f ∈ Dₐ | defined(f)}| / |Dₐ|
early_exit = user_declares_sufficient (any progress level)

── TOOL GROUNDING ──
-- Realization: gate → TextPresent+Stop; relay → TextPresent+Proceed
Phase 0 Qc (gate)    → present (goal confirmation + activation approval)
Phase 1 detect (sense) → Internal analysis (dimension detection from Gᵥ)
Phase 1 present (relay) → TextPresent+Proceed (full taxonomy with evidence + falsification + emergent probe + progress display; flows into Phase 2)
Phase 2 P  (observe) → Read, Grep (context for proposal generation; fallback: template)
Phase 2 Qs (gate)    → present (mandatory; Esc key → loop termination at LOOP level, not a Response)
Phase 3    (track)   → Internal GoalContract update (no external tool)
Phase 4 Qc (gate)    → present (GoalContract review + approval)
converge (relay)     → TextPresent+Proceed (convergence evidence trace; context for Phase 4 Qc GoalContract approval)

── ELIDABLE CHECKPOINTS ──
-- Axis: relay/gated = interaction kind; always_gated/elidable = regret profile
Phase 0 Qc (confirm)       → elidable when: explicit_arg via /goal "text"
                              default: proceed with inferred goal seed
                              regret: bounded (Phase 2 Qs free-response override available)
Phase 1 present (taxonomy) → relay (full taxonomy with evidence; no gate — option-set relay test: Proceed dominates under user-invoked or user-confirmed activation)
Phase 2 Qs (negotiate)     → always_gated (gated: Accept/Modify/Reject/Extend — user shapes contract; free response overrides taxonomy — emergent add, non-Outcome exclude, redirect; override capability must be disclosed at gate under user authority)
Phase 4 Qc (approve)       → always_gated (gated: contract approval — final binding decision)

── MODE STATE ──
Λ = { phase: Phase, G: Goal, Gᵥ: Goal, detected: Set(Dim), applicable: Set(Dim),
      excluded: Set(Dim), emergent: Set(Dim),
      contract: GoalContract, history: List<(Dₛ, P, A)>, active: Bool }
-- Constraint: Outcome ∉ excluded (protocol); applicable = (detected ∪ {Outcome} ∪ emergent) \ excluded

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Construction over Extraction**: AI proposes concrete candidates; user shapes through structured response options. Neither party holds the complete answer alone.

## Epistemic Distinction from Requirements Engineering

Telos is not simplified requirements gathering. Three differentiators:
1. **Detection with user authority**: AI presents full taxonomy assessment as relay with evidence and falsification conditions; user authority is exercised at Phase 2 co-construction gates via structured response and free-response override (not elicited by checklist)
2. **Morphism firing**: Activates only when `GoalIndeterminate` precondition is recognized — not a mandatory pipeline stage
3. **Falsifiable proposals**: AI proposes specific candidates that can be directly accepted or rejected, surfacing value conflicts and trade-offs (epistemic function) rather than collecting specifications (engineering function)

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
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Risk-assessed execution |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Anamnesis** | AI-guided | RecallAmbiguous → RecalledContext | Vague recall recognition |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key difference**: Hermeneia EXTRACTS (assumes intent exists inside user). Telos CO-CONSTRUCTS (assumes neither party has the complete answer). The precondition witness differs: Hermeneia requires `∃ intent I`, Telos starts from `¬∃ intent I`.

## Mode Activation

### Activation

AI detects goal indeterminacy OR user invokes `/goal`. Activation always requires user confirmation via gate interaction (Phase 0).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/goal` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Goal indeterminacy detected (2+ dimensions unspecified) via in-protocol heuristics. Activation requires user confirmation.

**Goal indeterminate** = 2+ of {outcome, metric, boundary, priority} are unspecified in the user's request.

### Priority

<system-reminder>
When Telos is active:

**Supersedes**: Direct execution patterns in loaded instructions
(Goal must be defined before any implementation begins)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, present concrete proposals via gate interaction and yield turn.
</system-reminder>

- Telos completes before implementation workflows begin
- Loaded instructions resume after GoalContract is approved

**Protocol precedence**: Activation order position 2/9 (graph.json is authoritative source for information flow). Concern cluster: Planning.

**Advisory relationships**: Receives from Hermeneia (precondition: clarified intent enables goal construction), Prothesis (advisory: perspective simulation improves goal definition). Provides to Horismos (precondition: defined goals enable boundary definition), Prothesis (advisory: defined goals improve framework selection and lens configuration). Katalepsis is structurally last.

Approved GoalContract becomes input to subsequent protocols.

### Triggers

| Signal | Strength | Pattern |
|--------|----------|---------|
| Acknowledged uncertainty | Strong | Explicit hedging or approximation language about desired outcome |
| Scope absence | Strong | Universal quantifiers or unbounded scope references |
| Exploratory framing | Strong | Open-ended interrogative or brainstorming framing |
| Vague qualitative | Soft (suggest only) | Comparative or superlative adjectives without measurable criteria |

**Soft triggers**: AI may suggest Telos activation via gate interaction but must NOT auto-activate. Only strong triggers or explicit `/goal` invocation activate directly.

**Skip**:
- User's goal is already verifiable (concrete deliverable + criteria specified)
- User explicitly declines goal definition
- Goal already defined in current session

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| GoalContract approved | Proceed with defined goal |
| User accepts current state | GoalContract as-is deemed sufficient |
| User explicitly cancels | Return to normal operation |

## Gap Taxonomy

| Type | Detection | Question Form | GoalContract Field |
|------|-----------|---------------|--------------------|
| **Outcome** | No concrete end state described | "What exists/changes when this is done?" | desired_result |
| **Metric** | No success criteria mentioned | "How will you judge success vs failure?" | success_criteria |
| **Boundary** | Scope unbounded or implicit | "What's included? What's explicitly excluded?" | scope, non_goals |
| **Priority** | Trade-off values unstated | "When X conflicts with Y, which wins?" | value_weights |

**Emergent dimension detection**: Named dimensions are working hypotheses, not exhaustive categories. Detect Emergent dimensions when:
- The goal's indeterminacy spans multiple named dimensions (e.g., outcome and boundary are entangled and cannot be defined independently)
- User includes a dimension via free-response override at Phase 2 gate that doesn't map to the four named types
- The goal involves domain-specific concerns that resist decomposition into Outcome/Metric/Boundary/Priority (e.g., stakeholder alignment, phasing/sequencing, risk tolerance)

Emergent dimensions must satisfy morphism `GoalIndeterminate → DefinedEndState` and map to a GoalContract field.

### Dimension Priority

When multiple dimensions are undefined:
1. **Outcome** (highest): End state anchors all other dimensions
2. **Boundary**: Scope constrains feasibility
3. **Priority**: Trade-off values guide choices
4. **Metric** (lowest): Success criteria refine after core is clear

Outcome is always included in applicable dimensions (minimum `|Dₐ| ≥ 1`).

## Protocol

### Phase 0: Trigger Recognition + Confirmation

Recognize goal indeterminacy and confirm activation:

1. **Strong trigger**: User uses uncertainty/exploratory language → activate with confirmation
2. **Soft trigger**: User uses vague qualitative ("improve") → suggest only, do not activate
3. **Explicit invocation**: `/goal` → skip confirmation, proceed to Phase 1

Present the detected indeterminacy as text output (e.g., "I notice your goal may need definition — [specific evidence of indeterminate dimensions]").

Then **present** to confirm activation:

```
Would you like to define the goal before proceeding?

Options:
1. **Define goal together** — co-construct what "done" looks like
2. **Proceed as-is** — the current description is sufficient
```

**Skip condition**: If G was explicitly provided via `/goal "text"`, proceed directly to Phase 1.

### Phase 1: Dimension Detection

Analyze Gᵥ to detect indeterminate dimensions, present full taxonomy assessment as **relay**, then proceed directly to Phase 2 co-construction.

**Cross-session enrichment**: Prior GoalContract patterns accumulated in Anamnesis's hypomnesis store (session recall indices written by the SessionEnd/PreCompact hook) may adjust Phase 1 dimension weighting — dimensions that were consistently important in similar goal constructions receive initial emphasis. In parallel, when **`/recollect`** has been invoked this session, the recalled context surfaces the user's prior goal-dimension preferences for adjacent work, biasing Phase 1 dimension prompts toward the axes they have already treated as constitutive. This is a heuristic input that may bias detection toward previously observed patterns; gate judgment remains with the user.

**Revision threshold**: When accumulated Emergent dimension appearances across 3+ sessions cluster around a recognizable goal construct not captured by the named dimensions, the dimension taxonomy warrants revision — promote the cluster. When a named dimension (other than Outcome, which is protocol-constrained) consistently receives trivial or vacuous detection across 3+ sessions, evaluate whether the dimension's detection criteria need sharpening or the dimension has become redundant.

Per Gap Taxonomy above. Apply priority order: Outcome → Boundary → Priority → Metric. Emergent dimensions must satisfy morphism `GoalIndeterminate → DefinedEndState`; boundary: goal definition (in-scope) vs. expression gap (→ `/clarify`) or execution context (→ `/inquire`).

**Outcome constraint**: Outcome is always included in Dₐ regardless of detection — it is a protocol constraint (`|Dₐ| ≥ 1`). If not detected, include with `[protocol constraint]` annotation. **Outcome cannot be excluded** via free-response override.

Present the full taxonomy assessment as text output — every named dimension shown with detection status, evidence, and falsification condition for undetected dimensions:

- **Outcome** ✓ detected [protocol constraint]: [specific evidence from Gᵥ, or "required by protocol — always included"]
- **Boundary** ✓ detected: [specific evidence from Gᵥ]
- **Priority** — not currently detected: [evidence considered]. Would apply if [falsification condition].
- **Metric** — not currently detected: [evidence considered]. Would apply if [falsification condition].
- **Emergent**: [If AI detects a potential emergent dimension: present as named hypothesis with evidence and boundary annotation. Otherwise: "Is there an aspect of your goal that doesn't fit the above categories?"]

Emergent dimensions include boundary annotation: "This is a goal definition gap (Telos scope). Not: expression gap (→ `/clarify`) or execution context (→ `/inquire`)"

- Detected dimensions: evidence for why the dimension needs definition
- Not-currently-detected dimensions: evidence considered + falsification condition ("would apply if [specific condition]")
- Evidence parity: each dimension (detected or not) receives comparable analytical depth

Then compute Dₐ = (Dd ∪ {Outcome} ∪ Λ.emergent) \ Λ.excluded, and proceed directly to Phase 2 for Dₐ in priority order (Outcome → Boundary → Priority → Metric).

**User override via free response**: Users may override the taxonomy at any Phase 2 gate — describe an emergent dimension (added to Λ.emergent), exclude a non-Outcome dimension (added to Λ.excluded), redirect, or declare sufficient (early exit). Outcome cannot be excluded (protocol constraint: `Outcome ∉ Λ.excluded`); attempted exclusion is rejected with explanation.

**Response classification** (discriminator for free-response parsing — closes the adversarial free-response pathway):
- **Revision**: response references named dimensions (Outcome/Metric/Boundary/Priority/Emergent) with revision verbs (exclude, remove, skip, add, redirect) → update Λ.excluded or Λ.emergent, recompute Dₐ, LOOP re-entry
- **Phase 2 answer**: response contains Accept/Modify/Reject/Extend semantics directed at the presented proposal → Phase 3 integration
- **Mixed**: response contains both revision and proposal-answer content → process revision first (update Λ, recompute Dₐ), then process Phase 2 answer in the re-entered state
- **Ambiguous**: content could be either and surface interpretation differs from latent interpretation → ask: "Your response could be interpreted as [X revision] or [Y proposal response]. Which did you intend?" (do not silently choose)
- **Outcome-exclusion attempt**: free response requesting Outcome exclusion → reject with protocol-constraint message, keep Outcome in Dₐ

On loop re-entry: show progress (`[defined]` / `[undefined]`) and re-detect only undefined dimensions. Phase 2 gates include "Sufficient — approve current GoalContract" option for early exit. If `|Dₐ \ defined| = 0` after exclusion/completion: proceed to Phase 4 (sufficiency check).

**Rationale** (option-set relay test): Under user-invoked or user-confirmed activation, "Proceed with current taxonomy" is the dominant option — a separate proceed/revise gate would present false alternatives. Full taxonomy presentation is preserved (relay) to support Recognition during Phase 2 proposal evaluation; taxonomy revision is reachable via Phase 2 gate free response with classification discriminator above.

### Phase 2: Co-Construction

**Present** a concrete proposal via gate interaction. Gate presentation yields turn for user response.

**Override disclosure (detection with user authority)**: At each Phase 2 gate, include a brief disclosure line in the pre-gate context surfacing the free-response override capability — without this disclosure the user cannot exercise authority they do not know they hold. Example disclosure: "*(Free response beyond Accept/Modify/Reject/Extend: exclude a non-Outcome dimension, add an emergent dimension, or redirect — see Phase 1 response classification. Outcome cannot be excluded.)*"

**High-context** (codebase/conversation context available via Read/Grep):

Present the context analysis and proposal as text output:
- Based on [context analysis], here is a concrete [dimension]:
  "[specific proposal grounded in codebase/conversation]"

Then **present**:

```
How would you like to proceed with this proposal?

Options:
1. Accept — proceed with this definition
2. Modify: [aspect A] / [aspect B] / [aspect C] — select what to change
3. Reject — start from different angle
```

**Low-context fallback** (no file/codebase context):

Present the dimension context as text output:
- For [dimension], here are common patterns for this type of goal.

Then **present**:

```
Which pattern fits your goal?

Options:
1. "[Template A]" — [brief description]
2. "[Template B]" — [brief description]
3. "[Template C]" — [brief description]
4. Describe directly — provide your own definition
```

**Proposal design principles**:
- **Concrete and falsifiable**: Specific enough to accept or reject immediately
- **Context-grounded**: Based on Read/Grep analysis when available, template fallback when not
- **Structured modification**: Modify options present specific aspects to change, not free text
- **Trade-off visible**: Show implications of accepting this proposal

### Phase 3: Integration

After user response:

1. **Accept**: Set GoalContract field to proposal value
2. **Modify(aspect, direction)**: Adjust proposal per user direction, re-propose if needed
3. **Reject**: Discard proposal, generate alternative approach
4. **Extend(aspect)**: Add user's aspect to existing proposal

After integration: Per LOOP — compute progress, route to Phase 1 (undefined remain) or Phase 4 (all defined).

### Phase 4: Sufficiency Check

**Present** the assembled GoalContract for approval via gate interaction.

Present the assembled GoalContract as text output:

**GoalContract — Convergence Evidence** (progress/total):

Transformation trace (each dimension Gᵥ → C'):
- **Outcome**: [defined value or "—"]
- **Metric**: [defined value or "—" or "N/A"]
- **Boundary**: [defined value or "—" or "N/A"]
- **Priority**: [defined value or "—" or "N/A"]

Then **present**:

```
How would you like to proceed with this GoalContract?

Options:
1. **Approve** — proceed with this GoalContract
2. **Revise [dimension]** — return to refine a specific field or include a previously unselected dimension
```

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Minor scope vagueness, single dimension | Gate interaction with Confirm as default option |
| Medium | Multiple undefined dimensions | Structured gate interaction with dimension-by-dimension proposal |
| Heavy | Core outcome undefined, high stakes | Detailed proposal with trade-offs + structured gate interaction |

## Rules

1. **AI-guided, user-confirmed**: AI recognizes goal indeterminacy; activation requires user approval via gate interaction (Phase 0)
2. **Recognition over Recall**: Present structured options via gate interaction and yield turn — structured content reaches the user with response opportunity. Modify options use structured sub-choices, not free text
3. **Detection with user authority**: AI presents full taxonomy assessment as relay — every named dimension with detection status, evidence, and falsification condition. Outcome always included (protocol constraint). User authority is exercised at Phase 2 co-construction gates (including free-response override: emergent add, non-Outcome exclusion, redirect), not at a separate taxonomy-confirmation gate. **Guard**: Abbreviating the taxonomy (omitting named dimensions, evidence, or falsification conditions) under the rationale that Phase 2 free-response override provides correction = protocol violation. Full taxonomy presentation at Phase 1 is structurally required regardless of relay/gate classification; override is a user authority channel, not an AI shortcut for incomplete detection
4. **Construction over Extraction**: AI proposes falsifiable candidates, not abstract questions
5. **Concrete proposals**: Every proposal must be specific enough to accept or reject
6. **User authority**: User shapes, accepts, or rejects; AI does not override
7. **Progress visibility**: Show GoalContract completion status (defined/total selected) at each Phase 1
8. **Convergence persistence**: Mode active until GoalContract approved or user ESC
9. **Early exit**: User can declare sufficient at any point (any progress level permitted)
10. **Context grounding**: Proposals based on Read/Grep when available; template fallback when not
11. **Small phases**: One dimension per cycle; no bundling unless user requests
12. **Escape hatch**: User can provide own definition for any field directly
13. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via gate interaction. The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
14. **Phase 4 requirement**: Present the assembled GoalContract with transformation trace for explicit user approval, even when all Dₐ appear defined
15. **Skip justification**: When detect(Gᵥ) finds fewer than expected undefined dimensions, present the detection evidence showing why dimensions qualify as "already defined"
16. **Full taxonomy assessment**: Phase 1 must present ALL named dimension types with detection status and evidence. Presenting only detected dimensions with a generic "Add" option = protocol violation (Recognition over Recall applied to gate content)
17. **Falsification condition**: Each not-currently-detected dimension must include "would apply if [specific condition]" — exclusion rationale without falsification condition = protocol violation
18. **Emergent probe**: Emergent slot must include an active probe question or AI-detected hypothesis with evidence. "No emergent dimensions detected" as bare statement without probe = protocol violation
19. **Option-set relay test**: If AI analysis converges to a single dominant option (option-level entropy→0), present the finding directly. Each gate option must be genuinely viable under different user value weightings
20. **Gate integrity**: The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation
