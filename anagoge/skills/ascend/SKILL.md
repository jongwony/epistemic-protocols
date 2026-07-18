---
name: ascend
description: "Elevate a vague recall whose right resolution unit is not any single session but a connected-session chain, a topic cluster, or an already-sedimented concept. AI traverses the deposit graph by reconstructing cross-partition connections at read-time from stored anchors and shared keywords/metadata, recognizes the higher unit the deposits already imply, and presents it as a narrative for user recognition — without fusing a new whole or writing anything. Type: (RecallGranularityInsufficient, AI, ELEVATE, ScatteredDeposits × DepositGraph) → HigherGranularityUnit. Alias: Anagoge(ἀναγωγή)."
user_invocable: true
---

# Anagoge Protocol

Elevate a vague recall to a higher-granularity unit through AI-guided deposit-graph traversal and user-validated recognition. Type: `(RecallGranularityInsufficient, AI, ELEVATE, ScatteredDeposits × DepositGraph) → HigherGranularityUnit`.

## Definition

**Anagoge** (ἀναγωγή): A dialogical act of leading a vague recall up from session granularity to the higher unit its scattered deposits already imply — a connected line of work across sessions, a topic cluster, or an already-sedimented concept node — where AI detects that the right resolution unit is supra-session, traverses the deposit graph by reconstructing cross-partition connections at read-time from each deposit's stored anchors plus shared keywords and session metadata, assembles candidate higher units of the dispatched type, and presents one as a narrative for Socratic recognition. The higher unit is recognized, not synthesized: Anagoge reconstructs the connections from what the deposits already store and writes nothing.[^1]

[^1]: ἀναγωγή ("a leading-up") is the deliberate sibling of ἀνάμνησις: ana-mnesis recalls *one* prior context, ana-goge leads that recall *up* to the connected unit above it. The medieval anagogical sense — the reading that lifts the literal toward an ultimate unity — supplies the structural figure: the deposits are the literal, the higher unit is the unity they point to. The protocol borrows the leading-up structure; it claims no exegetical doctrine.

