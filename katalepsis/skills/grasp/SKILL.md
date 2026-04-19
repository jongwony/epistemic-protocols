---
name: grasp
description: "Achieve certain comprehension after AI work. Verifies understanding when results remain ungrasped, producing verified understanding. Type: (ResultUngrasped, User, VERIFY, Result) → VerifiedUnderstanding. Alias: Katalepsis(κατάληψις)."
---

# Katalepsis Protocol

Achieve certain comprehension of AI work through structured verification, enabling the user to grasp ungrasped results. Type: `(ResultUngrasped, User, VERIFY, Result) → VerifiedUnderstanding`.

## Definition

**Katalepsis** (κατάληψις): A dialogical act of achieving firm comprehension—from Stoic philosophy meaning "a grasping firmly"—resolving ungrasped AI-generated results into verified user understanding through categorized entry points and progressive verification.

```
── FLOW ──
R → C → annotate(C) → Brief?(C, Nₐ) → Sₑ → Tᵣ →
  ∀t ∈ Sₑ: detect(C_t) → GT → order(GT, c*) → φ → Δ →
    Qs(Δ, ι) → A → monitor(A, S₁₋₄) →
      proposal(A)?    → TaskCreate[Proposal]
      misconception(A)? → Qᵣs(Aᵣ) → Read(source) if eval(A, Aᵣ) requires
    → φ' → Tᵤ →
      fire_offer(c)?: Qc_R4(J_R4) → Stop → J_R4
        J_R4 = continue      → Qc(coverage)
        J_R4 = intensity(ι') → recalibrate(Qs, ι') → Qs
        J_R4 = Reframe(Π)    → debt(t) ← unresolved; suspend(t); execute(Π)[Skill]; restore → re-enter(t)
      ¬fire_offer: Qc(coverage)
    → (loop until katalepsis)

── MORPHISM ──
Result
  → categorize(result)                 -- extract comprehension categories from AI work
  → annotate(priority)                 -- AI-autonomous category priority hint (BD-1a, cited basis)
  → brief?(result, narrative)          -- conditional Background briefing (R1-R3, session_narrative gate)
  → select(entry_points)               -- user chooses categories to verify (multi-select gate; Invariant 6)
  → register(tasks)                    -- track selected categories as tasks
  → [ verify(comprehension)            -- Socratic probing per gap type, Causality-first when entry category lacks WHY (BD-1b)
      → monitor(misalignment)          -- S1-S4 observable signals, single-pass detector (R4, R7)
      → ( recalibrate?(intensity)      -- Light/Medium/Heavy probe adaptation; returns to verify
        | reframe?(deficit, debt)      -- path reset with debt preservation (R5, R8); returns to verify via re-entry
        | confirm(coverage) )          -- aspect coverage check per category
    ]*                                 -- re-entrant fixpoint: verify may repeat for the same task until coverage confirms
  → VerifiedUnderstanding
requires: result_exists(R)              -- AI work output must exist in context
deficit:  ResultUngrasped               -- activation precondition (Layer 1)
preserves: R                            -- read-only throughout; morphism acts on user understanding only
invariant: Comprehension over Explanation

── TYPES ──
R  = AI's result (the work output)
C  = Categories extracted from R with per-category priority annotation (BD-1a)
Nₐ = SessionNarrativeAvailable: Bool — AI-derived narrative reachable for briefing content (R1 conditional gate)
B  = Briefing block: Background-only relay text, provisional language (R1-R3)
Sₑ = User-selected entry points (multi-select; Invariant 6 preserves ESC-friendly subset choice)
Tᵣ = Task registration for tracking
ι  = Intensity ∈ {Light, Medium, Heavy} — per-category calibration (user-declared or AI-inferred)
φ  = User's phantasia (current representation/understanding)
Δ  = Detected comprehension gap
Qs = Socratic probe (gate interaction)
Qc = Classificatory gate (gate interaction)
Qᵣs = Misconception reasoning inquiry (gate interaction)
Qc_R4 = R4 conditional re-entry gate (fires iff fire_offer(c))
A  = User's answer
Aᵣ = User's reasoning behind misconception (via gate interaction)
Tᵤ = Task update (progress tracking)
φ' = Updated phantasia (refined understanding)
TurnIndex = Natural number — monotonic turn counter within a probe cycle (enables window=3 co-occurrence predicate)
J_cov = CoverageRouting ∈ {sufficient, aspect(GapType), proposal}
J_R4  = R4Judgment ∈ {continue, intensity(ι'), Reframe(Π)}
GT = Relevant gap types per category ⊆ {Expectation, Causality, Scope, Sequence} ∪ Emergent(C)
c* = AI-ordered first probe within a category; Causality-first when the entry category lacks established WHY (BD-1b)
Π  = ProtocolId ∈ {/clarify, /goal, /frame}  — Reframe routing target (BD-2)

-- Annotation dictionary (AI-autonomous context, cited basis; labels used in Phase/Rule prose):
BD-1a = priority annotation per category (AI label alongside each Phase 1 option; not pre-selection)
BD-1b = Causality-first probe ordering when the entry category lacks established WHY
BD-2  = Reframe sub-routing over Π (expression issue → /clarify, end-state issue → /goal, framework issue → /frame)
BD-7  = abstraction gloss triggering for terms not established in session context

-- Aliases used in MODE STATE:
BriefingBlock = relay text of B (Background-only block; the runtime-rendered form)
Understanding = the phantasia's runtime shape; carries revision history across probes (no further internal structure at this specification layer)
MisalignmentSignal = Sᵢ ∈ {S1, S2, S3, S4} (detector class labels; see below)

-- R4 misalignment detector (observable rules, R7):
Sᵢ ∈ {S1, S2, S3, S4}
S1 = Performance-declaration mismatch: (ι_declared, eval(A)) dissonance
S2 = Repair attempt: within-2-turn self-revision patterns (user self-corrects first articulation)
S3 = Structural reframing: probe-direction pivot patterns (strongest signal; user redirects probe topic)
S4 = Silence/disengagement: composite (time > 60s ∧ content < 20 chars) OR explicit skip markers
signals[c] = List[(Sᵢ, TurnIndex)]  — time-ordered accumulator for category c (drawn from Λ.signals[c])
fire_offer(c) = single_threshold(signals[c]) ∨ co_occurrence(signals[c], window=3)
-- formula references signals[c] explicitly; co_occurrence requires TurnIndex-ordered List (Set is uncomputable)

-- R8 verification debt (Reframe-triggered):
debt(t) = { pending_probes: List[GapType],
            in_progress_probe: Option[{gt, A, eval: unresolved}],
            partial_probes: List[{gt, eval: partial, followup_pending: true}] }
-- debt persists on task metadata when Reframe fires; cleared on re-entry or explicit user dismissal

-- Reframe suspend/restore state (mirrors Prosoche upstream routing pattern):
SuspendState = { suspended_phase: Phase, suspended_task: TaskId, debt: debt(t), reframe_target: Π }

-- R11 abstraction gloss (BD-7):
gloss(τ, Σ) = inline plain-language explanation when τ ∉ established_in(Σ)
-- fires on first mention of unestablished terms in /grasp output (briefing, probes, R4 gate, coverage)

── PHASE TRANSITIONS ──
Phase 0: R → Categorize(R) → C → annotate_priority(C) → Nₐ?(R)          -- silent: categorize + BD-1a annotation + narrative-availability check
Phase 1: C → brief?(C, Nₐ) → helper_prose → Qc(entry points, multi) → Stop → Sₑ   -- three-block: Background (conditional) → Helper → clean Gate [Tool]
Phase 2: Sₑ → TaskCreate[selected] → Tᵣ                                  -- task registration [Tool]
Phase 3: Tᵣ → TaskUpdate(current) → detect(C_t) → GT → order(GT, c*) → φ → Δ   -- aspect-select relay; Causality-first when entry category lacks WHY (BD-1b)
       → Qs(Δ, ι) → Stop → A                                              -- intensity-calibrated probe; Qc-kind for Expectation/Sequence, Qs-kind for Causality/Scope/Emergent [Tool]
       → monitor(A, S₁₋₄)                                                 -- silent misalignment monitor appends to Λ.signals[c] with TurnIndex
       → TaskCreate[Proposal] if proposal(A)                              -- proposal ejection (detected from Other) [Tool]
       → Qᵣs(Aᵣ) → Stop if misconception(A)                              -- reasoning inquiry [Tool]
       → Read(source) if eval(A, Aᵣ) requires                            -- AI-determined reference [Tool]
       → φ' → Tᵤ                                                         -- phantasia update + task progress
       → Qc_R4(J_R4) → Stop if fire_offer(c)                              -- conditional R4 re-entry gate {continue, intensity(ι'), Reframe(Π)} [Tool]
         J_R4 = Reframe(Π) → debt(t) ← unresolved; suspend(Λ)[TaskCreate]; execute(Π)[Skill]; restore(Λ)[TaskGet] → re-enter(t)  -- R8 debt preservation; suspend/restore mirrors Prosoche Sub-A0 pattern
       → Qc(coverage) → Stop if correct(A)                                -- aspect summary [Tool]

── LOOP ──
After Phase 3 probe-response cycle: Evaluate comprehension per gap type; run single-pass misalignment monitor (R4) which appends to Λ.signals[c] with TurnIndex.
If |GT| = 0 for current category: present self-evident finding with reasoning per Rule 10, mark task completed upon confirmation, proceed to next task.
If gap detected: Continue questioning within current category.
If fire_offer(c): Present R4 conditional gate before aspect coverage. continue → default path; intensity(ι') → recalibrate next probe with successor intensity; Reframe(Π) → preserve debt(t), suspend Λ via TaskCreate, execute Π inline via Skill, restore Λ via TaskGet, re-enter t with debt surfaced.
If correct: Aspect summary — show probed vs unprobed gap types.
  User selects "sufficient" → TaskUpdate completed, next pending task.
  User selects additional aspect → Resume with selected gap type.
  User provides proposal via Other → detected by Step 3b, ejected via TaskCreate, resume current loop position.
User ESC after any completed category's probe cycle → graceful termination per Invariant 6 (selective-verification honored).
Continue until: all selected tasks completed OR user ESC.

Re-entrant fixpoint: the MORPHISM `[verify → monitor → (recalibrate | reframe | confirm)]*` may repeat for the same task until confirm(coverage) accepts. FLOW and PHASE TRANSITIONS above capture the repetition via the J_R4 branches returning to verify; MORPHISM marks it with `*` (Kleene-closure over the verify-subchain).

Convergence evidence: At all-tasks-completed, present transformation trace — for each t ∈ Λ.tasks, show (ResultUngrasped(t) → verified(t) with comprehension evidence). Convergence is demonstrated, not asserted.

── CONVERGENCE ──
Katalepsis = ∀t ∈ Λ.tasks: t.status = completed
           ∧ φ' ≅ R (user understanding matches AI result)
VerifiedUnderstanding = φ' where (∀t ∈ Λ.tasks: t.status = completed ∧ φ' ≅ R) ∨ user_esc

── TOOL GROUNDING ──
-- Realization: gate → TextPresent+Stop; relay → TextPresent+Proceed
Phase 0 Categorize   (observe) → Internal analysis (Read for context if needed)
Phase 0 annotate     (sense)   → Internal analysis (AI-autonomous priority annotation per category with cited basis, BD-1a)
Phase 0 Nₐ check     (sense)   → Internal analysis (session_narrative_available gate for R1 briefing)
Phase 1 brief?       (relay)   → TextPresent+Proceed (Background block; fires iff Nₐ = true, provisional language per R3)
Phase 1 helper       (relay)   → TextPresent+Proceed (pre-gate prose: Reframe/intensity free-response mechanics + ESC note)
Phase 1 Qc           (gate)    → present (entry point multi-select; clean option list — categorical selections only)
Phase 2 Tᵣ           (track)   → TaskCreate (category tracking)
Phase 3 detect       (sense)   → Internal analysis (gap type relevance detection per category)
Phase 3 order        (relay)   → TextPresent+Proceed (aspect-select relay: AI-ordered probe sequence, Causality-first when c* lacks WHY; free-response override available, BD-1b)
Phase 3 Qs           (gate)    → present (mandatory; Esc key → loop termination at LOOP level, not an Answer)
Phase 3 monitor      (sense)   → Internal analysis (R4 misalignment signal detection S1-S4; silent)
Phase 3 Qᵣs          (gate)    → present (misconception reasoning inquiry)
Phase 3 Qc_R4        (gate)    → present (conditional re-entry: {continue, intensity(ι'), Reframe(Π)}; fires iff fire_offer(c))
Phase 3 execute(Π)   (dispatch) → Skill (reframed protocol inline execution; debt preserved on task metadata)
Phase 3 Qc           (gate)    → present (aspect coverage: sufficient/aspect)
Phase 3 Ref          (observe) → Read (source artifact, AI-determined)
Phase 3 Tᵤ           (track)   → TaskUpdate (progress tracking; metadata.verification_debt when Reframe fires)
Phase 3 Prop         (track)   → TaskCreate (proposal ejection)
converge             (relay)   → TextPresent+Proceed (convergence evidence trace; proceed with verified understanding)
-- Interpretive transparency (Basis:) intentionally absent for Socratic probes: verification requires AI judgment opacity — surfacing reasoning would compromise probe authenticity. Basis: is permitted for BD-1a priority annotation + BD-1b probe ordering + BD-2 Reframe sub-routing + BD-7 abstraction gloss (these are AI-autonomous actions outside probe authenticity scope).

── ELIDABLE CHECKPOINTS ──
-- Axis: relay/gated = interaction kind; always_gated/elidable = regret profile
Phase 1 brief?        → relay, conditional (fires iff Nₐ = true; regret: bounded — R4 triggered re-entry catches mis-framed entry)
Phase 1 helper        → relay (fires unconditionally when Phase 1 emits; regret: bounded — free-response channels remain available without helper)
Phase 1 Qc (entry)    → always_gated (gated: verification scope selection + Invariant 6 ESC-friendly multi-select anchor)
Phase 3 order         → relay (option-set relay test: option-level entropy → 0 because BD-1b's Causality-first rule selects the unique entry dominating under the category's WHY-availability evidence. When entry category has established WHY, default ordering dominates; when WHY is absent, Causality dominates. No weighting configuration produces a different starting aspect given the same evidence set, so the choice is deterministic relative to Λ. Free-response override remains available at any probe response turn, and R4 monitor's S3 signal catches mis-ordering; regret: bounded)
Phase 3 Qs (verify)   → always_gated (gated: Socratic probe — user comprehension is the measurement)
Phase 3 Qᵣs (reason)  → always_gated (gated: misconception reasoning hypothesis)
Phase 3 Qc_R4 (re-entry) → always_gated, conditional (fires iff fire_offer(c); gated: continue/intensity/Reframe is constitutive judgment on protocol path)
Phase 3 Qc (coverage) → always_gated (gated: aspect coverage — sufficient vs explore more)

── MODE STATE ──
Λ = {
  phase: Phase,
  R: Result,
  categories: List<Category>,         -- each carries priority_annotation (BD-1a)
  narrative_available: Bool,          -- Nₐ, Phase 0 gate for R1 briefing
  briefing: Option<BriefingBlock>,    -- emitted only if Nₐ = true
  selected: List<Category>,
  tasks: Map<TaskId, Task>,           -- Task.metadata may carry verification_debt (R8)
  current: TaskId,
  phantasia: Understanding,
  detected: Map<TaskId, Set<GapType>>,
  probed: Map<TaskId, Set<GapType>>,
  intensity: Map<TaskId, Intensity>,  -- per-category calibration (declared or AI-inferred)
  signals: Map<TaskId, List[(MisalignmentSignal, TurnIndex)]>,  -- R4 monitor accumulator, time-ordered for window=3 predicate
  upstream: Option<SuspendState>,     -- Reframe suspend/restore checkpoint (mirrors Prosoche Sub-A0 pattern)
  active: Bool
}

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Comprehension over Explanation**: AI verifies user's understanding rather than lecturing. The goal is confirmed comprehension, not information transfer.

**Briefing-as-Triage lineage**: The protocol augments verification with a conditional Background briefing (when session narrative supports it), AI-priority annotation for multi-select triage, AI-ordered probe sequencing (Causality-first when the entry category lacks established WHY), observable misalignment monitoring with triggered re-entry, and Reframe with verification-debt preservation. These mechanisms reduce navigation overhead without replacing user authority — user selects, AI surfaces, debt resumes unresolved verification after path reset.

## Invariants

These six invariants constrain every revision of the protocol's behavior and downstream use. Any mechanism that would collapse any of them is rejected before implementation.

1. **"AI offers, user decides" boundary**: AI detects and surfaces; user retains judgment authority. The protocol may minimize gate frequency but must not collapse the offering/deciding separation into AI-autonomous user-judgment substitution. Phase 1 multi-select, Phase 3 probe gates, and R4 conditional re-entry all honor this.

2. **Provisional framing over declarative certainty**: Briefing phrasing marks AI's framing as current reading (revisable on user dialogue), not settled ground. Declarative authority-voice is excluded. The protocol aims for stabilized understanding through dialogue, not unconditional certainty — revision on evidence is expected rather than exceptional.

3. **Domain-expert ≠ artifact-expert distinction**: Briefing applies at per-artifact level even for protocol-design experts. The user knows /grasp; they do not know each new AI artifact. Background briefing presence is not gated on expertise inference — only on AI's narrative-availability honesty.

4. **Detection-from-silence asymmetry**: AI cannot reliably detect "user already framed this artifact" from invocation context. The unbounded-regret case (missed briefing → cognitive collapse) dominates the bounded-regret case (redundant briefing → seconds for expert). Same-artifact fade requires mechanical signals only (same session id, same input identifier, explicit re-invoke), never AI inference of "this seems related."

5. **Single-pass default, triggered re-entry only**: Briefing fires ONCE at startup by default. Mid-protocol re-entry is triggered by R4 observable signals, not routine. Re-entry is not retraction of the default path — it is the dialogical moment where observed misalignment warrants path reset.

6. **Selective-verification + ESC-friendly workflow**: /grasp is a selective verification protocol — user retains the right to verify a category subset only and ESC after completing the subset. Phase 1 multi-select is the intent-expression channel for this selection. Per-category task lifecycle supports graceful ESC — completion of all categories is NOT a convergence prerequisite. This invariant bounds design revisions: mechanisms that collapse Phase 1 into AI-autonomous category selection (removing user's explicit subset declaration) are rejected because they increase burden on the ESC workflow.

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

**Key difference**: AI work exists but the result remains ungrasped by the user. Katalepsis guides user to firm understanding through structured verification.

## Mode Activation

### Activation

Command invocation or trigger phrase activates mode until comprehension is verified for all selected categories.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/grasp` slash command or description-matching input. Always available.
- **Layer 2**: No AI-guided activation. User signals awareness of comprehension deficit.

