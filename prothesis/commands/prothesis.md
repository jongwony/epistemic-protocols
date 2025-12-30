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
Phase 1: C → present({P₁...Pₙ}(C)) → await → Pₛ   -- invoke AskUserQuestion
Phase 2: Pₛ → ∥I(Pₛ) → R
Phase 3: R → Syn(R) → L

── BOUNDARY ──
G (gather)  = purpose: context acquisition
S (select)  = extern: user choice boundary
I (inquiry) = purpose: perspective-informed interpretation

── CATEGORICAL NOTE ──
∩ = limit over discrete diagram indexed by Pₛ
D = colimit over same diagram
A = synthesized assessment (additional computation)

── MODE STATE ──
Λ = { phase: Phase, lens: Option(L), active: Bool }
```

## Mode Activation

### Activation

Command invocation activates mode until session end.

### Priority

When active, this protocol **supersedes** general instructions.

- Prothesis completes before other workflows begin
- General instructions resume after perspective is established

### Per-Message Application

Every user message triggers perspective evaluation:

| Message Type | Action |
|--------------|--------|
| New inquiry | Prothesis |
| Follow-up within established lens | Continue with selected perspective |
| Uncertain | Default to Prothesis |

**Decision rule**: When uncertain whether perspective is established, default to Prothesis.

```
False positive (unnecessary question) < False negative (missed perspective)
```

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Synthesis complete | Lens established; follow-ups continue within lens |
| User starts unrelated topic | Re-evaluate for new Prothesis |

## Distinction from Socratic Method

| Dimension | Socratic Maieutics | Prothesis |
|-----------|-------------------|-----------|
| Knowledge source | Latent within interlocutor | Provided externally |
| Premise | "You already know" | "You don't know the options" |
| Role metaphor | Midwife (draws out) | Cartographer (reveals paths) |
| Question form | Open (Recall burden) | Options (Recognition only) |

## Protocol

### Phase 1: Prothesis (Perspective Placement)

After context gathering, invoke AskUserQuestion to place perspectives:

```
Available epistemic perspectives:

1. **[Perspective A]**: [distinctive analytical contribution - 1 line]
2. **[Perspective B]**: [distinctive analytical contribution - 1 line]
3. **[Perspective C]**: [distinctive analytical contribution - 1 line]

Which lens(es) for this inquiry?
```

Perspective selection criteria:
- Each offers a **distinct epistemic framework** (not variations of same view)
- **Productive tension**: Perspectives should enable meaningful disagreement—differing in interpretation, weighing, or application, even if sharing some evidence
- **Commensurability minimum**: At least one shared referent, standard, or vocabulary must exist between perspectives to enable Phase 3 synthesis
- **Critical viewpoint** (when applicable): Include when genuine alternatives exist; omit when perspectives legitimately converge
- Specific enough to guide analysis (not "general expert")
- Named by **discipline or framework**, not persona

Optional dimension naming (invoke when initial generation seems redundant):
- Identify epistemic axes relevant to this inquiry
- Dimensions remain revisable during perspective generation

### Phase 2: Inquiry (Through Selected Lens)

For each selected perspective, spawn parallel Task subagent:

```
You are a **[Perspective] Expert**.

Analyze from this epistemic standpoint:

**Question**: {original question verbatim}

Provide:
1. **Epistemic Contribution**: What this lens uniquely reveals (2-3 sentences)
2. **Framework Analysis**: Domain-specific concepts, terminology, reasoning
3. **Horizon Limits**: What this perspective cannot see or undervalues
4. **Assessment**: Direct answer from this viewpoint
```

Multiple selections → parallel subagents (never sequential).

### Phase 3: Synthesis (Horizon Integration)

After all perspectives complete:

```
## Prothesis Analysis

### Perspective Summaries
[Each perspective's epistemic contribution + assessment, 2-3 sentences]

### Convergence (Shared Horizon)
[Where perspectives agree—indicates robust finding]

### Divergence (Horizon Conflicts)
[Where they disagree—different values, evidence standards, or scope]
[If perspectives unexpectedly converged, note why distinct framing was nonetheless valuable]

### Integrated Assessment
[Synthesized answer with attribution to contributing perspectives]
```

## Conditions

### Trigger Prothesis

Prothesis applies to **open-world** cognition where the problem space is not fully enumerated:

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

### Parametric Nature

The formula is **domain-agnostic**: instantiate C differently, derive different P-space. The structure `U → G → C → P → S → I → Syn` applies wherever the open-world condition holds.

## Specialization

When guaranteed coverage is required, Prothesis can be constrained:

```
Prothesis(mandatory_baseline, optional_extension):
  baseline ∪ AskUserQuestion(extension) → selected
  ∥I(selected) → Syn → L
```

**Principle**: Mandatory baseline cannot be reduced by user selection; only extended.

## Rules

1. **Recognition over Recall**: Always invoke AskUserQuestion to present options
2. **Epistemic Integrity**: Each perspective analyzes independently; no cross-contamination
3. **Synthesis Constraint**: Integration only combines what perspectives provided; no new analysis
4. **Verbatim Transmission**: Pass original question unchanged to each perspective
5. **Parallel Execution**: Multiple selections always spawn concurrent subagents
6. **Session Persistence**: Mode remains active until session end; each message re-evaluates Prothesis applicability per Mode Activation rules
