---
name: grasp
description: "Verify understanding after AI work through intent-scented entry points. Type: (ResultUngrasped, User, VERIFY, Result) → VerifiedUnderstanding. Alias: Katalepsis(κατάληψις)."
---

# Katalepsis Protocol

Achieve certain comprehension of AI work through structured verification, enabling the user to grasp ungrasped results. Type: `(ResultUngrasped, User, VERIFY, Result) → VerifiedUnderstanding`.

## Definition

**Katalepsis** (κατάληψις): A dialogical act of achieving firm comprehension—from Stoic philosophy meaning "a grasping firmly"—resolving ungrasped AI-generated results into verified user understanding through intent-scented entry points and progressive verification.

```
── FLOW ──
(R, U) → I → E → Fᵣ → Sₑ → B → Tᵣ → detect(E, B) → GT → P → Δ → Q → A → P' → Tᵤ → Q(coverage) → (loop until katalepsis)

── MORPHISM ──
Result
  → orient(result, user_signal)        -- infer likely comprehension intents from AI work and user's wording
  → derive_entries(intent)             -- transform inferred intent into high-scent entry points
  → assess_route(intents, entries, R, U, context) -- annotate entry-point adequacy before user selection
  → select(intent_entry_point, route_map) -- user chooses the closest intent-scented entry point
  → materialize(artifact_basis)        -- derive concrete artifact anchors for the chosen intent
  → register(tasks)                   -- track selected entry points as tasks
  → verify(comprehension)             -- Socratic probing per gap type
  → confirm(coverage)                 -- aspect coverage check per entry point
  → VerifiedUnderstanding
requires: result_exists(R)              -- AI work output must exist in context
deficit:  ResultUngrasped               -- activation precondition (Layer 1)
preserves: R                            -- read-only throughout; morphism acts on user understanding only
invariant: Comprehension over Explanation

── TYPES ──
R  = AI's result (the work output)
U  = User signal about what feels ungrasped; may be ∅ on bare `/grasp`
I  = ComprehensionIntent inferred from R and U; I ∈ {Orientation, Rationale, Impact, Approval, Transfer} ∪ Emergent
E  = Intent-scented entry points derived from I
Context = Preprocessed observable comprehension context from R, U, and session context; used alongside raw R/U for different-grain route assessment
AssessRoute = Entry-point adequacy assessment: I × E × R × U × Context → Fᵣ
Fᵣ = ComprehensionRouteMap { likely_intent, entry_point, artifact_anchor, cheapest_probe, hidden_route, open }
likely_intent = Map<EntryPoint, ComprehensionIntent>          -- inferred intent each entry point serves
entry_point = E                                                -- re-exposed; no filtering, creation, or suppression
artifact_anchor = Map<EntryPoint, ArtifactBasis>                -- grounding anchor hint, not yet materialized
cheapest_probe = Map<EntryPoint, ProbeTarget>                  -- lowest-cost aspect that would most reduce comprehension uncertainty
hidden_route ⊆ entry_point                                     -- routes derivable from R that U did not name; anchors remain available
open = Set(RouteQuestion) where the answer could change which entry point the user selects
RouteQuestion = { route: EntryPoint, reason: String, signal_needed: String }
ProbeTarget = { focus: String, artifact_scope: Optional<String> } -- opacity-preserving: names the probe target, never the expected answer or reasoning path
Sₑ = List<EntryPoint>; singleton by default, ordered list when user names multiple distinct concerns
B  = ArtifactBasis materialized from selected entry point(s)
Tᵣ = Task registration for tracking
P  = User's phantasia (current representation/understanding)
Δ  = Detected comprehension gap
Q  = Verification question (via Cognitive Partnership Move (Constitution))
A  = User's answer
Aᵣ = User's reasoning behind misconception (via Cognitive Partnership Move (Constitution))
Tᵤ = Task update (progress tracking)
P' = Updated phantasia (refined understanding)
J_cov = CoverageRouting ∈ {sufficient, aspect(GapType), proposal}
GapType = {Expectation, Causality, Scope, Sequence, Horizon} ∪ Emergent(E, B)
GT = Relevant gap types per entry point ⊆ GapType
HC = HorizonCandidate { edge, anchors, failure_mode, probe_scenario }   -- a co-intended-but-unspoken edge the user did not name from within their framing; probe_scenario is the opacity-preserving scenario text, materialized at Phase 3 detection and consumed when the Qs probe is emitted, then discarded after A is received (it carries the scenario only — never the edge, answer, or rationale)
admissible(HC) ≡ qualifies(HC) ∧ scarce(HC)
              -- false-positive guard: Horizon ∈ GT for an entry point only when some HC is admissible (else detect none)
qualifies(HC) ≡ evidence_bound(HC, B) ∧ material(HC.failure_mode) ∧ unspoken(HC.edge, U ∪ entry_point_labels ∪ prior A)
              ∧ ¬route_selection_question(HC.edge) ∧ ¬decision_gap(HC.edge)   -- the five non-scarcity guards
              -- material(HC.failure_mode): leaving HC.edge unprobed is predicted to keep the achievable understanding short of R (P' ≇ R) — a counterfactual evaluated at detection against the current P and R, before A produces the realized P'
scarce(HC) ≡ |{ HC' : qualifies(HC') for this entry_point }| ≤ 1   -- at most one qualifying Horizon candidate per entry point; if several weak candidates compete, detect none
Cursor = ContinuationCursor { task: TaskId, entry_point: EntryPoint, aspect: Optional(GapType), resume_target: String }
       -- resume_target is a short user-facing phase label, not a serialized cursor; structural position is task × entry_point × aspect
BranchKind = {Proposal} ∪ Emergent(BranchKind)
BranchArtifact = { kind: BranchKind, reference: TaskId, return_pointer: Cursor }
ContinuationClosure = { verified: String, status: String, branch: Optional(BranchArtifact), return_pointer: Cursor, next_moves: List<String> }
                     -- relay metadata after evaluated answers or side-branch ejection; not a new gate
C(·) = emit ContinuationClosure (relay; → TextPresent+Proceed)
DeactivationCondition = { all_tasks_completed, user_esc, user_cancel }
TerminalShape = { phase1_entry_selection, phase3_verification_probe, coverage_routing, deactivation(DeactivationCondition) }

── PHASE TRANSITIONS ──
Phase 0: (R, U) → Orient(R, U) → I → DeriveEntries(I, R) → E → AssessRoute(I, E, R, U, Context) → Fᵣ  -- intent orientation + route map (silent)
Phase 1: Fᵣ → Present(entry_point enriched by route-adequacy metadata; hidden_route + open when non-empty) → Qc(intent entry points) → Stop → Sₑ       -- entry point selection; default single, ordered multi when user names 2+ concerns [Tool]
Phase 2: Sₑ → Materialize(Sₑ, R) → B → TaskCreate[selected] → Tᵣ  -- task registration; initialize Λ.cursor from first current task, entry point, and active aspect before Phase 3 [Tool]
Phase 3: Tᵣ → TaskUpdate(current) → detect(E, B) → GT → P → Δ  -- comprehension check [Tool]
       → Qs(HC) → Stop → A → P' → Tᵤ ; Λ.detected[current] += Horizon ; Λ.probed[current] += Horizon  if Horizon ∈ GT ∧ admissible(HC) ∧ Horizon ∉ Λ.probed[current]  -- Horizon probe: fires immediately at detection (mandatory once), preempts the start-aspect selector; scenario-only, opacity-preserving (never the edge/answer/rationale, never a Horizon label); the answer is then evaluated as a normal probe answer (→ 3c eval → coverage), never a return to the start selector [Tool]
       → Qs(Δ) → Stop → A → P' → Tᵤ                     -- verification loop; Qc for Expectation/Sequence gaps, Qs for Causality/Scope/Emergent (Horizon handled by the preempting edge above) [Tool]
       → TaskCreate[Proposal] if proposal(A)             -- proposal ejection (detected from Other) [Tool]
       → C(branch) if proposal(A)                         -- side-branch continuation closure [Tool]
       → Qᵣs(Aᵣ) → Stop if misconception(A)             -- reasoning inquiry [Tool]
       → Read(source) if eval(A, Aᵣ) requires           -- AI-determined reference [Tool]
       → C(correct) if correct(A)                         -- verified-aspect continuation closure [Tool]
       → Qc(coverage) → Stop if correct(A)               -- aspect summary [Tool]
       → converge → Λ.active := false if all_tasks_completed  -- convergence evidence is terminal; no downstream gate required
       → deactivate(user_esc | user_cancel) → Λ.active := false
Turn boundary invariant: While `Λ.active = true` at turn end, the last user-facing shape must be a TerminalShape. Relay metadata `C(·)` may precede a terminal shape, but cannot be the sole final shape while active. The `converge` emission is `deactivation(all_tasks_completed)`, sets `Λ.active := false`, and is terminal without an additional gate.

── LOOP ──
After Phase 3 verification: Evaluate comprehension per gap type.
If |GT| = 0 for current entry point: present self-evident finding with reasoning per Rule 10, mark task completed upon confirmation, proceed to next task.
If gap detected: Continue questioning within current entry point.
If correct: emit continuation closure, then Aspect summary — show probed vs unprobed gap types.
  User selects "sufficient" → TaskUpdate completed, next pending task.
  User selects additional aspect → Resume with selected gap type.
  User provides proposal via Other → detected by Step 3b, ejected via TaskCreate, emit side-branch continuation closure, resume current loop position.
Cursor lifecycle: Initialize `Λ.cursor` after Phase 2 task registration. Update it whenever the current task changes, the entry point changes, the active aspect changes, or the user-facing resume label changes. On proposal ejection, snapshot the pre-ejection cursor into the branch artifact; when a branch is present in the emitted closure, closure-level `return_pointer` equals `branch.return_pointer`.
Continue until: all selected tasks completed (VerifiedUnderstanding) OR user ESC/cancel (EarlyExit).
Convergence evidence: At all-tasks-completed, present transformation trace — for each t ∈ Λ.tasks, show (ResultUngrasped(t) → verified(t) with comprehension evidence). Convergence is demonstrated, not asserted.
On user ESC/cancel: present partial transformation trace over completed tasks, then declare remaining tasks as unresolved residual.

── CONVERGENCE ──
Katalepsis = ∀t ∈ Λ.tasks: t.status = completed
           ∧ P' ≅ R (user understanding matches AI result)
VerifiedUnderstanding = P' where ∀t ∈ Λ.tasks: t.status = completed ∧ P' ≅ R
EarlyExit = P' where user_esc ∨ user_cancel  -- non-convergent early exit: understanding as of exit, partial trace over completed tasks, remaining tasks declared as unresolved residual
Deactivation: `all_tasks_completed` after convergence evidence sets `Λ.active := false` and terminates as VerifiedUnderstanding; `user_esc` and `user_cancel` each set `Λ.active := false` and terminate as EarlyExit (partial trace + residual declaration), not VerifiedUnderstanding. The convergence trace is a valid terminal shape, not a relay requiring a follow-up gate.

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Orient (observe) → Internal analysis (Read for context if needed)
Phase 0 AssessRoute (observe) → Internal analysis (entry-point adequacy; opacity-preserving — exposes selection scent, never probe answers)
Phase 1 Emit (extension) → TextPresent+Proceed (entry-point-fit distinctions, hidden routes, and bounded open questions from Fᵣ; omitted when empty)
Phase 1 Qc  (constitution)   → present (entry point selection enriched by Fᵣ)
Phase 2 B   (observe) → Internal analysis (artifact basis materialization)
Phase 2 Tᵣ  (track)   → TaskCreate (entry point tracking)
Phase 3 detect (sense) → Internal analysis (gap type relevance detection per entry point)
Phase 3 Horizon (sense) → Internal analysis (admissible(HC) false-positive guard; opacity-preserving — never exposes the suspected edge, the answer, or the selection rationale)
Phase 3 Qs  (constitution)   → present (mandatory; Esc key → loop termination at LOOP level, not an Answer)
Phase 3 Qᵣs (constitution)  → present (misconception reasoning inquiry)
Phase 3 Qc  (constitution)   → present (aspect coverage: sufficient/aspect)
Phase 3 Ref (observe) → Read (source artifact, AI-determined)
Phase 3 Tᵤ  (track)  → TaskUpdate (progress tracking)
Phase 3 Prop (track)  → TaskCreate (proposal ejection)
Phase 3 C    (extension)  → TextPresent+Proceed (continuation closure: verified status + side branch if any + return pointer + next moves)
converge    (extension)  → TextPresent+Proceed (convergence evidence trace; proceed with verified understanding)
esc/cancel  (extension)  → TextPresent+Proceed (partial transformation trace + unresolved-task residual declaration; terminate as EarlyExit, not VerifiedUnderstanding)
-- Interpretive transparency (Basis:) intentionally absent: Socratic verification requires AI judgment opacity — surfacing reasoning would compromise probe authenticity

── MODE STATE ──
Λ = {
  phase: Phase,
  R: Result,
  userSignal: UserSignal,
  intents: List<ComprehensionIntent>,
  entryPoints: List<EntryPoint>,
  routeMap: ComprehensionRouteMap,
  selected: List<EntryPoint>,
  artifactBasis: Map<EntryPoint, ArtifactBasis>,
  tasks: Map<TaskId, Task>,
  current: TaskId,
  cursor: ContinuationCursor,
  branchArtifacts: List<BranchArtifact>,
  phantasia: Understanding,
  detected: Map<TaskId, Set<GapType>>,
  probed: Map<TaskId, Set<GapType>>,
  active: Bool
}
State invariant: Λ.entryPoints = List(Λ.routeMap.entry_point); Λ.selected ⊆ Λ.routeMap.entry_point; every selected entry point has an artifact anchor in Λ.routeMap.artifact_anchor before Phase 2 materialization.

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Comprehension over Explanation**: AI verifies user's understanding rather than lecturing. The goal is confirmed comprehension, not information transfer.

## Mode Activation

### Activation

Command invocation or trigger phrase activates mode until comprehension is verified for all selected entry points.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/grasp` slash command or description-matching input. Always available.
- **Layer 2**: No AI-guided activation. User signals awareness of comprehension deficit.

