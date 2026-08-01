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

**Fenced blocks are inspected by role, not excluded.** A fenced block carries one of the roles in the example taxonomy below — schema, template, contract specimen, demonstration — and the taxonomy is the reason to look at it. A block that fully specifies a contract belongs where the contract is active and generally stays; a block that walks through a sampled procedure is a demonstration and routes on demand. Source code that is the delivered artifact rather than an instruction is out of scope.

**Out of scope** — prose written for a human reader (project READMEs, design notes, published documentation), where an example serves comprehension and the load-tier argument does not apply.

## The destinations

Six, exhaustive. Each is a canonical home, and a clause may additionally warrant a justified mirror (see Enforcement candidacy).

| Destination | Admission criterion |
|---|---|
| **Tier 0 — standing surface** | Loaded on every turn: project instruction files, rule files, and skill frontmatter descriptions. Admitted when the clause changes what the model does on an arbitrary turn, or determines which surface to load in a situation the model must recognize before loading anything. |
| **Tier 1 — invocation surface** | Loaded when its skill is triggered: the body of a skill instruction file. Admitted when the clause binds behavior for the duration of that skill's work. Being on demand does not make size free — a triggered body arrives whole. |
| **Tier 2 — on-demand surface** | Opened deliberately: reference material a surface points to. Admitted when the clause is needed while performing one specific sub-task, and reading it at any other time costs attention without changing an action. |
| **Enforcement** | Admitted when a violation is mechanically checkable and the host has a channel that checks it. |
| **Ledger** | Admitted on positive record value: rationale, provenance, a trade-off, a rejected alternative, or an epistemic status that a future reader needs to reconstruct why the surface says what it says. |
| **Delete** | Admitted when no operative, routing, diagnostic, enforcement, or record value remains after residue extraction. |

Absence of runtime relevance does not by itself admit a clause to the ledger. Without a positive record test the ledger becomes the place everything goes, and Delete stops firing.

## Unit of judgment

- **Scan unit** — the sentence. Read the surface sentence by sentence.
- **Routing unit** — the decision-bearing clause. One sentence can hold a standing-surface clause and a ledger clause; routing the sentence whole would misplace one of them.
- **Provenance** — the parent sentence, retained on every route so the author can find what was split.

## The pass

Run in order. The earlier tests are coarser: each one can settle a clause without the later questions arising.

**1. Extract the decision-bearing clauses.** Apply residue extraction (below) before judging placement. Placement judged on an unextracted paragraph routes the rationale and the operative clause to the same destination, which is how routing degrades into deletion.

**2. Ownership.** Is this a fact about this surface, or about another tool's surface? A file that wraps an external command, API, or model accumulates that tool's option space — its accepted values, its version differences, its error taxonomy. Such content is accurate and drifts on the other tool's schedule, where nobody reviewing this surface will see it go stale. Route it out of this surface and name the owner that should carry it; moving it to a reference here only relocates the drift. **Exception:** a routing or index surface exists precisely to say which external thing to reach for, so a cross-tool fact that determines what gets loaded is owned here.

**3. Load tier.** Choose Tier 0, 1, or 2 by the admission criteria above. Two questions decide Tier 0 admission: does this change action selection on an arbitrary turn, and does it determine what to load in a situation the model must recognize unprompted? A clause that answers no to both is a relocation candidate, not yet a deletion candidate.

**4. Enforcement candidacy.** Is the constraint mechanically checkable, and does the host have a channel that checks it? If so, the enforcement channel is its canonical home — a guard that rejects a bad value converts a silent wrong result into a loud stop, which is worth more than prose describing the same value. Where the constraint should be enforced and is not, the finding is the missing guard, not a longer paragraph. **Enforcement does not automatically retire the prose.** A validator reports during or after the action; an instruction shapes the action before it happens. When both are load-bearing, record the enforcement channel as canonical and the runtime sentence as a justified mirror, stating what each one catches that the other does not.

**5. Ledger.** Apply the positive record test above.

**6. Delete.** Only after 1–5 leave nothing.

**7. Transformations.** These change how a clause is written; they do not choose its destination, so apply them once a destination is settled.

- **Salience.** Does naming this in order to forbid it introduce it? A written prohibition puts the named action into the context of every session that loads the surface. The rewrite is valid when stating only the intended path preserves both the directive's force and the boundary it marks — where it does, prefer the positive statement, which occupies the same space and leaves no residue. Where it does not, the prohibition stays: the evidence runs against deleting load-bearing negative constraints by default, and a mention that marks a genuine boundary, a contract, a legacy input, a migration target, or a fallback loses that boundary when removed. A section whose declared role is naming failure modes — an anti-pattern list, a diagnostic checklist, a review vocabulary — is compliant by purpose, because negative wording is the content there rather than an instruction.

- **Friction.** Does a pre-assembled example make a high-privilege or destructive path the frictionless one? A complete, ready-to-run command line for an operation the surface elsewhere gates lowers the cost of exactly that operation: the gate has to be read to work, while the command only has to be seen. Trim the pre-assembly, keeping the capability documented in the options. This is a safety argument about copyable artifacts and is scoped to them — it is not a general argument against examples, which the taxonomy below handles instead. The same reasoning at smaller stakes covers an example passing a flag that is already the default: it teaches a habit that does nothing and propagates into every example copied from it.

