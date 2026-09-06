---
name: recollect
description: "Resolve vague recall into recognized context through AI-guided contextual scan and user-validated recognition — one session, or the line of work, topic, or settled concept spread across several."
---

# Anamnesis Protocol

Resolve vague recall into recognized context through AI-guided contextual scan and user-validated recognition. Type: `(RecallAmbiguous, AI, RECOGNIZE, VagueRecall) → RecalledContext`.

## Definition

**Anamnesis** (ἀνάμνησις): A dialogical act of resolving vague recall into recognized context. The user holds an empty intention toward a past discussion they cannot name; AI reads the cue out of the utterance and the accumulated context, finds the candidates the hypomnesis INDEX and the record spines suggest (`memory/` is a non-scanned, user-curated realization-layer adjunct — see STORE TOPOLOGY), opens each member's own record for the excerpt the cue reaches, and presents that excerpt with its source so the user can identify it. The INDEX narrative is a cue that wakes recall; the excerpt and its locator are the evidence; the act that makes a RecalledContext is the user's identification. Recognition over retrieval, grounded in the source rather than in the index.

```
── FLOW ──
Anamnesis(V) → Detect(V) →
  not-empty_intention(V): relay(finding) → proceed (no activation)
  empty_intention(V): Cue(V, Σ) → V.trace, V.unit → set(scan_scope = spine, attempts = 0) →
    Find(Store ⊕ (scan_scope = full_text ? SSOT_body : ∅), V) → O[ranked] →
    |O[]| = 0 ∧ attempts = 0: Ask(V) → Stop → H → recue(V, H) → set(attempts = attempts + 1) → Find
    |O[]| = 0 ∧ attempts > 0 ∧ fulltext_unscanned: Qx(StoreExpansion) → Stop → X →
      ExpandFullText: set(scan_scope = full_text) → Find
      StopAtSpine: NullMatch → inform(V, Σ) → deactivate
    |O[]| = 0 ∧ attempts > 0 ∧ fulltext_scanned: NullMatch → inform(V, Σ) → deactivate
    |O[]| > 0: O[top] := Ground(O[top]) →
      ¬grounded(O[top]): O[] := O[] \ {O[top]} → Ground the new head, or fall to the |O[]| = 0 branches above when none is left   -- no member's record opened: nothing to present from
      grounded(O[top]): set(presented = O[top]) → Present(Λ.presented) → Stop → U →
      Identified: emit(RecalledContext(Λ.presented)) → converge
      Corrected(c) ∧ attempts < max: recue(V, c) → set(attempts = attempts + 1) → Find
      Corrected(c) ∧ attempts = max: surface(Λ.presented) → deactivate   -- AttemptsExhausted: the closest grounded candidate, no identification claimed
      Withdrawn: deactivate                                         -- the user moved on; no terminal claimed

── MORPHISM ──
VagueRecall
  → detect(empty_intention)              -- recognize vague recall state
  → cue(trace, unit)                     -- what is meant, and at which whole: one session, or the line, topic, or concept above it
  → find(Store, cue)                     -- INDEX gist and record spines as cues (see STORE TOPOLOGY); above session scope the candidates are joined by read-time inferred edges (── FIND ABOVE SESSION SCOPE ──)
  → ask(user)?                           -- one open question when the first find returns nothing; a zero result expands or terminates only after at least one user round-trip — that question's answer or a correction, either of which is new cue information
  → expand(SSOT_body, user)?             -- only after a round-trip and a spine-scope miss, at the user's election
  → ground(recognizable)                 -- open each member's own record: the excerpt the cue reaches, its locator, its handle; the narrative is composed from the excerpts
  → present(recognizable)                -- one shape at every scope; the turn yields
  → identify(recognizable, user)         -- synthesis of identification (Husserl CM §18) fulfilling the empty horizon (CM §19): the user's observable act, never inferred from silence
  → emit(RecalledContext)                -- the identified recognizable with its excerpts and locators, as session text
  → RecalledContext
requires: empty_intention(V)              -- phenomenological trigger
deficit:  RecallAmbiguous                 -- activation precondition (Layer 1/2)
preserves: Store                          -- SSOT ⊕ INDEX are read-only; V is recued during the protocol
invariant: Recognition over Retrieval

── TYPES ──
V                = VagueRecall { trace: RecallTrace, unit: Unit, cues: List(Cue) }   -- the cue: what the user gave, at the whole they mean; cues accumulate what each answer and correction added
RecallTrace      = { keywords: Set(String), temporal: Optional(String),
                     associations: Set(String), identifiers: Set(IdentifierTuple) }
Cue              = String   -- what the user adds: the answer to the open question, or a correction; recue folds it into the trace
Unit             ∈ {session, line, topic, concept}   -- the whole the intention names, read from V + Σ at Phase 0 and re-read by recue when a cue names a different whole. Closed on a stated premise: the three values above session are the three ways candidates join — succession, shared topic, a settled concept — and a recall matching none of them is at session scope
InputType        ∈ {StructuredIdentifier, NaturalRecall, Mixed}      -- Find's own dispatch, read from V + Σ; not a phase
Track            ∈ {entropy, salience, hybrid}                       -- dispatched from InputType inside Find (dispatch bindings in ── ENTROPY EXTRACTION ── and ── SALIENCE MARKERS ──)
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
                     record: Optional(Source),                    -- the path to THIS candidate's own record, as the spine read declared it (── STORE TOPOLOGY ──: SSOT_spine yields "whatever handle the realization needs to reopen the record"). Ground opens this and never a path re-resolved at grounding time: the spine scan is not partition-scoped, so the active session's partition does not locate a candidate found in another one. Null ⇒ no record can be opened for this member — Ground yields an empty excerpt and the prose says so
                     recency: Optional(DateAnchor),               -- the record's own last-activity time, as the spine read declares it (Claude: the file's modification time; Codex: the rollout's session_meta timestamp). Where the record is gone but its INDEX entry survives, the entry's own timestamp supplies it; Null only where neither has one — NEUTRAL in ranking exactly as evidence_mode and source_scan are, never a penalty. Optional because a candidate whose record no longer exists must still be constructible: it is precisely the candidate the Ungroundable path exists to receive, and a mandatory field sourced from the missing record would make that path unreachable. Read by Rank for ordering, and above session scope by edge inference — which is what makes references/supra-session.md's "reads only these fields" true of a field Candidate actually has
                     cwd: Optional(String),
                     topic: String,
                     keywords: Set(String),
                     fingerprint: Prose,                          -- the INDEX gist: a cue, never evidence
                     cross_refs: List(Anchor),
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
Recognizable     = { unit: Unit, members: NonEmpty(Candidate), narrative: Prose, excerpts: List(Excerpt), assembly: Optional(Assembly) }
                  -- the one object at every scope; unit = session ⟺ |members| = 1. As Find returns it, narrative is the members' index gist and excerpts = ∅ — enough to order, never to assert. After Ground, excerpts holds one entry per member and narrative is composed FROM them, in the unit's shape (one session: origin → direction → outcome; a line: origin → development → arrival; a topic: fragments → standing; a concept: forged by → settled at); nothing the excerpts do not carry is asserted
Assembly         = { joined: the inferred edges that joined this recognizable's members, skipped: the links that resolved to no written record }   -- references/supra-session.md TYPES: Edge. Null at unit = session, where one member joins nothing. Carried on the object rather than in Λ so that surface(Λ.presented) at AttemptsExhausted still has the coverage after the yield — the recognizable is already the thing that crosses it
Excerpt          = { member: Candidate, text: Prose, locator: Source, handle: Optional(ResumeHandle) }   -- the record's own words at the span the cue reaches, where that record is, and the resume command the runtime reference validates (Null ⇒ non-resumable, stated in the prose). A member whose record cannot be opened yields text = ∅ and contributes nothing the narrative may assert
ResumeHandle     = String   -- the literal command the runtime reference emits (references/claude.md, references/codex.md; fork members per references/fork-resume.md)
O[]              = List(Recognizable)   -- Find's ranked result at V.unit; O[top] is its head
Find             = (Store, V) → List(Recognizable)   -- Scan_{Track} over the compact INDEX and the record spines (── STORE TOPOLOGY ──), joined above session scope (── FIND ABOVE SESSION SCOPE ──), ordered by Rank
Rank             = (List(Recognizable), RecallTrace) → List(Recognizable)   -- ordering only, computed from how well each recognizable matches the cue — no stored tier is read, because no writer publishes one: track-primary signal dominates, evidence_mode is a secondary tie-break (never a filter; Null neutral), edge connectivity joins it above session scope. No gate reads the order; it decides only which recognizable Ground opens first
Ground           = Recognizable → Recognizable   -- one read per member of O[top]: open the member's own record at member.record, resolved by its runtime reference, take the excerpt the cue reaches, bind its locator and handle (a fork member per references/fork-resume.md), then compose the narrative from the excerpts. Bounded by |members(O[top])|, never by the store — it opens named records, it does not scan bodies. Idempotent: a member already read is not re-read
grounded         = predicate; grounded(o) ≡ ∃ e ∈ o.excerpts : e.text ≠ ∅   -- at least one member's record opened. A recognizable no member's record could be opened for carries no evidence at all, and since the narrative is composed FROM the excerpts there is nothing it may assert — so it is never presented
Ask              = V → Question   -- one open question when Find returns nothing: what else the user remembers, in their own words; no dimension taxonomy, no candidate to regenerate
Question         = String
H                = Cue      -- the answer to the open question
U                = Response ∈ {Identified, Corrected(Cue), Withdrawn}   -- read from the user's next utterance after Present: Identified when they say so or proceed on that context; Corrected when the utterance turns the cue — "not that one", an earlier one, the whole line — and the utterance IS the cue; Withdrawn when it leaves the recall behind. Premise: one utterance carries one disposition, and silence is none of them — a turn that has not come back has decided nothing
X                = StoreExpansion ∈ {ExpandFullText, StopAtSpine}
ScanScope        ∈ {spine, full_text}   -- spine = INDEX ⊕ SSOT_spine (the initial scope); full_text additionally admits SSOT_body
fulltext_unscanned ≡ Λ.scan_scope = spine
fulltext_scanned   ≡ Λ.scan_scope = full_text
recue            = (V, Cue) → V   -- folds the cue into V.trace and V.cues; a cue naming a different whole re-reads V.unit
emitted(x)       = predicate; the emit(x) has fired in session text
RecalledContext  = session text carrying the identified Recognizable: its narrative, each member's excerpt with locator and handle, and the currency caveat below
               -- recall establishes IDENTITY (this WAS discussed/decided), not current-reality FIDELITY (it still HOLDS). Store-currency (the INDEX entry is fresh) ⊂ fidelity-to-current-reality: a recalled decision may be superseded, a recalled path renamed, a recalled convention revised. RecalledContext describes a PAST state; downstream consumers re-verify against current state before commit rather than treating it as confirmed current context.
find_empty       = predicate; find_empty ≡ |O[ranked]| = 0 at the Phase 1 branch point   -- the guard that reaches Ask, Qx, and NullMatch; a predicate over it is evaluated where the guard holds, in the same pass as the empty Find, never reconstructed after a yield
NullMatch        = predicate; canonical definition in ── CONVERGENCE ──
AttemptsExhausted = predicate; canonical definition in ── CONVERGENCE ──   -- the candidate-in-hand terminal, distinct from NullMatch's nothing-found one
Phase            ∈ {0, 1, 2, 3}
max              = the recall-try cap LOOP fixes   -- a bound on user attention, not a sufficiency criterion

── V-BINDING ──
bind(V) = explicit_arg ∪ colocated_expr ∪ prev_user_turn   -- priority: explicit_arg > colocated_expr > prev_user_turn

/recollect "text"           → V.trace = extract_trace("text", Σ)
"recall... topic"           → V.trace = extract_trace(text before trigger, Σ)
/recollect (alone)          → V.trace = extract_trace(previous user message, Σ)

Edge cases:
- Multiple vague references: bind to first, note others; re-invoke after NullMatch: fresh V, no carryover
- Composition (/recollect * /inquire): V from Anamnesis, Aitesis receives RecalledContext via session text

── PHASE TRANSITIONS ──
Phase 0: V → Detect(V) → empty_intention(V)?                    -- trigger (silent)
           [¬empty_intention(V)] relay(finding) → proceed       -- zero-signal: present activation finding, proceed without activation
           → Cue(V, Σ) → V.trace, V.unit → set(scan_scope = spine, attempts = 0)   -- the cue and the whole it names; Find's dispatch (InputType → Track) is read here too; initial scope + recall-try budget (silent)
Phase 1: V → Find(INDEX ⊕ SSOT_spine ⊕ (scan_scope = full_text ? SSOT_body : ∅), V) → O[ranked]   -- index + spine always; bodies too once ExpandFullText widened the scope, so a re-entry after a correction does not narrow back to spine and report a body-scoped miss; above session scope Find joins its candidates into recognizables (── FIND ABOVE SESSION SCOPE ──) [Tool]
           |O[ranked]| > 0 → O[top] := Ground(O[top]) →   -- one read per member of O[top]: excerpt, locator, handle; the narrative is composed from the excerpts before anything is presented [Tool]
             grounded(O[top]) → Phase 2
             ¬grounded(O[top]) → O[ranked] := O[ranked] \ {O[top]} → Ground the new head; when none is left the |O[ranked]| = 0 guards below receive it, and the records that could not be opened are named in whatever those guards emit — the open question's framing, Qx's pre-gate text, or the NullMatch diagnosis. All of them fire in this same turn, so the list needs no carrier
           |O[ranked]| = 0 ∧ attempts = 0 → Ask(V) → Stop → H → recue(V, H) → set(attempts = attempts + 1) → Phase 1   -- one open question [Tool]
           |O[ranked]| = 0 ∧ attempts > 0 ∧ fulltext_unscanned → Qx(StoreExpansion) → Stop → X   -- store-expansion checkpoint; its pre-gate text reports the coverage searched, above session scope the traversal too [Tool]
             ExpandFullText → set(scan_scope = full_text) → Phase 1   -- re-enters Find with the widened scope: index, spines, and bodies together, so a spine candidate can still join a body one
             StopAtSpine → NullMatch → inform → deactivate
           |O[ranked]| = 0 ∧ attempts > 0 ∧ fulltext_scanned → NullMatch → inform → deactivate
Phase 2: O[top] → set(presented = O[top]) → Present(Λ.presented) → Stop → U    -- the one presentation shape [Tool]: narrative from the excerpts, each member's excerpt with its locator and handle, the adjacent candidates named when |O[ranked]| > 1, the remaining budget, the currency caveat; the turn yields and the next utterance is read as U. The grounded recognizable is written to Λ BEFORE the yield — it is the only thing Phase 3 still needs and the yield is what it has to survive
Phase 3: U → integrate(U, V, Σ) →                                -- integration reads Λ.presented, written at Phase 2 before the yield
           Identified → emit(RecalledContext(Λ.presented)) → converge
           Corrected(c) ∧ attempts < max → recue(V, c) → set(attempts = attempts + 1) → Phase 1   -- the correction is the next cue; a cue naming a different whole re-reads V.unit
           Corrected(c) ∧ attempts = max → surface(Λ.presented) → deactivate   -- AttemptsExhausted (CONVERGENCE): name the closest grounded candidate and the coverage searched, claim no identification
           Withdrawn → deactivate                                          -- no terminal claimed; a later recall starts fresh

── LOOP ──
Phase 1 → Phase 2 → Phase 3 →
  Identified: converge
  Corrected: recue → Phase 1   -- the user's words are the new cue; above session scope a correction may narrow the whole, widen it, or name a different one
  Withdrawn: stand down, nothing claimed

Phase 1 zero result before any round-trip (attempts = 0): Ask once → recue → Phase 1; a zero result after a round-trip — the question's answer or a correction — at spine scope → StoreExpansion:
  ExpandFullText: set scan_scope = full_text → Phase 1 with index, spines, and bodies
  StopAtSpine: NullMatch → deactivate

Max 3 recall attempts; `attempts` starts at 0 in Phase 0, the open question's answer and each correction spends one, and a Find's own result — at any scope — spends nothing. Exhausted with a candidate in hand: AttemptsExhausted — surface O[top] as the closest found, without claiming identification → deactivate. A nothing-found exhaustion terminates as NullMatch instead (both in CONVERGENCE). The counter witnesses round-trips, not questions: a correction carries new cue information exactly as an answer to the open question does, so a zero result may expand or terminate after either, and the open question is owed only while no round-trip has happened.
Convergence evidence: (VagueRecall → [cues] → Recognizable(grounded) → Identified → RecalledContext).

── CONVERGENCE ──
recall_complete = U = Identified ∧ emitted(RecalledContext(Λ.presented))   -- the user's observable identification of the presented recognizable, read from the carrier Phase 2 wrote before the yield; never inferred from silence
NullMatch = (X = StopAtSpine) ∨ (find_empty ∧ attempts > 0 ∧ fulltext_scanned)   -- nothing-found terminal, matching the FLOW/PHASE TRANSITIONS/LOOP branches. Evaluated at the Phase 1 branch point where find_empty holds — the same pass as the empty Find — never reconstructed after a yield; the checkpoint's answer X is the one post-yield witness. attempts > 0 witnesses at least one user round-trip (the open question's answer or a correction) before the scope is called exhausted. StopAtSpine is terminal on its own — gating it on a budget would make the equation refuse a stop the checkpoint already offered. The inform reports exactly the coverage searched, and — where candidates were found but no member's record could be opened — names those records, since that is a different miss from finding nothing
AttemptsExhausted = Λ.presented ≠ Null ∧ U = Corrected(c) ∧ attempts = max   -- candidate-in-hand terminal, evaluated at Phase 3 over what survives the yield: Λ.presented was written at Phase 2 in this pass and Corrected is the answer to that presentation, so both are current. surface Λ.presented as the closest found → deactivate, never NullMatch. The answer is part of the predicate — without it the predicate would hold the moment a final Find returns candidates, terminating before Present offers the identification the budget was spent to reach
progress(Σ) = attempts: N/max, presented: N

── TOOL GROUNDING ──
-- Realization bindings (Claude Code and Codex substrates), non-normative w.r.t. protocol essence — see ── SUBSTRATE AGNOSTICISM ──; any substrate satisfying morphism laws realizes Anamnesis.
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
-- Before Phase 1, read references/claude.md and references/codex.md for every runtime that has a store at all — a runtime whose compact INDEX is absent still carries raw records, so its reference binds. Those references bind each harness's INDEX, SSOT spine and body, candidate fields, record locator, and resume command. Search the available compact INDEX surfaces and raw-record spines in parallel across runtimes, and preserve Candidate.runtime through ranking, grounding, and presentation.
-- Find reads the compact INDEX and the raw-record spines together, unconditionally. A spine read is bounded per record, so it is not the cost the checkpoint exists to protect the user from; gating it would buy nothing and add a branch. Transcript bodies are SCANNED — read across the store to find candidates — only after ExpandFullText: that scan's per-record cost has no upper bound, which is what Qx presents as a differential future against the spine-scoped stop. Ground is a different act: it OPENS the named records of O[top]'s members, one read per member, at any scope. The checkpoint governs scanning, not grounding.
-- Scanning spines unconditionally is also what keeps a runtime reachable before its INDEX exists: a store whose writer has not yet produced entries is not blind, it is spine-only. Without this the first recall against a newly-added runtime would always miss and always require the checkpoint.
-- Fork/sidechain binding exists in the Claude realization only. For a Claude fork member, references/claude.md routes Ground to references/fork-resume.md for the record to open and the handle to emit.
-- When V.unit is above session, Find joins the candidates Scan_{Track} returns into recognizables by read-time inferred edges — see ── FIND ABOVE SESSION SCOPE ── and read references/supra-session.md before finding at that scope. Nothing else changes: Ground, Present, the answers, the budget, and the terminals are those typed above.
Phase 0 Detect      (sense)    → Internal analysis
Phase 0 relay_not_empty (extension) → TextPresent+Proceed (¬empty_intention(V): present finding, proceed without activation)
Phase 0 Cue         (sense)    → Internal analysis (V.trace and V.unit from V + Σ; InputType and Track for Find's dispatch)
Phase 1 Find_entropy  (observe)  → artifact read, artifact search, environment run (literal match over the available compact INDEX surfaces and raw-record spines; SSOT_body only after ExpandFullText. environment run is admitted for the spine read alone — a bounded head read repeated across the whole store, issued as the one command each runtime reference declares, because per-record artifact read calls do not compose at store scale; it opens no transcript body and writes nothing)
Phase 1 Find_salience (observe)  → artifact read, artifact search, environment run (MarkerProfile match over the available compact INDEX surfaces and raw-record spines; SSOT_body only after ExpandFullText; environment run bounded as above)
Phase 1 Find_hybrid   (observe)  → union of above
Phase 1 Traverse    (observe)  → artifact read, artifact search (above session scope only: read the entry candidates' cross_refs, keywords, topic, cwd, and the recency the spine read declares, then search across partitions for records sharing them; edges are inferred at read time and never written; read-only — per references/supra-session.md. What it traversed and which links were broken is reported in the same turn: as Present's pre-gate text when a recognizable was assembled, as Qx's pre-gate text when none was)
Phase 1 Assemble    (sense)    → Internal analysis (above session scope only: join the traversed sub-graph into recognizables in V.unit's shape)
Phase 1 Rank        (sense)    → Internal analysis (ordering only; conditional: lightweight-model scoring for large candidate sets)
Phase 1 backtrace_parent (observe) → artifact read (fork member only, inside Ground: read the orchestrating parent's session_id directly from the fork's substitute capture, then check parent SSOT existence for resumability; deterministic and citable to the capture entry — hence (observe); read-only)
Phase 1 Ground      (observe)  → artifact read (one read per member of O[top]: open the member's own record at member.record, the path the spine read declared and its runtime reference resolves, take the excerpt the cue reaches — the record's words, not the index's — bind the locator and the validated resume handle, then compose the narrative from the excerpts. Bounded by the members of the one recognizable about to be presented; it opens named records and never scans the store, so it is not the body scan Qx governs. A member with no record yields an empty excerpt and the prose says so; where NO member's record opens, the recognizable is dropped and the next is grounded; read-only)
Phase 1 Ask         (constitution) → present (one open question in everyday words — what else do you remember? — after the cue found nothing; the answer is the next cue)
Phase 1 Qx          (constitution) → present (ExpandFullText: scan the labeled Claude/Codex transcript bodies, at a per-record cost with no upper bound; StopAtSpine: return a NullMatch scoped to the indexes and spines already searched, without scanning any transcript body. The pre-gate text states the coverage searched so far, above session scope the traversal too)
Phase 2 set_presented (track)  → Internal state update (Λ.presented := O[top], written before Present yields the turn: Phase 3 resumes with only Λ, so the grounded recognizable has to be in it already)
Phase 2 Present     (constitution) → present (the one presentation shape at every scope: the narrative composed from the excerpts, each member's excerpt with its locator and handle, the adjacent candidates named when more than one was found, the remaining recall-try budget, and the currency caveat — then the turn yields. No option list: the next utterance is read as Identified, Corrected, or Withdrawn)
Phase 3 integrate   (track)    → Internal state update (reads Λ.presented — the last presented recognizable, which is what cross-cycle rendering distinguishes the next one from)
Phase 3 Resolve     (extension)    → TextPresent+Proceed (Identified: emit RecalledContext from Λ.presented — narrative, excerpts, locators, handles, caveat)
Phase 3 surface     (extension)    → TextPresent+Proceed (AttemptsExhausted: name Λ.presented as the closest found and the coverage searched; claim no identification; then deactivate)
converge            (extension)    → TextPresent+Proceed (convergence trace)
seam                (extension)    → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares — the `/recollect ∘ /inquire` COMPOSITION edge — settles the next move; proceed directly to it, citing that settling source; every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, V: VagueRecall,
      attempts: Nat, scan_scope: ScanScope,
      presented: Optional(Recognizable) }   -- the grounded recognizable, written at Phase 2 before Present yields the turn; everything else a later step reads is on the recognizable itself (excerpts, locators, handles) or in V (the cues). Written before the yield rather than after it, because the yield is the boundary it exists to cross

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
*: /recollect ∘ /inquire — RecalledContext seeds Aitesis as input substrate; on NullMatch, the accumulated recall trace seeds Aitesis to search SSOT directly (INDEX may lack entries while SSOT retains the information).

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

── FIND ABOVE SESSION SCOPE ──
Find(Store, V) :
  V.unit = session : each c ∈ Scan_{Track}(Store, trace(V)) ↦ { unit: session, members: [c], narrative: c.fingerprint, excerpts: ∅ }   -- the candidates as scanned
  V.unit ≠ session : Assemble_{V.unit}(Traverse(C, infer_edges(C, Σ))) where C = Scan_{Track}(Store, trace(V))   -- the same candidate step, then the recognizables its candidates join into: shapes, edge inference, traversal, assembly, and the connectivity term Rank adds are typed in references/supra-session.md
binding: Ground, Present, the answers, the budget, and both terminals are those typed above; this block adds none. A zero result at this scope — candidates found, no recognizable joined them — is |O[]| = 0 as for any Find: the open question while no round-trip has happened, then the checkpoint, and the coverage each reports includes what was traversed
-- Before finding above session scope, read references/supra-session.md: it types the three
-- shapes over Candidate (no second element type), the edges inferred at read time from stored
-- anchors and metadata, Traverse and Assemble, the connectivity term Rank adds, and the four
-- graph invariants (no-central-aggregator, edge-based, isolation-preserving, broken-link-tolerant).

── STORE TOPOLOGY ──
Store = SSOT ⊕ INDEX ; memory/ = realization-layer adjunct (non-scanned, user-curated)
  SSOT             = authoritative session record (complete, append-only); read at either of two depths
  SSOT_spine       = per-record head metadata: recency, cwd, session id, origin label, first human turn, and whatever handle the realization needs to reopen the record -- bounded read per record, so it joins the initial scan unconditionally
  SSOT_body        = the record's full text -- scanning it across the store has no upper bound per record, so the SCAN is admitted only at ExpandFullText; opening ONE named record for Ground is bounded per member and admitted at any scope
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
fulltext_expansion: X = ExpandFullText ⟹ Scan_{Track}(INDEX ⊕ SSOT_spine ⊕ SSOT_body, trace) across the Source set named at Qx   -- the widened scope, not bodies alone
degraded_scan: INDEX_semantic = ∅ ⟹ mark that INDEX realization unavailable and continue on that realization's SSOT_spine; SSOT_body remains outside the scan scope until ExpandFullText
  -- an absent semantic INDEX no longer blinds its realization: the spine tier carries recency, cwd, origin, and first human turn, so the realization still contributes ranked candidates. This is what an INDEX-less runtime looks like in normal operation, not a failure to route around
  -- partial INDEX (e.g., MarkerProfile? = ∅ while IdentifierTuples / Coinage / narrative present) is a normal mode and does NOT trigger total fallback; scan_salience returns empty for the missing component and ranking degrades gracefully
  -- when a degraded realization's spine scan also yields nothing and Qx is reached, read references/failure-modes.md §Degraded scan before presenting the scope choice: it states why the substitute channel remains available (so SidechainNoSSOT stays reachable) and which loss is non-recoverable

── SUBSTRATE AGNOSTICISM ──
The protocol essence (form) consists of FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, and the
formal blocks ENTROPY EXTRACTION / SALIENCE MARKERS / FIND ABOVE SESSION SCOPE / STORE TOPOLOGY / KNOWN FAILURE MODES.
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
Ungroundable      : Find returned candidates but no member's record of the top recognizable could be opened (¬grounded) — the records are gone, rotated, or never written
IndexAsEvidence   : a presented narrative asserts what only the INDEX gist carried — a claim no excerpt supports
                    -- structural guard: Ground composes the narrative from the excerpts, so the mode can only arise where Ground was skipped or an excerpt was read past; recovery is to re-ground, never to hedge the gist
                    -- the modes of Find above session scope (sparse edges, broken links, a misjudged whole) are typed in references/supra-session.md, loaded at that scope
```

