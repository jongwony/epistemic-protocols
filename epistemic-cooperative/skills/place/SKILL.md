---
name: place
description: "Use when asked \"where does this belong\", \"audit this instruction file\", \"why does this keep growing\", or invokes /place. Read-only audit routing each clause of LLM-facing prose to a destination."
user_invocable: true
allowed-tools: Read, Grep, Glob
---

# Placement Audit

A read-only audit of LLM-facing instruction prose that answers one question per clause: **where does this belong?** Every routing unit receives a destination, whether or not it bears a decision, and a pass that did not reach every unit reports that instead of reading as a finished audit. The audit emits routes; the human author applies them.

## Purpose

Instruction surfaces accumulate. The usual review asks whether a file is too long and answers by cutting, which loses the operative clauses buried inside rationale — a threshold, a condition, a named action, sitting in the middle of a paragraph that exists to explain something else. Routing preserves them: content that leaves a surface arrives somewhere, and the clause that has to keep binding behavior is rewritten to stand on its own before the paragraph around it moves.

The audit also takes up two judgments that were previously made separately — whether a mention holds attention on something the instruction is trying to avoid, and whether an example anchors the model to one instance. They enter on different footings. Which kind an example is argues for a destination, so that judgment is a placement question and an example is decided by which surface it belongs on. Whether a prohibition should be restated positively is not: it changes how the clause is written wherever it lands, and the destination steps settle placement without it.

## Inputs

**Manual invocation only** (interactive `/place`):
- The caller passes target file paths or a glob; with no argument, the audit enumerates the in-scope set under the working tree.
- Files are read at their working-tree state — the post-edit, pre-commit content the author is about to ship.

## Host bindings

The method is portable; the destinations it routes to are project-specific. The host project declares:

| Binding | What the host declares |
|---|---|
| Ledger | Where a then-record lives — commit messages, pull-request bodies, an issue tracker, a decision log |
| Enforcement | Where a mechanically checkable constraint lives — validators, hooks, permission gates, schemas, CI checks |
| Load tiers | Which of the host's files sit at each tier below |

Where the host has not declared a binding, emit the route with an unresolved binding rather than inventing a path. A route naming a destination the host has not bound is still a correct route; a route naming a path the audit invented is a fabrication.

## Scope

**In scope** — prose that a model reads as instruction: project instruction files, rule files, skill instruction files and their frontmatter, agent system prompts, output styles, and the reference material those files point to.

**Fenced blocks are inspected by role, not excluded.** A fenced block carries one of the kinds in the example taxonomy below — most often a contract specimen or one of the two demonstration kinds — and the taxonomy is the reason to look at it. A block that fully specifies a contract belongs where the contract is active and generally stays; a block that walks through a sampled procedure is a demonstration and routes on demand. Source code that is the delivered artifact rather than an instruction is out of scope.

**Out of scope** — prose written for a human reader (project READMEs, design notes, published documentation), where an example serves comprehension and the load-tier argument does not apply.

## The destinations

Five, and a route carries one of them or records that none fits, never two. Enforcement is not among them: a mechanical guard and a runtime sentence act at different moments on the same constraint, so enforcement is a second axis every route carries alongside its destination (see Enforcement candidacy).

| Destination | Admission criterion |
|---|---|
| **Tier 0 — standing surface** | Loaded on every turn: project instruction files, rule files, and skill frontmatter descriptions. Admitted when the clause changes what the model does on an arbitrary turn, or determines which surface to load in a situation the model must recognize before loading anything. |
| **Tier 1 — invocation surface** | Loaded when its skill is triggered: the body of a skill instruction file. Admitted when the clause binds behavior for the duration of that skill's work. Being on demand does not make size free — a triggered body arrives whole. |
| **Tier 2 — on-demand surface** | Opened deliberately: reference material a surface points to. Admitted when the clause is needed while performing one specific sub-task, and reading it at any other time costs attention without changing an action. |
| **Ledger** | Admitted on positive record value: rationale, provenance, a trade-off, a rejected alternative, or an epistemic status that a future reader needs to reconstruct why the surface says what it says. |
| **Delete** | Admitted when no operative, routing, diagnostic, or record value remains **on this surface** after residue extraction. Content that is accurate but owned by a surface this project does not maintain routes here too, with the owner named. |

