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
  empty_intention(V): Scan(store, trace(V)) → Rank(C[]) →
    |C[]| = 0 ∧ attempts = 0: Probe(V, Σ) → Qs(probe) → Stop → H → enrich(V, H) → re-scan
    |C[]| = 0 ∧ attempts > 0: NullMatch → inform(V, Σ) → deactivate
    |C[]| > 0: Qc(C[top], progress) → Stop → R →
      Recognize(c): recall_complete(c) → emit(ClueVector_prose(c)) → converge
      Refine: Probe(V, Σ) → Qs(probe) → Stop → H → enrich(V, H) → re-scan
      Reorient(d): rebind(V, d, Σ) → Phase 1                 -- orthogonal dimension shift

── MORPHISM ──
VagueRecall
  → detect(empty_intention)              -- recognize vague recall state
  → scan(store, recall_trace)            -- search hypomnesis/ + memory/
  → rank(candidates, recall_trace)       -- order by relevance
  → present(candidate, Socratic)         -- Socratic candidate presentation
  → recognize(candidate, user)           -- synthesis of identification (Husserl CM §§38-39)
  → emit(ClueVector_prose)               -- NL rendering to session text
  → RecalledContext
requires: empty_intention(V)              -- phenomenological trigger
deficit:  RecallAmbiguous                 -- activation precondition (Layer 1/2)
preserves: V                              -- vague recall read-only
invariant: Recognition over Retrieval

── TYPES ──
V              = VagueRecall { trace: RecallTrace, enrichments: List(Hint) }
RecallTrace    = { keywords: Set(String), temporal: Optional(String),
                   associations: Set(String) }
Hint           = String   -- user recall context from Socratic probe
store          = hypomnesis/ ∪ memory/
Scan           = (store, RecallTrace) → List(Candidate)
Candidate      = { session_id: Optional(SessionId),
                   topic: String,
                   keywords: Set(String),
                   fingerprint: Prose,
                   cross_refs: List(Anchor),
                   confidence: ∈ {low, medium, high},
                   resumption_hint: Optional(String) }
Anchor         = String   -- opaque: memory path, URL, session ID, doc path
Prose          = String   -- source-agnostic NL description
Rank           = List(Candidate) → List(Candidate)
Probe          = (V, Σ) → List(SocraticQuestion)
SocraticQuestion = { dimension: ∈ {temporal, associative, contextual}, question: String }
R              = Recognition ∈ {Recognize(Candidate), Refine, Reorient(description)}
H              = Hint     -- answer from Socratic probe gate (Qs)
ClueVector_prose = String
RecalledContext  = session text containing ClueVector_prose
NullMatch       = |Scan(store, trace)| = 0 after all enrichment attempts
Phase          ∈ {0, 1, 2, 3}

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
Phase 1: V → Scan(store, trace(V)) → Rank(C[]) → C[ranked]     -- search + rank [Tool]
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
-- Realization: gate → TextPresent+Stop; relay → TextPresent+Proceed
Phase 0 Detect      (sense)    → Internal analysis
Phase 1 Scan        (observe)  → Read, Grep, Glob (hypomnesis/ + memory/)
Phase 1 Rank        (sense)    → Internal analysis (conditional: haiku scoring for large candidate sets)
Phase 2 Qc          (gate)     → present (narrative Socratic candidate; mandatory)
Phase 3 integrate   (track)    → Internal state update
Phase 3 Probe       (sense)    → Internal (gap detection)
Phase 3 Qs          (gate)     → present (Socratic probing with structured navigation; mandatory on Refine)
Phase 3 emit        (relay)    → TextPresent+Proceed (ClueVector_prose)
converge            (relay)    → TextPresent+Proceed (convergence trace)

