---
name: elicit
description: "Resolve via Extended-Mind reverse induction. Reverse-traces decision coordinates from externalized substrate (codebase, rules, past sessions, user environment) and surfaces them through cycle-emergent dimension projections; user answers explicate the coordinates until intent crystallizes. Type: (AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed × ExternalizedSubstrate) → ResolvedEndpoint. Categorical dual to Periagoge. Alias: Euporia(εὐπορία)."
---

# Euporia Protocol

Resolve abstract aporia through Extended-Mind reverse induction. Type: `(AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed × ExternalizedSubstrate) → ResolvedEndpoint`.

## Definition

**Euporia** (εὐπορία): A dialogical act of opening a way through abstract aporia, where AI reverse-traces decision coordinates from the user's externalized cognitive substrate (codebase, rules, past sessions, user environment), surfaces them as cycle-emergent dimension projections, and shapes the converging intent through user answers until the endpoint resolves.[^1]

[^1]: Greek εὐπορία (literally "good passage" — εὖ "well" + πόρος "way") names the resourcefulness toward resolution that emerges from aporia (ἀπορία, "no way through"). Plato's later dialectic threads aporia and euporia as paired moments of inquiry. The protocol borrows the resolving-passage structure and stands in directional dual relation to Periagoge (περιαγωγή, turning-around) — Periagoge ascends from instances to abstraction (bottom-up direction; given {Iᵢ}, emergent abstraction), Euporia traces from intent through substrate to coordinates (top-down direction; given I, surface (D[], coordinates)).

```
── FLOW ──
Euporia(I) → pre-detect(I, S) → signal? →
  true:  Detect(I) → aporia? →
           true:  (I, S, ctx) → Substrate access → ReverseTrace(I, S, ctx) → (D[], context) →
                  Qs(D[], cycle_n) → Stop → A → integrate(A, I) → I' →
                  loop until resolved(I') ∨ user_esc ∨ user_dismiss
           false: deactivate
  false: surface scan result, invite user to articulate or withdraw

── MORPHISM ──
IntentSeed
  → detect(aporia, axis_undetermined)        -- verify abstract aporia exists
  → access(externalized_substrate)            -- read substrate channels (codebase / rules / sessions / environment)
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
S              = ExternalizedSubstrate { codebase, rules, sessions, environment }
                 -- read-only view of user's externalized cognition
                 -- environment: machine-setup metadata (uname, pwd, tool versions, git config public fields)
                 --   excludes shell environment variables (env/printenv), .env files, secrets management tools
D[]            = List(DimensionProjection)     -- cycle-emergent; no fixed taxonomy
DimensionProjection = { axis_inferred: String, coordinates: List(Coordinate), confidence: Float }
Coordinate     = { name: String, default: Optional(Value), question: String, basis: Evidence }
Evidence       = { source: SubstrateChannel, content: String }
SubstrateChannel ∈ {Codebase, Rules, Session, Environment}
A              = UserAnswer ∈ {Provide(values), Defer(coords), Dismiss}
                 values         = Map(Coordinate, Value)
                 coords         = Set(Coordinate) -- defer to next cycle (covers ambiguous/partial answers)
R              = ResolvedEndpoint { intent_resolved: I', residual: Set(Axis) }
                 -- residual = unresolved axes delegated to downstream protocols
resolved(I')   = ∂(intent) ≈ 0 (user constitutive judgment)
cycle_n        = Nat                            -- current cycle counter; surfaced at every Phase 2
Phase          ∈ {-1, 0, 1, 2, 3}
Axis           = String                         -- emergent label; examples: "intent", "goal", "form", "scope", "framework"
Initiator      ∈ {UserInvoked, AIDetected}      -- bound at activation; informs Hybrid Phase 2 first-surface semantics
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
Phase -1: I → pre-detect(aporia signal | substrate availability)     -- pre-activation scan; if no signal: surface result and invite user to articulate or withdraw before Phase 0
Phase 0: I → Detect(I) → aporia?                                     -- detection checkpoint (silent)
Phase 1: (I, S, ctx) → Substrate access [Tool] → ReverseTrace [Internal] → (D[], context)
Phase 2: (D[], cycle_n, initiator) → Qs(D[], cycle_n) → Stop → A     -- Constitution; cycle counter visible
                                                                       -- Hybrid contract: cycle_n=1 ∧ initiator=AIDetected → first surfacing = implicit confirm-or-decline
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
Phase 1 Substrate    (observe)      → Read, Grep, Bash (read-only substrate access — codebase / rules / session history / Environment queries: machine-setup metadata only — uname, pwd, version probes, git config public fields; MUST NOT execute env/printenv/set/echo $VAR or read .env* files)
Phase 1 ReverseTrace (observe)      → Internal analysis (axis inference + coordinate construction)
Phase 2 Qs           (constitution) → present (mandatory; cycle-emergent dimension options + cycle counter; Esc → loop termination)
Phase 3              (track)        → Internal state update
converge             (extension)    → TextPresent+Proceed (per-cycle coordinate trace; proceed with ResolvedEndpoint)

── MODE STATE ──
Λ = { phase: Phase, I: IntentSeed, I': IntentSeed, S: ExternalizedSubstrate,
      cycle_n: Nat,
      D_history: List<DimensionProjection[]>,
      A_history: List<UserAnswer>,
      I_history: List<IntentSeed>,
      initiator: Initiator,
      residual: Set(Axis),
      resolved: Bool, active: Bool, cause_tag: String }
-- Cycle constraint: |D_history| = |A_history| = |I_history| = cycle_n (full statement in §Cycle State Invariant)

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Substrate channel resolution emergent via session context.
```

