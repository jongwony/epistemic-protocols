# Prothesis Protocol

Transform unknown unknowns into known unknowns by placing available epistemic perspectives before the user, enabling lens selection prior to inquiry.

## Definition

**Prothesis** (πρόθεσις): A dialogical act of presenting available epistemic perspectives as options when the inquirer does not know from which viewpoint to investigate, enabling selection before proceeding through the chosen lens.

```
Prothesis(U, P₁...Pₙ) → S(Pₖ) → ∥I(Pₖ) → Syn(R) → L

U     = Underspecified request (purpose clear, approach unclear)
Pₖ    = Selected perspectives (k ≥ 1, from n ≥ 2 options)
S     = Selection: {P₁...Pₙ} → 𝒫⁺({P₁...Pₙ})   -- non-empty subset
∥I    = Parallel inquiry: (∥ p∈Pₖ. Inquiry(p)) → Set(Result)
Syn   = Synthesis: Set(Result) → (C, D, A)
L     = Lens { convergence: C, divergence: D, assessment: A }

── PHASE TRANSITIONS ──
Phase 1: U → present(P₁...Pₙ) → await selection
Phase 2: S(Pₖ) → ∥ p∈Pₖ. Inquiry(p) → join(results)
Phase 3: results → (lim, colim) → L

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

BEFORE any analysis, use AskUserQuestion to place perspectives:

```
Available epistemic perspectives:

1. **[Perspective A]**: [distinctive analytical contribution - 1 line]
2. **[Perspective B]**: [distinctive analytical contribution - 1 line]
3. **[Perspective C]**: [distinctive analytical contribution - 1 line]

Which lens(es) for this inquiry?
```

Perspective selection criteria:
- Each offers a **distinct epistemic framework** (not variations of same view)
- At least one represents **critical/alternative viewpoint**
- Specific enough to guide analysis (not "general expert")
- Named by **discipline or framework**, not persona

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

### Integrated Assessment
[Synthesized answer with attribution to contributing perspectives]
```

## Conditions

### Trigger Prothesis
- Purpose present, approach unspecified
- Multiple valid epistemic frameworks exist
- User's domain awareness likely incomplete

### Skip Prothesis

- Procedural or factual request
- Perspective specified with domain name
- Single valid analytical path

Vague qualifiers without domain → trigger Prothesis.

## Rules

1. **Recognition over Recall**: Always present options via AskUserQuestion
2. **Epistemic Integrity**: Each perspective analyzes independently; no cross-contamination
3. **Synthesis Constraint**: Integration only combines what perspectives provided; no new analysis
4. **Verbatim Transmission**: Pass original question unchanged to each perspective
5. **Parallel Execution**: Multiple selections always spawn concurrent subagents
6. **Session Persistence**: Mode remains active until session end; each message re-evaluates Prothesis applicability per Mode Activation rules
