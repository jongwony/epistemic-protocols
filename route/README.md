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
| Silence | Nothing fits — the common case; or several gates hold at once, and each governs |
| One finding line in the transcript (`↗ /command — reason`), no invocation, turn continues | Exactly one protocol's gate holds the user's judgment and a different protocol is the single dominant match — monitor mode |

## What this plugin does not do

Everything here is read-and-relay at each invocation: the hooks inject text, the skill reads the accumulated context and invokes, nudges, places a finding, or stays silent. Nothing is stored between prompts, so `/route` keeps no stack of parked protocols and no resumption point of its own. The one thing that narrows it is a gate that holds the user's judgment: a checkpoint a protocol presented and its own contract has not yet taken an answer at, closed, or entrusted to the session. When the user turns away from such a gate mid-run, the prompt is that protocol's to read first, the way its contract reads any free response there; what that reading leaves — a residual folded at a dismissal or a withdrawal, or a checkpoint the contract itself holds across a continuation while it entrusts the prompt to the session — is the protocol's own record. A gate the reading closed or entrusted holds no longer, so `/route` routes the prompt as usual and reads the residual at the next prompt like any other; a gate still holding is monitored.

## A worked case: one name, two referents

The match question is whether the context shows a deficit — and a deficit is a property of some object, settled by some ground. The case that shows why Rule #2 says so is a name with two referents, met where `/elicit` is ordinarily reached: the user is about to plan a piece of work, and what that work is for has not yet been fixed as decision coordinates. Reduced to its shape, with a synthetic domain:

- A source the session has read — a design note — defines a term, say *restore*, as a step that runs **after** cleanup, on demand, when a read misses.
- The user's own earlier turn used the same word for a step **before** cleanup: "back up, restore, then clean up."
- A status summary has just relayed the source's definition, correcting the user's picture.
- The user's next prompt opens the planning: "Let's plan the restore work."

What that prompt leaves open is not one word but the work's endpoint — which stage the restore belongs to, what triggers it, what has to exist when it is done: the coordinates a plan is built from. The term with two referents is the signal that those coordinates are unfixed, not the whole of what is unfixed. The source fixes what the word means in the note; it does not fix which meaning the user has adopted, nor what the user's restore work is for, and only the user can. That is `/elicit`'s deficit — an intent whose axes the user's own wording leaves undetermined, with a substrate (the note, the earlier plan) to trace candidate coordinates from — and it stays open however completely the source defines the word. Read against the wrong object, the same context looks resolved: the source has an answer, so nothing is missing. Read against the right one, the answer the source has is about the term, and the deficit is about the user. The prompt may equally arrive as an announcement — "I'll start the restore work now" — and reads the same: starting work whose endpoint is open is planning it, and the announcement's form settles nothing.

The case comes in two twins that differ only in the current prompt:

| Twin | The current prompt | `/route` |
|------|--------------------|----------|
| Intent undetermined | "Let's plan the restore work." | invokes `/elicit`, with a one-sentence deficit statement naming the work whose endpoint is open |
| Intent fixed by the user | "Let's plan the restore work — the on-demand step from the note, triggered by a read miss after cleanup; my earlier 'restore' was the backup." | silence: the user's own words have supplied the coordinates, so no deficit shows |

Both prompts ask for the same action. What separates them is whether the user's words in context settle the endpoint, judged apart from the action the prompt asks for.

This case is synthetic, not a transcript. Two things about running it are easy to get wrong. The earlier turn and the correcting summary have to be *in the accumulated context* when `/route` reads — supplied as chronological context in the prompt — because Route declares no step that collects them from files; a scaffold that puts the note and the earlier plan on disk has put nothing in `C`. And the negative twin is graded on `/route` running without a downstream `/elicit` invocation, not on the tree staying unchanged: Route's own silence ends its turn, so an untouched tree cannot tell correct silence from the defect.

## Recognizing a deficit while preparing the response

Recognition can happen after the initial prompt check. The agent may notice that a result misses the user's actual setting, or that the next action depends on a judgment the user has not supplied, while drafting its response. That evidence belongs in the current routing decision. Having a question or repair ready does not supply its result.

These review cases distinguish an unresolved deficit from a settled one. Supply the relevant loaded protocol descriptions and chronological context; read the routing outcome, not the number of skill files opened.

