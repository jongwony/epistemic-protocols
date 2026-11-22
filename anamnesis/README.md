# /recollect — Anamnesis (ἀνάμνησις)

<a name="anamnesis--recollect-ἀνάμνησις"></a>

> [한국어](./README_ko.md)

<a name="what-is-anamnesis"></a>
## What it is

Anamnesis comes from the Greek word for recollection. It searches the records your past work left — conversations, changed files and their history, and recorded decisions — against a vague clue, opens the original records where your clue points, and tells their story with sources attached so you can recognize the past you meant.

<a name="the-core-problem"></a>
<a name="when-to-use"></a>
## The problem

You vaguely remember that something was discussed or decided before — in an earlier conversation, or across several sessions — but you cannot name where it happened or what it was called. Keyword searches return either too much or nothing useful because you only have a fragment ("that time we talked about…", a vague timeframe, or an episode). Reach for `/recollect` when your next step depends on finding that earlier discussion, line of work, topic, or settled concept.

## The result

You get a story built from the original passages, with each candidate identified by its runtime and storage location, and each excerpt carrying a reference to reopen the record. You can reopen the passages and decide whether they match — showing what actually took place then, while keeping clear that a past record does not by itself mean the decision still holds today. If the search ends without a match, you see where the AI looked.

<a name="install"></a>
## Install

Claude Code:

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install anamnesis@epistemic-protocols
```

Codex:

```
codex plugin marketplace add https://github.com/jongwony/epistemic-protocols.git
codex plugin add anamnesis@epistemic-protocols
```

Then review and trust the plugin's hooks — installing a plugin does not trust
them, and Codex skips a plugin-bundled hook until its current definition is
trusted, so capture stays off until this step is done:

```
/hooks
```

Codex records trust against the hook definition's hash, so this recurs whenever
the plugin's hooks change. Codex prints a startup warning when hooks are waiting
for review.

<a name="usage"></a>
<a name="the-solution"></a>
## Usage

```
/recollect [vague hook — keywords, fragment, or description]
```

After you type `/recollect`, the AI reads your clue — a timeframe, a person, a file path, an issue or commit number, a coined term, or a rough description — and searches past session records, changed files, change history, and recorded decisions in Claude Code and Codex (whichever are available). Instead of handing you keyword hits or an index summary, it opens the leading candidate's original records at the span your clue points to and tells the story in the records' own words, keeping who said what alongside each excerpt's source and a reference to reopen it. You can confirm that it is the past you meant, or add another detail in your own words to run the search again.

<details>
<summary>How the protocol runs and follows clues</summary>

**Source-grounded recognition**: An index's gist is a cue that wakes recall, never evidence of it; the opened record is the evidence, and the identification is yours. Claude Code and Codex records are searched together when both are available, starting from the current configuration's root and checking older roots when the clue points there.

<a name="protocol-flow"></a>
### Protocol Flow

```
Activation → An invocation of the user's own, or an empty intention detected (silent)
Pass       → Read the cue, the whole, and the axes; search what is worth its cost; open the leading candidate's records at the span the cue reaches
Round      → Present the story in the records' words, each excerpt with its source and resume handle; or, with nothing to present and nothing yet added to the cue, ask one open question
Close      → The user identifies it → RecalledContext; after you have added to the cue and nothing is left to present → unresolved within the scope searched
Otherwise  → More cue, a correction, a place to look added, a question about what was shown, or a remark or a form instruction on it → the next pass, even where the same turn points at another past, which the round names for you to take up; other work → answered in the session's own words, or, where it points at another past without a name, a new recall; words that end the recall without identifying anything, whatever else the turn says → answered with the scope searched — within the reply that leaves this recall where it stood when the turn also points at another past or invokes a fresh recall, otherwise in the session's own words — and after them only words that reopen the recall reach it; either way the recall stays as it stood; a `/recollect`, bare or with its own words, or words that continue an earlier recall → read from what came before as continuing the recall they point to — held, or closed unresolved — or as a fresh one, which leaves this one where it stood, and the first response says how it was read; an invocation that also identifies what was shown closes it as identified first
```

<a name="axes-of-the-cue"></a>
### Axes of the Cue

The cue names the axes the past can be reached along; there is no fixed set. A time, a person or system, an artifact or path, an identifier (an issue, a pull request, a commit, a session id), a coined term, an unusual episode — whichever your words carry are followed. An identifier anchors a candidate only where the kind of thing it names fits what the cue claims; a bare number carries no repository until one is read from the record around it.

### When to skip

- When you already know the session ID, file path, or decision — direct lookup is cheaper
- When no prior context exists (novel domain — use Aitesis / `/inquire` instead)
- When the concept must be formed, or reconsidered, from cases at hand to fit what you mean now (use Periagoge / `/induce` instead)
- When the request is to generate, not to remember

</details>

<details>
<summary>How it compares to other protocols</summary>

<a name="difference-from-other-protocols"></a>
| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Aitesis | AI-guided | `ContextInsufficient → SufficientContext` |
| **Anamnesis** | **AI-guided** | **`RecallAmbiguous → RecalledContext`** |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |
| Periagoge | AI-guided | `AbstractionInProcess → CrystallizedAbstraction` |

- **Anamnesis vs Aitesis**: Aitesis discovers facts the user does not know (`ContextInsufficient` — "I need information"). Anamnesis verifies context the user vaguely knows exists (`RecallAmbiguous` — "I know this was discussed, but where?").
- **Anamnesis vs Periagoge**: A concept prior sessions already settled is recognized here, as the unit above any one session; a concept being formed or reconsidered from cases at hand to fit what you mean now is crystallized by Periagoge (`/induce`).

</details>

<details>
<summary>Codex capture lifecycle & availability</summary>

<a name="codex-capture-lifecycle"></a>
### Codex capture lifecycle

The shared plugin hook records Codex Stop, PreCompact, and SessionEnd events with a fire-and-forget queue under `$CODEX_HOME/hypomnesis`. A detached worker coalesces events by transcript revision, extracts one compact record with `gpt-6-luna` at `xhigh`, writes an immutable generation, and atomically advances the session pointer. Nested extraction runs are ephemeral with hooks disabled. `agents/openai.yaml` provides skill discovery metadata; hook registration stays in `hooks/hooks.json`.

<a name="capture-availability"></a>
### Capture availability

Capture records the latest attempt separately from the semantic index. `/recollect` reads that outcome for the sessions searched, so a validated empty extraction, a failed or unfinished attempt, partial publication, and retained older output can be explained at the source where they occurred. An outcome that is absent or cannot be read remains unknown; existing indexes still participate in recall.

```text
Session record → extraction → validated semantic artifacts → recall candidates
                     └──────→ capture outcome ────────────→ search qualification
Session record ─────────────────────────────────────────→ recognition evidence
```

Capture outcomes live in `.outcomes/` beneath each runtime's Hypomnesis store and are excluded from semantic search. The [shared outcome reader](skills/recollect/scripts/hypomnesis-outcome.mjs) verifies the recorded publication; the [runtime reading contract](skills/recollect/references/capture-outcome.md) explains its use. Capture availability describes execution and publication, and each extractor's state and, where recorded, how much of the source it did not receive; none of it establishes that an index is semantically complete. An outcome is associated with a record only where runtime, store root, and session identity all match.

From the repository root, exercise the producer and reader together:

```bash
node --test anamnesis/scripts/hypomnesis-write.test.mjs anamnesis/scripts/hypomnesis-codex-write.test.mjs
```

</details>

<a name="author"></a>
## Author

Jongwon Choi (https://github.com/jongwony)
