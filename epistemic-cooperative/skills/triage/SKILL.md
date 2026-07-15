---
name: triage
description: "Work-unit triage for GitHub issues. Groups raw issues, fuses each group with the AGENTS.md northstar in session, and composes /distill to hand off each routed work unit."
---

# Triage: Work-Unit Formation

Form executable work units from GitHub issue substrate, handing execution — branches, PRs, applied fixes — to a normal session. It reads raw issues, groups related issues, fuses each group with the project's inscribed northstar and the user's current-session judgment, forms one or more focused work units, and — once the user routes a unit for handoff — composes `/distill` to emit it as a portable handoff for an independent session.

## Core Contract

`/triage` owns work-unit formation:

```
BacklogIntake
  -> RawIssueSet
  -> IssueGroup
  -> NormalizedProblemFrame
  -> NorthstarFusion
  -> FocusedWorkUnit
  -> RouteChoice
       -> independent session: [/distill] -> PortableHandoff
       -> re-triage: back to the relevant earlier phase, no handoff composed
```

Execution is not `/triage`'s. The receiving session consumes the portable handoff `/distill` composes — or a focused work unit directly — and does the branching, editing, and PR work itself. Arranging how several routed units run is likewise outside this skill: `/triage` emits one handoff per routed unit and stops.

## Types

| Type | Meaning |
|---|---|
| `BacklogIntake` | The scale-aware intake step that binds an explicit issue scope or, when no scope is supplied, inspects the current repository's open GitHub issue backlog through lightweight metadata before deciding how much substrate to read. Scale is judged by triage load, not by a fixed issue-count threshold. |
| `RawIssueSet` | The issue substrate read from GitHub: issue body, comments, labels, linked PRs, and explicitly cited blockers. Scope this narrowly to issues; do not call it external signals. |
| `IntakeIntent` | The user-recognized purpose for the triage pass, explicitly stated in the current session. |
| `TriageLoad` | A metadata-grounded composite judgment spanning `IssueLoad`, `RepoLoad`, `MappingLoad`, and `IntentAmbiguity`. |
| `IssueGroup` | One or more raw issues that share a problem pressure: similar symptom, target behavior, conceptual request, affected surface, or blocked execution axis. |
| `NormalizedProblemFrame` | A single problem statement reconstructed from the issue group, with duplicates collapsed and contradictions surfaced. |
| `Northstar` | The inscribed direction line read from `AGENTS.md` or the active project guide, usually under `## Northstar`. This may have been produced by `/realign`. |
| `NorthstarFusion` | A session-text trace showing how the normalized problem frame preserves, transforms, or drops issue claims in light of the northstar and the user's current judgment. |
| `FocusedWorkUnit` | The executable unit formed from one issue group after northstar fusion. Default cardinality is `IssueGroup -> FocusedWorkUnit` one-to-one. Split only when northstar fusion exposes distinct execution axes. |
| `RouteChoice` | The user's current-session choice for a formed work unit: hand it off to an independent session, or re-triage it. |
| `PortableHandoff` | The handoff artifact for an independent session, composed by `/distill` from a routed `FocusedWorkUnit`. `/distill` owns this type; `/triage` composes it rather than emitting its own handoff format. |

## Phase 0: Bind Scope

Accept one of:

- Explicit issue numbers or URLs
- A GitHub query scope such as a label, milestone, project view, or `gh issue list` filter
- The current session's issue set if the user has already surfaced raw issues
- A user-supplied issue list pasted into the session

If no scope is recoverable, default to the current repository's open GitHub issue backlog. First perform a lightweight metadata pass, not a full substrate read:

```bash
gh issue list --state open --json number,title,labels,state,createdAt,updatedAt,assignees,milestone
```

If GitHub access is unavailable or the current repository cannot be identified, ask for the issue scope or pasted issue list.

Classify the intake scale by `TriageLoad` before reading full issue bodies and comments:

| Load axis | Signals to inspect from metadata and repo shape |
|---|---|
| `IssueLoad` | Open issue volume relative to the next checkpoint, recent arrival rate, title/body preview density when available, comment/dependency/link indicators, unlabeled or stale proportion, duplicate / needs-info candidates. |
| `RepoLoad` | Repository surface area, number of independently deployable packages or runtime surfaces, verifier/test matrix breadth, known co-change requirements, ownership or component boundaries. |
| `MappingLoad` | How clearly issue titles/labels map to code, docs, runtime, verifier, or protocol surfaces; whether many issues span several surfaces or lack enough metadata to map. |
| `IntentAmbiguity` | Whether the current session has clarified the triage purpose: executable work selection, stale backlog reduction, milestone/release preparation, duplicate consolidation, blocker surfacing, or another explicit intent. |

