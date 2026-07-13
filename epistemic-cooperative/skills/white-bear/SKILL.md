---
name: white-bear
description: "Use when the user asks to \"check white bear\", \"audit prohibition phrasing\", \"find negative framing\", or invokes /white-bear. Read-only audit of LLM-facing prose for unnecessary competing-target mentions: prohibition framing, superseded-path mention, negated anchoring."
user_invocable: true
allowed-tools: Read, Grep, Glob
---

# White Bear Audit

A semantic audit of LLM-facing prose for the White Bear authoring principle: keep attention on the necessary path — a mention of a competing non-target (a forbidden act, a superseded path, a rejected alternative) earns its place only when it is load-bearing. Read-only — it emits structured findings and writes no fixes. The human author decides which to rewrite, mark as load-bearing, or dismiss.

## Purpose

Surface prose that holds the model's attention on an unnecessary competing target, before it ships. Three forms of one failure: **prohibition framing** names a forbidden act, **superseded-path mention** names a retired path, **negated anchoring** names a rejected alternative — each keeps the non-target available as a competing action candidate. This drift survives deterministic structural checks — it is a meaning-level pattern, so a semantic reviewer catches what literal pattern matching cannot.

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

**The principle (stands alone).** LLM-facing instructions are followed more reliably when they state only what carries the intended behavior — a positive rationale ("X is Y because Z"), the current path, the affirmed characterization. Naming an unnecessary competing target holds attention on it — the white bear effect: "don't think of a white bear" surfaces the white bear. The human ironic-process effect does not transfer mechanistically to language models; each form carries its own operative ground:

- **Prohibition framing** ("do not use W") — weak negation processing: negative injunctions bind behavior less reliably than positive directives. The strongest-evidenced form.
- **Superseded-path mention** (a positive mention of a path the same instruction retires in favor of a replacement) — option availability: naming the retired path can keep it available as a competing action candidate. A conservative authoring heuristic rather than an established causal law.
- **Negated anchoring** ("X is not A but B" where the rejected alternative A carries no load) — the contrast anchors attention on the rejected alternative; the same discipline is recorded from practice as an editing convention (prefer positive predicates over negated anchoring).

For each in-scope file, consider every prose sentence outside formal blocks and code fences:

A **White Bear signal** is a sentence in LLM-facing prose that names a competing non-target — a forbidden act, a superseded path, or a rejected alternative — where stating only the intended path preserves the directive's force. The three named forms are working hypotheses, an open list rather than an exhaustive taxonomy; the constitutive test is necessity: a mention whose load-bearing meaning collapses without it stays compliant, and a mention the directive survives without is a finding.

**Section-level placement** — the principle's force varies by the section's role:
- **Runtime motivational prose** — Rules, Phase prose, agent system prompts: prose that directs what the LLM does at execution time. The named non-target becomes the foreground attractor during application, so apply White Bear avoidance at full strength; the rewrite tests below decide whether a mention stays.
- **Diagnostic substrate** — Anti-patterns sections, failure-case checklists, audit findings, review-vocabulary lists. The section's role is naming failure modes, superseded paths, or rejected alternatives for detection, so negative or failure-case wording is the content. Treat as compliant by purpose when the section role is visible. Surface a finding only when a rewrite would preserve both directive force *and* boundary meaning — usually `low` for human triage rather than `high`.

**Load-bearing boundary mentions** (compliant by purpose; surface only as `low` when the rewrite preference is judgment-dependent): a prohibition or competing-target mention stays when it encodes a genuine safety boundary the model observes, a contract it honors, a verification-by-design constraint, a legacy-input condition, a migration target, or a genuine fallback. A path may be retired for execution while its mention remains necessary to recognize or verify the boundary; removing such a mention would erase the boundary, so it stays.

**The rewrite test (constitutive core, all forms)**: a rewrite is valid when stating only the intended path — the positive restatement, the replacement path, the affirmed characterization — preserves both directive force and boundary meaning. If neither in-place rewrite nor relocation to a diagnostic section preserves both, the original stays. Treat ambiguous cases as `severity: low` and surface them for human triage.

**Superseded-path test** (per-form refinement): surface a finding only when all of these hold — the prose is an in-scope runtime directive; the retired path and its replacement serve the same effect at the same decision point; the replacement is complete for the governed case; the mention presents the retired path as an actionable alternative; and removing it preserves directive force, boundary meaning, applicability, and required legacy handling. A mention required for diagnosis, migration, compatibility, fallback, provenance, or input recognition stays — naming the path is its content there.

**Negated-anchoring test** (per-form refinement): in directive prose, "X is not A but B" is a finding when the rejected alternative is unnecessary — restating as "X is B" preserves the directive's force. The contrast stays when it is load-bearing: a live decision among alternatives, a boundary-bearing comparison, or a discriminant the reader needs to tell adjacent cases apart.

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
      "form": "<prohibition-framing | superseded-path | negated-anchoring | emergent>",
      "excerpt": "<verbatim text from the file — single line or short span>",
      "rationale": "<one sentence: which form this excerpt instantiates, and how stating only the intended path would land>",
      "suggested_rewrite": "<a candidate restatement that preserves directive force>"
    }
  ]
}
```

Severity calibration:

| Severity | Surface |
|----------|---------|
| `high` | Rules sections, Phase prose, agent system prompts — places where a competing-target mention materially shapes downstream LLM behavior |
| `medium` | Distinctions, Composition notes, scope-boundary descriptions in supporting sections |
| `low` | Borderline cases — uncertain replacement, contested necessity, judgment-dependent rewrite preference — where an author may legitimately keep the original |

When zero findings result, emit the JSON object with empty `findings` array and zero counts. The summary always emits.

## Self-application

This SKILL.md is itself LLM-facing prose and so is in scope. The audit may surface findings against the prose above; rewrite in place when the rewrite preserves directive force. Findings against this file are first-class — the audit's own definition is subject to the same review as any other in-scope file.

## Distinction

| Surface | Mechanism | Failure mode handled |
|---------|-----------|---------------------|
| Deterministic static checks | Literal pattern matching and structural validation | Structural drift between coupled artifacts; literal pattern leaks |
| `white-bear` | Claude-judge semantic review of LLM-facing prose | Unnecessary competing-target mentions (prohibition framing, superseded-path mention, negated anchoring) that survive structural validity |
| `zero-shot` | Sibling semantic audit | Few-shot anchoring drift |

Deterministic checks run at pre-commit and CI; this semantic audit runs on-demand via its slash command. Each maintains its own confidence curve.

## Confidence

An advisory, human-reviewed instrument. Findings are candidates for an author to weigh, not automatic edits; the audit illuminates the decision and leaves the judgment with the author. Promoting any recurring finding pattern into a deterministic check is a separate, evidence-gated step — it waits on a pattern proving stable across varied prose, not on a single audit run.