── ELIDABLE CHECKPOINTS ──
-- Axis: relay/gated = interaction kind; always_gated/elidable = regret profile
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
```

## Core Principle

**Recognition over Retrieval**: When a user has a vague memory of prior discussion or decision, verify the match between their recalled context and historical context through cognitive assistance — presenting narrative candidates for user recognition, rather than returning search results. The protocol function is context identity verification (Husserl's synthesis of identification: empty intention meets fulfilled re-presentation), not information retrieval.

The scan finds candidates; the narrative Qc enables recognition; the user constitutes the identity match. Three constitutive distinctions from search/retrieval:

1. **Context-primary trace**: The current session context is the primary search signal, not user-supplied keywords which may be inaccurate or incomplete. The protocol assists in finding together with the user, not merely executes a keyword query.

2. **Narrative presentation**: Candidates are presented as discussion narratives (question asked → direction taken → outcome reached), not as result summaries. Narrative enables recognition by providing the contextual story that triggers identification; result-only summaries require additional investigation that defeats the protocol's purpose.

3. **Guided recall orientation on Refine**: When initial candidates do not match, the protocol facilitates structured recognitive orientation — presenting concrete navigation through adjacent memory vectors rather than open-ended questions. The user's vague memory and the stored context are brought into productive contact through specific alternatives that enable recognition.

## Epistemic Distinction from Information Retrieval

Anamnesis is not simplified search. Three differentiators:

1. **Phenomenological trigger**: Activates only when `empty_intention(V)` — user knows something exists but cannot locate it. Not for finding unknown information (Aitesis) or querying known references (direct Read/Grep).

2. **Synthesis of identification**: The recognition gate (Phase 2 Qc) is where empty intention meets fulfilled re-presentation (Husserl *Cartesian Meditations* §§38-39). The user does not confirm a search result — they recognize a context identity. This recognition is constitutive: the user's judgment creates the verified match, not the scan's confidence score.

3. **Recall deepening, not query refinement**: The Refine path enriches the user's recall context through Socratic probing with structured navigation, not by adjusting search parameters. The improvement is in the user's recall orientation (bringing vague memory into productive contact with adjacent stored context), not in the search query.

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
| **Anamnesis** | AI-guided | RecallAmbiguous → RecalledContext | Vague recall recognition |
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Risk-assessed execution |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:

**Anamnesis vs Aitesis**: Both involve information access. Aitesis discovers facts the user does not know (ContextInsufficient — "I need information"). Anamnesis verifies context the user vaguely knows exists (RecallAmbiguous — "I know this was discussed, but where?"). The phenomenological test: does the user have an empty intention seeking fulfillment (Anamnesis) or no intention at all regarding the topic (Aitesis)? When the user has an empty intention but the recalled content is wholly absent from stores, the protocol exits with NullMatch — the recall target may not exist in the stored context.

**Anamnesis vs Reflexion**: Reflexion extracts cross-session learning patterns through guided dialogue (retrospective, write-oriented — inscribes insights into persistent memory). Anamnesis resolves vague recall into specific recognized context (recognition-oriented, read-only — reads from stores without modifying them). Three-axis orthogonality on the same memory layer: retrospective analysis (Reflexion), prospective preservation (/crystallize), vague-recall access (Anamnesis).

**Anamnesis vs Prothesis**: Prothesis selects analytical frameworks when none exist (FrameworkAbsent). Anamnesis locates prior discussions when the user has vague recall of their existence (RecallAmbiguous). If the user does not know a framework was ever discussed, it is not Anamnesis — it is Prothesis or Aitesis.

**Anamnesis vs Hermeneia**: Hermeneia clarifies what the user means now (expression gap in current intent). Anamnesis locates what the user discussed before (recall gap in prior context). If the user's current expression is ambiguous, it is Hermeneia; if their reference to prior context is vague, it is Anamnesis.

**Structural distinction**: Anamnesis operates on the user's retention context — the accumulated prior discussions and decisions stored in hypomnesis and memory. The operational test: if the uncertainty is about whether something was previously discussed and where, it is Anamnesis; if it is about whether enough information exists to proceed now, it is Aitesis; if it is about what the user currently means, it is Hermeneia.

## Mode Activation

### Activation

AI detects empty intention in user expression OR user calls `/recollect`. Detection is silent (Phase 0); recognition always requires user interaction via gate (Phase 2). On direct `/recollect`, bind `V` from the current or most recent context; if no recoverable vague recall exists, request the recall target before Phase 0.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/recollect` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Empty intention detected via in-protocol heuristics. Detection is silent (Phase 0).