| Context at recognition | Expected handling |
|------------------------|-------------------|
| A completed result misses the actual setting; an adaptation is proposed but its disposition remains open | Compare the mismatch with the loaded deficits and invoke the dominant match, or show fitting candidates when the match is weak or shared |
| The same mismatch has a user-selected disposition and the requested adaptation has resolved it; no other deficit remains | Silence is available on the current evidence |
| One protocol's gate still holds and a different deficit is recognized | Preserve monitor mode: a single dominant alternative permits one finding; no automatic switch |

A routing outcome can therefore be silence after a settled mismatch, or a finding while a gate holds. What may not be missing is the routing decision itself: recognizing a live fit and proceeding directly to an ad hoc question or repair skips it. Work already done at the recognition stands; work that turns on the deficit waits behind that decision — for the invoked protocol, or for the turn after the nudge lines — and resumes on silence. These are semantic review cases, not automated behavioral tests; hook tests check delivery of the directive, not whether a model follows it.

## What the hooks inject

`hooks/hooks.json` registers four command hooks. All write `hookSpecificOutput.additionalContext`, read the payload on stdin without requiring it, and exit 0 on every path. No file is written, and no transcript is read. Three of them — the two below and the `PreToolUse` one — touch no network, so no session content leaves the process. The fourth, the advisory channel, is the exception and ships disabled: enabling it sends the conversation — the user's turns and the replies to them, tool calls excluded — to a configured endpoint on every prompt, which is why it has a switch at all and why the section on it states the cost before the capability.

**`SessionStart` → `scripts/route-session.mjs`** carries the deficit table, once per context epoch. The host fires this hook at every epoch — `startup`, `resume`, `clear`, `compact` — and so again after compaction, so the table re-enters context exactly when compaction dropped it, with no transcript read and no marker kept. Injected here it sits at the head of context, inside the cached prefix. It goes out on every source alike: on resume, whether the earlier injection survived cannot be read off the payload, so re-emitting is the fail-safe choice. This hook carries no firing condition of its own. A deficit can sit in two places — in the accumulated context, which shows what the session has settled, drifted from, or lost from view; or in the request itself, as intent or context only the user holds, which accumulated context cannot show and which surfaces by asking rather than by observing. The second kind arrives at any turn, not only the first, so a session-start line for it went out once and then aged out of the decision; both kinds are now named by the per-prompt directive, present at every turn where either can arrive. The table is headed with the directive's own referent, *loaded core epistemic protocols*, so the two injections read as one catalog.

The table is derived, never maintained. `installed_plugins.json` gives each enabled plugin's install path, and a plugin is a core protocol when it carries exactly one skill and that skill's `SKILL.md` declares a `deficit:` in its MORPHISM block — Route itself excluded, since it never routes to itself. So a protocol that is not installed cannot appear, a protocol added to the suite needs no edit here, and no list is kept in sync by hand. Selection keys on the `deficit:` line rather than the frontmatter `Type: (...)` clause, because that clause is not uniform across the suite and keying on it drops a protocol without saying so; the clause still supplies the row's resolution wherever the `SKILL.md` carries it, and a protocol without one keeps its row with the deficit alone. The selection rule is checked against the canonical protocol registry in tests, so a protocol that stops matching it — a second skill added, a `deficit:` line reshaped — fails the suite rather than vanishing from the table. Every failure path is open: an unreadable payload still yields whatever can be derived, and unreadable settings, an unrecognized install layout, or no protocol resolved send the index alone, or nothing at all.

**The premise index rides the same hook.** The premise documents — the collaboration premises the protocols rest on — are a reference surface that ships beside the plugins in this marketplace, under [`premise/`](../premise). Their index — each document and the moment that calls for it — lives in `scripts/route-premise.mjs`, with the moments the matcher can also see marked for a second delivery (see the `PreToolUse` hook below), since the hook is its one delivery channel: a file under `premise/` would be a second one, picked up by directory convention and delivered twice, and an entry's path is only useful absolute, which a file cannot carry. The test beside it holds the index to the tree, in both directions. Reaching that index used to be a setup of its own: a global rules file importing it on one host, an instruction-file pointer on the other, each holding an absolute path the host had to be asked for. The hook resolves that path at every epoch instead — `known_marketplaces.json` records where the host keeps the checkout this plugin was installed from, and `premise/` under it is the layer; where no record reaches a checkout, `premise/` beside the plugin root is the same directory — and injects the index beneath the table with every entry's path made absolute, so a document is read by that path at the moment its entry names. When that root resolves and the hooks run, the index is delivered through this path; verify delivery before retiring a manual import. The index goes out on every source for the reason the table does: compaction dropped it. An index that cannot be resolved is left out while the table goes out as before — the two companions fail independently.

