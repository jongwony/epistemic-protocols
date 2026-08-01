# Routing traces

Complete traces of the pass running over real instruction prose. Read one when a placement is ambiguous and a comparable case would settle it, or when a caller asks to see the procedure applied rather than described.

Each trace quotes its source clause in full, so no trace depends on reaching the file it came from. Surfaces are named by kind rather than by path, because the same shapes recur across projects.

Every trace here has been checked against the route-block contract: one route per routing unit — extracted clauses and the residue alongside them — one destination and one enforcement axis each, a sentence that splits appearing as several blocks that name it as their common parent, and a unit assembled across sentences carrying every parent it was drawn from.

---

## Trace 1 — rationale carrying no action

**Surface:** a prose-audit skill's instruction body, in the section stating what the audit is for.

**Sentence:**

> This drift survives deterministic structural checks — it is a meaning-level pattern, so a semantic reviewer catches what literal pattern matching cannot.

**Pass:**

1. *Extract.* One clause. Nothing names an action, a threshold, or a condition, so extraction yields no standalone instruction.
2. *Ownership.* A fact about this surface's own instrument. Owned here.
3. *Load tier.* Does it change action selection on an arbitrary turn? No — a model executing the audit behaves identically whether or not it has read this. Does it determine what to load? No. Fails Tier 0, and fails Tier 1 for the same reason.
4. *Enforcement.* Not mechanically checkable; the axis records that and the destination is untouched.
5. *Ledger.* Positive record value: it states why this instrument exists alongside the deterministic layer, which is the design rationale a future reader needs to reconstruct the split. Admitted.
6. Not reached.
7. *Transformations.* None fire; the clause names no path to prefer over another and carries no pre-assembled command.

**Route:** one, destination `ledger`, disposition `move`, enforcement axis `not mechanically checkable`.

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
4. *Enforcement.* Not mechanically checkable; "stable across varied prose" has no decidable test.
5. *Ledger.* The remainder is admitted on record value.
6. Not reached.
7. *Salience.* The instruction contains a negative clause ("is not that evidence"). Stating only the intended path would drop the bar that one run does not clear, which is the specific over-reading the sentence exists to prevent. Load-bearing; it stays.

**Routes:** two, sharing this sentence as `parent`. The instruction → `tier1`, disposition `rewrite`. The remainder → `ledger`, disposition `move`. Both carry `not mechanically checkable` on the axis.

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
4. *Enforcement.* Mechanically checkable — a lock, or mutually exclusive task definitions, would enforce it. The host binds a static-check channel, but a guard that serializes two commands runs in whatever invokes them rather than in a pass over their sources, so no bound channel could carry it: the axis names the guard to add and leaves the binding unresolved. Naming the bound channel here would report a home this guard cannot have. The destination is unaffected; step 3 settled it already.
5. — 6. Not reached.
7. *Salience.* The sentence names the forbidden combination. Test the rewrite rather than assuming it fails: *"When liveness tests may mutate live instruction files, run the packaging suite and static verification serially."* That preserves the condition and the directive, and it does not over-constrain the unconditioned case. The rewrite holds, so it is the finding.

**Routes:** one at `tier0`, disposition `rewrite`, the axis naming the guard to add with its binding unresolved — a guard would stop a run already started, while the sentence stops it from being started.

**Sentence B:**

> Node.js 22 or later is required; the continuous integration pipeline pins Node 22.

**Pass:** ownership is local; the sentence has to be known before a contributor picks a runtime, so step 3 settles it at Tier 0. The axis names the pipeline as the existing channel, and the destination holds for a reason specific to this sentence: the pipeline reports the mismatch only after a contributor has already done the work on the wrong runtime.

**Why it is worth tracing:** the salience step is a rewrite *test*, not a presumption in either direction. Asserting that a positive restatement would lose the condition — without writing the restatement out and reading it — is how a prohibition gets kept for the wrong reason. Both sentences also show the axis crossing a destination rather than competing with it: a guard and an instruction catch the same violation at different moments, so the clause keeps its tier and the axis records the channel.

---

## Trace 4 — residue extraction on a dense paragraph

**Surface:** a skill wrapping an external command-line tool, describing its event log.

**Paragraph** (the scan unit here is each sentence; the paragraph is quoted whole because extraction crosses sentence boundaries):

> The wrapper streams the event log to a file beside the prompt. Open it to check a long run mid-flight. Expect buffered bursts rather than a smooth tick: the tool block-flushes, so a mid-run read shows accumulated progress arriving in chunks (verified: progress events were present in the file well before the run finished). It is a bystander — it never gates the result path, so reading it cannot destabilize the run, and there is no always-on transform to pay for. Byte-bound it or filter with a field filter; a bare line-based tail will not cap it, because one event can be many megabytes.

**Pass:**

1. *Extract.* Marking every clause naming an action, a threshold, or a condition yields one operative unit: the log's location, the action of opening it mid-run, the expectation of buffered chunks, and the byte-bounding requirement with the size reason that sets it. Unmarked: the verification note in parentheses, and the bystander reasoning.

   Extracted: *"The wrapper streams the event log to a file beside the prompt; open it to check a long run mid-flight. Read it byte-bounded or with a field filter — one event can be many megabytes, so a line-based tail will not cap it. Expect progress in buffered chunks rather than a smooth tick."*

