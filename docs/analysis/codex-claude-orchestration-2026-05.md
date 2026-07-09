# Codex-Claude Orchestration 조사 메모 (2026-05)

## 요약

2026년 5월 기준으로 Claude Code/Claude Opus 4.7과 Codex/GPT-5.5는 모두 1M급 긴 컨텍스트, compaction, skills/plugins/MCP, subagents, 원격/자동화 표면을 갖춘 코딩 에이전트 플랫폼으로 수렴하고 있다. 다만 강점의 방향은 다르다.

- Claude 쪽의 강점: Opus 4.7의 1M context와 server-side compaction, Claude Code의 성숙한 Remote Control/teleport/Slack/CI 표면, 넓은 Claude Code plugin/skill/MCP 생태계, subagent별 skill/MCP 스코핑.
- Codex 쪽의 강점: GPT-5.5의 1M context와 128K 출력, Codex app의 병렬 에이전트/worktree/리뷰 중심 UI, CLI/SDK/non-interactive mode, remote connections, AGENTS.md 기반 다중 툴 portability, OS sandbox/approval 중심 실행 제어.
- 커뮤니티 근거의 결론: "하나로 대체"보다 "역할 분리"가 더 강하게 관찰된다. 특히 Claude를 deep-context/planning/context hub로 두고 Codex를 실행/리뷰 worker로 쓰거나, Codex를 command center로 두되 Claude Code를 MCP/CLI/SDK로 호출하는 패턴이 모두 가능하다.

실무 권고는 **Codex-first orchestrator + Claude deep-context specialist**를 기본으로 두되, Claude의 plugin/skill/MCP 생태계를 잃지 않기 위해 Claude를 단순 모델 API가 아니라 **Claude Code runtime**으로 보존하는 것이다. 연결 방식은 세 가지가 현실적이다: Claude Code MCP server, `claude -p`/SDK subprocess, shared handoff artifacts.

## 공식 문서 근거

### Anthropic / Claude

1. Claude Opus 4.7 1M context와 compaction
   - Anthropic context window 문서는 Claude Mythos Preview, Claude Opus 4.7, Opus 4.6, Sonnet 4.6이 1M-token context window를 가진다고 설명한다. 또한 장기 대화/agentic workflow에는 server-side compaction이 기본 전략이며 Opus 4.7/4.6/Sonnet 4.6에서 beta로 제공된다고 한다.
   - URL: https://docs.anthropic.com/en/docs/build-with-claude/context-windows
   - 신뢰도: 높음. 공식 API 문서.
   - 한계: Claude Code 구독 UI의 실제 모델/계정별 context 제공 여부는 계정/플랜/릴리스 상태에 따라 달라질 수 있다. API capability와 제품 표면을 동일시하면 안 된다.

2. Claude Code의 MCP/plugin/remote control 표면
   - Claude Code overview는 터미널, IDE, desktop, browser, Slack/CI/CD, Remote Control, `claude --teleport`, `/desktop` handoff를 공식 표면으로 설명한다.
   - URL: https://docs.anthropic.com/en/docs/claude-code/overview
   - MCP 문서는 Claude Code가 MCP로 Google Drive/Jira/Slack/custom tooling에 연결될 수 있고, plugin이 MCP server를 번들링할 수 있으며, `claude mcp serve` 형태로 Claude Code 자체를 MCP server로 노출할 수 있음을 보여준다.
   - URL: https://docs.anthropic.com/en/docs/claude-code/mcp
   - 신뢰도: 높음.
   - 한계: "수백 개 외부 도구"라는 표현은 생태계 폭을 말하지만 특정 plugin의 안정성/보안/유지보수를 보장하지 않는다.

3. Claude Code subagents와 SDK
   - subagents 문서는 subagent별 `skills`, `mcpServers`, `permissionMode`, `maxTurns` 설정을 제공한다. skill은 startup context에 full content가 injected되고, MCP server도 agent scope로 제한할 수 있다.
   - URL: https://docs.anthropic.com/en/docs/claude-code/sub-agents
   - Agent SDK는 session resume, MCP status/reconnect/toggle, plugins, skills, hooks, checkpointing, cost tracking 등을 제공한다.
   - URL: https://docs.anthropic.com/en/docs/claude-code/sdk/sdk-python
   - 신뢰도: 높음.
   - 한계: subagent/plugin 조합은 강력하지만 context pollution과 비용 증가가 생길 수 있다. 필요한 skill/MCP만 preload해야 한다.

### OpenAI / Codex

