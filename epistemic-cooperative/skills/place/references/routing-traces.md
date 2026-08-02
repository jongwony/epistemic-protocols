# Routing traces

Complete traces of the pass running over real instruction prose. Read one when a placement is ambiguous and a comparable case would settle it, or when a caller asks to see the procedure applied rather than described.

Each trace quotes its source clause in full, so no trace depends on reaching the file it came from. Surfaces are named by kind rather than by path, because the same shapes recur across projects.

These traces narrate the pass and summarize where each unit lands. Their route lines carry what the trace is showing rather than every element a block requires, so they are not emitted route blocks and reading one as a template would model an incomplete output. The one filled block in this file is the specimen in the report fragment below. The route-block contract itself is defined in `SKILL.md` §The route block, and where anything here disagrees with that section, the section governs. This file states no conformance guarantee of its own: a certification nothing checks reads as verification while tracking the contract only as well as its last hand-edit, which is the failure the audit routes and would be committing here.

---

## Trace 1 — rationale carrying no action

**Surface:** a prose-audit skill's instruction body, in the section stating what the audit is for.

**Sentence:**

> This drift survives deterministic structural checks — it is a meaning-level pattern, so a semantic reviewer catches what literal pattern matching cannot.

**Pass:**

1. *Extract.* One clause. Nothing names an action, a threshold, or a condition, so extraction yields no standalone instruction.
2. *Ownership.* A fact about this surface's own instrument. Owned here.
3. *Load tier.* Does it change action selection on an arbitrary turn? No — a model executing the audit behaves identically whether or not it has read this. Does it determine what to load? No. Fails Tier 0, and fails Tier 1 for the same reason.
4. *Enforcement.* The clause binds no behavior, so no norm is asserted; the axis records that and the destination is untouched. Whether a deterministic check would catch the pattern is itself decidable, and that decides nothing here — there is no norm for the check to enforce.
5. *Ledger.* Positive record value: it states why this instrument exists alongside the deterministic layer, which is the design rationale a future reader needs to reconstruct the split. Admitted.
6. Not reached.
7. *Transformations.* None fire; the clause names no path to prefer over another and carries no pre-assembled command.

**Route:** one, destination `ledger`, disposition `move`, enforcement axis `no norm asserted`.

**Why it is worth tracing:** this is the most common shape in a mature instruction file — a true, well-written, load-bearing-sounding sentence that changes no behavior. It survives every review that asks whether it is accurate, and only moves under a review that asks whether anything follows from it.

---

## Trace 2 — one sentence, two routes

**Surface:** the closing confidence note of a prose-audit skill.

**Sentence:**

> Promoting any recurring finding pattern into a deterministic check is a separate, evidence-gated step — it waits on a pattern proving stable across varied prose, not on a single audit run.

**Pass:**

1. *Extract.* Marking clauses that name an action, a threshold, or a condition yields one operative unit spanning both halves of the sentence: promotion requires a pattern stable across varied prose, and a single run does not meet that bar. Step 4 of residue extraction is what keeps these together — read alone, *"Promote a finding pattern to a deterministic check only after it holds across varied prose"* is grammatical but supplies the wrong threshold, because a reader with one passing run will read their run as the evidence. The single-run bound is the operative half, not commentary on it. Extracted: *"Promote a finding pattern to a deterministic check only after it holds across varied prose; a single audit run is not that evidence."*

   The remainder — the framing of promotion as a separate step — carries no action.

2. *Ownership.* Both units owned here.
3. *Load tier.* The instruction binds a decision an author makes while working on this instrument: Tier 1. It governs no arbitrary turn, so not Tier 0. The remainder reaches no tier.
4. *Enforcement.* The instruction binds behavior and is not mechanically checkable; "stable across varied prose" has no decidable test. The remainder binds none, so no norm is asserted on it and checkability is not asked.
5. *Ledger.* The remainder is admitted on record value.
6. Not reached.
7. *Salience.* The instruction contains a negative clause ("is not that evidence"). Stating only the intended path would drop the bar that one run does not clear, which is the specific over-reading the sentence exists to prevent. Load-bearing; it stays.

