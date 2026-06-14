---
name: claude-spawn
description: >
  Use this skill when the user asks to spawn a remote-control session, list or kill
  remote-control sessions, "open this repo/folder in the Claude app", "remote control
  here", "띄워줘", "이 디렉터리에서 remote-control 켜줘", or to check/stop those sessions.
  It executes a /conduct-designed single span as a backgrounded claude --remote-control
  tmux session (rc-<name>) reachable from claude.ai/code and the mobile app.
---

# Claude Spawn: Remote-Control Session Substrate

Spawn, list, and kill backgrounded `claude --remote-control` sessions — one per
directory, each a tmux session `rc-<name>` reachable from the Claude app. This skill
is the execution substrate for a `/conduct`-designed single span.

Run the script and report the result concisely:

```bash
# Spawn in a directory (name defaults to the dir's basename)
bash "scripts/rc-spawn.sh" spawn <dir> [name]

# List running sessions
bash "scripts/rc-spawn.sh" list

# Kill one by name
bash "scripts/rc-spawn.sh" kill <name>
```

- `STARTED <name>` → a remote-control session is now live in `<dir>` and appears in
  the Claude app. Relay the attach/kill hints from the output.
- `ALREADY-RUNNING <name>` → idempotent; a session for that name already exists.
  If the existing session is in a different directory than requested, relay the note
  from the script output and suggest passing an explicit name.
- `NOT-FOUND <name>` → nothing matched on kill.

Notes to pass on when relevant:
- The session lives until its claude exits (no auto-restart by design).
- First launch in a directory Claude has never opened may show a one-time
  folder-trust prompt **inside** the tmux session — `tmux attach -t rc-<name>`,
  press Enter, then detach with `Ctrl-b d`.
- tmux is used (not nohup/launchd) so sessions work under TCC-protected dirs
  (`~/Downloads`, `~/Documents`, `~/Desktop`); kill uses `ps`+SIGTERM so SessionEnd
  hooks (e.g. anamnesis memory) flush before exit.

## Relationship to /conduct

`/conduct` (Hyphegesis) designs a method over a work span at design time and proposes
realizable substrates from the session's loaded inventory. `/claude-spawn` is one such
substrate: it realizes a **single span** — from the current invocation to the next
`/compact` or `/clear` — as a backgrounded `claude --remote-control` tmux session.

The span boundary (the design-time horizon) is set by `/conduct`; `/claude-spawn`
executes against it. `/conduct` is not modified by this skill — it discovers substrates
dynamically from the loaded inventory and proposes `/claude-spawn` when it is available.

**Multi-span / multi-session orchestration is out of scope for now.** This skill handles
exactly one span per invocation. Expansion to multi-span coordination is deferred to a
future iteration after single-span usage is validated.
