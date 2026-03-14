---
name: onboard
description: "Quick protocol recommendation from recent sessions, or quest-based learning through scenario, trial, and quiz."
---

# Onboard Skill

Start with a quick recommendation based on recent sessions, then optionally continue to guided learning — so users experience value first, learn second.

## When to Use

Invoke this skill when:
- A new user wants to discover which epistemic protocols fit their workflow
- A user wants to experience protocols through guided practice
- Re-onboarding after new protocols are added or workflow changes

Skip when:
- User wants analytical report with evidence and HTML artifact (use `/report`)
- User already knows which protocol to use (direct invocation)
- Quick single-protocol question (answer directly)

## Workflow Overview

```
Quick Proof:    ENTRY → QUICKSCAN → PICK-1 → EVIDENCE → TRIAL → INSIGHT → NEXT
Targeted:       ENTRY → QUICKSCAN → MAP → SCENARIO → TRIAL → QUIZ → GUIDE
Targeted + std: ENTRY → SCENARIO → TRIAL → QUIZ → GUIDE
```

| Phase | Owner | Tool | Purpose |
|-------|-------|------|---------|
| 0. Entry | Main | AskUserQuestion | Path selection: quick/targeted |
| 1. Quick Scan | Main | Glob, Read | User Context Profile extraction |
| 2a. Pick-1 | Main | — | Quick path: select 1 recommendation |
| 2b. Evidence | Main | — | Quick path: show 1 evidence card |
| 2. Map | Main | — | Targeted path: Profile → Protocol matching |
| 3. Scenario | Main | AskUserQuestion | Targeted path: context-personalized intervention point |
| 4. Trial | Main | AskUserQuestion | Real protocol execution (quick: mini trial, targeted: full trial) |
| 4→Q. Insight | Main | — | Quick path: post-trial insight card |
| 4→Q. Next | Main | AskUserQuestion | Quick path: simplified navigation |
| 4→5 LOOP | Main | AskUserQuestion | Targeted path: post-trial navigation |
| 5. Quiz | Main | AskUserQuestion | Targeted path: Socratic protocol recognition quiz |
| 6. Guide | Main | AskUserQuestion | Targeted path: summary + /report CTA |

## Data Sources

Compact mapping for inline use. For full Primary/Secondary/Tertiary tables with detection methods and rationale, refer to `/report` SKILL.md.

| Protocol | Cluster | When to Use | Key Patterns |
|----------|---------|-------------|-------------|
| Hermeneia `/clarify` | Planning | AI keeps misunderstanding your intent | Same file 3+ edits (same intent), `misunderstood_request` friction |
| Telos `/goal` | Planning | You have a desire but no clear goal | Vague first prompts ("improve", "optimize", "ideas for"), `wrong_approach` friction |
| Aitesis `/inquire` | Planning | AI is about to execute without enough context | `context_loss` friction |
| Prothesis `/frame` | Analysis | Unsure which analytical perspective to use | Exploration ratio 3:1+ (Read+Grep+Glob vs Edit+Write) |
| Analogia `/ground` | Analysis | Checking if abstract advice fits your situation | Abstract pattern application without domain validation |
| Syneidesis `/gap` | Decision | Right before committing, checking for blind spots | Same file 3+ edits (different concerns), `excessive_changes` friction |
| Prosoche `/attend` | Execution | Controlling risky actions step by step | Bash deploy/push/apply keywords, `wrong_file_edited` friction |
| Epharmoge `/contextualize` | Verification | Output is correct but doesn't fit the context | Post-execution environment mismatch |
| Horismos `/bound` | Cross-cutting | Deciding what to delegate to AI | Boundary probe, domain classification, BoundaryMap |
| Katalepsis `/grasp` | Cross-cutting | You approved AI work but didn't fully understand it | Verification keywords in firstPrompt ("explain", "what did you do") |

## Phase Execution

### Phase 0: Entry (Path Selection)

Do NOT present the full protocol catalog upfront. Start with a concise welcome and path selection.

**AskUserQuestion #1**:
- Text: "어떻게 시작할까요?"
- Options:
  - "Quick recommendation — 최근 작업 기반으로 지금 가장 도움될 1가지를 보여주세요"
  - "Targeted learning — 특정 프로토콜을 골라서 배워볼게요"
  - "Browse all — 먼저 전체 프로토콜을 보고 싶어요"

**If Quick recommendation**: set `path = quick`, proceed to Phase 1.

