---
name: ideate
description: "Widen an empty or prematurely converged idea field; reads only the invocation. Type: (CandidateFieldUnderexpanded, User, DIVERGE, IdeationRequest) → DiverseCandidateField"
---

# Heuresis Protocol

Resolve an underexpanded candidate field through frame-parallel divergent generation, without ever eliminating, ranking, or selecting among the candidates it produces. Type: `(CandidateFieldUnderexpanded, User, DIVERGE, IdeationRequest) → DiverseCandidateField`.

## Definition

**Heuresis** (εὕρεσις): the act of finding or discovering — a dialogical act of widening a candidate field that is empty or has prematurely converged, before any selection is made. Divergent and convergent thinking are distinct cognitive operations (Runco & Acar, 2012), and no protocol in this catalog carries a typed guarantee to generate the object-level alternative set itself — heuresis sits at the point where the candidate field itself is thin. On a blank entry, heuresis opens an abstract frame map before showing any concrete idea — early concrete examples measurably narrow independent generation (Wadinambiarachchi et al., 2024), and ideating before seeing material preserves ownership and diversity that seeing it first does not (Qin et al., 2025). Generation is frame-parallel and never eliminates, ranks, or scores: selection is a downstream act, out of this protocol's scope.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written.
Every `opaque` declaration is a judgment that is yours to make from the material in front of
you; its doc comment says what you judge there, and nothing in this block decides it for you.
Every `def`, `inductive`, and `structure` is fixed by the contract. A `theorem` line inside a
doc comment states a consequence the contract already has; it is proved outside this block
and asks nothing further of you.
-/

