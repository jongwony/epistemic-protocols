---
name: style-audit
description: This skill should be used when the user asks to "audit phrasing style", "check white bear", "check zero-shot", "audit LLM-facing prose", "run style audit", or invokes /style-audit. Reviews LLM-facing prose in this project's plugin SKILL.md files, project-local skills, agent prompts, and Output Style files for White Bear (prohibition phrasing) and Zero-Shot (anchoring few-shot) compliance as defined in `.claude/rules/safeguards.md` and `.claude/rules/derived-principles.md`. Project-local contributor tooling.
allowed-tools: Read, Grep, Glob, Bash(gh *)
---

# Style Audit

Review LLM-facing prose for compliance with White Bear (positive framing) and Zero-Shot (principle-only) authoring principles. Project-local contributor utility; emits structured findings without writing fixes.

## Purpose

Surface phrasing patterns that invite LLM rationalization drift before they land on `main`. Findings are presented for review; the human author decides which to rewrite, mark as load-bearing, or dismiss.

## Inputs

**Manual invocation only** (interactive `/style-audit`):
- The caller passes target file paths or a glob; with no argument, the skill enumerates the in-scope set under the working tree HEAD.
- Files are read at their working-tree state — the post-edit, pre-commit content the contributor is about to ship.

CI invocation is currently disabled — only `workflow_dispatch` (manual run from GitHub UI) remains; the `pull_request` trigger is commented out until Stage 2 dogfooding completes (see §Stage classification).

## Scope

**In scope** (LLM-facing prose where these principles apply):
- `*/skills/*/SKILL.md` — protocol and utility skill prose, outside formal blocks
- `.claude/skills/*/SKILL.md` — project-local skill prose, outside formal blocks
- `*/agents/*.md` — agent system-prompt prose
- `epistemic-cooperative/styles/*.md` — Output Style prose

**Out of scope** (positively framed — these regions remain compliant by purpose):
- Formal blocks within SKILL.md files: regions delimited by `── FLOW ──`, `── MORPHISM ──`, `── TYPES ──`, `── PHASE TRANSITIONS ──`, `── LOOP ──`, `── TOOL GROUNDING ──`, `── MODE STATE ──`, `── COMPOSITION ──`, and any `── <NAME> ──` block. These are formal definition layers where notation patterns are content.
- Fenced code blocks (` ``` ... ``` `) — code is content, and example code attached to a definition is part of that definition.
- Files under `docs/`, `CLAUDE.md`, `README*.md`, `*/references/*.md` — contributor documentation where examples serve human comprehension.
- Files under `.claude/rules/` and `.claude/principles/` — axiom-tier and demoted-tier rule prose. White Bear avoidance applies to LLM-facing instruction surfaces (SKILL.md, agents, Output Style); rule-tier prose admits intentional negative formulations as discriminant signals (per `safeguards.md §White Bear Avoidance` operational test). One-pass audit across these files would erase calibration signals at intentionally preserved decision points.
- Files under `.insights/`, `memory/` — session and context substrates outside this skill's audit surface.

## What to evaluate

The principle prose for White Bear and Zero-Shot is loaded into the session context by the Claude Code harness via `.claude/rules/safeguards.md §White Bear Avoidance` and `.claude/rules/derived-principles.md §Zero-Shot Instruction Preference`. Apply those definitions directly; the prose is authoritative.

For each in-scope file, consider every prose sentence outside formal blocks and code fences:

- **White Bear signal** — a sentence in LLM-facing prose framed as a prohibition (do not, never, avoid, must not, should not, cannot) that admits a positive restatement preserving the directive's force. A sentence whose load-bearing meaning collapses without the prohibition (a safety boundary the LLM observes, a contract the LLM honors) remains compliant; the test is whether a positive restatement preserves both the directive's force and its meaning. Cited preserved-prohibition carve-outs (treat as compliant by purpose, surface only as `severity: low` if the rewrite preference is judgment-dependent): Prothesis Rule 14 (Phase 3 `Await` wait discipline — passive completion barrier vs active polling at the per-turn decision point), Aitesis substrate boundary (legitimate inference vs substrate violation per inference), Katalepsis Rule 11 (verification-gate 1-correct option design — comprehension verification vs decision-axis selection by purpose), Hermeneia Phase 2 articulation (user-articulated intent vs AI-imputed intent at the articulation decision point), Prosoche Stop-as-Gate (subagent return path vs main-agent gate interaction at the `GATE_DETECTED` decision point), Epharmoge Layer 2 auto-activation prohibition (deliberate user invocation vs AI speculative activation at protocol activation).

