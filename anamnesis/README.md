# Anamnesis — /recollect (ἀνάμνησις)

Resolve vague recall into recognized context (ἀνάμνησις: recollection, calling to mind)

> [한국어](./README_ko.md)

## What is Anamnesis?

A modern reinterpretation of Platonic ἀνάμνησις (recollection) — a protocol that **searches the records past work left — its conversations, the artifacts it changed and their change history, the decisions it recorded — against a vague hook, opens each candidate's own record at the span the cue reaches, and tells what those records carry with their sources so the user can identify the right prior context — rather than returning keyword-matched retrieval results or an index's paraphrase**.

### The Core Problem

AI systems often discard vague recall signals (`RecallAmbiguous`) — the user senses that some prior session, decision, or artifact is relevant but cannot name it specifically. Keyword search over memory returns too much or too little because the hook is under-specified, and the signal is lost before the right prior context is reached.

### The Solution

**Source-grounded recognition**: AI reads the cue out of the utterance and the accumulated context — the past meant, the whole it names, and the axes it can be reached along (a time, a person, an artifact, an identifier, a coined term) — and follows those axes to the records that may bear it. It opens each member of the leading candidate at the span the cue reaches — for an artifact, the change history of that span — and tells the story in the records' words (origin → direction → outcome; above one record, in the shape of the line, topic, or concept), each sentence resting on an opened record with its speaker kept, each excerpt beside its source and resume handle, and yields the turn. The user identifies it — saying so, or going on with it as the past they meant — or adds to the cue in their own words and the search runs again; no number of corrections ends the recall. An index's gist is a cue that wakes recall, never evidence of it; the opened record is the evidence; the identification is the user's.

Claude Code and Codex records are searched together when both are available, starting from the current configuration's root; another root — an older configuration moved aside — is searched when the recall points at it, and every candidate keeps its runtime and root label. Reading named spans of named records and finding candidates across a population already bounded run without asking; a search whose extent passes that boundary is offered with its cost, and runs only on the user's word.

### Codex capture lifecycle

The shared plugin hook records Codex Stop, PreCompact, and SessionEnd events with a fire-and-forget queue under `$CODEX_HOME/hypomnesis`. A detached worker coalesces events by transcript revision, extracts one compact record with `gpt-5.6-luna` at `xhigh`, writes an immutable generation, and atomically advances the session pointer. Nested extraction runs are ephemeral with hooks disabled. `agents/openai.yaml` provides skill discovery metadata; hook registration stays in `hooks/hooks.json`.

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

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Aitesis | AI-guided | `ContextInsufficient → SufficientContext` |
| **Anamnesis** | **AI-guided** | **`RecallAmbiguous → RecalledContext`** |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |
| Periagoge | AI-guided | `AbstractionInProcess → CrystallizedAbstraction` |

**Anamnesis vs Aitesis** — the closest neighbor. Both involve information access, but the phenomenological test differs. Aitesis discovers facts the user does not know (`ContextInsufficient` — "I need information"). Anamnesis verifies context the user vaguely knows exists (`RecallAmbiguous` — "I know this was discussed, but where?"). Empty intention seeking fulfillment → Anamnesis; no intention at all regarding the topic → Aitesis.

**Anamnesis vs Periagoge** — the boundary above one session. A concept prior sessions already settled is recognized here, as the unit above any one session; a concept still forming from cases that have not yet been named is crystallized by Periagoge (`/induce`). Recognition of what was settled → Anamnesis; formation of what is not yet named → Periagoge.

## Protocol Flow

```
Activation → An invocation of the user's own, or an empty intention detected (silent)
Pass       → Read the cue, the whole, and the axes; search within the established boundary; open the leading candidate's records at the span the cue reaches
Round      → Present the story in the records' words, each excerpt with its source and resume handle, and yield the turn; or, with nothing to present, ask one open question, then offer the wider search with its cost
Close      → The user identifies it → RecalledContext; the user stops → what was searched; nothing further worth reaching for → unresolved within the scope searched; anything else is more cue → the next pass
```

## Axes of the Cue

The cue names the axes the past can be reached along; there is no fixed set. A time, a person or system, an artifact or path, an identifier (an issue, a pull request, a commit, a session id), a coined term, an unusual episode — whichever the user's words carry are followed. An identifier anchors a candidate only where the kind of thing it names fits what the cue claims; a bare number carries no repository until one is read from the record around it.

## When to Use

**Use**:
- When you sense a prior session or decision is relevant but cannot name it
- When keyword search over memory returns too much or too little
- When the hook is phenomenological ("that time we talked about…") rather than structured
- When the right next step depends on recognizing which prior thread to resume
- When what you remember is a whole line of work, a topic worked out in scattered pieces, or a concept prior sessions already settled — the same recall, resolved to the unit above any one session

**Skip**:
- When you already know the session ID, file path, or decision — direct lookup is cheaper
- When no prior context exists (novel domain — use Aitesis / `/inquire` instead)
- When the concept is not yet formed and must be crystallized from cases (use Periagoge / `/induce` instead)
- When the request is to generate, not to remember

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

## Usage

```
/recollect [vague hook — keywords, fragment, or description]
```

## Author

Jongwon Choi (https://github.com/jongwony)
