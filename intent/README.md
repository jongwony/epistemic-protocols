# `intent/` — what a change in flight is for

An intent file states what one change is being built toward: what is wanted, why, and under
which constraints. One file per change, committed on that change's branch, named for the
change — `intent/<slug>.md`.

`AGENTS.md` §Settled Directions, **Intent binding** is the one line that sends a session here.
This file is the convention itself; it is not per-change and does not die with any branch.

## Why the directory exists

A commit message is read by someone who goes looking for it. A session that picks a branch up
afterwards does not know to look, and this repository has watched that fail: the sessions
behind PR #942 and PR #945 each recorded that they could not read their predecessor's record.
The ledger is the right home for a *then*-record — why a thing was done the way it was, once it
is done. It is the wrong home for the direction of work still in progress, because that
direction has to reach a reader who has not yet been told it exists.

So the two are split. `AGENTS.md` §Settled Directions, Ledger binding keeps the then-records in
the commit history. The direction of a change in flight sits in the working tree of the branch
that carries the change, where opening the repository is enough to find it.

The shape is Anthropic's, from [The AI-Native SDLC
playbook](https://claude.com/blog/the-ai-native-sdlc-playbook): a per-change artifact, written
to version control, attached to the session that works on it, read by the stage that follows.

## Sections

Write these in order. Omit a section only when it would be empty, and say nothing in a section
that another one already carries.

- **Problem** — the situation that made this change worth doing, in terms a reader outside the
  work can check. Cite the evidence: an issue, a PR, a session id, an observed failure.
- **Proposed outcome** — what is true when the change has landed. Not the steps; the state.
- **Affected** — the files, plugins, surfaces, and pull requests this reaches, and the ones it
  deliberately does not.
- **Constraints** — what bounds the work: a value the author fixed, a cost being answered, a
  boundary the change must not cross. Each constraint says what it answers to, so a later
  reader can tell a decision from a habit.
- **Open questions** — what is not settled, and who settles it. An open question left here is
  visible to the next session; one left in a session is not.

## Lifecycle

- **Created** when the direction of a change is settled enough to write down — normally at the
  start of the branch, and always before a session other than the author's picks the work up.
- **Revised** whenever the direction is corrected, in the same commit as the correction. A
  stale intent file is worse than none: it asserts a direction with the authority of the
  branch.
- **Dies with the merge.** The file is removed when the change lands. After the merge the pull
  request, its commits, and the links between them carry the connection; the intent file's job
  is over. Whether the removal happens in the pull request's own last commit or in a follow-up
  after merge is the author's call, and the reviewability of the file is what it trades against.
- **Graduation is separate.** Where the change settles a direction that keeps governing after
  the merge, that direction goes to `AGENTS.md` §Settled Directions as its own clause, in the
  change's own commits. Deleting the intent file is not how a standing direction is preserved.

## What does not go here

- **A then-record.** Rationale for a decision already taken, a rejected alternative, the
  provenance of a value — these route to the commit message (`AGENTS.md` §Settled Directions,
  Ledger binding).
- **A standing convention.** Anything that keeps binding after the merge belongs on a surface
  that survives it: `AGENTS.md`, a file under `.claude/rules/`, or a packaged `SKILL.md`.
- **A transcript or a session dump.** An intent file carries the direction, not the
  deliberation that produced it. Point at the session id and let the reader open it.
- **A task list.** What remains to be done is the branch's business, not the direction's.

## Language

Per-change intent files are written in Korean, and
`.claude/skills/verify/scripts/language-purity.js` whitelists `intent/` for that. This file,
being a convention surface, stays in English like the repository's other governance surfaces.
