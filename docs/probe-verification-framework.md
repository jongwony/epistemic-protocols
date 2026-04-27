# Probe Verification Framework — Two-Axis Hypothesis

Status: **Hypothesis (N=1, pre-corroboration)** · Stage 2 evidence-collection modality.

This document records an emergent observation about how Probe's Phase 1 candidate-hypothesis classification can fail when verification simulates only one axis of well-defined-ness. It is recorded as a single instance under the project's Stage 2 doctrine — not promoted to framework status until variation-stable corroboration accumulates across additional sessions.

## Background

Probe (`/probe`, `epistemic-cooperative:probe`) is itself released as a Stage 2 evidence-collection modality (CLAUDE.md §Plugins). Its Phase 1 scans the user situation against the catalog of epistemic deficits and constructs candidate hypotheses, often classifying each candidate's downstream remediation as either *surgical* (deterministic 1–2 line edit) or *design* (decision-bearing structural change).

That classification is itself an inference Probe makes. When it is wrong, the downstream PR/commit plan is mis-scoped: a candidate flagged "surgical" may land an interim patch that needs to be unwound by a later redesign round, while a candidate flagged "design" may sit in a deferred queue when a one-line edit would have closed it cleanly.

## Two-Axis Verification

Observation: surgical/design classification depends on **two orthogonal axes**, not one.

| Axis | Question | Failure mode if unchecked |
|------|----------|---------------------------|
| **Drop-in feasibility** | Can the change be applied as a 1–2 line edit without surrounding refactor? | Misses cases where the edit is surface-feasible but introduces semantic incoherence. |
| **Endpoint well-defined-ness** | Is the resulting state the *intended terminus*, or merely a temporary surface-consistency restoration? | Misses cases where the edit lands a transient patch that a future round must undo or absorb. |

A candidate qualifies as *truly surgical* only when **both** axes verify. A candidate that passes drop-in feasibility but fails endpoint well-defined-ness is a *false-surgical* — the edit can be made, but it is not the right edit.

The verification step that produced the L4a classification simulated only the drop-in axis: "Yes, this is one MORPHISM target line; the syntax change is local; static checks remain green." It did not ask: "Is widening the target codomain the well-defined endpoint, or merely the minimum-diff way to reach surface consistency?"

## Instance: L4a (2026-04-25, PR #288)

### Initial classification (Probe verification round)

L4a was identified during `/review-ensemble` of PR #288 (probe SKILL.md addition). The finding from Lens 1 (Type Theory): MORPHISM declared `emit(ProtocolRoute | FitReviewNote)` (codomain union) but the next line declared the morphism's target as `ProtocolRoute` (single type) — surface mismatch.

Probe's Phase 1 simulation classified L4a as surgical:

> L4a (MORPHISM emit codomain): `→ ProtocolRoute` → `→ ProtocolRoute | FitReviewNote` (1 line). Drop-in deterministic. ✅ Surgical (1 line).

This passed drop-in feasibility. Commit `a58c6fc` applied the widen alongside the unrelated L10 (Λ session-immunity) edit, restoring surface consistency: declared codomain and morphism target now both name the union.

### User reframing (post-commit)

