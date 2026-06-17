---
name: contextualize
description: "Detect application-context mismatch after execution. Verifies applicability when correct output may not fit the actual context, registering each mismatch through a fail-closed deficit-fit certificate before adaptation, producing contextualized execution. The transformative revalidation loop is non-monotone — adapting the result mutates the evaluation target and can breed emergent mismatches; re-scan is mandatory. Directional dual to Diylisis. Type: (ApplicationDecontextualized, AI, CONTEXTUALIZE, Result) → ContextualizedExecution. Alias: Epharmoge(ἐφαρμογή)."
---

# Epharmoge Protocol

Detect application-context mismatch after execution through AI-guided applicability verification, where correct results that may not fit the actual context are surfaced for user judgment. Type: `(ApplicationDecontextualized, AI, CONTEXTUALIZE, Result) → ContextualizedExecution`.

## Definition

**Epharmoge** (ἐφαρμογή): A dialogical act of verifying that results fit the actual application context — from Aristotle's notion of practical application — resolving the gap between technical correctness and contextual appropriateness through structured mismatch surfacing and user-directed adaptation.

```
── FLOW ──
Epharmoge(R, X) → Eval(R, X) → Mᵢ? →
  Mᵢ = ∅: → deactivate (no aspect ¬warranted; execution stands as-is)
  Mᵢ ≠ ∅: ∀m ∈ Mᵢ: bind_kind(m) → certify(m, graph.json) → keep(status = pass) → Mᵢ_passed →
    Mᵢ_passed = ∅ ∧ no deferred-pending ∧ (∀ m ∈ Mᵢ : routed(aspect(m))) (every flagged aspect resolved to ROUTED via the typed routed(a) predicate — deferred mismatches first re-certify to pass→registered or route→Λ.routed): → emit routing recommendations (every flagged aspect routed to a sibling deficit) → deactivate (trivial convergence: adjudicated by routing, R unadapted)
    Mᵢ_passed ≠ ∅: AssessFit(R, X, Mᵢ_passed) → F → Register(Mᵢ_passed) → SelectNext(pending, F, Σ) → Mₛ → Q(F-scoped Mₛ) → A → R' → Eval(R', X) → Mₑ? → ∀m ∈ Mₑ: bind_kind(m) → certify(m, graph.json) → keep(status = pass) → Mₑ_passed → Register(Mₑ_passed) → AssessFit(R', X, pending) → F' → (loop: SelectNext → Q → A → adapt → re-scan until contextualized)

── MORPHISM ──
(R, X)
  → evaluate(result, context)          -- detect applicability mismatch
  → bind_kind(mismatch) → certify(mismatch, registry) -- shared meta-backbone: bind each mismatch as a kind, certify deficit fit (fail-closed) at REGISTRATION, BEFORE it enters the pending/adaptation flow
  → assess_fit(result, context, mismatches) -- sort applicability fit before user judgment
  → surface(fit_scoped_mismatch, as_inquiry) -- present mismatch with fit basis and evidence
  → adapt(result, direction)           -- adapt result to context (transformative revalidation: mutates Eval target → may breed Mₑ)
  → ContextualizedExecution
requires: mismatch_detected(R, X)       -- runtime checkpoint (Phase 0)
deficit:  ApplicationDecontextualized    -- activation precondition (Layer 1/2); certificate.owner for in-scope mismatches
preserves: X                             -- application context is fixed reference; morphism transforms R only
invariant: Applicability over Correctness
invariant: certificate-before-registration  -- DeficitFitCertificate.status = pass strictly precedes registering a mismatch into pending(Σ) (shared meta-backbone order, at registration of both Mᵢ and Mₑ)
dual-axis:  transformative revalidation (NON-MONOTONE) -- adapting R' mutates the Eval(R, X) target, breeding emergent mismatches Mₑ; re-scan mandatory; progress(Λ) may regress. Opposite of distill's read-only-of-source monotone side (the contextualize ↔ distill boundary)

── TYPES ──
R      = Result to be evaluated (source-agnostic: AI output, analysis conclusion, decision outcome, or any completed work product)
           -- Input type: morphism processes R uniformly; enumeration scopes the definition, not behavioral dispatch
X      = Application context (environment, constraints, user situation)
Eval   = Applicability evaluation: (R, X) → Set(Mismatch)
Mismatch = { aspect: String, dimension: Dimension, description: String, evidence: String, severity: Severity, origin: Origin, kind_binding: KindBinding, certificate: DeficitFitCertificate }
                 -- object_ref: the per-mismatch anchor the certificate evaluates and the value-space binds over (epharmoge-local instantiation of the shared backbone's object_ref)
Dimension ∈ {Convention, Environment, Audience, Dependency} ∪ Emergent(Dimension)
Origin ∈ {Initial, Emerged(aspect)}                            -- mismatch provenance: initial scan or spawned by adapting parent aspect
Severity ∈ {Critical, Significant, Minor}                      -- Significant requires demonstrable behavioral impact (current-session task graph / downstream protocol activations); see Rule 12

-- Shared meta-backbone (KIND dispatch, registration-time / cycle-emergent). One canonical schema; epharmoge-local instantiation ONLY for object_ref (= Mismatch), local_value_space (= the answer coproduct {Confirm, Adapt, Dismiss}), and guard routing targets.
KindBinding    = { label: Axis, positive_predicate: String, evidence: Set(Evidence), origin ∈ {seed, emergent}, atomicity ∈ {atomic, non-atomic} }
                 -- captures the mismatch as a kind; if atomicity = non-atomic (the mismatch bundles two distinct aspects) → split BEFORE certify (no registration, no surfacing on a compound mismatch)
DeficitFitCertificate = { owner: Deficit, in_scope_if: String, route_if: List<RoutePair>, evidence: Set(Evidence), status ∈ {pass, route, ambiguous} }
                 -- fail-closed: status ≠ pass BLOCKS registration into pending(Σ) AND surfacing this mismatch for answer. Generated at registration time (Phase 0 for Mᵢ, Phase 2 re-scan for Mₑ) by checking KindBinding.positive_predicate against the sibling-deficit registry (.claude/skills/verify/graph.json deficit/edge graph).
                 -- owner = ApplicationDecontextualized when the mismatch is in-scope; status = pass iff the mismatch's positive_predicate fits ApplicationDecontextualized and no sibling deficit claims it
                 -- status = route: a sibling deficit owns the mismatch (backward misfit) → emit RoutePair target, drop the mismatch from registration (it never enters pending(Σ))
                 -- status = ambiguous: overlapping deficit fit → defer the mismatch (re-assess with narrowed scope or ask a one-turn narrow disambiguation); never register/surface under ambiguous fit
RoutePair      = (route_if_predicate: String, target: Protocol)
                 -- epharmoge-local guard routing targets — BACKWARD misfit the loop routes away rather than adapting in-place:
                 --   an unnoticed decision gap rather than a context-fit question        → /gap        (GapUnnoticed)
                 --   a missing pre-execution fact (no observable value, requires supply)  → /inquire    (ContextInsufficient)
                 --   undefined convention/dependency ownership for the decision           → /bound      (BoundaryUndefined)
                 --   portability to an absent zero-memory recipient (not present fit)      → /distill    (ContextTethered) -- the contextualize ↔ distill boundary guard
Evidence       = { source: ContextChannel, content: String }
ContextChannel ∈ {Result, Context, Convention, Environment, Session}  -- observable sources for the certificate's deficit-fit basis (R itself + observable X)
V              = bind_value_space : Mismatch → ValueSpace       -- the mismatch's answer constructors; generated ONLY after certificate.status = pass; frozen for the cycle (relay / dead-signal test applied)
ValueSpace     = the mismatch's answer coproduct (local_value_space; epharmoge-local instantiation point) = {Confirm, Adapt, Dismiss}
Deficit        = the sibling-deficit label a mismatch may belong to (registry node in graph.json); owner = ApplicationDecontextualized for in-scope mismatches
Protocol       = downstream protocol slash target a routed mismatch is handed to (e.g., /gap, /inquire, /bound, /distill)
Axis           = String                                        -- emergent kind label; examples: "convention", "environment", "audience", "dependency"
Mᵢ_passed = { m ∈ Mᵢ : certificate(m).status = pass }          -- initial mismatches that passed the fail-closed certificate at registration
Mₑ_passed = { m ∈ Mₑ : certificate(m).status = pass }          -- emerged mismatches that passed the fail-closed certificate at re-scan registration
AssessFit = Applicability fit assessment: R × X × Set(Mismatch) → F
           -- classifier over input_mismatches; does not generate new Mismatch objects
F      = ApplicabilityFitMap { fit_justifications, conflicts, depends, adaptation_options, open }
fit_justifications = Set(AspectFit) where aspect(R) is warranted in X
AspectFit = { aspect: String, evidence: String }
conflicts = Set(Mismatch) where evidence shows result behavior or meaning conflicts with X
           -- invariant: conflicts ⊆ input_mismatches
depends = Set(ContextCondition) where fitness hinges on an observable but unverified condition that could change adaptation or dismissal
ContextCondition = { target: Mismatch, condition: String, evidence: String, consequence: String }
                 -- invariant: target ∈ input_mismatches
adaptation_options = Set(AdaptationOption) where each option is tied to a conflict or dependency
AdaptationOption = { target: Mismatch ∪ ContextCondition, direction: String, effect: String }
open   = Set(ApplicabilityQuestion) where the answer could materially change the next adaptation judgment
ApplicabilityQuestion = { target: Mismatch, condition: String, reason: String, evidence_needed: String }
                       -- invariant: target ∈ input_mismatches
fit_category(m, F) =
  Conflict if m ∈ F.conflicts
  Dependent if ∃d ∈ F.depends : d.target = m
  Open if ∃q ∈ F.open : q.target = m
  Supported otherwise
FitRank = Conflict > Dependent > Open > Supported
SelectNext = Set(Mismatch) × F × Σ → Mₛ
           -- priority: severity(Critical > Significant > Minor), then FitRank, then oldest registered task
Mₛ     = Selected mismatch
Mᵢ     = Identified mismatches from Eval(R, X)                 -- origin = Initial; each bind_kind'd + certified at registration (Phase 0)
Mₑ     = Newly emerged mismatches from Eval(R', X)             -- origin = Emerged(adapted_aspect); each bind_kind'd + certified at re-scan registration (Phase 2)
Register = Set(Mismatch)_passed → Set(Task) [Tool: TaskCreate] -- registration of ONLY certificate-passing mismatches as tracked tasks; status ≠ pass blocks registration (fail-closed)
pending(Σ) = Set(Mismatch) where registered task status ∉ {completed, dismissed}  -- a routed/ambiguous mismatch never enters pending(Σ); only certificate-passing mismatches are registered
Q      = Applicability inquiry over F-scoped mismatch (gate interaction)
A      = User answer ∈ {Confirm(mismatch), Adapt(direction), Dismiss}  -- A ∈ V; answer drawn from the mismatch's value-space (local_value_space = {Confirm, Adapt, Dismiss})
R'     = Adapted result (contextualized output)
ContextualizedExecution = R' where (∀ task ∈ registered: task.status = completed) ∨ user_esc
                 -- registered = certificate-passing mismatches only; routed/ambiguous mismatches are handed forward, not adapted in-place

── PHASE TRANSITIONS ──
Phase 0: R → Eval(R, X) → Mᵢ? → ∀m ∈ Mᵢ: bind_kind(m) → certify(m, graph.json) → (status = pass) → Mᵢ_passed → AssessFit(R, X, Mᵢ_passed) → F → Λ.fit_map := F  -- applicability checkpoint + registration-time KIND dispatch (fail-closed) + fit map (silent); certify runs WITHIN Phase 0, at registration, not as a separate phase
Phase 0 → route_away (mismatch-local): certify(m).status = route        -- a sibling deficit owns the mismatch (backward misfit) → emit RoutePair.target (/gap, /inquire, /bound, /distill), drop m from registration (m never enters pending(Σ)); scan continues with remaining mismatches
Phase 0 → defer (mismatch-local): certify(m).status = ambiguous ∨ KindBinding.atomicity = non-atomic  -- overlapping deficit fit OR compound mismatch → split / narrow disambiguation, re-certify BEFORE registration (never register under ambiguity)
Phase 0 → deactivate (all-routed): Mᵢ ≠ ∅ ∧ Mᵢ_passed = ∅ ∧ (∀ m ∈ Mᵢ : routed(aspect(m))) ∧ no deferred-pending ∧ pending(Σ) = ∅  -- mismatches WERE detected but EVERY one resolved to ROUTED (routed(a) is the typed predicate of CONVERGENCE — a is in Λ.routed via aspect(m) = a, NOT raw Mismatch-in-list membership) (handed to a sibling deficit) — no in-scope (ApplicationDecontextualized-owned) mismatch enters the adaptation loop → trivial convergence: emit the routing recommendations (/gap, /inquire, /bound, /distill) and deactivate without adapting R (R stands as-is for the in-scope check; contextualized(R) holds vacuously — adjudicated(R, X) with every aspect routed). DEFERRED mismatches (status = ambiguous ∨ atomicity = non-atomic) are NOT terminal and do NOT satisfy this path: they first re-certify via Phase 0 → defer (split / narrow-disambiguation) until each resolves to pass (→ registered into pending(Σ)) or route (→ Λ.routed); trivial convergence fires only once NONE remain deferred-pending and every flagged aspect is routed. Distinct from the zero-mismatch-detected case (Mᵢ = ∅, no aspect ¬warranted): here aspects WERE flagged but all belong to sibling deficits. The per-mismatch-certificate analogue of elicit's all-projections-routed exit
Phase 1: Mᵢ_passed → TaskCreate[all certificate-passing initial mismatches] → pending(Σ) → SelectNext(pending, F, Σ) → Mₛ → Qc(F-scoped Mₛ, evidence) → Stop → A  -- register all certificate-passing initial mismatches, surface selected mismatch with fit basis [Tool]; reached only when Mᵢ_passed ≠ ∅
Phase 2: A → adapt(A, R) → R' → TaskUpdate → Eval(R', X) → Mₑ? → ∀m ∈ Mₑ: bind_kind(m) → certify(m, graph.json) → (status = pass) → Mₑ_passed → TaskCreate[all Mₑ_passed] → pending(Σ) → AssessFit(R', X, pending) → F' → Λ.fit_map := F' -- adaptation (transformative revalidation, mutates Eval target) + update + re-scan + registration-time certify of emerged mismatches + recompute fit map [Tool]
Phase 2 → route_away (mismatch-local): certify(m).status = route        -- an emerged mismatch a sibling deficit owns → emit RoutePair.target, drop m from registration; re-scan continues
Phase 2 → defer (mismatch-local): certify(m).status = ambiguous ∨ KindBinding.atomicity = non-atomic  -- emerged compound/overlapping mismatch → split / re-certify BEFORE registration

── LOOP ──
Transformative revalidation (NON-MONOTONE): this loop mutates the very object its detector evaluates. adapt produces R', and Eval(R', X) re-targets the detector at the mutated result — so an adaptation can BREED new mismatches Mₑ that did not exist before. This is the opposite of distill's read-only-of-source monotone side (the contextualize ↔ distill boundary). "Transformative revalidation" labels the ADAPT path; non-mutating adjudication (Dismiss, or routing a mismatch to a sibling deficit) is contextualize-internal — it does not mutate R — and is distinct from distill's read-only-of-source territory.
After Phase 2: re-scan R' against X for remaining AND newly emerged mismatches.
Bind + certify each newly emerged mismatch at registration (fail-closed): only certificate-passing emerged mismatches (Mₑ_passed) are registered into pending(Σ); a routed mismatch is handed to its sibling deficit (/gap, /inquire, /bound, /distill), an ambiguous/compound one is split and re-certified before registration. AssessFit classifies tracked mismatches but never suppresses them.
Recompute F over pending(Σ) before selecting the next surfaced mismatch, even when Mₑ_passed = ∅.
If pending(Σ) non-empty: return to Phase 1 (SelectNext by severity, then FitRank, then oldest registered task).
If adjudicated(R', X): all tasks completed → convergence.
progress(Λ) MAY REGRESS: because re-scan over a mutated R' can register newly certified mismatches, the completed/total ratio is non-monotone — this is the signature of the transformative-revalidation side, not an error.
User can exit at Phase 1 (early_exit option or Esc).
Continue until: contextualized(R') OR user ESC.
Mode remains active until convergence.
Convergence evidence: At adjudicated(R', X), present transformation trace — for each (m, _) ∈ Λ.state.history, show (ApplicationDecontextualized(m) → adaptation_result(m)); routed mismatches show (ApplicationDecontextualized(m) → routed_to(RoutePair.target)). Convergence is demonstrated, not asserted.

── CONVERGENCE ──
applicable(R', X) = ∀ aspect(a, R', X) : warranted(a, R', X)
warranted(a, R, X) = correct(R) ∧ fits(R, X)                -- correctness AND contextual fit required (not material conditional)
adjudicated(R', X) = ∀ aspect(a, R', X) : warranted(a, R', X) ∨ dismissed(a) ∨ routed(a)
routed(a)          = ∃ m ∈ Λ.routed : aspect(m) = a    -- the mismatch on aspect a failed the certificate (status = route) and was handed to a sibling deficit; backward misfit is adjudicated by routing, not by in-place adaptation
contextualized(R') = adjudicated(R', X) ∨ user_esc
trivial convergence (all-routed): when Mᵢ ≠ ∅ but Mᵢ_passed = ∅ AND every flagged aspect resolved to ROUTED (∀ m ∈ Mᵢ : routed(aspect(m)), no deferred-pending, pending(Σ) = ∅), adjudicated(R, X) holds by the routed(a) disjunct for every flagged aspect (and warranted for the rest) — R is unadapted and contextualized(R) holds. This is the Phase 0 → deactivate (all-routed) path. DEFERRED mismatches do NOT satisfy this: they are not in Λ.routed, so the routed(a) disjunct does not cover them; a deferred mismatch first re-certifies (Phase 0 → defer) to pass (→ pending(Σ)) or route (→ Λ.routed) before any convergence claim. Distinct from the no-mismatch case (Mᵢ = ∅, every aspect warranted from the start) — here aspects were flagged but all belong to sibling deficits
certificate gate:  every registered mismatch carried certificate.status = pass (fail-closed, at registration) — routed/ambiguous mismatches never entered pending(Σ), so a contextualized R' is assembled only from in-scope (ApplicationDecontextualized-owned), fit-certified adaptations; backward misfit was handed forward (/gap, /inquire, /bound, /distill), not adapted in-place
-- stratification: applicable(R', X) ⊆ adjudicated(R', X)
-- operational proxy: ∀ task completed ⟹ adjudicated(R', X) ⟹ contextualized(R')
progress(Λ) = |completed_tasks| / |total_tasks|              -- NON-MONOTONE: may regress when re-scan over the mutated R' registers newly certified mismatches (transformative-revalidation signature)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Eval   (sense)   → Internal analysis (no external tool)
bind_kind (sense)   → Internal analysis (capture each detected mismatch as a KindBinding {label, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity}; non-atomic mismatch → split before certify)
certify (extension) → Internal analysis (fail-closed DeficitFitCertificate; deterministic check of KindBinding.positive_predicate against the sibling-deficit registry .claude/skills/verify/graph.json: owner = ApplicationDecontextualized when in-scope; status = pass | route | ambiguous; basis = the registry deficit/edge fit, cited at the mismatch's Phase 1 surfacing. Runs at registration time — within Phase 0 for Mᵢ, within Phase 2 re-scan for Mₑ — BEFORE the mismatch enters pending(Σ))
AssessFit (sense) → Internal analysis (no external tool)
Qc     (constitution)    → present (mandatory; Esc key → loop termination at LOOP level, not an Answer)
adapt  (transform) → Edit, Write (result adaptation based on user direction)
                    -- (transform): tool call that changes existing artifacts; medium-agnostic (files, analysis text, generated content)
route  (extension)   → TextPresent+Proceed (certificate.status = route → emit the matching RoutePair.target as a backward-misfit recommendation: decision gap → /gap, missing pre-execution fact → /inquire, undefined convention/dependency ownership → /bound, portability to an absent recipient → /distill; deterministic registry match, basis cited)
Mᵢ/Mₑ (track)   → TaskCreate/TaskUpdate (mismatch tracking with framing visibility; only certificate-passing mismatches are registered)
converge (extension)  → TextPresent+Proceed (convergence evidence trace; proceed with contextualized execution)

── MODE STATE ──
Λ = { phase: Phase, R: Result, X: Context,
      fit_map: F, state: Σ, active: Bool, cause_tag: String,
      routed: List<(Mismatch, RoutePair.target)> }   -- backward-misfit mismatches handed forward (never entered pending(Σ))
Σ = { history: List<(Mismatch, A)>, scan_count: Nat }
                 -- each Mismatch in history carries its kind_binding + certificate (object_ref = Mismatch)
-- Certificate invariant: ∀ m ∈ pending(Σ) : m.certificate.status = pass (fail-closed — routed/ambiguous mismatches never enter pending(Σ))

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Applicability over Correctness**: When AI detects that a technically correct result may not fit the actual application context, it surfaces the mismatch with evidence rather than assuming the result is adequate. Correctness is necessary but not sufficient — contextual fit determines whether the result serves its purpose.

Formal predicate: `correct(R) ∧ ¬warranted(R, X)` — the output is correct but not warranted in this context (Dewey's warranted assertibility; Ryle's knowing-how vs knowing-that).

## Mode Activation

### Conditional Activation Prerequisite

> **This protocol is conditional.** AI-guided activation (Layer 2) requires operational experience with Aitesis (④) to validate the pre/post context fitness axis. Until this prerequisite is satisfied, Epharmoge exists as a formal specification only and must not auto-activate via Layer 2.
>
> Activation criteria: Observed pattern of "context gathered but application mismatched" in Aitesis inference operational data.
>
> User-invocable activation (Layer 1 / `/contextualize`) is always available regardless of this prerequisite.

### Activation

AI detects applicability mismatch after execution OR user calls `/contextualize`. Detection is silent (Phase 0); surfacing always requires user interaction via Cognitive Partnership Move (Constitution) (Phase 1).

**Application decontextualized** = the result is technically correct but may not fit the actual application context.

Gate predicate:
```
decontextualized(R, X) ≡ correct(R) ∧ ∃ aspect(a, R, X) : ¬warranted(a, R, X)
```

**Activation layers**:
- **Layer 1 (User-invocable)**: `/contextualize` slash command or description-matching input. Available regardless of conditional gate.
- **Layer 2 (AI-guided)**: Post-execution heuristic detection within SKILL.md. Subject to conditional gate.

### Priority

<system-reminder>
When Epharmoge is active:

**Supersedes**: Default post-execution patterns (move to next task without applicability check)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 1, present mismatch evidence via Cognitive Partnership Move (Constitution).
</system-reminder>

- Epharmoge completes before proceeding to next task
- Loaded instructions resume after applicability is verified or dismissed

### Trigger Signals

Heuristic signals for applicability mismatch detection (not hard gates):

| Signal | Detection |
|--------|-----------|
| Environment assumption | Result assumes environment state not verified in current context |
| Convention mismatch | Result follows general best practices but project has local conventions |
| Scope overflow | Result addresses more or less than the observed use case requires |
| Temporal context | Result applies to a version, state, or phase that may have shifted |

**Cross-session enrichment**: Repeated mismatch patterns accumulated in Anamnesis's hypomnesis store (session recall indices written by the SessionEnd/PreCompact hook) may adjust Phase 0 scan priority — known mismatch types are checked first. In parallel, when **`/recollect`** has been invoked this session, the recalled context surfaces prior application-context mismatch patterns observed in comparable deliverables, strengthening current mismatch detection by situating Phase 0 scans against the user's recurring convention and environment drifts. This is a heuristic input that may bias detection toward previously observed patterns; constitutive judgment remains with the user.

**Revision threshold**: When accumulated Emergent dimension detections across 3+ sessions cluster around a recognizable pattern outside the named dimensions {Convention, Environment, Audience, Dependency}, the Mismatch Dimension Taxonomy warrants promotion to a new named dimension. When accumulated classification false negatives across 3+ sessions cluster around a specific dimension, that dimension's detection boundary warrants revision or demotion to Emergent.

**Skip**:
- User provided explicit, detailed specification and result follows it exactly
- User explicitly says "looks good" or "proceed" after execution
- Trivial or mechanical execution (formatting, typo fixes, rename)
- Read-only / exploratory task — no result to evaluate
- Same (aspect, description) pair was dismissed in current session (session immunity)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| All mismatch tasks completed (adapted or dismissed) | Proceed with contextualized result |
| No mismatches detected (Phase 0 passes) | Execution stands as-is |
| Mismatches detected but all routed (Mᵢ ≠ ∅ ∧ Mᵢ_passed = ∅ ∧ ∀ m ∈ Mᵢ : routed(aspect(m)) ∧ no deferred-pending ∧ pending(Σ) = ∅) | Trivial convergence — every flagged aspect belongs to a sibling deficit; emit the routing recommendations (/gap, /inquire, /bound, /distill) and deactivate without adapting R (adjudicated by routing, not in-place adaptation). DEFERRED mismatches (ambiguous / non-atomic) are NOT terminal — they re-certify (split / narrow-disambiguation) to pass or route before any convergence; only a fully-routed set fires this path. Distinct from the no-mismatch-detected row above: aspects WERE flagged but none is in-scope for adaptation |
| User Esc key | Accept result without applicability review |

## Mismatch Identification

Mismatches are identified across named dimensions — working hypotheses for systematic detection, not exhaustive categories.

### Mismatch Dimension Taxonomy

| Dimension | Detection | Question Form |
|-----------|-----------|---------------|
| **Convention** | Result follows general patterns but project has local conventions | "This follows best practices, but your project uses [local pattern]" |
| **Environment** | Result assumes environment state that differs from actual operating context | "This assumes [env state], but your context has [actual state]" |
| **Audience** | Result targets a different audience than the actual consumers | "This is written for [assumed audience], but [actual audience] will use it" |
| **Dependency** | Result interacts with components whose constraints weren't considered | "This depends on [component] which has [constraint not considered]" |

**Emergent mismatch detection**: Named dimensions are working hypotheses, not exhaustive categories. Detect Emergent mismatches when:
- The applicability gap spans multiple named dimensions
- User dismisses all named-dimension mismatches but the result still exhibits contextual misfit
- The execution context involves domain-specific fitness criteria that resist classification into the four named dimensions

Emergent mismatches must satisfy morphism `ApplicationDecontextualized → ContextualizedExecution`; the fail-closed deficit-fit certificate (Phase 0 / Phase 2 re-scan) enforces this at registration. Backward-misfit boundary (routed away, not adapted in-place): an unnoticed decision gap rather than a context-fit question → `/gap`; a missing pre-execution fact → `/inquire`; undefined convention/dependency ownership → `/bound`; portability to an absent zero-memory recipient (not fit to a present, observable context) → `/distill` (the contextualize ↔ distill boundary).

Each mismatch is characterized by:

- **aspect**: The dimension where result and context diverge
- **description**: What specifically doesn't fit
- **evidence**: Observable indicator from the result or context
- **severity**: Impact on applicability

### Severity

| Level | Criterion | Action |
|-------|-----------|--------|
| **Critical** | Result actively harmful in current context | Must resolve before using result |
| **Significant** | Result suboptimal or partially inappropriate AND mismatch carries demonstrable behavioral impact (downstream-decision impact, runtime divergence, gate-trajectory change) | Surface to user for judgment |
| **Minor** | Result adequate but could fit better, OR mismatch lacks demonstrable behavioral impact (covers both structural-only and suboptimal-without-impact cases) | Surface with pre-selected Dismiss option |

Behavioral-impact qualifier (Significant criterion): structural-change extent alone — line count, file count, scope size — is insufficient grounds for Significant; the mismatch must produce a demonstrable downstream behavioral consequence. **Assessment scope**: demonstrability is evaluated against the visible task graph and downstream protocol activations within the current session — not speculative future sessions, hypothetical user trajectories, or out-of-session consequences. When the visible session offers no anchor for the predicted consequence, the mismatch defaults to Minor (¬behavioral_impact disjunct). See Rule 12.

When multiple mismatches are identified, surface in severity order (Critical → Significant → Minor). Only one mismatch surfaced per Phase 1 cycle.

## Protocol

### Phase 0: Applicability Checkpoint (Silent)

Evaluate result against application context. This phase is **silent** — no user interaction.

1. **Scan result** `R` against context `X`: environment state, conventions, use case scope, temporal validity, user constraints
2. **Check applicability**: For each aspect, assess whether `correct(R) ∧ fits(R, X)` (i.e., `warranted(R, X)`)
3. **Bind + certify each detected mismatch at registration (fail-closed)**: For each candidate mismatch, set `m.kind_binding = { label, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity }`; if `atomicity = non-atomic` (the mismatch bundles two distinct aspects), **split before certify**. Then `m.certificate = certify(m.kind_binding, registry)` where the registry is the sibling-deficit graph `.claude/skills/verify/graph.json`:
   - **`status = pass`** — the mismatch's positive predicate fits `ApplicationDecontextualized` (certificate `owner = ApplicationDecontextualized`) and no sibling deficit claims it. The mismatch is eligible for registration.
   - **`status = route`** — a sibling deficit owns the mismatch (backward misfit, not a context-fit question). Emit the matching `RoutePair.target` as a recommendation and **drop the mismatch from registration** (record it in `Λ.routed`); the scan continues with the remaining mismatches. Route targets: an unnoticed decision gap → `/gap` (GapUnnoticed); a missing pre-execution fact → `/inquire` (ContextInsufficient); undefined convention/dependency ownership → `/bound` (BoundaryUndefined); portability to an absent zero-memory recipient → `/distill` (ContextTethered, the contextualize ↔ distill boundary).
   - **`status = ambiguous`** or `atomicity = non-atomic` — overlapping deficit fit OR compound mismatch → split or ask a one-turn narrow disambiguation, then re-certify **before** registration (never register under ambiguity).
4. **Assess fit**: Build `ApplicabilityFitMap` over the certificate-passing mismatches (`Mᵢ_passed`) from warranted aspect evidence, conflicts, dependencies, adaptation options, and bounded open questions
5. If all aspects warranted: present finding per Rule 9 before concluding (Epharmoge not activated)
6. If certificate-passing mismatches remain: record `Mᵢ_passed` with aspect, description, evidence, severity (per Rule 12 — behavioral-impact qualifier assessed against current-session task graph), `origin=Initial`, kind_binding, certificate, and fit-map placement — proceed to Phase 1

**Information source**: The result `R` itself compared against observable context `X`. NOT a re-scan of pre-execution context (non-circularity with Aitesis).

**Registration-time certificate (not an up-front gate)**: The certificate fires per mismatch at registration — within Phase 0 for initial mismatches `Mᵢ`, within the Phase 2 re-scan for emerged mismatches `Mₑ` — analogous to elicit's per-projection certificate, NOT bound's dispatch-first up-front sync. Mismatch detection stays AI-side; there is no up-front kind gate. The certify step is relay (Extension — a deterministic registry check; basis cited at the mismatch's Phase 1 surfacing).

**Backbone discipline**: the schema (KindBinding / DeficitFitCertificate / value-space binding) is ONE canonical definition shared across protocols; epharmoge instantiates only `object_ref` (= Mismatch), `local_value_space` (= the `{Confirm, Adapt, Dismiss}` coproduct), and the guard routing targets (the RoutePairs above). Same field names, same fail-closed statuses, same certificate-before-registration order.

**Scan scope**: Completed result, observable context (structure, conventions, constraints), session context. Does NOT re-execute or modify files.

**Fit-map scope**: The map is pre-gate support for mismatch selection and adaptation direction. It classifies already detected mismatches; it does not create or suppress mismatch tasks. It may surface bounded open conditions only when the answer could change whether the result should be adapted or accepted as-is.

### Phase 1: Mismatch Surfacing

**Register all identified mismatches as Tasks** (TaskCreate), then **present** the next pending mismatch selected by `SelectNext` via Cognitive Partnership Move (Constitution).

**Task format**:
```
TaskCreate({
  subject: "[Mismatch:aspect] description",
  description: "Evidence and context for this mismatch (severity: X)",
  activeForm: "Surfacing [aspect] mismatch"
})
```

Constitution presentation yields turn for user response.

**Surfacing format** (natural integration with execution completion):

Present the mismatch findings as text output:
- Done. One thing to verify about applicability:
  - **Mismatch**: [Specific mismatch description]
  - **Evidence**: [what in the result and what in the context diverge]
  - **Fit basis**: [what already fits, what conflicts or depends, and any open condition tied to this mismatch that could change this adaptation decision]

Then **present**:

```
How would you like to handle this applicability mismatch?

