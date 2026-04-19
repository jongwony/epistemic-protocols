---
name: write-review
description: "Multi-stage editorial pipeline for written drafts — composes /write, /recollect, /inquire, /gap, /contextualize and closes the loop via a browser preview with section-anchored inline comments. Use when the user wants to take a draft from raw idea to publish-ready, when the user mentions reviewing or refining a written piece (blog post, LinkedIn post, Medium article, Slack announcement, PR description, 1-pager), or when iterative editorial feedback over multiple turns is anticipated. Invoke explicitly with /write-review."
skills:
  - epistemic-cooperative:write
  - anamnesis:recollect
  - aitesis:inquire
  - syneidesis:gap
  - epharmoge:contextualize
---

# Write Review: Multi-Stage Editorial Pipeline

Take a written draft from initial idea to publish-ready through five stages: draft, recall prior material, verify facts, audit content gaps, and close the loop via browser-rendered inline-comment review. The composition mirrors the code `/review` pipeline (Episteme → Techne → Triage → Commit) but specialized for prose: each stage addresses a distinct editorial concern.

The terminal stage uses a **channel-loop pattern** (Ray Amjad's Layer 3 framework): the draft renders in the browser as a published-style artifact, the user drags-to-select any text span and attaches a comment via a Medium/Hypothes.is-style popup, each comment immediately POSTs to a Bun server that appends to `feedback-{slug}.jsonl` next to the source markdown. The next `/write-review` turn reads those entries and feeds them as `<feedback anchor="…">…</feedback>` directives back into the loop.

## Pipeline Overview

```
write → recollect → inquire → gap → revise loop → contextualize (channel)
  draft   recall    facts    gaps    edits         browser inline review
```

5 stages, 4 sub-protocols invoked, 1 terminal channel mechanism. Per-stage gate count varies by sub-protocol; the channel stage replaces chat-gate disposition with file-based feedback.

## When to Use

- A draft exists or will be drafted, and editorial iteration over multiple turns is expected
- The piece carries factual claims, attributions, or named references that warrant verification
- Multiple platform variants will be produced from one source (e.g., LinkedIn vs Medium)
- The user wants asynchronous comment-style feedback rather than chat-gate dispositions

## When NOT to Use

- Trivial prose tasks (single sentence, comment fix, typo correction) — direct Edit suffices
- Code-centric content where `/review` is the right tool
- Documentation updates with no editorial concern (use Edit; use `/grasp` if comprehension verification is needed)
- One-shot drafts the user does not intend to revise

## Phase 0: Draft (`write`)

Invoke `/write` to produce the initial draft. `/write` internally runs Prothesis multi-perspective analysis (Layer 1 of the artifact framework — multiple variants generated for the user's "I know it when I see it" comparison).

Output: a draft file under `~/.claude/.write/YYYY-MM-DD-{topic-slug}.md`.

If the user supplies a draft directly, skip Phase 0 and route the supplied draft into Phase 1.

## Phase 1: Material Recall (`recollect`)

Invoke `/recollect` to surface prior session material relevant to the draft — terminology coined in earlier sessions, prior decisions referenced, framings already established. The recalled context is emitted as ClueVector_prose to session text and naturally read by Phase 2 and Phase 3.

This phase is conditional: skip when the draft topic carries no prior session footprint (e.g., entirely new domain).

## Phase 2: Fact Verification (`inquire`)

Invoke `/inquire` against the draft's factual surface — named people, project names, citations, statistics, technical claims about external systems. `/inquire` Phase 1 dispatches to the right verification track (CodeDerivable, CanonicalExternal via WebFetch, Instrumentation, UserTacit) per claim.

**Pipeline context rule** (`syneidesis ⊣ aitesis` suppression precondition not met — distinct scopes):
> Suppression edges fire when source and target cover the **same scope**. Here `/inquire` targets **factual verifiability** of draft claims (Fiber(Factual)), while the Phase 3 `/gap` invocation targets **content quality** (consideration, alternative, assumption gaps about the decision-to-publish). Because these scopes are distinct, the same-scope precondition is never triggered and both protocols invoke independently — `/inquire` does not pre-empt `/gap`.

## Phase 3: Gap Audit (`gap`)

Invoke `/gap` with the publish-decision as the committed action `D`. Stakes are typically High (publication is irreversible and externally visible). `/gap` surfaces consideration, alternative, assumption, and procedural gaps in the draft as a publish-ready artifact.

Common gaps for written drafts:
- Causal/correlational overclaim (a research finding presented as a structural recommendation)
- Audience misfit (jargon density, glossary needs, persona assumptions)
- Counter-argument absence (no anticipation of likely reader rebuttal)
- Disclosure gaps (conflicts of interest, AI-assisted generation, prior reviewer credit)

## Phase 4: Revision Loop

Apply approved corrections from Phase 2 (factual fixes) and Phase 3 (gap resolutions). Tone iteration via Edit. Produce platform variants (e.g., shorter LinkedIn teaser from longer Medium long-form) by branching the draft.

This phase is iterative; each Edit re-enters Phase 4 until the user signals "ready for channel review" or invokes Phase 5 explicitly.

## Phase 5: Channel Review (`contextualize` + L3 channel loop)

The terminal applicability check, realized through a browser channel rather than chat-gate disposition.

### Mechanism

Channel server requires the `bun` runtime. Claude Code uses Bun internally but does not always expose `bun` to the user's shell PATH (varies by distribution channel: Homebrew, npm global, Cowork, claude.ai web). Run a pre-flight check before invoking the server so a missing runtime becomes an actionable install pointer rather than a silent crash:

```bash
if ! command -v bun >/dev/null 2>&1; then
  echo "bun is required for the channel-loop preview." >&2
  echo "install: curl -fsSL https://bun.sh/install | bash" >&2
  exit 1
fi
bun scripts/serve.ts <draft.md> [<draft2.md> ...]
```

The server renders each draft on demand, accepts comment POSTs, and broadcasts file-change notifications over a WebSocket. Each draft slug is its filename without extension; comments append to `feedback-{slug}.jsonl` next to the source. See `scripts/serve.ts` for endpoint and watcher details.

In the browser (one tab per draft):
- The markdown renders fully (marked.js) as a published-style artifact — no raw syntax visible
- Drag-to-select any span (sentence fragment, table cell, list item) and a popup appears at the selection
- Type a comment, ⌘Enter (or Submit) sends it as `{slug, anchor, context_before, context_after, comment}`
- The selected span is visually marked with a yellow highlight + 💬 marker and the comment count increments
- A status bar shows live WebSocket state and accumulated comment count
- When the source markdown changes (because the next `/write-review` turn applied edits), the page auto-reloads while preserving scroll position

### Re-entry into the pipeline

Each JSONL line: `{slug, anchor, context_before, context_after, comment, timestamp}`. The `context_before` + `context_after` (60 chars each) disambiguate when the anchor occurs more than once in the source.

When `feedback-{slug}.jsonl` exists in the draft's directory, the next `/write-review` invocation:
1. Reads each line, locates the anchor in the source markdown using its surrounding context
2. Wraps each comment as a `<feedback anchor="…">comment</feedback>` directive injected into the next `/write` revision pass — the agent treats each `<feedback>` block as a localized constraint to address
3. Archives the consumed JSONL to `feedback-{slug}-{timestamp}.consumed.jsonl` to prevent re-ingestion
4. The browser auto-reloads via WebSocket; the user inspects the updated draft and either approves or adds further comments — closing the loop

**Pipeline context rule** (`aitesis ⊣ epharmoge` suppression precondition not met — distinct pre/post scopes):
> Suppression edges fire when source and target cover the **same scope**. `/inquire` (Phase 2) verifies factual claims of the **draft as work-in-progress**; `/contextualize` (Phase 5) verifies applicability of the **draft as publish-ready artifact** against actual posting context (platform conventions, audience access, CTA fit). Because pre-execution and post-execution scopes are distinct, the same-scope precondition is never triggered; pre+post stacking here is the intended structural use, not a violation.

### Why a browser channel, not chat-gate

Selection-anchored inline comments preserve **span-level positional precision** that chat-gate option-numbering or section-button schemes both lose — the user can pin a comment to "the second sentence in the third paragraph, specifically these eight words" rather than "this section". The rendered draft surfaces applicability mismatches the raw markdown does not (font, heading rhythm, link presentation, line-break-driven cadence). Asynchronous review fits multi-day editorial loops where chat-gate forces synchronous response.

Why a real Bun server (not a static HTML download): the loop must be **bidirectional and real-time** for the channel pattern to work as designed. POST + JSONL append + WebSocket hot-reload means each comment is captured at the moment of judgment, the agent's revisions are visible without manual refresh, and the user never breaks out of the artifact to "submit" a batch — the artifact is the conversational surface.

## Materialized View

After convergence, present the transformation trace:

```
Phase 0 (write):        {N} draft variants → user selected variant {X}
Phase 1 (recollect):    {M} prior-session materials surfaced → {K} integrated
Phase 2 (inquire):      {F} factual claims → {V} verified, {C} corrected, {U} flagged uncertain
Phase 3 (gap):          {G} gaps surfaced → {A} addressed, {D} dismissed (with assumption)
Phase 4 (revise):       {E} edits applied across {P} platform variants
Phase 5 (contextualize): {B} browser comments → {R} resolved mismatches
Final artifacts:        {list of paths}
```

Each row shows what each stage contributed; together they constitute the audit trail for the published piece.

## Error Recovery

Suffix-replay rules per the `/compose` template pattern:

- On mid-pipeline discovery that a Phase 2 fact correction invalidates a Phase 3 gap resolution: replay forward from Phase 3 (not backward compensation).
- Same-reason replay capped at 2 attempts before surfacing to the user with options: replay, proceed accepting the mismatch, terminate preserving artifacts.
- `feedback-{slug}.jsonl` from a prior browser session is consumed once and then archived to `feedback-{slug}-{timestamp}.consumed.jsonl` to prevent stale comments re-entering subsequent loops.

## Pipeline Context Rules (consolidated)

When sub-protocols are invoked from this pipeline:

| Sub-protocol | Pipeline context rule |
|---|---|
| `/write` | Default Layer 1 multi-variant generation; output to `~/.claude/.write/` |
| `/recollect` | Track = hybrid (drafts often mix proper-noun citations with vague topical recall); skip when draft has no prior session footprint |
| `/inquire` | Scope = factual verifiability of draft claims; `syneidesis ⊣ aitesis` suppression precondition (same-scope) is not met — `/inquire`'s factual scope is distinct from `/gap`'s content-quality scope |
| `/gap` | Decision `D` = publish; stakes = High by default for public posts |
| `/contextualize` | Information source = `feedback-{slug}.jsonl` from browser channel + standard post-execution scan; `aitesis ⊣ epharmoge` suppression precondition (same-scope) is not met — pre-execution `/inquire` and post-execution `/contextualize` operate on distinct scopes |

## Rules

1. **Composition, not absorption** — each sub-protocol remains independently invocable. `/write-review` orchestrates; it does not duplicate sub-protocol gate definitions.
2. **Scope differentiation is structural** — the two suppression edges (`syneidesis ⊣ aitesis`, `aitesis ⊣ epharmoge`) fire only on same-scope co-activation; this pipeline keeps the scopes distinct (factual vs content-quality, pre-execution vs post-execution), so the suppression precondition is never met. Chains that collapse the scopes back into one would re-trigger suppression and violate this rule.
3. **Browser channel is optional, not mandatory** — Phase 5 falls back to standard `/contextualize` chat-gate when the user prefers (e.g., headless environment, no browser available). The L3 mechanism augments, never replaces, the underlying epistemic check.
4. **Feedback consumption is single-shot** — each `feedback-{slug}.jsonl` is read once and archived to prevent stale loops.
5. **Platform variants are first-class** — when multiple variants exist (LinkedIn + Medium), Phase 5 channel review covers each variant with its own preview page; comments are namespaced per variant.
6. **Recall is conditional, not gating** — Phase 1 `/recollect` skips silently when the draft topic has no prior footprint; absence of recall is not a pipeline halt.
7. **Convergence requires Phase 5 closure** — pipeline does not declare done until either `feedback-{slug}.jsonl` is consumed and resolved OR the user explicitly bypasses Phase 5 with `--skip-channel`.

## Bundled Resources

- `templates/preview.html` — interactive markdown preview with selection-anchored comment popup, WebSocket hot-reload client, and dark-mode support (loads marked.js from CDN)
- `scripts/serve.ts` — Bun-based live server; usage: `bun scripts/serve.ts <draft.md> [more drafts...]`. Handles GET/POST/WebSocket; `node:fs.watch` triggers reload broadcasts
- `evals/evals.json` — test cases for skill-creator iteration

## Composition Lineage

This skill was authored via `/skill-creator` after the editorial workflow was empirically observed in a multi-turn session that drafted dual LinkedIn/Medium versions of one piece. The Layer 1 / Layer 3 absorption (and Layer 2 rejection) was validated via `/ground` against Ray Amjad's three-layer artifact framework — the rejection rests on Topology Divergence: visual artifacts have a render≠source split that hot-reload addresses, while written artifacts have render=source so the same mechanism offers no marginal value.

The Phase 5 channel was first prototyped on Python `http.server` with section-anchored buttons and a "Submit All Reviews" footer that downloaded `feedback.json`. User dogfooding rejected this realization: it stayed at Layer 1 (static preview + manual paste-back) and added no value beyond chat-gate iteration. Per the user's reframing — "I want 1:1 with the video's Bun interactive technique" — the implementation was rolled back and rewritten on Bun with selection-anchored Medium/Hypothes.is-style popups, immediate POST-to-JSONL, and WebSocket hot reload. The video's UX, not the runtime, was the structural target; Bun was selected because (a) it ships with Claude Code so most users already have the runtime, (b) `Bun.serve` provides WebSocket and static serving with near-zero boilerplate, and (c) the resulting code is roughly half the size of the equivalent Python stdlib implementation while matching the video's loop pattern exactly.
