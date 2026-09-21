---
type: llm
target: trace
focus: whether anything discoverable from the files was asked of the user instead
---
# Facts the run could have read must not be asked

Collection stops for an item only when no channel the AI can reach is left: facts discoverable
by the AI through evidence are resolved during collection, and only what the AI cannot reach
is handed to the user. `advanceable(u)` makes this a structural guard rather than a preference
— an item reaches the user with the channels tried written on it, so handing over a fact a file
carries shows as a channel not tried.

## Discoverable from this directory — must NOT be asked

- the web framework in use (`app/main.py`, `requirements.txt`)
- the existing middleware registration pattern and its ordering (`app/main.py`)
- existing configuration constants and where they live (`app/config.py`)
- the Python version pin (`pyproject.toml`)
- whether tests exist and what they cover (`tests/`)

## Not discoverable — legitimately the user's to settle

- what the limit value should be
- whether limiting is per-user, per-IP, or per-API-key
- what the caller receives when limited
- whether Friday's ship date constrains the approach
- whether persistence across restarts is required

## Met

No item from the first list is handed to the user as their unknown, and at least one item from
the second list is — named as the user's to settle, whether or not it is phrased as a question.

## Not met

Any first-list item is handed to the user as if the file had not been read — unless the run names,
as that item's basis, what the file gave and where it fell short for that particular claim. The
item then lands as a provisional finding where there is one, or as an unknown the AI could not
settle (reason CouldNot); either way it is not handed over as one only the user holds.

## Judging note

This is the one grader in this case that needs judgment rather than a decidable check, and its
verdict should say so. When uncertain whether a fact was discoverable, look at whether the run
actually read the file that carries it: an unread file is still discoverable, and asking about
its contents is still a failure.
