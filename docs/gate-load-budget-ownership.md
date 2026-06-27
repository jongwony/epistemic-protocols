# GateLoadBudget Ownership (issue #482)

> Design for #482: where should the cumulative gate-chain load concept
> (`GateLoadBudget`) live? The issue framed the fork as **`compose` (gate-composition
> skill) vs a shared rule referenced by all gating protocols**. A premise-reality
> check changes the fork: `compose` no longer exists.

## Premise-reality check: `compose` was deleted

#482 (and the grounding doc `docs/analysis/cognitive-load-gate-chain-grounding.md`,
and `references/cognitive-psychology.md`) all cite
`epistemic-cooperative/skills/compose/SKILL.md` — with specific line numbers (L80,
L182-199) for its per-gate static load measures and its "not yet formally modeled"
admission. **That file no longer exists.** It was removed in commit `ce5ccc3`:

> `feat(epistemic-cooperative): compose 스킬 삭제 — conduct 배열 functor의 인쇄 변형으로
> 기능 포섭, 사용 흔적 부재`

i.e. `compose`'s gate-composition function was **absorbed into `/conduct`
(Hyphegesis)** as a print-variant of its array/ordering functor, and the skill was
deleted for lack of usage. The cross-references in the two analysis/reference docs
are now **dangling** (they point at line numbers in a deleted file).

This dissolves the issue's left fork: "owned by `compose`" cannot be chosen as
stated, because `compose` is gone. The honest re-derivation has three live options,
not two.

## What survived the deletion, and where the load concern naturally sits now

`compose` carried two things relevant to #482:

1. **Per-gate static load measures** — conditional entropy `Σ log₂(|options_i|)`,
   gate density, Constitution ratio. These are *per-gate, instantaneous* and are well
   grounded (working-memory limit + information theory; see the grounding doc).
2. **The cumulative / sequential gap** — chain-position × regret, explicitly "valid
   but not yet addressed". This is #482's actual target.

`/conduct` now owns gate composition: it designs multi-move topologies over the
protocol graph, including the `termination` axis, `CoverageLimit`, and the disclosure
overlay (`TraceContract`). A chain of gates across composed moves is exactly the
structure whose cumulative load #482 worries about — and `/conduct` is the only
protocol that *sees the whole chain at design time*. Individual gating protocols
(`/gap`, `/inquire`, `/bound`, …) each see only their own gates; they cannot budget a
load that accrues across protocols. This is the decisive asymmetry for ownership.

## The evidence boundary (from the grounding doc) constrains any owner

`docs/analysis/cognitive-load-gate-chain-grounding.md` establishes that
`GateLoadBudget` must stand on a **firm tripod** and treat two legs as **soft
warnings only**:

- **Firm (quantify):** simultaneous-unresolved-decision count (Cowan ~4 as the
  conservative ceiling), per-gate alternatives (reuse `Σ log₂(|options_i|)`),
  context-switch / memory-carryover (split-attention, Chandler & Sweller 1991).
- **Soft (never a quantitative law):** decision-fatigue penalty (Hagger 2016
  null-effect), choice-overload (Scheibehenne 2010 mean effect ≈ 0). The gap #482
  targets (sequential load) coincides with the *weakest* evidence — so the model must
  not encode a fatigue multiplier or an "options = bad" penalty.

Any owner must inscribe the budget as a **load-management heuristic with a firm
tripod and a soft railing**, not a calibrated model. This is a hard constraint on the
spec text regardless of where it lives.

## Re-derived fork

