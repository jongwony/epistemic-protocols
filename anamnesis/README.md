# Anamnesis — /recollect (ἀνάμνησις)

Resolve vague recall into recognized context (ἀνάμνησις: recollection, calling to mind)

> [한국어](./README_ko.md)

## What is Anamnesis?

A modern reinterpretation of Platonic ἀνάμνησις (recollection) — a protocol that **scans the SSOT (session transcript) and the hypomnesis INDEX against a vague hook — `memory/` is a non-scanned, user-curated adjunct — opens each candidate's own record for the excerpt the cue reaches, and presents that excerpt with its source so the user can identify the right prior context — rather than returning keyword-matched retrieval results or the index's paraphrase**.

### The Core Problem

AI systems often discard vague recall signals (`RecallAmbiguous`) — the user senses that some prior session, decision, or artifact is relevant but cannot name it specifically. Keyword search over memory returns too much or too little because the hook is under-specified, and the signal is lost before the right prior context is reached.

### The Solution

**Source-grounded recognition**: AI reads the cue out of the utterance and the accumulated context, finds candidates in the hypomnesis INDEX and the session-record spines along Salience dimensions, then opens the top candidate's own record — one read per composing session — for the excerpt the cue reaches. It presents the story of the discussion in the record's words (origin → direction → outcome; above one session, in the shape of the line, topic, or concept), each excerpt beside its source and resume handle, and yields the turn. The user identifies it, or corrects the cue in their own words and the search runs again. The INDEX narrative is a cue that wakes recall, never evidence of it; the excerpt is the evidence; the identification is the user's. Structured literal matches anchor ranking only when their source namespace authorizes the recall trace's claim kind.

Claude Code and Codex compact indexes are searched concurrently when both are available, and every candidate keeps its source label. Scanning raw transcripts across the store is a second-stage expansion that `/recollect` presents as an explicit choice after the compact search and one open question both miss; opening the one record a presented candidate points at is bounded and needs no such choice.

### Codex capture lifecycle

The shared plugin hook records Codex Stop, PreCompact, and SessionEnd events with a fire-and-forget queue under `$CODEX_HOME/hypomnesis`. A detached worker coalesces events by transcript revision, extracts one compact record with `gpt-5.6-luna` at `xhigh`, writes an immutable generation, and atomically advances the session pointer. Nested extraction runs are ephemeral with hooks disabled. `agents/openai.yaml` provides skill discovery metadata; hook registration stays in `hooks/hooks.json`.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Aitesis | AI-guided | `ContextInsufficient → InformedExecution` |
| **Anamnesis** | **AI-guided** | **`RecallAmbiguous → RecalledContext`** |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |
| Periagoge | AI-guided | `AbstractionInProcess → CrystallizedAbstraction` |

**Anamnesis vs Aitesis** — the closest neighbor. Both involve information access, but the phenomenological test differs. Aitesis discovers facts the user does not know (`ContextInsufficient` — "I need information"). Anamnesis verifies context the user vaguely knows exists (`RecallAmbiguous` — "I know this was discussed, but where?"). Empty intention seeking fulfillment → Anamnesis; no intention at all regarding the topic → Aitesis.

**Anamnesis vs Periagoge** — the boundary above one session. A concept prior sessions already settled is recognized here, as the unit above any one session; a concept still forming from cases that have not yet been named is crystallized by Periagoge (`/induce`). Recognition of what was settled → Anamnesis; formation of what is not yet named → Periagoge.

## Protocol Flow

```
Phase 0: Cue         → Detect empty intention; read the cue and the whole it names — one session, or a line, topic, or concept above it (silent)
Phase 1: Find+Ground → Find candidates in the INDEX and record spines, rank them; open the top candidate's own record(s) for the excerpt the cue reaches
Phase 2: Present     → Show the story in the record's words with each excerpt's source and resume handle; yield the turn (one shape at every scope)
Phase 3: Resolve     → The user identifies it → RecalledContext; or corrects the cue → back to Find (three tries); or moves on
```

## Salience Dimensions

The six dimensions of the `MarkerProfile` — used to find and rank recall candidates.

| Dimension | What it marks |
|-----------|---------------|
| Coinage | Coined vocabulary and neologisms that anchor prior discussion — tokens rare in the broader corpus yet repeated within a session (Zipf-deviation signal) |
| Actor | Entities (people, systems, modules, files) named in the prior context |
| Temporal | Time references, session dates, and ordering cues that place the recall |
| Emotional | Affective markers — frustration, surprise, breakthrough — that make a moment memorable |
| Cognitive | Reasoning markers — decisions made, trade-offs resolved, realizations reached |
| Singularity | One-off events, incidents, or uncommon episodes that stand apart from routine discussion |

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
