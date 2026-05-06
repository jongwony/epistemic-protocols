---
name: elicit
description: "Resolve via Extended-Mind reverse induction. Reverse-traces decision coordinates from externalized substrate (codebase, rules, past sessions, user environment) and surfaces them through cycle-emergent dimension projections; user answers explicate the coordinates until intent crystallizes. Type: (AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed × ExternalizedSubstrate) → ResolvedEndpoint. Categorical dual to Periagoge. Alias: Euporia(εὐπορία)."
---

# Euporia Protocol

Resolve abstract aporia through Extended-Mind reverse induction. Type: `(AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed × ExternalizedSubstrate) → ResolvedEndpoint`.

## Definition

**Euporia** (εὐπορία): A dialogical act of opening a way through abstract aporia, where AI reverse-traces decision coordinates from the user's externalized cognitive substrate (codebase, rules, past sessions, user environment), surfaces them as cycle-emergent dimension projections, and shapes the converging intent through user answers until the endpoint resolves.[^1]

[^1]: Greek εὐπορία (literally "good passage" — εὖ "well" + πόρος "way") names the resourcefulness toward resolution that emerges from aporia (ἀπορία, "no way through"). Plato's later dialectic threads aporia and euporia as paired moments of inquiry. The protocol borrows the resolving-passage structure and stands in categorical dual relation to Periagoge (περιαγωγή, turning-around) — Periagoge ascends from instances to abstraction (bottom-up colimit), Euporia traces from intent through substrate to coordinates (top-down reverse induction).

