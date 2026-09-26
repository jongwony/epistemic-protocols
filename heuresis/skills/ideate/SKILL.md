---
name: ideate
description: "Widen an empty or prematurely converged idea field in width and depth; reads your words and what you name. Type: (CandidateFieldUnderexpanded, User, DIVERGE, IdeationRequest) → DiverseCandidateField"
---

# Heuresis Protocol

Resolve an underexpanded candidate field through frame-parallel divergent generation, widening it in width and in depth, without ever eliminating, ranking, or selecting among the candidates it produces. Type: `(CandidateFieldUnderexpanded, User, DIVERGE, IdeationRequest) → DiverseCandidateField`.

## Definition

**Heuresis** (εὕρεσις): the act of finding or discovering — a dialogical act of widening a candidate field that is empty or has prematurely converged, before any selection is made. Divergent and convergent thinking are distinct cognitive operations (Runco & Acar, 2012), and no protocol in this catalog carries a typed guarantee to generate the object-level alternative set itself — heuresis sits at the point where the candidate field itself is thin. On a blank entry, heuresis opens an abstract frame map before showing any concrete idea — early concrete examples measurably narrow independent generation (Wadinambiarachchi et al., 2024), and ideating before seeing a model's ideas preserves ownership and yields ideas less similar to the model's own (Qin et al., 2025). Generation is frame-parallel and never eliminates, ranks, or scores: selection is a downstream act, out of this protocol's scope. The field grows two ways — a new frame widens it, a branch dug under an open frame or candidate deepens it — and every round redraws the whole field as one map, so where the person stops is a checkpoint a later run can resume from.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract. A
`theorem` line inside a doc comment states a consequence the contract already has; it is proved
outside this block and asks nothing further of you.
-/

/-! ── FLOW ──
Heuresis(U) → start(c) → ideate(c, utterances), where c is the fused session context:
  start: a record outside the session the request names is read → the classification relay →
    Blank: the frame map, abstract frames and no concrete candidate → gate
    Seeded: a first pass → the map → gate
  next utterance u: c' := fuse(c, u) → the person's closing, read from c' —
    stop: candidates in c' → DiverseCandidateField | none → EarlyExit
    withdraw → withdrawn · a protocol they name → routed
    none: the frames the answer opens — some: a pass over them → the map → gate
                                        none: the gate again
  no utterance: the gate holds; nothing is assembled
-/

/-! ── MORPHISM ──
IdeationRequest
  → DiverseCandidateField           -- the field the person bounded, every candidate under its frame or branch with its origin
requires: candidate_field_underexpanded(U)   -- direct /ideate invocation satisfies it
deficit:  CandidateFieldUnderexpanded         -- activation precondition (Layer 1)
preserves: seed_provenance(U)                 -- every seed and candidate keeps the origin of the material it came from; naming material is adoption, recorded apart; never relabeled
invariant: the person closes                  -- only their Stop, withdrawal, or a protocol they name ends the run; a pick among candidates, a judgment, or a correction does not
invariant: frame map first                    -- on a Blank entry no concrete candidate precedes the person's choice of frames
invariant: Divergence over Selection          -- nothing is eliminated, ranked, scored, or chosen; selection is outside this protocol
invariant: width and depth both widen         -- a new frame or a branch under an open frame or candidate; the map shows each branch's place
invariant: dissent rides the field            -- unaddressed signals, unexplored frames, and your contrary grounds stand before every gate and in the result
-/

namespace Heuresis

/-! ── GROUND ──
The session primitive this contract reads.
-/

inductive Origin | person | assistant | external | peer | injected | unknown
  deriving DecidableEq

/-- A turn is who sent it and what it says. What the turn does — a statement, a request, an
    instruction, a report of what was observed — is read from its content, never stored here. -/
structure Turn (P : Type) where
  origin  : Origin
  content : P

abbrev Context (P : Type) := List (Turn P)

