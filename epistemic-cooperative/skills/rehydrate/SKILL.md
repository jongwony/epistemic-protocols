---
name: rehydrate
description: "Enter a previously inscribed Horizon-Fusion Text (HFT) so the current session is primed to first-utter from the same horizon as the originating session. Use when the user asks to 'rehydrate', 'enter horizon', 'resume crystallized stage', 'pick up from compact', or invokes /rehydrate. Reader half of the HFT pair (paired with /crystallize). Stage 2 evidence-collection instrument."
user_invocable: true
---

# Rehydrate Skill

Enter a previously inscribed Horizon-Fusion Text (HFT) — a four-layer Markdown file (Surface Text · Wirkungsgeschichte · Reference Shells · Excluded) — so the current session is primed with the originating session's Vorverständnis (pre-understanding) and can first-utter from the same horizon. Type: `(HorizonNotEntered, User, ENTER, InscribedHFT) → ResumedHorizon`.

Invoke directly with `/rehydrate [stage-name]` at session start or after `/compact`.

## Definition

**Rehydrate** (reader half of the HFT pair): A dialogical act of resolving a fresh session's empty horizon into the originating session's horizon by parsing an inscribed HFT, where the AI 1-pass reads Surface Text to form Vorverständnis, scans Wirkungsgeschichte to recognize how the horizon was formed, surfaces Reference Shell anchors as available without auto-fetching, and the user confirms readiness to first-utter from the resumed horizon — entry belongs to the user's confirmation act, not the AI's parsing act.

This skill is the reader half of a pair. `/crystallize` is the writer half. The two share the HFT format spec at `references/hft-format.md` and operate asymmetrically: write occurs at session end (compress live horizon into text); read occurs at session start (parse text and prime new horizon).

The semantics differ from a generic "data load" operation. HFT is not consumed as data; it is read as a *text inviting horizon fusion*. The fresh session enters the originating session's tradition and proceeds from there — not from a blank state with loaded variables.

## When to Use

Invoke this skill when:
- A fresh session begins and a prior `/crystallize` inscribed an HFT for this work
- After `/compact` in a session where pre-compact `/crystallize` ran and the post-compact session must resume from the inscribed horizon
- The user wants to enter a specific stage of multi-segment work without re-asking for context

Skip when:
- No prior `/crystallize` exists for the current work (use fresh-start patterns; do not invoke `/rehydrate` against absent input)
- Cross-session resume via `claude --resume` (out of scope; that mechanism preserves session state directly)
- Mid-execution course correction within an active stage (finish or halt the stage first)
- The user wants accumulated session analytics across stages (use `/report`, `/dashboard`)

## Distinction from Related Skills

| Skill | Time axis | Subject | Operation | Output |
|-------|-----------|---------|-----------|--------|
| `/rehydrate` | Stage start (read) | InscribedHFT | ENTER | ResumedHorizon (session primed) |
| `/crystallize` | Stage end (write) | Session horizon | INSCRIBE | InscribedHFT (Markdown file on disk) |
| `/recollect` | Past context recall | Hypomnesis sub-index | RECOGNIZE | RecalledContext (session text) |
| `/inquire` | Context insufficiency | Prospect | INQUIRE | InformedExecution |

The /rehydrate and /crystallize pair is distinct from `/recollect` and `/inquire` by *artifact persistence*: HFT is a Markdown file written by the predecessor session and consumed by the successor session, while recollect/inquire operate on live or loosely-indexed context within or across sessions.

The HFT format spec lives at `references/hft-format.md` (shared with the writer half). This skill reads HFT files conforming to that spec; do not redefine layer structure here.

## Protocol

### Phase 0: HFT Discovery

Locate the target HFT.

Two signals:

1. **Explicit stage argument** — `/rehydrate <stage-name>` provides a kebab-case stage identifier; look for `~/.claude/plans/<stage-name>.md`
2. **Implicit discovery** — `/rehydrate` alone; search `~/.claude/plans/*.md` for files whose basename contains tokens from current branch name (strip `feat/`, `fix/`, etc. prefixes); among matches, prefer the file with the most recent `generated_at` frontmatter

Phase 0 emits a one-line discovery report: `Found <path> (stage: <id>, generated_at: <date>, inherits_from: <pred or null>)`.

