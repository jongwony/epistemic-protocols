---
name: induce
description: "Calibrate and crystallize in-process abstraction through dialectical triangulation. Proposes calibrated candidate abstractions with personalized grounding examples and shapes them via user widen/narrow/fuse/reorient moves when an instance set has converged toward an unnamed essence, producing crystallized abstraction. Type: (AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction. Alias: Periagoge(περιαγωγή)."
---

# Periagoge Protocol

Calibrate and crystallize in-process abstraction through AI-proposed candidate plus user dialectical triangulation. Type: `(AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction`.

## Definition

**Periagoge** (περιαγωγή): A dialogical act of turning an in-process abstraction toward its crystallized form, where AI detects when an instance set has converged toward an unnamed essence, calibrates the user's in-process concept against that instance set, proposes a calibrated candidate abstraction paired with a personalized grounding example drawn from the user's own domain, and shapes the candidate through the user's response — accept the candidate, broaden its scope, narrow it along a specific dimension, fuse it with an adjacent abstraction, or redirect onto an orthogonal axis — until the abstraction locates itself (the Greek dialectical vocabulary supplies the source terms, attributed in the footnote).[^1]

[^1]: The name draws a structural analogy from Plato *Republic* VII.518d, where περιαγωγή names the soul's turning-around toward the intelligible. The protocol borrows the turning-toward structure; it does not claim Platonic paideia. Synagoge (συναγωγή, collection) and Diairesis (διαίρεσις, division) are the twin dialectical moves described in *Phaedrus* 265d–266a; here they name user response families, not a claim to Platonic method.

