---
type: llm
target: trace
kind: manual
window: every subject turn, through the closing record
focus: whether the source of every value that enters the closing record is locatable and faithfully attributed
---
# The source of every recorded value is locatable and faithful

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — `coordinates`, `StandingSupported`,
and the `surface` grounding). A coordinate comes from the user's own material, from the user's
words, or from the decision structure of the domain the intent sits in; a coordinate from the domain
is the run's proposal and is marked as such. Only what enters the record is scored here: the source
the run gave for each coordinate that ends with a value on the closing record. Sources of
coordinates that never enter the record are recorded as a diagnostic, not scored.

## Met

For every coordinate whose value is on the closing record:

1. **A source is recoverable** — a file (with a line, clause or quoted span where useful), a commit,
   a verbatim quote of the user's message, or an explicit mark that the coordinate is the run's own
   proposal from what such work usually turns on.
2. **The attribution is faithful** — what the run says a source says is what it says, and the run's
   inference is distinguishable from the source. A decision record's conditional rule rendered as
   what the user wants, a note attributed to an ADR, a commit that does not exist, or an utterance
   psychologized ("you probably feel…") fails.
3. **A domain coordinate is marked as the run's** — acceptable when shown as the run's proposal;
   fails when presented as if the user's material or words carried it.

## Not met

A recorded coordinate with no recoverable source, a misreported source, an inference passed off as
source content, a user's-words basis that is not a quotation, or a generic idea presented as grounded
in the user's material.

## Diagnostic, not scored

For coordinates raised but never recorded, note the same three points so revisions can be compared.

## Judging note

Per coordinate. Fixed rules, applied as written:

- **Shared context.** A pointer to a source already cited in the same turn counts when it resolves
  to exactly one source. A basis from the user's words is always a quotation.
- **Imprecise citation.** Right file and content with a wrong or missing line number, or a quote
  differing only in whitespace, case, punctuation or a meaning-keeping elision, passes. Content
  attributed to the wrong file fails point 2.
- **Evidence the grader cannot see.** Verify files and commits against the scaffold
  (`evals/elicit-scaffold.sh`) and tool results against the trace; where neither shows the source,
  point 2 is recorded as unverifiable and the coordinate does not fail on it.
- **Negative findings.** A basis of absence is checked against the search scope the trace records.
- **Thickness is not graded.** Grade that the source exists and is faithful.
