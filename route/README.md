# Route — /route

Route the accumulated session context to the core epistemic protocol whose deficit it shows, and invoke it.

> [한국어](./README_ko.md)

## What is Route?

Each epistemic protocol's own description names the interaction deficit that protocol resolves. Two things stand between that and an invocation, and only one of them is the moment. The other is the catalog: a host's loaded-skills listing may carry each skill's description, or it may carry the command identifiers alone, and where it carries identifiers alone the agent on the loop holds no statement of what deficit any protocol resolves. A screen phrased as *does the context show a deficit some loaded protocol resolves* then asks for a match against a catalog that is not in context at prompt time — and never fires.

That gap is not a rare edge, and it is worst exactly where Route is needed. Where a host rations the listing under a size budget, the descriptions it keeps are the ones it can justify by recent use; the ones it drops belong to skills the user has not been invoking — which is the set Route exists to reach. The rationing therefore runs against Route's purpose, and it does so silently and partially, so a listing that looks populated may still be bare for precisely the protocol that fits.

Route supplies both, split in two: **the hook decides when, the skill decides what.** The `UserPromptSubmit` hook places a short directive beside each prompt, and its screen is catalog-free — symptoms that the interaction itself is falling short (a term in play that neither side has defined, an option set over a space not yet partitioned, a misfit just named, the same ground being re-covered), each readable off the turn that just happened. The `/route` skill, once invoked, takes the loaded protocol identifiers as its candidate set, resolves each candidate's deficit from that protocol's own declared description — a no-op where the listing already carried it — and, when exactly one protocol's deficit is what the context shows, invokes that protocol. A candidate whose description cannot be resolved drops out rather than being matched on a guess about its name. The invoked protocol's own opening detection and first gate remain where the user's judgment lives; Route adds no gate of its own.

| Outcome | When |
|---------|------|
| Invoke the protocol | One loaded protocol is the dominant match |
| One nudge line per protocol (`↗ /command — reason`) | Several fit, or the one match is weak |
| Silence | Nothing fits — the common case |

## What the hook injects

`hooks/hooks.json` registers one `UserPromptSubmit` command hook, `scripts/route-prompt.mjs`. On every prompt it writes the firing conditions (the directive text lives in that script) as `hookSpecificOutput.additionalContext` — the hook wire shape both Claude Code and Codex accept for this event — and exits 0. The hook payload on stdin is read but not required; an empty or malformed payload still yields the directive. No file is written, no network is touched, and no session content leaves the process.

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
