---
name: sketch
description: "Recognize and revise concrete sketches to discover a form when descriptions cannot settle intent. Type: (FitUnrecognized, Hybrid, SKETCH-RECOGNIZE-CYCLE, FormIntentSeed) → RecognizedForm"
---

# Hypotyposis Protocol

Discover what a form should be by encountering concrete sketches and marking what does not fit, until the user recognizes a specific version as the form for a stated purpose. Type: `(FitUnrecognized, Hybrid, SKETCH-RECOGNIZE-CYCLE, FormIntentSeed) → RecognizedForm`.

## Definition

**Hypotyposis** (ὑποτύπωσις): an outline or sketch — the word Sextus Empiricus chose for a first drawing of a position rather than its finished statement. A dialogical act for the moment when a form has to be made and the intent behind it cannot yet be settled from descriptions: the user can say what is wrong with a thing in front of them long before they can say what the thing should be. Fit is recognizable only through misfit — good fit has no positive description of its own, while each misfit is immediate in experience and can be listed (Alexander, 1964) — and in creative design the problem and its solution take shape together, each partial solution restructuring what the problem was (Dorst & Cross, 2001). So the protocol runs the other way round from a specification: it produces a concrete sketch, takes the user's marks on it as first-class utterances, revises a retained version under those marks, and stops when the user recognizes one version as the form. Presenting several alternatives yields more and sharper criticism than presenting one (Tohidi et al., 2006), and building alternatives before feedback improves both the result and the maker's stake in the process (Dow et al., 2010), so each round's variant count is settled at its own gate rather than fixed in advance; early concrete material measurably narrows what people go on to imagine (Wadinambiarachchi et al., 2024), which is why the round spec is settled before anything is produced and why unexpected marks stay admissible whatever the round's focus.