Options:
1. **Confirm** — yes, this needs adaptation: [brief direction prompt]
2. **Dismiss** — acceptable as-is: [stated assumption about context fit]
```

If adaptation direction is evident, materialize Adapt(direction) as a concrete option:
```
3. **[Specific adaptation]** — [what would change and why]
```
This is a contextual materialization of `Adapt(direction)` — the formal answer type remains `Adapt`, with the direction pre-populated from AI analysis.

**Design principles**:
- **Evidence-grounded**: Every surfaced mismatch must cite specific observable evidence from both `R` and `X`
- **Post-execution natural**: Integrates with task completion flow ("Done. One thing to verify:")
- **Current mismatch framed**: Surface the mismatch currently in play as framing — which applicability aspect is being judged this cycle — rather than a completion count across all mismatches
- **Actionable options**: Each option leads to a concrete next step
- **Dismiss with assumption**: Always state what fitness assumption is accepted if dismissed

### Phase 2: Result Adaptation

After user response:

1. **Confirm(mismatch)**: Mark mismatch as confirmed, apply adaptation using Edit/Write tools → TaskUpdate (completed)
2. **Adapt(direction)**: Apply user-directed adaptation to result `R'` using Edit/Write tools → TaskUpdate (completed)
3. **Dismiss**: Mark mismatch as dismissed, note fitness assumption accepted → TaskUpdate (completed)

