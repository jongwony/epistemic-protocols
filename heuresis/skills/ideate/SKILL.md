---
name: ideate
description: "Divergent candidate-field generation before any selection is made. When the object-level candidate field is empty or has prematurely converged, infers seed vs. blank entry from the invocation utterance alone — zero entry questions. A blank entry opens an abstract frame map for user selection before any concrete idea is shown, mitigating early-example fixation and preserving ownership; a seeded entry expands directly from the user's own fragments. Generates candidates in parallel across open frames with no elimination, ranking, or scoring — every candidate carries origin User or AI. The user's own stop is the constitutive act that bounds the field, available at any time; a stop before any candidate exists returns a typed withdrawal, never a mislabeled empty field. Reads only the invocation utterance plus a prior protocol's output the user explicitly names — never the wider session, codebase, or rules. Type: (CandidateFieldUnderexpanded, User, DIVERGE, IdeationRequest) → DiverseCandidateField. Alias: Heuresis(εὕρεσις: finding/invention)."
---

# Heuresis Protocol

Resolve an underexpanded candidate field through frame-parallel divergent generation, without ever eliminating, ranking, or selecting among the candidates it produces. Type: `(CandidateFieldUnderexpanded, User, DIVERGE, IdeationRequest) → DiverseCandidateField`.

## Definition

**Heuresis** (εὕρεσις): the act of finding or discovering[^1] — a dialogical act of widening a candidate field that is empty or has prematurely converged, before any selection is made. Divergent and convergent thinking are distinct cognitive operations (Runco & Acar, 2012), and no protocol in this catalog carries a typed guarantee to generate the object-level alternative set itself — the nearest neighbor, `/preview`, activates only once two or more candidates already exist and their futures are unrecognizable from description; heuresis sits upstream of that, at the point where the field itself is thin. On a blank entry, heuresis opens an abstract frame map before showing any concrete idea — early concrete examples measurably narrow independent generation (Wadinambiarachchi et al., 2024), and ideating before seeing material preserves ownership and diversity that seeing it first does not (Qin et al., 2025). Generation is frame-parallel and never eliminates, ranks, or scores: selection is a downstream act, out of this protocol's scope.

[^1]: Greek εὕρεσις denotes finding, discovery, or invention/conception broadly; its later specialization as a term of rhetorical inventio is one historical narrowing among several, not the word's primary or governing sense here.

