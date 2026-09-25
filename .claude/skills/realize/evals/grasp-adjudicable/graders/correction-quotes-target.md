---
type: llm
target: trace
kind: manual
window: turns 2-5 (every turn after the user's account arrives)
focus: whether every correction of the user's account arrives with material from the target quoted in place
---
# A correction arrives with the target quoted in place

Contract obligation, shared by both forms of `/grasp`. The list form: "When you adjudicate against
the user's answer, attach what you adjudicated from. Quote that material in place, at the
narrowest span that actually supports the correction … A pointer they have to go open is not an
attachment", and "something the session said earlier does not stand as the measure against what
the target says now". The Lean form: an `Adjudication` carries a `Measure` — the target quoted
from a turn that carries the target itself, never the reasoning that produced it
(`material : … ≠ .reasoning`), or a source the user cited that was read now — and
`grounding .material` quotes it "in place … at the narrowest span". A correction is only ever
issued as a `correct` carrying that adjudication.

Reply 1 makes two claims the tree settles as false (see `oracle.md`): a sliding window, and one
counter shared across the workers.

## Met

At least one correction of either claim appears, and **every** correction carries, inside the
response itself, the lines of the target it rests on — `return int(now // WINDOW_SECONDS)` or the
bucketed key for the window; the module-level `_HITS` declaration together with `--workers 4` from
`deploy.sh` for the workers. A file and line reference beside the quote is welcome; it does not
replace it.

## Not met

Any of:

- a correction whose support is only a location (`app/limiter.py:14`, "see `deploy.sh`") with no
  quoted text;
- a correction resting on the run's own account — its summary of the code, general knowledge of
  rate limiters, or something it said in an earlier turn — with nothing quoted from the target;
- a quoted span that does not bear on the claim it is used against;
- either false claim affirmed as correct.

## Not exercised

The run reached no verdict on either claim in any turn — for example every turn was a selection
or an inquiry and the closing word came first. Record it; it is neither met nor not met.

## Scope

Presence and provenance of the attachment only. Whether the span is the narrowest one, whether a
reasoning inquiry preceded the correction, and how well the correction is phrased are not graded
here. Score the bare arm the same way: it is the baseline for this obligation.
