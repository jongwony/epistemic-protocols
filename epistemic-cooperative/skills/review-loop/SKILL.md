---
name: review-loop
description: "Convergence-paced code/PR review-resolve loop via /review-loop. Drives a pluggable review source (review-ensemble | codex | code-review), verifies each finding against the codebase (/inquire) and work-flow (/contextualize), auto-applies Mechanical fixes (Extension) and gates Judgment fixes by shared disposition (Constitution), applies via /attend risk classification, then re-reviews until the source verdict converges to approve. User-invoked via /review-loop."
skills:
  - aitesis:inquire
  - epharmoge:contextualize
  - prosoche:attend
---

# Review Loop

A source-agnostic, convergence-paced review-resolve loop for code/PR diffs: it drives a pluggable review source to convergence (verdict=approve), auto-applying mechanical fixes and gating the judgment calls.

## Caller Signature

```
/review-loop [source?] [scope?]

source : { review-ensemble | codex | code-review }   -- optional; review source behind the (diff) → { findings[], verdict } interface
                                                     --   absent → Phase 0 asks which source to use (no default)
scope  : PR number | (implicit)                      -- optional; PR number, or implicit current-PR / working-tree detection
```

The review source is pluggable: any source satisfying the `(diff) → { findings[], verdict }` interface can drive the loop. `review-ensemble`, `codex`, and `code-review` are the three sources documented in the Source Interface section; all are runtime-selected, not fixed at definition time. When `source` is omitted, Phase 0 asks which source to use (no preselected default). When `scope` is omitted, Phase 0 detects it (current-branch PR or working tree).

## Pipeline Overview

```
/review-loop [source?] [scope?]
  Phase 0  : source designation (arg → relay | absent → ask) + scope detect (PR diff | working tree)
  Phase 1  : review    — source(diff) → { findings[], verdict }
  Phase 2  : verify     — per finding: /inquire (vs codebase) + /contextualize (vs work-flow);
                          drop findings failing support-integrity / context-fit (cite basis)
  Phase 3  : classify  — Mechanical → Extension (auto)
                          Judgment   → cluster by shared disposition → Constitution scope-gate
  Phase 4  : apply      — /attend risk classification → apply approved edits
  Phase 5  : re-review  — source(diff') → verdict'
               verdict'=approve (or 0 new) → converge ; else round k+1: these findings → Phase 2 (re-review already done; no second source call)
  free-exit : user may end the loop at any time (declared once in Phase 0)
```

The loop is the skill's identity; the review source is a parameter behind it. Loop control (verify → classify → apply → re-review) is fixed; the source that produces `{ findings[], verdict }` is swappable.

## When to Use

- Driving code/PR review findings all the way to resolution and convergence (verdict=approve)
- A review pass surfaced findings and you want them verified, dispositioned, applied, and re-checked in one controlled loop
- Multiple review rounds are expected before the diff is clean

## When NOT to Use

- Reviewing a markdown artifact before fixation — that is `/comment-review` (this skill targets code/PR diffs)
- Wanting a one-shot cross-model review with no apply phase — that is `/review-ensemble` alone (it surfaces findings and a verdict without applying fixes; `/review-loop` is the loop that drives those findings to approve)
- Trivial single-line edits where a direct Edit is faster than a review loop

## Phase 0: Source Designation + Scope Detection

**Source designation.** If a `source` argument is given, use it directly — this is relay (Extension): the user already decided. If `source` is absent, **ask** — an init Constitution gate with no preselected default: present the available sources as a choice (`review-ensemble` for cross-model coverage when the `prothesis:frame` skill is available; `codex` for a single independent external model when the codex CLI is present; `code-review` for a Claude-native built-in review, always available), each with its coverage/cost trade-off, and let the user constitute the selection. Unless a `source` is named at invocation, the loop does not pick one on the user's behalf — source selection determines the cost and coverage of every round, so it waits for the answer.

**Scope detection** (mirrors review-ensemble Phase 1):

1. PR number given as `scope`: scope = `gh pr diff {N}`
2. No PR argument: `gh pr view --json number,title,headRefName,changedFiles 2>/dev/null` to detect a current-branch PR; if found, scope = its diff
3. No PR: scope = working tree (`git diff HEAD`)
4. No changes anywhere: ask the user what to review (stop here)

