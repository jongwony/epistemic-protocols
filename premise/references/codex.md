# Setting up this layer — Codex

[`AGENTS.md`](../AGENTS.md) beside these documents describes what they are and the two ways to
adopt them: link to them, or copy the parts you want. This file covers the first way concretely —
how to wire the documents into a Codex setup so they stand as a reference layer.

Codex reaches them by pointer rather than by import. Its instruction loader reads each file's bytes
and places the text into the instruction chain without interpreting it; no import directive is
expanded, and nothing the text names is fetched on its behalf. So the layer is
a standing instruction to read the documents at named moments, not a mechanism that loads them for
you. Every difference below follows from that.

**Scope**: Codex running locally — the CLI and the desktop app — where the configuration directory
and the documents sit on the machine being wired. Codex cloud runs isolated from that machine's
files and cannot follow these steps; the layer has to be established wherever a cloud run's own
instructions come from. Whether every local surface follows the pointer in practice has not been
established empirically — see step 4 for what the check does and does not settle.

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

Ask Codex where it put the marketplace rather than assuming a path — a marketplace added from a
local checkout resolves to that checkout, not to the managed location a GitHub-sourced one gets:

```bash
codex plugin marketplace list
```

Take the `ROOT` for `epistemic-protocols` from that output, and confirm the documents are under it:

```bash
ls <ROOT>/premise/
```

`AGENTS.md` should appear alongside the individual documents. Write out `<ROOT>/premise` in full and
keep it — step 3 needs that absolute path literally.

When the marketplace came from GitHub, that root sits under `<config-dir>/.tmp/`. The `.tmp` does not
mean scratch: it is where Codex keeps marketplaces it manages, its own bundled ones among them, under
sibling directories of the same parent.

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

- **Substitute every `<PREMISE_PATH>` with the absolute path from step 2**, and give the section the
  same heading level the file's other top-level sections use. The text arrives verbatim in the
  instruction chain, so a path left as `$CODEX_HOME` would have to be resolved by the agent at read
  time — which is the recall this layer exists to avoid.
- **Append; never replace.** That file usually already carries someone's own guidance, and it takes
  effect in every session they run.
- **Check `AGENTS.override.md` in the same directory before touching anything.** Codex loads the
  first of `AGENTS.override.md`, `AGENTS.md` whose contents are not blank — presence alone does not
  decide it. Three cases, and they differ:
  - No override, or an override that is empty or whitespace only → `AGENTS.md` is what loads; add the
    section there and leave the empty override alone. **Writing into an empty override would make it
    non-blank and drop the whole of `AGENTS.md` out of the instruction chain** — an append that
    silently removes everything that file was carrying.
  - An override with content → that is what loads, and `AGENTS.md` does not. Adding the section to
    `AGENTS.md` would load nothing.
  - Either way, an override is meant to be temporary. Say so when the section has to go into one:
    removing that override later takes the premise layer with it.
- **Flag overlap rather than resolving it.** Existing guidance in that file may already restate a
  premise document's principle in its own words. Point out what overlaps and leave the removal to
  the person whose file it is.

Why those three documents and not all of them: standing instructions are read on every turn, so the
layer carries the index — which names each document and the moment that calls for it — plus the two
documents that bear on every turn. The rest arrive when their moment does.

## Step 4 — check it took

There is no import list to inspect here. Codex guarantees only that the `AGENTS.md` text reaches the
instruction chain, not that the files it names get read — so the behavioral check is the check, and
it has to be one the index actually settles.

Start a fresh session and ask which premise document to read **when a time or date arrives without a
stated zone**. A wired setup answers `matching-the-request.md`. Ask for the trigger phrasing too, so
the answer has to come from the index rather than from the filename: the entry names that moment
alongside three others about level, fix scope, and question granularity.

The point of that particular question is that it cannot be guessed. A check like "which document
before a hard-to-reverse action" invites the answer `boundaries-and-safety.md` from the topic word
alone, and would pass on a setup where nothing was ever read.

What this establishes and what it does not: a correct answer shows the index was reached at the path
the section named. It says nothing about whether `recognition-and-authority.md` and
`approach-verification.md` were also read, nor about any session other than the one you asked in.
Nothing here fails loudly, so treat a wrong answer as the layer being absent rather than as a slip.

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
