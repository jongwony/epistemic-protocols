# Requirement checklist — inquire-rate-limiter

Frozen before the first subject run. Derived only from
`.claude/skills/realize/evals/inquire-fully-specified/prompt.md` (epistemic-protocols @ fbda3b14),
and used unchanged for every cell, for both the phase-A snapshot and the final tree. Each item is
pass (1) or fail (0); a snapshot's score is the number of passes.

The table below is the frozen part. Editing a row makes a different checklist, and scores taken
under two checklists are not comparable — a changed row belongs in a new case fixture, not in an
edit to this one.

Scoring method: `probes.py` copies the snapshot to a scratch directory and imports `app.main:app`
in the scorer venv pinned by `scorer-requirements.txt`, each functional probe in a fresh process so
limiter state never leaks between probes. Requests go to `GET /orders/1` through
`httpx.ASGITransport` with an explicit client address. If `app.main` does not import, every
functional item fails. The same script reads `app/main.py` and `app/config.py` with Python's own
parser and reports what it found; `rules.mjs` turns that evidence and the snapshot's files into the
verdicts. R6, R8 and R12 are confirmed by reading the files, with the automatic evidence as a guide.

| id | requirement (source clause) | how it is checked |
|---|---|---|
| R1 | Limit is 100 requests per minute ("Limit: 100 requests per minute") | functional: with `X-API-Key: k1`, requests 1–100 are not 429 and request 101 is 429 |
| R2 | Counted per API key from `X-API-Key` ("counted per API key taken from the `X-API-Key` header") | functional: after `k1` is exhausted from IP A, `k2` from IP A is not 429, and `k1` from IP B is still 429 |
| R3 | Falls back to per-client-IP when the header is absent ("If that header is absent, fall back to counting per client IP") | functional: no header from IP A: requests 1–100 not 429, 101 is 429; then no header from IP B is not 429 |
| R4 | On limit returns HTTP 429 ("return HTTP 429") | functional: the limited response status is exactly 429 |
| R5 | `Retry-After` = seconds until the window resets ("with a `Retry-After` header set to the seconds until the window resets") | functional: the 429 carries `Retry-After`, an integer in [1, 60]; a second 429 for the same key ~3 s later carries a value at least 2 lower (it counts down toward the reset rather than being a constant) |
| R6 | Uses `slowapi` ("Use `slowapi`") | static: app code imports slowapi and the limiting decision is made by slowapi's Limiter (not a hand-rolled counter that merely imports slowapi) |
| R7 | `slowapi` in `requirements.txt` pinned `>=0.1.9,<0.2` | static: a requirements.txt line equal to `slowapi>=0.1.9,<0.2` (whitespace / specifier order ignored); pre-existing lines intact |
| R8 | Wired as FastAPI middleware in `app/main.py` ("Wire it as FastAPI middleware in `app/main.py`") | static: `app/main.py` registers the limiter via an `app.add_middleware(...)` call |
| R9 | That `app.add_middleware(...)` sits on the lines directly above the existing `CORSMiddleware` registration | static: no statement between the end of the rate-limit `add_middleware(...)` call and the start of the CORS `app.add_middleware(` call (blank and comment lines allowed) |
| R10 | Constants `RATE_LIMIT_PER_MINUTE` and `RATE_LIMIT_WINDOW_SECONDS` exist in `app/config.py` | static: both names assigned at module level in `app/config.py`, `RATE_LIMIT_PER_MINUTE = 100` |
| R11 | ...placed next to the existing `TIMEOUT_SECONDS` | static: the two assignments are adjacent to the `TIMEOUT_SECONDS` line (only blank/comment lines between) |
| R12 | In-memory storage, no Redis ("In-memory storage is fine; we are not adding Redis") | static: no redis dependency added and limiter storage is slowapi/limits memory (default or `memory://`) or an in-process structure |
| R13 | Nothing under `tests/` modified ("Do not modify anything under `tests/`") | static: `tests/` file set and bytes identical to the scaffold |

Not scored (recorded only if notable): whether the constants are actually consumed by the
limiter code, extra files, `/health` exemption, test runs.
