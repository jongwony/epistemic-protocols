---
name: gap
description: Gap surfacing before decisions. Raises procedural, consideration, assumption, and alternative gaps as questions when gaps go unnoticed, producing an audited decision. Alias: Syneidesis(συνείδησις).
user-invocable: true
---

# Syneidesis Protocol

Surface unnoticed gaps at decision points through questions, enabling user to reach an audited decision. Type: `(GapUnnoticed, AI, SURFACE, Decision) → AuditedDecision`.

## Definition

**Syneidesis** (συνείδησις): A dialogical act of surfacing potential gaps—procedural, consideration, assumption, or alternative—at decision points, transforming unnoticed gaps into questions the user can evaluate.

```
── FLOW ──
Syneidesis(D, Σ) → Scan(D) → G → Sel(G, D) → Gₛ → Q(Gₛ) → J → A(J, D, Σ) → Σ'

── TYPES ──
D      = Decision point ∈ Committed × Stakes × Context
Committed = committed(D) ≡ ∃ A : mutates_state(A) ∨ externally_visible(A) ∨ consumes_resource(A)
Stakes = {Low, Med, High}
G      = Gap ∈ {Procedural, Consideration, Assumption, Alternative}
Scan   = Detection: D → Set(G)                      -- gap identification
Sel    = Selection: Set(G) × D → Gₛ                 -- prioritize by stakes
Gₛ     = Selected gaps (|Gₛ| ≤ 2)
Q      = Question formation (assertion-free)
J      = Judgment ∈ {Addresses(c), Dismisses, Silence}
c      = Clarification (user-provided response to Q)
A      = Adjustment: J × D × Σ → Σ'
Σ      = State { reviewed: Set(GapType), deferred: List(G), blocked: Bool }
AuditedDecision = Σ' where (∀ task ∈ registered: task.status = completed) ∨ user_esc

── PHASE TRANSITIONS ──
Phase 0: D → committed?(D) → Scan(D) → G              -- gate + detection (silent)
Phase 1: G → TaskCreate[all gaps] → Gₛ → Q[AskUserQuestion](Gₛ[0]) → J  -- register all, surface first [Tool]
Phase 2: J → A(J, D, Σ) → TaskUpdate → Σ'           -- adjustment + task update [Tool]

── LOOP ──
After Phase 2: re-scan for newly surfaced gaps from user response.
If new gaps: TaskCreate → add to queue.
Continue until: all tasks completed OR user ESC.
Mode remains active until convergence.

── ADJUSTMENT RULES ──
A(Addresses(c), _, σ) = σ { incorporate(c) }        -- extern: modifies plan
A(Dismisses, _, σ)    = σ { reviewed ← reviewed ∪ {Gₛ.type} }
A(Silence, d, σ)      = match stakes(d):
                          Low|Med → σ { deferred ← Gₛ :: deferred }
                          High    → σ { blocked ← true }

── SELECTION RULE ──
Sel(G, d) = take(priority_sort(G, stakes(d)), min(|G|, stakes(d) = High ? 2 : 1))

── CONTINUATION ──
proceed(Σ) = ¬blocked(Σ)

── TOOL GROUNDING ──
Q (extern)     → AskUserQuestion tool (mandatory; Esc key → loop termination at LOOP level, not a Judgment)
Σ (state)      → TaskCreate/TaskUpdate (async gap tracking with dependencies)
Scan (detect)  → Read, Grep (context for gap identification)
A (adjust)     → Internal state update (no external tool)

── MODE STATE ──
Λ = { phase: Phase, state: Σ, active: Bool }
```

## Core Principle

**Surfacing over Deciding**: AI makes visible; user judges.

## Mode Activation

### Activation

Command invocation activates mode until session end.

**On activation**: Check existing Tasks for deferred gaps (subject prefix `[Gap:`). Resume tracking if found.

### Priority

<system-reminder>
When Syneidesis is active:

**Supersedes**: Risk assessment and decision gating rules in User Memory
(e.g., verification tiers, reversibility checks, approval requirements)

**Retained**: Safety boundaries, secrets handling, deny-paths, user explicit instructions

**Action**: At decision points, call AskUserQuestion tool to surface potential gaps before proceeding.
</system-reminder>

