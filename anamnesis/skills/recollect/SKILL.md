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
    |C[]| > 0: Qc(C[top], evidence, progress) → Stop → R →
      Recognize(c): recall_complete(c) → emit(ClueVector_prose(c)) → converge
      Refine: Probe(V, Σ) → Qs(probe) → Stop → H → enrich(V, H) → re-scan
      Reorient(d): rebind(V, d, Σ) → Phase 1                 -- orthogonal dimension shift

── MORPHISM ──
VagueRecall
  → detect(empty_intention)              -- recognize vague recall state
  → classify(input_type)                 -- InputType ∈ {StructuredIdentifier, NaturalRecall, Mixed}
  → dispatch(input_type)                 -- Track ∈ {entropy, salience, hybrid}
  → scan(Store, Track, recall_trace)     -- track-specific scan (see STORE TOPOLOGY)
  → rank(candidates, recall_trace)       -- order by relevance
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
IdentifierTuple  = { literal: String, source: Source, precision: ℝ[0,1] } -- entropy-track anchor
MarkerProfile    = { coinage: Set(Token), actor: Set(Entity),
                     temporal: Set(TimeRef), emotional: Set(Marker),
                     cognitive: Set(Marker), singularity: Set(Event) }  -- salience-track profile
Store            = SSOT ⊕ INDEX               -- see ── STORE TOPOLOGY ── block
Scan             = (Store, Track, RecallTrace) → List(Candidate)
Candidate        = { session_id: Optional(SessionId),
                     topic: String,
                     keywords: Set(String),
                     fingerprint: Prose,
                     cross_refs: List(Anchor),
                     confidence: ∈ {low, medium, high},
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
           |C[ranked]| = 0 ∧ attempts = 0 → Probe(V, Σ) → Qs → Stop → H → enrich(V, H) → Phase 1
           |C[ranked]| = 0 ∧ attempts > 0 → NullMatch → inform → deactivate
Phase 2: C[top] → Qc(C[top], evidence, progress) → Stop → R    -- recognition gate [Tool]
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
Phase 0 Detect      (sense)    → Internal analysis
Phase 0 Classify    (sense)    → Internal analysis (InputType detection from V + Σ)
Phase 1 Scan_entropy  (observe)  → Read, Grep (literal match over SSOT ∪ INDEX)
Phase 1 Scan_salience (observe)  → Read, Grep, Glob (MarkerProfile match over INDEX; SSOT fallback on degraded_scan)
Phase 1 Scan_hybrid   (observe)  → union of above
Phase 1 Rank        (sense)    → Internal analysis (conditional: haiku scoring for large candidate sets)
Phase 2 Qc          (constitution)     → present (narrative Socratic candidate; mandatory)
Phase 3 integrate   (track)    → Internal state update
Phase 3 Probe       (sense)    → Internal (gap detection)
Phase 3 Qs          (constitution)     → present (Socratic probing with structured navigation; mandatory on Refine)
Phase 3 emit        (extension)    → TextPresent+Proceed (ClueVector_prose)
converge            (extension)    → TextPresent+Proceed (convergence trace)

── ELIDABLE CHECKPOINTS ──
-- Axis: Extension/Constitution = interaction kind; always_gated/elidable = regret profile
Phase 2 Qc (recognition)     → always_gated (synthesis of identification is constitutive)
Phase 3 Qs (Socratic probe)  → always_gated (only user accesses own retention context)

── MODE STATE ──
Λ = { phase: Phase, V: VagueRecall,
      candidates: List(Candidate), presented: Set(Candidate),
      recognized: Optional(Candidate),
      probes: List(SocraticQuestion),
      attempts: Nat, active: Bool, cause_tag: String }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.

── ENTROPY EXTRACTION ──
extract : Session → Set(IdentifierTuple)
laws:
  identity:          extract(∅) = ∅
  locality:          extract(s₁ ⊔ s₂) = extract(s₁) ⊔ extract(s₂)          -- disjoint sessions
  compositionality:  extract(s) = ⋃ᵢ extractor_i(s)                         -- plugin-summable

precision(t, corpus) = 1 / (1 + |occ(t, corpus \ {t.source})|)
reject(t, θ) ≡ precision(t, corpus) < θ                                    -- derivable, not enumerated

extractor registry:
  core (bootstrap) = { URL_literal, PathRef_literal, PR_literal, Issue_literal, Commit_literal, SessionID_literal }
                     -- semantic categories: URL_path group {URL_literal, PathRef_literal},
                     --                      ExplicitRef group {PR_literal, Issue_literal, Commit_literal},
                     --                      Citation group {SessionID_literal}  -- UUIDs as session citations
  plugin           = { domain-specific extractors conforming to laws }

dispatch binding: InputType = StructuredIdentifier → Track = entropy

── SALIENCE MARKERS ──
detect : Session → MarkerProfile
categories: { coinage, actor, temporal, emotional, cognitive, singularity }   -- working hypothesis (Emergent admitted)
laws:
  monotonicity:   s₁ ⊆ s₂ ⟹ detect(s₁) ⊆ detect(s₂)
  locality:       detect(s₁ ⊔ s₂) = detect(s₁) ⊔ detect(s₂)                 -- disjoint sessions
  idempotence:    detect(witnesses(detect(s))) = detect(s)                    -- second pass stable

coinage(s, corpus, θ) = { t ∈ s : salience_precision(t, s, corpus) ≥ θ }
  where salience_precision(t, s, corpus) = |occ(t, s)| / (1 + |occ(t, corpus \ {s})|)
  -- Zipf deviation: rare in corpus, repeated within session (low-frequency high-entropy)

dispatch binding: InputType = NaturalRecall → Track = salience
                  InputType = Mixed → Track = hybrid    -- union scan: entropy ∪ salience

── STORE TOPOLOGY ──
Store = SSOT ⊕ INDEX ; memory/ = realization-layer adjunct (non-scanned, user-curated)
  SSOT             = authoritative session record (complete, append-only)
  INDEX_semantic   = per-session semantic extraction (IdentifierTuples, MarkerProfile, Coinage, narrative) -- derived from SSOT, rebuildable, lossy
  INDEX_substitute = substitute channel raw message log -- append-only, primary capture, authoritative (loss non-recoverable)

scan_{Track} : (Store, Trace) → List(Candidate)
  scan_entropy(Store, trace)    = exact-match over IdentifierTuples        -- uses SSOT ∪ INDEX
  scan_salience(Store, trace)   = MarkerProfile match (ranked by Σ)        -- INDEX-accelerated; SSOT fallback
  scan_hybrid(Store, trace)     = scan_entropy ∪ scan_salience

degraded_scan: INDEX_semantic = ∅ ⟹ scan'(SSOT, Track, trace)             -- SSOT guarantees semantic recall; cold start falls back to SSOT directly
  -- INDEX_substitute loss non-recoverable (SSOT lacks subagent-channel messages); precondition for Cold-Start invariant (see Verification)

── SUBSTRATE AGNOSTICISM ──
The protocol essence (form) consists of FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, and the
formal blocks ENTROPY EXTRACTION / SALIENCE MARKERS / STORE TOPOLOGY / KNOWN FAILURE MODES.
The essence makes no reference to specific tools, agents, platforms, schedulers, or storage
media. Any realization (matter) satisfying the morphism laws and the store topology realizes
Anamnesis.

form ⊥ matter:
  form   = ⟨FLOW, MORPHISM, TYPES, laws of extract/detect/scan⟩             -- protocol definition
  matter = ⟨tool names, file paths, language, scheduler, storage backend⟩   -- realization

TOOL GROUNDING below specifies one such realization (Claude Code substrate); it is
non-normative with respect to the protocol's epistemic content.

Referent: Semantic autonomy at the realization boundary. This section locally inscribes the
realization boundary for user-visible clarity; the local inscription is intentional and
preserves the hermeneutic circle until a marketplace shared-document mechanism exists.

── KNOWN FAILURE MODES ──
FalseAnchor       : extract(s) contains t with high precision but t ≠ recall_target
                    -- cause: precision threshold locally calibrated but semantically wrong
                    -- detection: Qc Recognize=false despite scan_entropy match

ExtractorLacking  : recall_target ∈ s ∧ ∄ extractor_i : recall_target ∈ extractor_i(s)
                    -- cause: domain-specific extractor absent from registry
                    -- detection: NullMatch on scan_entropy ∧ user can cite literal

PartialExtract    : extract/detect produces well-formed but semantically partial INDEX from corrupted/truncated source
                    -- cause: continue-on-error parser tolerates malformed lines; anomalous shape logged but not write-gated
                    -- detection: invisible to reader without schema version field or observability log surface

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

**Recognition over Retrieval**: When a user has a vague memory of prior discussion or decision, verify the match between their recalled context and historical context through cognitive assistance — presenting narrative candidates for user recognition, rather than returning search results. The protocol function is context identity verification (Husserl's synthesis of identification: empty intention meets fulfilled re-presentation), not information retrieval.

The scan finds candidates; the narrative Qc enables recognition; the user constitutes the identity match. Three constitutive distinctions from search/retrieval:

1. **Input-typed dispatch**: V's input type determines the scan track. Structured identifiers (URLs, explicit references, citations) route to the entropy track where high-precision literal matching dominates; natural recall (temporal hedges, existence claims, vague topical references) routes to the salience track where marker profiles and session context (Σ) rank candidates. Treating every input as Σ-primary keyword query has structural blind spots; track-appropriate scanning resolves them.

2. **Narrative presentation**: Candidates are presented as discussion narratives (question asked → direction taken → outcome reached), not as result summaries. Narrative enables recognition by providing the contextual story that triggers identification; result-only summaries require additional investigation that defeats the protocol's purpose.

3. **Guided recall orientation on Refine**: When initial candidates do not match, the protocol facilitates structured recognitive orientation — presenting concrete navigation through adjacent memory vectors rather than open-ended questions. The user's vague memory and the stored context are brought into productive contact through specific alternatives that enable recognition.

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-guided | FrameworkAbsent → FramedInquiry | Perspective selection |
| **Syneidesis** | AI-guided | GapUnnoticed → AuditedDecision | Decision-point gaps |
| **Hermeneia** | Hybrid | IntentMisarticulated → ClarifiedIntent | Expression clarification |
| **Telos** | AI-guided | GoalIndeterminate → DefinedEndState | Goal co-construction |
| **Horismos** | AI-guided | BoundaryUndefined → DefinedBoundary | Epistemic boundary definition |
| **Aitesis** | AI-guided | ContextInsufficient → InformedExecution | Context sufficiency sensing |
| **Analogia** | AI-guided | MappingUncertain → ValidatedMapping | Abstract-concrete mapping validation |
| **Periagoge** | AI-guided | AbstractionInProcess → CrystallizedAbstraction | In-process abstraction crystallization |
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Risk-assessed execution |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Anamnesis** | AI-guided | RecallAmbiguous → RecalledContext | Vague recall recognition |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:
**Anamnesis vs Aitesis**: Both involve information access. Aitesis discovers facts the user does not know (ContextInsufficient — "I need information"). Anamnesis verifies context the user vaguely knows exists (RecallAmbiguous — "I know this was discussed, but where?"). The phenomenological test: does the user have an empty intention seeking fulfillment (Anamnesis) or no intention at all regarding the topic (Aitesis)? When the user has an empty intention but the recalled content is wholly absent from stores, the protocol exits with NullMatch — the recall target may not exist in the stored context.

**Anamnesis vs Prothesis**: Prothesis selects analytical frameworks when none exist (FrameworkAbsent). Anamnesis locates prior discussions when the user has vague recall of their existence (RecallAmbiguous). If the user does not know a framework was ever discussed, it is not Anamnesis — it is Prothesis or Aitesis.

**Anamnesis vs Hermeneia**: Hermeneia clarifies what the user means now (expression gap in current intent). Anamnesis locates what the user discussed before (recall gap in prior context). If the user's current expression is ambiguous, it is Hermeneia; if their reference to prior context is vague, it is Anamnesis.

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

**Protocol precedence**: graph.json is authoritative. Anamnesis is a 10-outgoing advisory hub (Aitesis, Prothesis, Syneidesis, Hermeneia, Telos, Horismos, Prosoche, Analogia, Periagoge, Epharmoge) with no incoming advisory edges; Katalepsis is structurally last.

**Temporal ordering**: Advisory edges do not enforce activation ordering. `/recollect` should be invoked early — before Hermeneia–Telos–Horismos precondition chain — for advisory flow to materialize. If downstream protocols activate first, advisory enrichment is unreachable in that session (not an error); user awareness of session-start recall is the ordering mechanism.

### Trigger Signals

Heuristic signals for empty intention detection (not hard gates):

| Signal | Detection |
|--------|-----------|
| Vague temporal reference | Past-tense hedging about prior sessions or discussions (e.g., "we discussed this before", "there was something about...") |
| Existence without specification | User asserts prior context exists but cannot name it specifically (e.g., "there was a discussion about...", "I think there was an issue related to...") |
| Self-referential recall markers | Verbs of remembering paired with uncertainty markers (e.g., "I remember seeing...", "I vaguely recall...", "somewhere we talked about...") |
| Failed self-recall | User attempts to reference prior context but trails off, hedges, or uses approximation language |
| Cognitive effort signals | User pauses mid-reference, self-corrects, or expresses frustration at not finding a prior discussion |

**Cross-session enrichment**: Prior recall indices persisted in the hypomnesis store provide starting points for Phase 1 contextual scan — previously successful recall paths may guide initial search scope. This is a heuristic input that may bias detection toward previously observed patterns; constitutive judgment remains with the user.

**Skip**:
- User provides specific reference (file path, session ID, issue number, exact quote)
- Same recall target already resolved in current session (session immunity)
- No empty intention — user is asking for new information, not recalling prior context (defers to Aitesis)
- User explicitly declines recall assistance
- Phase 0 determines the user's expression needs clarification, not recall (defers to /clarify)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| recall_complete (Recognize) | Emit ClueVector_prose, proceed with recognized context |
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
   - **High** (0-1 signals, vague expression): consider presenting hypomnesis store overview first (Phase 1 adaptive path) or routing to /clarify if the expression itself is ambiguous rather than the recall
4. If `not-empty_intention(V)`: present finding per Rule 16 before proceeding (Anamnesis not activated)
5. If `empty_intention(V)`: record V with extracted trace — proceed to Phase 1

**Scan scope**: Bound text, conversation context, session history. Does NOT modify files or call external services.

### Phase 1: Track-Dispatched Scan + Rank

Dispatch the scan on the classified `Track`, execute track-appropriate lookup over `Store = SSOT ⊕ INDEX`, then rank candidates.

1. **Track-dispatched scan strategy**:
   - **entropy track** (`InputType = StructuredIdentifier`): execute `scan_entropy` over `SSOT ∪ INDEX` — literal match on `IdentifierTuple.literal`; precision-thresholded (low-frequency, high-entropy identifiers win). URL path literals, explicit references, citation tokens dominate.
   - **salience track** (`InputType = NaturalRecall`): execute `scan_salience` over `INDEX` (SSOT fallback on degraded_scan) — match against `MarkerProfile` (coinage / actor / temporal / emotional / cognitive / singularity); session context (Σ) supplies ranking signal within this track.
   - **hybrid track** (`InputType = Mixed`): union of entropy and salience results.

   Tool realization (Claude Code substrate): `Read/Grep/Glob` over the Store binding declared in TOOL GROUNDING. Rule 6 defines track-internal ranking composition.

2. **Adaptive behavior based on trace ambiguity**:
   - **High ambiguity**: Present hypomnesis store overview as orientation text (extension) — surface the store's structure and major topic clusters so the user can orient their recall. This is informational, not a gated interaction; the overview provides context for the subsequent targeted scan.
   - **Moderate ambiguity**: Broaden scan scope to include semantic similarity and temporal neighborhood.
   - **Low ambiguity**: Direct targeted scan using the dispatched track.

3. **Rank candidates**: Ranking is track-internal. On the entropy track, precision (low occurrence in corpus) dominates; on the salience track, Σ-match + marker-profile overlap + temporal proximity compose the weight. Each candidate carries:
   - Its core topic and narrative summary
   - Adjacent topics from the same session or time period
   - Confidence level based on trace alignment

4. If `|C[]| = 0`: NullMatch pathway. Inform user what was searched and not found. Before declaring NullMatch, attempt at least one Socratic probe enrichment (Rule 17). After enrichment attempts exhausted: surface the search scope summary and the accumulated recall trace (keywords, temporal signals, user hints from probing), then offer Aitesis handoff — the recall INDEX (hypomnesis/) may lack the entry (lifecycle gap: SessionEnd did not fire; or pre-store: session predates hypomnesis implementation), but the SSOT (session JSONL) may still contain the information. The accumulated trace from Anamnesis probing becomes context seed for Aitesis to search JSONL directly via session ID.

**Scope restriction**: Read-only investigation only (Read, Grep, Glob). No file modifications.

### Phase 2: Narrative Recognition (Constitution)

**Present** the highest-priority candidate as a discussion narrative for user recognition via Cognitive Partnership Move (Constitution).

**Selection criterion**: Choose the candidate whose recognition would maximally resolve the user's empty intention. When priority is equal, prefer the candidate with richer narrative context and adjacent vectors.

**Narrative presentation format**:

Present the candidate as narrative text — the discussion's story, not just its result:
- **When/Where**: Temporal and spatial context — when the discussion happened (with temporal distance, e.g., "3 days ago" or "2 weeks ago"), which session or document. Use short session reference in narrative for readability.
- **Source**: Provenance of the stored context — whether it was user-crystallized (via /crystallize) or auto-generated (SessionEnd hook narrative)
- **Origin**: What prompted the discussion — the question or situation that started it
- **Direction**: How the discussion developed — what path was taken, what was explored
- **Outcome**: What was decided, produced, or concluded
- **Session**: Full session ID and originating `cwd` for `claude --resume` verification (e.g., `session: abc12345-def6-7890-ghij-klmnopqrstuv`, `cwd: /home/user/project`). Narrative uses short reference; both fields together form the complete resumable handle — Claude Code resolves the project slug from invocation cwd, so the session ID alone is insufficient when the user is in a different directory.
- **Adjacent**: Other topics discussed nearby in the same time period — for Refine orientation
- **Progress**: `[attempt N/3, M candidates in scope]`

Then **present**:

```
Does this match the discussion you are recalling?

Options:
1. **Recognize** — this is the discussion I was thinking of
2. **Refine** — the adjacent topics listed above may be closer to your memory
```

Other is always available — maps to `Reorient`: user describes a fundamentally different recall dimension that neither Recognize nor Refine captures (e.g., recalling a concept rather than a discussion, an external reference rather than a session). The protocol re-characterizes V with the new description and re-scans from the orthogonal angle.

Design principles for Phase 2 presentation — narrative over summary, concrete adjacent vectors on Refine, progress visibility, cross-LOOP continuity — are enforced by Rules 4, 5, 11, and 21.

### Phase 3: Integration

After user response:

1. **Recognize(c)**: Mark candidate as recognized. Emit ClueVector_prose — natural language rendering of the recognized context to session text. ClueVector_prose includes: session reference (short form in narrative, full session ID and originating cwd for `--resume` verification — both are required to reconstruct the resumable handle), topic summary with narrative, key cross-references (memory paths, issue numbers, document pointers), resumption hint if applicable. This prose enters the session text and is naturally readable by any downstream protocol via Session Text Composition.

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

   After user response: `enrich(V, H)` — integrate hint into trace (keywords, associations, temporal narrowing), re-enter Phase 1 with enriched context. Structured navigation design is governed by Rule 5.

3. **Reorient(description)**: User surfaces an orthogonal recall dimension neither candidate nor adjacent vectors match — the target is fundamentally different from what was assumed. `rebind(V, d, Σ)` rebuilds V.trace from the new description (fresh construction, not Refine's incremental enrichment). Re-enter Phase 1 with rebuilt trace. NullMatch on re-scan may route cross-protocol (e.g., ContextInsufficient → Aitesis; expression ambiguity → /clarify).

   **Refine vs Reorient test**: would the user's new description produce any overlap with the current candidate set? Overlap → Refine; disjoint → Reorient.

After integration: `recall_complete` → present convergence evidence trace (VagueRecall → [enrichments applied] → Candidate(recognized) → ClueVector_prose emitted), proceed. Refine → Phase 1 with enriched trace. Reorient → Phase 1 with rebuilt trace (orthogonal re-scan). Log `(Candidate, R)` to history.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | High specificity trace, single obvious candidate | Abbreviated narrative (origin + outcome) + gate with Recognize default |
| Medium | Moderate specificity, 2-3 candidates in scope | Full narrative + adjacent vectors in Refine option |
| Heavy | Low specificity, Refine path expected, high ambiguity trace | Full narrative + adjacent vectors + Socratic probing with structured navigation + hypomnesis overview on initial scan |

## Rules

1. **AI-guided, user-recognized**: AI detects empty intention and scans stores; recognition requires user identification via Cognitive Partnership Move (Constitution) (Phase 2). AI detection is implicitly confirmed when the user engages with recognition (Phase 2 gate response, not Esc).

2. **Recognition over Retrieval**: Present narrative candidates via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity — Constitution interaction requires turn yield before proceeding.

3. **Input-typed dispatch**: Phase 1 scan dispatches by `InputType` classified from V and Σ — `StructuredIdentifier` → entropy track, `NaturalRecall` → salience track, `Mixed` → hybrid. Σ-primary scan survives only as a ranking-layer special case within the salience track, not as an absolute scan rule.

4. **Narrative Qc presentation**: Phase 2 presents candidates as discussion narratives (origin → direction → outcome), not result summaries. Result-only presentation defeats recognition by forcing additional investigation.

5. **Guided recall orientation in Refine**: On Refine, present structured navigation through adjacent memory vectors with brief narratives — open-ended questions shift cognitive burden; structured alternatives enable recognition in recall-deepening.

6. **Track-internal ranking strategy**: Ranking composes track-appropriate signals — entropy track: literal precision (corpus rarity) dominates; salience track: Σ-match + marker-profile overlap + temporal neighborhood + adjacent vector discovery. Single-signal scans have structural blind spots regardless of track.

7. **Adaptive ambiguity handling**: When trace ambiguity is high (0-1 specific signals), present hypomnesis store overview or consider /clarify composition before targeted scanning. Do not scan blindly on vague expressions — orient the user first.

8. **One candidate per cycle**: Present one highest-priority candidate per Phase 2 cycle; do not bundle multiple candidates.

9. **Recognition respected**: User's recognition or rejection is final for that candidate in the current session.

10. **Convergence persistence**: Mode active until recall_complete, NullMatch after exhaustion, or user Esc key.

11. **Progress visibility**: Every Phase 2 presentation includes progress indicator `[attempt N/3, M candidates in scope]`.

12. **Early exit honored**: When user declares recall sufficient or presses Esc, accept immediately regardless of remaining candidates or attempts.

13. **Cross-protocol awareness**: Defer to Aitesis when user needs new information (no empty intention); defer to /clarify when expression itself is ambiguous (expression gap ≠ recall gap). Compose `/recollect * /inquire` when recognized context needs enrichment. On NullMatch after exhausted probing, offer Aitesis handoff with accumulated trace and enumerate possible causes — lifecycle gap / pre-store, missing extractor, or PartialExtract from corrupted source — giving actionable diagnosis; INDEX may lack entries (lifecycle gaps or pre-store sessions) while SSOT retains the information.

14. **Context-Question Separation**: Present all narrative context, evidence, and adjacent vectors as text before the Constitution interaction; the interaction contains only the recognition question and options with differential implications. Embedding narrative in the Constitution interaction = protocol violation.

15. **Convergence evidence**: Present transformation trace before declaring recall_complete.

16. **Activation surfacing**: If Phase 0 determines no empty intention (e.g., user provides a specific reference), present the finding before proceeding without Anamnesis.

17. **No premature NullMatch**: At least one Socratic probe enrichment must precede NullMatch declaration. First scan returning zero → probe → enriched re-scan → NullMatch only if still empty.

18. **No skipped Qc**: Phase 2 Constitution interaction is mandatory even with single high-confidence candidate. Synthesis of identification is constitutive — cannot auto-resolve via confidence score. High confidence justifies Light intensity, not constitution elision.

19. **No asserted recognition**: AI presents; user constitutes recognition. Asserting "this must be what you want" = protocol violation.

20. **No merged probe+recognition**: Socratic probing (Qs) and recognition (Qc) are separate Constitution interactions — the probe deepens recall context, Qc verifies identity. Combining them = protocol violation.

21. **Cross-LOOP narrative persistence**: Narrative format and adjacent vector enrichment persist across LOOP iterations; subsequent attempts reference prior candidates and explain the differential.

22. **Substrate non-coupling**: Protocol essence (FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, five formal blocks) must not name specific tools, agents, platforms, or storage media. Realization bindings belong exclusively to TOOL GROUNDING (semantic autonomy at the realization boundary).

## Known Limitations

Failure modes are formally specified in `── KNOWN FAILURE MODES ──` (FalseAnchor, ExtractorLacking, PartialExtract, NullMatch₁/₂, MutualNull). MutualNull — genuine absence from Store — is the principal structural failure mode; the deprecated v0.3.3 "Σ-primary scan bias" hypothesis is bounded by Rule 3 input-typed dispatch to a ranking-layer concern within the salience track.
