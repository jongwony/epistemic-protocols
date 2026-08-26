---
name: ideate
description: "Divergent candidate-field generation before any selection is made. When the object-level candidate field is empty or has prematurely converged, infers seed vs. blank entry from the invocation utterance alone — zero entry questions. A blank entry opens an abstract frame map for user selection before any concrete idea is shown, mitigating early-example fixation and preserving ownership; a seeded entry expands directly from the user's own fragments. Generates candidates in parallel across open frames with no elimination, ranking, or scoring — every candidate carries origin User or AI. The user's own stop is the constitutive act that bounds the field, available at any time; a stop before any candidate exists returns a typed withdrawal, never a mislabeled empty field. A wish to go deeper on an already-open frame parks as a typed follow-up for later chaining — the live loop only widens — and the assembled field is an endpoint-neutral contract (topic, tagged candidates, explored/unexplored frames, parked follow-ups, unaddressed signals) ready for any downstream unfolding. Reads only the invocation utterance plus a prior protocol's output the user explicitly names — never the wider session, codebase, or rules. Type: (CandidateFieldUnderexpanded, User, DIVERGE, IdeationRequest) → DiverseCandidateField. Alias: Heuresis(εὕρεσις: finding/invention)."
---

# Heuresis Protocol

Resolve an underexpanded candidate field through frame-parallel divergent generation, without ever eliminating, ranking, or selecting among the candidates it produces. Type: `(CandidateFieldUnderexpanded, User, DIVERGE, IdeationRequest) → DiverseCandidateField`.

## Definition

**Heuresis** (εὕρεσις): the act of finding or discovering[^1] — a dialogical act of widening a candidate field that is empty or has prematurely converged, before any selection is made. Divergent and convergent thinking are distinct cognitive operations (Runco & Acar, 2012), and no protocol in this catalog carries a typed guarantee to generate the object-level alternative set itself — heuresis sits at the point where the candidate field itself is thin. On a blank entry, heuresis opens an abstract frame map before showing any concrete idea — early concrete examples measurably narrow independent generation (Wadinambiarachchi et al., 2024), and ideating before seeing material preserves ownership and diversity that seeing it first does not (Qin et al., 2025). Generation is frame-parallel and never eliminates, ranks, or scores: selection is a downstream act, out of this protocol's scope.

[^1]: Greek εὕρεσις denotes finding, discovery, or invention/conception broadly; its later specialization as a term of rhetorical inventio is one historical narrowing among several, not the word's primary or governing sense here.

