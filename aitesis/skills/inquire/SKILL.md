---
name: inquire
description: "Collect every piece of context the AI can reach on its own, then hand back what it cannot reach as the user's own unknown. Type: (ContextInsufficient, AI, INQUIRE, Prospect) → SufficientContext"
---

# Aitesis Protocol

Collect every piece of context the AI can reach on its own, then hand back what it cannot reach as the user's own unknown. Type: `(ContextInsufficient, AI, INQUIRE, Prospect) → SufficientContext`.

## Definition

**Aitesis** (αἴτησις): A dialogical act of collecting context to the limit of the AI's own reach, where AI infers what the prospect leaves uncertain, pushes each uncertainty through every channel it can read or run on its own until no channel is left, writes down for each one what that reached — a fact that settles it, a finding whose ground it declares short, a detection that answers no uncertainty raised, or nothing — and hands what only the user can settle, or nobody yet knows, back to the user as their own unknown. The beneficiary is the user's epistemic state; the AI's collection is the instrument. Whether a turn halts on that handoff belongs to the harness; this contract inscribes what is presented and what an answer, when one comes, changes.

```
── FLOW ──
Aitesis(X) → Scan(X) → Uᵢ →
  [if Uᵢ = ∅] sufficiency_relay(reasoning) → proceed (trivial SufficientContext)
  Pass(X): W := Scan(X) ∪ live → ∀u ∈ W: push(u) until ¬advanceable(u) → ∀u ∈ W: land(u) → (Uᵣ, Uₚ, Uᵤ, Uₙ) → X' := enrich(X, landed) →
  [the pass changed something] Pass(X') → …   [it changed nothing] Surface(Uₚ ∪ Uᵤ ∪ Uₙ, Uᵣ) → proceed → converge(X')
  [a later utterance answers a surfaced item] integrate(A, X') → X'' → Pass(X'') → …   -- an answer is one more channel; the next pass re-reads everything
  [A = Sufficient] integrate(A, X') → X'' → converge(X'')                               -- the one answer that opens no pass: the inquiry is declared enough and what remains is dismissed with the declaration
-- live: every uncertainty not dismissed — the pass is the unit, and every pass pushes and lands the whole of it again
-- push(u): one untried channel the AI can reach on its own, cheapest first; a tried channel is not re-selected
-- land(u): the state the item reached, the reason it reached no further, and the basis — written as fields on the item, read from the material by the model; written at every pass, the same where nothing moved
-- enrich: the landed records written into the prospect — the pass's product
-- Uᵣ resolved · Uₚ provisional (a finding with its shortfall declared) · Uᵤ the user's unknown · Uₙ detect-only

── MORPHISM ──
Prospect
  → scan(prospect, context)                    -- infer what the prospect leaves uncertain; open dimensions, no fixed taxonomy
  → collect(uncertainties, channels)           -- push each uncertainty through every channel the AI can reach on its own
  → land(uncertainty, state, reason, basis)    -- write what collection reached and why it reached no further — every item, every pass
  → enrich(prospect, landed)                   -- write the landed records into the prospect: X → X'; a pass that changed something is followed by another
  → surface(landed, as_relay)                  -- hand what remains to the user as their own unknown; proceed
  → integrate(answer, prospect)                -- an answer, when it comes, is one more channel: the next pass re-reads everything on it
  → SufficientContext
requires: uncertain(sufficiency(X))            -- runtime checkpoint (Phase 0)
deficit:  ContextInsufficient                  -- activation precondition (Layer 1/2)
preserves: task_identity(X)                    -- task intent invariant; prospect context mutated (X → X')
invariant: Evidence over Inference over Detection
invariant: Judgment is the model's, the product is a field   -- which state an item reached is judged from the material; that it reached it is written on the item

── TYPES ──
X        = Prospect for action (source-agnostic: planning, task execution, analysis, investigation, or any purposeful action requiring context)
             -- Input type: morphism processes X uniformly; enumeration scopes the definition, not behavioral dispatch
Scan     = Context sufficiency scan: X → Set(Uncertainty)
             -- infers across whatever the prospect leaves open — a missing fact, a contradiction between the utterance and what was collected, a relevance gap; no fixed taxonomy
             -- and registers, as an item of its own, a finding the material now in the prospect carries that answers nothing raised — the item lands DetectOnly at Step₂, and the question the material was collected for keeps its own record beside it
Uncertainty = { domain: String, description: String, priority: Priority,
                context: Set(Evidence), tried: Set(Channel),
                state: Optional(State), reason: Optional(Reason), basis: Optional(String) }
             -- state, reason, basis are empty until the item's first landing and rewritten at every landing after it — the same where the material did not move, differently where it did; the judgment is the model's, the fields are the product
             -- basis: for Resolved, what sufficed and why; for Provisional, the finding and where its ground falls short; for UserUnknown, what was tried, or the contradiction quoted; for DetectOnly, what was seen
Evidence = { source: String, content: String }      -- attached to the item pushed, during Collect; a run that observed nothing attaches its null result as content. What the evidence means for any other item is read at that item's next landing, not bookkept per event
Priority ∈ {Critical, Significant, Marginal}       -- orders the surfacing: information gain first
Channel  = a route the AI can read or run on its own for this item — artifact read, artifact search, record read, external fetch, history query, an observation run, a location or answer the user has already given ∪ Emergent(Channel)
             -- open set: which channels an item admits is read from the item, never from a table; what is fixed is that a tried channel is not re-selected
advanceable(u) = ∃ c ∈ channels(u) \ tried(u)      -- the AI can still push this item on its own; false both ends collection for u and hands u to the user
             -- false when every channel the item admits has been tried, when the item's answer lives only with the user, or when the item is not the AI's to collect
             -- whether an untried channel is still worth reaching for is part of the judgment: a channel whose expected yield no longer justifies pushing it on the AI's own is not one the item admits, and that reading — the model's, recorded on the item as which way it fell — is what bounds a pass over an open channel set
State ∈ {Resolved, Provisional, UserUnknown, DetectOnly}
             -- Resolved:     evidence settles the item
             -- Provisional:  a finding exists and its ground is short — a finding, never an absence
             -- UserUnknown:  no finding the AI can stand on; only the user can settle it, or nobody yet knows
             -- DetectOnly:   a finding that answers no uncertainty raised; surfaced as detected, on its own line
Reason ∈ {NotMine, CouldNot, OnlyYou} ∪ Emergent(Reason)   -- why an item reached no further; written for every state but Resolved
             -- NotMine: not the AI's to collect (another domain, another authority) · CouldNot: every channel tried, ground still short · OnlyYou: the answer lives with the user
contradiction(u) = the utterance contradicts itself or what was collected, and no channel settles it   -- lands UserUnknown with the contradiction quoted in basis; the reason is judged like any other landing — OnlyYou where the conflict is one of intent (the user's own words against each other, or against what they asked for), CouldNot where it is one of fact that no channel the AI can reach settles, Emergent otherwise
A        = User answer, read from a later utterance that addresses a surfaced item
           ∈ {Provide(context), Point(location), Unknown(Partial), Dismiss(u), Sufficient}
             Partial     = what the user does say they know
             -- Provide / Point: one more channel for u — its content attaches to u, the user counts as tried, and the next pass pushes and lands u on it
             -- Unknown(Partial): the user does not know either; Partial attaches to u the same way, and the next landing carries the user's not-knowing in its basis
             -- Dismiss(u): u → dismissed, the reason recorded on it
             -- Sufficient: the whole inquiry is declared enough; every Provisional and UserUnknown item → dismissed with the declaration recorded, DetectOnly items stand as detections
             -- every answer but Sufficient opens the next pass, which re-reads every live item on the integrated prospect and scans it for what the answer exposes
             -- premise: one utterance carries one disposition per item, and silence is none of them — an unanswered item is the user's unknown, which is the product, not a pending state
live     = uncertainties \ dismissed             -- what a pass works on: derived from the sets below at the moment the pass begins, holding no state of its own
X'       = Updated prospect (context-enriched): the prospect with every landed record written into it, produced at the end of each pass — X' after the first pass, and written in place into X'', the prospect an answer was integrated into, after a later one, so no third prime is needed
SufficientContext = X' after a pass that changed nothing
             -- a pass that opened no item, tried no channel, and changed no landing: the AI's own reach is exhausted and every landing stands on the whole material
             -- what stands: what collection settled, what it found without full warrant, what is the user's to settle, what it only detected
             -- sufficiency is the exhaustion of the AI's own reach, not coverage of the task; open items that are the user's are the product, not a shortfall
ObservationSpec = { setup: Action, execute: Action, observe: Predicate, cleanup: Action }   -- an observation run is one channel; it yields evidence or nothing, never a disposition
Action   = capability call sequence (artifact write, environment run)
EscapeCondition ∈ {EnvironmentMutation, RiskElevated}
             -- pre-run judgments only: each names a reason an observation MUST NOT run; a channel declined this way counts as tried and is logged in observation_skips
             -- duration is not a member: a run that hits its budget yields evidence (its null result), while declining to run yields none

── PHASE TRANSITIONS ──
Phase 0: X → Scan(X) → Uᵢ?                                              -- context sufficiency checkpoint (silent)
       [Uᵢ = ∅] sufficiency_relay(reasoning) → proceed                    -- zero-signal: present the sufficiency finding as relay text; trivial SufficientContext (nothing to collect), Aitesis not activated
Phase 1: one pass over the whole live set
         Step₀ W := Scan(Λ.X) ∪ live → uncertainties ∪= W                 -- the working set: what this scan raises (Uᵢ on the first pass; later, what the enriched or integrated prospect now leaves open, and a finding the collected material carries that answers nothing raised — opened here as its own item, so the question it was collected for keeps its own record beside it) and every item not dismissed
         Step₁ ∀u ∈ W: while advanceable(u): push(u, c) → tried(u) += c, context(u) += evidence   -- collection over the AI's own channels, cheapest first; an observation run is one such channel, its escape logged when it must not run; a contradiction(u) no channel settles ends the loop for u [Tool]
         Step₂ ∀u ∈ W: land(u) → state(u), reason(u), basis(u) → u ∈ resolved | provisional | user_unknown | detect_only   -- every item is landed again on the material as it now stands; a landing the material did not move is written the same; the judgment is the model's, the fields are the product (track)
         Step₃ Λ.X := enrich(Λ.X, uncertainties)                            -- the records are written into the prospect, the pass's product — X → X' on the first pass, in place on X'' after an answer (track)
         [the pass opened an item, tried a channel, or changed a landing] goto Phase 1   -- what one item's evidence means for another, and what it newly leaves open, is read by the next pass rather than propagated per event
         [the pass changed nothing] → Phase 2
Phase 2: Surface(provisional ∪ user_unknown ∪ detect_only, resolved, priority) → proceed   -- relay: each landed item beside its state, reason, basis, and what an answer would change [Tool]
Phase 3: A → integrate(A, X') → X''                                        -- fires when a later utterance answers a surfaced item (track: mutates Λ)
         [A = Provide ∨ A = Point ∨ A = Unknown(Partial)] tried(u) += user, context(u) += the answer's content → goto Phase 1   -- the next pass pushes u where the material opens a channel and lands every live item on the integrated prospect, so a finding the answer refutes — u's or another item's — is not kept on its old basis; for Unknown, u's next landing carries that the user does not know either
         [A = Dismiss(u)] u → dismissed → goto Phase 1                       -- dismissed leaves live; the pass that follows re-reads the rest and converges at once where nothing moved
         [A = Sufficient] provisional ∪ user_unknown → dismissed, the declaration recorded on each → converge

── LOOP ──
The pass is the unit. Each pass scans the prospect as it now stands, pushes every live item through the channels still open to it, lands every live item again on the whole material, and writes the records into the prospect. A pass is followed by another while it changed something — opened an item, tried a channel, changed a landing. What bounds the loop is the stopping judgment advanceable(u) carries, together with the monotone tried set: tried(u) only grows and a tried channel is not re-selected, and a channel no longer worth reaching for on the AI's own is not one the item admits, so "the pass changed nothing" is reached by that judgment, not by exhausting an enumeration the open channel set never closes. A pass cap is not a member of this contract, as duration is not a member of EscapeCondition. A run that keeps discovering lands what it has at the point the judgment says stop and surfaces the rest as the user's unknown — the residual is preserved, never a stall. Uncertainties accumulate (cumulative, never replace); a dismissed item never re-enters a pass.
A pass that changed nothing converges: Phase 2 surfaces. An answer to a surfaced item (Phase 3) is one more channel and opens the next pass, which re-reads everything on the integrated prospect — what the answer settles, what it refutes elsewhere, what it exposes. Sufficient is the one answer that opens no pass: it dismisses what remains with the declaration and converges at once.
Nothing here holds the turn for that answer. Silence leaves the surfaced items as the user's unknown, and that is the product, not a pending state.
Continue until: sufficient(X').
Convergence evidence: at a pass that changed nothing, present the transformation trace — for every u ∈ uncertainties, those the first scan raised and those a later pass opened alike, one pair (ContextInsufficient(u) → landing(u)): a resolved item with what sufficed; a provisional item with its finding and where the ground falls short; a user-unknown item with its reason — only the user can settle it, or nobody yet knows — and what was tried; a detect-only item as detected, answering no uncertainty raised, with its reason; a dismissed item with the reason or declaration recorded. No item is declared out of scope without its own line. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
sufficient(X') = the last pass changed nothing   -- it opened no item, tried no channel, changed no landing: the AI's own reach is exhausted — as advanceable(u) judges it, a reasonable stopping point rather than an enumeration run dry — and every landing stands on the whole material, including what an answer added
                                                 -- user_unknown ≠ ∅ does not block convergence: what remains is surfaced as the user's, which is the product

── TOOL GROUNDING ──
-- Realization: Extension → TextPresent+Proceed. No Constitution entry: whether a turn halts is the harness's baseline, so this file inscribes only what is presented and what an answer, when one comes, changes
Phase 0 Scan    (sense)       → Internal analysis (no external tool)
Phase 0 sufficiency_relay (extension) → TextPresent+Proceed (Uᵢ = ∅: present the sufficiency finding with reasoning; proceed with X unchanged, trivial SufficientContext)
Phase 1 push    (observe)     → what a channel yields attaches to the item pushed; the channels: artifact read, artifact search, record read (stored knowledge: codebase, memory, references); external fetch (conditional: canonical external sources — RFCs, vendor API docs, standards; `source: "web:{url}"` tag, cross-checked against the codebase version so a page that may be stale lands the item Provisional rather than Resolved); environment run (conditional: read-only commit-log queries via subprocess — content pickaxe, message search, temporal range; `source: "history:{ref}"` tag)
Phase 1 Observe (transform)   → artifact write, environment run, artifact read (an observation run as one channel, shaped by ObservationSpec — setup, execute, observe, cleanup via environment run; a run that resolves nothing attaches its null result as evidence and the item continues to its next channel — it never lands on the run alone)
Phase 1 land    (track)       → Internal state update (every live item, every pass: state, reason, basis written on u from the material as it now stands, and u placed in the set its state names; a source tried and a channel declined under an EscapeCondition both enter tried(u), the latter also observation_skips)
Phase 1 enrich  (track)       → Internal state update (Λ.X := enrich(Λ.X, uncertainties) — the landed records written into the prospect once every live item has landed; whether the pass changed anything is read here, and decides whether another pass follows)
Phase 2 Surface (extension)   → TextPresent+Proceed (relay: every landed item that is not Resolved, in priority order, each beside its state, its reason, its basis — the finding and where its ground falls short, the channels tried, the contradiction quoted — and what an answer would change; then proceed. The presentation is owed unconditionally; the turn is not held for a reply)
Phase 3 integrate (track)     → Internal state update (an answer read from a later utterance: Provide, Point and Unknown(Partial) attach the answer's content to the item and count the user as tried; Dismiss(u) moves u to dismissed; Sufficient moves every provisional and user_unknown item to dismissed with the declaration recorded. Every answer but Sufficient opens the next pass; nothing else is bookkept here — what the answer means for other items and what it exposes is read by that pass)
converge     (extension)      → TextPresent+Proceed (convergence evidence trace after a pass that changed nothing, one pair per uncertainty including the dismissed and the detect-only; proceed with SufficientContext)
sufficiency  (extension)      → TextPresent+Proceed (fires on A = Sufficient: present the dismissed set with the declaration recorded against each, so the trace shows what was accepted unresolved rather than asserting resolution)
seam         (extension)      → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol settles the next move; proceed directly to it, citing that settling source)

── MODE STATE ──
Λ = { phase: Phase, X: Prospect, uncertainties: Set(Uncertainty),
      resolved: Set(Uncertainty),          -- state = Resolved
      provisional: Set(Uncertainty),       -- state = Provisional
      user_unknown: Set(Uncertainty),      -- state = UserUnknown
      detect_only: Set(Uncertainty),       -- state = DetectOnly
      dismissed: Set(Uncertainty),         -- disposed by the user, per item or by declaration; the reason recorded on the item, the state it landed in kept
      history: List<(Uncertainty, A)>, observation_history: List<(ObservationSpec, Evidence)>,
      observation_skips: List<(Uncertainty, EscapeCondition, String)>,   -- audit trail: channels declined before running (a run that ran and resolved nothing is in observation_history, never here)
      active: Bool,
      cause_tag: String }
-- Invariant: uncertainties = resolved ∪ provisional ∪ user_unknown ∪ detect_only ∪ dismissed (pairwise disjoint), read between passes; an item a pass has raised and not yet landed is in uncertainties and in no set, and the pass's working set W is derived (Scan ∪ live), holding no state of its own
-- dismissed is entered only through A: the AI never disposes of an item — collection yields evidence or nothing

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
```