### Priority

<system-reminder>
When Katalepsis is active:

**Supersedes**: Default explanation patterns in AI responses
(Verification questions replace unsolicited explanations)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 1, present entry point selection via Cognitive Partnership Move (Constitution).
At Phase 3, present comprehension verification via Cognitive Partnership Move (Constitution).
</system-reminder>

- Katalepsis provides structured comprehension path
- Loaded instructions resume after mode deactivation

### Triggers

| Signal | Examples |
|--------|----------|
| Direct request | "explain this", "help me understand", "walk me through" |
| Comprehension signal | "I don't get it", "what did you change?", "why?" |
| Following along | "let me catch up", "what's happening here?" |
| Review request | "show me what you did", "summarize the changes" |

**Qualifying condition**: Activate only when trigger signal co-occurs with recent AI-generated work output (`R` exists in conversation context). Do not activate on general questions unrelated to prior AI work.

**Skip**:
- User demonstrates understanding through accurate statements
- User explicitly declines explanation
- Changes are trivial (typo fixes, formatting)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| User explicitly cancels | EarlyExit (not VerifiedUnderstanding): present partial transformation trace + declare remaining tasks as unresolved residual, then accept current understanding |
| User demonstrates full comprehension | Early termination |

## Entry Point Taxonomy

Entry points name what the user will be able to understand or do after verification. They are derived from the user's signal and the result, not from artifact categories alone.

