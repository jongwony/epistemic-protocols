---
name: contextualize
description: "Detect application-context mismatch after execution. Verifies applicability when correct output may not fit the actual context, registering each mismatch through a fail-closed deficit-fit certificate before disposition, producing contextualized execution. Judgment (does the aspect stand?) and disposition (adapt, keep, or withdraw the result) are separate axes, each relay-eligible on its own ground: a relay may close a mismatch only where the close leaves the result untouched, so adapt and withdraw are always user-answered. The transformative revalidation loop is non-monotone — an adapt disposition mutates the evaluation target and can breed emergent mismatches; re-scan is mandatory. Type: (ApplicationDecontextualized, AI, CONTEXTUALIZE, Result) → ContextualizedExecution. Alias: Epharmoge(ἐφαρμογή)."
---

# Epharmoge Protocol

Detect application-context mismatch after execution through AI-guided applicability verification, where correct results that may not fit the actual context are surfaced for user judgment. Type: `(ApplicationDecontextualized, AI, CONTEXTUALIZE, Result) → ContextualizedExecution`.

## Definition

**Epharmoge** (ἐφαρμογή): A dialogical act of verifying that results fit the actual application context — from Aristotle's notion of practical application — resolving the gap between technical correctness and contextual appropriateness through structured mismatch surfacing and user-directed adaptation.

