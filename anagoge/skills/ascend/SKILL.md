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
Anagoge(R) → Detect(R) →
  single_session_suffices(R): defer-to-Anamnesis → deactivate
  supra_session(R): Classify(R, Σ) → UnitType → Dispatch(UnitType) →
    Traverse_{UnitType}(Deposits, infer_edges(Deposits, Σ)) → Assemble(U[]) → Rank(U[]) →
    |U[]| = 0 ∧ attempts < max: Rescope(R, Σ) → Stop → S → rebind(R, S) → re-traverse
    |U[]| = 0 ∧ attempts = max: NullMatch → inform(R, Σ) → fallback → deactivate
    |U[]| > 0: Qc(U[top], narrative, framing) → Stop → A →
      Recognize(u): elevate_complete(u) → emit(HigherUnit_prose(u)) → converge
      Refine: adjust(boundary ∨ traversal_scope) → Phase 1
      Reorient(d): rebind(UnitType ∨ recall_dimension, d, Σ) → Phase 1/0

── MORPHISM ──
ScatteredDeposits × DepositGraph
  → detect(supra_session)              -- recognize granularity insufficiency: right unit is above one session
  → classify(unit_type)                -- UnitType ∈ {ConnectedSessionChain, TopicCluster, SedimentedConceptNode}
  → dispatch(unit_type)                -- select traversal shape for the dispatched type
  → traverse(Deposits, infer_edges)    -- INFER cross-partition edges at read-time from stored anchors + shared keywords/metadata; broken-link-tolerant
  → assemble(candidate_units)          -- compose higher units of the dispatched type from the inferred-edge-connected deposits
  → rank(units, recall_trace)          -- order by recall alignment + connectivity
  → present(unit, Socratic)            -- narrative presentation of one candidate higher unit
  → recognize(unit, user)              -- synthesis of identification at the higher granularity
  → emit(HigherUnit_prose)             -- NL rendering to session text
  → HigherGranularityUnit
requires: supra_session(R)              -- granularity checkpoint (Phase 0): single session would NOT resolve it
deficit:  RecallGranularityInsufficient -- activation precondition (Layer 1/2)
preserves: DepositGraph                 -- deposits are read-only; traversal edges are reconstructed at read-time, never written; cross-slug reads only, never cross-slug writes
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
Deposit          = { slug: String, sid: String, topic: String,
                     fingerprint: Prose, cross_refs: List(Anchor) }          -- one partition-local sediment unit; cross_refs are STORED, partition-local, exactly what Anamnesis writes
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
Traverse         = (Set(Deposit), Set(TraversalEdge)) → Set(HigherUnit)   -- UnitType-dispatched inferred-edge-following assembly
Assemble         = Set(Deposit) × Set(TraversalEdge) → Set(HigherUnit)    -- compose inferred-edge-connected deposits into typed units
Rank             = List(HigherUnit) → List(HigherUnit)           -- recall-alignment + inferred-edge-connectivity dominate
Rescope          = (R, Σ) → List(RescopeOption)                  -- structured re-traversal navigation on empty assembly
RescopeOption    = { dimension: ∈ {boundary, scope, unit_type}, option: String }
S                = ScopeHint    -- user navigation answer from Rescope gate (Qc-rescope)
A                = Recognition ∈ {Recognize(HigherUnit), Refine, Reorient(description)}
Prose            = String       -- source-agnostic NL description
HigherUnit_prose = String
HigherGranularityUnit = session text containing HigherUnit_prose
               -- elevation establishes the UNIT (these deposits form THIS higher whole), not current-reality FIDELITY:
               -- a recognized chain/cluster/concept describes a PAST trajectory; downstream consumers re-verify against
               -- current state before commit rather than treating the elevated unit as confirmed current context
NullMatch        = predicate; canonical definition in ── CONVERGENCE ──
Phase            ∈ {0, 1, 2, 3}

── R-BINDING ──
bind(R) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ inbound_handoff
Priority: explicit_arg > colocated_expr > prev_user_turn > inbound_handoff

/ascend "text"              → R.trace = extract_trace("text", Σ)
"the whole line of... "     → R.trace = extract_trace(text before trigger, Σ)
/ascend (alone)             → R.trace = extract_trace(previous user message, Σ)
inbound_handoff             → R.trace seeded from an upstream protocol's session text (e.g. Anamnesis entry deposit, Hyphegesis synthesis checkpoint)

Edge cases:
- Multiple vague references: bind to first, note others
- Re-invoke after NullMatch: fresh R, no carryover
- Composition (/recollect → /ascend): single-session recall provides an entry deposit; /ascend traverses outward from it