```
── FLOW ──
Anagoge(R) → attempts := 0 → Detect(R) →                             -- attempts initialized once, at activation (preserved on Reorient re-entry)
  single_session_suffices(R): relay(finding) → defer-to-Anamnesis → deactivate
  supra_session(R): Classify(R, Σ) → UnitType → Dispatch(UnitType) →
    Phase 1: attempts := attempts + 1 →                                   -- one increment per traversal, at traversal start
      Traverse_{UnitType}(Deposits, infer_edges(Deposits, Σ)) → Assemble → U_asm → Rank(U_asm, R) → U[] → [|U[]| > 0] confirmations := Confirm(claim_source_pairs) →   -- index reads drive discovery/rank; each surfaced claim is paired with its OWN originating deposit's SSOT (not one shared SSOT) before Confirm; the per-claim verdict is recorded in Λ.confirmations, and every surfacing op renders each claim against it — never asserted from the lossy index alone
      |U[]| = 0 ∧ attempts < max: Rescope(R, Σ) → Stop → S → rebind(R, S) → Phase 1
      |U[]| = 0 ∧ attempts = max ∧ presented = ∅: NullMatch → inform(R, Σ) → fallback → deactivate   -- no unit ever assembled; the first empty traversal (attempts < max) already fired ≥1 Rescope
      |U[]| = 0 ∧ attempts = max ∧ presented ≠ ∅: surface(presented_best, traversal_scope) → deactivate   -- exhausted-with-units: a prior traversal assembled, so this is NOT NullMatch
      |U[]| > 0: presented := presented ∪ {U[top]} →   -- record the assembled candidate (presented becomes the "ever-assembled" witness)
        SingleObvious(U[]): emit(HigherUnit_prose(U[top]) ⊕ divergence_affordance) → elevate_complete(U[top]) → converge   -- Extension (relay): one densely-connected high-confidence unit, no turn yield; silence = Recognize. Convergence is notional (inline skill prose persists), so a next-turn divergence re-engages via fresh re-detection (Layer 1/2 activation) — not an encoded transition out of the converged state — then routes to Refine/Reorient
        ¬SingleObvious(U[]): Qc(U[top], narrative, framing) → Stop → A →
          Recognize(u): elevate_complete(u) → emit(HigherUnit_prose(u)) → converge
          Refine ∧ attempts < max: adjust(boundary ∨ traversal_scope) → Phase 1
          Reorient(d) ∧ attempts < max: rebind(UnitType ∨ recall_dimension, d, Σ) → Phase 1 / Phase 0
          (Refine ∨ Reorient) ∧ attempts = max: surface(U[top], traversal_scope) → deactivate   -- exhausted-with-units terminal

── MORPHISM ──
ScatteredDeposits × DepositGraph
  → detect(supra_session)              -- recognize granularity insufficiency: right unit is above one session
  → classify(unit_type)                -- UnitType ∈ {ConnectedSessionChain, TopicCluster, SedimentedConceptNode}
  → dispatch(unit_type)                -- select traversal shape for the dispatched type
  → traverse(Deposits, infer_edges)    -- INFER cross-partition edges at read-time from stored anchors + shared keywords/metadata; broken-link-tolerant
  → assemble(connected_subgraph)       -- compose higher units of the dispatched type from the inferred-edge-connected deposits
  → rank(units, recall_trace)          -- order by recall alignment + connectivity
  → confirm(claim_source_pairs)        -- INDEX reads drive discovery/rank (provisional); each claim SURFACED as evidence (origin, timing, quoted decision/utterance) gets a per-claim verdict against ITS OWN originating deposit's authoritative source (never a single unit-wide SSOT), recorded in Λ.confirmations for the surfacing ops — never asserted from the lossy index alone
  → present(unit, Socratic)            -- narrative presentation of one candidate higher unit; absorbed into the emit for SingleObvious (single densely-connected high-confidence unit) — Extension, no turn yield
  → recognize(unit, user)              -- user-constituted identification at the higher granularity; for SingleObvious, realized as silence-default behind a divergence-only affordance (non-divergence constitutes recognition)
  → emit(HigherUnit_prose)             -- NL rendering to session text
  → HigherGranularityUnit
requires: supra_session(R)              -- granularity checkpoint (Phase 0): single session would NOT resolve it
deficit:  RecallGranularityInsufficient -- activation precondition (Layer 1/2)
preserves: DepositGraph                 -- deposits are read-only; traversal edges are reconstructed at read-time, never written; cross-slug reads only, never cross-slug writes
confirms:  EvidentialClaim against its OWN deposit's SSOT -- the INDEX is a pointer for discovery/rank; evidence resolves against the authoritative source of the claim's originating deposit, not the derived index and never a single unit-wide SSOT
invariant: Recognition over Aggregation

── TYPES ──
R                = RecallTrace { keywords: Set(String), temporal: Optional(String),
                                 associations: Set(String), entry_deposits: Set(DepositRef) }
DepositRef       = { slug: String, sid: String, anchor: Optional(String) }   -- a partition-local deposit pointer
ScatteredDeposits = Set(Deposit)        -- deposits the recall trace touches; distributed across slugs, no central aggregator
Anchor           = StructuredAnchor | LegacyAnchor   -- what a deposit STORES in cross_refs (mirrors what Anamnesis writes)
StructuredAnchor = { kind: ∈ {memory, github_issue, github_pr}, ref: String, channel: ∈ {user, transcript} }
                  -- the ONLY structured anchor kinds the substrate stores; NOT a cross-slug deposit pointer
LegacyAnchor     = String               -- a bare-string cross_ref from older deposits (pre-StructuredAnchor)
Deposit          = { slug: String, sid: String, cwd: Optional(String), date: Optional(String),
                     topic: String, fingerprint: Prose, cross_refs: List(Anchor) }          -- one partition-local sediment unit; cross_refs are STORED, partition-local, exactly what Anamnesis writes
                  -- cwd, date are STORED in the deposit's own frontmatter (the same fields Anamnesis writes): cwd pairs with sid to build the resume handle, date dates the source. Optional ⇒ absent in deposits written before the field was captured (cwd-absent ⇒ source surfaced but non-resumable)
SSOT             = the deposit's authoritative session record (complete, append-only) the INDEX entry is DERIVED FROM   -- a Deposit is a LOSSY INDEX projection of its SSOT; evidential claims resolve against SSOT, never the deposit files alone. A cross-deposit higher unit spans MULTIPLE deposits, each with its OWN SSOT — there is no single suite-wide SSOT
EvidentialClaim  = { content: a reading SURFACED to the user as fact (origin attribution, coinage/temporal timing, a quoted decision or utterance), source_deposit: DepositRef }   -- source_deposit names the ONE deposit the claim originates from — index-only ⇒ provisional; settled only once Confirm-ed against that deposit's OWN SSOT
ClaimSourcePair  = (claim: EvidentialClaim, ssot: SSOT)   -- one claim paired with the authoritative source of ITS OWN originating deposit (ssot = SSOT(claim.source_deposit)); a cross-deposit unit's claim set carries one pair per claim, never one shared SSOT across the whole set
surfaced_claims  = HigherUnit → Set(EvidentialClaim)   -- the evidential claims the unit's narrative will surface
claim_source_pairs = { (c, SSOT(c.source_deposit)) : c ∈ surfaced_claims(U[top]) }   -- one pair per claim of the candidate unit U[top], each bound to its OWN deposit's SSOT
Confirm          = Set(ClaimSourcePair) → List({ claim: EvidentialClaim, verdict: ∈ {confirmed, corrected, unattested} })   -- per-claim-source-pair confirmation: each claim is checked against its OWN deposit's authoritative source before surfacing, never a single unit-wide SSOT; codomain is exactly Λ.confirmations, so `confirmations := Confirm(…)` is type-consistent; the verdict governs how each claim surfaces: confirmed ⇒ assert as settled fact; corrected ⇒ assert the SSOT value, discard the index reading; unattested ⇒ never assert as fact — surface provisional or omit. Index-only (unconfirmed) stays provisional.
DepositGraph     = (Set(Deposit), Set(TraversalEdge))    -- STRUCTURAL TYPE; the edge set is RECONSTRUCTED at read-time, not pre-materialized; invariants in ── GRAPH INVARIANTS ──
TraversalEdge    = { from: DepositRef, to: DepositRef, kind: ∈ {chain, topic, concept, plain} }
                  -- `kind` and `to` are INFERRED at traversal time from stored anchors + shared keywords/session metadata + Σ — NEVER read from a stored field
                  -- the substrate stores only {memory, github_issue, github_pr} anchors; chain/topic/concept/plain are traversal ROLES, not stored kinds
                  -- `to` may resolve to a deposit not (yet) present: an inferred edge whose target is missing is not-yet-written knowledge, skipped, never an error
UnitType         ∈ {ConnectedSessionChain, TopicCluster, SedimentedConceptNode}   -- classified from R + Σ
HigherUnit       = ConnectedSessionChain | TopicCluster | SedimentedConceptNode
ConnectedSessionChain = { origin: Deposit, line: List(Deposit), arrival: Deposit }
                  -- the connected line of work: where it began → how it developed across sessions → where it arrived
TopicCluster     = { topic: String, fragments: Set(Deposit), standing: Prose }
                  -- the cluster of fragments on one topic + where the deposits attest the topic last stood
SedimentedConceptNode = { concept: String, forged_by: Set(Deposit), node: DepositRef }
                  -- an already-sedimented concept node + which deposits forged it (recognition-only; never formed here)
infer_edges      = (Set(Deposit), Σ) → Set(TraversalEdge)        -- read-time edge inference from stored anchors + shared keywords/session metadata; output is reconstructed, never read from a stored field
Traverse         = (Set(Deposit), Set(TraversalEdge)) → (Set(Deposit), Set(TraversalEdge))   -- UnitType-dispatched read-time traversal: follow inferred edges to the connected sub-graph reachable from the entry deposits
Assemble         = (Set(Deposit), Set(TraversalEdge)) → List(HigherUnit)  -- compose the inferred-edge-connected deposits of the traversed sub-graph into typed higher units
Rank             = (List(HigherUnit), R) → List(HigherUnit)      -- recall-alignment (against the recall trace R) + inferred-edge-connectivity dominate
Rescope          = (R, Σ) → List(RescopeOption)                  -- structured re-traversal navigation on empty assembly
RescopeOption    = { dimension: ∈ {boundary, scope, unit_type}, option: String }
ScopeHint        = RescopeOption  -- the dimension+option the user selects at the Rescope gate to re-navigate traversal
S                = ScopeHint      -- user navigation answer from Rescope gate (Qc-rescope)
A                = Recognition ∈ {Recognize(HigherUnit), Refine, Reorient(description)}
confidence       = HigherUnit → {low < medium < high}   -- Rank-assigned label (recall-trace alignment + inferred-edge connectivity strength); grounds the SingleObvious confidence = high guard and the confidence < high gate
SingleObvious    = predicate; SingleObvious(U[]) ≡ |U[]| = 1 ∧ confidence(U[top]) = high   -- Light-only Extension guard: the one densely-connected unit is the single dominant option (option-set entropy → 0 → relay), so Qc is absorbed into the emit; Medium (|U[]| ≥ 2) and Heavy (confidence < high) keep the Qc gate
divergence_affordance = the mismatch channel folded into the non-yielding SingleObvious emit: names the concrete adjacent boundary/scope adjustments (Refine) AND offers an open free-response invitation (Reorient), keeping the full A = {Recognize, Refine, Reorient} coproduct reachable without a gate — Recognize is realized as silence-default
emitted(x)       = predicate; the relay emit(x) has fired in session text — the Extension-path convergence witness (event predicate; satisfied by the non-yielding SingleObvious emit, no turn yield)
Prose            = String       -- source-agnostic NL description
SourceLocator    = { slug: String, sid: String, date: Optional(String) }   -- per-deposit provenance shown to the user so a surfaced deposit is traceable to its origin: partition slug + session id + the deposit's frontmatter date
ResumeHandle     = String       -- copy-paste re-entry command for a deposit's session (construction binding in TOOL GROUNDING) — or a non-resumable note when cwd is absent
HigherUnit_prose = String       -- NL rendering of the recognized unit; each evidential claim it surfaces renders per that claim's Λ.confirmations verdict (confirmed/corrected ⇒ settled, corrected using the SSOT value; unattested ⇒ provisional or omitted) — so all emit sites (Phase 2 SingleObvious, Phase 3 Recognize) inherit the discipline from this one rendering contract
HigherGranularityUnit = session text containing HigherUnit_prose
               -- elevation establishes the UNIT (these deposits form THIS higher whole), not current-reality FIDELITY:
               -- a recognized chain/cluster/concept describes a PAST trajectory; downstream consumers re-verify against
               -- current state before commit rather than treating the elevated unit as confirmed current context
NullMatch        = predicate; canonical definition in ── CONVERGENCE ──
Phase            ∈ {0, 1, 2, 3}

── R-BINDING ──
bind(R) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ inbound_handoff
Priority: explicit_arg > colocated_expr > prev_user_turn > inbound_handoff

/ascend "text"              → R = extract_trace("text", Σ)
"the whole line of... "     → R = extract_trace(text before trigger, Σ)
/ascend (alone)             → R = extract_trace(previous user message, Σ)
inbound_handoff             → R seeded from an upstream protocol's session text (e.g. Anamnesis entry deposit, Hyphegesis synthesis checkpoint)

Edge cases:
- Multiple vague references: bind to first, note others
- Re-invoke after NullMatch: fresh R, no carryover
- Composition (/recollect → /ascend): single-session recall provides an entry deposit; /ascend traverses outward from it

── PHASE TRANSITIONS ──
Phase 0: R → Detect(R) → supra_session(R)?                         -- granularity trigger (silent); attempts := 0 ONCE at activation (Λ init), preserved on Reorient re-entry to Phase 0 so the cap spans the whole elevation
       [single_session_suffices(R)] relay(finding) → defer_to_anamnesis → deactivate    -- zero-signal: present finding, defer to /recollect, Anagoge not activated
           → Classify(R, Σ) → UnitType                              -- dispatch (silent)
Phase 1: R → attempts := attempts + 1 →                            -- one increment per traversal, at traversal start
           Traverse_{UnitType}(Deposits, infer_edges(Deposits, Σ)) → Assemble → U_asm → Rank(U_asm, R) → U[ranked] → [|U[ranked]| > 0] confirmations := Confirm(claim_source_pairs)  -- read-time inferred-edge traversal + assembly + rank, then confirm to-be-surfaced evidential claims each against ITS OWN originating deposit's SSOT (never a single unit-wide SSOT), recording the per-claim verdict in Λ.confirmations for the surfacing ops [Tool]
           |U[ranked]| = 0 ∧ attempts < max → Rescope(R, Σ) → Qc → Stop → S → rebind(R, S) → Phase 1   -- empty traversal always Rescopes while budget remains
           |U[ranked]| = 0 ∧ attempts = max ∧ presented = ∅ → NullMatch → inform → fallback → deactivate   -- nothing ever assembled; ≥1 Rescope already fired (Rule 12 holds structurally)
           |U[ranked]| = 0 ∧ attempts = max ∧ presented ≠ ∅ → surface(presented_best, traversal_scope) → deactivate   -- exhausted-with-units (a prior traversal assembled) — NOT NullMatch
           |U[ranked]| > 0 → presented := presented ∪ {U[top]} → Phase 2   -- record the assembled candidate before presenting
Phase 2: SingleObvious(U[ranked]) → emit(HigherUnit_prose(U[top]) ⊕ per-deposit ⟨SourceLocator, ResumeHandle⟩ ⊕ divergence_affordance) → elevate_complete(U[top]) → converge   -- Extension: single densely-connected high-confidence unit, no turn yield, no [Tool] Stop; silence = Recognize
         ¬SingleObvious(U[ranked]) → U[top] → Qc(U[top], narrative ⊕ per-deposit ⟨SourceLocator, ResumeHandle⟩, framing) → Stop → A   -- recognition gate [Tool]; presented already carries U[top] from the Phase 1 → Phase 2 edge; each surfaced deposit carries its source + resume handle
Phase 3: A → integrate(A, R, Σ) →                                   -- integration (track); the cap bounds re-traversal — a Refine/Reorient proceeds while attempts < max, else surfaces the best candidate and deactivates; after a SingleObvious emit, a next-turn divergence reaches these paths through fresh re-activation (Layer 1/2), not a transition from the converged state
           Recognize(u) → HigherUnit_prose(u) → emit → converge   -- HigherUnit_prose carries each composing deposit's SourceLocator + ResumeHandle
           Refine ∧ attempts < max → adjust(boundary ∨ traversal_scope) → Phase 1    -- boundary/scope adjustment (sense)
           Reorient(d) ∧ attempts < max → rebind(UnitType ∨ recall_dimension, d, Σ) → Phase 1 / Phase 0   -- orthogonal re-dispatch (sense)
           (Refine ∨ Reorient) ∧ attempts = max → surface(U[top], traversal_scope) → deactivate   -- exhausted-with-units terminal

── LOOP ──
Phase 1 → Phase 2 → Phase 3 →                              -- Phase 2 SingleObvious shortcut: emit ⊕ divergence affordance → converge (Extension, skips the Phase 3 gate; convergence is notional, so a next-turn divergence re-engages via fresh re-activation → Refine/Reorient)
  Recognize: converge
  Refine: adjust unit boundary or traversal scope → Phase 1 (while attempts < max)
  Reorient: change unit type or recall dimension → Phase 1 (or Phase 0 on dimension change) (while attempts < max)

Max 3 elevation attempts. `attempts` increments once per traversal, at the start of each Phase 1 traversal — a Rescope re-navigation and a Refine/Reorient re-entry both pass back through that single increment, so one traversal costs exactly one attempt (no double-count). The cap bounds the traversal count: a traversal that assembles nothing routes to Rescope while attempts < max; a Refine/Reorient re-traversal request proceeds while attempts < max, else surfaces the best candidate and deactivates. Exhausted (attempts = max), split by whether any unit was EVER assembled in this elevation (`presented`):
  - nothing ever assembled (presented = ∅, current traversal also empty) → surface traversal scope + broken-link notes → NullMatch fallback → deactivate. Because every traversal was empty, the first one (at attempts < max) already fired a Rescope, so ≥1 Rescope always precedes NullMatch (Rule 12).
  - a prior traversal assembled (presented ≠ ∅) — whether the final cycle is an empty re-traversal or a Refine/Reorient request → surface the best prior candidate + traversal scope → deactivate (exhausted-with-units, NOT NullMatch)
Convergence evidence: (ScatteredDeposits → [edges traversed] → HigherUnit(recognized) → HigherUnit_prose).

── CONVERGENCE ──
elevate_complete = Recognize(u) for some u ∈ U[]                                        -- gated path (¬SingleObvious)
                ∨ SingleObvious(U[]) ∧ emitted(HigherUnit_prose(U[top]) ⊕ divergence_affordance)   -- Extension path: the inline emit converges immediately (no turn yield); non-divergence (silence) realizes user-constituted recognition. Convergence is notional — a later divergence re-engages via fresh re-activation (Layer 1/2), not a transition out of the converged state
NullMatch = |U[]| = 0 ∧ attempts = max ∧ presented = ∅  -- no higher unit assembles AT ALL across the whole elevation (deposits too sparse, or inferred edges resolve only to not-yet-written targets)
                                        -- `presented = ∅` is load-bearing: it means every traversal was empty, so the first empty traversal (at attempts < max) already fired a Rescope — guaranteeing ≥1 Rescope precedes any NullMatch (Rule 12), even when earlier traversals consumed the budget
                                        -- the exhausted-WITH-units path (presented ≠ ∅ ∧ attempts = max, whether reached by an empty re-traversal or a Refine/Reorient request) is NOT NullMatch: it surfaces the best prior candidate and deactivates (see ── LOOP ──)
fallback(NullMatch) = offer Anamnesis (single-session resolution from an entry deposit)
                    ∨ offer Aitesis (when the cases must be newly found, not traversed)
progress(Σ) = attempts: N/max, units_assembled: N, inferred_edges_followed: N

── TOOL GROUNDING ──
-- Realization binding (Claude Code substrate), non-normative w.r.t. protocol essence — see ── SUBSTRATE AGNOSTICISM ──; any substrate satisfying the morphism laws and graph invariants realizes Anagoge.
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
-- Realization ⓐ (READ-TIME cross-partition reconstruction over the Anamnesis hypomnesis index):
--   {slug} = Claude Code's project partition identifier (dirname of a transcript)
--   Deposit              ↦ ~/.claude/projects/{slug}/hypomnesis/{sid}/   (a per-session recall INDEX entry, partition-local — a LOSSY projection of the session's SSOT)
--   SSOT                 ↦ the session's authoritative transcript ~/.claude/projects/{slug}/{sid}.jsonl   (complete, append-only); the hypomnesis deposit files (clue/narrative/coinage/vector/markers/…) are the DERIVED INDEX of it. Evidential claims resolve HERE, not in the index files.
--   Confirm              ↦ Read/Grep the session transcript ~/.claude/projects/{slug}/{sid}.jsonl for the deposit's sid to verify an evidential claim before surfacing it; index-only readings stay provisional. Mirrors the Anamnesis "SSOT ⊕ INDEX" store topology (SSOT authoritative, INDEX derived/lossy).
--   Deposit.cross_refs   ↦ clue.md StructuredAnchor list (kind ∈ {memory, github_issue, github_pr} + legacy bare strings) — STORED, partition-local; these are NOT cross-slug deposit pointers
--   Deposit.fingerprint  ↦ narrative.md (origin/outcome prose)
--   Deposit.topic        ↦ clue.md frontmatter topics[0]
--   Deposit.sid / Deposit.cwd / Deposit.date ↦ clue.md (and narrative.md) frontmatter session_id / cwd / date — the same fields Anamnesis writes; cwd, date are Optional (absent in deposits predating their capture)
--   SourceLocator        ↦ { slug = the deposit's partition dirname, sid = frontmatter session_id, date = frontmatter date } — surfaced per deposit so the user can trace it to its origin
--   ResumeHandle         ↦ `cd <Deposit.cwd> && claude --resume <Deposit.sid>` (Claude Code resolves the project slug from invocation cwd, so BOTH cwd and sid are required); Deposit.cwd absent/empty ⇒ omit the command and surface the SourceLocator + a non-resumable note (mirrors the Anamnesis recollect Resume binding)
--   DepositRef (a surfaced node) ↦ a DepositRef carries slug + sid only; build its SourceLocator/ResumeHandle by dereferencing slug + sid to the deposit dir (~/.claude/projects/{slug}/hypomnesis/{sid}/) and reading date/cwd from its clue.md frontmatter — same fields and same cwd-absent ⇒ non-resumable rule as a full Deposit (SedimentedConceptNode.node is the surfaced DepositRef)
--   TraversalEdge.kind / TraversalEdge.to ↦ inferred at traversal time, not stored
--   Traversal start      ↦ entry deposits; read their stored cross_refs anchors ({memory, github_issue, github_pr} + legacy) and INDEX keywords/metadata,
--                          then DISCOVER related deposits across partitions by READ-TIME SEARCH (Read/Grep/Glob over `~/.claude/projects/*/hypomnesis/`) for shared anchors / keywords / session metadata
--   DepositGraph         ↦ the deposits reachable by this read-time inference outward from the entry deposits — NO central index file, and NO pre-written cross-slug deposit graph;
--                          the graph exists only as the inferred union of read-time connections (no-central-aggregator invariant). Cross-partition connections are INFERRED at read-time; Anamnesis has NOT pre-written a cross-slug deposit graph.
--   broken link          ↦ an inferred edge whose target deposit has no written entry — read as not-yet-written knowledge, skipped, never an error
-- Span invariant binding: traversal issues cross-partition READS only (Read/Grep/Glob across `~/.claude/projects/*/hypomnesis/`); it NEVER writes to any slug. Each partition still owns its own writes; Anagoge adds none.
-- Alternative realizations (documented, not active): ⓑ persisted-edge graph — if a future substrate stores cross-slug deposit pointers as first-class records, traversal could follow them directly rather than re-inferring at read-time; ⓒ a full Open Knowledge Federation link-graph store materializing edges as first-class records. ⓐ is chosen because it requires no schema beyond what Anamnesis already deposits and adds zero write surface.
Phase 0 Detect        (sense)        → Internal analysis (supra-session granularity; distinguish from single-session Anamnesis)
Phase 0 relay_single_session (extension) → TextPresent+Proceed (single_session_suffices(R): present the finding, defer to /recollect, deactivate — Anagoge not activated)
Phase 0 Classify      (sense)        → Internal analysis (UnitType detection from R + Σ)
Phase 0 Dispatch      (sense)        → Internal analysis (select the traversal shape for the dispatched UnitType; deterministic indexed selection, entropy→0)
Phase 1 Traverse      (observe)      → Read, Grep, Glob (read entry-deposit anchors + index keywords/metadata, then search cross-partition for shared anchors/keywords/metadata; read-only, read-time inference)
Phase 1 Assemble      (sense)        → Internal analysis (compose inferred-edge-connected deposits into typed higher units)
Phase 1 Rank          (sense)        → Internal analysis (recall alignment + inferred-edge connectivity; conditional haiku scoring for large unit sets)
Phase 1 Confirm       (observe)      → Read, Grep (after Rank, before any surfacing: read the deposit's authoritative session transcript ~/.claude/projects/{slug}/{sid}.jsonl to confirm an evidential claim before it is surfaced; index-only readings stay provisional). The per-claim verdict is then recorded to Λ.confirmations (track) for the surfacing ops to consume
Phase 1 Rescope Qc    (constitution) → present (structured re-traversal navigation; mandatory on empty assembly before NullMatch)
Phase 1/3 surface     (extension)    → TextPresent+Proceed (exhausted-with-units terminal, presented ≠ ∅: best candidate — each composing deposit with its source + resume, per Rule 19, and each of its evidential claims rendered per the claim's retained Λ.confirmations verdict — + traversal scope, then deactivate — reached from Phase 1 on an empty re-traversal at the cap, or from Phase 3 on a Refine/Reorient request at the cap)
Phase 1 NullMatch inform (extension) → TextPresent+Proceed (exhausted-no-unit terminal, presented = ∅: traversal scope + broken-link notes + Anamnesis/Aitesis fallback offer, then deactivate)
Phase 2 record        (track)        → Internal state update (presented := presented ∪ {U[top]} on entering the gate — the ever-assembled witness for NullMatch vs exhausted-with-units)
Phase 2 Qc            (constitution) → present (narrative higher-unit candidate incl. per-deposit SourceLocator + ResumeHandle, each evidential claim rendered per its Λ.confirmations verdict; gated path — ¬SingleObvious: candidate units ≥ 2 OR confidence < high)
Phase 2 emit          (extension)    → TextPresent+Proceed (SingleObvious path only: single densely-connected high-confidence unit emitted inline with its per-deposit SourceLocator + ResumeHandle and a divergence-only affordance, no turn yield, converge immediately). Relay basis: one dominant higher unit collapses the recognition option set to a single option (Refine/Reorient are foils), so the option set is relay rather than a gate; this conditional Constitution→Extension specialization within Phase 2 is the sanctioned revision of Rule 7's Safeguard-tier mandatory-gate tag, motivated by observed binary-confirm abandonment friction. It is the relay-collapse kind of (extension), NOT a Standing-authority migration.
Phase 3 integrate     (track)        → Internal state update
Phase 3 emit          (extension)    → TextPresent+Proceed (HigherUnit_prose, incl. per-deposit SourceLocator + ResumeHandle)
converge              (extension)    → TextPresent+Proceed (convergence trace)
seam                  (extension)    → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol settles the next move — proceed directly to it, citing that settling source. This protocol declares no wired outbound continuation edge: the /recollect → /ascend edge-case is an inbound handoff seeding this protocol's R, not an outbound continuation, so the second trigger is vacuously absent. Every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, R: RecallTrace, unit_type: UnitType,
      units: List(HigherUnit),
      confirmations: List({ claim: EvidentialClaim, verdict: ∈ {confirmed, corrected, unattested} }),   -- per-claim Confirm verdicts written at Phase 1 (`confirmations := Confirm(claim_source_pairs)`, each claim checked against its OWN deposit's SSOT); consumed by every surfacing op (Phase 2 emit/Qc, Phase 3 emit, the exhausted-with-units terminal surface) so each claim renders per its verdict — confirmed/corrected ⇒ settled (corrected substitutes the SSOT value), unattested ⇒ provisional or omitted
      presented: Set(HigherUnit),   -- updated `presented := presented ∪ {U[top]}` on every Phase 1 → Phase 2 edge (a candidate reaching the gate); serves as the "ever-assembled" witness that discriminates NullMatch (presented = ∅) from the exhausted-with-units terminal (presented ≠ ∅), and supplies presented_best for that terminal's surface
      recognized: Optional(HigherUnit),
      rescopes: List(RescopeOption),
      attempts: Nat,   -- initialized 0 ONCE at activation (Λ init), preserved across Reorient re-entry to Phase 0; incremented once per traversal at Phase 1 start; cap (max 3) bounds the traversal count (empty-branch Rescope-vs-NullMatch and Phase 3 re-traversal-vs-surface both gate on it)
      history: List<(HigherUnit, A)>,   -- appended at Phase 3 integration: Log (HigherUnit, A) to history
      active: Bool, cause_tag: String }

── GRAPH INVARIANTS ──
DepositGraph is a STRUCTURAL TYPE (sourced from partition Span + lifecycle churn, NOT a knowledge-federation ontology). Four invariants hold:
  no-central-aggregator : the graph has no central index; it exists only as the inferred union of per-deposit read-time connections, reconstructed by traversal — never pre-materialized
  edge-based            : a higher unit is assembled by FOLLOWING inferred edges between deposits, never by a global join over a flat store
  isolation-preserving  : each partition owns its own writes; traversal reads across partitions but writes to none (Span: cross-partition reads only, never cross-slug writes)
  broken-link-tolerant  : an inferred edge to a missing target is not-yet-written knowledge, not an error — it is skipped, and its absence is surfaced as a traversal-scope note, never a failure

── SUBSTRATE AGNOSTICISM ──
The protocol essence (form) consists of FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, and the
GRAPH INVARIANTS. The essence makes no reference to specific tools, agents, platforms,
schedulers, or storage media. Any realization (matter) whose deposits satisfy the four graph
invariants and whose stored anchors support read-time cross-partition edge inference realizes Anagoge.

form ⊥ matter:
  form   = ⟨FLOW, MORPHISM, TYPES, graph invariants, Recognition over Aggregation⟩   -- protocol definition
  matter = ⟨tool names, file paths, the hypomnesis index, OKF stores, language, storage backend⟩  -- realization

TOOL GROUNDING above specifies one realization (ⓐ, Claude Code hypomnesis substrate); ⓑ and ⓒ
are alternative realizations. All are non-normative with respect to the protocol's epistemic content.

Referent: Semantic autonomy at the realization boundary. This section locally inscribes the
realization boundary for user-visible clarity; the local inscription is intentional —
externalizing it would split the user-visible contract from its semantic grounding.

── KNOWN FAILURE MODES ──
SparseDeposits   : entry deposits exist but too few shared anchors/keywords/metadata infer edges connecting them to assemble any higher unit
                   -- cause: the line/topic/concept has not yet sedimented enough shared anchors/keywords across sessions
                   -- detection: |U[]| = 0 after traversal with non-empty entry deposits
                   -- recovery: Rescope navigation (widen boundary or change unit type); if still empty → NullMatch fallback to Anamnesis single-session resolution

BrokenLinkChain  : inferred edges resolve to targets with no written deposit (not-yet-written knowledge dominates the path)
                   -- cause: the connecting sessions were never indexed (lifecycle gap), or the knowledge is genuinely not yet deposited
                   -- detection: traversal infers mostly missing targets; assembled units are too thin to recognize
                   -- recovery: surface the broken-link scope as a traversal note (NOT an error); offer Aitesis when the missing cases must be newly found

UnitTypeMismatch : the recall trace was dispatched to the wrong UnitType (e.g. classified as TopicCluster but the user means a ConnectedSessionChain)
                   -- detection: Qc Recognize=false with the user describing a different unit shape
                   -- recovery: Reorient → re-dispatch UnitType → Phase 1

SingleSessionMisfire : a single session WOULD resolve the recall — Anagoge over-activated
                   -- cause: supra_session(R) misjudged at Phase 0
                   -- recovery: defer to Anamnesis (Phase 0 deactivation, not a loop attempt)

IndexAsEvidence  : an evidential claim (origin, timing, quotation) asserted from the lossy index without confirming against the authoritative source
                   -- cause: a deposit index file (clue/narrative/coinage/…) is read as if it were the session record; the index omits or compresses what the source holds
                   -- detection: a load-bearing claim ("this is where it began", "first coined here") rests only on index files, never on the session source
                   -- recovery: read the deposit's authoritative session transcript before asserting; surface index-only readings as provisional (Rule 20)
```

