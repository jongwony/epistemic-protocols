# Conceptual Foundations

Design rationale and supplementary context for Prothesis (frame). These sections are not required for standard protocol execution — consult when deeper understanding of design decisions is needed.

Since frame v7, frame is a **pure compiler / object supplier**: it selects analytical lenses and compiles a framed object — a lens recommendation (Mode 1) or an inquiry spec (Mode 2) — then hands off to the substrate and stops (frame Rule 3). It does not arrange the perspectives (that is `/conduct`'s arrangement functor) and does not execute the inquiry (that is the substrate's). The rationale below is written against that model.

## Plan Mode as a Substrate

Plan mode is one **substrate** that can execute a frame-compiled inquiry spec — it is not a special frame phase. frame compiles the same spec regardless of which substrate will execute it; only realization differs.

- frame's Phases 0–3 (confirm Mission Brief + mode, gather context, select lens, compile-and-handoff) run identically in or out of plan mode — `AskUserQuestion` is available for the Phase 0 and Phase 2 gates, and Phase 3 is a relay emit of the compiled object.
- When **plan mode is the executing substrate**, it realizes the spec with the subagents it affords (`Task(subagent_type="Explore")` for context, `Task(subagent_type="Plan")` per perspective), preserving the directive's `isolated` independence — each perspective analyzed in a separate subagent context.
- **Feasibility limit**: plan mode has no persistent addressable peers, so it cannot host a non-aggregate reconciliation (a dialectical or peer-negotiation arrangement). When the arrangement requires that, `/conduct` (at arrangement time) or the substrate (at execution time) declares the topology-degradation and realizes the closest aggregate behavior, rather than silently binding an infeasible substrate. This feasibility judgment is the substrate's / `/conduct`'s, surfaced at the handoff seam — not frame's, and not a frame phase.

The quality trade-off of an aggregate-only realization (independent convergence without peer-resolved divergence, synthesis from isolated outputs only) is a property of the *substrate's* execution of the spec, evaluated as a separate trace (see [`evaluation-methodology.md`](./evaluation-methodology.md)), not of frame's compilation.

## Distinction from Socratic Method

| Dimension | Socratic Maieutics | Prothesis |
|-----------|-------------------|-----------|
| Knowledge source | Latent within interlocutor | Provided externally |
| Premise | "You already know" | "You don't know the options" |
| Role metaphor | Midwife (draws out) | Cartographer (reveals paths) |
| Question form | Open (Recall burden) | Options (Recognition only) |

## Design Rationale

Origin: [Don't Ask AI "How Do You Think?"](https://medium.com/delightroom/ai%EC%97%90%EA%B2%8C-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%83%9D%EA%B0%81%ED%95%B4-%EB%9D%BC%EA%B3%A0-%EB%AC%BB%EC%A7%80-%EB%A7%88%EC%84%B8%EC%9A%94-e33c09646469) (DelightRoom Engineering Blog, 2026-03). The blog describes the motivational narrative; this section documents the design decisions and their epistemological basis.

### Single-Framework Fixation: Chain Failure Blocking

AI conversations suffer from **single-framework fixation** — when AI selects one analytical framework early and anchors all subsequent analysis to it. This is the default behavior: asked "how do you think about X?", AI picks one lens and commits. The user receives a coherent but potentially incomplete analysis without knowing what perspectives were excluded.

Three design choices in Prothesis break this failure chain at different stages:

| Failure stage | Design choice | Blocking mechanism |
|---|---|---|
| Framework absence → premature closure | Open-world trigger (`framework_absent(U)` gate) | Detects when problem space is not fully enumerated; activates before AI commits to a single framework |
| Self-diagnosis impossible → meta-ignorance persists | AI-guided initiator | External detection bypasses the user's inability to recognize their own framework blindness |
| Sequential analysis → anchoring cascade | Isolated-context directive (substrate-enforced) | The compiled directive requires each perspective to be formed in an independent context, so earlier perspectives cannot contaminate later ones when the substrate executes |

Each stage depends on the previous: without the open-world trigger, premature closure occurs silently; without AI-guided detection, the user cannot self-diagnose; without the isolation directive, even correctly identified perspectives would contaminate each other through shared context at execution. The three choices form a defense-in-depth against single-framework fixation — the first two enacted by frame at compilation, the third compiled into the spec and enforced by the substrate.

### AI-Guided Initiator: Epistemological Basis

Framework absence is **meta-ignorance** — the state of not knowing that you don't know. This is distinct from ordinary ignorance (knowing you don't know something). A user experiencing meta-ignorance cannot recognize that multiple valid frameworks exist for their problem because recognizing this requires the very frameworks they lack.

If Prothesis were **user-initiated only**, it would require users to self-diagnose a deficit defined by its invisibility to the sufferer — a structural contradiction. The Dunning-Kruger effect formalizes this: competence in a domain is prerequisite to recognizing incompetence in that domain. Framework selection is precisely such a domain.

**AI-guided** is therefore not a convenience choice but an epistemological necessity. The AI can detect `framework_absent(U)` because it has access to the space of possible frameworks — the user cannot perform this detection because access to that space is exactly what they lack.

