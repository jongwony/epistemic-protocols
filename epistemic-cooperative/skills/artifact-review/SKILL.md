---
name: artifact-review
description: "Review markdown artifacts before fixation (publish/commit/deposit/merge) via /inquire × /gap × /contextualize + browser inline-comment channel. User-invoked via /artifact-review."
skills:
  - aitesis:inquire
  - syneidesis:gap
  - epharmoge:contextualize
---

# Artifact Review: Inquiry × Gap Audit × Application-Fit Pipeline

Take any markdown artifact from drafted state to fixation-ready through three sequential reviews. Each stage addresses a distinct scope — factual verifiability (pre-fixation fact layer), decision quality (pre-fixation decision layer), and application fit (post-fixation). The terminal stage uses a browser-based channel-loop: the artifact renders as a published-style preview, the user drags-to-select any span and attaches a comment, each comment POSTs to a local Bun server that appends to `feedback-{slug}.jsonl`. The next `/artifact-review` iteration reads those entries and feeds them as `<feedback anchor="…">…</feedback>` directives back into the revision pass.

Unlike domain-specific editorial wrappers, `/artifact-review` is agnostic about *what kind of artifact* is being reviewed — blog drafts, plan documents, crystallized handoffs, design docs, and changeset descriptions are all valid targets. The caller supplies the fixation event (what commits this artifact to downstream consumers) and the application context (where the fixed artifact will operate). The three protocols then specialize their scopes accordingly.

## Caller Signature

```
/artifact-review(artifact_path, fixation_event D, application_context)

artifact_path        : String | List<String>                      -- path to markdown file(s)
fixation_event D     : Irreversible(String) | Reversible(String)  -- committed action; tag drives /gap stakes default
                                                                   --   Irreversible (stakes=High default): publish, deposit, merge
                                                                   --   Reversible   (stakes=Medium default): commit-to-execution, approve-pending-revise
application_context  : String                                     -- where the fixed artifact operates
```

The caller — whether the user invoking `/artifact-review` directly or a composing skill that calls this one — supplies all three fields. When `D` or `application_context` is omitted, the skill infers defaults from the artifact path when possible (e.g., `~/.claude/plans/*.md` → D = "commit to execution", `~/.claude/.write/*.md` → D = "publish"); if inference yields no confident match, the skill asks the user.

## Pipeline Overview

```
/inquire  →  /gap  →  /contextualize  (+ channel-loop)
  factual     decision    application-fit
  (2 gates)   (1 gate)    (1 gate, L3 augmented)
```

3 protocols, 4 user gates, 1 terminal channel-loop augmentation. Gate counts are standalone — composition does not elide gates (see "Why No Gate Reduction" below).

## When to Use

- Any markdown artifact approaching a fixation event
- Editorial iteration over multiple turns is expected
- Asynchronous comment-style feedback fits the review rhythm better than chat-gate dispositions
- Factual claims, named references, or external attributions warrant pre-fixation verification

## When NOT to Use

- Trivial artifacts (single sentence, typo, comment fix) — direct Edit suffices
- Code-centric changesets where `/review` is the right tool
- Artifacts whose fixation event is unclear — use `/goal` first to define D
- One-shot artifacts the user does not intend to revise

## Scope Differentiation (Suppression Bypass)

The composition includes two suppression edges from graph.json:
- `syneidesis ⊣ aitesis` — same-scope Aitesis suppression
- `aitesis ⊣ epharmoge` — same-scope pre+post stacking prevention

Both fire only on same-scope co-activation. This composition keeps scopes structurally distinct:

**Named primary scopes (working hypotheses)**:
- `/inquire` — factual verifiability of artifact claims (fact layer, pre-fixation temporal zone)
- `/gap` — decision quality w.r.t. fixation event D (decision layer, pre-fixation temporal zone, distinct dimension)
- `/contextualize` — application fit of fixed artifact against `application_context` (post-fixation temporal zone)

