---
name: outcome
description: This skill should be used when the user asks to "measure whether a protocol reduces rework", "run the outcome eval", "paired bare vs protocol", "compare first implementation with and without the protocol", "does /inquire reduce rework", or wants evidence about what a protocol does to the downstream work rather than whether its declared transitions happen. Project-local contributor tooling.
allowed-tools: Read, Grep, Glob, Bash, Write
---

# Outcome Eval

Measure what a protocol does to the work that follows it. The same task runs with and without
the protocol; each cell's first implementation is scored against a frozen checklist, the full
specification is then handed over, and the edits that answer it are counted as rework.

## Judgment boundary

`/realize` judges whether a run follows a protocol's declared transitions and stops at
`Stop | Proceed`; the quality of the artifact after `Proceed` is outside it by its own
declaration (`.claude/skills/realize/references/grader-design.md`). This skill judges exactly
that artifact: how well the first implementation meets the specification, how much of it the
full specification forces the subject to rewrite, and what the whole session cost. It reuses
`/realize`'s cases, scaffold, invocation lines and isolation by path and changes none of them;
a question about whether a gate fired belongs to `/realize`.

## Design

- **Pair.** A case pairs an underspecified request with its fully specified sibling on one
  scaffold. The underspecified variant is where the protocol has something to find and carries
  the falsifier; the fully specified one is the guardrail — what the protocol costs where there
  is nothing to find.
- **Arms.** `bare` and `protocol`. The protocol arm gets the plugin and the `/realize` invocation
  line, nothing else: no instruction to wait, no extra harness rule. Adding one to that arm alone
  would measure a stronger intervention than the shipped contract.
- **Phase A** runs from the task to the first implementation. The user side is played
  mechanically by the variant's `oracle.md` from `/realize`, plus two rules of this skill: phase A
  ends at the first turn that writes an implementation, and a turn that neither implements nor
  hands anything back gets the case's go line once. Snapshot A is taken there.
- **Phase B** sends the full specification. Its user side follows the fully specified case's
  oracle — permission gets `Yes, go ahead.`, anything else `It's all in my message — go with what
  I wrote.` — until a turn hands nothing back. The final snapshot is taken there.
- **Frozen checklist.** Each case fixture holds a checklist written before the first run from
  the fully specified request, and records digests of the `/realize` files it was derived from;
  every spending or scoring command refuses when those files have changed.
- **Metrics.** First score (checklist passes at snapshot A), final score, rework (lines changed
  between the snapshots outside `tests/`, by a minimal line diff), questions handed back, turns,
  and total cost in the runner's unit — USD on Claude, input tokens on Codex.

## Runbook

```bash
S=.claude/skills/outcome/scripts/outcome.mjs
node $S plan --runner claude --model claude-sonnet-5 --reps 2 --budget 3 --dry-run   # argument check only
node $S plan --runner claude --model claude-sonnet-5 --reps 2 --budget 3
node $S plan --runner codex --model gpt-6-luna --effort xhigh --codex-auth login     # or api-key (default)
node $S setup <run>                            # scorer venv; codex bare/protocol homes
node $S turn <run> <cell> --open               # then --reply <file> | --go, as the oracle says
node $S snap <run> <cell> A
node $S turn <run> <cell> --phase-b            # then --reply <file> until nothing is handed back
node $S snap <run> <cell> final
node $S note <run> <cell>                      # template, then fill the manual judgments
node $S report <run> [<run> ...] [--out <dir>]
node $S teardown <run>                         # work trees and homes; records stay
```

Read `references/runbook.md` before the first run: the per-turn oracle procedure, how phase
boundaries and the manual items are judged, authentication for each runner, where isolation
lives, and why a Codex protocol cell writes code before any answer can arrive. Read
`references/report-format.md` before quoting any result: the table, the means, the falsifier
clauses and their order, and what a result can and cannot claim.

Records go to `.claude/skills/outcome/results/`, work trees and homes under the system temporary
directory; neither is tracked, since both belong to the run that made them.

## Prerequisites

Node 22+ and the runner's CLI (`claude` or `codex`) on PATH. Python 3.11+ with `venv` and `pip`
is required because the case's FastAPI app has to run for the functional checks; the same probe
script reads the app's source with Python's own parser, so no second parser has to agree with
it. Everything else is Node. `setup` builds the scorer venv from the case's
`scorer-requirements.txt`, which needs PyPI access once; on Debian or Ubuntu,
`apt install python3-venv` supplies the venv module.

## Tests

The pure parts — checklist loading, the fixture's frozen digests, the scoring rules, diffing,
aggregation and the falsifier evaluation — have their own test, which calls no model:

```bash
node --test .claude/skills/outcome/scripts/lib.test.mjs
```

A new case is a new directory under `cases/`; `references/runbook.md` §Adding a case says what
it must hold and when its checklist is frozen.
