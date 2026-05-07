---
name: zero-shot
description: This skill should be used when the user asks to "check zero-shot", "audit few-shot anchoring", "find example anchoring", or invokes /zero-shot. Reviews LLM-facing prose in this project's plugin SKILL.md files, project-local skills, agent prompts, and Output Style files for Zero-Shot compliance (principle-only over anchoring few-shot examples). Project-local contributor tooling.
allowed-tools: Read, Grep, Glob
---

# Zero-Shot Audit

Review LLM-facing prose for compliance with the Zero-Shot Instruction Preference: state principles, not anchoring examples. Project-local contributor utility; emits structured findings without writing fixes.

## Purpose

Surface few-shot patches that anchor the model to specific instances rather than letting it apply the principle to novel contexts. Findings are presented for review; the human author decides which to rewrite, mark as scope-clarifying, or dismiss.

## Inputs

**Manual invocation only** (interactive `/zero-shot`):
- The caller passes target file paths or a glob; with no argument, the skill enumerates the in-scope set under the working tree HEAD.
- Files are read at their working-tree state — the post-edit, pre-commit content the contributor is about to ship.

## Scope

**In scope** (LLM-facing prose where this principle applies):
- `*/skills/*/SKILL.md` — protocol and utility skill prose, outside formal blocks
- `.claude/skills/*/SKILL.md` — project-local skill prose, outside formal blocks
- `*/agents/*.md` — agent system-prompt prose
- `epistemic-cooperative/styles/*.md` — Output Style prose

**Out of scope** (the principle does not apply or examples serve a different purpose):
- Formal blocks within SKILL.md files: regions delimited by `── FLOW ──`, `── MORPHISM ──`, `── TYPES ──`, `── PHASE TRANSITIONS ──`, `── LOOP ──`, `── TOOL GROUNDING ──`, `── MODE STATE ──`, `── COMPOSITION ──`, and any `── <NAME> ──` block. Formal definition layers where notation patterns are content.
- Fenced code blocks (` ``` ... ``` `) — code is content, and example code attached to a definition is part of that definition.
- Files under `docs/`, `CLAUDE.md`, `README*.md`, `*/references/*.md` — contributor documentation where examples serve human comprehension.
- Files under `.claude/rules/` and `.claude/principles/` — rule-tier prose where examples may delineate scope rather than instantiate application.
- Files under `.insights/`, `memory/` — session and context substrates outside this skill's audit surface.

## What to evaluate

The principle prose is loaded into the session context by the Claude Code harness via `.claude/rules/derived-principles.md §Zero-Shot Instruction Preference`. Apply that definition directly; the prose is authoritative.

For each in-scope file, consider every prose passage outside formal blocks and code fences:

A **Zero-Shot signal** is a passage in LLM-facing prose where a principle is stated alongside few-shot examples or an enumerated example list whose primary effect is anchoring the model to specific instances rather than letting it apply the principle to novel contexts. The boundary test: "would removing this example increase the LLM's latitude in applying the principle to novel contexts?" If yes, the example is anchoring and a finding. Examples that delineate the principle's *scope* (clarifying what falls inside or outside the principle's domain) remain compliant; examples that instantiate a principle's *application* invite anchoring.

For each candidate finding, prefer the rewrite that strengthens the principle so examples become unnecessary. Treat ambiguous cases as `severity: low` and surface them for human triage.

## Output

Emit a single JSON object as the final assistant message.

```json
{
  "summary": {
    "files_audited": 0,
    "findings_total": 0,
    "by_severity": {"high": 0, "medium": 0, "low": 0}
  },
  "findings": [
    {
      "file": "<repo-relative path>",
      "line": 0,
      "severity": "high",
      "excerpt": "<verbatim text from the file — single line or short span>",
      "rationale": "<one sentence: how the example anchors application rather than delineates scope, and how a principle-only restatement would land>",
      "suggested_rewrite": "<a candidate restatement that preserves directive force without anchoring examples>"
    }
  ]
}
```

Severity calibration:

| Severity | Surface |
|----------|---------|
| `high` | Rules sections, Phase prose, agent system prompts — places where anchoring materially narrows downstream LLM application |
| `medium` | Distinctions, Composition notes, scope-boundary descriptions in supporting sections |
| `low` | Borderline cases where the example may serve scope clarification under one reading and anchoring under another |

When zero findings result, emit the JSON object with empty `findings` array and zero counts. The summary always emits.

## Self-application

This SKILL.md is itself in scope. The audit may surface findings against the prose above; rewrite in place when the rewrite preserves directive force.

## Distinction

| Surface | Mechanism | Failure mode handled |
|---------|-----------|---------------------|
| `verify` | Deterministic static checks (JSON schema, notation, cross-ref, graph, encapsulation BANNED patterns, language purity) | Structural drift between coupled artifacts; literal pattern leaks |
| `zero-shot` | Claude-judge semantic review of LLM-facing prose | Few-shot anchoring drift that survives structural validity |
| `white-bear` | Sibling semantic audit | Negative-framing drift |
| `encapsulation` | Sibling semantic audit | Contributor-knowledge assumption drift; BANNED-bypass rephrasing |

The verify surface runs deterministically at pre-commit and CI; semantic audits run on-demand via their slash commands. Each maintains its own confidence curve.

## Stage classification

Stage 2 evidence-collection instrument. Findings carry the N=1 dogfooding caveat inherent to a project where the audit definition, the rule prose, and the contributor are entangled. Architectural inscription — promoting any pattern observed across findings into a deterministic verify check — waits on Stage 2 variation-stable retention evidence accumulating across multiple PRs and contributors.
