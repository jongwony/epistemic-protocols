# Tiering and Scope

This document covers how to classify principles by their trajectory as models improve, and where certain structural, cost, and layering decisions belong. It defines the tier vocabulary (Axiom / Derived / Architectural / Safeguard) used by section headings across this collection.

## Tier Classification Schema

Any body of behavioral principles benefits from a tier classification that tracks how a principle's importance should move as the underlying model improves:

| Tier | Criterion |
|------|-----------|
| Axiom | Principles that become MORE important as models improve; foundations from which other principles derive |
| Derived | Grounded in axiom combinations and adding a prescription those axioms do not themselves yield; a section whose content is fully recoverable from its sources belongs in those sources instead. Derivation source annotated |
| Architectural | Structure decisions independent of the axiom system |
| Safeguard | A provisional guard against a failure observed on current models; a model change re-verifies it rather than retiring it, and the result keeps, compresses, or removes it |

This tiering is what lets a reader distinguish a durable axiom from a safeguard that is meant to decay as models improve. Every tiered heading in this collection carries one of these four labels.

## Checkpoint Policy Stays at the Meta Layer (Derived)

The checkpoint-shaped case of Context and Utterance as First-Class Ground (`recognition-and-authority.md`): a branch is a coordinate whose right answer varies with live ground, so the governing specification fixes the choice structure without selecting its occupant. A finding that such a checkpoint "lacks a default" or "should prefer branch X" resolves as relay against that axiom rather than opening a gate.

The accepted consequence, for such checkpoints, is that silence selects no branch: the transition halts explicitly, so an unanswered checkpoint suspends the process instead of auto-continuing — auto-selecting a branch would itself answer the question the axiom reserves for the user. This bounds the *silent* default only: a default surfaced for the user to recognize and override, an option ordering within a presentation format, and a relay emit that converges on non-divergence each leave the user's answer intact and fall outside this halt requirement.

This presupposes branches with materially different downstream trajectories; a branch that collapses into another is a design defect to fix, not a policy the user constitutes.

## Epistemic Cost Topology (Architectural)

The epistemic meta-layer has a fundamentally different cost topology from the execution layer. In the execution layer (code, tests, docs), AI drives the marginal cost of completeness toward zero — pursuing completeness is correct. In the epistemic meta-layer (protocols, principles, formal systems), an unused mechanism pollutes cognitive space — the cost of an unused mechanism exceeds the cost of a missing one. This asymmetry justifies empirical restraint as the correct posture for creating new mechanisms, even when execution-layer intuitions suggest "why not create more?" Attempts to apply execution-domain completeness principles directly to the epistemic domain should be identified and the cost-function difference surfaced.

## Epistemic Completeness Boundary (Architectural)

A bounded principle system governs one domain. For a system of epistemic dialogue principles that domain is the epistemic substrate — where authority, judgment, framing, and recognition are constituted between a person and an AI system. The system's completeness claim terminates at that domain's edge: physical safety, permission and credential policy, and the execution of high-stake actions belong to the enclosing execution substrate, not to the principle system. Claiming completeness past the boundary claims an authority the system has no means to discharge.

The scope declaration sits one layer above the mechanics it delimits — domain-internal mechanics in the principle layer, domain-scope declarations in the architectural layer above it. A principle that absorbs its own application boundary into its body makes its own scope invisible: the stopping condition is then stated in the same voice as the principle, so a reader cannot see where the principle ceases to apply. This mirrors mathematical practice, where domain commitments sit in metatheory rather than inside the axiom system they range over.

Operationally the split is between defining a boundary and enforcing it. The principle system defines and protects the visibility of what crosses; the execution substrate — system prompts, automation, permission systems — realizes the delegation. A principle system may classify and surface non-epistemic risk at a boundary crossing without thereby discharging or enforcing the substrate semantics on the other side.

**Test**: if the obligation remaining after detection requires substrate enforcement rather than further judgment, the principle system records the handoff and stops. The obligation is delegated, not absorbed.