## Core Principle

**Reverse Induction over Axis-Fixed Extraction**: When intent is articulated but its decision coordinates are implicit in the user's externalized substrate (codebase, rules, past sessions, user environment), neither AI alone nor user alone can resolve the endpoint. AI reverse-traces from the substrate to surface candidate dimension projections; the user's answers explicate which coordinates were already implicit in their externalized cognition. The resolution emerges through cycle iteration, not through axis-fixed extraction along a single pre-committed dimension. The dimension options surface per cycle from that cycle's substrate trace; fixed dialect families (widen/narrow/fuse/reorient) do not apply — that structure belongs to Periagoge's dual.

## Cycle State Invariant

Per cycle, the trio `(D[step], A[step], I'[step])` is recorded pairwise into `D_history`, `A_history`, and `I_history`. Partial-cycle termination via user Esc during Phase 1 — when `D[]` is computed before any `A` is recorded — discards the partial entry; the invariant `|D_history| = |A_history| = |I_history| = cycle_n` is restored at the termination boundary by decrementing `cycle_n` by 1.

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-guided | FrameworkAbsent → FramedInquiry | Perspective selection |
| **Syneidesis** | AI-guided | GapUnnoticed → AuditedDecision | Decision-point gaps |
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

- **Euporia vs Periagoge**: Directional dual. Periagoge forms a new abstraction from a cocone of concrete instances (bottom-up direction — given {Iᵢ}, construct emergent abstraction). Euporia traces decision coordinates from intent through externalized substrate (top-down direction — given I, surface (D[], coordinates)). The two compose as orthogonal directions of the same dialectic substrate; they do not subsume one another.
- **Euporia vs Aitesis**: Aitesis infers context insufficiency *before execution* and asks the user to supply missing facts (information flows user→AI, fact layer). Euporia operates on *abstract aporia* — intent whose axis is itself undetermined — and the answers are not facts but coordinate values implicit in the user's externalized substrate. Aitesis asks "what is X?", Euporia asks "where in your substrate does this intent's endpoint reside?" No suppression edge in graph.json — sequential composition is intended (fact-supply ⊥ coordinate-explication operate at distinct layers).
- **Euporia vs Prothesis**: Prothesis selects among *named* analytical frameworks for a given inquiry. Euporia surfaces *unnamed* dimension projections traced from substrate, with axes emergent per cycle. When the inquiry's frames are already named and the operation is selection, Prothesis applies; when intent is axis-agnostic and dimensions must be reverse-traced from substrate, Euporia applies.
- **Euporia vs Syneidesis**: Syneidesis surfaces decision-point gaps for the user to judge (decision-quality layer). Euporia surfaces dimension projections for the user to answer (coordinate-explication layer). The two are stack-compatible — Syneidesis can audit a Euporia-resolved endpoint for downstream gaps.
- **Euporia vs Horismos**: Bidirectional advisory — Horismos → Euporia (BoundaryMap narrows substrate scope) and Euporia → Horismos (resolved coordinates inform downstream boundary). Same-session re-entry of either protocol after the other's convergence is permitted but treated as distinct activation; each invocation produces a fresh ResolvedEndpoint or BoundaryMap, with the prior instance becoming session evidence rather than auto-cycling input.

