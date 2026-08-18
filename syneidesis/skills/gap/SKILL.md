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
EarlyExit = Σ' where user_esc  -- non-convergent early exit: state as of exit (Σ' = Σ when exit precedes the first adjustment), partial audit trace over judged gaps, remaining registered gaps declared as unresolved residual

── PHASE TRANSITIONS ──
Phase 0: D → committed?(D) → [locator in scope: DereferenceCarrier → registered; Σ.carrier := Some(that locator) | none in scope: registered := ∅; Σ.carrier := None] → Scan(D) → G → AssessGapPressure(D, G ∪ open(registered)) → P  -- checkpoint + carrier recovery + detection + pressure map (silent apart from the unreachable-carrier relay) [Tool]
Phase 1: (G, P) → [Σ.carrier = None: record[C ← all gaps] → Σ.carrier := Some(locator(C)) | Σ.carrier = Some(l): record update(l, add the newly detected gaps)] + Σ.deferred ← P.queued → Sel(P, D) → Gₛ → Qs(Gₛ[0]) → Stop → J  -- register every gap into the ONE carrier, creating it on the first pass and amending the recovered one otherwise; hold the identity the creating write returned; pressure-select, surface first [Tool]
Phase 2: J → A(J, D, Σ) → record update(Σ.carrier, entry(Gₛ[0]) := ⟨status := completed, judgment := J, adjustment := what A produced⟩) → Σ'           -- adjustment + carrier amendment naming the held identity. All three go in together: the audit trace reads judgment and adjustment, so a carrier holding status alone recovers which gaps are left and loses what was decided about the rest [Tool]
Phase 0 → carrier_unreachable (relay): a locator is in scope but the record it names cannot be read  -- surface that the prior gaps were NOT recovered and which locator failed, then proceed with registered := ∅ and Σ.carrier := None and a fresh carrier at Phase 1; the run never continues silently on a partial gap set

