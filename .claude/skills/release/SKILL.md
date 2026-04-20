---
name: release
description: Release for this repo — CalVer tag + narrative prepend.
allowed-tools: Read, Write, Edit, Bash(gh release:*), Bash(gh run:*), Bash(git tag:*), Bash(git push:*), Bash(git log:*), Bash(git status:*), Bash(git describe:*), AskUserQuestion
---

# Release (project-local)

Creates a CalVer tagged release with a hand-written narrative prepended to the CI auto-generated body. Overrides the global `/release` skill for this repo.

## Purpose

- Push CalVer tag → CI (`release.yml`) builds ZIPs + creates draft with auto-generated notes
- Prepend a hand-written narrative block to the CI-generated body so the release surfaces "why this release matters" before the commit list
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
- If CI fails: surface logs via `gh run view <id> --log-failed`, do not proceed to Phase 4

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

{auto-generated body}
```

Emoji selection is descriptive (choose what fits the change's semantic class), not prescriptive. Examples observed across releases: ✍️ editing/writing, 🔎 introspection, 🧠 memory/cognition, 🏛️ structural/axiom, 🪢 cross-cutting principle, 🔍 verification, 🎯 classification, ⚡ simplification.

### Phase 5: Gate

Present the drafted narrative (theme + bullets) with the full composed body preview. Options:
1. **Apply** — prepend narrative as drafted
2. **Modify** — user supplies edits or requests regeneration
3. **Skip** — leave CI body as-is (patch-only releases per Rule 5)

This gate is mandatory even if the narrative seems obvious — theme choice is a constitutive judgment the user owns.

### Phase 6: Apply + surface

- Compose final body: narrative + `---` + CI body
- `gh release edit <tag> --notes-file <tmp-path>`
- Output draft URL with a note that the user publishes manually via GitHub web UI

## Rules

1. **Tag before narrative**: CI must create the draft first. Narrative prepends to auto-generated content; it does not replace or regenerate the Highlights/Protocols/Assets sections.
2. **Korean narrative**: matches the repo's PR body language convention.
3. **User publishes**: this skill never runs `gh release edit --draft=false` and never calls `gh release create` directly (CI owns creation). Publish is a manual action by the user on the GitHub web UI.
4. **Theme over item list**: the narrative answers "why this release matters"; the auto-generated section already enumerates what changed. Do not duplicate the commit list inside the narrative.
5. **3-4 bullets max**: more dilutes impact. If fewer than 3 user-facing changes exist, propose skipping the narrative entirely (patch-only releases do not need it).
6. **No draft republish on existing body**: if the draft already has a narrative (check for leading `>` blockquote in fetched body), ask before overwriting.
7. **Failure surfacing**: if CI fails, do not attempt narrative drafting — surface the failure to the user and stop.

## Failure Modes

- **CI timeout**: `release.yml` typically completes in <15s. If `status=in_progress` after 60s, surface the run URL and let user decide whether to wait or abort.
- **Working tree dirty**: refuse to tag. Surface `git status` output.
- **Tag already exists (published)**: must increment `.N` suffix — cannot overwrite a published release.
- **Tag already exists (draft)**: ask whether to delete draft + re-tag, or increment `.N`.
