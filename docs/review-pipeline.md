# Review Pipeline

이 저장소의 PR 리뷰는 **스킬 기반 인터랙티브 흐름**으로 동작한다. 이전의 두 GitHub Actions 워크플로우(`claude-code-review.yml`, `claude-epistemic-review.yml`)는 제거되었고, 리뷰 로직은 패키징된 스킬로 이관되었다.

## 현재 구조

| 리뷰 종류 | 진입점 | 성격 |
|-----------|--------|------|
| 코드 리뷰 (correctness 버그, 단순화/재사용) | `/review-loop` (built-in `code-review` source) | 인터랙티브, verdict가 approve로 수렴할 때까지 fix를 적용하는 루프 |
| 인식론적 다관점 리뷰 (category theory / type theory / operational semantics + gap) | `/lens-review` | 1-pass 고정 렌즈 리뷰; 발견 사항을 통합 코멘트 1건으로 게시 |
| 코멘트 응답 | `/gh-address-comments` | PR에 게시된 리뷰 코멘트에 대응 |

- **코드 리뷰는 `/review-loop`로 충분히 커버**된다. 외부 플러그인(`pr-review-toolkit:review-pr`)에 의존하던 generic code-review 워크플로우는 대체 없이 제거되었다 — `/review-loop`의 built-in `code-review` source가 동일 범위를 인터랙티브하게 수행한다.
- **인식론적 리뷰**(이 프로젝트 고유 로직)는 `claude-epistemic-review.yml`에서 `/lens-review` 스킬로 이관되었다. `epistemic-cooperative/skills/lens-review/SKILL.md` 참조.

## `/lens-review` 파이프라인

`claude-epistemic-review.yml`이 하던 일을 스킬로 옮긴 것으로, 단계는 다음과 같다:

```
/lens-review [scope?]
  Phase 0  : scope 감지 (PR 번호 | 현재 브랜치 PR | 워킹 트리) + free-exit 고지 — SHA 핀닝 없음, 도구가 라이브로 fetch
  Phase 1  : diff 준비 — diff 라이브 fetch(gh pr diff {N} | git diff HEAD); 파일 fate(A/M/D/R)를 diff 헤더에서 판독 + diff 읽기 규약 명시
  Phase 2  : 고정 렌즈 리뷰 (격리 → 적대) — /frame이 렌즈 형성(Category Theory ∥ Type Theory ∥ OpSem) + /gap; substrate는 스킬이 직접 기술(/conduct 우회 아님)
              2a 격리 분석 — 각 렌즈가 서로를 보지 않고 독립 분석(independence-before-contamination)
              2b 적대적 교차검증 — 각 finding을 반박; 생존 → Phase 3, 패배 → Phase 4 통합 코멘트에 기재(relay drop w/ basis)
  Phase 3  : 방향 오류 가드(verify) — 리뷰 텍스트 vs diff 헤더 fate 교차 검증; Added인데 deleted로 서술 → 경고 augment (relay)
  Phase 4  : 코멘트 게시 — 모든 발견을 담은 통합 코멘트 1건(본문에 path:line 참조); substrate write → harness permission
```

### 설계 포인트

| 항목 | 선택 | 근거 |
|------|------|------|
| 파일 fate 판정 | diff 헤더(`new file mode` / `deleted file mode` / `rename from·to`)에서 직접 판독 | diff 방향 오독(Added를 deleted로 읽는 inversion)을 Phase 3에서 교차 검증하기 위한 authoritative source — SHA 핀닝 없이 라이브 diff만으로 충분 |
| 렌즈 패널 | 고정 (Category Theory / Type Theory / Operational Semantics + Gap) | 정의 시점에 고정; 런타임 파라미터 아님 |
| 관점 배열 | 격리 분석 → 적대적 교차검증; 스킬이 substrate를 직접 기술 | frame은 관점 형성만(object-supplier 유지), 적대적 격리 검증은 스킬 내부에 기록 — /conduct로 배열을 위임하지 않음. 병렬 관점의 plausible-but-unchallenged 약점을 단일 적대 패스로 차단 |
| confidence 임계 | ≥ 80% | 저신뢰 발견 사항 배제, trivial 변경(버전 범프 등)은 간략히 명시하고 skip |
| 코멘트 게시 | `gh api repos/{owner}/{repo}/issues/{N}/comments` (통합 코멘트 1건) | 외부·사람이 보는 GitHub mutation = substrate write → harness permission이 게이트 |
| Markdown body 전달 | heredoc → 임시 파일 → `gh api --input` / `jq --rawfile` | 백틱이 셸 command substitution을 유발하므로 double-quote 인자 직접 전달 금지 |

### API Endpoint 구분

| 용도 | Endpoint | 필수 필드 |
|------|----------|-----------|
| 통합 코멘트 | `issues/{number}/comments` | `body` |

### 게시 규율

- 모든 발견 사항을 통합 코멘트 1건에 모은다; 각 발견은 본문에 `path:line`을 참조해 리뷰어가 이동할 수 있게 한다.
- 렌즈 태그(`[Category Theory]` / `[Type Theory]` / `[OpSem]` / `[Gap: <type>]`)와 severity(Critical / Important / Suggestion)를 보존한다.
- 중복·근접 중복 발견 사항은 skip.

## 남아있는 워크플로우

리뷰 파이프라인과 무관한 다음 GitHub Actions 워크플로우는 그대로 유지된다:

- `release.yml` — 태그 푸시 시 CI 릴리스(`gh release create --draft`).
- `pages.yml` — 랜딩 페이지 배포.
