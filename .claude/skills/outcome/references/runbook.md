# Runbook

The procedure for one run, turn by turn, and the constraints that shape it. `SKILL.md` carries
the design; this file carries what a person (or an agent) walking the cells needs at each step.

## Before the first run

- **Node 22+** and the runner's CLI on PATH. `plan --dry-run` checks the arguments and the
  case's frozen sources and reports which prerequisites are present; it writes nothing and calls
  no model.
- **Python 3.11+ with venv and pip.** `setup` builds the scorer venv once, from the case's
  `scorer-requirements.txt`, under the state directory. The pins are exact because a different
  `slowapi` or `limits` can move a functional verdict.
- **Claude authentication** is whatever the child environment carries after isolation:
  `CLAUDE_CODE_OAUTH_TOKEN` (obtained as `/realize`'s runbook describes), or an `ANTHROPIC_*`
  route already configured on the machine. Every other `CLAUDE*` variable is removed.
- **Codex authentication** is chosen at plan time. `--codex-auth api-key` (the default) forwards
  `CODEX_API_KEY` from the running process to each `codex exec` child and to nothing else.
  `--codex-auth login` borrows the login at `$CODEX_HOME/auth.json` (default
  `~/.codex/auth.json`) by symlinking it into the arm's home for the span of one exec, then
  checking and removing the link. It is never copied: a ChatGPT login rotates its refresh token,
  and a copy would strand the real one. A regular `auth.json` found in a home is named and left
  alone, never deleted.

## Plan and setup

`plan` validates the arguments, writes `results/<run>/run.json`, and scaffolds every cell's work
tree from the case's `/realize` scaffold. `setup <run>` builds the scorer venv if absent and, for
Codex, two homes: `bare` with no plugin, `protocol` with this checkout's marketplace added and
the protocol plugin installed. Setup checks each home with `codex plugin list` and the installed
`SKILL.md` digest, and receives no credential.

A run is one runner, one model (and effort, on Codex), one case, its reps, arms and budget. Run
more models as more runs and report them together.

## Walking a cell

Walk one cell at a time from `--open` to its final snapshot. On Codex this is enforced per arm:
a cell's first turn resets its home's session state, so a home serves one cell until that cell's
final snapshot.

After every turn the runner prints whether the turn completed, whether the tree changed, and
whether the treatment held, and names the file with the subject's text. Read the whole turn,
not only its last paragraph: a relay can hand items back mid-turn and keep working.

### Phase A

1. `turn <run> <cell> --open` sends the variant's task; the protocol arm also gets the
   `/realize` invocation line for this runner.
2. Decide the next step from the turn just read:
   - **The turn wrote an implementation** (the tree changed and the change is an attempt at the
     task, not a scratch file): phase A ends. Anything the turn handed back goes unanswered.
     Take `snap <run> <cell> A`.
   - **The turn handed items back** and wrote no implementation: compose one reply with the
     variant's `oracle.md` (`/realize`'s `inquire-underspecified/oracle.md` or
     `inquire-fully-specified/oracle.md`), write it to a file, and send `turn … --reply <file>`.
     Apply the oracle literally; the person composing it adds nothing.
   - **The turn neither implemented nor handed anything back**, or the oracle says to end the
     run with no implementation yet: send `turn … --go` once. If the next turn still writes
     nothing, phase A ends without an implementation; take snapshot A anyway. The report counts
     that cell as unfinished work.
3. `status <run>` shows, per cell, whether turn 1 stopped before code and at which turn the tree
   first changed — a check on the judgment in step 2, not a substitute for reading the turn.

### Phase B

1. `turn <run> <cell> --phase-b` sends the case's lead line followed by the fully specified
   request. It refuses until snapshot A exists, so the phase boundary cannot move afterwards.
2. After each phase-B turn: if nothing was handed back, phase B ends. Otherwise reply once per
   turn by the fully specified oracle's policy — a permission request gets `Yes, go ahead.`,
   anything else `It's all in my message — go with what I wrote.` — and stop after three
   replies.
3. `snap <run> <cell> final` scores the final tree and writes the A-to-final diff.

### Notes: the manual judgments

`note <run> <cell>` writes a template the first time and validates it afterwards. Fill it from
the transcript and the two snapshots:

- `phaseA_turns`, `phaseB_turns` — prefilled from the phase-B turn; they must partition the
  turns in order and agree with where the snapshots were taken.
- `q_explicit` — items the subject asked the user to answer in phase A. `q_items_total` — every
  item it handed back as the user's to settle, including proposed defaults left open for
  objection. A question asked mid-turn and then not waited on still counts.
- `questions_phaseA` — the items, one short line each.
- `manual.A`, `manual.final` — the checklist items the case marks manual (for this case R6, R8,
  R12), 0 or 1 each, confirmed by reading the snapshot with the printed automatic evidence as a
  guide.
