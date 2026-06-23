# Conceptual Foundations

Design rationale and supplementary context for Prothesis (frame). These sections are not required for standard protocol execution — consult when deeper understanding of design decisions is needed.

Since frame v8, frame is a **pure lens-formation tool / substrate-binder**: it selects analytical lenses and, for each lens, declares the substrate it needs (an authoritative abstract `substrate_need` plus advisory `binding_hints`) and the lens's channel need, then hands off the framed object — a detailed lens (`LensReturn`, when a single lens or no specialized substrate is needed) or lens↔substrate pairs (`SubstrateCorrespondence`, when ≥2 lenses carry specialized substrate needs) — and stops (frame Rule 3). It does not arrange the perspectives and does not realize their isolation (that is `/conduct`'s arrangement functor, reached via the nudge that accompanies every `SubstrateCorrespondence` handoff), does not execute the inquiry (that is the substrate's), and **never synthesizes a multi-perspective result in its own context** — convergence is claimable only by a substrate that ran the lenses in genuine isolation (frame Rule 5). The rationale below is written against that model.

## Plan Mode as a Substrate

Plan mode is one **substrate** that can execute a frame `SubstrateCorrespondence` handoff — it is not a special frame phase. frame produces the same framed object regardless of which substrate will execute it; only realization differs.

- frame's Phases 0–3 (confirm Mission Brief, gather context, select lens, bind-substrate-and-handoff) run identically in or out of plan mode — `AskUserQuestion` is available for the Phase 0 and Phase 2 gates, and Phase 3 is a relay emit of the framed object.
- When **plan mode is the executing substrate**, it realizes the handoff with the subagents it affords (`Task(subagent_type="Explore")` for context, and per perspective the `binding_hints`' candidate subagent type — falling back to `Task(subagent_type="Plan")`), preserving the arrangement's `isolated` independence (designed by `/conduct`) — each perspective analyzed in a separate subagent context.
- **Feasibility limit**: plan mode has no persistent addressable peers, so it cannot host a non-aggregate reconciliation (a dialectical or peer-negotiation arrangement). When the arrangement requires that, `/conduct` (at arrangement time) or the substrate (at execution time) declares the degradation and realizes the closest aggregate behavior, rather than silently binding an infeasible substrate. This feasibility judgment is the substrate's / `/conduct`'s, surfaced at the handoff seam — not frame's, and not a frame phase.

The quality trade-off of an aggregate-only realization (independent convergence without peer-resolved divergence, synthesis from isolated outputs only) is a property of the *substrate's* execution of the handoff, evaluated as a separate trace (see [`evaluation-methodology.md`](./evaluation-methodology.md)), not of frame's object supply. Because frame never synthesizes in its own context, any convergence is the isolated substrate's — the structural separation is what keeps a single context from manufacturing a false consensus.

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
| Sequential analysis → anchoring cascade | Isolated-context arrangement (`/conduct`-designed, substrate-enforced) | The arrangement requires each perspective to be formed in an independent context, so earlier perspectives cannot contaminate later ones when the substrate executes |

Each stage depends on the previous: without the open-world trigger, premature closure occurs silently; without AI-guided detection, the user cannot self-diagnose; without the isolation arrangement, even correctly identified perspectives would contaminate each other through shared context at execution. The three choices form a defense-in-depth against single-framework fixation — the first two enacted by frame as it forms the lenses, the third designed by `/conduct` (reached via frame's nudge) and enforced by the substrate.

### AI-Guided Initiator: Epistemological Basis

Framework absence is **meta-ignorance** — the state of not knowing that you don't know. This is distinct from ordinary ignorance (knowing you don't know something). A user experiencing meta-ignorance cannot recognize that multiple valid frameworks exist for their problem because recognizing this requires the very frameworks they lack.

If Prothesis were **user-initiated only**, it would require users to self-diagnose a deficit defined by its invisibility to the sufferer — a structural contradiction. The Dunning-Kruger effect formalizes this: competence in a domain is prerequisite to recognizing incompetence in that domain. Framework selection is precisely such a domain.

**AI-guided** is therefore not a convenience choice but an epistemological necessity. The AI can detect `framework_absent(U)` because it has access to the space of possible frameworks — the user cannot perform this detection because access to that space is exactly what they lack.

This does not make Prothesis fully AI-autonomous. Layer 2 (AI-guided) detects the *condition*; the user retains *selection authority* via the Phase 2 gate (Recognition over Recall). The AI says "here are the lenses"; the user says "I'll look through these ones." Detection is AI-guided; selection is user-authorized.

### Deficit Identity: Framework Spans Lens and Form, frame Owns the Object

The absent "framework" that `FrameworkAbsent` names is not only *which* lens to apply but also *how* the resulting perspectives reconcile — the arrangement (the form). A user facing framework absence typically lacks both: they cannot name the right analytical lenses, and they cannot say whether those lenses should aggregate independently, debate, or refute one another. Both are facets of the same meta-ignorance — not knowing what one does not know about how to structure the inquiry.

frame resolves this deficit by **forming the object plus its substrate need, and delegating the form — isolation, reconciliation, and synthesis — to `/conduct` via the nudge**. The framed object is a detailed lens (`LensReturn`) or lens↔substrate pairs (`SubstrateCorrespondence`) — never an arrangement, and never a compiled form directive. The `/conduct` nudge accompanies every `SubstrateCorrespondence` handoff; `/conduct`, the **arrangement functor**, designs the form over the perspectives (default and non-default alike — isolated independence, conditional dialogue, horizon-fusion synthesis, and any departure from them). The deficit type is unchanged — `FrameworkAbsent → FramedInquiry` — but its resolution is factored: frame owns the object and its substrate need, `/conduct` owns the form (isolation + arrangement + synthesis), and the substrate owns execution (including any synthesis, which frame never performs).

The AI-guided initiator pattern still extends to form, but across two protocols. Just as the AI proposes candidate lenses (with the user selecting) at frame's Phase 2, the form deficit is detected at frame and routed to `/conduct` via the nudge — where the AI proposes the default form as a relay (no gate) and, when the user wants a non-trivial form, `/conduct`'s impact-first axis gates let the user judge it. The user cannot self-diagnose the absence of a reconciliation structure for the same Dunning-Kruger reason they cannot self-diagnose lens absence; detection of the form deficit is AI-guided (frame surfaces it, `/conduct` proposes and gates the form), and any non-trivial form is user-judged at `/conduct`'s gates.

### Theoria-Praxis Boundary

frame's Phases 0–3 constitute pure **theoria** (θεωρία) — contemplative inquiry that produces the framed object (the detailed lens `LensReturn` or the lens↔substrate pairs `SubstrateCorrespondence`) as a theoretical artifact. The framed object reveals which frameworks to apply and which substrate each needs (the form — isolation, reconciliation, synthesis — is `/conduct`'s, routed via the nudge, not frame's); it changes nothing and synthesizes nothing.

The transition from theoria to praxis occurs at the **handoff**: frame emits the framed object and stops; the substrate's isolated execution of the handoff (or the user's application of a `LensReturn` lens) is the praxis. The handoff is the explicit boundary — the substrate, not frame, acts on the object, and any synthesis the substrate produces is its own (frame ran no lens in its own context).

**Design principle** (Placement over Prescription): Prothesis places perspectives before the user and supplies the object plus its substrate need; it does not prescribe, perform action, or synthesize a multi-perspective verdict. frame executing the inquiry — or reasoning all lenses inline and claiming convergence — would violate this principle: the user might want to read the lens without executing, route the handoff through a different substrate, request additional perspectives, or reject the framing entirely. Each is a valid outcome of theoria.

**Structural enforcement**: frame's morphism terminates at `handoff → STOP`. There is no execute step, no synthesis step, and no post-handoff loop inside frame (the `false-convergence`/`inline-synthesis-creep`, `executor-creep`, and `arranger-creep` adversarial guards forbid frame from re-acquiring those — in particular, frame may never reason all lenses in its own context and present a convergence). The structural path to praxis is the substrate's isolated execution of the handed-off object; Output Style nudges may point to downstream protocols, which themselves require user consent at their own activation gates.

## Parametric Nature

The object supply is **domain-agnostic**: instantiate C differently, derive a different perspective space. The structure `U → MB → G → C → P → S → bind_substrate → handoff` applies wherever the open-world condition holds. Arrangement (`/conduct`) and execution + synthesis (substrate) compose downstream of the handoff; frame's own structure ends at bind-substrate-and-hand-off.

## Specialization

When guaranteed coverage is required, Prothesis can be constrained:

```
Prothesis(mandatory_baseline, optional_extension):
  baseline ∪ select(extension) → Pₛ
  bind_substrate(Pₛ) → discriminate → {LensReturn | SubstrateCorrespondence(lens↔substrate pairs ⊕ ConductRef)} → handoff
```

**Principle**: Mandatory baseline cannot be reduced by user selection; only extended. frame supplies the constrained lens set plus each lens's substrate need; for `SubstrateCorrespondence`, the isolated substrate executes it under the arrangement `/conduct` designs (and synthesizes, if at all — never frame), while `LensReturn` is applied directly by the user or a downstream protocol (no isolated execution, no synthesis).

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

## Deactivation

| Trigger | Effect |
|---------|--------|
| Framed object handed off | Detailed lens(es) (`LensReturn`) or lens↔substrate pairs (`SubstrateCorrespondence`) emitted; protocol deactivates (frame does not loop after handoff) |
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
