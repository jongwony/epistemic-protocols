---
name: sublate
description: "Vet working context by dialectical antithesis before action. Type: (ContextSuspect, User, VET, WorkingContext) → VettedContext. Alias: Elenchus(ἔλεγχος)."
---

# Elenchus Protocol

Vet working context by dialectical antithesis before action through structured per-claim disposition judgment, resolving suspect context into vetted context. Type: `(ContextSuspect, User, VET, WorkingContext) → VettedContext`.

## Definition

**Elenchus** (ἔλεγχος): A dialogical act of cross-examination — from the Socratic refutation tradition meaning "testing by argument" — resolving suspect working context into vetted context through provenance challenge, counterfactual gap forecasting, cross-source consistency check, and inference-fallacy archetype scan before pre-execution sync. The protocol's lexical verb is `/sublate`. Each suspect source undergoes the motion of stating its current claim, surfacing what would shake it, and then deciding how to handle the source in light of that challenge (the Hegelian *Aufhebung* — preserve + negate + lift up — supplies the source vocabulary).

```
── FLOW ──
W → identify(W) → S_cand → ∀s ∈ S_cand: bind_kind(s) [split where non-atomic] → certify(s, local_claims) → keep(status = pass) → bind_value_space(s) → S_high →
  S_high = ∅: emit empty VettedContext (extension) → deactivate   -- trivial convergence, two causes reported apart: no audit-candidate source at all, or candidates none of which this protocol claims
  S_high ≠ ∅: tag(provenance, freshness, leverage) → S' → posit(antithesis) → A[] →
  Q(per-claim disposition slots) → J → integrate(J, S') → V →
  (loop if ∃ a : disposition(a) = Deferred ∧ trigger(a) met)

── MORPHISM ──
WorkingContext
  → identify(high_leverage_sources, S_cand)    -- silent scan for sources warranting audit
  → bind_kind(source) → certify(audit, local_claims) → bind_value_space(audit) -- shared meta-backbone: bind each candidate to the CLAIM it is being read as authority for, certify deficit fit (fail-closed) against the claims inscribed in this SKILL.md, then derive its disposition space — in that strict order, BEFORE any tagging, antithesis, or surfacing
  → tag(provenance, freshness, leverage)        -- attach metadata triple per audit
  → posit(antithesis per audit)                 -- Pattern A ∪ Pattern B ∪ Pattern C ∪ Pattern D ∪ Emergent(Pattern)
  → present(antitheses, disposition slots)      -- per-claim Constitution interaction
  → judge(disposition per audit)                 -- closed coproduct response
  → emit(VettedContext with disposition table)
  → VettedContext
requires: working_context_pre_execution_committed   -- runtime checkpoint (Phase 0)
deficit:  ContextSuspect                            -- activation precondition (Layer 1); the certificate's own_claim deficit for in-scope audits
preserves: source_chain                              -- W.sources is read-only; binding, antithesis and disposition annotate, never mutate. A split produces several AUDITS over one source, never several sources
invariant: Dialectical Vetting over Silent Trust
invariant: certificate-before-surfacing              -- DeficitFitCertificate.status = pass strictly precedes entry into S_high, and therefore precedes tagging, antithesis positing, and the Phase 2 disposition gate (shared meta-backbone order)

── TYPES ──
W              = WorkingContext { sources: List(Source), action: Prospect }
Source         = { content: String, origin: Origin, observed_at: Timestamp, downstream: List(Reference) }
Origin         ∈ {UserStatement, DocumentRead, ToolOutput, AIInference, ExternalAPI, PastSession} ∪ Emergent(Origin)
identify       = WorkingContext → Set(Source)            -- silent selection per Source Identification Criteria
S_cand         = Set(Source) from identify(W)            -- audit CANDIDATES: sources the criteria selected, before any of them is bound to a claim, certified, or admitted
AuditRef       = { source: Source, claim: ClaimRef }      -- the audit's STABLE IDENTITY, and the only thing any map is keyed by
               -- both components are fixed when the audit is formed and never rewritten afterwards, which is what lets a Deferred audit be re-certified without its key moving. Every map written "over ClaimAudit" below — S', J, V.trace, and the Λ maps — is keyed by this ref; two audits are the same audit exactly when their refs agree
ClaimAudit     = { ref: AuditRef, kind_binding: KindBinding, certificate: DeficitFitCertificate, value_space: ValueSpace }
               -- object_ref: the per-audit anchor the certificate evaluates and the value space binds over (elenchus-local instantiation of the shared backbone's object_ref)
               -- IDENTITY VERSUS CONTENTS: ref is the identity, and the three fields after it are contents a re-certification may replace. Keying anything by the whole record would make re-certifying a re-triggered audit silently change its key and orphan its entry, so the split is load-bearing rather than presentational
               -- THE UNIT OF JUDGMENT IS THE SOURCE UNDER ONE CLAIM, not the source. One source read as authority for two distinct claims is TWO audits, which is what the atomicity split produces and what Rule 15 has always required be surfaced rather than carried over silently. A source carrying one claim yields one audit, which is the ordinary case
               -- ASSEMBLED ACROSS THE PHASE 0 PIPELINE: identify selects the source, and bind_kind, certify and bind_value_space each add what only they can produce, in the order Rule 21 fixes
S_high         = Set(ClaimAudit)                          -- the audit-candidate set: atomic and certificate-passing BY CONSTRUCTION, since nothing else is admitted to it. Cardinality 0 yields trivial convergence
ClaimRef       = { referent: String, claim_kind: String, scope: String, text: String }
               -- claim_kind = the SEMANTIC CATEGORY of claim the source is tested as authority for (a distinct axis from an evidence-channel kind); values are protocol-local (self-contained, no shared cross-protocol enum). text = claim verbatim, used by Pattern A's cite-claim-verbatim test
               -- carried as KindBinding.label (below), which is what makes the axis a BOUND FIELD rather than something the antithesis inherits from how it happened to be worded. All four components are load-bearing for that: referent and claim_kind fix what the claim is about and in what category, scope fixes how far it reaches, and text pins the wording the challenge must confront
ProvenanceTag  = { source: Source, claim: ClaimRef, evidence: VerificationPath, confidence: Float }
               -- claim-relative tag: the source's authority is recorded for the claim it authorizes, not for the source in general
VerificationPath ∈ {DirectObserved, InferredFromN, ExternalCited, ProvisionalAssumption}
FreshnessTag   = { source: Source, age: Duration, horizon: Duration, stale: Bool }
               -- currency only: a source can be fresh yet still not track the behavior its claim asserts (it documents intent with nothing enforcing the match). Freshness is necessary but not sufficient for trusting a source; the support-integrity challenge is posited per source in Pattern A (Source Provenance Audit).
LeverageTag    = { source: Source, downstream_count: Nat, branches: Set(Reference) }
S'             = Map(ClaimAudit, ProvenanceTag × FreshnessTag × LeverageTag)
               -- keyed by the AUDIT, not the source: ProvenanceTag is claim-relative already (Rule 15), so two audits over one source carry two provenance verdicts. FreshnessTag and LeverageTag are properties of the source and are therefore identical across sibling audits — carried per audit so one read gives the whole triple, not because they differ

-- Shared meta-backbone (KIND dispatch, admission-time). One canonical schema; elenchus-local instantiation ONLY for object_ref (= ClaimAudit), local_value_space (= the per-audit disposition space), the label field's type (ClaimRef), the own claim, and the local route claims.
KindBinding    = { label: ClaimRef, positive_predicate: String, evidence: Set(Evidence), origin ∈ {seed, emergent}, atomicity ∈ {atomic, non-atomic} }
                 -- binds the candidate to the CLAIM it is being read as authority for, read off the source's content together with its downstream references. positive_predicate states what makes that claim suspect
                 -- origin is ALWAYS emergent here, and that is the whole of what elenchus has to say about it: this protocol declares no seed claim kinds (ClaimRef.claim_kind is protocol-local and open), so nothing local branches on the field. It stays in the schema because the schema is shared; a sibling protocol that does carry seeds reads it there
                 -- if atomicity = non-atomic (the binding bundles two distinct claims) → split BEFORE certify. No compound is admitted to S_high, tagged, posited against, or surfaced
                 -- atomicity IS THE BACKBONE'S QUESTION AND CARRIES THE BACKBONE'S MEANING: how many distinct claims this binding bundles — the same question the sibling protocols sharing this schema ask of it. It never asks how far a disposition would reach: one claim standing on evidence that lies in several places is ONE audit, because what becomes of the source is what the disposition answers and not what admission decides
Evidence       = { source: String, content: String }   -- observable indicator from W supporting the binding and the certificate's deficit-fit basis
OwnClaim       = { deficit: ContextSuspect, resolution: VettedContext, in_scope_if: String }
                 -- the claim elenchus makes, stated as the WHOLE local morphism: the deficit it takes AND the resolution it produces. An audit is claimed here when its positive_predicate instantiates ContextSuspect AND the local value space can carry it to VettedContext — the bare deficit label is a name, the morphism is the predicate
DeficitFitCertificate = { own_claim: OwnClaim, route_claims: List<RouteClaim>, claimed_by: Set(Deficit), evidence: Set(Evidence), status ∈ {pass, route, ambiguous} }
                 -- fail-closed: status ≠ pass BLOCKS entry into S_high, and therefore blocks tagging, antithesis positing, and the Phase 2 disposition gate. Generated at Phase 0 by fitting KindBinding.positive_predicate against own_claim and every route_claim inscribed below — the certificate reads nothing outside this SKILL.md
                 -- claimed_by collects every claim the evidence supports; a SET, so "no claim holds" is the value ∅ rather than a hole in the type
                 -- status = pass: claimed_by = {ContextSuspect} — the own claim holds alone → admitted to S_high
                 -- status = route: claimed_by = {d} for a single route_claim's routed_deficit d → emit d as the typed handoff and drop the audit; it never enters S_high, so it never reaches a disposition slot and never enters vetted(V)'s quantifier
                 -- status = ambiguous: |claimed_by| ≠ 1 — several claims hold, or none holds on the evidence at hand → ONE bounded narrowed-scope re-assessment at the fixed Phase-0 detection state (AI-side, no user question — the phase stays silent apart from its relays) → pass / route / unattributable (dropped and reported, never admitted). ONE attempt, because a silent phase cannot ask and W.sources is read-only (preserves: source_chain), so the re-assessment re-reads a detection state that cannot have moved and an identical retry can add nothing. Which of the three that attempt reaches is read at that turn from the session's own context and the user's wording, never fixed here
                 -- what a pass certifies is LOCAL ADMISSIBILITY: elenchus's own gate governing elenchus's own activation, not the absence of a claim anywhere in the wider protocol set. Where two protocols' scopes both reach a situation, each protocol's own gate governs
RouteClaim     = (route_if_predicate: String, routed_deficit: Deficit)
                 -- elenchus-local route claims — what a candidate is handed to when it is not a suspect claim in the working context. routed_deficit is the BINDING field; the command in parentheses is a non-binding hint for the user, not the relation this guard composes on:
                 --   a missing pre-execution fact — nothing to vet, something to acquire        → ContextInsufficient (hint: /inquire)
                 --   an unnoticed decision gap at the pending action rather than a suspect claim → GapUnnoticed        (hint: /gap)
                 --   the claim is not open at all: a convention or ownership question settles it → BoundaryUndefined   (hint: /bound)
Deficit        = a deficit label an audit may be claimed by — elenchus's own ContextSuspect, or one of the sibling deficits named in the route claims above. Every label THIS CERTIFICATE can assign is inscribed in THIS SKILL.md; nothing outside this file supplies one
               -- the bound on what is inscribed here scopes the certificate, which is a check this protocol performs and must therefore be able to run from this file alone. A user-answered Routed carries a deficit too, and that one is the user's to name: they may hand the claim to a deficit this file never mentions, which is a judgment rather than a check and needs no local inscription to be well-formed
bind_value_space : ClaimAudit → ValueSpace              -- the audit's disposition space; generated ONLY after certificate.status = pass, and frozen for the cycle
ValueSpace     = Disposition                            -- the user-answerable disposition coproduct (local_value_space; elenchus-local instantiation point) — the SAME coproduct for every audit
                 -- the codomain is CONSTANT and the certified ClaimRef is the DOMAIN: what the binding fixes is what each constructor REFERS TO for this audit — what a Revised refinement would rewrite, which external reference a Bounded would name, which measurement a Conditional waits on, which deficit a Routed hands to. Those payloads are read off the bound claim, never authored ahead of it
                 -- NO CONSTRUCTOR IS DROPPED. Each of the seven carries a distinct downstream path, so the closure is already grounded and pruning it would need a predicate proving a path IMPOSSIBLE for this audit — not merely unlikely, which is the most a dead-signal reading of Rule 8 can supply. What Rule 8 governs here is whether the gate opens at all, and it is applied to a space that is already bound rather than to an unbound guess at it
                 -- so the ordering, not any narrowing, is what this step buys: an option set materialized before the claim is certified is a set of concrete answers to a question nobody has fixed yet, and the more fluent those answers read the harder the unsettled question is to see
Pattern        ∈ {ProvenanceAudit, CounterfactualGap, CrossSourceConsistency, InferenceFallacyAudit} ∪ Emergent(Pattern)
Antithesis     = { audit: ClaimAudit, pattern: Pattern, thesis: String, antithesis: String, basis: String }
               -- posited against the bound CLAIM, so the thesis is that claim and the challenge confronts it. Pattern C's candidate pairs are enumerated over audits sharing a referent, which the bound ClaimRef makes a typed comparison rather than a judgement about wording
A[]            = List(Antithesis)
Disposition    = Confirmed                                   -- assumption survived antithesis
               | Revised(refinement: String)                 -- assumption updated per antithesis
               | Discarded(reason: String)                   -- assumption withdrawn
               | Deferred(re_trigger_condition: String)      -- next iteration on trigger
               | Conditional(measurement: String)            -- pending external measurement
               | Bounded(external_reference: String)         -- routed to other source-of-truth
               | Routed(routed_deficit: Deficit)             -- the user hands the vetted claim to a different deficit
               -- PAYLOAD IS THE DEFICIT, not a command: the same discipline the route claims follow, so the two places this protocol names another protocol agree on what binds. The command travels as a hint
               -- DISTINCT FROM A CERTIFICATE ROUTE, and the two never compete for the same item. A certificate route fires at Phase 0 on a candidate that was never elenchus's to begin with, and drops it before it is tagged or posited against. This constructor is answered at Phase 2 by a user looking at a claim that DID pass — the antithesis has been put to them, and their judgment is that resolving it belongs elsewhere. So the certificate answers "is this mine?" before any work is done, and this answers "what becomes of it?" after the work is done. Where the user judges the certificate to have got the first question wrong, the correction is to re-invoke the protocol rather than to answer here
Qs             = Per-claim disposition gate
J              = Map(ClaimAudit, Disposition)          -- J(a) ∈ value_space(a): the answer is drawn from the space bound for THAT audit, which is a refinement of Disposition and not a second coproduct
V              = VettedContext { dispositions: J, trace: Map(ClaimAudit, Antithesis) }
trigger_met(c)        = Bool                                                                            -- evaluator: true when a Deferred re_trigger_condition c is now satisfied at the LOOP scan
unresolved(Λ)         = {a ∈ S_high | a ∉ dom(Λ.dispositions) ∨ (∃c. Λ.dispositions(a) = Deferred(c) ∧ trigger_met(c))}   -- audits still requiring judgment: unjudged, or Deferred whose trigger has fired (re-vetting due); an untriggered Deferred is resolved (vetted-compatible), not pending
vetted(V)      = dom(J) = S_high ∧ ∀ a ∈ S_high : ¬(∃c. J(a) = Deferred(c) ∧ trigger_met(c))
               -- quantifies over S_high, which holds certificate-passing audits only. A routed or unattributable candidate never entered it, so it is absent from this predicate by construction rather than closed inside it — which is why no certificate-assigned Disposition constructor is needed
VettedContext  = V where vetted(V)
EarlyExit      = V where user_esc ∨ user_cancel  -- non-convergent early exit: V as of exit (dispositions/trace = judgments recorded so far, empty when exit precedes the first judged batch); working context remains un-vetted (or partially vetted under user_cancel); unresolved sources (unresolved(Λ): unjudged, or Deferred whose trigger has fired) declared as unresolved residual

── PHASE TRANSITIONS ──
Phase 0: W → identify(W) → S_cand → ∀s ∈ S_cand: bind_kind(s) → certify(s, local_claims) → keep(status = pass) → bind_value_space each → S_high   -- silent scan + admission-time KIND dispatch (fail-closed), silent apart from the certificate's route / unattributable relays. The whole backbone pipeline runs WITHIN Phase 0, so everything downstream — tagging, antithesis, the Phase 2 gate — operates on audits that are atomic and certificate-passing by construction
Phase 0 → split (pre-certify): KindBinding.atomicity = non-atomic  -- a candidate bound to a claim that bundles two distinct claims → split into one atomic audit per claim and re-run bind_kind + certify on each (same Phase 0 pass, before any pass/route/defer decision); recursive until atomic, and terminating because each split strictly decreases the number of bundled claims. A compound is split pre-admission, never deferred or admitted as one — a single disposition slot answering for two claims collects one judgment for both and records it against a thesis the user was never shown whole. WHAT IT SPLITS ON is claim multiplicity and nothing else: one claim standing on evidence that lies in several places is ONE audit, because what becomes of the source is what the disposition answers and not what admission decides
Phase 0 → route_away (audit-local, relay): certify(a).status = route  -- a local route claim holds the candidate → emit that claim's routed_deficit (ContextInsufficient, GapUnnoticed, BoundaryUndefined — with its command hint), report it with the cited claim fit as text, and DROP a: it never enters S_high, is never tagged or posited against, and never reaches a disposition slot. The scan continues with the remaining candidates. Surfacing over Deciding is preserved by the report rather than by a gate — the user sees what was handed elsewhere and on what basis, while W.sources stands untouched
Phase 0 → defer (audit-local): certify(a).status = ambiguous  -- |claimed_by| ≠ 1, several claims holding or none; Λ.unattributed := Λ.unattributed ∪ {a} → ONE bounded narrowed-scope re-assessment at the fixed Phase-0 detection state (AI-side, no user question) → pass (→ a is admitted to S_high) / route (→ Phase 0 → route_away) / still ambiguous (→ unattributable: a is dropped and reported as a non-blocking residual with what the attribution left unresolved — several claims standing, or none). a leaves Λ.unattributed on every arm, so nothing stays parked
Phase 0 → converge (trivial, no candidate): S_cand = ∅ → emit empty VettedContext (dispositions = ∅, trace = ∅) as relay, deactivate   -- no source met the Source Identification Criteria; nothing was ever bound
Phase 0 → converge (trivial, none claimed): S_cand ≠ ∅ ∧ S_high = ∅ → report every routed deficit with its command hint and any unattributable residual, emit empty VettedContext (dispositions = ∅, trace = ∅) as relay, deactivate   -- candidates WERE selected but every one was routed or left unattributable. Reported apart from the no-candidate case above: telling the user nothing warranted vetting would be false where something did and was handed elsewhere
Phase 0 → Phase 1: S_high ≠ ∅                                            -- every member carries certificate.status = pass
Phase 1: S_high → Step₁ tag(provenance, freshness, leverage) → S'       [Tool: artifact read, artifact search]
         Step₂ posit(antithesis per a ∈ S') → A[]                        -- per-audit Pattern A ∪ B ∪ C ∪ D ∪ Emergent(Pattern) generation
Phase 2: (A[], disposition slots) → Qs(per-claim, options drawn from value_space(a)) → Stop → J            [Tool: Constitution interaction]
Phase 3: J → integrate(J, S') → V                                        -- per-audit disposition recorded

── LOOP ──
After Phase 3: scan for Deferred dispositions whose re_trigger_condition is met.
If ∃ a : J(a) = Deferred(c) ∧ trigger_met(c): re-run the Phase 0 pipeline on a — bind_kind → split where non-atomic → certify → bind_value_space — then return to Phase 1 with it as fresh ContextSuspect; new antithesis under updated evidence. The trigger fired because conditions moved, so the claim may have moved with them: re-binding is what keeps the antithesis aimed at the claim as it now stands, and re-certifying is what keeps the fail-closed order holding across the loop rather than only on the first pass. Where the re-certification no longer passes, a leaves S_high with its route or unattributable report and |S_high| decreases — so progress(Λ) is a ratio over a set that can shrink mid-run, and a rise in it can mean an audit was handed elsewhere rather than judged.
If all dispositions resolved (no Deferred or all triggers unmet): terminate with VettedContext.
User can exit at Phase 2 (user_esc).
Continue until: vetted(V) OR user_esc/user_cancel (EarlyExit, not VettedContext).
Convergence evidence: At vetted(V), present transformation trace — for each a ∈ S_high, show (claim(a) → antithesis(a) → disposition(a)), naming the source each claim was read off. Where one source yielded several audits, each is shown on its own line with its own claim, since that split is what the user was asked to judge separately. Report apart from the trace any candidate the certificate routed or left unattributable, with the deficit it was handed to and the cited basis — those never entered S_high, so the trace does not range over them, and a reader who saw them reported at Phase 0 is owed the same list at the end. Convergence is demonstrated, not asserted.
On user_esc/user_cancel: present partial trace over judged audits (claim(a) → antithesis(a) → disposition(a) for each judged a), then declare unresolved(Λ) audits in S_high (unjudged, or Deferred whose trigger has fired — re-vetting due at exit) as unresolved residual.

── CONVERGENCE ──
vetted(V): see TYPES
certificate gate: every audit in S_high carried certificate.status = pass (fail-closed, at admission) — routed and unattributable candidates never entered it, so a VettedContext is assembled only from audits the own claim holds (claimed_by = {ContextSuspect}), each fit-certified and each atomic. The pass certifies LOCAL admissibility — elenchus's own gate over elenchus's own activation — not the absence of a claim anywhere in the wider protocol set
progress(Λ) = 1 if |S_high| = 0 else 1 - |unresolved(Λ)| / |S_high|   -- S_high = ∅ is fully converged, not undefined, on either trivial-convergence path (no candidate, or no candidate this protocol claims); progress = 1 coincides with vetted(V). NOT monotone across the loop: a re-triggered Deferred audit that fails re-certification leaves S_high, changing the denominator
early_exit = user_esc ∨ user_cancel

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 identify        (sense)        → Internal analysis (high-leverage / age / chain / contradiction / inference-character scan, over sources; produces S_cand)
Phase 0 bind_kind       (sense)        → Internal analysis (bind each candidate to the CLAIM it is being read as authority for — a KindBinding {label: ClaimRef, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity} read off the source's content together with its downstream references. The label carries referent, claim_kind, scope and the verbatim text, so the axis the antithesis will confront is a bound field rather than an assumption inherited from how the challenge was worded. atomicity carries the backbone's meaning — how many distinct claims this binding bundles — so a candidate read as authority for two claims lands non-atomic and is split into one atomic audit per claim before certify. It is never asked how far a disposition would reach)
Phase 0 certify         (extension)    → Internal analysis (fail-closed DeficitFitCertificate; fit of KindBinding.positive_predicate against the own claim and the route claims inscribed in this SKILL.md, reading nothing outside this file: claimed_by = {ContextSuspect} when the own claim holds alone; status = pass | route | ambiguous; basis = the cited claim fit, shown at the audit's Phase 2 surfacing. Relay (Extension): the fit is grounded in a citable source, and an unclear fit returns status = ambiguous → defer. Runs at Phase 0 for every candidate, and again on a re-triggered Deferred audit, BEFORE it is admitted to S_high)
Phase 0 bind_value_space (track)       → Internal state update (generate the audit's disposition space ONLY after certificate.status = pass and freeze it for the cycle. The codomain is constant — all seven constructors, each with its own downstream path — so this binds what each constructor REFERS TO for this audit and never which constructors exist. No member is added or dropped, which is what keeps Rule 11's intact-option-set requirement and this step from pulling against each other. Rule 8's relay test is then applied to this bound space rather than to an unbound guess at it)
Phase 0 certify_route   (extension)    → TextPresent+Proceed (conditional: certificate.status = route → emit the matched route claim's routed_deficit — a missing pre-execution fact → ContextInsufficient (hint /inquire), an unnoticed decision gap → GapUnnoticed (hint /gap), a claim a convention or ownership question already settles → BoundaryUndefined (hint /bound) — with the cited claim fit as its basis, then drop the candidate from admission. The deficit is read off the matched local route claim and the command travels only as a hint. A dropped candidate is always reported: the run never removes one from the user's view silently)
Phase 0 certify_unattributable (extension) → TextPresent+Proceed (conditional: certificate.status stays ambiguous after its one bounded re-assessment → report the candidate as a non-blocking residual with what the attribution left unresolved — several claims standing, or none — and drop it from admission. Non-blocking: it never entered S_high, so it gates no convergence)
Phase 0 trivial_converge (extension)   → TextPresent+Proceed (conditional: S_high = ∅ — relay the empty VettedContext and deactivate. The two causes are reported apart: no source met the criteria, or candidates were selected and every one was routed or left unattributable, in which case the routed deficits and the residual are named)
Phase 1 ProvenanceTag   (observe)      → artifact read, artifact search (verification of source origin, authorized claim, and downstream references)
Phase 1 AntithesisPosit (sense)        → Internal analysis (Pattern A/B/C/D/Emergent antithesis generation per audit, against the claim its binding fixed)
Phase 2 Qs              (constitution) → present (mandatory; per-claim disposition slots drawn from that audit's bound value_space; Esc → loop termination at LOOP level, not a Disposition)
Phase 3 integrate       (track)        → Internal state update (Λ.dispositions, Λ.history)
converge                (extension)    → TextPresent+Proceed (per-claim disposition trace + the routed/unattributable report; proceed with VettedContext)
esc/cancel              (extension)    → TextPresent+Proceed (partial per-claim disposition trace + unresolved-audit residual declaration (unresolved(Λ)); terminate as EarlyExit, not VettedContext)
Seam transition to a declared next protocol (extension) → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares, settles the next move — proceed directly to it, citing that settling source; every Constitution gate inside Elenchus and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = {
  phase: Phase,
  W: WorkingContext,
  S_high: Set(ClaimAudit),
  unattributed: Set(ClaimAudit),
  tagged: Map(ClaimAudit, ProvenanceTag × FreshnessTag × LeverageTag),
  antitheses: Map(ClaimAudit, Antithesis),
  dispositions: Map(ClaimAudit, Disposition),
  history: List<(ClaimAudit, Antithesis, Disposition)>,
  active: Bool,
  cause_tag: String
}
-- unattributed: WRITTEN by Phase 0 → defer (∪ {a} on parking, minus a on resolution), READ by nothing else. Candidates with certificate.status = ambiguous, parked for their ONE bounded narrowed-scope re-assessment against the fixed Phase-0 detection state. Pre-admission parking, so a parked candidate is absent from S_high and from every predicate that quantifies over it; after the bounded attempt each resolves to pass, route, or unattributable, so the set always empties within the phase
-- Certificate invariant: ∀ a ∈ S_high : a.certificate.status = pass (fail-closed — routed and unattributable candidates never enter S_high, on the first pass and on every loop re-certification)
-- Atomicity invariant: ∀ a ∈ S_high : a.kind_binding.atomicity = atomic (the split runs pre-certify, so no compound is ever admitted)

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Pattern resolution emergent via session context.
```