```
── FLOW ──
Heuresis(U) → bind(U) → classify_entry(U) → Entry →
  [Entry = Blank]         derive_frames(topic) → Qframes(frame_map) → Stop → FrameSelection →
                             [FrameSelection = Open(F_selected)] generate(∥ F_selected) → Round₁
                             [FrameSelection = Stop] → EarlyExit
  [Entry = Seeded(seeds)] derive_frames(seeds, topic) → generate(∥ frames; seeds fold in as origin=User) → Round₁
  present(Round) → Qround → Stop → D →
    [D = Continue(frames)] derive_frames(frames)? → generate(∥ frames) → Round → present → Qround (loop)
    [D = Stop]             assemble(Λ.candidates) → DiverseCandidateField (Λ.candidates ≠ ∅) | EarlyExit (Λ.candidates = ∅)
  [user_esc, before Λ.candidates ≠ ∅] → EarlyExit
  [user_esc, after Λ.candidates ≠ ∅]  → terminate, no formal record (already-presented rounds stay visible in session text)
-- chain note: when U names a ChainRef (a prior collection protocol's output), its material folds in as origin=User seeds
--   at classify_entry — a deliberate substrate-first choice the user made, documented as a trade-off (Rule 8)

── MORPHISM ──
IdeationRequest
  → bind(utterance)                     -- read only the invocation utterance + any explicitly named chain reference
  → classify_entry(utterance)           -- Blank | Seeded(seeds); zero entry questions — inferred, never asked
  → derive_frames(Entry)                -- candidate GenerationFrames — the registry later rounds progressively open
  → select_frames(frames)               -- Blank only: Cognitive Partnership Move (Constitution) — frame map BEFORE any concrete candidate
  → generate(∥ open frames)             -- parallel candidate production; no elimination, no ranking, no scoring
  → present(Round)                      -- relay: candidates by frame + explored/unexplored declaration
  → continue_or_stop(Round)             -- user constitutive judgment; Stop available at every round AND before the first one
  → assemble(field)                     -- the surviving field entire: every candidate origin- and frame-tagged, nothing dropped
  → DiverseCandidateField               -- happy-path terminal; the zero-candidate stop path exits as EarlyExit (FLOW)
requires: candidate_field_underexpanded(U)   -- runtime checkpoint (Phase 0); direct /ideate invocation satisfies it
deficit:  CandidateFieldUnderexpanded         -- activation precondition (Layer 1)
preserves: seed_provenance(U)                 -- user-supplied seeds keep origin=User through every later round; never relabeled
invariant: Divergence over Selection          -- generation never eliminates, ranks, or converges; selection is outside this protocol

── TYPES ──
U      = IdeationRequest: the invocation utterance, read as-is — a natural-language topic, optional idea fragments, and an
         optional explicit reference to a prior collection protocol's output
         -- Input type: the morphism reads only what THIS invocation carries — the utterance plus an explicitly named
         --   prior-output reference; it never scans the wider session, codebase, or rules (Euporia's reverse-trace
         --   territory, not this protocol's)
Entry  = Blank                                -- utterance carries a topic only, no idea fragments
       | Seeded(Set(Seed))                    -- utterance carries idea fragments, extracted as origin=User seeds
         -- coproduct: Blank and Seeded take DIFFERENT phase paths (frame-first gate vs. expand-first) — behavioral
         --   branching per the structural convention (natural-language definitions are for uniform-processing inputs only)
Seed   = { content: String, origin = User }   -- a pre-frame fragment lifted from the utterance; carries no frame yet —
         --   frames do not exist until Phase 1 derives them. Promoted to Candidate on the first generation pass,
         --   gaining the frame it lands under (origin stays User, never relabeled)
ExpansionWitness ∈ {Empty, NarrowAcrossFrames, PrematurelyConverged} ∪ Emergent(T)
         -- classification of WHY the candidate field is underexpanded; cited as Phase 0 relay basis. Sub-level to
         --   CandidateFieldUnderexpanded — NOT itself a top-level deficit, and never gates activation (User-initiated:
         --   direct /ideate invocation IS the activation)
ChainRef = an explicit reference the utterance itself names to a prior collection protocol's output (e.g. "using what
         --   /inquire just gathered") -- the ONLY substrate-adjacent material this protocol reads; absent a named
         --   reference, no external material enters (Euporia boundary: no substrate scan, no reverse-traced coordinates)
Candidate = { content: String, frame: Frame, origin ∈ {User, AI} }
         -- a generated idea item (raw material for divergence) — NOT a selection-ready alternative; carries no score,
         --   rank, or preference signal
Frame  = GenerationFrame { label: String, angle: String }
         -- a partition for parallel candidate production; distinct from Prothesis's
         --   FramedInquiry lens — GenerationFrame carries no substrate_need, no per-perspective directive, no
         --   epistemic-perspective machinery. It organizes divergent generation only — derived at Phase 1, extended
         --   only for a user-named new angle, opened progressively across rounds (never re-derived by a bare
         --   continue) — and is never handed off as a framed inquiry object
Round  = { frames_opened: Set(Frame), candidates: Set(Candidate) }   -- one generation pass
Qframes = frame-map presentation (Blank path only) — abstract frames, no concrete candidate yet [Tool: Constitution interaction]
FrameSelection ∈ {Open(frames: Set(Frame)), Stop}
         -- Qframes answer type; Open(≥1 frame) proceeds to generation, Stop returns EarlyExit before anything is generated
         --   (a genuine differential future, not a meta-action — stays a peer constructor, not a free-response demotion)
Qround = per-round presentation: candidates by frame + explored/unexplored declaration, then continuation ask [Tool: Constitution interaction]
D      = ContinuationAnswer ∈ {Continue(frames: Set(Frame)), Stop}
         -- Continue's frames may be drawn from the declared unexplored set, may re-select an already-open frame to
         --   deepen, or may be a user-named frame outside the declared set (free response — type-preserving
         --   materialization of Continue, not a new constructor). A Continue naming no frames defaults to the declared
         --   unexplored set — or, when none remain, to deepening the currently open frames — so the next pass always
         --   has ≥1 open frame. Stop is available at every Qround exactly as at
         --   Qframes — the user's stop is the constitutive act that bounds the field, not a pre-convergence abandonment
DiverseCandidateField = {
  candidates: Set(Candidate { content, frame, origin }),
  explored_frames: Set(Frame),
  unexplored_frames: Set(Frame)
}
         -- "diverse" = frame-distributed, never scored/ranked/optimized; candidates ≠ ∅ always holds here (see EarlyExit
         --   for the empty case)
EarlyExit = { frames_offered: Set(Frame), reason: Optional(String) }
         -- the typed terminal for a stop (Qframes Stop, a Qround Stop after passes that produced nothing, or user_esc)
         --   that fires while no candidate exists — an empty
         --   field is never mislabeled DiverseCandidateField; frames_offered declares what was on the table even
         --   though nothing was generated, so nothing is silently dropped

── U-BINDING ──
bind(U) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ chain_ref
Priority: explicit_arg > colocated_expr > prev_user_turn > chain_ref
         -- chain_ref, when named, folds its material in as origin=User seeds — it never substitutes for the topic itself

/ideate "topic or fragments"               → U = "topic or fragments"
/ideate (alone)                            → U = previous user message
"give me some ideas ... /ideate"           → U = text before trigger
"using what /inquire just found, /ideate"  → U also carries the named ChainRef; its material folds in as origin=User seeds

── PHASE TRANSITIONS ──
Phase 0: U → bind(U) → classify_entry(U) → Entry ⊗ ExpansionWitness           -- silent; zero entry questions
       classify_relay(Entry, ExpansionWitness) → TextPresent+Proceed          -- states the inferred entry + its basis before proceeding; relay, not a gate
Phase 1: Entry → Λ.frames_candidate := derive_frames(Entry)   -- registered into mode state at derivation, so the frames_open ⊆ frames_candidate invariant is checkable from the first pass
       [Entry = Blank] present(frame map) → Qframes → Stop → FrameSelection   [Tool]
         [FrameSelection = Open(F_selected)] → Phase 2 with F_selected
         [FrameSelection = Stop] → EarlyExit(frames_offered := Λ.frames_candidate)   -- stop before any candidate exists
       [Entry = Seeded(seeds)] → Phase 2 directly with Λ.frames_candidate (no gate — expand-first)
Phase 2: F_open → generate(∥ over F_open) → Round(candidates, frames_opened := F_open)   -- no elimination, no ranking; on the first pass of a Seeded entry, seeds promote to Candidates under the frame each lands in (origin=User); generated candidates carry origin=AI
       Λ.candidates := Λ.candidates ∪ Round.candidates, Λ.frames_open := Λ.frames_open ∪ F_open, Λ.rounds := append(Λ.rounds, Round)   -- state absorbed BEFORE Phase 3 presents: every Qround guard (the Stop branches' Λ.candidates test) reads post-round state, never stale
Phase 3: Round → present(Round: candidates by frame, explored_frames, unexplored_frames) → Qround → Stop → D   [Tool]
       [D = Continue(frames: F'), F' ⊆ Λ.frames_candidate] → Phase 2 with F' (open unexplored or deepen already-open — no new derivation)
       [D = Continue(frames: F'), F' ⊄ Λ.frames_candidate] Fₙ := derive_frames(F' \ Λ.frames_candidate); Λ.frames_candidate := Λ.frames_candidate ∪ Fₙ → Phase 2 with (F' ∩ Λ.frames_candidate) ∪ Fₙ (user-named new angle — the Phase 1 reopen shapes it into registered frames before generation; type-preserving materialization of Continue)
         -- a Continue naming no frames defaults F' := unexplored frames; when none remain, F' := currently open frames (deepen) — F' is never empty or undefined, and a bare Continue never derives new frames
       [D = Stop, Λ.candidates ≠ ∅] → assemble(Λ.candidates) → DiverseCandidateField(candidates, explored_frames, unexplored_frames)
       [D = Stop, Λ.candidates = ∅] → EarlyExit(frames_offered := Λ.frames_candidate)   -- a completed pass can yield nothing; honest stop typing routes an empty field to EarlyExit, never DiverseCandidateField
user_esc (any Phase, before Λ.candidates ≠ ∅) → EarlyExit(frames_offered := Λ.frames_candidate)   -- ungraceful; no cleanup — no side-effect state to discard
user_esc (any Phase, after Λ.candidates ≠ ∅)  → terminate, no formal DiverseCandidateField record   -- ungraceful; the already-presented round content stays visible in session text regardless

── LOOP ──
Round cadence: Phase 2 (generate, ∥ over open frames) → Phase 3 (present + Qround). A Continue answer reopens Phase 1's
  derivation only when the user names a wholly new angle (shaped into registered frames before generation); opening
  declared-unexplored frames or deepening already-open ones returns directly to Phase 2 — then back to Phase 3.
  No fixed round count and no quota: heuresis tracks no target to converge toward; the loop continues until the user's own Stop.
Novelty relay (optional, extension): at any Qround, heuresis MAY note as basis-cited context whether recent rounds read
  as producing candidates closer to earlier ones (novelty has not yet declined further, or has) — informational only,
  sits in the pre-gate text, and never blocks or discourages Stop.
User esc available at every gate (Qframes, Qround) — ungraceful, no cleanup, universal.
Continue until: DiverseCandidateField (user Stop with ≥1 candidate already generated) OR EarlyExit (Stop or user_esc
  while no candidate exists — the Blank frame map declined, an escape before the first round completes, or a Stop
  after passes that produced nothing).
Convergence evidence: at DiverseCandidateField, present the transformation trace — for each opened frame, the
  candidates it produced with their origin tags, plus the declared unexplored frames. At EarlyExit, present the frames
  that were derived and offered, none of which yielded a candidate. Demonstrated, not asserted.

── CONVERGENCE ──
resolved(Λ) = user_stops(Λ)   -- the user's own Stop IS the completion predicate — not a separate judgment layered on
  top of an already-built object; this is what keeps termination-at-any-time from reading as pre-convergence abandonment
result equations:
  DiverseCandidateField ⇔ resolved(Λ) ∧ Λ.candidates ≠ ∅
  EarlyExit             ⇔ (resolved(Λ) ∨ user_esc) ∧ Λ.candidates = ∅
                          -- a typed terminal, never a DiverseCandidateField mislabeled empty; frames_offered declares
                          --   what was on the table so nothing is silently dropped
cleanup: not applicable — heuresis holds no side-effect state (no team spawned, no file artifact); the Three-Tier
  Termination user_withdraw cleanup tier does not apply here, only user_esc (universal, ungraceful, no cleanup) and
  Normal convergence (the user's own Stop)
framing readout: the surfaced state names the work in play (which frames are open, how many candidates so far, what
  remains unexplored) — never a completion tally against a target round count, since heuresis tracks no such target

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 bind           (sense)        → Internal analysis (parse the invocation utterance + any explicitly named chain reference; no external tool, no substrate scan)
Phase 0 classify_relay  (extension)   → TextPresent+Proceed (states the inferred Entry — Blank or Seeded — and its basis, quoting the utterance fragment; relay, not a gate — zero entry questions)
Phase 1 derive_frames   (sense)       → Internal analysis (candidate GenerationFrames, registered as Λ.frames_candidate; seed-anchored + novel on Seeded, purely novel and abstract on Blank)
Phase 1 Qframes         (constitution) → present (Blank path only; conditional: fires when Entry = Blank; multi-select frame map presented BEFORE any concrete candidate, plus the Stop path; Esc → loop termination)
Phase 2 generate        (sense)       → Internal generation (logical topology: parallel over open frames — no mandatory subagent dispatch; a host MAY realize this via isolated parallel agents when available, but heuresis's meaning is independent of that realization; no elimination, no ranking, no scoring)
Phase 3 present         (extension)   → TextPresent+Proceed (round relay: candidates grouped by frame with origin tags, explored/unexplored frame declaration; precedes the gate)
Phase 3 Qround          (constitution) → present (mandatory every round; Continue — open more / deepen / name a new frame — or Stop; Esc → loop termination)
Λ                       (track)       → Internal state update (frames_candidate registers at Phase 1 and extends only on a user-named new angle; candidates, rounds, frames_open accumulate; frames_unexplored is derived — frames_candidate minus frames_open, so an opened frame leaves the unexplored set; a candidate is never removed or relabeled once tagged with origin)
converge                (extension)   → TextPresent+Proceed (DiverseCandidateField: transformation trace — per opened frame, its candidates + declared unexplored frames; EarlyExit: the frames offered, none of which yielded a candidate)

── MODE STATE ──
Λ = { phase: Phase, entry: Option(Entry), witness: Option(ExpansionWitness),
      chain_ref: Option(ChainRef),
      frames_candidate: Set(Frame),
      frames_open: Set(Frame),           -- invariant: frames_open ⊆ frames_candidate — every opened frame is registered
                                         --   before generation (the Phase 3 new-angle branch registers Fₙ first)
      frames_unexplored: Set(Frame),     -- derived, not accumulated: frames_candidate \ frames_open — opening a frame
                                         --   removes it here, so no frame is ever reported explored AND unexplored
      candidates: Set(Candidate),        -- accumulate-only across rounds; origin never relabeled once tagged
      rounds: List(Round),
      active: Bool, cause_tag: String }
Phase ∈ {0, 1, 2, 3}

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Candidate-field resolution emergent via session context.
```