The three tiers are ordered by when they load, and their criteria overlap by construction: a clause needed on an arbitrary turn is also needed during a skill's work, and a clause binding that work may be wanted only inside one of its sub-tasks. A clause routes to the earliest-loading tier its need requires, and a later tier is admissible only where the clause is not needed before that tier loads. The Tier 1 / Tier 2 boundary is where that test bites hardest: an on-demand surface is reached by a pointer, so a clause the model must recognize before it could know to reach for the reference is needed before Tier 2 loads and stays at Tier 1, while a clause a pointer reaches at the moment of need routes to Tier 2.

Absence of runtime relevance does not by itself admit a clause to the ledger. Without a positive record test the ledger becomes the place everything goes, and Delete stops firing.

Delete is scoped to the surface under audit, not to the content's worth. A fact that belongs in another tool's documentation leaves this surface and keeps its value elsewhere; the route records where.

Where a clause's home is a surface none of the five names, the destination is unresolved and what the route describes in its place is the surface the clause wants.

## Unit of judgment

- **Scan unit** — the smallest complete thing the surface states, read one at a time. In prose that is the sentence; where the surface instructs in a form that states things without sentences, it is what that form states one complete thing in. Scope admits such forms by role rather than excluding them, so a scan reaching only sentences would leave them unrouted while reporting a finished pass. Where what the pass must read divides into no such unit, the scan unit is unresolved and the route says what was read in its place.
- **Routing unit** — what the surface divides into once extraction has run, whether or not it bears a decision. An extracted clause and the residue left behind by that extraction are both routing units and both reach a destination. A unit is usually part of one scan unit, because one of them can hold a standing-surface clause and a ledger clause and routing it whole would misplace one of them. A unit may also be assembled from parts of several, where the operative content is stated across them and any part read alone supplies the wrong threshold.
- **Provenance** — every parent scan unit the unit was drawn from, retained on every route so the author can find what was split or joined.

## The pass

Run in order, with two orderings that place the transformations. A transformation runs before every destination step whose input its output would change, and at its numbered position for the rest. Where both transformations fire on one clause, Friction runs before Salience: the trim leaves a prohibition Salience still reads, while a positive restatement removes the assembled command and with it the price the trim is required to record, so one order preserves both observations and the reverse loses one. Steps 2, 3, 5, and 6 choose the destination, and the first one that settles a clause fixes it — an earlier step is coarser, so a clause it settles raises no later destination question. Two steps run on every clause regardless of what settled it: enforcement candidacy, which sets the second axis rather than competing for the destination, and the transformations, which change how the clause is written. Where the dependency on the destination steps runs in a circle and no order satisfies it, the destination is unresolved and the route names the dependency that could not be ordered, because an order that cannot exist is not one the pass picks silently.

Every classifier this pass uses is a set of named hypotheses, and each needs three things its members do not supply on their own: what a unit matching none of them does, what governs when a unit matches more than one, and named states covering what the pass actually reaches. A classifier missing any of the three still returns an answer, which is why the gap does not show in the result — the unit takes the nearest label, or the first listed, or the closest of an incomplete set, and the route then reads with the same confidence as one that was earned. Each classifier below supplies its own three and none of them restates this.

The classifiers are read off the output contract rather than listed beside it: they are exactly those elements of the route block and the report-level finding shape whose value is drawn from a set this contract names. Read that way the set is bounded without being remembered, and it moves when the output moves, because it is the output. A list kept separately would be a copy of that reading with nothing holding the two together — the shape this audit routes to enforcement or deletes wherever else it finds it, and the shape a list of classifiers had already taken here twice before being read against anything. Bounding the classifiers bounds this audit's own machinery and not the categories it routes: each carries its own no-match path, so the members of each stay working hypotheses.

