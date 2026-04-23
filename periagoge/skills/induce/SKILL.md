---
name: induce
description: "Crystallize in-process abstraction through dialectical triangulation. Proposes candidate abstractions with personalized grounding examples and shapes them via user widen/narrow/fuse/reorient moves when an instance set has converged toward an unnamed essence, producing crystallized abstraction. Type: (AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction. Alias: Periagoge(περιαγωγή)."
---

# Periagoge Protocol

Crystallize in-process abstraction through AI-proposed candidate plus user dialectical triangulation. Type: `(AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction`.

## Definition

**Periagoge** (περιαγωγή): A dialogical act of turning an in-process abstraction toward its crystallized form, where AI detects when an instance set has converged toward an unnamed essence, proposes a candidate abstraction paired with a personalized grounding example drawn from the user's own domain, and shapes the candidate through user responses — Confirm, Widen (Synagoge), Narrow (Diairesis), Fuse with an adjacent abstraction, or Reorient onto an orthogonal axis — until the abstraction locates itself.[^1]

[^1]: The name draws a structural analogy from Plato *Republic* VII.518d, where περιαγωγή names the soul's turning-around toward the intelligible. The protocol borrows the turning-toward structure; it does not claim Platonic paideia. Synagoge (συναγωγή, collection) and Diairesis (διαίρεσις, division) are the twin dialectical moves described in *Phaedrus* 265d–266a; here they name user response families, not a claim to Platonic method.