After adaptation — **re-scan**:
- Re-evaluate `R'` against `X` for remaining AND **newly emerged** mismatches
- **Bind + certify each emerged mismatch at registration (fail-closed)**: for each `m ∈ Mₑ`, set `m.kind_binding` and `m.certificate = certify(m.kind_binding, registry)` (same `.claude/skills/verify/graph.json` registry, same `pass | route | ambiguous` statuses as Phase 0). Register only certificate-passing emerged mismatches (`Mₑ_passed`) with `origin=Emerged(adapted_aspect)`; a `status = route` mismatch is recorded in `Λ.routed` and handed to its sibling deficit (`/gap`, `/inquire`, `/bound`, `/distill`), a `status = ambiguous`/non-atomic one is split and re-certified before registration. Do not filter the certificate-passing set by fit-map category.
- Recompute `ApplicabilityFitMap` over all pending mismatches before selecting the next mismatch, even when `Mₑ_passed = ∅`
- If remaining tasks non-empty: return to Phase 1 (surface next mismatch via `SelectNext`: severity, then FitRank, then oldest registered task)
- If all tasks completed: execution complete with contextualized result
- Log `(Mismatch, A)` to `Σ.history`, increment `Σ.scan_count`

**Re-scan trigger (transformative revalidation — NON-MONOTONE)**: Adaptation MUTATES `R` into `R'`, and `Eval(R', X)` re-targets the detector at the mutated result, so changed `R'` may exhibit new mismatches not present in the original result. This is the transformative-revalidation / mutates-its-own-detector-target side of the dual axis — the opposite of distill's read-only-of-source monotone side. Always re-scan after each adaptation — any adaptation may introduce mismatches in dimensions unrelated to the original aspect; `progress(Λ)` may therefore regress (expected, not an error). Non-mutating adjudication (Dismiss, or routing a mismatch to a sibling deficit) does not mutate `R` and is contextualize-internal.

