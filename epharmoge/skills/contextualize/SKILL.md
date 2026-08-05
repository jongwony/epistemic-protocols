---
name: contextualize
description: "Detect application-context mismatch after execution. Verifies applicability when correct output may not fit the actual context, registering each mismatch through a fail-closed deficit-fit certificate before disposition, producing contextualized execution. Judgment (does the aspect stand?) and disposition (adapt, keep, or withdraw the result) are separate axes: a settled judgment may relay, the disposition is always user-answered. The transformative revalidation loop is non-monotone — an adapt disposition mutates the evaluation target and can breed emergent mismatches; re-scan is mandatory. Type: (ApplicationDecontextualized, AI, CONTEXTUALIZE, Result) → ContextualizedExecution. Alias: Epharmoge(ἐφαρμογή)."
---

# Epharmoge Protocol

Detect application-context mismatch after execution through AI-guided applicability verification, where correct results that may not fit the actual context are surfaced for user judgment. Type: `(ApplicationDecontextualized, AI, CONTEXTUALIZE, Result) → ContextualizedExecution`.

## Definition

**Epharmoge** (ἐφαρμογή): A dialogical act of verifying that results fit the actual application context — from Aristotle's notion of practical application — resolving the gap between technical correctness and contextual appropriateness through structured mismatch surfacing and user-directed adaptation.

