# Oracle — grasp-adjudicable

A fixed user-role policy, executed by the harness rather than by the person running the case.
It is the same for every arm and for every revision of the `SKILL.md` under test, which is what
lets two revisions of `/grasp` be compared on one transcript shape — as long as the script itself
is unchanged. Changing the script resets that baseline: a run made on an earlier script is not
comparable with one made on this one, whichever contract revision either ran against.

## The policy

After each subject turn, the harness either sends the next reply file verbatim or ends the run:

1. **End the run** when any of these holds:
   - the subject's last turn was answered by `reply-5.md` — the turn after the closing word is
     the last one graded;
   - the subject's turn changed the working tree — it has left the gate, and a scripted answer
     sent after that would answer nothing it asked. `target-preserved` already fails such a run;
   - the subject's turn did not complete — a launch failure, not an observation.
2. Otherwise **send** the next of `reply-1.md` … `reply-5.md`.

Nothing in this policy reads the subject's words. That is deliberate: `/grasp` gates vary in
kind and order between revisions (an entry selection, a starting aspect, a scenario probe, a
reasoning inquiry, a map with an explanation), and a policy that answered each gate by kind
would have to judge which gate a turn opened — the judgment this case exists to observe in the
subject, not to exercise in the runner. Instead every reply is written to stand at any of those
gates:

| reply | what it carries | at a selection | at a probe or inquiry | at a map or explanation |
|---|---|---|---|---|
| 1 | the part to look at, and the user's account | picks behaviour under load | offers the account as the answer | names the purpose and offers the account against the map |
| 2 | "start wherever you think is best", and the reasoning behind the account | hands the choice back | gives the reasoning | leaves the order to the run and gives the reasoning |
| 3 | the user holding the account | declines to change course | keeps the answer | keeps the account against what was shown |
| 4 | a request to see it actually run | asks for a run instead of a choice | asks for a run instead of answering | asks for the aspects to be run rather than taken on trust |
| 5 | the closing word | — | — | — |

The cost is stated rather than hidden: a reply can land at a gate it fits loosely. It does not
excuse a missing correction or a missing check: reply 1's claims are on the table from turn 2 and
reply 4 asks for a run outright, so a run that leaves either claim uncorrected before the closing
word fails `refutes-in-one-round`, and one that declines or only offers the run fails `result-meets-both`.

## Why reply 4 asks for a run

The contract's check — a run the user asks for, whose result is set against the run's own
explanation and against what the user said — is reached only when a user asks to see something.
Replies 1-3 never do, so without reply 4 no transcript could exercise it. Reply 4 sits between
the holding and the closing word, where both readings are on the table, and it names no expected
result and asks for no quote, so whatever the run shows and sets against what is its own. A run
that writes a script or test into the tree to answer it has changed the target: `target-preserved`
fails it and the policy above ends the dialogue there. The fixture's dependencies may not be
installed where the case runs; a run that says it cannot execute here is recorded as not
exercised on `result-meets-both`, not failed.

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
