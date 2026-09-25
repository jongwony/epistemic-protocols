# Wholes above one record — shapes, relations, assembly

Read when the whole the person means stands above one record — a line of work, a topic worked out in scattered pieces, or a concept prior work already settled. This is runtime-normative contract, not commentary. It supplies how found records are joined into one recognizable at that scope. Everything else — `Recognizable`, `Claim`, the story, the presentation, the answers, the closes — is typed in SKILL.md and is the same at every scope; this file adds no type the SKILL.md block does not already carry. Grounding at this scope is one read per member: each member's own record, opened at the span the cue reaches.

```
── WHOLES ABOVE ONE RECORD ──
members          -- the composing element IS SKILL.md's Member: a conversation, an artifact with its change history, a decision record, named by where it is and its root. There is no second type
Relation         = { from: Member, to: Member | Locator, what: String, support: String }
                  -- what joins two members, INFERRED at read time from what they carry: a shared identifier or reference, a change that touches what a conversation discussed, shared terms, time and place, a succession one record names; never read from a stored field
                  -- support names what in the records carries the relation. An inferred relation stays an inference: reading both endpoints does not by itself prove it
Locator          = { root: String, identity: Optional(String) }   -- the target of a relation that points at no record reached: a reference naming a record not found. A projection only, never a member: nothing is opened for it
assemble(found, cue) → List(Recognizable)   -- the judgment: which found records make one whole in the cue's shape, by the relations the records support, stated in Recognizable.joins
                  -- a method that computes groups (co-occurrence, spectral, diffusion from the cue's records) may propose candidates; it does not decide what the whole is
                  -- no fixed route: follow whichever relations the cue's axes make worth following, from the records found or across the population the context has bounded; a reach past that boundary is offered, not run

shape by Whole    -- the story is told in this shape, each sentence resting on an opened record
  line     : origin → development → arrival across the members, in the order the records attest
  topic    : the fragments, then where the records say it last stood
  concept  : where it was forged, then the member carrying it as settled   -- recognized only where a record carries it as settled; without that record this is not the shape

── INVARIANTS ──
  read-only               : assembly reads the records it joins and writes to none of them, nor to any index
  supported-relations     : a recognizable joins only members whose relations a record supports, and says what joins them
  partial-recovery        : a relation to a record not reached is kept as a Locator and reported; what it points at is unknown — not yet written, moved, or lost is not claimed without evidence
  disclosed-coverage      : what was followed, what was not reached, and which roots were searched are reported beside the story or in the round that offers the wider search

── KNOWN FAILURE MODES (wholes above one record) ──
SparseRelations      : records found, and too few supported relations join them into the whole meant — nothing to present: the open question while the person has added nothing, then the wider search where one is worth offering, each reporting what was followed
BrokenReference      : relations resolve mostly to records not reached — report them as notes; the assembled whole may be too thin to recognize
WholeMisread         : the whole read as the wrong shape — seen when a correction describes a different shape; the next pass re-reads the cue and assembles again
-- One record would have answered: no case here. A recognizable of one member is the whole, and a whole misread above one record is WholeMisread
-- Index taken as evidence: no case here either. The story is composed from opened records at this scope as at every scope (SKILL.md IndexAsEvidence), so a claim across records — "this is where it began", "first coined here" — is asserted only where a member's record carries it
```
