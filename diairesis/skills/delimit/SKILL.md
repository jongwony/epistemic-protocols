---
name: delimit
description: "Delimit a large body of work into right-sized execution units before its method is conducted. Searches for the cut-set over an external work-breakdown structure such that each unit fits one execution span, every cut falls at a natural joint, and coverage is complete with no work orphaned — then emits a WorkUnitMap that references the WBS without owning it, ready to flow into /conduct. Type: (GranularityUnderdetermined, Hybrid, DELIMIT, ExternalWBS × ExecutionHorizon × ContextLifecycle) → WorkUnitMap. Alias: Diairesis(διαίρεσις)."
---

# Diairesis Protocol

Delimit a large body of work into right-sized execution units — partition a work horizon at its natural joints so each unit fits one span — when the granularity of the cut is underdetermined. The morphism is **cut, then hand the cut-set on**: Diairesis searches for the cut-set, the user constitutes it joint by joint, and the emitted WorkUnitMap flows into `/conduct` as its work prospect. Type: `(GranularityUnderdetermined, Hybrid, DELIMIT, ExternalWBS × ExecutionHorizon × ContextLifecycle) → WorkUnitMap`.

## Definition

**Diairesis** (διαίρεσις: a division, a cutting-apart): A dialogical act of delimiting a body of work into execution units — deciding **where to cut** a large work horizon so each piece is the right size to execute in one span — when that granularity is underdetermined while the work itself is known. The protocol's lexical verb is `/delimit`. It reads an external work-breakdown structure (a Linear project→milestone→issue tree, an issue set, a plan) as a read-only reference, scans it for natural joints, searches for a cut-set whose units each fit one span, and presents each candidate cut for the user to settle — into a **WorkUnitMap** that references the WBS by id without copying or owning its state. The cut-set is judged against three packing invariants: each unit fits one span, every cut falls at a natural joint, and the units cover the whole body with no work orphaned. Diairesis **marks the cuts but does not order them** — sequencing the units is `/conduct`'s work; the two are duals (cut, then conduct).

**Coexistence note**: `/induce` (Periagoge) carries an internal move-family label "Diairesis" (the Platonic *division* move that narrows one abstraction). This protocol's name shares that Greek root because both are acts of division, but they sit at different strata — there a response-family label inside one protocol, here a top-level protocol that partitions a work body. The overlap is cosmetic; neither reads the other.

