---
name: review-loop
description: "Convergence-paced code/PR review-resolve loop via /review-loop. Drives a pluggable review source (codex | code-review), passing it the design intent already captured for the changed surface (relevant project rules + adjacent design comments) so intentional documented choices are pre-filtered upstream, verifies each finding against the codebase (/inquire) and work-flow (/contextualize), auto-applies Mechanical fixes (Extension) and gates Judgment fixes by shared disposition (Constitution), risk-screens applies (substrate risk → harness permission; epistemic risk → direct Constitution), then re-reviews until the source verdict converges to approve. User-invoked via /review-loop."
skills:
  - aitesis:inquire
  - epharmoge:contextualize
---

# Review Loop

A source-agnostic, convergence-paced review-resolve loop for code/PR diffs: it drives a pluggable review source to convergence (verdict=approve), auto-applying mechanical fixes and gating the judgment calls.

## Caller Signature

```
/review-loop [source?] [scope?]

source : { codex | code-review }                     -- optional; review source behind the (diff, design-intent) → { findings[], verdict } interface
                                                     --   absent → Phase 0 asks which source to use (no default)
scope  : PR number | (implicit)                      -- optional; PR number, or implicit current-PR / working-tree detection
```

The review source is pluggable: any source satisfying the `(diff, design-intent) → { findings[], verdict }` interface can drive the loop. `codex` and `code-review` are the two sources documented in the Source Interface section; both are runtime-selected, not fixed at definition time. When `source` is omitted, Phase 0 asks which source to use (no preselected default). When `scope` is omitted, Phase 0 detects it (current-branch PR or working tree).

## Pipeline Overview

```
/review-loop [source?] [scope?]
  Phase 0  : source designation (arg → relay | absent → ask) + scope detect (PR diff | working tree)
                          + design-intent harvest (rules/comments for the changed surface → intent bundle)
  Phase 1  : review    — source(diff, intent) → { findings[], verdict }
  Phase 2  : verify     — per finding: /inquire (vs codebase) + /contextualize (vs work-flow);
                          drop findings failing support-integrity / context-fit (cite basis)
  Phase 3  : classify  — Mechanical → Extension (auto)
                          Judgment   → cluster by shared disposition → Constitution scope-gate
  Phase 4  : apply      — risk screen (substrate → harness permission; epistemic → Constitution) → apply approved edits
  Phase 5  : re-review  — source(diff', intent) → verdict'
               verdict'=approve (or 0 new) → converge ; else round k+1: these findings → Phase 2 (re-review already done; no second source call)
  free-exit : user may end the loop at any time (declared once in Phase 0)
```

The loop is the skill's identity; the review source is a parameter behind it. Loop control (verify → classify → apply → re-review) is fixed; the source that produces `{ findings[], verdict }` is swappable.

**Scope:** the loop resolves every source-surfaced, verification-passing finding on the changed code — including pre-existing issues in touched files and methodology concerns — not only defects the diff introduced.

## When to Use

- Driving code/PR review findings all the way to resolution and convergence (verdict=approve)
- A review pass surfaced findings and you want them verified, dispositioned, applied, and re-checked in one controlled loop
- Multiple review rounds are expected before the diff is clean

## When NOT to Use

- Reviewing a markdown artifact before fixation — that is `/comment-review` (this skill targets code/PR diffs)
- Wanting a one-shot review with no apply phase — call a source directly (the codex CLI or `/code-review`); for a cross-model composition, assemble it with `/conduct` (frame supplies the lenses, conduct arranges the review topology) — `/review-loop` is the loop that drives findings to approve
- Wanting to resolve ONLY findings your PR's own changes introduced (not pre-existing issues surfaced in the touched files) — `/review-loop` drives the whole changed surface to convergence; for a PR-introduced-only pass, use a one-shot reviewer (the codex CLI or `/code-review`) and triage manually
- Trivial single-line edits where a direct Edit is faster than a review loop

## Phase 0: Source Designation + Scope Detection

