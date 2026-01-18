---
name: syneidesis
description: Gap surfacing before decisions. Raises procedural, consideration, assumption, and alternative gaps as questions to transform unknown unknowns into known considerations.
user-invocable: true
---

# Syneidesis Protocol

Surface potential gaps at decision points through questions, enabling user to notice what might otherwise remain unnoticed.

## Definition

**Syneidesis** (συνείδησις): A dialogical act of surfacing potential gaps—procedural, consideration, assumption, or alternative—at decision points, transforming unknown unknowns into questions the user can evaluate.

```
Syneidesis(D, Σ) → Scan(D) → G → Sel(G, D) → Gₛ → Q(Gₛ) → J → A(J, D, Σ) → Σ'

D      = Decision point ∈ Stakes × Context
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

── PHASE TRANSITIONS ──
Phase 0: D → Scan(D) → G                            -- detection (silent)
Phase 1: G → Sel(G, D) → Gₛ → Q[AskUserQuestion](Gₛ) → await → J   -- Q: extern
Phase 2: J → A(J, D, Σ) → Σ'                        -- internal adjustment

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
Q (extern)     → AskUserQuestion tool (mandatory; Escape → Silence)
Σ (state)      → TodoWrite (Observable, UI-visible gap tracking)
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

**On activation**: Check existing TodoWrite for deferred gaps (prefix `[Gap:`). Resume tracking if found.

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

**Dual-activation precedence**: When both Prothesis and Syneidesis are active, Prothesis executes first (perspective selection gates subsequent analysis). Syneidesis applies to decision points within the established perspective.

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Task completion | Auto-deactivate after final resolution |
| User dismisses 2+ consecutive gaps | Reduce intensity for session |

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

**Sequencing with Prothesis**: When both active, Prothesis completes perspective selection before Syneidesis applies gap detection. The cycle becomes: [Perspective Selection → Deliberation → Gap → Revision → Execution].

This cycle repeats per planning phase or domain area.

### Triggers

| Signal | Examples |
|--------|----------|
| Scope | "all", "every", "entire" |
| Irreversibility | "delete", "push", "deploy", "migrate" |
| Time compression | "quickly", "just", "right now" |
| Uncertainty | "maybe", "probably", "I think" |
| Stakes | production, security, data, external API |

**Skip**:
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

1. **Stakes assessment**:
   - Irreversible + High impact → High stakes
   - Irreversible + Low impact → Medium stakes
   - Reversible + Any impact → Low stakes

2. **Gap scan**: Check taxonomy against user's stated plan

3. **Filter**: Surface only gaps with observable evidence (not speculation)

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

Record detected gaps using TodoWrite to prevent context loss across decision points.

| Phase | TodoWrite Operation |
|-------|---------------------|
| Detection | Add `[Gap:Type] question` as `in_progress` |
| Addressed | Mark `completed` |
| Dismissed | Mark `completed` (user authority) |
| Deferred | Change to `pending` for later revisit |

**Format**: `[Gap:Procedural|Consideration|Assumption|Alternative] Question`

**Workflow**:
1. Detect gap → `TodoWrite([{content: "[Gap:Assumption] Database backup verified?", status: "in_progress"}])`
2. Surface via AskUserQuestion
3. On response → update status, proceed or defer
4. Multiple gaps → track all, surface sequentially (one `in_progress` at a time)

**Resumption**: Deferred gaps (`pending`) resurface at next relevant decision point or session end.

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

#### Sequential Surfacing

**Workflow**:
1. Call TodoWrite with all detected gaps (status: `pending`)
2. Mark first gap as `in_progress`
3. Call AskUserQuestion for current gap
4. On response: mark `completed`, advance to next `pending`
5. Repeat until all addressed or user signals completion

**UX rationale**: TodoWrite renders persistently in UI, providing immediate gap visibility. Early termination when few gaps exist.

### UI Mapping

| Environment | Addresses | Dismisses | Silence |
|-------------|-----------|-----------|---------|
| AskUserQuestion | Selection | Selection | Esc key |

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Reversible, low impact | "[X] confirmed?" |
| Medium | Reversible + high impact, OR Irreversible + low impact | "[X] reviewed? (rationale)" |
| Heavy | Irreversible + high impact | "Before proceeding, [X]? (rationale)" |

## Rules

1. **Question > Assertion**: Ask "was X considered?", never "you missed X"
2. **One gap per point**: Exception for multiple high-stakes (max 2)
3. **Observable evidence**: Surface only gaps with concrete indicators
4. **User authority**: Dismissal is final
5. **Minimal intrusion**: Lightest intervention that achieves awareness
6. **Stakes calibration**: Intensity follows stakes matrix above
7. **Session Persistence**: Mode remains active until session end
8. **Gap Persistence**: Record all detected gaps via TodoWrite; deferred gaps must not be lost