── PHASE TRANSITIONS ──
Phase 0: R → Detect(R) → supra_session(R)?                         -- granularity trigger (silent)
           → Classify(R, Σ) → UnitType                              -- dispatch (silent)
Phase 1: R → Traverse_{UnitType}(Deposits, infer_edges(Deposits, Σ)) → Assemble(U[]) → Rank(U[]) → U[ranked]  -- read-time inferred-edge assembly + rank [Tool]
           |U[ranked]| = 0 ∧ attempts < max → Rescope(R, Σ) → Qc → Stop → S → rebind(R, S) → attempts := attempts + 1 → Phase 1
           |U[ranked]| = 0 ∧ attempts = max → NullMatch → inform → fallback → deactivate
Phase 2: U[top] → Qc(U[top], narrative, framing) → Stop → A         -- recognition gate [Tool]
Phase 3: A → integrate(A, R, Σ) →                                   -- integration (track); attempts := attempts + 1 on any re-traversal branch (Refine/Reorient), cap evaluated at Phase 1 entry
           Recognize(u) → HigherUnit_prose(u) → emit → converge
           Refine → adjust(boundary ∨ traversal_scope) → attempts := attempts + 1 → Phase 1    -- boundary/scope adjustment (sense)
           Reorient(d) → rebind(UnitType ∨ recall_dimension, d, Σ) → attempts := attempts + 1 → Phase 1/0   -- orthogonal re-dispatch (sense)

── LOOP ──
Phase 1 → Phase 2 → Phase 3 →
  Recognize: converge
  Refine: adjust unit boundary or traversal scope → attempts := attempts + 1 → Phase 1
  Reorient: change unit type or recall dimension → attempts := attempts + 1 → Phase 1 (or Phase 0 on dimension change)

Max 3 elevation attempts. `attempts` increments once per traversal/rescope cycle; the cap is evaluated at Phase 1 entry. Exhausted (attempts = max), split by whether any unit assembled:
  - no assembled unit (|U[]| = 0) → surface traversal scope + broken-link notes → NullMatch fallback → deactivate
  - assembled-but-unrecognized units (|U[]| > 0) → surface the top-ranked candidate + traversal scope → deactivate
Convergence evidence: (ScatteredDeposits → [edges traversed] → HigherUnit(recognized) → HigherUnit_prose).

── CONVERGENCE ──
elevate_complete = Recognize(u) for some u ∈ U[]
NullMatch = |U[]| = 0 ∧ attempts = max  -- no higher unit assembles at all (deposits too sparse, or inferred edges resolve only to not-yet-written targets)
                                        -- the exhausted-WITH-units path (|U[]| > 0 ∧ attempts = max) is NOT NullMatch: it surfaces the top candidate and deactivates (see ── LOOP ──)
fallback(NullMatch) = offer Anamnesis (single-session resolution from an entry deposit)
                    ∨ offer Aitesis (when the cases must be newly found, not traversed)
progress(Σ) = attempts: N/max, units_assembled: N, inferred_edges_followed: N

