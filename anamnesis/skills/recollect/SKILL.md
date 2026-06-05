---
name: recollect
description: "Resolve vague recall into recognized context through AI-guided contextual scan and user-validated recognition."
user_invocable: true
---

# Anamnesis Protocol

Resolve vague recall into recognized context through AI-guided contextual scan and user-validated recognition. Type: `(RecallAmbiguous, AI, RECOGNIZE, VagueRecall) → RecalledContext`.

## Definition

**Anamnesis** (ἀνάμνησις): A dialogical act of resolving vague recall into recognized context, where AI detects empty intention, scans hypomnesis and memory stores with contextual awareness, presents narrative candidates for Socratic recognition, and facilitates guided recall orientation when initial candidates do not match — grounded in user-constituted identification rather than keyword retrieval.

```
── FLOW ──
Anamnesis(V) → Detect(V) →
  not-empty_intention(V): skip → deactivate
  empty_intention(V): Classify(V, Σ) → InputType → Dispatch(InputType) → Track ∈ {entropy, salience, hybrid} →
    Scan_{Track}(Store, trace(V)) → Rank(C[]) →
    |C[]| = 0 ∧ attempts = 0: Probe(V, Σ) → Qs(probe) → Stop → H → enrich(V, H) → re-scan
    |C[]| = 0 ∧ attempts > 0: NullMatch → inform(V, Σ) → deactivate
    |C[]| > 0: backtrace_parent(c) ∀ c ∈ C[] : fork_marker(c) → parent_pointer, parent_cwd   -- deterministic: a fork candidate's parent is recoverable from its own record, not inferred (mechanism in TOOL GROUNDING; ≠ user-described Reorient)
               Qc(C[top], evidence, framing) → Stop → R →
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
  → present(candidate, Socratic)         -- Socratic candidate presentation
  → recognize(candidate, user)           -- synthesis of identification (Husserl CM §§38-39)
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
Store            = SSOT ⊕ INDEX               -- see ── STORE TOPOLOGY ── block
Scan             = (Store, Track, RecallTrace) → List(Candidate)
Candidate        = { session_id: Optional(SessionId),
                     cwd: Optional(String),
                     topic: String,
                     keywords: Set(String),
                     fingerprint: Prose,
                     cross_refs: List(Anchor),
                     confidence: ∈ {low, medium, high},
                     fork_marker: Bool,                          -- true ⇒ the id is a sidechain/fork with no top-level SSOT (SidechainNoSSOT); its own id is not a valid resume handle. Invariants: fork_marker = false ⇒ parent_pointer = Null ∧ parent_cwd = Null ; parent_pointer = Null ⇒ parent_cwd = Null (parent_cwd requires parent_pointer; parent_pointer present with parent_cwd = Null is valid — parent identified but its cwd is unknown)
                     parent_pointer: Optional(SessionId),        -- orchestrating parent session for a fork candidate, read directly from the fork's own record; the resumable handle when the parent's top-level SSOT still exists (Null ⇒ parent record absent → non-resumable)
                     parent_cwd: Optional(String),               -- parent session's working directory, paired with parent_pointer to build the parent resume handle (Null ⇒ parent record absent, OR parent identified but its cwd metadata is unknown — parent transcript predates cwd capture)
                     resumption_hint: Optional(String) }
Anchor           = String   -- opaque: memory path, URL, session ID, doc path
Prose            = String   -- source-agnostic NL description
Rank             = List(Candidate) → List(Candidate)
Probe            = (V, Σ) → List(SocraticQuestion)
SocraticQuestion = { dimension: ∈ {temporal, associative, contextual}, question: String }
R                = Recognition ∈ {Recognize(Candidate), Refine, Reorient(description)}
H                = Hint     -- answer from Socratic probe gate (Qs)
ClueVector_prose = String
RecalledContext  = session text containing ClueVector_prose
               -- recall establishes IDENTITY (this WAS discussed/decided), not current-reality FIDELITY (it still HOLDS). Store-currency (the INDEX entry is fresh) ⊂ fidelity-to-current-reality: a recalled decision may be superseded, a recalled path renamed, a recalled convention revised. RecalledContext describes a PAST state; downstream consumers re-verify against current state before commit rather than treating it as confirmed current context.
NullMatch        = predicate; canonical definition in ── CONVERGENCE ──
Phase            ∈ {0, 1, 2, 3}

── V-BINDING ──
bind(V) = explicit_arg ∪ colocated_expr ∪ prev_user_turn
Priority: explicit_arg > colocated_expr > prev_user_turn

/recollect "text"           → V.trace = extract_trace("text", Σ)
"recall... topic"           → V.trace = extract_trace(text before trigger, Σ)
/recollect (alone)          → V.trace = extract_trace(previous user message, Σ)

Edge cases:
- Multiple vague references: bind to first, note others
- Re-invoke after NullMatch: fresh V, no carryover
- Composition (/recollect * /inquire): V from Anamnesis, Aitesis receives ClueVector_prose via session text

── PHASE TRANSITIONS ──
Phase 0: V → Detect(V) → empty_intention(V)?                    -- trigger (silent)
           → Classify(V, Σ) → InputType → Track                  -- dispatch (silent)
Phase 1: V → Scan_{Track}(Store, trace(V)) → Rank(C[]) → C[ranked]  -- track-dispatched scan + rank [Tool]
           backtrace_parent(c) ∀ c ∈ C[ranked] : fork_marker(c) → parent_pointer, parent_cwd  -- fork (SidechainNoSSOT): parent recovered deterministically from the candidate's own record [Tool]
           |C[ranked]| = 0 ∧ attempts = 0 → Probe(V, Σ) → Qs → Stop → H → enrich(V, H) → Phase 1
           |C[ranked]| = 0 ∧ attempts > 0 → NullMatch → inform → deactivate
Phase 2: C[top] → Qc(C[top], evidence, framing) → Stop → R    -- recognition gate [Tool]
Phase 3: R → integrate(R, V, Σ) →                                -- integration (sense)
           Recognize(c) → ClueVector_prose(c) → emit → converge
           Refine → Probe(V, Σ) → Qs(probe) → Stop → H          -- Socratic probing [Tool]
                  → enrich(V, H) → Phase 1
           Reorient(d) → rebind(V, d, Σ) → Phase 1               -- orthogonal re-scan (sense)

── LOOP ──
Phase 1 → Phase 2 → Phase 3 →
  Recognize: converge
  Refine: Socratic probing → enrich → Phase 1
  Reorient: rebind V with orthogonal description → Phase 1

Max 3 recall attempts. Exhausted: surface best candidate → deactivate.
Convergence evidence: (VagueRecall → [enrichments] → Candidate(recognized) → ClueVector_prose).

── CONVERGENCE ──
recall_complete = Recognize(c) for some c ∈ C[]
NullMatch = |C[]| = 0 ∧ attempts > 0 ∧ (attempts = max ∨ enrichments exhausted)
progress(Σ) = attempts: N/max, enrichments: N, candidates_presented: N

── TOOL GROUNDING ──
-- Realization binding (Claude Code substrate), non-normative w.r.t. protocol essence — see ── SUBSTRATE AGNOSTICISM ──; any substrate satisfying morphism laws realizes Anamnesis.
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
-- Store binding:
--   {slug} = dirname(transcript_path) — Claude Code's project partition identifier
--   SSOT             ↦ ~/.claude/projects/{slug}/*.jsonl                                 (session JSONL, append-only)
--   INDEX_semantic   ↦ ~/.claude/projects/{slug}/hypomnesis/{session-id}/                (per-session recall index from SessionEnd/PreCompact)
--   INDEX_substitute ↦ ~/.claude/projects/{slug}/hypomnesis/subagent/{agent_id}.jsonl    (substitute channel capture from SubagentStop)
--   memory           ↦ ~/.claude/projects/{slug}/memory/                                 (user-curated insights)
--   slug-partitioned: prevents cwd-scattered INDEX; cross-cwd /recollect reaches one canonical location
-- Candidate source binding: `Candidate.session_id` ← INDEX entry frontmatter `session_id`; `Candidate.cwd` ← INDEX entry frontmatter `cwd` (Optional — absent for entries written before cwd capture was implemented)
-- Fork/sidechain binding (SidechainNoSSOT): `Candidate.fork_marker = true` ⇐ the recalled id appears as an `agent_id` in INDEX_substitute (~/.claude/projects/{slug}/hypomnesis/subagent/{agent_id}.jsonl, appended by the SubagentStop hook) AND has no sibling top-level SSOT ~/.claude/projects/{slug}/{agent_id}.jsonl of its own — the fork's turns live only in the parent record + this capture, so `claude --resume <agent_id>` has no transcript to resume
-- Parent back-trace (`backtrace_parent` ↦ `Candidate.parent_pointer`, `Candidate.parent_cwd`): deterministic, not heuristic — the substitute capture entry records `session_id` = the orchestrating parent's session id (the SubagentStop payload field), so `parent_pointer ← capture.session_id` is a direct read. The capture lives under the parent's slug by construction ({slug} = dirname of the parent transcript), so the parent is always same-slug; cross-slug search is never needed. Resumability: if the parent's top-level SSOT ~/.claude/projects/{slug}/{parent_pointer}.jsonl still exists, `parent_pointer` is set and `parent_cwd ← that transcript's `cwd` field` when present (`parent_cwd = Null` if the parent transcript predates cwd capture — parent identified but cwd unknown); the full handle `cd <parent_cwd> && claude --resume <parent_pointer>` requires both components. If the parent SSOT has aged out, `parent_pointer = parent_cwd = Null` (non-resumable → surface the capture's recoverable artifacts). The fork's native subagent transcript (~/.claude/projects/{slug}/{parent_pointer}/subagents/agent-{agent_id}.jsonl) may be cleaned up; the durable parent link is the capture's `session_id`.
Phase 0 Detect      (sense)    → Internal analysis
Phase 0 Classify    (sense)    → Internal analysis (InputType detection from V + Σ)
Phase 1 Scan_entropy  (observe)  → Read, Grep (literal match over SSOT ∪ INDEX)
Phase 1 Scan_salience (observe)  → Read, Grep, Glob (MarkerProfile match over INDEX; SSOT fallback on degraded_scan)
Phase 1 Scan_hybrid   (observe)  → union of above
Phase 1 Rank        (sense)    → Internal analysis (conditional: haiku scoring for large candidate sets)
Phase 1 backtrace_parent (observe) → Read (fork candidate only: read the orchestrating parent's session_id directly from the fork's substitute capture, then check parent SSOT existence for resumability; deterministic and citable to the capture entry — hence (observe)/relay, entropy→0; read-only)
Phase 2 Qc          (constitution)     → present (narrative Socratic candidate; mandatory)
Phase 3 integrate   (track)    → Internal state update
Phase 3 Probe       (sense)    → Internal (gap detection)
Phase 3 Qs          (constitution)     → present (Socratic probing with structured navigation; mandatory on Refine)
Phase 3 emit        (extension)    → TextPresent+Proceed (ClueVector_prose)
converge            (extension)    → TextPresent+Proceed (convergence trace)