```
── FLOW ──
Epharmoge(R, X) → Eval(R, X) → Mᵢ? →
  Mᵢ = ∅: Qz(zero_mismatch_finding) → Stop → [AcceptNoMismatch: R_final := Some(Λ.R), deactivate (no aspect ¬warranted; execution stands as-is) | Reopen(aspect): reopen_focus := aspect, re-scan Eval focused on it (one attempt: still-∅ → relay finding, deactivate)]
  Mᵢ ≠ ∅: ∀m ∈ Mᵢ: bind_kind(m) → certify(m, local_claims) → keep(status = pass) → Mᵢ_passed →
    Mᵢ_passed = ∅ ∧ no deferred-pending ∧ adjudicated(Λ.R, X) (every flagged aspect carries a certificate-assigned disposition — Route(routed_deficit) or Residual — via the typed disposed(a) predicate; deferred mismatches first get their one bounded re-assessment to pass→registered, route→Route(routed_deficit), or unattributable→Residual): → emit routing recommendations + surface any Residual (each flagged aspect either handed to a local route claim's deficit or unattributable) → R_final := Some(Λ.R) → deactivate (trivial convergence: adjudicated by disposition, Λ.R unadapted)
    Mᵢ_passed ≠ ∅: AssessFit(R, X, Mᵢ_passed) → F → Register(Mᵢ_passed) → SelectNext(pending, Λ.fit_map, Σ) → Mₛ → judgment_settled(Mₛ, Λ.fit_map)? →
      [Some(Overruled): judgment_relay_overruled → report the retraction + the cited fit evidence → close Mₛ as (Overruled, Keep), relay-assigned → NO Qc, no turn yielded, Λ.R untouched → next pending, or converge]
      [Some(Upheld): judgment_relay_upheld → judgment_state := Some((Upheld, basis)), Overruled/Keep dropped from the presented set] →
      -- DISPOSITION HALF. The judgment half above has already run, so the carry below transfers the DISPOSITION only:
      [accepted(aspect(Mₛ)): keep_carried_forward → report the carry + why they accepted it → close Mₛ as Keep with the judgment read off judgment_state (relayed Upheld, else unjudged), relay-assigned → NO Qc, no turn yielded, Λ.R untouched → next pending, or converge]
      Qc(Mₛ scoped by the CURRENT Λ.fit_map, judgment_state) → Stop → A = (j, d) →
      [d = Adapt(direction)] adapt → R' → Λ.R := R' → Eval(Λ.R, X) → Mₑ? → ∀m ∈ Mₑ: bind_kind(m) → certify(m, local_claims) → keep(status = pass) → Mₑ_passed → Register(Mₑ_passed) → AssessFit(Λ.R, X, pending) → F' → (loop: back to Phase 1 above — judgment half, then disposition half — until contextualized)
      [d = Keep] no re-scan, no Mₑ; R_final is bound at convergence, not here → (loop: back to Phase 1 above)
      [d = Discard(replacement)] R_final := replacement, every mismatch REMAINING pending → unjudged Moot, no re-scan → deactivate (withdrawal convergence: the evaluated target is withdrawn; the replacement is carried, not adjudicated)
    (at any Qc, a free-response "keep the rest as-is" closes every pending mismatch with an unjudged Keep — except one whose judgment was relayed this cycle, which keeps that verdict and its cited basis — and converges: Phase 1 → keep_all_remaining)

── MORPHISM ──
(R, X)
  → evaluate(result, context)          -- detect applicability mismatch
  → bind_kind(mismatch) → certify(mismatch, local_claims) -- shared meta-backbone: bind each mismatch as a kind, certify deficit fit (fail-closed) at REGISTRATION against the claims inscribed in this SKILL.md, BEFORE it enters the pending/disposition flow
  → assess_fit(result, context, mismatches) -- sort applicability fit before user judgment
  → surface(fit_scoped_mismatch) -- present mismatch with fit basis and evidence
  → judge(mismatch) → dispose(result, judgment, disposition) -- TWO AXES: whether the flagged aspect stands, then what becomes of the result (adapt / keep / discard)
  → ContextualizedExecution
requires: mismatch_detected(R, X)       -- runtime checkpoint (Phase 0)
deficit:  ApplicationDecontextualized    -- activation precondition (Layer 1/2); the certificate's own_claim deficit for in-scope mismatches
preserves: X                             -- application context is fixed reference; morphism transforms R only
invariant: Applicability over Correctness
invariant: certificate-before-registration  -- DeficitFitCertificate.status = pass strictly precedes registering a mismatch into pending(Σ) (shared meta-backbone order, at registration of both Mᵢ and Mₑ)
invariant: transformative revalidation (NON-MONOTONE) -- an Adapt disposition mutates the Eval(R, X) target into R', breeding emergent mismatches into Mₑ; re-scan mandatory; progress(Λ) may regress
invariant: judgment-disposition separation -- the judgment (does the aspect stand?) and the disposition (what becomes of the result) are separate answers, each relay-eligible on its own ground: the judgment on cited evidence, the disposition on the user's own prior answer for that aspect
invariant: relay closes only what leaves the artifact unchanged -- a relay may close a mismatch only where the close changes nothing about the result

── TYPES ──
R      = Result to be evaluated (source-agnostic: AI output, analysis conclusion, decision outcome, or any completed work product)
           -- Input type: morphism processes R uniformly; enumeration scopes the definition, not behavioral dispatch
X      = Application context (environment, constraints, user situation)
Eval   = Applicability evaluation: (R, X) → Set(Mismatch)
Mismatch = { aspect: String, description: String, evidence: String, severity: Severity, origin: Origin, kind_binding: KindBinding, certificate: DeficitFitCertificate }
                 -- object_ref: the per-mismatch anchor the certificate evaluates and the value-space binds over (epharmoge-local instantiation of the shared backbone's object_ref)
                 -- the mismatch's kind/domain is carried by kind_binding.label (Axis = String, emergent) — the single source of the kind label
Origin ∈ {Initial, Emerged(aspect), Persisting}                -- mismatch provenance: initial scan, spawned by adapting parent aspect, or an aspect that ALREADY
                                                               -- carried a DispositionRecord and re-registered across TARGET SUCCESSION. Persisting is a causal
                                                               -- NEGATIVE: the aspect existed before the latest Adapt, so it is outside the Emerged chain
Severity ∈ {Critical, Significant, Minor}                      -- Significant requires demonstrable behavioral impact (current-session task graph / downstream protocol activations); see Rule 12

-- Shared meta-backbone (KIND dispatch, registration-time / cycle-emergent). One canonical schema; epharmoge-local instantiation ONLY for object_ref (= Mismatch), local_value_space (= the two-axis answer space Judgment × Disposition under well_formed), the label field's type (Axis), the own claim, and the local route claims.
KindBinding    = { label: Axis, positive_predicate: String, evidence: Set(Evidence), origin ∈ {seed, emergent}, atomicity ∈ {atomic, non-atomic} }
                 -- captures the mismatch as a kind; if atomicity = non-atomic (the mismatch bundles two distinct aspects) → split BEFORE certify (no registration, no surfacing on a compound mismatch)
OwnClaim       = { deficit: ApplicationDecontextualized, resolution: ContextualizedExecution, in_scope_if: String }
                 -- the claim epharmoge makes, stated as the WHOLE local morphism: the deficit it takes AND the resolution it produces. A mismatch is claimed here when its positive_predicate instantiates ApplicationDecontextualized AND the local value-space can carry it to ContextualizedExecution — the bare deficit label is a name, the morphism is the predicate
DeficitFitCertificate = { own_claim: OwnClaim, route_claims: List<RouteClaim>, claimed_by: Set(Deficit), evidence: Set(Evidence), status ∈ {pass, route, ambiguous} }
                 -- fail-closed: status ≠ pass BLOCKS registration into pending(Σ) AND surfacing this mismatch for answer. Generated at registration time (Phase 0 for Mᵢ, Phase 2 re-scan for Mₑ) by fitting KindBinding.positive_predicate against own_claim and every route_claim inscribed below — the certificate reads nothing outside this SKILL.md
                 -- claimed_by collects every claim the evidence supports; a SET, so "no claim holds" is the value ∅ rather than a hole in the type
                 -- status = pass: claimed_by = {ApplicationDecontextualized} — the own claim holds alone → eligible for registration
                 -- status = route: claimed_by = {d} for a single route_claim's routed_deficit d (backward misfit) → emit d as the typed handoff, drop the mismatch from registration (it never enters pending(Σ))
                 -- status = ambiguous: |claimed_by| ≠ 1 — several claims hold, or none holds on the evidence at hand → defer the mismatch for ONE bounded re-assessment at the fixed detection state ((R, X) for Mᵢ at Phase 0, (R', X) for Mₑ at the Phase 2 re-scan; AI-side, no user interaction; Phase 0 stays silent for Mᵢ) → pass / route / Residual; never register/surface under ambiguous fit. Which of the three the re-assessment reaches is read at that turn from the session's own context and the user's wording, never fixed here
                 -- what a pass certifies is LOCAL ADMISSIBILITY: epharmoge's own gate governing epharmoge's own activation, not the absence of a claim anywhere in the wider protocol set. Where two protocols' scopes both reach a situation, each protocol's own gate governs
RouteClaim     = (route_if_predicate: String, routed_deficit: Deficit)
                 -- epharmoge-local route claims — BACKWARD misfit the loop routes away rather than adapting in-place. routed_deficit is the BINDING field; the command in parentheses is a non-binding hint for the user, not the relation this guard composes on:
                 --   an unnoticed decision gap rather than a context-fit question        → GapUnnoticed        (hint: /gap)
                 --   a missing pre-execution fact (no observable value, requires supply)  → ContextInsufficient (hint: /inquire)
                 --   undefined convention/dependency ownership for the decision           → BoundaryUndefined   (hint: /bound)
Evidence       = { source: ContextChannel, content: String }
ContextChannel ∈ {Result, Context, Convention, Environment, Session}  -- observable sources for the certificate's deficit-fit basis (R itself + observable X)
V              = bind_value_space : Mismatch → ValueSpace       -- the mismatch's answer constructors; generated ONLY after certificate.status = pass; frozen for the cycle (relay / dead-signal test applied)
ValueSpace     = the mismatch's answer space (local_value_space; epharmoge-local instantiation point) = { (j, d) : j ∈ Judgment, d ∈ {Adapt(direction), Keep, Discard(replacement)}, well_formed(j, d) }
                 -- a two-axis PRODUCT: whether the flagged aspect stands and what becomes of the result are separate answers, so a judgment can be settled without settling the repair
Deficit        = a deficit label a mismatch may be claimed by — epharmoge's own ApplicationDecontextualized, or one of the sibling deficits named in the route claims above. Every label this certificate can assign is inscribed in THIS SKILL.md; nothing outside this file supplies one
Protocol       = the slash command a route claim's user-facing hint names (e.g., /gap, /inquire, /bound) — a hint only; the binding relation the guard composes on is the routed_deficit, never the command
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
Mₑ     = The re-scan registration set from Eval(R', X)         -- each bind_kind'd + certified at re-scan registration (Phase 2). ORIGIN-SPLIT at stamping time:
                                                               --   Emerged(adapted_aspect) — the aspect carries no DispositionRecord; the latest Adapt spawned it
                                                               --   Persisting              — the aspect already carries one and re-registered across the succession
Register = { m ∈ Set(Mismatch) : certificate(m).status = pass } → Set(Task) [Tool: TaskCreate] -- registration of ONLY certificate-passing mismatches as tracked tasks; status ≠ pass blocks registration (fail-closed)
pending(Σ) = Set(Mismatch) where registered task status ≠ completed  -- a routed/ambiguous mismatch never enters pending(Σ); only certificate-passing mismatches are registered
             -- every disposition completes its task, so `completed` is the single resolved status; there is no separate dismissed state (a Keep is a disposition, not a discard of the task)
             -- status↔ledger equivalence, SCOPED TO REGISTERED MISMATCHES: ∀ m registered, task(m).status = completed ⟺ ∃ r ∈ Σ.dispositions : r.mismatch = m. Every close of a REGISTERED mismatch writes the record and completes the task as ONE action — the Phase 2 dispose step (TOOL GROUNDING dispose), the Phase 1 judgment_relay_overruled close, and the keep_all_remaining bulk close alike
             -- a certificate-assigned close (Route, Residual) fires BEFORE registration, so its mismatch has a ledger entry and no task to complete; the unscoped statement that holds for it is the Ledger invariant under MODE STATE
Q      = Applicability inquiry (gate interaction) — the family the two concrete gates below instantiate
Qc     = Q at Phase 1: the MISMATCH gate. Presents the selected mismatch scoped by the CURRENT Λ.fit_map — the evidence, fit basis, and adaptation options the user weighs are read at presentation time, so after an Adapt they describe the advanced target and not the one it replaced; answer type A = (Judgment, Disposition)
Qz     = Q at Phase 0: the ZERO-MISMATCH gate. Presents the zero-mismatch finding; answer type ZeroMismatchConfirmation
Judgment    ∈ {Upheld, Overruled}                              -- EPISTEMIC axis: does the flagged aspect genuinely fail to fit X?
                                                               -- an ESTABLISHED verdict only: reachable via a user answer at Qc or via either judgment_relay arm's cited basis
judgment_settled : Mismatch × F → Option(Judgment)             -- judgment-level entropy → 0 with a citable basis (Rule 10); evaluated against the EVALUATED TARGET Λ.R
              Some(Upheld)    when the evidence admits no reading under which aspect(m) stands warranted in Λ.R
              Some(Overruled) when the evidence admits no reading under which aspect(m) FAILS to stand — the aspect carries an
                              AspectFit in Λ.fit_map.fit_justifications, whose own definition is "warranted in X", and THAT ENTRY'S EVIDENCE clears
                              the no-contrary-reading bar. Membership locates that evidence; the bar above is the condition — an entry whose evidence
                              still admits a reading under which the aspect fails to stand yields None and the judgment stays the user's
              None            otherwise: the evidence admits more than one reading, so the judgment is the user's
judgment_state = Option((Judgment, basis: String))             -- CYCLE-LOCAL: the relayed judgment for this cycle's Mₛ together with its cited basis
              -- Produced by judgment_relay_upheld, read at the Qc presentation and again at the close that follows (Phase 2 dispose, or the
              --   keep_all_remaining bulk exit), then gone
Disposition ∈ {Adapt(direction: String), Keep, Discard(replacement: Option(Result)), Route(routed_deficit: Deficit), Residual, Moot}
              -- REPAIR axis: what becomes of the result, and how this mismatch is closed
              -- Discard's payload is Option(Result): Some(r) when something takes the withdrawn result's place, None when the withdrawal leaves nothing behind
              --   user-answered at Phase 1        : Adapt(direction), Keep, Discard(replacement)
              --   relay-assigned at Phase 1       : Keep — and ONLY Keep, from either producer, both of which edit nothing:
              --     judgment_relay_overruled — well_formed forces the pairing once the evidence settles Overruled
              --     keep_carried_forward     — the user already answered Keep for this aspect earlier in this RUN
              --   certificate-assigned at registration (never surfaced for answer): Route(routed_deficit), Residual
              --   loop-assigned                   : Moot (a Discard withdrew the Eval target while this mismatch was still pending)
              -- Route/Residual live on THIS axis, so the convergence predicate quantifies over one disposition ledger
A      = Answer = (j: Judgment, d: Disposition) where d ∈ {Adapt(direction), Keep, Discard(replacement)}
         -- A ∈ V; drawn from the mismatch's value-space (local_value_space = the two-axis space above)
         -- PRODUCED AT Qc ONLY. Both Phase 1 relay closes write their DispositionRecord straight to the ledger instead, which is what lets
         --   keep_carried_forward close on an unjudged Keep — a verdict j: Judgment cannot express and Option(Judgment) carries
well_formed(j, d) =                                            -- governs the ANSWER space (what Qc may present, and which pairings a relay close may write); an unjudged close has no pair to check here and is governed by the ledger constraint below
    (j = Overruled ⟹ d = Keep)                                 -- an overruled aspect leaves R untouched: nothing to repair
  -- Upheld × Keep is a REACHABLE and distinct state: the mismatch stands and the user accepts the result anyway (an accepted residual)
  -- Route/Residual/Moot are never user answers; their judgment status is constrained at the record level
ZeroMismatchConfirmation = user's answer to a zero-mismatch finding ∈ {AcceptNoMismatch, Reopen(aspect)}
         -- AcceptNoMismatch accepts that no aspect is unwarranted (Rule 9); Reopen names an aspect the Phase 0 scan missed, re-entering Eval focused on it
R'     = Result after an Adapt disposition -- temporal succession of R; the Eval target the non-monotone re-scan re-aims at. Λ.R is re-bound to it (MODE STATE), so the EVALUATED TARGET is always Λ.R
R_final : Option(Result) = the verdict's target field — what the user is left with. Some(Λ.R) on every non-withdrawal path (the evaluated target, adapted or not), or the Discard's replacement payload on the withdrawal path (None when that withdrawal left nothing in its place). Option-valued because "no result survives" is a reachable success state, not an error
         -- DISTINCT from the evaluated target Λ.R, and only on the withdrawal path do the two come apart
DispositionRecord = { mismatch: Mismatch, judgment: Option(Judgment), judgment_by ∈ {user, relay, unjudged},
                      disposition: Disposition, assigned_by ∈ {user, certificate, loop, relay},
                      judgment_basis: String, disposition_basis: String }
         -- ONE ledger entry per closed mismatch. routed / residual / moot are VIEWS over the ledger
         -- judgment is Option-valued: a mismatch can be CLOSED without ever being JUDGED
         -- ONE GROUND PER AXIS: why the aspect stands or fails, and why it is disposed of this way, are different claims with different
         --   producers — the verdict's ground is cited by whoever settled the verdict, the disposition's by whoever assigned it. A single
         --   fused ground would silently drop one of the two wherever the axes were settled separately, and every later reader of a carried
         --   record wants the DISPOSITION half specifically. They coincide only where one follows from the other (judgment_relay_overruled)
         -- record well-formedness:
         --   judgment_by = user      ⟹ judgment = Some(_)                                  -- answered at Qc
         --   judgment_by = relay     ⟹ judgment = Some(_) ∧ judgment_basis ≠ ""            -- either judgment_relay arm; the cited basis is what makes the verdict checkable
         --     Some(Upheld)   from judgment_relay_upheld — the disposition beside it is still whatever the user then answered
         --     Some(Overruled) from judgment_relay_overruled — necessarily paired with Keep, and with assigned_by = relay
         --   judgment_by = unjudged  ⟹ judgment = None ∧ judgment_basis = ""               -- no verdict was reached, so there is no verdict to ground
         --   disposition ∈ {Route(_), Residual, Moot} ⟹ judgment_by = unjudged
         --   assigned_by = user      ⟹ disposition ∈ {Adapt(_), Keep, Discard(_)}          -- per-mismatch at Qc, or the bulk keep-all-remaining exit
         --   assigned_by = relay     ⟹ disposition = Keep ∧ disposition_basis ≠ ""           -- two producers, each reporting before it writes:
         --     judgment_relay_overruled — judgment_by = relay ∧ judgment = Some(Overruled); reports the retraction and its basis
         --     keep_carried_forward     — judgment_by = relay ∧ judgment = Some(Upheld) when this cycle's judgment_state settled it, else
         --       judgment_by = unjudged ∧ judgment = None. ONLY the disposition is carried from the prior record; the judgment comes from
         --       the CURRENT target, so the rows above discharge on this cycle's evidence rather than on a verdict about an earlier target
         --   assigned_by = certificate ⟹ disposition ∈ {Route(_), Residual}
         --   assigned_by = loop      ⟹ disposition = Moot                                   -- withdrawal fallout
ApplicabilityVerdict = { target: R_final, dispositions: List(DispositionRecord), scan_count: Nat }
         -- the protocol's terminal object: the result TOGETHER WITH how every flagged aspect was closed.
         -- Keep, Discard, Route, Residual and Moot are terminal exactly as Adapt is; adaptation is ONE disposition among them
         -- ASSEMBLY — every field has a producing step, and they are not the same step:
         --   target      := R_final, bound by whichever terminal fires (the LOOP convergence step, Phase 2 → withdraw, Phase 1 →
         --                  keep_all_remaining, Phase 0 → confirm_no_mismatch / deactivate, or the ESC exit)
         --   dispositions := Σ.dispositions      -- the ledger as it stands at that terminal, whole; the trace ranges over this same list
         --   scan_count   := Σ.scan_count        -- the re-scan counter Phase 2's Adapt arm increments; this binding is its only reader
         -- The last two are bound identically at EVERY terminal, so a terminal states only its own R_final and assembles the rest from Σ
ContextualizedExecution = ApplicabilityVerdict where (∀ task ∈ registered: task.status = completed) ∧ (Mᵢ = ∅ ⟹ zero-mismatch confirmation obtained: ZeroMismatchConfirmation = AcceptNoMismatch, or Reopen(aspect) whose focused re-scan still yields Mᵢ = ∅ → relay(finding) — Rule 9)
                 -- registered = certificate-passing mismatches only; Route/Residual mismatches are closed by disposition, not adapted in-place
EarlyExit = ApplicabilityVerdict where user_esc  -- non-convergent early exit: R_final := Some(Λ.R) (the evaluated target as it stands, adapted or not) and dispositions closed so far; remaining pending mismatches declared as unresolved residual and left WITHOUT ledger entries, since an exit closes nothing

── PHASE TRANSITIONS ──
Phase 0: R → Eval(R, X) → Mᵢ? → ∀m ∈ Mᵢ: bind_kind(m) → certify(m, local_claims) → (status = pass) → Mᵢ_passed → AssessFit(R, X, Mᵢ_passed) → F → Λ.fit_map := F  -- applicability checkpoint + registration-time KIND dispatch (fail-closed) + fit map (silent); certify runs WITHIN Phase 0, at registration, not as a separate phase
Phase 0 → confirm_no_mismatch: Mᵢ = ∅ → Qz(zero_mismatch_finding) → Stop → ZeroMismatchConfirmation  -- true zero-mismatch case (distinct from the Mᵢ≠∅∧Mᵢ_passed=∅ trivial-convergence-by-routing case below); AcceptNoMismatch → R_final := Some(Λ.R), deactivate (execution stands as-is, Rule 9); Reopen(aspect) → reopen_focus := aspect → re-scan Eval focused on that aspect → reopen_focus := None (cleared after the focused re-scan, either arm); [Mᵢ ≠ ∅] re-enter the Phase 0 pipeline above (bind_kind → certify → Mᵢ_passed → AssessFit → F) and proceed to Phase 1; [Mᵢ still ∅] relay(finding) → R_final := Some(Λ.R), deactivate (one attempt per aspect) [Tool]
Phase 0 → route_away (mismatch-local): certify(m).status = route        -- a local route claim holds the mismatch (backward misfit) → emit that claim's routed_deficit (GapUnnoticed, ContextInsufficient, BoundaryUndefined — with its command hint), close m with DispositionRecord { judgment = None, judgment_by = unjudged, disposition = Route(routed_deficit), assigned_by = certificate, judgment_basis = "", disposition_basis = the matched local route claim }, drop m from registration (m never enters pending(Σ)); scan continues with remaining mismatches
Phase 0 → split (pre-certify): KindBinding.atomicity = non-atomic  -- a compound mismatch bundles two distinct aspects → split into atomic sub-mismatches and re-run bind_kind + certify on each (same Phase 0 pass, before any pass/route/defer decision); recursive until atomic, and terminating because each split strictly decreases the number of bundled aspects. A non-atomic mismatch is split pre-registration, never deferred or registered as a compound
Phase 0 → defer (mismatch-local): certify(m).status = ambiguous  -- |claimed_by| ≠ 1, several claims holding or none; Λ.deferred := Λ.deferred ∪ {m} (the write the "no deferred-pending" guard reads; m is removed from Λ.deferred the moment its bounded re-assessment resolves, on every arm — pass, route, or Residual) → ONE narrowed-scope re-assessment at the fixed Phase-0 (R, X) (AI-side, no user interaction — Phase 0 stays silent), then re-certify. (R, X) is fixed in Phase 0, so a re-assessment is deterministic-identical → the bound is ONE attempt: resolves to pass (→ registered), route (→ Route(routed_deficit) disposition), or — if it STAYS ambiguous — Residual: close m with DispositionRecord { judgment = None, judgment_by = unjudged, disposition = Residual, assigned_by = certificate, judgment_basis = "", disposition_basis = the unresolved attribution as this re-assessment found it — several claims standing, or none } (never registered into pending(Σ), adjudicated by disposed(aspect(m)), surfaced as residual, non-blocking). deferred-pending therefore always clears (no Phase-0 loop)
Phase 0 → deactivate (no in-scope mismatch): Mᵢ ≠ ∅ ∧ Mᵢ_passed = ∅ ∧ adjudicated(Λ.R, X) ∧ no deferred-pending ∧ pending(Σ) = ∅  -- mismatches WERE detected but EVERY one carries a certificate-assigned disposition, Route(routed_deficit) or Residual (discharged via disposed(a), CONVERGENCE) — no mismatch the own claim holds enters the disposition loop → trivial convergence: R_final := Some(Λ.R), emit the routed deficits with their command hints (/gap, /inquire, /bound) and deactivate without adapting Λ.R. DEFERRED mismatches (atomic, status = ambiguous) do NOT satisfy this path: each first gets its ONE bounded re-assessment via Phase 0 → defer, resolving to pass (→ registered into pending(Σ)), route (→ Route(routed_deficit)), or Residual. Trivial convergence fires once NONE remain deferred-pending and every flagged aspect is disposed
Phase 1: Mᵢ_passed → TaskCreate[all certificate-passing initial mismatches] → pending(Σ) → SelectNext(pending, Λ.fit_map, Σ) → Mₛ → judgment_settled(Mₛ, Λ.fit_map)? →  -- register all certificate-passing initial mismatches, surface selected mismatch with fit basis [Tool]; reached only when Mᵢ_passed ≠ ∅. TWO-LEVEL DISPATCH — the JUDGMENT half resolves first, then the DISPOSITION half; the gate is not on the common path:
         JUDGMENT HALF, off judgment_settled(Mₛ, Λ.fit_map) — always computed against the CURRENT Λ.R and Λ.fit_map:
         [Some(Overruled)] judgment_relay_overruled (below) closes BOTH halves — NO Qc, no Stop, no turn yielded; control returns to SelectNext over the remaining pending(Σ)
         [Some(Upheld)]    judgment_relay_upheld (below) settles the judgment half: judgment_state := Some((Upheld, basis)) → DISPOSITION HALF
         [None]            no judgment settles; judgment_state := None → DISPOSITION HALF
         DISPOSITION HALF, reached from either arm above:
         [accepted(aspect(Mₛ))] keep_carried_forward (below) closes Mₛ with the carried Keep — NO Qc, no Stop, no turn yielded; control returns to SelectNext. The JUDGMENT it records is whatever judgment_state holds for THIS cycle, never the prior record's
         [otherwise]            Qc(Mₛ scoped by the CURRENT Λ.fit_map, evidence, judgment_state) → Stop → A = (j, d)  -- the disposition is user-answered, and the judgment half with it when judgment_state = None
Phase 1 → judgment_relay_upheld (mismatch-local): judgment_settled(Mₛ, Λ.fit_map) = Some(Upheld) — the evidence for ¬warranted(aspect(Mₛ), Λ.R, X) admits no reading under which the aspect stands warranted; judgment-level entropy → 0 with a citable basis (Rule 10)  -- relay j := Upheld with the basis cited: judgment_state := Some((Upheld, basis)), which the close downstream reads as judgment_by = relay. Drop the Overruled/Keep pairing from the presented set and hand to the DISPOSITION HALF, which the dispatcher above routes: the carry closes it where accepted(aspect(Mₛ)) holds, else Qc fires and yields turn. The turn is not yielded for the judgment half. When judgment_settled(Mₛ, Λ.fit_map) = None, judgment_state := None, the full two-axis set is presented, and j is user-answered (judgment_by = user)
Phase 1 → judgment_relay_overruled (mismatch-local, CLOSES the mismatch): judgment_settled(Mₛ, Λ.fit_map) = Some(Overruled) — the evidence admits no reading under which aspect(Mₛ) FAILS to stand, read off that aspect's own AspectFit entry in Λ.fit_map.fit_justifications and the evidence it cites (the membership/condition distinction: TYPES). well_formed(Overruled, d) leaves d = Keep as the sole pairing, so the answer set has collapsed to one and no gate is owed (Rule 10)  -- REQUIRED FIRST: report the flagged aspect, that it is being retracted, and the cited fit evidence, as text. THEN close Mₛ with DispositionRecord { judgment = Some(Overruled), judgment_by = relay, disposition = Keep, assigned_by = relay, judgment_basis = the cited fit evidence, disposition_basis = that same evidence — the ONE close where the two grounds coincide, because Keep is what well_formed leaves once the verdict is Overruled } AND TaskUpdate(Mₛ, completed) as ONE step, so Mₛ leaves pending(Σ) before anything else runs. Λ.R is untouched, no Mₑ, no re-scan; the turn is NOT yielded. Continue to SelectNext over the remaining pending(Σ) — or, when this close empties it, to convergence (CONVERGENCE: gateless convergence) [Tool]
Phase 1 → keep_carried_forward (DISPOSITION half, mismatch-local, CLOSES the mismatch): accepted(aspect(Mₛ)) — the user already answered Keep for this aspect earlier in THIS RUN, and it re-registered against the advanced target. The DISPOSITION axis is settled by that prior utterance rather than by evidence, so no gate is owed (Rule 20). The JUDGMENT axis is NOT carried: it is target-relative, so this cycle's judgment_state supplies it — the prior record's verdict was about a target the run has moved past  -- REQUIRED FIRST: report the aspect, that its earlier acceptance is being carried to the current target, and the prior record's disposition_basis — why they accepted it, never why the mismatch stood — as text. THEN close Mₛ with DispositionRecord { judgment = Some(Upheld) when judgment_state = Some((Upheld, _)) for this cycle else None, judgment_by = relay in that case else unjudged, disposition = Keep, assigned_by = relay, judgment_basis = this cycle's relayed basis in that case else "", disposition_basis = the PRIOR record's disposition_basis — why the user accepted the aspect, which is the half that carries } AND TaskUpdate(Mₛ, completed) as ONE step, so Mₛ leaves pending(Σ) before anything else runs. Λ.R is untouched, no Mₑ, no re-scan; the turn is NOT yielded. Continue to SelectNext over the remaining pending(Σ) — or, when this close empties it, to convergence (CONVERGENCE: gateless convergence) [Tool]
Phase 1 → keep_all_remaining (bulk exit): the user declares the remaining mismatches acceptable as-is rather than answering them one at a time  -- guard: pending(Σ) ≠ ∅ ∧ the declaration is a free-response at Qc. EVERY m ∈ pending(Σ) is closed with DispositionRecord { judgment = None, judgment_by = unjudged, disposition = Keep, assigned_by = user, judgment_basis = "", disposition_basis = the bulk declaration } and TaskUpdate(m, completed) — EXCEPT Mₛ when judgment_state = Some((Upheld, basis)) for this cycle, which is closed with { judgment = Some(Upheld), judgment_by = relay, disposition = Keep, assigned_by = user, judgment_basis = that cited basis, disposition_basis = the bulk declaration }. The declaration disposes of every mismatch, so it grounds the disposition half everywhere; a relayed verdict grounds only its own half, on the one mismatch it was relayed for. (Only the Upheld arm can reach here: judgment_relay_overruled has already closed its mismatch and left pending(Σ).) R_final := Some(Λ.R); deactivate [Tool]
Phase 2: A = (j, d) → dispose(Mₛ, j, d) → [ORDER: dispose appends DispositionRecord{ mismatch = Mₛ, judgment = Some(j), judgment_by = relay when judgment_state = Some((Upheld, _)) for this cycle else user, disposition = d, assigned_by = user, judgment_basis = that relayed basis when the verdict was relayed, else the ground the user gave for the VERDICT, disposition_basis = the ground the user gave for the DISPOSITION } to Σ.dispositions AND TaskUpdate(Mₛ, completed) as ONE step, so Mₛ leaves pending(Σ) before any arm below runs. Reached only from Qc; the relay-assigned close is written by judgment_relay_overruled at Phase 1] →
         [d = Adapt(direction)] adapt(direction, Λ.R) → R' [mutating — transformative revalidation] → Λ.R := R' [TARGET SUCCESSION] → Eval(Λ.R, X) → Mₑ? → ∀m ∈ Mₑ: bind_kind(m) → certify(m, local_claims) → (status = pass) → Mₑ_passed → TaskCreate[all Mₑ_passed] → pending(Σ) → AssessFit(Λ.R, X, pending) → F' → Λ.fit_map := F' → Σ.scan_count += 1
         [d = Keep] non-mutating adjudication — no adapt, no Mₑ, no re-scan; Λ.R stands as whatever earlier Adapt dispositions left it as
         [d = Discard(replacement)] → Phase 2 → withdraw (below)
         -- Adapt alone advances the evaluated target as a succession of it (Λ.R := R'), which is what triggers the re-scan + registration-time certify of emerged mismatches; the re-scan table is LOOP's [Tool]
Phase 2 → withdraw (run-terminal): d = Discard(replacement) ∧ j = Upheld  -- the user upholds the mismatch and WITHDRAWS the evaluated result instead of adapting it. discard(replacement, Λ.R) [mutating, TOOL GROUNDING discard → Edit/Write: the artifact is actually withdrawn and the replacement put in its place, or removed outright when replacement = None] → THEN R_final := replacement (already Option(Result): None when the withdrawal leaves nothing in its place); Λ.withdrawn := Some((Mₛ, replacement)); then EVERY mismatch REMAINING in pending(Σ) — Mₛ already left it at the dispose step above, so it cannot be closed twice — is closed with DispositionRecord { judgment = None, judgment_by = unjudged, disposition = Moot, assigned_by = loop, judgment_basis = "", disposition_basis = the withdrawal record } and TaskUpdate(completed). NO re-scan; deactivate. The adjudication claim stays on Λ.R (the object actually evaluated): every flagged aspect of it carries a ledger entry, and NO claim is made about the replacement
Phase 2 → route_away (mismatch-local): certify(m).status = route        -- an emerged mismatch a local route claim holds → emit that claim's routed_deficit, close m with disposition Route(routed_deficit) (assigned_by = certificate), drop it from registration; re-scan continues
Phase 2 → split (pre-certify): KindBinding.atomicity = non-atomic  -- emerged compound mismatch → split into atomic sub-mismatches, re-bind_kind + certify each (same re-scan pass); never deferred/registered as a compound
Phase 2 → defer (mismatch-local): certify(m).status = ambiguous  -- |claimed_by| ≠ 1; Λ.deferred := Λ.deferred ∪ {m} (same write as the Phase 0 arm, same removal on resolution) → emerged (atomic) mismatch whose claims do not resolve to one → ONE bounded narrowed-scope re-assessment at the fixed re-scan (R', X) (deterministic-identical → one attempt) → pass (→ registered) / route (→ Route(routed_deficit)) / Residual (closed with assigned_by = certificate), re-certify BEFORE registration

── LOOP ──
Transformative revalidation (NON-MONOTONE): this loop mutates the very object its detector evaluates. An Adapt disposition produces R', and Eval(R', X) re-targets the detector at the mutated result — so an adaptation can BREED new mismatches Mₑ that did not exist before. "Transformative revalidation" labels the ADAPT disposition; the table below gives each disposition's re-scan behavior.
After Phase 2, re-scan is disposition-keyed, not answer-keyed:
  Adapt(direction)      → re-scan R' against X for remaining AND newly emerged mismatches (mandatory)
  Keep                  → non-mutating; breeds no Mₑ; no re-scan
  Discard(replacement)  → the Eval target is gone; no re-scan is possible or meaningful; run terminates via Phase 2 → withdraw
  Route / Residual      → certificate-assigned, never surfaced for answer; the scan continues with the remaining mismatches
A relay-assigned Keep never reaches Phase 2 at all: judgment_relay_overruled and keep_carried_forward each close their mismatch inside Phase 1, non-mutating, breeding no Mₑ and triggering no re-scan, and control returns directly to SelectNext over the remaining pending(Σ).
Mₑ is the Eval output minus what already sits in pending(Σ). An aspect CLOSED earlier in this run is not excluded from it: it re-registers, which un-disposes it (disposed(a), CONVERGENCE) so no stale record can carry a terminal, and Phase 1 closes it by keep_carried_forward wherever the user already accepted it. It registers with origin = Persisting, so it stays outside the Emerged chain the convergence output reads.
Bind + certify each newly emerged mismatch at registration (fail-closed): only certificate-passing emerged mismatches (Mₑ_passed) are registered into pending(Σ); a routed mismatch is closed with Route(routed_deficit) and handed to that deficit (GapUnnoticed, ContextInsufficient, BoundaryUndefined — command hints /gap, /inquire, /bound); a non-atomic compound mismatch is split into atomic sub-mismatches and re-certified; an atomic ambiguous mismatch gets its one bounded re-assessment at the fixed re-scan (R', X) → pass / route / Residual, before registration. AssessFit classifies tracked mismatches but never suppresses them.
Recompute the fit map over pending(Σ) and re-bind Λ.fit_map to it before selecting the next surfaced mismatch, even when Mₑ_passed = ∅. FIT-MAP SUCCESSION, the counterpart of TARGET SUCCESSION: every reader takes Λ.fit_map at the moment it reads, never a fit map computed against an earlier Λ.R.
CHECKED IN THIS ORDER:
  1. If pending(Σ) non-empty: return to Phase 1 (SelectNext by severity, then FitRank, then oldest registered task).
  2. Otherwise, if adjudicated(Λ.R, X): every flagged aspect carries a DispositionRecord → [Λ.withdrawn = None] R_final := Some(Λ.R) → assemble the verdict (below) → convergence.
Step 1 runs first so a re-registered aspect can never be read past. Step 2 is the SOLE R_final binding on the ordinary path — a Keep answered mid-loop leaves it unbound, since a later Adapt still advances Λ.R; the withdrawal path is excluded because Phase 2 → withdraw already bound R_final to the replacement
progress(Λ) MAY REGRESS: re-scan over a mutated R' can register newly certified mismatches, so the disposed/total ratio is non-monotone — expected, not an error.
User can exit at Phase 1 by declaring the remaining mismatches acceptable as-is (Phase 1 → keep_all_remaining, which closes each with an unjudged Keep — except a mismatch whose judgment was relayed this cycle, which keeps that verdict and its cited basis), or by Esc.
Continue until: contextualized(Λ.R) OR user ESC (EarlyExit, not ContextualizedExecution).
Mode remains active until convergence or explicit user exit (Esc).
On user ESC: R_final := Some(Λ.R); present partial transformation trace ranging over Σ.dispositions as accumulated so far, then declare remaining pending(Σ) mismatches as unresolved residual — they receive no DispositionRecord, which is why an exit yields EarlyExit rather than ContextualizedExecution (disposed(a) fails for them).
Convergence evidence: At adjudicated(Λ.R, X), present the transformation trace ranging over Σ.dispositions — ONE ledger, since every close writes a record there whoever assigned it. CONSOLIDATED PER ASPECT: an aspect re-registered across TARGET SUCCESSION carries several records, and the trace shows it ONCE, at its final close, noting how many targets an acceptance was carried across. The per-cycle records stay in Σ.dispositions for anyone tracing the narrative. For each aspect show (aspect → judgment → disposition) at that final close, reading:
  Upheld → Adapt(direction)     : in-scope, adapted in place — ApplicationDecontextualized(m) resolved by adaptation
  Upheld → Keep                 : in-scope and accepted as-is — an ACCEPTED RESIDUAL, distinct from Overruled → Keep
  Overruled → Keep              : the aspect did not stand; nothing to repair — the user's own retraction, answered at Qc
  Overruled → Keep (relayed)    : the same close reached without a gate, because the fit evidence admitted no other reading (judgment_by = relay, assigned_by = relay, basis cited). Printed apart from the row above so the user can tell which retractions were theirs and which the protocol made on cited evidence
  Upheld → Keep (carried)       : the DISPOSITION the user gave earlier, re-applied to the advanced target without a gate (assigned_by = relay, disposition_basis = why they accepted it). The Upheld is THIS target's own settled judgment, relayed with its cited basis — not the earlier verdict. Printed apart from the row above so the user can tell which acceptances they gave against this target and which were carried to it
  (unjudged) → Keep (carried)   : the same carry where this target settles no judgment — the disposition transfers, and NO verdict is claimed for the current target
  Upheld → Discard(replacement) : the evaluated result was withdrawn rather than adapted; the replacement is what the user is left with (not itself adjudicated)
  (unjudged) → Keep             : closed by a bulk keep-all-remaining declaration — disposed without an individual verdict. The one mismatch whose judgment was relayed that cycle prints as Upheld → Keep instead
  (unjudged) → Route(routed_deficit) : a local route claim holds m — an attribution finding, not a verdict on fit
  (unjudged) → Residual         : unattributable after its one bounded re-assessment; surfaced as a non-blocking residual
  (unjudged) → Moot             : still pending when a Discard withdrew the target; never judged
Convergence is demonstrated, not asserted.

── CONVERGENCE ──
-- DOMAIN NOTE: applicable / warranted / adjudicated / contextualized all range over the EVALUATED TARGET Λ.R — always a Result, never
--   Option-valued — and never over ApplicabilityVerdict.target. The two coincide on every path except withdrawal, where target is the
--   replacement and Λ.R is the withdrawn result. The protocol claims fit only for the object it actually evaluated.
applicable(Λ.R, X) = ∀ aspect(a, Λ.R, X) : warranted(a, Λ.R, X)
warranted(a, R, X) = correct(R) ∧ fits(R, X)                -- correctness AND contextual fit required (not material conditional)
disposed(a)        = (∃ r ∈ Σ.dispositions : aspect(r.mismatch) = a) ∧ a ∉ { aspect(m) : m ∈ pending(Σ) }
                     -- ONE disjunct covering every way a flagged aspect is closed — Adapt, Keep, Discard, Route, Residual, Moot — since all
                     -- six are members of the Disposition axis and every close writes one ledger entry
                     -- SECOND CONJUNCT: re-registration UN-DISPOSES the aspect. A record is written about the target as it stood when the
                     -- close happened, and TARGET SUCCESSION then advances Λ.R past it, so an aspect adapted at one cycle and re-registered
                     -- at the next is pending again rather than disposed from its stale record
                     -- aspect is a String label, so this discharges by label equality, assuming aspects stay stable and uniquely labelled
                     -- across the R→R' trajectory
accepted(a)        = ∃ r ∈ Σ.dispositions : aspect(r.mismatch) = a ∧ r.disposition = Keep ∧ r.judgment ∈ {Some(Upheld), None}
                     -- the user's own acceptance of this aspect: answered at Qc, or declared in the bulk keep-all-remaining exit.
                     -- Read as the guard on Phase 1 → keep_carried_forward, which closes a re-registered accepted aspect without a gate
                     -- RUN-SCOPED, and monotone WITHIN a run: Σ is bound fresh at activation (MODE STATE, INITIAL BINDING) and the ledger
                     -- only appends, so once this holds for an aspect it holds for the rest of the run — that aspect reaches no further Qc,
                     -- and Adapt is out of its reach until the protocol is re-entered. THIS guard's exit: re-entering on the same result
                     -- rebuilds Σ, so accepted(a) is false again and the aspect returns to the gate. judgment_relay_overruled does NOT share
                     -- it — that guard reads Λ.fit_map, never Σ (where ITS correction lives: TOOL GROUNDING, judgment_relay_overruled)
adjudicated(Λ.R, X) = ∀ aspect(a, Λ.R, X) : warranted(a, Λ.R, X) ∨ disposed(a)
contextualized(Λ.R) = adjudicated(Λ.R, X)
trivial convergence (all-disposed at registration): when Mᵢ ≠ ∅ but Mᵢ_passed = ∅ AND every flagged aspect is closed with a certificate-assigned disposition, Route(routed_deficit) or Residual — aspect-keyed via disposed(a) over the atomic (post-split) aspects — (no deferred-pending, pending(Σ) = ∅), adjudicated(Λ.R, X) holds by disposed(a) for every flagged aspect (and warranted for the rest) — Λ.R is unadapted, R_final := Some(Λ.R), and contextualized(Λ.R) holds. This is the Phase 0 → deactivate (all-routed) path. DEFERRED mismatches carry no ledger entry yet, so disposed(a) does not cover them and they do not satisfy this. Distinct from the no-mismatch case (Mᵢ = ∅, every aspect warranted from the start) — here aspects were flagged but every one is held by a local route claim rather than by the own claim
gateless convergence: when either Phase 1 relay — judgment_relay_overruled or keep_carried_forward — closes the last mismatch in pending(Σ), adjudicated(Λ.R, X) follows from disposed(a) for every flagged aspect, and R_final := Some(Λ.R) — the ordinary non-withdrawal result equation, reached without a final gate. Neither relay close performs an adaptation, so Λ.R stands as whatever earlier Adapt dispositions left it as
withdrawal convergence: when a Discard(replacement) disposition fires (Phase 2 → withdraw), every mismatch remaining in pending(Σ) is closed as Moot, so disposed(a) holds for every flagged aspect of Λ.R and adjudicated(Λ.R, X) follows without any re-scan. R_final := replacement records what the user is left with, and the verdict makes NO adjudication claim about it — the protocol never evaluated it. Re-entering Epharmoge with the replacement as R is how it gets checked
certificate gate:  every registered mismatch carried certificate.status = pass (fail-closed, at registration) — routed/ambiguous mismatches never entered pending(Σ), so an adapted R' is assembled only from mismatches the own claim holds (claimed_by = {ApplicationDecontextualized}), fit-certified; backward misfit was handed forward as its routed_deficit (GapUnnoticed, ContextInsufficient, BoundaryUndefined), not adapted in-place. The pass certifies LOCAL admissibility — epharmoge's own gate over epharmoge's own activation — not the absence of a claim anywhere in the wider protocol set
-- stratification: applicable(Λ.R, X) ⊆ adjudicated(Λ.R, X)
-- operational proxy: ∀ registered task: status = completed ⟹ adjudicated(Λ.R, X) ⟹ contextualized(Λ.R)
--   the proxy rests on the status↔ledger equivalence at pending(Σ), scoped to registered mismatches. Certificate-assigned closes carry no
--   task and are covered by disposed(a) directly
progress(Λ) = 1 if |total_tasks| = 0 else |resolved_tasks| / |total_tasks|   -- resolved_tasks = registered tasks whose mismatch carries a DispositionRecord in Σ.dispositions (matches the ContextualizedExecution resolution contract)   -- total_tasks = 0 (Mᵢ = ∅, or Mᵢ≠∅∧Mᵢ_passed=∅ trivial convergence via routing) is fully converged, not undefined — the Mᵢ = ∅ leg only after the Rule 9 zero-mismatch confirmation (AcceptNoMismatch, or Reopen whose focused re-scan stays ∅); otherwise NON-MONOTONE: may regress when re-scan over the mutated R' registers newly certified mismatches (transformative-revalidation signature)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Eval   (sense)   → Internal analysis (no external tool)
Qz / ZeroMismatchConfirm (constitution) → present (conditional: Mᵢ = ∅; zero-mismatch finding + reasoning; AcceptNoMismatch / Reopen(aspect) — Rule 9)
reopen_relay (extension) → TextPresent+Proceed (conditional: Reopen(aspect) focused re-scan still yields Mᵢ = ∅ → relay the still-zero finding and deactivate; one attempt per aspect, basis = the focused Eval re-scan)
reopen_focus (track) → Internal state update (set at Reopen(aspect), threads the focused Eval re-scan, cleared after the re-scan — consumed once, either arm)
bind_kind (sense)   → Internal analysis (capture each detected mismatch as a KindBinding {label, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity}; non-atomic mismatch → split before certify)
certify (extension) → Internal analysis (fail-closed DeficitFitCertificate; fit of KindBinding.positive_predicate against the own claim and the route claims inscribed in this SKILL.md, reading nothing outside this file: claimed_by = {ApplicationDecontextualized} when the own claim holds alone; status = pass | route | ambiguous; basis = the cited claim fit, shown at the mismatch's Phase 1 surfacing. Relay (Extension): the fit is grounded in a citable source, and an unclear fit returns status = ambiguous → defer. Runs at registration time — within Phase 0 for Mᵢ, within Phase 2 re-scan for Mₑ — BEFORE the mismatch enters pending(Σ))
AssessFit (sense) → Internal analysis (no external tool)
judgment_relay_upheld (extension) → TextPresent+Proceed (conditional: judgment_settled(Mₛ, Λ.fit_map) = Some(Upheld) — the evidence for ¬warranted(aspect(Mₛ), Λ.R, X) admits no reading under which the aspect stands warranted, i.e. judgment-level entropy → 0 with a citable basis, Rule 10. Relay j := Upheld with the basis shown (judgment_state := Some((Upheld, basis))), drop the Overruled/Keep pairing from the presented set, and PROCEED to the DISPOSITION HALF without yielding the turn for the judgment half. Covers the JUDGMENT axis only — the Phase 1 dispatcher routes that half, to keep_carried_forward or to Qc)
judgment_relay_overruled (extension) → TextPresent+Proceed (conditional: judgment_settled(Mₛ, Λ.fit_map) = Some(Overruled) — the evidence admits no reading under which aspect(Mₛ) fails to stand, read off that aspect's AspectFit entry in Λ.fit_map.fit_justifications (the membership/condition distinction: TYPES). well_formed leaves (Overruled, Keep) as the sole pairing, so the option set has collapsed and no gate is owed, Rule 10. REQUIRED: report the flagged aspect, the retraction, and the cited fit evidence as text BEFORE writing anything; a retraction relayed without that report is a protocol violation. Then close Mₛ with an (Overruled, Keep) DispositionRecord (judgment_by = relay, assigned_by = relay) + TaskUpdate(completed) as one step, and PROCEED without yielding the turn. Λ.R is untouched, so no artifact permission is exercised. CORRECTING a disputed retraction is DELEGATED, not compiled: this guard reads Λ.fit_map, derived from (Λ.R, X), so re-entering on the same input reproduces the same close. Within the run the aspect returns to judgment only where a later Adapt re-registers it, and then against the recomputed Λ.fit_map — never on the strength of an objection. What the user reaches for is the interrupt, available throughout the run rather than built per relay (esc, below). This is what makes the report required rather than optional — it puts the reading in front of the user while this close is still unwritten)
keep_carried_forward (extension) → TextPresent+Proceed (conditional: accepted(aspect(Mₛ)), reached at the DISPOSITION half after the judgment half has run — the user answered Keep for this aspect earlier in this run and it re-registered against the advanced target. The disposition is settled by that prior utterance, so the option set carries no live alternative and no gate is owed, Rule 20. REQUIRED: report the aspect, the carry-forward, and the prior record's disposition_basis as text BEFORE writing anything; a carry-forward relayed without that report is a protocol violation. Then close Mₛ with a Keep DispositionRecord whose judgment and judgment_by come from THIS cycle's judgment_state — relayed Some(Upheld), else unjudged None — never from the prior record, and whose disposition_basis is the prior record's, since that is the half being carried (assigned_by = relay) + TaskUpdate(completed) as one step, and PROCEED without yielding the turn. Λ.R is untouched, so no artifact permission is exercised)
Qc     (constitution)    → present (fires wherever the disposition is still open, because there the answer turns on what the user weighs and the turn is owed: Adapt(direction) / Keep / Discard(replacement), with the Overruled/Keep pairing included when the judgment is not settled. Where well_formed has already collapsed the answer to a single pairing that edits nothing, the disposition is not open and that close relays instead — the same test reaching its other value; Esc key → loop termination at LOOP level, not an Answer)
adapt  (transform) → Edit, Write (Adapt(direction) disposition: result adaptation based on user direction)
discard (transform) → Edit, Write (Discard(replacement) disposition: withdraw the result and put the replacement in its place, or remove it outright when the withdrawal leaves nothing behind)
                    -- (transform): tool call that changes existing artifacts; medium-agnostic (files, analysis text, generated content)
route  (extension)   → TextPresent+Proceed (certificate.status = route → emit the matched route claim's routed_deficit as a backward-misfit recommendation: decision gap → GapUnnoticed (hint /gap), missing pre-execution fact → ContextInsufficient (hint /inquire), undefined convention/dependency ownership → BoundaryUndefined (hint /bound); the deficit is read off the matched local route claim, basis cited, and the command travels only as a hint; closes the mismatch with disposition Route(routed_deficit))
dispose (track)  → Internal state update + TaskUpdate, performed as ONE step (append the DispositionRecord for the closed mismatch to Σ.dispositions — user-, relay-, certificate-, or loop-assigned — and complete its task). Every close in the protocol goes through this step, whichever phase invokes it: the record half is unconditional, and the TaskUpdate half fires exactly when the mismatch was REGISTERED. A certificate-assigned close (Route, Residual) runs before registration and so has no task to complete — it appends its record and stops there. For a registered mismatch, doing both halves together is what removes the mismatch from pending(Σ) before any bulk close can reach it. This ledger is what the convergence trace ranges over, and what the terminal verdict's dispositions field is assembled from
keep_all_remaining (track) → Internal state update + TaskUpdate through the dispose step above (no gate opens here: present is already open at Qc, and the declaration arrives as a FREE RESPONSE there rather than as a peer option). On arrival, dispose every m ∈ pending(Σ) with an unjudged Keep (judgment = None) whose disposition_basis is the declaration itself — EXCEPT Mₛ when judgment_state = Some((Upheld, basis)) for this cycle, which additionally carries that verdict, judgment_by = relay, and that cited basis as its judgment_basis — then deactivate. The record shape is the transition's: PHASE TRANSITIONS Phase 1 → keep_all_remaining
Mᵢ/Mₑ (track)   → TaskCreate/TaskUpdate (mismatch tracking with framing visibility; only certificate-passing mismatches are registered)
converge (extension)  → TextPresent+Proceed (convergence evidence trace; proceed with contextualized execution)
esc      (extension)  → TextPresent+Proceed (partial transformation trace + unresolved-mismatch residual declaration; terminate as EarlyExit, not ContextualizedExecution)
Seam transition to a declared next protocol (extension) → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares, settles the next move — proceed directly to it, citing that settling source; every Constitution gate inside Epharmoge and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase,
      R: Result,   -- the CURRENT EVALUATED TARGET, re-bound to R' by each Adapt disposition
                   -- (Phase 2, TARGET SUCCESSION). Every R_final binding and every convergence predicate reads THIS field, so an Adapt
                   -- followed later by a Keep yields the adapted result
      X: Context,
      fit_map: F, state: Σ, active: Bool, cause_tag: String,
      reopen_focus: Option(String),   -- the zero-mismatch Reopen(aspect) focus the Phase 0 scan missed; threads into the focused re-scan, cleared after it; a focused re-scan that still yields Mᵢ = ∅ presents its finding as relay and deactivates (one attempt per aspect — deterministic-identical re-runs are not re-gated, per the re-assessment idiom)
      deferred: Set(Mismatch),   -- WRITTEN by Phase 0 → defer and Phase 2 → defer (∪ {m} on parking, minus m on resolution); READ by the "no deferred-pending" guard on the Phase 0 → deactivate and trivial-convergence paths. ATOMIC mismatches with certificate.status = ambiguous, parked for their ONE bounded narrowed-scope re-assessment against the fixed detection state — (R, X) for an initial mismatch (Phase 0), (R', X) for an emerged mismatch (Phase 2 re-scan). Pre-disposition parking, so a deferred mismatch carries NO ledger entry yet. After the bounded attempt each resolves to pass / Route(routed_deficit) / Residual, so "no deferred-pending" always becomes reachable
      withdrawn: Option((Mismatch, Option(Result))) }   -- set by Phase 2 → withdraw: the mismatch whose Discard withdrew the Eval target, and the replacement that took its place (inner None when the withdrawal left nothing behind). Presence of this field is what makes the run terminal without a re-scan
Σ = { dispositions: List(DispositionRecord), scan_count: Nat }
                 -- the SINGLE disposition ledger. Every close writes here — user-answered, certificate-assigned, or loop-assigned — so the
                 -- convergence trace ranges over one list
                 -- each Mismatch in a record carries its kind_binding + certificate (object_ref = Mismatch)
-- INITIAL BINDING at activation: Λ.R := the result under review; Λ.deferred := ∅; Λ.withdrawn := None; Λ.reopen_focus := None;
--   Σ := { dispositions = [], scan_count = 0 }. Λ.fit_map is bound by the Phase 0 pass (Λ.fit_map := F)
-- judgment_state is CYCLE-LOCAL and holds no field here: produced at Phase 1 by judgment_relay_upheld, read at the Qc presentation and again
--   at the close that follows (Phase 2 dispose, the keep_carried_forward close, or the keep_all_remaining bulk exit), all within one cycle. Where a relayed judgment must
--   survive a session boundary, the channel is the Task the mismatch is already registered under
-- Views over Σ.dispositions (derived, NOT parallel state):
--   routed(Λ)   = { r ∈ Σ.dispositions : r.disposition = Route(_) }
--   residual(Λ) = { r ∈ Σ.dispositions : r.disposition = Residual }
--   moot(Λ)     = { r ∈ Σ.dispositions : r.disposition = Moot }
-- Certificate invariant: ∀ m ∈ pending(Σ) : m.certificate.status = pass (fail-closed — routed/ambiguous mismatches never enter pending(Σ))
-- Ledger invariant: every mismatch leaving pending(Σ), and every mismatch closed at registration, appends exactly one DispositionRecord (no close without a record; no record without a close)

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Mismatch-domain resolution emergent via session context.
certificate-before-registration ∘ transformative-revalidation: the fail-closed certificate order composes with the NON-MONOTONE loop — when an Adapt disposition mutates R and Eval(R', X) breeds emergent mismatches Mₑ, EACH Mₑ is independently bind_kind'd + certified at re-scan registration (Phase 2) before it can enter pending(Σ). So only in-scope (ApplicationDecontextualized-owned) Mₑ_passed register, even as R mutates across cycles; the certificate gate holds under mutation-induced revalidation.
judgment-relay ∘ disposition-gate: the two axes compose so that a relay reaches the disposition half only where that half has collapsed to a no-op. judgment_relay_upheld discharges the epistemic half at entropy → 0 with a cited basis and leaves the repair half to be routed — to Qc, or to the carry where the user already answered it. judgment_relay_overruled reaches both halves, because well_formed leaves Keep as the sole pairing and a Keep edits nothing; the retraction is reported with its cited basis while the target still stands untouched. keep_carried_forward reaches the disposition half on the OTHER ground — the user's own prior answer for that aspect, re-applied to the advanced target and reported before it writes — and reaches ONLY that half: the judgment it records is the one this cycle settled, so the two grounds stay on their own axes instead of one carrying the other along. The composite's guarantee is that Adapt and Discard stay outside relay reach. It is stable under the non-monotone loop: an emergent Mₑ re-enters at Phase 1 and is judged and disposed on the same two axes, with its own relay eligibility computed afresh against the advanced target.
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

AI detects applicability mismatch after execution OR user calls `/contextualize`. Detection is silent (Phase 0). Surfacing at Phase 1 takes the mode the act is in. Where the answer turns on what the user weighs, surfacing is Cognitive Partnership Move (Constitution) and yields the turn. Where the evidence fixes one answer, its basis is cited, and the close leaves the result untouched, surfacing is relay (Extension): it reports and proceeds.

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

**Action**: At Phase 1, surface the mismatch in the mode the act is in — Cognitive Partnership Move (Constitution), yielding the turn, wherever the answer turns on what the user weighs; relay (Extension), reporting the cited basis and proceeding, wherever the evidence fixes one answer and the close leaves the result untouched.
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

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Every flagged aspect carries a disposition (adapted, kept, routed, residual) | Proceed with the verdict — it carries `R_final` together with how each aspect was closed |
| A Discard disposition withdrew the result (Phase 2 → withdraw) | Withdrawal convergence: `R_final` is the replacement (or nothing), every still-pending mismatch is closed as Moot, and no re-scan runs — the evaluation target no longer exists |
| No mismatches detected (Phase 0 zero-mismatch finding confirmed) | Execution stands as-is |
| Mismatches detected but none held by the own claim (Mᵢ ≠ ∅ ∧ Mᵢ_passed = ∅ ∧ adjudicated(Λ.R, X) ∧ no deferred-pending ∧ pending(Σ) = ∅) | Trivial convergence — every flagged aspect is handed to a local route claim's deficit or left Residual (unattributable); emit the routed deficits with their command hints (/gap, /inquire, /bound), surface any Residual, and deactivate without adapting R. DEFERRED mismatches (ambiguous, atomic) get ONE bounded re-assessment → pass / route / Residual before any convergence |
| User Esc key | EarlyExit (not ContextualizedExecution): present partial transformation trace + declare pending mismatches as unresolved residual, then accept result without further applicability review |

## Mismatch Identification

Mismatches are identified across emergent dimensions. Any context-fit mismatch the morphism admits is in-scope; the domains below are frequently-verified examples that carry detection scent.

### Frequently-Verified Mismatch Domains (illustrative, not exhaustive)

These are recurring domains worth scanning first. A mismatch in any other emergent domain is equally in-scope.

| Domain (example) | Detection scent | Sample phrasing |
|------------------|-----------------|-----------------|
| **Convention** | Result follows general patterns but project has local conventions | "This follows best practices, but your project uses [local pattern]" |
| **Environment** | Result assumes environment state that differs from actual operating context | "This assumes [env state], but your context has [actual state]" |
| **Audience** | Result targets a different audience than the actual consumers | "This is written for [assumed audience], but [actual audience] will use it" |
| **Dependency** | Result interacts with components whose constraints weren't considered | "This depends on [component] which has [constraint not considered]" |

**Off-example mismatch detection**: Detect an off-example mismatch when:
- The applicability gap spans multiple example domains
- User keeps every example-domain mismatch as-is but the result still exhibits contextual misfit
- The execution context involves domain-specific fitness criteria that resist the example domains

Any such off-example mismatch must satisfy morphism `ApplicationDecontextualized → ContextualizedExecution` — which is exactly the certificate's own claim, so the fail-closed deficit-fit certificate (Phase 0 / Phase 2 re-scan) enforces this at registration. Backward-misfit boundary (routed away, not adapted in-place) — per `RouteClaim` (TYPES): GapUnnoticed, ContextInsufficient, BoundaryUndefined (command hints `/gap`, `/inquire`, `/bound`).

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

Behavioral-impact qualifier (Significant criterion): the mismatch must produce a demonstrable downstream behavioral consequence; structural-change extent alone — line count, file count, scope size — is insufficient grounds for Significant. **Assessment scope**: demonstrability is evaluated against the visible task graph and downstream protocol activations within the current session. When the visible session offers no anchor for the predicted consequence, the mismatch defaults to Minor. See Rule 12.

When multiple mismatches are identified, surface in severity order (Critical → Significant → Minor). Only one mismatch surfaced per Phase 1 cycle.

## Protocol

### Phase 0: Applicability Checkpoint (Silent)

Evaluate result against application context. This phase is **silent** — no user interaction, except the conditional zero-mismatch confirmation gate (Rule 9) when no mismatch is detected.

1. **Scan result** `R` against context `X`: environment state, conventions, use case scope, temporal validity, user constraints
2. **Check applicability**: For each aspect, assess whether `correct(R) ∧ fits(R, X)` (i.e., `warranted(R, X)`)
3. **Bind + certify each detected mismatch at registration (fail-closed)**: For each candidate mismatch, set `m.kind_binding = { label, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity }`; if `atomicity = non-atomic` (the mismatch bundles two distinct aspects), **split before certify**. Then `m.certificate = certify(m.kind_binding, local_claims)` where the local claims are epharmoge's own claim and its route claims, both inscribed in this SKILL.md (TYPES: `OwnClaim`, `RouteClaim`); the certificate reads nothing outside this file. Fit the predicate against every one of them and collect `claimed_by`, the set of claims the evidence supports:
   - **`status = pass`** — `claimed_by = {ApplicationDecontextualized}`, the own claim holding alone, which means the predicate instantiates `ApplicationDecontextualized` AND the local value-space can carry it to `ContextualizedExecution`. The mismatch is eligible for registration.
   - **`status = route`** — `claimed_by = {d}` for a single route claim's `routed_deficit` (backward misfit, not a context-fit question). Emit `d` as the typed handoff and **drop the mismatch from registration**, closing it with disposition `Route(routed_deficit)` (`assigned_by = certificate`) in `Σ.dispositions`; the scan continues with the remaining mismatches. Route claims per `RouteClaim` (TYPES): GapUnnoticed (hint `/gap`), ContextInsufficient (hint `/inquire`), BoundaryUndefined (hint `/bound`).
   - **`atomicity = non-atomic`** — compound mismatch (two distinct aspects) → **split** into atomic sub-mismatches and re-run bind_kind + certify on each (same Phase 0 pass).
   - **`status = ambiguous`** (atomic) — `|claimed_by| ≠ 1`, either because several claims hold or because none does on the evidence at hand → ONE narrowed-scope re-assessment at the fixed Phase-0 `(R, X)` (AI-side; no user question — Phase 0 stays silent), then re-certify. `(R, X)` is fixed, so re-assessing is deterministic-identical → bounded to one attempt: pass / route / (if still ambiguous) **Residual** (unattributable, never registered, surfaced as residual, non-blocking). Which of the three the re-assessment reaches is read at that turn from the session's own context and the user's wording; it is not fixed in advance here.
4. **Assess fit**: Build `ApplicabilityFitMap` over the certificate-passing mismatches (`Mᵢ_passed`) from warranted aspect evidence, conflicts, dependencies, adaptation options, and bounded open questions
5. If all aspects warranted: present finding per Rule 9 before concluding (Epharmoge not activated)
6. If certificate-passing mismatches remain: record `Mᵢ_passed` with aspect, description, evidence, severity (per Rule 12 — behavioral-impact qualifier assessed against current-session task graph), `origin=Initial`, kind_binding, certificate, and fit-map placement — proceed to Phase 1

**Information source**: The result `R` compared against observable context `X` — non-circularity (Rule 6).

**Registration-time certificate**: The certificate fires per mismatch at registration, and the certify step is relay (Extension). Full account — including the bound comparison and basis-citation timing — at Rule 17(a)-(b).

**Backbone discipline**: One canonical KindBinding → DeficitFitCertificate → value-space schema shared across protocols; epharmoge's local instantiation is detailed at Rule 17(d).

**Scan scope**: Completed result, observable context (structure, conventions, constraints), session context. Does NOT re-execute or modify files.

**Fit-map scope**: Support for mismatch selection and adaptation direction, and the place a judgment's cited evidence is found — it classifies already detected mismatches (Rule 15; open-condition bound at UX Safeguards: Fit-map cap).

### Phase 1: Mismatch Surfacing

**Register all certificate-passing mismatches (`Mᵢ_passed`) as Tasks** (TaskCreate), then take the next pending mismatch selected by `SelectNext`. If the fit evidence has already settled its judgment as `Overruled`, report the retraction and its cited basis and close it as relay (`judgment_relay_overruled`). Failing that, settle the judgment half against the current target, then: if the user already answered `Keep` for this aspect (`accepted(aspect(Mₛ))`), report the carry-forward and the basis they gave and close it as relay (`keep_carried_forward`), recording this cycle's judgment rather than the earlier one. Otherwise **present** it via Cognitive Partnership Move (Constitution). Routed/ambiguous mismatches never enter `pending(Σ)` (fail-closed certificate).

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
  - **Deficit-fit basis**: [why this mismatch is one this protocol takes on rather than one it hands elsewhere — the cited claim fit from the certificate; relay, deterministic against the claims inscribed in this SKILL.md (per the certify TOOL GROUNDING promise)]

Then **present**. Each option is a pair — a judgment about the mismatch and a disposition over the result — so each one names both halves in plain terms:

```
How would you like to handle this applicability mismatch?

