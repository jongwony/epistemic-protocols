# Setting up this layer

[`AGENTS.md`](AGENTS.md) in this directory states what these documents are and indexes them by the
moment each one is for. This file covers adopting them.

They are a reference surface, not a package. There is no install script and nothing to run here —
they are meant to be reached by URL, read, and used in one of two ways: **link to them** from your
own global configuration or notes, the way you would cite any external reference, or **copy the
parts you want** into your own instructions, verbatim or adapted. Each document stands on its own —
it does not assume you know any particular project, tool, or vocabulary beyond what it defines
itself — so a subset is a coherent adoption.

The rest of this file routes to the first way, worked out concretely for each host — how to wire the
documents in so they stand as a reference layer.

**If you are an agent and someone handed you this URL**: identify the host you are running in, then
follow that one file end to end. A go-ahead checkpoint before the global write pauses that
procedure; once the person gives it, resume the same procedure and complete the section or file
addition. Each host file is self-contained; following both would write two setups over each other.

- **[Claude Code](references/claude-code.md)** — the documents are imported into an always-loaded
  rules file, so the host itself puts them in context.
- **[Codex](references/codex.md)** — the documents are named by a standing instruction to read them
  at the moments that call for them, because Codex expands no import directive.

Both procedures wire the machine the host is running on: each resolves a configuration directory
there and writes an absolute path on that machine into it. A run isolated from those files — Codex
cloud, or any remote sandbox — cannot follow either, and would have to establish the layer wherever
its own instructions come from instead.

The shape is the same in both: the index and the two documents bearing on every turn are reached
first, and the rest arrive when their moment does. Only the mechanism differs. If your host is
neither, that shape is what generalizes — put the index wherever your instructions always load, and
reach the rest at the moment its entry names.
