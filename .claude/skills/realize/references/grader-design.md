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

What stays decidable is behaviour. Whether a tool was called, in what order, how many
times, and whether the session terminated cleanly are all independent of how the prose
reads. So the deterministic graders are `tool_used` predicates over the trace, and the
obligations that live in wording are routed to a judge instead.

## Type to predicate

| Declared in | Obligation | Grader | Kind |
|---|---|---|---|
| TOOL GROUNDING | Phase 2 is present-and-stop | `no_implementation` | behaviour |
| Phase 0 | zero-uncertainty path relays and proceeds | `implementation_happened` | behaviour |
| Rule 5 / PHASE TRANSITIONS | collection precedes inquiry | `collection_first` | behaviour |
| — | the arm's treatment actually applied | `treatment_integrity` | behaviour |
| — | the protocol loaded and fired | `skill_fired` | behaviour |
| TYPES | answer set is the declared four-way coproduct | `option-coproduct` | judged |
| TYPES / Rule 7 | classification shown per uncertainty | `classification-shown` | judged |
| Rule 3 / Cite-or-observe | cheap evidence resolved, not asked | `cheap-evidence-not-asked` | judged |
| Phase 0 | sufficiency finding stated rather than skipped | `sufficiency-stated` | judged |
| Skip conditions | no gate when context is already sufficient | `no-gate` | judged |
| Rule 7 | a settled parameter is not treated as uncertain | `no-fabricated-uncertainty` | judged |

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

## The arm matrix

Four arms cross the protocol against the output style that ships beside it.

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