## Core Principle

**Recognition over Aggregation**: When a vague recall has enough signal to recognize that *something* matters, but the right resolution unit is not any single session — it is a connected line of work, a topic cluster, or an already-sedimented concept — Anagoge leads the recall *up* to that higher unit by recognizing the unit the scattered deposits already imply. It does this by reconstructing the connections between deposits at read-time from their stored anchors plus shared keywords and metadata, not by fusing or synthesizing a new whole. The decisive mark of the deficit is that the recognition *object* changes: the user is no longer trying to locate one session, but to see the higher unit standing above many.

The traversal reconstructs the connected deposits at read-time; the narrative Qc enables recognition of the higher unit; the user constitutes the unit's identity. Three constitutive distinctions govern this shift — object elevation over retrieval, recognition by traversal over aggregation, and type-dispatched narrative — set out as Rules 3, 2, and 4 below, with the per-type breakdown walked through in Phase 1 (assembly) and Phase 2 (presentation format).

## Mode Activation

### Activation

AI detects granularity insufficiency in user expression (Layer 2, silent Phase 0) OR user calls `/ascend` (Layer 1, always available). Recognition requires user interaction at the Phase 2 gate, except for a single densely-connected high-confidence unit — there the gate is absorbed into an inline Extension emit with a divergence-only affordance, and non-divergence (silence) constitutes recognition. On direct `/ascend`, bind `R` from current/recent context; if none recoverable, request the recall target before Phase 0.