── TOOL GROUNDING ──
-- Realization binding (Claude Code substrate), non-normative w.r.t. protocol essence — see ── SUBSTRATE AGNOSTICISM ──; any substrate satisfying the morphism laws and graph invariants realizes Anagoge.
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
-- Realization ⓐ (READ-TIME cross-partition reconstruction over the Anamnesis hypomnesis index):
--   {slug} = Claude Code's project partition identifier (dirname of a transcript)
--   Deposit              ↦ ~/.claude/projects/{slug}/hypomnesis/{sid}/   (a per-session recall INDEX entry, partition-local)
--   Deposit.cross_refs   ↦ clue.md StructuredAnchor list (kind ∈ {memory, github_issue, github_pr} + legacy bare strings) — STORED, partition-local; these are NOT cross-slug deposit pointers
--   Deposit.fingerprint  ↦ narrative.md (origin/outcome prose)
--   Deposit.topic        ↦ clue.md frontmatter topics[0]
--   TraversalEdge.kind / TraversalEdge.to ↦ inferred at traversal time, not stored
--   Traversal start      ↦ entry deposits; read their stored cross_refs anchors ({memory, github_issue, github_pr} + legacy) and INDEX keywords/metadata,
--                          then DISCOVER related deposits across partitions by READ-TIME SEARCH (Read/Grep/Glob over `~/.claude/projects/*/hypomnesis/`) for shared anchors / keywords / session metadata
--   DepositGraph         ↦ the deposits reachable by this read-time inference outward from the entry deposits — NO central index file, and NO pre-written cross-slug deposit graph;
--                          the graph exists only as the inferred union of read-time connections (no-central-aggregator invariant). Cross-partition connections are INFERRED at read-time; Anamnesis has NOT pre-written a cross-slug deposit graph.
--   broken link          ↦ an inferred edge whose target deposit has no written entry — read as not-yet-written knowledge, skipped, never an error
-- Span invariant binding: traversal issues cross-partition READS only (Read/Grep/Glob across `~/.claude/projects/*/hypomnesis/`); it NEVER writes to any slug. Each partition still owns its own writes; Anagoge adds none.
-- Alternative realizations (documented, not active): ⓑ persisted-edge graph — if a future substrate stores cross-slug deposit pointers as first-class records, traversal could follow them directly rather than re-inferring at read-time; ⓒ a full Open Knowledge Federation link-graph store materializing edges as first-class records. ⓐ is chosen because it requires no schema beyond what Anamnesis already deposits and adds zero write surface.
Phase 0 Detect        (sense)        → Internal analysis (supra-session granularity; distinguish from single-session Anamnesis)
Phase 0 Classify      (sense)        → Internal analysis (UnitType detection from R + Σ)
Phase 1 Traverse      (observe)      → Read, Grep, Glob (read entry-deposit anchors + index keywords/metadata, then search cross-partition for shared anchors/keywords/metadata; read-only, read-time inference)
Phase 1 Assemble      (sense)        → Internal analysis (compose inferred-edge-connected deposits into typed higher units)
Phase 1 Rank          (sense)        → Internal analysis (recall alignment + inferred-edge connectivity; conditional haiku scoring for large unit sets)
Phase 1 Rescope Qc    (constitution) → present (structured re-traversal navigation; mandatory on empty assembly before NullMatch)
Phase 2 Qc            (constitution) → present (narrative higher-unit candidate; mandatory)
Phase 3 integrate     (track)        → Internal state update
Phase 3 emit          (extension)    → TextPresent+Proceed (HigherUnit_prose)
converge              (extension)    → TextPresent+Proceed (convergence trace)

