---
name: sketch
description: "Something has to be made that the user cannot describe but would recognize on sight: mark what does not fit on concrete sketches, revising until a form is recognized."
---

# Hypotyposis Protocol

Discover what a form should be by encountering concrete versions and reacting to them, until the user recognizes one version they encountered as the form for their purpose. Type: `(FitUnrecognized, Hybrid, SKETCH-RECOGNIZE-CYCLE, FormIntentSeed) → RecognizedForm`.

## Definition

**Hypotyposis** (ὑποτύπωσις): an outline or sketch — a first drawing of a position rather than its finished statement. A dialogical act for the moment when a form has to be made and the intent behind it cannot yet be settled from descriptions: the user can say what is wrong with a thing in front of them long before they can say what the thing should be, because good fit has no positive description of its own while each misfit can be pointed at (Alexander, 1964). So the user need not specify the form first. The AI relays what the next versions will try — what they revise, how many, the medium each is realized in and what that medium can and cannot show, and where each will be — each with its basis, and then makes them. Each round shows the new versions first, in a medium in which the qualities the user's judgment concerns can be encountered, and then the standing: what the user's words set and on which version, what of the AI's they took, what rests on a check, what stays unestablished, and what changed. The user reacts in their own words — a mark, a keep, a request, a value set — and the AI revises the versions those words point to into new versions, never regenerating one from a description of it. The AI's reading of the purpose grows from those reactions rather than being settled up front: what it brings in before any reaction is marked as a default, each later part names the reaction or the gathered material it came from, and each round shows how the reading widened. The run ends when the user takes one version they encountered as the form for their purpose, its home shown in the round or named in that same turn, or when they end it. Once it has run, the user can point at one version as they met it and say "this is the form, for this purpose", seeing where it lives, where the passed-over versions are, what they asked done to any of them that is not yet observed done, and which values rest on their own words or on the AI's proposals they took, and what rests on checked evidence. The recognition establishes their judgment of fit for that purpose on what the version showed — not correctness against a standard outside preference, and not readiness for use.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Hypotyposis(I) → start(c) → sketch(c, utterances), where c is the fused session context:
  start: what bears on the form is gathered; then your reading, on it, that this is not this
    protocol's case (`notActivated`), in plain words with its basis → not activated; otherwise
    → production → round
  production(c): the intent relayed whole — your reading of the purpose, marked as yours unless
    they said it, each part with what it rests on, a default marked as one; what the next versions
    try and which versions they revise; how many; the medium each is realized in, what it can show
    and what it cannot; where each will be; the reference a standard outside preference is checked
    against — each with its basis, and on every later production what changed since the last; it
    yields no turn → what the versions will be checked against, gathered → the versions, each
    entering c as realized → what checking them needs, gathered
  round: new versions first, each as encountered in its medium; then the standing — what the
    person's words set and on which version, what of yours they took, what you propose not yet
    taken, what rests on a check, what stays unestablished, what changed since the standing they
    last answered, where each version is; your readings and contrary grounds, each with what it
    bears on and rests on → one opening → Stop
  next utterance u, read on fuse(c, u):
    [does not bear on this run]   the session answers it; that answer stays in c; no gate of this run
    [the person recognizes v]     what their words ask done to the versions, observed → RecognizedForm
    [the person withdraws]        what their words ask done to the versions, observed → Withdrawn
    [otherwise]                   what is gathered now enters c; a production where their turn
                                  calls for a version none shown embodies; what their words ask
                                  done to the versions is done and observed → round
  no utterance: the gate holds; nothing is recognized, written, or removed
-/

/-! ── MORPHISM ──
FormIntentSeed
  → gather          -- what bears on the form, read or run now — the reference a standard outside preference is checked against included (focus)
  → relay_intent    -- the production intent whole with its basis, BEFORE any version is made; on a later production, with what changed
  → produce         -- versions realized in a medium that shows what the judgment concerns, each registered as realized
  → present         -- new versions first, as encountered; then the standing (focus)
  → fuse(u)         -- the person's turn joins the context whole
  → recognize       -- the person's closing on a version they encountered (`ClosingSupported`)
  → carry_out       -- what their words ask done to the versions shown before that turn, done and observed
  → assemble        -- the record, `recordOf`, built after what the closing turn asked done is observed
  → RecognizedForm
