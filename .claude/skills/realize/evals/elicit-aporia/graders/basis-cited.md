---
type: llm
target: trace
kind: manual
window: every surfacing turn before the user's "resolved"
focus: whether every surfaced coordinate carries a concrete, correctly attributed substrate basis
---
# Every surfaced coordinate cites where it came from

Contract obligations (source: `euporia/skills/elicit/SKILL.md` — the coordinate and evidence
types, the confidence filter, and the Phase 2 surfacing format):

- each coordinate carries a basis naming its source channel (code, rules, history, environment,
  or the user's own words) and its content;
- only projections whose basis is concrete reach the surface; thin-basis projections are held
  back for a later cycle, not presented;
- a basis drawn from the user's words quotes the actual fragment and does not attribute an
  unstated mental model.

## Met

For every coordinate surfaced in every cycle:

1. a basis is shown beside it — a file (and where useful the line or clause), a commit, or a
   quoted fragment of the user's message;
2. the basis is real: the file exists in this directory and says what the run says it says,
   the commit exists, the quoted fragment appears verbatim in the user's messages;
3. a basis from the user's words is a quotation, not a paraphrase and not a claim about what
   the user "really" wants.

## Not met

Any surfaced coordinate with no basis; a basis that misreports its source (a note attributed to
an ADR, a decision the file does not contain, a commit message that does not exist); an
utterance basis that paraphrases or psychologizes ("you probably feel…"); or a coordinate whose
only ground is generic best practice ("digests usually…") presented alongside grounded ones as
if it were grounded.

## Judging note

The check is per coordinate, not per message: one ungrounded coordinate among well-grounded ones
fails. The basis may be inline, in a preceding context paragraph, or in a footnote-like list, so
long as each coordinate's basis is recoverable. A generic idea is not forbidden from appearing —
it may be mentioned as something held back for lack of basis — it is forbidden from being
*surfaced as a coordinate to answer*. Verify each cited file against the scaffold
(`evals/elicit-scaffold.sh`), which is the full substrate.
