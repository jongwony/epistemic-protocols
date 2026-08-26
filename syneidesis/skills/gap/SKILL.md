---
name: gap
description: "Gap surfacing before decisions. Raises procedural, consideration, assumption, and alternative gaps as questions when gaps go unnoticed, producing an audited decision. Type: (GapUnnoticed, AI, SURFACE, Decision) → AuditedDecision. Alias: Syneidesis(συνείδησις)."
---

# Syneidesis Protocol

Surface unnoticed gaps at decision points through questions, enabling user to reach an audited decision. Type: `(GapUnnoticed, AI, SURFACE, Decision) → AuditedDecision`.

## Definition

**Syneidesis** (συνείδησις): A dialogical act of surfacing potential gaps—procedural, consideration, assumption, or alternative—at decision points, transforming unnoticed gaps into questions the user can evaluate.

```
── FLOW ──
Syneidesis(D, Σ) → Scan(D) → G → AssessGapPressure(D, G) → P → Sel(P, D) → Gₛ → Q(Gₛ) → J → A(J, D, Σ) → Σ'

── MORPHISM ──
Decision
  → scan(decision, context)           -- identify gaps implicit in decision
  → assess_pressure(decision, gaps, context) -- classify why each detected gap deserves attention now
  → select(gaps, pressure, stakes)    -- prioritize by pressure and stakes
  → surface(gap, as_question)         -- present gap as question
  → judge(user_response)              -- collect user judgment
  → AuditedDecision
requires: committed(Decision)           -- runtime checkpoint (Phase 0)
deficit:  GapUnnoticed                  -- activation precondition (Layer 1/2)
preserves: D                            -- read-only throughout; morphism acts on Σ only
invariant: Surfacing over Deciding

── TYPES ──
D      = Decision point ∈ Committed × Stakes × Context
Committed = committed(D) ≡ ∃ A : mutates_state(A) ∨ externally_visible(A) ∨ consumes_resource(A)
Stakes = {Low, Med, High}
G      = Gap ∈ {Procedural, Consideration, Assumption, Alternative} ∪ Emergent(G)
Scan   = Detection: D → Set(G)                      -- gap identification
Context = Observable decision context from session, codebase, and cited evidence
AssessGapPressure = Gap pressure classification: D × Set(G) → P  -- Context is projected from D
P      = GapPressureMap { load_bearing, cheap_to_settle, hidden_high_impact, nonblocking, queued }
partition(P, G) = G = P.load_bearing ⊔ P.cheap_to_settle ⊔ P.hidden_high_impact ⊔ P.nonblocking ⊔ P.queued
load_bearing = Set(G) whose resolution materially changes the decision
cheap_to_settle = Set(G) settleable with one low-cost confirmation
hidden_high_impact = Set(G) ⊆ G that Scan flagged low-confidence but decision-changing if real -- tightly capped (|hidden_high_impact| ≤ 1); admitted only when it could materially change the user's next judgment
nonblocking = Set(G) compatible with proceed(Σ) this cycle
queued = Set(G) routed to Σ.deferred for later review
Sel    = Selection: P × D → Gₛ                     -- prioritize by pressure and stakes
Gₛ     = Selected gaps (|Gₛ| ≤ 2)
Q      = Question formation (assertion-free)
J      = Judgment ∈ {Address(c), Dismiss, Probe}
c      = Clarification (user-provided response to Q)
A      = Adjustment: J × D × Σ → Σ'
C      = GapCarrier: the ONE durable entry every registered gap is written into — a single dereferenceable record, so one read reconstructs the whole gap set rather than reassembling it from scattered records or from session memory
GapLocator = { record: C's identity as the carrier-creating write returned it, session: the id of the session that wrote it }   -- substrate-neutral by construction: the identity is whatever that write returned, so this type never names what performs the write
locator(C) = GapLocator { record: C's identity as the carrier-creating call returned it; session: the id of the session running that call }   -- the value Σ.carrier holds; which call creates the carrier is named in TOOL GROUNDING, so a host without that capability still types this
registered = the gaps C carries   -- the set AuditedDecision quantifies over and the audit trace ranges over
entry(g)   = the record C carries for g ∈ registered — the gap's question and its context, and once closed the status, the user's judgment, and the adjustment that judgment produced. The last two are there because the audit trace reads them: a carrier holding status alone recovers which gaps are left and loses what was decided about the rest
status(g)  = entry(g).status ∈ {open, completed}
open(registered) = { g ∈ registered : status(g) ≠ completed }   -- what a recovered carrier contributes to pressure assessment and selection. The audit trace still ranges over registered WHOLE, so a gap already judged is reachable as evidence without being put to the user a second time
Σ      = State { reviewed: Set(G), deferred: List(G), blocked: Bool, carrier: Option(GapLocator) }
AuditedDecision = Σ' where ∀ g ∈ registered: status(g) = completed

── PHASE TRANSITIONS ──
Phase 0: D → committed?(D) → [locator in scope: DereferenceCarrier → registered; Σ.carrier := Some(that locator) | none in scope: registered := ∅; Σ.carrier := None] → Scan(D) → G → AssessGapPressure(D, G ∪ open(registered)) → P  -- checkpoint + carrier recovery + detection + pressure map (silent apart from the unreachable-carrier relay). "In scope" is REACHABILITY, never ownership: whether a recovered gap bears on THIS decision is a relevance judgment, and it is made where the user is present — at Qs, which every gap passes before anything is done with it. Keying the locator to a decision would settle that at authoring time and remove the recognition the gate exists to elicit; where the relevance question turns on a fact the audit does not hold, the deficit is ContextInsufficient (/inquire), not this one [Tool]
Phase 1: (G, P) → [Σ.carrier = None: record[C ← all gaps] → Σ.carrier := Some(locator(C)) | Σ.carrier = Some(l): record update(l, add the newly detected gaps)] + Σ.deferred ← P.queued → Sel(P, D) → Gₛ → Qs(Gₛ[0]) → Stop → J  -- register every gap into the ONE carrier, creating it on the first pass and amending the recovered one otherwise; hold the identity the creating write returned; pressure-select, surface first [Tool]
Phase 2: J → A(J, D, Σ) → record update(Σ.carrier, entry(Gₛ[0]) := ⟨status := completed, judgment := J, adjustment := what A produced⟩) → Σ'           -- adjustment + carrier amendment naming the held identity. All three go in together: the audit trace reads judgment and adjustment, so a carrier holding status alone recovers which gaps are left and loses what was decided about the rest [Tool]
Phase 0 → carrier_unreachable (relay): a locator is in scope but the record it names cannot be read  -- surface that the prior gaps were NOT recovered and which locator failed, then proceed with registered := ∅ and Σ.carrier := None and a fresh carrier at Phase 1; the run never continues silently on a partial gap set

── LOOP ──
After Phase 2: re-scan for newly surfaced gaps from user response.
If new gaps: record update(Σ.carrier, add) → add to queue.
Pending gaps are active registered gaps ∪ Σ.deferred; each cycle reclassifies pending gaps through AssessGapPressure(D, pending) before Sel.
P.queued updates Σ.deferred at every carrier write or amendment; later cycles may reclassify any Σ.deferred gap into a higher-pressure bucket when context changes.
Continue until: every registered gap is completed (AuditedDecision).
Mode remains active until convergence.
Convergence evidence: At every-registered-gap-completed, present audit trace — for each g ∈ registered, show (GapUnnoticed(g) → user_judgment(g) → adjustment(g)) — together with Σ.carrier, so a later session reaches this run's gaps with one read. Convergence is demonstrated by the complete audit record, not asserted by carrier status.

── ADJUSTMENT RULES ──
A(Address(c), _, σ) = σ { incorporate(c) }           -- extern: modifies plan
A(Dismiss, _, σ)    = σ { reviewed ← reviewed ∪ {Gₛ[0]} }
A(Probe, _, σ)      = σ { re-scan(expanded) }        -- additional verification round (depth varies by stakes)

── SELECTION RULE ──
Sel(P, d) = take(priority_sort(P.load_bearing ∪ P.cheap_to_settle ∪ P.hidden_high_impact, d), min(|P.load_bearing ∪ P.cheap_to_settle ∪ P.hidden_high_impact|, stakes(d) = High ? 2 : 1))
priority_sort(S, d) = bucket order load_bearing → cheap_to_settle → hidden_high_impact; intra-bucket order follows evidence salience in d, then original Scan order
-- pressure-ordered: load_bearing and cheap_to_settle lead; hidden_high_impact only within its tight cap; nonblocking and queued are carried outside this cycle's surfaced set

── CONTINUATION ──
proceed(Σ) = ¬blocked(Σ)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Qs (constitution)      → present (mandatory)
Σ (track)      → record/record update (gap tracking in ONE carrier entry: the creating write returns the identity locator(C) reads, and every later amendment names that identity. Per-gap entries are NOT written — a single dereferenceable record is what lets one read reconstruct the set)
DereferenceCarrier (observe) → record read (conditional: a prior gap-carrier locator is in scope — read the carrier at that locator's record identity, within the session it names; one read yields the whole gap set, so nothing is reassembled from separate records. Unreachable → the carrier_unreachable relay, never a silent fresh start)
carrier_unreachable (extension) → TextPresent+Proceed (conditional: a locator is in scope but the record it names cannot be read — surface that the prior gaps were NOT recovered and which locator failed, then proceed with Σ.carrier := None and a fresh carrier at Phase 1. A partial gap set is never carried silently, and the run does not stop: the gaps this scan finds are still worth surfacing, and what the user needs is to know which earlier ones are missing from them)
Scan (observe) → artifact read, artifact search (stored knowledge extraction: context for gap identification)
AssessGapPressure (sense) → Internal analysis (no external tool; selection-only classification over Scan output; surfaces why a gap is load-bearing while gap resolution remains the user's constitutive act)
A (track)      → Internal state update (no external tool)
converge (extension)   → TextPresent+Proceed (convergence evidence trace; proceed with audited decision)
seam (extension)   → TextPresent+Proceed (fires at deactivation: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares, settles the next move — proceed directly to it, citing that settling source; every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, state: Σ, pressureMapSnapshot: P, active: Bool }  -- snapshot supports audit trace only; recompute before every Sel

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
```