── LOOP ──
After Phase 2: re-scan for newly surfaced gaps from user response.
If new gaps: record update(Σ.carrier, add) → add to queue.
Pending gaps are active registered gaps ∪ Σ.deferred; each cycle reclassifies pending gaps through AssessGapPressure(D, pending) before Sel.
P.queued updates Σ.deferred at every carrier write or amendment; later cycles may reclassify any Σ.deferred gap into a higher-pressure bucket when context changes.
Continue until: every registered gap is completed (AuditedDecision) OR user ESC (EarlyExit).
Mode remains active until convergence or explicit user exit (Esc).
Convergence evidence: At every-registered-gap-completed, present audit trace — for each g ∈ registered, show (GapUnnoticed(g) → user_judgment(g) → adjustment(g)) — together with Σ.carrier, so a later session reaches this run's gaps with one read. Convergence is demonstrated by the complete audit record, not asserted by carrier status.
On user ESC: present partial audit trace over judged gaps, then declare remaining registered gaps as unresolved residual — with Σ.carrier alongside, since an exit is exactly where the gaps left unresolved most need a later session to be able to reach them.

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
Qs (constitution)      → present (mandatory; Esc key → loop termination at LOOP level, not a Judgment)
Σ (track)      → record/record update (gap tracking in ONE carrier entry: the creating write returns the identity locator(C) reads, and every later amendment names that identity. Per-gap entries are NOT written — a single dereferenceable record is what lets one read reconstruct the set)
DereferenceCarrier (observe) → record read (conditional: a prior gap-carrier locator is in scope — read the carrier at that locator's record identity, within the session it names; one read yields the whole gap set, so nothing is reassembled from separate records. Unreachable → the carrier_unreachable relay, never a silent fresh start)
carrier_unreachable (extension) → TextPresent+Proceed (conditional: a locator is in scope but the record it names cannot be read — surface that the prior gaps were NOT recovered and which locator failed, then proceed with Σ.carrier := None and a fresh carrier at Phase 1. A partial gap set is never carried silently, and the run does not stop: the gaps this scan finds are still worth surfacing, and what the user needs is to know which earlier ones are missing from them)
Scan (observe) → Read, Grep (stored knowledge extraction: context for gap identification)
AssessGapPressure (sense) → Internal analysis (no external tool; selection-only classification over Scan output; surfaces why a gap is load-bearing while gap resolution remains the user's constitutive act)
A (track)      → Internal state update (no external tool)
converge (extension)   → TextPresent+Proceed (convergence evidence trace; proceed with audited decision)
esc (extension)   → TextPresent+Proceed (partial audit trace + unresolved-gap residual declaration; terminate as EarlyExit, not AuditedDecision)
seam (extension)   → TextPresent+Proceed (fires at deactivation: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares, settles the next move — proceed directly to it, citing that settling source; every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, state: Σ, pressureMapSnapshot: P, active: Bool }  -- snapshot supports audit trace only; recompute before every Sel

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
```

## Core Principle

**Surfacing over Deciding**: AI makes visible; user judges.

## Mode Activation

### Activation

Command invocation activates mode until convergence or Esc; deferred gaps (queued gaps carried in `Σ.deferred`; nonblocking gaps remain active registered gaps) remain resumable on later activation through the carrier locator, per LOOP.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/gap` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Committed action detected with observable, unaddressed gaps via in-protocol heuristics.

**On activation**: if a prior gap-carrier locator is in scope, read that carrier once to recover its gaps and resume tracking; with no locator in scope, start a fresh carrier. The protocol does not search for its own past records — one read at a held identity is the whole recovery path.

### Priority

<system-reminder>
When Syneidesis is active:

**Supersedes**: Risk assessment and decision gating rules in loaded instructions
(e.g., verification tiers, reversibility checks, approval requirements)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At decision points, present potential gaps via Cognitive Partnership Move (Constitution).
</system-reminder>

- Stakes Assessment replaces tier-based gating
- All decision points become candidates for interactive confirmation
- Loaded instructions resume after mode deactivation

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Task completion | Auto-deactivate after final resolution |
| User Esc key | EarlyExit (not AuditedDecision): present partial audit trace + declare remaining registered gaps as unresolved residual, then return to normal operation |

### Plan Mode Integration

When combined with Plan mode, apply Syneidesis at **Phase boundaries**:

| Phase Transition | Gap Check Focus |
|------------------|-----------------|
| Planning → Implementation | Scope completeness, missing requirements |
| Phase N → Phase N+1 | Previous phase completion, dependency satisfaction |
| Implementation → Commit | Changed assumptions, deferred decisions |

**Cycle**: [Deliberation → Gap → Revision → Execution]
1. **Deliberation**: Plan mode analysis generates recommendations (Prothesis supplies multi-perspective lenses when active)
2. **Gap**: Syneidesis surfaces unconfirmed assumptions via Cognitive Partnership Move (Constitution)
3. **Revision**: Integrate user response, re-evaluate if needed
4. **Execution**: Only after explicit scope confirmation

This cycle repeats per planning phase or domain area.

### Conditions

#### Essential (all must hold)

| Condition | Predicate | Test |
|-----------|-----------|------|
| **Committed action** | `committed(D)` | `∃ A : mutates_state(A) ∨ externally_visible(A) ∨ consumes_resource(A)` |
| **Observable gap** | `∃ G : observable(G)` | Concrete indicator exists in context (not speculation) |
| **Unaddressed** | `¬mentioned(G, context)` | Gap not already raised or resolved in session |

**Scope limitation**: `committed(D)` captures *execution commitment* (actions with immediate effects). It does not capture *direction commitment* — decisions that constrain future work without immediate state change (e.g., "let's use PostgreSQL", "refactor auth to OAuth2"). Direction commitment is partially covered by Plan Mode Integration, which applies Gap at phase boundaries where such decisions materialize into execution plans.

#### Modulating Factors (adjust intensity, not applicability)

| Factor | Effect | Heuristic signals |
|--------|--------|-------------------|
| **Irreversibility** | stakes ↑ | "delete", "push", "deploy", "migrate" |
| **Impact scope** | stakes ↑ | "all", "every", "entire", production, security |
| **Time pressure** | stakes ↑ (gap miss probability increases) | "quickly", "just", "right now" |
| **Uncertainty** | scan range ↑ | "maybe", "probably", "I think" |

#### Skip

- `¬committed(D)`: read-only, informational, exploratory actions
- User explicitly confirmed in current session
- Mechanical task (no judgment involved)
- User already mentioned the gap category

## Gap Taxonomy

| Type | Detection | Question Form |
|------|-----------|---------------|
| **Procedural** | Expected step absent from user's stated plan | "Was [step] completed?" |
| **Consideration** | Relevant factor not mentioned in decision | "Was [factor] considered?" |
| **Assumption** | Unstated premise inferred from framing | "Are you assuming [X]?" |
| **Alternative** | Known option not referenced | "Was [alternative] considered?" |

**Emergent gap detection**: Named types are working hypotheses, not exhaustive categories. Detect Emergent gaps when:
- The unaddressed gap spans multiple named types (e.g., a procedural absence driven by an unstated assumption)
- User dismisses all named-type gaps but the committed action still exhibits observable risk
- The decision context involves domain-specific considerations that resist classification into four generic types

Emergent gaps must satisfy morphism `GapUnnoticed → AuditedDecision` and use adapted question forms.

## Protocol

### Detection (Silent)

Per Phase 0 formal block. **Stakes mapping** (from modulating factors):
- Irreversible + High impact → High stakes
- Irreversible + Low impact → Medium stakes
- Reversible + Any impact → Low stakes
- Time pressure → stakes ↑ one level

**Cross-session enrichment**: Prior session indices from the hypomnesis store (prior-session recall indices), when present, may seed gap type weighting during scanning; the constitutive judgment remains with the user.

**Revision threshold**: When accumulated Emergent gap detections across 3+ sessions cluster around a recognizable pattern that the named gap types fail to capture, the cost of maintaining the current taxonomy exceeds the cost of adding a named type — promote the Emergent cluster. Conversely, when a named type consistently yields zero detections across 3+ sessions, consider whether it remains a distinct gap category or has become observationally inert — consistently undetected despite applicable contexts.

### Pressure Assessment (Silent)

Per Phase 0 formal block (`AssessGapPressure` → `P`; bucket definitions in the TYPES block above) and Rule 12: after Scan and before selection, classify the already-detected gaps `G` into a GapPressureMap `P` — one bucket per gap for the current cycle.

### Surfacing

Present the gap as text output:
- **Gap**: [Specific gap description with evidence]
- **Pressure**: [load-bearing / cheap-to-settle / hidden high-impact, in plain language — why this gap deserves attention now]
- (rationale: [1-line why this gap matters for this decision])

Then **present**:

```
How would you like to address this gap?

Options:
1. **Address** — [what resolving this gap enables or changes in the decision]
2. **Dismiss** — [what assumption holds if this gap is accepted as-is]
3. **Probe** — request additional verification before deciding (rationale depth varies by stakes)
```

Option 3 (Probe) is always visible. When `stakes(D) = High`, present with expanded verification rationale; otherwise, present with brief rationale. Recognition over Recall: hiding Probe forces the user to recall that deeper verification is available.

Other is always available — user can respond freely beyond the listed options.

One gap per decision point.
Exception: Multiple high-stakes gaps → surface up to 2, prioritized by irreversibility.

### Resolution

Per ADJUSTMENT RULES. Key operational detail: Probe triggers a re-scan with expanded scope, surfacing additional gaps the user wants verified before committing.

### Gap Tracking

**Carrier format** — ONE entry holding every registered gap:
```
record({
  subject: "[Gap carrier] decision point",
  description: "one line per gap: [Gap:Type] question | rationale and context | status | once closed, the user's judgment and the adjustment it produced"
})
```

The judgment and adjustment ride in the carrier because the audit trace is assembled from them; a carrier holding status alone would recover which gaps are left and lose what was decided about the rest. The creating write returns the identity `locator(C)` reads. Every later amendment and every later session's read name that identity; no second entry is written per gap.

### Interactive Surfacing (Constitution)

When Syneidesis is active, **present** via Cognitive Partnership Move (Constitution) for:

Constitution presentation yields turn for user response.

| Trigger | Action |
|---------|--------|
| Any confirmation needed | Present as structured options |
| High-stakes + multiple gaps | Present priority choices |
| Assumption gap | Always confirm (inference may be wrong) |
| Interpretive uncertainty | Ask whether gap exists before surfacing |
| Naming/structure decisions | Offer alternatives with rationale |

**Why one carrier**: every gap lives in a single durable entry, so the set stays reachable across the session and a later session reconstructs it with one read rather than searching for records it would first have to find.

**Re-scan trigger**: User response may reveal new gaps (e.g., "Yes, backed up" → "Where?" precision gap). Always re-scan after each response.

### UI Mapping

| Environment | Address | Dismiss | Probe |
|-------------|---------|---------|-------|
| Constitution interaction | Selection | Selection | Selection |

Note: Esc key → unconditional loop termination (LOOP level). Constitution interaction blocks until response or Esc.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Reversible, low impact | Constitution interaction with Dismiss as default option |
| Medium | Reversible + high impact, OR Irreversible + low impact | Constitution interaction with rationale context |
| Heavy | Irreversible + high impact | Detailed rationale + Constitution interaction with explicit options |

## Rules

1. **AI-guided, user-judged** (Detection with Authority): AI surfaces gaps as questions ("was X considered?", never "you missed X"); user authority is final — dismissal terminates a gap.
2. **Observable evidence regulation**: Surface only gaps with concrete indicators cited from D; no gap inflation merely to appear thorough — each surfaced gap cites specific context from D.
3. **Minimal intrusion** (Surfacing over Deciding): Lightest intervention that achieves awareness; intensity follows the stakes matrix in `## Intensity`.
4. **Gap order is the pressure map's**: the order gaps are surfaced in is `Sel`'s alone — pressure bucket, then evidence salience, then Scan order. No prerequisite edge between gaps is recorded and none is read; where a gap only makes sense once another is settled, the question's own wording carries that rather than a stored relation.
5. **Round composition**: Compose each round so the reader can act on it without reassembling it — everyday language rather than this file's formal vocabulary, the judgment set beside the evidence it rests on together with the differential implication that matters for the next move, and analytical context laid out before a gate rather than inside it, so the gate carries the question and each option's differential implication. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged, when some of what is in view belongs to a later round or a trace rather than this one, or when this protocol's own phases bear on where a sentence sits relative to a gate.
6. **Convergence evidence**: Present convergence audit trace before declaring all tasks completed; per-gap evidence is required.
7. **Zero-gap surfacing**: If Scan(D) finds no gaps, present scan methodology and conclusion — committed decisions with stakes warrant explicit "no gaps found" confirmation.
8. **Option-set relay test (Extension classification)**: Single dominant option (entropy → 0) presented as relay. Each Constitution option genuinely viable under different user value weightings; shared-trajectory options collapse to one; off-axis prompts surface as free-response pathways rather than peer options.
9. **Gate integrity** (Safeguard tier): The defined option set is presented intact — option injection/deletion/substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
12. **Protocol-native pressure map**: Phase 0 produces a GapPressureMap before gap selection. The map is a pre-gate support object for gap selection and question formation, with no terminal-status or generic-calibration authority. It classifies already-detected gaps into exactly one current-cycle pressure bucket; gap tasks are sourced exclusively from Scan output, and `AuditedDecision` is unchanged. Surfacing over Deciding — the map justifies why a gap deserves attention now while gap resolution remains the user's constitutive act. `hidden_high_impact` is the unknown-unknown surface and carries the highest over-application risk, so it is tightly capped (|hidden_high_impact| ≤ 1) and admitted only when the unknown could materially change the user's next judgment; the map must narrow the question set, never make the user inspect every possible gap.
13. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Round composition).
14. **Seam relay on declared continuation**: when a user-declared chain or a composition edge this SKILL.md declares names the next protocol, the between-protocol seam after this protocol's convergence is relay (Extension) — proceed directly, citing the settling source (the chain declaration or the named edge). This governs only the seam BETWEEN protocols; every Constitution gate inside this protocol and the next fires unchanged, and the user can redirect at any turn.
15. **Form feedback**: Silence about form is not evidence about form. Too dense fails quietly — the reader skims, answers past it, stops — while too plain fails out loud, so the complaints that arrive come from one side only. Density therefore does not carry over from the previous round: each round takes it from what this request asked for, while a statement about form does carry over until it is countermanded. Read an instruction about form for the parts of a round it reaches, not for what kind of reaction it is — a complaint, a request, a symptom report and a bare preference are one input here, and sorting them by kind yields nothing the reach reading does not already give while costing a clause per kind. Change the form rather than asking which form they want; naming one is the recall this discipline exists to remove. What such an instruction reaches is whatever the active protocol leaves open in how a round is composed — its density, its ordering, its length. What it does not reach is whatever is already fixed for this round elsewhere: content the protocol requires, wording carried verbatim, an order it presents in, a cadence it caps, a turn boundary it sets. Those stay in place, and the layer that fixed them is what states why. Say in one line what changed; where the instruction overlapped something that stays, say in one line that it stays and why — that second line is owed by the overlap, not by how the instruction was worded.