requires: form_to_make(I)               -- read before activation (`notActivated`)
deficit:  FitUnrecognized               -- activation precondition (Layer 1/2)
preserves: utterance(I)                 -- the seed is never rewritten and the context only grows; an existing version moves or goes only at the person's word
invariant: Recognition over Description -- fit is the person's recognition of a specific version, as it was encountered, for the purpose as it stands
invariant: Encountered, not described   -- a recognition reaches what the version's medium showed; what it did not show stays unestablished
invariant: Concretum Retention          -- a revision is a new version made from retained versions; a version shown stays as it was shown and is never regenerated from a description
invariant: after activation only the person closes; your readings, proposals, and contrary grounds close nothing
The steps between gather and recognize are how you work toward a recognizable form; the contract
fixes the deficit and its resolution, the coordinates only the person fills — the purpose where
they say it, the values they hold, the closing — the closings themselves, and the orderings the
premises ground: the intent relayed before any version is made, a version shown before the
standing that bears on it, and the record built after what the closing turn asked done is
observed.
-/

namespace Hypotyposis

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

/-- `I`, `FormIntentSeed`: the utterance that asks for a form, and the material it names or the
    context already holds — a direction already taken, an intent already settled, an existing
    artifact, a reference, a record of an earlier session. A seed may say much or little about the
    form; nothing in it has to specify the form first. Source-neutral; read from the context. -/
abbrev FormIntentSeed (P : Type) := Context P

/-- **Your reading**, before anything is produced: why this is not this protocol's case, in plain
    words with its basis — no form is about to be made; the person can already say what the form
    should be, or the context already settles it, so no encounter is needed to settle the intent;
    the choice is among directions already named whose futures cannot be judged, rather than a
    form to make; or the work is to understand, check, or carry out something that exists rather
    than to make a form. An unmet need is said as what would settle it. `none` where the case is
    this protocol's. -/
axiom notActivated : Context P → Option String

/-- **Your judgment**: the cited person turn says what the form is for, or what matters in it,
    read against the context as it now stands — in their own words, or by taking the reading of
    the purpose a round showed, which adopts it as shown. A record of earlier work the turn passes
    along as material does not say it. A later turn may change it. -/
axiom PurposeSupported : Context P → Turn P → String → Prop

/-- Only a person's turn sets the purpose. -/
def purposeCoord : Coord P String :=
  { admits := (·.val = .person), supports := PurposeSupported }

