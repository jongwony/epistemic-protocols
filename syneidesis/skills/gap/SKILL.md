---
name: gap
description: "Gap surfacing before decisions. Raises procedural, consideration, assumption, and alternative gaps as questions when gaps go unnoticed, producing an audited decision. Type: (GapUnnoticed, AI, SURFACE, Decision) → AuditedDecision. Alias: Syneidesis(συνείδησις)."
---

# Syneidesis Protocol

Surface unnoticed gaps at decision points through questions, enabling user to reach an audited decision. Type: `(GapUnnoticed, AI, SURFACE, Decision) → AuditedDecision`.

## Definition

**Syneidesis** (συνείδησις): A dialogical act of surfacing potential gaps—procedural, consideration, assumption, or alternative—at decision points, transforming unnoticed gaps into questions the user can evaluate.

```
── FLOW ──
Syneidesis(D, Σ) → Scan(D) → G_detected → ∀g ∈ G_detected: bind_kind(g) [split where non-atomic] → certify(g, local_claims) → keep(status = pass) → bind_value_space(g) → G_passed →
  G_passed = ∅ ∧ G_detected ≠ ∅: relay(routed deficits + unattributable residual) → converge (trivial: gaps were detected but none is one this protocol claims; registered unchanged, nothing surfaced)
  G_passed ≠ ∅: AssessGapPressure(D, G_passed ∪ open(registered)) → P → Sel(P, D) → Gₛ → Q(Gₛ) → J → A(J, D, Σ) → Σ'

── MORPHISM ──
Decision
  → scan(decision, context)           -- identify gaps implicit in decision
  → bind_kind(gap) → certify(gap, local_claims) → bind_value_space(gap) -- shared meta-backbone: bind each detected gap as a kind, certify deficit fit (fail-closed) against the claims inscribed in this SKILL.md, then derive its answer space — in that strict order, BEFORE the gap is pressure-assessed, registered, or surfaced
  → assess_pressure(decision, gaps, context) -- classify why each certificate-passing gap deserves attention now
  → select(gaps, pressure, stakes)    -- prioritize by pressure and stakes
  → surface(gap, as_question)         -- present gap as question
  → judge(user_response)              -- collect user judgment
  → AuditedDecision
requires: committed(Decision)           -- runtime checkpoint (Phase 0)
deficit:  GapUnnoticed                  -- activation precondition (Layer 1/2); the certificate's own_claim deficit for in-scope gaps
preserves: D                            -- read-only throughout; morphism acts on Σ only
invariant: Surfacing over Deciding
invariant: certificate-before-registration  -- DeficitFitCertificate.status = pass strictly precedes writing a gap into the carrier AND surfacing it at Qs (shared meta-backbone order)

── TYPES ──
D      = Decision point ∈ Committed × Stakes × Context
Committed = committed(D) ≡ ∃ A : mutates_state(A) ∨ externally_visible(A) ∨ consumes_resource(A)
Stakes = {Low, Med, High}
G      = Gap — the detected item this protocol registers, surfaces, and closes. ASSEMBLED ACROSS THE PHASE 0 PIPELINE, not built by the scan: Scan detects the gap and the evidence it stands on, and bind_kind, certify, and bind_value_space each add what only they can produce, in the order Rule 16 fixes. So the whole form is what a REGISTERED gap carries, and a detection on its way through has only what its stage has reached
       -- object_ref: the per-gap anchor the certificate evaluates and the value space binds over (syneidesis-local instantiation of the shared backbone's object_ref)
       -- the gap's kind is carried by kind_binding.label (GapKind) — the single source of the kind label
GapKind ∈ {Procedural, Consideration, Assumption, Alternative} ∪ Emergent(GapKind)
       -- the gap-kind taxonomy: four recognition seeds plus an emergent path (Gap Taxonomy, below). Carried as KindBinding.label, which is what gives origin ∈ {seed, emergent} its work here — it tells one of the four named kinds from a kind the taxonomy did not anticipate
Scan   = Detection: D → Set(G)                      -- gap identification
Context = Observable decision context from session, codebase, and cited evidence

-- Shared meta-backbone (KIND dispatch, registration-time). One canonical schema; syneidesis-local instantiation ONLY for object_ref (= Gap), local_value_space (= Judgment, the uniform three-way answer space), the label field's type (GapKind), the own claim, and the local route claims.
KindBinding    = { label: GapKind, positive_predicate: String, evidence: Set(Evidence), origin ∈ {seed, emergent}, atomicity ∈ {atomic, non-atomic} }
                 -- captures the gap as a kind; if atomicity = non-atomic (the binding bundles two distinct gaps) → split BEFORE certify (no registration, no pressure bucket, and no surfacing on a compound gap)
                 -- atomicity IS THE BACKBONE'S QUESTION AND CARRIES THE BACKBONE'S MEANING: how many distinct claims this binding bundles — the same question the sibling protocols sharing this schema ask of it. It never asks how far a resolution would reach: one gap whose evidence lies in several places is ONE gap, because how much the decision would have to change is what Address answers and not what registration decides
Evidence       = { source: String, content: String }   -- the concrete indicator cited from D that Rule 2 requires; the certificate's deficit-fit basis is drawn from these
OwnClaim       = { deficit: GapUnnoticed, resolution: AuditedDecision, in_scope_if: String }
                 -- the claim syneidesis makes, stated as the WHOLE local morphism: the deficit it takes AND the resolution it produces. A gap is claimed here when its positive_predicate instantiates GapUnnoticed AND the local value space can carry it to AuditedDecision — the bare deficit label is a name, the morphism is the predicate
DeficitFitCertificate = { own_claim: OwnClaim, route_claims: List<RouteClaim>, claimed_by: Set(Deficit), evidence: Set(Evidence), status ∈ {pass, route, ambiguous} }
                 -- fail-closed: status ≠ pass BLOCKS registration into the carrier AND surfacing this gap at Qs. Generated at Phase 0 by fitting KindBinding.positive_predicate against own_claim and every route_claim inscribed below — the certificate reads nothing outside this SKILL.md
                 -- claimed_by collects every claim the evidence supports; a SET, so "no claim holds" is the value ∅ rather than a hole in the type
                 -- status = pass: claimed_by = {GapUnnoticed} — the own claim holds alone → eligible for registration
                 -- status = route: claimed_by = {d} for a single route_claim's routed_deficit d → emit d as the typed handoff and drop the gap; it never registers, so it never enters AuditedDecision's quantifier and never reaches Qs
                 -- status = ambiguous: |claimed_by| ≠ 1 — several claims hold, or none holds on the evidence at hand → ONE bounded narrowed-scope re-assessment at the fixed Phase-0 detection state (AI-side, no user question — the phase stays silent apart from its relays) → pass / route / unattributable (dropped and reported, never registered). ONE attempt, because a silent phase cannot ask and the re-assessment re-reads a detection state this run has already fixed, so an identical retry can add nothing. Which of the three that attempt reaches is read at that turn from the session's own context and the user's wording, never fixed here
                 -- what a pass certifies is LOCAL ADMISSIBILITY: syneidesis's own gate governing syneidesis's own activation, not the absence of a claim anywhere in the wider protocol set. Where two protocols' scopes both reach a situation, each protocol's own gate governs — so a gap arriving because another protocol's route claim named GapUnnoticed is certified here on its own account, that label being their gate's finding and not this one's
RouteClaim     = (route_if_predicate: String, routed_deficit: Deficit)
                 -- syneidesis-local route claims — what a detected item is handed to when it is not an unnoticed gap. routed_deficit is the BINDING field; the command in parentheses is a non-binding hint for the user, not the relation this guard composes on:
                 --   a missing pre-execution fact (no observable value, requires supply)     → ContextInsufficient (hint: /inquire)
                 --   undefined convention, ownership, or scope for the decision              → BoundaryUndefined   (hint: /bound)
                 --   an already-collected source whose claim needs testing, not a gap in the plan → ContextSuspect  (hint: /sublate)
Deficit        = a deficit label a gap may be claimed by — syneidesis's own GapUnnoticed, or one of the sibling deficits named in the route claims above. Every label this certificate can assign is inscribed in THIS SKILL.md; nothing outside this file supplies one
Protocol       = the slash command a route claim's user-facing hint names (e.g., /inquire, /bound, /sublate) — a hint only; the binding relation the guard composes on is the routed_deficit, never the command
bind_value_space : Gap → ValueSpace                 -- the gap's answer constructors; generated ONLY after certificate.status = pass, and frozen for the cycle
ValueSpace     = Judgment                           -- the uniform three-way judgment (local_value_space; syneidesis-local instantiation point) — the SAME coproduct for every gap kind, because Address, Dismiss and Probe each carry a distinct ADJUSTMENT RULE that holds whatever the gap turns out to be about
                 -- the bound kind is the DOMAIN of this function and the codomain is CONSTANT: what the binding fixes is what each judgment REFERS TO for this gap — what Address would resolve, what Dismiss would accept as holding, what Probe would verify — never which judgments exist. No member is added or dropped, and Probe stays present under Rule 12 whatever the binding says
                 -- what the ordering buys is Rule 8's relay test applied to a space that is already bound: an option set authored before the kind is certified is a set of answers to a question nobody has fixed yet
G_detected     = Set(G) from Scan(D)                -- every candidate the scan produced, before any of them is bound, certified, or registered
G_passed       = { g ∈ G_detected : certificate(g).status = pass }   -- the only gaps that reach AssessGapPressure, the carrier, and Qs
AssessGapPressure = Gap pressure classification: D × Set(G) → P  -- Context is projected from D; runs over certificate-passing gaps only, so a gap this protocol does not claim can never occupy a pressure bucket
P      = GapPressureMap { load_bearing, cheap_to_settle, hidden_high_impact, nonblocking, queued }
partition(P, S) = S = P.load_bearing ⊔ P.cheap_to_settle ⊔ P.hidden_high_impact ⊔ P.nonblocking ⊔ P.queued
                 -- S is the set actually assessed this cycle — G_passed ∪ open(registered), never G_detected: a routed or unattributable gap is dropped before the map is built, so it is not a member the partition has to place
load_bearing = Set(G) whose resolution materially changes the decision
cheap_to_settle = Set(G) settleable with one low-cost confirmation
hidden_high_impact = Set(G) ⊆ G that Scan flagged low-confidence but decision-changing if real -- tightly capped (|hidden_high_impact| ≤ 1); admitted only when it could materially change the user's next judgment
nonblocking = Set(G) compatible with proceed(Σ) this cycle
queued = Set(G) routed to Σ.deferred for later review
Sel    = Selection: P × D → Gₛ                     -- prioritize by pressure and stakes
Gₛ     = Selected gaps (|Gₛ| ≤ 2)
Q      = Question formation (assertion-free)
J      = Judgment ∈ {Address(c), Dismiss, Probe}
c      = Clarification (user-provided response to Q)
A      = Adjustment: J × D × Σ → Σ'
C      = GapCarrier: the ONE durable entry every registered gap is written into — a single dereferenceable record, so one read reconstructs the whole gap set rather than reassembling it from scattered records or from session memory
GapLocator = { record: C's identity as the carrier-creating write returned it, session: the id of the session that wrote it }   -- substrate-neutral by construction: the identity is whatever that write returned, so this type never names what performs the write
locator(C) = GapLocator { record: C's identity as the carrier-creating call returned it; session: the id of the session running that call }   -- the value Σ.carrier holds; which call creates the carrier is named in TOOL GROUNDING, so a host without that capability still types this
registered = the gaps C carries   -- the set AuditedDecision quantifies over and the audit trace ranges over; certificate-passing gaps ONLY, so a routed or unattributable gap is absent from it by construction rather than closed inside it
entry(g)   = the record C carries for g ∈ registered — the gap's question and its context, its kind_binding and the certificate that admitted it, and once closed the status, the user's judgment, and the adjustment that judgment produced. The judgment and adjustment are there because the audit trace reads them: a carrier holding status alone recovers which gaps are left and loses what was decided about the rest. The binding and certificate are there because a LATER SESSION recovering this carrier inherits gaps it did not certify, and the registration invariant below has to keep holding for them without re-deriving a fit against a detection state that run no longer has. A recovered entry that carries no binding — written before this pipeline existed — is bound and certified at recovery, on the same terms as a fresh detection
status(g)  = entry(g).status ∈ {open, completed}
open(registered) = { g ∈ registered : status(g) ≠ completed }   -- what a recovered carrier contributes to pressure assessment and selection. The audit trace still ranges over registered WHOLE, so a gap already judged is reachable as evidence without being put to the user a second time
Σ      = State { reviewed: Set(G), deferred: List(G), blocked: Bool, carrier: Option(GapLocator) }
AuditedDecision = Σ' where ∀ g ∈ registered: status(g) = completed
EarlyExit = Σ' where user_esc  -- non-convergent early exit: state as of exit (Σ' = Σ when exit precedes the first adjustment), partial audit trace over judged gaps, remaining registered gaps declared as unresolved residual

── PHASE TRANSITIONS ──
Phase 0: D → committed?(D) → [locator in scope: DereferenceCarrier → registered; Σ.carrier := Some(that locator) | none in scope: registered := ∅; Σ.carrier := None] → Scan(D) → G_detected → ∀g ∈ G_detected: bind_kind(g) → certify(g, local_claims) → keep(status = pass) → G_passed → ∀g ∈ G_passed: bind_value_space(g) → AssessGapPressure(D, G_passed ∪ open(registered)) → P  -- checkpoint + carrier recovery + detection + registration-time KIND dispatch (fail-closed) + pressure map (silent apart from the unreachable-carrier relay and the certificate's own route / unattributable relays). The backbone pipeline runs WITHIN Phase 0, before the pressure map, so a gap this protocol does not claim never occupies a bucket — and the tightly-capped hidden_high_impact slot in particular is spent on a gap the own claim holds. "In scope" is REACHABILITY, never ownership: whether a recovered gap bears on THIS decision is a relevance judgment, and it is made where the user is present — at Qs, which every gap passes before anything is done with it. Keying the locator to a decision would settle that at authoring time and remove the recognition the gate exists to elicit; where the relevance question turns on a fact the audit does not hold, the deficit is ContextInsufficient (/inquire), not this one. Deficit fit and relevance are different questions: a recovered gap carries its certificate forward and is not re-certified, because the claims it was fitted against are inscribed in this file and do not move between runs [Tool]
Phase 1: (G_passed, P) → [Σ.carrier = None: record[C ← all certificate-passing gaps] → Σ.carrier := Some(locator(C)) | Σ.carrier = Some(l): record update(l, add the newly detected certificate-passing gaps)] + Σ.deferred ← P.queued → Sel(P, D) → Gₛ → Qs(Gₛ[0]) → Stop → J  -- register every certificate-passing gap into the ONE carrier, creating it on the first pass and amending the recovered one otherwise; hold the identity the creating write returned; pressure-select, surface first. Reached only when G_passed ∪ open(registered) ≠ ∅; a routed or unattributable gap was dropped at Phase 0 and is never written here (fail-closed) [Tool]
Phase 2: J → A(J, D, Σ) → record update(Σ.carrier, entry(Gₛ[0]) := ⟨status := completed, judgment := J, adjustment := what A produced⟩) → Σ'           -- adjustment + carrier amendment naming the held identity. All three go in together: the audit trace reads judgment and adjustment, so a carrier holding status alone recovers which gaps are left and loses what was decided about the rest [Tool]
Phase 0 → carrier_unreachable (relay): a locator is in scope but the record it names cannot be read  -- surface that the prior gaps were NOT recovered and which locator failed, then proceed with registered := ∅ and Σ.carrier := None and a fresh carrier at Phase 1; the run never continues silently on a partial gap set
Phase 0 → split (pre-certify): KindBinding.atomicity = non-atomic  -- a compound detection bundles two distinct gaps → split into atomic sub-gaps and re-run bind_kind + certify on each (same Phase 0 pass, before any pass/route/defer decision); recursive until atomic, and terminating because each split strictly decreases the number of bundled claims. A non-atomic detection is split pre-registration, never deferred or registered as a compound — one surfaced question that answers for two gaps takes one Judgment for both, and the option budget spends a scarce Gₛ slot on it. WHAT IT SPLITS ON is claim multiplicity and nothing else: one gap standing on evidence that lies in several places is ONE gap, because how far the decision would have to change is what Address answers and not what registration decides
Phase 0 → route_away (gap-local, relay): certify(g).status = route  -- a local route claim holds the detection → emit that claim's routed_deficit (ContextInsufficient, BoundaryUndefined, ContextSuspect — with its command hint), report it with the cited claim fit as text, and DROP g: it is never written to the carrier, never enters registered, and never reaches Qs. The scan continues with the remaining detections. Surfacing over Deciding is preserved by the report, not by a gate — the user sees what was handed elsewhere and on what basis, while nothing about D has been changed
Phase 0 → defer (gap-local): certify(g).status = ambiguous  -- |claimed_by| ≠ 1, several claims holding or none; Λ.unattributed := Λ.unattributed ∪ {g} → ONE bounded narrowed-scope re-assessment at the fixed Phase-0 detection state (AI-side, no user question) → pass (→ g joins G_passed) / route (→ Phase 0 → route_away) / still ambiguous (→ unattributable: g is dropped and reported as a non-blocking residual with what the attribution left unresolved — several claims standing, or none). g leaves Λ.unattributed on every arm, so no detection stays parked
Phase 0 → converge (trivial, all-dropped at registration): G_detected ≠ ∅ ∧ G_passed = ∅ ∧ open(registered) = ∅  -- gaps WERE detected but every one was routed or left unattributable, so registered is unchanged and AuditedDecision holds over it vacuously → report the routed deficits with their command hints and any unattributable residual, and deactivate without surfacing anything at Qs. Distinct from the zero-gap case (Scan found nothing, Rule 7): here the scan found candidates and none of them is a gap this protocol claims

── LOOP ──
After Phase 2: re-scan for newly surfaced gaps from user response.
Every newly detected gap runs the SAME Phase 0 pipeline before it can be registered — bind_kind → split where non-atomic → certify (fail-closed) → bind_value_space — so the certificate-before-registration invariant holds on the re-scan exactly as on the first pass, and a Probe's expanded scan is no exception. A routed or unattributable new detection is reported and dropped, never queued.
If new certificate-passing gaps: record update(Σ.carrier, add) → add to queue.
Pending gaps are active registered gaps ∪ Σ.deferred; each cycle reclassifies pending gaps through AssessGapPressure(D, pending) before Sel. Pending gaps are already certified, so the reclassification re-reads pressure only and never re-opens deficit fit.
P.queued updates Σ.deferred at every carrier write or amendment; later cycles may reclassify any Σ.deferred gap into a higher-pressure bucket when context changes.
Continue until: every registered gap is completed (AuditedDecision) OR user ESC (EarlyExit).
Mode remains active until convergence or explicit user exit (Esc).
Convergence evidence: At every-registered-gap-completed, present audit trace — for each g ∈ registered, show (GapUnnoticed(g) → user_judgment(g) → adjustment(g)) — together with Σ.carrier, so a later session reaches this run's gaps with one read. Convergence is demonstrated by the complete audit record, not asserted by carrier status.
On user ESC: present partial audit trace over judged gaps, then declare remaining registered gaps as unresolved residual — with Σ.carrier alongside, since an exit is exactly where the gaps left unresolved most need a later session to be able to reach them.

── ADJUSTMENT RULES ──
A(Address(c), _, σ) = σ { incorporate(c) }           -- extern: modifies plan
A(Dismiss, _, σ)    = σ { reviewed ← reviewed ∪ {Gₛ[0]} }
A(Probe, _, σ)      = σ { re-scan(expanded) }        -- additional verification round (depth varies by stakes)

── SELECTION RULE ──
Sel(P, d) = take(priority_sort(P.load_bearing ∪ P.cheap_to_settle ∪ P.hidden_high_impact, d), min(|P.load_bearing ∪ P.cheap_to_settle ∪ P.hidden_high_impact|, stakes(d) = High ? 2 : 1))
priority_sort(S, d) = bucket order load_bearing → cheap_to_settle → hidden_high_impact; intra-bucket order follows evidence salience in d, then original Scan order
-- pressure-ordered: load_bearing and cheap_to_settle lead; hidden_high_impact only within its tight cap; nonblocking and queued are carried outside this cycle's surfaced set

── CONTINUATION ──
proceed(Σ) = ¬blocked(Σ)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Qs (constitution)      → present (mandatory; Esc key → loop termination at LOOP level, not a Judgment)
Σ (track)      → record/record update (gap tracking in ONE carrier entry: the creating write returns the identity locator(C) reads, and every later amendment names that identity. Per-gap entries are NOT written — a single dereferenceable record is what lets one read reconstruct the set)
DereferenceCarrier (observe) → record read (conditional: a prior gap-carrier locator is in scope — read the carrier at that locator's record identity, within the session it names; one read yields the whole gap set, so nothing is reassembled from separate records. Unreachable → the carrier_unreachable relay, never a silent fresh start)
carrier_unreachable (extension) → TextPresent+Proceed (conditional: a locator is in scope but the record it names cannot be read — surface that the prior gaps were NOT recovered and which locator failed, then proceed with Σ.carrier := None and a fresh carrier at Phase 1. A partial gap set is never carried silently, and the run does not stop: the gaps this scan finds are still worth surfacing, and what the user needs is to know which earlier ones are missing from them)
Scan (observe) → artifact read, artifact search (stored knowledge extraction: context for gap identification)
bind_kind (sense) → Internal analysis (capture each detected gap as a KindBinding {label: GapKind, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity}. The label is the gap kind — one of the four recognition seeds or an emergent one — and the positive_predicate states what specifically is unaddressed, so the axis the gap is about is a bound field rather than an assumption the question inherits. atomicity carries the backbone's meaning — how many distinct claims this binding bundles — so a detection asserting two gaps lands non-atomic and is split into one atomic sub-gap per claim before certify. It is never asked how far a resolution would reach)
certify (extension) → Internal analysis (fail-closed DeficitFitCertificate; fit of KindBinding.positive_predicate against the own claim and the route claims inscribed in this SKILL.md, reading nothing outside this file: claimed_by = {GapUnnoticed} when the own claim holds alone; status = pass | route | ambiguous; basis = the cited claim fit, shown at the gap's Qs surfacing. Relay (Extension): the fit is grounded in a citable source, and an unclear fit returns status = ambiguous → defer. Runs at Phase 0 for every detection — the first scan and every re-scan alike — BEFORE the gap is pressure-assessed, written to the carrier, or surfaced)
bind_value_space (track) → Internal state update (generate the gap's answer space ONLY after certificate.status = pass and freeze it for the cycle. The codomain is constant — Address, Dismiss and Probe each carry their own ADJUSTMENT RULE whatever the gap is about — so this binds what each judgment REFERS TO for this gap and never which judgments exist; no member is added or dropped and Probe stays present, Rule 12. Rule 8's relay test is then applied to this bound space rather than to an unbound guess at it)
certify_route (extension) → TextPresent+Proceed (conditional: certificate.status = route → emit the matched route claim's routed_deficit as the typed handoff — missing pre-execution fact → ContextInsufficient (hint /inquire), undefined convention/ownership/scope → BoundaryUndefined (hint /bound), an already-collected source whose claim needs testing → ContextSuspect (hint /sublate) — with the cited claim fit as its basis, then drop the gap from registration. The deficit is read off the matched local route claim and the command travels only as a hint. A dropped gap is always reported: the run never removes a detection from the user's view silently)
certify_unattributable (extension) → TextPresent+Proceed (conditional: certificate.status stays ambiguous after its one bounded re-assessment → report the detection as a non-blocking residual with what the attribution left unresolved — several claims standing, or none — and drop it from registration. Non-blocking: it does not gate convergence, because it never entered registered)
AssessGapPressure (sense) → Internal analysis (no external tool; selection-only classification over the certificate-passing gaps G_passed ∪ open(registered), never over raw Scan output; surfaces why a gap is load-bearing while gap resolution remains the user's constitutive act)
A (track)      → Internal state update (no external tool)
converge (extension)   → TextPresent+Proceed (convergence evidence trace; proceed with audited decision)
esc (extension)   → TextPresent+Proceed (partial audit trace + unresolved-gap residual declaration; terminate as EarlyExit, not AuditedDecision)
seam (extension)   → TextPresent+Proceed (fires at deactivation: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares, settles the next move — proceed directly to it, citing that settling source; every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, state: Σ, pressureMapSnapshot: P, active: Bool,
      unattributed: Set(G) }  -- snapshot supports audit trace only; recompute before every Sel
      -- unattributed: WRITTEN by Phase 0 → defer (∪ {g} on parking, minus g on resolution), READ by nothing else. Detections with certificate.status = ambiguous, parked for their ONE bounded narrowed-scope re-assessment against the fixed Phase-0 detection state. Pre-registration parking, so a parked detection has no carrier entry and is absent from registered; after the bounded attempt each resolves to pass, route, or unattributable, so the set always empties within the phase
-- Certificate invariant: ∀ g ∈ registered : certificate(g).status = pass (fail-closed — routed and unattributable detections never enter the carrier, on the first scan and on every re-scan)

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
```

