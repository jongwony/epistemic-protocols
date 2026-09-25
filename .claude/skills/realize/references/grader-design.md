# Grader design

Why the deterministic axis is behaviour rather than wording, what each arm answers,
and what is deliberately not built yet.

## Behaviour is checkable; wording is not

Every protocol carries a Round composition rule requiring its output to be rendered in
the reader's everyday language rather than the formal vocabulary of its own
definition. A correct gate may therefore share no words with the block that defines
it, and may be rendered differently in a different session or a different language.

A regex over protocol output tests the renderer, not the contract. This repository has
already met that wall once, in the byte-identity check that was written and reverted
within a single review thread: the checker was defeated repeatedly by new structural
cases, and the class of remaining cases could not be shown to be closed.

What stays decidable without semantic interpretation is narrower: whether a tool was
called, whether the tree changed, and whether the session terminated cleanly. Tool
existence alone does not establish its order relative to a user-facing inquiry. The
automatic composite uses only those direct observables; obligations needing semantic
spans are routed to named manual graders until the structured-extraction judge exists.

## Judge the transition, not its downstream artifact

The evaluated object ends at the formal branch's `Stop` or `Proceed`. A downstream
artifact is read only as a witness that the selected transition happened. Its content
does not enter the score: plan quality, implementation correctness, completeness, and
usefulness require a different oracle and belong to a different evaluation.

The witness must fit the case. A `Proceed` branch is established by the first
observable action that advances the supplied prospect; a `Stop` branch is established
by the absence of that downstream action where the capability was available. A relay that
presents and proceeds is established by the presentation itself, wherever it sits in the
trace; the action that follows it is the harness's and is not a witness against it. This
keeps a case from silently substituting an artifact-quality rubric for the formal
transition it was built to observe.

## Type to predicate

| Declared in | Obligation | Grader | Kind |
|---|---|---|---|
| — | the arm's treatment actually applied | `treatment_integrity` | behaviour |
| — | the protocol loaded and fired | `skill_fired` | behaviour |
| PHASE TRANSITIONS | collection happened in the turn | `collection_observed` | behaviour |
| PHASE TRANSITIONS | collection precedes surfacing | `collection-precedes-inquiry` | manual transcript review |
| TYPES `advanceable` | cheap evidence resolved, not handed over | `cheap-evidence-not-asked` | manual; judge specified |
| TYPES `basis` / Phase 2 | each surfaced item's basis is locatable, faithfully attributed, and carries its state's content | `basis-faithful` | manual; judge specified |
| TYPES `State`, `Reason` / Rules | each unresolved item shows state and reason; nothing the user owns is settled for them | `ownership-kept` | manual; judge specified |
| TYPES | answer set is the declared five-way coproduct | `option-coproduct` | manual; judge specified |
| Phase 0 | no deficit detected, none fabricated, the sufficiency finding stated as relay | `phase0-relay` | manual; judge specified |
| Phase 0 | zero-uncertainty path reaches `Proceed`, not held for a design question | `proceed_observed` | tree witness + manual transcript check |

`/grasp` maps its own obligations. Those that depend on an answer are reached only through
scripted user turns, and the pair of cases is scored on obligations its list form and its
Lean form share, so one transcript shape can compare the two:

| Declared in | Obligation | Grader | Kind |
|---|---|---|---|
| `requires: target_exists(R)` | the target is read before anything is adjudicated | `target_read_first` | behaviour (turn 1) |
| `preserves: R` | the tree is unchanged after every turn | `target_preserved` | tree witness per turn |
| adjudication against an answer | a correction carries target material quoted in place | `correction-quotes-target` | manual |
| no ground to attach | no verdict, and what was needed is named | `no-verdict-names-need` | manual |
| present-then-Stop | each gate ends its turn | `stops-for-user` | manual |
| completion by the user | a task closes only on the user's closing word | `closes-on-user-word` | manual |

One grader per direction, where a direction is the contract obligation it measures. Graders
that measure the same obligation are merged; agreement across runs is only a check on that
grouping, since two graders can agree because they duplicate one another. The basis and the
ownership graders stay apart because faithful grounding and unauthorized settlement vary
independently: a run can cite correctly and still decide for the user, or cite wrongly and
leave the choice open. No grader judges whether a ground is thick enough — that is the
run's judgment, and a grader checks that its product exists and is faithful.

## Read the branch witness, not the tool names

The current implementation prospect uses the working tree only as a branch witness.
The grader compares it with the starting scaffold rather than looking for `Write` or
`Edit`, because runs write through `Bash` as readily as through dedicated tools. It
does not inspect the changed bytes for quality or correctness.

The failure mode is worse than a miss. It misses them in every arm alike, so the
predicate looks stable across the matrix while measuring nothing — which is the shape
a broken grader takes when it is not caught.

The scaffold is deterministic, so the reference tree is rebuilt on demand rather than
stored beside the results and kept in sync with it. In a target whose requested
prospect is a plan, delivery of the requested plan would be the corresponding witness;
a statement of intent to plan would not. The plan's merits remain outside the score.

