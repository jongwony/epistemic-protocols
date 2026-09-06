# Route — /route

Route the accumulated session context to the core epistemic protocol whose deficit it shows, and invoke it.

> [한국어](./README_ko.md)

## What is Route?

Each epistemic protocol's own description names the interaction deficit that protocol resolves. Two things stand between that and an invocation, and only one of them is the moment. The other is the catalog: a host's loaded-skills listing may carry each skill's description, or it may carry the command identifiers alone, and where it carries identifiers alone the agent on the loop holds no statement of what deficit any protocol resolves. A screen phrased as *does the context show a deficit some loaded protocol resolves* then asks for a match against a catalog that is not in context at prompt time — and never fires.

That gap is not a rare edge, and it is worst exactly where Route is needed. Where a host rations the listing under a size budget, the descriptions it keeps are the ones it can justify by recent use; the ones it drops belong to skills the user has not been invoking — which is the set Route exists to reach. The rationing therefore runs against Route's purpose, and it does so silently and partially, so a listing that looks populated may still be bare for precisely the protocol that fits.

Route supplies both, split in two: **the hooks decide when, the skill decides what.** A `SessionStart` hook places the catalog the screen needs at the head of context, once per context epoch — one line per installed protocol: its command, the deficit it resolves, and the resolution it yields. A `UserPromptSubmit` hook places a short directive beside each prompt, carrying both places a deficit can sit: the request itself, and the accumulated context. That makes the screen evaluable at prompt time without depending on what the host's listing happened to carry. The `/route` skill, once invoked, takes the loaded protocol identifiers as its candidate set, resolves each candidate's deficit from that protocol's own declared description — a no-op where the listing already carried it — and, when exactly one protocol's deficit is what the context shows, invokes that protocol. A candidate whose description cannot be resolved drops out rather than being matched on a guess about its name. The invoked protocol's own opening detection and first gate remain where the user's judgment lives; Route adds no gate of its own.

The table triggers; it does not match. The two ends of each morphism — the deficit name and the resolution it turns into — are enough to notice that a turn has drifted into one, and a deficit reads more sharply against the state it resolves into than alone; the full description the pair abbreviates is resolved inside `/route`, where matching actually happens. That division is what keeps the table to one line per protocol, and placing it at session start is what keeps the per-prompt cost to the directive alone.

| Outcome | When |
|---------|------|
| Invoke the protocol | One loaded protocol is the dominant match |
| One nudge line per protocol (`↗ /command — reason`) | Several fit, or the one match is weak |
| Silence | Nothing fits — the common case |
| One finding line in the transcript (`↗ /command — reason`), no invocation, turn continues | A protocol is active and a different one is the dominant match — monitor mode |

## What the hooks inject

`hooks/hooks.json` registers three command hooks. All write `hookSpecificOutput.additionalContext`, read the payload on stdin without requiring it, and exit 0 on every path. No file is written, no network is touched, and no session content leaves the process.

**`SessionStart` → `scripts/route-session.mjs`** carries the deficit table, once per context epoch. The host fires this hook at every epoch — `startup`, `resume`, `clear`, `compact` — and so again after compaction, so the table re-enters context exactly when compaction dropped it, with no transcript read and no marker kept. Injected here it sits at the head of context, inside the cached prefix. It goes out on every source alike: on resume, whether the earlier injection survived cannot be read off the payload, so re-emitting is the fail-safe choice. This hook carries no firing condition of its own. A deficit can sit in two places — in the accumulated context, which shows what the session has settled, drifted from, or lost from view; or in the request itself, as intent or context only the user holds, which accumulated context cannot show and which surfaces by asking rather than by observing. The second kind arrives at any turn, not only the first, so a session-start line for it went out once and then aged out of the decision; both kinds are now named by the per-prompt directive, present at every turn where either can arrive. The table is headed with the directive's own referent, *loaded core epistemic protocols*, so the two injections read as one catalog.

The table is derived, never maintained. `installed_plugins.json` gives each enabled plugin's install path, and a plugin is a core protocol when it carries exactly one skill and that skill's `SKILL.md` declares a `deficit:` in its MORPHISM block — Route itself excluded, since it never routes to itself. So a protocol that is not installed cannot appear, a protocol added to the suite needs no edit here, and no list is kept in sync by hand. Selection keys on the `deficit:` line rather than the frontmatter `Type: (...)` clause, because that clause is not uniform across the suite and keying on it drops a protocol without saying so; the clause still supplies the row's resolution wherever the `SKILL.md` carries it, and a protocol without one keeps its row with the deficit alone. The selection rule is checked against the canonical protocol registry in tests, so a protocol that stops matching it — a second skill added, a `deficit:` line reshaped — fails the suite rather than vanishing from the table. Every failure path is open: an unreadable payload still yields whatever can be derived, and unreadable settings, an unrecognized install layout, or no protocol resolved send the index alone, or nothing at all.