```
── FLOW ──
Periagoge(A) → Detect(A) → in_process? →
  true:  (Iᵢ, E, L?) → Propose(Iᵢ, E, ctx) → (P, G) →
         Qs(P, G, progress) → Stop → V → integrate(V, candidate) → candidate' →
         loop until crystallized(A) ∨ user_esc ∨ attempts_exhausted
  false: deactivate

── MORPHISM ──
A
  → detect(instances, essence, locator)   -- verify in-process abstraction exists
  → propose(candidate, grounding)         -- AI generates candidate + personalized example
  → triangulate(candidate, user_move)     -- user shapes via widen/narrow/fuse/reorient
  → integrate(V, candidate)               -- update candidate per user response
  → crystallize(abstraction)              -- convergence when confirmed
  → CrystallizedAbstraction
requires: in_process(A)                    -- runtime gate (Phase 0)
deficit:  AbstractionInProcess              -- activation precondition (Layer 1/2)
preserves: instance_set(A)                  -- Iᵢ read-only; candidate mutates across loop
invariant: Dialectical Triangulation over Unilateral Proposal

── TYPES ──
A              = AbstractionSeed (in-process state: instances + essence intuition + optional label)
Detect         = A → (Bool, (Iᵢ, E, L?) if true)
Iᵢ             = Set(Instance)                             -- instance set observed; cardinality unconstrained (any N ≥ 1 qualifies when essence is sensed; richer sets provide stronger triangulation material)
Instance       = { content: String, context: String }       -- concrete case observed
E              = EssenceIntuition                           -- variation-stable core signal from conversation
L              = Option(TentativeLabel)                     -- user-provided provisional name, if any
P              = CandidateAbstraction { name, structure, instance_map, provenance }
G              = GroundingExample { scenario: String, domain: String, mapping: String }
                                                             -- personalized to user's own domain context
Propose        = (Iᵢ, E, ctx) → (P, G)
V              = UserMove ∈ {Confirm, Widen(direction), Narrow(specializer), Fuse(adjacent), Reorient(axis), Dismiss}
                 direction    ∈ {upward, lateral}           -- Synagoge family; AI-proposed broadening (user Recognition mode)
                 specializer  = dimension to constrain      -- Diairesis family (user-directed specialization)
                 adjacent     = neighboring abstraction ref  -- lateral Synagoge with user-named reference (user Production mode)
                 axis         = orthogonal dimension         -- full redirection
Qs             = Shaping interaction with candidate + grounding [Tool: gate interaction]
crystallized(A) = ∃ step ∈ history : V(step) = Confirm
CrystallizedAbstraction = P where confirmed(P) via Confirm move

── A-BINDING ──
bind(A) = explicit_arg ∪ recent_instance_cluster ∪ surfaced_essence
Priority: explicit_arg > recent_instance_cluster > surfaced_essence

/induce "theme"              → A = AbstractionSeed with theme label
/induce (alone)              → A = most recent instance cluster in session (any cardinality)
"the pattern across..."      → A = instance cluster under discussion

If no essence signal is detectable (neither user sensing language nor AI-inferrable core pattern): pause activation and surface the scan result before Phase 0, inviting the user to either name what feels in-process or withdraw.

── PHASE TRANSITIONS ──
Phase 0: A → Detect(A) → in_process?                                       -- detection gate (silent)
Phase 1: (Iᵢ, E, L?) → Propose(Iᵢ, E, ctx) → (P, G)                        -- candidate + grounding construction [Tool]
Phase 2: (P, G) → Qs(P, G, progress) → Stop → V                            -- triangulation gate [Tool]
Phase 3: V → integrate(V, candidate) → candidate'                          -- candidate update (track)

── LOOP ──
After Phase 3: evaluate user move.
If V = Confirm: crystallize(candidate), terminate.
If V = Widen(direction): candidate' = widened(candidate, direction) via Synagoge → return to Phase 2.
If V = Narrow(specializer): candidate' = narrowed(candidate, specializer) via Diairesis → return to Phase 2.
If V = Fuse(adjacent): candidate' = fused(candidate, adjacent) via lateral Synagoge → return to Phase 1 (grounding recomputed).
If V = Reorient(axis): candidate' = orthogonal(axis) → return to Phase 1 (full recompute).
If V = Dismiss: abandon candidate; if essence still sensed, return to Phase 1 with fresh candidate; else deactivate.
Max 5 triangulation attempts per abstraction seed.
Continue until: crystallized(A) ∨ user_esc ∨ attempts_exhausted.
Convergence evidence: At crystallized(A), present transformation trace — for each step ∈ history, show (candidate → user_move → candidate'). Convergence is demonstrated, not asserted.

── CONVERGENCE ──
crystallized(A): see TYPES (V = Confirm in history)
progress(Λ) = |history| / max_attempts
early_exit = user_esc ∨ attempts_exhausted

── TOOL GROUNDING ──
-- Realization: gate → TextPresent+Stop; relay → TextPresent+Proceed
Phase 0 Detect     (sense)   → Internal analysis (no external tool)
Phase 1 Propose    (observe) → Read, Grep (user's domain context for personalized grounding); WebSearch (conditional: cross-domain adjacent abstractions)
Phase 2 Qs         (gate)    → present (mandatory; Esc key → loop termination at LOOP level, not a UserMove)
Phase 3            (track)   → Internal state update
converge           (relay)   → TextPresent+Proceed (convergence evidence trace; proceed with crystallized abstraction)

── ELIDABLE CHECKPOINTS ──
-- Axis: relay/gated = interaction kind; always_gated/elidable = regret profile
Phase 2 Qs (triangulate)   → always_gated (gated: Confirm/Widen/Narrow/Fuse/Reorient/Dismiss — user shapes abstraction via constitutive judgment; free response overrides presented options)

── MODE STATE ──
Λ = { phase: Phase, A: AbstractionSeed, Iᵢ: Set(Instance), E: EssenceIntuition,
      candidate: Option(P), grounding: Option(G),
      history: List<(P, G, V)>, attempts: Nat, crystallized: Option(P),
      active: Bool, cause_tag: String }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Dialectical Triangulation over Unilateral Proposal**: When an instance set has converged toward an unnamed essence but the abstraction has not located itself, neither AI nor user alone can crystallize the form. AI proposes a candidate paired with a personalized grounding example drawn from the user's own domain; the user shapes through Socratic moves — widening (Synagoge), narrowing (Diairesis), fusing with an adjacent abstraction, or reorienting onto an orthogonal axis. The abstraction turns toward its crystallized form through the exchange, not by unilateral AI assertion.

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

- **Periagoge vs Analogia**: Categorical dual. Analogia validates a given abstract structure against a concrete target (static substitution — given Sₐ, establish Sₐ → Sₜ correspondence). Periagoge forms a new abstraction from concrete instances (dynamic colimit — given {Iᵢ}, construct emergent abstraction). When the input is a colimit-shaped instance set with no pre-existing abstract structure, forcing it into Analogia's substitution interface produces source-domain confabulation; Periagoge resolves that misfit by handling abstraction formation directly.
- **Periagoge vs Telos**: Both construct rather than extract, but target different categories. Telos constructs goals (what to do); Periagoge constructs abstractions (how to see patterns across cases). A goal can be concrete and singular; an abstraction collects multiple concrete instances under a shared essence.
- **Periagoge vs Hermeneia**: Hermeneia clarifies existing intent — user has an intent that needs articulation. Periagoge forms a new abstraction — user has instances and essence intuition but no located abstraction yet. The precondition witness differs: Hermeneia requires `∃ intent I`, Periagoge starts from `¬located(A)` while `essence_sensed(A)`.
- **Periagoge vs Prothesis**: Prothesis selects among candidate analytical frameworks (including cases where multiple candidates are already named). Periagoge forms a new abstraction from an instance cocone when no locator is available. Comparative analysis between already-named candidate readings — even with multiple instances or strong essence sensing — is Prothesis territory (frame selection), not Periagoge's colimit formation. Scope is specified by the operation kind, not by instance count.

**Formation distinction**: Periagoge operates on the colimit — the emergent structure arising from a cocone of concrete instances, not a substitution into a pre-existing frame. The operational test: if 3+ concrete instances with a sensed essence are present but no located abstraction yet, it is Periagoge; if an abstract structure already exists and needs validation against a concrete target, it is Analogia; if a goal needs defining, it is Telos; if an intent needs articulating, it is Hermeneia.

## Mode Activation

### Activation

AI detects in-process abstraction OR user calls `/induce`. Detection is silent (Phase 0); candidate proposal plus triangulation always requires user interaction via gate interaction (Phase 2).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/induce` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: In-process abstraction detected via in-protocol heuristics (essence intuition signal + absent locator; instance cluster supports but does not gate detection). Detection is silent (Phase 0).