```
── FLOW ──
Diairesis(WB) → Probe(WB) → granularity_underdetermined? →
  scope_insufficient(WB):  → route_away(/inquire) → deactivate            -- cannot see the WBS structure well enough to cut (ContextInsufficient owns this)
  single_span(WB):         → relay(already one unit) (extension) → deactivate -- the whole body already fits one span; nothing to partition
  cut_already_fixed(WB):   → relay(cut already fixed; no partition needed) (extension) → deactivate -- multi-span body the WBS already partitions (one-issue-per-span), or a prior /delimit map covers this scope; nothing to cut
  underdetermined:         init_loop_state: cycle_n=1, cut_set=∅, work_unit_map=∅, residual=regions(WB), committed=∅, regions_touched=regions(WB), joints=∅, invariant_status=⊥, history=∅, loop:
    Phase 1 Scan(WB, cycle_n) [per-cycle re-scan] → joints(region) → Pack(joints, horizon, lifecycle) → (Anchor[cycle_n], proposed_cut, SpanFit) →
      Anchor empty ∧ residual = ∅: → emit WorkUnitMap → converge          -- every region cut, nothing left
      Anchor empty ∧ residual ≠ ∅: → autonomous_pack(residual) (extension) → surface → emit WorkUnitMap → converge  -- substrate exhausted; AI completes the residual cuts at their natural joints (Extension-default), surfaced as relay
      SingleDominantCut(Anchor, proposed_cut) ∧ SpanFit = Fits: → relay(AcceptCut) (extension) → Phase 3 integrate (skip Qc)  -- single dominant cut (Rule 11): no genuine alternative disposition exists for this Anchor
      else:                        → Phase 2
    Phase 2 Qc(Anchor[cycle_n], proposed_cut, SpanFit, cut_set_snapshot, cycle_n) → Stop → A
    Phase 3 (parse(A) → (cut_disposition?, termination?)) →
      Esc:        → ungraceful deactivate (residual uncut, partition abandoned)  -- caught before integrate; Esc binds no cut_disposition
      cut_disposition present → integrate(cut_disposition, cut_set, work_unit_map) → (cut_set', work_unit_map')  -- a region moves residual→committed only once its unit Fits (or the user explicitly accepts a non-Fits unit), else it stays in residual for a later cycle; skipped on a pure-termination Sufficient that carries no cut, in which case (cut_set', work_unit_map') = (cut_set, work_unit_map) so the downstream finalize stays bound
      check_invariants(work_unit_map') → InvariantStatus                  -- span_fit ∧ natural_joint ∧ coverage_complete over committed cuts
      Sufficient: → autonomous_pack(residual) (extension) → finalize(work_unit_map', residual) → emit WorkUnitMap → converge
      else:       → re-derive next-cycle anchor frame → cycle_n += 1, loop

── MORPHISM ──
ExternalWBS × ExecutionHorizon × ContextLifecycle
  → probe(work_body)                              -- detect a body of work whose cut into span-units is undetermined
  → scan(wbs, cycle_n) → joints                   -- read the external WBS (reference, read-only) for natural joints: milestone boundaries, dependency seams, deliverable edges
  → pack(joints, horizon, lifecycle) → CutSet     -- THE IRREDUCIBLE CORE: search for a cut-set whose every unit fits one span, every cut sits on a joint, and coverage is complete with no work orphaned. Per-cycle realization (FLOW) proposes one (Anchor, proposed_cut, SpanFit); accepted cuts accumulate into this CutSet via integrate across cycles
  → fit(unit, horizon, lifecycle) → SpanFit       -- per-unit span-fit predicate (composes /distill: a unit fits one span iff its work is carriable by one self-contained span handoff)
  → [SingleDominantCut(Anchor, proposed_cut) ∧ SpanFit = Fits: relay(AcceptCut) (extension) | else: present(anchor, proposed_cut, SpanFit) (constitution)]  -- single dominant cut relays without a turn yield (Rule 1 exception); otherwise surface the highest-leverage uncut region's proposed cut for user judgment via Cognitive Partnership Move
  → integrate(cut_disposition, CutSet, WorkUnitMap) → (CutSet', WorkUnitMap')  -- apply the settled cut to the map (reference entries only; the WBS is never copied)
  → check(WorkUnitMap') → InvariantStatus         -- span_fit ∧ natural_joint ∧ coverage_complete
  → finalize(WorkUnitMap', residual)              -- autonomous_pack the residual at its natural joints (Extension-default), then assert the three invariants hold over the whole map
  → WorkUnitMap
requires: granularity_underdetermined(WB)         -- runtime checkpoint (Phase 0); sole activation precondition
deficit:  GranularityUnderdetermined              -- activation precondition (Layer 1/2)
preserves: wbs_ownership(ExternalWBS)             -- the external WBS is the single source of truth; read-only, referenced by id, never duplicated or mutated
invariant: Delimit over Order                     -- Diairesis marks the cuts; it does not sequence the units (ordering is /conduct, the dual)
invariant: Reference over Ownership               -- a WorkUnit references WBS ids; it never copies or owns WBS state

── TYPES ──
WB     = WorkBody { wbs_ref: WBSRef, horizon: ExecutionHorizon, lifecycle: ContextLifecycle }  -- the body of work to partition
ExternalWBS = the external work-breakdown structure being partitioned (a Linear project→milestone→issue tree, an issue set, a plan) -- an opaque external type: the single source of truth, referenced by WBSRef, never copied or owned by the protocol
WBSRef = a read-only reference into the ExternalWBS (a Linear project/milestone/issue id, an issue-set query, a plan anchor) -- a pointer the recipient resolves; never a copy of WBS state. ExternalWBS is the single source of truth
ExecutionHorizon = the span budget one execution unit must fit within: one /conduct span (invocation → next planned /compact or /clear). The unit of "one span" the packing search fits against
ContextLifecycle = what fits one context window before compaction — the cognitive-load ceiling a single unit may carry. The second fit dimension (a unit can fit the span budget yet overflow the context window, or vice versa)
Region = a contiguous extent of the work body not yet cut into a unit — the packing search's working unit. regions(WB) = the initial single whole-body region
Joint  = { locus: WBSRef, kind: JointKind, evidence: Set(Evidence) }  -- a candidate cut point in the WBS
JointKind ∈ {milestone_boundary, dependency_seam, deliverable_edge, emergent}  -- recognition seeds for where a cut can fall (NOT a closed set — emergent admits a joint the seeds do not name; the user may name one)
Evidence = { source: String, content: String }
SpanFit ∈ {Fits, Overflows, Underfills}  -- the per-unit fit verdict against (horizon × lifecycle): Fits = one span; Overflows = too big for one span (split); Underfills = too small to warrant its own span (merge). Composes /distill's zero-memory carriability as the Fits predicate
Cut    = a committed delimitation at a Joint — the boundary between two units
CutSet = Set(Cut)  -- the partition; the search output and the loop's accumulating state
WorkUnit = { id: String, region: Region, refs: List(WBSRef), fit: SpanFit }  -- an "execution_cut" view over the WBS: it references issue ids (refs) and does NOT copy their content; it floats between milestone and issue granularity (a unit may span part of a milestone or several issues). One span's worth of work
Anchor = the highest-leverage uncut Region surfaced this cycle (the region whose cut most constrains the remaining partition) — a Region; the surfacing tuple (Anchor, proposed_cut, SpanFit) pairs it with its AI-proposed cut and SpanFit at construction, which are not fields of Anchor itself
SingleDominantCut(Anchor, proposed_cut) ≡ pack(...) finds no viable alternative joint for this Anchor — proposed_cut is the region's only joint candidate, so MoveCut/SplitUnit/MergeUnits have no genuine target and AcceptCut is the sole non-trivial disposition (option-level entropy → 0, Rule 11)
A      = CutDisposition ∈ {AcceptCut, MoveCut(joint), SplitUnit(joint), MergeUnits(neighbor)}  -- the per-cycle user answer over the proposed cut; presented intact per gate integrity
         -- AcceptCut: adopt the proposed unit (SpanFit = Fits) as a committed WorkUnit
         -- MoveCut(joint): the cut should fall at a different joint — re-delimit the region's boundary
         -- SplitUnit(joint): the proposed unit Overflows one span — cut it again at an interior joint into two units
         -- MergeUnits(neighbor): the proposed unit Underfills — merge it with an adjacent region into one span-unit
         -- termination intent (Sufficient) surfaces via free-response affordance, NOT as an extra option in CutDisposition
TerminationIntent = parsed natural-language signal that the partition is complete  ∈ {Sufficient}
         -- Sufficient: commit the current map; the AI autonomously packs every remaining residual region at its natural joints (Extension-default), and the three invariants are asserted over the whole map before emit
InvariantStatus = { span_fit: Bool, natural_joint: Bool, coverage_complete: Bool }  -- the three packing invariants over the committed cut-set; coverage_complete is HARD (full coverage, no orphaned work — a map leaving work outside every unit is not a valid WorkUnitMap)
WorkUnitMap = { units: Set(WorkUnit), cut_set: CutSet, wbs_ref: WBSRef }  -- the result: the set of execution cuts, the cut_set (each Cut at its Joint, carrying natural_joint evidence to downstream /conduct), plus the WBS reference they view. Consumed by /conduct (Hyphegesis) as its WorkProspect — Diairesis cuts the units, /conduct orders and conducts them
cycle_n = Nat  -- current cycle counter (visible at Phase 2)

── PHASE TRANSITIONS ──
Phase 0: WB → Probe(WB) → granularity_underdetermined?                                          -- granularity existence checkpoint (silent); bind WBSRef read-only, horizon, lifecycle
Phase 0 → route_away: scope_insufficient(WB) → /inquire (ContextInsufficient owns the missing pre-cut fact)  -- cannot see the WBS structure well enough to cut [Tool]
Phase 0 → deactivate (relay): single_span(WB) → the whole body already fits one span — present "no partition needed" as relay, deactivate (extension)
Phase 0 → deactivate (relay): cut_already_fixed(WB) → the WBS already imposes a span-sized partition (one-issue-per-span) or a prior WorkUnitMap covers this scope — present "cut already fixed" as relay, deactivate (extension)
Phase 0 → Phase 1: granularity_underdetermined(WB) = true → init loop state (cycle_n=1, cut_set=∅, work_unit_map=∅, residual=regions(WB), committed=∅, regions_touched=regions(WB), joints=∅, invariant_status=⊥, history=∅)
Phase 1: WB, cycle_n → Scan(WB, cycle_n) → joints → Pack(joints, horizon, lifecycle) → (Anchor[cycle_n], proposed_cut, SpanFit)  -- per-cycle re-scan + packing search [Tool]
Phase 1 → converge: Anchor empty ∧ residual = ∅ → emit WorkUnitMap directly (every region cut)
Phase 1 → converge (autonomous residual): Anchor empty ∧ residual ≠ ∅ → autonomous_pack(residual) (extension) → surface → emit WorkUnitMap  -- substrate exhausted; AI completes residual cuts at natural joints, surfaced as relay
Phase 1 → Phase 3 (relay): Anchor non-empty ∧ SingleDominantCut(Anchor, proposed_cut) ∧ SpanFit = Fits → relay(AcceptCut) (extension) → integrate(AcceptCut, cut_set, work_unit_map) directly, skipping Qc  -- single dominant cut (Rule 11): no genuine alternative disposition exists for this Anchor
Phase 1 → Phase 2: Anchor non-empty ∧ ¬(SingleDominantCut(Anchor, proposed_cut) ∧ SpanFit = Fits) → surface the proposed cut for user judgment
Phase 2: Anchor[cycle_n], proposed_cut, SpanFit, cut_set_snapshot, cycle_n → Qc(...) → Stop → A  -- per-cycle partition gate over CutDisposition with cut-set snapshot + fit basis visible; fires only when NOT single-dominant-cut [Tool]
Phase 3: (parse(A) → (cut_disposition?, termination?)) → [Esc → ungraceful deactivate, before integrate] → [cut_disposition present] integrate(cut_disposition, cut_set, work_unit_map) → (cut_set', work_unit_map') → check_invariants(work_unit_map') → InvariantStatus  -- integrate skipped on Esc (binds no cut) and on a pure-termination Sufficient (carries no cut); when skipped, (cut_set', work_unit_map') = (cut_set, work_unit_map) so the Sufficient finalize below stays bound; on the Phase 1 dominant-cut relay entry, parse(A) is skipped (no gate was presented) — cut_disposition := AcceptCut, integrate runs exactly once, then invariants and routing proceed normally
Phase 3 → Phase 3 (relay): ambiguous parse (A readable as both a cut and termination) → one-turn relay confirmation of the parsed intent → re-parse → route  -- the ambiguous-parse state resolves before integrate/routing
Phase 3 → Phase 1: ¬termination ∧ ¬Esc → re-derive next-cycle anchor frame → cycle_n += 1  -- continue the partition loop
Phase 3 → converge (Sufficient): TerminationIntent = Sufficient → autonomous_pack(residual) (extension) → finalize(work_unit_map', residual) → assert InvariantStatus (coverage_complete hard) → emit WorkUnitMap
Phase 3 → deactivate (ungraceful): Esc → residual uncut, partition abandoned (no WorkUnitMap)

── LOOP ──
J = {next, sufficient, esc}
  next:       ¬termination ∧ ¬Esc → re-derive next-cycle anchor frame (the cut just settled routes the next region scan toward its neighbours) → cycle_n += 1, Phase 3 → Phase 1
  sufficient: TerminationIntent = Sufficient (parsed from Phase 2 free response) → Phase 3 → converge with residual filled by autonomous_pack (each remaining region cut at its natural joints, Extension-default) — surfaced for recognition before emit
  esc:        Esc → ungraceful deactivate (residual uncut)

Per-cycle re-scan: Phase 1 re-reads the WBS each cycle; the anchor is drawn from `Λ.residual` and a `Λ.committed` (settled) region is never re-surfaced — no region cut twice. Dedup is against `Λ.committed`, not `Λ.regions_touched` (= committed ∪ residual, which includes pending residual and so must not gate re-surfacing). A region kept in `Λ.residual` by a failed re-fit or a missing merge-target is therefore re-surfaced in a later cycle — dedup gates only on `Λ.committed`.
Cycle 1 anchor: the highest-leverage region — the one whose cut most constrains the rest of the partition (typically the largest Overflows region or a hard dependency seam).
Cycle k≥2 anchor: the cut settled at cycle k-1 routes the next scan toward the regions adjacent to it; AI re-applies leverage ordering within that frame.

Packing search (the irreducible core): `pack(joints, horizon, lifecycle)` proposes the cut-set by fitting each candidate region against the span budget (horizon × lifecycle) — an Overflows region invites an interior cut (split), an Underfills region invites a merge with a neighbour, a Fits region anchors a unit. The search seeks the cut-set satisfying all three invariants; the user constitutes each cut, so the search proposes and the gate disposes.

Convergence evidence: At convergence, present the transformation trace — per committed WorkUnit, (Anchor region → Cut at joint → SpanFit → disposition), plus the residual disposition (each autonomous_pack cut with its joint + Extension-default basis), plus the InvariantStatus (all three invariants, with the coverage check shown). The WorkUnitMap is presented as a separate session-text artifact carrying the WBS reference and the cut_set. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
converge iff (Phase 3 Sufficient ∨ substrate_exhaustion) ∧ coverage_complete(work_unit_map) ∧ ¬user_esc
  coverage gate:            convergence presupposes the three invariants hold over the whole map. span_fit is COMMIT-ENFORCED (a unit moves to committed only once it Fits, or the user explicitly accepts a non-Fits unit) and natural_joint holds BY CONSTRUCTION (every cut sits on a joint), so both are maintained invariants that already hold over the committed map at convergence — they need no separate convergence gate. coverage_complete is therefore the sole remaining HARD convergence gate (a map leaving work outside every unit is not a valid WorkUnitMap and cannot emit)
  Phase 3 Sufficient:       residual filled by autonomous_pack (each remaining region cut at its natural joints, Extension-default), surfaced for recognition; emit WorkUnitMap directly
  substrate_exhaustion:     Phase 1 surfaces no new region — if residual = ∅, emit directly; if residual ≠ ∅, autonomous_pack the residual, surface, then emit
  user_esc:                 user exits via Esc at any Phase 2 (ungraceful, residual uncut, no WorkUnitMap emitted)
  route_away:               Phase 0 scope_insufficient → /inquire, non-convergent exit (the missing pre-cut fact belongs to ContextInsufficient; no WorkUnitMap)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Probe (sense)        → Internal analysis (silent — heuristic granularity-underdetermined detection + read-only bind of the WBS reference, horizon, lifecycle; no user output)
Phase 0 route_away (extension) → TextPresent+Proceed (scope insufficient to cut → route to /inquire as the recommendation, deactivate)
Phase 0 single_span_relay (extension) → TextPresent+Proceed (the whole body already fits one span → present "no partition needed" as relay, deactivate)
Phase 0 cut_already_fixed_relay (extension) → TextPresent+Proceed (the WBS already imposes a span-sized partition (one-issue-per-span) or a prior WorkUnitMap covers this scope → present "cut already fixed" as relay, deactivate)
Phase 1 Scan (observe)       → Read, Grep, Glob (per-cycle re-scan of the external WBS — Linear/issue tree, plan, project config — for natural joints; reference-only, never mutating the WBS; composes /bound for joint candidates where a cut could fall)
Phase 1 Pack (sense)         → Internal analysis (the packing search: propose the cut-set fitting each region against horizon × lifecycle; compose /distill's zero-memory carriability as the per-unit Fits predicate; basis cited at Phase 2 surfacing)
Phase 1 relay_dominant_cut (extension) → TextPresent+Proceed (SingleDominantCut(Anchor, proposed_cut) ∧ SpanFit = Fits: record AcceptCut as relay, skip Qc, advance directly to Phase 3 integrate — Rule 11)
Phase 2 Qc (constitution)    → present (conditional: ¬SingleDominantCut(Anchor, proposed_cut) ∨ SpanFit ≠ Fits; per-cycle partition gate over CutDisposition {AcceptCut, MoveCut, SplitUnit, MergeUnits} + the anchor region + its proposed cut + SpanFit basis + current cut-set snapshot + cycle_n + free-response Sufficient termination affordance; Esc → loop termination, not an Answer)
Phase 3 parse (sense)        → Internal analysis (parse A into cut_disposition + optional TerminationIntent; ambiguous parse triggers one-turn relay confirmation before routing)
Phase 3 integrate (track)    → Internal state update (apply the settled cut to cut_set + work_unit_map as reference entries; move the anchor region from residual to committed ONLY once its unit Fits or the user explicitly accepts a non-Fits unit — else it stays in residual for a later cycle; skipped entirely on Esc / a pure-termination Sufficient that binds no cut, leaving the map unchanged; the WBS is never copied)
Phase 3 check (sense)        → Internal analysis (assert the three packing invariants over the committed cut-set; coverage_complete is a hard convergence gate)
Phase 3 autonomous_pack (track) → Internal state update (on Sufficient or substrate exhaustion, complete the residual cuts at their natural joints — Extension-default per the project's Extension calibration — moving each region from residual to committed)
Phase 3 autonomous_pack_surface (extension) → TextPresent+Proceed (surface each autonomous_pack cut for recognition before emit)
converge (extension)         → TextPresent+Proceed (per-unit cut trace + residual disposition trace + InvariantStatus + WorkUnitMap as a separate session-text artifact carrying the WBS reference and cut_set; proceed — the map flows to /conduct)

── MODE STATE ──
Λ = { phase: Phase, work_body: WB,
      wbs_ref: WBSRef,                      -- read-only reference into the ExternalWBS (single source of truth; never copied)
      horizon: ExecutionHorizon,
      lifecycle: ContextLifecycle,
      cycle_n: Nat,
      joints: Set(Joint),                   -- accumulated candidate cut points (Phase 1 scan union)
      cut_set: CutSet,                       -- the accumulating partition (committed cuts)
      regions_touched: Set(Region),         -- every region created across cycles = committed ∪ residual (coverage bookkeeping; dedup is against committed)
      committed: Set(Region),               -- regions whose cut the user settled (Phase 2) or autonomous_pack completed
      residual: Set(Region),                -- uncut regions still pending (filled by autonomous_pack at termination)
      work_unit_map: WorkUnitMap,           -- the accumulating result: reference entries only
      invariant_status: InvariantStatus,    -- the three packing invariants over the committed cut-set
      history: List<(Region, Cut, SpanFit, A)>,
      active: Bool, cause_tag: String }
-- Invariant: regions_touched = committed ∪ residual (pairwise disjoint)
-- Invariant: work_unit_map entries reference WBS ids only — no WorkUnit copies or owns ExternalWBS state (Reference over Ownership)

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Dimension resolution emergent via session context.
Composition (compose, do not reimplement): Diairesis carries ONE new operation — the packing/partition judgment (search for the cut-set satisfying the three invariants). Everything else composes existing protocols and is wired as advisory graph edges:
  • /inquire (Aitesis) — when the WBS scope is insufficient to cut, Phase 0 routes away to ContextInsufficient rather than guessing a partition.
  • /bound (Horismos) — boundary candidates feed the joint scan: where a cut could fall is a boundary question /bound already answers; Diairesis reads its BoundaryMap to narrow joint candidates.
  • /distill (Diylisis) — the per-unit fit predicate: a unit "fits one span" iff its work is carriable by one self-contained span handoff, which is exactly /distill's zero-memory carriability. SpanFit = Fits composes that verdict.
  • → /conduct (Hyphegesis) — the emitted WorkUnitMap flows downstream as /conduct's WorkProspect. Diairesis cuts the units; /conduct orders and conducts them. The two are duals: cut, then conduct.
Diairesis DELIMITs but does NOT order (no sequencing — that is /conduct), does NOT own the WBS (the ExternalWBS stays the single source of truth — reference, never duplicate), and does NOT conduct a unit's internal method (that is /conduct's per-unit topology).
```