**Emergent clause**: Named scopes are working hypotheses per the Full Taxonomy Confirmation principle. Runtime boundary cases — where a finding could legitimately belong to more than one scope — resolve by **attribution priority**: Factual > Decision > Application. When a finding remains ambiguous after priority assessment, record under both scopes with `origin: ambiguous` annotation and surface at the first applicable sub-protocol surfacing gate in the pipeline. Silent attribution drift is a protocol violation; explicit dual-record preserves auditability.

## Pipeline Phase 1: Factual Verification (`/inquire`)

Invoke `/inquire` against the artifact's factual surface — named people, project names, citations, statistics, technical claims about external systems, links. `/inquire` Phase 1 dispatches to the right verification track (CodeDerivable, CanonicalExternal via WebFetch, Instrumentation, UserTacit) per claim.

**Pipeline context rules** (when `/inquire` is called from this pipeline):
- **Scope**: factual verifiability of artifact claims (fact layer)
- **Conditional no-op**: artifacts with no factual claims (e.g., plan files describing design intent with no external references) trigger Phase 0 silent exit — the 4-track dispatch finds no resolvable uncertainties and the protocol exits without surfacing

## Pipeline Phase 2: Decision-Quality Gap Audit (`/gap`)

Invoke `/gap` with `D` (caller-supplied fixation event) as the committed action. Stakes are caller-supplied; default to High when `D` is irreversible or externally visible (publish, deposit-to-hypomnesis, merge) and Medium otherwise.

Common gaps across artifact types:
- Causal/correlational overclaim
- Audience misfit (jargon density, glossary needs, persona assumptions)
- Counter-argument absence
- Disclosure gaps (conflicts of interest, AI-assisted generation, prior reviewer credit)
- Procedural gaps (scope declaration, test plan, rollback path)

**Pipeline context rules** (when `/gap` is called from this pipeline):
- **Scope**: decision quality w.r.t. fixation event D (decision layer)
- **D**: caller-supplied fixation_event
- **Stakes**: caller-supplied; default High for irreversible D, Medium otherwise
- **Suppression precondition**: `syneidesis ⊣ aitesis` does NOT fire — distinct scope dimensions (factual layer vs decision layer)

**Double-/gap composition note**: When `/artifact-review` is called downstream of `/write` (i.e., `/write` produces a draft that `/artifact-review` then reviews), both skills invoke `/gap` at distinct scopes — `/write`'s internal Phase 7 `/gap` audits draft-quality gaps (procedural / duplicate / consideration within the artifact), while `/artifact-review`'s Pipeline Phase 2 `/gap` audits decision-quality gaps w.r.t. fixation event `D`. The scope distinction preserves the scope-differentiation invariant; composition is not redundant.

## Pipeline Phase 3: Application-Fit Check (`/contextualize`) + Channel-Loop

The terminal applicability check, augmented by a browser channel.

### Standard Path

Invoke `/contextualize` with `application_context` as `X`. Scans for Convention / Environment / Audience / Dependency mismatches plus Emergent dimensions.

**Pipeline context rules** (when `/contextualize` is called from this pipeline):
- **Scope**: application fit of fixed artifact against application_context (post-fixation)
- **X**: caller-supplied application_context
- **Information source**: `feedback-{slug}.jsonl` from channel-loop (if present) + standard post-execution applicability scan
- **Suppression precondition**: `aitesis ⊣ epharmoge` does NOT fire — distinct temporal scopes (pre-fixation vs post-fixation)

### Channel-Loop Augmentation

Channel server requires the `bun` runtime. Run a pre-flight check:

```bash
if ! bun --version >/dev/null 2>&1 || [ "$(bun --version | cut -d. -f1)" -lt 1 ]; then
  echo "bun >= 1.0 required for the channel-loop preview (Bun.serve + WebSocket API)." >&2
  echo "install: curl -fsSL https://bun.sh/install | bash" >&2
  exit 1
fi
bun scripts/serve.ts <artifact.md> [<artifact2.md> ...]
```

