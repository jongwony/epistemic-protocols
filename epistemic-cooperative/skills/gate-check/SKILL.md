---
name: gate-check
description: "Advisor-checked decision gates. Freezes a drafted gate, sends its option set to an independent external advisor for a genuine / collapse / malformed verdict, records its own expectations before the answer arrives, then verifies the advisor's cited grounds against the substrate before anything reaches the user. User-invoked via /gate-check; stays armed for the rest of the session."
---

# Gate Check

An option set is normally judged by whoever drafted it. That is the one judgment the drafter cannot make well: the options inherit the frame they were drafted from, so an option set standing on the wrong axis looks complete from inside. This skill puts an independent adjudicator on the option set itself — not on the work the gate is about — and then checks the adjudicator's reasoning against the substrate before either reaches you.

The check separates two things that usually collapse into one: **who wrote the options** and **who says they are worth asking**. Everything below exists to keep those apart, including from itself.

## Caller Signature

```
/gate-check [gate?] [advisor?]

gate    : (implicit) | explicit draft   -- optional; defaults to the gate drafted in the current turn
advisor : { codex }                     -- optional; the independent adjudicator behind the
                                        --   (frozen option set, settled constraints, pointers)
                                        --   → { verdict, axis reading, cited grounds, falsifier,
                                        --      and on a collapse verdict, the option
                                        --      the set reduces to } interface
```

The advisor is a parameter, not the identity. Any adjudicator satisfying that interface can drive the check, provided it is a genuinely separate reasoner — a second pass by the drafting agent does not satisfy it, because the independence is the whole mechanism.

## Pipeline Overview

```
/gate-check [gate?] [advisor?]
  Phase 0 : screen + freeze     -- eligible gate? → freeze the option set verbatim, capture a substrate anchor
  Phase 1 : launch ∥ precommit  -- dispatch to the advisor (background), then record the expected
                                   controlling sources and verification criteria BEFORE any advisor
                                   output is visible
  Phase 2 : verify              -- collect the advisor's own words; check each cited ground against
                                   the substrate; check whether its stated falsifier is actually there
  Phase 3 : dispose             -- genuine | collapse | malformed | indeterminate | failed
  Phase 4 : synthesize          -- malformed only: rebuild the option set under the synthesis guards,
                                   then one external recheck, bounded
  present                       -- three vantage points always; ground-by-ground detail folds to one line
  observer                      -- armed for the session; every cycle converges or fails explicitly
```

## When to Use

- A gate has been drafted whose options are competing approaches, orderings, or scopes, and it is not obvious whether they are genuinely different choices
- A decision keeps feeling like a choice while every option leads to the same place
- A gate that already fired produced an answer that did not settle anything, suggesting the axis was wrong

## When NOT to Use

- The decision is already settled by something citable — say so and proceed; a check would spend a round confirming what the citation already determines
- The gate has one option; there is no set to adjudicate

## Eligibility and Exclusions

The check applies to gates that **route a reversible decision**. A decision is reversible when correcting it at the next interaction leaves no persistent state change, lost context, outward-facing commitment, or divergent downstream work.

Four kinds of gate are excluded, and each fires on its own terms regardless of any verdict the advisor would have returned:

- **Gates that measure you rather than route a decision** — comprehension checks and recognition prompts, where a single correct option is the design rather than a defect
- **Options turning on private preference** — where the deciding weight is something only you hold, an external reasoner has nothing to adjudicate against
- **Irreversible actions** — a settled direction never lowers the bar for a decision whose effects cannot be corrected at the next interaction
- **Environment-mutating actions** — the gate is the permission boundary, not a routing question

Running the check on an excluded gate is not merely wasted — a `collapse` verdict on an irreversible decision would relay away exactly the confirmation the irreversibility demands. Screen first.

Where the running environment carries its own standing policy about when gates get checked, that policy may narrow this screen further. The skill operates fully without one; no external rule file is required for correct operation.

## Phase 0: Screen + Freeze

1. **Bind the gate.** With an explicit draft argument, use it. Without one, take the gate drafted in the current turn — its question, its options, and each option's stated implication.
2. **Screen for eligibility** against the four exclusions above. An excluded gate stops here: report which exclusion applies and let the gate fire unchecked on its own terms.
3. **Freeze the option set verbatim.** The frozen text is what the advisor adjudicates and what any later comparison is made against. Rewording an option after freezing invalidates the cycle — restart it rather than patch it.
4. **Capture a substrate anchor** — the commit SHA, or the working-tree state, that both the advisor and the later verification will read. Everything downstream is evaluated against this one anchor.

