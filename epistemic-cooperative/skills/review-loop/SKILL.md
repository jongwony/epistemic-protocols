---
name: review-loop
description: "Convergence-paced review-resolve loop over a change and its governing surfaces. Verifies each finding against the codebase and the base it is measured from, then re-reviews until each is disposed of."
skills:
  - aitesis:inquire
  - epharmoge:contextualize
---

# Review Loop

Drive a code/PR change through independent review, verification, disposition, repair,
and full re-review. Each finding ends in a verified repair, a cited drop, a successor
handover, or declared residual. Measure the artifact against the project's own stated
goal and governing conventions, in its declared authority order.

## Caller Signature

```
/review-loop [source?] [scope?] [landing?]

source  : codex | code-review
scope   : PR number | implicit current-branch PR / working tree
landing : head | stacked       (PR scope only)
```

Read designations from the request's words as well as its arguments. `source` selects
the reviewer; the host is the environment driving the loop, not another user choice.
Read only that host's reference before determining availability:

| Host | `source=code-review` | `source=codex` | Reference |
|---|---|---|---|
| Claude Code | Fork the available Claude `/code-review` skill | Spawn `codex exec` | [Claude Code](references/host-claude-code.md) |
| Codex | Spawn `claude -p` with the available `/code-review` skill | Spawn a fresh `codex exec` | [Codex](references/host-codex.md) |

Other hosts may supply the same capabilities. Record the actual host, reviewer, and
execution route; a new process provides a separate review context, not evidence of
an independent model family. Sources remain runtime parameters rather than fixed
frontmatter dependencies.

## Source Interface

```
(diff pointer, design intent) → { findings[], verdict, exercised, direction? }
finding   : [critical | high | medium | low | suggestion] file:line — description
verdict   : approve | needs-attention
exercised : axes judged; axes not reached and what stopped each
direction : optional shared-cause hypothesis with its falsifier
```

Every source able to report reach owes `exercised`, including on approval. Ask
explicitly whether the whole changed artifact's contract closes: declared values
have producers, branches have supplied inputs, and obligations reach their consumers.
Distinguish source analysis from executed checks. Request `direction` after findings
on a non-approval; no single mechanism is a valid answer. A mechanism lacking a
falsifier does not fill this slot.

A native report may be normalized by its adapter. An explicit successful empty
findings result can mean approval; failed, skipped, missing, or unreadable review
output cannot. Determine output capabilities from the available implementation. A
source with no reach channel is declared once at entry and again at exit; a missing
report from a capable source is a round-specific gap. The loop supplies neither
reach nor a source direction by inference.

## Rules

### Phase 0 — Set the invocation and its ground

1. Use the source designated in this invocation. Otherwise present the invokable
   sources with their actual coverage, cost, and reporting limits, without a default;
   ask which to use and wait for the answer. Silence stops. One available source relays its designation; zero stops with the missing capability.
   If an explicitly designated source is unavailable, surface why and ask whether to
   make it available, use an available alternative, or stop; retain the designation
   until that is settled.
2. Resolve explicit or current-branch PR scope; otherwise use the working tree.
   Capture the resolved diff base SHA and changed-file list. For working-tree scope,
   include staged, unstaged, and recursively enumerated untracked paths, and retain
   the captured `HEAD` as base even after loop commits. No changes means ask what to
   review and stop. For a PR, read [PR scope](references/pr-scope.md) **before the
   first review** for checkout, base, and landing preparation.
3. For PR repairs, relay an already-settled `head` or `stacked` landing, including a
   stated standing practice. State the reading and its basis. Otherwise ask; silence
   stops. Hold the landing for this invocation while keeping the captured review base.
   A correction before repairs are committed replaces a misread designation; after
   commits, show what landed where and stop for recovery direction. A deliberately
   different settled landing belongs to a new invocation.
4. Harvest intent for the changed surface: applicable rules, project-guide rationale,
   adjacent design comments, and relevant context already at hand. Resolve the
   project's goal and authority order from its own declarations; report what the
   search did not find. Convey repository material as pointers. Convey loop-constituted
   design decisions as content with their constitutive basis, keeping the user's
   words where they establish direction. Only decisions holding independently of
   current code state enter this design-decision ledger; a revised decision supersedes
   its predecessor, with the retirement on the trace.
