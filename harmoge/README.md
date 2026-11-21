# Harmoge — /fit (ἁρμογή)

Bring a direction, a design or an implementation to what you intend through concrete cases, until the solution space shown is enough for your purpose (ἁρμογή: a fitting together, a joining of parts into a whole)

> [한국어](./README_ko.md)

## What is Harmoge?

A modern reinterpretation of Greek ἁρμογή (fitting together, joining) — a protocol for the moment **when you know what you are after, something already stands in front of you or is about to be made, and no description of it tells you where it stops matching what you intend**. The AI interviews you: it shows the solution space as it now stands, asks you to judge concrete cases, carries each answer into the target, and replays every case gathered since you called it — until you take the space it shows as enough for your purpose.

### The Core Problem

A solution space cannot always be fused with an intent from its description (`SolutionSpaceUnfused`). A rule reads fine until a message arrives that it handles in a way you would never accept; two readings of a clause both sound reasonable until one concrete event sits between them. The boundary was there all along, and nothing short of a case showed it. The observable symptoms: an abstract question that stays unanswered for hours and is answered in one turn once its example arrives; a recommendation you reject for its reason rather than its content; a change that satisfies the last answer and quietly breaks an earlier one.

### The Solution

**Cases over Descriptions**: you hold the Northstar and the purpose, and you judge cases; the AI does the interviewing and brings its own reading — the space, the evidence, where each answer leads — as cases. Each round shows:

- **the space as it now stands** — what now fits best, the alternatives that part from it, the premises they turn on, its domain, the trade-offs you have taken, and the boundaries still open;
- **what the AI read from your last answer**, each reading with the turn it rests on — yours, something a tool returned, or the AI's own inference, said as such;
- **what it carried into the target**, and what the target now does on every case gathered since the call — a summary over all of them, and each case whose outcome changed shown as that case;
- **the next question** — only what you alone hold, as concrete cases with their bodies shown, the most consequential first. A case where two of your answers lead to different outcomes is among those it may ask about. An alternative design arrives as the turn it would actually be in a situation you know, followed by the one thing that separates it from the others and why, one alternative after another.

You answer in your own words. An answer binds as far as its words reach — required, permitted, ruled out, "the premise is wrong", "I don't know" are all answers — and a reason or an example of your own can open a further case or move the whole space. Your judgment of a case changes only when you change it: if the target does something else on a case you judged, that is shown to you as that case, with your judgment standing.

The run closes when you take the space a round showed as enough for your intent and goal. Where your taking is clear the AI says how it took it and goes on, and you interrupt where it read you wrong; where the evidence gives it reason to question a decision against the goal you stated, it may put that consequence to you as the next case. The record is that space: the cases you settled, the trade-offs you took, the boundaries still open, the premises and the domain, the target as the space's realization, and what the target did on each case. What the target does on a case counts as observed only where a run of it returned; where nothing ran — a design in prose, a direction — it is the AI's reading of the target on that case, marked as a reading.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Periagoge | AI-guided | `AbstractionInProcess → CrystallizedAbstraction` |
| Hypotyposis | Hybrid | `FitUnrecognized → RecognizedForm` |
| Proplasma | Hybrid | `DirectionUnrecognizable → DirectionalContrast` |
| Analogia | AI-guided | `MappingUncertain → MappingAssessment` |
| **Harmoge** | **User-initiated** | **`SolutionSpaceUnfused → FusedSolutionSpace`** |

**What decides between the neighbors** is what is fitted to what. `/grasp` has the same skeleton with the fit reversed: it brings your understanding to a target that stays as it is, where `/fit` brings the target to what you intend. `/elicit` settles the intent itself, for when what you want is not yet clear; `/induce` names what several cases share; `/sketch` ends on one version you met and recognized; `/preview` ends on a direction taken; `/ground` settles what a comparison's evidence supports. **A target to bring to an intent you hold, with boundaries only cases can show → `/fit`.** Where `/fit` overlaps `/sketch` or `/preview` in use, the overlap is left to use to settle.

## Three Breach Conditions

| Breach | Guard |
|--------|-------|
| An abstract reading or a recommendation asked in place of a case | The next question is concrete cases with their bodies shown; an alternative design is shown as the turn it would be in a situation you know |
| The AI's reading of your answer, or a changed result, treated as your judgment | A judgment stands only on your turn and changes only by a later turn of yours; every reading names the turn it rests on |
| A reading of the target reported as what the target did | What the target did on a case is observed only on a cited return; otherwise it is the AI's reading, said as one, with what a run would need |

## Grounding

Literature the design rests on, with the strength at which each source was checked in the research run behind this protocol (*verified*: primary text read; *mostly*: core claim checked, surrounding detail synthesized):

- Mayer, M. et al. (2015). User Interaction Models for Disambiguation in Programming by Example (*UIST*) — *verified*. Asking about an input on which the candidate programs disagree, drawn from the user's own data. Decides that the next case is one whose answer would move the target.
- TiCoder — *LLM-Based Test-Driven Interactive Code Generation: User Study and Empirical Evaluation* (arXiv 2404.10100, 2024) — *verified*. Candidate code is run to choose the test to ask about; a top-ranked case can violate the reference's precondition and eliminate nothing (§VIII-D), and a wrong verdict can prune every valid candidate (§VI-A). Decides that a case is one the person would actually meet, and that an answer binds only as far as its words reach.
- Smith, E. et al. (2015). Is the cure worse than the disease? Overfitting in automated program repair (*FSE*) — *verified*. Patches that pass the tests they were repaired against fail held-out ones. Decides that an answer is carried as what it says the target should do, not as an exception for the one case, and that replay covers the gathered cases while a fresh case is a separate claim.
- Mitchell, T. (1997). *Machine Learning*. McGraw-Hill, ch. 2, version spaces — *mostly*. Checked in the text: a version space is the set of hypotheses consistent with every example given. That a new verdict never widens the set, with the candidate set and earlier verdicts held fixed, follows from that definition and was not read there. **Weakest link**: the step from "the candidates narrow" to "the person's design closes" — in real design the criterion itself can move, so progress here is read as judgments preserved, never as a falling count of open questions.

No study was found that compares this interview against a plain request for edge cases on the same task (searched: programming by example, counterexample-guided requirements elicitation, LLM requirements interviews); what the protocol adds over a plain request is an open empirical question.

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install harmoge@epistemic-protocols
```

## Usage

```
/fit [the target — a direction, a design, or an implementation — and what it is for]
```

Harmoge reads what bears on the target, shows the solution space as it stands, and asks its first cases. Each round you answer in your own words — judge a case, correct the space or the purpose, bring a case of your own — and the next round shows what your answer changed in the target and what the target now does on every case so far. It closes when you take the space shown as enough for your purpose. You can stop at any time; stopping takes nothing, and what was settled up to then stays in the conversation.

## Author

Jongwon Choi (https://github.com/jongwony)