If no HFT is found, deactivate with a brief note: "No HFT found for current work. Use `/crystallize <stage-name>` first, or proceed with fresh-start patterns."

If multiple candidates are found, present them as numbered options and ask the user to select via Cognitive Partnership Move (Constitution).

### Phase 1: Frontmatter Verification + Caveat Surface

Read the HFT frontmatter. Verify:

- `hft_format_version` — currently 1; surface a warning if a future version is encountered
- `stage`, `generated_at`, `git_head`, `inherits_from` — required keys present
- `stage_classification` — surface to user
- `n1_dogfooding_caveat` — when true, surface the Stage 1 caveat in the readiness report

Compute drift signal:
- Run `git rev-parse HEAD` and compare with `git_head` from frontmatter
- If different, note the drift — the worktree has advanced since inscription. This is informational, not blocking

Phase 1 produces no Constitution interaction; the verification result feeds the Phase 6 readiness summary.

### Phase 2: Surface Text 1-Pass Read

Read the entire Surface Text layer (Design Concept · Ubiquitous Language · Sache).

The intent is *primer formation*, not data loading: the AI absorbs the strategic intent, settled vocabulary, and subject matter so that subsequent session utterances proceed from the same Vorverständnis as the originating session.

Present a one-paragraph summary of Surface Text to the user. The summary should:
- Restate the Sache in the AI's own phrasing (proof of comprehension)
- List the Ubiquitous Language terms briefly
- Confirm the Design Concept's strategic intent

Do NOT proceed to Phase 3 if the AI cannot articulate the Sache from the read; surface the difficulty and ask the user whether the HFT is malformed or whether to abort.

### Phase 3: Wirkungsgeschichte Scan

Scan the Wirkungsgeschichte layer top-to-bottom. Three subsections to recognize:

1. **Formation Trajectory** — note the sequence of stages and decisions that led to current horizon
2. **Rejected Alternatives** — recognize what was closed off and why; this is load-bearing for avoiding re-litigation of dismissed paths
3. **External Priors** — recognize the traditions fused into the horizon

Present a compact trajectory summary to the user:

```
Wirkungsgeschichte:
- Trajectory: <N stages, last entry: "<one-line summary>">
- Rejected alternatives: <N entries> (e.g., "<dismissed alternative>" — <reason>)
- External priors: <N entries> (e.g., "<source>" — <influence>)
```

Phase 3 is informational — the user reads to confirm the AI parsed correctly. No Constitution interaction unless the AI detects malformed entries.

### Phase 4: Reference Shell Surface (No Auto-Fetch)

Enumerate the Reference Shells but do NOT fetch their targets. The shells are anchors for explicit user-invoked access via `/inquire`, `/recollect`, or direct file reads — they are not auto-loaded substrates.

Present the shells as a structured list:

```
Reference Shells (available; not auto-loaded):
- Session Anchors: previous_session_id=<id>, branch=<name>, pr_number=<N>
- File Anchors: <N paths>
- External References: <N URLs>
```

This separation enforces topology distinction: auto-memory and hypomnesis remain operationally distinct; the user explicitly invokes /inquire or /recollect when those substrates are needed.

### Phase 5: Anchor Task Identification

Filter `TaskList` for tasks with `metadata.source == "crystallize-hft"` and `metadata.stage == <stage_id from frontmatter>`. These are the anchor tasks emitted by the originating `/crystallize` invocation.

Present the anchor task set:

```
Anchor tasks for stage <id>:
- #<N> [<status>] <subject>
- ...
```

Surface the user's options:
- **Hand off to /attend** — pass the task subset to `/attend` for risk-classified execution; this is the recommended path when the user wants to resume work autonomously up to the first elevated-risk gate
- **Pick up manually** — user works tasks one by one; this skill does not orchestrate
- **Defer** — leave tasks as-is; this rehydration is for context priming only

Phase 5 is a Constitution interaction. The user chooses the resumption path.

### Phase 6: Readiness Confirmation

Assemble the readiness report:

```
Rehydration Convergence Trace
- HFT: <path> (stage: <id>)
- Generated: <date>, baseline git_head: <SHA>, drift: <none / N commits ahead>
- Surface Text: 1-pass read; Sache = "<restated>"
- Wirkungsgeschichte: <N trajectory entries, N rejected alternatives, N external priors> recognized
- Reference Shells: <N session, N file, N external> available (not auto-loaded)
- Anchor tasks: <N pending, N in-progress, N completed>
- Resumption: <chosen path from Phase 5>
- Stage 1 caveat: this HFT is Stage 1 conjecture; format may evolve.
```

