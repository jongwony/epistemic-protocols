---
name: sketch
description: "Recognize and revise concrete sketches to discover a form when descriptions cannot settle intent. Type: (FitUnrecognized, Hybrid, SKETCH-RECOGNIZE-CYCLE, FormIntentSeed) → RecognizedForm"
---

# Hypotyposis Protocol

Discover what a form should be by encountering concrete sketches and marking what does not fit, until the user recognizes a specific version as the form for a stated purpose. Type: `(FitUnrecognized, Hybrid, SKETCH-RECOGNIZE-CYCLE, FormIntentSeed) → RecognizedForm`.

## Definition

**Hypotyposis** (ὑποτύπωσις): an outline or sketch — a first drawing of a position rather than its finished statement. A dialogical act for the moment when a form has to be made and the intent behind it cannot yet be settled from descriptions: the user can say what is wrong with a thing in front of them long before they can say what the thing should be, because good fit has no positive description of its own while each misfit is immediate and can be pointed at (Alexander, 1964). So the protocol runs the other way round from a specification: the user settles each round's focus, the perception it needs, and its variants at a spec gate before anything is made; the AI produces the sketches; the user marks a specific version — what does not fit and what to keep — as first-class utterances; the AI revises the retained version under those marks; and the loop ends when the user recognizes one version as the form for a stated purpose and names where it lives.