```
── FLOW ──
Periagoge(A) → Detect(A) → in_process? →
  true:  (Iᵢ, E, L?) → Calibrate(Iᵢ, E, L?, ctx) → K →
         Propose(Iᵢ, E, K, ctx) → (P, G) →
         Qs(P, G, K, progress) → Stop → V → integrate(V, candidate) → candidate' →
         loop until crystallized(A) ∨ user_esc ∨ attempts_exhausted
  false: deactivate

── MORPHISM ──
A
  → detect(instances, essence, locator)   -- verify in-process abstraction exists
  → calibrate(E, L?, Iᵢ, ctx)             -- surface what instances preserve, sharpen, prune, and leave open
  → propose(candidate, grounding, calibration)  -- AI generates candidate + personalized example + calibration map
  → triangulate(candidate, user_move)     -- user shapes via type-preserving materialized moves
  → integrate(V, candidate)               -- update candidate per user response
  → crystallize(abstraction)              -- convergence when confirmed
  → CrystallizedAbstraction
requires: in_process(A)                    -- runtime checkpoint (Phase 0)
deficit:  AbstractionInProcess              -- activation precondition (Layer 1/2)
preserves: instance_set(A)                  -- Iᵢ read-only; K computed per Phase 1 entry and recomputed on Phase 1 re-entry; candidate mutates per user move
invariant: Calibrative Induction through Dialectical Triangulation over Unilateral Correction

── TYPES ──
A              = AbstractionSeed (in-process state: instances + essence intuition + optional user concept label)
Detect         = A → (Bool, (Iᵢ, E, L?) if true)
Iᵢ             = Set(Instance)                             -- instance set observed; cardinality unconstrained (any N ≥ 1 qualifies when essence is sensed; richer sets provide stronger triangulation material)
Instance       = { content: String, context: String }       -- concrete case observed
E              = EssenceIntuition                           -- variation-stable core signal from conversation
L              = Option(TentativeLabel)                     -- user-provided provisional name or concept, if any
ctx            = DomainContext                              -- user's domain context gathered via Read, Grep, and conditional WebSearch in Phase 1
Calibrate      = (Iᵢ, E, L?, ctx) → K
K              = CalibrationMap { keeps, sharpens, prunes, open }
                 keeps     = supported core to preserve
                 sharpens  = under-specified decision-relevant structure
                 prunes    = overextended or unsupported scope to release
                 open      = residual uncertainty that does not block crystallization
P              = CandidateAbstraction { name, structure, instance_map, provenance }
G              = GroundingExample { scenario: String, domain: String, mapping: String }
                                                             -- personalized to user's own domain context
Propose        = (Iᵢ, E, K, ctx) → (P, G)
V              = UserMove ∈ {Confirm, Widen(direction), Narrow(specializer), Fuse(adjacent), Reorient(axis), Dismiss}
                 direction    ∈ {upward, lateral}           -- Synagoge family; AI-proposed broadening (user Recognition mode)
                 specializer  = dimension to constrain      -- Diairesis family (user-directed specialization)
                 adjacent     = neighboring abstraction ref  -- lateral Synagoge with user-named reference (user Production mode)
                 axis         = orthogonal dimension         -- full redirection
Qs             = Shaping interaction with candidate + grounding [Tool: Constitution interaction]
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
Phase 0: A → Detect(A) → in_process?                                       -- detection checkpoint (silent)
Phase 1: (Iᵢ, E, L?) → Calibrate(Iᵢ, E, L?, ctx) → K → Propose(Iᵢ, E, K, ctx) → (P, G); carry (P, G, K)  -- calibration + candidate + grounding construction [Tool]
Phase 2: (P, G, K) → Qs(P, G, K, progress) → Stop → V                      -- triangulation Constitution interaction [Tool]
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
Convergence evidence: At crystallized(A), present transformation trace — for each step ∈ history, show (calibration → candidate → user_move → candidate'). Convergence is demonstrated, not asserted.

── CONVERGENCE ──
crystallized(A): see TYPES (V = Confirm in history)
progress(Λ) = |history| / max_attempts
early_exit = user_esc ∨ attempts_exhausted

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Detect     (sense)   → Internal analysis (no external tool)
Phase 1 Calibrate+Propose (observe) → Read, Grep (user's domain context for personalized grounding); WebSearch (conditional: cross-domain adjacent abstractions)
Phase 2 Qs         (constitution)    → present calibration map + candidate + grounding (mandatory; Esc key → loop termination at LOOP level, not a UserMove)
Phase 3            (track)   → Internal state update
converge           (extension)   → TextPresent+Proceed (convergence evidence trace; proceed with crystallized abstraction)

── MODE STATE ──
Λ = { phase: Phase, A: AbstractionSeed, Iᵢ: Set(Instance), E: EssenceIntuition,
      calibration: Option(K), candidate: Option(P), grounding: Option(G),
      history: List<(P, G, K, V)>, attempts: Nat, crystallized: Option(P),
      active: Bool, cause_tag: String }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Calibrative Induction through Dialectical Triangulation over Unilateral Correction**: When an instance set has converged toward an unnamed essence but the abstraction has not located itself, neither AI nor user alone can crystallize the form. AI first shows how the instance set calibrates the user's in-process concept — what it preserves, sharpens, prunes, and leaves open — then proposes a candidate paired with a personalized grounding example drawn from the user's own domain. The user shapes the candidate through Socratic moves — widening (Synagoge), narrowing (Diairesis), fusing with an adjacent abstraction, or reorienting onto an orthogonal axis. The abstraction turns toward its crystallized form through the exchange, not by unilateral AI correction.

## Mode Activation

### Activation

AI detects in-process abstraction OR user calls `/induce`. Detection is silent (Phase 0); candidate proposal plus triangulation always requires user interaction via Cognitive Partnership Move (Constitution) (Phase 2).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/induce` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: In-process abstraction detected via in-protocol heuristics (essence intuition signal + locator gap; instance cluster contributes evidence strength). Detection is silent (Phase 0).

**In-process abstraction** = an essence is sensed toward which an abstraction is forming, with locator gap active (name, scope, or positional claim remains unsettled). Concrete instances supply evidence for the sensed essence; richer instance sets provide stronger triangulation material.

Gate predicate:
```
in_process(A) ≡ essence_sensed(A) ∧ ¬located(A)
```

Periagoge's scope is specified by **operation**: colimit formation — constructing a new abstraction from an instance cocone when essence is sensed and locator gap is active. Instance cardinality is an evidence signal (see Trigger Signals table): stronger accumulation offers richer triangulation material. The operation distinguishes Periagoge from adjacent protocols: comparative analysis between already-named readings or frames belongs to Prothesis (frame selection); audit of decision gaps belongs to Syneidesis (gap); only colimit formation is Periagoge territory.

