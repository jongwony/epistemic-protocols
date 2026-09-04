---
name: recollect
description: "Resolve vague recall into recognized context through AI-guided contextual scan and user-validated recognition — one session, or the line of work, topic, or settled concept spread across several."
---

# Anamnesis Protocol

Resolve vague recall into recognized context through AI-guided contextual scan and user-validated recognition. Type: `(RecallAmbiguous, AI, RECOGNIZE, VagueRecall) → RecalledContext`.

## Definition

**Anamnesis** (ἀνάμνησις): A dialogical act of resolving vague recall into recognized context, where AI detects empty intention, scans the SSOT plus the hypomnesis INDEX with contextual awareness (`memory/` is a non-scanned, user-curated realization-layer adjunct — see STORE TOPOLOGY), presents narrative candidates for Socratic recognition, and facilitates guided recall orientation when initial candidates do not match — grounded in user-constituted identification rather than keyword retrieval.

```
── FLOW ──
Anamnesis(V) → Detect(V) →
  not-empty_intention(V): relay(finding) → proceed (no activation)
  empty_intention(V): Classify(V, Σ) → InputType, Unit → Dispatch(InputType) → Track ∈ {entropy, salience, hybrid} → set(scan_scope = spine, attempts = 0) →
    Scan_{Track,Unit}(INDEX ⊕ SSOT_spine ⊕ (scan_scope = full_text ? SSOT_body : ∅), V) → set(traversal_scope) → Rank(O[], trace(V)) →
    |O[]| = 0 ∧ attempts = 0: Probe(V, Σ) → Qs(probe) → Stop → H → enrich(V, H) → set(attempts = attempts + 1) → re-scan
    |O[]| = 0 ∧ attempts > 0 ∧ fulltext_unscanned: Qx(StoreExpansion) → Stop → X →
      ExpandFullText: set(scan_scope = full_text) → Scan_{Track,Unit}(SSOT_body, V) → set(traversal_scope) → Rank(O[], trace(V)) → continue
      StopAtSpine: NullMatch → inform(V, Σ) → deactivate
    |O[]| = 0 ∧ attempts > 0 ∧ fulltext_scanned: NullMatch → inform(V, Σ) → deactivate
    |O[]| > 0: backtrace_parent(c) ∀ c ∈ members(O[]) : fork_marker(c) → parent_pointer, parent_cwd   -- deterministic: a fork member's parent is recoverable from its own record, not inferred (mechanism in TOOL GROUNDING; ≠ user-described Reorient)
               O[top] := Confirm(O[top])   -- each claim O[top]'s narrative asserts as fact, read against the member record it originates from, before any Phase 2 output; the assignment rewrites the head of O[ranked], so every later read — the SingleObvious guard, Qc's evidence, the emit — sees the confirmed object; no claim at session scope, so no read
               SingleObvious(O[]): emit(ClueVector_prose(O[top]) ⊕ divergence_affordance) → recall_complete → converge   -- Extension (relay): high-confidence single recognizable, no turn yield; silence = Recognize. Convergence is notional (inline skill prose persists), so a next-turn divergence re-engages via fresh re-detection (Layer 1/2 activation) — not an encoded transition out of the converged state — then routes to Refine/Reorient (no dedicated re-activation machinery added)
               ¬SingleObvious(O[]): Qc(O[top], evidence, framing) → Stop → R →
      Recognize(o): recall_complete → emit(ClueVector_prose(o)) → converge      -- fork: emitted pointer = parent (or, when the parent record is absent, non-resumable + recoverable artifacts)
      (Refine ∨ Reorient(d)) ∧ attempts = max: surface(O[top]) → deactivate      -- AttemptsExhausted: recall-try budget spent with recognizables in hand
      Refine ∧ attempts < max: Probe(V, Σ) → Qs(probe) → Stop → H → enrich(V, H) → set(attempts = attempts + 1) → re-scan
      Reorient(d) ∧ attempts < max: rebind(V, d, Σ) → set(attempts = attempts + 1) → Phase 1                 -- orthogonal dimension shift; a description naming a different whole re-classifies V.unit

── MORPHISM ──
VagueRecall
  → detect(empty_intention)              -- recognize vague recall state
  → classify(input_type, unit)           -- InputType ∈ {StructuredIdentifier, NaturalRecall, Mixed}; Unit ∈ {session, line, topic, concept} — the granularity the intention names
  → dispatch(input_type)                 -- Track ∈ {entropy, salience, hybrid}
  → scan(INDEX ⊕ SSOT_spine, Track, Unit, recall_trace)  -- compact index + raw-record spines, track-specific (see STORE TOPOLOGY); above session scope the candidates are joined into recognizables by read-time inferred edges (── SCAN ABOVE SESSION SCOPE ──)
  → rank(recognizables, recall_trace)    -- order by relevance; assigns confidence
  → probe(user)?                         -- required before a zero-result may terminate or expand
  → expand(SSOT_body, user)?             -- only after an enriched spine-scope miss and StoreExpansion
  → rank(expanded_recognizables, recall_trace)?
  → backtrace_parent(member)             -- when fork_marker: deterministic parent identification → parent_pointer, parent_cwd (recovered from the member's own record; ≠ user-described Reorient)
  → confirm(recognizable)                -- each claim the narrative asserts as fact, read against the member record it originates from; no read at session scope
  → present(recognizable, Socratic)      -- Socratic presentation; absorbed into the emit for SingleObvious (high-confidence single recognizable) — Extension, no turn yield
  → recognize(recognizable, user)        -- synthesis of identification (Husserl CM §§38-39); for SingleObvious, realized as silence-default behind a divergence-only affordance (non-divergence constitutes recognition)
  → emit(ClueVector_prose)               -- NL rendering to session text
  → RecalledContext
requires: empty_intention(V)              -- phenomenological trigger
deficit:  RecallAmbiguous                 -- activation precondition (Layer 1/2)
preserves: Store                          -- SSOT ⊕ INDEX are read-only; V is enriched/rebound during protocol
invariant: Recognition over Retrieval

── TYPES ──
V                = VagueRecall { trace: RecallTrace, enrichments: List(Hint), input_type: InputType, unit: Unit }
RecallTrace      = { keywords: Set(String), temporal: Optional(String),
                     associations: Set(String), identifiers: Set(IdentifierTuple) }
Hint             = String   -- user recall context from Socratic probe
InputType        ∈ {StructuredIdentifier, NaturalRecall, Mixed}      -- classified from V + Σ
Track            ∈ {entropy, salience, hybrid}                       -- dispatched from InputType
Unit             ∈ {session, line, topic, concept}                   -- the granularity the intention names, classified from V + Σ alongside InputType; rebound by a granularity answer (Qs) or Reorient(d). Closed on a stated premise: the three values above session are the three ways candidates join — succession, shared topic, a settled concept — and a recall matching none of them is at session scope
Source           = String   -- opaque: store location identifier (substrate-agnostic)
IdentifierTuple  = { literal: String, source: Source, source_namespace: String, precision: ℝ[0,1] } -- entropy-track anchor
                  -- source_namespace determines which claim kinds it can authorize (via the registry); a literal anchors ranking only when its namespace authorizes the recall trace's claim kind
                  -- claim_kind is NOT a tuple field — it is determined by source_namespace at scan time, so the writer materializes only source_namespace (the extractor's namespace), not a per-literal claim_kind
MarkerProfile    = { coinage: Set(Token), actor: Set(Entity),
                     temporal: Set(TimeRef), emotional: Set(Marker),
                     cognitive: Set(Marker), singularity: Set(Event) }  -- salience-track profile
DateAnchor       = String   -- ISO 8601 date; reference point for salience-track temporal normalization (e.g., session start). Optionality is carried at the use site (DateAnchor?)
EvidenceMode     = {user_constituted, attested, observed, inferred}   -- totally ordered tier of the content's evidential STANDING (who stands behind it: user-authored verbatim > party-asserted with verbatim witness > mechanically present without assertion > LLM-synthesized) — NOT extractor reliability (that is extraction_method's concern). Assigned at write time by construction of each artifact's production path (deterministic metadata, never LLM-judged). Ranks recall weight only — NEVER suppresses/excludes; introduces no automatic effectivity (any downstream status change stays user-gated).
SourceScan       = { skipped_lines: Nat, unverified_user_turns: Nat, omitted_chars: Nat }   -- how completely the record's own source reached the extractor: transcript lines that failed to parse, human turns absent from the runtime's own cross-check channel, and characters a bounded extraction dropped from the middle of a long session. Any count non-zero ⇒ the record was built from less than its whole source, so the emit says so (`Recalled context currency is not fidelity`)
Store            = SSOT ⊕ INDEX               -- see ── STORE TOPOLOGY ── block
Candidate        = { session_id: Optional(SessionId),
                     runtime: Source,
                     cwd: Optional(String),
                     topic: String,
                     keywords: Set(String),
                     fingerprint: Prose,
                     cross_refs: List(Anchor),
                     confidence: ∈ {low < medium < high},   -- totally ordered tier (cf. EvidenceMode); at session scope it is the recognizable's confidence, so it grounds the SingleObvious confidence = high guard and the confidence < high gate
                     evidence_mode: Optional(EvidenceMode),       -- highest tier among the signals that matched this candidate at scan time; Null ⇒ INDEX entry predates evidence-mode capture — Null is NEUTRAL in ranking (no contribution), never a penalty
                     source_scan: Optional(SourceScan),           -- capture-time integrity of the record's own source, published by the writer; Null ⇒ the entry predates integrity capture. NEUTRAL in ranking exactly as evidence_mode is: it qualifies what the emit says about a candidate, never what the candidate scores
                     fork_marker: Bool,                          -- true ⇒ the id is a sidechain/fork with no top-level SSOT (SidechainNoSSOT); its own id is not a valid resume handle. Invariants: fork_marker = false ⇒ parent_pointer = Null ∧ parent_cwd = Null ; parent_pointer = Null ⇒ parent_cwd = Null (parent_cwd requires parent_pointer; parent_pointer present with parent_cwd = Null is valid — parent identified but its cwd is unknown)
                     parent_pointer: Optional(SessionId),        -- orchestrating parent session for a fork candidate, read directly from the fork's own record; the resumable handle when the parent's top-level SSOT still exists (Null ⇒ parent record absent → non-resumable)
                     parent_cwd: Optional(String) }              -- parent session's working directory, paired with parent_pointer to build the parent resume handle (Null ⇒ parent record absent, OR parent identified but its cwd metadata is unknown — parent transcript predates cwd capture)
Anchor           = StructuredAnchor | LegacyAnchor      -- Candidate.cross_refs element; extends-edge sediment (context-adding annotation)
StructuredAnchor = { kind: ∈ {memory, github_issue, github_pr}, ref: String, channel: ∈ {user, transcript} }
                  -- the stored form tells a later reader WHAT kind of reference and from WHICH utterance channel; it confers NO effectivity — a structured anchor is never authoritative by form, it remains a recall clue requiring the same re-verification as any recalled context
                  -- kind reuses the entropy source_namespace vocabulary where overlapping (github_issue, github_pr); memory is sediment-local. StructuredAnchor ≠ IdentifierTuple: no precision, no compatible_anchor authorization — shared value vocabulary, disjoint machinery (annotation vs anchoring)
                  -- ref stores the canonicalized literal (issue/PR numbers normalized to "#N", memory paths prefixed "memory/"); canonical-form grep over INDEX is form-invariant (a search for "#309" hits ref: "#309") — the canonical form is the dedup key, so raw surface variants ("PR 309") collapse into it
LegacyAnchor     = String   -- opaque: memory path, URL, session ID, doc path — entries written before structured anchors; read as kind-unknown extends edges, never rejected, no migration
Prose            = String   -- source-agnostic NL description
Recognizable     = { unit: Unit, members: NonEmpty(Candidate), narrative: Prose,
                     confidence: ∈ {low < medium < high},   -- assigned by Rank: the member's own Candidate.confidence at session scope; recall-trace alignment and edge connectivity above it; capped at medium by Confirm while any claim stays unattested. Grounds the SingleObvious guard at every scope
                     claims: Set(Claim × Verdict) }          -- the Phase 2/3 object at every scope; unit = session ⟺ |members| = 1. At session scope the narrative is the member's fingerprint and claims = ∅; above it the members are joined by read-time inferred edges and the narrative is in the unit's shape (── SCAN ABOVE SESSION SCOPE ──)
Claim            = { content: Prose, source: Candidate }   -- a reading the narrative asserts as fact beyond any one member's own index entry (origin attribution, coinage timing, a quoted decision), sourced to the ONE member it originates from; written unattested by the scan, so a claim is never asserted before its record is read. content is what the emit will assert: the scan writes the index reading, and Confirm overwrites it with the record's value on a corrected verdict, so no verdict has to carry a payload beside it
Verdict          ∈ {confirmed, corrected, unattested}   -- confirmed ⇒ assert as settled; corrected ⇒ assert the record's value and discard the index reading; unattested ⇒ provisional or omitted, never asserted as fact
Confirm          = Recognizable → Recognizable   -- opens each claim's source record through its runtime reference and writes the verdict on the claim, overwriting claim.content with the record's value where the verdict is corrected — the index reading is discarded there, so what the emit asserts is already in the field; |claims| reads, bounded by what the narrative will assert, never by the store; a member with no record locator leaves its claims unattested; then confidence := min(confidence, medium) while any claim is unattested. Idempotent: a claim already read is not re-read, and re-reading a record would yield the same value it already wrote. Bound at Phase 1 by `O[top] := Confirm(O[top])` and nowhere else — every downstream read takes the confirmed object from O[ranked]'s head
O[]              = List(Recognizable)   -- the scan's ranked result at V.unit; O[top] is its head; members(O[]) the candidates across it
Rank             = (List(Recognizable), RecallTrace) → List(Recognizable)   -- track-primary signal dominates; above session scope edge connectivity joins it (references/supra-session.md); evidence_mode is a secondary tie-break + confidence modulator only (never a filter; Null neutral)
Probe            = (V, Σ) → List(SocraticQuestion)
SocraticQuestion = { dimension: ∈ {temporal, associative, contextual, granularity}, question: String }   -- granularity asks which whole is meant: one session, or the line, topic, or concept above it
enrich           = (V, H) → V   -- H extends V.enrichments and the trace; an answer on the granularity dimension rebinds V.unit
rebind           = (V, description, Σ) → V   -- orthogonal re-extraction of the trace; a description naming a different whole re-classifies V.unit
TraversalScope   = the sub-graph Traverse returned with each skipped broken-link edge noted (references/supra-session.md); ∅ at session scope. Carried in Λ.traversal_scope, written by the Phase 1 scan step as its state effect and read from there by Qc's evidence and the NullMatch diagnosis — both sit past a turn yield the scan does not survive, and re-deriving at the consumer would be a second traversal read. This is the above-session form of the coverage Λ.scan_scope already carries at session scope, so it rides the same way
R                = Recognition ∈ {Recognize(Recognizable), Refine, Reorient(description)}
X                = StoreExpansion ∈ {ExpandFullText, StopAtSpine}
ScanScope        ∈ {spine, full_text}   -- spine = INDEX ⊕ SSOT_spine (the initial scope); full_text additionally admits SSOT_body
fulltext_unscanned ≡ Λ.scan_scope = spine
fulltext_scanned   ≡ Λ.scan_scope = full_text
SingleObvious    = predicate; SingleObvious(O[]) ≡ |O[]| = 1 ∧ confidence(O[top]) = high   -- Light-only Extension guard: the one recognizable is the single dominant option (option-set entropy → 0 → relay), so Qc is absorbed into the emit; Medium (|O[]| ≥ 2) and Heavy (confidence < high) keep the Qc gate. Confirm runs first, so a recognizable resting on an unread claim is never relayed
divergence_affordance = the mismatch channel folded into the non-yielding SingleObvious emit: names concrete adjacent recognizables (Refine — above session scope, boundary and traversal-scope adjustments) AND offers an open free-response invitation (Reorient), keeping the full R = {Recognize, Refine, Reorient} coproduct reachable without a gate — Recognize is realized as silence-default
emitted(x)       = predicate; the relay emit(x) has fired in session text — the Extension-path convergence witness (event predicate; satisfied by the non-yielding SingleObvious emit, no turn yield)
H                = Hint     -- answer from Socratic probe gate (Qs)
ClueVector_prose = String   -- the rendering of a recognizable, one contract at every emit site: the narrative in the unit's shape, each member with the source locator and resume handle its runtime reference validates, each claim per its verdict (a claim not yet read renders as unattested)
RecalledContext  = session text containing ClueVector_prose
               -- recall establishes IDENTITY (this WAS discussed/decided), not current-reality FIDELITY (it still HOLDS). Store-currency (the INDEX entry is fresh) ⊂ fidelity-to-current-reality: a recalled decision may be superseded, a recalled path renamed, a recalled convention revised. RecalledContext describes a PAST state; downstream consumers re-verify against current state before commit rather than treating it as confirmed current context.
NullMatch        = predicate; canonical definition in ── CONVERGENCE ──
AttemptsExhausted = predicate; canonical definition in ── CONVERGENCE ──   -- the recognizables-present terminal, distinct from NullMatch's zero-result one
Phase            ∈ {0, 1, 2, 3}
max              = the recall-try cap LOOP fixes   -- a bound on user attention, not a sufficiency criterion

── V-BINDING ──
bind(V) = explicit_arg ∪ colocated_expr ∪ prev_user_turn   -- priority: explicit_arg > colocated_expr > prev_user_turn

/recollect "text"           → V.trace = extract_trace("text", Σ)
"recall... topic"           → V.trace = extract_trace(text before trigger, Σ)
/recollect (alone)          → V.trace = extract_trace(previous user message, Σ)

Edge cases:
- Multiple vague references: bind to first, note others; re-invoke after NullMatch: fresh V, no carryover
- Composition (/recollect * /inquire): V from Anamnesis, Aitesis receives ClueVector_prose via session text

── PHASE TRANSITIONS ──
Phase 0: V → Detect(V) → empty_intention(V)?                    -- trigger (silent)
           [¬empty_intention(V)] relay(finding) → proceed       -- zero-signal: present activation finding, proceed without activation
           → Classify(V, Σ) → InputType, Unit → Track → set(scan_scope = spine, attempts = 0)   -- dispatch + granularity + initial scope + recall-try budget (silent)
Phase 1: V → Scan_{Track,Unit}(INDEX ⊕ SSOT_spine ⊕ (scan_scope = full_text ? SSOT_body : ∅), V) → set(traversal_scope = the sub-graph Traverse returned, ∅ at session scope) → Rank(O[], trace(V)) → O[ranked]  -- index + spine always; bodies too once ExpandFullText widened the scope, so a Refine/Reorient re-entry does not silently narrow back to spine and report a body-scoped miss; above session scope the scan joins its candidates into recognizables by read-time inferred edges (── SCAN ABOVE SESSION SCOPE ──) [Tool]
           backtrace_parent(c) ∀ c ∈ members(O[ranked]) : fork_marker(c) → parent_pointer, parent_cwd  -- fork (SidechainNoSSOT): parent recovered deterministically from the member's own record [Tool]
           |O[ranked]| > 0 → O[top] := Confirm(O[top]) → Phase 2   -- each claim O[top]'s narrative asserts as fact, read against the member record it originates from, before any Phase 2 output; the assignment rewrites the head of O[ranked], so the SingleObvious guard at Phase 2 reads the confirmed object rather than the ranked one — a capped confidence is what keeps an unread claim off the relay; no claim at session scope, so no read [Tool]
           |O[ranked]| = 0 ∧ attempts = 0 → Probe(V, Σ) → Qs → Stop → H → enrich(V, H) → set(attempts = attempts + 1) → Phase 1   -- Socratic probe gate [Tool]
           |O[ranked]| = 0 ∧ attempts > 0 ∧ fulltext_unscanned → Qx(StoreExpansion) → Stop → X   -- store-expansion checkpoint [Tool]
             ExpandFullText → set(scan_scope = full_text) → Scan_{Track,Unit}(SSOT_body, V) → set(traversal_scope) → Rank(O[], trace(V)) → O[ranked]
             StopAtSpine → NullMatch → inform → deactivate
           |O[ranked]| = 0 ∧ attempts > 0 ∧ fulltext_scanned → NullMatch → inform → deactivate
Phase 2: SingleObvious(O[ranked]) → emit(ClueVector_prose(O[top]) ⊕ divergence_affordance) → recall_complete → converge   -- Extension: high-confidence single recognizable, no turn yield, no [Tool] Stop; silence = Recognize
         ¬SingleObvious(O[ranked]) → O[top] → Qc(O[top], evidence, framing) → Stop → R    -- recognition gate [Tool]; the evidence is ClueVector_prose's content — each member's locator and handle, each claim's verdict, and above session scope the edges and Λ.traversal_scope the scan wrote
Phase 3: R → integrate(R, V, Σ) →                                -- integration (track: Λ.history ⊕ (O[top], R)); after a SingleObvious emit, a next-turn divergence reaches these paths through fresh re-activation (Layer 1/2), not a transition from the converged state
           Recognize(o) → ClueVector_prose(o) → emit → converge
           (Refine ∨ Reorient(d)) ∧ attempts = max → surface(O[top]) → deactivate   -- AttemptsExhausted (CONVERGENCE): budget spent with recognizables in hand, no further Phase 1 re-entry
           Refine ∧ attempts < max → Probe(V, Σ) → Qs(probe) → Stop → H          -- Socratic probing [Tool]
                  → enrich(V, H) → set(attempts = attempts + 1) → Phase 1
           Reorient(d) ∧ attempts < max → rebind(V, d, Σ) → set(attempts = attempts + 1) → Phase 1               -- orthogonal re-scan (sense); re-classifies V.unit when d names a different whole

── LOOP ──
Phase 1 → Phase 2 → Phase 3 →                              -- Phase 2 SingleObvious shortcut: emit ⊕ divergence affordance → converge (Extension, skips the Phase 3 gate; convergence is notional, so a next-turn divergence re-engages via fresh re-activation → Refine/Reorient)
  Recognize: converge
  Refine: Socratic probing → enrich → Phase 1   -- a granularity answer rebinds V.unit; above session scope the adjacent directions are boundary and traversal scope
  Reorient: rebind V with orthogonal description → Phase 1   -- a different recall dimension, or a different whole (V.unit)

Phase 1 spine-scope miss after probing → StoreExpansion:
  ExpandFullText: set scan_scope = full_text → scan runtime SSOT bodies → Phase 1 ranking
  StopAtSpine: NullMatch → deactivate

Max 3 recall attempts; `attempts` starts at 0 in Phase 0 and each Refine enrichment or Reorient rebind spends one; the scan's own result, at any scope, spends nothing. Exhausted with recognizables in hand: AttemptsExhausted — surface O[top] → deactivate. A zero-result exhaustion terminates as NullMatch instead (both in CONVERGENCE).
Convergence evidence: (VagueRecall → [enrichments] → Recognizable(recognized) → ClueVector_prose).

── CONVERGENCE ──
recall_complete = Recognize(o) for some o ∈ O[]                                        -- gated path (¬SingleObvious)
               ∨ SingleObvious(O[]) ∧ emitted(ClueVector_prose(O[top]) ⊕ divergence_affordance)   -- Extension path: the inline emit converges immediately (no turn yield); non-divergence (silence) realizes user-constituted recognition. Convergence is notional — a later divergence re-engages via fresh re-activation (Layer 1/2), not a transition out of the converged state
NullMatch = |O[]| = 0 ∧ attempts > 0 ∧ (fulltext_scanned ∨ X = StopAtSpine)   -- zero-result terminal, matching the FLOW/PHASE TRANSITIONS/LOOP branches: one probe cycle must have run, and the scope must be either exhausted or closed by the user's StopAtSpine election. StopAtSpine is terminal on its own — gating it on a budget would make the equation refuse a stop the checkpoint already offered. Above session scope a zero result may leave candidates in hand that no recognizable joined; the inform then reports Λ.traversal_scope beside the coverage searched
AttemptsExhausted = |O[]| > 0 ∧ attempts = max ∧ R ∈ {Refine, Reorient(d)}      -- recognizables-present terminal: surface O[top] → deactivate, never NullMatch. The answer is part of the predicate, matching the branch guard in FLOW and PHASE TRANSITIONS — without it the predicate would already hold the moment a final re-scan returns recognizables, terminating before Phase 2 offers the recognition the budget was spent to reach
progress(Σ) = attempts: N/max, enrichments: N, presented: N

── TOOL GROUNDING ──
-- Realization bindings (Claude Code and Codex substrates), non-normative w.r.t. protocol essence — see ── SUBSTRATE AGNOSTICISM ──; any substrate satisfying morphism laws realizes Anamnesis.
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
-- Before Phase 1, read references/claude.md and references/codex.md for every runtime that has a store at all — a runtime whose compact INDEX is absent still carries raw records, so its reference binds. Those references bind each harness's INDEX, SSOT spine and body, candidate fields, and resume command. Search the available compact INDEX surfaces and raw-record spines in parallel across runtimes, and preserve Candidate.runtime through ranking and presentation.
-- The initial scan reads the compact INDEX and the raw-record spines together, unconditionally. A spine read is bounded per record, so it is not the cost the checkpoint exists to protect the user from; gating it would buy nothing and add a branch. Transcript bodies stay out — their per-record cost has no upper bound. After probe enrichment still yields no candidate, Qx presents the full-text expansion and the spine-scoped stop as differential futures. ExpandFullText admits the SSOT_body paths declared by the runtime references; StopAtSpine terminates without opening them.
-- Scanning spines unconditionally is also what keeps a runtime reachable before its INDEX exists: a store whose writer has not yet produced entries is not blind, it is spine-only. Without this the first recall against a newly-added runtime would always miss and always require the checkpoint.
-- Fork/sidechain binding exists in the Claude realization only. For a Claude fork candidate, references/claude.md routes to references/fork-resume.md before presentation.
-- When V.unit is above session, Scan_{Track,Unit} joins the candidates Scan_{Track} returns into recognizables by read-time inferred edges — see ── SCAN ABOVE SESSION SCOPE ── and read references/supra-session.md before scanning at that scope. Nothing else changes: the gate, its answers, the recall-try budget, and both terminals are those typed above.
Phase 0 Detect      (sense)    → Internal analysis
Phase 0 relay_not_empty (extension) → TextPresent+Proceed (¬empty_intention(V): present finding, proceed without activation)
Phase 0 Classify    (sense)    → Internal analysis (InputType and Unit detection from V + Σ)
Phase 1 Scan_entropy  (observe)  → artifact read, artifact search, environment run (literal match over the available compact INDEX surfaces and raw-record spines; SSOT_body only after ExpandFullText. environment run is admitted for the spine read alone — a bounded head read repeated across the whole store, issued as the one command each runtime reference declares, because per-record artifact read calls do not compose at store scale; it opens no transcript body and writes nothing)
Phase 1 Scan_salience (observe)  → artifact read, artifact search, environment run (MarkerProfile match over the available compact INDEX surfaces and raw-record spines; SSOT_body only after ExpandFullText; environment run bounded as above)
Phase 1 Scan_hybrid   (observe)  → union of above
Phase 1 Traverse    (observe)  → artifact read, artifact search (above session scope only: read the entry candidates' cross_refs, keywords, topic, cwd, and the recency the spine read declares, then search across partitions for records sharing them; edges are inferred at read time and never written; read-only — per references/supra-session.md). Its scan step then writes `set(traversal_scope = …)`: the sub-graph returned with each skipped broken-link edge noted, held in Λ because Qc's evidence and the NullMatch diagnosis read it after a turn yield
Phase 1 Assemble    (sense)    → Internal analysis (above session scope only: join the traversed sub-graph into recognizables in V.unit's shape, each claim the narrative will assert written unattested)
Phase 1 Rank        (sense)    → Internal analysis (conditional: lightweight-model scoring for large candidate sets; assigns each recognizable's confidence)
Phase 1 backtrace_parent (observe) → artifact read (fork member only: read the orchestrating parent's session_id directly from the fork's substitute capture, then check parent SSOT existence for resumability; deterministic and citable to the capture entry — hence (observe); read-only)
Phase 1 Confirm     (observe)  → artifact read (before any Phase 2 output: for each claim O[top]'s narrative asserts as fact, open the member record it originates from at the path its runtime reference declares and write the verdict on the claim. |claims(O[top])| reads — bounded by what will be rendered, never by the traversed sub-graph, so it is not the store-wide body scan Qx governs. No claim at session scope, so no read; a member with no record locator leaves its claims unattested; read-only)
Phase 1 Qx          (constitution) → present (ExpandFullText: read the labeled Claude/Codex transcript bodies, at a per-record cost with no upper bound; StopAtSpine: return a NullMatch scoped to the indexes and spines already searched, without opening any transcript body)
Phase 2 Qc          (constitution)     → present (narrative Socratic recognizable, each claim per its verdict; gated path — ¬SingleObvious: recognizables ≥ 2 OR confidence < high)
Phase 2 emit        (extension)    → TextPresent+Proceed (SingleObvious path only: high-confidence single recognizable emitted inline with a divergence-only affordance, no turn yield, converge immediately). Relay basis: one dominant candidate collapses the recognition option set to a single option (Refine/Reorient are foils), so the option set is relay rather than a gate; this conditional Constitution→Extension specialization within Phase 2 is the sanctioned revision of `Conditional Qc; separate Qs and Qc`'s Safeguard-tier mandatory-Qc tag, motivated by observed binary-confirm abandonment friction. It is the relay-collapse kind of (extension), NOT a Standing-authority migration.
Phase 3 integrate   (track)    → Internal state update
Phase 1/3 Probe     (sense)    → Internal (gap detection)
Phase 1/3 Qs        (constitution)     → present (Socratic probing with structured navigation over the dimensions temporal, associative, contextual, granularity; one realization reached from two branches — the Phase 1 zero-result probe and the Phase 3 Refine probe run the same `Probe → Qs → Stop → H → enrich` sequence; mandatory on Refine)
Phase 3 surface     (extension)    → TextPresent+Proceed (AttemptsExhausted: ClueVector_prose(O[top]), then deactivate)
Phase 3 emit        (extension)    → TextPresent+Proceed (ClueVector_prose)
converge            (extension)    → TextPresent+Proceed (convergence trace)
seam                (extension)    → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares — the `/recollect ∘ /inquire` COMPOSITION edge — settles the next move; proceed directly to it, citing that settling source; every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, V: VagueRecall,
      recognizables: List(Recognizable), presented: Set(Recognizable),   -- O[ranked], and the ever-presented set cross-cycle rendering distinguishes against
      history: List<(Recognizable, R)>,   -- history appended at Phase 3 integration: Log (O[top], R) to history
      attempts: Nat, scan_scope: ScanScope,
      traversal_scope: TraversalScope,    -- written by the Phase 1 scan step; ∅ at session scope. Alongside scan_scope because both carry the coverage actually searched past the turn yields its readers sit behind
      active: Bool, cause_tag: String }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
*: /recollect ∘ /inquire — RecalledContext → ClueVector_prose seeds Aitesis as input substrate; on NullMatch, the accumulated recall trace seeds Aitesis to search SSOT directly (INDEX may lack entries while SSOT retains the information).

── ENTROPY EXTRACTION ──
extract : Session → Set(IdentifierTuple)                                   -- laws, precision threshold, compatible_anchor, extractor registry: read references/entropy-track.md
dispatch binding: InputType = StructuredIdentifier → Track = entropy
-- Before running scan_entropy, read references/entropy-track.md: it types extract's laws, the
-- precision threshold, and the compatible_anchor authorization that decides whether a literal
-- match may anchor ranking at all. Anchoring a literal without that predicate is unbounded.

── SALIENCE MARKERS ──
detect : Session × DateAnchor? → MarkerProfile     -- categories, semantic invariants, coinage formula: read references/salience-track.md
categories: { coinage, actor, temporal, emotional, cognitive, singularity }   -- working hypothesis (Emergent admitted)
dispatch binding: InputType = NaturalRecall → Track = salience
                  InputType = Mixed → Track = hybrid    -- union scan: entropy ∪ salience
-- Before running scan_salience, read references/salience-track.md: it bounds what detect may
-- return (the semantic invariants) and supplies the coinage formula that decides which tokens
-- count as salient. On Track = hybrid, read references/entropy-track.md as well — the union scan
-- runs both, so both track contracts bind.

── SCAN ABOVE SESSION SCOPE ──
Scan_{Track,Unit} : (Store, V) → List(Recognizable)     -- the one scan at every granularity; Scan_{Track} in ── STORE TOPOLOGY ── is its candidate step
  V.unit = session : each c ∈ Scan_{Track}(Store, trace(V)) ↦ { unit: session, members: [c], narrative: c.fingerprint, confidence: c.confidence, claims: ∅ }   -- the candidates as scanned
  V.unit ≠ session : Assemble_{V.unit}(Traverse(C, infer_edges(C, Σ))) where C = Scan_{Track}(Store, trace(V))   -- the same candidate step, then the recognizables its candidates join into: shapes, edge inference, traversal, assembly, the connectivity term Rank adds, and the four graph invariants are typed in references/supra-session.md, which also states what the scan writes to Λ.traversal_scope at this scope (the type is TraversalScope above)
binding: the gate, its answers, the recall-try budget, and both terminals are those typed above; this block adds none. A zero result at this scope — candidates found, no recognizable joined them — is |O[]| = 0 as for any scan: the probe asks granularity and boundary before any NullMatch, and the NullMatch diagnosis reports Λ.traversal_scope
-- Before scanning above session scope, read references/supra-session.md: it types the three
-- shapes over Candidate (no second element type), the edges inferred at read time from stored
-- anchors and metadata, Traverse and Assemble, the connectivity term Rank adds, what the scan
-- writes to Λ.traversal_scope,
-- and the four graph invariants (no-central-aggregator, edge-based, isolation-preserving,
-- broken-link-tolerant).

── STORE TOPOLOGY ──
Store = SSOT ⊕ INDEX ; memory/ = realization-layer adjunct (non-scanned, user-curated)
  SSOT             = authoritative session record (complete, append-only); read at either of two depths
  SSOT_spine       = per-record head metadata: recency, cwd, session id, origin label, first human turn, and whatever handle the realization needs to reopen the record -- bounded read per record, so it joins the initial scan unconditionally
  SSOT_body        = the record's full text -- read cost per record has no upper bound, so it is admitted only at ExpandFullText
  INDEX_semantic   = per-session semantic extraction (IdentifierTuples, MarkerProfile?, Coinage, narrative) -- derived from SSOT, rebuildable, lossy; MarkerProfile? is conditional on successful semantic extraction + validation; artifacts carry evidence-mode metadata derived by construction — legacy entries lack it (Candidate.evidence_mode = Null, neutral)
  INDEX_substitute = substitute channel raw message log -- append-only, primary capture, authoritative (loss non-recoverable)

Scan_{Track} : (Store, RecallTrace) → List(Candidate)
  scan_entropy(Store, trace)    = exact-match over IdentifierTuples where compatible_anchor(t, trace) (SSOT ∪ INDEX_semantic)
                                  ∪ literal-id match over INDEX_substitute origin ids (a sidechain/derived id carries no IdentifierTuple, so a structured id is matched against the substitute channel directly; a hit whose id has no sibling top-level SSOT is the SidechainNoSSOT precondition)
                                -- structural rejection (compatible_anchor filters ALL literal matches, distinct from low-precision miss): incompatible literals do NOT anchor but are retained in the recall trace as evidence; the scan routes to the salience track (hybrid) or NullMatch₁ recovery with the incompatibility noted — never a silent zero-candidate return
  scan_salience(Store, trace)   = MarkerProfile match (ranked by Σ)        -- INDEX ⊕ SSOT_spine first; SSOT_body after ExpandFullText
  scan_hybrid(Store, trace)     = scan_entropy ∪ scan_salience
  evidence_mode(c) = highest tier over matched signals' frontmatter evidence_mode(s); frontmatter absent ⇒ Null (legacy entry, neutral — partial-INDEX normal mode, no fallback trigger)

initial_scan: Scan_{Track}(INDEX ⊕ SSOT_spine, trace) across every available realization; preserve Source on every candidate
fulltext_expansion: X = ExpandFullText ⟹ Scan_{Track}(SSOT_body, trace) across the Source set named at Qx
degraded_scan: INDEX_semantic = ∅ ⟹ mark that INDEX realization unavailable and continue on that realization's SSOT_spine; SSOT_body remains outside scope until ExpandFullText
  -- an absent semantic INDEX no longer blinds its realization: the spine tier carries recency, cwd, origin, and first human turn, so the realization still contributes ranked candidates. This is what an INDEX-less runtime looks like in normal operation, not a failure to route around
  -- partial INDEX (e.g., MarkerProfile? = ∅ while IdentifierTuples / Coinage / narrative present) is a normal mode and does NOT trigger total fallback; scan_salience returns empty for the missing component and ranking degrades gracefully
  -- when a degraded realization's spine scan also yields nothing and Qx is reached, read references/failure-modes.md §Degraded scan before presenting the scope choice: it states why the substitute channel remains available (so SidechainNoSSOT stays reachable) and which loss is non-recoverable

── SUBSTRATE AGNOSTICISM ──
The protocol essence (form) consists of FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, and the
formal blocks ENTROPY EXTRACTION / SALIENCE MARKERS / SCAN ABOVE SESSION SCOPE / STORE TOPOLOGY / KNOWN FAILURE MODES.
The essence makes no reference to specific tools, agents, platforms, schedulers, or storage
media. Any realization (matter) satisfying the entropy extraction laws, salience semantic
invariants, and store topology realizes Anamnesis.

form ⊥ matter:
  form   = ⟨FLOW, MORPHISM, TYPES, laws of extract/scan, invariants of detect⟩   -- protocol definition
  matter = ⟨tool names, file paths, language, scheduler, storage backend⟩         -- realization

TOOL GROUNDING below specifies Claude Code and Codex realizations; each is
non-normative with respect to the protocol's epistemic content.

Referent: Semantic autonomy at the realization boundary. This section locally inscribes the
realization boundary for user-visible clarity; the local inscription is intentional —
externalizing the realization-boundary explanation would split the user-visible contract
from its semantic grounding, breaking the hermeneutic circle that local inscription preserves.

── KNOWN FAILURE MODES ──
-- The taxonomy (names + triggering predicate) is here so a mode is recognizable without a read.
-- Once a mode is suspected, read references/failure-modes.md before acting: it carries each mode's
-- cause, detection, and recovery, and the recovery is what the protocol executes. Emergent admitted
-- — the named modes are working hypotheses, not an exhaustive partition.
FalseAnchor       : extract(s) contains t with high precision but t ≠ recall_target
ExtractorLacking  : recall_target ∈ s ∧ ∄ extractor_i : recall_target ∈ extractor_i(s)
PartialExtract    : extract/detect produces well-formed but semantically partial INDEX from corrupted/truncated source
SidechainNoSSOT   : scan_entropy(Store, trace) ≠ ∅ via INDEX_substitute ∧ no top-level SSOT for the recalled id (the id is a sidechain/derived record)
                    -- distinct from NullMatch₁: here the scan SUCCEEDS on the substitute channel, only the top-level SSOT is absent by design
NullMatch₁        : scan_entropy(Store, trace) = ∅ ∧ InputType = StructuredIdentifier
NullMatch₂        : scan_salience(Store, trace) = ∅ ∧ InputType = NaturalRecall
MutualNull        : scan_entropy = ∅ ∧ scan_salience = ∅ on Track = hybrid
                    -- structural risk: recall target genuinely absent from Store (principal failure mode)
                    -- the modes of the scan above session scope (sparse edges, broken links, a misjudged whole, index taken as evidence) are typed in references/supra-session.md, loaded at that scope
```

