# Diairesis — /delimit (διαίρεσις)

Delimit a large body of work into right-sized execution units before its method is conducted (διαίρεσις: a division, a cutting-apart)

> [한국어](./README_ko.md)

## What is Diairesis?

A modern reinterpretation of Greek διαίρεσις (division) — a protocol that **decides where to cut a large body of work into execution units** when the granularity of the cut is undetermined, producing a WorkUnitMap (the set of cuts, referencing the external work-breakdown structure without owning it).

### The Core Problem

The work is known, but *where to slice it into units* is not (`GranularityUnderdetermined`): a Linear project / milestone set / issue tree spans many execution spans, and how to cut it into pieces that each fit one span is unclear. Cut wrong — units too big to execute in one span, too small to warrant their own, or split across a natural seam — and the downstream conduct and execution inherit the bad partition.

### The Solution

**Delimit over Order**: Diairesis reads the external WBS read-only, scans it for natural joints, and searches for the cut-set whose every unit fits one span, whose cuts fall at the work's joints, and whose units cover the whole body with no work orphaned. It presents each candidate cut for the user to settle and emits a WorkUnitMap. It **marks the cuts but does not order them** — sequencing the units is `/conduct`'s work. The two are duals across one seam: **cut, then conduct**.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Horismos | AI-guided | `BoundaryUndefined → DefinedBoundary` |
| Diylisis | AI-guided | `ContextTethered → Certificate` |
| **Diairesis** | **Hybrid** | **`GranularityUnderdetermined → WorkUnitMap`** |
| Hyphegesis | Hybrid | `MethodUnderdetermined → ConductedMethod` |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |

Diairesis carries one new operation — the partition/packing judgment — and composes the rest: `/inquire` when the WBS scope is too thin to cut, `/bound` for the joint candidates where a cut can fall, `/distill` for the per-unit span-fit predicate, and it feeds `/conduct` downstream. `/induce` (Periagoge) carries an internal move-family label "Diairesis" (the Platonic *division* move); the shared Greek root is cosmetic — that is a response-family label inside one protocol, this is a top-level protocol that partitions a work body.

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install diairesis@epistemic-protocols
```

## Usage

Invoke `/delimit` over a large body of work before it is conducted:

```
/delimit cut this Linear project into execution-sized units
```

Diairesis binds the external WBS read-only, scans it for natural joints (milestone boundaries, dependency seams, deliverable edges), and runs the packing search — proposing a cut-set whose units each fit one span. It surfaces the highest-leverage uncut region's proposed cut one at a time, with its span-fit verdict (Fits / Overflows / Underfills / Unportable — fit composes capacity with `/distill`'s portability-certification standard) and the current cut-set, for you to settle: accept the cut, move it to a different joint, split a unit that overflows, merge one that underfills — or move the boundary of an Unportable one, whose externalized record would not certify portable for its receiving span. When you signal the partition is complete, it cuts the remaining regions at their natural joints, asserts the three packing invariants — each unit fits one span, every cut on a joint, and coverage complete with no work orphaned — and emits the WorkUnitMap, which flows to `/conduct` as its work prospect.

## Three Packing Invariants

| Invariant | Meaning |
|-----------|---------|
| span_fit | Each unit fits one execution span (horizon × context lifecycle) AND its externalized record would certify portable for the receiving span (`/distill`'s standard) |
| natural_joint | Every cut falls at a natural joint, never mid-seam |
| coverage_complete | The units cover the whole body with no work left outside any unit — full coverage, no orphan (HARD convergence gate) |

The WorkUnit is an **execution-cut view** over the WBS: it references issue ids and floats between milestone and issue granularity, but never copies or owns the WBS's state. The external WBS stays the single source of truth — the WorkUnitMap carries a reference, not a snapshot, so downstream WBS changes are seen, never stale.
