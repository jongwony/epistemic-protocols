# Supra-session composition — unit shapes, edge inference, per-claim confirmation

Read when the recall's right unit stands above one session — the user names a whole line of work, a topic worked out in scattered pieces, or a concept prior sessions already settled, or `C[ranked]` falls on one line across sessions. This is the `── SUPRA-SESSION COMPOSITION ──` formal block: runtime-normative contract, not commentary. It adds no state, gate, terminal, or budget; the recognized object is composed from candidates instead of picked from among them, and everything else is the protocol as typed in SKILL.md.

Not this reference: a single session would answer (the default path); the cases must be newly found (`/inquire`); the concept is not yet formed and must be crystallized (`/induce`); the recall is of decision intent to be reverse-traced (`/elicit`).

```
── SUPRA-SESSION COMPOSITION ──
compose : List(Candidate) × Σ → List(HigherUnit)
compose(C[], Σ) = RankUnits(Assemble(Traverse(C[], infer_edges(C[], Σ))), V.trace)

Deposit          ↦ Candidate       -- the composing element IS Anamnesis's Candidate (session_id, runtime, cwd, topic, keywords, fingerprint, cross_refs, confidence): no second type
DepositRef       = { runtime: Source, session_id: SessionId }   -- pointer to a Candidate; dereferenced to its record through the runtime reference (references/claude.md, references/codex.md)
UnitType         ∈ {ConnectedSessionChain, TopicCluster, SedimentedConceptNode}   -- classified from V.trace + Σ; Reorient(d) naming a different shape re-dispatches
HigherUnit       = ConnectedSessionChain | TopicCluster | SedimentedConceptNode
ConnectedSessionChain = { origin: Candidate, line: List(Candidate), arrival: Candidate }   -- where it began → how it developed across sessions → where it arrived
TopicCluster     = { topic: String, fragments: Set(Candidate), standing: Prose }             -- the fragments on one topic + where the records attest the topic last stood
SedimentedConceptNode = { concept: String, forged_by: Set(Candidate), node: DepositRef }      -- recognized only, never formed here: absent a candidate already carrying the concept as settled, the recall is not this shape (formation → /induce)

TraversalEdge    = { from: DepositRef, to: DepositRef, kind: ∈ {chain, topic, concept, plain} }
                  -- kind and to are INFERRED at read time from stored anchors (cross_refs) + shared keywords + session metadata (cwd, date, topic); never read from a stored field
                  -- the store holds {memory, github_issue, github_pr} anchors only (StructuredAnchor); chain/topic/concept/plain are traversal ROLES, not stored kinds
                  -- to may resolve to no written record: not-yet-written knowledge, skipped, never an error
DepositGraph     = (Set(Candidate), Set(TraversalEdge))   -- STRUCTURAL TYPE: the edge set is reconstructed by traversal, never pre-materialized; invariants in ── GRAPH INVARIANTS ──
infer_edges      = (Set(Candidate), Σ) → Set(TraversalEdge)
Traverse         = (Set(Candidate), Set(TraversalEdge)) → (Set(Candidate), Set(TraversalEdge))   -- UnitType-dispatched: follow inferred edges outward to the sub-graph reachable from the entry candidates
traversal_scope  = the pair Traverse returned, with each skipped broken-link edge noted
Assemble         = (Set(Candidate), Set(TraversalEdge)) → List(HigherUnit)   -- compose typed units from the edge-connected sub-graph, never from a global join over the store
RankUnits        = (List(HigherUnit), RecallTrace) → List(HigherUnit)         -- recall-trace alignment + edge connectivity dominate
confidence       = HigherUnit → {low < medium < high}   -- the Candidate.confidence tier lifted to the unit; grounds SingleObvious exactly as for one candidate

EvidentialClaim  = { content: a reading the narrative will surface as fact (origin attribution, coinage timing, a quoted decision or utterance), source: DepositRef }   -- names the ONE candidate the claim originates from
surfaced_claims  = HigherUnit → Set(EvidentialClaim)
Confirm          = Set(EvidentialClaim) → List({ claim: EvidentialClaim, verdict: ∈ {confirmed, corrected, unattested} })
                  -- each claim checked against SSOT(claim.source) — its OWN record, opened through the runtime reference — before it is surfaced; a unit spans several records and there is no single record for the whole
                  -- the verdict governs surfacing: confirmed ⇒ assert as settled; corrected ⇒ assert the record's value, discard the index reading; unattested ⇒ never assert as fact — provisional or omitted. Index-only stays provisional
                  -- `Recalled context currency is not fidelity` applied per record: the unit establishes that these candidates form THIS whole, not that its outcome still holds
HigherUnit_prose = String   -- one narrative in the unit's shape (origin → development → arrival; topic → fragments → standing; concept → forged by → settled at), put first; each surfaced claim rendered per its Confirm verdict; each composing candidate carries the source locator and the resume handle its runtime reference validates (fork ⇒ references/fork-resume.md; cwd absent ⇒ non-resumable note); then the supporting edges, traversal_scope, and the gaps left by missing records
RecalledContext  ⊇ session text containing HigherUnit_prose   -- the result type is unchanged: a HigherUnit is a RecalledContext whose object is composed; downstream re-verifies against current state as for any recall

mapping onto the protocol as typed (no new state, gate, terminal, or budget):
  entry candidates   ↦ C[ranked] from Phase 1                        -- the scan is the same; compose runs on its result
  Phase 2 object     ↦ U[] = compose(C[ranked], Σ) in place of C[ranked]; SingleObvious(U[]) ≡ |U[]| = 1 ∧ confidence(U[top]) = high → the same inline emit ⊕ divergence_affordance, no turn yield; otherwise Qc(U[top], evidence, framing)
  R                  ↦ Recognize(u) | Refine (adjust the unit's boundary or traversal_scope) | Reorient(d) (a different UnitType or recall dimension)
  rescope            ↦ Phase 1/3 Probe → Qs when entry candidates are present but Assemble = ∅: the probe's dimensions are boundary, scope, unit shape; it runs before any NullMatch, since the store is not empty
  attempts           ↦ each re-composition spends one recall try; AttemptsExhausted surfaces the best unit in hand
  NullMatch          ↦ only after a rescoped Assemble is also empty; report traversal_scope and the broken-link notes, per `NullMatch diagnosis`

── GRAPH INVARIANTS ──
DepositGraph is a STRUCTURAL TYPE (sourced from partitioned stores + lifecycle churn, not a knowledge-federation ontology). Four invariants hold:
  no-central-aggregator : no central index; the graph exists only as the inferred union of per-candidate read-time connections, reconstructed by traversal
  edge-based            : a unit is assembled by FOLLOWING inferred edges between candidates, never by a global join over a flat store
  isolation-preserving  : each partition owns its own writes; traversal reads across partitions (in the Claude realization, the per-project hypomnesis directories references/claude.md declares) and writes to none
  broken-link-tolerant  : an edge to a missing record is not-yet-written knowledge — skipped, surfaced as a traversal-scope note, never a failure

── KNOWN FAILURE MODES (composition) ──
SparseDeposits       : entry candidates exist but too few shared anchors/keywords/metadata infer edges connecting them; Assemble = ∅ with non-empty entry — rescope via Probe → Qs (widen boundary, change unit shape); NullMatch only if still empty
BrokenLinkChain      : inferred edges resolve mostly to records never written (lifecycle gap) — surface traversal_scope as a note, not an error; assembled units may be too thin to recognize
UnitTypeMismatch     : dispatched to the wrong UnitType — detected as Reorient(d) describing a different shape; re-dispatch and re-compose
SingleSessionMisfire : one candidate answers and composition was applied anyway — present the single candidate; composition is not a loop attempt
IndexAsEvidence      : a load-bearing claim ("this is where it began", "first coined here") rests only on INDEX files — read the originating record before asserting; index-only readings surface as provisional
```