1. GPT-5.5와 context
   - OpenAI model docs는 `gpt-5.5`의 context window를 1M, max output을 128K로 표시하고, tools로 functions/web search/file search/computer use를 listed한다.
   - URL: https://developers.openai.com/api/docs/models
   - GPT-5.5 guide는 장기 agent에는 compaction을 의도적으로 사용하고, 완료 작업/가정/ID/tool 결과/blocker/다음 목표를 보존하라고 권고한다.
   - URL: https://developers.openai.com/api/docs/guides/latest-model
   - 신뢰도: 높음.
   - 한계: ChatGPT/Codex 제품 플랜별 GPT-5.5 context는 API docs와 다를 수 있다. Help Center 일부는 ChatGPT Thinking context를 별도 수치로 제시한다.

2. Codex app/CLI/SDK/remote/non-interactive
   - Codex app 문서는 command center, 병렬 coding agents, reusable skills/automations, plugins, app/CLI/IDE/Web 표면을 설명한다.
   - URL: https://developers.openai.com/codex/app
   - Codex changelog는 2026-04-23 GPT-5.5 availability, 2026-05 remote/mobile host connection, plugin management, hooks before/after compaction, MCP elicitation/auth flow 등을 언급한다.
   - URL: https://developers.openai.com/codex/changelog
   - Codex SDK 문서는 local Codex agents를 programmatically control하는 TypeScript SDK를 제공한다고 설명한다.
   - URL: https://developers.openai.com/codex/sdk
   - Non-interactive mode는 `codex exec`, JSONL output, read-only 기본 sandbox, `--full-auto`, `--sandbox danger-full-access`, required MCP failure behavior를 설명한다.
   - URL: https://developers.openai.com/codex/noninteractive
   - Remote connections 문서는 Codex를 SSH/remote machine의 project와 연결하는 표면이다.
   - URL: https://developers.openai.com/codex/remote-connections
   - 신뢰도: 높음.
   - 한계: OpenAI 문서는 Codex가 Claude의 plugin marketplace를 직접 consume한다고 말하지 않는다. 보존하려면 bridge/handoff/runtime delegation이 필요하다.

3. Codex subagents
   - Codex subagents 문서는 Codex가 agent orchestration, spawn/routing/waiting/consolidation을 담당하고, 명시적으로 요청할 때만 subagent를 spawn한다고 설명한다. subagents는 parent sandbox/approval runtime overrides를 상속한다.
   - URL: https://developers.openai.com/codex/subagents
   - 신뢰도: 높음.
   - 한계: Claude Code subagent처럼 plugin-sourced MCP/skill 생태계와 동일한 폭을 갖는다는 뜻은 아니다.

## 커뮤니티 / GitHub / 블로그 근거

### GitHub 사례

1. Maestro: structured memory, handoffs, plan-approve-execute across Codex/Claude/Hermes
   - `maestro handoff`가 repo state와 task continuation으로 self-contained markdown brief를 만들고 Codex/Claude/Hermes run을 launch한다. task는 `.maestro/tasks/tasks.jsonl`, mission은 `.maestro/missions/`에 저장된다.
   - URL: https://github.com/ReinaMacCredy/maestro
   - 관련 프레임: shared artifact/spec handoff, Claude/Codex worker routing.
   - 신뢰도: 중간. 공개 repo의 실제 구현/문서 근거.
   - 한계: 프로젝트 maturity, 사용자 규모, 장기 운영 안정성은 별도 검증 필요.

2. Mercury: multi-agent GUI orchestrator with dual verify
   - README는 `dual-verify`를 "Parallel Claude Code deep-review + Codex code-audit"로 설명하고, `handoff`를 session-to-session handoff document + ready-to-paste prompt로 둔다.
   - URL: https://github.com/392fyc/Mercury
   - 관련 프레임: independent dual-review loop, shared handoff.
   - 신뢰도: 중간.
   - 한계: 특정 개인/팀 workflow일 수 있고, 일반화 가능성은 제한된다.

3. Luigi: Codex + Claude Code automated coding orchestrator
   - Telegram/UI controlled orchestrator로 Claude/Codex reviewer/executor를 구성하고, worktree lifecycle, carry-forward workspace, approval/rejection loop를 제공한다.
   - URL: https://github.com/RiccardoRomagnoli/luigi
   - 관련 프레임: independent review, multi-agent execution, remote control.
   - 신뢰도: 중간-낮음. 코드와 README는 있으나 commit 수/운영 사례가 제한적이다.

