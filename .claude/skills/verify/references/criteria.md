# Verification Criteria

Quality criteria for epistemic protocol verification, organized by severity.

## Severity Levels

| Level | Definition | Action |
|-------|------------|--------|
| **Critical** | Blocks semantic correctness or causes runtime failure | Recommend fix before commit |
| **Concern** | May cause confusion or inconsistency | Surface for user review |
| **Note** | Informational, stylistic, or optimization | Log for awareness |

## Critical Criteria

### Structural Integrity

- **Required sections present**: Definition, Mode Activation, Protocol, Rules
- **Phase transitions defined**: All phases have explicit transitions
- **Mode state well-formed**: State type includes required fields

### Type-Theoretic Soundness

- **Function signatures complete**: All functions have explicit domain/codomain
- **State machine totality**: All inputs have defined transitions
- **Refinement types enforceable**: Constraints (e.g., `|Gs| ≤ 2`) are checkable

### Instruction Consistency

- **Supersession non-conflict**: Different protocols supersede different domains
- **Activation determinism**: Trigger conditions are unambiguous
- **Tool call mandate**: `AskUserQuestion` calls are mandatory, not optional

## Concern Criteria

### Mathematical Precision

- **Categorical terminology accuracy**: limit/colimit used correctly for intended semantics
- **Notation consistency**: Unicode symbols used throughout (→ not ->)
- **Diagram coherence**: Referenced diagrams have defined structure

### Cross-Document Consistency

- **CLAUDE.md sync**: Summaries match authoritative source files
- **Flow formula equivalence**: Quoted formulas match definitions
- **Version alignment**: plugin.json versions reflect changes

### Directive Language

- **Tool verb consistency**: Use `call` for tool invocations (strongest binding)
- **Third-person descriptions**: Skill descriptions use "This skill should..."
- **Imperative form**: Instructions use verb-first format

## Note Criteria

### Style and Convention

- **README sync**: README.md and README_ko.md match content
- **Comment clarity**: Complex logic has explanatory comments
- **Example completeness**: Examples are runnable and documented

### Optimization Opportunities

- **Context efficiency**: Large content moved to references/
- **Script efficiency**: Repeated logic extracted to scripts/
- **Progressive disclosure**: Information structured by access frequency

## Verification Decision Matrix

| Finding Type | Severity | Default Action |
|--------------|----------|----------------|
| Missing required section | Critical | Block with explanation |
| Undefined state transition | Critical | Block with explanation |
| Supersession conflict | Critical | Block with explanation |
| Incorrect categorical term | Concern | Surface, user decides |
| ASCII notation fallback | Concern | Surface, user decides |
| Directive verb mismatch | Concern | Surface, user decides |
| README out of sync | Note | Log for awareness |
| Version not bumped | Note | Log for awareness |

## User Override Policy

All findings are **advisory**. User may:

1. **Address**: Fix the issue before proceeding
2. **Dismiss**: Acknowledge and proceed (decision logged)
3. **Proceed anyway**: Skip all remaining findings (decision logged in commit)

Dismissal rationale should be recorded for future reference.