- Stakes Assessment replaces tier-based gating
- All decision points become candidates for interactive confirmation
- User Memory rules resume after mode deactivation

**Protocol precedence**: Default ordering places Syneidesis after Prothesis (gap detection applies within the established perspective). The user can override this default by explicitly requesting a different protocol first. Katalepsis is structurally last — it requires completed result (`R`), so it is not subject to ordering choices.

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Task completion | Auto-deactivate after final resolution |

### Plan Mode Integration

When combined with Plan mode, apply Syneidesis at **Phase boundaries**:

| Phase Transition | Gap Check Focus |
|------------------|-----------------|
| Planning → Implementation | Scope completeness, missing requirements |
| Phase N → Phase N+1 | Previous phase completion, dependency satisfaction |
| Implementation → Commit | Changed assumptions, deferred decisions |

**Cycle**: [Deliberation → Gap → Revision → Execution]
1. **Deliberation**: Plan mode analysis generates recommendations (Prothesis provides multi-perspective deliberation when active)
2. **Gap**: Syneidesis surfaces unconfirmed assumptions via AskUserQuestion
3. **Revision**: Integrate user response, re-evaluate if needed
4. **Execution**: Only after explicit scope confirmation

**Sequencing with Prothesis**: Following the default ordering, Prothesis completes perspective selection before Syneidesis applies gap detection. The cycle becomes: [Perspective Selection → Deliberation → Syneidesis → Revision → Execution]. The user can override this ordering by explicitly requesting Syneidesis first.

This cycle repeats per planning phase or domain area.

### Conditions

#### Essential (all must hold)

| Condition | Predicate | Test |
|-----------|-----------|------|
| **Committed action** | `committed(D)` | `∃ A : mutates_state(A) ∨ externally_visible(A) ∨ consumes_resource(A)` |
| **Observable gap** | `∃ G : observable(G)` | Concrete indicator exists in context (not speculation) |
| **Unaddressed** | `¬mentioned(G, context)` | Gap not already raised or resolved in session |

**Scope limitation**: `committed(D)` captures *execution commitment* (actions with immediate effects). It does not capture *direction commitment* — decisions that constrain future work without immediate state change (e.g., "let's use PostgreSQL", "refactor auth to OAuth2"). Direction commitment is partially covered by Plan Mode Integration, which applies Gap at phase boundaries where such decisions materialize into execution plans.

#### Modulating Factors (adjust intensity, not applicability)

| Factor | Effect | Heuristic signals |
|--------|--------|-------------------|
| **Irreversibility** | stakes ↑ | "delete", "push", "deploy", "migrate" |
| **Impact scope** | stakes ↑ | "all", "every", "entire", production, security |
| **Time pressure** | stakes ↑ (gap miss probability increases) | "quickly", "just", "right now" |
| **Uncertainty** | scan range ↑ | "maybe", "probably", "I think" |

#### Skip

- `¬committed(D)`: read-only, informational, exploratory actions
- User explicitly confirmed in current session
- Mechanical task (no judgment involved)
- User already mentioned the gap category

## Gap Taxonomy

| Type | Detection | Question Form |
|------|-----------|---------------|
| **Procedural** | Expected step absent from user's stated plan | "Was [step] completed?" |
| **Consideration** | Relevant factor not mentioned in decision | "Was [factor] considered?" |
| **Assumption** | Unstated premise inferred from framing | "Are you assuming [X]?" |
| **Alternative** | Known option not referenced | "Was [alternative] considered?" |

## Protocol

### Detection (Silent)

1. **Committed check**: Verify `committed(D)` — if false (read-only, exploratory), skip Gap for this decision point

2. **Gap scan**: Check taxonomy against user's stated plan

3. **Filter**: Surface only gaps with observable evidence (`observable(G)`) and not already addressed (`¬mentioned(G, context)`)

4. **Stakes assessment** (from modulating factors):
   - Irreversible + High impact → High stakes
   - Irreversible + Low impact → Medium stakes
   - Reversible + Any impact → Low stakes
   - Time pressure → stakes ↑ one level

### Surfacing

```
Format: "[Question]" (rationale: [1-line])
High-stakes: append "Anything else to verify?"
```

One gap per decision point.
Exception: Multiple high-stakes gaps → surface up to 2, prioritized by irreversibility.

