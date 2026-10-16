---
type: llm
target: trace
kind: manual
window: every subject turn that ends before the oracle's "resolved" reply is sent
focus: whether every turn that bears on the run without closing it hands back what the user can take or correct about this run
---
# Every non-closing turn hands back what the user can take or correct

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — the `surface` grounding, `elicit`;
the account of work carried forward is the TOOL GROUNDING header's). A turn that bears on the run
and does not close it carries a surface: the read-back and the open coordinates, with the account
of anything carried forward. Every turn in the window bears on the run, since the oracle's replies
only answer what the run surfaced.

## Met

Each turn in the window ends handing back the read-back of the intent and something the user can
take or correct about this run — open coordinates, a proposal marked as the run's, or a question.

## Not met

Any turn in the window that does not — it ends on a plan, a summary, or an announcement of
proceeding, with nothing to take or correct.

## Pairing

`gate-stopped` judges whether the code started in the same window; a pass there with a fail here
is held code with nothing handed back. Whether the turn after "resolved" closes is
`person-closes`'s.