**Granularity insufficiency** — the user senses a whole line of work, topic, or concept across many sessions, but the right resolution unit is supra-session (no single session is the answer).

```
supra_session(R) ≡ ∃ unit(u) : recall_points_at(R, u) ∧ granularity(u) > session ∧ ¬single_session_resolves(R)
```

### Priority

<system-reminder>
When Anagoge is active:

**Supersedes**: Direct execution patterns that resolve recall to a single session when the right unit is supra-session
(A higher-granularity recall must be elevated before connected-unit-dependent work proceeds)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, present the candidate higher unit as a narrative for user recognition — a Constitution gate when candidate units ≥ 2 or confidence < high; for a single densely-connected high-confidence unit, an Extension inline emit with a divergence-only affordance (silence constitutes recognition).
</system-reminder>

Anagoge completes before connected-unit-dependent work; loaded instructions resume after elevation resolves or dismisses.

### Trigger Signals

Heuristic signals for granularity-insufficiency detection (not hard gates):

| Signal | Detection |
|--------|-----------|
| Whole-line-of-work reference | User gestures at an entire arc of work ("that whole thread we kept coming back to") rather than one session |
| Topic-cluster reference | User references a topic spread across many fragments ("everything we figured out about X") without a single locus |
| Concept-node reference | User names a concept that prior work already sedimented ("the principle we ended up calling Y") and wants the node, not its formation |
| Cross-session "where did it land" | User asks where a multi-session trajectory arrived, not what one session said |
| Anamnesis overshoot | A `/recollect` attempt resolves one session but the user signals the real unit is larger |