**Routes:** two, sharing this sentence as `parent`. The instruction → `tier1`, disposition `rewrite`. The remainder → `ledger`, disposition `move`. The instruction carries `not mechanically checkable` on the axis and the remainder carries `no norm asserted`, which is the split the axis's first question makes.

**Why it is worth tracing:** the sentence splits, the clauses do not. Two routes quoting the same parent sentence is how a split is represented — there is no single route carrying two destinations, and a trace that produced one would not conform to the contract.

---

## Trace 3 — a prohibition, and what a careful rewrite reaches

**Surface:** a project instruction file, in a section listing verification commands.

**Sentence A:**

> Do not run the packaging test suite concurrently with static protocol verification when liveness tests may mutate live instruction files.

**Pass:**

1. *Extract.* One operative unit, already standalone.
2. *Ownership.* A fact about this project's own toolchain. Owned here.
3. *Load tier.* It has to be known before either command is issued; a model deciding how to parallelize verification would otherwise not know to serialize. Tier 0.
4. *Enforcement.* Mechanically checkable — a lock, or mutually exclusive task definitions, would enforce it. The host binds a static-check channel and no other, read from its declared bindings rather than assumed, but a guard that serializes two commands runs in whatever invokes them rather than in a pass over their sources, so no bound channel could carry it: the axis names the guard to add and leaves the binding unresolved. Naming the bound channel here would report a home this guard cannot have. The destination is unaffected; step 3 settled it already.
5. — 6. Not reached.
7. *Salience.* The sentence names the forbidden combination. Test the rewrite rather than assuming it fails: *"When liveness tests may mutate live instruction files, run the packaging suite and static verification serially."* That preserves the condition and the directive, and it does not over-constrain the unconditioned case. The rewrite holds, so it is the finding.

**Routes:** one at `tier0`, disposition `rewrite`, the axis naming the guard to add with its binding unresolved — a guard would stop a run already started, while the sentence stops it from being started.

**Sentence B:**

> Node.js 22 or later is required; the continuous integration pipeline pins Node 22.

**Pass:**

1. *Extract.* The sentence splits. *"Node.js 22 or later is required"* names a threshold and is operative. *"the continuous integration pipeline pins Node 22"* names no action a reader takes; it reports where the requirement is enforced, and is residue.
2. *Ownership.* Both units are facts about this project's own toolchain. Owned here.
3. *Load tier.* The requirement has to be known before a contributor picks a runtime, so it settles at Tier 0. The residue changes no action selection and determines nothing to load, so it reaches no tier.
4. *Enforcement.* The requirement binds behavior, is checkable, and a guard already covers it: the axis names the pipeline, read from the pipeline's own pinned version rather than from the sentence asserting it — the sentence is the claim under audit and cannot be its own evidence. The residue binds no behavior — it reports where the requirement is enforced rather than requiring anything — so its axis says no norm is asserted, and that the pinned version is mechanically readable does not change that.
5. *Ledger.* The residue is admitted on record value: it records that the requirement is enforced and where, which is what a future reader needs to reconstruct why the surface states the requirement rather than trusting contributors to know it. The axis carries the same fact into this report, and the report is not a surface the project keeps.
6. Not reached.
7. *Transformations.* None fire. Neither unit names a path to avoid, and neither carries a pre-assembled command.

**Routes:** two, sharing this sentence as `parent`. The requirement → `tier0`, disposition `stay`, the axis naming the pipeline with where it was read; the residue → `ledger`, disposition `move`, its axis `no norm asserted`. The Tier 0 sentence survives a guard that already enforces it for a reason specific to it: the pipeline reports the mismatch only after a contributor has already done the work on the wrong runtime.

**Why it is worth tracing:** the salience step is a rewrite *test*, not a presumption in either direction. Asserting that a positive restatement would lose the condition — without writing the restatement out and reading it — is how a prohibition gets kept for the wrong reason. Both sentences also show the axis crossing a destination rather than competing with it: a guard and an instruction catch the same violation at different moments, so the clause keeps its tier and the axis records the channel.

