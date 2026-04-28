---
name: crystallize
description: "Inscribe a session's horizon-fusion residue into a Horizon-Fusion Text (HFT) for cross-session continuity. Use when the user asks to 'crystallize session', 'crystallize handoff', 'inscribe horizon', 'save next-session state', 'prepare for compact', or invokes /crystallize. Writer half of the HFT pair (paired with /rehydrate). Single-medium handoff: collapses prior multi-substrate patterns into a four-layer Markdown file. Stage 2 evidence-collection instrument."
user_invocable: true
---

# Crystallize Skill

Inscribe a session's horizon-fusion residue into a Horizon-Fusion Text (HFT) — a four-layer Markdown file (Surface Text · Wirkungsgeschichte · Reference Shells · Excluded) that primes a fresh session to enter the same horizon as the originating session. Type: `(HorizonUninscribed, User, INSCRIBE, SessionState) → InscribedHFT`.

Invoke directly with `/crystallize [stage-name]` at a stage transition or before a session boundary.

## Definition

**Crystallize** (writer half of the HFT pair): A dialogical act of resolving a session's accumulated horizon into a single inscribed text, where the AI distills Surface Text from session state, extracts Wirkungsgeschichte deltas since the predecessor stage, enumerates Reference Shell anchors to auxiliary substrates, and the user approves the assembled HFT before it is committed to disk — inscription belongs to the user's approval act, not the AI's distillation act.

This skill is the writer half of a pair. `/rehydrate` is the reader half. The two share the HFT format spec at `references/hft-format.md` and operate asymmetrically: write occurs at session end (compress live horizon into text); read occurs at session start (parse text and prime new horizon).

This skill collapses the prior multi-substrate handoff pattern (plan + memory addendum + index + tasks) into a single Markdown file with four declared layers. Auxiliary substrates (auto-memory `MEMORY.md`, hypomnesis sub-index) remain operationally distinct and are reachable only as Reference Shell anchors, never absorbed into HFT body.

## When to Use

Invoke this skill when:
- A stage transition has occurred (work segment closed, next segment begins) and the next session must enter from the same horizon
- A session boundary is imminent (`/compact` about to run, fresh session imminent) and the horizon would otherwise be lost
- The user wants the next session to first-utter from the current Vorverständnis without re-asking the user to reassemble context

Skip when:
- Single-session work where context stays loaded throughout (no boundary to bridge)
- Exploratory or research turns without a clear stage closure
- Trivial tasks where horizon residue does not exceed what TaskList alone preserves
- The user wants pattern-based session recommendation (`/onboard`) or accumulated analytics (`/report`, `/dashboard`) — those operate on cross-session aggregates, not single-stage horizons

## Distinction from Related Skills

| Skill | Time axis | Subject | Operation | Output |
|-------|-----------|---------|-----------|--------|
| `/crystallize` | Stage end (write) | Session horizon | INSCRIBE | InscribedHFT (Markdown file on disk) |
| `/rehydrate` | Stage start (read) | InscribedHFT | ENTER | ResumedHorizon (session primed) |
| `/recollect` | Past context recall | Hypomnesis sub-index | RECOGNIZE | RecalledContext (session text) |
| `/probe` | Present situation | Deficit fit review | RECOGNIZE | ProtocolRoute (session text) |
| `/induce` | In-process abstraction | Instance set | INDUCE | CrystallizedAbstraction (session text) |

The /crystallize and /rehydrate pair is distinct from the other recall-family skills by *artifact persistence*: HFT is a Markdown file written to disk and consumed by future sessions, while session text outputs (RecalledContext, ProtocolRoute, CrystallizedAbstraction) live only in the originating session's transcript.

The HFT format itself is specified at `references/hft-format.md`. This skill assumes that spec; do not redefine layer structure here.

## Protocol

### Phase 0: Stage Transition Detection

Determine whether this invocation is at a legitimate stage transition. Two signals:

1. **Explicit stage argument** — `/crystallize <stage-name>` provides a kebab-case stage identifier; treat as authoritative
2. **Implicit transition signal** — `/crystallize` alone; infer the stage from current branch name (strip `feat/`, `fix/`, `refactor/` prefixes), recent commits, and open PR title. Surface the inferred stage to the user for confirmation before proceeding