**Chain discovery**: When `Mₑ` emerges from an adaptation, the `origin = Emerged(parent_aspect)` field records the causal chain. This enables:
- Chain visibility: user sees which adaptations spawned new mismatches (a framing signal — which adaptation opened which follow-on, not a progress count)
- Convergence monitoring: chains that grow beyond 3 levels suggest a structural issue worth surfacing explicitly

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Minor severity mismatches only | Constitution interaction with Dismiss as default option |
| Medium | Significant severity, evidence is clear | Structured Constitution interaction with evidence |
| Heavy | Critical severity, multiple interacting mismatches | Detailed evidence + adaptation options |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Epharmoge) only if correct(R) ∧ ∃ ¬warranted(a, R, X)` | Prevents false activation on well-fitting results |
| Mismatch cap | One mismatch per Phase 1 cycle, severity order | Prevents post-execution question overload |
| Session immunity | Dismissed (aspect, description) → skip for session | Respects user's dismissal |
| Current-mismatch framing | Phase 1 surfaces the mismatch currently in play (which applicability aspect is being judged this cycle) — a framing readout, not an `[N addressed / M]` completion count | User recognizes which aspect is being judged without parsing a progress tally; granular progress stays in session |
| Deterministic selection | `SelectNext` orders pending mismatches by severity, FitRank, then oldest registered task | Removes unordered Set indexing from user-facing surfacing |
| Fit-map cap | `depends`/`open` only when observable evidence could change adaptation or dismissal | Prevents broad contextual caveat lists |
| Early exit | User can dismiss all at any Phase 1 | Full control over review depth |
| Cross-protocol cooldown | `suppress(Epharmoge) if Aitesis.resolved_in_same_scope ∧ overlap(Aitesis.domains, Epharmoge.aspects)` | Prevents same-scope pre+post stacking |
| Cooldown scope | Cooldown applies within recommendation chains only; direct `/contextualize` invocation is never suppressed | User authority preserved |
| Natural integration | "Done. One thing to verify:" pattern | Fits completion flow, not interrogation |
| Fail-closed deficit-fit certificate | `certificate.status = pass` strictly precedes registration into `pending(Σ)` (at registration of both `Mᵢ` and `Mₑ`); route → drop + hand forward, ambiguous/non-atomic → split + re-certify | A mismatch a sibling deficit owns never enters the adaptation loop; backward misfit is routed (`/gap`, `/inquire`, `/bound`, `/distill`) rather than adapted in-place |
| Registration-time certificate (no up-front gate) | The certificate attaches per mismatch at registration time (Phase 0 for `Mᵢ`, Phase 2 re-scan for `Mₑ`), not once before the loop | Mismatch detection stays AI-side; analogous to elicit's per-projection certificate, not bound's dispatch-first up-front sync |

## Rules

1. **AI-guided, user-judged**: AI detects applicability mismatch; user judges whether adaptation is needed via Cognitive Partnership Move (Constitution) (Phase 1)
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity — Constitution interaction requires turn yield before proceeding
3. **Applicability over Correctness**: When result is correct but contextually mismatched, surface the mismatch — do not assume correctness implies fitness
4. **Evidence-grounded**: Every surfaced mismatch must cite specific observable evidence from both result `R` and context `X`, not speculation
5. **Convergence persistence**: Mode active until all mismatch tasks are completed (resolved or dismissed)
6. **Non-circularity**: Information source is the result itself compared against context, not pre-execution context scans (independence from Aitesis)
7. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
8. **Convergence evidence**: Present transformation trace before declaring adjudicated(R', X); per-mismatch evidence is required
9. **Zero-mismatch surfacing**: If Phase 0 scan detects no context mismatches, present this finding with reasoning for user confirmation
10. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options
11. **Gate integrity** (Safeguard tier): The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
12. **Significant requires demonstrable behavioral impact**: Severity = Significant requires that the mismatch produces a demonstrable behavioral consequence — downstream-decision impact, runtime divergence, gate-trajectory change. Structural-change extent (line count, file count, scope size) alone is insufficient grounds — categorize as Minor when behavioral impact is undemonstrated. This guards against false-positive gating arising from conflation of structural-change extent with applicability impact, where the Option-set relay test (Rule 10) would otherwise apply only ex post via user challenge
13. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
14. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
15. **Applicability fit map is support only**: Use `ApplicabilityFitMap` to scope which mismatch is surfaced and which adaptation direction is practical. It classifies already detected mismatches and must not create, suppress, or terminalize mismatch tasks.
16. **All certificate-passing mismatches remain tracked**: Initial and emerged mismatches that pass the fail-closed deficit-fit certificate are registered before fit-map prioritization. Fit categories affect selection order and fit-basis wording only; they never remove a registered mismatch from convergence accounting. (The certificate is the one legitimate pre-registration filter — Rule 17; a routed/ambiguous mismatch is handed forward or split, distinct from fit-map suppression, which Rule 15 prohibits.)
17. **Registration-time deficit-fit certificate, dual-axis transformative revalidation**: Before a detected mismatch enters `pending(Σ)`, it is dispatched through the shared meta-backbone pipeline — KindBinding → fail-closed DeficitFitCertificate → value-space, in that strict order, at registration of both `Mᵢ` (Phase 0) and `Mₑ` (Phase 2 re-scan). (a) **Registration-time, NOT dispatch-first**: the certificate attaches per mismatch at registration time — mismatch detection stays AI-side, there is no up-front kind gate. This is the cycle-emergent counterpart to elicit's per-projection certificate, distinct from bound's dispatch-first up-front sync (which exists only because BoundaryMap is a multi-consumer router). (b) **Fail-closed certificate**: `certificate.status = pass` strictly precedes registration and surfacing; `status = route` drops the mismatch and hands it to the sibling deficit's protocol — an unnoticed decision gap → `/gap`, a missing pre-execution fact → `/inquire`, undefined convention/dependency ownership → `/bound`, portability to an absent zero-memory recipient → `/distill`; `status = ambiguous` or `atomicity = non-atomic` splits / one-turn-disambiguates and re-certifies before registration. The certificate is generated by checking the mismatch's positive predicate against the sibling-deficit registry `.claude/skills/verify/graph.json`; the certify step is relay (Extension — deterministic registry check, basis cited at Phase 1 surfacing). (c) **Dual axis — transformative revalidation (NON-MONOTONE)**: contextualize sits on the transformative side of the dual axis. adapt MUTATES `R` into `R'`, `Eval(R', X)` re-targets the detector at the mutated result, and this can BREED emergent mismatches `Mₑ` that did not exist before — so re-scan is mandatory and `progress(Λ)` may regress. This is the opposite of distill's read-only-of-source monotone side (the contextualize ↔ distill boundary). "Transformative revalidation" labels the ADAPT path only; non-mutating adjudication (Dismiss, or routing a mismatch to a sibling deficit) is contextualize-internal and does not mutate `R`. (d) **Backbone discipline**: the schema is ONE canonical definition shared across protocols; epharmoge instantiates only `object_ref` (= Mismatch), `local_value_space` (= the `{Confirm, Adapt, Dismiss}` coproduct), and the guard routing targets — same field names, same fail-closed statuses, same certificate-before-registration order.