### Priority

<system-reminder>
When Katalepsis is active:

**Supersedes**: Default explanation patterns in AI responses
(Verification questions replace unsolicited explanations)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 1, present entry point selection via gate interaction and yield turn.
At Phase 3, present comprehension verification via gate interaction and yield turn.
</system-reminder>

- Katalepsis provides structured comprehension path
- Loaded instructions resume after mode deactivation

**Protocol precedence**: Structural constraint — always executes last (graph.json is authoritative source for information flow). Cross-cutting: requires all protocols to complete before verification.

**Advisory relationships**: Receives from * (precondition: all protocol output required for comprehension verification). Katalepsis is structurally last.

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
| User explicitly cancels | Accept current understanding |
| User demonstrates full comprehension | Early termination |

## Category Taxonomy

Categories are extracted from AI work results. Common categories:

| Category | Description | Example |
|----------|-------------|---------|
| **New Code** | Newly created functions, classes, files | "Added `validateInput()` function" |
| **Modification** | Changes to existing code | "Modified error handling in `parse()`" |
| **Refactoring** | Structural changes without behavior change | "Extracted helper method" |
| **Dependency** | Changes to imports, packages, configs | "Added new npm package" |
| **Architecture** | Structural or design pattern changes | "Introduced factory pattern" |
| **Bug Fix** | Corrections to existing behavior | "Fixed null pointer in edge case" |
| **Deletion** | Removed code, features, or dependencies | "Removed deprecated `legacyAuth()` function" |