Phase 0 is silent for the explicit case and presents a one-line confirmation for the implicit case.

If neither signal yields a stage identifier, deactivate with a brief no-op note and ask the user to invoke `/crystallize <stage-name>`.

### Phase 1: Predecessor Loading

Locate the predecessor HFT (if any) for inheritance.

Search procedure:
1. Look in `~/.claude/plans/` for files matching `<stage-pattern>*.md` where stage-pattern is derived from current branch tokens
2. If multiple candidates exist, prefer the one whose frontmatter `inherits_from` chain is longest (most recent in the stage lineage)
3. If none exist, treat this as the first stage of the track — predecessor is null

When a predecessor is loaded, read its full content. Subsequent phases reference it for:
- Wirkungsgeschichte verbatim copy (Formation Trajectory, Rejected Alternatives, External Priors)
- Inheritance comparison (which Surface Text fields the user might keep verbatim vs refresh)

Phase 1 emits no surfacing. The loaded predecessor becomes the inheritance baseline for Phases 2–4.

### Phase 2: Surface Text Distillation

Distill the live session horizon into Surface Text. Three subsections (per `references/hft-format.md`):

1. **Design Concept** — one paragraph capturing the strategic intent of the work. Draft from session decisions, then present for user approval. Do not fabricate; if the AI cannot draft from observed session content, ask the user to supply the paragraph
2. **Ubiquitous Language** — bullet list of `term — meaning` pairs for vocabulary settled in this session. Draft from terms the AI observed crystallizing during the session; present for user review
3. **Sache** — one sentence answering "what is this conversation about?". Draft from the session's pivotal subject; present for user approval

Length constraint: combined Surface Text must remain under ~1500 words / ~120 lines. If draft exceeds, present the violation to the user with an option to compress, move detail to Wirkungsgeschichte, or accept oversize as a recorded exception.

Present the assembled draft via Cognitive Partnership Move (Constitution). User options: Accept · Modify(subsection, direction) · Reject (start over) · Free response (rewrite directly).

### Phase 3: Wirkungsgeschichte Delta Extraction

Extract new entries since the predecessor. Three subsections, append-only:

1. **Formation Trajectory** — ordered list of stage transitions or pivotal decision moments since predecessor. Each entry: timestamp or moment-id + one-line summary
2. **Rejected Alternatives** — alternatives considered and dismissed in this stage, with reason. Each entry: alternative + dismissal rationale
3. **External Priors** — outside traditions cited in this stage that fused into the horizon. Each entry: source + influence summary

If the predecessor exists, prepend its Wirkungsgeschichte verbatim before the new entries (append-only semantics). If no predecessor, the new entries are the entire Wirkungsgeschichte.

Empty subsection handling: when the stage genuinely produced no entries for a subsection, emit `_(none in this stage)_` rather than omitting the subsection. Silent omission loses the negative-information signal.

Present the delta via Cognitive Partnership Move (Constitution). User options: Accept · Modify(entry, direction) · Reject · Free response.

### Phase 4: Reference Shell Enumeration

Collect anchors to auxiliary substrates. Four subsections:

1. **Session Anchors** — `previous_session_id` (current session ID), current `branch`, optional `pr_number` (from `gh pr view --json number 2>/dev/null`)
2. **File Anchors** — file paths the work touched. Source: `git diff --name-only <predecessor-baseline>..HEAD` if predecessor frontmatter `git_head` is available, else `git diff --name-only main..HEAD`
3. **External References** — URLs to external materials cited in the session (videos, articles, prior memos)
4. **Task Anchors** — `~/.claude/tasks/<previous_session_id>/` per stage (the per-session task substrate path), mechanically derivable from `previous_session_id`. Multi-stage HFT accumulates one path per inherited stage per the Reference Shells refresh policy (update in place, stale anchors retained). Inscribed for cross-session anchor task discovery via `/inquire` or `/recollect`

