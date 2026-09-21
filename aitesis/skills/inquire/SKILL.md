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
  Collect(Uᵢ) → ∀u: push(u) until ¬advanceable(u) → land(u) → (Uᵣ, Uₚ, Uᵤ, Uₙ) →
  Surface(Uₚ ∪ Uᵤ ∪ Uₙ, Uᵣ) → proceed → converge(X')
  [a later utterance answers a surfaced item] integrate(A, X') → X'' → Collect(reopened) → …   -- each pass converges; an answer opens the next
-- push(u): one untried channel the AI can reach on its own, cheapest first; a tried channel is not re-selected
-- land(u): the state the item reached, the reason it reached no further, and the basis — written as fields on the item, read from the material by the model
-- Uᵣ resolved · Uₚ provisional (a finding with its shortfall declared) · Uᵤ the user's unknown · Uₙ detect-only

── MORPHISM ──
Prospect
  → scan(prospect, context)                    -- infer what the prospect leaves uncertain; open dimensions, no fixed taxonomy
  → collect(uncertainties, channels)           -- push each uncertainty through every channel the AI can reach on its own
  → land(uncertainty, state, reason, basis)    -- write what collection reached and why it reached no further
  → surface(landed, as_relay)                  -- hand what remains to the user as their own unknown; proceed
  → integrate(answer, prospect)                -- an answer, when it comes, is one more channel: reopen and collect again
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
Uncertainty = { domain: String, description: String, priority: Priority,
                context: Set(Evidence), tried: Set(Channel),
                state: Optional(State), reason: Optional(Reason), basis: Optional(String) }
             -- state, reason, basis are empty while the item is in Collect and written once at land(u); the judgment is the model's, the fields are the product
             -- basis: for Resolved, what sufficed and why; for Provisional, the finding and where its ground falls short; for UserUnknown, what was tried, or the contradiction quoted; for DetectOnly, what was seen
Evidence = { source: String, content: String }      -- attached during Collect; a run that observed nothing attaches its null result as content
Priority ∈ {Critical, Significant, Marginal}       -- orders the surfacing: information gain first
Channel  = a route the AI can read or run on its own for this item — artifact read, artifact search, record read, external fetch, history query, an observation run, a location or answer the user has already given ∪ Emergent(Channel)
             -- open set: which channels an item admits is read from the item, never from a table; what is fixed is that a tried channel is not re-selected
advanceable(u) = ∃ c ∈ channels(u) \ tried(u)      -- the AI can still push this item on its own; false both ends collection for u and hands u to the user
             -- false when every channel the item admits has been tried, when the item's answer lives only with the user, or when the item is not the AI's to collect
State ∈ {Resolved, Provisional, UserUnknown, DetectOnly}
             -- Resolved:     evidence settles the item
             -- Provisional:  a finding exists and its ground is short — a finding, never an absence
             -- UserUnknown:  no finding the AI can stand on; only the user can settle it, or nobody yet knows
             -- DetectOnly:   a finding that answers no uncertainty raised; surfaced as detected, on its own line
Reason ∈ {NotMine, CouldNot, OnlyYou} ∪ Emergent(Reason)   -- why an item reached no further; written for every state but Resolved
             -- NotMine: not the AI's to collect (another domain, another authority) · CouldNot: every channel tried, ground still short · OnlyYou: the answer lives with the user
contradiction(u) = the utterance contradicts itself or what was collected, and no channel settles it   -- lands UserUnknown with reason OnlyYou and the contradiction quoted in basis
A        = User answer, read from a later utterance that addresses a surfaced item
           ∈ {Provide(context), Point(location), Unknown(Partial), Dismiss(u), Sufficient}
             Partial     = what the user does say they know
             -- Provide / Point: one more channel for u; u reopens into Collect
             -- Unknown(Partial): the user does not know either; u stays UserUnknown, Partial attached, reason updated
             -- Dismiss(u): u → dismissed, the reason recorded on it
             -- Sufficient: the whole inquiry is declared enough; every Provisional and UserUnknown item → dismissed with the declaration recorded, DetectOnly items stand as detections
             -- premise: one utterance carries one disposition per item, and silence is none of them — an unanswered item is the user's unknown, which is the product, not a pending state
X'       = Updated prospect (context-enriched)
SufficientContext = X' where collecting = ∅
             -- every uncertainty has landed: what collection settled, what it found without full warrant, what is the user's to settle, what it only detected
             -- sufficiency is the exhaustion of the AI's own reach, not coverage of the task; open items that are the user's are the product, not a shortfall
ObservationSpec = { setup: Action, execute: Action, observe: Predicate, cleanup: Action }   -- an observation run is one channel; it yields evidence or nothing, never a disposition
Action   = capability call sequence (artifact write, environment run)
EscapeCondition ∈ {EnvironmentMutation, RiskElevated}
             -- pre-run judgments only: each names a reason an observation MUST NOT run; a channel declined this way counts as tried and is logged in observation_skips
             -- duration is not a member: a run that hits its budget yields evidence (its null result), while declining to run yields none

── PHASE TRANSITIONS ──
Phase 0: X → Scan(X) → Uᵢ?                                              -- context sufficiency checkpoint (silent)
       [Uᵢ = ∅] sufficiency_relay(reasoning) → proceed                    -- zero-signal: present the sufficiency finding as relay text; trivial SufficientContext (collecting = ∅), Aitesis not activated
Phase 1: Uᵢ → collecting := collecting ∪ Uᵢ →
         Step₁ ∀u ∈ collecting: while advanceable(u): push(u, c) → tried(u) += c, context(u) += evidence   -- collection over the AI's own channels, cheapest first; an observation run is one such channel, its escape logged when it must not run; a contradiction(u) no channel settles ends the loop for u [Tool]
         Step₂ land(u) → state(u), reason(u), basis(u) → u: collecting → resolved | provisional | user_unknown | detect_only   -- the item's record is written; the judgment is the model's, the fields are the product (track)
Phase 2: Surface(provisional ∪ user_unknown ∪ detect_only, resolved, priority) → proceed   -- relay: each landed item beside its state, reason, basis, and what an answer would change [Tool]
Phase 3: A → integrate(A, X') → X''                                        -- fires when a later utterance answers a surfaced item (track: mutates Λ)
         [A = Provide ∨ A = Point] u → collecting, tried(u) += user, context(u) += answer → goto Phase 1
         [A = Unknown(Partial)] u stays in user_unknown; context(u) += Partial; reason(u) := the user does not know either
         [A = Dismiss(u)] u → dismissed
         [A = Sufficient] provisional ∪ user_unknown → dismissed, the declaration recorded on each → converge

── LOOP ──
After Phase 1 every item has landed, so collecting = ∅ holds by construction: Phase 2 surfaces and the pass converges.
An answer to a surfaced item (Phase 3) opens the next pass: the item re-enters collecting with the answer as one more tried channel, and Phase 1 pushes it again. Uncertainties an answer exposes accumulate into uncertainties (cumulative, never replace).
Nothing here holds the turn for that answer. Silence leaves the surfaced items as the user's unknown, and that is the product, not a pending state.
Continue until: sufficient(X').
Convergence evidence: at collecting = ∅, present the transformation trace — for every u ∈ uncertainties, one pair (ContextInsufficient(u) → landing(u)): a resolved item with what sufficed; a provisional item with its finding and where the ground falls short; a user-unknown item with its reason — only the user can settle it, or nobody yet knows — and what was tried; a detect-only item as detected, answering no uncertainty raised, with its reason; a dismissed item with the reason or declaration recorded. No item is declared out of scope without its own line. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
sufficient(X') = collecting = ∅              -- every uncertainty has landed in a state; the AI's own reach is exhausted
                                              -- user_unknown ≠ ∅ does not block convergence: what remains is surfaced as the user's, which is the product

── TOOL GROUNDING ──
-- Realization: Extension → TextPresent+Proceed. No Constitution entry: whether a turn halts is the harness's baseline, so this file inscribes only what is presented and what an answer, when one comes, changes
Phase 0 Scan    (sense)       → Internal analysis (no external tool)
Phase 0 sufficiency_relay (extension) → TextPresent+Proceed (Uᵢ = ∅: present the sufficiency finding with reasoning; proceed with X unchanged, trivial SufficientContext)
Phase 1 push    (observe)     → artifact read, artifact search, record read (stored knowledge: codebase, memory, references); external fetch (conditional: canonical external sources — RFCs, vendor API docs, standards; `source: "web:{url}"` tag, cross-checked against the codebase version so a page that may be stale lands the item Provisional rather than Resolved); environment run (conditional: read-only commit-log queries via subprocess — content pickaxe, message search, temporal range; `source: "history:{ref}"` tag)
Phase 1 Observe (transform)   → artifact write, environment run, artifact read (an observation run as one channel, shaped by ObservationSpec — setup, execute, observe, cleanup via environment run; a run that resolves nothing attaches its null result as evidence and the item continues to its next channel — it never lands on the run alone)
Phase 1 land    (track)       → Internal state update (advanceable(u) false → state, reason, basis written on u and u moved out of collecting; a source tried and a channel declined under an EscapeCondition both enter tried(u), the latter also observation_skips)
Phase 2 Surface (extension)   → TextPresent+Proceed (relay: every landed item that is not Resolved, in priority order, each beside its state, its reason, its basis — the finding and where its ground falls short, the channels tried, the contradiction quoted — and what an answer would change; then proceed. The presentation is owed unconditionally; the turn is not held for a reply)
Phase 3 integrate (track)     → Internal state update (an answer read from a later utterance: Provide and Point reopen the item with the answer as one more tried channel; Unknown(Partial) attaches Partial and updates the reason; Dismiss(u) moves u to dismissed; Sufficient moves every provisional and user_unknown item to dismissed with the declaration recorded)
converge     (extension)      → TextPresent+Proceed (convergence evidence trace, one pair per uncertainty including the dismissed and the detect-only; proceed with SufficientContext)
sufficiency  (extension)      → TextPresent+Proceed (fires on A = Sufficient: present the dismissed set with the declaration recorded against each, so the trace shows what was accepted unresolved rather than asserting resolution)
seam         (extension)      → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol settles the next move; proceed directly to it, citing that settling source)

── MODE STATE ──
Λ = { phase: Phase, X: Prospect, uncertainties: Set(Uncertainty),
      collecting: Set(Uncertainty),        -- items still advanceable
      resolved: Set(Uncertainty),          -- state = Resolved
      provisional: Set(Uncertainty),       -- state = Provisional
      user_unknown: Set(Uncertainty),      -- state = UserUnknown
      detect_only: Set(Uncertainty),       -- state = DetectOnly
      dismissed: Set(Uncertainty),         -- disposed by the user, per item or by declaration; the reason recorded on the item
      history: List<(Uncertainty, A)>, observation_history: List<(ObservationSpec, Evidence)>,
      observation_skips: List<(Uncertainty, EscapeCondition, String)>,   -- audit trail: channels declined before running (a run that ran and resolved nothing is in observation_history, never here)
      active: Bool,
      cause_tag: String }
-- Invariant: uncertainties = collecting ∪ resolved ∪ provisional ∪ user_unknown ∪ detect_only ∪ dismissed (pairwise disjoint)
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
- **Round composition**: Compose each round so the reader can act on it without reassembling it — use everyday language, keep the judgment beside its nearest evidence and next-move implication, and place analytical context before the gate.
- **Option-set relay test**: Surfacing is a relay: it presents and proceeds. An item lands where the material puts it; the user's answer, when it comes, is one more channel, not a gate this protocol holds.
- **Judgment is the model's, the product is a field**: Which state an item reached and why are judged from the material, and the judgment is written into `state`, `reason`, and `basis` on the item. A sentence is not a substitute for an empty field.
- **Collection yields evidence or nothing, never a disposition**: An observation that resolved nothing attaches its null result and the item moves to its next channel. Only the user's answer disposes of an item, and a declaration of sufficiency reaches every unresolved item, observed or not.
- **Finding and completion stay apart**: That an item carries a provisional finding says nothing about whether collection is complete. Completion is `advanceable(u)` false for every item, judged on channels, never on findings.
- **Boundary named, not crossed**: For every item that is not Resolved, say what was tried, what was found, and where it falls short; leave disposition to the user. What lies past the AI's reach is another deficit, read from the trace by whatever routes the turn after.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction forward until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