## Judging an example

An example is not one object, and the two judgments that apply to it point in opposite directions depending on which kind it is. Classify before routing.

| Kind | What it does | Standing-surface rule |
|---|---|---|
| **Illustrative gloss** | Fixes the boundary of a term the surface coins | Keep one where the term is always needed and the gloss materially changes how the surface is read |
| **Contract specimen** | Pins an exact shape — a structure, a command syntax, a parameter binding, a template | Keep the minimum specimen where the contract is universally active and prose alone has demonstrably failed. Prefer a schema or grammar wherever one fully specifies the contract |
| **Behavioral demonstration** | Teaches a procedure through an input-to-output pair or a trajectory | Route to the on-demand surface. This kind carries the highest risk of one sampled workflow hardening into default policy |
| **Negative demonstration** | Displays a bad output or a failed trajectory | Route to diagnostic reference; it is read when detecting or repairing that specific failure |
| **Prohibition / negative constraint** | States a boundary | Not an example. It goes through the salience transformation and the enforcement test, not through this table |

The screening question when a clause is an example: **is this a specimen or a demonstration?** A demonstration routes to the on-demand surface. A specimen is the only kind that earns a place on the standing surface, and only where prose has been observed to fail without it.

**Frontmatter descriptions are judged differently.** A quoted trigger phrase in a description is not an example of the skill's behavior — it is the routing signal that decides whether the skill loads at all. Judge it by whether it triggers too often or too rarely, not by whether it is an instance.

## Residue extraction

Never move a paragraph whole. Operative clauses hide inside rationale.

1. Mark every clause that names an action, a threshold, or a condition.
2. Rewrite those clauses as standalone instructions on the surface they bind.
3. Route what remains.
4. Read each new instruction alone. Where it no longer holds without the removed context, restore the minimum context as a subordinate clause.

Step 4 is the one that fails silently. An instruction that reads correctly to someone who just read the original paragraph can be unreadable to a model that never saw it.

## Output

Emit a single JSON object as the final assistant message, conforming to this schema.

```
Report := {
  summary: {
    files_audited:  integer,
    units_scanned:  integer,     -- decision-bearing clauses examined
    units_routed:   integer,     -- entries in routes
    by_destination: { <destination>: integer },
    unresolved_bindings: integer
  },
  routes: [ Route ]
}

Route := {
  file:         string,          -- repo-relative path
  line:         integer,
  excerpt:      string,          -- the decision-bearing clause, verbatim
  parent:       string,          -- the sentence it was extracted from
  current_tier: "tier0" | "tier1" | "tier2" | "enforcement" | "ledger" | "unclassified",
  disposition:  "stay" | "move" | "split" | "rewrite" | "delete",
  destination:  "tier0" | "tier1" | "tier2" | "enforcement" | "ledger" | "delete",
  binding:      string | null,   -- host-declared target; null when unresolved
  test:         string,          -- the pass step that settled it
  kind:         string | null,   -- example kind, where the clause is an example
  mirror:       string | null,   -- justified secondary home, with what it catches
  rewrite:      string | null,   -- proposed restatement, for rewrite and split
  rationale:    string,          -- one sentence
  confidence:   "high" | "low"   -- low where the judgment is contested
}
```

Emit a `Route` for every unit whose disposition is other than `stay`, and for any `stay` whose placement was contested. Count the rest in `units_scanned` so the denominator stays visible. When nothing routes, emit the object with an empty `routes` array; the summary always emits.

The schema above is a contract specimen under this audit's own taxonomy: the contract is active on every run, and a schema specifies it more completely than a filled-in sample would.

## Reference material

- `references/routing-traces.md` — complete routing traces over real surfaces. Read when a placement is ambiguous and a comparable case would settle it, or when the caller asks to see the procedure run.
- `references/evidence.md` — what the empirical record supports, at what strength, and where it runs out. Read when a routing judgment is challenged, or when an author asks on what basis a rule stands.

## Confidence

An advisory, human-reviewed instrument. Routes are candidates for an author to weigh, not automatic edits.

The load-tier distinction rests on measured architecture: a skill's frontmatter is preloaded and its body is read on trigger, so the two are genuinely different surfaces. The rest — six destinations, the pass order, the example taxonomy, routing demonstrations to the on-demand surface — are design hypotheses that organize the available evidence rather than conclusions the evidence forces.

**Standing limitation.** There is no held-out evaluation channel: nothing measures whether contract violations rise or fall after a surface is routed. Every judgment here therefore rests on argument. Treat a claim about what routing achieves as untested, and never infer that deleting a clause is safe from the absence of evidence that it is load-bearing.

## Self-application

This skill's whole packaged surface is in scope for its own audit — frontmatter, this file, and both reference files. Exempting the reference files would let the most anchoring content in the package escape the audit that governs it. Routes against this skill are first-class.

## Distinction

| Surface | Mechanism | What it handles |
|---|---|---|
| Deterministic checks | Literal pattern matching and structural validation | Structural drift between coupled artifacts; literal pattern leaks |
| `/place` | Claude-judge placement classification over decision-bearing clauses | Which surface a clause belongs on, and what it must be rewritten to before it moves |

A deterministic check answers whether a surface is well-formed. This audit answers whether its content is in the right place, which no pattern match reaches.