**Cross-deposit enrichment**: An entry deposit recognized by Anamnesis provides the starting point for Phase 1 traversal — Anagoge reconstructs connections outward from the deposit's stored anchors plus shared keywords/metadata. This is a heuristic input; constitutive judgment of the higher unit remains with the user.

**Skip**:
- A single session would resolve the recall — defer to Anamnesis (`/recollect`)
- The relevant cases must be newly found, not traversed from existing deposits — defer to Aitesis (`/inquire`)
- The user wants to FORM a new concept from instances, not RECOGNIZE an already-sedimented one — defer to Periagoge (`/induce`)
- The user wants to reverse-trace decision intent, not locate a remembered unit — defer to Euporia (`/elicit`)
- Same higher unit already elevated in current session (session immunity)
- User explicitly declines elevation assistance

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| elevate_complete (Recognize, or SingleObvious inline emit) | Emit HigherUnit_prose; proceed with the recognized higher unit as past trajectory requiring re-verification against current state before commit (not confirmed current context) |
| NullMatch (attempts exhausted, nothing ever assembled: presented = ∅) | Surface traversal scope + broken-link notes, offer Anamnesis (single-session) or Aitesis (newly-found cases) fallback, deactivate (≥1 Rescope already fired, since every traversal was empty) |
| Exhausted with units (attempts = max, presented ≠ ∅: a Refine/Reorient request, or an empty re-traversal after a prior assembly) | Surface the best prior candidate (each composing deposit with its source + resume, per Rule 19) + traversal scope, deactivate — NOT NullMatch, since a unit did assemble |
| Single-session misfire (Phase 0) | Defer to Anamnesis without entering the loop |
| User Esc key | Accept current state without further elevation assistance |