Use the load axes to choose an intake posture:

| Posture | Intake path |
|---|---|
| Small | Full-scan the bound open issues into `RawIssueSet`, then group. Use this only when `IssueLoad`, `RepoLoad`, `MappingLoad`, and `IntentAmbiguity` are all low enough that full substrate reading fits the next checkpoint. |
| Medium | Build a metadata grouping map first. Surface candidate clusters in Phase 2 before the user confirms selection, then read full substrate only for confirmed clusters. Use this when full scan is plausible but one or more load axes would make silent reading too costly. |
| Large | Call `/elicit` to crystallize `IntakeIntent`, convert that intent into a GitHub query/filter or cluster selection, then read full substrate only for the resulting slice. Use this whenever full substrate reading would exceed the next checkpoint or the triage purpose is unclear. |

If the user explicitly asks for a full-backlog audit on a medium or large backlog, process metadata in checkpointed batches and surface progress between batches. Defer full body/comment reads until after the first grouping checkpoint.

**Load is not legible from labels.** `TriageLoad` sizes the *intake* (how much substrate to read now). It does not measure the *deliverable load* a unit imposes downstream — the human judgment its execution and review will demand. These are independent: a `refactor`/`enhancement` label does not imply low deliverable load. An audit or candidate-classification issue — one whose output is a *decision* (which candidates to act on, merge-vs-keep, discriminant-vs-removable) — carries high deliverable load because it spawns in-session judgment gates, even when its surface reads as mechanical. When ordering or routing units by reviewer cost, read deliverable load from what the issue *produces* (a mechanical edit vs a decision), not from its type label.

## Phase 1: Read Raw Issues

Read the full issue substrate for each issue in the bound scope or confirmed cluster:

- number, title, body, labels, state, author, timestamps
- comments that contain reporter answers, prior triage notes, review feedback, or maintainer decisions
- linked PRs and explicit references such as `depends on #N`
- labels or body sections indicating blocked, out-of-scope, stale, or ready states

Use the available GitHub interface (`gh`, MCP, or pasted issue text). Preserve issue numbers in every downstream artifact.

For medium and large intake postures, metadata-only lists are provisional. They can seed `IssueGroup` candidates, but a candidate cannot become a `NormalizedProblemFrame`, `FocusedWorkUnit`, or distilled `PortableHandoff` until the relevant full issue substrate has been read.

## Phase 2: Group Issues

Propose `IssueGroup` candidates by problem pressure, not by label alone.

Useful grouping signals:

- same user-facing symptom or desired behavior
- same issue type, impact, urgency, severity, or priority pressure
- same component, owner, milestone, or affected runtime surface
- same protocol, skill, runtime surface, or verifier surface
- same missing decision or northstar tension
- same stale, blocked, duplicate, or needs-info disposition
- duplicate or near-duplicate requests
- one issue's proposed fix depends on another issue's premise

Labels can seed grouping, especially type / priority / severity / component labels, but they do not replace problem-pressure grouping.

Surface the grouping map before moving to fusion. If grouping is contested, present 2-3 grouping alternatives with their downstream work-unit shape. The user may confirm, adjust, split, merge, or ask for re-triage.

## Phase 3: Normalize Problem Frames

For each confirmed `IssueGroup`, write a `NormalizedProblemFrame`:

- **Problem**: one sentence naming the shared pressure
- **Included issues**: issue numbers and one-line contribution from each
- **Observed evidence**: concise issue-body/comment evidence
- **Conflicts or drift**: contradictions, stale claims, or unresolved issue premises
- **Missing context**: specific facts needed before execution, if any
- **Out of scope**: nearby requests the group should not absorb

This is not an implementation plan. It is the issue group's shared problem frame.

## Phase 4: Fuse With Northstar

Read the active project northstar from `AGENTS.md`, `CLAUDE.md`, or the project guide. Prefer `AGENTS.md` when present in Codex contexts.

