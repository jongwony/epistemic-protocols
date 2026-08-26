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
RecordId = the identity a record-creating write returned  -- what names that entry for every later amendment; held per registered entry point in Λ.tasks and per ejected proposal in Λ.branchArtifacts, so nothing downstream has to re-find an entry it already wrote
Cursor = ContinuationCursor { task: RecordId, entry_point: EntryPoint, aspect: Optional(GapType), resume_target: String }
       -- resume_target is a short user-facing phase label, not a serialized cursor; structural position is task × entry_point × aspect
BranchKind = {Proposal} ∪ Emergent(BranchKind)
BranchArtifact = { kind: BranchKind, reference: RecordId, return_pointer: Cursor }
ContinuationClosure = { verified: String, status: String, branch: Optional(BranchArtifact), return_pointer: Cursor, next_moves: List<String> }
                     -- relay metadata after evaluated answers or side-branch ejection; not a new gate
C(·) = emit ContinuationClosure (relay; → TextPresent+Proceed)
DeactivationCondition = { all_tasks_completed }
unprobed(t) = Λ.detected[t] \ Λ.probed[t]  -- detected but not yet probed for task t
GT_presented = unprobed(current) \ {Horizon}  -- unprobed detected relevant gap types offered at the start-aspect selector; Horizon is never surfaced as a selectable label (Socratic opacity) — probed inline at detection instead
StartAspectSelection = user's chosen starting gap type ∈ GT_presented  -- Phase 3 step-1 answer; fires only when Horizon did not preempt (Horizon preemption always precedes this selector) and |GT| > 0
probe_kind = GapType → {Qc, Qs}   -- per the Gap type → probe kind mapping table: Qc for Expectation/Sequence (classificatory), Qs for Causality/Scope/Emergent (open)
ZeroGapFinding = { entry_point: EntryPoint, reasoning: String }  -- the self-evident finding surfaced when |GT| = 0 for the current entry point (Rule 10)
ZeroGapConfirmation = user's answer to a ZeroGapFinding ∈ {Confirm, Reopen(description)}  -- Confirm marks the entry point complete; Reopen names a gap the detection missed, registered as Emergent in Λ.detected[current] (mirrors step 3e), re-entering the comprehension loop for that aspect
TerminalShape = { phase1_entry_selection, phase3_zero_gap_confirmation, phase3_start_aspect_selection, phase3_verification_probe, coverage_routing, deactivation(DeactivationCondition) }

