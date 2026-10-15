---
name: ideate
description: "The idea field is empty, narrowed too early, or thin: the user can then see one map from their words and what they name — frames, branches, idea origins, the unexplored — and take it, nothing chosen."
---

# Heuresis Protocol

Resolve an underexpanded candidate field through frame-parallel divergent generation, widening it in width and in depth, without ever eliminating, ranking, or selecting among the candidates it produces. Type: `(CandidateFieldUnderexpanded, User, DIVERGE, IdeationRequest) → DiverseCandidateField`.

## Definition

**Heuresis** (εὕρεσις): the act of finding or discovering — a dialogical act of widening a candidate field that is empty or has prematurely converged, before any selection is made. Divergent and convergent thinking are distinct operations (reviewed in Runco & Acar, 2012), and heuresis sits at the point where the candidate field itself is thin. While the field holds no candidate, heuresis shows an abstract frame map before any concrete idea — AI generation support amplifies fixation on the example already in view (Wadinambiarachchi et al., 2024), an instruction to avoid common examples reduced fixation when the examples were stated abstractly rather than concretely (Ezzat et al., 2020) — carried here, as a transfer, to showing abstract frames first — and ideating before seeing a model's ideas preserves ownership and yields ideas less similar to the model's own (Qin et al., 2025). Generation is frame-parallel and never eliminates, ranks, or scores: selection is a downstream act, out of this protocol's scope. The field grows two ways — a new frame widens it, a branch dug under an open frame or candidate deepens it; both routes reach original ideas and can be taken in sequence (Nijstad et al., 2010) — and every round redraws the whole field as one map. The person takes the field when it serves them; until then the run holds, and a later invocation can resume the field whether or not it was taken.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Heuresis(U) → start(c) → ideate(c, utterances), where c is the fused session context:
  start: the records `reference` names, read → the classification relay →
    Blank: a pass over the frames the request names, if any → the map → gate
    Seeded: a first pass → the map → gate
    Resumed: a pass over the frames the request opens, if any → the earlier field's map → gate
    which gate the map carries — the frame map or a round gate — is "The map"'s
  next utterance u: c' := fuse(c, u) →
    u takes the field, with candidates in it → DiverseCandidateField; nothing u names is read
    the person's own invocation of this protocol → this run's reading ends, holding; the run it
      starts reads u
    a turn that does not bear on the run → the session answers it; no map; the run holds
    otherwise the records `reference` names, read →
      the frames the answer opens — some: a pass over them → the map → gate
                                    none: the map → gate
  no utterance: the gate holds; nothing is taken
-/

/-! ── MORPHISM ──
IdeationRequest
  → DiverseCandidateField           -- the field the person bounded, every candidate under its frame or branch with its origin
requires: candidate_field_underexpanded(U)   -- direct /ideate invocation satisfies it
deficit:  CandidateFieldUnderexpanded         -- activation precondition (Layer 1)
preserves: seed_provenance(U)                 -- every seed and candidate keeps the origin of the material it came from; naming material is adoption, recorded apart; never relabeled
invariant: the person takes the field         -- only their taking closes; a pick, a judgment, a correction, an ending, or other work does not
invariant: frame map first                    -- at a frame map, until the person has chosen frames, no candidate of yours is shown
invariant: Divergence over Selection          -- nothing is eliminated, ranked, scored, or chosen; selection is outside this protocol
invariant: width and depth both widen         -- a new frame or a branch under an open frame or candidate; the map shows each branch's place
invariant: dissent rides the field            -- unaddressed signals, unexplored frames, and your doubts stand before every gate and in the field
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
    the session, or a record outside it. What binds is U-BINDING's. -/
abbrev IdeationRequest (P : Type) := Context P

/-- **Your reads**: the records outside the session — an issue, a document — that this run's turns
    name as material for this field and that the context does not yet hold, or holds only from
    before a change a turn or evidence reports, read by a tool. This run's turns are the bound
    request and later, and, where the request continues a field this protocol drew earlier, that
    field's turns among them; a record mentioned outside them is not material unless the request
    names it. They are read with the bound request or on a turn that bears on the run, whenever they
    were named — one named in a turn that did not bear on the run is read when a later turn comes
    back — and never on the turn that takes the field. A record named only as where the field goes,
    or for other work, is not read. Nothing the person does not name is read, and nothing wider is
    scanned. -/
