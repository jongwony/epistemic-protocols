# Route

From the first turn of a session, you meet the deficit your conversation shows as the core protocol that resolves it, without recalling which protocols exist or which one fits. Route is a delivery layer: hooks that place text in the agent's context, with no skill or command of its own.

> [한국어](./README_ko.md)

> **Experimental.** The contract can change without a deprecation path: the injected purpose's wording, the table's shape and the hook set have all moved between releases and may move again. Pin a version if you are depending on any of them. Every hook here touches no network.

## What is Route?

Each epistemic protocol's own description names the interaction deficit that protocol resolves. Two things stand between that and an invocation, and only one of them is the moment. The other is the catalog: a host's loaded-skills listing may carry each skill's description, or it may carry the command identifiers alone, and where it carries identifiers alone the agent on the loop holds no statement of what deficit any protocol resolves. A screen phrased as *does the context show a deficit some loaded protocol resolves* then asks for a match against a catalog that is not in context at prompt time — and never fires.

That gap is not a rare edge, and it is worst exactly where Route is needed. Where a host rations the listing under a size budget, the descriptions it keeps are the ones it can justify by recent use; the ones it drops belong to skills the user has not been invoking — which is the set Route exists to reach. The rationing therefore runs against Route's purpose, and it does so silently and partially, so a listing that looks populated may still be bare for precisely the protocol that fits.

Route supplies both at session start, and the judgment is made in the turn itself. A `SessionStart` hook places, once per context epoch, `purpose.md`, carried as written: before gathering context — reading records, issues, threads, documents or code to establish what is the case — the agent invokes `/inquire`; where what the person wants is unclear, it invokes `/elicit` before acting on a guess; any other gap is read against the description each protocol declares; and every protocol is the main conversation's, so a delegated agent, a fork included, invokes none of them and leaves what only the person holds to its report — and then the catalog: one line per installed protocol, with its command, the deficit it resolves, the resolution it yields, and the description it declares. Nothing is added per prompt. The purpose names two protocols — `/inquire` and `/elicit`, the main conversation's own — and every other protocol comes in from the description it declares, or when the user invokes it by its command. The invoked protocol's own opening detection and first gate remain where the user's judgment lives; Route adds no gate of its own.

Each row carries the protocol's declared description beside its deficit → resolution pair, because the description is the one source a deficit is matched against, and a host listing can carry a protocol's identifier without it. A deficit reads more sharply against the state it resolves into than alone, and both read against the situation the description names. The purpose and the table are paid once per epoch, and nothing per prompt.

## What this plugin does not do

The hooks inject text, and that is all they do: no skill, no command, no judgment of Route's own. Nothing is stored between prompts, so Route keeps no stack of parked protocols and no resumption point. A gate that holds the user's judgment — a checkpoint a protocol presented and its own contract has not yet taken an answer at, closed, or entrusted to the session — stays that protocol's, answered only by the user's own turn; whether another protocol comes in beside it is judged in the turn, from what the session start placed.

## A worked case: one name, two referents

The match question is whether the context shows a deficit — and a deficit is a property of some object, settled by some ground. The case that shows why each deficit is read against the object it concerns is a name with two referents, met where `/elicit` is ordinarily reached: the user is about to plan a piece of work, and what that work is for has not yet been fixed as decision coordinates. Reduced to its shape, with a synthetic domain:

- A source the session has read — a design note — defines a term, say *restore*, as a step that runs **after** cleanup, on demand, when a read misses.
- The user's own earlier turn used the same word for a step **before** cleanup: "back up, restore, then clean up."
- A status summary has just relayed the source's definition, correcting the user's picture.
- The user's next prompt opens the planning: "Let's plan the restore work."

What that prompt leaves open is not one word but the work's endpoint — which stage the restore belongs to, what triggers it, what has to exist when it is done: the coordinates a plan is built from. The term with two referents is the signal that those coordinates are unfixed, not the whole of what is unfixed. The source fixes what the word means in the note; it does not fix which meaning the user has adopted, nor what the user's restore work is for, and only the user can. That is `/elicit`'s deficit — an intent whose axes the user's own wording leaves undetermined, with a substrate (the note, the earlier plan) to trace candidate coordinates from — and it stays open however completely the source defines the word. Read against the wrong object, the same context looks resolved: the source has an answer, so nothing is missing. Read against the right one, the answer the source has is about the term, and the deficit is about the user. The prompt may equally arrive as an announcement — "I'll start the restore work now" — and reads the same: starting work whose endpoint is open is planning it, and the announcement's form settles nothing.