── MODE STATE ──
Λ = { phase: Phase, V: VagueRecall,
      candidates: List(Candidate), presented: Set(Candidate),
      recognized: Optional(Candidate),
      probes: List(SocraticQuestion),
      attempts: Nat, active: Bool, cause_tag: String }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
*: /recollect ∘ /inquire — RecognizedContext → ClueVector_prose seeds Aitesis as input substrate; on NullMatch, the accumulated recall trace seeds Aitesis to search SSOT directly (INDEX may lack entries while SSOT retains the information).

── ENTROPY EXTRACTION ──
extract : Session → Set(IdentifierTuple)
laws:
  identity:          extract(∅) = ∅
  locality:          extract(s₁ ⊔ s₂) = extract(s₁) ⊔ extract(s₂)          -- disjoint sessions
  compositionality:  extract(s) = ⋃ᵢ extractor_i(s)                         -- plugin-summable

precision(t, corpus) = 1 / (1 + |occ(t, corpus \ {t.source})|)
reject(t, θ) ≡ precision(t, corpus) < θ                                    -- derivable, not enumerated
claim_kind(trace) = expected identifier category implied by the recall trace
compatible_anchor(t, trace) ≡ claim_kind(trace) ∈ AuthorizedClaimKinds(source_namespace(t))
  where AuthorizedClaimKinds(ns) = { ck : (ns, ck) ∈ AuthorizedPairs }   -- a namespace determines the claim kinds it can anchor
        AuthorizedPairs = ⋃ᵢ extractor_i.authorized_pairs                -- each extractor declares the (source_namespace, claim_kind) pairs it grounds; the registry is the explicit witness
  -- the witness is defined LOCALLY (extractor registry), independent of Aitesis's reflexive authorizes: analogous structure, different concern (namespace → claim-kind authorization, not evidence-channel authorization)
  -- the tuple carries source_namespace only; claim_kind(t) is not stored, removing the unused-field inconsistency and matching what the regex writer can materialize