## Core Principle

**Delimit over Order**: When a large body of work must be carried out across many execution spans but the granularity of the cut is undetermined — you know *what* the work is but not *where to slice it into units* — the first act is to mark the cuts, not to sequence them. Diairesis searches for the cut-set whose every unit fits one span, whose cuts fall at the work's natural joints, and whose units cover the whole body with no work orphaned; it presents each cut for the user to settle and emits a WorkUnitMap. Sequencing those units — their order, independence, reconciliation, termination, and routing — is `/conduct`'s work, not Diairesis's. The two are duals across one seam: **cut, then conduct**.

**Reference over Ownership**: The external work-breakdown structure (a Linear project→milestone→issue tree, an issue set, a plan) is the single source of truth. A WorkUnit is an *execution-cut view* over that structure — it references issue ids and floats between milestone and issue granularity, but it never copies or owns the WBS's state. Diairesis reads the WBS read-only and writes only the cut-set; the WBS keeps its authority. This is why the WorkUnitMap carries a WBS reference rather than a snapshot: a downstream change to an issue is seen through the reference, never stale in a copy.

**Stigmergy signal principle**: The WorkUnitMap is a signal, not a payload — it carries the cut-set (which work belongs to which span-unit) as session-text, and `/conduct` reads it as its work prospect. No structured data channel is required; the session context is the environment, and `/conduct`'s conduct topology is the emergent response to the cuts Diairesis marked.

