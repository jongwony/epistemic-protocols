# /fit — Harmoge (ἁρμογή)
<a name="harmoge--fit-ἁρμογή"></a>

> [한국어](./README_ko.md)

## What is /fit?

### Definition
<a name="what-is-harmoge"></a>

Harmoge (ἁρμογή) means fitting together or joining parts into a whole. It is a protocol where the AI interviews you through concrete cases to bring a direction, design, or implementation to what you intend, carrying each answer into the target and replaying every case gathered so far.

### The problem
<a name="the-core-problem"></a>

You know what you want, and a direction, design, or implementation already stands in front of you (or is about to be made), yet no general description tells you where it stops matching what you intend. A rule sounds fine until one concrete message arrives that it handles in a way you would never accept, or two readings of a clause both sound reasonable until one real event sits between them. Reach for `/fit` when the boundaries of your design only show up against concrete cases.

### The result

When the solution space shown in a round is enough for your purpose, you take it — and a later turn of yours can still revise a judgment or replace that taking. If your acceptance rests on an assumption that conflicts with evidence or goes against your stated goal, and no round has yet shown you what follows, the AI keeps the acceptance open and shows that consequence as the next concrete case; once you have seen it, you decide whether to take the space with that trade-off. You finish with the solution space as it stands: the cases you settled, the trade-offs you accepted, the boundaries still open, the target updated to match, and what the target does on every case gathered along the way.

## Install
<a name="install"></a>

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install harmoge@epistemic-protocols
```

## Usage
<a name="usage"></a>
<a name="the-solution"></a>

```
/fit [the target — a direction, a design, or an implementation — and what it is for]
```

The AI reads what bears on your target, shows the solution space as it now stands — what fits best so far, the alternatives and trade-offs, and the boundaries still open — and asks you to judge concrete cases with their actual content shown, starting with the most consequential one.

You answer in your own words: required, permitted, ruled out, "I don't know", or a reason or example of your own. Each round, the AI shows what it read from your last answer (citing which turn or tool output it rests on), carries your answer into the target, and replays every case gathered so far so you can see if a new change quietly broke an earlier judgment. Where nothing can be executed directly (such as a prose design or a direction), the AI marks the outcome as its reading of the target rather than an observed run. You can stop at any time; what was settled stays in the conversation and what was already carried into the target is not undone.

<details>
<summary>Comparison with other protocols</summary>

**Harmoge** (ἁρμογή, fitting together / joining of parts into a whole) fuses an unfused solution space with your intent through concrete cases. The record of the space also carries the premises the alternatives turn on and the domain of the space alongside the settled cases, trade-offs, open boundaries, and the target's behavior on each case.

<a name="difference-from-other-protocols"></a>
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

**What decides between the neighbors** is what is fitted to what. `/grasp` reverses the fit: it brings your understanding to a target that stays as it is, where `/fit` brings the target to what you intend. `/elicit` settles the intent itself when what you want is not yet clear; `/induce` names what several cases share; `/sketch` ends on one version you met and recognized; `/preview` ends on a direction taken; `/ground` settles what a comparison's evidence supports. **A target to bring to an intent you hold, with boundaries only cases can show → `/fit`.**

</details>

<details>
<summary>Breach conditions and literature grounding</summary>

<a name="three-breach-conditions"></a>
### Three Breach Conditions

| Breach | Guard |
|--------|-------|
| An abstract reading or a recommendation asked in place of a case | The next question is concrete cases with their bodies shown; an alternative design is shown as the turn it would be in a situation you know |
| The AI's reading of your answer, or a changed result, treated as your judgment | A judgment stands only on your turn and changes only by a later turn of yours; every reading names the turn it rests on |
| A reading of the target reported as what the target did | What the target did on a case is observed only on a cited return; otherwise it is the AI's reading, said as one, with what a run would need |

<a name="grounding"></a>
### Grounding

Literature the design rests on, with the strength at which each source was checked in the research run behind this protocol (*verified*: primary text read; *mostly*: core claim checked, surrounding detail synthesized):

- Mayer, M. et al. (2015). User Interaction Models for Disambiguation in Programming by Example (*UIST*) — *verified*. Asking about an input on which the candidate programs disagree, drawn from the user's own data. Decides that the next case is one whose answer would move the target.
- TiCoder — *LLM-Based Test-Driven Interactive Code Generation: User Study and Empirical Evaluation* (arXiv 2404.10100, 2024) — *verified*. Candidate code is run to choose the test to ask about; a top-ranked case can violate the reference's precondition and eliminate nothing (§VIII-D), and a wrong verdict can prune every valid candidate (§VI-A). Decides that a case is one the person would actually meet, and that an answer binds only as far as its words reach.
- Smith, E. et al. (2015). Is the cure worse than the disease? Overfitting in automated program repair (*FSE*) — *verified*. Patches that pass the tests they were repaired against fail held-out ones. Decides that an answer is carried as what it says the target should do, not as an exception for the one case, and that replay covers the gathered cases while a fresh case is a separate claim.
- Mitchell, T. (1997). *Machine Learning*. McGraw-Hill, ch. 2, version spaces — *mostly*. Checked in the text: a version space is the set of hypotheses consistent with every example given. That a new verdict never widens the set, with the candidate set and earlier verdicts held fixed, follows from that definition and was not read there. **Weakest link**: the step from "the candidates narrow" to "the person's design closes" — in real design the criterion itself can move, so progress here is read as judgments preserved, never as a falling count of open questions.

No study was found that compares this interview against a plain request for edge cases on the same task (searched: programming by example, counterexample-guided requirements elicitation, LLM requirements interviews); what the protocol adds over a plain request is an open empirical question.

</details>

## Author
<a name="author"></a>

Jongwon Choi (https://github.com/jongwony)
