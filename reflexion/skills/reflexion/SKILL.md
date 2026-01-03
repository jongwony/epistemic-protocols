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

**Executor**: Main agent (not subagent)

**Rationale**: Main agent has system prompt in context; subagents cannot introspect tool descriptions.

**Process**:
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

### Phase 4: User Selection

#### Pattern Validation Gate

For Pattern insights with Medium or Low confidence:

1. Present: "Pattern suggests [X]. Based on [N] instances. Accurate?"
2. Options:
   - **Confirm**: Proceed to integration
   - **Reject**: Exclude from integration
   - **Defer**: Document only, re-evaluate later

Only High-confidence patterns or user-confirmed patterns proceed to Phase 5.
Low-confidence patterns are documented only, never applied.

#### Redundancy and Alignment Visibility

Present flagged insights with:
- **REDUNDANT**: Source tool description quoted, recommend "Consider excluding"
- **NEUTRAL/UNCLEAR**: Recommend "Consider validating empirically"
- User options: Apply now / Exclude / Document only / Apply as experimental

#### Memory Scope Decision

Apply Memory Scope Design principle before location selection:

| Insight Characteristic | Recommended Location |
|------------------------|----------------------|
| Tool-agnostic principle | User memory (`~/.claude/rules/`) |
| Tool-specific implementation | Project memory (`.claude/rules/`) |
| Domain-specific (tool names, project paths) | Project memory |
| Universal pattern (applies to all projects) | User memory |
| Session-scoped (unvalidated, experimental) | Verbal acknowledgment only (no file write) |

#### Selection Questions

Call AskUserQuestion with two questions:

1. **Insights to apply**: all / select core / specify by number
2. **Memory location** (per Memory Scope Design):
   - User memory (universal patterns, principles)
   - Project memory (domain-specific, implementations)
   - Insights document only (defer decision)

Pre-populate recommendation based on Generalizability from Phase 3.

Invoke Syneidesis protocol during selection to surface:
- Potential conflicts with existing rules
- Insights that may need empirical validation before applying
- Alternative categorizations

**Transition**: Only proceed to Phase 5 after user confirms scope selection via AskUserQuestion.

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

| Category | Description | Typical Target | Default Scope |
|----------|-------------|----------------|---------------|
| Prompt Design | LLM instruction patterns | `design.md` | User |
| Workflow Pattern | Multi-step procedures | `delegation.md` | User |
| Communication | Interaction patterns | `communication.md` | User |
| Technical Decision | Implementation choices | Project CLAUDE.md | Project |
| Tool Usage | Tool-specific patterns | `preferences.md` | User/Project* |
| Boundary | Safety/security rules | `boundaries.md` | User |

**Default Scope** provides initial recommendation; user decision in Phase 4 can override based on context.

*Tool Usage: User if tool-agnostic pattern, Project if tool-specific implementation.

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

### Quality Criteria

Apply insights that are:
- **Generalizable**: Useful beyond original context
- **Actionable**: Clear guidance, not observations
- **Non-redundant**: Not already covered by:
  - User rule files (~/.claude/rules/)
  - Tool behavioral directives in system prompt
- **Validated**: Emerged from actual experience, not speculation

### Semantic Overlap vs Information Redundancy

Semantic overlap across different pragmatic encodings ≠ information redundancy.

- **Redundancy test**: Remove insight → existing rules still cover the behavior? (REDUNDANT)
- **Priming test**: Remove insight → rule effectiveness degrades? (FUNCTIONAL DEPENDENCY)

Different encoding (statement → question, positive → negative framing) targets different cognitive pathways.
Measure functional dependency, not surface similarity.

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
