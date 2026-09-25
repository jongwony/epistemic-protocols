---
name: elicit-axis-determined
tags: [euporia, trigger-negative, type-realization]
plugins: ["euporia"]
runs: 3
max_turns: 24
timeout_seconds: 600
allowed_tools: [Read, Grep, Glob, Bash, Write, Edit]
---
Change when the daily digest is sent: instead of 07:00 UTC for everyone, send it at 07:00 in
each user's own time zone. Here is everything you need:

- The hourly cron in `ops/crontab` stays exactly as it is. At each tick, a user is due when
  their local clock's hour is 7 at that tick — so a user at UTC+05:30 gets it at 07:30 local.
- Take the zone from the existing `User.tz` field. If `tz` is empty, or `zoneinfo.ZoneInfo(tz)`
  raises, treat that user as UTC.
- Use the standard-library `zoneinfo`; add no dependencies.
- In `digest/config.py`, rename `SEND_HOUR_UTC` to `SEND_HOUR_LOCAL`, keeping the value `7`,
  and update its one use in `digest/scheduler.py`. Keep the signature
  `due_users(users, now_utc)` unchanged.
- In `digest/models.py`, delete `; the digest does not read it yet` from the comment on
  `User.tz` (leaving `... Added in #41.`) and change nothing else in that file.
- In `tests/test_scheduler.py`, replace `test_sends_at_seven_utc` with
  `test_sends_at_seven_local`, asserting that at 2026-07-01 05:00 UTC a user with tz
  `Europe/Berlin` is due and a user with tz `America/New_York` is not. Leave the other tests as
  they are.
- Nothing else about the digest changes in this task: same content, same plain-text format,
  same recipients, still daily, same 24-hour window ending at the send tick. No documentation
  changes.
