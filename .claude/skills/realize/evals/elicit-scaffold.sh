#!/usr/bin/env bash
# Scaffold for both /elicit cases: a small stdlib-only "daily digest" email service plus the
# owner's externalized substrate — decision records, team conventions, scratch notes, and a git
# history — from which decision coordinates can be reverse-traced.
#
# Both cases mount the SAME directory, deliberately. The trigger-positive case is graded on
# whether coordinates are reverse-traced from this substrate (and cite it) before the user is
# asked; the trigger-negative case is graded on whether the same substrate's latent
# dissatisfaction gets turned into open dimensions of a request whose axes are already fixed.
# Different substrates would let a run pass one of them by luck.
#
# What the substrate encodes (the hidden endpoint the positive-case oracle answers from):
#   send time      ADR-0003 + unused User.tz + NOTES 2026-08-15          -> 07:00 user-local
#   length         NOTES 2026-08-02, 2026-08-09                          -> top 3 + "N more"
#   ordering       feed/ranking.py exists, digest sorts chronologically  -> in-app feed order
#   security       ADR-0007 vs. ranking weight 0 for security_login      -> always, on top of 3
#   empty days     NOTES 2026-08-20, CONVENTIONS, render.py              -> send nothing
#   unsubscribe    CONVENTIONS + NOTES 2026-09-03                        -> one-click link
#   format         git revert of the HTML template + NOTES 2026-09-10    -> plain text
#   frequency      NOTES 2026-08-28 ("not sure")                         -> user defers, then daily
#   distractor     run.py queries per user (N+1)                         -> not the user's concern
# None of these files is an auto-loaded agent instruction file (no CLAUDE.md, AGENTS.md or
# .claude/), so the Rules channel has to be read through a tool like every other channel.
#
# Requires: bash, git. Deterministic: fixed author, fixed dates, no signing, so commit ids are
# stable across machines. The working tree is left clean on `main`.
set -euo pipefail

export GIT_AUTHOR_NAME="Dana Kim" GIT_AUTHOR_EMAIL="dana@example.com"
export GIT_COMMITTER_NAME="Dana Kim" GIT_COMMITTER_EMAIL="dana@example.com"
export TZ=UTC
git_commit() { # $1 = ISO date, rest = git commit args
  local when="$1"; shift
  GIT_AUTHOR_DATE="$when" GIT_COMMITTER_DATE="$when" \
    git -c commit.gpgsign=false -c core.hooksPath=/dev/null commit -q "$@"
}

git init -q -b main .

# ---------------------------------------------------------------- 1. initial service
mkdir -p digest feed ops tests docs/adr

cat > pyproject.toml <<'EOF'
[project]
name = "digest"
version = "0.4.0"
requires-python = ">=3.12"
dependencies = []

[project.optional-dependencies]
dev = ["pytest>=8"]
EOF

cat > README.md <<'EOF'
# digest

Sends each user a plain-text email digest of their recent activity.

The hourly cron in `ops/crontab` runs `python -m digest.run`; `digest/scheduler.py` decides who
is due at each tick, `digest/render.py` builds the email.

Decisions are recorded in `docs/adr/`. Team conventions are in `CONVENTIONS.md`.
EOF

cat > conftest.py <<'EOF'
EOF

cat > digest/__init__.py <<'EOF'
EOF

cat > digest/config.py <<'EOF'
"""Digest settings. Read at import time."""

SEND_HOUR_UTC = 7
DIGEST_WINDOW_HOURS = 24
FROM_ADDRESS = "digest@example.com"
SUBJECT = "Your daily digest"
EOF

cat > digest/models.py <<'EOF'
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class User:
    id: str
    email: str


@dataclass(frozen=True)
class Event:
    user_id: str
    kind: str  # "mention" | "task_due" | "comment" | "security_login"
    text: str
    created_at: datetime
EOF

cat > digest/scheduler.py <<'EOF'
from datetime import datetime

from digest.config import SEND_HOUR_UTC
from digest.models import User


def due_users(users: list[User], now_utc: datetime) -> list[User]:
    """Users whose digest is due at this hourly tick."""
    if now_utc.hour != SEND_HOUR_UTC:
        return []
    return list(users)
EOF

