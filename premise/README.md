# Setting up this layer

[`AGENTS.md`](AGENTS.md) in this directory states what these documents are and indexes them by the
moment each one is for. This file covers adopting them.

They are a reference surface, not a package: nothing here runs. Adopt them in one of two ways.

- **Install the [`route`](../route) plugin.** Its session-start hook resolves this directory
  through the host's own plugin records and injects the index into every context epoch with each
  entry's path made absolute, so a document is read by that path at the moment its entry names.
  Nothing is wired by hand, and the host's plugin manager keeps the marketplace checkout the paths
  point into current; a marketplace added from a local clone resolves to that clone, which is how
  to hold a copy that changes only when you say so. The install and the mechanism are in
  [`route/README.md`](../route/README.md).
- **Copy the parts you want** into your own instructions, verbatim or adapted. Each premise
  document stands on its own, so adopting a subset is coherent.

A global rules file importing the index, or an instruction-file pointer to it, was the earlier way
to link to this layer. Beside the `route` hook it delivers the same index twice, so remove it when
installing `route`.

## Verifying

Ask a fresh session to reproduce the complete index entry for `matching-the-request.md`. That entry
names four triggers: design level, fix scope, question granularity, and a time or date without a
stated zone. Requiring all four makes the answer depend on the index rather than on a guess from the
filename.

A correct response establishes that the index reached that session. It does not establish that
another session will behave the same way. Treat a wrong answer as an absent layer: the hook leaves
the index out rather than failing loudly when it cannot resolve this directory, so check that
`route` is installed and its hooks are trusted (`/hooks`).

## Adapting

The standing set above is one setup's choice, not a required set. A document you adopt governs the
general principles within the scope you adopted it for; a document you do not adopt governs nothing.
A project may bind a narrower or wider set on its own instruction surface without changing the
global layer. Where a host instruction and an adopted document disagree on a general principle, the
document is the one to reason from.

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