```
── FLOW ──
Epharmoge(R, X) → Eval(R, X) → Mᵢ? →
  Mᵢ = ∅: Qz(zero_mismatch_finding) → Stop → [AcceptNoMismatch: R_final := Some(R), deactivate (no aspect ¬warranted; execution stands as-is) | Reopen(aspect): reopen_focus := aspect, re-scan Eval focused on it (one attempt: still-∅ → relay finding, deactivate)]
  Mᵢ ≠ ∅: ∀m ∈ Mᵢ: bind_kind(m) → certify(m, registry) → keep(status = pass) → Mᵢ_passed →
    Mᵢ_passed = ∅ ∧ no deferred-pending ∧ adjudicated(R, X) (every flagged aspect carries a certificate-assigned disposition — Route(target) or Residual — via the typed disposed(a) predicate; deferred mismatches first get their one bounded re-assessment to pass→registered, route→Route(target), or unattributable→Residual): → emit routing recommendations + surface any Residual (each flagged aspect either routed to a sibling deficit or unattributable) → deactivate (trivial convergence: adjudicated by disposition, R unadapted)
    Mᵢ_passed ≠ ∅: AssessFit(R, X, Mᵢ_passed) → F → Register(Mᵢ_passed) → SelectNext(pending, F, Σ) → Mₛ → judgment_settled(Mₛ, F)? → [settled: judgment_relay → j := Upheld, basis cited, Overruled/Keep dropped from the presented set] → Qc(F-scoped Mₛ, judgment_state) → Stop → A = (j, d) →
      [d = Adapt(direction)] adapt → R' → Eval(R', X) → Mₑ? → ∀m ∈ Mₑ: bind_kind(m) → certify(m, registry) → keep(status = pass) → Mₑ_passed → Register(Mₑ_passed) → AssessFit(R', X, pending) → F' → (loop: SelectNext → Qc → A → dispose → re-scan until contextualized)
      [d = Keep] R_final := Some(R), no re-scan, no Mₑ → (loop: SelectNext → Qc → A)
      [d = Discard(replacement)] R_final := replacement, every mismatch still pending → Moot, no re-scan → deactivate (withdrawal convergence: the Eval target no longer exists)

── MORPHISM ──
(R, X)
  → evaluate(result, context)          -- detect applicability mismatch
  → bind_kind(mismatch) → certify(mismatch, registry) -- shared meta-backbone: bind each mismatch as a kind, certify deficit fit (fail-closed) at REGISTRATION, BEFORE it enters the pending/disposition flow
  → assess_fit(result, context, mismatches) -- sort applicability fit before user judgment
  → surface(fit_scoped_mismatch, as_inquiry) -- present mismatch with fit basis and evidence
  → judge(mismatch) → dispose(result, judgment, disposition) -- TWO AXES: whether the flagged aspect stands, then what becomes of the result (adapt / keep / discard)
  → ContextualizedExecution
requires: mismatch_detected(R, X)       -- runtime checkpoint (Phase 0)
deficit:  ApplicationDecontextualized    -- activation precondition (Layer 1/2); certificate.owner for in-scope mismatches
preserves: X                             -- application context is fixed reference; morphism transforms R only
invariant: Applicability over Correctness
invariant: certificate-before-registration  -- DeficitFitCertificate.status = pass strictly precedes registering a mismatch into pending(Σ) (shared meta-backbone order, at registration of both Mᵢ and Mₑ)
invariant: transformative revalidation (NON-MONOTONE) -- an Adapt disposition mutates the Eval(R, X) target into R', breeding emergent mismatches Mₑ; re-scan mandatory; progress(Λ) may regress
invariant: judgment-disposition separation -- the judgment (does the aspect stand?) and the disposition (what becomes of the result) are separate answers. A settled judgment is relay-eligible; the disposition is ALWAYS user-answered, because it is the disposition that changes the artifact

── TYPES ──
R      = Result to be evaluated (source-agnostic: AI output, analysis conclusion, decision outcome, or any completed work product)
           -- Input type: morphism processes R uniformly; enumeration scopes the definition, not behavioral dispatch
X      = Application context (environment, constraints, user situation)
Eval   = Applicability evaluation: (R, X) → Set(Mismatch)
Mismatch = { aspect: String, description: String, evidence: String, severity: Severity, origin: Origin, kind_binding: KindBinding, certificate: DeficitFitCertificate }
                 -- object_ref: the per-mismatch anchor the certificate evaluates and the value-space binds over (epharmoge-local instantiation of the shared backbone's object_ref)
                 -- the mismatch's kind/domain is carried by kind_binding.label (Axis = String, emergent); no separate dimension field (single source of the kind label)
Origin ∈ {Initial, Emerged(aspect)}                            -- mismatch provenance: initial scan or spawned by adapting parent aspect
Severity ∈ {Critical, Significant, Minor}                      -- Significant requires demonstrable behavioral impact (current-session task graph / downstream protocol activations); see Rule 12

-- Shared meta-backbone (KIND dispatch, registration-time / cycle-emergent). One canonical schema; epharmoge-local instantiation ONLY for object_ref (= Mismatch), local_value_space (= the two-axis answer space Judgment × Disposition under well_formed), the label field's type (Axis), and guard routing targets.
KindBinding    = { label: Axis, positive_predicate: String, evidence: Set(Evidence), origin ∈ {seed, emergent}, atomicity ∈ {atomic, non-atomic} }
                 -- captures the mismatch as a kind; if atomicity = non-atomic (the mismatch bundles two distinct aspects) → split BEFORE certify (no registration, no surfacing on a compound mismatch)
DeficitFitCertificate = { owner: Deficit, in_scope_if: String, route_if: List<RoutePair>, evidence: Set(Evidence), status ∈ {pass, route, ambiguous} }
                 -- fail-closed: status ≠ pass BLOCKS registration into pending(Σ) AND surfacing this mismatch for answer. Generated at registration time (Phase 0 for Mᵢ, Phase 2 re-scan for Mₑ) by fitting KindBinding.positive_predicate against the documented sibling-deficit scopes — each sibling protocol's deficit: declaration (its SKILL.md deficit: line), with the registered dependency graph supplying the deficit inventory (which sibling deficits exist as nodes; epharmoge has no outgoing routing edge, so the fit rests on the deficit-scope declarations, not on edge topology).
                 -- owner = ApplicationDecontextualized when the mismatch is in-scope; status = pass iff the mismatch's positive_predicate fits ApplicationDecontextualized and no sibling deficit claims it
                 -- status = route: a sibling deficit owns the mismatch (backward misfit) → emit RoutePair target, drop the mismatch from registration (it never enters pending(Σ))
                 -- status = ambiguous: overlapping deficit fit → defer the mismatch for ONE bounded re-assessment at the fixed detection state ((R, X) for Mᵢ at Phase 0, (R', X) for Mₑ at the Phase 2 re-scan; AI-side, no user interaction; Phase 0 stays silent for Mᵢ) → pass / route / terminal-residual; never register/surface under ambiguous fit
RoutePair      = (route_if_predicate: String, target: Protocol)
                 -- epharmoge-local guard routing targets — BACKWARD misfit the loop routes away rather than adapting in-place:
                 --   an unnoticed decision gap rather than a context-fit question        → /gap        (GapUnnoticed)
                 --   a missing pre-execution fact (no observable value, requires supply)  → /inquire    (ContextInsufficient)
                 --   undefined convention/dependency ownership for the decision           → /bound      (BoundaryUndefined)
Evidence       = { source: ContextChannel, content: String }
ContextChannel ∈ {Result, Context, Convention, Environment, Session}  -- observable sources for the certificate's deficit-fit basis (R itself + observable X)
V              = bind_value_space : Mismatch → ValueSpace       -- the mismatch's answer constructors; generated ONLY after certificate.status = pass; frozen for the cycle (relay / dead-signal test applied)
ValueSpace     = the mismatch's answer space (local_value_space; epharmoge-local instantiation point) = { (j, d) : j ∈ Judgment, d ∈ {Adapt(direction), Keep, Discard(replacement)}, well_formed(j, d) }
                 -- a two-axis PRODUCT, not a flat coproduct: whether the flagged aspect stands and what becomes of the result are separate answers, so a judgment can be settled without settling the repair
Deficit        = the sibling-deficit label a mismatch may belong to (sourced from each protocol's documented deficit: declaration; the protocol that OWNS the deficit is a node in the registered dependency graph and the deficit/edge relations are its edges — the deficit label itself is NOT a node of that graph); owner = ApplicationDecontextualized for in-scope mismatches
Protocol       = downstream protocol slash target a routed mismatch is handed to (e.g., /gap, /inquire, /bound)
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
depends = Set(ContextCondition) where fitness hinges on an observable but unverified condition that could change which disposition is chosen
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
Register = { m ∈ Set(Mismatch) : certificate(m).status = pass } → Set(Task) [Tool: TaskCreate] -- registration of ONLY certificate-passing mismatches as tracked tasks; status ≠ pass blocks registration (fail-closed)
pending(Σ) = Set(Mismatch) where registered task status ∉ {completed, dismissed}  -- a routed/ambiguous mismatch never enters pending(Σ); only certificate-passing mismatches are registered
Q      = Applicability inquiry over F-scoped mismatch (gate interaction)
Judgment    ∈ {Upheld, Overruled}                              -- EPISTEMIC axis: does the flagged aspect genuinely fail to fit X?
Disposition ∈ {Adapt(direction: String), Keep, Discard(replacement: Option(Result)), Route(target: Protocol), Residual, Moot}
              -- REPAIR axis: what becomes of the result, and how this mismatch is closed
              -- Discard's payload is Option(Result): Some(r) when something takes the withdrawn result's place, None when the withdrawal leaves nothing behind
              --   user-answered at Phase 1        : Adapt(direction), Keep, Discard(replacement)
              --   certificate-assigned at registration (never surfaced for answer): Route(target), Residual
              --   loop-assigned                   : Moot (a Discard withdrew the Eval target while this mismatch was still pending)
              -- Route/Residual live on THIS axis rather than beside it: they are ways a flagged aspect is closed, so the convergence
              --   predicate quantifies over one disposition ledger instead of a list of parallel exceptions
A      = User answer = (j: Judgment, d: Disposition) where d ∈ {Adapt(direction), Keep, Discard(replacement)}
         -- A ∈ V; drawn from the mismatch's value-space (local_value_space = the two-axis space above)
well_formed(j, d) =
    (j = Overruled ⟹ d = Keep)                                 -- an overruled aspect leaves R untouched: nothing to repair
  ∧ (d ∈ {Route(_), Residual, Moot} ⟹ j = Upheld)              -- the aspect IS flagged in each of these; only ownership (Route),
                                                               --   attributability (Residual), or the target's survival (Moot) differs
  -- Upheld × Keep is a REACHABLE and distinct state: the mismatch stands and the user accepts the result anyway (an accepted residual).
  --   The flat coproduct could not express it — Dismiss meant both "does not stand" and "stands but accepted".
ZeroMismatchConfirmation = user's answer to a zero-mismatch finding ∈ {AcceptNoMismatch, Reopen(aspect)}
         -- AcceptNoMismatch accepts that no aspect is unwarranted (Rule 9); Reopen names an aspect the Phase 0 scan missed, re-entering Eval focused on it
         -- named for what it accepts; it shares no constructor with the Judgment axis, so the same name can never carry opposite meanings across the two
R'     = Result after an Adapt disposition -- temporal succession of R; the Eval target the non-monotone re-scan re-aims at
R_final : Option(Result) = the result as it stands at convergence — Some(R) when no Adapt applied, Some(R') when adapted, or the Discard's replacement payload when a withdrawal fired (None when that withdrawal left nothing in its place). Option-valued because "no result survives" is a reachable success state, not an error
DispositionRecord = { mismatch: Mismatch, judgment: Judgment, judgment_by ∈ {user, relay},
                      disposition: Disposition, assigned_by ∈ {user, certificate, loop}, basis: String }
         -- ONE ledger entry per closed mismatch. routed / residual / moot are VIEWS over the ledger, not parallel lists
         -- well-formedness: assigned_by = user ⟹ disposition ∈ {Adapt(_), Keep, Discard(_)}; judgment_by = relay ⟹ judgment = Upheld ∧ basis ≠ ""
ApplicabilityVerdict = { target: R_final, dispositions: List(DispositionRecord), scan_count: Nat }
         -- the protocol's terminal object: the result TOGETHER WITH how every flagged aspect was closed.
         -- Adaptation is ONE disposition among several, not what completion means — Keep, Discard, Route, Residual and Moot are equally terminal,
         --   so no success path has to claim the result was adapted when it was not
ContextualizedExecution = ApplicabilityVerdict where (∀ task ∈ registered: task.status ∈ {completed, dismissed}) ∧ (Mᵢ = ∅ ⟹ zero-mismatch confirmation obtained: ZeroMismatchConfirmation = AcceptNoMismatch, or Reopen(aspect) whose focused re-scan still yields Mᵢ = ∅ → relay(finding) — Rule 9)
                 -- registered = certificate-passing mismatches only; Route/Residual mismatches are closed by disposition, not adapted in-place
EarlyExit = ApplicabilityVerdict where user_esc  -- non-convergent early exit: verdict as of exit (target as it stands, dispositions closed so far), remaining pending mismatches declared as unresolved residual

── PHASE TRANSITIONS ──
Phase 0: R → Eval(R, X) → Mᵢ? → ∀m ∈ Mᵢ: bind_kind(m) → certify(m, registry) → (status = pass) → Mᵢ_passed → AssessFit(R, X, Mᵢ_passed) → F → Λ.fit_map := F  -- applicability checkpoint + registration-time KIND dispatch (fail-closed) + fit map (silent); certify runs WITHIN Phase 0, at registration, not as a separate phase
Phase 0 → confirm_no_mismatch: Mᵢ = ∅ → Qz(zero_mismatch_finding) → Stop → ZeroMismatchConfirmation  -- true zero-mismatch case (distinct from the Mᵢ≠∅∧Mᵢ_passed=∅ trivial-convergence-by-routing case below); AcceptNoMismatch → R_final := Some(R), deactivate (execution stands as-is, Rule 9); Reopen(aspect) → reopen_focus := aspect → re-scan Eval focused on that aspect → reopen_focus := None (cleared after the focused re-scan, either arm); [Mᵢ ≠ ∅] re-enter the Phase 0 pipeline above (bind_kind → certify → Mᵢ_passed → AssessFit → F) and proceed to Phase 1; [Mᵢ still ∅] relay(finding) → R_final := Some(R), deactivate (one attempt per aspect) [Tool]
Phase 0 → route_away (mismatch-local): certify(m).status = route        -- a sibling deficit owns the mismatch (backward misfit) → emit RoutePair.target (/gap, /inquire, /bound), close m with DispositionRecord { judgment = Upheld, judgment_by = relay, disposition = Route(target), assigned_by = certificate, basis = the matched sibling-deficit scope }, drop m from registration (m never enters pending(Σ)); scan continues with remaining mismatches
Phase 0 → split (pre-certify): KindBinding.atomicity = non-atomic  -- a compound mismatch bundles two distinct aspects → split into atomic sub-mismatches and re-run bind_kind + certify on each (same Phase 0 pass, before any pass/route/defer decision); recursive until atomic (well-founded: each split strictly decreases the number of bundled aspects — atomic = exactly one aspect — so the recursion terminates). A non-atomic mismatch is NEVER deferred or registered as a compound
Phase 0 → defer (mismatch-local): certify(m).status = ambiguous  -- overlapping deficit fit on an ATOMIC mismatch → ONE narrowed-scope re-assessment at the fixed Phase-0 (R, X) (AI-side, no user interaction — Phase 0 stays silent), then re-certify. (R, X) is fixed in Phase 0, so a re-assessment is deterministic-identical → the bound is ONE attempt: resolves to pass (→ registered), route (→ Route(target) disposition), or — if it STAYS ambiguous — Residual: close m with DispositionRecord { judgment = Upheld, judgment_by = relay, disposition = Residual, assigned_by = certificate, basis = the unresolved overlap } (an unattributable mismatch: never registered into pending(Σ), adjudicated by disposed(aspect(m)), surfaced as residual, non-blocking). deferred-pending therefore always clears (no Phase-0 loop)
Phase 0 → deactivate (no in-scope mismatch): Mᵢ ≠ ∅ ∧ Mᵢ_passed = ∅ ∧ adjudicated(R, X) ∧ no deferred-pending ∧ pending(Σ) = ∅  -- mismatches WERE detected but EVERY one carries a certificate-assigned disposition, Route(target) or Residual (discharged through the single typed disjunct disposed(a): ∃ r ∈ Σ.dispositions with aspect(r.mismatch) = a, NOT raw Mismatch-in-list membership) — no in-scope (ApplicationDecontextualized-owned) mismatch enters the disposition loop → trivial convergence: emit the routing recommendations (/gap, /inquire, /bound) and deactivate without adapting R (R stands as-is for the in-scope check; contextualized(R) holds vacuously — adjudicated(R, X) with every aspect disposed). DEFERRED mismatches (atomic, status = ambiguous; a non-atomic mismatch is split pre-registration, never deferred) are NOT terminal and do NOT satisfy this path: they first get their ONE bounded re-assessment via Phase 0 → defer until each resolves to pass (→ registered into pending(Σ)), route (→ Route(target)), or Residual (still ambiguous at the fixed Phase-0 (R, X) → unattributable, excluded from pending(Σ), non-blocking); the bound (one re-assessment per mismatch, (R, X) fixed in Phase 0) guarantees deferred-pending always clears. Trivial convergence fires once NONE remain deferred-pending and every flagged aspect is disposed (none in-scope/pending). Distinct from the zero-mismatch-detected case (Mᵢ = ∅, no aspect ¬warranted): here aspects WERE flagged but all belong to sibling deficits. The per-mismatch-certificate analogue of elicit's all-projections-routed exit
Phase 1: Mᵢ_passed → TaskCreate[all certificate-passing initial mismatches] → pending(Σ) → SelectNext(pending, F, Σ) → Mₛ → judgment_settled(Mₛ, F)? → Qc(F-scoped Mₛ, evidence, judgment_state) → Stop → A = (j, d)  -- register all certificate-passing initial mismatches, surface selected mismatch with fit basis [Tool]; reached only when Mᵢ_passed ≠ ∅
Phase 1 → judgment_relay (mismatch-local): judgment_settled(Mₛ, F) ≡ the evidence for ¬warranted(aspect(Mₛ), R, X) admits no reading under which the aspect stands warranted — judgment-level entropy → 0 with a citable basis (Rule 10)  -- relay j := Upheld with the basis cited (judgment_by = relay), drop the Overruled/Keep pairing from the presented set, and CONTINUE to Qc for the disposition; the turn is NOT yielded for the judgment half. This NEVER authorizes adapt or discard: a settled judgment is a finding, not permission to change the artifact, so Qc still fires and still yields turn (invariant: judgment-disposition separation). When judgment_settled does not hold, the full two-axis set is presented and j is user-answered (judgment_by = user)
Phase 2: A = (j, d) → dispose(j, d, R) →
         [d = Adapt(direction)] adapt(direction, R) → R' [mutating — transformative revalidation] → TaskUpdate → Eval(R', X) → Mₑ? → ∀m ∈ Mₑ: bind_kind(m) → certify(m, registry) → (status = pass) → Mₑ_passed → TaskCreate[all Mₑ_passed] → pending(Σ) → AssessFit(R', X, pending) → F' → Λ.fit_map := F'
         [d = Keep] R_final := Some(R) [non-mutating adjudication — no adapt, no Mₑ, no re-scan] → TaskUpdate
         [d = Discard(replacement)] → Phase 2 → withdraw (below)
         -- EVERY arm (including Discard) appends DispositionRecord{ mismatch = Mₛ, judgment = j, judgment_by, disposition = d, assigned_by = user, basis } to Σ.dispositions; the Adapt arm additionally increments Σ.scan_count, since only Adapt mutates the Eval target and triggers the re-scan + registration-time certify of emerged mismatches [Tool]
         -- R_final is fixed at convergence, not per cycle: Some(R') on the Adapt path once the loop settles, Some(R) when no Adapt ever fired, and the Discard payload on the withdrawal path
Phase 2 → withdraw (run-terminal): d = Discard(replacement) ∧ j = Upheld  -- the user upholds the mismatch and WITHDRAWS the result instead of adapting it. R_final := replacement (already Option(Result): None when the withdrawal leaves nothing in its place); Λ.withdrawn := Some((Mₛ, replacement)); EVERY mismatch still in pending(Σ) is closed with DispositionRecord { judgment = Upheld, judgment_by = relay, disposition = Moot, assigned_by = loop, basis = the withdrawal record } and TaskUpdate'd (they concern an object that no longer exists); NO re-scan — Eval has no target, and Eval(replacement, X) would evaluate a DIFFERENT object rather than a succession of R; deactivate. Convergence holds by disposition: every flagged aspect carries a ledger entry. This is the path a withdrawal-shaped run takes — the mismatch stands, the result is withdrawn, and what survives is the replacement rather than an adaptation of R
Phase 2 → route_away (mismatch-local): certify(m).status = route        -- an emerged mismatch a sibling deficit owns → emit RoutePair.target, close m with disposition Route(target) (assigned_by = certificate), drop it from registration; re-scan continues
Phase 2 → split (pre-certify): KindBinding.atomicity = non-atomic  -- emerged compound mismatch → split into atomic sub-mismatches, re-bind_kind + certify each (same re-scan pass); never deferred/registered as a compound
Phase 2 → defer (mismatch-local): certify(m).status = ambiguous  -- emerged overlapping (atomic) mismatch → ONE bounded narrowed-scope re-assessment at the fixed re-scan (R', X) (deterministic-identical → one attempt) → pass (→ registered) / route (→ Route(target)) / Residual (closed with assigned_by = certificate), re-certify BEFORE registration

── LOOP ──
Transformative revalidation (NON-MONOTONE): this loop mutates the very object its detector evaluates. An Adapt disposition produces R', and Eval(R', X) re-targets the detector at the mutated result — so an adaptation can BREED new mismatches Mₑ that did not exist before. "Transformative revalidation" labels the ADAPT disposition ONLY; every other disposition (Keep, Discard, Route, Residual, Moot) is non-mutating with respect to the Eval target as a succession of R.
After Phase 2, re-scan is disposition-keyed, not answer-keyed:
  Adapt(direction)      → re-scan R' against X for remaining AND newly emerged mismatches (mandatory)
  Keep                  → non-mutating (R_final := R); breeds no Mₑ; no re-scan
  Discard(replacement)  → the Eval target is gone; no re-scan is possible or meaningful; run terminates via Phase 2 → withdraw
  Route / Residual      → certificate-assigned, never surfaced for answer; the scan continues with the remaining mismatches
Bind + certify each newly emerged mismatch at registration (fail-closed): only certificate-passing emerged mismatches (Mₑ_passed) are registered into pending(Σ); a routed mismatch is closed with Route(target) and handed to its sibling deficit (/gap, /inquire, /bound); a non-atomic compound mismatch is split into atomic sub-mismatches and re-certified; an atomic ambiguous mismatch gets its one bounded re-assessment at the fixed re-scan (R', X) → pass / route / Residual, before registration. AssessFit classifies tracked mismatches but never suppresses them.
Recompute F over pending(Σ) before selecting the next surfaced mismatch, even when Mₑ_passed = ∅.
If pending(Σ) non-empty: return to Phase 1 (SelectNext by severity, then FitRank, then oldest registered task).
If adjudicated(R_final, X): every flagged aspect carries a DispositionRecord → convergence.
progress(Λ) MAY REGRESS: because re-scan over a mutated R' can register newly certified mismatches, the disposed/total ratio is non-monotone — this is the signature of the transformative-revalidation side, not an error.
User can exit at Phase 1 (Keep all remaining, or Esc).
Continue until: contextualized(R_final) OR user ESC (EarlyExit, not ContextualizedExecution).
Mode remains active until convergence or explicit user exit (Esc).
On user ESC: present partial transformation trace ranging over Σ.dispositions as accumulated so far, then declare remaining pending(Σ) mismatches as unresolved residual.
Convergence evidence: At adjudicated(R_final, X), present the transformation trace ranging over Σ.dispositions — ONE ledger, because every close writes a record there regardless of who assigned it (user, certificate, or loop), so the trace no longer has to be assembled from parallel lists. For each r ∈ Σ.dispositions show (aspect(r.mismatch) → r.judgment → r.disposition), reading:
  Upheld → Adapt(direction)     : in-scope, adapted in place — ApplicationDecontextualized(m) resolved by adaptation
  Upheld → Keep                 : in-scope and accepted as-is — an ACCEPTED RESIDUAL, distinct from Overruled → Keep
  Overruled → Keep              : the aspect did not stand; nothing to repair
  Upheld → Discard(replacement) : the result was withdrawn rather than adapted; the replacement is what survives
  Upheld → Route(target)        : a sibling deficit owns m — NOT ApplicationDecontextualized(m), since status = route means it was never in-scope here
  Upheld → Residual             : unattributable after its one bounded re-assessment; surfaced as a non-blocking residual
  Upheld → Moot                 : still pending when a Discard withdrew the target; closed because its object no longer exists
Convergence is demonstrated, not asserted.

── CONVERGENCE ──
applicable(R_final, X) = ∀ aspect(a, R_final, X) : warranted(a, R_final, X)
warranted(a, R, X) = correct(R) ∧ fits(R, X)                -- correctness AND contextual fit required (not material conditional)
disposed(a)        = ∃ r ∈ Σ.dispositions : aspect(r.mismatch) = a
                     -- ONE disjunct covering every way a flagged aspect is closed — Adapt, Keep, Discard, Route, Residual, Moot — because all
                     -- six are members of the Disposition axis and every close writes one ledger entry. This replaces the former
                     -- dismissed(a) ∨ routed(a) ∨ terminal_residual(a) enumeration: those were parallel lists standing outside the answer type,
                     -- so each new way of closing a mismatch had to be added as another disjunct here.
                     -- aspect is a String label, so this discharges by label equality — it assumes aspects stay stable and uniquely labelled
                     -- across the R→R' trajectory; a transformative re-scan could in principle surface a new R'-aspect colliding on a disposed
                     -- label, a documented low-probability assumption, not foreclosed by the type
adjudicated(R_final, X) = ∀ aspect(a, R_final, X) : warranted(a, R_final, X) ∨ disposed(a)
contextualized(R_final) = adjudicated(R_final, X)
trivial convergence (all-disposed at registration): when Mᵢ ≠ ∅ but Mᵢ_passed = ∅ AND every flagged aspect is closed with a certificate-assigned disposition, Route(target) or Residual — aspect-keyed via disposed(a) over the atomic (post-split) aspects, not raw Mᵢ membership — (no deferred-pending, pending(Σ) = ∅), adjudicated(R, X) holds by disposed(a) for every flagged aspect (and warranted for the rest) — R is unadapted and contextualized(R) holds. This is the Phase 0 → deactivate (all-routed) path. DEFERRED mismatches do NOT satisfy this: they carry no ledger entry yet, so disposed(a) does not cover them; a deferred mismatch first gets its one bounded re-assessment (Phase 0 → defer) to pass (→ pending(Σ)), route (→ Route(target)), or Residual before any convergence claim. Distinct from the no-mismatch case (Mᵢ = ∅, every aspect warranted from the start) — here aspects were flagged but all belong to sibling deficits
withdrawal convergence: when a Discard(replacement) disposition fires (Phase 2 → withdraw), R_final := replacement and every mismatch still in pending(Σ) is closed as Moot, so disposed(a) holds for every flagged aspect and adjudicated(R_final, X) follows without any re-scan. The target of the final applicability claim is the replacement, not R — which is why the terminal object carries its target explicitly rather than asserting that an adaptation took place
certificate gate:  every registered mismatch carried certificate.status = pass (fail-closed, at registration) — routed/ambiguous mismatches never entered pending(Σ), so an adapted R' is assembled only from in-scope (ApplicationDecontextualized-owned), fit-certified adaptations; backward misfit was handed forward (/gap, /inquire, /bound), not adapted in-place
-- stratification: applicable(R_final, X) ⊆ adjudicated(R_final, X)
-- operational proxy: ∀ task resolved (status ∈ {completed, dismissed}) ⟹ adjudicated(R_final, X) ⟹ contextualized(R_final)
progress(Λ) = 1 if |total_tasks| = 0 else |resolved_tasks| / |total_tasks|   -- resolved_tasks = registered tasks whose mismatch carries a DispositionRecord in Σ.dispositions (matches the ContextualizedExecution resolution contract)   -- total_tasks = 0 (Mᵢ = ∅, or Mᵢ≠∅∧Mᵢ_passed=∅ trivial convergence via routing) is fully converged, not undefined — the Mᵢ = ∅ leg only after the Rule 9 zero-mismatch confirmation (AcceptNoMismatch, or Reopen whose focused re-scan stays ∅); otherwise NON-MONOTONE: may regress when re-scan over the mutated R' registers newly certified mismatches (transformative-revalidation signature)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Eval   (sense)   → Internal analysis (no external tool)
Qz / ZeroMismatchConfirm (constitution) → present (conditional: Mᵢ = ∅; zero-mismatch finding + reasoning; AcceptNoMismatch / Reopen(aspect) — Rule 9). Named apart from the Phase 1 Qc gate: two gates asking different questions never share a name, and neither shares a constructor with the other's answer type
reopen_relay (extension) → TextPresent+Proceed (conditional: Reopen(aspect) focused re-scan still yields Mᵢ = ∅ → relay the still-zero finding and deactivate; one attempt per aspect, basis = the focused Eval re-scan)
reopen_focus (track) → Internal state update (set at Reopen(aspect), threads the focused Eval re-scan, cleared after the re-scan — consumed once, either arm)
bind_kind (sense)   → Internal analysis (capture each detected mismatch as a KindBinding {label, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity}; non-atomic mismatch → split before certify)
certify (extension) → Internal analysis (fail-closed DeficitFitCertificate; fit of KindBinding.positive_predicate against the documented sibling-deficit scopes — each sibling protocol's deficit: declaration plus the registered deficit inventory (sibling-deficit nodes; epharmoge has no outgoing routing edge, so the fit rests on the deficit-scope declarations, not edge topology): owner = ApplicationDecontextualized when in-scope; status = pass | route | ambiguous; basis = the cited deficit-scope fit, shown at the mismatch's Phase 1 surfacing. Relay (Extension) because the fit is grounded in a citable source and an unclear fit returns status = ambiguous → defer, never a user gate. Runs at registration time — within Phase 0 for Mᵢ, within Phase 2 re-scan for Mₑ — BEFORE the mismatch enters pending(Σ))
AssessFit (sense) → Internal analysis (no external tool)
judgment_relay (extension) → TextPresent+Proceed (conditional: judgment_settled(Mₛ, F) — the evidence for ¬warranted(aspect(Mₛ), R, X) admits no reading under which the aspect stands warranted, i.e. judgment-level entropy → 0 with a citable basis, Rule 10. Relay j := Upheld with the basis shown, drop the Overruled/Keep pairing from the presented set, and PROCEED to Qc without yielding the turn for the judgment half. This is the compiled control path Rule 10 promises for this protocol; it covers the JUDGMENT axis only. It never authorizes adapt or discard — the disposition gate below still fires and still yields turn, so a settled judgment can never become silent permission to change the artifact)
Qc     (constitution)    → present (mandatory: the DISPOSITION is always user-answered, whether or not the judgment was relayed — Adapt(direction) / Keep / Discard(replacement), with the Overruled/Keep pairing included when the judgment is not settled; Esc key → loop termination at LOOP level, not an Answer)
adapt  (transform) → Edit, Write (Adapt(direction) disposition: result adaptation based on user direction)
discard (transform) → Edit, Write (Discard(replacement) disposition: withdraw the result and put the replacement in its place, or remove it outright when the withdrawal leaves nothing behind)
                    -- (transform): tool call that changes existing artifacts; medium-agnostic (files, analysis text, generated content)
route  (extension)   → TextPresent+Proceed (certificate.status = route → emit the matching RoutePair.target as a backward-misfit recommendation: decision gap → /gap, missing pre-execution fact → /inquire, undefined convention/dependency ownership → /bound; the routing target is read off the matched sibling-deficit scope, basis cited; closes the mismatch with disposition Route(target))
dispose (track)  → Internal state update (append the DispositionRecord for the closed mismatch to Σ.dispositions — user-, certificate-, or loop-assigned; this ledger is what the convergence trace ranges over)
Mᵢ/Mₑ (track)   → TaskCreate/TaskUpdate (mismatch tracking with framing visibility; only certificate-passing mismatches are registered)
converge (extension)  → TextPresent+Proceed (convergence evidence trace; proceed with contextualized execution)
esc      (extension)  → TextPresent+Proceed (partial transformation trace + unresolved-mismatch residual declaration; terminate as EarlyExit, not ContextualizedExecution)
Seam transition to a declared next protocol (extension) → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares, settles the next move — proceed directly to it, citing that settling source; every Constitution gate inside Epharmoge and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, R: Result, X: Context,
      fit_map: F, state: Σ, active: Bool, cause_tag: String,
      reopen_focus: Option(String),   -- the zero-mismatch Reopen(aspect) focus the Phase 0 scan missed; threads into the focused re-scan, cleared after it; a focused re-scan that still yields Mᵢ = ∅ presents its finding as relay and deactivates (one attempt per aspect — deterministic-identical re-runs are not re-gated, per the re-assessment idiom)
      deferred: Set(Mismatch),   -- ATOMIC mismatches with certificate.status = ambiguous, parked for their ONE bounded narrowed-scope re-assessment against the fixed detection state — (R, X) for an initial mismatch (Phase 0), (R', X) for an emerged mismatch (Phase 2 re-scan) (a non-atomic mismatch is split pre-registration, never parked here; status ≠ pass — never entered pending(Σ)). Pre-disposition parking, so a deferred mismatch carries NO ledger entry yet. After the bounded attempt each resolves to pass / Route(target) / Residual, so "no deferred-pending" (≡ no mismatch still awaiting its bounded re-assessment) always becomes reachable
      withdrawn: Option((Mismatch, Option(Result))) }   -- set by Phase 2 → withdraw: the mismatch whose Discard withdrew the Eval target, and the replacement that took its place (inner None when the withdrawal left nothing behind). Presence of this field is what makes the run terminal without a re-scan
Σ = { dispositions: List(DispositionRecord), scan_count: Nat }
                 -- the SINGLE disposition ledger, replacing the former history/routed/residual triple. Every close writes here — user-answered,
                 -- certificate-assigned, or loop-assigned — so the convergence trace ranges over one list rather than a union of three
                 -- each Mismatch in a record carries its kind_binding + certificate (object_ref = Mismatch)
-- Views over Σ.dispositions (derived, NOT parallel state):
--   routed(Λ)   = { r ∈ Σ.dispositions : r.disposition = Route(_) }
--   residual(Λ) = { r ∈ Σ.dispositions : r.disposition = Residual }
--   moot(Λ)     = { r ∈ Σ.dispositions : r.disposition = Moot }
-- Certificate invariant: ∀ m ∈ pending(Σ) : m.certificate.status = pass (fail-closed — routed/ambiguous mismatches never enter pending(Σ))
-- Ledger invariant: every mismatch leaving pending(Σ), and every mismatch closed at registration, appends exactly one DispositionRecord (no close without a record; no record without a close)

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Mismatch-domain resolution emergent via session context.
certificate-before-registration ∘ transformative-revalidation: the fail-closed certificate order composes with the NON-MONOTONE loop — when an Adapt disposition mutates R and Eval(R', X) breeds emergent mismatches Mₑ, EACH Mₑ is independently bind_kind'd + certified at re-scan registration (Phase 2) before it can enter pending(Σ). So only in-scope (ApplicationDecontextualized-owned) Mₑ_passed register, even as R mutates across cycles; the certificate gate holds under mutation-induced revalidation. Dual to elicit's "Monotonicity ∘ shared-backbone": elicit composes the order with an IMMUTABLE substrate, contextualize with a MUTATING R — both preserve certificate-before-commit.
judgment-relay ∘ disposition-gate: the two axes compose so that relaying one never relays the other. judgment_relay may discharge the epistemic half at entropy → 0 with a cited basis, and Qc still fires for the repair half — so the compiled relay path shortens the question without ever shortening the permission. The composite is stable under the non-monotone loop: an emergent Mₑ re-enters at Phase 1 and is judged and disposed on the same two axes, with its own relay eligibility computed afresh.
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
- Loaded instructions resume after every flagged aspect carries a disposition

### Trigger Signals

Heuristic signals for applicability mismatch detection (not hard gates):

| Signal | Detection |
|--------|-----------|
| Environment assumption | Result assumes environment state not verified in current context |
| Convention mismatch | Result follows general best practices but project has local conventions |
| Scope overflow | Result addresses more or less than the observed use case requires |
| Temporal context | Result applies to a version, state, or phase that may have shifted |

**Cross-session enrichment**: Prior session indices from the hypomnesis store (prior-session recall indices), when present, may seed the Phase 0 scan; the constitutive judgment remains with the user.

**Revision threshold**: The mismatch's kind label is an open emergent type (Axis); the listed domains are only the illustrative example set. When accumulated mismatch detections across 3+ sessions cluster around a recurring domain outside the current examples, that domain warrants adding to the example set. When a cited example consistently mis-fires (3+ sessions of classification false negatives clustered on it), it warrants rewording or dropping from the examples. Neither move changes the type — the taxonomy stays open; only the detection scent is recalibrated.

**Skip**:
- User provided explicit, detailed specification and result follows it exactly
- User explicitly says "looks good" or "proceed" after execution
- Trivial or mechanical execution (formatting, typo fixes, rename)
- Read-only / exploratory task — no result to evaluate
- Same (aspect, description) pair was closed with a Keep disposition in current session (session immunity)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Every flagged aspect carries a disposition (adapted, kept, routed, residual) | Proceed with the verdict — it carries `R_final` together with how each aspect was closed |
| A Discard disposition withdrew the result (Phase 2 → withdraw) | Withdrawal convergence: `R_final` is the replacement (or nothing), every still-pending mismatch is closed as Moot, and no re-scan runs — the evaluation target no longer exists |
| No mismatches detected (Phase 0 zero-mismatch finding confirmed) | Execution stands as-is |
| Mismatches detected but none in-scope (Mᵢ ≠ ∅ ∧ Mᵢ_passed = ∅ ∧ adjudicated(R, X) ∧ no deferred-pending ∧ pending(Σ) = ∅) | Trivial convergence — every flagged aspect is routed to a sibling deficit or terminal-residual (unattributable); emit the routing recommendations (/gap, /inquire, /bound), surface any terminal-residual, and deactivate without adapting R (adjudicated by routing/terminal-residual, not in-place adaptation). DEFERRED mismatches (ambiguous, atomic) get ONE bounded re-assessment → pass / route / terminal-residual before any convergence (a non-atomic mismatch is split pre-registration, not deferred); only a set with no in-scope mismatch (each routed or terminal-residual) fires this path. Distinct from the no-mismatch-detected row above: aspects WERE flagged but none is in-scope for adaptation |
| User Esc key | EarlyExit (not ContextualizedExecution): present partial transformation trace + declare pending mismatches as unresolved residual, then accept result without further applicability review |

## Mismatch Identification

Mismatches are identified across emergent dimensions. The domains listed below are frequently-verified examples that carry detection scent — NOT a closed taxonomy; any context-fit mismatch the morphism admits is in-scope whether or not it matches a listed example.

### Frequently-Verified Mismatch Domains (illustrative, not exhaustive)

These are recurring domains worth scanning first — examples, not a closed set. A mismatch in any other emergent domain is equally in-scope; the rows below carry detection scent and a sample phrasing, they do not bound the type.

| Domain (example) | Detection scent | Sample phrasing |
|------------------|-----------------|-----------------|
| **Convention** | Result follows general patterns but project has local conventions | "This follows best practices, but your project uses [local pattern]" |
| **Environment** | Result assumes environment state that differs from actual operating context | "This assumes [env state], but your context has [actual state]" |
| **Audience** | Result targets a different audience than the actual consumers | "This is written for [assumed audience], but [actual audience] will use it" |
| **Dependency** | Result interacts with components whose constraints weren't considered | "This depends on [component] which has [constraint not considered]" |

**Off-example mismatch detection**: The example domains are illustrative, not exhaustive — a mismatch need not match any of them. Detect an off-example mismatch when:
- The applicability gap spans multiple example domains
- User keeps every example-domain mismatch as-is but the result still exhibits contextual misfit
- The execution context involves domain-specific fitness criteria that resist the example domains

Any such off-example mismatch must satisfy morphism `ApplicationDecontextualized → ContextualizedExecution`; the fail-closed deficit-fit certificate (Phase 0 / Phase 2 re-scan) enforces this at registration. Backward-misfit boundary (routed away, not adapted in-place) — per `RoutePair` (TYPES): `/gap`, `/inquire`, `/bound`.

Each mismatch is characterized by:

- **aspect**: The specific facet where result and context diverge
- **description**: What specifically doesn't fit
- **evidence**: Observable indicator from the result or context
- **severity**: Impact on applicability

### Severity

| Level | Criterion | Action |
|-------|-----------|--------|
| **Critical** | Result actively harmful in current context | Must resolve before using result |
| **Significant** | Result suboptimal or partially inappropriate AND mismatch carries demonstrable behavioral impact (downstream-decision impact, runtime divergence, gate-trajectory change) | Surface to user for judgment |
| **Minor** | Result adequate but could fit better, OR mismatch lacks demonstrable behavioral impact (covers both structural-only and suboptimal-without-impact cases) | Surface with the "real, but fine as-is" option pre-selected |

Behavioral-impact qualifier (Significant criterion): structural-change extent alone — line count, file count, scope size — is insufficient grounds for Significant; the mismatch must produce a demonstrable downstream behavioral consequence. **Assessment scope**: demonstrability is evaluated against the visible task graph and downstream protocol activations within the current session — not speculative future sessions, hypothetical user trajectories, or out-of-session consequences. When the visible session offers no anchor for the predicted consequence, the mismatch defaults to Minor (¬behavioral_impact disjunct). See Rule 12.

When multiple mismatches are identified, surface in severity order (Critical → Significant → Minor). Only one mismatch surfaced per Phase 1 cycle.

## Protocol

### Phase 0: Applicability Checkpoint (Silent)

Evaluate result against application context. This phase is **silent** — no user interaction, except the conditional zero-mismatch confirmation gate (Rule 9) when no mismatch is detected.

1. **Scan result** `R` against context `X`: environment state, conventions, use case scope, temporal validity, user constraints
2. **Check applicability**: For each aspect, assess whether `correct(R) ∧ fits(R, X)` (i.e., `warranted(R, X)`)
3. **Bind + certify each detected mismatch at registration (fail-closed)**: For each candidate mismatch, set `m.kind_binding = { label, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity }`; if `atomicity = non-atomic` (the mismatch bundles two distinct aspects), **split before certify**. Then `m.certificate = certify(m.kind_binding, registry)` where the registry is the documented sibling-deficit scope set — each sibling protocol's `deficit:` declaration (its SKILL.md `deficit:` line) plus the registered deficit inventory (which sibling deficits exist as nodes — epharmoge has no outgoing routing edge, so routing rests on the deficit-scope declarations, not edge topology):
   - **`status = pass`** — the mismatch's positive predicate fits `ApplicationDecontextualized` (certificate `owner = ApplicationDecontextualized`) and no sibling deficit claims it. The mismatch is eligible for registration.
   - **`status = route`** — a sibling deficit owns the mismatch (backward misfit, not a context-fit question). Emit the matching `RoutePair.target` as a recommendation and **drop the mismatch from registration**, closing it with disposition `Route(target)` (`assigned_by = certificate`) in `Σ.dispositions`; the scan continues with the remaining mismatches. Route targets per `RoutePair` (TYPES): `/gap` (GapUnnoticed), `/inquire` (ContextInsufficient), `/bound` (BoundaryUndefined).
   - **`atomicity = non-atomic`** — compound mismatch (two distinct aspects) → **split** into atomic sub-mismatches and re-run bind_kind + certify on each (same Phase 0 pass); never registered or deferred as a compound.
   - **`status = ambiguous`** (atomic) — overlapping deficit fit → ONE narrowed-scope re-assessment at the fixed Phase-0 `(R, X)` (AI-side; no user question — Phase 0 stays silent), then re-certify. `(R, X)` is fixed, so re-assessing is deterministic-identical → bounded to one attempt: pass / route / (if still ambiguous) **terminal-residual** (unattributable, never registered, surfaced as residual, non-blocking). Never register under ambiguity.
4. **Assess fit**: Build `ApplicabilityFitMap` over the certificate-passing mismatches (`Mᵢ_passed`) from warranted aspect evidence, conflicts, dependencies, adaptation options, and bounded open questions
5. If all aspects warranted: present finding per Rule 9 before concluding (Epharmoge not activated)
6. If certificate-passing mismatches remain: record `Mᵢ_passed` with aspect, description, evidence, severity (per Rule 12 — behavioral-impact qualifier assessed against current-session task graph), `origin=Initial`, kind_binding, certificate, and fit-map placement — proceed to Phase 1

**Information source**: The result `R` compared against observable context `X` — non-circularity with Aitesis (Rule 6).

**Registration-time certificate (not an up-front gate)**: The certificate fires per mismatch at registration, not as an up-front gate, and the certify step is relay (Extension). Full account — including the elicit/bound comparison and basis-citation timing — at Rule 17(a)-(b).

**Backbone discipline**: One canonical KindBinding → DeficitFitCertificate → value-space schema shared across protocols; epharmoge's local instantiation is detailed at Rule 17(d).

**Scan scope**: Completed result, observable context (structure, conventions, constraints), session context. Does NOT re-execute or modify files.

**Fit-map scope**: Pre-gate support for mismatch selection and adaptation direction only — classifies, never creates or suppresses tasks (Rule 15; open-condition bound at UX Safeguards: Fit-map cap).

### Phase 1: Mismatch Surfacing

**Register all certificate-passing mismatches (`Mᵢ_passed`) as Tasks** (TaskCreate), then **present** the next pending mismatch selected by `SelectNext` via Cognitive Partnership Move (Constitution). Routed/ambiguous mismatches never enter `pending(Σ)` (fail-closed certificate).

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
  - **Deficit-fit basis**: [which sibling-deficit scope confirmed this mismatch is in-scope for ApplicationDecontextualized rather than owned by a sibling deficit — the cited deficit-scope fit from the certificate; relay, deterministic against the documented scopes (per the certify TOOL GROUNDING promise)]

Then **present**. Each option is a pair — a judgment about the mismatch and a disposition over the result — so each one names both halves in plain terms:

```
How would you like to handle this applicability mismatch?