## Mode Activation

`/recollect` remains directly invocable. During AI-guided activation, loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind. When a direct invocation supplies no recoverable target in current or recent context, ask for the recall target before Phase 0.

### Activation heuristics and exceptions

Treat vague temporal references, existence claims without a locator, uncertain self-reference, failed recall, and visible recall effort as evidence of empty intention rather than hard gates. A recall that names a whole line of work, topic, or settled concept across sessions is empty intention at a higher granularity, not a different deficit. Prior recall indices may seed the find but never constitute recognition.

Skip AI-guided activation when the user gives an exact reference, the same target is already resolved in this session, the request seeks new information, the user declines recall assistance, or Phase 0 identifies a different handling need.

## Protocol

### Reference loading

Before finding in a runtime store, read its realization reference (`references/claude.md` or `references/codex.md`). Before an entropy, salience, or hybrid scan, read the corresponding track reference; read both for hybrid. When the whole the user means stands above one session — a line of work, a topic, or a settled concept spread across several — read `references/supra-session.md` before finding at that scope. When Ground meets a fork member, a member without a recorded working directory, or a recorded directory no longer on disk, read `references/fork-resume.md` before emitting its handle. When a known failure mode is suspected, read `references/failure-modes.md` before acting on it.

### User-facing realization

