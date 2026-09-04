# Scan above session scope — shapes, edge inference, assembly, per-claim confirmation

Read when `V.unit ≠ session` — the user names a whole line of work, a topic worked out in scattered pieces, or a concept prior sessions already settled. This is the realization of the `── SCAN ABOVE SESSION SCOPE ──` formal block: runtime-normative contract, not commentary. It supplies how `Scan_{Track,Unit}` joins the candidates `Scan_{Track}` returns into recognizables at that scope, the connectivity term `Rank` adds there, and what `Confirm` reads. Everything else — `Recognizable`, `Claim`, `Verdict`, `Confirm`, `Rank`, the gate, its answers, the budget, both terminals — is typed in SKILL.md and is the same at every scope; this file adds no type the SKILL.md object does not already carry.

Not this reference: `V.unit = session` (the default path); the cases must be newly found (`/inquire`); the concept is not yet formed and must be crystallized (`/induce`); the recall is of decision intent to be reverse-traced (`/elicit`).

```
── SCAN ABOVE SESSION SCOPE (realization) ──
Scan_{Track,Unit}(Store, V) = Assemble_{V.unit}(Traverse(C, infer_edges(C, Σ)))  where C = Scan_{Track}(Store, trace(V))

members          -- the composing element IS Candidate (session_id, runtime, cwd, topic, keywords, fingerprint, cross_refs, confidence): no second type. Edge inference reads only these fields plus the recency the spine read declares; it never assumes a field Candidate lacks
Locator          = { runtime: Source, session_id: Optional(SessionId) }   -- a member's resume projection, dereferenced to its record through the runtime reference (references/claude.md, references/codex.md). session_id = Null ⇒ the member is carried (its anchors and keywords still count for edges) but is non-resumable and no record can be opened for it, so every claim sourced from it stays unattested; a fork member's record is its substitute capture and its handle is its parent's (references/fork-resume.md). A projection only, never a node key: nodes are candidates, so two non-resumable members never collapse into one

shape by Unit    -- Recognizable.narrative is one narrative in this shape, put first
  line     : members ordered origin → development → arrival      -- where it began, how it developed across sessions, where it arrived
  topic    : members as the fragments on one topic, then its standing   -- the fragments + where the records attest the topic last stood
  concept  : the members that forged the concept, then the member carrying it as settled   -- recognized only, never formed here: absent a member already carrying the concept as settled, the recall is not this shape (formation → /induce)

Edge             = { from: Candidate, to: Candidate | Locator, kind: ∈ {succession, topic, concept, plain} }
                  -- kind and to are INFERRED at read time from stored anchors (cross_refs) + shared keywords/topic + cwd + the recency the spine read declares; never read from a stored field
                  -- cross_refs hold StructuredAnchor {memory, github_issue, github_pr} and LegacyAnchor strings (SKILL.md TYPES: Anchor); a legacy string extends an edge as kind-unknown, never rejected. succession/topic/concept/plain are traversal ROLES, not stored kinds
                  -- to is a Locator when the anchor points at no written record: not-yet-written knowledge, skipped, never an error
Graph            = (Set(Candidate), Set(Edge))   -- STRUCTURAL TYPE: the edge set is reconstructed by traversal, never pre-materialized; invariants in ── GRAPH INVARIANTS ──
infer_edges      = (Set(Candidate), Σ) → Set(Edge)
Traverse         = (Set(Candidate), Set(Edge)) → (Set(Candidate), Set(Edge))   -- Unit-dispatched: follow inferred edges outward to the sub-graph reachable from the entry candidates, reading across partitions and writing to none
traversal_scope  = the pair Traverse returned, with each skipped broken-link edge noted   -- the scan step writes it to Λ.traversal_scope (SKILL.md TYPES: TraversalScope); Qc's evidence and the NullMatch diagnosis read it from there, both sitting past a turn yield this traversal does not survive
Assemble_{Unit}  = (Set(Candidate), Set(Edge)) → List(Recognizable)   -- recognizables in Unit's shape from the edge-connected sub-graph, never from a global join over the store: unit = V.unit, members ⊆ the traversed candidates, narrative in the shape, claims per below, confidence per Rank
connectivity     -- the term Rank adds at this scope: recall-trace alignment + inferred-edge connectivity strength assign Recognizable.confidence (SKILL.md TYPES: Rank); Confirm then caps it at medium while any claim stays unattested

claims           -- Assemble writes each reading the narrative will assert as fact beyond a member's own index entry (origin attribution, coinage timing, a quoted decision) as a Claim sourced to the ONE member it originates from, verdict unattested until Confirm reads that record (SKILL.md TYPES: Claim, Verdict, Confirm)
Confirm at this scope: each claim against SSOT(claim.source) — its OWN record, opened through the runtime reference; a recognizable spans several records and there is no single record for the whole. |claims(O[top])| reads, bounded by what will be rendered and never by the traversed sub-graph. On a corrected verdict it overwrites claim.content with the record's value, so the index reading is discarded in the field itself and the verdict carries no payload beside it
                  -- confirmed ⇒ assert as settled; corrected ⇒ assert claim.content, which Confirm has already replaced with the record's value; unattested ⇒ provisional or omitted, never as fact, and the recognizable is at most medium — so it never reaches the SingleObvious relay on an unread claim, the cap reaching that guard because Phase 1 binds `O[top] := Confirm(O[top])`
                  -- `Recalled context currency is not fidelity` applied per record: the recognizable establishes that these members form THIS whole, not that its outcome still holds

── GRAPH INVARIANTS ──
Graph is a STRUCTURAL TYPE (sourced from partitioned stores + lifecycle churn, not a knowledge-federation ontology). Four invariants hold:
  no-central-aggregator : no central index; the graph exists only as the inferred union of per-candidate read-time connections, reconstructed by traversal
  edge-based            : a recognizable is assembled by FOLLOWING inferred edges between candidates, never by a global join over a flat store
  isolation-preserving  : each partition owns its own writes; traversal reads across partitions (in the Claude realization, the per-project hypomnesis directories references/claude.md declares) and writes to none
  broken-link-tolerant  : an edge to a missing record is not-yet-written knowledge — skipped, surfaced as a traversal-scope note, never a failure

── KNOWN FAILURE MODES (scan above session scope) ──
SparseEdges          : entry candidates exist but too few shared anchors/keywords/metadata infer edges joining them; Assemble = ∅ with a non-empty entry — |O[]| = 0 as for any scan (SKILL.md FLOW): the probe asks granularity and boundary before any NullMatch, and the NullMatch diagnosis reports Λ.traversal_scope
BrokenLinkChain      : inferred edges resolve mostly to records never written (lifecycle gap) — surface Λ.traversal_scope as a note, not an error; assembled recognizables may be too thin to recognize
UnitMismatch         : V.unit classified as the wrong whole — detected as a granularity answer or a Reorient(d) describing a different shape; enrich or rebind re-classifies V.unit and the scan re-runs at the new scope
IndexAsEvidence      : a load-bearing claim ("this is where it began", "first coined here") rests only on INDEX files — Confirm reads the originating record before it is asserted; an unattested claim stays provisional and caps confidence, so it never reaches the relay as fact
-- One session would have answered: no case here. A recognizable of one member IS the session-scope object, and a V.unit misjudged above session is UnitMismatch
```
