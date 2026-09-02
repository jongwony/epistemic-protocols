---
name: ascend
description: "Elevate a vague recall to the supra-session unit it belongs to. Type: (RecallGranularityInsufficient, AI, ELEVATE, ScatteredDeposits × DepositGraph) → HigherGranularityUnit"
user_invocable: true
---

# Anagoge Protocol

Elevate a vague recall to a higher-granularity unit through AI-guided deposit-graph traversal and user-validated recognition. Type: `(RecallGranularityInsufficient, AI, ELEVATE, ScatteredDeposits × DepositGraph) → HigherGranularityUnit`.

## Definition

**Anagoge** (ἀναγωγή): A dialogical act of leading a vague recall up from session granularity to the higher unit its scattered deposits already imply — a connected line of work across sessions, a topic cluster, or an already-sedimented concept node — where AI detects that the right resolution unit is supra-session, traverses the deposit graph by reconstructing cross-partition connections at read-time from each deposit's stored anchors plus shared keywords and session metadata, assembles candidate higher units of the dispatched type, and presents one as a narrative for Socratic recognition. The higher unit is recognized, not synthesized: Anagoge reconstructs the connections from what the deposits already store and writes nothing.

```
── FLOW ──
Anagoge(R) → attempts := 0 → Detect(R) →                             -- attempts initialized once, at activation (preserved on Reorient re-entry)
  single_session_suffices(R): relay(finding) → deactivate
  supra_session(R): Classify(R, Σ) → UnitType →
    Phase 1: attempts := attempts + 1 →                                   -- one increment per traversal, at traversal start
      Traverse_{UnitType}(Deposits, infer_edges(Deposits, Σ)) → Assemble → U_asm → Rank(U_asm, R) → U[] → [|U[]| > 0] confirmations := Confirm(surfaced_claims(U[top])) →   -- index reads drive discovery/rank; each surfaced claim is checked by Confirm against its OWN originating deposit's SSOT (not one shared SSOT); the per-claim verdict is recorded in Λ.confirmations, and every surfacing op renders each claim against it — never asserted from the lossy index alone
      |U[]| = 0 ∧ attempts < max: Rescope(R, Σ) → Stop → S → rebind(R, S) → Phase 1
      |U[]| = 0 ∧ attempts = max ∧ presented = ∅: NullMatch → inform(R, Σ) → fallback → deactivate   -- no unit ever assembled; the first empty traversal (attempts < max) already fired ≥1 Rescope
      |U[]| = 0 ∧ attempts = max ∧ presented ≠ ∅: surface(presented_best, traversal_scope) → deactivate   -- exhausted-with-units: a prior traversal assembled, so this is NOT NullMatch
      |U[]| > 0: presented := presented ∪ {U[top]} →   -- record the assembled candidate (presented becomes the "ever-assembled" witness)
        SingleObvious(U[]): emit(HigherUnit_prose(U[top]) ⊕ divergence_affordance) → elevate_complete(U[top]) → converge   -- Extension (relay): one densely-connected high-confidence unit, no turn yield; silence = Recognize. Convergence is notional (inline skill prose persists), so a next-turn divergence re-engages via fresh re-detection (Layer 1/2 activation) — not an encoded transition out of the converged state — then routes to Refine/Reorient
        ¬SingleObvious(U[]): Qc(U[top], narrative, framing) → Stop → A →
          Recognize(u): elevate_complete(u) → emit(HigherUnit_prose(u)) → converge
          Refine ∧ attempts < max: adjust(boundary ∨ traversal_scope) → Phase 1
          Reorient(d) ∧ attempts < max: rebind(UnitType ∨ R, d, Σ) → Phase 1 / Phase 0
          (Refine ∨ Reorient) ∧ attempts = max: surface(U[top], traversal_scope) → deactivate   -- exhausted-with-units terminal

── MORPHISM ──
ScatteredDeposits × DepositGraph
  → detect(supra_session)              -- recognize granularity insufficiency: right unit is above one session
  → classify(unit_type)                -- UnitType ∈ {ConnectedSessionChain, TopicCluster, SedimentedConceptNode}
  → traverse(Deposits, infer_edges)    -- INFER cross-partition edges at read-time from stored anchors + shared keywords/metadata; broken-link-tolerant
  → assemble(connected_subgraph)       -- compose higher units of the dispatched type from the inferred-edge-connected deposits
  → rank(units, recall_trace)          -- order by recall alignment + connectivity
  → confirm(surfaced_claims)           -- INDEX reads drive discovery/rank (provisional); each claim SURFACED as evidence (origin, timing, quoted decision/utterance) gets a per-claim verdict against ITS OWN originating deposit's authoritative source (never a single unit-wide SSOT), recorded in Λ.confirmations for the surfacing ops — never asserted from the lossy index alone
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
DepositRef       = { slug: String, sid: String }   -- a partition-local deposit pointer
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
surfaced_claims  = HigherUnit → Set(EvidentialClaim)   -- the evidential claims the unit's narrative will surface
Confirm          = Set(EvidentialClaim) → List({ claim: EvidentialClaim, verdict: ∈ {confirmed, corrected, unattested} })   -- each claim checked against SSOT(claim.source_deposit), its OWN deposit's authoritative source, before surfacing, never a single unit-wide SSOT; codomain is exactly Λ.confirmations, so `confirmations := Confirm(…)` is type-consistent; the verdict governs how each claim surfaces: confirmed ⇒ assert as settled fact; corrected ⇒ assert the SSOT value, discard the index reading; unattested ⇒ never assert as fact — surface provisional or omit. Index-only (unconfirmed) stays provisional.
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
traversal_scope  = the (Set(Deposit), Set(TraversalEdge)) Traverse returned, with each skipped broken-link edge noted
Assemble         = (Set(Deposit), Set(TraversalEdge)) → List(HigherUnit)  -- compose the inferred-edge-connected deposits of the traversed sub-graph into typed higher units
Rank             = (List(HigherUnit), R) → List(HigherUnit)      -- recall-alignment (against the recall trace R) + inferred-edge-connectivity dominate
Rescope          = (R, Σ) → List(RescopeOption)                  -- structured re-traversal navigation on empty assembly
RescopeOption    = { dimension: ∈ {boundary, scope, unit_type}, option: String }
S                = RescopeOption   -- user navigation answer from the Rescope gate (Qc-rescope)
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
max              = the traversal cap LOOP fixes   -- a bound on user attention, not a sufficiency criterion
Phase            ∈ {0, 1, 2, 3}

── R-BINDING ──
bind(R) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ inbound_handoff
Priority: explicit_arg > colocated_expr > prev_user_turn > inbound_handoff

/ascend "text"              → R = extract_trace("text", Σ)
"the whole line of... "     → R = extract_trace(text before trigger, Σ)
/ascend (alone)             → R = extract_trace(previous user message, Σ)
inbound_handoff             → R seeded from an upstream protocol's session text

Edge cases:
- Multiple vague references: bind to first, note others
- Re-invoke after NullMatch: fresh R, no carryover
- Composition (inbound handoff): a single-session recall provides an entry deposit; /ascend traverses outward from it

── PHASE TRANSITIONS ──
Phase 0: R → Detect(R) → supra_session(R)?                         -- granularity trigger (silent); attempts := 0 ONCE at activation (Λ init), preserved on Reorient re-entry to Phase 0 so the cap spans the whole elevation
       [single_session_suffices(R)] relay(finding) → deactivate    -- zero-signal: present the single-session finding; Anagoge not activated
           → Classify(R, Σ) → UnitType                              -- dispatch (silent)
Phase 1: R → attempts := attempts + 1 →                            -- one increment per traversal, at traversal start
           Traverse_{UnitType}(Deposits, infer_edges(Deposits, Σ)) → Assemble → U_asm → Rank(U_asm, R) → U[ranked] → [|U[ranked]| > 0] confirmations := Confirm(surfaced_claims(U[top]))  -- read-time inferred-edge traversal + assembly + rank, then confirm to-be-surfaced evidential claims each against ITS OWN originating deposit's SSOT (never a single unit-wide SSOT), recording the per-claim verdict in Λ.confirmations for the surfacing ops [Tool]
           |U[ranked]| = 0 ∧ attempts < max → Rescope(R, Σ) → Qc → Stop → S → rebind(R, S) → Phase 1   -- empty traversal always Rescopes while budget remains
           |U[ranked]| = 0 ∧ attempts = max ∧ presented = ∅ → NullMatch → inform → fallback → deactivate   -- nothing ever assembled; ≥1 Rescope already fired (`Rescope-first diagnosis` holds structurally)
           |U[ranked]| = 0 ∧ attempts = max ∧ presented ≠ ∅ → surface(presented_best, traversal_scope) → deactivate   -- exhausted-with-units (a prior traversal assembled) — NOT NullMatch
           |U[ranked]| > 0 → presented := presented ∪ {U[top]} → Phase 2   -- record the assembled candidate before presenting
Phase 2: SingleObvious(U[ranked]) → emit(HigherUnit_prose(U[top]) ⊕ per-deposit ⟨SourceLocator, ResumeHandle⟩ ⊕ divergence_affordance) → elevate_complete(U[top]) → converge   -- Extension: single densely-connected high-confidence unit, no turn yield, no [Tool] Stop; silence = Recognize
         ¬SingleObvious(U[ranked]) → U[top] → Qc(U[top], narrative ⊕ per-deposit ⟨SourceLocator, ResumeHandle⟩, framing) → Stop → A   -- recognition gate [Tool]; presented already carries U[top] from the Phase 1 → Phase 2 edge; each surfaced deposit carries its source + resume handle
Phase 3: A → integrate(A, R, Σ) →                                   -- integration (track); the cap bounds re-traversal — a Refine/Reorient proceeds while attempts < max, else surfaces the best candidate and deactivates; after a SingleObvious emit, a next-turn divergence reaches these paths through fresh re-activation (Layer 1/2), not a transition from the converged state
           Recognize(u) → HigherUnit_prose(u) → emit → converge   -- HigherUnit_prose carries each composing deposit's SourceLocator + ResumeHandle
           Refine ∧ attempts < max → adjust(boundary ∨ traversal_scope) → Phase 1    -- boundary/scope adjustment (sense)
           Reorient(d) ∧ attempts < max → rebind(UnitType ∨ R, d, Σ) → Phase 1 / Phase 0   -- orthogonal re-dispatch (sense)
           (Refine ∨ Reorient) ∧ attempts = max → surface(U[top], traversal_scope) → deactivate   -- exhausted-with-units terminal

── LOOP ──
Phase 1 → Phase 2 → Phase 3 →                              -- Phase 2 SingleObvious shortcut: emit ⊕ divergence affordance → converge (Extension, skips the Phase 3 gate; convergence is notional, so a next-turn divergence re-engages via fresh re-activation → Refine/Reorient)
  Recognize: converge
  Refine: adjust unit boundary or traversal scope → Phase 1 (while attempts < max)
  Reorient: change unit type or recall dimension → Phase 1 (or Phase 0 on dimension change) (while attempts < max)

Max 3 elevation attempts. `attempts` increments once per traversal, at the start of each Phase 1 traversal — a Rescope re-navigation and a Refine/Reorient re-entry both pass back through that single increment, so one traversal costs exactly one attempt (no double-count). The cap bounds the traversal count: a traversal that assembles nothing routes to Rescope while attempts < max; a Refine/Reorient re-traversal request proceeds while attempts < max, else surfaces the best candidate and deactivates. Exhausted (attempts = max), split by whether any unit was EVER assembled in this elevation (`presented`):
  - nothing ever assembled (presented = ∅, current traversal also empty) → surface traversal scope + broken-link notes → NullMatch fallback → deactivate. Because every traversal was empty, the first one (at attempts < max) already fired a Rescope, so ≥1 Rescope always precedes NullMatch (`Rescope-first diagnosis`).
  - a prior traversal assembled (presented ≠ ∅) — whether the final cycle is an empty re-traversal or a Refine/Reorient request → surface the best prior candidate + traversal scope → deactivate (exhausted-with-units, NOT NullMatch)
Convergence evidence: (ScatteredDeposits → [edges traversed] → HigherUnit(recognized) → HigherUnit_prose).

── CONVERGENCE ──
elevate_complete = Recognize(u) for some u ∈ U[]                                        -- gated path (¬SingleObvious)
                ∨ SingleObvious(U[]) ∧ emitted(HigherUnit_prose(U[top]) ⊕ divergence_affordance)   -- Extension path: the inline emit converges immediately (no turn yield); non-divergence (silence) realizes user-constituted recognition. Convergence is notional — a later divergence re-engages via fresh re-activation (Layer 1/2), not a transition out of the converged state
NullMatch = |U[]| = 0 ∧ attempts = max ∧ presented = ∅  -- no higher unit assembles AT ALL across the whole elevation (deposits too sparse, or inferred edges resolve only to not-yet-written targets)
                                        -- `presented = ∅` is load-bearing: it means every traversal was empty, so the first empty traversal (at attempts < max) already fired a Rescope — guaranteeing ≥1 Rescope precedes any NullMatch (`Rescope-first diagnosis`), even when earlier traversals consumed the budget
                                        -- the exhausted-WITH-units path (presented ≠ ∅ ∧ attempts = max, whether reached by an empty re-traversal or a Refine/Reorient request) is NOT NullMatch: it surfaces the best prior candidate and deactivates (see ── LOOP ──)
fallback(NullMatch) = surface that no higher unit assembled; the next move is left to the user or session context
progress(Σ) = attempts: N/max, units_assembled: N, inferred_edges_followed: N

── TOOL GROUNDING ──
-- Realization binding (Claude Code substrate), non-normative w.r.t. protocol essence — see ── SUBSTRATE AGNOSTICISM ──; any substrate satisfying the morphism laws and graph invariants realizes Anagoge.
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
-- Realization ⓐ (READ-TIME cross-partition reconstruction over the Anamnesis hypomnesis index):
--   {slug} = Claude Code's project partition identifier (dirname of a transcript)
--   {config_dir} = the Claude Code config directory (CLAUDE_CONFIG_DIR when set, else ~/.claude). A detail of THIS realization, not protocol vocabulary — another substrate roots its store elsewhere under its own layout, so it is described here rather than typed as a phase. Read the value and substitute an absolute path before any tool call; a ${...} left in this text is inert, since artifact read/artifact search perform no shell expansion and a tilde inside ${VAR:-default} stays literal even when quoted
--   Deposit              ↦ {config_dir}/projects/{slug}/hypomnesis/{sid}/   (a per-session recall INDEX entry, partition-local — a LOSSY projection of the session's SSOT)
--   SSOT                 ↦ the session's authoritative transcript {config_dir}/projects/{slug}/{sid}.jsonl   (complete, append-only); the hypomnesis deposit files (clue/narrative/coinage/vector/markers/…) are the DERIVED INDEX of it. Evidential claims resolve HERE, not in the index files.
--   Confirm              ↦ artifact read/artifact search the session transcript {config_dir}/projects/{slug}/{sid}.jsonl for the deposit's sid to verify an evidential claim before surfacing it; index-only readings stay provisional. Mirrors the Anamnesis "SSOT ⊕ INDEX" store topology (SSOT authoritative, INDEX derived/lossy).
--   Deposit.cross_refs   ↦ clue.md StructuredAnchor list (kind ∈ {memory, github_issue, github_pr} + legacy bare strings) — STORED, partition-local; these are NOT cross-slug deposit pointers
--   Deposit.fingerprint  ↦ narrative.md (origin/outcome prose)
--   Deposit.topic        ↦ clue.md frontmatter topics[0]
--   Deposit.sid / Deposit.cwd / Deposit.date ↦ clue.md (and narrative.md) frontmatter session_id / cwd / date — the same fields Anamnesis writes; cwd, date are Optional (absent in deposits predating their capture)
--   SourceLocator        ↦ { slug = the deposit's partition dirname, sid = frontmatter session_id, date = frontmatter date } — surfaced per deposit so the user can trace it to its origin
--   ResumeHandle         ↦ `cd <Deposit.cwd> && claude --resume <Deposit.sid>` (Claude Code resolves the project slug from invocation cwd, so BOTH cwd and sid are required); Deposit.cwd absent/empty ⇒ omit the command and surface the SourceLocator + a non-resumable note (mirrors the Anamnesis recollect Resume binding)
--   DepositRef (a surfaced node) ↦ a DepositRef carries slug + sid only; build its SourceLocator/ResumeHandle by dereferencing slug + sid to the deposit dir ({config_dir}/projects/{slug}/hypomnesis/{sid}/) and reading date/cwd from its clue.md frontmatter — same fields and same cwd-absent ⇒ non-resumable rule as a full Deposit (SedimentedConceptNode.node is the surfaced DepositRef)
--   TraversalEdge.kind / TraversalEdge.to ↦ inferred at traversal time, not stored
--   Traversal start      ↦ entry deposits; read their stored cross_refs anchors ({memory, github_issue, github_pr} + legacy) and INDEX keywords/metadata,
--                          then DISCOVER related deposits across partitions by READ-TIME SEARCH (artifact read/artifact search over `{config_dir}/projects/*/hypomnesis/`) for shared anchors / keywords / session metadata
--   DepositGraph         ↦ the deposits reachable by this read-time inference outward from the entry deposits — NO central index file, and NO pre-written cross-slug deposit graph;
--                          the graph exists only as the inferred union of read-time connections (no-central-aggregator invariant). Cross-partition connections are INFERRED at read-time; Anamnesis has NOT pre-written a cross-slug deposit graph.
--   broken link          ↦ an inferred edge whose target deposit has no written entry — read as not-yet-written knowledge, skipped, never an error
-- Span invariant binding: traversal issues cross-partition READS only (artifact read/artifact search across `{config_dir}/projects/*/hypomnesis/`); it NEVER writes to any slug. Each partition still owns its own writes; Anagoge adds none.
-- Alternative realizations (documented, not active): ⓑ persisted-edge graph — if a future substrate stores cross-slug deposit pointers as first-class records, traversal could follow them directly rather than re-inferring at read-time; ⓒ a full Open Knowledge Federation link-graph store materializing edges as first-class records. ⓐ is chosen because it requires no schema beyond what Anamnesis already deposits and adds zero write surface.
Phase 0 Detect        (sense)        → Internal analysis (supra-session granularity; distinguish from single-session Anamnesis)
Phase 0 relay_single_session (extension) → TextPresent+Proceed (single_session_suffices(R): present the single-session finding, deactivate — Anagoge not activated)
Phase 0 Classify      (sense)        → Internal analysis (UnitType detection from R + Σ)
Phase 1 Traverse      (observe)      → artifact read, artifact search (read entry-deposit anchors + index keywords/metadata, then search cross-partition for shared anchors/keywords/metadata; read-only, read-time inference)
Phase 1 Assemble      (sense)        → Internal analysis (compose inferred-edge-connected deposits into typed higher units)
Phase 1 Rank          (sense)        → Internal analysis (recall alignment + inferred-edge connectivity; conditional haiku scoring for large unit sets)
Phase 1 Confirm       (observe)      → artifact read, artifact search (after Rank, before any surfacing: read the deposit's authoritative session transcript {config_dir}/projects/{slug}/{sid}.jsonl to confirm an evidential claim before it is surfaced; index-only readings stay provisional). The per-claim verdict is then recorded to Λ.confirmations (track) for the surfacing ops to consume
Phase 1 Rescope Qc    (constitution) → present (structured re-traversal navigation; mandatory on empty assembly before NullMatch)
Phase 1/3 surface     (extension)    → TextPresent+Proceed (exhausted-with-units terminal, presented ≠ ∅: best candidate — each composing deposit with its source + resume, per `Per-deposit traceability`, and each of its evidential claims rendered per the claim's retained Λ.confirmations verdict — + traversal scope, then deactivate — reached from Phase 1 on an empty re-traversal at the cap, or from Phase 3 on a Refine/Reorient request at the cap)
Phase 1 NullMatch inform (extension) → TextPresent+Proceed (exhausted-no-unit terminal, presented = ∅: traversal scope + broken-link notes, then deactivate)
Phase 2 mark_presented (track)       → Internal state update (presented := presented ∪ {U[top]} on entering the gate — the ever-assembled witness for NullMatch vs exhausted-with-units)
Phase 2 Qc            (constitution) → present (narrative higher-unit candidate incl. per-deposit SourceLocator + ResumeHandle, each evidential claim rendered per its Λ.confirmations verdict; gated path — ¬SingleObvious: candidate units ≥ 2 OR confidence < high)
Phase 2 emit          (extension)    → TextPresent+Proceed (SingleObvious path only: single densely-connected high-confidence unit emitted inline with its per-deposit SourceLocator + ResumeHandle and a divergence-only affordance, no turn yield, converge immediately). Relay basis: one dominant higher unit collapses the recognition option set to a single option (Refine/Reorient are foils), so the option set is relay rather than a gate; this conditional Constitution→Extension specialization within Phase 2 is the sanctioned revision of `Conditional recognition`'s Safeguard-tier mandatory-gate tag, motivated by observed binary-confirm abandonment friction. It is the relay-collapse kind of (extension), NOT a Standing-authority migration.
Phase 3 integrate     (track)        → Internal state update
Phase 3 emit          (extension)    → TextPresent+Proceed (HigherUnit_prose, incl. per-deposit SourceLocator + ResumeHandle)
converge              (extension)    → TextPresent+Proceed (convergence trace)
seam                  (extension)    → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol settles the next move — proceed directly to it, citing that settling source. This protocol declares no wired outbound continuation edge: its only cross-protocol edge-case is inbound (a prior recall seeding this protocol's R), not an outbound continuation, so the second trigger is vacuously absent. Every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, R: RecallTrace, unit_type: UnitType,
      units: List(HigherUnit),
      confirmations: List({ claim: EvidentialClaim, verdict: ∈ {confirmed, corrected, unattested} }),   -- per-claim Confirm verdicts written at Phase 1 (`confirmations := Confirm(surfaced_claims(U[top]))`, each claim checked against its OWN deposit's SSOT); consumed by every surfacing op (Phase 2 emit/Qc, Phase 3 emit, the exhausted-with-units terminal surface) so each claim renders per its verdict — confirmed/corrected ⇒ settled (corrected substitutes the SSOT value), unattested ⇒ provisional or omitted
      presented: Set(HigherUnit),   -- updated `presented := presented ∪ {U[top]}` on every Phase 1 → Phase 2 edge (a candidate reaching the gate); serves as the "ever-assembled" witness that discriminates NullMatch (presented = ∅) from the exhausted-with-units terminal (presented ≠ ∅), and supplies presented_best for that terminal's surface
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
                   -- recovery: Rescope navigation (widen boundary or change unit type); if still empty → NullMatch

BrokenLinkChain  : inferred edges resolve to targets with no written deposit (not-yet-written knowledge dominates the path)
                   -- cause: the connecting sessions were never indexed (lifecycle gap), or the knowledge is genuinely not yet deposited
                   -- detection: traversal infers mostly missing targets; assembled units are too thin to recognize
                   -- recovery: surface the broken-link scope as a traversal note (NOT an error)

UnitTypeMismatch : the recall trace was dispatched to the wrong UnitType (e.g. classified as TopicCluster but the user means a ConnectedSessionChain)
                   -- detection: A = Reorient(d), d describing a different unit shape
                   -- recovery: Reorient → re-dispatch UnitType → Phase 1

SingleSessionMisfire : a single session WOULD resolve the recall — Anagoge over-activated
                   -- cause: supra_session(R) misjudged at Phase 0
                   -- recovery: Phase 0 deactivation, not a loop attempt

IndexAsEvidence  : an evidential claim (origin, timing, quotation) asserted from the lossy index without confirming against the authoritative source
                   -- cause: a deposit index file (clue/narrative/coinage/…) is read as if it were the session record; the index omits or compresses what the source holds
                   -- detection: a load-bearing claim ("this is where it began", "first coined here") rests only on index files, never on the session source
                   -- recovery: read the deposit's authoritative session transcript before asserting; surface index-only readings as provisional (`Source-grounded evidence`)
```

