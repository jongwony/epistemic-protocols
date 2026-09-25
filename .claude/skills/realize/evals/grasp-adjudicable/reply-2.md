---
turn: 3
carries: a hand-back of any selection, and the user's reasoning for the account
---
Start wherever you think is best. Why I read it that way: `_bucket` is worked out from
`time.time()` on every request rather than from a stored window start, so I took the 60 seconds to
be measured back from now. And the middleware is registered once in `main.py`, so I took `_HITS` to
be one dict behind every worker.
