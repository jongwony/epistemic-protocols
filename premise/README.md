# Setting up this layer

[`AGENTS.md`](AGENTS.md) in this directory describes what these documents are and the two ways to
adopt them: link to them, or copy the parts you want. This file routes to the first way, worked out
concretely for each host — how to wire the documents in so they stand as a reference layer.

**If you are an agent and someone handed you this URL**: identify the host you are running in, then
follow that one file end to end. Each is self-contained; following both would write two setups over
each other.

- **[Claude Code](references/claude-code.md)** — the documents are imported into an always-loaded
  rules file, so the host itself puts them in context.
- **[Codex](references/codex.md)** — the documents are named by a standing instruction to read them
  at the moments that call for them, because Codex expands no import directive.

The shape is the same in both: the index and the two documents bearing on every turn are reached
first, and the rest arrive when their moment does. Only the mechanism differs. If your host is
neither, that shape is what generalizes — put the index wherever your instructions always load, and
reach the rest at the moment its entry names.