**If Browse all**: Present the protocol catalog (check installation status via Glob `~/.claude/plugins/cache/epistemic-protocols/*/`, then render the 10 protocols from Data Sources as a numbered list grouped by Cluster with name + "When to Use" + installation badge). After catalog, call AskUserQuestion:
- Text: "어떻게 진행할까요?"
- Options:
  - "Quick recommendation — 추천 1개를 먼저 볼게요"
  - "Targeted learning — 위 목록에서 골라 배울게요 (Other에 이름 입력)"

Then proceed based on selection.

**If Targeted + Other contains protocol name**: proceed directly to session source question.

**If Targeted + no protocol specified → AskUserQuestion #2**:
- Text: "Which protocol? (type name or number in Other)"
- Options:
  - "Pre-execution (Planning) — /clarify, /goal, /bound, /inquire"
  - "Analysis/Decision — /frame, /ground, /gap"
  - "Execution/Verification/Understanding — /attend, /contextualize, /grasp"

**AskUserQuestion #3** (Targeted only, session source):
- Text: "Where should examples come from?"
- Options:
  - "Personalize with my recent sessions"
  - "Use standard examples (no session needed)"

State after Phase 0:
- `path`: quick | targeted
- `target_protocol`: (targeted only) selected protocol name
- `session_source`: (targeted only) scan | standard — Quick path always runs Quick Scan

**Skip rule**: If targeted + standard → skip Phases 1-2, jump to Phase 3 with preset scenarios from `references/scenarios.md`.

### Phase 1: Quick Scan (User Context Profile) — Inline

Build a User Context Profile from recent session metadata. Runs inline with Glob + Read (no subagent delegation). Both Quick and Targeted paths share this phase.

**Step 1: Collect session metadata**

Glob `~/.claude/projects/*/sessions-index.json` (exclude directories containing `-worktrees-`). Read the 2-3 most recently modified indexes. For each, parse `entries` and extract the 5 most recent entries' `firstPrompt` and `summary` fields.

**Step 2: Infer User Context Profile**

From collected metadata, infer:
- **Work domains**: What areas the user works in (e.g., API development, infrastructure, data pipeline)
- **Conversation patterns**: Request clarity level, incremental vs. batch requests, question types (how/why/what)
- **Task types**: Ratio of feature development, debugging, refactoring, documentation

If no `sessions-index.json` files found: Quick path proceeds to Pick-1 with fallback (`/goal`); Targeted path falls back to Starter Trio.

**Output for Phase 2**: User Context Profile (work domains, conversation patterns, task types). Quick Scan infers user context for protocol matching and scenario personalization — behavioral pattern extraction and session diagnostics belong in `/report`.

### Phase 2a: Pick-1 (Quick Path — Single Recommendation)

**Quick path only.** Select exactly 1 protocol recommendation from the auto-recommend pool.

**Auto-recommend pool**: `/goal` (Telos), `/gap` (Syneidesis), `/frame` (Prothesis). These three are chosen because users can quickly experience their value. Protocols like `/clarify` and `/grasp` are user-initiated by nature and should not be proactively suggested in the first encounter.

**Recommendation rules** (applied to Quick Scan Profile):

| Protocol | Signal patterns | Priority |
|----------|----------------|----------|
| `/goal` | Vague first prompts ("improve", "optimize", "ideas for", "make it better", "help me plan"); desire without success criteria | Highest (also fallback) |
| `/gap` | Multiple revisions on same topic in summary; finalization language ("wrap up", "ready", "finalize", "ship", "merge") | Medium |
| `/frame` | Exploration/comparison language ("approach", "options", "tradeoffs", "compare", "architecture", "which way") | Medium |

**Decision logic**:
1. Score each protocol by signal match count from `firstPrompt` and `summary` fields
2. Select the single strongest match
3. Tie-break: `/goal` > `/gap` > `/frame`
4. **Fallback**: If no signals detected (no sessions, sparse metadata), recommend `/goal`

**Output**: Present recommendation as a single sentence. Do NOT present multiple recommendations or a ranked list.

Format:
```
지금은 /goal이 가장 먼저 효과를 낼 가능성이 큽니다.
```

### Phase 2b: Evidence (Quick Path — Evidence Card)

**Quick path only.** Present exactly 1 evidence card explaining why this recommendation was made.

**Evidence format** (maximum 2 lines):
```
Why this recommendation
- [Observed pattern from sessions — 1 sentence]
- [Expected benefit — 1 sentence]
```

