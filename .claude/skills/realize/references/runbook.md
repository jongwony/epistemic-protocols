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
isolated config directory. Codex needs `CODEX_API_KEY` only while `run.sh` is active, or,
with `REALIZE_CODEX_AUTH=login`, a codex login already on the machine; setup neither
consumes nor stores either.

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
REALIZE_CODEX_AUTH=login REALIZE_RUNNER=codex ./run.sh inquire   # borrow this machine's login instead
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

### Login mode

`REALIZE_CODEX_AUTH=login` authenticates each `codex exec` child with the login already at
`$CODEX_HOME/auth.json` (default `~/.codex/auth.json`) instead of an API key. What keeps the
homes disposable:

- **The link lives for one child.** It is created in the arm's home immediately before a
  `codex exec` and removed immediately after, before the tree digest, the next cell's
  plugin integrity check, or grading. Setup, `codex plugin list` and the report therefore
  meet a home with no credential, exactly as in API-key mode, and no API key reaches any
  child.
- **A link, never a copy.** A ChatGPT login rotates its refresh token. A refresh written
  into a copy would retire the token the real file still holds and sign the user out; a
  refresh written through the link lands in the real file. The login itself is never read,
  printed or copied by the harness.
- **Checked after every child.** If the link is not still a link to the same file once the
  child exits, the run stops before another child starts. A regular `auth.json` found in its
  place may hold a refresh newer than the real login, so it is named and never deleted —
  not by the run, the exit trap, setup or teardown. Moving it back is the owner's call.
- **No overlap.** Cells are spawned synchronously, so one run has at most one child holding
  the login. A lock under the system temporary directory, keyed by the login's path, refuses
  a second login-mode run — another checkout's included — until the first finishes; a lock
  whose holder has exited is taken over. An interactive codex session using the same login
  is outside the lock, which is the same condition as two terminals signed in at once.
- **Removed on every exit path.** The run clears links in `finally` and on `SIGINT` /
  `SIGTERM`; `run.sh` repeats that from an exit trap (`harness.mjs release-login`) for a
  harness that never reached its own cleanup; `teardown.sh` does it at every depth.

A cell's home also loses everything but its config, installed plugin and `auth.json` slot
before the cell starts, in either mode: a multi-turn cell keeps its session on disk so it
can be resumed, and nothing one cell wrote should be readable by the next.

## Where isolation lives

Arm isolation is a property of the config directory rather than of a flag: an empty
`CLAUDE_CONFIG_DIR` is the arrangement observed to yield an empty plugin set, which is
what `setup.sh` builds per target. Codex takes the same shape through a separate
`CODEX_HOME` per arm, with `codex plugin list` confirming what that home holds before a
run is spent. The harness clears volatile state before each run and passes
`--no-session-persistence` wherever nothing resumes, so a re-run reads its own environment.

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
zero otherwise. `predicates` breaks it down — each predicate's passes over the repetitions it
could read — so a zero names the transition that failed. `turns`, on a scripted multi-turn
case, is the subject turns reached over those the script holds; short of it means a turn
changed the tree and the dialogue stopped there. The `manual` column is separate: it counts transcript judgments whose
grader files fix the observation criteria but which no automated judge executed.
Constructor coverage, semantic question ordering, and user-facing classification are
therefore never implied by an automatic pass.

`skill` says whether the protocol itself fired in an arm that had it available — the one
field separating a run that executed the contract from behaviour that merely resembles
it. It reads `n/a` in an arm with no plugin, where `integrity` already asserts the
absence, and `trace-unavailable` for Codex, whose JSONL carries no skill-invocation
event; a model naming the skill counts as invocation evidence nowhere.

Codex rows report token use from `turn.completed`, summed over every turn of the cell.
They leave cost blank because the CLI emits no dollar value, whichever way it
authenticated. Claude rows retain the emitted cost. A Codex timeout is a failed launch and is not cached or graded.

