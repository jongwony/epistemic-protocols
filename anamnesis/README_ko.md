# Anamnesis — /recollect (ἀνάμνησις)

모호한 회상을 인지된 맥락으로 해소 (ἀνάμνησις: 상기, 떠올리기)

> [English](./README.md)

## Anamnesis란?

플라톤 ἀνάμνησις(상기)의 현대적 재해석 — **지난 작업이 남긴 기록 — 대화, 바뀐 산출물과 그 변경 이력, 남겨 둔 결정 — 을 모호한 단서와 대조하여, 각 후보의 원기록에서 단서가 닿는 구간을 열고, 그 기록이 담은 것을 출처와 함께 들려주어 사용자가 올바른 과거 맥락을 직접 식별하게 하는** 프로토콜 — 키워드 매칭 결과나 인덱스의 요약을 돌려주는 것이 아니라.

### 핵심 문제

AI 시스템은 모호한 회상 신호(`RecallAmbiguous`)를 놓치기 쉽습니다 — 사용자는 어떤 과거 세션·결정·산출물이 지금 관련 있다는 감각은 있지만, 구체적으로 그것을 지칭할 수 없습니다. 단서가 충분히 특정되지 않은 상태에서 키워드 검색은 너무 많거나 너무 적은 결과를 반환하고, 올바른 과거 맥락에 닿기 전에 신호가 유실됩니다.

### 해결책

**출처로 근거 지어진 인지(Source-grounded recognition)**: AI가 발화와 쌓인 맥락에서 단서를 읽습니다 — 가리키는 과거, 그것이 이루는 단위, 그리고 거기에 닿을 축(시간, 사람, 산출물, 식별자, 만든 말). 그 축을 따라 과거를 담았을 기록을 찾고, 1순위 후보의 구성원마다 원기록에서 단서가 닿는 구간을 엽니다 — 산출물이면 그 구간의 변경 이력입니다. 그 이야기를 기록의 말로(origin → direction → outcome; 한 기록 위에서는 라인·토픽·개념의 형태로) 들려주되, 문장마다 열린 기록이 뒷받침하고 화자를 보존하며, 발췌마다 출처와 resume 핸들을 붙여 보여 주고 턴을 넘깁니다. 사용자가 식별하거나 — "맞다"고 하거나 그 과거로 받아 이어가거나 — 자기 말로 단서를 더하면 검색이 다시 돕니다. 교정 횟수로 회상이 끝나지는 않습니다. 인덱스의 요약은 회상을 깨우는 단서일 뿐 증거가 아니며, 증거는 열린 기록이고, 식별은 사용자의 것입니다.

Claude Code와 Codex의 기록이 모두 있으면 함께 검색하며, 지금 설정 디렉터리의 뿌리에서 시작합니다. 옮겨 둔 이전 설정 같은 다른 뿌리는 회상이 그곳을 가리킬 때 찾고, 모든 후보에 런타임과 뿌리를 표시합니다. 이름이 정해진 기록의 정해진 구간을 읽는 일과 이미 경계가 정해진 범위에서 후보를 찾는 일은 묻지 않고 하며, 그 경계를 넘는 검색은 비용과 함께 제안하고 사용자의 말이 있을 때만 합니다.

### Codex 캡처 라이프사이클

공유 플러그인 훅은 Codex의 Stop, PreCompact, SessionEnd 이벤트를 `$CODEX_HOME/hypomnesis` 아래 fire-and-forget queue에 기록합니다. 분리된 worker는 transcript revision별로 이벤트를 합치고 `gpt-5.6-luna`를 `xhigh`로 실행해 compact record 하나를 추출한 다음, immutable generation을 쓰고 session pointer를 원자적으로 전환합니다. 중첩 추출은 ephemeral이며 hooks를 비활성화합니다. `agents/openai.yaml`은 skill discovery metadata만 제공하고, 훅 등록은 `hooks/hooks.json`에 남습니다.

### 캡처 결과와 읽기 가능성

캡처는 최신 시도의 결과를 의미 인덱스와 별도로 기록합니다. `/recollect`는 검색한 세션의 결과를 읽어, 검증된 빈 추출·실패하거나 미완료인 시도·부분 발행·이전 발행물의 보존을 해당 출처에 맞춰 설명합니다. 결과 기록이 없거나 읽을 수 없으면 상태 미상으로 남으며, 기존 인덱스는 계속 회상에 참여합니다.

```text
세션 원기록 → 추출 → 검증된 의미 산출물 → 회상 후보
                └→ 캡처 결과 ─────────→ 검색 범위의 한계 설명
세션 원기록 ──────────────────────────→ 인지의 근거
```

캡처 결과는 각 런타임의 Hypomnesis 저장소 아래 `.outcomes/`에 있으며 의미 검색에서 제외됩니다. [공유 결과 리더](skills/recollect/scripts/hypomnesis-outcome.mjs)가 기록된 발행물을 검증하고, [런타임 읽기 계약](skills/recollect/references/capture-outcome.md)이 그 사용법을 정합니다. 캡처 결과는 실행과 발행, 그리고 추출기마다의 상태와 — 기록된 경우 — 원본 중 받지 못한 양을 설명합니다. 어느 것도 의미 인덱스의 완전성을 보장하지 않습니다. 결과는 런타임·저장소 뿌리·세션 정체성이 모두 맞을 때만 기록에 연관합니다.