**`UserPromptSubmit` → `scripts/route-prompt.mjs`** carries the firing conditions for `/route` beside every prompt — the three-line directive, and nothing else. Its first line names both places a deficit can sit, and binds at every recognition: at the prompt, and at a moment mid-turn where preparing a response or action is what shows the deficit. Its second gives the one thing that narrows `/route` — a gate that holds the user's judgment, defined by when it stops holding: its own contract takes an answer at it, closes it, or entrusts the prompt to the session. The prompt is that protocol's to read first, and `/route` routes what the reading leaves, monitoring where a gate still holds and routing as usual where none does. Its third says leftover protocol prose holds no gate and that what a protocol left unresolved when it converged or deactivated is context `/route` reads at the next prompt, so `/route` composes protocols from residual with no pointer from the protocol that left it. The directive names no protocol — that would be the hand-kept routing table the skill's Rule #2 refuses — and it states no default for the case where nothing fits: silence there is `/route`'s own third outcome, and a standing line for it read as the burden of proof sitting on invocation.

This surface is the one payload charged on every prompt, and it accumulates: each injection lands at a new position, so a session of N prompts carries N copies of it. So it holds the conditions and stops there. What *follows* from them — the shape of a finding line, how many may be emitted, what monitor mode may not do, the relay test that decides invoke, nudge or silence — is the skill's, and the `/route` call the directive asks for is what loads it. Stating those here charged every prompt for text that arrives with the skill anyway; a budget in the test beside the hook keeps the surface from drifting back up without the cost being seen. The table is a separate payload, paid once per epoch.

**`UserPromptSubmit` → `scripts/route-evaluator.mjs`** is a second entry on the same event, **off unless you turn it on**. When enabled it asks a constrained-output evaluator — a model that answers over an answer space the caller declares and writes no prose — which of the installed protocols the session looks like it fits, and adds one line naming them:

```
[route advisory — not a /route outcome] This prompt may fit /inquire, /sublate. Verify each is loaded and fits the full context before invoking /route; ignore any that does not. This is not a routing decision and nothing has been invoked.
```

It is registered as its own hook entry rather than inside `route-prompt.mjs`, so a timeout or an outage here cannot take the static directive down with it. The directive goes out whatever this says, including when it says nothing — which is the point: the evaluator cannot see a deficit that surfaces later in the turn, and it reads candidates from what is installed on disk rather than from what the harness actually loaded. Its silence is not a finding that the session holds none.

It is **not a Route nudge.** `↗ /command — reason` is Route's own output, produced by invoking Route, and Rule #1 says a line written without that invocation is not one. This line is input a reader may consider before Route produces any outcome, which is why it is labelled, says *may fit*, and asks to be checked. The check is not a formality: the hook reads installed-and-enabled plugins from disk — the same source the session-start table uses — while Route's candidates come from what the harness actually loaded, so a name here can be a protocol the reader cannot invoke.

The options it chooses between are built from each protocol's own declared material: the deficit it resolves, the resolution it yields, and its frontmatter description. Nothing in them says how one protocol differs from another. Authored discrimination of that kind would be the hand-kept routing table Rule #2 refuses — the same reason the directive names no protocol — so whether the declared text separates the candidates on its own is left to measurement rather than settled by writing the differences in.

The answer is read from the full probability distribution, never by thresholding the reported `confidence`. Confidence measures how concentrated that distribution is, so a low value means the mass is spread across several options — which is Route's own several-fit outcome, not its silence. Gating on it would delete the case the advisory is most useful for. An explicit `none` option is what lets the evaluator decline, and a name must carry strictly more mass than `none` to be shown — reading rank alone would let the order the response serialized its keys in decide a tie, and a tie is what a real session produces once the conversation is in state.

**What goes into `state`.** The deficit Route matches is in the accumulated context, not in one turn, so the prompt alone is not the thing to ask about — a terse turn that settles an exchange shows nothing by itself. The hook reads the transcript the host names in the payload and offers the conversation: the user's turns and the assistant's replies, in order, and nothing else. Tool calls and their results are dropped by construction — a content block is kept only when its type is `text`, so `tool_use`, `tool_result` and whatever a later version adds fall out without this file keeping a list of their names. A subagent's turns are dropped too: they are a different conversation, held under a brief rather than with the user. So are this plugin's own injections, the per-prompt directive and any earlier advisory line, which would otherwise be re-sent once per turn — the channel reading itself back and paying for it.