Options:
1. **Doesn't actually apply** — the flagged aspect fits after all; the result stands unchanged
2. **Real, but fine as-is** — the mismatch stands and the result is accepted anyway: [stated assumption about context fit]
3. **Adapt it** — the mismatch stands; change the result: [brief direction prompt]
4. **Withdraw it** — the mismatch stands and the result should not be used: [what takes its place, if anything]
```

Formally: option 1 is `(Overruled, Keep)`, option 2 is `(Upheld, Keep)`, option 3 is `(Upheld, Adapt(direction))`, option 4 is `(Upheld, Discard(replacement))`. Options 1 and 2 are genuinely different answers — the first says the mismatch was not real, the second accepts a real one — and the trace records them differently.

If an adaptation direction is evident, materialize option 3 with it filled in:
```
3. **[Specific adaptation]** — [what would change and why]
```
This is a contextual materialization of `Adapt(direction)` — the formal disposition remains `Adapt`, with the direction pre-populated from AI analysis. The same holds for option 4's replacement.

**When the judgment was relayed** (`judgment_relay` fired — the evidence admits no reading under which the aspect stands warranted): present the cited basis as text, then drop option 1 from the set, since the judgment half is already settled. Options 2-4 still fire as a gate and still yield turn — a settled judgment shortens the question, never the permission (Rule 10, and the judgment-disposition separation invariant).

**Design principles**: Each option leads to a concrete next step. Evidence-grounding (Rule 4), current-mismatch framing and natural post-execution integration (UX Safeguards), and the stated fitness assumption on option 2 all apply here.

### Phase 2: Disposition

After the user's answer `(judgment, disposition)`, act on the disposition. Every arm below appends one `DispositionRecord` to `Σ.dispositions` and calls TaskUpdate (completed):

1. **`(Overruled, Keep)`**: the flagged aspect fits after all — `R_final := R`, no adaptation, no re-scan
2. **`(Upheld, Keep)`**: the mismatch stands and is accepted anyway — `R_final := R`, note the fitness assumption accepted, no re-scan. Recorded distinctly from arm 1: this is an accepted residual, not a retracted finding
3. **`(Upheld, Adapt(direction))`**: apply the user-directed adaptation using Edit/Write tools → `R'`, then re-scan (below)
4. **`(Upheld, Discard(replacement))`**: withdraw the result using Edit/Write tools — `R_final := replacement` (or nothing, when the withdrawal leaves nothing in its place). Set `Λ.withdrawn`, close **every** mismatch still pending as `Moot` with the withdrawal as basis, and **do not re-scan**: the evaluation target no longer exists, and evaluating the replacement would be evaluating a different object rather than a succession of `R`. The run converges here (Phase 2 → withdraw)