## Mode Activation

### Activation

AI detects a body of work whose cut into span-units is undetermined before that work is conducted OR the user calls `/delimit`. Detection is silent (Phase 0); the partition of each region requires user interaction (Phase 2) unless the body already fits one span (relay), a single dominant cut fits the span (relay), or the WBS scope is too thin to cut (route to `/inquire`).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/delimit` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided / Hybrid)**: A multi-span body of work detected before conduction — its cut into units is undetermined. The AI-detected path requires user confirmation at the Phase 2 partition gate (Hybrid initiator, mirroring `/conduct`).

**Granularity underdetermined** = the work body spans more than one execution unit AND the cut into those units is not already fixed by the WBS structure or a prior `/delimit` map.

Gate predicate:
```
granularity_underdetermined(WB) ≡ multi_span(WB) ∧ ¬cut_already_fixed(WB)
  multi_span(WB)        ≡ the body of work does not fit one execution span (horizon × lifecycle) — it must be cut
  ¬cut_already_fixed(WB)≡ the WBS does not already impose a span-sized partition (no obvious one-issue-per-span mapping), and no prior WorkUnitMap covers this scope
```

### Priority

<system-reminder>
When Diairesis is active:

**Supersedes**: Direct execution and direct conduction that begin before the work is cut into units
(The cut into span-units must be settled before the units are ordered or executed)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, present the highest-leverage uncut region's proposed cut — with its span-fit verdict and the current cut-set — for the user to settle via Cognitive Partnership Move (Constitution).
</system-reminder>

- Diairesis completes (emits the WorkUnitMap) before the units are conducted or executed
- Loaded instructions resume after the partition is settled or Esc

### Trigger Signals

Heuristic signals for granularity-underdetermined detection (not hard gates):

| Signal | Inference |
|--------|-----------|
| Large work body, no obvious unit | A project / milestone set / issue tree spans many spans and how to cut it into executable units is unclear |
| "How do I break this down?" | The user asks for a partition, not a sequence — where to cut, not what order |
| Multi-span before conduct | Work too big for one span is about to be conducted; the cut precedes the conduct |
| External WBS present | A Linear project, issue set, or plan exists to cut against (reference, not copy) |

**Skip**:
- The body already fits one execution span (no partition needed) — relay
- The WBS already imposes a span-sized partition (one issue ≈ one span) — the cut is fixed
- A prior `/delimit` WorkUnitMap covers this scope and the scope is unchanged
- The user asks for ordering, not cutting → `/conduct` (the units already exist)
- The WBS scope is too thin to cut → `/inquire` (gather the missing pre-cut fact first)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Sufficient signal (free-response: the partition is complete) | Autonomous-pack the residual at natural joints, assert the three invariants, emit WorkUnitMap |
| Phase 1 substrate exhaustion (no new region; residual = ∅) | Emit WorkUnitMap directly — every region already cut |
| Phase 1 substrate exhaustion (residual ≠ ∅) | Autonomous-pack the residual, surface, emit WorkUnitMap |
| Phase 0 scope insufficient | Route-away to `/inquire` (ContextInsufficient); no WorkUnitMap, the loop never opens |
| Phase 0 single span | Relay "no partition needed", deactivate |
| Phase 0 cut already fixed | Relay "cut already fixed" (WBS already span-partitioned, or a prior map covers the scope), deactivate |
| User Esc key (Phase 2) | Ungraceful exit — residual uncut, partition abandoned, no WorkUnitMap |

## Protocol

### Phase 0: Granularity Checkpoint (Silent)

Verify the work body needs a cut and bind the external WBS read-only. This phase is **silent** — no user interaction and no user-visible output.

1. **Probe the work body** `WB` for a granularity-underdetermined signal: a project / milestone set / issue tree / plan that spans more than one execution span and whose cut into units is not already fixed.
2. **Bind the WBS reference, horizon, lifecycle** (read-only): record `Λ.wbs_ref` as a reference into the external WBS (never a copy), the execution horizon (one span = invocation → next planned `/compact` or `/clear`), and the context lifecycle (the per-unit context ceiling). The ExternalWBS stays the single source of truth.
3. **Route or relay**:
   - If the WBS scope is too thin to cut (the structure cannot be seen well enough to find joints), route to `/inquire` — the missing pre-cut fact belongs to ContextInsufficient — and deactivate.
   - If the whole body already fits one span, present "no partition needed" as relay and deactivate.
   - If the WBS already imposes a span-sized partition (one issue ≈ one span) or a prior `/delimit` map covers this scope, present "cut already fixed" as relay and deactivate.
4. If granularity is underdetermined: initialize loop state (`cycle_n = 1`, `cut_set = ∅`, `work_unit_map = ∅`, `residual = regions(WB)` the single whole-body region, `committed = ∅`, `regions_touched = regions(WB)`, `joints = ∅`, `invariant_status = ⊥`, `history = ∅`) and proceed to Phase 1.

**Scope restriction**: Read-only investigation. Does NOT modify the WBS or call external services.

### Phase 1: Joint Scan + Packing Search

Re-scan the WBS for the current cycle, find the natural joints, and run the packing search.

1. **Per-cycle re-scan** — read the external WBS (Read/Grep/Glob over the Linear/issue tree, plan, or project config) for natural joints in the current frame: milestone boundaries, dependency seams, deliverable edges, or an emergent joint the seeds do not name. Skip regions already in `Λ.committed` (a settled region is never re-surfaced); the anchor is the highest-leverage region in `Λ.residual`. Composes `/bound` — where a cut could fall is a boundary question, and a prior BoundaryMap narrows the joint candidates.
2. **Packing search** — run `pack(joints, horizon, lifecycle)`: propose a cut-set by fitting each candidate region against the span budget (horizon × lifecycle). The search seeks the cut-set satisfying the three invariants — each unit Fits, every cut on a joint, and coverage complete with no work orphaned.
3. **Anchor selection** — surface the highest-leverage uncut region as `Anchor[cycle_n]`: the region whose cut most constrains the rest of the partition (a large Overflows region, or a hard dependency seam). Pair it with the proposed cut and its `SpanFit` (composing `/distill`'s zero-memory carriability as the Fits predicate — a unit Fits when its work is carriable by one self-contained span handoff).
4. **Emit the cycle's exit signal**: if no region surfaces (substrate exhausted) and `residual = ∅`, converge directly; if substrate exhausted and `residual ≠ ∅`, autonomous-pack the residual and converge; if the anchor is a **single dominant cut** (no viable alternative joint for this region — `SingleDominantCut(Anchor, proposed_cut)`) and its `SpanFit = Fits`, record `AcceptCut` as relay and advance directly to Phase 3 integrate, skipping the Phase 2 gate (Rule 11 — option-level entropy → 0); else surface the anchor for Phase 2.

**Scope restriction**: Read-only investigation. No WBS modification.

### Phase 2: Partition Gate (Constitution)

**Present** the cycle's anchor region, its AI-proposed cut, the span-fit verdict, and the current cut-set snapshot via Cognitive Partnership Move (Constitution).

**Surfacing format** — present as text output *before* the gate (Context-Question Separation):
- **Cycle**: `cycle_n` (always visible)
- **Anchor region**: the uncut region under judgment — what work it covers, cited from the WBS (issue ids, milestone)
- **Proposed cut**: where the AI proposes the cut falls (the joint) and the resulting unit
- **Span-fit verdict**: Fits / Overflows / Underfills, with its basis (the horizon × lifecycle estimate, composing `/distill` carriability)
- **Cut-set snapshot**: the units settled so far (each `region → cut at joint → fit`) and the residual regions still uncut
- **Joint candidates**: the natural joints found this cycle (milestone boundary, dependency seam, deliverable edge) with WBS citations

Then **present**:

```
How should this region be cut into an execution unit?

