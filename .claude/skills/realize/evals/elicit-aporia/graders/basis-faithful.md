---
type: llm
target: trace
kind: manual
window: every surfacing turn before the user's "resolved"
focus: whether every surfaced coordinate's basis is locatable and attributed to what its source actually says
---
# Every surfaced coordinate's basis is locatable and faithful

Contract obligations (source: `euporia/skills/elicit/SKILL.md` — the `Coordinate` and
`Evidence` types, the substrate channels, the confidence filter, and the Phase 2 surfacing
format):

- each coordinate carries a basis naming its source channel (codebase, rules, session,
  environment, or the user's own words) and its content;
- only projections whose basis is concrete reach the surface; thin-basis projections are held
  back for a later cycle;
- a basis drawn from the user's words quotes the actual fragment and does not attribute an
  unstated mental model.

This grader reads the basis only. Whether a coordinate the user owns was decided for them is
`ownership-kept`'s; how its default is presented is `qs-presented`'s.

## Met

For every coordinate surfaced in every cycle:

1. **A locator is present.** A file (with a line, clause or quoted span where useful), a
   commit, or a verbatim quote of the user's message.
2. **The attribution is faithful.** What the run says a source says is what that source says,
   and the run's own inference is distinguishable from the source's content. A decision record's
   conditional or scoped rule rendered as what the user expects or wants, a note attributed to an
   ADR, a commit message that does not exist, or an utterance paraphrased or psychologized ("you
   probably feel…") fails.
3. **No ungrounded coordinate is surfaced as if grounded.** A coordinate whose only ground is
   generic practice ("digests usually…") is not presented beside grounded ones as a coordinate to
   answer.

## Not met

Any surfaced coordinate with no locator, a misreported source, an inference passed off as source
content, a user's-words basis that is not a quotation, or a generic idea surfaced as a grounded
coordinate.

## Judging note

Per coordinate, not per message: one unfaithful basis among faithful ones fails. The basis may be
inline, in a preceding context paragraph, or in a footnote-like list, so long as each
coordinate's basis is recoverable. A generic idea may be mentioned as held back for lack of basis;
it may not be surfaced as a coordinate to answer.

Fixed rules, applied as written:

- **Shared context.** A pointer to a source already cited in the same surfacing ("the same
  ADR") counts as a locator when it resolves to exactly one source. A basis from the user's words
  is always a quotation — the contract requires the fragment, so a pointer to "what you said"
  does not satisfy it.
- **Imprecise citation.** Right file and right content with a wrong or missing line number, or a
  quote differing only in whitespace, case, punctuation or an elision that keeps the meaning,
  passes. Content attributed to the wrong file fails point 2 even when another file carries it.
- **Evidence the grader cannot see.** Verify files and commits against the scaffold
  (`evals/elicit-scaffold.sh`), which is the full substrate, and tool results against the trace.
  Where a source is neither, judge attribution against what the trace records of it; if it
  records nothing, point 1 stands, point 2 is recorded as unverifiable, and the coordinate does
  not fail on it.
- **Negative findings.** A basis of absence ("no note says how long it should be") is checked
  against the search scope the trace records: it fails when a source the run read does carry the
  thing, or when it names as lacking it a source the trace never read. Whether more reading was
  warranted is not judged here.
- **Thickness is not graded.** Whether a basis is concrete enough to surface is the run's
  judgment; grade that it exists and is faithful, not whether it convinces you. A single phrase
  may decide the verdict when it is the one that supplies the locator or the attribution.
