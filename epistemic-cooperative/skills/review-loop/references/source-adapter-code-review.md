# `code-review` Source Adapter

How to drive `code-review` once Phase 0 has designated it. Nothing here bears on *which* source to designate — the properties that decision turns on are in the Source Interface table in `SKILL.md`, which is where the designation gate reads them. This file loads only on a run that designated `code-review`; a run on another source never reaches it, which is why each adapter has its own file rather than a shared one.

The contract this adapter answers to — what it accepts, what it yields, and the Conveyance boundary it observes — is stated in `SKILL.md`'s Source Interface and is deliberately not restated here: a second statement of a contract is a copy, and a copy drifts from what it copies.

Call via `Skill("code-review", ...)`, passing the resolved diff pointer (base…head, or the captured working-tree base — **never a raw PR number**, which would re-review the possibly stale remote state) **and the design-intent bundle**.

It runs its own multi-angle finder fan-out and returns a findings JSON array (`{ file, line, summary, failure_scenario }`, ranked most-severe-first) with **no verdict line**. The adapter therefore:

- **Derives the verdict**: `[]` → `approve`, otherwise `needs-attention`.
- **Maps each finding** to `[severity] file:line — description`, assigning severity by assessing that finding's own summary and failure scenario against the mission-anchored severity calibration — the same steer every source receives — and using rank order only for ordering or tie-breaking.
- **Leaves the direction slot empty** rather than filling it. A direction the adapter composed would be the loop's own reading wearing the source's name, and Phase 3 already reads the verified set on the loop's behalf.
- **Never fills the reach slot with an inference** about what the source probably examined. The fixed output shape carries no channel for a reach report, and an inference put there would be indistinguishable from a report.

The adapter does not stamp a round-level "did not say" onto every round either. Both absent slots are standing properties of this source rather than per-round outcomes, so they are declared once at Phase 0 among its coverage trade-offs and surfaced once more at convergence; a per-round stamp would add a trace line that never varies and train the reader to skip past the very slot that has to stay legible for sources which *can* report.