**In-process abstraction** = an essence is sensed toward which an abstraction is forming, but the abstraction has not located itself (no settled name, scope, or positional claim). Instance count is evidence for the sensing, not a gate on activation — a single strongly-gripping instance may qualify; multiple instances provide richer triangulation material.

Gate predicate:
```
in_process(A) ≡ essence_sensed(A) ∧ ¬located(A)
```

Periagoge's scope is specified by **operation**: colimit formation — constructing a new abstraction from an instance cocone when essence is sensed but no locator is yet available. Instance cardinality is a **trigger signal** (see Trigger Signals table): a single strongly-gripping case can trigger formation; accumulated sets simply offer richer triangulation material. The operation distinguishes Periagoge from adjacent protocols: comparative analysis between already-named readings or frames belongs to Prothesis (frame selection); audit of decision gaps belongs to Syneidesis (gap); only colimit formation is Periagoge territory.

### Priority

<system-reminder>
When Periagoge is active:

**Supersedes**: Direct output patterns that assert a label without triangulation
(Abstraction must be crystallized through dialectical exchange, not unilaterally proposed)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, present candidate abstraction plus personalized grounding example via gate interaction and yield turn.
</system-reminder>

- Periagoge completes before output dependent on the crystallized abstraction proceeds
- Loaded instructions resume after crystallization or Esc

**Protocol precedence**: Activation order position 7/10 (graph.json is authoritative source for information flow). Concern cluster: Analysis.

**Advisory relationships**: Receives from Hermeneia (advisory: clarified intent narrows the abstraction seed but is not required — activation depends only on instance-set signals, not on prior intent clarification), Anamnesis (advisory: recalled adjacent abstractions provide Fuse candidates). Provides to Katalepsis (precondition via wildcard: crystallized abstraction enables comprehension verification). Katalepsis is structurally last.

### Trigger Signals

Heuristic signals for in-process abstraction detection (not hard gates):

| Signal | Detection |
|--------|-----------|
| Instance accumulation | concrete cases (1+ with strong grip, commonly 3+) appear in conversation without a pre-existing abstract name; count is supportive evidence for essence sensing, not a hard gate |
| Essence intuition language | User phrases such as "something about these cases...", "the pattern I'm seeing...", "these all have...", "why do these keep happening..." |
| Absent locator | No settled name, scope, or positional claim for the emerging abstraction |
| Analogia misfit redirect | `/ground` Phase 0 detects colimit-shaped input (3+ instances, no pre-existing abstract structure) and nudges to `/induce` |
| Adjacent abstraction surfacing | Recall yields neighboring abstractions, suggesting a fuse or specialize move is imminent |

