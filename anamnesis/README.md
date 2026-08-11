# Anamnesis — /recollect (ἀνάμνησις)

Resolve vague recall into recognized context (ἀνάμνησις: recollection, calling to mind)

> [한국어](./README_ko.md)

## What is Anamnesis?

A modern reinterpretation of Platonic ἀνάμνησις (recollection) — a protocol that **scans the SSOT (session transcript) and the hypomnesis INDEX against a vague hook — `memory/` is a non-scanned, user-curated adjunct — then guides the user through Socratic recognition of the right prior context rather than returning keyword-matched retrieval results**.

### The Core Problem

AI systems often discard vague recall signals (`RecallAmbiguous`) — the user senses that some prior session, decision, or artifact is relevant but cannot name it specifically. Keyword search over memory returns too much or too little because the hook is under-specified, and the signal is lost before the right prior context is reached.

### The Solution

**Recognition over Retrieval**: AI scans SSOT (session JSONL) and the hypomnesis INDEX along Salience dimensions, presents ranked candidates as Socratic narrative fingerprints (origin → direction → outcome), and the user recognizes the match — or refines via Socratic probing over adjacent vectors, or reorients to an orthogonal recall dimension. Structured literal matches anchor ranking only when their source namespace authorizes the recall trace's claim kind. Transforms vague recall into recognized context.

Claude Code and Codex compact indexes are searched concurrently when both are available, and every candidate keeps its source label. Raw transcripts are a second-stage expansion that `/recollect` presents as an explicit choice after the compact search and one recall probe miss.

### Codex capture lifecycle

The shared plugin hook records Codex Stop, PreCompact, and SessionEnd events with a fire-and-forget queue under `$CODEX_HOME/hypomnesis`. A detached worker coalesces events by transcript revision, extracts one compact record with `gpt-5.6-luna` at `xhigh`, writes an immutable generation, and atomically advances the session pointer. Nested extraction runs are ephemeral with hooks disabled. `agents/openai.yaml` provides skill discovery metadata; hook registration stays in `hooks/hooks.json`.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Aitesis | AI-guided | `ContextInsufficient → InformedExecution` |
| **Anamnesis** | **AI-guided** | **`RecallAmbiguous → RecalledContext`** |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |

**Anamnesis vs Aitesis** — the closest neighbor. Both involve information access, but the phenomenological test differs. Aitesis discovers facts the user does not know (`ContextInsufficient` — "I need information"). Anamnesis verifies context the user vaguely knows exists (`RecallAmbiguous` — "I know this was discussed, but where?"). Empty intention seeking fulfillment → Anamnesis; no intention at all regarding the topic → Aitesis.

## Protocol Flow

```
Phase 0: Detect      → Recognize empty intention, classify input type, dispatch track (silent)
Phase 1: Scan        → Scan stores along Salience dimensions, rank candidates
Phase 2: Recognize   → SingleObvious: emit the top candidate directly, no gate (silence = recognize); otherwise present the top-ranked candidate for Socratic recognition, one per cycle (gate interaction)
Phase 3: Integrate   → Emit recognized context into session; loop via Refine or Reorient on miss
```

## Salience Dimensions

The six dimensions of the `MarkerProfile` — used to rank recall candidates and to shape Socratic probes when initial candidates miss.

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

**Skip**:
- When you already know the session ID, file path, or decision — direct lookup is cheaper
- When no prior context exists (novel domain — use Aitesis / `/inquire` instead)
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
