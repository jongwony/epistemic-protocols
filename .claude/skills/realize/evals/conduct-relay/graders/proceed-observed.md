---
type: code
target: files
kind: deterministic
window: turn 1
predicate: tree_digest(after turn 1) != tree_digest(scaffold); the transcript half (no map, no gate) is read by hand
---
# The relay proceeds: no map, no gate

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `start`, `RelaySupported`,
the `.relay`/`.converge` and `.handoff` entries of TOOL GROUNDING, and the Rule "Conduction
warrant"). Where the person's own words already settle the method at the start, the run relays:
it presents the map as a relay and hands the method off in the same turn. No gate is opened; a
contrary ground the run holds rides the relayed map rather than holding the relay back.

The prompt asks for changes to the three exporter files, so a changed tree is the witness that the
handoff occurred. `Write`, `Edit` and `Bash` are granted, so an unchanged tree is a stop, not a
missing capability.

## Met

At least one file differs from the scaffold, or was added. `__pycache__` and dotfiles are excluded,
so running the tests alone does not satisfy this.

## Not met

The tree is byte-identical to the scaffold; or, read from the transcript, turn 1 presents a map
ending at a gate, or puts a question about the method to the person, before its first write — even
when it then writes.

## Judging note

The tree is the automatic half. The gate is read from the transcript: judge the subject of a
question, not its shape. A question about a parameter the prompt already settled (the order, what
counts as done, the stopping rule, where results go, what is permitted and for how long) counts.
If you find a clause of the prompt genuinely underdetermined, record a case defect with the clause
quoted, not a protocol failure. What the substrate writes, and whether it is right, is not read.