No-data invariant: Reference Shell entries are paths or URLs only. Do not inline content from any anchored substrate. Inlining auto-memory, hypomnesis, or task substrate content into HFT body collapses topology separation.

Default behavior: auto-collect when all four subsections are mechanically determinable (current session ID is known, `git diff` returns paths, URLs come from session context, task path derives from session ID). Auto-collected anchors flow into Phase 5 final approval where they are reviewed alongside the rest of the HFT draft. Surface a Cognitive Partnership Move (Constitution) with options Accept · Modify(anchor, direction) · Reject · Free response only when an anchor source is ambiguous (e.g., multiple plausible PRs to cite, or the user has explicitly requested manual review). The default and the Constitution path together honor the elidable annotation in ELIDABLE CHECKPOINTS — Phase 5 Qc remains the binding gate.

### Phase 5: Excluded Layer + Frontmatter Confirmation

Default Excluded entries (always present unless rationale changes):
- `auto-memory MEMORY.md body` — separate topology
- `hypomnesis sub-index body` — separate topology
- `per-session task substrate body` — separate topology
- `tactical execution traces` — regenerable from Surface Text + Wirkungsgeschichte

Frontmatter assembly:
- `hft_format_version: 1`
- `stage: <kebab-case identifier from Phase 0>`
- `generated_at: <YYYY-MM-DD>`
- `git_head: <git rev-parse HEAD>`
- `inherits_from: <predecessor path or null>`
- `stage_classification: stage-1-conjecture` (default; do not auto-promote)
- `n1_dogfooding_caveat: true` (default; surfaces in `/rehydrate`)

Present full HFT preview (frontmatter + four layers) via Cognitive Partnership Move (Constitution). User options: Approve (write to disk) · Revise(layer) (return to that phase) · Cancel (no-op deactivation).

### Phase 6: Inscription

On approval, write the HFT to `~/.claude/plans/<stage>.md`.

If a file already exists at the path (re-inscription of an existing stage), append a dated revision section at the bottom of the predecessor's Wirkungsgeschichte rather than overwriting. The frontmatter `generated_at` and `git_head` update; `inherits_from` remains pointing to the original predecessor.

After write, emit anchor tasks: `TaskCreate` once per significant follow-up step the HFT identifies. Each task carries metadata `{source: "crystallize-hft", plan: "<path>", stage: "<id>"}` so `/rehydrate` can filter on it.

Convergence trace (per Convergence Evidence rule): present a summary mapping
- Surface Text → drafted from / approved by user
- Wirkungsgeschichte → entries appended (count, with reference to predecessor verbatim)
- Reference Shells → anchors collected (count by type)
- Excluded → default + project-specific entries
- File path written
- Tasks emitted (IDs)