The case comes in two twins that differ only in the current prompt:

| Twin | The current prompt | Expected in the turn |
|------|--------------------|----------------------|
| Intent undetermined | "Let's plan the restore work." | invokes `/elicit` before acting on a guess — the work whose endpoint is open, resting on the note and the earlier turn |
| Intent fixed by the user | "Let's plan the restore work — the on-demand step from the note, triggered by a read miss after cleanup; my earlier 'restore' was the backup." | no `/elicit`: the user's own words have supplied the coordinates, so no deficit shows |

Both prompts ask for the same action. What separates them is whether the user's words in context settle the endpoint, judged apart from the action the prompt asks for.

This case is synthetic, not a transcript. Two things about running it are easy to get wrong. The earlier turn and the correcting summary have to be *in the accumulated context* when the turn is judged — supplied as chronological context in the prompt — because a scaffold that puts the note and the earlier plan on disk has put nothing in context. And the negative twin is graded on no `/elicit` invocation following, not on the tree staying unchanged: an untouched tree cannot tell a correct non-invocation from the defect. This is a semantic review case, not an automated behavioral test; hook tests check delivery of the purpose and the table, not whether a model follows them.

## What the hooks inject

The hooks registered in `hooks/hooks.json` all write `hookSpecificOutput.additionalContext`, read the payload on stdin without requiring it, and exit 0 on every path. No file is written, no transcript is read, and none of them touches the network, so no session content leaves the process.

**`SessionStart` → `scripts/route-session.mjs routing`** carries the routing part, once per context epoch: `purpose.md` as written, then the table. The host fires this hook at every epoch — `startup`, `resume`, `clear`, `compact` — and so again after compaction, so the routing part re-enters context exactly when compaction dropped it, with no transcript read and no marker kept. Injected here it sits at the head of context, inside the cached prefix. It goes out on every source alike: on resume, whether the earlier injection survived cannot be read off the payload, so re-emitting is the fail-safe choice. `purpose.md` stays the only home of the purpose: the hook reads that file and the test beside it holds the emitted text to it, so it cannot drift into a second wording. Where the purpose cannot be read the table goes out alone, and where no table can be derived the purpose goes out alone; it points at the description each protocol declares rather than at the table, so it reads the same with or without one.

The table is derived, never maintained. `installed_plugins.json` gives each enabled plugin's install path, and a plugin is a core protocol when it carries exactly one skill and that skill's `SKILL.md` carries a line opening `deficit:` — where the MORPHISM section of its formal block states the deficit — Route itself carries no skill, so it never appears. So a protocol that is not installed cannot appear, a protocol added to the suite needs no edit here, and no list is kept in sync by hand. Selection keys on the `deficit:` line rather than the frontmatter `Type: (...)` clause, because that clause is not uniform across the suite and keying on it drops a protocol without saying so; the clause still supplies the row's resolution wherever the `SKILL.md` carries it, and a protocol without one keeps its row with the deficit alone. The selection rule is checked against the canonical protocol registry in tests, so a protocol that stops matching it — a second skill added, a `deficit:` line reshaped — fails the suite rather than vanishing from the table. Every failure path is open: an unreadable payload still yields whatever can be derived, and unreadable settings, an unrecognized install layout, or no protocol resolved send the purpose alone as the routing entry.

**Nothing is injected per prompt.** Whether a protocol comes in is judged in the turn from the purpose and the table the session start placed.