**Per-protocol evidence templates**:

For `/goal`:
```
Why this recommendation
- 최근 요청에서 "무엇이 성공인지"보다 "어떻게 개선할지"가 먼저 등장하는 패턴이 보였습니다.
- 성공 기준을 먼저 정하면 재작업을 줄이기 쉽습니다.
```

For `/gap`:
```
Why this recommendation
- 최근 세션에서 같은 주제에 대한 반복 수정이나 마감 정황이 보였습니다.
- 실행 직전에 놓친 부분을 체크하면 후회를 줄일 수 있습니다.
```

For `/frame`:
```
Why this recommendation
- 최근 요청에서 비교/탐색/방향 선택에 관한 질문이 보였습니다.
- 분석 렌즈를 먼저 정하면 방향 없는 탐색을 줄일 수 있습니다.
```

**No-session fallback evidence** (when `/goal` selected by fallback):
```
Why this recommendation
- 세션 데이터가 충분하지 않아 가장 보편적으로 효과가 큰 프로토콜을 추천합니다.
- 성공 기준을 먼저 정하면 방향을 잡고 시작할 수 있습니다.
```

**Rules**:
- Evidence is maximum 2 lines. Never expand into a report-style analysis.
- Do not show confidence scores or numbers.
- Do not quote session content verbatim.

After presenting evidence, call AskUserQuestion:
- Text: "바로 1분짜리 미니 체험을 해볼까요?"
- Options:
  - "지금 체험하기"
  - "왜 이 추천인지 더 보기"
  - "다른 추천 보기"
  - "전체 학습으로 가기"

Branch: 지금 체험하기 → Phase 4 (quick trial), 왜 이 추천인지 더 보기 → show Data Sources row for the recommended protocol then re-ask, 다른 추천 보기 → pick next from pool and re-present from Phase 2a, 전체 학습으로 가기 → set `path = targeted` and go to Phase 0 targeted flow.

### Phase 2: Map (Targeted Path — Protocol Matching)

**Targeted path only.** Apply User Context Profile to match protocols to the user's context.

1. Match Profile against the compact mapping table (Data Sources section). Select 2-3 protocols most relevant to the user's work domains and conversation patterns, defaulting to Starter Trio.
2. **Targeted sub-path**: Filter to target protocol, use Profile for scenario personalization. Note related protocols from the compact mapping table.
3. **Fallback**: If Profile quality is insufficient (no sessions, sparse metadata) → **Starter Trio**: Hermeneia `/clarify` (Planning — expression fix), Telos `/goal` (Planning — goal shaping), Syneidesis `/gap` (Decision — blind spot audit). Proceed immediately without blocking the onboarding flow.

For detailed mapping logic (Primary/Secondary/Tertiary tables, session diagnostics, anti-pattern detection), refer to `/report` SKILL.md.

### Phase 3: Scenario (Targeted Path — Intervention Point)

**Targeted path only.** Present a concrete scenario showing where the protocol would have helped.

**Scenario construction** (2-tier fallback):
- **Tier 1** (User Context Profile available): Generate a hypothetical scenario grounded in the user's work context (domains, task types, conversation patterns from Quick Scan). Personalize standard scenarios from `references/scenarios.md` using Profile data.
- **Tier 2** (no data / Starter Trio fallback): Use preset scenarios directly from `references/scenarios.md`.

Present scenarios for each of the top 2-3 protocols sequentially.

**Scenario format**:

```
Scenario: /X (Protocol Name)

[Situation]: [Concrete situation grounded in user's work context — or preset from scenarios.md]

[Intervention]: If you had called /X at this point:
- [what the protocol would have done — step 1]
- [step 2]
Expected outcome: [e.g., reduced rework, clearer direction]
```

**Clarity rule**: Scenarios must present **clear-cut** protocol fits where the mapping is unambiguous. If a situation could plausibly map to multiple protocols (e.g., "exploration" could be `/goal` or `/frame`), do NOT use it as a scenario — reserve it for Phase 5 quiz material instead. The scenario phase builds confidence through recognition; the quiz phase builds discrimination through ambiguity.

**Anti-pattern**: Scenarios must be self-contained (situation + intervention) with unambiguous protocol fit. Ambiguous patterns belong in Phase 5 quiz.

Present each scenario as regular text output (Tier 1/2 format above). Then call AskUserQuestion for navigation only:

**AskUserQuestion** (per scenario):
- Text: "What would you like to do?"
- Options:
  - "Try it — let me practice this protocol"
  - "Show another example"
  - "Skip to quiz"

