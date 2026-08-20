# Specification and Judgment

This document covers the boundary inside a specification between the steps whose result it fixes and the steps whose result it cannot fix: which side a step belongs on, what a type layer is doing on the side it cannot fix, and the failure that follows from treating the second kind as the first. Where the criterion at stake is one that accumulated context and the person's own utterance supply, `recognition-and-authority.md` states why it stays open to runtime; this document covers what the specification does about it.

## Determinate and Indeterminate Steps (Architectural)

A specification governs steps of two kinds, and what separates them is not difficulty.

A **determinate** step has a result the specification fixes: given the inputs, the outcome follows, and two readers who follow the procedure land in the same place. Such a step is programmed. The specification states the procedure, and completeness there means every input has a stated outcome.

An **indeterminate** step has a result that no procedure yields. Judging that two things are the same, that a claim is warranted, that a reading fits the situation in front of it — these turn on meaning, and meaning is not settled by comparison. Such a step is typed and instructed instead: the specification fixes what the judgment ranges over and what it is taken from, and says what to judge. It does not state what the judgment comes out as, because nothing it could write would produce that.

The two are not ends of one scale, and an indeterminate step does not become determinate as the system performing it improves. A better judge judges better; it does not turn the judgment into a computation. What improvement changes is how much can be entrusted to the indeterminate side — which is a reason to keep that side open rather than a reason to expect it to close.

## What a Type Layer Does on the Indeterminate Side (Architectural)

On the determinate side a type is a guarantee: it says what a value is, and the procedure downstream may rely on that. On the indeterminate side it cannot be that, because nothing downstream is entitled to rely on the judgment being right. It may still route on which form the answer took — that form is what the specification fixed, and it is not the judgment. What it is instead is a narrowing.

Typing an indeterminate step means cutting down what the judgment looks at and giving that material structure — one claim to a unit rather than several bundled together, each piece of evidence on a named channel rather than run together as undifferentiated text, a positive statement rather than a negation, and whatever every unit restates identically left out, because what does not vary carries no signal.

That is the whole of the contribution, and it is worth making: it raises the odds the judgment lands right without pretending to make it. The distinction is between shaping a judgment's input and supplying its output.

A type layer doing this well is recognizable by what it does not contain — no comparison operator standing in for the judgment, no stated default for the case where it does not resolve. What it contains is the narrowed carrier and the instruction to judge.

## Cases in Place of a Judgment (Architectural)

A specification that treats an indeterminate step as determinate does not fail at once. It fails by growing.

The step is written as a comparison. The comparison turns out not to settle the question, so a case is added for when it does not settle it. That case creates a state the surrounding structure did not anticipate, so an invariant is added to exclude the state. The invariant cannot hold over a judgment, so a rule is added for when it lapses. Every addition is locally reasonable and answers a real question raised by the addition before it, and the sequence has no stopping point, because the question they are all circling — what does this judgment come out as — was never the specification's to answer.

Two signals mark this while it is happening. The first is that the additions are consequences of each other rather than of the subject: each question being answered did not exist until the previous answer was written. The second is size. A revision that opens a coordinate should shrink the text around it, because what closed it is being removed; a revision that opens a coordinate and grows has not opened it, it has built a fence around the opening.

The repair is subtraction rather than another case. Remove what answers on the judgment's behalf, keep the narrowing, and state the instruction: judge this. A reader capable of the judgment needs nothing further, and a reader who is not capable of it is not rescued by a case split.
