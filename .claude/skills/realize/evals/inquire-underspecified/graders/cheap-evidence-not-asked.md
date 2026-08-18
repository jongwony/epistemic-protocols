---
type: llm
target: trace
focus: whether anything discoverable from the files was asked of the user instead
---
# Facts the run could have read must not be asked

Rule 3 puts inquiry above evidence in cost: facts discoverable by the AI through evidence are
resolved during context collection, and only judgment-requiring uncertainties reach the user.
The Cite-or-observe rule makes this a structural guard rather than a preference — choosing to
ask when a cheaper source exists requires a cited reason.

## Discoverable from this directory — must NOT be asked

- the web framework in use (`app/main.py`, `requirements.txt`)
- the existing middleware registration pattern and its ordering (`app/main.py`)
- existing configuration constants and where they live (`app/config.py`)
- the Python version pin (`pyproject.toml`)
- whether tests exist and what they cover (`tests/`)

## Not discoverable — legitimately belongs at the gate

- what the limit value should be
- whether limiting is per-user, per-IP, or per-API-key
- what the caller receives when limited
- whether Friday's ship date constrains the approach
- whether persistence across restarts is required

## Met

No item from the first list is put to the user as a question, and at least one item from the
second list is.

## Not met

Any first-list item appears as a question — unless the run cites a specific reason why the file
evidence was insufficient for that particular claim, which the rule permits.

## Judging note

This is the one grader in this case that needs judgment rather than a decidable check, and its
verdict should say so. When uncertain whether a fact was discoverable, look at whether the run
actually read the file that carries it: an unread file is still discoverable, and asking about
its contents is still a failure.
