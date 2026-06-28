---
name: triage
description: "Work-unit triage for GitHub issues. Groups raw issues, fuses each group with the AGENTS.md northstar in session, and emits dispatchable initial prompts."
---

# Triage: Work-Unit Formation

Form executable work units from GitHub issue substrate, handing execution — branches, PRs, applied fixes — to /dispatch or a normal session. It reads raw issues, groups related issues, fuses each group with the project's inscribed northstar and the user's current-session judgment, and emits one or more initial prompts that can be routed to an independent session, linear `/dispatch`, or parallel `/dispatch`.

## Core Contract

`/triage` owns work-unit formation:

```
BacklogIntake
  -> RawIssueSet
  -> IssueGroup
  -> NormalizedProblemFrame
  -> NorthstarFusion
  -> FocusedWorkUnit
  -> InitialPrompt
  -> RouteChoice
```

`/dispatch` owns work-unit execution. It consumes a focused work unit or initial prompt and applies the selected execution topology. If the user asks `/dispatch` to process open issues directly, route to `/triage` first unless a focused work unit is already present in the session.

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
| `InitialPrompt` | The handoff text for an independent session or `/dispatch`. It is the output artifact, not a raw issue summary. |
| `RouteChoice` | The user's current-session choice: independent session, linear dispatch, parallel dispatch, or re-triage. |

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
| `IntentAmbiguity` | Whether the current session has clarified the triage purpose: dispatchable work selection, stale backlog reduction, milestone/release preparation, duplicate consolidation, blocker surfacing, or another explicit intent. |

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

For medium and large intake postures, metadata-only lists are provisional. They can seed `IssueGroup` candidates, but a candidate cannot become a `NormalizedProblemFrame`, `FocusedWorkUnit`, or `InitialPrompt` until the relevant full issue substrate has been read.

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
- one subset needs independent session exploration while another is ready for dispatch
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

## Phase 6: Emit Initial Prompts

For each ready work unit, emit an `InitialPrompt` in this format:

```markdown
# Initial Prompt: <FocusedWorkUnit name>

## Work Unit

<one-paragraph description of the focused work unit>

## Northstar Fusion

- Preserved: <issue claims preserved by the northstar>
- Transformed: <issue claims reframed by the northstar>
- Dropped: <issue claims excluded from this unit>

## Issue Substrate

- #<n> — <role in the work unit>

## Scope

In scope:
- <specific scope item>

Out of scope:
- <specific exclusion>

## Execution Instructions

<what the receiving session or /dispatch should do first>

## Verification

- <project-specific verification command or check>

## Route Options

- Independent session: <when this is appropriate>
- Linear dispatch: <when this is appropriate>
- Parallel dispatch: <when this is appropriate>
```

## Phase 7: Route Choice

Present the work units and ask the user to choose a route:

1. **Independent session** — use one initial prompt in a fresh session.
2. **Linear dispatch** — pass selected work units to `/dispatch` sequentially.
3. **Parallel dispatch** — pass independent work units to `/dispatch` in parallel.
4. **Re-triage** — revise grouping, fusion, or work-unit boundaries.

If the user chooses dispatch, hand off only the selected `InitialPrompt` or work-unit set; `/dispatch` consumes it as-is without re-scanning open issues.

## Rules

1. **Backlog intake default** (Architectural — usable entrypoint): A bare `/triage` call defaults to the current repository's open GitHub issue backlog through a lightweight metadata pass. Ask for scope only when repository issue access is unavailable or ambiguous.
2. **RawIssueSet scope** (Architectural — substrate boundary): Use `RawIssueSet`, not broad external-signal language, for the issue substrate. The concrete input is GitHub issues or pasted issue equivalents.
3. **Dynamic scale judgment** (Architectural — bounded attention): Classify small, medium, or large by `TriageLoad`, not by a fixed issue-count threshold. Issue count is only one signal inside `IssueLoad`.
4. **Scale-aware substrate read** (Architectural — bounded attention): Small intake may be full-scanned; medium intake requires metadata-first cluster confirmation; large intake requires `IntakeIntent` via `/elicit` before full substrate reads.
5. **Metadata is provisional** (Architectural — substrate boundary): Metadata-only grouping cannot produce a work unit. Full issue substrate is required before normalization, northstar fusion, and prompt emission.
6. **Work-unit formation, not execution** (Architectural — role boundary): `/triage` does not edit production files, create implementation branches, open PRs, or apply fixes.
7. **IssueGroup default cardinality** (Architectural — review-surface visibility): Default to `IssueGroup -> FocusedWorkUnit` one-to-one. Split only with cited execution-axis evidence.
8. **Northstar fusion required** (Axiom anchor — Convergence Persistence): Every ready work unit includes a fusion trace against the active project northstar. A summary without fusion is not a triaged work unit.
9. **Session route authority** (Axiom anchor — Detection with Authority): Route choice belongs to the user in the current session. GitHub labels or project fields may record the choice but do not replace it.
10. **InitialPrompt is the handoff artifact** (Architectural — handoff specificity): Dispatch and independent sessions consume initial prompts or focused work units, not raw issue lists.
11. **No silent grouping** (Derived — Surfacing over Deciding): Surface grouping candidates before forming work units. Similarity grouping is a user-recognized judgment, not a hidden classifier result.
12. **Preserve issue provenance** (Architectural — provenance continuity): Every problem frame, work unit, and prompt cites the source issue numbers that contributed to it.
13. **Blocked work stays visible** (Derived — Surfacing over Deciding): If an issue group is blocked, stale, or needs-info, emit that as a work-unit disposition or re-triage note rather than dropping it.

## Boundary Note

`/triage` reads GitHub issue substrate and emits focused work units. It may read the current northstar produced by `/realign`, but it does not rewrite the project guide. It hands selected initial prompts to `/dispatch`, but does not execute branches, PRs, or review compliance.

## Anti-patterns

- **Count-threshold scale**: deciding small, medium, or large by a fixed issue count instead of `TriageLoad`.
- **Unbounded backlog scan**: reading full bodies/comments for a medium or large intake posture before a metadata grouping checkpoint or `/elicit`-formed `IntakeIntent`.
- **Label-only grouping**: labels can seed grouping, but the work unit must be formed by shared problem pressure and cited issue evidence.
- **Label-implies-load**: inferring low deliverable (execution/review) load from a `refactor`/mechanical label when the issue's output is a decision or candidate-classification that will spawn in-session judgment gates.
- **Metadata-only work units**: emitting normalized frames, focused work units, or initial prompts from titles/labels alone.
- **Northstar-free summary**: a raw issue summary without preserved/transformed/dropped claims is not a triaged work unit.
- **Dispatch leakage**: branch creation, file edits, PR creation, and review compliance belong to `/dispatch` or a normal execution session, not `/triage`.
- **Silent split or merge**: changing work-unit cardinality without surfacing the grouping rationale hides the decision the user must recognize.
- **Prompt as issue dump**: an initial prompt must state scope, exclusions, execution entry point, and verification expectations; it is not a pasted issue list.

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
- [ ] Phase 6 InitialPrompt includes scope, out-of-scope clauses, execution instructions, and verification
- [ ] Phase 7 route choice is selected by the user before dispatch handoff
