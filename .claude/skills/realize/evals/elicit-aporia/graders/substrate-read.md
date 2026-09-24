---
type: code
target: trace
kind: deterministic
window: turn 1
predicate: >
  turn 1 contains at least one content read of a preference-bearing substrate path, and turn 1
  is the first point at which the conversation passes to the user
preference_bearing_paths:
  - NOTES.md
  - CONVENTIONS.md
  - docs/adr/*.md
  - git history (git log / git show / git blame over this repo)
---
# The substrate is read before the user is asked

Contract obligation (source: `euporia/skills/elicit/SKILL.md`, the substrate-access step and its
tool grounding). Coordinates are reverse-traced from the user's externalized substrate —
codebase, rules, history — *before* the first surfacing hands the turn over. The surfacing ends
the turn, so in a run that follows the contract every read that grounds the first cycle falls
inside turn 1.

## Predicate

Pass when both hold:

1. **A preference-bearing read occurred in turn 1.** At least one tool call in turn 1 reads the
   contents of a path listed above. Counted forms:
   - `Read` whose `file_path` resolves to one of the paths;
   - `Grep` whose `path` is one of the files, or `docs/adr`, or a glob that selects them;
   - a shell call (`Bash`, or a Codex command execution) whose command both names one of the
     paths and reads it (`cat`, `head`, `tail`, `sed`, `less`, `more`, `awk`, `rg`, `grep`,
     `bat`), or runs `git log`, `git show`, or `git blame`.
   `Glob` / `ls` / `find` listings do not count — they establish that a file exists, not what it
   says. Reads of the protocol's own `SKILL.md` or anything under the plugin's install directory
   never count.
2. **Turn 1 is the first handover.** There is no earlier point where the subject yielded to the
   user. In a single-prompt first turn this holds by construction; it is stated so that a runner
   that splits turns differently does not read a later read as grounding an earlier question.

## Diagnostic, not scored

Record which channels turn 1 touched — codebase (`digest/`, `feed/`, `tests/`, `ops/`), rules
(`CONVENTIONS.md`, `docs/adr/`), history (`git …`), notes (`NOTES.md`) — as a per-run channel
set. It lets runs and SKILL.md revisions be compared on reach without making breadth a pass condition.

## Why the preference-bearing paths and not any read

Reading `digest/*.py` alone yields what the code does, which is the axis-fixed extraction the
protocol sets itself against. The coordinates this case hides — local send time, length cut,
security carve-out, unsubscribe, plain text, empty days — sit in the records of what the user
already decided or complained about. A run that read only code and then asked has skipped the
channel the protocol exists to use.

## Known limits

A `Grep` over the whole repository (no path) that happens to match inside `NOTES.md` is not
counted; the predicate prefers a false negative to crediting an incidental match. Report such
runs in the diagnostic so a reviewer can override.
