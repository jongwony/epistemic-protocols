# Prothesis Evaluation Methodology

This reference defines how to evaluate Prothesis (frame) when its specialized epistemic behavior differs from generic agent-team best-practice compliance. Since frame v8, frame is a pure object supplier / substrate-binder — it supplies the lens, declares each lens's `substrate_need` (authoritative) with `binding_hints` (advisory), then hands off and stops (frame Rule 3), and **never synthesizes a multi-perspective result in its own context** (frame Rule 5). Evaluation therefore separates **two distinct concerns**:

1. **frame's object-supply quality** — did frame surface the load-bearing perspectives, keep the user's recognition burden low, declare a coherent per-lens substrate need with useful binding hints, compile a coherent default directive, route non-trivial arrangement to `/conduct`, and avoid any inline convergence/synthesis? This is what frame owns.
2. **the substrate's realization** — when a `SubstrateCorrespondence` handoff is executed, did the substrate honor the directive (genuine isolation, conditional reconciliation, synthesis-without-flattening) — and is any convergence claim grounded in lenses that actually ran in isolation? This is the substrate's, not frame's, and is evaluated as a separate trace.

Use this together with [`agent-teams-bp-applicability.md`](./agent-teams-bp-applicability.md), which marks which agent-team best practices the *substrate* applies when executing a frame `SubstrateCorrespondence` handoff.

## Evaluation Unit

Evaluate a frame run as a phase-scoped protocol trace, not as a generic agent-team session snapshot. frame's trace ends at handoff; the substrate's execution (if any) is a downstream trace.

Minimum frame trace record:

- input deficit: whether the user actually presented `FrameworkAbsent`
- coproduct branch: `LensReturn` (single lens ∨ no specialized substrate) or `SubstrateCorrespondence` (≥2 lenses with substrate needs) — discriminated by substrate availability, not a user mode choice
- phase path: Phase 0 through handoff (Phase 3)
- perspective set: options presented, selected perspectives, and rationale
- framed output: for `LensReturn`, the detailed lens(es) + per-perspective directive; for `SubstrateCorrespondence`, the lens↔substrate pairs — each lens's `substrate_need` (authoritative) + `binding_hints` (advisory), the default directive, `/conduct` arrangement reference, and channel-need annotation
- routing fit: whether the framed object pointed to the next appropriate protocol/substrate, whether each lens's substrate need was well-targeted (and binding hints preferred skill-bundled agents over `general-purpose`), and whether non-trivial arrangement was correctly routed to `/conduct`
- inline-synthesis check: did frame avoid reasoning all lenses in its own context and presenting a "convergence"? Any inline multi-perspective synthesis is a `false-convergence` defect
- verification signals: user recognition, follow-up correction, review findings, or downstream protocol fit

When a `SubstrateCorrespondence` handoff is executed, record the substrate realization as a *separate* trace: isolation fidelity, which dialogue triggers fired, and synthesis quality. Do not attribute substrate realization defects to frame's object supply (or vice versa).

## Multi-Session Method

Do not judge the whole protocol from one execution path. Sample across at least these shapes before making a protocol-level claim:

- `LensReturn` with a lightweight framing request (single lens, or no specialized substrate)
- `SubstrateCorrespondence` with distinct selected perspectives carrying substrate needs (evaluate the lens↔substrate pairs)
- high-ambiguity request where perspective selection is the main value
- high-complexity request where the per-lens substrate need + directive + `/conduct` routing is the main value
- a case where the arrangement is non-trivial and frame correctly hands off to `/conduct`
- a multi-lens case where the temptation to synthesize inline is high — frame must emit `SubstrateCorrespondence` and make no convergence claim of its own

Session-level findings may justify a local patch, but claims about frame as a protocol require cross-session recurrence or a structural proof tied to the formal block.

## Specialized-Use Criteria

Generic agent-team best practices are evidence only after it is established that they belong to the substrate, not to frame.