```
── FLOW ──
Hypotyposis(I) → detect(I, ctx) →
  [¬fit_unrecognized(I, ctx)] no_activation_relay → exit (NoActivationRelay)
  bind(I) → Λ.history (each prior item as Settled | Candidate, provenance kept) → Λ.round := 1 →
  Qround(Λ) → Stop → R →
    [R = Adjust(rev)]          revise(draft, rev) → re-present Qround                  -- pre-production loop
    [R = Approve(settlements)] settle(spec) ∧ promote(settlements) → produce(spec, Λ) → Sk →
  present(Sk) → Qfit(Sk, spec.focus) → Stop → M →
    [M = Marks(ms)]   record(ms) → interpret(ms) → Λ.provisional → Λ.round += 1 → Qround
    [M = Fit(w)]      Λ.fit_witnesses ∪= {w} → Λ.round += 1 → Qround                   -- one focus adequate; the loop continues
    [M = Finish(rec)] Λ.recognition := Some(rec) → Qplace → Stop → P → harvest → account → RecognizedForm
    [M = Withdraw]    account → EarlyExit
  [either party, at any gate: recognition needs no further encounter ∨ activation premise collapsed]
    dissolution_relay → account → DissolutionExit
  [either party, at any gate: a sibling deficit is demonstrated ∨ a realization the round requires is unavailable]
    boundary_relay → account → BoundaryExit

── MORPHISM ──
FormIntentSeed
  → detect          -- deficit predicate over the utterance and accumulated context (silent analysis)
  → bind            -- prior material enters the history as Settled or Candidate, provenance kept
  → specify_round   -- Constitution: focus, realization, and targets settled; provisional coordinates promoted or held
  → produce         -- transform: round 1 generates one sketch per target; later rounds revise a retained parent
  → present         -- relay: each sketch from its typed concretum, then what this round can and cannot expose
  → recognize       -- Constitution: marks on a specific version — Marks | Fit | Finish | Withdraw
  → record          -- track: every mark enters the append-only history; interpretations stay provisional
  → place           -- Constitution: where the recognized concretum lives beyond the session; no default
  → harvest         -- active commitments, recognition witness, trace, and residual recorded before release
  → account         -- per-sketch retain-or-release disposition, verified
  → RecognizedForm
requires: form_purpose_in_scope(I)             -- runtime checkpoint (Phase 0): the work is about to make a form
deficit:  FitUnrecognized                       -- activation precondition (Layer 1/2)
preserves: utterance(I)                          -- I.utterance is read-only; the history accumulates beside it
invariant: Concretum Retention                   -- the next sketch revises a retained parent; a sketch under judgment is never regenerated from coordinates alone
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
Realization = capability description                               -- the perception this round's judgment needs (narration, spatial layout, interaction, sound, …); open, named per round
VariantBrief = { parent: Optional(SketchRef), commits: Map(Axis, Value) }  -- one sketch to produce: from a retained parent on later rounds, from prior material on round 1
RoundSpec = { focus: Focus, realization: Realization, targets: NonEmptyList(VariantBrief) }
       -- k = |targets| is settled here; a count the user already settled relays on later rounds
R  = Round-spec gate answer ∈ {Approve(settlements), Adjust(revision)}
       -- Approve names which provisional coordinates become Settled (possibly none); Adjust revises focus, realization, or targets and re-presents before anything is produced
SketchRef = { id: ℕ, round: ℕ }                                    -- identity of one version; the harvest and every mark point at one of these
Concretum = Text(value) | Artifact(versioned_ref)                  -- Text: narration carried in session text; Artifact: a file under temp isolation, versioned at creation
Sketch = { ref: SketchRef, parents: List(SketchRef), concretum: Concretum, rendered_from: snapshot(active_coords), focus: Focus }
Anchor = Element(locator) | Region(bounds) | Whole | Span(text)    -- where on a sketch a mark points; Whole admits "something is missing here" with nothing to point at
Mark = Misfit { sketch: SketchRef, anchor: Anchor, utterance: String, axis: Optional(Axis) }
     | Keep   { sketch: SketchRef, anchor: Anchor, utterance: String }
       -- a user utterance anchored on a version; Keep is the positive half of mixed feedback and is retained, never dropped
Status = Provisional | Settled
Coordinate = { axis: Axis, value: Value, basis: Mark | Binding | Utterance, status: Status, round: ℕ }
       -- interpret() yields Provisional only; Settled requires the user's act at Qround or a convention already on record
Event = Bound(Binding) | Marked(Mark) | Interpreted(Coordinate) | Promoted(Coordinate) | Superseded(Coordinate, by: Coordinate) | Witnessed(FitWitness)
active_coords(Λ) = fold(Λ.history)                                  -- the operative determinations now: each axis's latest Settled coordinate, with Provisional ones shown beside it
FitWitness  = { sketch: SketchRef, context_revision: ℕ, scope: Focus, utterance: String }
       -- adequacy on one focus for one version; stale once its sketch is superseded or the context revision moves — shown as stale, never reused silently
Recognition = { target: SketchRef, context_revision: ℕ, purpose_scope: String, residual: Set(Axis) }
       -- target must be a presented, retained version; Finish is recognition of the assembled form, not of one focus
M  = Recognition gate answer ∈ {Marks(Set(Mark)), Fit(FitWitness), Finish(Recognition), Withdraw}
       -- Marks(∅) is read as Stop, never as Fit; silence yields the turn again; a response carrying both marks and a finish is parsed as Marks — recognition names an unmarked version
Location = a reference that outlives the session                   -- the capability the placement gate asks the user to bind; the protocol supplies no default
P  = Placement gate answer ∈ {Place(Location)}                     -- a free-response withdrawal here is EarlyExit with the recognition in the partial trace
Fixture = { ref: Location, target: SketchRef, scope: String, residual: Set(Axis) }
       -- status: recognition witness. It carries no implementation commitment and is not an executable specification
Disposition ∈ {Retained(Location), Released, ReleaseFailed(reason)}
TraceEntry = (Mark → Optional(Coordinate) → Optional(SketchRef) → Recognized | Superseded | Residual)
       -- what each mark became: its interpretation, the revision it drove, and how it ended
ExitCause ∈ {NotActivated, Recognized, Withdrawn, BoundaryReached, Dissolved}
RecognizedForm = single record { commitments: Set(Coordinate) (Settled only), witness: Fixture, recognition: Recognition,
                                 trace: List(TraceEntry), residual: Set(Axis), provisional: Set(Coordinate) }
       -- assembled after account: the retained concretum is reachable through witness.ref
NoActivationRelay = the failed predicate stated with its basis; a sibling deficit visible in the same scan is named as a finding and left to the session
EarlyExit = withdrawal at any gate: partial trace over completed rounds + account enforced + residual declared (no form recognized)
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
Phase 2: draft(RoundSpec, Λ.provisional) → Qround(Λ) → Stop → R                       -- round-spec gate [Tool]
       [R = Adjust(rev)] revise(draft, rev) → re-present Qround                       -- nothing is produced under an unsettled spec
       [R = Approve(settlements)] Λ.spec := draft → promote(settlements) → Λ.history ++= Promoted(each) → Phase 3
       -- free responses declared pre-gate: question a focus (answered, gate re-presented); contest the activation premise (dissolution arm → Phase 6); name a boundary (boundary arm → Phase 6); withdraw (Phase 6, EarlyExit arm)
       -- on the AI-detected path, the first Qround is also the confirm-or-decline of the run: Adjust or Approve confirms, a free-response decline is NoActivationRelay
Phase 3: produce(Λ.spec, Λ) → Sk : NonEmptyList(Sketch) → Λ.sketches ++= Sk           -- transform [Tool]
       [|Λ.spec.targets| > 1, conditional] produce_delegate(∥ one sketch per executor, temp-isolated) [Tool]
       -- Λ.round = 1: generate(brief | prior material, active_coords); Λ.round > 1: revise(brief.parent retained, active_coords, marks since that parent)
       -- every sketch records its concretum and a versioned reference at creation; existing project files stay unchanged
Phase 4: present(Sk) → acquire(marks) → Qfit(Sk, Λ.spec.focus) → Stop → M             -- recognition gate [Tool]
       [M = Marks(ms)]   Λ.history ++= Marked(each) → interpret(ms) → Λ.provisional ∪= Δ → stale(Λ.fit_witnesses over superseded sketches) → Λ.round += 1 → Phase 2
       [M = Fit(w)]      Λ.fit_witnesses ∪= {w} → Λ.history ++= Witnessed(w) → Λ.round += 1 → Phase 2
       [M = Finish(rec)] Λ.recognition := Some(rec) → Phase 5
       [M = Withdraw]    → Phase 6 (EarlyExit arm)
       -- free responses declared pre-gate: interrogate a sketch (answered within its placeholder status, gate re-presented); ask for a different realization (a spec revision — Phase 2 with the revision named, no new round counted); contest the premise (dissolution arm); name a boundary (boundary arm)
       -- Marks(∅) is Stop; a mixed response keeps its Keep marks; a response naming a version that was not presented is answered, never parsed as Finish
Phase 5: Qplace(Λ.recognition.target) → Stop → P                                        -- placement gate [Tool]
       [P = Place(location)] Λ.fixture := Some({ref: location, target, scope, residual}) → harvest → Phase 6 (RecognizedForm arm)
       -- the protocol names the capability (a reference that outlives the session) and supplies no default; a withdrawal here is the EarlyExit arm with the recognition recorded in the partial trace
Phase 6: account → Λ.exit := cause → terminal                                           -- all arms [Tool]
       [from Phase 5 — recognized and placed] retain(recognition.target at Λ.fixture.ref) ∧ release(every other sketch) → assemble → RecognizedForm
       [withdrawal at any gate] release(all) → EarlyExit
       [dissolution arm] release(all) → DissolutionExit
       [boundary arm] release(all) → BoundaryExit
       -- release: per sketch, the destruction read off its concretum (a no-op for Text) → verify absence → Disposition; a failure retries once, then is declared ReleaseFailed with a handoff, never silent

── LOOP ──
Each round re-enters Phase 2 with the history it accumulated; the round counter is visible at every Qround and Qfit.
No fixed round cap: a round that re-enters a Constitution gate is dialogue, and the user can withdraw at any gate.
Variant count is settled per round at Qround; a count the user already settled relays until they revise it.
Continue until: RecognizedForm (Finish + placement + account) OR EarlyExit OR DissolutionExit OR BoundaryExit.
Convergence evidence: at RecognizedForm, present the trace — each mark → its interpretation → the revision it drove → how it ended (recognized, superseded, or residual) — beside the recognized version, its placement, the Settled commitments, the coordinates still Provisional, and the residual axes. Each other terminal presents its own payload (TOOL GROUNDING). Demonstrated, not asserted.

── CONVERGENCE ──
accounted(Λ) = ∀ s ∈ Λ.sketches: ∃ d: (s.ref, d) ∈ Λ.dispositions          -- every sketch has a declared disposition
             ∧ (Λ.fixture = Some(f) ⇒ reachable(f.ref))                    -- the reference the result needs is usable
             ∧ ∀ (s, ReleaseFailed(r)) ∈ Λ.dispositions: handoff_declared(s)  -- failures are declared, never silent
recognition_ready(Λ) = Λ.recognition = Some(rec)
                     ∧ rec.target ∈ presented(Λ.sketches) ∧ retained(rec.target)
                     ∧ rec.context_revision = Λ.context_revision
                     ∧ Λ.fixture ≠ None                                      -- Qplace settled
                     ∧ residual_declared(Λ) ∧ trace_declared(Λ)
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
Phase 0 no_activation_relay (extension) → TextPresent+Proceed (the failed predicate with its basis; a sibling deficit seen in the scan is named as a finding and left to the session; not activated)
Phase 1 bind (track)                → Internal state update (prior material enters Λ.history as Settled or Candidate with provenance; the round counter starts)
Phase 2 draft (sense)               → Internal analysis (focus, realization, and target briefs proposed from active_coords, provisional coordinates, and the marks of the last round)
Phase 2 Qround (constitution)       → present (mandatory round-spec gate: this round's focus, the perception it needs, the variant briefs, and each provisional coordinate with the mark it came from; fires BEFORE anything is produced; Adjust re-presents without producing; the pre-gate text declares the free-response paths — question a focus, contest the premise, name a boundary, withdraw)
Phase 2 revise (track)              → Internal state update (Adjust branch: the draft revised as named before re-presenting)
Phase 2 settle (track)              → Internal state update (Approve branch: Λ.spec committed; each provisional coordinate the user named becomes Settled with a Promoted event; unnamed ones stay Provisional)
Phase 3 produce (transform)         → artifact write, environment run (temp-isolated sketches, each with its concretum and a versioned reference registered at creation; round 1 generates per brief, later rounds revise the retained parent each brief names; existing project files are never modified; Text concreta are session text only)
Phase 3 produce_delegate (dispatch) → delegate (conditional: more than one target; parallel topology: one sketch per executor, each temp-isolated with its reference registered; subordinate to the active runtime policy)
Phase 4 present (extension)         → TextPresent+Proceed (each sketch from its typed concretum — Text re-presented as recorded, an Artifact walked through at its reference — then this round's focus, what this realization cannot expose, which content came from the user and which is the AI's proposal, and every fit witness now stale)
Phase 4 acquire (observe)           → a channel returning utterances anchored on a sketch's element, region, whole, or span (read-only: the marks arrive as the user's utterances; the channel is a capability the host supplies, named here and bound nowhere in this contract; in a text-only host, quoting a span of a Text concretum is that channel)
Phase 4 Qfit (constitution)         → present (mandatory recognition gate on a specific version: Marks, Fit on this focus, Finish for a stated purpose, Withdraw; Marks(∅) is Stop; the pre-gate text declares the free-response paths — interrogate, ask for another realization, contest the premise, name a boundary)
Phase 4 record (track)              → Internal state update (every mark appended to Λ.history as itself; a fit witness appended; witnesses over superseded sketches marked stale)
Phase 4 interpret (sense)           → Internal analysis (marks → Provisional coordinates, each carrying the mark it came from; never Settled here)
Phase 5 Qplace (constitution)       → present (mandatory placement gate: the recognized version and the capability it needs — a reference that outlives the session; the user names the location; no default is offered)
Phase 6 harvest (track)             → Internal state update (Settled commitments, the fixture, the recognition, the trace, the residual axes, and the coordinates still Provisional, recorded before any release; the durable record is the RecognizedForm entire — sketch content beyond the retained version stays session-local)
Phase 6 account (transform)         → artifact write, environment run (per sketch: retain the recognized version at the settled location, release every other; verify each; one retry; ReleaseFailed declared with a handoff)
dissolution_relay (extension)       → TextPresent+Proceed (either party, at any gate: the sharpened description made the form recognizable without a further encounter, or the activation premise collapsed; state the basis, relay the Settled commitments and every mark recorded, run account, stand down as DissolutionExit — a success, not an abandonment)
boundary_relay (extension)          → TextPresent+Proceed (either party, at any gate: a sibling deficit is demonstrated, or a realization this round requires is one this session cannot supply; name the obligation and its basis, relay the harvest so far, run account, exit as BoundaryExit; the next protocol is the session's to choose)
withdraw (extension)                → TextPresent+Proceed (explicit free-response exit at any gate: partial trace + residual declared; account enforced; EarlyExit. A hard interrupt yields no turn, so account cannot run: temp isolation's bounded lifecycle is the backstop)
converge (extension)                → TextPresent+Proceed (transformation trace: marks → interpretations → revisions → recognition; the recognized version, its placement, Settled commitments, Provisional coordinates, residual axes, and every disposition)
seam (extension)                    → TextPresent+Proceed (fires at deactivation: a user-declared chain naming the next protocol settles the next move — proceed to it, citing that settling source; the RecognizedForm enters it as prior material, its fixture a recognition witness and nothing more. This protocol declares no wired outbound edge of its own. Every Constitution gate inside this protocol and inside the next fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, I: FormIntentSeed, round: ℕ,
      context_revision: ℕ,                     -- advances when the accumulated context moves outside the marks: a new user utterance about the form, a spec revision, a promoted coordinate
      history: List(Event),                    -- append-only; active_coords is folded from it, never stored apart
      provisional: Set(Coordinate),            -- AI interpretations awaiting the user's act at Qround
      spec: Option(RoundSpec),                 -- this round's settled spec; None until Approve
      sketches: List(Sketch),                  -- every version produced, retained for revision until account
      fit_witnesses: Set(FitWitness),          -- with staleness derived from sketches and context_revision
      recognition: Option(Recognition),
      fixture: Option(Fixture),
      dispositions: List<(SketchRef, Disposition)>,   -- one entry per sketch by terminal (invariant: accounted)
      exit: Option(ExitCause),
      initiator: Initiator,
      active: Bool, cause_tag: String }
-- Guard: no sketch is produced before a Qround approval covers its brief — phase < 3 ⇒ sketches = ∅ on round 1; a later round holds prior sketches and produces nothing until its Qround settles
-- Guard: a Coordinate enters Settled only through Promoted (a user act at Qround) or Bound(Settled) (a commitment already on record); Interpreted events are Provisional

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Form resolution emergent via session context.
```