- **Zero-Shot signal** — a passage in LLM-facing prose where a principle is stated alongside few-shot examples or an enumerated example list whose primary effect is anchoring the model to specific instances rather than letting it apply the principle to novel contexts. Examples that delineate the principle's *scope* (clarifying what falls inside or outside the principle's domain) remain compliant; examples that instantiate a principle's *application* invite anchoring.

For each candidate finding, prefer the rewrite that preserves the directive's meaning while satisfying the principle. Treat ambiguous cases as `severity: low` and surface them for human triage.

## Output

Emit a single JSON object as the final assistant message. Downstream stages extract this object via `jq`.

```json
{
  "summary": {
    "files_audited": 0,
    "findings_total": 0,
    "by_signal": {"white_bear": 0, "zero_shot": 0},
    "by_severity": {"high": 0, "medium": 0, "low": 0}
  },
  "findings": [
    {
      "file": "<repo-relative path>",
      "line": 0,
      "signal": "white_bear",
      "severity": "high",
      "excerpt": "<verbatim text from the file — single line or short span>",
      "rationale": "<one sentence: which aspect of the principle this excerpt invites, and how a positive or principle-only restatement would land>",
      "suggested_rewrite": "<a candidate restatement that preserves directive force>"
    }
  ]
}
```

Severity calibration:

| Severity | Surface |
|----------|---------|
| `high` | Rules sections, Phase prose, agent system prompts — places where prohibition or anchoring materially shapes downstream LLM behavior |
| `medium` | Distinctions, Composition notes, scope-boundary descriptions in supporting sections |
| `low` | Borderline cases where the rewrite preference is judgment-dependent and a contributor may legitimately keep the original |

When zero findings result, emit the JSON object with empty `findings` array and zero counts. The summary always emits.

## Self-application

This SKILL.md is itself in scope. The audit may surface findings against the prose above; treat that as Stage 1 evidence and rewrite in place when the rewrite preserves directive force. Findings against this file are first-class — the audit's own definition is subject to the same review as any other in-scope file.

## Distinction

| Surface | Mechanism | Failure mode handled |
|---------|-----------|---------------------|
| `verify` | Deterministic static checks (JSON schema, notation, cross-ref, graph) | Structural drift between coupled artifacts |
| `style-audit` | Claude-judge semantic review of LLM-facing prose | Phrasing drift that survives structural validity |

The two surfaces are siblings: `verify` runs deterministically at pre-commit and CI; `style-audit` runs on-demand via `/style-audit` (CI invocation currently disabled — see §Stage classification). Each maintains its own confidence curve — semantic-judgment findings appear separately from deterministic structural failures.

## Stage classification

Stage 2 evidence-collection instrument. Findings carry the N=1 dogfooding caveat inherent to a project where the audit definition, the rule prose, and the contributor are entangled. Architectural inscription — promoting any pattern observed across findings into a deterministic verify check, or into a project-wide phrasing rule — waits on Stage 2 variation-stable retention evidence accumulating across multiple PRs and contributors.

**CI status**: PR-trigger CI invocation is currently disabled to extend Stage 2 dogfooding via manual `/style-audit` use; only `workflow_dispatch` (manual run from GitHub UI) remains in `.github/workflows/claude-style-audit.yml`, with the original `pull_request` trigger block preserved as inline comment. Re-enablement (uncomment the trigger block) is gated on accumulated use evidence demonstrating audit findings carry signal beyond N=1 contributor noise.
