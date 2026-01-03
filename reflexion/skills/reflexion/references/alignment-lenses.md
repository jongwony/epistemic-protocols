# Alignment Verification Lenses

Detailed lens definitions and subagent prompts for Phase 6.

## Overview

Four mandatory baseline lenses verify User Memory changes against Claude Code system prompt:

| Lens | Focus | Key Question |
|------|-------|--------------|
| Prompt Engineering | Instruction mechanics | Does this create instruction conflicts? |
| Claude Code Architecture | Tool/plugin consistency | Does this align with Claude Code patterns? |
| System Architecture | Structural soundness | Does this violate layer boundaries? |
| Formal Verification | Logical consistency | Does this create contradictions? |

## Optional Extension

Before spawning baseline lenses, invoke AskUserQuestion to offer additional perspectives:

**Derivation**: Analyze applied changes to identify relevant extension perspectives. Present options that provide epistemic contribution distinct from baseline lenses.

**Selection**: User may select extension lenses or proceed with baseline only.

**Execution**: Selected extensions spawn in parallel with baseline lenses, following same subagent prompt structure.

## Lens Definitions

### Prompt Engineering

**Epistemic Contribution**: Reveals instruction priority collisions and semantic override risks when user-defined rules interact with system-level constraints.

**Framework Concepts**:
- **Instruction Priority Model**: Core safety (immutable) > System operations > User config (defaults only)
- **Override Semantics**: "OVERRIDE default behavior" grants authority over defaults, not safety constraints
- **Attention Competition**: Undefined triggers can cause hesitation or conflict in execution flow
- **Reinforcement vs Conflict**: User rules may strengthen or contradict system expectations

**Assessment Categories**:
- `NO CONFLICT`: No instruction priority issues
- `POTENTIAL TENSION`: Undefined conditions or attention competition
- `CONFLICT`: Direct contradiction with system instruction

### Claude Code Architecture

**Epistemic Contribution**: Reveals misalignments between user rules and Claude Code's native patterns—tool descriptions, plugin conventions, delegation model, and memory scope design.

**Framework Concepts**:
- **Tool Description Consistency**: User rules should not contradict behavioral directives embedded in tool descriptions
- **Plugin/Skill Structure**: Rules affecting plugin behavior should align with plugin architecture (commands, agents, skills, hooks)
- **Delegation Patterns**: Rules should respect main agent vs subagent boundaries and context inheritance
- **Memory Scope Design**: User vs project memory placement should follow scope principles
- **Context Access Patterns**: Rules should account for what subagents can and cannot access
- **Runtime State Detectability**: Rules must not depend on system states the model cannot query at runtime (e.g., settings.json values, permission modes). Use user-declared modes instead.

**Assessment Categories**:
- `ALIGNED`: Consistent with Claude Code architectural patterns
- `MISALIGNED`: Contradicts or ignores Claude Code conventions
- `PARTIAL`: Some aspects aligned, others need adjustment

### System Architecture

**Epistemic Contribution**: Reveals layer boundary violations and dependency inversion problems that semantic analysis would miss.

**Framework Concepts**:
- **Layer Model**: System Prompt (base) > User Config (override layer) > Runtime (transient)
- **Dependency Direction**: Lower layers should not depend on higher layers
- **Coupling**: Tight coupling between preferences and core mechanisms is problematic
- **Separation of Concerns**: Policy vs execution, persona vs guardrails
- **Override Hierarchy**: Scoped authority, not unlimited

**Assessment Categories**:
- `ARCHITECTURALLY SOUND`: Correct layer placement and dependency direction
- `COUPLING ISSUE`: Tight coupling or dependency inversion
- `LAYER VIOLATION`: User layer attempting to override system layer behaviors

### Formal Verification

**Epistemic Contribution**: Detects logical contradictions and unsatisfiable rule combinations that probabilistic analysis may miss. Provides binary pass/fail on consistency.

**Framework Concepts**:
- **Logical Consistency**: Rules should not produce contradictory directives
- **Rule Satisfiability**: Combined rules must have at least one valid interpretation
- **Minimal Unsatisfiable Core**: When contradiction exists, identify smallest conflicting subset
- **Constraint Propagation**: How one rule's implications affect others

**Assessment Categories**:
- `CONSISTENT`: No logical contradictions detected
- `CONTRADICTION`: Direct logical conflict between rules
- `TENSION`: Soft conflict that may resolve probabilistically but risks inconsistency

**Limitations**: LLMs resolve conflicts probabilistically, not through formal inference. This lens detects clear contradictions but cannot prove soundness of soft instruction priority.

## Subagent Prompt Templates

### Prompt Engineering Subagent

```
You are a **Prompt Engineering Expert**.

Analyze from this epistemic standpoint:

**Question**: Review whether these User Memory changes conflict with the Claude Code system prompt.

**Applied Changes**:
[List each change with file path and content]

Analyze the applied changes against Claude Code behavioral patterns.

Note: You do not have direct access to the system prompt. Analyze based on:
- General Claude Code patterns and conventions
- The user rules provided
- Your understanding of instruction priority and safety principles

Provide:
1. **Epistemic Contribution**: What this lens uniquely reveals about instruction conflicts (2-3 sentences)
2. **Framework Analysis**: Analyze using prompt engineering concepts - instruction priority, override semantics, attention competition, instruction following patterns
3. **Horizon Limits**: What this perspective cannot see or undervalues
4. **Assessment**: Direct verdict on each change - CONFLICT / NO CONFLICT / POTENTIAL TENSION, with specific system prompt references if applicable
```