```
── FLOW ──
Euporia(I) → Detect(I) → aporia? →
  true:  (I, S, ctx) → Substrate access → ReverseTrace(I, S, ctx) → (D[], context) →
         Qs(D[], cycle_n) → Stop → A → integrate(A, I) → I' →
         loop until resolved(I') ∨ user_esc ∨ user_dismiss
  false: deactivate

── MORPHISM ──
IntentSeed
  → detect(aporia, axis_undetermined)        -- verify abstract aporia exists
  → access(externalized_substrate)            -- read substrate channels (codebase / rules / sessions / env)
  → reverse_trace(coordinates)                -- infer user's externalized decision coordinates
  → surface(D[], cycle_emergent)              -- present cycle-emergent dimension projections
  → integrate(answer, I)                       -- update intent per user answer
  → resolve(intent)                            -- convergence when user judges resolved
  → ResolvedEndpoint
requires: aporia(I)                            -- runtime checkpoint (Phase 0)
deficit:  AbstractAporia                       -- activation precondition (Layer 1/2)
preserves: utterance(I)                        -- I.utterance read-only; I' accumulates substrate trace
invariant: Reverse Induction over Axis-Fixed Extraction

── TYPES ──
I              = IntentSeed { utterance: String, axis: Optional(Axis) }
I'             = Updated intent (substrate-traced + user-answered)
S              = ExternalizedSubstrate { codebase, rules, sessions, env }
                 -- read-only view of user's externalized cognition
D[]            = List(DimensionProjection)     -- cycle-emergent; no fixed taxonomy
DimensionProjection = { axis_inferred: String, coordinates: List(Coordinate),
                         confidence: Float, basis: Evidence }
Coordinate     = { name: String, default: Optional(Value), question: String }
Evidence       = { source: SubstrateChannel, content: String }
SubstrateChannel ∈ {Codebase, Rules, Session, Env}
A              = UserAnswer ∈ {Provide(values), Defer(coords), Dismiss, Unknown(Partial)}
                 values         = Map(Coordinate, Value)
                 coords         = Set(Coordinate) -- defer to next cycle
R              = ResolvedEndpoint { intent_resolved: I', residual: Set(Axis) }
                 -- residual = unresolved axes delegated to downstream protocols
resolved(I')   = ∂(intent) ≈ 0 (user constitutive judgment)
cycle_n        = Nat                            -- current cycle counter; surfaced at every Phase 2
Qs             = Cycle-emergent surfacing interaction with D[] + cycle counter [Tool: Constitution interaction]
ResolvedEndpoint = I' where user_judges_resolved(I') ∨ user_dismiss(I')

── A-BINDING ──
bind(I) = explicit_arg ∪ recent_intent_seed ∪ surfaced_aporia
Priority: explicit_arg > recent_intent_seed > surfaced_aporia

/elicit "intent"           → I = IntentSeed with utterance
/elicit (alone)            → I = most recent intent seed in session
"I want to..."             → I = utterance under discussion

If no aporia signal is detectable (intent is fully axis-determined, or substrate is empty):
pause activation and surface the scan result before Phase 0, inviting the user to either
articulate further or withdraw.

── PHASE TRANSITIONS ──
Phase 0: I → Detect(I) → aporia?                                     -- detection checkpoint (silent)
Phase 1: (I, S, ctx) → Substrate access [Tool] → ReverseTrace [Internal] → (D[], context)
Phase 2: (D[], cycle_n) → Qs(D[], cycle_n) → Stop → A                -- Constitution; cycle counter visible
Phase 3: A → integrate(A, I) → I'                                    -- track, residual identification

── LOOP ──
After Phase 3: re-detect remaining aporia in I'.
If user_judges_resolved(I'): terminate, return ResolvedEndpoint.
If A = Dismiss + residual ≠ ∅: terminate with ResolvedEndpoint(residual annotated).
Else: cycle_n += 1, return to Phase 1 (re-trace substrate with updated I).
No fixed cycle cap; user esc available at every Phase 2.
Convergence evidence: per-cycle coordinate trace presented at terminate
— for each step ∈ history, show (D[step] → A[step] → I'[step]). Convergence is demonstrated, not asserted.

── CONVERGENCE ──
resolved(I') = ∃ step ∈ history : user_judges_resolved(I'[step])
early_exit = user_esc | user_dismiss
progress(Λ) = cycle_n (running counter; not bounded by a target)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Detect       (sense)        → Internal analysis (no external tool)
Phase 1 Substrate    (observe)      → Read, Grep, Bash (read-only substrate access — codebase / rules / session history / env queries)
Phase 1 ReverseTrace (observe)      → Internal analysis (axis inference + coordinate construction)
Phase 2 Qs           (constitution) → present (mandatory; cycle-emergent dimension options + cycle counter; Esc → loop termination)
Phase 3              (track)        → Internal state update
converge             (extension)    → TextPresent+Proceed (per-cycle coordinate trace; proceed with ResolvedEndpoint)

── MODE STATE ──
Λ = { phase: Phase, I: IntentSeed, I': IntentSeed, S: ExternalizedSubstrate,
      cycle_n: Nat,
      D_history: List<DimensionProjection[]>,
      A_history: List<UserAnswer>,
      residual: Set(Axis),
      resolved: Bool, active: Bool, cause_tag: String }
-- Invariant: D_history and A_history have length cycle_n (each cycle records its surfacing + answer pair, pairwise aligned)

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Substrate channel resolution emergent via session context.
```

## Core Principle

**Reverse Induction over Axis-Fixed Extraction**: When intent is articulated but its decision coordinates are implicit in the user's externalized substrate (codebase, rules, past sessions, user environment), neither AI alone nor user alone can resolve the endpoint. AI reverse-traces from the substrate to surface candidate dimension projections; the user's answers explicate which coordinates were already implicit in their externalized cognition. The resolution emerges through cycle iteration, not through axis-fixed extraction along a single pre-committed dimension.

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
| **Euporia** | Hybrid | AbstractAporia → ResolvedEndpoint | Extended-Mind reverse induction |
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Risk-assessed execution |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Anamnesis** | AI-guided | RecallAmbiguous → RecalledContext | Vague recall recognition |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:

