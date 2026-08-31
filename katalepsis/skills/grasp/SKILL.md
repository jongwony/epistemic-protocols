---
name: grasp
description: "Verify understanding of a result or artifact through intent-scented entry points. Type: (ResultUngrasped, User, VERIFY, Result) → VerifiedUnderstanding"
---

# Katalepsis Protocol

Achieve certain comprehension of a result or artifact through structured verification, enabling the user to grasp what stands ungrasped. Type: `(ResultUngrasped, User, VERIFY, Result) → VerifiedUnderstanding`.

## Definition

**Katalepsis** (κατάληψις): A dialogical act of achieving firm comprehension—from Stoic philosophy meaning "a grasping firmly"—resolving an ungrasped result or artifact into verified user understanding through intent-scented entry points and progressive verification.

```
── FLOW ──
(R, U) → I → E → Fᵣ → Sₑ → B → Tᵣ → detect(E, B) → GT → W → P → Δ → Q → A → P' → Tᵤ → Q(coverage) → (loop until katalepsis)

── MORPHISM ──
Result
  → orient(target, user_signal)        -- infer likely comprehension intents from the target and the user's wording
  → derive_entries(intent)             -- transform inferred intent into high-scent entry points
  → assess_route(intents, entries, R, U, context) -- annotate entry-point adequacy before user selection
  → select(intent_entry_point, route_map) -- user chooses the closest intent-scented entry point
  → materialize(artifact_basis)        -- derive concrete artifact anchors for the chosen intent
  → register(tasks)                   -- track selected entry points as tasks
  → warrant(R, entry_point)           -- assess what the AI's reading of R rests on at each probe site, and how tightly
  → verify(comprehension)             -- Socratic probing per gap type
  → confirm(coverage)                 -- aspect coverage check per entry point
  → VerifiedUnderstanding
requires: result_exists(R)              -- the comprehension target must exist in context; its provenance is unconstrained
deficit:  ResultUngrasped               -- activation precondition (Layer 1)
preserves: R                            -- read-only throughout; morphism acts on user understanding only
invariant: Comprehension over Explanation

── TYPES ──
R  = The comprehension target — the result or artifact whose understanding is sought. Provenance is unconstrained: AI-authored work is the special case in which adjudication warrant is maximal, because the reasoning that produced R is in context
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
Tᵣ = Task registration for tracking; each registered task carries a TaskStatus, terminal at completed or ungrounded
P  = User's phantasia (current representation/understanding)
Δ  = Detected comprehension gap
Q  = Verification question (via Cognitive Partnership Move (Constitution))
A  = User's answer
Aᵣ = User's reasoning behind a conflicting answer (via Cognitive Partnership Move (Constitution)) — under thick warrant that conflict is a misconception; under thin warrant it is a divergence and Aᵣ is evidence weighed on both sides
DR = DivergenceResolution ∈ {AIReadingRevised, UserReadingRevised, Unresolved}  -- how a thin-warrant divergence came out, evaluated from Aᵣ. AIReadingRevised: Aᵣ carried evidence about R the AI's reading lacked, so the AI's reading is wrong — re-run detect and warrant for this entry point against that evidence, then re-enter Phase 3; UserReadingRevised: Aᵣ discloses a mental model to correct against, proceeding exactly as the thick-warrant misconception path does; Unresolved: neither reading is settled — the aspect moves to Λ.ungrounded[current] and the trace shows it as contested rather than verified
Tᵤ = Task update (progress tracking)
P' = Updated phantasia (refined understanding)
J_cov = CoverageRouting ∈ {sufficient, aspect(GapType), proposal}
GapType = {Expectation, Causality, Scope, Sequence, Horizon} ∪ Emergent(E, B)
W  = AdjudicationWarrant : (RecordId × GapType) → Firmness  -- how tightly the AI's own reading of R holds at this probe site. Assessed per site because the AI's grasp of R is as narrow and site-specific as the user's: firm on one aspect of an entry point and weak on another. One signature, keyed like Λ.detected and Λ.probed
Firmness = {thick, thin, absent}
warrant(t, g) = a reading over what gives EVIDENCE ABOUT R at (t, g) — having authored R, having read the artifact basis B, a source the user pointed to, or the user's explicit confirmation. It is a judgment, not a lookup: no table maps an evidence kind to a firmness, because which evidence settles a reading is exactly the context-dependent part
              -- EVIDENCE AXIS vs NAVIGATION AXIS. U and the accumulated session context are first-class for NAVIGATION: they fix which intent, entry point, aspect and reading the morphism is following. They are NOT evidence about R, so they neither establish nor strengthen a reading of it — an ordinary user assertion about the target does not thicken the AI's warrant to adjudicate that same assertion, and stale context does not stand as the measure against the artifact. The exception is where the user cites a source or explicitly confirms: that crosses to the evidence axis, because it is offered as evidence rather than as steering
              -- absent = nothing gives evidence about R at (t, g). It is a state of the AI's ground, never a claim about the aspect
divergence(A) ≡ A conflicts with the AI's reading of R at the current aspect while that aspect's firmness = thin  -- the thin-warrant counterpart of misconception(A). The predicate asserts a MISMATCH and never whose reading is wrong: misconception(A) presupposes the AI knows A to be false, and thin warrant does not license that knowledge
WarrantRouting = user's answer to a WarrantAbsentFinding ∈ {Ground(evidence), Skip, Proceed}  -- Ground(evidence) supplies what the AI lacked (a source to read, or an explicit confirmation) and re-assesses those aspects; Skip moves them to Λ.ungrounded[current]; Proceed sets their firmness to thin and continues. Each disposition removes the aspects it handled from GT_absent, so the finding is raised once per aspect without a fired-flag: Ground re-assesses them, Skip takes them out of unprobed, Proceed leaves them no longer absent
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
DeactivationCondition = { all_tasks_terminal }
TaskStatus ∈ {completed, ungrounded}  -- completed: every aspect that was probed was verified. ungrounded: the entry point terminated with no aspect adjudicable, so nothing about it was verified. Both are TERMINAL for the loop and they are NOT interchangeable: only completed contributes to P' ≅ R
all_tasks_terminal ≡ ∀t ∈ Λ.tasks: t.status ∈ {completed, ungrounded}
unprobed(t) = Λ.detected[t] \ Λ.probed[t] \ Λ.ungrounded[t]  -- detected, not yet probed, and not set aside for absent warrant, for task t
GT_absent = { g ∈ unprobed(current) : Λ.warrant[current][g] = absent }  -- aspects still in play that the AI has no ground to adjudicate. Defined over unprobed rather than detected so that each WarrantRouting disposition falsifies this guard for the aspects it handled; no separate has-fired flag exists or is needed
WarrantAbsentFinding = { entry_point: EntryPoint, aspects: GT_absent, reasoning: String }  -- that the AI has no evidence about R at these aspects, and why, stated before any probe of this entry point. Opacity-preserving: it names the aspects and the absence, never a candidate reading of them
GT_presented = unprobed(current) \ {Horizon}  -- unprobed detected relevant gap types offered at the start-aspect selector; Horizon is never surfaced as a selectable label (Socratic opacity) — probed inline at detection instead
StartAspectSelection = user's chosen starting gap type ∈ GT_presented  -- Phase 3 step-1 answer; fires only when Horizon did not preempt (Horizon preemption always precedes this selector) and |GT| > 0
probed_aspect = the aspect the probe now in flight targets — Horizon for the preempting Horizon probe, Λ.cursor.aspect for the verification loop. Named because the Horizon probe fires WITHOUT binding the cursor, so any guard that reads the cursor is undefined on that path
probe_kind = GapType → {Qc, Qs}   -- per the Gap type → probe kind mapping table: Qc for Expectation/Sequence (classificatory), Qs for Causality/Scope/Emergent (open)
ZeroGapFinding = { entry_point: EntryPoint, reasoning: String }  -- the self-evident finding surfaced when |GT| = 0 for the current entry point (`Zero-gap surfacing`)
ZeroGapConfirmation = user's answer to a ZeroGapFinding ∈ {Confirm, Reopen(description)}  -- Confirm marks the entry point complete; Reopen names a gap the detection missed, registered as Emergent in Λ.detected[current] (mirrors step 3e), re-entering the comprehension loop for that aspect
TerminalShape = { phase1_entry_selection, phase3_zero_gap_confirmation, phase3_warrant_absent_routing, phase3_start_aspect_selection, phase3_verification_probe, coverage_routing, deactivation(DeactivationCondition) }

── PHASE TRANSITIONS ──
Phase 0: (R, U) → Orient(R, U) → I → DeriveEntries(I, R) → E → AssessRoute(I, E, R, U, Context) → Fᵣ  -- intent orientation + route map (silent)
Phase 1: Fᵣ → Present(entry_point enriched by route-adequacy metadata; hidden_route + open when non-empty) → Qc(intent entry points) → Stop → Sₑ       -- entry point selection; default single, ordered multi when user names 2+ concerns [Tool]
Phase 2: Sₑ → Materialize(Sₑ, R) → B → record[selected] → Tᵣ ; Λ.tasks := { the identity each write returned ↦ its task } ; Λ.current := the first of them  -- task registration; BIND the returned identities before anything reads them, since every later record update names one, then initialize Λ.cursor from Λ.current, its entry point, and the active aspect before Phase 3 [Tool]
Phase 3: Tᵣ → record update(current) → detect(E, B) → GT → Λ.detected[current] := Λ.detected[current] ∪ GT → warrant(current) → Λ.warrant[current] := { g ↦ warrant(current, g) | g ∈ GT } → P → Δ  -- comprehension check + per-aspect adjudication-warrant assessment [Tool]
       → [GT_absent ≠ ∅] Qc(WarrantAbsentFinding) → Stop → WarrantRouting  -- absent-warrant branch: fires whenever an aspect still in play has absent warrant, BEFORE any probe of it, because a probe launched from no evidence is the imposed failure this branch exists to prevent. Ground(evidence) → re-run warrant(current, g) for those aspects against the supplied evidence and re-enter; Skip → Λ.ungrounded[current] += those aspects (recorded, never silently dropped); Proceed → Λ.warrant[current][g] := thin for each, continue. Each disposition removes its aspects from GT_absent, so no has-fired state is required [Tool]
       → [unprobed(current) = ∅ ∧ Λ.probed[current] = ∅] record update(Λ.current, ungrounded), next task  -- an entry point every aspect of which was set aside terminates WITHOUT a P' binding, because nothing was adjudicated. This is why TaskStatus separates ungrounded from completed: the loop must terminate, and terminating is not verifying [Tool]
       → [|GT| = 0] Qc(ZeroGapFinding) → Stop → ZeroGapConfirmation  -- zero-gap branch (`Zero-gap surfacing`): Confirm → P' := P ; record update(Λ.current, completed), next task; Reopen(desc) → Λ.detected[current] += Emergent, re-enter this Phase 3 with GT = {Emergent} [Tool]
       → [|GT| > 0] Qs(HC) → Stop → A → P' → Tᵤ ; Λ.detected[current] += Horizon ; Λ.probed[current] += Horizon  if Horizon ∈ GT ∧ admissible(HC) ∧ Horizon ∉ Λ.probed[current]  -- Horizon probe: fires immediately at detection (mandatory once), preempts the start-aspect selector below; scenario-only, opacity-preserving (never the edge/answer/rationale, never a Horizon label); the answer is then evaluated as a normal probe answer (→ 3c eval → coverage), never a return to the start selector [Tool]
       → [Horizon did not preempt ∧ GT_presented ≠ ∅ ∧ Λ.probed[current] = ∅] Qc(GT_presented) → Stop → StartAspectSelection → Λ.cursor.aspect := StartAspectSelection  -- start-aspect selector: user picks the opening gap type from GT_presented = unprobed(current) \ {Horizon}; fires once per entry point (only before any probe for the current task), before the verification loop below [Tool]
       → [|GT| > 0 ∧ Λ.cursor.aspect set] probe_kind(Λ.cursor.aspect)(Δ, Λ.cursor.aspect) → Stop → A → P' → Tᵤ ; Λ.probed[current] += Λ.cursor.aspect    -- verification loop, guarded: fires only with a bound aspect (set at the start-aspect gate, or by coverage routing after a probe); unreachable on the zero-gap branch and immediately after a Horizon preemption whose coverage routing has not yet bound an aspect; probe form dispatched per gap type (probe_kind; Horizon handled by the preempting edge above) [Tool]
       → record[Proposal] → rₚ ; Λ.branchArtifacts += BranchArtifact { kind = Proposal, reference = rₚ, return_pointer = Λ.cursor }  if proposal(A)   -- proposal ejection (detected from Other); rₚ is the RecordId that write returned, bound HERE because C(branch) below reads it off the artifact [Tool]
       → C(branch) if proposal(A)                         -- side-branch continuation closure [Tool]
       → Qᵣs(Aᵣ) → Stop if misconception(A) ∧ Λ.warrant[current][probed_aspect] = thick   -- reasoning inquiry, the AI's reading standing as the measure. probed_aspect = Horizon for the preempting Horizon probe, Λ.cursor.aspect for the verification loop — the Horizon probe never binds the cursor, so guarding on the cursor would leave a thick-warrant Horizon misconception with no arm to take and no terminal shape [Tool]
       → Qᵣs(Aᵣ) → Stop if divergence(A) → DR              -- symmetric reasoning inquiry: under thin warrant misconception(A) is not licensed, so the SAME transition is entered with no verdict settled — it asks the user's reasoning in order to locate which of the two readings is wrong, and the adjudication that follows states its firmness [Tool]
       → [DR = AIReadingRevised] detect(E, B) → warrant(current) → re-enter this Phase 3 for the current entry point  -- Aᵣ carried evidence about R the AI lacked; the AI's reading is what changes [Tool]
       → [DR = UserReadingRevised] continue as the thick-warrant misconception path does — correct against the disclosed mental model and re-probe the same aspect [Tool]
       → [DR = Unresolved] Λ.ungrounded[current] += probed_aspect ; C(contested) → coverage routing  -- neither reading settled; the aspect is recorded contested, never counted as verified [Tool]
       → Ref(source) if eval(A, Aᵣ) requires           -- AI-determined reference [Tool]
       → C(correct) if correct(A)                         -- verified-aspect continuation closure [Tool]
       → Qc(coverage) → Stop if correct(A)               -- aspect summary [Tool]
       → converge → Λ.active := false if all_tasks_terminal  -- convergence evidence is terminal; no downstream gate required
Turn boundary invariant: While `Λ.active = true` at turn end, the last user-facing shape must be a TerminalShape. Relay metadata `C(·)` may precede a terminal shape, but cannot be the sole final shape while active. The `converge` emission is `deactivation(all_tasks_terminal)`, sets `Λ.active := false`, and is terminal without an additional gate.

── LOOP ──
After Phase 3 verification: Evaluate comprehension per gap type.
If |GT| = 0 for current entry point: present typed `ZeroGapFinding` with reasoning per `Zero-gap surfacing` → `ZeroGapConfirmation`; `Confirm` binds `P' := P` (zero-gap phantasia stands as verified) and marks task completed, proceed to next task; `Reopen(description)` registers an Emergent gap in `Λ.detected[current]` and re-enters Phase 3 for this entry point.
If an aspect still in play has absent warrant (`GT_absent ≠ ∅`): present the typed `WarrantAbsentFinding` with its reasoning BEFORE any probe of it → `WarrantRouting`; `Ground(evidence)` re-assesses those aspects against the supplied evidence; `Skip` moves them into `Λ.ungrounded[current]`; `Proceed` sets their firmness to `thin`. Each disposition takes its aspects out of `GT_absent`, so the finding is raised once per aspect without a has-fired flag. If nothing was ever probed for this entry point and nothing remains unprobed, it terminates as `ungrounded` — no `P'` is bound and the trace shows it as adjudicated by nobody, never as verified.
If gap detected (|GT| > 0): present `StartAspectSelection` (unless Horizon preempts) before questioning, then continue questioning within current entry point.
If an answer conflicts with the AI's reading: under thick warrant that is `misconception(A)` and the reasoning inquiry corrects against the disclosed mental model; under thin warrant it is `divergence(A)` and the same inquiry runs with no verdict settled, since either reading may be the wrong one. That inquiry returns a `DivergenceResolution`: `AIReadingRevised` re-runs detection and warrant for the entry point against the evidence `Aᵣ` carried; `UserReadingRevised` proceeds exactly as the misconception path does; `Unresolved` records the aspect contested in `Λ.ungrounded[current]` and routes to coverage.
If correct: emit continuation closure, then Aspect summary — show probed vs unprobed gap types.
  User selects "sufficient" → record update(Λ.current, completed), next pending task.
  User selects additional aspect → Resume with selected gap type.
  User provides proposal via Other → detected by Step 3b, ejected via record, emit side-branch continuation closure, resume current loop position.