Options:
1. **AcceptCut** — the proposed unit fits one span; commit it as a WorkUnit
2. **MoveCut** — the cut should fall at a different joint: [which joint]
3. **SplitUnit** — the unit is too big for one span; cut it again at: [interior joint]
4. **MergeUnits** — the unit is too small; merge it with: [adjacent region]

If the partition is complete, say so in natural language — the remaining N residual regions
will be cut at their natural joints (you can review them) and the WorkUnitMap emitted.
```

**Free-response termination affordance**: Phase 2 prose includes the Sufficient signal (the partition is complete). Phase 3 parses the utterance into `TerminationIntent` while the typed coproduct `A ∈ CutDisposition` stays intact (gate integrity).

**Design principles**:
- **One region per cycle**: each Phase 2 presents one anchor region; surfaced-but-not-anchored regions accumulate into `Λ.residual`.
- **Span-fit visibility**: the fit verdict (Fits/Overflows/Underfills) is shown with its basis, so AcceptCut/SplitUnit/MergeUnits are recognized from evidence, not guessed.
- **Cut-set snapshot visibility**: the partition so far and the residual are surfaced each cycle — the user sees the exact map a Sufficient signal would commit.
- **WBS-cited evidence**: every surfaced datum carries a WBS reference (issue id, milestone), never a copy of its content.

### Phase 3: Pack Integration + Invariant Check

Parse the answer, apply the settled cut, and check the three invariants.

1. **Parse answer** — distinguish the typed `CutDisposition` selection from a free-response `TerminationIntent`. If both are present, the typed cut applies to the anchor region AND the Sufficient signal routes the loop. **Ambiguity-confirmation relay**: if the response is plausibly both a cut and a termination ("this one splits, and I think we're basically done"), present a one-turn relay confirmation of the parsed intent before routing.
2. **Integrate** (only when a `cut_disposition` is present — skipped on Esc, which binds no cut, and on a pure-termination Sufficient that carries no cut) — apply the cut to `Λ.cut_set` and `Λ.work_unit_map` as reference entries (issue ids, never copied content); move the anchor region from `Λ.residual` to `Λ.committed` only once its unit Fits (or the user explicitly accepts a non-Fits unit) — otherwise it stays in `Λ.residual` for a later cycle; append `(region, cut, fit, A)` to `Λ.history`.
   - **AcceptCut**: commit the proposed unit as a WorkUnit.
   - **MoveCut(joint)**: re-delimit the region's boundary at the named joint; re-fit.
   - **SplitUnit(joint)**: cut the region at the interior joint into two units; re-fit the first half before committing — if it still Overflows it stays in `residual` for a further split rather than committing oversized; the second enters `residual` for its own cycle.
   - **MergeUnits(neighbor)**: merge with the named adjacent region and re-fit; the neighbor must be an uncut `residual` region — if no residual neighbor remains, the underfilled region stays in `residual` (not committed underfilled) and is re-surfaced for merge in a later cycle; remove the absorbed region from `residual`.
3. **Check invariants** — assert `InvariantStatus` over the committed cut-set: span_fit (each committed unit Fits), natural_joint (each cut sits on a joint), coverage_complete (the committed ∪ residual covers the whole body with no work orphaned). coverage_complete is HARD — the map cannot emit while it fails.
4. **Routing**:
   - If `TerminationIntent = Sufficient`: autonomous-pack the residual (each remaining region cut at its natural joints, Extension-default per the project's Extension calibration), surface each cut for recognition, assert the three invariants over the whole map, emit WorkUnitMap, converge.
   - If `Esc`: ungraceful deactivate (residual uncut).
   - Else: re-derive the next-cycle anchor frame (the cut just settled routes the next scan toward its neighbours), `cycle_n += 1`, return to Phase 1.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Body cuts cleanly into 2-3 units at obvious joints | Brief per-cycle anchor + proposed cut + snapshot; Sufficient after a couple of cuts |
| Medium | 4-7 units, some Overflows/Underfills to split/merge | Structured per-cycle surfacing + span-fit basis + cut-set snapshot; residual autonomous-packed at Sufficient |
| Heavy | Many units, tangled dependency seams, repeated split/merge | Detailed joint evidence per cycle + invariant status surfaced each cycle; careful residual review before emit |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Diairesis) only if multi_span(WB) ∧ ¬cut_already_fixed(WB)` | Prevents false activation on single-span work or an already-fixed partition |
| Read-only WBS | The external WBS is referenced, never copied or mutated | The WBS keeps its single-source-of-truth authority; the map sees changes through the reference |
| Packing search | `pack(joints, horizon, lifecycle)` proposes the cut-set against the three invariants | The one new operation; the user disposes each proposed cut |
| Per-unit span-fit | `SpanFit` composes `/distill` carriability; shown with basis at Phase 2 | AcceptCut/SplitUnit/MergeUnits recognized from a fit verdict, not guessed |
| Commit only Fits | A unit moves to committed only when it Fits (or is explicitly accepted); a non-Fits unit stays in residual | No WorkUnitMap emits a unit violating its own SpanFit |
| One region per cycle | One anchor region per Phase 2 | Prevents per-cycle partition overload; residual accumulates |
| Cut-set snapshot visibility | The partition so far + residual surfaced each cycle | The user sees the map a Sufficient signal would commit |
| Hard coverage | `coverage_complete` is a convergence gate | A map orphaning work cannot emit; every piece of the body lands in exactly one unit |
| Autonomous residual pack | At Sufficient / exhaustion, residual is cut at natural joints (Extension-default) and surfaced | Termination never leaves orphaned work; the completion is recognized, not silent |
| Delimit not order | The map carries cuts, not sequence | Ordering is `/conduct`; Diairesis never sequences the units |
| Ambiguity-confirmation relay | A response readable as both cut and termination triggers a one-turn confirmation | One extra turn vs an irreversible commit on misread intent |
| Esc semantics | Esc → ungraceful exit; residual uncut | Distinguishes hard exit from satisfaction-driven termination |
| WorkUnitMap artifact | Emitted as separate session text carrying the WBS reference and cut_set | The cut-set flows to `/conduct` as its work prospect |

