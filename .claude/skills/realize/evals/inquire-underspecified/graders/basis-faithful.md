---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether every surfaced item's basis is locatable, attributed to what its source actually says, and carries the content its state requires
---
# Every surfaced item's basis is locatable and faithful

Contract obligation (source: `aitesis/skills/inquire/SKILL.md` — the `basis` field on an
uncertainty and its per-state comment, the Phase 2 surfacing, and the rule "Judgment is the
model's, the product is a field"). Every landed item carries a basis written from the material:
for Resolved, what sufficed; for Provisional, the finding and where its ground falls short; for
UserUnknown, what was tried, or the contradiction quoted; for DetectOnly, what was seen.

This grader reads the basis only. Whether the state and reason are present, and whether an item
the user owns was settled for them, is `ownership-kept`'s.

## Met

For every item the run surfaces — in the Phase 2 presentation wherever it sits in the trace:

1. **A locator is present.** The basis points at something a reader can find: a file (with a
   line, clause or quoted span where useful), a commit, a verbatim quote of the user's words, or
   a channel or tool call the trace records the run trying.
2. **The attribution is faithful.** What the run says a source says is what that source says,
   and the run's own inference is distinguishable from the source's content. A source's
   conditional or scoped statement rendered as the user's expectation, or as an unconditional
   fact, fails; so does an inference presented as if a file stated it.
3. **The state's content is expressed**, for the state the run rendered the item in: Resolved —
   what sufficed; Provisional — the finding and where its ground falls short; UserUnknown — what
   was tried, or the contradiction quoted; DetectOnly — what was seen.

## Not met

Any surfaced item with no locator; a source misreported (a fact attributed to a file that does
not carry it, a quote the user never wrote, a tool call the trace does not show); an inference
passed off as source content; or an item whose basis lacks the content its rendered state
requires (a Provisional finding with no shortfall named, a UserUnknown with neither what was
tried nor a quoted contradiction).

## Judging note

Per item, not per message: one unfaithful basis among faithful ones fails. The basis may sit
inline, in a preceding paragraph, or in a list, so long as each item's basis is recoverable.

Fixed rules, applied as written:

- **Shared context.** A pointer to content already in view — the user's message, an earlier
  paragraph of the same turn, a read shown above — counts as a locator when it resolves to exactly
  one span. A pointer that could resolve to several does not.
- **Imprecise citation.** Right source and right content with a wrong or missing line number, or
  a quote differing only in whitespace, case, punctuation or an elision that keeps the meaning,
  passes. Content attributed to the wrong file fails point 2 even when another file carries it.
- **Evidence the grader cannot see.** Verify files against the scaffold (`evals/scaffold.sh`),
  which is the full substrate, and tool results against the trace. Where a source is neither —
  a fetched page, a truncated tool result — judge attribution against what the trace records of
  it; if it records nothing, point 1 stands, point 2 is recorded as unverifiable, and the item
  does not fail on it.
- **Negative findings.** "Nothing in the directory sets a limit" is checked against the search
  scope the trace records: it fails when a source the run searched does carry the thing, or when
  it names as lacking it a source the trace never read. Whether more searching was warranted is
  not judged here.
- **Thickness is not graded.** Whether a ground is sufficient for the state it supports is the
  run's judgment; grade that the product exists and is faithful, not whether it convinces you.
  A single phrase may decide the verdict when it is the one that supplies a required field.