### Priority

<system-reminder>
When Periagoge is active:

**Supersedes**: Direct output patterns that assert a label without triangulation
(Abstraction must be crystallized through dialectical exchange, not unilaterally proposed)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, present calibration map plus candidate abstraction and personalized grounding example via Cognitive Partnership Move (Constitution).
</system-reminder>

- Periagoge completes before output dependent on the crystallized abstraction proceeds
- Loaded instructions resume after crystallization or Esc

### Trigger Signals

Heuristic evidence signals for in-process abstraction detection:

| Signal | Detection |
|--------|-----------|
| Instance accumulation | Concrete cases carry a shared essence signal and provide triangulation material for abstraction formation |
| Essence intuition language | User phrases such as "something about these cases...", "the pattern I'm seeing...", "these all have...", "why do these keep happening..." |
| Locator gap | Name, scope, or positional claim remains unsettled for the emerging abstraction |
| Analogia misfit redirect | `/ground` Phase 0 detects colimit-shaped input (essence signal + `locator_absent(A)`) and nudges to `/induce` |
| Adjacent abstraction surfacing | Recall yields neighboring abstractions, suggesting a fuse or specialize move is imminent |

**Cross-session enrichment**: Accumulated abstraction formation history from Anamnesis's hypomnesis store (session recall indices written by the SessionEnd/PreCompact hook) provides Fuse candidates for Phase 1 — previously crystallized abstractions in adjacent domains become lateral Synagoge targets. When `/recollect` has been invoked in session, recalled adjacent abstractions enter the candidate construction pool as fuse-reference. Heuristic input may bias toward previously observed patterns; constitutive judgment remains with the user.

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

The operational test: "Is the user operation *forming a new abstraction from observed instances*, or is it something else (selecting, validating)?" Only the first is Periagoge.

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| User confirms candidate | Crystallize and proceed |
| User Esc key | Return to normal operation; abstraction remains in-process |
| Attempt cap reached (5 triangulations) | Surface remaining candidate with explicit unresolved status, deactivate |

## Protocol

### Phase 0: In-Process Detection Checkpoint (Silent)

Analyze conversation state for in-process abstraction. This phase is **silent** — no user interaction.

1. **Bind seed** `A`: use explicit argument or the most recent instance cluster surfaced in session (any cardinality qualifies when essence is sensed — single case strong-grip, paired comparison, or accumulated set)
2. **Check essence signal** `E`: scan for variation-stable core signal in conversation (user essence-intuition language or AI-inferred pattern). This is the primary gate — if no essence is sensed, the abstraction has nothing to turn toward
3. **Check locator absence**: if a name plus scope plus position is already settled, skip (no turning needed)
4. If essence_sensed ∧ ¬located: proceed to Phase 1 with `(Iᵢ, E, L?)`
5. If Analogia misfit signal is present (colimit-shaped input forced into substitution): absorb the misfit as valid Periagoge trigger without re-confirmation

**Scope restriction**: Detection is silent. Does NOT modify files or call external services.

### Phase 1: Calibration + Candidate Proposal + Grounding Construction

Generate a calibration map, candidate abstraction, and personalized grounding example.

1. **Calibrate the seed** `K`: compare `(Iᵢ, E, L?)` against the user's context and sort the concept pressure into four fields: `keeps` (supported core to preserve), `sharpens` (decision-relevant structure needing clarity), `prunes` (unsupported overextension to release), and `open` (residual uncertainty that does not block crystallization). When `L?` is absent, calibrate on `E` alone: `sharpens` and `prunes` are relative to the inferred essence rather than to a user-named concept.
2. **Synthesize candidate** `P`: from `(Iᵢ, E, K)`, construct a named abstraction with structure and instance-to-abstraction mapping. The candidate is a working hypothesis, not a claim.
3. **Construct personalized grounding** `G`: call Read/Grep to collect evidence about the user's own domain context (codebase, configs, session history). The grounding example must be drawn from the user's domain — a scenario they recognize as theirs — not a generic textbook case.
   - When the user's domain is outside the current codebase (external API, academic field, professional practice), extend context collection to web search (WebSearch). Tag web evidence with `source: "web:{url}"` for traceability.