The server renders each artifact on demand, accepts comment POSTs, and broadcasts file-change notifications over a WebSocket. Each artifact slug is its filename without extension; comments append to `feedback-{slug}.jsonl` next to the source. See `scripts/serve.ts` for endpoint and watcher details.

In the browser (one tab per artifact):
- Markdown renders fully (marked.js) as a published-style artifact — no raw syntax visible
- Drag-to-select any span and a popup appears at the selection
- Type a comment, ⌘Enter (or Submit) sends it as `{slug, anchor, context_before, context_after, comment}`
- The selected span is marked with a yellow highlight + 💬 marker
- When the source markdown changes (next iteration applied edits), the page auto-reloads while preserving scroll position

### Re-entry into the Pipeline

Each JSONL line: `{slug, anchor, context_before, context_after, comment, timestamp, source_offset?}`. `context_before` + `context_after` (60 chars each) disambiguate repeated anchors. `source_offset` (optional integer) records the source-markdown byte offset when the browser can derive it — used when rendered text diverges from source (marked.js strips emphasis markers, link text drops URL parts, code block fences become `<pre>`).

When `feedback-{slug}.jsonl` exists in the artifact's directory, the next `/artifact-review` invocation:
1. Reads each line, locates the anchor in the source markdown using surrounding context
2. Wraps each comment as a `<feedback anchor="…">comment</feedback>` directive for the revision pass
3. Archives consumed JSONL to `feedback-{slug}-{timestamp}.consumed.jsonl` to prevent re-ingestion
4. Browser auto-reloads; user inspects updated artifact and either approves or adds further comments

### Why a Browser Channel

Selection-anchored inline comments preserve **span-level positional precision** that chat-gate option-numbering and section-button schemes both lose. The rendered artifact surfaces applicability mismatches the raw markdown does not (font, heading rhythm, link presentation, line-break-driven cadence). Asynchronous review fits multi-day editorial loops where chat-gate forces synchronous response.

### Skip-Channel Fallback

Pass `--skip-channel` to Pipeline Phase 3 to fall back to standard `/contextualize` chat-gate (headless environment, no browser, or explicit user preference). The channel mechanism augments, never replaces, the underlying epistemic check.

## Why No Gate Reduction

The composition-level disposition analysis for this composition yields 0% gate reduction — all 4 user gates are PRESENT in composed context. Reason: all three protocols require **Constitution user judgment** on answers not entailed by upstream protocol outputs:
- `InformedExecution` (Aitesis output) does not entail the `{Address, Dismiss, Probe}` judgment Syneidesis asks
- `AuditedDecision` (Syneidesis output) does not entail the `{Confirm, Adapt, Dismiss}` judgment Epharmoge asks

The composition's value is therefore structural, not interaction-reducing:
1. **Signature unification** — caller supplies `(artifact, D, context)` once; the composition distributes
2. **Scope differentiation inscribed** — Named 3-scope + Emergent clause bypasses two suppression edges at pipeline level
3. **Channel-loop augmentation** — Epharmoge information source extended to browser feedback
4. **Suffix-replay unified** — error recovery spans all three protocols in one rule set

## Materialized View

After convergence, present the transformation trace:

```
Pipeline Phase 1 (inquire):       {F} factual claims → {V} verified, {C} corrected, {U} flagged uncertain
Pipeline Phase 2 (gap):           {G} gaps surfaced → {A} addressed, {D} dismissed (with assumption)
Pipeline Phase 3 (contextualize): {M} mismatches → {R} resolved, {S} dismissed
                                  {B} channel comments consumed → {I} incorporated
Artifact(s):                      {list of paths}
Fixation event D:                 {caller-supplied D}
Application context:              {caller-supplied context}
```

## Error Recovery

