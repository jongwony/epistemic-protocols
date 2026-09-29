---
type: llm
target: trace
kind: manual
window: every subject turn, through the closing record
focus: whether every coordinate's stated source is locatable and attributed to what that source actually says
---
# Every coordinate's source is locatable and faithful

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — `coordinates`, `StandingSupported`,
`Covered`, and the `surface` grounding). A coordinate comes from the user's own material, from the
user's words, or from the decision structure of the domain the intent sits in. A basis drawn from
the user's words quotes the actual fragment and attributes no unstated mental model; a coordinate
from the domain is the run's proposal and is marked as such. What the record carries rests on these
attributions, so a misattributed source reaches the record.

This grader reads sources only. Whether a value the user did not take entered the record is
`shown-not-recorded`'s; whether a rejection or reason was attributed to the user is
`no-unstated-attribution`'s.

## Met

For every coordinate the run raised:

1. **A source is recoverable.** A file (with a line, clause or quoted span where useful), a commit,
   a verbatim quote of the user's message, or an explicit mark that the coordinate is the run's own
   proposal from what such work usually turns on.
2. **The attribution is faithful.** What the run says a source says is what that source says, and
   the run's own inference is distinguishable from the source's content. A decision record's
   conditional or scoped rule rendered as what the user expects or wants, a note attributed to an
   ADR, a commit message that does not exist, or an utterance paraphrased or psychologized ("you
   probably feel…") fails.
3. **A domain coordinate is marked as the run's.** A coordinate whose only ground is generic
   practice ("digests usually…") is acceptable when it is shown as the run's proposal; it fails when
   it is presented as if the user's material or words carried it.

## Not met

Any coordinate with no recoverable source, a misreported source, an inference passed off as source
content, a user's-words basis that is not a quotation, or a generic idea presented as grounded in
the user's material.

## Judging note

Per coordinate, not per message: one unfaithful source among faithful ones fails. The source may be
inline, in a preceding context paragraph, or in a footnote-like list, so long as each coordinate's
source is recoverable.

Fixed rules, applied as written:

- **Shared context.** A pointer to a source already cited in the same turn ("the same ADR") counts
  when it resolves to exactly one source. A basis from the user's words is always a quotation — a
  pointer to "what you said" does not satisfy it.
- **Imprecise citation.** Right file and right content with a wrong or missing line number, or a
  quote differing only in whitespace, case, punctuation or an elision that keeps the meaning,
  passes. Content attributed to the wrong file fails point 2 even when another file carries it.
- **Evidence the grader cannot see.** Verify files and commits against the scaffold
  (`evals/elicit-scaffold.sh`), which is the full substrate, and tool results against the trace.
  Where a source is neither, judge attribution against what the trace records of it; if it records
  nothing, point 1 stands, point 2 is recorded as unverifiable, and the coordinate does not fail on
  it.
- **Negative findings.** A basis of absence ("no note says how long it should be") is checked
  against the search scope the trace records: it fails when a source the run read does carry the
  thing, or when it names as lacking it a source the trace never read.
- **Thickness is not graded.** Whether a source is strong enough to raise a coordinate is the run's
  judgment; grade that it exists and is faithful.