```
── FLOW ──
G → recognize(G, stage_signal) → stage_id →
  load_predecessor(stage_id) → P_prev →
  distill_surface(session_state) → S → Qs(S) → Stop → A_S → integrate(A_S, S) →
  extract_wirkungsgeschichte_delta(session_state, P_prev) → W_delta → Qs(W_delta) → Stop → A_W → integrate(A_W, W_delta) →
  enumerate_reference_shells(session_state) → R → Qs(R) → Stop → A_R → integrate(A_R, R) →
  assemble(S, P_prev.W + W_delta, R, Excluded, frontmatter) → HFT_draft →
  Qc(HFT_draft, approve) → Stop → V →
    Approve: write_hft(HFT_draft, path) → emit_anchor_tasks → converge
    Revise(layer): return to corresponding distill/extract/enumerate phase
    Cancel: deactivate

── MORPHISM ──
SessionState
  → recognize(stage_signal)              -- user invokes or work-completion signal
  → load_predecessor(stage_id)           -- inheritance baseline
  → distill_surface(state)               -- compress to Vorverständnis primer
  → extract_wirkungsgeschichte_delta(state, predecessor)
                                         -- new entries since predecessor (append-only)
  → enumerate_reference_shells(state)    -- anchors only, no data
  → assemble(layers, frontmatter)        -- four-layer HFT structure
                                         -- invariant: HFT_draft.W_full = P_prev.W + W_delta
                                         --            (verbatim predecessor + append-only delta)
  → inscribe_hft(path)                   -- atomic write
  → emit_anchor_tasks(plan_path)         -- TaskList entries pointing into HFT
  → InscribedHFT
requires: stage_transition(G)             -- runtime checkpoint (Phase 0)
deficit:  HorizonUninscribed              -- activation precondition (Layer 1/2)
preserves: predecessor_HFT                -- predecessor read-only; new HFT is product
invariant: Topology Separation, Asymmetric Layer Refresh

── TYPES ──
G              = StageSignal { argument: Optional(String), inferred: Optional(String) }
SessionState   = { transcript_window, decisions, terminology, files_touched, urls_cited }
P_prev         = Optional(InscribedHFT)            -- predecessor file content + frontmatter
S              = SurfaceText { design_concept: String, ubiquitous_language: List<(term, meaning)>, sache: String }
W              = Wirkungsgeschichte { trajectory: List<Entry>, rejected: List<Entry>, priors: List<Entry> }
W_delta        ⊂ Wirkungsgeschichte                 -- proper subset: current-stage entries only (each list ⊂ corresponding W list)
R              = ReferenceShells { session: List<KV>, files: List<Path>, urls: List<URL>, tasks: List<Path> }
                 -- tasks: per-session task substrate paths (~/.claude/tasks/<session_id>/); mechanically derivable from session_id
Excluded       = List<(substrate, rationale)>
Frontmatter    = { hft_format_version, stage, generated_at, git_head, inherits_from, stage_classification, n1_dogfooding_caveat }
HFT_draft      = { frontmatter, S, W_full, R, Excluded }
                 -- W_full invariant: see assemble(...) in MORPHISM
InscribedHFT   = { path, content: HFT_draft }       -- written to ~/.claude/plans/<stage>.md
A_S, A_W, A_R  = UserResponse ∈ {Accept, Modify(subsection, direction), Reject, FreeResponse}
V              = ApprovalResponse ∈ {Approve, Revise(layer), Cancel}
Qs             = Per-layer co-construction Constitution interaction
Qc             = Final approval Constitution interaction

── PHASE TRANSITIONS ──
Phase 0:  G → recognize(G) → stage_id                                  -- silent for explicit_arg, one-line confirm for inferred
Phase 1:  stage_id → load_predecessor(stage_id) → P_prev               -- read-only baseline
Phase 2:  state → distill_surface → S → Qs(S) → Stop → A_S → integrate -- co-construct Surface Text [Tool]
Phase 3:  state, P_prev → extract_wirkungsgeschichte_delta → W_delta → Qs(W_delta) → Stop → A_W → integrate
                                                                        -- co-construct Wirkungsgeschichte [Tool]
Phase 4:  state → enumerate_reference_shells → R → Qs(R) → Stop → A_R → integrate
                                                                        -- co-construct Reference Shells [Tool]
Phase 5:  S, W_full, R, Excluded, Frontmatter → assemble → HFT_draft → Qc(HFT_draft) → Stop → V
                                                                        -- final approval [Tool]
Phase 6:  V = Approve → write_hft → emit_anchor_tasks → converge       -- inscribe + tasks

── LOOP ──
Phase 5 V branches:
  Approve            → Phase 6 (terminal)
  Revise(Surface)    → return to Phase 2
  Revise(Wirk)       → return to Phase 3
  Revise(Ref)        → return to Phase 4
  Cancel             → deactivate (no write)
Max 3 revise cycles per layer; on exhaustion surface unresolved draft and ask the user to either Approve as-is or Cancel.

── CONVERGENCE ──
inscribed = V = Approve ∧ write_hft succeeded
trace(InscribedHFT) = { surface_approved, wirk_appended, refs_collected, excluded_finalized, path, tasks_emitted }
session_text(crystallize) ∋ trace

── TOOL GROUNDING ──
Phase 0 recognize    (sense)        → Internal analysis (stage signal recognition)
Phase 1 load_predecessor (observe)  → Read, Glob (predecessor HFT lookup)
Phase 2 distill_surface (sense)     → Internal analysis (compress session state)
Phase 2 Qs           (constitution) → present (Surface Text co-construction)
Phase 3 extract_wirk (sense)        → Internal analysis (delta extraction)
Phase 3 Qs           (constitution) → present (Wirkungsgeschichte co-construction)
Phase 4 enumerate_ref (observe)     → Bash (git diff --name-only, gh pr view)
Phase 4 Qs           (constitution) → present (Reference Shells co-construction)
Phase 5 assemble     (sense)        → Internal analysis (four-layer assembly)
Phase 5 Qc           (constitution) → present (final approval)
Phase 6 write_hft    (extension)    → Write (HFT inscription)
Phase 6 emit_anchor_tasks (extension) → TaskCreate (anchor tasks)
converge             (extension)    → TextPresent+Proceed (convergence trace)

── ELIDABLE CHECKPOINTS ──
Phase 0 confirm (inferred stage) → elidable when: explicit_arg(stage) provided
                                    default: present one-line confirm for inferred stage
                                    regret: bounded (Phase 5 Qc final approval still gates write)
Phase 2 Qs (Surface)             → always_gated (Constitution: Surface Text is the user-facing primer; user authority IS resolution)
Phase 3 Qs (Wirkungsgeschichte)  → always_gated (Constitution: rejected-alternatives and trajectory carry user judgment)
Phase 4 Qs (Reference Shells)    → elidable when: anchors are mechanically determinable (current session_id, git diff, gh pr view) and user has not requested manual review
                                    default: auto-collect; surface assembled list for review at Phase 5 Qc
                                    regret: bounded (Phase 5 Qc still allows revise)
Phase 5 Qc (final approval)      → always_gated (Constitution: writing to disk is the binding act; cannot be elided)

── MODE STATE ──
Λ = { phase: Phase, G: StageSignal, stage_id: String,
      P_prev: Optional(InscribedHFT),
      S: Optional(SurfaceText), W_delta: Optional(Wirkungsgeschichte),
      R: Optional(ReferenceShells), Excluded: List<(substrate, rationale)>,
      frontmatter: Optional(Frontmatter), HFT_draft: Optional(HFT),
      revise_count: { surface: Nat, wirk: Nat, ref: Nat },
      active: Bool, cause_tag: String }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges not applicable (/crystallize is a utility skill, intentionally absent from graph.json).
   Prose-level advisory only: Hermeneia · Periagoge · Telos → /crystallize at stage closure (no enforced edge).
   Pair: /crystallize (write) ↔ /rehydrate (read) share references/hft-format.md as format contract (duplicated into each skill's references/ for standalone-installable self-containment).
```