## Core Principle

**Dialectical Vetting over Silent Trust**: Working context accumulated across a session carries silent decay — sources age, provenance chains lengthen, downstream concentration warps incidental claims into load-bearing premises, and cross-source contradictions hide behind topical proximity. Elenchus surfaces each suspect source against a deliberately posited antithesis before action; the user judges each disposition per source. The loop dissolves compounding context cost before it forces whole-system refactoring downstream.

## Mode Activation

### Activation

Command invocation activates mode until a disposition is judged for every audit the admission pipeline let through — one per claim under test, which is one per source in the ordinary case and more where a source was read as authority for several.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/sublate` slash command or description-matching input. Always available.
- **Layer 2**: No AI-guided activation. The user signals awareness that the working context warrants vetting before commit-to-action (deploy, deposit, external sync, merge).

The User-initiated stance is calibrated: AI auto-detection of "this context smells stale" carries a false-positive cost (interrupting flow with low-confidence vetting prompts) that outweighs its savings (the user already knows when they are about to externalize and is best positioned to invoke).

### Priority

<system-reminder>
When Elenchus is active:

**Supersedes**: Direct execution patterns that proceed without per-claim disposition judgment
(Working context must be vetted source-by-source via Cognitive Partnership Move (Constitution), not assumed silently)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 0, bind each candidate to the claim under test and certify deficit fit before anything is surfaced. At Phase 2, present per-claim disposition slots with antithesis evidence via Cognitive Partnership Move (Constitution).
</system-reminder>

- Elenchus completes before action dependent on the vetted context proceeds
- Loaded instructions resume after vetting or Esc

### Triggers

| Signal | Detection |
|--------|-----------|
| Pre-sync commit | User signals upcoming externalization of working context (meeting share, PR push, deploy, deposit) |
| Long-collected context | User signals duration concern about accumulated context |
| Provenance concern | User questions verification status of a specific source |
| Counterfactual concern | User varies a current condition and asks whether downstream still holds |
| Cross-source friction | User notices two collected sources pointing at the same referent diverging |
| Inference-soundness concern | User questions whether a conclusion's reasoning holds rather than the source it cites |

**Qualifying condition**: Activate only when working context exists and the user signals an upcoming pre-execution sync or externalization. The protocol does not activate on freshly-arrived context with no audit-candidate sources — the silent scan at Phase 0 yields `S_cand = ∅`, which converges trivially. It also converges trivially, and reports so distinctly, where candidates were found but none survived admission.

**Skip**:
- Working context is empty or just-arrived (no high-leverage / aged / inferred / contradicting source)
- The action under consideration is itself a Phase 0 silent scan (vetting before vetting recurses without termination)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| All dispositions resolved (no Deferred or all triggers unmet) | Emit VettedContext, proceed |
| Phase 0 admits nothing (`S_high = ∅`) | Emit empty VettedContext trivially (relay), deactivate — saying which of the two happened: no source met the criteria, or every candidate was routed to a sibling deficit / left unattributable |
| User Esc | Return to normal operation; working context remains un-vetted |
| User explicitly cancels mid-loop | Accept partial vetting; remaining sources annotated as un-vetted in trace |

## Source Identification Criteria

User-initiated activation triggers Phase 0's silent scan. The scan does not gate activation — its purpose is to *select which sources within the committed working context warrant audit*. The five criteria below guide source selection; sources matching one or more enter `S_cand`. Selection is not admission: a candidate becomes an audit only once Phase 0 binds it to a single claim and certifies that the claim is one this protocol takes on.

| Criterion | Condition | Pattern Hint |
|-----------|-----------|--------------|
| High-leverage accumulation | A single source carries downstream weight beyond a working threshold (downstream_count ≥ 3 is the current working hypothesis) — multiple decisions, sub-plans, or commit paths depend on it | Pattern A (provenance) |
| Source age beyond horizon | Source's `observed_at + horizon(origin)` < now; horizon varies by origin (UserStatement and ToolOutput have shorter horizons than DocumentRead and PastSession) | Pattern A or B |
| Provenance-chain length | The belief depends on an N-step inference chain rather than direct observation, citation, or measurement | Pattern A (provenance) |
| Cross-source contradiction | Two collected sources nominally pointing at the same referent diverge in their content or implication | Pattern C (cross-source consistency) |
| Inference-character conclusion | The source is itself a conclusion reached by inference (origin `AIInference`, or a conclusion beginning to function as a standing premise) | Pattern D (inference fallacy) |

`N` (high-leverage threshold) and horizon defaults per origin are residual variables refined through accumulated use evidence. The five criteria are working hypotheses, not closed; an Emergent criterion may surface on use.

## Patterns

Four patterns are inscribed. Each pattern pairs a current claim with a challenge that would shake it; the AI surfaces both at Phase 1 Step 2 per source, and the user decides how to handle the source at Phase 2. A further Emergent pattern is permitted but not pre-named — it must satisfy `ContextSuspect → VettedContext` (the challenge must directly confront the source's claim, not stand as a side verification check).

Patterns A, B, and C vet a source along the **source-vetting axis** (provenance authority, counterfactual robustness, cross-source agreement). Pattern D vets along the **reasoning axis** — whether the inference that produced a conclusion is itself sound — complementing the source-vetting patterns so that the inference, not only its source, is examined.

### Pattern A — Source Provenance Audit

When a source claims authority, the challenge asks whether that authority is actually verified for the claim it is grounding.

- The source's current claim: "Source X is verified for claim C in the domain it claims to ground."
- What would shake it: "Source X's verification path authorizes a different claim, is provisional, inferred, cited but unread, or stale — or X is fresh and present yet nothing actually ties it to the behavior it claims, so it could have quietly drifted out of agreement (ask: if that behavior changed today, would X break or fail, or stay unchanged and silently wrong?). A source that only documents intended behavior, with nothing enforcing the match, is not settled by freshness alone."
- The user decides how to handle the source: keep the source as-is, rewrite the claim with a refinement, withdraw the source, wait for an external measurement to settle the question, or treat an outside source-of-truth as the authoritative reference for the claim.

### Pattern B — Counterfactual Gap Forecasting

When a source supports a conclusion under current conditions, the challenge changes the condition and asks whether the conclusion still stands.

- The source's current claim: "Y holds in the current working context."
- What would shake it: "If Z replaces a current condition, a gap opens at point P — does Y still hold?"
- The user decides how to handle the source: keep the source as-is, rewrite the claim with a refinement, set the source aside until condition Z appears again, or hand the question off to another protocol.

### Pattern C — Cross-Source Consistency Check

When two sources point at the same referent but diverge, the challenge forces an explicit reconciliation of referent and claim-kind. Candidate pairs are enumerated over sources SHARING THE SAME referent (not all pairwise combinations); for each such pair, claim-kind compatibility is tested before a divergence is flagged.

- The sources' current claim: "Sources X₁ and X₂ refer to the same referent and compatible claim-kind consistently."
- What would shake it: "X₁'s claim and X₂'s claim diverge at point Q — which source is authoritative for this claim, and what reconciles the divergence?"
- The user decides how to handle the sources: keep the sources as-is, rewrite the claim with a refinement, withdraw one of the sources, treat an outside source-of-truth as the authoritative reference, or hand the question off to another protocol.

### Pattern D — Inference Fallacy Audit

When a source is itself a conclusion reached by inference — an `AIInference` origin, or any conclusion that is starting to be used as a standing premise — the challenge tests whether the conclusion's validity depends on a reasoning flaw rather than on the source it cites.

- The source's current claim: "Conclusion Y follows soundly from the basis observed."
- What would shake it: "Y's validity rests on a reasoning archetype that does not hold." The archetype is described as a principle, not selected from a closed list: does the conclusion treat a point-in-time observation as a time-invariant law (a present coincidence read as permanent truth); generalize a standing rule from one or few observations; conclude from only the visible (surviving) sample; draw a conclusion that ignores the base rate; or read correlation as cause. These archetypes are a starting set for recognition, not an exhaustive catalog — an Emergent fallacy archetype is admitted whenever a conclusion's soundness rests on a reasoning move not named here.
- The user decides how to handle the source: keep the conclusion as-is, rewrite it with its scope made conditional (the inference holds only within the stated bounds), withdraw the conclusion, set it aside until a measurement settles it, or hand the question off to another protocol.

**Boundary with Pattern B**: Pattern B is a counterfactual the *user* frames — the user supplies condition Z and asks whether Y still holds. Pattern D is the AI *reverse-deriving* the flaw condition from a fallacy archetype, moving the discovery burden from the AI happening to pick the right counterfactual to an archetype-driven scan of the inference itself. A conclusion can pass Pattern B (no user-supplied condition shakes it) yet fail Pattern D (its soundness silently depends on treating the present as invariant).

## Protocol

### Phase 0: Source Identification and Claim Admission (Silent)

Analyze the working context, select audit candidates, and admit each to the audit set only once it is bound to a single claim this protocol actually takes on. This phase is silent — no user interaction, apart from the relays that report a candidate handed elsewhere or left unattributable.

1. **Bind W**: the working context committed in the session — sources, claims, downstream references, and the pre-execution action under consideration
2. **Apply Source Identification Criteria**: scan each source for high-leverage accumulation, age beyond horizon, provenance-chain length, cross-source contradiction, and inference-character conclusion
3. **Compose S_cand**: the union of sources matching at least one criterion — candidates, not yet audits
4. **Bind the claim** — for each candidate, set `kind_binding = { label: ClaimRef, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity }`. The label is the claim the source is being read as authority for — referent, claim_kind, scope, and the verbatim text — read off the source's content together with its downstream references; the positive predicate states what makes that claim suspect. This is the step that stops the antithesis from being aimed along an axis nobody fixed: the claim being tested is written down before anything is posited against it.
5. **Split a compound binding** — if `atomicity = non-atomic` (the candidate is being read as authority for two distinct claims), **split before certify** into one audit per claim and re-run the binding on each. A compound is never admitted: one disposition slot answering for two claims collects a single judgment for both and records it against a thesis the user was never shown whole.
6. **Certify deficit fit (fail-closed)** — `certificate = certify(kind_binding, local_claims)`, where the local claims are elenchus's own claim and its route claims, both inscribed in this file (TYPES: `OwnClaim`, `RouteClaim`); the certificate reads nothing outside it. Fit the positive predicate against every one and collect `claimed_by`:
   - **`status = pass`** — `claimed_by = {ContextSuspect}`, the own claim holding alone. The audit is admitted to `S_high`.
   - **`status = route`** — `claimed_by = {d}` for a single route claim's `routed_deficit`. Emit `d` with its command hint, report the cited fit, and **drop the candidate**: an item whose question is already settled by a convention, or which is a missing fact rather than a suspect one, is not made into an antithesis. Route claims: a missing pre-execution fact → ContextInsufficient (hint `/inquire`); an unnoticed decision gap at the pending action → GapUnnoticed (hint `/gap`); a claim a convention or ownership question already settles → BoundaryUndefined (hint `/bound`).
   - **`status = ambiguous`** — `|claimed_by| ≠ 1`, several claims holding or none. One narrowed-scope re-assessment at the fixed detection state (AI-side; the phase stays silent apart from its relays), then re-certify: pass, route, or — if it stays ambiguous — reported as a non-blocking **unattributable** residual and dropped. One attempt only: `W.sources` is read-only, so the state being re-read cannot have moved and an identical retry adds nothing.
7. **Bind the disposition space** — only once the certificate passes, derive that audit's `ValueSpace ⊆ Disposition` and freeze it for the cycle. What the bound claim fixes is what each constructor refers to for this audit; authoring concrete dispositions before this point writes answers to a question that is not yet settled.
8. **Compose S_high**: the certificate-passing audits. Every member is atomic and fit-certified by construction.
9. If `S_high = ∅`: emit empty VettedContext trivially and deactivate — reporting the two causes apart, since "no candidate warranted vetting" and "every candidate was handed elsewhere" are different findings
10. If `S_high ≠ ∅`: proceed to Phase 1

**Scope restriction**: Phase 0 is silent. Does NOT modify files, call external services, or alter session state.

### Phase 1: Tagging and Antithesis Generation

Generate metadata triple plus dialectical antithesis per source.

**Step 1 — Tagging**: For each `a ∈ S_high`, attach ProvenanceTag (authorized claim + verification path + confidence), FreshnessTag (age, horizon, stale flag), and LeverageTag (downstream_count, branches). The ProvenanceTag's `claim` is the audit's bound `ClaimRef` — Phase 0 settled which claim is under test, so tagging verifies authority *for that claim* rather than deciding what the claim was. Use artifact read and artifact search to verify provenance against the source's claimed origin where the source's content cites verifiable artifacts. The ProvenanceTag binds authority to the claim's referent, claim_kind, and scope; reuse of the same source as authority for a different claim must surface through Pattern A or Pattern C rather than silently carrying over. For an audit-candidate source, provenance verification also asks whether the source actually tracks the behavior its claim asserts or merely documents it — a source that is fresh yet not tied to that behavior is posited against in Pattern A on that basis, not cleared by its freshness verdict alone. When enforcement coupling cannot be determined from the available tools, posit the gap as a Pattern A antithesis candidate with basis "enforcement coupling not observable from available tools" — neither skip it silently nor assert coupling with false confidence.

**Step 2 — Antithesis positing**: For each tagged source, select the most applicable pattern (A, B, C, D, or Emergent) and construct an antithesis. A source that is itself an inferred conclusion (origin `AIInference`, or a conclusion functioning as a standing premise) is a candidate for Pattern D (see Pattern D's Boundary with Pattern B for the reverse-derivation mechanism). The antithesis must:
- Cite the source's claim verbatim, anchored to the originating sentence or artifact
- Name the dialectical challenge concretely (a verification gap, a counterfactual condition, a divergent sibling source, or an inference-fallacy archetype condition)
- Surface the basis for the challenge so the user can recognize the antithesis's evidence

**Cross-session enrichment**: Prior session indices from the hypomnesis store (prior-session recall indices), when present, may seed Phase 1 pattern selection; the constitutive judgment remains with the user.

### Phase 2: Per-Claim Disposition Constitution Interaction

Present antitheses and disposition slots via Cognitive Partnership Move (Constitution). Constitution presentation yields turn for user response.

**Pre-gate text output** (Round composition): For each audit in S_high, present as text output:
- The source's content (verbatim or close paraphrase)
- The claim it is being read as authority for — referent, category, and how far it reaches — so the user can correct that reading before judging along it. Where one source yielded several audits, say so and show which claim this slot is about
- The tagging triple (provenance verdict, freshness verdict, leverage count)
- The selected pattern (A, B, C, D, or Emergent) with its thesis ↔ antithesis pair
- The basis cited for the antithesis
- The deficit-fit basis: why this is a claim this protocol tests rather than one it hands elsewhere — the cited claim fit from the certificate

Then present a per-claim disposition interaction. Each audit receives its own slot, and its options are the ones bound in that audit's value space; batching across audits is permitted when slot count ≤ 4, otherwise process audits in batches of up to 4.

The variants below are the full coproduct. The set actually presented for an audit is its bound value space — `Confirmed` and `Discarded` always among them, the rest wherever the bound claim gives them an on-axis trajectory (Rule 8). That binding happened at Phase 0 and is presented intact here; narrowing it at presentation time would be the mutation Rule 11 forbids.

```
For each batch of up to 4 audits, present:

question: "Disposition for claim [N]: [brief claim identifier, and the source it is read off]"
options:
  - label: "Confirmed"
    description: "Antithesis examined; the original claim survives. Downstream usage proceeds as-is."
  - label: "Revised([refinement])"
    description: "Antithesis surfaces a concrete update; the claim is rewritten in the working context. Downstream usage proceeds against the refined form."
  - label: "Discarded([reason])"
    description: "Antithesis defeats the claim; the source is withdrawn from the working context. Downstream usage must re-derive without it."
  - label: "Deferred([re_trigger_condition])"
    description: "Disposition pending; the loop returns to this source when the named condition is met. Downstream usage proceeds without commitment until re-evaluation."
  - label: "Conditional([measurement])"
    description: "Disposition pending external measurement; downstream usage tags the source as provisional until the measurement resolves."
  - label: "Bounded([external_reference])"
    description: "The authoritative answer lives outside this session; downstream usage cites the external reference rather than the in-session source."
  - label: "Routed([routed_deficit])"
    description: "The challenge belongs to a different deficit — handed off to it for resolution, with the command named only as a hint."
Other: user composes a free-response disposition; AI maps the response to the closest coproduct variant or surfaces an Emergent disposition candidate.
```

**Option budget**: 4 audits per Constitution interaction is the working ceiling. When |S_high| > 4, audits are batched in groups of 4; each batch is its own Constitution interaction with its own Stop. The budget counts audits rather than sources, so a source that split into two claims occupies two slots — which is the point of splitting it.

### Phase 3: Disposition Integration

After each Constitution interaction returns J, integrate into Λ.dispositions and Λ.history. No user-facing action — internal state update only.

If all audits in S_high are now in J: proceed to LOOP evaluation.
If audits remain unjudged across batches: return to Phase 2 with the next batch.

## Convergence Evidence

At vetted(V), present the transformation trace before declaring convergence. For each `a ∈ S_high`:

```
[Claim identifier — and the source it is read off]
  Pattern: A | B | C | D | Emergent(name)
  Antithesis: [concrete antithesis text]
  Disposition: [chosen variant with parameters]