- **(A) Owner = `/conduct` (Hyphegesis).** The cumulative-load concern is gate
  *composition*, and `/conduct` is where gate composition migrated. It already
  resolves `termination`, `CoverageLimit`, and a never-silent disclosure overlay; a
  `GateLoadBudget` annotation is on-axis with its existing "design the chain, surface
  the caps" job. It is the only surface that sees the whole composed gate chain.
  - *Cost:* only covers chains `/conduct` actually composes. A single protocol firing
    several gates *without* `/conduct` (the common case — most sessions don't conduct)
    gets no budget. So `/conduct` ownership covers the multi-move case but leaves the
    within-protocol case uncovered.
- **(B) Owner = a shared rule referenced by all gating protocols.** A
  `.claude/rules/` entry (the firm tripod + soft railing) every gating protocol
  references, so even a single protocol firing a gate burst is covered. Matches how
  the project already shares `Plain emit discipline` / `Round-local salience
  bundling` (cross-cutting emit disciplines compiled into every SKILL.md).
  - *Cost:* a rule cannot *see* a cross-protocol chain at runtime; it can only tell
    each protocol "count your own active gates and batch/default above budget." The
    genuinely cumulative (cross-protocol) load — the #482 target — is only
    approximated, since no single protocol holds the chain. It also adds a shared-rule
    reference to every gating SKILL.md (encapsulation cost).
- **(C) Split ownership (the structure the deletion implies).** The concept factors
  along the same firm/soft and per-gate/cumulative seams the grounding doc already
  draws:
  - the **per-gate firm tripod** (count, entropy, carryover) → a **shared emit-load
    rule**, compiled into gating protocols exactly like the existing emit disciplines
    (this is where `compose`'s static measures should have re-homed after deletion);
  - the **cumulative chain budget** (loop-depth × regret, soft) → **`/conduct`**,
    where the whole chain is visible and the `TraceContract` can disclose a
    "gate-load cap" alongside its coverage caps.

## Recommendation

**Fork (C) — split ownership along the seam the evidence already draws.** The single
biggest finding is that #482's premise ("owned by `compose`") is obsolete, and the
deletion of `compose` *itself* tells us where the two halves go:

- The **per-gate static load** (firm, quantifiable, working-memory-grounded) is a
  cross-cutting *emit* discipline — it belongs in the **shared-rule layer** next to
  `Plain emit discipline` and `Round-local salience bundling`, and should be compiled
  into gating SKILL.md the same way. This re-homes what `compose` measured statically.
- The **cumulative chain budget** (the #482 target, soft-railed) belongs to
  **`/conduct`**, the protocol that inherited gate composition and is the only one
  that sees a multi-protocol gate chain at design time. It surfaces as a disclosure in
  the existing `TraceContract`, never as a hard penalty.

This avoids the trap each single-owner option falls into: (A) alone misses
within-protocol gate bursts; (B) alone can't see cross-protocol chains. (C) puts each
half where it is actually observable.

A pure single-owner answer, if the maintainer wants one for simplicity, should be
**(B) shared rule** — it covers the common case (any protocol's gates) and degrades
gracefully (each protocol budgets its own gates), accepting that the cross-protocol
cumulative case stays a documented limitation until `/conduct` is involved. (A) alone
is too narrow because most sessions never conduct.

## Open fork for the human

- **(C) Split** (recommended): shared-rule firm tripod + `/conduct` cumulative
  railing.
- **(B) Shared rule only**: simpler, one home, cross-protocol cumulative case noted as
  a limitation.
- **(A) `/conduct` only**: cleanest conceptually but uncovers the common
  no-conduct case.

Either way, **two cleanups are required regardless of fork** (they are not the
decision, just debt the premise-check surfaced):

1. Fix the dangling `compose/SKILL.md` cross-references in
   `references/cognitive-psychology.md` (§Cross-references) and
   `docs/analysis/cognitive-load-gate-chain-grounding.md` (the callout L7-8, L21,
   L53-54, L83) — repoint them to wherever the budget lands, and drop the stale
   `compose` line numbers.
2. Re-attribute the surviving per-gate static measures (`Σ log₂(|options_i|)`, gate
   density, Constitution ratio) to their new home rather than to the deleted file.

## Spec-edit sketch (fork C)

- **Shared rule** — new entry in `.claude/rules/` (or a section in an existing
  emit-load rule), e.g. `gate-load-budget`:
  > *GateLoadBudget (heuristic, not a calibrated law).* Firm tripod — keep
  > simultaneous unresolved decisions ≤ ~4 (Cowan), reuse `Σ log₂(|options_i|)` for
  > per-gate alternative load, minimise cross-gate memory carryover (split-attention).
  > Above budget: batch questions, default low-risk choices, or collapse gates into
  > one decision frame. Soft railing — do NOT apply a decision-fatigue multiplier or
  > an "options = bad" penalty (decision-fatigue and choice-overload are
  > non-replicated; treat as warnings, not coefficients).
  Compiled into gating SKILL.md via the same `checkEmitLoadDiscipline`-style coverage
  the project already enforces for emit disciplines (extend that static check to the
  new rule if adopted).
- **`/conduct`** — extend `TraceContract` disclosure (`hyphegesis/skills/conduct/
  SKILL.md`) with a `gate_load` cap leg: when the composed topology's cumulative gate
  count / Constitution ratio crosses the budget, surface it in the never-silent
  overlay (relay, not a new gate), with regret-weighting allowed but loop-depth-as-
  fatigue forbidden. Patch version bump.
- Run `static-checks.js` (FAIL 0). `#526` and `#484` both reference this budget; once
  it lands, their gate-load concerns reference the shared rule rather than re-deriving
  it.
