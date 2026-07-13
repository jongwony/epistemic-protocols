# Semantic-Audit Engine

Single source for the **principle-parameterized semantic-audit engine**: a read-only
Claude-judge review of LLM-facing prose that surfaces structured findings for a human to
act on. Three skills are instances of this engine, differing only in one parameter — the
principle they audit for. This document is the canonical engine definition; each instance
SKILL.md is a realization of it.

## Why an engine

The audit skills share ~80% identical scaffolding (Inputs, Scope, Output JSON schema +
severity calibration, Distinction, confidence note, Self-application). They differ only in
the **principle parameter**. Naming the shared mechanism once — here — lets a contributor
maintain the scaffolding in a single place and keep the instances aligned, instead of
editing three near-duplicate files independently and letting them drift.

## The engine (shared mechanism)

A semantic audit is fixed on every axis except its principle:

- **Read-only.** Tools are `Read, Grep, Glob`. The audit emits findings; it never writes
  fixes. The human author decides which findings to apply, mark as load-bearing, or dismiss.
- **Claude-judge, not deterministic.** The engine complements deterministic static checks
  (which catch literal pattern leaks and structural drift) by judging *meaning* the static
  layer cannot reach. The two surfaces are complementary, each keeping its own confidence
  curve.
- **Fixed scope shape.** In scope: LLM-facing prose — skill instructions (`SKILL.md`),
  agent system prompts, output-style files — considered sentence by sentence *outside*
  formal/definition blocks and fenced code. Out of scope: formal-definition blocks (notation
  is content there), fenced code, human-facing documentation (READMEs, design notes,
  reference material where examples serve human comprehension), and session/context
  substrates. An instance may add or subtract scope members that its principle specifically
  governs, but the in/out *shape* above is shared.
- **On-demand invocation.** Each instance is a manually invoked slash command. With no
  argument it enumerates its in-scope set under the working tree; with paths or a glob it
  audits those. Files are read at working-tree state — the post-edit, pre-commit content the
  contributor is about to ship.
- **JSON findings + severity.** A single JSON object is the final message (base schema
  below). Severity is calibrated the same way across instances: `high` where the principle
  materially shapes downstream LLM behavior (Rules, Phase prose, agent system prompts);
  `medium` in supporting sections (Distinctions, Composition notes, scope-boundary
  descriptions); `low` for borderline cases a contributor may legitimately keep.
- **Self-application.** Each instance SKILL.md is itself LLM-facing prose, so it is in its
  own audit scope. Findings against the audit's own definition are first-class.

### Base output schema

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
      "rationale": "<one sentence tying the excerpt to the principle and the rewrite landing>",
      "suggested_rewrite": "<a candidate restatement that preserves directive force>"
    }
  ]
}
```

When zero findings result, the object emits with an empty `findings` array and zero counts.
The summary always emits. An instance whose principle has more than one failure *kind* may
add a discriminating dimension (a `by_signal` count in `summary` and a `signal` field on each
finding) — this is an additive extension of the base schema, not a departure from it.

## The principle parameter

An instance is the engine plus one principle, given as a triple:

| Component | What it supplies |
|---|---|
| **Principle name** | The authoring principle the audit enforces, defined inline in the instance (self-contained — the instance does not require reading any other file to state what it checks). |
| **Signal definition** | The "What to evaluate" rule: what a finding *is* for this principle — the positive test that distinguishes a violation from compliant-by-purpose prose. |
| **Severity emphasis** | Which surfaces this principle weights toward `high`, and which cases default to `low` for human triage. |

## Instances and drift tracking

| Instance | Home | Tier | Principle parameter |
|---|---|---|---|
| `white-bear` | `epistemic-cooperative/skills/white-bear/` | Published (portable) | Necessary-path attention over unnecessary competing-target mentions |
| `zero-shot` | `epistemic-cooperative/skills/zero-shot/` | Published (portable) | Principle statement over anchoring few-shot examples |
| `encapsulation` | `.claude/skills/encapsulation/` | Project-local (not shipped) | This repo's runtime-contract self-containment: no contributor-knowledge assumption, no rephrasing that bypasses the deterministic BANNED-pattern check |

**How each instance relates to this engine.** Published instances must be self-contained
(the project's packaged runtime-contract surface is verified to carry no references to
contributor files), so `white-bear` and `zero-shot` inline the engine scaffolding as
**compiled copies** — the same realization the project already uses for its runtime emit-load
disciplines. The project-local `encapsulation` instance is not part of the packaged surface,
so it **references this document** directly rather than copying it, and its principle stays
coupled to this repo's deterministic check and contributor model (it is not decouplable, by
design).

**Sync obligation.** When the engine scaffolding here changes (scope shape, output schema,
severity calibration, self-application clause), update the compiled copies in the two
published instances to match. `encapsulation` references this document for the shared
mechanism prose and needs no copy edit for that, but it embeds its own **extended copy** of
the output schema (the base plus its `by_signal`/`signal` failure-kind dimension) and a
specialized severity-calibration table — so a change to the engine's base output schema or
severity calibration needs a matching `encapsulation` edit too. Its principle parameter also
stays coupled to the repo's deterministic encapsulation check — keep them aligned when that
check's BANNED patterns move.