**Source designation.** If a `source` argument is given, use it directly — this is relay (Extension): the user already decided. If `source` is absent, **ask** — an init Constitution gate with no preselected default: present the available sources as a choice (`codex` for a single independent external model when the codex CLI is present; `code-review` for a Claude-native built-in review, always available), each with its coverage/cost trade-off, and let the user constitute the selection. Unless a `source` is named at invocation, the loop does not pick one on the user's behalf — source selection determines the cost and coverage of every round, so it waits for the answer.

**Scope detection**:

1. PR number given as `scope`: scope = `gh pr diff {N}`
2. No PR argument: `gh pr view --json number,title,headRefName,changedFiles 2>/dev/null` to detect a current-branch PR; if found, scope = its diff
3. No PR: scope = working tree (`git diff HEAD`)
4. No changes anywhere: ask the user what to review (stop here)

Capture the **resolved base SHA** (the merge-base or PR base commit the diff is taken against) and the changed-files list — this base SHA + file list is the **pointer** the codex prompt passes; codex re-derives the diff locally with its own git (read-only sandbox, no network), so the full diff content is not inlined. Also capture diff stats for context.

**Design-intent harvest.** A review source reads the diff with fresh context: it does not know *why* a choice was made, so it spends high-severity findings refuting intent the project already documented. Alongside the diff pointer, resolve the **design intent already captured for the changed surface** and pass it to the source as context, so the source pre-filters findings that an intentional, documented choice already explains — shifting that refutation upstream into the review request instead of leaving Phase 2 to re-derive it every round. Harvest from these sources, in priority order, **bounded to what touches the changed files** (never the whole rules directory):

1. **Project rules** — the `.claude/rules/*.md` files (and design-rationale sections of the root or changed-directory project guide, `CLAUDE.md` or `AGENTS.md`) whose scope intersects the changed surface: matched by path/filename correspondence to the changed files or directories, or by the rule's content referencing the changed components.
2. **In-code design comments** adjacent to the changed hunks — the "why this is intentional" comments at the call sites being modified.
3. *(Optional, secondary)* prior fresh-context session captures (e.g. anamnesis memory) when cheaply available — do not build machinery for this.

Pass the bundle as **pointers, not copied content** — relevant rule-file and project-guide paths plus the locations of the adjacent design comments to weight — consistent with the diff pointer: every documented source can read the repo itself, so a reference it dereferences avoids transcription cost and staleness, and bounding to the changed surface keeps the injected context small. This harvest is relay (a deterministic resolution with cited basis), not a gate. Phase 2 verify remains the safety net for any intent-explained finding the source still surfaces.

**Free-exit affordance (declared once).** Announce here, before the first review round: *"You can end this loop at any time by saying so; on exit I will present the convergence trace so far and stop."* This is a free-response pathway, not a gate option — it does not reappear as a peer option at later gates.

## Phase 1: Review

Call the designated source over the current diff — together with the design-intent bundle — and obtain `{ findings[], verdict }`. Each finding carries the form `[severity] file:line — description`; `severity ∈ critical | high | medium | low | suggestion`; `verdict ∈ approve | needs-attention`. The per-source mechanics (how `codex` versus `code-review` produce this output) live in the Source Interface section below — Phase 1 only consumes the interface.

## Phase 2: Verify (against codebase + work-flow)

Before acting on any finding, verify it — a review model can hallucinate or flag a stale issue, and currency is not the same as fidelity. For each finding:

- Call `/inquire` to check the finding against the current codebase: does the asserted issue actually hold against the code as it stands? This is the support-integrity / currency check — an artifact being fresh does not establish that it tracks current behavior.
- Call `/contextualize` to check fit against the work-flow and surrounding context: is the flagged pattern intentional here, and is the proposed fix contextually appropriate for this codebase's conventions?