## Gap Taxonomy

Comprehension gaps within each category:

| Type | Detection | Question Form | Relevance |
|------|-----------|---------------|-----------|
| **Expectation** | User's assumed behavior differs from actual | "Did you expect this to return X?" | Behavior changes (new code, bug fix, modification) |
| **Causality** | User doesn't understand why something happens | "Do you understand why this value comes from here?" | Non-obvious causal chains (architecture, dependency) |
| **Scope** | User doesn't see full impact | "Did you notice this also affects Y?" | Cross-cutting impact (architecture, refactoring) |
| **Sequence** | User doesn't understand execution order | "Do you see that A happens before B?" | Order-sensitive changes (initialization, dependency) |
| **Emergent** | Gap outside canonical types | Adapted to specific comprehension deficit | Must satisfy morphism `ResultUngrasped → VerifiedUnderstanding`; boundary: comprehension verification (in-scope) vs. intent expression (→ `/clarify`) or decision gaps (→ `/gap`) |

**Emergent gap detection**: Named types are working hypotheses, not exhaustive categories. Detect Emergent gaps when:
- User's comprehension difficulty spans multiple named types (e.g., understanding both causality and scope simultaneously in a cross-cutting change)
- User selects "Other" or pushes back on all presented gap types in the coverage check
- The AI work involves domain-specific patterns where canonical comprehension dimensions are insufficient (e.g., concurrency reasoning, security implications)