## Core Principle

**Recognition over Description**: when the user cannot say what the form should be, produce something they can mark. Each sketch is a filter over the form space — it fixes what this round asks the user to see — and the user's marks, kept as their own utterances, are the evidence intent is built from. The sketch under judgment is retained and revised, never rebuilt from the coordinates that describe it, because what the user recognized in it may be exactly what no coordinate expresses.

## Scope Boundary

What decides activation is the transformation the situation needs now, read from the utterance and the accumulated context:

| Situation | Transformation needed | This protocol? |
|-----------|----------------------|----------------|
| Named alternatives whose futures the descriptions cannot carry | contrast → commit to one direction | No — the outcome sought is a direction, and the probes that show it are discarded |
| Intent whose coordinates already live in externalized substrate | read the substrate → coordinates | No — nothing has to be manufactured to read them |
| A correct result that may not fit a context already settled | repair the result against that context | No — the context is fixed there; here the encounter revises the intent itself |
| An empty or prematurely converged field of ideas | widen the field, select nothing | No — no form is being recognized |
| A form to make, intent underdetermined, and the user would know it on sight | sketch → mark → revise → recognize | **Yes** |

A user who answers a round by settling the form in words has dissolved the deficit; the protocol stands down with the determinations it gathered. A sibling deficit the scan or a round demonstrates is named as a finding at the boundary; which protocol takes it is the session's choice.