**Cross-session enrichment**: Accumulated abstraction formation history from Anamnesis's hypomnesis store (session recall indices written by the SessionEnd/PreCompact hook) provides Fuse candidates for Phase 1 — previously crystallized abstractions in adjacent domains become lateral Synagoge targets. When `/recollect` has been invoked in session, recalled adjacent abstractions enter the candidate construction pool as fuse-reference. Heuristic input may bias toward previously observed patterns; gate judgment remains with the user.

**Skip**:
- No essence signal detectable (neither user sensing language nor AI-inferrable core pattern)
- Abstraction already located (name + scope + position settled) — no in-process state to turn
- User explicitly names the abstraction without in-process signals
- `/ground` substitution is the actual need (abstract structure exists; validate against concrete target)
- Comparative analysis between already-named candidate readings or frames — defer to Prothesis (frame selection) or Syneidesis (gap in decision); this is not colimit formation regardless of instance count
- Same (instance set, essence) pair was crystallized or dismissed in current session (session immunity)

### Canonical Invocation Scenarios

Periagoge's scope, stated positively by canonical use patterns:

| # | Scenario | Prototype | Structure |
|---|----------|-----------|-----------|
| S1 | **Review-time pattern accumulation** — multiple observations accumulating during ongoing review/work feel coherent but lack a name | PR-review session recognizing a recurring deficit pattern; multi-sprint retro finding common success factors | accumulated observations + review/reflection context |
| S2 | **Terminology crystallization** — several loose phrases are being used interchangeably and need consolidation into a single precise term | "eidetic variation" settling a previously loose terminological space; informal "we keep saying X-ish" → settled term | lexical colimit |
| S3 | **Cross-domain structural sensing** — parallel structures observed across different domains; user wants to name the shared essence | same pattern across multiple projects/codebases; "these pipelines feel structurally similar" | cross-domain colimit |
| S4 | **Meta-pattern in own recurring work** — reflection on a recurring cognitive/behavioral move in one's own practice → naming | "I keep doing X in different contexts" → formalization as a principle | self-reflective colimit |

**Edge case (still valid)**: Single instance with strong phenomenological grip — e.g., "yesterday I was in a strange mode, what was that?" — qualifies when essence_sensed is active and no locator exists. Rare but legitimate.

**Non-scenarios (out of scope — defer to named protocol)**:
- Comparative analysis between already-named candidate readings/frames → Prothesis (`/frame`) or Syneidesis (`/gap`)
- Validating an existing abstract structure against a concrete target → Analogia (`/ground`)
- Articulating a misexpressed intent that is already clear internally → Hermeneia (`/clarify`)
- Co-constructing a goal with no clear end state → Telos (`/goal`)

The operational test: "Is the user operation *forming a new abstraction from observed instances*, or is it something else (selecting, validating, articulating, goaling)?" Only the first is Periagoge.

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| User confirms candidate | Crystallize and proceed |
| User Esc key | Return to normal operation; abstraction remains in-process |
| Attempt cap reached (5 triangulations) | Surface remaining candidate with explicit unresolved status, deactivate |

## Protocol

### Phase 0: In-Process Detection Gate (Silent)

Analyze conversation state for in-process abstraction. This phase is **silent** — no user interaction.

1. **Bind seed** `A`: use explicit argument or the most recent instance cluster surfaced in session (any cardinality qualifies when essence is sensed — N=1 (strong-grip single case), N=2 (paired comparison), N≥3 (accumulated set))
2. **Check essence signal** `E`: scan for variation-stable core signal in conversation (user essence-intuition language or AI-inferred pattern). This is the primary gate — if no essence is sensed, the abstraction has nothing to turn toward
3. **Check locator absence**: if a name plus scope plus position is already settled, skip (no turning needed)
4. If essence_sensed ∧ ¬located: proceed to Phase 1 with `(Iᵢ, E, L?)`
5. If Analogia misfit signal is present (colimit-shaped input forced into substitution): absorb the misfit as valid Periagoge trigger without re-confirmation

**Scope restriction**: Detection is silent. Does NOT modify files or call external services.

### Phase 1: Candidate Proposal + Grounding Construction

Generate candidate abstraction with a personalized grounding example.