- `reply_items` — present when the case has an answer-form fixture: one entry per phase-A reply
  line that carries a table value, prefilled with its turn, line, text and the oracle rules found
  in it. Fill `item` with the verbatim text of the item that line answers, copied from the
  subject turn just before it — the item as handed back, heading and body, not a summary; a list
  of spans where the item is split. `note` checks each excerpt against that turn and fails on an
  entry that names no sent line. Add `review: [{ "label": …, "why": … }]` only for a label the
  fixture cannot assign (`reframed`, `deferred`); it is reported apart and never enters the share.
  Validating writes `answer-forms.json` and prints every line left unclassified with its reason.
- `notes_phaseA`, `notes_phaseB` — what happened, in a few sentences; these are what a later
  reader of the report checks a number against.

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
  rollout is copied into the cell's records, since it holds any injected skill block and the
  next cell's reset removes it from the home. Network is enabled inside the workspace-write
  sandbox so that Codex cells, like Claude cells, can install packages.

Work trees live under the system temporary directory, away from the repository, so a subject
climbing to parent directories finds no `AGENTS.md` and no git state of this project; records
live in the repository's gitignored `results/`. Isolation stays partial — a subject can still
list sibling cells under the temporary directory — so `report` audits every recorded command
and file path for other cells, the records, the repository, and parent climbs, writes the hits to
each cell's `path-audit.json`, and names the flagged cells. A flag is a reason to read that cell
before quoting it, not a verdict.

A turn that did not complete is recorded and fails the cell's integrity. `reset <run> <cell>`
moves the cell's records aside and scaffolds it afresh; a Codex cell's reset also releases its
home.

## Report and teardown

`report <run> …` writes `results.json` and `report.md` (to the run directory, or `--out` for
several runs) and exits non-zero when a planned cell is not reportable yet, naming why.
`references/report-format.md` defines everything in it. `teardown <run>` removes the work trees,
config directories and Codex homes, after removing any login link; the records stay.
`release-login <run>` removes only the links, for an interrupted Codex turn.

## Host realization: why a Codex protocol cell writes code before any answer arrives

On Claude, the protocol arm can hand its questions back and end the turn: the user's answer
arrives as the next turn, before any code exists. A Codex protocol cell has no such path inside
`codex exec`, and so its first implementation is written before any answer can reach it:

- The Codex system prompt offers a `request_user_input_async` tool and tells the model to
  continue work that does not depend on the answer while it waits, and to proceed on a stated
  assumption when an optional clarification gets no reply. Only an answer the model itself
  classes as required keeps dependent work pending.
- `codex exec` is non-interactive. Nothing can deliver an answer inside a turn, so an asked
  question stays unanswered until the turn ends, and a model that classed it as optional goes on
  to implement with defaults.

The protocol still fires on that host — the skill is injected or read, and the questions are
written out — and a relay that presents and proceeds is a legitimate realization of `/inquire`.
It is the only one this host offers within a turn. That is platform realization, not a defect in
the protocol arm: do not add a wait rule, or any instruction the bare arm does not also get, to
the protocol arm alone. That would measure a stronger intervention than the shipped contract and
credit the protocol with what the harness added. A Codex result from this runner measures the
protocol as this host realizes it; whether letting an answer arrive mid-turn changes that is an
open measurement-design question.

The system prompt is the host's and can change with the CLI. Each Codex cell's
`codex-sessions/rollout.jsonl` records the one that turn ran under; read it there before relying
on the description above for a new CLI version.

## Adding a case

A case is a directory under `cases/` with:

- `case.json` — the `/realize` target whose plugin and invocation lines it uses, the scaffold and
  the variants' prompt and oracle paths (reused by path, never copied), the phase-B composition,
  the go line, which variant carries the falsifier and which the guardrail, and `frozenAgainst` /
  `frozenInvocation`: the sha256 of every reused file and invocation line at freezing time.
- `checklist.md` — written from the fully specified request before the first subject run, and
  frozen from then on. A changed requirement is a new case, since scores under two checklists do
  not compare.
- `phase-b.md` — the lead line of the phase-B message.
- The scorer: whatever must execute the subject's code (`probes.py` here, because a FastAPI app
  has to run) emits evidence only; `rules.mjs` turns evidence and files into verdicts and exports
  `AUTO` and `MANUAL`, which together must be exactly the checklist's ids.
- `scorer-requirements.txt` — exact pins for the scorer's environment.
- `answer-forms.mjs` (optional, named by `answerForms`) — each oracle answer's fixed wording and
  form, and for each table value its fields and the matchers that decide whether an item
  presented them (`references/report-format.md` §Answer form). `lib.test.mjs` holds the wording
  to the oracle files.

Before the first subject run, score a hand-written reference implementation and the bare
scaffold, and check that each verdict is the one the checklist predicts.
