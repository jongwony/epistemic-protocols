# Runbook

The procedure for one run, turn by turn. `SKILL.md` carries the measure and the design; this file
carries what a person (or an agent) walking the cells needs at each step.

## Before the first run

- `plan --dry-run` checks the arguments and the case's frozen sources and says whether the
  runner's CLI is on PATH; it writes nothing and calls no model.
- **Claude authentication** is whatever the child environment carries after isolation:
  `CLAUDE_CODE_OAUTH_TOKEN` (obtained as `/realize`'s runbook describes), or an `ANTHROPIC_*`
  route already configured on the machine. Every other `CLAUDE*` variable is removed.
  `--budget` caps each turn's spend so a runaway turn stops.
- **Codex authentication** is chosen at plan time. `--codex-auth api-key` (the default) forwards
  `CODEX_API_KEY` from the running process to each `codex exec` child and to nothing else.
  `--codex-auth login` borrows the login at `$CODEX_HOME/auth.json` (default
  `~/.codex/auth.json`) by symlinking it into the arm's home for the span of one exec, then
  checking and removing the link. It is never copied: a ChatGPT login rotates its refresh token,
  and a copy would strand the real one. A regular `auth.json` found in a home is named and left
  alone.

`plan` writes `results/<run>/run.json` and scaffolds every cell's work tree from the case's
`/realize` scaffold. `setup <run>` builds, for Codex, two homes — `bare` with no plugin,
`protocol` with this checkout's marketplace added and the protocol plugin installed — checks each
with `codex plugin list` and the installed `SKILL.md` digest, and receives no credential. A run is
one runner, one model (and effort, on Codex), one case, its reps and arms; run more models as
more runs and report them together.

## Walking a cell

Walk one cell at a time from `--open` to `note`. On Codex this is enforced per arm: a cell's first
turn resets its home's session state, so a home serves one cell until that cell is closed.

1. `turn <run> <cell> --open` sends the variant's opening request; the protocol arm also gets the
   `/realize` invocation line for this runner.
2. After every turn the runner prints whether the turn completed, whether the tree changed, and
   whether the treatment held, and names the file with the subject's text. Read the whole turn,
   not only its last paragraph: a relay can hand items back mid-turn and keep working. Then:
   - **The turn wrote an implementation**, or the oracle says to end the run: the dialogue ends.
     Anything handed back in that turn goes unanswered.
   - **The turn handed items back** and wrote no implementation: compose one reply with the
     variant's `oracle.md`, applied literally, write it to a file, and send `turn … --reply <file>`.
   - **The turn neither implemented nor handed anything back**: send `turn … --go` once. If the
     next turn still writes nothing, the dialogue ends without an implementation.
3. `note <run> <cell>` closes the cell — no further turn is accepted — and writes the notes
   template. `status <run>` shows per cell whether turn 1 stopped before code and at which turn
   the tree first changed: a check on step 2, not a substitute for reading the turns.

## Notes: the items

Fill `items` in `results/<run>/<cell>/notes.json` by reading every turn against the opening
request (`turn-1.msg`). One entry per decision item the AI raised that the opening request did
not contain:

```json
{ "turn": 1, "via": "asked", "item": "limit value", "span": "How many requests per minute should each caller get?" }
```

- `span` — the verbatim text of that turn (`turn-<n>.txt`) that raised the item; a list of
  strings where the item is split across the turn. `note` refuses a span it cannot find in the
  turn named.
- `via` — `asked` when the item was put as a question for the user to answer; `presented` when it
  was shown as an option, a proposed default, or a stated assumption the user could recognize,
  pick or correct.
- An item counts once per cell, at the turn that first raised it. A question about the existing
  code (which framework, where config lives) is not a decision the user owed the request, and a
  request for permission to write, run or install is about the harness; neither is an item.
- An item raised in the turn that also wrote the implementation still counts; its turn number,
  beside the turn of the first implementation, shows that it reached the user after the code.
- `items` stays `[]` when the AI raised none. `notes` holds a sentence or two a later reader can
  check the list against.

Run `note <run> <cell>` again to check the file. Deciding what is one item, and whether the opening
request already contained it, is the note-writer's reading; the spans are there so another reader
can dispute one item rather than the whole count.

## Integrity and isolation

A cell's treatment integrity is checked on every turn:

- **Claude:** the plugin appears in the stream's init event exactly on the protocol arm, the
  protocol skill is loaded on the first turn exactly there, and the turn produced a complete
  init/result pair. Each cell has its own empty `CLAUDE_CONFIG_DIR`; the protocol arrives only
  through `--plugin-dir`.
- **Codex:** before the turn, `codex plugin list` in the arm's home shows the plugin enabled
  exactly on the protocol arm, and the installed `SKILL.md` matches this checkout's; the turn
  produced `thread.started` and `turn.completed`; in login mode the link was still the same link
  when the exec returned. A broken link stops the run after recording the turn. The session
  rollout is copied into the cell's records, since the next cell's reset removes it from the
  home. Network is enabled inside the workspace-write sandbox so that Codex cells, like Claude
  cells, can install packages.

Every turn's raw stream (`turn-<n>.jsonl`), the message sent (`turn-<n>.msg`), the subject's text
(`turn-<n>.txt`) and its meta are kept in the records. Work trees live under the system temporary
directory, away from the repository, so a subject climbing to parent directories finds no
`AGENTS.md` and no git state of this project. Isolation stays partial — a subject can still list
sibling cells — so `report` audits every recorded command and file path for other cells, the
records, the repository, and parent climbs, writes the hits to each cell's `path-audit.json`, and
names the flagged cells. A flag is a reason to read that cell before quoting it, not a verdict.

A turn that did not complete fails the cell's integrity; a failed cell is listed apart and counted
in no arm. `reset <run> <cell>` moves the cell's records aside and scaffolds it afresh; say in the
write-up that the cell was re-run and why.

## Report and teardown

`report <run> …` writes `results.json` and `report.md` (to the run directory, or `--out` for
several runs) and exits non-zero when a planned cell is not reportable yet, naming why. Per variant
it quotes the opening request, then per model and arm the items per cell and in the arm (asked /
presented), then each cell's items with their spans. `teardown <run>` removes the work trees,
config directories and Codex homes, after removing any login link; the records stay.
`release-login <run>` removes only the links, for an interrupted Codex turn.

## Host realization: why a Codex protocol cell writes code before any answer arrives

On Claude, the protocol arm can hand its questions back and end the turn: the answer arrives as
the next turn, before any code exists. Inside `codex exec` there is no such path. Its system
prompt offers a `request_user_input_async` tool and tells the model to continue work that does
not depend on the answer and to proceed on a stated assumption when an optional clarification
gets no reply, while a non-interactive exec delivers no answer within a turn. So a Codex protocol
cell's items typically arrive as `presented` in the same turn as the implementation. That is
platform realization, not a defect in the protocol arm: do not add a wait rule to the protocol arm
alone. The system prompt is the CLI's and can change; each Codex cell's
`codex-sessions/rollout.jsonl` records the one its turn ran under.

## Adding a case

A case is a directory under `cases/` with a `case.json`: the `/realize` target whose plugin and
invocation lines it uses, the scaffold and each variant's prompt and oracle paths (reused by path,
never copied), the go line, and `frozenAgainst` / `frozenInvocation` — the sha256 of every reused
file and invocation line when the case was made. A changed request or oracle is a new case
directory, since items read against two different requests do not compare.
