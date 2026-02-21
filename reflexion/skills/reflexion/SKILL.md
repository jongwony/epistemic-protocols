---
name: reflexion
description: >-
  This skill should be used when the user asks to "reflect on session",
  "extract insights", "analyze this conversation", "save learnings to memory",
  "run /reflect", "what did we learn?", "capture this for future sessions",
  "session wrap-up", or wants to persist session knowledge to User/Project memory.
  Conversational memory reconstruction through guided dialogue.
---

# Reflexion v3

Extract session insights and reconstruct user's memory through conversational guidance.

## Definition

**Reflexion** (Latin *reflexio*, "bending back"): A procedural workflow for extracting tacit session knowledge into explicit memory through guided dialogue, enabling cross-session learning.

```
Reflexion(S, M) → Ctx(S) → ∥E(S, M) → Δ → Sel(Δ) → (Iₛ, Lₛ) → Int(Iₛ, Lₛ, M) → M'

S      = Session (conversation history as .jsonl)
M      = Memory { user, project, domain }
Ctx    = Context detection: S → { sessionId, memoryMode, paths }
∥E     = Parallel extraction: S × M → Δ                    -- coproduct of 3 subagents
Δ      = Extracted artifacts { summary, insights[], related[] }
Sel    = Selection: Δ → (Iₛ, Lₛ)                           -- user-guided via AskUserQuestion
Iₛ     = Selected insights (subset)
Lₛ     = Storage locations per insight
Int    = Integration: (Iₛ, Lₛ, M) → M'                     -- write to memory
M'     = Updated memory state

── PHASE MAPPING ──
Phase 1: S → Ctx(S)                                        -- context detection
Phase 2: Ctx(S), M → ∥E(S, M) → Δ                          -- parallel extraction
Phase 3: Δ → Sel(Δ) → (Iₛ, Lₛ)                             -- guided selection
Phase 4: (Iₛ, Lₛ, M) → Int → M'                            -- integration
Phase 5: M' → Verify → Cleanup                             -- verification
```

For full categorical notation, see `references/formal-semantics.md`.

## Core Principle

**Crystallization over Accumulation**: Distill structured insights; do not merely archive raw experience.

**Recognition over Recall**: Present options, minimize memory burden.

## Initialization (MANDATORY)

Upon invocation, call TodoWrite to track phases:

```
TodoWrite([
  {content: "Detect session context", activeForm: "Detecting session context", status: "in_progress"},
  {content: "Extract insights (parallel)", activeForm: "Extracting insights", status: "pending"},
  {content: "Guide insight selection", activeForm: "Guiding insight selection", status: "pending"},
  {content: "Integrate selected insights", activeForm: "Integrating insights", status: "pending"},
  {content: "Verify and cleanup", activeForm: "Verifying completion", status: "pending"}
])
```

Update status at each phase transition. This externalizes working memory and prevents phase skipping.

## Protocol Integration

**When Prothesis is active**: Invoke `/frame` before Phase 2 extraction for perspective selection. The selected perspective guides insight extraction focus.

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
     "sessionId": "<session-id>",
     "sessionPath": "<detected-session-path>",
     "projectPath": "<project-root>",
     "memoryMode": "project | user",
     "userMemoryPath": "~/.claude",
     "projectMemoryPath": "<project-root>/.claude"
   }
   ```

**Phase Completion**: Update TodoWrite (Phase 1: completed, Phase 2: in_progress)

### Phase 2: Parallel Extraction (Plugin Agents)

Call 3 plugin agents in parallel with `run_in_background: true`:

```
Task(subagent_type: "reflexion:session-summarizer",
     prompt: "session_path={session_path}, session_id={session_id}",
     run_in_background: true)

Task(subagent_type: "reflexion:insight-extractor",
     prompt: "session_path={session_path}, session_id={session_id}",
     run_in_background: true)

Task(subagent_type: "reflexion:knowledge-finder",
     prompt: "session_id={session_id}",
     run_in_background: true)
