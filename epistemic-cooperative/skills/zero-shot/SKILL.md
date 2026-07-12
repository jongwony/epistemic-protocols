---
name: zero-shot
description: "Use when the user asks to \"check zero-shot\", \"audit few-shot anchoring\", \"find example anchoring\", or invokes /zero-shot. Read-only audit of LLM-facing prose: principle over anchoring examples."
user_invocable: true
allowed-tools: Read, Grep, Glob
---

# Zero-Shot Audit

A semantic audit of LLM-facing prose for the Zero-Shot Instruction Preference: state principles, not anchoring examples. Read-only — it emits structured findings and writes no fixes. The human author decides which to rewrite, mark as scope-clarifying, or dismiss.

## Purpose

Surface few-shot patches that anchor the model to specific instances rather than letting it apply the principle to novel contexts. Anchoring drift survives deterministic structural checks — it is a meaning-level pattern, so a semantic reviewer catches what literal pattern matching cannot.

## Inputs

**Manual invocation only** (interactive `/zero-shot`):
- The caller passes target file paths or a glob; with no argument, the skill enumerates the in-scope set under the working tree HEAD.
- Files are read at their working-tree state — the post-edit, pre-commit content the author is about to ship.

## Scope

**In scope** (LLM-facing prose where this principle applies):
- Skill instruction files (`*/skills/*/SKILL.md`), considered outside formal/definition blocks
- Agent system-prompt files (`*/agents/*.md`)
- Output-style files

**Out of scope** (the principle does not apply or examples serve a different purpose):
- Formal-definition blocks within instruction files — regions delimited by `── <NAME> ──` headers (FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, and peers). Notation patterns are the content there.
- Fenced code blocks (` ``` ... ``` `) — code is content, and example code attached to a definition is part of that definition.
- Human-facing documentation (README files, design notes, reference material) — examples serve human comprehension there.
- Rule-tier and principle-tier prose authored for contributors — where examples may delineate scope rather than instantiate application.
- Session and context substrates outside this audit's surface.

## What to evaluate

**The principle (stands alone).** LLM-facing instructions state principles, not examples. When a rendering rule, behavioral guideline, or structural constraint can be expressed as a principle, it does not need few-shot examples or category-level mapping lists appended to it. Few-shot examples create a soft-table effect — anchoring the model to specific instances rather than letting it apply the principle to novel contexts. A principle that needs examples to be understood is underspecified; the fix is to sharpen the principle, not to patch it with examples.

For each in-scope file, consider every prose passage outside formal blocks and code fences:

A **Zero-Shot signal** is a passage in LLM-facing prose where a principle is stated alongside few-shot examples or an enumerated example list whose primary effect is anchoring the model to specific instances rather than letting it apply the principle to novel contexts. The boundary test: "would removing this example increase the LLM's latitude in applying the principle to novel contexts, without losing the output-format or behavioral reliability that the containing instruction depends on?" If yes, the example is anchoring and a finding.

Two exemptions keep an example compliant:
- **Scope-delineating examples** — examples that clarify what falls inside or outside the principle's domain, rather than instantiating its application.
- **Reliability-anchoring examples** — examples whose primary effect is stabilizing an output format or anchoring a subtle, high-failure-rate behavior. Removing those costs adherence, not latitude.

Examples that instantiate a principle's *application* outside these two exemptions invite anchoring and are findings.

For each candidate finding, prefer the rewrite that strengthens the principle so application examples become unnecessary; retain a minimal high-signal exemplar when it stabilizes format or a subtle, high-failure-rate behavior. Treat ambiguous cases as `severity: low` and surface them for human triage.

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

This SKILL.md is itself LLM-facing prose and so is in scope. The audit may surface findings against the prose above; rewrite in place when the rewrite preserves directive force.

## Distinction

| Surface | Mechanism | Failure mode handled |
|---------|-----------|---------------------|
| Deterministic static checks | Literal pattern matching and structural validation | Structural drift between coupled artifacts; literal pattern leaks |
| `zero-shot` | Claude-judge semantic review of LLM-facing prose | Few-shot anchoring drift that survives structural validity |
| `white-bear` | Sibling semantic audit | Negative-framing drift |

Deterministic checks run at pre-commit and CI; this semantic audit runs on-demand via its slash command. Each maintains its own confidence curve.

## Confidence

An advisory, human-reviewed instrument. Findings are candidates for an author to weigh, not automatic edits; the audit illuminates the decision and leaves the judgment with the author. Promoting any recurring finding pattern into a deterministic check is a separate, evidence-gated step — it waits on a pattern proving stable across varied prose, not on a single audit run.