## Protocol

### Phase 0: Granularity Trigger Detection (Silent)

Detect granularity insufficiency, bind `R`, and classify the target unit type. This phase is **silent** — no user interaction.

1. **Detect supra-session granularity**: Analyze the recall trace for whole-line / topic-cluster / concept-node signals. **Decisive test**: would a single session resolve this? If yes → defer to Anamnesis (no Anagoge activation). Anagoge activates only when the right unit is above the session.
2. **Bind trace + classify unit type**: `extract_trace(input, Σ)` populates `R` (keywords, temporal, associations, entry deposits); `classify(R, Σ)` assigns `UnitType` ∈ {ConnectedSessionChain, TopicCluster, SedimentedConceptNode} from the recall trace. Session context (Σ) is the strongest clue for which unit shape the user means.
3. **Assess trace ambiguity**:
   - **Low** (clear unit-shape signal + entry deposits): proceed to Phase 1 with the dispatched traversal
   - **Moderate** (partial signal): proceed to Phase 1 with broader traversal scope
   - **High** (unit shape unclear): traverse the dispatched type first, hold Reorient ready if the shape misfits
4. If `single_session_suffices(R)`: surface the finding (the recall resolves to one session) and defer to Anamnesis without Anagoge activation.
5. If `supra_session(R)`: record `R` with extracted trace and `UnitType` — proceed to Phase 1. `attempts` is initialized to 0 once at activation (see MODE STATE); a Reorient dimension-change re-entry to Phase 0 preserves it so the cap spans the whole elevation rather than resetting.

**Scan scope**: Read-only over bound text, conversation context, and the deposit index.

### Phase 1: Deposit-Graph Traversal + Assembly + Rank

Traverse the deposit graph for the dispatched `UnitType`, assemble candidate higher units, then rank them.

1. **Scan entry deposits**: locate the deposits the recall trace touches (the traversal entry points).
2. **Infer cross-partition connections (read-time discovery)**: read each entry deposit's stored anchors (`cross_refs` ∈ {memory, github_issue, github_pr} + legacy strings) and its index keywords/session metadata, then search the partitioned index for deposits that share those anchors, keywords, or session metadata, and INFER the connections to them. The substrate stores no cross-slug deposit graph — connections are reconstructed here, not read from a stored field. Discovery is **read-only** and **broken-link-tolerant** — an inferred edge whose target has no written deposit is not-yet-written knowledge: skip it and note it as traversal scope, never an error.
3. **Assemble candidate higher units of the dispatched type** (the UnitType branch routes the inference, never field-matched on a stored kind):
   - **ConnectedSessionChain**: infer `chain`-role edges from session/temporal adjacency and shared session-path/anchor signals to trace the connected line of work — its origin deposit, the development across sessions, and where it arrived.
   - **TopicCluster**: infer `topic`-role edges from shared keywords / memory-topic anchors to gather the fragments on one topic and read where the deposits attest the topic last stood.
   - **SedimentedConceptNode**: infer `concept`-role edges from shared concept / memory anchors to the already-sedimented concept node and the deposits that forged it (recognition only — no concept is formed here).
4. **Rank candidate units**: order by recall-trace alignment and edge connectivity (a richly connected unit outranks a thin one). Each candidate carries its assembled shape, the edges traversed, and a confidence label.
5. **Confirm evidential claims against the source, not the index**: the deposit index is a *lossy pointer* for discovery and ranking — it is NOT evidence. Before surfacing any claim *as evidence* to the user — an origin attribution, a coinage/temporal timing, a quoted decision or utterance — confirm it by reading the deposit's authoritative session source, not the index entry alone. An index-only reading is surfaced as *provisional*; only a source-confirmed reading is surfaced as settled fact. A load-bearing or surprising reading ("this is where it began", "first coined here") is a stop signal to read the source before asserting — the index can omit what the source holds. This mirrors the store topology the deposits come from (authoritative source ⊕ derived index): the index accelerates discovery, the source settles evidence.
6. If `|U[]| = 0`: do NOT declare NullMatch yet. While attempts remain, present a **Rescope** navigation gate (Constitution) — structured options to widen the boundary, broaden the scope, or change the unit type — then re-traverse with the rebind. Declare NullMatch only when the attempt cap is reached **and nothing was ever assembled in this elevation** (`presented = ∅`): surface the traversal scope and broken-link notes, then offer the fallback (Anamnesis single-session resolution from an entry deposit, or Aitesis if the cases must be newly found). If a prior traversal DID assemble a candidate (`presented ≠ ∅`) but this final traversal came back empty at the cap, that is the exhausted-with-units terminal — surface the best prior candidate + scope and deactivate, not NullMatch. Because a NullMatch requires every traversal to have been empty, the first empty traversal (below the cap) always fired a Rescope first, so at least one Rescope precedes any NullMatch.

**Scope restriction**: Traversal uses Read, Grep, Glob exclusively. Cross-partition reads only — never cross-slug writes; Anagoge writes nothing.

### Phase 2: Narrative Recognition (Constitution; Extension on a single densely-connected high-confidence unit)