**The premise index rides the same epoch, as a second entry — `scripts/route-session.mjs premise`.** The host caps each injected context string at 10,000 characters and substitutes a file path and a preview past it; the routing part and the index together pass that cap, so each goes out as its own `SessionStart` entry, which also keeps one from failing the other. The premise documents — the collaboration premises the protocols rest on — are a reference surface that ships beside the plugins in this marketplace, under [`premise/`](../premise). Their index — each document, the moments that call for it, and the document's lead clause — lives in `scripts/route-premise.mjs`, with the moments the matcher can also see marked for a second delivery (see the `PreToolUse` hook below), since the hook is its one delivery channel: a file under `premise/` would be a second one, picked up by directory convention and delivered twice, and an entry's path is only useful absolute, which a file cannot carry. The lead clause is the document's own words, and which of them is the index's choice: each entry carries its lead as whole sentences copied verbatim from the document, which itself carries nothing for the index, and the hook quotes that lead into the line only where the document it resolved still says it — a premise checkout at another version that no longer does gets its line without a quote. So a line reads as path, the document's own words, then the moments it governs, each one a moment the agent can observe in its own work. The test beside it holds the index to the tree, in both directions, and holds each lead to whole sentences its document says verbatim. Reaching that index used to be a setup of its own: a global rules file importing it on one host, an instruction-file pointer on the other, each holding an absolute path the host had to be asked for. The hook resolves that path at every epoch instead — `known_marketplaces.json` records where the host keeps the checkout this plugin was installed from, and `premise/` under it is the layer; where no record reaches a checkout, `premise/` beside the plugin root is the same directory — and injects the index beside the table with every entry's path made absolute, so a document is read by that path at the moment its entry names. When that root resolves and the hooks run, the index is delivered through this path; verify delivery before retiring a manual import. The index goes out on every source for the reason the routing part does: compaction dropped it. An index that cannot be resolved is left out while the routing part goes out as before — the two companions fail independently.

**`PreToolUse` → `scripts/route-tool.mjs`** delivers a premise entry a second time, at the tool call the matcher decides is its moment. The session-start index carries every document's moments: recognizing a moment as it arrives is the reader's, and the index is what the reader recognizes it against. A moment the host's tool matcher can also see — a named file tool touching a path of a given shape, a named agent tool being called — is delivered again here, at that call, without reading the call's content. This is a reinforcement rather than a gate: a hook's context reaches the model on the request after the call, so the call has run by the time the line is read, and the line says what the call was and quotes the document's lead clause for what is built on next. The moments, each defined beside the index: a change to an instruction surface — the project instruction file and its override, a rule, a principle, a skill, an agent definition, recognized by the normalized path's shape (`instruction-authoring.md`); work handed to another agent, or a message sent to one (`delegation-and-subagents.md` — the document itself says what changes with whether that agent can see the conversation, since a fork can). A file tool names its path in its input; Codex's `apply_patch` names each file on a header line of the patch it carries in `command`, and Codex reports its own agent tool under the same canonical `Agent` name. A shell command is not read: whether a command writes a file is a reading of its content, and that reading belongs to the reader, as does every other moment that needs the content read — whether a set of options genuinely diverges, whether an action can be undone, whether an agent's return is a report or a launch notice. Those stay on the session line alone: a hook that read them would couple the premise to one harness's tool set and move the judgment out of the reasoning it belongs to. The tool channel is the fast layer here, bound to a harness and expected to shrink as readers follow the session index unaided. On no match the hook writes nothing.

**`SubagentStart` → `scripts/route-subagent.mjs`** puts the same premise index into a subagent's own context, before its first prompt. A subagent that starts fresh holds none of the session's context — no session-start hook runs for it, and its brief is what it knows — so without this it meets its moments with no index at all. A fork inherits the conversation, index included, and gets nothing here; any other agent type is taken as starting fresh. The routing part does not go: a delegated agent does not route, and the agent that receives its report reads it for what only the person holds. The output carries `additionalContext` and no other field, as the tool hook's does, since Codex fails a `PreToolUse` hook that returns `suppressOutput` and drops its context.

Codex reads the same `hooks/hooks.json` and runs every hook in it, `SubagentStart` included, adding that hook's context to the subagent's. The table stays empty there, since the derivation reads Claude Code's install record, and the premise index — at session start, at a subagent's start and at an edit alike — goes out only where `premise/` sits beside the plugin root — so Route on Codex is the purpose, and the index where the plugin root is inside a checkout of this repository.

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

After trusting the hooks, verify actual premise-index delivery in a fresh
session using [`premise/README.md` §Verifying](../premise/README.md#verifying).
Only remove an existing `rules/premise.md` import or instruction-file pointer
once the hook supplies the same reachable index. If delivery is absent, retain
the working manual route while checking marketplace records and the premise
root; a cached plugin without a resolvable premise root emits no index.

## Usage

The session-start purpose and table do the work; nothing needs to be typed. When you already know which protocol you want, invoke it by its own command — `/recollect`, `/ground`, any other in the table.

## Author

Jongwon Choi (https://github.com/jongwony)
