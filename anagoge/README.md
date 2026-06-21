# Anagoge — /ascend (ἀναγωγή)

Elevate a vague recall to a higher-granularity unit (ἀναγωγή: a leading-up)

> [한국어](./README_ko.md)

## What is Anagoge?

A deliberate sibling of Anamnesis (ἀνάμνησις) — where ana-mnesis *recalls* one prior context, ana-goge *leads it up* to the connected unit above it. Anagoge is a protocol that **reconstructs the deposit graph at read-time — reading each deposit's stored anchors and discovering related deposits across sessions by shared anchors, keywords, and metadata — and recognizes the higher unit the scattered deposits already imply — a connected line of work, a topic cluster, or an already-sedimented concept — rather than resolving the recall to any single session**.

### The Core Problem

Sometimes a vague recall (`RecallGranularityInsufficient`) has enough signal to recognize that *something* matters, but the right resolution unit is not any one session. The user is reaching for a whole line of work spread across many sessions, a topic cluster of scattered fragments, or a concept that prior work already sedimented. Single-session recall returns one piece and misses the unit — the recognition *object* itself is at the wrong granularity.

### The Solution

**Recognition over Aggregation**: AI detects that the right unit is supra-session, classifies which higher unit the recall means (connected-session chain, topic cluster, or sedimented concept node), reconstructs the connections at read-time — reading each deposit's stored anchors and discovering related deposits across sessions by shared anchors, keywords, and metadata — assembles a candidate higher unit of that type, and presents it as a narrative — a chain as origin → development → arrival, a cluster as fragments + where the deposits attest the topic last stood, a concept node as the node + which deposits forged it. The user recognizes the unit. The higher unit is recognized, never fused or synthesized, and Anagoge **writes nothing**.

The deposit graph is a structural type with four invariants: no central aggregator (the graph exists only as the inferred union of read-time connections, reconstructed by traversal), edge-based assembly (a unit is built by following those inferred edges, never a global join), isolation-preserving (cross-session links and reads only — never cross-session writes), and broken-link-tolerant (a link to a missing target is not-yet-written knowledge, not an error).

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Anamnesis | AI-guided | `RecallAmbiguous → RecalledContext` |
| **Anagoge** | **AI-guided** | **`RecallGranularityInsufficient → HigherGranularityUnit`** |
| Aitesis | AI-guided | `ContextInsufficient → InformedExecution` |
| Periagoge | AI-guided | `AbstractionInProcess → CrystallizedAbstraction` |
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |

**Anagoge vs Anamnesis** — the closest sibling. Anamnesis resolves vague recall to *one* session; Anagoge resolves it to the supra-session *unit* that session belongs to. The decisive test: would a single session answer the recall? Yes → Anamnesis; no, the right unit is a chain / cluster / concept above the session → Anagoge.

**Anagoge vs Aitesis** — Anagoge *traverses already-deposited* deposits, reconstructing their connections at read-time; Aitesis *gathers newly-found* cases. If the relevant cases must be discovered rather than connected, route to `/inquire`.

**Anagoge vs Periagoge** — Anagoge *recognizes* an already-sedimented concept node (recognition-only); Periagoge *forms* a new abstraction from instances. If the concept does not yet exist and must be crystallized, route to `/induce`.

**Anagoge vs Euporia** — Anagoge locates *which remembered unit* is relevant; Euporia reverse-traces *decision intent* toward an endpoint.

**Dual relation with Hyphegesis** — a `/conduct` synthesis checkpoint can route into Anagoge to elevate scattered cross-worker results into a connected-session unit.

## Protocol Flow

```
Phase 0: Detect      → Recognize supra-session granularity, classify unit type, dispatch traversal (silent)
Phase 1: Traverse    → Discover related deposits at read-time (shared anchors/keywords/metadata), assemble candidate higher units, rank
Phase 2: Recognize   → Present the candidate higher unit as a narrative for recognition (gate interaction)
Phase 3: Integrate   → Emit the elevated higher unit into session; loop via Refine or Reorient on miss
```

## Higher-Granularity Units

The three unit types Anagoge can elevate a recall into.

| Unit | What it is |
|------|------------|
| ConnectedSessionChain | The connected line of work across sessions — where it began, how it developed, where it arrived |
| TopicCluster | The cluster of fragments on one topic + where the deposits attest the topic last stood |
| SedimentedConceptNode | An already-sedimented concept node + which deposits forged it (recognized, never formed) |

## When to Use

**Use**:
- When you remember a whole line of work, topic, or concept spread across many sessions — not any one session
- When single-session recall keeps returning one piece while you mean the larger unit
- When you want where a multi-session trajectory *landed*, not what one session said
- When prior work already sedimented a concept and you want the node, not its formation

**Skip**:
- When a single session would resolve the recall — use Anamnesis / `/recollect`
- When the cases must be newly found, not traversed from existing deposits — use Aitesis / `/inquire`
- When you want to form a new concept from instances — use Periagoge / `/induce`
- When you want to reverse-trace decision intent — use Euporia / `/elicit`

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install anagoge@epistemic-protocols
```

## Usage

```
/ascend [vague hook — the line of work, topic, or concept you remember across sessions]
```

## Author

Jongwon Choi (https://github.com/jongwony)