---

## Trace 4 — residue extraction on a dense paragraph

**Surface:** a skill wrapping an external command-line tool, describing its event log.

**Paragraph** (the scan unit here is each sentence; the paragraph is quoted whole because extraction crosses sentence boundaries):

> The wrapper streams the event log to a file beside the prompt. Open it to check a long run mid-flight. Expect buffered bursts rather than a smooth tick: the tool block-flushes, so a mid-run read shows accumulated progress arriving in chunks (verified: progress events were present in the file well before the run finished). It is a bystander — it never gates the result path, so reading it cannot destabilize the run, and there is no always-on transform to pay for. Byte-bound it or filter with a field filter; a bare line-based tail will not cap it, because one event can be many megabytes.

**Pass:**

1. *Extract.* Marking every clause naming an action, a threshold, or a condition yields two operative units. Assembly is warranted across sentences for the first — the log's location, the action of opening it mid-run, and the byte-bounding requirement with the size reason that sets it — because the bound read without that reason supplies the wrong threshold, and a reader who takes it as a preference rather than a hard cap has the failure it prevents. The expectation of buffered chunks meets no such test: read alone it is complete, so assembling it into the first unit would join what does not need joining. Unmarked: the verification note in parentheses, and the bystander reasoning.

   Extracted: *"The wrapper streams the event log to a file beside the prompt; open it to check a long run mid-flight. Read it byte-bounded or with a field filter — one event can be many megabytes, so a line-based tail will not cap it."* and *"Expect progress in buffered chunks rather than a smooth tick."*

2. *Ownership.* The log is the wrapper's own surface, not the wrapped tool's. Owned here. Had the paragraph enumerated the wrapped tool's accepted flag values, that unit would route to `delete` at this step with the wrapped tool's documentation as `owner`, and never reach step 3.
3. *Load tier.* Neither unit changes action selection on an arbitrary turn, so Tier 0 is out for both, and what separates them is when each is needed. The first is needed at the moment the reader decides to open the log: a pointer followed after that decision arrives too late, because the unbounded read is the action the bound exists to prevent. Needed before Tier 2 loads, so Tier 1. The second is needed only while reading, costs nothing to learn late, and changes no action read at any other time — Tier 2, behind the pointer the Tier 1 unit carries.
4. *Enforcement.* The byte bound is checkable in principle: a wrapper that reads the log itself could cap the read rather than instruct the caller to. Its read path was opened and carries no cap — the axis records that reading, not the absence of a claim to the contrary — so the axis names that guard with its binding unresolved; the unit keeps the Tier 1 destination step 3 gave it. Nothing about the buffering expectation is mechanically decidable, and its axis says so. The verification note and the bystander reasoning each bind no behavior, so no norm is asserted on either and checkability is not asked — the note records an observation and the reasoning justifies a claim the instruction already carries, and the dataflow each describes being inspectable does not put a norm behind it.
5. *Ledger.* The verification note is an epistemic annotation — real, worth recording, and no action follows from reading it. The bystander reasoning justifies a safety claim the instruction already carries. Both admitted.
6. Not reached.
7. *Transformations.* None fire. "Will not cap it" names the specific failure a reader would otherwise walk into and carries the threshold, so salience leaves it.

**Routes:** four. The retrieval-and-bound instruction is assembled from three of the paragraph's sentences and carries all three as its parents — to `tier1` (`rewrite`), with the unresolved guard on its axis. The buffering expectation → `tier2` (`move`, `rewrite`), carrying the sentence it came from, with the pointer that reaches it named on the Tier 1 unit. The verification note and the bystander reasoning each carry the one sentence they came from — both to `ledger` (`move`), both `no norm asserted`.