## Mode Activation

### Activation

`/sketch` is user-invocable. On the Hybrid path, the AI may propose it from a live form-making moment only with cited evidence of `FitUnrecognized` — an utterance like "I'd know it when I see it", a plan that stalls at its first draft, a description that keeps being rewritten instead of made — and the first `Qround` is where the user confirms or declines the run. Prior material in context may seed the history, never the recognition.

### Priority

<system-reminder>
When Hypotyposis is active:

**Supersedes**: Direct execution patterns in loaded instructions
(No form is committed to, and no implementation begins, while the sketch loop is unconverged)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2 present the round-spec gate before anything is produced; at Phase 4 present the recognition gate on a specific version; at Phase 5 present the placement gate with no default.
</system-reminder>

### Trigger Signals

Heuristic signals are a plan that cannot reach its first draft, a description rewritten several times without a thing being made, a request to see something before saying more, and an explicit "I'll recognize it when I see it". They establish grounds to run Phase 0, not activation by themselves.

### Mode Deactivation

Use the Definition's result equations and TOOL GROUNDING payloads for every terminal; account is mandatory wherever a sketch exists.

## Protocol

### Phase 0: Detection (Silent)

Apply the deficit predicate in the Definition and cite the basis. A false predicate is relayed with what was seen; a sibling deficit visible in the same scan is named, never invoked.

