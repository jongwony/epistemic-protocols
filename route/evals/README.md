# Route evals

Two sets live here. `cases/cases.json` holds routing cases — contexts with the routing outcome a person judged correct — and `cases/premise.json` holds the premise application cases the harness below runs; [their section](#premise-application-cases) is at the end.

## Routing cases

Each case in `cases/cases.json` is a context and the routing outcome it should reach under the session-start frame: the judgments and Rules of `skills/route/SKILL.md` and the protocol table the `SessionStart` hook injects.

```json
{
  "id": "singleton-inquire-status-quo",
  "outcome": "singleton",
  "prompt": "…the user's turn the routing judgment is made at…",
  "conversation": [
    { "role": "user", "text": "…what the session accumulated before that turn…" },
    { "role": "assistant", "text": "…and the reply to it…" }
  ],
  "expected": ["inquire"],
  "adjudicated": false,
  "note": "why this is the right answer, in the adjudicator's words"
}
```

`outcome` is one of `silence`, `singleton`, `several`, `monitor`; `conversation` is optional.

**A label counts only once someone other than its author has adjudicated it.** The labels were written by the hand that wrote the cases, which makes them a shape to fill, not a ground truth. Set `"adjudicated": true` on a case once a second reader has confirmed or changed its label, and keep adjudicated and unadjudicated cases apart in any rate, since a rate over labels nobody checked has no interval anyone can state.

**Measure the behaviour, not the call.** What a run reads off a case is whether the needed epistemic action happened — the protocol reached before the work that rests on the ground, the reading shown as the agent's, a value only the user holds stated rather than defaulted, no protocol brought in where nothing was unestablished — never whether a particular skill was called. Count spoiled cases apart from rescued ones, since netting a gain against a loss hides the loss.

No runner ships for this set yet. The arms, seeding and grading in `harness/` are the place a replay over these cases is built — short and long conversations, a deficit found mid-turn, after compaction, and with the purpose absent.

## Premise application cases

`cases/premise.json` asks a different question from the routing cases: where a premise binds, is the agent's first dependent action consistent with it? Each case builds a conversation up to one moment the agent can observe in its own work — recording a rule the person states, handing work to a recipient that does not see the conversation, receiving a delegated "done", taking an undoable step whose content depends on a judgment the person holds, writing the next repair in a chain of repairs on one axis — and names the action to grade (`firstAction`) with what passes and what fails. `governs` names the premise documents whose clauses decide the case.

**Grade the first dependent action, and nothing before or after it.** Opening a premise document is not a pass and leaving it closed is not a fail: an action consistent with the clause passes without a read, and a read followed by an inconsistent action fails. A later correction is scored on its own, as recovery.

**The control is counted apart.** `control-reading-relay` is the case a delivery that over-asks would spoil while appearing to help `reversible-step-on-held-judgment`; report it beside the others rather than netting it, for the reason the spoiled cell above is counted apart.

**A run compares arms on the same case.** Hold the model, host instructions, tools and conversation fixed, and vary only the delivery: no premise index; the index with paths and moments but no lead clauses; the index as shipped. A fourth arm, the governing clause handed in at the moment by the runner, separates a delivery failure from an application failure and is diagnostic only. An ablation arm goes the other way, removing one part of the shipped delivery to see whether the action holds without it. Run each case more than once, on the repository its `scaffold` names. These labels ship unadjudicated in the sense above, and a result drawn from them names the runner and arms that produced it.

**A late-turn arm places the same cases after a long accumulated conversation**, so the session-start index sits far from the end of the context, and compares them with the short-conversation placement above. This is what would ground any later decision on delivering premise lines per prompt; no such decision is made here. Where the index sits relative to a long conversation is an empirical question this arm answers, not a predicted loss: Liu et al., "Lost in the Middle" (TACL 2024), report performance highest when relevant information is at the beginning or end of the input and degrading in the middle (abstract verified), and Li et al. (COLM 2024, arXiv:2402.10962) report instruction drift within eight rounds of dialogue (abstract-level, as reported). The misses it would measure are the ones no tool event sees — gate options or a repair composed in prose.


### Running the cases

`premise-harness.mjs` runs these cases as agent cells. A cell is one case under one arm at one length, once: the case's `scaffold` (a seed repository from `harness/scaffolds.mjs`) is laid out as the working tree, a stored session is written whose head carries the arm's session-start context and whose turns are the case's conversation, and `claude -p --resume` sends the case's prompt into it with the arm's copy of the route plugin and every core protocol plugin loaded, in an empty `CLAUDE_CONFIG_DIR`. The first dependent action is then read off the stream-json trace by code (`harness/first-action.mjs`): the first file write or delegation, or, where the turn ends without one, the first reply that carries no tool call. A shell call counts as a write when the cell's tree differs from its scaffold right after it, as a PostToolUse probe records (`harness/tree-probe.mjs`) — the command text cannot say whether it wrote. Reads and other tool calls before it are recorded as observations and never scored.

Why the head is seeded rather than injected: on resume the host fires SessionStart again and attaches what it returns just before the new prompt, which would put the index at the end of a long conversation instead of where an uninterrupted session keeps it. So every arm's copy drops its SessionStart registration, and the arm's own session hook script renders the head before the cell runs. Everything else — the tool-channel matcher, the subagent hook — runs as shipped and is the same in every arm.

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
