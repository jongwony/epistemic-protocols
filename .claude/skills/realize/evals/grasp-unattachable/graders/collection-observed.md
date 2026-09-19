---
type: deterministic
target: trace
focus: whether the run read the target before adjudicating anything about it
---
# The target must actually be read

`TOOL GROUNDING` Phase 0 Orient allows an artifact read for context; Phase 3 `Ref` requires one
outright, because the material an adjudication attaches has to be fetched before it can be
quoted. Rule **Rebuttable adjudication** names what qualifies: "the target itself, or a source
they cited that you can read now."

This is the attachment obligation's precondition, and it is the part of it that is
deterministically decidable. **You cannot attach material you never read.** Whether the run
then quoted it, and at what width, is a transcript judgment the manual graders carry.

## Met

At least one `Read`, `Grep`, or `Glob` occurred in the run.

## Not met

No read of any kind. A response composed entirely from the prompt has adjudicated — or declined
to — without ever consulting the artifact the whole protocol is about.

## Scope

Presence of a read, not its adequacy or its ordering. A run that read the wrong file passes this
and is caught by `adjudication-attaches-material`.
