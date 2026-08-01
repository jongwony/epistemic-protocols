---
name: place
description: "Use when asked \"where does this belong\", \"audit this instruction file\", \"why does this keep growing\", or invokes /place. Read-only audit routing each clause of LLM-facing prose to a destination."
user_invocable: true
allowed-tools: Read, Grep, Glob
---

# Placement Audit

A read-only audit of LLM-facing instruction prose that answers one question per clause: **where does this belong?** Every decision-bearing clause receives a destination. The audit emits routes; the human author applies them.

## Purpose

Instruction surfaces accumulate. The usual review asks whether a file is too long and answers by cutting, which loses the operative clauses buried inside rationale — a threshold, a condition, a named action, sitting in the middle of a paragraph that exists to explain something else. Routing preserves them: content that leaves a surface arrives somewhere, and the clause that has to keep binding behavior is rewritten to stand on its own before the paragraph around it moves.

The audit also collapses two judgments that were previously made separately — whether a mention holds attention on something the instruction is trying to avoid, and whether an example anchors the model to one instance. Both turn out to be placement questions. A prohibition and an example are not decided by whether they are allowed; they are decided by which surface they belong on.

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

Five, and a route carries one of them, never two. Enforcement is not among them: a mechanical guard and a runtime sentence act at different moments on the same constraint, so enforcement is a second axis every route carries alongside its destination (see Enforcement candidacy).

| Destination | Admission criterion |
|---|---|
| **Tier 0 — standing surface** | Loaded on every turn: project instruction files, rule files, and skill frontmatter descriptions. Admitted when the clause changes what the model does on an arbitrary turn, or determines which surface to load in a situation the model must recognize before loading anything. |
| **Tier 1 — invocation surface** | Loaded when its skill is triggered: the body of a skill instruction file. Admitted when the clause binds behavior for the duration of that skill's work. Being on demand does not make size free — a triggered body arrives whole. |
| **Tier 2 — on-demand surface** | Opened deliberately: reference material a surface points to. Admitted when the clause is needed while performing one specific sub-task, and reading it at any other time costs attention without changing an action. |
| **Ledger** | Admitted on positive record value: rationale, provenance, a trade-off, a rejected alternative, or an epistemic status that a future reader needs to reconstruct why the surface says what it says. |
| **Delete** | Admitted when no operative, routing, diagnostic, or record value remains **on this surface** after residue extraction. Content that is accurate but owned by a surface this project does not maintain routes here too, with the owner named. |

Absence of runtime relevance does not by itself admit a clause to the ledger. Without a positive record test the ledger becomes the place everything goes, and Delete stops firing.

Delete is scoped to the surface under audit, not to the content's worth. A fact that belongs in another tool's documentation leaves this surface and keeps its value elsewhere; the route records where.

The five are named hypotheses rather than a proof of exhaustion. Where a clause's home is a surface none of them names, emit the route with its destination unresolved, describe the surface the clause wants, and record the shape as a method limitation. Forcing the fit into the nearest named destination is what this path prevents: the route then reads as a judgment the pass never made, and reads that way with the same confidence as a route that was earned.

## Unit of judgment

- **Scan unit** — the sentence. Read the surface sentence by sentence.
- **Routing unit** — every part a sentence divides into, whether or not it bears a decision. An extracted clause and the residue left behind by that extraction are both routing units and both reach a destination; one sentence can hold a standing-surface clause and a ledger clause, and routing the sentence whole would misplace one of them.
- **Provenance** — the parent sentence, retained on every route so the author can find what was split.

## The pass

Run in order. Steps 2, 3, 5, and 6 choose the destination, and the first one that settles a clause fixes it — an earlier step is coarser, so a clause it settles raises no later destination question. Two steps run on every clause regardless of what settled it: enforcement candidacy, which sets the second axis rather than competing for the destination, and the transformations, which change how the clause is written wherever it lands.

**1. Extract the decision-bearing clauses.** Apply residue extraction (below) before judging placement. Placement judged on an unextracted paragraph routes the rationale and the operative clause to the same destination, which is how routing degrades into deletion.

