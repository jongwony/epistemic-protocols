/-!
How to read this block. It is core Lean 4 and elaborates as written.
Every `opaque` declaration is a judgment that is yours to make from the material in front of
you; its doc comment says what you judge there, and nothing in this block decides it for you.
Every `def`, `inductive`, and `structure` is fixed by the contract. A `theorem` line inside a
doc comment states a consequence the contract already has; it is proved outside this block
and asks nothing further of you.
-/

/-! ── FLOW ──
Aitesis(X) → Scan(X) → Uᵢ →
  [Uᵢ = ∅] sufficiency_relay(reasoning) → proceed          (trivial SufficientContext)
  Pass(c): W := (Scan(c) \ uncertainties) ∪ live → ∀u ∈ W: push(u) until ¬advanceable(u)
    → W ∪= what collection exposed → ∀u ∈ W: land(u) → (Uᵣ, Uₚ, Uᵤ, Uₙ)
  [the pass changed something ∧ another pass is still worth it] Pass(c') → …
  [it changed nothing ∨ a further pass is not worth it] Surface(Uₚ ∪ Uᵤ ∪ Uₙ, Uᵣ) → proceed
    → converge
  [a later utterance answers a surfaced item] c' := fuse(c, u) → Pass(c') → …
    (an answer is one more channel; the next pass re-reads everything)
  [the answer is Sufficient] c' := fuse(c, u) → converge
    (the one answer that opens no pass: the inquiry is declared enough, and what remains is
     dismissed with the declaration)
c is the fused session context, and every record a pass writes is part of it: the prospect
X' the next pass reads is that context, landed records included.
live: every uncertainty not dismissed — the pass is the unit, and every pass pushes and lands
the whole of it again. push(u): one untried channel the AI can reach on its own, cheapest
first; a tried channel is not re-selected. land(u): the state the item reached, the reason it
reached no further, and the basis, read from the material; written at every pass, the same
where nothing moved. Uᵣ resolved · Uₚ provisional (a finding with its shortfall declared) ·
Uᵤ the user's unknown · Uₙ detect-only.
-/

/-! ── MORPHISM ──
Prospect
  → scan(prospect, context)                    -- infer what the prospect leaves uncertain; open dimensions, no fixed taxonomy
  → collect(uncertainties, channels)           -- push each uncertainty through every channel the AI can reach on its own, and register what that collection exposes before landing
  → land(uncertainty, state, reason, basis)    -- write what collection reached and why it reached no further — every item, every pass
  → enrich(prospect, landed)                   -- the landed records join the context the next pass reads; a pass that changed something is followed by another while a further pass is still worth reaching for
  → surface(landed, as_relay)                  -- hand what remains to the user as their own unknown; proceed
  → fuse(answer)                               -- an answer, when it comes, is one more channel: the next pass re-reads everything on it
  → SufficientContext
requires: uncertain(sufficiency(X))            -- runtime checkpoint (Phase 0)
deficit:  ContextInsufficient                  -- activation precondition (Layer 1/2)
preserves: task_identity(X)                    -- task intent invariant; the context only grows
invariant: Evidence over Inference over Detection
invariant: Judgment is the model's, the product is a field   -- which state an item reached is judged from the material; that it reached it is written on the item
-/

namespace Aitesis

/-! ── GROUND ──
The session primitive this contract reads. A context is the list of turns the session has
accumulated; a turn carries where it came from and what form it takes. Only a person's
statement is an utterance; an AI turn, an injected turn, and a summary ground nothing.
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

