# Runbook

The workflow, and the constraints that shape how a run is set up and read.

## What a run establishes

A protocol's formal blocks are runtime-normative: they type the prose and carry the
operational contract. Static checks confirm that a `SKILL.md` *contains* those blocks.
Nothing confirms that a *run* realizes them — that the gate actually stopped, that
collection actually preceded inquiry, that the relay actually proceeded.

This suite records the run and closes only the predicates it actually executes. It also
ships manual grader criteria for semantic obligations, but recording a transcript does
not perform that review. It does not measure whether a protocol is worth using; that
question needs a sample size this design cannot reach and a sham arm whose construction
is discussed in `grader-design.md`.

The judgment ends at the formal `Stop | Proceed` branch described in `SKILL.md`. Files,
plans, or messages produced after `Proceed` are branch witnesses, not quality targets.
Read them only far enough to establish that the transition occurred.

## Prerequisites

Node 22+ and the selected runner (`claude` or `codex`) on PATH. `setup.sh` checks the
active runner and refuses rather than failing halfway.

Claude needs one human step once: obtaining a token against the target-specific
isolated config directory. Codex needs `CODEX_API_KEY` only while `run.sh` is active;
setup neither consumes nor stores it.

```bash
CLAUDE_CONFIG_DIR=~/.claude-eval/inquire claude setup-token
```

Store the result wherever secrets belong on that machine. This repository does not
record its location and `run.sh` will not guess.

## The workflow

```bash
cd .claude/skills/realize/scripts

./setup.sh inquire                           # fixture + isolated config dir

export CLAUDE_CODE_OAUTH_TOKEN="$(...)" \
  && ./run.sh inquire                        # run + report

./teardown.sh inquire                        # volatile state
./teardown.sh inquire --all                  # + config dir and scratch; setup again after
./teardown.sh inquire --purge                # + results (asks first)
```

Fetching the token inside the same command that consumes it keeps the value out of
files and out of shell history. Only the command's shape is visible, which is what
makes running it inline safe.

Results are cached per `(target, runner, model, treatment digest, arm, case, repetition)`.
Widening the matrix in `harness.config.json` and re-running fills only the new cells,
so the ladder can be climbed one model at a time.

For the Codex Luna xhigh profile:

```bash
REALIZE_RUNNER=codex ./setup.sh inquire
CODEX_API_KEY="$(...)" REALIZE_RUNNER=codex ./run.sh inquire
REALIZE_RUNNER=codex node ./harness.mjs report inquire
REALIZE_RUNNER=codex ./teardown.sh inquire
```

Codex setup creates disposable `bare` and `protocol` homes with no `auth.json` or login
step. The protocol home installs this checkout as a local marketplace and installs only
the selected plugin. The bare home has no marketplace or plugin state. `run` removes
`OPENAI_API_KEY` and `CODEX_ACCESS_TOKEN` from child environments and supplies
`CODEX_API_KEY` only to `codex exec`; plugin setup and integrity checks receive no
credential.
Codex supports only the `bare` and `protocol` arms because it has no deployed analogue
of Claude's output-style treatment. Codex case worktrees live under the system temporary
directory rather than below this repository, so parent `AGENTS.md` and git state cannot
be mistaken for fixture evidence.

Cache identity includes the runner and a digest of the actual protocol/style files.
Editing prose for an ablation therefore creates a new cell instead of reusing the
pre-ablation transcript. Codex also compares the installed cache's `SKILL.md` digest
to the source immediately before spending a run; an edit made after setup fails closed
with an instruction to rerun setup instead of measuring stale treatment bytes.

## Where isolation lives

Arm isolation is a property of the config directory rather than of a flag: an empty
`CLAUDE_CONFIG_DIR` is the arrangement observed to yield an empty plugin set, which is
what `setup.sh` builds per target. Codex takes the same shape through a separate
`CODEX_HOME` per arm, with `codex plugin list` confirming what that home holds before a
run is spent. The harness clears volatile state before each run and passes
`--no-session-persistence`, so a re-run reads its own environment.