axiom reference : Context P → List (Evidence P)

/-- **Your reading**: this run's topic. -/
axiom topic : Context P → String

/-- A fragment the request brings before any frame holds it, and where it came from: `person` for
    the person's own fragments. Material a named reference supplied keeps the origin it already
    carries as a tag, or else the origin of the turn it was read from — `external` for a record a
    tool read. Naming the reference is the person's adoption of that material; the adoption is
    recorded apart from the origin and never written into it. -/
structure Seed where
  content : String
  origin  : Origin

/-- `blank`: a topic only, with any frames it names. `seeded`: idea fragments, named material, or
    both. `resumed`: the request continues a field this protocol drew, taken or holding — earlier in
    the context, or carried in material the request names, such as a field exported to an issue,
    whose frames, branches, candidates with their origins, exclusions, parks, and which frames were
    opened carry over as that material records them. Exclusions and parks carried that way cite the
    request that names the material — the person's adoption of it, as `Seed` says — and carry the
    material's own record of the earlier turn, shown as recorded and never as said in this context;
    the redrawn map is that field's map, and no opened frame is reopened. What each opens at the
    start is `targets`. -/
inductive Entry
  | blank
  | seeded (seeds : List Seed)
  | resumed

/-- **Your reading** of the invocation: which entry it is — inferred, never asked, and read on the
    context as it now stands, so a turn of the person's that corrects the relayed reading — "no,
    carry on with yesterday's field" — re-scopes this run's field, as MODE STATE says. What a
    correction keeps of what the earlier reading drew — frames, branches, candidates — is your
    reading of the context: it keeps what belongs to the field the correction names, and the map
    shows that reading. What that turn opens is `targets`. -/
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
    entry, frames the request itself names or the person names at the frame map or at a round,
    shaped into frames, and branches under what the person asked to deepen. On Seeded, at least one,
    seed-anchored and novel, every seed landing under one; on Blank, novel and abstract. Any idea or
    item of material that fits no registered frame registers a frame shaped from its angle. Whether
    the person's words name a registered frame is read here. -/
axiom frames : Context P → List Frame

/-- **Your reading**: a pass has opened the frame — for a field carried in named material, as that
    material records it (`Entry`). -/
axiom Opened : Context P → Frame → Bool

/-- The explored frames: the registered ones a pass opened, so none lies outside the register. -/
def explored (c : Context P) : List Frame := (frames c).filter (Opened c)

/-- A frame the person put out of scope, with the turn in which they did — for one carried in
    named material, the request that names it, as `Entry` says — its branches and candidates go
    with it. -/
structure Exclusion (c : Context P) where
  frame    : Frame
  request  : Cite c
  byPerson : request.src.val = .person

/-- **Your reading** of every exclusion in the person's turns, each citing the turn that made it. An
    exclusion reaches the frame's lineage: every branch under the excluded frame or under one of its
    candidates, at any depth, is among these too, citing the same turn, so none is widened. A
    boundary the person states — "only this area" — reaches particular frames only once the person
    takes that application, by taking the proposal or with the field (`ClosingSupported`); until
    then it stands in `proposedExclusions`. An exclusion stands until the person's later words bring
    the frame back in; bringing it back lifts only the lineage excluded with it, and a branch the
    person excluded by a turn of its own stays excluded, citing that turn. Whether a request to work
    inside an excluded lineage brings it back is read from that turn. An excluded frame is never
    deleted. -/
axiom excluded : (c : Context P) → List (Exclusion c)

/-- **Your reading**: frames you read as outside a boundary the person stated — your proposal
    until the person takes it, as `excluded` says. One the person declines is no longer a proposal
    and is not taken with the field. -/
axiom proposedExclusions : Context P → List Frame

def Excluded (c : Context P) (f : Frame) : Prop := ∃ e ∈ excluded c, e.frame = f

def Unexplored (c : Context P) (f : Frame) : Prop :=
  f ∈ frames c ∧ Opened c f = false ∧ ¬ Excluded c f

/-- A generated idea: raw material for divergence, not a selection-ready alternative. It carries
    no score, rank, or preference. -/
structure Candidate where
  content : String
  frame   : Frame
  origin  : Origin