Suffix-replay rules:
- **Mid-chain invalidation**: Pipeline Phase 1 factual correction invalidating a Pipeline Phase 2 gap resolution → replay forward from Pipeline Phase 2 (not backward compensation)
- **Same-reason cap**: Same-reason replay capped at 2 attempts before surfacing to the user with options: replay / proceed accepting mismatch / terminate preserving artifacts
- **Feedback consumption**: `feedback-{slug}.jsonl` from a prior browser session is consumed once and archived to prevent stale comments re-entering subsequent loops. When the archive write fails (disk full, permission denied), surface the failure to the user — do not silently retry — and halt consumption until the underlying cause is resolved; silent retry would re-inject identical `<feedback>` directives into the revision pass.
- **Anchor-not-found on re-entry**: When a revision pass removes or substantially rewrites the anchor span, the next iteration cannot locate the original feedback target. Behavior: (a) attempt fuzzy-match only when both `context_before` and `context_after` match within edit distance 5 — if matched, proceed as located; (b) otherwise emit the directive as `<feedback anchor="..." status="anchor-missing">comment</feedback>` with the original anchor + context retained so the user can judge whether the intent still applies — do not silently drop the feedback.
- **Scope-attribution drift**: Finding's scope attribution changing mid-pipeline → record under `origin: ambiguous` and re-scan the upstream protocol with re-attributed scope

## Rules

1. **Composition, not absorption** — each sub-protocol remains independently invocable. `/artifact-review` orchestrates; it does not duplicate sub-protocol gate definitions.
2. **Scope differentiation is structural** — the two suppression edges fire only on same-scope co-activation. This pipeline keeps scopes distinct via the named 3-scope + Emergent clause. Chains that collapse scopes would re-trigger suppression and violate this rule.
3. **Emergent attribution priority** — boundary cases resolve by Factual > Decision > Application priority; remaining ambiguity is surfaced as an `origin: ambiguous` marker in the session text trace (not as a struct field on sub-protocol types) so both protocols detect the finding at their respective gates. This composition-level `origin` (scope attribution) is distinct from Epharmoge's internal `Origin ∈ {Initial, Emerged(aspect)}` struct (within-protocol mismatch provenance) — shared name, non-overlapping domain.
4. **Browser channel is augmentation, not mandate** — `--skip-channel` or missing bun runtime falls back to standard `/contextualize` chat-gate.
5. **Feedback consumption is single-shot with latest-timestamp dedup** — each `feedback-{slug}.jsonl` is read once and archived; entries sharing `(anchor, context_before, context_after)` keep only the latest timestamp.
6. **Caller-supplied signature is required** — `fixation_event D` and `application_context` must be explicit. When omitted, the skill infers defaults from the artifact path; if inference yields no confident match, the skill asks the user. Silent assumption of domain-specific defaults (e.g., "publish") would re-impose bias the composition is designed to avoid.
7. **Convergence requires all three protocols to terminate** — pipeline does not declare done until `/inquire` converges on InformedExecution, `/gap` on AuditedDecision, and `/contextualize` on ContextualizedExecution (or user explicitly skips any phase).
8. **Multi-artifact variants are first-class** — when multiple artifacts are supplied, each runs through the pipeline with its own preview page and feedback file; comments are namespaced per artifact.

## Bundled Resources

- `scripts/serve.ts` — Bun-based live server; `bun scripts/serve.ts <artifact.md> [more...]`. Handles GET/POST/WebSocket; `node:fs.watch` triggers reload broadcasts.
- `templates/preview.html` — interactive markdown preview with selection-anchored comment popup, WebSocket hot-reload client, dark-mode support.
- `templates/marked.min.js` — bundled marked.js markdown renderer.

## Composition Lineage

Authored via `/compose`. Supersedes the legacy `/write-review` skill by generalizing the domain scope from blog-specific ("publish") to artifact-agnostic (caller-supplied fixation event + application context). Sub-protocol scope differentiation and channel-loop mechanism carry forward unchanged; changes are at the orchestration and signature layers.