The user reviewed the post-commit state and surfaced a structural counterargument: the well-defined endpoint is the **opposite** direction — narrow `emit` to `ProtocolRoute` only, eliminate `FitReviewNote` as a distinct type, and represent disposition variants as nullable fields on a single `ProtocolRoute` record. Five grounds were given (paraphrased from the user's analysis):

1. **`emit` semantics consistency** — Phase 3 is fundamentally a routing decision. Recognize/Redirect route to a protocol; Dismiss is a *null route*; Stop deactivates without artifact. All three dispositions that produce artifacts are "routing decisions with possibly empty target," so a single `ProtocolRoute` type captures them coherently.

2. **Cost of the type sum** — `ProtocolRoute | FitReviewNote` forces every downstream consumer to pattern-match on the union variant; the two types share fields (`presented_hypotheses`, `evidence_trace`); the question "are these really distinct categories?" must be re-adjudicated at every consumer site.

3. **Option-typed fields are more accurate** — A single record with nullable target/deficit fields plus a `disposition: Recognition` enum represents the same information without the union: Recognize/Redirect populate the nullable fields, Dismiss leaves them `None`. The union's external separation was, in fact, the same record's nullable-variant in disguise.

4. **Stop-graduation symmetry** — The `stop_record` ghost symbol was removed in the prior mechanical batch, settling Stop as "deactivate without artifact." This produces a natural graduation: Recognize/Redirect → filled `ProtocolRoute`; Dismiss → null-route `ProtocolRoute`; Stop → no artifact. Keeping `FitReviewNote` as a separate type breaks this graduation by making Dismiss an isolated semantic island.

5. **Naming redundancy** — `FitReviewNote`'s evidence trace is already a subset of what `ProtocolRoute` carries (the `evidence_trace` field). The name implies a separate semantic category, but the content is `ProtocolRoute` with `target_protocol = None`.

Under these grounds, the well-defined endpoint requires changes to TYPES, FLOW branching, and Phase 3 prose — i.e., this is not a 1-line surgical edit but a small-design-within-real-design that belongs in the same redesign round as T2 (Stop→Exit naming), L1 (Recognize materialization), L2 (Stop option handling), L3 (Dismiss/Stop peer collapse), and L8 (`|H[]|=1` escape).

### Resolution

Commit `a58c6fc` is preserved as a valid surface-consistency minimum-diff — it does not introduce regressions and remains green under static checks. It is **not** the well-defined endpoint. L4a is reclassified into the tier-3 redesign cluster (Task #21) and will be absorbed when ProtocolRoute is unified into a single type. No revert is performed (force-push avoidance, audit-trail preservation).

## Hypothesis (N=1, pre-corroboration)

**Conjecture**: Probe's surgical/design classification benefits from explicit two-axis verification. The drop-in feasibility check alone is insufficient; an endpoint well-defined-ness check should run alongside before a candidate is committed to the surgical lane.

This is a *single observation*. Per `.claude/principles/meta-principle.md` Stage 2 doctrine, framework promotion requires variation-stable corroboration across instance, user profile, platform context, and session type. Until additional instances accumulate and resolve into the same essence under variation, this remains hypothesis-level — recorded for future reference, not enforced as a Probe operating rule.

Falsification conditions:
- If subsequent surgical classifications consistently match the well-defined endpoint without two-axis verification, the hypothesis is unnecessary.
- If the cases where two-axis verification would catch a false-surgical are rare or always caught downstream by user review, the framework's marginal benefit is low.
- If two-axis verification produces frequent false positives (flagging well-defined surgical edits as design-suspect), it adds friction without payoff.

## Application

Where the hypothesis would intervene in Probe's Phase 1, **if corroborated**:

- During candidate scan, after a surgical classification passes drop-in feasibility, perform an endpoint check: "Is this edit the intended terminus, or a minimum-diff surface restoration?"
- Endpoint signals to look for: type-signature alignments that only restore consistency (not yet right semantics), edits that touch one block while a coupled block remains in tension, edits whose downstream rationale repeats existing redundancy.
- Failure of the endpoint check downgrades the candidate from surgical to design, routing it into the redesign cluster instead of an immediate batch.

This refinement is not yet inscribed in `probe/SKILL.md`. Inscription requires Stage 2 corroboration per the project's two-stage doctrine.

## Open Questions

- **Generalization**: Is the two-axis distinction Probe-specific, or does it apply to other Phase-1-like classifications elsewhere in the protocol set? `recollect` (Phase 1 contextual scan) and `attend` (Phase 0 risk classification) also classify candidates under uncertainty — sibling instances could either corroborate or refute generalization.
- **Verification cost**: A second axis costs more inference per candidate. Where is the break-even between miss-cost (interim patch + rework) and verify-cost (additional simulation)?
- **Self-reference**: Probe verification framework refinement is itself a candidate for Probe to surface in a future session ("we observed N=1 false-surgical, is this a pattern?"). The framework is recursively in scope of its own evidence-collection modality.

## References

- Instance: PR #288, commit `a58c6fc` (`fix(probe): MORPHISM target widen + Λ session-immunity field`).
- Probe specification: `epistemic-cooperative/skills/probe/SKILL.md`.
- Tier-3 redesign task: TaskList #21 (ProtocolRoute single-type unification).
- Project Stage 2 doctrine: `.claude/rules/meta-principle.md` §Deficit Empiricism.