**1. Extract the decision-bearing clauses.** Apply residue extraction (below) before judging placement. Placement judged on an unextracted paragraph routes the rationale and the operative clause to the same destination, which is how routing degrades into deletion.

**2. Ownership.** Is this a fact about this surface, or about another tool's surface? A file that wraps an external command, API, or model accumulates that tool's option space — its accepted values, its version differences, its error taxonomy. Such content is accurate and drifts on the other tool's schedule, where nobody reviewing this surface will see it go stale. The route is delete, with the owner named — that tool's own documentation should carry it, and moving it to a reference here only relocates the drift. **Exception:** a routing or index surface exists precisely to say which external thing to reach for, so a cross-tool fact that determines what gets loaded is owned here. Where a unit answers to both owners — a local requirement stated through an external option's values — extraction should have split it; where it is genuinely indivisible, ownership is local, because the local requirement binds behavior on this surface and cannot be delegated to a document this project does not maintain, and the external half is named as owned elsewhere so its drift stays visible. Where a unit's owner is neither this surface nor an identifiable external one, the owner is unresolved and the route says so: defaulting to local keeps content drifting where nobody reviewing this surface will watch it, and defaulting to delete discards content on a guess about who else carries it.

**3. Load tier.** Choose Tier 0, 1, or 2 by the admission criteria above. Two questions decide Tier 0 admission: does this change action selection on an arbitrary turn, and does it determine what to load in a situation the model must recognize unprompted? A clause that answers no to both is a relocation candidate, not yet a deletion candidate.

**4. Enforcement candidacy.** This step sets the enforcement axis. It does not choose a destination, and it runs whether or not an earlier step already settled one. Three questions in order: does the unit bind behavior, where it does, is the resulting constraint mechanically checkable, and where it is, does a guard earn its cost here? Where the unit binds none, the axis says no norm is asserted and the later questions do not run — that what a unit describes could be checked mechanically does not make enforcement apply to it, since a check with no norm behind it enforces nothing. Where a guard already covers this constraint, the axis names the channel it runs in and where the pass saw the guard — a guard that rejects a bad value converts a silent wrong result into a loud stop, and a channel named on the strength of prose claiming enforcement is the substitution this step exists to catch rather than to make. Where a guard already covers it but does not earn its cost — brittle enough to fail on valid input, or costing more than the failure it prevents — the axis names the channel with what makes it disproportionate, so what reaches the author is the guard's removal or replacement rather than a neutral record that enforcement exists. The states are exclusive per guard rather than ranked, and the axis is set per guard rather than per constraint: where several guards bear on one constraint the axis names each with its own state, since a working guard standing beside a disproportionate one is two findings and reporting only the first retires the second. Where a guard is warranted and none covers this constraint, the finding is the missing guard: the axis names the guard to add, and names the channel to add it at wherever the host has bound one that could carry it. An unresolved binding is the case where no bound channel could carry this guard — whether the host bound none at all or bound only channels of a kind this guard cannot run in — and not the case where a channel that could carry it simply does not yet: collapsing those loses the actionable half, since a named channel is where a guard would live and never evidence that one is there. Where the constraint is checkable and a guard is not warranted — the check would be brittle, or would cost more than the failure it prevents — the axis records the checkability together with the reason the guard was declined, which is what keeps a deliberate decision from reading as an oversight the next reader reopens at full cost. Where nothing about the clause is mechanically decidable, the axis says so, which is a result rather than an omission. Where a unit binds behavior and the relation it stands in to enforcement is none of these, the axis is emergent and describes that relation in place of a state, which is distinct from an unresolved axis: emergent is the pass finding that none of the named states holds, and unresolved is its not reaching which one does.

**A guard does not retire the prose by existing.** A validator reports during or after the action; an instruction shapes the action before it happens. Where both are load-bearing, the clause keeps the destination its own admission earned and the axis records the channel, stating what each one catches that the other does not. Where a guard covers everything the clause was doing, the destination steps decide it on their own merits — a clause they leave with no value on this surface routes to delete while the axis carries the channel, which is the honest record of a constraint that moved from prose to machine.