```

**Outputs** (written by agents):
- `/tmp/.reflexion/{session-id}/session-summary.md`
- `/tmp/.reflexion/{session-id}/extracted-insights.md`
- `/tmp/.reflexion/{session-id}/related-knowledge.md`

**Wait for completion**:
```
TaskOutput(task_id=summarizer_id, block=true)
TaskOutput(task_id=extractor_id, block=true)
TaskOutput(task_id=finder_id, block=true)
```

For detailed agent specifications, see `agents/*.md`.

**Phase Completion**: Update TodoWrite (Phase 2: completed, Phase 3: in_progress)

### Phase 3: Guided Selection (Main Agent - AskUserQuestion Loop)

Read handoff files and conduct guided dialogue:

**Q1: Summary Validation**
```
"Does this summary look correct?"
├── "Yes, correct"
├── "Needs modification" → call AskUserQuestion with inferred options
└── "Skip summary"

Recognition over Recall: When user requests modification, infer likely
missing/incorrect items from session context and present as options.
Never ask open-ended "what should be added?" questions.
```

**Q2: Insight Selection** (multiSelect: true)
```
"Which insights should be saved?"
├── [Insight 1]
├── [Insight 2]
├── ...
└── "None (skip saving)"
```

**Q3: Additional Memory** (optional)
```
"Any missed perspectives?"
├── "Yes" → call AskUserQuestion with inferred options
└── "No, sufficient"

Recognition over Recall: Infer potential insights from session context
NOT already in extracted list. Present as options, not open-ended questions.
```

**Q4: Merge Decision** (if related knowledge found)
```
"Merge with existing knowledge?"
├── "Merge (modify existing file)"
├── "Create new"
└── "Skip"
```

**Q5: Storage Location** (per selected insight)
```
Project Memory mode:
├── "This project only (Project memory - override)"
├── "All projects (User memory - foundation)"
└── "Specific tech stack (Domain)"

User Memory mode:
├── "All projects (User memory)"
└── "Specific tech stack (Domain)"
```

**Phase Completion**: Update TodoWrite (Phase 3: completed, Phase 4: in_progress)

### Phase 4: Integration (Main Agent or Subagent)

Based on user selections:
- **New file**: Create in selected location with proper frontmatter
- **Merge**: Edit existing file, append or modify section
- **Domain**: Create in `.insights/domain/{tech-stack}/`

**Frontmatter Update Rules**:

| Field | New File | Merge |
|-------|----------|-------|
| `date` | Current date | Update to current date |
| `session` | `[<session-id>]` | Append current session ID |
| `tags` | From insight | Union (add new, keep existing) |
| `keywords` | From insight | Union (add new, keep existing) |
| `summary` | From insight | Revise to reflect merged content |
| `sections` | From insight | Append new section entries |

```yaml
# Before merge
---
date: 2026-01-15
session: [s1]
tags: [A, B]
keywords: [x, y]
---

# After merge (current session: s2, new insight has tag C, keyword z)
---
date: 2026-02-04       # → Updated
session: [s1, s2]      # → Appended
tags: [A, B, C]        # → Union
keywords: [x, y, z]    # → Union
---
```

If multiple files to edit, delegate to Task subagent.

**Phase Completion**: Update TodoWrite (Phase 4: completed, Phase 5: in_progress)

### Phase 5: Verification (Main Agent)

```
"Complete. Any additional actions needed?"
├── "Analyze another session" → Restart from Phase 1
├── "Review related rules" → Suggest relevant rules
└── "Done"
```

Clean up handoff state: `rm -rf /tmp/.reflexion/{session-id}/`

**Phase Completion**: Update TodoWrite (All phases completed), clean up todo list

## Additional Resources

- **`agents/`** — Plugin agents for Phase 2 parallel extraction
- **`references/formal-semantics.md`** — Categorical and type-theoretic formalization
- **`references/memory-hierarchy.md`** — Memory layer documentation
- **`references/subagent-prompts.md`** — Operational reference (chunking, error handling, invocation)
- **`references/error-handling.md`** — Error recovery procedures
- **`examples/worked-example.md`** — Complete walkthrough