/-- **Your record**: every candidate of this run's field, under the frame or branch it came from —
    on a Seeded entry's first pass the seeds, each keeping its own origin, and every generated one
    as `assistant`; the items of material the person names for this field — a record once
    `reference` has read it, or material the session already holds, such as an earlier answer of
    yours — under the frames they fit, each keeping the origin it carries or else that of the turn
    it was read from, as `Seed` says, so `external` only for an item a tool read that carries none;
    and an idea the person contributes to this field at any turn, judged from their words — not a
    hypothetical, a quotation, or an idea about other work — under the frame it fits with origin
    `person`. Each lands on the next map the run draws — or, said in the taking turn or in a turn of
    the person's since the map that turn answered, in the field the taking closes; on a frame map,
    items not the person's own stay pending until a frame opens, and a pending item is not yet a
    candidate. Never removed, re-ranked, or relabeled, an excluded frame's included. -/
axiom candidates : Context P → List Candidate

/-- **Your judgment**, remade at each map before a gate from the candidates and signals as they
    stand: the candidate responds to the signal. A candidate in an out-of-scope lineage answers no
    signal for this field. Never stored as a mapping and never a score on the candidate; the field
    holds it as `DiverseCandidateField` says. -/
axiom Responds : Context P → Candidate → Signal → Prop

def Unaddressed (c : Context P) (s : Signal) : Prop :=
  s ∈ signals c ∧ ¬ ∃ x ∈ candidates c, Responds c x s

/-- Something the person themselves set aside for later — a frame or branch they want to return
    to after this run — with the turn in which they said so, or for one carried in named
    material the request that names it, as `Entry` says. -/
structure ParkedFollowUp (c : Context P) where
  frame    : Frame
  note     : Option String
  request  : Cite c
  byPerson : request.src.val = .person

/-- **Your reading** of every deferral in the person's turns, each citing the turn that made it.
    What the cited turn asks is your `supports` reading of it. A request to deepen is not a
    deferral: it opens a branch. A parked frame the person later opens is no longer parked. -/
axiom parked : (c : Context P) → List (ParkedFollowUp c)

/-- **Your judgment**: your doubts about the field or about taking it, each naming what it concerns
    and what it rests on; never a recommendation to continue or to take, and never a rank on a
    candidate. A doubt the person has answered is raised again only on new evidence. -/
axiom dissent : Context P → List String

/-- **Your reading** of the latest answer: the frames the next pass opens — at the frame map, the
    frames selected and any the person named, shaped into frames; at a round, the named unexplored
    frames, a new angle shaped into frames, or a branch under an open frame or candidate the person
    asked to deepen. An excluded frame is never among them. A continue that names nothing takes
    every unexplored frame except one the person parked; the person naming it opens it. On a Seeded
    entry's first pass, the frames the request itself names and at least one derived frame, how many
    being yours; the rest stay unexplored. At a Blank entry's start, the frames the request itself
    names — "angles: pricing and pacing" — and none where it names none. At a Resumed entry's
    resuming step, the frames the request names or asks to deepen — an opened frame it names is
    deepened by a branch under it, never reopened; a request that only continues opens none, and a
    request the earlier field already answered — a gate answer bound as the request by a bare
    invocation — is not applied again, so the field resumes as last shown. A turn that corrects the
    entry opens what the corrected entry's opening would open and what the turn itself names, less
    any frame already opened — a resume with a named deepening opens that branch. Empty when the
    answer opens nothing — a deferral alone, an idea of the person's own, a question, a correction
    of anything but the entry, a pick among candidates, or a continue with nothing left to open. -/
axiom targets : Context P → List Frame

/-- **Your judgment**: the cited turn — the person's latest utterance — takes the field, read from
    the whole turn rather than from a keyword: "this is the field, let's take it", a taking that
    also says what comes next. It takes the field as the map it answered showed it, your proposed
    exclusions on it included, together with what the person's own turns since that map changed —
    the taking turn's included — each as far as its words reach. A turn answering a map with no
    candidate on it takes nothing; where its ideas land is `candidates`. A turn asking for material
    not yet on the map to join first does not yet take the field: it asks for a map not yet shown;
    nor does a turn that chooses frames together with taking — the frames open. Words that end the
    run or turn elsewhere without taking the field do not take it. Where the turn's intent is
    unclear, it takes nothing. A pick among candidates, a judgment on one, or a correction does not
    by itself take the field. -/
axiom ClosingSupported : Context P → Turn P → Unit → Prop