Present a recognizable as the story of the discussion in the record's own words, not a result-only hit and not the index's paraphrase:

- locate it in time and source, preserving the realization label;
- tell it in the whole's shape — one session: origin, direction, outcome; a line: where it began, how it developed, where it arrived; a topic: the fragments and where it last stood; a concept: who forged it and where it settled — every sentence resting on an excerpt;
- put each member's excerpt beside its locator and emit only the resume handle the realization reference validates; where a record could not be opened, say so rather than filling the gap from the index;
- when more than one candidate was found, name the adjacent ones in a phrase each, so a correction has something to point at;
- state the remaining recall-try budget in ordinary prose, then yield the turn without an option list.

Read the next utterance as identification, correction, or withdrawal. Identification is what the user says or does — "that's it", or carrying on from that context; it is never read out of silence. A correction is taken whole as the next cue: an earlier one, a narrower one, the whole line rather than one session.

Emit `RecalledContext` with the narrative, each member's excerpt, locator, and validated resume handle. State that recognition establishes historical identity rather than current truth. When `source_scan` reports incomplete source coverage, name the non-zero counts so downstream readers can weigh the record accordingly.

When the cue finds nothing and no round-trip has happened yet, ask one open question in everyday words — what else the user remembers — and take the answer as the next cue; after a correction has already supplied new cue information, a miss goes to the checkpoint instead. On the store-expansion checkpoint, state what has been searched so far, above one session including what was traversed and which links led nowhere, then present scanning the transcript bodies and stopping at the spine as the two futures. On NullMatch, report the source-labeled depth actually searched for each realization and name actionable causes supported by the observed failure mode; preserve a `StopAtSpine` boundary as an index-and-spine-scoped miss; after an accepted full-text miss, offer the declared Aitesis handoff with the accumulated trace.