── PHASE TRANSITIONS ──
Phase 0: (R, U) → Orient(R, U) → I → DeriveEntries(I, R) → E → AssessRoute(I, E, R, U, Context) → Fᵣ  -- intent orientation + route map (silent)
Phase 1: Fᵣ → Present(entry_point enriched by route-adequacy metadata; hidden_route + open when non-empty) → Qc(intent entry points) → Stop → Sₑ       -- entry point selection; default single, ordered multi when user names 2+ concerns [Tool]
Phase 2: Sₑ → Materialize(Sₑ, R) → B → record[selected] → Tᵣ ; Λ.tasks := { the identity each write returned ↦ its task } ; Λ.current := the first of them  -- task registration; BIND the returned identities before anything reads them, since every later record update names one, then initialize Λ.cursor from Λ.current, its entry point, and the active aspect before Phase 3 [Tool]
Phase 3: Tᵣ → record update(current) → detect(E, B) → GT → Λ.detected[current] := Λ.detected[current] ∪ GT → P → Δ  -- comprehension check [Tool]
       → [|GT| = 0] Qc(ZeroGapFinding) → Stop → ZeroGapConfirmation  -- zero-gap branch (Rule 10): Confirm → P' := P ; record update(Λ.current, completed), next task; Reopen(desc) → Λ.detected[current] += Emergent, re-enter this Phase 3 with GT = {Emergent} [Tool]
       → [|GT| > 0] Qs(HC) → Stop → A → P' → Tᵤ ; Λ.detected[current] += Horizon ; Λ.probed[current] += Horizon  if Horizon ∈ GT ∧ admissible(HC) ∧ Horizon ∉ Λ.probed[current]  -- Horizon probe: fires immediately at detection (mandatory once), preempts the start-aspect selector below; scenario-only, opacity-preserving (never the edge/answer/rationale, never a Horizon label); the answer is then evaluated as a normal probe answer (→ 3c eval → coverage), never a return to the start selector [Tool]
       → [Horizon did not preempt ∧ GT_presented ≠ ∅ ∧ Λ.probed[current] = ∅] Qc(GT_presented) → Stop → StartAspectSelection → Λ.cursor.aspect := StartAspectSelection  -- start-aspect selector: user picks the opening gap type from GT_presented = unprobed(current) \ {Horizon}; fires once per entry point (only before any probe for the current task), before the verification loop below [Tool]
       → [|GT| > 0 ∧ Λ.cursor.aspect set] probe_kind(Λ.cursor.aspect)(Δ, Λ.cursor.aspect) → Stop → A → P' → Tᵤ ; Λ.probed[current] += Λ.cursor.aspect    -- verification loop, guarded: fires only with a bound aspect (set at the start-aspect gate, or by coverage routing after a probe); unreachable on the zero-gap branch and immediately after a Horizon preemption whose coverage routing has not yet bound an aspect; probe form dispatched per gap type (probe_kind; Horizon handled by the preempting edge above) [Tool]
       → record[Proposal] → rₚ ; Λ.branchArtifacts += BranchArtifact { kind = Proposal, reference = rₚ, return_pointer = Λ.cursor }  if proposal(A)   -- proposal ejection (detected from Other); rₚ is the RecordId that write returned, bound HERE because C(branch) below reads it off the artifact [Tool]
       → C(branch) if proposal(A)                         -- side-branch continuation closure [Tool]
       → Qᵣs(Aᵣ) → Stop if misconception(A)             -- reasoning inquiry [Tool]
       → Ref(source) if eval(A, Aᵣ) requires           -- AI-determined reference [Tool]
       → C(correct) if correct(A)                         -- verified-aspect continuation closure [Tool]
       → Qc(coverage) → Stop if correct(A)               -- aspect summary [Tool]
       → converge → Λ.active := false if all_tasks_completed  -- convergence evidence is terminal; no downstream gate required
Turn boundary invariant: While `Λ.active = true` at turn end, the last user-facing shape must be a TerminalShape. Relay metadata `C(·)` may precede a terminal shape, but cannot be the sole final shape while active. The `converge` emission is `deactivation(all_tasks_completed)`, sets `Λ.active := false`, and is terminal without an additional gate.

── LOOP ──
After Phase 3 verification: Evaluate comprehension per gap type.
If |GT| = 0 for current entry point: present typed `ZeroGapFinding` with reasoning per Rule 10 → `ZeroGapConfirmation`; `Confirm` binds `P' := P` (zero-gap phantasia stands as verified) and marks task completed, proceed to next task; `Reopen(description)` registers an Emergent gap in `Λ.detected[current]` and re-enters Phase 3 for this entry point.
If gap detected (|GT| > 0): present `StartAspectSelection` (unless Horizon preempts) before questioning, then continue questioning within current entry point.
If correct: emit continuation closure, then Aspect summary — show probed vs unprobed gap types.
  User selects "sufficient" → record update(Λ.current, completed), next pending task.
  User selects additional aspect → Resume with selected gap type.
  User provides proposal via Other → detected by Step 3b, ejected via record, emit side-branch continuation closure, resume current loop position.
Cursor lifecycle: Initialize `Λ.cursor` after Phase 2 task registration. Update it whenever the current task changes, the entry point changes, the active aspect changes, or the user-facing resume label changes. On proposal ejection, snapshot the pre-ejection cursor into the branch artifact; when a branch is present in the emitted closure, closure-level `return_pointer` equals `branch.return_pointer`.
Continue until: all selected tasks completed (VerifiedUnderstanding).
Convergence evidence: At all-tasks-completed, present transformation trace — for each t ∈ Λ.tasks, show (ResultUngrasped(t) → verified(t) with comprehension evidence). Convergence is demonstrated, not asserted.

