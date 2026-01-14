---
name: prothesis
description: Analyze from multiple perspectives. Select viewpoints before analysis to transform unknown unknowns into known unknowns.
user-invocable: true
---

# Prothesis Protocol

Transform unknown unknowns into known unknowns by placing available epistemic perspectives before the user, enabling lens selection prior to any perspective-requiring cognition.

## Definition

**Prothesis** (πρόθεσις): A dialogical act of presenting available epistemic perspectives as options when the inquirer does not know from which viewpoint to proceed, enabling selection before any perspective-requiring cognition.

```
── FLOW ──
U → C → P → Pₛ → ∥I(Pₛ) → R → L

── TYPES ──
U  = Underspecified request
C  = Context (gathered from U)
P  = Perspectives derived from C (|P| ≥ 2)
Pₛ = User-selected perspectives (via AskUserQuestion)
R  = Inquiry results per perspective
L  = Lens { convergence, divergence, assessment }

── PHASES ──
Phase 0: Gather context from U
Phase 1: Present P, call AskUserQuestion → Pₛ
Phase 2: ∥ Inquiry(p) for p ∈ Pₛ → R (parallel Task agents)
Phase 3: Synthesize R → L

── STATE ──
Λ = { phase, lens, active }
```

## Mode Activation

### Activation

Command invocation activates mode until session end.

### Priority

<system-reminder>
When Prothesis is active:

**Supersedes**: Immediate analysis patterns in User Memory
(Perspective Selection must complete before analysis begins)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: Before analysis, call AskUserQuestion tool to present perspective options.
</system-reminder>

**Domain overlap**: When Syneidesis is also active, Prothesis supersession (analysis patterns)
and Syneidesis supersession (decision gating) are independent. Execution order resolves overlap:
Prothesis completes before Syneidesis evaluates decision points.

- Prothesis completes before other workflows begin
- User Memory rules resume after perspective is established

**Protocol precedence** (multi-activation order): Hermeneia → Prothesis → Syneidesis

| Active Protocols | Execution Order | Rationale |
|------------------|-----------------|-----------|
| Prothesis + Syneidesis | Prothesis → Syneidesis | Perspective selection gates analysis |
| Hermeneia + Prothesis | Hermeneia → Prothesis | Clarified intent informs perspective options |
| All three active | Hermeneia → Prothesis → Syneidesis | Intent → Perspective → Decision gaps |

Syneidesis applies to decision points within the established perspective.

### Per-Message Application

Every user message triggers perspective evaluation:

| Message Type | Criteria | Action |
|--------------|----------|--------|
| New inquiry | Topic shift OR no prior lens in session | Prothesis |
| Follow-up within lens | Explicit reference to prior analysis OR same subject matter | Continue with selected perspective |
| Uncertain | Neither criterion clearly met | Default to Prothesis |

**Within-lens criteria** (any of):
1. User explicitly references prior analysis ("based on what you said", "continuing with...")
2. Same subject matter as established lens (semantic continuity)
3. Request builds on prior conclusion ("given that", "so then...")

**New-inquiry criteria** (any of):
1. Different domain or subject matter
2. Contradicts prior lens assumptions
3. Scope expansion beyond prior analysis

**Decision rule**: When uncertain whether perspective is established, default to Prothesis.

```
False positive (unnecessary question) < False negative (missed perspective)
```

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Synthesis complete | Lens established; follow-ups continue within lens |
| User starts unrelated topic | Re-evaluate for new Prothesis |

### Plan Mode Integration

When combined with Plan mode, Prothesis provides the **Deliberation** phase:

**Per-Phase Application**:
- Apply Prothesis at each planning domain or phase
- Perspectives evaluate domain-specific considerations
- Synthesis produces phase-scoped recommendations

**Syneidesis Coordination**:
- Prothesis generates recommendations (Deliberation)
- Syneidesis surfaces unconfirmed assumptions (Gap)
- User feedback triggers re-evaluation (Revision)
- Explicit confirmation gates execution (Execution)

**Minimal Enhancement Pattern**:
When multiple perspectives converge on the same recommendation, present as unanimous recommendation to indicate high confidence.

## Distinction from Socratic Method

| Dimension | Socratic Maieutics | Prothesis |
|-----------|-------------------|-----------|
| Knowledge source | Latent within interlocutor | Provided externally |
| Premise | "You already know" | "You don't know the options" |
| Role metaphor | Midwife (draws out) | Cartographer (reveals paths) |
| Question form | Open (Recall burden) | Options (Recognition only) |

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
- **Productive tension**: Perspectives should enable meaningful disagreement—differing in interpretation, weighing, or application, even if sharing some evidence
- **Commensurability minimum**: At least one shared referent, standard, or vocabulary must exist between perspectives to enable Phase 3 synthesis
- **Critical viewpoint** (when applicable): Include when genuine alternatives exist; omit when perspectives legitimately converge
- Specific enough to guide analysis (not "general expert")
- Named by **discipline or framework**, not persona

Optional dimension naming (invoke when initial generation seems redundant):
- Identify epistemic axes relevant to this inquiry
- Dimensions remain revisable during perspective generation

### Phase 2: Inquiry (Parallel Isolated Agents)

For each selected perspective, spawn parallel Task agents for **epistemic isolation**:

```
Task(subagent_type: "general-purpose",
     prompt: "Analyze from {perspective_name} viewpoint: {original_question}. Context: {phase0_context}",
     run_in_background: true)
```

**Constraint**: Task subagents cannot call AskUserQuestion. All user interaction must complete in Phase 1 before entering Phase 2. This is why perspective selection (Phase 1) is mandatory before inquiry begins.

**Rationale**: Sequential analysis in a single context window causes cross-contamination—later perspectives can see earlier results, violating epistemic independence. Parallel agents ensure each perspective analyzes without access to others' outputs.

**Execution**:
1. Spawn one agent per selected perspective with `run_in_background: true`
2. Wait for all agents to complete (use `TaskOutput` to collect results)
3. Aggregate results for Phase 3 synthesis

Multiple selections → parallel agents (never sequential in main context).

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

1. **Recognition over Recall**: Always **call** AskUserQuestion tool to present options (text presentation = protocol violation)
2. **Epistemic Integrity**: Each perspective analyzes independently via isolated subagents; no cross-contamination
3. **Synthesis Constraint**: Integration only combines what perspectives provided; no new analysis
4. **Verbatim Transmission**: Pass original question unchanged to each perspective agent
5. **Parallel Isolation**: Phase 2 must use Task subagents with `run_in_background: true`; never sequential in main context
6. **Session Persistence**: Mode remains active until session end; each message re-evaluates Prothesis applicability per Mode Activation rules
