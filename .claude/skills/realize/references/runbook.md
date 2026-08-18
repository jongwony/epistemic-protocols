# Runbook

The workflow, and the four ways it fails quietly.

## What a run establishes

A protocol's formal blocks are runtime-normative: they type the prose and carry the
operational contract. Static checks confirm that a `SKILL.md` *contains* those blocks.
Nothing confirms that a *run* realizes them — that the gate actually stopped, that
collection actually preceded inquiry, that the relay actually proceeded.

This suite closes that gap and nothing wider. It does not measure whether a protocol
is worth using; that question needs a sample size this design cannot reach and a sham
arm whose construction is discussed in `grader-design.md`.

## Prerequisites

Node 22+, `claude` on PATH. `setup.sh` checks both and refuses rather than failing
halfway.

One step needs a human, once: obtaining a token against the isolated config directory.

```bash
CLAUDE_CONFIG_DIR=~/.claude-eval claude setup-token
```

Store the result wherever secrets belong on that machine. This repository does not
record its location and `run.sh` will not guess.

## The workflow

```bash
cd .claude/skills/realize/scripts

./setup.sh                                   # fixture + isolated config dir

export CLAUDE_CODE_OAUTH_TOKEN="$(...)" \
  && ./run.sh                                # run + report

./teardown.sh                                # volatile state
./teardown.sh --all                          # + config dir and scratch; setup again after
./teardown.sh --purge                        # + results (asks first)
```

Fetching the token inside the same command that consumes it keeps the value out of
files and out of shell history. Only the command's shape is visible, which is what
makes running it inline safe.

Results are cached per `(model, arm, case, repetition)`. Widening the matrix in
`harness.config.json` and re-running fills only the new cells, so the ladder can be
climbed one model at a time.

## Four quiet failures

Each of these produces a transcript indistinguishable from the protocol behaving
badly. They are listed because none of them announces itself.

### `--bare` does not exclude installed plugins

`--bare` skips hooks, LSP, plugin *sync*, auto-memory and `CLAUDE.md` discovery. It
does not unload plugins already installed from a marketplace. An arm that simply omits
`--plugin-dir` therefore still has the protocol under test present, and the comparison
becomes treatment against itself. Setting `enabledPlugins` to an empty object through
`--settings` does not remove them either.

The only arrangement observed to yield an empty plugin set is a `CLAUDE_CONFIG_DIR`
pointing at a directory with nothing in it. That is why isolation lives at the config
directory rather than in a flag.

### The token variable name is exact

`CLAUDE_CODE_OAUTH_TOKEN` is read. `CLAUDE_OAUTH_TOKEN` is ignored without comment,
and every run then fails with `Not logged in`, which reads as a broken `setup-token`
rather than a misspelled variable. `run.sh` guards this.

### A budget below the cache-creation cost fails every run identically

The first turn of a session pays to create the system-prompt cache; later turns read
it cheaply. A `maxBudgetUsd` set below that one-time cost exhausts the budget before
any work happens, every run terminates as `budget_exhausted`, and the `completed`
grader fails across the board — which reads as the protocol failing rather than the
ceiling being set under the floor. Raise the budget rather than interpreting the
result.

### Residue crosses runs unless it is cleared

Working directory names are stable across invocations, so a re-run lands on the same
project slug inside the config directory and can read what the previous run left. The
harness clears volatile state before each run for this reason, and passes
`--no-session-persistence` so less accumulates in the first place. A suite-level
teardown alone would not have covered it: the contamination is between runs, not after
them.

## Running it from CI

`.github/workflows/type-realization.yml` runs the same scripts on a dispatched
workflow. It has no `pull_request` trigger and is not meant to grow one: every run
spends real model budget, so binding it to pushes would charge for measurements nobody
asked for. Dispatch it from the Actions tab against a PR's branch once the PR is open.

With no `pr` input it resolves the PR for the dispatched ref and comments the report
there; with no PR it leaves the table in the job summary. The matrix inputs — models,
arms, cases, repetitions, budget ceiling — override the committed config for that run
only, through environment variables the harness reads. Editing the committed config
from CI would leave the run unreproducible from the checkout it claims to test.

The workflow needs one repository secret, `CLAUDE_CODE_OAUTH_TOKEN`, holding a token
obtained the same way as for a local run. The first step checks for it and says which
of "absent" and "invalid" it is, because the failure that follows otherwise reads as a
broken token rather than a missing one.

Isolation is nearly free there: a fresh runner has no marketplace plugins, so the
baseline arm is empty by construction rather than by arrangement. The isolated config
directory is still used, so that the same code path runs in both places and
`treatment_integrity` keeps reporting what actually loaded rather than what the
environment was assumed to provide.

Transcripts upload as an artifact. They are observations rather than a cache —
dispatching again produces different ones — so a table that needs a second reading is
recoverable only from that artifact.

## Reading the report

Read `integrity` before anything else. It reports whether each arm's treatment
actually applied — whether the plugin was loaded exactly when the arm says it should
be. A row whose integrity is short of its `n` is not evidence about the protocol, and
the report prints those rows again under a separate heading so they are not read as
results.

`pass_k` is one when every repetition passed, zero otherwise. A mean would hide the
repetition that failed, and one failure out of k is what a user actually meets.

## Widening

`harness.config.json` carries the matrix. Adding models multiplies runs directly, and
each run pays its own cache creation, so the cost scales with the cell count rather
than with the work done. Start narrow enough to confirm the graders discriminate,
then climb.

Avoid the weakest available model as the primary measurement. It exercises the
safeguards but not the protocol, so a failure there does not separate a defect in the
contract from a limit of the model.
