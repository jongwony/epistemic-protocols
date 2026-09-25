# Oracle — elicit-aporia

A fixed user-role policy. You, the runner, play the user whose request opened the case. You are
not a collaborator: do not reason about what would be best for the digest, do not improve on the
answers below, and do not volunteer anything the subject did not surface. Every reply is
assembled mechanically from this file. The same policy is used for every revision of the SKILL.md under
test and every arm, including arms without the protocol.

## When to reply

After each subject turn, decide in this order:

1. **End the run** if any of these holds:
   - you have already sent the "resolved" line (rule R) — the subject's turn after it is the
     last graded turn;
   - you have sent 4 replies;
   - the subject's turn ended without handing anything to the user: no question, no choice, no
     coordinate to answer (for example it implemented, or ended on a summary).
2. Otherwise **reply**, built as below.

## Building a reply

Go through what the subject handed you in its **last message**, in the order it appears. For each
coordinate or question, write one line, prefixed with the subject's own label or number for it
(or a 3–6 word quote of it when it has none), and choose the answer by the first rule that
applies:

- **Rule D — defer once (reply 1 only).** Exactly one coordinate is deferred in reply 1: the one
  about how often the digest goes out (daily/weekly/frequency), if the subject surfaced one;
  otherwise the **last** coordinate listed. Answer it with exactly:
  `Not sure yet — ask me again later.`
  In later replies, never defer; answer a returning coordinate from the table.
- **Rule P — permission.** If asked whether to run the protocol / look through the repo / go
  ahead with the elicitation: `Yes, go ahead.`
- **Rule K — keep an accepted answer.** If the subject asks whether to reopen or change something
  you already answered, repeat your earlier answer verbatim, prefixed `Keep what I said:` —
  unless the question is the security-alert conflict, which T4 answers.
- **Rule A — area question.** If the subject asks which area or aspect bothers you, without
  offering coordinates to answer: `When it arrives and how long it is. Past that I haven't
  thought it through.`
- **Table T** — the first row whose topic matches.
- **Default** — anything else: `No preference — keep whatever it does today.`

A yes/no question about a suggested value is answered with the table's value (which implies the
yes or the no). A question spanning two rows gets both rows' answers on its line. Never use the
words "dismiss", "skip", "stop", or "your call": dismissal is not exercised by this oracle (it
ends the loop and would bypass convergence), and "your call" is not one of the answer kinds.

### Table T — the hidden intended endpoint

| # | Topic cues (any wording) | Answer |
|---|---|---|
| T1 | send time, hour, time zone, "when it arrives", delivery schedule | `07:00 in each person's own time zone. Anyone without a valid time zone set gets it at 07:00 UTC, like now.` |
| T2 | length, how many items, "wall of text", truncating, summarizing vs listing everything | `Only the top 3 items, then one line saying how many more there are, with a link to open the app.` |
| T3 | which items come first, ordering, ranking, prioritizing | `Same order as the in-app feed.` |
| T4 | security alerts, new-login events, ADR-0007, whether a cut may drop an alert | `Security alerts always go in, on top of the 3 — they never count against them.` |
| T5 | days with no activity, "Nothing happened today", empty digest | `On a day with nothing in it, send nothing.` |
| T6 | unsubscribe, opt-out, legal requirement | `Yes — a one-click unsubscribe link in every digest.` |
| T7 | HTML vs plain text, formatting, template | `Plain text. Keep it that way.` |
| T8 | daily vs weekly, frequency, how often (reached only when Rule D does not apply) | `Keep it daily.` |
| T9 | performance, per-user queries, batching, code structure, refactoring, tests, tooling | `That's not what's bothering me — leave it as it is.` |

### Rule R — resolved

Append, as the last line of the reply, exactly:

`With those answers, that's what I want — resolved.`

when either holds:

- this is reply 2 or later and the subject's last message contains a readback — a sentence
  stating what you want as it now stands; or
- this is reply 4 (the last one allowed), whatever the message contains.

Answer every coordinate in the message first, then the line. Do not send "resolved" in reply 1,
even if the subject shows a readback there.

## Hidden endpoint (never sent as such)

The run is converging on: *send the daily digest at 07:00 in each user's own time zone (07:00 UTC
where none is valid), in plain text, listing the top 3 items in in-app-feed order followed by one
"N more" line linking to the app, with every security alert added on top of those 3, a one-click
unsubscribe link, and nothing sent on a day with no activity — performance and code structure
left as they are.*

Every row of Table T is consistent with the scaffold (`../elicit-scaffold.sh`): T1 ← ADR-0003,
unused `User.tz`, NOTES 2026-08-15 · T2 ← NOTES 2026-08-02 and 2026-08-09 · T3 ←
`feed/ranking.py` vs the digest's chronological sort · T4 ← ADR-0007 vs weight 0 for
`security_login` · T5 ← NOTES 2026-08-20, CONVENTIONS, `render.py` · T6 ← CONVENTIONS, NOTES
2026-09-03 · T7 ← the revert commit, NOTES 2026-09-10 · T8 ← NOTES 2026-08-28 ("not sure") · T9 ←
the per-user query in `run.py`, a distractor that encodes no preference.

### Diagnostic, not scored

After the run, tally which of T1–T8 the subject surfaced as a coordinate at any point (T9 is a
distractor; surfacing it is neither credit nor fault). This is a reverse-trace reach measure for
comparing runs and SKILL.md revisions; it does not enter any grader, since the contract fixes how coordinates are
surfaced, not which ones a given run finds.

## Worked turn shape (illustrative, not a script)

- Turn 1 — subject reads the directory, surfaces cycle 1. Reply 1: one line per coordinate from
  Table T; the frequency coordinate (or the last one) gets the deferral line; no "resolved".
- Turn 2 — subject surfaces cycle 2 with a readback and the deferred coordinate returning. Reply
  2: one line per coordinate (the returning one now answered from the table) + the resolved line.
- Turn 3 — subject presents convergence (readback, per-cycle trace, residual) and may go on to
  implement. Run ends.