## Phase 1: Launch, then Precommit

**Order matters here and is the point.** Dispatch first, record second, and never inspect partial advisor output before the record is written.

**Dispatch.** Send the advisor exactly three things:

- the frozen option set, verbatim, including each option's stated implication
- the constraints already settled by the user that the advisor cannot re-derive from the substrate — decisions made in conversation that left no trace on disk
- substrate pointers: paths, search patterns, and commands the advisor can dereference with its own tools

Ask it for four things back: a verdict (`genuine | collapse | malformed`), its reading of what axis the options actually stand on, the grounds it cites for that reading, and — stated after the rest, so it accounts for what it just said rather than shaping it — the observation that would break its own reading.

On a `collapse` verdict, ask for a fifth: which option of the frozen set the others reduce to. It is asked for rather than worked out afterwards because naming it *is* the substance of that verdict — a set said to collapse without saying what it collapses to has not been adjudicated. Leaving it to be supplied later would hand the choice back to the side whose option set is under judgment, which is the collapse of drafter and judge this skill exists to keep apart.

**Input boundary.** The dispatch never carries which option the drafting side prefers, the rationale behind the option set, or any prior disposition. An adjudicator told the preferred answer is no longer adjudicating; it is agreeing. Naming the constraint the user settled is conveyance; adding what the advisor should therefore conclude is not.

**Precommit.** While the advisor runs, record — as text that will still be there afterwards — two things:

- the **expected controlling sources**: which parts of the substrate the answer ought to turn on
- the **verification criteria**: what would have to be true of the returned grounds for them to check out

The precommit is deliberately **not** a preferred option. A recorded preference invites the later comparison to become "did we agree," which is the failure this whole ordering exists to prevent. What the precommit buys is different: it makes the question *did I converge or did I follow* answerable afterwards, which it is not once the answer has been read.

## Phase 2: Verify the Grounds

Collect the advisor's final message and carry it forward as written. Do not parse it into fields — read the verdict, the axis reading, the grounds, and the falsifier directly from its own words, and keep the full text intact for reference.

Then check it, ground by ground, against the anchored substrate:

- **Does each cited source exist, and does it say what the advisor attributed to it?** A citation pointing at a location that says something else is a failed ground even when the underlying claim turns out to be true elsewhere — the claim and its citation are checked separately, and both are reported.
- **Does the source track what it asserts?** A source that is current but coupled to nothing can silently disagree with the behavior it describes; freshness is not the same as fidelity.
- **Does the cited ground carry the axis conclusion, or only one premise inside it?** A true premise that does not reach the conclusion is the most common way a verdict looks grounded and is not.
- **Is the advisor's stated falsifier actually present in the substrate?** Present means the reading is live-contested. Absent means that particular objection does not apply — not that the reading is right.
- **Is any material premise inaccessible, ambiguous, or a matter of reading rather than fact?**

This phase is the audit vertex, and it is deliberately narrow: it checks whether the advisor represented and applied the evidence correctly. It does not re-argue the options. A second opinion from the side that drafted them is not independent evidence, and offering it as one would quietly restore the collapse the skill exists to prevent.

**Snapshot consistency.** If the substrate moved between the anchor and this verification, the cycle is indeterminate — re-run it against a fresh anchor rather than reconciling across two states.

## Phase 3: Disposition

Exactly one of these holds. They are checked in order, and the first that applies decides.

| Condition | Disposition | What happens |
|---|---|---|
| No usable answer — the advisor failed, timed out, or returned nothing readable | **failed** | Present the original gate, labeled as unchecked, with what went wrong. The cycle ends in failure; the gate still fires |
| A cited ground is missing, or says something other than what was attributed to it | **indeterminate (uncitable)** | Unfold everything; the user decides with both readings in view |
| Grounds located, but the entailment to the axis conclusion is contestable, or a material premise is interpretive | **indeterminate (audit)** | Unfold everything |
| The advisor's own stated falsifier is present in the substrate | **indeterminate (falsifier live)** | Unfold everything, naming the live falsifier |
| Grounds check out, falsifier absent, verdict `genuine` | **genuine** | Present the original gate, now checked, with the axis reading |
| Grounds check out, falsifier absent, verdict `collapse` | **collapse** | Relay: state the finding and the option it settles on, with the ground that settles it. No gate |
| Grounds check out, falsifier absent, verdict `malformed` | **malformed** | Proceed to Phase 4 |