── CONVERGENCE ──
Katalepsis = ∀t ∈ Λ.tasks: t.status = completed
           ∧ P' ≅ R (user understanding matches AI result)
VerifiedUnderstanding = P' where ∀t ∈ Λ.tasks: t.status = completed ∧ P' ≅ R
Deactivation: `all_tasks_completed` after convergence evidence sets `Λ.active := false` and terminates as VerifiedUnderstanding. The convergence trace is a valid terminal shape, not a relay requiring a follow-up gate.

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Orient (observe) → Internal analysis (artifact read for context if needed)
Phase 0 AssessRoute (sense) → Internal analysis (no external tool; entry-point adequacy; opacity-preserving — exposes selection scent, never probe answers)
Phase 1 Emit (extension) → TextPresent+Proceed (entry-point-fit distinctions, hidden routes, and bounded open questions from Fᵣ; omitted when empty)
Phase 1 Qc  (constitution)   → present (entry point selection enriched by Fᵣ)
Phase 2 B   (sense) → Internal analysis (no external tool; artifact basis materialization)
Phase 2 Tᵣ  (track)   → record (entry point tracking; each write returns the RecordId that keys Λ.tasks — the binding every later record update reads)
Phase 2 Cursor (track) → Internal state update (Λ.cursor init after task registration; updated on task/entry-point/aspect/resume-label change, incl. Phase 3 Λ.cursor.aspect := StartAspectSelection)
Phase 3 detect (sense) → Internal analysis (gap type relevance detection per entry point)
Phase 3 Rec  (track)  → Internal state update (detection/probe recording: Λ.detected[current] writes at detect / zero-gap Reopen / Horizon; Λ.probed[current] writes at the Horizon probe and verification loop)
Phase 3 ZeroGapConfirm (constitution) → present (conditional: |GT| = 0 for current entry point; zero-gap finding + reasoning; Confirm/Reopen(description); Rule 10)
Phase 3 Horizon (sense) → Internal analysis (admissible(HC) false-positive guard; opacity-preserving — never exposes the suspected edge, the answer, or the selection rationale)
Phase 3 Qs(HC) (constitution) → present (conditional: Horizon ∈ GT ∧ admissible(HC) ∧ Horizon ∉ Λ.probed[current]; preempting Horizon probe — fires once at detection, before the start-aspect selector; scenario-only open question, opacity-preserving — never a Horizon label, the edge, the answer, or the rationale)
Phase 3 probe_kind (constitution) → present (mandatory; probe form per probe_kind — Qc for Expectation/Sequence, Qs otherwise)
Phase 3 StartAspectSelector (constitution) → present (conditional: |GT| > 0 ∧ Horizon did not preempt ∧ GT_presented ≠ ∅ ∧ Λ.probed[current] = ∅; "Which aspect to start with?" over GT_presented; fires once per entry point before the verification loop)
Phase 3 Qᵣs (constitution)  → present (misconception reasoning inquiry)
Phase 3 Qc  (constitution)   → present (aspect coverage: sufficient/aspect)
Phase 3 Ref (observe) → artifact read (source artifact, AI-determined)
Phase 3 Tᵤ  (track)  → record update (progress tracking; every amendment names Λ.current, the RecordId Phase 2 bound)
Phase 3 Prop (track)  → record (proposal ejection)
Phase 3 C    (extension)  → TextPresent+Proceed (continuation closure: verified status + side branch if any + return pointer + next moves)
converge    (extension)  → TextPresent+Proceed (convergence evidence trace; proceed with verified understanding)
Seam transition to declared next protocol (extension) → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares — this protocol declares no wired composition edge, so the second trigger is vacuously absent — settles the next move; proceed directly to it, citing that settling source; every Constitution gate inside this protocol and inside the next protocol fires unchanged)
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
  tasks: Map<RecordId, Task>,
  current: RecordId,
  cursor: ContinuationCursor,
  branchArtifacts: List<BranchArtifact>,
  phantasia: Understanding,
  detected: Map<RecordId, Set<GapType>>,
  probed: Map<RecordId, Set<GapType>>,
  active: Bool
}
State invariant: Λ.entryPoints = List(Λ.routeMap.entry_point); Λ.selected ⊆ Λ.routeMap.entry_point; every selected entry point has an artifact anchor in Λ.routeMap.artifact_anchor before Phase 2 materialization.

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
```

## Mode Activation

`/grasp` is user-invoked only: activate when the user signals a wish to understand a recent AI result, including a bare command over the current result. Do not activate for an unrelated general question, an accurate account that already demonstrates understanding, an explicit decline, or a trivial formatting-only result.

Loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind while Katalepsis is active.

## Protocol

### Intent-scented entry rendering

Derive up to three first-turn labels from the user's likely comprehension intent — Orientation, Rationale, Impact, Approval, Transfer, or an Emergent intent — and phrase each as what the user will understand, decide, explain, or change by taking that path. Keep Code, Plan, Document, Analysis, Model, or mixed artifact bases behind those labels as grounding anchors. Descriptions state what becomes clear and why it matters; route-map metadata may enrich a label but never reveal a probe answer or reasoning path. A user-authored path remains valid when it stays within `ResultUngrasped → VerifiedUnderstanding`; multiple concerns the user already named become the ordered task list directly.

### Verification rendering and safeguards

Present the selected artifact context and a concrete scenario before each probe. For non-Horizon classificatory probes, render recognizable correct, partial, and misconception trajectories with domain-specific consequences; constitutive probes invite the user's own reasoning, and every probe preserves a free-response path.

Keep an admissible Horizon internal: show only its everyday scenario, never its label, suspected edge, expected answer, or rationale before the answer. A misconception first opens a reasoning inquiry grounded in the user's actual answer, then targets the correction at the disclosed mental model and re-probes the same aspect.

Treat a response as a proposal side branch only when it suggests a system change and either introduces matter outside `R` or directs action at the system; explanation, navigation, and clarification requests remain in the comprehension loop. Record a proposal verbatim, preserve the live cursor, emit the continuation closure, and resume without turning the proposal into a comprehension task.

When grounding an explanation or correction in code, cite concrete file locations. Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, content belongs to another round or trace, or phase order determines whether text belongs before or inside a gate.

### Intensity

| Level | Realization |
|-------|-------------|
| Light | One Constitution probe of core understanding |
| Medium | One scenario probe of prediction or impact |
| Heavy | Decomposed probes of causal or sequential understanding |

## Rules

1. **User-initiated only**: Activate only on the user's wish to understand a recent AI result; an explicit decline withdraws that invitation.
3. **Intent scent before artifact taxonomy**: First user-facing options name the user's likely comprehension outcome; artifact categories remain grounding material.
6. **User authority**: The user's account of what they understand stands for the ground it covers. Do not probe that ground again; the trace distinguishes demonstrated aspects from user-attested ones.
7. **Proposal ejection and continuation**: Externalize a qualifying proposal without closing Katalepsis. Keep its record reference outside the task set, snapshot and expose the current cursor, then resume the named comprehension move.
8. **Round composition**: Compose each round so the reader can act without reassembly — use everyday language, keep each judgment beside its evidence and next-move implication, and place analytical context before its gate.
9a. **Post-answer closure**: After a correct answer or sufficient-understanding signal, emit the verified aspect, current task status, return pointer, and next available moves before coverage routing or completion.
9b. **Active-turn fail-closed**: While `Λ.active = true`, end every turn in one `TerminalShape`; relay context and continuation metadata may precede that shape but never replace it.
10. **Zero-gap surfacing**: A `ZeroGapFinding` carries its reasoning to `ZeroGapConfirmation`; only `Confirm` completes the entry, while `Reopen(description)` registers the named Emergent gap and resumes verification.
14a. **Horizon boundary**: Horizon is an evidence-bound comprehension edge inside the selected entry point, not route selection, a decision gap, reframing, or perspective fusion. Admit it only through `admissible(HC)`, probe it opaquely once, and demote or revise the instrumentation after repeated applicable opportunities if detections remain absent, speculative, or unhelpful.
17. **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