/-- Only the person takes the field. -/
def closeCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := ClosingSupported }

/-- **Your reading**: the person's taking; `open_` unless the latest utterance takes the field. -/
axiom closing : (c : Context P) → Occ (closeCoord (P := P)) c

/-- **Your reading**: the latest utterance is the person's own invocation of this protocol. It
    ends this run's reading, holding; the run it starts reads it and resumes the earlier field
    where the request is read as continuing it, as U-BINDING says — the earlier field is never
    discarded. -/
axiom Invoked : Context P → Prop

/-- **Your judgment**: the latest utterance bears on this run. A turn that only turns to other
    work does not bear on it, and words that end the run without taking the field do not bear on
    it, whatever else the turn says; what else such a turn says — an exclusion, an idea, a park, a
    record named as material — stands in its own words in the context. The session answers it, no
    map is drawn, no pass runs, the run holds, and later turns bear on it only where they come back
    to it; your own reading that the person is done ends nothing. With nothing to take, a taking
    said together with other work or an ending goes with that work or ending. Where a turn taken as
    other work or as ending the run could also be read as the other, as taking the field, or as
    bearing on the run otherwise, the session's answer says briefly how it took it. -/
axiom Reaches : Context P → Prop

/-- Once it has run, the person can look over one map of their idea field — each frame and the
    branches dug under it, every candidate with where it came from, what stays unexplored, and what
    they set out of scope or aside — and take that field forward, with nothing in it chosen or
    ranked; choosing among it is a separate act.
    `DiverseCandidateField`, read from `context`, the context with the taking turn: the topic, every
    candidate with its frame or branch and its origin, the explored frames, the unexplored ones, the
    frames the person put out of scope with their turns cited, the parked follow-ups with their
    citations, the unaddressed signals, your doubts (`dissent`), and the material named but not yet
    in the field. It holds what `ClosingSupported` reads the taking turn as taking; the unaddressed
    signals and your doubts are as the map the person took showed them, with what the person's own
    turns since changed. No pass runs after it, and nothing you form or re-make after it — a fresh
    candidate, a newly inferred exclusion, a signal or doubt read again — is taken.
    Frame-distributed, never scored; complete for whatever unfolds it next, a later /ideate resuming
    from it included. -/
structure DiverseCandidateField (P : Type) where
  context  : Context P
  nonempty : (candidates context).isEmpty = false

inductive Outcome (P : Type)
  | field   (r : DiverseCandidateField P)
  | holding (c : Context P)

/-! ── U-BINDING ──
bind(U) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ chain_ref
Priority: explicit_arg > colocated_expr > prev_user_turn > chain_ref
  /ideate "topic or fragments"               → U = the argument
  /ideate (alone)                            → U = the person's previous message: the one turn that
                                               binds as the request, not a scan for one. Whether it
                                               starts a new topic or resumes the latest field, taken
                                               or holding, is read from the accumulated context
  "give me some ideas ... /ideate"           → U = the text before the trigger
  "using what was just found above, /ideate" → U also carries the named material; it folds in as
                                               seeds under the origin it came with
  "from issue ROO-12's comments, /ideate"    → the named record is read by a tool and folds in the same way
  "/ideate, carry on with that field"        → U continues a field this protocol drew earlier: Resumed
A chain reference never stands in for the topic, except that a resumed field keeps its own topic
wherever it is carried, the material a request names included. An invocation
is read for what it reaches: a new topic starts a new run, and an earlier field stays as it stood,
reachable as named material; a request to continue an earlier field, taken or holding, resumes it.
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it, and each is of this
run's field — its topic, signals, frames, candidates, exclusions, proposals, parks, and doubts. On
a Resumed entry, this run's field is the earlier field it continues, as `Entry` says, with the
person's later turns on it, its signals included; otherwise it holds only what this
run's request and later turns bring, and an earlier field enters only as named material. The map
a round draws is re-read from the context each time, never stored.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A round is one step of a structural recursion over the person's utterances. `relay` is the
classification relay: the entry, its basis, why the field reads thin, and the signals with their
sources. `generate` is one pass: candidates under each frame the pass opens (`targets`), in
parallel over the frames, with the seeds promoted on a Seeded entry's first pass, and no
elimination, ranking, or scoring. On Blank, unless the request names frames, `respond` presents
the map and its gate before any pass; which gate, "The map" says. `session` is the session's
own answer to a turn that does not bear on the run; it stays in the context and opens no pass.
-/

