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
- `gh` authenticated for `jongwony/epistemic-protocols`
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

Draft narrative using this template (Korean, matching repo's PR body convention):

```
> 이번 릴리스의 핵심은 **{theme}** — {one sentence explaining why this release matters}.
>
> **무엇이 새로운가요?**
> - {emoji} **`/command`** 또는 **{feature name}** — {user-facing narrative, 1-2 sentences}
> - {emoji} **...** — ...
> - {emoji} **...** — ...
> - {emoji} **...** — ...

---

{script-generated body}
```

Emoji selection is descriptive (choose what fits the change's semantic class), not prescriptive. Examples observed across releases: ✍️ editing/writing, 🔎 introspection, 🧠 memory/cognition, 🏛️ structural/axiom, 🪢 cross-cutting principle, 🔍 verification, 🎯 classification, ⚡ simplification.

### Phase 5: Gate

**Context** (emit before the gate, as text output):
- Full composed body preview: narrative draft + `---` + script-generated body
- Theme sentence and bullet selection rationale

**Question**: Apply the drafted narrative to the draft release?

Options:
1. **Apply** — prepend narrative as drafted; proceed to Phase 6
2. **Modify** — user supplies edits or regeneration directive; revised draft re-presents at Phase 5 (loop until Apply or Skip)
3. **Skip** — leave script-generated body as-is (patch-only releases per Rule 5); proceed to Phase 6 with no prepend

This gate is mandatory even if the narrative seems obvious — theme choice is a constitutive judgment the user owns.

### Phase 6: Apply + surface

- Compose final body: narrative + `---` + CI body
- `gh release edit <tag> --notes-file <tmp-path>`
- Output draft URL with a note that the user publishes manually via GitHub web UI

## Rules

1. **Tag before narrative**: CI must create the draft first. Narrative prepends to the script-generated body (Highlights/Protocols/Assets sections from `scripts/package.js`); the skill does not replace or regenerate those sections.
2. **Korean narrative**: matches the repo's PR body language convention.
3. **Terminal operation bounded to body edit**: the skill's terminal operation is `gh release edit <tag> --notes-file <path>` against the existing draft. Release creation is owned by CI (via tag push trigger); publish-to-public is owned by the user via the GitHub web UI.
4. **Theme over item list**: the narrative answers "why this release matters"; the auto-generated section already enumerates what changed. Do not duplicate the commit list inside the narrative.
5. **3-4 bullets max**: more dilutes impact. If fewer than 3 user-facing changes exist, propose skipping the narrative entirely (patch-only releases do not need it).
6. **No draft republish on existing body**: if the draft already has a narrative (check for leading `>` blockquote in fetched body), ask before overwriting.
7. **Failure surfacing**: if CI fails, do not attempt narrative drafting — surface the failure to the user and stop.

## Failure Modes

- **CI timeout**: `release.yml` typically completes in <15s. If `status=in_progress` after 60s, surface the run URL and let user decide whether to wait or abort.
- **Working tree dirty**: refuse to tag. Surface `git status` output.
- **Tag already exists (published)**: must increment `.N` suffix — cannot overwrite a published release.
- **Tag already exists (draft)**: ask whether to delete draft + re-tag, or increment `.N`.