## Rules

- **Source-grounded recognition**: The INDEX narrative is a cue that wakes recall, never evidence of it. Before a recognizable is presented, open each member's own record and compose the narrative from what those excerpts carry; assert nothing the excerpts do not. A RecalledContext is constituted by the user's observable identification and by nothing else.
- **Narrative recognition**: Present candidates as discussion narratives whose origin, direction, and outcome make identity recognizable — in the record's words, with each member's locator and handle beside its excerpt.
- **Correction is orienteering**: When the user turns the cue, show what lies adjacent — the other candidates found, the neighbouring wholes — rather than asking them to reconstruct the answer; the user's own words are the next cue and are searched as given.
- **Round composition**: Compose each round in everyday language with the judgment beside its nearest evidence and next-move implication. Put analytical context before the gate. Read `references/round-composition.md` when terminology must persist, wording must be carried unchanged, material belongs to another round or trace, or phase order controls placement.
- **Cross-cycle rendering**: Preserve narrative form and adjacent-vector context across recall attempts; distinguish a new candidate from the one last presented.
- **Granularity is a dimension of the recall**: The whole the user means — one session, or the line of work, topic, or settled concept above it — is read from the cue and re-read from a correction, never guessed from the scan. Above one session Find joins candidates into recognizables by read-time inferred edges as typed in `references/supra-session.md`, and each is grounded, presented, and identified exactly as one session is: one read per member, one presentation shape, the same budget.
- **NullMatch diagnosis**: Report only the source-labeled coverage actually searched and the failure causes its evidence supports.
- **Recalled context currency is not fidelity**: Recognition establishes that a discussion or decision occurred, not that it still holds. Emit that caveat, require current-state re-verification before commitment, and disclose every non-zero `source_scan` count without changing ranking.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