Cursor lifecycle: Initialize `Λ.cursor` after Phase 2 task registration. Update it whenever the current task changes, the entry point changes, the active aspect changes, or the user-facing resume label changes. On proposal ejection, snapshot the pre-ejection cursor into the branch artifact; when a branch is present in the emitted closure, closure-level `return_pointer` equals `branch.return_pointer`.
Continue until: every selected task is terminal — `completed` or `ungrounded`. `VerifiedUnderstanding` covers the completed ones; an `ungrounded` task is terminal for the loop and carries no understanding claim.
Convergence evidence: At all-tasks-terminal, present transformation trace — for each t ∈ Λ.tasks with status completed, show (ResultUngrasped(t) → verified(t) with comprehension evidence), each verified aspect carrying the firmness its adjudication was held at; for each t with status ungrounded, show that it terminated with nothing adjudicable and why; and for every t, show the aspects in Λ.ungrounded[t] — set aside for absent evidence, or left contested by an Unresolved divergence — rather than omitting them. An aspect nobody could adjudicate is not an aspect that came out clean, and a task that ended is not thereby a task that was verified. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
Katalepsis = all_tasks_terminal
           ∧ ∀t ∈ Λ.tasks with t.status = completed: P' ≅ R over the aspects probed for t
           -- ≅ is evaluated against the AI's READING of R, which coincides with R only where that aspect's warrant is thick. Three dispositions stay apart and the trace never folds them into one claim: an aspect verified under thick warrant, an aspect verified under thin warrant, and an aspect in Λ.ungrounded (set aside for absent warrant, or left contested by an Unresolved divergence). A task whose status is ungrounded contributes NO conjunct here — it terminated the loop without adjudicating anything, which is why it is a separate status rather than a completed task with an empty probe set