def pass (generate respond : Context P → Response P) (c : Context P) : Context P :=
  let c₁ := c ++ [(generate c).val]
  c₁ ++ [(respond c₁).val]

/-- The records `reference` reads, appended. -/
def receive (c : Context P) : Context P := c ++ (reference c).map (·.val)

/-- The person's taking cites the turn at index `i`. -/
def takenAt (c : Context P) (i : Nat) : Bool :=
  match closing c with
  | .filled _ src _ _ => decide (src.idx = i)
  | .open_ _          => false

/-- The person takes the field with the utterance just fused onto `c`, with candidates in it. -/
def Taken (c : Context P) (u : Utterance P) : Prop :=
  takenAt (fuse c u) c.length = true ∧ (candidates (fuse c u)).isEmpty = false

/-- A turn that bears on the run and takes nothing, or the opening step of a Blank or Resumed
    start: the map where it opens nothing, else a pass over what it opens. -/
def advance (generate respond : Context P → Response P) (c : Context P) : Context P :=
  if (targets c).isEmpty then c ++ [(respond c).val] else pass generate respond c

open Classical in
/-- `respond` presents the map of the whole field and its gate, re-read from the context and never
    stored, as the Protocol section's "The map" describes. -/
def ideate (generate respond session : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    if h : Taken c u then .field ⟨c', h.2⟩
    else if Invoked c' then .holding c
    else if ¬ Reaches c' then ideate generate respond session (c' ++ [(session c').val]) us
    else ideate generate respond session (advance generate respond (receive c')) us

def start (relay generate respond session : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₀ := receive c
  let c₁ := c₀ ++ [(relay c₀).val]
  match entry c₁ with
  | .seeded _ => ideate generate respond session (pass generate respond c₁) us
  | .blank | .resumed => ideate generate respond session (advance generate respond c₁) us

/-! ── LOOP ──
No fixed round count and no quota: nothing is tracked toward a target, and the loop goes on until
the person takes the field or a fresh invocation ends this run's reading. A basis-cited note on
whether recent rounds read as closer to earlier ones may sit before the gate; it describes state
only and never reorders or discourages either answer.
-/

/-! ── CONVERGENCE ──
field: the person's taking, with candidates in the field. The taking
is the completion itself, not a judgment layered on a built object, and it takes the field with the
map's dissent in view. holding is not a closing: no turn of the person's has taken the field, or a
fresh invocation ended this run's reading and the field stays resumable. An ending, a withdrawal,
or other work produces no result and no trace of its own; the context keeps what was offered, put
out of scope, and parked.
Convergence evidence: at DiverseCandidateField, present the trace the Protocol section's "The map"
describes. Demonstrated, not asserted. Nothing is held beyond the context, so nothing needs
cleanup; the parked set's durable record is the host's.
-/

/-! ── TOOL GROUNDING ──
What each operation of this contract does. An interaction with the person is one of two kinds,
and its kind fixes how it continues once its text is presented. A Constitution settles a judgment
through the person's turn. An Extension settles none for the person: it passes on a result its
cited ground fixes, or carries reversible work forward on a judgment the AI states, which stays
the AI's proposal until the person takes it. Beyond the Constitution operations a contract
annotates, whether work goes forward this way or waits for the person's answer is the AI's
judgment in the situation, and work that cannot be undone waits for the authorization it needs.
Work carried forward, on a grant or a stated judgment or as clear work, returns with an account
of how the request was read, what was judged on what basis — naming an alternative set aside
where it may be preferred — and how far the work went.
-/

inductive Interaction | constitution | extension

inductive Continuation | stop | proceed

inductive Annot | sense | observe | track | transform | dispatch | interaction (kind : Interaction)

/-- Every interaction presents its text; a Constitution then stops for the person's turn, and an
    Extension proceeds. -/
def Interaction.realization : Interaction → Continuation
  | .constitution => .stop
  | .extension    => .proceed

inductive Op | bind | readReference | classify | extractSignals | classifyRelay | deriveFrames
             | qframes | generate | present | qround | readAnswer | shapeFrames | park | converge
             | seam

def grounding : Op → Annot × String
  | .bind           => (.sense, "Internal analysis: the invocation utterance and a chain reference it names, as U-BINDING says; nothing unnamed is scanned")
  | .readReference  => (.observe, "Tool read, conditional: the records `reference` names, and nothing else; what it returns enters as an external turn, and the origins the record itself carries are kept")
  | .classify       => (.sense, "Internal analysis: the entry, Blank, Seeded, or Resumed, inferred from the invocation and what it binds, and read on the context as it now stands, a correction of the person's included; zero entry questions")
  | .extractSignals => (.sense, "Internal analysis: signals — concerns, weaknesses, requirements — read from the bound request, named material, and what the person says later, each tagged by its source; never scored or ranked")
  | .classifyRelay  => (.interaction .extension, "the inferred entry and its basis, quoting the utterance fragment where there is one — on a bare invocation, whether it reads as a new topic or a resume — stated as your reading, which the person can correct; why the field reads thin, and the signals with their sources; relay, not a gate")
  | .deriveFrames   => (.sense, "Internal analysis: the generation frames — seed-anchored and novel on Seeded, novel and abstract on Blank; a resumed field's frames and branches carry over")
  | .qframes        => (.interaction .constitution, "the frame map, where \"The map\" makes it the gate; read references/blank-entry.md before presenting")
  | .generate       => (.sense, "Internal generation: parallel over the frames the pass opens; a host may realize it through isolated parallel agents, and the meaning does not depend on that; no elimination, ranking, or scoring")
  | .present        => (.interaction .extension, "the map of the whole field, as \"The map\" describes; precedes the gate")
  | .qround         => (.interaction .constitution, "the round gate — continue or take the field — as \"The map\" describes")
  | .readAnswer     => (.sense, "Internal analysis: the latest utterance read whole with the context — the person's taking if any, whether it is the person's own invocation of this protocol, whether it bears on this run, the frames it opens, any new angle or branch, any deferral, any exclusion or proposal taken, any record it names, any new signal, any idea of their own")
  | .shapeFrames    => (.sense, "Internal analysis: a new angle or a deepening the person named, shaped into frames or branches not already registered before the pass opens them")
  | .park           => (.interaction .extension, "something the person set aside for later acknowledged as parked, quoting their request; declared in the field; its durable record is the host's")
  | .converge       => (.interaction .extension, "DiverseCandidateField — its trace, as \"The map\" describes")
  | .seam           => (.interaction .extension, "after the person takes the field, proceed only to the next move the person declared, an adopted routing policy, or a grant of theirs, citing that source; the field crosses whole, every origin, branch, park, signal, and doubt intact, and the seam never selects, ranks, or trims it; every Constitution gate here and in what comes next fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Candidate-field resolution emergent via session context.
-/

end

end Heuresis
```

## Mode Activation

`/ideate` is user-initiated: an observation that a field looks narrow does not activate it.

## Protocol

### User-facing realization

Present the classification as a short basis-cited relay: the inferred entry, why the field reads thin, and source-tagged signals. Whenever the gate is the frame map, read `references/blank-entry.md` before presenting it; for `Seeded`, read `references/seeded-entry.md` before the first pass.

### The map

Every map is in everyday language and is drawn from the context each time. It shows the whole field: the frames and the branches dug under them, the candidates under each with their origins, the unexplored frames, the frames out of scope with the person's turn quoted — a frame brought back in shown as brought back, citing that turn — your proposed exclusions marked as yours, each by name, what is parked with the person's request quoted (exclusions and parks carried in named material shown as `Entry` says), every signal still unaddressed, and your doubts. Mark every change since the map the person answered: this round's candidates, exclusions and proposals taken, signals changed, readings you re-made, and what a turn that did not bear on the run said about the field. Where the intent of the person's turn was unclear, say in one line how you took it. Material the person named that is not yet on the map — awaiting its read, or on a frame map a frame to open — shows as pending. A request to work inside an excluded lineage that does not bring it back is answered by saying that lineage is out of scope. When the map grows large, compress earlier material to branches and counts, the density yours to judge, while those changes and every proposed exclusion show in full; the taking's trace is never compressed. On a Resumed entry, redraw the earlier field's map — the whole field as last shown, with the person's later turns that bear on it, and the material it compressed still reachable.

Where the person asked about the map, answer it first, from the map, before the gate; nothing in the answer ranks or chooses. A request for your pick or a ranking is answered there too: say that choosing follows the taking, and rank nothing.

While this field holds no candidate — yours or the person's — the gate is the frame map and its selector, abstract frames in the template `references/blank-entry.md` carries; otherwise it is the round gate, so taking is offered only over a field with a candidate in it. Before every round gate, say first what continuing would cost to review and what taking keeps, naming your proposed exclusions that taking would take. Where the person explicitly asks for the field while no candidate exists, say plainly that there is nothing to take yet. Where named material waits on the frame map for a frame to open, the gate says so plainly.

At every round gate, present continue first and "Take this field as it stands" second, rendered in the person's idiom, with symmetric specificity. Continue names its widening target, the frames `targets` would open — unexplored frames other than those the person parked, a new angle, or a branch under whatever the person asks to deepen; when no such frame is left, it says so and asks the person to name a frame, give a new angle, or say what to deepen, naming no frame, candidate, or branch itself. Any novelty or coverage observation, and every doubt, stays before the gate and does not recommend or reorder either answer.

At the taking, show the field's trace: the topic, then the whole map as drawn above with nothing compressed — each frame and branch marked out of scope wherever it is excluded, and otherwise explored or unexplored — and with it what only the trace carries: material named but not yet in the field, listed as named and not in the field; each exclusion taken with the field, shown as your proposal the person took; and every change since the map the person answered, marked.

## Known Limitations

- `Unexplored` covers derived frames, not every conceivable angle.
- A chain reference gives up the blank path's independent-ideation-first benefit; no mitigation is claimed.
- Signals are read from what the person said and the material they named; a concern never put into words is not among them.
- The rendered field carries the final unaddressed snapshot, not the full signal take/discard ledger; that ledger remains recoverable only from the round presentations the session context holds.

## Rules

- **User-initiated, zero entry questions**: `/ideate` activates only on direct invocation (Layer 1); `Entry` (Blank, Seeded, or Resumed) is inferred from the request as U-BINDING binds it — never asked. The classification is a relay, not a gate.
- **Frame-first ownership**: Whenever the gate is the frame map, read `references/blank-entry.md` before presenting abstract frames or any concrete candidate. Preserve every candidate's origin thereafter; an idea the person contributes to this field at any turn is their own candidate, under the frame it fits.
- **The person takes the field**: Only the person's own latest turn takes the field, as `ClosingSupported` reads it, and only with candidates in the field. A pick among candidates, a judgment on one, or a correction does not take the field; it is read for the frames it opens and the ideas and signals it adds, and the gate stays. A turn that does not bear on the run is met as `Reaches` says.
- **Out of scope, never erased**: A frame the person puts out of scope stays in the field with its branches and candidates, citing their turn, and is never widened until their later words bring it back in; applying a boundary they stated to particular frames is your proposal until they take it — both as `excluded` says.
- **Named material only**: heuresis reads the request, material the person explicitly names at invocation or at any later turn — a prior protocol's output in the session, or a record outside it such as an issue or a document, read by a tool — and what the person says as the run goes on. The request binds as U-BINDING says. Unnamed material — the wider session, codebase, or rules — never enters the field, and hidden decision coordinates are never reverse-traced from externalized substrate; reading what the person means, a bare invocation included, draws on the accumulated context, as U-BINDING says, and the run's own earlier turns about the field, and an earlier field this protocol drew that the invocation resumes, are the field's context.
- **Chain semantics**: Named material folds in as seeds, each keeping the origin tag it carries or else the origin of the turn it was read from — `external` for a record a tool read; naming it is the person's adoption, recorded apart. When and under which frame each item lands is `candidates`; an invocation is read for what it reaches, as U-BINDING says. The ownership trade-off is declared under Known Limitations.
- **Round composition**: Compose each round so the reader can act on it without reassembling it — everyday language rather than this file's formal vocabulary, the judgment set beside the evidence it rests on together with the differential implication that matters for the next move, and analytical context laid out before a gate rather than inside it, so the gate carries the question and each option's differential implication. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged.
- **Width and depth both widen**: A request for more on an open frame or on one candidate opens a branch under it, registered with its parent, and the next pass fills it; nothing is ranked or chosen. Only what the person themselves sets aside for later parks, citing their turn, and is carried in the field.
- **One map every round**: Before each gate the whole field is redrawn from the context; what it shows, what sits before the gate, and the gate's options and their order are as "The map" says.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
