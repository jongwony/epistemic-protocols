---
name: prothesis
description: Lens for multi-perspective analysis. Selects viewpoints before analysis when the right framework is absent, producing a framed inquiry.
user-invocable: true
---

# Prothesis Protocol

Resolve absent frameworks by placing available epistemic perspectives before the user, enabling lens selection prior to any perspective-requiring cognition. Type: `(FrameworkAbsent, AI, SELECT, Inquiry) → FramedInquiry`.

## Definition

**Prothesis** (πρόθεσις): A dialogical act of presenting available epistemic perspectives as options when the appropriate framework is absent, enabling selection before any perspective-requiring cognition.

```
── FLOW ──
Prothesis(U) → G(U) → C → {P₁...Pₙ}(C) → S → Pₛ → T(Pₛ) → ∥I(T) → Ω(T) → R → Syn(R) → L

── TYPES ──
U      = Underspecified request (purpose clear, approach unclear)
G      = Gather: U → C                         -- context acquisition
C      = Context (information for perspective formulation)
{P₁...Pₙ}(C) = Perspectives derived from context (n ≥ 2)
S      = Selection: {P₁...Pₙ} → Pₛ             -- extern (user choice)
Pₛ     = Selected perspectives (Pₛ ⊆ {P₁...Pₙ}, Pₛ ≠ ∅)
T      = Team(Pₛ): TeamCreate → (∥ p∈Pₛ. Spawn(p)) -- agent team with shared task list
∥I     = Parallel inquiry: (∥ p∈T. Inquiry(p)) → D?(T) → R
D?     = Optional dialogue: selective cross-perspective challenge (coordinator-mediated)
Ω      = Collection: T → R, shutdown(T) ∨ retain(T)  -- conditional on loop
R      = Set(Result)                           -- inquiry outputs
Syn    = Synthesis: R → (∩, D, A)
L      = Lens { convergence: ∩, divergence: D, assessment: A }
FramedInquiry = L where (|Pₛ| ≥ 1 ∧ user_confirmed(sufficiency)) ∨ user_esc

── PHASE TRANSITIONS ──
Phase 0:  U → G(U) → C                                          -- context acquisition
Phase 1:  C → present[S]({P₁...Pₙ}(C)) → await → Pₛ            -- S: AskUserQuestion [Tool]
Phase 2a: Pₛ → T[TeamCreate](Pₛ) → ∥Spawn[Task](T, Pₛ)         -- team setup [Tool]
Phase 2b: T → ∥I[TaskCreate](T) → D[SendMessage](T) → R         -- inquiry + optional dialogue [Tool]
Phase 2c: R → Ω[SendMessage](T) → R'                            -- collection + deferred shutdown [Tool]
Phase 3:  R' → Syn(R') → L                                      -- internal synthesis
Phase 4:  L → Q[AskUserQuestion](sufficiency) → await → J       -- sufficiency check [Tool]

── LOOP ──
After Phase 4:
  J = sufficient      → Ω(T, shutdown) → TeamDelete → terminate with L
  J = add_perspective  → Phase 1 (Λ.team retained → spawn into T)
  J = refine           → Phase 2b (re-inquiry within existing T)
  J = ESC              → Ω(T, shutdown) → TeamDelete → terminate with current L
Continue until convergence: user satisfied OR user ESC.

── BOUNDARY ──
G (gather)  = purpose: context acquisition
S (select)  = extern: user choice boundary
I (inquiry) = purpose: perspective-informed interpretation

── TOOL GROUNDING ──
S (extern)         → AskUserQuestion tool (mandatory; Esc → terminate with current L or no lens)
T (parallel)       → TeamCreate tool (creates team with shared task list)
∥Spawn (parallel)  → Task tool (team_name, name: spawn perspective teammates)
∥I (parallel)      → TaskCreate/TaskUpdate (shared task list for inquiry coordination)
D (parallel)       → SendMessage tool (type: "message", coordinator-mediated cross-dialogue)
Ω (extern)         → SendMessage tool (type: "shutdown_request", graceful teammate termination)
Phase 4 Q          → AskUserQuestion (sufficiency check; Escape → terminate)
Λ (state)          → TaskCreate/TaskUpdate (optional, for perspective tracking)
G (gather)         → Read, Glob, Grep (context acquisition)
Syn (synthesis)    → Internal operation (no external tool)

── CATEGORICAL NOTE ──
∩ = meet (intersection) over comparison morphisms between perspective outputs
D = join (union of distinct findings) where perspectives diverge
A = synthesized assessment (additional computation)

── MODE STATE ──
Λ = { phase: Phase, lens: Option(L), active: Bool, team: Option(TeamState) }
TeamState = { name: String, members: Set(String), tasks: Set(TaskId) }
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

- Prothesis completes before other workflows begin
- User Memory rules resume after perspective is established

**Protocol precedence**: Default ordering places Prothesis after Telos and before Syneidesis (established perspective contextualizes gap detection). The user can override this default by explicitly requesting a different protocol first. Katalepsis is structurally last — it requires completed result (`R`), so it is not subject to ordering choices.

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

### Plan Mode Integration

When combined with Plan mode, Prothesis provides the **Deliberation** phase:

**Per-Phase Application**:
- Apply Prothesis at each planning domain or phase
- Perspectives evaluate domain-specific considerations
- Synthesis produces phase-scoped recommendations

**Syneidesis Coordination** (following default ordering):
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

### Phase 2: Inquiry (Through Selected Lens)

#### Phase 2a: Team Setup

Create an agent team and spawn perspective teammates:

1. Call TeamCreate to create a team (e.g., `prothesis-inquiry`)
2. For each selected perspective, call Task with `team_name` and `name` to spawn a teammate

Teammates do not inherit the lead's conversation history. Each spawn prompt MUST include Phase 0 context (gathered information, key constraints, domain specifics) alongside the question — without this, teammates lack the context needed for informed analysis.

Each teammate receives the perspective prompt template:

```
You are a **[Perspective] Expert**.