## Mode Activation

`/recollect` remains directly invocable. During AI-guided activation, loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind. When a direct invocation supplies no recoverable target in current or recent context, ask for the recall target before Phase 0.

### Activation heuristics and exceptions

Treat vague temporal references, existence claims without a locator, uncertain self-reference, failed recall, and visible recall effort as evidence of empty intention rather than hard gates. A recall that names a whole line of work, topic, or settled concept across sessions is empty intention at a higher granularity, not a different deficit. Prior recall indices may seed the scan but never constitute recognition.

Skip AI-guided activation when the user gives an exact reference, the same target is already resolved in this session, the request seeks new information, the user declines recall assistance, or Phase 0 identifies a different handling need.

## Protocol

### Reference loading

Before scanning a runtime store, read its realization reference (`references/claude.md` or `references/codex.md`). Before an entropy, salience, or hybrid scan, read the corresponding track reference; read both for hybrid. When a known failure mode is suspected, read `references/failure-modes.md` before acting on it. When the unit the user means stands above one session — a line of work, a topic, or a settled concept spread across several — read `references/supra-session.md` before scanning at that scope.

### User-facing realization

Render a recognizable as the story of the discussion, not a result-only hit:

- locate it in time and source, preserving the realization label;
- state the origin, direction, and outcome — above one session, in the unit's shape;
- identify each session and emit only the resume handle the realization reference validates;
- name adjacent topics that make Refine recognizable;
- on gated presentations and Refine probes, state the remaining recall-try budget and candidate space in ordinary prose.

