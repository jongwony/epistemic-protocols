# Subagent Prompts

Detailed prompts for Phase 2 parallel extraction subagents.

## Overview

Phase 2 launches 3 Task subagents in parallel with `run_in_background: true`. Each subagent writes output to `/tmp/.reflexion/{session-id}/` for main agent handoff.

## session-summarizer

**Purpose**: Generate concise session summary for user validation (Q1).

```
Read the Claude Code session file at `{session_path}`.

**Context**: JSONL format, each line is a conversation turn. File may exceed 500KB.

**Task**:
1. Read session file in chunks (use offset/limit parameters for large files)
2. Identify the main task, key decisions, and notable interactions
3. Generate a 3-5 sentence summary

**Focus on**:
- Main task or goal accomplished
- Key decisions made with their rationale
- Notable tool usage patterns
- Any blockers encountered and how resolved

**Output**:
Write to `/tmp/.reflexion/{session-id}/session-summary.md`

Format:
```markdown
## Session Summary

[3-5 sentence summary in past tense]

**Main Task**: [one-line description]
**Key Decisions**: [bullet list if multiple]
**Duration**: [approximate based on message count]
```

Do not include frontmatter. Plain markdown only.
```

## insight-extractor

**Purpose**: Extract actionable insights with evidence for user selection (Q2).

```
Analyze the Claude Code session file at `{session_path}` to extract actionable insights.

**Context**: JSONL format. Focus on assistant responses (contain decisions and reasoning).

**Task**:
1. Read session file in chunks (use offset/limit parameters)
2. Identify explicit decisions, recurring patterns, and implicit preferences
3. Extract insights with direct attribution

**Insight Types**:

| Type | Detection | Confidence |
|------|-----------|------------|
| Content | Explicit decision with stated rationale | High |
| Pattern | Recurring behavior (3+ instances) | High if 5+, Medium if 3-4, Low if 2 |
| Implicit | Consistent choice without justification | Medium |

**Focus on**:
- Decisions explicitly stated with rationale (Content)
- Technical choices and trade-offs (Content)
- Recurring behaviors across the session (Pattern)
- Implicit preferences (consistent choices without justification) (Implicit)
- Interaction patterns (communication style, delegation tendencies) (Pattern)

**Output**:
Write to `/tmp/.reflexion/{session-id}/extracted-insights.md`

Format per insight:
```markdown
## Extracted Insights

### 1. [Category]: [Title]

**Type**: Content | Pattern | Implicit
**Confidence**: High | Medium | Low
**Insight**: [Clear, concise statement in imperative form]
**Evidence**: "[Direct quote]" (line ~N) OR "Lines N, M, P" for patterns
**Suggested Memory Entry**: [Compact form suitable for rules file]
**Recommended Target**: [e.g., delegation.md, preferences.md, CLAUDE.md]
```

Include all insights found. Main agent will present for user selection.
Minimum 3 insights, maximum 10. Prioritize by confidence level.
```

## knowledge-finder

**Purpose**: Find related existing knowledge for merge decisions (Q4).

```
Search for knowledge related to the session insights in User/Project memory.

**Paths to search**:
- `{user_memory_path}/CLAUDE.md`
- `{user_memory_path}/rules/*.md`
- `{user_memory_path}/.insights/**/*.md`
- `{project_memory_path}/CLAUDE.md` (if project mode)
- `{project_memory_path}/rules/*.md` (if project mode)
- `{project_memory_path}/.insights/**/*.md` (if project mode)

**Task**:
1. Read the extracted insights from `/tmp/.reflexion/{session-id}/extracted-insights.md`
2. For each insight, search for semantically related content
3. Identify potential conflicts, redundancies, or enhancement opportunities

**Search Strategy**:
- Grep for key terms from each insight
- Check section headers in rules files
- Look for similar patterns or principles

**Output**:
Write to `/tmp/.reflexion/{session-id}/related-knowledge.md`

Format:
```markdown
## Related Knowledge

### Insight 1: [Title]

**Related Files**:
- `{path}`: "[Relevant excerpt]" (line N)
- `{path}`: "[Relevant excerpt]" (line M)

**Relationship**:
- [ ] Redundant (already covered)
- [ ] Conflicting (contradicts existing)
- [ ] Complementary (extends existing)
- [ ] Novel (no related content found)

**Recommendation**: [Merge with X / Create new / Skip]

---
[Repeat for each insight]
```

If no related knowledge found for an insight, mark as "Novel" with empty Related Files.
```

## Chunking Strategy

For session files exceeding 500KB:

1. **Initial scan**: Read first 500 lines for context
2. **Sampling**: Read every 3rd chunk of 500 lines
3. **Focus areas**:
   - Assistant responses (contain decisions)
   - Tool call results (contain outcomes)
   - User corrections (contain preferences)

```
# Example chunking for 10000-line file:
Read(path, offset=0, limit=500)      # Context
Read(path, offset=1500, limit=500)   # Sample 1
Read(path, offset=4500, limit=500)   # Sample 2
Read(path, offset=7500, limit=500)   # Sample 3
Read(path, offset=9500, limit=500)   # Final section
```

## Error Handling

| Error | Recovery |
|-------|----------|
| Session file not found | Write error to output file, main agent handles |
| File too large to chunk | Use aggressive sampling (every 5th chunk) |
| No insights found | Write "No actionable insights detected" with reason |
| Memory paths inaccessible | Note in output, continue with accessible paths |

## Subagent Invocation

```
Task(
  subagent_type: "general-purpose",
  prompt: "[Above prompt with variables substituted]",
  run_in_background: true,
  description: "Extract session insights"
)
```

Wait for all three with:
```
TaskOutput(task_id=summarizer_id, block=true)
TaskOutput(task_id=extractor_id, block=true)
TaskOutput(task_id=finder_id, block=true)
```