/-! ── FLOW ──
Heuresis(U) → ideate(c, utterances), where c is the fused session context:
  Phase 0: bind U → classify the entry and extract the signals, silently → the classification
    relay (the entry, its basis, the signals with their sources); it yields no turn
  Blank: the frame map, abstract frames and no concrete candidate → Qframes → Stop
  Seeded: a pass over every derived frame, the seeds promoted under their own origin →
    the round → Qround → Stop
  next utterance u: c' := fuse(c, u) → verdict(c') →
    stop: candidates in c' → DiverseCandidateField | none → EarlyExit
    cont: the frames the answer opens (targets c') —
      some: a pass over them → the round → Qround
      none (a park alone, a question, a Continue with nothing left to open): the gate again
  no utterance: the gate holds; nothing is assembled
A request for more on a frame already open parks: it is read from the context, relayed, and
declared at either terminal. It never reopens the frame; depth belongs to a later invocation
that chains on the assembled field.
-/

/-! ── MORPHISM ──
IdeationRequest
  → bind(utterance)              -- the invocation utterance and a chain reference it names; nothing wider
  → classify_entry(utterance)    -- Blank or Seeded(seeds); inferred and relayed, never asked
  → derive_frames(entry)         -- the generation frames later passes open
  → select_frames(frames)        -- Blank only: the frame map before any concrete candidate (Constitution)
  → generate(∥ open frames)      -- candidates under each frame the pass opens; no elimination, ranking, or scoring
  → present(round)               -- candidates by frame, explored against unexplored, parked, unaddressed signals
  → continue_or_stop(round)      -- the person's answer, fused whole; a request for depth parks
  → assemble(field)              -- read from the context at the person's Stop, nothing dropped
  → DiverseCandidateField
requires: candidate_field_underexpanded(U)   -- runtime checkpoint (Phase 0); direct /ideate invocation satisfies it
deficit:  CandidateFieldUnderexpanded         -- activation precondition (Layer 1)
preserves: seed_provenance(U)                 -- every seed and candidate keeps the origin of the material it came from; never relabeled
invariant: Divergence over Selection          -- generation never eliminates, ranks, or converges; selection is outside this protocol
-/

namespace Heuresis

/-! ── GROUND ──
The session primitive this contract reads.
-/

inductive Origin | person | assistant | external | peer | injected | unknown
inductive Form | statement | observation | request | reasoning | summary | instruction
inductive Basis | utterance | testimony | observation | report
  deriving DecidableEq

structure Turn (P : Type) where
  origin  : Origin
  form    : Form
  content : P

abbrev Context (P : Type) := List (Turn P)

/-- What a turn may ground directly: eligibility, not truth or instruction priority. -/
def Turn.basis {P : Type} (e : Turn P) : Option Basis :=
  match e.origin, e.form with
  | .person, .statement     => some .utterance
  | .person, .observation   => some .testimony
  | .external, .observation => some .observation
  | .peer, .statement       => some .report
  | _, _                    => none

/-- Any turn a person sent, whatever its form; the form decides what it may ground
    (`Turn.basis`). -/
def Utterance (P : Type) := {e : Turn P // e.origin = .person}
def Response (P : Type) := {e : Turn P // e.origin = .assistant}
def Evidence (P : Type) := {e : Turn P //
  e.basis = some .observation ∨ e.basis = some .report ∨ e.basis = some .testimony}

def fuse {P : Type} (c : Context P) (u : Utterance P) : Context P := c ++ [u.val]

structure Cite {P : Type} (c : Context P) where
  idx  : Nat
  lt   : idx < c.length
  kind : Basis
  ok   : (c[idx]'lt).basis = some kind

/-- `supports` is the model's reading. -/
structure Coord (P A : Type) where
  admits   : Basis → Prop
  supports : Context P → Turn P → A → Prop

/-- `open_` may carry a candidate citation whose support is still short. -/
inductive Occ {P A : Type} (q : Coord P A) (c : Context P)
  | open_  (candidate : Option (Cite c))
  | filled (a : A) (src : Cite c) (allowed : q.admits src.kind)
      (supported : q.supports c (c[src.idx]'src.lt) a)

/-!
theorem fuse_extends {P : Type} (c : Context P) (u : Utterance P) :
    ∃ t, fuse c u = c ++ t

theorem ai_never_grounds {P : Type} (e : Turn P) (h : e.origin = .assistant) :
    e.basis = none
-/

/-- The same turn, cited from a longer context; what it supports is judged again against the
    context that now stands. -/
def Cite.lift {P : Type} {c : Context P} (s : Cite c) (t : Context P) : Cite (c ++ t) :=
  { idx := s.idx
    lt := by have := s.lt; simp; omega
    kind := s.kind
    ok := by rw [List.getElem_append_left s.lt]; exact s.ok }

/-! ── TYPES ── -/

variable {P : Type}

/-- `U`, `IdeationRequest`: the invocation utterance, read as it was said — a topic, optional idea
    fragments, and optionally a chain reference that names a prior protocol's output. A bare
    invocation binds the person's immediately preceding message as the utterance. Nothing wider is
    read: not the session before it, the codebase, or the rules. -/
abbrev IdeationRequest (P : Type) := Context P

/-- **Your reading** of the bound request: its topic. -/
opaque topic : Context P → String

/-- Why the field is underexpanded, cited as the classification relay's basis; it never gates
    activation, since invoking `/ideate` is the activation. -/
inductive ExpansionWitness
  | empty
  | narrowAcrossFrames
  | prematurelyConverged
  | emergent (name : String)
  deriving Inhabited  -- elab: lets `witness` be declared `opaque`

/-- **Your reading** of the bound request: the expansion witness. -/
opaque witness : Context P → ExpansionWitness

/-- A fragment before any frame exists, and where it came from: `person` for the person's own
    fragments. Material a named chain reference supplied keeps the origin it already carries as a
    tag, or else the origin of the turn it was read from. Naming the reference is the person's
    adoption of that material; the adoption is recorded apart from the origin and never written
    into it. -/
structure Seed where
  content : String
  origin  : Origin

/-- `blank`: a topic only. `seeded`: idea fragments, a named chain reference, or both. The two
    take different paths: the frame map first, or generation first. -/
inductive Entry
  | blank
  | seeded (seeds : List Seed)
  deriving Inhabited  -- elab: lets `entry` be declared `opaque`

/-- **Your reading** of the bound request: which entry it is — inferred, never asked. -/
opaque entry : Context P → Entry

inductive SignalSource | utterance | chain

/-- A concern, weakness, or requirement the bound request carries, and which of the two it came
    from. Never a quality score, an elimination reason, or a rank. -/
structure Signal where
  content : String
  source  : SignalSource

/-- **Your record**: the signals the classification relay recorded, read from the bound
    utterance and any named chain material and from nothing wider. Fixed from then on: none is
    removed or reinterpreted away, and a concern first voiced later in the run is not added; it
    stays in the context as it was said. -/
opaque signals : Context P → List Signal

/-- A partition for parallel generation. It organizes divergence only and is never handed off as
    a framed inquiry. -/
structure Frame where
  label : String
  angle : String

/-- **Your record**, read from the context: the frames registered — derived once from the entry,
    then extended only by a new angle the person named, shaped into frames not already
    registered. On Seeded, at least one, seed-anchored and novel, with every seed landing under
    one; on Blank, novel and abstract. Whether the person's words name a registered frame is
    read here. -/
opaque frames : Context P → List Frame

/-- **Your record**: the frames a pass has opened. -/
opaque opened : Context P → List Frame

def Unexplored (c : Context P) (f : Frame) : Prop := f ∈ frames c ∧ f ∉ opened c

/-- A generated idea: raw material for divergence, not a selection-ready alternative. It carries
    no score, rank, or preference. -/
structure Candidate where
  content : String
  frame   : Frame
  origin  : Origin

/-- **Your record**: every candidate the passes produced, under the frame it came from — on a
    Seeded entry's first pass the seeds, each keeping its own origin, and every generated one as
    `assistant`. Never removed, re-ranked, or relabeled. -/
opaque candidates : Context P → List Candidate

/-- **Your judgment**, remade at each presentation from the candidates as they stand: the
    candidate responds to the signal. Never stored as a mapping and never a score on the
    candidate. Once the person stops, it stands as the presentation their Stop answered showed
    it; no reading after the Stop changes what they closed on. -/
opaque Responds : Context P → Candidate → Signal → Prop

def Unaddressed (c : Context P) (s : Signal) : Prop :=
  s ∈ signals c ∧ ¬ ∃ x ∈ candidates c, Responds c x s

/-- A wish for more on a frame already open, parked rather than reopening the frame. -/
structure ParkedFollowUp where
  frame : Frame
  note  : Option String

/-- **Your reading** of every request, in the person's utterances, for more on a frame already
    open — each relayed with the request quoted. A park never opens a pass. -/
opaque parked : Context P → List ParkedFollowUp

/-- **Your reading** of the latest answer: the frames the next pass opens. At the frame map, the
    frames selected among those offered. At a round, the named frames not yet open, and a new
    angle the person named once it is shaped into frames; a Continue that names none takes every
    unexplored frame. A named frame already open is never here: it parks. Empty when the answer
    opens nothing — a park alone, a question, or a Continue with nothing unexplored and no new
    angle. -/
opaque targets : Context P → List Frame

/-- What the fused context says the person did at the gate. Premise: one utterance carries one
    disposition, beside any number of parks; silence is neither. -/
inductive Verdict
  /-- Open at the frame map, Continue at a round, and any answer that does not stop -/
  | cont
  /-- Stop, at the frame map or at a round -/
  | stop
  deriving Inhabited  -- elab: lets `verdict` be declared `opaque`

/-- **Your judgment** on the whole latest utterance read with the context. -/
opaque verdict : Context P → Verdict

/-- `DiverseCandidateField`, read from `context`: the topic, every candidate with its frame and
    origin, the explored frames (`opened`), the unexplored ones (`Unexplored`), the parked
    follow-ups, and the unaddressed signals. Frame-distributed, never scored; complete for
    whatever unfolds it next. -/
structure DiverseCandidateField (P : Type) where
  context  : Context P
  nonempty : (candidates context).isEmpty = false

/-- `EarlyExit`: a Stop while no candidate exists, read from `context` — the frames offered
    (`frames`), the parked follow-ups, and every signal, since no candidate answered any. -/
structure EarlyExit (P : Type) where
  context : Context P
  empty   : (candidates context).isEmpty = true

inductive Outcome (P : Type)
  | field   (r : DiverseCandidateField P)
  | early   (r : EarlyExit P)
  | holding (c : Context P)

/-! ── U-BINDING ──
bind(U) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ chain_ref
Priority: explicit_arg > colocated_expr > prev_user_turn > chain_ref
  /ideate "topic or fragments"               → U = the argument
  /ideate (alone)                            → U = the person's previous message; one turn, not a scan
  "give me some ideas ... /ideate"           → U = the text before the trigger
  "using what /inquire just found, /ideate"  → U also carries the named chain reference; its material
                                               folds in as seeds under the origin it came with
A chain reference never stands in for the topic.
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A round is one step of a structural recursion over the person's utterances. `relay` is the
classification relay at Phase 0 — the entry, its basis, the witness, and the signals with their
sources — and it yields no turn. `generate` is one pass: candidates under each frame the pass
opens — every derived frame on a Seeded entry's first pass, `targets` after an answer — with the
seeds promoted on that first pass, in parallel over the frames and with no elimination, ranking,
or scoring. `respond` is the presentation that ends at a gate: the frame map and Qframes before
any pass on Blank, and the round and Qround after each pass.
-/

def pass (generate respond : Context P → Response P) (c : Context P) : Context P :=
  let c₁ := c ++ [(generate c).val]
  c₁ ++ [(respond c₁).val]

/-- The person's Stop closes the field on the context as it then stands. -/
def assemble (c : Context P) : Outcome P :=
  match h : (candidates c).isEmpty with
  | true  => .early ⟨c, h⟩
  | false => .field ⟨c, h⟩

def ideate (generate respond : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    match verdict c' with
    | .stop => assemble c'
    | .cont =>
      if (targets c').isEmpty then ideate generate respond (c' ++ [(respond c').val]) us
      else ideate generate respond (pass generate respond c') us

def start (relay generate respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₀ := c ++ [(relay c).val]
  match entry c₀ with
  | .blank    => ideate generate respond (c₀ ++ [(respond c₀).val]) us
  | .seeded _ => ideate generate respond (pass generate respond c₀) us

/-! ── LOOP ──
Before every Qround, weigh four things and render what carries this round's decision: which
signals remain unaddressed (always shown while any exist), how the explored and unexplored
frames differ in direction, what continuing would cost to review, and what stopping would keep.
A basis-cited note on whether recent rounds read as closer to earlier ones may sit before the
gate; it describes state only and never reorders or discourages either answer. No fixed round
count and no quota: nothing is tracked toward a target, and the loop continues until the
person's own Stop.
-/

/-!
Silence assembles nothing.
theorem silence (generate respond : Context P → Response P) (c : Context P) :
    ideate generate respond c [] = .holding c

On a Blank entry the frame map comes before any candidate: nothing is generated before the first
gate.
theorem blank_frame_map_first (relay generate respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (h : entry (c ++ [(relay c).val]) = .blank) :
    start relay generate respond c us =
      ideate generate respond (c ++ [(relay c).val] ++ [(respond (c ++ [(relay c).val])).val]) us

An answer that opens no frame runs no pass: the gate is presented again. No pass runs over an
empty set of frames.
theorem no_empty_pass (generate respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (hv : verdict (fuse c u) = .cont)
    (ht : (targets (fuse c u)).isEmpty = true) :
    ideate generate respond c (u :: us) =
      ideate generate respond (fuse c u ++ [(respond (fuse c u)).val]) us
-/

/-! ── CONVERGENCE ──
resolved: a Stop the person gave, at the frame map or at a round. Their Stop is the completion
itself, not a judgment layered on a built object. DiverseCandidateField when candidates exist,
EarlyExit otherwise. Convergence evidence: at DiverseCandidateField, present the trace — the
topic, then for each opened frame its candidates with their origins, the unexplored frames, the
parked follow-ups, and the unaddressed signals; at EarlyExit, the frames offered, none of which
yielded a candidate, the parked follow-ups, and every signal. Demonstrated, not asserted.
Nothing is held beyond the context, so nothing needs cleanup; the parked set's durable record
is the host's after the protocol ends.
-/

/-!
A Stop assembles at once, with no further pass.
theorem stop_assembles (generate respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (hv : verdict (fuse c u) = .stop) :
    ideate generate respond c (u :: us) = assemble (fuse c u)

The field and the early exit are each closed only by the person's Stop.
theorem field_by_person (generate respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (r : DiverseCandidateField P)
    (h : ideate generate respond c us = .field r) :
    ∃ (c₀ : Context P) (u : Utterance P), verdict (fuse c₀ u) = .stop ∧ r.context = fuse c₀ u

theorem early_by_person (generate respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (r : EarlyExit P)
    (h : ideate generate respond c us = .early r) :
    ∃ (c₀ : Context P) (u : Utterance P), verdict (fuse c₀ u) = .stop ∧ r.context = fuse c₀ u

A field always carries a candidate.
theorem field_has_candidates (r : DiverseCandidateField P) : candidates r.context ≠ []

At an early exit every signal is unaddressed.
theorem early_all_unaddressed (r : EarlyExit P) (s : Signal) (hs : s ∈ signals r.context) :
    Unaddressed r.context s

No frame is reported both explored and unexplored.
theorem explored_not_unexplored {c : Context P} {f : Frame} (h : Unexplored c f) :
    f ∉ opened c
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | bind | classify | extractSignals | classifyRelay | deriveFrames | qframes
             | generate | present | qround | readAnswer | shapeFrames | park | converge | seam

def grounding : Op → Annot × String
  | .bind           => (.sense, "Internal analysis: the invocation utterance and a chain reference it names; no external tool, no substrate scan")
  | .classify       => (.sense, "Internal analysis: the entry, Blank or Seeded, and the expansion witness, inferred from the bound utterance; zero entry questions")
  | .extractSignals => (.sense, "Internal analysis: signals — concerns, weaknesses, requirements — read from the bound utterance and named chain material only, each tagged by its source; never scored or ranked")
  | .classifyRelay  => (.extension, "TextPresent+Proceed: the inferred entry and its basis, quoting the utterance fragment, with the extracted signals and their sources; relay, not a gate")
  | .deriveFrames   => (.sense, "Internal analysis: the generation frames — seed-anchored and novel on Seeded, novel and abstract on Blank")
  | .qframes        => (.constitution, "present: Blank only — the frame map, multi-select, before any concrete candidate, with the Stop path; read references/blank-entry.md before presenting")
  | .generate       => (.sense, "Internal generation: parallel over the frames the pass opens; a host may realize it through isolated parallel agents, and the meaning does not depend on that; no elimination, ranking, or scoring")
  | .present        => (.extension, "TextPresent+Proceed: the round — candidates grouped by frame with their origins, the explored and unexplored frames and how their directions differ, what is parked, every signal still unaddressed, what continuing would cost to review and what stopping keeps; precedes the gate")
  | .qround         => (.constitution, "present: every round, Continue first and Stop second at every presentation; Continue opens unexplored frames or a new angle the person names; a request for more on an open frame parks; a Continue with nothing to open presents the gate again")
  | .readAnswer     => (.sense, "Internal analysis: the latest utterance read whole with the context — the verdict, the frames it opens, any new angle, and any park")
  | .shapeFrames    => (.sense, "Internal analysis: a new angle the person named, shaped into frames not already registered before the pass opens them")
  | .park           => (.extension, "TextPresent+Proceed: a request for more on an already-open frame acknowledged as parked, quoting the person's request; declared at either terminal; its durable record is the host's after the protocol ends")
  | .converge       => (.extension, "TextPresent+Proceed: DiverseCandidateField — the topic, per opened frame its candidates with their origins, the unexplored frames, the parked follow-ups, the unaddressed signals; EarlyExit — the frames offered, the parked follow-ups, every signal")
  | .seam           => (.extension, "TextPresent+Proceed: after the person's Stop, at either terminal, a user-declared chain naming the next protocol settles the next move; proceed to it citing that source. This protocol declares no wired outbound edge. The assembled terminal crosses whole, every origin, park, and unaddressed signal intact, and the seam never selects, ranks, or trims; parked follow-ups stay the host's unless the chain names a later /ideate on them; every Constitution gate inside this protocol and the next fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Candidate-field resolution emergent via session context.
-/

end Heuresis
```

## Mode Activation

`/ideate` is user-initiated: an observation that a field looks narrow does not activate it. Selection and recommendation wait until the user's `Stop` produces `DiverseCandidateField` or `EarlyExit`.

## Protocol

### User-facing realization

Present the Phase 0 classification as a short basis-cited relay: the inferred entry, its witness, and source-tagged signals. For `Blank`, read `references/blank-entry.md` before presenting abstract frames and the pre-generation Stop path; for `Seeded`, read `references/seeded-entry.md` before the first expand-first pass. When a named chain reference supplied seeds, also read `references/chain-reference.md` after classification and before promotion.

Before every `Qround`, present candidates grouped by frame with origins, the directional contrast between explored and unexplored frames, parked follow-ups, and every signal still unaddressed. State the extra review load and what Stop will preserve. Then present `Continue` first and `Stop` second with symmetric specificity: Continue opens unexplored or user-named new frames; a Continue with nothing to open re-presents the question; a request for depth on an open frame parks and leaves the question open. Render Stop as `DiverseCandidateField` only when candidates exist and otherwise as `EarlyExit`.

Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, material belongs to another round or trace, or phase order determines placement around a gate.

## Known Limitations

- `unexplored_frames` covers derived frames, not every conceivable angle.
- A chain reference gives up the blank path's independent-ideation-first benefit; no mitigation is claimed.
- Signal extraction is bounded to the entry input and is not exhaustive or session-long.
- The rendered field carries the final unaddressed snapshot, not the full signal take/discard ledger; that ledger remains recoverable only from the round presentations the session context holds.

## Rules

- **User-initiated, zero entry questions**: `/ideate` activates only on direct invocation (Layer 1); `Entry` (Blank vs. Seeded) is inferred from the utterance alone — never asked. Phase 0's classification is a relay, not a gate.
- **Frame-first ownership**: On `Blank`, read `references/blank-entry.md` before presenting abstract frames or any concrete candidate. Preserve every candidate's origin thereafter.
- **User-bounded field**: `Stop` remains available from the first gate onward; it returns `DiverseCandidateField` only with candidates and otherwise the fully declared `EarlyExit`. Only the user's Stop closes the field, and it closes on what the round it answered showed.
- **Euporia boundary — utterance-only input**: heuresis reads only what the invocation carries — the utterance itself, plus a prior protocol's output the user explicitly names (a chain reference). A bare invocation binds the immediately preceding user message as the utterance (a one-turn U-BINDING rule, not a session scan). Beyond the bound utterance it never scans the wider session, codebase, or rules, and it never reverse-traces hidden decision coordinates from externalized substrate — that is Euporia's territory (`/elicit`), not this protocol's.
- **Chain semantics**: A named chain reference folds its material in as seeds. Each seed keeps the origin tag the material already carries, or otherwise the origin of the turn it was read from; naming the reference is the user's adoption of that material, recorded apart from its origin and never written into it. Read `references/chain-reference.md` after classification and before first-pass promotion; the ownership trade-off remains declared under Known Limitations.
- **Round composition**: Compose each round so the reader can act on it without reassembling it — everyday language rather than this file's formal vocabulary, the judgment set beside the evidence it rests on together with the differential implication that matters for the next move, and analytical context laid out before a gate rather than inside it, so the gate carries the question and each option's differential implication. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged, when some of what is in view belongs to a later round or a trace rather than this one, or when this protocol's own phases bear on where a sentence sits relative to a gate.
- **Depth parks, width continues**: A request for more inside an already-open frame parks as a `ParkedFollowUp` relayed with the user's request quoted, is declared at either terminal, and leaves `Qround` open; deepening chains from the assembled field later.
- **Decision delta**: Before every `Qround`, surface unaddressed signals, the explored/unexplored directional contrast, continuing's review cost, and what stopping preserves. Continue names its widening target and Stop names its live terminal.
- **Neutral option order**: Continue is always first and Stop second, with symmetric specificity. Any novelty or coverage observation stays basis-cited pre-gate state and does not recommend or reorder either answer.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
