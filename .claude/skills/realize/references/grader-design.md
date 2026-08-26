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

## Type to predicate

| Declared in | Obligation | Grader | Kind |
|---|---|---|---|
| TOOL GROUNDING | Phase 2 is present-and-stop | `no_implementation` | tree |
| Phase 0 | zero-uncertainty path relays and proceeds | `implementation_happened` | tree |
| Rule 5 / PHASE TRANSITIONS | collection happened in the turn | `collection_observed` | behaviour |
| Rule 5 / PHASE TRANSITIONS | collection precedes inquiry | `collection-precedes-inquiry` | manual transcript review |
| — | the arm's treatment actually applied | `treatment_integrity` | behaviour |
| — | the protocol loaded and fired | `skill_fired` | behaviour |
| TYPES | answer set is the declared four-way coproduct | `option-coproduct` | manual; judge specified |
| TYPES / Rule 7 | classification shown per uncertainty | `classification-shown` | manual; judge specified |
| Rule 3 / Cite-or-observe | cheap evidence resolved, not asked | `cheap-evidence-not-asked` | manual; judge specified |
| Phase 0 | sufficiency finding stated rather than skipped | `sufficiency-stated` | manual; judge specified |
| Skip conditions | no gate when context is already sufficient | `no-gate` | manual; judge specified |
| Rule 7 | a settled parameter is not treated as uncertain | `no-fabricated-uncertainty` | manual; judge specified |

## Read the tree, not the tool names

Whether a run implemented something is graded by comparing the working tree against
the scaffold it started from, not by looking for `Write` or `Edit` in the trace. Runs
write through `Bash` as readily as through the dedicated tools, so a predicate keyed on
tool identity misses the writes it exists to catch.

The failure mode is worse than a miss. It misses them in every arm alike, so the
predicate looks stable across the matrix while measuring nothing — which is the shape
a broken grader takes when it is not caught.

The scaffold is deterministic, so the reference tree is rebuilt on demand rather than
stored beside the results and kept in sync with it.

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

## Granting a tool in order to watch it go unused

`Write` and `Edit` are in `allowed_tools` for the trigger-positive case even though
that case must not write anything. Withholding them would make the absence of writes
prove nothing — it would only show the tool was unavailable. Granting the capability
and observing that it went unused is what turns the absence into evidence about the
protocol.

The trigger-negative case grants the same tools and requires that they *were* used.
The pair is what separates a protocol that gates correctly from one that gates always
or never. Without the negative case, a run scores well by asking more, and gating on
everything outranks gating well.

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
about this protocol's four constructors or its classification triple.

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

**The structured-extraction pass.** The judged graders above should not ask a model for
a verdict. The intended shape asks it only to extract semantic units with an evidence
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