## Protocol

### Phase 0: Categorization + Priority Annotation + Narrative Check (Silent)

Analyze AI work result, extract categories, annotate priority, and check briefing eligibility. All silent — no user interaction.

1. **Identify changes**: Parse diff, new files, modifications
2. **Categorize**: Group by taxonomy above
3. **Prioritize (internal ordering)**: Architecture > new code > modification > ...
4. **Summarize**: Prepare concise category descriptions
5. **Priority annotation (BD-1a)**: For each category, attach an AI-autonomous priority hint with cited basis (session evidence grounding the recommendation). Annotation is a short label shown alongside each Phase 1 option and names the basis — the specific session evidence that grounds the priority. Annotation informs user choice but does **not** pre-select — user retains full multi-select authority per Invariant 6.
6. **Narrative availability check (Nₐ)**: Determine whether session-internal narrative is available to support Background briefing. `Nₐ = true` when the result R was produced within the current session with traceable question-context-direction sequence; `Nₐ = false` when R is external (cloned code without session work, uploaded PDF, official documentation, imported artifact). If `Nₐ = false`, Phase 1 briefing is skipped — producing Background without session-derived narrative would violate R3 (provisional language requires honest hypothesis-not-declaration framing).

**Cross-session enrichment**: Verified understanding domains surfaced via Anamnesis's hypomnesis store may adjust Phase 0 category prioritization — areas with established comprehension receive lower priority while novel or previously-failed comprehension areas are flagged. This is a heuristic input that may bias detection toward previously observed patterns; gate judgment remains with the user.

