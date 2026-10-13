# Advisory fixtures

What the advisory channel (`scripts/route-evaluator.mjs`) is measured against, and what the measurement is worth. `cases/premise.json` is a separate set, for the premise index the hooks deliver; [its section](#premise-application-cases) is at the end.

## The numbers mean nothing until someone adjudicates the labels

Every fixture in `cases/` carries an `expected` field: the Route outcome a person judged correct for that context. **Those labels ship unadjudicated.** They were written alongside the harness, by the same hand, from the cases `route/README.md` describes — which makes them a shape to fill, not a ground truth. A run against them tells you the harness works. It tells you nothing about whether the advisory helps until someone who is not the author has gone through each case and either confirmed the label or changed it.

Set `"adjudicated": true` on a case once that has happened. `route-evaluator-eval.mjs` reports adjudicated and unadjudicated cases separately and refuses to summarise across them, because a rate computed over labels nobody checked is a number with a confidence interval nobody can state.

## Why spoiled cases are counted apart

Netting a gain against a loss hides the loss, so the harness scores in pairs — the same case with the advisory and without — and reports the spoiled cell on its own, as a count, as a fraction of baseline-correct cases, and broken out by Route outcome.

**Read `route-evaluator-eval.mjs`'s header before reading any cell.** It states what the baseline arm actually is and therefore what `right→wrong` can and cannot mean here; that boundary is narrower than the four-cell shape suggests, and the header is the one place it is stated.

## What a fixture is

```json
{
  "id": "several-fit-inquire-contextualize",
  "outcome": "several",
  "prompt": "…the text the UserPromptSubmit hook would receive…",
  "conversation": [
    { "role": "user", "text": "…what the session accumulated before that prompt…" },
    { "role": "assistant", "text": "…and the reply to it…" }
  ],
  "expected": ["contextualize", "inquire"],
  "adjudicated": false,
  "note": "why this is the right answer, in the adjudicator's words"
}
```

`outcome` is one of `silence`, `singleton`, `several`, `monitor`.

`conversation` is optional and is what the session accumulated before the prompt — the shape the channel sends when it is armed. A case that omits it is scored on the prompt alone, which is a narrower state than the channel ever sends. The harness writes these turns to a transcript and offers it **by path**, so the shipped walk assembles the state: the budget derived from what the question and the prompt leave under the endpoint ceiling, the newest-first fill, the harness wrappers stripped. Handing the turns to `advise` as an array instead would skip every one of those, and a run that skipped them would be scoring a state the channel never sends.

A recording carries a digest of the turns it was asked with, so adding or changing a `conversation` makes the recording stale rather than silently regrading an old answer on a new question. `expected` is the protocol names a correct advisory would carry — `[]` for `silence`. `monitor` cases are the ones where a gate holds the user's judgment, and they are here to be *measured*, not to be routed: whether a gate still holds is a reading of that protocol's contract against what the user has said since, which is not something the evaluator is asked or able to answer. A `monitor` case is scored on whether the advisory stays out of the way.

The `installed-not-loaded` cases exist because the hook reads installed-and-enabled plugins from disk while Route's candidates come from what the harness loaded. They check that a name for an unloadable protocol is a degradation the reader's own check absorbs, not a wrong outcome.

## Running it

```bash
# Replay the recorded answers — no network, no key, deterministic.
node route/scripts/route-evaluator-eval.mjs

# Call the evaluator live and record what it says, then score.
TYPESAFE_API_KEY=... node route/scripts/route-evaluator-eval.mjs --live
```

**A live run reads the same variable that arms the advisory channel, so running it is the same consent.** This project counts holding a System One key in that variable, with the plugin enabled, as consent for the channel to send conversations, and the harness is not carved out of that.

What separates a scoring run from a standing channel is process scope. The invocation above assigns the variable for that one command, so it does not reach sessions already running, nor sessions started from a shell that never exported it. `export TYPESAFE_API_KEY=…` instead and every session launched from that shell is armed for as long as it lives. Scoring with the variable unset is not an option — the run refuses without a key.

`--live` writes each answer into `recorded/` keyed by case id, model and the criteria it was asked with. A replay whose recorded model differs from the configured one is reported rather than silently scored: the configured name may be an alias, and a fixture graded under one version and replayed under another is measuring two things. Recordings are not committed: each carries the model version that answered and the moment it answered, so it belongs to whoever ran it rather than to the checkout.

## The mapping smoke asks something smaller, and can answer it

`cases/smoke.json` and `scripts/route-evaluator-smoke.mjs` are a separate set with a separate claim. The eval above asks whether the advisory **helps**, which needs a label saying what a correct advisory would carry — a judgement, and the shipped ones are unadjudicated. The smoke asks only whether each deficit in the domain reaches its own resolution: one context per installed protocol, built to show that protocol's deficit, put through the live channel to see whether that protocol's name comes back.

"This context shows deficit X" is true by the construction of the context, and each case's `note` states the construction. Nothing there claims X is the *right* routing — so a miss is a reach failure, not a verdict on the advisory.

- The verdict is **membership**, not set equality: the protocol's name is among the names carried. A second name beside it is the eval's question, not this one's.
- The domain is what `deriveProtocols()` returns — installed and enabled, read from disk, compared by identity. A derived protocol with no case and a case naming no derived protocol both fail the run, and nothing counts protocols.
- One case is a settled-ground control expecting no name. Without it a run cannot tell reaching from the channel lighting up on everything.
- A skip fails the run: a protocol nothing was observed for has not been shown to reach.

```bash
node route/scripts/route-evaluator-smoke.mjs            # replay recorded answers
TYPESAFE_API_KEY=... node route/scripts/route-evaluator-smoke.mjs --live
```

**From a git worktree, pin `CLAUDE_PLUGIN_ROOT` at the installed plugin.** `deriveProtocols()` identifies this plugin's marketplace by the installed path and, failing that, by the name of the directory above it — which in a worktree is the worktree's name. Unpinned there, the domain comes back empty; the run refuses rather than reporting zero of zero reached, but the refusal is about the checkout, not about what is installed. The path to pin, and the commit that install is actually carrying:

```bash
node -e 'const j=require(process.env.HOME+"/.claude/plugins/installed_plugins.json");
console.log(j.plugins["route@epistemic-protocols"][0])'
```

A merge does not update an install, and a session already running does not pick up one that has been updated. Both are worth checking before reading a run as an observation of current code.

A live smoke reads the same variable as everything else here, so it is the same consent and the same process scope — assigned inline it arms that command and nothing else. Its answers land in `smoke-recorded/` and are not committed, for the reason the eval's recordings are not.

## Premise application cases

`cases/premise.json` asks a different question from the advisory fixtures: where a premise binds, is the agent's first dependent action consistent with it? Each case builds a conversation up to one moment the agent can observe in its own work — recording a rule the person states, handing work to a recipient that does not see the conversation, receiving a delegated "done", taking an undoable step whose content waits on the person's judgment, writing the next repair in a chain of repairs on one axis — and names the action to grade (`firstAction`) with what passes and what fails. `governs` names the premise documents whose clauses decide the case.

**Grade the first dependent action, and nothing before or after it.** Opening a premise document is not a pass and leaving it closed is not a fail: an action consistent with the clause passes without a read, and a read followed by an inconsistent action fails. A later correction is scored on its own, as recovery.

**The control is counted apart.** `control-reading-relay` is the case a delivery that over-asks would spoil while appearing to help `reversible-step-on-held-judgment`; report it beside the others rather than netting it, for the reason the spoiled cell above is counted apart.

**A run compares arms on the same case.** Hold the model, host instructions, tools and conversation fixed, and vary only the delivery: no premise index; the index with paths and moments but no lead clauses; the index as shipped. A fourth arm, the governing clause handed in at the moment by the runner, separates a delivery failure from an application failure and is diagnostic only. An ablation arm goes the other way, removing one part of the shipped delivery to see whether the action holds without it. Run each case more than once, on the repository its `scaffold` names. These labels ship unadjudicated in the sense above, and a result drawn from them names the runner and arms that produced it.

**A late-turn arm places the same cases after a long accumulated conversation**, so the session-start index sits far from the end of the context, and compares them with the short-conversation placement above. This is what would ground any later decision on delivering premise lines per prompt; no such decision is made here. Where the index sits relative to a long conversation is an empirical question this arm answers, not a predicted loss: Liu et al., "Lost in the Middle" (TACL 2024), report performance highest when relevant information is at the beginning or end of the input and degrading in the middle (abstract verified), and Li et al. (COLM 2024, arXiv:2402.10962) report instruction drift within eight rounds of dialogue (abstract-level, as reported). The misses it would measure are the ones no tool event sees — gate options or a repair composed in prose.


### Running the cases

`premise-harness.mjs` runs these cases as agent cells. A cell is one case under one arm at one length, once: the case's `scaffold` (a seed repository from `harness/scaffolds.mjs`) is laid out as the working tree, a stored session is written whose head carries the arm's session-start context and whose turns are the case's conversation, and `claude -p --resume` sends the case's prompt into it with the arm's copy of the route plugin and every core protocol plugin loaded, in an empty `CLAUDE_CONFIG_DIR`. The first dependent action is then read off the stream-json trace by code (`harness/first-action.mjs`): the first file write or delegation, or, where the turn ends without one, the first reply that carries no tool call. A shell call counts as a write when the cell's tree differs from its scaffold right after it, as a PostToolUse probe records (`harness/tree-probe.mjs`) — the command text cannot say whether it wrote. Reads and other tool calls before it are recorded as observations and never scored.

Why the head is seeded rather than injected: on resume the host fires SessionStart again and attaches what it returns just before the new prompt, which would put the index at the end of a long conversation instead of where an uninterrupted session keeps it. So every arm's copy drops its SessionStart registration, and the arm's own session hook script renders the head before the cell runs. Everything else — the per-prompt directive, the tool-channel matcher, the subagent hook — runs as shipped and is the same in every arm.

What each arm answers, holding the rest fixed:

- `none` — no premise index and no premise tool-channel line. What the agent does with no delivery at all.
- `paths` — the index with each document's path and moments, no lead clause; tool lines name the document without quoting it. Whether naming the document and its moment is enough.
- `shipped` — the plugin as it ships. Whether the lead clause beside the moment changes the action.
- `clause` — shipped, plus the lead clause of each document the case's `governs` names, appended after the prompt in a reminder block. Diagnostic only: a miss here with the clause in hand is an application failure, not a delivery one. Where a case turns on a clause other than its documents' leads, this arm hands in less than the deciding text.
- `lead-only` — an ablation of shipped: each index line is the quoted lead alone, without the document's path and moments; header and tool lines as shipped. Whether the path and the moment add anything once the lead is there.

The tool-channel line is not ablated here: it reaches the model on the request after the call that triggers it, so it cannot change a first dependent action, which is that call.

What each length answers:

- `short` — the case's own conversation after the head: the index near the moment.
- `long` — a deterministic synthetic coding session on an unrelated service (`harness/prefix.mjs`, sized by `--long-tokens`) between the head and the case's conversation: the index far from the moment, as the late-turn arm above asks. A compaction length — the same conversation compacted before the prompt — has a place in `LENGTHS` and is not built.

Before reading any measurement, run the seed check on the same CLI version. The seeded session format is the host's unpublished transcript shape, held in one module (`harness/seed-transcript.mjs`), and the check is what re-runs it: it asks the resumed model for tokens only the seeded head and the first and last seeded turns carry, and fails if resuming injected a second session-start context.

```bash
# Free: build and check the arms, render every cell, print the matrix with an input estimate per cell.
node route/evals/premise-harness.mjs run --dry-run
node route/evals/premise-harness.mjs seed-check --dry-run

# Spends: a model and a ceiling are required, and nothing has a default for either.
node route/evals/premise-harness.mjs seed-check --model <model> --max-cost-usd 1
node route/evals/premise-harness.mjs run --model <model> --max-cost-usd <usd> \
  [--cases a,b] [--arms none,paths,shipped,clause,lead-only] [--lengths short,long] [--reps N] [--max-turns N]
node route/evals/premise-harness.mjs judge --model <model> --max-cost-usd <usd> [--run DIR]

# Free: counts per case × arm × length.
node route/evals/premise-harness.mjs report [--run DIR]
```

The ceiling is checked before every launch against the sum of each child's own `total_cost_usd`, and a child that reports no cost stops the run. Every cell's environment drops `TYPESAFE_API_KEY`, so the advisory line above stays silent in every arm. A delegation is denied at the call once its brief is on record, in every arm alike, so no subagent runs on work no case grades.

The judge is blind: it sees the case's moment, conversation, prompt, graded action and `pass`/`fail` text, and the agent's action with what it said before it — not the arm, the length, the prefix, or what the agent read. Each result keeps the judge's verdict beside a `human` slot; a person's verdict there stands over the judge's, and the report lists every disagreement. The report counts each case × arm × length on its own and keeps `control-reading-relay` in a table apart; it sums nothing across cases and nets nothing between arms.

Results land in `premise-results/` and are not committed, for the reason the recordings above are not. A result names the model, CLI version, commit and route version that produced it. Run inside a cloud session, a child still receives that session's remote context despite the empty config dir; each result lists what the host added on resume, and the run records it as a host fact rather than stripping it.
