# Insight Category Criteria

Guidelines for categorizing extracted insights and matching to target files.

## Insight Type Classification

Before category matching, determine the extraction type:

### Step 1a: Identify Extraction Type

**Content Indicators**:
- Traceable to specific statement
- Single-source attribution possible
- Declarative form ("X is Y", "Do X")

**Pattern Indicators**:
- Requires 2+ instances as evidence
- Distributed-source attribution
- Dispositional form ("tends to", "prefers")

### Type Output Schema

| Field | Content | Pattern |
|-------|---------|---------|
| Type | `Content` | `Pattern` |
| Confidence | Always `High` | `High` (5+) / `Medium` (3-4) / `Low` (2) |
| Evidence | Direct quote or line reference | List of instances |

### Validation Requirements

| Type | Validation | Proceed Condition |
|------|------------|-------------------|
| Content | Accuracy check (quote matches?) | Always |
| Pattern High | None required | Automatic |
| Pattern Medium | User confirmation | If confirmed |
| Pattern Low | Document only | Never apply |

## Category Definitions

### Prompt Design

**Description**: Patterns for crafting effective LLM instructions.

**Indicators**:
- Verb choice for instructions (call vs use)
- Framing strategies (positive vs negative)
- Attention/execution patterns
- Instruction binding strength

**Target File**: `design.md`

**Examples**:
- Directive Strength Hierarchy (call > invoke > use)
- Attention-Action Gap (understanding ≠ execution)
- Absence over Deprecation (remove vs negate)

### Workflow Pattern

**Description**: Multi-step procedures and process designs.

**Indicators**:
- Phase/step sequencing
- Handoff patterns between agents
- Context preservation strategies
- Parallel vs sequential execution

**Target File**: `delegation.md`

**Examples**:
- Context Acquisition (Phase 0)
- Subagent delegation triggers
- Plan execution handoff

### Communication

**Description**: Interaction patterns between AI and user.

**Indicators**:
- Question framing
- Decision presentation
- Gap surfacing methods
- Confirmation patterns

**Target File**: `communication.md`

**Examples**:
- Syneidesis (gap surfacing protocol)
- Perspective Selection
- Decision Tiering

### Technical Decision

**Description**: Implementation choices for specific domains or projects.

**Indicators**:
- Architecture patterns
- Library/tool selection rationale
- Trade-off resolutions
- Domain-specific conventions

**Target File**: Project `CLAUDE.md` or domain-specific rules

**Examples**:
- Protocol verification approaches
- Symbol naming conventions
- API design patterns

### Tool Usage

**Description**: Patterns for using specific tools effectively.

**Indicators**:
- Tool selection criteria
- Tool invocation patterns
- Output handling
- Error recovery

**Target File**: `preferences.md`

**Examples**:
- MCP tool preferences
- Git workflow patterns
- Search tool selection

### Boundary

**Description**: Safety, security, and access control rules.

**Indicators**:
- Path restrictions
- Secret handling
- Reversibility classification
- Risk assessment

**Target File**: `boundaries.md`

**Examples**:
- Deny paths
- Secret patterns in configs
- Irreversible operation classification

## Matching Algorithm

### Step 1: Identify Primary Signal

Extract the core concept:
- What is the insight about?
- What behavior does it modify?
- What problem does it solve?

### Step 2: Check Against Categories

For each category, assess:
- Does the insight address this category's concerns?
- Does it match the category's indicators?
- Would it fit naturally in the target file?

### Step 3: Resolve Ambiguity

When insight spans multiple categories:
1. Identify the primary concern (what problem it solves)
2. Consider where users would look for this information
3. Choose the most specific applicable category

Example: "Use `call` for tool invocations in delegation prompts"
- Could be Prompt Design (verb choice)
- Could be Workflow Pattern (delegation)
- Primary concern: instruction effectiveness → **Prompt Design**

### Step 4: Verify Target File Fit

Read target file and check:
- Does a relevant section exist?
- Is the level of detail consistent?
- Would this insight feel natural here?

## Generalizability Assessment

### High Generalizability (Apply)

- Applies across multiple contexts
- Based on fundamental principle, not specific case
- Would benefit most sessions

Examples:
- Directive strength hierarchy (applies to all tool calls)
- Attention-action gap (fundamental LLM behavior)

### Medium Generalizability (Consider)

- Applies to specific domain but recurring
- Based on observed pattern with multiple instances
- Would benefit sessions in that domain

Examples:
- Protocol verification approaches (applies to formal specs)
- Multi-perspective analysis pattern (applies to complex questions)

### Low Generalizability (Document Only)

- Specific to single project/session
- Based on one-time decision
- Unlikely to recur

Examples:
- Specific symbol choice (C → ∩ for Convergence)
- Specific file structure decision

## Conflict Detection

### Types of Conflicts

**Direct Contradiction**:
- Insight says "do X", existing rule says "don't do X"
- Example: Negative constraints vs Absence over Deprecation

**Scope Overlap**:
- Insight covers same ground as existing rule differently
- Example: Two different approaches to the same problem

**Implicit Tension**:
- Insight follows different philosophy than existing rules
- Example: Detailed guidance vs minimal intervention

### Resolution Strategies

1. **Subsumption**: New insight generalizes existing rule
   - Action: Replace existing with more general form

2. **Exception**: New insight is valid exception to existing rule
   - Action: Add as explicit exception clause

3. **Complementary**: Both valid in different contexts
   - Action: Add context-dependent guidance

4. **Contradiction**: Cannot both be true
   - Action: Defer, document for user resolution

## Quality Criteria

Insights must be:
- **Generalizable**: Useful beyond original context
- **Actionable**: Clear guidance, not observations
- **Non-redundant**: Not already covered by user rule files or tool behavioral directives
- **Validated**: Emerged from actual experience, not speculation

### Include If

- [ ] Emerged from actual experience (not speculation)
- [ ] Provides clear guidance (actionable)
- [ ] Not already covered by existing rules
- [ ] Would benefit future sessions
- [ ] Can be expressed concisely

### Exclude If

- [ ] Too specific to single context
- [ ] Already implied by existing rules
- [ ] Semantically equivalent to tool description constraint
- [ ] Speculative (not validated by experience)
- [ ] Observation without actionable guidance
- [ ] Would require extensive explanation

## Semantic Overlap vs Information Redundancy

Semantic overlap across different pragmatic encodings ≠ information redundancy.

- **Redundancy test**: Remove insight → existing rules still cover the behavior? (REDUNDANT)
- **Priming test**: Remove insight → rule effectiveness degrades? (FUNCTIONAL DEPENDENCY)

Different encoding (statement → question, positive → negative framing) targets different cognitive pathways.
Measure functional dependency, not surface similarity.

## Writing Guidelines

### Format for Rules Files

```markdown
## Section Name

[One-line summary or principle]

- [Bullet for sub-item 1]
- [Bullet for sub-item 2]
```

### Style Requirements

- **Imperative form**: "Do X" not "You should do X"
- **Concise**: One concept per statement
- **Specific**: Avoid vague terms like "consider" or "may"
- **Self-contained**: Understandable without external context

### Examples

**Good**:
```markdown
## Directive Strength Hierarchy

Tool invocation verbs by binding strength:
- `call` (strongest): technical capture, zero polysemy
- `invoke`: formal protocol context
- `use` (weakest): admits functional interpretation
```

**Bad**:
```markdown
## About Tool Verbs

You should consider using stronger verbs when calling tools because
the LLM might interpret weaker verbs differently, which we learned
from the Prothesis session where...
```