4. claude-code-settings codex-skill
   - Claude Code skill에서 Codex CLI를 non-interactive automation worker로 호출하는 `codex-skill`을 설명한다. "features/plans designed by Claude"를 Codex가 구현하는 구조다.
   - URL: https://github.com/feiskyer/claude-code-settings
   - 관련 프레임: Claude-first planning/context hub + Codex execution worker.
   - 신뢰도: 중간.
   - 한계: 개인 설정 repo 성격이 강하고, 모델명/설정은 시간이 지나며 쉽게 stale해진다.

5. Claude handoff tips
   - `HANDOFF.md`를 만들어 다음 fresh agent가 목표/진행/시도/실패/다음 단계를 읽고 이어가게 하는 방식이 설명된다.
   - URL: https://github.com/ykdojo/claude-code-tips
   - 관련 프레임: shared artifact/task.md/spec handoff.
   - 신뢰도: 중간.
   - 한계: Claude 중심 팁이지만 Codex/Claude 간 handoff에도 그대로 적용 가능한 패턴이다.

### Reddit / HN 사례

1. Reddit: Claude와 Codex를 "migration"보다 "load balancing"으로 병행
   - r/codex의 migration thread는 일부 사용자가 Claude와 Codex를 역할별/한도별로 나눠 쓰며, Codex는 backend/general coding, Claude는 frontend/design-heavy/abstract task에 유리하다는 경험담을 포함한다.
   - URL: https://www.reddit.com/r/codex/comments/1tao42q/did_anyone_here_moved_from_claude_to_codex/
   - 신뢰도: 낮음-중간. 실사용 경험이지만 익명/선택 편향이 크다.
   - 한계: Reddit 요약/댓글은 제품 버전, 플랜, 프롬프트 품질, 코드베이스 특성에 크게 좌우된다.

2. Reddit: context checkpoint / project guidance file
   - r/codex 비교 thread는 긴 thread가 느려질 때 "context checkpoint"를 만들거나 project guidance file을 둬 Codex가 프로젝트 navigation/standards를 알게 한다는 사례를 보여준다.
   - URL: https://www.reddit.com/r/codex/comments/1s1btfx/codex_vs_claude_code_vs_antigravity_whats_your/
   - 신뢰도: 낮음-중간.
   - 한계: 기술적으로는 handoff artifact와 유사하지만 자동화된 orchestration 증거는 아니다.

3. HN: compaction/context 경험은 엇갈림
   - HN의 Opus 1M context thread에는 "Codex compaction이 더 낫다"는 경험담과 "Opus가 실제 bug context에 더 유용하다"는 반대 경험담이 공존한다.
   - URL: https://news.ycombinator.com/item?id=47367129
   - 신뢰도: 낮음-중간.
   - 한계: 익명 경험담이고, Claude Code vs API, Codex CLI vs ChatGPT, 모델/플랜 차이가 섞여 있다.

4. HN: multi Codex/Claude orchestrator 사용 언급
   - HN 댓글에는 "some orchestrator of multiple Codex/Claude Codes"로 이동했다는 실사용 언급이 있다.
   - URL: https://news.ycombinator.com/item?id=47619752
   - 신뢰도: 낮음.
   - 한계: 구체적 구현/성과 근거가 없어서 방향성 신호 정도로만 사용해야 한다.

### 블로그 / 생태계 해설

1. Driver/Worker guide
   - Fountain City 글은 Codex와 Claude Code를 driver/worker topology로 연결하고, BEADS+Metaswarm, Archon, Citadel 같은 harness layer를 언급한다. shared context는 `CLAUDE.md`와 Codex skills/rules 쪽으로 별도 유지/번역해야 한다고 설명한다.
   - URL: https://fountaincity.tech/resources/blog/codex-claude-code-harness-together/
   - 신뢰도: 중간.
   - 한계: vendor/consulting blog 성격이며, claims 일부는 별도 프로젝트 검증이 필요하다.

2. 개인 비교: Claude runs agents, Codex improves agents
   - Jock.pl 글은 Claude Code를 long-running agent orchestration과 persistent integration에, Codex를 refactor/deep review/existing code improvement에 쓰는 workflow를 제안한다.
   - URL: https://thoughts.jock.pl/p/claude-code-vs-codex-real-comparison-2026
   - 신뢰도: 중간-낮음.
   - 한계: 개인 경험이며 GPT-5.3-Codex 기준이라 2026-05 GPT-5.5/Codex app 상태와 일부 차이가 있을 수 있다.