### Claude Code Architecture Subagent

```
You are a **Claude Code Architecture Expert**.

Analyze from this epistemic standpoint:

**Question**: Review whether these User Memory changes conflict with the Claude Code system prompt.

**Applied Changes**:
[List each change with file path and content]

Analyze the applied changes against Claude Code architectural patterns.

Note: You do not have direct access to the system prompt. Analyze based on:
- Claude Code tool descriptions and behavioral directives
- Plugin/skill/agent structure conventions
- Delegation model (main agent vs subagent boundaries)
- Memory scope design principles
- Runtime state detectability (can the model actually query this condition?)

Provide:
1. **Epistemic Contribution**: What this lens uniquely reveals about Claude Code pattern alignment (2-3 sentences)
2. **Framework Analysis**: Analyze using Claude Code architecture concepts - tool description consistency, plugin structure, delegation patterns, memory scope, context access, runtime state detectability
3. **Horizon Limits**: What this perspective cannot see or undervalues
4. **Assessment**: Direct verdict on each change - ALIGNED / MISALIGNED / PARTIAL, with specific pattern references if applicable
```

### System Architecture Subagent

```
You are a **System Architecture Expert**.

Analyze from this epistemic standpoint:

**Question**: Review whether these User Memory changes conflict with the Claude Code system prompt.

**Applied Changes**:
[List each change with file path and content]

Analyze the applied changes against Claude Code behavioral patterns.

Note: You do not have direct access to the system prompt. Analyze based on:
- General Claude Code patterns and conventions
- The user rules provided
- Your understanding of instruction priority and safety principles

Provide:
1. **Epistemic Contribution**: What this lens uniquely reveals about structural conflicts (2-3 sentences)
2. **Framework Analysis**: Analyze using architecture concepts - layer boundaries, dependency direction, module coupling, separation of concerns, override hierarchies
3. **Horizon Limits**: What this perspective cannot see or undervalues
4. **Assessment**: Direct verdict on each change - ARCHITECTURALLY SOUND / LAYER VIOLATION / COUPLING ISSUE, with structural analysis
```

### Formal Verification Subagent

```
You are a **Formal Verification Expert**.

Analyze from this epistemic standpoint:

**Question**: Review whether these User Memory changes conflict with the Claude Code system prompt.

**Applied Changes**:
[List each change with file path and content]

Analyze the applied changes against Claude Code behavioral patterns.

Note: You do not have direct access to the system prompt. Analyze based on:
- General Claude Code patterns and conventions
- The user rules provided
- Your understanding of instruction priority and safety principles

Provide:
1. **Epistemic Contribution**: What this lens uniquely reveals about logical consistency (2-3 sentences)
2. **Framework Analysis**: Analyze using formal methods concepts - logical consistency, rule satisfiability, contradiction detection, constraint propagation
3. **Horizon Limits**: What this perspective cannot see or undervalues (especially: LLMs resolve conflicts probabilistically)
4. **Assessment**: Direct verdict on each change - CONSISTENT / CONTRADICTION / TENSION, identifying minimal conflicting rule sets if applicable
```

## Synthesis Guidelines

### Collecting Results

Spawn all 4 subagents in parallel using Task tool with `run_in_background: true`. Collect with TaskOutput.

### Convergence Analysis

Identify where all lenses agree:
- All positive (`NO CONFLICT`, `ALIGNED`, `ARCHITECTURALLY SOUND`, `CONSISTENT`) → Robust finding, no action needed
- All flag same issue → High-confidence problem, prioritize fix

### Divergence Analysis

When lenses disagree:
- MISALIGNED from Claude Code Architecture + no issue from others → Check tool description alignment
- Architecture issue from System Architecture only → Structural fix without urgency
- Tension from Prompt Engineering only → Monitor, no immediate action
- Contradiction from Formal + no issue from others → Investigate rule interaction; may be soft priority

### Recommendation Format

```markdown
## Alignment Verification Results

### Summary
| Change | PE | CC Arch | Sys Arch | Formal | Action |
|--------|----|---------|----- |--------|--------|
| ... | ... | ... | ... | ... | ... |

### Issues Found
[If any, describe with lens attribution]

### Recommended Modifications
[Specific edits if needed, with rationale]
```

### User Decision

If issues found, invoke AskUserQuestion:
- Option 1: Apply recommended modifications
- Option 2: Defer changes (revert and document)
- Option 3: Accept risks (proceed with documentation)

## Skip Conditions

Skip Phase 6 when:
- No insights were applied in Phase 5
- Changes are purely additive to user preferences (no policy implications)
- User explicitly requests skip

Always run when:
- Changes affect communication model or decision patterns
- Changes reference system prompt behaviors
- Changes involve safety, boundaries, or delegation rules