## Core Principle

**Divergence over Selection**: a candidate is raw material, not a selection-ready alternative — heuresis never discards, scores, ranks, or converges on one. This is deliberate: AI assistance can raise inter-output similarity (Doshi & Hauser, 2024), and premature narrowing during generation is exactly the failure mode a divergence protocol exists to avoid. Later candidates in a session tend to be more original than earlier ones — the serial-order effect (Beaty & Silvia, 2012) — a reason heuresis carries no fixed round count or quota and lets the user's own stop bound the field, rather than the protocol declaring itself done. "No elimination" governs candidates, not conversation: a stance of no criticism at all is not universally optimal for idea quality (Nemeth et al., 2004), so heuresis does not suppress generative challenge or clarifying pushback during a round — it only forbids discarding or ranking the candidates a round produces.

## Mode Activation

### Activation

Command invocation activates the protocol. heuresis is **User-initiated only** — whether a candidate field needs widening is the user's own judgment about their own creative process, not something the AI infers and auto-activates on.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/ideate` slash command or description-matching input. Always available.
- **Layer 2**: No AI-guided activation. heuresis MAY observe in passing, in prose, that a candidate field looks narrow — that observation is never an activation.

### Priority

<system-reminder>
When Heuresis is active:

**Supersedes**: Direct-answer patterns that jump straight to a single recommended idea or a pre-narrowed shortlist
(Divergent generation must run — and the user's own Stop must fire — before any selection or recommendation)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: On a Blank entry, present the frame map via Cognitive Partnership Move (Constitution) before any concrete candidate is generated. Every round, present the round's candidates and the explored/unexplored frame declaration, then present Qround via Cognitive Partnership Move (Constitution). Stop is a first-class answer at every gate, available from the very first one.
</system-reminder>

- Heuresis completes (converges to `DiverseCandidateField` or `EarlyExit`) before downstream selection work begins
- Loaded instructions resume after convergence or Esc

### Trigger Signals

| Signal | Detection |
|--------|-----------|
| Pure topic, no attached ideas | Utterance names a subject with no idea fragments — a Blank entry |
| One idea offered, more requested | Utterance carries exactly one fragment and asks for "more," "other angles," "what else" |
| Fixation language | Utterance names a single option as settled while the underlying goal stays open ("I think X is it, but let me see other angles") |
| Direct request for options | "give me some ideas / directions / angles" with no existing candidate field in view |

**Skip**:
- Two or more candidates already exist and their futures just need to be seen before choosing → `/preview`
- The material to ideate from lives outside this conversation (codebase, rules, past sessions) → run the collection protocol first (e.g. `/inquire`) and name its output in the `/ideate` invocation; heuresis itself never scans
- The ask is analytical lenses on a fixed inquiry, not idea generation → `/frame`
- The ask is verifying understanding of completed work → `/grasp`

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Stop at Qframes (Blank, before any candidate) | `EarlyExit` — frames_offered declared, nothing generated |
| Stop at Qround | `DiverseCandidateField` when ≥1 candidate exists — candidates + explored/unexplored frames; `EarlyExit` when completed passes produced none |
| user_esc before `Λ.candidates ≠ ∅` | `EarlyExit` — ungraceful, no cleanup (no side-effect state exists) |
| user_esc after `Λ.candidates ≠ ∅` | Terminate without a formal record — already-presented rounds remain visible in session text |

## Protocol

### Phase 0: Entry Classification (Silent)

Bind the invocation utterance per U-BINDING. Determine `Entry` by scanning the utterance for idea fragments: any fragment present → `Seeded`, extracted as seeds tagged `origin=User` (pre-frame fragments — each gains a frame when generation first runs); a bare topic with no fragments → `Blank`. This is a relay, not a gate — `Entry` is inferred, never asked (zero entry questions).

Classify `ExpansionWitness` alongside `Entry` — `Empty` (Blank: nothing yet), `NarrowAcrossFrames` (Seeded, but every seed clusters within one implied frame), `PrematurelyConverged` (the utterance signals settling on a single option while the underlying goal stays open), or an emergent case outside the named three (`Emergent(T)`: name the observed pattern ad hoc — the named types are working hypotheses, not an exhaustive set) — cited as basis in the relay text that follows, and used to shape frame derivation (a `PrematurelyConverged` witness pushes frame derivation toward angles distant from the existing single idea).

Present the classification as a short relay before proceeding: what was read as `Entry`, its basis (quoting the utterance fragment), and the `ExpansionWitness`. No user response is requested here — proceed directly to Phase 1.

**Scope restriction**: Phase 0 reads only the invocation utterance plus a chain reference the utterance explicitly names (`ChainRef` — e.g. "using what `/inquire` just gathered"). It never scans the wider session, codebase, or rules — that is Euporia's territory, not this protocol's.

### Phase 1: Frame Derivation (+ Frame Map on Blank)

Derive `GenerationFrame` candidates — distinct angles the candidate production will parallelize over, registered once here and extended later only for a user-named new angle. On `Blank`, frames are purely novel and stay abstract (no concrete example folded in yet — showing one this early risks anchoring the user's own generation before it starts). On `Seeded`, frames are derived from the seeds' implied angle(s) plus genuinely novel ones, so the round doesn't just restate what the user already has.

**Blank path — present the frame map before any concrete candidate:**

```
question: "Which angles do you want open first?"
selection: multiple
options:
  - label: "[Frame A]"
    description: "[one-line angle]"
  - label: "[Frame B]"
    description: "[one-line angle]"
  - label: "[Frame C]"
    description: "[one-line angle]"
Or:
- Stop — end here; nothing has been generated yet
```

Selecting ≥1 frame proceeds to Phase 2 with exactly those frames open. **Stop** here returns `EarlyExit` with every derived frame declared as `frames_offered` — nothing was generated, and that is stated plainly, not silently dropped.

**Seeded path — no gate.** Frames derived from the seeds proceed straight to Phase 2 (expand-first): the user already committed concrete material, so the early-example fixation risk the Blank-path gate exists to avoid does not apply the same way here.

### Phase 2: Parallel Generation (Silent)

Generate candidates across every open frame in this round — logically parallel, no mandatory subagent dispatch (a host MAY realize this via isolated parallel agents when available; heuresis's meaning does not depend on it). No elimination, no ranking, no scoring: every candidate produced survives into the round. On the very first pass of a Seeded entry, the original seeds are promoted to `origin=User` candidates under the frame each lands in, alongside whatever the frames generate as `origin=AI`; every later pass tags its output `origin=AI`.

### Phase 3: Round Presentation + Continuation (Constitution)

Present the round as text before the gate: candidates grouped by the frame they came from, each tagged with its origin; the round's newly opened frames alongside the cumulative explored set (`explored_frames` — every frame opened so far, this round's included); and the frames derived but not yet opened (`unexplored_frames`). heuresis MAY note, as basis-cited context only, whether recent rounds read as producing candidates closer to earlier ones — this never blocks or discourages Stop.

Then **present** Qround:

```
Options:
1. **Continue** — open more of the unexplored frames, deepen one already open, or name a new angle yourself; a bare continue opens the remaining unexplored frames (or deepens the open ones when none remain); another pass follows
2. **Stop** — [when candidates exist] this is the candidate field; declare what's still unexplored and hand it off
   [when completed passes produced none] end here with nothing generated — a typed early exit; the offered frames are declared, not dropped
```

**Continue** may name specific unexplored frames, re-select an already-open frame to deepen, or introduce a frame the user names outright (a free response — type-preserving materialization of `Continue`, not a new constructor); a Continue naming nothing defaults to the declared unexplored frames, or to deepening the open ones when none remain — the next pass always has ≥1 open frame. Loop back to Phase 1's derivation (only when a user-named new angle needs shaping into a registered frame) or directly to Phase 2 (opening declared-unexplored frames or deepening already-open ones). **Stop** is available here exactly as it is at Qframes — the user's own Stop, at any round, is what bounds the field: assemble `Λ.candidates` into `DiverseCandidateField` when at least one candidate exists, with `explored_frames` and `unexplored_frames` both declared; a Stop after passes that produced nothing returns `EarlyExit` — honest stop typing, an empty field is never dressed up as the resolution type. The Stop option's description renders whichever of these two futures is live at gate time — the gate never promises a candidate field that does not exist.

## Adversarial Guards

- **substrate-creep**: heuresis starts reading the codebase, rules, or past sessions to seed generation instead of the invocation utterance alone. Guard: `bind()` is scoped to the utterance plus an explicitly named `ChainRef` only (Rule 7) — any wider read belongs to a collection protocol run first and chained in, never to heuresis itself.
- **lens-conflation**: a `GenerationFrame` gets treated as an analytical perspective — carrying a substrate need, a per-perspective directive, or getting handed off as a framed inquiry object. Guard: `GenerationFrame` is a partition for parallel production only (Rule 9); that machinery belongs to `/frame`, not here.
- **selection-creep**: candidates start getting scored, ranked, starred, or silently dropped between rounds. Guard: generation never eliminates (Rule 3); a candidate that exists stays in `Λ.candidates` until the user stops — selection is downstream, out of scope.

## Known Limitations

**Unexplored-frame honesty is bounded by derivation breadth**: heuresis declares `unexplored_frames` from what it actually derived, not from every conceivable angle — it cannot prove the declared set is exhaustive, only that nothing derived was silently withheld.

**Chain fixation is a stated trade-off, not a mitigated one**: material folded in via a `ChainRef` was read by the user before the invocation utterance was written, so the ownership/diversity benefit of ideating before seeing material does not hold on that path. heuresis documents this; it adds no countermeasure.

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Zero entry questions | `Entry` inferred from the utterance alone (`classify_entry`, extension) | No interrogation gate before generation begins |
| Frame-first on Blank | `Qframes` presents abstract frames before any concrete candidate | Mitigates early-example fixation; preserves ownership |
| No elimination, no ranking | `generate()` never discards, scores, or ranks a candidate | Selection stays out of scope; downstream protocols own it |
| Provenance preserved | Every `Candidate` carries `origin ∈ {User, AI}`, never relabeled | Fixation and ownership stay observable after the fact |
| Stop at any time | Stop is a peer answer at `Qframes` and every `Qround` | The user's own stop bounds the field; not a target-count completion |
| Honest stop typing | `Λ.candidates = ∅` at Stop/Esc → `EarlyExit`, never `DiverseCandidateField` | An empty field is never dressed up as the resolution type |
| Euporia boundary | `bind()` reads only the utterance + a named `ChainRef` | No substrate scan, no reverse-traced coordinates |
| Chain trade-off documented | Chained material folds in as `origin=User` with no mitigation | The user's deliberate substrate-first choice stays honest, undisguised |
| Vendor-neutral parallelism | `generate()`'s `∥` topology names no required tool | Meaning independent of host realization; provenance stays `{User, AI}` |

## Rules

1. **User-initiated, zero entry questions**: `/ideate` activates only on direct invocation (Layer 1); `Entry` (Blank vs. Seeded) is inferred from the utterance alone — never asked. Phase 0's `classify_entry` is Extension/relay, not a gate.
2. **Recognition over Recall, frame-first before concrete**: On a Blank entry, the frame map is presented via Cognitive Partnership Move (Constitution) BEFORE any concrete candidate is generated — abstract frames only, so the user picks a direction of divergence, not a specific idea, preserving ownership and mitigating early-example fixation.
3. **No elimination, no ranking**: Generation never discards, scores, ranks, or optimizes a candidate. A "candidate" in this type is a generated idea item (raw material) — never a selection-ready alternative. Selection is out of scope; it belongs downstream — seeing candidate futures before choosing (`/preview`) or the user's own direct judgment, with the resulting decision auditable for unnoticed gaps (`/gap` — an audit of the decision made, not a selector among candidates).
4. **Provenance preserved**: Every candidate carries `origin ∈ {User, AI}`. User-supplied seeds keep `origin=User` through every subsequent round; they are never relabeled.
5. **Termination is the user's constitutive act, at any time**: Stop is available at every gate, including before any candidate is ever generated. The user's stop bounds the field — it is not a pre-convergence abandonment; the completion predicate for `DiverseCandidateField` IS the user's own stop (with candidates ≠ ∅ at that moment). heuresis MAY relay that recent rounds show declining novelty as basis-cited context; this NEVER blocks or discourages Stop.
6. **Honest stop typing**: A stop while ≥1 candidate exists converges to `DiverseCandidateField`. A stop while none exist — declining the Blank frame map, `user_esc` before the first round completes, or a Stop after completed passes that produced nothing — returns `EarlyExit` — the frames that were offered are declared, never silently dropped, and an empty field is never mislabeled `DiverseCandidateField`.
7. **Euporia boundary — utterance-only input**: heuresis reads only what the invocation carries — the utterance itself, plus a prior protocol's output the user explicitly names (a chain reference). It never scans the wider session, codebase, or rules, and it never reverse-traces hidden decision coordinates from externalized substrate — that is Euporia's territory (`/elicit`), not this protocol's.
8. **Chain semantics — a documented trade-off, not a mitigation**: When the invocation names a chain reference, the chained material folds in as `origin=User` seeds — promoted to candidates on the first generation pass exactly like utterance-borne seeds, gaining the frame each lands under. Chaining substrate material in is itself the user's deliberate choice of substrate-first over independent-ideation-first; the ownership/diversity benefit of ideating before seeing prior material does not hold on this path, and heuresis adds no mitigation for it.
9. **GenerationFrame ≠ analytical lens**: A `GenerationFrame` is a partition for parallel candidate production — a divergence angle, not an analytical perspective. It carries no substrate need, no per-perspective directive, and is never handed off as a framed inquiry object; that machinery belongs to Prothesis (`/frame`).
10. **Vendor-neutral parallelism**: "Generate `∥` over open frames" names a logical topology, not a required tool. A host MAY realize it via isolated parallel agents when available; heuresis's meaning does not depend on that realization, and provenance stays `{User, AI}` — never a host- or vendor-specific tag.
11. **Context-Question Separation**: Output round results (candidates by frame, explored/unexplored frames) as text before presenting via Cognitive Partnership Move (Constitution). The gate itself contains only the essential question — continue (which frames) or stop.
12. **Option-set relay test (Extension classification)**: If AI analysis converges on a single dominant next-frame choice (option-level entropy → 0), present it directly as relay rather than as a gate. Continue/Stop remain genuinely viable under different user judgments about whether the field is wide enough.
13. **Plain emit discipline**: User-facing emit (round presentations, frame maps, convergence traces, gate options) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the frame, the candidate, or the question in their idiom.
14. **Round-local salience bundling**: Each round bundles its own candidates, the frames they came from, and the next-move implication (which frames remain, whether to deepen or stop). Keep adjacent material together so the user can recognize the decision without context-switching; defer earlier rounds' detail to the convergence trace.
15. **Gate integrity** (Safeguard tier): The defined option sets (`FrameSelection`, `ContinuationAnswer`) are presented intact — option injection, deletion, and substitution each violate this invariant. Type-preserving materialization (naming the actual candidate frames inside `Open`/`Continue` while preserving the coproduct) is distinct from mutation.
16. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
