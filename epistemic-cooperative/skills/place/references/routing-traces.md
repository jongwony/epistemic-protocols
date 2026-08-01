# Routing traces

Complete traces of the pass running over real instruction prose. Read one when a placement is ambiguous and a comparable case would settle it, or when a caller asks to see the procedure applied rather than described.

Each trace quotes its source clause in full, so no trace depends on reaching the file it came from. Surfaces are named by kind rather than by path, because the same shapes recur across projects.

---

## Trace 1 — rationale carrying no action

**Surface:** a prose-audit skill's instruction body, in the section stating what the audit is for.

**Clause:**

> This drift survives deterministic structural checks — it is a meaning-level pattern, so a semantic reviewer catches what literal pattern matching cannot.

**Pass:**

1. *Extract.* One sentence, no operative clause inside it. Nothing names an action, a threshold, or a condition. Residue extraction produces no standalone instruction.
2. *Ownership.* A fact about this surface's own instrument. Owned here.
3. *Load tier.* Does it change action selection on an arbitrary turn? No — a model executing the audit behaves identically whether or not it has read this. Does it determine what to load? No. Fails Tier 0; fails Tier 1 for the same reason.
4. *Enforcement.* Nothing checkable.
5. *Ledger.* Positive record value: it states why this instrument exists alongside the deterministic layer, which is the design rationale a future reader needs to reconstruct the split. Admitted.
6. — 7. Not reached.

**Route:** ledger, disposition `move`.

**Why it is worth tracing:** this is the most common shape in a mature instruction file — a true, well-written, load-bearing-sounding sentence that changes no behavior. It survives every review that asks "is this accurate?" and only moves under a review that asks "does anything follow from it?"

---

## Trace 2 — one sentence, two destinations

**Surface:** the closing confidence note of a prose-audit skill.

**Clause:**

> Promoting any recurring finding pattern into a deterministic check is a separate, evidence-gated step — it waits on a pattern proving stable across varied prose, not on a single audit run.

**Pass:**

1. *Extract.* Two units. An operative condition: promotion to a deterministic check requires a pattern stable across varied prose, and a single run does not qualify. And a rationale fragment framing that as a separate step. Rewritten standalone: *"Promote a finding pattern to a deterministic check only after it holds across varied prose; a single run is not sufficient evidence."*
2. *Ownership.* Owned here.
3. *Load tier.* The rewritten instruction binds a decision an author makes while working on this instrument — Tier 1. It does not govern an arbitrary turn, so not Tier 0.
4. *Enforcement.* Not mechanically checkable; "stable across varied prose" has no decidable test.
5. *Ledger.* The remaining fragment carries the reasoning and goes here.
6. Not reached.
7. *Transformations.* The rewrite contains "is not sufficient evidence" — a negative clause. Salience: stating only the intended path ("promote only after it holds across varied prose") would drop the boundary that a single passing run does not count, which is the specific over-reading the sentence exists to prevent. The negative clause is load-bearing and stays.

**Route:** `split` — the instruction stays at Tier 1 as a standalone sentence; the rationale moves to the ledger.

**Why it is worth tracing:** step 4 of residue extraction is what saves this one. Read alone, *"Promote a finding pattern to a deterministic check only after it holds across varied prose"* is complete; the "single run" clause had to be restored as a subordinate clause because without it the reader supplies the wrong threshold.

---

## Trace 3 — a directive resting on an unsupported claim

**Surface:** the "what to evaluate" section of an audit whose principle concerns examples.

**Clause:**

> A principle that needs examples to be understood is underspecified; the fix is to sharpen the principle, not to patch it with examples.

**Pass:**

1. *Extract.* One operative directive with a justification clause attached.
2. *Ownership.* Owned here.
3. *Load tier.* Directs the audit's own judgment at execution time. Tier 1.
4. *Enforcement.* Not checkable.
5. — 6. Not reached; it stays.
7. *Transformations.* Salience flags the trailing "not to patch it with examples" as a negated anchoring, but that is the smaller problem. The larger one surfaces at classification: the clause makes a general claim about examples, and the example taxonomy says examples are not one object. Applied to a contract specimen the directive is contradicted by measurement — a single specimen reduced parameter errors substantially where prose alone had failed. So the directive is not merely negatively phrased; it is overbroad.

**Route:** `rewrite`, confidence `high`. Proposed: *"An application example that a sharper principle would make unnecessary is anchoring; sharpen the principle. A contract specimen is a separate object — keep the minimum one where prose has demonstrably failed."*

**Why it is worth tracing:** the transformation step surfaced a content defect rather than a phrasing defect. When a rewrite for salience keeps failing to preserve directive force, the reason is often that the directive is claiming more than it can.

---

## Trace 4 — a prohibition that stays, and a mirror

**Surface:** a project instruction file, in a section listing verification commands.

**Clause A:**

> Do not run the packaging test suite concurrently with static protocol verification when liveness tests may mutate live instruction files.

**Pass:**