| Intent | Use When | Example Label |
|--------|----------|---------------|
| **Orientation** | User needs the shape of the result before details | "what changed and why it matters" |
| **Rationale** | User asks why the AI chose this path | "why this approach was taken" |
| **Impact** | User needs downstream effects or risk surface | "what could break or change later" |
| **Approval** | User must decide whether the result is acceptable | "what I need to approve before using this" |
| **Transfer** | User needs to explain, maintain, or modify the result | "how I would explain or change this next time" |
| **Emergent** | User's concern does not fit the named intents but still asks for grasp of this result | Label names the user's desired grasp or next action, e.g. "regulatory implications I need to understand" |

## Artifact Basis Taxonomy

Artifact basis is materialized after entry point selection. It grounds probes without becoming the first user-facing choice.

| Basis | Description | Example |
|-------|-------------|---------|
| **Code Change** | New code, modification, refactoring, dependency, bug fix, deletion | "Changed parser error handling" |
| **Plan Artifact** | Goal, scope, sequence, assumption, owner, risk, acceptance criterion | "Added rollout plan and decision gates" |
| **Document Artifact** | Claim, section, commitment, unresolved question, audience implication | "Updated Notion decision record" |
| **Analysis Artifact** | Method, evidence, inference, conclusion, limitation | "Synthesized research findings" |
| **Model Artifact** | Input, calculation, assumption, sensitivity, output | "Produced valuation range" |