### Phase 4: Trial (Protocol Execution)

Guide the user through a real, abbreviated protocol experience.

#### Quick Path Trial

**Mini practice prompts** (scoped for 2-3 exchanges maximum). Per-protocol prompts:

For `/goal`:
> "데이터 파이프라인을 개선하고 싶다" — 이 요청으로 시작해보세요. `/goal`을 호출하면 성공 기준을 1-2회 왕복으로 잡아봅니다.

For `/gap`:
> "배포 직전인데 놓친 게 없는지 확인하고 싶다" — 이 상황으로 시작해보세요. `/gap`을 호출하면 blind spot audit을 짧게 체험합니다.

For `/frame`:
> "이 문제를 어떤 관점으로 봐야 할지 모르겠다" — 이 질문으로 시작해보세요. `/frame`을 호출하면 분석 렌즈 제시를 체험합니다.

Present the mini prompt as text, then call AskUserQuestion:
- Text: "위 상황으로 미니 체험을 시작할까요? 직접 상황을 정해도 됩니다."
- Options:
  - "이 상황으로 시작 — /X 호출"
  - "내 상황으로 시작 (Other에 입력)"

**Execution**: The user invokes the actual protocol (e.g., type `/goal`). The protocol runs in the same session with the mini prompt as context. Trial ends when the invoked protocol reaches its natural termination (convergence or user Esc). After protocol termination, proceed to **Quick Post-Trial** below.

**Quick Post-Trial Insight**:

Present a brief insight card (3 lines max):

```
Quick insight
- 방금 체험한 것은 해답 생성보다 방향 정렬에 가까운 프로토콜입니다.
- 이런 순간에 먼저 쓰면 재작업을 줄이기 쉽습니다.
```

Per-protocol insight variants:

For `/goal`:
```
Quick insight
- 방금 체험한 것은 "무엇을 만들까"보다 "무엇이 성공인가"를 먼저 정하는 프로토콜입니다.
- 성공 기준이 먼저 있으면 방향 없는 반복을 줄일 수 있습니다.
```

For `/gap`:
```
Quick insight
- 방금 체험한 것은 실행 직전에 놓친 부분을 체크하는 프로토콜입니다.
- 결정 직전에 한 번 돌리면 "아차" 순간을 줄일 수 있습니다.
```

For `/frame`:
```
Quick insight
- 방금 체험한 것은 여러 관점 중 어떤 렌즈로 볼지 먼저 정하는 프로토콜입니다.
- 분석 렌즈를 먼저 골라두면 방향 없는 탐색을 줄일 수 있습니다.
```

**Quick Post-Trial Navigation**:

Call AskUserQuestion:
- Text: "체험 완료! 다음은?"
- Options:
  - "오늘은 여기까지"
  - "예시 하나 더 보기"
  - "전체 온보딩 계속하기"
  - "/report로 더 자세히 보기"

Branch: 오늘은 여기까지 → end session with brief closing, 예시 하나 더 보기 → pick next protocol from pool and restart from Phase 2a, 전체 온보딩 계속하기 → set `path = targeted` and go to Phase 2 MAP with Quick Scan results, /report로 더 자세히 보기 → end with `/report` CTA.

#### Targeted Path Trial

"Try it" selection from Phase 3 already signals intent — enter trial directly without additional confirmation.

**Mini practice prompts** (scoped for 2-3 exchanges): Use the **Trial prompt** field from `references/scenarios.md` for the target protocol. Present the trial guidance as regular text output.

**Execution**: Prompt the user to invoke the actual protocol (e.g., type `/clarify`). The protocol runs in the same session with the mini prompt as context. Trial ends when the invoked protocol reaches its natural termination (convergence or user Esc). After protocol termination, present Post-Trial Insight and LOOP.

Offer trial for the top-recommended protocol first. If user completes it, optionally offer trial for the second recommendation.

**Post-Trial Insight** (presented after trial completion):

After each trial, present a brief insight card sourced from the **Philosophy** field in `references/scenarios.md`. Structure:

```
Protocol Insight: /X (Greek name)

[Core principle — one sentence]
[Workflow position — where this protocol sits and why]
[Game feel — the experiential pattern you just went through]
```

**Post-Trial LOOP**:

After the Post-Trial Insight, call AskUserQuestion:
- Text: "Trial complete! Where to next?"
- Options:
  - "Quiz — test my understanding"
  - "Another scenario — see more examples"
  - "Try a different protocol"
  - "Guide — see my learning summary"