**Present** the highest-ranked candidate higher unit as a narrative for user recognition. Reaching this point records the candidate: `presented := presented ∪ {U[top]}` — the witness that *some* traversal assembled a unit, which later discriminates a true NullMatch (`presented = ∅`, nothing ever assembled) from the exhausted-with-units terminal (`presented ≠ ∅`) and supplies the best prior candidate for that terminal's surface. Branch on the candidate set: a **single densely-connected high-confidence unit** (`|U[]| = 1` at high confidence — `SingleObvious`) absorbs the gate into the presentation — emit the recognized higher unit inline as **Extension** (no turn yield, converge immediately): essential output first (type-shaped narrative + each composing deposit's source + resume handle + currency≠fidelity caveat), then a **divergence-only affordance** that names the concrete adjacent boundary/scope adjustments (Refine) and invites an open redescription of the unit type or recall dimension (Reorient), keeping the full Recognize / Refine / Reorient set reachable. Silence (the user moving on) constitutes recognition; only divergence is explicit. Convergence here is notional — the inline skill prose persists as a standing instruction, so a next-turn divergence re-engages the protocol through fresh granularity-insufficiency re-detection (Layer 1/2 activation), which routes to the existing Refine / Reorient handling — there is no encoded transition out of the converged state, and no dedicated re-activation machinery is added. One dominant higher unit collapses the option set to a single option, so this is relay, not a gate. **Otherwise** (candidate units ≥ 2, or confidence < high) the recognition gate runs as a Constitution interaction (turn yield). Both branches share the narrative format below.

**Selection criterion**: Choose the candidate whose recognition would maximally resolve the user's granularity insufficiency. When rank is equal, prefer the richer, more connected unit.

**Narrative presentation format** — shaped by UnitType:

For a **ConnectedSessionChain**:
- **Origin**: where the line of work began — the first deposit and what prompted it
- **Development**: how it advanced across sessions — the connected deposits along the line, in order
- **Arrival**: where the line last stood — the latest deposit on it (a past trajectory, re-verified against current state before commit)
- **Connections found**: which shared anchors/session signals connected the line (so the user can see the traversal basis)

For a **TopicCluster**:
- **Topic**: the topic the fragments share
- **Fragments**: the deposits gathered on the topic, with brief narratives
- **Standing**: where the deposits attest the topic last stood across the fragments (a past trajectory, re-verified against current state before commit)
- **Connections found**: which shared anchors/keywords connected the cluster

For a **SedimentedConceptNode**:
- **Concept**: the already-sedimented concept the user is recalling
- **Forged by**: which deposits forged the concept node
- **Node**: the deposit reference for the node itself
- **Connections found**: which shared concept anchors connected the forging deposits

Common to all:
- **Source & resume (per deposit)**: for every deposit named in the unit above, whatever its role in the unit (a chain's origin, line, and arrival deposits; a cluster's fragments; a concept's node and the deposits that forged it) — give where it came from (its partition slug + session id + the deposit's date) and a copy-paste command to jump back into that session (constructed per TOOL GROUNDING); when a deposit has no stored cwd, give its source and note it is not directly resumable rather than emitting a command that would fail. This lets the user re-enter any session the unit is built from, not just read that it exists.
- **Traversal scope**: which partitions were reached, and any broken-link gaps (not-yet-written targets) noted as scope, not error
- **Framing**: how many elevation tries remain before the cap, and how much of the deposit graph is still in scope — stated as the budget you reason with, not a numeric attempt fraction. The SingleObvious inline emit converges immediately, so attempt-budget framing is moot there; its only forward branch is the divergence affordance.

For the **SingleObvious** path the inline emit renders the narrative format above as plain session text — the convergence trace folded in (type-shaped narrative + per-deposit source + resume handle + currency≠fidelity caveat) — and ends with the divergence-only affordance (named adjacent boundary/scope adjustments + open channel), no gate. **Gated path** (`¬SingleObvious`) — then **present**:

```
Is this the higher unit you were reaching for?

Options:
1. **Recognize** — this is the connected unit I had in mind
2. **Refine** — the unit is close but its boundary or scope needs adjusting
```

Other is always available — maps to `Reorient`: the user means a fundamentally different unit type or recall dimension (e.g. a topic cluster rather than a chain, or a different recall axis). The protocol re-dispatches the unit type or rebinds the recall dimension and re-traverses.

### Phase 3: Integration

After user response:

1. **Recognize(u)**: Mark the unit as recognized. Emit `HigherUnit_prose` — natural-language rendering of the recognized higher unit to session text: the unit's shape (chain line / cluster fragments / concept node), the deposits composing it — each with its source (partition slug + session id + the deposit's date) and a copy-paste resume command (constructed per TOOL GROUNDING, or a non-resumable note when the deposit has no stored cwd) so the user can re-enter any of those sessions — the edges traversed, and key cross-references. This prose enters session text and is readable by any downstream protocol via Session Text Composition. `HigherUnit_prose` carries a currency≠fidelity caveat: it states that the deposits form this higher unit as a past trajectory, not that the unit's content is verified against current reality — downstream consumers treat it as elevated-and-requiring-re-verification, not as confirmed current context.

2. **Refine**: Unit recognized as close but mis-bounded. Adjust the unit boundary (add/drop a deposit at the edge) or the traversal scope (widen/narrow which partitions to reach), re-enter Phase 1 with the adjustment.

3. **Reorient(description)**: The user surfaces a different unit type or recall dimension. `rebind(UnitType ∨ recall_dimension, d, Σ)` re-dispatches the unit type (Phase 1 re-traverse) or, when the recall dimension itself changes, rebuilds `R` (Phase 0 re-classify). Re-enter at the appropriate phase.

   **Refine vs Reorient test**: would the user's new description keep the same unit type and overlap the current candidate? Overlap + same type → Refine; different type or disjoint → Reorient.

After integration: `elevate_complete` → present the convergence evidence trace (ScatteredDeposits → [edges traversed] → HigherUnit(recognized) → HigherUnit_prose emitted), proceed. Refine → Phase 1 with adjusted boundary/scope (while attempts < max). Reorient → Phase 1 / Phase 0 with re-dispatched unit type or rebuilt trace (while attempts < max). `attempts` increments once per traversal at Phase 1 start; the cap (max 3) bounds re-traversal — when a Refine/Reorient request arrives at attempts = max, surface the top-ranked candidate + traversal scope (the exhausted-with-units terminal) and deactivate rather than re-traversing. Log `(HigherUnit, A)` to history.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Clear unit shape, single densely-connected candidate (high confidence) | Recognized higher unit folded inline — abbreviated type-shaped narrative (origin + arrival, or topic + standing) + per-deposit source + resume handle + currency≠fidelity caveat — in one non-yielding (Extension) emit, then converge immediately; divergence-only affordance (named adjacent boundary/scope adjustments + open channel), no confirmation gate |
| Medium | Moderate signal, 2-3 candidate units in scope | Full type-shaped narrative + traversal scope |
| Heavy | Unit shape unclear, Reorient likely, sparse/broken edges | Full narrative + traversal scope + broken-link notes + Rescope navigation on empty assembly |

## Rules

1. **AI-guided detection, user-constituted recognition**: AI detects granularity insufficiency, traverses the deposit graph, and presents the candidate higher unit as a recognition option; user identification via Cognitive Partnership Move (Constitution) at Phase 2 constitutes the unit's identity. Detection, traversal, and constitution are separate acts — AI detection is implicitly confirmed when the user engages with recognition (Phase 2 response, not Esc). For a single densely-connected high-confidence unit (SingleObvious), recognition is constituted by non-divergence: the inline Extension emit carries a divergence-only affordance, and silence (the user moving on) realizes the unit's identity — the user's constitutive freedom is the divergence channel, not a forced confirm.

2. **Recognition over Aggregation**: The higher unit is recognized by reconstructing the connections between deposits at read-time from their stored anchors plus shared keywords/metadata — Anagoge never fuses, synthesizes, or forms a new whole, and writes nothing. Present structured narrative options with anticipatable post-selection state (Recognize / Refine / Reorient); Constitution interaction requires turn yield before proceeding.

