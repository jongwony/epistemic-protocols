# Verification contract — what the static checks lock over this skill

What `/verify` mechanically enforces about `SKILL.md` and the packaged refuter agent, and — just as important — what it does not.

You need this file when you are **editing** the specification or the packaged agent, or when you are judging whether a claim about applied rigor is honest. An agent *executing* `/distill` never does: nothing here changes what the protocol does at runtime, and `SKILL.md` states every rule these checks happen to enforce as a rule in its own right, not as a consequence of being checked.

---

## verdict-arity

Holds every positional `Pass(…)` / `Fail(…)` occurrence in `SKILL.md`'s own formal blocks to the arity `ZeroMemoryVerdict` declares in TYPES. A site that binds fewer fields than the constructor declares fails the check.

The rule itself lives in `SKILL.md` (a positional pattern binds every field; a site needing only some fields uses named access). This check is what makes forgetting it visible rather than silent — the defect it was built for was `Fail` growing from 4-ary to 5-ary while two backstop guards kept destructuring it 4-ary, dropping the newest field from both wildcard sites without any surface disagreeing.

**Scope**: `diylisis` only. A name-based scan across other protocols hits real homonyms — `hyphegesis` declares `Compose(via op)` as a user-move constructor and separately uses an unrelated `Compose(RVᵣ, RVᵣ, op)` value-composition operator in the same file. Widening the check would need a disambiguation that has not been built, and would report a false defect outside this branch's mandate.

**Boundary walk**: the scan crosses physical line breaks — a constructor whose field list wraps is one occurrence, not a skipped one — and is bounded by the formal block, so a stray parenthesis in prose below the fence cannot drag it out of the region. A constructor that opens inside a block and never closes fails the check rather than being skipped: it is malformed on its face, and skipping it would leave the success message claiming a coverage the scan did not deliver.

---

## packaged-agent-contract-sync

`../agents/zero-memory-refuter.md` holds a **copy** of this skill's F5 dispatch-input membership and verdict-table schemas, not a reference to them. That is deliberate: the refuter runs in a fresh context with no access to `SKILL.md` and cannot dereference `F5Input`, so it is a consumer that must receive the list by value. A copy drifts; this check is what catches the drift, so the correspondence sits somewhere a human does not have to watch.

Mechanically reconciled surfaces (eight):

| agent side | SKILL.md side |
|---|---|
| `## Inputs` bullets | `F5Input` fields |
| Findings table columns | `EvidencedFinding` fields |
| Category-sweep table columns | `SweepTrace` fields |
| Unobservable-references table columns | `UnobservableRef` fields |
| Resolved-references table columns | `ResolvedRef` fields |
| Unresolved-references table columns | `UnresolvedRef` fields |
| realization value set | `F5Realization` |
| advisory-tag set | `A_tag` |

Checklist-category containment is additionally checked one-directionally (agent → SKILL.md).

Three input bullets carry a name distinct from their `F5Input` field (`activation` ↔ `activation_edge`, `contract_confirmation` ↔ `cp_record`, `recipient_profile` ↔ `contract`). These normalize through an explicit alias table inside the check — never a fuzzy or substring match. Two guards close the drifts that used to pass through that normalization: a **collision** guard (bullet count must equal the normalized-name count, so a bullet added beside its own alias fails) and a **stale-alias** guard (every alias key must still name a bullet that exists, so a rename onto an alias's target with the alias left behind fails).

**What it buys**: a member added to, dropped from, or bare-renamed on one side without the matching edit on the other fails `/verify`.

**What it does NOT catch, and is not claimed to**:

- A semantic drift where BOTH sides change together in a way that leaves the compared name-sets equal but the correspondence wrong — for example the alias table's key→value pairing silently scrambled so each alias still lands on *some* field, just the wrong one. Set equality cannot see the swap.
- A member whose MEANING changed while its NAME held still — `contract`'s exposed fields narrowing inside `HandoffContract`, or a bullet's prose going stale, with the key itself untouched.
- Drift inside a table's ROW content. Only column-header and field-name SETS are compared, never cell values or prose.
- The deletion of an F5 mechanism outright, rather than its drift.

Those remain the manual semantic-closure sweep this project requires of protocol edits.

---

## tool-grounding

Validates annotation vocabulary and, for mandatory classifications, that each binding also appears in PHASE TRANSITIONS with `[Tool]` notation.

Its parser does not reach every binding line. Multiword operation names (`Seam transition to a declared next protocol`), subscripted names, and parenthesised operands do not parse, and an unparsed line is annotation- and phase-link-unchecked. The check reports the ratio it actually covered and warns with the residue named, rather than claiming consistency it did not establish. The residue is repo-wide and pre-existing; closing it is tracked separately.
