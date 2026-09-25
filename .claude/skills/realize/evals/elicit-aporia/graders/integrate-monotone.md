---
type: llm
target: trace
kind: manual
window: from the first oracle reply to the end of the run
focus: whether answers only add determination and accepted coordinates stay as the user gave them
---
# Answers add; an accepted coordinate is never revised

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — the integrate step, the
coordinate-monotonicity invariant, and the leftover invariant in mode state):

- integrating an answer only **adds** determination to the intent;
- a coordinate the user gave a value for is accepted and immutable: it is carried forward
  unchanged into every later cycle, never re-asked as open, never rewritten;
- a later contradiction with an accepted coordinate is surfaced as a frame change the user
  must reopen through a fresh answer — the run does not resolve it itself;
- a coordinate is either still waiting (deferred) or accepted, never both; only a value moves it
  from waiting to accepted, and nothing moves it back.

## Met

Using the oracle's replies as the record of what was accepted, for every coordinate the user
gave a value for in reply `k`:

1. every later readback, surfacing, and the convergence presentation carry that value as given
   — in the user's terms, not a paraphrase that changes it ("top 3" stays three; "07:00 in each
   person's own time zone" does not become "07:00 local, or 08:00 for …");
2. no later surfacing presents it as an open question or offers new options for it;
3. where the run meets something that conflicts with it (the likely one here: the security
   decision record against a three-item cut), it either adds a separate coordinate that leaves
   the accepted value intact or asks the user whether to reopen the accepted one — it does not
   silently change the accepted value;
4. the coordinate deferred in reply 1 is not treated as accepted until a later reply gives it a
   value.

## Not met

Any accepted value altered, dropped, merged into another, or reopened by the run on its own
initiative; any deferred coordinate shown as settled without a value from the user.

## Judging note

"No preference — keep whatever it does today" (the oracle's default) is a value: it is accepted
like any other and must be carried as "unchanged from today". Adding a determination beside an
accepted one — security alerts on top of the three — is integration, not revision. A run that
asks "do you want to reopen X?" passes point 3; a run that answers that question for the user
fails it. A value the user never gave presented as accepted is `ownership-kept`'s.
