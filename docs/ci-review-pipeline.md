# CI Review Pipeline

`claude-code-action` 기반 PR 리뷰 자동화 아키텍처.

## 문제

`claude-code-action@v1`의 `pr-review-toolkit` 플러그인은 **advisory-only** — 세션 내 텍스트 리뷰만 출력하고 PR 코멘트를 게시하지 않는다. Action 내부의 `post-buffered-inline-comments.ts`는 `create_inline_comment` MCP 도구 호출을 기대하지만, 플러그인이 이 도구를 호출하지 않아 버퍼가 항상 비어있다.

### Silent Failure 구조

```
Claude review (Sonnet) → 텍스트 출력 (type: "text")
                       → end_turn (정상 종료)
                       → exit 0 (success)
post-buffered-inline-comments.ts → 빈 버퍼 → "No buffered inline comments"
                                 → PR 코멘트 0건
```

CI 관점에서 모든 step이 success — failure signal 없음.

## 해결: 2-Stage Pipeline

```
┌─────────────────────────────────────────────────────┐
│ Stage 1: Review (Sonnet)                            │
│   claude-code-action + pr-review-toolkit            │
│   → execution_file (JSON array of SDKMessage)       │
├─────────────────────────────────────────────────────┤
│ Stage 2: Extract (jq)                               │
│   jq '[.[] | select(.type == "assistant") | ...]'   │
│   → /tmp/review-output.txt                          │
├─────────────────────────────────────────────────────┤
│ Stage 3: Post (Haiku)                               │
│   claude-code-action + Haiku                        │
│   리뷰 텍스트를 읽고 gh api로 inline comment 게시   │
└─────────────────────────────────────────────────────┘
```

### 설계 결정

| 결정 | 선택 | 대안 (기각) | 근거 |
|------|------|-------------|------|
| 코멘트 게시 방식 | 후처리 step (Haiku) | MCP 도구 지시, `--json-schema`, 플러그인 교체 | 리뷰 로직 수정 불필요, 양쪽 워크플로우에 일관 적용 |
| 파싱 방식 | LLM (Haiku) 자유 파싱 | jq/regex 텍스트 파싱, JSON schema 강제 | 텍스트 파싱 brittle, schema 제약으로 리뷰 품질 저하 |
| 게시 도구 | `gh api` via Bash | `create_inline_comment` MCP 도구 | MCP 도구는 `classify_inline_comments` 분류 의존성, `confirmed` 파라미터 복잡성 |
| Stage 3 모델 | `claude-haiku-4-5` | Sonnet (비용 과다) | 파싱+게시만 수행, ~$0.05/run |

### 권한 설정

Stage 3 (Haiku)의 `permissionMode: default`에서 Bash 호출이 denied되는 문제:

```yaml
settings: '{"permissions":{"allow":["Bash(gh api:*)","Bash(cat:*)","Read","Write"]}}'
```

- `Bash(gh api:*)`: 코멘트 게시 (`gh api repos/.../pulls/.../comments`)
- `Bash(cat:*)`: 리뷰 텍스트 파일 읽기
- `Read`: 파일 읽기 도구
- `Write`: 특수문자 포함 코멘트 body를 임시 파일로 작성

### API Endpoint 구분

| 용도 | Endpoint | 필수 필드 |
|------|----------|-----------|
| Inline review comment | `pulls/{number}/comments` | `body`, `path`, `commit_id`, `line` |
| Summary comment | `issues/{number}/comments` | `body` |

## 제약사항

### Workflow Validation

`claude-code-action`의 OIDC 토큰 교환은 PR 브랜치의 워크플로우 파일이 main과 동일해야 한다. 워크플로우 변경 시:

1. Feature branch에서 커밋
2. Main에 cherry-pick + push
3. 이후 PR에서 트리거

PR 브랜치에서만 변경하면 `401 Unauthorized - Workflow validation failed`.

### Buffered Inline Comments

Action 내부의 `create_inline_comment` MCP 도구는 3-state:
- `confirmed: true` → 즉시 게시
- `confirmed: undefined` → 버퍼 → Haiku가 real/probe 분류 후 게시
- `confirmed: false` → 버퍼 → 게시 안 함

현재 파이프라인은 이 메커니즘을 우회하고 `gh api`로 직접 게시한다.

### execution_file 형식

`$RUNNER_TEMP/claude-execution-output.json` — `SDKMessage[]` JSON 배열:

```typescript
type SDKMessage =
  | { type: "system", subtype: "init", session_id, tools, mcp_servers }
  | { type: "assistant", message: { role: "assistant", content: ContentBlock[] } }
  | { type: "user", message: { role: "user", content: ToolResultBlock[] } }
  | { type: "result", subtype: "success" | "error", total_cost_usd, duration_ms, num_turns }
```

Assistant text 추출:
```bash
jq -r '[.[] | select(.type == "assistant") | .message.content[]
  | select(.type == "text") | .text] | join("\n\n---\n\n")' "$EXECUTION_FILE"
```

## 진단

`show_full_output: true`로 전체 Claude Code 실행 트레이스를 Actions 로그에 출력. 안정화 후 `false`로 전환 (코드 내용 공개 로그 노출 위험). `execution_file`은 `show_full_output` 설정과 독립적으로 항상 생성되므로, `false` 전환 후에도 파이프라인은 정상 동작한다.

핵심 진단 지표:
- `permission_denials_count`: 0이 아니면 권한 설정 확인
- `num_turns`: Stage 1에서 1이면 도구 호출 없이 텍스트만 출력한 것
- `No buffered inline comments`: MCP 도구 미호출 확인