**5. Ledger.** Apply the positive record test above.

**6. Delete.** Only after steps 2, 3, and 5 leave nothing.

**7. Transformations.** These change how a clause is written. The number is where a transformation runs by default, and the ordering rules above move one earlier where its rewrite would change what a destination step reads — the kind an example is, or the owner a unit answers to. A transformation that feeds no destination step runs here, once the destination question is answered — settled at a named destination, or recorded unresolved, which is an answer and not a pending state.

- **Salience.** Does naming this in order to forbid it introduce it? A written prohibition puts the named action into the context of every session that loads the surface. The rewrite is valid when stating only the intended path preserves both the directive's force and the boundary it marks — where it does, prefer the positive statement, which occupies the same space and leaves no residue. Where it does not, the prohibition stays: the evidence runs against deleting load-bearing negative constraints by default, and a mention that marks a genuine boundary, a contract, a legacy input, a migration target, or a fallback loses that boundary when removed. A section whose declared role is naming failure modes — an anti-pattern list, a diagnostic checklist, a review vocabulary — is compliant by purpose, because negative wording is the content there rather than an instruction.

- **Friction.** Does a pre-assembled example make a high-privilege or destructive path the frictionless one? A complete, ready-to-run command line for an operation the surface elsewhere gates lowers the cost of exactly that operation: the gate has to be read to work, while the command only has to be seen. Trim the pre-assembly, keeping the capability documented in the options. The trim is not free and the route says what it costs: where the assembled form is a handle on behavior the surface deliberately keeps elsewhere, trimming makes the surface state that behavior instead, and where that behavior belongs to a tool this project does not maintain, what the trim produces is the content step 2 routes away. Where nothing sat behind the assembly, the trim costs nothing and the argument stands unqualified. This is a safety argument about copyable artifacts and is scoped to them — it is not a general argument against examples, which the taxonomy below handles instead. It is also a design hypothesis rather than a measured effect; no study cited in the reference material tests it.

## Judging an example

An example is not one object, and the two judgments that apply to it point in opposite directions depending on which kind it is. Classify before routing.

| Kind | What it does | Standing-surface rule |
|---|---|---|
| **Illustrative gloss** | Fixes the boundary of a term the surface coins | Keep one where the term is always needed and the gloss materially changes how the surface is read |
| **Contract specimen** | Pins an exact shape — a structure, a command syntax, a parameter binding, a template | Keep the minimum specimen where the contract is universally active and prose alone has demonstrably failed. Prefer a schema or grammar wherever one fully specifies the contract |
| **Behavioral demonstration** | Teaches a procedure through an input-to-output pair or a trajectory | Argues for the on-demand surface. This kind carries the highest risk of one sampled workflow hardening into default policy |
| **Negative demonstration** | Displays a bad output or a failed trajectory | Argues for diagnostic reference; it is read when detecting or repairing that specific failure |
| **Prohibition / negative constraint** | States a boundary | Not an example. It goes through the salience transformation and the enforcement test, not through this table |

This table feeds step 3 rather than standing beside it: a kind argues for a destination, and the tier ordering decides. Where a demonstration is needed before the on-demand surface would load — the model must have it to know what to reach for — the ordering keeps it at the earlier tier, and the kind's argument survives as the reason to move whatever part of it a pointer can reach in time.

The screening question when a clause is an example: **which of the five kinds is it?** Both demonstration kinds argue for the on-demand surface. A gloss and a contract specimen can hold a place on a loaded surface, each only under its own condition in the table above; a prohibition leaves the table entirely.

One example can answer to more than one kind — a filled invocation shown with its result pins an exact shape and teaches a procedure at the same time. Where the kinds it matches disagree about the destination, the on-demand rule governs: the demonstration kind is the one whose risk the table names, and the specimen rule already prefers a schema or grammar wherever one fully specifies the contract, so what the loaded surface gives up is a specimen a schema can replace. Where an example matches no kind at all, what the route describes in place of a label is what the example does, because a label taken for closeness carries a standing-surface rule the example was never measured against.