## Gap Taxonomy

Comprehension gaps within each entry point:

| Type | Detection | Question Form | Relevance |
|------|-----------|---------------|-----------|
| **Expectation** | User's assumed behavior differs from actual | "Did you expect this to return X?" | Behavior changes (new code, bug fix, modification) |
| **Causality** | User doesn't understand why something happens | "Do you understand why this value comes from here?" | Non-obvious causal chains (architecture, dependency) |
| **Scope** | User doesn't see full impact | "Did you notice this also affects Y?" | Cross-cutting impact (architecture, refactoring) |
| **Sequence** | User doesn't understand execution order | "Do you see that A happens before B?" | Order-sensitive changes (initialization, dependency) |
| **Horizon** | A co-intended but unspoken edge of the selected entry point the user did not name from within their framing, required for `P' ≅ R`; admitted only when the false-positive guard `admissible(HC)` passes | Scenario-based open probe that tests the edge without naming it | The unknown-unknown that drives the largest comprehension gains but the user cannot request; blind-spot verification inside the current entry point — not route selection (cf. `hidden_route`/`open`), not a decision gap (→ `/gap`) |
| **Emergent** | Gap outside canonical types | Adapted to specific comprehension deficit | Must satisfy morphism `ResultUngrasped → VerifiedUnderstanding`; boundary: comprehension verification (in-scope) vs. decision gaps (→ `/gap`) |

**Emergent gap detection**: Named types are working hypotheses, not exhaustive categories. Detect Emergent gaps when:
- User's comprehension difficulty spans multiple named types (e.g., understanding both causality and scope simultaneously in a cross-cutting change)
- User selects "Other" or pushes back on all presented gap types in the coverage check
- The AI work involves domain-specific patterns where canonical comprehension dimensions are insufficient (e.g., concurrency reasoning, security implications)

**Horizon gap detection** (false-positive guarded): A Horizon gap is the AI surfacing a co-intended-but-unspoken edge the user could not name from within their own framing — the unknown-unknown that often drives the largest comprehension gains yet that the user cannot request, because from inside their frame it is invisible. Because it originates with the AI (not the user), it is admitted ONLY when every guard condition holds (`admissible(HC)`), so it reveals real blind spots rather than manufacturing clever ones ("insight theater"):
- **Evidence-bound**: the edge's `anchors` name concrete artifacts in `B`; pure speculation disqualifies it
- **Material**: missing the edge makes `P' ≅ R` false — it is necessary for verified understanding, not merely interesting
- **Unspoken**: absent from `U`, the entry-point labels, and the user's prior answers (otherwise it is not a horizon)
- **Non-route**: not an entry-point-selection question (that is `hidden_route`/`open` at Phase 0/1)
- **Non-decision**: not a decision or commitment gap (that is `/gap`)
- **Scarcity**: at most one Horizon candidate per entry point; if several weak candidates compete, detect none

