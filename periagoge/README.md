# /induce — Periagoge (περιαγωγή)
<a name="periagoge-περιαγωγή"></a>

> [한국어](./README_ko.md)

## What it is

Periagoge (Greek περιαγωγή, "turning-around") is a protocol for naming what several concrete cases share and shaping it into a clear concept and rule. It lays out a working candidate alongside every live reading of the cases and your goal, so you can see which cases each reading includes or leaves out.

<a name="when-to-invoke"></a>
## The problem

You have two or more concrete cases that seem to share something, and either nobody has named it yet or the old name no longer fits what the cases show. Without a way to test candidates against the cases and your goal side by side, a shared concept stays vague or silently drops cases that do not fit cleanly. Reach for `/induce` when you are forming or rethinking a shared concept from examples, not when you are applying an already fixed rule to a disputed case.

<a name="overview"></a>
## The result

Only you close the run. Once you recognize a candidate, you have:

- **A named concept and rule** that you recognize as serving your goal.
- **The boundary across your cases** — which cases it takes in, which it leaves out, what each case shows, and any remaining doubts the AI recorded.

If an unseen case would decide against the candidate you are about to settle on, the AI shows you that case and asks again before closing. You can also stop at any time, leaving the sheet as it stood.

## Install

See the root [README](../README.md) for installation.

## Usage

Type `/induce` with the cases you are looking at.

Each round, the AI returns a sheet that puts the pieces side by side so you can compare them at a glance:

- **Cases** — your cases plus any case the AI found on its own (marked as the AI's).
- **Goal and working candidate** — the goal this concept serves and a candidate name and rule, with any shortfall in its ground shown right beside it. Every item is marked with whether it came from your words, was taken by you from what the AI showed, or is still a proposal (and whose).
- **Live readings** — the different ways to read what the cases share. For each interpretation, see which cases it includes or excludes for your purpose, with each case unfolded where it is judged.

Along with the sheet, the AI may run reversible work based on a stated judgment and report how it read your words, what it judged on what basis (including alternatives it passed over that you might prefer), and how far it went. If that work turns up a case that goes against the candidate, the AI shows it with how it sorts rather than hiding it to keep the candidate clean.

You reply in your own words — shift the goal or the candidate, adopt something the AI showed, set a reading aside, or say you recognize the candidate as the one that fits — and each reply changes only what your words address.

<details>
<summary>Name, type, and relation to other protocols</summary>

<a name="name"></a>
### Name

The name draws a structural analogy from Plato *Republic* VII.518d, where περιαγωγή names the soul's turning-around toward the intelligible. The protocol borrows the turning-toward structure; it does not claim Platonic paideia. The dialectical vocabulary of *Phaedrus* 265d–266a — collection and division — supplies the source terms for gathering the cases together and telling their readings apart; the borrowing is terminological, not a claim to Platonic method.

<a name="type"></a>
### Type

```
(AbstractionInProcess, AI, INDUCE, A)
  → CrystallizedAbstraction
```

### Relation to other protocols

Periagoge stands in directional dual relation to Euporia (`/elicit`): Periagoge ascends from concrete instances to abstraction (bottom-up direction), while Euporia descends from intent to the coordinates it turns on (top-down direction). The two compose as orthogonal directions of the same dialectic (informal direction-orthogonality, not a formal categorical limit/colimit duality).

When your intent is articulated but turns on decisions you have not named, use Euporia (`/elicit`). When the concept already exists in prior work and only needs to be found again rather than formed or reconsidered, use Anamnesis (`/recollect`).

<a name="components"></a>
### Components

- `skills/induce/SKILL.md` — protocol definition (formal blocks, prose, rules)
- `.claude-plugin/plugin.json` — plugin manifest

</details>
