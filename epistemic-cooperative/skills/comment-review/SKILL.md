---
name: comment-review
description: "Review markdown or HTML artifacts before fixation (publish/commit/deposit/merge) via /inquire × /sublate × /gap × /contextualize through a channel-first browser preview loop. Markdown renders via marked; HTML serves directly through a Shadow DOM. Each round mode is `apply + scan` (apply queued comments now + scan to surface findings into the next round's sidepanel) or `apply` (apply only). User-invoked via /comment-review."
skills:
  - aitesis:inquire
  - elenchus:sublate
  - syneidesis:gap
  - epharmoge:contextualize
---

# Comment Review: Inquiry × Source Vetting × Gap Audit × Application-Fit Pipeline

Take any markdown or HTML artifact from drafted state to fixation-ready through four reviews — factual verifiability, source vetting, decision quality, application fit — bound to a **channel-first feedback loop with TaskList-backed sidepanel finding visibility**. The render substrate is keyed off the file extension: markdown (`.md`) renders through marked; HTML (`.html`/`.htm`) serves the raw file directly through a Shadow DOM. On invocation the skill opens a browser preview of the rendered artifact (Vorverständnis layer) and surfaces the loop's branch gate; the user reads the rendered preview first, then chooses how to advance each round. Every loop iteration presents a 2-option branch gate (`apply + scan` / `apply`) before the user returns to the browser for the next round. Both options apply this round's queued JSONL comments as edits NOW; `apply + scan` additionally runs the sub-protocol audit, materializing each finding (with its disposition affordance) into the TaskList for the NEXT round's sidepanel. `apply` skips the scan and partially consumes (faithful translation of unambiguous comment intent; ambiguous comments deferred to a future `apply + scan` round). The judgment venue for sub-protocol findings moves from in-round chat to next-round sidepanel — Constitution semantics preserved, timing shifted across the round boundary. "Wait and add more comments" is implicit in not yet answering the gate. Termination is a free-response pathway available at any time.

Unlike domain-specific editorial wrappers, `/comment-review` is agnostic about *what kind of artifact* is being reviewed — blog drafts, plan documents, crystallized handoffs, design docs, and changeset descriptions are all valid targets. The caller supplies the fixation event (what commits this artifact to downstream consumers) and the application context (where the fixed artifact will operate). The four protocols then specialize their scopes accordingly.

## Caller Signature

```
/comment-review(artifact_path, fixation_event D, application_context)

artifact_path        : String | List<String>                      -- path to markdown or HTML file(s); render mode keys off the extension
fixation_event D     : Irreversible(String) | Reversible(String)  -- committed action; tag drives /gap stakes default
                                                                   --   Irreversible (stakes=High default): publish, deposit, merge
                                                                   --   Reversible   (stakes=Medium default): commit-to-execution, approve-pending-revise
application_context  : String                                     -- where the fixed artifact operates
```

The caller — whether the user invoking `/comment-review` directly or a composing skill that calls this one — supplies all three fields. When `D` or `application_context` is omitted, the skill infers defaults from the artifact path when possible (e.g., `~/.claude/plans/*.md` → D = "commit to execution", `~/.claude/.write/*.md` → D = "publish"); if inference yields no confident match, the skill asks the user.

## Pipeline Overview

```
Phase 0  : channel open (browser, rendered preview)
Phase L  : loop iteration k
             Q (branch gate) :
               ① apply + scan — apply queued JSONL comments NOW (edits this round) + run /inquire → /sublate → /gap → /contextualize audit, materialize findings into TaskList for next round's sidepanel (no audit-finding edits this round), return to browser
               ② apply        — apply queued JSONL comments NOW (edits this round, partial; defer ambiguous), no audit, no new findings, return to browser
             user reads preview + sidepanel state in browser, drag-comments and/or disposes prior-round findings, then next chat turn answers the gate
free-exit : user may end the review at any time by saying so (Phase 0 prose declares this once)
```

4 protocols composed inside each `apply + scan` round's scan step (only when the user picks that option; `apply`-only sessions run 0 sub-protocol audits). `/sublate` joins the scan as a *range expansion* — it does NOT add a new round-mode option, the Phase L gate stays 2-option (`apply + scan` / `apply`). The loop is outer; sub-protocol Constitution semantics persist but their judgment venue moves from in-round chat to next-round sidepanel disposition (see "Why No Gate Reduction" below). Each iteration boundary surfaces exactly one branch gate. Findings surfaced by the scan are materialized into the harness-managed TaskList file with the source protocol's disposition coproduct attached, rendered in a browser sidepanel for the next round so the user can recognize per-finding state without leaving the rendered preview; resolution flows through the response popup (click finding → type response → submit; comment auto-tagged with `[task: <id>]`) or chat (TaskUpdate). Round-mode decisions stay in chat — modality cleanliness preserved.

## When to Use

- Any markdown artifact approaching a fixation event
- Any HTML artifact approaching a fixation event (rendered design page, exported report, standalone `.html` deliverable) — anchored by element-level CSS selector instead of text span
- Editorial iteration over multiple turns is expected
- Asynchronous comment-style feedback fits the review rhythm better than chat-gate dispositions
- Factual claims, named references, or external attributions warrant pre-fixation verification

## When NOT to Use

- Trivial artifacts (single sentence, typo, comment fix) — direct Edit suffices
- Code-centric changesets where `/review` is the right tool
- One-shot artifacts the user does not intend to revise

## Phase 0: Channel Open

On skill activation, before any sub-protocol runs:

1. **Bun preflight** — verify `bun --version` ≥ 1.0. If absent, print install hint (`curl -fsSL https://bun.sh/install | bash`) and exit. The channel is the skill's identity; running without it would change what `/comment-review` *is*, not just degrade UX. Headless environments fall back to `/inquire`, `/gap`, `/contextualize` invoked directly.
2. **Termination prose (declared once)** — announce *before opening the browser*: *"I'll open a browser preview. You can end this review at any time by saying so; on exit I will produce the materialized view and stop the channel server."* This is the free-response pathway for termination — it does not appear as a gate option. Announcing first ensures the exit affordance is visible before the first session artifact (the rendered preview) is presented.
3. **Channel open** — launching the channel server is a write/exec action. When the harness restricts non-read-only actions behind a permission gate, surface that gate for user approval before launching; proceed once it is cleared. Then start `bun scripts/serve.ts <artifact.md> [...]`, browser auto-opens to the rendered preview. The published-style render is the user's first input layer (Vorverständnis), independent of any AI surfacing — sub-protocol audit runs only when the user picks `apply + scan` at the branch gate.
4. **Branch gate (Round 1 entry)** — surface the loop iteration gate (Phase L below). The pre-gate prose surfaces the queue size when `feedback-{slug}.jsonl` exists from a prior session, or "No prior comments — fresh start." otherwise, so the user can recognize the carryover (or lack thereof) before choosing a round mode; consumption happens only after the user picks `apply + scan` or `apply` per Channel Modality § JSONL Consumption Timing.

## Phase L: Loop Iteration Branch Gate

After channel open (Round 1 entry) and after each round completes, surface the round counter in pre-gate prose so the user always knows where they are in the loop, then present the branch gate. Termination is the user's decision and is not surfaced as a peer option.

**Pre-gate prose** (per round) — surface BOTH the apply load (this round's queued comments) AND, when relevant, the scan delivery (findings that will land in the next round's sidepanel) so the cross-round flow is recognizable:
```
Round 1 entry (after Phase 0 channel open):
  Round 1 — browser preview opened. {N comments in queue from prior session. | No prior comments — fresh start.} {K open findings in sidepanel from prior session. | Sidepanel empty.}

Round k+1 entry (after Round k completed):
  Round {k} complete — apply + scan ({X} apply edits this round; {F_new} findings materialized for Round {k+1} sidepanel; {K_open} total open in sidepanel).
  Round {k} complete — apply ({X} applied, {Y} deferred to next apply + scan round).    -- after apply round; Y omitted when 0
  Browser preview reflects the latest edits. {K_open} open findings in sidepanel.
```

The sidepanel state line surfaces carryover (open findings the user can still dispose this round) without forcing inspection — the user chooses whether to read the panel before answering the next gate.

**Branch gate**:

```
Q : Round {k+1} — Which round mode? (Answer after browser comment authoring + sidepanel disposition is complete)
  ① apply + scan — APPLY: translate this round's queued JSONL comments into edits NOW (queued comments include both fresh drag-comments and any sidepanel disposition signals carrying [task: …] tags, which also call TaskUpdate(completed)).
                    SCAN: run /inquire → /sublate → /gap → /contextualize audit; for each finding, materialize a TaskList entry with the source-protocol disposition coproduct attached (no audit-finding edits this round). Findings appear in Round {k+2}'s sidepanel for user disposition.
  ② apply        — APPLY only: translate this round's queued JSONL comments into edits NOW (partial; defer ambiguous). No scan, no new findings. Faster round suited for flow-state iteration after the user has already disposed prior-round findings via the sidepanel.
                    Implicit contract: the user has performed their own cognitive scan via drag-commenting and sidepanel disposition,
                    so the AI handles faithful translation only.
                    Ambiguous / conflicting / audit-requiring comments are not archived → they remain in the queue,
                    naturally deferred to the next round (next round: `apply + scan` recommended).

To keep commenting / disposing, do not yet answer the gate — keep drag-commenting and clicking sidepanel dispose buttons in the browser. The answer marks round completion; the queue is consumed at that moment (apply mode supports partial consumption).
```

**Why 2 options, not 3 (or more)**: Termination is a *meta-action* — exit from the loop modality, not a position on the audit-presence axis. Meta-actions surface as free-response pathways rather than peer options because they do not commit to any downstream trajectory on the audit-depth axis (Differential Future Requirement: each peer option must produce a distinct downstream trajectory). The Phase 0 prose declares the exit affordance once; surfacing it at every gate would inflate the option set without differential trajectory on the loop axis. `/sublate` is similarly NOT a peer option — it joins the scan range as one of the four sub-protocols within `apply + scan`'s scan step, sharing the audit-depth axis as Steps 1–4 rather than introducing a new round-mode trajectory. The in-round chat gate count stays at exactly 1 (the round-mode gate itself); per-finding sub-protocol Constitution judgments are deferred to the next round's sidepanel disposition affordance, preserving Constitution semantics while compressing in-round chat traffic.

**Trajectory differential** — both options translate this round's queued JSONL into edits NOW (so the hermeneutic cycle stays seamless), but differ in whether the scan step also runs:
- ① `apply + scan` — APPLY: queued JSONL fully consumed + archived; clear comments translated into edits; sidepanel disposition signals (`[disposition: Discarded] [task: …]` etc.) translated to TaskUpdate(completed) plus, where the variant implies an edit, the corresponding edit; browser auto-reloads after edits. SCAN: `/inquire`+`/sublate`+`/gap`+`/contextualize` audit runs over the post-apply artifact; each finding is materialized as a TaskList entry whose description carries the source-protocol disposition coproduct (e.g., /sublate's 7-variant Confirmed/Revised/Discarded/Deferred/Conditional/Bounded/Routed; /gap's Address/Dismiss/Probe). No audit-finding edits this round; the user judges per finding via the next round's sidepanel.
- ② `apply` — APPLY only: clear comments translated into edits and archived; ambiguous / conflicting / audit-requiring comments stay in the queue (deferred to a future `apply + scan` round); sidepanel disposition signals also processed identically to (①). No sub-protocol audit, no new findings materialized. Lighter, faster round suited for flow-state iteration. Implicit contract: the user has performed their own cognitive scan via drag-commenting and sidepanel disposition, so the AI's role is *faithful translation* of unambiguous intent — when faithful translation is impossible, defer rather than guess.