**Revision threshold**: When accumulated Emergent gap detections across 3+ sessions cluster around a recognizable pattern outside the named types {Expectation, Causality, Scope, Sequence}, the Gap Taxonomy warrants promotion to a new named type. When accumulated probe misclassifications across 3+ sessions cluster around a specific gap type's probe kind boundary (Qc vs Qs), that type's probe kind assignment warrants revision.

### Phase 1: Entry Point Selection (Three-Block Structure)

Phase 1 renders in three ordered blocks: (1) conditional Background briefing, (2) pre-gate helper prose, (3) clean categorical gate. The ordering respects Context-Question Separation: the gate contains only the question + structured options + the implicit free-response channel; all analysis, mechanics, and examples are emitted as assistant prose **before** the gate boundary. This is tool-agnostic — any realization that preserves gate semantics (present structured content → yield turn → parse response) satisfies the contract.

**Block 1: Background briefing (conditional, relay)**

Fires iff `Nₐ = true` (Phase 0 determined session narrative is available).

- **Form**: Plain text block, ≤ 7±2 propositions (CLT working memory bound). Yields no turn.
- **Content**: Background only — WHY the AI work was done (what question/problem drove it). Framing (how AI worked) and Emergent dimensions (cross-cutting AI findings) are **excluded** — they surface AI introspection, not user comprehension targets, and add cognitive load without serving verification.
- **Phrasing (R3 provisional)**: Surface AI's framing as risked-and-revisable hypothesis, not authoritative ground. Phrasing must mark the framing as AI's current reading (revisable on user dialogue), not as settled ground. Declarative authority-voice is excluded.
- **Skip conditions**: `Nₐ = false` (external artifact without session narrative); OR same-artifact fade triggered by mechanical signals only — same session id + same input identifier + explicit user re-invoke. AI inference of "this seems related to prior artifact" is prohibited (Invariant 4). Cross-artifact, no fade.
- **Same-artifact fade**: On re-invocation matching mechanical signals, demonstrably-consumed segments collapse to one-line reference; not-yet-consumed segments present at full depth.

**Block 2: Helper prose (relay)**

Pre-gate assistant text that names the free-response channels available at the gate without duplicating them as structured options. Emit unconditionally when Phase 1 fires.

Minimum helper content:
- Reframe availability: user may free-respond with a direction-rethink request at the gate; the classifier routes the request per BD-2 (expression issue → /clarify, end-state issue → /goal, framework issue → /frame).
- Declarative intensity availability: user may free-respond with per-category intensity assignments (Light/Medium/Heavy per selected category); the classifier integrates these into the intensity calibration for Phase 3.
- ESC note: completing a category subset and pressing ESC after the subset is a first-class workflow (Invariant 6); convergence does not require all categories.

Adapt wording to the specific session; no fixed template.

**Block 3: Categorical gate (clean)**

**Present** the multi-select gate with only categorical options — no options that duplicate free-response paths (structural gate-option criterion).

```
question: "What would you like to understand first?"
multiSelect: true
options:
  - label: "[Category A]"
    description: "[brief description] — [priority annotation with cited basis, if any]"
  - label: "[Category B]"
    description: "[brief description] — [priority annotation with cited basis, if any]"
  - label: "[Category C]"
    description: "[brief description]"
```

Gate presentation yields turn for user response.

**Design principles**:
- Show max 4 categories per question
- Each category is an individual option (do not pre-combine into composite options)
- Allow multi-select (required — anchors Invariant 6 ESC-friendly subset selection)
- Priority annotation (BD-1a) attached inline to description with cited basis; does **not** pre-select
- Reframe and intensity declarations arrive via free-response, not as structured options

**Free-response classification at gate response**:
- Categorical pick (matches a listed option) → standard Sₑ selection
- "Reframe — [direction]" or equivalent redirect → R5 Reframe path, routed per BD-2
- "[Category] [intensity]" declarations → intensity calibration merged into `Λ.intensity[c]` for Phase 3 probe adjustment
- Mixed (categorical + modifier) → process selection first, then modifier
- Ambiguous → ask disambiguation before proceeding (do not silently classify)

### Phase 2: Task Registration

**Call TaskCreate** for each selected category:

```
TaskCreate({
  subject: "[Grasp] Category name",
  description: "Brief description of what to understand",
  activeForm: "Understanding [category]"
})
```

Set task dependencies if categories have logical order (e.g., understand architecture before specific implementation).

### Phase 3: Comprehension Loop

For each task (category):

1. **TaskUpdate** to `in_progress`