**Empty intention** = user has a vague memory of prior discussion, decision, or context but cannot locate or fully specify it. The user knows-that (something exists) but not what/where (specific content or location).

Gate predicate:
```
empty_intention(V) ≡ ∃ context(c, prior) : knows_exists(user, c) ∧ ¬can_locate(user, c)
```

### Priority

<system-reminder>
When Anamnesis is active:

**Supersedes**: Direct execution patterns that bypass recall verification
(Vague recall must be resolved before context-dependent work proceeds)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, present narrative candidate for user recognition via gate interaction and yield turn.
</system-reminder>

- Anamnesis completes before context-dependent work proceeds
- Loaded instructions resume after recall is resolved or dismissed

**Protocol precedence**: Relationship to Aitesis determined by graph.json (precondition or advisory). When active, recognized context narrows Aitesis scope.

**Advisory relationships**: Provides to Aitesis (recognized context as Ctx seed). Receives from Horismos (advisory: BoundaryMap may scope recall domain). Katalepsis is structurally last.

### Trigger Signals

Heuristic signals for empty intention detection (not hard gates):

| Signal | Detection |
|--------|-----------|
| Vague temporal reference | Past-tense hedging about prior sessions or discussions (e.g., "we discussed this before", "there was something about...") |
| Existence without specification | User asserts prior context exists but cannot name it specifically (e.g., "there was a discussion about...", "I think there was an issue related to...") |
| Self-referential recall markers | Verbs of remembering paired with uncertainty markers (e.g., "I remember seeing...", "I vaguely recall...", "somewhere we talked about...") |
| Failed self-recall | User attempts to reference prior context but trails off, hedges, or uses approximation language |
| Cognitive effort signals | User pauses mid-reference, self-corrects, or expresses frustration at not finding a prior discussion |

