# Span/Focus "Governor" — kill-test

Decides whether a control-level span/focus governor is a legitimate EP protocol or
should be killed (substrate, or collapses into `/conduct`). Per the follow-up
handoff: kill-test FIRST; a reasoned "do not build" is a valid terminal outcome.

## Candidate (one-page formal block)

```
type: (SpanOverloaded, AI, FOCUS, AbstractionNodeRefs × SessionAim) → FocusedSpan

── FLOW ──
Focus(NodeRefs, Aim) → Detect(span) → overloaded? →
  ¬overloaded: deactivate (span already holdable; no salience deficit)
  overloaded:  assess_salience(NodeRefs, Aim) → S →
    present(salient, deferred, rationale) [Constitution] → Stop → A →
      A = Confirm(focus):  emit FocusedSpan(focus, deferred, rationale, WorkProspect) → handoff to /conduct
      A = Adjust(focus'):  re-assess → loop
      A = DeferAll | Esc:  deactivate

── MORPHISM ──
(NodeRefs, Aim)
  → detect(span_overloaded)                 -- is the in-view span beyond holdable?
  → assess_salience(nodes, aim)             -- which nodes deserve attention now, given the aim
  → present(salient, deferred, rationale)   -- Recognition: user constitutes the focus
  → emit(FocusedSpan)                        -- focused span + next WorkProspect (NOT executed)
  → FocusedSpan
requires: span_overloaded(NodeRefs, Aim)
deficit:  SpanOverloaded
preserves: NodeRefs                          -- read-only refs; FOCUS never mutates the graph
invariant: Salience over Coverage

── TYPES ──
NodeRefs = Set(NodeRef)                       -- references only (no node internals read/written)
NodeRef  = { id, label, status_tag }
Aim      = SessionAim                          -- current work intent the span serves
S        = SalienceMap: NodeRef → score × rationale
FocusedSpan = { active: Set(NodeRef), deferred: Set(NodeRef), rationale: String, next: WorkProspect }
WorkProspect = the work handed to /conduct (arranged THERE, not here)
A        = UserMove ∈ {Confirm(focus), Adjust(focus'), DeferAll}
```

## Three worked examples

**E1 — clean case.** 7 nodes (3 about an API-boundary concept, 4 about a persistence
concept); aim = "settle the API-boundary concept." FOCUS: active = the 3 API nodes,
deferred = the 4 persistence nodes, rationale cites the aim. Emit FocusedSpan + a
WorkProspect ("work the 3 API nodes") for `/conduct`. No state write, no move run, no
queue, no monitor. Salience judged against the aim. — *passes the literal criteria.*

**E2 — vague aim.** Same graph; aim = "finish what I was on." If a single node is
clearly active → ¬overloaded → deactivate (no deficit). If many compete and the aim is
too thin to rank → FOCUS would have to GUESS salience, so it instead presents candidate
saliences for the user to constitute (Recognition). The value-add over a bare "what do
you want to focus on?" is the SalienceMap — surfacing graph state the user may not hold
in view. — *passes, but the value-add is thin and the "graph the user can't see" regime
is exactly where substrate (compaction) and `/recollect` already operate.*

**E3 — the collapse test.** Aim = "what should I work on next, and how?" The *what*
(which nodes) is salience; the *how* (order/arrangement) is `/conduct`. So FOCUS would
pre-select nodes and hand the arrangement to `/conduct`. But `/conduct` **Phase 1**
already *identifies candidate moves and selects the set* (`MoveId` + `Sc`, multiSelect,
n≥2), and `/conduct` **Phase 0** already judges *which single prospect / whether to
proceed* (MethodBrief + warrant). "Which nodes deserve attention now" is move-set
selection presented salience-ranked. — *this is where collapse pressure is highest.*

## Verdict analysis (the two axes the kill-test must separate)

**Axis A — substrate leakage (the hard kill criteria).** FOCUS writes no graph state,
runs no `/ground`/`/induce`, maintains no queue, monitors no execution. It only gates
salience and emits a WorkProspect. → **Passes Axis A.** It is not the rejected
orchestrator and not a state store.

**Axis B — distinctness from `/conduct` (the economy question).** This is the deciding
axis. Two readings:

- *Survive reading*: FOCUS is **upstream** of `/conduct`. Its input is a node graph +
  aim; its output is a focused span that *becomes* the WorkProspect `/conduct` consumes.
  `/conduct`'s WP-binding is a **relay** (it assumes the prospect is given); FOCUS
  handles the case where binding is itself a value-laden choice among many competing
  nodes. The residual obligation after "span overloaded" is to *constitute salience* —
  an epistemic, value-laden judgment, not substrate capacity management — so it passes
  the Epistemic Completeness Boundary test (residual is epistemic, not substrate
  enforcement). `/attend` (execution attention) does not overlap; FOCUS is
  macro-navigation attention.

- *Kill/fold reading*: the salience-selection **is** `/conduct` Phase 0 (which prospect)
  + Phase 1 (which moves), presented salience-ranked. `/conduct` Rule 2 already names
  "reveal context state the user structurally cannot see (the session's accumulated
  shape)" as its irreplaceable value — the same value FOCUS claims. The cross-session
  graph the user genuinely "cannot see" is already served by `/recollect` (re-find) +
  `/ascend` (reconstruct the higher unit from deposits); the in-session graph is small
  enough to hold, and "what is in view" is context-window/compaction = **substrate**. So
  FOCUS is squeezed: salience-selection → `/conduct` Phase 0/1; cross-session graph →
  `/recollect`+`/ascend`; "span/in-view" → substrate. The thin epistemic residue
  (salience-ranking a large candidate set) is best realized as a **`/conduct` Phase 1
  refinement** (present a large/cross-graph candidate move set salience-ranked), not a
  new protocol.

## Provisional verdict (to adversarial review)

**Lean: KILL — fold into `/conduct`, not a new protocol.** FOCUS passes the hard
substrate criteria (Axis A) but loses Axis B: its salience core collapses into
`/conduct` Phase 0/1, its cross-session reach is `/recollect`+`/ascend`, and its
"span/what-is-in-view" surplus is substrate. The genuinely useful piece — surfacing a
large or cross-graph candidate set salience-ranked when WP-binding is non-trivial — is a
**`/conduct` Phase 1 refinement** (a salience-ranked presentation of the candidate move
set), consistent with the project's Extension-default posture and its rejection of
separate session-level orchestrators.

## Converged verdict (adversarial review complete)

**KILL / FOLD into `/conduct`.** An independent adversarial review (Codex, gpt-5.5
xhigh), charged to refute the kill and make the strongest *survive* case on Axis B,
**could not sustain a distinct-protocol case** and converged on KILL in one round. Its
decisive reason: **`FocusedSpan` is not a distinct resolution object — it is a
salience-annotated `WorkProspect` handed to `/conduct`; the deficit is not independent
enough to justify a new EP protocol.** It additionally grounded the high bar in the
project's treatment of unused protocols as cognitive pollution in the epistemic
meta-layer. Author analysis and adversarial reviewer agree: do not build a new protocol;
realize the only non-redundant value as the `/conduct` Phase 1 refinement below.

## Recommended `/conduct` refinement (the realization)

Add to `/conduct` Phase 1 (`MoveId` + `Sc`): when the candidate move/node set is large
or spans the accumulated graph, present it **salience-ranked against the session aim**
with a brief rationale per candidate — surfacing the accumulated shape the user may not
hold in view — before the `multiSelect` confirmation. This captures FOCUS's only
non-redundant value inside the protocol that already owns move selection, with no new
deficit, no new terminal type, and no session-level controller.
