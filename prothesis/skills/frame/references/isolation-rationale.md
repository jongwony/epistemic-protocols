# Isolation Rationale

**`SubstrateCorrespondence` only.** `LensReturn` (single lens, or no specialized substrate) terminates at the lens — it returns the detailed lens(es) and never compiles an execution directive, and makes no convergence claim. See frame Rule 3 (Object supplier, not arranger or executor), Rule 5 (No inline synthesis), and Rule 6 (Independence-before-contamination, compiled directive).

`independence: isolated` is the default value of the isolation/reconciliation/synthesis directive that frame **compiles** into the `SubstrateCorrespondence` handoff; the **substrate enforces it at execution time**. frame does not itself isolate or execute perspectives — it specifies isolation as a requirement the executing substrate must satisfy, then hands off and stops. Genuine isolation is exactly what makes a downstream convergence claim trustworthy: because each lens runs in its own context, agreement is earned rather than manufactured by a single context reasoning all lenses at once. This reference records *why* the default is `isolated` and *why* any non-default independence is a non-trivial arrangement that routes to `/conduct`.

## Why isolated is the default

Each perspective MUST be analyzed in an **isolated context** so that, before any reconciliation, it forms its assessment without:
- Cross-perspective contamination from shared analysis history
- Confirmation bias from the main agent's prior reasoning
- Anchoring on initial assumptions formed during context gathering

The invariant is **independence-before-contamination**, stated as a property of the directive, not of any one substrate. A substrate that gives each perspective a fresh context — isolated subagents, an agent team's teammates, or a dynamic-workflow's parallel branches — satisfies it; routing a perspective through the main agent's running context (which retains full history) breaks it. When the executing substrate cannot give a perspective an independent context, the substrate — or `/conduct` at arrangement time — declares the independence degradation rather than silently relaxing isolation.

## Non-default independence routes to /conduct

`shared` independence (perspectives that see each other before reconciliation) is a **non-trivial arrangement**: it relaxes the isolation guarantee, so it is not part of frame's default directive. The user reaches it through `/conduct`, which arranges independence per move-region and records the `independence_relaxed` degradation. frame compiles only the `isolated` default; any departure is the arrangement functor's (`/conduct`'s) to design and the substrate's to execute.

The same boundary applies to the *dialogue* the directive permits after isolation: the default reconciliation (`independent-then-conditional-dialogue`) lets the substrate reconcile only triggered tensions; unconditional debate, adversarial refutation, or any composite is likewise a non-trivial arrangement routed to `/conduct`. Isolation's epistemic purpose is served once each perspective is formed independently — what the substrate does *after* that (mediated reconciliation, peer exchange where the arrangement and substrate allow it, reversion to coordinator-mediated synthesis) is execution detail the substrate owns.

## Scope boundary

frame's contribution ends at compiling the isolation requirement into the handoff (and declaring each lens's `substrate_need`). The mechanics of *how* isolation is realized — fresh contexts, whether peers can later exchange during a non-default dialogue arrangement, how reconciliation reverts to mediated interaction when peers cannot resolve divergence — are the substrate's, surfaced as feasibility annotations at the handoff seam (see frame Rule 3 and the Substrate realization note in frame TOOL GROUNDING). This keeps the epistemic requirement (independence) cleanly separated from its substrate realization (execution and any synthesis). frame never collapses the two by reasoning the lenses itself.