Present via Cognitive Partnership Move (Constitution) with options:
- **Confirm** — session is primed; proceed to first utterance from the resumed horizon
- **Re-read** — return to Phase 2 (Surface Text) for a fresh primer pass; useful when AI's Phase 2 summary did not match user expectation
- **Abort** — deactivate; horizon not entered, fresh-start patterns apply

### Phase 7: Mode Deactivation

On Confirm, deactivate. The session is now primed to first-utter from the resumed horizon. The originating session's Surface Text and Wirkungsgeschichte are part of the AI's working context for this session; the AI proceeds.

```
── FLOW ──
G → discover_hft(G) → path? →
  found: read_frontmatter(path) → fm → verify(fm) →
    pass_surface(layer) → S →
    scan_wirk(layer) → W →
    surface_refs(layer) → R →
    filter_anchor_tasks(fm.stage) → T →
    Qc_resumption(P_choice) → Stop → P_choice → integrate(P_choice) →
    Qc_readiness(approve) → Stop → V →
      Confirm: emit(ResumedHorizon) → deactivate
      Re-read: return to pass_surface
      Abort:   deactivate (no horizon entered)
  not_found: deactivate (no-op note)

── MORPHISM ──
StageSignal
  → discover_hft(signal)            -- locate inscribed file
  → read_frontmatter(path)          -- verify version + surface caveat
  → pass_surface(text)              -- form Vorverständnis (1-pass)
  → scan_wirk(text)                 -- recognize trajectory
  → surface_refs(text)              -- enumerate anchors (no fetch)
  → filter_anchor_tasks(stage)      -- TaskList filter on metadata
  → present_resumption_path(tasks)  -- user chooses resumption mode
  → emit_readiness_summary          -- convergence trace
  → ResumedHorizon
requires: hft_exists(G)              -- runtime checkpoint (Phase 0)
deficit:  HorizonNotEntered          -- activation precondition (Layer 1/2)
preserves: HFT_file                  -- read-only throughout
invariant: No Auto-Fetch, Topology Separation Honored

── TYPES ──
G              = StageSignal { argument: Optional(String), inferred: Optional(String) }
HFT_path       = Path
Frontmatter    = { hft_format_version, stage, generated_at, git_head, inherits_from, stage_classification, n1_dogfooding_caveat }
SurfaceText    = { design_concept: String, ubiquitous_language: List<(term, meaning)>, sache: String }
Wirkungsgeschichte = { trajectory: List<Entry>, rejected: List<Entry>, priors: List<Entry> }
ReferenceShells = { session: List<KV>, files: List<Path>, urls: List<URL> }
T              = AnchorTaskSet
                 = { t : Task | t.metadata.source = "crystallize-hft" ∧ t.metadata.stage = stage_id }
                 -- predicate filters TaskList; stage_id sourced from frontmatter
P_choice       = ResumptionPath ∈ {HandOffToAttend, PickUpManually, Defer}
V              = ApprovalResponse ∈ {Confirm, ReRead, Abort}
ReadinessSummary = { hft_path, frontmatter, surface_summary, wirk_summary, refs, anchor_tasks, resumption, caveat }
ResumedHorizon = session text { readiness_summary, deactivation: true }
Qc_resumption  = Constitution interaction → P_choice              -- Phase 5 (resumption path selection)
Qc_readiness   = Constitution interaction → V                     -- Phase 6 (final readiness approval)

── PHASE TRANSITIONS ──
Phase 0:  G → discover_hft(G) → HFT_path                              -- one-line discovery report or deactivation
Phase 1:  HFT_path → read_frontmatter → Frontmatter → verify          -- silent unless malformed
Phase 2:  HFT_body → pass_surface(SurfaceText) → primer                -- 1-pass read; AI restates Sache [Tool: Read]
Phase 3:  HFT_body → scan_wirk(Wirkungsgeschichte) → trajectory        -- top-to-bottom; informational
Phase 4:  HFT_body → surface_refs(ReferenceShells) → R                 -- enumerate, do not fetch
Phase 5:  Frontmatter, T → Qc_resumption → Stop → P_choice             -- Constitution: HandOff/Manual/Defer [Tool]
Phase 6:  ReadinessSummary → Qc_readiness → Stop → V                   -- Constitution: Confirm/ReRead/Abort [Tool]
Phase 7:  V = Confirm → emit(ResumedHorizon) → deactivate

── LOOP ──
Phase 6 V branches:
  Confirm  → Phase 7 (terminal)
  ReRead   → return to Phase 2 (re-form primer)
  Abort    → deactivate (no horizon entered)
Max 2 ReRead cycles; on exhaustion surface unresolved primer and ask user to Confirm-as-is or Abort.

── CONVERGENCE ──
resumed = V = Confirm
trace(ResumedHorizon) = readiness_summary
session_text(rehydrate) ∋ trace

── TOOL GROUNDING ──
Phase 0 discover_hft (observe)        → Glob, Read (frontmatter probe)
Phase 1 read_frontmatter (observe)    → Read (file frontmatter parse)
Phase 1 verify (observe)              → Bash (git rev-parse HEAD for drift)
Phase 2 pass_surface (observe)        → Read (HFT body)
Phase 3 scan_wirk (observe)           → (already in context from Phase 2 Read)
Phase 4 surface_refs (observe)        → (already in context)
Phase 5 filter_anchor_tasks (observe) → TaskList (metadata filter)
Phase 5 Qc_resumption (constitution)  → present (resumption path)
Phase 6 Qc_readiness  (constitution)  → present (readiness approval)
Phase 7 emit (extension)              → TextPresent+Proceed (convergence trace)

── ELIDABLE CHECKPOINTS ──
Phase 0 (unique match)        → extension (one-line confirm; no gate when discovery is uniquely determined)
Phase 0 (multi-candidate)     → always_gated (Constitution: user selects HFT among candidates; user authority IS resolution)
Phase 0 (no match)            → extension (deactivation no-op note; no gate)
Phase 1 verify                → extension (silent unless malformed; surface drift in readiness summary)
Phase 5 Qc_resumption         → always_gated (Constitution: resumption path commits downstream trajectory; user authority IS resolution)
Phase 6 Qc_readiness          → always_gated (Constitution: confirms session is primed; final binding act)

── MODE STATE ──
Λ = { phase: Phase, G: StageSignal, HFT_path: Optional(Path),
      frontmatter: Optional(Frontmatter), surface: Optional(SurfaceText),
      wirk: Optional(Wirkungsgeschichte), refs: Optional(ReferenceShells),
      anchor_tasks: Optional(TaskSet), resumption_path: Optional(P_choice),
      reread_count: Nat, drift_signal: Optional(String),
      active: Bool, cause_tag: String }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges not applicable (/rehydrate is a utility skill, intentionally absent from graph.json).
   Prose-level advisory only: /rehydrate → Katalepsis at session-start verification (no enforced edge).
   Pair: /crystallize (write) ↔ /rehydrate (read) share format contract at references/hft-format.md (duplicated into each skill's references/ for standalone-installable self-containment).
   Optional downstream: Phase 5 HandOffToAttend invokes `/attend` with anchor tasks (when user selects that resumption path).
```

