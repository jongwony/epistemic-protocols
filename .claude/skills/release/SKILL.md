---
name: release
description: Release for this repo — CalVer tag + narrative prepend.
allowed-tools: Read, Write, Edit, Bash(gh *), Bash(git *), AskUserQuestion
---

# Release (project-local)

Creates a CalVer tagged release with a hand-written narrative prepended to the body CI generates via `scripts/package.js`. Overrides the global `/release` skill for this repo.

## Purpose

- Push CalVer tag → CI (`release.yml`) runs `scripts/package.js` to build ZIPs + produce `dist/release-notes.md`, then `gh release create --draft --notes-file` attaches it
- Prepend a hand-written narrative block to the script-generated body so the release surfaces "why this release matters" before the commit list
- Leave publish (draft → published) to the user for manual review

## Preconditions

- Working tree clean, on `main` (or user-specified branch)
- `gh` authenticated with push access to the target remote (fork or upstream)
- Node 22+ on PATH (packaging requires `zlib.crc32`)

## Flow

### Phase 1: Tag decision

- Previous tag: `git describe --tags --abbrev=0` (excludes drafts, gives last tagged commit)
- Today: derive `YYYY.MM.DD` from current date
- Candidate tag: `v{YYYY.MM.DD}`, or `v{YYYY.MM.DD}.{N+1}` if same-day tag exists
- If latest tag is already today's and is Draft (not published), ask whether to re-tag (delete + recreate) or increment `.N`

### Phase 2: Tag push

- `git tag <tag>`
- `git push origin <tag>` → triggers `release.yml`

### Phase 3: Wait for CI draft

- Poll `gh run list --workflow=release.yml --limit 1 --json status,conclusion,databaseId` every 5s, max 12 attempts (60s total)
- When `status=completed` and `conclusion=success`, fetch draft: `gh release view <tag> --json body,url`
- If still `in_progress` after 60s: surface run URL and ask user whether to keep waiting
- If CI fails: surface logs via `gh run view <id> --log-failed`, do not proceed to Phase 4. Remediation: fix the cause and retag with `.N` increment, or clean up the pushed tag with `git push origin :refs/tags/<tag>` before retrying

### Phase 4: Narrative drafting

Analyze commits since previous tag:
```bash
git log --oneline <prev-tag>..HEAD
```

Select 3-4 highest-impact changes. Prioritize:
- New skills or protocols (`feat:` with new `SKILL.md`)
- Architectural principles (`rules/`, `CLAUDE.md`, axiom tier changes)
- User-facing behavior changes
- Cross-cutting refactors that affect multiple protocols

Deprioritize:
- Single-PR review-round commits, CI test count bumps, version bumps without content
- Commits whose only effect is subsumed by a broader commit in the same range

**Theme axis enumeration** (conditional on commit set complexity):

When the commit set admits multiple plausible theme axes — distinct ways to group the same commits under different unifying frames — enumerate ALL axes before drafting. Trigger: no single dominant change carries the release on its own; 5+ semantically distinct change clusters in the commit range is a heuristic signal of this condition, not the trigger by itself.

