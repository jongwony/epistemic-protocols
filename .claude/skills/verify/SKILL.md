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

**Checks performed**: Structural conformance (JSON schema, Unicode notation, directive verbs, required sections, morphism anatomy, gate-type soundness), cross-reference and routing integrity (cross-reference integrity and scan, routing-index contract, onboard/catalog sync, graph integrity, precedence linear extension, partition invariant), drift prevention (version staleness, codex-manifest sync, spec-vs-impl drift, single-axis soundness, emit-load discipline, framing-readout enforcement, language purity), and packaging/contract sync (artifact self-containment, packaged-agent contract sync). The authoritative check inventory is the script itself (`scripts/static-checks.js`); the prose inventory is `docs/verification.md`.

### Phase 2: Expert Review

Spawn parallel Task subagents for LLM-based review — one per perspective (Type Theory / Category Theory, Instruction Design, Claude Code Ecosystem). Load each subagent's prompt template from `references/review-checklists.md` (single source of truth; do not duplicate the templates here — see Review Checklists below). Each template samples the protocols changed in the current diff, falling back to a representative sample when the diff is not protocol-scoped.

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

### Phase 4: Surface via Gate Interaction

Present findings via gate interaction. Format:

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
- Type Theory / Category Theory expert prompt template
- Instruction Design expert prompt template
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

- Static checks: all checks pass (0 fail, 0 warn)
- Type/Category review: No issues
- Instruction Design review: No issues

Ready to commit.
```

### Issues Found

```
## Verification Results

### Critical (1 issue)
- State machine totality: prothesis/skills/frame/SKILL.md - Undefined transition when |perspectives(C)| < 2

### Concerns (2 issues)
- Categorical terminology: prothesis/skills/frame/SKILL.md - limit/colimit may not match intended semantics
- Directive verb: prothesis/skills/frame/SKILL.md - "Invoke AskUserQuestion" should be "call"

### Notes (1 observation)
- Version: prothesis plugin.json version not bumped since last change

---
How to proceed?
```
