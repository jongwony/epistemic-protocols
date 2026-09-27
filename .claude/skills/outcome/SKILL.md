---
name: outcome
description: This skill should be used when the user asks to "run the outcome eval", "paired bare vs protocol", "which decisions did the protocol surface", "count what the AI asked or presented", "does /inquire surface what the request left out", or wants to see, from transcripts, which decisions reached the user as a question or something to recognize instead of having to be written into the opening prompt. Project-local contributor tooling.
allowed-tools: Read, Grep, Glob, Bash, Write
---

# Outcome Eval

Without a protocol, a person has to recall at length and write a long opening prompt. With one,
they answer when asked, by recalling, or recognize what is put in front of them — and the items
that come up this way can be ones nobody would have thought of at the start. This eval shows
that one thing, from the transcript: the same request runs with and without the protocol, and
each cell lists the decisions that reached the user through the AI.

## The one measure

Per cell: the decision items that entered the conversation through the AI and that the user's
opening request did not contain. Each is recorded with the verbatim span that raised it and how
it reached the user:

- `asked` — put as a question; the user answered by recalling.
- `presented` — shown as an option or default; the user recognized, picked or corrected it.

The number is the count of such items, per cell and per arm, shown under the opening request
whose gaps they fill: each item is something the user would otherwise have had to write into
that request. It is read from the transcript and the opening request alone — no hidden
specification, no checklist, no grader of correctness. Identifying an item is a reading of the
transcript, attributed to whoever wrote the cell's notes, not a mechanical extraction; the spans
stay with it so anyone can check the reading.

## What this eval measures, and what it does not

It shows how many decisions reached the user as a question or as something to recognize, rather
than having to be written up front. It does not show whether the answers were right, whether a
person felt less load, or anything about rework.

A result is an observation of one model on one day, and it changes as models change. It goes into
the pull request body or the commit message it informs, never onto a state surface — a README, an
`AGENTS.md`, this file — where nothing re-runs it. A surface may say that this eval exists and
what it counts; it does not say what it found. Records (`results/`) are gitignored for the same
reason.

## Boundary with `/realize`

`/realize` judges whether a run follows a protocol's declared transitions. This skill reuses its
cases — scaffold, prompts, oracles, invocation lines and isolation — by path, and changes none of
them; a question about whether a gate fired belongs there.

## Design

- **Arms.** `bare` and `protocol`. The protocol arm gets the plugin and `/realize`'s invocation
  line, nothing else. A rule added to that arm alone would credit the protocol with what the
  harness added.
- **Dialogue.** The user side is played mechanically by the variant's `oracle.md`, up to the first
  turn that writes an implementation; a turn that neither implements nor hands anything back gets
  the case's go line once. The notes then close the cell.
- **Frozen case.** `case.json` holds the sha256 of every reused `/realize` file and invocation
  line; every command that spends refuses when one has changed, since items read against a
  different request or oracle are a different case.

## Runbook

```bash
S=.claude/skills/outcome/scripts/outcome.mjs
node $S plan --runner claude --model claude-sonnet-5 --reps 2 --dry-run   # argument check only
node $S plan --runner claude --model claude-sonnet-5 --reps 2
node $S plan --runner codex --model gpt-6-luna --effort xhigh --codex-auth login   # or api-key (default)
node $S setup <run>                            # codex: bare and protocol homes
node $S turn <run> <cell> --open               # then --reply <file> | --go, as the oracle says
node $S note <run> <cell>                      # closes the cell; fill the items, then run again
node $S report <run> [<run> ...] [--out <dir>]
node $S teardown <run>                         # work trees and homes; records stay
```

Read `references/runbook.md` before the first run: the turn procedure, how to write the notes'
items, authentication and isolation per runner, and why a Codex protocol cell writes code before
any answer can arrive.

## Prerequisites and tests

Node 22+ and the runner's CLI (`claude` or `codex`) on PATH. The pure parts have a test that calls
no model:

```bash
node --test .claude/skills/outcome/scripts/lib.test.mjs
```
