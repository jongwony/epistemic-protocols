# Worked Example: Session Reflection

Complete example of the reflect workflow from session input to documented insights.

## Scenario

User requests reflection on a session about Claude Code plugin development.

```
User: "Reflect on session 8561885b-fa37-4206-8a61-570257980e7f"
```

---

## Phase 1: Session Identification

**Action**: Locate session file

```
Session file: ~/.claude/projects/-Users-choi--claude-epistemic-protocols/8561885b-fa37-4206-8a61-570257980e7f.jsonl
Size: 774KB
Topic: Plugin development, protocol implementation
```

**Output**: Session file confirmed, size indicates subagent delegation needed.

---

## Phase 1.5: Extraction Mode Selection

**AskUserQuestion invocation**:

```
Question: "Which extraction mode?"
Options:
- "Both (default)" - Content + Pattern extraction  ← Selected
- "Content only" - Explicit decisions and facts
- "Pattern only" - Recurring behaviors and preferences
```

---

## Phase 2: Insight Extraction

**Action**: Delegate to general-purpose subagent with Content and Pattern extraction prompts

**Content Extraction Output**:

```markdown
## Content-Based Insights

### 1. Attention-Action Gap
- **Type**: Content
- **Category**: LLM Behavior
- **Confidence**: High
- **Insight**: LLMs may understand constraints but still violate them under task-completion momentum
- **Evidence**: "Observed when Claude acknowledged 'never skip hooks' but then used --no-verify" (line 342)
- **Suggested Entry**: "Attention-Action Gap: Understanding ≠ Execution. Task-completion momentum overrides procedural constraints."

### 2. Directive Strength Hierarchy
- **Type**: Content
- **Category**: Prompt Design
- **Confidence**: High
- **Insight**: Verb choice affects instruction binding strength
- **Evidence**: "'use' was interpreted functionally; 'call' was interpreted literally" (lines 156, 178)
- **Suggested Entry**: "Tool invocation verbs by binding strength: `call` (strongest) > `invoke` > `use` (weakest)"

### 3. Context Acquisition Phase
- **Type**: Content
- **Category**: Workflow Pattern
- **Confidence**: High
- **Insight**: Some tasks need explicit context gathering before delegation
- **Evidence**: "Subagent failed because it lacked context that main agent had" (line 420)
- **Suggested Entry**: "Before delegation, explicit context gathering may be needed. Model as: G(U) → C"
```

**Pattern Extraction Output**:

```markdown
## Pattern-Based Insights

### 4. Negative Constraint Avoidance
- **Type**: Pattern
- **Category**: Prompt Design
- **Confidence**: Medium (3 instances)
- **Insight**: User tends to prefer positive framing over negative constraints
- **Evidence**: Lines 45, 120, 340 - User rewrote "don't skip hooks" to "always run hooks" three times
- **Suggested Entry**: "Prefer positive framing. Convert 'don't X' to 'always Y' where possible."

### 5. Verification Before Action
- **Type**: Pattern
- **Category**: Communication
- **Confidence**: Low (2 instances)
- **Insight**: User prefers explicit verification prompts before irreversible actions
- **Evidence**: Lines 89, 456 - User asked "are you sure?" before file deletions
- **Suggested Entry**: "Prompt for confirmation before irreversible operations."
```

---

## Phase 3: Insight Review

**Presentation to user**:

| # | Type | Category | Insight | Confidence | Evidence | Target | Conflict |
|---|------|----------|---------|------------|----------|--------|----------|
| 1 | Content | LLM Behavior | Attention-Action Gap | High | Quote | design.md | None |
| 2 | Content | Prompt Design | call > invoke > use | High | Quote | design.md | None |
| 3 | Content | Workflow | Context Acquisition | High | Quote | delegation.md | None |
| 4 | Pattern | Prompt Design | Positive framing preference | Medium | 3 instances | design.md | **Tension** |
| 5 | Pattern | Communication | Verification before action | Low | 2 instances | communication.md | None |

**Conflict detected for #4**:
- Existing rule: "Absence over Deprecation" (remove mentions entirely)
- New insight: "Prefer positive framing" (similar but from different angle)
- Assessment: Complementary, not contradictory

---

## Phase 4: User Selection

**Pattern Validation Gate**:

```
Pattern #4 (Medium confidence): "User tends to prefer positive framing"
Based on 3 instances. Accurate?
Options:
- "Confirm" - Proceed to integration
- "Reject" - Exclude from integration
- "Defer" - Document only  ← Selected

Pattern #5 (Low confidence): "User prefers verification before action"
Based on 2 instances. Low confidence - documenting only.
```

**AskUserQuestion invocation**:

```
Question: "Which insights to apply?"
Options:
- "All 3 Content + 0 Pattern (remaining after validation)"
- "Core 3 Content only (recommended)"  ← Selected
- "Specify by number"
```

**Syneidesis gap surfaced**:
> "Pattern #4 overlaps with 'Absence over Deprecation'. Was this considered?"
> User response: "Yes, already deferred"

**AskUserQuestion for location**:

```
Question: "Where to store?"
Options:
- "design.md + delegation.md (recommended)"  ← Selected
- "New rules file"
- "Project CLAUDE.md"
```

---

## Phase 5: Integration

**Edit 1**: `~/.claude/rules/design.md`

```markdown
## Attention-Action Gap

Understanding ≠ Execution. Task-completion momentum overrides procedural constraints.

Mitigation: Blocking mechanisms before task entry (not just instructions).

## Directive Strength Hierarchy

Tool invocation verbs by binding strength:
- `call` (strongest): technical capture, zero polysemy
- `invoke`: formal protocol context
- `use` (weakest): admits functional interpretation

When literal tool execution required → prefer `call`.
```

**Edit 2**: `~/.claude/rules/delegation.md`

```markdown
## Context Acquisition (Phase 0)

Before delegation, explicit context gathering may be needed:
- Model as: `G(U) → C` (Gather from underspecified → Context)
- Boundary: purpose-based (acquisition vs interpretation)
- Perspectives derive from context: `P(C)`
```

---

## Phase 6: Documentation

**Created**: `~/.claude/docs/insights/2025-12-18-prothesis-failure-analysis.md`

```markdown
# Prothesis Failure Analysis

- **Session ID**: `8561885b-fa37-4206-8a61-570257980e7f`
- **Date**: 2025-12-18
- **Context**: Plugin development session where commit hooks were bypassed

## Applied Insights (Content)

### 1. Attention-Action Gap → `design.md`

**Type**: Content | **Confidence**: High

**Insight**: Task-completion momentum overrides procedural constraints

**Evidence**: Quote from line 342

### 2. Directive Strength Hierarchy → `design.md`

**Type**: Content | **Confidence**: High

**Insight**: `call` > `invoke` > `use` for binding strength

**Evidence**: Quotes from lines 156, 178

### 3. Context Acquisition → `delegation.md`

**Type**: Content | **Confidence**: High

**Insight**: Pre-delegation context gathering phase

**Evidence**: Quote from line 420

## Deferred Insights (Pattern)

### Positive Framing Preference

**Type**: Pattern | **Confidence**: Medium (3 instances)

**Insight**: User tends to prefer positive framing over negative constraints

**Evidence**: Lines 45, 120, 340

**Deferral Reason**: Overlaps with existing "Absence over Deprecation"

**Re-evaluation Condition**: If future sessions show gap between these concepts

### Verification Before Action

**Type**: Pattern | **Confidence**: Low (2 instances)

**Insight**: User prefers explicit verification before irreversible actions

**Evidence**: Lines 89, 456

**Deferral Reason**: Low confidence - insufficient instances for pattern validation

**Re-evaluation Condition**: If 3+ additional instances observed in future sessions

## Other Insights (Not Applied)

| Insight | Type | Reason for Exclusion |
|---------|------|---------------------|
| "Use detailed prompts for complex tasks" | Content | Too generic, already implied |
| "Check session file size before reading" | Content | Implementation detail, not principle |
```

---

## Summary

| Phase | Duration | Output |
|-------|----------|--------|
| Identification | Immediate | Session file located |
| Mode Selection | Interactive | Both (Content + Pattern) selected |
| Extraction | Subagent | 3 Content + 2 Pattern insights extracted |
| Review | Presented | 1 conflict identified |
| Pattern Validation | Interactive | 1 Pattern deferred, 1 Low confidence documented only |
| Selection | Interactive | 3 Content approved |
| Integration | 2 edits | design.md, delegation.md updated |
| Documentation | 1 file | Insights document created |

**Result**: 3 Content insights integrated into user memory, 2 Pattern insights deferred with re-evaluation conditions.