```
── FLOW ──
Hypotyposis(I) → detect(I, ctx) →
  [¬fit_unrecognized(I, ctx)] no_activation_relay → exit (NoActivationRelay)
  bind(I) → Λ.history (each prior item as Settled | Candidate, provenance kept) → Λ.round := 1 →
  Qround(Λ) → Stop → R →
    [R = Adjust(rev)]          revise(draft, rev) → re-present Qround                  -- pre-production loop
    [R = Approve(settlements, supersessions)] settle(spec) ∧ promote(settlements) ∧ supersede(supersessions) → produce(spec, Λ) → Sk →
  present(Sk) → Qfit(Sk, spec.focus) → Stop → M →
    [M = Marks(ms)]   record(ms) → interpret(ms) → record(Proposed) → Λ.round += 1 → Qround
    [M = Fit(w)]      Λ.fit_witnesses ∪= {w} → Λ.round += 1 → Qround                   -- one focus adequate; the loop continues
    [M = Finish(rec)] Λ.recognition := Some(rec) → Qplace → Stop → P → harvest → account →
                        [retention verified] RecognizedForm
                        [retention failed]   declare → Qplace (re-presented with the failure; the same location is admissible)
    [M = Withdraw]    account → EarlyExit
  [either party, at any gate: recognition needs no further encounter ∨ activation premise collapsed]
    dissolution_relay → account → DissolutionExit
  [either party, at any gate: a sibling deficit is demonstrated ∨ a realization the round requires is unavailable]
    boundary_relay → account → BoundaryExit

── MORPHISM ──
FormIntentSeed
  → detect          -- deficit predicate over the utterance and accumulated context (silent analysis)
  → bind            -- prior material enters the history as Settled or Candidate, provenance kept
  → specify_round   -- Constitution: focus, realization, and targets settled; provisional coordinates promoted, superseded, or held
  → produce         -- transform: one sketch per brief — a brief naming a parent revises that retained version, a parentless brief generates from the material it names or from prior material — and declares what producing it determined that no coordinate covered
  → present         -- relay: each sketch from its typed concretum, what this round can and cannot expose, and whether an artifact was observed
  → recognize       -- Constitution: marks on a specific version — Marks | Fit | Finish | Withdraw
  → record          -- track: every mark, and every interpretation read from it, enters the append-only history; interpretations stay provisional
  → place           -- Constitution: where the recognized concretum lives beyond the session, and which versions the run passed over are kept as revert points; no default for either
  → harvest         -- active commitments, recognition witness, trace, and residual recorded before release
  → account         -- per-sketch retain-or-release disposition, verified
  → RecognizedForm
requires: form_purpose_in_scope(I)             -- runtime checkpoint (Phase 0): the work is about to make a form
deficit:  FitUnrecognized                       -- activation precondition (Layer 1/2)
preserves: utterance(I)                          -- I.utterance is read-only; the history accumulates beside it
invariant: Concretum Retention                   -- a brief that revises does so on a retained parent; a sketch under judgment is never regenerated from coordinates alone
invariant: Commitment Provenance Preservation    -- a prior constitutive act stays recorded; a later user act may supersede its operative determination; AI inference alone never supersedes a user commitment
invariant: Recognition over Description          -- fit is the user's recognition of a specific version for a stated purpose

── TYPES ──
I  = FormIntentSeed { utterance: String, prior: List(ReferencedMaterial) }
       -- Input type: morphism processes I uniformly; prior is source-neutral — a settled direction, a resolved intent,
       --   a candidate field, an existing artifact, a prior session's record — each named by the user or already in context
ReferencedMaterial = { source: String, content: String }          -- what it is and where it came from; no sibling type is a runtime dependency
Binding = Settled(Coordinate) | Candidate(ReferencedMaterial)      -- how a prior item enters the history at bind: a commitment the user already made, or material to draw on
fit_unrecognized(I, ctx) = a form-making purpose is in scope
                         ∧ decision-relevant intent remains underdetermined
                         ∧ encountering and revising a concrete proposal is what would constitute that intent
                         ∧ the resolution sought is a recognized form with its commitments and residuals
Axis      = String                                                 -- emergent label: "information unit", "reading order", "density", "tone"
Focus     = Axis | Question(String)                                -- what this round filters attention toward; an unexpected misfit on any other axis stays admissible
Value     = String                                                 -- a determination on an axis, in the user's words or read off the sketch
Realization = capability description                               -- what this round's judgment needs in order to be possible: the perception it rests on
       --   (narration, spatial layout, interaction, sound, …) and, where the focus opens an axis carrying a standard
       --   outside both parties' preference, the referent it is checked against. Open, named per round — and a referent
       --   the round requires that this session cannot supply is the boundary arm's condition rather than something to
       --   proceed without, since an axis with a right answer closes as Fit when nobody brings the standard to it
VariantBrief = { parent: Optional(SketchRef), source: Optional(ReferencedMaterial), commits: Map(Axis, Value) }
       -- one sketch to produce. Some(parent): revise that retained version. None: generate from active_coords and
       --   from the material `source` names, or from the bound prior material where it names none — every round-1
       --   brief, and a fresh start the user settles at Qround on any later round
       -- a round that changes where the material comes from is a parentless brief naming the new source, not a
       --   different kind of round: what the loop does is unchanged, and what moved is only what "generate" draws on
RoundSpec = { focus: Focus, realization: Realization, targets: NonEmptyList(VariantBrief) }
       -- k = |targets| is settled here; a count the user already settled relays on later rounds
Supersession = { of: Coordinate, by: Optional(Coordinate) }        -- the user's act on a coordinate in view: by = Some(c') replaces it with a determination the user states (c' enters Settled, basis Utterance), by = None retires it with nothing in its place
R  = Round-spec gate answer ∈ {Approve(settlements, supersessions), Adjust(revision)}
       -- Approve names which provisional coordinates become Settled and which coordinates — Provisional or Settled — the user supersedes (either set possibly empty); Adjust revises focus, realization, or targets and re-presents before anything is produced
SketchRef = { id: ℕ, round: ℕ }                                    -- identity of one version; the harvest and every mark point at one of these
Concretum = Text(value) | Artifact(versioned_ref)                  -- Text: narration carried in session text; Artifact: a file under temp isolation, versioned at creation
Sketch = { ref: SketchRef, parents: List(SketchRef), concretum: Concretum, rendered_from: snapshot(active_coords), focus: Focus }
       -- what producing it determined beyond the spec reaches the history as Proposed coordinates basis Production(ref),
       --   so a sketch's own determinations are read back by its reference rather than stored a second time
Anchor = Element(locator) | Region(bounds) | Whole | Span(text)    -- where on a sketch a mark points; Whole admits "something is missing here" with nothing to point at
       -- premise: a mark points at a place. A property recurring across the sketch sits at none, and arrives as Whole
       --   with the property itself in the mark's utterance and, where it names one, its axis — carried whole, not classified
Mark = Misfit { sketch: SketchRef, anchor: Anchor, utterance: String, axis: Optional(Axis) }
     | Keep   { sketch: SketchRef, anchor: Anchor, utterance: String }
       -- a user utterance anchored on a version; Keep is the positive half of mixed feedback and is retained, never dropped
Status = Provisional | Settled
Coordinate = { axis: Axis, value: Value, basis: Mark | Binding | Utterance | Production(SketchRef), status: Status, round: ℕ }
       -- interpret() yields Provisional only; Settled requires the user's act at Qround or a convention already on record
       -- Production(ref): a determination the producer had to make to render that sketch and no coordinate covered.
       --   Provisional like any reading, and settled or superseded only by the user's act at Qround — production
       --   introduces determinations, it never settles them
Event = Bound(Binding) | Marked(Mark) | Proposed(Coordinate) | Promoted(Coordinate) | Superseded(Coordinate, by: Optional(Coordinate)) | Witnessed(FitWitness) | Parked(ParkedItem) | Taken(ParkedItem)
       -- Superseded is appended by supersede at Qround and nowhere else: the user's act is its only producer, so an AI interpretation the user rejects leaves provisional(Λ) and a determination the user replaces leaves active_coords
       -- Proposed is appended by interpret and by produce: a coordinate the AI puts forward, whichever step reached it.
       --   Its basis says which, and its lifecycle is one — presented at Qround, promoted or superseded there, residual otherwise
       -- Parked is appended where a gate answer carries material for a later round; Taken where a later Qround's spec
       --   takes it up or the user drops it — so parked(Λ) shrinks by a user act, the same way provisional(Λ) does
active_coords(Λ) = fold(Λ.history)                                  -- the operative determinations now: per axis, the latest Settled coordinate with no Superseded(it, _) after it — Superseded(c, Some(c')) makes c' operative in c's place, Superseded(c, None) retires c with nothing in its place; Provisional ones shown beside
provisional(Λ)   = { c : Proposed(c) ∈ Λ.history ∧ ¬∃ Promoted(c) ∈ Λ.history ∧ ¬∃ Superseded(c, _) ∈ Λ.history }
                                                                    -- what the AI read from a mark or decided while producing, awaiting the user's act at Qround; derived from the history, never stored apart
parked(Λ)        = { p : Parked(p) ∈ Λ.history ∧ ¬∃ Taken(p) ∈ Λ.history }
                                                                    -- what the user named for a later round and no round has taken up yet; derived, and declared at every terminal
FitWitness  = { sketch: SketchRef, context_revision: ℕ, scope: Focus, utterance: String }
       -- adequacy on one focus for one version; stale once its sketch is superseded or the context revision moves — shown as stale, never reused silently
Recognition = { target: SketchRef, context_revision: ℕ, purpose_scope: String, residual: Set(Axis) }
       -- target must be a presented, retained version; Finish is recognition of the assembled form, not of one focus
M  = Recognition gate answer ∈ {Marks(Set(Mark)), Fit(FitWitness), Finish(Recognition), Withdraw}
       -- Marks(∅) is read as Stop, never as Fit; silence yields the turn again; a response carrying both marks and a finish is parsed as Marks — recognition names an unmarked version
       -- premise: one answer settles this version. An answer also naming what a later round should take up departs from
       --   that premise rather than breaking it — it is parsed by its constructor, and the forward-bearing part is parked
ParkedItem = { utterance: String, round: ℕ }
       -- what a gate answer carried for a round after this one: a target named for the next, a focus named for one
       --   beyond it. Recorded where it was said and re-presented at each Qround as itself, so a commitment the user
       --   made does not cross rounds inside the AI's memory
Location = a reference the user judges to outlive the session      -- the capability the placement gate asks the user to bind; the protocol supplies no default
       -- the durability is their judgment, not a checked fact. account verifies that the reference resolves to that
       --   version's concretum AT THE MOMENT IT IS CHECKED, which is a narrower claim than outliving the session, and
       --   the two came apart inside one run when a reference verified at one gate stopped resolving before the next
P  = Placement gate answer ∈ {Place(Location, kept: Map(SketchRef, Location))}
       -- where the recognized version lives, and which versions that were not recognized are kept as revert points and
       --   where; kept may be empty. On a re-presentation after RetainFailed, either may be the same or another; a
       --   free-response withdrawal here is EarlyExit with the recognition in the partial trace
Fixture = { ref: Location, target: SketchRef, scope: String, residual: Set(Axis), kept: Map(SketchRef, Location) }
       -- status: recognition witness. It carries no implementation commitment and is not an executable specification
       -- kept: what a later reversal would otherwise have to rebuild. A version the loop passed over is what the
       --   decision could return to, and returning to it costs rebuilding unless it survives as itself
Disposition ∈ {Retained(Location), Released, ReleaseFailed(reason), RetainFailed(reason)}
       -- Retained is written only once verification holds: the reference resolves to the recognized version's exact concretum. RetainFailed sends control back to Qplace; ReleaseFailed is declared with a handoff
TraceEntry = (Mark → Optional(Coordinate) → Optional(SketchRef) → Recognized | Superseded | Residual)
       -- what each mark became: its interpretation, the revision it drove, and how it ended
ExitCause ∈ {NotActivated, Recognized, Withdrawn, BoundaryReached, Dissolved}
RecognizedForm = single record { commitments: Set(Coordinate) (Settled only), witness: Fixture, recognition: Recognition,
                                 trace: List(TraceEntry), residual: Set(Axis), provisional: Set(Coordinate),
                                 parked: Set(ParkedItem), kept: Map(SketchRef, Location) }
       -- assembled after account: the retained concretum is reachable through witness.ref, and what the user named for a
       --   round that never came is declared rather than dropped
NoActivationRelay = the non-activation basis stated: the failed predicate with its evidence, or — on the AI-detected path — the user's decline at the first Qround, cited; a sibling deficit visible in the same scan is named as a finding and left to the session
EarlyExit = withdrawal at any gate: partial trace over completed rounds + account enforced + residual declared (no RecognizedForm returned; any prior recognition remains in the partial trace)
BoundaryExit = the unresolved obligation named — a sibling deficit demonstrated, or a realization the round requires that this session cannot supply — with account enforced; which protocol takes it is the session's, never this record's
DissolutionExit = the deficit dissolved during a circulation: the sharpened description made the form recognizable without a further encounter, or the activation premise collapsed; declared by either party with its basis, the surviving determinations relayed, account enforced
Initiator ∈ {UserInvoked, AIDetected}                               -- bound at activation; informs the Hybrid first-gate semantics
Phase     ∈ {0, 1, 2, 3, 4, 5, 6}

── A-BINDING ──
bind(I) = explicit_arg ∪ recent_form_intent ∪ surfaced_fit_gap
Priority: explicit_arg > recent_form_intent > surfaced_fit_gap

/sketch "what to make"          → I = FormIntentSeed with utterance; prior = material the utterance names or that is already in context
/sketch (alone)                 → I = the most recent form-making intent in session
"I'd know it when I see it"     → I = the utterance under discussion (AI-detected path; the first Qround confirms or declines the run)

── PHASE TRANSITIONS ──
Phase 0: I → detect(I, ctx) → fit_unrecognized?                                     -- silent analysis
       [false] Λ.exit := NotActivated → no_activation_relay → exit (NoActivationRelay)
       [true]  → Phase 1
Phase 1: bind(I) → Λ.history := Bound(each prior item) → Λ.round := 1 → Phase 2       -- track; Settled where the user already committed, Candidate otherwise
Phase 2: draft(RoundSpec, provisional(Λ)) → Qround(Λ) → Stop → R                       -- round-spec gate [Tool]
       [R = Adjust(rev)] revise(draft, rev) → re-present Qround                       -- nothing is produced under an unsettled spec
       [R = Approve(settlements, supersessions)] Λ.spec := draft → promote(settlements) → Λ.history ++= Promoted(each) → supersede(supersessions) → Λ.history ++= Superseded(each of, by) → Λ.history ++= Taken(each parked item this spec takes up or the user drops) → Λ.context_revision += 1 where either set is non-empty → Phase 3
       -- free responses declared pre-gate: question a focus (answered, gate re-presented); contest the activation premise (dissolution arm → Phase 6); name a boundary (boundary arm → Phase 6); withdraw (Phase 6, EarlyExit arm)
       -- on the AI-detected path, the first Qround is also the confirm-or-decline of the run: Adjust or Approve confirms; a free-response decline sets Λ.exit := NotActivated and exits as NoActivationRelay with the decline as its basis (nothing produced, nothing to account)
Phase 3: produce(Λ.spec, Λ) → Sk : NonEmptyList(Sketch) → Λ.sketches ++= Sk
         → Λ.history ++= Proposed(each determination producing Sk made that operative commitments and Λ.spec left open, basis Production(its ref))   -- transform [Tool]
       [|Λ.spec.targets| > 1, conditional] produce_delegate(∥ one sketch per executor, temp-isolated) [Tool]
       -- dispatch on brief.parent: Some(ref) → revise(ref retained, active_coords, marks since ref); None → generate(brief.source where it names one else prior material, active_coords, brief.commits) — round 1 necessarily, a fresh start or a changed material source on a later round by the user's brief
       -- every sketch records its concretum and a versioned reference at creation; existing project files stay unchanged
Phase 4: present(Sk) → acquire(marks) → Qfit(Sk, Λ.spec.focus) → Stop → M             -- recognition gate [Tool]
       [M = Marks(ms)]   Λ.history ++= Marked(each) → interpret(ms) → Δ → Λ.history ++= Proposed(each c ∈ Δ) → stale(Λ.fit_witnesses over superseded sketches) → Λ.round += 1 → Phase 2
       [M = Fit(w)]      Λ.fit_witnesses ∪= {w} → Λ.history ++= Witnessed(w) → Λ.round += 1 → Phase 2
       [M = Finish(rec)] Λ.recognition := Some(rec) → Phase 5
       [M = Withdraw]    → Phase 6 (EarlyExit arm)
       -- free responses declared pre-gate: interrogate a sketch (answered within its placeholder status, gate re-presented); ask for a different realization (a spec revision — Phase 2 with the revision named, no new round counted); contest the premise (dissolution arm); name a boundary (boundary arm)
       -- Marks(∅) is Stop; a mixed response keeps its Keep marks; a response naming a version that was not presented is answered, never parsed as Finish
       -- on every arm: Λ.history ++= Parked(each item the answer named for a round after this one). The answer is still
       --   parsed by its own constructor — parking takes what the constructor does not reach, never what it does
Phase 5: Qplace(Λ.recognition.target) → Stop → P                                        -- placement gate [Tool]
       [P = Place(location, kept)] Λ.fixture := Some({ref: location, target, scope, residual, kept}) → harvest → Phase 6 (RecognizedForm arm)
       -- the protocol names the capability (a reference the user judges to outlive the session) and supplies no default, for the recognized version or for any kept one; a withdrawal here is the EarlyExit arm with the recognition recorded in the partial trace
       -- RE-ENTERED from Phase 6 on RetainFailed: the failure is declared before the gate; the user names a location again — the same one is admissible — or withdraws
Phase 6: account → [a terminal arm] Λ.exit := cause → terminal                          -- all arms [Tool]; the RetainFailed arm returns to Phase 5 with Λ.exit still None
       [from Phase 5 — recognized and placed] retain(recognition.target at Λ.fixture.ref) ∧ ∀ (s, loc) ∈ Λ.fixture.kept: retain(s at loc)
         → verify(resolves(Λ.fixture.ref, concretum(recognition.target)) ∧ ∀ (s, loc) ∈ Λ.fixture.kept: resolves(loc, concretum(s)))
         [all verified] Λ.dispositions ++= (target, Retained(Λ.fixture.ref)) and (s, Retained(loc)) for each kept
           → release(every sketch neither recognized nor kept) → Λ.exit := Recognized → assemble → RecognizedForm
         [any failed after one retry] Λ.dispositions ++= (each that failed, RetainFailed(reason)) → Λ.fixture := None → Phase 5 (Qplace re-presented with every failure declared; harvest re-runs with the next fixture)
           -- ONE rule for the recognized version and for a kept one: a reference that does not resolve returns the placement to the user rather than being closed over, since accounted demands every reference the result needs
           -- nothing is released on this arm: every sketch stays retained until a terminal is reached, so a later Place still finds the target and each kept version
       [withdrawal at any gate] release(all) → EarlyExit
       [dissolution arm] release(all) → DissolutionExit
       [boundary arm] release(all) → BoundaryExit
       -- release: per sketch, the destruction read off its concretum (a no-op for Text) → verify absence → Disposition; a failure retries once, then is declared ReleaseFailed with a handoff, never silent
       -- Λ.dispositions is append-only; a sketch's disposition is its latest entry, so a RetainFailed is superseded by the Retained a later Place verifies

── LOOP ──
Each round re-enters Phase 2 with the history it accumulated; the round counter is visible at every Qround and Qfit.
No fixed round cap: a round that re-enters a Constitution gate is dialogue, and the user can withdraw at any gate.
Variant count is settled per round at Qround; a count the user already settled relays until they revise it.
Continue until: RecognizedForm (Finish + placement + account) OR EarlyExit OR DissolutionExit OR BoundaryExit.
Convergence evidence: at RecognizedForm, present the trace — each mark → its interpretation → the revision it drove → how it ended (recognized, superseded, or residual) — beside the recognized version, its placement, the versions kept as revert points, the Settled commitments, the coordinates still Provisional, the residual axes, and whatever is still parked. Each other terminal presents its own payload (TOOL GROUNDING). Demonstrated, not asserted.

── CONVERGENCE ──
disposition(s)  = the latest entry for s.ref in Λ.dispositions
accounted(Λ) = ∀ s ∈ Λ.sketches: disposition(s) is defined                  -- every sketch has a declared disposition
             ∧ (Λ.fixture = Some(f) ⇒ resolves(f.ref, concretum(f.target))
                                    ∧ ∀ (s, loc) ∈ f.kept: resolves(loc, concretum(s)))  -- each reference resolves to that version's exact concretum, verified at the moment it is checked, and to nothing else
             ∧ ∀ s: disposition(s) ∈ {ReleaseFailed(_), RetainFailed(_)} ⇒ handoff_declared(s)  -- failures are declared, never silent
recognition_ready(Λ) = Λ.recognition = Some(rec)
                     ∧ rec.target ∈ presented(Λ.sketches) ∧ disposition(rec.target) = Retained(Λ.fixture.ref)   -- retention verified, never assumed
                     ∧ rec.context_revision = Λ.context_revision
                     ∧ Λ.fixture ≠ None                                      -- Qplace settled
                     ∧ residual_declared(Λ) ∧ trace_declared(Λ) ∧ parked_declared(Λ)
converged(Λ) = accounted(Λ) ∧ ((Λ.exit = Recognized ∧ recognition_ready(Λ)) ∨ (Λ.exit = Dissolved ∧ basis_declared(Λ)))
result equations:
  NoActivationRelay ⇔ Λ.exit = NotActivated                                  -- nothing produced; nothing to account
  RecognizedForm    ⇔ Λ.exit = Recognized ∧ recognition_ready(Λ) ∧ accounted(Λ)
  EarlyExit         ⇔ Λ.exit = Withdrawn ∧ accounted(Λ)                      -- non-convergent
  BoundaryExit      ⇔ Λ.exit = BoundaryReached ∧ obligation_named(Λ) ∧ accounted(Λ)   -- non-convergent; the session routes it
  DissolutionExit   ⇔ Λ.exit = Dissolved ∧ basis_declared(Λ) ∧ accounted(Λ)  -- convergent stand-down: no form was owed

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 detect (sense)              → Internal analysis (deficit predicate over the utterance and accumulated context; no external tool)
Phase 0 no_activation_relay (extension) → TextPresent+Proceed (the non-activation basis — the failed predicate with its evidence, or the user's decline at the first Qround on the AI-detected path; a sibling deficit seen in the scan is named as a finding and left to the session; not activated)
Phase 1 bind (track)                → Internal state update (prior material enters Λ.history as Settled or Candidate with provenance; the round counter starts)
Phase 2 draft (sense)               → Internal analysis (focus, realization, and target briefs proposed from the accumulated history — the operative commitments, the provisional readings, the bound prior material, and every mark so far — read together rather than from any one of them)
Phase 2 Qround (constitution)       → present (mandatory round-spec gate: this round's focus, what the judgment needs, the variant briefs, and each provisional coordinate with where it came from — each open to settle, reject, or replace, as is any Settled coordinate in view; fires BEFORE anything is produced; Adjust re-presents without producing; the pre-gate text declares the free-response paths — question a focus, contest the premise, name a boundary, withdraw)
Phase 2 revise (track)              → Internal state update (Adjust branch: the draft revised as named before re-presenting)
Phase 2 settle (track)              → Internal state update (Approve branch: Λ.spec committed; each provisional coordinate the user named becomes Settled with a Promoted event; each coordinate the user superseded takes a Superseded event — with the replacement they stated, or none; unnamed ones stay as they were)
Phase 3 produce (transform)         → artifact write, environment run (temp-isolated sketches, each with its concretum and a versioned reference registered at creation; a brief naming a parent revises that retained version, a parentless brief generates from the material its source names or from prior material; existing project files are never modified; Text concreta are session text only. Each sketch proposes as coordinates what producing it determined that the operative commitments and the settled spec left open, so the user meets those determinations at the next Qround rather than only their consequences on the screen)
Phase 3 produce_delegate (dispatch) → delegate (conditional: more than one target; parallel topology: one sketch per executor, each temp-isolated with its reference registered; subordinate to the active runtime policy)
Phase 4 present (extension)         → TextPresent+Proceed (each sketch from its typed concretum — Text re-presented as recorded, an Artifact walked through at its reference, reporting what was observed there or that it was not observed and what was tried — since Text is read as recorded while an Artifact is only ever presented as far as it was seen — then this round's focus, what this realization cannot expose, which content came from the user and which is the AI's proposal, what this sketch's own production determined, and every fit witness now stale)
Phase 4 acquire (observe)           → a channel returning utterances anchored on a sketch (read-only: the marks arrive as the user's utterances; the channel is a capability the host supplies, named here and bound nowhere in this contract. What a host must satisfy is that the user can point at what they saw and that the pointing arrives with the utterance; how it does so is read at the round against the host in front of it)
Phase 4 Qfit (constitution)         → present (mandatory recognition gate on a specific version: Marks, Fit on this focus, Finish for a stated purpose, Withdraw; Marks(∅) is Stop; the pre-gate text declares the free-response paths — interrogate, ask for another realization, contest the premise, name a boundary)
Phase 4 record (track)              → Internal state update (every mark appended to Λ.history as itself, then each Provisional coordinate interpret read from it appended as Proposed; a fit witness appended; witnesses over superseded sketches marked stale)
Phase 4 interpret (sense)           → Internal analysis (marks, read against the accumulated history, → Provisional coordinates, each carrying the mark it came from; never Settled here; what it yields reaches Λ only through record)
Phase 5 Qplace (constitution)       → present (mandatory placement gate: the recognized version and the capability it needs — a reference the user judges to outlive the session — together with the versions this run passed over, since those are what a later reversal would otherwise rebuild; the user names the location and which of the others are kept and where; no default is offered for either)
Phase 6 harvest (track)             → Internal state update (Settled commitments, the fixture, the recognition, the trace, the residual axes, and the coordinates still Provisional, recorded before any release; the durable record is the RecognizedForm entire — sketch content beyond the retained version stays session-local)
Phase 6 account (transform)         → artifact write, environment run (retain the recognized version at the settled location and verify the reference resolves to that exact concretum — one retry, then RetainFailed is declared and Qplace is re-presented with nothing released; once retained, release every other sketch and verify each — one retry, then ReleaseFailed declared with a handoff)
dissolution_relay (extension)       → TextPresent+Proceed (either party, at any gate: the sharpened description made the form recognizable without a further encounter, or the activation premise collapsed; state the basis, relay the Settled commitments and every mark recorded, run account, stand down as DissolutionExit — a success, not an abandonment)
boundary_relay (extension)          → TextPresent+Proceed (either party, at any gate: a sibling deficit is demonstrated, or a realization this round requires is one this session cannot supply; name the obligation and its basis, relay the harvest so far, run account, exit as BoundaryExit; the next protocol is the session's to choose)
withdraw (extension)                → TextPresent+Proceed (explicit free-response exit at any gate: partial trace + residual declared; account enforced; EarlyExit. A hard interrupt yields no turn, so account cannot run: temp isolation's bounded lifecycle is the backstop)
converge (extension)                → TextPresent+Proceed (transformation trace: marks → interpretations → revisions → recognition; the recognized version, its placement, Settled commitments, Provisional coordinates, residual axes, and every disposition)
seam (extension)                    → TextPresent+Proceed (fires at deactivation: a user-declared chain naming the next protocol settles the next move — proceed to it, citing that settling source; the RecognizedForm enters it as prior material, its fixture a recognition witness and nothing more. This protocol declares no wired outbound edge of its own. Every Constitution gate inside this protocol and inside the next fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, I: FormIntentSeed, round: ℕ,
      context_revision: ℕ,                     -- advances when the accumulated context moves outside the marks: a new user utterance about the form, a spec revision, a promoted or superseded coordinate
      history: List(Event),                    -- append-only; active_coords and provisional are folded from it, never stored apart
      spec: Option(RoundSpec),                 -- this round's settled spec; None until Approve
      sketches: List(Sketch),                  -- every version produced, retained for revision until account
      fit_witnesses: Set(FitWitness),          -- with staleness derived from sketches and context_revision
      recognition: Option(Recognition),
      fixture: Option(Fixture),
      dispositions: List<(SketchRef, Disposition)>,   -- append-only; a sketch's disposition is its latest entry, one defined per sketch by terminal (invariant: accounted)
      exit: Option(ExitCause),
      initiator: Initiator,
      active: Bool, cause_tag: String }
-- Guard: no sketch is produced before a Qround approval covers its brief — phase < 3 ⇒ sketches = ∅ on round 1; a later round holds prior sketches and produces nothing until its Qround settles
-- Guard: a Coordinate enters Settled only through Promoted (a user act at Qround), Bound(Settled) (a commitment already on record), or as the `by` of a Superseded the user stated at Qround; a Proposed event is the only way a Provisional coordinate enters the history, and it stays Provisional until Promoted or Superseded

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Form resolution emergent via session context.
```

