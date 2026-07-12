---
name: white-bear
description: "Use when the user asks to \"check white bear\", \"audit prohibition phrasing\", \"find negative framing\", or invokes /white-bear. Read-only audit of LLM-facing prose: positive rationale over prohibition."
user_invocable: true
allowed-tools: Read, Grep, Glob
---

# White Bear Audit

A semantic audit of LLM-facing prose for the White Bear authoring principle: prefer positive rationale over negative prohibition. Read-only — it emits structured findings and writes no fixes. The human author decides which to rewrite, mark as load-bearing, or dismiss.

## Purpose

Surface prohibition-framed phrasing whose positive restatement would be followed more reliably, before it ships. Negative-framing drift survives deterministic structural checks — it is a meaning-level pattern, so a semantic reviewer catches what literal pattern matching cannot.

## Inputs

**Manual invocation only** (interactive `/white-bear`):
- The caller passes target file paths or a glob; with no argument, the skill enumerates the in-scope set under the working tree HEAD.
- Files are read at their working-tree state — the post-edit, pre-commit content the author is about to ship.

## Scope

**In scope** (LLM-facing prose where this principle applies):
- Skill instruction files (`*/skills/*/SKILL.md`), considered outside formal/definition blocks
- Agent system-prompt files (`*/agents/*.md`)
- Output-style files

**Out of scope** (positively framed by purpose, or the principle does not apply):
- Formal-definition blocks within instruction files — regions delimited by `── <NAME> ──` headers (FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, and peers). Notation patterns are the content there.
- Fenced code blocks (` ``` ... ``` `) — code is content, and example code attached to a definition is part of that definition.
- Human-facing documentation (README files, design notes, reference material) — examples serve human comprehension there.
- Rule-tier and principle-tier prose authored for contributors — such prose admits intentional negative formulations as discriminant signals; a one-pass rewrite would erase calibration signals at intentionally preserved decision points.
- Session and context substrates outside this audit's surface.

## What to evaluate

**The principle (stands alone).** LLM-facing instructions are followed more reliably when they state a positive rationale ("X is Y because Z") than when they forbid a target ("do not use W"). Negative injunctions bind behavior less reliably, and naming the forbidden target can make it more salient — the white bear effect: "don't think of a white bear" surfaces the white bear. For language models the operative ground is weak negation processing rather than ironic amplification, so the reliability gain holds even where the salience effect is faint.

For each in-scope file, consider every prose sentence outside formal blocks and code fences:

A **White Bear signal** is a sentence in LLM-facing prose framed as a prohibition (do not, never, avoid, must not, should not, cannot) that admits a positive restatement preserving the directive's force. A sentence whose load-bearing meaning collapses without the prohibition stays compliant; the test is whether a positive restatement preserves both the directive's force and its meaning.

**Section-level placement** — the principle's force varies by the section's role:
- **Runtime motivational prose** — Rules, Phase prose, agent system prompts: prose that directs what the LLM does at execution time. The forbidden target becomes the foreground attractor during application, so apply White Bear avoidance at full strength; the rewrite test below decides whether a prohibition stays.
- **Diagnostic substrate** — Anti-patterns sections, failure-case checklists, audit findings, review-vocabulary lists. The section's role is naming failure modes for detection, so negative or failure-case wording is the content. Treat as compliant by purpose when the section role is visible. Surface a finding only when a positive restatement would preserve both directive force *and* boundary meaning — usually `low` for human triage rather than `high`.

**Load-bearing prohibitions** (compliant by purpose; surface only as `low` when the rewrite preference is judgment-dependent): a prohibition that encodes a genuine safety boundary the model observes, a contract it honors, or a verification-by-design constraint — where a forbidden option is forbidden precisely so the verification or the discriminant boundary stays meaningful. Removing such a prohibition would erase the boundary, so it stays.

The rewrite test: a positive restatement is valid when it preserves both directive force and boundary meaning. If neither in-place rewrite nor relocation to a diagnostic section preserves both, the original prohibition stays. Treat ambiguous cases as `severity: low` and surface them for human triage.

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
      "rationale": "<one sentence: which aspect of the principle this excerpt invites, and how a positive restatement would land>",
      "suggested_rewrite": "<a candidate restatement that preserves directive force>"
    }
  ]
}
```

Severity calibration:

| Severity | Surface |
|----------|---------|
| `high` | Rules sections, Phase prose, agent system prompts — places where prohibition materially shapes downstream LLM behavior |
| `medium` | Distinctions, Composition notes, scope-boundary descriptions in supporting sections |
| `low` | Borderline cases where the rewrite preference is judgment-dependent and an author may legitimately keep the original |

When zero findings result, emit the JSON object with empty `findings` array and zero counts. The summary always emits.

## Self-application

This SKILL.md is itself LLM-facing prose and so is in scope. The audit may surface findings against the prose above; rewrite in place when the rewrite preserves directive force. Findings against this file are first-class — the audit's own definition is subject to the same review as any other in-scope file.

## Distinction

| Surface | Mechanism | Failure mode handled |
|---------|-----------|---------------------|
| Deterministic static checks | Literal pattern matching and structural validation | Structural drift between coupled artifacts; literal pattern leaks |
| `white-bear` | Claude-judge semantic review of LLM-facing prose | Negative-framing drift that survives structural validity |
| `zero-shot` | Sibling semantic audit | Few-shot anchoring drift |

Deterministic checks run at pre-commit and CI; this semantic audit runs on-demand via its slash command. Each maintains its own confidence curve.

## Confidence

An advisory, human-reviewed instrument. Findings are candidates for an author to weigh, not automatic edits; the audit illuminates the decision and leaves the judgment with the author. Promoting any recurring finding pattern into a deterministic check is a separate, evidence-gated step — it waits on a pattern proving stable across varied prose, not on a single audit run.
