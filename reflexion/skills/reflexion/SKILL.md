---
description: >-
  Conversational memory reconstruction skill. Extracts insights from sessions
  and integrates them into User/Project memory through guided dialogue.
---

# Reflexion v3

Extract session insights and reconstruct user's memory through conversational guidance.

## Core Principle

**Recognition over Recall**: Present options, minimize memory burden.

## Protocol Integration

**When Prothesis is active**: Invoke `/prothesis` before Phase 2 extraction for perspective selection. The selected perspective guides insight extraction focus.

**When Syneidesis is active**: Gap detection applies at Phase 3 decision points (Q2-Q5). Syneidesis may surface additional considerations before each AskUserQuestion.

## Workflow

### Phase 1: Context Detection (Main Agent)

1. **Identify current session path**:
   ```bash
   # Session files location pattern:
   ~/.claude/projects/-{encoded-project-path}/sessions/{session-id}.jsonl
   # or for User Memory mode:
   ~/.claude/sessions/{session-id}.jsonl
   ```
   - Use Glob to find recent session: `~/.claude/**/sessions/*.jsonl`
   - Sort by modification time, take most recent
   - Or use `/tasks` command to see active session ID

2. **Determine Memory Mode**:
   - Session path contains `/projects/-` → **Project Memory mode**
   - Session path is `~/.claude/sessions/` → **User Memory mode**

3. **Create handoff state directory**: `/tmp/.reflexion/{session-id}/`

4. **Write `session-context.json`**:
   ```json
   {
     "sessionId": "abc123",
     "sessionPath": "~/.claude/projects/-Users-choi-myproject/sessions/abc123.jsonl",
     "projectPath": "/Users/choi/myproject",
     "memoryMode": "project",
     "userMemoryPath": "~/.claude",
     "projectMemoryPath": "/Users/choi/myproject/.claude"
   }
   ```

### Phase 2: Parallel Extraction (Subagents)

Call 3 Task subagents in parallel with `run_in_background: true`:

**Task 1: session-summarizer**
- Read session.jsonl
- Generate 3-5 sentence summary
- Write to `/tmp/.reflexion/{session-id}/session-summary.md`

**Task 2: insight-extractor**
- Extract actionable insights (decisions, patterns, preferences)
- Format as numbered list with evidence
- Write to `/tmp/.reflexion/{session-id}/extracted-insights.md`

**Task 3: knowledge-finder**
- Search existing knowledge in User/Project memory
- Find related rules, insights, CLAUDE.md sections
- Write to `/tmp/.reflexion/{session-id}/related-knowledge.md`

**Wait for completion**:
```
# After launching all 3 tasks with run_in_background: true
# Use TaskOutput tool to wait for each:
TaskOutput(task_id=task1_id, block=true)
TaskOutput(task_id=task2_id, block=true)
TaskOutput(task_id=task3_id, block=true)
```

### Phase 3: Guided Selection (Main Agent - AskUserQuestion Loop)

Read handoff files and conduct guided dialogue:

**Q1: Summary Validation**
```
"세션 요약이 맞나요?"
├── "네, 맞습니다"
├── "수정이 필요합니다" → call AskUserQuestion with inferred options
└── "요약 건너뛰기"

Recognition over Recall: When user requests modification, infer likely
missing/incorrect items from session context and present as options.
Never ask open-ended "what should be added?" questions.
```

**Q2: Insight Selection** (multiSelect: true)
```
"어떤 인사이트를 저장할까요?"
├── [Insight 1]
├── [Insight 2]
├── ...
└── "없음 (저장 안함)"
```

**Q3: Additional Memory** (optional)
```
"놓친 관점이 있나요?"
├── "네" → call AskUserQuestion with inferred options
└── "아니오, 충분합니다"

Recognition over Recall: Infer potential insights from session context
NOT already in extracted list. Present as options, not open-ended questions.
```

**Q4: Merge Decision** (if related knowledge found)
```
"기존 지식과 병합할까요?"
├── "병합 (기존 파일 수정)"
├── "새로 생성"
└── "건너뛰기"
```

**Q5: Storage Location** (per selected insight)
```
Project Memory mode:
├── "이 프로젝트에만 적용 (Project memory - override)"
├── "모든 프로젝트에 적용 (User memory - foundation)"
└── "특정 기술 스택에 적용 (Domain)"

User Memory mode:
├── "모든 프로젝트에 적용 (User memory)"
└── "특정 기술 스택에 적용 (Domain)"
```

### Phase 4: Integration (Main Agent or Subagent)

Based on user selections:
- **New file**: Create in selected location with proper frontmatter
- **Merge**: Edit existing file, append or modify section
- **Domain**: Create in `.insights/domain/{tech-stack}/`

If multiple files to edit, delegate to Task subagent.

### Phase 5: Verification (Main Agent)

```
"완료. 추가 작업이 필요한가요?"
├── "다른 세션도 분석" → Restart from Phase 1
├── "관련 룰 검토" → Suggest relevant rules
└── "완료"
```

Clean up handoff state: `rm -rf /tmp/.reflexion/{session-id}/`

## Subagent Prompts

### session-summarizer
```
Read the session file at {session_path}.
Generate a 3-5 sentence summary focusing on:
- Main task accomplished
- Key decisions made
- Notable interactions

Write the summary to /tmp/.reflexion/{session-id}/session-summary.md
Format: Plain markdown, no frontmatter.
```

### insight-extractor
```
Read the session file at {session_path}.
Extract actionable insights:
1. Explicit decisions (user stated preferences)
2. Recurring patterns (repeated behaviors)
3. Problem-solution pairs
4. Tool usage preferences

Format as numbered list:
1. **[Category]**: Insight text
   - Evidence: "quoted from session"

Write to /tmp/.reflexion/{session-id}/extracted-insights.md
```

### knowledge-finder
```
Search for related knowledge in:
- {user_memory_path}/CLAUDE.md
- {user_memory_path}/rules/*.md
- {user_memory_path}/.insights/**/*.md
- {project_memory_path}/CLAUDE.md (if project mode)
- {project_memory_path}/.insights/**/*.md (if project mode)

Find:
- Similar rules or principles
- Potentially conflicting guidance
- Enhancement opportunities

Write to /tmp/.reflexion/{session-id}/related-knowledge.md
Format: List of file paths with relevant excerpts.
```

## Error Handling

| Error | Recovery |
|-------|----------|
| Session file too large | Use offset/limit in Read tool |
| Subagent timeout | Retry once, then proceed without that output |
| User dismisses all insights | Skip to Phase 5 verification |
| Handoff file missing | Re-run relevant subagent |

## References

- [Memory Hierarchy](references/memory-hierarchy.md)
