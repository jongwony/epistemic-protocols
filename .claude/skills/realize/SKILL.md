---
name: realize
description: This skill should be used when the user asks to "run the eval", "test whether the protocol actually works at runtime", "check type realization", "measure protocol fulfillment", "run the type-realization suite", "does the gate actually stop", or wants runtime evidence that a protocol's declared contract is honoured during an actual run rather than merely present in its file. Invoke explicitly with /realize.
allowed-tools: Read, Grep, Glob, Bash
---

# Type Realization

Measure whether a protocol's declared contract is realized during an actual run.

## Purpose

A protocol's formal blocks are runtime-normative: TYPES, PHASE TRANSITIONS, TOOL
GROUNDING and the Rules type the prose and carry the operational contract. Static
checks establish that a `SKILL.md` contains those blocks and that they are internally
coherent. Nothing establishes that a run honours them.

This skill closes that gap. It drives `claude -p` across a matrix of models and
configurations, captures the streamed trace, and grades the contract from what the run
did — whether the gate stopped, whether collection preceded inquiry, whether the
zero-uncertainty path relayed and proceeded.

Scope stops there. Whether a protocol is *worth using* is a different measurement,
needing a sample size this design cannot reach; `references/grader-design.md` states
why and what a credible version would require.

## When it applies

Reach for this after changing a protocol's phase structure, terminal conditions, gate
definition, or answer types — the places where a contract can become unrealizable
without any static check noticing. Reach for it also when adopting a new model, where
the question is whether the contract still holds on it.

Do not reach for it to check that a file is well-formed. That is `/verify`, it is
free, and it runs on every commit.

## Workflow

```bash
cd .claude/skills/realize/scripts

./setup.sh                                   # isolated config dir + per-arm settings
export CLAUDE_CODE_OAUTH_TOKEN="$(...)" && ./run.sh
./teardown.sh                                # volatile state between sessions
```

`setup.sh` prints the one interactive step — obtaining a token against the isolated
config directory — and refuses to proceed if `claude` or a recent enough Node is
missing. `run.sh` refuses to guess where that token lives.

Read `references/runbook.md` before the first run. It records four failures that each
produce a transcript indistinguishable from the protocol misbehaving: a flag that does
not isolate what it appears to, a settings key that does not disable what it names, an
environment variable whose near-miss is ignored in silence, and a budget ceiling set
below the floor. None of them announces itself.

## Configuration

`harness.config.json` carries the matrix: models, arms, cases, repetitions, budget
ceiling, permitted tools. Results are cached per cell, so widening the matrix and
re-running fills only what is new — climb the model ladder one rung at a time rather
than committing to it up front.

Prefer a capable model for the primary measurement. The weakest available one
exercises the safeguards but not the protocol, so a failure there cannot separate a
defect in the contract from a limit of the model.

## Arms

Four arms cross the protocol against the output style shipped beside it:

| arm | protocol | style | answers |
|---|---|---|---|
| `bare` | — | — | baseline |
| `style` | — | ✓ | sham — is the structure coming from form alone? |
| `protocol` | ✓ | — | is the `SKILL.md` self-contained, as required? |
| `protocol+style` | ✓ | ✓ | the deployed configuration |

The sham arm is not a construction. Published work on rule files for coding agents
found random rules helping as much as curated ones, which makes "a long structured
instruction is present" a live alternative explanation for any positive result. The
output style is that alternative made available as a control: it fixes gate shape and
observer markers while fixing none of a protocol's own obligations.

## Cases

Each protocol needs at least a trigger-positive case, where its obligations must fire,
and a trigger-negative case, where firing is the failure. Without the negative case a
run scores well by asking more, and a protocol that gates on everything outranks one
that gates well.

Both cases mount the same scaffold, deliberately: one is graded on whether a
file-discoverable fact was asked, the other on whether a supplied parameter was
re-asked, and differing substrates would let a run pass one by luck.

`evals/inquire-underspecified/` and `evals/inquire-fully-specified/` are the worked
pair for `/inquire`. Follow their shape when adding a protocol: a `prompt.md` carrying
frontmatter and the user's words, and one grader per obligation under `graders/`.

## Reading results

Read `integrity` first. It reports whether each arm's treatment actually applied. A row
whose integrity falls short of its run count is not evidence about the protocol, and
the report reprints those rows separately so they are not mistaken for findings.

`pass_k` is one only when every repetition passed. A mean hides the repetition that
failed, and one failure in k is what a user meets.

Absolute fulfilment rates are the reportable quantity here, not deltas. A baseline arm
has no gate to stop at, so most predicates have no counterpart there to subtract.

## Additional Resources

- **`references/runbook.md`** — the workflow, the four quiet failures, how to widen the
  matrix, how to read the report.
- **`references/grader-design.md`** — why the deterministic axis is behaviour rather
  than wording, the obligation-to-predicate mapping, what the arms answer, and the
  structured-extraction and metamorphic-validation passes that are specified but not
  yet built.
- **`scripts/harness.mjs`** — the runner and the deterministic graders. Node standard
  library only.
- **`evals/scaffold.sh`** — the fixture both cases mount.
