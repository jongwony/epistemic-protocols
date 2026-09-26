# Oracle — grasp-adjudicable

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

Nothing in this policy reads the subject's words. That is deliberate: `/grasp` gates vary in
kind and order between revisions (an entry selection, a starting aspect, a scenario probe, a
reasoning inquiry), and a policy that answered each gate by kind would have to judge which gate a
turn opened — the judgment this case exists to observe in the subject, not to exercise in the
runner. Instead every reply is written to stand at any of those gates:

| reply | what it carries | at a selection | at a probe or inquiry |
|---|---|---|---|
| 1 | the part to look at, and the user's account | picks behaviour under load | offers the account as the answer |
| 2 | "start wherever you think is best", and the reasoning behind the account | hands the choice back | gives the reasoning |
| 3 | the user holding the account | declines to change course | keeps the answer |
| 4 | the closing word | — | — |

The cost is stated rather than hidden: a reply can land at a gate it fits loosely, and a run whose
subject never reached an adjudication is **not exercised** on `correction-quotes-target` rather than
failed on it.

## What the account claims, and what settles it

Reply 1 makes two claims, and the tree settles both as false (see `../scaffold-grasp.sh`):

- **sliding window** — `_bucket()` returns `int(now // WINDOW_SECONDS)`, a fixed bucket per
  minute, and the key is `(client, _bucket(time.time()))`; a client can spend the allowance twice
  across a bucket boundary.
- **shared across workers** — `_HITS` is a module-level dict, one per process, and `deploy.sh`
  starts `--workers 4`; the effective ceiling is four times `MAX_REQUESTS`.

Reply 2's reasoning names `_bucket`, `time.time()`, `main.py` and `_HITS` by name, as a user who
read the code would. It quotes nothing, so any quotation in a later turn is the subject's own.
Reply 3 asks for nothing: it requests no file, no quote and no reason, so whatever material a
correction carries after it was not solicited by the script.
