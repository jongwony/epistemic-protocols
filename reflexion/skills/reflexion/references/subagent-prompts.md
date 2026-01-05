# Subagent Operational Reference

Operational concerns for Phase 2 parallel extraction agents.

## Overview

Phase 2 launches 3 plugin agents in parallel with `run_in_background: true`. Each agent writes output to `/tmp/.reflexion/{session-id}/` for main agent handoff.

| Agent | Purpose | Output |
|-------|---------|--------|
| `session-summarizer` | Session summary for validation (Q1) | `session-summary.md` |
| `insight-extractor` | Actionable insights with evidence (Q2) | `extracted-insights.md` |
| `knowledge-finder` | Related knowledge for merge decisions (Q4) | `related-knowledge.md` |

**Agent Definitions**: See `agents/*.md` for full system prompts and specifications.

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

## Agent Invocation

### Plugin Agent Pattern (Preferred)

```
Task(
  subagent_type: "reflexion:session-summarizer",
  prompt: "session_path={session_path}, session_id={session_id}",
  run_in_background: true,
  description: "Summarize session"
)

Task(
  subagent_type: "reflexion:insight-extractor",
  prompt: "session_path={session_path}, session_id={session_id}",
  run_in_background: true,
  description: "Extract insights"
)

Task(
  subagent_type: "reflexion:knowledge-finder",
  prompt: "session_id={session_id}",
  run_in_background: true,
  description: "Find related knowledge"
)
```

### Wait for Completion

```
TaskOutput(task_id=summarizer_id, block=true)
TaskOutput(task_id=extractor_id, block=true)
TaskOutput(task_id=finder_id, block=true)
```

### Fallback Pattern

If plugin agent resolution fails, use general-purpose with full prompt from `agents/*.md`:

```
Task(
  subagent_type: "general-purpose",
  prompt: "[Full content from agents/session-summarizer.md body]\n\nsession_path={path}, session_id={id}",
  run_in_background: true,
  description: "Summarize session"
)
```
