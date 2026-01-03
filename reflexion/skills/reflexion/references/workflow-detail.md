# Reflexion Workflow Detail

Extended workflow documentation with examples from actual usage.

## Phase 1: Session Identification - Detail

### Locating Session Files

Session files follow the pattern:
```
~/.claude/projects/-Users-[username]-[escaped-path]/[session-id].jsonl
```

Path escaping rules:
- `/` → `-`
- Spaces → preserved
- Example: `/Users/choi/.claude/epistemic-protocols` → `-Users-choi--claude-epistemic-protocols`

### Identifying Relevant Sessions

When session ID not provided:
1. Ask user for context (project, timeframe, topic)
2. List recent sessions: `ls -lt ~/.claude/projects/[project-path]/*.jsonl | head -10`
3. Present options with timestamps

### Session File Structure

JSONL format - each line is a JSON object representing a conversation turn:
```json
{"type": "user", "content": "...", "timestamp": "..."}
{"type": "assistant", "content": "...", "tool_calls": [...]}
```

Files often exceed 500KB. Always delegate to subagent for analysis.

## Phase 2: Insight Extraction - Detail

### Extraction Mode

Based on Phase 1.5 mode selection:
- **Both (default)**: Run Content and Pattern extraction sequentially
- **Content only**: Run Content extraction only
- **Pattern only**: Run Pattern extraction only

### Content Extraction Prompt

```
Analyze the Claude Code session file at `[PATH]` to extract **Content-based insights**.

**Context**: This session relates to [TOPIC/PROJECT]. The file is ~[SIZE] JSONL format.

**Focus on**:
- Decisions explicitly stated with rationale
- Technical choices and trade-offs
- Facts discovered or established
- Solutions applied to problems

**Task**:
1. Read the session file in chunks (use offset/limit parameters)
2. Identify explicit decisions, stated rationale, and technical choices
3. Extract actionable insights with direct attribution

**Output format per insight**:
- **Type**: Content
- **Category**: (Prompt Design, Workflow Pattern, Technical Decision, etc.)
- **Confidence**: High
- **Insight**: Clear, concise statement
- **Evidence**: Direct quote or line reference
- **Suggested Memory Entry**: Compact, reusable form suitable for rules files
```

### Pattern Extraction Prompt

```
Analyze the Claude Code session file at `[PATH]` to extract **Pattern-based insights**.

**Context**: This session relates to [TOPIC/PROJECT]. The file is ~[SIZE] JSONL format.

**Focus on**:
- Recurring behaviors (2+ instances)
- Implicit preferences (consistent choices without justification)
- Interaction patterns (communication style, delegation tendencies)
- Adjustment moments (behavior changes without stated reason)

**Task**:
1. Read the session file in chunks (use offset/limit parameters)
2. Identify repeated behaviors and implicit preferences
3. Count instances to determine confidence level

**Output format per insight**:
- **Type**: Pattern
- **Category**: (Communication, Workflow Pattern, Tool Usage, etc.)
- **Confidence**: High (5+ instances) / Medium (3-4 instances) / Low (2 instances)
- **Insight**: Clear, concise statement in dispositional form
- **Evidence**: List of instances (e.g., "Lines 45, 120, 340")
- **Suggested Memory Entry**: Compact, reusable form suitable for rules files
```

### Chunking Strategy for Large Files

For files >500KB:
- Read in 2000-line chunks
- Focus on assistant responses (contain decisions and reasoning)
- Look for tool call patterns and their outcomes

## Phase 3: Insight Review - Detail

### Presentation Format

```markdown
## Session Analysis: [Topic]

| # | Category | Insight | Target File |
|---|----------|---------|-------------|
| 1 | Prompt Design | [summary] | design.md |
| 2 | Workflow | [summary] | delegation.md |

### Insight Details

#### 1. [Category]: [Title]

**Insight**: [Full statement]

**Context**: [How discovered]

**Suggested Entry**:
```
[Formatted for rules file]
```

**Target**: `[file.md]` - [section]
```

### Conflict Detection

Check against existing rules:
1. Read target file
2. Search for related concepts
3. Identify potential conflicts or redundancies
4. Flag for user review if conflict detected

## Phase 3.5: Redundancy and Alignment Check - Detail

**Executor**: Main agent only (subagents cannot introspect tool descriptions).

### Process

1. For each extracted insight, compare against known tool behavioral directives:
   - TodoWrite: task state constraints, completion rules
   - Edit/Write: file operation constraints
   - Bash: command restrictions, safety rules
   - Task: delegation patterns

2. Check for redundancy (semantic equivalence with tool description)

3. Check for alignment (quick heuristic):
   - Does insight reinforce system prompt intent? → ALIGNED
   - Is insight orthogonal (no conflict, no reinforcement)? → NEUTRAL
   - Does insight need further review? → UNCLEAR

4. Output table:
   ```
   | # | Insight | Redundancy | Alignment | Note |
   |---|---------|------------|-----------|------|
   | 1 | ... | REDUNDANT | - | TodoWrite already enforces |
   | 2 | ... | - | ALIGNED | Reinforces delegation model |
   | 3 | ... | - | NEUTRAL | Novel pattern, no conflict |
   | 4 | ... | - | UNCLEAR | Uses different vocabulary |
   ```

### Presenting Flagged Insights

