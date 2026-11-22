# /sketch — Hypotyposis (ὑποτύπωσις)
<a name="hypotyposis--sketch-ὑποτύπωσις"></a>

> [한국어](./README_ko.md)

## What it is
<a name="what-is-hypotyposis"></a>

Hypotyposis (ὑποτύπωσις) means an outline or first sketch, drawn before a position can be stated in full. It is a protocol that makes concrete versions for you to react to in your own words and revises them from your reactions until you can point at one version you met and recognize it as the form for your purpose.

## The problem
<a name="the-core-problem"></a>

You have something to make and cannot describe in advance what it should look or read like, yet you will know it when you see it. When you try to specify it up front, the first draft never arrives, or you edit the description for the fourth time because what you actually want only surfaces once something concrete sits in front of you. Reach for `/sketch` when pointing at what does not fit in a real draft is much easier than describing the right form from scratch.

## The result

The run closes when you point at a version you met and take it as the form for your purpose, with its location shown in that round or named in your answer. Passed-over versions stay where they are unless you ask otherwise. You finish with the chosen version in place and a record of every version, where it lives, and anything you asked done to it that is not yet done (with why), the choices set by your words versus accepted from the AI's proposals, what was checked and against which reference, any qualities the medium could not show that remain open, and any objection the AI raised with your answer to it.

## Install
<a name="install"></a>

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install hypotyposis@epistemic-protocols
```

## Usage
<a name="usage"></a>
<a name="the-solution"></a>

```
/sketch [what you are about to make, and anything already settled about it]
```

Before making anything, the AI tells you what the first versions will try, how many it will make, the medium each will be shown in (along with what that medium can and cannot show), and where each version will live, together with its basis. Then it makes them and shows the concrete versions first. Where a quality has an objective right or wrong answer (such as whether a character glyph is accurate), the AI checks the versions against a reference before showing them. If the reference is unavailable, you decide whether to see the version with that quality marked unchecked.

Each round, you react in your own words: point out what does not fit, say what to keep or change, ask to combine versions or try another medium, or ask a question about a version. The AI makes the next versions according to your words — revising the retained versions you pointed to into new versions (never regenerating them from an abstract summary), starting fresh, or combining versions — and may also add a version it proposes. You can stop at any time; stopping leaves the run as it stood and carries out whatever cleanup or handling you ask for the versions made so far.

<details>
<summary>Comparison with other protocols</summary>

**Hypotyposis** (ὑποτύπωσις, outline / first sketch) turns an unrecognized fit (`FitUnrecognized`) into a recognized form (`RecognizedForm`) by having you react to concrete versions rather than specify the form up front.

<a name="difference-from-other-protocols"></a>
### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Proplasma | Hybrid | `DirectionUnrecognizable → DirectionalContrast` |
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Heuresis | User-initiated | `CandidateFieldUnderexpanded → DiverseCandidateField` |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| **Hypotyposis** | **Hybrid** | **`FitUnrecognized → RecognizedForm`** |

**What decides between the neighbors** is the transformation the moment needs: named alternatives whose futures you cannot judge from words → `/preview` (contrast, commit to a direction, discard the probes); intent that turns on decisions you have not named → `/elicit` (trace them from your words and material); a finished result checked against everywhere it lands and the intents it was meant to carry → `/contextualize` (carry out the fixes you settle); an empty field of ideas → `/ideate` (widen it); **a form to make, intent underdetermined, and you would know it on sight → `/sketch`** (make, mark, revise, recognize — and keep the version you recognized).

</details>

<details>
<summary>Breach conditions and literature grounding</summary>

<a name="three-breach-conditions"></a>
### Three Breach Conditions

The protocol's legitimacy lives in a chain — intent relay → production → the round → your recognition → the record. Violating any of these dissolves it:

| Breach | Guard |
|--------|-------|
| A version regenerated from a description instead of revised from retained versions | A revision is always a new version made from the retained versions; a version shown stays as it was shown |
| An AI reading of your words, or an AI proposal, treated as your commitment | A value stands only on your turn — one that said it, or one that took it after it was shown as the AI's — and the record says which |
| A recognition taken to cover what was never shown | A recognition reaches what the version's medium showed and never a revision not yet shown; what went unshown stays unestablished |

<a name="grounding"></a>
### Grounding

Literature the design rests on, with the strength at which the primary source was checked (*verified*: primary text read; *mostly*: core claim checked, surrounding detail synthesized):

- Alexander, C. (1964). *Notes on the Synthesis of Form*. Harvard UP — *verified*. Good fit has no positive description; misfit is immediate and enumerable. Decides that you react to versions in your own words rather than describing the form first.
- Dorst, K. & Cross, N. (2001). Creativity in the design process: co-evolution of problem–solution. *Design Studies* 22(5) — *mostly*. Problem and solution take shape together. Decides that what your words set is re-read on the whole context every round, with who proposed it kept apart.
- Tohidi, M., Buxton, W., Baecker, R. & Sellen, A. (2006). Getting the right design and the design right. *CHI 2006* — *verified*. One design shown alone inflates ratings and suppresses criticism. Decides that how many versions to show is relayed with each production rather than defaulting to one, and can be sent back at the next round.
- Dow, S. et al. (2010). Parallel prototyping leads to better design results, more divergence, and increased self-efficacy. *ACM TOCHI* 17(4) — *verified*. Alternatives built before feedback improve the result and the maker's stake. Decides that alternatives are relayed with each production and can be sent back at the next round, not fixed to a round schedule.
- Wadinambiarachchi, S. et al. (2024). The effects of generative AI on design fixation and divergent thinking. *CHI 2024* — *verified*. Early concrete material narrows what people go on to imagine. Decides that the production intent is relayed with its basis before anything is made, so what narrowed the versions is visible, and that a reaction the intent did not ask about still counts.

</details>

## Author
<a name="author"></a>

Jongwon Choi (https://github.com/jongwony)
