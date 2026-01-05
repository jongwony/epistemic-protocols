# Worked Example: Session Reflection

Complete example of the reflect workflow from session input to documented insights.

## Scenario

User requests reflection on a session about Claude Code plugin development.

```
User: "Reflect on session 8561885b-fa37-4206-8a61-570257980e7f"
```

---

## Phase 1: Session Identification

**TodoWrite Initialization**:
```
TodoWrite([
  {content: "Detect session context", activeForm: "Detecting session context", status: "in_progress"},
  {content: "Extract insights (parallel)", activeForm: "Extracting insights", status: "pending"},
  {content: "Guide insight selection", activeForm: "Guiding insight selection", status: "pending"},
  {content: "Integrate selected insights", activeForm: "Integrating insights", status: "pending"},
  {content: "Verify and cleanup", activeForm: "Verifying completion", status: "pending"}
])
```

**Action**: Locate session file

```
Session file: ~/.claude/projects/-Users-choi--claude-epistemic-protocols/8561885b-fa37-4206-8a61-570257980e7f.jsonl
Size: 774KB
Topic: Plugin development, protocol implementation
```

**Output**: Session file confirmed, size indicates subagent delegation needed.

**Phase Transition**:
```
TodoWrite([
  {content: "Detect session context", status: "completed", ...},
  {content: "Extract insights (parallel)", status: "in_progress", ...},
  ...
])
```

---

## Phase 2: Insight Extraction

**Action**: Delegate to 3 parallel subagents with `run_in_background: true`

**Content Extraction Output** (`/tmp/.reflexion/{session-id}/extracted-insights.md`):

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

**Phase Transition**:
```
TodoWrite([
  {content: "Detect session context", status: "completed", ...},
  {content: "Extract insights (parallel)", status: "completed", ...},
  {content: "Guide insight selection", status: "in_progress", ...},
  ...
])
```

---

## Phase 3: Insight Review + User Selection

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

**Q1: Summary Validation**:

```
"Does this summary look correct?"
├── "Yes, correct"  ← Selected
├── "Needs modification"
└── "Skip summary"
```

**Q2: Insight Selection** (AskUserQuestion with multiSelect: true):

```
"Which insights should be saved?"
├── [1] Attention-Action Gap  ← Selected
├── [2] Directive Strength Hierarchy  ← Selected
├── [3] Context Acquisition Phase  ← Selected
├── [4] Negative Constraint Avoidance
├── [5] Verification Before Action
└── "None (skip saving)"
```

**Syneidesis gap surfaced**:
> "Pattern #4 overlaps with 'Absence over Deprecation'. Was this considered?"
> User response: "Yes, already excluded"

**Q5: Storage Location**:

```
"Where to store?"
├── "design.md + delegation.md (recommended)"  ← Selected
├── "New rules file"
└── "Project CLAUDE.md"
```

**Phase Transition**:
```
TodoWrite([
  ...,
  {content: "Guide insight selection", status: "completed", ...},
  {content: "Integrate selected insights", status: "in_progress", ...},
  ...
])
```

---

## Phase 4: Integration

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

**Phase Transition**:
```
TodoWrite([
  ...,
  {content: "Integrate selected insights", status: "completed", ...},
  {content: "Verify and cleanup", status: "in_progress", ...}
])
```

---

## Phase 5: Verification

**AskUserQuestion**:

```
"Complete. Any additional actions needed?"
├── "Analyze another session"
├── "Review related rules"
└── "Done"  ← Selected
```

**Cleanup**: `rm -rf /tmp/.reflexion/8561885b-fa37-4206-8a61-570257980e7f/`

**Phase Completion**:
```
TodoWrite([
  {content: "Detect session context", status: "completed", ...},
  {content: "Extract insights (parallel)", status: "completed", ...},
  {content: "Guide insight selection", status: "completed", ...},
  {content: "Integrate selected insights", status: "completed", ...},
  {content: "Verify and cleanup", status: "completed", ...}
])
```

---

## Summary

| Phase | Duration | Output |
|-------|----------|--------|
| 1. Session Identification | Immediate | Session file located, TodoWrite initialized |
| 2. Insight Extraction | Subagent | 3 Content + 2 Pattern insights extracted |
| 3. Insight Review + Selection | Interactive | 3 Content approved, 2 Pattern excluded |
| 4. Integration | 2 edits | design.md, delegation.md updated |
| 5. Verification | Interactive | Cleanup completed |

**Result**: 3 Content insights integrated into user memory, workflow tracked via TodoWrite throughout.
