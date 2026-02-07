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

**Perspective 1: Type Design**

```
Spawn Task subagent with prompt:

You are a Type Theory Expert analyzing protocol type design.

**Soundness check**:
- Type signatures: well-formed domain/codomain
- State machines: transition totality
- Flow consistency: types match phase transitions
- Tool grounding: TOOL GROUNDING ↔ PHASE TRANSITIONS consistency

**Tool Grounding check**:
- External operations (extern) have corresponding [Tool] notation in PHASE TRANSITIONS
- Internal operations marked with "no external tool"
- Escape behavior semantics match protocol context (fallback/Silence/cancel)

**Necessity check**:
- Cardinality constraints (|P| ≥ 2): prose sufficient given Esc interrupt?
- Refinement types: marginal benefit for LLM interpretation?
- Principle: no type checker exists; social enforcement via prose is primary

Files: prothesis/skills/prothesis/SKILL.md, syneidesis/skills/syneidesis/SKILL.md, hermeneia/skills/hermeneia/SKILL.md

Focus on Definition sections (FLOW, TYPES, PHASES, TOOL GROUNDING). Output JSON with findings array.
```

**Perspective 2: Specification Clarity**

```
Spawn Task subagent with prompt:

You are a Specification Clarity Expert analyzing LLM interpretability.

**LLM behavior modification**:
- Activation clarity: trigger conditions unambiguous
- Priority conflicts: supersession domain overlap
- Instruction parsability: rules actionable without implicit reasoning
- Tool binding clarity: TOOL GROUNDING section readable and actionable

**Notation complexity**:
- Flow formulas: understandable at a glance?
- Standard notation preferred (|P| ≥ 2) over custom constructors (Set²⁺)
- Section structure: FLOW → TYPES → PHASES → TOOL GROUNDING → STATE sufficient?
- [Tool] notation in PHASE TRANSITIONS: adds clarity or noise?

Principle: specification is for human/LLM comprehension, not compiler verification.

Files: prothesis/skills/prothesis/SKILL.md, syneidesis/skills/syneidesis/SKILL.md, hermeneia/skills/hermeneia/SKILL.md, CLAUDE.md

Focus on Definition, Mode Activation, Priority, Rules, TOOL GROUNDING sections. Output JSON with findings array.
```

**Perspective 3: Claude Code Ecosystem**

```
Spawn Task subagent with prompt:

You are a Claude Code Ecosystem Expert.

**Pattern validation**:
- AskUserQuestion mandates enforced (tool call, not text)
- Epistemic transitions correctly typed (deficit → resolved type signatures)
- User agency preserved (no automatic decisions)

**False positive filtering** (dismiss concerns from other perspectives):
- "Automatic intensity reduction" → not needed (AskUserQuestion provides control)
- "Automatic deactivation" → not needed (user can interrupt via Esc)
- "Topic boundary detection" → context-dependent (model judgment acceptable)
- "Type-level cardinality" → prose sufficient (low violation cost, Esc recovery)

Files: prothesis/skills/prothesis/SKILL.md, syneidesis/skills/syneidesis/SKILL.md, hermeneia/skills/hermeneia/SKILL.md, CLAUDE.md

Focus on Mode Activation, Rules, UX patterns. Output JSON with findings and filtered arrays.
```

All three subagents run in parallel. Collect results before proceeding.

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
- Type Design expert prompt template
- Specification Clarity expert prompt template
- Claude Code Ecosystem expert prompt template
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