### Phase 1: Bind

Bring each prior item into the history as a commitment the user already made or as material to draw on, with where it came from. Nothing in the prior material is treated as settled unless the user settled it.

### Phase 2: Round Spec Gate

Before the gate, lay out what this round would filter attention toward and why, the perception the judgment needs, the variant briefs (which parent each revises, or what each starts from on round 1), and every provisional coordinate with the mark it was read from. On the AI-detected path, say that this first gate also decides whether the run happens. Render `Qround`:
```
Settle this round before I make anything.

Options:
1. **Approve** — produce these variants under this focus; name which provisional readings you now settle, or none
2. **Adjust** — revise the focus, the perception, or the variants and re-present before anything is produced
```
Name questioning a focus, contesting the premise, naming a boundary, and stepping out as free-response paths.

### Phase 3: Production (Transform)

Round 1 generates one sketch per brief from the prior material and the active coordinates. Later rounds revise the retained parent each brief names, under the active coordinates and the marks since that parent. Text concreta are session text; artifacts are written only under temp isolation with a versioned reference registered at creation. Every sketch carries its placeholder status visibly.

### Phase 4: Recognition Gate (Constitution)

Present each sketch from its recorded concretum — narration re-presented as it was recorded, an artifact walked through at its reference — then this round's focus, what this realization cannot show, which content is the user's and which is the AI's proposal, and any fit witness now stale. Then acquire the marks through the channel the host supplies and render `Qfit`:
```
Which version are you marking, and what do you see?

Options:
1. **Mark** — point at what does not fit (and what to keep) on a named version; I revise from there
2. **Fit on this focus** — this version is adequate on this round's focus; the next round takes another focus
3. **Finish** — this version is the form, for the purpose you state, with the axes you leave open
```
Name interrogating a sketch, asking for a different perception, contesting the premise, naming a boundary, and withdrawing as free-response paths; they are not numbered options. An empty mark set is a Stop, never a Fit.

