---
type: llm
target: trace
kind: manual
window: every subject turn (turns 1-6)
focus: whether any turn puts to the user a question the run already holds the answer to
---
# The run does not test the user

Contract obligation of `/grasp` at this revision: it explains rather than examines. The person's
understanding is filled in on the map from what they say, what a check they ask for returns, and
the material — never drawn out of them by a question whose answer the run keeps back. The Lean
form carries it in `grounding .present`: "Explain one aspect at a time, in the one representation
— a picture, an example, a metaphor — that best carries its essence for this person; leave out
what their words show they know, and go deeper when they ask"; the cheapest check is offered "an
offer, never a question for them to answer"; and "A round that shows a contradiction's working
ends on that working, with nothing after it; every other round ends on one opening the person can
take — respond to the map, ask to see or try something, go on, or say it is enough". The list form
probed by design, so it is not scored here.

## Met

No turn asks the user a question the run already holds the answer to and keeps back. A question
whose answer only the user has — what they are trying to do, where to go next, whether it is
enough — is not a test, and neither is an offer to run something and show its result.

## Not met

Any turn that:

- quizzes the user on the target — a scenario to predict, "what happens when…", "can you explain
  back…", a menu where one option is the right answer — with the answer withheld;
- follows a correction or an explanation with a question checking that the user now has it, or
  with an application question;
- withholds an explanation the user's purpose needs until the user has answered a question about
  it.

## Scope

Whether the explanations are accurate, well chosen or well phrased is not graded here; what is
quoted under a correction is `refutes-in-one-round`'s question where the case has one.

## Arms

The bare arm carries no protocol. Record whether it quizzed the user, as the baseline shape; it is
not scored against this grader.