2. **Present overview + aspect ordering (relay)**: Brief summary of the category, then show detected gap types (GT) and AI-ordered probe sequence as relay (not a gate). Emit the detected aspects and starting aspect c* as text output:

   - Detected relevant aspects for [Category]: [GT list]
   - Starting aspect: [c*] — [1-line reason]

   **Ordering rule (BD-1b)**: Causality-first when the category lacks established WHY in session context — the user is likely to redirect to causal grounding before engaging other aspects, so lead with Causality to prevent the redirect overhead. Otherwise per current /grasp default ordering by gap type relevance. Priority annotation from Phase 0 (BD-1a) informs the reason line.

   **Free-response override**: This step is relay, not a gate — Phase 3 proceeds to probe construction. User can override the starting aspect at any probe response turn via free-response directing a different gap type; R4 monitoring additionally watches for S3 structural-reframing patterns that indicate misordered entry.

   Remaining aspects surface in step 3d aspect coverage check.

3. **Verify comprehension** by **presenting** a Socratic probe via gate interaction:

   Gate presentation yields turn for user response.

   Present the relevant context as text output:
   - What the AI work did for this aspect (the component, behavior, or mechanism being tested)
   - The specific scenario or input being used for the probe

   **Intensity calibration**: Per-category intensity `ι ∈ {Light, Medium, Heavy}` (declared by user at Phase 1 free-response or AI-inferred default `Heavy` when absent) shapes probe depth:
   - Light → single-probe gate targeting core understanding
   - Medium → scenario-based gate targeting prediction
   - Heavy → multi-step decomposed gate targeting causal reasoning

   The AI-inferred default is Heavy (conservative — over-probing rarely harms comprehension; under-probing risks confirmation-bias pass-through). User override via free-response recalibrates subsequent probes and contributes to coherence measurement (declared intensity vs observed performance).

   Construct a probe based on the detected gap type — the probe should test whether the user can demonstrate the specific knowledge that gap type targets (prediction for Expectation, explanation for Causality, impact awareness for Scope, ordering for Sequence).

   **Gap type → probe kind mapping**: The probe’s gate kind (Qc vs Qs) varies by gap type to match the answer space structure:

   | Gap Type | Probe Kind | Rationale |
   |----------|------------|-----------|
   | **Expectation** | Qc (classificatory) | Answer space is enumerable — user selects from finite correct/partial/misconception options representing predicted behaviors |
   | **Sequence** | Qc (classificatory) | Answer space is enumerable — user selects from finite ordering options |
   | **Causality** | Qs (constitutive) | Causal reasoning requires model-discriminating options where the user’s own reasoning is diagnostic |
   | **Scope** | Qs (constitutive) | Impact enumeration requires user-generated content — scope awareness cannot be tested by selection alone |
   | **Emergent** | Qs (constitutive) | Unknown structure favors open response — no pre-enumerable answer space |

   Estimated split: ~40–50% Type F (Expectation, Sequence → Qc probes), ~50–60% Type M (Causality, Scope, Emergent → Qs probes). The split reflects that comprehension verification often involves causal and scope understanding, which resist reduction to finite option sets.

   Then **present** the probe question with understanding-level options:
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
       description: "User proposal during [category]: [verbatim user text]",
       activeForm: "Archiving user proposal"
     })
     ```
   - Return to comprehension loop immediately

   **Detection criteria**:
   - **Required**: Suggests changes or improvements to the discussed system (direction toward knowledge capture, not comprehension)
   - **Auxiliary** (at least one): introduces concepts not in original AI work output `R`; contains action-oriented language directed at the system (should change, could add, how about replacing)
   - **Exclude**: Requests for further explanation, code navigation, or clarification — even if phrased with action-oriented language (e.g., "could you show me that part?")

3c. **AI-determined response** (after evaluating user answer A):

   AI evaluates A against expected understanding and determines response:

   | Evaluation | Action | Tool |
   |------------|--------|------|
   | Correct (φ' ≅ R) | Confirm, proceed to next aspect or category | TaskUpdate |
   | Partial gap | Targeted followup probe on the gap area | Gate interaction |
   | Misconception | Reasoning inquiry → targeted correction | Gate interaction, Read (AI-determined) |

   **Misconception handling** (three-step):

   1. **Reasoning inquiry**: Present the detected misconception context as text output (what the user answered vs. what was expected, without revealing the correct answer). Then **present** AI-generated reasoning hypotheses via gate interaction. Infer 2-3 likely reasoning paths from the specific misconception and present as options. Each option is a context-specific hypothesis derived from the user's actual wrong answer (not a generic template). Do not reveal the correct answer yet. "Other" is always available for unlisted reasoning.

   2. **Targeted correction**: Using both A and Aᵣ, address the root cause of the misconception. If Aᵣ reveals a specific mental model error, correct that model directly. Call Read for supporting reference if eval(A, Aᵣ) requires.

   3. **Resume**: Output a brief text nudge before presenting via gate interaction — remind the user they can share improvement ideas or unlisted comprehension gaps via the "Other" option. Adapt wording to fit the current context (no fixed template). This surfaces the Proposal path at the cognitive transition point between correction and re-verification, when users may have formed improvement ideas but are focused on "getting the right answer." User input via Other triggers Step 3b Proposal ejection workflow, then resumes the verification loop. Present via gate interaction again for the same aspect.

3c-monitor. **Misalignment monitoring (R4, silent)**: During each Phase 3 probe-response cycle, run single-pass detector across four observable signals. If `fire_offer(c)` evaluates true (single signal at threshold OR two signals co-occurring within 3-turn window), proceed to step 3c-R4 before aspect coverage.

   Signal definitions (R7 observable rules, not intuitive detection):

   | Signal | Trigger (predicate form, language-agnostic) | FP budget |
   |--------|---------------------------------------------|-----------|
   | **S1 Performance-declaration mismatch** | `(ι_declared = Light ∧ eval(A) ∈ {partial, misconception}) ∨ (ι_declared = Heavy ∧ first_probe.eval = correct ∧ followup.eval = correct)`. Scope: applies only when response is evaluable; refusal-to-probe handled by S3 alone | ≤ 30% |
   | **S2 Repair attempt** | User self-revises their first articulation within a 2-turn window: the response contains a self-correction marker that retracts or restates the prior content, OR the user issues a second response to the same probe without an intervening AI turn. Evaluated by semantic function (retraction intent), not keyword match | ≤ 40% |
   | **S3 Structural reframing** | User response pivots the probe's direction: the response shifts the probe's topic to an adjacent or contrary framing, questions the probe's premise rather than answering it, or explicitly redirects to a different gap type or category. Evaluated by semantic function (pivot intent relative to probe topic), not keyword match. Strongest evidence: explicit redirect | ≤ 25% |
   | **S4 Silence/disengagement** | Composite (both required): `time > 60s ∧ content < 20 chars`. OR explicit disengagement: response carries semantic force of withdrawal from the verification (skip / proceed-without-completing / terminate). **Time alone is not a trigger** — deliberative responses routinely exceed 60s. Evaluated by semantic function, not keyword match | ≤ 50% |

   Composite trigger: `fire_offer(c) = single_threshold(Λ.signals[c]) ∨ co_occurrence(Λ.signals[c], window=3)`.

   Signal detection is semantic-function driven, not enumerated-keyword matching. Novel phrasings matching the semantic predicate fire the signal; coincidental surface matches that lack the semantic intent do not. Per-signal FP budgets govern tuning.

   **Conservative default**: Initial deployment ≤ 1 trigger per 5 /grasp invocations (highest-precision threshold per signal). Tune only after dogfood evidence; log all tuning.

3c-R4. **Conditional re-entry gate (when fire_offer fires)**:

   Present the signal observation as text output (1-line, no internal terminology — no "S3 detected" or "FP budget"):
   - [Brief observation]: 방금 [signal-specific natural summary]를 관측했습니다.

   Then **present**:

   ```
   How would you like to proceed?
   options:
     - label: "현재 강도 유지"
       description: "continue as-is with [current intensity]"
     - label: "강도 조정"
       description: "recalibrate to [proposed intensity for category c, with basis]"
     - label: "Reframe"
       description: "path reset via [proposed routing target per BD-2: /clarify | /goal | /frame, with basis]"
   ```

   Three structurally distinct actions after AI-detected misalignment — all belong as structured options per the structural gate-option criterion (none reduces cleanly to free-response). User free-response override on routing target is honored.

   - **continue** → proceed to Step 3d
   - **intensity(ι')** → recalibrate `Λ.intensity[c]`, re-probe with new intensity
   - **Reframe(Π)** → Step 3c-debt

3c-debt. **Verification debt preservation (R8, on Reframe fire)**:

   Reframe is a verification path reset, not exemption. When Reframe(Π) fires for category `c`:

   1. Compute `verification_debt(c)`:
      - `pending_probes`: gap types in `GT_detected(c) \ GT_probed(c)`
      - `in_progress_probe`: the probe whose response triggered Reframe — evaluation remains `unresolved`
      - `partial_probes`: gap types with `eval = partial` and pending follow-up
   2. Persist `Λ.tasks[c].metadata.verification_debt = debt` (task stays `in_progress`, not `completed`)
   3. Suspend `Λ` state into `Λ.upstream: SuspendState` (TaskCreate with {suspended_phase, suspended_task=c, debt, reframe_target=Π})
   4. Execute protocol Π inline via Skill tool
   5. On Π convergence: restore `Λ` from `Λ.upstream` via TaskGet; re-enter category `c` with debt surfaced (one-line Korean notice that verification remains unresolved and resumption follows Reframe, plus the in-progress probe context)
   6. User options on re-entry:
      - **Resume** (default) — continue from pending probe
      - **Mark debt cleared** — explicit user judgment that reframing obsoleted the original probes
      - **Defer** — mark task `pending`, debt preserved across session (not cross-session)

   Debt does **not** persist across /grasp sessions — each session is a fresh comprehension act.

3d. **Aspect coverage check** (before marking category complete):

   When step 3c evaluates as Correct for the current gap type:

   1. Compare probed vs. unprobed detected relevant gap types (canonical + Emergent) for this category
   2. If unprobed aspects exist, output a brief text nudge reminding the user they can share improvement ideas or unlisted comprehension gaps via the "Other" option (adapt wording to context, no fixed template).

   Present progress as text output:
   - Verified [probed aspects] in [Category]

   Then **present**:

   ```
   question: "Any other aspects to explore?"
   options:
     - label: "Sufficient"
       description: "Proceed to next category with current understanding"
     - label: "[Unprobed gap type]"
       description: "[Why this gap type is relevant to this category]"
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