After an **Adapt** disposition only — **re-scan**: (`Keep` is non-mutating and `Discard` is run-terminal; neither breeds `Mₑ` nor triggers `Eval`)
- Re-evaluate `R'` against `X` for remaining AND **newly emerged** mismatches
- **Bind + certify each emerged mismatch at registration (fail-closed)** — this happens at the **Phase 2 re-scan** (AFTER the Adapt disposition has already mutated R into R'), temporally separated from the Phase-0 certification of Mᵢ: for each `m ∈ Mₑ`, set `m.kind_binding` and `m.certificate = certify(m.kind_binding, registry)` (same registry, same `pass | route | ambiguous` statuses as Phase 0). Register only certificate-passing emerged mismatches (`Mₑ_passed`) with `origin=Emerged(adapted_aspect)`; a `status = route` mismatch is closed with disposition `Route(target)` and handed to its sibling deficit (`/gap`, `/inquire`, `/bound`); a non-atomic compound mismatch is split into atomic sub-mismatches and re-certified; an atomic `status = ambiguous` mismatch gets its one bounded re-assessment at the fixed re-scan `(R', X)` → pass / `Route(target)` / `Residual`, before registration. Do not filter the certificate-passing set by fit-map category.
- Recompute `ApplicabilityFitMap` over all pending mismatches before selecting the next mismatch, even when `Mₑ_passed = ∅`
- If remaining tasks non-empty: return to Phase 1 (surface next mismatch via `SelectNext`: severity, then FitRank, then oldest registered task)
- If all tasks completed: execution complete — the verdict carries `R_final` together with every disposition
- Increment `Σ.scan_count`

**Re-scan trigger (transformative revalidation — NON-MONOTONE)**: An Adapt disposition MUTATES `R` into `R'`, and `Eval(R', X)` re-targets the detector at the mutated result, so changed `R'` may exhibit new mismatches not present in the original result. This is the transformative-revalidation / mutates-its-own-detector-target side. Always re-scan after each adaptation — any adaptation may introduce mismatches in dimensions unrelated to the original aspect; `progress(Λ)` may therefore regress (expected, not an error). Every other disposition (`Keep`, `Discard`, `Route`, `Residual`, `Moot`) leaves `R` unmutated as a succession target and is contextualize-internal.