Where a specimen's condition cannot be checked — nothing records whether prose alone has failed — route it to the on-demand surface and record the missing evidence. Granting a standing place on an unverified condition is how the exception becomes the rule.

**Frontmatter descriptions are judged differently.** A quoted trigger phrase in a description is not an example of the skill's behavior — it is the routing signal that decides whether the skill loads at all. Judge it by whether it triggers too often or too rarely, not by whether it is an instance.

## Residue extraction

Atomize before moving. Operative clauses hide inside rationale, so extract them first; a paragraph whose clauses all reach the same destination can then move whole.

1. Mark every clause that names an action, a threshold, or a condition.
2. Rewrite those clauses as standalone instructions on the surface they bind.
3. Route what remains. The residue is a routing unit like any other and reaches a destination of its own.
4. Read each new instruction alone. Where it no longer holds without the removed context, restore the minimum context as a subordinate clause.

Step 4 is the one that fails silently. An instruction that reads correctly to someone who just read the original paragraph can be unreadable to a model that never saw it.

## Output

A report in three sections, written for the author who will weigh it. The order is fixed.

**1. Summary.** Files audited, and routes emitted. Unresolved host bindings are listed by name — a count reports how many places the host left unbound without saying which, and the which is the actionable part. Emit no count that the emitted material does not already contain: a denominator over routing units is a judgment, and an exact integer over a judgment reads as measurement while resting on none. Name the spans the pass covered as a summary of the per-unit lines below, never as a substitute for them: a span read is not evidence that every scan unit inside it went through extraction and routing, and a claim about the pass's own execution carries what makes it checkable like any other. State the coverage on the same footing. The pass is complete only where every routing unit in the target emitted the representation it is owed; where it is not, the summary says so, names the boundary the pass reached and the target it left unrouted, and the report is not a completed audit. Whether to narrow the target, take the partial report as it stands, or route the remainder is the caller's, and the summary carries what that judgment needs rather than making it — the pass reads the surface and never the situation the caller is auditing it from, so a completion policy fixed here would be decided without the half that decides it.

**2. Report-level findings**, only when the section fires. Defined below.

**3. Route blocks**, each representing one routing unit — extracted clauses and the residue alongside them — with a single destination and its enforcement axis. A scan unit that splits is represented by several blocks naming it as their common parent; the split lives at the scan unit, since a routing unit has one destination by construction. Emit a block for every routing unit whose disposition is other than `stay`, for any `stay` whose placement was contested, and for any `stay` whose axis result the author still has to act on or weigh. Such a result is a finding the author receives nowhere else, and a clause that stays where it is would otherwise carry it out of the report. The test is the axis result itself, not a list of the states that currently pass it: each state says whether it leaves the author something to do, so a state added to the axis reaches the report without this rule being edited — and a rule that named them instead would go on emitting the states it happened to name. Every remaining unit — the stays the pass examined and left where they were — emits a single line: its locator, enough of the unit to tell it from the others sharing that locator, its destination, its dispositions, and its enforcement result. A locator alone names a scan unit rather than a routing unit and several routinely share one, so a line carrying only that proves nothing about which of them was routed; a line dropping the disposition or the axis reports a route without what every route is required to carry. The line is short because nothing needed acting on, not because less was checked. When nothing routes, the summary still emits.

The dispositions are four — `stay`, `move`, `rewrite`, `delete` — naming what happens to the unit rather than where it lands, and a route names every one that applies. Where what has to happen to a unit is none of the four, the disposition is unresolved and the route describes the action in its place.

A `stay` is **contested** when the step that settled the destination left the placement in doubt rather than confirming it — its predicate fired on a reading the pass would not defend at high confidence, or a relation across routes bears on where the clause belongs. The settling step records it, so the flag has a producer: read off the finished report instead, the same disputed placement would reach the author or not according to how the report happened to be written. Its absence is the other value and not a missing one — the settling step confirmed the placement — and where the step could not tell confirmation from doubt, contestability is unresolved and says what blocked it, since an unmade judgment serialized as an uncontested stay is the suppression this flag exists to prevent.

