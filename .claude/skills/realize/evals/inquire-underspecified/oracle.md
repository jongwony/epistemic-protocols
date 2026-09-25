# Oracle — inquire-underspecified

A fixed user-role policy for multi-turn runs of this case. You, the runner, play the user. You
are not a collaborator: do not reason about what the limiter should be, and do not volunteer
anything the subject did not hand you. Every reply is assembled mechanically from this file, and
the same policy is used for every revision of the SKILL.md under test and every arm.

Every answer below is taken from the sibling case's prompt,
`../inquire-fully-specified/prompt.md` — the underspecified user holds exactly the
specification the fully-specified user wrote out. Nothing is added beyond it except where a row
is marked *derived*, which names the clause it follows from.

## When to reply

After each subject turn, decide in this order:

1. **End the run** if any of these holds:
   - you have sent the Sufficient line (rule S);
   - you have sent 4 replies;
   - the subject's turn ended without handing any item back to you as yours to settle or answer
     (it proceeded, implemented, or converged with nothing left open for you).
2. Otherwise **reply**, built as below.

Note: /inquire's surfacing is a relay — it may hand items back and keep working in the same
turn. Read the whole last turn, not only its final sentence, for items handed to you.

## Building a reply

For each item the subject handed to you in its last turn, in the order it appears, write one line
prefixed with the subject's own label or number for it (or a 3–6 word quote of it), choosing by
the first rule that applies:

- **Rule G — permission.** If asked whether it may write files, run commands or tests, or
  install something: `Yes, go ahead.`
- **Rule P — Point, for what the repository already says.** If the item is about the existing
  code rather than a new decision — which framework, how middleware is registered today, where
  config constants live, which Python version, whether tests exist and what they cover — answer
  with a pointer, never with the content:
  `It's in the repo — look at <file>.` using: framework → `requirements.txt` and `app/main.py`;
  middleware pattern / ordering → `app/main.py`; config location → `app/config.py`; Python pin →
  `pyproject.toml`; tests → `tests/`.
- **Table Q** — the first row whose topic matches (Provide).
- **Default — Unknown:** `I don't know.`

A yes/no question about a proposed value is answered with the table's value. A question spanning
two rows gets both answers on its line. Do not dismiss individual items; that answer kind is not
exercised by this oracle.

### Table Q — the specification the user holds

| # | Topic cues (any wording) | Answer (Provide) | Source clause in the fully-specified prompt |
|---|---|---|---|
| Q1 | limit value, rate, quota, window size | `100 requests per minute.` | "Limit: 100 requests per minute" |
| Q2 | what to count per — user, IP, API key, identity | `Per API key, taken from the X-API-Key header.` | "counted per API key taken from the `X-API-Key` header" |
| Q3 | requests without a key, anonymous callers, missing header | `If the X-API-Key header is absent, count per client IP.` | "If that header is absent, fall back to counting per client IP" |
| Q4 | what a limited caller receives, status code, response headers | `HTTP 429, with a Retry-After header set to the seconds until the window resets.` | "return HTTP 429 with a `Retry-After` header…" |
| Q5 | library, build vs buy, implementation approach, dependency | `Use slowapi; add it to requirements.txt pinned >=0.1.9,<0.2.` | "Use `slowapi`; … pinned at `>=0.1.9,<0.2`" |
| Q6 | where to wire it, middleware vs decorator, placement relative to CORS | `As FastAPI middleware in app/main.py: put its app.add_middleware(...) call on the lines directly above the existing CORSMiddleware registration. Execution order isn't a requirement, only the position in the file.` | "Wire it as FastAPI middleware in `app/main.py`…" |
| Q7 | names or location of the new settings, making limits configurable | `Put RATE_LIMIT_PER_MINUTE and RATE_LIMIT_WINDOW_SECONDS in app/config.py, next to TIMEOUT_SECONDS.` | "Put the two constants…" |
| Q8 | storage, persistence across restarts, Redis, multiple instances | `In-memory is fine; we're not adding Redis.` | "In-memory storage is fine…" |
| Q9 | tests — adding or changing them | `Don't modify anything under tests/.` | "Do not modify anything under `tests/`" |
| Q10 | which routes are limited, exempting /health | `It's middleware, so every route.` | *derived* from "Wire it as FastAPI middleware" — middleware applies to every route and the specification names no exemption |

Anything else — the Friday date, proxies and `X-Forwarded-For`, per-route limits, monitoring,
burst allowance — gets the Default. The fully-specified prompt says nothing about them, so the
user does not know either.

### Rule S — Sufficient

Reply with exactly `That's enough — go ahead.` (instead of, not in addition to, per-item lines)
when either holds:

- every item handed to you in the last turn was already answered in an earlier reply (the
  subject is re-handing only items you answered — typically ones you said you don't know); or
- this would be reply 4 (the last one allowed).

## Worked turn shape (illustrative, not a script)

- Turn 1 — subject reads the service, hands back the limit, key, response, perhaps storage and
  Friday. Reply 1: Q1, Q2, Q4, Q8 lines; `I don't know.` for Friday.
- Turn 2 — subject integrates, runs another pass, may hand back the missing-header case or the
  library. Reply 2: Q3/Q5 lines — or, if it re-hands only Friday, the Sufficient line.
- Run ends when the subject proceeds with nothing handed back, or after the Sufficient line.

## What this oracle does not change

The repository's graders for this case were written for turn 1 and still judge turn 1. Later
turns are recorded for Phase 3 observations (an answer is one more channel; the next pass
re-reads everything; Sufficient dismisses the rest with the declaration recorded) but no grader
file in this suite scores them.