Set `maxBudgetUsd` above the one-time system-prompt cache creation that a session's
first turn pays; later turns read that cache cheaply, so the floor is per session
rather than per turn.

## Running it from CI

`.github/workflows/type-realization.yml` runs the Claude path on a dispatched workflow.
It has no `pull_request` trigger and is not meant to grow one: every run spends real
model budget, so binding it to pushes would charge for measurements nobody asked for.
Dispatch it from the Actions tab against a PR's branch once the PR is open and select a
registered target.

With no `pr` input it resolves the PR for the dispatched ref and comments the report
there; with no PR it leaves the table in the job summary. The matrix inputs — models,
arms, cases, repetitions, budget ceiling — override the committed config for that run
only, through environment variables the harness reads, so the run stays reproducible
from the checkout it claims to test.

Validate a workflow edit by dispatching it — the dispatch is what exercises GitHub's
own expression parsing of every `run:` block, including inside shell comments. One
dispatch is free: `runs=three` is rejected by the harness before it launches anything,
so the job covers checkout, the secret check, the install and the setup without
spending model budget.

```bash
gh workflow run type-realization.yml --ref <branch> -f runs=three -f post_comment=false
```

The workflow checks `CLAUDE_CODE_OAUTH_TOKEN` and stops before setup when it is absent.
A present-but-invalid credential still fails later; `run` returns non-zero, `report`
marks every missing requested cell and also returns non-zero, and partial artifacts are
still uploaded and commented for diagnosis.

Codex is deliberately local-only here. Official OpenAI documentation requires the
Codex GitHub Action's credential proxy when a workflow checks out or runs
repository-controlled code; this harness does not yet have an action-backed adapter
that preserves its per-cell JSONL contract. The workflow therefore never exposes an
OpenAI API key to the checked-out harness.

Isolation is nearly free there: a fresh runner has no marketplace plugins, so the
baseline arm is empty by construction rather than by arrangement. The isolated config
directory is still used, so that the same code path runs in both places and
`treatment_integrity` keeps reporting what actually loaded rather than what the
environment was assumed to provide.

Transcripts upload as an artifact. They are observations rather than a cache —
dispatching again produces different ones — so a table that needs a second reading is
recoverable only from that artifact. Each transcript carries a `.meta.json` beside it
holding what could only be seen while the run was live, so the artifact regrades on its
own; the working directories it was read from are neither uploaded nor kept.

## Reading the report

Read `integrity` before anything else. It reports whether each arm's treatment
actually applied — whether the plugin was loaded exactly when the arm says it should
be. A row whose integrity is short of its `n` is not evidence about the protocol, and
the report prints those rows again under a separate heading so they are not read as
results.

`pass_k` is one when every repetition passed the deterministic transition composite,
zero otherwise. The `manual` column is separate: it counts transcript judgments whose
grader files fix the observation criteria but which no automated judge executed.
Constructor coverage, semantic question ordering, and user-facing classification are
therefore never implied by an automatic pass.

`skill` says whether the protocol itself fired in an arm that had it available — the one
field separating a run that executed the contract from behaviour that merely resembles
it. It reads `n/a` in an arm with no plugin, where `integrity` already asserts the
absence, and `trace-unavailable` for Codex, whose JSONL carries no skill-invocation
event; a model naming the skill counts as invocation evidence nowhere.

Codex rows report token use from `turn.completed`. They leave cost blank because the
CLI does not emit a dollar value for the API-key run. Claude rows retain the emitted
cost. A Codex timeout is a failed launch and is not cached or graded.

A cell whose launch never produced a transcript is not written or counted. `run` and
`report` both propagate that incompleteness, so a re-run still picks the cell up.

## Widening

`harness.config.json` carries the matrix. Adding models multiplies runs directly, and
each run pays its own cache creation, so the cost scales with the cell count rather
than with the work done. Start narrow enough to confirm the graders discriminate,
then climb.

Pick a primary measurement model strong enough that a failure separates a defect in the
contract from a limit of the model.
