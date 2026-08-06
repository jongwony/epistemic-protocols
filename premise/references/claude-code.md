# Premise host adapter — Claude Code

Use this adapter with the [shared setup procedure](../README.md). If someone handed you this page
directly, read the shared procedure first, then return here and carry the combined procedure through
verification.

**Scope**: Claude Code running locally, with its configuration directory and marketplace files on
the same machine. An isolated run needs the layer established on its own instruction surface.

## Prerequisite

The repository marketplace must already be added. For the premise layer alone, adding the
marketplace is sufficient:

```bash
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
```

## Host bindings

### Configuration root

Claude Code uses `$CLAUDE_CONFIG_DIR` when it is set and `$HOME/.claude` otherwise:

```bash
config_dir="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
printf '%s\n' "$config_dir"
```

### Premise root discovery

The managed marketplace lives under the resolved configuration root:

```bash
premise_path="$config_dir/plugins/marketplaces/epistemic-protocols/premise"
printf '%s\n' "$premise_path"
ls "$premise_path"
```

Use the printed `premise_path` as the literal absolute `<PREMISE_PATH>` in the template below.

### Delivery mechanism and global surface

Markdown files under `<config-dir>/rules/` load automatically, and `@` imports in them load the
referenced files. Import paths are literal, so the wiring session resolves the configuration root
before writing them. The target is `<config-dir>/rules/premise.md`.

Create that file with this content after applying the shared procedure's preview and approval gate:

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

An existing `rules/premise.md` is an existing wiring decision. Show the proposed integration and
let the person decide how it joins that file; do not replace it as though it were empty.

### Verification

Start a fresh session and run `/context`. The target rules file and its three imports should appear
under **Memory files**. Then run the shared procedure's complete-entry question for
`matching-the-request.md`.
