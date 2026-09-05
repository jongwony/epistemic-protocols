# Route — /route

Route the accumulated session context to the core epistemic protocol whose deficit it shows, and invoke it.

> [한국어](./README_ko.md)

## What is Route?

Each epistemic protocol's own description names the interaction deficit that protocol resolves. Two things stand between that and an invocation, and only one of them is the moment. The other is the catalog: a host's loaded-skills listing may carry each skill's description, or it may carry the command identifiers alone, and where it carries identifiers alone the agent on the loop holds no statement of what deficit any protocol resolves. A screen phrased as *does the context show a deficit some loaded protocol resolves* then asks for a match against a catalog that is not in context at prompt time — and never fires.

That gap is not a rare edge, and it is worst exactly where Route is needed. Where a host rations the listing under a size budget, the descriptions it keeps are the ones it can justify by recent use; the ones it drops belong to skills the user has not been invoking — which is the set Route exists to reach. The rationing therefore runs against Route's purpose, and it does so silently and partially, so a listing that looks populated may still be bare for precisely the protocol that fits.

Route supplies both, split in two: **the hooks decide when, the skill decides what.** A `SessionStart` hook places the catalog the screen needs at the head of context, once per context epoch — one line per installed protocol: its command, the deficit it resolves, and the resolution it yields — under an opener on the sources where context is thin. A `UserPromptSubmit` hook places a short directive beside each prompt. That makes the screen evaluable at prompt time without depending on what the host's listing happened to carry. The `/route` skill, once invoked, takes the loaded protocol identifiers as its candidate set, resolves each candidate's deficit from that protocol's own declared description — a no-op where the listing already carried it — and, when exactly one protocol's deficit is what the context shows, invokes that protocol. A candidate whose description cannot be resolved drops out rather than being matched on a guess about its name. The invoked protocol's own opening detection and first gate remain where the user's judgment lives; Route adds no gate of its own.

The table triggers; it does not match. The two ends of each morphism — the deficit name and the resolution it turns into — are enough to notice that a turn has drifted into one, and a deficit reads more sharply against the state it resolves into than alone; the full description the pair abbreviates is resolved inside `/route`, where matching actually happens. That division is what keeps the table to one line per protocol, and placing it at session start is what keeps the per-prompt cost to the directive alone.

| Outcome | When |
|---------|------|
| Invoke the protocol | One loaded protocol is the dominant match |
| One nudge line per protocol (`↗ /command — reason`) | Several fit, or the one match is weak |
| Silence | Nothing fits — the common case |

## What the hooks inject

`hooks/hooks.json` registers two command hooks. Both write `hookSpecificOutput.additionalContext`, read the payload on stdin without requiring it, and exit 0 on every path. No file is written, no network is touched, and no session content leaves the process.

**`SessionStart` → `scripts/route-session.mjs`** carries the deficit table, once per context epoch. The host reports why the epoch began through the payload's `source` — `startup`, `resume`, `clear`, `compact` — and fires this hook again after compaction, so the table re-enters context exactly when compaction dropped it, with no transcript read and no marker kept. Injected here it sits at the head of context, inside the cached prefix. A two-line opener precedes the table on `startup` and after `/clear`: context is thin, and the deficit to check first sits in the request itself — intent or context only the user can supply, which accumulated context cannot yet show. On `resume` and `compact` the table goes out alone, with no opener: the deficits that follow trimming — what the session had settled and no longer holds in view — show in the utterance, and the per-prompt directive already routes them; the table still re-enters because compaction dropped the earlier injection, and on resume whether it survived cannot be read off the payload. The two hooks divide by where the instability sits: a deficit the accumulated context already shows is the per-prompt directive's to read off, while one that sits in the user — and so surfaces by asking, not by observing — is what session start is for. The opener ends in the same action as the per-prompt directive: invoke `/route`. Two triggers, one router — the directive's condition (*the accumulated context shows a deficit*) excludes request-held deficits by construction, so the opener is the trigger for that kind, but the match itself and the relay test that decides invoke, nudge or silence live inside `/route`, and an opener that matched against the table on its own would skip them. The opener states the condition and never names a protocol — that would be the hand-kept routing table the skill's Rule #2 refuses. The table beneath it is headed with the directive's own referent, *loaded core epistemic protocols*, so the two injections read as one catalog.

The table is derived, never maintained. `installed_plugins.json` gives each enabled plugin's install path, and a plugin is a core protocol when it carries exactly one skill and that skill's `SKILL.md` declares a `deficit:` in its MORPHISM block — Route itself excluded, since it never routes to itself. So a protocol that is not installed cannot appear, a protocol added to the suite needs no edit here, and no list is kept in sync by hand. Selection keys on the `deficit:` line rather than the frontmatter `Type: (...)` clause, because that clause is not uniform across the suite and keying on it drops a protocol without saying so; the clause still supplies the row's resolution wherever the `SKILL.md` carries it, and a protocol without one keeps its row with the deficit alone. The selection rule is checked against the canonical protocol registry in tests, so a protocol that stops matching it — a second skill added, a `deficit:` line reshaped — fails the suite rather than vanishing from the table. Every failure path is open: an unreadable payload reads as `startup`, and unreadable settings, an unrecognized install layout, or no protocol resolved send the opener alone on a thin source and nothing on a trimmed one.

**The premise index rides the same hook.** The premise documents — the collaboration premises the protocols rest on — are a reference surface that ships beside the plugins in this marketplace, under [`premise/`](../premise). Their index — each document and the moment that calls for it — lives in `scripts/route-premise.mjs`, since the hook is its one delivery channel: a file under `premise/` would be a second one, picked up by directory convention and delivered twice, and an entry's path is only useful absolute, which a file cannot carry. The test beside it holds the index to the tree, in both directions. Reaching that index used to be a setup of its own: a global rules file importing it on one host, an instruction-file pointer on the other, each holding an absolute path the host had to be asked for. The hook resolves that path at every epoch instead — `known_marketplaces.json` records where the host keeps the checkout this plugin was installed from, and `premise/` under it is the layer; where no record reaches a checkout, `premise/` beside the plugin root is the same directory — and injects the index beneath the table with every entry's path made absolute, so a document is read by that path at the moment its entry names. Installing Route is the whole setup. The index goes out on every source for the reason the table does: compaction dropped it. An index that cannot be resolved is left out while the opener and table go out as before — the two companions fail independently.

**`UserPromptSubmit` → `scripts/route-prompt.mjs`** carries the firing conditions for `/route` beside every prompt — the four-line directive, and nothing else. The per-prompt cost is the directive alone; the table is paid once per epoch.

Codex reads the same `hooks/hooks.json` and runs both hooks. The table stays empty there, since the derivation reads Claude Code's install record, and the premise index goes out only where `premise/` sits beside the plugin root — so Route on Codex is the opener, the directive, the skill's own resolution of each candidate's deficit, and the index where the plugin root is inside a checkout of this repository.

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
trusted, so both hooks stay off until this step is done:

```
/hooks
```

Codex records trust against a hash of the hook's entry in `hooks/hooks.json` —
the event and the command line, not the script the command runs — so this
recurs whenever that entry changes.

Installing Route also delivers the premise layer: the index under
[`premise/`](../premise) is injected at session start, with nothing to wire by
hand. A `rules/premise.md` import or an instruction-file pointer wired under
the earlier setup now delivers the same index twice — remove it.

## Usage

The hooks do the work; nothing needs to be typed. To run the same pass by hand over the context as it stands:

```
/route
```

## Author

Jongwon Choi (https://github.com/jongwony)
