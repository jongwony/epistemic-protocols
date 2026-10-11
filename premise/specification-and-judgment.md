# Specification and Judgment

Use this document to distinguish what a specification determines from what it leaves to judgment. `recognition-and-authority.md` supplies the live-ground and authority constraints.

## Determinate and Indeterminate Steps (Architectural)

A **determinate** step has an outcome fixed by the specification for its inputs. State the procedure and its outcomes, including failure cases within the declared input domain.

An **indeterminate** step requires judgment the specification does not settle. State its subject, relevant evidence, and required output form without writing in its answer. This is a boundary of the contract under examination, not a claim that no possible procedure could ever address the question.

Assess determinacy against that contract and its ground, rather than the difficulty of a case or the capability of the reader. Better performance does not by itself establish that a formerly open judgment is now fixed.

## What a Type Layer Does on the Indeterminate Side (Architectural)

A type can constrain the form a judgment takes and the material it ranges over. Downstream handling can rely on those declared forms; it cannot infer semantic correctness merely from their being inhabited.

Narrow the carrier only as far as the obligation requires. Preserve independently necessary distinctions, including a constant value when holding it fixed is itself the invariant. Remove repeated content that carries no independent obligation.

Keep the substantive answer runtime-bound. An explicit withdrawal, deferral, or inability-to-assess path may preserve state or termination obligations without deciding the judgment on the user's behalf.

## Cases in Place of a Judgment (Architectural)

Inspect a growing chain of cases when each answers a problem created by the preceding addition rather than by the original subject. Determine whether the first step tried to compute what the contract leaves to judgment.

Repair that error by removing the surrogate answer and its dependent machinery. Retain the subject, evidence, narrowed carrier, and independently required state or termination handling. Instruct the reader to judge; if the needed capability or evidence is absent, preserve that limitation rather than simulating a result.