**The premise index rides the same hook.** The premise documents — the collaboration premises the protocols rest on — are a reference surface that ships beside the plugins in this marketplace, under [`premise/`](../premise). Their index — each document and the moment that calls for it — lives in `scripts/route-premise.mjs`, with the moments the matcher can also see marked for a second delivery (see the `PreToolUse` hook below), since the hook is its one delivery channel: a file under `premise/` would be a second one, picked up by directory convention and delivered twice, and an entry's path is only useful absolute, which a file cannot carry. The test beside it holds the index to the tree, in both directions. Reaching that index used to be a setup of its own: a global rules file importing it on one host, an instruction-file pointer on the other, each holding an absolute path the host had to be asked for. The hook resolves that path at every epoch instead — `known_marketplaces.json` records where the host keeps the checkout this plugin was installed from, and `premise/` under it is the layer; where no record reaches a checkout, `premise/` beside the plugin root is the same directory — and injects the index beneath the table with every entry's path made absolute, so a document is read by that path at the moment its entry names. Installing Route is the whole setup. The index goes out on every source for the reason the table does: compaction dropped it. An index that cannot be resolved is left out while the table goes out as before — the two companions fail independently.

**`UserPromptSubmit` → `scripts/route-prompt.mjs`** carries the firing conditions for `/route` beside every prompt — the three-line directive, and nothing else. Its first line names both places a deficit can sit and ends in the one action, invoke `/route`; its second narrows `/route` to monitoring while a protocol is active — detection keeps running at every turn, but a switch away from a running protocol is a control act the user makes where that protocol next stops for them, so in active mode `/route` places one finding line in the transcript, invokes nothing, and the loop continues — the active protocol's contract ends at its own boundary and carries nothing of `/route`'s; its third line says leftover prose is not activity and that what a converged protocol left unresolved is context `/route` reads at the next prompt, so `/route` composes protocols from residual with no pointer from the protocol that left it; the match itself and the relay test that decides invoke, nudge or silence live inside the skill, and the directive names no protocol — that would be the hand-kept routing table the skill's Rule #2 refuses. It states no default for the case where nothing fits: silence there is `/route`'s own third outcome, and a standing line for it read as the burden of proof sitting on invocation. The per-prompt cost is the directive alone; the table is paid once per epoch.

**`PreToolUse` → `scripts/route-tool.mjs`** delivers a premise entry a second time, at the tool call the matcher decides is its moment. The session-start index carries every document's moments: recognizing a moment as it arrives is the reader's, and the index is what the reader recognizes it against. A moment the host's tool matcher can also see — a named file tool touching a path of a given shape, a named agent tool being called — is delivered again here, at that call, without reading the call's content. This is a reinforcement rather than a gate: a hook's context reaches the model on the request after the call, so the call has run by the time the line is read, and the line asks for the document before the result is built on. The moments, each defined beside the index: a change to an instruction surface — the project instruction file and its override, a rule, a principle, a skill, an agent definition, recognized by the normalized path's shape (`instruction-authoring.md`); work handed to another agent (`delegation-and-subagents.md` — the document itself says what changes with whether that agent can see the conversation, since a fork can). A file tool names its path in its input; Codex's `apply_patch` names each file on a header line of the patch it carries in `command`, and Codex reports its own agent tool under the same canonical `Agent` name. A shell command is not read: whether a command writes a file is a reading of its content, and that reading belongs to the reader, as does every other moment that needs the content read — whether a set of options genuinely diverges, whether an action can be undone, whether an agent's return is a report or a launch notice. Those stay on the session line alone: a hook that read them would couple the premise to one harness's tool set and move the judgment out of the reasoning it belongs to. The tool channel is the fast layer here, bound to a harness and expected to shrink as readers follow the session index unaided. On no match the hook writes nothing.

Codex reads the same `hooks/hooks.json` and runs every hook in it. The table stays empty there, since the derivation reads Claude Code's install record, and the premise index — at session start and at an edit alike — goes out only where `premise/` sits beside the plugin root — so Route on Codex is the directive, the skill's own resolution of each candidate's deficit, and the index where the plugin root is inside a checkout of this repository.

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
trusted, so every hook stays off until this step is done:

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