```
── FLOW ──
Heuresis(U) → bind(U) → classify_entry(U) → Entry →
  [Entry = Blank]         derive_frames(topic) → Qframes(frame_map) → Stop → FrameSelection →
                             [FrameSelection = Open(F_selected)] generate(∥ F_selected) → Round₁
                             [FrameSelection = Stop] → EarlyExit
  [Entry = Seeded(seeds)] derive_frames(seeds, topic) → generate(∥ frames; seeds fold in under their origin — utterance fragments as User) → Round₁
  present(Round) → Qround → Stop → D →
    [D = Continue(frames)] shape_frames(frames)? → generate(∥ frames) → Round → present → Qround (loop)
    [D = Stop]             assemble(Λ) → DiverseCandidateField (Λ.candidates ≠ ∅) | EarlyExit (Λ.candidates = ∅)
-- chain note: when U names a ChainRef (a prior protocol's output), its material folds in as seeds at classify_entry —
--   origin preserved when already tagged (a chained DiverseCandidateField), origin=User when untagged (collection
--   output, utterance fragments); a deliberate substrate-first choice the user made, documented as a trade-off (Rule 8)
-- park note: a deepen request at any Qround (wanting more on an already-open frame) parks into Λ.parked — it never
--   re-opens a frame mid-loop; parked follow-ups are declared at either terminal for post-protocol chaining
-- signal note: Phase 0 also extracts Signal(s) — concerns, weaknesses, or requirements present in the same bound
--   utterance + named ChainRef material — tagged by source (Utterance or Chain); coverage (unaddressed(Λ)) is
--   recomputed each round from Λ.candidates, never separately stored, and never a score, elimination reason, or
--   ranking signal

── MORPHISM ──
IdeationRequest
  → bind(utterance)                     -- read only the invocation utterance + any explicitly named chain reference
  → classify_entry(utterance)           -- Blank | Seeded(seeds); zero entry questions — inferred, never asked; a named
                                        --   ChainRef's material folds in here as seeds (origin preserved when already
                                        --   tagged, origin=User otherwise), so a ChainRef-bearing
                                        --   entry classifies Seeded even on a bare-topic utterance
  → derive_frames(Entry)                -- candidate GenerationFrames — the registry later rounds progressively open
  → select_frames(frames)               -- Blank only: Cognitive Partnership Move (Constitution) — frame map BEFORE any concrete candidate
  → generate(∥ open frames)             -- parallel candidate production; no elimination, no ranking, no scoring
  → present(Round)                      -- relay: candidates by frame + explored/unexplored declaration + unaddressed
                                        --   signals when any exist
  → continue_or_stop(Round)             -- user constitutive judgment; Stop available at every round AND before the first one;
                                        --   a deepen request parks (relay) rather than continuing — the loop only widens
  → assemble(field)                     -- the surviving field entire under the bound topic: every candidate origin- and frame-tagged, parked
                                        --   follow-ups and unaddressed signals declared, nothing dropped
  → DiverseCandidateField               -- happy-path terminal; the zero-candidate stop path exits as EarlyExit (FLOW)
requires: candidate_field_underexpanded(U)   -- runtime checkpoint (Phase 0); direct /ideate invocation satisfies it
deficit:  CandidateFieldUnderexpanded         -- activation precondition (Layer 1)
preserves: seed_provenance(U)                 -- every seed keeps the origin it folded in with (User for the user's own
                                              --   fragments, an already-tagged chain origin as-is) through every later
                                              --   round; never relabeled
invariant: Divergence over Selection          -- generation never eliminates, ranks, or converges; selection is outside this protocol

── TYPES ──
U      = IdeationRequest: the invocation utterance, read as-is — a natural-language topic, optional idea fragments, and an
         optional explicit reference to a prior collection protocol's output
         -- Input type: the morphism reads only the bound utterance plus an explicitly named prior-output reference — a
         --   bare invocation binds the immediately preceding user message AS the utterance (U-BINDING: a one-turn
         --   binding rule, still the user's own words); beyond that binding it never scans the wider session, codebase,
         --   or rules (Euporia's reverse-trace territory, not this protocol's)
Entry  = Blank                                -- utterance carries a topic only — no idea fragments, no named ChainRef
       | Seeded(Set(Seed))                    -- utterance carries idea fragments and/or names a ChainRef; both sources
         --   fold in as seeds at classify_entry — utterance fragments as origin=User, chained material under its
         --   existing origin tag when it carries one (origin=User only when untagged)
         -- coproduct: Blank and Seeded take DIFFERENT phase paths (frame-first gate vs. expand-first) — behavioral
         --   branching per the structural convention (natural-language definitions are for uniform-processing inputs only)
Seed   = { content: String, origin ∈ {User, AI} }   -- a pre-frame fragment; origin=User for utterance-borne fragments and
         --   untagged chained material, while chained material already carrying an origin tag keeps it (a chained
         --   DiverseCandidateField's candidates re-seed under their existing tags — an origin=AI candidate is never
         --   relabeled User by re-chaining). Carries no frame yet — frames do not exist until Phase 1 derives them
         --   (GenerationFrames are invocation-local, so a chained candidate's old frame is dropped, not preserved).
         --   Promoted to Candidate on the first generation pass, gaining the frame it lands under (origin travels unchanged)
ExpansionWitness ∈ {Empty, NarrowAcrossFrames, PrematurelyConverged} ∪ Emergent(T)
         -- classification of WHY the candidate field is underexpanded; cited as Phase 0 relay basis. Sub-level to
         --   CandidateFieldUnderexpanded — NOT itself a top-level deficit, and never gates activation (User-initiated:
         --   direct /ideate invocation IS the activation)
ChainRef = an explicit reference the utterance itself names to a prior collection protocol's output (e.g. "using what
         --   /inquire just gathered") -- the ONLY substrate-adjacent material this protocol reads; absent a named
         --   reference, no external material enters (Euporia boundary: no substrate scan, no reverse-traced coordinates)
Signal = { content: String, source ∈ {Utterance, Chain} }
         -- a concern, weakness, or requirement present in the bound input only — extracted at Phase 0 alongside Entry,
         --   from the same bound utterance plus any explicitly named ChainRef material (never a wider scan); source
         --   records which of the two it came from. Never a quality score, elimination reason, or ranking signal
         --   (coverage — unaddressed(Λ), defined in CONVERGENCE — is a binary observation, not a judgment on any candidate)
Candidate = { content: String, frame: Frame, origin ∈ {User, AI} }
         -- a generated idea item (raw material for divergence) — NOT a selection-ready alternative; carries no score,
         --   rank, or preference signal
Frame  = GenerationFrame { label: String, angle: String }
         -- a partition for parallel candidate production; distinct from Prothesis's
         --   FramedInquiry lens — GenerationFrame carries no substrate_need, no per-perspective directive, no
         --   epistemic-perspective machinery. It organizes divergent generation only — derived at Phase 1, extended
         --   only for a user-named new angle, opened progressively across rounds (never re-derived by a bare
         --   continue) — and is never handed off as a framed inquiry object
Round  = { frames_opened: Set(Frame), candidates: Set(Candidate) }   -- one generation pass; frames_opened is exact —
         --   every pass opens only not-yet-open frames (no mid-loop re-entry; a deepen wish parks instead)
Qframes = frame-map presentation (Blank path only) — abstract frames, no concrete candidate yet [Tool: Constitution interaction]
FrameSelection ∈ {Open(frames: Set(Frame)), Stop}   -- Qframes answer type, Open/Stop differential-future rationale: read references/blank-entry.md
Qround = per-round presentation: candidates by frame + explored/unexplored (direction contrast) + parked-so-far + unaddressed-signal declaration, then continuation ask, Continue always first and Stop always second [Tool: Constitution interaction]
D      = ContinuationAnswer ∈ {Continue(frames: Set(Frame)), Stop}
         -- Continue's frames are drawn from the declared unexplored set, or are user-named frames outside the declared
         --   set (free response — type-preserving materialization of Continue, not a new constructor). An already-open
         --   frame is NOT a Continue target: wanting more on it is a park request (→ ParkedFollowUp) — mid-loop
         --   deepening narrows the very field the loop exists to widen, so depth belongs to a later invocation chaining
         --   on the assembled field. A Continue naming no frames defaults to the declared unexplored set; when none
         --   remain, Continue has no default target — it materializes only with a user-named new angle (the gate's
         --   option text renders that state), and a Continue that materializes no target re-presents the round
         --   question rather than entering generation — an empty pass never runs. Stop is available at every Qround exactly as at
         --   Qframes — the user's stop is the constitutive act that bounds the field, not a pre-convergence abandonment
ParkedFollowUp = { frame: Frame, note: Optional(String) }
         -- a mid-loop wish to go deeper on an already-open frame, captured as a typed follow-up instead of narrowing
         --   the live loop; held in Λ.parked and declared at either terminal — its durable externalization (a task
         --   record, an issue) is a host-side handoff after the protocol ends, so the loop itself stays side-effect-free
DiverseCandidateField = {
  topic: String,
  candidates: Set(Candidate { content, frame, origin }),
  explored_frames: Set(Frame),
  unexplored_frames: Set(Frame),
  parked: Set(ParkedFollowUp),
  unaddressed_signals: Set(Signal)
}
         -- "diverse" = frame-distributed, never scored/ranked/optimized; candidates ≠ ∅ always holds here (see EarlyExit
         --   for the empty case). unaddressed_signals holds only signals with no responding candidate at Stop — an
         --   addressed signal needs no field of its own: the candidates heuresis read as answering it are already in
         --   the field, and judging that fit is the consumer's own act at selection time.
         --   The field is the propagation contract: endpoint-neutral and complete for unfolding what it carries
         --   (an issue tracker, /preview, a chained /ideate) — topic carries the bound request; the one declared
         --   boundary is the full signal take/discard ledger, which stays in session text (see Known Limitations);
         --   endpoint-specific unfolding is downstream scope, not heuresis's
EarlyExit = { frames_offered: Set(Frame), parked: Set(ParkedFollowUp), unaddressed_signals: Set(Signal), reason: Optional(String) }
         -- the typed terminal for a stop (Qframes Stop, a Qround Stop after passes that produced nothing)
         --   that fires while no candidate exists — an empty
         --   field is never mislabeled DiverseCandidateField; frames_offered declares what was on the table even
         --   though nothing was generated, unaddressed_signals holds every signal extracted (none had a candidate to
         --   respond to it), and any parked follow-ups are declared alongside — nothing is silently dropped

── U-BINDING ──
bind(U) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ chain_ref
Priority: explicit_arg > colocated_expr > prev_user_turn > chain_ref
         -- prev_user_turn binds only on a bare invocation: the immediately preceding user message BECOMES the utterance
         --   (one turn, the user's own words) — a binding rule for U, not a license to scan session history
         -- chain_ref, when named, folds its material in as seeds (origin preserved when tagged, User otherwise) — it never substitutes for the topic itself

/ideate "topic or fragments"               → U = "topic or fragments"
/ideate (alone)                            → U = previous user message
"give me some ideas ... /ideate"           → U = text before trigger
"using what /inquire just found, /ideate"  → U also carries the named ChainRef; its material folds in as origin=User seeds (untagged collection output; a chained DiverseCandidateField would keep its candidates' own origin tags)

── PHASE TRANSITIONS ──
Phase 0: U → bind(U) → classify_entry(U) → Entry ⊗ ExpansionWitness; Λ.topic := topic(U); Λ.signals := extract_signals(U)   -- silent; zero entry questions; topic(U) records the bound request in mode state, so assemble(Λ) has a formal source for the field's topic; extract_signals(U) reads the same bound utterance + named ChainRef only (Rule 7 boundary) and tags each Signal's source
       classify_relay(Entry, ExpansionWitness) → TextPresent+Proceed          -- states the inferred entry + its basis + the extracted signals (source-tagged) before proceeding; relay, not a gate — every signal enters session text once, at extraction
Phase 1: Entry → Λ.frames_candidate := derive_frames(Entry)   -- registered into mode state at derivation, so the frames_open ⊆ frames_candidate invariant is checkable from the first pass
       [Entry = Blank] present(frame map) → Qframes → Stop → FrameSelection   [Tool]   -- read references/blank-entry.md
         [FrameSelection = Open(F_selected)] → Phase 2 with F_selected
         [FrameSelection = Stop] → EarlyExit(frames_offered := Λ.frames_candidate, parked := Λ.parked, unaddressed_signals := Λ.signals)   -- stop before any candidate exists; Λ.parked is necessarily ∅ here (parks originate at Qround) — passed explicitly for uniform construction; every extracted signal is unaddressed since no candidate exists yet
       [Entry = Seeded(seeds)] → Phase 2 directly with Λ.frames_candidate (no gate — expand-first)   -- read references/seeded-entry.md
Phase 2: F_open → generate(∥ over F_open) → Round(candidates, frames_opened := F_open)   -- no elimination, no ranking; on the first pass of a Seeded entry, seeds promote to Candidates under the frame each lands in, each keeping its seed origin (utterance fragments User); generated candidates carry origin=AI; F_open ∩ Λ.frames_open = ∅ (Phase 3 admits only unexplored or newly registered frames), so frames_opened records genuinely new openings
       Λ.candidates := Λ.candidates ∪ Round.candidates, Λ.frames_open := Λ.frames_open ∪ F_open, Λ.rounds := append(Λ.rounds, Round)   -- state absorbed BEFORE Phase 3 presents: every Qround guard (the Stop branches' Λ.candidates test) reads post-round state, never stale
Phase 3: Round → present(Round: candidates by frame, explored_frames, unexplored_frames, parked so far, unaddressed(Λ)) → Qround → Stop → D   [Tool]
       [park request — the response asks for more on an already-open frame] Λ.parked := Λ.parked ∪ {ParkedFollowUp(frame, note)} — relay the parking (extension); a response carrying only a park leaves the continuation question open, so Qround is re-presented with the park acknowledged
       [D = Continue(frames: F'), F' ≠ ∅, F' ⊆ Λ.frames_unexplored] → Phase 2 with F' (open unexplored — no new derivation; an already-open frame is never a Continue target)
       [D = Continue(frames: F'), F' ⊄ Λ.frames_candidate] Fₙ := shape_frames(F' \ Λ.frames_candidate); Λ.frames_candidate := Λ.frames_candidate ∪ Fₙ → Phase 2 with (F' ∩ Λ.frames_unexplored) ∪ Fₙ (user-named new angle — shape_frames shapes it into registered frames before generation, a distinct operation from Phase 1's derive_frames: its domain is Set(Frame), not Entry; type-preserving materialization of Continue; any already-open frame the response also named routes to the park branch, never back into F_open)
         -- a Continue naming no frames defaults F' := Λ.frames_unexplored; when none remain, Continue has no default target — it materializes only with a user-named new angle (the gate's option text renders that state), and a bare Continue never derives new frames
       [D = Continue(frames: ∅) — the default resolved to an empty set: no unexplored frame remains and no new angle was named] → re-present Qround with that state rendered — Continue materialized no target, so no generation pass runs (F' ≠ ∅ guards Phase 2 entry; an empty round never exists)
       [D = Stop, Λ.candidates ≠ ∅] → assemble(Λ) → DiverseCandidateField(topic := Λ.topic, candidates := Λ.candidates, explored_frames := Λ.frames_open, unexplored_frames := Λ.frames_unexplored, parked := Λ.parked, unaddressed_signals := unaddressed(Λ))   -- every field sourced from Λ; explored_frames is the chain-contract name of Λ.frames_open
       [D = Stop, Λ.candidates = ∅] → EarlyExit(frames_offered := Λ.frames_candidate, parked := Λ.parked, unaddressed_signals := Λ.signals)   -- a completed pass can yield nothing; honest stop typing routes an empty field to EarlyExit, never DiverseCandidateField; with no candidates, every extracted signal is unaddressed

── LOOP ──
Round cadence: Phase 2 (generate, ∥ over open frames) → Phase 3 (present + Qround). Before every Qround, heuresis
  evaluates four things: which signals remain unaddressed, how the explored and unexplored frames differ in direction
  (not just their labels), what continuing would cost to review, and what stopping would finalize and preserve — the
  evaluation is fixed every round, but what renders adapts to what carries decision-relevant content this round
  (empty or unchanged detail may compress), except unaddressed signals, which are always surfaced whenever any exist.
  A Continue answer triggers
  shape_frames only when the user names a wholly new angle (shaped into registered frames before generation); opening
  declared-unexplored frames returns directly to Phase 2 — then back to Phase 3. A deepen request never re-enters
  Phase 2 mid-loop: it parks (Λ.parked) for a later invocation chaining on the assembled field — depth is downstream,
  width is this loop's whole business.
  No fixed round count and no quota: heuresis tracks no target to converge toward; the loop continues until the user's own Stop.
Novelty relay (optional, extension): at any Qround, heuresis MAY note as basis-cited context whether recent rounds read
  as producing candidates closer to earlier ones (novelty has not yet declined further, or has) — informational only,
  sits in the pre-gate text, describes state only, and never reorders the Continue/Stop options or blocks or discourages Stop.
Continue until: DiverseCandidateField (user Stop with ≥1 candidate already generated) OR EarlyExit (Stop
  while no candidate exists — the Blank frame map declined, or a Stop
  after passes that produced nothing).
Convergence evidence: at DiverseCandidateField, present the transformation trace — the bound topic, then for each
  opened frame, the candidates it produced with their origin tags, plus the declared unexplored frames, parked
  follow-ups, and unaddressed signals. At
  EarlyExit, present the frames that were derived and offered, none of which yielded a candidate, plus any parked
  follow-ups and unaddressed signals (every extracted signal, since none was addressed). Demonstrated, not asserted —
  and the trace materializes the full result type, nothing more, nothing less.

── CONVERGENCE ──
resolved(Λ) = user_stops(Λ)   -- the user's own Stop IS the completion predicate — not a separate judgment layered on
  top of an already-built object; this is what keeps termination-at-any-time from reading as pre-convergence abandonment
unaddressed(Λ) = { s ∈ Λ.signals | no c ∈ Λ.candidates responds to s }   -- derived, binary, source-traceable coverage
  observation, recomputed every round from current Λ.candidates — never a stored partition, and never a quality score,
  elimination reason, or ranking signal; a candidate "responding" to a signal is a semantic judgment heuresis makes at
  presentation time — a session-local reading remade from scratch each round (Λ.signals never shrinks, so a reading
  can reverse; nothing is sticky), never stored as a signal-to-candidate mapping, and never itself a score or rank on
  the candidate. The contract carries only the derived set as it stands at Stop — whether a candidate truly answers a
  signal is the consumer's own judgment at selection time, downstream of this protocol
result equations:
  DiverseCandidateField ⇔ resolved(Λ) ∧ Λ.candidates ≠ ∅
  EarlyExit             ⇔ resolved(Λ) ∧ Λ.candidates = ∅
                          -- a typed terminal, never a DiverseCandidateField mislabeled empty; frames_offered and
                          --   unaddressed_signals (every extracted signal, since none was addressed) declare what was
                          --   on the table so nothing is silently dropped
cleanup: not applicable — heuresis holds no side-effect state (no team spawned, no file artifact); the
  user_withdraw cleanup tier does not apply here — only Normal convergence (the user's own Stop) does.
  Parked follow-ups live in Λ and are declared at the terminal — their
  durable externalization (a task record, an issue) is a host-side handoff AFTER convergence, per the substrate
  boundary, so no cleanup obligation ever arises mid-loop
framing readout: the surfaced state names the work in play (which frames are open, how many candidates so far, what
  remains unexplored, what is parked, what signals remain unaddressed) — never a completion tally against a target
  round count, since heuresis tracks no such target

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 bind           (sense)        → Internal analysis (parse the invocation utterance + any explicitly named chain reference; no external tool, no substrate scan)
Phase 0 classify_relay  (extension)   → TextPresent+Proceed (states the inferred Entry — Blank or Seeded — and its basis, quoting the utterance fragment, plus the extracted signals with their source tags; relay, not a gate — zero entry questions)
Phase 0 extract_signals (sense)       → Internal analysis (Signals — concerns, weaknesses, requirements — read from the same bound utterance + named ChainRef only, same Rule 7 boundary as bind; tagged Utterance or Chain by source; surfaced once via the classify_relay emission; feeds unaddressed(Λ) each round, never scored or ranked)
Phase 1 derive_frames   (sense)       → Internal analysis (candidate GenerationFrames, registered as Λ.frames_candidate; seed-anchored + novel on Seeded, purely novel and abstract on Blank)
Phase 3 shape_frames    (sense)       → Internal analysis (a user-named new angle shaped into registered GenerationFrames, extending Λ.frames_candidate — distinct from Phase 1's derive_frames: domain Set(Frame), not Entry)
Phase 1 Qframes         (constitution) → present (Blank path only; conditional: fires when Entry = Blank; multi-select frame map presented BEFORE any concrete candidate, plus the Stop path; read references/blank-entry.md before presenting — it carries the template and the Stop-branch rationale)
Phase 2 generate        (sense)       → Internal generation (logical topology: parallel over open frames — no mandatory subagent dispatch; a host MAY realize this via isolated parallel agents when available, but heuresis's meaning is independent of that realization; no elimination, no ranking, no scoring)
Phase 3 present         (extension)   → TextPresent+Proceed (round relay: candidates grouped by frame with origin tags, explored/unexplored frame declaration with direction contrast, unaddressed signals when any exist, plus the fixed four-part decision-delta evaluation; precedes the gate)
Phase 3 Qround          (constitution) → present (mandatory every round; fixed order Continue=1, Stop=2 at every presentation and re-presentation; Continue — open more unexplored or name a new frame — or Stop; a deepen request parks rather than continuing)
Phase 3 park            (extension)   → Internal state update + TextPresent+Proceed (a request for more on an already-open frame parks as ParkedFollowUp — relay, basis: the user's own request quoted; declared at either terminal; durable externalization is a host-side handoff after the protocol ends)
Λ                       (track)       → Internal state update (topic records at Phase 0 bind; signals extracted at Phase 0 and fixed thereafter — never re-scanned, never removed; frames_candidate registers at Phase 1 and extends only on a user-named new angle; candidates, rounds, frames_open, parked accumulate; frames_unexplored and unaddressed(Λ) are both derived — frames_candidate minus frames_open, and signals with no responding candidate, respectively — recomputed each round, never stored as a separate partition; a candidate is never removed or relabeled once tagged with origin)
converge                (extension)   → TextPresent+Proceed (DiverseCandidateField: transformation trace — the bound topic + per opened frame, its candidates + declared unexplored frames + parked follow-ups + unaddressed signals; EarlyExit: the frames offered, none of which yielded a candidate, + parked follow-ups + unaddressed signals; either way the parked set's durable externalization hands off to the host after the trace)

── MODE STATE ──
Λ = { phase: Phase, entry: Option(Entry), witness: Option(ExpansionWitness),
      topic: Option(String),             -- the bound request, recorded at Phase 0; assemble(Λ) carries it into
                                         --   DiverseCandidateField so the chain contract needs no source outside Λ
      chain_ref: Option(ChainRef),
      signals: Set(Signal),              -- extracted at Phase 0 from the same bound utterance + named ChainRef only;
                                         --   fixed thereafter — never re-scanned from a wider source, never removed; unaddressed(Λ)
                                         --   (defined in CONVERGENCE) derives from this set and Λ.candidates, not
                                         --   stored separately
      frames_candidate: Set(Frame),
      frames_open: Set(Frame),           -- invariant: frames_open ⊆ frames_candidate — every opened frame is registered
                                         --   before generation (the Phase 3 new-angle branch registers Fₙ first);
                                         --   assembled as explored_frames in DiverseCandidateField
      frames_unexplored: Set(Frame),     -- derived, not accumulated: frames_candidate \ frames_open — opening a frame
                                         --   removes it here, so no frame is ever reported explored AND unexplored
      candidates: Set(Candidate),        -- accumulate-only across rounds; origin never relabeled once tagged
      rounds: List(Round),
      parked: Set(ParkedFollowUp),       -- accumulate-only; deepen wishes captured mid-loop, declared at either terminal
      active: Bool, cause_tag: String }
Phase ∈ {0, 1, 2, 3}

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Candidate-field resolution emergent via session context.
```

