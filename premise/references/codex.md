# Premise host adapter — Codex

Use this adapter with the [shared setup procedure](../README.md). If someone handed you this page
directly, read the shared procedure first, then return here and carry the combined procedure through
verification.

**Scope**: the local Codex CLI and desktop app, with the configuration directory and premise
documents on the same machine. Codex cloud cannot follow a pointer into those local files; establish
the layer wherever a cloud run's own instructions come from.

## Prerequisite

The repository marketplace must already be added. For the premise layer alone, adding the
marketplace is sufficient:

```bash
codex plugin marketplace add https://github.com/jongwony/epistemic-protocols.git
```

## Host bindings

### Configuration root

Codex uses `$CODEX_HOME` when it is set and `$HOME/.codex` otherwise:

```bash
config_dir="${CODEX_HOME:-$HOME/.codex}"
printf '%s\n' "$config_dir"
```

### Premise root discovery

Ask Codex for the marketplace root rather than deriving it from `config_dir`:

```bash
codex plugin marketplace list
```

Take the `ROOT` for `epistemic-protocols`, append `/premise`, print that path in full, and confirm
its contents. A marketplace added from a local checkout resolves to that checkout; a GitHub-sourced
managed marketplace commonly sits under `<config-dir>/.tmp/`.

Use the confirmed premise directory as the literal absolute `<PREMISE_PATH>` in the template below.

### Delivery mechanism and global surface

Codex expands no Markdown import directive. Its global instruction loader selects the first
non-blank file from `<config-dir>/AGENTS.override.md` and `<config-dir>/AGENTS.md`; the premise layer
therefore takes the form of a pointer in the file that actually loads.

Resolve the target before previewing the write:

- no override, or an override that is empty or whitespace only: append to `AGENTS.md` and leave the
  empty override unchanged;
- an override with content: append to that override and say that removing this temporary file will
  remove the premise layer with it.

Append the following section after applying the shared procedure's preview and approval gate. Give
the section the same heading level as the target file's other top-level sections.

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

### Verification

Start a fresh local session and run the shared procedure's complete-entry question for
`matching-the-request.md`. Codex guarantees that the pointer text reaches its instruction chain,
not that the named files get read; this behavioral result is the loading check.