### Resolution

| Response | Action | Adjustment |
|----------|--------|------------|
| Addresses | Proceed | Incorporate into plan/execution |
| Dismisses | Accept, no follow-up | Mark gap as user-reviewed; skip similar gaps |
| Silence (Low/Med stakes) | Proceed | Log gap for potential revisit |
| Silence (High stakes) | Wait | Block until explicit judgment |

### Gap Tracking

Record all detected gaps using TaskCreate for async tracking with dependencies.

| Phase | Task Operation |
|-------|----------------|
| Detection | TaskCreate for ALL detected gaps (status: `pending`) |
| Surfacing | TaskUpdate current gap to `in_progress` |
| Addressed | TaskUpdate to `completed` |
| Dismissed | TaskUpdate to `completed` (user authority) |
| New gap from response | TaskCreate → add to queue |

**Task format**:
```
TaskCreate({
  subject: "[Gap:Type] Question",
  description: "Rationale and context for this gap",
  activeForm: "Surfacing [Type] gap"
})
```

**Workflow**:
1. Detect ALL gaps → TaskCreate for each (batch registration)
2. TaskUpdate first gap to `in_progress`
3. Surface via AskUserQuestion
4. On response:
   - TaskUpdate to `completed`
   - Re-scan: if new gaps revealed → TaskCreate
   - TaskUpdate next pending gap to `in_progress`
5. Loop until: all tasks `completed` OR user ESC

**Dependencies**: Use `addBlockedBy` when gaps have logical dependencies (e.g., "backup location" blocked by "backup exists?").

**Convergence**: Mode terminates when task list shows all gaps `completed` or user explicitly exits.

### Interactive Surfacing (AskUserQuestion)

When Syneidesis is active, **call the AskUserQuestion tool** for:

**Do NOT surface gaps as plain text questions.** The tool call is mandatory—text-only surfacing is a protocol violation.

| Trigger | Action |
|---------|--------|
| Any confirmation needed | Present as structured options |
| High-stakes + multiple gaps | Present priority choices |
| Assumption gap | Always confirm (inference may be wrong) |
| Interpretive uncertainty | Ask whether gap exists before surfacing |
| Naming/structure decisions | Offer alternatives with rationale |

#### Batch Registration + Sequential Surfacing

**Workflow**:
1. Scan → detect ALL gaps at decision point
2. TaskCreate for each gap (batch registration, all `pending`)
3. TaskUpdate first gap to `in_progress`
4. AskUserQuestion for current gap
5. On response:
   - TaskUpdate to `completed`
   - Re-scan for newly revealed gaps → TaskCreate if found
   - TaskUpdate next `pending` to `in_progress`
6. Loop until: no `pending` tasks remain OR user ESC

**UX rationale**: Task list renders persistently in UI with progress indicator. User sees total gap count upfront. Dependencies visible via blocking relationships.

**Re-scan trigger**: User response may reveal new gaps (e.g., "Yes, backed up" → "Where?" precision gap). Always re-scan after each response.

### UI Mapping

| Environment | Addresses | Dismisses | Silence |
|-------------|-----------|-----------|---------|
| AskUserQuestion | Selection | Selection | — (N/A) |

Note: Esc key → unconditional loop termination (LOOP level). Silence (no response) is theoretical; AskUserQuestion blocks until response or Esc.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Reversible, low impact | "[X] confirmed?" |
| Medium | Reversible + high impact, OR Irreversible + low impact | "[X] reviewed? (rationale)" |
| Heavy | Irreversible + high impact | "Before proceeding, [X]? (rationale)" |

## Rules

1. **Question > Assertion**: Ask "was X considered?", never "you missed X"
2. **Batch registration**: Register ALL detected gaps via TaskCreate before surfacing any
3. **Observable evidence**: Surface only gaps with concrete indicators
4. **User authority**: Dismissal is final
5. **Minimal intrusion**: Lightest intervention that achieves awareness
6. **Stakes calibration**: Intensity follows stakes matrix above
7. **Convergence persistence**: Mode remains active until all gaps resolved or user ESC
8. **Dynamic discovery**: Re-scan after each response; new gaps → TaskCreate
9. **Gap dependencies**: Use task blocking when gaps have logical order
