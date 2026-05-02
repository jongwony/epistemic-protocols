---
name: artifact-review
description: "Review markdown artifacts before fixation (publish/commit/deposit/merge) via /inquire × /gap × /contextualize through a channel-first browser preview loop. User-invoked via /artifact-review."
skills:
  - aitesis:inquire
  - syneidesis:gap
  - epharmoge:contextualize
---

# Artifact Review: Inquiry × Gap Audit × Application-Fit Pipeline

Take any markdown artifact from drafted state to fixation-ready through three reviews — factual verifiability, decision quality, application fit — bound to a **channel-first feedback loop**. On invocation the skill opens a browser preview of the rendered artifact (Vorverständnis layer) and runs an initial scan (`/inquire` → `/gap` → `/contextualize`); afterward, every loop iteration presents a 2-option branch gate (`scan` / `apply`) before the user returns to the browser for the next round. Both options produce edits and advance the hermeneutic cycle each round — `scan` fully consumes the JSONL queue and adds sub-protocol audit on top, `apply` partially consumes (faithful translation of unambiguous comment intent; ambiguous comments deferred to a future `scan`). "Wait and add more comments" is implicit in not yet answering the gate. Termination is a free-response pathway available at any time.

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
Phase 0  : channel open (browser, rendered preview) + initial scan
Phase L  : loop iteration k
             Q (branch gate) :
               ① scan  — consume current JSONL, run /inquire+/gap+/contextualize, then return to browser
               ② apply     — consume current JSONL, materialize comment intent as edits without sub-protocol audit, then return to browser
             user reads preview + AI surfacing in browser, drag-comments, then next chat turn answers the gate
free-exit : user may end the review at any time by saying so (Phase 0 prose declares this once)
```

3 protocols composed inside each `scan` action. The loop is outer; sub-protocol gates remain standalone within `scan` (see "Why No Gate Reduction" below). Each iteration boundary surfaces exactly one branch gate.

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

## Phase 0: Channel Open + Initial Scan

On skill activation, before any sub-protocol runs:

1. **Bun preflight** — verify `bun --version` ≥ 1.0. If absent, print install hint (`curl -fsSL https://bun.sh/install | bash`) and exit. The channel is the skill's identity; running without it would change what `/artifact-review` *is*, not just degrade UX. Headless environments fall back to `/inquire`, `/gap`, `/contextualize` invoked directly.
2. **Termination prose (declared once)** — announce *before opening the browser*: *"I'll open a browser preview and run an initial scan. You can end this review at any time by saying so; on exit I will produce the materialized view and stop the channel server."* This is the free-response pathway for termination — it does not appear as a gate option. Announcing first ensures the exit affordance is visible before the first session artifact (the rendered preview) is presented.
3. **Channel open** — start `bun scripts/serve.ts <artifact.md> [...]`, browser auto-opens to the rendered preview. The published-style render is the user's first input layer (Vorverständnis), independent of any AI surfacing.
4. **Initial scan** — run the composed pipeline (`/inquire` → `/gap` → `/contextualize`) once. If `feedback-{slug}.jsonl` already exists from a prior session, consume it as input directives per Channel Modality § JSONL Consumption Timing; otherwise the initial scan is AI-led from a blank channel.
5. **Branch gate** — surface the loop iteration gate (Phase L below).

## Phase L: Loop Iteration Branch Gate

After each scan completes (initial or subsequent), surface the round counter in pre-gate prose so the user always knows where they are in the loop, then present the branch gate. Termination is the user's decision and is not surfaced as a peer option.

**Pre-gate prose** (per round):
```
Round {k} complete — scan.                                            -- after scan round
Round {k} complete — apply ({X} applied, {Y} deferred to next scan).  -- after apply round; Y omitted when 0
Browser preview reflects the latest edits.
```

**Branch gate**:

```
Q : Round {k+1} — 다음 라운드를 어떻게 진행할까요? (브라우저에서 코멘트 작성/추가가 끝났을 때 답변)
  ① scan   — 누적 코멘트를 input으로 /inquire+/gap+/contextualize 전체 audit 실행 + AI surfaced findings + 코멘트 edits 적용
  ② apply  — 누적 코멘트를 소비하되 sub-protocol audit은 생략, 코멘트 의도대로 edits만 적용 (더 빠른 라운드).
              사용자가 직접 cognitive scan을 수행했다는 암묵적 가정 하에 AI는 faithful 번역만 담당.
              모호 / 충돌 / audit-level 판단 요구 코멘트는 archive 보류 → 큐에 잔존하여 다음 라운드로 자연 deferral
              (다음 라운드는 `scan` 권고).

코멘트를 더 작성하고 싶으면 답변하지 않고 브라우저에서 계속 작성하세요. 답변 시점이 라운드 종료이며 큐는 그 시점에 일괄 소비됩니다 (apply 모드는 부분 소비 가능).
```

