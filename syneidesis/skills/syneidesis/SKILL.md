---
name: syneidesis
description: Surface potential gaps before decisions. Raises procedural, consideration, assumption, and alternative gaps as questions.
user-invocable: true
---

# Syneidesis Protocol

Surface potential gaps at decision points through questions, enabling user to notice what might otherwise remain unnoticed.

## Definition

**Syneidesis** (συνείδησις): A dialogical act of surfacing potential gaps—procedural, consideration, assumption, or alternative—at decision points, transforming unknown unknowns into questions the user can evaluate.

```
Syneidesis(D) → Scan(D, Σ₀) → G → Sel(G, D) → Gₛ → Q(Gₛ) → J → A(J, D, Σ) → Σ'
                                                                -- Σ₀ = initial empty state

D      = Decision point ∈ Stakes × Context
Stakes = {Low, Med, High}
G      = Gap ∈ {Procedural, Consideration, Assumption, Alternative}
Scan   = Detection: D × Σ → Set(G)                  -- gap identification (Σ₀ = empty state)
Sel    = Selection: Set(G) × D → Option(Gₛ)         -- prioritize by stakes; None if G empty
Gₛ     = Selected gaps (|Gₛ| ≤ 2)
Q      = Question formation (assertion-free)
J      = Judgment ∈ {Addresses(c), Dismisses, Silence}
c      = Clarification (user-provided response to Q)
A      = Adjustment: J × D × Σ → Σ'
Σ      = State { reviewed: Set(GapType), deferred: List(G), blocked: Bool }

── PHASE TRANSITIONS ──
Phase 0: D → Scan(D, ∅) → G                         -- detection (silent, initial scan)
Phase 1: G → Sel(G, D) → match { Some(Gₛ) → Q(Gₛ) → await → J; None → skip }  -- call AskUserQuestion if gaps exist
Phase 2: J → A(J, D, Σ) → Σ'                        -- adjustment

── ADJUSTMENT RULES ──
A(Addresses(c), _, σ) = σ { incorporate(c) }        -- extern: modifies plan
A(Dismisses, _, σ)    = σ { reviewed ← reviewed ∪ {Gₛ.type} }

incorporate: Clarification → State → State
incorporate(c)(σ) = σ { context ← context ⊕ c, reviewed ← reviewed ∪ {Gₛ.type} }
-- clarification merges into context; gap marked reviewed
A(Silence, d, σ)      = match stakes(d):
                          Low|Med → σ { deferred ← Gₛ :: deferred }
                          High    → σ { blocked ← true }

── SELECTION RULE ──
Sel: Set(G) × D → Option(Gₛ)
Sel(G, d) = match |G| {
              0 → None
              _ → Some(take(priority_sort(G, stakes(d)), min(|G|, if stakes(d) = High then 2 else 1)))
            }

── CONTINUATION ──
proceed(Σ) = ¬blocked(Σ)

── DYNAMIC DISCOVERY ──
After A (Adjustment):
  Σ' = A(J, D, Σ)                      -- updated state
  G' = Scan(D, Σ')                     -- re-scan with updated state
  G  = G' \ reviewed(Σ')               -- exclude already-reviewed gaps
  if |G| > 0 ∧ progress(G, Σ, Σ'):
    → Phase 1 (Sel → Q → J → A)        -- continue loop

── TERMINATION (Hybrid) ──
progress(G, Σ, Σ') = ¬cycle(G) ∧ Δ(Σ, Σ') > 0

cycle(G) = sig(G) ∈ History
sig(G) = hash(type(G), subject(G), context(G))
History = { sig(g) | g ∈ resolved_gaps }

Δ(Σ, Σ') = |addressed(Σ')| - |addressed(Σ)|  -- progress delta

Terminate when:
  cycle(G)           → "This gap was already addressed"
  Δ = 0 for 2 rounds → "No progress; rephrase or proceed?"

── MODE STATE ──
Λ = { phase: Phase, state: Σ, iterations: ℕ, active: Bool }
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

**Domain overlap**: When Prothesis is also active, supersession domains are independent.
Prothesis gates analysis; Syneidesis gates decisions. Execution order (Prothesis → Syneidesis)
ensures no conflict: perspective established before decision evaluation begins.

- Stakes Assessment replaces tier-based gating
- All decision points become candidates for interactive confirmation
- User Memory rules resume after mode deactivation

**Protocol precedence** (multi-activation order): Hermeneia → Prothesis → Syneidesis

| Active Protocols | Execution Order | Rationale |
|------------------|-----------------|-----------|
| Prothesis + Syneidesis | Prothesis → Syneidesis | Perspective selection gates analysis |
| Hermeneia + Syneidesis | Hermeneia → Syneidesis | Clarified intent informs gap detection |
| All three active | Hermeneia → Prothesis → Syneidesis | Intent → Perspective → Decision gaps |

Syneidesis applies to decision points after intent and perspective are established.

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Task completion | Auto-deactivate after final resolution (differs from Prothesis—see note) |
| User dismisses 2+ consecutive gaps | Reduce intensity for session |

**Session lifetime note**: Syneidesis deactivates on task completion (gaps are task-scoped),
while Prothesis persists until session end (lens applies across tasks). This is intentional:
perspectives span topics; gaps are decision-specific.

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

### Dynamic Discovery

After each resolution, re-scan the decision context for newly surfaced gaps:

1. **Incorporate answer**: Update state Σ with user's response
2. **Re-scan**: Apply gap taxonomy to updated context (including answer implications)
3. **Filter**: Exclude gaps already in `reviewed` set
4. **Progress check**: Continue only if `progress(Σ, Σ') = true` (no cycle, Δ > 0)
5. **Queue new gaps**: Add discovered gaps to TodoWrite as `pending`

**Discovery triggers**:
- User answer reveals new scope ("all files" → "including hidden?")
- Answer creates new assumption ("I'll use the API" → "rate limits considered?")
- Clarification shifts context ("actually, it's production" → stakes escalation)

**Termination conditions** (Hybrid strategy):
| Condition | Detection | Action |
|-----------|-----------|--------|
| Cycle | `sig(G) ∈ History` | "This gap was already addressed" |
| Progress stall | `Δ = 0` for 2 rounds | "No progress; rephrase or proceed?" |
| User exit | Esc/interrupt | Native Claude Code behavior |

**Gap signature**: `sig(G) = hash(type, subject, context)` prevents semantic repetition, not just syntactic.

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
7. **Task-Scoped Persistence**: Mode remains active until task completion (differs from Prothesis—see Mode Deactivation)
8. **Gap Persistence**: Record all detected gaps via TodoWrite; deferred gaps must not be lost