## Scope Boundary

The transformation the moment needs decides between neighbors; a sibling deficit seen in the scan or demonstrated in a round is named as a finding at the boundary, and the session chooses what takes it.

- `/preview` — recognize and settle a direction among named alternatives; its probes are discarded. Here the resolution sought is a form, and the recognized version is kept; a direction settled by `/preview` can enter as prior material.
- `/elicit` — resolve intent by reverse-tracing decision coordinates from externalized cognition. Here encountering and revising sketches constitutes the remaining form intent; readable prior material may already exist.
- `/contextualize` — adjudicate a result's fit against application context held fixed within the run, with adaptation directed by the user. Here encountering sketches develops the form intent itself.
- `/ideate` — a thin field of ideas widened, nothing selected. Here a form is recognized.

## Mode Activation

`/sketch` is directly invocable. On the AI-detected path, cite evidence of `FitUnrecognized`; the first `Qround` confirms or declines the run. Loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind while Hypotyposis is active.

Heuristic discovery cues are a plan that cannot reach its first draft, a description rewritten instead of made, a request to see something before saying more, and an explicit "I'd know it when I see it". They establish grounds to run Phase 0 rather than activation predicates.

## Protocol

### Phase 0: Detection (Silent)

Apply the deficit predicate in the Definition and cite the basis.

