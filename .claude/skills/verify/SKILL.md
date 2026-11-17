---
name: verify
description: This skill should be used when the user asks to "verify protocols", "check consistency before commit", "validate definitions", "run pre-commit checks", "verify soundness", or wants to ensure epistemic protocol quality. Invoke explicitly with /verify for pre-commit validation.
allowed-tools: Read, Grep, Glob, Bash(node *)
---

# Protocol Verification

Verify epistemic protocol consistency before commit through static checks.

## Purpose

Surface potential issues in protocol definitions without blocking commits. Follow Anthropic philosophy: transparency over enforcement, user agency over automation.

## Core Principles

| Principle | Implementation |
|-----------|----------------|
| **Surface, don't enforce** | Present findings; user decides action |
| **Zero-context scripts** | Static checks run without consuming context |
| **Explicit control** | User invokes `/verify` intentionally |
| **Graduated severity** | Critical / Concern / Note, assigned as `references/criteria.md` states |

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

**Checks performed**: `scripts/static-checks.js` is the orchestrator. Its head names the layer files it runs and what each layer holds, and each layer file's `CHECKS` list is that layer's inventory. `references/verification.md` carries why the non-obvious checks exist and what to do when one fires.

### Phase 2: Report

Present the result by severity, as `references/criteria.md` assigns it: each `fail` as Critical, each `warn` as Concern or Note, with its check, file, and message. Where a verdict was not obtained, say so rather than reporting a pass. Findings are advisory at `/verify`; what to fix, dismiss, or proceed past is the user's, under the override policy in `references/criteria.md`.

## Severity Reference

Consult `references/criteria.md` for which channel judges which kind of obligation, the severity definitions, and the override policy.

## Error Handling

| Error | Response |
|-------|----------|
| Script execution fails | Report error, offer manual check option |
| No issues found | Confirm clean state, proceed to commit |

## Integration Notes

### Standalone Usage

Most common pattern: invoke `/verify` before `/commit` command.

## Output Examples

### Clean State

```
## Verification Results

All checks passed.

- Static checks: all checks pass (0 fail, 0 warn)

Ready to commit.
```

### Issues Found

```
## Verification Results

### Critical (1 issue)
- lean-definition: hyphegesis/skills/conduct/SKILL.md - the Definition block does not elaborate

### Concerns (1 issue)
- directive-verb: hyphegesis/skills/conduct/SKILL.md - "Invoke AskUserQuestion" should be "call"

### Notes (1 observation)
- Version: hyphegesis plugin.json version not bumped since last change
```
