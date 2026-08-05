# Setting up this layer

[`AGENTS.md`](AGENTS.md) in this directory describes what these documents are and the two ways to
adopt them: link to them, or copy the parts you want. This file covers the first way concretely —
how to wire the documents into a Claude Code setup so they load as a standing reference layer.

**If you are an agent and someone handed you this URL**: the steps below are yours to run. Step 3
writes into that person's global configuration directory, so show them the file first and get their
go-ahead before writing it.

## What you end up with

- The premise documents on disk, kept in sync by Claude Code's plugin manager.
- One always-loaded rules file that states the split between the general principles (these
  documents) and the operating rules of the host setup, and that loads the document index plus the
  documents bearing on every turn.
- Every other document reachable on demand, at the moment the index names for it.

## Prerequisite

This repository's marketplace is already added — that is what puts these documents on disk, and the
[root README](../README.md)'s install covers it. For this reference layer alone, without any of the
protocol plugins, adding the marketplace by itself is enough:

```bash
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
```

## Step 1 — resolve the configuration directory

Claude Code's configuration directory is `$CLAUDE_CONFIG_DIR` when that variable is set, and
`$HOME/.claude` otherwise. Resolve it once rather than assuming either:

```bash
echo "${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
```

Both the clone and the rules file from step 3 live under that directory.

## Step 2 — confirm the documents landed

```bash
ls "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/plugins/marketplaces/epistemic-protocols/premise/"
```

`AGENTS.md` should appear alongside the individual documents. Keep the absolute path this listed —
step 3 needs it written out literally.

## Step 3 — write the rules file

Markdown files under `<config-dir>/rules/` load automatically. Create `rules/premise.md` there, with
this content:

```markdown
# Premise Layer

The general principles behind your operating rules live outside this directory, at
`<PREMISE_PATH>` — a git clone the plugin manager keeps in sync.
Read from it freely; never write to it.

The split: your own rules — this directory and the rest of your configuration — carry the
operational side: when a principle fires here, what threshold applies, which tool or path it binds
to, what this setup has settled on. The principle itself lives in `premise/`. When one of your rules
names a premise document, read that document before acting on a case its operational wording does
not already settle.

The index loads below. It names each document and the moment that calls for it, so the moment is
recognized rather than recalled. The two documents that bear on every turn load with it; the rest
are read on demand when their trigger fires.

@<PREMISE_PATH>/AGENTS.md
@<PREMISE_PATH>/recognition-and-authority.md
@<PREMISE_PATH>/approach-verification.md
```

Three things to get right:

- **Substitute every `<PREMISE_PATH>` with the absolute path from step 2.** `@` imports do not
  expand environment variables, so `$CLAUDE_CONFIG_DIR` left in an import line will not resolve.
- **Show the file before writing it.** It lands in a global configuration directory and takes effect
  in every session that person runs.
- **Do not write over an existing `rules/premise.md`.** Someone who already has that file has their
  own wiring — show them what you would add and let them decide where it goes.

Why those three imports and not all of them: an always-loaded layer costs context on every turn, so
it carries the index — which names each document and the moment that calls for it — plus the two
documents that bear on every turn. The rest arrive when their moment does.

## Step 4 — check it took

Start a fresh session and run `/context`. The new rules file should be listed under **Memory
files**. If it is missing there, it did not load and nothing above it took effect.

As a second check, ask which premise document the agent would read before taking a hard-to-reverse
action. A wired setup answers `boundaries-and-safety.md` from the loaded index.

## Keeping it current

The plugin manager keeps the clone in sync with upstream, so these documents can change under a
setup that points at it. For a copy that changes only when you say so, clone the repository yourself
to a path you own and substitute that path in step 3 instead — the rest of the steps are unchanged.

## Adapting

The three imports above are one setup's choice, not a required set. Any subset works: a document you
adopt governs the general principles within the scope you adopted it for, and a document you have
not adopted governs nothing — `AGENTS.md` states that scoping rule. If your host is not Claude Code,
the mechanism differs but the shape does not: put the index wherever your instructions always load,
and reach the rest at the moment its entry names.