5. **Preserve reviewer independence.** Convey design intent, allowing the reviewer to
   challenge defects that intent causes. Keep fix-status claims, dispositions,
   do-not-reflag instructions, and shared-cause hypotheses out of reviewer context
   and out of surfaces harvested into it. A description of a decision carries no
   instruction about which verdict to return. Calibrate source severity by actual
   consequence against the mission: silent wrong results are critical, broken runtime
   behavior high, edge-condition failures medium, and consistency-only discrepancies
   low/suggestion; a convention-explained wording preference is not a defect.
6. Announce once that the user may end the loop at any time, receiving the trace and
   an optional offer to record what outlives it. Execution permissions and call
   supervision belong to the host; the loop provides no timeout guarantee itself.

### Phase 1 — Obtain one review

Use the selected host route and source adapter with the captured pointer and current
intent bundle. Read the returned review and diagnostics in full. Record actual call
settings and any reported failure cause as provenance, not coverage.

A call ending without a usable review contributes no verdict and satisfies neither
convergence arm. Show what returned and ask whether to continue without that round,
switch source, or stop. Continuing still owes a completed review before convergence.
An extraction failure calls for inspecting raw output; it does not prove source
failure. A capable source omitting reach leaves the missing report visible as residual.

### Phase 2 — Verify and attribute

Call `/inquire` on each finding against the current artifact before acting. Drop a
refuted finding with its cited basis and no defect provenance. For surviving findings,
check the asserted issue against the captured base, following moves/renames:

| Base reading | Provenance |
|---|---|
| The issue already held | `pre-existing` |
| Absent at base; the change alone supplies the defect | `introduced` |
| Absent at base but an independent condition is jointly necessary | `indeterminate` |

An unchanged copy left inconsistent by this change is introduced drift, not an
independent contributor. `indeterminate` takes the pre-existing side for scope
decisions. Provenance informs scope; it neither licenses nor excludes repair. Fold
genuine user judgments raised by verification into Phase 3's disposition gate.

### Phase 3 — Read the cause and settle disposition

Once per round, examine the artifact against the project's stated goal, even when
the source found nothing. Name the goal and consequence behind any additional finding,
verify it through Phase 2, and include it in classification. Record an empty goal
reading too; omit this pass only where no declared goal was found.

Read the verified set for a shared mechanism, competing explanations, unexplained
findings, and a falsifier. No shared cause is a valid result. A source direction is
one candidate, reconsidered after verification; agreement with the loop's reading
is not independent corroboration. Materially different root and local repairs are
a plan-level judgment even when each isolated fix looks mechanical.

A shared-cause reading may direct repair only while its falsifier holds off. It
neither drops findings nor becomes constituted design intent. Recheck the falsifier
when the surviving set changes or a repair lands; retire a defeated reading and
reclassify unlanded work. Applied repairs stand for the next full review. Across
rounds, compare new findings with prior fix predicates on the trace: a previously
matching site missed by a sweep calls for completing the enumeration; an instance
outside that predicate calls for reconsidering the abstraction. A later-created or
newly matching site does not falsify an earlier sweep.

- **Mechanical / Extension:** a verified bug with a self-evident localized fix, or
  another deterministic edit whose plausible shapes do not materially diverge.
  Apply and report without a disposition gate.
- **Judgment / Constitution:** materially different repair trajectories, unresolved
  design trade-offs, or unentrusted scope/risk decisions. Present evidence first,
  then ask the live question in everyday language. Cluster findings by shared
  disposition; when repair shape is the live axis, ask about trajectories rather
  than asking whether to apply them all.

Relay a disposition already settled by the user's prior direction, the PR's purpose,
or citable precedent, recording side effects. Reopen only a genuinely live competing
judgment. Packaging an identical mechanical fix does not reopen disposition; repairing
a pre-existing-side defect needs a citable scope license (purpose, mandated sweep,
or settled precedent), otherwise ask about expansion.

For conflicting governing surfaces, cite an applicable declared authority order or
settled direction to identify what governs. That settles direction, not repair shape
or execution permission. Where direction remains unsettled or its authority is
contested, show both surfaces, their disagreement, and their authority relation or
its absence; ask an open-ended direction question and retain the user's words.

**Recurrence:** identify the same defect by clause/invariant, not phrasing or line.
An initial uninformed return is absorbed by settled policy. Instance-specific
dismissals/deferrals never enter reviewer context, so their returns keep that
disposition and remain residual. A return after a fix was visible or a constituted
decision conveyed requires diagnosis before convergence. A still-self-evident
incomplete repair stays Mechanical and is rewritten by the driving session. A
contested design decision reaches a judgment gate with the recurrence history;
a third recurrence after the escalated re-apply discredits the Mechanical diagnosis
and also gates. End recurrence through repair or constituted direction, not reviewer
suppression.