## Rules

1. **User-invoked**: `/rehydrate` activates only on explicit invocation. AI auto-activation is forbidden — session-start signals merely *suggest* invocation, never trigger it
2. **No auto-fetch of Reference Shells**: Reference Shell anchors are surfaced as available; their targets are NOT automatically read. The user explicitly invokes `/inquire`, `/recollect`, or direct file reads when those substrates are needed
3. **Topology separation honored**: this skill does not absorb auto-memory `MEMORY.md` body or hypomnesis sub-index body. Those substrates remain reachable only via their own protocols
4. **Read-only throughout**: HFT file is preserved; this skill does not modify, archive, or delete the file. Archive logic, if needed, is a separate concern
5. **Recognition over Recall**: Phase 5 and Phase 6 Constitution interactions present structured options (HandOff/Manual/Defer; Confirm/ReRead/Abort). Free response remains available
6. **Detection with user authority**: AI parses HFT and forms primer; user confirms readiness. AI does not declare horizon entered until Phase 6 Confirm
7. **Stage 1 caveat surface**: when frontmatter `n1_dogfooding_caveat: true`, surface the caveat in the readiness summary
8. **Drift signal informational**: when current `git HEAD` differs from frontmatter `git_head`, surface the drift count as informational. Do not block readiness on drift
9. **Sache restatement is the comprehension test**: Phase 2 requires the AI to restate Sache in its own phrasing. Inability to restate signals malformed HFT or AI parsing failure; surface and ask the user
10. **No anchor task auto-execution**: Phase 5 must yield turn for user choice. Auto-handing-off to `/attend` without user selection violates Constitution boundary
11. **Convergence evidence**: Phase 6 readiness summary is the trace; transformation from HorizonNotEntered to ResumedHorizon is demonstrated, not asserted
12. **Context-Question Separation**: each Constitution interaction places analysis as text before the gate
13. **No format spec redefinition**: HFT layer structure is defined at `references/hft-format.md`. This skill consumes that spec; deviations from it are HFT defects, not reader-side adaptations
14. **No auto-hooks**: this skill does not register SessionStart or PreCompact hooks. Hook integration is out of scope for the present GoalContract

