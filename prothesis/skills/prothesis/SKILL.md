---
name: prothesis
description: >-
  Use when user asks for "multiple perspectives", "different viewpoints",
  "epistemic lens", "analyze from different angles", or presents an
  underspecified request where purpose is clear but approach is unclear.
  Transforms unknown unknowns into known unknowns by placing available
  epistemic perspectives before the user.
allowed-tools:
  - AskUserQuestion
  - Read
  - Glob
  - Grep
---

# Prothesis Protocol

Transform unknown unknowns into known unknowns by placing available epistemic perspectives before the user, enabling lens selection prior to any perspective-requiring cognition.

## Definition

**Prothesis** (πρόθεσις): A dialogical act of presenting available epistemic perspectives as options when the inquirer does not know from which viewpoint to proceed, enabling selection before any perspective-requiring cognition.

```
Prothesis(U) → G(U) → C → {P₁...Pₙ}(C) → S → Pₛ → ∥I(Pₛ) → R → Syn(R) → L

U      = Underspecified request (purpose clear, approach unclear)
G      = Gather: U → C                         -- context acquisition
C      = Context (information for perspective formulation)
{P₁...Pₙ}(C) = Perspectives derived from context (n ≥ 2)
S      = Selection: {P₁...Pₙ} → Pₛ             -- extern (user choice)
Pₛ     = Selected perspectives (Pₛ ⊆ {P₁...Pₙ}, Pₛ ≠ ∅)
∥I     = Parallel inquiry: (∥ p∈Pₛ. Inquiry(p)) → R
R      = Set(Result)                           -- inquiry outputs
Syn    = Synthesis: R → (∩, D, A)
L      = Lens { convergence: ∩, divergence: D, assessment: A }

── PHASE TRANSITIONS ──
Phase 0: U → G(U) → C                          -- context acquisition
Phase 1: C → present({P₁...Pₙ}(C)) → await → Pₛ   -- call AskUserQuestion
Phase 2: Pₛ → ∥I(Pₛ) → R                       -- sequential perspective analysis
Phase 3: R → Syn(R) → L                        -- synthesis
```

## Mode Activation

Command invocation activates mode until session end.

<system-reminder>
When Prothesis is active:

**Supersedes**: Immediate analysis patterns in User Memory
(Perspective Selection must complete before analysis begins)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: Before analysis, call AskUserQuestion tool to present perspective options.
</system-reminder>

**Dual-activation precedence**: When both Prothesis and Syneidesis are active, Prothesis executes first (perspective selection gates subsequent analysis).

### Per-Message Application

| Message Type | Action |
|--------------|--------|
| New inquiry | Prothesis |
| Follow-up within established lens | Continue with selected perspective |
| Uncertain | Default to Prothesis |

**Decision rule**: When uncertain whether perspective is established, default to Prothesis.

```
False positive (unnecessary question) < False negative (missed perspective)
```

## Protocol

### Phase 0: Context Gathering

Gather context sufficient to formulate distinct perspectives. Do not proceed to Phase 1 until context is established.

### Phase 1: Prothesis (Perspective Placement)

After context gathering, **call the AskUserQuestion tool** to present perspectives.

**Do NOT present perspectives as plain text.** The tool call is mandatory—text-only presentation is a protocol violation.

```
Available epistemic perspectives:

1. **[Perspective A]**: [distinctive analytical contribution - 1 line]
2. **[Perspective B]**: [distinctive analytical contribution - 1 line]
3. **[Perspective C]**: [distinctive analytical contribution - 1 line]

Which lens(es) for this inquiry?
```

**Perspective selection criteria**:
- Each offers a **distinct epistemic framework** (not variations of same view)
- **Productive tension**: Enable meaningful disagreement in interpretation or weighing
- **Commensurability minimum**: At least one shared referent for Phase 3 synthesis
- **Critical viewpoint** (when applicable): Include when genuine alternatives exist
- Named by **discipline or framework**, not persona

### Phase 2: Inquiry (Through Selected Lens)

For each selected perspective, analyze sequentially as that perspective:

```
You are analyzing from the **[Perspective]** standpoint.

**Question**: {original question verbatim}

Provide:
1. **Epistemic Contribution**: What this lens uniquely reveals (2-3 sentences)
2. **Framework Analysis**: Domain-specific concepts, terminology, reasoning
3. **Horizon Limits**: What this perspective cannot see or undervalues
4. **Assessment**: Direct answer from this viewpoint
```

Multiple selections → analyze each perspective in sequence, maintaining epistemic independence.

### Phase 3: Synthesis (Horizon Integration)

After all perspectives complete:

```markdown
## Prothesis Analysis

### Perspective Summaries
[Each perspective's epistemic contribution + assessment, 2-3 sentences]

### Convergence (Shared Horizon)
[Where perspectives agree—indicates robust finding]

### Divergence (Horizon Conflicts)
[Where they disagree—different values, evidence standards, or scope]

### Integrated Assessment
[Synthesized answer with attribution to contributing perspectives]
```

## Conditions

### Trigger Prothesis

Prothesis applies to **open-world** cognition:
- Purpose present, approach unspecified
- Multiple valid epistemic frameworks exist
- User's domain awareness likely incomplete
- **Structure test**: "What might I be missing?" is a meaningful question

### Skip Prothesis

Prothesis does **not** apply to **closed-world** cognition:
- Single deterministic execution path exists
- Perspective already specified
- Known target with binary outcome

**Heuristic**: If a deterministic procedure can answer the inquiry, skip Prothesis.

## Distinction from Socratic Method

| Dimension | Socratic Maieutics | Prothesis |
|-----------|-------------------|-----------|
| Knowledge source | Latent within interlocutor | Provided externally |
| Premise | "You already know" | "You don't know the options" |
| Role metaphor | Midwife (draws out) | Cartographer (reveals paths) |
| Question form | Open (Recall burden) | Options (Recognition only) |

## Rules

1. **Recognition over Recall**: Always **call** AskUserQuestion tool (text = violation)
2. **Epistemic Integrity**: Each perspective analyzes independently; no cross-contamination
3. **Synthesis Constraint**: Integration only combines what perspectives provided
4. **Verbatim Transmission**: Pass original question unchanged to each perspective
5. **Session Persistence**: Mode remains active until session end