## Rules

1. **AI-searches, user-cuts**: AI scans the WBS, runs the packing search, and proposes each cut; settling the cut requires user choice via Cognitive Partnership Move (Constitution) at Phase 2 (per-cycle over `CutDisposition`) — **unless Phase 1 finds a single dominant cut (`SingleDominantCut(Anchor, proposed_cut)` ∧ SpanFit = Fits) and takes the typed relay branch (extension)** (Phase 1 → Phase 3, skipping Phase 2 for that cycle). AI detection is implicitly confirmed when the user engages with a proposed cut. The Hybrid initiator mirrors `/conduct` (its dual).
2. **Recognition over Recall**: Present structured options with differential futures via Cognitive Partnership Move (Constitution); Constitution interactions yield turn for response. Phase 2 binds to `A ∈ CutDisposition` (`{AcceptCut, MoveCut, SplitUnit, MergeUnits}`) plus a complete cut-set snapshot so a Sufficient signal is informed (per TYPES).
3. **Delimit over Order (invariant)**: Diairesis marks the cuts; it does not sequence the units. Ordering — the units' order, independence, reconciliation, termination, routing — is `/conduct`'s work. The emitted WorkUnitMap carries a cut-set, never a sequence; the two protocols are duals across one seam (cut, then conduct).
4. **Reference over Ownership (invariant)**: A WorkUnit references WBS ids and never copies or owns the external WBS's state. The WBS is the single source of truth; Diairesis reads it read-only and writes only the cut-set. The WorkUnitMap carries a WBS reference, not a snapshot, so downstream WBS changes are seen, never stale.
5. **The packing judgment is the only new logic**: Diairesis composes `/inquire` (scope insufficiency), `/bound` (joint candidates), `/distill` (per-unit span-fit), and feeds `/conduct` (downstream). Its one irreducible contribution is the partition/packing search — finding the cut-set satisfying the three invariants. It builds no new subsystem; everything else is composition wired as advisory graph edges.
6. **Three packing invariants**: a valid WorkUnitMap satisfies span_fit (each unit fits one span), natural_joint (every cut falls at a joint), and coverage_complete (the units cover the whole body with no work orphaned). span_fit is enforced at commit — a unit moves to committed only when it Fits (or is explicitly accepted); coverage_complete is the HARD convergence gate; natural_joint is surfaced and refined per cycle.
7. **No fixed joint taxonomy**: the `JointKind` seeds (milestone_boundary, dependency_seam, deliverable_edge) are recognition priors, not a closed set — `emergent` admits a joint the seeds do not name, and the user may name one. `Joint` and `Region` carry no category constructor; the partition emerges from the work body.
8. **Hard coverage at termination**: at Sufficient or substrate exhaustion, the residual is autonomous-packed at its natural joints (Extension-default per the project's Extension calibration) and surfaced for recognition before emit — termination never leaves orphaned work. The autonomous pack is relay (the cuts are deterministic against the joints already found); the user may refine any in the same utterance.
9. **Context-Question Separation**: Analysis, WBS evidence, the cut-set snapshot, the span-fit basis, and the joint candidates all appear as text before the gate; the gate contains only the essential question and option-specific differential implications. Embedding context in question fields is a protocol violation.
10. **Convergence evidence**: At convergence, present the per-unit cut trace (region → cut at joint → fit → disposition), the residual disposition trace (each autonomous_pack cut with its joint + Extension-default basis), and the InvariantStatus (all three invariants, with the coverage check shown). The WorkUnitMap is a separate session-text artifact carrying the WBS reference and the cut_set. Convergence is demonstrated, not asserted.
11. **Option-set relay test (Extension classification)**: If the packing search converges to a single dominant cut (option-level entropy → 0 — the body cuts at exactly one obvious joint), present the finding directly as relay rather than gating. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one.
12. **Gate integrity** (Safeguard tier): The defined option set (`A ∈ CutDisposition`) is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (filling `MoveCut`/`SplitUnit`/`MergeUnits` with a concrete joint or neighbour while preserving the coproduct) is distinct from mutation. The free-response Sufficient termination lives in Phase 2 prose, not in the typed coproduct.
13. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
14. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
15. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).

**Cross-session enrichment**: Prior session indices from the hypomnesis store (prior-session recall indices), when present, may seed the packing search toward cut granularities; the constitutive judgment remains with the user.
