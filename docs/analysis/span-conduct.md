# SpanConduct — Concept Spec

Status: concept spec (no protocol skill, no plugin manifest, no executor code). A
crystallization writeup that defines three value/operand concepts and shows that the
apparent "Span Runbook" subsystem **dissolves into existing primitives** rather than
becoming a new one.

Provenance: `/induce` (Periagoge) crystallization of the "Span Runbook" abstraction
(cc-plugin design session, 2026-06-28). Sibling to `conduct-grounding-spec.md` and
`conduct-pattern-axis-grounding.md` in this directory.

## Northstar bound

`fundamental ≠ maximal`. Ergonomic wrappers stay in scripts; anything reproducible from
existing primitives gets no new subsystem. The deliverable here is a **concept spec**, not
a plugin or a protocol skill. The "Span Runbook" is **not a new protocol** — it factors into
three pieces (§1–§3), and the "Span executor" it seemed to need has **no residue**: every
function it implied reduces to a tool that already exists (§4). The one genuinely new act it
exposes — *where to cut the work into units* — is parked, not built (§5).

The three pieces:

| # | Concept | Kind |
|---|---------|------|
| 1 | **SpanConduct** | a domain-specialization of `/conduct` (Hyphegesis) — not a new deficit, not a new skill |
| 2 | **WorkUnit** | a named value object — an execution-cut view over an external WBS |
| 3 | **SpanCapabilityProfile** | a capability descriptor `/conduct` consumes to produce a span-aware topology |

---

## 1. SpanConduct

A **domain binding** of `/conduct`. It reuses Hyphegesis' deficit (`MethodUnderdetermined`)
and operation (`CONDUCT`) unchanged; only the operand domain is specialized.

```
── SIGNATURE ──
/conduct      : (MethodUnderdetermined, AI, CONDUCT, WorkProspect × ProtocolGraph)          → ConductedMethod
SpanConduct   : (MethodUnderdetermined, AI, CONDUCT, WorkUnit × MoveSet × SpanCapabilityProfile) → ConductedSpanMethod

── OPERAND BINDING ──
WorkProspect          ↦ WorkUnit                       -- the work facing cognition, cut to execution size (§2)
ProtocolGraph         ↦ MoveSet × SpanCapabilityProfile -- moves pre-identified from the unit's execution-cut,
                                                           the graph enriched by the span-capability descriptor (§3)
ConductedMethod       ↦ ConductedSpanMethod             -- a ConductedMethod whose topology is a span graph:
                                                           the routing axis saturated with handoff_to_span at the
                                                           cross-span leaves

── RESOLUTION ──
ConductedSpanMethod = ConductedMethod where
  topology.routing[leaf]  = handoff_to_span     -- each cross-span leaf routes its output across the span wall
  topology ⊨ SpanCapabilityProfile              -- the resolved topology is feasible under the capability descriptor,
                                                   or carries a substrate_infeasible degradation (never silent)
```

The span graph is the **output** of conduct, not an input. You never hand SpanConduct a
finished span graph; `/conduct` *produces* it by resolving its five axes (order,
independence, reconciliation, termination, routing) over the `MoveSet`, with `routing =
handoff_to_span` as the load-bearing value at the leaves.

### Composition seams (all existing `/conduct` machinery — no new machinery)

SpanConduct adds **zero** new protocol logic. Every cross-protocol seam is one Hyphegesis
already defines, reused by composition (not absorption):