## Mode Activation

`/ascend` is always available. AI-guided activation uses heuristic evidence that the recall points to a whole line of work, a topic scattered across deposits, an already-sedimented concept, or the destination of a multi-session trajectory. A `/recollect` result that locates one session while the user indicates a larger object is also an entry signal. These are clues for `supra_session(R)`, not substitutes for it.

On direct invocation, bind `R` from the current or recent context; when no recall target is recoverable, request it before Phase 0. A prior-session deposit may seed traversal but cannot constitute the higher unit. Skip AI-guided activation when the same unit was already elevated in the current session or the user declines elevation assistance.

## Protocol

### User-facing realization

Render the candidate in its `UnitType` shape: origin → development → arrival for a chain; topic → fragments → standing for a cluster; concept → forged-by deposits → node for a sedimented concept. Show the inferred connections that support the assembly, each composing deposit's `SourceLocator` and usable `ResumeHandle` (or the typed non-resumable note), the traversal scope and broken-link gaps, and the remaining traversal budget when another cycle is possible. Render every evidential claim from its retained `Λ.confirmations` verdict.

Put the essential higher-unit narrative first. State that it is a past trajectory requiring current-state re-verification. For `SingleObvious`, end the inline emit with concrete adjacent boundary/scope adjustments and an open reorientation affordance. For the gated path, present recognizable `Recognize` and `Refine` futures and keep `Reorient(description)` available as free response.