**Socratic opacity (Horizon)**: the probe exposes only the scenario/question — never the suspected edge, the expected answer, or the selection rationale before `A` is received; it uses everyday scenario language and never the words "horizon"/"blind spot"/"unspoken edge"; `Horizon` is recorded only internally in `Λ.detected`/`Λ.probed`, never surfaced as a label. This is consistent with the intentional absence of the `Basis:` marker — surfacing the suspected blind spot would compromise probe authenticity.

## Protocol

### Phase 0: Orientation (Silent)

Analyze the AI work result and the user's signal to infer likely comprehension intents. Bare `/grasp` is valid: when `U = ∅`, Orient generates generic intent candidates from `R` alone and Phase 1 becomes the user's first signal-bearing turn.

1. **Identify result shape**: Detect whether `R` is code, plan, document, analysis, model, or mixed artifact
2. **Read user signal**: Extract the user's named concern, uncertainty, or desired use of the result; if absent, mark `U = ∅` and continue from result shape
3. **Infer intents**: Generate 2-3 high-scent entry points using Entry Point Taxonomy
4. **Prepare basis hints**: Keep artifact categories as hidden grounding for each entry point
5. **Assess route** `Fᵣ`: Annotate the derived entry points with a ComprehensionRouteMap — likely intent, unchanged entry point set, artifact anchor hint, cheapest probe target, hidden-route marker, and bounded open questions
   - `cheapest_probe` names the probe target only; it never reveals the expected answer or reasoning path (Socratic opacity)
   - `hidden_route` marks entry points derivable from `R` that the user's signal did not name; because `hidden_route ⊆ entry_point`, selected hidden routes use the same artifact-anchor materialization path as other entries
   - `open` is limited to route questions whose answer could change which entry point the user selects; exclude general explanation ideas, background caveats, or future exploration horizons
   - If `open = ∅`, no bounded route question is emitted; Phase 1 proceeds with entry-point selection enriched only by available route metadata

**Cross-session enrichment**: Prior session indices from the hypomnesis store (prior-session recall indices), when present, may seed Phase 0 entry point prioritization; the constitutive judgment remains with the user. v2+ Katalepsis records are treated as entry-point evidence; v1 category-based records are weak hints only and do not directly map `Category` to `ComprehensionIntent`.

**Revision threshold**: When accumulated Emergent gap detections across 3+ sessions cluster around a recognizable pattern outside the named types {Expectation, Causality, Scope, Sequence, Horizon}, the Gap Taxonomy warrants promotion to a new named type. When accumulated probe misclassifications across 3+ sessions cluster around a specific gap type's probe kind boundary (Qc vs Qs), that type's probe kind assignment warrants revision.

**Unmeasurable-by-construction amendment**: The 3+-session clustering rule assumes the system can *observe* the candidate pattern. A pattern with no representational slot — no gap type, no recall-store category — can never accumulate the cluster; its absence is a silent failure (an unknown-unknown), not evidence of rarity. For such a category, a named *instrumentation* type may be added BEFORE 3 prior detections, but only when it (a) satisfies the morphism `ResultUngrasped → VerifiedUnderstanding`, (b) carries an explicit false-positive guard, and (c) defines a demotion review. `Horizon` is added under this amendment (its guard is `admissible(HC)`). **Demotion review**: after 3+ applicable Horizon opportunities, demote or revise `Horizon` if detections are consistently absent, are user-rejected as speculative, or fail to improve verified understanding. This keeps promotion falsifiable rather than permanent — the bootstrap exists to make the pattern measurable, and commits to reversing it if measurement shows no value.

### Phase 1: Intent-Scented Entry Point Selection

**Present** entry points via Cognitive Partnership Move (Constitution) to let user select where to start. Constitution presentation yields turn for user response.

```
question: "What would help you get oriented fastest?"
selection: single
options:
  - label: "[intent entry point A]"
    description: "[what the user will be able to understand or decide after choosing it]"
  - label: "[intent entry point B]"
    description: "[what the user will be able to understand or decide after choosing it]"
  - label: "[intent entry point C]"
    description: "[what the user will be able to understand or decide after choosing it]"
```

The user may also state the entry point in their own words; treat that response as an Emergent entry point when it remains within `ResultUngrasped → VerifiedUnderstanding`.

**Design principles**:
- Show max 3 entry points in the first question
- Labels name user intent or outcome, not artifact taxonomy
- Descriptions carry information scent: what this path will make clear and why it matters
- **Route map before choice**: Present the `entry_point` option set enriched by `Fᵣ` route metadata; surface hidden routes and bounded open questions only when non-empty, without filtering options or revealing probe answers
- Artifact basis may appear in surrounding context, not as the primary option label
- If the initial user signal or Phase 1 freeform response names 2+ distinct concerns, enable multi-select in a follow-up question or register the named concerns directly as an ordered task list

### Phase 2: Task Registration

Materialize artifact basis for each selected entry point, then **call TaskCreate**:

```
TaskCreate({
  subject: "[Grasp] Entry point label",
  description: "Intent to verify + artifact basis used for grounding",
  activeForm: "Verifying [entry point]"
})
```

Set task dependencies only when entry points have a necessary order (e.g., understand the intended outcome before validating the risk surface).

### Phase 3: Comprehension Loop

For each task (entry point):

1. **TaskUpdate** to `in_progress`

2. **Present overview**: Brief summary of the selected intent and its artifact basis, then show everyday aspect labels derived from detected gap types (`GT \ {Horizon}` — Horizon is never surfaced as a selectable aspect label; per Socratic opacity it is probed inline at detection, never offered in the start selector or any routing option) and let user select starting aspect:

   Present the detected aspects as text output:
   - What this path covers: [plain-language aspect list]

   Then **present**:

   ```
   Which aspect to start with?
   options:
     - label: "[Aspect A]"
       description: "[Why relevant to this entry point]"
     - label: "[Aspect B]"
       description: "[Why relevant to this entry point]"
   ```

   This lightweight `select_start` prevents AI-imposed framing on the first probe without requiring full pre-authorization of the detection set. User picks starting direction; remaining aspects surface in step 3d. Use everyday labels like "what changed", "why this path", "what it affects", or "what happens first"; keep raw gap-type names internal unless the user already uses that vocabulary.

   **Horizon preemption (precedes the start selector)**: Before presenting the start-aspect selector above, check for a detected admissible Horizon: if `Horizon ∈ GT ∧ admissible(HC) ∧ Horizon ∉ Λ.probed[current]`, fire the scenario-only `Qs` Horizon probe immediately (per the Horizon probe exception in step 3) — it preempts this selector and is mandatory once per admissible detection, never surfacing a Horizon label. On the answer, record `Λ.detected[current] += Horizon` and `Λ.probed[current] += Horizon`. The scenario answer is then evaluated per step 3c and the entry point proceeds to the coverage check (step 3d) — never back to this start selector; any remaining non-Horizon aspects surface through the coverage check (step 3d), consistent with the formal transition. If Horizon was the only detected gap (`GT \ {Horizon} = ∅`), the coverage check finds no remaining aspect and completes the entry point.

3. **Verify comprehension** by **presenting** a Socratic probe via Cognitive Partnership Move (Constitution):

   Constitution presentation yields turn for user response.

   Present the relevant context as text output:
   - What the AI work did for this aspect (the component, behavior, or mechanism being tested)
   - The specific scenario or input being used for the probe

   Construct a probe based on the detected gap type — the probe should test whether the user can demonstrate the specific knowledge that gap type targets (prediction for Expectation, explanation for Causality, impact awareness for Scope, ordering for Sequence).

   **Gap type → probe kind mapping**: The probe’s gate kind (Qc vs Qs) varies by gap type to match the answer space structure:

   | Gap Type | Probe Kind | Rationale |
   |----------|------------|-----------|
   | **Expectation** | Qc (classificatory) | Answer space is enumerable — user selects from finite correct/partial/misconception options representing predicted behaviors |
   | **Sequence** | Qc (classificatory) | Answer space is enumerable — user selects from finite ordering options |
   | **Causality** | Qs (constitutive) | Causal reasoning requires model-discriminating options where the user’s own reasoning is diagnostic |
   | **Scope** | Qs (constitutive) | Impact enumeration requires user-generated content — scope awareness cannot be tested by selection alone |
   | **Horizon** | Qs (constitutive) | The edge is not enumerable without leaking the blind spot; user-generated reasoning is diagnostic, and the scenario must test the edge without naming it |
   | **Emergent** | Qs (constitutive) | Unknown structure favors open response — no pre-enumerable answer space |

   Estimated split: ~40–50% Type F (Expectation, Sequence → Qc probes), ~50–60% Type M (Causality, Scope, Horizon, Emergent → Qs probes). The split reflects that comprehension verification often involves causal and scope understanding, which resist reduction to finite option sets.

   **Horizon probe exception**: a Horizon probe never uses the labeled understanding-level option template below — enumerating a `Correct understanding`/`Misconception` option would expose the edge before `A`. Present only the scenario as an open question (free-response; the "Other"-style open path is the entire probe), and never name the edge, the expected answer, or the rationale. Evaluate the free answer for whether the user independently reaches the edge.

   Then **present** the probe question with understanding-level options (non-Horizon gap types):
   ```
   question: "[Essential verification question]"
   options:
     - label: "[Correct understanding]"
       description: "[domain-specific rationale: what this understanding enables or predicts]"
     - label: "[Partial/uncertain response]"
       description: "[domain-specific rationale: what aspect remains unclear and why it matters]"
     - label: "[Misconception]"
       description: "[domain-specific rationale: what this misunderstanding would cause in practice]"
   Other: user explains freely — AI evaluates comprehension level
   ```

   Option descriptions must be domain-specific rationale grounded in the current probe context, not meta-labels about what the selection signals. Each description answers "why does this understanding matter?" rather than "what does this selection indicate?"

