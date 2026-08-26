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

This skill closes that gap. It drives Claude Code or Codex across a matrix of models
and treatments, captures the JSONL trace, and grades the contract from what the run
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

./setup.sh                                   # default Claude runner
export CLAUDE_CODE_OAUTH_TOKEN="$(...)" && ./run.sh

REALIZE_RUNNER=codex ./setup.sh              # isolated Codex treatment homes
REALIZE_RUNNER=codex ./run.sh                 # GPT-5.6 Luna, xhigh by default
REALIZE_RUNNER=codex ./teardown.sh

./teardown.sh                                # Claude volatile state
```

For Claude, `setup.sh` prints the one interactive step — obtaining a token against the
isolated config directory. For Codex, it creates disposable bare/protocol homes, links
the existing ChatGPT login without copying it (or uses `OPENAI_API_KEY`), and installs
the local protocol plugin only into the protocol home.

Read `references/runbook.md` before the first run. It records runner and isolation
failures that each produce a transcript indistinguishable from the protocol
misbehaving. None of them announces itself.

## From CI

`.github/workflows/type-realization.yml` runs the same scripts on manual dispatch and
comments the report on the PR. It carries no automatic trigger: each run spends model
budget, so it fires when someone asks for a measurement, not when someone pushes.
`references/runbook.md` covers the inputs and the selected runner's required secret.

## Configuration

`harness.config.json` carries the matrix: runner, models, arms, cases, repetitions,
Claude budget ceiling, Codex reasoning effort and timeout, and permitted tools where
the runner exposes that control. `REALIZE_RUNNER=codex` selects the committed Luna
xhigh profile. Results are keyed by runner and a hash of the actual protocol/style
treatment, so a prose ablation cannot silently reuse its pre-ablation cache.

Prefer a capable model for the primary measurement. The weakest available one
exercises the safeguards but not the protocol, so a failure there cannot separate a
defect in the contract from a limit of the model.

## Arms

Claude has four arms crossing the protocol against the output style shipped beside it:

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

Codex has `bare` and `protocol` arms. Codex has no equivalent of Claude's shipped
output-style treatment, so requesting `style` or `protocol+style` fails rather than
simulating a different deployment condition. The Codex protocol treatment is present
only when `codex plugin list` reports that plugin installed and enabled in the isolated
protocol home while the bare home reports it absent. Codex JSONL currently exposes no
separate skill-invocation event, so its `skill` report cell states that limitation
rather than inferring invocation from the model's prose.

## Cases

Each protocol needs at least a trigger-positive case, where its obligations must fire,
and a trigger-negative case, where firing is the failure. Without the negative case a
run scores well by asking more, and a protocol that gates on everything outranks one
that gates well.

Both cases mount the same scaffold, deliberately: one is graded on whether a
file-discoverable fact was asked, the other on whether a supplied parameter was
re-asked, and differing substrates would let a run pass one by luck.

Write the prompt as the task alone. The line that invokes the protocol lives in
`harness.config.json` and reaches only the arms that have it — a prompt naming the
command makes an arm without the plugin gate on the missing tool instead of on the
task.

Read every clause of a negative case as an adversary would. A specification that looks
exhaustive can still leave a term underdetermined, and a correct protocol will open a
gate on it — recording a failure that belongs to the case author.

`evals/inquire-underspecified/` and `evals/inquire-fully-specified/` are the worked
pair for `/inquire`. Follow their shape when adding a protocol: a `prompt.md` carrying
frontmatter and the user's words, and one grader per obligation under `graders/`.

## Reading results

Read `integrity` first. It reports whether each arm's treatment actually applied — both
dimensions of it, the plugin and the output style, since either can fail silently and
leave two arms running the same treatment. A row whose integrity falls short of its run
count is not evidence about the protocol, and the report reprints those rows separately
so they are not mistaken for findings.

`pass_k` is one only when every repetition passed. A mean hides the repetition that
failed, and one failure in k is what a user meets. It reads `-` where something a
predicate needed was missing, which is not the same as the predicate failing.

On Claude, `skill` says whether the protocol fired where it was available, and `n/a`
where there was no plugin to fire. Codex reports `trace-unavailable` for that column and
keeps plugin installation integrity separate from behavioral fulfillment.

Absolute fulfilment rates are the reportable quantity here, not deltas. A baseline arm
has no gate to stop at, so most predicates have no counterpart there to subtract.

For Codex, the report records token use rather than inventing a dollar amount the CLI
did not emit. A complete `thread.started → turn.completed` pair is required before a
transcript is cached or graded; timeout and authentication failures remain failed
launches rather than protocol findings.

## Additional Resources

- **`references/runbook.md`** — the workflow, quiet failure modes, how to widen the
  matrix, how to read the report.
- **`references/grader-design.md`** — why the deterministic axis is behaviour rather
  than wording, the obligation-to-predicate mapping, what the arms answer, and the
  structured-extraction and metamorphic-validation passes that are specified but not
  yet built.
- **`scripts/harness.mjs`** — the runner and the deterministic graders. Node standard
  library only.
- **`evals/scaffold.sh`** — the fixture both cases mount.