Capture the full diff content (needed for the codex prompt) and diff stats for context.

**Free-exit affordance (declared once).** Announce here, before the first review round: *"You can end this loop at any time by saying so; on exit I will present the convergence trace so far and stop."* This is a free-response pathway, not a gate option — it does not reappear as a peer option at later gates.

## Phase 1: Review

Call the designated source over the current diff and obtain `{ findings[], verdict }`. Each finding carries the form `[severity] file:line — description`; `severity ∈ critical | high | medium | low | suggestion`; `verdict ∈ approve | needs-attention`. The per-source mechanics (how `review-ensemble` versus `codex` produce this output) live in the Source Interface section below — Phase 1 only consumes the interface.

## Phase 2: Verify (against codebase + work-flow)

Before acting on any finding, verify it — a review model can hallucinate or flag a stale issue, and currency is not the same as fidelity. For each finding:

- Call `/inquire` to check the finding against the current codebase: does the asserted issue actually hold against the code as it stands? This is the support-integrity / currency check — an artifact being fresh does not establish that it tracks current behavior.
- Call `/contextualize` to check fit against the work-flow and surrounding context: is the flagged pattern intentional here, and is the proposed fix contextually appropriate for this codebase's conventions?

This phase is primarily relay — read-only codebase checks with cited basis. A finding that fails verification (the issue does not hold, or the fix is contextually wrong) is **dropped**, and the drop is surfaced with its cited basis rather than silently discarded or applied. Genuine Constitution uncertainties that `/inquire` raises (where the user's judgment is genuinely needed) fold forward into the Phase 3 disposition gate rather than firing as separate in-round chat gates — keeping the in-round gate count down to the Phase 3 cluster gates.

## Phase 3: Classify + Disposition Gate

Classify each surviving finding:

- **Mechanical** — typo, rename, mechanical symbol or format fix; deterministic, one correct edit, no design judgment. → **Extension**: auto-apply, no gate. Mechanical findings keep the loop running — only Constitution warrants interruption.
- **Judgment** — multiple valid resolutions, a design tradeoff, or a change with irreversible divergence. → **Constitution**: the user's judgment constitutes the resolution.

For Judgment findings, **cluster by shared disposition** — group findings that share the same resolution stance (apply / dismiss / defer) and present ONE scope-gate per cluster rather than one gate per finding. Follow context-question separation: present all analysis, evidence, and per-finding rationale as text BEFORE the gate; the gate itself carries only the question and the options with their differential implications. Each option must produce a materially different downstream trajectory — if two dispositions converge to the same trajectory, collapse them. Use plain everyday language in the user-facing emit.

## Phase 4: Apply

For every fix that is going to land — Mechanical (auto-approved) or Judgment (user-approved at the Phase 3 gate) — call `/attend` to risk-classify the edit before applying it. A "Mechanical" edit can still be risky: it may touch an irreversibility, a security boundary, or an external / human-visible effect that the Mechanical/Judgment axis does not capture. `/attend`'s risk classification is orthogonal to the resolution class and gates the apply on risk grounds.

Apply the approved, risk-cleared edits. When `/attend` does **not** clear an edit (it surfaces an irreversibility, a security boundary, or a high-stake effect), the edit is not applied silently: surface the risk as a Constitution decision — the user chooses to accept-the-risk-and-apply, defer, or drop — and the finding is carried forward (re-entering the next round's disposition) until that decision lands. Where gate passage requires harness permission or high-stake execution, route that to the harness — surface it for approval, do not absorb the substrate decision into the loop.

## Phase 5: Re-review + Convergence

Re-call the source on the updated diff — a **FULL re-review each round**, not an incremental check against the prior round's findings. Convergence is reached when:

- the source verdict converges to `approve`, OR
- the re-review surfaces zero new non-refuted findings, OR
- the user exits (free-response).

Carried-forward findings — deferred at a prior disposition gate and still open — are not silently swallowed by a "zero new findings" convergence: at convergence, any still-open carried-forward findings are surfaced as annotated residual for the user (a dismiss-with-residual exit), never closed implicitly.

Phase 5's re-review **is** round k+1's review — one source call per round, not a separate verdict-check followed by a fresh Phase 1 call. If the verdict is still `needs-attention`, the findings this re-review just produced become round k+1's input: increment the round counter and carry them into Phase 2 (verify) directly — do not re-call the source again at the next round's Phase 1. The re-review is full because a fix can introduce a regression a narrow incremental check would miss; only a full pass over the updated diff justifies declaring convergence.

## Source Interface

Every source satisfies one abstraction: `(diff) → { findings[], verdict }`. A finding is `[severity] file:line — description`; the verdict is `approve | needs-attention`. A source whose native output is richer than this shape (e.g. a sectioned report) satisfies the interface through an **extraction step** in its adapter — the adapter maps the native output onto `{ findings[], verdict }`. The set of sources is open and extensible (Emergent) — new sources may be added as long as their adapter yields this interface.

Review sources are **runtime-selected, not static frontmatter dependencies**: the frontmatter `skills:` list declares only the unconditionally-composed protocols (`/inquire`, `/contextualize`, `/attend`); sources are pluggable and called dynamically (`review-ensemble` via a `Skill` call when chosen; `codex` via a background CLI call; `code-review` via a `Skill` call to the built-in), so they are intentionally not fixed `skills:` entries. Three sources are documented:

| Source | Kind | Mechanics |
|--------|------|-----------|
| `review-ensemble` | composite (cross-model: codex + /frame) | Call via `Skill("review-ensemble", ...)` passing the detected scope. Its Phase 5 output is a **sectioned report**, not a flat array — the adapter extracts the interface from it: the Codex section is already `[severity] file:line — description`; /frame's Lens findings are extracted from its Convergence/Assessment prose; the unified verdict is read directly. |
| `codex` | single model, background | Launch in background and collect on the completion notification (see below). |
| `code-review` | single, Claude-native (built-in) | Call via `Skill("code-review", ...)` passing the detected scope; it runs its own multi-angle finder fan-out and returns a findings JSON array (`{ file, line, summary, failure_scenario }`, ranked most-severe-first, capped at 15) with **no verdict line** — the adapter derives the verdict (`[]` → approve, otherwise needs-attention) and maps each finding to `[severity] file:line — description` (severity from rank order). Claude-native, no external CLI, so it is available whenever the loop runs. |

**`codex` source mechanics** (reuse review-ensemble's exact pattern):

1. Write a review prompt to `/tmp/review_loop_codex_${SUFFIX}.txt` (generate `SUFFIX=$(openssl rand -hex 4)`), embedding the actual diff content so the model reviews exactly what changed. Ask for findings as `[severity] file:line — description` and a closing line `VERDICT: approve | needs-attention`.
2. Launch via `Bash(run_in_background: true, timeout: 300000)`:
   ```bash
   EVENTS_JSONL=/tmp/review_loop_codex_events_${SUFFIX}.jsonl
   codex exec --ephemeral --json --skip-git-repo-check -m gpt-5.5 --config model_reasoning_effort="high" --sandbox read-only < /tmp/review_loop_codex_${SUFFIX}.txt > "$EVENTS_JSONL" 2>&1
   ```
3. Collect on the completion notification — do not poll or sleep. On completion the JSONL event stream is already in `$EVENTS_JSONL` (redirected at launch); with `--json` it is a **JSONL event stream possibly interleaved with a non-JSON stderr banner**, not free text. Extract the codex `agent_message` narrative verbatim with the line below. **Forward that narrative verbatim to the loop — do NOT regex-parse it into findings/verdict**: the consuming agent (an LLM) reads the `[severity] file:line — description` findings and the closing `VERDICT:` line directly from the narrative, satisfying the `{findings[], verdict}` interface by reading, not by jq parsing.

   ```bash
   # Codex --json event stream → agent_message narrative, verbatim. Extract per the JSONL
   # schema in use: item.completed events whose item.type is agent_message carry text at .item.text.
   # -R fromjson? skips non-JSON lines (the stderr banner interleaved into the captured stdout+stderr).
   # All agent_message items in stream order; no tail. The downstream agent reads the narrative and judges.
   # Restate the path: shell vars do NOT persist across separate Bash calls — re-derive from ${SUFFIX}.
   EVENTS_JSONL=/tmp/review_loop_codex_events_${SUFFIX}.jsonl
   NARRATIVE=$(jq -rR 'fromjson? | select(.type=="item.completed" and .item.type=="agent_message") | .item.text' "$EVENTS_JSONL")
   if [ -z "$NARRATIVE" ]; then
     # codex failed before emitting agent_message: surface the raw stream BEFORE cleanup, and FAIL the
     # block (exit 1) — an empty extraction is needs-attention, never a silent converge-on-blank.
     echo "Codex produced no agent_message — raw event stream follows:" >&2
     cat "$EVENTS_JSONL" >&2
     exit 1
   fi
   printf '%s\n' "$NARRATIVE"
   ```

   Reasoning items appear only if codex emits them (config-gated) — do not force them on. An empty extraction is a codex failure, not an approve verdict — the guard surfaces the raw events so a blank round cannot masquerade as convergence.
4. Clean up both temp files each round (`rm -f /tmp/review_loop_codex_${SUFFIX}.txt "$EVENTS_JSONL"`) to prevent `/tmp` accumulation across rounds.

## Convergence

Convergence is `verdict=approve`, OR zero new (non-refuted) findings on a full re-review, OR a user free-response exit. Convergence is demonstrated, not asserted: at each round, present a relay trace showing the round's transformation:

```
Round {k} — source: {source} — verdict: {verdict}
  Resolved (auto):   {Mechanical findings auto-applied}
  Resolved (gated):  {Judgment findings applied after the disposition gate}
  Dropped at verify: {findings dropped, each with its cited basis}
  Carried forward:   {findings deferred / still open}
```

The per-round trace is a relay presentation — present it and proceed; it is not a gate. At convergence, the accumulated traces are the evidence that each finding reached a disposition — applied, dropped at verify, or explicitly surfaced as annotated residual.

## Error Handling

| Condition | Action |
|-----------|--------|
| Designated source not installed (codex CLI not found, or `prothesis:frame` absent for `review-ensemble`) | Surface which source is unavailable so the user recognizes it is not installed, and **ask** which available source to use instead — or whether to stop and install it; do not silently substitute. `code-review` is Claude-native and always available, so an alternative can always be offered |
| No diff / no changes | Report and stop at Phase 0 (nothing to review) |
| Source timeout (>300s) | Present partial findings collected so far, note the timeout, let the user decide whether to continue |
| Source approves with no findings | Report converged immediately — verdict=approve at round 1, no edits needed |

## Rules

1. **Extension findings keep the loop running** — Mechanical fixes auto-apply; only Constitution (Judgment) findings warrant interruption.
2. **Context-question separation at every gate** — all analysis and evidence as pre-gate text; the gate carries only the question and options with differential implications.
3. **Plain everyday language** in all user-facing emit — no internal protocol jargon at the gates.
4. **FULL re-review each round** — re-call the source over the updated diff; do not trust an incremental delta check to declare convergence.
5. **Verify before apply** — a finding that fails support-integrity or context-fit is dropped with its cited basis; only support-integrity-passing findings proceed to apply.
6. **`/attend` gates risky applies regardless of class** — a Mechanical edit still passes through `/attend` risk classification before it lands; risk is orthogonal to the Mechanical/Judgment axis.

## Deferred (v1.x stretch)

Out of v1 scope, recorded so the source interface stays forward-compatible:

- **Live-teammate driving** — driving an already-active teammate via SendMessage rather than spawning a fresh source per round. No codebase precedent yet; spawn-and-wait (background launch + collect on notification) is the current pattern.
- **`/frame` as a direct single source** — using `/frame` standalone (not wrapped by `review-ensemble`) as a source behind the same interface.
- **`/sublate` + `/gap` in the verify step** — adding `/sublate` (evidence-currency stress test) and `/gap` (decision-quality audit) alongside `/inquire` and `/contextualize` in Phase 2.

## Composition Lineage

Sibling of `comment-review`: both are review-resolve loops, but `/review-loop` targets code/PR diffs where `/comment-review` targets markdown artifacts before fixation. Termination differs — `/review-loop` is convergence-paced (it ends when the source verdict reaches approve), where `/comment-review` is user-paced (rounds end when the user answers the branch gate). The judgment venue differs too — `/review-loop` gates Judgment findings through a disposition-cluster chat scope-gate, where `/comment-review` surfaces findings through a browser sidepanel.

`/review-loop` consumes `review-ensemble` as one of its review sources (the other being `codex` directly). It composes `/inquire` (codebase verification), `/contextualize` (work-flow fit), and `/attend` (apply-time risk classification).
