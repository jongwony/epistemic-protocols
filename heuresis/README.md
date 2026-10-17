# Heuresis — /ideate (εὕρεσις)

Widen an underexpanded candidate field through frame-parallel divergent generation (εὕρεσις: finding, discovery, invention)

> [한국어](./README_ko.md)

## Name

Greek εὕρεσις denotes finding, discovery, or invention/conception broadly; its later specialization as a term of rhetorical *inventio* is one historical narrowing among several, not the word's primary or governing sense here.

## What is Heuresis?

A protocol for the moment **before any selection is made, when the candidate field itself is thin** — empty, or already narrowed onto one option before the underlying goal called for it. It infers whether you're starting blank, already hold a few fragments, or are continuing a field from before, from the invocation — a bare `/ideate` from the conversation before it — with no entry questions, opens abstract frames for you to pick before showing any concrete idea on a blank start, unless your request already names frames, then generates candidates in parallel across the frames you open, and across frames the AI opens on a judgment it states — never eliminating, ranking, or choosing among them. You take the field whenever it serves you.

### The Core Problem

Some candidate fields are underexpanded (`CandidateFieldUnderexpanded`): the goal is clear enough, but the object-level alternatives are empty or have converged early. Divergent and convergent thinking are distinct cognitive operations, and collapsing them — generating and judging in the same breath — is what keeps a field thin. Two related risks compound it: showing a concrete example too early anchors the very generation it was meant to kick off, and AI-assisted generation can make outputs converge toward each other unless something actively holds the field open.

### The Solution

**Divergence over Selection**: infer blank, seeded, or resumed entry without asking, then fork — blank entries see an abstract frame map before any concrete idea exists, unless the request already names frames (ownership stays with you, and nothing anchors your own thinking early); seeded entries expand straight from what you already gave, since the anchoring risk doesn't apply the same way to material you supplied yourself. Each round generates candidates in parallel across the open frames, every candidate tagged with its origin (you, the AI, or the source chained material came from), nothing discarded or ranked. A round may carry the widening further on a judgment the AI states, opening frames still unexplored, or new frames and branches it shapes — never one you set out of scope or aside — and comes back saying what it opened and why; taking the field, setting a frame out of scope, and parking stay yours. There is no round quota — your own taking is what bounds the field, and only a field with candidates in it can be taken: before any candidate exists there is nothing to take yet, and saying you are done, or turning to other work, leaves the run where it stood.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Proplasma | Hybrid | `DirectionUnrecognizable → DirectionalContrast` |
| **Heuresis** | **User-initiated** | **`CandidateFieldUnderexpanded → DiverseCandidateField`** |

**Where it sits**: heuresis's `Frame` is not an analytical lens on a fixed inquiry — it is a temporary partition for parallel idea production, never handed off as an analytical perspective. Proplasma previews *directions* once two or more candidates already exist and need to be seen before choosing — heuresis sits upstream of that, at the point where the field itself needs widening. Euporia reverse-traces decision coordinates from externalized substrate (codebase, rules, past sessions) — heuresis never scans that substrate; it reads your own words and whatever material you explicitly name — a prior protocol's output, or a record such as an issue that it reads for you.

**Routing precedence**: two or more candidates already exist and just need to be seen → `/preview`; the seed material still has to be found or gathered → run a collection protocol first (e.g. `/inquire`) and chain its output in, while a record you can name (an issue, a document) enters `/ideate` directly; the candidate field itself is thin or stalled → **`/ideate`**.

## The Chain Boundary

heuresis reads what you give it: your request, what you say as the run goes on, and material you explicitly name — a prior protocol's output, or a record outside the session such as an issue or a document, which it reads for you. Nothing you did not name — the wider session, codebase, or rules — enters the field; reading what you mean, a bare `/ideate` included, draws on the conversation so far. If you chain material in this way, that's a deliberate substrate-first choice — you read the material before writing the invocation, so the ownership/diversity benefit of ideating *before* seeing prior material doesn't hold on that path. heuresis states this plainly; it adds no workaround.

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install heuresis@epistemic-protocols
```

## Usage

```
/ideate [a topic, or a few fragments you already have]
```

heuresis reads your invocation, infers blank, seeded, or resumed entry, and — on blank, unless your request already names frames — opens an abstract frame map for you to pick from before generating anything. Each round then produces candidates in parallel across the open frames, tagged with origin, presented with what's still unexplored. Continue by opening more frames, naming your own, giving an idea of your own (it joins the field as yours), or asking to dig deeper under a frame or a single candidate — that opens a branch beneath it, and every round redraws the whole field as one map, with what changed since your last answer marked. Once it has run, you can look over one map of your idea field — each frame and the branches dug under it, every candidate with where it came from, what stays unexplored, and what you set out of scope or aside — and take that field forward, with nothing in it chosen or ranked; choosing among it is a separate act. Until you take it the field holds, and a later `/ideate` that carries it on — by asking, or read so from the conversation for a bare `/ideate` — resumes it, taken or not; a new topic starts a new field. The field you take — topic, tagged candidates, frames and branches, what is still unexplored, anything you set aside for later — is an endpoint-neutral contract that flows into `/preview`, your own direct judgment, an issue tracker, or whatever evaluation work comes next.

## Author

Jongwon Choi (https://github.com/jongwony)
