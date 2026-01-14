---
name: verify
description: This skill should be used when the user asks to "verify protocols", "check consistency before commit", "validate definitions", "run pre-commit checks", "verify soundness", or wants to ensure epistemic protocol quality. Invoke explicitly with /verify for pre-commit validation.
allowed-tools: Read, Grep, Glob, Bash(node *), Task, AskUserQuestion
---

# Protocol Verification

Verify epistemic protocol consistency before commit through static checks and expert review.

## Purpose

Surface potential issues in protocol definitions without blocking commits. Follow Anthropic philosophy: transparency over enforcement, user agency over automation.

## Core Principles

| Principle | Implementation |
|-----------|----------------|
| **Surface, don't enforce** | Present findings; user decides action |
| **Zero-context scripts** | Static checks run without consuming context |
| **Explicit control** | User invokes `/verify` intentionally |
| **Graduated severity** | Critical / Concern / Note categorization |

## Workflow

### Phase 1: Static Checks

Run `scripts/static-checks.js` against project root. This script executes without loading into context.

```bash
node ${SKILL_DIR}/scripts/static-checks.js ${PROJECT_ROOT}
```

**Output format**:
```json
{
  "pass": [{ "check": "...", "file": "...", "message": "..." }],
  "fail": [{ "check": "...", "file": "...", "message": "..." }],
  "warn": [{ "check": "...", "file": "...", "message": "..." }]
}
```

**Checks performed**:
- JSON schema validation (plugin.json required fields, version format)
- Unicode notation consistency (→ not ->, ∥, ∩)
- Directive verb enforcement (`call` not `invoke`/`use` for tools)
- Cross-reference integrity (CLAUDE.md ↔ source files)
- Required sections in protocols (Definition, Mode Activation, Protocol, Rules)

### Phase 2: Expert Review

Spawn parallel Task subagents for LLM-based review. Each perspective analyzes independently.

**Perspective 1: Type/Category Theory**

```
Spawn Task subagent with prompt:

You are a Type Theory and Category Theory Expert.

Analyze protocol definitions for mathematical soundness:
- Type signatures: well-formed domain/codomain
- Categorical constructions: correct limit/colimit usage
- State machines: transition totality

Files: prothesis/skills/prothesis/SKILL.md, syneidesis/skills/syneidesis/SKILL.md, hermeneia/skills/hermeneia/SKILL.md

Focus on Definition sections. Output JSON with findings array.
```

**Perspective 2: System Prompt Engineering**

```
Spawn Task subagent with prompt:

You are a System Prompt Engineer.

Analyze protocol definitions as system prompts for LLM behavior modification:
- Activation clarity: trigger conditions unambiguous for model interpretation
- Priority conflicts: supersession domain overlap; competing directives
- Instruction parsability: rules actionable without implicit reasoning
- Failure modes: edge cases where model might misinterpret instructions

Files: prothesis/skills/prothesis/SKILL.md, syneidesis/skills/syneidesis/SKILL.md, hermeneia/skills/hermeneia/SKILL.md, CLAUDE.md

Focus on Mode Activation, Priority, and Rules sections. Output JSON with findings array.
```

**Perspective 3: Claude Code Ecosystem**

```
Spawn Task subagent with prompt:

You are a Claude Code Ecosystem Expert.

Validate protocol designs against Claude Code interaction patterns:
- AskUserQuestion mandates enforced (tool call, not text)
- Epistemic transitions correctly typed (unknown unknowns vs known unknowns)
- User agency preserved (no automatic decisions)

Filter potential false positives from other perspectives:
- "Automatic intensity reduction" → not needed (AskUserQuestion provides control)
- "Automatic deactivation" → not needed (user can interrupt via Esc)
- "Topic boundary detection" → context-dependent (model judgment acceptable)

Files: prothesis/skills/prothesis/SKILL.md, syneidesis/skills/syneidesis/SKILL.md, hermeneia/skills/hermeneia/SKILL.md, CLAUDE.md

Focus on Mode Activation, Rules, and UX patterns. Output JSON with findings and filtered arrays.
```

**Perspective 4: Notation Complexity**

```
Spawn Task subagent with prompt:

You are a Specification Readability Expert.

Review formal notation for complexity vs clarity balance:
- Flow formulas: can be understood at a glance?
- Type definitions: standard notation (|P| ≥ 2) preferred over custom constructors (Set²⁺)?
- Section structure: FLOW → TYPES → PHASES → STATE sufficient?
- Removed cruft: CATEGORICAL NOTE, BOUNDARY, DYNAMIC DISCOVERY necessary?

Principle: Specification is for human/LLM comprehension, not compiler verification.
Simpler notation with prose constraints is preferred over complex type-level encoding.

Files: prothesis/skills/prothesis/SKILL.md, syneidesis/skills/syneidesis/SKILL.md, hermeneia/skills/hermeneia/SKILL.md

Focus on Definition sections. Output JSON with findings array.
```

