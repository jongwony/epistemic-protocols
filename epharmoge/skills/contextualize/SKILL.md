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
  Mᵢ = ∅: Qz(zero_mismatch_finding) → Stop → [AcceptNoMismatch: R_final := Some(Λ.R), deactivate (no aspect ¬warranted; execution stands as-is) | Reopen(aspect): reopen_focus := aspect, re-scan Eval focused on it (one attempt: any detection → the SAME Phase 0 pipeline as the Mᵢ ≠ ∅ arm below — bind_kind, split, absorb, certify, value space — and then whichever Phase 0 exit that pipeline reaches, Phase 1 where anything passed the certificate and trivial convergence where nothing did; still-∅ → relay finding, deactivate)]
  Mᵢ ≠ ∅: bind_kind each [split where non-atomic] → absorb into ∅ (same claim → merge, new → init_occurrence) → Mᵢ → ∀m ∈ Mᵢ: certify(m, local_claims) → keep(status = pass) → Mᵢ_passed → ∀m ∈ Mᵢ_passed: m.value_space := Some(bind_value_space(m)) →
    Mᵢ_passed = ∅ ∧ adjudicated(Λ.R, X) (every flagged aspect carries a certificate-assigned disposition — Route(routed_deficit) or Residual — via the typed disposed(a) predicate; an ambiguous certificate having closed its mismatch as Residual at registration, like a route): → emit routing recommendations + surface any Residual (each flagged aspect either handed to a local route claim's deficit or unattributable) → R_final := Some(Λ.R) → deactivate (trivial convergence: adjudicated by disposition, Λ.R unadapted)
    Mᵢ_passed ≠ ∅: AssessFit(R, X, Mᵢ_passed) → F → Register(Mᵢ_passed) → SelectNext(pending, Λ.fit_map) → Mₛ → judgment_settled(Mₛ, Λ.fit_map)? →
      [Some(Overruled): judgment_relay_overruled → report the retraction + the cited fit evidence → close Mₛ as (Overruled, Keep), relay-assigned → NO Qc, no turn yielded, Λ.R untouched → next pending, or converge]
      [Some(Upheld): judgment_relay_upheld → judgment_state := Some((Upheld, basis)), Overruled/Keep dropped from the presented set] →
      -- DISPOSITION HALF. The judgment half above has already run; what becomes of the result is always the user's:
      Qc(Mₛ scoped by the CURRENT Λ.fit_map, judgment_state) → Stop → A = (j, d) →
      [d = Adapt(direction)] adapt → R' → Λ.R := R' → Eval(Λ.R, X) → bind_kind each [split where non-atomic] → absorb into pending (same claim → merge, new → init_occurrence) → Mₑ (what the fold opened) → ∀m ∈ touched: certify(m, local_claims) → ∀m ∈ touched: m.value_space := Some(bind_value_space(m)) where status = pass, None otherwise (total on both outcomes, so a merged element that had a space and stopped passing does not keep it) → ∀m ∈ touched where status ≠ pass: route → close m as Route(routed_deficit); ambiguous → close m as Residual — and every such close completes the entry of an m registered before this fold, so it LEAVES pending, while an m that was not never enters → Mₑ_passed := the passing members of Mₑ (registration is for what the fold OPENED; an element registered before this fold has nothing to register) → Register(Mₑ_passed) → AssessFit(Λ.R, X, pending) → F' → (loop: back to Phase 1 above — judgment half, then disposition half — until contextualized)
      [d = Keep] no re-scan, no Mₑ; R_final is bound at convergence, not here → (loop: back to Phase 1 above)
      [d = Discard(replacement)] R_final := replacement, every mismatch REMAINING pending → unjudged Moot, no re-scan → deactivate (withdrawal convergence: the evaluated target is withdrawn; the replacement is carried, not adjudicated)
    (at any Qc, a free-response "keep the rest as-is" closes every pending mismatch with an unjudged Keep — except one whose judgment was relayed this cycle, which keeps that verdict and its cited basis — and converges: Phase 1 → keep_all_remaining)

── MORPHISM ──
(R, X)
  → evaluate(result, context)          -- detect applicability mismatch
  → bind_kind(mismatch) [split where non-atomic] → absorb(detections, carried) → certify(element, local_claims) -- shared meta-backbone: bind each mismatch as a kind, fold the detections into what is already carried (same claim → merge, none → open one), then certify deficit fit (fail-closed) per ELEMENT against the claims inscribed in this SKILL.md, BEFORE it enters the pending/disposition flow
  → assess_fit(result, context, mismatches) -- sort applicability fit before user judgment
  → surface(fit_scoped_mismatch) -- present mismatch with fit basis and evidence
  → judge(mismatch) → dispose(result, judgment, disposition) -- TWO AXES: whether the flagged aspect stands, then what becomes of the result (adapt / keep / discard)
  → ContextualizedExecution
requires: mismatch_detected(R, X)       -- runtime checkpoint (Phase 0), and the AUTO-ACTIVATION condition ONLY (Layer 2). A user-invoked run
                                        -- (/contextualize, Layer 1) enters WITHOUT it: its Phase 0 may find Mᵢ = ∅, and that run then owes the
                                        -- zero-mismatch confirmation (Qz, Rule 9) rather than declining to have started — which is why
                                        -- ContextualizedExecution's own guard names that confirmation as a conjunct
deficit:  ApplicationDecontextualized    -- the deficit this morphism takes, and the certificate's own_claim deficit for in-scope mismatches. It gates
                                        -- Layer 2 auto-activation; it does not gate Layer 1 invocation
preserves: X                             -- application context is fixed reference; morphism transforms R only
invariant: Applicability over Correctness
invariant: certificate-before-registration  -- DeficitFitCertificate.status = pass strictly precedes registering a mismatch into pending, and STRICTLY PRECEDES ITS STAYING THERE where the registration already exists: an element whose evidence the fold grew is re-certified, and a status that stops passing keeps it out of pending — taking it out where it was registered before the fold, keeping it from entering where it was not. So nothing sits in pending on a certificate that does not currently pass AT ANY POINT pending IS READ, whether the element arrived by opening or by merging — not asserted mid-pass, since the re-scan writes the non-passing status and closes the element out of pending as steps of one uninterrupted pass and AssessFit, the first reader of pending after it, runs once both have happened (shared meta-backbone order, on both scans)
invariant: transformative revalidation (NON-MONOTONE) -- an Adapt disposition mutates the Eval(R, X) target into R', breeding emergent mismatches into Mₑ; re-scan mandatory; progress(Λ) may regress
invariant: judgment-disposition separation -- the judgment (does the aspect stand?) and the disposition (what becomes of the result) are separate answers, each relay-eligible on its own ground: the judgment on cited evidence, the disposition on the user's own prior answer for that aspect
invariant: relay closes only what leaves the artifact unchanged -- a relay may close a mismatch only where the close changes nothing about the result

── TYPES ──
R      = Result to be evaluated (source-agnostic: AI output, analysis conclusion, decision outcome, or any completed work product)
           -- Input type: morphism processes R uniformly; enumeration scopes the definition, not behavioral dispatch
X      = Application context (environment, constraints, user situation) — type name Context; Λ.X is its one binding, fixed at activation (preserves: X), which is why a bare X appears below rather than Λ.X. ContextChannel's Context member is an evidence source, not this type
Eval   = Applicability evaluation: (R, X) → Set(Mismatch)
MismatchId = a run-local handle naming ONE OCCURRENCE the protocol carries — assigned in ascending order at the moment the occurrence is kept
                 — on absorb's not-same arm, the same arm on either scan — and never reassigned or reused within the run
                 -- NOTHING DISPATCHES ON IT: no phase branches on its value, no convergence predicate reads it, and it never decides whether two
                 --   mismatches are the same claim — that stays identity(m). It is a handle for pointing, and pointing only (Rule 22)
                 -- A detection that MERGES into an element already carried is not a new occurrence and takes no id; that element keeps its own (absorb)
absorb = HOW A SCAN'S DETECTIONS BECOME WHAT THE PROTOCOL CARRIES: Set(Mismatch) × Set(Mismatch) → Set(Mismatch), folding the detections into the carried set ONE AT A
                 TIME. FIXED POSITION, and every block that scans states it at that position: AFTER bind_kind + split (so the fold ranges over atomic claims and each
                 side of the judgment below is one claim) and BEFORE certify (so whatever the fold yields is already a complete Mismatch when a certificate-assigned
                 close — Route, Residual — or a later Moot inherits one). Each detection takes one of two arms, and WHAT IS JUDGED IS WHICH CARRIED ELEMENT, IF ANY, STATES THIS
                 CLAIM — not whether some element does. The judgment yields the element itself, because that is what the merge below needs; a yes/no would
                 leave the target to be invented wherever more than one carried element reads plausibly, which uniqueness and transitivity being
                 disclaimed above makes a live possibility rather than a corner. HOW the run reaches that element is its own; THAT it names one is the
                 contract's:
                 --   an element → merge(carried, d) on the element the judgment named: it absorbs the detection and stays the element. THE MERGED ELEMENT IS WHAT THE NEXT DETECTION
                 --                MEETS, so several detections of one claim fold to one and nothing a detection carried is overwritten by a later one — merge
                 --                combines, and there is no last write to win. What that does NOT buy is order-independence: whichever detection opens the
                 --                element is the one whose id and whose STATEMENT of the claim it keeps — not its whole binding, since the evidence takes in every later detection's and the certificate and value space are re-derived over the result (merge) — and a judgment of sameness need not be transitive, so a different arrival
                 --                order can partition the same detections differently. That follows from sameness being judged, not from the fold
                 --   none      → init_occurrence(d): it enters the set as an element of its own
                 -- THE STAMP RIDES EVERY DETECTION, ahead of both arms: match_identity decides unrepaired for each one by the single rule (does it read as the
                 --   same claim as Mₛ, off identity), and absorb only routes where that answer lands — onto the element the new arm opens, or into the carried
                 --   element through merge's disjunction. NEITHER ARM DECIDES IT, which is what lets a detection reading as Mₛ's claim AND as one already
                 --   carried record both facts instead of losing the first to the second
                 -- THE SET FOLDED INTO IS WHATEVER THE PROTOCOL ALREADY CARRIES: ∅ at Phase 0, pending at the Phase 2 re-scan. "Already pending" is therefore NOT a
                 --   case this step handles apart — it is the accumulator having survived an earlier scan, and a detection meeting it takes the same two arms as one
                 --   meeting an element opened a moment ago. One operation, stated once, is what every scan path runs
                 -- ONE ELEMENT PER CLAIM is what the fold is directed to reach, not a property the contract can guarantee: sameness is judged, and a judgment carries
                 --   no invariant. What the type layer contributes is the narrowing identity(m) ranges over, which is what raises the odds the judgment lands right
merge  = Mismatch × Mismatch → Mismatch, combining two readings of ONE claim. The carried element is the left side and stays the element
                 --   id : the carried element's, untouched — the same occurrence taking on more of what is known about it
                 --   aspect, description, evidence, severity : the CURRENT READING, combined. What the combination comes out as is read at that turn from what the
                 --                two sides actually say; the protocol fixes THAT they are combined, never what the combination is
                 --   unrepaired : the disjunction of the two, the detection's side being the value match_identity decided for it (absorb, above) — a
                 --                set-only stamp, so a claim stamped on either side stays stamped
                 --   kind_binding : positive_predicate is the carried element's — it is ONE claim and this arm was taken because the run read the detection
                 --                as that claim, so it is stated once — while evidence is the UNION. The claim now stands on what both sides found it standing
                 --                on, which is the whole of what a second detection of one claim contributes to identity
                 --   certificate, value_space : RE-DERIVED from the merged binding, by the same certify and bind_value_space steps that derive them anywhere,
                 --                and never carried across unchanged. THE REPLACEMENT IS TOTAL ON BOTH PATHS: a re-derived pass writes the new space,
                 --                and a re-derived route or ambiguous close writes value_space := None, since a mismatch closed by certificate carries
                 --                none (below) — an element that had a space before the merge must not keep it after one. The reason is that status is not fitted from the predicate alone: claimed_by collects the
                 --                claims THE EVIDENCE supports and ambiguous is "none holds on the evidence at hand", so evidence moving can move pass → route
                 --                or → ambiguous. Carrying the earlier certificate would let a stale pass route into adaptation a mismatch that now belongs to
                 --                a sibling deficit, which is the fail-closed invariant going out through the merge arm. Where the re-derived certificate no
                 --                longer passes, the element is closed by its certificate exactly as any other is, and LEAVES pending if it was in it
                 -- SO IDENTITY DOES MOVE UNDER MERGING, in its evidence component: the claim is the same claim and stands on more. The certificate follows it
                 --   because the certificate was always fitted to the binding, and the binding is what grew
                 -- The field list is TOTAL: merge names every field of Mismatch and leaves none to the caller
init_occurrence = the step that turns a detection the fold judged NEW into an occurrence the protocol carries: Mismatch → Mismatch, producing every field no earlier
                 step could produce. Reached on absorb's not-same arm alone, so a detection that folds into an element already carried never passes through it. It
                 writes exactly two fields:
                 --   id        := the next handle in this run's order
                 --   unrepaired := the value match_identity already decided for this detection (absorb) — false on a Phase 0 scan for want of an Mₛ, by that same rule rather than by a separate default
Mismatch = { id: MismatchId, aspect: String, description: String, evidence: String, severity: Severity, unrepaired: Bool, kind_binding: KindBinding, certificate: DeficitFitCertificate, value_space: Option(ValueSpace) }
                 -- ASSEMBLED ACROSS THE REGISTRATION PIPELINE, not built by the scan: Eval detects an aspect and its reading, and bind_kind,
                 --   absorb (whose not-same arm runs init_occurrence), certify and bind_value_space each add what only they can produce, in the
                 --   order Rule 17 fixes. So the whole
                 --   form is what a REGISTERED mismatch carries, and a detection on its way through has only what its stage has reached
                 -- object_ref: the per-mismatch anchor the certificate evaluates and the value-space binds over (epharmoge-local instantiation of the shared backbone's object_ref)
                 -- the mismatch's kind/domain is carried by kind_binding.label (Axis = String, emergent) — the single source of the kind label,
                 --   and a DISPLAY NAME only: which registration a mismatch IS is settled by identity(m) below, never by this label
                 -- Mismatch.evidence is the human-facing indicator shown at surfacing (a String). The typed set the certificate and identity(m)
                 --   range over is kind_binding.evidence (Set(Evidence)) — two different fields, and only the second one decides anything
                 -- THE FIELDS SPLIT FIVE WAYS, and merge (above) treats each accordingly: id is PRESERVED, the carried element's and
                 --   untouched; aspect, description, evidence and severity are the CURRENT READING and are combined; kind_binding is
                 --   IDENTITY, whose predicate cannot move while its evidence unions; unrepaired is a monotone stamp that merge takes the
                 --   disjunction of; certificate and value_space are DERIVED and are re-run over the merged binding rather than carried
                 -- value_space is Option-valued: a mismatch closed by certificate (Route, Residual) is complete with None — never having had a space where the close came at its first certification, and having had its space replaced by None where a re-derived certificate stopped passing.
                 --   The invariant readers depend on is narrower than the field — a mismatch IN pending always carries Some wherever pending is READ. Registration
                 --   follows bind_value_space on both scans, and on the re-scan the None and the close that takes the element out of pending are
                 --   steps of ONE pass with no reader between them. A re-derived ambiguous closes the element exactly as a route does, so both non-pass
                 --   arms take the same exit and neither leaves anything standing in pending on a None
                 -- unrepaired: Bool is a STAMP, not a derived flag (CONVERGENCE, unrepaired(m)). ONE RULE PRODUCES IT ON EVERY PATH, which is what
                 --   makes the field total: unrepaired := (m reads as the same claim as Mₛ, off identity) against the Mₛ this cycle's dispose closed by adapting; at
                 --   Phase 0 there is no Mₛ, so every initial mismatch takes false from that same rule rather than from a default no step writes
                 --   THE FOLD CARRIES IT (absorb): a detection opening an element takes the stamp there, one merging into an element contributes it
                 --   through merge's disjunction. Set-only, never cleared: what it records happened
Severity ∈ {Critical, Significant, Minor}                      -- Significant requires demonstrable behavioral impact (current-session task graph / downstream protocol activations); see Rule 12

-- Shared meta-backbone (KIND dispatch, registration-time / cycle-emergent). One canonical schema; epharmoge-local instantiation ONLY for object_ref (= Mismatch), local_value_space (= the two-axis answer space Judgment × Disposition under well_formed), the label field's type (Axis), the own claim, and the local route claims.
KindBinding    = { label: Axis, positive_predicate: String, evidence: Set(Evidence), origin ∈ {seed, emergent}, atomicity ∈ {atomic, non-atomic} }
                 -- origin is ALWAYS emergent here, and that is the whole of what epharmoge has to say about it: this protocol declares no seed
                 --   kinds (Axis = String, open), so nothing local branches on the field. It stays in the schema because the schema is shared;
                 --   a sibling protocol that does carry seeds reads it there. Naming example seeds to give it work would close a taxonomy this
                 --   protocol deliberately leaves open. label is the same case: no predicate here reads it, it is shown, and it is carried
                 --   because the schema is shared
                 -- captures the mismatch as a kind; if atomicity = non-atomic (the mismatch bundles two distinct aspects) → split BEFORE certify (no registration, no surfacing on a compound mismatch)
                 -- atomicity IS THE BACKBONE'S QUESTION AND CARRIES THE BACKBONE'S MEANING: how many distinct claims this binding bundles —
                 --   the same question the sibling protocols sharing this schema ask of it. It never asks WHERE a repair would land. Repair locus
                 --   is RepairSite (below), which is projected from a disposition already answered and types no mismatch (Rule 21)
                 -- an empty evidence set fails closed downstream — certify finds no claim it supports and lands ambiguous, which closes it Residual, so
                 --   nothing registers on no evidence
identity(m: Mismatch) = (m.kind_binding.positive_predicate, m.kind_binding.evidence)
                 -- WHAT TO LOOK AT when judging whether a re-detected mismatch is the claim a record already closed, and the only thing to
                 --   look at: the claim ITSELF rather than a name for it, together with what that claim stands on. Never the label, which is a
                 --   display name and is written afresh at every detection
                 -- NARROWING IS THE WHOLE OF WHAT THE TYPE LAYER DOES HERE. Each side is cut to ONE claim (atomicity splits a binding carrying
                 --   two) and its evidence is typed by channel (Evidence.source), so two of these can be set beside each other and an overlap
                 --   between them means something. That is what raises the odds the judgment lands right. It does not make the judgment.
                 -- JUDGE WHETHER IT IS THE SAME CLAIM — that reading is the turn's, made on the accumulated context and what the user has said
                 --   this run. Semantic sameness is not decidable, so no comparison here settles it and no case split stands in for it
                 -- WHO READS IT: unrepaired(m) (CONVERGENCE), and absorb, which routes each detection on it (TYPES)
                 -- WHAT IT DOES NOT DO: transfer that record's close. A record answers for the registration it closed and for no other, so a match
                 --   locates a predecessor and never completes a new registration's entry (status↔ledger equivalence, pending)
OwnClaim       = { deficit: ApplicationDecontextualized, resolution: ContextualizedExecution, in_scope_if: String }
                 -- the claim epharmoge makes, stated as the WHOLE local morphism: the deficit it takes AND the resolution it produces. A mismatch is claimed here when its positive_predicate instantiates ApplicationDecontextualized AND the local value-space can carry it to ContextualizedExecution — the bare deficit label is a name, the morphism is the predicate
DeficitFitCertificate = { own_claim: OwnClaim, route_claims: List<RouteClaim>, claimed_by: Set(Deficit), evidence: Set(Evidence), status ∈ {pass, route, ambiguous} }
                 -- fail-closed: status ≠ pass BLOCKS registration into pending AND surfacing this mismatch for answer. Generated for every element the fold touched, whose binding it opened or grew — at registration where the element was not registered before this fold, re-derived over the existing registration where it was — by fitting KindBinding.positive_predicate against own_claim and every route_claim inscribed below — the certificate reads nothing outside this SKILL.md
                 -- claimed_by collects every claim the evidence supports; a SET, so "no claim holds" is the value ∅ rather than a hole in the type
                 -- status = pass: claimed_by = {ApplicationDecontextualized} — the own claim holds alone → eligible for registration
                 -- status = route: claimed_by = {d} for a single route_claim's routed_deficit d (backward misfit) → emit d as the typed handoff, drop the mismatch from registration (it never enters pending — or, where the element was registered already, its entry is completed and it leaves pending)
                 -- status = ambiguous: |claimed_by| ≠ 1 — several claims hold, or none holds on the evidence at hand → close the mismatch as Residual, unattributable on the evidence at hand; never register/surface under ambiguous fit
                 -- NO SECOND LOOK, AND THE REASON IS THE GROUND RATHER THAN THE BUDGET: the certificate reads a detection state this phase has already
                 --   fixed — (R, X) at Phase 0, (R', X) at the re-scan — and both phases are silent, so there is no channel through which anything new
                 --   could arrive between a first read and a second. A re-read of unchanged ground yields whatever it yields, and a step whose answer can
                 --   move with no new evidence behind it is a case machine standing where a judgment belongs: it would admit or dismiss a mismatch
                 --   arbitrarily. Residual is not a weaker outcome than a resolved one — it is the true report that attribution did not settle here, and it
                 --   is surfaced rather than swallowed, so the user sees the unattributable claim instead of a coin-flip about it
                 -- what a pass certifies is LOCAL ADMISSIBILITY: epharmoge's own gate governing epharmoge's own activation, not the absence of a claim anywhere in the wider protocol set. Where two protocols' scopes both reach a situation, each protocol's own gate governs
RouteClaim     = (route_if_predicate: String, routed_deficit: Deficit)
                 -- epharmoge-local route claims — BACKWARD misfit the loop routes away rather than adapting in-place. routed_deficit is the BINDING field; the command in parentheses is a non-binding hint for the user, not the relation this guard composes on:
                 --   an unnoticed decision gap rather than a context-fit question        → GapUnnoticed        (hint: /gap)
                 --   a missing pre-execution fact (no observable value, requires supply)  → ContextInsufficient (hint: /inquire)
                 --   undefined convention/dependency ownership for the decision           → BoundaryUndefined   (hint: /bound)
Evidence       = { source: ContextChannel, content: String }
ContextChannel ∈ {Result, Context, Convention, Environment, Session}  -- observable sources for the certificate's deficit-fit basis (R itself + observable X)
V              = bind_value_space : Mismatch → ValueSpace       -- the mismatch's answer constructors; generated ONLY after certificate.status = pass, and generated WHENEVER that pass arrives — including the re-derivation over a merged element, which replaces the None a non-pass leg wrote along with the status that wrote it, on both scans; frozen for the cycle (relay / dead-signal test applied)
                 -- PRODUCED on both scans between the pass filter and Register, for every element the fold touched — the third leg of Rule 17's strict order (KindBinding, certificate,
                 --   value space) — and written to that mismatch's own value_space field, never at selection: judgment_relay_overruled
                 --   reason about which pairings well_formed leaves, and each can close a mismatch before it is ever selected, so a space bound at selection would
                 --   not exist where they read it
ValueSpace     = the mismatch's answer space (local_value_space; epharmoge-local instantiation point) = { (j, d) : j ∈ Judgment, d ∈ {Adapt(direction), Keep, Discard(replacement)}, well_formed(j, d) }
                 -- a two-axis PRODUCT: whether the flagged aspect stands and what becomes of the result are separate answers, so a judgment can be settled without settling the repair
Deficit        = a deficit label a mismatch may be claimed by — epharmoge's own ApplicationDecontextualized, or one of the sibling deficits named in the route claims above. Every label this certificate can assign is inscribed in THIS SKILL.md; nothing outside this file supplies one
Axis           = String                                        -- emergent kind label; examples: "convention", "environment", "audience", "dependency"
Mᵢ_passed = { m ∈ Mᵢ : certificate(m).status = pass }          -- initial mismatches that passed the fail-closed certificate at registration
Mₑ_passed = { m ∈ Mₑ : certificate(m).status = pass }          -- emerged mismatches that passed the fail-closed certificate at re-scan registration
AssessFit = Applicability fit assessment: R × X × Set(Mismatch) → F
           -- classifier over input_mismatches; does not generate new Mismatch objects
F      = ApplicabilityFitMap { fit_justifications, conflicts, depends, adaptation_options, open }
fit_justifications = Set(AspectFit) — for each input mismatch the assessment finds warranted in X after all, the evidence that warrants it
AspectFit = { target: Mismatch, evidence: String }
           -- invariant: target ∈ input_mismatches
           -- keyed to the mismatch, not to its aspect label: one aspect can carry several registrations at once (entry(m) already turns on the
           --   same distinction), so an entry found by label could hand judgment_relay_overruled another registration's fit evidence — and that
           --   relay closes without a gate, leaving a retraction whose cited basis answers for a mismatch the user was never shown
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
SelectNext = pending × F → Mₛ
           -- priority: severity(Critical > Significant > Minor), then FitRank, then oldest registered mismatch — READ OFF THE CARRIER, whose entry is one line per registration in registration order. Not off MismatchId, which is assigned when the fold keeps an occurrence and not when the element registers, so an element the fold opened early and registered late carries an id earlier than elements registered before it
Mₛ     = Selected mismatch
Mᵢ     = What Phase 0 carries: Eval(R, X) bound, split, and absorbed  -- one element per claim as far as the fold's judgment reached, which is what it is directed to and not an invariant it can hold (absorb); each certified at registration. Eval(R, X) = ∅ ⟺ Mᵢ = ∅, the fold neither creating nor emptying
Mₑ     = What the Phase 2 fold OPENED — the elements absorb entered on their own rather than merged into something carried. OPENING IS NOT ENTERING pending: only Register puts an element there, and only the passing members reach it  -- the REGISTRATION set, and membership turns on having been opened this fold, not on having escaped merging: an element opened here and merged into later this same scan is still one of these: a detection that merged carries no separate member, its content being in the element it merged into
touched = the elements this fold OPENED OR MERGED INTO                 -- what certify and bind_value_space range over on either scan; at Phase 0 it coincides with Mᵢ, the accumulator having started empty, and only at the re-scan is it wider than what the fold opened. THE TWO ARE NOT DISJOINT: a detection can open an element that a later detection this same scan merges into, so nothing downstream may branch on which of the two it was. What every downstream clause turns on instead is registered(e) — whether this element was in pending BEFORE this fold ran — which is a property of the element, settled before the fold and unmoved by how many detections landed on it. An element opened this scan is not registered however often it was merged into; one carried in from an earlier scan is. What puts a merged element in touched at all is that its binding grew, leaving its earlier fit stale until re-run (merge). An element pending but untouched by this fold kept its binding, so nothing re-fits it. Register still ranges over the passing members of Mₑ alone — an element registered before this fold has its entry, and re-registering it would open the second entry the fold exists to prevent
Register = { m ∈ Set(Mismatch) : certificate(m).status = pass } → C [Tool: record] -- registration of ONLY certificate-passing mismatches into the ONE carrier; status ≠ pass blocks registration (fail-closed)
C          = MismatchCarrier: the ONE durable entry every registered mismatch is written into — a single dereferenceable record, so one read reconstructs the whole registered set rather than reassembling it from scattered records or from session memory
Entry      = the record C carries for one registered mismatch  -- distinct from DispositionRecord, which is the ledger's own member; the equivalence below relates the two
EntryLocator = { record: C's identity as the carrier-creating write returned it, session: the id of the session that wrote it }  -- substrate-neutral by construction: the identity is whatever that write returned, so this type never names what performs the write. Held at Λ.carrier, which is what every amendment names
locator(C) = EntryLocator { record: C's identity as the carrier-creating call returned it; session: the id of the session running that call }  -- the value Λ.carrier holds; which call creates the carrier is named in TOOL GROUNDING, so a host without that capability still types this
registered = the mismatches C carries  -- certificate-passing only; a Route/Residual close on an element not yet registered fires before registration and never enters C, while the same close on a registered one lands on an entry C already carries and completes it
entry(m)   = the Entry C carries for m's CURRENT registration, reached by reading C at Λ.carrier when the durable record itself is wanted  -- keyed by the registration, not by the aspect: a mismatch re-registering after an Adapt appends a FRESH entry rather than reusing its closed one, which is what stops pending from reading a stale completed status off a target the run has moved past (the same reason disposed(a) treats re-registration as un-disposing)  -- within a run the status↔ledger equivalence below settles its status from Σ.dispositions, so no read is owed per cycle; there is no per-mismatch entry and no per-mismatch LOCATOR to hold, Λ.carrier naming the whole carrier at once. That is a statement about locators and not about MismatchId: every carried occurrence keeps its id, which is what the trace heads its rows by and what Phase 1 points with
pending    = Set(Mismatch) where entry(m).status ≠ completed  -- a view over the carrier C, reached at Λ.carrier, which is where registration status lives; Σ holds the ledger and the scan count and never held this. A routed/ambiguous mismatch never enters pending, or leaves it where the element was registered before this fold and its re-derived certificate no longer passes; only certificate-passing mismatches are registered
             -- every disposition completes its entry, so `completed` is the single resolved status; there is no separate dismissed state (a Keep is a disposition, not a discard of the entry)
             -- status↔ledger equivalence, SCOPED TO REGISTERED MISMATCHES AND TO THE REGISTRATION AT HAND: ∀ m registered, entry(m).status = completed ⟺ Σ.dispositions holds the record that CLOSED THIS REGISTRATION of m. Every close of a REGISTERED mismatch writes the disposition and completes its entry as ONE action — the Phase 2 dispose step (TOOL GROUNDING dispose), the Phase 1 judgment_relay_overruled close, and the keep_all_remaining bulk close alike — and that single action is what binds a record to the one registration it answers for
             -- NOT keyed on identity, and this is the load-bearing half: identity(m) (TYPES) matches a re-detected mismatch to the registration it SUCCEEDS, and a match discharges nothing. A re-registration always opens its own entry and sits in pending until its own close — whether the return reads as the claim that record closed (unrepaired(m): the repair did not land) or as a claim of its own (owed its own surfacing).
             -- a certificate-assigned close (Route, Residual) on an element not yet registered fires BEFORE registration, so its mismatch has a ledger entry and no tracked entry to complete, and the unscoped statement that holds for it is the Ledger invariant under MODE STATE. On a registered element whose re-derived certificate no longer passes, that close lands on a registration that does exist: it completes that entry and the element leaves pending, exactly as a disposition-assigned close does
Q      = Applicability inquiry (gate interaction) — the family the two concrete gates below instantiate
Qc     = Q at Phase 1: the MISMATCH gate. Presents the selected mismatch scoped by the CURRENT Λ.fit_map — the evidence, fit basis, and adaptation options the user weighs are read at presentation time, so after an Adapt they describe the advanced target and not the one it replaced; answer type A = (Judgment, Disposition)
Qz     = Q at Phase 0: the ZERO-MISMATCH gate. Presents that the scan found no unwarranted aspect AND what the scan reached to say so — both read off the scan that just ran, since an empty Set(Mismatch) says what was found and never how far the looking went; answer type ZeroMismatchConfirmation
Judgment    ∈ {Upheld, Overruled}                              -- EPISTEMIC axis: does the flagged aspect genuinely fail to fit X?
                                                               -- an ESTABLISHED verdict only: reachable via a user answer at Qc or via either judgment_relay arm's cited basis
judgment_settled : Mismatch × F → Option((Judgment, basis: String))   -- judgment-level entropy → 0 with a citable basis (Rule 10); evaluated against the EVALUATED TARGET Λ.R
              -- the basis comes back WITH the verdict: record well-formedness requires judgment_basis ≠ "" wherever judgment_by = relay, and both
              --   relay arms report it before writing, so a bare verdict would leave that citation with no producer
              Some((Upheld, basis))    when the evidence admits no reading under which aspect(m) stands warranted in Λ.R
              Some((Overruled, basis)) when it admits no reading under which aspect(m) FAILS to stand — read off m's own AspectFit entry in
                              Λ.fit_map.fit_justifications, whose own definition is "warranted in X"; basis = that entry's evidence. Membership
                              locates the evidence; the bar above is the condition — an entry whose evidence still admits a reading under which the
                              aspect fails to stand yields None and the judgment stays the user's
              None                     otherwise: the evidence admits more than one reading, so the judgment is the user's
judgment_state = Option((Judgment, basis: String))             -- CYCLE-LOCAL: the relayed judgment for this cycle's Mₛ together with its cited basis
              -- HOLDS A FIELD IN Λ (MODE STATE): cycle-local is not turn-local. It is written at Phase 1, Qc then STOPS and yields the turn, and
              --   the close that follows reads it on the far side of that boundary — so it has to be somewhere in between
              -- written by the Phase 1 judgment dispatch on both arms, so every cycle binds it before its disposition half runs
Disposition ∈ {Adapt(direction: String), Keep, Discard(replacement: Option(Result)), Route(routed_deficit: Deficit), Residual, Moot}
              -- REPAIR axis: what becomes of the result, and how this mismatch is closed
              -- Discard's payload is Option(Result): Some(r) when something takes the withdrawn result's place, None when the withdrawal leaves nothing behind
              --   user-answered at Phase 1        : Adapt(direction), Keep, Discard(replacement)
              --   relay-assigned at Phase 1       : Keep — and ONLY Keep, from its one producer, which edits nothing:
              --     judgment_relay_overruled — well_formed forces the pairing once the evidence settles Overruled
              --   certificate-assigned at registration (never surfaced for answer): Route(routed_deficit), Residual
              --   loop-assigned                   : Moot (a Discard withdrew the Eval target while this mismatch was still pending)
              -- Route/Residual live on THIS axis, so the convergence predicate quantifies over one disposition ledger
ResolutionForm = the axis Disposition ranges over — the SHAPE a resolution takes, answering what becomes of the result. Kind (kind_binding.label
                 and the predicate under it) says what sort of misfit this is; ResolutionForm says what is done about it; RepairSite below says
                 where that lands. THREE ORDERED AXES, and the order is the point (Rule 21)
RepairSite     = THE NAME OF THE THIRD AXIS — where a resolution lands on Λ.R when adapt or discard executes it. A NAME AND NOT A CARRIER:
                 nothing produces it as a value, stores it, or reads it. The locus is settled by the executing tool call and seen by the user in
                 the edit, so a field for it would be state with no reader
                 -- what the axis forbids is upstream use: it does not individuate a mismatch, does not decide how many mismatches there are,
                 --   does not gate registration, and appears in no convergence predicate. Asking it first is the failure Rule 21 names
A      = Answer = (j: Judgment, d: Disposition) where d ∈ {Adapt(direction), Keep, Discard(replacement)}
         -- A ∈ V; drawn from the mismatch's value-space (local_value_space = the two-axis space above)
         -- PRODUCED AT Qc ONLY. Both Phase 1 relay closes write their DispositionRecord straight to the ledger instead, which is what lets
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
         --   assigned_by = relay     ⟹ disposition = Keep ∧ disposition_basis ≠ ""           -- ONE producer, reporting before it writes:
         --     judgment_relay_overruled — judgment_by = relay ∧ judgment = Some(Overruled); reports the retraction and its basis
         --   assigned_by = certificate ⟹ disposition ∈ {Route(_), Residual}
         --   assigned_by = loop      ⟹ disposition = Moot                                   -- withdrawal fallout
ApplicabilityVerdict = { target: R_final, dispositions: List(DispositionRecord), unresolved: Set(Mismatch), scan_count: Nat, carrier: Option(EntryLocator) }
         -- the protocol's terminal object: the result TOGETHER WITH how every flagged aspect was closed.
         -- Keep, Discard, Route, Residual and Moot are terminal exactly as Adapt is; adaptation is ONE disposition among them
         -- ASSEMBLY — every field has a producing step, and they are not the same step:
         --   target      := R_final, bound by whichever terminal fires (the LOOP convergence step, Phase 2 → withdraw, Phase 1 →
         --                  keep_all_remaining, Phase 0 → confirm_no_mismatch / deactivate, or the ESC exit)
         --   dispositions := Σ.dispositions      -- the ledger as it stands at that terminal, whole; the trace ranges over this same list
         --   unresolved   := pending             -- whatever is still open at that terminal. ∅ on every convergent path by construction, since
         --                  convergence is reached only through pending = ∅; non-empty only at the ESC exit. A FIELD rather than narration
         --                  because a verdict read cold is all the next reader has, and this is the one exit where what went unanswered is why
         --                  they are reading it
         --   scan_count   := Σ.scan_count        -- the re-scan counter Phase 2's Adapt arm increments; this binding is its only reader
         --   carrier      := Λ.carrier           -- the locator the Phase 1 registration bound, carried out so the durable record stays reachable after the run; None wherever nothing registered. Emitting it is the whole of what this protocol does across a session boundary: Σ is bound fresh at activation BY DESIGN (accepted(i) is run-scoped, and re-entry returning a mismatch to the gate is a stated property), so no step here dereferences a locator and none is owed
         -- The last four are bound identically at EVERY terminal, so a terminal states only its own R_final and assembles the rest: dispositions and scan_count from Σ, unresolved from the open registrations, carrier from Λ
ContextualizedExecution = ApplicabilityVerdict where (∀ m ∈ registered: entry(m).status = completed) ∧ (Mᵢ = ∅ ⟹ zero-mismatch confirmation obtained: ZeroMismatchConfirmation = AcceptNoMismatch, or Reopen(aspect) whose focused re-scan still yields Mᵢ = ∅ → relay(finding) — Rule 9)
                 -- registered = certificate-passing mismatches only; Route/Residual mismatches are closed by disposition, not adapted in-place
EarlyExit = ApplicabilityVerdict where user_esc  -- non-convergent early exit, and unresolved may be EMPTY: an Esc at the zero-mismatch gate leaves nothing registered, and it is still an exit rather than a convergence, since the confirmation ContextualizedExecution requires was declined rather than given. R_final := Some(Λ.R) (the evaluated target as it stands, adapted or not), dispositions as closed so far, and unresolved := pending — the registrations the exit left open. They get no ledger entry, since an exit closes nothing, so this field is the only place they survive. What tells the two terminals apart is not narration but ContextualizedExecution's own guard, which this fails on one of two counts: a registration left open, or — where nothing registered — the zero-mismatch confirmation declined rather than given

── PHASE TRANSITIONS ──
Phase 0: R → Eval(R, X) → Mᵢ? → bind_kind each [split where non-atomic] → absorb into ∅ [TYPES: the fold every scan path runs — a detection judged the same claim as one already folded in merges into it, one judged new takes init_occurrence's id and unrepaired = false; before certify either way, so a route/Residual close holds a complete Mismatch] → Mᵢ → ∀m ∈ Mᵢ: certify(m, local_claims) → (status = pass) → Mᵢ_passed → AssessFit(R, X, Mᵢ_passed) → F → Λ.fit_map := F  -- applicability checkpoint + registration-time KIND dispatch (fail-closed) + fit map (silent); certify runs WITHIN Phase 0, at registration, not as a separate phase
Phase 0 → confirm_no_mismatch: Mᵢ = ∅ → Qz(zero_mismatch_finding) → Stop → ZeroMismatchConfirmation  -- true zero-mismatch case (distinct from the Mᵢ≠∅∧Mᵢ_passed=∅ trivial-convergence-by-routing case below); AcceptNoMismatch → R_final := Some(Λ.R), deactivate (execution stands as-is, Rule 9); Reopen(aspect) → reopen_focus := aspect → re-scan Eval focused on that aspect → reopen_focus := None (cleared after the focused re-scan, either arm); [Mᵢ ≠ ∅] re-enter the Phase 0 pipeline above (bind_kind → absorb → certify → Mᵢ_passed → bind_value_space → AssessFit → F) and take whichever Phase 0 exit it reaches — Phase 1 where Mᵢ_passed ≠ ∅, the trivial-convergence transition below where the focused scan's detections all routed or landed Residual, since pending is empty on this path and Phase 1 would have nothing to select; [Mᵢ still ∅] relay(finding) → R_final := Some(Λ.R), deactivate (one attempt per aspect) [Tool]
Phase 0 → route_away (mismatch-local): certify(m).status = route        -- a local route claim holds the mismatch (backward misfit) → emit that claim's routed_deficit (GapUnnoticed, ContextInsufficient, BoundaryUndefined — with its command hint), close m with DispositionRecord { judgment = None, judgment_by = unjudged, disposition = Route(routed_deficit), assigned_by = certificate, judgment_basis = "", disposition_basis = the matched local route claim }, drop m from registration — m never enters pending, this fold having found nothing registered to take back out; scan continues with remaining mismatches
Phase 0 → split (pre-certify): KindBinding.atomicity = non-atomic  -- a compound mismatch bundles two distinct aspects → split into atomic sub-mismatches and re-run bind_kind → absorb → certify on each (same Phase 0 pass, before any pass/route/Residual decision) — each child is folded in on its own and is a distinct occurrence where the fold opens one, while the compound never is, absorb running after the split for exactly that reason; recursive until atomic, and terminating because each split strictly decreases the number of bundled aspects. A non-atomic mismatch is split pre-registration, never registered as a compound. WHAT IT SPLITS ON is claim multiplicity and nothing else: one claim standing on evidence that lies in several places is ONE mismatch and is not split here, because how far a repair must reach is a question for the disposition and not for registration (Rule 21)
Phase 0 → deactivate (no in-scope mismatch): Mᵢ ≠ ∅ ∧ Mᵢ_passed = ∅ ∧ adjudicated(Λ.R, X) ∧ pending = ∅  -- mismatches WERE detected but EVERY one carries a certificate-assigned disposition, Route(routed_deficit) or Residual (discharged via disposed(a), CONVERGENCE) — no mismatch the own claim holds enters the disposition loop → trivial convergence: R_final := Some(Λ.R), emit the routed deficits with their command hints (/gap, /inquire, /bound) and deactivate without adapting Λ.R. An ambiguous certificate is not an exception to this path: it closes its mismatch as Residual at registration, exactly as a route does, so the aspect is disposed and nothing is left waiting
Phase 1: Mᵢ_passed → ∀m ∈ Mᵢ_passed: m.value_space := Some(bind_value_space(m)) [the third leg of the registration pipeline Rule 17 fixes in strict order — KindBinding, then the passing certificate, then the value space — so it runs HERE, between the pass filter and registration, and not at selection: every reader downstream needs it to already exist. The Phase 1 relay close reasons about which pairings well_formed leaves, and Qc draws A ∈ V from it] → record[C ← all certificate-passing initial mismatches, each carrying its id] → Λ.carrier := Some(locator(C)) → pending → SelectNext(pending, Λ.fit_map) → Mₛ → judgment_settled(Mₛ, Λ.fit_map)? →  -- register all certificate-passing initial mismatches, surface selected mismatch with fit basis [Tool]; reached only when Mᵢ_passed ≠ ∅. TWO-LEVEL DISPATCH — the JUDGMENT half resolves first, then the DISPOSITION half; the gate is where the disposition half always lands:
         JUDGMENT HALF, off judgment_settled(Mₛ, Λ.fit_map) — always computed against the CURRENT Λ.R and Λ.fit_map:
         [Some(Overruled)] judgment_relay_overruled (below) closes BOTH halves — NO Qc, no Stop, no turn yielded; control returns to SelectNext over the remaining pending
         [Some(Upheld)]    judgment_relay_upheld (below) settles the judgment half: judgment_state := Some((Upheld, basis)) → DISPOSITION HALF
         [None]            no judgment settles; judgment_state := None → DISPOSITION HALF
         DISPOSITION HALF, reached from either arm above and having ONE arm: Qc(Mₛ scoped by the CURRENT Λ.fit_map, evidence, judgment_state) → Stop → A = (j, d)
                                -- the disposition is user-answered, and the judgment half with it when judgment_state = None. NO RELAY REACHES THIS HALF
                                -- on its own account: what becomes of the result turns on what the user weighs, and no evidence collapses that
Phase 1 → judgment_relay_upheld (mismatch-local): judgment_settled(Mₛ, Λ.fit_map) = Some(Upheld) — the evidence for ¬warranted(aspect(Mₛ), Λ.R, X) admits no reading under which the aspect stands warranted; judgment-level entropy → 0 with a citable basis (Rule 10)  -- relay j := Upheld with the basis cited: judgment_state := Some((Upheld, basis)), which the close downstream reads as judgment_by = relay. Drop the Overruled/Keep pairing from the presented set and hand to the DISPOSITION HALF: Qc fires and yields turn. The turn is not yielded for the judgment half. When judgment_settled(Mₛ, Λ.fit_map) = None, judgment_state := None, the full two-axis set is presented, and j is user-answered (judgment_by = user)
Phase 1 → judgment_relay_overruled (mismatch-local, CLOSES the mismatch): judgment_settled(Mₛ, Λ.fit_map) = Some(Overruled) — the evidence admits no reading under which aspect(Mₛ) FAILS to stand, read off that aspect's own AspectFit entry in Λ.fit_map.fit_justifications and the evidence it cites (the membership/condition distinction: TYPES). well_formed(Overruled, d) leaves d = Keep as the sole pairing, so the answer set has collapsed to one and no gate is owed (Rule 10)  -- REQUIRED FIRST: report the flagged aspect, that it is being retracted, and the cited fit evidence, as text. THEN close Mₛ with DispositionRecord { judgment = Some(Overruled), judgment_by = relay, disposition = Keep, assigned_by = relay, judgment_basis = the cited fit evidence, disposition_basis = that same evidence — the ONE close where the two grounds coincide, because Keep is what well_formed leaves once the verdict is Overruled } AND record update(Λ.carrier, entry(Mₛ).status := completed) as ONE step, so Mₛ leaves pending before anything else runs. Λ.R is untouched, no Mₑ, no re-scan; the turn is NOT yielded. Continue to SelectNext over the remaining pending — or, when this close empties it, to convergence (CONVERGENCE: gateless convergence) [Tool]
Phase 1 → keep_all_remaining (bulk exit): the user declares the remaining mismatches acceptable as-is rather than answering them one at a time  -- guard: pending ≠ ∅ ∧ the declaration is a free-response at Qc. EVERY m ∈ pending is closed with DispositionRecord { judgment = None, judgment_by = unjudged, disposition = Keep, assigned_by = user, judgment_basis = "", disposition_basis = the bulk declaration } and record update(Λ.carrier, entry(m).status := completed) — EXCEPT Mₛ when judgment_state = Some((Upheld, basis)) for this cycle, which is closed with { judgment = Some(Upheld), judgment_by = relay, disposition = Keep, assigned_by = user, judgment_basis = that cited basis, disposition_basis = the bulk declaration }. The declaration disposes of every mismatch, so it grounds the disposition half everywhere; a relayed verdict grounds only its own half, on the one mismatch it was relayed for. (Only the Upheld arm can reach here: judgment_relay_overruled has already closed its mismatch and left pending.) R_final := Some(Λ.R); deactivate [Tool]
Phase 2: A = (j, d) → dispose(Mₛ, j, d) → [ORDER: dispose appends DispositionRecord{ mismatch = Mₛ, judgment = Some(j), judgment_by = relay when judgment_state = Some((Upheld, _)) for this cycle else user, disposition = d, assigned_by = user, judgment_basis = that relayed basis when the verdict was relayed, else the ground the user gave for the VERDICT, disposition_basis = the ground the user gave for the DISPOSITION } to Σ.dispositions AND record update(Λ.carrier, entry(Mₛ).status := completed) as ONE step, so Mₛ leaves pending before any arm below runs. Reached only from Qc; the relay-assigned close is written by judgment_relay_overruled at Phase 1] →
         [d = Adapt(direction)] adapt(direction, Λ.R) → R' [mutating — transformative revalidation] → Λ.R := R' [TARGET SUCCESSION] → Eval(Λ.R, X) → ∀ detected m: bind_kind(m) [split where non-atomic] → match_identity(m) against pending and against Mₛ → absorb into pending [TYPES: the SAME fold Phase 0 runs, the only difference being that the set folded into is non-empty here. A detection judged the same claim as an element already carried merges into it — that element keeps its id and its statement of the claim while its evidence takes in the detection's, takes the combined current reading, and takes the detection's stamp through merge's disjunction; the detection itself registers nothing, and whether the element it merged into registers turns on registered(e): one carried in from an earlier scan has its entry already, while one this same fold opened does not and still registers as a member of Mₑ_passed. Every detection carries a stamp decided before either arm, unrepaired := (m reads as the same claim as Mₛ, off identity) — Mₛ being the mismatch THIS cycle's dispose just closed by adapting, and no other record (CONVERGENCE, unrepaired(m)); a detection judged new takes init_occurrence's id and carries its stamp onto the element it opens, one judged the same contributes its stamp through merge's disjunction. Merging rather than leaving the carried element on its earlier reading is REQUIRED, not cosmetic: disposed(a) is aspect-keyed, so an element left holding a superseded aspect can never be discharged] → Mₑ := what the fold opened → [BEFORE certify: every m ∈ Mₑ is closed one way or another, so the stamp is not gated on the certificate filter] → ∀m ∈ touched: certify(m, local_claims) → ∀m ∈ touched: m.value_space := Some(bind_value_space(m)) where status = pass, None otherwise — total on both outcomes, since a merged element that carried a space and stopped passing must not keep it [same registration leg as Phase 0, Rule 17] → Mₑ_passed := the passing members of Mₑ — registration is for what the fold OPENED, an element already registered before this fold having nothing to register → record update(Λ.carrier, add all Mₑ_passed AND bring into line the entry of every touched element that was ALREADY REGISTERED before this fold — registered(e), never "was merged into", since an element opened and then merged into this same scan has no prior entry to bring into line and is added as one of Mₑ_passed instead) [Tool] — one write, because a carrier entry is a separate copy outside Σ and an element left behind would show a superseded target on a durable record, which disposed(a) being aspect-keyed would then never discharge → pending   -- Λ.carrier is Some here by construction: this arm is reached only through a Qc answer, and Qc is reached only after the Phase 1 registration that binds it → AssessFit(Λ.R, X, pending) → F' → Λ.fit_map := F' → Σ.scan_count += 1
         [d = Keep] non-mutating adjudication — no adapt, no Mₑ, no re-scan; Λ.R stands as whatever earlier Adapt dispositions left it as
         [d = Discard(replacement)] → Phase 2 → withdraw (below)
         -- Adapt alone advances the evaluated target as a succession of it (Λ.R := R'), which is what triggers the re-scan + registration-time certify of emerged mismatches; the re-scan table is LOOP's [Tool]
Phase 2 → withdraw (run-terminal): d = Discard(replacement) ∧ j = Upheld  -- the user upholds the mismatch and WITHDRAWS the evaluated result instead of adapting it. discard(replacement, Λ.R) [mutating, TOOL GROUNDING discard → artifact write: the artifact is actually withdrawn and the replacement put in its place, or removed outright when replacement = None] → THEN R_final := replacement (already Option(Result): None when the withdrawal leaves nothing in its place); Λ.withdrawn := Some((Mₛ, replacement)); then EVERY mismatch REMAINING in pending — Mₛ already left it at the dispose step above, so it cannot be closed twice — is closed with DispositionRecord { judgment = None, judgment_by = unjudged, disposition = Moot, assigned_by = loop, judgment_basis = "", disposition_basis = the withdrawal record } and record update(Λ.carrier, entry(m).status := completed for each). NO re-scan; deactivate. The adjudication claim stays on Λ.R (the object actually evaluated): every flagged aspect of it carries a ledger entry, and NO claim is made about the replacement
Phase 2 → route_away (mismatch-local): certify(m).status = route        -- an emerged mismatch a local route claim holds → emit that claim's routed_deficit, close m with disposition Route(routed_deficit) (assigned_by = certificate); where m is not yet registered it is dropped before registration, and where it is, the close completes that entry and m leaves pending; re-scan continues
Phase 2 → split (pre-certify): KindBinding.atomicity = non-atomic  -- emerged compound mismatch → split into atomic sub-mismatches, then re-bind_kind → absorb → certify each (same re-scan pass); never registered as a compound. The split runs BEFORE absorb, which reads identity(m)

── LOOP ──
Transformative revalidation (NON-MONOTONE): this loop mutates the very object its detector evaluates. An Adapt disposition produces R', and Eval(R', X) re-targets the detector at the mutated result — so an adaptation can BREED new mismatches Mₑ that did not exist before. "Transformative revalidation" labels the ADAPT disposition; the table below gives each disposition's re-scan behavior.
After Phase 2, re-scan is disposition-keyed, not answer-keyed:
  Adapt(direction)      → re-scan R' against X for remaining AND newly emerged mismatches (mandatory)
  Keep                  → non-mutating; breeds no Mₑ; no re-scan
  Discard(replacement)  → the Eval target is gone; no re-scan is possible or meaningful; run terminates via Phase 2 → withdraw
  Route / Residual      → certificate-assigned, never surfaced for answer; the scan continues with the remaining mismatches
A relay-assigned Keep never reaches Phase 2 at all: judgment_relay_overruled closes its mismatch inside Phase 1, non-mutating, breeding no Mₑ and triggering no re-scan, and control returns directly to SelectNext over the remaining pending.
ONE ELEMENT PER CLAIM IN pending is what every scan is directed to reach, not a property the contract can guarantee — sameness is judged, and a judgment carries no invariant.
Mₑ is what the fold OPENED. Eval's output is bound and split FIRST, since everything below reads the binding, then absorbed one detection at a time into what this pass carries — the set starting as pending and growing by whatever the fold opens (TYPES, absorb): a detection judged the same claim as an element already carried merges into it and opens nothing, one judged new enters on its own and is a member of Mₑ. A merge is not a drop — the detection carries this target's reading of a claim registered against an earlier one, and merge combines that reading into the element rather than discarding it, field by field (TYPES, merge, whose field list is total). Because each merge feeds the element the next detection meets, two detections of one claim cannot race to overwrite each other. A mismatch CLOSED earlier in this run is not excluded from the fold either, and which arm it takes is judged like any other detection's: where it opens an element it re-registers, which un-disposes its aspect (disposed(a), CONVERGENCE) so no record written for an earlier registration can carry a terminal; where it instead reads as a claim already pending it merges, opening nothing, and that element was never disposed to begin with. Re-registration follows the open arm and is not owed by a return as such. The ledger match locates the record a return succeeds and discharges nothing (status↔ledger equivalence, pending); what it settles is whether unrepaired is stamped — where m reads as the same claim as Mₛ. A re-registration reaches Qc like any other pending mismatch, whatever the user answered for an earlier one: the target has moved, so the question is new.
Bind + certify each element the fold TOUCHED (fail-closed) — whatever it opened or merged into, the two overlapping rather than dividing, and a merged element's evidence having grown so its earlier fit no longer answers for it: only certificate-passing members of what the fold OPENED (Mₑ_passed) are registered into pending, an element carried in already registered having nothing to register; a routed mismatch is closed with Route(routed_deficit) and handed to that deficit (GapUnnoticed, ContextInsufficient, BoundaryUndefined — command hints /gap, /inquire, /bound); a non-atomic compound mismatch is split into atomic sub-mismatches and re-certified; an atomic ambiguous mismatch is closed as Residual, before registration. AssessFit classifies tracked mismatches but never suppresses them.
Recompute the fit map over pending and re-bind Λ.fit_map to it before selecting the next surfaced mismatch, even when Mₑ_passed = ∅. FIT-MAP SUCCESSION, the counterpart of TARGET SUCCESSION: every reader takes Λ.fit_map at the moment it reads, never a fit map computed against an earlier Λ.R.
CHECKED IN THIS ORDER:
  1. If pending non-empty: return to Phase 1 (SelectNext by severity, then FitRank, then oldest registered mismatch).
  2. Otherwise, if adjudicated(Λ.R, X): every flagged aspect carries a DispositionRecord → [Λ.withdrawn = None] R_final := Some(Λ.R) → assemble the verdict (below) → convergence.
Step 1 runs first so a re-registered aspect can never be read past. Step 2 is the SOLE R_final binding on the ordinary path — a Keep answered mid-loop leaves it unbound, since a later Adapt still advances Λ.R; the withdrawal path is excluded because Phase 2 → withdraw already bound R_final to the replacement
progress(Λ) MAY REGRESS: re-scan over a mutated R' can register newly certified mismatches, so the disposed/total ratio is non-monotone — expected, not an error.
User can exit at Phase 1 by declaring the remaining mismatches acceptable as-is (Phase 1 → keep_all_remaining, which closes each with an unjudged Keep — except a mismatch whose judgment was relayed this cycle, which keeps that verdict and its cited basis), or by Esc.
Continue until: contextualized(Λ.R) OR user ESC (EarlyExit, not ContextualizedExecution).
Mode remains active until convergence or explicit user exit (Esc).
On user ESC: R_final := Some(Λ.R); present partial transformation trace ranging over Σ.dispositions as accumulated so far, AT THE SAME GRANULARITY the converged trace uses — one row per DispositionRecord grouped under its aspect (Convergence evidence, above): a run that stops mid-move is where the move most needs to survive, so this is the last exit that may collapse it, then declare remaining pending mismatches as unresolved residual — they receive no DispositionRecord, which is why an exit yields EarlyExit rather than ContextualizedExecution (disposed(a) fails for them).
Convergence evidence: At adjudicated(Λ.R, X), present the transformation trace ranging over Σ.dispositions — ONE ledger, since every close writes a record there whoever assigned it. ONE ROW PER DispositionRecord, GROUPED UNDER THE ASPECT, EACH ROW HEADED BY ITS id — the range and the row unit are the same thing, so a certificate-assigned close (Route, Residual) takes a row like any other, whether or not it ever registered — it may close an element registered before that fold, completing that element's entry — since absorb ran before certify and every element it yields carries an id — taken at init_occurrence or inherited through a merge — so there is one to head the row. An aspect closed more than once across TARGET SUCCESSION carries a record per close, and each keeps its own row in close order under that aspect rather than collapsing into the last one. Where consecutive rows under one aspect stand on different evidence, each says what its own close rested on, since that is what separates them — the aspect name does not. The id is what a reader points AT: it is the one thing on the row that is unique to it, so a decision taken about a row (carry this one on, split it out, leave it) survives being written down away from the trace.
  Each row also carries two readings the ledger supports and a label cannot. RETURNED: where this row's identity matches an occurrence already closed, the row names the MOST RECENTLY CLOSED such occurrence — one id, chosen by close order, so the reading stays decidable when several share that identity. CIRCLING: where one identity has accumulated several occurrences across the run, the count is stated once beside them — A FRAMING SIGNAL AND NOT A SCORE, saying the run keeps returning to this claim and nothing about how near convergence is (Rule 22).
  Each row still notes whether the occurrence it closed was stamped unrepaired — an adaptation the user asked for that did not take is the one thing a converged run must not report as simply resolved; the stamp answers only for the occurrence it was written on. For each row show (id → aspect → judgment → disposition) at its close, reading:
  Upheld → Adapt(direction)     : in-scope, adapted in place — ApplicationDecontextualized(m) resolved by adaptation
  Upheld → Keep                 : in-scope and accepted as-is — an ACCEPTED RESIDUAL, distinct from Overruled → Keep
  Overruled → Keep              : the aspect did not stand; nothing to repair — the user's own retraction, answered at Qc
  Overruled → Keep (relayed)    : the same close reached without a gate, because the fit evidence admitted no other reading (judgment_by = relay, assigned_by = relay, basis cited). Printed apart from the row above so the user can tell which retractions were theirs and which the protocol made on cited evidence
  Upheld → Discard(replacement) : the evaluated result was withdrawn rather than adapted; the replacement is what the user is left with (not itself adjudicated)
  (unjudged) → Keep             : closed by a bulk keep-all-remaining declaration — disposed without an individual verdict. The one mismatch whose judgment was relayed that cycle prints as Upheld → Keep instead
  (unjudged) → Route(routed_deficit) : a local route claim holds m — an attribution finding, not a verdict on fit
  (unjudged) → Residual         : unattributable on the evidence at hand, closed by its certificate; surfaced as a non-blocking residual
  (unjudged) → Moot             : still pending when a Discard withdrew the target; never judged
Convergence is demonstrated, not asserted.

── CONVERGENCE ──
-- DOMAIN NOTE: applicable / warranted / adjudicated / contextualized all range over the EVALUATED TARGET Λ.R — always a Result, never
--   Option-valued — and never over ApplicabilityVerdict.target. The two coincide on every path except withdrawal, where target is the
--   replacement and Λ.R is the withdrawn result. The protocol claims fit only for the object it actually evaluated.
applicable(Λ.R, X) = ∀ aspect(a, Λ.R, X) : warranted(a, Λ.R, X)
warranted(a, R, X) = fits(a, R, X)                          -- the per-aspect fit judgment, and NOTHING ELSE. Correctness is not a conjunct here
                     -- WHY THERE IS NO correct(R) HALF: every reader of this predicate substitutes the CURRENT target — adjudicated(Λ.R, X) does,
                     -- and Λ.R advances at every Adapt — so a correct(R) conjunct would read correct(R') after an adaptation. Nothing in the run
                     -- can produce that: Eval reports applicability mismatch and never correctness. Convergence would then rest on a fact no step
                     -- discharges, and a run whose adaptation broke the result would stall with pending empty and no terminal reachable. Worse in
                     -- the ordinary case, converging would ASSERT correct(Λ.R) for every aspect never flagged — the exact claim the adapted verdict
                     -- below declines to make. The conjunct did two wrong things at once and neither survives its removal
                     -- WHERE CORRECTNESS ACTUALLY LIVES: in the deficit and the activation guard, both read at ENTRY of the result this protocol
                     -- received, and both already carry their own correct(R) conjunct (decontextualized, Core Principle, Gate specificity). It is a
                     -- PRESUPPOSITION of activation — a result that is not correct is not this protocol's case — and target succession neither
                     -- re-opens it nor re-asserts it. What an adaptation did to correctness is OUTSIDE WHAT THIS PROTOCOL ESTABLISHES
                     -- (COMPOSITION), which states that boundary as its own silence rather than as anyone else's duty
                     -- FITS RANGES OVER THE ASPECT, which is what lets one aspect fail while its siblings stand. An aspect-invariant predicate here
                     -- would make adjudicated — quantified per aspect — unsatisfiable the moment any mismatch is left standing, since aspects never
                     -- flagged carry no record and fail disposed(a) too. A run that adapts nothing must converge as fully as one that adapts everything
disposed(a)        = (∃ r ∈ Σ.dispositions : aspect(r.mismatch) = a) ∧ a ∉ { aspect(m) : m ∈ pending }
                     -- ONE disjunct covering every way a flagged aspect is closed — Adapt, Keep, Discard, Route, Residual, Moot — since all
                     -- six are members of the Disposition axis and every close writes one ledger entry
                     -- SECOND CONJUNCT: re-registration UN-DISPOSES the aspect. A record is written about the target as it stood when the
                     -- close happened, and TARGET SUCCESSION then advances Λ.R past it, so an aspect adapted at one cycle and re-registered
                     -- at the next is pending again rather than disposed from a record written for the registration before it
                     -- WHAT THE LABEL DOES HERE, AND WHAT IT DOES NOT: it names the aspect this predicate quantifies over, and decides nothing
                     -- else. Whether a re-detected mismatch is one a record already closed is settled by identity(m) (TYPES) — the predicate the
                     -- binding asserts together with the evidence it stands on — and a match locates that predecessor WITHOUT transferring its
                     -- close, so the return is in pending either way — in an entry the fold opened for it, or in the entry of the
                     -- element it merged into — which is what fails the second conjunct while it is open.
                     -- TWO CONJUNCTS AND NO MORE: every flagged mismatch is either closed with its own record or in pending, an ambiguous
                     -- certificate closing at registration exactly as a route does, so there is no third place an aspect can be waiting in. It costs no reachability, the attempt resolving on every arm. Nothing here assumes aspects stay stable or uniquely labelled across the R→R' trajectory
unrepaired(m)      = m.unrepaired                              -- READS THE STAMP the re-scan wrote; it is NOT re-derived from the ledger here
                     -- A REPAIR THAT DID NOT LAND: m came back from the re-scan reading as the claim a record closed by adapting. This is what
                     -- re-scanning alone cannot say — a re-scan reports that the mismatch is there, not that an answer already given failed to
                     -- land. The stamp answers that and no more: it does not separate an adaptation that did nothing from one that landed in part
                     -- WRITTEN at one turn and one only: the re-scan immediately following the close, which is where the absence or return of the
                     -- identity is observable and where match_identity already runs (TOOL GROUNDING). A query over the ledger afterwards cannot
                     -- replace it — the ledger only appends, so it cannot separate a repair that failed from an identity a later Adapt re-introduced
                     -- DECIDED AGAINST Mₛ ALONE at that turn — the mismatch this cycle's dispose closed by adapting, and no other record. Widening
                     -- the comparison to the ledger reachable there puts that same conflation back inside the stamp (PHASE TRANSITIONS)
                     -- READ BY the Phase 1 surfacing, which reports it so the user is not asked to re-answer blind, and by the convergence trace.
                     -- It GATES nothing: the mismatch is surfaced on its own merits either way, and what this changes is what the user is told
adjudicated(Λ.R, X) = ∀ aspect(a, Λ.R, X) : warranted(a, Λ.R, X) ∨ disposed(a)
contextualized(Λ.R) = adjudicated(Λ.R, X)
trivial convergence (all-disposed at registration): when Mᵢ ≠ ∅ but Mᵢ_passed = ∅ AND every flagged aspect is closed with a certificate-assigned disposition, Route(routed_deficit) or Residual — aspect-keyed via disposed(a) over the atomic (post-split) aspects — (pending = ∅), adjudicated(Λ.R, X) holds by disposed(a) for every flagged aspect (and warranted for the rest) — Λ.R is unadapted, R_final := Some(Λ.R), and contextualized(Λ.R) holds. This is the Phase 0 → deactivate (all-routed) path. Distinct from the no-mismatch case (Mᵢ = ∅, every aspect warranted from the start) — here aspects were flagged but every one is held by a local route claim rather than by the own claim
gateless convergence: when the Phase 1 relay judgment_relay_overruled closes the last mismatch in pending, adjudicated(Λ.R, X) follows from disposed(a) for every flagged aspect, and R_final := Some(Λ.R) — the ordinary non-withdrawal result equation, reached without a final gate. Neither relay close performs an adaptation, so Λ.R stands as whatever earlier Adapt dispositions left it as
-- WHAT AN ADAPTED VERDICT DOES NOT CLAIM: where any Adapt disposition fired, R_final is the adapted result and the verdict claims FIT for it — every
--   flagged aspect closed, the result suiting X as adjudicated. It makes NO correctness claim about it: correctness was the presupposition the run
--   entered on (warranted, above), the adaptation moved the artifact, and no step here re-established it. Checking that the adapted result still works
--   rests on a different ground than fit and is NOT ESTABLISHED ANYWHERE IN THIS PROTOCOL — deliberately, this artifact being built to run inside
--   another loop (COMPOSITION, contextualize ∘ caller-loop). The contract names no one who must do it instead, having no way to bind them; what it
--   states is its own silence. The trace says so, for the same reason withdrawal convergence says it of the replacement: a reader
--   handed a fit finding must not read a correctness finding out of it
withdrawal convergence: when a Discard(replacement) disposition fires (Phase 2 → withdraw), every mismatch remaining in pending is closed as Moot, so disposed(a) holds for every flagged aspect of Λ.R and adjudicated(Λ.R, X) follows without any re-scan. R_final := replacement records what the user is left with, and the verdict makes NO adjudication claim about it — the protocol never evaluated it. Re-entering Epharmoge with the replacement as R is how it gets checked
certificate gate:  every registered mismatch carried certificate.status = pass (fail-closed, at registration) — a routed/ambiguous mismatch never entered pending, or left it when a re-derived certificate stopped passing on an element registered before that fold, so an adapted R' is assembled only from mismatches the own claim holds (claimed_by = {ApplicationDecontextualized}), fit-certified; backward misfit was handed forward as its routed_deficit (GapUnnoticed, ContextInsufficient, BoundaryUndefined), not adapted in-place. The pass certifies LOCAL admissibility — epharmoge's own gate over epharmoge's own activation — not the absence of a claim anywhere in the wider protocol set
-- stratification: applicable(Λ.R, X) ⊆ adjudicated(Λ.R, X)
-- operational proxy: ∀ m ∈ registered: entry(m).status = completed ⟹ adjudicated(Λ.R, X) ⟹ contextualized(Λ.R)
--   the proxy rests on the status↔ledger equivalence at pending, scoped to registered mismatches. A certificate-assigned close carries no
--   record in the carrier where the element was never registered — covered by disposed(a) directly; where it WAS
--   registered before that fold, the close completes its existing entry as any other close does
progress(Λ) = 1 if |registered| = 0 else |resolved| / |registered|   -- resolved = the registered mismatches carrying a DispositionRecord in Σ.dispositions (matches the ContextualizedExecution resolution contract)   -- |registered| = 0 (Mᵢ = ∅, or Mᵢ≠∅∧Mᵢ_passed=∅ trivial convergence via routing) is fully converged, not undefined — the Mᵢ = ∅ leg only after the Rule 9 zero-mismatch confirmation (AcceptNoMismatch, or Reopen whose focused re-scan stays ∅); otherwise NON-MONOTONE: may regress when re-scan over the mutated R' registers newly certified mismatches (transformative-revalidation signature)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Eval   (sense)   → Internal analysis (no external tool)
Qz / ZeroMismatchConfirm (constitution) → present (conditional: Mᵢ = ∅; zero-mismatch finding + reasoning; AcceptNoMismatch / Reopen(aspect) — Rule 9)
reopen_relay (extension) → TextPresent+Proceed (conditional: Reopen(aspect) focused re-scan still yields Mᵢ = ∅ → relay the still-zero finding and deactivate; one attempt per aspect, basis = the focused Eval re-scan)
reopen_focus (track) → Internal state update (set at Reopen(aspect), threads the focused Eval re-scan, cleared after the re-scan — consumed once, either arm)
bind_kind (sense)   → Internal analysis (capture each detected mismatch as a KindBinding {label, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity}. atomicity carries the backbone's meaning — how many distinct aspects this binding bundles — so a detector output asserting two claims lands non-atomic and is split into one atomic sub-mismatch per claim before certify. It is never asked how far a repair would reach: one claim standing on evidence in several places is atomic, and where a repair lands is projected later from an answered disposition (RepairSite, Rule 21). Runs before certify and before absorb — both read the binding)
absorb (track)      → Internal state update (folds this scan's detections into what the protocol already carries, one at a time, at the one position every scan path states: after split, before certify. Per detection it routes on a judgment it does not make itself — match_identity names the carried element that states this claim, or none — and then either merges the detection into the element named or hands it to init_occurrence. The merged element is what the next detection is judged against, so nothing an earlier detection carried is overwritten by a later one — which is what it buys, and not order-independence (TYPES, absorb). It performs no user interaction and touches no artifact: the carrier write happens later, at the registration leg, because absorb runs BEFORE certification and a write here would persist detections the fail-closed filter has not seen — and at Phase 0 there is no carrier yet to write to)
init_occurrence (track) → Internal state update (writes id and unrepaired onto a detection absorb judged NEW, and is reached on that arm alone. It is the sole producer of the handle. It performs no user interaction and touches no artifact)
bind_value_space (track) → Internal state update (generates a mismatch's answer space from its passing certificate and writes it to that mismatch's own value_space field, which is what associates the space with the occurrence its readers will look it up on; the third leg of the registration pipeline, running between the pass filter and registration on BOTH scans, over every element the fold TOUCHED and passing — which is all of Mᵢ_passed at Phase 0 and is wider than Mₑ_passed at the re-scan, an element whose evidence the fold grew having its space re-derived from the grown binding, and registering only if it was not registered before this fold — per the strict order Rule 17 fixes. Every downstream reader needs it already bound: both Phase 1 relay closes reason about which pairings well_formed leaves, and Qc draws A ∈ V from it)
match_identity (sense) → Internal analysis (on EITHER scan, after bind_kind + split and before certify — it is the judgment absorb routes on, so it runs wherever the fold does: compare identity(m) — the binding's positive_predicate together with the evidence set it stands on — against what the fold already carries, and against Mₛ. Those are the two readings it settles and it settles nothing else: WHICH carried element, if any, states this claim (absorb's arm — merge into the one it names, a new element where it names none), and whether unrepaired is stamped. It yields the element rather than a yes/no, because that is what merge takes and because nothing here guarantees only one carried element could read plausibly. It does NOT scan the rest of Σ.dispositions: accepted(i) and RETURNED each judge the ledger at their own turn, on the target standing then, so a judgment made here against those records would have nowhere to land and no reader — m read as the same claim as Mₛ and nothing weaker. It reads no id and assigns none (TYPES, MismatchId). THIS TURN IS WHERE unrepaired IS DECIDED and the only one where it can be (CONVERGENCE, unrepaired(m)). It never completes the new registration's entry — a record answers only for the registration it closed)
certify (extension) → Internal analysis (fail-closed DeficitFitCertificate; fit of KindBinding.positive_predicate against the own claim and the route claims inscribed in this SKILL.md, reading nothing outside this file: claimed_by = {ApplicationDecontextualized} when the own claim holds alone; status = pass | route | ambiguous; basis = the cited claim fit, shown at the mismatch's Phase 1 surfacing. Relay (Extension): the fit is grounded in a citable source, and an unclear fit returns status = ambiguous → defer. Runs over every element the fold TOUCHED — within Phase 0 for Mᵢ, within the Phase 2 re-scan for what that fold opened or merged into — before an opened mismatch enters pending, and on a merged one against the evidence its binding has just taken in)
AssessFit (sense) → Internal analysis (no external tool)
judgment_relay_upheld (extension) → TextPresent+Proceed (conditional: judgment_settled(Mₛ, Λ.fit_map) = Some(Upheld) — the evidence for ¬warranted(aspect(Mₛ), Λ.R, X) admits no reading under which the aspect stands warranted, i.e. judgment-level entropy → 0 with a citable basis, Rule 10. Relay j := Upheld with the basis shown (judgment_state := Some((Upheld, basis))), drop the Overruled/Keep pairing from the presented set, and PROCEED to the DISPOSITION HALF without yielding the turn for the judgment half. Covers the JUDGMENT axis only — the Phase 1 dispatcher routes that half, to keep_carried_forward or to Qc)
judgment_relay_overruled (extension) → TextPresent+Proceed (conditional: judgment_settled(Mₛ, Λ.fit_map) = Some(Overruled) — the evidence admits no reading under which aspect(Mₛ) fails to stand, read off that aspect's AspectFit entry in Λ.fit_map.fit_justifications (the membership/condition distinction: TYPES). well_formed leaves (Overruled, Keep) as the sole pairing, so the option set has collapsed and no gate is owed, Rule 10. REQUIRED: report the flagged aspect, the retraction, and the cited fit evidence as text BEFORE writing anything; a retraction relayed without that report is a protocol violation. Then close Mₛ with an (Overruled, Keep) DispositionRecord (judgment_by = relay, assigned_by = relay) + record update(Λ.carrier, entry(Mₛ).status := completed) as one step, and PROCEED without yielding the turn. Λ.R is untouched, so no artifact permission is exercised. CORRECTING a disputed retraction is DELEGATED, not compiled: this guard reads Λ.fit_map, derived from (Λ.R, X), so re-entering on the same input reproduces the same close. Within the run the aspect returns to judgment only where a later Adapt re-registers it, and then against the recomputed Λ.fit_map — never on the strength of an objection. What the user reaches for is the interrupt, available throughout the run rather than built per relay (esc, below). This is what makes the report required rather than optional — it puts the reading in front of the user while this close is still unwritten)
Qc     (constitution)    → present (fires wherever the disposition is still open, because there the answer turns on what the user weighs and the turn is owed: Adapt(direction) / Keep / Discard(replacement), with the Overruled/Keep pairing included when the judgment is not settled. Where well_formed has already collapsed the answer to a single pairing that edits nothing, the disposition is not open and that close relays instead — the same test reaching its other value; Esc key → loop termination at LOOP level, not an Answer)
adapt  (transform) → artifact write (Adapt(direction) disposition: result adaptation based on user direction)
discard (transform) → artifact write (Discard(replacement) disposition: withdraw the result and put the replacement in its place, or remove it outright when the withdrawal leaves nothing behind)
                    -- these two are the ONLY steps that touch the artifact, so they are the only place a repair locus exists at all. It exists as
                    --   the edit this call makes and nowhere else: no field on Mismatch, KindBinding or DispositionRecord holds it, and no
                    --   predicate reads it. That is what keeps the three axes ordered rather than merely named (RepairSite, Rule 21)
                    -- (transform): tool call that changes existing artifacts; medium-agnostic (files, analysis text, generated content)
route  (extension)   → TextPresent+Proceed (certificate.status = route → emit the matched route claim's routed_deficit as a backward-misfit recommendation: decision gap → GapUnnoticed (hint /gap), missing pre-execution fact → ContextInsufficient (hint /inquire), undefined convention/dependency ownership → BoundaryUndefined (hint /bound); the deficit is read off the matched local route claim, basis cited, and the command travels only as a hint; closes the mismatch with disposition Route(routed_deficit))
dispose (track)  → Internal state update + record update(Λ.carrier), performed as ONE step (append the DispositionRecord for the closed mismatch to Σ.dispositions — user-, relay-, certificate-, or loop-assigned — and, in the same amendment, write that record onto the mismatch's entry and complete it. The record goes to BOTH: Σ is what this run reads, and the entry is what outlives it — a relayed judgment the MODE STATE note sends across a session boundary is recoverable only because the amendment puts it there). Every close in the protocol goes through this step, whichever phase invokes it: the record half is unconditional, and the record update half fires exactly when the mismatch was REGISTERED. A certificate-assigned close (Route, Residual) on an element not yet registered runs before registration and so has no tracked entry to complete — it appends its record and stops there; on a registered one both halves fire and the element leaves pending. For a registered mismatch, doing both halves together is what removes the mismatch from pending before any bulk close can reach it. This ledger is what the convergence trace ranges over, and what the terminal verdict's dispositions field is assembled from
keep_all_remaining (track) → Internal state update + record update(Λ.carrier) through the dispose step above (no gate opens here: present is already open at Qc, and the declaration arrives as a FREE RESPONSE there rather than as a peer option). On arrival, dispose every m ∈ pending with an unjudged Keep (judgment = None) whose disposition_basis is the declaration itself — EXCEPT Mₛ when judgment_state = Some((Upheld, basis)) for this cycle, which additionally carries that verdict, judgment_by = relay, and that cited basis as its judgment_basis — then deactivate. The record shape is the transition's: PHASE TRANSITIONS Phase 1 → keep_all_remaining
Mᵢ/Mₑ (track)   → record/record update (mismatch tracking in ONE carrier entry: the creating write at Phase 1 returns the identity Λ.carrier holds, and re-scan registration amends that same entry. Per-mismatch entries are NOT written — a single dereferenceable record is what lets one read reconstruct the registered set. Framing visibility is preserved; only certificate-passing mismatches are registered)
converge (extension)  → TextPresent+Proceed (convergence evidence trace; proceed with contextualized execution)
esc      (extension)  → TextPresent+Proceed (partial transformation trace + unresolved-mismatch residual declaration; terminate as EarlyExit, not ContextualizedExecution)
Seam transition to a declared next protocol (extension) → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares, settles the next move — proceed directly to it, citing that settling source; every Constitution gate inside Epharmoge and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { R: Result,   -- the CURRENT EVALUATED TARGET, re-bound to R' by each Adapt disposition
                   -- (Phase 2, TARGET SUCCESSION). Every R_final binding and every convergence predicate reads THIS field, so an Adapt
                   -- followed later by a Keep yields the adapted result
      X: Context,   -- bound once at activation and never re-bound (preserves: X); the bare X in every predicate and Eval call IS this field
      fit_map: F,
      judgment_state: Option((Judgment, basis: String)),   -- this cycle's relayed verdict with its cited basis (TYPES): written by the Phase 1 judgment dispatch on both arms, read after the Qc Stop by the close that follows
      carrier: Option(EntryLocator),   -- the identity the carrier-creating write returned at Phase 1 registration; every later amendment names it. Stays None wherever nothing ever registered (Mᵢ = ∅, or Mᵢ_passed = ∅ trivial convergence), since no carrier is written when there is nothing to carry
      reopen_focus: Option(String),   -- the zero-mismatch Reopen(aspect) focus the Phase 0 scan missed; threads into the focused re-scan, cleared after it; a focused re-scan that still yields Mᵢ = ∅ presents its finding as relay and deactivates (one attempt per aspect: the same focused scan asked again would put the same question back to the user, so it is not re-gated)
      withdrawn: Option((Mismatch, Option(Result))) }   -- set by Phase 2 → withdraw: the mismatch whose Discard withdrew the Eval target, and the replacement that took its place (inner None when the withdrawal left nothing behind). Presence of this field is what makes the run terminal without a re-scan
Σ = { dispositions: List(DispositionRecord), scan_count: Nat }
                 -- the SINGLE disposition ledger. Every close writes here — user-answered, certificate-assigned, or loop-assigned — so the
                 -- convergence trace ranges over one list
                 -- each Mismatch in a record carries its kind_binding + certificate (object_ref = Mismatch), which is what makes identity(r.mismatch)
                 -- readable straight off the ledger at the re-scan
-- INITIAL BINDING at activation: Λ.R := the result under review; Λ.X := the application context it is to be applied in;--   Λ.withdrawn := None; Λ.reopen_focus := None; Λ.judgment_state := None; Λ.carrier := None;
--   Σ := { dispositions = [], scan_count = 0 }. Λ.fit_map is bound by the Phase 0 pass (Λ.fit_map := F)
-- Views over Σ.dispositions (derived, NOT parallel state):
--   routed(Λ)   = { r ∈ Σ.dispositions : r.disposition = Route(_) }
--   residual(Λ) = { r ∈ Σ.dispositions : r.disposition = Residual }
--   moot(Λ)     = { r ∈ Σ.dispositions : r.disposition = Moot }
-- Certificate invariant: ∀ m ∈ pending : m.certificate.status = pass, AT EVERY POINT pending IS READ (fail-closed — a routed/ambiguous mismatch never enters pending, and one whose re-derived certificate stops passing after a merge leaves it). Not asserted mid-pass: the re-scan re-certifies a registered element and closes it out in one uninterrupted pass, and AssessFit, the first reader of pending after it, runs once both have happened
-- Ledger invariant: every mismatch leaving pending, and every mismatch closed at registration, appends exactly one DispositionRecord (no close without a record; no record without a close). PER REGISTRATION: a mismatch that registers twice leaves pending twice and appends two records, one per close, which is why a mismatch that registers twice carries two records rather than one amended. THE TWO PLACES A FLAGGED MISMATCH CAN BE — closed with its own record, or in pending — DO NOT PARTITION IT: between its certification and Register a passing element is in neither. This is why disposed(a) tests its two conditions separately instead of reading one off the other

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Mismatch-domain resolution emergent via session context.
certificate-before-registration ∘ transformative-revalidation: the fail-closed certificate order composes with the NON-MONOTONE loop — when an Adapt disposition mutates R and Eval(R', X) breeds emergent detections, those detections are bound, split, and ABSORBED into pending, and the certificate then runs over every element that fold touched — the ones it opened and the ones it merged into, whose evidence grew. So only in-scope (ApplicationDecontextualized-owned) elements register or stay registered, even as R mutates across cycles: a certificate that stops passing takes its element out of pending as readily as it kept a new one from entering. The gate holds under mutation-induced revalidation because it is re-asked of every element the fold touched, not only of what it opened.
contextualize ∘ caller-loop: THIS PROTOCOL IS BUILT TO RUN INSIDE ANOTHER LOOP — a statement about this artifact's design, and the only half of any division it is in a position to make. WHAT IT OWNS: as the artifact changes, keep collating it against the ACCUMULATED CONTEXT and surface where the two conflict, one mismatch at a time, for as long as changes keep landing. WHAT IT DOES NOT ESTABLISH: that the artifact is correct — not at entry, where correctness is presupposed rather than checked, and not after an Adapt, where no step re-checks it. Hence Eval reporting applicability mismatch and never correctness, and an adapted verdict claiming fit and no more. IT ASSIGNS NO ONE ELSE A DUTY, BECAUSE IT CANNOT: nothing reaching this protocol establishes that a caller exists, nothing it returns carries an obligation for one to discharge, and no transition here waits on anyone's verdict. A duty written against a party the contract cannot bind would read as a guarantee while being a hope. So the boundary is stated as this protocol's own silence — the verdict says what it does not claim, and a reader wanting correctness checked can see it was not checked here.
judgment-relay ∘ disposition-gate: the two axes compose so that a relay reaches the disposition half only where that half has collapsed to a no-op. judgment_relay_upheld discharges the epistemic half at entropy → 0 with a cited basis and leaves the repair half to be routed — to Qc, or to the carry where the user already answered it. judgment_relay_overruled reaches both halves, because well_formed leaves Keep as the sole pairing and a Keep edits nothing; the retraction is reported with its cited basis while the target still stands untouched. No relay reaches the disposition half on any other ground: what becomes of the result is answered against the target in front of the user, and an answer given about an earlier target is not re-applied to a later one. The composite's guarantee is that Adapt and Discard stay outside relay reach. It is stable under the non-monotone loop: an emergent Mₑ re-enters at Phase 1 and is judged and disposed on the same two axes, with its own relay eligibility computed afresh against the advanced target.
```

## Core Principle

**Applicability over Correctness**: When AI detects that a technically correct result may not fit the actual application context, it surfaces the mismatch with evidence rather than assuming the result is adequate. Correctness is necessary but not sufficient — contextual fit determines whether the result serves its purpose.

Formal predicate: `correct(R) ∧ ∃ aspect(a, R, X) : ¬warranted(a, R, X)` — the output is correct but not warranted in this context (Dewey's warranted assertibility; Ryle's knowing-how vs knowing-that).

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

Gate predicate — what LAYER 2 detection must find before the protocol activates on its own. A Layer 1 invocation is not gated by it: `/contextualize` runs Phase 0 whether or not this holds, and where the scan finds nothing the zero-mismatch finding is presented for confirmation (Rule 9) rather than the run declining to start:
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
- User explicitly says "looks good" or "proceed" after execution — they have judged the fit themselves
- Read-only / exploratory task — no result to evaluate, so there is nothing for a fit judgment to range over

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Every flagged aspect carries a disposition (adapted, kept, routed, residual) | Proceed with the verdict — it carries `R_final` together with how each aspect was closed |
| A Discard disposition withdrew the result (Phase 2 → withdraw) | Withdrawal convergence: `R_final` is the replacement (or nothing), every still-pending mismatch is closed as Moot, and no re-scan runs — the evaluation target no longer exists |
| No mismatches detected (Phase 0 zero-mismatch finding confirmed) | Execution stands as-is |
| Mismatches detected but none held by the own claim (Mᵢ ≠ ∅ ∧ Mᵢ_passed = ∅ ∧ adjudicated(Λ.R, X) ∧ pending = ∅) | Trivial convergence — every flagged aspect is handed to a local route claim's deficit or left Residual (unattributable); emit the routed deficits with their command hints (/gap, /inquire, /bound), surface any Residual, and deactivate without adapting R. An ambiguous certificate closes its mismatch as Residual at registration, like a route |
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
2. **Check applicability**: For each aspect, assess whether `fits(a, R, X)` (i.e., `warranted(a, R, X)`) — the fit is judged of the ASPECT, so one aspect can fail while the rest stand. Correctness is NOT part of this judgment: it was presupposed of the result this run received (the activation gate carries it) and is never re-asked here, including after an adaptation
3. **Bind and split each detection, absorb it, then certify the element the fold YIELDED (fail-closed)**: For each candidate mismatch, set `m.kind_binding = { label, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity }`; if `atomicity = non-atomic` (the mismatch bundles two distinct aspects), **split before certify**. Then **absorb it into what this pass already carries**: judge whether it is the same claim as something already folded in — if it is, merge it into that one, which keeps its own `id` and its statement of the claim while its evidence takes in what the incoming detection found, and is what the next detection gets judged against; if it is not, `init_occurrence(m)` writes its `id` and `unrepaired` and it enters on its own. **Everything below is owed by the element the fold yielded, never by the detection that went into it** — on the merge arm those are different objects, and certifying the detection would certify a binding this pass just discarded. So for each element `e` the fold now carries, `e.certificate = certify(e.kind_binding, local_claims)` where the local claims are epharmoge's own claim and its route claims, both inscribed in this SKILL.md (TYPES: `OwnClaim`, `RouteClaim`); the certificate reads nothing outside this file. Fit the predicate against every one of them and collect `claimed_by`, the set of claims the evidence supports:
   - **`status = pass`** — `claimed_by = {ApplicationDecontextualized}`, the own claim holding alone, which means the predicate instantiates `ApplicationDecontextualized` AND the local value-space can carry it to `ContextualizedExecution`. The mismatch is eligible for registration.
   - **`status = route`** — `claimed_by = {d}` for a single route claim's `routed_deficit` (backward misfit, not a context-fit question). Emit `d` as the typed handoff and **take the mismatch out of registration** — at Phase 0 it is simply dropped before registering, nothing having been registered yet for this fold to take back out; the already-registered arm belongs to the Phase 2 re-scan — closing it with disposition `Route(routed_deficit)` (`assigned_by = certificate`) in `Σ.dispositions`; the scan continues with the remaining mismatches. Route claims per `RouteClaim` (TYPES): GapUnnoticed (hint `/gap`), ContextInsufficient (hint `/inquire`), BoundaryUndefined (hint `/bound`).
   - **`atomicity = non-atomic`** — compound mismatch (two distinct aspects) → **split** into atomic sub-mismatches and re-run bind_kind → absorb → certify on each (same Phase 0 pass).
   - **`status = ambiguous`** (atomic) — `|claimed_by| ≠ 1`, either because several claims hold or because none does on the evidence at hand → close it as **Residual** (unattributable, never registered, surfaced as residual, non-blocking). There is no second look, and the reason is the ground rather than the budget: the certificate reads a detection state this phase has already fixed, and the phase is silent, so nothing new can arrive between a first read and a second. A step whose answer could move with no new evidence behind it would admit or dismiss a mismatch arbitrarily. `Residual` is the true report — attribution did not settle here — and the user sees the claim rather than a coin-flip about it.
4. **Assess fit**: Build `ApplicabilityFitMap` over the certificate-passing mismatches (`Mᵢ_passed`) from warranted aspect evidence, conflicts, dependencies, adaptation options, and bounded open questions
5. If all aspects warranted: present the zero-mismatch finding per Rule 9 and yield the turn. **Accept** closes the run with the execution standing as-is. **Reopen(aspect)** re-scans focused on that aspect once: if the focused scan turns up nothing, relay that and close; if it turns up mismatches, they re-enter the pipeline above from the top — bind and split each, **absorb** them, certify, bind value spaces, assess fit — and the run then takes whichever of the steps below its own outcome reaches: step 7's mismatch gate where any of them passed the certificate, step 6's trivial convergence where none did. One focused attempt per aspect
6. If mismatches were detected but NONE passed the certificate (`Mᵢ ≠ ∅ ∧ Mᵢ_passed = ∅`): every flagged aspect already carries a certificate-assigned disposition, so emit the routed deficits with their command hints, surface any `Residual`, bind `R_final := Some(Λ.R)` and deactivate — trivial convergence, with `Λ.R` unadapted. This is NOT the zero-mismatch case of step 5 and does not present that gate: mismatches were found, and each was handed to another deficit or left unattributable
7. If certificate-passing mismatches remain: bind each one's value space (`m.value_space := Some(bind_value_space(m))`), then record `Mᵢ_passed` with aspect, description, evidence, severity (per Rule 12 — behavioral-impact qualifier assessed against current-session task graph), kind_binding, certificate, and fit-map placement — proceed to Phase 1

**Information source**: The result `R` compared against observable context `X` — non-circularity (Rule 6).

**Registration-time certificate**: The certificate fires per element the fold touched — at registration where the element is not registered yet, re-derived over the existing registration where it is — and the certify step is relay (Extension). Full account — including the bound comparison and basis-citation timing — at Rule 17(a)-(b).

**Backbone discipline**: One canonical KindBinding → DeficitFitCertificate → value-space schema shared across protocols; epharmoge's local instantiation is detailed at Rule 17(d).

**Scan scope**: Completed result, observable context (structure, conventions, constraints), session context. Does NOT re-execute or modify files.

**Fit-map scope**: Support for mismatch selection and adaptation direction, and the place a judgment's cited evidence is found — it classifies already detected mismatches (Rule 15; open-condition bound at UX Safeguards: Fit-map cap).

### Phase 1: Mismatch Surfacing

**Register all certificate-passing mismatches (`Mᵢ_passed`) into the one carrier** (record), then take the next pending mismatch selected by `SelectNext`. If the fit evidence has already settled its judgment as `Overruled`, report the retraction and its cited basis and close it as relay (`judgment_relay_overruled`). Failing that, settle the judgment half against the current target, then **present** it via Cognitive Partnership Move (Constitution), reporting `m.unrepaired` along with it where the stamp is set — the Adapt the user directed last cycle did not land on this claim, and withholding that asks them to answer blind. The stamp gates nothing: the mismatch is surfaced on its own merits either way, and what it changes is what the user is told. Routed/ambiguous mismatches never enter `pending` (fail-closed certificate).

**Carrier format** — ONE entry holding every registered mismatch:
```
record({
  subject: "[Mismatch carrier] evaluated result",
  description: "one line per registration: [Mismatch:aspect] description | evidence and context | severity | status | once closed, the DispositionRecord — judgment, who settled it, disposition, and both grounds"
})
```

The creating write returns the identity `Λ.carrier` holds. Every later amendment names it; no second entry is written per mismatch.

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


**When the evidence retracts the finding** (`judgment_relay_overruled` fired — the aspect carries cited fit evidence and admits no reading under which it fails to stand): no gate is presented at all — option 1 is the only well-formed pairing left. Report it instead — what was flagged, that it is being retracted, and the fit evidence that retracts it — then close the mismatch and move to the next one. **Never relay a retraction silently**: the report puts the basis in front of the user before anything is written. Stopping the run is theirs to do and stays available throughout, so what the report buys is the timing — the reading reaches them while this close is still unwritten, and that is what makes this a relay rather than a gate.

**Design principles**: Each option leads to a concrete next step. Evidence-grounding (Rule 4), current-mismatch framing and natural post-execution integration (UX Safeguards), and the stated fitness assumption on option 2 all apply here.

### Phase 2: Disposition

After the user's answer `(judgment, disposition)`, **first** append the mismatch's one `DispositionRecord` to `Σ.dispositions` and complete its record in the carrier — as a single step, so it leaves `pending` before any arm below runs — **then** act on the disposition:

1. **`(Overruled, Keep)`**: the flagged aspect fits after all — no adaptation, no re-scan, and the result is left exactly as it stands (`R_final` is bound once, at convergence). This pair also arrives relay-assigned from Phase 1 when the fit evidence already settled it (`judgment_relay_overruled`), in which case it never reached this gate; the trace prints the two apart
2. **`(Upheld, Keep)`**: the mismatch stands and is accepted anyway — the result is left as whatever earlier adaptations made it; note the fitness assumption accepted, no re-scan. An accepted residual, recorded apart from arm 1
3. **`(Upheld, Adapt(direction))`**: apply the user-directed adaptation through artifact write → `R'`, **advance the evaluated target** (`Λ.R := R'`), then re-scan (below). The re-scan asks whether `R'` FITS `X` — it does not ask whether `R'` still works, and no step here does: correctness was presupposed of the result this run received and the succession does not re-open it. Whether the adaptation held the result correct is not established here at all, and the verdict says so rather than letting the fit finding stand in for it
4. **`(Upheld, Discard(replacement))`**: withdraw the evaluated result through artifact write — `R_final := replacement` (or nothing, when the withdrawal leaves nothing in its place). Set `Λ.withdrawn`, close every mismatch **remaining** pending as `Moot` (unjudged, with the withdrawal as basis), and **do not re-scan**. The run converges here (Phase 2 → withdraw). The fit claim stays on `Λ.R`; the replacement is carried in the verdict but **not** claimed to fit

**Bulk exit — "keep the rest as-is"**: at any Phase 1 gate the user may decline the per-mismatch loop and accept everything remaining. This arrives as a free response rather than a fifth option, because it disposes of the whole axis instead of taking a position on one mismatch. Every pending mismatch is closed with an **unjudged** `Keep` (`judgment = None`) — **except** the mismatch currently on the gate when its judgment was relayed a step earlier, which is recorded with that verdict and its cited basis. Then `R_final := Some(Λ.R)` and the run converges (Phase 1 → keep_all_remaining)

After an **Adapt** disposition only — **re-scan**: (`Keep` is non-mutating and `Discard` is run-terminal; neither breeds `Mₑ` nor triggers `Eval`)
- Re-evaluate the advanced target `Λ.R` against `X` for remaining AND **newly emerged** mismatches. Bind and split each detection FIRST, since everything below reads the binding, then **absorb each into what this pass carries** — the set starting as `pending`; the same fold Phase 0 runs, differing only in that the set folded into is not empty here: a detection judged to be a claim `pending` already holds merges into that element, which keeps its `id` and its statement of the claim while its evidence takes in the detection's, takes the combined reading, and takes the detection's stamp by disjunction; a detection judged new enters on its own and is what `Mₑ` collects. `Mₑ` is therefore what the fold opened — an aspect closed earlier in this run is judged like any other detection, re-registering where it opens an element and merging where it reads as a claim already pending, and a re-registration reaches the gate on its own like any other pending mismatch
- **Certify every element the fold TOUCHED (fail-closed), then bind its value space** — what it opened AND what it merged into, not only the emerged ones, since a merged element's grown evidence is what makes its earlier fit stale — the stamp is written during the fold above, against the mismatch this cycle's dispose closed by adapting and no other record. This happens at the **Phase 2 re-scan** (AFTER the Adapt disposition has already mutated R into R'), temporally separated from the Phase-0 certification of Mᵢ: for each element the fold **touched** — the ones it opened and the ones it merged into, a merged element's binding having grown so its earlier fit is stale — set `m.certificate = certify(m.kind_binding, local_claims)` (same local claims, same `pass | route | ambiguous` statuses as Phase 0), then set `m.value_space` over that same touched set — `Some(bind_value_space(m))` where the status passes and `None` where it does not, total on both outcomes, so an element that carried a space and stopped passing does not keep one on its closed record. A touched element whose re-derived certificate no longer passes is closed by it — leaving `pending` where it was registered before this fold, never entering where it was not. Register only certificate-passing members (`Mₑ_passed`); a `status = route` mismatch is closed with disposition `Route(routed_deficit)` and handed to that deficit (GapUnnoticed, ContextInsufficient, BoundaryUndefined — command hints `/gap`, `/inquire`, `/bound`); a non-atomic compound mismatch is split into atomic sub-mismatches and re-certified; an atomic `status = ambiguous` mismatch is closed as `Residual` before registration, on the same ground as the Phase 0 arm. Do not filter the certificate-passing set by fit-map category.
- **Amend the one carrier at `Λ.carrier`** (record) — add every newly registered `Mₑ_passed`, AND bring into line the entry of every touched element that was already registered before this fold, whose reading, evidence, certificate, value space and stamp the fold has just moved. `Register` reaches only what the fold OPENED, so without this the durable record keeps the pre-merge state. One write, not one per mismatch; an entry left behind would show a superseded aspect, and `disposed(a)` being aspect-keyed would then never discharge it
- Recompute `ApplicabilityFitMap` over all pending mismatches before selecting the next mismatch, even when `Mₑ_passed = ∅`
- If mismatches remain pending: return to Phase 1 (surface next mismatch via `SelectNext`: severity, then FitRank, then oldest registered mismatch)
- If every registered mismatch is completed: execution complete — the verdict carries `R_final` together with every disposition. Where any adaptation fired, the verdict claims FIT for the adapted result and makes **no correctness claim** about it (Rule 8)
- Increment `Σ.scan_count`

**Re-scan trigger (transformative revalidation — NON-MONOTONE)**: An Adapt disposition MUTATES `R` into `R'`, and `Eval(R', X)` re-targets the detector at the mutated result, so changed `R'` may exhibit new mismatches not present in the original result. Always re-scan after each adaptation — any adaptation may introduce mismatches in dimensions unrelated to the original aspect; `progress(Λ)` may therefore regress (expected, not an error). Every other disposition leaves `R` unmutated as a succession target and is contextualize-internal.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Minor severity mismatches only | Constitution interaction with "real, but fine as-is" as default option |
| Medium | Significant severity, evidence is clear | Structured Constitution interaction with evidence |
| Heavy | Critical severity, multiple interacting mismatches | Detailed evidence + adaptation options |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `auto-activate(Epharmoge) only if correct(R) ∧ ∃ ¬warranted(a, R, X)` | Prevents false AUTO-activation on well-fitting results; a user-invoked run is not gated by it and reaches the zero-mismatch finding (Rule 9) |
| Mismatch cap | One mismatch per Phase 1 cycle, severity order | Prevents post-execution question overload |
| Current-mismatch framing | Phase 1 surfaces the mismatch currently in play (which applicability aspect is being judged this cycle) — a framing readout, not an `[N addressed / M]` completion count | User recognizes which aspect is being judged without parsing a progress tally; granular progress stays in session |
| Deterministic selection | `SelectNext` orders pending mismatches by severity, FitRank, then oldest registered mismatch | Removes unordered Set indexing from user-facing surfacing |
| Fit-map cap | `depends`/`open` only when observable evidence could change which disposition is chosen | Prevents broad contextual caveat lists |
| Early exit | User can keep all remaining as-is at any Phase 1 — compiled as `Phase 1 → keep_all_remaining`, closing each with an unjudged Keep, except one whose judgment was relayed that cycle | Full control over review depth, with the ledger showing they were accepted rather than judged |
| Relay never edits | A relay closes a mismatch only where the close leaves the result untouched: a settled Upheld assigns no disposition of its own, and a settled Overruled closes with its basis reported | A settled finding never becomes silent permission to change the artifact |
| Retraction is reported, never silent | `judgment_relay_overruled` must report the aspect and the fit evidence before closing | The user sees the retraction and its basis while the result still stands and before the close is written |
| The one Phase 1 relay says where its correction lives | a relay-closed mismatch leaves `pending` and reaches no further Qc this run, and a disputed RETRACTION has no reset that would return it: `judgment_settled` reads `Λ.fit_map`, derived from `(Λ.R, X)`, so re-entering on the same result reproduces the same close. Correcting it is the user's interrupt | The user is told what to reach for, rather than trying a re-entry that changes nothing |
| Natural integration | "Done. One thing to verify:" pattern | Fits completion flow, not interrogation |

## Rules

1. **AI-guided, user-judged**: AI detects the applicability mismatch; the judgment is the user's wherever it turns on what they weigh, presented via Cognitive Partnership Move (Constitution) at Phase 1. Where the answer is already fixed — by evidence admitting no other reading, or by the user's own earlier answer for that aspect — the AI relays it with its basis cited to the user
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity — Constitution interaction requires turn yield before proceeding
3. **Applicability over Correctness**: When result is correct but contextually mismatched, surface the mismatch — do not assume correctness implies fitness
4. **Evidence-grounded**: Every surfaced mismatch must cite specific observable evidence from both result `R` and context `X`, not speculation
5. **Convergence persistence**: Mode active until every flagged aspect carries a disposition — adapted, kept, discarded, routed, residual, or moot. A run in which nothing was adapted converges exactly as fully as one in which everything was
6. **Non-circularity**: Information source is the result itself compared against context, not pre-execution context scans
7. **Round composition**: Compose each round so the reader can act on it without reassembling it — everyday language rather than this file's formal vocabulary, the judgment set beside the evidence it rests on together with the differential implication that matters for the next move, and analytical context laid out before a gate rather than inside it, so the gate carries the question and each option's differential implication. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged, when some of what is in view belongs to a later round or a trace rather than this one, or when this protocol's own phases bear on where a sentence sits relative to a gate.
8. **Convergence evidence**: Present transformation trace before declaring `adjudicated(Λ.R, X)` over the evaluated target; per-mismatch evidence is required. Where the run ended in a withdrawal, the trace also states that the verdict's target is the replacement and that no fit claim is made about it. Where any `Adapt` disposition fired, it also states that the fit claim covers the adapted result and that its CORRECTNESS is not this protocol's finding — correctness was presupposed at entry and never re-established, and nothing here verifies the adapted result or reports whether anyone else did (COMPOSITION)
9. **Zero-mismatch surfacing**: If Phase 0 scan detects no context mismatches, present this finding with reasoning for user confirmation
10. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options. **This rule's compiled control paths are `judgment_relay_upheld` and `judgment_relay_overruled`** (PHASE TRANSITIONS Phase 1, TOOL GROUNDING), covering the JUDGMENT axis in BOTH directions: the evidence may admit no reading under which a flagged aspect stands warranted (→ `Upheld`), or none under which it fails to stand (→ `Overruled`, read off that aspect's own entry in the fit map). No relay on THIS ground reaches the disposition axis on its own account — what becomes of the result turns on user value weightings that no evidence collapses. The `Overruled` arm reaches it only where `well_formed` forces `Keep` as the sole remaining pairing and that `Keep` edits nothing: the close is reported with its cited basis before anything is written, while `Adapt` and `Discard` remain unreachable by relay
11. **Gate integrity** (Safeguard tier): The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES answer space — here the two-axis `Judgment × Disposition` product) is distinct from mutation.
12. **Significant requires demonstrable behavioral impact**: Severity = Significant requires that the mismatch produces a demonstrable behavioral consequence — downstream-decision impact, runtime divergence, gate-trajectory change. Structural-change extent (line count, file count, scope size) alone is insufficient grounds — categorize as Minor when behavioral impact is undemonstrated. This guards against false-positive gating arising from conflation of structural-change extent with applicability impact
15. **Applicability fit map supplies evidence, never decides**: Use `ApplicabilityFitMap` to scope which mismatch is surfaced and which adaptation direction is practical, and as the place a judgment's cited evidence is found. It classifies already detected mismatches: it may not create one the detector never produced, may not suppress one, and may not close one on its own classification. A close that reads an entry's evidence, clears the judgment bar, and reports that basis to the user is the JUDGMENT closing with the fit map cited — source, not authority. That is why `judgment_settled` takes membership as the evidence's location rather than as its trigger (TYPES).
16. **All certificate-passing mismatches remain tracked**: Initial and emerged mismatches that pass the fail-closed deficit-fit certificate are registered before fit-map prioritization. Fit categories order selection and word the fit basis, and the fit map additionally holds the evidence a judgment may cite (Rule 15). None of those acts removes a registered mismatch from convergence accounting: every close writes a ledger entry, whoever assigned it. (The certificate is the one legitimate pre-registration filter — Rule 17.)
17. **Registration-time deficit-fit certificate, transformative revalidation**: Before an element sits in `pending` on a given certificate, it is dispatched through the shared meta-backbone pipeline — KindBinding → fail-closed DeficitFitCertificate → value-space, in that strict order, over every element the fold TOUCHED on both scans — ahead of registration where the element is not registered yet, and over the registration that already exists where it is — all of `Mᵢ` at Phase 0, and at the Phase 2 re-scan the ones it opened together with the ones it merged into, whose evidence grew so their earlier fit no longer answers for them. (a) **Registration-time**: the certificate attaches per mismatch at registration time — mismatch detection stays AI-side. This is distinct from bound's dispatch-first up-front sync (which exists because BoundaryMap is a multi-consumer router). (b) **Fail-closed certificate**: `certificate.status = pass` strictly precedes registration and surfacing for an element not registered yet, and strictly precedes a registered element's STAYING in `pending` — re-derived after its registration, since the registration is what it is re-derived over; `status = route` drops the mismatch and hands it to the matched route claim's `routed_deficit` (per `RouteClaim`, TYPES: GapUnnoticed, ContextInsufficient, BoundaryUndefined, with command hints `/gap`, `/inquire`, `/bound`); a non-atomic mismatch is split into atomic sub-mismatches before certify, and `status = ambiguous` — `|claimed_by| ≠ 1`, several claims holding or none — closes the mismatch as `Residual` before registration, unattributable on the evidence at hand. There is no second pass: both phases are silent and both read a detection state already fixed, so nothing new could arrive to move the answer, and a step whose answer moves without new evidence admits or dismisses arbitrarily. The certificate is generated by fitting the mismatch's positive predicate against the own claim and the route claims inscribed in THIS SKILL.md, reading nothing outside this file; `claimed_by` is a Set, so "no claim holds" is a value rather than a hole, landing in `ambiguous` alongside the several-claims case. A pass certifies local admissibility — epharmoge's own gate over epharmoge's own activation — not the absence of a claim anywhere in the wider protocol set. The certify step is relay (Extension — the deficit-fit is grounded in the cited local claims, an unclear fit returns `status = ambiguous` → defer; basis cited at Phase 1 surfacing). (c) **Transformative revalidation (NON-MONOTONE)**: an `Adapt` disposition MUTATES `R` into `R'`, `Eval(R', X)` re-targets the detector at the mutated result, and this can BREED emergent mismatches `Mₑ` that did not exist before — so re-scan is mandatory and `progress(Λ)` may regress. "Transformative revalidation" labels the ADAPT disposition; every other disposition is contextualize-internal and does not mutate `R` as a succession target. (d) **Backbone discipline**: the schema is ONE canonical definition shared across protocols; epharmoge instantiates only `object_ref` (= Mismatch), `local_value_space` (= the two-axis `Judgment × Disposition` answer space under `well_formed`), the label field's type (`Axis`), the own claim, and the local route claims — same field names, same fail-closed statuses, same certificate-before-registration order.
18. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract. How its symbols render to the user is a separate emit-layer concern (see Round composition).
19. **Seam relay on declared continuation**: when a user-declared chain or a composition edge this SKILL.md declares names the next protocol, the between-protocol seam after Epharmoge's convergence is relay (Extension) — proceed directly, citing the settling source (the chain declaration or the named edge). This governs only the seam BETWEEN protocols; every Constitution gate inside Epharmoge and the next protocol fires unchanged, and the user can redirect at any turn.

20. **Form feedback**: Silence about form is not evidence about form. Too dense fails quietly — the reader skims, answers past it, stops — while too plain fails out loud, so the complaints that arrive come from one side only. Density therefore does not carry over from the previous round: each round takes it from what this request asked for, while a statement about form does carry over until it is countermanded. Read an instruction about form for the parts of a round it reaches, not for what kind of reaction it is — a complaint, a request, a symptom report and a bare preference are one input here, and sorting them by kind yields nothing the reach reading does not already give while costing a clause per kind. Change the form rather than asking which form they want; naming one is the recall this discipline exists to remove. What such an instruction reaches is whatever the active protocol leaves open in how a round is composed — its density, its ordering, its length. What it does not reach is whatever is already fixed for this round elsewhere: content the protocol requires, wording carried verbatim, an order it presents in, a cadence it caps, a turn boundary it sets. Those stay in place, and the layer that fixed them is what states why. Say in one line what changed; where the instruction overlapped something that stays, say in one line that it stays and why — that second line is owed by the overlap, not by how the instruction was worded.

21. **Kind, then resolution form, then repair locus — and never the reverse**: three axes, answered in that order. What KIND of misfit this is (`kind_binding.label` and the predicate under it) is settled at detection; what FORM its resolution takes (`ResolutionForm`, the axis `Disposition` ranges over) is settled next — at Qc where the user answers, and by the certificate, a relay, or the loop on the closes that reach no gate, exactly as `Disposition` names its producers; WHERE the change lands (`RepairSite`) exists only when `adapt` or `discard` executes, and at no earlier point — those two are the only dispositions that touch the artifact, and both are user-answered, so a locus always stands on an answer someone gave. The order is the rule, not a sequence that happens to be convenient. **Repair locus types nothing upstream of itself**: it does not individuate a mismatch, does not decide how many mismatches there are, does not gate registration, and appears in no convergence predicate. A mismatch is individuated by what it claims and what that claim stands on; where a repair would land is a property of an answer nobody has given yet, so reading it back into the deficit asks the user's question on their behalf and answers it by counting. **What this forbids concretely**: letting `atomicity` — a shared backbone field asking how many distinct aspects a binding bundles — be re-pointed at how far the evidence spreads across places an edit could reach. That re-pointing splits one claim into several registrations before the user has said anything about how they want it handled, multiplies what they are asked, and leaves the same field name meaning one thing here and another in the protocols this schema is shared with, where nothing checkable can see the divergence because the field list itself still matches. **What stays available**: a resolution may still be partial, and it stays legible without any of that — an adaptation reaching only part of what a claim rests on leaves the aspect flagged at the re-scan, so it re-registers and is surfaced on its own account rather than being pre-split into pieces nobody chose.

22. **Three names, three questions — and none of them substitutes for another**: `identity(m)` says WHICH CLAIM this is (the binding's `positive_predicate` with the `Set(Evidence)` it stands on), `id` says WHICH OCCURRENCE of that claim the reader is looking at, and `aspect` says HOW IT READS on the current target. Each answers something the other two cannot, and every defect this rule guards against is one name doing another's work: a label deciding sameness, a handle counted as if it settled sameness, or an identity asked to say which of its occurrences is meant. **The identity half — verified against the binding, never read off the label**: whether a re-detected mismatch is one a record already closed is settled by `identity(m)` and never by `aspect`, which is a display name. The predicate is the claim itself rather than a name for it, which is what makes this a verification rather than one more label comparison. Two consequences, and the protocol needs both. **Upstream**: because identity is the claim together with the evidence it stands on, a **partial** adaptation needs no splitting to stay legible — adapting part of what a claim rests on leaves a residue standing on evidence that has moved, and the reading is taken from that moved evidence at the re-scan turn. Whether that residue is the claim already pending or one of its own is judged at the re-scan, and the protocol carries it either way. Splitting is reserved for what `atomicity` actually asks — a binding that bundles two distinct aspects (Rule 17(b)) — and never for how far a repair would have to reach, which is settled after the disposition is answered and not before. **Downstream**: where a return does re-register, the ledger match tells the protocol what it IS and never that it is done — a record answers for the registration it closed and for no other, so the return opens its own entry. Where the return reads as the claim a record closed by adapting, `unrepaired(m)` says the repair did not land: the one thing a re-scan cannot say on its own, since a re-scan reports that the mismatch is there, not that an answer already given failed to land. Where it reads instead as a claim of its own, it is a registration the user has not been shown, owed its own surfacing rather than a carried `Keep` (Rule 20). Registration cardinality is not identity: how many times a mismatch has registered settles nothing here, because the question is whether this registration is that one, and only the binding answers it. The convergence trace does report how many occurrences a claim has accumulated, and that is the same distinction from the other side: the count is a framing signal the reader weighs, and it enters no predicate that decides sameness, disposal, or convergence. **Where the return does NOT open an element of its own** — it is judged the claim an element already carried — the detection is not discarded either: it merges into that element, whose `kind_binding` and `id` stay put while its evidence takes in the detection's, the reading is combined, and the stamp is taken by disjunction (TYPES, absorb and merge).