/-- **Your reading**: the purpose as it stands; `open_` until a person's turn says it. It holds
    back neither a round nor a closing: while it is open, the round shows what the person said of it
    and your reading of the rest, marked as yours. That reading grows from the run rather than being
    front-loaded: each part
    names what it rests on — a default you brought in before any reaction (the convention of the
    kind of form, the request's own words, an example you picked), marked as a default; or the
    person's reaction to a specific version, or the gathered material, it came from. A default
    gives way to what the reactions bring. Each round shows what the reading gained, lost, or
    changed since the last round, and from which reaction or material. -/
axiom purpose : (c : Context P) → Occ (purposeCoord (P := P)) c

/-- A place a version can live: a path, a reference, an address. -/
abbrev Location := String

/-- How a version is realized, carried on the version itself: narration in session text,
    re-presented as written; or an artifact at the location registered when it was made. The medium
    it is met in, and what that medium can and cannot show of the qualities the judgment concerns,
    are your reading of it. -/
inductive Realization
  | narration (text : String)
  | artifact (location : Location)

/-- One version, under the label every reaction to it and every recognition of it points at. -/
structure Version where
  ref      : Nat
  realized : Realization

/-- **Your record**, read from the context: every version produced so far, cumulative. -/
axiom versions : Context P → List Version

/-- Where a version is. `places`: where observations show it now — not the session text a
    narration lives in, so a narration has a place only where it was written and observed since;
    none for an artifact whose removal was observed. `pending`: what the person's words asked done
    to it that no observation yet shows done — a destination to write it to, a removal — each with
    the reason where it failed. Agreement on a home is not evidence that the move happened. -/
structure Whereabouts where
  places  : List Location
  pending : List String

/-- **Your reading** of where version `v` is and what is pending on it, from its realization, the
    person's words, and what was observed since. -/
axiom whereabouts : Context P → Version → Whereabouts

/-- A value the form carries, named as the standing shows it: "reading order: by scene", "stroke
    ends: brush". -/
abbrev Value := String

/-- Who first put a value forward: you, or the person. -/
inductive Proposer | draft | person

/-- What the turn that made a value stand did: gave it in its own words, or took a value put
    forward before. -/
inductive Standing | set | adopted

/-- What stands: the value, who first put it forward, and how it came to stand. -/
structure Determination where
  value    : Value
  proposer : Proposer
  standing : Standing

/-- **Your judgment**, the record rule: the cited turn makes `d` stand, read against the context
    as it now stands, on the scope the turn's words reach. Who proposed the value and how it stood
    are read separately. The proposer is whoever first put the value forward in the context —
    a value a version of yours embodied, or a reading of yours, was put forward by you. The
    standing is a positive reading of what the cited turn itself did: gave the value in its own
    words, a mark or a keep on a version among them (`set`); or took a value a round showed as
    yours, with what it rests on and your contrary grounds, before this turn (`adopted`). A value
    no person's turn reached stands on nothing and stays your proposal, however long it has gone
    unchallenged. A question, a request to see something, a bare mention, or a record of earlier
    work the turn passes along as material makes nothing stand. -/
axiom StandingSupported : Context P → Turn P → Determination → Prop

/-- One value the person holds: what stands, and the person's turn it stands on, with that
    turn's support. -/
structure Held (c : Context P) where
  det       : Determination
  src       : Cite c
  byPerson  : src.src.val = .person
  supported : StandingSupported c (c[src.idx]'src.lt) det

/-- **Your reading**: the values the person holds as the context now stands — each on the latest
    turn of theirs that makes it stand; a later turn of theirs may replace or retire one, and
    evidence against one is shown beside it while it stands. -/
axiom held : (c : Context P) → List (Held c)

/-- **Your record**: the lines of the record that are not the person's — what a check or a read
    established, with what it was checked against and what that leaves unchecked, and a choice you
    made within a grant the person gave, with that grant — each attributed to its source. None of
    them is a value the person holds, and none stands for their recognition. -/
axiom findings : Context P → List String

/-- **Your reading**: what stays open, re-read every round — a quality of the form no version's
    medium showed or no reference could check, a value no person's turn set, a request of theirs not
    yet realized in a version shown, material they entrusted to later versions that never came —
    each named. -/
axiom unestablished : Context P → List String

/-- **Your record**: your contrary grounds, each with what it bears on — a version, a value, a
    check, a medium, a premise every version shares, a comparison, what a closing reaches, or the
    run as a whole — and what it rests on, and the person's answer to it where they gave one;
    shown before the person's turn it bears on, as `present` says, and raised again only on new
    evidence. New evidence about a version they already judged — a defect in its rendering
    included — is shown as such in the next round. A closing over a contrary ground carries it.
    Empty when there were none. -/
axiom dissent : Context P → List String

/-- What the run has made and where it stands, read from one context: every version with where it
    is and what is pending on it, the purpose, the values the person holds, the findings, what
    stays open, and the dissent. -/
structure Record (c : Context P) where
  versions      : List (Version × Whereabouts)
  purpose       : Occ (purposeCoord (P := P)) c
  values        : List (Held c)
  findings      : List String
  unestablished : List String
  dissent       : List String

def recordOf (c : Context P) : Record c :=
  { versions := (versions c).map (fun v => (v, whereabouts c v)), purpose := purpose c,
    values := held c, findings := findings c, unestablished := unestablished c,
    dissent := dissent c }

/-- **Your judgment**: the latest utterance bears on this run — a closing, a purpose, a mark or a
    keep, a value set or taken, a request for a version or a change of medium, a request to write,
    move, or remove a version, a question about a version, a contrary ground answered — judged on
    what the whole utterance does, on the context with it; other work in an utterance that bears
    on the run neither closes it nor answers its judgments. An utterance about other work leaves
    the run as it stands: the session answers it, saying briefly, where reading it as other work
    was unclear, that the run was left as it stands; that answer stays in the context, and no gate
    of this run is raised. -/
axiom Reaches : Context P → Prop

/-- How the person ends the run. -/
inductive Closing
  /-- take this version, one they encountered, as the form -/
  | recognize (version : Nat)
  /-- end here with no version recognized -/
  | withdraw

/-- **Your judgment**: the cited turn — the latest utterance; a turn before the latest round closes
    nothing — closes the run this way, read whole on the context as it now stands, whatever form
    it takes. `recognize v`: the turn takes version `v`, one the person encountered as it was
    realized, as the form for the purpose as it stands, on the scope its words give. It reaches
    what that realization showed; a quality the realization did not show stays unestablished and
    holds no recognition back. Where the turn also marks the version or asks for changes, read the
    scope its words give: where they recognize what was shown on that scope, it closes, and the
    requests ride the record as open; where they make the requests conditions of recognizing, it
    closes nothing, and the version those requests produce is shown before anything is
    recognized. A recognition never reaches a version not yet shown. Taking the round adopts what
    it showed — the home a recognition would take, how you took an unclear turn — with no second
    permission; a home the person names in the turn is theirs, recorded as pending until a write
    there is observed. Where the turn's intent is unclear, it closes nothing. `withdraw`: the turn
    ends the run without recognizing a version, for whatever reason, given or not; what its words
    set stands in the record like any other turn's. Silence and other work end nothing, and your
    own reading that a version fits, that no encounter is still owed, or that the run cannot
    proceed closes nothing. -/
axiom ClosingSupported : Context P → Turn P → Closing → Prop

/-- Only the person closes. -/
def closeCoord : Coord P Closing :=
  { admits := (·.val = .person), supports := ClosingSupported }

/-- **Your reading**: the person's closing; `open_` until one reaches it. -/
axiom closing : (c : Context P) → Occ (closeCoord (P := P)) c

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- **Your judgment**: the latest utterance, read whole on the context with it, calls for a version
    none shown embodies — a mark to revise, a bare rejection with no diagnosis among them; a
    request; a fresh start; a combination to see; a change of medium; the means a held version was
    waiting on, supplied, or the person's word to go on in the medium at hand or without a
    reference that cannot be reached; or a value they set or replaced that no version shown
    embodies. A question about a version, answered as asked, and words that move nothing a version
    would show produce nothing; a value they took that a shown version already embodies needs no
    new version. Where a mark reads as about the rendering rather than the form, the next version
    fixes the rendering and leaves the form as it was, and the round says so; where the evidence
    does not settle which it is about, the round says that. -/
axiom ProductionRequested : Context P → Prop

/-- **Your read**, now, of what the next judgment needs, as far as relevant access reaches: the
    material the form draws on and the sources that bear on it — any a turn cites, and any you
    find — and whatever exists now that bears on it; read or run without changing existing state:
    what you create only to look is removed afterwards. Where a quality the versions carry answers
    to a standard outside both parties' preference — a glyph that is right or wrong, a fact a
    version states — the reference that standard is checked against is read, and every version is
    checked against it before it is shown, or, where the person goes on without a reference that
    cannot be reached, shown with that quality unchecked and unestablished; preference never
    certifies such a claim. What the
    context already holds from a read or a run is not read or run again unless the person asks for
    it again, or an utterance, evidence, or a change made in the session since says it moved. What
    you say you read, you read to the end. A run's result comes with what it ran on and what that
    leaves untested. What was reached and what was not, with what each unreached one would need,
    and any conflict among what was gathered, are named. Empty where nothing outside the context
    bears. -/
axiom gathered : Context P → List (Evidence P)

/-- The context with what `gathered` read now appended. -/
def consulted (c : Context P) : Context P := c ++ (gathered c).map (·.val)

/-- **Your carrying out** of what the person's latest words ask done to the versions shown before
    that turn — a version written to a home they named or took as the round showed it, a version
    removed at their word — each done and observed; what was tried and failed stays pending in
    `whereabouts` with its reason. No version is moved or removed without their words; one they
    said nothing about stays where it is. Empty where their words ask nothing done. -/
axiom carriedOut : Context P → List (Evidence P)

/-- The context with what `carriedOut` observed now appended. -/
def settle (c : Context P) : Context P := c ++ (carriedOut c).map (·.val)

/-- `RecognizedForm`: the version the person recognized, and the record built after what the
    recognizing turn asked done was observed. It records their recognition of fit for the purpose
    as it stands, on what the version showed — a witness of what they recognized, not a
    specification of what to build. -/
structure RecognizedForm (P : Type) where
  context : Context P
  version : Nat
  record  : Record context

/-- What a run hands on when the person ends it with no version recognized: the record built after
    what the withdrawing turn asked done was observed. -/
structure Closed (P : Type) where
  context : Context P
  record  : Record context

def recognizedOn (c : Context P) (v : Nat) : RecognizedForm P :=
  let c₁ := settle c
  ⟨c₁, v, recordOf c₁⟩

def closedOn (c : Context P) : Closed P :=
  let c₁ := settle c
  ⟨c₁, recordOf c₁⟩

inductive Outcome (P : Type)
  | notActivated (c : Context P) (why : String)
  | recognized   (r : RecognizedForm P)
  /-- `Withdrawn`: the person ended the run with no version recognized; the partial record -/
  | withdrawn    (r : Closed P)
  | holding      (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it. No gate, stage, or
count is stored: each round is judged afresh from the whole context.
-/

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances. Your turns are
`AITurns`: a production relays the intent — whole, with what changed — before anything is made,
gathers what the versions will be checked against, then makes them (`narrate` for narration, its
claims checked as it is written; for an artifact, the operations `producedBy` names), and gathers
what checking them needs; `respond` is the round, as TOOL GROUNDING's
`present` entry names it; `session` is the session's own answer to an utterance about other work,
which stays in the context without being a gate of this run.
-/

/-- Your turns. `narrate` writes each narration version; being yours, it grounds nothing. -/
structure AITurns (P : Type) where
  relay   : Context P → Response P
  narrate : Context P → List (Response P)
  respond : Context P → Response P
  session : Context P → Response P

/-- **Your production** of the artifact versions under the relayed intent: each artifact as
    observed at creation, written to the scratch place the session works in unless the person's
    words named a place for it, its location registered then. The observation evidences that the
    artifact exists there, and nothing about whether it fits.
    Guidance for every version a production makes, narration included, not steps it fixes: realize
    each in a medium in which the qualities the person's judgment concerns can be encountered;
    revise the retained versions the context calls for — a mark stays attached to what it marked,
    and the version revised need not be the version marked; a revision may draw on several
    versions, on a changed source, or start fresh where the person asks. Where the versions will be
    offered as alternatives, their differences are encounterable and what each implies
    recognizable, and a version that would not differ perceptibly on what is judged is not offered
    as another choice — alternatives that share a frame and differ on a few qualities, few enough
    to hold at once, carry their differences best. -/
axiom produce : Context P → List (Evidence P)

def production (ai : AITurns P) (c : Context P) : Context P :=
  let c₁ := c ++ [(ai.relay c).val]
  let c₂ := consulted c₁
  consulted (c₂ ++ (ai.narrate c₂).map (·.val) ++ (produce c₂).map (·.val))

open Classical in
/-- A turn about other work is answered by the session and leaves the run as it stands; a closing
    is read from the person's turn before anything is gathered, and its record is built after what
    that turn asked done is observed; otherwise what is gathered now enters the context, a
    production runs where the turn calls for a version none shown embodies, what the turn asks
    done to the versions is carried out, and the round follows. -/
def sketch (ai : AITurns P) : Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let f := fuse c u
    if ¬ Reaches f then sketch ai (f ++ [(ai.session f).val]) us
    else match filledValue (closing f) with
    | some (.recognize v) => .recognized (recognizedOn f v)
    | some .withdraw      => .withdrawn (closedOn f)
    | none =>
      let c₁ := consulted f
      let c₂ := if ProductionRequested c₁ then production ai c₁ else c₁
      let c₃ := settle c₂
      sketch ai (c₃ ++ [(ai.respond c₃).val]) us

def start (ai : AITurns P) (c : Context P) (us : List (Utterance P)) : Outcome P :=
  let c₀ := consulted c
  match notActivated c₀ with
  | some why => .notActivated c₀ why
  | none =>
    let c₁ := production ai c₀
    sketch ai (c₁ ++ [(ai.respond c₁).val]) us

/-! ── LOOP ──
Every round re-judges the whole run against the whole context: nothing counts rounds or counts
down, and no earlier answer is held apart from what later ones say. Neither "every earlier fit
stands" nor "every revision stales it" is a rule: what a person's words reached is read again on
the context as it now stands, and what changed since the standing they last answered is shown.
A production happens where the person's turn calls for a version none shown embodies, and nowhere
else: an insufficiency you find is shown with its basis and the revision you propose, and you
produce it once the person takes it up. Each production relays its intent whole, with what changed,
before it makes anything. The loop is dialogue: each round ends at the gate, and the person ends
the run; no round count, cap, or fatigue closes it.
-/

/-! ── CONVERGENCE ──
converged: a RecognizedForm — a version the person encountered and recognized for the purpose as
it stands, its record built by `recordOf` after what the recognizing turn asked done was observed.
Withdrawal keeps its partial record, built the same way. A recognition establishes the person's
judgment of fit for that purpose on what the version's medium showed; correctness against a
standard outside preference rests on the checks the findings name, and readiness for use on
nothing here; a contrary ground it was taken over rides it in the dissent. The convergence
evidence: the turn read as the closing, quoted, and the intent taken from it, and where it took a
reading the round before showed of an unclear turn, that earlier turn quoted too; at
RecognizedForm, the recognized version as it was encountered and where it is; at either closing,
the purpose as it stands, marked as yours where you read it, each part with what it rests on; every
version with where it is and what the person asked done to it that is not observed done, each
failure with its reason; the values the person holds, each with who proposed it and whether their
words set it or their turn took it; the findings with their sources; what stays unestablished; and
the dissent, each item with what it bears on, what it rests on, and the person's answer where they
gave one — a contrary ground first visible at the closing turn is shown here and attached, and the
closure stands. Demonstrated, not asserted.
-/

/-! ── TOOL GROUNDING ──
What each operation of this contract does. An interaction with the person is one of two kinds,
and its kind fixes how it continues once its text is presented.
-/

inductive Interaction | constitution | extension

inductive Continuation | stop | proceed

inductive Annot | sense | observe | track | transform | dispatch | interaction (kind : Interaction)

/-- Every interaction presents its text; a Constitution then stops for the person's turn, and an
    Extension proceeds. -/
def Interaction.realization : Interaction → Continuation
  | .constitution => .stop
  | .extension    => .proceed

inductive Op | detect | notActivatedRelay | gather | intentRelay | produce | produceDelegate
             | assess | present | readTurn | carryOut | assemble | converge | withdraw | seam

def grounding : Op → Annot × String
  | .detect            => (.sense, "Internal analysis: whether this is the protocol's case, as `notActivated` reads it")
  | .notActivatedRelay => (.interaction .extension, "before activation only: your `notActivated` reading, in plain words with its basis; not activated")
  | .gather            => (.observe, "artifact read, artifact search, record read, external fetch, environment run: what `gathered` reads or runs, now, as its doc states — at the start, after a production's relay and before any version is made, after its versions to check them, and on a turn that bears on the run and does not close it; what it returns enters the context as an evidence turn before the round that shows it")
  | .intentRelay       => (.interaction .extension, "the production intent whole before any version is made — your reading of the purpose, marked as yours unless they said it, each part with what it rests on, a default marked as one; what the next versions try, and which retained versions each revises or that it starts fresh; how many and, where they will be offered as alternatives, how they differ; the medium each is realized in, one this session can realize, and what it can show of the qualities the judgment concerns and what it cannot — a version whose judged quality only a medium this session cannot supply would show, or whose right-or-wrong quality only a reference it cannot reach would check, is not made yet: that capability is named, with what it would show or check, and the version waits until the person says to go on in the medium at hand, or, for a reference, without it; where each will be, as `produce` places it, and whether in a scratch place or inside a project whose history commits keep, and whether the place holds content no commit keeps; and the reference a standard outside both parties' preference is checked against — each with the basis that chose it. On every later production the whole intent again with what changed since the last relay; marking a change by its cause is welcome, not required. It yields no turn and settles nothing; any of it can be sent back at the next round")
  | .produce           => (.transform, "artifact write, environment run: what `produce` writes, as its doc states; a narration version writes no file — it is your own turn (`narrate`), recorded on the version")
  | .produceDelegate   => (.dispatch, "delegate (conditional, artifact versions): a version's write handed to execution, its location registered at creation; subordinate to the active runtime policy")
  | .assess            => (.sense, "Internal analysis: the purpose reading, what each version shows and does not, the standing, what stays unestablished, and your readings, over the whole fused context as it now stands")
  | .present           => (.interaction .constitution, "the round, every round the first included. After a production, each new version first, as encountered in its medium — narration as written, an artifact shown or walked through at its location, saying what was observed there or that it was not observed and what was tried — and what this realization does not show of the qualities the person's judgment concerns; a realization that leaves the judged quality unexposed — a figure shown as its source, a still standing for motion — is said to be so. Then the standing: what the person said of the purpose, and your reading of the rest, marked as yours, each part with what it rests on, and what it gained, lost, or changed since the last round, as `purpose` holds it; what the person's words set and on which version, and what of yours their turns took; what you propose not yet taken; what rests on a check or a read, with what it was checked against and what that leaves unchecked; what stays unestablished; what changed since the standing they last answered, the parts kept unchanged included; and where each version is — whether in a scratch place, and whether that will outlive the session as far as what the session observes of it shows, or inside a project whose history commits keep, and whether the place holds content no commit keeps — what the person asked done to it that is not observed done, with the reason where it failed, and the home a recognition would take where the context gives one, said the same way. How the standing is drawn is the realization's; no invented completion measure or fixed sequence of phases is shown as where the run stands. Then your readings with their basis — a mark you read as about the rendering rather than the form, or a reading that the run has reached a case `notActivated` names — each closing nothing; and your contrary grounds, as `dissent` holds them. Where versions are offered as alternatives, how they differ and what each implies; where a pick was made side by side and the form will be used alone, consider showing it alone, and a reading that a difference only the side-by-side view made salient carried the pick is a contrary ground. Where a version the run needs calls for a capability this session cannot supply — a medium it cannot show, a reference it cannot reach — name that capability, and set side by side what the medium at hand already lets the person judge and what only the missing one would let them encounter or check; the run holds there until they supply it, change the medium, go on in the medium at hand or without it, or end it. Where a consequential home the context leaves unresolved bears on a recognition, the round may ask it. Read the person's turn whole; where its intent was unclear, say in one line how you took it, asking nothing back where that settles nothing the person holds, and answer what they asked — a question about a version as asked. Every round ends on one opening the person can take, in their own words — mark or keep what they see, ask for a change, a combination, or another medium, take a version as the form, or end here")
  | .readTurn          => (.sense, "Internal analysis: whether the latest utterance bears on this run and what it does there — a closing, a purpose, a mark or a keep, a value set or taken, a request for a version, a question — read whole against the fused context as it now stands, as `Reaches`, `ClosingSupported`, `StandingSupported`, and `ProductionRequested` read it")
  | .carryOut          => (.transform, "artifact write, environment run: what `carriedOut` does, as its doc states; each write or removal observed")
  | .assemble          => (.sense, "Internal analysis: the terminal record, `recordOf`, built after what the closing turn asked done is observed, never before")
  | .converge          => (.interaction .extension, "the convergence evidence CONVERGENCE names; proceed with RecognizedForm")
  | .withdraw          => (.interaction .extension, "at the person's word, at any gate: what you took as withdrawn, and the partial record CONVERGENCE lists")
  | .seam              => (.interaction .extension, "after a recognition or not activating, the next move only from a chain the person declared, a routing policy they adopted, or their grant, citing that source; after a withdrawal, only to a next move the person declared with it; otherwise the record is handed on as session text, the dissent travelling in it; moving the form further into the work than the person named is their next move; every Constitution gate inside this protocol and the next fires unchanged")

/-- The operations that write a version, by realization: an artifact through `.produce`, and
    `.produceDelegate` where its write is handed to execution; narration writes no file. -/
def producedBy : Realization → List Op
  | .narration _ => []
  | .artifact _  => [.produce, .produceDelegate]

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Form resolution emergent via session context.
-/

end

end Hypotyposis
```

## Mode Activation

`/sketch` is user-invocable, and an invocation is read through `notActivated` before anything is produced. On the Hybrid path, the AI may propose it only with cited evidence that the form cannot be settled from descriptions — a plan that cannot reach its first draft, a description rewritten instead of made, a request to see something before saying more, or "I'd know it when I see it"; prior-session indices may seed that reading, never the user's judgment.

## Protocol

### Version rendering

Where the session can render a figure, a page, or a motion, show the version rendered rather than described or shown as its source. Give each version a label that names it alone, and let no label the round's opening offers name anything else. Where the session has a surface that stays in view, the standing can stay there as well.

## Rules

- **Round composition**: Compose each round so the reader can act without reassembly — use everyday language, keep each judgment beside its evidence and next-move implication, and place analytical context before its gate. Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, content belongs to another round or the convergence evidence, or whether text belongs before or inside the gate is in question.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
- **Contract execution**: As FLOW, the judgments' doc comments, LOOP, TOOL GROUNDING's `intentRelay` and `present` entries, and CONVERGENCE state.