### Phase 5: Placement Gate (Constitution)

Present the recognized version and the capability it needs — a reference that outlives the session — and render `Qplace` with no default:
```
Where does the recognized version live from here?

Options:
1. **Place** — name the location; the version is retained there and every other sketch is released
```
A withdrawal here is a free response: the recognition is recorded in the partial trace and the run exits early.

### Phase 6: Harvest → Account (in this order)

Record the Settled commitments, the fixture, the recognition, the trace, the residual axes, and the coordinates still provisional before any release. Then retain the recognized version at the settled location and release every other sketch, verifying each; a failed release is declared with a handoff and does not revoke the recognition. Persist the RecognizedForm entire; sketch content beyond the retained version stays session-local.

## UX Safeguards

Keep placeholder status visible in every sketch and every round. A sketch is sandbox matter, not a project edit, until the user places it. A mark is the user's utterance and is shown as such; an interpretation drawn from it is shown as the AI's, provisional until the user settles it. A fit witness over a superseded version is shown stale, never carried forward silently. The fixture is a recognition witness: it says what the user recognized, not what an implementation must do.

## Known Limitations

- A round's focus filters attention; a misfit the user does not notice on another axis is not surfaced by the protocol.
- The marks a realization can carry are bounded by that realization: a narration cannot expose what only layout or interaction would.
- Coordinates express what marks named; what the user recognized in the retained version and never named survives only in that version.
- The trace records what each mark became, not every alternative the AI considered while revising.

