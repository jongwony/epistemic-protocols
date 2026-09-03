# Route — /route

Route the accumulated session context to the core epistemic protocol whose deficit it shows, and invoke it.

> [한국어](./README_ko.md)

## What is Route?

The agent on the loop already holds every loaded epistemic protocol's description, and each description names the interaction deficit that protocol resolves. What is missing is the moment: a passive description does not make the agent stop and check whether the context has drifted into one of those deficits.

Route supplies the moment. Its `UserPromptSubmit` hook places a short directive beside each prompt — *if the accumulated context now shows an interaction deficit that one loaded protocol resolves, invoke `/route`; stay silent otherwise; skip while a protocol is active.* The `/route` skill then reads the loaded descriptions against the context and, when exactly one protocol's deficit is what the context shows, invokes that protocol. The invoked protocol's own opening detection and first gate remain where the user's judgment lives; Route adds no gate of its own.

| Outcome | When |
|---------|------|
| Invoke the protocol | One loaded protocol is the dominant match |
| One nudge line per protocol (`↗ /command — reason`) | Several fit, or the one match is weak |
| Silence | Nothing fits — the common case |

## What the hook injects

`hooks/hooks.json` registers one `UserPromptSubmit` command hook, `scripts/route-prompt.mjs`. On every prompt it writes the directive above as `hookSpecificOutput.additionalContext` — the hook wire shape both Claude Code and Codex accept for this event — and exits 0. The hook payload on stdin is read but not required; an empty or malformed payload still yields the directive. No file is written, no network is touched, and no session content leaves the process.

Codex reads the same `hooks/hooks.json` and supports the `UserPromptSubmit` event with the same `additionalContext` output field. Codex skips a plugin-bundled hook until its current definition is trusted (see Install).

## Install

Claude Code:

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install route@epistemic-protocols
```

Codex:

```
codex plugin marketplace add https://github.com/jongwony/epistemic-protocols.git
codex plugin add route@epistemic-protocols
```

Then review and trust the plugin's hooks — installing a plugin does not trust
them, and Codex skips a plugin-bundled hook until its current definition is
trusted, so the per-prompt directive stays off until this step is done:

```
/hooks
```

Codex records trust against the hook definition's hash, so this recurs whenever
the plugin's hooks change.

## Usage

The hook does the work; nothing needs to be typed. To run the same pass by hand over the context as it stands:

```
/route
```

## Author

Jongwon Choi (https://github.com/jongwony)