2. *Ownership.* The log is the wrapper's own surface, not the wrapped tool's. Owned here. Had the paragraph enumerated the wrapped tool's accepted flag values, that unit would route to `delete` at this step with the wrapped tool's documentation as `owner`, and never reach step 3.
3. *Load tier.* Tier 1 — it binds behavior while working with this wrapper and governs no arbitrary turn.
4. *Enforcement.* The byte bound is checkable in principle: a wrapper that reads the log itself could cap the read rather than instruct the caller to. The wrapper does not, so the axis names that guard with its binding unresolved; the instruction keeps the Tier 1 destination step 3 gave it.
5. *Ledger.* The verification note is an epistemic annotation — real, worth recording, and no action follows from reading it. The bystander reasoning justifies a safety claim the instruction already carries. Both admitted.
6. Not reached.
7. *Transformations.* None fire. "Will not cap it" names the specific failure a reader would otherwise walk into and carries the threshold, so salience leaves it.

**Routes:** three. The instruction is assembled from four of the paragraph's sentences and carries all four as its parents — to `tier1` (`rewrite`), with the unresolved guard on its axis. The verification note and the bystander reasoning each carry the one sentence they came from — both to `ledger` (`move`), both `not mechanically checkable`.

**Why it is worth tracing:** the paragraph loses roughly half its length and none of its operative content. It is also the assembly case: the operative content is stated across four sentences and no one of them carries the threshold alone, so the unit joins rather than splits and its provenance names every sentence it was drawn from. It is also the clearest case against deletion as the instrument: a reviewer cutting for length would most likely drop the byte-bounding clause, which is the only sentence in the paragraph that prevents a real failure.

---

## Trace 5 — an override, and its reversal

**Surface:** this audit's own instruction body, in the section describing the output.

The first draft of that section closed with:

> The schema above is a contract specimen under this audit's own taxonomy: the contract is active on every run, and a schema specifies it more completely than a filled-in sample would.

**Pass:** no operative clause; owned here; nothing follows from it at execution time; not mechanically checkable; positive record value as the rationale for choosing a schema over a sample; no transformation fires. **Route:** `ledger`, disposition `move`, enforcement axis `not mechanically checkable`.

**What the author did:** kept it anyway, at `stay` with confidence `low`, on the reasoning that it was the one place the audit demonstrated its taxonomy on itself, and that an instrument whose credibility rests on self-application loses something the routing rule does not measure.

**What review found:** that reasoning is an untyped exemption. "Loses something the rule does not measure" can be said of any rationale an author is attached to, and an exemption that admits everything protects nothing. The sentence was removed and the route applied.

**Why it is worth tracing:** the author holds the decision, and this is what holding it responsibly looks like — an override is legitimate, and it still has to survive being read back. The failure mode is not overriding; it is overriding on a reason that would justify keeping any sentence. When the stated reason for an exception does not narrow, the exception is not a judgment.

---

## Report fragment — a route, and the finding it could not hold

The traces above follow the pass to a destination. This shows what reaches the author afterward, and why the most useful result of a run sometimes fits in no route block at all.

**Surface:** this audit's own instruction body, in the section defining the destinations.

The route:

```
R9 — SKILL.md:58   tier1 → tier1   stay, contested

  > Delete is scoped to the surface under audit, not to the content's worth.
  From: "Delete is scoped to the surface under audit, not to the content's worth. A fact
  that belongs in another tool's documentation leaves this surface and keeps its value
  elsewhere; the route records where."

  Settled at step 3, Tier 1 admission: the clause binds behavior for the duration of this
  skill's work, so the load-tier question answers before any later test is reached.
  Enforcement: not mechanically checkable — whether a route records where content went is a
  judgment about what the report says, not a decidable property of it.
  No action — the clause is on the surface it belongs to.
  Confidence low — the placement is right and the clause is still redundant, and a route
  has no way to say both.
  Additional obligations: cluster — SKILL.md:54 and SKILL.md:74 carry the same rule.
```

And the finding beside it:

```
kind:        cross-route-cluster
claim:       The rule scoping Delete to the surface under audit is stated three times on
             one surface — the destinations table, pass step 2, and a standalone paragraph.
affects:     SKILL.md:54, SKILL.md:74, SKILL.md:58 — only the last emitted a route
no block:    Each instance is operative read alone, so each is admitted at its own tier and
             each disposition is stay. Two of the three were not contested and so emitted
             no block at all. The redundancy exists only in the relation between them.
consequence: Two statements could go with no loss, and the pass cannot say which, having no
             canonical-instance test.
confidence:  high
```

**Why it is worth recording:** the route is correct and nearly uninformative; the finding carries the result. Note also which step settled the route — step 3, not step 6. The steps run in order and the first to settle a clause fixes its destination, so a clause admitted at Tier 1 never reaches the Delete test. Recording step 6 would report that the pass considered deletion and declined, which it did not do.