**Round signal**: The user's next chat turn answering the gate *is* the round-complete signal. No separate browser button is needed — modality stays clean (browser collects comments and disposition signals, chat handles the round-mode decision).

**Inference defaults** (the project's Extension-default calibration for ambiguous gates — relay where confident, surface gate where ambiguous):
- Round 1 entry → `apply + scan` is the recognizable default when no prior session JSONL exists and no drag-select comments have been added (fresh artifact, no user signal yet); `apply` is the recognizable default when the user has already added drag-select comments before answering the gate. Defaults reduce friction by ordering options, not by auto-selecting.
- First gate after an `apply + scan` round with 0 new comments and ≥1 surfaced finding → `apply` is the recognizable default if the user has clear disposition intent on the sidepanel findings (typical: dispose via clicks then `apply` to translate); `apply + scan` if the user wants AI to re-evaluate after their changes — but still surface the gate.
- Multi-artifact: each artifact has its own browser tab + JSONL + loop counter; the branch gate is **per-artifact**. Aggregating would let one artifact's pacing block another (Rule 8 multi-artifact-first-class).

## Scope Differentiation (Suppression Bypass)

The composition includes two suppression edges from graph.json:
- `syneidesis ⊣ aitesis` — same-scope Aitesis suppression
- `aitesis ⊣ epharmoge` — same-scope pre+post stacking prevention

Both fire only on same-scope co-activation. This composition keeps scopes structurally distinct:

**Named primary scopes (working hypotheses)**:
- `/inquire` — factual verifiability of artifact claims (fact layer, pre-fixation temporal zone)
- `/sublate` — pre-execution context vetting of artifact-internal sources (source-decay layer, pre-fixation temporal zone; distinct from `/inquire` which fills factual gaps — `/sublate` stress-tests already-asserted sources via dialectical antithesis)
- `/gap` — decision quality w.r.t. fixation event D (decision layer, pre-fixation temporal zone, distinct dimension)
- `/contextualize` — application fit of fixed artifact against `application_context` (post-fixation temporal zone)

**Suppression analysis for `/sublate`**: graph.json declares advisory edges `aitesis → elenchus` (collected context provides audit substrate), `elenchus → syneidesis` (vetted context sharpens gap detection), and `elenchus → epharmoge` (vetted pre-state contextualizes post-execution check). No suppression edge involving Elenchus exists; `/sublate`'s scope (source-decay layer) does not collide with `/inquire`'s factual-presence scope, `/gap`'s decision-point scope, or `/contextualize`'s post-execution scope.

**Emergent clause**: Named scopes are working hypotheses per the Full Taxonomy Confirmation principle. Runtime boundary cases — where a finding could legitimately belong to more than one scope — resolve by **attribution priority**: Factual > Source-Vetting > Decision > Application. When a finding remains ambiguous after priority assessment, record under both scopes with `origin: ambiguous` annotation and surface at the first applicable sub-protocol surfacing gate in the pipeline. Silent attribution drift is a protocol violation; explicit dual-record preserves auditability.

## Scan Step 1: Factual Verification (`/inquire`)

Within each `apply + scan` round's scan step, `/inquire` runs first as Step 1 against the artifact's factual surface — named people, project names, citations, statistics, technical claims about external systems, links. `/inquire` Phase 1 dispatches to the right verification track (CodeDerivable, CanonicalExternal via WebFetch, Instrumentation, UserTacit) per claim. `/inquire`'s own Phase 2 Constitution gates do not fire as in-round chat prompts here; instead, each surfaced uncertainty is materialized as a TaskList entry (with the resolution-track choice rendered as the disposition affordance for the next round's sidepanel).

**Pipeline context rules** (when `/inquire` is called from this pipeline):
- **Scope**: factual verifiability of artifact claims (fact layer)
- **Conditional no-op**: artifacts with no factual claims (e.g., plan files describing design intent with no external references) trigger a silent no-op for this audit step — the 4-track dispatch finds no resolvable uncertainties; continue with Step 2 of the `apply + scan` round's scan step

## Scan Step 2: Pre-Fixation Source Vetting (`/sublate`)

The dialectical vetting step that pairs with `/inquire`'s factual verification. Where `/inquire` asks "is this asserted claim verified?", `/sublate` asks "what would shake the sources the artifact relies on, and how should each source be handled?" This step runs after `/inquire` so newly verified claims enter `/sublate`'s audit-candidate set, and before `/gap` so vetted sources sharpen decision-quality gap detection. Graph.json advisory edges `aitesis → elenchus` and `elenchus → syneidesis` justify the order: collected context provides the substrate for vetting, vetted context sharpens downstream gap detection.

Invoke `/sublate` over the artifact-internal sources surfaced during `/inquire` plus any prior-collected sources cited by the artifact (citations, named claims, attributions, external references). `/sublate` Phase 0 silently scans for high-leverage / aged / chained / contradicting sources; Phase 1 tags provenance, freshness, leverage and posits an antithesis per source. The Phase 2 per-source disposition coproduct (Confirmed / Revised / Discarded / Deferred / Conditional / Bounded / Routed) does not fire as an in-round chat gate in this pipeline — instead the coproduct is materialized as the disposition affordance attached to each finding's TaskList entry, surfaced in the next round's sidepanel for user judgment.