- **Euporia vs Periagoge**: Categorical dual. Periagoge forms a new abstraction from a cocone of concrete instances (bottom-up colimit — given {Iᵢ}, construct emergent abstraction). Euporia traces decision coordinates from intent through externalized substrate (top-down reverse induction — given I, surface (D[], coordinates)). The two compose as orthogonal directions of the same dialectic substrate; they do not subsume one another.
- **Euporia vs Aitesis**: Aitesis infers context insufficiency *before execution* and asks the user to supply missing facts (information flows user→AI, fact layer). Euporia operates on *abstract aporia* — intent whose axis is itself undetermined — and the answers are not facts but coordinate values implicit in the user's externalized substrate. Aitesis asks "what is X?", Euporia asks "where in your substrate does this intent's endpoint reside?"
- **Euporia vs Prothesis**: Prothesis selects among *named* analytical frameworks for a given inquiry. Euporia surfaces *unnamed* dimension projections traced from substrate, with axes emergent per cycle. When the inquiry's frames are already named and the operation is selection, Prothesis applies; when intent is axis-agnostic and dimensions must be reverse-traced from substrate, Euporia applies.
- **Euporia vs Syneidesis**: Syneidesis surfaces decision-point gaps for the user to judge (decision-quality layer). Euporia surfaces dimension projections for the user to answer (coordinate-explication layer). The two are stack-compatible — Syneidesis can audit a Euporia-resolved endpoint for downstream gaps.

**Reverse-induction distinction**: Euporia operates on the reverse-trace from intent to externalized substrate coordinates. The operational test: Euporia applies when the intent carries `axis_undetermined(I)` and the substrate contains implicit coordinates `substrate_implicit(I)`. The substrate is the *user's* externalized cognition — their codebase, their rules, their past sessions, their environment — not the AI's pre-trained knowledge. The protocol's distinguishing feature is reverse-tracing from extended mind, not domain-general inference.

## Mode Activation

### Activation