## Mode Activation

`/inquire` remains directly invocable. During AI-guided activation, loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind.

### Prior-decision scan

When a prospect touches architecture decisions, API or protocol design, persisted state schemas, or user-facing behavior commitments, begin Phase 1 with a bounded scan over persistent memory and project-local prior-decision history even without an explicit reference. Prior-session recall indices may seed Phase 0; they are one channel among the others, and current evidence governs what an item lands as.

### Activation exceptions

Skip AI-guided activation when the user explicitly requests proceeding without context verification or when no prospect exists to verify. A dismissed `(domain, description)` pair stays skipped for the current session.

### Accumulation signal

When `observation_skips` across at least three sessions cluster around one `EscapeCondition` with a consistent rationale, revisit what counts as a channel the AI may run on its own.

## Protocol

### User-facing realization

At Phase 2, render each landed item in everyday language: what was found, the state it reached, why it reached no further, and the basis — beside what an answer would change. Order by priority. Say plainly which items are the user's to settle and which the AI found without full warrant; name a detect-only finding as one, on its own line. State what the protocol takes if an answer comes — a fact, a place to look, "I don't know either", a dismissal, "that is enough" — without holding the turn for it. Keep every landing open to free-response correction.

Frame the uncertainty currently in play rather than emitting a completion tally. Read `references/round-composition.md` before composing when terminology must remain stable across the session, wording must be carried unchanged, material belongs to another round or trace, or phase order determines whether text belongs before or inside a relay.

### Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Marginal priority items only | Brief relay: each item with its state and basis in one line |
| Medium | Significant priority items, collection partially resolved | Structured relay framing each item beside its evidence and what an answer would change |
| Heavy | Critical priority, several unresolved items | Detailed evidence + channels tried + findings with their shortfalls + the user's unknowns named as such |

## Rules

- **Recognition over Recall**: Present each landed item with its state, reason, and basis, so the reader recognizes what remains rather than reconstructing it.
- **Round composition**: Compose each round so the reader can act on it without reassembling it — use everyday language, keep the judgment beside its nearest evidence and next-move implication, and place analytical context before the relay.
- **Option-set relay test**: Surfacing is a relay: it presents and proceeds. An item lands where the material puts it; the user's answer, when it comes, is one more channel, not a gate this protocol holds.
- **Judgment is the model's, the product is a field**: Which state an item reached and why are judged from the material, and the judgment is written into `state`, `reason`, and `basis` on the item. A sentence is not a substitute for an empty field.
- **Collection yields evidence or nothing, never a disposition**: An observation that resolved nothing attaches its null result and the item moves to its next channel. What that evidence means for another item is read at that item's next landing, not decided when it lands. Only the user's answer disposes of an item, and a declaration of sufficiency reaches every unresolved item, observed or not.
- **Finding and completion stay apart**: That an item carries a provisional finding says nothing about whether collection is complete. Completion is a pass that changed nothing — no channel left to try for any live item and no landing that moved — judged on channels and landings, never on how a finding reads.
- **Boundary named, not crossed**: For every item that is not Resolved, say what was tried, what was found, and where it falls short; leave disposition to the user. What lies past the AI's reach is another deficit, read from the trace by whatever routes the turn after.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction forward until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