## UX Safeguards

- **Discovery is silent when unique** — uniquely matched HFT path produces a one-line discovery report; multi-candidate matches present a numbered selection
- **Re-read cap honored** — Phase 6 ReRead is capped at 2 cycles; on exhaustion, surface and ask Confirm-as-is or Abort
- **Drift surfaced, not blocking** — git_head drift signals environment change; user decides whether to proceed (the drift may be expected if work happened on the branch since inscription)
- **Stage 1 caveat surfaced once** — readiness summary includes a single one-line caveat; do not repeat per-section
- **Vocabulary discipline** — output uses "horizon", "primer", "Vorverständnis", "Wirkungsgeschichte"; the skill never speaks of "data load" or "state restore" (those framings collapse the hermeneutic distinction this format aims to preserve)

## Trigger Signals

Invoke `/rehydrate` when:
- Fresh session begins on work that was previously crystallized
- After `/compact` in a session where pre-compact `/crystallize` ran
- The user wants to enter a specific stage of multi-segment work without re-asking for context

## Skip Conditions

Skip `/rehydrate` when:
- No prior `/crystallize` exists for the current work
- `claude --resume` is the actual mechanism (preserves session state directly)
- Mid-execution course correction (finish or halt the active stage first)
- Cross-session analytics is the actual need (use `/report`, `/dashboard`)

## Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Phase 6 Confirm | ResumedHorizon emitted; mode deactivates; session proceeds primed |
| Phase 6 Abort | Mode deactivates without horizon entered; fresh-start patterns apply |
| Phase 0 no-HFT-found | Mode deactivates with a no-op note |
| User Esc | Ungraceful exit; no partial primer state retained |

## Stage 1 Conjecture (N=1 Dogfooding)

This skill is a Stage 1 (Compile) conjecture. Structural fit was established via a single dogfooding session crystallizing the HFT format from concrete instance set into a four-layer abstraction (see `references/hft-format.md` for the format spec's own Stage 1 caveat). Stage 2 (Runtime) use-corroboration is pending — accumulating cross-session activations across user-context variation. Architectural inscription (e.g., promoting HFT as a normative substrate format for other utilities, registering auto-hooks, integrating with `/attend`'s adopt-resume slot beyond the optional Phase 5 hand-off) is deferred until variation-stable retention evidence accumulates.

When in doubt about a phase or rule under live use, prefer fidelity to the contract over local convenience; report any tension as Stage 2 evidence rather than silently relaxing the constraint.

## Anti-Patterns

- Auto-activating on session start — `/rehydrate` requires explicit user invocation
- Auto-fetching Reference Shell targets — collapses topology separation; the user must invoke `/inquire` or `/recollect` explicitly
- Auto-handing-off anchor tasks to `/attend` without Phase 5 user choice — Constitution boundary violation
- Modifying or archiving the HFT file — read-only invariant; archive is a separate concern
- Skipping Sache restatement at Phase 2 — silently parsing the file loses the comprehension verification
- Treating `git_head` drift as a blocker — drift is informational; the user decides whether to proceed
- Inferring an HFT path without surfacing the inference for user confirmation when multiple candidates exist — silent identity establishment violates user authority
- Re-reading Wirkungsgeschichte as if it were Surface Text — Wirkungsgeschichte is informational about *how* the horizon formed; the primer comes from Surface Text alone
