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

The general form is `premise/instruction-authoring.md`; read §Override Gate and §Subtraction at
Revision Time there before drafting, and §Where a Repair Lands when the change answers a
defect. What this rule carries is where those obligations are discharged in this repository,
and the order they bind in.

**The audit's outcome goes in the commit.** The subtraction candidates the audit produced and
what was decided about each, the alternative rejected, the friction that admitted a new entry
— each is a then-record and goes in the commit message of the change (`AGENTS.md` §Settled
Directions, Ledger binding), and the surface keeps only what asserts now.

**The direction the change is being built toward goes in the unit's record, not in the
commit.** A commit message is read by someone who goes looking; a session picking the branch
up afterwards does not know to look. So what the change is *for* — the problem, the outcome
wanted, the constraints it is being built under, and what is still open — goes in the record
`AGENTS.md` §Settled Directions, Intent binding names, where a session that opens the branch
reads it. When the direction is corrected, write the correction there as a decision line at
the moment it is made.

**The order the obligations bind in.** Read the premise sections above, and the record the
branch points at. Audit the surface as opened, and write down the subtraction
candidates with the obligations each carries. Only then settle what the change adds, letting
the audit shape it. Route each sentence as it is written. Run `/verify` before the commit, put
the audit's outcome in the commit message, and leave the unit's record saying what the change
is still being built toward.