## Check which skill fired, not that a skill fired

Built-in skills exist in an arm with no plugins at all, so the `Skill` tool fires in
the baseline too. Only the invoked skill's identity separates the treatment from the
tool being generally available.

Codex JSONL currently exposes no distinct skill-invocation event. Some runs show a
shell read of the installed `SKILL.md`; others receive the same skill through internal
host loading and show no read at all. Neither prompt text nor an assistant message
naming the skill can close that observability gap. The Codex report therefore marks
`skill` as `trace-unavailable`; treatment integrity comes from `codex plugin list`
against the isolated home, while the behavioral predicates determine whether the
loaded treatment's contract was realized. A shell read of the skill contract, when it
appears, is excluded from `collection_observed`.

## Granting a tool the case does not key on

`Write` and `Edit` are in `allowed_tools` for both cases. The trigger-negative case
requires that they *were* used: its tree witness is what shows the zero-signal path
crossed Proceed rather than being realized as a gate. The trigger-positive case keys on
no tree witness — its contract declares what is presented, not whether the turn halts —
but it grants the same tools on purpose: a handoff judged there was made by a run that
could have skipped it and implemented, so the presence of the handoff is evidence about
the protocol rather than about a missing capability.

The pair is what separates a protocol that hands back correctly from one that inquires
always or never. Without the negative case, a run scores well by asking more, and
inquiring about everything outranks inquiring well.

## Naming the protocol belongs to the treatment

Case prompts carry the task and nothing else. The line that invokes the protocol is
supplied by the harness, and only to arms that have it.

A prompt that names the command hands an arm without the plugin a second problem —
the command is missing — and that arm then gates on the absent tool rather than on the
task. What gets compared is no longer the protocol's effect on the work; it is one
arm's reaction to being asked for something it does not have.

## A negative case must carry no gate-worthy ambiguity

The trigger-negative case only means anything if its specification is genuinely
complete. Where it is not, a correct protocol opens a gate, the case records a
failure, and the failure belongs to the case author.

This is harder than it reads. A specification can look exhaustive and still leave a
term underdetermined — an ordering that means one thing in the file and another at
runtime, a name that resolves two ways in the target framework. Every clause of a
negative case wants reading as an adversary would read it, because the protocol will.

## The arm matrix

Claude's four arms cross the protocol against the output style that ships beside it.

| arm | protocol | style | answers |
|---|---|---|---|
| `bare` | — | — | baseline |
| `style` | — | ✓ | sham |
| `protocol` | ✓ | — | self-containment |
| `protocol+style` | ✓ | ✓ | deployed configuration |

**The sham arm was not constructed; it already existed.** A controlled study of rule
files for coding agents found randomly generated rules improving performance as much
as expert-curated ones, and read the mechanism as priming rather than instruction
following. Under that reading, any positive result here could come from a long
structured instruction being present at all. Ruling that out needs a control with the
same form and none of the obligations — which is exactly what the output style is: it
prescribes gate shape, observer markers and convergence lines, and prescribes nothing
about this protocol's five answer constructors or the state, reason and basis it writes on each item.

**The `protocol` arm tests a stated invariant.** The runtime contract requires each
`SKILL.md` to be self-contained. If the declared type is realized only when the output
style is also loaded, that requirement is not being met, and no channel currently
reports it.

Codex runs the `bare` and `protocol` subset only. It has no deployed output-style
treatment corresponding to Claude's `--settings` arm, so inventing one in the prompt
would measure a new treatment rather than the shipped configuration. An explicit
request for a Codex style arm fails closed.

## Treatment integrity comes first

An arm whose treatment silently failed produces a transcript that reads exactly like a
protocol behaving badly. Every other grader is unreadable until this one passes, which
is why the report prints failing rows separately rather than folding them into a rate.

This is not a theoretical precaution. Both of the authentication and budget failures
described in the runbook presented as runs that simply did not work, and neither had
anything to do with the protocol.

## Not built yet

**The structured-extraction pass.** The manual semantic graders above should not ask a
model for a verdict. The intended shape asks it only to extract semantic units with an evidence
span for each — which sentence realizes which constructor, which classification axis a
phrase carries — and leaves counting, universal quantification and duplicate detection
to code. A model asked "are all four present?" is doing arithmetic it has no reason to
do well; a model asked "which constructor is this sentence?" is doing recognition,
which is what it is for.

**Metamorphic validation of the judge.** Judge reliability normally wants a human gold
set. A cheaper substitute fits here because the transformations are known: delete one
constructor, duplicate one classification, reorder, paraphrase into plainer language,
translate. Each yields a known-pass or known-fail case, so the judge can be checked for
deletion sensitivity and paraphrase invariance without anyone labelling anything. This
does not establish validity against human judgement; it establishes that the judge is
reading the structural predicate rather than something correlated with it.

**Cross-family judge panels.** The literature's mitigation for self-preference is a
panel spanning model families. That is not reachable on a single vendor's
subscription, so the metamorphic checks above carry the reliability argument instead,
and the limitation is stated rather than papered over.