Branch: Quiz → Phase 5, Another scenario → Phase 3, Different protocol → Phase 3 with next MAP protocol or Phase 0 with cached MAP, Guide → Phase 6.

### Phase 5: Quiz (Socratic Verification)

Test protocol recognition through situation-based questions. Question format differs by path.

**Question sourcing** (in priority order):
1. **Ambiguous scenarios from Phase 3 filtering** — situations that were too ambiguous for scenarios are ideal quiz material (e.g., "exploration" that could be `/goal` or `/frame`)
2. Protocols from TRIAL + MAP results (personalized)
3. Profile-personalized variants of preset scenarios (if User Context Profile available)
4. Preset scenarios from `references/scenarios.md`

#### Targeted Path

**Type 1 — Binary recognition** (2-3 questions):

Call AskUserQuestion for each:
- Text: Present a situation (2-3 sentences), ask "Is this a `/X` situation?"
- Options: "Yes" / "No"
- Mix: 1-2 true positives + 1 true negative (situation that fits a neighbor protocol)
- On "No" answer for a true negative: briefly introduce the correct protocol as a natural distinction point

**Type 2 — Reverse recognition** (1 question):

Call AskUserQuestion:
- Text: Present 3 short scenarios numbered 1-3, ask "Which of these are `/X` situations?"
- Options: "1 and 2" / "2 and 3" / "1 and 3" / "All three"

**Type 3 — Design thinking** (1 question):

Call AskUserQuestion:
- Text: Present a situation, ask "How would you formulate your request to AI to avoid this problem?"
- Options: "Show me a hint" / "Show me a model answer"
- The user's primary input channel is Other (free text). Evaluate based on whether the response demonstrates protocol awareness.

#### General Path

**Type 1 — Situation recognition** (3-4 questions):

Call AskUserQuestion for each:
- Text: Present a situation (2-3 sentences), ask "Which protocol fits?"
- Options: 4 protocol choices (correct answer + 3 plausible distractors)

**Type 2 — Design thinking** (1 question):

Same format as Targeted Path Type 3.

#### Feedback (both paths)

Immediate feedback after each question:
- **Correct**: Reinforce with the core principle + why the distinction matters. "Correct — `/gap` surfaces blind spots at *decision points* (what you haven't considered), while `/attend` classifies *execution risks* (what could go wrong when you act). `/gap` audits before action (decision quality), `/attend` gates during action (execution safety)."
- **Incorrect** (reasoning inquiry → targeted correction):
  1. **Reasoning inquiry**: Call AskUserQuestion with 2-3 reasoning hypotheses inferred from the user's wrong answer (context-specific, not templates). Do not reveal the correct answer. "Other" always available.
  2. **Targeted correction**: Using the user's stated reasoning, explain the distinction through the design axis that separates the confused pair. Directly address the reasoning — e.g., "You mentioned timing — that's the right axis. The key difference is *direction*: `/inquire` catches missing context *before* execution (User→AI), while `/contextualize` checks context fit *after* (AI→User)."
  3. **Resume**: Proceed to next question.

  **Reasoning inquiry cap**: Apply reasoning inquiry for the first 2 incorrect answers per quiz session. Subsequent incorrect answers receive direct targeted correction (step 2 only) without the reasoning inquiry step.

**Distinction depth**: Quiz feedback should go beyond "A, not B" to explain the *design dimension* that separates confused pairs. Reference the distractor pairs from Quiz Design section. The goal is that even wrong answers teach — the user leaves understanding *why* two protocols that sound similar serve different purposes.

### Phase 6: Guide (Summary + Next Steps)

Summarize the learning experience, connect it to the broader epistemic workflow, and provide actionable next steps.

1. **Learning summary**:
   - Protocols experienced (trial) and tested (quiz)
   - Quiz accuracy + key distinctions learned
   - Personalized strength: "You naturally recognize [pattern] — `/X` formalizes this"

2. **Epistemic Map** (connect the dots):

   Present the Epistemic Concern Clusters from `references/workflow.md`. Highlight protocols the user experienced with emphasis (e.g., bold or `★`).

3. **Report CTA**: "Run `/report` for a comprehensive analysis with evidence-backed recommendations and an HTML profile."

4. **Next protocol suggestion**: Based on quiz results and MAP data, suggest the next protocol to explore — preferring related protocols in the same cluster.