A cell whose launch never produced a transcript is not written or counted. `run` and
`report` both propagate that incompleteness, so a re-run still picks the cell up.

## Multi-turn cases, scripted

A case whose `case.yaml` declares `multi_turn` with `driver: harness` ships its user turns
as `reply-1.md`, `reply-2.md`, … and the harness sends them itself, on either runner: the
first turn opens a session (Codex without `--ephemeral`, Claude without
`--no-session-persistence`), and each reply resumes it with the same model and flags. The
transcript holds every turn, each preceded by a `realize.turn` marker naming the message that
opened it; the sidecar records the tree verdict after every turn. The one reply rule the
harness applies itself is mechanical: a turn that changed the tree ends the dialogue, since
it has left the gate. Every turn must produce its runner's complete start/end pair, or the
cell is a launch failure.

The script reads nothing of what the subject said, so each reply must stand at whichever
gate it lands on; the case's `oracle.md` shows how its replies were written to do that.
`grasp-adjudicable` and `grasp-unattachable` are the worked pair.

## Multi-turn cases, by hand

A case whose `oracle.md` must read the subject's turn to compose a reply is graded on turns
after the first, or on tool-call inputs, that no script can reach. Such a case declares
`multi_turn` without `driver: harness`; the harness refuses to run it, so it is not
registered in `harness.config.json` and is walked by hand with `scripts/turn.sh` (Claude
runner only). The case's `oracle.md` plays the user; the person running the case composes
nothing.

```bash
cd .claude/skills/realize/scripts
cell=/tmp/realize/elicit-aporia-1                # one directory per cell
mkdir -p "$cell/work" && (cd "$cell/work" && bash "$OLDPWD/../evals/elicit-scaffold.sh")

# turn 1: prompt.md without its frontmatter, then a blank line and the invocation line
export CLAUDE_CODE_OAUTH_TOKEN="$(...)" MAX_TURNS=24 TIMEOUT=600
sid=$(./turn.sh "$cell" ../../../../euporia turn-1.md)

# every later turn: the reply the oracle assembles from turn-<n>.txt / .jsonl
./turn.sh "$cell" ../../../../euporia reply-1.md "$sid"
```

1. **Scaffold** into `<cell>/work` with the script `case.yaml` names. Turn 1 writes the
   scaffold's digest to `turn-0.digest` before the subject runs.
2. **Turn 1** sends the case prompt's body. An arm carrying the protocol appends the
   invocation line — the target's line in `harness.config.json`, or for `/elicit`
   ``Use `/elicit` first, before any code gets written.`` — and passes the plugin
   directory; an arm without it passes `-`. `MAX_TURNS` and `TIMEOUT` come from the
   prompt's frontmatter.
3. **Apply the oracle** after every turn. It either ends the run or yields one reply,
   built only from its rules; the reply cap is in `case.yaml`.
4. **Resume** with the printed session id and the same plugin argument, so every turn
   carries identical flags.
5. **Grade** from the cell: each `turn-<n>.digest` against `turn-0.digest` is the tree
   witness per turn (the harness's digest: sorted paths, dotfiles and `__pycache__`
   excluded), `turn-<n>.jsonl` keeps tool-call inputs for the trace predicates, and the
   manual graders are judged from the transcript.

Isolation has the harness's shape: an empty `CLAUDE_CONFIG_DIR` at `<cell>/cfg`, the
protocol present only through `--plugin-dir`, and the variables through which an
enclosing Claude Code session would reach the child — its session identity and its
extra `CLAUDE.md` directories — removed. The session persists inside that config
directory, since resuming needs it.

## Widening

`harness.config.json` carries the matrix. Adding models multiplies runs directly, and
each run pays its own cache creation, so the cost scales with the cell count rather
than with the work done. Start narrow enough to confirm the graders discriminate,
then climb.

Pick a primary measurement model strong enough that a failure separates a defect in the
contract from a limit of the model.
