# Design rationale — F5 reference observation

Why the F5 reference-observation types have the shapes they have: what each replaced, what defect each closes, and which alternatives were evaluated and rejected.

You need this file when you are **editing or reviewing** the specification. An agent *executing* `/distill` does not — `SKILL.md` carries the whole execution contract on its own, and nothing here changes what the protocol does. Each section is anchored from the type's own definition line in `SKILL.md`'s TYPES block.

---

## OwnerId

`OwnerId` replaced a bare `String`. The reason is idempotence across pass rebuilds: `judgments(Λ)` reconstructs every pass at F4, so a re-derived request must yield the *same* key, or a `ResidualLedger` Defer on it reopens on the next dispatch under a fresh, differently-spelled owner string. Each arm therefore projects from content that changes only when the underlying thing genuinely changes, and each reuses an identity discipline the spec already carries elsewhere — so the type reads as an existing family rather than a new invention.

The invariant (an arm carries the SAME identity its store dedups by, never a subset) was checked per arm when the type was introduced:

- **`ContractField(field_name)`** — `contract.allowed_sources` never rebuilds under a different name, and a repeated locator among its entries is a repeated identity in that store. `field_name` plus the request's own `locator` already matches the store. Holds.
- **`Item(id)`** — `item.id` is exactly the identity `judgments(Λ)` binds items by. Holds.
- **`Decision(claim, subject_ref)`** — matches F0's bind exactly. `Λ.reception_premises` deduplicates `DecisionRecord` by **claim + subject_ref**, not by claim alone, because F0 binds every `adopted_unobserved` adoption under the SAME constant claim string with a distinct `subject_ref` per artifact. **This is the defect the widening closes**: a claim-only key collapsed two such records sharing a ledger locator into one `(owner, basis, locator)` `ref_key`, letting a disposition on one silently suppress the other. Holds.
- **`StopClause(clause_text)`** — `clauses(contract.stop_condition)` is itself a set of clause texts, so the clause text is the store's own identity. Holds.
- **`Target`** — the refuter's own `owner: target` fallback (`../agents/zero-memory-refuter.md`). Repeat mentions of one locator collapsing under it is the same idempotent merge every `ref_key` already performs, not a collision. Holds.

---

## RefObservation

**What the positive keyed lookup replaced.** The `Unresolved` arm formerly bound to its request by an exact-string match against an ordinary Findings-table row. That match never fired: a Findings row carries no `owner`, no `basis`, and no typed `locator` to match an `ObservedRefRequest` against. The string match is deleted, and all three arms now bind by the full `(owner, basis, locator)` key against their own typed row set.

**Why the lookup is positive rather than default-on-absence.** A reconciliation that fell through to a resolved outcome when no row matched would let `fixed_point` converge over a reference nobody verified. Making the absence of a match invalidate the whole verdict (re-dispatch) is the same discipline already applied to a verdict missing its per-category sweep trace or its Realization line.

**Why every arm carries `request`.** `EvidencedFinding` carries neither `owner` nor `basis`; `ResolvedRef`, `UnresolvedRef`, and `UnobservableRef` each carry both. Reading the pair off `request` on all three arms gives ONE routing path instead of a per-row one, and the repair site stays typed whichever row answered.

**Why the `Unresolved` arm reads its wire pair off the row.** `EvidencedFinding` REQUIRES its own `quoted_token`/`location`. `ObservedRefRequest` carries neither, and only the `Item(id)` owner projects one. Deriving the pair from `request.owner` therefore left the arm **unconstructible for the `ContractField`, `Decision`, and `StopClause` owners** — three of the four. Carrying the pair on the row closes that, and makes the arm read its siblings' fields by the same mechanism rather than by a per-owner special case. Where `owner = Item(id)`, the `id` is the identity the dispatch already carried, so the item lookup confirms rather than re-derives.