**Chunking**: Break complex changes into digestible pieces. Verify each chunk before proceeding.

**Code reference**: When explaining, always reference specific line numbers or file paths.

### Abstraction Accessibility (R11)

Every /grasp output surface — briefing text, probe question, probe options, aspect-select relay, R4 gate prose, coverage check — must carry inline plain-language gloss for terms **not established in session context**.

**Triggering (BD-7, AI-autonomous with cited basis)**: AI detects terms on first mention during output writing and checks against established-in-session set. Target: eliminate "what does this symbol mean?" re-lookup overhead — the actual user-experienced cognitive load that originally motivated Briefing-as-Triage.

- Detection: term `τ` is introduced in /grasp output AND `τ ∉ established_in(Σ)` where `established_in(Σ)` is the set of terms defined earlier in the current session (user explained OR AI introduced with gloss).
- Gloss form: inline parenthetical or em-dash appositive immediately following the term, stating the meaning in plain session-appropriate language. The gloss is shortest that resolves the lookup; longer glosses signal the term should be replaced rather than explained.
- Cited basis: AI silently tracks which terms were glossed; user can request gloss omission via free response and the session honors that preference until re-invoked.
- Budget: glosses must stay ≤ 30% of surface text length per block; if an output surface would exceed this, the surface is itself too abstract — simplify rather than gloss-stack.

