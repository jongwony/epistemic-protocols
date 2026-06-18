# Ektyposis (ἐκτύπωσις) — /realize

> [한국어](./README_ko.md)

Realize a portable epistemic essence into a specific target substrate's native artifact form. Grounds the substrate's artifact form and primitive inventory, projects each structural element of the essence into that form (structure-preserving, not template substitution), and declares every unavailable substrate primitive as a recorded degradation rather than a silent approximation.

## Type Signature

```
(ProjectionUnformed, AI, REALIZE, PortableEssence × TargetReference) → RealizedArtifact
```

## What It Does

A portable epistemic essence — the substrate-agnostic functional role of a capability, the kind of object `/distill` produces — can be handed directly to any recipient that dereferences its pointers and shares its primitives. But some substrates cannot dereference (they read no canonical source) or lack the primitives the essence's steps depend on (no codebase read, no shell, no file write, no subagent, no structured state). For such a substrate the essence cannot be handed over as-is; it must be **realized** — projected into the substrate's own native artifact form.

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
- AI detects an unformed projection — a portable essence about to be carried into a non-reading or capability-degraded substrate (Layer 2, silent detection + confirm)

## The Boundary (distill ↔ realize)

`/distill` produces the reference-tolerant portable essence (the **hub**) for a recipient that can dereference its pointers and is capability-compatible. `/realize` is the per-substrate **spoke** that projects that one essence into a substrate which *cannot* read the source or lacks the portable form's primitives.

The discriminating axis: `can_consume_portable_handoff_directly(target) ≡ source-dereferencing(target) ∧ capability-compatible(target, essence)`. When it holds, `/realize` skips and relays to `/distill` (a Claude session that can read the repo uses `/distill`). When it fails — a non-dereferencing or capability-degraded substrate like the Dia browser — `/realize` activates and projects.

The composition is one-directional: `/distill → /realize`. A realize output is a **terminal** substrate artifact, never re-distilled or re-realized — re-derive from the canonical source if a refresh is needed (`realize` codomain ∩ `distill` domain = ∅). The relation to `/distill` is **advisory** (complementary deficits), not suppression.

## The Degradation Ledger

A realization is faithful when its structure is preserved and every gap is declared. For each primitive the essence needs but the substrate lacks, the ledger records the primitive, why it is unavailable, the declared degradation, and the severity:

| Severity | Meaning | Effect |
|----------|---------|--------|
| **FAIL** | The unavailable primitive touches protocol identity or a convergence condition | Realization is `Failed`; biases toward Redirect (or a user-constituted known limitation) |
| **DEGRADE** | The unavailable primitive reduces only evidence-richness or state-tracking | Recorded; the artifact stays emittable with the declared gap |

Silent approximation of an unavailable primitive is forbidden — the ledger is the explicit record of exactly where Outcome Equivalence fails locally for this substrate.

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