**Why 2 options, not 3**: Termination is a *meta-action* — exit from the loop modality, not a position on the scan/no-scan axis. Per `derived-principles.md §Differential Future Requirement`, meta-actions surface as free-response pathways rather than peer options. The Phase 0 prose declares the exit affordance once; surfacing it at every gate would inflate the option set without differential trajectory on the loop axis.

**Trajectory differential** — both options consume the JSONL queue (so the hermeneutic cycle stays seamless), but differ in AI processing depth:
- ① `scan` — JSONL fully consumed + archived; `<feedback>` directives enter a revision pass through `/inquire`+`/gap`+`/contextualize`; chat surfaces new audit findings; edits applied for both audit findings *and* user comment intent; browser auto-reloads.
- ② `apply` — JSONL partially consumed: clear comments are translated into edits and archived; ambiguous / conflicting / audit-requiring comments stay in the queue (deferred to a future `scan`). No sub-protocol audit, no AI-surfaced new findings. Lighter, faster round suited for flow-state iteration. Implicit contract: the user has performed their own cognitive scan via drag-commenting, so the AI's role is *faithful translation* of unambiguous intent — when faithful translation is impossible, defer rather than guess.

**Round signal**: The user's next chat turn answering the gate *is* the round-complete signal. No separate browser button is needed — modality stays clean (browser collects comments, chat handles gate decisions).

**Inference defaults** (project-profile.md Extension-default; relay where confident, surface gate where ambiguous):
- First gate after initial scan with 0 new comments and ≥1 surfaced finding → `apply` is the recognizable default if the user has clear edit intent on the surfaced findings; `scan` if the user wants AI to re-evaluate after their changes — but still surface the gate; defaults reduce friction by ordering options, not by auto-selecting.
- Multi-artifact: each artifact has its own browser tab + JSONL + loop counter; the branch gate is **per-artifact**. Aggregating would let one artifact's pacing block another (Rule 8 multi-artifact-first-class).

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

## Scan Stage 1: Factual Verification (`/inquire`)

Within each `scan` action, `/inquire` runs first against the artifact's factual surface — named people, project names, citations, statistics, technical claims about external systems, links. `/inquire` Phase 1 dispatches to the right verification track (CodeDerivable, CanonicalExternal via WebFetch, Instrumentation, UserTacit) per claim.

**Pipeline context rules** (when `/inquire` is called from this pipeline):
- **Scope**: factual verifiability of artifact claims (fact layer)
- **Conditional no-op**: artifacts with no factual claims (e.g., plan files describing design intent with no external references) trigger Phase 0 silent exit — the 4-track dispatch finds no resolvable uncertainties and the protocol exits without surfacing

## Scan Stage 2: Decision-Quality Gap Audit (`/gap`)

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

**Double-/gap composition note**: When `/artifact-review` is called downstream of `/write` (i.e., `/write` produces a draft that `/artifact-review` then reviews), both skills invoke `/gap` at distinct scopes — `/write`'s internal Phase 7 `/gap` audits draft-quality gaps (procedural / duplicate / consideration within the artifact), while `/artifact-review`'s Scan Stage 2 `/gap` audits decision-quality gaps w.r.t. fixation event `D`. The scope distinction preserves the scope-differentiation invariant; composition is not redundant.

## Scan Stage 3: Application-Fit Check (`/contextualize`)

The applicability check that closes each `scan` action. The channel itself is not a stage — it is the surrounding modality opened in Phase 0; this stage consumes whatever JSONL has accumulated since the previous scan.

### Standard Path

Invoke `/contextualize` with `application_context` as `X`. Scans for Convention / Environment / Audience / Dependency mismatches plus Emergent dimensions.

**Pipeline context rules** (when `/contextualize` is called from this pipeline):
- **Scope**: application fit of fixed artifact against application_context (post-fixation)
- **X**: caller-supplied application_context
- **Information source**: accumulated JSONL since previous scan (consumed at the start of this scan; see Channel Modality below) + standard post-execution applicability scan
- **Suppression precondition**: `aitesis ⊣ epharmoge` does NOT fire — distinct temporal scopes (pre-fixation vs post-fixation)

## Channel Modality

The browser channel is opened once in Phase 0 and remains live across all loop iterations until the user terminates the review. It is the **default review modality**, not a Phase-3 augmentation: the rendered preview is the user's first input layer and continues to be the medium where applicability mismatches (font, heading rhythm, link presentation, line-break-driven cadence) become visible.

### Server + Browser Behavior

The Bun server renders each artifact on demand, accepts comment POSTs, and broadcasts file-change notifications over a WebSocket. Each artifact slug is its filename without extension; comments append to `feedback-{slug}.jsonl` next to the source. See `scripts/serve.ts` for endpoint and watcher details.

