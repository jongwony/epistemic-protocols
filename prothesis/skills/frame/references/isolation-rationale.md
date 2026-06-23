# Isolation Rationale

**`SubstrateCorrespondence` only.** `LensReturn` (single lens, or no specialized substrate) terminates at the lens — it returns the detailed lens(es) and triggers no isolated execution, and makes no convergence claim. See frame Rule 3 (Lens-formation tool, not arranger or executor), Rule 5 (No inline synthesis), and Rule 6 (Independence-before-contamination, routed to `/conduct`).

`independence: isolated` is the default of the isolation/reconciliation/synthesis apparatus that the **`/conduct` nudge** carries with every `SubstrateCorrespondence` handoff; `/conduct` **designs** the arrangement and the **substrate enforces it at execution time**. frame does not compile this apparatus, does not itself isolate, and does not execute perspectives — it forms the lenses, declares each lens's substrate need, nudges `/conduct`, and stops. Genuine isolation is exactly what makes a downstream convergence claim trustworthy: because each lens runs in its own context, agreement is earned rather than manufactured by a single context reasoning all lenses at once. This reference records *why* the default is `isolated` and *why* any non-default independence is a non-trivial arrangement that `/conduct` designs.

## Why isolated is the default

Each perspective MUST be analyzed in an **isolated context** so that, before any reconciliation, it forms its assessment without:
- Cross-perspective contamination from shared analysis history
- Confirmation bias from the main agent's prior reasoning
- Anchoring on initial assumptions formed during context gathering

The invariant is **independence-before-contamination**, stated as a property of the arrangement, not of any one substrate. A substrate that gives each perspective a fresh context — isolated subagents, an agent team's teammates, or a dynamic-workflow's parallel branches — satisfies it; routing a perspective through the main agent's running context (which retains full history) breaks it. When the executing substrate cannot give a perspective an independent context, the substrate — or `/conduct` at arrangement time — declares the independence degradation rather than silently relaxing isolation.

## Non-default independence routes to /conduct

`shared` independence (perspectives that see each other before reconciliation) is a **non-trivial arrangement**: it relaxes the isolation guarantee. The user reaches it through `/conduct`, which arranges independence per move-region and records the `independence_relaxed` degradation. The `isolated` default and any departure from it are both the arrangement functor's (`/conduct`'s) to design and the substrate's to execute — frame carries neither, only the nudge that routes there.

The same boundary applies to the *dialogue* the arrangement permits after isolation: the default reconciliation (`independent-then-conditional-dialogue`) lets the substrate reconcile only triggered tensions; unconditional debate, adversarial refutation, or any composite is likewise a non-trivial arrangement `/conduct` designs. Isolation's epistemic purpose is served once each perspective is formed independently — what the substrate does *after* that (mediated reconciliation, peer exchange where the arrangement and substrate allow it, reversion to coordinator-mediated synthesis) is execution detail the substrate owns, under the arrangement `/conduct` designs.

## Scope boundary

frame's contribution ends at forming the lenses, declaring each lens's `substrate_need`, and nudging `/conduct`. The isolation requirement itself — and the mechanics of *how* isolation is realized: fresh contexts, whether peers can later exchange during a non-default dialogue arrangement, how reconciliation reverts to mediated interaction when peers cannot resolve divergence — are `/conduct`'s to design and the substrate's to realize, surfaced as feasibility annotations at the handoff seam (see frame Rule 3 and the Substrate realization note in frame TOOL GROUNDING). This keeps the epistemic requirement (independence) cleanly separated from frame's lens-formation role: frame never collapses the two by reasoning the lenses itself, and never even carries the isolation/synthesis apparatus.