Read trajectory from recurrence, causes, and base provenance, not finding-count
trends. Separate introduced, fix-induced, and pre-existing-side work when deciding
what this unit carries. A rising count changes neither the criterion nor source scope.

### Phase 4 — Apply and check the bundle

1. The driving session scans planned change points, adjacent interactions, and repeated
   instances. Name each fix's predicate and enumerate its sites across the artifact.
   Semantically verify and risk-screen every site before adding it to the fix brief;
   a new unbriefed site returns for screening. A nameless predicate licenses no write.
   Sweep matching sites in this apply pass within the settled scope, reporting expansion.
2. Risk is separate from Mechanical/Judgment classification. Route substrate actions
   to host permissions; an unsettled epistemic risk goes to the user for apply, defer,
   or drop. Rejection blocks an edit not yet written.
3. Use a self-contained brief for a fresh low-cost writer where the host exposes and
   permits one; its configuration selects the model. Use inline writing for trivial
   batches, parent-held risky actions, or absent delegation. Fork only where necessary
   loop context cannot be conveyed. Repeated fix-induced follow-ups across consecutive
   rounds escalate writing to the driving session; return to the lower tier after a
   review without such follow-ups.
4. Read every brief/sweep site against its disposition. Record missed or wrong edits
   and unintended changes for the next round; this establishes conformance to the
   brief, not independent correctness. Call `/contextualize` once on the whole applied
   bundle against the design-decision ledger and touched-surface conventions.
5. An adaptation that `/contextualize` actually writes re-enters scan, site screening,
   sweep, and write verification once; do not call `/contextualize` again in that pass.
   A rejecting guard on an already-written adaptation records its verdict and leaves
   the artifact standing for full re-review. Further unwritten sites still obey their
   screens. Recorded defer/drop verdicts remain visible at exit. A pass without an
   adaptation has no loop-back; the bundle proceeds to re-review on either outcome.

### Phase 5 — Re-review and stop on evidence

When the processed round has not earned convergence below, refresh changed files
and design intent and obtain a **full** re-review, including after dispositions that
landed no edit. Any edit invalidates the preceding verdict and always owes this
review of the original surface plus all repairs. For PR scope, commit repairs to the
settled landing and use its new head; [PR scope](references/pr-scope.md) defines that
pointer. For working-tree scope, compare against the captured base and include current
untracked files even if the loop has since committed. Keep review base fixed.

This call is the next round's review: send its findings and direction straight to
Phase 2, not a second Phase 1 call. Process findings even alongside approval, and
perform the goal reading. Converge only on the current reviewed artifact when every
surfaced finding is dispositioned, no recurrence awaits diagnosis, no edit has landed
since the review, and either:

- the source returned `approve`; or
- a full re-review returned zero new non-refuted findings.

A handed-over finding has a disposition and is not new when it returns. Unreached
axes, missing reach reports, open deferrals, and recorded rejecting adaptation
verdicts remain explicit residual; they do not themselves force another round and
are never reported as clearance. The user may exit at any point without convergence.

## Trace and Exit

Present each round's trace and continue without a gate:

```
Round k — host / source / route — reviewed base → head or working-tree state — verdict
Exercised: source-reported reach and gaps (omit for a standing no-channel source)
Call: observed settings or diagnostics, when present
Goal: loop's goal reading and its findings, including none (omit if no declared goal)
Relay: autonomously dispositioned findings → applied | dropped: basis | carried: reason
Gated: findings requiring user judgment → applied | dropped: basis | carried: reason
Landing: repair destination (PR only)
```

Each verified finding carries base provenance; an applied fix also carries its
predicate and sweep side effects. Assign exactly one Relay/Gated home by whether
the user was asked, including nested `/contextualize` questions and epistemic risk
gates. Host permission decisions are execution annotations. Record the fit pass as
its own entry, with adaptation and any retroactive rejecting verdict. Preserve write
discrepancies; carried reasons are records, while subsequent reviews detect findings
fresh. A stacked approval covers captured base through the repair layer, not either
PR alone.

At convergence or free exit, present the accumulated dispositions and residual,
including standing source limits. Read [exit handover](references/exit-handover.md)
before offering durable recording. Exiting is immediate; the record offer, its home,
or its refusal never conditions the exit.