3b. **On proposal detected** (user answer suggests changes or improvements to the discussed system, AND meets at least one auxiliary signal):
   - Acknowledge briefly: "Noted — recorded as a task. Continuing verification."
   - Call TaskCreate to eject the proposal:
     ```
     TaskCreate({
       subject: "[Grasp:Proposal] Brief description",
       description: "User proposal during [entry point]: [verbatim user text]",
       activeForm: "Archiving user proposal"
     })
     ```
   - Append the created proposal to `Λ.branchArtifacts` with `kind = Proposal`, `reference = TaskId` returned by `TaskCreate[Proposal]`, and `return_pointer = Λ.cursor`.
   - Emit a continuation closure before resuming: side branch recorded, Katalepsis remains active, return pointer = current entry point/aspect, next move = resume the current comprehension check.
   - Return to comprehension loop immediately.

   **Detection criteria**:
   - **Required**: Suggests changes or improvements to the discussed system (direction toward knowledge capture, not comprehension)
   - **Auxiliary** (at least one): introduces concepts not in original AI work output `R`; contains action-oriented language directed at the system (should change, could add, how about replacing)
   - **Exclude**: Requests for further explanation, code navigation, or clarification — even if phrased with action-oriented language (e.g., "could you show me that part?")

3c. **AI-determined response** (after evaluating user answer A):

   AI evaluates A against expected understanding and determines response:

   | Evaluation | Action | Tool |
   |------------|--------|------|
   | Correct (P' ≅ R) | Confirm, emit continuation closure, proceed to next aspect or entry point | TaskUpdate |
   | Partial gap | Targeted followup probe on the gap area | Gate interaction |
   | Misconception | Reasoning inquiry → targeted correction | Gate interaction, Read (AI-determined) |

   **Misconception handling** (three-step):

   1. **Reasoning inquiry**: Present the detected misconception context as text output (what the user answered vs. what was expected, without revealing the correct answer). Then **present** AI-generated reasoning hypotheses via Cognitive Partnership Move (Constitution). Infer 2-3 likely reasoning paths from the specific misconception and present as options. Each option is a context-specific hypothesis derived from the user's actual wrong answer (not a generic template). Do not reveal the correct answer yet. "Other" is always available for unlisted reasoning.

   2. **Targeted correction**: Using both A and Aᵣ, address the root cause of the misconception. If Aᵣ reveals a specific mental model error, correct that model directly. Call Read for supporting reference if eval(A, Aᵣ) requires.

   3. **Resume**: Output a brief text nudge before presenting via Cognitive Partnership Move (Constitution) — remind the user they can share improvement ideas or unlisted comprehension gaps via the "Other" option. Adapt wording to fit the current context (no fixed template). This surfaces the Proposal path at the cognitive transition point between correction and re-verification, when users may have formed improvement ideas but are focused on "getting the right answer." User input via Other triggers Step 3b Proposal ejection workflow, then resumes the verification loop. Present a fresh Constitution interaction for the same aspect.

3d. **Aspect coverage check** (before marking entry point complete):

   When step 3c evaluates as Correct for the current gap type:

   1. Compare probed vs. unprobed detected relevant gap types (canonical + Emergent) for this entry point. The presented option set excludes `Horizon`: `GT_presented = unprobed(current_task) \ {Horizon}` — per Socratic opacity, `Horizon` is never surfaced as a user-facing coverage label; it is probed inline at detection, not offered as a routing option here.
   2. Emit continuation closure as relay text: verified aspect, current task/aspect status, branch artifact if one was just ejected, return pointer, and next available moves.
   3. If unprobed aspects exist, output a brief text nudge reminding the user they can share improvement ideas or unlisted comprehension gaps via the "Other" option (adapt wording to context, no fixed template).

   Present progress as text output:
   - Verified [probed aspects] in [entry point]
   - Current position: [entry point] / [current or next aspect]
   - Next: [coverage check, next pending task, convergence, or explicit exit]

   Then **present**:

   ```
   question: "Any other aspects to explore?"
   options:
     - label: "Sufficient"
       description: "Proceed to next entry point with current understanding"
     - label: "[Unprobed gap type]"
       description: "[Why this aspect is relevant to this entry point]"
   ```

   **Option budget**: 4 slots max (Sufficient + up to 3 unprobed gap types). If >3 unprobed gap types remain, prioritize by detected relevance (see Gap Taxonomy Relevance column).

   Per LOOP — "Sufficient" → step 4, gap type → step 3.

   Skip if all detected relevant gap types already probed during the verification loop.

3e. **Emergent aspect handling**: When user selects "Other" and describes a comprehension gap
   not covered by detected canonical gap types:
   1. Register user's response as Emergent gap type in `Λ.detected[current]`
   2. Resume step 3 verification with the Emergent gap type as current aspect
   3. On subsequent coverage check (3d), the Emergent type appears in probed set

4. **On confirmed comprehension**: Per LOOP — TaskUpdate to `completed`, advance to next pending task.

5. **On gap detected**: Handle per step 3c evaluation table. Do not mark complete until user confirms.

### Verification Style

**Socratic verification**: Ask rather than tell.

**Chunking**: Break complex results into digestible intent paths. Verify each path before proceeding.

**Code reference**: When explaining, always reference specific line numbers or file paths.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Simple change, user seems familiar | Single-probe Constitution interaction targeting core understanding |
| Medium | Moderate complexity | Scenario-based Constitution interaction targeting prediction |
| Heavy | Complex architecture or unfamiliar pattern | Multi-step decomposed Constitution interaction targeting causal reasoning |

## Rules

1. **User-initiated only**: Activate only when user signals desire to understand
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity — Constitution interaction requires turn yield before proceeding
3. **Intent scent before artifact taxonomy**: First user-facing options name the user's likely comprehension intent; artifact categories remain grounding material until after the user chooses a path
4. **Task tracking**: Call TaskCreate/TaskUpdate for progress visibility
5. **Code grounding**: Reference specific code locations
6. **User authority**: User's "I understand" is final
7. **Proposal ejection**: When user answer `A` drifts from comprehension toward knowledge capture (suggesting changes/improvements to the system), acknowledge briefly, call TaskCreate to externalize the proposal, record only a branch reference for continuation, and return to verification. This preserves user-generated insights without converting the proposal into a comprehension task.
7a. **Continuation cursor after side branches**: Proposal ejection and follow-up task creation do not close Katalepsis. After any side branch, emit a compact continuation closure: what was recorded, parent entry point/aspect, return pointer, and next comprehension move. Store the branch artifact outside the comprehension task set, but keep `Λ.cursor` visible enough for the user to recognize where verification resumes. Update `Λ.cursor` before every closure emission so the return pointer reflects the live resumption point.
8. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
9. **Convergence evidence**: Present transformation trace before declaring all tasks completed; per-task evidence is required
9a. **Post-answer closure**: Always emit verified aspect, current task status, and next available moves after a correct answer or sufficient understanding signal, before coverage routing or task completion. This is relay metadata: it keeps the active loop legible without adding a new user gate.
9b. **Active-turn fail-closed**: While `Λ.active = true` at turn end, every response must end in one protocol-owned TerminalShape: Phase 1 entry-point selection, Phase 3 verification probe, coverage routing after a correct or sufficient understanding signal, or deactivation by `all_tasks_completed`, `user_esc`, or `user_cancel`. Plain summaries, file references, context, and relay metadata may ground these shapes, but they cannot be the final shape by themselves while active. This enforces existing Stop, coverage, and deactivation points without adding a user gate or changing `VerifiedUnderstanding`.
10. **Zero-gap surfacing**: If Phase 3 analysis finds no comprehension gaps for an entry point, present this finding with reasoning for user confirmation before marking as self-evident
11. **Gate integrity** (Safeguard tier): The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
12. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
13. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
14. **Protocol-native route map**: Phase 0 produces a ComprehensionRouteMap before entry-point selection. The map is a pre-gate support object for entry-point adequacy, not a terminal status and not generic calibration. It annotates derived entry points; it does not create, filter, suppress, or terminalize entry-point tasks, and `VerifiedUnderstanding` is unchanged. `hidden_route` marks entries the user did not name while preserving their artifact anchors; `open` carries bounded discovery pressure only when the unknown could change which entry point the user selects. Socratic opacity is preserved — the map exposes why an entry point is useful, never the expected answer or reasoning path.
14a. **Horizon boundary**: `Horizon` is a named *comprehension* gap — the AI surfaces a co-intended-but-unspoken edge required for `P' ≅ R` — NOT a Prothesis synthesis construct (`Horizontverschmelzung` fuses multiple *perspectives*; Horizon operates within one user's comprehension of one result). It is detected at Phase 3 *inside* an already-selected entry point and preserves `Fᵣ`/`Sₑ`/`Λ.entryPoints`. It is `Qs`, opacity-preserving (never names the edge, answer, or rationale before `A`), capped at one candidate per entry point (`scarce`), and forbidden when the edge is merely speculative, an entry-point-selection pressure (`hidden_route`/`open`), or a decision gap (`/gap`). It enters the taxonomy under the Revision-threshold *unmeasurable-by-construction amendment* and carries a demotion review. **Surfacing, not fusion**: Katalepsis' role is to *surface* the Horizon edge — making the blind spot visible is what resolves the unknown, and that surfacing is the *basis* for a later fusion of horizons (`Horizontverschmelzung`), which belongs to the Prothesis pipeline — compiled into the inquiry spec's horizon-fusion synthesis directive by `/frame` and executed by the substrate. Katalepsis does not itself re-derive the route or re-frame the comprehension on a Horizon hit; the user's own reframing and any cross-perspective fusion are left to the user and to Prothesis. A surfaced Horizon answer is evaluated as a normal probe answer (step 3c) and proceeds to the coverage check — keeping the Katalepsis/Prothesis boundary sharp and the comprehension loop strictly terminating.
15. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
