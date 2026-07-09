# Activation Window — the environment premise behind `resolves_at`

The Diylisis (`/distill`) grounding predicate `resolves_at(locator, activation)` (SKILL.md TYPES, Rule 21) asks whether a locator's referent is reachable throughout the recipient's declared **activation window**. Rule 21 states the directive; this document holds the environment fact the rule used to carry inline — *which* roots are short-lived, *how* their cleanup is scheduled, and *why* an immediately-dispatched recipient is unaffected. The premise is environment-specific and versioned by the OS, so it lives here, not in the runtime rule.

## Why a locator's lifetime is a hidden parameter

A locator rooted in an OS temp/cache/scratch tree does not have one durability answer — it has one *per activation window*:

- **`Immediate`** — the recipient reads and acts while the author session is still alive, on the same machine (an immediately-dispatched zero-memory subagent). The temp tree is still present and, for shared roots like `/tmp`, still readable. A temp-rooted locator **resolves**.
- **`Unbounded`** — the recipient reads at an unbounded later time, possibly on another machine (the classic "fresh recipient reads the handoff after the author session ends"). By then the temp tree has been cleaned, or was per-user-private to the author. A temp-rooted locator **does not resolve**.
- **`Bounded(d)`** — resolves iff the referent's lifetime is at least `d`. For `/tmp`, the cleanup schedule below bounds `d` only coarsely: the daily launch cadence is documented, the retention age threshold is not — see the conservative rule in the Takeaway.

Under `Unbounded`, `resolves_at` reduces to the old absolute `durable(locator)` predicate, so nothing loosens for the absent-recipient case the original rule was written for. The predicate only *relaxes* for a recipient that has explicitly declared a shorter window.

## macOS (verified on this machine, Darwin 25.x)

Roots and their cleanup:

| Root | What it is | Cleanup |
|------|-----------|---------|
| `/tmp` | Symlink → `private/tmp`; world-writable shared temp | `tmp_cleaner(8)` removes content not modified recently |
| `$TMPDIR` = `/var/folders/<xx>/<hash>/T/` | Per-user temp (`getconf DARWIN_USER_TEMP_DIR`), mode `0700`, owned by the user | Per-user `/var/folders` trees are bootstrap-created and OS-managed; not readable by another user, and reset across reboots/user-context changes |
| `/var/folders/<xx>/<hash>/C/` | Per-user cache (`getconf DARWIN_USER_CACHE_DIR`) | Same per-user, OS-managed lifecycle as `T/` |

Cleanup scheduling for `/tmp`:

- Daemon: `/System/Library/LaunchDaemons/com.apple.tmp_cleaner.plist` runs `/usr/libexec/tmp_cleaner` on `StartCalendarInterval { Hour = 0 }` — **daily at local midnight** — at `LowPriorityIO`, `Nice 1`.
- `tmp_cleaner(8)` (man page): "Remove old content from /tmp … Check for old content in the /tmp directory every day. If there is content there that hasn't been modified recently, remove it." First appeared in macOS 14.0. Users are told not to launch it manually. The retention age threshold behind "recently" is not documented; this analysis therefore treats only the launch cadence (daily at local midnight) as a machine-checked fact.
- The **older BSD periodic cleaner is absent** on this system: `/etc/periodic/daily/` does not exist (checked directly), so the legacy `110.clean-tmps` script is not the mechanism here — `tmp_cleaner` is.

Consequence for the two windows on macOS:

- **Immediate**: a `/tmp`-rooted path written by the author session and read by a subagent minutes later, on the same machine, resolves — the daily cleaner has not run, and the file's modification time is recent. A `$TMPDIR`-rooted path resolves only if the recipient runs *as the same user* (mode `0700`), which an in-session subagent does.
- **Unbounded**: the same path read a day later may have been swept by `tmp_cleaner`; a `$TMPDIR` path is additionally unreachable to any other user or after the per-user temp context is reset. Do not ship it as a StablePointer — inline or relocate to a durable path (commit it / move it under the project tree).

## Linux (general, not verified on this machine)

Stated as background, not a machine-checked claim: `/tmp` and `$TMPDIR` are commonly a `tmpfs` mount (RAM-backed, gone on reboot) and/or cleaned by `systemd-tmpfiles` on a timer (`systemd-tmpfiles-clean.timer`) with an age threshold. The same window logic holds: resolves for an immediate same-machine recipient, not for an absent later one. Verify the specific distro's `tmpfiles.d` age and mount type before relying on a temp-rooted locator under a `Bounded` window.

## Takeaway for `/distill`

- The activation window is declared at F0 as part of the recipient profile (Rule 21, Phase 0). Default `Unbounded` (the conservative absent-recipient window); `DurableRepo` is constrained to `Unbounded` by the TYPES well-formed rule.
- Only an explicitly-declared `Immediate` (or a `Bounded(d)` that ends before the next daily tmp_cleaner run after the write — the retention age threshold is undocumented, so any window crossing a midnight run is treated as non-resolving for a `/tmp` locator) lets a temp-rooted locator pass F2 as a StablePointer. Absent such a declaration, `resolves_at` rejects it exactly as the old absolute rule did.