**Silence never resolves as agreement.** An advisor that does not answer, a tool that errors, a timeout — each lands in `failed`, and `failed` presents the gate unchecked rather than presenting it as confirmed. There is no path from an absent answer to a folded conclusion.

**A failed cycle does not suspend the gate.** The originating decision still needs an answer; withholding it because the check was unavailable would let one broken external call stall every later decision. The gate fires, and the label carries the fact that it fired unchecked.

## Phase 4: Synthesis (malformed only)

A `malformed` verdict means the options stand on the wrong axis. The advisor supplies the axis relocation; the replacement option set is built here, where the live context is. That makes this a synthesis step, not a relay — it selects and composes — so it carries its own guards:

1. **Originating answer type is preserved.** Determine what kind of answer the original gate was asking for. A replacement option may make a generic option concrete while keeping that answer kind; it may not silently add, remove, or swap the kinds of answer available.
2. **A change of answer kind routes back.** If the relocated axis needs a different answer kind, or belongs to a different phase of the work, return control to wherever the original gate was constructed. Do not present the replacement as though it were a sharpening of the original.
3. **Every original option is accounted for.** Each one is retained, collapsed into another, removed as off-axis, or reframed — and each disposition names the advisor ground that licensed it. An option that quietly disappears is a deletion wearing a rewrite's clothes.
4. **No unsupported additions.** A new option derives from the relocated axis and cited substrate. An option that traces only to the drafting side's unrecorded preference is an injection, and injection is the failure mode this skill was built against.
5. **The replacement is itself checked, once, and the recheck is a full pass.** Run the same collapse test on the new set: if analysis converges on a single dominant option, it is a relay, not a gate. Then send it for **one** external recheck — bounded at one. What comes back re-enters the same ground verification and lands on exactly one disposition, the way the first answer did; a lighter second look would let the rebuilt gate reach you on a verdict that was never checked, which is the one thing no verdict here is allowed to do. A recheck that lands on `genuine` presents the rebuilt gate; one that lands on `collapse` relays the option it settles on. Any other landing — the advisor returning `malformed` again, any indeterminate disposition, or an answer that never arrives — ends the cycle here: surface the diagnosis and both attempts, and do not present a third unverified gate. Recursion here manufactures confidence rather than earning it.
6. **Provenance stays separable.** The original gate, the advisor's response, the precommit, the verification result, and the synthesized gate remain distinguishable from one another at every point. Merging them into one narrative destroys the only record that shows how the conclusion was reached.

## Presentation

**Three vantage points are always shown.** They never fold, whatever the disposition:

- the advisor's axis reading, in its own terms
- the resulting option set — the original when `genuine`, the settled option when `collapse`, the rebuilt set when `malformed`
- the axis that set stands on

These are what you read in order to decide, so they belong in front of you at the moment of deciding.

**The ground-by-ground detail folds to one line.** Something like *"nine of ten cited grounds confirmed; one citation pointed at the wrong location though its claim holds elsewhere; falsifier absent."* The full detail stays available and is produced on request. It folds because it is what you read to decide whether to *trust* the conclusion, not to reach it — a later and rarer need, and one that keeps its own place.

Two things never fold, even inside the summary line:

- **any ground that failed**, with what failed about it — a failed ground is what routes the disposition, so hiding it hides the reasoning
- **the falsifier's status** — present or absent, always stated

Folding the detail while dropping these would not be compression; it would be concealment wearing compression's shape.

**The advisor's full text is referenced, not inlined** — its path is given so it can be read directly. Inlining it would push the three vantage points below the fold, which inverts exactly the ordering above.

## Advisor Interface

The adjudicator runs as a background call and is collected on its completion notification — not polled, not slept on. This is what makes the Phase 1 ordering affordable: the precommit is written during a window that already exists.

- Write the dispatch to a per-invocation unique path; a shared path lets parallel runs overwrite each other and leaves an answer that reads complete but belongs to a different question.
- Ask for the final message to be written to its own per-invocation path, and read that file — a run summary discards the reasoning, which for an adjudication is the entire deliverable.
- Carry the substrate as pointers under a working-directory argument; the advisor re-derives what it needs with its own tools. Copy in only what leaves no trace on disk.
- Read-only access is sufficient: an adjudication reads and answers.
- Forward the collected text verbatim. Regex-extracting it into fields loses the reasoning that the verification phase is about to check.