/-- An origin that may ground: the harness says who sent a turn, and that is all this admits on.
    The assistant's own turns, injected text, and turns of unknown origin ground nothing. -/
def Grounding := {o : Origin // o ≠ .assistant ∧ o ≠ .injected ∧ o ≠ .unknown}

/-- Any turn a person sent, whatever it does. -/
def Utterance (P : Type) := {e : Turn P // e.origin = .person}
def Response (P : Type) := {e : Turn P // e.origin = .assistant}
/-- A turn from outside the conversation: what a tool or the environment returned, or a peer's
    report. A person's account of what they observed is an utterance, read as such. -/
def Evidence (P : Type) := {e : Turn P // e.origin = .external ∨ e.origin = .peer}

def fuse {P : Type} (c : Context P) (u : Utterance P) : Context P := c ++ [u.val]

/-- One turn of the context, with the origin it grounds on. -/
structure Cite {P : Type} (c : Context P) where
  idx : Nat
  lt  : idx < c.length
  src : Grounding
  ok  : (c[idx]'lt).origin = src.val

/-- `admits` reads only who sent the cited turn; `supports` is the model's reading of what that
    turn says, including what it does — a statement, a request, a report of an observation. -/
structure Coord (P A : Type) where
  admits   : Grounding → Prop
  supports : Context P → Turn P → A → Prop

/-- `open_` may carry a candidate citation whose support is still short. -/
inductive Occ {P A : Type} (q : Coord P A) (c : Context P)
  | open_  (candidate : Option (Cite c))
  | filled (a : A) (src : Cite c) (allowed : q.admits src.src)
      (supported : q.supports c (c[src.idx]'src.lt) a)

/-!
theorem fuse_extends {P : Type} (c : Context P) (u : Utterance P) :
    ∃ t, fuse c u = c ++ t

theorem cited_not_assistant {P : Type} {c : Context P} (s : Cite c) :
    (c[s.idx]'s.lt).origin ≠ .assistant

theorem cited_not_injected {P : Type} {c : Context P} (s : Cite c) :
    (c[s.idx]'s.lt).origin ≠ .injected
-/

/-- The same turn, cited from a longer context; what it supports is judged again against the
    context that now stands. -/
def Cite.lift {P : Type} {c : Context P} (s : Cite c) (t : Context P) : Cite (c ++ t) :=
  { idx := s.idx
    lt := by have := s.lt; simp; omega
    src := s.src
    ok := by rw [List.getElem_append_left s.lt]; exact s.ok }

/-! ── TYPES ── -/

noncomputable section

variable {P : Type}

/-- `U`, `IdeationRequest`: the invocation utterance, read as it was said — a topic, optional idea
    fragments, and optionally a chain reference that names material: a prior protocol's output in
    the session, or a record outside it. A bare invocation binds the person's immediately
    preceding message as the utterance. -/
abbrev IdeationRequest (P : Type) := Context P

/-- **Your reads** before the relay: when the bound request names a record outside the session —
    an issue, a document — that record, read by a tool. Nothing the request does not name is read,
    and nothing wider is scanned. Empty when it names none. -/
axiom reference : Context P → List (Evidence P)

/-- **Your reading** of the bound request: its topic. -/
axiom topic : Context P → String

/-- A fragment the request brings before any frame holds it, and where it came from: `person` for
    the person's own fragments. Material a named reference supplied keeps the origin it already
    carries as a tag, or else the origin of the turn it was read from — `external` for a record a
    tool read. Naming the reference is the person's adoption of that material; the adoption is
    recorded apart from the origin and never written into it. -/
structure Seed where
  content : String
  origin  : Origin

/-- `blank`: a topic only. `seeded`: idea fragments, named material, or both. The two take
    different paths: the frame map first, or a first pass. -/
inductive Entry
  | blank
  | seeded (seeds : List Seed)

/-- **Your reading** of the bound request: which entry it is — inferred, never asked. The
    classification relay states it with its basis, why the field reads thin, and the signals. -/
axiom entry : Context P → Entry

inductive SignalSource | utterance | chain

/-- A concern, weakness, or requirement the person holds, and whether it came from their words or
    from named material. Never a quality score, an elimination reason, or a rank. -/
structure Signal where
  content : String
  source  : SignalSource

/-- **Your reading**, from the context as it now stands: the concerns the bound request and named
    material carry, and any the person voiced later in the run — a constraint added at a gate is a
    signal from then on. Nothing is fixed at entry, and none is dropped while the person's words
    still hold it. -/
axiom signals : Context P → List Signal

/-- A partition for parallel generation: a frame, or a branch dug under an open frame or under a
    candidate, `parent` naming that frame's label or that candidate's content. It organizes
    divergence only and is never handed off as a framed inquiry. -/
structure Frame where
  label  : String
  angle  : String
  parent : Option String

/-- **Your record**, read from the context: the frames and branches registered — derived from the
    entry, frames the person named at the frame map or at a round shaped into frames, and branches
    under what the person asked to deepen. On Seeded, at least one, seed-anchored and novel, every
    seed landing under one; on Blank, novel and abstract. When the request chains a field this
    protocol assembled, that field's frames and branches carry over as it stood at its Stop.
    Whether the person's words name a registered frame is read here. -/
axiom frames : Context P → List Frame

/-- **Your reading**: a pass has opened the frame. -/
axiom Opened : Context P → Frame → Bool

/-- The explored frames: the registered ones a pass opened, so none lies outside the register. -/
def explored (c : Context P) : List Frame := (frames c).filter (Opened c)

def Unexplored (c : Context P) (f : Frame) : Prop := f ∈ frames c ∧ Opened c f = false

/-- A generated idea: raw material for divergence, not a selection-ready alternative. It carries
    no score, rank, or preference. -/
structure Candidate where
  content : String
  frame   : Frame
  origin  : Origin

/-- **Your record**: every candidate the passes produced, under the frame or branch it came from —
    on a Seeded entry's first pass the seeds, each keeping its own origin, and every generated one
    as `assistant`; a chained field's candidates under their own frames and origins. Never
    removed, re-ranked, or relabeled. -/
axiom candidates : Context P → List Candidate

/-- **Your judgment**, remade at each presentation from the candidates and signals as they stand:
    the candidate responds to the signal. Never stored as a mapping and never a score on the
    candidate. Once the person stops, it stands as the presentation their Stop answered showed
    it; no reading after the Stop changes what they closed on. -/
axiom Responds : Context P → Candidate → Signal → Prop

def Unaddressed (c : Context P) (s : Signal) : Prop :=
  s ∈ signals c ∧ ¬ ∃ x ∈ candidates c, Responds c x s

/-- Something the person themselves set aside for later — a frame or branch they want to return
    to after this run — with the turn in which they said so. -/
structure ParkedFollowUp (c : Context P) where
  frame    : Frame
  note     : Option String
  request  : Cite c
  byPerson : request.src.val = .person

/-- **Your reading** of every deferral in the person's turns, each citing the turn that made it and
    relayed with the request quoted. What the cited turn asks is your `supports` reading of it. A
    request to deepen is not a deferral: it opens a branch. -/
axiom parked : (c : Context P) → List (ParkedFollowUp c)

/-- **Your judgment**: your grounds against stopping here or against the field as it stands — a
    direction left unexplored that the topic points to, a signal no candidate answers, a branch
    thinner than its siblings. Shown before every gate; never a recommendation to continue or to
    stop, and never a rank on a candidate. -/
axiom dissent : Context P → List String

/-- **Your reading** of the latest answer: the frames the next pass opens — at the frame map, the
    frames selected and any the person named, shaped into frames; at a round, the named unexplored
    frames, a new angle shaped into frames, or a branch under an open frame or candidate the
    person asked to deepen. A continue that names nothing takes every unexplored frame. On a
    Seeded entry's first pass, how many derived frames to open is yours; the rest stay unexplored
    and show as such. Empty when the answer opens nothing — a deferral alone, a question, a
    correction, a pick among candidates, or a continue with nothing left to open. -/
axiom targets : Context P → List Frame

/-- How the person ends the run. -/
inductive Closing
  /-- stop here: the field closes on what the map shows -/
  | stop
  /-- drop the ideation: nothing is assembled -/
  | withdraw
  /-- go on to the protocol the person names -/
  | route (target : String)

/-- **Your judgment**: the cited turn closes the run this way, read against the context as it now
    stands. A pick among candidates, a judgment on one, or a correction does not by itself take the
    field; a stop is said of the field. -/
axiom ClosingSupported : Context P → Turn P → Closing → Prop

/-- Only the person closes. -/
def closeCoord : Coord P Closing :=
  { admits := (·.val = .person), supports := ClosingSupported }

/-- **Your reading**: the person's closing; `open_` until one reaches it. -/
axiom closing : (c : Context P) → Occ (closeCoord (P := P)) c

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- `DiverseCandidateField`, read from `context`: the topic, every candidate with its frame or
    branch and its origin, the explored frames, the unexplored ones, the parked follow-ups with
    their citations, the unaddressed signals, and your contrary grounds (`dissent`).
    Frame-distributed, never scored; complete for whatever unfolds it next, a later /ideate
    resuming from it included. -/
structure DiverseCandidateField (P : Type) where
  context  : Context P
  nonempty : (candidates context).isEmpty = false

/-- `EarlyExit`: a Stop while no candidate exists, read from `context` — the frames offered, the
    parked follow-ups, every signal, since no candidate answered any, and your contrary grounds. -/
structure EarlyExit (P : Type) where
  context : Context P
  empty   : (candidates context).isEmpty = true

inductive Outcome (P : Type)
  | field     (r : DiverseCandidateField P)
  | early     (r : EarlyExit P)
  /-- the person dropped the ideation: nothing is assembled -/
  | withdrawn (c : Context P)
  /-- the person named another protocol: proceed to it, citing their words -/
  | routed    (target : String) (c : Context P)
  | holding   (c : Context P)

/-! ── U-BINDING ──
bind(U) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ chain_ref
Priority: explicit_arg > colocated_expr > prev_user_turn > chain_ref
  /ideate "topic or fragments"               → U = the argument
  /ideate (alone)                            → U = the person's previous message; one turn, not a scan
  "give me some ideas ... /ideate"           → U = the text before the trigger
  "using what /inquire just found, /ideate"  → U also carries the named material; it folds in as
                                               seeds under the origin it came with
  "from issue ROO-12's comments, /ideate"    → the named record is read by a tool and folds in the same way
A chain reference never stands in for the topic.
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it. The map a round
draws is re-read from the context each time, never stored.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A round is one step of a structural recursion over the person's utterances. `relay` is the
classification relay: the entry, its basis, why the field reads thin, and the signals with their
sources. `generate` is one pass: candidates under each frame the pass opens (`targets`), in
parallel over the frames, with the seeds promoted on a Seeded entry's first pass, and no
elimination, ranking, or scoring. On Blank, `respond` first presents the frame map and the gate
before any pass.
-/

def pass (generate respond : Context P → Response P) (c : Context P) : Context P :=
  let c₁ := c ++ [(generate c).val]
  c₁ ++ [(respond c₁).val]

/-- The person's Stop closes the field on the context as it then stands. -/
def assemble (c : Context P) : Outcome P :=
  match h : (candidates c).isEmpty with
  | true  => .early ⟨c, h⟩
  | false => .field ⟨c, h⟩

/-- `respond` presents the map and ends at the gate. Every round, one map of the whole field: the
    frames and the branches under them, the candidates under each with their origins, the
    unexplored frames, what is parked, every signal still unaddressed, and your contrary grounds —
    with what this round added marked. The map is re-read from the context, never stored; when it
    grows large it compresses to branches and counts while this round's additions show in full,
    the density yours to judge. Then what continuing would cost to review and what stopping keeps,
    and the gate: at a round, continue first and stop second; on a Blank entry's first
    presentation, the frame map and its selector, before any candidate. -/
def ideate (generate respond : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    match filledValue (closing c') with
    | some .stop      => assemble c'
    | some .withdraw  => .withdrawn c'
    | some (.route t) => .routed t c'
    | none =>
      if (targets c').isEmpty then ideate generate respond (c' ++ [(respond c').val]) us
      else ideate generate respond (pass generate respond c') us

def start (relay generate respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₀ := c ++ (reference c).map (·.val)
  let c₁ := c₀ ++ [(relay c₀).val]
  match entry c₁ with
  | .blank    => ideate generate respond (c₁ ++ [(respond c₁).val]) us
  | .seeded _ => ideate generate respond (pass generate respond c₁) us

/-! ── LOOP ──
No fixed round count and no quota: nothing is tracked toward a target, and the loop goes on until
the person closes it. A basis-cited note on whether recent rounds read as closer to earlier ones
may sit before the gate; it describes state only and never reorders or discourages either answer.
-/

/-!
Silence assembles nothing.
theorem silence (generate respond : Context P → Response P) (c : Context P) :
    ideate generate respond c [] = .holding c

On a Blank entry the frame map comes before any candidate.
theorem blank_frame_map_first (relay generate respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P))
    (h : entry (c ++ (reference c).map (·.val) ++ [(relay (c ++ (reference c).map (·.val))).val])
      = .blank) :
    start relay generate respond c us =
      ideate generate respond
        (c ++ (reference c).map (·.val) ++ [(relay (c ++ (reference c).map (·.val))).val] ++
          [(respond (c ++ (reference c).map (·.val) ++
            [(relay (c ++ (reference c).map (·.val))).val])).val]) us

An answer that closes nothing and opens nothing runs no pass: the gate is presented again.
theorem no_empty_pass (generate respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (hk : filledValue (closing (fuse c u)) = none)
    (ht : (targets (fuse c u)).isEmpty = true) :
    ideate generate respond c (u :: us) =
      ideate generate respond (fuse c u ++ [(respond (fuse c u)).val]) us

Every closing rests on a turn the person sent.
theorem closed_by_person (c : Context P) (k : Closing) (h : filledValue (closing c) = some k) :
    ∃ s : Cite c, s.src.val = .person ∧ (c[s.idx]'s.lt).origin = .person

Every parked follow-up cites a turn the person sent.
theorem parked_by_person (c : Context P) (p : ParkedFollowUp c) :
    (c[p.request.idx]'p.request.lt).origin = .person

No explored frame lies outside the register, and none is also unexplored.
theorem explored_registered {c : Context P} {f : Frame} (h : f ∈ explored c) : f ∈ frames c

theorem explored_not_unexplored {c : Context P} {f : Frame} (h : f ∈ explored c) :
    ¬ Unexplored c f
-/

/-! ── CONVERGENCE ──
field: the person's Stop with candidates; early: their Stop with none; withdrawn: they dropped the
ideation; routed: they named the next protocol. Their Stop is the completion itself, not a judgment
layered on a built object, and it takes the field with the map's dissent in view.
Convergence evidence: at DiverseCandidateField, present the trace — the topic, then the map: every
registered frame and its branches, each marked explored or unexplored, with every candidate under
the frame it sits in and its origin, the parked follow-ups with the requests quoted, the unaddressed signals, and your contrary grounds; at
EarlyExit, the frames offered, the parked follow-ups, every signal, and your contrary grounds.
Demonstrated, not asserted. Nothing is held beyond the context, so nothing needs cleanup; the
parked set's durable record is the host's after the protocol ends.
-/

/-!
A field always carries a candidate.
theorem field_has_candidates (r : DiverseCandidateField P) : candidates r.context ≠ []

At an early exit every signal is unaddressed.
theorem early_all_unaddressed (r : EarlyExit P) (s : Signal) (hs : s ∈ signals r.context) :
    Unaddressed r.context s
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | bind | readReference | classify | extractSignals | classifyRelay | deriveFrames
             | qframes | generate | present | qround | readAnswer | shapeFrames | park | converge
             | seam

def grounding : Op → Annot × String
  | .bind           => (.sense, "Internal analysis: the invocation utterance and a chain reference it names; nothing unnamed is scanned")
  | .readReference  => (.observe, "Tool read, conditional: fires only when the bound request names a record outside the session — that record and nothing else; what it returns enters with its external origin")
  | .classify       => (.sense, "Internal analysis: the entry, Blank or Seeded, inferred from the bound request; zero entry questions")
  | .extractSignals => (.sense, "Internal analysis: signals — concerns, weaknesses, requirements — read from the bound request, named material, and what the person says later, each tagged by its source; never scored or ranked")
  | .classifyRelay  => (.extension, "TextPresent+Proceed: the inferred entry and its basis, quoting the utterance fragment, why the field reads thin, and the signals with their sources; relay, not a gate")
  | .deriveFrames   => (.sense, "Internal analysis: the generation frames — seed-anchored and novel on Seeded, novel and abstract on Blank; a chained field's frames and branches carry over")
  | .qframes        => (.constitution, "present: Blank only — the frame map, multi-select, before any concrete candidate, with the Stop path and room for a frame the person names; read references/blank-entry.md before presenting")
  | .generate       => (.sense, "Internal generation: parallel over the frames the pass opens; a host may realize it through isolated parallel agents, and the meaning does not depend on that; no elimination, ranking, or scoring")
  | .present        => (.extension, "TextPresent+Proceed: the map of the whole field with this round's additions marked, the unaddressed signals, your contrary grounds, what continuing would cost to review and what stopping keeps; precedes the gate")
  | .qround         => (.constitution, "present: every round, continue first and stop second at every presentation; continue opens unexplored frames, a new angle, or a branch under what the person asks to deepen; an answer that opens nothing presents the gate again")
  | .readAnswer     => (.sense, "Internal analysis: the latest utterance read whole with the context — the person's closing if any, the frames it opens, any new angle or branch, any deferral, any new signal")
  | .shapeFrames    => (.sense, "Internal analysis: a new angle or a deepening the person named, shaped into frames or branches not already registered before the pass opens them")
  | .park           => (.extension, "TextPresent+Proceed: something the person set aside for later acknowledged as parked, quoting their request; declared at either terminal; its durable record is the host's after the protocol ends")
  | .converge       => (.extension, "TextPresent+Proceed: DiverseCandidateField — the topic and the map, every registered frame and branch marked explored or unexplored with every candidate under it and its origin, the parked follow-ups, the unaddressed signals, your contrary grounds; EarlyExit — the frames offered, the parked follow-ups, every signal, your contrary grounds")
  | .seam           => (.extension, "TextPresent+Proceed: after the person's Stop, at either terminal, a user-declared chain naming the next protocol settles the next move; proceed to it citing that source. A route the person names at a gate is the routed outcome itself. This protocol declares no wired outbound edge. The assembled terminal crosses whole, every origin, branch, park, signal, and contrary ground intact, and the seam never selects, ranks, or trims; every Constitution gate inside this protocol and the next fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Candidate-field resolution emergent via session context.
-/

end

end Heuresis
```

## Mode Activation

`/ideate` is user-initiated: an observation that a field looks narrow does not activate it. Selection and recommendation wait until the person's Stop produces `DiverseCandidateField` or `EarlyExit`.

## Protocol

### User-facing realization

Present the classification as a short basis-cited relay: the inferred entry, why the field reads thin, and source-tagged signals. For `Blank`, read `references/blank-entry.md` before presenting abstract frames and the pre-generation Stop path; for `Seeded`, read `references/seeded-entry.md` before the first pass. When named material supplied seeds or a chained field, also read `references/chain-reference.md` after classification and before the first pass.

Before every gate, present one map of the whole field — frames and the branches dug under them, candidates with their origins, unexplored frames, parked follow-ups, every signal still unaddressed, and your contrary grounds — with this round's additions marked. State the extra review load and what Stop will keep. At the Blank frame map the gate is the frame selector `references/blank-entry.md` carries. At every round gate, present continue first and stop second with symmetric specificity: continue opens unexplored frames, a new angle, or a branch under whatever the person asks to deepen; an answer that opens nothing presents the question again. Render Stop as `DiverseCandidateField` only when candidates exist and otherwise as `EarlyExit`.

Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, material belongs to another round or trace, or phase order determines placement around a gate.

## Known Limitations

- `unexplored_frames` covers derived frames, not every conceivable angle.
- A chain reference gives up the blank path's independent-ideation-first benefit; no mitigation is claimed.
- Signals are read from what the person said and the material they named; a concern never put into words is not among them.
- The rendered field carries the final unaddressed snapshot, not the full signal take/discard ledger; that ledger remains recoverable only from the round presentations the session context holds.

## Rules

- **User-initiated, zero entry questions**: `/ideate` activates only on direct invocation (Layer 1); `Entry` (Blank vs. Seeded) is inferred from the request alone — never asked. The classification is a relay, not a gate.
- **Frame-first ownership**: On `Blank`, read `references/blank-entry.md` before presenting abstract frames or any concrete candidate. Preserve every candidate's origin thereafter.
- **The person closes**: Stop, withdrawal, or a protocol the person names ends the run, and only the person's own turn does. A pick among candidates, a judgment on one, or a correction does not take the field; it is read for the frames it opens and the signals it adds, and the gate stays. Stop returns `DiverseCandidateField` only with candidates and otherwise the fully declared `EarlyExit`, and it closes on what the map it answered showed.
- **Named material only**: heuresis reads the request, material the person explicitly names — a prior protocol's output in the session, or a record outside it such as an issue or a document, read by a tool — and what the person says as the run goes on. A bare invocation binds the immediately preceding user message as the request (a one-turn U-BINDING rule, not a session scan). It never scans unnamed material — the wider session, codebase, or rules — and never reverse-traces hidden decision coordinates from externalized substrate; that is `/elicit`'s territory.
- **Chain semantics**: Named material folds in as seeds, each keeping the origin tag it carries or else the origin of the turn it was read from — `external` for a record a tool read; naming it is the person's adoption, recorded apart. A chained field this protocol assembled resumes: its frames, branches, and candidates carry over as the map stood at its Stop. Read `references/chain-reference.md` after classification and before the first pass; the ownership trade-off remains declared under Known Limitations.
- **Round composition**: Compose each round so the reader can act on it without reassembling it — everyday language rather than this file's formal vocabulary, the judgment set beside the evidence it rests on together with the differential implication that matters for the next move, and analytical context laid out before a gate rather than inside it, so the gate carries the question and each option's differential implication. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged, when some of what is in view belongs to a later round or a trace rather than this one, or when this protocol's own phases bear on where a sentence sits relative to a gate.
- **Width and depth both widen**: A request for more on an open frame or on one candidate opens a branch under it, registered with its parent, and the next pass fills it; nothing is ranked or chosen. Only what the person themselves sets aside for later parks, citing their turn, and is declared at either terminal.
- **One map every round**: The whole field is redrawn from the context before each gate, this round's additions marked; a large map compresses to branches and counts while the additions show in full.
- **Decision delta**: Before every gate, surface unaddressed signals, your contrary grounds, the explored/unexplored directional contrast, continuing's review cost, and what stopping keeps. Continue names its widening target and Stop names its live terminal.
- **Neutral option order**: At every round gate, Continue is always first and Stop second, with symmetric specificity. Any novelty or coverage observation, and every contrary ground, stays basis-cited pre-gate state and does not recommend or reorder either answer.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