### Phase 1: Bind

Bring each prior item into the history as `Settled` only where the user settled it, as `Candidate` otherwise, with where it came from.

### Phase 2: Round Spec Gate

Lay out the pre-gate content TOOL GROUNDING's `Qround` entry names, then render `Qround`:
```
Settle this round before I make anything.

Options:
1. **Approve** — produce these variants under this focus; name which readings you now settle, reject, or replace, or none
2. **Adjust** — revise the focus, the perception, or the variants and re-present before anything is produced
```
Name questioning a focus, contesting the premise, naming a boundary, and stepping out as free-response paths.

### Phase 3: Production (Transform)

Produce under the settled spec as TOOL GROUNDING's `produce` entry states; every sketch carries its placeholder status visibly.

### Phase 4: Recognition Gate (Constitution)

Present as TOOL GROUNDING's `present` entry states, acquire the marks through the channel the host supplies, then render `Qfit`:
```
Which version are you marking, and what do you see?

Options:
1. **Mark** — point at what does not fit (and what to keep) on a named version; I revise from there
2. **Fit on this focus** — this version is adequate on this round's focus; the next round takes another focus
3. **Finish** — this version is the form, for the purpose you state, with the axes you leave open
```
Name interrogating a sketch, asking for a different perception, contesting the premise, naming a boundary, and withdrawing as free-response paths; they are not numbered options.

### Phase 5: Placement Gate (Constitution)

Present the recognized version and the capability it needs — a reference that outlives the session — and render `Qplace` with no default:
```
Where does the recognized version live from here?

Options:
1. **Place** — name the location; the version is retained there and verified. Name any other versions worth keeping as revert points and where they go; the rest are released
```
When a retention failed, say so before re-presenting; the same location stays admissible.

## Rules

- **Ground interpretations**: Read each mark against the version it names, that version's brief, and how the round realized it. What the evidence supports about the form and about the realization is the judgment; carry it with its basis, and where the evidence does not settle which of the two a mark reaches, carry that unresolved into the provisional reading Qround presents.
- **Placement has no default**: The protocol names what the retained version needs — a reference the user judges to outlive the session — and the user names where, together with which other versions are kept and where. The fixture that results is a recognition witness and carries no implementation commitment.
- **Round composition**: Use everyday language, put evidence and differential implications before the gate, and leave the gate to the question and options. Read `references/round-composition.md` before composing when wording must persist across rounds or phase placement is material.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