**Why it is worth tracing:** the paragraph loses roughly half its length and none of its operative content. It is the assembly case in one direction and the tier-ordering case in the other. The operative content of the first unit is stated across three sentences and no one of them carries the threshold alone, so that unit joins rather than splits and its provenance names every sentence it was drawn from. The buffering expectation sits beside it in the same paragraph and goes the other way: complete on its own, and needed only once the reader is already looking at the log, so the pointer reaches it in time and it costs nothing at Tier 1 to give up. It is also the clearest case against deletion as the instrument: a reviewer cutting for length would most likely drop the byte-bounding clause, which is the only sentence in the paragraph that prevents a real failure.

---

## Trace 5 — an override, and its reversal

**Surface:** this audit's own instruction body, in the section describing the output.

The first draft of that section closed with:

> The schema above is a contract specimen under this audit's own taxonomy: the contract is active on every run, and a schema specifies it more completely than a filled-in sample would.

**Pass:** no operative clause; owned here; nothing follows from it at execution time, so it binds no behavior and no norm is asserted; positive record value as the rationale for choosing a schema over a sample; no transformation fires. **Route:** `ledger`, disposition `move`, enforcement axis `no norm asserted`.

**What the author did:** kept it anyway, at `stay` with confidence `low`, on the reasoning that it was the one place the audit demonstrated its taxonomy on itself, and that an instrument whose credibility rests on self-application loses something the routing rule does not measure.

**What review found:** that reasoning is an untyped exemption. "Loses something the rule does not measure" can be said of any rationale an author is attached to, and an exemption that admits everything protects nothing. The sentence was removed and the route applied.

**Why it is worth tracing:** the author holds the decision, and this is what holding it responsibly looks like — an override is legitimate, and it still has to survive being read back. The failure mode is not overriding; it is overriding on a reason that would justify keeping any sentence. When the stated reason for an exception does not narrow, the exception is not a judgment.

---

## Report fragment — a route, and the finding it could not hold

The traces above follow the pass to a destination. This shows what reaches the author afterward, and why the most useful result of a run sometimes fits in no route block at all.

**Surface:** a prose-audit skill's instruction body. Its scoping rule — that deletion is judged against the surface under audit and not against the content's worth — appears three times: in the table defining the destinations, inside the ownership step of the pass, and again as a standalone paragraph.

The routed clause, quoted in full:

> Deletion is scoped to the surface under audit, not to the content's worth.

The route:

```
R9 — skill-body.md:58   tier1 → tier1   stay, contested

  > Deletion is scoped to the surface under audit, not to the content's worth.
  From: that sentence, whole — its own and only parent. The sentence beside it, on where the
  route records content going, is a separate unit with a route of its own.

  Settled at step 3, Tier 1 admission: the clause binds behavior for the duration of this
  skill's work, so the load-tier question answers before any later test is reached.
  Enforcement: not mechanically checkable — whether a clause's value survives on some other
  surface is a judgment about the content, not a decidable property of the text.
  No action — the clause is on the surface it belongs to.
  Confidence low — the placement is right and the clause is still redundant, and a route
  has no way to say both.
  Additional obligations: cluster — the destinations table and the ownership step carry the
  same rule.
```

And the finding beside it:

```
kind:        cross-route-cluster
claim:       The rule scoping deletion to the surface under audit is stated three times on
             one surface — the destinations table, the ownership step, and a standalone
             paragraph.
affects:     all three instances, each with a route of its own
no block:    Each instance is operative read alone, so each is admitted at its own tier and
             each disposition is stay. The relation bears on all three symmetrically — no
             instance is the one the others duplicate — so all three are contested and all
             three emit blocks, and each block says only that its own placement is in doubt.
             The redundancy exists in the relation between them, which no block holds.
consequence: Two statements could go with no loss, and the pass cannot say which, having no
             canonical-instance test.
confidence:  high
```

**Why it is worth recording:** the route is correct and nearly uninformative; the finding carries the result. Note also which step settled the route — step 3, not step 6. The steps run in order and the first to settle a clause fixes its destination, so a clause admitted at Tier 1 never reaches the Delete test. Recording step 6 would report that the pass considered deletion and declined, which it did not do.