**2. Ownership.** Is this a fact about this surface, or about another tool's surface? A file that wraps an external command, API, or model accumulates that tool's option space — its accepted values, its version differences, its error taxonomy. Such content is accurate and drifts on the other tool's schedule, where nobody reviewing this surface will see it go stale. The route is delete, with the owner named — that tool's own documentation should carry it, and moving it to a reference here only relocates the drift. **Exception:** a routing or index surface exists precisely to say which external thing to reach for, so a cross-tool fact that determines what gets loaded is owned here.

**3. Load tier.** Choose Tier 0, 1, or 2 by the admission criteria above. Two questions decide Tier 0 admission: does this change action selection on an arbitrary turn, and does it determine what to load in a situation the model must recognize unprompted? A clause that answers no to both is a relocation candidate, not yet a deletion candidate.

**4. Enforcement candidacy.** This step sets the enforcement axis. It does not choose a destination, and it runs whether or not an earlier step already settled one. Is the constraint mechanically checkable, and does the host have a channel that checks it? Where a channel exists, the axis names it — a guard that rejects a bad value converts a silent wrong result into a loud stop. Where the constraint should be enforced and no channel exists, the finding is the missing guard: the axis names the guard to add and leaves the binding unresolved. Where nothing about the clause is mechanically decidable, the axis says so, which is a result rather than an omission.

**A guard does not retire the prose by existing.** A validator reports during or after the action; an instruction shapes the action before it happens. Where both are load-bearing, the clause keeps the destination its own admission earned and the axis records the channel, stating what each one catches that the other does not. Where a guard covers everything the sentence was doing, the destination steps decide the sentence on their own merits — a clause they leave with no value on this surface routes to delete while the axis carries the channel, which is the honest record of a constraint that moved from prose to machine.

**5. Ledger.** Apply the positive record test above.

**6. Delete.** Only after steps 2, 3, and 5 leave nothing.

**7. Transformations.** These change how a clause is written; they do not choose its destination, so apply them once a destination is settled.

- **Salience.** Does naming this in order to forbid it introduce it? A written prohibition puts the named action into the context of every session that loads the surface. The rewrite is valid when stating only the intended path preserves both the directive's force and the boundary it marks — where it does, prefer the positive statement, which occupies the same space and leaves no residue. Where it does not, the prohibition stays: the evidence runs against deleting load-bearing negative constraints by default, and a mention that marks a genuine boundary, a contract, a legacy input, a migration target, or a fallback loses that boundary when removed. A section whose declared role is naming failure modes — an anti-pattern list, a diagnostic checklist, a review vocabulary — is compliant by purpose, because negative wording is the content there rather than an instruction.

- **Friction.** Does a pre-assembled example make a high-privilege or destructive path the frictionless one? A complete, ready-to-run command line for an operation the surface elsewhere gates lowers the cost of exactly that operation: the gate has to be read to work, while the command only has to be seen. Trim the pre-assembly, keeping the capability documented in the options. This is a safety argument about copyable artifacts and is scoped to them — it is not a general argument against examples, which the taxonomy below handles instead. It is also a design hypothesis rather than a measured effect; no study cited in the reference material tests it.

## Judging an example

An example is not one object, and the two judgments that apply to it point in opposite directions depending on which kind it is. Classify before routing.

| Kind | What it does | Standing-surface rule |
|---|---|---|
| **Illustrative gloss** | Fixes the boundary of a term the surface coins | Keep one where the term is always needed and the gloss materially changes how the surface is read |
| **Contract specimen** | Pins an exact shape — a structure, a command syntax, a parameter binding, a template | Keep the minimum specimen where the contract is universally active and prose alone has demonstrably failed. Prefer a schema or grammar wherever one fully specifies the contract |
| **Behavioral demonstration** | Teaches a procedure through an input-to-output pair or a trajectory | Route to the on-demand surface. This kind carries the highest risk of one sampled workflow hardening into default policy |
| **Negative demonstration** | Displays a bad output or a failed trajectory | Route to diagnostic reference; it is read when detecting or repairing that specific failure |
| **Prohibition / negative constraint** | States a boundary | Not an example. It goes through the salience transformation and the enforcement test, not through this table |

