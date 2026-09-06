# Hypotyposis — /sketch (ὑποτύπωσις)

Discover a form by marking what does not fit on concrete sketches until one is recognized (ὑποτύπωσις: an outline — the first sketch of a position, drawn before it can be stated)

> [한국어](./README_ko.md)

## What is Hypotyposis?

A modern reinterpretation of Greek ὑποτύπωσις (outline, sketch) — a protocol for the moment **when a form has to be made and you cannot yet say what it should be, but you would recognize it on sight**. It produces a concrete sketch under a focus you settle, takes your marks on it — what does not fit, and what to keep — as first-class utterances, revises the retained version under those marks, and stops when you recognize one version as the form for a stated purpose.

### The Core Problem

Some forms cannot be specified before they are seen (`FitUnrecognized`): the plan stalls at its first draft, the description gets rewritten instead of made, and what you actually want only surfaces once something is in front of you. Good fit has no positive description of its own; each misfit is immediate and can be pointed at. The observable symptoms: "I'd know it when I see it", a first draft that never arrives, a description edited for the fourth time.

### The Solution

**Recognition over Description**: settle each round's focus, the perception it needs, and how many variants to produce at a round-spec gate before anything is made; produce the sketches in temp isolation; present them and take your marks on a specific version; revise the retained version — never regenerate it from the coordinates that describe it — and repeat until you finish on a version for a stated purpose. Your marks stay your words; what the AI reads from them stays provisional until you settle it. At the end you name where the recognized version lives (there is no default), and everything else is released with its disposition declared.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Proplasma | Hybrid | `DirectionUnrecognizable → DirectionalContrast` |
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Heuresis | User-initiated | `CandidateFieldUnderexpanded → DiverseCandidateField` |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| **Hypotyposis** | **Hybrid** | **`FitUnrecognized → RecognizedForm`** |

**What decides between the neighbors** is the transformation the moment needs: named alternatives whose futures you cannot judge from words → `/preview` (contrast, commit to a direction, discard the probes); intent whose coordinates already live in your codebase, rules, or past sessions → `/elicit` (read them); a correct result that may not fit a context already settled → `/contextualize` (repair the result); an empty field of ideas → `/ideate` (widen it); **a form to make, intent underdetermined, and you would know it on sight → `/sketch`** (make, mark, revise, recognize — and keep the version you recognized).

## Three Breach Conditions

The protocol's legitimacy lives in a chain — round-spec gate → production → recognition gate → placement gate → account. Violating any of these dissolves it:

| Breach | Guard |
|--------|-------|
| A sketch regenerated from coordinates instead of revised from the retained version | Concretum Retention: each round revises the parent the brief names |
| An AI interpretation of a mark treated as your commitment | Interpretations stay provisional until you settle them at the next round-spec gate |
| A recognized version left at a temporary path | The placement gate has no default; you name a reference that outlives the session |

## Grounding

Literature the design rests on, with the strength at which the primary source was checked (*verified*: primary text read; *mostly*: core claim checked, surrounding detail synthesized):

- Alexander, C. (1964). *Notes on the Synthesis of Form*. Harvard UP — *verified*. Good fit has no positive description; misfit is immediate and enumerable. Decides the gate's answer type: marks on a version, never a description of the form.
- Dorst, K. & Cross, N. (2001). Creativity in the design process: co-evolution of problem–solution. *Design Studies* 22(5) — *mostly*. Problem and solution take shape together. Decides that coordinates are revisable with provenance rather than fixed once accepted.
- Tohidi, M., Buxton, W., Baecker, R. & Sellen, A. (2006). Getting the right design and the design right. *CHI 2006* — *verified*. One design shown alone inflates ratings and suppresses criticism. Decides that the variant count is settled per round rather than defaulting to one.
- Dow, S. et al. (2010). Parallel prototyping leads to better design results, more divergence, and increased self-efficacy. *ACM TOCHI* 17(4) — *verified*. Alternatives built before feedback improve the result and the maker's stake. Decides that alternatives are settled at the spec gate, not fixed to a round schedule.
- Wadinambiarachchi, S. et al. (2024). The effects of generative AI on design fixation and divergent thinking. *CHI 2024* — *verified*. Early concrete material narrows what people go on to imagine. Decides that the round spec is settled before anything is produced and that an unexpected mark stays admissible whatever the focus.

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install hypotyposis@epistemic-protocols
```

## Usage

```
/sketch [what you are about to make, and anything already settled about it]
```

Hypotyposis binds what you already settled, proposes a first round's focus and variants for you to approve or adjust, produces the sketches, and presents them for your marks. Each round you mark a version, declare one focus adequate, or finish on a version for the purpose you state. On finish you name where the recognized version lives; the result carries the settled commitments, the trace of what each mark became, the axes you left open, and a reference to the version you recognized — a witness of what you recognized, not a specification of what to build.

## Author

Jongwon Choi (https://github.com/jongwony)