**Editing discipline.** No site *inside `SKILL.md`* restates `resolves_at`'s conditions: every description of a worklist outcome there names these three arms and points here and at `resolves_at` for what each means — never a "reachable" / "beyond tool reach" paraphrase, which is how the two predicates drifted apart before. The packaged refuter is the one deliberate exception, and it is not a lapse in this discipline but the case the discipline cannot reach: it runs in a fresh context and cannot dereference `SKILL.md`, so it necessarily carries the partition's operative conditions by value (`verification-contract.md#packaged-agent-contract-sync`). That copy is why the drift it can incur is closed mechanically rather than by this rule.

---

## UnobservableRef

**Why a channel and not a per-field leg.** A `granted-source` entry — a `contract.allowed_sources` reference the refuter cannot reach — is a consumer the specification would otherwise lack entirely: no F2 grounding classifies it and no F6 leg counts it. This row is what gives it any consumer at all, which is why the gap is closed by a channel rather than by adding another per-field leg.

**Why it is not an `EvidencedFinding`.** A finding asserts the reviewer looked and it failed. That is precisely what did not happen. Filing an unreachable reference as a finding would over-claim a check that was never performed.

**Why not a sweep row.** A sweep row is prose the caller *may* read; a verdict field is one it MUST consume. An unobservable reference the caller may skip is a reference nobody routes.

**Why the caller-side binding parallels `EvidencedFinding`.** Both are wire rows: the refuter emits identity as a `quoted_token`/`location` pair without an item handle, and the caller parses the pair into an `ItemId`. For a `granted-source` row, synthesis is the NORMAL path rather than a fallback — such an entry is not an F2 item and never had a tracked `ContextItem` to match, which is the same absence the channel exists to cover.

---

## UnresolvedRef

**What this row replaced.** The Findings-table exact-string match described under `RefObservation` above. This row is its typed replacement — the third full-key row, symmetric with `ResolvedRef` and `UnobservableRef`.

**Why the wire pair is carried here rather than derived.** See `RefObservation` above: without `quoted_token`/`location` on the row, `RefObservation.Unresolved` cannot be constructed for three of the four owner arms. The pair is on the row so the arm reads it exactly as its two siblings do, on a third source row, rather than the reconciliation deriving it per-owner.

**Why there is no `owner: Target` variant.** Unlike `UnobservableRef`, this row is scoped to dispatched entries only. A reference the refuter fails to resolve inside `target`'s own text with no dispatched request is an ordinary category-4 Findings row — it needs no caller routing, so it needs no typed row here.

---

## ZeroMemoryVerdict

**Why `unresolved_refs` rides the FAIL arm only.** This is deliberate, not an oversight for later prose to "fix" into symmetry with `unobservable_refs` / `resolved_refs`. The two are different kinds of fact. An unobservable reference is a limit of the *reviewer* — its durability class cleared, and the recipient may well resolve it — so it is Pass-compatible. An unresolved reference is a defect of the *record*: the reviewer reached it and it did not resolve. Certifying a record as portable while it points at an unresolved reference would tell the recipient they can act on something they cannot, which is the shape Rule 24's honest-label discipline exists to forbid.

**Why a deferred unresolved reference does not terminate.** A `Qd` Defer marks its ledger entry deferred, silencing the gate — but the next pass's `reference_worklist` rebuilds the same request from the unchanged contract field or stop clause, the refuter returns the same row, and `unresolved_refs ≠ ∅` keeps forcing Fail. Deferring would therefore trade a re-presented gate for a livelock with no gate to surface it. The entry is not deferral-excludable for that reason (see TYPES); the terminating dispositions are Resolve and Drop, because only those change what the next worklist assembles.

**Why both `unobservable_refs` and `resolved_refs` ride both arms.** Whether a dispatched reference was reached and confirmed, or lies beyond reach, is orthogonal to the Pass/Fail axis. A record can be fully comprehensible and still rest on references the reviewer could not reach or has affirmatively confirmed. A Pass carrying a non-empty `unobservable_refs` is exactly the case Rules 24 and 31 bound the label against.

**Why the deletion test credits only four sources.** Crediting the reception procedure's verification commands, execution scope, stop condition, and role as well would weaken the test into a different one — it would let the procedure's own scaffolding stand in for content the record does not carry.