extractor registry:
  core (bootstrap) = { URL_literal, PathRef_literal, PR_literal, Issue_literal, Commit_literal, SessionID_literal }
                     -- semantic categories: URL_path group {URL_literal, PathRef_literal},
                     --                      ExplicitRef group {PR_literal, Issue_literal, Commit_literal},
                     --                      Citation group {SessionID_literal}  -- UUIDs as session citations
                     -- each extractor declares the (source_namespace, claim_kind) it authorizes for entropy anchoring (Anamnesis-local canonical values, self-contained — NOT a shared cross-protocol vocabulary):
                     --   URL_literal → (url, url_reference);      PathRef_literal → (fs_path, path_reference)
                     --   PR_literal → (github_pr, pull_request); Issue_literal → (github_issue, issue);  Commit_literal → (git_commit, commit)
                     --   SessionID_literal → (session, session_citation)
  plugin           = { domain-specific extractors conforming to laws }

dispatch binding: InputType = StructuredIdentifier → Track = entropy

── SALIENCE MARKERS ──
detect : Session × Anchor? → MarkerProfile     -- Anchor? = optional ISO date for temporal normalization (e.g., session start)
categories: { coinage, actor, temporal, emotional, cognitive, singularity }   -- working hypothesis (Emergent admitted)

semantic invariants:
  traceability:    detect(s) contains only markers grounded in SSOT session content or normalized from session-anchored context
  boundedness:     ∀c ∈ categories, |detect(s).c| ≤ category_limit
  stability:       repeated detect(s) under the same extractor version should preserve recall-relevant category intent, but exact set equality is not required (idempotence not claimed — LLM-extracted categories are non-deterministic; stability subsumes intent-level repeatability)
  locality*:       detect is applied per session; cross-session comparison is ranking-layer only, except corpus-statistical coinage
  monotonicity*:   adding content may refine, normalize, merge, or reject prior candidate markers; exact set inclusion is not guaranteed
  -- Provisional invariant relaxation (exact laws → starred semantic invariants) justified by 88.5% noise rate in MarkerProfile.temporal corpus-wide audit (2026-05-04); the coinage formula below remains deterministic and is unaffected.