**Pipeline context rules** (when `/sublate` is called from this pipeline):
- **Scope**: pre-execution context vetting of artifact-internal sources (source-decay layer)
- **D-binding**: caller-supplied `fixation_event D` is the pre-execution sync that warrants vetting; `/sublate`'s User-initiated activation precondition is satisfied by the user's invocation of `/comment-review` over an artifact targeting `D`
- **Information source**: `/inquire`'s factual track output plus prior-collected sources cited by the artifact
- **Conditional no-op**: artifacts with no high-leverage / aged / chained / contradicting source trigger a silent no-op (Phase 0 yields S_high = ∅, trivial convergence) — continue with Step 3 (gap) of the `apply + scan` round's scan step
- **Suppression precondition**: no suppression edge fires — `/sublate` shares no scope with `/inquire`, `/gap`, or `/contextualize` (see Scope Differentiation above)
- **Constitution venue shift**: per-source disposition judgment moves from in-round chat to next-round sidepanel; Constitution semantics (user judges every audit-candidate source) preserved cross-round

## Scan Step 3: Decision-Quality Gap Audit (`/gap`)

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
- **Constitution venue shift**: `/gap`'s per-gap disposition (Address / Dismiss / Probe) does not fire as an in-round chat gate; the coproduct is rendered as the disposition affordance attached to each gap finding's TaskList entry, judged by the user in the next round's sidepanel

**Double-/gap composition note**: When `/comment-review` is called downstream of `/write` (i.e., `/write` produces a draft that `/comment-review` then reviews), both skills invoke `/gap` at distinct scopes — `/write`'s internal Phase 7 `/gap` audits draft-quality gaps (procedural / duplicate / consideration within the artifact), while `/comment-review`'s Scan Step 3 `/gap` audits decision-quality gaps w.r.t. fixation event `D`. The scope distinction preserves the scope-differentiation invariant; composition is not redundant.

## Scan Step 4: Application-Fit Check (`/contextualize`)

The applicability check that closes each `apply + scan` round's scan step. The channel itself is not a step — it is the surrounding modality opened in Phase 0; the apply step has already consumed this round's queued JSONL and produced edits before this scan step runs over the post-apply artifact.

### Standard Path

Invoke `/contextualize` with `application_context` as `X`. Scans for Convention / Environment / Audience / Dependency mismatches plus Emergent dimensions.