5. **Advanced Usage** (bonus tips after main guide):

   Present 3-5 tips from `references/advanced-usage.md` (protocol chaining, multi-protocol sessions, invocation techniques, etc.), prioritizing tips related to protocols from TRIAL and QUIZ. If they quizzed on `/gap` vs `/attend`, show the three-step chain: context → decision audit → risk-aware execution (inquire → gap → attend).

6. **Continue exploring** (when MAP results contain unexplored protocols):

   Call AskUserQuestion:
   - Text: "Want to experience another protocol?"
   - Options: "Yes — show me another" / "Done — I have enough"

   If "Yes" → return to Phase 3, using the next recommended protocol from MAP results.

## Quiz Design

**Difficulty progression**: Start with high-contrast pairs (e.g., `/goal` vs `/attend`), progress to subtle distinctions (e.g., `/clarify` vs `/goal`, `/gap` vs `/attend`).

**Distractor selection**: Choose protocols that share surface similarity with the correct answer:
- `/clarify` ↔ `/gap`: both surface "something wrong" but different targets — `/clarify` fixes expression before work begins (Planning: "I said X but meant Y"), `/gap` audits blind spots at a decision point (Decision: "Am I overlooking something?")
- `/clarify` ↔ `/goal`: both about "unclear starting point" but different deficits (expression vs. existence)
- `/gap` ↔ `/attend`: both about risk awareness but different timing (`/gap` audits before action, `/attend` gates during execution)
- `/inquire` ↔ `/contextualize`: both about "context" but different timing (pre vs. post execution)
- `/frame` ↔ `/ground`: both about structuring how to think about a problem, but different operations (lens selection vs. mapping validation)
- `/bound` ↔ `/inquire`: both pre-execution and AI-directed, but different targets (ownership boundaries vs. missing context)

**Path-specific question counts**:
- **Targeted**: 2-3 binary + 1 reverse + 1 design = 4-5 questions
- **General**: 3-4 situation + 1 design = 4-5 questions

## AskUserQuestion Budget

Quick path targets 3-4 calls. Targeted path targets 6-12 calls.

| Phase | Calls (Quick) | Calls (Targeted) | Purpose |
|-------|---------------|-------------------|---------|
| 0. Entry | 1 | 2-3 | Path + protocol + session source |
| 2b. Evidence | 1 | — | Trial confirmation |
| 3. Scenario | — | 1-2 | Navigation after scenario text |
| 4. Trial | 1 | 0 | Quick: situation choice. Targeted: direct entry |
| 4→Q. Next | 1 | — | Quick: post-trial navigation |
| 4→5 LOOP | — | 1 | Targeted: post-trial navigation |
| 5. Quiz | — | 4-7 | MC/design or binary/reverse/design + reasoning inquiry |
| 6. Guide | — | 0-1 | Optional continue exploring |

## Rules

1. **Value before learning**: Quick path proves value in under 3 minutes. Learning (scenarios, quizzes) is available but not the default entry.
2. **One at a time**: Quick path shows 1 recommendation, 1 evidence card, 1 trial. Never present multiple recommendations or ranked lists.
3. **Conservative auto-recommend pool**: Only `/goal`, `/gap`, `/frame` are auto-recommended. User-initiated protocols (`/clarify`, `/grasp`) and specialized protocols are excluded from proactive suggestion.
4. **Experience over analysis**: This skill teaches through doing. Analytical output (HTML reports, pattern evidence tables) belongs in `/report`.
5. **Privacy**: Never transmit session data externally. All analysis runs locally.
6. **No subagent delegation**: Both Quick and Targeted paths use inline Quick Scan. Deep pattern extraction belongs in `/report`.
7. **Trial authenticity**: Trial phase must execute the actual protocol, not simulate it. The user invokes the real slash command.
8. **Immediate feedback**: Quiz answers get instant feedback. For incorrect answers, reasoning inquiry precedes correction (per Feedback section). Never batch quiz results.
9. **No auto-install**: Guide installation but never install plugins automatically.
10. **Session index access**: Access `sessions-index.json` via Glob + Read. Parse `entries` for `firstPrompt` and `summary` fields only. Never Read entire session JSONL files.
11. **Preset as safety net**: `references/scenarios.md` ensures every user gets a complete experience regardless of session history availability.
12. **Single session**: The entire onboarding completes in one session. No cross-session state required.

## Acknowledgments

- [@zzsza](https://github.com/zzsza) — Quiz-based participatory UX design contribution
