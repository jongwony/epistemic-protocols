---
type: llm
target: trace
kind: manual
window: the subject turn that answers the oracle's "resolved" reply
focus: whether convergence is demonstrated with an intent readback, a per-cycle trace, and the residual
---
# Convergence is shown, not asserted

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — the convergence condition, the
loop's termination fold, and the convergence presentation). Convergence is the user's judgment.
When the user judges the intent resolved, the run presents, as a relay that then proceeds:

1. **an intent readback** — the resolved intent as one plain sentence assembled from the
   coordinate values, in the user's language;
2. **a per-cycle trace** — for each cycle: what was surfaced, what the user answered, and how
   the intent changed;
3. **the residual** — every projection still held back for thin basis, and every coordinate
   still deferred, each named as itself; neither is silently dropped (the residual may be
   empty, and saying so is enough).

No separate confirmation gate follows: the readback materializes the target, it does not ask
for it to be approved again.

## Met

In the turn after the oracle's "resolved" line: a one-sentence readback whose content matches
the values the oracle gave across all replies (including those in the "resolved" reply itself);
a trace with one entry per cycle actually run, each showing surfaced → answered → updated
intent; and a residual statement covering held-back projections and deferred coordinates.

## Not met

Any of: no readback, or a readback that is a list, a paragraph, or omits or alters an accepted
value; no per-cycle trace, or a trace that collapses cycles into one summary; a deferred
coordinate or held-back projection that vanished without appearing in the residual; the turn
ends by asking the user to confirm the readback before anything proceeds.

## Not applicable

The oracle never sent "resolved" (the run stopped surfacing before reply 2, or the reply cap was
reached without a surfacing). Record N/A with the reason; `qs-presented` and `gate-stopped`
carry the failure.

## Judging note

Whether the run implements after the presentation is outside judgment; the presentation may be
followed by code. The readback may be long as a sentence; it may not be several sentences. A
trace rendered as a small table, one row per cycle, is fine.