3. **Supra-session granularity gate**: Phase 0 activates Anagoge only when the right resolution unit is above a single session. If a single session would resolve the recall, defer to Anamnesis — the decisive mark is that the recognition object is an edge-supported higher unit, not one session.

4. **Type-dispatched traversal and narrative**: Phase 1 dispatches the traversal by `UnitType` (chain / topic cluster / concept node) and Phase 2 presents the candidate in the shape of its type. A single generic presentation shape has structural blind spots regardless of unit type.

5. **Read-time edge inference, never cross-slug write (Span invariant)**: Traversal reconstructs cross-partition edges at read-time from stored anchors + shared keywords/metadata with reads only; it issues no cross-slug writes and no writes at all. Each partition owns its own writes — isolation is preserved.

6. **Broken-link tolerance**: An inferred edge to a missing target is not-yet-written knowledge, never an error — skip it and surface its absence as a traversal-scope note. A thin assembly from broken links routes to Rescope, then NullMatch fallback, not to a failure.

7. **One higher unit per cycle; conditional recognition gate** *(Safeguard tier — revisitable as instruction-following improves)*: Present one highest-ranked candidate higher unit per Phase 2 cycle — single-candidate presentation keeps recognition focus on a single elevation decision. The recognition gate runs as a Constitution interaction (turn yield) when 2+ candidate units are in scope OR confidence < high (¬SingleObvious); a single densely-connected unit at high confidence (SingleObvious: `|U[]| = 1 ∧ confidence(U[top]) = high`) instead **absorbs the gate into the presentation** — the higher unit is emitted inline as Extension (no turn yield) with its per-deposit source + resume handle and a divergence-only affordance, and convergence is immediate (silence / the user moving on constitutes recognition, only divergence is explicit). One dominant higher unit collapses the recognition option set to a single option (Refine/Reorient are foils), so the interaction is relay, not a gate; this absorption is the sanctioned revision of this rule's own Safeguard-tier mandatory-gate tag, motivated by observed binary-confirm abandonment friction.

8. **Convergence persistence and early exit**: Mode active until elevate_complete, NullMatch after exhausted attempts (nothing ever assembled, presented = ∅), exhausted-with-units deactivation (attempts = max with presented ≠ ∅ — whether the final cycle is an empty re-traversal or a Refine/Reorient request — surfaces the best prior candidate and deactivates rather than re-traversing), single-session misfire deferral, or user Esc; recognition or rejection of a candidate is final for that candidate in the current session, and Esc is accepted immediately regardless of remaining attempts.

9. **Convergence evidence**: Present the transformation trace (ScatteredDeposits → edges traversed → HigherUnit(recognized) → HigherUnit_prose) before declaring elevate_complete — convergence is demonstrated per-item, not asserted. The trace enumerates the edges followed and the deposits composing the unit. The SingleObvious Extension path folds this trace into its non-yielding inline emit (the edges followed and composing deposits rendered inline), satisfying this rule within the emit rather than via a separate Phase 3 step.

10. **Boundary discipline (vs adjacent protocols)**: Defer to Anamnesis when one session resolves the recall; to Aitesis (`/inquire`) when the cases must be newly found rather than traversed from existing deposits; to Periagoge (`/induce`) when the user wants to FORM a new concept rather than RECOGNIZE an already-sedimented one (SedimentedConceptNode is recognition-only); to Euporia (`/elicit`) when the user wants to reverse-trace decision intent rather than locate a remembered unit. A Hyphegesis (`/conduct`) synthesis checkpoint may route INTO Anagoge to elevate scattered cross-worker results into a connected-session unit.

11. **NullMatch fallback diagnosis**: On NullMatch after exhausted Rescope, surface the traversal scope (partitions reached, edges followed) and broken-link notes, then offer the fallback — Anamnesis single-session resolution from an entry deposit, or Aitesis when the missing cases must be newly found. Sparse deposits and broken-link chains are reported as scope, not framed as protocol failure.

12. **Rescope-first NullMatch**: At least one Rescope navigation gate precedes any NullMatch declaration. This is structurally guaranteed by the NullMatch guard `presented = ∅`: NullMatch requires that no traversal ever assembled a unit, so the first traversal was empty and — being below the cap — fired a Rescope before any NullMatch could be declared. A final empty traversal at the cap that follows a prior assembly (`presented ≠ ∅`) is the exhausted-with-units terminal, not NullMatch, so it does not need a fresh Rescope.

13. **Substrate non-coupling**: Phase prose names epistemic operations only — tool, path, and deposit-index bindings (realization ⓐ) belong exclusively to TOOL GROUNDING; ⓑ/ⓒ are documented alternative realizations.

14. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.

15. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.

16. **Context-Question Separation**: Present narrative context, traversal evidence, and broken-link notes as text before the Constitution interaction; the interaction contains only the recognition question and options with differential implications. Embedding context inside the question field violates this invariant.

17. **Elevated unit currency is not fidelity**: Elevation constitutes the unit (these deposits form this higher whole), not current-reality agreement (it still holds). A correctly recognized higher unit may still be desynced from current reality — the recognition gate verifies the unit, not its fidelity. `HigherUnit_prose` emits with a currency≠fidelity caveat; the elevated unit is re-verified against current state before commit and is not handed to downstream protocols as confirmed current context.

18. **Gate integrity** (Safeguard tier): The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing the narrative to the dispatched UnitType, or pairing "Recognize" with a unit-specific label, while preserving the Recognition coproduct) is distinct from mutation.

19. **Per-deposit source and resume handle**: Every deposit surfaced to the user — in the Phase 2 narrative, in the Phase 3 `HigherUnit_prose` emit, and in the exhausted-with-units terminal surface (which exposes the best prior candidate's composing deposits) — carries its source (partition slug + session id + the deposit's date) and a copy-paste resume command that re-enters that session; a deposit whose cwd was never captured is surfaced with its source and a non-resumable note rather than a command that would fail. This lets the user jump back into any session the higher unit is built from, not just read that it exists. The frontmatter-field and command-construction bindings are substrate-coupled and live in TOOL GROUNDING (Rule 13); the protocol essence names only the epistemic operation — surface each composing deposit's origin and a re-entry handle.

20. **Index is pointer, evidence is from the source** *(Safeguard tier)*: The deposit index (the per-session recall entries) is a lossy accelerator for discovery and ranking — not evidence. Any claim surfaced to the user *as evidence* — an origin attribution, a coinage/temporal timing, a quoted decision or utterance — is confirmed against the deposit's authoritative session source before assertion; an unconfirmed index reading is surfaced as provisional, never as settled fact. The rendering is bound by formal state, not by this prose: the per-claim verdict lives in `Λ.confirmations` (a `List({claim, verdict})` written at the Phase 1 `Confirm` step) and every surfacing op consumes it — the type boundary carries the discipline, this Rule only names it. Standing on an index-only reading is the failure this guards: the index can omit or compress what the source holds, so a confident claim drawn from the index alone can be wrong. The authoritative-source ⊕ derived-index split is substrate-coupled and lives in TOOL GROUNDING (Rule 13); the essence names only the discipline — confirm evidence against the source, not the index.

21. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).

22. **Seam relay on declared continuation**: when a user-declared chain names the next protocol, the between-protocol seam after Mode Deactivation is relay (Extension) — proceed directly, citing the settling source (the chain declaration). This protocol declares no wired outbound continuation edge — the /recollect → /ascend edge-case is an inbound handoff seeding this protocol's R, not an outbound continuation — so the second trigger is vacuously absent. This governs only the seam BETWEEN protocols; every Constitution gate inside this protocol and the next fires unchanged, and the user can redirect at any turn.