For each `NormalizedProblemFrame`, produce a `NorthstarFusion` trace:

- **Preserved**: issue claims that directly serve the northstar
- **Transformed**: issue claims reframed by the northstar
- **Dropped**: issue claims that are unsupported, stale, or outside the current work unit
- **User-session judgment**: the current-session interpretation or route preference the user has expressed

The fusion happens in session text. GitHub may store the result later, but the user's route judgment is constituted in the Codex session.

## Phase 5: Form Focused Work Units

Convert each fused frame into a `FocusedWorkUnit`.

Default rule: one confirmed `IssueGroup` becomes one `FocusedWorkUnit`.

Split the group only when:

- northstar fusion exposes separate execution axes
- one subset is blocked while another is ready
- one subset needs exploration before it can be framed while another is ready to hand off
- verification surfaces are disjoint enough that one PR would hide the review basis

Each work unit includes:

- name
- normalized problem frame
- northstar fusion trace
- included issues
- excluded issues or claims
- readiness status: ready, needs-info, blocked, stale, or split-required
- verification expectations
- suggested route with rationale

## Phase 6: Route Choice

Present the work units and ask the user to choose a route for each:

1. **Independent session** — hand this unit's portable handoff to a fresh session.
2. **Re-triage** — revise grouping, fusion, or work-unit boundaries.

The route choice is the input Phase 7 hands `/distill`: a unit routed to an independent session proceeds to Phase 7. Re-triage returns to the relevant earlier phase; no handoff is composed for that cycle.

## Phase 7: Compose /distill

For each work unit the user routed to an independent session, compose `/distill` to produce its `PortableHandoff`.

Hand `/distill` the work unit's own substrate as its working context: the `FocusedWorkUnit`, its `NormalizedProblemFrame`, its `NorthstarFusion` trace, and the included issue numbers with their per-issue contribution. `/distill` runs its own contract declaration against this substrate: the recipient is a fresh session with no access to the current one, so the handoff carries what that session cannot re-derive from the repository itself. `/triage` does not pre-classify durability or recipient profile; it supplies the work-unit substrate, and `/distill` resolves them at its own contract phase.

Re-triage does not reach this phase: revising grouping, fusion, or work-unit boundaries produces no handoff to distill.

`/distill` emits the `PortableHandoff`, including the activation edge that hands the artifact to the independent session as a copyable initial-prompt block.

## Rules

1. **Backlog intake default** (Architectural — usable entrypoint): A bare `/triage` call defaults to the current repository's open GitHub issue backlog through a lightweight metadata pass. Ask for scope only when repository issue access is unavailable or ambiguous.
2. **RawIssueSet scope** (Architectural — substrate boundary): Use `RawIssueSet`, not broad external-signal language, for the issue substrate. The concrete input is GitHub issues or pasted issue equivalents.
3. **Dynamic scale judgment** (Architectural — bounded attention): Classify small, medium, or large by `TriageLoad`, not by a fixed issue-count threshold. Issue count is only one signal inside `IssueLoad`.
4. **Scale-aware substrate read** (Architectural — bounded attention): Small intake may be full-scanned; medium intake requires metadata-first cluster confirmation; large intake requires `IntakeIntent` via `/elicit` before full substrate reads.
5. **Metadata is provisional** (Architectural — substrate boundary): Metadata-only grouping cannot produce a work unit. Full issue substrate is required before normalization, northstar fusion, and handoff composition.
6. **Work-unit formation, not execution** (Architectural — role boundary): `/triage` does not edit production files, create implementation branches, open PRs, or apply fixes.
7. **IssueGroup default cardinality** (Architectural — review-surface visibility): Default to `IssueGroup -> FocusedWorkUnit` one-to-one. Split only with cited execution-axis evidence.
8. **Northstar fusion required** (Axiom anchor — Convergence Persistence): Every ready work unit includes a fusion trace against the active project northstar. A summary without fusion is not a triaged work unit.
9. **Session route authority** (Axiom anchor — Detection with Authority): Route choice belongs to the user in the current session. GitHub labels or project fields may record the choice but do not replace it.
10. **PortableHandoff is the handoff artifact** (Architectural — handoff specificity): A receiving session consumes the portable handoff `/distill` composes, or a focused work unit directly, not a raw issue list.
11. **No silent grouping** (Derived — Surfacing over Deciding): Surface grouping candidates before forming work units. Similarity grouping is a user-recognized judgment, not a hidden classifier result.
12. **Preserve issue provenance** (Architectural — provenance continuity): Every problem frame, work unit, and composed handoff cites the source issue numbers that contributed to it.
13. **Blocked work stays visible** (Derived — Surfacing over Deciding): If an issue group is blocked, stale, or needs-info, emit that as a work-unit disposition or re-triage note rather than dropping it.
14. **Composition boundary, not hand-rolled emission** (Architectural — composition boundary): `/triage` forms and routes focused work units; it does not hand-roll its own handoff template. The portable handoff — its zero-memory comprehension gate, leak lint, and durability classification — is `/distill`'s owned contract, composed at Phase 7 rather than duplicated inline.

