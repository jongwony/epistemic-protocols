# Katalepsis and Learning Opportunities Grounding

This note grounds `learning-opportunities` against Katalepsis and records the
modification judgment from the May 2026 Tavily-backed research pass.

## Local Substrate

`learning-opportunities` is a deliberate skill-development plugin for
AI-assisted coding. Its core posture is that fast, fluent AI work can suppress
active generation, retrieval, spacing, and metacognitive monitoring. Its skill
therefore asks before starting a short exercise, then stops at a prompt so the
user must generate a prediction, explanation, trace, or teach-back before the
assistant supplies the answer.

Katalepsis is narrower. Its runtime contract is:

```text
ResultUngrasped → VerifiedUnderstanding
```

The morphism acts on the user's understanding of an existing AI result. In v1,
it categorized the result, let the user choose entry points, and verified
comprehension through Socratic probes and coverage checks. The v2 UX change
moves category extraction behind an intent-scented entry point, but keeps this
same endpoint and invariant: `Comprehension over Explanation`, not skill
development over time.

## Structural Grounding

The strongest correspondence is not "Katalepsis should become a learning
exercise." The stronger correspondence is:

| Learning Opportunities | Katalepsis | Grounding |
| --- | --- | --- |
| Pause for input | Constitution question | User generation is required before AI explanation proceeds. |
| Prediction / generation | Socratic probe answer | The user produces an answer that reveals their current model. |
| Retrieval practice | Verification loop | The user demonstrates grasp rather than passively receiving summary. |
| Metacognitive monitoring | Gap detection and coverage check | The protocol makes "do I actually understand this?" explicit. |
| Spacing / durable practice | Out of scope | Longitudinal skill formation needs repeated practice beyond one result. |

This means Learning Opportunities validates Katalepsis' interaction shape, but
does not justify widening Katalepsis' endpoint into general learning transfer.

## Research Findings

The external research pass supports four claims.

1. Generation and retrieval improve learning relative to passive exposure. This
   backs Katalepsis' question-first posture and argues against replacing probes
   with explanation.
2. Pretesting before seeking the answer can improve later learning even when the
   learner's first attempt is wrong. This backs the "attempt first" discipline
   already present in Katalepsis.
3. GenAI work imposes metacognitive demands: users must monitor goals, evaluate
   output, decide when to rely on it, and control workflow strategy. This backs
   Katalepsis as a metacognitive checkpoint after AI work.
4. Transfer from testing exists but is moderated by task similarity, initial
   accuracy, elaboration, feedback, and repeated practice. That makes durable
   transfer too broad for Katalepsis' immediate convergence condition.

Stoic grounding points in the same direction. `katalêpsis` names a firm grasp
or cognition tied to a cognitive impression; stronger knowledge requires a more
stable system of cognitions. The protocol maps to the first structure: verified
grasp of this result. It should not claim the second structure: durable
expertise across future contexts.

## Modification Judgment From Learning-Science Evidence Alone

Learning-science evidence alone does not warrant widening Katalepsis' endpoint
or turning it into a durable practice protocol.

Keep:

- `ResultUngrasped → VerifiedUnderstanding`
- user-initiated activation
- `Comprehension over Explanation`
- Socratic verification before explanation
- proposal ejection for improvement ideas that arise during verification

Do not add:

- spacing schedules
- repeated retrieval sessions
- general skill-development exercises
- a mandatory transfer endpoint

A minimal future runtime clarification would be defensible only if accumulated
use shows confusion at the boundary. The clarification should say that a
near-transfer or "apply this to a nearby case" probe is allowed when it verifies
the user's grasp of the current AI result. It should not redefine
`VerifiedUnderstanding` as long-term skill mastery.

## Placement

The durable philosophical grounding belongs in `docs/philosophical-anchors.md`.
Runtime Katalepsis does not need a version bump merely because of this
learning-science boundary. The separate v2 intent-scented entry point change is
justified by UX/information-scent evidence and does change `SKILL.md`, so it
does require a version bump. Learning exercises remain better placed in
`learning-opportunities`, `/onboard`, or a future composed utility that
deliberately targets durable practice.

## Sources

- Stanford Encyclopedia of Philosophy, "Stoicism": https://plato.stanford.edu/entries/stoicism/
- Bertsch, S., Pesta, B. J., Wiscott, R., & McDaniel, M. A. (2007). The generation effect: A meta-analytic review. https://pubmed.ncbi.nlm.nih.gov/17645161/
- Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning. https://pubmed.ncbi.nlm.nih.gov/16507066/
- Richland, L. E., Kornell, N., & Kao, L. S. (2009). The pretesting effect. https://pubmed.ncbi.nlm.nih.gov/19751074/
- Giebl, S., Mena, S., Storm, B. C., Bjork, E. L., & Bjork, R. A. (2021). Answer First or Google First? https://doi.org/10.1177/1475725720961593
- Pan, S. C., & Rickard, T. C. (2018). Transfer of test-enhanced learning. https://pubmed.ncbi.nlm.nih.gov/29733621/
- Tankelevitch, L., Kewenig, V., Simkute, A., Scott, A. E., Sarkar, A., Sellen, A., & Rintel, S. (2024). The metacognitive demands and opportunities of generative AI. https://advait.org/files/tankelevitch_2024_GenAI_metacognition.pdf
- Buçinca, Z., Malaya, M. B., & Gajos, K. Z. (2021). To trust or to think. https://www.eecs.harvard.edu/~kgajos/papers/2021/bucinca21trust.pdf