AI detects abstract aporia OR user calls `/elicit`. Detection is silent (Phase 0); dimension surfacing always requires user interaction via Cognitive Partnership Move (Constitution) (Phase 2).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/elicit` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Abstract aporia detected via in-protocol heuristics (axis-undetermined intent + substrate-implicit coordinates). Detection is silent.

**Abstract aporia** = intent is articulated as utterance but its decision coordinates are not axis-determined; the substrate carries implicit values that can be reverse-traced into surfaceable dimensions.

Gate predicate:
```
aporia(I) ≡ ∃ requirement(r, I) : axis_undetermined(r) ∧ substrate_implicit(r)
```

### Priority

<system-reminder>
When Euporia is active:

**Supersedes**: Direct execution patterns that proceed without surfacing implicit coordinates
(Coordinates must be reverse-traced and explicated through Cognitive Partnership Move (Constitution), not assumed silently)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, present cycle-emergent dimension projections with substrate-cited basis and cycle counter via Cognitive Partnership Move (Constitution).
</system-reminder>

- Euporia completes before action dependent on the resolved endpoint proceeds
- Loaded instructions resume after resolution or Esc

**Protocol precedence**: Activation order position 8/11 (graph.json is authoritative source for information flow). Concern cluster: Planning.

**Advisory relationships**: Receives from Anamnesis (advisory: recalled session history enriches substrate scan), Horismos (advisory: BoundaryMap narrows substrate scope). Provides to Aitesis (advisory: traced coordinates narrow context inference), Periagoge (advisory: resolved endpoint may seed downstream abstraction), Horismos (advisory: resolved coordinates inform downstream boundary definition). Katalepsis is structurally last.

### Trigger Signals

| Signal | Detection |
|--------|-----------|
| Axis-undetermined intent | utterance carries action verb without specifying *which* axis (intent / goal / form / scope / framework / ...) is the relevant decision dimension |
| Substrate implicit coordinates | user's codebase / rules / past sessions / env contain decision values that the intent does not surface |
| Multi-axis dependency | intent's resolution depends on coordinates spanning multiple axes that no single axis-specific protocol covers |
| Aporia language | utterance such as "I want to ... but I'm not sure how to ..." or open-ended action statements without endpoint constraint |

**Cross-session enrichment**: Anamnesis hypomnesis store provides recalled coordinate patterns when invoked via `/recollect`; recalled coordinates seed the substrate scan but constitutive judgment remains with the user.

**Skip**:
- Intent is fully axis-determined (a single axis-specific protocol covers it)
- Substrate is empty (no externalized coordinates available — fall back to direct execution or Aitesis)
- User explicitly requests proceed without surfacing
- Same (utterance, substrate slice) was resolved or dismissed in current session (session immunity)

### Activation Conditions

Euporia activates when (a) the user's intent is articulated as an utterance, (b) the utterance does not commit to a single axis-specific protocol, (c) the user's externalized substrate carries implicit decision coordinates relevant to the intent's resolution, and (d) the substrate is reachable through read-only tools. The gate is the conjunction of axis-undetermined intent and substrate-implicit coordinates, not instance count or scenario template.

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| user_judges_resolved(I') | Return ResolvedEndpoint with per-cycle coordinate trace |
| User Esc | Return to normal operation; intent remains in-process |
| Dismiss + residual | Return ResolvedEndpoint with residual axes annotated for downstream delegation |

## Protocol

### Phase 0: Aporia Detection Checkpoint (Silent)

Analyze the intent seed for abstract aporia. Silent — no user interaction.

1. Bind seed `I` per A-BINDING priority
2. Check axis determination: scan utterance for axis-specific markers (intent verbs / goal nouns / abstraction signals / boundary phrases)
3. Check substrate availability: confirm read-only access to codebase / rules / session history / env
4. If `aporia(I)` predicate satisfied: proceed to Phase 1 with `(I, S, ctx)`
5. If intent is axis-determined: deactivate, surface routing recommendation to the matching axis-specific protocol

**Scope restriction**: Detection is silent. Does NOT modify files or call external services beyond read-only substrate scan.

### Phase 1: Substrate Access + Reverse Trace

Read substrate channels and reverse-trace dimension projections.

1. **Substrate scan**: Read/Grep over the user's codebase, rules, recent sessions; Bash for read-only env queries. Tag each evidence record with its substrate channel (Codebase / Rules / Session / Env).
2. **ReverseTrace**: From the intent and the substrate evidence, infer candidate dimensions whose coordinates are likely implicit in the substrate. Each `DimensionProjection` carries (axis_inferred, coordinates, confidence, basis).
3. **Filter by confidence**: Surface dimensions whose substrate basis is concrete; defer low-confidence dimensions to later cycles.
4. Package `(D[], context)` and proceed to Phase 2.

**Scope restriction**: Read-only investigation. No test execution or file modifications. Substrate evidence must cite a specific source.

### Phase 2: Cycle-Emergent Dimension Surfacing (Constitution)

**Present** dimension projections with substrate-cited basis and cycle counter via Cognitive Partnership Move (Constitution).

**Surfacing format**:

Present dimension projections as text output:
- **Cycle**: `cycle_n` (always visible)
- For each `DimensionProjection`:
  - **Axis**: [axis_inferred]
  - **Coordinates**: [coordinate names + question per coordinate]
  - **Substrate basis**: [evidence cited from substrate channels]
  - **Default** (when substrate-derivable): [default value with citation]
- **Resolution status**: [resolved coordinates so far / pending coordinates]

Then present per-coordinate answer slots (cycle-emergent — no fixed dialect; the slots reflect the actual coordinates of the current cycle):

```
For each surfaced coordinate, provide an answer or defer.
Or:
- Defer specific coordinates to next cycle
- Dismiss + delegate residual to downstream protocols
- Esc — terminate review
```

**Design principles**:
- **Substrate-cited basis**: Every dimension's basis cites specific substrate evidence (file:line, rule reference, session id). No speculation.
- **Cycle counter visibility**: `cycle_n` surfaced at every Phase 2; user perceives signal density and decides when to terminate.
- **Coordinate-level granularity**: User answers per-coordinate; deferral is per-coordinate.
- **Free response honored**: User may answer beyond surfaced coordinates, redirect axis, name an excluded dimension, or terminate.

### Phase 3: Integration

After user response:

1. **Provide(values)**: Update I' with provided coordinate values; mark answered coordinates.
2. **Defer(coords)**: Mark deferred coordinates; they re-enter Phase 1 substrate scan in the next cycle.
3. **Dismiss**: Mark intent as dismissed-with-residual; collect unresolved axes into `residual`. Terminate.
4. **Unknown(Partial)**: Treat as partial Defer; ambiguous coordinates re-enter the next cycle.

After integration:
- Re-detect remaining aporia in I'
- If `user_judges_resolved(I')`: terminate with ResolvedEndpoint + per-cycle trace
- Else: increment `cycle_n`, return to Phase 1 with updated I

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Single dimension, substrate evidence concrete | Brief surface + per-coordinate answer slot |
| Medium | Multiple dimensions per cycle, partial substrate evidence | Full dimension surface + coordinate-level granularity |
| Heavy | Multi-axis intent, weak substrate basis, multiple cycles expected | Full surface + substrate evidence per coordinate + explicit residual axes |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Euporia) only if axis_undetermined(I) ∧ substrate_implicit(I)` | Prevents false activation on axis-determined intent or empty substrate |
| Substrate evidence required | Phase 1 dimension projections must cite specific substrate evidence | Prevents speculation; reverse-trace must be grounded |
| Cycle counter visibility | Phase 2 surfacing always shows `cycle_n` | User perceives cycle signal density and decides when to terminate |
| Cycle-emergent option set | Phase 2 options reflect current cycle's coordinates; no fixed dialect | Adapts to actual coordinates surfaced; respects axis-emergence |
| Coordinate-level granularity | User answers per-coordinate; deferral per-coordinate | Permits partial progress within a cycle |
| Free response honored | User may answer beyond, redirect, or terminate at any Phase 2 | Full constitutive control |
| Session immunity | Resolved or dismissed (utterance, substrate slice) → skip for session | Respects user's resolution or release |
| Substrate read-only | Phase 1 substrate access uses read-only tools only | No mutation of user's externalized cognition during scan |
| User esc anytime | Esc available at every Phase 2 | No fixed cycle cap |

## Rules

1. **AI-guided substrate access, user-resolved**: AI reverse-traces dimension projections from substrate; resolution requires user answer via Cognitive Partnership Move (Constitution) (Phase 2).
2. **Recognition over Recall**: Present structured dimension surfacing via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity; Constitution interaction requires turn yield.
3. **Substrate evidence required**: Every Phase 2 dimension projection cites specific substrate evidence (file:line, rule reference, session id, env query). No speculation.
4. **Reverse Induction over Axis-Fixed Extraction**: AI does not commit to a single axis at Phase 0; the axis emerges from substrate trace. Cycle-emergent options reflect actual substrate coordinates, not pre-committed dialect families.
5. **Cycle-emergent option set**: Phase 2 options are constructed per cycle from the dimension projections of that cycle. Fixed dialect (widen / narrow / fuse / reorient) does not apply — that is Periagoge's dual structure.
6. **Free response honored**: User may answer beyond surfaced coordinates, redirect to a dimension AI did not surface, or terminate. Free response routes the next cycle's substrate scan.
7. **User constitutive endpoint**: `resolved(I')` is user judgment, not AI assertion. AI surfaces; user judges resolution.
8. **Cycle counter visibility**: `cycle_n` surfaced at every Phase 2. User perceives signal density; no fixed cycle cap; user esc available anytime.
9. **Coordinate-level granularity**: User answers per-coordinate; deferral and dismissal operate per-coordinate or per-dimension as the user specifies.
10. **Convergence persistence**: Mode active until user judges resolved, dismisses, or Esc.
11. **Substrate read-only**: Phase 1 substrate access uses read-only tools (Read, Grep, read-only Bash queries). No modification of user's externalized cognition during scan.
12. **Cross-protocol awareness**: Defer to axis-specific protocols when intent is axis-determined (a single axis covers the resolution). Euporia is for *axis-emergent* aporia, not axis-fixed deficits.
13. **Context-Question Separation**: Output substrate evidence and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the per-coordinate answer slot; the dimension surface is pre-gate context.
14. **Convergence evidence**: At resolution, present per-cycle coordinate trace — for each step in history, show (D[step] → A[step] → I'[step]). Per-step evidence is required.
15. **Categorical dual to Periagoge**: Forward-looking — Euporia and Periagoge compose as orthogonal directions of the dialectic substrate (bottom-up induction ↔ top-down reverse induction); they do not subsume one another.
16. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant coordinate value (option-level entropy → 0), present the value directly as relay. The user answer slot remains constitutive when multiple valid coordinate values exist under different user value weightings.
17. **Gate integrity**: The cycle-emergent option set is presented as a coherent dimension cluster per cycle; partial omission of surfaced coordinates without user dismissal violates this invariant. Type-preserving materialization (specializing a generic axis into a concrete coordinate while preserving the surfacing structure) is distinct from mutation.
