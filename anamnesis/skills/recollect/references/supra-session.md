# Find above session scope — shapes, edge inference, assembly

Read when `V.unit ≠ session` — the user names a whole line of work, a topic worked out in scattered pieces, or a concept prior sessions already settled. This is the realization of the `── FIND ABOVE SESSION SCOPE ──` formal block: runtime-normative contract, not commentary. It supplies how `Find` joins the candidates `Scan_{Track}` returns into recognizables at that scope and the connectivity term `Rank` adds there. Everything else — `Recognizable`, `Excerpt`, `Ground`, `Present`, the answers, the budget, both terminals — is typed in SKILL.md and is the same at every scope; this file adds no type the SKILL.md object does not already carry. Ground at this scope is one read per member: each composing session's own record, opened for the excerpt the cue reaches.

Not this reference: `V.unit = session` (the default path); the cases must be newly found (`/inquire`); the concept is not yet formed and must be crystallized (`/induce`); the recall is of decision intent to be reverse-traced (`/elicit`).

```
── FIND ABOVE SESSION SCOPE (realization) ──
Find(Store, V) = Assemble_{V.unit}(Traverse(C, infer_edges(C, Σ)))  where C = Scan_{Track}(Store, trace(V))

members          -- the composing element IS Candidate (session_id, runtime, cwd, topic, keywords, fingerprint, cross_refs, confidence): no second type. Edge inference reads only these fields plus the recency the spine read declares; it never assumes a field Candidate lacks
Locator          = { runtime: Source, session_id: Optional(SessionId) }   -- a member's record projection, dereferenced through the runtime reference (references/claude.md, references/codex.md); Ground opens the record it points at and Excerpt.locator is what it resolved to. session_id = Null ⇒ the member is carried (its anchors and keywords still count for edges) but no record can be opened for it: Ground yields an empty excerpt, the narrative asserts nothing from it, and the prose says it is non-resumable; a fork member's record is its substitute capture and its handle is its parent's (references/fork-resume.md). A projection only, never a node key: nodes are candidates, so two non-resumable members never collapse into one

shape by Unit    -- Recognizable.narrative is composed from the members' excerpts in this shape, put first
  line     : members ordered origin → development → arrival      -- where it began, how it developed across sessions, where it arrived
  topic    : members as the fragments on one topic, then its standing   -- the fragments + where the records attest the topic last stood
  concept  : the members that forged the concept, then the member carrying it as settled   -- recognized only, never formed here: absent a member whose record carries the concept as settled, the recall is not this shape (formation → /induce)

Edge             = { from: Candidate, to: Candidate | Locator, kind: ∈ {succession, topic, concept, plain} }
                  -- kind and to are INFERRED at read time from stored anchors (cross_refs) + shared keywords/topic + cwd + the recency the spine read declares; never read from a stored field
                  -- cross_refs hold StructuredAnchor {memory, github_issue, github_pr} and LegacyAnchor strings (SKILL.md TYPES: Anchor); a legacy string extends an edge as kind-unknown, never rejected. succession/topic/concept/plain are traversal ROLES, not stored kinds
                  -- to is a Locator when the anchor points at no written record: not-yet-written knowledge, skipped, never an error
Graph            = (Set(Candidate), Set(Edge))   -- STRUCTURAL TYPE: the edge set is reconstructed by traversal, never pre-materialized; invariants in ── GRAPH INVARIANTS ──
infer_edges      = (Set(Candidate), Σ) → Set(Edge)
Traverse         = (Set(Candidate), Set(Edge)) → (Set(Candidate), Set(Edge))   -- Unit-dispatched: follow inferred edges outward to the sub-graph reachable from the entry candidates, reading across partitions and writing to none. What it returned and which links were broken is reported in the same turn — in Present's pre-gate text when a recognizable was assembled, in Qx's pre-gate text when none was — so nothing has to survive a turn yield
Assemble_{Unit}  = (Set(Candidate), Set(Edge)) → List(Recognizable)   -- recognizables in Unit's shape from the edge-connected sub-graph, never from a global join over the store: unit = V.unit, members ⊆ the traversed candidates, narrative = the members' index gist in the shape (a cue for ordering; Ground replaces it), excerpts = ∅
connectivity     -- the term Rank adds at this scope: recall-trace alignment + inferred-edge connectivity strength order the recognizables (SKILL.md TYPES: Rank). Ordering only — it decides which recognizable Ground opens first, and no gate reads it

── GRAPH INVARIANTS ──
Graph is a STRUCTURAL TYPE (sourced from partitioned stores + lifecycle churn, not a knowledge-federation ontology). Four invariants hold:
  no-central-aggregator : no central index; the graph exists only as the inferred union of per-candidate read-time connections, reconstructed by traversal
  edge-based            : a recognizable is assembled by FOLLOWING inferred edges between candidates, never by a global join over a flat store
  isolation-preserving  : each partition owns its own writes; traversal reads across partitions (in the Claude realization, the per-project hypomnesis directories references/claude.md declares) and writes to none
  broken-link-tolerant  : an edge to a missing record is not-yet-written knowledge — skipped, surfaced as a traversal note, never a failure

── KNOWN FAILURE MODES (find above session scope) ──
SparseEdges          : entry candidates exist but too few shared anchors/keywords/metadata infer edges joining them; Assemble = ∅ with a non-empty entry — |O[]| = 0 as for any Find (SKILL.md FLOW): the open question, then the checkpoint, each reporting the traversal beside the coverage; ExpandFullText re-enters Find with bodies joined to the spine, where the joining anchor may sit
BrokenLinkChain      : inferred edges resolve mostly to records never written (lifecycle gap) — report the traversal as a note, not an error; assembled recognizables may be too thin to identify
UnitMismatch         : V.unit read as the wrong whole — detected as a correction describing a different shape; recue re-reads V.unit and Find re-runs at the new scope
-- One session would have answered: no case here. A recognizable of one member IS the session-scope object, and a V.unit misjudged above session is UnitMismatch
-- Index taken as evidence: no case here either. Ground composes the narrative from each member's excerpt at this scope as at session scope (SKILL.md ── KNOWN FAILURE MODES ── IndexAsEvidence), so a cross-session claim — "this is where it began", "first coined here" — is asserted only where a member's record carries it
```