## Mode Activation

`/ideate` is user-initiated: an observation that a field looks narrow does not activate it. Selection and recommendation wait until the user's `Stop` produces `DiverseCandidateField` or `EarlyExit`.

## Protocol

### User-facing realization

Present the Phase 0 classification as a short basis-cited relay: the inferred entry, its witness, and source-tagged signals. For `Blank`, read `references/blank-entry.md` before presenting abstract frames and the pre-generation Stop path; for `Seeded`, read `references/seeded-entry.md` before the first expand-first pass. When a named `ChainRef` supplied seeds, also read `references/chain-reference.md` after classification and before promotion.

Before every `Qround`, present candidates grouped by frame with origins, the directional contrast between explored and unexplored frames, parked follow-ups, and every signal still unaddressed. State the extra review load and what Stop will preserve. Then present `Continue` first and `Stop` second with symmetric specificity: Continue opens unexplored or user-named new frames; a no-target Continue re-presents the question; a request for depth on an open frame parks and leaves the question open. Render Stop as `DiverseCandidateField` only when candidates exist and otherwise as `EarlyExit`.

Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, material belongs to another round or trace, or phase order determines placement around a gate.

## Known Limitations

- `unexplored_frames` covers derived frames, not every conceivable angle.
- A `ChainRef` gives up the blank path's independent-ideation-first benefit; no mitigation is claimed.
- Signal extraction is bounded to the entry input and is not exhaustive or session-long.
- The result carries the final unaddressed snapshot, not the full signal take/discard ledger; that ledger remains recoverable only from the session presentation.

