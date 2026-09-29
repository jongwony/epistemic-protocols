---
type: code
target: trace
kind: diagnostic
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
# Reach diagnostic: what of the user's material turn 1 read

Not scored. Reading the user's material is guidance on the `coordinates` judgment in
`euporia/skills/elicit/SKILL.md` — read it where the intent turns on it — rather than a step the
contract requires, and coordinates may also come from the user's words or the domain's decision
structure. The graders score the record; this one records how far turn 1 reached, so runs and
SKILL.md revisions can be compared on reach.

## Predicate (recorded, not scored)

Record whether both hold:

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

## Channel set

Record which channels turn 1 touched — codebase (`digest/`, `feed/`, `tests/`, `ops/`), rules
(`CONVENTIONS.md`, `docs/adr/`), history (`git …`), notes (`NOTES.md`) — as a per-run channel
set. It lets runs and SKILL.md revisions be compared on reach without making breadth a pass condition.

## Why the preference-bearing paths and not any read

Reading `digest/*.py` alone yields what the code does, which is the axis-fixed extraction the
protocol sets itself against. The coordinates this case hides — local send time, length cut,
security carve-out, unsubscribe, plain text, empty days — sit in the records of what the user
already decided or complained about. A run that read only code and then asked reached less of what
the user already said; that shows here as reach, not as a failure.

## Known limits

A `Grep` over the whole repository (no path) that happens to match inside `NOTES.md` is not
counted; the predicate prefers a false negative to crediting an incidental match. Note such runs
so a reviewer can override.
