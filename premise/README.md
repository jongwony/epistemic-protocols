# Setting up this layer

[`AGENTS.md`](AGENTS.md) in this directory states what these documents are and indexes them by the
moment each one is for. This file covers adopting them.

They are a reference surface, not a package. There is no install script and nothing to run here —
they are meant to be reached by URL, read, and used in one of two ways: **link to them** from your
own global configuration or notes, the way you would cite any external reference, or **copy the
parts you want** into your own instructions, verbatim or adapted. Each premise document stands on
its own, so adopting a subset is coherent.

The rest of this file defines the shared procedure for the first way. A host reference binds that
procedure to one configuration root, marketplace-discovery mechanism, instruction surface,
delivery mechanism, and verification check:

- **[Claude Code](references/claude-code.md)** — an always-loaded rules file imports the standing
  documents.
- **[Codex](references/codex.md)** — a global instruction section points an agent to the standing
  documents because Codex expands no import directive.

**If you are an agent and someone handed you this URL**: identify the host you are running in, read
this shared procedure and that host's reference before acting, then follow them as one procedure end
to end. A go-ahead checkpoint before the global write pauses the procedure; once the person gives
it, resume and complete the approved write. Follow one host reference only.

Both adapters wire the machine the host is running on. A run isolated from its configuration and
marketplace files cannot follow either path; establish the layer on the instruction surface that
the isolated run actually receives instead.

## Shared procedure

### 1. Resolve the configuration root

Use the selected host reference's resolver. Resolve the host's environment override and fallback
once; do not assume the fallback is active.

### 2. Discover the premise root

Use the host reference's discovery mechanism and confirm that `AGENTS.md` appears beside the
individual premise documents. The configuration root and premise root are separate coordinates: a
marketplace sourced from a local checkout may live outside the configuration root.

Keep the premise root as a literal absolute path. The global write in step 3 must point to the
location the host actually reported, rather than leaving an environment variable or placeholder
for a future session to resolve.

### 3. Prepare and complete the global write

Use the host reference's target, precedence rules, and template. Substitute every
`<PREMISE_PATH>` with the absolute premise root from step 2.

Before writing:

- inspect the target and any host-specific file that can supersede it;
- preserve all existing guidance;
- show the person the exact text and destination;
- flag existing guidance that overlaps a premise principle without resolving the overlap; and
- get their go-ahead because the write affects every local session for that host.

The checkpoint authorizes the write it previewed. Once approval arrives, perform that write and
continue to verification rather than treating approval as completion.

The standing layer carries the index plus `recognition-and-authority.md` and
`approach-verification.md`, the two documents that bear on every turn. The index names when to read
every other document.

### 4. Verify in a fresh session

Use the host reference's loading check, then ask the fresh session to reproduce the complete index
entry for `matching-the-request.md`. That entry names four triggers: design level, fix scope,
question granularity, and a time or date without a stated zone. Requiring all four makes the answer
depend on the index rather than on a guess from the filename.

A correct response establishes that the index was reached at the configured path in that session.
It does not establish that the two other standing documents were also read, or that another session
will behave the same way. Treat a wrong answer as an absent layer.

## Keeping it current

The host's plugin manager keeps its own marketplace clone in sync with upstream. Claude Code and
Codex maintain separate clones, so they can temporarily carry different revisions even when both
point to this repository. Removing or replacing a marketplace can make its recorded path disappear
without a loud failure; repeat step 4 after either event.

For a copy that changes only when you say so, clone the repository to a path you own and use that
clone as the premise root. The rest of the procedure is unchanged.

## Adapting

The three standing documents above are one setup's choice, not a required set. A document you adopt
governs the general principles within the scope you adopted it for; a document you do not adopt
governs nothing. A project may bind a narrower or wider set on its own instruction surface without
changing the global layer. Where a host instruction and an adopted document disagree on a general
principle, the document is the one to reason from.

Your own instructions supply what an adopted document deliberately leaves open — the concrete
surface a principle binds to, the value your project has settled on — rather than restating the
general principle in their own words. That boundary runs both ways: a sentence whose meaning depends
on your own artifacts or conventions stays with your instructions rather than moving into one of
these documents, and your instructions do not cite one of them as the ground for a claim that is
theirs — a citation the document cannot support lends a local decision the standing of a general
principle. Such a sentence carries a concept name rather than a path, so what finds it is reading it
as someone who adopted these documents without access to your setup and asking whether it resolves;
retiring one restates in general form whatever contract its wording carried that no other document
in the collection states.
