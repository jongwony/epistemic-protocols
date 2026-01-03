---
name: reflexion
description: Cross-session learning via the Reflexion pattern—extract insights from Claude Code sessions into persistent memory.
---

# Session Reflexion

Extract insights from Claude Code sessions and integrate into appropriate memory scope through structured review.

## Purpose

Transform session experiences into persistent knowledge by:
1. Analyzing session transcripts for patterns, decisions, and learnings
2. Categorizing insights by type and applicability
3. Matching insights to existing rules files
4. Facilitating user review before integration
5. Documenting deferred insights for future reference

## Workflow

### Phase 1: Session Identification

Locate session file using one of:
- **Session ID**: `~/.claude/projects/*/[session-id].jsonl`
- **Project path**: Direct path to session file
- **Recent sessions**: List recent sessions in current project

Session files are JSONL format, often large (500KB+). Delegate analysis to subagent.

### Phase 1.5: Extraction Mode Selection

Call AskUserQuestion to select extraction mode:

- **Both (default)**: Content + Pattern extraction
- **Content only**: Explicit decisions, stated facts, technical choices
- **Pattern only**: Recurring behaviors, implicit preferences, interaction styles

### Phase 2: Insight Extraction

Call Task tool with general-purpose subagent to analyze session:

```
Analyze session file at [path] to extract key insights.

Task:
1. Read session in chunks (use offset/limit for large files)
2. Identify main topics, problems solved, decisions made
3. Extract actionable insights valuable as User Memory entries

Output format per insight:
- Category: (e.g., Prompt Design, Workflow Pattern, Technical Decision)
- Insight: Clear, concise statement
- Context: How this insight emerged
- Suggested Memory Entry: Compact, reusable form

Focus on patterns and principles over implementation details.
```

### Phase 3: Insight Review

Present extracted insights in table format:

| # | Category | Insight | Rationale | Target |
|---|----------|---------|-----------|--------|
| 1 | Prompt Design | [insight] | [consequence-oriented: Prevents/Enables/Catches...] | design.md |
| 2 | Communication | [insight] | [consequence-oriented] | communication.md |

For each insight, identify:
- **Rationale**: One sentence explaining why this insight matters (consequence-oriented)
- **Applicable rules file**: Which existing file matches
- **Conflict check**: Does it contradict existing rules?

### Phase 3.5: Tool Description Redundancy + Alignment Check

**Executor**: Main agent only (subagents cannot introspect tool descriptions).

Compare insights against tool behavioral directives (TodoWrite, Edit/Write, Bash, Task) for redundancy and alignment. Output table with REDUNDANT/ALIGNED/NEUTRAL/UNCLEAR flags.

For detailed process, see `references/workflow-detail.md`.

### Phase 4: User Selection

1. **Pattern Validation**: Medium/Low-confidence patterns require user confirmation before integration
2. **Redundancy Visibility**: Present flagged insights with recommendations
3. **Memory Scope Decision**: Match insight characteristics to location (user/project/defer)

Call AskUserQuestion with:
- Insights to apply (all / core / by number)
- Memory location (user memory / project memory / document only)

Invoke Syneidesis to surface conflicts and validation needs.

For detailed decision criteria, see `references/workflow-detail.md`.

### Phase 5: Integration

For selected insights:
1. Read target rules file
2. Identify appropriate section (or create new section)
3. Apply Directive Strength Hierarchy: use `call` for tool invocations
4. Edit file with concise, imperative-form entry

### Phase 6: Alignment Verification

After integration, verify changes don't conflict with Claude Code system prompt.

**Structure**: Prothesis Specialization—mandatory baseline + optional extension.

**Trigger**: When any insight was applied (Phase 5 completed with edits).

**Process**:

1. **Mandatory Baseline** (always executed):
   - **Prompt Engineering**: Instruction priority, override semantics, attention competition
   - **Claude Code Architecture**: Tool description consistency, plugin structure, delegation patterns
   - **System Architecture**: Layer boundaries, dependency direction, coupling
   - **Formal Verification**: Logical consistency, contradiction detection, rule satisfiability

2. **Optional Extension**: Call AskUserQuestion to offer additional perspectives derived from applied changes context. User may proceed with baseline only.

3. Spawn parallel Task subagents for all selected lenses (baseline ∪ extension).

4. Synthesize results:
   - **Convergence**: Where lenses agree (robust finding)
   - **Divergence**: Where they disagree (requires judgment)
   - **Recommendations**: Specific modifications if issues found

5. If issues found, invoke AskUserQuestion with recommended fixes.

For detailed lens definitions and subagent prompts, see `references/alignment-lenses.md`.

### Phase 7: Documentation

For deferred/rejected insights:
1. Create document in `~/.claude/docs/insights/`
2. Filename format: `YYYY-MM-DD-[topic].md`
3. Include frontmatter with session reference (progressive disclosure):
   ```yaml
   ---
   date: YYYY-MM-DD
   project: -Users-[user]-[path]
   session: [session-id]
   source: ~/.claude/projects/[project]/[session].jsonl
   ---
   ```
4. Document body:
   - Applied insights with locations
   - Deferred insights with rationale and re-evaluation conditions
   - Other insights with exclusion reasons

## Insight Categories

| Category | Typical Target | Default Scope |
|----------|----------------|---------------|
| Prompt Design | `design.md` | User |
| Workflow Pattern | `delegation.md` | User |
| Communication | `communication.md` | User |
| Technical Decision | Project CLAUDE.md | Project |
| Tool Usage | `preferences.md` | User/Project |
| Boundary | `boundaries.md` | User |

For detailed category definitions and matching algorithm, see `references/category-criteria.md`.

## Integration Principles

### Consistency Check

Before applying insights, verify alignment with:
- **Directive Strength Hierarchy**: `call` > `invoke` > `use` for tool invocations
- **Attention-Action Gap**: Blocking mechanisms over instructions alone
- **Absence over Deprecation**: Remove rather than negate

### Conflict Resolution

When insight conflicts with existing rule:
1. Surface as Syneidesis gap
2. Present both versions with context
3. Await user judgment
4. If deferred, document in insights file

For quality criteria and redundancy testing, see `references/category-criteria.md`.

## Session File Patterns

```
# Session file locations
~/.claude/projects/-Users-[user]-[path]/[session-id].jsonl

# Debug files (alternative source)
~/.claude/debug/[session-id].txt

# Todo snapshots
~/.claude/todos/[session-id]-*.json
```

## Additional Resources

### Reference Files

- **`references/workflow-detail.md`** - Extended workflow with examples
- **`references/category-criteria.md`** - Detailed categorization guidelines
- **`references/alignment-lenses.md`** - Phase 6 lens definitions and subagent prompts

### Examples

- **`examples/worked-example.md`** - Complete reflection workflow from session to integrated insights
