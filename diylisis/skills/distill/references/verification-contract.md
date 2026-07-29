# Verification contract — what the static checks lock over this skill

What `node .claude/skills/verify/scripts/static-checks.js .` mechanically enforces across `SKILL.md` and `../agents/zero-memory-refuter.md`, and — equally important — what it does not, so an editor knows which part of the F5 contract still needs the manual semantic-closure sweep.

You need this file when you are **editing or verifying** the specification, not when executing `/distill`.

---

## The sync obligation the check partially discharges

The refuter contract is: its checklist categories, its evidence basis together with the scoped exceptions to that basis, its tool ceiling, its input list, its verdict format, and its advisory vocabulary. That contract is inscribed at every site naming any part of it — Rule 9 and the F5 phase section, and equally FLOW's `comprehension_gate` signature, the TYPES carrying the verdict/finding/sweep/realization shapes, the PHASE TRANSITIONS and TOOL GROUNDING dispatch entries, every rule citing a checklist category by number, and the packaged `../agents/zero-memory-refuter.md`.

An edit to any part of the contract sweeps every site inscribing **that part** in the same commit. Find the sites by searching the contract's own terms, never by reading them off a list kept here: a surface list drifts as inscribing sites move, while the contract's terms are what the sites are made of.

`packaged-agent-contract-sync` reconciles the mechanically comparable portion of this. The rest is the manual sweep this project requires of protocol edits.

## packaged-agent-contract-sync

The check is generic, not pinned to this plugin. An agent opts in by a **structural anchor**: a `### Realization:` enumeration line in its body. It then pairs with a `SKILL.md` in its own plugin whose TYPES block carries a matching enumeration.

| Leg | What it compares | Direction |
|---|---|---|
| Realization values | agent `### Realization: a \| b \| c` against some TYPES `… ∈ {a, b, c}` | set-equality (symmetric) |
| Advisory vocabulary | the agent's Advisory Disposition bold tags against some TYPES enumeration; constructor args stripped, so `Resolve(ref)` normalizes to `Resolve` | set-equality (symmetric) |
| Checklist categories | each agent `## Checklist` numbered bold key must appear in the SKILL.md F5 corpus | **containment, agent → SKILL.md only** |
| Findings table columns | agent `### Findings` header against the locked set `{Quoted token, Location, Category, Why unresolvable, Advisory disposition, Repair note}`, and TYPES `EvidencedFinding` fields against `{item, quoted_token, location, category, why_unresolvable, advisory, repair_note}` | both sides locked |
| Category sweep columns | agent `### Category sweep` header against `{Category, Status, What was checked}`, and TYPES `SweepTrace` fields against `{category, status, checked}` | both sides locked |

The last two legs are gated on an F5 marker being present on either surface, so a future contract-bearing agent with a different verdict shape keeps the first three legs without being held to this schema.

### The F5 corpus — where a category has to live

The category-containment leg does not search the whole document. It builds a corpus from the `SKILL.md` lines matching any of:

- a line containing `**F5`
- a line containing `zero-memory comprehension gate` (case-insensitive)
- a line containing `EvidencedFinding =`

and then requires each agent category key — the full phrase, with only a trailing parenthetical stripped — to appear in that lowercased corpus. Anchoring it this way stops a removed or renamed category from passing by coinciding with unrelated prose elsewhere in the skill.

**Editing consequence**: the category phrases must survive on the F5 phase paragraph, the Rule 9 line, or the `EvidencedFinding` TYPES line. Moving prose off those three lines is what breaks this leg — moving prose off any other line does not.

## What it does not catch

- **Checklist containment is one-directional.** A category present in `SKILL.md` but absent from the agent passes. Deleting a category from the agent alone is caught; deleting the mechanism from `SKILL.md` while the agent still lists it is caught only because the agent side is the source of the loop — a mechanism *deletion* on the SKILL side with a matching agent deletion is not caught at all.
- **Semantics of a category.** Only the key phrase's presence is compared. A category whose body says the opposite of what the SKILL side says still passes.
- **Semantic closure.** Alignment across TYPES, PHASE TRANSITIONS, LOOP, CONVERGENCE, TOOL GROUNDING, and the Rules — every new condition having a type, a guard, a state update, a termination path, and a result equation — is not proven by any static check. Verify it by hand before commit.

## Line-count guideline

The packaging script warns when a `SKILL.md` exceeds 510 lines. The threshold is `LINE_GUIDELINE` in scripts/package.js, and the same file states its character: informational — it emits a packaging warning and does not fail the build, with per-protocol grandfathered overage acknowledged. `docs/verification.md` says the same. The warning surfaces from `node scripts/package.js --dry-run`, not from the static-check run.