## Core Principle

**Surfacing over Deciding**: AI makes visible; user judges.

## Mode Activation

### Activation

Command invocation activates mode until convergence or Esc; deferred gaps (queued gaps carried in `Σ.deferred`; nonblocking gaps remain active registered gaps) remain resumable on later activation through the carrier locator, per LOOP.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/gap` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Committed action detected with observable, unaddressed gaps via in-protocol heuristics.

**On activation**: if a prior gap-carrier locator is in scope, read that carrier once to recover its gaps and resume tracking; with no locator in scope, start a fresh carrier. The protocol does not search for its own past records — one read at a held identity is the whole recovery path.

### Priority

<system-reminder>
When Syneidesis is active:

**Supersedes**: Risk assessment and decision gating rules in loaded instructions
(e.g., verification tiers, reversibility checks, approval requirements)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At decision points, present potential gaps via Cognitive Partnership Move (Constitution).
</system-reminder>

- Stakes Assessment replaces tier-based gating
- All decision points become candidates for interactive confirmation
- Loaded instructions resume after mode deactivation

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Task completion | Auto-deactivate after final resolution |
| User Esc key | EarlyExit (not AuditedDecision): present partial audit trace + declare remaining registered gaps as unresolved residual, then return to normal operation |

### Plan Mode Integration

When combined with Plan mode, apply Syneidesis at **Phase boundaries**:

| Phase Transition | Gap Check Focus |
|------------------|-----------------|
| Planning → Implementation | Scope completeness, missing requirements |
| Phase N → Phase N+1 | Previous phase completion, dependency satisfaction |
| Implementation → Commit | Changed assumptions, deferred decisions |

**Cycle**: [Deliberation → Gap → Revision → Execution]
1. **Deliberation**: Plan mode analysis generates recommendations (Prothesis supplies multi-perspective lenses when active)
2. **Gap**: Syneidesis surfaces unconfirmed assumptions via Cognitive Partnership Move (Constitution)
3. **Revision**: Integrate user response, re-evaluate if needed
4. **Execution**: Only after explicit scope confirmation

This cycle repeats per planning phase or domain area.

### Conditions

#### Essential (all must hold)

| Condition | Predicate | Test |
|-----------|-----------|------|
| **Committed action** | `committed(D)` | `∃ A : mutates_state(A) ∨ externally_visible(A) ∨ consumes_resource(A)` |
| **Observable gap** | `∃ G : observable(G)` | Concrete indicator exists in context (not speculation) |
| **Unaddressed** | `¬mentioned(G, context)` | Gap not already raised or resolved in session |

**Scope limitation**: `committed(D)` captures *execution commitment* (actions with immediate effects). It does not capture *direction commitment* — decisions that constrain future work without immediate state change (e.g., "let's use PostgreSQL", "refactor auth to OAuth2"). Direction commitment is partially covered by Plan Mode Integration, which applies Gap at phase boundaries where such decisions materialize into execution plans.

#### Modulating Factors (adjust intensity, not applicability)

| Factor | Effect | Heuristic signals |
|--------|--------|-------------------|
| **Irreversibility** | stakes ↑ | "delete", "push", "deploy", "migrate" |
| **Impact scope** | stakes ↑ | "all", "every", "entire", production, security |
| **Time pressure** | stakes ↑ (gap miss probability increases) | "quickly", "just", "right now" |
| **Uncertainty** | scan range ↑ | "maybe", "probably", "I think" |

#### Skip

- `¬committed(D)`: read-only, informational, exploratory actions
- User explicitly confirmed in current session
- Mechanical task (no judgment involved)
- User already mentioned the gap category

## Gap Taxonomy

The four named kinds are the recognition seeds `GapKind` ranges over; a bound gap carries one of them, or an emergent kind, as `kind_binding.label` with `origin` recording which of the two it was.

| Kind | Detection | Question Form |
|------|-----------|---------------|
| **Procedural** | Expected step absent from user's stated plan | "Was [step] completed?" |
| **Consideration** | Relevant factor not mentioned in decision | "Was [factor] considered?" |
| **Assumption** | Unstated premise inferred from framing | "Are you assuming [X]?" |
| **Alternative** | Known option not referenced | "Was [alternative] considered?" |

Reading the kind off this table is where the binding earns its place: the same observation can be read as a missing step or as an unstated premise, and the question forms above diverge accordingly. Binding the kind with a positive predicate makes that reading explicit and checkable before the question is put, instead of leaving it implicit in how the question happened to be worded.

**Emergent gap detection**: Named kinds are working hypotheses, not exhaustive categories. A gap bound to an emergent kind carries `origin = emergent`. Detect Emergent gaps when:
- The unaddressed gap spans multiple named types (e.g., a procedural absence driven by an unstated assumption)
- User dismisses all named-type gaps but the committed action still exhibits observable risk
- The decision context involves domain-specific considerations that resist classification into four generic types

Emergent gaps must satisfy morphism `GapUnnoticed → AuditedDecision` and use adapted question forms.

## Protocol

### Detection (Silent)

Per Phase 0 formal block. After the scan and **before** any gap is pressure-assessed, registered, or surfaced, each detection is dispatched through the shared backbone pipeline in strict order (Rule 16):

1. **Bind the kind** — set `g.kind_binding = { label: GapKind, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity }`. The label is the gap kind and the positive predicate states what specifically is unaddressed, so the axis the question will be asked along is a bound field rather than something the question's wording quietly assumes.
2. **Split a compound detection** — if `atomicity = non-atomic` (the binding bundles two distinct gaps), **split before certify** into one atomic sub-gap per claim and re-run the binding on each. A compound is never registered or surfaced: one question answering for two gaps collects one `Judgment` for both, and it spends one of the at-most-two surfaced slots doing it.
3. **Certify deficit fit (fail-closed)** — `g.certificate = certify(g.kind_binding, local_claims)`, where the local claims are syneidesis's own claim and its route claims, both inscribed in this file (TYPES: `OwnClaim`, `RouteClaim`); the certificate reads nothing outside it. Fit the positive predicate against every one and collect `claimed_by`:
   - **`status = pass`** — `claimed_by = {GapUnnoticed}`, the own claim holding alone. The gap is eligible for registration.
   - **`status = route`** — `claimed_by = {d}` for a single route claim's `routed_deficit`. Emit `d` with its command hint, report the cited fit, and **drop the detection** — it never registers and never reaches the gate.
   - **`status = ambiguous`** — `|claimed_by| ≠ 1`, several claims holding or none. One narrowed-scope re-assessment at the fixed detection state (AI-side; the phase stays silent apart from its relays), then re-certify: pass, route, or — if it stays ambiguous — reported as a non-blocking **unattributable** residual and dropped.
4. **Bind the answer space** — only once the certificate passes, derive the gap's `ValueSpace` and freeze it for the cycle. What the binding fixes is what Address, Dismiss and Probe each refer to *for this gap*; the three judgments themselves are constant.

A detection that is not an unnoticed gap therefore never becomes a question. What it becomes is a reported handoff — which is the same discipline as surfacing, applied to the finding that the item belongs somewhere else.

**Stakes mapping** (from modulating factors):
- Irreversible + High impact → High stakes
- Irreversible + Low impact → Medium stakes
- Reversible + Any impact → Low stakes
- Time pressure → stakes ↑ one level

**Cross-session enrichment**: Prior session indices from the hypomnesis store (prior-session recall indices), when present, may seed gap type weighting during scanning; the constitutive judgment remains with the user.

**Revision threshold**: When accumulated Emergent gap detections across 3+ sessions cluster around a recognizable pattern that the named gap types fail to capture, the cost of maintaining the current taxonomy exceeds the cost of adding a named type — promote the Emergent cluster. Conversely, when a named type consistently yields zero detections across 3+ sessions, consider whether it remains a distinct gap category or has become observationally inert — consistently undetected despite applicable contexts.

### Pressure Assessment (Silent)

Per Phase 0 formal block (`AssessGapPressure` → `P`; bucket definitions in the TYPES block above) and Rule 12: after the backbone pipeline above and before selection, classify the certificate-passing gaps `G_passed ∪ open(registered)` into a GapPressureMap `P` — one bucket per gap for the current cycle.

The two classifications answer different questions and run in this order for that reason. The certificate asks **whether this is a gap this protocol claims at all**; the pressure map asks **why a gap it does claim deserves attention now**. Running the pressure map first would rank items before knowing which of them are the protocol's own — and `hidden_high_impact`, capped at one member, is exactly where that misordering costs the most.

### Surfacing

Present the gap as text output:
- **Gap**: [Specific gap description with evidence]
- **What it is about**: [the bound kind and the specific thing left unaddressed — the positive predicate in plain language, so the user can correct the reading before answering along it]
- **Pressure**: [load-bearing / cheap-to-settle / hidden high-impact, in plain language — why this gap deserves attention now]
- (rationale: [1-line why this gap matters for this decision])

Then **present**:

```
How would you like to address this gap?

