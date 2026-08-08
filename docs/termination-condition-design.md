# Work-Termination Condition — Inscribe vs New Protocol (issue #526)

> Design decision for #526 (follows #422 / #523): when an arbitrary context + user
> utterance carries **no work-termination condition**, how should the suite detect / define
> / disclose that absence? Two paths, decide before implementing: **Option A** — inscribe
> across `/bound` (define) + `/attend` (detect / gate) + `/conduct` (disclose); **Option B**
> — a new `TerminationUndefined → DefinedTermination` protocol.

## The deficit — the other half of #422 / #523

No protocol's output type carries a work-level stop criterion. `/distill`'s
`HandoffContract.stop_condition` is an **input** the author declares; `/conduct`'s
termination axis sets *move-repetition*, not work completion. #422 / #523 filled the
"compile an *existing* termination signal" half (the `/attend` compile-time redefinition);
#526 is the "**detect / define when the signal is absent**" other half. As models take on
longer autonomous work, a task whose stop criterion was never extracted runs to an unbounded
interval — structurally exposed to runaway loops (aligned with the Fable 5 prompting guide's
"state the boundaries" and "end your turn only when the task is complete or you are blocked
on input only the user can provide").

## The three gaps (verified at HEAD — #523 & #525 both MERGED)

Premise-checked against current `main`; both dependency PRs landed 2026-06-11, so Option A is
**fully unblocked**:

1. **`/attend` — gate-less proceed on no-signal.** `Bₛ = ∅ → no_compile → deactivate` is an
   `(extension)` (attend SKILL.md L82): if no termination signal is inferred, `/attend` emits
   a notice and execution proceeds **unguarded**. Absence is only passively visible — the
   user must notice the missing kind in the compile list.
2. **`/bound` — no termination domain in Trigger Signals.** `/bound` elicits boundaries but
   carries no heuristic asking the *completion / budget / stop-criterion* domain. BoundaryMap
   feeds 6 downstream protocols incl. `/attend` ("multi-consumer architectural
   independence"), so if `/bound` never asks the termination domain, `/attend` has **no
   material to compile** — garbage-in. (The "termination" tokens in bound's spec are its own
   loop's `Implicit` / `ExplicitTermination`, not the work's stop domain — confirmed by
   grep.)
3. **`/conduct` — `until_goal_met` with no predicate requirement.** `Gen(termination) =
   until_goal_met → no cap` (the coverage-limit functor), and no rule requires a *verifiable
   goal predicate* when `until_goal_met` is selected — an unbounded topology passes at the
   orchestration layer.

## The fork and the decisive argument

**Option A** distributes the fix onto each protocol's existing deficit axis (root = `/bound`
definition); **Option B** creates a single-responsibility `(TerminationUndefined, AI, ?,
Task) → DefinedTermination` protocol emitting a first-class `TerminationContract`.

The decisive asymmetry: **B does not eliminate gaps ② and ③.** Even with a new protocol,
`/attend` still needs its no-signal gate and `/conduct` still needs its `until_goal_met`
disclosure — a new node cannot reach inside those protocols' phases. So B = *A's inscribe
work* (at least ②③) **plus** a ~400-line SKILL.md + graph.json node / edges + README sync. B
adds suite surface without removing A's work.

A also wins on the issue's stated judgment criteria:

- **Northstar** ("resolve the deficit at its root, in bounded loops"): the root of a missing
  stop criterion is the **definition** layer — `/bound` — which A targets directly.
- **Epistemic Completeness Boundary**: both paths keep enforcement in the substrate
  (`/goal` / harness); only detection / definition / disclosure is EP — A places each exactly
  where its protocol already operates.
- **#482 GateLoadBudget**: both add a *conditional* +1 gate; A's sits on `/attend`'s existing
  gate (no new chain).
- **Maintenance surface**: A's cost is 3-site sync; B's is a permanent new node. Given the
  suite's surface-management concern and Fable 5's anti-over-inscription direction, the
  distributed-sync cost is the smaller standing burden — and A's three sites are each a
  *minimal on-axis* change (a Trigger row, a conditional gate escalation, a GapSlot reuse),
  not three new subsystems.

## Recommendation — Option A (inscribe across the three)

Inscribe the termination concern on each protocol's existing deficit axis. B's
single-address appeal is real — a formal home for "work termination," one routing target,
one resolution point — but it does not pay for itself: it leaves ②③ to inscribe anyway and
adds a node the suite must carry indefinitely. A resolves the deficit at its root with three
small on-axis diffs, all now unblocked (#523 / #525 merged).

## Open fork for the human

1. **Path**: (A) inscribe across `/bound` + `/attend` + `/conduct` (recommended) / (B) new
   `TerminationUndefined` protocol.
2. **If A — sequencing**: `/bound` (independent, start now) → `/attend` (now unblocked, #523
   merged) → `/conduct` (GapSlot reuse). Separate issues or staged commits.

## Spec-edit sketch (Option A)

Per the issue's Option A table, developed:

1. **`/bound`** (`horismos/.../bound/SKILL.md`, Mode Activation → Trigger Signals): +1 row —
   *"loop / retry / until semantics present + no explicit stop criterion (count / threshold /
   timeout / completion predicate) → termination-boundary domain undefined."* Zero new gate
   (silent heuristic); the `Domain` taxonomy is already open (Rule 5) → no type change.
   **Independent, start now.**
2. **`/attend`** (`prosoche/.../attend/SKILL.md`, PHASE TRANSITIONS + TOOL GROUNDING +
   Rules): when 0 termination-family predicates (CompletionThreshold / Budget) compile, the
   Phase 2 gate **actively** surfaces the absence + options (define now / route to `/bound`
   then recompile / approve explicit-unbounded); escalate `no_compile` from `(extension)` →
   Constitution **for loop / long-running work only**. +1 conditional gate. **Unblocked (#523
   merged).**
3. **`/conduct`** (`hyphegesis/.../conduct/SKILL.md`, Rules + Phase 3 CompileCheckpointBrief):
   a region resolving `termination = until_goal_met` gets a mandatory `termination_predicate`
   **GapSlot** — surfaced in the checkpoint brief, verification delegated to substrate. Zero
   new gate (reuses existing GapSlot machinery; no conflict with #525 — termination axis
   untouched).
4. Each step: spec edit + **semantic-closure sweep** (the new condition needs a type, guard,
   state update, termination path, result) + `plugin.json` patch bump + `node
   .claude/skills/verify/scripts/static-checks.js .` FAIL 0.

## Out of scope (both paths)

Fast-risk pre-action interception (#422 coord 9), `/goal` interval-internal enforcement, and
a general progressive / HITL gating layer — all substrate, per the Epistemic Completeness
Boundary. The session's earlier "Phase -1 Sub-A0 DeficitCondition enum extension" idea is
discarded (#523 removed that machinery).
