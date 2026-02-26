---
name: goal
description: "Co-construct defined goals from vague intent. Builds a GoalContract when neither party has a clear end state. Alias: Telos(τέλος)."
---

# Telos Protocol

Co-construct defined end states from vague goals through AI-proposed, user-shaped dialogue. Type: `(GoalIndeterminate, AI, CO-CONSTRUCT, VagueGoal) → DefinedEndState`.

## Definition

**Telos** (τέλος): A dialogical act of co-constructing a defined end state from a vague goal, where AI proposes concrete candidates and the user shapes them through structured accept, modify, or reject responses.

```
── FLOW ──
G → Gᵥ → Dₛ → P → A → C' → (loop until sufficient)

── TYPES ──
G   = User's vague goal (the goal to define)
Gᵥ  = Verified vague goal (user-confirmed)
Dₛ  = Selected dimension ∈ {Outcome, Metric, Boundary, Priority}
Dₐ  = Applicable dimensions (user-selected subset, |Dₐ| ≥ 1)
P   = Proposal (AI-generated concrete candidate)
A   = User's response ∈ {Accept, Modify(aspect, direction), Reject, Extend(aspect)}
C   = GoalContract { outcome: ?, metric: ?, boundary: ?, priority: ? }
C'  = Updated GoalContract after integration

── G-BINDING ──
bind(G) = explicit_arg ∪ colocated_expr ∪ prev_user_turn
Priority: explicit_arg > colocated_expr > prev_user_turn

/goal "text"                → G = "text"
"define goal... goal"       → G = text before trigger
/goal (alone)               → G = previous user message

Edge cases:
- Interrupt: G = original request of interrupted task
- Queued:    G = previous message at queue time (fixed)
- Re-invoke: Show prior GoalContract, confirm or restart

── PHASE TRANSITIONS ──
Phase 0:  G → recognize(G) → Q[AskUserQuestion](confirm) → Gᵥ  -- trigger + confirm [Tool]
Phase 1:  Gᵥ → Q[AskUserQuestion](dimensions) → Dₐ, Dₛ         -- dimension selection [Tool]
Phase 2:  Dₛ → propose(Dₛ, context) → P                        -- AI proposal (internal)
        → Q[AskUserQuestion](P) → await → A                     -- co-construction [Tool]
Phase 3:  A → integrate(A, C) → C'                             -- contract update (internal)
Phase 4:  C' → Q[AskUserQuestion](C', progress) → approve       -- sufficiency check [Tool]

── LOOP ──
After Phase 3: compute progress(C', Dₐ).
If undefined dimensions remain in Dₐ: return to Phase 1 (next dimension).
If all Dₐ defined: proceed to Phase 4.
User can trigger Phase 4 early at any Phase 1 (early_exit).
Continue until: user approves GoalContract OR user ESC.

── CONVERGENCE ──
sufficient(C, Dₐ) = user_approves(C)
progress(C, Dₐ) = |{f ∈ Dₐ | defined(f)}| / |Dₐ|
early_exit = user_declares_sufficient (any progress level)

── TOOL GROUNDING ──
Phase 0 Q  (extern)  → AskUserQuestion (goal confirmation + activation approval)
Phase 1 Q  (extern)  → AskUserQuestion (dimension selection + progress display)
Phase 2 P  (detect)  → Read, Grep (context for proposal generation; fallback: template)
Phase 2 Q  (extern)  → AskUserQuestion (proposal with structured response options)
Phase 3    (state)   → Internal GoalContract update (no external tool)
Phase 4 Q  (extern)  → AskUserQuestion (GoalContract review + approval)

── MODE STATE ──
Λ = { phase: Phase, G: Goal, Gᵥ: Goal, applicable: Set(Dim),
      contract: GoalContract, history: List<(Dₛ, P, A)>, active: Bool }
```

## Core Principle

**Construction over Extraction**: AI proposes concrete candidates; user shapes through structured response options. Neither party holds the complete answer alone.

## Epistemic Distinction from Requirements Engineering