**Chain discovery**: When `Mₑ` emerges from an adaptation, the `origin = Emerged(parent_aspect)` field records the causal chain. This enables:
- Chain visibility: user sees which adaptations spawned new mismatches (a framing signal — which adaptation opened which follow-on, not a progress count)
- Convergence monitoring: chains that grow beyond 3 levels suggest a structural issue worth surfacing explicitly

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Minor severity mismatches only | Constitution interaction with "real, but fine as-is" as default option |
| Medium | Significant severity, evidence is clear | Structured Constitution interaction with evidence |
| Heavy | Critical severity, multiple interacting mismatches | Detailed evidence + adaptation options |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Epharmoge) only if correct(R) ∧ ∃ ¬warranted(a, R, X)` | Prevents false activation on well-fitting results |
| Mismatch cap | One mismatch per Phase 1 cycle, severity order | Prevents post-execution question overload |
| Session immunity | (aspect, description) closed with a Keep disposition → skip for session | Respects the user's acceptance |
| Current-mismatch framing | Phase 1 surfaces the mismatch currently in play (which applicability aspect is being judged this cycle) — a framing readout, not an `[N addressed / M]` completion count | User recognizes which aspect is being judged without parsing a progress tally; granular progress stays in session |
| Deterministic selection | `SelectNext` orders pending mismatches by severity, FitRank, then oldest registered task | Removes unordered Set indexing from user-facing surfacing |
| Fit-map cap | `depends`/`open` only when observable evidence could change which disposition is chosen | Prevents broad contextual caveat lists |
| Early exit | User can keep all remaining as-is at any Phase 1 | Full control over review depth |
| Relay covers judgment only | `judgment_relay` may settle whether a mismatch stands; the disposition gate always fires | A settled finding never becomes silent permission to change the artifact |
| Cross-protocol cooldown | `suppress(Epharmoge) if Aitesis.resolved_in_same_scope ∧ overlap(Aitesis.domains, Epharmoge.aspects)` | Prevents same-scope pre+post stacking |
| Cooldown scope | Cooldown applies within recommendation chains only; direct `/contextualize` invocation is never suppressed | User authority preserved |
| Natural integration | "Done. One thing to verify:" pattern | Fits completion flow, not interrogation |

## Rules

1. **AI-guided, user-judged**: AI detects applicability mismatch; user judges whether adaptation is needed via Cognitive Partnership Move (Constitution) (Phase 1)
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity — Constitution interaction requires turn yield before proceeding
3. **Applicability over Correctness**: When result is correct but contextually mismatched, surface the mismatch — do not assume correctness implies fitness
4. **Evidence-grounded**: Every surfaced mismatch must cite specific observable evidence from both result `R` and context `X`, not speculation
5. **Convergence persistence**: Mode active until every flagged aspect carries a disposition — adapted, kept, discarded, routed, residual, or moot. Adaptation is one disposition among these, not what completion means: a run in which nothing was adapted converges exactly as fully as one in which everything was
6. **Non-circularity**: Information source is the result itself compared against context, not pre-execution context scans (independence from Aitesis)
7. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
8. **Convergence evidence**: Present transformation trace before declaring adjudicated(R', X); per-mismatch evidence is required
9. **Zero-mismatch surfacing**: If Phase 0 scan detects no context mismatches, present this finding with reasoning for user confirmation
10. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options. **This rule's compiled control path is `judgment_relay`** (PHASE TRANSITIONS Phase 1, TOOL GROUNDING) — the axis it applies to is the JUDGMENT axis, where the evidence can admit no reading under which a flagged aspect stands warranted. It does not reach the disposition axis: what becomes of the result turns on user value weightings that no evidence collapses, so `Qc` fires regardless. A relay that reached the disposition would let an obvious finding silently edit the artifact, which is the failure the two-axis split exists to foreclose
11. **Gate integrity** (Safeguard tier): The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
12. **Significant requires demonstrable behavioral impact**: Severity = Significant requires that the mismatch produces a demonstrable behavioral consequence — downstream-decision impact, runtime divergence, gate-trajectory change. Structural-change extent (line count, file count, scope size) alone is insufficient grounds — categorize as Minor when behavioral impact is undemonstrated. This guards against false-positive gating arising from conflation of structural-change extent with applicability impact, where the Option-set relay test (Rule 10) would otherwise apply only ex post via user challenge
13. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
14. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
15. **Applicability fit map is support only**: Use `ApplicabilityFitMap` to scope which mismatch is surfaced and which adaptation direction is practical. It classifies already detected mismatches and must not create, suppress, or terminalize mismatch tasks.
16. **All certificate-passing mismatches remain tracked**: Initial and emerged mismatches that pass the fail-closed deficit-fit certificate are registered before fit-map prioritization. Fit categories affect selection order and fit-basis wording only; they never remove a registered mismatch from convergence accounting. (The certificate is the one legitimate pre-registration filter — Rule 17; a routed/ambiguous mismatch is handed forward or split, distinct from fit-map suppression, which Rule 15 prohibits.)
17. **Registration-time deficit-fit certificate, transformative revalidation**: Before a detected mismatch enters `pending(Σ)`, it is dispatched through the shared meta-backbone pipeline — KindBinding → fail-closed DeficitFitCertificate → value-space, in that strict order, at registration of both `Mᵢ` (Phase 0) and `Mₑ` (Phase 2 re-scan). (a) **Registration-time, NOT dispatch-first**: the certificate attaches per mismatch at registration time — mismatch detection stays AI-side, there is no up-front kind gate. This is the cycle-emergent counterpart to elicit's per-projection certificate, distinct from bound's dispatch-first up-front sync (which exists only because BoundaryMap is a multi-consumer router). (b) **Fail-closed certificate**: `certificate.status = pass` strictly precedes registration and surfacing; `status = route` drops the mismatch and hands it to the sibling deficit's protocol (per `RoutePair`, TYPES: `/gap`, `/inquire`, `/bound`); a non-atomic mismatch is split into atomic sub-mismatches before certify (never deferred/registered as a compound), and `status = ambiguous` triggers ONE narrowed-scope re-assessment at the fixed detection state ((R, X) for Mᵢ at Phase 0; (R', X) for Mₑ at the Phase 2 re-scan) → pass / `Route(target)` / `Residual` (the deterministic-identical re-assessment bounds it to one attempt), re-certified before registration. The certificate is generated by fitting the mismatch's positive predicate against the documented sibling-deficit scopes — each sibling protocol's `deficit:` declaration plus the registered deficit inventory (sibling-deficit nodes; routing rests on the deficit-scope declarations, not epharmoge edges); the certify step is relay (Extension — the deficit-fit is grounded in the cited deficit-scope declarations, an unclear fit returns `status = ambiguous` → defer rather than a user gate; basis cited at Phase 1 surfacing). (c) **Transformative revalidation (NON-MONOTONE)**: an `Adapt` disposition MUTATES `R` into `R'`, `Eval(R', X)` re-targets the detector at the mutated result, and this can BREED emergent mismatches `Mₑ` that did not exist before — so re-scan is mandatory and `progress(Λ)` may regress. "Transformative revalidation" labels the ADAPT disposition only; every other disposition (`Keep`, `Discard`, `Route`, `Residual`, `Moot`) is contextualize-internal and does not mutate `R` as a succession target. (d) **Backbone discipline**: the schema is ONE canonical definition shared across protocols; epharmoge instantiates only `object_ref` (= Mismatch), `local_value_space` (= the two-axis `Judgment × Disposition` answer space under `well_formed`), the label field's type (`Axis`), and the guard routing targets — same field names, same fail-closed statuses, same certificate-before-registration order.
18. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
19. **Seam relay on declared continuation**: when a user-declared chain or a composition edge this SKILL.md declares names the next protocol, the between-protocol seam after Epharmoge's convergence is relay (Extension) — proceed directly, citing the settling source (the chain declaration or the named edge). This governs only the seam BETWEEN protocols; every Constitution gate inside Epharmoge and the next protocol fires unchanged, and the user can redirect at any turn.
