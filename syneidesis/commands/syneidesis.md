# Syneidesis Protocol

Surface potential gaps at decision points through questions, enabling user to notice what might otherwise remain unnoticed.

## Definition

**Syneidesis** (συνείδησις): A dialogical act of surfacing potential gaps—procedural, consideration, assumption, or alternative—at decision points, transforming unknown unknowns into questions the user can evaluate.

```
Syneidesis(D, G₁...Gₙ) → Q(Gₖ) → J → A(J, D) → Σ'

D   = Decision point ∈ Stakes × Uncertainty
Gₖ  = Selected gaps (k ≤ 2)
Q   = Question formation (assertion-free)
J   = Judgment ∈ {Addresses(c), Dismisses, Silence}
A   = Adjustment: J × D → Σ'
Σ   = State { reviewed: Set, deferred: List, blocked: Bool }

── ADJUSTMENT RULES ──
A(Addresses(c), _) = Σ { plan ← incorporate(c) }
A(Dismisses, _)    = Σ { reviewed ← reviewed ∪ {Gₖ.type} }
A(Silence, d)      = match stakes(d):
                       Low|Med → Σ { deferred ← Gₖ :: deferred }
                       High    → Σ { blocked ← true }

── CONTINUATION ──
proceed(Σ) = ¬blocked(Σ)
```

## Core Principle

**Surfacing over Deciding**: AI makes visible; user judges.

## Mode Activation

### Priority

When active, this protocol **supersedes** Decision Tiering rules.

- Expands AskUserQuestion usage beyond "Irreversible" decisions
- All decision points become candidates for interactive confirmation
- General instructions resume after mode deactivation

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Task completion | Auto-deactivate after final resolution |
| User dismisses 2+ consecutive gaps | Reduce intensity for session |

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

### Interactive Surfacing (AskUserQuestion)

When Syneidesis is active, use AskUserQuestion tool (not text questions) for:

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
