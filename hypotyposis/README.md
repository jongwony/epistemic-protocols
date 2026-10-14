# Hypotyposis — /sketch (ὑποτύπωσις)

React to concrete versions until you can point at one you met and say: this is the form, for this purpose (ὑποτύπωσις: an outline — the first sketch of a position, drawn before it can be stated)

> [한국어](./README_ko.md)

## What is Hypotyposis?

A modern reinterpretation of Greek ὑποτύπωσις (outline, sketch) — a protocol for the moment **when a form has to be made and you cannot yet say what it should be, but you would recognize it on sight**. It makes concrete versions — after relaying what they will try, with its basis — in a medium where the qualities you are judging can be met, takes your reactions to them in your own words (what does not fit, what to keep, what to change), revises the versions those words point to into new ones, until you recognize one version you met as the form for your purpose; you can stop at any time, and stopping leaves the run as it stood.

### The Core Problem

Some forms cannot be specified before they are seen (`FitUnrecognized`): the plan stalls at its first draft, the description gets rewritten instead of made, and what you actually want only surfaces once something is in front of you. Good fit has no positive description of its own; each misfit can be pointed at. The observable symptoms: "I'd know it when I see it", a first draft that never arrives, a description edited for the fourth time.

### The Solution

**Recognition over Description**: you need not specify the form first. Before anything is made, the AI relays what the next versions will try, which versions they revise, how many, the medium each is shown in and what that medium can and cannot show, and where each will be — a scratch place unless you named one — each with its basis, and then makes them. Each round shows the new versions first, as you will meet them, then where the run stands: what your words set and on which version, which of the AI's proposals you took, what rests on a check against a reference, what stays unestablished, and what changed since you last answered. Where a quality has a right answer — a glyph that is right or wrong — the versions are checked against a reference before you see them, or, where it cannot be reached and you choose to go on without it, shown with that quality unchecked; your preference never stands in for that check. You react in your own words; a revision is always a new version made from the ones your words point to, never regenerated from a description. The run closes when you take one version you met as the form — its home shown in that round or named in your answer, with no separate placement step; you can stop at any time, and stopping leaves the run as it stood. The versions you passed over stay where they are unless you say otherwise. The recognition covers what the version's medium showed: a quality it did not show stays open on the record.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Proplasma | Hybrid | `DirectionUnrecognizable → DirectionalContrast` |
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Heuresis | User-initiated | `CandidateFieldUnderexpanded → DiverseCandidateField` |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| **Hypotyposis** | **Hybrid** | **`FitUnrecognized → RecognizedForm`** |

**What decides between the neighbors** is the transformation the moment needs: named alternatives whose futures you cannot judge from words → `/preview` (contrast, commit to a direction, discard the probes); intent whose coordinates already live in your codebase, rules, or past sessions → `/elicit` (read them); a finished result checked against everywhere it lands and the intents it was meant to carry → `/contextualize` (carry out the fixes you settle); an empty field of ideas → `/ideate` (widen it); **a form to make, intent underdetermined, and you would know it on sight → `/sketch`** (make, mark, revise, recognize — and keep the version you recognized).

## Three Breach Conditions

The protocol's legitimacy lives in a chain — intent relay → production → the round → your recognition → the record. Violating any of these dissolves it:

| Breach | Guard |
|--------|-------|
| A version regenerated from a description instead of revised from the versions your words point to | A revision is always a new version made from the retained versions; a version shown stays as it was shown |
| An AI reading of your words, or an AI proposal, treated as your commitment | A value stands only on your turn — one that said it, or one that took it after it was shown as the AI's — and the record says which |
| A recognition taken to cover what was never shown | A recognition reaches what the version's medium showed and never a revision not yet shown; what went unshown stays unestablished |

## Grounding

Literature the design rests on, with the strength at which the primary source was checked (*verified*: primary text read; *mostly*: core claim checked, surrounding detail synthesized):

- Alexander, C. (1964). *Notes on the Synthesis of Form*. Harvard UP — *verified*. Good fit has no positive description; misfit is immediate and enumerable. Decides that you react to versions in your own words rather than describing the form first.
- Dorst, K. & Cross, N. (2001). Creativity in the design process: co-evolution of problem–solution. *Design Studies* 22(5) — *mostly*. Problem and solution take shape together. Decides that what your words set is re-read on the whole context every round, with who proposed it kept apart.
- Tohidi, M., Buxton, W., Baecker, R. & Sellen, A. (2006). Getting the right design and the design right. *CHI 2006* — *verified*. One design shown alone inflates ratings and suppresses criticism. Decides that how many versions to show is relayed per round rather than defaulting to one, and can be sent back at the next round.
- Dow, S. et al. (2010). Parallel prototyping leads to better design results, more divergence, and increased self-efficacy. *ACM TOCHI* 17(4) — *verified*. Alternatives built before feedback improve the result and the maker's stake. Decides that alternatives are relayed per round and can be sent back at the next round, not fixed to a round schedule.
- Wadinambiarachchi, S. et al. (2024). The effects of generative AI on design fixation and divergent thinking. *CHI 2024* — *verified*. Early concrete material narrows what people go on to imagine. Decides that the production intent is relayed with its basis before anything is made, so what narrowed the versions is visible, and that a reaction the intent did not ask about still counts.

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install hypotyposis@epistemic-protocols
```

## Usage

```
/sketch [what you are about to make, and anything already settled about it]
```

Hypotyposis gathers what bears on the form, relays what the first versions will try with its basis, makes them, and shows them before where the run stands. Each round you react in your own words — mark what does not fit, keep what does, ask for a change, a combination, or another medium, or ask about a version — and the next versions are made from the ones your words point to. It closes when you take one version you met as the form for your purpose, its home shown or named in that turn; you can stop at any time, and stopping leaves the run as it stood. The record carries every version with where it is and anything you asked done to it that was not yet done, with why, the values you hold with who proposed each and whether your words set it or your turn took it, what was checked and against what, what stays open, and any contrary ground the AI held with your answer to it — a witness of what you recognized, not a specification of what to build.

## Author

Jongwon Choi (https://github.com/jongwony)