This phase is primarily relay — read-only codebase checks with cited basis. A finding that fails verification (the issue does not hold, or the fix is contextually wrong) is **dropped**, and the drop is surfaced with its cited basis rather than silently discarded or applied. Genuine Constitution uncertainties that `/inquire` raises (where the user's judgment is genuinely needed) fold forward into the Phase 3 disposition gate rather than firing as separate in-round chat gates — keeping the in-round gate count down to the Phase 3 cluster gates.

## Phase 3: Classify + Disposition Gate

Classify each surviving finding:

- **Mechanical** — typo, rename, mechanical symbol or format fix; deterministic, one correct edit, no design judgment. A finding is **also Mechanical** when (a) verification (Phase 2) confirmed it as a correctness bug — not a style or design preference — and (b) a minimal localized fix is self-evident: the plausible resolution shapes do not produce materially different downstream trajectories. → **Extension**: auto-apply, no gate, with the applied fix noted on its Relay trace entry; the Phase 4 risk screen still gates orthogonally. Mechanical findings keep the loop running — only Constitution warrants interruption.
- **Judgment** — multiple valid resolutions that materially diverge, a design tradeoff, or a change with irreversible divergence. → **Constitution**: the user's judgment constitutes the resolution.

**Collapse test at classification time.** The gate-authoring criterion — each option must produce a materially different downstream trajectory; dispositions converging to the same trajectory collapse to one — applies at classification, not only when authoring gate options. If every plausible disposition of a finding collapses to "apply the obvious minimal fix", the finding is Extension, not Judgment: that a fix *could* be shaped more than one way does not make it Judgment when the shapes do not materially diverge for the user. Classifying such a finding Judgment interrupts the loop for a decision the user would always answer "apply" — an over-gating failure mode.

**Settled-policy check (before opening any disposition gate).** A finding whose disposition policy was already constituted in a prior round is **Extension by default**: a consistent application of that settled policy auto-resolves per the prior disposition (apply / dismiss / defer), and any non-trivial side-effect (for example, an edit that touches a line outside the original diff hunk) is surfaced as a **relay annotation on its Relay trace entry**, not as a gate. The Extension/Constitution boundary for a finding moves with what is already decided — a prior round's direction and the PR's stated purpose can close an axis that would otherwise be live. A gate reopens only when a genuinely competing **Judgment-level** disposition (defer / separate follow-up / dismiss) is still live — one not already foreclosed by the PR's purpose or an established precedent. For a **Mechanical** finding — a verified correctness bug whose minimal localized fix is self-evident — the fold-now-vs-defer / which-PR scope axis does not reopen a gate: which PR the identical fix lands in is an administrative packaging variant (the fix is the same; only the PR boundary differs), folded in by the convergence goal. A genuine **scope expansion** — fixing a pre-existing defect because it happens to sit in the changed surface — is a separate axis: it folds in as a relay annotation on its Relay trace entry only when a citable basis licenses it (a mandated closure sweep, the PR's stated purpose, or a settled precedent); absent such a basis, expanding scope to a pre-existing defect is itself a judgment the user constitutes, so it surfaces for the user rather than auto-folding. Re-gating the consistent propagation of settled policy is the over-gating failure mode.

For Judgment findings whose axis remains live, **cluster by shared disposition** — group findings that share the same resolution stance (apply / dismiss / defer) and present ONE scope-gate per cluster rather than one gate per finding. Follow context-question separation: present all analysis, evidence, and per-finding rationale as text BEFORE the gate; the gate itself carries only the question and the options with their differential implications. Each option must produce a materially different downstream trajectory — if two dispositions converge to the same trajectory, collapse them. Use plain everyday language in the user-facing emit.

## Phase 4: Apply

For every fix that is going to land — Mechanical (auto-approved) or Judgment (user-approved at the Phase 3 gate) — screen the edit for risk before applying it. A "Mechanical" edit can still be risky: it may touch an irreversibility, a security boundary, or an external / human-visible effect that the Mechanical/Judgment axis does not capture. The risk screen is orthogonal to the resolution class and gates the apply on risk grounds.