| Seam | Protocol | `/conduct` mechanism reused |
|------|----------|------------------------------|
| **leaves** (cross-span output) | `/distill` (Diylisis) | the Phase 3 `handoff_to_span → /distill` portability seam — verbatim |
| **verify** | `/grasp` (Katalepsis) | a verification move-region |
| **refutation** | `/sublate` (Elenchus) | a `reconciliation = adversarial_refute` region *(the handoff's "/vet")* |
| **contract** | `/bound` (Horismos) + `/attend` (Prosoche) | boundary definition + situated execution around the conducted span |

### Invariants

- **S1 — No new deficit, no new skill.** SpanConduct reuses `MethodUnderdetermined` + `CONDUCT`.
  It is an operand specialization documented here, never a new `SKILL.md`, plugin manifest, or
  slash command.
- **S2 — Span graph is output, not input.** The topology is conduct's product; SpanConduct is
  never *given* a span graph to execute.
- **S3 — Composition, not absorption.** Each seam reuses an existing protocol; SpanConduct
  authors none of `/distill`, `/grasp`, `/sublate`, `/bound`, `/attend`. (Mirrors Hyphegesis'
  own `cross-span-absorption` guard: route-and-delegate, never re-implement.)
- **S4 — Conduction over Substrate (inherited).** Produces a plan and hands off; it does not
  execute the moves. When a required span capability is absent, the resolved topology carries a
  `substrate_infeasible` degradation rather than silently binding an infeasible substrate.
- **S5 — Single-span cognition (inherited).** `/conduct` conducts up to the span wall;
  `handoff_to_span` routes *output* across it and `/distill` ports it. SpanConduct never
  conducts the next span's cognition — the wall stays user-typed and undetected.

---

## 2. WorkUnit

A named **value object** — *not* a protocol. An `execution_cut` view over an external WBS
(Linear). It is the operand `/conduct` consumes in place of a bare `WorkProspect`.

```
── TYPE ──
WorkUnit = {
  wbs_ref:       Ref(LinearWBS),       -- a reference to the external WBS; the WBS is Linear-owned
  execution_cut: View(wbs_ref),        -- an execution-sized slice over the referenced WBS
  sidecar:       Ref(SidecarState),    -- live execution state lives here, NOT in Linear
  grain:         milestone ⊐ unit ⊐ issue  -- floats between milestone and issue
}
```

### Invariants (the six "does X, not Y")

- **W1 — References the WBS, does not own it.** `wbs_ref` points to a Linear-owned WBS;
  a WorkUnit never owns or restructures it.
- **W2 — Sizes execution, does not set product priority.** `execution_cut` sizes by execution
  effort; product priority remains a Linear concern.
- **W3 — May cross-cut issues, does not replace them.** A unit may span multiple issues; it does
  not replace, merge, or delete the underlying issues.
- **W4 — Carries sidecar execution state, does not store Linear progress.** Live execution state
  is the `sidecar`'s; Linear progress is written back through a thin Linear-MCP call (§4), never
  stored inside the unit.
- **W5 — Feeds `/conduct`, does not conduct itself.** A WorkUnit is the operand of SpanConduct,
  a value object — it never conducts.
- **W6 — Floating grain.** `grain` floats between milestone and issue. *Fixing* it — choosing
  where to cut the work into units — is the parked **diairesis** act (§5), out of scope here.

---

## 3. SpanCapabilityProfile

The **capability descriptor** `/conduct` consumes at its Phase 3 substrate-feasibility seam to
produce a span-aware topology. A read-only input — `/conduct` reads it, never mutates it.

```
── TYPE ──
SpanCapabilityProfile = {
  background_worker:        Bool,  -- can spawn a backgrounded cross-session worker
  resume_by_handle:        Bool,  -- a worker resumes by a pinned handle (a known session-id)
  chain:                   Bool,  -- a worker's output can chain into the next worker
  no_nest:                 Bool,  -- workers cannot nest (a fork cannot spawn a fork) — a CONSTRAINT
  subagent_no_resume_state:Bool,  -- a subagent carries no resumable state across the span wall
  sidecar_required:        Bool,  -- cross-span execution state must live in a sidecar
}
```

### Invariants

- **C1 — Read-only feasibility input.** `/conduct` reads the profile at the Phase 3 seam to
  judge realizability; the profile is never a Phase 2 axis-gate question and is never mutated.
- **C2 — Absent capability → degradation, never silent bind.** When the resolved topology
  requires a capability the profile lacks (e.g. a cross-span leaf needs `background_worker` +
  `resume_by_handle` and the substrate has neither), `/conduct` records a `substrate_infeasible`
  degradation — its existing discipline, reused unchanged.
- **C3 — Constraints bound the topology.** `no_nest` and `subagent_no_resume_state` are
  *constraints*, not affordances: `no_nest` forbids recursive span nesting; `subagent_no_resume_state`
  forbids a subagent leaf from being a cross-span (`handoff_to_span`) consumer — a subagent is
  in-session bounded only.
- **C4 — Sidecar coupling.** `sidecar_required` couples to `WorkUnit.sidecar` (W4): when set,
  cross-span execution state must live in the sidecar, keeping Linear free of execution bookkeeping.

---

## 4. No "Span executor" — the reduction table

The "Span Runbook" appeared to need a new **Span executor** utility. It has none: every function
it implied is already provided by an existing tool. "Span" is a **named discipline over
`remote-spawn`**, not a tool.

| Implied executor function | Existing tool |
|---------------------------|---------------|
| spawn / resume / re-attach a backgrounded cross-session worker | **remote-spawn** (`remote-tmux`) |
| alternate-model worker | **codex-plus** |
| in-session bounded sub-execution | **fork / subagent** (`forge`) |
| harvest / handoff (make output portable across the span wall) | **`/distill`** (Diylisis) |
| topology (order · independence · reconciliation · termination · routing) | **`/conduct`** (Hyphegesis) |
| Linear status write-back | a thin **Linear-MCP** call |

Because the table closes with no residual row, **no new subsystem is warranted** (Northstar:
reproducible-from-existing-primitives → no new subsystem).

---

## 5. The granularity-cutting act → diairesis (parked, #586)

One act is *not* covered by the three concepts above: the **DELIMIT** act — deciding *where to
cut the work into units*, i.e. how the floating `WorkUnit.grain` (W6) gets fixed for a given body
of work. That act is **parked as a future protocol, "diairesis"**, at
[`jongwony/epistemic-protocols#586`](https://github.com/jongwony/epistemic-protocols/issues/586).

This spec **cross-references it only** — it does not implement it. WorkUnit (§2) is the *result*
of a cut (a value object); diairesis is the *act of cutting*. Keeping them apart is deliberate:
SpanConduct consumes already-cut units, and the cutting discipline is a separate, parked inquiry.

---

## Summary

The "Span Runbook" is not a new protocol and needs no new executor. It is:

- **SpanConduct** — `/conduct` with its operand bound to `WorkUnit × MoveSet × SpanCapabilityProfile`,
  composing `/distill` · `/grasp` · `/sublate` · `/bound` · `/attend` at existing seams (§1).
- **WorkUnit** — an execution-cut value object over a Linear WBS, referencing but not owning it (§2).
- **SpanCapabilityProfile** — a read-only capability descriptor `/conduct` consumes at its
  feasibility seam (§3).

— with every executor function reduced to an existing tool (§4) and the granularity-cutting act
parked as diairesis (#586, §5).