## Boundary Note

`/triage` reads GitHub issue substrate and emits focused work units. It may read the current northstar produced by `/realign`, but it does not rewrite the project guide. It composes `/distill` to hand selected work units' portable handoffs to independent sessions, but does not execute branches, PRs, or review compliance, and does not arrange the order or concurrency in which several routed units run.

## Composition

Triage composes the following protocols at runtime:

- **Phase 0 (large intake posture)**: `/elicit` (Euporia) — crystallizes `IntakeIntent` before full substrate reads
- **Phase 7**: `/distill` (Diylisis) — composes the routed work unit's portable handoff

Composition is sequential — each phase consumes the previous phase's output. The re-triage route at Phase 6 does not reach Phase 7; that cycle composes no handoff.

## Anti-patterns

- **Count-threshold scale**: deciding small, medium, or large by a fixed issue count instead of `TriageLoad`.
- **Unbounded backlog scan**: reading full bodies/comments for a medium or large intake posture before a metadata grouping checkpoint or `/elicit`-formed `IntakeIntent`.
- **Label-only grouping**: labels can seed grouping, but the work unit must be formed by shared problem pressure and cited issue evidence.
- **Label-implies-load**: inferring low deliverable (execution/review) load from a `refactor`/mechanical label when the issue's output is a decision or candidate-classification that will spawn in-session judgment gates.
- **Metadata-only work units**: emitting normalized frames, focused work units, or composed handoffs from titles/labels alone.
- **Northstar-free summary**: a raw issue summary without preserved/transformed/dropped claims is not a triaged work unit.
- **Execution leakage**: branch creation, file edits, PR creation, and review compliance belong to the receiving execution session, not `/triage`.
- **Silent split or merge**: changing work-unit cardinality without surfacing the grouping rationale hides the decision the user must recognize.
- **Work unit as issue dump**: a `FocusedWorkUnit` handed to `/distill` must carry the fused problem frame, scope, exclusions, and verification expectations Phase 3 through 5 produced; it is not a pasted issue list.
- **Hand-rolled handoff emission**: writing a bespoke initial-prompt template inside `/triage` instead of composing `/distill` at Phase 7. The handoff's comprehension gate, leak lint, and durability classification live in `/distill`'s contract; re-implementing them inline duplicates and drifts from it.

## Operational checklist (per cycle)

- [ ] Phase 0 issue scope is explicit, session-supplied, pasted, or defaulted to current open backlog through metadata intake
- [ ] Phase 0 `TriageLoad` records `IssueLoad`, `RepoLoad`, `MappingLoad`, and `IntentAmbiguity`
- [ ] Phase 0 intake posture is classified as small, medium, or large from `TriageLoad` before full substrate reads
- [ ] Large intake has an `IntakeIntent` crystallized through `/elicit` before filtered full-substrate reads
- [ ] Phase 1 RawIssueSet includes issue numbers and relevant comments / links / blockers
- [ ] Phase 2 grouping map surfaced before work-unit formation
- [ ] Phase 3 NormalizedProblemFrame records evidence, conflicts, missing context, and exclusions
- [ ] Phase 4 NorthstarFusion records preserved / transformed / dropped claims
- [ ] Phase 5 FocusedWorkUnit readiness and split rationale are explicit
- [ ] Phase 6 route choice is selected by the user before any handoff is composed
- [ ] Phase 7 `/distill` is composed per routed work unit, handed the FocusedWorkUnit/NormalizedProblemFrame/NorthstarFusion/issue-provenance substrate; re-triage skips this step