3. Claude plugin ecosystem breadth
   - Anthropic official/community plugin marketplace 관련 글과 GitHub는 Claude Code plugin이 skills, slash commands, agents, MCP servers, hooks를 묶는 생태계임을 보여준다.
   - URLs:
     - https://github.com/anthropics/claude-code
     - https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json
     - https://github.com/anthropics/knowledge-work-plugins
   - 신뢰도: 공식 GitHub는 높음, 서드파티 해설은 중간.
   - 한계: installable count와 quality는 다르다. marketplace index 수는 신뢰도 지표가 아니다.

4. Codex plugin ecosystem growth
   - OpenAI Academy는 Codex plugins/skills를 설명하고, Codex docs/changelog는 curated plugin directory와 plugin management를 공식화한다. New Stack은 launch 당시 20+ plugins와 Figma/Linear/Slack/Gmail/Hugging Face 등 third-party service plugin을 언급한다.
   - URLs:
     - https://openai.com/academy/codex-plugins-and-skills/
     - https://developers.openai.com/codex/changelog
     - https://thenewstack.io/openais-codex-gets-plugins/
   - 신뢰도: OpenAI 공식은 높음, New Stack은 중간.
   - 한계: Claude 생태계만큼의 breadth/legacy install base가 있는지는 아직 불확실하다.

## 네 가지 프레임 검증

### (1) Codex-first orchestrator + Claude as deep-context specialist

판정: **가능하고 유망하지만, Claude를 API model이 아니라 Claude Code runtime으로 연결해야 생태계를 보존한다.**

근거:
- Codex app/SDK/subagents/non-interactive mode는 orchestration command center로 쓰기 좋다.
- Claude Code는 `claude mcp serve`, SDK, `claude -p`, Remote Control, plugin-provided MCP/skills/subagents를 가진다.
- Maestro/Luigi/Mercury는 Codex/Claude handoff 또는 dual-worker orchestration을 공개적으로 구현한다.

실행 패턴:
- Codex main thread가 task/spec/acceptance criteria를 유지한다.
- Claude specialist는 Claude Code MCP server 또는 `claude -p`/SDK subprocess로 호출한다.
- Claude에게는 "large-codebase context synthesis, plugin-rich research, design-heavy planning, deep semantic review"를 맡긴다.
- 결과는 `task.md`, `handoff.md`, PR comment, JSONL summary로 Codex에 반환한다.

보존되는 Claude 자산:
- Claude Code plugins/skills/MCP server configs.
- Claude subagent별 skill/MCP scoping.
- Claude Remote Control/Slack/CI integrations.

리스크:
- Codex가 Claude 내부 context를 직접 볼 수는 없다. 반드시 structured output/handoff로 압축해야 한다.
- Claude plugin 실행은 별도 trust boundary다. Codex sandbox와 Claude permission model을 혼동하면 안 된다.
- 비용/토큰 사용량이 쉽게 두 배가 된다.

신뢰도: 중간. 공식 기능은 높지만 "Codex-first + Claude specialist" 자체는 community/GitHub architecture inference다.

### (2) Claude-first planning/context hub + Codex execution/review worker

판정: **현재 커뮤니티 근거가 가장 직접적이다.**

근거:
- `claude-code-settings`의 `codex-skill`은 Claude가 설계한 feature/plan을 Codex non-interactive automation으로 실행하는 구조를 명시한다.
- 개인 블로그/Reddit은 Claude를 planning/agent orchestration hub로, Codex를 refactor/review/execution worker로 쓰는 경험담을 제시한다.
- Claude Code의 plugin/MCP/subagent/Remote Control 생태계를 hub로 보존하기 쉽다.

실행 패턴:
- Claude가 plugin-rich planning/context gathering을 수행한다.
- Codex는 read-only review, sandboxed implementation, isolated worktree candidate generation, code audit를 담당한다.
- Claude가 Codex 결과를 다시 읽고 plan/acceptance criteria와 reconcile한다.

리스크:
- Codex app의 강점인 app-level command center와 multi-agent UI를 충분히 활용하지 못할 수 있다.
- Claude context hub가 커질수록 compaction risk와 plugin context pollution이 생긴다.

신뢰도: 중간-높음. 공식 기능 + 직접 GitHub skill 사례가 있다.

### (3) shared artifact/task.md/spec handoff

판정: **가장 견고하고 도구 독립적인 공통분모다.**