Use an abbreviated type-shaped narrative for a clear high-confidence unit, the full narrative plus traversal scope when alternatives remain, and add broken-link notes and Rescope navigation when the graph is sparse.

## Rules

- **Recognition over Recall**: Present a gated candidate with recognizable `Recognize` and `Refine` futures and keep `Reorient(description)` available for a different unit shape or recall dimension.
- **Conditional recognition**: Apply the typed `SingleObvious` inline path only at its exact guard; every other candidate follows the recognition gate.
- **Scope discipline**: Elevate only an edge-supported higher unit already implied by deposits. Single-session recall, discovery of new cases, concept formation, and reverse-tracing decision intent route outside Anagoge.
- **Rescope-first diagnosis**: Treat broken links as traversal scope. Preserve the `presented` distinction so NullMatch follows an earlier Rescope while exhausted-with-units returns the best prior candidate.
- **Substrate non-coupling**: Keep substrate names, paths, and storage bindings inside TOOL GROUNDING; runtime phase prose names only epistemic operations.
- **Round composition**: Use everyday language, keep each judgment beside its evidence and next-move implication, and put analysis before a gate. Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, material belongs to another round or trace, or phase order determines placement.
- **Per-deposit traceability**: Apply the `SourceLocator` and `ResumeHandle` rendering contract at every site that surfaces a composing deposit.
- **Source-grounded evidence**: Let each retained `Confirm` verdict govern how its evidential claim is surfaced; an unattested claim remains provisional or is omitted.
- **Form feedback**: Derive density from the current request and carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
