# Advisory fixtures

What the advisory channel (`scripts/route-evaluator.mjs`) is measured against, and what the measurement is worth.

## The numbers mean nothing until someone adjudicates the labels

Every fixture in `cases/` carries an `expected` field: the Route outcome a person judged correct for that context. **Those labels ship unadjudicated.** They were written alongside the harness, by the same hand, from the cases `route/README.md` describes — which makes them a shape to fill, not a ground truth. A run against them tells you the harness works. It tells you nothing about whether the advisory helps until someone who is not the author has gone through each case and either confirmed the label or changed it.

Set `"adjudicated": true` on a case once that has happened. `route-evaluator-eval.mjs` reports adjudicated and unadjudicated cases separately and refuses to summarise across them, because a rate computed over labels nobody checked is a number with a confidence interval nobody can state.

## Why spoiled cases are counted apart

Netting a gain against a loss hides the loss, so the harness scores in pairs — the same case with the advisory and without — and reports the spoiled cell on its own, as a count, as a fraction of baseline-correct cases, and broken out by Route outcome.

**Read `route-evaluator-eval.mjs`'s header before reading any cell.** It states what the baseline arm actually is and therefore what `right→wrong` can and cannot mean here; that boundary is narrower than the four-cell shape suggests, and the header is the one place it is stated.

## What a fixture is

```json
{
  "id": "several-fit-inquire-sublate",
  "outcome": "several",
  "prompt": "…the text the UserPromptSubmit hook would receive…",
  "conversation": [
    { "role": "user", "text": "…what the session accumulated before that prompt…" },
    { "role": "assistant", "text": "…and the reply to it…" }
  ],
  "expected": ["inquire", "sublate"],
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