coinage(s, corpus, θ) = { t ∈ s : salience_precision(t, s, corpus) ≥ θ }
  where salience_precision(t, s, corpus) = |occ(t, s)| / (1 + |occ(t, corpus \ {s})|)
  -- Zipf deviation: rare in corpus, repeated within session (low-frequency high-entropy)

dispatch binding: InputType = NaturalRecall → Track = salience
                  InputType = Mixed → Track = hybrid    -- union scan: entropy ∪ salience

── STORE TOPOLOGY ──
Store = SSOT ⊕ INDEX ; memory/ = realization-layer adjunct (non-scanned, user-curated)
  SSOT             = authoritative session record (complete, append-only)
  INDEX_semantic   = per-session semantic extraction (IdentifierTuples, MarkerProfile?, Coinage, narrative) -- derived from SSOT, rebuildable, lossy; MarkerProfile? is conditional on successful Haiku extraction + validation (markers.md absent on extraction error or schema-validation failure)
  INDEX_substitute = substitute channel raw message log -- append-only, primary capture, authoritative (loss non-recoverable)

scan_{Track} : (Store, Trace) → List(Candidate)
  scan_entropy(Store, trace)    = exact-match over IdentifierTuples where compatible_anchor(t, trace) (SSOT ∪ INDEX_semantic)
                                  ∪ literal-id match over INDEX_substitute origin ids (a sidechain/derived id carries no IdentifierTuple, so a structured id is matched against the substitute channel directly; a hit whose id has no sibling top-level SSOT is the SidechainNoSSOT precondition)
                                -- structural rejection (compatible_anchor filters ALL literal matches, distinct from low-precision miss): incompatible literals do NOT anchor but are retained in the recall trace as evidence; the scan routes to the salience track (hybrid) or NullMatch₁ recovery with the incompatibility noted — never a silent zero-candidate return
  scan_salience(Store, trace)   = MarkerProfile match (ranked by Σ)        -- INDEX-accelerated; SSOT fallback
  scan_hybrid(Store, trace)     = scan_entropy ∪ scan_salience

degraded_scan: INDEX_semantic = ∅ ⟹ scan'(SSOT, Track, trace) ∪ literal-id match over INDEX_substitute origin ids   -- SSOT guarantees semantic recall; cold start falls back to SSOT directly. INDEX_substitute is a separate primary channel (not derived from INDEX_semantic), so the sidechain/derived-id match persists under degraded mode — SidechainNoSSOT stays reachable when INDEX_semantic is empty
  -- partial INDEX (e.g., MarkerProfile? = ∅ while IdentifierTuples / Coinage / narrative present) is a normal mode and does NOT trigger total fallback; scan_salience returns empty for the missing component and ranking degrades gracefully
  -- INDEX_substitute loss non-recoverable (SSOT lacks subagent-channel messages); precondition for Cold-Start invariant (see Verification)

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
FalseAnchor       : extract(s) contains t with high precision but t ≠ recall_target
                    -- cause: precision threshold locally calibrated but semantically wrong, or source_namespace does not authorize this recall claim's kind
                    -- detection: Qc Recognize=false despite scan_entropy match