In the browser (one tab per artifact):
- Markdown renders fully (marked.js) as a published-style artifact — no raw syntax visible
- Drag-to-select any span and a popup appears at the selection
- Type a comment, ⌘Enter (or Submit) sends it as `{slug, anchor, context_before, context_after, comment}`
- The selected span is marked with a yellow highlight + 💬 marker
- When the source markdown changes (a `scan` round applied edits), the page auto-reloads while preserving scroll position

### JSONL Consumption Timing

Each JSONL line: `{slug, anchor, context_before, context_after, comment, timestamp, source_offset?}`. `context_before` + `context_after` (60 chars each) disambiguate repeated anchors. `source_offset` (optional integer) records the source-markdown byte offset when the browser can derive it — used when rendered text diverges from source (marked.js strips emphasis markers, link text drops URL parts, code block fences become `<pre>`).

A `scan` action consumes accumulated JSONL at its start:
1. Reads each line, locates the anchor in the source markdown using surrounding context
2. Wraps each comment as a `<feedback anchor="…">comment</feedback>` directive for the revision pass
3. Archives consumed JSONL to `feedback-{slug}-{timestamp}.consumed.jsonl` to prevent re-ingestion
4. After the scan applies edits, the browser auto-reloads; the user inspects the updated artifact and answers the next branch gate

An `apply` action consumes JSONL on a per-comment basis:
1. For each line, attempt faithful translation (comment intent → concrete Edit/Write call)
2. **Translatable** (clear edit intent, no conflict): apply edit, mark for archival
3. **Untranslatable** (ambiguous, conflicts with another comment, requires audit-level judgment such as fact verification or decision-quality assessment): leave the line in the JSONL queue — it survives this round and is processed in a future `scan`
4. After processing: archive only the translated lines; the queue retains the deferred ones; surface `({X} applied, {Y} deferred)` in the pre-gate prose

Apply mode tools are restricted to Edit / Write — verification or sub-protocol invocation belongs to scan. The "wait without consuming" affordance is implicit in not yet answering the gate — the user may keep drag-commenting in the browser; consumption happens only when the user responds.

## Why No Gate Reduction

Sub-protocol gates inside each `scan` action are not elided. All three protocols require **Constitution user judgment** on answers not entailed by upstream protocol outputs:
- `InformedExecution` (Aitesis output) does not entail the `{Address, Dismiss, Probe}` judgment Syneidesis asks
- `AuditedDecision` (Syneidesis output) does not entail the `{Confirm, Adapt, Dismiss}` judgment Epharmoge asks

The composition's value is therefore structural, not interaction-reducing:
1. **Signature unification** — caller supplies `(artifact, D, context)` once; the composition distributes
2. **Scope differentiation inscribed** — Named 3-scope + Emergent clause bypasses two suppression edges at pipeline level
3. **Channel-first modality** — rendered preview is opened in Phase 0 and persists across iterations; sub-protocol scans consume JSONL whenever the user picks `scan` at the branch gate
4. **Loop branch gate at the iteration boundary** — single 2-option Constitution gate (`scan` / `apply`) controls AI processing depth; both consume the JSONL queue so the hermeneutic cycle stays seamless. Termination is a free-response pathway declared once in Phase 0; "wait and add more comments" is implicit in not yet answering the gate.

## Materialized View

On user-explicit termination (free-response exit), present the transformation trace as aggregated totals — not a per-round breakdown. Round-level visibility belongs to the in-loop pre-gate prose (Phase L); the materialized view is the audit summary.

```
Iterations: {N} loops, [scan|apply] sequence: {e.g., scan, apply, apply, scan}
Aggregated across {S} scan rounds:
  Stage 1 (inquire):       {F} factual claims → {V} verified, {C} corrected, {U} flagged uncertain
  Stage 2 (gap):           {G} gaps surfaced → {A} addressed, {D_dis} dismissed (with assumption)
  Stage 3 (contextualize): {M} mismatches → {R} resolved, {S_dis} dismissed
                           {B} channel comments consumed → {I} incorporated
Channel state at exit:     {C_unc} unconsumed comments in feedback-{slug}.jsonl (preserved, not archived)
                            -- includes both never-processed comments AND apply-deferred ones awaiting scan
Artifact(s):                {list of paths}
Fixation event D:           {caller-supplied D}
Application context:        {caller-supplied context}
Sub-protocols invoked:      {/inquire: yes|no, /gap: yes|no, /contextualize: yes|no}  -- if user exits before any scan, "no" is auditable
```

## Error Recovery