4. **Check adjacent abstractions**: if recall (Anamnesis hypomnesis store or in-session history) surfaces neighboring abstractions, note them as Fuse candidates for Phase 2.
5. Package `(P, G, K)` with Fuse candidates and proceed to Phase 2.

**Scope restriction**: Read-only investigation (Read, Grep, WebSearch). No test execution or file modifications.

### Phase 2: Dialectical Triangulation (Constitution)

**Present** the calibration map, candidate, and grounding example via Cognitive Partnership Move (Constitution).

**Surfacing format**:

Present the calibration map and candidate as text output:
- **Keeps**: [what the instance set repeatedly supports and the candidate preserves]
- **Sharpens**: [what must become clearer for the abstraction to be usable]
- **Prunes**: [what the instance set does not support or overextends]
- **Open**: [what remains unresolved without blocking crystallization]
- **Candidate**: [name] — [structural description]
- **Instance map**: [how Iᵢ maps to the candidate's structure]
- **Grounding example**: [scenario drawn from user's domain, with mapping to the candidate]
- [If Fuse candidates exist: list adjacent abstractions with brief relation]
- **Progress**: [attempt N of max 5]

Then **present**:

```
Does this crystallize the concept enough to use?

Options:
1. **Confirm / Use this** — [what the crystallized abstraction enables downstream]
2. **Widen / Broaden it** — [how upward or lateral scope expansion reshapes the candidate]
3. **Narrow / Tighten it** — [what dimension specializes or what to exclude]
4. **Fuse / Merge it** — [which adjacent abstraction to explicitly pull in for merge] *(presented only when Phase 1 surfaces adjacent candidates; otherwise omitted)*
5. **Reorient / Change the axis** — [what orthogonal axis to pursue instead]
6. **Dismiss / Drop this candidate** — [what assumption about this essence is released]
```

When Phase 1 surfaces no adjacent candidates, omit the Fuse option — dead signal suppression. Free response is always available — the user may name an adjacent abstraction for fusion, propose an alternative abstraction, specify a dimension not captured by the presented moves, or describe a shape the options do not cover.

**Design principles**:
- **Personalized grounding**: Never use a generic example. The grounding must be drawn from the user's domain context so they can recognize it as theirs.
- **Calibration before choice**: Show the preservation/sharpening/pruning/open map before the gate so the user evaluates the concept pressure, not just an AI label.
- **Socratic shaping**: Each move (widen/narrow/fuse/reorient) is a recognized dialectical turn, not a free-form revision request.
- **Progress visible**: Display attempt counter; attempt cap bounds generative refinement.
- **Free response honored**: When the presented moves do not capture the user's shape, parse free response as candidate redirection. If the user disputes `K` itself, absorb the correction through the existing UserMove/free-response path rather than adding a separate calibration-review constructor.

### Phase 3: Integration

After user response:

1. **Confirm**: Record `crystallized(P)` in Λ, terminate with convergence evidence trace.
2. **Widen(direction)**: Apply Synagoge — for `direction = upward`, generalize the candidate's scope; for `direction = lateral`, broaden sibling coverage. Return to Phase 2 with widened candidate (grounding may persist).
3. **Narrow(specializer)**: Apply Diairesis — constrain the candidate along the specified dimension, excluding instances that fall outside. Return to Phase 2 with narrowed candidate.
4. **Fuse(adjacent)**: Lateral Synagoge — merge candidate with named adjacent abstraction. Return to Phase 1 (grounding must be recomputed for fused structure).
5. **Reorient(axis)**: Abandon current axis, restart along orthogonal dimension. Return to Phase 1 (full recompute).
6. **Dismiss**: Release the candidate. If essence is still sensed, return to Phase 1 with fresh candidate proposal; else deactivate.

After integration:
- Log `(P, G, K, V)` to history
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
| Calibration map | Phase 1 sorts concept pressure into Keeps / Sharpens / Prunes / Open | Lets instances correct the concept without AI overriding the user |
| Personalized grounding | Phase 1 requires grounding drawn from user's own domain context | Prevents generic textbook examples that fail to trigger recognition |
| Socratic moves preserved | Phase 2 options map to dialectical families (Synagoge/Diairesis/Fuse/Reorient) | Each move has a recognized shape, not open-ended revision |
| Session immunity | Crystallized or dismissed (Iᵢ, E) pair → skip for session | Respects user's crystallization or release |
| Attempt cap | Max 5 triangulations per abstraction seed | Prevents infinite refinement; forces convergence or release |
| Progress visibility | Attempt counter in Phase 2 surfacing | User sees remaining budget |
| Free response honored | Alternative abstraction via free response routes to Phase 1 | Supports reorient beyond presented axes |
| Analogia misfit absorption | `/ground` colimit-detection nudge routes here | Prevents source-domain confabulation in substitution path |

## Rules

1. **AI-guided, user-triangulated**: AI detects in-process abstraction and proposes candidates; crystallization requires user move via Cognitive Partnership Move (Constitution) (Phase 2).
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity; Constitution interaction requires turn yield before proceeding.
3. **Calibration plus candidate plus grounding required**: Every Phase 2 surfacing pairs a calibration map, candidate abstraction, and personalized grounding example drawn from the user's own domain context.
4. **Calibrative Induction through Dialectical Triangulation over Unilateral Correction**: AI candidate is a working hypothesis, not a claim. Concept correction is mediated by the instance set surfaced through `K`; crystallization belongs to the user's move.
5. **Personalized grounding**: The grounding example must be recognizable to the user as theirs — drawn from their codebase, configs, session history, or stated domain. Generic textbook examples fail the personalization requirement.
6. **Socratic move preservation**: Phase 2 options map to recognized dialectical families. Widen = Synagoge (upward or lateral). Narrow = Diairesis. Fuse = lateral Synagoge with adjacent abstraction. Reorient = orthogonal redirection. The vocabulary is operational, not ornamental.
7. **Free response honored**: When presented moves do not capture the user's shape, free response routes the candidate to reorient or fresh proposal. The user may also name an adjacent abstraction via free response when Fuse is not presented (because Phase 1 surfaced no candidates) and they hold one in mind.
7a. **Fuse dead-signal suppression**: Phase 2 omits the Fuse option when Phase 1 surfaces no adjacent abstraction candidates. Free response remains the channel for user-proposed fusion targets.
8. **Session immunity**: Crystallized or dismissed (Iᵢ, E) pair → skip for session.
9. **Attempt cap**: Max 5 triangulations per abstraction seed. At cap, surface unresolved candidate with explicit status and deactivate.
10. **Convergence persistence**: Mode active until crystallized, Esc, or attempt cap.
11. **Progress visibility**: Every Phase 2 surfacing includes attempt counter.
12. **Cross-protocol awareness**: Defer to Analogia when a pre-existing abstract structure needs validation against a target.
13. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields violates this separation.
14. **Convergence evidence**: At crystallization, present transformation trace — for each step in history, show (calibration → candidate → user_move → candidate'). Per-step evidence is required.
15. **Absorb Analogia misfit**: When `/ground` Phase 0 detects colimit-shaped input (`essence_sensed` + `locator_absent(A)`) and nudges here, absorb the misfit as valid Periagoge trigger. Before Phase 1, surface the routing rationale with the cited `/ground` detection basis ("colimit-shaped input detected: essence_sensed(A), locator_absent(A), [N supporting instances] — redirecting to abstraction crystallization") so the user can recognize the evidence that justified the redirect; the concrete instance count makes the routing rationale verifiable rather than vague.
16. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant move (option-level entropy → 0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options. **Exception**: The Confirm/Dismiss pair is excluded from the entire preceding test (Extension resolution, cost-symmetric collapse, and off-axis pathway demotion) — user crystallization judgment is constitutive regardless of AI analysis entropy. Phase 2 remains Constitution even when only one shaping move appears analytically viable.
17. **Gate integrity**: The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option like "Widen" into a concrete direction or pairing "Confirm" with "Use this" while preserving the UserMove coproduct) is distinct from mutation.
18. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
19. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