**Reverse-induction distinction**: Euporia operates on the reverse-trace from intent to externalized substrate coordinates. The operational test: Euporia applies when the intent carries `axis_undetermined(I)` and the substrate contains implicit coordinates `substrate_implicit(I)`. The substrate is the *user's* externalized cognition — their codebase, their rules, their past sessions, their environment — not the AI's pre-trained knowledge. The protocol's distinguishing feature is reverse-tracing from extended mind, not domain-general inference. When the intent is axis-determined (a single axis-specific protocol covers it), defer to that protocol; Euporia is for axis-emergent aporia, not axis-fixed deficits.

## Mode Activation

### Activation

AI detects abstract aporia OR user calls `/elicit`. Detection is silent (Phase 0); dimension surfacing always requires user interaction via Cognitive Partnership Move (Constitution) (Phase 2).

**Hybrid confirmation contract**: For AI-detected activation paths, the first Phase 2 surfacing (cycle_n=1) serves as the user-confirmation moment — Esc at the first surface deactivates without coordinate state change, satisfying the Hybrid initiator's "AI-detected trigger path requires user confirmation" contract via implicit-acknowledge-or-decline at the first dimension surface. Phase 1 substrate scan precedes this confirmation under the substrate read-only constraint (`## UX Safeguards`); no externalized state is mutated before user judgment.

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

**Protocol precedence**: Activation order position 6/9 (graph.json is authoritative source for information flow). Concern cluster: Planning.

**Advisory relationships**: Receives from Anamnesis (advisory: recalled session history enriches substrate scan), Horismos (advisory: BoundaryMap narrows substrate scope). Provides to Aitesis (advisory: traced coordinates narrow context inference), Periagoge (advisory: resolved endpoint may seed downstream abstraction), Horismos (advisory: resolved coordinates inform downstream boundary definition). Katalepsis is structurally last.

### Trigger Signals

| Signal | Detection |
|--------|-----------|
| Axis-undetermined intent | utterance carries action verb without specifying *which* axis (intent / goal / form / scope / framework / ...) is the relevant decision dimension |
| Substrate implicit coordinates | user's codebase / rules / past sessions / environment contain decision values that the intent does not surface |
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
3. Check substrate availability: confirm read-only access to codebase / rules / session history / environment
4. If `aporia(I)` predicate satisfied: proceed to Phase 1 with `(I, S, ctx)`
5. If intent is axis-determined: deactivate, surface routing recommendation to the matching axis-specific protocol

**Scope restriction**: Detection is silent. Does NOT modify files or call external services beyond read-only substrate scan.

### Phase 1: Substrate Access + Reverse Trace

Read substrate channels and reverse-trace dimension projections.

1. **Substrate scan**: Read/Grep over the user's codebase, rules, recent sessions; Bash for read-only Environment queries (machine-setup metadata only: uname, pwd, tool versions, git config public fields). MUST NOT execute `env`, `printenv`, `set`, `echo $VAR`, or read `.env*` files. Tag each evidence record with its substrate channel (Codebase / Rules / Session / Environment).
2. **ReverseTrace**: From the intent and the substrate evidence, infer candidate dimensions whose coordinates are likely implicit in the substrate. Each `Coordinate` within the projection carries (name, default, question, basis: Evidence); each `DimensionProjection` carries (axis_inferred, coordinates, confidence).
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

1. **Provide(values)**: Update I' with provided coordinate values; mark answered coordinates. Append snapshot of I' to `I_history`.
2. **Defer(coords)**: Mark deferred coordinates (covers ambiguous/partial/unknown answers); they re-enter Phase 1 substrate scan in the next cycle. Append current I' snapshot (unchanged in a Defer cycle) to `I_history` to preserve pairwise alignment with `D_history` and `A_history`.
3. **Dismiss**: Mark intent as dismissed-with-residual; collect unresolved axes into `residual`. Terminate.

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
2. **User constitutive interaction**: User answers operate at three layers — coordinate-level (per-coordinate provide/defer/dismiss), endpoint-level (`resolved(I')` is user judgment, not AI assertion), and frame-level (user may redirect to an unsurfaced dimension or terminate; free response routes the next cycle's substrate scan).
3. **Convergence persistence**: Mode active until user judges resolved, dismisses, or Esc.