**Record lifecycle.** The dispatch and answer files use collision-safe per-invocation paths, live for the remainder of the session, and are cleaned up no earlier than that. Cleanup never runs in the same turn the path was surfaced — a referenced path that is already gone is worse than no reference, because it reads as available.

## Session Observer

Invoking the skill arms it for the rest of the session. Two levels run independently:

- **The observer stays armed.** Once invoked, later drafted gates are candidates for checking without re-invocation.
- **Each cycle converges or fails explicitly.** A cycle ends in exactly one Phase 3 disposition, always. A failed or indeterminate cycle disarms nothing and suspends nothing.

Keeping these separate is what prevents one unavailable advisor from leaving every subsequent gate hanging: the cycle fails, the gate fires unchecked and labeled, and the observer remains armed for the next one.

## Error Handling

| Condition | Action |
|---|---|
| Advisor unavailable in the current environment | Surface what is missing and what would make it available; present the gate unchecked rather than substituting a self-check under the same name |
| Advisor times out | Report the timeout; disposition is `failed`; the gate fires unchecked and labeled |
| Answer arrives but cites nothing | Treat as `indeterminate (uncitable)` — an ungrounded verdict is not a checked verdict |
| Substrate moved between anchor and verification | Re-run against a fresh anchor; do not reconcile across two states |
| The gate turns out to be excluded after dispatch | Discard the verdict; the gate fires on its own terms |

## Rules

1. **The advisor's verdict is an input, never a ruling.** It enters the record as one reasoner's grounded reading and is checked before it reaches you. On `collapse` the answer also names which option the set reduces to, because naming it is what that verdict asserts — supplying it afterwards would return the choice to the side under judgment. Adopting any of it unchecked would replace one unaudited judgment with another and lose the independence the exchange was for.
2. **Launch before precommit, and never read partial output first.** The ordering is the mechanism. A judgment recorded after the answer is visible cannot be distinguished from the answer, and the whole question the precommit answers — did this converge or follow — becomes unanswerable.
3. **The precommit records expected controlling sources and verification criteria, not a preferred option.** A recorded preference turns the later comparison into an agreement check, which is what the ordering exists to avoid.
4. **The audit vertex checks grounds, not options.** The side that drafted the options has no independent opinion about them. Its independent contribution is whether the advisor represented and applied the evidence correctly.
5. **Silence, error, and timeout resolve as failure — never as agreement.** No absent answer produces a folded conclusion.
6. **The three vantage points always show; only the ground-by-ground detail folds.** Any failed ground and the falsifier's status stay visible inside the folded line. Detail that decides the disposition is not detail.
7. **Excluded gates fire on their own terms.** Gates measuring you, options turning on private preference, irreversible actions, and environment-mutating actions are outside the check, and no verdict changes that. A relay on an irreversible decision would remove the confirmation its irreversibility requires.
8. **The option set is frozen before dispatch, and rewording restarts the cycle.** A verdict adjudicates the text it was given; silently editing the options afterwards makes the verdict about something that no longer exists.
9. **The dispatch carries the frozen set, settled constraints, and pointers — nothing else.** Not the preferred option, not the drafting rationale, not prior dispositions. Stating a settled constraint is conveyance; appending what to conclude from it is not.
10. **Synthesis preserves the answer kind, accounts for every original option, and adds nothing unsupported.** Making a generic option concrete while keeping the answer kind is a sharpening; needing a new answer kind is a different gate and routes back to where the original was constructed. Adding options not in the original set, dropping options that were, or swapping one for another are the three ways a rebuilt gate stops being the same question — each is a defect, not a shortcut.
11. **One recheck, and it is a full pass.** The replacement's answer re-enters ground verification and lands on exactly one disposition, as the first answer did — the rebuilt gate presented on a checked `genuine`, a relay on a checked `collapse`. Every other landing ends the cycle with a surfaced diagnosis and both attempts. A third attempt would be confidence manufactured by repetition.
12. **Provenance stays separable to the end.** Original gate, advisor answer, precommit, verification result, synthesized gate — five distinct records. Merged into one account, nothing afterwards can show how the conclusion was reached, which is the only thing that distinguishes a checked gate from a confident one.
13. **Context and question stay separate.** All analysis, evidence, and verification output are text before the gate; the gate carries only the question and each option's differential implication.
14. **Plain everyday language in everything you read.** The verdict names, the axis reading, and the options are written to be recognized at a glance, not decoded.