**Scope**: applies only to `/grasp`-generated surfaces. User-provided terms are never glossed back at the user — that would be patronizing.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Simple change, user seems familiar | Single-probe gate interaction targeting core understanding |
| Medium | Moderate complexity | Scenario-based gate interaction targeting prediction |
| Heavy | Complex architecture or unfamiliar pattern | Multi-step decomposed gate interaction targeting causal reasoning |

## Rules

1. **User-initiated only**: Activate only when user signals desire to understand
2. **Recognition over Recall**: Present structured options via gate interaction and yield turn — structured content reaches the user with response opportunity — gate interaction requires turn yield before proceeding
3. **Chunk complexity**: Break large changes into digestible categories
4. **Task tracking**: Call TaskCreate/TaskUpdate for progress visibility
5. **Code grounding**: Reference specific code locations
6. **User authority**: User's "I understand" is final; selective verification per Invariant 6 — user can ESC after any completed category's probe cycle without completing the rest
7. **Proposal ejection**: When user answer `A` drifts from comprehension toward knowledge capture (suggesting changes/improvements to the system), acknowledge briefly, call TaskCreate to externalize the proposal, and return to verification. This preserves user-generated insights without disrupting the comprehension loop. The protocol does not track ejected proposals in its own state.
8. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via gate interaction. The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
9. **Convergence evidence**: Present transformation trace before declaring all tasks completed; per-task evidence is required
10. **Zero-gap surfacing**: If Phase 3 analysis finds no comprehension gaps for a category, present this finding with reasoning for user confirmation before marking as self-evident
11. **Gate integrity**: The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation
12. **Conditional briefing (R1-R2)**: Phase 1 Background briefing fires iff `Nₐ = true` (session-internal narrative available). External artifacts (cloned code without session work, uploaded PDFs, official docs) skip briefing — producing Background without narrative source is fabrication and violates R3. Framing and Emergent segmentation are excluded; Background-only.
13. **Provisional language (R3)**: Briefing phrasing surfaces AI's framing as risked-and-revisable hypothesis — avoid declarative authority. This is the Hermeneutic Vorurteil guard.
14. **Triggered re-entry (R4)**: Mid-protocol re-entry fires on observable misalignment signals S1-S4 (step 3c-monitor). Single-pass per probe cycle. Conservative default: ≤ 1 trigger per 5 invocations. Never silent — always surfaces via Qc_R4 gate.
15. **Reframe preserves debt (R5, R8)**: Reframe is a verification path reset, not exemption. Pending probes persist on task metadata; re-entry after reframed protocol returns presents the unresolved probe context. Reframe is available via (a) Phase 1 free-response, (b) Phase 3 free-response, (c) R4 trigger gate option — three channels.
16. **Mechanical same-artifact fade (R6)**: Background segment fade on re-invocation requires mechanical signals only — same /grasp session id + same input-artifact identifier + explicit user re-invoke. AI inference of "this seems related to prior artifact" is prohibited. Cross-artifact, no fade.
17. **Observable detector rules (R7)**: R4 misalignment signals operate via observable rules with explicit false-positive rate budgets per signal (S1 ≤ 30%, S2 ≤ 40%, S3 ≤ 25%, S4 ≤ 50%). Not "intuitive detection." Tuning logged, never silent.
18. **Complexity hidden internally (R10)**: User-facing surface must not grow beyond the design budget (+200 tokens per invocation net). Internal mechanisms (R4 signal terminology, FP budgets, debt metadata structure, BoundaryMap) do not leak into user-visible text. Detection: briefing > 7±2 propositions OR R4 gate prose containing "S3 signal" / "FP budget" = boundary leak requiring revision.
19. **Abstraction Accessibility (R11, BD-7)**: Every /grasp output surface carries inline plain-language gloss for terms not established in session context. AI-autonomous with cited basis; user can opt out via free-response gloss-suppression request. Budget: glosses ≤ 30% of surface text length per block.
20. **Three-block Phase 1 structure**: Phase 1 renders in order (1) conditional Background relay → (2) helper prose naming free-response channels → (3) clean categorical gate. Helper content (Reframe mechanics, intensity examples, ESC note) belongs BEFORE the gate, not inside gate option descriptions. The gate boundary respects Context-Question Separation and is tool-agnostic — any realization preserving gate semantics satisfies the structural contract.
21. **Structural gate-option criterion**: An item belongs in a gate's structured option list only when (i) it is a categorical selection that cannot be cleanly expressed via free-response, AND (ii) its distinction from other options produces differential downstream behavior that depends on categorical selection for unambiguous parsing. Reframe/intensity at Phase 1 fail criterion (i) — they arrive via free-response. R4 gate {continue, intensity, Reframe} pass — three structurally distinct actions needing categorical pick.
22. **Priority annotation ≠ pre-selection (BD-1a)**: AI annotates each Phase 1 category option with an AI-priority hint and cited basis; user retains full multi-select authority. Annotation informs recognition; it does not substitute for user judgment. Invariant 1 + Invariant 6 binding.
23. **Causality-first when WHY is absent (BD-1b)**: Phase 3 aspect-select relay orders probes so that Causality comes first when the entry category lacks established WHY in session context. Free-response override at any probe response.
