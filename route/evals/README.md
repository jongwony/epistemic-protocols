# Advisory fixtures

What the advisory channel (`scripts/route-evaluator.mjs`) is measured against, and what the measurement is worth.

## The numbers mean nothing until someone adjudicates the labels

Every fixture in `cases/` carries an `expected` field: the Route outcome a person judged correct for that context. **Those labels ship unadjudicated.** They were written alongside the harness, by the same hand, from the cases `route/README.md` describes — which makes them a shape to fill, not a ground truth. A run against them tells you the harness works. It tells you nothing about whether the advisory helps until someone who is not the author has gone through each case and either confirmed the label or changed it.

Set `"adjudicated": true` on a case once that has happened. `route-evaluator-eval.mjs` reports adjudicated and unadjudicated cases separately and refuses to summarise across them, because a rate computed over labels nobody checked is a number with a confidence interval nobody can state.

## Why spoiled cases are counted apart

The published result for the analogous design — a one-line suggestion added to an agent's system prompt over a 182-skill roster, measured across 488 requests — reports wrong selections falling from 16.8% to 7.3%, and needless ones from 9.8% to 4.0%. It also reports that the suggestion broke decisions the unaided agent had got right. Both things are true of the same change.

An aggregate that nets those together hides the second. So the harness scores in pairs — the same case with the advisory and without — and reports four cells:

| | assisted right | assisted wrong |
|---|---|---|
| **baseline right** | `right→right` | **`right→wrong` — spoiled** |
| **baseline wrong** | `wrong→right` — repaired | `wrong→wrong` |

`right→wrong` is reported as a count, as a fraction of baseline-correct cases, and broken out by Route outcome, because spoiling a correct silence is a different failure from picking the wrong protocol out of several that fit. A correct baseline silence that becomes a needless advisory **is** a spoiled case; it is the most likely one, and the easiest to lose in an average.

## What a fixture is

```json
{
  "id": "several-fit-inquire-sublate",
  "outcome": "several",
  "prompt": "…the text the UserPromptSubmit hook would receive…",
  "expected": ["inquire", "sublate"],
  "adjudicated": false,
  "note": "why this is the right answer, in the adjudicator's words"
}
```

`outcome` is one of `silence`, `singleton`, `several`, `monitor`. `expected` is the protocol names a correct advisory would carry — `[]` for `silence`. `monitor` cases are the ones where a gate holds the user's judgment, and they are here to be *measured*, not to be routed: whether a gate still holds is a reading of that protocol's contract against what the user has said since, which is not something the evaluator is asked or able to answer. A `monitor` case is scored on whether the advisory stays out of the way.

The `installed-not-loaded` cases exist because the hook reads installed-and-enabled plugins from disk while Route's candidates come from what the harness loaded. They check that a name for an unloadable protocol is a degradation the reader's own check absorbs, not a wrong outcome.

## Running it

```bash
# Replay the recorded answers — no network, no key, deterministic.
node route/scripts/route-evaluator-eval.mjs

# Call the evaluator live and record what it says, then score.
TYPESAFE_API_KEY=... node route/scripts/route-evaluator-eval.mjs --live
```

`--live` writes each answer into `recorded/` keyed by case id, model and the criteria it was asked with. A replay whose recorded model differs from the configured one is reported rather than silently scored: the configured name may be an alias, and a fixture graded under one version and replayed under another is measuring two things.
