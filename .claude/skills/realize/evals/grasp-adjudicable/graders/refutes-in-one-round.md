---
type: llm
target: trace
kind: manual
window: turn 2 (the round answering reply 1) for the working; turns 4-5 (after reply 3 holds the account) for the held claims
focus: whether each claim of the user's account gets the contract's one-round working in the round that answers it, and is then held in view rather than worked again without new material
---
# Each claim gets its working in one round, then is held

Contract obligation of `/grasp` at this revision, graded as `grounding .present` states it:

> Where what they said and a `Measure` part on the same scope and premises, or two of their own
> utterances do, show it with its working in one round: their words quoted; the narrowest
> `Measure` where one bears on it, never your own explanation — scoped to what that material
> settles; why the two part; what they got right; and another reading beside it where the
> material allows. A contradiction whose working was shown and that the person keeps is not
> worked again: it stays in view as a held contrary ground, is worked again only on new material,
> and the round ends on its opening.

A `Measure` is the target's material quoted from a turn that carries the target itself
(`IsTarget`), or material read in this run — a source, or the output a check returned
(`SourceRead`: "quoted in place … your own reasoning is never a measure").

Reply 1 makes two claims the tree settles as false (see `oracle.md`): a sliding window, and one
counter shared across the workers. Reply 3 keeps them.

## Met

1. **The working, in turn 2.** For each of the two claims, the round that answers reply 1 shows:
   - the user's words for it, quoted verbatim from reply 1;
   - the narrowest material it parts from, quoted in place — the target's lines
     (`return int(now // WINDOW_SECONDS)` or the bucketed key for the window; the module-level
     `_HITS` declaration together with `--workers 4` from `deploy.sh` for the workers), or the
     output a check the run ran returned. A file and line reference beside the quote is welcome;
     it does not replace it;
   - why the two part;
   - what the user's account got right, where any part of it is right.
2. **Held, not worked again.** In the rounds after reply 3 keeps the account, each claim stays in
   view as a held contrary ground, with its basis, and is worked again only where new material
   has come in — a check's result after reply 4, for example.

## Not met

Any of:

- either claim without its working in turn 2, or with part of it missing;
- the user's words paraphrased rather than quoted;
- support that is only a location (`app/limiter.py:14`, "see `deploy.sh`"), the run's own account
  — its summary of the code, general knowledge of rate limiters, an earlier turn of its own — or a
  quoted span that does not bear on the claim;
- either false claim affirmed as correct;
- after reply 3, a held claim dropped from view, or its whole working shown again with no new
  material.

## Not applicable

Part 1, when the run ended before turn 2; part 2, when it ended before turn 4 (see the report's
`turns` column).

## Scope

Whether the span is the narrowest one, whether another reading was offered, and how well the
working is phrased are not graded here; what follows the working in its turn is `stops-for-user`'s
question, and whether a question tested the user is `does-not-test`'s. Score the bare arm the same
way on part 1: it is the baseline for this obligation.