**Perspective 5: Type Constraint Necessity**

```
Spawn Task subagent with prompt:

You are a Pragmatic Type Theory Expert.

Analyze whether type-level constraints are necessary or over-engineering:
- Cardinality constraints (|P| ≥ 2): prose sufficient given Claude Code's Esc interrupt?
- Refinement types: marginal benefit for LLM interpretation?
- Enforcement regime: social (prose) vs mechanical (type checker) — which applies here?

Decision criteria:
- Violation cost: ~5 seconds user retry = low stakes
- Runtime environment: no type checker, only LLM interpretation
- User control: Esc key provides recovery mechanism

Recommend: keep/remove/simplify type constraints with rationale.

Files: prothesis/skills/prothesis/SKILL.md, syneidesis/skills/syneidesis/SKILL.md, hermeneia/skills/hermeneia/SKILL.md

Focus on TYPES sections. Output JSON with findings array.
```

All five subagents run in parallel. Collect results before proceeding.

### Phase 3: Synthesize Findings

Combine static check results with expert review findings. Categorize by severity:

| Severity | Static Check Source | LLM Review Source |
|----------|--------------------|--------------------|
| **Critical** | `fail` array | findings with `severity: "critical"` |
| **Concern** | `warn` array (structural) | findings with `severity: "concern"` |
| **Note** | `warn` array (stylistic) | findings with `severity: "note"` |

Identify convergence (all perspectives agree) and divergence (perspectives differ).

Apply Claude Code Ecosystem expert's `filtered` array to dismiss false positives from other perspectives.

### Phase 4: Surface via AskUserQuestion

Call AskUserQuestion tool to present findings. Format:

```
## Verification Results

### Critical (n issues)
- [issue 1]: [location] - [description]
- [issue 2]: [location] - [description]

### Concerns (n issues)
- [issue 1]: [location] - [description]

### Notes (n observations)
- [observation 1]

### Filtered (Claude Code context)
- [filtered issue]: [reason dismissed]

---
Select action:
```

**Options to present**:
1. **Fix critical issues** - Address critical findings before commit
2. **Review concerns** - Examine each concern individually
3. **Proceed anyway** - Commit with decision logged
4. **Cancel** - Abort verification

### Phase 5: Handle User Decision

| Decision | Action |
|----------|--------|
| Fix critical | Show specific fixes, await approval for each |
| Review concerns | Present concerns one by one with dismiss/address options |
| Proceed anyway | Log decision, suggest commit message annotation |
| Cancel | End verification, no changes |

**Commit message annotation** (if proceeding with issues):

```
[verify: n critical, m concerns acknowledged]
```

## Severity Reference

Consult `references/criteria.md` for detailed severity definitions and decision matrix.

## Review Checklists

Consult `references/review-checklists.md` for:
- Type/Category Theory expert prompt template
- System Prompt Engineering expert prompt template
- Claude Code Ecosystem expert prompt template
- Notation Complexity expert prompt template
- Type Constraint Necessity expert prompt template
- Known issues checklist
- Synthesis template

## Error Handling

| Error | Response |
|-------|----------|
| Script execution fails | Report error, offer manual check option |
| Subagent timeout | Report partial results, continue with available data |
| No issues found | Confirm clean state, proceed to commit |

## Integration Notes

### With Prothesis

Verification may trigger perspective selection if findings require analysis approach decision.

### With Syneidesis

Critical findings surface as high-stakes gaps. Syneidesis gap detection may augment verification.

### Standalone Usage

Most common pattern: invoke `/verify` before `/commit` command.

## Output Examples

### Clean State

```
## Verification Results

All checks passed.

- Static checks: 12 pass, 0 fail, 0 warn
- Type/Category review: No issues
- Instruction Design review: No issues

Ready to commit.
```

### Issues Found

```
## Verification Results

### Critical (1 issue)
- State machine totality: prothesis.md:10 - Undefined transition when |perspectives(C)| < 2

### Concerns (2 issues)
- Categorical terminology: prothesis.md:35 - limit/colimit may not match intended semantics
- Directive verb: reflexion/SKILL.md:32 - "Invoke AskUserQuestion" should be "call"

### Notes (1 observation)
- Version: prothesis plugin.json version not bumped since last change

---
How to proceed?
```
