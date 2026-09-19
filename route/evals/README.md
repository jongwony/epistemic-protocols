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
    { "role": "user", "text": "…what the session had accumulated before it…" },
    { "role": "assistant", "text": "…and the reply to it…" }
  ],
  "expected": ["inquire", "sublate"],
  "adjudicated": false,
  "note": "why this is the right answer, in the adjudicator's words"
}
```

`outcome` is one of `silence`, `singleton`, `several`, `monitor`. `expected` is the protocol names a correct advisory would carry — `[]` for `silence`. `monitor` cases are the ones where a gate holds the user's judgment, and they are here to be *measured*, not to be routed: whether a gate still holds is a reading of that protocol's contract against what the user has said since, which is not something the evaluator is asked or able to answer. A `monitor` case is scored on whether the advisory stays out of the way.

`conversation` is what the session had accumulated before the prompt, oldest first, and it is the half a fixture cannot leave out and still describe what the channel sends. The channel sends the user's turns and the replies to them, newest first under a budget derived from what the question and the prompt leave — so a case carrying a prompt alone asks about a state the channel never assembles, and the run lands on the transcript-shortfall path that leaves the prompt-only state. A `monitor` case is the clearest instance: a gate holds over something already said, and there is no way to state that in one line. The harness writes each case's turns to a transcript and hands `advise` the path, so the fixture is scored through the channel's own walk rather than one the harness reimplements; a case that carries none is the prompt-only state on purpose, and the report says how many turns each case carried against how many the request offered.

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

`--live` writes each answer into `recorded/` keyed by case id, model, the criteria it was asked with, and a digest over the whole state the case describes — its prompt and its conversation together. A recording whose digest no longer matches is reported rather than scored, and so is one carrying no digest at all: that answer was recorded before the conversation was part of the question, so it answers a question the fixture no longer asks.

Before any of this, `route/scripts/route-smoke.mjs` asks whether the arrow is wired at all — every protocol reachable as an answer, the discovered set canonical by identity, the answer space closed, and the accumulated context actually reaching the request. It needs no key and no adjudication, and it is the cheaper thing to have failed when a number here looks wrong.

A replay whose recorded model differs from the configured one is reported rather than silently scored: the configured name may be an alias, and a fixture graded under one version and replayed under another is measuring two things.