The screening venue splits by substrate. When applying the edit is itself a substrate action — a destructive operation, external communication, or production mutation — route it to the harness permission layer: surface what is about to run and let the harness gate the execution; the loop does not absorb that substrate decision. When the risk is an epistemic judgment call, surface it as a direct Constitution decision in the loop — the user chooses to accept-the-risk-and-apply, defer, or drop — and the finding is carried forward until that decision lands. Carrying forward does not hold the finding as live in-loop state: the next round's full re-review re-detects it fresh, and only a deferral reason that is not re-derivable from the diff is externalized to the durable record — so recurrence surfaces as a fresh recognition gate, not a recalled carry.

Apply the approved, risk-cleared edits.

**Completeness sweep on apply.** When an applied fix instantiates a predicate or pattern that plausibly recurs across multiple sites in the artifact — a vocabulary rename, a guard that must hold at every mention of a symbol, a stale predicate repeated in several blocks — scan the artifact for all sites of that predicate and apply the fix consistently in the **same apply pass**, rather than waiting for later rounds to re-surface them piecemeal. **Over-reach guard**: verify each candidate site actually instantiates the same predicate (a semantic match, not a superficial string match) before applying, and risk-screen each swept site the same way — a swept edit is still an apply that lands, so Rule 6's risk screen applies per site, not only to the originally-flagged edit; sites swept beyond the originally-flagged one ride as relay annotations on the trace entry. The Phase 5 full re-review still catches any miss, so the sweep is an efficiency move, not a correctness dependency.

## Phase 5: Re-review + Convergence

Re-call the source on the updated diff — a **FULL re-review each round**, not an incremental check against the prior round's findings. Convergence is reached when:

- the source verdict converges to `approve`, OR
- the re-review surfaces zero new non-refuted findings, OR
- the user exits (free-response).