**Pipeline context rules** (when `/contextualize` is called from this pipeline):
- **Scope**: application fit of fixed artifact against application_context (post-fixation)
- **X**: caller-supplied application_context
- **Information source**: post-apply artifact state (after this round's apply step processed the queued JSONL) + standard post-execution applicability scan
- **Suppression precondition**: `aitesis ⊣ epharmoge` does NOT fire — distinct temporal scopes (pre-fixation vs post-fixation)
- **Constitution venue shift**: `/contextualize`'s per-mismatch disposition (Confirm / Adapt / Dismiss) does not fire as an in-round chat gate; the coproduct is rendered as the disposition affordance attached to each mismatch finding's TaskList entry, judged by the user in the next round's sidepanel

## Channel Modality

The browser channel is opened once in Phase 0 and remains live across all loop iterations until the user terminates the review. It is the **default review modality**, not a Phase-3 augmentation: the rendered preview is the user's first input layer and continues to be the medium where applicability mismatches (font, heading rhythm, link presentation, line-break-driven cadence) become visible.

### Server + Browser Behavior

The Bun server renders each artifact on demand, accepts comment POSTs, and broadcasts file-change notifications over a WebSocket. Each artifact slug is its filename without extension; comments append to `feedback-{slug}.jsonl` next to the source. The server picks the render mode from the file extension (`.html`/`.htm` → HTML; everything else → markdown) and injects it into the preview page. See `scripts/serve.ts` for endpoint and watcher details.

**Render modes**:
- **Markdown** (marked) — the source markdown is rendered into the light DOM as a published-style artifact; frontmatter is stripped so only the body shows.
- **HTML** (Shadow DOM) — the raw `.html` file is served *as the artifact itself* through an open Shadow DOM (`attachShadow({mode:'open'})`, `shadowRoot.innerHTML = rawHtml`). The Shadow DOM gives CSS isolation from the review chrome, renders inert any `<script>` inserted via `innerHTML` (innerHTML never executes scripts — safe by construction), and keeps selector-click working because it is the same document. marked is not used in HTML mode; the file passes through raw and untouched.

In the browser (one tab per artifact):
- The artifact renders as above — no raw markdown syntax in markdown mode; the page rendered as authored in HTML mode
- **Anchor a comment**: markdown — drag-to-select any text span; HTML — click any element (the element becomes the anchor, identified by a unique CSS selector / DOM path)
- Type a comment, ⌘Enter (or Submit) sends it as `{slug, anchor, context_before, context_after, comment}` (markdown) or `{slug, anchor, anchor_kind:"selector", selector, comment}` (HTML)
- The anchored target is marked: markdown — yellow text highlight + 💬; HTML — an outline + 💬 on the element in place
- A right-side fixed sidepanel renders open scan findings for this artifact (see Sidepanel and Finding Visibility below)
- When the source file changes (a round applied edits), the page auto-reloads while preserving scroll position; the sidepanel refreshes from the TaskList store at the same boundary, and HTML findings re-resolve their selectors against the freshly rendered Shadow DOM

### Sidepanel and Finding Visibility

The browser channel renders a right-side fixed panel adjacent to the artifact preview. The panel lists open scan findings from PRIOR `apply + scan` rounds (this round's scan step materializes findings into the panel for the NEXT round's display, never the current round's). Each finding is a one-line entry with a single status marker. Findings with a resolvable anchor render an extra in-place marker and clicking the sidepanel entry scrolls the preview to it: in markdown mode the anchor is a rendered text span marked with a coral underline; in HTML mode the anchor is a CSS selector resolved against the Shadow DOM and the matched element gets a coral outline. The marker is distinct from the comment highlight, and clicking the entry scrolls to and pulses the anchor. Findings without a resolvable anchor (e.g., procedural gaps from `/gap`, document-level dispositions from `/sublate`) appear in the sidepanel only, visually distinguished (e.g., dashed-left-border italic).

The sidepanel surfaces findings + offers a unified **response popup** as the single browser-side write affordance. Clicking a sidepanel entry — or its in-text coral anchor — opens the response popup pre-loaded with the finding's full content (subject + body) above an empty textarea. The user types a free-form response and submits; the comment is automatically tagged with `[task: <task-id>]` so the next apply step recognizes it as a disposition signal against the named TaskList entry. Anchored findings additionally scroll to and pulse the in-text mark when the popup opens.

- **Click finding entry (or its coral underline)** → response popup opens with finding context + textarea
- **Submit response** → comment posted to `/feedback` with `[task: <id>]` auto-appended; the next apply step translates the comment into edits and calls `TaskUpdate(status=completed)`
- **Cancel popup** → no submission; finding stays open
- **Close without responding** → ask in chat ("mark task &lt;id&gt; done"); the AI calls `TaskUpdate(status=completed)` directly

The disposition tag convention `[disposition: <variant>] [task: <task-id>]` remains the abstract contract for richer per-variant signaling (Confirmed/Revised/Discarded/Deferred/Conditional/Bounded/Routed for /sublate, Address/Dismiss/Probe for /gap, etc.); the response popup's auto-tag is the minimal-form realization (any submitted text + `[task: <id>]` is treated as Address-equivalent by the apply step). Future iteration may surface a per-variant disposition picker. Findings the user neither responds to nor closes via chat persist across rounds (deferred). The sidepanel reloads at the round boundary and excludes entries where `status == completed`.

Modality cleanliness preserved: the response popup is the existing comment-collection surface (extended with finding context + auto-tag); round-mode decisions and explicit closes still flow through chat.

### Anchor Assignment (UUID-based, ambiguity-free)

When a scan finding has a text-anchored target in the source markdown, the AI references the rendered HTML preview to identify the unique span (rendered DOM position is unambiguous; markdown substring may not be — e.g., repeated phrases like "Phase 1" or "the user"), generates a UUID, and wraps the target span in source markdown:

```
<span id="cr-anchor-{UUID}" class="finding-anchor">target text</span>
```

The TaskList entry's description records `[anchor-id: {UUID}]` (in addition to or in place of `[anchor: <text>]`). preview.html prefers `document.getElementById("cr-anchor-{UUID}")` over substring search when `anchor-id` is present — eliminating the substring-match ambiguity for repeated phrases by construction. The wrap is an invisible source mutation: semantic content unchanged, marked.js renders the span transparently, the existing `.finding-anchor` CSS supplies the coral underline. Findings without resolvable anchors (e.g., `/gap`'s document-level procedural gaps) carry no `anchor-id` and continue to surface in the sidepanel's document-level section.

### HTML Anchoring (element-level, selector-based)

The anchor data model is a tagged union keyed by `anchor_kind`:

- **`anchor_kind: "text"`** (markdown; the default when the field is absent — existing markdown JSONL stays backward-compatible) — the anchor is a rendered text span, located by substring + surrounding context as above.
- **`anchor_kind: "selector"`** (HTML) — the anchor is a single element. On a click in the Shadow DOM, preview.html computes a **unique CSS selector / DOM path** for the clicked element (a unique `#id` when one exists, otherwise a `tag:nth-of-type(n)` child chain up to the shadow root) and posts it as both `anchor` and `selector` with `anchor_kind:"selector"`. The element is marked in place (outline + 💬); on reload, marks re-apply by re-querying the stored selectors against the freshly rendered Shadow DOM.

**Apply-step edit-back fixation in selector mode**: the HTML file *is* the artifact — edits land directly in the `.html`. When the apply step processes a selector-anchored comment, the AI locates the target element in the source `.html` by its CSS selector (the same selector captured at click time) and edits that element directly. This is the same edit-back apply pipeline as markdown (locate the anchor, translate comment intent into an Edit/Write call) — only the locate step differs: CSS selector resolution in the `.html` rather than text substring match in the `.md`. This behavior is AI-performed per this contract; serve.ts persists the selector but performs no edit itself.

### TaskList File as Sync Medium

Sidepanel state lives in `~/.claude/tasks/<session-uuid>/<task-id>.json`, the harness-managed task store. Each scan finding materializes as one task entry (`{id, subject, description, activeForm, status, blocks, blockedBy}`); the sidepanel reads the store at round-boundary reload, filters entries by the current artifact slug (substring match against `description`), and excludes entries where `status == completed`. No new endpoint, broadcast channel, or storage system is introduced — the existing file-based task store is the single source of truth for finding lifecycle, and the existing `/feedback` POST endpoint is the single user-write channel for both fresh comments and disposition signals.

Per-session structure caveat: tasks are stored under a session-UUID directory. The server scans every session directory under `~/.claude/tasks/` for entries whose description carries the artifact slug, so findings created in earlier sessions remain visible until disposed; this preserves the hermeneutic cycle across sessions.

### JSONL Consumption Timing

Each JSONL line: `{slug, anchor, anchor_kind?, selector?, context_before, context_after, comment, timestamp, source_offset?}`. `anchor_kind` (`"text" | "selector"`, absent ⇒ `"text"`) and `selector` (the CSS selector / DOM path, present only in selector mode) form the HTML tagged-union anchor; markdown lines omit both and stay byte-identical to the legacy shape. `context_before` + `context_after` (60 chars each) disambiguate repeated text anchors (markdown). `source_offset` (optional integer) records the source-markdown byte offset when the browser can derive it — used when rendered text diverges from source (marked.js strips emphasis markers, link text drops URL parts, code block fences become `<pre>`). The `comment` field doubles as the disposition channel: comments containing `[disposition: <variant>] [task: <task-id>]` tags are treated as disposition signals against the named TaskList entry; comments without those tags are treated as plain edit intents.

An `apply + scan` round runs **apply step first, then scan step** within a single round-mode commitment:

**Apply step** (always first — operates on this round's queued JSONL):
1. **At the start of the apply step (immediately after the user answers the round-mode gate), Read `feedback-{slug}.jsonl` afresh** — any prior in-session Read of this file (e.g., the pre-gate queue-size prose) is informational only and does not substitute for this Read, since the browser may have appended lines between the pre-gate prose and the gate answer. Then, for each line, locate the anchor in the source artifact (skipping lines that are pure tombstones from edits): text-mode lines (markdown) locate by substring + surrounding context; selector-mode lines (`anchor_kind:"selector"`, HTML) locate the element in the source `.html` by the recorded CSS selector (edit-back fixation — see HTML Anchoring above).
2. Classify each line:
   - **Disposition signal** (comment matches `[disposition: <variant>] [task: <task-id>]`): call `TaskUpdate(status=completed)` against the named task and, when the variant implies an edit (e.g., `Revised`, `Address`), translate the variant's semantics into a concrete Edit/Write call. `Discarded`/`Dismiss`/`Confirmed`/`Bounded`/`Routed` close the task without an edit.
   - **Address-via-comment** (free comment optionally carrying `[task: <task-id>]`): translate the comment intent into an Edit/Write call; if the link tag is present, additionally call `TaskUpdate(status=completed)` against the named task.
   - **Plain edit comment** (no tag): translate the comment intent into an Edit/Write call.
   - **Untranslatable** (ambiguous / conflicting / audit-requiring): leave the line in the queue (deferred to a future `apply + scan` round).
3. Archive consumed (translated + disposed) lines to `feedback-{slug}-{timestamp}.consumed.jsonl` to prevent re-ingestion; deferred lines remain in the queue.
4. After edits land, the browser auto-reloads.

**Scan step** (only in `apply + scan`, never in `apply`-only — operates on the post-apply artifact):
1. Run `/inquire` → `/sublate` → `/gap` → `/contextualize` against the post-apply artifact.
2. Each surfaced finding is materialized as a TaskList entry. The task `description` carries the finding body plus inline tags: `[anchor: ...]` when bound (text), `[anchor-id: <UUID>]` when bound (preferred — see Anchor Assignment), `[sub-protocol: inquire|sublate|gap|contextualize]`, `[round: K]`, `[slug: ...]` (used as the sidepanel filter key), and `[disposition-options: <variant₁>, <variant₂>, ...]` listing the source protocol's full coproduct so a future richer UI can render the picker without re-deriving the variant set.
3. **No edits land from the scan step this round** — the user judges each finding via the next round's sidepanel disposition affordance, and the disposition signal is processed in the next round's apply step.

After both steps complete, the user inspects the updated artifact + the new sidepanel state and answers the next branch gate.

**Cross-round flow**: Round k's scan findings → Round k+1's sidepanel → user disposes via sidepanel/comments → Round k+1's apply step translates dispositions to edits + `TaskUpdate` calls. Sub-protocol Constitution semantics are preserved with a 1-round latency between detection and edit landing.

An `apply`-only round skips the scan step entirely. It runs the apply step exactly as above (including processing of disposition signals against prior-round findings) but generates no new TaskList entries.

**Empty-queue degenerate**: `apply` selected on an empty queue with no disposition signals completes as a no-op — the round counter advances, pre-gate prose surfaces `Round {k} complete — apply (0 applied, 0 deferred)`, browser does not reload (no edits applied). Recovery is implicit: the user can drag-comment or dispose findings in the browser before answering the next gate.

Apply step tools are restricted to Edit / Write + `TaskUpdate` — sub-protocol invocation belongs to the `apply + scan` mode's scan step only. The "wait without consuming" affordance is implicit in not yet answering the gate — the user may keep drag-commenting and disposing in the browser; consumption happens only when the user responds.

## Why No Gate Reduction

Sub-protocol Constitution gates are **not elided** — they are **relocated**. All four protocols require Constitution user judgment on answers not entailed by upstream protocol outputs:
- `InformedExecution` (Aitesis output) does not entail the per-source disposition judgment Elenchus asks
- `VettedContext` (Elenchus output) does not entail the `{Address, Dismiss, Probe}` judgment Syneidesis asks
- `AuditedDecision` (Syneidesis output) does not entail the `{Confirm, Adapt, Dismiss}` judgment Epharmoge asks

In a standalone invocation, each sub-protocol's Phase 2 fires as an in-round chat gate, the user judges, and edits follow. In this pipeline, the Phase 2 coproduct is **materialized into the corresponding TaskList entry's disposition affordance** in the next round's sidepanel; the user's per-finding judgment expresses through sidepanel clicks (and tagged comments), and the next apply step translates that judgment into edits + `TaskUpdate` calls. Constitution semantics — every audit finding is judged by the user before becoming an edit — are preserved without loss; only the venue (chat → sidepanel) and timing (in-round → next-round) shift.

The composition's value is therefore structural, not interaction-reducing:
1. **Signature unification** — caller supplies `(artifact, D, context)` once; the composition distributes
2. **Scope differentiation inscribed** — Named 4-scope + Emergent clause bypasses two suppression edges at pipeline level
3. **Channel-first modality with cross-round sidepanel disposition** — rendered preview is opened in Phase 0 and persists across iterations; the sidepanel surfaces per-finding state with disposition affordances from the TaskList file across rounds; sub-protocol scans materialize findings whenever the user picks `apply + scan`, and the user judges them through the sidepanel rather than through in-round chat gates
4. **Loop branch gate at the iteration boundary, in-round chat gate count = 1** — single 2-option Constitution gate (`apply + scan` / `apply`) controls AI processing depth; per-finding sub-protocol Constitution judgments are deferred to next-round sidepanel rather than firing as additional in-round chat gates, compressing in-round chat traffic to one decision per round while preserving the per-finding judgment cardinality across rounds. `/sublate` joins as a scan range expansion, NOT a peer round-mode option (it shares the audit-depth axis with the other scan steps, not a distinct downstream trajectory at the round-mode level). Termination is a free-response pathway declared once in Phase 0; "wait and add more comments / dispose findings" is implicit in not yet answering the gate.

## Materialized View

On user-explicit termination (free-response exit), present the transformation trace as aggregated totals — not a per-round breakdown. Round-level visibility belongs to the in-loop pre-gate prose (Phase L); the materialized view is the audit summary.

```
Iterations: {N} loops, [apply+scan|apply] sequence: {e.g., apply+scan, apply, apply, apply+scan}
Apply load (across all {N} rounds):
  {C_in} queued comments processed → {E_apply} edits landed, {Df_apply} deferred to a future round
  {D_sig} disposition signals processed → {E_dis} edits landed, {Tc} TaskList entries closed
Scan load (across {S} apply + scan rounds):
  Step 1 (inquire):       {F_s} findings surfaced → materialized for next-round disposition
  Step 2 (sublate):       {N_s} sources surfaced → materialized for next-round disposition (7-variant coproduct attached)
  Step 3 (gap):           {G_s} gaps surfaced → materialized for next-round disposition
  Step 4 (contextualize): {M_s} mismatches surfaced → materialized for next-round disposition
Cross-round disposition trace:
  {F_total} findings materialized across all scan rounds
    → {F_disposed} disposed by the user via sidepanel (across subsequent rounds)
       breakdown: {by-variant counts, e.g., Confirmed:k, Revised:k, Discarded:k, ...}
    → {F_open} still open at exit (carried in TaskList for future sessions)
Channel state at exit:     {C_unc} unconsumed comments in feedback-{slug}.jsonl (preserved, not archived)
                            -- includes never-processed comments AND apply-deferred ones awaiting a future round
Sidepanel state at exit:   {K_open} open findings remaining in TaskList for slug (status != completed)
                            -- preserved across sessions; subsequent /comment-review run reloads them
Artifact(s):                {list of paths}
Fixation event D:           {caller-supplied D}
Application context:        {caller-supplied context}
Sub-protocols invoked:      {/inquire: yes|no, /sublate: yes|no, /gap: yes|no, /contextualize: yes|no}  -- if user exits before any apply + scan round, "no" is auditable
```

## Error Recovery

Suffix-replay rules (apply within a single `apply + scan` round's scan step — the apply step has already landed before scan begins, so apply-step errors surface directly without suffix-replay):
- **Mid-chain invalidation**: an earlier scan step's finding invalidating a later scan step's finding → replay forward from the affected step (not backward compensation). Examples: Step 1 factual finding invalidating a Step 2 source-vetting finding → replay forward from Step 2; Step 2 source revision invalidating a Step 3 gap finding → replay forward from Step 3. Replay produces revised TaskList entries before round-boundary materialization.
- **Same-reason cap**: Same-reason replay capped at 2 attempts before surfacing to the user with options: replay / proceed accepting mismatch / terminate preserving artifacts
- **Feedback consumption**: `feedback-{slug}.jsonl` is consumed at the start of every round's apply step and archived to `feedback-{slug}-{timestamp}.consumed.jsonl` to prevent stale comments re-entering subsequent rounds. When the archive write fails (disk full, permission denied), surface the failure to the user — do not silently retry — and halt consumption until the underlying cause is resolved; silent retry would re-translate identical comments and disposition signals.
- **Anchor-not-found on apply**: When a prior edit removes or substantially rewrites the anchor span of a queued comment or a referenced TaskList finding, the apply step cannot locate the target. Behavior: (a) attempt fuzzy-match only when both `context_before` and `context_after` match within edit distance 5 — if matched, proceed as located; (b) otherwise leave the line in the queue tagged `status="anchor-missing"` (and, for disposition signals against a TaskList task, leave the task open with `Λ.history` annotated) so the user can judge whether the intent still applies — do not silently drop.
- **Scope-attribution drift**: Finding's scope attribution changing mid-scan → record under `origin: ambiguous` in the materialized TaskList entry and re-scan the upstream protocol with re-attributed scope.
- **Bun server crash mid-loop**: Surface to user with two options: restart channel and resume (preserves accumulated JSONL + TaskList state) / terminate review with materialized view of completed iterations.

## Rules

1. **Composition, not absorption** — each sub-protocol remains independently invocable. `/comment-review` orchestrates; it does not duplicate sub-protocol gate definitions.
2. **Scope differentiation is structural** — the two suppression edges fire only on same-scope co-activation. This pipeline keeps scopes distinct via the named 4-scope + Emergent clause. Chains that collapse scopes would re-trigger suppression and violate this rule.
3. **Emergent attribution priority** — boundary cases resolve by Factual > Decision > Application priority; remaining ambiguity is surfaced as an `origin: ambiguous` marker in the session text trace (not as a struct field on sub-protocol types) so both protocols detect the finding at their respective gates. This composition-level `origin` (scope attribution) is distinct from Epharmoge's internal `Origin ∈ {Initial, Emerged(aspect)}` struct (within-protocol mismatch provenance) — shared name, non-overlapping domain.
4. **Channel is the skill's identity** — opened in Phase 0, persisted across iterations. The rendered artifact is the user's first input layer (Vorverständnis); the render substrate is the artifact as it will be consumed — marked for markdown, direct Shadow-DOM render for HTML — and that rendered surface is itself a review surface, not merely a feedback collection mechanism (rendering visibility — markdown cadence, HTML layout/CSS — is where applicability mismatches become visible). Missing bun runtime is a hard prerequisite failure (install hint then exit) — there is no degraded-mode fallback. Headless environments invoke `/inquire`, `/gap`, `/contextualize` directly; `/comment-review` without channel would be a different skill.
5. **Feedback consumption is single-shot per comment with latest-timestamp dedup, on a fresh Read each apply** — both round modes archive consumed lines at the apply step (clear comments + disposition signals translated; ambiguous/conflicting comments deferred). The apply step's input is a fresh Read of `feedback-{slug}.jsonl` taken when the user answers the round-mode gate; any prior in-session Read of this file is informational only and does not seed consumption, since the browser may have appended lines between any earlier Read and the gate answer. `apply + scan` and `apply` archive identically at the apply-step level; the difference is whether a scan step also runs after. Each comment is consumed exactly once across the loop's lifetime. Entries sharing `(anchor, context_before, context_after)` keep only the latest timestamp at the moment of consumption.
6. **Caller-supplied signature is required** — `fixation_event D` and `application_context` must be explicit. When omitted, the skill infers defaults from the artifact path; if inference yields no confident match, the skill asks the user. Silent assumption of domain-specific defaults (e.g., "publish") would re-impose bias the composition is designed to avoid.
7. **Termination is user-explicit and free-response** — convergence is reached when the user signals exit at any time (declared once in Phase 0). The materialized view records which sub-protocols were invoked across all `apply + scan` rounds, so any sub-protocol omission (e.g., user exits before any `apply + scan` round ran) is auditable rather than silent. The loop branch gate carries no `end` option per Differential Future Requirement (meta-actions surface as free-response pathways, not peer options).
8. **Multi-artifact variants are first-class** — when multiple artifacts are supplied, each runs through the pipeline with its own preview page, feedback file, and per-artifact branch gate; comments are namespaced per artifact and one artifact's pacing does not block another.
9. **TaskList-mediated finding lifecycle with disposition-via-comment convention** — sidepanel state lives in `~/.claude/tasks/<session-uuid>/<task-id>.json`, the harness-managed task store. Findings materialize as task entries during `apply + scan` rounds' scan step; serve.ts reads at round-boundary reload, filters by artifact slug (substring match against `description`), and excludes `status == completed`. Disposition flows through the existing `/feedback` POST endpoint: comments containing `[disposition: <variant>] [task: <task-id>]` are recognized as disposition signals; the next apply step calls `TaskUpdate(status=completed)` against the named task and translates per-variant semantics into edits where applicable. The mapping format is deterministic — `description` carries the finding body plus inline tags `[anchor: ...]` (when bound, text), `[anchor-id: <UUID>]` (when bound, preferred for ambiguity-free DOM lookup), `[sub-protocol: ...]`, `[round: K]`, `[slug: ...]`, `[disposition-options: <variant₁>, <variant₂>, ...]`. No new endpoint, broadcast channel, or storage system is introduced; the existing file-based store is the single source of truth for finding lifecycle, and the existing `/feedback` POST endpoint is the single user-write channel for both fresh comments and disposition signals.
10. **Cross-round Constitution preservation** — sub-protocol Phase 2 Constitution gate option sets are not elided; they are materialized as TaskList disposition affordances and judged by the user in the next round's sidepanel. Per-finding constitutive authority moves across the round boundary without loss; what compresses is in-round chat traffic (down to one decision per round — the round-mode gate itself), not Constitution semantics. The composition trades 1 round of latency between detection and edit landing for clean modality (chat = round-mode decision; sidepanel = per-finding disposition) and bounded in-round chat surface area.

## Bundled Resources

- `scripts/serve.ts` — Bun-based live server; `bun scripts/serve.ts <artifact.md|artifact.html> [more...]`. Picks the render mode from the file extension and injects it into the preview; handles GET/POST/WebSocket; `node:fs.watch` triggers reload broadcasts.
- `templates/preview.html` — interactive preview with anchored comment popup, WebSocket hot-reload client, dark-mode support. Renders markdown via marked into the light DOM (text-span anchoring) or raw HTML through a Shadow DOM (element-click CSS-selector anchoring).
- `templates/marked.min.js` — bundled marked.js markdown renderer (markdown mode only; not used in HTML mode).

## Composition Lineage

Authored via `/compose`. Supersedes the legacy `/write-review` skill by generalizing the domain scope from blog-specific ("publish") to artifact-agnostic (caller-supplied fixation event + application context). Sub-protocol scope differentiation and channel-loop mechanism carry forward unchanged; changes are at the orchestration and signature layers. `/sublate` (Elenchus) was added later as a scan range expansion per a 2-cycle `/elicit` design session: the loop branch gate stays 2-option, the scan grows from 3 sub-protocols to 4, and finding visibility extends through a TaskList-backed sidepanel — preserving the modality split (browser collects, chat decides) while making per-finding state recognizable across rounds. A subsequent `/inquire` cycle then revealed that the original `scan + apply` framing conflated the apply step (this round's queued comments → edits) with the in-round firing of sub-protocol Constitution gates, which empirically required multiple chat turns per round-mode commitment. The corrected design renames `scan + apply` → `apply + scan` to make the cross-round nature visible and relocates sub-protocol Phase 2 judgment from in-round chat to next-round sidepanel disposition affordances, preserving Constitution semantics while compressing in-round chat traffic to a single round-mode decision per iteration.