For each candidate axis, present as a numbered list (text output, not a gate option set — the user's response is free-form selection, supplement, or a new axis):
- **Theme line**: the unifying frame the axis would emphasize
- **Foregrounds**: which commits become the narrative centerpiece
- **Backgrounds**: which commits become accompanying detail
- **Trade-off signal**: structural strength (faithful to commit shape) vs. interpretive weight (post-hoc grouping)

Include a brief epistemic observation on which axes preserve the commit set's actual shape vs. which apply heavier grouping. When the commit set admits a single dominant theme — one frame is uniquely the best fit and other framings would feel like post-hoc reframing — skip axis enumeration and proceed directly to drafting.

After enumeration, draft narrative using the axis the agent judges best-fit; the gate at Phase 5 lets the user pick a different axis if preferred.

Draft narrative using this template (Korean, matching repo's PR body convention):

```
> **Background**
>
> {experiential / contextual narrative — the lived origin and why this release matters; 1-3 paragraphs. Background IS pure context — the theme sentence belongs in the 무엇이 새로운가요? section below.}
>
> ---
>
> **무엇이 새로운가요?**
>
> 이번 릴리스의 핵심은 **{theme}** — {one sentence summarizing the release}.
>
> - {emoji} **`/command`** 또는 **{feature name}** — {user-facing narrative, 1-2 sentences}
> - {emoji} **...** — ...
> - {emoji} **...** — ...
> - {emoji} **...** — ...
>
> ---

{script-generated body, with its leading `# Epistemic Protocols vX` H1 line removed so it starts at `## Highlights`}
```

The narrative splits into two blockquoted sections, matching the repo's prior-release convention:

- **Background** — pure experiential/contextual narrative (the lived origin). The label is intentionally English `**Background**`: a grandfathered exception to the Korean-narrative convention, carried forward from earlier releases (`v2026.05.18`, `v2026.05.15`) for visual continuity. The change-section label `**무엇이 새로운가요?**` stays Korean.
- **무엇이 새로운가요?** — leads with the theme sentence (`이번 릴리스의 핵심은 **{theme}** — ...`), then the change bullets.

Both sections, and the close before the script body, are bounded by in-blockquote dividers (`> ---`). Each `> ---` must be preceded by a blank `>` line: in CommonMark a `---` placed flush against paragraph text parses as a setext H2 underline, which would render the preceding line as a heading instead of a divider — the blank `>` line keeps it a thematic break.

The script body's leading `# Epistemic Protocols vX` H1 is stripped: the GitHub release title already renders the version, so a body H1 would surface a duplicate title. After stripping, the body begins at `## Highlights`.

Emoji selection is descriptive: choose an emoji whose visual semantic matches the change class. The same change class may take different emoji across releases — match the release's framing, not a fixed table.

### Phase 5: Gate with horizon fusion

**Context** (emit before the gate, as text output):
- Theme axis enumeration when generated in Phase 4 — condense to a labels-only form (axis names without per-axis 4-tuple) and reference the Phase 4 detail above when full re-surfacing would bloat the gate context; otherwise re-surface in full. Either form preserves Recognition that the user may select a different axis than the one the agent drafted from.
- Full composed body preview: narrative draft (closed with `> ---` inside the blockquote) + script-generated body with its leading `# Epistemic Protocols vX` H1 stripped (begins at `## Highlights`)
- Theme sentence and bullet selection rationale

**Experiential elicitation** (emit as part of context):

Background narratives benefit from the user's experiential grounding — the lived origin that motivated the release. The AI draft maps commit shape; the user supplies the grounding that makes the shape readable. Explicitly invite the user to supplement Background; supplementation is optional. When the AI draft already captures the origin from commit content alone, the invitation can be lightweight — but it must still be surfaced so the option is recognized rather than recalled.

**Question**: Apply the drafted narrative, supplement with experiential context, modify other elements, or skip?

Options:
1. **Apply** — prepend narrative as drafted; proceed to Phase 6
2. **Add experiential context** — user supplies lived origin / environmental observation; AI fuses it with the draft Background as a new horizon (preserving the AI's commit-mapping spine, adding the user's experiential grounding); revised draft re-presents at Phase 5 (loop)
3. **Modify** — user supplies edits to axis selection, bullet text, emoji, or tone; revised draft re-presents at Phase 5 (loop)
4. **Skip** — leave script-generated body as-is (patch-only releases per Rule 5); proceed to Phase 6 with no prepend

This gate is mandatory even if the narrative seems obvious — theme choice and origin framing are constitutive judgments the user owns.

**Horizon fusion sub-protocol** (engaged when user selects Add experiential context):

1. Treat the AI draft Background as Horizon A — the commit-shape narrative
2. Treat the user's experiential input as Horizon B — the lived origin
3. Fuse: preserve Horizon B's voice and the arc the user actually supplied; let Horizon A inform which protocol/utility is named in the closing sentence
4. Bullets remain anchored to Horizon A (commit-mapping); only Background absorbs Horizon B
5. Per-horizon trace (preserved / transformed / dropped) renders as a single line before the fused candidate at Phase 5 — naming what each horizon contributed, what was transformed in fusion, and what was dropped. The trace surfaces fusion accountability, matching the trace-visibility pattern in `/realign`.
6. Iteration is expected: each loop pass refines whatever dimension the prior pass left under-specified. Continue looping until Apply or Skip — do not pre-empt convergence by treating the first fusion as final.

### Phase 6: Apply + surface

- Compose final body: narrative (closed with `> ---` inside the blockquote) + CI body with its leading `# Epistemic Protocols vX` H1 stripped (begins at `## Highlights`) — prevents a duplicate title alongside the GitHub release title
- `gh release edit <tag> --notes-file <tmp-path>`
- Output draft URL with a note that the user publishes manually via GitHub web UI

## Rules

1. **Tag before narrative**: CI must create the draft first. Narrative prepends to the script-generated body (Highlights/Protocols/Assets sections from `scripts/package.js`); the skill does not replace or regenerate those sections.
2. **Korean narrative**: matches the repo's PR body language convention.
3. **Terminal operation bounded to body edit**: the skill's terminal operation is `gh release edit <tag> --notes-file <path>` against the existing draft. Release creation is owned by CI (via tag push trigger); publish-to-public is owned by the user via the GitHub web UI.
4. **Theme over item list**: the narrative answers "why this release matters"; the auto-generated section already enumerates what changed.
5. **3-4 bullets max**: more dilutes impact. If fewer than 3 user-facing changes exist, propose skipping the narrative entirely (patch-only releases do not need it).
6. **No draft republish on existing body**: if the draft already has a narrative (check for leading `>` blockquote in fetched body), ask before overwriting.
7. **Failure surfacing**: if CI fails, do not attempt narrative drafting — surface the failure to the user and stop.

## Failure Modes

- **CI timeout**: `release.yml` typically completes in <15s. If `status=in_progress` after 60s, surface the run URL and let user decide whether to wait or abort.
- **Working tree dirty**: refuse to tag. Surface `git status` output.
- **Tag already exists (published)**: must increment `.N` suffix — cannot overwrite a published release.
- **Tag already exists (draft)**: ask whether to delete draft + re-tag, or increment `.N`.