1. **Synthesize candidate** `P`: from `(Iᵢ, E)`, construct a named abstraction with structure and instance-to-abstraction mapping. The candidate is a working hypothesis, not a claim.
2. **Construct personalized grounding** `G`: call Read/Grep to collect evidence about the user's own domain context (codebase, configs, session history). The grounding example must be drawn from the user's domain — a scenario they recognize as theirs — not a generic textbook case.
   - When the user's domain is outside the current codebase (external API, academic field, professional practice), extend context collection to web search (WebSearch). Tag web evidence with `source: "web:{url}"` for traceability.
3. **Check adjacent abstractions**: if recall (Anamnesis hypomnesis store or in-session history) surfaces neighboring abstractions, note them as Fuse candidates for Phase 2.
4. Package `(P, G)` with Fuse candidates and proceed to Phase 2.

**Scope restriction**: Read-only investigation (Read, Grep, WebSearch). No test execution or file modifications.

### Phase 2: Dialectical Triangulation Gate

**Present** the candidate and grounding example via gate interaction.

**Surfacing format**:

Present the candidate as text output:
- **Candidate**: [name] — [structural description]
- **Instance map**: [how Iᵢ maps to the candidate's structure]
- **Grounding example**: [scenario drawn from user's domain, with mapping to the candidate]
- [If Fuse candidates exist: list adjacent abstractions with brief relation]
- **Progress**: [attempt N of max 5]

Then **present**:

```
Does this candidate crystallize the abstraction you were forming?

Options:
1. **Confirm** — [what the crystallized abstraction enables downstream]
2. **Widen (Synagoge)** — AI-proposed broadening (Recognition mode) — [how upward or lateral scope expansion from AI's domain knowledge reshapes the candidate]
3. **Narrow (Diairesis)** — [what dimension specializes or what to exclude]
4. **Fuse** — user-named adjacent reference (Production mode) — [which adjacent abstraction to explicitly pull in for merge] *(presented only when Phase 1 surfaces adjacent candidates; otherwise omitted)*
5. **Reorient** — [what orthogonal axis to pursue instead]
6. **Dismiss** — [what assumption about this essence is released]
```

When Phase 1 surfaces no adjacent candidates, omit the Fuse option — dead signal suppression. Free response is always available — the user may name an adjacent abstraction for fusion, propose an alternative abstraction, specify a dimension not captured by the presented moves, or describe a shape the options do not cover.

**Design principles**:
- **Personalized grounding**: Never use a generic example. The grounding must be drawn from the user's domain context so they can recognize it as theirs.
- **Socratic shaping**: Each move (widen/narrow/fuse/reorient) is a recognized dialectical turn, not a free-form revision request.
- **Progress visible**: Display attempt counter; attempt cap bounds generative refinement.
- **Free response honored**: When the presented moves do not capture the user's shape, parse free response as candidate redirection.

### Phase 3: Integration

After user response:

1. **Confirm**: Record `crystallized(P)` in Λ, terminate with convergence evidence trace.
2. **Widen(direction)**: Apply Synagoge — for `direction = upward`, generalize the candidate's scope; for `direction = lateral`, broaden sibling coverage. Return to Phase 2 with widened candidate (grounding may persist).
3. **Narrow(specializer)**: Apply Diairesis — constrain the candidate along the specified dimension, excluding instances that fall outside. Return to Phase 2 with narrowed candidate.
4. **Fuse(adjacent)**: Lateral Synagoge — merge candidate with named adjacent abstraction. Return to Phase 1 (grounding must be recomputed for fused structure).
5. **Reorient(axis)**: Abandon current axis, restart along orthogonal dimension. Return to Phase 1 (full recompute).
6. **Dismiss**: Release the candidate. If essence is still sensed, return to Phase 1 with fresh candidate proposal; else deactivate.

After integration:
- Log `(P, G, V)` to history
- Increment attempts counter
- Check attempt cap (max 5) — if exceeded, surface unresolved candidate with explicit status and deactivate

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Small instance set (3-4), clear essence | Brief candidate + one grounding example |
| Medium | Moderate instance set (5-8), essence present but ambiguous | Candidate + grounding + fuse candidates if recall surfaces them |
| Heavy | Large instance set, multiple plausible axes, adjacent abstractions compete | Full candidate decomposition + grounding + fuse candidates + orthogonal probes |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Periagoge) only if essence_sensed ∧ ¬located` | Prevents false activation on settled abstractions or essence-less inputs; instance count is evidence-for-essence, not a gate |
| Personalized grounding | Phase 1 requires grounding drawn from user's own domain context | Prevents generic textbook examples that fail to trigger recognition |
| Socratic moves preserved | Phase 2 options map to dialectical families (Synagoge/Diairesis/Fuse/Reorient) | Each move has a recognized shape, not open-ended revision |
| Session immunity | Crystallized or dismissed (Iᵢ, E) pair → skip for session | Respects user's crystallization or release |
| Attempt cap | Max 5 triangulations per abstraction seed | Prevents infinite refinement; forces convergence or release |
| Progress visibility | Attempt counter in Phase 2 surfacing | User sees remaining budget |
| Free response honored | Alternative abstraction via free response routes to Phase 1 | Supports reorient beyond presented axes |
| Analogia misfit absorption | `/ground` colimit-detection nudge routes here | Prevents source-domain confabulation in substitution path |

## Rules

1. **AI-guided, user-triangulated**: AI detects in-process abstraction and proposes candidates; crystallization requires user move via gate interaction (Phase 2).
2. **Recognition over Recall**: Present structured options via gate interaction and yield turn — structured content reaches the user with response opportunity; gate interaction requires turn yield before proceeding.
3. **Candidate plus grounding required**: Every Phase 2 surfacing pairs a candidate abstraction with a personalized grounding example drawn from the user's own domain context.
4. **Dialectical Triangulation over Unilateral Proposal**: AI candidate is a working hypothesis, not a claim. Crystallization belongs to the user's move.
5. **Personalized grounding**: The grounding example must be recognizable to the user as theirs — drawn from their codebase, configs, session history, or stated domain. Generic textbook examples fail the personalization requirement.
6. **Socratic move preservation**: Phase 2 options map to recognized dialectical families. Widen = Synagoge (upward or lateral). Narrow = Diairesis. Fuse = lateral Synagoge with adjacent abstraction. Reorient = orthogonal redirection. The vocabulary is operational, not ornamental.
7. **Free response honored**: When presented moves do not capture the user's shape, free response routes the candidate to reorient or fresh proposal. The user may also name an adjacent abstraction via free response when Fuse is not presented (because Phase 1 surfaced no candidates) and they hold one in mind.
7a. **Fuse dead-signal suppression**: Phase 2 omits the Fuse option when Phase 1 surfaces no adjacent abstraction candidates. Free response remains the channel for user-proposed fusion targets.
8. **Session immunity**: Crystallized or dismissed (Iᵢ, E) pair → skip for session.
9. **Attempt cap**: Max 5 triangulations per abstraction seed. At cap, surface unresolved candidate with explicit status and deactivate.
10. **Convergence persistence**: Mode active until crystallized, Esc, or attempt cap.
11. **Progress visibility**: Every Phase 2 surfacing includes attempt counter.
12. **Cross-protocol awareness**: Defer to Hermeneia when intent-articulation is the primary deficit; defer to Analogia when a pre-existing abstract structure needs validation against a target; defer to Telos when goal-construction is the primary deficit.
13. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via gate interaction. The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields violates this separation.
14. **Convergence evidence**: At crystallization, present transformation trace — for each step in history, show (candidate → user_move → candidate'). Per-step evidence is required.
15. **Absorb Analogia misfit**: When `/ground` Phase 0 detects colimit-shaped input (3+ instances with no pre-existing abstract structure) and nudges here, absorb the misfit as valid Periagoge trigger without requiring re-confirmation. Before Phase 1, surface the routing rationale with the cited `/ground` detection basis ("colimit-shaped input detected: [N instances], no pre-existing abstract structure — redirecting to abstraction crystallization") so the user can see the evidence that justified the redirect without re-asking.
16. **Option-set relay test**: If AI analysis converges to a single dominant move (option-level entropy → 0), present the finding directly. Each gate option must be genuinely viable under different user value weightings. **Exception**: The Confirm/Dismiss pair is excluded from the relay-test — user crystallization judgment is constitutive regardless of AI analysis entropy. Phase 2 remains `always_gated` even when only one shaping move appears analytically viable.
17. **Gate integrity**: The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option like "Widen" into a concrete direction while preserving the UserMove coproduct) is distinct from mutation.