### The route block

```
R{n} — {file}:{line}   {current surface} → {destination}   {disposition}[, contested]

  > {the unit as the surface states it — verbatim where it is contiguous; each part it was
  assembled from, marked as parts, where it is not}
  From: {every parent scan unit the unit was drawn from — that scan unit, stated as its own
  and only parent, where the routing unit is a whole one}

  Settled at {step}, {the admission or failure predicate that fired}. {why it holds}
  Enforcement: {the unit binds no behavior, so no norm is asserted | the channel a guard
  already runs in, named with where the pass saw the guard | that channel with what makes an
  existing guard disproportionate, and its removal or replacement | the guard to add and the
  bound channel to add it at | the guard to add, binding unresolved | checkable, the guard
  declined and why | not mechanically checkable | none of these, the relation described}
  { — what each catches that the other does not, where the prose is load-bearing too}
  {required action, per each disposition the route names}
  Confidence {high|low}{ — the uncertainty, where low}
  Additional obligations: none | kind …; cluster …; owner …; binding …
```

Every element is required. An element may be **unresolved** where the pass could not settle it, or **plural** where the pass settled on more than one value, and it then says which of the two holds and why. An unresolved element is a limit of the method reached on this clause, and the report records it as one; a plural element is an ordinary result and records nothing further. This loosens what an element may say and never whether it appears — an absent element reports a check that was not made, and an unresolved value is not that. The destination is the one element plurality never reaches: the steps that choose it stop at the first to fire, so it settles at most once.

An element asserting something outside the clause under audit — that a guard exists, that a channel is bound, that a step ran — carries what makes it checkable: where the pass established it. An element that is a judgment about the clause itself carries its predicate instead, which the settling step and the axis already require. The distinction decides whether the report can be audited: an unchecked assertion about the world reads exactly like a checked one, so an instrument that routes that failure elsewhere while committing it here would be reporting on a standard it does not meet.

Five elements carry obligations a placeholder name does not convey:

- **The settling step names its predicate.** Naming the step alone reports where the pass stopped; naming the predicate reports what it found. The steps run in order and the first one to settle a clause fixes its destination, so a clause admitted at an early step never reaches the later destination tests — reporting a step the pass did not run claims a judgment it did not make. A route no step settled names no step: the element is unresolved, and what it reports instead is which steps ran and where the named destinations ran out, since a settling step recorded for a settlement that did not happen is the same false claim from the other direction.
- **The required action follows every disposition the route names.** A relocating clause routinely names two: the extraction that let it move is what leaves it needing to stand alone, so `move` and `rewrite` co-occur and each discharges its own obligation — whichever label the route leads with settles nothing about the other. For `rewrite`, the exact restatement. For `move`, the destination binding, or an explicitly unresolved binding with the reason; where the destination is the on-demand surface, also the pointer on the source surface that reaches it, or a note that one already exists. A clause moved to a reference nothing points at is not relocated but lost — the on-demand surface is defined by being pointed to, so naming the pointer is a condition of the route working rather than a courtesy after it. For `delete` caused by ownership, the external owner.
- **The enforcement line states the axis on every block.** The axis is set for every routing unit, so a block that omits it reports a check that was not made. A unit binding no behavior settles before checkability is asked, and the non-checkable state is reserved for an asserted constraint whose compliance nothing mechanical can decide: said in the same words, a unit there is nothing to enforce on and a norm no machine can check read alike, and they are different results. `not mechanically checkable` is a result and is stated as one; an existing guard is named with where the pass saw it, since a guard the pass took on trust and one it read are the same sentence in the report and only one of them stops anything, and one that does not earn its cost carries its removal or replacement, because the same arm reporting a working guard and a disproportionate one hands the author no reason to touch either; a missing guard names what to add and where it would run, because a missing guard the report does not name is a finding the author never receives, and one named without its channel leaves them to rediscover a binding the host already declared; a checkable constraint whose guard was declined records the reason it was declined, because a decision that reaches the reader as an omission is reopened at the cost of making it again.
- **Low confidence names its uncertainty.** A confidence value with no named uncertainty is a hedge; the author cannot weigh what they cannot see. High and low are exclusive and both report a judgment the pass made; where it could reach none, the confidence is unresolved and names what blocked it. Low is an uncertainty inside a judgment and unresolved is the absence of one, so a route the pass could not judge reads as one it judged weakly wherever the two collapse — and it is high confidence that suppresses a `stay` from the report, which is what makes the unearned value expensive.
- **The obligations line closes every block.** It preserves what a rigid field set buys and drops what that costs. Naming each secondary dimension forces an acknowledgement that it was checked; `none` is that acknowledgement in one phrase rather than an empty slot for each. `none` is a settled value and not the unresolved one — it reports that every secondary dimension was checked and none applies, so a dimension the pass could not settle says that in its own terms rather than closing as `none`. `cluster` belongs to this contract rather than to the author's discretion — a relation across routes is the one thing a per-clause block cannot hold, and it disappears silently when its recording is optional.

