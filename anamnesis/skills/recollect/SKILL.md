---
name: recollect
description: "Resolve vague recall into recognized context through AI-guided contextual scan and user-validated recognition."
user_invocable: true
---

# Anamnesis Protocol

Resolve vague recall into recognized context through AI-guided contextual scan and user-validated recognition. Type: `(RecallAmbiguous, AI, RECOGNIZE, VagueRecall) → RecalledContext`.

## Definition

**Anamnesis** (ἀνάμνησις): A dialogical act of resolving vague recall into recognized context, where AI detects empty intention, scans the SSOT plus the hypomnesis INDEX with contextual awareness (`memory/` is a non-scanned, user-curated realization-layer adjunct — see STORE TOPOLOGY), presents narrative candidates for Socratic recognition, and facilitates guided recall orientation when initial candidates do not match — grounded in user-constituted identification rather than keyword retrieval.

```
── FLOW ──
Anamnesis(V) → Detect(V) →
  not-empty_intention(V): relay(finding) → proceed (no activation)
  empty_intention(V): Classify(V, Σ) → InputType → Dispatch(InputType) → Track ∈ {entropy, salience, hybrid} →
    Scan_{Track}(Store, trace(V)) → Rank(C[], trace(V)) →
    |C[]| = 0 ∧ attempts = 0: Probe(V, Σ) → Qs(probe) → Stop → H → enrich(V, H) → re-scan
    |C[]| = 0 ∧ attempts > 0: NullMatch → inform(V, Σ) → deactivate
    |C[]| > 0: backtrace_parent(c) ∀ c ∈ C[] : fork_marker(c) → parent_pointer, parent_cwd   -- deterministic: a fork candidate's parent is recoverable from its own record, not inferred (mechanism in TOOL GROUNDING; ≠ user-described Reorient)
               SingleObvious(C[]): emit(ClueVector_prose(C[top]) ⊕ divergence_affordance) → recall_complete(C[top]) → converge   -- Extension (relay): high-confidence single candidate, no turn yield; silence = Recognize. Convergence is notional (inline skill prose persists), so a next-turn divergence re-engages via fresh re-detection (Layer 1/2 activation) — not an encoded transition out of the converged state — then routes to Refine/Reorient (no dedicated re-activation machinery added)
               ¬SingleObvious(C[]): Qc(C[top], evidence, framing) → Stop → R →
      Recognize(c): recall_complete(c) → emit(ClueVector_prose(c)) → converge      -- fork: emitted pointer = parent (or, when the parent record is absent, non-resumable + recoverable artifacts)
      Refine: Probe(V, Σ) → Qs(probe) → Stop → H → enrich(V, H) → re-scan
      Reorient(d): rebind(V, d, Σ) → Phase 1                 -- orthogonal dimension shift

── MORPHISM ──
VagueRecall
  → detect(empty_intention)              -- recognize vague recall state
  → classify(input_type)                 -- InputType ∈ {StructuredIdentifier, NaturalRecall, Mixed}
  → dispatch(input_type)                 -- Track ∈ {entropy, salience, hybrid}
  → scan(Store, Track, recall_trace)     -- track-specific scan (see STORE TOPOLOGY)
  → rank(candidates, recall_trace)       -- order by relevance
  → backtrace_parent(candidate)          -- when fork_marker: deterministic parent identification → parent_pointer, parent_cwd (recovered from the candidate's own record; ≠ user-described Reorient)
  → present(candidate, Socratic)         -- Socratic candidate presentation; absorbed into the emit for SingleObvious (high-confidence single candidate) — Extension, no turn yield
  → recognize(candidate, user)           -- synthesis of identification (Husserl CM §§38-39); for SingleObvious, realized as silence-default behind a divergence-only affordance (non-divergence constitutes recognition)
  → emit(ClueVector_prose)               -- NL rendering to session text
  → RecalledContext
requires: empty_intention(V)              -- phenomenological trigger
deficit:  RecallAmbiguous                 -- activation precondition (Layer 1/2)
preserves: Store                          -- SSOT ⊕ INDEX are read-only; V is enriched/rebound during protocol
invariant: Recognition over Retrieval

── TYPES ──
V                = VagueRecall { trace: RecallTrace, enrichments: List(Hint), input_type: InputType }
RecallTrace      = { keywords: Set(String), temporal: Optional(String),
                     associations: Set(String), identifiers: Set(IdentifierTuple) }
Hint             = String   -- user recall context from Socratic probe
InputType        ∈ {StructuredIdentifier, NaturalRecall, Mixed}      -- classified from V + Σ
Track            ∈ {entropy, salience, hybrid}                       -- dispatched from InputType
Source           = String   -- opaque: store location identifier (substrate-agnostic)
IdentifierTuple  = { literal: String, source: Source, source_namespace: String, precision: ℝ[0,1] } -- entropy-track anchor
                  -- source_namespace determines which claim kinds it can authorize (via the registry); a literal anchors ranking only when its namespace authorizes the recall trace's claim kind
                  -- claim_kind is NOT a tuple field — it is determined by source_namespace at scan time, so the writer materializes only source_namespace (the extractor's namespace), not a per-literal claim_kind
MarkerProfile    = { coinage: Set(Token), actor: Set(Entity),
                     temporal: Set(TimeRef), emotional: Set(Marker),
                     cognitive: Set(Marker), singularity: Set(Event) }  -- salience-track profile
DateAnchor       = String   -- ISO 8601 date; reference point for salience-track temporal normalization (e.g., session start). Optionality is carried at the use site (DateAnchor?)
EvidenceMode     = {user_constituted, attested, observed, inferred}   -- totally ordered tier of the content's evidential STANDING (who stands behind it: user-authored verbatim > party-asserted with verbatim witness > mechanically present without assertion > LLM-synthesized) — NOT extractor reliability (that is extraction_method's concern). Assigned at write time by construction of each artifact's production path (deterministic metadata, never LLM-judged). Ranks recall weight only — NEVER suppresses/excludes; introduces no automatic effectivity (any downstream status change stays user-gated).
Store            = SSOT ⊕ INDEX               -- see ── STORE TOPOLOGY ── block
Scan             = (Store, Track, RecallTrace) → List(Candidate)
Candidate        = { session_id: Optional(SessionId),
                     cwd: Optional(String),
                     topic: String,
                     keywords: Set(String),
                     fingerprint: Prose,
                     cross_refs: List(Anchor),
                     confidence: ∈ {low < medium < high},   -- totally ordered tier (cf. EvidenceMode); grounds the SingleObvious confidence = high guard and the confidence < high gate
                     evidence_mode: Optional(EvidenceMode),       -- highest tier among the signals that matched this candidate at scan time; Null ⇒ INDEX entry predates evidence-mode capture — Null is NEUTRAL in ranking (no contribution), never a penalty
                     fork_marker: Bool,                          -- true ⇒ the id is a sidechain/fork with no top-level SSOT (SidechainNoSSOT); its own id is not a valid resume handle. Invariants: fork_marker = false ⇒ parent_pointer = Null ∧ parent_cwd = Null ; parent_pointer = Null ⇒ parent_cwd = Null (parent_cwd requires parent_pointer; parent_pointer present with parent_cwd = Null is valid — parent identified but its cwd is unknown)
                     parent_pointer: Optional(SessionId),        -- orchestrating parent session for a fork candidate, read directly from the fork's own record; the resumable handle when the parent's top-level SSOT still exists (Null ⇒ parent record absent → non-resumable)
                     parent_cwd: Optional(String),               -- parent session's working directory, paired with parent_pointer to build the parent resume handle (Null ⇒ parent record absent, OR parent identified but its cwd metadata is unknown — parent transcript predates cwd capture)
                     resumption_hint: Optional(String) }
Anchor           = StructuredAnchor | LegacyAnchor      -- Candidate.cross_refs element; extends-edge sediment (context-adding annotation)
StructuredAnchor = { kind: ∈ {memory, github_issue, github_pr}, ref: String, channel: ∈ {user, transcript} }
                  -- the stored form tells a later reader WHAT kind of reference and from WHICH utterance channel; it confers NO effectivity — a structured anchor is never authoritative by form, it remains a recall clue requiring the same re-verification as any recalled context
                  -- kind reuses the entropy source_namespace vocabulary where overlapping (github_issue, github_pr); memory is sediment-local. StructuredAnchor ≠ IdentifierTuple: no precision, no compatible_anchor authorization — shared value vocabulary, disjoint machinery (annotation vs anchoring)
                  -- ref stores the canonicalized literal (issue/PR numbers normalized to "#N", memory paths prefixed "memory/"); canonical-form grep over INDEX is form-invariant (a search for "#309" hits ref: "#309") — the canonical form is the dedup key, so raw surface variants ("PR 309") collapse into it
LegacyAnchor     = String   -- opaque: memory path, URL, session ID, doc path — entries written before structured anchors; read as kind-unknown extends edges, never rejected, no migration
Prose            = String   -- source-agnostic NL description
Rank             = (List(Candidate), RecallTrace) → List(Candidate)   -- track-primary signal dominates; evidence_mode is a secondary tie-break + confidence modulator only (never a filter; Null neutral)
Probe            = (V, Σ) → List(SocraticQuestion)
SocraticQuestion = { dimension: ∈ {temporal, associative, contextual}, question: String }
R                = Recognition ∈ {Recognize(Candidate), Refine, Reorient(description)}
SingleObvious    = predicate; SingleObvious(C[]) ≡ |C[]| = 1 ∧ confidence(C[top]) = high   -- Light-only Extension guard: the one candidate is the single dominant option (option-set entropy → 0 → relay), so Qc is absorbed into the emit; Medium (|C[]| ≥ 2) and Heavy (confidence < high) keep the Qc gate
divergence_affordance = the mismatch channel folded into the non-yielding SingleObvious emit: names concrete adjacent candidates (Refine) AND offers an open free-response invitation (Reorient), keeping the full R = {Recognize, Refine, Reorient} coproduct reachable without a gate — Recognize is realized as silence-default
emitted(x)       = predicate; the relay emit(x) has fired in session text — the Extension-path convergence witness (event predicate; satisfied by the non-yielding SingleObvious emit, no turn yield)
H                = Hint     -- answer from Socratic probe gate (Qs)
ClueVector_prose = String
RecalledContext  = session text containing ClueVector_prose
               -- recall establishes IDENTITY (this WAS discussed/decided), not current-reality FIDELITY (it still HOLDS). Store-currency (the INDEX entry is fresh) ⊂ fidelity-to-current-reality: a recalled decision may be superseded, a recalled path renamed, a recalled convention revised. RecalledContext describes a PAST state; downstream consumers re-verify against current state before commit rather than treating it as confirmed current context.
NullMatch        = predicate; canonical definition in ── CONVERGENCE ──
Phase            ∈ {0, 1, 2, 3}

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
           → Classify(V, Σ) → InputType → Track                  -- dispatch (silent)
Phase 1: V → Scan_{Track}(Store, trace(V)) → Rank(C[], trace(V)) → C[ranked]  -- track-dispatched scan + rank [Tool]
           backtrace_parent(c) ∀ c ∈ C[ranked] : fork_marker(c) → parent_pointer, parent_cwd  -- fork (SidechainNoSSOT): parent recovered deterministically from the candidate's own record [Tool]
           |C[ranked]| = 0 ∧ attempts = 0 → Probe(V, Σ) → Qs → Stop → H → enrich(V, H) → Phase 1
           |C[ranked]| = 0 ∧ attempts > 0 → NullMatch → inform → deactivate
Phase 2: SingleObvious(C[ranked]) → emit(ClueVector_prose(C[top]) ⊕ divergence_affordance) → recall_complete(C[top]) → converge   -- Extension: high-confidence single candidate, no turn yield, no [Tool] Stop; silence = Recognize
         ¬SingleObvious(C[ranked]) → C[top] → Qc(C[top], evidence, framing) → Stop → R    -- recognition gate [Tool]
Phase 3: R → integrate(R, V, Σ) →                                -- integration (track: Λ.history ⊕ (C[top], R)); after a SingleObvious emit, a next-turn divergence reaches these paths through fresh re-activation (Layer 1/2), not a transition from the converged state
           Recognize(c) → ClueVector_prose(c) → emit → converge
           Refine → Probe(V, Σ) → Qs(probe) → Stop → H          -- Socratic probing [Tool]
                  → enrich(V, H) → Phase 1
           Reorient(d) → rebind(V, d, Σ) → Phase 1               -- orthogonal re-scan (sense)

── LOOP ──
Phase 1 → Phase 2 → Phase 3 →                              -- Phase 2 SingleObvious shortcut: emit ⊕ divergence affordance → converge (Extension, skips the Phase 3 gate; convergence is notional, so a next-turn divergence re-engages via fresh re-activation → Refine/Reorient)
  Recognize: converge
  Refine: Socratic probing → enrich → Phase 1
  Reorient: rebind V with orthogonal description → Phase 1

Max 3 recall attempts. Exhausted: surface best candidate → deactivate.
Convergence evidence: (VagueRecall → [enrichments] → Candidate(recognized) → ClueVector_prose).

── CONVERGENCE ──
recall_complete = Recognize(c) for some c ∈ C[]                                        -- gated path (¬SingleObvious)
               ∨ SingleObvious(C[]) ∧ emitted(ClueVector_prose(C[top]) ⊕ divergence_affordance)   -- Extension path: the inline emit converges immediately (no turn yield); non-divergence (silence) realizes user-constituted recognition. Convergence is notional — a later divergence re-engages via fresh re-activation (Layer 1/2), not a transition out of the converged state
NullMatch = |C[]| = 0 ∧ attempts > 0 ∧ (attempts = max ∨ enrichments exhausted)
progress(Σ) = attempts: N/max, enrichments: N, candidates_presented: N

── TOOL GROUNDING ──
-- Realization binding (Claude Code substrate), non-normative w.r.t. protocol essence — see ── SUBSTRATE AGNOSTICISM ──; any substrate satisfying morphism laws realizes Anamnesis.
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
-- Store binding:
--   {slug} = dirname(transcript_path) — Claude Code's project partition identifier
--   {config_dir} = the Claude Code config directory (CLAUDE_CONFIG_DIR when set, else ~/.claude). A detail of THIS realization, not protocol vocabulary — another substrate roots its store elsewhere under its own layout, so it is described here rather than typed as a phase. Read the value and substitute an absolute path before any tool call; a ${...} left in this text is inert, since Read/Grep/Glob perform no shell expansion and a tilde inside ${VAR:-default} stays literal even when quoted
--   SSOT             ↦ {config_dir}/projects/{slug}/*.jsonl                              (session JSONL, append-only)
--   INDEX_semantic   ↦ {config_dir}/projects/{slug}/hypomnesis/{session-id}/             (per-session recall index from SessionEnd/PreCompact)
--   INDEX_substitute ↦ {config_dir}/projects/{slug}/hypomnesis/subagent/{agent_id}.jsonl (substitute channel capture from SubagentStop)
--   memory           ↦ {config_dir}/projects/{slug}/memory/                              (user-curated insights)
--   slug-partitioned: prevents cwd-scattered INDEX; cross-cwd /recollect reaches one canonical location
-- Candidate source binding: `Candidate.session_id` ← INDEX entry frontmatter `session_id`; `Candidate.cwd` ← INDEX entry frontmatter `cwd` (Optional — absent for entries written before cwd capture was implemented); Candidate.cross_refs ← INDEX entry frontmatter cross_refs — inline-mapping items {kind, ref, channel} since v0.7.0 (StructuredAnchor); bare-string items in older entries are LegacyAnchor and remain valid (degraded read: kind unknown); Candidate.evidence_mode ← max tier over matched artifacts' frontmatter evidence_mode/evidence_modes (Optional — absent for pre-v0.7 entries)
-- Fork/sidechain binding + parent back-trace: to set `Candidate.fork_marker`, `Candidate.parent_pointer`, and `Candidate.parent_cwd`, read references/fork-resume.md — it carries the detection precondition (substitute-channel hit with no sibling top-level SSOT) and the deterministic read that recovers the orchestrating parent. Without it these three fields have no substrate binding and `backtrace_parent` cannot execute.
Phase 0 Detect      (sense)    → Internal analysis
Phase 0 relay_not_empty (extension) → TextPresent+Proceed (¬empty_intention(V): present finding, proceed without activation)
Phase 0 Classify    (sense)    → Internal analysis (InputType detection from V + Σ)
Phase 1 Scan_entropy  (observe)  → Read, Grep (literal match over SSOT ∪ INDEX)
Phase 1 Scan_salience (observe)  → Read, Grep, Glob (MarkerProfile match over INDEX; SSOT fallback on degraded_scan)
Phase 1 Scan_hybrid   (observe)  → union of above
Phase 1 Rank        (sense)    → Internal analysis (conditional: haiku scoring for large candidate sets)
Phase 1 backtrace_parent (observe) → Read (fork candidate only: read the orchestrating parent's session_id directly from the fork's substitute capture, then check parent SSOT existence for resumability; deterministic and citable to the capture entry — hence (observe); read-only)
Phase 2 Qc          (constitution)     → present (narrative Socratic candidate; gated path — ¬SingleObvious: candidates ≥ 2 OR confidence < high)
Phase 2 emit        (extension)    → TextPresent+Proceed (SingleObvious path only: high-confidence single candidate emitted inline with a divergence-only affordance, no turn yield, converge immediately). Relay basis: one dominant candidate collapses the recognition option set to a single option (Refine/Reorient are foils), so the option set is relay rather than a gate; this conditional Constitution→Extension specialization within Phase 2 is the sanctioned revision of Rule 12's Safeguard-tier mandatory-Qc tag, motivated by observed binary-confirm abandonment friction. It is the relay-collapse kind of (extension), NOT a Standing-authority migration.
Phase 3 integrate   (track)    → Internal state update
Phase 3 Probe       (sense)    → Internal (gap detection)
Phase 3 Qs          (constitution)     → present (Socratic probing with structured navigation; mandatory on Refine)
Phase 3 emit        (extension)    → TextPresent+Proceed (ClueVector_prose)
converge            (extension)    → TextPresent+Proceed (convergence trace)
seam                (extension)    → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares — the `/recollect ∘ /inquire` COMPOSITION edge — settles the next move; proceed directly to it, citing that settling source; every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, V: VagueRecall,
      candidates: List(Candidate), presented: Set(Candidate),
      recognized: Optional(Candidate),
      probes: List(SocraticQuestion), history: List<(Candidate, R)>,   -- history appended at Phase 3 integration: Log (Candidate, R) to history
      attempts: Nat, active: Bool, cause_tag: String }

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

── STORE TOPOLOGY ──
Store = SSOT ⊕ INDEX ; memory/ = realization-layer adjunct (non-scanned, user-curated)
  SSOT             = authoritative session record (complete, append-only)
  INDEX_semantic   = per-session semantic extraction (IdentifierTuples, MarkerProfile?, Coinage, narrative) -- derived from SSOT, rebuildable, lossy; MarkerProfile? is conditional on successful Haiku extraction + validation (markers.md absent on extraction error or schema-validation failure); artifacts carry evidence-mode frontmatter (evidence_mode scalar for homogeneous files, evidence_modes map for clue/markers) derived by construction — legacy entries lack it (Candidate.evidence_mode = Null, neutral)
  INDEX_substitute = substitute channel raw message log -- append-only, primary capture, authoritative (loss non-recoverable)

scan_{Track} : (Store, Trace) → List(Candidate)
  scan_entropy(Store, trace)    = exact-match over IdentifierTuples where compatible_anchor(t, trace) (SSOT ∪ INDEX_semantic)
                                  ∪ literal-id match over INDEX_substitute origin ids (a sidechain/derived id carries no IdentifierTuple, so a structured id is matched against the substitute channel directly; a hit whose id has no sibling top-level SSOT is the SidechainNoSSOT precondition)
                                -- structural rejection (compatible_anchor filters ALL literal matches, distinct from low-precision miss): incompatible literals do NOT anchor but are retained in the recall trace as evidence; the scan routes to the salience track (hybrid) or NullMatch₁ recovery with the incompatibility noted — never a silent zero-candidate return
  scan_salience(Store, trace)   = MarkerProfile match (ranked by Σ)        -- INDEX-accelerated; SSOT fallback
  scan_hybrid(Store, trace)     = scan_entropy ∪ scan_salience
  evidence_mode(c) = max tier over matched signals' frontmatter evidence_mode(s); frontmatter absent ⇒ Null (legacy entry, neutral — partial-INDEX normal mode, no fallback trigger)

degraded_scan: INDEX_semantic = ∅ ⟹ scan'(SSOT, Track, trace) ∪ literal-id match over INDEX_substitute origin ids
  -- partial INDEX (e.g., MarkerProfile? = ∅ while IdentifierTuples / Coinage / narrative present) is a normal mode and does NOT trigger total fallback; scan_salience returns empty for the missing component and ranking degrades gracefully
  -- once the fallback has fired, read references/failure-modes.md §Degraded scan before relying on the result: it states why the substitute channel survives the fallback (so SidechainNoSSOT stays reachable) and which loss is non-recoverable

── SUBSTRATE AGNOSTICISM ──
The protocol essence (form) consists of FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, and the
formal blocks ENTROPY EXTRACTION / SALIENCE MARKERS / STORE TOPOLOGY / KNOWN FAILURE MODES.
The essence makes no reference to specific tools, agents, platforms, schedulers, or storage
media. Any realization (matter) satisfying the entropy extraction laws, salience semantic
invariants, and store topology realizes Anamnesis.

form ⊥ matter:
  form   = ⟨FLOW, MORPHISM, TYPES, laws of extract/scan, invariants of detect⟩   -- protocol definition
  matter = ⟨tool names, file paths, language, scheduler, storage backend⟩         -- realization

TOOL GROUNDING below specifies one such realization (Claude Code substrate); it is
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
```