def Utterance (P : Type) := {e : Turn P // e.basis = some .utterance}
def Response (P : Type) := {e : Turn P // e.origin = .assistant}
def Evidence (P : Type) := {e : Turn P //
  e.basis = some .observation ∨ e.basis = some .report ∨ e.basis = some .testimony}

/-- Fusion appends one turn; the record only grows. -/
def fuse {P : Type} (c : Context P) (u : Utterance P) : Context P := c ++ [u.val]

/-- A citation of one turn of `c`, with the basis that turn is eligible for. -/
structure Cite {P : Type} (c : Context P) where
  idx  : Nat
  lt   : idx < c.length
  kind : Basis
  ok   : (c[idx]'lt).basis = some kind

/-- An open coordinate: which bases it admits, and whether a cited turn supports a value
    (the support reading is the model's). -/
structure Coord (P A : Type) where
  admits   : Basis → Prop
  supports : Context P → Turn P → A → Prop

/-- A coordinate is filled only by a citation it admits and that supports the value; `open_`
    may carry a candidate citation whose support is still short. -/
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

/-- A citation into an earlier context still points at the same turn after later fusion;
    what it supported there is judged again against the context that now stands. -/
def Cite.lift {P : Type} {c : Context P} (s : Cite c) (t : Context P) : Cite (c ++ t) :=
  { idx := s.idx
    lt := by have := s.lt; simp; omega
    kind := s.kind
    ok := by rw [List.getElem_append_left s.lt]; exact s.ok }

/-! ── TYPES ── -/

variable {P : Type}

/-- `X`: the prospect for action — planning, task execution, analysis, investigation, or any
    purposeful action requiring context. The morphism processes it uniformly; it is read from
    the context, and its task intent is never changed here. -/
abbrev Prospect (P : Type) := Context P

inductive Priority | critical | significant | marginal

/-- One uncertainty. Whether a scan's item is the same as one already raised is your judgment
    (`SameItem`), read from the material — for a dismissed item, from the person's dismissal
    utterance. -/
structure Item where
  domain      : String
  description : String
  priority    : Priority

/-- **Your judgment**: `i` and `j` are the same uncertainty. -/
opaque SameItem : Context P → Item → Item → Prop

/-- `Scan`: **your judgment** of what the context leaves uncertain — a missing fact, a
    contradiction between the utterance and what was collected, a relevance gap; no fixed
    taxonomy. It also registers, as an item of its own, a finding the material carries that
    answers nothing raised: that item lands `detectOnly`, and the question the material was
    collected for keeps its own record beside it. Run after collection, it reads what the pass
    itself collected, so a discovery is registered in the pass that made it, before landing. -/
opaque Scanned : Context P → Item → Prop

/-- **Your record**, read from the context: every item raised so far. Cumulative: an item
    once raised is never replaced. -/
opaque Registered : Context P → Item → Prop

/-- A dismissal is the person's own utterance: the AI never disposes of an item. -/
structure Dismissal (c : Context P) where
  src : Cite c
  byPerson : src.kind = .utterance

/-- **Your reading** of the person's dismissal utterance for `i` — a dismissal of that item,
    or a declaration of sufficiency reaching it — with its citation; `none` while there is
    none. -/
opaque dismissal : (c : Context P) → Item → Option (Dismissal c)

def live (c : Context P) (i : Item) : Prop := Registered c i ∧ dismissal c i = none

/-- Step₀'s working set: what the scan raises that is not already registered, together with
    every live item. -/
def working (c : Context P) (i : Item) : Prop :=
  (Scanned c i ∧ ¬ ∃ j, Registered c j ∧ SameItem c i j) ∨ live c i

/-- The kinds of route the AI can read or run on its own for an item; which kinds an item
    admits is read from the item, never from a table. -/
inductive ChannelKind
  | artifactRead | artifactSearch | recordRead
  /-- conditional: canonical external sources — RFCs, vendor API docs, standards; tagged
      `web:{url}` and cross-checked against the codebase version, so a page that may be stale
      lands the item provisional rather than resolved -/
  | externalFetch
  /-- conditional: read-only commit-log queries — content pickaxe, message search, temporal
      range; tagged `history:{ref}` -/
  | historyQuery
  /-- an observation run shaped by `ObservationSpec`; one channel like any other -/
  | observationRun
  /-- a location or answer the user has given -/
  | userGiven
  | emergent (name : String)

/-- A channel as it was read: a source that has changed since — the user says so, an answer
    points back to it, or the material shows a newer version — is a new channel. -/
structure Channel where
  kind   : ChannelKind
  source : String
  asRead : String

/-- **Your record**, read from the context: the channels already read for `i`, the user
    counting as one when an utterance answered `i`, and a channel declined under an
    `EscapeCondition` counting as read. It only grows. -/
opaque tried : Context P → Item → List Channel

/-- **Your judgment**: the item admits this channel. A channel whose expected yield no longer
    justifies pushing it on the AI's own is not one it admits; it admits none when its answer
    lives only with the user or it is not the AI's to collect. Record which way this fell in
    the item's basis. -/
opaque Admits : Context P → Item → Channel → Prop

/-- The AI can still push this item on its own; false ends collection for it and hands it to
    the user. -/
def advanceable (c : Context P) (i : Item) : Prop := ∃ ch, Admits c i ch ∧ ch ∉ tried c i

inductive State | resolved | provisional | userUnknown | detectOnly

/-- Why an item reached no further; written for every state but resolved. -/
inductive Reason
  /-- not the AI's to collect: another domain, another authority -/
  | notMine
  /-- every channel tried, ground still short -/
  | couldNot
  /-- the answer lives with the user -/
  | onlyYou
  | emergent (name : String)

/-- **Your judgment**: the cited turn settles `i` with this finding. A person's report of what
    they observed and their statement both reach it as turns; which one bears is read. -/
opaque LandSupported : Item → Context P → Turn P → String → Prop

/-- An item is a fact coordinate open to any grounding basis; support is read. -/
def itemCoord (i : Item) : Coord P String :=
  { admits := fun _ => True, supports := LandSupported i }

/-- What `land(u)` writes on an item. -/
inductive Landing (c : Context P) (i : Item)
  /-- evidence settles the item: what sufficed is a citation, required, and why -/
  | resolved (finding : String) (src : Cite c)
      (supported : LandSupported i c (c[src.idx]'src.lt) finding) (why : String)
  /-- a finding with a candidate citation whose ground is short — a finding, never an absence -/
  | provisional (finding : String) (candidate : Cite c) (reason : Reason) (shortfall : String)
  /-- no finding the AI can stand on: what was tried, or the contradiction quoted -/
  | userUnknown (reason : Reason) (basis : String)
  /-- a finding that answers no uncertainty raised: what was seen -/
  | detectOnly (reason : Reason) (seen : String)

def Landing.state {c : Context P} {i : Item} : Landing c i → State
  | .resolved ..    => .resolved
  | .provisional .. => .provisional
  | .userUnknown .. => .userUnknown
  | .detectOnly ..  => .detectOnly

/-- The landing read as the item's coordinate: resolved is filled; provisional is open with a
    candidate citation; the rest are open. -/
def Landing.toOcc {c : Context P} {i : Item} : Landing c i → Occ (itemCoord i) c
  | .resolved f s sup _    => .filled f s trivial sup
  | .provisional _ s _ _   => .open_ (some s)
  | .userUnknown ..        => .open_ none
  | .detectOnly ..         => .open_ none

-- elab: a witness lets `landing` be declared `opaque`; it adds no meaning.
instance {c : Context P} {i : Item} : Inhabited (Landing c i) := ⟨.userUnknown .couldNot ""⟩

/-- `land(u)`: **your judgment** from the whole material as it now stands. A web page that may
    be stale lands provisional rather than resolved; an observation run that resolved nothing
    is never the sole ground of a landing. A contradiction no channel settles lands
    `userUnknown` with the contradiction quoted — `onlyYou` where it is one of intent,
    `couldNot` where it is one of fact. The item's coordinate is `(landing c i).toOcc`. -/
opaque landing : (c : Context P) → (i : Item) → Landing c i

/-- `A`, read from a later utterance that addresses a surfaced item. Every answer but
    `sufficient` opens the next pass, which re-reads every live item on the fused context.
    Premise: one utterance carries one disposition per item; silence is none of them. -/
inductive Answer
  /-- one more channel for the item: the next pass pushes and lands it on the content -/
  | provide (i : Item) (content : String)
  /-- as `provide`; a point back at a source already read says the source changed -/
  | point (i : Item) (location : String)
  /-- the user does not know either; what they do know attaches the same way -/
  | unknown (i : Item) (said : String)
  /-- the item leaves `live` -/
  | dismiss (i : Item)
  /-- the whole inquiry is declared enough: every provisional and user-unknown item is dismissed
      with the declaration recorded; detect-only items stand -/
  | sufficient

/-- **Your reading** of the latest utterance; `none` when it answers no surfaced item. -/
opaque answer : Context P → Option Answer

/-- `ObservationSpec`: an observation run is one channel; it yields evidence or nothing, never a
    disposition. -/
structure ObservationSpec where
  setup   : List String
  execute : List String
  observe : String
  cleanup : List String

/-- Pre-run judgments only: each names a reason an observation must not run. Duration is not a
    member: a run that hits its budget yields its null result as evidence. -/
inductive EscapeCondition | environmentMutation | riskElevated

/-- **Your record**, read from the context: observation channels declined before running,
    each with its escape and rationale — the audit trail. -/
opaque skips : Context P → List (Item × EscapeCondition × String)

/-- `SufficientContext`: the context once collection has ended, with every live item landed in
    the pass that ended it, or the trivial one Phase 0 proceeds with. What stands: what
    collection settled, what it found without full warrant, what is the user's to settle, what
    it only detected. Open items that are the user's are the product, not a shortfall. -/
inductive Outcome (P : Type)
  | notActivated (c : Context P)
  | converged    (c : Context P)
  | declared     (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else. The prospect X', the uncertainties, each item's
tried channels, evidence and landing, the resolved, provisional, user-unknown, detect-only and
dismissed sets, and the skipped observations are read from it when needed; none is stored
beside it. The working set of a pass is derived (`working`), holding no state of its own.
-/

abbrev Mode (P : Type) := Context P

/-- A live item in the set its landing names; the relay surfaces the provisional,
    user-unknown, and detect-only sets, with the resolved beside them. Read between passes,
    every registered item is dismissed or in exactly one of these sets. -/
def inState (c : Context P) (s : State) (i : Item) : Prop := live c i ∧ (landing c i).state = s

/-!
The sets are disjoint by construction: an item's landing names one state.
theorem state_unique {c : Context P} {i : Item} {s s' : State}
    (h : inState c s i) (h' : inState c s' i) : s = s'
-/

/-! ── PHASE TRANSITIONS ──
Phase 0 scans the context; with nothing uncertain it presents the sufficiency finding with its
reasoning and proceeds, not activated. Otherwise each pass runs: Step₀ registers `working`;
Step₁ pushes each item while `advanceable`, its evidence entering the context as observation
turns [Tool]; Step₂ scans what the pass collected; Step₃ lands every live item; Step₄'s records
join the context. Collection ends by `CollectionEnds`, the relay is presented, and the turn
proceeds.
-/

/-- **Your collection** for one pass from `c`: what the channels returned, each an observation
    turn — a run that observed nothing returns its null result. -/
opaque push : Context P → List (Evidence P)

def pass (c : Context P) : Context P := c ++ (push c).map (·.val)

/-- **Your judgment**, made once for the pass: another pass is still worth reaching for on the
    AI's own. No pass cap bounds it; this judgment and the growing `tried` sets do. -/
opaque WorthAnotherPass : Context P → Prop

/-- **Your judgment**: from `c` to `c'` the pass opened an item, tried a channel, or changed a
    landing. -/
opaque PassChanged : Context P → Context P → Prop

/-- Collection from `c` ends at `c'`: passes follow while one changed something and another is
    still worth it. -/
inductive CollectionEnds : Context P → Context P → Prop
  | stop (c : Context P)
      (h : ¬ PassChanged c (pass c) ∨ ¬ WorthAnotherPass (pass c)) :
      CollectionEnds c (pass c)
  | more (c c' : Context P) (h1 : PassChanged c (pass c)) (h2 : WorthAnotherPass (pass c))
      (rest : CollectionEnds (pass c) c') :
      CollectionEnds c c'

/-- **Your collection** from `c` to where it ends: `CollectionEnds c (collected c)`. -/
opaque collected : Context P → Context P

/-- `respond` is the relay presented after collection: every landed item that is not resolved,
    in priority order, beside its state, reason, basis, and what an answer would change. -/
def inquire (respond : Context P → Response P) : Context P → List (Utterance P) → Outcome P
  | c, []      => .converged c
  | c, u :: us =>
    let c' := fuse c u
    match answer c' with
    | some .sufficient => .declared c'
    | _ =>
      let c'' := collected c'
      inquire respond (c'' ++ [(respond c'').val]) us

open Classical in
/-- Phase 0, then the run: with nothing uncertain, not activated; otherwise the first
    collection and its relay, then each later utterance. -/
noncomputable def start (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  if ∃ i, Scanned c i then
    let c' := collected c
    inquire respond (c' ++ [(respond c').val]) us
  else .notActivated c

/-! ── LOOP ──
The pass is the unit. Each pass scans the context as it now stands, pushes every live item
through the channels still open to it, registers what its own collection exposed, and lands
every live item again on the whole material. What bounds the loop is the stopping judgment
`Admits` carries per item and `WorthAnotherPass` once per pass, with the growing `tried` sets;
a pass cap is not part of this contract. A run that keeps discovering lands what it has where
the judgment says stop and surfaces the rest as the user's unknown — the residual is kept,
never a stall. Uncertainties accumulate; a dismissed item never re-enters a pass. An answer
opens the next pass; `sufficient` is the one that opens none. Nothing here holds the turn:
silence leaves the surfaced items as the user's unknown, which is the product.
Convergence evidence, after the pass that ended collection: for every item — raised by the
first scan or opened by a later pass — one pair (ContextInsufficient(u) → landing(u)): a
resolved item with what sufficed; a provisional item with its finding and where the ground
falls short; a user-unknown item with its reason and what was tried; a detect-only item as
detected, answering no uncertainty raised; a dismissed item with the reason or declaration
recorded. No item is declared out of scope without its own line. Convergence is demonstrated,
not asserted.
-/

/-!
A dismissed item never re-enters a pass: the person's dismissal keeps it out of `live`, and
registration keeps it out of what the scan raises.
theorem no_reentry (c : Context P) (i : Item) (hreg : Registered c i) (hself : SameItem c i i)
    (hd : (dismissal c i).isSome = true) : ¬ working c i

What sufficed for a resolved item is never an AI turn.
theorem resolved_not_ai {c : Context P} {i : Item} {f w : String} {s : Cite c}
    {sup : LandSupported i c (c[s.idx]'s.lt) f} (_ : landing c i = .resolved f s sup w) :
    (c[s.idx]'s.lt).origin ≠ .assistant

A pass whose channels returned nothing leaves the context as it was.
theorem empty_pass (c : Context P) (h : push c = []) : pass c = c
-/

/-! ── CONVERGENCE ──
sufficient(c) = the last pass changed nothing, or a further pass is not worth reaching for:
either way the AI's own reach is exhausted as the stopping judgment reads it — a reasonable
stopping point rather than an enumeration run dry — and every landing stands on the whole
material. `user_unknown ≠ ∅` does not block convergence: what remains is surfaced as the
user's, which is the product.
-/

/-!
theorem ends_sufficient {c c' : Context P} (h : CollectionEnds c c') :
    ∃ c₀, c' = pass c₀ ∧ (¬ PassChanged c₀ (pass c₀) ∨ ¬ WorthAnotherPass (pass c₀))

The Sufficient answer converges at once, with no further pass.
theorem sufficient_opens_no_pass (respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (h : answer (fuse c u) = some .sufficient) :
    inquire respond c (u :: us) = .declared (fuse c u)
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed. No Constitution entry: whether a turn halts is the harness's baseline

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | scan | sufficiencyRelay | push | observeRun | register | land | surface
             | readAnswer | converge | sufficiency | seam

def grounding : Op → Annot × String
  | .scan             => (.sense, "Internal analysis: what the context leaves uncertain, at Phase 0 and at Step₀")
  | .sufficiencyRelay => (.extension, "TextPresent+Proceed: with nothing uncertain, the sufficiency finding with its reasoning; proceed with X unchanged, trivial SufficientContext")
  | .push             => (.observe, "artifact read, artifact search, record read, external fetch (conditional, tagged web:{url}), environment run (conditional: read-only commit-log queries, tagged history:{ref}); what a channel yields enters the context for the item pushed")
  | .observeRun       => (.transform, "artifact write, environment run, artifact read: one observation run shaped by ObservationSpec; a run that resolves nothing returns its null result and the item continues to its next channel, and a declined run is recorded with its escape in skips")
  | .register         => (.sense, "Internal analysis: Step₂, what this pass's collection exposed, registered before landing")
  | .land             => (.sense, "Internal analysis: every live item, every pass — state, reason, and basis read from the material as it now stands")
  | .surface          => (.extension, "TextPresent+Proceed: every landed item that is not resolved, in priority order, beside its state, reason, basis, and what an answer would change; the turn is not held")
  | .readAnswer       => (.sense, "Internal analysis: which surfaced item a later utterance answers and how; every answer but Sufficient opens the next pass")
  | .converge         => (.extension, "TextPresent+Proceed: the convergence evidence trace, one pair per item including the dismissed and the detect-only; proceed with SufficientContext")
  | .sufficiency      => (.extension, "TextPresent+Proceed: on Sufficient, the dismissed set with the declaration recorded against each, so the trace shows what was accepted unresolved")
  | .seam             => (.extension, "TextPresent+Proceed: at a user-declared chain naming the next protocol, proceed directly to it citing that source")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
-/

end Aitesis

/-! Proofs of the theorems the block above states. The block above is the SKILL.md Lean
    block verbatim; lean-definition checks that prefix and matches every stated signature. -/

namespace Aitesis

variable {P : Type}

theorem fuse_extends {P : Type} (c : Context P) (u : Utterance P) :
    ∃ t, fuse c u = c ++ t := ⟨[u.val], rfl⟩

theorem ai_never_grounds {P : Type} (e : Turn P) (h : e.origin = .assistant) :
    e.basis = none := by simp [Turn.basis, h]

theorem state_unique {c : Context P} {i : Item} {s s' : State}
    (h : inState c s i) (h' : inState c s' i) : s = s' := h.2.symm.trans h'.2

theorem no_reentry (c : Context P) (i : Item) (hreg : Registered c i) (hself : SameItem c i i)
    (hd : (dismissal c i).isSome = true) : ¬ working c i := by
  rintro (⟨_, hn⟩ | ⟨_, hl⟩)
  · exact hn ⟨i, hreg, hself⟩
  · rw [hl] at hd; cases hd

theorem resolved_not_ai {c : Context P} {i : Item} {f w : String} {s : Cite c}
    {sup : LandSupported i c (c[s.idx]'s.lt) f} (_ : landing c i = .resolved f s sup w) :
    (c[s.idx]'s.lt).origin ≠ .assistant := by
  intro ho
  have hk := s.ok
  rw [ai_never_grounds _ ho] at hk
  cases hk

theorem empty_pass (c : Context P) (h : push c = []) : pass c = c := by
  simp [pass, h]

theorem ends_sufficient {c c' : Context P} (h : CollectionEnds c c') :
    ∃ c₀, c' = pass c₀ ∧ (¬ PassChanged c₀ (pass c₀) ∨ ¬ WorthAnotherPass (pass c₀)) := by
  induction h with
  | stop c h => exact ⟨c, rfl, h⟩
  | more _ _ _ _ _ ih => exact ih

theorem sufficient_opens_no_pass (respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (h : answer (fuse c u) = some .sufficient) :
    inquire respond c (u :: us) = .declared (fuse c u) := by
  simp [inquire, h]

end Aitesis
