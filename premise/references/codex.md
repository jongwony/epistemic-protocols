# Setting up this layer — Codex

[`AGENTS.md`](../AGENTS.md) beside these documents describes what they are and the two ways to
adopt them: link to them, or copy the parts you want. This file covers the first way concretely —
how to wire the documents into a Codex setup so they stand as a reference layer.

Codex reaches them by pointer rather than by import. Its instruction loader reads each file's bytes
and places the text into the instruction chain as-is; it expands no import directive. So the layer is
a standing instruction to read the documents at named moments, not a mechanism that loads them for
you. Every difference below follows from that.

**If you are an agent and someone handed you this URL**: the steps below are yours to run. Step 3
writes into that person's global configuration directory, so show them the text first and get their
go-ahead before writing it.

## What you end up with

- The premise documents on disk, kept in sync by Codex's plugin manager.
- One section in the global `AGENTS.md` that states the split between the general principles (these
  documents) and the operating rules of the host setup, and that names the document index plus the
  two documents bearing on every turn as required reading.
- Every other document reachable on demand, at the moment the index names for it.

## Prerequisite

This repository's marketplace is already added — that is what puts these documents on disk, and the
[root README](../../README.md)'s install covers it. For this reference layer alone, without any of
the protocol plugins, adding the marketplace by itself is enough:

```bash
codex plugin marketplace add https://github.com/jongwony/epistemic-protocols.git
```

## Step 1 — resolve the configuration directory

Codex's configuration directory is `$CODEX_HOME` when that variable is set, and `$HOME/.codex`
otherwise. Resolve it once rather than assuming either:

```bash
echo "${CODEX_HOME:-$HOME/.codex}"
```

Both the clone and the file from step 3 live under that directory.

## Step 2 — confirm the documents landed

```bash
ls "${CODEX_HOME:-$HOME/.codex}/.tmp/marketplaces/epistemic-protocols/premise/"
```

`AGENTS.md` should appear alongside the individual documents. Keep the absolute path this listed —
step 3 needs it written out literally.

The `.tmp` in that path does not mean scratch. It is where Codex keeps every installed marketplace,
its own bundled ones included; `codex plugin marketplace list` reports the same root.

## Step 3 — add a section to the global AGENTS.md

Codex reads `<config-dir>/AGENTS.md` as global standing guidance. Two things it does not do decide
the shape of what goes there: it does not expand `@path` imports, so an import line would arrive as
literal text and load nothing; and `<config-dir>/rules/` is not a Markdown auto-load directory —
`.rules` files there are sandbox and approval policy, so nothing belongs there for this purpose.

What transfers is the pointer. Add this section:

```markdown
# Premise Layer

The general principles behind the rules in this file live at
`<PREMISE_PATH>` — a git clone Codex's plugin manager keeps in sync.
Read from it freely; never write to it.

`<PREMISE_PATH>/AGENTS.md` is the index: it names each document and the moment that calls for it.
Read it at the start of a session, before the first substantive action, so those moments are
recognized rather than recalled. Read `<PREMISE_PATH>/recognition-and-authority.md` and
`<PREMISE_PATH>/approach-verification.md` alongside it — those two bear on every turn. Read any
other document at the moment the index names for it.

The split: the rest of this file and the rest of your configuration carry the operational side —
when a principle fires here, what threshold applies, which tool or path it binds to, what this setup
has settled on. The principle itself lives in the premise documents. When one of your rules names a
premise document, read that document before acting on a case its operational wording does not
already settle.
```

Four things to get right:

- **Substitute every `<PREMISE_PATH>` with the absolute path from step 2**, and match the heading
  level the file already uses. The text arrives verbatim in the instruction chain, so a path left as
  `$CODEX_HOME` would have to be resolved by the agent at read time — which is the recall this layer
  exists to avoid.
- **Append; never replace.** That file usually already carries someone's own guidance, and it takes
  effect in every session they run.
- **Check for `AGENTS.override.md` in the same directory first.** When it is present Codex reads it
  instead of `AGENTS.md`, so a section added to the latter would never load. Add it to whichever file
  Codex actually reads.
- **Flag overlap rather than resolving it.** Existing guidance in that file may already restate a
  premise document's principle in its own words. Point out what overlaps and leave the removal to
  the person whose file it is.

Why those three documents and not all of them: standing instructions are read on every turn, so the
layer carries the index — which names each document and the moment that calls for it — plus the two
documents that bear on every turn. The rest arrive when their moment does.

## Step 4 — check it took

There is no import list to inspect here. Codex guarantees only that the `AGENTS.md` text reaches the
instruction chain, not that the files it names get read — so the behavioral check is the check.

Start a fresh session and ask which premise document the agent would read before taking a
hard-to-reverse action. A wired setup answers `boundaries-and-safety.md`, having read the index at
the path the section named. An answer that does not name a document, or names one that is not in the
index, means the pointer is not being followed and the layer is not in effect.

## Keeping it current

The plugin manager keeps the clone in sync with upstream, so these documents can change under a
setup that points at it. The same clone is replaced when the marketplace upgrades and removed when
the marketplace is removed — a path that disappears takes the layer with it silently, since nothing
here fails loudly. For a copy that changes only when you say so, clone the repository yourself to a
path you own and substitute that path in step 3 instead — the rest of the steps are unchanged.

## Adapting

The three documents above are one setup's choice, not a required set. Any subset works: a document
you adopt governs the general principles within the scope you adopted it for, and a document you
have not adopted governs nothing — `AGENTS.md` states that scoping rule. Codex layers project
`AGENTS.md` files from the repository root down to the working directory, so a project that wants a
narrower or wider set can name its own without touching the global section.