## Rules

- **Hybrid activation**: `/sketch` runs on direct invocation, or from an AI-detected `FitUnrecognized` with cited evidence, where the first `Qround` is the confirm-or-decline of the run. A form-making purpose observed without that evidence does not activate it.
- **Retain, then revise**: A sketch under judgment is retained and the next version revises it; coordinates alone never regenerate a sketch. Where the user asks for a fresh start on a brief, that is a new brief with no parent, settled at `Qround`.
- **Marks are utterances; interpretations are provisional**: Every mark enters the history as the user's own words, anchored on a version. A coordinate the AI reads from a mark is provisional until the user settles it at `Qround` or a convention already on record settles it; a later user act may supersede an earlier determination, and the earlier one stays recorded.
- **Recognition-gate response discipline**: `Fit` names a version and this round's focus and continues the loop; `Finish` names a version, a purpose, and the axes left open, and ends it. `Marks(∅)` is a Stop. A mixed response keeps its Keep marks. A version that was not presented cannot be finished. Interrogation, a request for another perception, a premise contest, a boundary, and withdrawal are named before the gate as free responses rather than peer options; a withdrawal parses to `Withdraw`, the typed exit the protocol acts on, because sketches exist and account has to run.
- **Placement has no default**: The protocol names what the retained version needs — a reference that outlives the session — and the user names where. The fixture that results is a recognition witness and carries no implementation commitment.
- **Harvest before account**: Record the commitments, witness, recognition, trace, residual, and provisional coordinates before any release. Account produces the dispositions; a `ReleaseFailed` is declared with a handoff and does not revoke the recognition.
- **Round composition**: Compose each round so the reader can act on it without reassembling it — everyday language rather than this file's formal vocabulary, the judgment set beside the evidence it rests on together with the differential implication that matters for the next move, and analytical context laid out before a gate rather than inside it, so the gate carries the question and each option's differential implication. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged, when some of what is in view belongs to a later round or a trace rather than this one, or when this protocol's own phases bear on where a sentence sits relative to a gate.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