## Rules

1. **User-invoked**: `/crystallize` activates only on explicit invocation. AI auto-activation is forbidden — stage transition signals merely *suggest* invocation, never trigger it
2. **Single-medium inscription**: HFT is one Markdown file. Auxiliary substrates (auto-memory, hypomnesis) remain operationally distinct; only Reference Shell anchors point to them
3. **Topology separation invariant**: Reference Shells contain pointers only. Inlining body content from any anchored substrate = protocol violation
4. **Asymmetric refresh**: Surface Text is replaced per stage; Wirkungsgeschichte is append-only; Reference Shells update in place; Excluded changes only when topology changes
5. **Inheritance verbatim**: when a predecessor exists, its Wirkungsgeschichte appears verbatim in the new HFT before the delta — never edited, never compressed
6. **Empty-section explicit signal**: an empty Wirkungsgeschichte subsection emits `_(none in this stage)_` rather than being omitted; silent omission loses the negative-information signal
7. **Recognition over Recall**: each Phase 2–5 Constitution interaction presents structured options (Accept/Modify/Reject for layer co-construction; Approve/Revise/Cancel for final). Free response remains available
8. **Detection with user authority**: AI distills draft content; user approves, modifies, or rejects. AI never writes to disk without Phase 5 Approve
9. **Stage 1 caveat surface**: every emitted HFT carries `stage_classification: stage-1-conjecture` and `n1_dogfooding_caveat: true` in frontmatter; do not auto-promote
10. **No fabrication**: Surface Text fields (Design Concept, Ubiquitous Language, Sache), Wirkungsgeschichte entries (Formation Trajectory, Rejected Alternatives, External Priors) must be drafted from observable session content. When the AI cannot draft, ask the user; do not invent
11. **No auto-hooks**: this skill does not register SessionEnd, PreCompact, or SessionStart hooks. Hooks are out of scope for the present GoalContract
12. **Convergence evidence**: present transformation trace before declaring inscription complete. Per-layer evidence is required
13. **Context-Question Separation**: each Constitution interaction places analysis as text before the gate; the gate contains only options with differential implications
14. **Length discipline**: Surface Text body ≤ 1500 words. On exceed, surface the violation; do not silently truncate
15. **Format spec adherence**: HFT structure follows `references/hft-format.md`. Do not redefine layer schema in this skill; defer to the format spec for any interpretive question