## Rules

1. **User-initiated, zero entry questions**: `/ideate` activates only on direct invocation (Layer 1); `Entry` (Blank vs. Seeded) is inferred from the utterance alone — never asked. Phase 0's `classify_entry` is Extension/relay, not a gate.
2. **Frame-first ownership**: On `Blank`, read `references/blank-entry.md` before presenting abstract frames or any concrete candidate. Preserve every candidate's origin thereafter.
5. **User-bounded field**: `Stop` remains available from the first gate onward; it returns `DiverseCandidateField` only with candidates and otherwise the fully declared `EarlyExit`.
7. **Euporia boundary — utterance-only input**: heuresis reads only what the invocation carries — the utterance itself, plus a prior protocol's output the user explicitly names (a chain reference). A bare invocation binds the immediately preceding user message as the utterance (a one-turn U-BINDING rule, not a session scan). Beyond the bound utterance it never scans the wider session, codebase, or rules, and it never reverse-traces hidden decision coordinates from externalized substrate — that is Euporia's territory (`/elicit`), not this protocol's.
8. **Chain semantics**: A named `ChainRef` folds material in as seeds, preserving existing origin tags and using `User` only for untagged material. Read `references/chain-reference.md` after classification and before first-pass promotion; the ownership trade-off remains declared under Known Limitations.
11. **Round composition**: Compose each round so the reader can act on it without reassembling it — everyday language rather than this file's formal vocabulary, the judgment set beside the evidence it rests on together with the differential implication that matters for the next move, and analytical context laid out before a gate rather than inside it, so the gate carries the question and each option's differential implication. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged, when some of what is in view belongs to a later round or a trace rather than this one, or when this protocol's own phases bear on where a sentence sits relative to a gate.
17. **Depth parks, width continues**: A request for more inside an already-open frame parks as a source-cited `ParkedFollowUp`, is declared at either terminal, and leaves `Qround` open; deepening chains from the assembled field later.
20. **Decision delta**: Before every `Qround`, surface unaddressed signals, the explored/unexplored directional contrast, continuing's review cost, and what stopping preserves. Continue names its widening target and Stop names its live terminal.
21. **Neutral option order**: Continue is always first and Stop second, with symmetric specificity. Any novelty or coverage observation stays basis-cited pre-gate state and does not recommend or reorder either answer.
22. **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