Telos is not simplified requirements gathering. Three differentiators:
1. **Selection over Detection**: User selects which dimensions are indeterminate (not elicited by checklist)
2. **Morphism firing**: Activates only when `GoalIndeterminate` precondition is recognized — not a mandatory pipeline stage
3. **Falsifiable proposals**: AI proposes specific candidates that can be directly accepted or rejected, surfacing value conflicts and trade-offs (epistemic function) rather than collecting specifications (engineering function)

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-guided | FrameworkAbsent → FramedInquiry | Perspective selection |
| **Syneidesis** | AI-guided | GapUnnoticed → AuditedDecision | Decision-point gaps |
| **Hermeneia** | Hybrid | IntentMisarticulated → ClarifiedIntent | Expression clarification |
| **Telos** | AI-guided | GoalIndeterminate → DefinedEndState | Goal co-construction |
| **Aitesis** | AI-guided | ContextInsufficient → InformedExecution | Pre-execution context inquiry |
| **Epitrope** | AI-guided | DelegationAmbiguous → CalibratedDelegation | Delegation calibration |
| **Prosoche** | AI-guided | ExecutionBlind → SituatedExecution | Execution-time risk evaluation |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key difference**: Hermeneia EXTRACTS (assumes intent exists inside user). Telos CO-CONSTRUCTS (assumes neither party has the complete answer). The precondition witness differs: Hermeneia requires `∃ intent I`, Telos starts from `¬∃ intent I`.

## Mode Activation

### Activation

AI detects goal indeterminacy OR user invokes `/goal`. Activation always requires user confirmation via AskUserQuestion (Phase 0).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/goal` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Goal indeterminacy detected (2+ dimensions unspecified) via in-protocol heuristics. Activation requires user confirmation.

**Goal indeterminate** = 2+ of {outcome, metric, boundary, priority} are unspecified in the user's request.

### Priority

<system-reminder>
When Telos is active:

**Supersedes**: Direct execution patterns in User Memory
(Goal must be defined before any implementation begins)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, call AskUserQuestion tool to present concrete proposals for goal construction.
</system-reminder>

- Telos completes before implementation workflows begin
- User Memory rules resume after GoalContract is approved

**Protocol precedence**: Default ordering places Telos after Hermeneia and before Epitrope (Hermeneia → Telos → Epitrope → Aitesis → Prothesis → Syneidesis → Prosoche → Epharmoge; clarified intent before goal construction, defined goals before delegation calibration). The user can override this default by explicitly requesting a different protocol first. Katalepsis is structurally last — it requires completed AI work (`R`), so it is not subject to ordering choices.

Approved GoalContract becomes input to subsequent protocols.

### Triggers

| Signal | Strength | Examples |
|--------|----------|----------|
| Acknowledged uncertainty | Strong | "not sure what I want", "something like", "kind of" |
| Scope absence | Strong | "the whole thing", "everything", "wherever needed" |
| Exploratory framing | Strong | "what could we do about", "ideas for", "how might we" |
| Vague qualitative | Soft (suggest only) | "improve", "better", "optimize" |

**Soft triggers**: AI may suggest Telos activation via AskUserQuestion but must NOT auto-activate. Only strong triggers or explicit `/goal` invocation activate directly.

**Skip**:
- User's goal is already verifiable (concrete deliverable + criteria specified)
- User explicitly declines goal definition
- Goal already defined in current session

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| GoalContract approved | Proceed with defined goal |
| User accepts current state | GoalContract as-is deemed sufficient |
| User explicitly cancels | Return to normal operation |

## Gap Taxonomy

| Type | Detection | Question Form | GoalContract Field |
|------|-----------|---------------|--------------------|
| **Outcome** | No concrete end state described | "What exists/changes when this is done?" | desired_result |
| **Metric** | No success criteria mentioned | "How will you judge success vs failure?" | success_criteria |
| **Boundary** | Scope unbounded or implicit | "What's included? What's explicitly excluded?" | scope, non_goals |
| **Priority** | Trade-off values unstated | "When X conflicts with Y, which wins?" | value_weights |

### Dimension Priority

When multiple dimensions are undefined:
1. **Outcome** (highest): End state anchors all other dimensions
2. **Boundary**: Scope constrains feasibility
3. **Priority**: Trade-off values guide choices
4. **Metric** (lowest): Success criteria refine after core is clear

Outcome is always included in applicable dimensions (minimum `|Dₐ| ≥ 1`).

## Protocol

### Phase 0: Trigger Recognition + Confirmation

Recognize goal indeterminacy and confirm activation:

1. **Strong trigger**: User uses uncertainty/exploratory language → activate with confirmation
2. **Soft trigger**: User uses vague qualitative ("improve") → suggest only, do not activate
3. **Explicit invocation**: `/goal` → skip confirmation, proceed to Phase 1

**Call the AskUserQuestion tool** to confirm activation:

```
I notice your goal may need definition before we proceed.