```

Then, apart from the trace, list every candidate the certificate handed elsewhere or left unattributable — the deficit each went to, its command hint, and the cited basis. Those never entered `S_high`, so the trace does not range over them; listing them is what keeps the final account matching what the user was shown at Phase 0.

Present transformation trace as text output, then proceed with the vetted context. The relay presentation does not gate; it demonstrates the completed morphism.

## Rules

1. **User-initiated only**: Activate only when the user signals an upcoming pre-execution sync over an existing working context. No AI-guided Layer 2 activation; the deficit-awareness sits with the user.
2. **Recognition over Recall**: Present per-claim disposition slots with differential implications via Cognitive Partnership Move (Constitution); the user evaluates structured options rather than recalling them from memory. Constitution interaction yields turn before proceeding.
3. **Round composition**: Compose each round so the reader can act on it without reassembling it — everyday language rather than this file's formal vocabulary, the judgment set beside the evidence it rests on together with the differential implication that matters for the next move, and analytical context laid out before a gate rather than inside it. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged, when some of what is in view belongs to a later round or a trace rather than this one, or when this protocol's own phases bear on where a sentence sits relative to a gate.
4. **Detection with authority**: AI detects audit-candidate sources, posits antitheses, and surfaces basis; the user judges each disposition. Detection is the AI's responsibility; judgment is the user's right.
5. **Surfacing over Deciding**: Per-source antithesis is surfaced with cited basis; AI does not silently downgrade or resolve a source's disposition. A source whose antithesis the AI cannot construct concretely is surfaced as such, not skipped.
6. **Convergence evidence**: Present transformation trace (claim → antithesis → disposition, naming the source each claim is read off) before declaring the working context vetted; per-audit evidence is required, not asserted. Candidates the certificate handed elsewhere or left unattributable are listed apart from the trace, since they were never audits.
7. **Source chain preservation**: W.sources is read-only across the protocol's lifetime. Antithesis and disposition annotate, never mutate, the source list. A Discarded disposition removes a source from downstream usage but preserves it in Λ.history with its withdrawal reason.
8. **Loop continuity under bounded regret**: Deferred dispositions whose re-trigger condition has not been met let the loop continue. Only dispositions requiring genuinely viable alternative judgment paths — where the user's values determine the choice among options (Constitution-level entropy > 0) — warrant Phase 2 surfacing; relay-level operations (tagging, antithesis text construction, trace presentation) proceed inline.
9. **Antithesis must be dialectical**: An antithesis names a concrete counter-claim (Pattern A: "X is unverified"), counter-condition (Pattern B: "in condition Z, Y fails"), counter-source (Pattern C: "X₁ and X₂ diverge at Q"), or counter-inference (Pattern D: "Y's soundness rests on a fallacy archetype that fails here") — not a procedural verification query ("have you checked X?").
10. **Closed coproduct discipline**: Disposition is a closed coproduct of seven named variants plus Emergent. The Other option permits free-response, which the AI maps to the closest variant or surfaces as a candidate Emergent variant for that audit — it does not bypass the coproduct. What `bind_value_space` produces is the same coproduct with its payloads bound: the codomain is constant, so no variant is invented for an audit and none is withheld from one. What is derived per audit is what each variant refers to, and it is derived only after the claim is certified — so a concrete disposition is never authored for a claim nobody has fixed yet.
11. **Gate integrity** (Safeguard tier): The defined option set is presented intact — option injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic disposition variant into a concrete instance with parameters while preserving the TYPES coproduct structure) is distinct from mutation.
12. **Substrate boundary**: Post-vetting execution is delegated by handoff after Phase 3 integration.
15. **Claim-relative provenance**: ProvenanceTag records the claim a source authorizes. That claim is not discovered at tagging time — it is the audit's bound `ClaimRef`, fixed at Phase 0 before anything is tagged or posited, so Pattern A tests source authority against a claim already written down rather than against one the challenge implies. Pattern C enumerates candidate pairs over same-referent audits, then tests cross-source consistency only after referent and claim-kind compatibility are explicit; because the referent and claim-kind are bound fields, that comparison is typed rather than a judgment about wording. Where a source is read as authority for two distinct claims, the split at Phase 0 makes them two audits — which is this rule's "must surface rather than silently carry over", now enforced at admission instead of left to the pattern to catch. The tag classifies and surfaces the issue; disposition remains the user's Constitution judgment.
16. **Currency is not support-integrity**: A source that is fresh and present is not thereby trusted — freshness is necessary but not sufficient for the claim a source grounds. When a source is current yet nothing ties it to the behavior its claim asserts, Pattern A must posit that gap as the antithesis (would the source break or fail if that behavior changed, or stay unchanged and silently wrong?) and surface it with cited basis; the full disposition coproduct stays available and the user constitutes the disposition, recording the basis on which freshness was or was not enough. The AI surfaces the support-integrity challenge; it does not decide it.
17. **Inference-fallacy archetypes are principle, not closed catalog**: Pattern D seeds its antithesis from reasoning-fallacy archetypes stated as principles — the named archetypes (a present coincidence read as permanent truth, generalizing from few observations, surviving-sample-only reading, base-rate neglect, correlation-as-cause) are a starting set for recognition, never a closed enumeration, and an Emergent archetype is admitted whenever a conclusion's soundness rests on an unnamed reasoning move. Pattern D's directional distinction from Pattern B is detailed under Pattern D's Boundary with Pattern B above. A source qualifies for Pattern D when it is an inferred conclusion (origin `AIInference`, or a conclusion functioning as a standing premise); because sublate's unit is already `Source`, this is a pattern, not a new protocol.
18. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Round composition).
19. **Seam relay on declared continuation**: when a user-declared chain or a composition edge this SKILL.md declares names the next protocol, the between-protocol seam after Elenchus's convergence is relay (Extension) — proceed directly, citing the settling source (the chain declaration or the named edge). This governs only the seam BETWEEN protocols; every Constitution gate inside Elenchus and the next protocol fires unchanged, and the user can redirect at any turn.
20. **Form feedback**: Silence about form is not evidence about form. Too dense fails quietly — the reader skims, answers past it, stops — while too plain fails out loud, so the complaints that arrive come from one side only. Density therefore does not carry over from the previous round: each round takes it from what this request asked for, while a statement about form does carry over until it is countermanded. Read an instruction about form for the parts of a round it reaches, not for what kind of reaction it is — a complaint, a request, a symptom report and a bare preference are one input here, and sorting them by kind yields nothing the reach reading does not already give while costing a clause per kind. Change the form rather than asking which form they want; naming one is the recall this discipline exists to remove. What such an instruction reaches is whatever the active protocol leaves open in how a round is composed — its density, its ordering, its length. What it does not reach is whatever is already fixed for this round elsewhere: content the protocol requires, wording carried verbatim, an order it presents in, a cadence it caps, a turn boundary it sets. Those stay in place, and the layer that fixed them is what states why. Say in one line what changed; where the instruction overlapped something that stays, say in one line that it stays and why — that second line is owed by the overlap, not by how the instruction was worded.
21. **Admission-time deficit-fit certificate**: Before a candidate source becomes an audit the protocol tags, posits against, or surfaces, it is dispatched through the shared meta-backbone pipeline — KindBinding → fail-closed DeficitFitCertificate → value space, in that strict order, at Phase 0 and again on any Deferred audit whose trigger returns it to the loop. (a) **Admission-time**: the binding and certificate attach per candidate at Phase 0, before tagging and before antithesis positing, so nothing downstream operates on an unbound claim. This is the per-item form of the pipeline rather than an up-front one-shot dispatch, because each source carries its own claim and no single shared value is fixed for the rest of the run to read. (b) **The axis is a bound field**: `kind_binding.label` is the audit's `ClaimRef` — referent, claim_kind, scope, and verbatim text — and `positive_predicate` states what makes that claim suspect. An antithesis is then aimed at a claim that was written down, rather than along whichever axis the challenge's wording happened to imply; where the two differ, the user can see and correct the reading before judging along it. (c) **Fail-closed certificate**: `certificate.status = pass` strictly precedes entry into `S_high`, and therefore precedes tagging, antithesis positing, and the Phase 2 gate; `status = route` emits the matched route claim's `routed_deficit` (ContextInsufficient, GapUnnoticed, BoundaryUndefined — command hints `/inquire`, `/gap`, `/bound`) and drops the candidate; a non-atomic binding is split into one atomic audit per claim before certify; and `status = ambiguous` — `|claimed_by| ≠ 1`, several claims holding or none — triggers ONE narrowed-scope re-assessment at the fixed Phase-0 detection state, then pass / route / unattributable. One attempt is the right bound here because `W.sources` is read-only, so the state being re-read cannot have moved. The certificate is generated by fitting the positive predicate against the own claim and the route claims inscribed in THIS SKILL.md, reading nothing outside this file; `claimed_by` is a Set, so "no claim holds" is a value rather than a hole, landing in `ambiguous` alongside the several-claims case. A pass certifies local admissibility — this protocol's own gate over its own activation — not the absence of a claim anywhere in the wider protocol set. The certify step is relay (Extension — the fit is grounded in the cited local claims, an unclear fit returns `status = ambiguous` → defer; basis cited at Phase 2 surfacing). (d) **A dropped candidate is reported, never silent**: route and unattributable both emit as text with their cited basis, at Phase 0 and again in the closing account. Surfacing over Deciding is what requires it — the AI has judged the item to be another deficit's, and that judgment reaches the user with its ground while `W.sources` stands untouched. Because a dropped candidate never enters `S_high`, it is outside `vetted(V)`'s quantifier by construction, which is why no certificate-assigned Disposition constructor exists. (e) **Value space after the certificate, never before**: `bind_value_space` runs only once the certificate passes and freezes that audit's space for the cycle. The codomain is constant — all seven constructors, each already carrying its own downstream path — so the certified claim sets what each constructor refers to and never which of them exist. Authoring concrete dispositions ahead of it writes answers to a question that is not yet settled — and the more fluent those answers are, the harder the unsettled question is to see. (f) **Backbone discipline**: the schema is ONE canonical definition shared across protocols; this protocol instantiates only `object_ref` (= ClaimAudit), `local_value_space` (= the per-audit subset of `Disposition`), the label field's type (`ClaimRef`), the own claim, and the local route claims — same field names, same fail-closed statuses, same certificate-before-admission order.