## UX Safeguards

- **Predecessor loading is silent** — no surfacing if predecessor is uniquely determined; surface only if multiple candidates exist or none match the inferred stage
- **Phase 4 elision honored** — Reference Shells auto-collect when mechanically determinable; user reviews at Phase 5
- **Cancel is always available** — Phase 5 Cancel deactivates without writing; no partial state persists between invocations
- **Re-inscription appends, never overwrites** — re-running on an existing stage path appends a dated revision section; predecessor inheritance chain is preserved
- **Stage 1 caveat surface in convergence trace** — final report includes a one-line caveat reminding the user that this format is Stage 1 conjecture
- **Vocabulary discipline** — output uses "horizon", "Wirkungsgeschichte", "Reference Shells", "Surface Text"; the skill never speaks of "data backup" or "state save" (those framings collapse the hermeneutic distinction this format aims to preserve)

## Trigger Signals

Invoke `/crystallize` when:
- A stage of multi-segment work just closed (PR merged, decision committed, work segment complete)
- A session boundary is imminent (`/compact` about to run, end of working session)
- The user wants the next session to first-utter from the current horizon without re-asking for context

## Skip Conditions

Skip `/crystallize` when:
- Single-session work where context stays loaded
- Trivial tasks where horizon residue does not exceed what TaskList alone preserves
- Exploratory turns without a stage closure
- Pattern-based recommendation, analytics, or learning is the actual need (those are `/onboard`, `/report`, `/dashboard`)

## Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Phase 5 Approve | Inscription written, anchor tasks emitted, mode deactivates |
| Phase 5 Cancel | No write; mode deactivates without artifact |
| User Esc | Ungraceful exit; no partial state retained |
| Phase 2/3/4 revise cap exhausted | Surface unresolved draft; ask user to Approve-as-is or Cancel |

## Stage 1 Conjecture (N=1 Dogfooding)

This skill is a Stage 1 (Compile) conjecture. Structural fit was established via a single dogfooding session crystallizing the HFT format from concrete instance set into a four-layer abstraction (see `references/hft-format.md` for the format spec's own Stage 1 caveat). Stage 2 (Runtime) use-corroboration is pending — accumulating cross-session inscriptions across user-context variation. Architectural inscription (e.g., promoting HFT as a normative substrate format for other utilities, registering auto-hooks) is deferred until variation-stable retention evidence accumulates.

When in doubt about a phase or rule under live use, prefer fidelity to the contract over local convenience; report any tension as Stage 2 evidence rather than silently relaxing the constraint.

## Anti-Patterns

- Activating without explicit `/crystallize` invocation — stage transition signals do not trigger this skill
- Inlining auto-memory or hypomnesis body into HFT layers — collapses topology separation
- Rewriting predecessor Wirkungsgeschichte during inheritance — destroys effective-historical consciousness
- Surface Text growing without bound across stages — defeats 1-pass primer function
- Skipping `_(none in this stage)_` for empty Wirkungsgeschichte subsections — loses negative-information signal
- Auto-promoting `stage_classification` away from `stage-1-conjecture` — violates Deficit Empiricism
- Writing to disk before Phase 5 Approve — Constitution boundary violation
- Inferring stage identifier without surfacing the inference for user confirmation — silent identity establishment violates user authority
