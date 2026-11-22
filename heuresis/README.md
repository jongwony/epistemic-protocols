# /ideate — Heuresis (εὕρεσις)

<a name="heuresis--ideate-εὕρεσις"></a>

> [한국어](./README_ko.md)

<a name="what-is-heuresis"></a>
## What it is

Heuresis comes from the Greek word for finding, discovery, or invention. It widens a thin or empty list of options before you make any choice, generating ideas in parallel across multiple angles without eliminating, ranking, or picking among them.

<a name="the-core-problem"></a>
## The problem

Your goal is clear enough, but your list of options is empty, thin, or narrowed down to a single idea too soon. Generating options and judging them at the same time keeps the list narrow, and seeing a concrete example too early can lock your thinking onto that one path. Reach for `/ideate` before choosing a direction, when you want to widen the field of candidates or return to ideas you explored earlier.

## The result

You get a single map of your idea field: every frame and the branches dug under it, every candidate tagged with where it came from (you, the AI, or a source you named), the frames still unexplored, and anything you set out of scope or parked for later. Nothing is ranked or eliminated. You take the field whenever it serves you — and carry it into `/preview`, your own choice, an issue tracker, or whatever evaluation comes next.

<a name="install"></a>
## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install heuresis@epistemic-protocols
```

<a name="usage"></a>
<a name="the-solution"></a>
## Usage

```
/ideate [a topic, or a few fragments you already have]
```

After you type `/ideate`, the AI tells from your request (or from the conversation so far if you type a bare `/ideate`) whether you are starting blank, bringing a few initial seeds, or asking to continue an earlier field — without asking entry questions. On a blank start, unless you already named angles to explore, it first shows an abstract map of frames for you to pick from so concrete examples do not anchor you early. In each round, it generates candidates in parallel across the open frames without cutting, ranking, or choosing among them. Each round shows the whole map again, so you can see new ideas alongside earlier branches. You can open more frames, name your own angle, add your own idea, or dig deeper into a frame or single candidate to branch beneath it.

<details>
<summary>How the protocol runs and handles external material</summary>

<a name="name"></a>
**Name**: Greek εὕρεσις denotes finding, discovery, or invention/conception broadly; its later specialization as a term of rhetorical *inventio* is one historical narrowing among several, not the primary sense here.

**Divergence over Selection**: Blank entries see an abstract frame map before any concrete idea exists (unless the request already names frames); seeded entries expand straight from what you supplied. A round may carry the widening further on a judgment the AI states — never into what you set out of scope — and comes back saying what it opened and why. There is no round quota: your own taking bounds the field, and only a field with candidates in it can be taken. Saying you are done or turning to other work leaves the run holding where it stood; a later `/ideate` that carries it on — by asking to continue, or when the conversation gives a bare `/ideate` that meaning — resumes it whether or not it was taken, while a new topic starts a new field.

<a name="the-chain-boundary"></a>
### The Chain Boundary

heuresis reads only what you give it: your request, what you say as the run goes on, and material you explicitly name (a prior protocol's output, or a record outside the session such as an issue or a document, which it reads for you). Nothing you did not name — the wider session, codebase, or rules — enters the field, though reading what you mean (including a bare `/ideate`) draws on the conversation so far. If you chain material in this way, that is a deliberate substrate-first choice: because you read the material before invoking `/ideate`, the ownership and diversity benefit of ideating *before* seeing prior material does not hold on that path. heuresis states this plainly and adds no workaround.

</details>

<details>
<summary>How it compares to other protocols</summary>

<a name="difference-from-other-protocols"></a>
| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Proplasma | Hybrid | `DirectionUnrecognizable → DirectionalContrast` |
| **Heuresis** | **User-initiated** | **`CandidateFieldUnderexpanded → DiverseCandidateField`** |

- **Where it sits**: heuresis's `Frame` is a temporary partition for parallel idea production, never handed off as an analytical lens. Proplasma (`/preview`) previews directions once two or more candidates already exist and need to be seen before choosing — heuresis sits upstream, where the candidate field itself needs widening. Euporia (`/elicit`) traces the decision coordinates an intent turns on from your words and your material (codebase, rules, past sessions) — heuresis never scans that material unless you explicitly name a record.
- **Routing precedence**: two or more candidates already exist and just need to be seen → `/preview`; seed material still has to be gathered → run a collection protocol first (e.g. `/inquire`) and chain its output in, while a record you can name (an issue, a document) enters `/ideate` directly; the candidate field itself is thin or stalled → **`/ideate`**.

</details>

<a name="author"></a>
## Author

Jongwon Choi (https://github.com/jongwony)