cat > digest/render.py <<'EOF'
from digest.config import SUBJECT
from digest.models import Event, User


def render(user: User, events: list[Event]) -> tuple[str, str]:
    """Return (subject, plain-text body)."""
    if not events:
        return SUBJECT, "Nothing happened today.\n"
    lines = [f"Hi {user.email},", "", "Here is everything from the last 24 hours:", ""]
    for event in sorted(events, key=lambda e: e.created_at):
        lines.append(f"- [{event.created_at:%H:%M}] {event.kind}: {event.text}")
    return SUBJECT, "\n".join(lines) + "\n"
EOF

cat > digest/store.py <<'EOF'
"""In-memory stand-in for the events database used in production."""
from datetime import datetime

from digest.models import Event, User


class Store:
    def __init__(self, users: list[User], events: list[Event]) -> None:
        self._users = list(users)
        self._events = list(events)

    def all_users(self) -> list[User]:
        return list(self._users)

    def events_for(self, user_id: str, since: datetime) -> list[Event]:
        # One database query per call in production.
        return [e for e in self._events if e.user_id == user_id and e.created_at >= since]
EOF

cat > digest/run.py <<'EOF'
"""Entry point for the hourly cron (see ops/crontab)."""
from datetime import datetime, timedelta

from digest.config import DIGEST_WINDOW_HOURS, FROM_ADDRESS
from digest.render import render
from digest.scheduler import due_users


def run(now_utc: datetime, store, mailer) -> int:
    """Send every digest due at this tick. Returns how many were sent."""
    sent = 0
    for user in due_users(store.all_users(), now_utc):
        events = store.events_for(user.id, since=now_utc - timedelta(hours=DIGEST_WINDOW_HOURS))
        subject, body = render(user, events)
        mailer.send(FROM_ADDRESS, user.email, subject, body)
        sent += 1
    return sent


if __name__ == "__main__":  # pragma: no cover - production wiring lives in the deploy repo
    raise SystemExit("digest.run is wired to the real store and mailer in the deploy repo")
EOF

cat > feed/__init__.py <<'EOF'
EOF

cat > feed/ranking.py <<'EOF'
"""Ordering used by the in-app activity feed."""
from digest.models import Event

KIND_WEIGHT = {"mention": 3, "task_due": 2, "comment": 1}


def rank(events: list[Event]) -> list[Event]:
    """Most actionable first: by kind weight, then newest first."""
    return sorted(events, key=lambda e: (KIND_WEIGHT.get(e.kind, 0), e.created_at), reverse=True)
EOF

cat > ops/crontab <<'EOF'
0 * * * * cd /srv/digest && python -m digest.run
EOF

cat > tests/__init__.py <<'EOF'
EOF

cat > tests/test_scheduler.py <<'EOF'
from datetime import UTC, datetime

from digest.models import User
from digest.scheduler import due_users

USERS = [User(id="u1", email="a@example.com"), User(id="u2", email="b@example.com")]


def test_sends_at_seven_utc() -> None:
    assert due_users(USERS, datetime(2026, 7, 1, 7, 0, tzinfo=UTC)) == USERS


def test_not_due_other_hours() -> None:
    assert due_users(USERS, datetime(2026, 7, 1, 8, 0, tzinfo=UTC)) == []
EOF

cat > tests/test_render.py <<'EOF'
from datetime import UTC, datetime

from digest.models import Event, User
from digest.render import render

USER = User(id="u1", email="a@example.com")


def test_render_lists_every_event() -> None:
    events = [
        Event("u1", "comment", "Ji-ho replied to your note", datetime(2026, 7, 1, 9, 0, tzinfo=UTC)),
        Event("u1", "mention", "Sam mentioned you", datetime(2026, 7, 1, 10, 0, tzinfo=UTC)),
    ]
    _, body = render(USER, events)
    assert "Ji-ho replied to your note" in body
    assert "Sam mentioned you" in body


def test_render_empty_day() -> None:
    _, body = render(USER, [])
    assert body == "Nothing happened today.\n"
EOF

cat > docs/adr/0001-record-architecture-decisions.md <<'EOF'
# ADR-0001: Record architecture decisions

Status: Accepted (2025-06-02)

