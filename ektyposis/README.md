# Ektyposis (ἐκτύπωσις) — /realize

> [한국어](./README_ko.md)

Realize a portable epistemic essence into a specific target substrate's native artifact form. Grounds the substrate's artifact form and primitive inventory, projects each structural element of the essence into that form (structure-preserving, not template substitution), and declares every unavailable substrate primitive as a recorded degradation rather than a silent approximation.

## Type Signature

```
(ProjectionUnformed, AI, REALIZE, PortableEssence × TargetReference) → RealizedArtifact
```

## What It Does

A portable epistemic essence — the substrate-agnostic functional role of a capability, the kind of object `/distill` produces — has to be put to work in a *specific* substrate whose native artifact form is its own: a vendor prompt, a goal string, a tool recipe, a browser custom-skill, a config, a model-tailored session prompt. Turning the essence into that native form is **realization** — the core, **substrate-neutral** act; the target is any substrate, none privileged. (The one degenerate case that needs no projection: the requested form is *just* the portable handoff and the consumer can read it directly — there `/distill` already suffices.) Substrates differ only in how much they can carry: a capability-rich engine carries the essence near-intact (an empty degradation ledger); a constrained substrate — no source read, no execution, no file write, no sub-process, no structured state — forces real, declared gaps.

The morphism runs F0 through F4 once forward, with bounded re-projection on Adjust:

- **F0 — Bind**: detect the unformed projection, run the relay-to-distill check, then bind the portable essence (its functional role) and the target substrate reference.
- **F1 — Ground + derive schema**: acquire the substrate's native artifact form and its per-primitive availability (`Available` / `Unavailable(why)`), then derive the structure the artifact requires.
- **F2 — Project structure-preservingly**: render each essence element (morphism step, gate, answer constructor, convergence condition, tool-grounding op, invariant) into a corresponding element of the substrate's artifact — preserving the structural relation, not substituting a generic template.
- **F3 — Validate + declare degradation**: classify each unavailable-primitive touch as **FAIL** (touches protocol identity or a convergence condition) or **DEGRADE** (reduces only evidence-richness or state-tracking), and record every gap in the degradation ledger. The ledger is the explicit record of where Outcome Equivalence fails locally for this substrate.
- **F4 — Emit**: emit the terminal substrate-native artifact with its structure-preservation trace and degradation ledger.

**Core principle**: Structure-Preserving Projection over Template Substitution, with Declared Degradation over Silent Approximation — the realized artifact reproduces the essence's role, and every gap is on the record.

The essence preserved is **functional and structural, not Platonic**: what carries across realizations is the role (role functionalism / multiple realizability — Putnam 1967; Fodor 1974), the same stance the project takes under Semantic Autonomy and Outcome Equivalence.

## When It Activates

Ektyposis is a **Hybrid** initiator: both a user signal and AI detection can start it, and an AI-detected trigger surfaces a one-line confirmation before activating.

- User calls `/realize` (Layer 1, always available)
- AI detects an unformed projection — a portable essence about to be put to work in a substrate whose native artifact form is its own, with no realized artifact yet (Layer 2, silent detection + confirm)

## The Boundary (distill ↔ realize)

`/distill` produces the reference-tolerant portable essence (the **hub**). `/realize` is the per-substrate **spoke** that projects that one essence into a target substrate's native artifact form.

The boundary turns on the **requested form**, not on whether the substrate is "capable" or "degraded": `direct_handoff_suffices(target, essence) ≡ (the requested artifact is just the portable handoff itself) ∧ source-dereferencing(target) ∧ capability-compatible(target, essence)`. When it holds — the target only wants the portable handoff and a capable consumer reads it directly — `/realize` skips and relays to `/distill`. When a *target-native form other than the portable handoff* is requested — a vendor prompt, a browser skill, even a model-tailored Claude initial prompt for that same capable session — `/realize` activates and projects, because the consumer's ability to read a handoff does not supply the native artifact. The same substrate can route to `/distill` for one requested form and `/realize` for another.

The composition is one-directional: `/distill → /realize`. A realize output is a **terminal** substrate artifact, never re-distilled or re-realized — re-derive from the canonical source if a refresh is needed (`realize` codomain ∩ `distill` domain = ∅). The relation to `/distill` is **advisory** (complementary deficits), not suppression.

## The Degradation Ledger

A realization is faithful when its structure is preserved and every gap is declared. For each primitive the essence needs but the substrate lacks, the ledger records the primitive, why it is unavailable, the declared degradation, and the severity:

| Severity | Meaning | Effect |
|----------|---------|--------|
| **FAIL** | The unavailable primitive touches protocol identity or a convergence condition | Realization is `Failed`; biases toward Redirect (or a user-constituted known limitation) |
| **DEGRADE** | The unavailable primitive reduces only evidence-richness or state-tracking | Recorded; the artifact stays emittable with the declared gap |

Silent approximation of an unavailable primitive is forbidden — the ledger is the explicit record of exactly where Outcome Equivalence fails locally for this substrate. It **ranges** from empty (a capability-rich substrate carries the essence intact) to severe (a constrained substrate such as a browser skill): degradation is a *validation outcome*, not the reason `/realize` exists.

## Substrate Subtypes

`RealizedArtifact` is the core resolution type. Substrate-specific subtypes (not the core type):

- **PromptArtifact** — the prompt family that the `/forge` utility realizes; under it, **InitialPrompt** (a follow-up session/tool prompt) and **DiaRecipeInstruction** (the Dia browser skill form: `{ name, description, body }`, applied by manual UI paste since Dia's store has no file/CLI/deeplink import).

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install ektyposis@epistemic-protocols
```

## Usage

```
/realize [essence + target substrate]   # Realize a portable essence into a substrate's native artifact
```

## License

MIT