### Report-level findings

A finding here is about the pass or about the surface as a whole rather than about one clause. Each takes a fixed shape: its kind — `cross-route-cluster`, `method-limitation`, `output-contract`, or `emergent` where the finding answers to none of the three and the kind is described rather than chosen, with a finding that answers to more than one naming each, since nothing downstream reads the kind as a single value; the claim; the routes or clauses affected; why no route block can express it; the consequence; and confidence.

The section fires when the target exposes a limitation that changes, blocks, or makes dishonest at least one route, or when two or more routes stand in a relation no single block holds. A consistency defect unrelated to placement stays out — a finding that would hold whatever surface its clause sat on belongs to a different review, and admitting it turns this section into an unbounded prose bucket.

## Reference material

- `references/routing-traces.md` — complete routing traces over real surfaces. Read when a placement is ambiguous and a comparable case would settle it, or when the caller asks to see the procedure run.
- `references/evidence.md` — what the empirical record supports, at what strength, and where it runs out. Read when a routing judgment is challenged, or when an author asks on what basis a rule stands.

## Confidence

An advisory, human-reviewed instrument. Routes are candidates for an author to weigh, not automatic edits.

The load-tier distinction rests on measured architecture: a skill's frontmatter is preloaded and its body is read on trigger, so the two are genuinely different surfaces. The rest — the five destinations, enforcement as an axis crossing them rather than a sixth, the pass order, the example taxonomy, routing demonstrations to the on-demand surface — are design hypotheses that organize the available evidence rather than conclusions the evidence forces.

**Two known gaps in the pass.** Delete's criterion weighs a clause read alone, so a rule stated more than once on one surface is operative in each instance and each instance routes to the tier it already occupies — intra-surface duplication reaches the report as a cross-route finding, never as a route. And no step tests a pointer against its referent, so an enumeration that disagrees with the table it points at is found while executing the pass rather than by it. Both gaps are known and unclosed; closing either would widen the method past placement, which is a separate decision.

**Standing limitation.** There is no held-out evaluation channel: nothing measures whether contract violations rise or fall after a surface is routed. Every judgment here therefore rests on argument. Treat a claim about what routing achieves as untested, and never infer that deleting a clause is safe from the absence of evidence that it is load-bearing.

## Self-application

This skill's whole packaged surface is in scope for its own audit — frontmatter, this file, and both reference files. Exempting the reference files would let the most anchoring content in the package escape the audit that governs it. Routes against this skill are first-class.

## Distinction

| Surface | Mechanism | What it handles |
|---|---|---|
| Deterministic checks | Literal pattern matching and structural validation | Structural drift between coupled artifacts; literal pattern leaks |
| `/place` | Claude-judge placement classification over routing units | Which surface a clause belongs on, and what it must be rewritten to before it moves |

A deterministic check answers whether a surface is well-formed. This audit answers whether its content is in the right place, which no pattern match reaches.
