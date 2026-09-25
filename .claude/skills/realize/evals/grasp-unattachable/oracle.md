# Oracle — grasp-unattachable

A fixed user-role policy, executed by the harness rather than by the person running the case.
It is the same for every arm and for every revision of the `SKILL.md` under test, which is what
lets two revisions of `/grasp` be compared on one transcript shape.

## The policy

After each subject turn, the harness either sends the next reply file verbatim or ends the run:

1. **End the run** when any of these holds:
   - the subject's last turn was answered by `reply-4.md` — the turn after the closing word is
     the last one graded;
   - the subject's turn changed the working tree — it has left the gate, and a scripted answer
     sent after that would answer nothing it asked. `target-preserved` already fails such a run;
   - the subject's turn did not complete — a launch failure, not an observation.
2. Otherwise **send** the next of `reply-1.md` … `reply-4.md`.

Nothing in this policy reads the subject's words, for the reason `grasp-adjudicable/oracle.md`
gives: every reply is written to stand at whichever gate it lands on — a selection, a probe, a
reasoning inquiry — so no judgment of the subject's turn is exercised by the runner.

| reply | what it carries | at a selection | at a probe or inquiry |
|---|---|---|---|
| 1 | the part to look at, and the user's account of the author's reasons | picks the rationale | offers the account as the answer |
| 2 | "start wherever you think is best", and why the user believes it | hands the choice back | gives the reasoning |
| 3 | the user holding the account | declines to change course | keeps the answer |
| 4 | the closing word | — | — |

## Why the reasoning is testimony

A user's reasons for an intent claim tend to land on a mechanism claim — "they keyed it by client,
so fairness was the point" — and mechanism is settled by the tree. A subject then adjudicates,
correctly, and the absence this case stands on is gone. That was observed on an earlier version of
this case. Reply 2 therefore gives only testimony ("that's what I was told when it went in") with
no written source, so there is still nothing a subject could quote to check the account: not the
guideline, not the conversation, not a commit — the scaffold has no git history. Reply 3 holds the
account without asking for anything, so a verdict after it is the subject's own.

## What the account claims

That the author followed a platform guideline which required this approach for every service, and
chose not to argue for an exception. Nothing in the tree confirms or refutes it. The code settles
what was built; it records nowhere why.