The endpoint's ceiling is 32k tokens of state, so the offer is budgeted, newest-first: the oldest turn is the one to lose. Estimating that budget needs care, because the cost of a character is not constant — measured against this endpoint by reading `usage.input_tokens` back, Latin text runs near 4 characters per token and Korean prose near 1.2, so a single ratio is wrong by more than triple on whichever of the two it was not fitted to. The estimator charges four character classes separately — Hangul, the kana and Han blocks, Latin letters with whitespace, and everything else, since punctuation-dense text tokenizes far denser than prose — and the coefficients are the cheapest set that never predicts under any measured sample, with a tenth in hand.

Text is not all that is charged. A `{role, text}` entry costs 18 tokens before its text, measured by differencing fifty two-character turns against ten, and the walk charges 20 — a chatty session of several hundred short turns is where an under-charge here lands, and where it is least visible. Code points above the BMP cost 2 to 3 each, since the tokenizer has no entry for them and falls back to UTF-8 bytes. And the budget itself is derived per request rather than written down: the endpoint's limit is on everything the request carries, so what is left for conversation is the ceiling minus the question, minus the prompt, minus a tenth held back. The question grows by about ninety tokens per installed protocol, so a constant written today is a margin a later protocol silently eats; `stateTokenBudget` stays as a cap an adopter can lower, never one that can raise the offer past what the endpoint takes. The ceiling was found by bisection: 32,521 single-token syllables accepted beside a minimal question, 32,522 rejected, over 285 tokens of fixed request scaffolding.

**No static estimate is safe on its own, so a rejection is retried rather than prevented.** Measuring by character class shows why: ordinary Korean prose costs about 0.66 tokens per character, but a run of rare syllables costs 2.14, because out-of-vocabulary text falls back to bytes. A coefficient covering that tail would throw away two thirds of the budget on every ordinary session, and counting bytes does no better — the same run costs 1.4 bytes per token against 5.1 for English prose. So the estimate is fitted to ordinary text and a `400 max_tokens_exceeded` is answered once, with half the conversation. Measured round trip for the rejection and the retry together: about 500–700 ms, against the 30 s this hook event allows.

The estimator is fitted to prose in each script rather than to a document mixing them. A first pass calibrated on this repository's Korean README read 1.84 characters per token and set the CJK rate from it, but that file's markdown, code spans and English identifiers are Latin-rate text inflating the average. On Korean sentences that rate undercounted by about half, which put the request over the ceiling and answered every prompt in a Korean session with `400` — silently, since a shortfall here is no line at all. The test beside the hook holds the estimate above each measured rate, per script, so the same fit cannot drift back under one. A single turn larger than the whole budget is carried as its tail rather than dropped, since dropping it loses the turn nearest the deficit for being the one that says the most. Every shortfall — no transcript path, an unreadable file, a malformed line — leaves the prompt-only state this shipped with rather than failing.

**Enabling it.** Set `enabled` in `config/evaluator.json` and put the key in the environment variable that file names (`TYPESAFE_API_KEY` by default). The config carries no secret and never should; the key belongs in your own credential store, and the binding between the two belongs on your own rules surface rather than in this repository. Be aware of what you are turning on: **the conversation is sent to the configured endpoint on every prompt.** Cost is on the evaluator's side, not your context — a call across five options billed 455 input and 57 output tokens, so roughly 90 input tokens per option; one request carries every option and every question, and the vendor's guidance is that adding questions barely moves the response time.

Before trusting it, run `scripts/route-evaluator-eval.mjs` against your own adjudicated fixtures. The published result for the analogous case — a suggestion line over a 182-skill roster — reports wrong selections falling from 16.8% to 7.3% *and* some decisions spoiled that the unaided agent had got right. That second number is why the harness counts spoiled cases separately, and why nothing here ships enabled.

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

After trusting the hooks, verify actual premise-index delivery in a fresh
session using [`premise/README.md` §Verifying](../premise/README.md#verifying).
Only remove an existing `rules/premise.md` import or instruction-file pointer
once the hook supplies the same reachable index. If delivery is absent, retain
the working manual route while checking marketplace records and the premise
root; a cached plugin without a resolvable premise root emits no index.

## Usage

The hooks do the work; nothing needs to be typed. To run the same pass by hand over the context as it stands:

```
/route
```

## Author

Jongwon Choi (https://github.com/jongwony)
