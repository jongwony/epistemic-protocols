---
paths:
  - "AGENTS.md"
  - "CLAUDE.md"
  - ".claude/rules/**/*.md"
  - ".claude/principles/**/*.md"
---

This rule binds when a durable instruction surface is being changed — a clause added,
reworded, moved, or removed on `AGENTS.md`, a file under `.claude/rules/`, or a file under
`.claude/principles/`. What decides that is the task rather than the file: opening one of
these to read it, or to cite it, reaches nothing here. The change can be one sentence; the
surface it lands on is what makes the moment, since every entry there is read by every later
session without anyone choosing to read it.

Its `paths` scope is one host's delivery optimization and not the only route to it. The
premise index the `route` plugin injects at session start names the same moment, and a
reader who has that index still in view and recognizes the moment reaches the same
documents; this rule is for the ordinary case where the index was read many turns ago and
the change is being made in the flow of another task. `AGENTS.md` §Editing Conventions
carries the platform-neutral pointer.

# Instruction Surface Revision

The general form is `premise/instruction-authoring.md`; read the sections named below there
before drafting. What this rule carries is the project instance — where each obligation the
premise states is discharged in this repository — and the order the obligations bind in.

**The premise sections this moment reaches.** §Override Gate decides whether the change
enters at all: a directive enters only as a sharpening of or contradiction to an existing
default, on usage evidence. §Subtraction at Revision Time binds the moment the surface is
opened to change: the entries already on it are back in scope, and the subtraction candidates
are established before what the change adds is settled. §Ledger/State Separation routes each
sentence as it is written. §Where a Repair Lands binds when the change answers a defect;
`.claude/rules/protocol-repair.md` carries its instance for a protocol `SKILL.md`, and this
rule carries it for the surfaces above.

**The ledger is the commit.** This project binds its ledger to the commit-message history on
the default branch (`AGENTS.md` §Settled Directions, Ledger binding). So the then-records the
premise routes to a ledger — the subtraction candidates the audit produced and what was
decided about each, the alternative rejected, the friction that admitted a new entry — go in
the commit message of the change, and the surface keeps only what asserts now. A record left
in a PR body or an issue has not reached the ledger.

**A now-assertion needs a channel.** An entry that describes what the repository currently
contains — a roster, a count, a restatement of what a check enforces — is admitted only where
something re-runs it (`AGENTS.md` §Settled Directions, Assertion needs an enforcement channel).
The static checks under `.claude/skills/verify/` are that channel here; an entry no check
re-runs is either given one, moved to the commit, or written as the reason a thing is shaped as
it is rather than as a claim about its present state.

**Authority decides where a contradiction is repaired.** Surfaces rank `premise/` →
`AGENTS.md` → `.claude/rules/` → `.claude/principles/` (`AGENTS.md` §Settled Directions,
Surface authority order). A change on a lower surface that would contradict a higher one is
evidence about the change; a higher surface found contradicting a lower one is the lower
surface's correction. A general principle a change wants to state belongs in `premise/`, and
its project instance stays here — `premise/README.md` §Adapting says how a crossing is
detected.

**Placement is a routed judgment.** Which surface a clause belongs on — always-loaded
`AGENTS.md`, an unscoped or `paths`-scoped rule, a lazily loaded principle, a skill's own
`references/`, or the commit — is what `/place` audits; run it when the destination is in
doubt rather than settling it by where the clause was first drafted. `AGENTS.md` §Design
Placement carries the placement criteria a run of `/place` applies.

**The order the obligations bind in.** Read the premise sections above. Audit the surface as
opened and write down the subtraction candidates with the obligations each carries. Only then
settle what the change adds, letting the audit shape it. Route each sentence as it is written.
Run `/verify` before the commit, and put the audit's outcome in the commit message.