VerifiedUnderstanding = P' over { t ∈ Λ.tasks : t.status = completed }, where each such t satisfies P' ≅ R over its probed aspects. An ungrounded task is outside this value and is reported beside it
Deactivation: `all_tasks_terminal` after convergence evidence sets `Λ.active := false` and terminates as VerifiedUnderstanding over the completed tasks, with every ungrounded task shown as such. The convergence trace is a valid terminal shape, not a relay requiring a follow-up gate.

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
Phase 3 Rec  (track)  → Internal state update (detection/probe/warrant recording: Λ.detected[current] writes at detect / zero-gap Reopen / Horizon; Λ.probed[current] writes at the Horizon probe and verification loop; Λ.warrant[current] writes at the per-aspect warrant assessment and again on WarrantRouting Ground/Proceed; Λ.ungrounded[current] writes on WarrantRouting Skip)
Phase 3 ZeroGapConfirm (constitution) → present (conditional: |GT| = 0 for current entry point; zero-gap finding + reasoning; Confirm/Reopen(description); `Zero-gap surfacing`)
Phase 3 warrant (sense) → Internal analysis (adjudication-warrant assessment per task × gap type: how tightly the AI's own reading of R holds there, judged from what gives evidence ABOUT R. The accumulated context and the user's utterances steer which reading is in play and are not evidence for it; a source the user cites or an explicit confirmation is. Opacity-preserving in what it exposes: firmness states how tightly a reading is held, never the reading's content, so no probe answer and no reasoning path is disclosed — it does not claim to conceal that the AI's ground is weak, which is the whole point of stating it)
Phase 3 WarrantAbsentGate (constitution) → present (conditional: GT_absent ≠ ∅; before any probe of those aspects; names them and the absence of evidence, never a candidate reading of them, then routes {Ground(evidence) | Skip | Proceed} — each disposition falsifies this guard for the aspects it handled)
Phase 3 Horizon (sense) → Internal analysis (admissible(HC) false-positive guard; opacity-preserving — never exposes the suspected edge, the answer, or the selection rationale)
Phase 3 Qs(HC) (constitution) → present (conditional: Horizon ∈ GT ∧ admissible(HC) ∧ Horizon ∉ Λ.probed[current]; preempting Horizon probe — fires once at detection, before the start-aspect selector; scenario-only open question, opacity-preserving — never a Horizon label, the edge, the answer, or the rationale)
Phase 3 probe_kind (constitution) → present (mandatory; probe form per probe_kind — Qc for Expectation/Sequence, Qs otherwise; where the current aspect's warrant is thin, the adjudication that follows the answer STATES its firmness in the prose — this protocol declares Basis: absent, so there is no marker to route it to and the prose is what carries it)
Phase 3 StartAspectSelector (constitution) → present (conditional: |GT| > 0 ∧ Horizon did not preempt ∧ GT_presented ≠ ∅ ∧ Λ.probed[current] = ∅; "Which aspect to start with?" over GT_presented; fires once per entry point before the verification loop)
Phase 3 Qᵣs (constitution)  → present (reasoning inquiry on a conflicting answer; under thick warrant it is a misconception inquiry that corrects against the disclosed mental model, under thin warrant the same gate runs symmetrically with no verdict settled — it asks the user's reasoning in order to locate which of the two readings is wrong, and Aᵣ is then evaluated into a DivergenceResolution that routes to AI-reading revision, the misconception path, or a contested record)
Phase 3 Qc  (constitution)   → present (aspect coverage: sufficient/aspect)
Phase 3 Ref (observe) → artifact read (source artifact, AI-determined)
Phase 3 Tᵤ  (track)  → record update (progress tracking; every amendment names Λ.current, the RecordId Phase 2 bound)
Phase 3 Prop (track)  → record (proposal ejection)
Phase 3 C    (extension)  → TextPresent+Proceed (continuation closure: verified status + side branch if any + return pointer + next moves)
converge    (extension)  → TextPresent+Proceed (convergence evidence trace; proceed with verified understanding)
Seam transition to declared next protocol (extension) → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares — this protocol declares no wired composition edge, so the second trigger is vacuously absent — settles the next move; proceed directly to it, citing that settling source; every Constitution gate inside this protocol and inside the next protocol fires unchanged)
-- Interpretive transparency (Basis:) intentionally absent: Socratic verification requires AI judgment opacity — surfacing reasoning would compromise probe authenticity. Firmness is NOT suppressed by that declaration: it is a separate axis, stating how tightly a reading is held and never what the reading rests on or concludes, so a thin-warrant adjudication carries its firmness in the prose while the reading itself stays opaque

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
  warrant: Map<RecordId, Map<GapType, Firmness>>,
  ungrounded: Map<RecordId, Set<GapType>>,
  active: Bool
}
Map default: an unwritten entry in Λ.detected, Λ.probed, Λ.warrant or Λ.ungrounded reads as the empty set (or, for Λ.warrant, as no firmness recorded for that aspect). unprobed(t) therefore evaluates before any of them has been written for t.
State invariant: Λ.entryPoints = List(Λ.routeMap.entry_point); Λ.selected ⊆ Λ.routeMap.entry_point; every selected entry point has an artifact anchor in Λ.routeMap.artifact_anchor before Phase 2 materialization.

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
```

## Mode Activation

`/grasp` is user-invoked only: activate when the user signals a wish to understand a result or artifact in play — AI-produced work, code or a document someone else wrote, or material the session has put on the table — including a bare command over the current one. Do not activate for an unrelated general question, an accurate account that already demonstrates understanding, an explicit decline, or a trivial formatting-only result.

Loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind while Katalepsis is active.

## Protocol

### Intent-scented entry rendering

Derive up to three first-turn labels from the user's likely comprehension intent — Orientation, Rationale, Impact, Approval, Transfer, or an Emergent intent — and phrase each as what the user will understand, decide, explain, or change by taking that path. Keep Code, Plan, Document, Analysis, Model, or mixed artifact bases behind those labels as grounding anchors. Descriptions state what becomes clear and why it matters; route-map metadata may enrich a label but never reveal a probe answer or reasoning path. A user-authored path remains valid when it stays within `ResultUngrasped → VerifiedUnderstanding`; multiple concerns the user already named become the ordered task list directly.

### Verification rendering and safeguards

Present the selected artifact context and a concrete scenario before each probe. For non-Horizon classificatory probes, render recognizable correct, partial, and misconception trajectories with domain-specific consequences; constitutive probes invite the user's own reasoning, and every probe preserves a free-response path.

Keep an admissible Horizon internal: show only its everyday scenario, never its label, suspected edge, expected answer, or rationale before the answer. A misconception first opens a reasoning inquiry grounded in the user's actual answer, then targets the correction at the disclosed mental model and re-probes the same aspect.

Treat a response as a proposal side branch only when it suggests a system change and either introduces matter outside `R` or directs action at the system; explanation, navigation, and clarification requests remain in the comprehension loop. Record a proposal verbatim, preserve the live cursor, emit the continuation closure, and resume without turning the proposal into a comprehension task.

### Adjudication warrant

Before probing an aspect, judge how tightly your own reading of the target holds there, from what gives you evidence about the target: having produced it yourself, having read the artifact, a source the user points you to, or the user's explicit confirmation. Where you produced it, its reasoning is already in context. A reading built from reading the artifact alone is weakly held — it is your inference and it can be wrong.

The accumulated context and what the user says steer which reading is in play; they are not evidence for it. An ordinary assertion about the target does not license you to adjudicate that same assertion, and something the session said earlier does not stand as the measure against what the artifact says now. What crosses over is a source the user cites or a confirmation they give explicitly, because those are offered as evidence rather than as steering.

State the weak holding when the adjudication lands, after the answer and never before a probe or re-probe on the same aspect. Firmness reports how tightly a reading is held, not its content: it discloses no probe answer and no reasoning path, while it does disclose that your ground is weak — which is the point of stating it. Under a weakly held reading an answer that conflicts with yours is a disagreement, not a mistake. Open the reasoning inquiry without settling which side is wrong, and let it come out three ways: their reasoning carried evidence you lacked and your reading is what changes; their reasoning disclosed a mental model to correct against; or neither reading settles, and the aspect is recorded contested rather than verified.

Where nothing gives you evidence about an aspect, say so before probing it and let the user route: supply the missing evidence, set the aspect aside, or have you probe on a stated weak footing. A set-aside aspect is recorded and shown in the trace. An entry point where every aspect was set aside still ends — it ends as ungrounded, carrying no claim that anything was understood.

When grounding an explanation or correction in code, cite concrete file locations. Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, content belongs to another round or trace, or phase order determines whether text belongs before or inside a gate.

### Intensity

| Level | Realization |
|-------|-------------|
| Light | One Constitution probe of core understanding |
| Medium | One scenario probe of prediction or impact |
| Heavy | Decomposed probes of causal or sequential understanding |

## Rules

- **User-initiated only**: Activate only on the user's wish to understand a result or artifact in play, whatever produced it; an explicit decline withdraws that invitation.
- **Intent scent before artifact taxonomy**: First user-facing options name the user's likely comprehension outcome; artifact categories remain grounding material.
- **User authority**: The user's account of what they understand stands for the ground it covers. Do not probe that ground again; the trace distinguishes demonstrated aspects from user-attested ones.
- **Adjudication warrant**: Judge per aspect how tightly your reading of the target holds, from what gives evidence about the target — never from steering. The accumulated context and the user's ordinary assertions fix which reading is in play and do not license it; a cited source or an explicit confirmation does. Where the reading rests on your own read of the artifact alone, state that firmness with the adjudication, after the answer, and treat a conflict as a disagreement resolved in one of three ways rather than as a mistake. Where nothing gives evidence, say so and let the user route the aspect instead of probing it; record what was set aside, show it in the trace, and end an entry point with nothing adjudicable as ungrounded rather than completed.
- **Proposal ejection and continuation**: Externalize a qualifying proposal without closing Katalepsis. Keep its record reference outside the task set, snapshot and expose the current cursor, then resume the named comprehension move.
- **Round composition**: Compose each round so the reader can act without reassembly — use everyday language, keep each judgment beside its evidence and next-move implication, and place analytical context before its gate.
9a. **Post-answer closure**: After a correct answer or sufficient-understanding signal, emit the verified aspect, current task status, return pointer, and next available moves before coverage routing or completion.
9b. **Active-turn fail-closed**: While `Λ.active = true`, end every turn in one `TerminalShape`; relay context and continuation metadata may precede that shape but never replace it.
- **Zero-gap surfacing**: A `ZeroGapFinding` carries its reasoning to `ZeroGapConfirmation`; only `Confirm` completes the entry, while `Reopen(description)` registers the named Emergent gap and resumes verification.
14a. **Horizon boundary**: Horizon is an evidence-bound comprehension edge inside the selected entry point, not route selection, a decision gap, reframing, or perspective fusion. Admit it only through `admissible(HC)`, probe it opaquely once, and demote or revise the instrumentation after repeated applicable opportunities if detections remain absent, speculative, or unhelpful.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