- **REDUNDANT**: Source tool description quoted, recommend "Consider excluding"
- **NEUTRAL/UNCLEAR**: Recommend "Consider validating empirically"
- User options: Apply now / Exclude / Document only / Apply as experimental

## Phase 4: User Selection - Detail

### AskUserQuestion Patterns

**Selection question**:
```
Question: "Which insights to apply to user memory?"
Options:
- "All [N] insights" - Apply all extracted insights
- "Core [M] only" - Apply recommended subset
- "Specify by number" - Manual selection
```

**Location question**:
```
Question: "Where to store insights?"
Options:
- "[target].md (recommended)" - Best matching existing file
- "New rules file" - Create new file in ~/.claude/rules/
- "Project CLAUDE.md" - Project-specific memory
```

### Memory Scope Decision

Apply Memory Scope Design principle before location selection:

| Insight Characteristic | Recommended Location |
|------------------------|----------------------|
| Tool-agnostic principle | User memory (`~/.claude/rules/`) |
| Tool-specific implementation | Project memory (`.claude/rules/`) |
| Domain-specific (tool names, project paths) | Project memory |
| Universal pattern (applies to all projects) | User memory |
| Session-scoped (unvalidated, experimental) | Verbal acknowledgment only (no file write) |

### Pattern Validation Gate

For Pattern insights with Medium or Low confidence:

1. Present: "Pattern suggests [X]. Based on [N] instances. Accurate?"
2. Options:
   - **Confirm**: Proceed to integration
   - **Reject**: Exclude from integration
   - **Defer**: Document only, re-evaluate later

Only High-confidence patterns or user-confirmed patterns proceed to Phase 5.
Low-confidence patterns are documented only, never applied.

### Syneidesis Integration

When Syneidesis is active, surface gaps:
- "Was [existing rule] considered? This insight may conflict."
- "Is [insight] validated enough for permanent memory? (rationale: emerged from single session)"

## Phase 5: Integration - Detail

### Edit Patterns

**Adding new section**:
```markdown
## [New Section Name]

[Insight in imperative form]

- [Bullet point if multiple sub-items]
```

**Adding to existing section**:
```markdown
## Existing Section

[Existing content]

[New insight added at end]
```

### Consistency Checks

Before editing, verify:

1. **Directive Strength Hierarchy**
   - Tool invocations use `call` (strongest)
   - Protocol contexts use `invoke`
   - Never use `use` for tool calls

2. **Writing Style**
   - Imperative form: "Do X" not "You should do X"
   - Concise: One concept per bullet
   - No redundancy with existing content

3. **Structural Fit**
   - Insight matches section purpose
   - Level of detail consistent with file

## Phase 6: Documentation - Detail

### Insight Document Template

```markdown
# [Topic] Session Analysis

- **Session ID**: `[full-id]`
- **Date**: [YYYY-MM-DD]
- **Context**: [Brief description of session purpose]

## Applied Insights

### 1. [Title] → `[target].md`

**Insight**: [Statement]

**Context**: [Discovery context]

## Deferred Insights

### [Title]

**Insight**: [Statement]

**Deferral Reason**: [Why not applied now]

**Re-evaluation Condition**: [When to reconsider]

**Tension**: [Any conflicts with existing rules]

## Other Insights (Not Applied)

| Insight | Reason for Exclusion |
|---------|---------------------|
| [Summary] | [Low generalizability / Already covered / etc.] |

## References

- Session file: `[path]`
- Related sessions: [if any]
```

### Naming Convention

```
~/.claude/docs/insights/YYYY-MM-DD-[topic-slug].md
```

Topic slug: lowercase, hyphens, 2-4 words
- `prothesis-failure-analysis`
- `delegation-patterns`
- `prompt-design-learnings`

## Example: Complete Workflow

### Input
```
User: "Reflect on session 8561885b-fa37-4206-8a61-570257980e7f"
```

### Phase 1 Output
```
Session file located: ~/.claude/projects/-Users-choi--claude-epistemic-protocols/8561885b-fa37-4206-8a61-570257980e7f.jsonl
Size: 774KB
```

### Phase 2 Output
```
Extracted 8 insights:
1. Attention-Action Gap (LLM Behavior)
2. Directive Strength Hierarchy (Prompt Design)
3. Negative Constraints (Prompt Design)
...
```

### Phase 3 Output
```
| # | Category | Insight | Target | Conflict |
|---|----------|---------|--------|----------|
| 1 | LLM Behavior | Attention-Action Gap | design.md | None |
| 2 | Prompt Design | call > invoke > use | design.md | None |
| 3 | Prompt Design | Negative constraints | design.md | Tension with Absence over Deprecation |
```

### Phase 4 Interaction
```
AskUserQuestion:
- "Which insights?" → "Core 3 only"
- "Where?" → "design.md, delegation.md"
- Syneidesis: "#3 conflicts with existing rule - defer?"→ "Yes, defer"
```

### Phase 5 Edits
```
Edit design.md: Added Directive Strength Hierarchy, Attention-Action Gap
Edit delegation.md: Added Context Acquisition (Phase 0)
```

### Phase 6 Document
```
Created: ~/.claude/docs/insights/2025-12-27-prothesis-failure-analysis.md
- 3 applied insights documented
- 1 deferred insight with re-evaluation condition
- 4 other insights with exclusion reasons
```