ExtractorLacking  : recall_target ∈ s ∧ ∄ extractor_i : recall_target ∈ extractor_i(s)
                    -- cause: domain-specific extractor absent from registry
                    -- detection: NullMatch on scan_entropy ∧ user can cite literal

PartialExtract    : extract/detect produces well-formed but semantically partial INDEX from corrupted/truncated source
                    -- cause: continue-on-error parser tolerates malformed lines; anomalous shape logged but not write-gated
                    -- detection: invisible to reader without schema version field or observability log surface

SidechainNoSSOT   : scan_entropy(Store, trace) ≠ ∅ via INDEX_substitute ∧ no top-level SSOT for the recalled id (the id is a sidechain/derived record)
                    -- cause: the recalled id is a sidechain/derived record whose turns live in the originating record + the substitute channel; no top-level SSOT for the id ever existed — distinct from NullMatch₁ (pre-store/lifecycle gap): here the scan SUCCEEDS on the substitute channel, only the top-level SSOT is absent by design
                    -- detection: the recalled id matches a substitute-channel record with no sibling top-level SSOT of its own (substrate mechanism in TOOL GROUNDING)
                    -- recovery: the id is not independently resumable (no top-level record of its own); read the orchestrating parent from the substitute record (backtrace_parent → parent_pointer, parent_cwd) and offer the parent as the resumable candidate; when the parent's record has aged out, mark non-resumable and surface the recoverable artifacts (substitute record + memory)

NullMatch₁        : scan_entropy(Store, trace) = ∅ ∧ InputType = StructuredIdentifier
                    -- cause: literal absent from SSOT/INDEX (pre-store, lifecycle gap)
                    -- recovery: offer Aitesis handoff with accumulated trace

NullMatch₂        : scan_salience(Store, trace) = ∅ ∧ InputType = NaturalRecall
                    -- cause: profile too vague or target session lacks distinctive markers
                    -- recovery: Socratic probe enrichment → Phase 1 re-scan

MutualNull        : scan_entropy = ∅ ∧ scan_salience = ∅ on Track = hybrid
                    -- structural risk: recall target genuinely absent from Store
                    -- action: NullMatch pathway with full scope disclosure (principal failure mode)