## Mode Activation

`/gap` remains directly invocable. AI-guided activation is limited to a committed decision with concrete evidence of an unaddressed gap. Loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind.

An already judged gap stays settled for the current session unless new evidence changes it. Prior-session recall indices may weight scanning, but never settle the user's judgment. A direction-only commitment enters the scan when it materializes at a plan-to-execution boundary.

## Protocol

### User-facing realization

Render the selected gap as an assertion-free question. A procedural omission asks whether the step was completed; a missing consideration or alternative asks whether it was considered; an inferred assumption asks whether that premise holds. Precede the question with its concrete indicator, a plain-language pressure assessment, and the consequence for the decision.

Then materialize the judgment set with differential futures and yield:

```
How would you like to address this gap?

Options:
1. **Address** — [what resolving this gap enables or changes in the decision]
2. **Dismiss** — [what assumption holds if this gap is accepted as-is]
3. **Probe** — request additional verification before deciding
```

Keep `Probe` visible and free-response correction open. Put the verification rationale before the gate, brief at low stakes and more detailed as stakes rise. Surface one selected gap per turn; a second high-stakes selection remains independently answerable in its own round.

When `Scan(D)` finds no gaps, present the scan scope and zero-gap finding directly. Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, material belongs to another round or trace, or phase order controls placement.

## Rules

1. **Evidence-bound, user-judged**: Surface only gaps with concrete indicators cited from `D`, phrase each as a question, and treat the user's judgment as final for that gap.
2. **Assumption and alternative audit**: Confirm an inferred assumption rather than asserting it. Surface an omitted alternative only when its absence is observable and taking it would materially change the decision; keep emergent gap forms available when the named taxonomy does not fit.
3. **Minimal intrusion**: Let the pressure map narrow what reaches the user, and scale the supporting explanation without changing the judgment set.
4. **Round composition**: Use everyday language, keep each judgment beside its nearest evidence and next-move implication, and place analytical context before the gate.
5. **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly; preserve content, wording, order, cadence, and turn boundaries fixed elsewhere, stating what changed and what overlapping fixed element remains.
