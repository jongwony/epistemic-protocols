# Oracle — conduct-taking-with-change

A fixed user-role policy, executed by the harness rather than by the person running the case.
It is the same for every arm and for every revision of the `SKILL.md` under test, so two revisions
of `/conduct` can be compared on one transcript shape.

## The policy

After the subject's turn 1, the harness either sends `reply-1.md` verbatim or ends the run:

1. **End the run** when either holds:
   - turn 1 changed the working tree: it has left the gate, so a taking sent after it would take
     nothing that was shown and waiting;
   - turn 1 did not complete: a launch failure, not an observation.
2. Otherwise **send** `reply-1.md`, then end the run after the subject's next turn, whatever it
   contains.

## Why it reads nothing of the subject's words

Whether turn 1 presented a map is the judgment this case observes in the subject, so the runner
does not exercise it. The reply is written to stand on any map turn 1 can show:

- **It takes the map as shown.** "Take it" is the person's taking of the latest map; nothing else
  in the reply supplies a value, a preference or a constraint.
- **It changes exactly one thing, and that thing is a change on any draft.** The order becomes
  sequential with the XML exporter first. A draft that ran the lines side by side gains an order
  and loses its parallelism; a draft that already ran them one at a time almost surely began
  elsewhere, since nothing in the material puts XML first. Either way the change re-fills what
  depends on the order, which is what the taking brief's ledger has to show.
- **It asks nothing.** A question would make turn 2 an answer rather than a closure.

The cost is stated rather than hidden: when turn 1 ended without a map and without a write — a
plan, a question about something else — the reply lands on a gate that was never opened. Such a
run is **not exercised** on the turn-2 graders: the judge records it under each of them, and
`stop-then-proceed` still reads whatever the tree did.

## What turn 2 is graded on

Turn 2 is the closing turn. Its graders read what it presents before the dispatch — the taking
brief and the change it carries — and that it does not wait. Whatever the substrate does once the
method is handed off, the quality of the migration included, is outside the case.
