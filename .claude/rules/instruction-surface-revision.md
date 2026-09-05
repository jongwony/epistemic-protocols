---
paths:
  - "AGENTS.md"
  - "CLAUDE.md"
  - ".claude/rules/**/*.md"
---

This rule binds when an always-loaded instruction surface is being changed — a clause added,
reworded, moved, or removed on `AGENTS.md` or on a file under `.claude/rules/`. What decides
that is the task rather than the file: opening one of these to read it, or to cite it, reaches
nothing here. The change can be one sentence; the surface it lands on is what makes the
moment.

Its `paths` scope is one host's delivery optimization and not the only route to it. A change
made through a shell command reaches the same surface without passing this scope, which is why
`AGENTS.md` §Editing Conventions carries the pointer as well.

# Instruction Surface Revision

The general form is `premise/instruction-authoring.md`; read §Override Gate, §Subtraction at
Revision Time, and §Ledger/State Separation there before drafting, and §Where a Repair Lands
when the change answers a defect. What this rule carries is where those obligations are
discharged in this repository, and the order they bind in.

**The audit's outcome goes in the commit.** This project's ledger is its commit-message history
(`AGENTS.md` §Settled Directions, Ledger binding), so the then-records the premise routes to a
ledger — the subtraction candidates the audit produced and what was decided about each, the
alternative rejected, the friction that admitted a new entry — go in the commit message of the
change, and the surface keeps only what asserts now.

**The order the obligations bind in.** Read the premise sections above. Audit the surface as
opened, and write down the subtraction candidates with the obligations each carries. Only then
settle what the change adds, letting the audit shape it. Route each sentence as it is written.
Run `/verify` before the commit, and put the audit's outcome in the commit message.