```

## Core Principle

**Recognition over Retrieval**: When a user has a vague memory of prior discussion or decision, verify the match between their recalled context and historical context through cognitive assistance — presenting narrative candidates for user recognition, rather than returning search results. The protocol function is context identity verification (Husserl's synthesis of identification: empty intention meets fulfilled re-presentation), not information retrieval. Identity verification is not current-reality verification: recognizing that a context WAS discussed does not establish that it still HOLDS — recalled context is current in the store yet may be desynced from current reality, so it carries a currency≠fidelity caveat and is re-verified before commit.

The scan finds candidates; the narrative Qc enables recognition; the user constitutes the identity match. Three constitutive distinctions from search/retrieval:

1. **Input-typed dispatch**: V's input type determines the scan track. Structured identifiers (URLs, explicit references, citations) route to the entropy track where high-precision literal matching dominates; natural recall (temporal hedges, existence claims, vague topical references) routes to the salience track where marker profiles and session context (Σ) rank candidates. Treating every input as Σ-primary keyword query has structural blind spots; track-appropriate scanning resolves them.

2. **Narrative presentation**: Candidates are presented as discussion narratives (question asked → direction taken → outcome reached), not as result summaries. Narrative enables recognition by providing the contextual story that triggers identification; result-only summaries require additional investigation that defeats the protocol's purpose.

3. **Guided recall orientation on Refine**: When initial candidates do not match, the protocol facilitates structured recognitive orientation — presenting concrete navigation through adjacent memory vectors rather than open-ended questions. The user's vague memory and the stored context are brought into productive contact through specific alternatives that enable recognition.

## Mode Activation

### Activation

AI detects empty intention in user expression (Layer 2, silent Phase 0) OR user calls `/recollect` (Layer 1, always available). Recognition always requires user interaction at Phase 2 gate. On direct `/recollect`, bind `V` from current/recent context; if none recoverable, request the recall target before Phase 0.

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

**Action**: At Phase 2, present narrative candidate for user recognition via Cognitive Partnership Move (Constitution).
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

**Cross-session enrichment**: Prior recall indices persisted in the hypomnesis store provide starting points for Phase 1 contextual scan — previously successful recall paths may guide initial search scope. This is a heuristic input that may bias detection toward previously observed patterns; constitutive judgment remains with the user.

**Skip**:
- User provides specific reference (file path, session ID, issue number, exact quote)
- Same recall target already resolved in current session (session immunity)
- No empty intention — user is asking for new information, not recalling prior context (defers to Aitesis)
- User explicitly declines recall assistance
- Phase 0 determines the user's expression needs other handling, not recall

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| recall_complete (Recognize) | Emit ClueVector_prose; proceed with the recognized context as recalled past context requiring re-verification against current state before commit (not confirmed current context) |
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

1. **Track-dispatched scan strategy**:
   - **entropy track** (`InputType = StructuredIdentifier`): execute `scan_entropy` over `SSOT ∪ INDEX` — literal match on `IdentifierTuple.literal`, then apply `compatible_anchor(t, trace)` before the match can anchor ranking; precision-thresholded compatible identifiers win. URL path literals, explicit references, citation tokens dominate only within their authorized source_namespace × claim_kind. A structured id with no IdentifierTuple is additionally matched literally against `INDEX_substitute` origin ids (sidechain/derived records) — a hit whose id has no sibling top-level SSOT is the SidechainNoSSOT precondition (parent back-trace; see Phase 3 emission).
   - **salience track** (`InputType = NaturalRecall`): execute `scan_salience` over `INDEX` (SSOT fallback on degraded_scan) — match against `MarkerProfile` (coinage / actor / temporal / emotional / cognitive / singularity); session context (Σ) supplies ranking signal within this track.
   - **hybrid track** (`InputType = Mixed`): union of entropy and salience results.

   Tool realization (Claude Code substrate): `Read/Grep/Glob` over the Store binding declared in TOOL GROUNDING. Track-internal ranking composes track-appropriate signals — entropy track: source-namespace / claim-kind compatibility gates anchoring, then literal precision (corpus rarity) dominates; salience track: Σ-match + marker-profile overlap + temporal neighborhood + adjacent vector discovery.

2. **Adaptive behavior based on trace ambiguity**:
   - **High ambiguity**: Present hypomnesis store overview as orientation text (extension) — surface the store's structure and major topic clusters so the user can orient their recall. This is informational, not a gated interaction; the overview provides context for the subsequent targeted scan.
   - **Moderate ambiguity**: Broaden scan scope to include semantic similarity and temporal neighborhood.
   - **Low ambiguity**: Direct targeted scan using the dispatched track.

3. **Rank candidates**: Ranking is track-internal. On the entropy track, compatible anchors are ranked by precision (low occurrence in corpus); incompatible literal matches remain evidence in the trace but do not become anchors. On the salience track, Σ-match + marker-profile overlap + temporal proximity compose the weight. Each candidate carries:
   - Its core topic and narrative summary
   - Adjacent topics from the same session or time period
   - Confidence level based on trace alignment

4. If `|C[]| = 0`: NullMatch pathway. Inform user what was searched and not found. Before declaring NullMatch, attempt at least one Socratic probe enrichment. After enrichment attempts exhausted: surface the search scope summary and the accumulated recall trace (keywords, temporal signals, user hints from probing), then offer Aitesis handoff — the recall INDEX (hypomnesis/) may lack the entry (lifecycle gap: SessionEnd did not fire; or pre-store: session predates hypomnesis implementation), but the SSOT (session JSONL) may still contain the information. The accumulated trace from Anamnesis probing becomes context seed for Aitesis to search SSOT directly.

**Scope restriction**: Investigation uses Read, Grep, Glob exclusively.

### Phase 2: Narrative Recognition (Constitution)

**Present** the highest-priority candidate as a discussion narrative for user recognition via Cognitive Partnership Move (Constitution).

**Selection criterion**: Choose the candidate whose recognition would maximally resolve the user's empty intention. When priority is equal, prefer the candidate with richer narrative context and adjacent vectors.

**Narrative presentation format**:

Present the candidate as narrative text — the discussion's story, not just its result:
- **When/Where**: Temporal and spatial context — when the discussion happened, expressed as temporal distance from the current session, plus which session or document. Use short session reference in narrative for readability.
- **Source**: Provenance of the stored context — whether it was user-inscribed via a session-text utility or auto-generated (SessionEnd hook narrative)
- **Origin**: What prompted the discussion — the question or situation that started it
- **Direction**: How the discussion developed — what path was taken, what was explored
- **Outcome**: What was decided, produced, or concluded
- **Session**: Full session ID for identification and `claude --resume` verification (e.g., `session: abc12345-def6-7890-ghij-klmnopqrstuv`). Narrative uses short reference. For a non-fork candidate this id is the resumable identifier; for a fork candidate (`fork_marker = true`) it identifies the recognized session but is not itself resumable — the resumable handle is the back-traced parent (see Resume).
- **Resume**: Copy-paste-ready invocation pairing the originating cwd with the session ID — `cd <cwd> && claude --resume <session_id>`. Claude Code resolves the project slug from invocation cwd, so both components are required; emit only the literal command, no narrative wrapper. Omit this field only when `Candidate.cwd` is absent or empty, and surface the omission to the user. **Fork candidate** (`fork_marker = true`): the fork id is not a valid resume handle (a fork has no top-level transcript, so `--resume <fork_id>` fails). When the parent was back-traced and both components are present (`parent_pointer` and `parent_cwd` non-empty), emit the parent's command instead — `cd <parent_cwd> && claude --resume <parent_pointer>` — and note it resumes the orchestrating parent, not the fork. When `parent_pointer` is present but `parent_cwd` is absent (parent identified but its cwd is unknown), omit the copy-paste command and surface the parent session id with a note to resume from the parent's own project directory. When the parent was not recovered (`parent_pointer = Null`), mark the candidate non-resumable and surface the recoverable artifacts (the substitute log path + any memory) rather than a broken command.
- **Adjacent**: Other topics discussed nearby in the same time period — for Refine orientation
- **Framing**: how many recall tries remain before the cap, and the size of the candidate space still in scope — stated as the budget you reason with, not a numeric attempt fraction

Then **present**:

```
Does this match the discussion you are recalling?