저장소 루트에서 생산과 읽기를 함께 검증합니다.

```bash
node --test anamnesis/scripts/hypomnesis-write.test.mjs anamnesis/scripts/hypomnesis-codex-write.test.mjs
```

### 다른 프로토콜과의 차이

| 프로토콜 | 개시자 | 타입 시그니처 |
|----------|--------|---------------|
| Aitesis | AI-guided | `ContextInsufficient → SufficientContext` |
| **Anamnesis** | **AI-guided** | **`RecallAmbiguous → RecalledContext`** |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |
| Periagoge | AI-guided | `AbstractionInProcess → CrystallizedAbstraction` |

**Anamnesis vs Aitesis** — 가장 가까운 이웃. 둘 다 정보 접근을 다루지만, 현상학적 판별이 다릅니다. Aitesis는 사용자가 알지 못하는 사실을 발견합니다(`ContextInsufficient` — "정보가 필요하다"). Anamnesis는 사용자가 존재한다는 것은 어렴풋이 아는 맥락을 확인합니다(`RecallAmbiguous` — "이거 어디서 다뤘던 것 같은데"). 충족을 기다리는 빈 지향(empty intention)이면 Anamnesis; 해당 주제에 지향 자체가 없으면 Aitesis.

**Anamnesis vs Periagoge** — 한 세션 위의 경계. 과거 세션이 이미 정착시킨 개념은 여기서 한 세션 위의 단위로 인지되고, 아직 이름 붙지 않은 사례들에서 형성 중인 개념은 Periagoge(`/induce`)가 결정화합니다. 정착한 것의 인지 → Anamnesis; 아직 이름 없는 것의 형성 → Periagoge.

## 프로토콜 흐름

```
Activation → 사용자의 호출, 또는 빈 지향 감지 (silent)
Pass       → 단서·단위·축을 읽음; 정해진 경계 안에서 검색; 1순위 후보의 기록을 단서가 닿는 구간에서 엶
Round      → 기록의 말로 된 이야기를 발췌마다 출처·resume 핸들과 함께 보여 주고 턴을 넘김; 제시할 것이 없으면 열린 질문 하나, 그다음 비용과 함께 더 넓은 검색을 제안
Close      → 사용자가 식별 → RecalledContext; 사용자가 멈춤 → 찾은 범위 보고; 더 찾을 만한 것이 없음 → 찾은 범위 안 미해결; 그 밖의 말은 더해진 단서 → 다음 pass
```

## 단서의 축

단서는 과거에 닿을 축을 알려 주며, 정해진 목록은 없습니다. 시간, 사람이나 시스템, 산출물이나 경로, 식별자(이슈, PR, 커밋, 세션 id), 만든 말, 드문 사건 — 사용자의 말이 담은 축을 따라갑니다. 식별자는 그것이 가리키는 대상의 종류가 단서가 말하는 것과 맞을 때만 후보의 닻이 됩니다. 저장소 이름 없는 번호는 주변 기록에서 저장소를 읽기 전까지 아무 저장소도 가리키지 않습니다.

## 사용 시점

**사용하세요**:
- 과거 세션·결정이 지금 관련 있다는 감각은 있지만 지칭할 수 없을 때
- 메모리 키워드 검색이 너무 많거나 너무 적은 결과를 반환할 때
- 단서가 구조화되지 않은 현상학적 형태("그때 얘기했던 그거…")일 때
- 다음 단계가 어떤 과거 맥락을 이어받느냐에 달려 있을 때
- 기억나는 것이 한 세션이 아니라 여러 세션에 걸친 작업 라인, 흩어진 조각으로 정리한 토픽, 과거 세션이 이미 정착시킨 개념일 때 — 같은 회상을 한 세션 위의 단위로 풀어낸다

**건너뛰세요**:
- 이미 세션 ID, 파일 경로, 결정을 알고 있을 때 — 직접 조회가 더 저렴
- 과거 맥락 자체가 존재하지 않을 때 (새로운 도메인 — Aitesis `/inquire` 사용)
- 개념이 아직 형성 전이라 사례에서 결정화해야 할 때 (Periagoge `/induce` 사용)
- 요청이 기억이 아닌 생성일 때

## 설치

Claude Code:

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install anamnesis@epistemic-protocols
```

Codex:

```
codex plugin marketplace add https://github.com/jongwony/epistemic-protocols.git
codex plugin add anamnesis@epistemic-protocols
```

Then review and trust the plugin's hooks — installing a plugin does not trust
them, and Codex skips a plugin-bundled hook until its current definition is
trusted, so capture stays off until this step is done:

```
/hooks
```

Codex records trust against the hook definition's hash, so this recurs whenever
the plugin's hooks change. Codex prints a startup warning when hooks are waiting
for review.

## 사용법

```
/recollect [모호한 단서 — 키워드, 단편, 또는 설명]
```

## 저자

Jongwon Choi (https://github.com/jongwony)