Carried-forward findings — deferred at a prior disposition gate or risk screen and still open — are not silently swallowed by a "zero new findings" convergence: a deferral carries forward as its recorded reason (the finding itself is re-detected fresh by each round's full re-review, not held as live state), and at convergence any still-open deferral is surfaced as annotated residual for the user (a dismiss-with-residual exit), never closed implicitly.

Phase 5's re-review **is** round k+1's review — one source call per round, not a separate verdict-check followed by a fresh Phase 1 call. If the verdict is still `needs-attention`, the findings this re-review just produced become round k+1's input: increment the round counter and carry them into Phase 2 (verify) directly — do not re-call the source again at the next round's Phase 1. The re-review is full because a fix can introduce a regression a narrow incremental check would miss; only a full pass over the updated diff justifies declaring convergence. It also re-harvests the design-intent bundle for the current changed surface — Phase 4 may have grown the surface beyond the Phase 0 harvest — so the source judges the new surface with matching intent rather than a bundle that predates the apply.

## Source Interface

Every source satisfies one abstraction: `(diff, design-intent) → { findings[], verdict }`. A finding is `[severity] file:line — description`; the verdict is `approve | needs-attention`. The `design-intent` input is the harvested bundle for the current changed surface (pointers to the changed-surface rules, project-guide design-rationale, and adjacent design comments) — first resolved in the Phase 0 harvest and re-harvested before each full re-review (Phase 5) so a grown surface gets matching intent; each source's adapter is responsible for conveying it to its model so intent-explained findings are pre-filtered upstream — the input is source-agnostic, the conveyance is per-adapter. A source whose native output is richer than this shape (e.g. a sectioned report) satisfies the interface through an **extraction step** in its adapter — the adapter maps the native output onto `{ findings[], verdict }`. The set of sources is open and extensible (Emergent) — new sources may be added as long as their adapter accepts the design-intent input and yields this interface.

Review sources are **runtime-selected, not static frontmatter dependencies**: the frontmatter `skills:` list declares only the unconditionally-composed protocols (`/inquire`, `/contextualize`); sources are pluggable and called dynamically (`codex` via a background CLI call; `code-review` via a `Skill` call to the built-in), so they are intentionally not fixed `skills:` entries. Two sources are documented:

| Source | Kind | Mechanics |
|--------|------|-----------|
| `codex` | single model, background | Launch in background and collect on the completion notification (see below). |
| `code-review` | single, Claude-native (built-in) | Call via `Skill("code-review", ...)` passing the detected scope **and the design-intent bundle**; it runs its own multi-angle finder fan-out and returns a findings JSON array (`{ file, line, summary, failure_scenario }`, ranked most-severe-first, capped at 15) with **no verdict line** — the adapter derives the verdict (`[]` → approve, otherwise needs-attention) and maps each finding to `[severity] file:line — description` (severity from rank order). Claude-native and reading the same repo, it can resolve `CLAUDE.md` and code comments itself; the bundle still directs it to the changed-surface `.claude/rules/*.md` it would not otherwise weight. No external CLI, so it is available whenever the loop runs. |

**`codex` source mechanics**:

1. Write a review prompt to `/tmp/review_loop_codex_${SUFFIX}.txt` (generate `SUFFIX=$(openssl rand -hex 4)`), passing a **pointer** to the diff rather than inlining it, so codex fetches the live diff with its own git. Include a Pointers section:
   ```
   ## Pointers — read the diff yourself with your own tools
   - Diff command: `git diff {base_sha}...HEAD`  (PR scope; for a working-tree scope use `git diff HEAD`)
   - Changed files: {file_list}
   Run the diff command in this repo to see exactly what changed — the diff is not inlined.
   ```
   Also include a **Design-intent** section carrying the design-intent bundle as pointers (codex reads these files itself via `--cd`, read-only sandbox), so codex reads the documented intent before judging and does not spend findings refuting intentional, documented choices:
   ```
   ## Design intent — read these before flagging; do not spend findings merely refuting a documented choice the intent already explains
   - Project rules (read in full): {relevant_rule_paths}
   - Project-guide rationale (read in full): {project_guide_paths}  (design-rationale sections of CLAUDE.md or AGENTS.md)
   - Design comments to weight: {design_comment_locations}  (the "why this is intentional" comments adjacent to the changed hunks)
   A finding whose only objection is that a choice looks wrong, when the documented intent above accounts for it, is intentional design — drop it or note the intent and downgrade rather than flagging high-severity. But intent excuses the design rationale, not a defect the design actually causes: if a documented choice still produces a real bug, regression, or security hole the intent does not prevent, flag it.
   ```
   Ask for findings as `[severity] file:line — description` and a closing line `VERDICT: approve | needs-attention`.
2. Launch via `Bash(run_in_background: true, timeout: 300000)`. `--color never` + splitting the streams (stdout to the events file, `2>` to a separate warn file) keeps the events file pure JSONL — the codex banner and any stderr warnings ride their own warn file. `--cd {repo_root}` points codex's own git/Read at the repo so it re-derives the diff against the orchestrator-supplied base SHA; `--sandbox read-only` is kept because `git diff` is a local read needing no network. If codex's git cannot resolve that base SHA the extraction comes back empty — the step-3 "empty extraction = codex failed" guard surfaces it:
   ```bash
   codex exec --ephemeral --json --color never --skip-git-repo-check --cd {repo_root} -m gpt-5.5 --config model_reasoning_effort="high" --sandbox read-only < /tmp/review_loop_codex_${SUFFIX}.txt > /tmp/review_loop_codex_events_${SUFFIX}.jsonl 2>/tmp/review_loop_codex_warn_${SUFFIX}.txt
   ```
3. Collect on the completion notification — do not poll or sleep. The events file is pure JSONL; extract the **final** codex `agent_message` narrative verbatim with the line below — high-reasoning codex streams progress messages first, so the line takes the last `agent_message` — then **forward it verbatim to the loop — do NOT regex-parse it into findings/verdict**: the consuming agent (an LLM) reads the `[severity] file:line — description` findings and the closing `VERDICT:` line directly from the narrative. **If the extraction comes back empty, codex failed before answering** (auth / timeout / crash) — read the raw events file `/tmp/review_loop_codex_events_${SUFFIX}.jsonl` for the `turn.failed` / `error` events and surface that as needs-attention; never converge on a blank.

   ```bash
   jq -rs '[.[] | select(.type=="item.completed" and .item.type=="agent_message") | .item.text] | last // empty' /tmp/review_loop_codex_events_${SUFFIX}.jsonl
   ```

   Some codex warnings ride the **stderr banner**, not `agent_message` — the launch sent stderr to its own warn file. Grep that to catch what the narrative does not carry, and surface any hits alongside the findings:

   ```bash
   grep -iE 'invalid_grant|deprecat|--full-auto|warn' /tmp/review_loop_codex_warn_${SUFFIX}.txt || true
   ```
4. Clean up all three temp files each round (`rm -f /tmp/review_loop_codex_${SUFFIX}.txt /tmp/review_loop_codex_events_${SUFFIX}.jsonl /tmp/review_loop_codex_warn_${SUFFIX}.txt`) to prevent `/tmp` accumulation across rounds.

## Convergence

Convergence is `verdict=approve`, OR zero new (non-refuted) findings on a full re-review, OR a user free-response exit. Convergence is demonstrated, not asserted: at each round, present a relay trace showing the round's transformation:

```
Round {k} — source: {source} — verdict: {verdict}
  Relay:   {findings the loop dispositioned autonomously — Extension}
             each entry: finding → [applied | dropped: basis | carried: reason]   (a side-effect rides inline as [side-effect: …] on an applied entry)
  Gated:   {findings that needed your judgment — Constitution, from a Judgment disposition or an orthogonal risk screen}
             each entry: finding → [applied | dropped: basis | carried: reason]
```

The slot is keyed by the loop's **interruption axis** — whether the loop acted autonomously (**Relay**, Extension) or needed your judgment (**Gated**, Constitution) — and the outcome of each finding (applied / dropped / carried) plus its cited basis rides inline as an annotation on the entry. Because the partition's first axis is interruption rather than outcome, every finding has exactly one home, and the per-round disposition reads off the slot directly.

The interruption axis — not the resolution class — places each entry. A Mechanical edit blocked on a risk screen sits under **Gated** because it needed your judgment, even though its resolution class is Extension; its Mechanical origin can ride as an inline note, and its outcome follows your decision — accept → `[applied]`, defer → `[carried: reason]`, drop → `[dropped: risk basis]`. A settled-policy auto-resolution sits under **Relay**, annotated by the prior disposition it applies — apply → `[applied]`, dismiss → `[dropped: prior-disposition basis]`, defer → `[carried: reason]`. Verify-stage drops are Relay `[dropped: verify basis]`; gated dismissals and risk-screen drops are Gated `[dropped: basis]`. An edit routed to the harness permission layer rides as a relay annotation on its entry — the harness's grant or denial is the substrate's record, not a loop gate. A `[carried: reason]` records the deferral reason, not a live-held finding: each round's full re-review re-detects the finding, so recurrence surfaces as a fresh recognition gate.

The per-round trace is a relay presentation — present it and proceed; it is not a gate. At convergence, the accumulated traces are the evidence that each finding reached a disposition — applied, dropped or dismissed, or explicitly surfaced as annotated residual.

## Error Handling

| Condition | Action |
|-----------|--------|
| Designated source not installed (codex CLI not found) | Surface which source is unavailable so the user recognizes it is not installed, and **ask** which available source to use instead — or whether to stop and install it; do not silently substitute. `code-review` is Claude-native and always available, so an alternative can always be offered |
| No diff / no changes | Report and stop at Phase 0 (nothing to review) |
| Source timeout (>300s) | Present partial findings collected so far, note the timeout, let the user decide whether to continue |
| Source approves with no findings | Report converged immediately — verdict=approve at round 1, no edits needed |

## Rules

1. **Extension findings keep the loop running** — Mechanical fixes auto-apply; only Constitution warrants interruption — a Judgment-class disposition or an orthogonal epistemic risk screen (so a Mechanical edit blocked on risk can interrupt too). A verified correctness bug whose minimal localized fix is self-evident — its plausible resolution shapes do not materially diverge — classifies Mechanical, not Judgment: the trajectory-collapse test applies at classification time, before any gate is authored, and the applied fix is noted on the Relay trace entry. A finding whose disposition policy was constituted in a prior round is Extension by default: its consistent application auto-resolves per the prior disposition (apply / dismiss / defer) and any side-effect rides as a relay annotation on its trace entry. A gate reopens only for a genuinely competing live **Judgment** disposition, not one foreclosed by the PR's purpose or a prior precedent; for a Mechanical finding the fold-now-vs-defer / which-PR scope axis does not reopen a gate — which PR the identical fix lands in is an administrative packaging variant, folded in by the convergence goal. A genuine scope expansion (fixing a pre-existing defect because it sits in the changed surface) folds in as a relay annotation only when a citable basis licenses it — a mandated closure sweep, the PR's purpose, or a settled precedent — and otherwise surfaces for the user as a scope-expansion judgment. Re-gating settled policy is the over-gating failure mode.
2. **Context-question separation at every gate** — all analysis and evidence as pre-gate text; the gate carries only the question and options with differential implications.
3. **Plain everyday language** in all user-facing emit — no internal protocol jargon at the gates.
4. **FULL re-review each round** — re-call the source over the updated diff; do not trust an incremental delta check to declare convergence.
5. **Verify before apply** — a finding that fails support-integrity or context-fit is dropped with its cited basis; only support-integrity-passing findings proceed to apply.
6. **Risk screening gates risky applies regardless of class** — a Mechanical edit is still risk-screened before it lands; risk is orthogonal to the Mechanical/Judgment axis. The venue splits by substrate: destructive operations, external communication, and production mutation route to the harness permission layer; epistemic risk judgments surface as direct Constitution decisions in the loop.
7. **Pass design intent upstream** — alongside the diff pointer, harvest the design intent already captured for the changed surface (the relevant `.claude/rules/*.md` + design-rationale sections of the project guide (`CLAUDE.md` or `AGENTS.md`), plus the design comments adjacent to the changed hunks) and pass it to the source as context, bounded to the changed files, as pointers not copied content. The source then pre-filters findings that an intentional documented choice already explains, so that refutation happens upstream in the review request rather than being re-derived in Phase 2 each round; Phase 2 verify remains the safety net for any intent-explained finding the source still surfaces. Documented intent pre-filters only findings whose objection is the choice itself — it never licenses suppressing a real defect the documented choice actually causes, which the source still flags. Because Phase 4 can grow the changed surface (completeness sweep or licensed scope expansion), the bundle is re-harvested for the current changed surface before each full re-review rather than frozen at the Phase 0 harvest.

## Deferred (v1.x stretch)

Out of v1 scope, recorded so the source interface stays forward-compatible:

- **Live-teammate driving** — driving an already-active teammate via SendMessage rather than spawning a fresh source per round. No codebase precedent yet; spawn-and-wait (background launch + collect on notification) is the current pattern.
- **`/frame` as a direct single source** — using `/frame` standalone as a source behind the same interface.
- **Cross-model composite via `/conduct`** — a user-assembled arrangement (frame-supplied lenses + codex, arranged by `/conduct`) as a source behind the same interface.
- **`/sublate` + `/gap` in the verify step** — adding `/sublate` (evidence-currency stress test) and `/gap` (decision-quality audit) alongside `/inquire` and `/contextualize` in Phase 2.

## Composition Lineage

Sibling of `comment-review`: both are review-resolve loops, but `/review-loop` targets code/PR diffs where `/comment-review` targets markdown artifacts before fixation. Termination differs — `/review-loop` is convergence-paced (it ends when the source verdict reaches approve), where `/comment-review` is user-paced (rounds end when the user answers the branch gate). The judgment venue differs too — `/review-loop` gates Judgment findings through a disposition-cluster chat scope-gate, where `/comment-review` surfaces findings through a browser sidepanel.

`/review-loop` drives pluggable review sources (`codex` directly, or the built-in `code-review`). It composes `/inquire` (codebase verification) and `/contextualize` (work-flow fit), and screens applies for risk directly — substrate risk routes to the harness permission layer, epistemic risk to an in-loop Constitution decision.
