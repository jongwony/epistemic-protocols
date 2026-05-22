# Verification & Report

Read the produced PNG and check it against the contract before declaring it done. The
goal is to catch the failure modes gpt-image-2 actually produces, not to rubber-stamp.

## Per-image checklist

Read the image and confirm each point. A "no" on any of the first four is a fail —
regenerate with a corrective note rather than shipping.

1. **Verbatim text** — every in-image string is one of the agreed English/numeric tokens,
   spelled correctly, and legible. No invented labels, no stray words from a different
   image's spec.
2. **No CJK / no jargon** — no Korean or other CJK glyphs anywhere; none of the avoided
   words (`JOIN`, `INNER`, `OUTER`, `SQL`, internal API/emitter names) appear.
3. **Landscape** — wide aspect, with breathing room for slide copy.
4. **Palette contract** — the two brand colors match the companion set; the warm accent
   appears on **exactly one** emphasized element (the loss / reveal / punchline), nowhere
   else.
5. **Style match** — flat line icons, no 3D/photorealism, no logos/watermarks; icon and
   stroke style consistent with the companion images.
6. **Reads at a glance** — the single intended punchline is obvious without explanation.

When a regeneration is needed, give codex a targeted corrective note naming what
specifically to change, rather than a full rewrite — this matches how runs self-correct
in practice.

## Korean consolidated report template

After the image(s) pass, report to the user in Korean. Keep it scannable.

```
## ◆ <묶음 이름> — 검증 결과

| 이미지 | 파일 | 판정 |
|---|---|---|
| <은유/역할> | <…-name.png> | 통과 / 재생성 N회 후 통과 |

**판정 근거 (이미지별)**: <핵심 문구 verbatim 렌더 ✓ / CJK·SQL 부재 ✓ / landscape ✓ / 팔레트 정합 ✓>

**시리즈 정렬**: <이 이미지가 동반 자산과 어떻게 한 세트로 읽히는지 한 줄>

**비고 (비치명적)**: <자기교정 재시도 횟수와 이유 / MCP 토큰 갱신 경고(invalid_grant) / --full-auto deprecation 등 — 이미지 생성에는 무관>
```

The non-fatal notes matter: codex runs routinely emit an `invalid_grant` auth-token
refresh warning on unrelated MCP servers and a `--full-auto` deprecation notice. Surface
them as harmless so the user isn't left wondering, but don't treat them as failures.

## Correction

The generation call is `--ephemeral`, so there is no session to resume. A correction is a
**fresh background `codex exec` run** with a corrective prompt (state exactly what to
change). Reuse the same `--cd` and filename so the corrected image overwrites its
predecessor in place and stays in the companion set.