Options:
1. **Recognize** — this is the discussion I was thinking of
2. **Refine** — the adjacent topics listed above may be closer to your memory
```

Other is always available — maps to `Reorient`: user describes a fundamentally different recall dimension that neither Recognize nor Refine captures (e.g., recalling a concept rather than a discussion, an external reference rather than a session). The protocol re-characterizes V with the new description and re-scans from the orthogonal angle.

### Phase 3: Integration

After user response:

1. **Recognize(c)**: Mark candidate as recognized. Emit ClueVector_prose — natural language rendering of the recognized context to session text. ClueVector_prose includes: session reference (short form in narrative, full session ID for `--resume` verification), topic summary with narrative, key cross-references (memory paths, issue numbers, document pointers), and a resume handle built per the fork-aware rule: when the candidate is **not** a fork and `Candidate.cwd` is present and non-empty, emit a literal `cd <cwd> && claude --resume <session_id>` line (the project slug derives from invocation cwd, so the command is the resumable handle); when the candidate **is** a fork (`fork_marker = true`) with both `parent_pointer` and `parent_cwd` present, emit the back-traced parent's `cd <parent_cwd> && claude --resume <parent_pointer>` line (resuming the orchestrating parent, since the fork id itself is non-resumable); when `parent_pointer` is present but `parent_cwd` is absent, omit the copy-paste command and note the parent session id with the cwd-unknown caveat; when the parent was not recovered (`parent_pointer = Null`), omit the command, mark the context non-resumable, and surface the recoverable artifacts (substitute log path + memory); when `Candidate.cwd` is absent or empty for a non-fork candidate, omit the line and note the omission in the prose. This prose enters the session text and is naturally readable by any downstream protocol via Session Text Composition. ClueVector_prose carries a currency≠fidelity caveat: it states that the context was recognized as a past discussion or decision, not that the recalled content is verified against current reality — downstream consumers (e.g., Aitesis composition) treat it as recalled-and-requiring-re-verification, not as confirmed current context.

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
| Light | High specificity trace, single obvious candidate | Abbreviated narrative (origin + outcome) + gate with Recognize default |
| Medium | Moderate specificity, 2-3 candidates in scope | Full narrative + adjacent vectors in Refine option |
| Heavy | Low specificity, Refine path expected, high ambiguity trace | Full narrative + adjacent vectors + Socratic probing with structured navigation + hypomnesis overview on initial scan |

## Rules

1. **AI-guided detection, user-constituted recognition**: AI detects empty intention, scans stores, and presents narrative candidates as recognition options; user identification via Cognitive Partnership Move (Constitution) at Phase 2 constitutes the identity match. Detection, presentation, and constitution are separate acts — AI detection is implicitly confirmed when the user engages with recognition (Phase 2 response, not Esc).

2. **Recognition over Retrieval**: Present structured narrative options with anticipatable post-selection state (Recognize / Refine / Reorient) — Constitution interaction requires turn yield before proceeding; recognition options enable user evaluation, not blank-canvas recall.

3. **Input-typed dispatch and track-internal ranking**: Phase 1 scan dispatches by `InputType` (StructuredIdentifier → entropy track, NaturalRecall → salience track, Mixed → hybrid); ranking composes track-appropriate signals (entropy: source_namespace × claim_kind compatibility before literal precision via corpus rarity; salience: Σ-match + marker-profile overlap + temporal neighborhood). Σ-primary scan survives only as a ranking-layer special case within the salience track. Single-signal execution has structural blind spots regardless of track.

4. **Narrative Qc presentation**: Phase 2 presents candidates as discussion narratives (origin → direction → outcome), not result summaries. Result-only presentation defeats recognition by forcing additional investigation.

5. **Guided recall orientation in Refine**: On Refine, present structured navigation through adjacent memory vectors with brief narratives — structured alternatives enable recognition in recall-deepening; open-ended questions shift cognitive burden back to the user.

6. **One candidate per cycle**: Present one highest-priority candidate per Phase 2 cycle — single-candidate presentation keeps recognition focus on a single identity decision.

7. **Convergence persistence and early exit**: Mode active until recall_complete, NullMatch after exhausted attempts, or user Esc; user recognition or rejection of a candidate is final for that candidate in the current session, and Esc is accepted immediately regardless of remaining attempts.

8. **Convergence evidence**: Present transformation trace (VagueRecall → enrichments → Candidate(recognized) → ClueVector_prose) before declaring recall_complete — convergence is demonstrated, not asserted.

9. **Context-Question Separation**: Present narrative context, evidence, and adjacent vectors as text before the Constitution interaction; the interaction contains only the recognition question and options with differential implications. Embedding context inside the question field violates this invariant.

10. **NullMatch handoff diagnosis**: On NullMatch after exhausted probing, offer Aitesis handoff with accumulated trace and enumerate possible causes — lifecycle gap (SessionEnd did not fire), pre-store (session predates hypomnesis), missing extractor, or PartialExtract from corrupted source — giving actionable diagnosis. INDEX may lack entries while SSOT retains the information. A successful-scan-but-no-resumable-SSOT case (the recalled id is a fork/sidechain) is NOT a NullMatch — the scan succeeds on the substitute channel — and is handled as SidechainNoSSOT by parent back-trace (Rule 19), not by this NullMatch handoff.

11. **Probe-first NullMatch**: At least one Socratic probe enrichment precedes any NullMatch declaration — first scan returning zero → probe → enriched re-scan → NullMatch declaration only if still empty.

12. **Mandatory Qc, separate Qs and Qc** *(Safeguard tier — revisitable as instruction-following improves)*: Phase 2 Constitution interaction (Qc recognition) runs for every cycle including single high-confidence candidates — synthesis of identification is constitutive; confidence governs intensity (Light/Medium/Heavy), not whether the gate runs. On Refine, Socratic probing (Qs) and recognition (Qc) run as two distinct Constitution interactions — Qs deepens recall context first, Qc verifies identity second.

13. **Cross-LOOP narrative persistence**: Narrative format and adjacent vector enrichment persist across LOOP iterations; subsequent attempts reference prior candidates and explain the differential.

14. **Framing-signal visibility**: Every Phase 2 presentation states the remaining recall-try budget and the candidate space still in scope as framing prose — the budget the user reasons with, not a numeric attempt fraction.

15. **Substrate non-coupling**: Phase prose names epistemic operations only — tool and path bindings belong exclusively to TOOL GROUNDING.

16. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
17. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
18. **Recalled context currency is not fidelity**: Recall constitutes identity (this WAS discussed or decided), not current-reality agreement (it still HOLDS). A candidate that is current in the store and correctly recognized may still be desynced from current reality — the recognition gate verifies identity, not fidelity. ClueVector_prose emits with a currency≠fidelity caveat; RecalledContext is re-verified against current state before commit and is not handed to downstream protocols as confirmed current context. Currency is the temporal sub-case of fidelity, not a substitute.
19. **Fork/sidechain resume integrity**: When a recalled id is a sidechain/fork with no top-level SSOT (SidechainNoSSOT — the scan succeeds on the substitute channel but no resumable main transcript ever existed), its own id is never offered as a `--resume` handle, because a fork `--resume` fails. The protocol back-traces the orchestrating parent (`backtrace_parent` → `parent_pointer`, `parent_cwd` — read deterministically from the fork's own capture, distinct from user-described Reorient) and offers the parent as the resumable candidate; when the parent's resumable record has aged out, the candidate is marked non-resumable and its recoverable artifacts (substitute log + memory) are surfaced instead of a broken command. Detection and back-trace are substrate-coupled and live in TOOL GROUNDING; the protocol essence names only the epistemic operation (Rule 15).