We record decisions that shape the digest service as short ADRs in this directory.
EOF

cat > docs/adr/0005-standard-library-only.md <<'EOF'
# ADR-0005: Standard library only at runtime

Status: Accepted (2025-06-02)

## Decision

Runtime code in this service uses the Python standard library only. Test-only tooling may be
listed under the `dev` extra.

## Why

The service is deployed onto hosts we do not control the package mirror of; every runtime
dependency has cost us an outage at least once.
EOF

git add -A
git_commit "2025-06-02T10:00:00Z" -m "digest: initial daily digest service"

# ---------------------------------------------------------------- 2. HTML template, then revert
mkdir -p digest/templates
cat > digest/templates/digest.html <<'EOF'
<html><body>
<h1>Your daily digest</h1>
<table>{rows}</table>
</body></html>
EOF
git add -A
git_commit "2025-09-14T15:30:00Z" -m "digest: HTML template for the daily digest"

git rm -q -r digest/templates
git_commit "2025-09-30T09:10:00Z" -m 'Revert "digest: HTML template for the daily digest"' \
  -m "Outlook mangled the layout, and several people replied asking for the plain one back.
Plain text it is."

# ---------------------------------------------------------------- 3. local time ADR + User.tz
cat > docs/adr/0003-user-local-time.md <<'EOF'
# ADR-0003: User-facing times are the user's local time

Status: Accepted (2025-11-18)

## Decision

Anything we schedule for a person — reminders, summaries, emails — is delivered by the clock
of the person receiving it, not by server time. We store each user's IANA time zone name.

## Consequences

- `User.tz` is added (#41).
- Existing scheduled sends are migrated one by one; each migration is its own change.
EOF

cat > digest/models.py <<'EOF'
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class User:
    id: str
    email: str
    tz: str = ""  # IANA zone name, e.g. "Europe/Berlin". Added in #41; the digest does not read it yet.


@dataclass(frozen=True)
class Event:
    user_id: str
    kind: str  # "mention" | "task_due" | "comment" | "security_login"
    text: str
    created_at: datetime
EOF
git add -A
git_commit "2025-11-20T11:00:00Z" -m "models: add User.tz (IANA zone name), not read by the digest yet (#41)" \
  -m "Per ADR-0003. Digest scheduling still runs on UTC; moving it is a separate change."

# ---------------------------------------------------------------- 4. security ADR
cat > docs/adr/0007-security-events-never-dropped.md <<'EOF'
# ADR-0007: Security events are never dropped from a summary

Status: Accepted (2026-01-12)

## Decision

Any summary that shows a person their activity — a feed, a digest, a notification batch —
includes every `security_login` event in its window, whatever limits, ranking, or truncation
apply to the rest.

## Why

A new-login alert that was ranked out of a summary is the one message that mattered.
EOF
git add -A
git_commit "2026-01-12T14:20:00Z" -m "adr: 0007 security events are never dropped from a summary"

# ---------------------------------------------------------------- 5. conventions + owner's notes
cat > CONVENTIONS.md <<'EOF'
# Conventions

- Runtime code uses the standard library only (ADR-0005).
- User-facing times are the user's local time (ADR-0003).
- Every recurring email carries a one-click unsubscribe link. Legal requirement from 2026 Q4;
  existing emails are being brought into line one at a time.
- Fewer, better messages: do not send an email that carries nothing for the person reading it.
EOF

cat > NOTES.md <<'EOF'
# notes — dana

2026-08-02  support: four tickets this month calling the digest "a wall of text". One said
            "I stopped reading it in March."
2026-08-09  Mina (analytics): almost every digest click lands on the first 3 lines. Nobody
            scrolls past that.
2026-08-15  In LA for the offsite and my own digest arrived at midnight. The Seoul people get
            theirs at 4pm, which is useless.
2026-08-20  Why do we email people "Nothing happened today"??
2026-08-28  Daily or weekly? A few people asked for weekly. Honestly not sure — don't want to
            decide that blind.
2026-09-03  legal: unsubscribe link in every recurring email by Q4. The digest has none.
2026-09-10  Someone suggested HTML again. No — see the revert last year.
EOF
git add -A
git_commit "2026-09-10T18:45:00Z" -m "notes and conventions"