| Criterion | Evaluation question |
|---|---|
| Layer attribution | Is the observed behavior frame's (object supply) or the substrate's (execution + synthesis)? Do not score frame on execution it no longer owns. |
| Epistemic purpose | Does frame's output help resolve `FrameworkAbsent` into `FramedInquiry` — a usable detailed lens (`LensReturn`) or a coherent set of lens↔substrate pairs (`SubstrateCorrespondence`)? |
| No inline synthesis | Did frame refrain from reasoning all lenses in its own context and presenting a convergence? Any inline multi-perspective synthesis is a `false-convergence` defect, not a quality output. |
| Directive warrant | Does the compiled default directive specify isolation + reconciliation + synthesis that *would* integrate findings without flattening perspective differences when executed? |
| Arrangement routing | When the arrangement (order, independence, reconciliation, termination, routing) is non-trivial, did frame route to `/conduct` rather than re-eliciting a topology itself (arranger-creep)? |
| Recognition burden | Did the user need only to recognize suitable perspectives, or were they forced to invent the framework? |
| Routing fit | Did the framed object point to the next appropriate protocol or substrate when framing alone was not enough? |

## Hidden Assumptions To Check

### Completeness = Quality

Completeness is not sufficient evidence of quality. A frame output is good when it exposes the load-bearing perspectives needed for the user's inquiry and preserves meaningful divergence. Exhaustive perspective lists can lower quality if they dilute the user's recognition task.

### Session Representativeness

A single trace is not representative by default. Coproduct branch (`LensReturn` vs `SubstrateCorrespondence`), stakes, ambiguity, and selected perspectives change the relevant evaluation criteria. Treat one-session critiques as instance findings unless the same failure recurs or the formal block makes the defect inevitable.

### Cost = Tokens

Token usage is only one cost surface. Also evaluate recognition burden, review burden, false-positive perspective inflation, and downstream rework prevented by better framing. Note that frame's own cost is bounded — it compiles and stops; execution cost belongs to the substrate.

### No Communication = Isolation Failure

No communication is not automatically a failure. The directive's default `isolated` independence is intentional because independent perspectives reduce premature convergence; the substrate enforcing it during inquiry is correct behavior, not a coordination gap. Use the applicability table before applying cross-team communication expectations to a substrate trace.

### Static Snapshot Evaluation

Static snapshots miss whether frame correctly routes and preserves residual uncertainty, and whether the substrate correctly realizes the spec over the loop. Evaluate the frame trace plus follow-up signals: user recognition, reviewer challenges, downstream protocol fit, and whether a later session had to re-derive the same framing.

## Verdict Structure

Use this shape for review notes:

```text
Scope: [phase/mode/session set]
Layer: [frame object supply / substrate realization]
Finding: [observed behavior]
Protocol relevance: [effect on FrameworkAbsent -> FramedInquiry]
Evidence: [trace citation or repeated-session pattern]
Disposition: [local issue / protocol patch / no action / needs more sessions]
```

**Escalation threshold**: Escalate `local issue -> protocol patch` only when the same finding recurs across at least 3 independent sessions, or a structural proof ties it to a formal block (TYPES / MORPHISM / PHASE TRANSITIONS). Below that threshold, record it as a `local issue`. This mirrors the protocol's existing revision convention (named-trigger promotion across 3+ sessions), so a single striking session does not by itself justify a protocol-level change.

Avoid verdicts that say only "violates agent-team best practice." The missing step is whether that practice belongs to the substrate's execution of the spec — frame no longer owns it.

## Worked Example: Isolation Value Is Scoped

An observed evaluation case ran the same inquiry two ways: as isolated per-perspective research (each selected lens investigated independently, then synthesized) versus a single flat research pass over the same question. Isolation surfaced a robust convergent finding that several independent lenses reached on their own and that the flat pass missed entirely — evidence that isolation pays off on decomposable questions where independent derivation cross-checks a result. On a cross-cutting architectural sub-question, the flat single-context pass integrated better, because one context held the whole problem while the isolated lenses each saw only a fragment. Read this as scoped, not settled: isolation's benefit tracks how decomposable the inquiry is, so the directive's `isolated` default is a sensible baseline rather than a universal good — and an inquiry whose value lies in single-context integration is exactly the case for a non-default arrangement routed to `/conduct`. This remains an instance finding pending multi-session corroboration per Session Representativeness above.