## Core Principle

**Recognition over Retrieval**: When a user has a vague memory of prior discussion or decision, verify the match between their recalled context and historical context through cognitive assistance — presenting narrative candidates for user recognition, rather than returning search results. The protocol function is context identity verification (Husserl's synthesis of identification: empty intention meets fulfilled re-presentation), not information retrieval; identity verification is not current-reality verification (Rule 18 carries the full currency≠fidelity distinction).

The scan finds candidates; the narrative Qc enables recognition; the user constitutes the identity match. Three constitutive distinctions from search/retrieval — input-typed dispatch, narrative presentation, and guided recall orientation on Refine — are detailed as Rules 3-5.

## Mode Activation

### Activation

AI detects empty intention in user expression (Layer 2, silent Phase 0) OR user calls `/recollect` (Layer 1, always available). Recognition requires user interaction at the Phase 2 gate, except for a high-confidence single candidate — there the gate is absorbed into an inline Extension emit with a divergence-only affordance, and non-divergence (silence) constitutes recognition. On direct `/recollect`, bind `V` from current/recent context; if none recoverable, request the recall target before Phase 0.

**Empty intention** — user has vague memory of prior context but cannot locate/specify it (knows-that ∃ something, not what/where).

```
empty_intention(V) ≡ ∃ context(c, prior) : knows_exists(user, c) ∧ ¬can_locate(user, c)
```

### Priority

<system-reminder>
When Anamnesis is active:

**Supersedes**: Direct execution patterns that bypass recall verification
(Vague recall must be resolved before context-dependent work proceeds)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, present the narrative candidate for user recognition — a Constitution gate when candidates ≥ 2 or confidence < high; for a high-confidence single candidate, an Extension inline emit with a divergence-only affordance (silence constitutes recognition).
</system-reminder>

Anamnesis completes before context-dependent work; loaded instructions resume after recall resolves or dismisses.

### Trigger Signals

Heuristic signals for empty intention detection (not hard gates):

| Signal | Detection |
|--------|-----------|
| Vague temporal reference | Past-tense hedging about prior sessions or discussions without an exact pointer |
| Existence without specification | User asserts prior context exists but cannot name it specifically |
| Self-referential recall markers | Verbs of remembering paired with uncertainty markers |
| Failed self-recall | User attempts to reference prior context but trails off, hedges, or uses approximation language |
| Cognitive effort signals | User pauses mid-reference, self-corrects, or expresses frustration at not finding a prior discussion |

**Cross-session enrichment**: Prior recall indices persisted in the hypomnesis store (prior-session recall indices) provide starting points for Phase 1 contextual scan — previously successful recall paths may guide initial search scope. This is a heuristic input that may bias detection toward previously observed patterns; constitutive judgment remains with the user.

**Skip**:
- User provides specific reference (file path, session ID, issue number, exact quote)
- Same recall target already resolved in current session (session immunity)
- No empty intention — user is asking for new information, not recalling prior context
- User explicitly declines recall assistance
- Phase 0 determines the user's expression needs other handling, not recall

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| recall_complete (Recognize, or SingleObvious inline emit) | Emit ClueVector_prose; proceed with the recognized context as recalled past context requiring re-verification against current state before commit (not confirmed current context) |
| NullMatch (all attempts exhausted) | Surface search scope + accumulated trace, offer Aitesis handoff for SSOT search, deactivate |
| User Esc key | Accept current state without further recall assistance |

## Protocol

### Phase 0: Recall Trigger Detection (Silent)

Detect empty intention and extract contextual trace. This phase is **silent** — no user interaction.

1. **Detect empty intention**: Analyze user expression for vague recall markers — self-referential past tense, existence claims without specification, temporal references without anchors
2. **Extract trace + classify input type**: `extract_trace(input, Σ)` populates `RecallTrace` (keywords, temporal, associations, identifiers); `classify(V, Σ)` assigns `InputType` ∈ {StructuredIdentifier, NaturalRecall, Mixed} → binds `Track` ∈ {entropy, salience, hybrid}. Session context (Σ) — the current conversation's structure and direction — is the strongest clue for narrowing search space; user keywords are heuristic hints, not definitive queries.
3. **Assess trace ambiguity**:
   - **Low** (3+ specific signals across keywords, temporal, associations): proceed to Phase 1 with targeted scan
   - **Moderate** (1-2 signals): proceed to Phase 1 with broader scan scope and semantic similarity
   - **High** (0-1 signals, vague expression): consider presenting hypomnesis store overview first (Phase 1 adaptive path)
4. If `not-empty_intention(V)`: present the activation finding to the user (e.g., user provided a specific reference, or no recall gap was detected) and proceed without Anamnesis activation.
5. If `empty_intention(V)`: record V with extracted trace — proceed to Phase 1

**Scan scope**: Read-only over bound text, conversation context, and session history.

### Phase 1: Track-Dispatched Scan + Rank

Dispatch the scan on the classified `Track`, execute track-appropriate lookup over `Store = SSOT ⊕ INDEX`, then rank candidates.

1. **Track-dispatched scan strategy**. The dispatched track decides which contract binds: read `references/entropy-track.md` before running `scan_entropy`, `references/salience-track.md` before running `scan_salience`, and both on the hybrid track. Each carries the laws and thresholds its scan executes; the untaken track's reference does not bind and is not read.
   - **entropy track** (`InputType = StructuredIdentifier`): execute `scan_entropy` over `SSOT ∪ INDEX` — literal match on `IdentifierTuple.literal`, then apply `compatible_anchor(t, trace)` before the match can anchor ranking; precision-thresholded compatible identifiers win. URL path literals, explicit references, citation tokens dominate only within their authorized source_namespace × claim_kind. A structured id with no IdentifierTuple is additionally matched literally against `INDEX_substitute` origin ids (sidechain/derived records) — a hit whose id has no sibling top-level SSOT is the SidechainNoSSOT precondition (parent back-trace; see Phase 3 emission).
   - **salience track** (`InputType = NaturalRecall`): execute `scan_salience` over `INDEX` (SSOT fallback on degraded_scan) — match against `MarkerProfile` (coinage / actor / temporal / emotional / cognitive / singularity); session context (Σ) supplies ranking signal within this track.
   - **hybrid track** (`InputType = Mixed`): union of entropy and salience results.

   Tool realization (Claude Code substrate): `Read/Grep/Glob` over the Store binding declared in TOOL GROUNDING. Track-internal ranking composes track-appropriate signals — entropy track: source-namespace / claim-kind compatibility gates anchoring, then literal precision (corpus rarity) dominates; salience track: Σ-match + marker-profile overlap + temporal neighborhood + adjacent vector discovery; in both tracks, evidence_mode then composes as a secondary tie-break and confidence modulator (never a filter; Null neutral).

2. **Adaptive behavior based on trace ambiguity**:
   - **High ambiguity**: Present hypomnesis store overview as orientation text (extension) — surface the store's structure and major topic clusters so the user can orient their recall. This is informational, not a gated interaction; the overview provides context for the subsequent targeted scan.
   - **Moderate ambiguity**: Broaden scan scope to include semantic similarity and temporal neighborhood.
   - **Low ambiguity**: Direct targeted scan using the dispatched track.

3. **Rank candidates**: Ranking is track-internal. On the entropy track, compatible anchors are ranked by precision (low occurrence in corpus); incompatible literal matches remain evidence in the trace but do not become anchors. On the salience track, Σ-match + marker-profile overlap + temporal proximity compose the weight. When the matched INDEX artifacts carry evidence-mode frontmatter, the mode acts as a secondary signal: it orders candidates whose track-primary relevance is equal and informs the confidence label. It never excludes a candidate; entries without the field (pre-capture) rank on track-primary signals alone — at no disadvantage: absence of the field is neutral, never a penalty (a legacy candidate is never ranked below an otherwise-equal mode-carrying candidate by mere absence). Each candidate carries:
   - Its core topic and narrative summary
   - Adjacent topics from the same session or time period
   - Confidence level based on trace alignment, modulated by evidence mode when present (absence neutral)

4. If `|C[]| = 0`: NullMatch pathway. **Read `references/failure-modes.md` first and identify which mode fired** — the recovery differs per mode (probe enrichment, Aitesis handoff, or a missing-extractor report), and the taxonomy in the Definition block carries only the triggering predicates, not the recoveries. A scan that succeeded but yielded no resumable record is not a NullMatch at all; that mode routes to parent back-trace instead. Inform user what was searched and not found. Before declaring NullMatch, attempt at least one Socratic probe enrichment. After enrichment attempts exhausted: surface the search scope summary and the accumulated recall trace (keywords, temporal signals, user hints from probing), then offer Aitesis handoff — the recall INDEX (hypomnesis/) may lack the entry (lifecycle gap: SessionEnd did not fire; or pre-store: session predates hypomnesis implementation), but the SSOT (session JSONL) may still contain the information. The accumulated trace from Anamnesis probing becomes context seed for Aitesis to search SSOT directly.

**Scope restriction**: Investigation uses Read, Grep, Glob exclusively.

### Phase 2: Narrative Recognition (Constitution; Extension on a high-confidence single candidate)

**Present** the highest-priority candidate as a discussion narrative for user recognition. Branch on the candidate set: a **high-confidence single candidate** (`|C[]| = 1` at high confidence — `SingleObvious`) absorbs the gate into the presentation — emit the recognized context inline as **Extension** (no turn yield, converge immediately): essential output first (narrative + `Resume` handle + currency≠fidelity caveat), then a **divergence-only affordance** that names the concrete adjacent candidates (Refine) and invites an open redescription of the target (Reorient), keeping the full Recognize / Refine / Reorient set reachable. Silence (the user moving on) constitutes recognition; only divergence is explicit. Convergence here is notional — the inline skill prose persists as a standing instruction, so a next-turn divergence re-engages the protocol through fresh empty-intention re-detection (Layer 1/2 activation), which routes to the existing Refine / Reorient handling — there is no encoded transition out of the converged state, and no dedicated re-activation machinery is added. One dominant candidate collapses the option set to a single option, so this is relay, not a gate. **Otherwise** (candidates ≥ 2, or confidence < high) the recognition gate runs as a Constitution interaction (turn yield). Both branches share the narrative format below.

**Selection criterion**: Choose the candidate whose recognition would maximally resolve the user's empty intention. When priority is equal, prefer the candidate with richer narrative context and adjacent vectors.

**Narrative presentation format**:

Present the candidate as narrative text — the discussion's story, not just its result:
- **When/Where**: Temporal and spatial context — when the discussion happened, expressed as temporal distance from the current session, plus which session or document. Use short session reference in narrative for readability.
- **Source**: Provenance of the stored context — whether it was user-inscribed via a session-text utility or auto-generated (SessionEnd hook narrative)
- **Origin**: What prompted the discussion — the question or situation that started it
- **Direction**: How the discussion developed — what path was taken, what was explored
- **Outcome**: What was decided, produced, or concluded
- **Session**: Full session ID for identification and `claude --resume` verification (e.g., `session: abc12345-def6-7890-ghij-klmnopqrstuv`). Narrative uses short reference. For a non-fork candidate this id is the resumable identifier; for a fork candidate (`fork_marker = true`) it identifies the recognized session but is not itself resumable — the resumable handle is the back-traced parent (see Resume).
- **Resume**: Copy-paste-ready invocation pairing the originating cwd with the session ID — `cd <cwd> && claude --resume <session_id>`. Claude Code resolves the project slug from invocation cwd, so both components are required; emit only the literal command, no narrative wrapper. **When the candidate carries `fork_marker = true`, or when `Candidate.cwd` is absent or empty, read `references/fork-resume.md` and build this field by the four-branch rule there before emitting anything.** A fork id is never a valid resume handle, so emitting one produces a command that fails; the four branches cover which handle to emit, when to omit it, and what to surface instead.
- **Adjacent**: Other topics discussed nearby in the same time period — for Refine orientation
- **Framing**: how many recall tries remain before the cap, and the size of the candidate space still in scope — stated as the budget you reason with, not a numeric attempt fraction

For the **SingleObvious** path the inline emit renders the narrative format above as plain session text — the convergence trace folded in (narrative + `Resume` handle + currency≠fidelity caveat) — and ends with the divergence-only affordance (named adjacents + open channel), no gate. **Gated path** (`¬SingleObvious`) — then **present**:

```
Does this match the discussion you are recalling?

Options:
1. **Recognize** — this is the discussion I was thinking of
2. **Refine** — the adjacent topics listed above may be closer to your memory
```

Other is always available — maps to `Reorient`: user describes a fundamentally different recall dimension that neither Recognize nor Refine captures (e.g., recalling a concept rather than a discussion, an external reference rather than a session). The protocol re-characterizes V with the new description and re-scans from the orthogonal angle.

### Phase 3: Integration

After user response:

1. **Recognize(c)**: Mark candidate as recognized. Emit ClueVector_prose — natural language rendering of the recognized context to session text. ClueVector_prose includes: session reference (short form in narrative, full session ID for `--resume` verification), topic summary with narrative, key cross-references (memory paths, issue numbers, document pointers), and a resume handle: for a non-fork candidate with `Candidate.cwd` present and non-empty, emit a literal `cd <cwd> && claude --resume <session_id>` line (the project slug derives from invocation cwd, so the command is the resumable handle). **Otherwise — `fork_marker = true`, or `Candidate.cwd` absent or empty — read `references/fork-resume.md` and build the handle by the four-branch rule there**, which is the same rule the Phase 2 `Resume` field uses. This prose enters the session text and is naturally readable by any downstream protocol via Session Text Composition. ClueVector_prose carries a currency≠fidelity caveat: it states that the context was recognized as a past discussion or decision, not that the recalled content is verified against current reality — downstream consumers (e.g., Aitesis composition) treat it as recalled-and-requiring-re-verification, not as confirmed current context.

2. **Refine**: Candidate not recognized but recall direction acknowledged. Initiate Socratic probing for recall deepening:

   **Probe(V, Sigma)**: Analyze what the user rejected and what the stored adjacent vectors suggest they might be seeking. Generate structured navigation through the memory space — concrete options, not open-ended questions:

   **Present** Socratic probe via Cognitive Partnership Move (Constitution) (Qs, mandatory on Refine):
   ```
   Adjacent areas from this time period and context:
   1. [Topic A] — [brief narrative: what was discussed and why]
   2. [Topic B] — [brief narrative]
   3. [Topic C] — [brief narrative]
   Which direction is closer to your memory?
   ```

   After user response: `enrich(V, H)` — integrate hint into trace (keywords, associations, temporal narrowing), re-enter Phase 1 with enriched context.

3. **Reorient(description)**: User surfaces an orthogonal recall dimension neither candidate nor adjacent vectors match — the target is fundamentally different from what was assumed. `rebind(V, d, Σ)` rebuilds V.trace from the new description (fresh construction, not Refine's incremental enrichment). Re-enter Phase 1 with rebuilt trace. NullMatch on re-scan may route cross-protocol (e.g., ContextInsufficient → Aitesis).

   **Refine vs Reorient test**: would the user's new description produce any overlap with the current candidate set? Overlap → Refine; disjoint → Reorient.

After integration: `recall_complete` → present convergence evidence trace (VagueRecall → [enrichments applied] → Candidate(recognized) → ClueVector_prose emitted), proceed. Refine → Phase 1 with enriched trace. Reorient → Phase 1 with rebuilt trace (orthogonal re-scan). Log `(Candidate, R)` to history.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | High specificity trace, single obvious candidate (high confidence) | Recognized context folded inline — narrative (origin → outcome) + resume handle + currency≠fidelity caveat — in one non-yielding (Extension) emit, then converge immediately; divergence-only affordance (named adjacents + open channel), no confirmation gate |
| Medium | Moderate specificity, 2-3 candidates in scope | Full narrative + adjacent vectors in Refine option |
| Heavy | Low specificity, Refine path expected, high ambiguity trace | Full narrative + adjacent vectors + Socratic probing with structured navigation + hypomnesis overview on initial scan |

## Rules

1. **AI-guided detection, user-constituted recognition**: AI detects empty intention, scans stores, and presents narrative candidates as recognition options; user identification via Cognitive Partnership Move (Constitution) at Phase 2 constitutes the identity match. Detection, presentation, and constitution are separate acts — AI detection is implicitly confirmed when the user engages with recognition (Phase 2 response, not Esc). For a high-confidence single candidate (SingleObvious), recognition is constituted by non-divergence: the inline Extension emit carries a divergence-only affordance, and silence (the user moving on) realizes the identity match — the user's constitutive freedom is the divergence channel, not a forced confirm.

2. **Recognition over Retrieval**: Present structured narrative options with anticipatable post-selection state (Recognize / Refine / Reorient) — Constitution interaction requires turn yield before proceeding; recognition options enable user evaluation, not blank-canvas recall.

3. **Input-typed dispatch and track-internal ranking**: Phase 1 scan dispatches by `InputType` (StructuredIdentifier → entropy track, NaturalRecall → salience track, Mixed → hybrid); ranking composes track-appropriate signals (entropy: source_namespace × claim_kind compatibility before literal precision via corpus rarity; salience: Σ-match + marker-profile overlap + temporal neighborhood). Σ-primary scan survives only as a ranking-layer special case within the salience track. Single-signal execution has structural blind spots regardless of track. Evidence mode composes as a track-internal secondary signal (tie-break + confidence), never as a filter; its absence is neutral.

4. **Narrative Qc presentation**: Phase 2 presents candidates as discussion narratives (origin → direction → outcome), not result summaries. Result-only presentation defeats recognition by forcing additional investigation.

5. **Guided recall orientation in Refine**: On Refine, present structured navigation through adjacent memory vectors with brief narratives — structured alternatives enable recognition in recall-deepening; open-ended questions shift cognitive burden back to the user.

6. **One candidate per cycle**: Present one highest-priority candidate per Phase 2 cycle — single-candidate presentation keeps recognition focus on a single identity decision.

7. **Convergence persistence and early exit**: Mode active until recall_complete, NullMatch after exhausted attempts, or user Esc; user recognition or rejection of a candidate is final for that candidate in the current session, and Esc is accepted immediately regardless of remaining attempts.

8. **Convergence evidence**: Present transformation trace (VagueRecall → enrichments → Candidate(recognized) → ClueVector_prose) before declaring recall_complete — convergence is demonstrated, not asserted. The SingleObvious Extension path folds this trace into its non-yielding inline emit (degenerate — a single candidate with no enrichments collapses the trace to VagueRecall → Candidate(recognized) → ClueVector_prose), satisfying this rule within the emit rather than via a separate Phase 3 step.

9. **Context-Question Separation**: Present narrative context, evidence, and adjacent vectors as text before the Constitution interaction; the interaction contains only the recognition question and options with differential implications. Embedding context inside the question field violates this invariant.

10. **NullMatch handoff diagnosis**: On NullMatch after exhausted probing, offer Aitesis handoff with accumulated trace and enumerate possible causes — lifecycle gap (SessionEnd did not fire), pre-store (session predates hypomnesis), missing extractor, or PartialExtract from corrupted source — giving actionable diagnosis. INDEX may lack entries while SSOT retains the information. A successful-scan-but-no-resumable-SSOT case (the recalled id is a fork/sidechain) is NOT a NullMatch — the scan succeeds on the substitute channel — and is handled as SidechainNoSSOT by parent back-trace (Rule 19), not by this NullMatch handoff.

11. **Probe-first NullMatch**: At least one Socratic probe enrichment precedes any NullMatch declaration — first scan returning zero → probe → enriched re-scan → NullMatch declaration only if still empty.

12. **Conditional Qc, separate Qs and Qc** *(Safeguard tier — revisitable as instruction-following improves)*: Phase 2 runs the Constitution Qc gate when candidates ≥ 2 OR confidence < high (Medium / Heavy). A high-confidence single candidate (SingleObvious) instead **absorbs Qc into the presentation**: the recognized context is emitted inline as Extension (no turn yield) with a divergence-only affordance, and convergence is immediate — silence / the user moving on constitutes recognition, only divergence is explicit. One dominant candidate collapses the recognition option set to a single option (the others are foils), so the interaction is relay, not a gate; this absorption is the sanctioned revision of this rule's own Safeguard-tier tag, motivated by observed binary-confirm abandonment friction, and it does not touch Qs. On Refine (always gated), Socratic probing (Qs) and recognition (Qc) run as two distinct Constitution interactions — Qs deepens recall context first, Qc verifies identity second.

13. **Cross-LOOP narrative persistence**: Narrative format and adjacent vector enrichment persist across LOOP iterations; subsequent attempts reference prior candidates and explain the differential.

14. **Framing-signal visibility**: Every gated Phase 2 presentation and Refine probe states the remaining recall-try budget and the candidate space still in scope as framing prose — the budget the user reasons with, not a numeric attempt fraction. The SingleObvious inline emit converges immediately, so attempt-budget framing is moot there; its only forward branch is the divergence affordance.

15. **Substrate non-coupling**: Phase prose names epistemic operations only — tool and path bindings belong exclusively to TOOL GROUNDING.

16. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language. A reader who cannot take in what was written stops reading and answers past it; the gap widens and the gate's matching passes in practice to the AI, so plain rendering is what keeps the recognition the user's own. SKILL.md formal-block vocabulary stays in the formal block. What the user reads is the action, observation, or question in their idiom. A term may be rendered differently for different readers and in different sessions — fitting the rendering to the reader in front of you is the point of doing it at all. Within one session it is held: the first rendering chosen for a term is that session's term, and switching to another one mid-session costs the reader precisely because the same partner set the first. What that guards is a switch the AI makes on its own: a reader who asks for a different rendering has replaced the term, and the new one is held from there, and a reader who switches language has moved the whole rendering, terms included. Preserve original wording only when the term itself is the subject of discussion, when quoting user-provided text, or when directly citing the source. Where a rendering would still leave the reader recalling something at first encounter, you may extend it with a brief situational anchor drawn from their own substrate — emit only when that recall would otherwise occur, and cite the substrate the anchor came from.
17. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
18. **Recalled context currency is not fidelity**: Recall constitutes identity (this WAS discussed or decided), not current-reality agreement (it still HOLDS). A candidate that is current in the store and correctly recognized may still be desynced from current reality — the recognition gate verifies identity, not fidelity. ClueVector_prose emits with a currency≠fidelity caveat; RecalledContext is re-verified against current state before commit and is not handed to downstream protocols as confirmed current context. Currency is the temporal sub-case of fidelity, not a substitute.
19. **Fork/sidechain resume integrity**: When a recalled id is a sidechain/fork with no top-level SSOT (SidechainNoSSOT — the scan succeeds on the substitute channel but no resumable main transcript ever existed), its own id is never offered as a `--resume` handle, because a fork `--resume` fails. The protocol back-traces the orchestrating parent (`backtrace_parent` → `parent_pointer`, `parent_cwd` — read deterministically from the fork's own capture, distinct from user-described Reorient) and offers the parent as the resumable candidate; when the parent's resumable record has aged out, the candidate is marked non-resumable and its recoverable artifacts (substitute log + memory) are surfaced instead of a broken command. Detection and back-trace are substrate-coupled and live in TOOL GROUNDING; the protocol essence names only the epistemic operation (Rule 15).
20. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).

21. **Gate integrity** (Safeguard tier): The defined option set is presented intact — option injection/deletion/substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.

22. **Seam relay on declared continuation**: when a user-declared chain or a composition edge this SKILL.md declares (the `/recollect ∘ /inquire` COMPOSITION edge) names the next protocol, the between-protocol seam after Mode Deactivation is relay (Extension) — proceed directly, citing the settling source (the chain declaration or the named composition edge). This governs only the seam BETWEEN protocols; every Constitution gate inside this protocol and the next fires unchanged, and the user can redirect at any turn.
23. **Form feedback**: Silence about form is not evidence about form. Too dense fails quietly — the reader skims, answers past it, stops — while too plain fails out loud, so the complaints that arrive come from one side only. Density therefore does not carry over from the previous round: each round takes it from what this request asked for, while a statement about form does carry over until it is countermanded. When the reader reports a symptom rather than naming a form — "this is hard to follow", "too long", "I can't find the conclusion" — that symptom is the form instruction. Read it and change the form rather than asking which form they want; naming one is the recall this rule exists to remove. What this reaches is whatever the active protocol leaves open in how a round is composed — its density, its ordering, its length. What a protocol pins stays pinned: a question re-surfaced as itself, an artifact re-presented as generated, a quotation carried verbatim, a presentation order the protocol fixes, a cadence it caps. Change what surrounds a pinned element rather than the element itself. Say in one line what changed, and where the complaint landed on a pinned element, say that it stays and why.