**Cross-session enrichment**: Prior recall patterns from Reflexion cycles provide starting points for Phase 1 contextual scan — previously successful recall paths may guide initial search scope. This is a heuristic input that may bias detection toward previously observed patterns; gate judgment remains with the user.

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
2. **Extract trace**: `extract_trace(input, Sigma)` — session context (Sigma) is the **primary** signal, user expression keywords are **secondary** (user's recall may be inaccurate or point to a similar but different discussion)
   - **Context extraction**: What is the user currently working on? What topic area does the vague recall relate to? The current conversation structure and direction are the strongest clues for narrowing the search space
   - **Keyword extraction**: Specific terms from user expression — treated as heuristic hints, not definitive search terms
   - **Temporal extraction**: Any time references — converted to search window constraints
   - **Association extraction**: Related concepts inferred from session context — often more reliable than user-supplied keywords
3. **Assess trace ambiguity**:
   - **Low** (3+ specific signals across keywords, temporal, associations): proceed to Phase 1 with targeted scan
   - **Moderate** (1-2 signals): proceed to Phase 1 with broader scan scope and semantic similarity
   - **High** (0-1 signals, vague expression): consider presenting hypomnesis store overview first (Phase 1 adaptive path) or routing to /clarify if the expression itself is ambiguous rather than the recall
4. If `not-empty_intention(V)`: present finding per Rule 16 before proceeding (Anamnesis not activated)
5. If `empty_intention(V)`: record V with extracted trace — proceed to Phase 1

**Scan scope**: Bound text, conversation context, session history. Does NOT modify files or call external services.

### Phase 1: Contextual Scan + Rank

Scan hypomnesis and memory stores with contextual awareness, then rank candidates.

1. **Contextual scan strategy** (not keyword-only):
   - **Session context match**: Find sessions and documents discussing topics similar to current session context (Sigma) — this is the primary search dimension
   - **Keyword match**: Find mentions of trace keywords across stores — secondary, potentially inaccurate
   - **Temporal neighborhood**: When a temporal signal exists, explore sessions in that time range AND their adjacent sessions — what was discussed before and after the candidate
   - **Adjacent vector discovery**: For each candidate session, collect what other topics were discussed alongside — these become concrete Refine hints in Phase 2

   **Call Read/Grep/Glob** across `hypomnesis/ ∪ memory/` with contextual search strategy.

2. **Adaptive behavior based on trace ambiguity**:
   - **High ambiguity**: Present hypomnesis store overview as orientation text (relay) — surface the store's structure and major topic clusters so the user can orient their recall. This is informational, not a gated interaction; the overview provides context for the subsequent targeted scan.
   - **Moderate ambiguity**: Broaden scan scope to include semantic similarity and temporal neighborhood
   - **Low ambiguity**: Direct targeted scan with context + keyword convergence

3. **Rank candidates**: Order by relevance with weight hierarchy: context match > keyword match > temporal proximity. Each candidate carries:
   - Its core topic and narrative summary
   - Adjacent topics from the same session or time period
   - Confidence level based on trace alignment

4. If `|C[]| = 0`: NullMatch pathway. Inform user what was searched and not found. Before declaring NullMatch, attempt at least one Socratic probe enrichment (Rule 17). After enrichment attempts exhausted: surface the search scope summary and the accumulated recall trace (keywords, temporal signals, user hints from probing), then offer Aitesis handoff — the recall INDEX (hypomnesis/) may lack the entry (lifecycle gap: SessionEnd did not fire; or pre-store: session predates hypomnesis implementation), but the SSOT (session JSONL) may still contain the information. The accumulated trace from Anamnesis probing becomes context seed for Aitesis to search JSONL directly via session ID.

**Scope restriction**: Read-only investigation only (Read, Grep, Glob). No file modifications.

### Phase 2: Narrative Recognition Gate

**Present** the highest-priority candidate as a discussion narrative for user recognition via gate interaction.

**Selection criterion**: Choose the candidate whose recognition would maximally resolve the user's empty intention. When priority is equal, prefer the candidate with richer narrative context and adjacent vectors.

**Narrative presentation format**:

Present the candidate as narrative text — the discussion's story, not just its result:
- **When/Where**: Temporal and spatial context — when the discussion happened (with temporal distance, e.g., "3 days ago" or "2 weeks ago"), which session or document
- **Source**: Provenance of the stored context — whether it was user-crystallized (via /crystallize), auto-generated (SessionEnd hook narrative), or memory-curated (manually written to memory/)
- **Origin**: What prompted the discussion — the question or situation that started it
- **Direction**: How the discussion developed — what path was taken, what was explored
- **Outcome**: What was decided, produced, or concluded
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

**Design principles**:
- **Narrative over summary**: Tell the discussion's story (origin → direction → outcome), not just the conclusion. The story is what triggers recognition.
- **Adjacent vectors in Refine**: Concrete alternatives from the store, not generic "something else?" — reduces cognitive load and enables Recognition (A1) in the Refine path itself
- **Progress visible**: Display attempt count and candidate scope
- **Cross-LOOP continuity**: On subsequent iterations, reference prior presented candidates and explain the differential

### Phase 3: Integration

After user response:

1. **Recognize(c)**: Mark candidate as recognized. Emit ClueVector_prose — natural language rendering of the recognized context to session text. ClueVector_prose includes: session reference, topic summary with narrative, key cross-references (memory paths, issue numbers, document pointers), resumption hint if applicable. This prose enters the session text and is naturally readable by any downstream protocol via Session Text Composition.

2. **Refine**: Candidate not recognized but recall direction acknowledged. Initiate Socratic probing for recall deepening:

   **Probe(V, Sigma)**: Analyze what the user rejected and what the stored adjacent vectors suggest they might be seeking. Generate structured navigation through the memory space — concrete options, not open-ended questions:

   **Present** Socratic probe via gate interaction (Qs, mandatory on Refine):
   ```
   Adjacent areas from this time period and context:
   1. [Topic A] — [brief narrative: what was discussed and why]
   2. [Topic B] — [brief narrative]
   3. [Topic C] — [brief narrative]
   Which direction is closer to your memory?
   ```

   **Design principle**: Structured navigation (Recognition), not open-ended recall demands. Each option is a concrete memory vector with narrative context. The probe facilitates guided recall orientation — bringing the user's vague memory into productive contact with specific stored alternatives.

   After user response: `enrich(V, H)` — integrate user's hint into trace (keywords, associations, temporal narrowing), re-enter Phase 1 with enriched context for re-scan.

3. **Reorient(description)**: User's recall is in an orthogonal dimension — neither the presented candidate nor its adjacent vectors match because the recall target is fundamentally different from what was assumed. The protocol re-characterizes V:

   `rebind(V, d, Sigma)` — rebuild V.trace from the user's description rather than enriching the existing trace. This is not incremental enrichment (Refine) but a fresh trace construction from the orthogonal dimension the user has surfaced.

   Re-enter Phase 1 with rebuilt trace. If the re-scan yields NullMatch, the NullMatch information may include cross-protocol routing suggestions (e.g., if the user's description reveals ContextInsufficient rather than RecallAmbiguous, suggest Aitesis; if expression ambiguity, suggest /clarify).

   **Distinction from Refine**: Refine enriches V within the same search space (guided recall orientation with adjacent vectors). Reorient rebuilds V from a different search space entirely (orthogonal dimension shift). The operational test: would the user's new description produce any overlap with the current candidate set? If yes, it is Refine; if the sets are disjoint, it is Reorient.

After integration:
- If `recall_complete`: present convergence evidence trace (VagueRecall → [enrichments applied] → Candidate(recognized) → ClueVector_prose emitted), proceed
- If Refine: return to Phase 1 with enriched trace
- If Reorient: return to Phase 1 with rebuilt trace (orthogonal re-scan)
- Log `(Candidate, R)` to history

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | High specificity trace, single obvious candidate | Abbreviated narrative (origin + outcome) + gate with Recognize default |
| Medium | Moderate specificity, 2-3 candidates in scope | Full narrative + adjacent vectors in Refine option |
| Heavy | Low specificity, Refine path expected, high ambiguity trace | Full narrative + adjacent vectors + Socratic probing with structured navigation + hypomnesis overview on initial scan |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Anamnesis) only if empty_intention(V)` | Prevents false activation on specific references |
| Context-primary scan | Phase 1 uses Sigma context + trace, not keywords alone | Reduces keyword-only blind spots |
| Narrative Qc | Phase 2 presents discussion story, not result summary | Enables recognition without additional investigation |
| Guided recall orientation in Refine | Refine includes adjacent vectors from store | Prevents cognitive load from hint-less Refine |
| One candidate per cycle | Present highest-priority candidate per Phase 2 | Prevents recognition overload |
| Session immunity | Recognized recall target → skip for session | Respects prior recognition |
| Progress visibility | `[attempt N/3, M candidates]` in Phase 2 | User sees recall progress |
| Attempt cap | Max 3 recall attempts per activation | Prevents infinite recall deepening |
| Early exit | User can accept current state at any Phase 2 | Full control over recall depth |
| Ambiguity routing | High ambiguity → hypomnesis overview or /clarify | Prevents blind scan on vague expressions |
| NullMatch protection | At least one probe enrichment before NullMatch | Prevents premature abandonment |

## Rules

1. **AI-guided, user-recognized**: AI detects empty intention and scans stores; recognition requires user identification via gate interaction (Phase 2). AI detection is implicitly confirmed when the user engages with recognition (Phase 2 gate response, not Esc).

2. **Recognition over Recall**: Present narrative candidates via gate interaction and yield turn — structured content must reach the user with response opportunity. Bypassing the gate (presenting content without yielding turn) = protocol violation.

3. **Context-primary trace**: Session context (Sigma) is the primary trace signal for Phase 1 scan. User-supplied keywords are secondary and may be inaccurate. The protocol assists in finding with the user — it is a cognitive partner, not a query executor.

4. **Narrative Qc presentation**: Phase 2 presents candidates as discussion narratives (origin → direction → outcome), not result summaries. Narrative enables recognition by providing the contextual story; result-only presentation forces additional investigation that defeats the protocol's purpose.

5. **Guided recall orientation in Refine**: When user selects Refine, present structured navigation through adjacent memory vectors from the store — concrete alternative topics with brief narratives. Open-ended questions shift cognitive burden to the user; structured alternatives enable Recognition (A1) in the recall-deepening process itself.

6. **Contextual scan strategy**: Phase 1 scan uses session context match, keyword match, temporal neighborhood, and adjacent vector discovery. Keyword-only scan has structural blind spots; contextual scan addresses them by treating the current conversation as the primary search signal.

7. **Adaptive ambiguity handling**: When trace ambiguity is high (0-1 specific signals), present hypomnesis store overview or consider /clarify composition before targeted scanning. Do not scan blindly on vague expressions — orient the user first.

8. **One candidate per cycle**: Present one highest-priority candidate per Phase 2 cycle; do not bundle multiple candidates.

9. **Recognition respected**: User's recognition or rejection is final for that candidate in the current session.

10. **Convergence persistence**: Mode active until recall_complete, NullMatch after exhaustion, or user Esc key.

11. **Progress visibility**: Every Phase 2 presentation includes progress indicator `[attempt N/3, M candidates in scope]`.

12. **Early exit honored**: When user declares recall sufficient or presses Esc, accept immediately regardless of remaining candidates or attempts.

13. **Cross-protocol awareness**: Defer to Aitesis when user has no recall — no empty intention, needs new information. Defer to /clarify when user's expression itself is ambiguous (expression gap, not recall gap). Route to HybridRecall composition (`/recollect * /inquire`) when recognized context needs further enrichment. On NullMatch after exhausted probing, offer Aitesis handoff with accumulated recall trace as context seed — the recall INDEX (hypomnesis/) may lack entries due to lifecycle gaps or pre-store sessions, but the SSOT (session JSONL) retains the information and Aitesis can search it directly.

14. **Context-Question Separation**: Present all narrative context, evidence, and adjacent vectors as text before the gate; the gate contains only the recognition question and options with differential implications. Embedding narrative in gate fields = protocol violation.

15. **No premature convergence**: Do not declare recall_complete without presenting convergence evidence trace. "Recall resolved" as assertion without transformation trace = protocol violation.

16. **No silent activation dismissal**: If Phase 0 determines no empty intention (e.g., user provides a specific reference), present the finding before proceeding without Anamnesis.

17. **No premature NullMatch**: Do not declare NullMatch before attempting at least one Socratic probe enrichment. First scan returning zero → probe for enrichment → enriched re-scan → then NullMatch if still empty. The user's initial expression may be too vague to match, but a single probe can unlock recall.

18. **No skipped Qc**: Even with a single high-confidence candidate, Phase 2 gate is mandatory. The synthesis of identification is constitutive — it cannot be auto-resolved by confidence scores. High confidence justifies Light intensity (abbreviated narrative), not gate elision.

19. **No asserted recognition**: AI presents narrative candidates; user constitutes recognition. Asserting "this must be what you are looking for" = protocol violation. Present and yield; never assert on behalf of the user.

20. **No merged probe+recognition**: Socratic probing (Qs) and recognition (Qc) are separate gate interactions. Do not combine identification questions with recall-deepening questions in a single gate. The probe deepens the user's recall context; the recognition verifies identity. These are distinct epistemic operations.

21. **Cross-LOOP narrative persistence**: Narrative format, adjacent vector enrichment, and guided recall orientation persist across all LOOP iterations. Second and subsequent attempts reference prior presented candidates and explain the differential. Continuity across loops prevents repetitive presentation and builds cumulative orientation.

## Known Limitations

**Sigma-primary scan bias**: The context-primary scan design (Rule 3) assumes correlation between the user's current session context and their recall target. When the user's current work has diverged from the topic they are trying to recall (e.g., they have moved on to a different task), the Sigma-primary scan may bias candidates toward the current topic rather than the recalled topic. In such cases, user-supplied keywords become the more reliable signal. The adaptive ambiguity handling (Rule 7: falling back to broader scan on high ambiguity) partially mitigates this, but practitioners should be aware that the context-primary design trades keyword-only blind spots for context-divergence blind spots. The Refine path provides a natural recovery mechanism when initial candidates are biased by Sigma divergence.