This does not make Prothesis fully AI-autonomous. Layer 2 (AI-guided) detects the *condition*; the user retains *selection authority* via the Phase 2 gate (Recognition over Recall). The AI says "here are the lenses"; the user says "I'll look through these ones." Detection is AI-guided; selection is user-authorized.

### Deficit Identity: Framework Spans Lens and Form, frame Owns the Object

The absent "framework" that `FrameworkAbsent` names is not only *which* lens to apply but also *how* the resulting perspectives reconcile — the arrangement (the form). A user facing framework absence typically lacks both: they cannot name the right analytical lenses, and they cannot say whether those lenses should aggregate independently, debate, or refute one another. Both are facets of the same meta-ignorance — not knowing what one does not know about how to structure the inquiry.

frame resolves this deficit by **supplying the object and the trivial-default form, and delegating non-trivial form to `/conduct`**. The framed object is the lens (Mode 1) or the inquiry spec (Mode 2) — never an arrangement. Where the form is trivial, frame compiles the `DefaultDirective` (isolated, independent-then-conditional-dialogue, horizon-fusion) as a zero-gate relay; where the form is non-trivial, frame references `/conduct`, the **arrangement functor** that designs the topology over the perspectives. The deficit type is unchanged — `FrameworkAbsent → FramedInquiry` — but its resolution is factored: frame owns the object plus the default form, `/conduct` owns non-trivial arrangement, and the substrate owns execution.

The AI-guided initiator pattern still extends to form, but across two protocols. Just as the AI proposes candidate lenses (with the user selecting) at frame's Phase 2, the AI proposes a default form as a relay (no gate) — and when the user wants a non-trivial form, `/conduct`'s impact-first axis gates let the user judge it. The user cannot self-diagnose the absence of a reconciliation structure for the same Dunning-Kruger reason they cannot self-diagnose lens absence; detection of the form deficit is AI-guided, the default form is relayed, and any non-trivial form is user-judged at `/conduct`'s gates.

### Theoria-Praxis Boundary

frame's Phases 0–3 constitute pure **theoria** (θεωρία) — contemplative inquiry that produces the framed object (the lens recommendation `Lᵣ` or the inquiry spec `IS`) as a theoretical artifact. The framed object reveals which frameworks to apply and how, by default, to reconcile them; it changes nothing.

The transition from theoria to praxis occurs at the **handoff**: frame emits the framed object and stops; the substrate's execution of the spec (or the user's application of a Mode 1 lens) is the praxis. The handoff is the explicit boundary — the substrate, not frame, acts on the object.

**Design principle** (Placement over Prescription): Prothesis places perspectives before the user and compiles the object; it does not prescribe or perform action. frame executing the inquiry would violate this principle — the user might want to read the lens without executing, route the spec through a different substrate, request additional perspectives, or reject the framing entirely. Each is a valid outcome of theoria.

**Structural enforcement**: frame's morphism terminates at `handoff → STOP`. There is no execute step, no synthesis step, and no post-handoff loop inside frame (the `executor-creep` and `arranger-creep` adversarial guards forbid frame from re-acquiring those). The structural path to praxis is the substrate's execution of the handed-off spec; Output Style nudges may point to downstream protocols, which themselves require user consent at their own activation gates.

## Parametric Nature

The compilation is **domain-agnostic**: instantiate C differently, derive a different perspective space. The structure `U → MB → G → C → P → S → compile → handoff` applies wherever the open-world condition holds. Arrangement (`/conduct`) and execution (substrate) compose downstream of the handoff; frame's own structure ends at compile-and-hand-off.

## Specialization

When guaranteed coverage is required, Prothesis can be constrained:

```
Prothesis(mandatory_baseline, optional_extension):
  baseline ∪ select(extension) → Pₛ
  compile(Pₛ ⊕ ConductRef ⊕ DefaultDirective) → IS → handoff
```

**Principle**: Mandatory baseline cannot be reduced by user selection; only extended. frame compiles the constrained lens set into the spec; the substrate executes it.

## Per-Message Application

Every user message triggers perspective evaluation:

| Message Type | Action |
|--------------|--------|
| New inquiry | Prothesis |
| Follow-up within established lens | Continue with selected perspective |
| Uncertain | Default to Prothesis |

**Decision rule**: When uncertain whether perspective is established, default to Prothesis.

```
False positive (unnecessary question) < False negative (missed perspective)
```

## Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Framed object handed off | Lens recommendation or inquiry spec emitted; mode deactivates (frame does not loop after handoff) |
| User starts unrelated topic | Re-evaluate for new Prothesis |

## Conditions

### Trigger Prothesis

Prothesis applies to **open-world** cognition where the problem space is not fully enumerated:

- Purpose present, approach unspecified
- Multiple valid epistemic frameworks exist
- User's domain awareness likely incomplete
- **Structure test**: "What might I be missing?" is a meaningful question

### Skip Prothesis

Prothesis does **not** apply to **closed-world** cognition:

- Single deterministic execution path exists
- Perspective already specified
- Known target with binary outcome

**Heuristic**: If a deterministic procedure can answer the inquiry, skip Prothesis.