Options:
1. **Address** — [what resolving this gap enables or changes in the decision]
2. **Dismiss** — [what assumption holds if this gap is accepted as-is]
3. **Probe** — request additional verification before deciding (rationale depth varies by stakes)
```

Option 3 (Probe) is always visible. When `stakes(D) = High`, present with expanded verification rationale; otherwise, present with brief rationale. Recognition over Recall: hiding Probe forces the user to recall that deeper verification is available.

Other is always available — user can respond freely beyond the listed options.

One gap per decision point.
Exception: Multiple high-stakes gaps → surface up to 2, prioritized by irreversibility.

### Resolution

Per ADJUSTMENT RULES. Key operational detail: Probe triggers a re-scan with expanded scope, surfacing additional gaps the user wants verified before committing.

### Gap Tracking

**Carrier format** — ONE entry holding every registered gap:
```
record({
  subject: "[Gap carrier] decision point",
  description: "one line per gap: [Gap:Kind] question | what it is about (the bound predicate) and the certificate that admitted it | rationale and context | status | once closed, the user's judgment and the adjustment it produced"
})
```

The judgment and adjustment ride in the carrier because the audit trace is assembled from them; a carrier holding status alone would recover which gaps are left and lose what was decided about the rest. The binding and certificate ride there for a different reason: a later session recovers gaps it did not itself certify, and the fail-closed registration invariant has to keep holding for them without re-deriving a fit against a detection state that run no longer has. The creating write returns the identity `locator(C)` reads. Every later amendment and every later session's read name that identity; no second entry is written per gap.

### Interactive Surfacing (Constitution)

When Syneidesis is active, **present** via Cognitive Partnership Move (Constitution) for:

Constitution presentation yields turn for user response.

| Trigger | Action |
|---------|--------|
| Any confirmation needed | Present as structured options |
| High-stakes + multiple gaps | Present priority choices |
| Assumption gap | Always confirm (inference may be wrong) |
| Interpretive uncertainty | Ask whether gap exists before surfacing |
| Naming/structure decisions | Offer alternatives with rationale |

**Why one carrier**: every gap lives in a single durable entry, so the set stays reachable across the session and a later session reconstructs it with one read rather than searching for records it would first have to find.

**Re-scan trigger**: User response may reveal new gaps (e.g., "Yes, backed up" → "Where?" precision gap). Always re-scan after each response.

### UI Mapping

| Environment | Address | Dismiss | Probe |
|-------------|---------|---------|-------|
| Constitution interaction | Selection | Selection | Selection |

Note: Esc key → unconditional loop termination (LOOP level). Constitution interaction blocks until response or Esc.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Reversible, low impact | Constitution interaction with Dismiss as default option |
| Medium | Reversible + high impact, OR Irreversible + low impact | Constitution interaction with rationale context |
| Heavy | Irreversible + high impact | Detailed rationale + Constitution interaction with explicit options |

## Rules

1. **AI-guided, user-judged** (Detection with Authority): AI surfaces gaps as questions ("was X considered?", never "you missed X"); user authority is final — dismissal terminates a gap.
2. **Observable evidence regulation**: Surface only gaps with concrete indicators cited from D; no gap inflation merely to appear thorough — each surfaced gap cites specific context from D.
3. **Minimal intrusion** (Surfacing over Deciding): Lightest intervention that achieves awareness; intensity follows the stakes matrix in `## Intensity`.
4. **Gap order is the pressure map's**: the order gaps are surfaced in is `Sel`'s alone — pressure bucket, then evidence salience, then Scan order. No prerequisite edge between gaps is recorded and none is read; where a gap only makes sense once another is settled, the question's own wording carries that rather than a stored relation.
5. **Round composition**: Compose each round so the reader can act on it without reassembling it — everyday language rather than this file's formal vocabulary, the judgment set beside the evidence it rests on together with the differential implication that matters for the next move, and analytical context laid out before a gate rather than inside it, so the gate carries the question and each option's differential implication. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged, when some of what is in view belongs to a later round or a trace rather than this one, or when this protocol's own phases bear on where a sentence sits relative to a gate.
6. **Convergence evidence**: Present convergence audit trace before declaring all tasks completed; per-gap evidence is required.
7. **Zero-gap surfacing**: If Scan(D) finds no gaps, present scan methodology and conclusion — committed decisions with stakes warrant explicit "no gaps found" confirmation. The all-dropped case is reported **apart** from this one: where the scan did find candidates but every one was routed to a sibling deficit or left unattributable, say that — what was found, where each item was handed, and on what basis. Reporting it as "no gaps found" would tell the user nothing was there when in fact something was, and it was handed elsewhere.
8. **Option-set relay test (Extension classification)**: Single dominant option (entropy → 0) presented as relay. Each Constitution option genuinely viable under different user value weightings; shared-trajectory options collapse to one; off-axis prompts surface as free-response pathways rather than peer options.
9. **Gate integrity** (Safeguard tier): The defined option set is presented intact — option injection/deletion/substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
12. **Protocol-native pressure map**: Phase 0 produces a GapPressureMap before gap selection and **after** the backbone pipeline (Rule 16), so it classifies certificate-passing gaps only. The map is a pre-gate support object for gap selection and question formation, with no terminal-status or generic-calibration authority. It classifies already-detected, already-certified gaps into exactly one current-cycle pressure bucket; gap tasks are sourced exclusively from Scan output, and `AuditedDecision` is unchanged. The two classifications are on different axes and neither substitutes for the other: the certificate settles **whether this is a gap this protocol claims**, the map settles **why a claimed gap deserves attention now**. A map bucket is therefore never evidence of deficit fit, and a passing certificate never implies a gap is load-bearing. Surfacing over Deciding — the map justifies why a gap deserves attention now while gap resolution remains the user's constitutive act. `hidden_high_impact` is the unknown-unknown surface and carries the highest over-application risk, so it is tightly capped (|hidden_high_impact| ≤ 1) and admitted only when the unknown could materially change the user's next judgment; the map must narrow the question set, never make the user inspect every possible gap.
13. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Round composition).
14. **Seam relay on declared continuation**: when a user-declared chain or a composition edge this SKILL.md declares names the next protocol, the between-protocol seam after this protocol's convergence is relay (Extension) — proceed directly, citing the settling source (the chain declaration or the named edge). This governs only the seam BETWEEN protocols; every Constitution gate inside this protocol and the next fires unchanged, and the user can redirect at any turn.
15. **Form feedback**: Silence about form is not evidence about form. Too dense fails quietly — the reader skims, answers past it, stops — while too plain fails out loud, so the complaints that arrive come from one side only. Density therefore does not carry over from the previous round: each round takes it from what this request asked for, while a statement about form does carry over until it is countermanded. Read an instruction about form for the parts of a round it reaches, not for what kind of reaction it is — a complaint, a request, a symptom report and a bare preference are one input here, and sorting them by kind yields nothing the reach reading does not already give while costing a clause per kind. Change the form rather than asking which form they want; naming one is the recall this discipline exists to remove. What such an instruction reaches is whatever the active protocol leaves open in how a round is composed — its density, its ordering, its length. What it does not reach is whatever is already fixed for this round elsewhere: content the protocol requires, wording carried verbatim, an order it presents in, a cadence it caps, a turn boundary it sets. Those stay in place, and the layer that fixed them is what states why. Say in one line what changed; where the instruction overlapped something that stays, say in one line that it stays and why — that second line is owed by the overlap, not by how the instruction was worded.
16. **Registration-time deficit-fit certificate**: Before a detected gap enters the carrier or reaches `Qs`, it is dispatched through the shared meta-backbone pipeline — KindBinding → fail-closed DeficitFitCertificate → value space, in that strict order, at Phase 0 on the first scan and on every re-scan alike. (a) **Registration-time**: the certificate attaches per gap at detection time, before the pressure map is built; gap detection itself stays AI-side. This is the per-item form of the pipeline rather than an up-front one-shot dispatch, because each gap carries its own claim and no single shared value is fixed for the rest of the run to read. (b) **Fail-closed certificate**: `certificate.status = pass` strictly precedes registration and surfacing; `status = route` emits the matched route claim's `routed_deficit` (ContextInsufficient, BoundaryUndefined, ContextSuspect — command hints `/inquire`, `/bound`, `/sublate`) and drops the gap; a non-atomic detection is split into atomic sub-gaps before certify; and `status = ambiguous` — `|claimed_by| ≠ 1`, several claims holding or none — triggers ONE narrowed-scope re-assessment at the fixed Phase-0 detection state, then pass / route / unattributable. The certificate is generated by fitting the gap's positive predicate against the own claim and the route claims inscribed in THIS SKILL.md, reading nothing outside this file; `claimed_by` is a Set, so "no claim holds" is a value rather than a hole, landing in `ambiguous` alongside the several-claims case. A pass certifies local admissibility — this protocol's own gate over its own activation — not the absence of a claim anywhere in the wider protocol set, which is why a gap that arrived because another protocol's route claim named `GapUnnoticed` is still certified here: that label was their gate's finding, not this one's. The certify step is relay (Extension — the fit is grounded in the cited local claims, an unclear fit returns `status = ambiguous` → defer; basis cited at the gap's `Qs` surfacing). (c) **A dropped detection is reported, never silent**: route and unattributable both emit as text with their cited basis before the detection leaves the run. Surfacing over Deciding is what requires it — the AI has judged the item to be another deficit's, and that judgment reaches the user with its ground while nothing about `D` has changed. (d) **Constant codomain, kind sets content**: `bind_value_space` runs only after the certificate passes and returns the same `Judgment` coproduct for every gap kind; the bound kind is its domain, selecting what Address, Dismiss and Probe each refer to for this gap, never which of them exist. No member is added or dropped, and Probe stays visible per Rule 12. (e) **Backbone discipline**: the schema is ONE canonical definition shared across protocols; this protocol instantiates only `object_ref` (= Gap), `local_value_space` (= `Judgment`), the label field's type (`GapKind`), the own claim, and the local route claims — same field names, same fail-closed statuses, same certificate-before-registration order.
