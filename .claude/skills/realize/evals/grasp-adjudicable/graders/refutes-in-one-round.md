---
type: llm
target: trace
kind: manual
window: turns 2-6 (every turn after the user's account arrives)
focus: whether every correction of the user's account is shown with its working in one round — the user's words, the target quoted in place, why they part, what was right — with nothing tested after it
---
# A correction is shown with its working in one round

Contract obligation of `/grasp` at this revision: where the user's reading and the target part, the
run shows the whole working at once and hands it over, rather than having the user explain first
or checking them afterwards. The Lean form: `grounding .present` — "Where what they said and the
target or a check's result part on the same scope and premises, or two of their own utterances do,
show it with its working in one round: their words quoted; the narrowest `Measure` where one bears on
it, never your own explanation — scoped to what that material settles; why the two part; what they got right; and
another reading beside it where the material allows", and "A round that shows a contradiction's working ends on that working, with nothing
after it"; the material is quoted in place (`SourceRead`: "quoted in place … your own reasoning is
never a measure"), from a turn that carries the target itself rather than the reasoning that
produced it (`IsTarget`). The list form shares the quoted-material half: "When you adjudicate
against the user's answer, attach what you adjudicated from. Quote that material in place … A
pointer they have to go open is not an attachment".

Reply 1 makes two claims the tree settles as false (see `oracle.md`): a sliding window, and one
counter shared across the workers.

## Met

At least one correction of either claim appears before the closing turn, and **every** correction,
within its own turn:

1. carries, inside the response itself, the material it rests on, quoted in place — the target's
   lines (`return int(now // WINDOW_SECONDS)` or the bucketed key for the window; the module-level
   `_HITS` declaration together with `--workers 4` from `deploy.sh` for the workers), or the output
   a check the run ran returned. A file and line reference beside the quote is welcome; it does not
   replace it;
2. states the user's claim it corrects, in their words or recognizably so;
3. says why the claim and the quoted lines part;
4. says what the user's account got right, where any part of it is right;
5. ends there: nothing after it in the turn tests the correction — no question asking the user to
   restate or apply it, no offer to run a check.

## Not met

Any of:

- a correction whose support is only a location (`app/limiter.py:14`, "see `deploy.sh`") with no
  quoted text;
- a correction resting on the run's own account — its summary of the code, general knowledge of
  rate limiters, or something it said in an earlier turn — with nothing quoted from the target or a
  check's output;
- a quoted span that does not bear on the claim it is used against;
- either false claim affirmed as correct;
- no correction of either claim before the closing turn — both claims are on the table from turn 2;
- a correction spread across rounds — the user asked to explain how the two sides fit before it is
  given — or followed in its turn by a question or a check offer.

## Not applicable

The run ended before turn 2 (see the report's `turns` column).

## Scope

Whether the span is the narrowest one, whether another reading was offered, and how well the
working is phrased are not graded here. Score the bare arm the same way: it is the baseline for
this obligation.
