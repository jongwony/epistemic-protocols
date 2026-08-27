---
name: realize
description: This skill should be used when the user asks to "run the eval", "test whether the protocol actually works at runtime", "check type realization", "measure protocol fulfillment", "run the type-realization suite", "does the gate actually stop", or wants runtime evidence that a protocol's formal transition contract is realized rather than an assessment of downstream artifact quality. Invoke explicitly with /realize and a skill argument.
allowed-tools: Read, Grep, Glob, Bash
---

# Type Realization

Measure whether one named protocol skill's declared contract is realized during an
actual run. The first argument is required; `/realize inquire` selects only the
registered `inquire` cases and graders. An unknown or omitted target fails before setup.

## Purpose

A protocol's formal blocks are runtime-normative: TYPES, PHASE TRANSITIONS, TOOL
GROUNDING and the Rules type the prose and carry the operational contract. Static
checks establish that a `SKILL.md` contains those blocks and enforce a bounded set of
structural invariants. Nothing establishes that a run follows their transitions.

This skill supplies evidence for that gap. It drives Claude Code or Codex across a
matrix of models and treatments, captures the JSONL trace, grades the deterministically
observable subset, and names the transcript judgments still owed. A complete automatic
cell can establish that collection occurred, the declared branch reached `Stop`, or
the zero-uncertainty branch reached `Proceed`; semantic ordering and rendered type
coverage remain manual until their specified judges are built.

## Judgment boundary

The object of judgment is the formal transition trace:

```text
X → context sufficiency → evidence collection as needed → residual deficit
  → formal branch → Stop | Proceed
```

Every score attaches to a node or edge in that trace. Once the selected branch is
observable, judgment ends. A plan, implementation, analysis, or other downstream
artifact is evidence that `Proceed` occurred; its quality, correctness, completeness,
and usefulness are outside `/realize`. Likewise, an unchanged substrate is evidence of
`Stop` only where the case granted the capability to proceed and the formal branch
required stopping. `references/grader-design.md` carries the witness design and the
separate oracle that artifact-quality evaluation would require.

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

./setup.sh inquire                           # default Claude runner
export CLAUDE_CODE_OAUTH_TOKEN="$(...)" && ./run.sh inquire

REALIZE_RUNNER=codex ./setup.sh inquire      # no credential consumed or stored
CODEX_API_KEY="$(...)" REALIZE_RUNNER=codex ./run.sh inquire
REALIZE_RUNNER=codex ./teardown.sh inquire

./teardown.sh inquire                        # Claude volatile state
```

For Claude, `setup.sh` prints the one interactive step — obtaining a token against the
target-specific isolated config directory. For Codex, setup creates bare/protocol homes
and installs the local protocol plugin only into the protocol home without reading or
writing a credential. `run.sh` requires `CODEX_API_KEY` and forwards it only to each
`codex exec` child; `codex login` is never called.

Read `references/runbook.md` before the first run. It records where runner isolation
lives, where the budget floor sits, and what each column of the report asserts.

## From CI

`.github/workflows/type-realization.yml` runs the Claude path on manual dispatch and
comments the report on the PR. Codex remains local-only until the matrix can run behind
the official action's credential proxy; repository-controlled harness code does not
receive an OpenAI key in Actions.

## Configuration

`harness.config.json` carries shared runner settings and a target registry. Each target
owns its plugin directory, skill id, invocation, and case set. `REALIZE_RUNNER=codex`
selects the committed Luna xhigh profile. Results are keyed by target, runner, and a
hash of the actual protocol/style treatment, so one skill or ablation cannot reuse
another's cache.

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

Each registered target needs at least a trigger-positive case, where its obligations
must fire, and a trigger-negative case, where firing is the failure. `inquire` is the
only registered target today; no result is implied for an unregistered protocol.

Both cases mount the same scaffold, deliberately: one observes whether a
file-discoverable fact was asked, the other whether a supplied parameter was re-asked,
and differing substrates would let a run pass one by luck.

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

`pass_k` is one only when every repetition passed its deterministic transition
predicates. The `manual` column counts scenario-specific transcript judgments excluded from that
composite; the report names them. For `inquire`, constructor coverage, classification,
collection-before-inquiry order, sufficiency rendering, and no-gate judgments remain
manual observations grounded by the grader files.

On Claude, `skill` says whether the protocol fired where it was available, and `n/a`
where there was no plugin to fire. Codex reports `trace-unavailable` for that column and
keeps plugin installation integrity separate from behavioral fulfillment.

Absolute transition-fulfilment rates are the reportable automatic quantity here, not
deltas. A baseline arm has no gate to stop at, so most predicates have no counterpart
there to subtract.

For Codex, the report records token use rather than inventing a dollar amount the CLI
did not emit. Every requested cell must produce a complete
`thread.started → turn.completed` pair. A launch failure, missing cell, unreadable
predicate, or treatment-integrity failure makes `run` or `report` exit non-zero while
preserving partial transcripts for inspection.

## Additional Resources

- **`references/runbook.md`** — the workflow, where isolation lives, how to widen the
  matrix, how to read the report.
- **`references/grader-design.md`** — why the deterministic axis is behaviour rather
  than wording, the obligation-to-predicate mapping, what the arms answer, and the
  structured-extraction and metamorphic-validation passes that are specified but not
  yet built.
- **`scripts/harness.mjs`** — the runner and the deterministic graders. Node standard
  library only.
- **`evals/scaffold.sh`** — the fixture both cases mount.