근거:
- Maestro는 self-contained markdown handoff와 repo-tracked task JSONL/mission artifacts를 사용한다.
- Claude Code tips는 `HANDOFF.md`에 목표/진행/시도/실패/다음 단계를 저장하고 fresh agent가 이어받게 하는 방식을 권한다.
- Reddit 사례도 "context checkpoint"나 project guidance file로 긴 context를 외부화한다.

실행 패턴:
- 최소 artifact set:
  - `task.md`: objective, constraints, non-goals, acceptance criteria.
  - `evidence.md`: URLs, commands run, test outputs, unresolved claims.
  - `handoff.md`: current state, completed actions, blockers, next prompt.
  - optional `review.md`: Claude/Codex independent verdicts and reconciliation.

리스크:
- artifact 품질이 낮으면 두 모델 모두 잘못된 상태를 재사용한다.
- handoff가 stale해지는 순간 "공유 컨텍스트"가 아니라 "공유 오해"가 된다.

신뢰도: 높음. 공식 compaction guidance와 community/GitHub patterns가 같은 방향이다.

### (4) independent dual-review loop

판정: **작동 사례가 있고, 고위험 변경의 검증 루프로 적합하다.**

근거:
- Mercury의 `dual-verify`는 "Parallel Claude Code deep-review + Codex code-audit"를 명시한다.
- Luigi는 multiple reviewer/executor와 winner/approval/rejection loop를 제공한다.
- 개인 비교 글은 Codex를 Claude-driven work의 deep review/refactor에 쓰는 패턴을 제시한다.

실행 패턴:
- 동일 diff/spec를 Claude와 Codex에 독립 입력한다.
- 서로의 결과를 먼저 보여주지 않는다.
- aggregation step에서 overlap findings, contradictory findings, model-specific blind spots를 분류한다.
- 최종 판정은 tests/static checks/actual runtime evidence로 닫는다.

리스크:
- 두 모델이 같은 잘못된 assumption을 공유하면 false confidence가 생긴다.
- 리뷰 비용과 wall-clock time이 늘어난다.
- "두 모델 모두 OK"는 formal proof가 아니다. 테스트/타입/런타임 검증이 필요하다.

신뢰도: 중간. 공개 repo 사례는 있지만 일반 성능 평가는 별도 필요하다.

## 권장 아키텍처

기본형:

```text
Codex app / CLI main thread
  -> owns queue, task.md, worktrees, tests, final diff
  -> invokes Claude Code runtime for deep-context / plugin-rich specialist tasks
  -> invokes Codex subagents for parallel implementation/review inside Codex sandbox
  -> reconciles all outputs into evidence.md and final PR
```

Claude 보존 레이어:

```text
Claude Code runtime
  -> CLAUDE.md / .claude/skills / .claude/plugins / MCP servers / subagents
  -> exposed to Codex via one of:
     1. claude mcp serve
     2. claude -p subprocess
     3. Claude Agent SDK wrapper
     4. handoff.md manual/automated artifact
```

운영 규칙:

1. Claude ecosystem을 Codex plugin으로 무리하게 포팅하지 말고, 먼저 Claude Code runtime을 그대로 호출한다.
2. 공통 컨텍스트는 `task.md`/`handoff.md`/`evidence.md`로 외부화한다.
3. Codex와 Claude의 permission/sandbox boundary를 분리 기록한다.
4. MCP/plugin은 "항상 켜기"가 아니라 task-local로 scope한다.
5. dual-review는 고위험 변경, architectural migration, security-sensitive diff에만 기본값으로 둔다.

## 결론

"Codex를 오케스트레이터로 삼으면서 Claude의 1M context와 plugin 생태계를 보존"하는 가장 안전한 방법은 **Claude 기능을 Codex 내부로 복제하는 것**이 아니라 **Claude Code runtime을 specialist worker로 유지하는 것**이다. Codex는 worktree/queue/sandbox/review/SDK orchestration을 담당하고, Claude는 deep context synthesis, plugin-rich research, MCP-heavy enterprise context, design/planning/review를 담당한다. 두 시스템 사이의 durable contract는 shared artifact와 independent review evidence여야 한다.

가장 낮은 리스크의 시작점은 다음 순서다:

1. `task.md` + `handoff.md` 템플릿부터 만든다.
2. Claude-first 또는 Codex-first 중 현재 팀의 주 UI를 하나 정한다.
3. 다른 쪽은 `read-only review`와 `deep-context specialist`로만 붙인다.
4. 성공하면 Claude Code MCP/SDK 또는 Codex SDK로 자동화한다.