Analyze from this epistemic standpoint:

**Context**: {Phase 0 gathered context — key constraints, domain, relevant facts}
**Question**: {original question verbatim}

Provide:
1. **Epistemic Contribution**: What this lens uniquely reveals (2-3 sentences)
2. **Framework Analysis**: Domain-specific concepts, terminology, reasoning
3. **Horizon Limits**: What this perspective cannot see or undervalues
4. **Assessment**: Direct answer from this viewpoint

Cross-dialogue: If the coordinator sends you another perspective's finding
to challenge, respond with a focused rebuttal or concession (2-3 sentences).
Do not initiate cross-dialogue unprompted.
```

Multiple selections → parallel teammates (never sequential).

#### Phase 2b: Inquiry and Dialogue

Teammates analyze independently. After results arrive, the coordinator (main agent) MAY initiate cross-dialogue:

**Cross-dialogue triggers** (all coordinator-mediated):
- Contradictory conclusions between perspectives
- One perspective's horizon limit intersects another's core finding
- Coordinator judges a finding needs adversarial testing

**Cross-dialogue constraints**:
- 1 exchange per pair: challenge + response (no extended debate)
- Coordinator relays via SendMessage (type: "message") — no peer-to-peer
- Dialogue is selective, not mandatory — skip when perspectives cleanly complement

#### Phase 2c: Collection

Collect all results (initial analyses + any dialogue responses) into R'. Team remains active — shutdown/retain decisions are deferred to the LOOP section after Phase 4, where the user's sufficiency judgment determines team lifecycle.

#### Isolated Context Requirement

Each perspective MUST be analyzed in **isolated teammate context** to prevent:
- Cross-perspective contamination from shared conversation history
- Confirmation bias from main agent's prior reasoning
- Anchoring on initial assumptions formed during context gathering

**Structural necessity**: Only teammates in an agent team provide fresh context—main agent retains full conversation history. Therefore, perspective analysis MUST be delegated to separate teammates. This is not a stylistic preference; it is architecturally required for epistemically valid multi-perspective analysis. Cross-dialogue is strictly coordinator-mediated to maintain isolation boundaries.

**Isolation trade-off on refine loops**: When `J=refine` reuses a retained teammate via SendMessage, the coordinator's refinement instruction inherently carries synthesis context (what to refine, why). This introduces controlled cross-pollination — the teammate gains partial awareness of other perspectives' findings. This is acceptable because: (1) the user explicitly requested refinement, sanctioning the trade-off; (2) the coordinator controls what information crosses the boundary; (3) fresh initial analysis was already completed in full isolation.

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

### Phase 4: Sufficiency Check

**Call the AskUserQuestion tool** to confirm analysis sufficiency.

```
Is this analysis sufficient for your inquiry?

Options:
1. **Sufficient** — proceed with this understanding
2. **Add perspective** — I'd like to explore additional viewpoints
3. **Refine existing** — revisit one of the analyzed perspectives
```

**Loop behavior** (team lifecycle aware):
- **Sufficient**: generate decision record (`references/decision-record.md`) → shutdown_request → TeamDelete → terminate with current Lens L
- **Add perspective**: Return to Phase 1; existing team T retained → spawn new teammate into T (no TeamCreate)
- **Refine existing**: Return to Phase 2b; call SendMessage to target teammate for re-analysis within existing T
- **ESC**: generate decision record (`references/decision-record.md`) → shutdown_request → TeamDelete → terminate with current Lens L

**Convergence**: Mode terminates when user confirms sufficiency or explicitly exits. Team is deleted only at terminal states (sufficient/ESC). Decision record is generated before team shutdown.

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
  T(selected) → ∥I(T) → Syn → L
```

**Principle**: Mandatory baseline cannot be reduced by user selection; only extended.

## Rules

1. **Recognition over Recall**: Always **call** AskUserQuestion tool to present options (text presentation = protocol violation)
2. **Epistemic Integrity**: Each perspective analyzes in isolated teammate context within an agent team; main agent direct analysis = protocol violation (violates isolation requirement). Cross-dialogue is coordinator-mediated only — no peer-to-peer exchange
3. **Synthesis Constraint**: Integration only combines what perspectives provided; no new analysis
4. **Verbatim Transmission**: Pass original question unchanged to each perspective
5. **Convergence persistence**: Mode loops until user confirms sufficiency or ESC
6. **Sufficiency check**: Always call AskUserQuestion after synthesis to confirm or extend analysis
7. **Minimum perspectives**: Always present at least 2 distinct perspectives (`n ≥ 2`); single-perspective selection produces degenerate synthesis (convergence = identity)
8. **Team persistence**: Team persists across Phase 4 loop iterations; TeamDelete only at terminal states (sufficient/ESC)