1. *Extract.* One operative condition, already standalone.
2. *Ownership.* A fact about this project's own toolchain. Owned here.
3. *Load tier.* It must be known before either command is issued, and a model choosing how to parallelize verification would otherwise not know to serialize. Tier 0.
4. *Enforcement.* Mechanically checkable in principle — a lock or a mutually exclusive task definition would enforce it. If the host has no such channel, the finding is the missing guard.
5. — 6. Not reached.
7. *Salience.* The prohibition names the forbidden combination. Restating positively ("run these serially") preserves the directive but loses the condition — the hazard is specific to the case where liveness tests mutate live files, and a blanket "run serially" over-constrains. The mention is load-bearing and stays; the evidence also runs against deleting load-bearing negative constraints by default.

**Route:** `stay` at Tier 0, with an enforcement route recorded as the canonical home if the host adds a guard, and the Tier 0 sentence retained as a justified mirror — the guard would stop a run already started, while the sentence stops it from being started.

**Clause B:**

> Node.js 22 or later is required; the continuous integration pipeline pins Node 22.

**Pass:** ownership is local; the version constraint is enforced by the pipeline, so enforcement is the canonical home. The Tier 0 sentence survives as a justified mirror for a different reason than clause A: the pipeline reports the mismatch after a contributor has already run the work locally on the wrong runtime.

**Why it is worth tracing:** both clauses show enforcement candidacy without prose retirement. A guard and an instruction catch the same violation at different moments, and the audit records both rather than treating the guard as making the sentence redundant.

---

## Trace 5 — residue extraction on a dense paragraph

**Surface:** a skill wrapping an external command-line tool, describing its event log.

**Clause:**

> The wrapper streams the event log to a file beside the prompt. Open it to check a long run mid-flight. Expect buffered bursts rather than a smooth tick: the tool block-flushes, so a mid-run read shows accumulated progress arriving in chunks (verified: progress events were present in the file well before the run finished). It is a bystander — it never gates the result path, so reading it cannot destabilize the run, and there is no always-on transform to pay for. Byte-bound it or filter with a field filter; a bare line-based tail will not cap it, because one event can be many megabytes.

**Pass:**

1. *Extract.* Marking every clause naming an action, a threshold, or a condition yields: the log's location; the action of opening it mid-run; the expectation of buffered chunks; the byte-bounding requirement with its stated reason. What remains unmarked: the verification note in parentheses, and the bystander reasoning about why reading is safe.

   Rewritten standalone: *"The wrapper streams the event log to a file beside the prompt; open it to check a long run mid-flight. Read it byte-bounded or with a field filter — one event can be many megabytes, so a line-based tail will not cap it. Expect progress in buffered chunks rather than a smooth tick."*

2. *Ownership.* The log is the wrapper's own surface, not the wrapped tool's. Owned here. (Had the paragraph enumerated the wrapped tool's accepted flag values, that part would route out under step 2 and never reach step 3.)
3. *Load tier.* Tier 1 — it binds behavior while working with this wrapper, and nothing about it governs an arbitrary turn.
4. *Enforcement.* Not checkable.
5. *Ledger.* The verification note ("progress events were present in the file well before the run finished") is an epistemic annotation: real, worth recording, and no action follows from reading it. The bystander reasoning is rationale for a safety claim already carried by the instruction to open the file. Both admitted.
6. Not reached.
7. *Transformations.* None fire. "Will not cap it" is a negative clause but names the specific failure a reader would otherwise walk into, and it carries the threshold.

**Route:** `split`. Tier 1 keeps the compressed instruction; the ledger takes the verification note and the bystander reasoning.

**Why it is worth tracing:** the paragraph loses roughly half its length and none of its operative content. It is also the clearest case for why deletion is the wrong instrument — a reviewer cutting for length would most likely drop the byte-bounding clause, which is the only sentence in the paragraph that prevents a real failure.

---

## Trace 6 — self-application

**Surface:** this audit's own instruction body, in the section describing the output.

**Clause:**

> The schema above is a contract specimen under this audit's own taxonomy: the contract is active on every run, and a schema specifies it more completely than a filled-in sample would.

**Pass:**

1. *Extract.* No operative clause. It asserts a classification rather than binding an action.
2. *Ownership.* Owned here.
3. *Load tier.* Nothing follows from it at execution time.
4. — 5. Not checkable; it does carry record value as the rationale for choosing a schema over a sample.
7. Not reached.

**Route by the pass alone:** ledger, disposition `move`.

**Judgment:** kept anyway, at `stay` with confidence `low`. The sentence is the one place where the audit demonstrates its own taxonomy on itself, and an instrument whose credibility depends on self-application loses something a routing rule does not measure when that demonstration is moved out of sight.

**Why it is worth tracing:** the pass produced a route and a human overrode it. That is the intended relationship. A route is an argument for a placement, and the author holds the decision — recording the override, with the reason, is how a contested placement stays visible instead of being relitigated at every future review.