Suffix-replay rules (apply within a single `scan` action):
- **Mid-chain invalidation**: Stage 1 factual correction invalidating a Stage 2 gap resolution → replay forward from Stage 2 (not backward compensation)
- **Same-reason cap**: Same-reason replay capped at 2 attempts before surfacing to the user with options: replay / proceed accepting mismatch / terminate preserving artifacts
- **Feedback consumption**: `feedback-{slug}.jsonl` is consumed at the start of a `scan` action and archived to `feedback-{slug}-{timestamp}.consumed.jsonl` to prevent stale comments re-entering subsequent scans. When the archive write fails (disk full, permission denied), surface the failure to the user — do not silently retry — and halt consumption until the underlying cause is resolved; silent retry would re-inject identical `<feedback>` directives into the revision pass.
- **Anchor-not-found on re-entry**: When a revision pass removes or substantially rewrites the anchor span, the next `scan` cannot locate the original feedback target. Behavior: (a) attempt fuzzy-match only when both `context_before` and `context_after` match within edit distance 5 — if matched, proceed as located; (b) otherwise emit the directive as `<feedback anchor="..." status="anchor-missing">comment</feedback>` with the original anchor + context retained so the user can judge whether the intent still applies — do not silently drop the feedback.
- **Scope-attribution drift**: Finding's scope attribution changing mid-scan → record under `origin: ambiguous` and re-scan the upstream protocol with re-attributed scope.
- **Bun server crash mid-loop**: Surface to user with two options: restart channel and resume (preserves accumulated JSONL) / terminate review with materialized view of completed iterations. Do not silently restart.

## Rules

1. **Composition, not absorption** — each sub-protocol remains independently invocable. `/artifact-review` orchestrates; it does not duplicate sub-protocol gate definitions.
2. **Scope differentiation is structural** — the two suppression edges fire only on same-scope co-activation. This pipeline keeps scopes distinct via the named 3-scope + Emergent clause. Chains that collapse scopes would re-trigger suppression and violate this rule.
3. **Emergent attribution priority** — boundary cases resolve by Factual > Decision > Application priority; remaining ambiguity is surfaced as an `origin: ambiguous` marker in the session text trace (not as a struct field on sub-protocol types) so both protocols detect the finding at their respective gates. This composition-level `origin` (scope attribution) is distinct from Epharmoge's internal `Origin ∈ {Initial, Emerged(aspect)}` struct (within-protocol mismatch provenance) — shared name, non-overlapping domain.
4. **Channel is the skill's identity** — opened in Phase 0, persisted across iterations. The rendered preview is the user's first input layer (Vorverständnis); markdown rendering visibility is itself a review surface, not merely a feedback collection mechanism. Missing bun runtime is a hard prerequisite failure (install hint then exit) — there is no degraded-mode fallback. Headless environments invoke `/inquire`, `/gap`, `/contextualize` directly; `/artifact-review` without channel would be a different skill.
5. **Feedback consumption is single-shot per comment with latest-timestamp dedup** — `scan` archives the entire JSONL at round start; `apply` archives only the comments it translated, leaving deferred (ambiguous / conflicting / audit-requiring) comments in the queue for a future `scan`. Each comment is consumed exactly once across the loop's lifetime. Entries sharing `(anchor, context_before, context_after)` keep only the latest timestamp at the moment of consumption.
6. **Caller-supplied signature is required** — `fixation_event D` and `application_context` must be explicit. When omitted, the skill infers defaults from the artifact path; if inference yields no confident match, the skill asks the user. Silent assumption of domain-specific defaults (e.g., "publish") would re-impose bias the composition is designed to avoid.
7. **Termination is user-explicit and free-response** — convergence is reached when the user signals exit at any time (declared once in Phase 0). The materialized view records which sub-protocols were invoked across all `scan` rounds, so any sub-protocol omission (e.g., user exits before any scan ran) is auditable rather than silent. The loop branch gate carries no `end` option per `derived-principles.md §Differential Future Requirement` (meta-actions surface as free-response pathways, not peer options).
8. **Multi-artifact variants are first-class** — when multiple artifacts are supplied, each runs through the pipeline with its own preview page, feedback file, and per-artifact branch gate; comments are namespaced per artifact and one artifact's pacing does not block another.

## Bundled Resources

- `scripts/serve.ts` — Bun-based live server; `bun scripts/serve.ts <artifact.md> [more...]`. Handles GET/POST/WebSocket; `node:fs.watch` triggers reload broadcasts.
- `templates/preview.html` — interactive markdown preview with selection-anchored comment popup, WebSocket hot-reload client, dark-mode support.
- `templates/marked.min.js` — bundled marked.js markdown renderer.

## Composition Lineage

Authored via `/compose`. Supersedes the legacy `/write-review` skill by generalizing the domain scope from blog-specific ("publish") to artifact-agnostic (caller-supplied fixation event + application context). Sub-protocol scope differentiation and channel-loop mechanism carry forward unchanged; changes are at the orchestration and signature layers.
