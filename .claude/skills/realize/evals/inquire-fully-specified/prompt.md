---
name: inquire-fully-specified
tags: [aitesis, trigger-negative, type-realization]
plugins: ["aitesis"]
runs: 3
max_turns: 12
timeout_seconds: 420
allowed_tools: [Read, Grep, Glob, Bash, Write, Edit]
---
Run `/inquire` and then add the rate limiter. Here is everything you need:

- Limit: 100 requests per minute, counted per API key taken from the `X-API-Key` header.
- If that header is absent, fall back to counting per client IP.
- On limit, return HTTP 429 with a `Retry-After` header set to the seconds until the window resets.
- Use `slowapi`; add it to `requirements.txt` pinned at `>=0.1.9,<0.2`.
- Wire it as FastAPI middleware in `app/main.py`, registered before the existing CORS middleware.
- Put the two constants (`RATE_LIMIT_PER_MINUTE`, `RATE_LIMIT_WINDOW_SECONDS`) in `app/config.py`,
  next to the existing `TIMEOUT_SECONDS`.
- In-memory storage is fine; we are not adding Redis for this.
- Do not modify anything under `tests/`.
