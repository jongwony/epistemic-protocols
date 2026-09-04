# Route — /route

Route the accumulated session context to the core epistemic protocol whose deficit it shows, and invoke it.

> [한국어](./README_ko.md)

## What is Route?

Each epistemic protocol's own description names the interaction deficit that protocol resolves. Two things stand between that and an invocation, and only one of them is the moment. The other is the catalog: a host's loaded-skills listing may carry each skill's description, or it may carry the command identifiers alone, and where it carries identifiers alone the agent on the loop holds no statement of what deficit any protocol resolves. A screen phrased as *does the context show a deficit some loaded protocol resolves* then asks for a match against a catalog that is not in context at prompt time — and never fires.

That gap is not a rare edge, and it is worst exactly where Route is needed. Where a host rations the listing under a size budget, the descriptions it keeps are the ones it can justify by recent use; the ones it drops belong to skills the user has not been invoking — which is the set Route exists to reach. The rationing therefore runs against Route's purpose, and it does so silently and partially, so a listing that looks populated may still be bare for precisely the protocol that fits.

Route supplies both, split in two: **the hook decides when, the skill decides what.** The `UserPromptSubmit` hook places a short directive beside each prompt and, with it, the catalog the directive screens against — one line per installed protocol, its command and the deficit it resolves. That makes the screen evaluable at prompt time without depending on what the host's listing happened to carry. The `/route` skill, once invoked, takes the loaded protocol identifiers as its candidate set, resolves each candidate's deficit from that protocol's own declared description — a no-op where the listing already carried it — and, when exactly one protocol's deficit is what the context shows, invokes that protocol. A candidate whose description cannot be resolved drops out rather than being matched on a guess about its name. The invoked protocol's own opening detection and first gate remain where the user's judgment lives; Route adds no gate of its own.

The table triggers; it does not match. Deficit names alone are enough to notice that a turn has drifted into one, and the full description each name abbreviates is resolved inside `/route`, where matching actually happens. That division is what keeps the per-prompt cost to a few lines.

| Outcome | When |
|---------|------|
| Invoke the protocol | One loaded protocol is the dominant match |
| One nudge line per protocol (`↗ /command — reason`) | Several fit, or the one match is weak |
| Silence | Nothing fits — the common case |

## What the hook injects

`hooks/hooks.json` registers one `UserPromptSubmit` command hook, `scripts/route-prompt.mjs`. On every prompt it writes the firing conditions (the directive text lives in that script) plus the deficit table as `hookSpecificOutput.additionalContext` — the hook wire shape both Claude Code and Codex accept for this event — and exits 0. The hook payload on stdin is read but not required; an empty or malformed payload still yields the directive. No file is written, no network is touched, and no session content leaves the process.

The table is derived, never maintained. `installed_plugins.json` gives each enabled plugin's install path, and a plugin is a core protocol when it carries exactly one skill and that skill's `SKILL.md` declares a `deficit:` in its MORPHISM block — Route itself excluded, since it never routes to itself. So a protocol that is not installed cannot appear, a protocol added to the suite needs no edit here, and no list is kept in sync by hand. Selection keys on the `deficit:` line rather than the frontmatter `Type: (...)` clause, because that clause is not uniform across the suite and keying on it drops a protocol without saying so.

Every failure path is open: unreadable settings, an unrecognized install layout, or no protocol resolved all send the directive alone. Injection is per prompt and stateless — a once-per-session table would need a marker file, costing the property above, and would not survive compaction dropping it from context.

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
