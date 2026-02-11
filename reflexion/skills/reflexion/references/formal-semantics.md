# Formal Semantics

Categorical and type-theoretic formalization of Reflexion.

## Overview

Reflexion operates in the **post-cognition** position within the epistemic protocols family:
- **Prothesis** (πρόθεσις): pre-cognition — perspective placement before analysis
- **Syneidesis** (συνείδησις): mid-cognition — gap surfacing at decision points
- **Reflexion** (reflexio): post-cognition — insight extraction after session

## Categorical Structure

### Objects

```
Session     : Type                         -- conversation history (.jsonl)
Memory      : Type = User | Project | Domain
Insight     : Type = { content, evidence, confidence, category }
Location    : Type = { mode: Memory, path: FilePath }
Artifact    : Type = { summary, insights: List(Insight), related: List(Knowledge) }
```

### Morphisms

```
ctx    : Session → Context
extract: Session × Memory → Artifact       -- coproduct of 3 parallel subagents
select : Artifact → (List(Insight) × List(Location))
integrate: List(Insight) × List(Location) × Memory → Memory'
verify : Memory' → Memory' × CleanupAction
```

### Composition

The full workflow is the composition:

```
reflexion = verify ∘ integrate ∘ select ∘ extract ∘ ctx

reflexion : Session × Memory → Memory' × CleanupAction
```

## Coproduct Structure (Phase 2)

Parallel extraction uses coproduct (disjoint union) semantics:

```
∥E = E₁ + E₂ + E₃

E₁ : Session → Summary                     -- session-summarizer
E₂ : Session → List(Insight)               -- insight-extractor
E₃ : Session × Memory → List(Knowledge)    -- knowledge-finder

-- Coproduct property: results combine without interference
combine : Summary × List(Insight) × List(Knowledge) → Artifact
```

The `run_in_background: true` + `TaskOutput` pattern implements this coproduct:
1. Launch E₁, E₂, E₃ in parallel
2. Each writes to separate file (no shared state)
3. Main agent collects via TaskOutput (coproduct injection)
4. Combine into single Artifact (coproduct elimination)

## Selection as Limit

Phase 3 selection is a **limit** operation:

```
Sel : Artifact → (Iₛ, Lₛ)

-- Limit diagram:
     Artifact
        |
    ┌───┴───┐
    ↓       ↓
  Iₛ ←──── Lₛ
    (selected insights, their locations)

-- Universal property: Sel is the unique arrow making the diagram commute
-- User judgment (via AskUserQuestion) determines the specific limit
```

The 2-dimensional output (what × where) distinguishes Reflexion from simpler extern operations.

## Extern Comparison

| Protocol | Extern Type | Dimension |
|----------|-------------|-----------|
| Prothesis | Perspective selection | 1D (which P) |
| Syneidesis | Gap judgment | 1D (J ∈ {Addresses, Dismisses, Silence}) |
| Reflexion | Insight + Location | 2D (Iₛ × Lₛ) |

## TodoWrite as State Machine

TodoWrite externalizes the phase state:

```
PhaseState : Type = { phase: 1..5, status: pending | in_progress | completed }
Transition : PhaseState → PhaseState

-- Invariants:
-- 1. Exactly one phase in_progress at any time
-- 2. Completed phases cannot regress
-- 3. Phase N+1 cannot start until Phase N completed

TodoWrite : List(PhaseState) → IO ()
```

This prevents the "goal gradient effect" where later phases are skipped under task-completion pressure.

## Memory Hierarchy

```
Memory = User ⊕ Project ⊕ Domain

User    : ~/.claude/                       -- foundation layer
Project : {project}/.claude/               -- override layer
Domain  : .insights/domain/{stack}/        -- tech-stack specific

-- Precedence: Project > Domain > User
-- Reflexion writes to any layer based on user selection (Lₛ)
```

## Functor Properties

Reflexion exhibits functorial behavior:

```
F : Session → Memory

-- Preserves identity: F(empty_session) = identity on Memory
-- Preserves composition: F(s₁ ++ s₂) ≅ F(s₂) ∘ F(s₁)
```

The second property is approximate due to user-guided selection (not purely deterministic).

## Protocol Integration Semantics

### With Prothesis

```
Prothesis ; Reflexion

-- Prothesis output (selected perspective) constrains E₂ focus
-- Formally: E₂ becomes E₂|P where P is the selected perspective
```

### With Syneidesis

```
Reflexion[Syneidesis]

-- Syneidesis applies at Q2-Q5 decision points
-- Each Sel step may trigger gap detection before AskUserQuestion
-- Formally: Sel becomes Syn ∘ Sel where Syn surfaces gaps
```

## Invariants

1. **Idempotence**: Running Reflexion twice on same session should not duplicate insights (deduplication in Q4 merge step)

2. **Monotonicity**: Memory only grows or refines; Reflexion does not delete existing insights

3. **User Authority**: All Sel decisions require explicit user judgment via AskUserQuestion

4. **Cleanup Guarantee**: Phase 5 always executes cleanup regardless of earlier failures

## Error Semantics

See `references/error-handling.md` for recovery procedures.

```
reflexion : Session × Memory → Either(Error, Memory')

-- Errors propagate upward but cleanup still runs
-- Partial progress may be preserved in handoff files
```
