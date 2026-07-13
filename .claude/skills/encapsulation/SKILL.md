---
name: encapsulation
description: "This skill should be used when the user asks to \"audit plugin encapsulation\", \"check self-containment semantics\", \"find contributor-knowledge assumptions\", or invokes /encapsulation. Reviews LLM-facing prose in this project's plugin SKILL.md files and plugin description metadata for Plugin Encapsulation compliance: prose that assumes contributor documentation knowledge or rephrases banned references to bypass deterministic checks. Project-local contributor tooling."
allowed-tools: Read, Grep, Glob
---

# Encapsulation Audit

The project-local instance of the **semantic-audit engine** (`docs/audit-engine.md`). The shared mechanism — read-only Claude-judge review, the scope shape, severity calibration, self-application stance, and on-demand slash invocation — is defined in that engine document; read it for the parts this skill holds in common with its published siblings. Below is this instance's principle parameter and the one place its output schema extends the engine's base.

This instance audits LLM-facing prose for Plugin Encapsulation: the runtime contract surface (`Skill.md` plus plugin description metadata) must be self-contained and intelligible without contributor documentation. Project-local — its principle is coupled to this repo's deterministic encapsulation check and contributor model, and so (unlike `white-bear` and `zero-shot`) it is not decouplable into a portable skill. Read-only: it emits structured findings and writes no fixes.

## Purpose

Surface encapsulation drift that the deterministic verify check (`artifact-self-containment` BANNED patterns) cannot catch — prose that assumes contributor sidecar knowledge in plain language, or rephrases banned references to evade pattern matching. Findings are presented for review; the human author decides which to rewrite, mark as load-bearing, or dismiss.

## Inputs

**Manual invocation only** (interactive `/encapsulation`):
- The caller passes target file paths or a glob; with no argument, the skill enumerates the in-scope set under the working tree HEAD.
- Files are read at their working-tree state — the post-edit, pre-commit content the contributor is about to ship.

## Scope

The engine's scope shape applies, specialized to the runtime contract surface this principle governs:

**In scope** (the runtime contract surface where this principle applies):
- `*/skills/*/SKILL.md` — protocol and utility skill prose (full document; the runtime contract surface)
- `.claude-plugin/plugin.json` `description` field — plugin description metadata (discovery/routing layer)

**Out of scope**:
- Files under `docs/`, `CLAUDE.md`, `README*.md`, `*/references/*.md` — contributor documentation, where contributor-knowledge prose is appropriate by purpose.
- Files under `.claude/rules/` and `.claude/principles/` — rule prose authored for contributors.
- `.claude/skills/*/SKILL.md` — project-local contributor tooling, not part of the marketplace runtime contract surface (this skill is itself in this category).
- Files under `.insights/`, `memory/` — session and context substrates outside this skill's audit surface.

## What to evaluate

**The principle.** The packaged runtime contract is `Skill.md` plus plugin description metadata; the surface must be self-contained, with no external references (axiom identifiers, rule file paths, design-philosophy concepts, mission/vision docs) that require reading contributor documentation. The deterministic verify check covers literal pattern matches; this audit covers semantic encapsulation.

Two signal types — this instance extends the engine's single-failure-kind shape with a failure-kind dimension:

**`contributor_assumption`** — a prose passage that assumes contributor documentation knowledge to be intelligible at the runtime contract surface. The reader of the runtime contract is the LLM agent acting on the protocol, plus the user invoking the skill — neither has read `.claude/rules/`, `.claude/principles/`, or `docs/`. Test: "Does this sentence remain intelligible when read with only the SKILL.md itself and standard background knowledge?" If a sentence references a project-internal concept by name without inline definition, and the concept is not defined elsewhere in the same SKILL.md, the sentence is a finding.

**`bypass_rephrasing`** — a prose passage that conveys a banned reference's content without using its banned token. The deterministic check passes; the encapsulation invariant fails. Test: "Would the deterministic check have flagged this if the original token had remained?" If yes, it is a bypass-rephrasing finding.

For each candidate finding, prefer the rewrite that carries the meaning into the runtime surface (compile the relevant rule into `Skill.md` Rules sections per CLAUDE.md guidance) or replaces it with a self-contained restatement. Treat ambiguous cases as `severity: low` and surface them for human triage.

## Output

Emit a single JSON object as the final assistant message. This is the engine's base schema plus a failure-kind dimension (`by_signal` in the summary, `signal` on each finding):

```json
{
  "summary": {
    "files_audited": 0,
    "findings_total": 0,
    "by_signal": {"contributor_assumption": 0, "bypass_rephrasing": 0},
    "by_severity": {"high": 0, "medium": 0, "low": 0}
  },
  "findings": [
    {
      "file": "<repo-relative path>",
      "line": 0,
      "signal": "contributor_assumption",
      "severity": "high",
      "excerpt": "<verbatim text from the file — single line or short span>",
      "rationale": "<one sentence: which contributor knowledge is assumed, or which banned reference's content is being rephrased>",
      "suggested_rewrite": "<a candidate restatement that compiles the meaning into the runtime surface or removes the assumption>"
    }
  ]
}
```

Severity calibration (per the engine):

| Severity | Surface |
|----------|---------|
| `high` | Rules sections, Phase prose, plugin description — places where contributor assumption materially blocks LLM operation |
| `medium` | Distinctions, Composition notes, scope-boundary descriptions in supporting sections |
| `low` | Borderline cases where the assumption is recoverable from surrounding SKILL.md context or where the bypass interpretation is judgment-dependent |

When zero findings result, emit the JSON object with empty `findings` array and zero counts. The summary always emits.

## Self-application

This SKILL.md sits in `.claude/skills/`, which is project-local contributor tooling — out of the marketplace runtime contract surface and therefore not subject to this audit's scope. The principle still applies in spirit: the prose above should be intelligible without contributor sidecar references, and rewrites should preserve that.

## Distinction

| Surface | Mechanism | Failure mode handled |
|---------|-----------|---------------------|
| `verify` `artifact-self-containment` | Deterministic literal pattern matching against BANNED tokens | Banned reference tokens leaking into the runtime surface |
| `encapsulation` | Claude-judge semantic review of runtime-surface prose | Contributor-knowledge assumption; BANNED-bypass rephrasing |
| `white-bear` | Sibling semantic audit (published, portable) | Unnecessary competing-target mention drift |
| `zero-shot` | Sibling semantic audit (published, portable) | Few-shot anchoring drift |

The verify check and this audit are complementary on the encapsulation axis: deterministic pattern matching catches token leaks; semantic review catches meaning leaks that survive token absence.

## Stage classification

Stage 2 evidence-collection instrument. Findings carry the N=1 dogfooding caveat inherent to a project where the audit definition, the rule prose, and the contributor are entangled. Architectural inscription — promoting any pattern observed across findings into a new BANNED token in the deterministic check — waits on Stage 2 variation-stable retention evidence accumulating across multiple PRs and contributors.
