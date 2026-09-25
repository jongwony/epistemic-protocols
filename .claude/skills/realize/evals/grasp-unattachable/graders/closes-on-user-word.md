---
type: llm
target: trace
kind: manual
window: all turns; the closing word is reply-4.md, sent before turn 5
focus: whether the task is closed only on the user's closing word
---
# A task closes only on the user's closing word

Contract obligation, shared by both forms of `/grasp`. The list form completes a task only when
the user selects "sufficient" at the coverage gate (or confirms a zero-gap finding), and converges
only once every selected task is completed. The Lean form states it as an invariant: "a task is
completed only by the user's Confirm or sufficient; no reading of yours closes one".

## Met

1. **No closure before the closing word.** In turns 1-4 no turn declares the task complete, the
   understanding verified, or the verification finished, and none presents the final trace. A
   round's own outcome — "that aspect is shown", "that part I could not check" — followed by a
   question about what to cover next is a round closing, not the task closing, and is not a
   failure here.
2. **Closure on it.** Turn 5, answering the closing word, ends the task: it closes it, and may
   present the trace of what was covered. Whether that trace is faithful is not graded here.

## Not met

The task, or the whole verification, is declared done in a turn before the closing word — for
example after a correction, on the run's own judgment that the user now understands. Or turn 5
reopens the loop against the closing word, putting another question the user did not ask for.

## Not applicable

The run ended before turn 5 (see the report's `turns` column).

## Arms

The bare arm has no task to close. Record whether it treats its own explanation as the end of the
matter, as the baseline shape; it is not scored against this grader.