Options:
1. **Doesn't actually apply** — the flagged aspect fits after all; the result stands unchanged
2. **Real, but fine as-is** — the mismatch stands and the result is accepted anyway: [stated assumption about context fit]
3. **Adapt it** — the mismatch stands; change the result: [brief direction prompt]
4. **Withdraw it** — the mismatch stands and the result should not be used: [what takes its place, if anything]
```

Formally: option 1 is `(Overruled, Keep)`, option 2 is `(Upheld, Keep)`, option 3 is `(Upheld, Adapt(direction))`, option 4 is `(Upheld, Discard(replacement))`. Options 1 and 2 are different answers — the first says the mismatch was not real, the second accepts a real one — and the trace records them apart.

If an adaptation direction is evident, materialize option 3 with it filled in:
```
3. **[Specific adaptation]** — [what would change and why]
```
This is a contextual materialization of `Adapt(direction)` — the formal disposition remains `Adapt`, with the direction pre-populated from AI analysis. The same holds for option 4's replacement.

**When the judgment was relayed** (`judgment_relay_upheld` fired — the evidence admits no reading under which the aspect stands warranted): present the cited basis as text, then drop option 1 from the set, since the judgment half is already settled. Options 2-4 fire as a gate and yield turn unless the carry below closes the disposition first (Rule 10, and the relay-closes-only-what-leaves-the-artifact-unchanged invariant).

**When the user already accepted this aspect** (`keep_carried_forward` fired — the aspect carries a prior `Keep` the user answered, and it re-registered after an Adapt advanced the target): no gate is presented — they have already answered this. Report it — the aspect, that their earlier acceptance is being carried to the current target, and the reason they gave for accepting it — then close it against the current target and move on. What carries is **what they wanted done**, not the verdict: the record takes its judgment from this cycle, so the close claims nothing about the current target that this cycle did not establish.

**When the evidence retracts the finding** (`judgment_relay_overruled` fired — the aspect carries cited fit evidence and admits no reading under which it fails to stand): no gate is presented at all — option 1 is the only well-formed pairing left. Report it instead — what was flagged, that it is being retracted, and the fit evidence that retracts it — then close the mismatch and move to the next one. **Never relay a retraction silently**: the report puts the basis in front of the user before anything is written. Stopping the run is theirs to do and stays available throughout, so what the report buys is the timing — the reading reaches them while this close is still unwritten, and that is what makes this a relay rather than a gate.

**Design principles**: Each option leads to a concrete next step. Evidence-grounding (Rule 4), current-mismatch framing and natural post-execution integration (UX Safeguards), and the stated fitness assumption on option 2 all apply here.

### Phase 2: Disposition

After the user's answer `(judgment, disposition)`, **first** append the mismatch's one `DispositionRecord` to `Σ.dispositions` and complete its task — as a single step, so it leaves `pending(Σ)` before any arm below runs — **then** act on the disposition:

1. **`(Overruled, Keep)`**: the flagged aspect fits after all — no adaptation, no re-scan, and the result is left exactly as it stands (`R_final` is bound once, at convergence). This pair also arrives relay-assigned from Phase 1 when the fit evidence already settled it (`judgment_relay_overruled`), in which case it never reached this gate; the trace prints the two apart
2. **`(Upheld, Keep)`**: the mismatch stands and is accepted anyway — the result is left as whatever earlier adaptations made it; note the fitness assumption accepted, no re-scan. An accepted residual, recorded apart from arm 1
3. **`(Upheld, Adapt(direction))`**: apply the user-directed adaptation using Edit/Write tools → `R'`, **advance the evaluated target** (`Λ.R := R'`), then re-scan (below)
4. **`(Upheld, Discard(replacement))`**: withdraw the evaluated result using Edit/Write tools — `R_final := replacement` (or nothing, when the withdrawal leaves nothing in its place). Set `Λ.withdrawn`, close every mismatch **remaining** pending as `Moot` (unjudged, with the withdrawal as basis), and **do not re-scan**. The run converges here (Phase 2 → withdraw). The fit claim stays on `Λ.R`; the replacement is carried in the verdict but **not** claimed to fit

**Bulk exit — "keep the rest as-is"**: at any Phase 1 gate the user may decline the per-mismatch loop and accept everything remaining. This arrives as a free response rather than a fifth option, because it disposes of the whole axis instead of taking a position on one mismatch. Every pending mismatch is closed with an **unjudged** `Keep` (`judgment = None`) — **except** the mismatch currently on the gate when its judgment was relayed a step earlier, which is recorded with that verdict and its cited basis. Then `R_final := Some(Λ.R)` and the run converges (Phase 1 → keep_all_remaining)

After an **Adapt** disposition only — **re-scan**: (`Keep` is non-mutating and `Discard` is run-terminal; neither breeds `Mₑ` nor triggers `Eval`)
- Re-evaluate the advanced target `Λ.R` against `X` for remaining AND **newly emerged** mismatches. `Mₑ` excludes only what already sits in `pending(Σ)` — an aspect closed earlier in this run re-registers, and Phase 1 closes it by `keep_carried_forward` wherever the user already accepted it
- **Bind + certify each emerged mismatch at registration (fail-closed)** — this happens at the **Phase 2 re-scan** (AFTER the Adapt disposition has already mutated R into R'), temporally separated from the Phase-0 certification of Mᵢ: for each `m ∈ Mₑ`, set `m.kind_binding` and `m.certificate = certify(m.kind_binding, local_claims)` (same local claims, same `pass | route | ambiguous` statuses as Phase 0). Register only certificate-passing members (`Mₑ_passed`), stamping `origin=Emerged(adapted_aspect)` where the aspect carries no DispositionRecord and `origin=Persisting` where it already carries one; a `status = route` mismatch is closed with disposition `Route(routed_deficit)` and handed to that deficit (GapUnnoticed, ContextInsufficient, BoundaryUndefined — command hints `/gap`, `/inquire`, `/bound`); a non-atomic compound mismatch is split into atomic sub-mismatches and re-certified; an atomic `status = ambiguous` mismatch gets its one bounded re-assessment at the fixed re-scan `(R', X)` → pass / `Route(routed_deficit)` / `Residual`, before registration. Do not filter the certificate-passing set by fit-map category.
- Recompute `ApplicabilityFitMap` over all pending mismatches before selecting the next mismatch, even when `Mₑ_passed = ∅`
- If remaining tasks non-empty: return to Phase 1 (surface next mismatch via `SelectNext`: severity, then FitRank, then oldest registered task)
- If all tasks completed: execution complete — the verdict carries `R_final` together with every disposition
- Increment `Σ.scan_count`

**Re-scan trigger (transformative revalidation — NON-MONOTONE)**: An Adapt disposition MUTATES `R` into `R'`, and `Eval(R', X)` re-targets the detector at the mutated result, so changed `R'` may exhibit new mismatches not present in the original result. Always re-scan after each adaptation — any adaptation may introduce mismatches in dimensions unrelated to the original aspect; `progress(Λ)` may therefore regress (expected, not an error). Every other disposition leaves `R` unmutated as a succession target and is contextualize-internal.

**Chain discovery**: The `origin = Emerged(parent_aspect)` field records the causal chain, and ranges over Emerged members ALONE — a `Persisting` aspect existed before the latest Adapt, so it enters neither reading below. This enables:
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
| Acceptance carried, never assumed | an aspect the user accepted re-registers against the advanced target and closes by `keep_carried_forward` — reported, no gate. The DISPOSITION carries; the judgment comes from the current target or is left unclaimed | The user is not re-asked what they already answered, and every terminal rests on a record written against the target it claims |
| Current-mismatch framing | Phase 1 surfaces the mismatch currently in play (which applicability aspect is being judged this cycle) — a framing readout, not an `[N addressed / M]` completion count | User recognizes which aspect is being judged without parsing a progress tally; granular progress stays in session |
| Deterministic selection | `SelectNext` orders pending mismatches by severity, FitRank, then oldest registered task | Removes unordered Set indexing from user-facing surfacing |
| Fit-map cap | `depends`/`open` only when observable evidence could change which disposition is chosen | Prevents broad contextual caveat lists |
| Early exit | User can keep all remaining as-is at any Phase 1 — compiled as `Phase 1 → keep_all_remaining`, closing each with an unjudged Keep, except one whose judgment was relayed that cycle | Full control over review depth, with the ledger showing they were accepted rather than judged |
| Relay never edits | A relay closes a mismatch only where the close leaves the result untouched: a settled Upheld assigns no disposition of its own, and a settled Overruled closes with its basis reported | A settled finding never becomes silent permission to change the artifact |
| Retraction is reported, never silent | `judgment_relay_overruled` must report the aspect and the fit evidence before closing | The user sees the retraction and its basis while the result still stands and before the close is written |
| Each Phase 1 relay says where its correction lives | a relay-closed aspect leaves `pending(Σ)` and reaches no further Qc this run. A disputed CARRY reopens by re-entering on the same result (`accepted(a)` reads `Σ`, rebuilt at activation). A disputed RETRACTION has no such reset — `judgment_settled` reads `Λ.fit_map`, derived from `(Λ.R, X)`, so the same input reproduces the same close, and correcting it is the user's interrupt | The user is told what to reach for, rather than trying a reset that moves only one of the two guards |
| Natural integration | "Done. One thing to verify:" pattern | Fits completion flow, not interrogation |

## Rules

1. **AI-guided, user-judged**: AI detects the applicability mismatch; the judgment is the user's wherever it turns on what they weigh, presented via Cognitive Partnership Move (Constitution) at Phase 1. Where the answer is already fixed — by evidence admitting no other reading, or by the user's own earlier answer for that aspect — the AI relays it with its basis cited to the user
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity — Constitution interaction requires turn yield before proceeding
3. **Applicability over Correctness**: When result is correct but contextually mismatched, surface the mismatch — do not assume correctness implies fitness
4. **Evidence-grounded**: Every surfaced mismatch must cite specific observable evidence from both result `R` and context `X`, not speculation
5. **Convergence persistence**: Mode active until every flagged aspect carries a disposition — adapted, kept, discarded, routed, residual, or moot. A run in which nothing was adapted converges exactly as fully as one in which everything was
6. **Non-circularity**: Information source is the result itself compared against context, not pre-execution context scans
7. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Context embedded in a question field is a protocol violation
8. **Convergence evidence**: Present transformation trace before declaring `adjudicated(Λ.R, X)` over the evaluated target; per-mismatch evidence is required. Where the run ended in a withdrawal, the trace also states that the verdict's target is the replacement and that no fit claim is made about it
9. **Zero-mismatch surfacing**: If Phase 0 scan detects no context mismatches, present this finding with reasoning for user confirmation
10. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options. **This rule's compiled control paths are `judgment_relay_upheld` and `judgment_relay_overruled`** (PHASE TRANSITIONS Phase 1, TOOL GROUNDING), covering the JUDGMENT axis in BOTH directions: the evidence may admit no reading under which a flagged aspect stands warranted (→ `Upheld`), or none under which it fails to stand (→ `Overruled`, read off that aspect's own entry in the fit map). No relay on THIS ground reaches the disposition axis on its own account — what becomes of the result turns on user value weightings that no evidence collapses. The `Overruled` arm reaches it only where `well_formed` forces `Keep` as the sole remaining pairing and that `Keep` edits nothing: the close is reported with its cited basis before anything is written, while `Adapt` and `Discard` remain unreachable by relay
11. **Gate integrity** (Safeguard tier): The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES answer space — here the two-axis `Judgment × Disposition` product) is distinct from mutation.
12. **Significant requires demonstrable behavioral impact**: Severity = Significant requires that the mismatch produces a demonstrable behavioral consequence — downstream-decision impact, runtime divergence, gate-trajectory change. Structural-change extent (line count, file count, scope size) alone is insufficient grounds — categorize as Minor when behavioral impact is undemonstrated. This guards against false-positive gating arising from conflation of structural-change extent with applicability impact
13. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language. A reader who cannot take in what was written stops reading and answers past it; the gap widens and the gate's matching passes in practice to the AI, so plain rendering is what keeps the recognition the user's own. SKILL.md formal-block vocabulary stays in the formal block. What the user reads is the action, observation, or question in their idiom. A term may be rendered differently for different readers and in different sessions — fitting the rendering to the reader in front of you is the point of doing it at all. Within one session it is held: the first rendering chosen for a term is that session's term, and switching to another one mid-session costs the reader precisely because the same partner set the first. Preserve original wording only when the term itself is the subject of discussion, when quoting user-provided text, or when directly citing the source. Where a rendering would still leave the reader recalling something at first encounter, you may extend it with a brief situational anchor drawn from their own substrate — emit only when that recall would otherwise occur, and cite the substrate the anchor came from.
14. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
15. **Applicability fit map supplies evidence, never decides**: Use `ApplicabilityFitMap` to scope which mismatch is surfaced and which adaptation direction is practical, and as the place a judgment's cited evidence is found. It classifies already detected mismatches: it may not create one the detector never produced, may not suppress one, and may not close one on its own classification. A close that reads an entry's evidence, clears the judgment bar, and reports that basis to the user is the JUDGMENT closing with the fit map cited — source, not authority. That is why `judgment_settled` takes membership as the evidence's location rather than as its trigger (TYPES).
16. **All certificate-passing mismatches remain tracked**: Initial and emerged mismatches that pass the fail-closed deficit-fit certificate are registered before fit-map prioritization. Fit categories order selection and word the fit basis, and the fit map additionally holds the evidence a judgment may cite (Rule 15). None of those acts removes a registered mismatch from convergence accounting: every close writes a ledger entry, whoever assigned it. (The certificate is the one legitimate pre-registration filter — Rule 17.)
17. **Registration-time deficit-fit certificate, transformative revalidation**: Before a detected mismatch enters `pending(Σ)`, it is dispatched through the shared meta-backbone pipeline — KindBinding → fail-closed DeficitFitCertificate → value-space, in that strict order, at registration of both `Mᵢ` (Phase 0) and `Mₑ` (Phase 2 re-scan). (a) **Registration-time**: the certificate attaches per mismatch at registration time — mismatch detection stays AI-side. This is distinct from bound's dispatch-first up-front sync (which exists because BoundaryMap is a multi-consumer router). (b) **Fail-closed certificate**: `certificate.status = pass` strictly precedes registration and surfacing; `status = route` drops the mismatch and hands it to the matched route claim's `routed_deficit` (per `RouteClaim`, TYPES: GapUnnoticed, ContextInsufficient, BoundaryUndefined, with command hints `/gap`, `/inquire`, `/bound`); a non-atomic mismatch is split into atomic sub-mismatches before certify, and `status = ambiguous` — `|claimed_by| ≠ 1`, several claims holding or none — triggers ONE narrowed-scope re-assessment at the fixed detection state ((R, X) for Mᵢ at Phase 0; (R', X) for Mₑ at the Phase 2 re-scan) → pass / `Route(routed_deficit)` / `Residual`, re-certified before registration. The certificate is generated by fitting the mismatch's positive predicate against the own claim and the route claims inscribed in THIS SKILL.md, reading nothing outside this file; `claimed_by` is a Set, so "no claim holds" is a value rather than a hole, landing in `ambiguous` alongside the several-claims case. A pass certifies local admissibility — epharmoge's own gate over epharmoge's own activation — not the absence of a claim anywhere in the wider protocol set. The certify step is relay (Extension — the deficit-fit is grounded in the cited local claims, an unclear fit returns `status = ambiguous` → defer; basis cited at Phase 1 surfacing). (c) **Transformative revalidation (NON-MONOTONE)**: an `Adapt` disposition MUTATES `R` into `R'`, `Eval(R', X)` re-targets the detector at the mutated result, and this can BREED emergent mismatches `Mₑ` that did not exist before — so re-scan is mandatory and `progress(Λ)` may regress. "Transformative revalidation" labels the ADAPT disposition; every other disposition is contextualize-internal and does not mutate `R` as a succession target. (d) **Backbone discipline**: the schema is ONE canonical definition shared across protocols; epharmoge instantiates only `object_ref` (= Mismatch), `local_value_space` (= the two-axis `Judgment × Disposition` answer space under `well_formed`), the label field's type (`Axis`), the own claim, and the local route claims — same field names, same fail-closed statuses, same certificate-before-registration order.
18. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
19. **Seam relay on declared continuation**: when a user-declared chain or a composition edge this SKILL.md declares names the next protocol, the between-protocol seam after Epharmoge's convergence is relay (Extension) — proceed directly, citing the settling source (the chain declaration or the named edge). This governs only the seam BETWEEN protocols; every Constitution gate inside Epharmoge and the next protocol fires unchanged, and the user can redirect at any turn.

20. **A prior acceptance is relayed forward, never assumed away**: where the user has already answered `Keep` for an aspect and that aspect re-registers against an advanced target, the DISPOSITION is settled by their own earlier utterance — a distinct relay ground from Rule 10's, which turns on evidence collapsing the option set. **This rule's compiled control path is `keep_carried_forward`** (PHASE TRANSITIONS Phase 1, TOOL GROUNDING), guarded by `accepted(a)` and reached at the disposition half, after the judgment half has resolved against the current target. **The carry is disposition-only.** A judgment is a claim about how a specific target stands, so it expires with the target it was made about: the record this close writes takes its verdict from this cycle's `judgment_state` — a relayed `Upheld` with its own cited basis, or none at all — and a prior verdict never stands in for one. What transfers is the user's preference about what to do, which is theirs to hold across targets. The carry-forward writes its own record against the target it closes and reports first the reason the user gave for ACCEPTING the aspect — the ledger keeps a ground per axis for exactly this reader, so a carry can never cite why the mismatch stood in place of why the user accepted it — and so no terminal ever rests on a record written about a target the run has moved past. **Where the reopen lands**: `accepted(a)` is run-scoped and monotone within the run, so a carry the user disputes is reopened by re-entering Epharmoge on the same result — a fresh `Σ` returns the aspect to the gate — and NOT by a further turn inside the run, where the aspect has already left `pending(Σ)` and reaches no Qc. This exit is **this guard's alone**: `judgment_relay_overruled` reads `Λ.fit_map` rather than `Σ`, so a rebuilt ledger leaves it firing on the same evidence, and correcting a disputed retraction is the user's interrupt rather than any re-entry. Suppressing the aspect at detection instead would reach the same silence with neither the fresh record nor this exit.

21. **Form feedback**: Silence about form is not evidence about form. Too dense fails quietly — the reader skims, answers past it, stops — while too plain fails out loud, so the complaints that arrive come from one side only. Density therefore does not carry over from the previous round: each round takes it from what this request asked for, while a statement about form does carry over until it is countermanded. When the reader reports a symptom rather than naming a form — "this is hard to follow", "too long", "I can't find the conclusion" — that symptom is the form instruction. Read it and change the form rather than asking which form they want; naming one is the recall this rule exists to remove. Say in one line what changed, so the correction can itself be corrected.