The screening question when a clause is an example: **which of the five kinds is it?** Both demonstration kinds route to the on-demand surface. A gloss and a contract specimen can hold a place on a loaded surface, each only under its own condition in the table above; a prohibition leaves the table entirely. The five are named hypotheses rather than a closed partition — where an example matches none of them, describe what it does instead of taking the nearest label, route it on that description, and record the kind as a method limitation. A label taken for closeness carries a standing-surface rule the example was never measured against.

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

**1. Summary.** Files audited, and routes emitted. Unresolved host bindings are listed by name — a count reports how many places the host left unbound without saying which, and the which is the actionable part. Emit no count that the emitted material does not already contain: a denominator over routing units is a judgment, and an exact integer over a judgment reads as measurement while resting on none.

**2. Report-level findings**, only when the section fires. Defined below.

**3. Route blocks**, one per routing unit — extracted clauses and the residue alongside them — each with a single destination and its enforcement axis. A sentence that splits is represented by several blocks quoting the same parent sentence; the split lives at the sentence, since a routing unit has one destination by construction. Emit a block for every routing unit whose disposition is other than `stay`, for any `stay` whose placement was contested, and for any `stay` whose axis names a guard the host has not bound — an unbound guard is a finding, and a clause that stays where it is would otherwise carry it out of the report. When nothing routes, the summary still emits.

### The route block

```
R{n} — {file}:{line}   {current surface} → {destination}   {disposition}[, contested]

  > {routed clause, verbatim}
  From: {parent sentence — where the clause is not the whole sentence}

  Settled at {step}, {the admission or failure predicate that fired}. {why it holds}
  Enforcement: {the channel, named | the guard to add, binding unresolved | not mechanically
  checkable}{ — what each catches that the other does not, where the prose is load-bearing too}
  {required action, per the disposition}
  Confidence {high|low}{ — the uncertainty, where low}
  Additional obligations: none | kind …; cluster …; owner …; binding …
```

Every element is required. Five of them carry obligations a placeholder name does not convey:

- **The settling step names its predicate.** Naming the step alone reports where the pass stopped; naming the predicate reports what it found. The steps run in order and the first one to settle a clause fixes its destination, so a clause admitted at an early step never reaches the later destination tests — reporting a step the pass did not run claims a judgment it did not make.
- **The required action follows the disposition.** For `rewrite`, the exact restatement. For `move`, the destination binding, or an explicitly unresolved binding with the reason; where the destination is the on-demand surface, also the pointer on the source surface that reaches it, or a note that one already exists. A clause moved to a reference nothing points at is not relocated but lost — the on-demand surface is defined by being pointed to, so naming the pointer is a condition of the route working rather than a courtesy after it. For `delete` caused by ownership, the external owner.
- **The enforcement line states the axis on every block.** The axis is set for every routing unit, so a block that omits it reports a check that was not made. `not mechanically checkable` is a result and is stated as one; an unbound guard names what to add, because a missing guard the report does not name is a finding the author never receives.
- **Low confidence names its uncertainty.** A confidence value with no named uncertainty is a hedge; the author cannot weigh what they cannot see.
- **The obligations line closes every block.** It preserves what a rigid field set buys and drops what that costs. Naming each secondary dimension forces an acknowledgement that it was checked; `none` is that acknowledgement in one phrase rather than an empty slot for each. `cluster` belongs to this contract rather than to the author's discretion — a relation across routes is the one thing a per-clause block cannot hold, and it disappears silently when its recording is optional.

### Report-level findings

A finding here is about the pass or about the surface as a whole rather than about one clause. Each takes a fixed shape: its kind — `cross-route-cluster`, `method-limitation`, `output-contract`, or `emergent` where the finding answers to none of the three and the kind is described rather than chosen; the claim; the routes or clauses affected; why no route block can express it; the consequence; and confidence.

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
| `/place` | Claude-judge placement classification over decision-bearing clauses | Which surface a clause belongs on, and what it must be rewritten to before it moves |

A deterministic check answers whether a surface is well-formed. This audit answers whether its content is in the right place, which no pattern match reaches.