Options:
1. **Define goal together** — co-construct what "done" looks like
2. **Proceed as-is** — the current description is sufficient
```

**Skip condition**: If G was explicitly provided via `/goal "text"`, proceed directly to Phase 1.

### Phase 1: Dimension Selection

**Call the AskUserQuestion tool** with `multiSelect: true` to let user select applicable dimensions.

Present dimensions with current GoalContract progress:

```
Which aspects of the goal need definition? (select all that apply)

Options:
1. **Outcome** — what the end state looks like [required]
2. **Boundary** — what's included and excluded
3. **Priority** — what matters most in trade-offs
4. **Metric** — how to judge success
```

On loop re-entry: show progress (`[defined]` / `[undefined]`) and present only remaining undefined dimensions. Include "Sufficient — approve current GoalContract" option for early exit.

### Phase 2: Co-Construction

**Call the AskUserQuestion tool** to present a concrete proposal.

**Do NOT present proposals as plain text.** The tool call is mandatory — text-only presentation is a protocol violation.

**High-context** (codebase/conversation context available via Read/Grep):
```
Based on [context analysis], here's a concrete [dimension]:

  "[specific proposal grounded in codebase/conversation]"

Options:
1. Accept — proceed with this definition
2. Modify: [aspect A] / [aspect B] / [aspect C] — select what to change
3. Reject — start from different angle
```

**Low-context fallback** (no file/codebase context):
```
For [dimension], here are common patterns for this type of goal:

Options:
1. "[Template A]" — [brief description]
2. "[Template B]" — [brief description]
3. "[Template C]" — [brief description]
4. Describe directly — provide your own definition
```

**Proposal design principles**:
- **Concrete and falsifiable**: Specific enough to accept or reject immediately
- **Context-grounded**: Based on Read/Grep analysis when available, template fallback when not
- **Structured modification**: Modify options present specific aspects to change, not free text
- **Trade-off visible**: Show implications of accepting this proposal

### Phase 3: Integration

After user response:

1. **Accept**: Set GoalContract field to proposal value
2. **Modify(aspect, direction)**: Adjust proposal per user direction, re-propose if needed
3. **Reject**: Discard proposal, generate alternative approach
4. **Extend(aspect)**: Add user's aspect to existing proposal

After integration:
- Compute `progress(C', Dₐ)`
- If undefined dimensions remain: return to Phase 1
- If all defined: proceed to Phase 4
- Log `(Dₛ, P, A)` to history for cycle detection

### Phase 4: Sufficiency Check

**Call the AskUserQuestion tool** to present the assembled GoalContract for approval.

```
## GoalContract (progress/total)

- **Outcome**: [defined value or "—"]
- **Metric**: [defined value or "—" or "N/A"]
- **Boundary**: [defined value or "—" or "N/A"]
- **Priority**: [defined value or "—" or "N/A"]

Options:
1. **Approve** — proceed with this GoalContract
2. **Revise [dimension]** — return to refine a specific field
3. **Add dimension** — define an additional field
```

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Minor scope vagueness, single dimension | "Quick check: the goal is [X]?" |
| Medium | Multiple undefined dimensions | "[Dimension]. Proposal: [X]. Accept/Modify?" |
| Heavy | Core outcome undefined, high stakes | "Before proceeding: [detailed proposal with trade-offs]" |

## Rules

1. **AI-guided, user-confirmed**: AI recognizes goal indeterminacy; activation requires user approval via AskUserQuestion (Phase 0)
2. **Recognition over Recall**: Always **call** AskUserQuestion tool to present options (text presentation = protocol violation). Modify options use structured sub-choices, not free text
3. **Selection over Detection**: User selects applicable dimensions in Phase 1; AI does not auto-sequence or force all 4
4. **Construction over Extraction**: AI proposes falsifiable candidates, not abstract questions
5. **Concrete proposals**: Every proposal must be specific enough to accept or reject
6. **User authority**: User shapes, accepts, or rejects; AI does not override
7. **Progress visibility**: Show GoalContract completion status (defined/total selected) at each Phase 1
8. **Convergence persistence**: Mode active until GoalContract approved or user ESC
9. **Early exit**: User can declare sufficient at any point (any progress level permitted)
10. **Context grounding**: Proposals based on Read/Grep when available; template fallback when not
11. **Small phases**: One dimension per cycle; no bundling unless user requests
12. **Escape hatch**: User can provide own definition for any field directly