Emit `ClueVector_prose` with the source, narrative, cross-references, and validated resume handle; above one session, each member's own source and handle, and each claim the narrative asserts as fact rendered per its verdict. State that recognition establishes historical identity rather than current truth. When `source_scan` reports incomplete source coverage, name the non-zero counts so downstream readers can weigh the record accordingly.

On Refine, present concrete adjacent directions with brief narratives. Keep the narrative form and prior adjacent vectors across later cycles, explaining how each new candidate differs from those already rejected.

On NullMatch, report the source-labeled depth actually searched for each realization; above one session, the traversal scope the scan recorded in `Λ.traversal_scope` as well. Name actionable causes supported by the observed failure mode. Preserve a `StopAtSpine` boundary as an index-and-spine-scoped miss; after an accepted full-text miss, offer the declared Aitesis handoff with the accumulated trace.

### Intensity

| Level | When | Format |
|-------|------|--------|
| Light | One high-confidence recognizable | Inline narrative, validated resume handle, fidelity caveat, and divergence affordance |
| Medium | Several plausible recognizables | Full narrative with adjacent directions |
| Heavy | High ambiguity or repeated refinement | Narrative, store orientation, and structured Socratic navigation |

## Rules

- **Narrative recognition**: Present candidates as discussion narratives whose origin, direction, and outcome make identity recognizable.
- **Guided recall orientation**: Refine offers structured adjacent directions with brief narratives, preserving user recognition rather than shifting reconstruction back to the user.
- **Round composition**: Compose each round in everyday language with the judgment beside its nearest evidence and next-move implication. Put analytical context before the gate. Read `references/round-composition.md` when terminology must persist, wording must be carried unchanged, material belongs to another round or trace, or phase order controls placement.
- **Cross-cycle rendering**: Preserve narrative form and adjacent-vector context across recall attempts; distinguish a new candidate from prior candidates.
- **Granularity is a dimension of the recall**: The unit the user means — one session, or the line of work, topic, or settled concept above it — is classified with the input type and rebound by a granularity answer or Reorient, never guessed from the scan. Above one session the scan joins candidates into recognizables by read-time inferred edges as typed in `references/supra-session.md`, and each is recognized through the same gate, answers, and budget as one session. A claim the narrative asserts as fact carries its `Confirm` verdict, and each member carries its own source locator and resume handle.
- **NullMatch diagnosis**: Report only the source-labeled coverage actually searched and the failure causes its evidence supports.
- **Conditional Qc; separate Qs and Qc** *(Safeguard tier — revisitable as instruction-following improves)*: Qc remains mandatory outside `SingleObvious`; that relay specialization is the sanctioned exception. Qs remains a separate mandatory Constitution interaction on Refine.
- **Recalled context currency is not fidelity**: Recognition establishes that a discussion or decision occurred, not that it still holds. Emit that caveat, require current-state re-verification before commitment, and disclose every non-zero `source_scan` count without changing ranking.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