── MODE STATE ──
Λ = { phase: Phase, R: RecallTrace, unit_type: UnitType,
      units: List(HigherUnit), presented: Set(HigherUnit),
      recognized: Optional(HigherUnit),
      rescopes: List(RescopeOption),
      attempts: Nat,   -- incremented once per traversal/rescope cycle (Phase 1 rescope rebind, Phase 3 Refine/Reorient); cap (max 3) evaluated at Phase 1 entry
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
```

## Core Principle

**Recognition over Aggregation**: When a vague recall has enough signal to recognize that *something* matters, but the right resolution unit is not any single session — it is a connected line of work, a topic cluster, or an already-sedimented concept — Anagoge leads the recall *up* to that higher unit by recognizing the unit the scattered deposits already imply. It does this by reconstructing the connections between deposits at read-time from their stored anchors plus shared keywords and metadata, not by fusing or synthesizing a new whole. The decisive mark of the deficit is that the recognition *object* changes: the user is no longer trying to locate one session, but to see the higher unit standing above many.

The traversal reconstructs the connected deposits at read-time; the narrative Qc enables recognition of the higher unit; the user constitutes the unit's identity. Three constitutive distinctions:

1. **Object elevation, not retrieval**: Anamnesis resolves recall to one session; Anagoge resolves it to the supra-session unit that session belongs to. The Phase 0 test is decisive — if a single session would resolve the recall, Anagoge defers to Anamnesis; Anagoge activates only when the right unit is genuinely above the session.

2. **Recognition by traversal, not aggregation**: The higher unit is assembled by *reconstructing the connection at read-time from anchors + shared keywords/metadata* between deposits — a chain is the line the shared session/temporal signals trace, a cluster is the fragments the shared topic keywords connect, a concept node is the sediment the shared concept anchors forged. Anagoge writes nothing and forms no new abstraction; it makes visible the unity the deposits point to.

3. **Type-dispatched narrative**: The candidate is presented in the shape of its UnitType — a chain as the connected line of work (origin → development across sessions → arrival); a topic cluster as the gathered fragments plus where the topic stands; a sedimented concept node as the node plus which deposits forged it.

## Mode Activation

### Activation

AI detects granularity insufficiency in user expression (Layer 2, silent Phase 0) OR user calls `/ascend` (Layer 1, always available). Recognition always requires user interaction at the Phase 2 gate. On direct `/ascend`, bind `R` from current/recent context; if none recoverable, request the recall target before Phase 0.

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

**Action**: At Phase 2, present the candidate higher unit as a narrative for user recognition via Cognitive Partnership Move (Constitution).
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
| elevate_complete (Recognize) | Emit HigherUnit_prose; proceed with the recognized higher unit as past trajectory requiring re-verification against current state before commit (not confirmed current context) |
| NullMatch (all attempts exhausted) | Surface traversal scope + broken-link notes, offer Anamnesis (single-session) or Aitesis (newly-found cases) fallback, deactivate |
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
5. If `supra_session(R)`: record `R` with extracted trace and `UnitType` — proceed to Phase 1.

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
5. If `|U[]| = 0`: do NOT declare NullMatch yet. Present a **Rescope** navigation gate (Constitution) — structured options to widen the boundary, broaden the scope, or change the unit type — then re-traverse with the rebind. Only after rescope attempts are exhausted (attempt cap reached) declare NullMatch: surface the traversal scope and broken-link notes, then offer the fallback (Anamnesis single-session resolution from an entry deposit, or Aitesis if the cases must be newly found).

**Scope restriction**: Traversal uses Read, Grep, Glob exclusively. Cross-partition reads only — never cross-slug writes; Anagoge writes nothing.

### Phase 2: Narrative Recognition (Constitution)

**Present** the highest-ranked candidate higher unit as a narrative for user recognition via Cognitive Partnership Move (Constitution).

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
- **Traversal scope**: which partitions were reached, and any broken-link gaps (not-yet-written targets) noted as scope, not error
- **Framing**: how many elevation tries remain before the cap, and how much of the deposit graph is still in scope — stated as the budget you reason with, not a numeric attempt fraction

Then **present**:

```
Is this the higher unit you were reaching for?

Options:
1. **Recognize** — this is the connected unit I had in mind
2. **Refine** — the unit is close but its boundary or scope needs adjusting
```

Other is always available — maps to `Reorient`: the user means a fundamentally different unit type or recall dimension (e.g. a topic cluster rather than a chain, or a different recall axis). The protocol re-dispatches the unit type or rebinds the recall dimension and re-traverses.

### Phase 3: Integration

After user response:

1. **Recognize(u)**: Mark the unit as recognized. Emit `HigherUnit_prose` — natural-language rendering of the recognized higher unit to session text: the unit's shape (chain line / cluster fragments / concept node), the deposits composing it, the edges traversed, and key cross-references. This prose enters session text and is readable by any downstream protocol via Session Text Composition. `HigherUnit_prose` carries a currency≠fidelity caveat: it states that the deposits form this higher unit as a past trajectory, not that the unit's content is verified against current reality — downstream consumers treat it as elevated-and-requiring-re-verification, not as confirmed current context.

2. **Refine**: Unit recognized as close but mis-bounded. Adjust the unit boundary (add/drop a deposit at the edge) or the traversal scope (widen/narrow which partitions to reach), re-enter Phase 1 with the adjustment.

3. **Reorient(description)**: The user surfaces a different unit type or recall dimension. `rebind(UnitType ∨ recall_dimension, d, Σ)` re-dispatches the unit type (Phase 1 re-traverse) or, when the recall dimension itself changes, rebuilds `R` (Phase 0 re-classify). Re-enter at the appropriate phase.

   **Refine vs Reorient test**: would the user's new description keep the same unit type and overlap the current candidate? Overlap + same type → Refine; different type or disjoint → Reorient.

After integration: `elevate_complete` → present the convergence evidence trace (ScatteredDeposits → [edges traversed] → HigherUnit(recognized) → HigherUnit_prose emitted), proceed. Refine → Phase 1 with adjusted boundary/scope. Reorient → Phase 1/0 with re-dispatched unit type or rebuilt trace. On any re-traversal branch (Refine/Reorient), `attempts := attempts + 1`; the cap (max 3) is evaluated at Phase 1 entry — when exhausted, surface per the LOOP exhaustion split (top candidate + scope if any unit assembled, else NullMatch fallback) and deactivate. Log `(HigherUnit, A)` to history.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Clear unit shape, single densely-connected candidate | Abbreviated narrative (origin + arrival, or topic + standing) + gate with Recognize default |
| Medium | Moderate signal, 2-3 candidate units in scope | Full type-shaped narrative + traversal scope |
| Heavy | Unit shape unclear, Reorient likely, sparse/broken edges | Full narrative + traversal scope + broken-link notes + Rescope navigation on empty assembly |

## Rules

1. **AI-guided detection, user-constituted recognition**: AI detects granularity insufficiency, traverses the deposit graph, and presents the candidate higher unit as a recognition option; user identification via Cognitive Partnership Move (Constitution) at Phase 2 constitutes the unit's identity. Detection, traversal, and constitution are separate acts — AI detection is implicitly confirmed when the user engages with recognition (Phase 2 response, not Esc).

2. **Recognition over Aggregation**: The higher unit is recognized by reconstructing the connections between deposits at read-time from their stored anchors plus shared keywords/metadata — Anagoge never fuses, synthesizes, or forms a new whole, and writes nothing. Present structured narrative options with anticipatable post-selection state (Recognize / Refine / Reorient); Constitution interaction requires turn yield before proceeding.

3. **Supra-session granularity gate**: Phase 0 activates Anagoge only when the right resolution unit is above a single session. If a single session would resolve the recall, defer to Anamnesis — the decisive mark is that the recognition object is an edge-supported higher unit, not one session.

4. **Type-dispatched traversal and narrative**: Phase 1 dispatches the traversal by `UnitType` (chain / topic cluster / concept node) and Phase 2 presents the candidate in the shape of its type. A single generic presentation shape has structural blind spots regardless of unit type.

5. **Read-time edge inference, never cross-slug write (Span invariant)**: Traversal reconstructs cross-partition edges at read-time from stored anchors + shared keywords/metadata with reads only; it issues no cross-slug writes and no writes at all. Each partition owns its own writes — isolation is preserved.

6. **Broken-link tolerance**: An inferred edge to a missing target is not-yet-written knowledge, never an error — skip it and surface its absence as a traversal-scope note. A thin assembly from broken links routes to Rescope, then NullMatch fallback, not to a failure.

7. **One higher unit per cycle**: Present one highest-ranked candidate higher unit per Phase 2 cycle — single-candidate presentation keeps recognition focus on a single elevation decision.

8. **Convergence persistence and early exit**: Mode active until elevate_complete, NullMatch after exhausted attempts, single-session misfire deferral, or user Esc; recognition or rejection of a candidate is final for that candidate in the current session, and Esc is accepted immediately regardless of remaining attempts.

9. **Convergence evidence**: Present the transformation trace (ScatteredDeposits → edges traversed → HigherUnit(recognized) → HigherUnit_prose) before declaring elevate_complete — convergence is demonstrated per-item, not asserted. The trace enumerates the edges followed and the deposits composing the unit.

10. **Boundary discipline (vs adjacent protocols)**: Defer to Anamnesis when one session resolves the recall; to Aitesis (`/inquire`) when the cases must be newly found rather than traversed from existing deposits; to Periagoge (`/induce`) when the user wants to FORM a new concept rather than RECOGNIZE an already-sedimented one (SedimentedConceptNode is recognition-only); to Euporia (`/elicit`) when the user wants to reverse-trace decision intent rather than locate a remembered unit. A Hyphegesis (`/conduct`) synthesis checkpoint may route INTO Anagoge to elevate scattered cross-worker results into a connected-session unit.

11. **NullMatch fallback diagnosis**: On NullMatch after exhausted Rescope, surface the traversal scope (partitions reached, edges followed) and broken-link notes, then offer the fallback — Anamnesis single-session resolution from an entry deposit, or Aitesis when the missing cases must be newly found. Sparse deposits and broken-link chains are reported as scope, not framed as protocol failure.

12. **Rescope-first NullMatch**: At least one Rescope navigation gate precedes any NullMatch declaration — first traversal returning zero units → Rescope → re-traverse → NullMatch declaration only if still empty.

13. **Substrate non-coupling**: Phase prose names epistemic operations only — tool, path, and deposit-index bindings (realization ⓐ) belong exclusively to TOOL GROUNDING; ⓑ/ⓒ are documented alternative realizations.

14. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.

15. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.

16. **Context-Question Separation**: Present narrative context, traversal evidence, and broken-link notes as text before the Constitution interaction; the interaction contains only the recognition question and options with differential implications. Embedding context inside the question field violates this invariant.

17. **Elevated unit currency is not fidelity**: Elevation constitutes the unit (these deposits form this higher whole), not current-reality agreement (it still holds). A correctly recognized higher unit may still be desynced from current reality — the recognition gate verifies the unit, not its fidelity. `HigherUnit_prose` emits with a currency≠fidelity caveat; the elevated unit is re-verified against current state before commit and is not handed to downstream protocols as confirmed current context.

18. **Gate integrity** (Safeguard tier): The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing the narrative to the dispatched UnitType, or pairing "Recognize" with a unit-specific label, while preserving the Recognition coproduct) is distinct from mutation.
